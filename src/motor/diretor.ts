/**
 * O diretor escolhe o que acontece no ano por saliência:
 * peso × especificidade × novidade × tensão.
 *
 * - especificidade: storylets com mais condições falam mais desta vida;
 * - novidade: o que apareceu nas vidas anteriores (memória) ou já nesta cede a vez;
 * - tensão: urgência declarada, e consequência fresca (a qualidade consultada
 *   surgiu há até 2 anos) pesa o dobro, para a causa e o efeito ficarem perto.
 *
 * Um storylet com escolha por ano (o toque é do jogador); agendados e marcos
 * passam na frente; personagens que agem entram na disputa.
 */
import { causasDe, clausulas, idadeDaCausaMaisRecente } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import type { Storylet } from './esquema.ts';
import { fatorNovidade } from './memoria.ts';
import { ritmo } from './regras.ts';
import { aleatorio, sortearIndice } from './rng.ts';
import { atoresPossiveis, elegivel, instanciaDe } from './storylets.ts';
import type { EstadoVida, MemoriaJogador } from './tipos.ts';

export interface Candidato {
  s: Storylet;
  ator: string | undefined;
  causa: 'diretor' | 'npc';
  causas: number[];
  saliencia: number;
  /** Agendado, marco ou tensão alta: acontece sem depender do ritmo do ano. */
  urgente: boolean;
}

export function saliencia(s: Storylet, e: EstadoVida, ator: string | undefined, memoria: MemoriaJogador | undefined): number {
  const instancia = instanciaDe(s, ator);
  const especificidade = 1 + 0.25 * clausulas(s.condicoes) + (ator ? 0.25 : 0);
  const vezes = e.vistos[instancia]?.length ?? 0;
  const recente = idadeDaCausaMaisRecente(s.condicoes, e, ator);
  const fresca = recente !== undefined && e.idade - recente <= 2 ? 2 : 1;
  return (s.peso ?? 1) * especificidade * fatorNovidade(memoria, instancia) * (1 / (1 + vezes)) * (s.tensao ?? 1) * fresca;
}

/** Entre vários atores possíveis, o preferido pelo storylet (ou todos, se ele não prefere). */
export function preferidos(s: Storylet, e: EstadoVida, atores: (string | undefined)[]): (string | undefined)[] {
  if (!s.preferir || atores.length < 2) return atores;
  const sinal = s.preferir[0] === '-' ? 1 : -1;
  const campo = s.preferir.slice('+ator.'.length);
  const valor = (a: string | undefined): number => (a ? (e.entidades[a]?.n[campo] ?? 0) : 0);
  const melhor = atores.reduce((m, a) => (sinal * valor(a) < sinal * valor(m) ? a : m), atores[0]);
  return [melhor];
}

export function candidatosDe(
  lista: Storylet[],
  e: EstadoVida,
  memoria: MemoriaJogador | undefined,
  causa: 'diretor' | 'npc',
  urgente: (s: Storylet) => boolean,
): Candidato[] {
  const saida: Candidato[] = [];
  for (const s of lista) {
    const atores = preferidos(s, e, atoresPossiveis(s, e).filter((a) => elegivel(s, e, a)));
    for (const ator of atores) {
      saida.push({ s, ator, causa, causas: causasDe(s.condicoes, e, ator), saliencia: saliencia(s, e, ator, memoria), urgente: urgente(s) });
    }
  }
  return saida;
}

function sortearPorSaliencia(e: EstadoVida, lista: Candidato[]): Candidato | null {
  const i = sortearIndice(e.rng, lista.map((x) => x.saliencia));
  return i < 0 ? null : lista[i]!;
}

/**
 * O storylet do ano. `dePersonagens` são as iniciativas com escolha que os
 * personagens tomaram neste ano (as sem escolha já aconteceram).
 */
export function escolherDoAno(e: EstadoVida, c: Conteudo, memoria: MemoriaJogador | undefined, dePersonagens: Candidato[]): Candidato | null {
  // 1. Agendados vencidos: o primeiro que ainda cabe; os outros esperam um ano.
  const devidos = e.agenda.filter((a) => a.ano <= e.ano).sort((x, y) => x.ano - y.ano);
  let agendado: Candidato | null = null;
  for (const item of devidos) {
    const s = c.porId.get(item.evento);
    const ator = item.ator;
    if (!agendado && s && elegivel(s, e, ator) && (!ator || e.entidades[ator]?.vivo !== false)) {
      e.agenda.splice(e.agenda.indexOf(item), 1);
      const causas = causasDe(s.condicoes, e, ator);
      if (item.origem !== null) causas.unshift(item.origem);
      agendado = { s, ator, causa: 'diretor', causas, saliencia: 1, urgente: true };
    } else if (agendado && s && elegivel(s, e, ator)) {
      item.ano = e.ano + 1;
    } else {
      e.agenda.splice(e.agenda.indexOf(item), 1);
    }
  }
  if (agendado) return agendado;

  // 2. Marcos da vida elegíveis acontecem sem sorteio de ritmo.
  const daIdade = c.eventosPorIdade[e.idade] ?? [];
  const marcos = candidatosDe(daIdade.filter((s) => s.marco), e, memoria, 'diretor', () => true);
  if (marcos.length > 0) return sortearPorSaliencia(e, marcos);

  // 3. Personagem em crise (tensão alta) passa na frente.
  const urgentes = dePersonagens.filter((x) => x.urgente);
  if (urgentes.length > 0) return sortearPorSaliencia(e, urgentes);

  // 4. Sorteio pelo ritmo da idade, entre eventos e iniciativas de personagens.
  if (aleatorio(e.rng) >= ritmo(e.idade)) return null;
  const pool = [...candidatosDe(daIdade.filter((s) => !s.marco), e, memoria, 'diretor', () => false), ...dePersonagens];
  return sortearPorSaliencia(e, pool);
}
