/**
 * O grupo no mundo (missão Capitalismo vivo, I-166 a I-169).
 *
 * - **A filial lá fora** é uma subsidiária com país (`empresa.pais`, um dos quatro de fora): vende no mercado daquele
 *   país, cresce com o crescimento de lá, recebe e paga lá (o país é a contraparte, como na exportação), sente o dólar
 *   (o que ela vende e gasta lá vale mais em reais com o dólar alto), tem as unidades nas cidades de lá, com o custo de
 *   vida de lá, e os empregos e o valor que adiciona são de lá. A sanção corta a demanda e retém o dividendo; o acordo
 *   ajuda. Lá fora não há concorrente de verdade: o mercado de lá é agregado (limite declarado).
 * - **O tamanho de cada país** é a razão do PIB dele para o do Brasil (mundo.json › estrangeiros › tamanho); o resto do
 *   mundo também (RESTO_DO_MUNDO). O tamanho anda com o do Brasil, e a crise de lá aparece pelo crescimento dele no ano.
 * - **As fatias** de cada país, de cada setor e do mundo, os funcionários do grupo por país, o grupo e quem joga diante
 *   do PIB do Brasil e do planeta, e **os 10 mais ricos e as 10 maiores empresas** saem do estado: nada aqui é campo novo.
 */
import { empresasDe, patrimonioTotal, parteEfetiva } from './campos.ts';
import { PARCEIROS, type Parceiro } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import type { DefEstrangeiro, DefSetor } from './esquema.ts';
import { aleatorio, criarRng, misturar, normal, sortear } from './rng.ts';
import { RESTO_DO_MUNDO } from './regras.ts';
import { ofertaDe, precoDoSetor } from './negocio.ts';
import type { Entidade, EstadoVida } from './tipos.ts';

/** O país da empresa (um dos quatro de fora), ou undefined para a do Brasil. */
export function paisDaEmpresa(emp: Entidade): Parceiro | undefined {
  const p = emp.t['pais'];
  return p && (PARCEIROS as readonly string[]).includes(p) ? (p as Parceiro) : undefined;
}

export function defDoPais(c: Conteudo, pais: Parceiro | undefined): DefEstrangeiro | undefined {
  return pais ? c.mundo.estrangeiros.find((x) => x.id === pais) : undefined;
}

/** O PIB de um país em reais de hoje: o do Brasil, ou o do Brasil vezes o tamanho do país de fora. */
export function pibDoPais(e: EstadoVida, c: Conteudo, pais?: Parceiro): number {
  const pib = Math.max(1e9, e.entidades['pais']?.n['pib'] ?? 1e13);
  return pais ? pib * (defDoPais(c, pais)?.tamanho ?? 1) : pib;
}

/** O PIB do planeta: o Brasil, os quatro países de fora e o resto do mundo. */
export function pibDoPlaneta(e: EstadoVida, c: Conteudo): number {
  const pib = pibDoPais(e, c);
  return pib * (1 + c.mundo.estrangeiros.reduce((s, x) => s + x.tamanho, 0) + RESTO_DO_MUNDO);
}

/** O que o país da empresa compra do setor dela por ano (uma parte do PIB de lá). */
export function mercadoNoPais(e: EstadoVida, c: Conteudo, setor: DefSetor | undefined, pais: Parceiro | undefined, peso: number): number {
  void setor;
  return pibDoPais(e, c, pais) * peso;
}

/** O ciclo de lá, na régua do ciclo daqui (o desvio do crescimento do ano para o normal dele). */
export function cicloDoPais(e: EstadoVida, c: Conteudo, pais: Parceiro): number {
  const def = defDoPais(c, pais);
  const g = e.entidades[pais]?.n['crescimento'] ?? def?.crescimento ?? 2;
  return 0.025 * (g - (def?.crescimento ?? 2));
}

