/**
 * Storylets: elegibilidade, instância (storylet + papel), aplicação sem
 * escolha e apresentação com escolha. Evento, ação e ação de personagem
 * passam todos por aqui.
 */
import { lerCaminho } from './campos.ts';
import { atende, motivoBloqueio } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { tipoDe } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { aplicarEfeitos, type ContextoEfeito } from './efeitos.ts';
import type { Resultado, Storylet, Teste } from './esquema.ts';
import { lancar, novaEntrada } from './livro.ts';
import { morrerSePreciso } from './morte.ts';
import { aleatorio } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Causa, Entrada, EstadoVida, Mudanca, OpcaoPendente, TipoEntrada } from './tipos.ts';

/** Anos mínimos entre repetições de um storylet repetível sem intervalo próprio. */
export const INTERVALO_PADRAO = 5;

export function instanciaDe(s: Storylet, ator?: string): string {
  return ator ? `${s.id}#${ator}` : s.id;
}

const aceitaMortoCache = new WeakMap<Storylet, boolean>();

/** Storylets que falam de quem já morreu pedem isso nas condições; os outros exigem o ator vivo. */
function aceitaMorto(s: Storylet): boolean {
  let r = aceitaMortoCache.get(s);
  if (r === undefined) {
    const cond = s.condicoes;
    r = cond !== undefined && ('ator.vivo' in cond || (cond.marcas ?? []).includes('ator.faleceu') || (cond.marcaHa ?? []).some((m) => m.marca === 'ator.faleceu'));
    aceitaMortoCache.set(s, r);
  }
  return r;
}

/** Papéis que podem ocupar o ator agora (sem ator: um só candidato, `undefined`). */
export function atoresPossiveis(s: Storylet, e: EstadoVida): (string | undefined)[] {
  if (!s.ator) return [undefined];
  const mortos = aceitaMorto(s);
  return s.ator.filter((p) => {
    const en = e.entidades[p];
    return en !== undefined && (mortos || en.vivo !== false);
  });
}

export function elegivel(s: Storylet, e: EstadoVida, ator: string | undefined): boolean {
  if (s.idade && (e.idade < s.idade[0] || e.idade > s.idade[1])) return false;
  const vezes = e.vistos[instanciaDe(s, ator)];
  if (vezes && vezes.length > 0) {
    const ultima = vezes[vezes.length - 1]!;
    if (tipoDe(s) === 'acao') {
      if (s.intervalo && e.idade - ultima < s.intervalo) return false;
    } else {
      if (!s.repetivel) return false;
      if (e.idade - ultima < (s.intervalo ?? INTERVALO_PADRAO)) return false;
    }
  }
  return atende(s.condicoes, e, ator);
}

function marcarVisto(e: EstadoVida, s: Storylet, ator: string | undefined): void {
  (e.vistos[instanciaDe(s, ator)] ??= []).push(e.idade);
}

export function chanceDeSucesso(teste: Teste, e: EstadoVida, ator?: string): number {
  if (teste.chance !== undefined) return teste.chance;
  const v = lerCaminho(e, teste.atributo ?? 'saude', ator);
  const valor = typeof v === 'number' ? v : 0;
  return Math.min(0.95, Math.max(0.05, 0.5 + (valor - (teste.dificuldade ?? 50)) / 50));
}

function tipoEntradaDe(s: Storylet): TipoEntrada {
  const t = tipoDe(s);
  return t === 'acao' ? 'acao' : t === 'npc' ? 'npc' : 'evento';
}

export interface Extras {
  causas?: number[];
  inflacao?: number | undefined;
  /** A mesma ação do ano passado: o texto vira uma linha curta ("Estudou para as provas, mais um ano."). */
  repeticao?: boolean;
}

/**
 * Storylet sem escolha: aplica os efeitos (e o teste, se houver) e lança a
 * entrada no livro com a causa dada (diretor, personagem ou ação).
 */
