/**
 * Storylets: elegibilidade, instância (storylet + papel), aplicação sem
 * escolha e apresentação com escolha. Evento, ação e ação de personagem
 * passam todos por aqui.
 */
import { investidoDe, lerCaminho } from './campos.ts';
import { atende, motivoBloqueio } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { tipoDe } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { comRepeticao, decidir, porqueDaResposta, valorDoPedido, type Decisao } from './decisao.ts';
import { aplicarEfeitos, type ContextoEfeito } from './efeitos.ts';
import { reorganizarGrupo } from './empresa.ts';
import type { Escolha, Resultado, Storylet, Teste } from './esquema.ts';
import { definirNumero, lancar, novaEntrada } from './livro.ts';
import { morrerSePreciso } from './morte.ts';
import { VARIOS } from './constantes.ts';
import { temRelacao } from './relacoes.ts';
import { aleatorio } from './rng.ts';
import { capitalizar, formatarDinheiro, renderizar, type ContextoTexto } from './texto.ts';
import type { Causa, Entrada, EstadoVida, Mudanca, OpcaoPendente, TipoEntrada } from './tipos.ts';

/** Anos mínimos entre repetições de um storylet repetível sem intervalo próprio. */
export const INTERVALO_PADRAO = 5;

/**
 * O texto do desfecho. Se esse mesmo texto já apareceu nesta vida e o desfecho
 * tem `repete`, sai a versão curta ("Deu certo de novo.", "Calote outra vez."):
 * a linha do tempo não conta duas vezes, palavra por palavra, o que já contou.
 */
export function textoDoDesfecho(e: EstadoVida, r: Resultado, ctx: ContextoTexto): string {
  const inteiro = capitalizar(renderizar(r.texto, ctx));
  if (r.repete === undefined || !e.historico.some((h) => h.resultado === inteiro)) return inteiro;
  return capitalizar(renderizar(r.repete, ctx));
}

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
  // O conteúdo escreve "filho" (ou "irmao", "ex"); com mais de um, o storylet vale para cada um (instâncias diferentes).
  const papeis = s.ator.some((p) => VARIOS[p]) ? s.ator.flatMap((p): readonly string[] => VARIOS[p] ?? [p]) : s.ator;
  return papeis.filter((p) => {
    const en = e.entidades[p];
    return en !== undefined && (mortos || en.vivo !== false);
  });
}

export function elegivel(s: Storylet, e: EstadoVida, ator: string | undefined): boolean {
  if (s.idade && (e.idade < s.idade[0] || e.idade > s.idade[1])) return false;
  const vezes = e.vistos[instanciaDe(s, ator)];
  if (vezes && vezes.length > 0) {
    const ultima = vezes[vezes.length - 1]!;
    const t = tipoDe(s);
    if (t === 'acao' || t === 'jogada') {
      if (s.intervalo && e.idade - ultima < s.intervalo) return false;
    } else {
      if (!s.repetivel) return false;
      if (e.idade - ultima < (s.intervalo ?? INTERVALO_PADRAO)) return false;
    }
  }
  return atende(s.condicoes, e, ator);
}

export function marcarVisto(e: EstadoVida, s: Storylet, ator: string | undefined): void {
  (e.vistos[instanciaDe(s, ator)] ??= []).push(e.idade);
}

/**
 * A decisão da pessoa num teste `decide` (decisao.ts): o estado e a memória dela, o dinheiro que o desfecho bom tira
 * dela e a insistência (o mesmo pedido, à mesma pessoa, nos últimos dois anos).
 */
export function decisaoDoTeste(e: EstadoVida, c: Conteudo, teste: Teste, ator: string, sucesso: Resultado | undefined, instancia?: string): Decisao {
  const pedido = teste.decide!;
  const d = decidir(e, c, ator, pedido, valorDoPedido(sucesso?.efeitos, e, ator), teste.ajuste ?? 0);
  if (instancia === undefined) return d;
  const antes = (e.vistos[instancia] ?? []).filter((i) => i < e.idade && i >= e.idade - 2).length;
  if (antes === 0) return d;
  let ultima: number | undefined;
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.instancia === instancia && h.idade < e.idade) {
      ultima = h.id;
      break;
    }
  }
  return comRepeticao(d, pedido, antes, ultima);
}

/** A chance do desfecho bom: a sorte, um atributo contra a dificuldade, ou a pessoa que decide (com o conteúdo e o ator). */
export function chanceDeSucesso(teste: Teste, e: EstadoVida, ator?: string, c?: Conteudo, sucesso?: Resultado): number {
  if (teste.decide) return c && ator ? decisaoDoTeste(e, c, teste, ator, sucesso).chance : 0.5;
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
  /** Quem contou o segredo (a revelação agendada com a fonte): o texto chama essa pessoa de {fonte}. */
  fonte?: string;
}

