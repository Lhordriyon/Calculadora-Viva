import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { papelBase } from '../src/motor/constantes.ts';
import { decidir, porqueDaResposta } from '../src/motor/decisao.ts';
import { escolherDoAno } from '../src/motor/diretor.ts';
import { regrasDosPersonagens } from '../src/motor/familia.ts';
import { ganhar, lancar, novaEntrada, perder } from '../src/motor/livro.ts';
import { arquivarEx, criarPersonagem } from '../src/motor/pessoas.ts';
import { lembrancasDe, visoesDe } from '../src/motor/relacoes.ts';
import { anoDosSegredos, REF_SOUBE, sabeDe, segredosAtivos } from '../src/motor/segredos.ts';
import { apresentarStorylet, escolher } from '../src/motor/storylets.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

function regra(e: EstadoVida, fazer: (reg: Mudanca[], id: number) => void): number {
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'teste', texto: '' });
  const reg: Mudanca[] = [];
  fazer(reg, entrada.id);
  lancar(e, entrada, reg);
  return entrada.id;
}

/** Um adulto de 30 anos, empregado (com colega e chefe), namorando, com a mãe viva e uma irmã adulta. */
function cenario(semente: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 30;
  e.ano = e.anoNascimento + 30;
  const eu = e.entidades['eu']!;
  eu.t['ocupacao'] = 'analista de sistemas';
  eu.n['renda'] = 60000;
  eu.n['divida'] = 0;
  regra(e, (reg) => regrasDosPersonagens(e, c, reg));
  regra(e, (reg, id) => {
    if (!e.entidades['amor']) criarPersonagem(e, c, 'amor', reg);
    ganhar(e, reg, 'eu', 'namoro', id);
    if (!e.entidades['irmao']) criarPersonagem(e, c, 'irmao', reg);
  });
  // Ninguém morre nem fica doente no teste: só o segredo anda.
  for (const id of ['mae', 'pai', 'amor', 'irmao']) {
    const en = e.entidades[id];
    if (!en) continue;
    en.vivo = true;
    delete en.q['ausente'];
    Object.assign(en.n, { vinculo: 50, magoa: 0, confianca: 0, sem_contato: 0 });
  }
  e.entidades['irmao']!.nascimento = e.ano - 27;
  return e;
}

/** O caso escondido do amor; quem sabe, de saída. */
function segredo(e: EstadoVida, quem: string[]): number {
  return regra(e, (reg, id) => {
    ganhar(e, reg, 'amor', 'escondido_caso', id);
    for (const q of quem) ganhar(e, reg, q, sabeDe('caso'), id);
  });
}

function anos(e: EstadoVida, n: number): void {
  for (let i = 0; i < n; i++) {
    e.ano += 1;
    e.idade += 1;
    anoDosSegredos(e, c);
    if (e.agenda.some((a) => a.evento === 'contaram_do_caso')) return;
  }
}

