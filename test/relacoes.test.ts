import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { lerCaminho } from '../src/motor/campos.ts';
import { regrasDosPersonagens } from '../src/motor/familia.ts';
import { lancar, novaEntrada, somar } from '../src/motor/livro.ts';
import { morrerPersonagem } from '../src/motor/pessoas.ts';
import { convivem, deQuando, gostoDe, humorDe, lembrancasDe, semONome } from '../src/motor/relacoes.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { aplicarStorylet } from '../src/motor/storylets.ts';
import { nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = conteudo;
/** Um adulto de 30 anos que já não mora com os pais (a família toda viva). */
function adulto(semente = 7): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  for (const en of Object.values(e.entidades)) if (en.nascimento !== undefined) en.nascimento -= 0;
  e.entidades['mae']!.vivo = true;
  delete e.entidades['pai']!.q['ausente'];
  return e;
}

describe('a relação com cada pessoa', () => {
  it('a confiança começa em 60 e guarda só a diferença (o livro fecha sem migrar save)', () => {
    const e = adulto();
    expect(lerCaminho(e, 'mae.confianca')).toBe(60);
    const reg: Mudanca[] = [];
    somar(e, reg, 'mae', 'confianca', -15);
    expect(lerCaminho(e, 'mae.confianca')).toBe(45);
    expect(e.entidades['mae']!.n['confianca']).toBe(-15);
    somar(e, reg, 'mae', 'confianca', -80);
    expect(lerCaminho(e, 'mae.confianca')).toBe(0);
  });

  it('a mágoa passa com o tempo, no ritmo do perdão do traço: o generoso perdoa mais rápido que o rígido', () => {
    const resto = (traco: string): number => {
      const e = adulto();
      e.entidades['mae']!.t['traco'] = traco;
      e.entidades['mae']!.n['magoa'] = 60;
      regrasDosPersonagens(e, c, []);
      return e.entidades['mae']!.n['magoa'] ?? 0;
    };
    expect(resto('generoso')).toBeLessThan(resto('rigido'));
    expect(resto('rigido')).toBeLessThan(60);
  });

  it('longe de casa, o ano conta como ano sem contato; quem convive, não', () => {
    const e = adulto();
    expect(convivem(e, 'mae', e.entidades['mae']!)).toBe(false);
    regrasDosPersonagens(e, c, []);
    expect(e.entidades['mae']!.n['sem_contato']).toBe(1);
    const crianca = nascer(c, { semente: 7, ano: 2026 });
    regrasDosPersonagens(crianca, c, []);
    expect(crianca.entidades['mae']!.n['sem_contato'] ?? 0).toBe(0);
  });

  it('chegar perto é contato: a visita (que dá vínculo) zera os anos sem se falar', () => {
    const e = adulto();
    e.entidades['mae']!.n['sem_contato'] = 5;
    e.entidades['pai']!.n['sem_contato'] = 5;
    aplicarStorylet(e, c, c.porId.get('visitar_familia')!, 'mae', 'acao');
    expect(e.entidades['mae']!.n['sem_contato']).toBe(0);
    // Quem não chegou perto continua longe.
    expect(e.entidades['pai']!.n['sem_contato']).toBe(5);
  });

  it('com mágoa, o humor é de mágoa ou de fúria; longe e com afeto, de saudade', () => {
    const e = adulto();
    const mae = e.entidades['mae']!;
    mae.n['magoa'] = 65;
    expect(humorDe(e, 'mae', mae)).toBe('furia');
    mae.n['magoa'] = 35;
    expect(humorDe(e, 'mae', mae)).toBe('magoa');
    mae.n['magoa'] = 0;
    mae.n['sem_contato'] = 4;
    mae.n['vinculo'] = 60;
    expect(humorDe(e, 'mae', mae)).toBe('saudade');
  });

  it('a pessoa lembra da coisa mais forte que quem joga fez com ela, contada do ponto de vista dela', () => {
    const e = adulto();
    const pequena = novaEntrada(e, { tipo: 'acao', causa: 'acao', texto: 'x', resumo: 'cuidou de sua mãe doente' });
    lancar(e, pequena, [{ c: 'mae.vinculo', d: 4 }]);
    const grande = novaEntrada(e, { tipo: 'acao', causa: 'acao', texto: 'x', resumo: 'levou sua mãe para ver o mar' });
    lancar(e, grande, [{ c: 'mae.vinculo', d: 12 }]);
    const ruim = novaEntrada(e, { tipo: 'acao', causa: 'acao', texto: 'x', resumo: 'faltou ao aniversário de sua mãe' });
    lancar(e, ruim, [{ c: 'mae.magoa', d: 20 }]);
    const l = lembrancasDe(e, 'mae');
    expect(l.boa?.entrada).toBe(grande.id);
    expect(l.ruim?.entrada).toBe(ruim.id);
    expect(deQuando(e, 'mae', e.entidades['mae']!, 'boa')).toBe('de quando você levou ela para ver o mar, aos 30');
    expect(deQuando(e, 'mae', e.entidades['mae']!, 'ruim')).toBe('de quando você faltou ao aniversário dela, aos 30');
  });

  it('o nome e o papel viram pronome', () => {
    const e = adulto();
    const amigo = { ...e.entidades['amigo']!, nome: 'Pedro', genero: 'm' as const };
    expect(semONome('emprestou dinheiro para Pedro', 'amigo', amigo)).toBe('emprestou dinheiro para ele');
    expect(semONome('foi ao casamento de Pedro', 'amigo', amigo)).toBe('foi ao casamento dele');
    expect(semONome('brigou com o Pedro', 'amigo', amigo)).toBe('brigou com ele');
    expect(semONome('cuidou de sua mãe doente', 'mae', e.entidades['mae']!)).toBe('cuidou dela doente');
  });

  it('morrer magoado ou longe deixa remorso; quem estava perto se despediu', () => {
    const magoada = adulto();
    magoada.entidades['mae']!.n['magoa'] = 50;
    magoada.entidades['mae']!.n['vinculo'] = 60;
    const f0 = magoada.entidades['eu']!.n['felicidade'] ?? 0;
    morrerPersonagem(magoada, 'mae', [], 1);
    expect(magoada.entidades['eu']!.q['remorso']).toBeDefined();
    const perto = adulto();
    perto.entidades['mae']!.n['vinculo'] = 70;
    perto.entidades['mae']!.n['sem_contato'] = 0;
    const g0 = perto.entidades['eu']!.n['felicidade'] ?? 0;
    morrerPersonagem(perto, 'mae', [], 1);
    expect(perto.entidades['eu']!.q['despediu']).toBeDefined();
    expect(perto.entidades['eu']!.q['remorso']).toBeUndefined();
    // O remorso dói mais que a despedida.
    expect(f0 - (magoada.entidades['eu']!.n['felicidade'] ?? 0)).toBeGreaterThan(g0 - (perto.entidades['eu']!.n['felicidade'] ?? 0) - 3);
  });

  it('o gosto de cada pessoa é sempre o mesmo, e as pessoas não gostam todas da mesma coisa', () => {
    const gostos = new Set<string>();
    for (let s = 1; s <= 12; s++) {
      const e = nascer(c, { semente: s, ano: 2026 });
      const mae = e.entidades['mae']!;
      expect(gostoDe(mae)).toBe(gostoDe(structuredClone(mae)));
      gostos.add(gostoDe(mae));
    }
    expect(gostos.size).toBeGreaterThan(4);
  });

  it('numa vida inteira, a relação anda: mágoa, confiança e anos sem contato mudam, e o livro fecha', () => {
    const e = viverAteOFim(nascer(c, { semente: 31, ano: 2026 }), c, 31, 'aleatoria');
    const caminhos = new Set(e.historico.flatMap((h) => (h.mudancas ?? []).map((m) => m.c.split('.')[1])));
    expect(caminhos.has('magoa')).toBe(true);
    expect(caminhos.has('confianca')).toBe(true);
    expect(caminhos.has('sem_contato')).toBe(true);
  });
});
