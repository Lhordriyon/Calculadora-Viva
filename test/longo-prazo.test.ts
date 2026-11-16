/**
 * O longo prazo (etapa 02): o país que cresce em direção a uma renda potencial que anda com a fronteira do mundo, a
 * população que para de encolher, o salário que acompanha o que cada pessoa produz, o mercado que tem o tamanho do
 * PIB (dividido entre a carteira de quem joga e o caixa que a dupla do valor aplica), o caixa parado que perde a
 * inflação e as contas do país que passam inteiras a quem herda.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { aplicadoNoMercado, capacidadeDoMercado, fronteiraEm, indiceDeSalarios, parteQueCabe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { idLivre } from '../src/motor/contratos.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { conferirEstado, FOLGA_DO_DINHEIRO } from '../src/motor/invariantes.ts';
import { ganhar, lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { faseDoCrescimento, iniciarNumeros, momentoTipico, taxaDaPopulacao, tendenciaDe } from '../src/motor/pais.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { PAIS_EM_2026 } from '../src/motor/regras.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();
const PC_2026 = PAIS_EM_2026.pib / PAIS_EM_2026.populacao;

function paisEm(ano: number): EstadoVida {
  const e = nascer(c, { semente: 21, ano: 2026 });
  const n = e.entidades['pais']!.n;
  delete n['pib'];
  delete n['populacao'];
  delete n['renda_potencial'];
  e.ano = ano;
  iniciarNumeros(e);
  return e;
}

function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 40;
  e.ano += 40;
  e.agenda = [];
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  const antes = dinheiroDoMundo(e);
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 });
  e.entidades['mercado']!.n['dinheiro']! -= dinheiroDoMundo(e) - antes;
  return e;
}

function fazer(e: EstadoVida, op: Operacao): void {
  expect(motivoParaNaoOperar(e, c, op), JSON.stringify(op)).toBeNull();
  operar(e, c, op);
}

function umAno(e: EstadoVida, mercado?: { acoes: number; renda_fixa: number }): Mudanca[] {
  const reg: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  regraDaEmpresa(e, c, momentoTipico('normal'), reg, mercado);
  lancar(e, entrada, reg);
  e.ano++;
  e.idade++;
  return reg;
}

/** Põe dinheiro numa conta de quem joga ou de uma empresa tirando do mercado: o dinheiro do mundo continua somando zero. */
function dar(e: EstadoVida, ent: string, campo: string, valor: number): void {
  e.entidades[ent]!.n[campo] = (e.entidades[ent]!.n[campo] ?? 0) + valor;
  e.entidades['mercado']!.n['dinheiro']! -= valor;
}

