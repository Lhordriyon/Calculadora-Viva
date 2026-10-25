/**
 * Save no localStorage com versão de esquema. Se o formato mudar, VERSAO_SAVE
 * sobe; um save antigo ou corrompido nunca trava o jogo: a vida em andamento
 * recomeça (com um aviso na tela) e a memória entre vidas é preservada quando
 * ainda for legível. Cada vez que o jogo abre com um save bom, ele vira a cópia
 * de segurança (CHAVE_COPIA): se o principal estragar, o jogo volta para ela.
 * O mesmo texto sai e entra pelo menu (exportar e importar).
 */
import * as z from 'zod/mini';
import type { Conteudo } from '../motor/conteudo.ts';
import type { EstadoVida, MemoriaJogador } from '../motor/tipos.ts';
import { migrarFinanciamentos } from '../motor/bens.ts';
import { migrarExterior } from '../motor/diplomacia.ts';
import { migrarDividaSemContrato } from '../motor/dividas.ts';
import { generoDoNome } from '../motor/empresa.ts';
import { iniciarNumeros, migrarPais } from '../motor/pais.ts';
import { FILHOS, ehFilho } from '../motor/constantes.ts';
import { VERSAO_ESTADO } from '../motor/tipos.ts';
import { novaMemoria } from '../motor/memoria.ts';

export const CHAVE_SAVE = 'trajetoria';
/** A cópia do último save que abriu bem. */
export const CHAVE_COPIA = 'trajetoria:copia';
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

export const AVISO_COPIA =
  'O save deste aparelho estava estragado. O jogo voltou para a cópia da última vez que abriu; o que veio depois dela se perdeu.';

const Genero = z.enum(['f', 'm']);
const Numeros = z.record(z.string(), z.number());
const Textos = z.record(z.string(), z.string());

const Qualidade = z.object({ v: z.number(), ano: z.number(), idade: z.number(), causa: z.nullable(z.number()) });

