/**
 * O grupo no mundo (I-166 a I-169): a filial em outro país, a fatia de cada país, de cada setor e do mundo, os
 * funcionários do grupo, o grupo e quem joga diante do planeta, e os 10 mais ricos e as 10 maiores empresas.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { empresasDe, patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { fatiasDoGrupo, grupoNoMundo, maioresEmpresasDoPais, maisRicosDoPais, paisDaEmpresa, pibDoPais, pibDoPlaneta } from '../src/motor/mundo-das-empresas.ts';
import { economiaDo, mercadoDaEmpresa } from '../src/motor/negocio.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { unidadesDe } from '../src/motor/unidades.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 40;
  e.ano += 40;
  e.agenda = [];
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  for (const p of ['federacao', 'celeste', 'liga', 'pacto']) {
    delete e.entidades[p]!.q['sancao'];
    e.entidades[p]!.n['relacao'] = 55;
  }
  const antes = dinheiroDoMundo(e);
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 });
  e.entidades['mercado']!.n['dinheiro']! -= dinheiroDoMundo(e) - antes;
  return e;
}

function fazer(e: EstadoVida, op: Operacao): void {
  expect(motivoParaNaoOperar(e, c, op), JSON.stringify(op)).toBeNull();
  operar(e, c, op);
}

function umAno(e: EstadoVida): Mudanca[] {
  const reg: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  regraDaEmpresa(e, c, momentoTipico('normal'), reg);
  lancar(e, entrada, reg);
  e.ano++;
  e.idade++;
  return reg;
}

function conferir(e: EstadoVida): void {
  for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
  expect(conferirEstado(e, c)).toEqual([]);
}

/** Uma indústria no Brasil e a filial dela na Liga Atlântica. */
function comFilial(semente: number): { e: EstadoVida; filial: string } {
  const e = adulto(semente, 400_000_000);
  fazer(e, { tipo: 'abrir', setor: 'industria', valor: 50_000_000 });
  fazer(e, { tipo: 'aportar', valor: 100_000_000 });
  const filial = lugarLivre(e)!;
  fazer(e, { tipo: 'fundarSubsidiaria', controladora: 'empresa', setor: 'industria', valor: 60_000_000, pais: 'liga' });
  return { e, filial };
}

describe('a filial lá fora (I-166)', () => {
  it('é uma subsidiária com país: a sede numa cidade de lá, o mercado de lá, e o dinheiro com o país de contraparte', () => {
    const { e, filial } = comFilial(1);
    const f = e.entidades[filial]!;
    expect(paisDaEmpresa(f)).toBe('liga');
    expect(f.nome).toMatch(/Liga Atlântica/);
    const liga = c.mundo.estrangeiros.find((x) => x.id === 'liga')!;
    expect(liga.cidades).toContain(unidadesDe(e, f)[0]!.t['cidade']);
    // O mercado dela é o de lá: o PIB do Brasil vezes o tamanho da Liga, na parte do setor.
    expect(mercadoDaEmpresa(e, c, f)).toBeCloseTo(pibDoPais(e, c, 'liga') * economiaDo(c.setores.get('industria')).peso, -3);
    const reg = umAno(e);
    expect(reg.some((m) => m.c === `${filial}.caixa` && m.r === 'vendas' && m.p === 'liga')).toBe(true);
    expect(reg.some((m) => m.c === `${filial}.caixa` && m.r === 'imposto' && m.p === 'tesouro')).toBe(false);
    conferir(e);
  });

  it('o país frio ou sob sanção não aprova a filial; sob sanção, a que já existe tem o dividendo retido', () => {
    const e = adulto(2, 300_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 50_000_000 });
    e.entidades['pacto']!.n['relacao'] = 20;
    expect(motivoParaNaoOperar(e, c, { tipo: 'fundarSubsidiaria', controladora: 'empresa', setor: 'comercio', valor: 1_000_000, pais: 'pacto' })).toMatch(/relação fria/);
    e.entidades['pacto']!.n['relacao'] = 55;
    e.entidades['pacto']!.q['sancao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    expect(motivoParaNaoOperar(e, c, { tipo: 'fundarSubsidiaria', controladora: 'empresa', setor: 'comercio', valor: 1_000_000, pais: 'pacto' })).toMatch(/sanção/);
    const { e: e2, filial } = comFilial(3);
    e2.entidades[filial]!.n['retirada'] = 0.6;
    e2.entidades[filial]!.n['demanda'] = (e2.entidades[filial]!.n['capacidade'] ?? 0) * 2;
    e2.entidades['liga']!.q['sancao'] = { v: 1, ano: e2.ano, idade: e2.idade, causa: null };
    const reg = umAno(e2);
    expect(reg.some((m) => m.c === `${filial}.caixa` && m.r === 'dividendos')).toBe(false);
    conferir(e2);
  });

  it('a unidade da filial fica nas cidades do país dela, e não passa para uma empresa de outro país', () => {
    const { e, filial } = comFilial(4);
    fazer(e, { tipo: 'aportarNaControlada', de: 'empresa', para: filial, valor: 30_000_000 });
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: filial, forma: 'fabrica', cidade: 'Campinas' })).toMatch(/cidade do país/);
    fazer(e, { tipo: 'construirUnidade', empresa: filial, forma: 'fabrica', cidade: 'Baía das Ligas' });
    const daqui = unidadesDe(e, e.entidades['empresa']!)[0]!;
    expect(motivoParaNaoOperar(e, c, { tipo: 'transferirUnidade', unidade: daqui.id, para: filial })).toMatch(/país dela/);
    conferir(e);
  });
});

