/**
 * O comando claro (I-175 a I-177): mover caixa em qualquer valor entre a holding, as subsidiárias e a conta de quem
 * joga, e a CEO com carta branca que cuida do caixa.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { empresasDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { autonomiaDe, ceoDe } from '../src/motor/governanca.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
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

function umAno(e: EstadoVida): void {
  const reg: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  regraDaEmpresa(e, c, momentoTipico('normal'), reg);
  lancar(e, entrada, reg);
  e.ano++;
  e.idade++;
}

function conferir(e: EstadoVida): void {
  for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
  expect(conferirEstado(e, c)).toEqual([]);
}

/** A empresa de quem joga, a holding com ela dentro e uma subsidiária da holding. */
function grupo(semente: number): { e: EstadoVida; holding: string; sub: string } {
  const e = adulto(semente, 200_000_000);
  fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
  const holding = lugarLivre(e)!;
  fazer(e, { tipo: 'criarHolding', valor: 80_000_000 });
  fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
  const sub = lugarLivre(e)!;
  fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'servicos', valor: 30_000_000 });
  return { e, holding, sub };
}

describe('mover caixa em qualquer valor (I-175)', () => {
  it('da holding para a sua conta, qualquer valor até o caixa; o valor da holding continua igual ao caixa', () => {
    const { e, holding } = grupo(1);
    const h = e.entidades[holding]!;
    const conta = e.entidades['eu']!.n['dinheiro']!;
    const caixa = h.n['caixa']!;
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: 'eu', valor: 12_345_678 });
    expect(e.entidades['eu']!.n['dinheiro']! - conta).toBeCloseTo(12_345_678, 0);
    expect(caixa - h.n['caixa']!).toBeCloseTo(12_345_678, 0);
    expect(h.n['valor']).toBeCloseTo(h.n['caixa']!, 0);
    expect(motivoParaNaoOperar(e, c, { tipo: 'transferirCaixa', de: holding, para: 'eu', valor: h.n['caixa']! + 10 })).toMatch(/caixa/);
    conferir(e);
  });

  it('da holding para a subsidiária e de volta; entre empresas sem controle, não', () => {
    const { e, holding, sub } = grupo(2);
    const antes = e.entidades[sub]!.n['caixa']!;
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: 7_000_000 });
    expect(e.entidades[sub]!.n['caixa']! - antes).toBeCloseTo(7_000_000, 0);
    fazer(e, { tipo: 'transferirCaixa', de: sub, para: holding, valor: 2_000_000 });
    expect(e.entidades[holding]!.n['valor']).toBeCloseTo(e.entidades[holding]!.n['caixa']!, 0);
    // A subsidiária não é sua direto: o dinheiro dela sobe para a holding primeiro.
    expect(motivoParaNaoOperar(e, c, { tipo: 'transferirCaixa', de: sub, para: 'eu', valor: 1000 })).toMatch(/não é sua direto/);
    // A empresa de comércio e a subsidiária são irmãs: nenhuma controla a outra.
    expect(motivoParaNaoOperar(e, c, { tipo: 'transferirCaixa', de: 'empresa', para: sub, valor: 1000 })).toMatch(/só anda/);
    umAno(e);
    conferir(e);
  });
});

describe('os CEOs das subsidiárias (I-176)', () => {
  it('a subsidiária nova nasce com o dia a dia delegado e tem CEO com nome, o mesmo na vida inteira', () => {
    const { e, sub } = grupo(3);
    const s = e.entidades[sub]!;
    expect(autonomiaDe(s)).toBe('delegada');
    const ceo = ceoDe(e, c, s)!;
    expect(ceo.nome).toMatch(/\S+ \S+/);
    expect(ceoDe(e, c, s)).toEqual(ceo);
    expect(ceoDe(e, c, e.entidades['empresa']!)).toBeUndefined();
    expect(e.historico.some((h) => h.texto.includes(ceo.nome))).toBe(true);
  });

  it('com a carta branca, a CEO manda para cima o caixa que passa de um ano de custos', () => {
    const { e, holding, sub } = grupo(4);
    fazer(e, { tipo: 'governanca', empresa: sub, autonomia: 'carta_branca', mandato: 'conservador' });
    umAno(e);
    const s = e.entidades[sub]!;
    // Um caixa acima de um ano de custos: a diretoria devolve a sobra à holding no ano seguinte.
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: Math.floor(e.entidades[holding]!.n['caixa']! * 0.9) });
    const caixaAntes = s.n['caixa']!;
    umAno(e);
    const custo = Math.max(0, (s.n['receita'] ?? 0) - (s.n['lucro'] ?? 0));
    expect(custo).toBeGreaterThan(0);
    expect(s.n['caixa']!).toBeLessThan(caixaAntes);
    const entrada = e.historico.filter((h) => h.ref === 'conselho:decidiu').at(-1)!;
    expect(entrada.texto).toMatch(/de sobra para/);
    expect(entrada.texto).toContain(ceoDe(e, c, s)!.nome);
    expect(empresasDe(e).length).toBeGreaterThanOrEqual(3);
    conferir(e);
  });
});
