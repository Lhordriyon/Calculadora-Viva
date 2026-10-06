import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { atende, atendeDireto } from '../src/motor/condicoes.ts';
import { decidir } from '../src/motor/robos.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();
const condicoes = [
  ...c.eventos.flatMap((ev) => [ev.condicoes, ...(ev.escolhas ?? []).map((esc) => esc.condicoes)]),
  ...c.linhas.map((l) => l.condicoes),
  ...c.mortes.map((m) => m.condicoes),
].filter((x) => x !== undefined);

describe('condições compiladas', () => {
  it('dão o mesmo resultado da avaliação direta em vidas reais', () => {
    let comparacoes = 0;
    for (let i = 0; i < 40; i++) {
      const e = nascer(c, { semente: misturar(5, i), ano: 2026 });
      const robo = criarRng(i);
      while (e.vivo) {
        if (e.pendente) escolher(e, c, decidir('aleatoria', e, c, robo));
        else avancarAno(e, c);
        if (e.idade % 7 === 0) {
          for (const cond of condicoes) {
            expect(atende(cond, e)).toBe(atendeDireto(cond, e));
            comparacoes++;
          }
        }
      }
    }
    expect(comparacoes).toBeGreaterThan(1000);
  });
});
