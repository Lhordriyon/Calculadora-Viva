/**
 * Dinheiro em reais de hoje. A inflação aparece como o que ela faz com o
 * dinheiro parado (encolhe), o investimento rende juros compostos acima dela
 * e a dívida cresce com juros bem acima dela. O resto (resgatar para cobrir
 * buraco, amortizar com sobra) é automático, porque não é uma decisão.
 * Toda variação vai para o livro-razão.
 */
import { anotar } from './livro.ts';
import { normal, type Rng } from './rng.ts';
import {
  GASTO_VELHICE,
  IDADE_GASTO_VELHICE,
  INFLACAO_DESVIO,
  INFLACAO_MEDIA,
  JUROS_DIVIDA,
  LIMITE_CREDITO_MINIMO,
  LIMITE_CREDITO_RENDAS,
  PROPENSAO_GASTO,
  PROPENSAO_GASTO_ENDIVIDADO,
  RETORNO_REAL_DESVIO,
  RETORNO_REAL_MEDIO,
  pisoCusto,
  pisoRenda,
} from './regras.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

type Numeros = Record<string, number>;

/** Inflação do ano: média de 4,5% mais o que a fase do ciclo soma (a crise empurra para cima). */
export function sortearInflacao(rng: Rng, extra = 0): number {
  const i = normal(rng, INFLACAO_MEDIA + extra, INFLACAO_DESVIO);
  return Math.min(0.25, Math.max(0.005, i));
}

/** Cobre dinheiro negativo com investimento e, se não der, com dívida; sobra amortiza dívida. */
export function acertarCaixa(n: Numeros): void {
  const dinheiro = n['dinheiro'] ?? 0;
  const investido = n['investido'] ?? 0;
  if (dinheiro < 0 && investido > 0) {
    const resgate = Math.min(investido, -dinheiro);
    n['investido'] = investido - resgate;
    n['dinheiro'] = dinheiro + resgate;
  }
  if ((n['dinheiro'] ?? 0) < 0) {
    n['divida'] = (n['divida'] ?? 0) - n['dinheiro']!;
    n['dinheiro'] = 0;
  }
  if ((n['dinheiro'] ?? 0) > 0 && (n['divida'] ?? 0) > 0) {
    const pago = Math.min(n['dinheiro']!, n['divida']!);
    n['dinheiro']! -= pago;
    n['divida']! -= pago;
  }
}

const CAMPOS_CAIXA = ['dinheiro', 'investido', 'divida'] as const;

/** Anota no livro a diferença do caixa de uma entidade entre dois momentos. */
function anotarCaixa(reg: Mudanca[], ent: string, antes: Numeros, n: Numeros, r?: string): void {
  for (const k of CAMPOS_CAIXA) anotar(reg, `${ent}.${k}`, (n[k] ?? 0) - (antes[k] ?? 0), r);
}

export interface Ano {
  /** Quanto a inflação comeu do dinheiro parado. */
  comida: number;
  /** O déficit do ano não coube no crédito: a pessoa cortou o que não podia. */
  privacao: boolean;
  /** Quanto o custo do ano passou da renda (saiu da reserva ou do crédito). */
  deficit: number;
}

/**
 * Um ano de economia de quem joga. Da sobra do ano (renda menos custo), uma
 * parte vira padrão de vida (menos, para quem está devendo). Déficit vira
 * dívida só até o limite de crédito; acima dele, a dívida congela e o resto
 * do déficit vira privação.
 */
/** O que a fase do ciclo muda na economia do ano (somado às médias). */
export interface FaseEconomica {
  inflacao: number;
  retorno: number;
}

