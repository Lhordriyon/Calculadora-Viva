/**
 * O societário (missão Capitalismo vivo, I-156 e I-157): a holding, as subsidiárias como pessoas jurídicas, os
 * dividendos que sobem pela propriedade, o patrimônio sem dupla contagem, nenhum ciclo, a venda que deixa a empresa
 * viva fora do grupo, a herança e o save que preservam a estrutura. É o teste 1 do dono e parte do teste 12.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { donaDe, empresasDe, empresaDoRegistro, parteEfetiva, patrimonioTotal, refDaEmpresa, valorDasParticipacoes } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import { lugarLivre, regraDaEmpresa } from '../src/motor/empresa.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { idForaDoGrupo } from '../src/motor/grupo.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { HOLDING } from '../src/motor/regras.ts';
import { formaCiclo, mudarDona } from '../src/motor/societario.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Um adulto de 35 anos, no país normal, com dinheiro na conta. */
function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 35;
  e.ano += 35;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  // O dinheiro de quem joga vem das famílias do país (a conta do mercado), para o dinheiro do mundo continuar somando zero.
  const antes = dinheiroDoMundo(e);
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 });
  e.entidades['mercado']!.n['dinheiro']! -= dinheiroDoMundo(e) - antes;
  return e;
}

function fazer(e: EstadoVida, op: Operacao): void {
  const motivo = motivoParaNaoOperar(e, c, op);
  expect(motivo, JSON.stringify(op)).toBeNull();
  operar(e, c, op);
}

/** O grupo do teste 1: uma empresa de comércio, a holding com ela dentro e duas subsidiárias fundadas pela holding. */
function grupo(semente = 1): { e: EstadoVida; holding: string; filhas: [string, string] } {
  const e = adulto(semente, 20_000_000);
  fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
  const holding = lugarLivre(e)!;
  fazer(e, { tipo: 'criarHolding', valor: 8_000_000 });
  fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
  const a = lugarLivre(e)!;
  fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'tecnologia', valor: 3_000_000 });
  const b = lugarLivre(e)!;
  fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'saude', valor: 2_000_000 });
  return { e, holding, filhas: [a, b] };
}

