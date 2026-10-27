import { ATIVOS, FILHOS } from '../motor/constantes.ts';
import type { Parentesco } from '../motor/herdeiro.ts';
import type { Atributo } from '../motor/esquema.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { Entrada } from '../motor/tipos.ts';

/** O APK do app Android: o CI publica um novo a cada atualização da main, sempre neste link. */
export const LINK_APK = 'https://github.com/Lhordriyon/Calculadora-Viva/releases/download/android/Trajetoria.apk';

/** Dentro do app Android o jogo roda em https://localhost (no navegador, no endereço do GitHub Pages). */
export const NO_APP = typeof location !== 'undefined' && location.protocol === 'https:' && location.hostname === 'localhost';

export const NOMES: Record<Atributo, string> = {
  saude: 'Saúde',
  felicidade: 'Felicidade',
  inteligencia: 'Inteligência',
  aparencia: 'Aparência',
};

/** Dinheiro curto para os cartões do cabeçalho: "R$ 958 mil", "R$ 13 mi", "R$ 1,2 bi", "R$ 11 tri". */
export function dinheiroCurto(valor: number): string {
  const sinal = valor < 0 ? '−' : '';
  const v = Math.abs(valor);
  for (const [base, nome] of [
    [1e12, 'tri'],
    [1e9, 'bi'],
    [1e6, 'mi'],
    [1e3, 'mil'],
  ] as const) {
    if (v < base * 0.9995) continue;
    const x = v / base;
    const texto = x < 9.95 ? x.toFixed(1).replace('.', ',').replace(/,0$/, '') : String(Math.round(x));
    return `${sinal}R$ ${texto} ${nome}`;
  }
  return `${sinal}R$ ${Math.round(v)}`;
}

/** As iniciais do retrato: a do nome e a do sobrenome. */
export function iniciais(nome: string, sobrenome: string): string {
  return `${nome.trim()[0] ?? ''}${sobrenome.trim()[0] ?? ''}`.toLocaleUpperCase('pt-BR');
}

export const CORES: Record<Atributo, string> = {
  saude: 'var(--saude)',
  felicidade: 'var(--felicidade)',
  inteligencia: 'var(--inteligencia)',
  aparencia: 'var(--aparencia)',
};

export interface Chip {
  texto: string;
  cor?: string;
  ruim?: boolean;
  neutro?: boolean;
}

/** A mordida da inflação aparece só quando pesa e no máximo de tantos em tantos anos. */
const INFLACAO_MINIMA = 300;
const INFLACAO_INTERVALO = 5;
/** Vínculo que mexe menos que isso não vira chip (o ano a ano das regras fica escondido). */
const VINCULO_MINIMO = 3;
const PAPEIS_COM_VINCULO: readonly string[] = ['mae', 'pai', 'avo', 'amigo', 'amor', ...FILHOS];

/** Ids das entradas que mostram a inflação: uma a cada INFLACAO_INTERVALO anos, no máximo. */
export function avisosDeInflacao(historico: Entrada[]): Set<number> {
  const ids = new Set<number>();
  let ultima = -Infinity;
  for (const h of historico) {
    if ((h.inflacao ?? 0) >= INFLACAO_MINIMA && h.idade - ultima >= INFLACAO_INTERVALO) {
      ids.add(h.id);
      ultima = h.idade;
    }
  }
  return ids;
}

function sinal(n: number): string {
  return n > 0 ? '+' : '−';
}

function dinheiro(n: number): string {
  return formatarDinheiro(Math.abs(n));
}

/** Soma as variações numéricas de uma entrada por caminho ("eu.saude", "mae.vinculo"). */
export function variacoes(h: Entrada): Map<string, number> {
  const d = new Map<string, number>();
  for (const m of h.mudancas ?? []) if (m.d !== undefined && m.r !== 'saida' && m.r !== 'papel') d.set(m.c, (d.get(m.c) ?? 0) + m.d);
  return d;
}

/**
 * A entrada aparece na linha do tempo? Só a das regras miúdas do ano (`ano`)
 * fica escondida; as regras que contam algo (promoção, fim de mandato, fim de
 * carreira) aparecem, para a renda não mudar sem explicação.
 */
export function visivel(h: Entrada): boolean {
  return !(h.tipo === 'regra' && h.ref === 'ano');
}

