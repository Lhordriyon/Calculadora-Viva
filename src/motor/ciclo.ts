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

/** Um ano do ciclo: talvez mude de fase (com entrada visível). Devolve a fase em vigor no ano. */
export function cicloDoAno(e: EstadoVida, c: Conteudo): DefFase {
  const atual = faseDe(e);
  const def = defFase(c, atual);
  // Quem governa empurra o ciclo (pais.impulso, de −3 a 3): decretos que aquecem deixam a expansão mais provável e a recessão menos.
  const impulso = e.entidades['pais']?.n['impulso'] ?? 0;
  const ajuste = (f: Fase, p: number): number =>
    f === 'expansao' ? p * Math.max(0.2, 1 + 0.4 * impulso) : f === 'recessao' || f === 'crise' ? p * Math.max(0.2, 1 - 0.3 * impulso) : p;
  let r = aleatorio(e.rng);
  let proxima: Fase = atual;
  for (const [f, bruto] of Object.entries(def.transicoes) as [Fase, number][]) {
    const p = ajuste(f, bruto);
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
