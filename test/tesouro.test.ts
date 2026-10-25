/**
 * O Tesouro (bloco B): o título como contrato com o governo (a compra, o cupom, o vencimento, a venda pelo preço do dia),
 * o calote (quem perde é quem tinha a dívida), a herança e o save.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { acoesDisponiveis } from '../src/motor/acoes.ts';
import { patrimonioTotal, titulosDe, valorDosTitulos } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { defGoverno } from '../src/motor/pais.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { CALOTE, COMPRA_MINIMA_DE_TITULO, MAX_TITULOS } from '../src/motor/regras.ts';
import { chanceDeCalote, cupomDe, darCalote, precoDoTitulo, premioDoCalote, taxaDoTitulo } from '../src/motor/tesouro.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { avancarAno, morrer, nascer } from '../src/motor/vida.ts';
import { criarRng } from '../src/motor/rng.ts';
import { passo, viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

/** Um adulto de 40 anos com R$ 500 mil na conta, num país em fase normal e com as contas em ordem. */
function adulto(semente: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = 40;
  e.ano = 2066;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise', 'regime', 'calote']) delete pais.q[f];
  pais.t['governo'] = 'centrao';
  const def = defGoverno(c, 'centrao')!;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 9, divida: 75, impulso: 0 });
  Object.assign(e.entidades['eu']!.n, { dinheiro: 500_000, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0 });
  return e;
}

/** O título que quem joga tem (o único). */
const oTitulo = (e: EstadoVida) => titulosDe(e)[0]!;

