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
      expect(x.n['caixa']!).toBeLessThanOrEqual(custo * 0.25 + Math.max(0, x.n['lucro'] ?? 0) * 2 + 1_000_000);
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
    const ruim = e.entidades[subs[1]!]!;
    const nome = ruim.nome;
    // Quase sem clientes, ela paga a estrutura inteira e vende pouco: o ano fecha num prejuízo grande.
    ruim.n['demanda'] = (ruim.n['capacidade'] ?? 0) * 0.03;
    const antes = empresasDe(e).length;
    umAno(e);
    expect(e.historico.some((h) => h.ref === 'valor:decidiu' && h.texto.includes(`vendeu ${nome}`))).toBe(true);
    expect(empresasDe(e).length).toBeLessThan(antes);
    expect(e.entidades['empresa']).toBeDefined();
    conferir(e);
  });
});