describe('os segredos (Ω4)', () => {
  it('o segredo que ninguém sabe não muda opinião nenhuma, nem a confiança de ninguém', () => {
    const e = cenario(11);
    const antes = Object.fromEntries(['mae', 'amor', 'irmao'].map((id) => [id, { ...e.entidades[id]!.n }]));
    segredo(e, []);
    anos(e, 30);
    expect(e.historico.some((h) => h.ref === REF_SOUBE)).toBe(false);
    expect(e.agenda.some((a) => a.evento === 'contaram_do_caso')).toBe(false);
    for (const id of ['mae', 'amor', 'irmao']) {
      expect(e.entidades[id]!.n['confianca']).toBe(antes[id]!['confianca']);
      expect(visoesDe(e, id, e.entidades[id]!)).toEqual([]);
    }
    expect(segredosAtivos(e, c).map((s) => [s.def.id, s.sabem])).toEqual([['caso', []]]);
  });

  it('o que a irmã sabe chega à família e ao par, nunca ao chefe nem ao colega (não há caminho)', () => {
    const souberam = new Set<string>();
    let chegou = 0;
    for (let s = 0; s < 30; s++) {
      const e = cenario(100 + s);
      e.entidades['irmao']!.t['traco'] = 'piadista';
      segredo(e, ['irmao']);
      anos(e, 20);
      for (const h of e.historico) if (h.ref === REF_SOUBE) souberam.add(papelBase(h.ator!));
      if (e.agenda.some((a) => a.evento === 'contaram_do_caso' && a.fonte)) chegou++;
    }
    expect([...souberam].some((p) => p === 'mae' || p === 'pai' || p === 'avo')).toBe(true);
    expect(souberam.has('chefe')).toBe(false);
    expect(souberam.has('colega')).toBe(false);
    expect(chegou).toBeGreaterThan(5);
  });

  it('quem fica sabendo perde confiança em você, e lembra disso como coisa que você fez', () => {
    for (let s = 0; s < 40; s++) {
      const e = cenario(300 + s);
      e.entidades['irmao']!.t['traco'] = 'piadista';
      const origem = segredo(e, ['irmao']);
      anos(e, 25);
      const h = e.historico.find((x) => x.ref === REF_SOUBE);
      if (!h) continue;
      const quem = h.ator!;
      expect(h.causas).toEqual([origem]);
      expect(h.texto.length).toBeGreaterThan(20);
      expect(h.resumo).toMatch(/^você viu o caso chegar aos ouvidos de /);
      expect(e.entidades[quem]!.q[sabeDe('caso')]?.causa).toBe(h.id);
      expect(e.entidades[quem]!.n['confianca']).toBeLessThanOrEqual(-12);
      expect(lembrancasDe(e, quem).ruim?.entrada).toBe(h.id);
      expect(visoesDe(e, quem, e.entidades[quem]!).find((o) => o.visao === 'sem_palavra')?.entrada).toBe(h.id);
      return;
    }
    throw new Error('em 40 vidas, a notícia nunca chegou a ninguém além do par');
  });

  it('quando chega ao alvo, a revelação vem no mesmo ano, com quem contou no texto e na causa', () => {
    for (let s = 0; s < 40; s++) {
      const e = cenario(500 + s);
      e.entidades['irmao']!.t['traco'] = 'piadista';
      const origem = segredo(e, ['irmao']);
      anos(e, 25);
      const item = e.agenda.find((a) => a.evento === 'contaram_do_caso');
      if (!item || item.fonte !== 'irmao') continue;
      expect(item).toMatchObject({ ano: e.ano, ator: 'amor', origem });
      const x = escolherDoAno(e, c, undefined, []);
      expect(x?.s.id).toBe('contaram_do_caso');
      expect(x?.fonte).toBe('irmao');
      apresentarStorylet(e, x!.s, x!.ator, x!.causa, x!.causas, undefined, x!.fonte);
      expect(e.pendente?.texto).toContain(e.entidades['irmao']!.nome);
      expect(e.pendente?.causas).toContain(origem);
      expect(e.pendente?.fonte).toBe('irmao');
      escolher(e, c, 0);
      expect(e.entidades['amor']!.q['escondido_caso']).toBeUndefined();
      // O segredo que veio à tona acaba: ninguém mais "sabe" de nada.
      anoDosSegredos(e, c);
      expect(e.entidades['irmao']!.q[sabeDe('caso')]).toBeUndefined();
      expect(e.historico.at(-1)!.ref).toBe('regra:segredo_acabou');
      return;
    }
    throw new Error('em 40 vidas, a irmã nunca contou ao par');
  });

  it('o segredo que perde o alvo acaba calado; a dívida escondida também, quando é paga antes de alguém descobrir', () => {
    const e = cenario(3);
    segredo(e, ['irmao']);
    regra(e, (reg) => {
      perder(e, reg, 'eu', 'namoro');
      arquivarEx(e, reg);
    });
    anoDosSegredos(e, c);
    expect(Object.values(e.entidades).some((en) => en.q['escondido_caso'] || en.q[sabeDe('caso')])).toBe(false);
    expect(e.historico.at(-1)).toMatchObject({ tipo: 'regra', ref: 'regra:segredo_acabou', texto: '' });

    const d = cenario(4);
    d.entidades['eu']!.n['divida'] = 9000;
    regra(d, (reg, id) => {
      ganhar(d, reg, 'amor', 'escondido_divida', id);
      ganhar(d, reg, 'irmao', sabeDe('divida'), id);
    });
    anoDosSegredos(d, c);
    expect(segredosAtivos(d, c).map((s) => s.def.id)).toContain('divida');
    d.entidades['eu']!.n['divida'] = 0;
    anoDosSegredos(d, c);
    expect(segredosAtivos(d, c).map((s) => s.def.id)).not.toContain('divida');
    expect(d.entidades['irmao']!.q[sabeDe('divida')]).toBeUndefined();
  });

  it('quem sabe pesa o segredo no pedido, e o porquê diz o que ela sabe', () => {
    const e = cenario(7);
    const sem = decidir(e, c, 'mae', 'favor');
    const id = segredo(e, ['mae']);
    const com = decidir(e, c, 'mae', 'favor');
    expect(com.chance).toBeLessThan(sem.chance);
    expect(com.motivos.find((m) => m.tipo === 'sabe')).toMatchObject({ entrada: id, segredo: 'do caso' });
    expect(porqueDaResposta(e, c, 'mae', 'favor', com, false).texto).toBe('porque sabe do caso');
  });
});
