/**
 * Memória do jogador entre vidas. Cada vida terminada soma 1 à recência dos
 * eventos que apareceram; a recência decai pela metade a cada vida. No sorteio,
 * eventos recentes perdem peso — não somem, só cedem a vez.
 */
import type { EstadoVida, MemoriaJogador } from './tipos.ts';

export const DECAIMENTO_MEMORIA = 0.5;
export const FORCA_NOVIDADE = 2;

export function novaMemoria(): MemoriaJogador {
  return { vidas: 0, recencia: {} };
}

export function fatorNovidade(memoria: MemoriaJogador | undefined, eventoId: string): number {
  if (!memoria) return 1;
  const r = memoria.recencia[eventoId] ?? 0;
  return 1 / (1 + FORCA_NOVIDADE * r);
}

export function lembrarVida(memoria: MemoriaJogador, vida: EstadoVida): MemoriaJogador {
  const recencia: Record<string, number> = {};
  for (const [id, r] of Object.entries(memoria.recencia)) {
    const v = r * DECAIMENTO_MEMORIA;
    if (v > 0.01) recencia[id] = v;
  }
  for (const id of Object.keys(vida.vistos)) recencia[id] = (recencia[id] ?? 0) + 1;
  return { vidas: memoria.vidas + 1, recencia };
}
