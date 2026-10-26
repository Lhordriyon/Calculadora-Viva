/**
 * A coroa recebe (bloco C): a forma da coroa (salário, parte dos impostos, taxa), a dotação que o tesouro ou a ilha paga,
 * o preço na aprovação, a ilha com população e PIB, a greve, a herança e o save antigo.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { arrecadacaoDe, dotacaoDe, formaDaCoroa, fundarIlha, paisDaCoroa, regraDaCoroa } from '../src/motor/coroa.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { anoDoPais, defGoverno } from '../src/motor/pais.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { regraDoPoder } from '../src/motor/poder.ts';
import { COROA, ILHA } from '../src/motor/regras.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { avancarAno, morrer, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Um adulto de 40 anos num país em fase normal, com as contas em ordem. */
function adulto(semente: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 5 } });
  e.idade = 40;
  e.ano = 2066;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise', 'regime', 'calote']) delete pais.q[f];
  pais.t['governo'] = 'centrao';
  const def = defGoverno(c, 'centrao')!;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 9, divida: 75, impulso: 0, aprovacao: 50 });
  Object.assign(e.entidades['eu']!.n, { dinheiro: 1e9, popularidade: 50, renda: 0 });
  return e;
}

/** Quem joga, monarca do Brasil (o governo é dele). */
function monarca(semente: number): EstadoVida {
  const e = adulto(semente);
  const eu = e.entidades['eu']!;
  eu.t['cargo'] = 'rei';
  eu.q['monarca'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
  e.entidades['pais']!.q['monarquia'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
  return e;
}

/** Quem joga, soberano da ilha que fundou. */
function soberano(semente: number): EstadoVida {
  const e = adulto(semente);
  const eu = e.entidades['eu']!;
  fundarIlha(e, []);
  eu.t['cargo'] = 'soberano';
  eu.q['micronacao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
  return e;
}

describe('a forma da coroa', () => {
  it('quem tem coroa: o monarca reina no Brasil e quem é soberano, na ilha; sem coroa, nada', () => {
    expect(paisDaCoroa(monarca(1))).toBe('pais');
    expect(paisDaCoroa(soberano(2))).toBe('ilha');
    expect(paisDaCoroa(adulto(3))).toBeNull();
    const semIlha = adulto(4);
    semIlha.entidades['eu']!.t['cargo'] = 'soberano';
    expect(paisDaCoroa(semIlha)).toBeNull();
    expect(motivoParaNaoOperar(adulto(5), c, { tipo: 'coroa', forma: 'taxa' })).toBe('só quem tem coroa escolhe como ela recebe');
  });

  it('a dotação de cada forma: o salário fixo, uma fatia da arrecadação e uma fatia do PIB', () => {
    const e = monarca(10);
    const pib = e.entidades['pais']!.n['pib']!;
    expect(dotacaoDe(e, c, 'pais', 'salario')).toBe(COROA.brasil.salario);
    expect(dotacaoDe(e, c, 'pais', 'impostos')).toBeCloseTo(arrecadacaoDe(e, c, 'pais') * COROA.brasil.parte, 0);
    expect(dotacaoDe(e, c, 'pais', 'taxa')).toBeCloseTo(pib * COROA.brasil.taxa, 0);
    // A parte dos impostos fica entre o salário e a taxa, e a taxa é a maior.
    expect(dotacaoDe(e, c, 'pais', 'impostos')).toBeGreaterThan(dotacaoDe(e, c, 'pais', 'salario'));
    expect(dotacaoDe(e, c, 'pais', 'taxa')).toBeGreaterThan(dotacaoDe(e, c, 'pais', 'impostos'));
    const s = soberano(11);
    expect(dotacaoDe(s, c, 'ilha', 'impostos')).toBeCloseTo(ILHA.habitantes * ILHA.porPessoa * ILHA.imposto * COROA.ilha.parte, 0);
    expect(dotacaoDe(s, c, 'ilha', 'taxa')).toBeCloseTo(ILHA.habitantes * ILHA.porPessoa * COROA.ilha.taxa, 0);
  });

  it('mudar a forma: fica com o país, vale como renda, o povo reage na hora, e só uma vez por ano', () => {
    const e = monarca(20);
    const h = operar(e, c, { tipo: 'coroa', forma: 'taxa' });
    expect(formaDaCoroa(e, 'pais')).toBe('taxa');
    expect(e.entidades['pais']!.t['coroa']).toBe('taxa');
    expect(e.entidades['eu']!.n['renda']).toBe(Math.round(dotacaoDe(e, c, 'pais', 'taxa')));
    expect(e.entidades['eu']!.n['popularidade']).toBe(50 + COROA.anuncio.taxa);
    expect(h.resumo).toBe('criou a taxa da coroa');
    expect(h.texto).toMatch(/taxa da coroa/);
    // A rua reage um a três anos depois, com o decreto de causa.
    const rua = e.agenda.find((a) => a.evento === 'rua_contra_a_taxa_da_coroa')!;
    expect(rua.origem).toBe(h.id);
    expect(rua.ano - e.ano).toBeGreaterThanOrEqual(1);
    expect(rua.ano - e.ano).toBeLessThanOrEqual(3);
    expect(motivoParaNaoOperar(e, c, { tipo: 'coroa', forma: 'salario' })).toBe('uma mudança por ano: a corte tem limite');
    expect(motivoParaNaoOperar(e, c, { tipo: 'coroa', forma: 'taxa' })).toBe('essa já é a forma da coroa');
  });

  it('a dotação é paga pelo tesouro no Brasil e pela ilha no país que quem joga fundou; as contas fecham', () => {
    for (const [e, quem] of [
      [monarca(30), 'tesouro'],
      [soberano(31), 'ilha'],
    ] as const) {
      const inicio = e.historico.length;
      for (let i = 0; i < 3 && e.vivo; i++) {
        avancarAno(e, c);
        e.pendente = null;
      }
      const pagos = e.historico.slice(inicio).flatMap((h) => h.mudancas ?? []).filter((m) => m.c === 'eu.dinheiro' && m.r === 'dotacao');
      expect(pagos.length).toBeGreaterThan(0);
      for (const m of pagos) expect(m.p).toBe(quem);
      for (const h of e.historico.slice(inicio)) expect(conferirContas(e, h), h.ref).toEqual([]);
    }
  });

  it('a taxa custa aprovação: o monarca que cobra a taxa vê a aprovação do governo andar para baixo', () => {
    const aprovacaoCom = (forma: 'salario' | 'taxa'): number => {
      const e = monarca(40);
      e.entidades['pais']!.t['coroa'] = forma;
      for (let i = 0; i < 8; i++) {
        e.ano++;
        anoDoPais(e, c, []);
      }
      return e.entidades['pais']!.n['aprovacao']!;
    };
    expect(aprovacaoCom('taxa')).toBeLessThan(aprovacaoCom('salario') - 8);
  });
});

describe('a ilha', () => {
  it('nasce com 2.300 habitantes e o nome da cidade natal; o save antigo de quem fundou ganha a ilha', () => {
    const e = soberano(50);
    const ilha = e.entidades['ilha']!;
    expect(ilha.tipo).toBe('jurisdicao');
    expect(ilha.n['populacao']).toBe(ILHA.habitantes);
    expect(ilha.n['pib']).toBe(ILHA.habitantes * ILHA.porPessoa);
    expect(ilha.nome).toMatch(/^(Nova|Ilha) /);
    const antigo = adulto(51);
    antigo.entidades['eu']!.q['micronacao'] = { v: 1, ano: antigo.ano, idade: antigo.idade, causa: null };
    regraDaCoroa(antigo, c, []);
    expect(antigo.entidades['ilha']?.n['populacao']).toBeGreaterThan(0);
  });

  it('a taxa da coroa esvazia a ilha: com ela, a população cresce menos que com o salário', () => {
    const populacaoCom = (forma: 'salario' | 'taxa'): number => {
      const e = soberano(60);
      e.entidades['ilha']!.t['coroa'] = forma;
      for (let i = 0; i < 15; i++) regraDaCoroa(e, c, []);
      return e.entidades['ilha']!.n['populacao']!;
    };
    expect(populacaoCom('salario')).toBeGreaterThan(ILHA.habitantes);
    expect(populacaoCom('taxa')).toBeLessThan(populacaoCom('salario') * 0.7);
  });

  it('a ilha que passa de 2.600 habitantes ganha a história do crescimento, uma vez, com a fundação de causa', () => {
    const e = soberano(65);
    e.entidades['eu']!.q['micronacao'] = { v: 1, ano: e.ano, idade: e.idade, causa: 7 };
    e.entidades['ilha']!.n['populacao'] = ILHA.marco - 1;
    regraDaCoroa(e, c, []);
    regraDaCoroa(e, c, []);
    const marcos = e.agenda.filter((a) => a.evento === 'a_ilha_cresceu');
    expect(marcos).toHaveLength(1);
    expect(marcos[0]!.origem).toBe(7);
  });

  it('abaixo de 30 de popularidade, a ilha entra em greve geral (a queda de quem é soberano)', () => {
    const e = soberano(70);
    e.entidades['eu']!.n['popularidade'] = 20;
    const reg: Mudanca[] = [];
    regraDoPoder(e, c, { id: 'normal' } as never, reg);
    expect(e.agenda.some((a) => a.evento === 'greve_na_ilha')).toBe(true);
    expect(e.agenda.some((a) => a.evento === 'queda_do_cargo')).toBe(false);
  });

  it('a ilha passa a quem herda, com a coroa dela e a forma escolhida', () => {
    const e = soberano(80);
    e.idade = 70;
    e.ano = 2096;
    e.entidades['ilha']!.t['coroa'] = 'impostos';
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 40;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades['ilha']?.n['populacao']).toBe(e.entidades['ilha']!.n['populacao']);
    expect(h.entidades['eu']!.q['micronacao']?.causa).toBe(h.historico[0]!.id);
    // A coroa passa no primeiro ano (sucessao.ts › assumirAIlha), com a herança de causa.
    expect(h.entidades['eu']!.q['herdeiro_ilha']?.causa).toBe(h.historico[0]!.id);
    regraDaCoroa(h, c, []);
    expect(h.entidades['eu']!.t['cargo']).toBe('soberano');
    expect(formaDaCoroa(h, 'ilha')).toBe('impostos');
    expect(paisDaCoroa(h)).toBe('ilha');
  });
});
