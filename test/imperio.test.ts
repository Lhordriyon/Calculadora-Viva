/**
 * Incremento 6: quem manda na empresa e o porquê de cada acontecimento.
 * A empresa nasce dependendo de quem a abriu; o talento dele pesa nessa
 * proporção, a morte dele custa valor e quem compra desconta. Delegar é
 * jogada do jogador, e o mundo responde. A linha do tempo aponta cada
 * acontecimento para a decisão que o causou.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { operar } from '../src/motor/carteira.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import { dependenciaDe, empresaDe, regraDaEmpresa } from '../src/motor/empresa.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { ehDaEmpresa, jogadasDe } from '../src/motor/fortuna.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { DEPENDENCIA_INICIAL, PERDA_SEM_DONO } from '../src/motor/regras.ts';
import type { Entrada, EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { porqueDe } from '../src/motor/virada.ts';

const c = carregarConteudo();

/** Um adulto de 40 anos, no país normal, com uma empresa deste valor aberta pela folha. */
function dono(valor: number, semente = 21, n: Record<string, number> = {}): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = 40;
  e.ano += 40;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro: valor + 5_000_000, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda: 80000, custo: 40000, inteligencia: 50 }, n);
  operar(e, c, { tipo: 'abrir', setor: 'comercio', valor });
  return e;
}

const idsNaEmpresa = (e: EstadoVida): string[] => jogadasDe(e, c).filter((j) => ehDaEmpresa(j.s)).map((j) => j.s.id);