export function economiaDoAno(e: EstadoVida, rng: Rng, reg: Mudanca[], fase: FaseEconomica = { inflacao: 0, retorno: 0 }): Ano {
  const n = e.entidades['eu']!.n;
  const antes = { dinheiro: n['dinheiro'] ?? 0, investido: n['investido'] ?? 0, divida: n['divida'] ?? 0 };
  const inflacao = sortearInflacao(rng, fase.inflacao);
  const retornoReal = normal(rng, RETORNO_REAL_MEDIO + fase.retorno, RETORNO_REAL_DESVIO);
  const pais = e.entidades['pais']!.n;
  anotar(reg, 'pais.inflacao', Math.round(inflacao * 1000) / 10 - (pais['inflacao'] ?? 0), 'economia');
  pais['inflacao'] = Math.round(inflacao * 1000) / 10;

  const dinheiroAntes = n['dinheiro'] ?? 0;
  n['dinheiro'] = dinheiroAntes / (1 + inflacao);
  const comida = dinheiroAntes - n['dinheiro'];
  n['investido'] = (n['investido'] ?? 0) * (1 + retornoReal);
  const renda = n['renda'] ?? 0;
  const limite = limiteDeCredito(renda);
  const comJuros = Math.min(n['divida'] ?? 0, limite);
  n['divida'] = (n['divida'] ?? 0) + comJuros * ((1 + JUROS_DIVIDA) / (1 + inflacao) - 1);

  let privacao = false;
  let deficit = 0;
  if (e.idade >= 18) {
    const custoVida = e.entidades['lugar']?.n['custo_vida'] ?? 1;
    const sobra = Math.max(renda, pisoRenda(e.idade)) - Math.max(n['custo'] ?? 0, pisoCusto(e.idade) * custoVida);
    if (sobra >= 0) {
      n['dinheiro'] += sobra * (1 - ((n['divida'] ?? 0) > 0 ? PROPENSAO_GASTO_ENDIVIDADO : PROPENSAO_GASTO));
    } else {
      deficit = -sobra;
      const folga = Math.max(0, n['dinheiro']) + (n['investido'] ?? 0) + Math.max(0, limite - (n['divida'] ?? 0));
      const coberto = Math.min(-sobra, folga);
      n['dinheiro'] -= coberto;
      privacao = coberto < -sobra;
    }
  }
  if (e.idade >= IDADE_GASTO_VELHICE) {
    const patrimonio = (n['dinheiro'] ?? 0) + (n['investido'] ?? 0) - (n['divida'] ?? 0);
    if (patrimonio > 0) n['dinheiro'] = (n['dinheiro'] ?? 0) - patrimonio * GASTO_VELHICE;
  }
  acertarCaixa(n);
  anotarCaixa(reg, 'eu', antes, n, 'economia');
  return { comida, privacao, deficit };
}

/** Até onde o banco empresta (e cobra juros): reais de hoje. */
export function limiteDeCredito(renda: number): number {
  return Math.max(LIMITE_CREDITO_MINIMO, renda * LIMITE_CREDITO_RENDAS);
}

export interface Movimento {
  dinheiro?: number | undefined;
  investir?: number | undefined;
  divida?: number | undefined;
}

/** Aplica movimentos de dinheiro (reais de hoje) numa entidade e anota no livro. */
export function movimentar(e: EstadoVida, reg: Mudanca[], mov: Movimento, ent = 'eu', r?: string): void {
  const n = e.entidades[ent]?.n;
  if (!n) return;
  const antes = { dinheiro: n['dinheiro'] ?? 0, investido: n['investido'] ?? 0, divida: n['divida'] ?? 0 };
  if (mov.dinheiro) n['dinheiro'] = (n['dinheiro'] ?? 0) + mov.dinheiro;
  // Dívida negativa é desconto ou perdão; para pagar com dinheiro, some também um dinheiro negativo.
  if (mov.divida) n['divida'] = Math.max(0, (n['divida'] ?? 0) + mov.divida);
  if (mov.investir) {
    if (mov.investir > 0) {
      const valor = Math.min(mov.investir, Math.max(n['dinheiro'] ?? 0, 0));
      n['dinheiro'] = (n['dinheiro'] ?? 0) - valor;
      n['investido'] = (n['investido'] ?? 0) + valor;
    } else {
      const valor = Math.min(-mov.investir, n['investido'] ?? 0);
      n['investido'] = (n['investido'] ?? 0) - valor;
      n['dinheiro'] = (n['dinheiro'] ?? 0) + valor;
    }
  }
  // Só quem joga tem banco (crédito, dívida); personagens ficam com o saldo como está.
  if (ent === 'eu') acertarCaixa(n);
  anotarCaixa(reg, ent, antes, n, r);
}
