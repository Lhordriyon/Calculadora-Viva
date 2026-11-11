/**
 * As unidades operacionais (missão Capitalismo vivo, I-158): o teste 2 do dono, a separação operacional. A subsidiária é
 * uma pessoa jurídica (número, caixa, sócios); a unidade é um estabelecimento de uma delas (a fábrica, a loja, o
 * laboratório), com cidade e capacidade, e a capacidade da empresa é a soma das unidades que produzem.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { empresaDoRegistro, empresasDe, refDaEmpresa } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { empregosNaCidadeDe, funcionariosDe } from '../src/motor/negocio.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { UNIDADES } from '../src/motor/regras.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import {
  capacidadePelaCidade,
  deApoioDe,
  empresaDaUnidade,
  fatorDaCidade,
  fatorDoCentro,
  fatorDoLaboratorio,
  porteDoApoioNovo,
  produtivasDe,
  unidadesDe,
} from '../src/motor/unidades.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Um adulto de 35 anos em São Paulo, no país normal, com dinheiro na conta (vindo das famílias do país). */
function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { cidade: 'São Paulo' } });
  e.idade = 35;
  e.ano += 35;
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

/** Um ano das empresas, lançado no livro como regra. */
function umAno(e: EstadoVida): Mudanca[] {
  const reg: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  regraDaEmpresa(e, c, momentoTipico('normal'), reg);
  lancar(e, entrada, reg);
  return reg;
}

function conferir(e: EstadoVida): void {
  for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
  expect(conferirEstado(e, c)).toEqual([]);
}

