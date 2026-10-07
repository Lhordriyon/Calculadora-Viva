import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { ATIVOS, ATRIBUTOS } from '../src/motor/constantes.ts';
import { continuarComoHerdeiro, herdeiroPossivel, IMPOSTO_HERANCA } from '../src/motor/herdeiro.ts';
import { ganhar } from '../src/motor/livro.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

/** Quem joga, aos 60, morrendo agora, com o patrimônio dado e (se quiser) um filho de 30 anos e um par. */
function velorio(semente: number, n: Record<string, number>, op: { filho?: boolean; casado?: boolean; irmaos?: number } = {}): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 60;
  e.ano += 60;
  Object.assign(e.entidades['eu']!.n, { dinheiro: 0, renda_fixa: 0, divida: 0, irmaos: op.irmaos ?? 0 }, n);
  if (op.filho) {
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
  }
  if (op.casado) {
    criarPersonagem(e, c, 'amor', []);
    ganhar(e, [], 'eu', 'namoro', null);
    ganhar(e, [], 'eu', 'casado', null);
  }
  morrer(e, c);
  return e;
}

describe('a partilha', () => {
  it('as dívidas morrem com o espólio; o imposto e a metade do cônjuge saem antes do herdeiro', () => {
    const endividado = continuarComoHerdeiro(velorio(1, { dinheiro: 10000, divida: 50000 }, { filho: true }), c);
    expect(endividado.entidades['eu']!.n['dinheiro']).toBeLessThan(1);
    expect(endividado.entidades['eu']!.n['divida']).toBe(0);
    expect(endividado.historico[0]!.texto).toMatch(/dívidas/);

    const solteiro = continuarComoHerdeiro(velorio(2, { dinheiro: 100000, renda_fixa: 900000 }, { filho: true }), c);
    const herdado = (solteiro.entidades['eu']!.n['dinheiro'] ?? 0) + ATIVOS.reduce((s, a) => s + (solteiro.entidades['eu']!.n[a] ?? 0), 0);
    expect(herdado).toBeCloseTo(1_000_000 * (1 - IMPOSTO_HERANCA), -2);
    expect(solteiro.dinastia?.antepassados.at(-1)?.deixou).toBe(Math.round(1_000_000 * (1 - IMPOSTO_HERANCA)));

    const casado = velorio(3, { renda_fixa: 1_000_000 }, { filho: true, casado: true });
    const conjuge = casado.entidades['amor']!.nome;
    const h = continuarComoHerdeiro(casado, c);
    expect(h.entidades['eu']!.n['renda_fixa']).toBeCloseTo(500_000 * (1 - IMPOSTO_HERANCA), -2);
    // Quem era casado com quem morreu é o outro pai ou mãe de quem herda, com a metade.
    const outro = [h.entidades['mae'], h.entidades['pai']].find((p) => p?.nome === conjuge)!;
    expect(outro.n['dinheiro']).toBeGreaterThanOrEqual(500_000);
  });
});

describe('o testamento', () => {
  it('o testamento solidário deixa um quarto para a causa, antes do imposto', () => {
    const e = velorio(10, { renda_fixa: 1_000_000 }, { filho: true });
    e.entidades['eu']!.q['testamento_solidario'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades['eu']!.n['renda_fixa']).toBeCloseTo(750_000 * (1 - IMPOSTO_HERANCA), -2);
    expect(h.historico[0]!.texto).toMatch(/causa do testamento/);
  });
});

describe('quem herda', () => {
  it('o filho primeiro; sem filho, um sobrinho, se havia irmãos; sem os dois, ninguém', () => {
    expect(herdeiroPossivel(velorio(4, {}, { filho: true, irmaos: 2 }), c)?.parentesco).toBe('filho');
    const semFilho = velorio(5, { dinheiro: 300000 }, { irmaos: 2 });
    const sobrinho = herdeiroPossivel(semFilho, c)!;
    expect(sobrinho.parentesco).toBe('sobrinho');
    expect(sobrinho.entidade).toBeUndefined();
    expect(semFilho.ano - sobrinho.nascimento).toBeGreaterThanOrEqual(1);
    expect(herdeiroPossivel(velorio(6, {}, { irmaos: 0 }), c)).toBeNull();
    const vivo = nascer(c, { semente: 7, ano: 2026 });
    expect(herdeiroPossivel(vivo, c)).toBeNull();
  });

  it('perguntar quem herda não gasta o sorteio da vida, e a resposta é sempre a mesma', () => {
    const e = velorio(8, { dinheiro: 50000 }, { irmaos: 1 });
    const antes = structuredClone(e.rng);
    const a = herdeiroPossivel(e, c);
    const b = herdeiroPossivel(e, c);
    expect(b).toEqual(a);
    expect(e.rng).toEqual(antes);
  });

  it('o sobrinho começa com os próprios pais (irmão de quem morreu) e o texto conta o testamento', () => {
    const e = velorio(9, { dinheiro: 400000 }, { irmaos: 3 });
    const tio = e.entidades['eu']!;
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades['eu']!.nome).toBe(herdeiroPossivel(e, c)!.nome);
    expect(h.entidades['mae']!.nome).not.toBe(tio.nome);
    expect(h.entidades['pai']!.nome).not.toBe(tio.nome);
    expect(h.historico[0]!.texto).toMatch(/(Seu tio|Sua tia), .*testamento/);
    expect(h.dinastia?.geracao).toBe(2);
  });
});

describe('a vida de quem herda', () => {
  function herdeiros(): EstadoVida[] {
    const saida: EstadoVida[] = [];
    for (let i = 0; saida.length < 6 && i < 60; i++) {
      const e = viverAteOFim(nascer(c, { semente: misturar(91, i), ano: 2026 }), c, i, 'cautelosa');
      if (herdeiroPossivel(e, c)) saida.push(continuarComoHerdeiro(e, c));
    }
    return saida;
  }
  const lista = herdeiros();

  it('é determinística: a mesma vida dá o mesmo herdeiro e a mesma vida nova', () => {
    const e = viverAteOFim(nascer(c, { semente: misturar(91, 0), ano: 2026 }), c, 0, 'cautelosa');
    if (!herdeiroPossivel(e, c)) return;
    expect(continuarComoHerdeiro(e, c)).toEqual(continuarComoHerdeiro(e, c));
  });

  it('toda qualidade aponta para uma entrada da vida nova, e o livro fecha até o fim', () => {
    expect(lista.length).toBeGreaterThanOrEqual(3);
    lista.forEach((h, i) => {
      const ids = new Set(h.historico.map((x) => x.id));
      for (const en of Object.values(h.entidades)) {
        for (const [nome, q] of Object.entries(en.q)) if (q.causa !== null) expect(ids.has(q.causa), `${en.id}.${nome}`).toBe(true);
      }
      const inicio = structuredClone(h.entidades['eu']!.n);
      viverAteOFim(h, c, i, 'aleatoria');
      const soma = new Map<string, number>();
      for (const x of h.historico) for (const m of x.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
      for (const campo of [...ATRIBUTOS, 'dinheiro', ...ATIVOS, 'divida', 'renda', 'custo']) {
        const esperado = (inicio[campo] ?? 0) + (soma.get(`eu.${campo}`) ?? 0);
        expect(Math.abs(esperado - (h.entidades['eu']!.n[campo] ?? 0)), `${campo} (herdeiro ${i})`).toBeLessThan(2);
      }
    });
  });

  it('a dinastia volta igual depois de salvar e ler', () => {
    const h = lista[0]!;
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: h }), c);
    expect(lido.vida?.dinastia).toEqual(h.dinastia);
  });
});
