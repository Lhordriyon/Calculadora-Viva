import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { mercadoDoAno } from '../src/motor/carteira.ts';
import { acertarCaixa, economiaDoAno, movimentar } from '../src/motor/economia.ts';
import { GASTO_VELHICE, PROPENSAO_GASTO } from '../src/motor/regras.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

function pessoa(semente: number, idade: number, n: Record<string, number>): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = idade;
  Object.assign(e.entidades['eu']!.n, { dinheiro: 0, divida: 0, renda: 0, custo: 0 }, n);
  return e;
}

describe('economia', () => {
  it('a inflação come dinheiro parado; investimento rende; dívida cresce', () => {
    const rng = criarRng(4);
    let encolheu = 0;
    let rendeu = 0;
    let cresceu = 0;
    for (let i = 0; i < 200; i++) {
      const e = pessoa(i, 10, { dinheiro: 10000, renda_fixa: 10000 });
      economiaDoAno(e, rng, [], undefined, mercadoDoAno(e, c, 'normal', []));
      if (e.entidades['eu']!.n['dinheiro']! < 10000) encolheu++;
      if (e.entidades['eu']!.n['renda_fixa']! > 10000) rendeu++;
      const d = pessoa(i, 10, { divida: 10000 });
      economiaDoAno(d, rng, []);
      if (d.entidades['eu']!.n['divida']! > 10000) cresceu++;
    }
    expect(encolheu).toBe(200);
    expect(rendeu).toBeGreaterThan(130);
    expect(cresceu).toBe(200);
  });

  it('adulto recebe a sobra do ano menos o padrão de vida, e tudo vai para o livro', () => {
    const e = pessoa(1, 30, { renda: 40000, custo: 20000 });
    const reg: Mudanca[] = [];
    economiaDoAno(e, criarRng(1), reg);
    expect(e.entidades['eu']!.n['dinheiro']).toBeCloseTo(20000 * (1 - PROPENSAO_GASTO), 0);
    expect(reg.find((m) => m.c === 'eu.dinheiro')?.d).toBeCloseTo(20000 * (1 - PROPENSAO_GASTO), 0);
    expect(reg.every((m) => m.r === 'economia')).toBe(true);
  });

  it('depois dos 65, a velhice consome parte do patrimônio', () => {
    const e = pessoa(2, 70, { renda_fixa: 1_000_000, renda: 18000, custo: 10000 });
    economiaDoAno(e, criarRng(2), [], undefined, { renda_fixa: 0.04 });
    const n = e.entidades['eu']!.n;
    const patrimonio = n['dinheiro']! + n['renda_fixa']! - n['divida']!;
    // rende ~4% e gasta 4%: fica perto de onde estava, nunca cresce como antes dos 65
    expect(patrimonio).toBeLessThan(1_000_000 * (1 + 0.2) - 1_000_000 * GASTO_VELHICE);
    const jovem = pessoa(2, 40, { renda_fixa: 1_000_000, renda: 18000, custo: 10000 });
    economiaDoAno(jovem, criarRng(2), [], undefined, { renda_fixa: 0.04 });
    const nj = jovem.entidades['eu']!.n;
    expect(nj['dinheiro']! + nj['renda_fixa']!).toBeGreaterThan(patrimonio);
  });

  it('acertarCaixa usa investimento (o mais líquido primeiro) antes de virar dívida e amortiza com sobra', () => {
    const f = { dinheiro: -5000, acoes: 1000, renda_fixa: 1500, dolar: 500, divida: 0 };
    acertarCaixa(f);
    expect(f).toMatchObject({ dinheiro: 0, renda_fixa: 0, dolar: 0, acoes: 0, divida: 2000 });
    const g = { dinheiro: -1000, acoes: 5000, renda_fixa: 800, divida: 0 };
    acertarCaixa(g);
    // a renda fixa sai antes das ações
    expect(g).toMatchObject({ dinheiro: 0, renda_fixa: 0, acoes: 4800, divida: 0 });
    f.dinheiro = 500;
    acertarCaixa(f);
    expect(f).toMatchObject({ dinheiro: 0, divida: 1500 });
  });

  it('investir não usa dinheiro que não existe; dívida negativa é desconto', () => {
    const e = pessoa(1, 30, { dinheiro: 1000 });
    const reg: Mudanca[] = [];
    movimentar(e, reg, { investir: 5000, pesos: { renda_fixa: 0.5, acoes: 0.5 } });
    expect(e.entidades['eu']!.n).toMatchObject({ dinheiro: 0, renda_fixa: 500, acoes: 500 });
    e.entidades['eu']!.n['divida'] = 10000;
    movimentar(e, reg, { divida: -8000 });
    expect(e.entidades['eu']!.n['divida']).toBe(2000);
  });
});