describe('teste 1: a holding e duas subsidiárias independentes', () => {
  it('o capital sai de verdade de quem joga para a holding e da holding para cada subsidiária, e cada uma tem o seu balanço', () => {
    const e = adulto(1, 20_000_000);
    fazer(e, { tipo: 'abrir', setor: 'comercio', valor: 1_000_000 });
    const antes = patrimonioTotal(e);
    const holding = lugarLivre(e)!;
    fazer(e, { tipo: 'criarHolding', valor: 8_000_000 });
    const h = e.entidades[holding]!;
    expect(h.q['holding']).toBeDefined();
    expect(h.n['caixa']).toBeCloseTo(8_000_000);
    expect(h.n['capacidade']).toBeUndefined();
    fazer(e, { tipo: 'paraAHolding', empresa: 'empresa', holding });
    expect(donaDe(e.entidades['empresa']!)).toBe(refDaEmpresa(h));
    const [a, b] = [lugarLivre(e)!, ''];
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'tecnologia', valor: 3_000_000 });
    const b2 = lugarLivre(e)!;
    fazer(e, { tipo: 'fundarSubsidiaria', controladora: holding, setor: 'saude', valor: 2_000_000 });
    void b;
    const fa = e.entidades[a]!;
    const fb = e.entidades[b2]!;
    // A holding pagou o capital das duas: 8 − 3 − 2 = 3 milhões no caixa dela.
    expect(h.n['caixa']).toBeCloseTo(3_000_000);
    for (const [f, capital] of [
      [fa, 3_000_000],
      [fb, 2_000_000],
    ] as const) {
      expect(donaDe(f)).toBe(refDaEmpresa(h));
      expect(f.registro).toBeGreaterThan(0);
      // O capital virou o negócio dela (estrutura e caixa), e o valor é o dela, não o da holding.
      expect(f.n['valor']).toBeCloseTo(capital);
      expect((f.n['caixa'] ?? 0) + 0).toBeGreaterThan(0);
      expect(parteEfetiva(e, f)).toBeCloseTo(1);
    }
    // Pessoas jurídicas diferentes: números, caixas e setores próprios.
    expect(new Set([h, fa, fb, e.entidades['empresa']!].map((x) => x.registro)).size).toBe(4);
    expect(fa.t['setor']).toBe('tecnologia');
    expect(fb.t['setor']).toBe('saude');
    // O patrimônio de quem joga não mudou: o dinheiro só trocou de lugar dentro do que é dele, e nada conta duas vezes.
    expect(patrimonioTotal(e)).toBeCloseTo(antes, -2);
    expect(valorDasParticipacoes(e, h)).toBeCloseTo(1_000_000 + 3_000_000 + 2_000_000, -2);
    // Cada lançamento fechou as contas (os dois lados de cada real).
    for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
    expect(conferirEstado(e, c)).toEqual([]);
  });

  it('o dividendo da subsidiária sobe para o caixa da holding, e só o que a holding distribui chega a quem joga', () => {
    const { e, holding, filhas } = grupo(2);
    for (const f of filhas) fazer(e, { tipo: 'dividendosDaControlada', empresa: f, fracao: 1 });
    fazer(e, { tipo: 'dividendosDaControlada', empresa: 'empresa', fracao: 1 });
    const h = e.entidades[holding]!;
    for (const f of [...filhas, 'empresa']) {
      // Um ano de lucro garantido, para o dividendo existir: o caixa e a demanda cheios.
      const x = e.entidades[f]!;
      x.n['demanda'] = (x.n['capacidade'] ?? 0) * 2;
    }
    const caixaAntes = h.n['caixa'] ?? 0;
    const contaAntes = e.entidades['eu']!.n['dinheiro'] ?? 0;
    const reg: Mudanca[] = [];
    const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
    regraDaEmpresa(e, c, momentoTipico('normal'), reg);
    lancar(e, entrada, reg);
    const recebido = reg.filter((m) => m.c === `${holding}.caixa` && m.r === 'dividendos' && (m.d ?? 0) > 0).reduce((s, m) => s + m.d!, 0);
    expect(recebido).toBeGreaterThan(0);
    // A holding paga a estrutura dela e, com a retirada em zero, guarda o resto: nada chega à conta de quem joga.
    expect(h.n['caixa']).toBeCloseTo(caixaAntes + recebido - HOLDING.estrutura, -1);
    expect(e.entidades['eu']!.n['dinheiro']).toBeCloseTo(contaAntes, -1);
    expect(h.n['lucro']).toBeCloseTo(recebido - HOLDING.estrutura, -1);
    expect(conferirContas(e, e.historico.at(-1)!)).toEqual([]);
    expect(conferirEstado(e, c)).toEqual([]);
  });

  it('a propriedade não tem ciclo nem passa de 100% do capital', () => {
    const { e, holding, filhas } = grupo(3);
    const h = e.entidades[holding]!;
    const filha = e.entidades[filhas[0]]!;
    expect(formaCiclo(e, h, refDaEmpresa(filha))).toBe(true);
    expect(formaCiclo(e, h, refDaEmpresa(h))).toBe(true);
    expect(() => mudarDona(e, [], h, refDaEmpresa(filha), 1)).toThrow(/ciclo/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'paraAHolding', empresa: holding, holding })).toMatch(/holding/);
    // A parte de uma segunda sócia mais a da controladora não passa de 1: o invariante acusa o contrário.
    filha.t['socia'] = 'eu';
    filha.n['participacao_socia'] = 0.3;
    expect(conferirEstado(e, c).join(' ')).toMatch(/passam de 100%/);
  });

  it('a holding não opera nem fica no lugar da empresa que quem joga toca', () => {
    const { e, holding } = grupo(4);
    expect(motivoParaNaoOperar(e, c, { tipo: 'expandir', empresa: holding, fracao: 0.2 })).toMatch(/holding/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'cuidar', empresa: holding })).toMatch(/holding/);
    const sozinho = adulto(5, 1_000_000);
    expect(motivoParaNaoOperar(sozinho, c, { tipo: 'criarHolding', valor: 500_000 })).toMatch(/abra uma empresa/);
  });
});