describe('o crescimento de longo prazo', () => {
  it('a fronteira do mundo avança 1,4% em 2026, desacelera e tem fim (8,2 vezes a de 2026)', () => {
    expect(fronteiraEm(2026)).toBe(1);
    expect(fronteiraEm(2027) - 1).toBeCloseTo(0.014, 3);
    const passos = [2100, 2300, 2600, 3000, 5000].map((a) => fronteiraEm(a + 1) / fronteiraEm(a) - 1);
    for (let i = 1; i < passos.length; i++) expect(passos[i]!).toBeLessThan(passos[i - 1]!);
    expect(fronteiraEm(9999)).toBeLessThan(Math.exp(1.4 * 1.5) + 1e-9);
    expect(fronteiraEm(9999)).toBeGreaterThan(8);
  });

  it('em 2026, o país cresce o de sempre (perto de 2%): a fronteira, a gente a mais e a distância até a renda potencial', () => {
    const e = nascer(c, { semente: 5, ano: 2026 });
    const t = tendenciaDe(e);
    expect(t).toBeGreaterThan(1.4);
    expect(t).toBeLessThan(2.6);
  });

  it('o país acima da renda potencial volta para ela, nunca mais rápido que 6% ao ano; o de baixo sobe', () => {
    const e = nascer(c, { semente: 6, ano: 2026 });
    const n = e.entidades['pais']!.n;
    const base = tendenciaDe(e);
    const pc = n['pib']! / n['populacao']!;
    n['renda_potencial'] = pc / 3;
    expect(tendenciaDe(e)).toBeLessThan(base - 2);
    n['renda_potencial'] = pc / 1e6;
    expect(tendenciaDe(e) - (100 * (fronteiraEm(e.ano) / fronteiraEm(e.ano - 1) - 1) + taxaDaPopulacao(e.ano, n['saude'], n['pobreza'], n['populacao']))).toBeCloseTo(-6, 6);
    n['renda_potencial'] = pc * 2;
    expect(tendenciaDe(e)).toBeGreaterThan(base);
  });

  it('mil anos de caminho comum: o PIB per capita para perto de 8,8 vezes o de 2026, e a população para de encolher', () => {
    const mil = paisEm(3026).entidades['pais']!.n;
    const dois = paisEm(4026).entidades['pais']!.n;
    const pc = mil['pib']! / mil['populacao']!;
    expect(pc / PC_2026).toBeGreaterThan(7.5);
    expect(pc / PC_2026).toBeLessThan(9.5);
    expect(mil['pib']!).toBeLessThan(Number.MAX_SAFE_INTEGER / 100);
    // A população encontra devagar (uns 200 anos de meia-vida) o tamanho em que as famílias voltam a crescer: quase a
    // mesma em 3026 e em 4026.
    expect(mil['populacao']!).toBeGreaterThan(5e7);
    expect(Math.abs(dois['populacao']! / mil['populacao']! - 1)).toBeLessThan(0.03);
    expect(Math.abs(taxaDaPopulacao(4026, 50, 25, dois['populacao']!))).toBeLessThan(0.01);
  });

  it('com menos gente do que o país já teve, as famílias voltam a crescer; com mais, o contrário', () => {
    expect(taxaDaPopulacao(2200, 50, 25, 5e7)).toBeGreaterThan(taxaDaPopulacao(2200, 50, 25, 2e8));
    expect(taxaDaPopulacao(2200, 50, 25, 3e7)).toBeGreaterThan(0);
    expect(taxaDaPopulacao(2200, 50, 25, 2.13e8)).toBeCloseTo(-0.35, 6);
  });

  it('o save de um país que já tinha crescido demais ganha a renda potencial dele e para de compor, sem perder um real', () => {
    const e = nascer(c, { semente: 7, ano: 2026 });
    const n = e.entidades['pais']!.n;
    e.ano = 2441;
    Object.assign(n, { pib: 3.5e16, populacao: 5e7 });
    delete n['renda_potencial'];
    iniciarNumeros(e);
    expect(n['pib']).toBe(3.5e16);
    expect(n['renda_potencial']).toBe(Math.round(3.5e16 / 5e7));
    // Sem a convergência para cima: cresce o que a fronteira anda e a gente que muda.
    const semConvergencia = 100 * (fronteiraEm(e.ano) / fronteiraEm(e.ano - 1) - 1) + taxaDaPopulacao(e.ano, n['saude'], n['pobreza'], n['populacao']);
    expect(tendenciaDe(e)).toBeCloseTo(semConvergencia, 6);
  });
});

describe('o salário anda com o que cada pessoa do país produz', () => {
  it('é 1 em 2026, segue o PIB per capita e tem limites', () => {
    const e = nascer(c, { semente: 8, ano: 2026 });
    const n = e.entidades['pais']!.n;
    expect(indiceDeSalarios(e)).toBeCloseTo(1, 2);
    const pib = n['pib']!;
    n['pib'] = pib * 2;
    expect(indiceDeSalarios(e)).toBeCloseTo(2, 2);
    n['pib'] = pib * 1000;
    expect(indiceDeSalarios(e)).toBe(30);
    n['pib'] = pib / 1000;
    expect(indiceDeSalarios(e)).toBe(0.3);
  });
});

