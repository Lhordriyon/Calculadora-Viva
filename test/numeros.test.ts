import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { indicadoresDoPais, ler } from '../src/motor/campos.ts';
import { contexto } from '../src/motor/contexto.ts';
import { iniciarNumeros, taxaDaPopulacao } from '../src/motor/pais.ts';
import { PAIS_EM_2026 } from '../src/motor/regras.ts';
import { renderizar } from '../src/motor/texto.ts';
import type { Entidade } from '../src/motor/tipos.ts';
import { avancarAno, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

const pais = (n: Record<string, number>): Entidade => ({ id: 'pais', tipo: 'jurisdicao', nome: '', n, t: {}, q: {} });

describe('o país em números', () => {
  it('nasce com o Brasil de 2026: PIB, população, Gini perto de 0,52 e IDH perto de 0,77', () => {
    const e = nascer(c, { semente: 11, ano: 2026 });
    const p = e.entidades['pais']!;
    expect(p.n['pib']).toBe(PAIS_EM_2026.pib);
    expect(p.n['populacao']).toBe(PAIS_EM_2026.populacao);
    expect(ler(e, 'pais', 'idh')).toBe(indicadoresDoPais(p).idh);
    // O país de partida varia de vida para vida; o típico é o Brasil de hoje.
    const mediana = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1]!;
    const paises = Array.from({ length: 41 }, (_, k) => indicadoresDoPais(nascer(c, { semente: 100 + k, ano: 2026 }).entidades['pais']!));
    expect(mediana(paises.map((i) => i.gini))).toBeGreaterThan(0.49);
    expect(mediana(paises.map((i) => i.gini))).toBeLessThan(0.55);
    expect(mediana(paises.map((i) => i.idh))).toBeGreaterThan(0.75);
    expect(mediana(paises.map((i) => i.idh))).toBeLessThan(0.8);
  });

  it('o PIB anda com o crescimento do ano, e a população com a demografia', () => {
    const e = nascer(c, { semente: 12, ano: 2026 });
    for (let k = 0; k < 25 && e.vivo; k++) {
      const antes = { ...e.entidades['pais']!.n };
      if (e.pendente) e.pendente = null;
      avancarAno(e, c);
      const n = e.entidades['pais']!.n;
      expect(n['pib']! / antes['pib']! - 1).toBeCloseTo(n['crescimento']! / 100, 6);
      expect(n['populacao']! / antes['populacao']! - 1).toBeCloseTo(taxaDaPopulacao(e.ano, n['saude'], n['pobreza']) / 100, 6);
    }
  });

  it('a população cresce devagar agora e encolhe depois de uma geração', () => {
    expect(taxaDaPopulacao(2026)).toBeGreaterThan(0.3);
    expect(taxaDaPopulacao(2080)).toBeLessThan(0);
    // Saúde melhor, mais gente.
    expect(taxaDaPopulacao(2040, 70)).toBeGreaterThan(taxaDaPopulacao(2040, 30));
  });

  it('a desigualdade sobe com a pobreza e cai com a educação; o IDH sobe com saúde, escola e renda', () => {
    const base = { pib: 1.2e13, populacao: 2.1e8, pobreza: 25, educacao: 50, saude: 50, cambio: 5 };
    const i = indicadoresDoPais(pais(base));
    expect(indicadoresDoPais(pais({ ...base, pobreza: 40 })).gini).toBeGreaterThan(i.gini);
    expect(indicadoresDoPais(pais({ ...base, educacao: 70 })).gini).toBeLessThan(i.gini);
    expect(indicadoresDoPais(pais({ ...base, saude: 70 })).idh).toBeGreaterThan(i.idh);
    expect(indicadoresDoPais(pais({ ...base, educacao: 70 })).idh).toBeGreaterThan(i.idh);
    expect(indicadoresDoPais(pais({ ...base, pib: 2.4e13 })).idh).toBeGreaterThan(i.idh);
    expect(i.pibPerCapita).toBeCloseTo(1.2e13 / 2.1e8, 3);
  });

  it('o texto mostra o IDH com vírgula e a população em milhões', () => {
    const e = nascer(c, { semente: 13, ano: 2026 });
    expect(renderizar('IDH {pais.idh}, Gini {pais.gini}, {pais.populacao}, PIB {pais.pib}', contexto(e))).toMatch(/^IDH 0,\d\d, Gini 0,\d\d, 213 milhões, PIB R\$ 12 trilhões$/);
  });

  it('o save de antes do país em números ganha o PIB e a população do ano, sem sorteio', () => {
    const e = nascer(c, { semente: 14, ano: 2026 });
    e.ano = 2050;
    delete e.entidades['pais']!.n['pib'];
    delete e.entidades['pais']!.n['populacao'];
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    const n = lido.entidades['pais']!.n;
    expect(n['pib']).toBeGreaterThan(PAIS_EM_2026.pib * 1.4);
    expect(n['populacao']).toBeGreaterThan(PAIS_EM_2026.populacao);
    const outra = structuredClone(e);
    iniciarNumeros(outra);
    expect(outra.entidades['pais']!.n['pib']).toBe(n['pib']);
  });
});
