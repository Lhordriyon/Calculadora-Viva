/**
 * As concorrentes de verdade (missão Capitalismo vivo, I-159): o teste 3 do dono (a concorrência controlada pela IA),
 * o teste 4 (comprar 80% de uma concorrente sem fundir) e o teste 9 (a falência de uma subsidiária, sozinha), com as
 * partes do mercado somando 100%.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { donaDe, empresasDe, parteEfetiva, refDaEmpresa } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { abrirConcorrente, concorrentesNoSetor, deFora, forcaReal, partesDoMercado, principalDe } from '../src/motor/concorrentes.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import { custoDaAquisicao, fecharEmpresa, lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { atratividade } from '../src/motor/negocio.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { unidadesDe } from '../src/motor/unidades.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { novaMemoria } from '../src/motor/memoria.ts';

const c = carregarConteudo();

function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 35;
  e.ano += 35;
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

/** Um ano das empresas (as do grupo e as de fora), lançado no livro como regra. */
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

describe('teste 3: a concorrência é feita de empresas, que decidem sozinhas', () => {
  it('no primeiro ano, o setor ganha a concorrente principal: uma pessoa jurídica de fora, com dono, caixa, unidades e clientela', () => {
    const e = adulto(1, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 5_000_000 });
    expect(concorrentesNoSetor(e, 'industria')).toHaveLength(0);
    umAno(e);
    const emp = e.entidades['empresa']!;
    const rival = principalDe(e, emp)!;
    expect(rival).toBeDefined();
    expect(deFora(rival)).toBe(true);
    expect(rival.registro).toBeGreaterThan(emp.registro!);
    expect(donaDe(rival)).not.toBe('eu');
    expect(parteEfetiva(e, rival)).toBe(0);
    expect(rival.n['caixa']).toBeGreaterThan(0);
    expect(rival.n['demanda']).toBeGreaterThan(0);
    expect(unidadesDe(e, rival)).toHaveLength(1);
    // A força que o conteúdo lê é a atratividade dela.
    expect(emp.n['concorrente']).toBe(forcaReal(e, emp));
    expect(emp.n['concorrente']).toBe(Math.round(50 * atratividade(rival)));
    conferir(e);
  });

  it('ela roda o mesmo negócio: vende, paga custos e imposto ao Tesouro, e o caixa e o valor andam pelos fundamentos', () => {
    const e = adulto(2, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 5_000_000 });
    umAno(e);
    const rival = principalDe(e, e.entidades['empresa']!)!;
    const reg = umAno(e);
    expect(rival.n['receita']).toBeGreaterThan(0);
    expect(rival.n['lucro']).toBeDefined();
    // O resultado do mercado (as vendas menos os custos) vai num lançamento só, com o mercado de contraparte.
    expect(reg.some((m) => m.c === `${rival.id}.caixa` && m.r === 'resultado' && m.p === 'mercado')).toBe(true);
    expect(reg.some((m) => m.c === `${rival.id}.caixa` && m.r === 'imposto' && m.p === 'tesouro') || (rival.n['impostos'] ?? 0) === 0).toBe(true);
    conferir(e);
  });

  it('atrás de quem joga, ela reage: sobe o marketing e o P&D do próprio caixa', () => {
    const e = adulto(3, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'tecnologia', valor: 5_000_000 });
    umAno(e);
    const emp = e.entidades['empresa']!;
    const rival = principalDe(e, emp)!;
    const antes = (rival.n['marketing'] ?? 0) + (rival.n['pd'] ?? 0);
    for (let i = 0; i < 6; i++) {
      emp.n['qualidade'] = 95;
      emp.n['marca'] = 95;
      umAno(e);
    }
    expect((rival.n['marketing'] ?? 0) + (rival.n['pd'] ?? 0)).toBeGreaterThan(antes);
    conferir(e);
  });

  it('contra o preço popular de quem atrai mais, entra na guerra de preços: as duas cobram menos, e quem atrai menos perde clientela', () => {
    let achou = false;
    for (let s = 0; s < 12 && !achou; s++) {
      const e = adulto(40 + s, 20_000_000);
      fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 5_000_000 });
      umAno(e);
      const emp = e.entidades['empresa']!;
      fazer(e, { tipo: 'preco', nivel: 'popular' });
      for (let i = 0; i < 5 && !emp.q['guerra']; i++) {
        emp.n['qualidade'] = 90;
        emp.n['marca'] = 90;
        umAno(e);
      }
      if (!emp.q['guerra']) continue;
      achou = true;
      const rival = principalDe(e, emp)!;
      expect(rival.q['guerra']).toBeDefined();
      expect(rival.t['preco']).toBe('popular');
      conferir(e);
    }
    expect(achou).toBe(true);
  });

  it('as partes do mercado somam 100%: as empresas do grupo, as concorrentes e o resto (os importados e os pequenos)', () => {
    const e = adulto(5, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'saude', valor: 5_000_000 });
    umAno(e);
    abrirConcorrente(e, c, [], 'saude', 65, 0);
    const partes = partesDoMercado(e, c, 'saude');
    expect(partes.length).toBeGreaterThanOrEqual(3);
    expect(partes.reduce((s, p) => s + p.parte, 0)).toBeCloseTo(1, 9);
    expect(partes.at(-1)!.id).toBeNull();
    expect(partes.every((p) => p.parte >= 0)).toBe(true);
    expect(partes.filter((p) => p.doGrupo)).toHaveLength(1);
  });
});

