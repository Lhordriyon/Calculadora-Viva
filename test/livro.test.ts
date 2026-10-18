import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, saveVazio } from '../src/jogo/salvar.ts';
import { copiarVida } from '../src/motor/livro.ts';
import { misturar, criarRng } from '../src/motor/rng.ts';
import type { Estrategia } from '../src/motor/robos.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { passo } from './apoio.ts';

const c = carregarConteudo();

function congelar(x: unknown): void {
  if (x === null || typeof x !== 'object' || Object.isFrozen(x)) return;
  Object.freeze(x);
  for (const v of Object.values(x)) congelar(v);
}

describe('o livro só cresce', () => {
  it('nenhuma entrada lançada muda depois: o livro congelado entre os toques não quebra a vida', () => {
    const origens = [undefined, { classe: 0 }, { classe: 6 }, { linhagem: 'realeza' }] as const;
    const estrategias: Estrategia[] = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'];
    origens.forEach((origem, o) => {
      const e = nascer(c, { semente: misturar(5150, o), ano: 2026, ...(origem ? { origem } : {}) });
      const robo = criarRng(o + 1);
      // Em modo estrito (módulos), mexer numa entrada congelada lança erro.
      while (e.vivo) {
        for (const h of e.historico) congelar(h);
        passo(e, c, robo, estrategias[o]);
      }
      expect(e.historico.length).toBeGreaterThan(50);
    });
  });

  it('a cópia que divide o livro joga a mesma vida que a cópia inteira, e não toca na anterior', () => {
    let a = nascer(c, { semente: 77, ano: 2026 });
    let b = structuredClone(a);
    const ra = criarRng(9);
    const rb = criarRng(9);
    const anteriores: { vida: EstadoVida; save: string }[] = [];
    while (a.vivo) {
      const antes = a;
      a = copiarVida(a);
      b = structuredClone(b);
      passo(a, c, ra, 'aleatoria');
      passo(b, c, rb, 'aleatoria');
      if (anteriores.length < 40) anteriores.push({ vida: antes, save: escreverSave({ ...saveVazio(), vida: antes }) });
    }
    expect(escreverSave({ ...saveVazio(), vida: a })).toBe(escreverSave({ ...saveVazio(), vida: b }));
    for (const x of anteriores) expect(escreverSave({ ...saveVazio(), vida: x.vida })).toBe(x.save);
  });
});
