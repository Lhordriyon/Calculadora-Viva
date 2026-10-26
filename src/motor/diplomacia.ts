/**
 * O mundo lá fora. Quatro países fictícios (mundo.json › estrangeiros), cada
 * um uma entidade com a economia dele (`crescimento`) e a relação com o
 * Brasil (`relacao`, de 0 a 100). Todo ano, antes do país daqui:
 *
 * - a economia de cada um anda, com a sorte que o mundo divide e as crises e
 *   os booms de lá (notícias na linha do tempo);
 * - a relação anda para onde o governo daqui a puxa (de quem ele se aproxima,
 *   a tarifa na fronteira), com sorte; relação ruim vira sanção, boa vira
 *   acordo, e as duas acabam quando a relação muda;
 * - daí sai o que chega aqui: o que o mundo compra do Brasil, o choque da
 *   crise ou do boom de lá (a notícia vira a causa da virada da fase daqui),
 *   o peso das sanções e dos acordos e o dólar, que anda com o mundo, com a
 *   dívida e com os juros daqui.
 *
 * O dólar pesa na inflação, no investimento em dólar e nas empresas dos
 * setores que exportam ou importam. Quem governa (presidente, monarca, chefe
 * do Regime) faz um ato por ano lá fora, pela folha País: aproximar-se de um
 * país (a relação sobe, a do rival dele cai), assinar um acordo ou romper.
 */
