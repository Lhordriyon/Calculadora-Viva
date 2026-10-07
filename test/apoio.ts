/** Conteúdo de teste: o mundo, as linhas e as mortes reais, com storylets sob medida. */
import { lerFontes } from '../scripts/disco.ts';
import type { Conteudo } from '../src/motor/conteudo.ts';
import { montarConteudo } from '../src/motor/leitura.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from '../src/motor/robos.ts';
import { criarRng, type Rng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { agir, avancarAno, escolher } from '../src/motor/vida.ts';

export function conteudoCom(storylets: unknown[], marcas: Record<string, unknown> = {}): Conteudo {
  const reais = lerFontes();
  return montarConteudo({ ...reais, storylets: [{ arquivo: 'teste.json', dados: storylets }], marcas });
}

export function escolhaSimples(texto: string, efeitos: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return { texto, resumo: texto.toLowerCase(), resultado: { texto: `${texto}!`, efeitos }, ...extra };
}

/** Um passo do jogo como o túnel e a interface jogam: escolhe, ou mexe no dinheiro, gasta a ficha e passa o ano. */
export function passo(e: EstadoVida, c: Conteudo, robo: Rng, estrategia: Estrategia = 'aleatoria'): void {
  if (e.pendente) {
    escolher(e, c, decidir(estrategia, e, c, robo));
    return;
  }
  for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) operar(e, c, op);
  // Até três fichas por ano: o robô age de novo enquanto houver ficha e ele quiser.
  for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) agir(e, c, a.verbo, a.escolha);
  if (e.vivo && !e.pendente) avancarAno(e, c);
}

export function viverAteOFim(e: EstadoVida, c: Conteudo, semente = 1, estrategia: Estrategia = 'aleatoria'): EstadoVida {
  const robo = criarRng(semente);
  while (e.vivo) passo(e, c, robo, estrategia);
  return e;
}
