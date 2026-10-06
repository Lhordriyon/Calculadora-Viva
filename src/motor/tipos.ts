import type { Atributo, Papel } from './esquema.ts';
import type { Rng } from './rng.ts';

/** Versão do formato do estado salvo. Mudou o formato, sobe o número. */
export const VERSAO_ESTADO = 1;

export type Genero = 'f' | 'm';

export interface Personagem {
  nome: string;
  genero: Genero;
}

export interface Pessoa {
  nome: string;
  sobrenome: string;
  genero: Genero;
  cidade: string;
  uf: string;
  profissaoMae: string;
  profissaoPai: string;
}

/** Tudo em reais de hoje (já descontada a inflação). Renda e custo são anuais. */
export interface Financas {
  dinheiro: number;
  investido: number;
  divida: number;
  renda: number;
  /** Custo-base do jeito de viver (aluguel, filhos...). Parte da sobra vira padrão de vida. */
  custo: number;
  /** Inflação do último ano, em %. */
  inflacao: number;
}

export interface RegistroMarca {
  ano: number;
  idade: number;
  /** Id da entrada do histórico que gravou a marca (null: veio do nascimento). */
  origem: number | null;
}

export interface ItemAgenda {
  evento: string;
  ano: number;
  origem: number | null;
}

/** Mudanças visíveis de uma escolha, para os chips da linha do tempo. */
export interface Deltas {
  saude?: number;
  felicidade?: number;
  inteligencia?: number;
  aparencia?: number;
  dinheiro?: number;
  divida?: number;
  investido?: number;
  /** Diferença na renda mensal. */
  renda?: number;
}

export type TipoEntrada = 'nascimento' | 'evento' | 'linha' | 'morte';

export interface Entrada {
  id: number;
  idade: number;
  ano: number;
  tipo: TipoEntrada;
  texto: string;
  eventoId?: string;
  /** Resumo do evento ("aos 34, <resumo>"). */
  resumo?: string;
  escolha?: { indice: number; texto: string; resumo: string };
  resultado?: string;
  /** Entradas anteriores que tornaram esta possível (marcas consultadas, agendamentos). */
  causas?: number[];
  deltas?: Deltas;
  /** Quanto a inflação comeu do dinheiro parado neste ano. */
  inflacao?: number;
}

export interface OpcaoPendente {
  texto: string;
  disponivel: boolean;
  motivo?: string;
}

export interface Pendente {
  eventoId: string;
  texto: string;
  causas: number[];
  opcoes: OpcaoPendente[];
  inflacao?: number;
}

export interface Morte {
  idade: number;
  ano: number;
  causa: string;
  /** Índice da causa em mortes.json, quando sorteada de lá. */
  fonte?: number;
}

export interface EstadoVida {
  versao: number;
  semente: number;
  rng: Rng;
  pessoa: Pessoa;
  personagens: Partial<Record<Papel, Personagem>>;
  anoNascimento: number;
  idade: number;
  ano: number;
  atributos: Record<Atributo, number>;
  financas: Financas;
  marcas: Record<string, RegistroMarca>;
  agenda: ItemAgenda[];
  /** Idades em que cada evento aconteceu. */
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
 * Memória do jogador entre vidas: quantas vezes (com decaimento) cada evento
 * apareceu nas vidas anteriores. O sorteio usa isso para variar.
 */
export interface MemoriaJogador {
  vidas: number;
  recencia: Record<string, number>;
}
