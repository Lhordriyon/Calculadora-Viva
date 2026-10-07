/**
 * A ficha do ano: o jogador escolhe um verbo (estudar, trabalhar extra,
 * cuidar da saúde, visitar a família, sair, poupar) e o motor escolhe a ação
 * daquele verbo que mais combina com o estado (a mais específica; entre
 * iguais, a menos repetida). Só aparecem os verbos com alguma ação possível.
 * A escolha é determinística: o botão mostra exatamente o que vai acontecer.
 * Dos 18 aos 40 há duas fichas por ano (regras.ts › fichasDoAno), uma por
 * verbo diferente.
 */
import { causasDe, clausulas } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { VERBOS, type Verbo } from './constantes.ts';
import { contexto } from './contexto.ts';
import { preferidos } from './diretor.ts';
import type { Storylet } from './esquema.ts';
import { fichasDoAno } from './regras.ts';
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
  /** Nunca feita, nem nesta vida nem nas anteriores (a partir da segunda vida). */
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

export interface AcaoPossivel {
  verbo: Verbo;
  s: Storylet;
  ator: string | undefined;
}

/** A ação que o verbo faria agora (ou null, se o verbo não está disponível). */
export function melhorAcao(e: EstadoVida, c: Conteudo, verbo: Verbo): AcaoPossivel | null {
  let melhor: { s: Storylet; ator: string | undefined; nota: number } | null = null;
  for (const s of c.acoes.get(verbo) ?? []) {
    if (s.idade && (e.idade < s.idade[0] || e.idade > s.idade[1])) continue;
    for (const ator of preferidos(s, e, atoresPossiveis(s, e).filter((a) => elegivel(s, e, a)))) {
      const n = nota(s, e, ator);
      if (!melhor || n > melhor.nota + 1e-9) melhor = { s, ator, nota: n };
    }
  }
  return melhor ? { verbo, s: melhor.s, ator: melhor.ator } : null;
}

/** Os verbos já usados neste ano (as ações registradas nesta idade). */
export function verbosDoAno(e: EstadoVida, c: Conteudo): Set<Verbo> {
  const usados = new Set<Verbo>();
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.idade === e.idade; i--) {
    const h = e.historico[i]!;
    const verbo = h.tipo === 'acao' && h.ref ? c.porId.get(h.ref)?.verbo : undefined;
    if (verbo) usados.add(verbo);
  }
  return usados;
}

/** Quantas fichas deste ano já foram gastas. */
export function fichasUsadas(e: EstadoVida): number {
  let n = 0;
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.idade === e.idade; i--) if (e.historico[i]!.tipo === 'acao') n++;
  return n;
}

/** As fichas do ano acabaram. */
export function jaAgiu(e: EstadoVida): boolean {
  return fichasUsadas(e) >= fichasDoAno(e.idade);
}

/** Os verbos disponíveis agora, cada um com a ação que faria (sem os textos da interface). */
export function acoesPossiveis(e: EstadoVida, c: Conteudo): AcaoPossivel[] {
  if (!e.vivo || e.pendente || jaAgiu(e)) return [];
  const usados = verbosDoAno(e, c);
  const saida: AcaoPossivel[] = [];
  for (const verbo of VERBOS) {
    if (usados.has(verbo)) continue;
    const a = melhorAcao(e, c, verbo);
    if (a) saida.push(a);
  }
  return saida;
}

/** Para a interface: as ações possíveis com o rótulo do botão e a marca de novidade. */
export function acoesDisponiveis(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): AcaoDisponivel[] {
  return acoesPossiveis(e, c).map((a) => ({
    ...a,
    // O rótulo não pode gastar o sorteio da vida: usa um gerador à parte (e o validador proíbe alternâncias nele).
    rotulo: renderizar(a.s.rotulo ?? a.verbo, { ...contexto(e, { ator: a.ator }), rng: criarRng(0) }),
    // Na primeira vida tudo é novo: o selo só aparece depois, para o que nunca foi feito.
    novo: (memoria?.vidas ?? 0) > 0 && !memoria?.acoes[a.s.id] && !e.vistos[instanciaDe(a.s, a.ator)],
  }));
}

/** Gasta uma ficha do ano no verbo. Devolve a entrada da ação. */
export function agir(e: EstadoVida, c: Conteudo, verbo: Verbo): Entrada {
  if (!e.vivo || e.pendente) throw new Error('Agora não dá para agir.');
  if (jaAgiu(e)) throw new Error('As fichas deste ano já foram usadas.');
  if (verbosDoAno(e, c).has(verbo)) throw new Error('Esse verbo já foi usado este ano.');
  const a = melhorAcao(e, c, verbo);
  if (!a) throw new Error(`Não dá para ${verbo} agora.`);
  const repeticao = e.vistos[instanciaDe(a.s, a.ator)]?.at(-1) === e.idade - 1;
  return aplicarStorylet(e, c, a.s, a.ator, 'acao', { causas: causasDe(a.s.condicoes, e, a.ator), repeticao });
}