describe('o título do Tesouro', () => {
  it('a compra sai da conta e vira um contrato com o governo: valor, taxa travada e vencimento, sem gastar a ficha', () => {
    const e = adulto(1);
    const fichas = acoesDisponiveis(e, c).length;
    const taxa = taxaDoTitulo(e, 20);
    const h = operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 20 });
    const tit = oTitulo(e);
    expect(tit.id).toBe(`tit${h.id}`);
    expect(tit.tipo).toBe('titulo');
    expect(tit.nome).toBe('Tesouro IPCA+ 2086');
    expect(tit.n).toMatchObject({ valor: 100_000, taxa, vencimento: 2086 });
    expect(tit.t['origem']).toBe(String(h.id));
    expect(e.entidades['eu']!.n['dinheiro']).toBe(400_000);
    expect(h.tipo).toBe('dinheiro');
    expect(h.mudancas?.find((m) => m.c === 'eu.dinheiro')).toMatchObject({ d: -100_000, p: 'tesouro' });
    expect(conferirContas(e, h)).toEqual([]);
    expect(acoesDisponiveis(e, c).length).toBe(fichas);
    // O patrimônio não muda na compra: o dinheiro virou um título.
    expect(valorDosTitulos(e)).toBe(100_000);
    expect(patrimonioTotal(e)).toBeCloseTo(500_000, 0);
  });

  it('a taxa sobe com o prazo, com o juro real e com o risco da dívida', () => {
    const e = adulto(2);
    expect(taxaDoTitulo(e, 20)).toBeGreaterThan(taxaDoTitulo(e, 5));
    const antes = taxaDoTitulo(e, 10);
    e.entidades['pais']!.n['juros'] = 12;
    expect(taxaDoTitulo(e, 10)).toBeGreaterThan(antes);
    e.entidades['pais']!.n['juros'] = 9;
    e.entidades['pais']!.n['divida'] = 105;
    expect(taxaDoTitulo(e, 10)).toBeGreaterThan(antes);
  });

  it('o preço do dia: igual ao valor no ano da compra, mais alto se o juro cai, mais baixo se sobe', () => {
    const e = adulto(3);
    operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 20 });
    const tit = oTitulo(e);
    expect(precoDoTitulo(e, tit)).toBeCloseTo(100_000, 0);
    e.entidades['pais']!.n['juros'] = 7;
    expect(precoDoTitulo(e, tit)).toBeGreaterThan(110_000);
    e.entidades['pais']!.n['juros'] = 12;
    expect(precoDoTitulo(e, tit)).toBeLessThan(80_000);
  });

  it('vender antes põe o preço do dia na conta e tira o título da vida; as contas fecham', () => {
    const e = adulto(4);
    operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 10 });
    const tit = oTitulo(e);
    e.entidades['pais']!.n['juros'] = 7.5;
    const preco = precoDoTitulo(e, tit);
    const h = operar(e, c, { tipo: 'venderTitulo', id: tit.id });
    expect(titulosDe(e)).toEqual([]);
    expect(e.entidades['eu']!.n['dinheiro']).toBeCloseTo(400_000 + preco, 0);
    expect(h.texto).toMatch(/acima do valor do título: o juro caiu/);
    expect(h.resumo).toBe('vendeu um título do Tesouro com lucro');
    expect(conferirContas(e, h)).toEqual([]);
  });

  it('o cupom cai na conta todo ano (o tesouro paga) e, no vencimento, o valor volta numa entrada que aponta a compra', () => {
    const e = adulto(5);
    const compra = operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 5 });
    const cupom = cupomDe(oTitulo(e));
    expect(cupom).toBeGreaterThan(1000);
    let cupons = 0;
    for (let i = 0; i < 5 && e.vivo; i++) {
      const inicio = e.historico.length;
      avancarAno(e, c);
      while (e.pendente) e.pendente = null;
      for (const h of e.historico.slice(inicio)) for (const m of h.mudancas ?? []) if (m.c === 'eu.dinheiro' && m.r === 'cupom') cupons += m.d!;
      for (const h of e.historico.slice(inicio)) expect(conferirContas(e, h), h.ref).toEqual([]);
    }
    if (!e.vivo) return;
    expect(cupons).toBeCloseTo(5 * cupom, -1);
    expect(titulosDe(e)).toEqual([]);
    const venceu = e.historico.find((h) => h.ref === 'tesouro:vencimento')!;
    expect(venceu.causas).toEqual([compra.id]);
    expect(venceu.texto).toMatch(/que você comprou aos 40: R\$ 100 mil voltaram para a conta/);
    expect(venceu.mudancas?.find((m) => m.c === 'eu.dinheiro')).toMatchObject({ p: 'tesouro', r: 'resgate' });
  });

  it('o mundo tem tamanho: a partir dos 18, de R$ 100, do que está na conta e até 5 títulos', () => {
    const e = adulto(6);
    const comprar = (valor: number) => motivoParaNaoOperar(e, c, { tipo: 'comprarTitulo', valor, prazo: 10 });
    expect(comprar(COMPRA_MINIMA_DE_TITULO - 1)).toMatch(/compra mínima/);
    expect(comprar(600_000)).toBe('não há tanto dinheiro na conta');
    for (let i = 0; i < MAX_TITULOS; i++) operar(e, c, { tipo: 'comprarTitulo', valor: 1000, prazo: 10 });
    expect(comprar(1000)).toMatch(/já são 5 títulos/);
    const jovem = adulto(7);
    operar(jovem, c, { tipo: 'comprarTitulo', valor: 1000, prazo: 10 });
    jovem.idade = 17;
    expect(motivoParaNaoOperar(jovem, c, { tipo: 'comprarTitulo', valor: 1000, prazo: 10 })).toBe('só a partir dos 18 anos');
    // O título herdado na infância: o cupom cai, e vender espera os 18.
    expect(motivoParaNaoOperar(jovem, c, { tipo: 'venderTitulo', id: oTitulo(jovem).id })).toBe('só a partir dos 18 anos');
    // Ninguém tem mais de 30% da dívida do país.
    const rico = adulto(8);
    rico.entidades['eu']!.n['dinheiro'] = 1e13;
    const divida = (rico.entidades['pais']!.n['pib']! * 75) / 100;
    expect(motivoParaNaoOperar(rico, c, { tipo: 'comprarTitulo', valor: divida * 0.31, prazo: 5 })).toMatch(/não vende tanto/);
  });
});

