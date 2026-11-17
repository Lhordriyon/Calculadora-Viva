/**
 * O indicador de saturação (etapa 03, I-197): o mundo ainda oferece algo do tamanho de quem joga?
 *
 * Mede o que poderia acontecer, não o que apareceu: ausência de notificação não é ausência de conteúdo. Cada
 * componente vai de 0 (o mundo responde) a 1 (o mundo não responde mais), e o indicador é a média dos componentes que
 * valem para aquela vida naquele ano (sem empresa, a concorrência não conta; sem salário, o salário não conta).
 *
 * - escala: a parte dos storylets elegíveis que mexe em 1% do patrimônio ou mais (15% ou mais = 0);
 * - investimento: a parte do dinheiro aplicado que o mercado já não comporta;
 * - concorrência: com empresa, a maior concorrente diante dela (metade do tamanho ou mais = 0);
 * - objetivos: os planos e sonhos de pé e os que dá para começar (quatro ou mais = 0);
 * - repetição: dos storylets que apareceram no ano, os que já tinham aparecido (nesta vida ou nas anteriores);
 * - consequência econômica: nas decisões que pretendem mudar valor (escolhas, ações e jogadas que mexem na empresa, no
 *   grupo, nos investimentos, no poder ou na coroa) dos últimos cinco anos, a mediana do que mudou diante do patrimônio
 *   (0,1% ou mais = 0: o que um gasto do dia a dia é para a classe média), só entre as que mexeram em dinheiro; mover
 *   dinheiro entre os próprios bolsos (aplicar, mandar para a holding) não conta;
 * - salário: trinta anos de renda (uma carreira) diante do patrimônio (o trabalho que ainda pesa = 0).
 *
 * Esgotado é o indicador em 0,7 ou mais por cinco anos seguidos.
 */
import type { FotoDoAno, Registro, VidaObservada } from './observacao.ts';

export const COMPONENTES = ['escala', 'investimento', 'concorrencia', 'objetivos', 'repeticao', 'consequencia', 'salario'] as const;
export type Componente = (typeof COMPONENTES)[number];

export interface SaturacaoDoAno {
  ano: number;
  idade: number;
  indice: number;
  componentes: Partial<Record<Componente, number>>;
}

export interface SaturacaoDaVida {
  anos: SaturacaoDoAno[];
  /** O primeiro ano de cinco seguidos em 0,7 ou mais. */
  esgotadoDesde: number | null;
  media: number;
  maxima: number;
}

export const LIMIAR_DE_ESGOTAMENTO = 0.7;
export const ANOS_DE_ESGOTAMENTO = 5;

const AREAS_GRANDES = new Set(['empresa', 'grupo', 'investimentos', 'jogada', 'politica', 'coroa']);

const entre01 = (x: number): number => Math.max(0, Math.min(1, x));

function mediana(xs: number[]): number {
  if (xs.length === 0) return 0;
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor((o.length - 1) / 2)]!;
}

/** O indicador de um ano, pela foto e pelas decisões grandes dos últimos cinco anos. */
export function saturacaoDoAno(f: FotoDoAno, decisoes: readonly Registro[]): SaturacaoDoAno {
  const c: Partial<Record<Componente, number>> = {};
  const patrimonio = Math.max(1, f.patrimonio);
  c.escala = 1 - entre01(f.oportunidades.deEscala / Math.max(1, f.oportunidades.elegiveis) / 0.15);
  c.investimento = 1 - entre01(f.mercadoCabe);
  if (f.nEmpresas > 0) c.concorrencia = 1 - entre01(f.maiorRival / 0.5);
  // Os objetivos só contam a partir dos 16: é quando a vida pergunta o que quem joga quer dela (o sonho aos 15).
  if (f.idade >= 16) c.objetivos = 1 - entre01((f.planos + f.sonhos + f.possiveis) / 4);
  if (f.mostrados > 0) c.repeticao = f.repetidos / f.mostrados;
  const grandes = decisoes.filter(
    (r) =>
      r.ano > f.ano - 5 &&
      r.ano <= f.ano &&
      (r.tipo === 'escolha' || r.tipo === 'acao' || r.ref === 'jogada') &&
      Math.abs(r.efeito.patrimonio) >= 1 &&
      (AREAS_GRANDES.has(r.area) || r.areas.some((a) => AREAS_GRANDES.has(a))),
  );
  if (grandes.length > 0) c.consequencia = 1 - entre01(mediana(grandes.map((r) => Math.abs(r.efeito.patrimonio) / Math.max(1, Math.abs(r.antes)))) / 0.001);
  if (f.renda > 0) c.salario = 1 - entre01((30 * f.renda) / patrimonio);
  const valores = Object.values(c);
  return { ano: f.ano, idade: f.idade, indice: valores.reduce((s, x) => s + x, 0) / Math.max(1, valores.length), componentes: c };
}

/** O indicador ano a ano de uma vida observada, com o ano em que ela se esgotou (se se esgotou). */
export function saturacaoDaVida(vida: VidaObservada): SaturacaoDaVida {
  const anos = vida.anos.filter((f) => f.oportunidades.elegiveis > 0 || f.idade < 1).map((f) => saturacaoDoAno(f, vida.registros));
  let seguidos = 0;
  let esgotadoDesde: number | null = null;
  for (const a of anos) {
    seguidos = a.indice >= LIMIAR_DE_ESGOTAMENTO ? seguidos + 1 : 0;
    if (seguidos >= ANOS_DE_ESGOTAMENTO && esgotadoDesde === null) esgotadoDesde = anos[anos.indexOf(a) - ANOS_DE_ESGOTAMENTO + 1]!.ano;
  }
  const indices = anos.map((a) => a.indice);
  return {
    anos,
    esgotadoDesde,
    media: indices.length > 0 ? indices.reduce((s, x) => s + x, 0) / indices.length : 0,
    maxima: indices.length > 0 ? Math.max(...indices) : 0,
  };
}
