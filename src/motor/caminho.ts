/**
 * O caminho não tomado (missão Ω5, I-127). A vida é guardada como comandos (o que quem joga fez, na ordem, como a
 * interface manda: passar o ano, agir, mexer no dinheiro, escolher), junto com o começo e a memória entre vidas daquele
 * começo. Com a mesma semente e os mesmos comandos, a vida se refaz igual. Trocando uma escolha num ponto de virada e
 * deixando um robô com o jeito de quem joga seguir dali, sai a vida que não foi vivida: um experimento dentro do
 * modelo, não uma previsão.
 *
 * Só lê a gravação: a vida de verdade não muda. Se a vida refeita não for a mesma até o ponto (o jogo mudou desde que a
 * vida começou), não há caminho: a resposta diz isso.
 */
import { jaAgiu } from './acoes.ts';
import { motivoParaNaoOperar, operar, type Operacao } from './carteira.ts';
import type { Verbo } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from './robos.ts';
import { criarRng, misturar, type Rng } from './rng.ts';
import type { EstadoVida, MemoriaJogador } from './tipos.ts';
import { agir, avancarAno, escolher } from './vida.ts';

/** Um comando de quem joga, como a interface manda (App.tsx). A escolha guarda a entrada que ela fez. */
export type Comando =
  | { t: 'ano' }
  | { t: 'agir'; verbo: Verbo; escolha?: { id: string; ator?: string | undefined } }
  | { t: 'operar'; op: Operacao }
  | { t: 'escolher'; i: number; entrada: number };

export interface Gravacao {
  /** A vida como começou (o nascimento, ou a abertura da vida do herdeiro), antes de qualquer comando. */
  inicio: EstadoVida;
  /** A memória entre vidas desse começo: o diretor lê a mesma durante a vida inteira. */
  memoria: MemoriaJogador;
  comandos: Comando[];
}

export function novaGravacao(inicio: EstadoVida, memoria: MemoriaJogador): Gravacao {
  return { inicio: structuredClone(inicio), memoria: structuredClone(memoria), comandos: [] };
}

/** Faz o que a interface faz com cada comando (agir passa o ano quando as fichas acabam). */
export function aplicarComando(e: EstadoVida, c: Conteudo, memoria: MemoriaJogador, cmd: Comando): void {
  switch (cmd.t) {
    case 'ano':
      avancarAno(e, c, memoria);
      return;
    case 'agir':
      agir(e, c, cmd.verbo, cmd.escolha);
      if (e.vivo && !e.pendente && jaAgiu(e)) avancarAno(e, c, memoria);
      return;
    case 'operar':
      if (motivoParaNaoOperar(e, c, cmd.op) === null) operar(e, c, cmd.op);
      return;
    case 'escolher':
      escolher(e, c, cmd.i);
  }
}

/** Refaz a vida inteira pela gravação (o teste confere que sai igual à de verdade). */
export function refazer(c: Conteudo, g: Gravacao): EstadoVida {
  const e = structuredClone(g.inicio);
  for (const cmd of g.comandos) aplicarComando(e, c, g.memoria, cmd);
  return e;
}

/** Um passo do robô, como o túnel joga: escolhe, mexe no dinheiro, gasta as fichas e passa o ano. */
function passoDoRobo(e: EstadoVida, c: Conteudo, robo: Rng, estrategia: Estrategia, memoria: MemoriaJogador): void {
  if (e.pendente) {
    escolher(e, c, decidir(estrategia, e, c, robo));
    return;
  }
  for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) operar(e, c, op);
  for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) agir(e, c, a.verbo, a.escolha);
  if (e.vivo && !e.pendente) avancarAno(e, c, memoria);
}

export interface CaminhoNaoTomado {
  /** A vida que não foi vivida, até o fim. */
  vida: EstadoVida;
  /** A idade da troca, a opção que quem joga escolheu e a outra. */
  idade: number;
  escolhida: string;
  outra: string;
  /** O robô que seguiu: o jeito que mais acertou as escolhas de quem joga até ali. */
  estrategia: Estrategia;
}

/** As escolhas gravadas que dá para trocar: a entrada da escolha e a idade. */
export function escolhasGravadas(g: Gravacao): number[] {
  return g.comandos.flatMap((x) => (x.t === 'escolher' ? [x.entrada] : []));
}

/**
 * A vida que não foi vivida: refaz até a escolha da entrada, confere que é a mesma vida até ali (a mesma pendência no
 * mesmo ponto do livro), toma a outra opção e deixa o robô com o jeito de quem joga seguir até o fim.
 */
export function caminhoNaoTomado(c: Conteudo, g: Gravacao, entrada: number): CaminhoNaoTomado | { erro: string } {
  const k = g.comandos.findIndex((x) => x.t === 'escolher' && x.entrada === entrada);
  if (k < 0) return { erro: 'essa escolha não ficou gravada' };
  const original = g.comandos[k] as Extract<Comando, { t: 'escolher' }>;
  const e = structuredClone(g.inicio);
  const acertos: Record<'cautelosa' | 'arriscada', number> = { cautelosa: 0, arriscada: 0 };
  const mudou = { erro: 'o jogo mudou desde que esta vida começou, e ela não se refaz igual' };
  try {
    for (let i = 0; i < k; i++) {
      const cmd = g.comandos[i]!;
      // O jeito de quem joga: em cada escolha, qual robô teria escolhido o mesmo (o sorteio do robô não é o da vida).
      if (cmd.t === 'escolher' && e.pendente) for (const s of ['cautelosa', 'arriscada'] as const) if (decidir(s, e, c, criarRng(misturar(i, 7))) === cmd.i) acertos[s]++;
      aplicarComando(e, c, g.memoria, cmd);
    }
  } catch {
    // Um comando que já não cabe (a escolha sem pendência, a ação que sumiu): a vida refeita não é a mesma.
    return mudou;
  }
  if (!e.pendente || e.proximoId !== entrada) return mudou;
  const opcoes = e.pendente.opcoes;
  const outraOpcao = opcoes.findIndex((o, j) => j !== original.i && o.disponivel);
  if (outraOpcao < 0) return { erro: 'nessa hora, não havia outro caminho' };
  const idade = e.idade;
  const escolhida = opcoes[original.i]?.texto ?? '';
  const outra = opcoes[outraOpcao]!.texto;
  const estrategia: Estrategia = acertos.arriscada > acertos.cautelosa ? 'arriscada' : 'cautelosa';
  escolher(e, c, outraOpcao);
  const robo = criarRng(misturar(e.semente, entrada));
  for (let passos = 0; e.vivo && passos < 2000; passos++) passoDoRobo(e, c, robo, estrategia, g.memoria);
  return { vida: e, idade, escolhida, outra, estrategia };
}
