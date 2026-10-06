/** Constantes do formato, sem dependências (o navegador não precisa carregar o Zod). */
export const ATRIBUTOS = ['saude', 'felicidade', 'inteligencia', 'aparencia'] as const;
export type Atributo = (typeof ATRIBUTOS)[number];

/** Pessoas que nascem com a vida. */
export const PAPEIS_FIXOS = ['mae', 'pai', 'avo', 'amigo'] as const;
/** Pessoas e bichos que um efeito cria no meio da vida. */
export const PAPEIS_NOVOS = ['amor', 'filho', 'paixao', 'pet'] as const;
export const PAPEIS = [...PAPEIS_FIXOS, ...PAPEIS_NOVOS] as const;
export type Papel = (typeof PAPEIS)[number];
export type PapelNovo = (typeof PAPEIS_NOVOS)[number];

/** Entidades que existem em toda vida: quem joga, as pessoas, o lugar e o país. */
export const ENTIDADES = ['eu', ...PAPEIS, 'lugar', 'pais'] as const;
export type IdEntidade = (typeof ENTIDADES)[number];

/** Os verbos da ficha do ano. */
export const VERBOS = ['estudar', 'trabalhar', 'saude', 'familia', 'sair', 'poupar'] as const;
export type Verbo = (typeof VERBOS)[number];

export const TIPOS_STORYLET = ['evento', 'acao', 'npc'] as const;
export type TipoStorylet = (typeof TIPOS_STORYLET)[number];

/** Classes por patrimônio, da origem ao fim (as mesmas faixas nos dois lados). */
export const CLASSES = ['extrema_pobreza', 'pobre', 'remediada', 'media', 'rica', 'muito_rica'] as const;
export type Classe = (typeof CLASSES)[number];

export const TIPOS_FAMILIA = ['acolhedora', 'conflituosa', 'religiosa', 'empreendedora'] as const;
export type TipoFamilia = (typeof TIPOS_FAMILIA)[number];

export const CATEGORIAS_MORTE = ['velhice', 'coracao', 'doenca', 'acidente', 'violencia'] as const;
export type CategoriaMorte = (typeof CATEGORIAS_MORTE)[number];
