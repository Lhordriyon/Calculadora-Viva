import { ATIVOS } from '../motor/constantes.ts';
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
const PAPEIS_COM_VINCULO = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho'];

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
  for (const m of h.mudancas ?? []) if (m.d !== undefined) d.set(m.c, (d.get(m.c) ?? 0) + m.d);
  return d;
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
  }
  if (mostrarInflacao && h.inflacao) chips.push({ texto: `a inflação comeu ${dinheiro(h.inflacao)} do dinheiro parado`, neutro: true });
  return chips;
}

/** O balanço de um ano (a entrada invisível das regras): salário guardado, rendimentos, inflação, empresa. */
export function balancoDoAno(regra: Entrada, participacao: number): number {
  let total = 0;
  for (const m of regra.mudancas ?? []) {
    if (m.d === undefined) continue;
    if (m.c === 'eu.dinheiro' || ATIVOS.some((a) => m.c === `eu.${a}`)) total += m.d;
    else if (m.c === 'eu.divida') total -= m.d;
    else if (m.c === 'empresa.valor') total += m.d * participacao;
  }
  return total;
}

/** O chip do balanço do ano, na primeira entrada visível do ano (só para adultos, só quando mexe). */
export function chipDoBalanco(regra: Entrada | undefined, participacao: number): Chip | null {
  if (!regra || regra.idade < 18) return null;
  const v = balancoDoAno(regra, participacao);
  if (Math.abs(v) < 1000) return null;
  return { texto: `no ano, ${sinal(v)}${dinheiro(v)} de patrimônio`, cor: 'var(--dinheiro)', ruim: v < 0 };
}

/** "seu filho", "sua sobrinha": quem continua a história, do ponto de vista de quem morreu. */
export function parentesco(h: { genero: 'f' | 'm'; parentesco: 'filho' | 'sobrinho' }): string {
  if (h.parentesco === 'sobrinho') return h.genero === 'f' ? 'sua sobrinha' : 'seu sobrinho';
  return h.genero === 'f' ? 'sua filha' : 'seu filho';
}

export function anos(n: number): string {
  return n === 1 ? '1 ano' : `${n} anos`;
}
