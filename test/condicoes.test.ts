import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { atende, atendeDireto } from '../src/motor/condicoes.ts';
import type { Condicoes } from '../src/motor/esquema.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import { nascer } from '../src/motor/vida.ts';
import { passo } from './apoio.ts';

const c = carregarConteudo();
/** Cada condição do conteúdo com os papéis que o ator pode ocupar (undefined = sem ator). */
const condicoes: [Condicoes, (string | undefined)[]][] = [];
for (const s of c.storylets) {
  const atores = s.ator ?? [undefined];
  const doStorylet = [s.condicoes, ...(s.escolhas ?? []).map((esc) => esc.condicoes), ...Object.values(s.trechos ?? {}).flatMap((ts) => ts.map((t) => t.se))];
  for (const cond of doStorylet) if (cond) condicoes.push([cond, atores]);
}
for (const l of c.linhas) if (l.condicoes) condicoes.push([l.condicoes, [undefined]]);
for (const m of c.mortes) if (m.condicoes) condicoes.push([m.condicoes, [undefined]]);

describe('condições compiladas', () => {
  it('dão o mesmo resultado da avaliação direta em vidas reais', () => {
    let comparacoes = 0;
    let verdadeiras = 0;
    for (let i = 0; i < 30; i++) {
      const e = nascer(c, { semente: misturar(5, i), ano: 2026 });
      const robo = criarRng(i);
      while (e.vivo) {
        passo(e, c, robo);
        if (e.idade % 9 !== 0) continue;
        for (const [cond, atores] of condicoes) {
          for (const ator of atores) {
            const r = atende(cond, e, ator);
            expect(r).toBe(atendeDireto(cond, e, ator));
            comparacoes++;
            if (r) verdadeiras++;
          }
        }
      }
    }
    expect(comparacoes).toBeGreaterThan(10000);
    expect(verdadeiras).toBeGreaterThan(comparacoes * 0.05);
  });
});
