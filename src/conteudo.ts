/**
 * Conteúdo empacotado no bundle. O CI valida tudo com Zod (`npm run validar`)
 * antes do build; aqui só indexamos, sem carregar o Zod no celular.
 */
import { indexarConteudo, type Conteudo } from './motor/conteudo.ts';
import type { CausaMorte, Evento, InfoMarca, Linha, Mundo } from './motor/esquema.ts';
import linhas from '../conteudo/linhas.json';
import marcas from '../conteudo/marcas.json';
import mortes from '../conteudo/mortes.json';
import mundo from '../conteudo/mundo.json';

const arquivos = import.meta.glob<Evento[]>('../conteudo/eventos/*.json', { eager: true, import: 'default' });

export const conteudo: Conteudo = indexarConteudo({
  eventos: Object.keys(arquivos)
    .sort()
    .map((caminho) => ({ arquivo: caminho.replace('../conteudo/', ''), lista: arquivos[caminho]! })),
  linhas: linhas as unknown as Linha[],
  mortes: mortes as unknown as CausaMorte[],
  marcas: marcas as unknown as Record<string, InfoMarca>,
  mundo: mundo as unknown as Mundo,
});