import { PARCEIROS, type Parceiro } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefEstrangeiro, Noticia } from './esquema.ts';
import { definirNumero, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { defGoverno, efeitoDasPoliticas, governoAtual, jogadorGoverna, motivoParaNaoGovernar, nivelDe, potencialDe } from './pais.ts';
import { novaEntidade } from './pessoas.ts';
import {
  ACORDO,
  ACORDO_NA_EMPRESA,
  ATO,
  CAMBIO_BASE,
  CHOQUE_DA_CRISE,
  CHOQUE_DO_BOOM,
  CHOQUE_LA_FORA,
  CRESCIMENTO_POTENCIAL,
  CUSTO_DA_SANCAO,
  DESVIO_DA_RELACAO,
  DESVIO_DO_CAMBIO,
  DESVIO_DO_MUNDO,
  DIVIDA_DE_EQUILIBRIO,
  DOLAR_NA_EMPRESA,
  GANHO_DO_ACORDO,
  JURO_REAL_NEUTRO,
  JUROS_MEDIOS,
  META_DE_INFLACAO,
  PERSISTENCIA_DE_FORA,
  PESO_CHEIO,
  PESO_DA_DEMANDA_EXTERNA,
  PESOS_DO_CAMBIO,
  POSTURA,
  PROTECAO_NA_EMPRESA,
  RELACAO_PARA_ACORDO,
  RITMO_DA_RELACAO,
  RITMO_DO_CAMBIO,
  SANCAO,
  SANCAO_NA_EMPRESA,
} from './regras.ts';
import { aleatorio, normal, sortear } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

const limitar = (v: number, min: number, max: number): number => (v < min ? min : v > max ? max : v);
const arred = (v: number): number => Math.round(v * 10) / 10 || 0;
const centavos = (v: number): number => Math.round(v * 100) / 100 || 0;

export function defEstrangeiro(c: Conteudo, id: string): DefEstrangeiro | undefined {
  return c.mundo.estrangeiros.find((x) => x.id === id);
}

/** Os países de fora que existem nesta vida, na ordem dos dados. */
export function parceirosDe(e: EstadoVida): Entidade[] {
  return PARCEIROS.map((id) => e.entidades[id]).filter((x): x is Entidade => x !== undefined);
}

/** "a Federação do Norte", "do Pacto do Sul": o país com o artigo certo. */
export function oPais(en: Pick<Entidade, 'nome' | 'genero'>, forma: 'a' | 'A' | 'da' | 'na' = 'a'): string {
  const artigos = { a: ['o', 'a'], A: ['O', 'A'], da: ['do', 'da'], na: ['no', 'na'] } as const;
  return `${artigos[forma][en.genero === 'm' ? 0 : 1]} ${en.nome}`;
}

/** O peso do país no que chega aqui: quem vende muito para ele sente inteiro; o menor, uma parte. */
const pesoDoChoque = (def: DefEstrangeiro): number => Math.min(1, def.peso / PESO_CHEIO);

/** Para onde a relação com um país anda: a de sempre, a postura de quem governa (de quem ele se aproxima) e a tarifa na fronteira. */
export function alvoDaRelacao(e: EstadoVida, c: Conteudo, def: DefEstrangeiro): number {
  return alvoCom(c, def, posturaDoGoverno(e, c));
}

/**
 * O que vale para todos os países no ano: a tarifa e de quem o governo de agora se aproxima. Sob o Regime, quem joga
 * governa com a postura dele: o golpe muda quem é amigo lá fora (e a sanção vem de quem ficou do outro lado).
 */
function posturaDoGoverno(e: EstadoVida, c: Conteudo): { tarifa: number; aproxima: readonly string[] } {
  const atual = governoAtual(e);
  const id = atual === 'voce' && e.entidades['pais']?.q['regime'] ? 'regime' : atual;
  return { tarifa: efeitoDasPoliticas(e, c, 'relacao'), aproxima: defGoverno(c, id)?.aproxima ?? [] };
}

function alvoCom(c: Conteudo, def: DefEstrangeiro, postura: { tarifa: number; aproxima: readonly string[] }): number {
  let alvo = def.relacao + postura.tarifa;
  if (postura.aproxima.includes(def.id)) alvo += POSTURA.amigo;
  else if (postura.aproxima.some((a) => defEstrangeiro(c, a)?.rival === def.id)) alvo += POSTURA.rival;
  return alvo;
}

/** A chance de um país sancionar o Brasil num ano: nenhuma acima do limite; abaixo, cresce com o quadrado da distância. */
export function chanceDeSancao(relacao: number): number {
  const x = Math.max(0, SANCAO.abaixo - relacao) / SANCAO.abaixo;
  return SANCAO.chance * x * x;
}

/** O mundo em que se nasce: a economia e a relação de cada país e o dólar, perto de onde o governo de agora os leva. */
export function exteriorInicial(e: EstadoVida, c: Conteudo): void {
  const r = e.rng;
  for (const def of c.mundo.estrangeiros) {
    const en = novaEntidade({ id: def.id, tipo: 'jurisdicao', nome: def.nome, genero: def.genero, vivo: true });
    en.t['produtos'] = def.produtos;
    en.n['crescimento'] = arred(def.crescimento + normal(r, 0, def.desvio));
    en.n['relacao'] = Math.round(limitar(alvoDaRelacao(e, c, def) + normal(r, 0, 6), 5, 95));
    e.entidades[def.id] = en;
  }
  e.entidades['pais']!.n['cambio'] = centavos(CAMBIO_BASE * Math.exp(normal(r, 0, 0.12)));
}

/** Uma vida de antes do mundo lá fora (save antigo): os países como os dados os descrevem e o dólar no lugar de sempre, sem sorteio. */
export function migrarExterior(e: EstadoVida, c: Conteudo): void {
  for (const def of c.mundo.estrangeiros) {
    if (e.entidades[def.id]) continue;
    const en = novaEntidade({ id: def.id, tipo: 'jurisdicao', nome: def.nome, genero: def.genero, vivo: true });
    en.t['produtos'] = def.produtos;
    en.n['crescimento'] = def.crescimento;
    en.n['relacao'] = Math.round(limitar(def.relacao, 5, 95));
    e.entidades[def.id] = en;
  }
  const pais = e.entidades['pais'];
  if (pais && pais.n['cambio'] === undefined) pais.n['cambio'] = CAMBIO_BASE;
}

/** Uma notícia do mundo lá fora, numa entrada visível do livro, com o país como ator. Devolve a entrada (ainda sem as mudanças lançadas). */
function noticia(e: EstadoVida, c: Conteudo, tipo: Noticia, parceiro: string, causas: number[] = []): ReturnType<typeof novaEntrada> {
  const n = c.mundo.noticias[tipo];
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `exterior:${tipo}:${parceiro}`, ator: parceiro, texto: '' });
  const ctx = contexto(e, { ator: parceiro });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, n.textos), ctx));
  entrada.resumo = renderizar(n.resumo, ctx);
  if (causas.length > 0) entrada.causas = causas;
  return entrada;
}

/**
 * Quem levou a relação com o país para onde ela foi (`para` baixo: a sanção, o
 * fim do acordo; `para` cima: o acordo, o fim da sanção). Primeiro, a decisão
 * sobre a relação com ele nos últimos dez anos, no mesmo sentido (o ato de
 * quem governa, uma escolha); senão, a que pôs no lugar a postura de agora
 * (a posse ou a reeleição do governo, a tarifa), de quando for, se ela puxa a
 * relação nesse sentido. Vira a causa da notícia.
 */
