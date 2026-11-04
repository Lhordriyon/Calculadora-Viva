import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { ganhar } from '../src/motor/livro.ts';
import { anoDosProjetos, etapasDe, projetosAtivos, projetosPossiveis, qualidadeDoProjeto } from '../src/motor/projetos.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = conteudo;

/** Um adulto de 30 anos, sem casa, sem dívida, com a mãe viva. */
function adulto(semente = 5): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  const eu = e.entidades['eu']!;
  Object.assign(eu.n, { dinheiro: 10_000, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, saude: 80, felicidade: 60 });
  for (const q of ['casa_propria', 'nome_sujo', 'pai_mae', 'casado', 'namoro', 'formado', 'cursando', 'empreendedor']) delete eu.q[q];
  const mae = e.entidades['mae']!;
  mae.vivo = true;
  Object.assign(mae.n, { vinculo: 50, magoa: 0, confianca: 0 });
  return e;
}

/** Passa os anos sem viver o resto do ano: só a regra dos projetos. */
function anos(e: EstadoVida, n: number): void {
  for (let i = 0; i < n; i++) {
    e.ano += 1;
    e.idade += 1;
    anoDosProjetos(e, c);
  }
}

describe('os projetos (Ω3)', () => {
  it('começar é uma operação: a qualidade nasce com a entrada de causa, e o livro conta "pôs na cabeça…"', () => {
    const e = adulto();
    expect(projetosPossiveis(e, c).map((p) => p.def.id)).toContain('casa_propria');
    const h = operar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' });
    expect(h).toMatchObject({ tipo: 'dinheiro', causa: 'acao', ref: 'projeto:comecar_projeto' });
    expect(h.resumo).toBe('pôs na cabeça comprar a casa própria');
    expect(e.entidades['eu']!.q[qualidadeDoProjeto('casa_propria')]?.causa).toBe(h.id);
    expect(projetosAtivos(e, c).map((p) => p.def.id)).toEqual(['casa_propria']);
    expect(motivoParaNaoOperar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' })).toBe('esse projeto já está de pé');
  });

  it('as etapas leem o estado de agora; a meta alcançada vira conquista, com o começo de causa', () => {
    const e = adulto();
    const h = operar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' });
    const [p] = projetosAtivos(e, c);
    expect(etapasDe(e, p!).map((x) => x.feita)).toEqual([false, true, false]);
    e.entidades['eu']!.n['dinheiro'] = 60_000;
    expect(etapasDe(e, p!).map((x) => x.feita)).toEqual([true, true, false]);
    const felicidade = e.entidades['eu']!.n['felicidade']!;
    ganhar(e, [], 'eu', 'casa_propria', null);
    anos(e, 1);
    const fim = e.historico.at(-1)!;
    expect(fim).toMatchObject({ tipo: 'evento', causa: 'regra', ref: 'regra:projeto_conquista', resumo: 'conquistou a casa própria' });
    expect(fim.causas).toEqual([h.id]);
    expect(projetosAtivos(e, c)).toHaveLength(0);
    expect(e.entidades['eu']!.n['felicidade']!).toBeGreaterThan(felicidade);
    // A linha do tempo conta o porquê: o projeto que começou anos antes.
    expect(porqueDe(fim, new Map(e.historico.map((x) => [x.id, x])))?.texto).toBe('você pôs na cabeça comprar a casa própria');
  });

  it('o prazo passado vira fracasso; desistir é operação, com o texto da desistência', () => {
    const e = adulto();
    operar(e, c, { tipo: 'comecar_projeto', id: 'primeiro_milhao' });
    anos(e, 24);
    expect(projetosAtivos(e, c)).toHaveLength(1);
    anos(e, 1);
    expect(e.historico.at(-1)!.ref).toBe('regra:projeto_vencido');
    expect(projetosAtivos(e, c)).toHaveLength(0);
    operar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' });
    const d = operar(e, c, { tipo: 'desistir_projeto', id: 'casa_propria' });
    expect(d.resumo).toBe('desistiu da casa própria');
    expect(projetosAtivos(e, c)).toHaveLength(0);
  });

  it('no máximo três planos de pé, e só os que fazem sentido; os sonhos têm a vaga deles (bloco S1)', () => {
    const e = adulto();
    expect(projetosPossiveis(e, c).some((p) => p.def.id === 'sair_das_dividas')).toBe(false);
    e.entidades['eu']!.n['divida'] = 5_000;
    expect(projetosPossiveis(e, c).some((p) => p.def.id === 'sair_das_dividas')).toBe(true);
    for (const id of ['casa_propria', 'primeiro_milhao', 'diploma']) operar(e, c, { tipo: 'comecar_projeto', id });
    // Com três planos, só sobram os sonhos: sonhar não disputa a vaga da casa própria.
    const sobram = projetosPossiveis(e, c);
    expect(sobram.length).toBeGreaterThan(0);
    expect(sobram.every((p) => p.def.sonho)).toBe(true);
    expect(motivoParaNaoOperar(e, c, { tipo: 'comecar_projeto', id: 'casar' })).toBe('no máximo 3 planos ao mesmo tempo');
    for (const id of ['estrela', 'imperio']) operar(e, c, { tipo: 'comecar_projeto', id });
    expect(projetosPossiveis(e, c)).toEqual([]);
    expect(motivoParaNaoOperar(e, c, { tipo: 'comecar_projeto', id: 'presidencia' })).toBe('no máximo 2 sonhos ao mesmo tempo');
  });

  it('reparar uma relação é com alguém: a pessoa leva a marca, a meta lê ela, e a morte dela leva o projeto', () => {
    const e = adulto();
    expect(projetosPossiveis(e, c).some((p) => p.def.id === 'reparar_relacao')).toBe(false);
    e.entidades['mae']!.n['magoa'] = 40;
    const p = projetosPossiveis(e, c).find((x) => x.def.id === 'reparar_relacao' && x.com === 'mae');
    expect(p).toBeDefined();
    const h = operar(e, c, { tipo: 'comecar_projeto', id: 'reparar_relacao', com: 'mae' });
    expect(h.resumo).toBe('pôs na cabeça reparar a relação com sua mãe');
    expect(e.entidades['mae']!.q[qualidadeDoProjeto('reparar_relacao')]).toBeDefined();
    expect(projetosAtivos(e, c)[0]!.com).toBe('mae');
    Object.assign(e.entidades['mae']!.n, { magoa: 5, confianca: 5 });
    anos(e, 1);
    expect(e.historico.at(-1)).toMatchObject({ ref: 'regra:projeto_conquista', ator: 'mae', resumo: 'reparou a relação com sua mãe' });
    expect(e.entidades['mae']!.q[qualidadeDoProjeto('reparar_relacao')]).toBeUndefined();
    // De novo, e a mãe morre antes.
    e.entidades['mae']!.n['magoa'] = 40;
    operar(e, c, { tipo: 'comecar_projeto', id: 'reparar_relacao', com: 'mae' });
    e.entidades['mae']!.vivo = false;
    anos(e, 1);
    expect(e.historico.at(-1)).toMatchObject({ ref: 'regra:projeto_semTempo', resumo: 'não teve tempo de reparar a relação com sua mãe' });
  });

  it('os robôs perseguem projetos: em vidas jogadas, há projetos começados e conquistados', () => {
    let comecados = 0;
    let conquistas = 0;
    for (let i = 0; i < 12; i++) {
      const e = viverAteOFim(nascer(c, { semente: 900 + i, ano: 2026 }), c, i, i % 2 ? 'cautelosa' : 'arriscada');
      comecados += e.historico.filter((h) => h.ref === 'projeto:comecar_projeto').length;
      conquistas += e.historico.filter((h) => h.ref === 'regra:projeto_conquista').length;
    }
    expect(comecados).toBeGreaterThan(6);
    expect(conquistas).toBeGreaterThan(1);
  });
});
