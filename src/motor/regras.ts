/**
 * Números de equilíbrio do motor. Mudou algo aqui, rode `npm run tunel`
 * e registre o antes/depois em docs/decisoes.md.
 */

/** Chance de um ano trazer evento (se houver evento elegível), por idade. */
export function ritmo(idade: number): number {
  if (idade <= 4) return 0.3;
  if (idade <= 12) return 0.5;
  if (idade <= 29) return 0.65;
  if (idade <= 49) return 0.5;
  if (idade <= 64) return 0.45;
  return 0.35;
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
export const PROPENSAO_GASTO = 0.75;
/** Quem está devendo aperta o cinto: gasta menos da sobra e paga a dívida. */
export const PROPENSAO_GASTO_ENDIVIDADO = 0.4;

/** Limite de crédito: o banco empresta (e cobra juros) até tantas rendas anuais, com um mínimo. */
export const LIMITE_CREDITO_MINIMO = 30000;
export const LIMITE_CREDITO_RENDAS = 2;

/** Felicidade perdida num ano de privação (o déficit não coube no crédito). */
export const PRIVACAO_FELICIDADE = 2;

/** Renda mínima de bicos e auxílios (reais de hoje por ano). */
export function pisoRenda(idade: number): number {
  if (idade < 18) return 0;
  if (idade < 65) return 9000;
  return 18000;
}

/**
 * Depois da aposentadoria, a velhice consome uma parte do patrimônio por ano
 * (remédio, plano de saúde, ajuda aos filhos): quem vive mais não acumula
 * para sempre.
 */
export const GASTO_VELHICE = 0.04;
export const IDADE_GASTO_VELHICE = 65;

/** Custo mínimo de vida de um adulto (reais de hoje por ano). */
export function pisoCusto(idade: number): number {
  return idade < 18 ? 0 : 10000;
}

/** Dívida que começa a tirar o sono (reais de hoje). */
export function dividaPesada(renda: number): number {
  return Math.max(10000, renda * 0.5);
}

/** Patrimônio que dá um pouco de paz (reais de hoje), e quanta paz por ano. */
export const PATRIMONIO_CONFORTO = 200000;
export const CONFORTO_FELICIDADE = 0.5;

// ---------------------------------------------------------------- personagens

/** Chance anual de um personagem adoecer (antes do traço). */
export function chanceDoenca(idade: number): number {
  if (idade < 40) return 0.008;
  if (idade < 60) return 0.025;
  if (idade < 75) return 0.05;
  return 0.09;
}
/** Saúde perdida ao adoecer e por ano enquanto doente. */
export const DOENCA_QUEDA = 14;
export const DOENCA_POR_ANO = 2.5;
export const CHANCE_CURA = 0.35;
/** Chance anual de demissão com o desemprego do lugar em 8%. */
export const DEMISSAO_BASE = 0.04;
export const RECOLOCACAO = 0.38;
export const IDADE_APOSENTADORIA = 65;
/** O vínculo volta devagar para o ponto de equilíbrio da família. */
export const RETORNO_VINCULO = 0.06;
/** Vínculo perdido por ano depois dos 20 de quem joga, sem contato (amigos perdem mais). */
export const DISTANCIA_ADULTO = 1.2;
/** Filho adulto cria a própria vida: fração da distância de quem joga que ele perde por ano. */
export const DISTANCIA_FILHO = 1.2;
/** Vínculo do casal que a rotina gasta por ano, sem cuidado. */
export const DESGASTE_CASAL = 1.4;
/** Chance anual de alguém aparecer na vida de quem está sem namoro (antes de paquera, aparência e traço). */
export function chanceDeAmor(idade: number): number {
  if (idade < 16) return 0;
  if (idade < 18) return 0.06;
  if (idade < 30) return 0.18;
  if (idade < 45) return 0.12;
  if (idade < 60) return 0.07;
  return 0.035;
}
/** Cada ponto de paquera (sair, conhecer gente) aumenta a chance em tanto, até 3 pontos. */
export const PAQUERA_AMOR = 0.6;
/** Namoro que dura isso (anos) já é união: a morte de quem você ama deixa você viúv{o|a}. */
export const ANOS_UNIAO = 5;

/** Chance anual de um personagem tomar uma iniciativa (quando há storylet para isso). */
export const ATIVIDADE_PERSONAGEM = 0.22;
/** Quanto o vínculo médio com quem está perto puxa a felicidade de base (por ponto acima de 50). */
export const PESO_VINCULO_FELICIDADE = 0.09;
/** Acima disso, mais vínculo não traz mais felicidade de base (retorno decrescente). */
export const TETO_VINCULO_FELICIDADE = 78;
