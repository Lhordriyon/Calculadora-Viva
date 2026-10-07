/**
 * Dinheiro em reais de hoje. A inflação aparece como o que ela faz com o
 * dinheiro parado (encolhe), o investimento rende juros compostos acima dela
 * e a dívida cresce com juros bem acima dela. O resto (resgatar para cobrir
 * buraco, amortizar com sobra) é automático, porque não é uma decisão.
 * Toda variação vai para o livro-razão.
 */
import { ATIVOS, LIQUIDEZ, type Ativo } from './constantes.ts';
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

/** Tira até `valor` das classes investidas, na ordem dada (a de liquidez, por padrão). Devolve quanto saiu. */
export function resgatarDe(n: Numeros, valor: number, ordem: readonly Ativo[] = LIQUIDEZ): number {
  let falta = valor;
  for (const a of ordem) {
    if (falta <= 0) break;
    const tem = n[a] ?? 0;
    if (tem <= 0) continue;
    const sai = Math.min(tem, falta);
    n[a] = tem - sai;
    falta -= sai;
  }
  return valor - falta;
}

/** Põe `valor` nas classes, na proporção dos pesos (sem pesos: tudo na renda fixa). */
export function distribuir(n: Numeros, valor: number, pesos: Partial<Record<Ativo, number>> = { renda_fixa: 1 }): void {
  const total = ATIVOS.reduce((s, a) => s + (pesos[a] ?? 0), 0);
  if (total <= 0 || valor <= 0) return;
  for (const a of ATIVOS) {
    const p = pesos[a] ?? 0;
    if (p > 0) n[a] = (n[a] ?? 0) + (valor * p) / total;
  }
}

function somaInvestida(n: Numeros): number {
  let t = 0;
  for (const a of ATIVOS) t += n[a] ?? 0;
  return t;
}

/** Cobre dinheiro negativo com investimento (o mais líquido primeiro) e, se não der, com dívida; sobra amortiza dívida. */
export function acertarCaixa(n: Numeros): void {
  if ((n['dinheiro'] ?? 0) < 0) n['dinheiro'] = (n['dinheiro'] ?? 0) + resgatarDe(n, -(n['dinheiro'] ?? 0));
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

const CAMPOS_CAIXA = ['dinheiro', ...ATIVOS, 'divida'] as const;

/** O caixa de uma entidade agora (para anotar a diferença depois). */
export function caixaDe(n: Numeros): Numeros {
  const c: Numeros = {};
  for (const k of CAMPOS_CAIXA) c[k] = n[k] ?? 0;
  return c;
}

/** Anota no livro a diferença do caixa de uma entidade entre dois momentos. */
export function anotarCaixa(reg: Mudanca[], ent: string, antes: Numeros, n: Numeros, r?: string): void {
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

export function economiaDoAno(
  e: EstadoVida,
  rng: Rng,
  reg: Mudanca[],
  fase: FaseEconomica = { inflacao: 0, retorno: 0 },
  retornos: Partial<Record<Ativo, number>> = {},
): Ano {
  const n = e.entidades['eu']!.n;
  const antes = caixaDe(n);
  const inflacao = sortearInflacao(rng, fase.inflacao);
  const pais = e.entidades['pais']!.n;
  anotar(reg, 'pais.inflacao', Math.round(inflacao * 1000) / 10 - (pais['inflacao'] ?? 0), 'economia');
  pais['inflacao'] = Math.round(inflacao * 1000) / 10;

  const dinheiroAntes = n['dinheiro'] ?? 0;
  n['dinheiro'] = dinheiroAntes / (1 + inflacao);
  const comida = dinheiroAntes - n['dinheiro'];
  // Cada classe investida rende o que o mercado do ano deu a ela (acima da inflação).
  for (const a of ATIVOS) if (n[a]) n[a] = n[a] * (1 + (retornos[a] ?? 0));
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
      const folga = Math.max(0, n['dinheiro']) + somaInvestida(n) + Math.max(0, limite - (n['divida'] ?? 0));
      const coberto = Math.min(-sobra, folga);
      n['dinheiro'] -= coberto;
      privacao = coberto < -sobra;
    }
  }
  if (e.idade >= IDADE_GASTO_VELHICE) {
    const patrimonio = (n['dinheiro'] ?? 0) + somaInvestida(n) - (n['divida'] ?? 0);
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
  /** Positivo aplica da conta (pelos pesos); negativo resgata (o mais líquido primeiro). */
  investir?: number | undefined;
  divida?: number | undefined;
  /** Para onde vai o que se aplica (o perfil de investidor); sem pesos, renda fixa. */
  pesos?: Partial<Record<Ativo, number>> | undefined;
}

/** Aplica movimentos de dinheiro (reais de hoje) numa entidade e anota no livro. */
export function movimentar(e: EstadoVida, reg: Mudanca[], mov: Movimento, ent = 'eu', r?: string): void {
  const n = e.entidades[ent]?.n;
  if (!n) return;
  const antes = caixaDe(n);
  if (mov.dinheiro) n['dinheiro'] = (n['dinheiro'] ?? 0) + mov.dinheiro;
  // Dívida negativa é desconto ou perdão; para pagar com dinheiro, some também um dinheiro negativo.
  if (mov.divida) n['divida'] = Math.max(0, (n['divida'] ?? 0) + mov.divida);
  if (mov.investir) {
    if (mov.investir > 0) {
      const valor = Math.min(mov.investir, Math.max(n['dinheiro'] ?? 0, 0));
      n['dinheiro'] = (n['dinheiro'] ?? 0) - valor;
      distribuir(n, valor, mov.pesos);
    } else {
      n['dinheiro'] = (n['dinheiro'] ?? 0) + resgatarDe(n, -mov.investir);
    }
  }
  // Só quem joga tem banco (crédito, dívida); personagens ficam com o saldo como está.
  if (ent === 'eu') acertarCaixa(n);
  anotarCaixa(reg, ent, antes, n, r);
}
