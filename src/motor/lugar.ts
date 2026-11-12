/**
 * O seu lugar no país e o do grupo no mundo, contados na história (missão "O mundo à vista", I-170 a I-172).
 *
 * O lugar no país é para todo jogador: onde a riqueza de quem joga (e, na juventude, a da família) fica na
 * distribuição do país, que é a do Brasil real (a metade do país tem até uns R$ 35 mil; o 1% mais rico começa perto
 * de R$ 2 milhões) e anda com o PIB per capita e com o Gini. O estrato é a faixa (os 10% mais pobres, a metade de
 * baixo… a pessoa mais rica do país); subir para uma faixa nova, voltar e cair viram linhas da linha do tempo, com o
 * porquê (a decisão que mais trouxe ou levou dinheiro); entrar no 1% e acima é marco dourado.
 *
 * Os marcos do grupo são de quem tem empresa: os funcionários (mil, dez mil, cem mil, um milhão), a fatia do
 * mercado de um setor no Brasil (um quarto, a metade), a fatia no mundo (1%) e a lista das maiores empresas do país
 * (entrar nela, ser a primeira). Cada um vem uma vez por vida, com a decisão que mais fez o grupo de causa.
 */
import type { Conteudo } from './conteudo.ts';
import { empresasDe, indicadoresDoPais, patrimonioDe, patrimonioTotal } from './campos.ts';
import { ATIVOS } from './constantes.ts';
import { definirTexto, ganhar, lancar, novaEntrada, somar } from './livro.ts';
import { fatiasDoGrupo, grupoNoMundo, maioresEmpresasDoPais, maisRicosDoPais, oPais, type NoRanking } from './mundo-das-empresas.ts';
import type { Parceiro } from './constantes.ts';
import { PAIS_EM_2026 } from './regras.ts';
import type { Entrada, EstadoVida, Mudanca } from './tipos.ts';
import { faseDe } from './pais.ts';
import { causaDaFase } from './trabalho.ts';

// ---------------------------------------------------------------- a distribuição da riqueza do país

/**
 * A riqueza por adulto no Brasil de 2026 (reais de hoje), pela fração do país que tem menos: os 10% de baixo têm
 * zero ou dívida, a mediana fica perto de R$ 35 mil, os 10% mais ricos começam em R$ 300 mil, o 1% em R$ 2 milhões,
 * o 0,1% em R$ 12 milhões, e uns 70 adultos passam de R$ 5 bilhões.
 */
const DISTRIBUICAO: readonly (readonly [number, number])[] = [
  [0.1, 0],
  [0.5, 35_000],
  [0.9, 300_000],
  [0.99, 2_000_000],
  [0.999, 12_000_000],
  [0.9999, 80_000_000],
  [0.99999, 600_000_000],
  [0.9999996, 5_000_000_000],
];
const GINI_DE_HOJE = 0.52;
/** Quantos da população são adultos (a régua é por adulto). */
const ADULTOS = 0.75;

/** Quanto a régua do país mudou desde 2026: o PIB per capita (o país mais rico) e o Gini (o topo mais longe da base). */
function escalaDoPais(e: EstadoVida): { renda: number; gini: number } {
  const pais = e.entidades['pais'];
  if (!pais) return { renda: 1, gini: 1 };
  const ind = indicadoresDoPais(pais);
  const base = PAIS_EM_2026.pib / PAIS_EM_2026.populacao;
  return { renda: Math.max(0.3, Math.min(5, ind.pibPerCapita / base)), gini: ind.gini / GINI_DE_HOJE };
}

/** A riqueza de cada degrau da régua neste ano: o topo se afasta com o Gini (a parte de cima mais que a do meio). */
function regua(e: EstadoVida): [number, number][] {
  const { renda, gini } = escalaDoPais(e);
  return DISTRIBUICAO.map(([p, v]) => [p, v * renda * Math.pow(gini, p >= 0.99 ? 3 : p >= 0.9 ? 1.5 : 0)]);
}

/** Que fração do país tem menos do que esta riqueza (de 0 a 1). */
export function percentilDaRiqueza(e: EstadoVida, riqueza: number, r: [number, number][] = regua(e)): number {
  if (riqueza <= 0) return r[0]![0] * Math.exp(riqueza / 20_000);
  const [p1, v1] = r[1]!;
  if (riqueza <= v1) return r[0]![0] + (p1 - r[0]![0]) * (riqueza / v1);
  for (let i = 2; i < r.length; i++) {
    const [pa, va] = r[i - 1]!;
    const [pb, vb] = r[i]!;
    if (riqueza <= vb || i === r.length - 1) {
      // A cauda de Pareto: o log da fração de cima anda em linha com o log da riqueza.
      const t = (Math.log(riqueza) - Math.log(va)) / (Math.log(vb) - Math.log(va));
      const cima = Math.exp(Math.log(1 - pa) + t * (Math.log(1 - pb) - Math.log(1 - pa)));
      return Math.min(1 - 1e-9, Math.max(pa, 1 - cima));
    }
  }
  return 1;
}

