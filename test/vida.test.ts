import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { acoesPossiveis } from '../src/motor/acoes.ts';
import { ATRIBUTOS } from '../src/motor/constantes.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { pontosDeVirada, resumirVida } from '../src/motor/virada.ts';
import { conteudoCom, escolhaSimples, passo, viverAteOFim } from './apoio.ts';

const real = carregarConteudo();

describe('nascimento', () => {
  it('gera a mesma pessoa e a mesma família para a mesma semente', () => {
    const a = nascer(real, { semente: 42, ano: 2026 });
    const b = nascer(real, { semente: 42, ano: 2026 });
    expect(a).toEqual(b);
    expect(a.idade).toBe(0);
    expect(a.historico[0]?.tipo).toBe('nascimento');
    for (const id of ['eu', 'mae', 'pai', 'avo', 'amigo', 'lugar', 'pais']) expect(a.entidades[id], id).toBeDefined();
    const eu = a.entidades['eu']!;
    expect(eu.n['classe_origem']).toBeGreaterThanOrEqual(0);
    expect(eu.n['classe_origem']).toBeLessThanOrEqual(5);
    expect(eu.t['familia']).toBeTruthy();
    expect(a.entidades['lugar']!.t['regiao']).toBeTruthy();
  });

  it('respeita a origem escolhida', () => {
    const e = nascer(real, { semente: 3, ano: 2026, origem: { classe: 5, familia: 'empreendedora' } });
    expect(e.entidades['eu']!.n['classe_origem']).toBe(5);
    expect(e.entidades['eu']!.t['familia']).toBe('empreendedora');
  });

  it('origens diferentes dão famílias com dinheiro de ordens diferentes', () => {
    const riqueza = (classe: number): number => {
      let soma = 0;
      for (let i = 0; i < 40; i++) {
        const e = nascer(real, { semente: misturar(classe, i), ano: 2026, origem: { classe } });
        soma += (e.entidades['mae']!.n['dinheiro'] ?? 0) + (e.entidades['pai']!.n['dinheiro'] ?? 0);
      }
      return soma / 40;
    };
    expect(riqueza(5)).toBeGreaterThan(riqueza(0) * 50);
  });
});

