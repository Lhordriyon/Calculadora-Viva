/**
 * A economia do grupo (missão Capitalismo vivo): o teste 5 (a mídia vende audiência), o teste 6 (o marketing do grupo
 * na mídia do grupo, de caixa para caixa), o teste 8 (o monopólio e a autoridade antitruste), o teste 10 (a consolidação)
 * e o teste 11 (o PIB pelo valor adicionado, sem dupla contagem).
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { deFora, principalDe } from '../src/motor/concorrentes.ts';
import { empresasDe } from '../src/motor/campos.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { analiseDoCade, consolidada, contasNacionais, demonstracaoDe, hhiDoSetor } from '../src/motor/demonstracoes.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { alcanceDaCampanha, audienciaDe, custoDoLancamento, economiaDo, idadeDoProduto, mercadoDoSetor, velhiceDoProduto } from '../src/motor/negocio.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

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

/** Um ano das empresas, lançado no livro como a entrada das regras do ano (a que as demonstrações leem). */
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

/** Um grupo com uma indústria que anuncia muito e uma empresa de mídia (cultura e internet). */
function comMidia(semente: number): { e: EstadoVida; industria: string; midia: string } {
  const e = adulto(semente, 300_000_000);
  fazer(e, { tipo: 'abrir', setor: 'industria', valor: 60_000_000 });
  const midia = lugarLivre(e)!;
  fazer(e, { tipo: 'abrir', setor: 'cultura', valor: 60_000_000 });
  fazer(e, { tipo: 'verbas', empresa: 'empresa', marketing: 0.08, pd: 0.03 });
  return { e, industria: 'empresa', midia };
}

describe('teste 5: a mídia vende audiência', () => {
  it('a empresa de mídia tem audiência (a parte dela no setor) e recebe pela campanha de quem anuncia nela', () => {
    const { e, midia } = comMidia(1);
    umAno(e);
    const m = e.entidades[midia]!;
    expect(audienciaDe(e, c, m)).toBeGreaterThan(0);
    expect(audienciaDe(e, c, m)).toBeLessThan(1);
    const reg = umAno(e);
    const recebido = reg.filter((x) => x.c === `${midia}.caixa` && x.r === 'publicidade' && (x.d ?? 0) > 0).reduce((s, x) => s + x.d!, 0);
    expect(recebido).toBeGreaterThan(0);
    // A publicidade entra na receita e no lucro dela (com o imposto).
    expect(m.n['receita']).toBeGreaterThan(0);
    conferir(e);
  });
});

describe('teste 6: o marketing do grupo na mídia do grupo', () => {
  it('a verba de marketing sai do caixa de quem contrata e entra no de quem presta, na parte da audiência; o resto vai para o mercado', () => {
    const { e, industria, midia } = comMidia(2);
    umAno(e);
    const reg = umAno(e);
    const pago = reg.filter((x) => x.c === `${industria}.caixa` && x.r === 'publicidade' && x.p === midia).reduce((s, x) => s - x.d!, 0);
    const recebido = reg.filter((x) => x.c === `${midia}.caixa` && x.r === 'publicidade' && x.p === industria).reduce((s, x) => s + x.d!, 0);
    expect(pago).toBeGreaterThan(0);
    expect(recebido).toBeCloseTo(pago, 6);
    const campanha = (e.entidades[industria]!.n['receita'] ?? 0) * (e.entidades[industria]!.n['marketing'] ?? 0);
    expect(pago).toBeLessThan(campanha);
    conferir(e);
  });

  it('na consolidada, a campanha interna some da receita e do custo do grupo (o lucro do grupo não muda com ela)', () => {
    const { e } = comMidia(3);
    umAno(e);
    umAno(e);
    const g = consolidada(e);
    expect(g.receitaInterna).toBeGreaterThan(0);
    expect(g.receita).toBeCloseTo(g.somaDaReceita - g.receitaInterna - g.dividendosInternos, 0);
    expect(g.lucro).toBeCloseTo(g.somaDoLucro - g.dividendosInternos, 0);
  });
});

