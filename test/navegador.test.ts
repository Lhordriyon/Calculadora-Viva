import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { conteudo as doBundle } from '../src/conteudo.ts';

describe('conteúdo do bundle (sem Zod)', () => {
  it('é igual ao conteúdo validado pelo Node', () => {
    const validado = carregarConteudo();
    expect(doBundle.eventos.map((e) => e.id)).toEqual(validado.eventos.map((e) => e.id));
    expect(doBundle.eventos).toEqual(validado.eventos);
    expect(doBundle.linhas).toEqual(validado.linhas);
    expect(doBundle.mortes).toEqual(validado.mortes);
    expect(doBundle.marcas).toEqual(validado.marcas);
    expect(doBundle.mundo).toEqual(validado.mundo);
  });
});
