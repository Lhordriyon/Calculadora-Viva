/** Constantes do formato, sem dependências (o navegador não precisa carregar o Zod). */
export const ATRIBUTOS = ['saude', 'felicidade', 'inteligencia', 'aparencia'] as const;
export type Atributo = (typeof ATRIBUTOS)[number];

/** Personagens que nascem com a vida. */
export const PAPEIS_FIXOS = ['mae', 'pai', 'avo', 'amigo'] as const;
/** Personagens que um efeito pode criar no meio da vida. */
export const PAPEIS_NOVOS = ['amor', 'filho', 'paixao', 'pet'] as const;
export const PAPEIS = [...PAPEIS_FIXOS, ...PAPEIS_NOVOS] as const;
export type Papel = (typeof PAPEIS)[number];
export type PapelNovo = (typeof PAPEIS_NOVOS)[number];
