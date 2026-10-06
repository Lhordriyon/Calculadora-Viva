import { describe, expect, it } from 'vitest';
import { criarRng } from '../src/motor/rng.ts';
import { analisarModelo, formatarDinheiro, renderizar, type ContextoTexto } from '../src/motor/texto.ts';

function ctx(genero: 'f' | 'm' = 'f'): ContextoTexto {
  const vars: Record<string, string> = { nome: 'Ana', amigo: 'Bruno' };
  return { rng: criarRng(1), genero, variavel: (n) => vars[n], generoDe: (p) => (p === 'amigo' ? 'm' : undefined) };
}

describe('renderizar', () => {
  it('troca variáveis e concordâncias', () => {
    expect(renderizar('{nome} ficou cansad{o|a}.', ctx('f'))).toBe('Ana ficou cansada.');
    expect(renderizar('{nome} ficou cansad{o|a}.', ctx('m'))).toBe('Ana ficou cansado.');
    expect(renderizar('{amigo} é {amigo:o melhor amigo|a melhor amiga}.', ctx())).toBe('Bruno é o melhor amigo.');
  });

  it('sorteia alternâncias, inclusive com concordância dentro', () => {
    const vistos = new Set<string>();
    const c = ctx('f');
    for (let i = 0; i < 100; i++) vistos.add(renderizar('[um|saiu queimad{o|a}]', c));
    expect(vistos).toEqual(new Set(['um', 'saiu queimada']));
  });

  it('usa "alguém" para personagem que não existe', () => {
    expect(renderizar('{amor} ligou', ctx())).toBe('alguém ligou');
  });
});

describe('analisarModelo', () => {
  it('aceita variável dentro de alternância e acusa aninhamentos ruins', () => {
    expect(analisarModelo('[a|{nome} b]').erros).toEqual([]);
    expect(analisarModelo('[a|[b|c]]').erros.length).toBeGreaterThan(0);
    expect(analisarModelo('{a{b}}').erros.length).toBeGreaterThan(0);
    expect(analisarModelo('[sozinho]').erros).toContain('alternância sem opções: [sozinho]');
    expect(analisarModelo('texto {').erros.length).toBeGreaterThan(0);
  });

  it('separa variáveis de concordâncias', () => {
    const a = analisarModelo('{nome} e {amigo:o|a} {o|a} {preco}');
    expect(a.variaveis).toEqual(['nome', 'preco']);
    expect(a.concordancias).toEqual(['amigo']);
  });
});

describe('formatarDinheiro', () => {
  it.each([
    [850, 'R$ 850'],
    [999.6, 'R$ 1 mil'],
    [4500, 'R$ 4,5 mil'],
    [45000, 'R$ 45 mil'],
    [999_600, 'R$ 1 milhão'],
    [1_200_000, 'R$ 1,2 milhão'],
    [3_400_000, 'R$ 3,4 milhões'],
    [-2000, '-R$ 2 mil'],
  ])('%d → %s', (valor, esperado) => {
    expect(formatarDinheiro(valor)).toBe(esperado);
  });
});
