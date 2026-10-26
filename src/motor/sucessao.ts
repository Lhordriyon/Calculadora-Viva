/**
 * A sucessão (bloco F, I-106): a coroa do Brasil, o Regime e a ilha que quem joga fundou passam a quem continua a
 * história. Quem herda ganha a qualidade de sucessor (`principe`, `herdeiro_regime`, `herdeiro_ilha`) e o motor
 * agenda a resposta para o primeiro ano dele, ou para o ano em que ele faz 18 (até lá, a regência): a coroa e o
 * Regime viram um storylet de escolha (reinar, abdicar, acabar com ele), e a ilha passa sozinha aos 18. Vale também
 * quando quem reina morre durante a vida de quem joga (o pai ou a mãe de quem é príncipe). Enquanto a resposta não
 * vem, quem governava continua governando (pais.ts › quemGoverna): não há interregno.
 */
import type { Conteudo } from './conteudo.ts';
import { dotacaoDe } from './coroa.ts';
import { definirNumero, definirTexto, lancar, novaEntrada, perder } from './livro.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** A maioridade: antes dela, a coroa espera (a regência). */
export const MAIORIDADE = 18;

/** O que se herda: a qualidade de quem está na fila, o storylet da resposta (a ilha não tem: passa sozinha) e o cargo. */
export const SUCESSOES = {
  coroa: { sucessor: 'principe', evento: 'sucessao_coroa', cargo: 'rei', reina: 'monarca' },
  regime: { sucessor: 'herdeiro_regime', evento: 'sucessao_regime', cargo: 'ditador', reina: 'ditador' },
  ilha: { sucessor: 'herdeiro_ilha', evento: null, cargo: 'soberano', reina: 'micronacao' },
} as const;
export type Sucessao = keyof typeof SUCESSOES;

/** O que a pessoa (ou quem joga) carregava de coroa: pelo cargo, ou pela qualidade de quem reina (os pais de linhagem não têm cargo). */
export function sucessaoDe(en: Entidade): Sucessao | null {
  const cargo = en.t['cargo'] ?? '';
  if (cargo === 'rei' || (!cargo && en.q['monarca'])) return 'coroa';
  if (cargo === 'ditador' || (!cargo && en.q['ditador'])) return 'regime';
  if (cargo === 'soberano') return 'ilha';
  return null;
}

/** O ano em que a resposta vem: o de agora, ou o dos 18 de quem herda. */
function anoDaResposta(e: EstadoVida): number {
  return Math.max(e.ano, e.anoNascimento + MAIORIDADE);
}

/** Agenda a resposta da sucessão (uma por vez): o storylet da coroa ou do Regime; a ilha, a regra de coroa.ts aos 18. */
function agendar(e: EstadoVida, tipo: Sucessao, origem: number | null): void {
  const evento = SUCESSOES[tipo].evento;
  if (!evento || e.agenda.some((a) => a.evento === evento)) return;
  e.agenda.push({ evento, ano: anoDaResposta(e), origem });
}

/**
 * Quem reinava morreu durante a vida de quem joga (o pai ou a mãe de quem é príncipe ou herdeiro do Regime): a
 * resposta vem neste ano, ou aos 18. A morte é a causa.
 */
export function aoMorrerQuemReina(e: EstadoVida, morto: Entidade, causa: number): void {
  const eu = e.entidades['eu']!;
  for (const tipo of ['coroa', 'regime'] as const) {
    const s = SUCESSOES[tipo];
    if (morto.q[s.reina] && eu.q[s.sucessor] && !eu.q[s.reina]) agendar(e, tipo, causa);
  }
}

/**
 * A herança da coroa na vida nova (herdeiro.ts): quem continua a história, seja quem for (o testamento é a lei da
 * sucessão da dinastia), entra na fila com a abertura de causa, e a resposta fica agendada. Devolve a frase da
 * abertura.
 */
export function herdarACoroa(e: EstadoVida, morto: Entidade, abertura: number): string {
  const tipo = sucessaoDe(morto);
  if (!tipo || (tipo === 'ilha' && !e.entidades['ilha'])) return '';
  const eu = e.entidades['eu']!;
  eu.q[SUCESSOES[tipo].sucessor] = { v: 1, ano: e.ano, idade: e.idade, causa: abertura };
  agendar(e, tipo, abertura);
  const menor = e.idade < MAIORIDADE;
  const ilha = e.entidades['ilha']?.nome ?? 'a ilha';
  if (tipo === 'coroa') return menor ? `A coroa será sua aos ${MAIORIDADE}; até lá, a regência governa.` : 'A coroa é sua, e o Palácio espera a resposta.';
  if (tipo === 'regime') return menor ? `O Regime espera você fazer ${MAIORIDADE}; até lá, os generais mandam.` : 'O Regime é seu, e os generais esperam a resposta.';
  return menor ? `${ilha} será sua aos ${MAIORIDADE}; até lá, um conselho cuida dela.` : '';
}

/** A resposta da sucessão está marcada para este ano (ou atrasada): quem governava espera por ela (pais.ts). */
export function sucessaoPendente(e: EstadoVida): boolean {
  return e.agenda.some((a) => (a.evento === SUCESSOES.coroa.evento || a.evento === SUCESSOES.regime.evento) && a.ano <= e.ano);
}

/** "2.300": com ponto de milhar. */
const milhar = (v: number): string => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * A ilha passa sozinha (a etapa da coroa): quem herda é soberano no primeiro ano (com 18 anos ou mais) ou aos 18,
 * quando a regência acaba. A herança é a causa; a popularidade começa no crédito de quem assume.
 */
export function assumirAIlha(e: EstadoVida, c: Conteudo): void {
  const eu = e.entidades['eu']!;
  const fila = eu.q[SUCESSOES.ilha.sucessor];
  const ilha = e.entidades['ilha'];
  if (!fila || !ilha || e.idade < MAIORIDADE) return;
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'sucessao:ilha', texto: '', ...(fila.causa !== null ? { causas: [fila.causa] } : {}) });
  const mud: Mudanca[] = [];
  perder(e, mud, 'eu', SUCESSOES.ilha.sucessor);
  if (!eu.t['cargo']) {
    definirTexto(e, mud, 'eu', 'cargo', SUCESSOES.ilha.cargo);
    definirNumero(e, mud, 'eu', 'popularidade', Math.max(eu.n['popularidade'] ?? 50, 55));
    definirNumero(e, mud, 'eu', 'renda', Math.round(dotacaoDe(e, c, 'ilha')));
    entrada.texto = `Você assumiu a coroa de ${ilha.nome}: ${milhar(ilha.n['populacao'] ?? 0)} habitantes, um porto e a Constituição que alguém da família escreveu num guardanapo.`;
    entrada.resumo = `assumiu a coroa de ${ilha.nome}`;
  } else {
    entrada.texto = `A coroa de ${ilha.nome} chegou a você, mas o cargo que você tem não deixa reinar lá: a ilha seguiu com o conselho.`;
    entrada.resumo = `deixou a coroa de ${ilha.nome} com o conselho`;
  }
  lancar(e, entrada, mud);
}
