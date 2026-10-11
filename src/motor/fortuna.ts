/**
 * Brincar de deus: o que só dá para fazer com muito dinheiro (a festa do
 * século, uma fundação, a cura de uma doença, um foguete, uma cidade nova,
 * eleger um presidente, salvar o país, fundar um país). Cada jogada é um
 * storylet do tipo "jogada": a folha Dinheiro mostra as que valem agora, com o
 * preço; escolher uma opção aplica a escolha na hora, sem gastar a ficha do
 * ano, e a causa é do jogador. O mundo responde com o que a jogada agenda e
 * com eventos que leem a marca que ela deixa.
 */
import type { Conteudo } from './conteudo.ts';
import { tipoDe } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { Storylet } from './esquema.ts';
import { aplicarEscolha, custoDaEscolha, elegivel, marcarVisto, opcoesDe } from './storylets.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entrada, EstadoVida, OpcaoPendente } from './tipos.ts';

export type OperacaoJogada = { tipo: 'jogada'; id: string; escolha: number };

export function ehOperacaoDeJogada(op: { tipo: string }): op is OperacaoJogada {
  return op.tipo === 'jogada';
}

export interface JogadaDisponivel {
  s: Storylet;
  texto: string;
  /** A opção mais barata que custa alguma coisa (o "a partir de" da lista). */
  preco: number;
  opcoes: OpcaoPendente[];
  /** O preço de cada opção (0 = de graça). */
  custos: number[];
}

export function precoDe(s: Storylet): number {
  const custos = (s.escolhas ?? []).map(custoDaEscolha).filter((x) => x > 0);
  return custos.length > 0 ? Math.min(...custos) : 0;
}

/** As jogadas que valem agora, da mais barata à mais cara. */
export function jogadasDe(e: EstadoVida, c: Conteudo): JogadaDisponivel[] {
  if (!e.vivo || e.pendente) return [];
  return c.jogadas
    .filter((s) => elegivel(s, e, undefined))
    .map((s) => {
      const ctx = contexto(e, { ator: undefined, valores: s.valores, trechos: s.trechos });
      return { s, texto: capitalizar(renderizar(s.texto, ctx)), preco: precoDe(s), opcoes: opcoesDe(e, s, undefined, ctx), custos: (s.escolhas ?? []).map(custoDaEscolha) };
    })
    .sort((a, b) => a.preco - b.preco);
}

export function motivoParaNaoOperarJogada(e: EstadoVida, c: Conteudo, op: OperacaoJogada): string | null {
  const s = c.porId.get(op.id);
  if (!s || tipoDe(s) !== 'jogada') return 'essa jogada não existe';
  if (!elegivel(s, e, undefined)) return 'agora não dá';
  const opcao = opcoesDe(e, s, undefined)[op.escolha];
  if (!opcao) return 'escolha uma opção';
  return opcao.disponivel ? null : (opcao.motivo ?? 'agora não dá');
}

/** Faz a jogada (já conferida): a entrada é do jogador, como as operações da folha, e leva a escolha e o desfecho. */
export function jogar(e: EstadoVida, c: Conteudo, op: OperacaoJogada): Entrada {
  const s = c.porId.get(op.id)!;
  const ctx = contexto(e, { ator: undefined, valores: s.valores, trechos: s.trechos });
  const opcao = opcoesDe(e, s, undefined, ctx)[op.escolha]!;
  marcarVisto(e, s, undefined);
  return aplicarEscolha(e, c, s, op.escolha, { tipo: 'dinheiro', ref: `jogada:${s.id}`, instancia: s.id, texto: capitalizar(renderizar(s.texto, ctx)), opcao: opcao.texto });
}