export function causaDaRelacao(e: EstadoVida, c: Conteudo, def: DefEstrangeiro, para: 'baixo' | 'cima'): number[] {
  const sinal = para === 'baixo' ? -1 : 1;
  const puxa = sinal * (alvoDaRelacao(e, c, def) - def.relacao) > 0;
  for (let k = e.historico.length - 1; k >= 0 && e.historico[k]!.ano >= e.ano - 10; k--) {
    const h = e.historico[k]!;
    if (h.mudancas?.some((m) => m.r === undefined && m.c === `${def.id}.relacao` && sinal * (m.d ?? 0) > 0)) return [h.id];
  }
  if (!puxa) return [];
  // A reeleição também conta: a posse de quem já governava não muda nada no livro, mas manteve a postura. O golpe (ou
  // o fim do Regime) também: sob o Regime, quem joga governa com a postura dele.
  const posseDeAgora = `governo:${governoAtual(e)}`;
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ref === posseDeAgora || h.mudancas?.some((m) => (m.r === undefined && (m.c === 'pais.governo' || m.c === 'pais.pol_comercio')) || (m.c === 'pais.regime' && m.q !== undefined))) return [h.id];
  }
  return [];
}

/** O que o mundo lá fora fez com o Brasil neste ano. */
export interface Exterior {
  /** Pontos de crescimento que o mundo lá fora soma (ou tira) aqui. */
  choque: number;
  /** A crise ou o boom de lá que chegou aqui, e a notícia dele (a causa da virada da fase daqui). */
  deFora: 'crise' | 'boom' | null;
  origem: number | null;
  /** Quanto o dólar subiu (ou caiu) no ano, em fração (0,1 = 10%). */
  cambio: number;
}

/** Sem o mundo lá fora (testes do país sozinho, save sem os países). */
export const SEM_EXTERIOR: Exterior = { choque: 0, deFora: null, origem: null, cambio: 0 };

/**
 * O ano do mundo lá fora, antes do país daqui: a economia de cada país, as
 * notícias (crise, boom), a relação, as sanções e os acordos, e o dólar. As
 * estatísticas vão para as regras do ano (`reg`); as notícias, para entradas
 * visíveis. Devolve o que chega ao Brasil.
 */