/** Quantos adultos do país têm pelo menos esta riqueza (para o texto: "só uns 160 mil adultos têm tanto"). */
export function adultosAcima(e: EstadoVida, riqueza: number): number {
  const pop = e.entidades['pais']?.n['populacao'] ?? PAIS_EM_2026.populacao;
  return Math.max(1, Math.round(pop * ADULTOS * (1 - percentilDaRiqueza(e, riqueza))));
}

// ---------------------------------------------------------------- os estratos

export interface Estrato {
  /** "o 1% mais rico do país": depois de "entrou para", "voltou para", "caiu para". */
  nome: string;
  /** "no 1% mais rico do país": depois de "nasceu", "terminou a vida". */
  em: string;
  /** A fração do país de baixo a partir da qual se entra (as duas últimas são pela lista dos 10 mais ricos). */
  de: number;
}

export const ESTRATOS: readonly Estrato[] = [
  { nome: 'os 10% mais pobres do país', em: 'entre os 10% mais pobres do país', de: 0 },
  { nome: 'a metade de baixo do país', em: 'na metade de baixo do país', de: 0.1 },
  { nome: 'a metade de cima do país', em: 'na metade de cima do país', de: 0.5 },
  { nome: 'os 10% mais ricos do país', em: 'entre os 10% mais ricos do país', de: 0.9 },
  { nome: 'o 1% mais rico do país', em: 'no 1% mais rico do país', de: 0.99 },
  { nome: 'o 0,1% mais rico do país', em: 'no 0,1% mais rico do país', de: 0.999 },
  { nome: 'o 0,01% mais rico do país', em: 'no 0,01% mais rico do país', de: 0.9999 },
  { nome: 'os bilionários do país', em: 'entre os bilionários do país', de: 0 },
  { nome: 'a lista dos 10 mais ricos do país', em: 'entre os 10 mais ricos do país', de: 0 },
  { nome: 'o primeiro lugar entre os mais ricos do país', em: 'no topo da lista dos mais ricos do país', de: 0 },
];
export const BILIONARIO = 7;
export const DEZ_MAIS_RICOS = 8;
export const O_MAIS_RICO = 9;
/** Bilionário em reais de hoje. */
const UM_BILHAO = 1e9;
/** A partir do 1%, entrar é marco dourado. */
export const ESTRATO_DE_MARCO = 4;
/** Para cair de faixa, a riqueza precisa ficar 20% abaixo da porta (sem isso, quem mora na porta sobe e desce todo ano). */
const FOLGA_PARA_CAIR = 0.8;

/** A faixa de uma riqueza, sem a lista dos 10 (do 0 ao bilionário). */
function faixaPelaRiqueza(e: EstadoVida, riqueza: number, r: [number, number][]): number {
  if (riqueza >= UM_BILHAO) return BILIONARIO;
  const p = percentilDaRiqueza(e, riqueza, r);
  for (let i = BILIONARIO - 1; i >= 0; i--) if (p >= ESTRATOS[i]!.de) return i;
  return 0;
}

/**
 * A riqueza que conta para o lugar: a de quem joga e, na juventude, a da família (os pais vivos), que pesa inteira
 * até os 21 e some aos 30. Quem nasce rico é rico na adolescência; aos 30, o lugar é o que é seu.
 */
export function riquezaDoLugar(e: EstadoVida): number {
  const propria = patrimonioTotal(e);
  if (e.idade >= 30) return propria;
  let familia = 0;
  for (const p of ['mae', 'pai']) {
    const x = e.entidades[p];
    if (x && x.vivo !== false) familia += patrimonioDe(x);
  }
  const peso = e.idade <= 21 ? 1 : (30 - e.idade) / 9;
  return Math.max(propria, familia * peso);
}

export interface Lugar {
  estrato: number;
  riqueza: number;
  /** Que fração do país tem menos (de 0 a 1). */
  percentil: number;
  /** Na lista dos 10 mais ricos: a posição (1 a 10); fora dela, 0. */
  posicao: number;
  /** Quem está logo abaixo na lista (o nome que quem joga passou), na lista dos 10. */
  abaixo?: string;
}