/** O custo de vida de uma cidade de fora (a do país dela), ou undefined se a cidade não é de fora. */
export function custoDaCidadeDeFora(c: Conteudo, cidade: string | undefined): number | undefined {
  if (!cidade) return undefined;
  return c.mundo.estrangeiros.find((x) => x.cidades.includes(cidade))?.custoDeVida;
}

/** O nome do país com o artigo: "a Liga Atlântica", "o Pacto do Sul". */
export function oPais(c: Conteudo, pais: Parceiro, forma: 'a' | 'da' | 'na' = 'a'): string {
  const def = defDoPais(c, pais);
  const f = def?.genero === 'f';
  const artigo = forma === 'a' ? (f ? 'a' : 'o') : forma === 'da' ? (f ? 'da' : 'do') : f ? 'na' : 'no';
  return `${artigo} ${def?.nome ?? pais}`;
}

// ---------------------------------------------------------------- as fatias e o grupo diante do mundo

export interface FatiaNoSetor {
  setor: string;
  nome: string;
  /** A parte do grupo no mercado do setor em cada país em que ele vende (o Brasil é 'brasil'). */
  porPais: { pais: Parceiro | 'brasil'; parte: number; demanda: number }[];
  /** A parte do grupo no mercado mundial do setor (o Brasil, os quatro de fora e o resto do mundo). */
  mundo: number;
}

/** A fatia do grupo em cada setor em que ele produz: em cada país e no mundo. */
export function fatiasDoGrupo(e: EstadoVida, c: Conteudo): FatiaNoSetor[] {
  const grupo = empresasDe(e).filter((x) => !x.q['holding'] && x.n['capacidade'] !== undefined);
  const setores = [...new Set(grupo.map((x) => x.t['setor'] ?? ''))];
  const saida: FatiaNoSetor[] = [];
  for (const s of setores) {
    const def = c.setores.get(s);
    const peso = def?.peso ?? 0.05;
    const porPais = new Map<Parceiro | 'brasil', number>();
    for (const x of grupo) {
      if ((x.t['setor'] ?? '') !== s) continue;
      const p = paisDaEmpresa(x) ?? 'brasil';
      porPais.set(p, (porPais.get(p) ?? 0) + (x.n['demanda'] ?? 0));
    }
    let total = 0;
    const lista = [...porPais].map(([pais, demanda]) => {
      total += demanda;
      return { pais, demanda, parte: demanda / mercadoNoPais(e, c, def, pais === 'brasil' ? undefined : pais, peso) };
    });
    saida.push({ setor: s, nome: def?.nome ?? s, porPais: lista, mundo: total / (pibDoPlaneta(e, c) * peso) });
  }
  return saida;
}

export interface GrupoNoMundo {
  /** Os funcionários do grupo inteiro e os de cada país. */
  funcionarios: number;
  funcionariosPorPais: { pais: Parceiro | 'brasil'; funcionarios: number }[];
  /** O valor do grupo para quem joga e o patrimônio dele, em % do PIB do Brasil e do planeta. */
  valorDoGrupo: number;
  patrimonio: number;
  grupoNoBrasil: number;
  grupoNoPlaneta: number;
  patrimonioNoBrasil: number;
  patrimonioNoPlaneta: number;
  pibDoPlaneta: number;
}

export function grupoNoMundo(e: EstadoVida, c: Conteudo): GrupoNoMundo {
  const grupo = empresasDe(e);
  const porPais = new Map<Parceiro | 'brasil', number>();
  let funcionarios = 0;
  let valorDoGrupo = 0;
  for (const x of grupo) {
    const f = x.q['holding'] ? 0 : Math.round(x.n['funcionarios'] ?? 0);
    funcionarios += f;
    const p = paisDaEmpresa(x) ?? 'brasil';
    porPais.set(p, (porPais.get(p) ?? 0) + f);
    valorDoGrupo += Math.max(0, x.n['valor'] ?? 0) * parteEfetiva(e, x);
  }
  const pib = pibDoPais(e, c);
  const planeta = pibDoPlaneta(e, c);
  const patrimonio = patrimonioTotal(e);
  return {
    funcionarios,
    funcionariosPorPais: [...porPais].map(([pais, f]) => ({ pais, funcionarios: f })).sort((a, b) => b.funcionarios - a.funcionarios),
    valorDoGrupo,
    patrimonio,
    grupoNoBrasil: valorDoGrupo / pib,
    grupoNoPlaneta: valorDoGrupo / planeta,
    patrimonioNoBrasil: patrimonio / pib,
    patrimonioNoPlaneta: patrimonio / planeta,
    pibDoPlaneta: planeta,
  };
}

