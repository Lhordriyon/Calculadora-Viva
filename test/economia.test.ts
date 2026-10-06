import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { acertarCaixa, economiaDoAno, movimentar } from '../src/motor/economia.ts';
import { criarRng } from '../src/motor/rng.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

describe('economia', () => {
  it('a inflação come dinheiro parado; investimento rende; dívida cresce', () => {
    const rng = criarRng(4);
    let encolheu = 0;
    let rendeu = 0;
    let cresceu = 0;
    for (let i = 0; i < 200; i++) {
      const e = nascer(c, { semente: i, ano: 2026 });
      e.idade = 10;
      e.financas = { ...e.financas, dinheiro: 10000, investido: 10000, divida: 0 };
      economiaDoAno(e, rng);
      if (e.financas.dinheiro < 10000) encolheu++;
      if (e.financas.investido > 10000) rendeu++;
      const d = nascer(c, { semente: i, ano: 2026 });
      d.idade = 10;
      d.financas = { ...d.financas, divida: 10000 };
      economiaDoAno(d, rng);
      if (d.financas.divida > 10000) cresceu++;
    }
    expect(encolheu).toBe(200);
    expect(rendeu).toBeGreaterThan(130);
    expect(cresceu).toBe(200);
  });

  it('adulto recebe a sobra do ano menos o padrão de vida', () => {
    const e = nascer(c, { semente: 1, ano: 2026 });
    e.idade = 30;
    e.financas = { ...e.financas, renda: 40000, custo: 20000 };
    economiaDoAno(e, criarRng(1));
    expect(e.financas.dinheiro).toBeCloseTo(8000, 0);
  });

  it('acertarCaixa usa investimento antes de virar dívida e amortiza com sobra', () => {
    const f = { dinheiro: -5000, investido: 3000, divida: 0, renda: 0, custo: 0, inflacao: 0 };
    acertarCaixa(f);
    expect(f).toMatchObject({ dinheiro: 0, investido: 0, divida: 2000 });
    f.dinheiro = 500;
    acertarCaixa(f);
    expect(f).toMatchObject({ dinheiro: 0, divida: 1500 });
  });

  it('investir não usa dinheiro que não existe; dívida negativa é desconto', () => {
    const e = nascer(c, { semente: 1, ano: 2026 });
    e.financas.dinheiro = 1000;
    movimentar(e, { investir: 5000 });
    expect(e.financas).toMatchObject({ dinheiro: 0, investido: 1000 });
    e.financas.divida = 10000;
    movimentar(e, { divida: -8000 });
    expect(e.financas.divida).toBe(2000);
  });
});