describe('vender a subsidiária inteira não a apaga', () => {
  it('a empresa vendida segue viva fora do grupo, com o número, o nome e o caixa dela; o dinheiro entra no caixa da holding', () => {
    const { e, holding, filhas } = grupo(6);
    const f = e.entidades[filhas[1]]!;
    const { registro, nome } = f;
    const caixa = f.n['caixa'] ?? 0;
    const caixaDaHolding = e.entidades[holding]!.n['caixa'] ?? 0;
    fazer(e, { tipo: 'venderParticipacao', empresa: filhas[1], fracao: 1 });
    expect(e.entidades[filhas[1]]).toBeUndefined();
    const fora = e.entidades[`empresaR${registro}`]!;
    void idForaDoGrupo;
    expect(fora).toBeDefined();
    expect(fora.nome).toBe(nome);
    expect(fora.registro).toBe(registro);
    expect(fora.n['caixa']).toBeCloseTo(caixa);
    expect(donaDe(fora)).toBe('mercado');
    expect(parteEfetiva(e, fora)).toBe(0);
    expect(empresasDe(e).some((x) => x.registro === registro)).toBe(false);
    expect(e.entidades[holding]!.n['caixa']).toBeGreaterThan(caixaDaHolding);
    for (const x of e.historico) expect(conferirContas(e, x), `${x.ref}`).toEqual([]);
    expect(conferirEstado(e, c)).toEqual([]);
  });
});

describe('teste 12 (a parte do societário): a herança e o save preservam o grupo', () => {
  it('quem herda recebe a holding e as subsidiárias continuam dela, com o mesmo número e a mesma parte', () => {
    const { e, holding, filhas } = grupo(7);
    const registros: Record<string, string> = Object.fromEntries([holding, ...filhas, 'empresa'].map((id) => [e.entidades[id]!.registro, e.entidades[id]!.nome ?? id]));
    const daHolding = e.entidades[holding]!.registro;
    aplicarEfeitos(e, c, { personagens: ['filho'] } as Efeitos, { origem: 0, reg: [], valores: {} });
    e.entidades['filho']!.nascimento = e.ano - 18;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    const ref = `#${daHolding}`;
    for (const [r, nome] of Object.entries(registros)) {
      const x = empresaDoRegistro(h, `#${r}`)!;
      expect(x, nome).toBeDefined();
      expect(x.nome).toBe(nome);
      if (Number(r) !== daHolding) expect(donaDe(x)).toBe(ref);
    }
    // A parte de quem herda chega às subsidiárias pela holding (a herança e o imposto saem da parte direta, a da holding).
    for (const x of empresasDe(h)) if (donaDe(x) === ref) expect(parteEfetiva(h, x)).toBeGreaterThan(0);
    expect(conferirEstado(h, c)).toEqual([]);
  });

  it('salvar e carregar preserva o número de cada empresa, quem é dona de quem e o contador de números', () => {
    const { e, holding } = grupo(8);
    const volta = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    for (const id of Object.keys(e.entidades)) {
      if (e.entidades[id]!.tipo !== 'empresa') continue;
      expect(volta.entidades[id]!.registro).toBe(e.entidades[id]!.registro);
      expect(volta.entidades[id]!.t['dona']).toBe(e.entidades[id]!.t['dona']);
    }
    expect(volta.proximoRegistro).toBe(e.proximoRegistro);
    expect(parteEfetiva(volta, volta.entidades['empresa']!)).toBeCloseTo(1);
    expect(volta.entidades[holding]!.q['holding']).toBeDefined();
  });
});
