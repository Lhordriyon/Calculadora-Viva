import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { causasDe } from '../src/motor/condicoes.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { proximaEleicao, regraDoPoder } from '../src/motor/poder.ts';
import type { Entrada, EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { contaAVida, impacto, pontosDeVirada } from '../src/motor/virada.ts';

const c = carregarConteudo();

/**
 * Uma vida fixa, escrita à mão no livro: a pelada de toda semana (30 vezes, da mesma causa), o namoro que deu casamento
 * e filho, a derrota na eleição que levou à vitória e à reeleição, e o mesmo voto em duas eleições.
 */
function vidaFixa(): EstadoVida {
  const e = nascer(c, { semente: 5, ano: 2026 });
  const h: Entrada[] = [];
  let id = 1000;
  const entrada = (idade: number, x: Partial<Entrada> & Pick<Entrada, 'tipo' | 'causa'>): Entrada => {
    const en: Entrada = { id: id++, idade, ano: 2026 + idade, texto: '', ...x };
    h.push(en);
    return en;
  };
  const pelada = entrada(6, { tipo: 'acao', causa: 'acao', ref: 'pelada', instancia: 'pelada', resumo: 'jogou futebol de várzea' });
  for (let idade = 7; idade <= 36; idade++)
    entrada(idade, { tipo: 'acao', causa: 'acao', ref: 'bola', instancia: 'bola', resumo: 'jogou bola toda semana', causas: [pelada.id], mudancas: [{ c: 'eu.saude', d: 1 }] });
  const namoro = entrada(20, { tipo: 'evento', causa: 'escolha', ref: 'namoro', instancia: 'namoro', escolha: { indice: 0, texto: 'Namorar', resumo: 'começou a namorar Ana' } });
  entrada(24, { tipo: 'evento', causa: 'escolha', ref: 'casamento', instancia: 'casamento', causas: [namoro.id], escolha: { indice: 0, texto: 'Casar', resumo: 'casou com Ana' }, mudancas: [{ c: 'eu.casado', q: 1 }] });
  entrada(26, { tipo: 'evento', causa: 'escolha', ref: 'bebe', instancia: 'bebe', causas: [namoro.id], escolha: { indice: 0, texto: 'Ter', resumo: 'teve Bia' }, mudancas: [{ c: 'eu.filhos', d: 1 }] });
  const voto1 = entrada(22, { tipo: 'evento', causa: 'escolha', ref: 'voto', instancia: 'voto', escolha: { indice: 0, texto: 'Votar', resumo: 'votou no bloco do meio' } });
  entrada(23, { tipo: 'mundo', causa: 'regra', ref: 'pais:posse', resumo: 'o bloco do meio tomou posse', causas: [voto1.id] });
  const voto2 = entrada(30, { tipo: 'evento', causa: 'escolha', ref: 'voto', instancia: 'voto', escolha: { indice: 0, texto: 'Votar', resumo: 'votou no bloco do meio' } });
  entrada(31, { tipo: 'mundo', causa: 'regra', ref: 'pais:posse', resumo: 'o bloco do meio tomou posse de novo', causas: [voto2.id] });
  const derrota = entrada(28, { tipo: 'dinheiro', causa: 'acao', ref: 'poder:candidatarCargo', resumo: 'perdeu a eleição para vereador' });
  const vitoria = entrada(32, { tipo: 'dinheiro', causa: 'acao', ref: 'poder:candidatarCargo', resumo: 'foi eleito vereador de Recife', causas: [derrota.id], mudancas: [{ c: 'eu.cargo', t: 'vereador' }] });
  const reeleicao = entrada(36, { tipo: 'dinheiro', causa: 'acao', ref: 'poder:candidatarCargo', resumo: 'foi reeleito vereador de Recife', causas: [vitoria.id] });
  entrada(37, { tipo: 'evento', causa: 'escolha', ref: 'votacao', instancia: 'votacao', causas: [reeleicao.id], escolha: { indice: 0, texto: 'Votar contra', resumo: 'votou contra a própria base' } });
  e.historico = [...e.historico, ...h.sort((a, b) => a.idade - b.idade || a.id - b.id)];
  return e;
}

describe('o cartão conta a vida, não a rotina', () => {
  it('a ação que se repete conta uma vez: a pelada de 30 anos perde para o namoro e para a eleição', () => {
    const pontos = pontosDeVirada(vidaFixa(), c, 2);
    expect(pontos.map((p) => p.causa)).toEqual(['você começou a namorar Ana', 'você perdeu a eleição para vereador']);
    // A consequência que conta a vida vence a mais distante: o casamento e o filho, a eleição ganha.
    expect(pontos[0]).toMatchObject({ consequencia: 'teve Bia', consequenciaIdade: 26 });
    expect(pontos[1]!.consequencia).toMatch(/vereador de Recife/);
  });

  it('a reeleição não repete a eleição, e o mesmo voto vale um ponto só', () => {
    const pontos = pontosDeVirada(vidaFixa(), c, 5);
    expect(pontos.filter((p) => /vereador/.test(p.causa))).toHaveLength(1);
    expect(pontos.filter((p) => /bloco do meio/.test(p.causa))).toHaveLength(1);
    // A pelada ainda entra quando sobra lugar, e o total conta tudo o que descende dela.
    expect(pontos.find((p) => p.causa === 'você jogou futebol de várzea')?.total).toBe(30);
  });

  it('o que conta a vida: o marco (só com o conteúdo), o cargo, o casamento, o filho, a morte de alguém próximo e a sua', () => {
    const e = vidaFixa();
    const marco: Entrada = { id: 1, idade: 17, ano: 2043, tipo: 'evento', causa: 'escolha', ref: 'enem', texto: '' };
    expect(c.porId.get('enem')?.marco).toBe(true);
    expect(contaAVida(marco, c)).toBe(true);
    expect(contaAVida(marco)).toBe(false);
    expect(contaAVida({ ...marco, ref: 'regra:faleceu', tipo: 'npc' })).toBe(true);
    expect(contaAVida({ id: 2, idade: 80, ano: 2106, tipo: 'morte', causa: 'regra', texto: 'Você morreu.' })).toBe(true);
    const porResumo = (r: string): Entrada => e.historico.find((h) => (h.escolha?.resumo ?? h.resumo) === r)!;
    for (const r of ['casou com Ana', 'teve Bia', 'perdeu a eleição para vereador', 'foi eleito vereador de Recife']) expect(contaAVida(porResumo(r)), r).toBe(true);
    for (const r of ['jogou bola toda semana', 'votou contra a própria base']) expect(contaAVida(porResumo(r)), r).toBe(false);
  });
});

describe('o cartão de uma vida com dinheiro, faculdade e empresa', () => {
  /**
   * Outra vida fixa: o aporte de R$ 2 milhões, o namoro que deu casamento e filho, a faculdade que deu a formatura que
   * deu o emprego, o cachorro, e a empresa que se tocou todo ano e teve um produto que viralizou.
   */
  function vidaRica(): EstadoVida {
    const e = nascer(c, { semente: 9, ano: 2026 });
    const h: Entrada[] = [];
    let id = 2000;
    const entrada = (idade: number, x: Partial<Entrada> & Pick<Entrada, 'tipo' | 'causa'>): Entrada => {
      const en: Entrada = { id: id++, idade, ano: 2026 + idade, texto: '', ...x };
      h.push(en);
      return en;
    };
    const cachorro = entrada(8, { tipo: 'evento', causa: 'escolha', ref: 'cachorro', escolha: { indice: 0, texto: 'Adotar', resumo: 'adotou Thor' } });
    entrada(20, { tipo: 'evento', causa: 'escolha', ref: 'thor_velho', causas: [cachorro.id], escolha: { indice: 0, texto: 'Ficar', resumo: 'segurou a pata de Thor no fim' }, mudancas: [{ c: 'eu.felicidade', d: 1 }] });
    const faculdade = entrada(18, { tipo: 'evento', causa: 'escolha', ref: 'faculdade', escolha: { indice: 0, texto: 'Ir', resumo: 'entrou na faculdade' } });
    const formatura = entrada(22, { tipo: 'evento', causa: 'escolha', ref: 'formatura', causas: [faculdade.id], escolha: { indice: 0, texto: 'Festa', resumo: 'se formou' }, mudancas: [{ c: 'eu.felicidade', d: 6 }] });
    entrada(30, { tipo: 'evento', causa: 'escolha', ref: 'remoto', causas: [formatura.id], escolha: { indice: 0, texto: 'Aceitar', resumo: 'foi trabalhar remoto' }, mudancas: [{ c: 'eu.felicidade', d: 3 }] });
    const aporte = entrada(24, { tipo: 'dinheiro', causa: 'acao', ref: 'carteira:aportar', resumo: 'fez o primeiro aporte' });
    entrada(25, { tipo: 'dinheiro', causa: 'acao', ref: 'carteira:resgatar', resumo: 'resgatou o aporte com lucro', causas: [aporte.id], mudancas: [{ c: 'eu.dinheiro', d: 2_000_000 }] });
    const namoro = entrada(26, { tipo: 'evento', causa: 'escolha', ref: 'namoro', escolha: { indice: 0, texto: 'Namorar', resumo: 'começou a namorar Ana' } });
    entrada(28, { tipo: 'evento', causa: 'escolha', ref: 'casamento', causas: [namoro.id], escolha: { indice: 0, texto: 'Casar', resumo: 'casou com Ana' }, mudancas: [{ c: 'eu.casado', q: 1 }] });
    entrada(30, { tipo: 'evento', causa: 'escolha', ref: 'bebe', causas: [namoro.id], escolha: { indice: 0, texto: 'Ter', resumo: 'teve Bia' }, mudancas: [{ c: 'eu.filhos', d: 1 }] });
    const abriu = entrada(32, { tipo: 'dinheiro', causa: 'acao', ref: 'empresa:abrir', resumo: 'abriu a Ana.app' });
    for (let idade = 33; idade <= 50; idade++)
      entrada(idade, { tipo: 'acao', causa: 'acao', ref: 'tocar_empresa', instancia: 'tocar_empresa', resumo: 'tocou a empresa até tarde', causas: [abriu.id], mudancas: [{ c: 'empresa.tracao', d: 1.5 }] });
    entrada(36, { tipo: 'evento', causa: 'escolha', ref: 'viralizou', causas: [abriu.id], escolha: { indice: 0, texto: 'Virar noites', resumo: 'aguentou o produto que viralizou' }, mudancas: [{ c: 'empresa.tracao', d: 4 }] });
    e.historico = [...e.historico, ...h.sort((a, b) => a.idade - b.idade || a.id - b.id)];
    return e;
  }

  it('R$ 2 milhões não pesam mais que o casamento e o filho: o dinheiro pesa pelo logaritmo', () => {
    expect(impacto({ id: 1, idade: 30, ano: 2056, tipo: 'dinheiro', causa: 'acao', texto: '', mudancas: [{ c: 'eu.dinheiro', d: 5000 }] })).toBeCloseTo(0.89, 1);
    expect(impacto({ id: 1, idade: 30, ano: 2056, tipo: 'dinheiro', causa: 'acao', texto: '', mudancas: [{ c: 'eu.dinheiro', d: 1e9 }] })).toBeLessThan(45);
    // O custo e a renda do ano também são dinheiro, não pontos de atributo.
    expect(impacto({ id: 1, idade: 30, ano: 2056, tipo: 'evento', causa: 'escolha', texto: '', mudancas: [{ c: 'eu.custo', d: 2_000_000 }] })).toBeLessThan(15);
    const [primeiro] = pontosDeVirada(vidaRica(), c, 1);
    expect(primeiro?.causa).toBe('você começou a namorar Ana');
  });

  it('um ponto por história: a formatura que veio da faculdade não ocupa o lugar do cachorro', () => {
    const pontos = pontosDeVirada(vidaRica(), c, 5).map((p) => p.causa);
    expect(pontos).toContain('você entrou na faculdade');
    expect(pontos).toContain('você adotou Thor');
    expect(pontos).not.toContain('você se formou');
  });

  it('a empresa conta pelo que aconteceu com ela, não pelo ano que se tocou', () => {
    const e = vidaRica();
    const viralizou = e.historico.find((h) => h.ref === 'viralizou')!;
    expect(contaAVida(viralizou)).toBe(true);
    expect(contaAVida(e.historico.find((h) => h.ref === 'tocar_empresa')!)).toBe(false);
    const p = pontosDeVirada(e, c, 5).find((x) => x.causa === 'você abriu a Ana.app');
    expect(p).toMatchObject({ consequencia: 'aguentou o produto que viralizou', consequenciaIdade: 36, total: 19 });
  });
});

describe('a eleição no livro', () => {
  function candidato(): EstadoVida {
    const e = nascer(c, { semente: 7, ano: 2026, origem: { classe: 3 } });
    e.idade = 30;
    e.ano += 30;
    Object.assign(e.entidades['eu']!.n, { dinheiro: 10_000_000, influencia: 60, aparencia: 70 });
    return e;
  }
  const vereador = c.mundo.cargos.find((k) => k.id === 'vereador')!;
  const candidaturas = (e: EstadoVida): Entrada[] => e.historico.filter((h) => h.ref === 'poder:candidatarCargo');

  it('a candidatura descende da anterior; o mandato e o que se lê do cargo descendem da posse', () => {
    const e = candidato();
    const eu = e.entidades['eu']!;
    e.ano = proximaEleicao(e.ano, vereador);
    operar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' });
    const [primeira] = candidaturas(e);
    expect(primeira?.causas).toBeUndefined();
    expect(eu.t['cargo']).toBe('vereador');
    // O storylet do cargo aponta a eleição que o deu (como a empresa aponta a fundação).
    expect(causasDe({ cargo: ['vereador', 'prefeito'] }, e)).toContain(primeira!.id);
    expect(causasDe({ cargo: '' }, e)).not.toContain(primeira!.id);
    // Quatro anos depois, a reeleição nasce da eleição.
    const fase = momentoTipico('normal');
    for (let i = 0; i < 4; i++) {
      regraDoPoder(e, c, fase, []);
      e.ano++;
      e.idade++;
    }
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' })).toBeNull();
    operar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' });
    const segunda = candidaturas(e)[1]!;
    expect(segunda.causas).toEqual([primeira!.id]);
    // O fim do mandato (de quem perdeu agora ou de quem cumpre o novo) também descende da posse.
    for (let i = 0; i < 6 && eu.t['cargo']; i++) regraDoPoder(e, c, fase, []);
    const fim = e.historico.find((h) => h.ref === 'poder:fim_do_mandato');
    expect(fim?.causas).toEqual([primeira!.id]);
    // E a primeira eleição vira ponto de virada, com a segunda como consequência.
    const p = pontosDeVirada(e, c).find((x) => x.origemId === primeira!.id);
    expect(p?.causa).toMatch(/^você foi eleit[oa] vereador[a]? de /);
    expect(p?.consequencia).toMatch(/vereador/);
  });

  it('a primeira candidatura nasce da filiação ao partido', () => {
    const e = candidato();
    e.entidades['eu']!.q['filiado'] = { v: 1, ano: e.ano, idade: e.idade, causa: 42 };
    e.ano = proximaEleicao(e.ano, vereador);
    operar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' });
    expect(candidaturas(e)[0]?.causas).toEqual([42]);
  });
});