export function anoDoExterior(e: EstadoVida, c: Conteudo, reg: Mudanca[]): Exterior {
  const pais = e.entidades['pais'];
  if (!pais) return SEM_EXTERIOR;
  if (pais.n['cambio'] === undefined || parceirosDe(e).length < PARCEIROS.length) migrarExterior(e, c);
  const r = e.rng;
  const governa = jogadorGoverna(e, c);
  const fechado = nivelDe(e, 'comercio') >= 2;

  // A relação, as sanções e os acordos (antes do comércio do ano: a sanção nova já pesa).
  const postura = posturaDoGoverno(e, c);
  for (const def of c.mundo.estrangeiros) {
    const en = e.entidades[def.id]!;
    const r0 = en.n['relacao'] ?? def.relacao;
    const r1 = limitar(r0 + RITMO_DA_RELACAO * (alvoCom(c, def, postura) - r0) + normal(r, 0, DESVIO_DA_RELACAO), 0, 100);
    definirNumero(e, reg, def.id, 'relacao', Math.round(r1), 'mundo');
    const rel = en.n['relacao']!;
    if (!en.q['sancao'] && aleatorio(r) < chanceDeSancao(rel)) {
      const ent = noticia(e, c, 'sancao', def.id, causaDaRelacao(e, c, def, 'baixo'));
      const mud: Mudanca[] = [];
      ganhar(e, mud, def.id, 'sancao', ent.id);
      perder(e, mud, def.id, 'acordo');
      lancar(e, ent, mud);
    } else if (en.q['sancao'] && !en.q['guerra'] && (rel > SANCAO.acaba || aleatorio(r) < SANCAO.cansaco)) {
      // Acaba quando a relação volta, ou cansa: o mercado de lá sente falta do que comprava daqui. Na guerra, fica até o fim dela (guerra.ts).
      const ent = noticia(e, c, 'fimDaSancao', def.id, causaDaRelacao(e, c, def, 'cima'));
      const mud: Mudanca[] = [];
      perder(e, mud, def.id, 'sancao');
      lancar(e, ent, mud);
    }
    // Com quem joga no governo, o acordo é decisão dele (folha País); fora dele, o governo de turno assina.
    if (!governa && !fechado && !en.q['acordo'] && !en.q['sancao'] && rel >= ACORDO.acima && aleatorio(r) < ACORDO.chance) {
      const ent = noticia(e, c, 'acordo', def.id, causaDaRelacao(e, c, def, 'cima'));
      const mud: Mudanca[] = [];
      ganhar(e, mud, def.id, 'acordo', ent.id);
      lancar(e, ent, mud);
    } else if (en.q['acordo'] && rel < ACORDO.acaba) {
      const ent = noticia(e, c, 'fimDoAcordo', def.id, causaDaRelacao(e, c, def, 'baixo'));
      const mud: Mudanca[] = [];
      perder(e, mud, def.id, 'acordo');
      lancar(e, ent, mud);
    }
  }

  // A economia de cada país: volta para o crescimento dele, com a sorte que o mundo divide, a dele, a crise e o boom.
  const global = normal(r, 0, DESVIO_DO_MUNDO);
  let choque = 0;
  let demanda = 0;
  let deFora: Exterior['deFora'] = null;
  let origem: number | null = null;
  for (const def of c.mundo.estrangeiros) {
    const en = e.entidades[def.id]!;
    const g0 = en.n['crescimento'] ?? def.crescimento;
    let g = def.crescimento + PERSISTENCIA_DE_FORA * (g0 - def.crescimento) + global + normal(r, 0, def.desvio);
    const sorte = aleatorio(r);
    const tipo: 'crise' | 'boom' | null = sorte < def.crise ? 'crise' : sorte < def.crise + (def.boom ?? 0) ? 'boom' : null;
    if (tipo) g += CHOQUE_LA_FORA[tipo];
    g = limitar(g, -12, 14);
    definirNumero(e, reg, def.id, 'crescimento', arred(g), 'mundo');
    if (tipo) {
      // A notícia é a causa do que ela trouxe: a crise de lá (qualidade, enquanto a economia deles encolhe) e o choque aqui.
      const ent = noticia(e, c, tipo, def.id);
      const mud: Mudanca[] = [];
      if (tipo === 'crise') ganhar(e, mud, def.id, 'crise', ent.id);
      lancar(e, ent, mud);
      choque += (tipo === 'crise' ? CHOQUE_DA_CRISE : CHOQUE_DO_BOOM) * pesoDoChoque(def);
      // A crise manda na história do ano; o boom, só se não houve crise.
      if (tipo === 'crise' && deFora !== 'crise') {
        deFora = 'crise';
        origem = ent.id;
      } else if (tipo === 'boom' && deFora === null) {
        deFora = 'boom';
        origem = ent.id;
      }
    } else if (en.q['crise'] && g > 0) {
      perder(e, reg, def.id, 'crise', 'mundo');
    }
    // O que o Brasil vende para lá anda com a economia deles; com sanção, não vende nada.
    if (!en.q['sancao']) demanda += def.peso * (g - def.crescimento);
    if (en.q['sancao']) choque -= CUSTO_DA_SANCAO * def.peso;
    if (en.q['acordo']) choque += GANHO_DO_ACORDO * def.peso;
  }
  choque += PESO_DA_DEMANDA_EXTERNA * demanda;

  // O dólar: anda para onde o mundo e as contas daqui o levam, com a sorte do ano.
  const n = pais.n;
  const c0 = n['cambio'] ?? CAMBIO_BASE;
  const juroReal = (n['juros'] ?? JUROS_MEDIOS) - (n['inflacao'] ?? META_DE_INFLACAO);
  const sancoes = parceirosDe(e).filter((x) => x.q['sancao']).length;
  const P = PESOS_DO_CAMBIO;
  const alvo =
    CAMBIO_BASE *
    Math.exp(
      P.divida * ((n['divida'] ?? DIVIDA_DE_EQUILIBRIO) - DIVIDA_DE_EQUILIBRIO) +
        P.juroReal * (juroReal - JURO_REAL_NEUTRO) +
        P.demanda * demanda +
        P.sancao * sancoes +
        P.hiato * ((n['crescimento'] ?? CRESCIMENTO_POTENCIAL) - potencialDe(e, c)),
    );
  // A crise lá fora faz o dólar saltar no ano (todo mundo corre para ele); o boom o derruba. Os anos seguintes o devolvem ao alvo.
  const salto = deFora === 'crise' ? P.crise : deFora === 'boom' ? P.boom : 0;
  const c1 = limitar(c0 * Math.exp(salto) + RITMO_DO_CAMBIO * (alvo - c0) + c0 * normal(r, 0, DESVIO_DO_CAMBIO), 2, 15);
  definirNumero(e, reg, 'pais', 'cambio', centavos(c1), 'mundo');
  return { choque, deFora, origem, cambio: (n['cambio'] ?? c1) / c0 - 1 };
}