/**
 * Contato é chegar perto: quem ganhou vínculo com o que aconteceu (a visita, a ligação, o almoço de domingo, o pedido de
 * desculpas aceito). Os anos sem se falar zeram, na mesma entrada. Ignorar a ligação não é contato; a briga, se for,
 * diz no conteúdo ("ator.sem_contato": { "definir": 0 }).
 */
function contato(e: EstadoVida, reg: Mudanca[]): void {
  const quem = new Set<string>();
  for (const m of reg) if (m.d !== undefined && m.d > 0 && m.r !== 'papel' && m.c.endsWith('.vinculo')) quem.add(m.c.slice(0, -'.vinculo'.length));
  for (const id of quem) {
    const en = e.entidades[id];
    if (temRelacao(id, en) && en.vivo !== false && (en.n['sem_contato'] ?? 0) > 0) definirNumero(e, reg, id, 'sem_contato', 0);
  }
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
  const op: { ator: string | undefined; valores: Record<string, number> | undefined; trechos: Storylet['trechos']; apelidos: Record<string, string> | undefined; textos?: Record<string, string> } = {
    ator,
    valores: ef.valores,
    trechos: s.trechos,
    apelidos: extras.fonte ? { fonte: extras.fonte, ...ef.criados } : ef.criados,
  };
  entrada.texto = extras.repeticao
    ? `${capitalizar(renderizar(s.resumo, contexto(e, op)))}, mais um ano.`
    : capitalizar(renderizar(s.texto, contexto(e, op)));
  let resumo = s.resumo;
  let morte = s.efeitos?.morte;
  let porque: number | undefined;
  if (s.teste) {
    const d = s.teste.decide && ator ? decisaoDoTeste(e, c, s.teste, ator, s.sucesso, instanciaDe(s, ator)) : null;
    const sim = aleatorio(e.rng) < (d ? d.chance : chanceDeSucesso(s.teste, e, ator));
    const r: Resultado = (sim ? s.sucesso : s.fracasso)!;
    // O porquê é decidido antes dos efeitos: é o que a pessoa pesou ao responder, não o que mudou depois.
    if (d && s.teste.decide && ator) {
      const p = porqueDaResposta(e, c, ator, s.teste.decide, d, sim);
      op.textos = { porque: p.texto };
      porque = p.entrada;
      entrada.resposta = sim ? 'sim' : 'nao';
    }
    aplicarEfeitos(e, c, r.efeitos, ef);
    entrada.resultado = textoDoDesfecho(e, r, contexto(e, op));
    if (r.resumo) resumo = r.resumo;
    morte ??= r.efeitos?.morte;
  }
  entrada.resumo = renderizar(resumo, contexto(e, op));
  if (ef.criados?.['ator']) entrada.ator = ef.criados['ator'];
  const causas = [...new Set([...(porque !== undefined ? [porque] : []), ...(extras.causas ?? [])])];
  if (causas.length > 0) entrada.causas = causas;
  if (extras.inflacao !== undefined) entrada.inflacao = extras.inflacao;
  // Depois do texto (que ainda fala da empresa que saiu), outra do grupo toma o lugar dela.
  reorganizarGrupo(e, reg);
  contato(e, reg);
  lancar(e, entrada, reg);
  morrerSePreciso(e, c, morte, entrada.id);
  return entrada;
}

/** O que a escolha custa na hora: o dinheiro que sai e o capital de uma empresa aberta com ela. */
export function custoDaEscolha(esc: Escolha): number {
  return Math.max(0, -(esc.efeitos?.dinheiro ?? 0)) + (esc.efeitos?.abrirEmpresa?.capital ?? 0) + (esc.efeitos?.comprarTitulo?.valor ?? 0);
}

/**
 * As opções de um storylet agora: o texto, se dá para escolher e, se não, por
 * quê. Numa jogada, o preço também precisa estar na mão (conta e investimentos):
 * jogada não se faz no fiado.
 */
export function opcoesDe(e: EstadoVida, s: Storylet, ator: string | undefined, ctx = contexto(e, { ator, valores: s.valores, trechos: s.trechos })): OpcaoPendente[] {
  const eu = e.entidades['eu']!;
  const naMao = tipoDe(s) === 'jogada' ? Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu) : Infinity;
  return (s.escolhas ?? []).map((esc) => {
    const opcao: OpcaoPendente = { texto: capitalizar(renderizar(esc.texto, ctx)), disponivel: atende(esc.condicoes, e, ator) };
    if (!opcao.disponivel) {
      const motivo = esc.bloqueio ? renderizar(esc.bloqueio, ctx) : motivoBloqueio(esc.condicoes, e);
      if (motivo) opcao.motivo = motivo;
    } else if (custoDaEscolha(esc) > naMao + 0.5) {
      opcao.disponivel = false;
      opcao.motivo = `precisa de ${formatarDinheiro(custoDaEscolha(esc))} na mão`;
    }
    return opcao;
  });
}

