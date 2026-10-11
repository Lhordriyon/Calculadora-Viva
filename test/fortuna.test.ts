import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { fichasUsadas } from '../src/motor/acoes.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { ATIVOS, ATRIBUTOS } from '../src/motor/constantes.ts';
import { jogadasDe } from '../src/motor/fortuna.ts';
import { continuarComoHerdeiro, IMPOSTO_HERANCA, IMPOSTO_HERANCA_DA_LEI } from '../src/motor/herdeiro.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

function adulto(dinheiro: number, semente = 5, idade = 40): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = idade;
  e.ano += idade;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda: 60000, custo: 30000 });
  return e;
}

const ids = (e: EstadoVida): string[] => jogadasDe(e, c).map((j) => j.s.id);

describe('brincar de deus', () => {
  it('as jogadas aparecem conforme a fortuna: nada para quem tem pouco, festa com milhões, fundação com bilhões, Marte com trilhões', () => {
    expect(ids(adulto(2_000_000))).toEqual([]);
    expect(ids(adulto(80_000_000))).toContain('festa_do_seculo');
    expect(ids(adulto(80_000_000))).not.toContain('fundacao');
    expect(ids(adulto(3e9))).toEqual(expect.arrayContaining(['fundacao', 'bancar_presidente', 'pix_para_a_cidade']));
    expect(ids(adulto(3e9))).not.toContain('colonia_em_marte');
    expect(ids(adulto(2e12))).toEqual(expect.arrayContaining(['colonia_em_marte', 'fundar_um_pais', 'fundar_uma_cidade']));
    // Salvar o país só existe com a economia patinando (crescimento de até 1% no ano).
    const rico = adulto(2e12);
    rico.entidades['pais']!.n['crescimento'] = 3;
    expect(ids(rico)).not.toContain('salvar_o_pais');
    rico.entidades['pais']!.n['crescimento'] = -2;
    expect(ids(rico)).toContain('salvar_o_pais');
  });

  it('a opção mais cara que o dinheiro na mão aparece bloqueada, com o motivo; a jogada não se faz no fiado', () => {
    const e = adulto(1.5e9);
    const fundacao = jogadasDe(e, c).find((j) => j.s.id === 'fundacao')!;
    const floresta = fundacao.s.escolhas!.findIndex((x) => x.texto.includes('floresta'));
    expect(fundacao.opcoes[floresta]).toMatchObject({ disponivel: false });
    expect(fundacao.opcoes[floresta]!.motivo).toMatch(/precisa de R\$ 5 bilh/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'jogada', id: 'fundacao', escolha: floresta })).toMatch(/precisa de/);
    expect(() => operar(e, c, { tipo: 'jogada', id: 'fundacao', escolha: floresta })).toThrow();
  });

  it('a jogada é do jogador, paga dos investimentos se a conta não basta, não gasta ficha, deixa a marca e some da lista', () => {
    const e = adulto(500_000_000);
    e.entidades['eu']!.n['renda_fixa'] = 3e9;
    const fichas = fichasUsadas(e);
    const fome = c.porId.get('fundacao')!.escolhas!.findIndex((x) => x.texto.includes('fome'));
    const entrada = operar(e, c, { tipo: 'jogada', id: 'fundacao', escolha: fome });
    expect(entrada).toMatchObject({ tipo: 'dinheiro', causa: 'escolha', ref: 'jogada:fundacao' });
    expect(entrada.escolha?.texto).toMatch(/fome/);
    expect(entrada.resultado).toBeTruthy();
    expect(e.entidades['eu']!.n['dinheiro']! + e.entidades['eu']!.n['renda_fixa']!).toBeCloseTo(3.5e9 - 1e9, -3);
    expect(e.entidades['eu']!.n['divida'] ?? 0).toBe(0);
    expect(fichasUsadas(e)).toBe(fichas);
    expect(e.entidades['eu']!.q['fundacao']?.causa).toBe(entrada.id);
    expect(ids(e)).not.toContain('fundacao');
  });

  it('o mundo responde: bancar um presidente agenda a apuração, que vem como evento com a jogada como causa', () => {
    const e = adulto(5e9);
    const entrada = operar(e, c, { tipo: 'jogada', id: 'bancar_presidente', escolha: 0 });
    const agendado = e.agenda.find((a) => a.evento === 'noite_da_apuracao');
    expect(agendado?.origem).toBe(entrada.id);
  });

  it('a lei da herança comprada baixa o imposto de 4% para 1%', () => {
    const herdar = (lei: boolean): number => {
      const e = adulto(10_000_000, 9, 70);
      if (lei) e.entidades['eu']!.q['lei_da_heranca'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
      e.entidades['filho'] = { ...structuredClone(e.entidades['mae']!), id: 'filho', nascimento: e.ano - 40, vivo: true };
      delete e.entidades['amor'];
      e.entidades['eu']!.q['pai_mae'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
      morrer(e, c, { causa: 'de velhice', categoria: 'velhice' });
      return continuarComoHerdeiro(e, c).dinastia!.antepassados.at(-1)!.deixou;
    };
    expect(herdar(false)).toBeCloseTo(10_000_000 * (1 - IMPOSTO_HERANCA), -3);
    expect(herdar(true)).toBeCloseTo(10_000_000 * (1 - IMPOSTO_HERANCA_DA_LEI), -3);
  });

  it('numa vida trilionária jogada pelos robôs, as jogadas acontecem e o livro-razão fecha', () => {
    let jogadas = 0;
    for (let i = 0; i < 4; i++) {
      const e = nascer(c, { semente: misturar(77, i), ano: 2026, origem: { classe: 7 } });
      const inicio = structuredClone(e.entidades['eu']!.n);
      viverAteOFim(e, c, i, i % 2 ? 'arriscada' : 'aleatoria');
      jogadas += e.historico.filter((h) => h.ref?.startsWith('jogada:')).length;
      const soma = new Map<string, number>();
      for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
      for (const campo of [...ATRIBUTOS, 'dinheiro', ...ATIVOS, 'divida']) {
        const esperado = (inicio[campo] ?? 0) + (soma.get(`eu.${campo}`) ?? 0);
        const real = e.entidades['eu']!.n[campo] ?? 0;
        expect(Math.abs(esperado - real), `${campo} (vida ${i})`).toBeLessThan(Math.max(2, Math.abs(real) * 1e-9));
      }
    }
    expect(jogadas).toBeGreaterThan(0);
  });
});