/** Onde quem joga está no país agora (a folha Dinheiro e o ano do lugar). */
export function lugarNoPais(e: EstadoVida, c: Conteudo, riqueza = riquezaDoLugar(e)): Lugar {
  const r = regua(e);
  const percentil = percentilDaRiqueza(e, riqueza, r);
  let estrato = faixaPelaRiqueza(e, riqueza, r);
  let posicao = 0;
  let abaixo: string | undefined;
  if (estrato === BILIONARIO && riqueza === patrimonioTotal(e)) {
    const ricos = maisRicosDoPais(e, c);
    posicao = ricos.posicao;
    if (posicao > 0) {
      estrato = posicao === 1 ? O_MAIS_RICO : DEZ_MAIS_RICOS;
      abaixo = ricos.lista[posicao]?.nome;
    }
  }
  return { estrato, riqueza, percentil, posicao, ...(abaixo ? { abaixo } : {}) };
}

/** O estrato com a folga para cair: só desce se a riqueza ficou 20% abaixo da porta (e na lista, se saiu dela de verdade). */
function estratoComFolga(e: EstadoVida, atual: number, agora: Lugar): number {
  if (agora.estrato >= atual) return agora.estrato;
  const r = regua(e);
  const comFolga = faixaPelaRiqueza(e, agora.riqueza / FOLGA_PARA_CAIR, r);
  if (atual >= DEZ_MAIS_RICOS) {
    // Na lista, cair do primeiro lugar ou dela é cair: a lista é o que é.
    return Math.max(agora.estrato, Math.min(comFolga, BILIONARIO));
  }
  return Math.min(atual, Math.max(agora.estrato, comFolga));
}

// ---------------------------------------------------------------- o porquê: a decisão que mais trouxe ou levou

const CAMPOS_DE_QUEM_JOGA = new Set<string>(['eu.dinheiro', ...ATIVOS.map((a) => `eu.${a}`)]);

/** É um lugar onde a riqueza de quem joga fica (a conta, os investimentos, as empresas do grupo, os bens, os títulos). */
function ehDeQuemJoga(caminho: string): boolean {
  if (CAMPOS_DE_QUEM_JOGA.has(caminho)) return true;
  const [ent, campo] = caminho.split('.') as [string, string | undefined];
  if (campo === 'valor' || campo === 'caixa') return /^(empresa\d*|bem\d+|tit\d+)$/.test(ent);
  return false;
}

/** É onde o dinheiro é posto para render: as empresas do grupo, os investimentos, os títulos. */
function rende(caminho: string): boolean {
  const [ent, campo] = caminho.split('.') as [string, string | undefined];
  if (ent === 'eu') return (ATIVOS as readonly string[]).includes(campo ?? '');
  return (campo === 'valor' || campo === 'caixa') && /^(empresa\d*|tit\d+)$/.test(ent);
}

/**
 * O que esta entrada mudou na riqueza de quem joga: o saldo (o que veio de fora menos o que foi para fora, com a dívida
 * contando contra; comprar a casa financiada não muda nada) e o que foi posto para render (abrir a empresa, aplicar,
 * emprestar ao governo), que é a semente de uma subida.
 */
function movimento(h: Entrada, so: ((c: string) => boolean) | undefined): { saldo: number; semente: number } {
  let saldo = 0;
  let semente = 0;
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || (so && !so(m.c))) continue;
    if (m.c === 'eu.divida') saldo -= m.d;
    else if (ehDeQuemJoga(m.c)) {
      saldo += m.d;
      if (m.d > 0 && rende(m.c)) semente += m.d;
    }
  }
  return { saldo, semente };
}

/** A entrada tem uma frase para o porquê (virada.ts › frase): a decisão de quem joga, ou o que veio dos outros e do país. */
function contaUmPorque(h: Entrada): boolean {
  if (h.escolha) return true;
  return (h.tipo === 'acao' || h.tipo === 'dinheiro' || h.tipo === 'npc' || h.tipo === 'mundo') && !!h.resumo;
}

/**
 * A causa de uma subida (a decisão que mais trouxe nos últimos `anos`) ou de uma queda (a que mais levou): a entrada,
 * se ela mexeu com pelo menos `minimo`. `so` limita aos caminhos de uma parte do patrimônio (o grupo).
 */
export function causaDaRiqueza(e: EstadoVida, para: 'cima' | 'baixo', anos: number, minimo: number, so?: (c: string) => boolean): number | null {
  let melhor: { id: number; v: number } | null = null;
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.ano < e.ano - anos) break;
    // O empréstimo de outra pessoa não é riqueza: a promissória é dívida (promissorias.ts), fora de eu.divida.
    if (h.ano >= e.ano || !contaUmPorque(h) || h.mudancas?.some((m) => m.c.startsWith('prm'))) continue;
    const mov = movimento(h, so);
    const v = para === 'cima' ? Math.max(mov.saldo, mov.semente) : -mov.saldo;
    if (v >= minimo && (!melhor || v > melhor.v)) melhor = { id: h.id, v };
  }
  return melhor?.id ?? null;
}

