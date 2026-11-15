/**
 * A dupla do valor (I-179): contratada pela holding, dirige o grupo pelo investimento em valor, e as diretorias se
 * reportam a ela antes.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { empresasDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { unidadesDe } from '../src/motor/unidades.ts';
import { holdingDaDupla, NOMES_DA_DUPLA, sobADupla } from '../src/motor/valor.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 40;
  e.ano += 40;
  e.agenda = [];
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  const antes = dinheiroDoMundo(e);
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 });
  e.entidades['mercado']!.n['dinheiro']! -= dinheiroDoMundo(e) - antes;
  return e;
}

function fazer(e: EstadoVida, op: Operacao): void {
  expect(motivoParaNaoOperar(e, c, op), JSON.stringify(op)).toBeNull();
  operar(e, c, op);
}

function umAno(e: EstadoVida, mercado?: { acoes: number; renda_fixa: number }): void {
  const reg: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  regraDaEmpresa(e, c, momentoTipico('normal'), reg, mercado);
  lancar(e, entrada, reg);
  e.ano++;
  e.idade++;
}

function conferir(e: EstadoVida): void {
  for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
  expect(conferirEstado(e, c)).toEqual([]);
}

/** A holding com a empresa de perto dentro e duas subsidiárias, e a dupla contratada. */
function comDupla(semente: number): { e: EstadoVida; holding: string; subs: string[] } {
  const e = adulto(semente, 300_000_000);
  fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
  const holding = lugarLivre(e)!;
  fazer(e, { tipo: 'criarHolding', valor: 150_000_000 });
  fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
  const subs: string[] = [];
  for (const setor of ['servicos', 'industria']) {
    subs.push(lugarLivre(e)!);
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor, valor: 30_000_000 });
  }
  fazer(e, { tipo: 'dupla', holding, contratar: true });
  return { e, holding, subs };
}

