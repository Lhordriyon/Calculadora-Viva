import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { regraDaCarreira } from '../src/motor/carreira.ts';
import { ganhar } from '../src/motor/livro.ts';
import { anoDosProjetos, diaDoSonho, E_AGORA, PASTA_DO_SONHO, projetosAtivos, qualidadeDoProjeto, SONHO_QUE_FICOU } from '../src/motor/projetos.ts';
import { criarRng } from '../src/motor/rng.ts';
import { apresentarStorylet, elegivel } from '../src/motor/storylets.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { sonhosDaVida } from '../src/motor/virada.ts';
import { escolher, morrer, nascer } from '../src/motor/vida.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';

const c = conteudo;

/** Um adolescente de 15 anos, sem nenhum projeto de pé. */
function adolescente(semente = 81): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 15;
  e.ano = e.anoNascimento + 15;
  const eu = e.entidades['eu']!;
  for (const q of Object.keys(eu.q)) if (q.startsWith('projeto_')) delete eu.q[q];
  return e;
}

function responderMarco(e: EstadoVida, indice: number): void {
  apresentarStorylet(e, c.porId.get('o_que_voce_quer_da_vida')!, undefined, 'diretor', []);
  escolher(e, c, indice);
}

describe('o sonho da vida (bloco S1)', () => {
  it('o marco dos 15 começa o sonho, com a escolha de causa; "ainda não sei" não começa nada', () => {
    const e = adolescente();
    responderMarco(e, 0);
    const escolha = e.historico.at(-1)!;
    expect(escolha.causa).toBe('escolha');
    expect(e.entidades['eu']!.q[qualidadeDoProjeto('estrela')]?.causa).toBe(escolha.id);
    expect(projetosAtivos(e, c).map((p) => p.def.id)).toEqual(['estrela']);
    expect(sonhosDaVida(e, c)).toEqual(['Virar estrela, de pé']);

    const indeciso = adolescente();
    responderMarco(indeciso, 3);
    expect(projetosAtivos(indeciso, c)).toEqual([]);
    expect(sonhosDaVida(indeciso, c)).toEqual([]);
  });

  it('sonhar não repete o sonho de pé', () => {
    const e = adolescente(82);
    responderMarco(e, 1);
    const antes = e.entidades['eu']!.q[qualidadeDoProjeto('imperio')]!.causa;
    apresentarStorylet(e, c.porId.get('o_que_voce_quer_da_vida')!, undefined, 'diretor', []);
    escolher(e, c, 1);
    expect(e.entidades['eu']!.q[qualidadeDoProjeto('imperio')]!.causa).toBe(antes);
  });

  it('a meta alcançada vira conquista no livro, e o cartão conta "realizado aos N"', () => {
    const e = adolescente(83);
    responderMarco(e, 0);
    e.idade = 34;
    e.ano = e.anoNascimento + 34;
    e.entidades['eu']!.n['fama'] = 85;
    anoDosProjetos(e, c);
    const fim = e.historico.at(-1)!;
    expect(fim.instancia).toBe('projeto:estrela#conquista');
    expect(fim.ref).toBe('regra:projeto_conquista');
    expect(projetosAtivos(e, c)).toEqual([]);
    expect(sonhosDaVida(e, c)).toEqual(['Virar estrela, realizado aos 34']);
  });

  it('as cenas do sonho só aparecem para quem sonha', () => {
    const e = adolescente(84);
    e.idade = 18;
    e.entidades['eu']!.n['fama'] = 0;
    const palco = c.porId.get('o_primeiro_palco')!;
    expect(elegivel(palco, e, undefined)).toBe(false);
    responderMarco(e, 0);
    expect(elegivel(palco, e, undefined)).toBe(true);
  });

  it('a garra do sonho: quem sonha em virar estrela sobe no palco com o dobro da chance', () => {
    const promovidos = (sonha: boolean): number => {
      let n = 0;
      for (let i = 0; i < 400; i++) {
        const e = adolescente(90);
        e.idade = 22;
        e.rng = criarRng(1000 + i);
        delete e.entidades['chefe'];
        const eu = e.entidades['eu']!;
        Object.assign(eu.n, { renda: 2000, nivel: 0, aparencia: 60 });
        eu.t['carreira'] = 'cantor';
        delete eu.t['cargo'];
        if (sonha) ganhar(e, [], 'eu', qualidadeDoProjeto('estrela'), null);
        regraDaCarreira(e, c, []);
        if (eu.n['nivel'] === 1) n++;
      }
      return n;
    };
    const sem = promovidos(false);
    const com = promovidos(true);
    expect(sem).toBeGreaterThan(20);
    expect(com / sem).toBeGreaterThan(1.6);
    expect(com / sem).toBeLessThan(2.4);
  });
});

