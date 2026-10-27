/**
 * A rede (missão Ω): as pessoas têm identidade, não só papel. O amor que foi embora vira ex e continua existindo, com
 * a memória dele; quem chega no lugar começa do zero; o ex que volta é a mesma pessoa; e o livro fecha.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { EXES, IRMAOS } from '../src/motor/constantes.ts';
import { ganhar, lancar, novaEntrada, perder } from '../src/motor/livro.ts';
import { arquivarEx, criarPersonagem, morrerPersonagem, promover } from '../src/motor/pessoas.ts';
import { lembrancasDe, quemOcupava, visoesDe } from '../src/motor/relacoes.ts';
import { aplicarStorylet } from '../src/motor/storylets.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { quemE } from '../src/motor/campos.ts';
import { criarRng } from '../src/motor/rng.ts';
import { passo } from './apoio.ts';
import { regrasDosPersonagens } from '../src/motor/familia.ts';
import { fatorDoChefe } from '../src/motor/regras.ts';

const c = carregarConteudo();

/** Uma entrada de regra com o que `fazer` mudar (como as regras do ano fazem). */
function regra(e: EstadoVida, fazer: (reg: Mudanca[], id: number) => void): number {
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'teste', texto: '' });
  const reg: Mudanca[] = [];
  fazer(reg, entrada.id);
  lancar(e, entrada, reg);
  return entrada.id;
}

function adulto(semente: number): EstadoVida & { inicio: Map<string, Record<string, number>> } {
  const e = nascer(c, { semente, ano: 2026 }) as EstadoVida & { inicio: Map<string, Record<string, number>> };
  e.inicio = new Map(Object.values(e.entidades).map((en) => [en.id, { ...en.n }]));
  e.idade = 25;
  e.ano = e.anoNascimento + 25;
  return e;
}

function namorar(e: EstadoVida): number {
  regra(e, (reg, id) => {
    criarPersonagem(e, c, 'amor', reg);
    ganhar(e, reg, 'eu', 'namoro', id);
  });
  return e.entidades['amor']!.pessoa!;
}

function terminar(e: EstadoVida): void {
  regra(e, (reg) => {
    perder(e, reg, 'eu', 'namoro');
    arquivarEx(e, reg);
  });
}

/** Uma conversa de verdade: o que quem joga fez, que vira lembrança boa. */
function conversar(e: EstadoVida, papel: string): number {
  return aplicarStorylet(e, c, c.porId.get('conversar_de_verdade')!, papel, 'acao').id;
}