// ---------------------------------------------------------------- o ano do lugar

function bilionario(e: EstadoVida): string {
  return e.entidades['eu']?.genero === 'f' ? 'bilionária' : 'bilionário';
}

/** Os mil, os 160 mil: o número de gente em palavras. */
function gente(n: number): string {
  if (n >= 2_000_000) return `${Math.round(n / 100_000) / 10} milhões`.replace('.', ',');
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10} milhão`.replace('.', ',');
  if (n >= 10_000) return `${Math.round(n / 1000)} mil`;
  if (n >= 1000) return `${(Math.round(n / 100) / 10).toString().replace('.', ',')} mil`;
  return String(Math.max(1, Math.round(n / 10) * 10 || n));
}

/** O texto da subida para uma faixa nova. */
function textoDaSubida(e: EstadoVida, k: number, lugar: Lugar): string {
  switch (k) {
    case 1:
      return 'Você saiu dos 10% mais pobres do país.';
    case 2:
      return 'Você passou para a metade de cima do país: tem mais do que metade dos adultos do Brasil.';
    case 3:
      return 'Você entrou para os 10% mais ricos do país.';
    case 4:
      return `Você entrou para o 1% mais rico do país: só cerca de ${gente(adultosAcima(e, lugar.riqueza))} de adultos no Brasil têm tanto quanto você.`.replace(' mil de ', ' mil ');
    case 5:
      return `Você entrou para o 0,1% mais rico do país: só cerca de ${gente(adultosAcima(e, lugar.riqueza))} de adultos no Brasil têm tanto quanto você.`.replace(' mil de ', ' mil ');
    case 6:
      return `Você entrou para o 0,01% mais rico do país. A conta tem mais zeros do que o seu primeiro salário tinha de reais.`;
    case BILIONARIO:
      return `Você virou ${bilionario(e)}: um bilhão de reais. No país inteiro, só cerca de ${gente(adultosAcima(e, lugar.riqueza))} pessoas têm isso.`;
    case DEZ_MAIS_RICOS:
      return `Você entrou para a lista dos 10 mais ricos do país, em ${lugar.posicao}º lugar${lugar.abaixo ? `, à frente de ${lugar.abaixo}` : ''}.`;
    default:
      return `Você é a pessoa mais rica do país.${lugar.abaixo ? ` ${lugar.abaixo} ficou em segundo.` : ''}`;
  }
}

function resumoDaSubida(k: number, voltou: boolean): string {
  if (k === O_MAIS_RICO) return voltou ? 'voltou a ser a pessoa mais rica do país' : 'virou a pessoa mais rica do país';
  if (k === BILIONARIO && !voltou) return 'virou bilionário';
  return `${voltou ? 'voltou' : 'entrou'} para ${ESTRATOS[k]!.nome}`;
}

/** A primeira linha da vida sobre o lugar: onde a família está no país (no nascimento e na vida nova de quem herda). */
export function lugarAoNascer(e: EstadoVida, c: Conteudo, herdeiro = false): void {
  const eu = e.entidades['eu']!;
  const lugar = lugarNoPais(e, c, herdeiro ? patrimonioTotal(e) : riquezaDoLugar(e));
  // Quem nasce não está na lista dos 10: a família está (a riqueza é dos pais).
  let k = lugar.estrato;
  if (!herdeiro && k === BILIONARIO) {
    const ricos = maisRicosDoPais(e, c).lista.filter((x) => !x.seu);
    const pos = ricos.filter((x) => x.valor > lugar.riqueza).length + 1;
    if (pos <= 10) k = pos === 1 ? O_MAIS_RICO : DEZ_MAIS_RICOS;
  }
  eu.n['estrato'] = k;
  eu.n['estrato_max'] = k;
  const onde = k === O_MAIS_RICO ? 'na família mais rica do país' : k === DEZ_MAIS_RICOS ? 'numa das 10 famílias mais ricas do país' : ESTRATOS[k]!.em;
  const texto = herdeiro ? `Com o que veio da herança, você começa ${onde}.` : `Pelo que a sua família tem, você nasceu ${onde}.`;
  lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: `lugar:nasceu:${k}`, texto }), []);
}

/** A última linha do lugar foi uma queda: a subida de agora é uma volta que se conta (a queda calada volta calada). */
function quedaContada(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const ref = e.historico[i]!.ref;
    if (ref?.startsWith('lugar:')) return ref.startsWith('lugar:caiu:');
  }
  return false;
}

/**
 * O ano do lugar: a faixa de quem joga anda (com a folga para cair), e a mudança vira linha a partir dos 18 — a
 * faixa nova (marco a partir do 1%), a volta e a queda com causa. A queda sem causa (a família que deixa de pesar
 * aos 30, o dinheiro que a inflação come devagar) muda o estrato em silêncio, nas regras do ano.
 */
export function anoDoLugar(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const eu = e.entidades['eu'];
  if (!eu || eu.n['estrato'] === undefined) return;
  const atual = eu.n['estrato'];
  const maximo = eu.n['estrato_max'] ?? atual;
  const agora = lugarNoPais(e, c);
  const novo = estratoComFolga(e, atual, agora);
  if (novo === atual) return;
  const adulto = e.idade >= 18;
  const voltou = novo <= maximo;
  if (novo > atual && adulto && (!voltou || quedaContada(e))) {
    const causa = causaDaRiqueza(e, 'cima', 20, Math.max(10_000, agora.riqueza * 0.05));
    const texto = voltou ? `Você voltou para ${ESTRATOS[novo]!.nome}.` : textoDaSubida(e, novo, agora);
    const marco = !voltou && novo >= ESTRATO_DE_MARCO;
    const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: `lugar:${marco ? 'marco' : voltou ? 'voltou' : 'entrou'}:${novo}`, texto, resumo: resumoDaSubida(novo, voltou).replace('bilionário', bilionario(e)), ...(causa !== null ? { causas: [causa] } : {}) });
    const r: Mudanca[] = [];
    somar(e, r, 'eu', 'estrato', novo - atual, 'lugar');
    if (novo > maximo) somar(e, r, 'eu', 'estrato_max', novo - maximo, 'lugar');
    if (novo >= DEZ_MAIS_RICOS) ganhar(e, r, 'eu', 'entre_os_mais_ricos', entrada.id, 'lugar');
    if (novo === O_MAIS_RICO) ganhar(e, r, 'eu', 'o_mais_rico_do_pais', entrada.id, 'lugar');
    lancar(e, entrada, r);
    return;
  }
  if (novo < atual && adulto) {
    // A queda que se conta é a que tem causa: a decisão (ou o golpe, a herança que foi embora) que levou o dinheiro,
    // ou, para quem estava no topo, a crise do país. A família que deixa de pesar e a inflação que come devagar, não.
    const perda = Math.max(10_000, Math.abs(agora.riqueza) * 0.1);
    const fase = faseDe(e);
    const daFase = atual >= ESTRATO_DE_MARCO && (fase === 'recessao' || fase === 'crise') ? causaDaFase(e) : null;
    // A crise que se aponta é a de um ano anterior (o porquê só mostra o que veio antes).
    const crise = daFase !== null && (e.historico.find((h) => h.id === daFase)?.ano ?? e.ano) < e.ano ? daFase : null;
    const causa = causaDaRiqueza(e, 'baixo', 4, perda) ?? crise;
    if (causa !== null) {
      const texto = atual === O_MAIS_RICO && novo === DEZ_MAIS_RICOS ? `Você perdeu o primeiro lugar entre os mais ricos do país: agora é o ${agora.posicao}º.` : atual >= DEZ_MAIS_RICOS && novo < DEZ_MAIS_RICOS ? 'Você saiu da lista dos 10 mais ricos do país.' : `Você caiu para ${ESTRATOS[novo]!.nome}.`;
      const resumo = atual >= DEZ_MAIS_RICOS && novo < DEZ_MAIS_RICOS ? 'saiu da lista dos 10 mais ricos do país' : `caiu para ${ESTRATOS[novo]!.nome}`;
      const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: `lugar:caiu:${novo}`, texto, resumo, causas: [causa] });
      const r: Mudanca[] = [];
      somar(e, r, 'eu', 'estrato', novo - atual, 'lugar');
      lancar(e, entrada, r);
      return;
    }
  }
  // Na infância, e na queda sem causa, a faixa muda nas regras do ano, sem linha.
  somar(e, reg, 'eu', 'estrato', novo - atual, 'lugar');
  if (novo > maximo) somar(e, reg, 'eu', 'estrato_max', novo - maximo, 'lugar');
}

// ---------------------------------------------------------------- os marcos do grupo

interface MarcoDoGrupo {
  id: string;
  /** Dourado: o topo do que um grupo chega a ser. */
  ouro?: boolean;
}

/** Os marcos do grupo (qualidades de quem joga, uma vez por vida). */
export const MARCOS_DO_GRUPO: readonly MarcoDoGrupo[] = [
  { id: 'grupo_mil' },
  { id: 'grupo_dez_mil' },
  { id: 'grupo_cem_mil' },
  { id: 'grupo_um_milhao', ouro: true },
  { id: 'milesimo_do_mercado' },
  { id: 'centesimo_do_mercado', ouro: true },
  { id: 'grupo_la_fora' },
  { id: 'entre_as_maiores' },
  { id: 'a_maior_do_pais', ouro: true },
];
const FUNCIONARIOS: readonly [string, number, string][] = [
  ['grupo_mil', 1000, 'O grupo passou de mil funcionários. Na festa de fim de ano, ninguém mais sabe o nome de todo mundo.'],
  ['grupo_dez_mil', 10_000, 'Dez mil pessoas trabalham para o grupo: é uma cidade pequena do interior inteira batendo ponto.'],
  ['grupo_cem_mil', 100_000, 'Cem mil funcionários: o grupo emprega mais gente do que cabe num estádio lotado.'],
  ['grupo_um_milhao', 1_000_000, 'Um milhão de pessoas trabalham para o grupo. Se fosse uma cidade, estaria entre as maiores do país.'],
];

/** Uma mudança mexe com o grupo (uma empresa de quem joga): o porquê dos marcos do grupo. */
function doGrupo(caminho: string): boolean {
  return /^empresa\d*\./.test(caminho);
}

/** O ano dos marcos do grupo: só para quem tem empresa; cada um vem uma vez, com a decisão que mais fez o grupo. */
export function marcosDoGrupo(e: EstadoVida, c: Conteudo): void {
  const eu = e.entidades['eu'];
  if (!eu || eu.vivo === false) return;
  const empresas = empresasDe(e);
  if (empresas.length === 0) return;
  const marcos: { id: string; texto: string; resumo: string; tambem?: string }[] = [];
  const g = grupoNoMundo(e, c);
  for (const [id, n, texto] of FUNCIONARIOS) {
    if (!eu.q[id] && g.funcionarios >= n) marcos.push({ id, texto, resumo: `o grupo passou de ${gente(n)} funcionários` });
  }
  if (!eu.q['milesimo_do_mercado'] || !eu.q['centesimo_do_mercado']) {
    // A fatia do grupo no setor em que ele é maior no Brasil: um real de cada mil (o grupo que o setor nota) e um
    // de cada cem (um gigante do país; dourado).
    let melhor: { setor: string; parte: number } | null = null;
    for (const f of fatiasDoGrupo(e, c)) {
      const br = f.porPais.find((p) => p.pais === 'brasil');
      if (br && (!melhor || br.parte > melhor.parte)) melhor = { setor: f.setor, parte: br.parte };
    }
    const setor = melhor ? (c.setores.get(melhor.setor)?.nome ?? melhor.setor).toLowerCase() : '';
    if (melhor && melhor.parte >= 0.01 && !eu.q['centesimo_do_mercado']) {
      marcos.push({ id: 'centesimo_do_mercado', texto: `De cada cem reais que o país gasta com ${setor}, um vai para o seu grupo. Pouca empresa no Brasil chega aqui.`, resumo: `pôs o grupo com 1% de tudo o que o país gasta com ${setor}`, ...(eu.q['milesimo_do_mercado'] ? {} : { tambem: 'milesimo_do_mercado' }) });
    } else if (melhor && melhor.parte >= 0.001 && !eu.q['milesimo_do_mercado']) {
      marcos.push({ id: 'milesimo_do_mercado', texto: `De cada mil reais que o país gasta com ${setor}, um vai para o seu grupo. O setor já sabe o seu nome.`, resumo: `pôs o grupo com um real de cada mil que o país gasta com ${setor}` });
    }
  }
  // A filial lá fora com gente: o grupo que emprega em outro país.
  if (!eu.q['grupo_la_fora']) {
    const fora = g.funcionariosPorPais.filter((p) => p.pais !== 'brasil' && p.funcionarios > 0).sort((a, b) => b.funcionarios - a.funcionarios)[0];
    if (fora) {
      const na = oPais(c, fora.pais as Parceiro, 'na');
      marcos.push({ id: 'grupo_la_fora', texto: `Lá fora, ${gente(fora.funcionarios)} ${fora.funcionarios === 1 ? 'pessoa trabalha' : 'pessoas trabalham'} para o grupo ${na}: o crachá tem o seu logo e outra língua.`, resumo: `pôs o grupo para empregar gente ${na}` });
    }
  }
  // A lista das maiores do país: só quando a maior empresa do grupo chega perto do tamanho da décima.
  const maior = Math.max(...empresas.map((x) => x.n['valor'] ?? 0));
  const pib = e.entidades['pais']?.n['pib'] ?? PAIS_EM_2026.pib;
  if ((!eu.q['entre_as_maiores'] || !eu.q['a_maior_do_pais']) && maior >= pib * 0.002) {
    const lista = maioresEmpresasDoPais(e, c);
    const i = lista.findIndex((x) => x.seu);
    if (i === 0 && !eu.q['a_maior_do_pais']) {
      const segunda = lista[1]?.nome;
      // Quem chega direto ao primeiro lugar também entrou na lista: as duas qualidades na mesma linha.
      marcos.push({ id: 'a_maior_do_pais', texto: `A ${lista[0]!.nome} é a maior empresa do país.${segunda ? ` A ${segunda} ficou em segundo lugar.` : ''}`, resumo: `fez da ${lista[0]!.nome} a maior empresa do país`, ...(eu.q['entre_as_maiores'] ? {} : { tambem: 'entre_as_maiores' }) });
    } else if (i > 0 && !eu.q['entre_as_maiores']) {
      marcos.push({ id: 'entre_as_maiores', texto: `A ${lista[i]!.nome} entrou para a lista das 10 maiores empresas do país, em ${i + 1}º lugar.`, resumo: `pôs a ${lista[i]!.nome} entre as 10 maiores empresas do país` });
    }
  }
  if (marcos.length === 0) return;
  const causa = causaDaRiqueza(e, 'cima', 40, 1, doGrupo);
  for (const m of marcos) {
    const def = MARCOS_DO_GRUPO.find((x) => x.id === m.id)!;
    const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: `porte:${def.ouro ? 'marco' : 'marco_menor'}:${m.id}`, texto: m.texto, resumo: m.resumo, ...(causa !== null ? { causas: [causa] } : {}) });
    const r: Mudanca[] = [];
    ganhar(e, r, 'eu', m.id, entrada.id, 'grupo');
    if (m.tambem) ganhar(e, r, 'eu', m.tambem, entrada.id, 'grupo');
    lancar(e, entrada, r);
  }
}

/** Onde no país: a faixa como complemento de "nasceu" ou "terminou" ("no 1% mais rico do país"). */
function emQue(k: number): string {
  return k === O_MAIS_RICO ? 'como a pessoa mais rica do país' : k === DEZ_MAIS_RICOS ? 'entre os 10 mais ricos do país' : ESTRATOS[k]!.em;
}

/**
 * Do berço ao fim, para o cartão da vida: "Nasceu na metade de baixo do país e terminou no 1% mais rico (chegou ao
 * 0,1%)". Sem a linha do nascimento (o save de antes do lugar), nada.
 */
export function lugarNaVida(e: EstadoVida): string | null {
  const eu = e.entidades['eu'];
  const nasceu = e.historico.find((h) => h.ref?.startsWith('lugar:nasceu:'));
  if (!eu || !nasceu || eu.n['estrato'] === undefined) return null;
  const de = Number(nasceu.ref!.split(':')[2]);
  const fim = eu.n['estrato'];
  const maximo = eu.n['estrato_max'] ?? fim;
  const comeco = nasceu.ref && e.dinastia && (e.dinastia.geracao ?? 1) > 1 ? 'Começou' : 'Nasceu';
  const chegou = maximo > fim && maximo > de ? `; no auge, ${emQue(maximo)}` : '';
  if (de === fim) return `${comeco} e terminou ${emQue(fim)}${chegou}.`.replace(`${comeco} e terminou`, `${comeco} e terminou a vida`);
  return `${comeco} ${emQue(de)} e terminou ${emQue(fim)}${chegou}.`;
}

// ---------------------------------------------------------------- os grandes do país (I-173)

/** "Você" nas listas: quem joga, ou uma empresa do grupo dele (o lugar e os marcos do grupo contam isso). */
export const VOCE = 'você';
/** Uma notícia dos grandes a cada três anos, no máximo: o primeiro lugar que troca todo ano seria noticiário. */
const INTERVALO_DOS_GRANDES = 6;
/** Para tomar o primeiro lugar, é preciso passar quem estava lá por 15% (sem isso, dois do mesmo tamanho trocam todo ano). */
const FOLGA_DO_PRIMEIRO = 1.15;

/** Quantos anos desde a última notícia dos grandes (o livro, de trás para a frente, até o intervalo). */
function noticiaRecente(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.ano <= e.ano - INTERVALO_DOS_GRANDES) return false;
    if (h.ref?.startsWith('grandes:')) return true;
  }
  return false;
}

/** O setor em alta ou em baixa, para o porquê da troca de lugar ("o setor de construção está em alta"). */
function momentoDoSetor(e: EstadoVida, c: Conteudo, setor: string | undefined, quem: 'ganhou' | 'perdeu', oQue: string): string {
  if (!setor) return '';
  const nome = (c.setores.get(setor)?.nome ?? setor).toLowerCase();
  const oferta = e.entidades[`setor_${setor}`]?.n['oferta'] ?? 100;
  if (quem === 'ganhou' && oferta < 96) return ` O setor de ${nome} está em alta, e ${oQue} subiu com ele.`;
  if (quem === 'perdeu' && oferta > 104) return ` A sobra no setor de ${nome} encolheu ${oQue} de quem estava em primeiro.`;
  return '';
}

/** O primeiro de uma lista, com a folga: quem estava lá continua até alguém passá-lo por 15%. */
function primeiroComFolga(lista: readonly NoRanking[], antes: string | undefined): NoRanking | undefined {
  const topo = lista[0];
  if (!topo || !antes) return topo;
  const velho = lista.find((x) => (x.seu ? VOCE : x.nome) === antes);
  return velho && topo.valor < velho.valor * FOLGA_DO_PRIMEIRO ? velho : topo;
}

/**
 * O ano dos grandes: quem está em primeiro entre os mais ricos e entre as maiores empresas do país. Quando o primeiro
 * lugar troca entre os outros (não com quem joga, que o lugar e os marcos do grupo já contam), vira notícia, com o
 * setor que fez a troca; até os 12 anos, e a menos de três anos da última notícia, muda em silêncio.
 */
export function anoDosGrandes(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const pais = e.entidades['pais'];
  if (!pais) return;
  const ricos = maisRicosDoPais(e, c).lista;
  const empresas = maioresEmpresasDoPais(e, c);
  const antesRico = pais.t['mais_rico'];
  const antesEmpresa = pais.t['maior_empresa'];
  const rico = primeiroComFolga(ricos, antesRico);
  const empresa = primeiroComFolga(empresas, antesEmpresa);
  if (!rico || !empresa) return;
  const nomeRico = rico.seu ? VOCE : rico.nome;
  const nomeEmpresa = empresa.seu ? VOCE : empresa.nome;
  const noticias: { ref: string; texto: string; resumo: string; campo: string; valor: string }[] = [];
  const pode = e.idade >= 13 && !noticiaRecente(e);
  if (antesRico !== nomeRico) {
    if (pode && antesRico && antesRico !== VOCE && !rico.seu) {
      const antes = ricos.find((x) => x.nome === antesRico);
      noticias.push({ ref: 'grandes:mais_rico', campo: 'mais_rico', valor: nomeRico, texto: `${rico.nome}, ${rico.de}, passou ${antesRico} e é agora a pessoa mais rica do país.${momentoDoSetor(e, c, rico.setor, 'ganhou', 'a fortuna') || momentoDoSetor(e, c, antes?.setor, 'perdeu', 'a fortuna')}`, resumo: `${rico.nome} virou a pessoa mais rica do país` });
    } else definirTexto(e, reg, 'pais', 'mais_rico', nomeRico, 'grandes');
  }
  if (antesEmpresa !== nomeEmpresa) {
    if (pode && noticias.length === 0 && antesEmpresa && antesEmpresa !== VOCE && !empresa.seu) {
      const antes = empresas.find((x) => x.nome === antesEmpresa);
      noticias.push({ ref: 'grandes:maior_empresa', campo: 'maior_empresa', valor: nomeEmpresa, texto: `${empresa.nome} passou ${antesEmpresa} e é agora a maior empresa do país.${momentoDoSetor(e, c, empresa.setor, 'ganhou', 'o valor') || momentoDoSetor(e, c, antes?.setor, 'perdeu', 'o valor')}`, resumo: `${empresa.nome} virou a maior empresa do país` });
    } else definirTexto(e, reg, 'pais', 'maior_empresa', nomeEmpresa, 'grandes');
  }
  for (const n of noticias) {
    const r: Mudanca[] = [];
    definirTexto(e, r, 'pais', n.campo, n.valor, 'grandes');
    lancar(e, novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: n.ref, texto: n.texto, resumo: n.resumo }), r);
  }
}

/** A entrada é um marco dourado do lugar ou do grupo (formato.ts › ehMarco). */
export function ehMarcoDoMundo(h: Entrada): boolean {
  return (h.ref?.startsWith('lugar:marco:') ?? false) || (h.ref?.startsWith('porte:marco:') ?? false);
}
