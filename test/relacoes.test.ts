import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { lerCaminho } from '../src/motor/campos.ts';
import { humorDaIniciativa, regrasDosPersonagens } from '../src/motor/familia.ts';
import { ganhar, lancar, novaEntrada, somar } from '../src/motor/livro.ts';
import { criarPersonagem, morrerPersonagem } from '../src/motor/pessoas.ts';
import { convivem, deQuando, gostoDe, humorDe, lembrancasDe, porqueDe, semONome, visaoDe, visoesDe } from '../src/motor/relacoes.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { acoesComPessoa, agir, fichasUsadas } from '../src/motor/acoes.ts';
import { criarRng } from '../src/motor/rng.ts';
import { aplicarStorylet } from '../src/motor/storylets.ts';
import { nascer } from '../src/motor/vida.ts';
import { passo, viverAteOFim } from './apoio.ts';

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

  it('dá para fazer algo com cada pessoa, não só com a que o verbo escolheria (e gasta a ficha)', () => {
    const e = nascer(c, { semente: 12, ano: 2026 });
    const robo = criarRng(12);
    while (e.vivo && (e.idade < 30 || e.pendente)) passo(e, c, robo, 'cautelosa');
    const pessoas = ['mae', 'pai', 'amigo'].filter((p) => acoesComPessoa(e, c, p).length > 0);
    expect(pessoas.length).toBeGreaterThan(1);
    const quem = pessoas.at(-1)!;
    const acao = acoesComPessoa(e, c, quem)[0]!;
    const antes = fichasUsadas(e);
    const entrada = agir(e, c, 'familia', { id: acao.s.id, ator: quem });
    expect(entrada.ator).toBe(quem);
    expect(fichasUsadas(e)).toBe(antes + 1);
    // A mesma ação com a mesma pessoa não se repete no ano.
    expect(acoesComPessoa(e, c, quem).some((o) => o.s.id === acao.s.id)).toBe(false);
  });

  it('numa vida inteira, a relação anda: mágoa, confiança e anos sem contato mudam, e o livro fecha', () => {
    const e = viverAteOFim(nascer(c, { semente: 31, ano: 2026 }), c, 31, 'aleatoria');
    const caminhos = new Set(e.historico.flatMap((h) => (h.mudancas ?? []).map((m) => m.c.split('.')[1])));
    expect(caminhos.has('magoa')).toBe(true);
    expect(caminhos.has('confianca')).toBe(true);
    expect(caminhos.has('sem_contato')).toBe(true);
  });
});

describe('o que cada pessoa acha de você', () => {
  /** Quem joga deu dinheiro à pessoa (uma escolha), aos `idade`. */
  function deu(e: EstadoVida, id: string, valor: number, resumo: string): number {
    const h = novaEntrada(e, { tipo: 'evento', causa: 'escolha', texto: 'x' });
    h.escolha = { indice: 0, texto: 'x', resumo };
    lancar(e, h, [
      { c: 'eu.dinheiro', d: -valor, p: id },
      { c: `${id}.dinheiro`, d: valor, p: 'eu' },
      { c: `${id}.vinculo`, d: 4 },
    ]);
    return h.id;
  }

  it('quem recebeu ajuda acha você generoso, e o porquê é a ajuda', () => {
    const e = adulto();
    const id = deu(e, 'amigo', 3000, 'pagou o conserto do carro de ' + e.entidades['amigo']!.nome);
    const amigo = e.entidades['amigo']!;
    const ops = visoesDe(e, 'amigo', amigo);
    expect(ops.map((o) => o.visao)).toContain('generoso');
    const generoso = ops.find((o) => o.visao === 'generoso')!;
    expect(generoso.entrada).toBe(id);
    expect(porqueDe(e, 'amigo', amigo, generoso)).toBe(`você pagou o conserto do carro ${amigo.genero === 'f' ? 'dela' : 'dele'}, aos 30`);
  });

  it('anos sem se falar fazem a pessoa achar você sumido; rico e famoso, metido', () => {
    const e = adulto();
    const pai = e.entidades['pai']!;
    pai.n['sem_contato'] = 6;
    expect(visaoDe(e, 'pai', pai)).toBe('sumido');
    expect(porqueDe(e, 'pai', pai, visoesDe(e, 'pai', pai)[0]!)).toBe('faz 6 anos que vocês não se falam');
    e.entidades['eu']!.n['fama'] = 70;
    expect(visaoDe(e, 'pai', pai)).toBe('metido');
  });

  it('a opinião sai do livro: igual numa cópia salva e lida (sem a soma guardada)', () => {
    const e = viverAteOFim(nascer(c, { semente: 44, ano: 2026 }), c, 44, 'aleatoria');
    const lida: EstadoVida = JSON.parse(JSON.stringify(e));
    for (const id of ['mae', 'pai', 'amigo', 'amor', 'filho']) {
      const en = e.entidades[id];
      if (!en) continue;
      expect(visoesDe(lida, id, lida.entidades[id]!)).toEqual(visoesDe(e, id, en));
    }
  });

  it('o antigo pesa menos: a mesma ajuda, trinta anos depois, já não faz ninguém achar você generoso', () => {
    const e = adulto();
    deu(e, 'amigo', 3000, 'emprestou dinheiro');
    e.idade += 30;
    e.ano += 30;
    expect(visoesDe(e, 'amigo', e.entidades['amigo']!).map((o) => o.visao)).not.toContain('generoso');
  });

  it('a visão muda o que a pessoa faz: quem acha você sumido ajuda menos; quem acha você cabeça-quente briga mais', () => {
    const e = adulto();
    const mae = e.entidades['mae']!;
    expect(humorDaIniciativa(mae, 'ajuda', 'sumido')).toBeLessThan(humorDaIniciativa(mae, 'ajuda', ''));
    expect(humorDaIniciativa(mae, 'briga', 'cabeca_quente')).toBeGreaterThan(humorDaIniciativa(mae, 'briga', ''));
  });
});

