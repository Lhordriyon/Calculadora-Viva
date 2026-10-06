import type { Atributo } from '../motor/esquema.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { Entrada } from '../motor/tipos.ts';

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

/** Os efeitos visíveis de uma entrada, para os chips da linha do tempo. */
export function chipsDe(h: Entrada, mostrarInflacao = false): Chip[] {
  const chips: Chip[] = [];
  const d = h.deltas ?? {};
  for (const a of Object.keys(NOMES) as Atributo[]) {
    const v = Math.round(d[a] ?? 0);
    if (v !== 0) chips.push({ texto: `${sinal(v)}${Math.abs(v)} ${NOMES[a]}`, cor: CORES[a] });
  }
  if (d.dinheiro && Math.abs(d.dinheiro) >= 1) {
    chips.push({ texto: `${sinal(d.dinheiro)}${dinheiro(d.dinheiro)}`, cor: 'var(--dinheiro)', ruim: d.dinheiro < 0 });
  }
  if (d.investido && Math.abs(d.investido) >= 1) {
    chips.push({ texto: `${d.investido > 0 ? 'investiu' : 'resgatou'} ${dinheiro(d.investido)}`, cor: 'var(--dinheiro)' });
  }
  if (d.divida && Math.abs(d.divida) >= 1) {
    chips.push({ texto: `dívida ${sinal(d.divida)}${dinheiro(d.divida)}`, ruim: d.divida > 0, cor: 'var(--dinheiro)' });
  }
  if (d.renda && Math.abs(d.renda) >= 1) {
    chips.push({ texto: `renda ${sinal(d.renda)}${dinheiro(d.renda)}/mês`, cor: 'var(--dinheiro)', ruim: d.renda < 0 });
  }
  if (mostrarInflacao && h.inflacao) chips.push({ texto: `a inflação comeu ${dinheiro(h.inflacao)} do dinheiro parado`, neutro: true });
  return chips;
}

export function anos(n: number): string {
  return n === 1 ? '1 ano' : `${n} anos`;
}