describe('o mercado tem o tamanho do PIB', () => {
  /** A holding com a empresa de perto dentro e a dupla do valor contratada. */
  function comDupla(semente: number): { e: EstadoVida; holding: string } {
    const e = adulto(semente, 300_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 150_000_000 });
    fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
    fazer(e, { tipo: 'dupla', holding, contratar: true });
    return { e, holding };
  }

  it('o que comporta é 43% do PIB, e a carteira de quem joga o divide com o caixa que a dupla aplica', () => {
    const { e, holding } = comDupla(31);
    const cabe = capacidadeDoMercado(e);
    expect(cabe / e.entidades['pais']!.n['pib']!).toBeCloseTo(5e12 / 1.17e13, 6);
    dar(e, 'eu', 'renda_fixa', cabe);
    expect(parteQueCabe(e)).toBeLessThan(1);
    dar(e, holding, 'caixa', cabe - (e.entidades[holding]!.n['caixa'] ?? 0));
    e.entidades[holding]!.n['valor'] = e.entidades[holding]!.n['caixa']!;
    expect(aplicadoNoMercado(e)).toBeCloseTo(2 * cabe, -3);
    expect(parteQueCabe(e)).toBeCloseTo(0.5, 6);
    // Sem a dupla, o caixa da holding não está aplicado: não divide o mercado.
    delete e.entidades[holding]!.q['dupla_do_valor'];
    expect(parteQueCabe(e)).toBeCloseTo(1, 6);
  });

  it('o caixa aplicado da holding só rende a parte que cabe; o juro do título é o Tesouro que paga', () => {
    const { e, holding } = comDupla(32);
    const cabe = capacidadeDoMercado(e);
    dar(e, holding, 'caixa', 4 * cabe);
    e.entidades[holding]!.n['valor'] = e.entidades[holding]!.n['caixa']!;
    const retorno = { acoes: 0.1, renda_fixa: 0.05 };
    const desde = e.historico.length;
    const reg = umAno(e, retorno);
    // A dupla lança o ano dela numa entrada própria (valor.ts › anoDaDupla).
    const doAno = [...reg, ...e.historico.slice(desde).flatMap((x) => x.mudancas ?? [])];
    const carteira = doAno.filter((m) => m.c === `${holding}.caixa` && m.r === 'carteira');
    const rendeu = carteira.reduce((s, m) => s + (m.d ?? 0), 0);
    expect(rendeu).toBeGreaterThan(0);
    // Sem o teto, 4 vezes o mercado renderia no mínimo 4 × 5% dele; com o teto, no máximo o mercado inteiro × 10%.
    expect(rendeu).toBeLessThanOrEqual(cabe * retorno.acoes * 1.0001);
    expect(carteira.some((m) => m.p === 'tesouro' && (m.d ?? 0) > 0)).toBe(true);
    expect(carteira.some((m) => m.p === 'reavaliacao' && (m.d ?? 0) > 0)).toBe(true);
    expect(e.entidades[holding]!.n['valor']).toBeCloseTo(e.entidades[holding]!.n['caixa']!, 0);
    for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
    expect(conferirEstado(e, c)).toEqual([]);
  });

  it('o caixa parado de uma empresa perde a inflação do ano para o Banco Central', () => {
    const e = adulto(33, 50_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
    const reg = umAno(e);
    const inflacao = reg.filter((m) => m.c === 'empresa.caixa' && m.r === 'inflacao');
    expect(inflacao).toHaveLength(1);
    const d = inflacao[0]!.d!;
    expect(d).toBeLessThan(0);
    expect(inflacao[0]!.p).toBe('reavaliacao');
    const taxa = e.entidades['pais']!.n['inflacao']! / 100;
    const antesDaInflacao = e.entidades['empresa']!.n['caixa']! - d;
    expect(-d / antesDaInflacao).toBeCloseTo(taxa / (1 + taxa), 6);
    expect(Math.abs(dinheiroDoMundo(e))).toBeLessThan(FOLGA_DO_DINHEIRO);
  });
});

describe('quem herda continua no mesmo país', () => {
  it('as contas dos bancos, do governo, do Banco Central e de fora passam inteiras; o mercado fica com o resto', () => {
    const e = adulto(41, 0);
    e.idade = 60;
    e.ano += 20;
    // Uma fortuna do tamanho de um terço do dinheiro que circula: reaberto do zero, o mercado ficaria negativo.
    dar(e, 'eu', 'renda_fixa', 0.2 * e.entidades['pais']!.n['pib']!);
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
    ganhar(e, [], 'eu', 'namoro', null);
    morrer(e, c);
    expect(herdeiroPossivel(e, c)).not.toBeNull();
    const nova = continuarComoHerdeiro(e, c);
    for (const id of ['banco', 'tesouro', 'bc', 'exterior']) expect(nova.entidades[id]!.n['dinheiro']).toBe(e.entidades[id]!.n['dinheiro']);
    expect(Math.abs(dinheiroDoMundo(nova))).toBeLessThan(FOLGA_DO_DINHEIRO);
    expect(nova.entidades['mercado']!.n['dinheiro']!).toBeGreaterThan(0);
  });
});

describe('os ids da vida nova', () => {
  it('passadas as 25 letras, o número também é conferido: dois imóveis herdados nunca ganham o mesmo id', () => {
    const e = nascer(c, { semente: 51, ano: 2026 });
    const usados = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const id = idLivre(e, 'bem1');
      expect(usados.has(id)).toBe(false);
      usados.add(id);
      e.entidades[id] = { ...e.entidades['eu']!, id, n: {}, t: {}, q: {} };
    }
    expect(usados.size).toBe(40);
  });
});

describe('a economia aquecida é crescer acima do potencial', () => {
  it('com o potencial de 2%, os 4% de sempre; com 0,8%, aquece a partir de 2,8%; encolhendo, nunca', () => {
    expect(faseDoCrescimento(4, 'normal')).toBe('expansao');
    expect(faseDoCrescimento(3.9, 'normal')).toBe('normal');
    expect(faseDoCrescimento(2.8, 'normal', 0.8)).toBe('expansao');
    expect(faseDoCrescimento(2.7, 'normal', 0.8)).toBe('normal');
    // Sair pede a folga de 1,25 ponto.
    expect(faseDoCrescimento(1.6, 'expansao', 0.8)).toBe('expansao');
    expect(faseDoCrescimento(1.5, 'expansao', 0.8)).toBe('normal');
    // O país que encolhe não está aquecido, por pior que seja o potencial; a recessão é o PIB caindo.
    expect(faseDoCrescimento(-0.4, 'normal', -3)).toBe('normal');
    expect(faseDoCrescimento(-0.6, 'normal', 0.8)).toBe('recessao');
  });
});
