/**
 * Dinheiro só onde gera decisão. Tudo é contado em reais de hoje: a inflação
 * aparece como o que ela faz com o dinheiro parado (encolhe), o investimento
 * rende juros compostos acima dela e a dívida cresce com juros bem acima dela.
 * O resto (resgatar para cobrir buraco, amortizar com sobra) é automático,
 * porque não é uma decisão interessante.
 */
import { aleatorio, normal, type Rng } from './rng.ts';
import {
  CHANCE_CRISE,
  INFLACAO_CRISE,
  INFLACAO_DESVIO,
  INFLACAO_MEDIA,
  JUROS_DIVIDA,
  PROPENSAO_GASTO,
  RETORNO_REAL_DESVIO,
  RETORNO_REAL_MEDIO,
  pisoCusto,
  pisoRenda,
} from './regras.ts';
import type { EstadoVida, Financas } from './tipos.ts';

export function sortearInflacao(rng: Rng): number {
  let i = normal(rng, INFLACAO_MEDIA, INFLACAO_DESVIO);
  if (aleatorio(rng) < CHANCE_CRISE) i += INFLACAO_CRISE;
  return Math.min(0.2, Math.max(0.005, i));
}

/** Cobre dinheiro negativo com investimento e, se não der, com dívida; sobra amortiza dívida. */
export function acertarCaixa(f: Financas): void {
  if (f.dinheiro < 0 && f.investido > 0) {
    const resgate = Math.min(f.investido, -f.dinheiro);
    f.investido -= resgate;
    f.dinheiro += resgate;
  }
  if (f.dinheiro < 0) {
    f.divida += -f.dinheiro;
    f.dinheiro = 0;
  }
  if (f.dinheiro > 0 && f.divida > 0) {
    const pago = Math.min(f.dinheiro, f.divida);
    f.dinheiro -= pago;
    f.divida -= pago;
  }
}

/**
 * Um ano de economia. Devolve quanto a inflação comeu do dinheiro parado.
 * Da sobra do ano (renda menos custo), uma parte vira padrão de vida; o resto fica.
 */
export function economiaDoAno(e: EstadoVida, rng: Rng): number {
  const f = e.financas;
  const inflacao = sortearInflacao(rng);
  const retornoReal = normal(rng, RETORNO_REAL_MEDIO, RETORNO_REAL_DESVIO);
  f.inflacao = Math.round(inflacao * 1000) / 10;

  const antes = f.dinheiro;
  f.dinheiro /= 1 + inflacao;
  const comida = antes - f.dinheiro;
  f.investido *= 1 + retornoReal;
  f.divida *= (1 + JUROS_DIVIDA) / (1 + inflacao);

  if (e.idade >= 18) {
    const sobra = Math.max(f.renda, pisoRenda(e.idade)) - Math.max(f.custo, pisoCusto(e.idade));
    f.dinheiro += sobra > 0 ? sobra * (1 - PROPENSAO_GASTO) : sobra;
  }
  acertarCaixa(f);
  return comida;
}

/** Aplica movimentos de dinheiro (reais de hoje); devolve as diferenças visíveis. */
export function movimentar(
  e: EstadoVida,
  mov: { dinheiro?: number | undefined; investir?: number | undefined; divida?: number | undefined },
): { dinheiro: number; investido: number; divida: number } {
  const f = e.financas;
  const antes = { dinheiro: f.dinheiro, investido: f.investido, divida: f.divida };
  if (mov.dinheiro) f.dinheiro += mov.dinheiro;
  // Dívida negativa é desconto ou perdão; para pagar com dinheiro, some também um dinheiro negativo.
  if (mov.divida) f.divida = Math.max(0, f.divida + mov.divida);
  if (mov.investir) {
    if (mov.investir > 0) {
      const valor = Math.min(mov.investir, Math.max(f.dinheiro, 0));
      f.dinheiro -= valor;
      f.investido += valor;
    } else {
      const valor = Math.min(-mov.investir, f.investido);
      f.investido -= valor;
      f.dinheiro += valor;
    }
  }
  acertarCaixa(f);
  return {
    dinheiro: f.dinheiro - antes.dinheiro,
    investido: f.investido - antes.investido,
    divida: f.divida - antes.divida,
  };
}
