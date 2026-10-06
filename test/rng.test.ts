import { describe, expect, it } from 'vitest';
import { aleatorio, criarRng, inteiro, misturar, sortearIndice } from '../src/motor/rng.ts';

describe('rng', () => {
  it('é determinístico pela semente', () => {
    const a = criarRng(123);
    const b = criarRng(123);
    const xs = Array.from({ length: 50 }, () => aleatorio(a));
    expect(Array.from({ length: 50 }, () => aleatorio(b))).toEqual(xs);
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
  });

  it('continua igual depois de serializar o estado', () => {
    const a = criarRng(7);
    aleatorio(a);
    const copia = JSON.parse(JSON.stringify(a)) as typeof a;
    expect(aleatorio(copia)).toBe(aleatorio(a));
  });

  it('inteiro respeita os limites', () => {
    const r = criarRng(1);
    const vistos = new Set<number>();
    for (let i = 0; i < 2000; i++) vistos.add(inteiro(r, 3, 6));
    expect([...vistos].sort()).toEqual([3, 4, 5, 6]);
  });

  it('sortearIndice segue os pesos e ignora zeros', () => {
    const r = criarRng(9);
    const contagem = [0, 0, 0];
    for (let i = 0; i < 10000; i++) contagem[sortearIndice(r, [1, 0, 3])]!++;
    expect(contagem[1]).toBe(0);
    expect(contagem[2]! / contagem[0]!).toBeGreaterThan(2.5);
    expect(sortearIndice(r, [0, 0])).toBe(-1);
  });

  it('misturar dá sementes diferentes para entradas diferentes', () => {
    expect(misturar(1, 2)).not.toBe(misturar(2, 1));
    expect(misturar(1, 2)).toBe(misturar(1, 2));
  });
});
