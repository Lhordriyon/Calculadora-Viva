/**
 * Junta os arquivos de conteúdo já lidos (do disco ou do bundle) num índice
 * pronto para o motor. Quem lê os arquivos é o chamador: o motor não sabe se
 * está no Node ou no navegador.
 */
import type { z } from 'zod';
import {
  ArquivoEventos,
  ArquivoLinhas,
  ArquivoMarcas,
  ArquivoMortes,
  Mundo,
  type CausaMorte,
  type Evento,
  type InfoMarca,
  type Linha,
} from './esquema.ts';
import { IDADE_MAXIMA } from './regras.ts';

export interface FontesConteudo {
  eventos: { arquivo: string; dados: unknown }[];
  linhas: unknown;
  mortes: unknown;
  marcas: unknown;
  mundo: unknown;
}

export interface Problema {
  nivel: 'erro' | 'aviso';
  onde: string;
  mensagem: string;
}

export interface Conteudo {
  eventos: Evento[];
  /** Arquivo de origem de cada evento (para mensagens do validador). */
  arquivoDe: Map<string, string>;
  porId: Map<string, Evento>;
  /** Eventos sorteáveis em cada idade (índice = idade). */
  sorteaveisPorIdade: Evento[][];
  linhas: Linha[];
  /** Índices das linhas possíveis em cada idade. */
  linhasPorIdade: number[][];
  mortes: CausaMorte[];
  marcas: Record<string, InfoMarca>;
  mundo: Mundo;
}

export class ErroConteudo extends Error {
  readonly problemas: Problema[];
  constructor(problemas: Problema[]) {
    super(problemas.map((p) => `${p.onde}: ${p.mensagem}`).join('\n'));
    this.name = 'ErroConteudo';
    this.problemas = problemas;
  }
}

function caminhoDe(path: readonly PropertyKey[]): string {
  return path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('');
}

function analisar<T>(esquema: z.ZodType<T>, dados: unknown, onde: string, problemas: Problema[]): T | null {
  const r = esquema.safeParse(dados);
  if (r.success) return r.data;
  for (const issue of r.error.issues) {
    problemas.push({ nivel: 'erro', onde: `${onde}${caminhoDe(issue.path)}`, mensagem: issue.message });
  }
  return null;
}

/** Lê e indexa; devolve problemas em vez de lançar. */
export function lerConteudo(fontes: FontesConteudo): { conteudo: Conteudo | null; problemas: Problema[] } {
  const problemas: Problema[] = [];
  const eventos: Evento[] = [];
  const arquivoDe = new Map<string, string>();
  const porId = new Map<string, Evento>();

  for (const { arquivo, dados } of fontes.eventos) {
    const lista = analisar(ArquivoEventos, dados, arquivo, problemas);
    if (!lista) continue;
    for (const ev of lista) {
      const anterior = arquivoDe.get(ev.id);
      if (anterior !== undefined) {
        problemas.push({ nivel: 'erro', onde: `${arquivo} › ${ev.id}`, mensagem: `id repetido (já existe em ${anterior})` });
        continue;
      }
      arquivoDe.set(ev.id, arquivo);
      porId.set(ev.id, ev);
      eventos.push(ev);
    }
  }
  const linhas = analisar(ArquivoLinhas, fontes.linhas, 'linhas.json', problemas);
  const mortes = analisar(ArquivoMortes, fontes.mortes, 'mortes.json', problemas);
  const marcas = analisar(ArquivoMarcas, fontes.marcas, 'marcas.json', problemas);
  const mundo = analisar(Mundo, fontes.mundo, 'mundo.json', problemas);

  if (!linhas || !mortes || !marcas || !mundo || problemas.some((p) => p.nivel === 'erro')) {
    return { conteudo: null, problemas };
  }

  const sorteaveisPorIdade: Evento[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) sorteaveisPorIdade.push([]);
  for (const ev of eventos) {
    if (ev.apenasAgendado || !ev.idade) continue;
    const [min, max] = ev.idade;
    for (let idade = min; idade <= Math.min(max, IDADE_MAXIMA); idade++) sorteaveisPorIdade[idade]!.push(ev);
  }

  const linhasPorIdade: number[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) linhasPorIdade.push([]);
  linhas.forEach((l, i) => {
    for (let idade = l.idade[0]; idade <= Math.min(l.idade[1], IDADE_MAXIMA); idade++) linhasPorIdade[idade]!.push(i);
  });

  return {
    conteudo: { eventos, arquivoDe, porId, sorteaveisPorIdade, linhas, linhasPorIdade, mortes, marcas, mundo },
    problemas,
  };
}

/** Lê e indexa; lança ErroConteudo se algo estiver inválido. */
export function montarConteudo(fontes: FontesConteudo): Conteudo {
  const { conteudo, problemas } = lerConteudo(fontes);
  if (!conteudo) throw new ErroConteudo(problemas.filter((p) => p.nivel === 'erro'));
  return conteudo;
}
