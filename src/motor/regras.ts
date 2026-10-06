/**
 * Números de equilíbrio do motor. Mudou algo aqui, rode `npm run tunel`
 * e registre o antes/depois em docs/decisoes.md.
 */

/** Chance de um ano trazer evento (se houver evento elegível), por idade. */
export function ritmo(idade: number): number {
  if (idade <= 4) return 0.35;
  if (idade <= 12) return 0.6;
  if (idade <= 29) return 0.8;
  if (idade <= 49) return 0.65;
  if (idade <= 64) return 0.55;
  return 0.45;
}

/** Risco anual de morte natural: curva de Gompertz ajustada pela saúde. */
export function riscoDeMorte(idade: number, saude: number): number {
  if (saude <= 0) return 1;
  const base = idade < 15 ? 0.0002 : 0.00003 * Math.exp(0.09 * idade);
  const fatorSaude = Math.exp((60 - saude) / 15);
  return Math.min(1, base * fatorSaude);
}

/** Idade-limite: ninguém passa disso. */
export const IDADE_MAXIMA = 120;

/** Deriva anual da saúde só pela idade (antes de ruído, marcas e eventos). */
export function derivaSaude(idade: number, saude: number): number {
  if (idade < 25) return (85 - saude) * 0.15;
  if (idade < 45) return -0.4;
  if (idade < 60) return -0.9;
  if (idade < 75) return -1.4;
  return -2.2;
}

/** A felicidade volta devagar para a linha de base: ninguém vive de pico. */
export const FELICIDADE_BASE = 60;
export const RETORNO_FELICIDADE = 0.12;

export function derivaInteligencia(idade: number): number {
  if (idade >= 4 && idade <= 21) return 1.2;
  if (idade < 60) return 0.1;
  if (idade < 75) return -0.4;
  return -0.8;
}

export function derivaAparencia(idade: number): number {
  if (idade < 30) return 0;
  if (idade < 60) return -0.35;
  return -0.6;
}

/** Inflação anual sorteada: média de 4,5% com anos de crise ocasionais. */
export const INFLACAO_MEDIA = 0.045;
export const INFLACAO_DESVIO = 0.02;
export const CHANCE_CRISE = 0.08;
export const INFLACAO_CRISE = 0.06;

/** Retorno real (acima da inflação) dos investimentos, com anos ruins. */
export const RETORNO_REAL_MEDIO = 0.04;
export const RETORNO_REAL_DESVIO = 0.05;

/** Juros nominais anuais da dívida (cartão, cheque especial, financiamento). */
export const JUROS_DIVIDA = 0.22;

/** Da sobra de cada ano (renda menos custo-base), quanto vira padrão de vida. */
export const PROPENSAO_GASTO = 0.6;

/** Renda mínima de bicos e auxílios (reais de hoje por ano). */
export function pisoRenda(idade: number): number {
  if (idade < 18) return 0;
  if (idade < 65) return 9000;
  return 18000;
}

/** Custo mínimo de vida de um adulto (reais de hoje por ano). */
export function pisoCusto(idade: number): number {
  return idade < 18 ? 0 : 10000;
}

/** Dívida que começa a tirar o sono (reais de hoje). */
export function dividaPesada(renda: number): number {
  return Math.max(10000, renda * 0.5);
}

/** Patrimônio que dá um pouco de paz (reais de hoje). */
export const PATRIMONIO_CONFORTO = 200000;
