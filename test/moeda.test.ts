import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { novaMemoria } from '../src/motor/memoria.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { decidir, decidirAcao, decidirDinheiro } from '../src/motor/robos.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const c = conteudo;

/** Uma vida jogada por um robô, como o túnel joga, até a idade dada (ou o fim). */
function viver(semente: number, estrategia: 'cautelosa' | 'arriscada', ate = 200): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  const memoria = novaMemoria();
  const robo = criarRng(semente);
  for (let passos = 0; e.vivo && passos < 3000 && e.idade < ate; passos++) {
    if (e.pendente) {
      escolher(e, c, decidir(estrategia, e, c, robo));
      continue;
    }
    for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) operar(e, c, op);
    for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) agir(e, c, a.verbo, a.escolha);
    if (e.vivo && !e.pendente) avancarAno(e, c, memoria);
  }
  return e;
}

describe('o dinheiro existe (bloco $)', () => {
  it('a soma de todo o dinheiro do mundo é zero no nascimento e no fim de uma vida inteira, e cada lançamento fecha', () => {
    for (const [semente, estrategia] of [
      [41, 'cautelosa'],
      [42, 'arriscada'],
    ] as const) {
      expect(Math.abs(dinheiroDoMundo(nascer(c, { semente, ano: 2026 })))).toBeLessThan(1);
      const e = viver(semente, estrategia);
      expect(Math.abs(dinheiroDoMundo(e))).toBeLessThan(1e4);
      const problemas = e.historico.flatMap((h) => conferirContas(e, h).map((p) => `aos ${h.idade}, ${h.ref}: ${p}`));
      expect(problemas.slice(0, 5)).toEqual([]);
    }
  });

  it('a impressora do Banco Central põe dinheiro novo na economia e acende a inflação', () => {
    const base = viver(43, 'cautelosa', 30);
    const comPolitica = (nivel: number): { e: EstadoVida; media: number } => {
      const e = structuredClone(base);
      e.entidades['pais']!.n['pol_moeda'] = nivel;
      const memoria = novaMemoria();
      const inflacoes: number[] = [];
      for (let i = 0; i < 8 && e.vivo; i++) {
        while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
        // As eleições do caminho trocam o governo: a moeda fica onde o teste a pôs.
        e.entidades['pais']!.n['pol_moeda'] = nivel;
        avancarAno(e, c, memoria);
        inflacoes.push(e.entidades['pais']!.n['inflacao']!);
      }
      return { e, media: inflacoes.reduce((s, x) => s + x, 0) / inflacoes.length };
    };
    const regular = comPolitica(1);
    const impressora = comPolitica(2);
    expect(impressora.e.entidades['pais']!.n['moeda']!).toBeGreaterThan(regular.e.entidades['pais']!.n['moeda']! + 5);
    expect(impressora.media).toBeGreaterThan(regular.media + 1.5);
    expect(impressora.e.historico.some((h) => h.mudancas?.some((m) => m.c === 'tesouro.dinheiro' && m.r === 'emissao'))).toBe(true);
    expect(Math.abs(dinheiroDoMundo(impressora.e))).toBeLessThan(1e4);
  });

  it('o que quem joga paga ao mercado entra na conta do mercado no mesmo lançamento', () => {
    // A primeira vida (a partir da semente 44) que chega viva aos 30.
    let e = viver(44, 'cautelosa', 30);
    for (let semente = 45; !e.vivo; semente++) e = viver(semente, 'cautelosa', 30);
    while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
    e.entidades['eu']!.n['dinheiro'] = (e.entidades['eu']!.n['dinheiro'] ?? 0) + 200_000;
    const mercado = e.entidades['mercado']!.n['dinheiro']!;
    const dinheiro = e.entidades['eu']!.n['dinheiro']!;
    operar(e, c, { tipo: 'comprar', item: 'carro_popular' });
    const pago = dinheiro - e.entidades['eu']!.n['dinheiro']!;
    expect(pago).toBeGreaterThan(10_000);
    expect(e.entidades['mercado']!.n['dinheiro']! - mercado).toBeCloseTo(pago, 0);
  });
});
