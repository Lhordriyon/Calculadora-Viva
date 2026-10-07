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

/** Entidades da vida: quem joga, as pessoas, o lugar, o país e a empresa (quando quem joga tem uma). */
export const ENTIDADES = ['eu', ...PAPEIS, 'lugar', 'pais', 'empresa'] as const;
export type IdEntidade = (typeof ENTIDADES)[number];

/** Os verbos da ficha do ano. */
export const VERBOS = ['estudar', 'trabalhar', 'saude', 'familia', 'sair', 'poupar'] as const;
export type Verbo = (typeof VERBOS)[number];

export const TIPOS_STORYLET = ['evento', 'acao', 'npc'] as const;
export type TipoStorylet = (typeof TIPOS_STORYLET)[number];

/** Classes por patrimônio, da origem ao fim (as mesmas faixas nos dois lados). */
export const CLASSES = ['extrema_pobreza', 'pobre', 'remediada', 'media', 'rica', 'muito_rica', 'bilionaria', 'trilionaria'] as const;
export type Classe = (typeof CLASSES)[number];

export const TIPOS_FAMILIA = ['acolhedora', 'conflituosa', 'religiosa', 'empreendedora'] as const;
export type TipoFamilia = (typeof TIPOS_FAMILIA)[number];

export const CATEGORIAS_MORTE = ['velhice', 'coracao', 'doenca', 'acidente', 'violencia'] as const;

/** Fases do ciclo da economia do país. Fora do normal, a fase é uma qualidade do país (`pais.recessao`). */
export const FASES = ['normal', 'expansao', 'recessao', 'crise'] as const;
export type Fase = (typeof FASES)[number];
export type CategoriaMorte = (typeof CATEGORIAS_MORTE)[number];

/** Onde o dinheiro investido fica: cada classe rende conforme a fase do país. */
export const ATIVOS = ['renda_fixa', 'acoes', 'fii', 'dolar', 'cripto'] as const;
export type Ativo = (typeof ATIVOS)[number];
/** Ordem de resgate quando falta dinheiro: o mais fácil de vender primeiro. */
export const LIQUIDEZ: readonly Ativo[] = ['renda_fixa', 'dolar', 'fii', 'acoes', 'cripto'];
/** Perfil de investidor: para onde vai o dinheiro novo. */
export const PERFIS = ['conservador', 'moderado', 'arrojado'] as const;
export type Perfil = (typeof PERFIS)[number];
export const PERFIL_PADRAO: Perfil = 'moderado';
/** Padrão de vida: quanto da sobra do ano vira gasto (o resto fica na conta). */
export const PADROES = ['simples', 'confortavel', 'luxo'] as const;
export type Padrao = (typeof PADROES)[number];
export const PADRAO_PADRAO: Padrao = 'confortavel';
/** Quanto do valor da empresa vira dinheiro na conta de quem joga, por ano (reinvestir tudo, tirar um pouco, tirar bastante). */
export const RETIRADAS = [0, 0.03, 0.08] as const;
