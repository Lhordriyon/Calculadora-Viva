import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { capitulosDe, capitulosDoCartao } from '../src/motor/capitulos.ts';
import { operar } from '../src/motor/carteira.ts';
import { ganhar, lancar, novaEntrada, perder } from '../src/motor/livro.ts';
import { arquivarEx, criarPersonagem, promover } from '../src/motor/pessoas.ts';
import { anoDosProjetos } from '../src/motor/projetos.ts';
import { aplicarStorylet } from '../src/motor/storylets.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

function adulto(semente = 5): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 30;
  e.ano = e.anoNascimento + 30;
  const eu = e.entidades['eu']!;
  Object.assign(eu.n, { dinheiro: 10_000, divida: 0 });
  for (const q of ['casa_propria', 'namoro', 'casado']) delete eu.q[q];
  e.entidades['mae']!.vivo = true;
  return e;
}

/** Quem joga fez alguma coisa (o livro guarda o resumo e o que mudou). */
function fez(e: EstadoVida, resumo: string, mudar: (reg: Mudanca[], id: number) => void): number {
  const entrada = novaEntrada(e, { tipo: 'acao', causa: 'acao', ref: 'teste', texto: resumo, resumo });
  const reg: Mudanca[] = [];
  mudar(reg, entrada.id);
  lancar(e, entrada, reg);
  return entrada.id;
}

function anos(e: EstadoVida, n: number): void {
  e.ano += n;
  e.idade += n;
}

describe('os capítulos da vida (Ω5)', () => {
  it('o plano: o começo e a conquista viram um capítulo, com o nome do plano e a frase dos dois momentos', () => {
    const e = adulto();
    const comeco = operar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' }).id;
    anos(e, 11);
    ganhar(e, [], 'eu', 'casa_propria', null);
    anoDosProjetos(e, c);
    const fim = e.historico.at(-1)!.id;
    expect(capitulosDe(e, c)).toEqual([
      {
        tipo: 'plano',
        titulo: 'A casa própria',
        de: 30,
        ate: 41,
        comeco,
        fim,
        texto: 'Aos 30, você pôs na cabeça comprar a casa própria; aos 41, conquistou a casa própria.',
      },
    ]);
  });

  it('o segredo que veio à tona é capítulo; o que acabou calado, não', () => {
    const e = adulto();
    fez(e, 'deixou a noite ir longe com Ana', (reg, id) => {
      criarPersonagem(e, c, 'amor', reg);
      ganhar(e, reg, 'eu', 'namoro', id);
      ganhar(e, reg, 'amor', 'escondido_caso', id);
    });
    anos(e, 3);
    fez(e, 'confessou o caso', (reg) => perder(e, reg, 'amor', 'escondido_caso'));
    const [k] = capitulosDe(e, c);
    expect(k).toMatchObject({ tipo: 'segredo', titulo: 'O caso', de: 30, ate: 33, texto: 'Aos 30, você deixou a noite ir longe com Ana; aos 33, confessou o caso.' });

    const calado = adulto(6);
    fez(calado, 'escondeu a dívida', (reg, id) => {
      criarPersonagem(calado, c, 'amor', reg);
      ganhar(calado, reg, 'eu', 'namoro', id);
      ganhar(calado, reg, 'amor', 'escondido_divida', id);
    });
    const entrada = novaEntrada(calado, { tipo: 'regra', causa: 'regra', ref: 'regra:segredo_acabou', texto: '' });
    const reg: Mudanca[] = [];
    perder(calado, reg, 'amor', 'escondido_divida');
    lancar(calado, entrada, reg);
    expect(capitulosDe(calado, c).filter((x) => x.tipo === 'segredo')).toEqual([]);
  });

  it('as pazes: o rompimento e a reconciliação com a mesma pessoa', () => {
    const e = adulto();
    fez(e, 'rompeu com sua mãe', (reg, id) => ganhar(e, reg, 'mae', 'rompido', id));
    anos(e, 6);
    fez(e, 'fez as pazes com sua mãe', (reg) => perder(e, reg, 'mae', 'rompido'));
    expect(capitulosDe(e, c)).toMatchObject([{ tipo: 'pazes', titulo: 'As pazes com sua mãe', de: 30, ate: 36 }]);
  });

  it('o amor que voltou: a mesma pessoa foi o amor, virou ex e voltou', () => {
    const e = adulto();
    fez(e, 'começou a namorar', (reg, id) => {
      criarPersonagem(e, c, 'amor', reg);
      ganhar(e, reg, 'eu', 'namoro', id);
    });
    const nome = e.entidades['amor']!.nome;
    anos(e, 2);
    aplicarStorylet(e, c, c.porId.get('conversar_de_verdade')!, 'amor', 'acao');
    const conversa = e.historico.at(-1)!.id;
    const termino = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'teste', ator: 'amor', texto: '', resumo: 'terminou o namoro' });
    const reg: Mudanca[] = [];
    perder(e, reg, 'eu', 'namoro');
    arquivarEx(e, reg);
    lancar(e, termino, reg);
    anos(e, 10);
    const volta = fez(e, `voltou com ${nome}`, (reg, id) => {
      promover(e, c, 'ex', 'amor', reg);
      ganhar(e, reg, 'eu', 'namoro', id);
    });
    const k = capitulosDe(e, c).find((x) => x.tipo === 'volta');
    expect(k).toMatchObject({ titulo: `A volta de ${nome}`, de: 32, ate: 42, comeco: termino.id, fim: volta });
    // O fim do namoro conta a última coisa visível com a pessoa antes dele (aqui, o próprio término, não a conversa).
    expect(k!.comeco).toBeGreaterThan(conversa);
  });

  it('ler os capítulos não muda a vida: nem o estado, nem o sorteio', () => {
    const e = adulto();
    operar(e, c, { tipo: 'comecar_projeto', id: 'casa_propria' });
    anos(e, 2);
    ganhar(e, [], 'eu', 'casa_propria', null);
    anoDosProjetos(e, c);
    const antes = JSON.stringify(e);
    capitulosDe(e, c);
    capitulosDoCartao(capitulosDe(e, c));
    expect(JSON.stringify(e)).toBe(antes);
  });

  it('o cartão conta os arcos mais longos, um de cada tipo antes de repetir, na ordem da vida', () => {
    const k = (tipo: 'plano' | 'segredo' | 'pazes', de: number, ate: number) => ({ tipo, titulo: tipo, de, ate, comeco: de, fim: ate, texto: '' });
    const lista = [k('plano', 20, 22), k('plano', 30, 45), k('plano', 50, 60), k('segredo', 35, 36), k('pazes', 40, 41)];
    expect(capitulosDoCartao(lista).map((x) => `${x.tipo} ${x.de}`)).toEqual(['plano 30', 'segredo 35', 'pazes 40']);
  });
});
