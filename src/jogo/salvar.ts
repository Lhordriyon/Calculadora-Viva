/**
 * Save no localStorage com versão de esquema. Se o formato mudar, VERSAO_SAVE
 * sobe; um save antigo ou corrompido é descartado sem quebrar o jogo (a
 * memória entre vidas é preservada quando ainda for legível).
 */
import { z } from 'zod';
import type { Conteudo } from '../motor/conteudo.ts';
import type { EstadoVida, MemoriaJogador } from '../motor/tipos.ts';
import { VERSAO_ESTADO } from '../motor/tipos.ts';
import { novaMemoria } from '../motor/memoria.ts';

export const CHAVE_SAVE = 'trajetoria';
export const VERSAO_SAVE = 1;

export interface Save {
  versao: number;
  vida: EstadoVida | null;
  memoria: MemoriaJogador;
  /** Vidas terminadas neste aparelho. */
  vidas: number;
}

const Genero = z.enum(['f', 'm']);
const Personagem = z.object({ nome: z.string(), genero: Genero });
const Numeros = z.record(z.string(), z.number());

const Entrada = z.object({
  id: z.number(),
  idade: z.number(),
  ano: z.number(),
  tipo: z.enum(['nascimento', 'evento', 'linha', 'morte']),
  texto: z.string(),
  eventoId: z.string().optional(),
  resumo: z.string().optional(),
  escolha: z.object({ indice: z.number(), texto: z.string(), resumo: z.string() }).optional(),
  resultado: z.string().optional(),
  causas: z.array(z.number()).optional(),
  deltas: Numeros.optional(),
  inflacao: z.number().optional(),
});

const Vida = z.object({
  versao: z.literal(VERSAO_ESTADO),
  semente: z.number(),
  rng: z.object({ s: z.number() }),
  pessoa: z.object({
    nome: z.string(),
    sobrenome: z.string(),
    genero: Genero,
    cidade: z.string(),
    uf: z.string(),
    profissaoMae: z.string(),
    profissaoPai: z.string(),
  }),
  personagens: z.record(z.string(), Personagem),
  anoNascimento: z.number(),
  idade: z.number(),
  ano: z.number(),
  atributos: z.object({ saude: z.number(), felicidade: z.number(), inteligencia: z.number(), aparencia: z.number() }),
  financas: z.object({
    dinheiro: z.number(),
    investido: z.number(),
    divida: z.number(),
    renda: z.number(),
    custo: z.number(),
    inflacao: z.number(),
  }),
  marcas: z.record(z.string(), z.object({ ano: z.number(), idade: z.number(), origem: z.number().nullable() })),
  agenda: z.array(z.object({ evento: z.string(), ano: z.number(), origem: z.number().nullable() })),
  vistos: z.record(z.string(), z.array(z.number())),
  linhasRecentes: z.array(z.number()),
  historico: z.array(Entrada),
  pendente: z
    .object({
      eventoId: z.string(),
      texto: z.string(),
      causas: z.array(z.number()),
      opcoes: z.array(z.object({ texto: z.string(), disponivel: z.boolean(), motivo: z.string().optional() })),
      inflacao: z.number().optional(),
    })
    .nullable(),
  vivo: z.boolean(),
  morte: z.object({ idade: z.number(), ano: z.number(), causa: z.string(), fonte: z.number().optional() }).nullable(),
  somaFelicidade: z.number(),
  proximoId: z.number(),
});

const Memoria = z.object({ vidas: z.number(), recencia: z.record(z.string(), z.number()) });

const EsquemaSave = z.object({
  versao: z.number(),
  vida: z.unknown(),
  memoria: z.unknown(),
  vidas: z.number().optional(),
});

export function saveVazio(): Save {
  return { versao: VERSAO_SAVE, vida: null, memoria: novaMemoria(), vidas: 0 };
}

/** Lê o save; qualquer problema vira um save vazio (mantendo o que der para manter). */
export function lerSave(texto: string | null, conteudo: Conteudo): Save {
  if (!texto) return saveVazio();
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return saveVazio();
  }
  const casca = EsquemaSave.safeParse(bruto);
  if (!casca.success) return saveVazio();
  const memoria = Memoria.safeParse(casca.data.memoria);
  const base: Save = { ...saveVazio(), memoria: memoria.success ? memoria.data : novaMemoria(), vidas: casca.data.vidas ?? 0 };
  if (casca.data.versao !== VERSAO_SAVE) return base;
  const vida = Vida.safeParse(casca.data.vida);
  if (!vida.success) return base;
  const v = vida.data as EstadoVida;
  // O conteúdo pode ter mudado desde o save: uma pendência para evento que não existe mais é descartada.
  if (v.pendente && !conteudo.porId.get(v.pendente.eventoId)?.escolhas) v.pendente = null;
  return { ...base, vida: v };
}

export function escreverSave(save: Save): string {
  return JSON.stringify(save);
}

/** localStorage pode não existir ou lançar (janela privada, armazenamento bloqueado). */
export function carregar(conteudo: Conteudo): Save {
  try {
    return lerSave(globalThis.localStorage?.getItem(CHAVE_SAVE) ?? null, conteudo);
  } catch {
    return saveVazio();
  }
}

export function salvar(save: Save): void {
  try {
    globalThis.localStorage?.setItem(CHAVE_SAVE, escreverSave(save));
  } catch {
    // Sem armazenamento, o jogo continua; só não lembra depois.
  }
}
