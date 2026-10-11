/**
 * O ciclo da economia do país: normal, expansão, recessão e crise, numa
 * cadeia de Markov com as chances em dados (`mundo.json › fases`). Fora do
 * normal, a fase é uma qualidade do país cuja causa é a entrada que a
 * anunciou: um storylet que consulta `pais.recessao` liga o que aconteceu com
 * quem joga ao que aconteceu com o país (e o cartão da vida pode contar
 * "aos 34, o país entrou em recessão → aos 35, você perdeu o emprego").
 * A fase mexe na inflação, no rendimento, no desemprego e nos salários.
 */
import type { Fase } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefFase } from './esquema.ts';
import { ganhar, lancar, novaEntrada, perder } from './livro.ts';
import { aleatorio, sortear, sortearIndice } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

/** A fase atual: a qualidade de fase que o país tem, ou normal. */
export function faseDe(e: EstadoVida): Fase {
  const q = e.entidades['pais']?.q ?? {};
  if (q['crise']) return 'crise';
  if (q['recessao']) return 'recessao';
  if (q['expansao']) return 'expansao';
  return 'normal';
}

export function defFase(c: Conteudo, fase: Fase): DefFase {
  return c.mundo.fases.find((f) => f.id === fase) ?? c.mundo.fases[0]!;
}

/** A vida começa numa fase sorteada pelo peso de cada uma (sem entrada no livro: é o mundo em que se nasce). */
export function sortearFaseInicial(e: EstadoVida, c: Conteudo): void {
  const fases = c.mundo.fases;
  const f = fases[sortearIndice(e.rng, fases.map((x) => x.peso))]!;
  if (f.id !== 'normal') ganhar(e, [], 'pais', f.id, null);
}

/** Da pior para a melhor: sair da crise para a recessão é melhorar. */
const ORDEM_DAS_FASES: Record<Fase, number> = { crise: 0, recessao: 1, normal: 2, expansao: 3 };

/**
 * As chances de mudar de fase neste ano, com o empurrão de quem governa
 * (pais.impulso, de −3 a 3): aquecer deixa toda melhora mais provável e toda
 * piora menos; esfriar faz o contrário. A melhora é pela ordem das fases, não
 * pelo nome: da crise para a recessão já é melhorar.
 */
export function chancesDeMudar(e: EstadoVida, c: Conteudo, atual: Fase = faseDe(e)): [Fase, number][] {
  const impulso = e.entidades['pais']?.n['impulso'] ?? 0;
  const chances = (Object.entries(defFase(c, atual).transicoes) as [Fase, number][]).map(([f, p]): [Fase, number] => {
    const melhora = ORDEM_DAS_FASES[f] > ORDEM_DAS_FASES[atual];
    // Esfriar pode no máximo cortar pela metade a chance de melhorar: o país se ajusta sozinho, cedo ou tarde.
    return [f, p * (melhora ? Math.max(0.5, 1 + 0.4 * impulso) : Math.max(0.2, 1 - 0.3 * impulso))];
  });
  // As chances somam no máximo 1 (o resto é ficar onde está).
  const soma = chances.reduce((s, [, p]) => s + p, 0);
  return soma > 1 ? chances.map(([f, p]) => [f, p / soma]) : chances;
}

/** Um ano do ciclo: talvez mude de fase (com entrada visível). Devolve a fase em vigor no ano. */
export function cicloDoAno(e: EstadoVida, c: Conteudo): DefFase {
  const atual = faseDe(e);
  const def = defFase(c, atual);
  let r = aleatorio(e.rng);
  let proxima: Fase = atual;
  for (const [f, p] of chancesDeMudar(e, c, atual)) {
    if (r < p) {
      proxima = f;
      break;
    }
    r -= p;
  }
  if (proxima === atual) return def;
  const nova = defFase(c, proxima);
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `ciclo:${proxima}`, ator: 'pais', texto: '' });
  const reg: Mudanca[] = [];
  if (atual !== 'normal') perder(e, reg, 'pais', atual);
  if (proxima !== 'normal') ganhar(e, reg, 'pais', proxima, entrada.id);
  const ctx = contexto(e, { ator: 'pais' });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, nova.textos), ctx));
  entrada.resumo = renderizar(nova.resumo, ctx);
  lancar(e, entrada, reg);
  return nova;
}
