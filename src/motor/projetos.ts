/**
 * Os projetos (missão Ω3): o que quem joga quer da vida (sair das dívidas, a casa própria, um filho, o negócio próprio,
 * reparar uma relação…). O projeto é conteúdo (`mundo.json › projetos`): etapas que são condições do estado (o
 * andamento sai da vida, não de uma barra), o que ajuda em cada uma, a meta e o prazo. Começar e desistir são operações
 * (não gastam a ficha); o ano confere a meta e o prazo, e o fim (a conquista, o prazo vencido, a pessoa que morreu
 * antes) vira acontecimento no livro, com o começo de causa: o cartão da vida conta "aos 30, você pôs na cabeça comprar
 * a casa própria; aos 41, conquistou".
 *
 * O projeto ativo é a qualidade `projeto_<id>` de quem joga (com o ano e a entrada que o começou); o que é com alguém
 * marca a pessoa com a mesma qualidade e lê as condições com ela de ator.
 */
import { atende } from './condicoes.ts';
import { VARIOS } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefProjeto } from './esquema.ts';
import { ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { FELICIDADE_DA_CONQUISTA, FELICIDADE_DA_DESISTENCIA, FELICIDADE_DO_PRAZO_VENCIDO, MAX_PROJETOS, MAX_SONHOS } from './regras.ts';
import { temRelacao } from './relacoes.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

/** A qualidade do projeto, em quem joga e (com alguém) na pessoa. */
export const qualidadeDoProjeto = (id: string): string => `projeto_${id}`;

export interface ProjetoAtivo {
  def: DefProjeto;
  /** O ano em que começou (o prazo conta daqui). */
  desde: number;
  /** A entrada que o começou. */
  causa: number | null;
  /** Com alguém: o papel de quem a pessoa é hoje. */
  com?: string;
}

/** Os papéis concretos de um projeto com alguém ("irmao" vale para cada irmão). */
function papeisDe(def: DefProjeto): string[] {
  return (def.com ?? []).flatMap((p): readonly string[] => VARIOS[p] ?? [p]);
}

/** Quem é a pessoa do projeto: quem tem a qualidade dele (a mesma pessoa, se mudou de papel). */
function pessoaDo(e: EstadoVida, def: DefProjeto): string | undefined {
  const q = qualidadeDoProjeto(def.id);
  return papeisDe(def).find((papel) => (e.entidades[papel]?.q[q]?.v ?? 0) > 0);
}

export function projetosAtivos(e: EstadoVida, c: Conteudo): ProjetoAtivo[] {
  const eu = e.entidades['eu']!;
  const saida: ProjetoAtivo[] = [];
  for (const def of c.mundo.projetos) {
    const q = eu.q[qualidadeDoProjeto(def.id)];
    if (!q || q.v <= 0) continue;
    const com = def.com ? pessoaDo(e, def) : undefined;
    saida.push({ def, desde: q.ano, causa: q.causa, ...(com ? { com } : {}) });
  }
  return saida;
}

/** Cada etapa do projeto e se ela já está feita (o estado de agora diz). */
export function etapasDe(e: EstadoVida, p: Pick<ProjetoAtivo, 'def' | 'com'>): { texto: string; feita: boolean; ajuda: readonly string[] }[] {
  const ctx = contexto(e, { ator: p.com });
  return p.def.etapas.map((x) => ({ texto: capitalizar(renderizar(x.texto, ctx)), feita: atende(x.feita, e, p.com), ajuda: x.ajuda ?? [] }));
}

/** O nome e o objetivo do projeto, com a pessoa (quando é com alguém). */
export function nomeDoProjeto(e: EstadoVida, def: DefProjeto, com?: string): { nome: string; objetivo: string } {
  const ctx = contexto(e, { ator: com });
  return { nome: capitalizar(renderizar(def.nome, ctx)), objetivo: renderizar(def.objetivo, ctx) };
}

export interface ProjetoPossivel {
  def: DefProjeto;
  /** Com alguém: o papel da pessoa (um projeto possível por pessoa). */
  com?: string;
}

/**
 * Há vaga para mais um projeto deste tipo? Os planos práticos são no máximo MAX_PROJETOS de pé; os sonhos (bloco S1),
 * no máximo MAX_SONHOS, à parte: sonhar não tira a vaga da casa própria.
 */
export function temVaga(e: EstadoVida, c: Conteudo, def: Pick<DefProjeto, 'sonho'>): boolean {
  const ativos = projetosAtivos(e, c);
  return def.sonho ? ativos.filter((p) => p.def.sonho).length < MAX_SONHOS : ativos.filter((p) => !p.def.sonho).length < MAX_PROJETOS;
}

/** Os projetos que dá para começar agora: a idade, a condição, a meta ainda por fazer, e a vaga (planos e sonhos à parte). */
export function projetosPossiveis(e: EstadoVida, c: Conteudo): ProjetoPossivel[] {
  if (!e.vivo) return [];
  const eu = e.entidades['eu']!;
  const saida: ProjetoPossivel[] = [];
  const vaga = { plano: temVaga(e, c, {}), sonho: temVaga(e, c, { sonho: true }) };
  for (const def of c.mundo.projetos) {
    if (!(def.sonho ? vaga.sonho : vaga.plano)) continue;
    if ((eu.q[qualidadeDoProjeto(def.id)]?.v ?? 0) > 0) continue;
    if (e.idade < def.idade[0] || e.idade > def.idade[1]) continue;
    if (!def.com) {
      if (atende(def.quando, e) && !atende(def.meta, e)) saida.push({ def });
      continue;
    }
    for (const papel of papeisDe(def)) {
      const en = e.entidades[papel];
      if (!temRelacao(papel, en) || en.vivo === false) continue;
      if (atende(def.quando, e, papel) && !atende(def.meta, e, papel)) saida.push({ def, com: papel });
    }
  }
  return saida;
}

// ---------------------------------------------------------------- as operações: começar e desistir

export type OperacaoProjeto = { tipo: 'comecar_projeto'; id: string; com?: string } | { tipo: 'desistir_projeto'; id: string };

export function ehOperacaoDeProjeto(op: { tipo: string }): op is OperacaoProjeto {
  return op.tipo === 'comecar_projeto' || op.tipo === 'desistir_projeto';
}

export function motivoParaNaoOperarProjeto(e: EstadoVida, c: Conteudo, op: OperacaoProjeto): string | null {
  const def = c.mundo.projetos.find((p) => p.id === op.id);
  if (!def) return 'esse projeto não existe';
  const ativo = projetosAtivos(e, c).find((p) => p.def.id === op.id);
  if (op.tipo === 'desistir_projeto') return ativo ? null : 'esse projeto não está de pé';
  if (ativo) return 'esse projeto já está de pé';
  if (!temVaga(e, c, def)) return def.sonho ? `no máximo ${MAX_SONHOS} sonhos ao mesmo tempo` : `no máximo ${MAX_PROJETOS} planos ao mesmo tempo`;
  const possivel = projetosPossiveis(e, c).some((p) => p.def.id === op.id && p.com === op.com);
  return possivel ? null : def.com && !op.com ? 'escolha com quem' : 'esse projeto não faz sentido agora';
}

export function operarProjeto(e: EstadoVida, c: Conteudo, op: OperacaoProjeto, reg: Mudanca[], origem: number): { texto: string; resumo: string; causas?: number[] } {
  const def = c.mundo.projetos.find((p) => p.id === op.id)!;
  const q = qualidadeDoProjeto(def.id);
  if (op.tipo === 'comecar_projeto') {
    ganhar(e, reg, 'eu', q, origem);
    if (op.com) ganhar(e, reg, op.com, q, origem);
    const { objetivo } = nomeDoProjeto(e, def, op.com);
    return { texto: `Você pôs na cabeça ${objetivo}, e deu a si mesm${e.entidades['eu']!.genero === 'f' ? 'a' : 'o'} ${def.prazo} anos.`, resumo: `pôs na cabeça ${objetivo}` };
  }
  const ativo = projetosAtivos(e, c).find((p) => p.def.id === op.id)!;
  const ctx = contexto(e, { ator: ativo.com });
  perder(e, reg, 'eu', q);
  if (ativo.com) perder(e, reg, ativo.com, q);
  somar(e, reg, 'eu', 'felicidade', FELICIDADE_DA_DESISTENCIA);
  return {
    texto: capitalizar(renderizar(def.desistencia.texto, ctx)),
    resumo: renderizar(def.desistencia.resumo, ctx),
    ...(ativo.causa !== null ? { causas: [ativo.causa] } : {}),
  };
}

// ---------------------------------------------------------------- o ano dos projetos

type Fim = 'conquista' | 'vencido' | 'semTempo';

/** O fim do projeto vira acontecimento, com o começo de causa; a qualidade sai de quem joga e da pessoa. */
function terminar(e: EstadoVida, p: ProjetoAtivo, fim: Fim): void {
  const textos = fim === 'conquista' ? p.def.conquista : fim === 'semTempo' ? (p.def.semTempo ?? p.def.vencido) : p.def.vencido;
  const entrada = novaEntrada(e, {
    tipo: 'evento',
    causa: 'regra',
    ref: `regra:projeto_${fim}`,
    instancia: `projeto:${p.def.id}#${fim}`,
    texto: '',
    ...(p.com ? { ator: p.com } : {}),
    ...(p.causa !== null ? { causas: [p.causa] } : {}),
  });
  const ctx = contexto(e, { ator: p.com });
  entrada.texto = capitalizar(renderizar(textos.texto, ctx));
  entrada.resumo = renderizar(textos.resumo, ctx);
  const reg: Mudanca[] = [];
  const q = qualidadeDoProjeto(p.def.id);
  perder(e, reg, 'eu', q);
  if (p.com) perder(e, reg, p.com, q);
  somar(e, reg, 'eu', 'felicidade', fim === 'conquista' ? FELICIDADE_DA_CONQUISTA : FELICIDADE_DO_PRAZO_VENCIDO);
  lancar(e, entrada, reg);
}

/**
 * O ano dos projetos (uma etapa do ano, depois da carreira e do poder): a meta alcançada é conquista, o prazo
 * passado é fracasso, e a pessoa que morreu antes leva o projeto junto. Quem saiu da vida (sem ninguém com a
 * qualidade) também encerra, calado.
 */
/**
 * O sonho começa por uma escolha (o efeito `sonhar`, bloco S1): o projeto com `sonho` vira de quem joga, com a escolha
 * de causa, se não estiver de pé e houver vaga entre os sonhos (MAX_SONHOS).
 */
export function sonhar(e: EstadoVida, c: Conteudo, reg: Mudanca[], id: string, origem: number): void {
  const def = c.mundo.projetos.find((p) => p.id === id);
  const q = qualidadeDoProjeto(id);
  if (!def?.sonho || e.entidades['eu']?.q[q] || !temVaga(e, c, def)) return;
  ganhar(e, reg, 'eu', q, origem);
}

export function anoDosProjetos(e: EstadoVida, c: Conteudo): void {
  if (!e.vivo) return;
  for (const p of projetosAtivos(e, c)) {
    if (p.def.com && !p.com) {
      const reg: Mudanca[] = [];
      perder(e, reg, 'eu', qualidadeDoProjeto(p.def.id));
      lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'regra:projeto_saiu', texto: '' }), reg);
      continue;
    }
    if (p.com && e.entidades[p.com]!.vivo === false) terminar(e, p, 'semTempo');
    else if (atende(p.def.meta, e, p.com)) terminar(e, p, 'conquista');
    else if (e.ano - p.desde >= p.def.prazo) terminar(e, p, 'vencido');
  }
}
