import type { Rng } from './rng.ts';

/** Versão do formato do estado salvo. Mudou o formato, sobe o número. */
export const VERSAO_ESTADO = 2;

export type Genero = 'f' | 'm';

/** Uma qualidade (as marcas da fase 1, generalizadas): valor, quando surgiu e quem a causou. */
export interface Qualidade {
  v: number;
  ano: number;
  idade: number;
  /** Id da entrada do livro-razão que a gravou (null: veio do nascimento). */
  causa: number | null;
}

export type TipoEntidade = 'pessoa' | 'animal' | 'lugar' | 'jurisdicao';

/**
 * Um formato de estado: pessoa, bicho, lugar e país são entidades com campos
 * numéricos (`n`), de texto (`t`) e qualidades (`q`). Condições e efeitos
 * leem e escrevem caminhos como `mae.saude` e `lugar.desemprego`.
 */
export interface Entidade {
  id: string;
  tipo: TipoEntidade;
  nome: string;
  genero?: Genero;
  /** Ano de nascimento (pessoas e bichos). */
  nascimento?: number;
  vivo?: boolean;
  /** Ano da morte. */
  morte?: number;
  n: Record<string, number>;
  t: Record<string, string>;
  q: Record<string, Qualidade>;
}

export interface ItemAgenda {
  evento: string;
  ano: number;
  origem: number | null;
  ator?: string;
}

/** Quem causou as mudanças de uma entrada do livro-razão. */
export type Causa = 'nascimento' | 'escolha' | 'acao' | 'diretor' | 'npc' | 'regra';

/**
 * Uma mutação: `c` é o caminho ("eu.saude", "mae.doente"); `d` é a variação
 * numérica; `q` diz se a qualidade foi ganha (1) ou perdida (-1); `r` nomeia a
 * regra quando a entrada agrega as regras do ano.
 */
export interface Mudanca {
  c: string;
  d?: number;
  q?: 1 | -1;
  /** Novo valor de um campo de texto (ocupação, traço). */
  t?: string;
  r?: string;
}

export type TipoEntrada = 'nascimento' | 'evento' | 'acao' | 'npc' | 'mundo' | 'linha' | 'regra' | 'morte';

/** Entrada do livro-razão. As de tipo `regra` não aparecem na linha do tempo. */
export interface Entrada {
  id: number;
  idade: number;
  ano: number;
  tipo: TipoEntrada;
  causa: Causa;
  /** Storylet ou regra que gerou a entrada. */
  ref?: string;
  /** Papel envolvido (quem agiu ou de quem se trata). */
  ator?: string;
  /** Storylet + papel: a unidade da saturação entre vidas. */
  instancia?: string;
  texto: string;
  /** Frase para o cartão da vida ("aos 34, <resumo>"); nas entradas de personagem já vem com sujeito. */
  resumo?: string;
  escolha?: { indice: number; texto: string; resumo: string };
  resultado?: string;
  /** Entradas anteriores que tornaram esta possível (qualidades consultadas, agendamentos). */
  causas?: number[];
  mudancas?: Mudanca[];
  /** Quanto a inflação comeu do dinheiro parado neste ano. */
  inflacao?: number;
}

export interface OpcaoPendente {
  texto: string;
  disponivel: boolean;
  motivo?: string;
}

export interface Pendente {
  storylet: string;
  ator?: string;
  instancia: string;
  /** Quem trouxe o evento: o diretor ou um personagem. */
  causa: 'diretor' | 'npc';
  texto: string;
  causas: number[];
  opcoes: OpcaoPendente[];
  inflacao?: number;
}

export interface Morte {
  idade: number;
  ano: number;
  causa: string;
  categoria: string;
  /** Índice da causa em mortes.json, quando sorteada de lá. */
  fonte?: number;
}

export interface EstadoVida {
  versao: number;
  semente: number;
  rng: Rng;
  sobrenome: string;
  anoNascimento: number;
  idade: number;
  ano: number;
  entidades: Record<string, Entidade>;
  agenda: ItemAgenda[];
  /** Idades em que cada instância de storylet aconteceu. */
  vistos: Record<string, number[]>;
  /** Linhas usadas recentemente (índices), para não repetir em sequência. */
  linhasRecentes: number[];
  historico: Entrada[];
  pendente: Pendente | null;
  vivo: boolean;
  morte: Morte | null;
  /** Soma da felicidade de cada ano vivido (média = soma / anos). */
  somaFelicidade: number;
  proximoId: number;
}

/**
 * Memória do jogador entre vidas: quantas vezes (com decaimento) cada instância
 * apareceu nas vidas anteriores, e quais ações já foram feitas alguma vez.
 */
export interface MemoriaJogador {
  vidas: number;
  recencia: Record<string, number>;
  /** Ações (storylets) já feitas em alguma vida: as outras aparecem como "novo". */
  acoes: Record<string, number>;
}
