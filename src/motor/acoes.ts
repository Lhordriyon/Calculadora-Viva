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

/** A ficha do ano já foi gasta (há uma ação registrada nesta idade). */
export function jaAgiu(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.idade === e.idade; i--) {
    if (e.historico[i]!.tipo === 'acao') return true;
  }
  return false;
}

/** Os verbos disponíveis agora, cada um com a ação que faria (sem os textos da interface). */
export function acoesPossiveis(e: EstadoVida, c: Conteudo): AcaoPossivel[] {
  if (!e.vivo || e.pendente || jaAgiu(e)) return [];
  const saida: AcaoPossivel[] = [];
  for (const verbo of VERBOS) {
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

/** Gasta a ficha do ano no verbo. Devolve a entrada da ação. */
export function agir(e: EstadoVida, c: Conteudo, verbo: Verbo): Entrada {
  if (!e.vivo || e.pendente) throw new Error('Agora não dá para agir.');
  if (jaAgiu(e)) throw new Error('A ficha deste ano já foi usada.');
  const a = melhorAcao(e, c, verbo);
  if (!a) throw new Error(`Não dá para ${verbo} agora.`);
  const repeticao = e.vistos[instanciaDe(a.s, a.ator)]?.at(-1) === e.idade - 1;
  return aplicarStorylet(e, c, a.s, a.ator, 'acao', { causas: causasDe(a.s.condicoes, e, a.ator), repeticao });
}