/** Os efeitos visíveis de uma entrada, para os chips da linha do tempo. */
export function chipsDe(h: Entrada, nomeDe: (papel: string) => string | undefined, mostrarInflacao = false): Chip[] {
  const chips: Chip[] = [];
  const d = variacoes(h);
  for (const a of Object.keys(NOMES) as Atributo[]) {
    const v = Math.round(d.get(`eu.${a}`) ?? 0);
    if (v !== 0) chips.push({ texto: `${sinal(v)}${Math.abs(v)} ${NOMES[a]}`, cor: CORES[a] });
  }
  const caixa = d.get('eu.dinheiro') ?? 0;
  const investido = ATIVOS.reduce((s, a) => s + (d.get(`eu.${a}`) ?? 0), 0);
  const divida = d.get('eu.divida') ?? 0;
  // Investir só troca o dinheiro de lugar: aparece como "investiu", sem o "−R$" do caixa.
  const soInvestiu = investido >= 1 && Math.abs(caixa + investido) < 1;
  if (!soInvestiu && Math.abs(caixa) >= 1) chips.push({ texto: `${sinal(caixa)}${dinheiro(caixa)}`, cor: 'var(--dinheiro)', ruim: caixa < 0 });
  if (Math.abs(investido) >= 1) chips.push({ texto: `${investido > 0 ? 'investiu' : 'resgatou'} ${dinheiro(investido)}`, cor: 'var(--dinheiro)' });
  if (Math.abs(divida) >= 1) chips.push({ texto: `dívida ${sinal(divida)}${dinheiro(divida)}`, ruim: divida > 0, cor: 'var(--dinheiro)' });
  const renda = d.get('eu.renda') ?? 0;
  if (Math.abs(renda) >= 1) chips.push({ texto: `renda ${sinal(renda)}${dinheiro(renda / 12)}/mês`, cor: 'var(--dinheiro)', ruim: renda < 0 });
  const custo = d.get('eu.custo') ?? 0;
  if (Math.abs(custo) >= 1) chips.push({ texto: `gastos ${sinal(custo)}${dinheiro(custo / 12)}/mês`, cor: 'var(--dinheiro)', ruim: custo > 0 });
  for (const papel of PAPEIS_COM_VINCULO) {
    const v = Math.round(d.get(`${papel}.vinculo`) ?? 0);
    // O amor pode mudar de pessoa ao longo da vida: o chip fala do casal, não de um nome.
    const quem = papel === 'amor' ? 'do casal' : nomeDe(papel) ? `com ${nomeDe(papel)}` : '';
    if (Math.abs(v) >= VINCULO_MINIMO && quem) chips.push({ texto: `vínculo ${quem} ${sinal(v)}${Math.abs(v)}`, cor: 'var(--vinculo)', ruim: v < 0 });
    // A mágoa e a confiança só falam da pessoa (o nome), porque é dela que se trata.
    const nome = nomeDe(papel);
    if (!nome) continue;
    const m = Math.round(d.get(`${papel}.magoa`) ?? 0);
    if (Math.abs(m) >= VINCULO_MINIMO) chips.push({ texto: `mágoa de ${nome} ${sinal(m)}${Math.abs(m)}`, cor: m > 0 ? 'var(--ruim)' : 'var(--saude)', ruim: m > 0 });
    const conf = Math.round(d.get(`${papel}.confianca`) ?? 0);
    if (Math.abs(conf) >= VINCULO_MINIMO) chips.push({ texto: `confiança de ${nome} ${sinal(conf)}${Math.abs(conf)}`, cor: 'var(--turquesa)', ruim: conf < 0 });
  }
  if (mostrarInflacao && h.inflacao) chips.push({ texto: `a inflação comeu ${dinheiro(h.inflacao)} do dinheiro parado`, neutro: true });
  return chips;
}

/** A parte de quem joga em cada empresa, pelo lugar dela (um número só vale para todas). */
export type Participacoes = number | Readonly<Record<string, number>>;

/** O balanço de um ano (a entrada invisível das regras): salário guardado, rendimentos, inflação, empresas. */
export function balancoDoAno(regra: Entrada, participacao: Participacoes): number {
  let total = 0;
  for (const m of regra.mudancas ?? []) {
    if (m.d === undefined) continue;
    const empresa = /^(empresa\d*)\.valor$/.exec(m.c)?.[1];
    if (m.c === 'eu.dinheiro' || ATIVOS.some((a) => m.c === `eu.${a}`)) total += m.d;
    else if (m.c === 'eu.divida') total -= m.d;
    else if (empresa) total += m.d * (typeof participacao === 'number' ? participacao : (participacao[empresa] ?? 1));
    // Os bens também: o imóvel que valorizou e a dívida do financiamento que diminuiu.
    else if (/^bem\d+\.valor$/.test(m.c)) total += m.d;
    else if (/^bem\d+\.financiado$/.test(m.c)) total -= m.d;
  }
  return total;
}

/** O que os imóveis alugados pagaram no ano (anotado à parte pela regra dos bens). */
export function alugueisDoAno(regra: Entrada): number {
  // O aluguel entra na conta; com dívida, parte dele já vai para ela (e conta do mesmo jeito).
  return (regra.mudancas ?? []).reduce((s, m) => s + (m.r !== 'aluguel' ? 0 : m.c === 'eu.dinheiro' ? (m.d ?? 0) : m.c === 'eu.divida' ? -(m.d ?? 0) : 0), 0);
}

/** O chip do balanço do ano, na primeira entrada visível do ano (só para adultos, só quando mexe). */
export function chipDoBalanco(regra: Entrada | undefined, participacao: Participacoes): Chip | null {
  if (!regra || regra.idade < 18) return null;
  const v = balancoDoAno(regra, participacao);
  if (Math.abs(v) < 1000) return null;
  return { texto: `patrimônio ${sinal(v)}${dinheiroCurto(Math.abs(v))}`, cor: 'var(--dinheiro)', ruim: v < 0 };
}

/** Os aluguéis do ano, na linha do balanço. */
export function chipDosAlugueis(regra: Entrada | undefined): Chip | null {
  if (!regra) return null;
  const v = alugueisDoAno(regra);
  return v >= 1 ? { texto: `aluguéis +${dinheiroCurto(v)}`, cor: 'var(--dinheiro)' } : null;
}

/** "seu filho", "sua sobrinha": quem continua a história, do ponto de vista de quem morreu. */
export function parentesco(h: { genero: 'f' | 'm'; parentesco: Parentesco }): string {
  const f = h.genero === 'f';
  if (h.parentesco === 'sobrinho') return f ? 'sua sobrinha' : 'seu sobrinho';
  if (h.parentesco === 'amor') return f ? 'sua companheira' : 'seu companheiro';
  if (h.parentesco === 'amigo') return f ? 'sua melhor amiga' : 'seu melhor amigo';
  return f ? 'sua filha' : 'seu filho';
}

export function anos(n: number): string {
  return n === 1 ? '1 ano' : `${n} anos`;
}
