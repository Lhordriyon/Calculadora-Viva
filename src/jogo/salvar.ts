/**
 * Save no localStorage com versão de esquema. Se o formato mudar, VERSAO_SAVE
 * sobe; um save antigo ou corrompido nunca trava o jogo: a vida em andamento
 * recomeça (com um aviso na tela) e a memória entre vidas é preservada quando
 * ainda for legível.
 */
import * as z from 'zod/mini';
import type { Conteudo } from '../motor/conteudo.ts';
import type { EstadoVida, MemoriaJogador } from '../motor/tipos.ts';
import { VERSAO_ESTADO } from '../motor/tipos.ts';
import { novaMemoria } from '../motor/memoria.ts';

export const CHAVE_SAVE = 'trajetoria';
export const VERSAO_SAVE = 2;

export interface Save {
  versao: number;
  vida: EstadoVida | null;
  memoria: MemoriaJogador;
  /** Vidas terminadas neste aparelho. */
  vidas: number;
  /** Aviso para mostrar uma vez (save de uma versão antiga do jogo). Não é gravado. */
  aviso?: string;
}

export const AVISO_SAVE_ANTIGO =
  'O jogo mudou bastante desde a sua última visita e a vida em andamento não coube no formato novo. Ela recomeça do zero; a memória das vidas anteriores ficou.';

const Genero = z.enum(['f', 'm']);
const Numeros = z.record(z.string(), z.number());
const Textos = z.record(z.string(), z.string());

const Qualidade = z.object({ v: z.number(), ano: z.number(), idade: z.number(), causa: z.nullable(z.number()) });

const Entidade = z.object({
  id: z.string(),
  tipo: z.enum(['pessoa', 'animal', 'lugar', 'jurisdicao', 'empresa']),
  nome: z.string(),
  genero: z.optional(Genero),
  nascimento: z.optional(z.number()),
  vivo: z.optional(z.boolean()),
  morte: z.optional(z.number()),
  n: Numeros,
  t: Textos,
  q: z.record(z.string(), Qualidade),
});

const Mudanca = z.object({
  c: z.string(),
  d: z.optional(z.number()),
  q: z.optional(z.union([z.literal(1), z.literal(-1)])),
  t: z.optional(z.string()),
  r: z.optional(z.string()),
});

const Causa = z.enum(['nascimento', 'escolha', 'acao', 'diretor', 'npc', 'regra']);

const Entrada = z.object({
  id: z.number(),
  idade: z.number(),
  ano: z.number(),
  tipo: z.enum(['nascimento', 'evento', 'acao', 'dinheiro', 'npc', 'mundo', 'linha', 'regra', 'morte']),
  causa: Causa,
  ref: z.optional(z.string()),
  ator: z.optional(z.string()),
  instancia: z.optional(z.string()),
  texto: z.string(),
  resumo: z.optional(z.string()),
  escolha: z.optional(z.object({ indice: z.number(), texto: z.string(), resumo: z.string() })),
  resultado: z.optional(z.string()),
  causas: z.optional(z.array(z.number())),
  mudancas: z.optional(z.array(Mudanca)),
  inflacao: z.optional(z.number()),
});

const Antepassado = z.object({
  nome: z.string(),
  genero: Genero,
  anoNascimento: z.number(),
  anoMorte: z.number(),
  idade: z.number(),
  causa: z.string(),
  patrimonio: z.number(),
  deixou: z.number(),
});

const Vida = z.object({
  versao: z.literal(VERSAO_ESTADO),
  semente: z.number(),
  rng: z.object({ s: z.number() }),
  sobrenome: z.string(),
  anoNascimento: z.number(),
  idade: z.number(),
  ano: z.number(),
  entidades: z.record(z.string(), Entidade),
  agenda: z.array(z.object({ evento: z.string(), ano: z.number(), origem: z.nullable(z.number()), ator: z.optional(z.string()) })),
  vistos: z.record(z.string(), z.array(z.number())),
  linhasRecentes: z.array(z.number()),
  historico: z.array(Entrada),
  pendente: z.nullable(
    z.object({
      storylet: z.string(),
      ator: z.optional(z.string()),
      instancia: z.string(),
      causa: z.enum(['diretor', 'npc']),
      texto: z.string(),
      causas: z.array(z.number()),
      opcoes: z.array(z.object({ texto: z.string(), disponivel: z.boolean(), motivo: z.optional(z.string()) })),
      inflacao: z.optional(z.number()),
    }),
  ),
  vivo: z.boolean(),
  morte: z.nullable(z.object({ idade: z.number(), ano: z.number(), causa: z.string(), categoria: z.string(), fonte: z.optional(z.number()) })),
  somaFelicidade: z.number(),
  proximoId: z.number(),
  dinastia: z.optional(z.object({ geracao: z.number(), antepassados: z.array(Antepassado) })),
});

/** A memória da versão 1 não tinha `acoes`: lê as duas. */
const Memoria = z.object({ vidas: z.number(), recencia: Numeros, acoes: z.optional(Numeros) });

const EsquemaSave = z.object({
  versao: z.number(),
  vida: z.unknown(),
  memoria: z.unknown(),
  vidas: z.optional(z.number()),
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
  const lida = Memoria.safeParse(casca.data.memoria);
  const memoria: MemoriaJogador = lida.success ? { vidas: lida.data.vidas, recencia: lida.data.recencia, acoes: lida.data.acoes ?? {} } : novaMemoria();
  const base: Save = { ...saveVazio(), memoria, vidas: casca.data.vidas ?? 0 };
  const tinhaVida = casca.data.vida !== null && casca.data.vida !== undefined;
  if (casca.data.versao !== VERSAO_SAVE) return tinhaVida ? { ...base, aviso: AVISO_SAVE_ANTIGO } : base;
  if (!tinhaVida) return base;
  const vida = Vida.safeParse(casca.data.vida);
  if (!vida.success) return { ...base, aviso: AVISO_SAVE_ANTIGO };
  const v = vida.data as EstadoVida;
  // Antes da carteira, o investido era um número só: vira renda fixa (o jogador rebalanceia se quiser).
  for (const en of Object.values(v.entidades)) {
    const antigo = en.n['investido'];
    if (antigo === undefined) continue;
    if (antigo > 0) en.n['renda_fixa'] = (en.n['renda_fixa'] ?? 0) + antigo;
    delete en.n['investido'];
  }
  // O conteúdo pode ter mudado desde o save: uma pendência que não bate mais com o storylet é descartada.
  if (v.pendente && conteudo.porId.get(v.pendente.storylet)?.escolhas?.length !== v.pendente.opcoes.length) v.pendente = null;
  return { ...base, vida: v };
}

export function escreverSave(save: Save): string {
  return JSON.stringify({ versao: save.versao, vida: save.vida, memoria: save.memoria, vidas: save.vidas });
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
    // Sem armazenamento (ou cheio), o jogo continua; só não lembra depois.
  }
}