describe('teste 4: comprar 80% da concorrente não a funde', () => {
  it('ela continua de pé, com o mesmo número, o caixa, as unidades, a marca e a clientela; 80% da compradora, 20% de fora', () => {
    const e = adulto(6, 200_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 20_000_000 });
    umAno(e);
    const emp = e.entidades['empresa']!;
    // O dono da concorrente é o mercado (sem a rival de pé, ninguém recusa).
    delete e.entidades['rival'];
    const alvo = principalDe(e, emp)!;
    if (donaDe(alvo) !== 'mercado') alvo.t['dona'] = 'mercado';
    const foto = { registro: alvo.registro, nome: alvo.nome, caixa: alvo.n['caixa'], demanda: alvo.n['demanda'], marca: alvo.n['marca'], unidades: unidadesDe(e, alvo).map((u) => u.id) };
    const capacidadeDaCompradora = emp.n['capacidade'];
    const preco = custoDaAquisicao(e);
    const mundo = dinheiroDoMundo(e);
    const lugar = lugarLivre(e)!;
    fazer(e, { tipo: 'adquirir', fracao: 0.8 });
    const comprada = e.entidades[lugar]!;
    expect(comprada.registro).toBe(foto.registro);
    expect(comprada.nome).toBe(foto.nome);
    expect(comprada.n['caixa']).toBeCloseTo(foto.caixa!, 0);
    expect(comprada.n['demanda']).toBeCloseTo(foto.demanda!, 0);
    expect(comprada.n['marca']).toBeCloseTo(foto.marca!, 6);
    expect(unidadesDe(e, comprada).map((u) => u.id)).toEqual(foto.unidades);
    // Controlada pela compradora: 80% dela, e quem joga tem 80% pela compradora.
    expect(donaDe(comprada)).toBe(refDaEmpresa(emp));
    expect(comprada.n['participacao']).toBeCloseTo(0.8, 9);
    expect(parteEfetiva(e, comprada)).toBeCloseTo(0.8, 9);
    // Não houve fusão: a estrutura da compradora é a mesma.
    expect(emp.n['capacidade']).toBe(capacidadeDaCompradora);
    expect(empresasDe(e).map((x) => x.id)).toContain(lugar);
    // O dinheiro saiu de verdade (do caixa da compradora e, no que faltou, de quem joga) e não nasceu nem sumiu.
    expect(preco).toBeGreaterThan(0);
    expect(dinheiroDoMundo(e)).toBeCloseTo(mundo, -1);
    conferir(e);
    // No ano seguinte, o setor ganha uma concorrente nova, mais fraca (o mercado ficou mais fechado).
    umAno(e);
    const nova = principalDe(e, emp);
    expect(nova).toBeDefined();
    expect(nova!.id).not.toBe(comprada.id);
    conferir(e);
  });

  it('com a rival dona da concorrente, ela fica com os 20% como sócia e, de bem, toca o negócio', () => {
    for (let s = 0; s < 20; s++) {
      const e = adulto(70 + s, 200_000_000);
      fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
      for (let i = 0; i < 2; i++) {
        while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
        avancarAno(e, c, novaMemoria());
      }
      while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
      if (!e.vivo || !e.entidades['empresa']) continue;
      const emp = e.entidades['empresa']!;
      const rival = e.entidades['rival'];
      const alvo = principalDe(e, emp);
      if (!rival || !alvo || donaDe(alvo) !== `p${rival.pessoa}`) continue;
      Object.assign(rival.n, { magoa: 0, vinculo: 95 });
      const lugar = lugarLivre(e)!;
      operar(e, c, { tipo: 'adquirir', fracao: 0.8 });
      const comprada = e.entidades[lugar];
      if (!comprada || comprada.registro !== alvo.registro) continue;
      expect(comprada.t['socia']).toBe(`p${rival.pessoa}`);
      expect(comprada.n['participacao_socia']).toBeCloseTo(0.2, 9);
      expect(comprada.n['participacao']).toBeCloseTo(0.8, 9);
      conferir(e);
      return;
    }
    throw new Error('nenhuma vida chegou à compra com a rival dona da concorrente');
  });
});

