/** Lê o conteúdo do disco (scripts e testes). O navegador usa src/conteudo.ts. */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Conteudo } from '../src/motor/conteudo.ts';
import { montarConteudo, type FontesConteudo } from '../src/motor/leitura.ts';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

function lerJson(caminho: string): unknown {
  const texto = readFileSync(caminho, 'utf8');
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`JSON inválido em ${caminho}: ${(e as Error).message}`);
  }
}

export function lerFontes(raiz = RAIZ): FontesConteudo {
  const dir = join(raiz, 'conteudo');
  const eventos = readdirSync(join(dir, 'eventos'))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ arquivo: `eventos/${f}`, dados: lerJson(join(dir, 'eventos', f)) }));
  return {
    eventos,
    linhas: lerJson(join(dir, 'linhas.json')),
    mortes: lerJson(join(dir, 'mortes.json')),
    marcas: lerJson(join(dir, 'marcas.json')),
    mundo: lerJson(join(dir, 'mundo.json')),
  };
}

export function carregarConteudo(raiz = RAIZ): Conteudo {
  return montarConteudo(lerFontes(raiz));
}
