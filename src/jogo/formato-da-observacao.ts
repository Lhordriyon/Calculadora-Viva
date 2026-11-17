/**
 * O arquivo da observação (etapa 03, I-199 e I-200): o que o menu exporta quando quem joga quer, e o que o
 * `npm run observatorio -- --arquivo=` lê. Tem formato e versão, diz a origem (jogador ou robô) e não guarda nomes:
 * só ids de storylets, de verbos e de operações, números e anos. Está pronto para uma análise que junte arquivos de
 * várias pessoas no futuro, sem fazer essa análise agora.
 */
import * as z from 'zod/mini';
import type { VidaObservada } from '../motor/observacao.ts';

export const FORMATO_DA_OBSERVACAO = 'trajetoria-observacao';
/** A chave do aparelho onde a observação fica, à parte do save (o save a apaga primeiro quando falta espaço). */
export const CHAVE_DA_OBSERVACAO = 'trajetoria:observacao';
export const VERSAO_DO_ARQUIVO = 1;

/** O que vai junto do arquivo, para quem o abrir saber o que é. */
export const AVISO_DO_ARQUIVO =
  'Observação do jeito de jogar no Trajetória, exportada por quem jogou. Não tem nome, cidade nem texto da vida: só o que foi decidido, o que estava disponível e o que mudou, em números. Ficava só no aparelho.';

const Registro = z.object({
  n: z.number(),
  ano: z.number(),
  idade: z.number(),
  tipo: z.enum(['escolha', 'acao', 'operacao', 'ano']),
  ref: z.string(),
  area: z.string(),
  areas: z.array(z.string()),
  antes: z.number(),
  efeito: z.object({ patrimonio: z.number(), felicidade: z.number(), influencia: z.number(), entradas: z.number() }),
  refs: z.array(z.string()),
});

const Foto = z.object({ ano: z.number(), idade: z.number(), patrimonio: z.number(), oportunidades: z.object({ elegiveis: z.number(), deEscala: z.number() }) });

const Vida = z.object({
  versao: z.number(),
  fonte: z.enum(['jogador', 'robo']),
  partida: z.string(),
  geracao: z.number(),
  semente: z.number(),
  inicio: z.number(),
  nascimento: z.number(),
  completa: z.boolean(),
  registros: z.array(Registro),
  anos: z.array(Foto),
});

const Arquivo = z.object({
  formato: z.literal(FORMATO_DA_OBSERVACAO),
  versao: z.number(),
  vidas: z.array(Vida),
});

/** O texto do arquivo (JSON), com a capa. */
export function escreverArquivoDeObservacao(vidas: readonly VidaObservada[], hoje = new Date()): string {
  return JSON.stringify({ formato: FORMATO_DA_OBSERVACAO, versao: VERSAO_DO_ARQUIVO, gerado: hoje.toISOString().slice(0, 10), aviso: AVISO_DO_ARQUIVO, vidas });
}

/** Lê um arquivo exportado; o que não tem o formato volta como erro, com o porquê. */
export function lerArquivoDeObservacao(texto: string): { vidas: VidaObservada[] } | { erro: string } {
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return { erro: 'o arquivo não é JSON' };
  }
  const r = Arquivo.safeParse(bruto);
  if (!r.success) return { erro: 'o arquivo não tem o formato da observação do Trajetória' };
  if (r.data.versao > VERSAO_DO_ARQUIVO) return { erro: `o arquivo é de uma versão mais nova (${r.data.versao})` };
  return { vidas: (bruto as { vidas: VidaObservada[] }).vidas };
}