describe('teste 9: a subsidiária quebra sozinha', () => {
  it('a que fecha leva só o que era dela: a holding fica com o que sobrou do caixa, a outra subsidiária segue igual, e quem joga não paga a conta', () => {
    const e = adulto(9, 30_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 10_000_000 });
    fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
    const a = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'tecnologia', valor: 3_000_000 });
    const b = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'saude', valor: 2_000_000 });
    const h = e.entidades[holding]!;
    const outra = structuredClone(e.entidades[b]!);
    const contaAntes = e.entidades['eu']!.n['dinheiro']!;
    const caixaDaHolding = h.n['caixa']!;
    const caixaDela = e.entidades[a]!.n['caixa']!;
    const registro = e.entidades[a]!.registro!;
    // A subsidiária fecha (o efeito do fim da quebra, com um quarto do que ela valia de sobra).
    const reg: Mudanca[] = [];
    const entrada = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'teste:quebra', texto: '' });
    fecharEmpresa(e, reg, 0.25, a);
    lancar(e, entrada, reg);
    expect(e.entidades[a]?.vivo).toBe(false);
    expect(Object.values(e.entidades).some((u) => u.tipo === 'unidade' && u.t['empresa'] === `#${registro}`)).toBe(false);
    // O que sobrou do caixa foi para a holding; quem joga não pagou nem recebeu nada.
    const voltou = h.n['caixa']! - caixaDaHolding;
    expect(voltou).toBeGreaterThanOrEqual(0);
    expect(voltou).toBeLessThanOrEqual(caixaDela + 1);
    expect(e.entidades['eu']!.n['dinheiro']).toBeCloseTo(contaAntes, 6);
    // A outra subsidiária não sentiu: o mesmo caixa, a mesma estrutura, a mesma dona.
    const depois = e.entidades[b]!;
    expect(depois.n['caixa']).toBe(outra.n['caixa']);
    expect(depois.n['capacidade']).toBe(outra.n['capacidade']);
    expect(donaDe(depois)).toBe(refDaEmpresa(h));
    conferir(e);
  });

  it('a controladora que sai da vida não deixa as participações sem dona: elas sobem para quem era dona dela', () => {
    const e = adulto(10, 30_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 6_000_000 });
    const filha = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'tecnologia', valor: 3_000_000 });
    const r0: Mudanca[] = [];
    const e0 = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'teste:fechar', texto: '' });
    aplicarEfeitos(e, c, { fecharEmpresa: { sobra: 1 } } as Efeitos, { origem: e0.id, reg: r0, valores: {} });
    lancar(e, e0, r0);
    // Fechou a empresa de perto (a de comércio); a holding continua, e a filha também.
    expect(donaDe(e.entidades[filha]!)).toBe(refDaEmpresa(e.entidades[holding]!));
    const reg: Mudanca[] = [];
    const entrada = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'teste:fechar_holding', texto: '' });
    fecharEmpresa(e, reg, 1, holding);
    lancar(e, entrada, reg);
    expect(donaDe(e.entidades[filha]!)).toBe('eu');
    expect(parteEfetiva(e, e.entidades[filha]!)).toBeCloseTo(1, 9);
    conferir(e);
  });
});