/**
 * O que o mundo lá fora faz com uma empresa do setor no ano (fração do
 * valor): o dólar que subiu ou caiu (exportadora ganha, importadora perde), a
 * tarifa na fronteira (a indústria protegida ganha) e a sanção ou o acordo de
 * quem compra do setor.
 */
export function exteriorNaEmpresa(e: EstadoVida, c: Conteudo, setor: string, variacaoDoCambio: number): number {
  const def = c.setores.get(setor);
  let x = (def?.cambio ?? 0) * DOLAR_NA_EMPRESA * variacaoDoCambio + (def?.protecao ?? 0) * PROTECAO_NA_EMPRESA * (nivelDe(e, 'comercio') - 1);
  for (const est of c.mundo.estrangeiros) {
    if (!est.compra.includes(setor)) continue;
    const en = e.entidades[est.id];
    if (en?.q['sancao']) x += SANCAO_NA_EMPRESA * pesoDoChoque(est);
    if (en?.q['acordo']) x += ACORDO_NA_EMPRESA * pesoDoChoque(est);
  }
  return x;
}

// ---------------------------------------------------------------- governar lá fora: a folha País

export const ACOES_DIPLOMATICAS = ['aproximar', 'acordo', 'romper'] as const;
export type AcaoDiplomatica = (typeof ACOES_DIPLOMATICAS)[number];

export type OperacaoDiplomacia = { tipo: 'diplomacia'; parceiro: Parceiro; acao: AcaoDiplomatica };

export function ehOperacaoDeDiplomacia(op: { tipo: string }): op is OperacaoDiplomacia {
  return op.tipo === 'diplomacia';
}

/** Já fez um ato lá fora neste ano (os atos ficam no livro). */
function atoNoAno(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano === e.ano; i--) if (e.historico[i]!.ref === 'pais:diplomacia') return true;
  return false;
}

export function motivoParaNaoOperarDiplomacia(e: EstadoVida, c: Conteudo, op: OperacaoDiplomacia): string | null {
  const naoGoverna = motivoParaNaoGovernar(e, c, 'só quem governa o país fala por ele lá fora');
  if (naoGoverna) return naoGoverna;
  const en = e.entidades[op.parceiro];
  if (!en || !(PARCEIROS as readonly string[]).includes(op.parceiro)) return 'escolha o país';
  if (!(ACOES_DIPLOMATICAS as readonly string[]).includes(op.acao)) return 'escolha o que fazer';
  if (en.q['guerra']) return 'em guerra: só cabe pedir a paz';
  if (atoNoAno(e)) return 'um ato lá fora por ano';
  if (op.acao === 'acordo') {
    if (en.q['acordo']) return 'o acordo já está em vigor';
    if (en.q['sancao']) return 'com sanção em vigor, ninguém assina';
    if (nivelDe(e, 'comercio') >= 2) return 'com a fronteira fechada, ninguém assina';
    if ((en.n['relacao'] ?? 0) < RELACAO_PARA_ACORDO) return `a relação precisa chegar a ${RELACAO_PARA_ACORDO}`;
  }
  return null;
}

/** O ato de quem governa lá fora (já conferido): a relação anda na hora, e a notícia conta. */
export function operarDiplomacia(e: EstadoVida, c: Conteudo, op: OperacaoDiplomacia, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  const def = defEstrangeiro(c, op.parceiro)!;
  if (op.acao === 'aproximar') {
    somar(e, reg, op.parceiro, 'relacao', ATO.aproximar);
    if (def.rival && e.entidades[def.rival]) somar(e, reg, def.rival, 'relacao', ATO.rival);
  } else if (op.acao === 'acordo') {
    ganhar(e, reg, op.parceiro, 'acordo', origem);
  } else {
    somar(e, reg, op.parceiro, 'relacao', ATO.romper);
    perder(e, reg, op.parceiro, 'acordo');
    // A bandeira na janela: quem rompe com um país de fora ganha popularidade (a de quem governa é a aprovação do governo).
    const pop = somar(e, reg, 'eu', 'popularidade', ATO.popularidade);
    somar(e, reg, 'pais', 'aprovacao', pop);
  }
  const n = c.mundo.noticias[op.acao === 'aproximar' ? 'aproximar' : op.acao === 'acordo' ? 'assinar' : 'romper'];
  const ctx = contexto(e, { ator: op.parceiro });
  return { texto: capitalizar(renderizar(sortear(e.rng, n.textos), ctx)), resumo: renderizar(n.resumo, ctx) };
}