describe('o segundo ato (bloco S2)', () => {
  /** Quem sonhou com a estrela aos 15 e chega à fama do sonho aos 34. */
  function estrelaRealizada(semente = 91): EstadoVida {
    const e = adolescente(semente);
    responderMarco(e, 0);
    e.idade = 34;
    e.ano = e.anoNascimento + 34;
    e.entidades['eu']!.n['fama'] = 85;
    anoDosProjetos(e, c);
    return e;
  }

  it('o sonho realizado agenda o dia do sonho no mesmo ano e o "e agora?" no seguinte, com a conquista de causa', () => {
    const e = estrelaRealizada();
    const fim = e.historico.at(-1)!;
    expect(fim.instancia).toBe('projeto:estrela#conquista');
    expect(e.agenda).toContainEqual({ evento: diaDoSonho('estrela'), ano: e.ano, origem: fim.id });
    expect(e.agenda).toContainEqual({ evento: E_AGORA, ano: e.ano + 1, origem: fim.id });
  });

  it('o sonho que não veio agenda "o sonho que ficou" no ano seguinte', () => {
    const e = adolescente(92);
    responderMarco(e, 0);
    const def = c.mundo.projetos.find((p) => p.id === 'estrela')!;
    e.ano += def.prazo;
    e.idade += def.prazo;
    anoDosProjetos(e, c);
    const fim = e.historico.at(-1)!;
    expect(fim.instancia).toBe('projeto:estrela#vencido');
    expect(e.agenda).toContainEqual({ evento: SONHO_QUE_FICOU, ano: e.ano + 1, origem: fim.id });
    expect(e.agenda.some((a) => a.evento === diaDoSonho('estrela'))).toBe(false);
  });

  it('o "e agora?" começa outro sonho com a escolha de causa; sem filhos, os netos ficam bloqueados', () => {
    const e = estrelaRealizada(93);
    for (const f of Object.keys(e.entidades)) if (f.startsWith('filho')) delete e.entidades[f];
    delete e.entidades['eu']!.q['pai_mae'];
    apresentarStorylet(e, c.porId.get(E_AGORA)!, undefined, 'diretor', []);
    expect(e.pendente!.opcoes[2]!.disponivel).toBe(false);
    escolher(e, c, 1);
    const escolha = e.historico.at(-1)!;
    expect(e.entidades['eu']!.q[qualidadeDoProjeto('lugar_no_mundo')]?.causa).toBe(escolha.id);
  });

  it('o cartão conta como foi o dia do sonho', () => {
    const e = estrelaRealizada(94);
    apresentarStorylet(e, c.porId.get(diaDoSonho('estrela'))!, undefined, 'diretor', []);
    escolher(e, c, 2);
    expect(sonhosDaVida(e, c)).toEqual(['Virar estrela, realizado aos 34: no dia, chamou ao palco quem tinha duvidado do sonho']);
  });
});

