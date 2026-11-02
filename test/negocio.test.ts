import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { empresaDe, regraDaEmpresa } from '../src/motor/empresa.ts';
import { ganhar, lancar, novaEntrada } from '../src/motor/livro.ts';
import { anoDosSetores, apertoDoSetor, decidirNoNegocio, economiaDo, precoDoSetor, valorNaEmpresa } from '../src/motor/negocio.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { regraDosBens } from '../src/motor/bens.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

function adulto(semente = 21, dinheiro = 1_000_000): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 30;
  e.ano = e.anoNascimento + 30;
  Object.assign(e.entidades['eu']!.n, { dinheiro, divida: 0 });
  return e;
}

/** Um ano das empresas numa entrada do livro (como a etapa do ano faz), e os problemas das contas dela. */
function ano(e: EstadoVida, fase: Parameters<typeof momentoTipico>[0] = 'normal'): string[] {
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
  const reg: Mudanca[] = [];
  regraDaEmpresa(e, c, momentoTipico(fase), reg);
  lancar(e, entrada, reg);
  return conferirContas(e, entrada);
}

describe('o negócio de verdade (bloco H)', () => {
  it('as contas da empresa fecham entrada por entrada: abrir, a obra, as verbas, o preço, o corte, os dividendos e os anos', () => {
    const e = adulto();
    const problemas: string[] = [];
    const conferir = (h: { id: number }) => problemas.push(...conferirContas(e, e.historico.find((x) => x.id === h.id)!));
    conferir(operar(e, c, { tipo: 'abrir', setor: 'industria', valor: 400_000 }));
    conferir(operar(e, c, { tipo: 'verbas', marketing: 0.08, pd: 0.03 }));
    conferir(operar(e, c, { tipo: 'retirada', fracao: 0.6 }));
    e.rng = criarRng(4);
    for (let i = 0; i < 6; i++) {
      problemas.push(...ano(e));
      if ((empresaDe(e)!.n['caixa'] ?? 0) > 200_000 && !(empresaDe(e)!.n['obra'] ?? 0)) conferir(operar(e, c, { tipo: 'expandir', fracao: 0.25 }));
    }
    conferir(operar(e, c, { tipo: 'preco', nivel: 'premium' }));
    conferir(operar(e, c, { tipo: 'cortar', fracao: 0.25 }));
    problemas.push(...ano(e, 'crise'));
    expect(problemas).toEqual([]);
    expect(empresaDe(e)!.n['caixa']!).toBeGreaterThanOrEqual(0);
  });

  it('a obra sai do caixa na hora e fica pronta no ano seguinte', () => {
    const e = adulto();
    operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 500_000 });
    const emp = empresaDe(e)!;
    const capacidade = emp.n['capacidade']!;
    const caixa = emp.n['caixa']!;
    operar(e, c, { tipo: 'expandir', fracao: 0.25 });
    expect(emp.n['caixa']).toBeCloseTo(caixa - capacidade * 0.25 * economiaDo(c.setores.get('comercio')).giro);
    expect(emp.n['capacidade']).toBeCloseTo(capacidade);
    expect(emp.n['obra']).toBeCloseTo(capacidade * 0.25);
    ano(e);
    expect(emp.n['capacidade']).toBeCloseTo(capacidade * 1.25);
    expect(emp.n['obra'] ?? 0).toBe(0);
  });

  it('o ano que não fecha vende estrutura para pagar as contas: o caixa nunca termina negativo, e os empregos caem', () => {
    const e = adulto();
    operar(e, c, { tipo: 'abrir', setor: 'tecnologia', valor: 500_000 });
    const emp = empresaDe(e)!;
    // Estrutura enorme para quase nenhum cliente: a estrutura parada come o caixa.
    Object.assign(emp.n, { capacidade: 50_000_000, demanda: 100_000, caixa: 10_000, funcionarios: 70 });
    const desemprego = e.entidades['lugar']!.n['desemprego']!;
    expect(ano(e, 'crise')).toEqual([]);
    expect(emp.n['caixa']!).toBeGreaterThanOrEqual(0);
    expect(emp.n['capacidade']!).toBeLessThan(50_000_000);
    expect(emp.n['lucro']!).toBeLessThan(0);
    expect(e.entidades['lugar']!.n['desemprego']!).toBeGreaterThanOrEqual(desemprego);
  });

  it('o preço muda o volume e a margem: o premium vende menos e ganha mais por venda; sem qualidade, espanta cliente', () => {
    const base = adulto();
    operar(base, c, { tipo: 'abrir', setor: 'servicos', valor: 1_000_000 });
    Object.assign(empresaDe(base)!.n, { demanda: 1_000_000, capacidade: 5_000_000, qualidade: 80, marca: 60 });
    const comPreco = (nivel: 'popular' | 'medio' | 'premium', qualidade = 80) => {
      const e = structuredClone(base);
      e.rng = criarRng(1);
      empresaDe(e)!.t['preco'] = nivel;
      empresaDe(e)!.n['qualidade'] = qualidade;
      ano(e);
      return empresaDe(e)!.n['receita']!;
    };
    expect(comPreco('popular')).toBeGreaterThan(comPreco('medio'));
    expect(comPreco('premium')).toBeLessThan(comPreco('medio'));
    expect(comPreco('premium', 30)).toBeLessThan(comPreco('premium', 80) * 0.6);
  });

  it('a sanção de quem compra fecha a exportação, com a notícia e a sanção de causa', () => {
    const e = adulto(22, 5_000_000);
    operar(e, c, { tipo: 'abrir', setor: 'agro', valor: 3_000_000 });
    const pais = e.entidades['federacao']!;
    pais.n['relacao'] = 60;
    operar(e, c, { tipo: 'exportar', para: 'federacao' });
    ano(e);
    const comExportacao = empresaDe(e)!.n['receita']!;
    expect(e.historico.at(-1)!.mudancas?.some((m) => m.r === 'exportacao' && m.p === 'federacao')).toBe(true);
    // A sanção chega (com a entrada que a causou), e a porta fecha.
    const sancao = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: 'teste:sancao', texto: 'sanção', resumo: 'a Federação sancionou o Brasil' });
    const reg: Mudanca[] = [];
    ganhar(e, reg, 'federacao', 'sancao', sancao.id);
    lancar(e, sancao, reg);
    ano(e);
    const noticia = e.historico.find((h) => h.ref === 'regra:exportacao_barrada');
    expect(noticia?.causas).toEqual([sancao.id]);
    expect(e.historico.at(-1)!.mudancas?.some((m) => m.r === 'exportacao')).toBe(false);
    expect(empresaDe(e)!.n['receita']!).toBeLessThan(comExportacao * 1.2);
  });

  it('os empregos que a empresa abre baixam o desemprego da cidade; o imposto que ela paga baixa a dívida pública', () => {
    const e = adulto(23, 2e9);
    operar(e, c, { tipo: 'abrir', setor: 'servicos', valor: 1.5e9 });
    const lugar = e.entidades['lugar']!;
    const desemprego = lugar.n['desemprego']!;
    const divida = e.entidades['pais']!.n['divida']!;
    ano(e);
    expect(empresaDe(e)!.n['funcionarios']!).toBeGreaterThan(1000);
    expect(lugar.n['desemprego']!).toBeLessThan(desemprego);
    expect(empresaDe(e)!.n['impostos']!).toBeGreaterThan(0);
    expect(e.entidades['pais']!.n['divida']!).toBeLessThan(divida);
  });

  it('a mídia própria rende publicidade e dá influência a quem é dono', () => {
    const e = adulto(24, 3e7);
    operar(e, c, { tipo: 'comprar', item: 'radio' });
    const influencia = e.entidades['eu']!.n['influencia'] ?? 0;
    const reg: Mudanca[] = [];
    regraDosBens(e, c, reg);
    const publicidade = reg.find((m) => m.c === 'eu.dinheiro' && m.r === 'publicidade');
    expect(publicidade?.d ?? 0).toBeGreaterThan(1_000_000);
    expect(e.entidades['eu']!.n['influencia']!).toBeGreaterThan(influencia);
  });

  it('o conteúdo que mexe no valor mexe no negócio: o ganho vira estrutura, a perda sai do caixa e o aporte entra nele', () => {
    const e = adulto();
    operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 500_000 });
    const emp = empresaDe(e)!;
    const eu = e.entidades['eu']!;
    const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'teste:valor', texto: '' });
    const reg: Mudanca[] = [];
    const caixa = emp.n['caixa']!;
    valorNaEmpresa(e, c, reg, emp.id, -50_000);
    expect(emp.n['caixa']).toBeCloseTo(caixa - 50_000);
    const capacidade = emp.n['capacidade']!;
    valorNaEmpresa(e, c, reg, emp.id, emp.n['valor']! * 0.5);
    expect(emp.n['capacidade']).toBeCloseTo(capacidade * 1.5);
    const dinheiro = eu.n['dinheiro']!;
    const caixaAntes = emp.n['caixa']!;
    decidirNoNegocio(e, c, reg, { aporte: 20_000 });
    expect(emp.n['caixa']).toBeCloseTo(caixaAntes + 20_000);
    expect(eu.n['dinheiro']).toBeCloseTo(dinheiro - 20_000);
    lancar(e, entrada, reg);
    expect(conferirContas(e, entrada)).toEqual([]);
  });

  it('o empréstimo da empresa sai do banco (dinheiro novo), o juro e a parcela voltam para ele, e as contas fecham', () => {
    const e = adulto(25, 2_000_000);
    operar(e, c, { tipo: 'abrir', setor: 'industria', valor: 1_000_000 });
    const emp = empresaDe(e)!;
    emp.n['lucro'] = 200_000;
    const banco = e.entidades['banco']!.n['dinheiro']!;
    const caixa = emp.n['caixa']!;
    const h = operar(e, c, { tipo: 'emprestimo', valor: 300_000 });
    expect(conferirContas(e, e.historico.find((x) => x.id === h.id)!)).toEqual([]);
    expect(emp.n['caixa']).toBeCloseTo(caixa + 300_000);
    expect(emp.n['divida']).toBeCloseTo(300_000);
    expect(e.entidades['banco']!.n['dinheiro']!).toBeCloseTo(banco - 300_000);
    expect(ano(e)).toEqual([]);
    expect(e.historico.at(-1)!.mudancas?.some((m) => m.c === 'empresa.caixa' && m.r === 'juros' && m.p === 'banco')).toBe(true);
    expect(emp.n['divida']!).toBeLessThan(300_000);
  });

  it('a concorrente reage: corre atrás de quem atrai muito mais, e o lucro alto atrai concorrente nova', () => {
    const e = adulto(26, 2_000_000);
    operar(e, c, { tipo: 'abrir', setor: 'tecnologia', valor: 1_000_000 });
    const emp = empresaDe(e)!;
    Object.assign(emp.n, { qualidade: 95, marca: 95, concorrente: 50, demanda: emp.n['capacidade']! });
    emp.t['preco'] = 'premium';
    e.rng = criarRng(5);
    let maior = 0;
    let nova = false;
    for (let i = 0; i < 12; i++) {
      ano(e);
      maior = Math.max(maior, emp.n['concorrente']!);
      nova ||= Boolean(emp.q['concorrente_novo']);
    }
    expect(maior).toBeGreaterThan(55);
    expect(nova).toBe(true);
  });

  it('a guerra de preços corta a receita de quem está nela', () => {
    const base = adulto(27);
    operar(base, c, { tipo: 'abrir', setor: 'comercio', valor: 500_000 });
    const receita = (guerra: boolean): number => {
      const e = structuredClone(base);
      e.rng = criarRng(3);
      if (guerra) empresaDe(e)!.q['guerra'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
      ano(e);
      return empresaDe(e)!.n['receita']!;
    };
    expect(receita(true)).toBeLessThan(receita(false) * 0.95);
  });

  it('o setor vive ciclos: a obra da alta faz sobrar, e a sobra derruba o preço', () => {
    const e = adulto(28);
    e.rng = criarRng(9);
    const ofertas: number[] = [];
    for (let i = 0; i < 40; i++) {
      anoDosSetores(e, c, []);
      ofertas.push(e.entidades['setor_construcao']!.n['oferta']!);
    }
    let viradas = 0;
    for (let i = 1; i < ofertas.length; i++) if ((ofertas[i]! - 100) * (ofertas[i - 1]! - 100) < 0) viradas++;
    expect(viradas).toBeGreaterThanOrEqual(3);
    expect(Math.max(...ofertas) - Math.min(...ofertas)).toBeGreaterThan(10);
    expect(precoDoSetor(120)).toBeLessThan(0.9);
    expect(precoDoSetor(85)).toBeGreaterThan(1.08);
  });

  it('a sobra de oferta no setor derruba a receita da empresa e aperta o emprego de quem trabalha nele', () => {
    const base = adulto(29);
    operar(base, c, { tipo: 'abrir', setor: 'comercio', valor: 500_000 });
    const receita = (oferta: number): number => {
      const e = structuredClone(base);
      e.rng = criarRng(3);
      e.entidades['setor_comercio']!.n['oferta'] = oferta;
      ano(e);
      return empresaDe(e)!.n['receita']!;
    };
    expect(receita(130)).toBeLessThan(receita(100) * 0.9);
    const e = structuredClone(base);
    e.entidades['setor_industria']!.n['oferta'] = 120;
    expect(apertoDoSetor(e, 'industria')).toBeGreaterThan(1.5);
  });
});

