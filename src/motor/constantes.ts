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

/** Os países de fora com quem o Brasil negocia (mundo.json › estrangeiros): entidades que nascem com a vida. */
export const PARCEIROS = ['federacao', 'celeste', 'liga', 'pacto'] as const;
export type Parceiro = (typeof PARCEIROS)[number];

/**
 * As contas de fora, contrapartes do dinheiro que entra e sai das pessoas da vida (incremento "toda transferência
 * tem dois lados"): o setor privado (quem paga salário, vende, aluga e compra), o governo (imposto, auxílio, cargo
 * público, juro dos títulos), o sistema bancário (crédito e juros) e a família que não é personagem (os irmãos).
 * Por enquanto só existem no livro: viram entidades com balanço quando passarem a decidir alguma coisa.
 */
export const CONTAS_DE_FORA = ['mercado', 'tesouro', 'banco', 'parentes'] as const;
export type ContaDeFora = (typeof CONTAS_DE_FORA)[number];
/** Contraparte de uma mudança de dinheiro: uma entidade da vida, uma conta de fora ou a reavaliação (preço que mudou). */
export type Contraparte = ContaDeFora | 'reavaliacao' | (string & {});

/**
 * As modalidades de dívida (dividas.ts): o cheque especial (o crédito do dia a dia, que cobre a conta no vermelho),
 * o empréstimo que uma escolha fez, o financiamento de um imóvel (com o imóvel em garantia) e o acordo de uma
 * renegociação. Toda dívida de quem joga é um contrato de uma delas, com o banco como credor.
 */
export const MODALIDADES = ['credito', 'emprestimo', 'financiamento', 'acordo'] as const;
export type Modalidade = (typeof MODALIDADES)[number];

/** Entidades da vida: quem joga, as pessoas, o lugar, o país, os países de fora e a empresa (quando quem joga tem uma). */
export const ENTIDADES = ['eu', ...PAPEIS, 'lugar', 'pais', ...PARCEIROS, 'empresa'] as const;
export type IdEntidade = (typeof ENTIDADES)[number];

/** Os verbos da ficha do ano. */
export const VERBOS = ['estudar', 'trabalhar', 'saude', 'familia', 'sair', 'poupar'] as const;
export type Verbo = (typeof VERBOS)[number];

export const TIPOS_STORYLET = ['evento', 'acao', 'npc', 'jogada'] as const;
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

/** As políticas do governo (pais.pol_impostos…), cada uma em três níveis: 0 baixo, 1 médio, 2 alto. */
export const POLITICAS = ['impostos', 'social', 'saude', 'educacao', 'seguranca', 'comercio'] as const;
export type Politica = (typeof POLITICAS)[number];
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
