/**
 * Memória do jogador entre vidas. Cada vida terminada soma 1 à recência das
 * instâncias de storylet que apareceram; a recência decai pela metade a cada
 * vida. No sorteio, instâncias recentes perdem peso: não somem, só cedem a
 * vez. Também guarda as ações já feitas (as outras aparecem como "novo").
 */
import type { EstadoVida, MemoriaJogador } from './tipos.ts';

export const DECAIMENTO_MEMORIA = 0.5;
export const FORCA_NOVIDADE = 4;

export function novaMemoria(): MemoriaJogador {
  return { vidas: 0, recencia: {}, acoes: {} };
}

export function fatorNovidade(memoria: MemoriaJogador | undefined, instancia: string): number {
  if (!memoria) return 1;
  const r = memoria.recencia[instancia] ?? 0;
  return 1 / (1 + FORCA_NOVIDADE * r);
}

export function lembrarVida(memoria: MemoriaJogador, vida: EstadoVida): MemoriaJogador {
  const recencia: Record<string, number> = {};
  for (const [id, r] of Object.entries(memoria.recencia)) {
    const v = r * DECAIMENTO_MEMORIA;
    if (v > 0.01) recencia[id] = v;
  }
  const acoes = { ...(memoria.acoes ?? {}) };
  for (const h of vida.historico) {
    if (!h.instancia || h.tipo === 'regra') continue;
    if (h.tipo === 'acao') acoes[h.ref ?? h.instancia] = (acoes[h.ref ?? h.instancia] ?? 0) + 1;
  }
  for (const instancia of Object.keys(vida.vistos)) recencia[instancia] = (recencia[instancia] ?? 0) + 1;
  return { vidas: memoria.vidas + 1, recencia, acoes };
}