describe('teste 10: a demonstração individual e a consolidada', () => {
  it('o dividendo que a subsidiária paga à holding é receita da holding e some na consolidada; os minoritários ficam com a parte deles', () => {
    const e = adulto(10, 60_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 2_000_000 });
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 20_000_000 });
    const filha = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'tecnologia', valor: 10_000_000 });
    fazer(e, { tipo: 'dividendosDaControlada', empresa: filha, fracao: 1 });
    fazer(e, { tipo: 'venderParticipacao', empresa: filha, fracao: 0.3 });
    e.entidades[filha]!.n['demanda'] = (e.entidades[filha]!.n['capacidade'] ?? 0) * 2;
    umAno(e);
    const g = consolidada(e);
    const h = g.individuais.find((d) => d.id === holding)!;
    const f = g.individuais.find((d) => d.id === filha)!;
    expect(h.holding).toBe(true);
    if (f.lucro > 0) {
      expect(h.dividendosRecebidos).toBeGreaterThan(0);
      expect(g.dividendosInternos).toBeCloseTo(h.dividendosRecebidos, 0);
      expect(g.lucroDosMinoritarios).toBeGreaterThan(0);
    }
    expect(g.lucro).toBeCloseTo(g.somaDoLucro - g.dividendosInternos, 0);
    expect(g.lucroDeQuemJoga + g.lucroDosMinoritarios).toBeCloseTo(g.lucro, 0);
    expect(f.parte).toBeCloseTo(0.7, 6);
  });
});

describe('teste 11: o PIB pelo valor adicionado', () => {
  it('o valor adicionado é a receita menos o que se comprou de outras; o do grupo é uma fração do PIB, menor que a receita sobre o PIB', () => {
    const { e, industria } = comMidia(11);
    umAno(e);
    umAno(e);
    const d = demonstracaoDe(e, e.entidades[industria]!);
    expect(d.insumos).toBeGreaterThan(0);
    expect(d.valorAdicionado).toBeCloseTo(d.receita - d.insumos, 0);
    const pib = contasNacionais(e);
    expect(pib.doGrupo).toBeGreaterThan(0);
    expect(pib.pesoNoPib).toBeLessThan(pib.receitaSobrePib);
    expect(pib.doResto).toBeCloseTo(pib.pib - pib.dasModeladas, 0);
    expect(e.entidades['pais']!.n['peso_do_grupo']).toBeCloseTo(pib.pesoNoPib, 3);
  });
});

describe('teste 8: o poder de mercado e o Cade', () => {
  it('a compra que concentra o mercado passa pelo Cade: o índice HHI depois da compra decide', () => {
    const e = adulto(8, 2_000_000_000);
    fazer(e, { tipo: 'abrir', setor: 'saude', valor: 400_000_000 });
    umAno(e);
    const emp = e.entidades['empresa']!;
    const alvo = principalDe(e, emp)!;
    const antes = hhiDoSetor(e, c, 'saude');
    const depois = hhiDoSetor(e, c, 'saude', { de: alvo.id, para: 'grupo' });
    expect(depois).toBeGreaterThan(antes);
  });
});

describe('teste 6 (a decisão): anunciar só na mídia do grupo', () => {
  it('a campanha inteira vai de caixa para caixa; a marca alcança a audiência dela, não o país', () => {
    const { e, industria, midia } = comMidia(21);
    umAno(e);
    fazer(e, { tipo: 'anunciar', empresa: industria, midia });
    expect(alcanceDaCampanha(e, c, e.entidades[industria]!)).toBeLessThan(1);
    const reg = umAno(e);
    const pago = reg.filter((x) => x.c === `${industria}.caixa` && x.r === 'publicidade').reduce((s, x) => s - x.d!, 0);
    const campanha = (e.entidades[industria]!.n['receita'] ?? 0) * (e.entidades[industria]!.n['marketing'] ?? 0);
    expect(pago).toBeCloseTo(campanha, -2);
    expect(motivoParaNaoOperar(e, c, { tipo: 'anunciar', empresa: industria, midia: industria })).toMatch(/mídia/);
    conferir(e);
  });
});