describe('a identidade das pessoas', () => {
  it('o amor que foi embora vira ex: a mesma pessoa, com a lembrança de quando era o amor', () => {
    const e = adulto(41);
    const a = namorar(e);
    const nome = e.entidades['amor']!.nome;
    const conversa = conversar(e, 'amor');
    expect(lembrancasDe(e, 'amor').boa?.entrada).toBe(conversa);
    terminar(e);
    expect(e.entidades['amor']).toBeUndefined();
    const ex = e.entidades['ex']!;
    expect(ex.pessoa).toBe(a);
    expect(ex.nome).toBe(nome);
    expect(quemE('ex', ex)).toBe(`${ex.genero === 'f' ? 'sua ex' : 'seu ex'} ${nome}`);
    expect(quemOcupava(e, 'amor', conversa)).toBe(`#${a}`);
    expect(lembrancasDe(e, 'ex').boa?.entrada).toBe(conversa);
  });

  it('quem chega no lugar do amor começa do zero: não lembra nem pensa nada pelo amor de antes', () => {
    const e = adulto(42);
    const a = namorar(e);
    const conversa = conversar(e, 'amor');
    conversar(e, 'amor');
    terminar(e);
    const b = namorar(e);
    expect(b).not.toBe(a);
    expect(lembrancasDe(e, 'amor').boa).toBeUndefined();
    const amor = e.entidades['amor']!;
    expect(visoesDe(e, 'amor', amor).filter((o) => o.entrada !== undefined && o.entrada <= conversa)).toEqual([]);
    // E o ex segue lembrando.
    expect(lembrancasDe(e, 'ex').boa?.entrada).toBeDefined();
  });

  it('o ex que volta é a mesma pessoa, e quem estava no lugar do amor vira ex', () => {
    const e = adulto(43);
    const a = namorar(e);
    const conversa = conversar(e, 'amor');
    terminar(e);
    const b = namorar(e);
    regra(e, (reg) => promover(e, c, 'ex', 'amor', reg));
    expect(e.entidades['amor']!.pessoa).toBe(a);
    expect(e.entidades['ex']!.pessoa).toBe(b);
    expect(lembrancasDe(e, 'amor').boa?.entrada).toBe(conversa);
  });

  it('com os três lugares de ex ocupados, quem foi embora há mais tempo sai da vida', () => {
    const e = adulto(44);
    const pessoas = [namorar(e)];
    for (let i = 0; i < EXES.length; i++) {
      terminar(e);
      pessoas.push(namorar(e));
    }
    terminar(e);
    const exes = EXES.map((x) => e.entidades[x]!.pessoa);
    expect(exes).not.toContain(pessoas[0]);
    expect(new Set(exes)).toEqual(new Set(pessoas.slice(1)));
  });

  it('o livro fecha: para toda entidade, o começo mais a soma das variações dá o estado final', () => {
    const e = adulto(45);
    namorar(e);
    conversar(e, 'amor');
    terminar(e);
    namorar(e);
    conversar(e, 'amor');
    regra(e, (reg) => promover(e, c, 'ex', 'amor', reg));
    terminar(e);
    const soma = new Map<string, number>();
    for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
    for (const en of Object.values(e.entidades)) {
      for (const [campo, fim] of Object.entries(en.n)) {
        const esperado = (e.inicio.get(en.id)?.[campo] ?? 0) + (soma.get(`${en.id}.${campo}`) ?? 0);
        expect(Math.abs(esperado - fim), `${en.id}.${campo}`).toBeLessThan(1e-6);
      }
    }
  });

  it('numa vida jogada, o ex aparece, vive ao fundo e o livro continua fechando', () => {
    let comEx = 0;
    for (let k = 0; k < 12; k++) {
      const e = nascer(c, { semente: 900 + k, ano: 2026 });
      const robo = criarRng(k);
      while (e.vivo) passo(e, c, robo, 'aleatoria');
      if (EXES.some((x) => e.entidades[x])) comEx++;
      // Toda pessoa da vida tem número, e cada número ocupa no máximo um papel por vez.
      const pessoas = Object.values(e.entidades).filter((en) => en.tipo === 'pessoa' && en.id !== 'eu');
      expect(pessoas.every((en) => en.pessoa !== undefined)).toBe(true);
      expect(new Set(pessoas.map((en) => en.pessoa)).size).toBe(pessoas.length);
    }
    expect(comEx).toBeGreaterThan(0);
  });
});