// ---------------------------------------------------------------- os 10 mais ricos e as 10 maiores

export interface NoRanking {
  nome: string;
  valor: number;
  /** De onde vem (o setor da fortuna ou o da empresa). */
  de: string;
  /** É quem joga, ou uma empresa do grupo dele. */
  seu: boolean;
  /** O setor da empresa (ou o da grande de quem é dono), para o texto do país. */
  setor?: string;
}

/** O sorteio das listas: o mesmo na vida inteira, e o ano só mexe a fortuna de cada um um pouco. */
function sorteioDasListas(e: EstadoVida, chave: number): ReturnType<typeof criarRng> {
  return criarRng(misturar(e.semente, chave));
}

/** A variação de um ano para cada nome (a bolsa, o ciclo do setor): determinística pelo ano. */
function doAno(e: EstadoVida, i: number): number {
  return Math.exp(normal(criarRng(misturar(e.semente, e.ano, 8123, i)), 0, 0.08));
}

/** O preço do setor neste ano (negocio.ts): as grandes e os donos delas sobem na alta e encolhem na sobra. */
function precoDoAno(e: EstadoVida, setor: string): number {
  return precoDoSetor(ofertaDe(e, setor));
}

interface Grande {
  nome: string;
  setor: DefSetor;
  /** A fração do PIB que ela vale com o setor no preço de equilíbrio. */
  base: number;
}

interface Rico {
  nome: string;
  genero: 'f' | 'm';
  base: number;
}

/** O sorteio das listas, guardado pela vida (a semente e o sobrenome): é o mesmo do começo ao fim, e sorteá-lo todo ano custaria. */
const SORTEIOS = new Map<string, { grandes: Grande[]; ricos: Rico[] }>();

/**
 * As 10 grandes do país e os 10 mais ricos (fictícios), sorteados uma vez por vida: o nome, o setor e o tamanho de
 * cada grande (a primeira perto de 4,5% do PIB) e de cada fortuna (a primeira perto de 1,4%). O i-ésimo mais rico é
 * dono da i-ésima grande.
 */
function sorteioDoPais(e: EstadoVida, c: Conteudo): { grandes: Grande[]; ricos: Rico[] } {
  const chave = `${e.semente}|${e.sobrenome}`;
  const guardado = SORTEIOS.get(chave);
  if (guardado) return guardado;
  const setores = [...c.setores.values()].filter((s) => s.empresas && s.empresas.length > 0);
  const familia = e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
  const sobrenomes = c.mundo.sobrenomes.filter((x) => x !== familia);
  const rr = sorteioDasListas(e, 8111);
  const ricos: Rico[] = [];
  for (let i = 0; i < 10; i++) {
    const genero = aleatorio(rr) < 0.3 ? 'f' : 'm';
    const nome = `${sortear(rr, c.mundo.nomes[genero])} ${sortear(rr, sobrenomes)}`;
    const base = 0.014 * Math.pow(0.78, i) * Math.exp(normal(rr, 0, 0.1));
    // O setor de antes (a fortuna sem dona): sorteado para a lista continuar com os mesmos nomes no save de antes.
    sortear(rr, setores);
    ricos.push({ nome, genero, base });
  }
  const rg = sorteioDasListas(e, 8117);
  const grandes: Grande[] = [];
  for (let i = 0; i < 10; i++) {
    const s = sortear(rg, setores);
    const nome = sortear(rg, s.empresas!).replaceAll('{sobrenome}', sortear(rg, sobrenomes)).replaceAll('{nome}', sortear(rg, c.mundo.nomes.m)).replaceAll('{o|a}', 'o');
    grandes.push({ nome, setor: s, base: 0.045 * Math.pow(0.8, i) * Math.exp(normal(rg, 0, 0.1)) });
  }
  if (SORTEIOS.size >= 64) SORTEIOS.delete(SORTEIOS.keys().next().value!);
  const r = { grandes, ricos };
  SORTEIOS.set(chave, r);
  return r;
}