export function aplicarStorylet(e: EstadoVida, c: Conteudo, s: Storylet, ator: string | undefined, causa: Causa, extras: Extras = {}): Entrada {
  marcarVisto(e, s, ator);
  const entrada = novaEntrada(e, {
    tipo: tipoEntradaDe(s),
    causa,
    ref: s.id,
    instancia: instanciaDe(s, ator),
    texto: '',
    ...(ator ? { ator } : {}),
  });
  const reg: Mudanca[] = [];
  const ef: ContextoEfeito = { origem: entrada.id, ator, reg, valores: { ...s.valores } };
  aplicarEfeitos(e, c, s.efeitos, ef);
  const op = { ator, valores: ef.valores, trechos: s.trechos };
  entrada.texto = extras.repeticao
    ? `${capitalizar(renderizar(s.resumo, contexto(e, op)))}, mais um ano.`
    : capitalizar(renderizar(s.texto, contexto(e, op)));
  let resumo = s.resumo;
  let morte = s.efeitos?.morte;
  if (s.teste) {
    const r: Resultado = (aleatorio(e.rng) < chanceDeSucesso(s.teste, e, ator) ? s.sucesso : s.fracasso)!;
    aplicarEfeitos(e, c, r.efeitos, ef);
    entrada.resultado = capitalizar(renderizar(r.texto, contexto(e, op)));
    if (r.resumo) resumo = r.resumo;
    morte ??= r.efeitos?.morte;
  }
  entrada.resumo = renderizar(resumo, contexto(e, op));
  const causas = [...new Set(extras.causas ?? [])];
  if (causas.length > 0) entrada.causas = causas;
  if (extras.inflacao !== undefined) entrada.inflacao = extras.inflacao;
  lancar(e, entrada, reg);
  morrerSePreciso(e, c, morte, entrada.id);
  return entrada;
}

/** Storylet com escolha: vira a pendência que o jogador responde. */
export function apresentarStorylet(
  e: EstadoVida,
  s: Storylet,
  ator: string | undefined,
  causa: 'diretor' | 'npc',
  causas: number[],
  inflacao?: number,
): void {
  marcarVisto(e, s, ator);
  const ctx = contexto(e, { ator, valores: s.valores, trechos: s.trechos });
  const opcoes: OpcaoPendente[] = (s.escolhas ?? []).map((esc) => {
    const disponivel = atende(esc.condicoes, e, ator);
    const opcao: OpcaoPendente = { texto: capitalizar(renderizar(esc.texto, ctx)), disponivel };
    if (!disponivel) {
      const motivo = esc.bloqueio ? renderizar(esc.bloqueio, ctx) : motivoBloqueio(esc.condicoes, e);
      if (motivo) opcao.motivo = motivo;
    }
    return opcao;
  });
  if (opcoes.length > 0 && !opcoes.some((o) => o.disponivel)) opcoes[0]!.disponivel = true;
  e.pendente = {
    storylet: s.id,
    instancia: instanciaDe(s, ator),
    causa,
    texto: capitalizar(renderizar(s.texto, ctx)),
    causas: [...new Set(causas)],
    opcoes,
    ...(ator ? { ator } : {}),
    ...(inflacao !== undefined ? { inflacao } : {}),
  };
}

/** O jogador responde à pendência: efeitos da escolha, teste, desfecho e entrada no livro. */
export function escolher(e: EstadoVida, c: Conteudo, indice: number): void {
  const p = e.pendente;
  if (!p) throw new Error('Nenhuma escolha pendente.');
  const s = c.porId.get(p.storylet);
  if (!s?.escolhas) {
    // O conteúdo mudou desde o save: deixa a vida seguir.
    e.pendente = null;
    return;
  }
  const esc = s.escolhas[indice];
  const opcao = p.opcoes[indice];
  if (!esc || !opcao?.disponivel) throw new Error('Essa escolha não está disponível.');
  const ator = p.ator;
  const entrada = novaEntrada(e, {
    tipo: p.causa === 'npc' ? 'npc' : 'evento',
    causa: 'escolha',
    ref: s.id,
    instancia: p.instancia,
    texto: p.texto,
    ...(ator ? { ator } : {}),
    ...(p.causas.length > 0 ? { causas: p.causas } : {}),
    ...(p.inflacao !== undefined ? { inflacao: p.inflacao } : {}),
  });
  const reg: Mudanca[] = [];
  const ef: ContextoEfeito = { origem: entrada.id, ator, reg, valores: { ...s.valores } };
  aplicarEfeitos(e, c, esc.efeitos, ef);
  const resultado: Resultado = esc.teste
    ? (aleatorio(e.rng) < chanceDeSucesso(esc.teste, e, ator) ? esc.sucesso : esc.fracasso)!
    : esc.resultado!;
  aplicarEfeitos(e, c, resultado.efeitos, ef);
  const ctx = contexto(e, { ator, valores: ef.valores, trechos: s.trechos });
  entrada.resumo = renderizar(s.resumo, ctx);
  entrada.escolha = { indice, texto: opcao.texto, resumo: renderizar(resultado.resumo ?? esc.resumo, ctx) };
  entrada.resultado = capitalizar(renderizar(resultado.texto, ctx));
  e.pendente = null;
  lancar(e, entrada, reg);
  morrerSePreciso(e, c, resultado.efeitos?.morte ?? esc.efeitos?.morte, entrada.id);
}