describe('os irmãos', () => {
  it('os mais velhos nascem com a família, do mais velho ao mais novo; os mais novos ficam para depois', () => {
    let comVelhos = 0;
    let comNovos = 0;
    for (let k = 0; k < 40; k++) {
      const e = nascer(c, { semente: 300 + k, ano: 2026 });
      const irmaos = IRMAOS.filter((x) => e.entidades[x]);
      expect(e.entidades['eu']!.n['irmaos']).toBe(irmaos.length);
      const nascimentos = irmaos.map((x) => e.entidades[x]!.nascimento!);
      expect(nascimentos.every((n) => n <= e.ano)).toBe(true);
      expect([...nascimentos].sort((a, b) => a - b)).toEqual(nascimentos);
      if (irmaos.length > 0) comVelhos++;
      if (e.agenda.some((a) => a.evento === 'irmao_nasce' && a.ano > e.ano)) comNovos++;
    }
    expect(comVelhos).toBeGreaterThan(5);
    expect(comNovos).toBeGreaterThan(5);
  });

  it('quem escolhe três irmãos tem três: os que vieram antes e os que vão nascer', () => {
    for (let k = 0; k < 20; k++) {
      const e = nascer(c, { semente: 400 + k, ano: 2026, origem: { irmaos: 3 } });
      const ja = IRMAOS.filter((x) => e.entidades[x]).length;
      const vem = e.agenda.filter((a) => a.evento === 'irmao_nasce').length;
      expect(ja + vem, `semente ${400 + k}`).toBe(3);
    }
  });

  it('o irmão mais novo nasce no ano marcado, com número, e conta como irmão', () => {
    const e = nascer(c, { semente: 410, ano: 2026, origem: { irmaos: 3 } });
    const robo = criarRng(3);
    const quando = e.agenda.find((a) => a.evento === 'irmao_nasce')?.ano;
    if (quando === undefined) return;
    const antes = e.entidades['eu']!.n['irmaos']!;
    while (e.vivo && e.ano <= quando) passo(e, c, robo, 'primeira');
    const novo = IRMAOS.map((x) => e.entidades[x]).find((x) => x?.nascimento === quando);
    expect(novo).toBeDefined();
    expect(novo!.pessoa).toBeDefined();
    expect(e.entidades['eu']!.n['irmaos']).toBe(antes + 1);
  });

  it('a herança da mãe se divide entre quem joga e os irmãos vivos, cada um na conta dele', () => {
    const e = nascer(c, { semente: 420, ano: 2026 });
    for (const x of IRMAOS) delete e.entidades[x];
    e.agenda = [];
    e.idade = 40;
    e.ano = e.anoNascimento + 40;
    regra(e, (reg) => {
      criarPersonagem(e, c, 'irmao', reg);
      criarPersonagem(e, c, 'irmao', reg);
    });
    e.entidades['eu']!.n['irmaos'] = 2;
    e.entidades['pai']!.vivo = false;
    e.entidades['mae']!.n['dinheiro'] = 300_000;
    const antes = e.entidades['eu']!.n['dinheiro'] ?? 0;
    let parte = 0;
    regra(e, (reg, id) => {
      parte = morrerPersonagem(e, 'mae', reg, id);
    });
    expect(parte).toBeCloseTo(100_000, 0);
    expect((e.entidades['eu']!.n['dinheiro'] ?? 0) - antes).toBeCloseTo(100_000, 0);
    expect(e.entidades['irmao']!.n['dinheiro']).toBeCloseTo(100_000, 0);
    expect(e.entidades['irmao2']!.n['dinheiro']).toBeCloseTo(100_000, 0);
  });

  it('quem herda leva os irmãos: o outro filho vivo vira irmão na vida nova', () => {
    const e = nascer(c, { semente: 430, ano: 2026 });
    e.idade = 62;
    e.ano = e.anoNascimento + 62;
    regra(e, (reg) => {
      criarPersonagem(e, c, 'filho', reg);
      criarPersonagem(e, c, 'filho', reg);
    });
    e.entidades['filho']!.nascimento = e.ano - 34;
    e.entidades['filho2']!.nascimento = e.ano - 31;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades['eu']!.nome).toBe(e.entidades['filho']!.nome);
    expect(h.entidades['irmao']?.nome).toBe(e.entidades['filho2']!.nome);
    expect(h.entidades['eu']!.n['irmaos']).toBe(1);
    expect(h.entidades['irmao']!.pessoa).toBeDefined();
  });

  it('o sobrinho é filho de um irmão de verdade, que vira o pai ou a mãe na vida nova', () => {
    const e = nascer(c, { semente: 440, ano: 2026 });
    for (const x of IRMAOS) delete e.entidades[x];
    e.idade = 66;
    e.ano = e.anoNascimento + 66;
    regra(e, (reg) => criarPersonagem(e, c, 'irmao', reg));
    const irmao = e.entidades['irmao']!;
    irmao.nascimento = e.ano - 63;
    irmao.n['filhos'] = 2;
    e.entidades['eu']!.n['irmaos'] = 1;
    morrer(e, c);
    const herdeiro = herdeiroPossivel(e, c)!;
    expect(herdeiro.parentesco).toBe('sobrinho');
    expect(herdeiro.de).toBe('irmao');
    expect(e.ano - herdeiro.nascimento).toBeLessThanOrEqual(63 - 16);
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades[irmao.genero === 'f' ? 'mae' : 'pai']!.nome).toBe(irmao.nome);
  });
});

