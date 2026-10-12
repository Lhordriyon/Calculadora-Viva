/**
 * Toda transferência tem dois lados (fatia 1.1): cada mudança de dinheiro diz de quem veio ou para quem foi, as
 * conversões dentro da mesma pessoa somam zero, e o extrato diz para onde foi o dinheiro de quem joga.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { conferirContas, extrato, saldosComOMundo } from '../src/motor/contas.ts';
import { economiaDoAno, movimentar } from '../src/motor/economia.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { morrerPersonagem } from '../src/motor/pessoas.ts';
import type { Estrategia } from '../src/motor/robos.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();
const ESTRATEGIAS: Estrategia[] = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'];

/** Vidas variadas (sorteadas, pobres, de fortuna, de linhagem) e as dos herdeiros delas. */
function amostra(): EstadoVida[] {
  const out: EstadoVida[] = [];
  const origens = [undefined, undefined, { classe: 0 }, { classe: 6 }, { classe: 7 }, { linhagem: 'realeza' }, { linhagem: 'regime' }] as const;
  origens.forEach((origem, o) => {
    for (let k = 0; k < 4; k++) {
      const e = nascer(c, { semente: misturar(2210, o, k), ano: 2026, ...(origem ? { origem } : {}) });
      out.push(viverAteOFim(e, c, k + 1, ESTRATEGIAS[k]!));
    }
  });
  const herdeiros: EstadoVida[] = [];
  for (const [i, e] of out.entries()) {
    if (herdeiros.length >= 8 || !herdeiroPossivel(e, c)) continue;
    herdeiros.push(viverAteOFim(continuarComoHerdeiro(e, c), c, 50 + i, ESTRATEGIAS[i % 4]!));
  }
  return [...out, ...herdeiros];
}
const vidas = amostra();

function pessoa(semente: number, idade: number, n: Record<string, number>): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = idade;
  Object.assign(e.entidades['eu']!.n, { dinheiro: 0, divida: 0, renda: 0, custo: 0 }, n);
  return e;
}

describe('contas', () => {
  it('em toda entrada de toda vida, o dinheiro tem contraparte ou é conversão que fecha', () => {
    let entradas = 0;
    for (const e of vidas) {
      for (const h of e.historico) {
        entradas++;
        expect(conferirContas(e, h), `entrada #${h.id} (${h.tipo} ${h.ref ?? ''}, aos ${h.idade})`).toEqual([]);
      }
    }
    expect(entradas).toBeGreaterThan(10000);
  });

  it('o salário vem do mercado, o imposto vai para o tesouro, o juro da dívida para o banco e a inflação é reavaliação', () => {
    const e = pessoa(3, 40, { renda: 60000, custo: 30000, dinheiro: 10000, divida: 5000 });
    const reg: Mudanca[] = [];
    economiaDoAno(e, reg, { imposto: -0.04, inflacao: 0.05 });
    const de = (r: string) => reg.find((m) => m.r === r);
    expect(de('salario')).toMatchObject({ c: 'eu.dinheiro', d: 60000, p: 'mercado' });
    expect(de('imposto')).toMatchObject({ c: 'eu.dinheiro', p: 'tesouro' });
    expect(de('imposto')!.d).toBeCloseTo(-2400, 6);
    expect(de('juros')).toMatchObject({ c: 'eu.divida', p: 'banco' });
    expect(de('inflacao')).toMatchObject({ c: 'eu.dinheiro', p: 'reavaliacao' });
  });

  it('quem é servidor recebe do tesouro', () => {
    const e = pessoa(4, 40, { renda: 60000, custo: 30000 });
    e.entidades['eu']!.q['servidor'] = { v: 1, ano: 2066, idade: 40, causa: null };
    const reg: Mudanca[] = [];
    economiaDoAno(e, reg);
    expect(reg.find((m) => m.r === 'salario')?.p).toBe('tesouro');
  });

  it('a herança de um personagem sai dele e entra em quem joga; a parte dos irmãos vai para os parentes', () => {
    const e = nascer(c, { semente: 9, ano: 2026 });
    e.idade = 40;
    e.entidades['eu']!.n['irmaos'] = 2;
    e.entidades['mae']!.n['dinheiro'] = 90000;
    // Com o pai vivo, a herança da mãe é dele (e fecha dos dois lados); sem ele, vem para quem joga e para os irmãos.
    e.entidades['pai']!.vivo = false;
    const reg: Mudanca[] = [];
    const parte = morrerPersonagem(e, 'mae', reg, 1);
    expect(parte).toBeCloseTo(30000, 6);
    expect(reg.filter((m) => m.c === 'mae.dinheiro' && m.p === 'eu').reduce((s, m) => s + m.d!, 0)).toBeCloseTo(-30000, 6);
    expect(reg.filter((m) => m.c === 'mae.dinheiro' && m.p === 'parentes').reduce((s, m) => s + m.d!, 0)).toBeCloseTo(-60000, 6);
    expect(reg.filter((m) => m.c === 'eu.dinheiro' && m.p === 'mae').reduce((s, m) => s + m.d!, 0)).toBeCloseTo(30000, 6);
    expect(e.entidades['mae']!.n['dinheiro']).toBe(0);
  });

  it('a conferência acusa dinheiro sem contraparte e transferência que não volta', () => {
    const e = nascer(c, { semente: 5, ano: 2026 });
    const reg: Mudanca[] = [];
    movimentar(e, reg, { dinheiro: 1000 });
    const h = lancar(e, novaEntrada(e, { tipo: 'evento', causa: 'diretor', texto: 'teste' }), reg);
    expect(conferirContas(e, h).join(' ')).toContain('sem contraparte');
    const torto = lancar(e, novaEntrada(e, { tipo: 'evento', causa: 'diretor', texto: 'teste' }), [{ c: 'eu.dinheiro', d: -500, p: 'mae' }]);
    expect(conferirContas(e, torto).join(' ')).toContain('não fecha');
    const solto = lancar(e, novaEntrada(e, { tipo: 'evento', causa: 'diretor', texto: 'teste' }), [{ c: 'eu.dinheiro', d: 700 }]);
    expect(conferirContas(e, solto).join(' ')).toContain('a conversão não fecha');
  });

  it('o extrato do ano soma o que mudou no patrimônio financeiro de quem joga', () => {
    for (const e of vidas.slice(0, 6)) {
      const anos = [...new Set(e.historico.map((h) => h.ano))];
      for (const ano of anos.filter((_, i) => i % 7 === 3)) {
        let variacao = 0;
        for (const h of e.historico) {
          if (h.ano !== ano) continue;
          for (const m of h.mudancas ?? []) {
            if (m.d === undefined || m.r === 'saida' || m.r === 'nascimento' || !m.c.startsWith('eu.')) continue;
            const campo = m.c.slice(3);
            if (campo === 'divida') variacao -= m.d;
            else if (['dinheiro', 'renda_fixa', 'acoes', 'fii', 'dolar', 'cripto'].includes(campo)) variacao += m.d;
          }
        }
        const x = extrato(e, ano);
        expect(x.entrou - x.saiu + x.reavaliacao, `${ano}`).toBeCloseTo(variacao, -1);
      }
    }
  });

  it('na vida inteira, o governo recebe imposto e o mercado, o consumo', () => {
    const adultos = vidas.filter((e) => e.idade >= 40);
    expect(adultos.length).toBeGreaterThan(10);
    const comMercado = adultos.filter((e) => (saldosComOMundo(e)['mercado'] ?? 0) !== 0).length;
    expect(comMercado).toBe(adultos.length);
  });
});