/** Storylet com escolha: vira a pendência que o jogador responde. */
export function apresentarStorylet(
  e: EstadoVida,
  s: Storylet,
  ator: string | undefined,
  causa: 'diretor' | 'npc',
  causas: number[],
  inflacao?: number,
  fonte?: string,
): void {
  marcarVisto(e, s, ator);
  const ctx = contexto(e, { ator, valores: s.valores, trechos: s.trechos, apelidos: fonte ? { fonte } : undefined });
  const opcoes = opcoesDe(e, s, ator, ctx);
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
    ...(fonte ? { fonte } : {}),
  };
}

/** O que a entrada da escolha leva além do desfecho: de onde veio e o texto que o jogador viu. */
export interface BaseDaEscolha {
  tipo: TipoEntrada;
  ref: string;
  instancia: string;
  texto: string;
  /** O texto da opção como apareceu. */
  opcao: string;
  ator?: string | undefined;
  causas?: number[];
  inflacao?: number | undefined;
  /** Quem contou o segredo, na revelação ({fonte} no desfecho). */
  fonte?: string | undefined;
}

/** Aplica a escolha (efeitos certos, teste e desfecho) e lança a entrada no livro, com a causa do jogador. */
export function aplicarEscolha(e: EstadoVida, c: Conteudo, s: Storylet, indice: number, base: BaseDaEscolha): Entrada {
  const esc = s.escolhas![indice]!;
  const ator = base.ator;
  const entrada = novaEntrada(e, {
    tipo: base.tipo,
    causa: 'escolha',
    ref: base.ref,
    instancia: base.instancia,
    texto: base.texto,
    ...(ator ? { ator } : {}),
    ...(base.causas?.length ? { causas: base.causas } : {}),
    ...(base.inflacao !== undefined ? { inflacao: base.inflacao } : {}),
  });
  const reg: Mudanca[] = [];
  const ef: ContextoEfeito = { origem: entrada.id, ator, reg, valores: { ...s.valores } };
  // A pessoa decide pelo que viveu até aqui: antes dos efeitos certos da escolha (o pedido em si não pesa na resposta).
  const d = esc.teste?.decide && ator ? decisaoDoTeste(e, c, esc.teste, ator, esc.sucesso, base.instancia) : null;
  aplicarEfeitos(e, c, esc.efeitos, ef);
  let porque: { texto: string; entrada?: number } | undefined;
  let resultado: Resultado;
  if (esc.teste) {
    const sim = aleatorio(e.rng) < (d ? d.chance : chanceDeSucesso(esc.teste, e, ator));
    resultado = (sim ? esc.sucesso : esc.fracasso)!;
    if (d && esc.teste.decide && ator) {
      porque = porqueDaResposta(e, c, ator, esc.teste.decide, d, sim);
      entrada.resposta = sim ? 'sim' : 'nao';
    }
  } else resultado = esc.resultado!;
  aplicarEfeitos(e, c, resultado.efeitos, ef);
  if (porque?.entrada !== undefined) entrada.causas = [...new Set([porque.entrada, ...(entrada.causas ?? [])])];
  const apelidos = base.fonte ? { fonte: base.fonte, ...ef.criados } : ef.criados;
  const ctx = contexto(e, { ator, valores: ef.valores, trechos: s.trechos, apelidos, ...(porque ? { textos: { porque: porque.texto } } : {}) });
  entrada.resumo = renderizar(s.resumo, ctx);
  entrada.escolha = { indice, texto: base.opcao, resumo: renderizar(resultado.resumo ?? esc.resumo, ctx) };
  entrada.resultado = textoDoDesfecho(e, resultado, ctx);
  // O ex que voltou é o amor agora: a entrada fala dele pelo papel novo.
  if (ef.criados?.['ator']) entrada.ator = ef.criados['ator'];
  reorganizarGrupo(e, reg);
  contato(e, reg);
  lancar(e, entrada, reg);
  morrerSePreciso(e, c, resultado.efeitos?.morte ?? esc.efeitos?.morte, entrada.id);
  return entrada;
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
  e.pendente = null;
  aplicarEscolha(e, c, s, indice, {
    tipo: p.causa === 'npc' ? 'npc' : 'evento',
    ref: s.id,
    instancia: p.instancia,
    texto: p.texto,
    opcao: opcao.texto,
    ator: p.ator,
    causas: p.causas,
    inflacao: p.inflacao,
    fonte: p.fonte,
  });
}