describe('a dupla do valor (I-179)', () => {
  it('contratada pela holding, dirige o grupo inteiro: as subsidiárias e a empresa de perto ficam debaixo dela', () => {
    const { e, holding, subs } = comDupla(1);
    expect(holdingDaDupla(e)?.id).toBe(holding);
    for (const s of [...subs, 'empresa']) expect(sobADupla(e, e.entidades[s]!)).toBe(true);
    expect(e.historico.some((h) => h.texto.includes(NOMES_DA_DUPLA))).toBe(true);
    // Só uma holding tem a dupla, e não dá para contratar de novo.
    expect(motivoParaNaoOperar(e, c, { tipo: 'dupla', holding, contratar: true })).toMatch(/já dirige/);
  });

  it('no ano, cobra o honorário e traz para a holding o caixa que passa de três meses de custos', () => {
    const { e, holding, subs } = comDupla(2);
    umAno(e);
    const caixaDaHolding = e.entidades[holding]!.n['caixa']!;
    umAno(e);
    const ano = e.historico.filter((h) => h.ref === 'valor:decidiu').at(-1)!;
    expect(ano.texto).toMatch(/A dupla do valor, .+ que dirige/);
    expect(ano.texto).toMatch(/honorário/);
    expect(ano.causas?.length).toBe(1);
    for (const s of subs) {
      const x = e.entidades[s];
      if (!x) continue;
      const custo = Math.max(0, (x.n['receita'] ?? 0) - (x.n['lucro'] ?? 0));
      // O caixa de cada subsidiária não passa muito de três meses de custos mais o lucro do ano.
      expect(x.n['caixa']!).toBeLessThanOrEqual(custo * 0.25 + Math.max(0, x.n['lucro'] ?? 0) * 2 + 5_000_000);
    }
    expect(e.entidades[holding]!.n['valor']).toBeCloseTo(e.entidades[holding]!.n['caixa']!, 0);
    expect(caixaDaHolding).toBeGreaterThan(0);
    conferir(e);
  });

  it('com a dupla, a diretoria não pega crédito, e a compra cara é vetada; quem joga pode dispensar a dupla', () => {
    const { e, holding, subs } = comDupla(3);
    for (let i = 0; i < 6; i++) umAno(e);
    for (const s of subs) expect(e.entidades[s]?.n['divida'] ?? 0).toBe(0);
    fazer(e, { tipo: 'dupla', holding, contratar: false });
    expect(holdingDaDupla(e)).toBeUndefined();
    expect(sobADupla(e, e.entidades[subs[0]!]!)).toBe(false);
    conferir(e);
  });

  it('o negócio de três anos que perde mais de 5% do que vale num ano é vendido inteiro (o novo e a empresa de perto, não)', () => {
    const { e, subs } = comDupla(4);
    for (let i = 0; i < 3; i++) umAno(e);
    // Uma subsidiária de três anos ou mais (a dupla pode ter mexido no grupo nesses anos: procura pelo que ela é).
    const ruim = empresasDe(e).find((x) => x.id !== 'empresa' && !x.q['holding'] && e.ano - (x.nascimento ?? e.ano) >= 3 && subs.includes(x.id))!;
    expect(ruim).toBeDefined();
    const nome = ruim.nome;
    // Quase sem clientes, ela paga a estrutura inteira e vende pouco: o ano fecha num prejuízo grande.
    ruim.n['demanda'] = (ruim.n['capacidade'] ?? 0) * 0.03;
    umAno(e);
    expect(e.historico.some((h) => h.ref === 'valor:decidiu' && h.texto.includes(`vendeu ${nome}`))).toBe(true);
    expect(empresasDe(e).some((x) => x.nome === nome)).toBe(false);
    expect(e.entidades['empresa']).toBeDefined();
    conferir(e);
  });

  it('o caixa livre da holding trabalha: fica aplicado em ações e no Tesouro e rende o mercado do ano', () => {
    const { e, holding } = comDupla(5);
    umAno(e, { acoes: 0.2, renda_fixa: 0.06 });
    const ano = e.historico.filter((h) => h.ref === 'valor:decidiu').at(-1)!;
    expect(ano.texto).toMatch(/aplicados \(25% em ações, o resto no Tesouro\), que renderam/);
    expect(ano.mudancas?.some((m) => m.c === `${holding}.caixa` && m.r === 'carteira' && (m.d ?? 0) > 0)).toBe(true);
    // Na recessão, a dupla compra ações na baixa.
    e.entidades['pais']!.q['recessao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    umAno(e, { acoes: -0.1, renda_fixa: 0.06 });
    expect(e.historico.filter((h) => h.ref === 'valor:decidiu').at(-1)!.texto).toMatch(/60% em ações compradas na baixa/);
    expect(e.entidades[holding]!.n['valor']).toBeCloseTo(e.entidades[holding]!.n['caixa']!, 0);
    conferir(e);
  });

  it('a CEO pede a obra à dupla: com retorno, leva o dinheiro da holding e constrói; sem retorno, ouve não', () => {
    const { e, subs } = comDupla(6);
    umAno(e);
    const s = e.entidades[subs[0]!]!;
    // Fila de pedidos e um bom retorno: a obra é pedida, aprovada e paga pela holding (o caixa da empresa subiu para ela).
    s.n['demanda'] = (s.n['capacidade'] ?? 0) * 1.8;
    s.n['lucro'] = (s.n['valor'] ?? 0) * 0.2;
    s.n['receita'] = Math.max(s.n['receita'] ?? 0, s.n['lucro']! * 3);
    const antes = unidadesDe(e, s).length;
    // O ano do negócio recalcula o lucro; a dupla julga o do ano que fechou. Um ano basta para pedir.
    let pediu: string | undefined;
    for (let i = 0; i < 6 && !pediu; i++) {
      s.n['demanda'] = (s.n['capacidade'] ?? 0) * 1.8;
      umAno(e);
      pediu = e.historico.filter((h) => h.ref === 'conselho:decidiu' && h.texto.includes('pediu à dupla do valor')).at(-1)?.texto;
    }
    expect(pediu).toBeDefined();
    if (pediu!.includes('e levou')) expect(unidadesDe(e, s).length).toBeGreaterThan(antes);
    else expect(pediu).toMatch(/ouviu não|não tem como bancar/);
    conferir(e);
  });

  it('com o setor em baixa e caixa livre, a dupla põe dinheiro num negócio novo nele', () => {
    const { e } = comDupla(7);
    e.entidades['setor_saude']!.n['oferta'] = 140;
    let comprou = false;
    const antes = empresasDe(e).length;
    for (let i = 0; i < 12 && !comprou; i++) {
      e.entidades['setor_saude']!.n['oferta'] = 140;
      umAno(e);
      comprou = e.historico.some((h) => h.ref === 'valor:decidiu' && /num negócio de .+, com o setor em baixa/.test(h.texto));
    }
    expect(comprou).toBe(true);
    expect(empresasDe(e).length).toBeGreaterThan(antes);
    conferir(e);
  });
});