describe('o grupo diante do mundo (I-167, I-168)', () => {
  it('a fatia em cada país e no mundo, os funcionários por país e o peso diante do planeta', () => {
    const { e } = comFilial(5);
    umAno(e);
    const fatias = fatiasDoGrupo(e, c);
    const industria = fatias.find((f) => f.setor === 'industria')!;
    expect(industria.porPais.map((p) => p.pais).sort()).toEqual(['brasil', 'liga']);
    for (const p of industria.porPais) expect(p.parte).toBeGreaterThan(0);
    expect(industria.mundo).toBeGreaterThan(0);
    expect(industria.mundo).toBeLessThan(Math.max(...industria.porPais.map((p) => p.parte)));
    const g = grupoNoMundo(e, c);
    expect(g.funcionarios).toBe(g.funcionariosPorPais.reduce((s, p) => s + p.funcionarios, 0));
    expect(g.funcionariosPorPais.some((p) => p.pais === 'liga' && p.funcionarios > 0)).toBe(true);
    expect(pibDoPlaneta(e, c)).toBeGreaterThan(40 * pibDoPais(e, c));
    expect(g.grupoNoPlaneta).toBeLessThan(g.grupoNoBrasil);
  });
});

describe('os 10 mais ricos e as 10 maiores (I-169)', () => {
  it('a lista dos mais ricos é a mesma na vida, do tamanho do país, e quem joga entra na posição dele', () => {
    const e = adulto(6, 1_000_000);
    const a = maisRicosDoPais(e, c);
    const b = maisRicosDoPais(e, c);
    expect(a).toEqual(b);
    expect(a.posicao).toBe(0);
    expect(a.lista).toHaveLength(11);
    expect(a.lista.at(-1)!.seu).toBe(true);
    for (let i = 1; i < 10; i++) expect(a.lista[i - 1]!.valor).toBeGreaterThanOrEqual(a.lista[i]!.valor);
    expect(a.lista[0]!.valor).toBeGreaterThan(pibDoPais(e, c) * 0.008);
    // Rico como o primeiro da lista, quem joga sobe para o topo.
    const rico = adulto(6, a.lista[0]!.valor * 2);
    const r = maisRicosDoPais(rico, c);
    expect(r.posicao).toBe(1);
    expect(r.lista).toHaveLength(10);
    expect(patrimonioTotal(rico)).toBeGreaterThan(r.lista[1]!.valor);
  });

  it('as maiores empresas do país: as grandes, as concorrentes e as do grupo, das maiores para as menores', () => {
    const { e } = comFilial(7);
    umAno(e);
    const lista = maioresEmpresasDoPais(e, c);
    expect(lista).toHaveLength(10);
    for (let i = 1; i < lista.length; i++) expect(lista[i - 1]!.valor).toBeGreaterThanOrEqual(lista[i]!.valor);
    // Uma empresa do grupo do tamanho da maior do país entra no topo; a filial lá fora não entra na lista daqui.
    const emp = e.entidades['empresa']!;
    emp.n['valor'] = lista[0]!.valor * 2;
    const topo = maioresEmpresasDoPais(e, c);
    expect(topo[0]!.seu).toBe(true);
    expect(topo.some((x) => x.nome.includes('Liga Atlântica'))).toBe(false);
    expect(empresasDe(e).length).toBeGreaterThanOrEqual(2);
  });
});
