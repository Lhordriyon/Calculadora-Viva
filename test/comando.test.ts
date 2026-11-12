/**
 * O comando claro (I-175 a I-177): mover caixa em qualquer valor entre a holding, as subsidiárias e a conta de quem
 * joga, e a CEO com carta branca que cuida do caixa.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { empresasDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { alvoDaAquisicao, custoDaAquisicao, lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { autonomiaDe, ceoDe } from '../src/motor/governanca.ts';
import { abrirConcorrente } from '../src/motor/concorrentes.ts';
import { unidadesDe } from '../src/motor/unidades.ts';
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
  it('a subsidiária nova nasce com carta branca e tem CEO com nome, o mesmo na vida inteira', () => {
    const { e, sub } = grupo(3);
    const s = e.entidades[sub]!;
    expect(autonomiaDe(s)).toBe('carta_branca');
    expect(autonomiaDe(e.entidades['empresa']!)).toBe('manual');
    const ceo = ceoDe(e, c, s)!;
    expect(ceo.nome).toMatch(/\S+ \S+/);
    expect(ceoDe(e, c, s)).toEqual(ceo);
    expect(ceoDe(e, c, e.entidades['empresa']!)).toBeUndefined();
    expect(e.historico.some((h) => h.texto.includes(ceo.nome))).toBe(true);
  });

  it('com a carta branca, a CEO manda para cima o caixa que passa de um ano de custos', () => {
    const { e, holding, sub } = grupo(4);
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

describe('a diretoria com carta branca cresce sozinha (I-178)', () => {
  it('com fila de pedidos, constrói a unidade do setor na cidade mais barata, com o caixa da empresa', () => {
    const { e, holding, sub } = grupo(6);
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: 20_000_000 });
    const s = e.entidades[sub]!;
    const antes = unidadesDe(e, s).length;
    const conta = e.entidades['eu']!.n['dinheiro']!;
    s.n['demanda'] = (s.n['capacidade'] ?? 0) * 1.6;
    umAno(e);
    expect(unidadesDe(e, s).length).toBeGreaterThan(antes);
    const ultima = e.historico.filter((h) => h.ref === 'conselho:decidiu').at(-1)!;
    expect(ultima.texto).toMatch(/construiu um escritório em /);
    // O dinheiro de quem joga não entra: a obra sai do caixa da subsidiária.
    expect(e.entidades['eu']!.n['dinheiro']!).toBeGreaterThanOrEqual(conta);
    conferir(e);
  });

  it('compra o controle da concorrente barata, com o caixa dela, e a comprada vira empresa do grupo', () => {
    const { e, holding, sub } = grupo(7);
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: 25_000_000 });
    let antes = 0;
    let comprou = false;
    for (let i = 0; i < 15 && !comprou; i++) {
      // Uma concorrente de verdade no setor, barata (a sobra no setor), e o caixa da subsidiária com folga para pagar.
      if (!alvoDaAquisicao(e, sub)) {
        const reg: Mudanca[] = [];
        abrirConcorrente(e, c, reg, 'servicos', 30, 0);
        lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' }), reg);
      }
      e.entidades['setor_servicos']!.n['oferta'] = 125;
      const falta = custoDaAquisicao(e, sub, 1) / 0.5 - (e.entidades[sub]!.n['caixa'] ?? 0);
      if (falta > 1000 && (e.entidades[holding]!.n['caixa'] ?? 0) > falta) fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: Math.round(falta) });
      antes = empresasDe(e).length;
      umAno(e);
      comprou = e.historico.some((h) => h.ref === 'conselho:decidiu' && h.ano === e.ano - 1 && h.texto.includes('comprou a concorrente'));
    }
    expect(comprou).toBe(true);
    expect(empresasDe(e).length).toBe(antes + 1);
    conferir(e);
  });

  it('a empresa de R$ 100 milhões abre uma filial no país de melhor relação', () => {
    const { e, holding, sub } = grupo(8);
    for (const p of ['federacao', 'celeste', 'liga', 'pacto']) {
      delete e.entidades[p]!.q['sancao'];
      e.entidades[p]!.n['relacao'] = p === 'celeste' ? 80 : 40;
    }
    fazer(e, { tipo: 'transferirCaixa', de: holding, para: sub, valor: 15_000_000 });
    const s = e.entidades[sub]!;
    let filial = false;
    for (let i = 0; i < 30 && !filial; i++) {
      s.n['valor'] = Math.max(s.n['valor'] ?? 0, 150_000_000);
      umAno(e);
      filial = empresasDe(e).some((x) => x.t['pais'] === 'celeste');
    }
    expect(filial).toBe(true);
    expect(e.historico.some((h) => h.ref === 'conselho:decidiu' && h.texto.includes('abriu uma filial na República Celeste'))).toBe(true);
  });
});

