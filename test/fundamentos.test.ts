/**
 * Os fundamentos que a auditoria de 11/10 tornou verificáveis: o livro-razão
 * fecha para toda entidade, as regras só escrevem o que o manifesto declara,
 * o mundo tem tamanho, a imagem pública tem consequência e a linha do tempo
 * mostra as regras que contam algo.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { funcionariosDe } from '../src/motor/campos.ts';
import { defCargo, chanceDeEleicao } from '../src/motor/poder.ts';
import { economiaDoAno } from '../src/motor/economia.ts';
import { regraDaEmpresa, empresaDe } from '../src/motor/empresa.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { ESCRITAS_DO_MOTOR, VONTADES } from '../src/motor/manifesto.ts';
import { CAPACIDADE_DO_MERCADO, MAX_FUNCIONARIOS, TETO_EMPRESA } from '../src/motor/regras.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { visivel } from '../src/ui/formato.ts';
import { viverAteOFim } from './apoio.ts';
import type { Estrategia } from '../src/motor/robos.ts';

const c = carregarConteudo();

/** Vidas variadas: sorteadas, de fortuna e de linhagem, com as quatro estratégias. */
function vidas(): EstadoVida[] {
  const estrategias: Estrategia[] = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'];
  const saida: EstadoVida[] = [];
  const origens = [undefined, undefined, { classe: 6 }, { classe: 7 }, { linhagem: 'realeza' }] as const;
  origens.forEach((origem, o) => {
    for (let k = 0; k < 4; k++) {
      const e = nascer(c, { semente: misturar(1110, o, k), ano: 2026, ...(origem ? { origem } : {}) });
      (e as EstadoVida & { inicio?: Map<string, Record<string, number>> }).inicio = new Map(Object.values(e.entidades).map((en) => [en.id, { ...en.n }]));
      saida.push(viverAteOFim(e, c, k, estrategias[k]!));
    }
  });
  return saida;
}
const amostra = vidas();

describe('livro-razão', () => {
  it('para toda entidade (inclusive quem nasce durante a vida), o começo mais a soma das variações dá o estado final', () => {
    for (const e of amostra) {
      const inicio = (e as EstadoVida & { inicio: Map<string, Record<string, number>> }).inicio;
      const soma = new Map<string, number>();
      for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
      for (const en of Object.values(e.entidades)) {
        for (const [campo, fim] of Object.entries(en.n)) {
          const esperado = (inicio.get(en.id)?.[campo] ?? 0) + (soma.get(`${en.id}.${campo}`) ?? 0);
          expect(Math.abs(esperado - fim), `${en.id}.${campo}`).toBeLessThan(Math.max(2, Math.abs(fim) * 1e-9));
        }
      }
    }
  });

  it('as regras do motor só escrevem o que o manifesto declara (o validador confia nele)', () => {
    // O manifesto, mais o que o conteúdo declara para as regras (as vontades de mundo.json, que o validador também lê).
    const declaradas = new Set([...ESCRITAS_DO_MOTOR, ...VONTADES(c.mundo.vontades)]);
    const fora = new Set<string>();
    for (const e of amostra) {
      for (const h of e.historico) {
        if (h.causa !== 'regra') continue;
        for (const m of h.mudancas ?? []) {
          const [ent, campo] = m.c.split('.') as [string, string];
          const chave = `${ent.replace(/^(bem|empresa|filho)\d+$/, '$1').replace(/^(ctr|tit)\d+[a-z]?$/, '$1')}.${campo}`;
          if (!declaradas.has(chave)) fora.add(chave);
        }
      }
    }
    expect([...fora]).toEqual([]);
  });
});

describe('o mundo tem tamanho', () => {
  it('funcionários: um a cada R$ 150 mil numa empresa pequena, nunca mais que as maiores empresas do mundo', () => {
    expect(funcionariosDe(1_500_000)).toBe(10);
    expect(funcionariosDe(1.5e9)).toBeGreaterThan(9900);
    expect(funcionariosDe(1.44e14)).toBeLessThanOrEqual(MAX_FUNCIONARIOS);
    expect(funcionariosDe(Number.MAX_VALUE)).toBeLessThanOrEqual(MAX_FUNCIONARIOS);
  });

  it('a empresa não cresce acima do teto do mercado (pode cair, e abaixo dele volta a crescer)', () => {
    const e = nascer(c, { semente: 3, ano: 2026, origem: { classe: 7 } });
    const reg: Mudanca[] = [];
    e.entidades['empresa'] = { id: 'empresa', tipo: 'empresa', nome: 'Teste', vivo: true, n: { valor: 2 * TETO_EMPRESA, tracao: 60, participacao: 1 }, t: { setor: 'tecnologia' }, q: {} };
    expect(empresaDe(e)).toBeTruthy();
    for (let ano = 0; ano < 30; ano++) {
      const antes = e.entidades['empresa']!.n['valor']!;
      regraDaEmpresa(e, c, momentoTipico('expansao'), reg);
      // Acima do teto, só cai; abaixo, o ganho encolhe perto dele (passa no máximo uma fração mínima).
      expect(e.entidades['empresa']!.n['valor']!).toBeLessThanOrEqual(Math.max(antes + 1, TETO_EMPRESA * 1.01));
    }
  });

  it('acima do que o mercado comporta, o dinheiro investido a mais fica parado', () => {
    const e = nascer(c, { semente: 4, ano: 2026 });
    const eu = e.entidades['eu']!;
    Object.assign(eu.n, { dinheiro: 0, renda_fixa: 4 * CAPACIDADE_DO_MERCADO, acoes: 0, fii: 0, dolar: 0, cripto: 0, renda: 0, custo: 0, divida: 0 });
    economiaDoAno(e, [], { inflacao: 0 }, { renda_fixa: 0.1 });
    // 10% sobre a parte que cabe (um quarto): o total cresce 2,5%, não 10%.
    expect(eu.n['renda_fixa']! / (4 * CAPACIDADE_DO_MERCADO)).toBeCloseTo(1.025, 3);
  });
});

describe('imagem pública', () => {
  it('pesa na primeira eleição, não só na reeleição', () => {
    const e = nascer(c, { semente: 5, ano: 2026 });
    const prefeito = defCargo(c, 'prefeito')!;
    const eu = e.entidades['eu']!;
    eu.n['influencia'] = 30;
    eu.n['popularidade'] = 50;
    const neutra = chanceDeEleicao(e, prefeito);
    eu.n['popularidade'] = 80;
    expect(chanceDeEleicao(e, prefeito)).toBeGreaterThan(neutra);
    eu.n['popularidade'] = 20;
    expect(chanceDeEleicao(e, prefeito)).toBeLessThan(neutra);
  });
});

describe('linha do tempo', () => {
  it('esconde só as regras miúdas do ano; promoção e fim de mandato aparecem', () => {
    const base = { id: 1, idade: 30, ano: 2056, causa: 'regra' as const, texto: 'x' };
    expect(visivel({ ...base, tipo: 'regra', ref: 'ano' })).toBe(false);
    expect(visivel({ ...base, tipo: 'regra', ref: 'carreira:promocao' })).toBe(true);
    expect(visivel({ ...base, tipo: 'regra', ref: 'poder:fim_do_mandato' })).toBe(true);
    const promocoes = amostra.flatMap((e) => e.historico).filter((h) => h.ref?.startsWith('carreira:promocao'));
    expect(promocoes.length).toBeGreaterThan(0);
    expect(promocoes.every((h) => visivel(h) && h.texto.length > 0)).toBe(true);
  });
});
