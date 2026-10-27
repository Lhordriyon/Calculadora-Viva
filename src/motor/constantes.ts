/** Constantes do formato, sem dependências (o navegador não precisa carregar o Zod). */
export const ATRIBUTOS = ['saude', 'felicidade', 'inteligencia', 'aparencia'] as const;
export type Atributo = (typeof ATRIBUTOS)[number];

/** Pessoas que nascem com a vida. */
export const PAPEIS_FIXOS = ['mae', 'pai', 'avo', 'amigo'] as const;
/** Pessoas e bichos que um efeito cria no meio da vida. */
export const PAPEIS_NOVOS = ['amor', 'filho', 'paixao', 'pet'] as const;
/**
 * A rede (a missão Ω): pessoas que o motor põe e tira da vida, não um efeito do conteúdo. Os irmãos nascem com a
 * família (os mais novos, depois), o ex é o amor que foi embora e continua existindo, o colega e o chefe vêm com o
 * trabalho. O conteúdo que fala de um deles pede `"<papel>.vivo"` na condição: sem a pessoa, a condição não vale.
 */
export const PAPEIS_DA_REDE = ['irmao', 'ex', 'colega', 'chefe'] as const;
export const PAPEIS = [...PAPEIS_FIXOS, ...PAPEIS_NOVOS, ...PAPEIS_DA_REDE] as const;
export type Papel = (typeof PAPEIS)[number];
export type PapelNovo = (typeof PAPEIS_NOVOS)[number];
/** Quem um efeito do conteúdo faz chegar à vida (`personagens`): os papéis novos e o irmão que nasce depois de quem joga. */
export const PAPEIS_QUE_CHEGAM = [...PAPEIS_NOVOS, 'irmao'] as const;
export type PapelQueChega = (typeof PAPEIS_QUE_CHEGAM)[number];

/**
 * Os filhos de quem joga, em ordem de chegada: o primeiro é `filho` (o papel do conteúdo) e os seguintes, `filho2` a
 * `filho4`. O id não muda de pessoa: o livro, as condições (`filho.idade`) e o texto antigo continuam valendo. O
 * conteúdo com `ator: ["filho"]` vale para qualquer um deles.
 */
export const FILHOS = ['filho', 'filho2', 'filho3', 'filho4'] as const;
export const MAX_FILHOS = FILHOS.length;
/** No texto, {cacula} ({cacula:o|a}) é o filho mais novo; {filho} é sempre o primeiro, e {ator}, o filho de quem se trata. */
export const CACULA = 'cacula';

export function ehFilho(id: string): boolean {
  return (FILHOS as readonly string[]).includes(id);
}

/**
 * Os irmãos de quem joga (`irmao` a `irmao5`): os mais velhos, do mais velho ao mais novo, e depois os que nasceram
 * depois de quem joga, na ordem em que chegaram.
 */
export const IRMAOS = ['irmao', 'irmao2', 'irmao3', 'irmao4', 'irmao5'] as const;
/** Os ex de quem joga, na ordem em que foram embora (`ex` a `ex3`); sem lugar, quem foi embora há mais tempo sai. */
export const EXES = ['ex', 'ex2', 'ex3'] as const;

export function ehIrmao(id: string): boolean {
  return (IRMAOS as readonly string[]).includes(id);
}
export function ehEx(id: string): boolean {
  return (EXES as readonly string[]).includes(id);
}

/** Os papéis do conteúdo que valem para várias pessoas: `ator: ["filho"]` vale para cada filho, e o mesmo para irmão e ex. */
export const VARIOS: Readonly<Record<string, readonly string[]>> = { filho: FILHOS, irmao: IRMAOS, ex: EXES };

/** O papel do conteúdo que a pessoa ocupa: `filho2` é um filho, `irmao3` é um irmão, `ex2` é um ex. */
export function papelBase(id: string): string {
  return ehFilho(id) ? 'filho' : ehIrmao(id) ? 'irmao' : ehEx(id) ? 'ex' : id;
}

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

/** Entidades da vida: quem joga, as pessoas, o lugar, o país, os países de fora, a empresa (quando quem joga tem uma) e a ilha (o país que quem joga fundou). */
export const ENTIDADES = ['eu', ...PAPEIS, 'lugar', 'pais', ...PARCEIROS, 'empresa', 'ilha'] as const;

/**
 * Como a coroa recebe (coroa.ts): o salário da Casa Real (fixo), uma parte dos impostos (uma fatia da arrecadação, que
 * anda com a economia) ou a taxa da coroa (um imposto a mais, só para ela).
 */
export const FORMAS_DA_COROA = ['salario', 'impostos', 'taxa'] as const;
export type FormaDaCoroa = (typeof FORMAS_DA_COROA)[number];
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

/** O que cada pessoa da vida ama (o gosto sai do nome e do nascimento dela): o presente certo e o programa junto. */
export const GOSTOS = ['futebol', 'novela', 'pescaria', 'cozinha', 'musica', 'fe', 'plantas', 'jogos', 'livros', 'carros', 'viagem', 'danca', 'bichos', 'politica', 'artesanato'] as const;
export type Gosto = (typeof GOSTOS)[number];

/** Como cada pessoa está com quem joga, no ano: sai da mágoa, da saudade, da saúde e do vínculo. */
export const HUMORES = ['furia', 'magoa', 'abatimento', 'saudade', 'alegria', 'paz', 'distancia'] as const;
export type Humor = (typeof HUMORES)[number];
/** O que a pessoa acha de quem joga (relacoes.ts › visoesDe): as opiniões boas primeiro, depois as que doem. */
export const VISOES_BOAS = ['orgulho', 'presente', 'carinhoso', 'de_palavra', 'generoso', 'cuida_dos_filhos'] as const;
export const VISOES_RUINS = ['sumido', 'metido', 'interesseiro', 'cabeca_quente', 'sem_palavra', 'longe_dos_filhos', 'casado_com_o_trabalho', 'perdido'] as const;
export const VISOES = [...VISOES_BOAS, ...VISOES_RUINS] as const;
export type Visao = (typeof VISOES)[number];
export type TipoFamilia = (typeof TIPOS_FAMILIA)[number];

export const CATEGORIAS_MORTE = ['velhice', 'coracao', 'doenca', 'acidente', 'violencia'] as const;

/** Fases do ciclo da economia do país. Fora do normal, a fase é uma qualidade do país (`pais.recessao`). */
export const FASES = ['normal', 'expansao', 'recessao', 'crise'] as const;
export type Fase = (typeof FASES)[number];

/** As políticas do governo (pais.pol_impostos…), cada uma em três níveis: 0 baixo, 1 médio, 2 alto. */
export const POLITICAS = ['impostos', 'social', 'saude', 'educacao', 'seguranca', 'comercio', 'pesquisa', 'defesa'] as const;
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
