import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { empresaDe, regraDaEmpresa } from '../src/motor/empresa.ts';
import { ganhar, lancar, novaEntrada } from '../src/motor/livro.ts';
import { economiaDo } from '../src/motor/negocio.ts';
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

describe('o negócio de verdade (bloco N)', () => {
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
});
