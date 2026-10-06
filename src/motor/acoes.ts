/**
 * A ficha do ano: o jogador escolhe um verbo (estudar, trabalhar extra,
 * cuidar da saúde, visitar a família, sair, poupar) e o motor escolhe a ação
 * daquele verbo que mais combina com o estado (a mais específica; entre
 * iguais, a menos repetida). Só aparecem os verbos com alguma ação possível.
 * A escolha é determinística: o botão mostra exatamente o que vai acontecer.
 */
import { causasDe, clausulas } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { VERBOS, type Verbo } from './constantes.ts';
import { contexto } from './contexto.ts';
import { preferidos } from './diretor.ts';
import type { Storylet } from './esquema.ts';
import { criarRng } from './rng.ts';
import { aplicarStorylet, atoresPossiveis, elegivel, instanciaDe } from './storylets.ts';
import { renderizar } from './texto.ts';
import type { Entrada, EstadoVida, MemoriaJogador } from './tipos.ts';

export interface AcaoDisponivel {
  verbo: Verbo;
  s: Storylet;
  ator: string | undefined;
  /** O que aparece no botão ("cursinho do ENEM"). */
  rotulo: string;
  /** Nunca feita, nem nesta vida nem nas anteriores. */
  novo: boolean;
}

/** Nome curto de cada verbo, para o botão. */
export const NOMES_VERBO: Record<Verbo, string> = {
  estudar: 'Estudar',
  trabalhar: 'Trabalhar extra',
  saude: 'Cuidar da saúde',
  familia: 'Ver a família',
  sair: 'Sair',
  poupar: 'Poupar',
};

function nota(s: Storylet, e: EstadoVida, ator: string | undefined): number {
  const vezes = e.vistos[instanciaDe(s, ator)]?.length ?? 0;
  return (1 + 0.5 * clausulas(s.condicoes)) * (s.peso ?? 1) / (1 + 0.15 * vezes);
}

export function acoesDisponiveis(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): AcaoDisponivel[] {
  if (!e.vivo || e.pendente) return [];
  const saida: AcaoDisponivel[] = [];
  for (const verbo of VERBOS) {
    let melhor: { s: Storylet; ator: string | undefined; nota: number } | null = null;
    for (const s of c.acoes.get(verbo) ?? []) {
      for (const ator of preferidos(s, e, atoresPossiveis(s, e).filter((a) => elegivel(s, e, a)))) {
        const n = nota(s, e, ator);
        if (!melhor || n > melhor.nota + 1e-9) melhor = { s, ator, nota: n };
      }
    }
    if (!melhor) continue;
    // O rótulo não pode gastar o sorteio da vida: usa um gerador à parte (e o validador proíbe alternâncias nele).
    const rotulo = renderizar(melhor.s.rotulo ?? verbo, { ...contexto(e, { ator: melhor.ator }), rng: criarRng(0) });
    const novo = !memoria?.acoes[melhor.s.id] && !e.vistos[instanciaDe(melhor.s, melhor.ator)];
    saida.push({ verbo, s: melhor.s, ator: melhor.ator, rotulo, novo });
  }
  return saida;
}

/** Gasta a ficha do ano no verbo. Devolve a entrada da ação. */
export function agir(e: EstadoVida, c: Conteudo, verbo: Verbo, memoria?: MemoriaJogador): Entrada {
  const a = acoesDisponiveis(e, c, memoria).find((x) => x.verbo === verbo);
  if (!a) throw new Error(`Não dá para ${verbo} agora.`);
  return aplicarStorylet(e, c, a.s, a.ator, 'acao', { causas: causasDe(a.s.condicoes, e, a.ator) });
}
