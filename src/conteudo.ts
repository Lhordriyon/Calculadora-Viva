/** Conteúdo empacotado no bundle (o motor não sabe de onde ele vem). */
import { montarConteudo, type Conteudo } from './motor/conteudo.ts';
import linhas from '../conteudo/linhas.json';
import marcas from '../conteudo/marcas.json';
import mortes from '../conteudo/mortes.json';
import mundo from '../conteudo/mundo.json';

const arquivos = import.meta.glob<unknown>('../conteudo/eventos/*.json', { eager: true, import: 'default' });

export const conteudo: Conteudo = montarConteudo({
  eventos: Object.keys(arquivos)
    .sort()
    .map((caminho) => ({ arquivo: caminho.replace('../conteudo/', ''), dados: arquivos[caminho] })),
  linhas,
  mortes,
  marcas,
  mundo,
});