describe('teste 7: o conselho decide dentro do mandato', () => {
  it('com autonomia, o conselho faz as jogadas do jeito do mandato, e o livro aponta quem delegou', () => {
    let achou = false;
    for (let s = 0; s < 10 && !achou; s++) {
      const e = adulto(30 + s, 100_000_000);
      fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
      fazer(e, { tipo: 'governanca', empresa: 'empresa', autonomia: 'autonoma', mandato: 'arrojado' });
      const delegou = e.historico.at(-1)!.id;
      expect(motivoParaNaoOperar(e, c, { tipo: 'governanca', empresa: 'empresa', autonomia: 'autonoma', mandato: 'arrojado' })).toBe('já é assim');
      for (let i = 0; i < 4 && !achou; i++) {
        umAno(e);
        const decisao = e.historico.find((h) => h.ref === 'conselho:decidiu');
        if (!decisao) continue;
        achou = true;
        expect(decisao.causas).toContain(delegou);
        expect(decisao.texto).toMatch(/arrojado/);
      }
      conferir(e);
    }
    expect(achou).toBe(true);
  });

  it('na autonomia manual, o conselho não faz nada sozinho', () => {
    const e = adulto(40, 100_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 20_000_000 });
    for (let i = 0; i < 3; i++) umAno(e);
    expect(e.historico.some((h) => h.ref === 'conselho:decidiu')).toBe(false);
  });
});

describe('teste 8: a compra que concentra o mercado passa pelo Cade', () => {
  function concentrado(semente: number, minha: number, dela: number): EstadoVida {
    const e = adulto(semente, 5_000_000_000_000);
    fazer(e, { tipo: 'abrir', setor: 'saude', valor: 500_000_000 });
    umAno(e);
    delete e.entidades['rival'];
    const emp = e.entidades['empresa']!;
    const alvo = principalDe(e, emp)!;
    alvo.t['dona'] = 'mercado';
    // O mercado do setor, dividido à força: o teste é da régua do Cade, não do crescimento.
    const mercado = mercadoDoSetor(e, economiaDo(c.setores.get('saude')));
    emp.n['demanda'] = mercado * minha;
    alvo.n['demanda'] = mercado * dela;
    return e;
  }

  it('o quase monopólio é barrado: a compra não acontece e os advogados custam', () => {
    const e = concentrado(50, 0.4, 0.35);
    const alvo = principalDe(e, e.entidades['empresa']!)!;
    expect(analiseDoCade(e, c, 'saude', alvo.id).decisao).toBe('barrada');
    const antes = empresasDe(e).length;
    fazer(e, { tipo: 'adquirir' });
    expect(e.historico.at(-1)!.texto).toMatch(/Cade barrou/);
    expect(empresasDe(e).length).toBe(antes);
    expect(deFora(e.entidades[alvo.id]!)).toBe(true);
  });

  it('a concentração alta, sem monopólio, passa com a análise; a pequena nem precisa notificar', () => {
    const e = concentrado(51, 0.4, 0.15);
    const alvo = principalDe(e, e.entidades['empresa']!)!;
    expect(analiseDoCade(e, c, 'saude', alvo.id).decisao).toBe('condicao');
    fazer(e, { tipo: 'adquirir' });
    expect(e.historico.at(-1)!.texto).toMatch(/O Cade aprov/);
    const pequeno = concentrado(52, 0.001, 0.001);
    expect(analiseDoCade(pequeno, c, 'saude', principalDe(pequeno, pequeno.entidades['empresa']!)!.id).decisao).toBe('livre');
  });
});

describe('o produto tem ciclo de vida (I-160)', () => {
  it('a geração envelhece depois de oito anos; lançar a nova custa do caixa, devolve qualidade e marca e zera a idade', () => {
    const e = adulto(60, 60_000_000);
    fazer(e, { tipo: 'abrir', setor: 'industria', valor: 20_000_000 });
    const emp = e.entidades['empresa']!;
    expect(emp.q['lancamento']).toBeDefined();
    expect(idadeDoProduto(e, emp)).toBe(0);
    expect(motivoParaNaoOperar(e, c, { tipo: 'lancar' })).toMatch(/novo/);
    for (let i = 0; i < 10; i++) umAno(e);
    expect(idadeDoProduto(e, emp)).toBe(10);
    expect(velhiceDoProduto(e, emp)).toBeGreaterThan(0);
    const [qualidade, marca, caixa] = [emp.n['qualidade']!, emp.n['marca']!, emp.n['caixa']!];
    const custo = custoDoLancamento(emp);
    fazer(e, { tipo: 'lancar' });
    expect(idadeDoProduto(e, emp)).toBe(0);
    expect(emp.n['qualidade']).toBeGreaterThan(qualidade);
    expect(emp.n['marca']).toBeGreaterThan(marca);
    expect(emp.n['caixa']).toBeCloseTo(caixa - custo, 0);
    expect(velhiceDoProduto(e, emp)).toBe(0);
    conferir(e);
  });
});