/**
 * Os 10 mais ricos do país (fictícios, os mesmos na vida inteira), do tamanho do PIB: o primeiro perto de 1,4% dele e o
 * décimo perto de 0,15%. Cada um é dono de uma das grandes, e a fortuna anda com o setor dela (a alta sobe, a sobra
 * derruba); quem joga entra na posição dele (a lista mostra até onde ele está, se estiver fora dos 10).
 */
export function maisRicosDoPais(e: EstadoVida, c: Conteudo): { lista: NoRanking[]; posicao: number } {
  const pib = pibDoPais(e, c);
  const { grandes, ricos } = sorteioDoPais(e, c);
  const outros: NoRanking[] = ricos.map((r, i) => {
    const g = grandes[i]!;
    const valor = pib * r.base * doAno(e, i) * Math.pow(precoDoAno(e, g.setor.id), 1.2);
    return { nome: r.nome, valor, de: `${r.genero === 'f' ? 'dona' : 'dono'} de ${g.nome}`, seu: false, setor: g.setor.id };
  });
  const voce = e.entidades['eu']!;
  const eu: NoRanking = { nome: `${voce.nome} ${e.sobrenome}`, valor: patrimonioTotal(e), de: 'você', seu: true };
  const todos = [...outros, eu].sort((a, b) => b.valor - a.valor);
  const posicao = todos.indexOf(eu) + 1;
  return { lista: posicao <= 10 ? todos.slice(0, 10) : [...todos.slice(0, 10), eu], posicao: posicao <= 10 ? posicao : 0 };
}

/**
 * As 10 maiores empresas do país pelo valor: as grandes fictícias (as mesmas na vida inteira, a primeira perto de 4,5%
 * do PIB, andando com o preço do setor), as concorrentes de verdade e as do grupo de quem joga no Brasil; as filiais
 * lá fora não entram.
 */
export function maioresEmpresasDoPais(e: EstadoVida, c: Conteudo): NoRanking[] {
  const pib = pibDoPais(e, c);
  const lista: NoRanking[] = sorteioDoPais(e, c).grandes.map((g, i) => ({
    nome: g.nome,
    valor: pib * g.base * doAno(e, 100 + i) * Math.pow(precoDoAno(e, g.setor.id), 1.5),
    de: g.setor.nome,
    seu: false,
    setor: g.setor.id,
  }));
  for (const x of Object.values(e.entidades)) {
    if (x.tipo !== 'empresa' || x.vivo === false || x.q['holding'] || paisDaEmpresa(x)) continue;
    const seu = !x.id.startsWith('empresaR');
    if (!seu && x.n['capacidade'] === undefined) continue;
    lista.push({ nome: x.nome, valor: Math.max(0, x.n['valor'] ?? 0), de: c.setores.get(x.t['setor'] ?? '')?.nome ?? '', seu, ...(x.t['setor'] ? { setor: x.t['setor'] } : {}) });
  }
  return lista.sort((a, b) => b.valor - a.valor).slice(0, 10);
}

/** A posição da maior empresa do grupo entre as maiores do país (0 se estiver fora das 10). */
export function posicaoDaMaiorEmpresa(e: EstadoVida, c: Conteudo): number {
  const i = maioresEmpresasDoPais(e, c).findIndex((x) => x.seu);
  return i + 1;
}
