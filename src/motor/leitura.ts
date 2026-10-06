/** Lê o conteúdo cru (JSON já carregado) com os esquemas Zod e indexa. Usado no Node. */
import type { z } from 'zod';
import { indexarConteudo, type Conteudo, type DadosConteudo, type Problema } from './conteudo.ts';
import { ArquivoEventos, ArquivoLinhas, ArquivoMarcas, ArquivoMortes, Mundo } from './esquema.ts';

export interface FontesConteudo {
  eventos: { arquivo: string; dados: unknown }[];
  linhas: unknown;
  mortes: unknown;
  marcas: unknown;
  mundo: unknown;
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
  const eventos: DadosConteudo['eventos'] = [];
  for (const { arquivo, dados } of fontes.eventos) {
    const lista = analisar(ArquivoEventos, dados, arquivo, problemas);
    if (lista) eventos.push({ arquivo, lista });
  }
  const linhas = analisar(ArquivoLinhas, fontes.linhas, 'linhas.json', problemas);
  const mortes = analisar(ArquivoMortes, fontes.mortes, 'mortes.json', problemas);
  const marcas = analisar(ArquivoMarcas, fontes.marcas, 'marcas.json', problemas);
  const mundo = analisar(Mundo, fontes.mundo, 'mundo.json', problemas);
  if (!linhas || !mortes || !marcas || !mundo || problemas.some((p) => p.nivel === 'erro')) {
    return { conteudo: null, problemas };
  }
  const conteudo = indexarConteudo({ eventos, linhas, mortes, marcas, mundo }, problemas);
  return { conteudo: problemas.some((p) => p.nivel === 'erro') ? null : conteudo, problemas };
}

/** Lê e indexa; lança ErroConteudo se algo estiver inválido. */
export function montarConteudo(fontes: FontesConteudo): Conteudo {
  const { conteudo, problemas } = lerConteudo(fontes);
  if (!conteudo) throw new ErroConteudo(problemas.filter((p) => p.nivel === 'erro'));
  return conteudo;
}