describe('quem manda na empresa', () => {
  it('nasce dependendo de quem abriu; com sócios, eles dividem o comando', () => {
    expect(empresaDe(dono(100_000))!.n['dependencia']).toBe(DEPENDENCIA_INICIAL);
    const e = nascer(c, { semente: 3, ano: 2026 });
    e.idade = 30;
    const reg: Mudanca[] = [];
    aplicarEfeitos(e, c, { abrirEmpresa: { setor: 'comercio', valor: 50000, participacao: 0.5 } } as unknown as Efeitos, { origem: 0, reg, valores: {} });
    expect(empresaDe(e)!.n['dependencia']).toBe(DEPENDENCIA_INICIAL * 0.5);
  });

  it('o talento de quem manda pesa na proporção da dependência: o gênio cresce mais centralizando, o mediano delegando', () => {
    const tracaoDepoisDeUmAno = (inteligencia: number, dependencia: number): number => {
      const e = dono(1_000_000, 9, { inteligencia });
      e.entidades['empresa']!.n['dependencia'] = dependencia;
      e.entidades['empresa']!.n['tracao'] = 0;
      regraDaEmpresa(e, c, momentoTipico('normal'), []);
      return e.entidades['empresa']!.n['tracao']!;
    };
    // A mesma semente sorteia a mesma sorte: a diferença é só a regra.
    expect(tracaoDepoisDeUmAno(95, 100)).toBeGreaterThan(tracaoDepoisDeUmAno(95, 0));
    expect(tracaoDepoisDeUmAno(50, 0)).toBeGreaterThan(tracaoDepoisDeUmAno(50, 100));
    expect(tracaoDepoisDeUmAno(25, 0)).toBeGreaterThan(tracaoDepoisDeUmAno(25, 100));
  });

  it('a morte de quem manda custa valor na proporção da dependência, com a morte como causa; a empresa que anda sozinha não sente', () => {
    const e = dono(10_000_000);
    const antes = empresaDe(e)!.n['valor']!;
    morrer(e, c, { causa: 'de velhice', categoria: 'velhice' });
    const morte = e.historico.find((h) => h.tipo === 'morte')!;
    const sentiu = e.historico.at(-1)!;
    expect(sentiu).toMatchObject({ ref: 'empresa:sem_dono', causas: [morte.id] });
    expect(sentiu.texto).toMatch(/perdeu 32% do valor/);
    expect(empresaDe(e)!.n['valor']).toBeCloseTo(antes * (1 - PERDA_SEM_DONO * 0.8));
    expect(sentiu.mudancas?.find((m) => m.c === 'empresa.valor')?.d).toBeCloseTo(-antes * PERDA_SEM_DONO * 0.8, -1);

    const sozinha = dono(10_000_000);
    sozinha.entidades['empresa']!.n['dependencia'] = 0;
    morrer(sozinha, c, { causa: 'de velhice', categoria: 'velhice' });
    expect(sozinha.historico.at(-1)!.tipo).toBe('morte');
    expect(empresaDe(sozinha)!.n['valor']).toBeCloseTo(10_000_000);
  });

  it('o herdeiro fica sabendo: a abertura conta quanto a empresa perdeu com a morte', () => {
    const e = dono(10_000_000, 33);
    const eu = e.entidades['eu']!;
    e.entidades['filho'] = { ...structuredClone(e.entidades['mae']!), id: 'filho', nascimento: e.ano - 15, vivo: true };
    eu.q['pai_mae'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    delete e.entidades['amor'];
    morrer(e, c, { causa: 'de velhice', categoria: 'velhice' });
    const nova = continuarComoHerdeiro(e, c);
    expect(nova.historico[0]!.texto).toMatch(new RegExp(`perdeu 32% do valor com a morte de ${eu.nome}`));
    expect(empresaDe(nova)!.n['dependencia']).toBe(DEPENDENCIA_INICIAL);
  });
});

describe('jogadas na empresa', () => {
  it('aparecem com uma empresa de R$ 15 milhões; sair de cena só abre para quem já delegou', () => {
    expect(idsNaEmpresa(dono(1_000_000))).toEqual([]);
    const e = dono(40_000_000);
    expect(idsNaEmpresa(e)).toEqual(expect.arrayContaining(['conselho_que_diz_nao', 'mural_de_problemas', 'bancar_quem_sai']));
    expect(idsNaEmpresa(e)).not.toContain('tornar_se_dispensavel');
    // Nenhuma delas aparece em Brincar de deus (a lista de quem tem fortuna, fora da empresa).
    expect(jogadasDe(e, c).filter((j) => !ehDaEmpresa(j.s)).map((j) => j.s.id)).not.toContain('conselho_que_diz_nao');
    operar(e, c, { tipo: 'jogada', id: 'conselho_que_diz_nao', escolha: 0 });
    operar(e, c, { tipo: 'jogada', id: 'mural_de_problemas', escolha: 0 });
    expect(dependenciaDe(e)).toBeCloseTo(0.4);
    expect(idsNaEmpresa(e)).toContain('tornar_se_dispensavel');
    expect(idsNaEmpresa(e)).not.toContain('conselho_que_diz_nao');
  });

  it('o custo pode sair da empresa, não da conta; e o mundo responde agendado, com a jogada como causa', () => {
    const e = dono(40_000_000);
    const mural = jogadasDe(e, c).find((j) => j.s.id === 'mural_de_problemas')!;
    expect(mural.custos[0]).toBe(0);
    expect(mural.daEmpresa[0]).toBeCloseTo(40_000_000 * 0.005);
    const conta = e.entidades['eu']!.n['dinheiro']!;
    const entrada = operar(e, c, { tipo: 'jogada', id: 'mural_de_problemas', escolha: 0 });
    expect(e.entidades['eu']!.n['dinheiro']).toBe(conta);
    expect(e.agenda.find((a) => a.evento === 'solucao_inesperada')?.origem).toBe(entrada.id);
  });
});

describe('o porquê', () => {
  const h = (id: number, idade: number, parcial: Partial<Entrada>): Entrada => ({ id, idade, ano: 2026 + idade, causa: 'diretor', tipo: 'evento', texto: '…', ...parcial });

  it('aponta a decisão do jogador de um ano anterior, a mais recente, antes da do mundo', () => {
    const fumou = h(1, 15, { causa: 'escolha', escolha: { indice: 0, texto: 'Experimentar', resumo: 'deu a primeira tragada num vape' } });
    const crise = h(2, 30, { tipo: 'mundo', causa: 'regra', resumo: 'o país mergulhou numa crise' });
    const parou = h(3, 31, { causa: 'escolha', escolha: { indice: 1, texto: 'Parar', resumo: 'jogou o maço fora' } });
    const mesmoAno = h(4, 40, { causa: 'escolha', escolha: { indice: 0, texto: 'x', resumo: 'fez algo no mesmo ano' } });
    const tosse = h(5, 40, { causas: [1, 2, 3, 4] });
    const porId = new Map([fumou, crise, parou, mesmoAno, tosse].map((x) => [x.id, x]));
    expect(porqueDe(tosse, porId)).toEqual({ idade: 31, texto: 'você jogou o maço fora' });
    expect(porqueDe(h(6, 41, { causas: [2] }), porId)).toEqual({ idade: 30, texto: 'o país mergulhou numa crise' });
    expect(porqueDe(h(7, 41, { causas: [] }), porId)).toBeNull();
  });

  it('numa jogada, a reação agendada aponta para ela', () => {
    const e = dono(40_000_000);
    const jogada = operar(e, c, { tipo: 'jogada', id: 'conselho_que_diz_nao', escolha: 0 });
    const reacao: Entrada = { id: 999, idade: e.idade + 3, ano: e.ano + 3, tipo: 'evento', causa: 'diretor', texto: 'O conselho vetou…', causas: [jogada.id] };
    const porId = new Map([...e.historico, reacao].map((x) => [x.id, x]));
    expect(porqueDe(reacao, porId)?.texto).toBe('você deu a um conselho de fora o poder de vetar as próprias ideias');
  });
});