describe('teste 2: a separação operacional (a subsidiária é empresa; a unidade é estabelecimento)', () => {
  it('a empresa nasce com a sede: uma unidade da forma do setor, na cidade de quem joga, com a capacidade dela inteira', () => {
    const e = adulto(1, 10_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 2_000_000 });
    const emp = e.entidades['empresa']!;
    const lista = unidadesDe(e, emp);
    expect(lista).toHaveLength(1);
    const sede = lista[0]!;
    expect(sede.tipo).toBe('unidade');
    expect(sede.t['forma']).toBe('fabrica');
    expect(sede.t['cidade']).toBe('São Paulo');
    expect(sede.q['sede']).toBeDefined();
    expect(sede.n['capacidade']).toBeCloseTo(emp.n['capacidade']!);
    // A unidade não é pessoa jurídica: sem caixa, sem sócios, sem dívida, sem número de empresa; aponta a dona pelo número dela.
    expect(sede.n['caixa']).toBeUndefined();
    expect(sede.t['dona']).toBeUndefined();
    expect(sede.registro).toBeUndefined();
    expect(sede.t['empresa']).toBe(refDaEmpresa(emp));
    expect(empresaDaUnidade(e, sede)?.id).toBe('empresa');
    conferir(e);
  });

  it('a holding não tem unidade; cada subsidiária tem as dela, e a unidade fica com a empresa quando ela muda de lugar no grupo', () => {
    const e = adulto(2, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 6_000_000 });
    fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
    const filha = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'saude', valor: 3_000_000 });
    expect(unidadesDe(e, e.entidades[holding]!)).toHaveLength(0);
    const daFilha = unidadesDe(e, e.entidades[filha]!);
    expect(daFilha).toHaveLength(1);
    expect(daFilha[0]!.t['forma']).toBe('clinica');
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: holding, forma: 'loja', cidade: 'Campinas' })).toMatch(/holding/);
    // Vender a filha inteira: ela sai do grupo (outro id), e a clínica continua dela, pelo número.
    const registro = e.entidades[filha]!.registro!;
    fazer(e, { tipo: 'venderParticipacao', empresa: filha, fracao: 1 });
    const fora = empresaDoRegistro(e, `#${registro}`)!;
    expect(fora.id).not.toBe(filha);
    expect(unidadesDe(e, fora)).toHaveLength(1);
    conferir(e);
  });

  it('a fábrica nova fica numa outra cidade: a obra é dela, fica pronta nela no ano seguinte, e a capacidade da empresa é a soma', () => {
    const e = adulto(3, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 4_000_000 });
    fazer(e, { tipo: 'aportar', valor: 6_000_000 });
    const emp = e.entidades['empresa']!;
    const antes = emp.n['capacidade']!;
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas', fracao: 0.5 });
    const nova = unidadesDe(e, emp).find((u) => u.t['cidade'] === 'Campinas')!;
    expect(nova.n['obra']).toBeCloseTo(antes * 0.5);
    expect(emp.n['obra']).toBeCloseTo(antes * 0.5);
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas' })).toMatch(/obra em andamento/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'loja', cidade: 'Campinas' })).toMatch(/setor/);
    umAno(e);
    expect(nova.n['obra'] ?? 0).toBe(0);
    expect(nova.n['capacidade']).toBeCloseTo(antes * 0.5, -1);
    const soma = produtivasDe(e, emp).reduce((s, u) => s + (u.n['capacidade'] ?? 0), 0);
    expect(soma).toBeCloseTo(emp.n['capacidade']!, 0);
    conferir(e);
  });

  it('a cidade pesa na estrutura: no interior, partindo de São Paulo, a mesma capacidade custa menos', () => {
    expect(fatorDaCidade(c, 'São Paulo', 'São Paulo')).toBe(1);
    expect(fatorDaCidade(c, 'Campinas', 'São Paulo')).toBeLessThan(0.9);
    expect(fatorDaCidade(c, 'São Paulo', 'Campinas')).toBeGreaterThan(1.1);
    const e = adulto(4, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 4_000_000 });
    fazer(e, { tipo: 'aportar', valor: 8_000_000 });
    const emp = e.entidades['empresa']!;
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas', fracao: 1 });
    umAno(e);
    // A capacidade dobrou, mas metade está em Campinas: a estrutura pesada pela cidade é menor que a capacidade.
    expect(capacidadePelaCidade(e, c, emp)).toBeLessThan((emp.n['capacidade'] ?? 0) * 0.95);
    // Os empregos de Campinas não contam no desemprego de São Paulo.
    expect(empregosNaCidadeDe(e, c, emp)).toBeLessThan(funcionariosDe(e, c, emp) * 0.75);
    conferir(e);
  });

  it('o laboratório faz o P&D render mais; o centro de distribuição barateia cada venda; os dois custam o porte todo ano', () => {
    const e = adulto(5, 30_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 8_000_000 });
    const emp = e.entidades['empresa']!;
    umAno(e);
    expect(fatorDoLaboratorio(e, emp)).toBe(1);
    expect(fatorDoCentro(e, emp)).toBe(1);
    const lab = porteDoApoioNovo(emp, 'laboratorio');
    const caixa = emp.n['caixa']!;
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'laboratorio', cidade: 'São Paulo' });
    expect(emp.n['caixa']).toBeCloseTo(caixa - lab.custo, 0);
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'centro', cidade: 'Campinas' });
    // A unidade de apoio não mexe na capacidade: só a que produz.
    expect(deApoioDe(e, emp)).toHaveLength(2);
    expect(produtivasDe(e, emp)).toHaveLength(1);
    umAno(e);
    expect(fatorDoLaboratorio(e, emp)).toBeGreaterThan(1.2);
    expect(fatorDoCentro(e, emp)).toBeLessThan(0.98);
    // O comércio não tem laboratório no catálogo.
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
    const loja = Object.values(e.entidades).find((x) => x.tipo === 'empresa' && x.t['setor'] === 'comercio')!;
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: loja.id, forma: 'laboratorio', cidade: 'São Paulo' })).toMatch(/setor/);
    conferir(e);
  });

  it('transferir a fábrica entre duas empresas do grupo: o caixa passa de uma para a outra, e a capacidade e a clientela vão junto', () => {
    const e = adulto(6, 30_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 6_000_000 });
    fazer(e, { tipo: 'aportar', valor: 6_000_000 });
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas', fracao: 0.5 });
    umAno(e);
    const segunda = lugarLivre(e)!;
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 6_000_000 });
    const a = e.entidades['empresa']!;
    const b = e.entidades[segunda]!;
    const fabrica = unidadesDe(e, a).find((u) => u.t['cidade'] === 'Campinas')!;
    const cap = fabrica.n['capacidade']!;
    const [capA, capB, caixaA, caixaB] = [a.n['capacidade']!, b.n['capacidade']!, a.n['caixa']!, b.n['caixa']!];
    const mundo = dinheiroDoMundo(e);
    fazer(e, { tipo: 'transferirUnidade', unidade: fabrica.id, para: segunda });
    expect(empresaDaUnidade(e, fabrica)?.id).toBe(segunda);
    expect(a.n['capacidade']).toBeCloseTo(capA - cap, 0);
    expect(b.n['capacidade']).toBeCloseTo(capB + cap, 0);
    const pago = caixaB - b.n['caixa']!;
    expect(pago).toBeGreaterThan(0);
    expect(a.n['caixa']! - caixaA).toBeCloseTo(pago, 0);
    // Dentro do grupo, o dinheiro não nasce nem some.
    expect(dinheiroDoMundo(e)).toBeCloseTo(mundo, 0);
    conferir(e);
  });

  it('fechar e vender: a única que produz não sai sozinha; fechar vende as máquinas pela metade, vender leva a clientela junto', () => {
    const e = adulto(7, 30_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 4_000_000 });
    const emp = e.entidades['empresa']!;
    const sede = unidadesDe(e, emp)[0]!;
    expect(motivoParaNaoOperar(e, c, { tipo: 'fecharUnidade', unidade: sede.id })).toMatch(/única/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'venderUnidade', unidade: sede.id })).toMatch(/única/);
    fazer(e, { tipo: 'aportar', valor: 6_000_000 });
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'loja', cidade: 'Campinas', fracao: 0.5 });
    umAno(e);
    const loja = unidadesDe(e, emp).find((u) => u.t['cidade'] === 'Campinas')!;
    const demanda = emp.n['demanda']!;
    const caixa = emp.n['caixa']!;
    fazer(e, { tipo: 'venderUnidade', unidade: loja.id });
    expect(e.entidades[loja.id]).toBeUndefined();
    expect(emp.n['demanda']).toBeLessThan(demanda);
    expect(emp.n['caixa']).toBeGreaterThan(caixa);
    expect(unidadesDe(e, emp)).toHaveLength(1);
    expect(unidadesDe(e, emp)[0]!.q['sede']).toBeDefined();
    conferir(e);
  });

  it('a sede fechada passa para a maior das que ficaram; no máximo oito unidades por empresa', () => {
    const e = adulto(8, 60_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 10_000_000 });
    fazer(e, { tipo: 'aportar', valor: 30_000_000 });
    const emp = e.entidades['empresa']!;
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas', fracao: 1 });
    umAno(e);
    const sede = unidadesDe(e, emp).find((u) => u.q['sede'])!;
    fazer(e, { tipo: 'fecharUnidade', unidade: sede.id });
    expect(unidadesDe(e, emp)[0]!.t['cidade']).toBe('Campinas');
    expect(unidadesDe(e, emp)[0]!.q['sede']).toBeDefined();
    for (let i = unidadesDe(e, emp).length; i < UNIDADES.maximo; i++) fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'centro', cidade: 'Campinas' });
    expect(motivoParaNaoOperar(e, c, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'centro', cidade: 'Campinas' })).toMatch(/8 unidades/);
    conferir(e);
  });

  it('o save de antes das unidades: a empresa ganha a sede com a capacidade e a obra que já tinha, sem nenhuma empresa nova', () => {
    const e = adulto(9, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 4_000_000 });
    fazer(e, { tipo: 'expandir', fracao: 0.25 });
    const emp = e.entidades['empresa']!;
    // Como era antes: sem unidade nenhuma.
    for (const u of unidadesDe(e, emp)) delete e.entidades[u.id];
    const empresas = empresasDe(e).length;
    const cap = emp.n['capacidade']!;
    const obra = emp.n['obra']!;
    const volta = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    const reg: Mudanca[] = [];
    const entrada = novaEntrada(volta, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
    regraDaEmpresa(volta, c, momentoTipico('normal'), reg);
    lancar(volta, entrada, reg);
    const novo = volta.entidades['empresa']!;
    // Nenhuma empresa nova no grupo (a concorrente de verdade que aparece é de fora: concorrentes.ts).
    expect(empresasDe(volta).length).toBe(empresas);
    const sede = unidadesDe(volta, novo);
    expect(sede).toHaveLength(1);
    // A obra de antes ficou pronta no ano, na sede: a capacidade da sede é a de antes mais a obra (menos o que o ano cortou).
    expect(sede[0]!.n['capacidade']).toBeCloseTo(novo.n['capacidade']!, 0);
    expect(novo.n['capacidade']).toBeLessThanOrEqual(cap + obra + 1);
    expect(conferirEstado(volta, c)).toEqual([]);
  });

  it('salvar e carregar preserva cada unidade, a cidade, a forma e a empresa dona', () => {
    const e = adulto(10, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 4_000_000 });
    fazer(e, { tipo: 'construirUnidade', empresa: 'empresa', forma: 'fabrica', cidade: 'Campinas' });
    const volta = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    for (const u of Object.values(e.entidades).filter((x) => x.tipo === 'unidade')) {
      expect(volta.entidades[u.id]).toEqual(u);
    }
    expect(volta.proximoRegistro).toBe(e.proximoRegistro);
  });
});