const Entidade = z.object({
  id: z.string(),
  tipo: z.enum(['pessoa', 'animal', 'lugar', 'jurisdicao', 'empresa', 'bem', 'contrato', 'titulo']),
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
  /** A contraparte do dinheiro (de quem veio, para quem foi). Save antigo não tem: o extrato só mostra o que veio depois. */
  p: z.optional(z.string()),
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

/** A casca do save (JSON com versão, vida e memória, de qualquer versão), ou null: só um save assim vira cópia ou é importado. */
function cascaDe(texto: string | null): z.infer<typeof EsquemaSave> | null {
  if (!texto) return null;
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return null;
  }
  const lida = EsquemaSave.safeParse(bruto);
  return lida.success ? lida.data : null;
}

/** Lê o save; qualquer problema vira um save vazio (mantendo o que der para manter). */
export function lerSave(texto: string | null, conteudo: Conteudo): Save {
  const lida = cascaDe(texto);
  if (!lida) return saveVazio();
  return lerCasca(lida, conteudo);
}

function lerCasca(casca: z.infer<typeof EsquemaSave>, conteudo: Conteudo): Save {
  const lida = Memoria.safeParse(casca.memoria);
  const memoria: MemoriaJogador = lida.success ? { vidas: lida.data.vidas, recencia: lida.data.recencia, acoes: lida.data.acoes ?? {} } : novaMemoria();
  const base: Save = { ...saveVazio(), memoria, vidas: casca.vidas ?? 0 };
  const tinhaVida = casca.vida !== null && casca.vida !== undefined;
  if (casca.versao !== VERSAO_SAVE) return tinhaVida ? { ...base, aviso: AVISO_SAVE_ANTIGO } : base;
  if (!tinhaVida) return base;
  const vida = Vida.safeParse(casca.vida);
  if (!vida.success) return { ...base, aviso: AVISO_SAVE_ANTIGO };
  const v = vida.data as EstadoVida;
  // Antes da carteira, o investido era um número só: vira renda fixa (o jogador rebalanceia se quiser).
  for (const en of Object.values(v.entidades)) {
    const antigo = en.n['investido'];
    if (antigo === undefined) continue;
    if (antigo > 0) en.n['renda_fixa'] = (en.n['renda_fixa'] ?? 0) + antigo;
    delete en.n['investido'];
  }
  // Antes do país vivo, o país só tinha a fase: ganha as estatísticas típicas dela e um governo.
  migrarPais(v, conteudo);
  // Save de antes do país em números: o PIB e a população do ano, projetados sem sorteio.
  iniciarNumeros(v);
  // Antes do mundo lá fora, não havia países de fora nem dólar: eles chegam como os dados os descrevem.
  migrarExterior(v, conteudo);
  // Antes dos contratos, a dívida era um número em quem joga e no bem: vira o cheque especial e o financiamento de cada imóvel.
  migrarDividaSemContrato(v);
  migrarFinanciamentos(v, conteudo);
  // Antes do grupo, a empresa não tinha gênero: ganha o do nome ("o Instituto", "a Clínica").
  for (const en of Object.values(v.entidades)) if (en.tipo === 'empresa' && en.vivo !== false && !en.genero) en.genero = generoDoNome(v, en.nome);
  // Antes dos vários filhos, não havia a conta deles, e a adolescência e a formatura agendadas falavam do único filho.
  const eu = v.entidades['eu'];
  if (eu && eu.n['filhos'] === undefined) {
    const filhos = FILHOS.filter((id) => v.entidades[id]).length;
    if (filhos > 0) eu.n['filhos'] = filhos;
  }
  for (const a of v.agenda) if ((a.evento === 'filho_adolescente' || a.evento === 'filho_formatura') && !(a.ator && ehFilho(a.ator)) && v.entidades['filho']) a.ator = 'filho';
  // O conteúdo pode ter mudado desde o save: uma pendência que não bate mais com o storylet é descartada.
  if (v.pendente && conteudo.porId.get(v.pendente.storylet)?.escolhas?.length !== v.pendente.opcoes.length) v.pendente = null;
  return { ...base, vida: v };
}

export function escreverSave(save: Save): string {
  return JSON.stringify({ versao: save.versao, vida: save.vida, memoria: save.memoria, vidas: save.vidas });
}

/**
 * O save do aparelho: o principal, se abrir bem; se ele estiver estragado (ou sumiu) e a cópia não, a cópia, com
 * aviso. Também volta para a cópia quando só ela ainda tem a vida em andamento (a do principal não coube no esquema,
 * na mesma versão do jogo). `bom` diz se o principal abriu bem: aí ele vira a cópia nova.
 */
export function lerComCopia(principal: string | null, copia: string | null, conteudo: Conteudo): { save: Save; bom: boolean } {
  const doPrincipal = cascaDe(principal);
  const lido = doPrincipal ? lerCasca(doPrincipal, conteudo) : saveVazio();
  if (doPrincipal && !lido.aviso) return { save: lido, bom: true };
  const daCopia = cascaDe(copia);
  if (!daCopia) return { save: lido, bom: false };
  const reserva = lerCasca(daCopia, conteudo);
  if (!doPrincipal) return { save: { ...reserva, aviso: reserva.aviso ?? AVISO_COPIA }, bom: false };
  if (!lido.vida && reserva.vida && !reserva.aviso && daCopia.versao === doPrincipal.versao) return { save: { ...reserva, aviso: AVISO_COPIA }, bom: false };
  return { save: lido, bom: false };
}

/** Um save trazido de fora (o arquivo exportado): null se o texto não for um save do jogo, e nada muda. */
export function importarSave(texto: string, conteudo: Conteudo): Save | null {
  const lida = cascaDe(texto.trim());
  return lida ? lerCasca(lida, conteudo) : null;
}

/** localStorage pode não existir ou lançar (janela privada, armazenamento bloqueado). */
export function carregar(conteudo: Conteudo): Save {
  try {
    const principal = globalThis.localStorage?.getItem(CHAVE_SAVE) ?? null;
    const { save, bom } = lerComCopia(principal, globalThis.localStorage?.getItem(CHAVE_COPIA) ?? null, conteudo);
    if (bom && principal) guardarCopia(principal);
    return save;
  } catch {
    return saveVazio();
  }
}

function guardarCopia(texto: string): void {
  try {
    globalThis.localStorage?.setItem(CHAVE_COPIA, texto);
  } catch {
    // Sem espaço para a cópia: o principal continua valendo.
  }
}

let aGravar: Save | null = null;
let marcado = false;

/**
 * Grava quando o navegador tiver folga (no máximo meio segundo depois), para o toque responder antes: no fim de uma
 * vida longa, escrever o save custava um quinto do toque. Toques seguidos gravam uma vez só, o último.
 */
export function salvarDepois(save: Save): void {
  aGravar = save;
  if (marcado) return;
  marcado = true;
  const gravar = (): void => {
    marcado = false;
    gravarJa();
  };
  if (typeof globalThis.requestIdleCallback === 'function') globalThis.requestIdleCallback(gravar, { timeout: 500 });
  else setTimeout(gravar, 50);
}

/** Grava já o que estiver esperando (ao sair do app ou trocar de aba). */
export function gravarJa(): void {
  if (!aGravar) return;
  const save = aGravar;
  aGravar = null;
  salvar(save);
}

export function salvar(save: Save): void {
  try {
    globalThis.localStorage?.setItem(CHAVE_SAVE, escreverSave(save));
  } catch {
    // Sem armazenamento (ou cheio), o jogo continua; só não lembra depois.
  }
}
