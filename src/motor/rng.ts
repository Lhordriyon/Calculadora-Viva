/**
 * Gerador pseudoaleatório com semente (mulberry32).
 * O estado cabe num inteiro de 32 bits, então viaja dentro do save e a vida
 * continua idêntica depois de recarregar a página.
 */
export interface Rng {
  s: number;
}

export function criarRng(semente: number): Rng {
  return { s: semente >>> 0 };
}

/** Número em [0, 1). */
export function aleatorio(rng: Rng): number {
  rng.s = (rng.s + 0x6d2b79f5) | 0;
  let t = rng.s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Inteiro em [min, max], inclusive. */
export function inteiro(rng: Rng, min: number, max: number): number {
  return min + Math.floor(aleatorio(rng) * (max - min + 1));
}

export function chance(rng: Rng, p: number): boolean {
  return aleatorio(rng) < p;
}

/** Normal aproximada (Box-Muller). */
export function normal(rng: Rng, media: number, desvio: number): number {
  const u = Math.max(aleatorio(rng), 1e-12);
  const v = aleatorio(rng);
  return media + desvio * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function sortear<T>(rng: Rng, itens: readonly T[]): T {
  if (itens.length === 0) throw new Error('sortear: lista vazia');
  return itens[Math.floor(aleatorio(rng) * itens.length)] as T;
}

/** Índice sorteado proporcionalmente aos pesos; -1 se todos forem zero. */
export function sortearIndice(rng: Rng, pesos: readonly number[]): number {
  let total = 0;
  for (const p of pesos) total += p > 0 ? p : 0;
  if (total <= 0) return -1;
  let alvo = aleatorio(rng) * total;
  for (let i = 0; i < pesos.length; i++) {
    const p = pesos[i] ?? 0;
    if (p <= 0) continue;
    alvo -= p;
    if (alvo < 0) return i;
  }
  for (let i = pesos.length - 1; i >= 0; i--) if ((pesos[i] ?? 0) > 0) return i;
  return -1;
}

/** Mistura inteiros numa semente (hash de 32 bits), para derivar sementes reprodutíveis. */
export function misturar(...valores: number[]): number {
  let h = 0x811c9dc5;
  for (const v of valores) {
    h = Math.imul(h ^ (v >>> 0), 0x01000193);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return h >>> 0;
}
