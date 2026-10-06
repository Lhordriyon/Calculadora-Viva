import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { decidir } from '../src/motor/robos.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { pontosDeVirada, resumirVida } from '../src/motor/virada.ts';
import { conteudoCom, escolhaSimples } from './apoio.ts';

const real = carregarConteudo();

function viverAteOFim(e: EstadoVida, c = real, semente = 1): EstadoVida {
  const robo = criarRng(semente);
  while (e.vivo) {
    if (e.pendente) escolher(e, c, decidir('aleatoria', e, c, robo));
    else avancarAno(e, c);
  }
  return e;
}

describe('nascimento', () => {
  it('gera a mesma pessoa para a mesma semente', () => {
    const a = nascer(real, { semente: 42, ano: 2026 });
    const b = nascer(real, { semente: 42, ano: 2026 });
    expect(a).toEqual(b);
    expect(a.idade).toBe(0);
    expect(a.historico[0]?.tipo).toBe('nascimento');
    expect(a.personagens.mae && a.personagens.pai && a.personagens.avo && a.personagens.amigo).toBeTruthy();
  });

  it('nasce com marcas de cidade e família', () => {
    const e = nascer(real, { semente: 3, ano: 2026 });
    const marcas = Object.keys(e.marcas);
    expect(marcas.some((m) => m.startsWith('familia_'))).toBe(true);
    expect(marcas.some((m) => m === 'capital' || m === 'interior')).toBe(true);
  });
});

describe('ciclo da vida', () => {
  it('+1 ano avança idade e ano e trava com escolha pendente', () => {
    const e = nascer(real, { semente: 5, ano: 2026 });
    avancarAno(e, real);
    expect(e.idade).toBe(1);
    expect(e.ano).toBe(2027);
    // a primeira palavra é um marco aos 1 ano
    expect(e.pendente?.eventoId).toBe('primeira_palavra');
    expect(() => avancarAno(e, real)).toThrow();
    escolher(e, real, 0);
    expect(e.pendente).toBeNull();
    expect(e.historico.at(-1)?.escolha?.indice).toBe(0);
  });

  it('toda vida termina e nunca repete evento não-repetível', () => {
    for (let i = 0; i < 300; i++) {
      const e = viverAteOFim(nascer(real, { semente: misturar(11, i), ano: 2026 }), real, i);
      expect(e.vivo).toBe(false);
      expect(e.morte).not.toBeNull();
      expect(e.historico.at(-1)?.tipo).toBe('morte');
      const vistos = new Map<string, number>();
      for (const h of e.historico) if (h.eventoId) vistos.set(h.eventoId, (vistos.get(h.eventoId) ?? 0) + 1);
      for (const [id, n] of vistos) if (n > 1) expect(real.porId.get(id)?.repetivel, id).toBe(true);
    }
  });

  it('é determinística: mesma semente e mesmas escolhas dão a mesma vida, mesmo salvando no meio', () => {
    const a = nascer(real, { semente: 77, ano: 2026 });
    const b = nascer(real, { semente: 77, ano: 2026 });
    viverAteOFim(a, real, 5);
    // b é salvo e recarregado a cada passo
    let atual = b;
    const robo = criarRng(5);
    while (atual.vivo) {
      if (atual.pendente) escolher(atual, real, decidir('aleatoria', atual, real, robo));
      else avancarAno(atual, real);
      atual = JSON.parse(JSON.stringify(atual)) as EstadoVida;
    }
    expect(atual.historico).toEqual(a.historico);
  });

  it('mantém atributos entre 0 e 100', () => {
    const e = viverAteOFim(nascer(real, { semente: 99, ano: 2026 }));
    for (const v of Object.values(e.atributos)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

describe('marcas, agendamentos e pontos de virada', () => {
  const c = conteudoCom([
    {
      id: 'causa',
      idade: [1, 1],
      marco: true,
      texto: 'Uma escolha.',
      resumo: 'escolheu',
      escolhas: [
        escolhaSimples('Plantar uma semente', {
          marcas: ['semente'],
          agendar: [{ evento: 'colheita', em: 3 }],
        }),
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

  it('grava a marca com ano, idade e origem', () => {
    const e = viver(0);
    const marca = e.marcas['semente'];
    expect(marca).toMatchObject({ idade: 1, ano: 2027 });
    const origem = e.historico.find((h) => h.id === marca?.origem);
    expect(origem?.eventoId).toBe('causa');
  });

  it('dispara o evento que consulta a marca e o agendado no ano certo', () => {
    const e = viver(0);
    const brotou = e.historico.find((h) => h.eventoId === 'consequencia');
    const colheu = e.historico.find((h) => h.eventoId === 'colheita');
    expect(brotou?.idade).toBe(2);
    expect(colheu?.idade).toBe(4);
    expect(colheu?.causas).toContain(e.marcas['semente']?.origem);
  });

  it('sem a escolha, a cadeia não acontece', () => {
    const e = viver(1);
    expect(e.historico.some((h) => h.eventoId === 'consequencia' || h.eventoId === 'colheita')).toBe(false);
  });

  it('limita atributos mesmo com efeitos exagerados', () => {
    const e = viver(0);
    expect(e.atributos.saude).toBeLessThanOrEqual(100);
    expect(e.atributos.felicidade).toBeGreaterThanOrEqual(0);
  });

  it('o cartão da vida aponta a escolha que causou mais eventos', () => {
    const e = viver(0);
    const pontos = pontosDeVirada(e);
    expect(pontos[0]).toMatchObject({ idade: 1, escolha: 'plantar uma semente', total: 2, consequenciaIdade: 4 });
    const r = resumirVida(e, c);
    expect(r.pontos.length).toBeGreaterThan(0);
    expect(r.epitafio.length).toBeGreaterThan(3);
  });
});