describe('o calote', () => {
  it('só com a dívida acima de 100% do PIB, numa recessão ou numa crise', () => {
    const e = adulto(10);
    const pais = e.entidades['pais']!;
    pais.n['divida'] = 120;
    expect(chanceDeCalote(e)).toBe(0);
    pais.q['recessao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    expect(chanceDeCalote(e)).toBeCloseTo(0.2, 5);
    pais.n['divida'] = 99;
    expect(chanceDeCalote(e)).toBe(0);
  });

  it('quem perde é quem tinha a dívida: os títulos e a renda fixa; a dívida do país encolhe e o juro paga o susto', () => {
    const e = adulto(11);
    operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 20 });
    e.entidades['eu']!.n['renda_fixa'] = 50_000;
    const pais = e.entidades['pais']!;
    pais.n['divida'] = 120;
    pais.q['crise'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    const cupomAntes = cupomDe(oTitulo(e));
    darCalote(e, c);
    const h = e.historico.at(-1)!;
    expect(h.ref).toBe('tesouro:calote');
    expect(h.tipo).toBe('mundo');
    expect(oTitulo(e).n['valor']).toBeCloseTo(100_000 * (1 - CALOTE.titulos), 0);
    expect(cupomDe(oTitulo(e))).toBeCloseTo(cupomAntes * (1 - CALOTE.titulos), 2);
    expect(e.entidades['eu']!.n['renda_fixa']).toBeCloseTo(50_000 * (1 - CALOTE.rendaFixa), 0);
    expect(pais.n['divida']).toBeCloseTo(120 * (1 - CALOTE.perdao), 5);
    expect(h.texto).toMatch(/Você estava entre os credores: os seus títulos perderam R\$ 30 mil e a sua renda fixa, R\$ 7,5 mil/);
    expect(conferirContas(e, h)).toEqual([]);
    expect(pais.q['calote']?.causa).toBe(h.id);
    expect(e.agenda).toContainEqual({ evento: 'depois_do_calote', ano: e.ano + 1, origem: h.id });
    // A confiança volta devagar: o prêmio na Selic some em seis anos.
    expect(premioDoCalote(e)).toBe(CALOTE.premio);
    e.ano += 3;
    expect(premioDoCalote(e)).toBeCloseTo(CALOTE.premio / 2, 5);
    e.ano += 3;
    expect(premioDoCalote(e)).toBe(0);
  });

  it('sem título e sem renda fixa, nada se perde; a notícia aponta a decisão que pôs a dívida para cima', () => {
    const e = adulto(12);
    const pais = e.entidades['pais']!;
    // A reforma que cortou o imposto, há três anos (uma decisão: sem regra no livro).
    e.ano -= 3;
    const reforma = novaEntrada(e, { tipo: 'dinheiro', causa: 'acao', ref: 'pais:politica', texto: 'Reforma.' });
    const reg: Mudanca[] = [{ c: 'pais.pol_impostos', d: -1 }];
    pais.n['pol_impostos'] = (pais.n['pol_impostos'] ?? 1) - 1;
    lancar(e, reforma, reg);
    e.ano += 3;
    pais.n['divida'] = 115;
    pais.q['recessao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    const dinheiro = e.entidades['eu']!.n['dinheiro'];
    darCalote(e, c);
    const h = e.historico.at(-1)!;
    expect(e.entidades['eu']!.n['dinheiro']).toBe(dinheiro);
    expect(h.texto).not.toMatch(/credores/);
    expect(h.resumo).toBe('viu o governo dar calote na dívida');
    expect(h.causas).toEqual([reforma.id]);
  });
});

describe('a herança e o save', () => {
  it('o título passa a quem herda, com a parte da partilha, e vence na vida nova com a herança como causa', () => {
    const e = adulto(20);
    e.idade = 60;
    e.ano = 2086;
    operar(e, c, { tipo: 'comprarTitulo', valor: 100_000, prazo: 5 });
    e.entidades['eu']!.n['dinheiro'] = 0;
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    const [tit] = titulosDe(h);
    expect(tit).toBeDefined();
    // Sem cônjuge nem irmãos, sai só o imposto da herança.
    expect(tit!.n['valor']).toBeGreaterThan(90_000);
    expect(tit!.n['valor']).toBeLessThan(100_000);
    expect(tit!.t['origem']).toBe(String(h.historico[0]!.id));
    expect(tit!.id.startsWith(`tit${h.historico[0]!.id}`)).toBe(true);
    for (let i = 0; i < 6 && h.vivo && titulosDe(h).length > 0; i++) {
      avancarAno(h, c);
      h.pendente = null;
    }
    const venceu = h.historico.find((x) => x.ref === 'tesouro:vencimento');
    if (h.vivo) expect(venceu?.texto).toMatch(/que você herdou/);
  });

  it('mesma semente e mesmas decisões, a mesma vida, salvando no meio com títulos', () => {
    const a = nascer(c, { semente: 31, ano: 2026, origem: { classe: 4 } });
    viverAteOFim(a, c, 3, 'cautelosa');
    expect(a.historico.some((h) => h.ref === 'tesouro:comprarTitulo')).toBe(true);
    const b = nascer(c, { semente: 31, ano: 2026, origem: { classe: 4 } });
    // A mesma vida, salva e lida a cada ano que tiver título.
    let atual = b;
    const robo = criarRoboIgual(3);
    while (atual.vivo) {
      robo.passo(atual);
      if (titulosDe(atual).length > 0) atual = lerSave(escreverSave({ ...saveVazio(), vida: atual }), c).vida!;
    }
    expect(atual.historico).toEqual(a.historico);
    expect(atual.entidades).toEqual(a.entidades);
  });
});

/** O passo do robô cauteloso com um gerador próprio (o mesmo de viverAteOFim). */
function criarRoboIgual(semente: number): { passo: (e: EstadoVida) => void } {
  const rng = criarRng(semente);
  return { passo: (e) => passo(e, c, rng, 'cautelosa') };
}