describe('ciclo da vida', () => {
  it('+1 ano avança idade e ano e trava com escolha pendente', () => {
    const e = nascer(real, { semente: 5, ano: 2026 });
    avancarAno(e, real);
    expect(e.idade).toBe(1);
    expect(e.ano).toBe(2027);
    // a primeira palavra é um marco aos 1 ano
    expect(e.pendente?.storylet).toBe('primeira_palavra');
    expect(() => avancarAno(e, real)).toThrow();
    escolher(e, real, 0);
    expect(e.pendente).toBeNull();
    expect(e.historico.at(-1)?.escolha?.indice).toBe(0);
  });

  it('toda vida termina e nunca repete storylet não-repetível', () => {
    for (let i = 0; i < 200; i++) {
      const e = viverAteOFim(nascer(real, { semente: misturar(11, i), ano: 2026 }), real, i);
      expect(e.vivo).toBe(false);
      expect(e.morte).not.toBeNull();
      expect(e.historico.at(-1)?.tipo).toBe('morte');
      const vistos = new Map<string, number>();
      for (const h of e.historico) {
        if ((h.tipo === 'evento' || h.tipo === 'npc') && h.instancia && !h.ref?.startsWith('regra:')) vistos.set(h.instancia, (vistos.get(h.instancia) ?? 0) + 1);
      }
      for (const [instancia, n] of vistos) if (n > 1) expect(real.porId.get(instancia.split('#')[0]!)?.repetivel, instancia).toBe(true);
    }
  });

  it('é determinística: mesma semente e mesmas decisões dão a mesma vida, mesmo salvando no meio', () => {
    const a = viverAteOFim(nascer(real, { semente: 77, ano: 2026 }), real, 5);
    let atual = nascer(real, { semente: 77, ano: 2026 });
    const robo = criarRng(5);
    while (atual.vivo) {
      passo(atual, real, robo);
      atual = JSON.parse(JSON.stringify(atual)) as EstadoVida;
    }
    expect(atual.historico).toEqual(a.historico);
    expect(atual.entidades).toEqual(a.entidades);
  });

  it('mantém atributos, saúde e vínculos entre 0 e 100', () => {
    for (let i = 0; i < 20; i++) {
      const e = viverAteOFim(nascer(real, { semente: misturar(99, i), ano: 2026 }), real, i, 'arriscada');
      for (const en of Object.values(e.entidades)) {
        for (const campo of [...ATRIBUTOS, 'vinculo']) {
          const v = en.n[campo];
          if (v === undefined) continue;
          expect(v, `${en.id}.${campo}`).toBeGreaterThanOrEqual(0);
          expect(v, `${en.id}.${campo}`).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});

describe('livro-razão', () => {
  it('toda mudança de quem joga está no livro: nascimento + soma das variações = estado final', () => {
    for (let i = 0; i < 15; i++) {
      const e = nascer(real, { semente: misturar(31, i), ano: 2026 });
      const inicio = structuredClone(e.entidades['eu']!.n);
      viverAteOFim(e, real, i);
      const soma = new Map<string, number>();
      for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
      for (const campo of [...ATRIBUTOS, 'dinheiro', 'investido', 'divida', 'renda', 'custo']) {
        const esperado = (inicio[campo] ?? 0) + (soma.get(`eu.${campo}`) ?? 0);
        expect(Math.abs(esperado - (e.entidades['eu']!.n[campo] ?? 0)), `${campo} (vida ${i})`).toBeLessThan(2);
      }
    }
  });

  it('toda qualidade aponta para a entrada que a criou', () => {
    const e = viverAteOFim(nascer(real, { semente: 404, ano: 2026 }), real, 4);
    const ids = new Set(e.historico.map((h) => h.id));
    for (const en of Object.values(e.entidades)) {
      for (const [nome, q] of Object.entries(en.q)) if (q.causa !== null) expect(ids.has(q.causa), `${en.id}.${nome}`).toBe(true);
    }
  });
});

describe('ficha do ano', () => {
  it('não há verbos para bebês; uma ação por ano; a ação vira entrada do jogador', () => {
    const e = nascer(real, { semente: 12, ano: 2026 });
    expect(acoesPossiveis(e, real)).toEqual([]);
    const robo = criarRng(1);
    while (e.idade < 16) passo(e, real, robo);
    while (e.pendente) escolher(e, real, 0);
    const possiveis = acoesPossiveis(e, real);
    expect(possiveis.length).toBeGreaterThanOrEqual(3);
    const entrada = agir(e, real, possiveis[0]!.verbo);
    expect(entrada).toMatchObject({ tipo: 'acao', causa: 'acao', idade: 16 });
    expect(acoesPossiveis(e, real)).toEqual([]);
    expect(() => agir(e, real, possiveis[0]!.verbo)).toThrow();
    avancarAno(e, real);
    if (!e.pendente) expect(acoesPossiveis(e, real).length).toBeGreaterThan(0);
  });

  it('o botão mostra o que vai acontecer: o verbo escolhe sempre a mesma ação para o mesmo estado', () => {
    const e = nascer(real, { semente: 21, ano: 2026 });
    const robo = criarRng(2);
    while (e.idade < 25 && e.vivo) passo(e, real, robo, 'cautelosa');
    while (e.pendente) escolher(e, real, 0);
    const antes = acoesPossiveis(e, real).map((a) => `${a.verbo}:${a.s.id}:${a.ator ?? ''}`);
    const copia = structuredClone(e);
    expect(acoesPossiveis(copia, real).map((a) => `${a.verbo}:${a.s.id}:${a.ator ?? ''}`)).toEqual(antes);
  });
});

describe('qualidades, agendamentos e pontos de virada', () => {
  const c = conteudoCom([
    {
      id: 'causa',
      idade: [1, 1],
      marco: true,
      texto: 'Uma escolha.',
      resumo: 'escolheu',
      escolhas: [
        escolhaSimples('Plantar uma semente', { marcas: ['semente'], agendar: [{ evento: 'colheita', em: 3 }] }),
        escolhaSimples('Não plantar'),
      ],
    },
    {
      id: 'consequencia',
      idade: [2, 2],
      marco: true,
      condicoes: { marcas: ['semente'] },
      texto: 'Brotou.',
      resumo: 'viu brotar',
      escolhas: [escolhaSimples('Regar', { saude: 500 })],
    },
    {
      id: 'colheita',
      apenasAgendado: true,
      texto: 'Colheita.',
      resumo: 'colheu o que plantou',
      escolhas: [escolhaSimples('Colher', { felicidade: -500 })],
    },
  ]);

  function viver(escolhaInicial: number): EstadoVida {
    const e = nascer(c, { semente: 1, ano: 2026 });
    avancarAno(e, c);
    escolher(e, c, escolhaInicial);
    while (e.idade < 6 && e.vivo) {
      if (e.pendente) escolher(e, c, 0);
      else avancarAno(e, c);
    }
    return e;
  }

  it('grava a qualidade com ano, idade e a entrada que a causou', () => {
    const e = viver(0);
    const q = e.entidades['eu']!.q['semente'];
    expect(q).toMatchObject({ idade: 1, ano: 2027 });
    expect(e.historico.find((h) => h.id === q?.causa)?.ref).toBe('causa');
  });

  it('dispara o storylet que consulta a qualidade e o agendado no ano certo', () => {
    const e = viver(0);
    const brotou = e.historico.find((h) => h.ref === 'consequencia');
    const colheu = e.historico.find((h) => h.ref === 'colheita');
    expect(brotou?.idade).toBe(2);
    expect(colheu?.idade).toBe(4);
    expect(colheu?.causas).toContain(e.entidades['eu']!.q['semente']?.causa);
  });

  it('sem a escolha, a cadeia não acontece', () => {
    const e = viver(1);
    expect(e.historico.some((h) => h.ref === 'consequencia' || h.ref === 'colheita')).toBe(false);
  });

  it('limita atributos mesmo com efeitos exagerados', () => {
    const e = viver(0);
    expect(e.entidades['eu']!.n['saude']).toBeLessThanOrEqual(100);
    expect(e.entidades['eu']!.n['felicidade']).toBeGreaterThanOrEqual(0);
  });

  it('o cartão da vida aponta a escolha que causou mais coisas, com sujeito', () => {
    const e = viver(0);
    const pontos = pontosDeVirada(e);
    expect(pontos[0]).toMatchObject({ idade: 1, causa: 'você plantar uma semente', doJogador: true, total: 2, consequenciaIdade: 4 });
    const r = resumirVida(e, c);
    expect(r.pontos.length).toBeGreaterThan(0);
    expect(r.epitafio.length).toBeGreaterThan(3);
    expect(r.origem).toMatch(/família|classe|pobreza/);
  });
});