describe('o colega e o chefe', () => {
  function empregado(semente: number): EstadoVida {
    const e = nascer(c, { semente, ano: 2026 });
    e.agenda = [];
    e.idade = 30;
    e.ano = e.anoNascimento + 30;
    const eu = e.entidades['eu']!;
    eu.t['ocupacao'] = 'analista de sistemas';
    eu.n['renda'] = 60000;
    return e;
  }
  const ano = (e: EstadoVida): void => {
    regra(e, (reg) => regrasDosPersonagens(e, c, reg));
  };

  it('chegam com o emprego, ficam na promoção, trocam com o emprego novo e saem com o fim do trabalho', () => {
    const e = empregado(501);
    ano(e);
    const colega = e.entidades['colega']!;
    const chefe = e.entidades['chefe']!;
    expect(colega.t['trabalho']).toBe('analista de sistemas');
    expect(chefe.nascimento!).toBeLessThan(e.ano - e.idade);
    e.entidades['eu']!.n['nivel'] = 2;
    ano(e);
    expect(e.entidades['colega']!.pessoa).toBe(colega.pessoa);
    e.entidades['eu']!.t['ocupacao'] = 'gerente de loja';
    colega.n['vinculo'] = 30;
    ano(e);
    expect(e.entidades['colega']!.pessoa).not.toBe(colega.pessoa);
    expect(e.entidades['chefe']!.pessoa).not.toBe(chefe.pessoa);
    e.entidades['eu']!.n['renda'] = 0;
    ano(e);
    expect(e.entidades['colega']).toBeUndefined();
    expect(e.entidades['chefe']).toBeUndefined();
  });

  it('quem é dono do negócio tem colega, não chefe', () => {
    const e = empregado(502);
    e.entidades['eu']!.q['empreendedor'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    ano(e);
    expect(e.entidades['colega']).toBeDefined();
    expect(e.entidades['chefe']).toBeUndefined();
  });

  it('o colega muito próximo vira o melhor amigo quando o emprego acaba, se o lugar estiver vago', () => {
    const e = empregado(503);
    delete e.entidades['amigo'];
    ano(e);
    const colega = e.entidades['colega']!;
    colega.n['vinculo'] = 80;
    e.entidades['eu']!.n['renda'] = 0;
    ano(e);
    expect(e.entidades['amigo']?.pessoa).toBe(colega.pessoa);
    expect(e.entidades['amigo']?.nome).toBe(colega.nome);
    expect(e.historico.some((h) => h.ref === 'regra:virou_amigo')).toBe(true);
  });

  it('o chefe pesa na promoção e na demissão: neutro com 50 de vínculo, a favor com afeto, contra com mágoa', () => {
    expect(fatorDoChefe(50, 0)).toEqual({ promocao: 1, demissao: 1 });
    expect(fatorDoChefe(90, 0).promocao).toBeGreaterThan(1.2);
    expect(fatorDoChefe(90, 0).demissao).toBeLessThan(0.8);
    expect(fatorDoChefe(40, 40).promocao).toBeLessThan(0.7);
    expect(fatorDoChefe(40, 40).demissao).toBeGreaterThan(1.4);
  });
});