describe('o sonho que passa adiante (bloco S3)', () => {
  /** Quem sonhou com a estrela aos 15, não chegou lá e tem um filho de 20 anos. */
  function sonhoQueFicou(semente = 95): EstadoVida {
    const e = adolescente(semente);
    responderMarco(e, 0);
    const def = c.mundo.projetos.find((p) => p.id === 'estrela')!;
    e.ano += def.prazo;
    e.idade += def.prazo;
    anoDosProjetos(e, c);
    ganhar(e, [], 'eu', 'pai_mae', null);
    const id = criarPersonagem(e, c, 'filho', [])!;
    e.entidades[id]!.nascimento = e.ano - 20;
    return e;
  }

  it('contar o sonho que ficou entrega ao filho mais velho o sonho que não veio', () => {
    const e = sonhoQueFicou();
    apresentarStorylet(e, c.porId.get(SONHO_QUE_FICOU)!, undefined, 'diretor', []);
    expect(e.pendente!.opcoes[2]!.disponivel).toBe(true);
    escolher(e, c, 2);
    expect(e.entidades['filho']!.t['sonho']).toBe('estrela');
  });

  it('quem herda começa a vida com o sonho, a abertura conta, e o cartão diz de quem era', () => {
    const e = sonhoQueFicou(96);
    apresentarStorylet(e, c.porId.get(SONHO_QUE_FICOU)!, undefined, 'diretor', []);
    escolher(e, c, 2);
    const pai = e.entidades['eu']!.nome;
    morrer(e, c);
    const nova = continuarComoHerdeiro(e, c);
    const abertura = nova.historico[0]!;
    expect(nova.entidades['eu']!.q[qualidadeDoProjeto('estrela')]?.causa).toBe(abertura.id);
    expect(abertura.texto).toContain('deixou um sonho para você terminar: virar estrela');
    expect(sonhosDaVida(nova, c)).toEqual([`Virar estrela (o sonho de ${pai}), de pé`]);
  });

  it('sem filhos, não há a quem contar', () => {
    const e = adolescente(97);
    responderMarco(e, 0);
    apresentarStorylet(e, c.porId.get(SONHO_QUE_FICOU)!, undefined, 'diretor', []);
    expect(e.pendente!.opcoes[2]!.disponivel).toBe(false);
  });

  it('a herança vira cena: no primeiro ano, quem herdou acha a pasta do sonho', () => {
    const e = sonhoQueFicou(98);
    apresentarStorylet(e, c.porId.get(SONHO_QUE_FICOU)!, undefined, 'diretor', []);
    escolher(e, c, 2);
    morrer(e, c);
    const nova = continuarComoHerdeiro(e, c);
    expect(nova.agenda).toContainEqual({ evento: PASTA_DO_SONHO, ano: nova.ano, origem: nova.historico[0]!.id });
  });

  it('o sonho herdado que se realiza lembra de quem era', () => {
    const e = sonhoQueFicou(99);
    apresentarStorylet(e, c.porId.get(SONHO_QUE_FICOU)!, undefined, 'diretor', []);
    escolher(e, c, 2);
    const pai = e.entidades['eu']!.nome;
    morrer(e, c);
    const nova = continuarComoHerdeiro(e, c);
    nova.entidades['eu']!.n['fama'] = 85;
    anoDosProjetos(nova, c);
    const fim = nova.historico.at(-1)!;
    expect(fim.instancia).toBe('projeto:estrela#conquista');
    expect(fim.texto).toContain(`Era o sonho de ${pai}, e agora é história.`);
  });
});

describe('o caminho do sonho à vista (bloco S3)', () => {
  it('cada etapa nova vira uma linha ✦ na linha do tempo, uma vez só', () => {
    const e = adolescente(100);
    responderMarco(e, 0);
    const eu = e.entidades['eu']!;
    eu.t['carreira'] = 'cantor';
    eu.n['fama'] = 25;
    e.ano += 1;
    e.idade += 1;
    anoDosProjetos(e, c);
    const linha = e.historico.at(-1)!;
    expect(linha.instancia).toBe('projeto:estrela#etapas2');
    expect(linha.texto).toBe('✦ Virar estrela: gente que sabe quem você é. 2 de 3 etapas do sonho.');
    const antes = e.historico.length;
    anoDosProjetos(e, c);
    expect(e.historico.length).toBe(antes);
    eu.n['fama'] = 45;
    anoDosProjetos(e, c);
    expect(e.historico.at(-1)!.texto).toBe('✦ Virar estrela: gente parando você na rua para uma foto. 3 de 3 etapas do sonho; agora falta só ele.');
  });
});