describe('o que você deixou de fazer', () => {
  function maeDoente(): EstadoVida {
    const e = adulto();
    const reg: Mudanca[] = [];
    ganhar(e, reg, 'mae', 'doente', null);
    e.entidades['mae']!.q['doente']!.idade = e.idade - 1;
    e.entidades['mae']!.n['vinculo'] = 70;
    e.entidades['mae']!.n['sem_contato'] = 1;
    return e;
  }

  it('alguém próximo passa o ano doente e você não aparece: a falta vira entrada, mágoa e a pior lembrança', () => {
    const e = maeDoente();
    regrasDosPersonagens(e, c, []);
    const falta = e.historico.find((h) => h.ref === 'regra:nao_apareceu');
    expect(falta?.ator).toBe('mae');
    expect(e.entidades['mae']!.n['magoa'] ?? 0).toBeGreaterThan(15);
    expect(e.entidades['mae']!.q['nao_apareceu']).toBeDefined();
    expect(deQuando(e, 'mae', e.entidades['mae']!, 'ruim')).toBe('de quando você não apareceu quando ela estava doente, aos 30');
    // Uma vez por doença.
    regrasDosPersonagens(e, c, []);
    expect(e.historico.filter((h) => h.ref === 'regra:nao_apareceu')).toHaveLength(1);
  });

  it('quem visitou no ano não falta', () => {
    const e = maeDoente();
    e.entidades['mae']!.n['sem_contato'] = 0;
    regrasDosPersonagens(e, c, []);
    expect(e.historico.some((h) => h.ref === 'regra:nao_apareceu')).toBe(false);
  });
});

describe('o que cada pessoa quer', () => {
  it('a vontade de casar se realiza com o casamento, e a entrada aponta de onde ela veio', () => {
    const e = adulto();
    const reg: Mudanca[] = [];
    criarPersonagem(e, c, 'amor', reg);
    const pedido = lancar(e, novaEntrada(e, { tipo: 'npc', causa: 'npc', texto: 'x' }), []);
    ganhar(e, reg, 'amor', 'quer_casar', pedido.id);
    ganhar(e, reg, 'eu', 'casado', null);
    regrasDosPersonagens(e, c, []);
    const feita = e.historico.find((h) => h.ref === 'regra:vontade_realizada');
    expect(feita?.causas).toContain(pedido.id);
    expect(e.entidades['amor']!.q['quer_casar']).toBeUndefined();
  });

  it('a vontade antiga com pressa vira mágoa a cada ano', () => {
    const e = adulto();
    const reg: Mudanca[] = [];
    criarPersonagem(e, c, 'amor', reg);
    ganhar(e, reg, 'eu', 'namoro', null);
    ganhar(e, reg, 'amor', 'quer_casar', null);
    e.entidades['amor']!.q['quer_casar']!.idade = e.idade - 5;
    regrasDosPersonagens(e, c, []);
    expect(e.entidades['amor']!.n['magoa'] ?? 0).toBeGreaterThan(0);
  });

  it('a vontade da infância passa com a idade, e a falta fica', () => {
    const e = adulto();
    const reg: Mudanca[] = [];
    const filho = { ...e.entidades['mae']!, id: 'filho', nome: 'Davi', genero: 'm' as const, nascimento: e.ano - 15, q: {}, n: { vinculo: 60, saude: 90 }, t: {} };
    e.entidades['filho'] = filho;
    ganhar(e, reg, 'filho', 'quer_um_bicho', null);
    regrasDosPersonagens(e, c, []);
    const perdida = e.historico.find((h) => h.ref === 'regra:vontade_perdida');
    expect(perdida?.resumo).toBe('você nunca deu o bicho que Davi pedia');
    expect(deQuando(e, 'filho', e.entidades['filho']!, 'ruim')).toBe('de quando você nunca deu o bicho que ele pedia, aos 30');
  });

  it('quem morre com a vontade guardada deixa remorso, e a morte diz o que faltou', () => {
    const e = adulto();
    const reg: Mudanca[] = [];
    ganhar(e, reg, 'mae', 'quer_o_mar', null);
    e.entidades['mae']!.n['vinculo'] = 60;
    morrerPersonagem(e, 'mae', [], 1);
    expect(e.entidades['eu']!.q['remorso']).toBeDefined();
  });
});

