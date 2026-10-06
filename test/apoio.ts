/** Conteúdo de teste: o mundo, as linhas e as mortes reais, com eventos sob medida. */
import { lerFontes } from '../scripts/disco.ts';
import { montarConteudo, type Conteudo } from '../src/motor/conteudo.ts';

export function conteudoCom(eventos: unknown[], marcas: Record<string, unknown> = {}): Conteudo {
  const reais = lerFontes();
  return montarConteudo({ ...reais, eventos: [{ arquivo: 'teste.json', dados: eventos }], marcas });
}

export function escolhaSimples(texto: string, efeitos: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return { texto, resumo: texto.toLowerCase(), resultado: { texto: `${texto}!`, efeitos }, ...extra };
}
