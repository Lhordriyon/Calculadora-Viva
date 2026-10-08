/**
 * As fichas do ano: o jogador escolhe um verbo (estudar, trabalhar extra,
 * cuidar da saúde, ver a família, sair, poupar) e, dentro dele, a ação que
 * quiser entre as possíveis agora; o botão do verbo já mostra a que mais
 * combina com o estado (a mais específica; entre iguais, a menos repetida).
 * A mesma ação não se repete no mesmo ano. Quantas fichas por ano: regras.ts ›
 * fichasDoAno.
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

export interface OpcaoDeAcao {
  s: Storylet;
  ator: string | undefined;
  /** O que aparece no botão ("cursinho do ENEM"). */
  rotulo: string;
  /** Nunca feita, nem nesta vida nem nas anteriores (a partir da segunda vida). */
  novo: boolean;
}

export interface AcaoDisponivel extends OpcaoDeAcao {
  verbo: Verbo;
  /** Todas as ações possíveis do verbo agora (a primeira é a do botão). */
  opcoes: OpcaoDeAcao[];
}

/** Nome curto de cada verbo, para o botão. */
export const NOMES_VERBO: Record<Verbo, string> = {
  estudar: 'Estudar',
  trabalhar: 'Trabalhar',
  saude: 'Cuidar-se',
  familia: 'Em família',
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

/** As instâncias de ação já feitas neste ano (a mesma ação não se repete no ano). */
export function feitasNoAno(e: EstadoVida): Set<string> {
  const feitas = new Set<string>();
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.idade === e.idade; i--) {
    const h = e.historico[i]!;
    if (h.tipo === 'acao' && h.ref) feitas.add(h.instancia ?? h.ref);
  }
  return feitas;
}

/** Todas as ações possíveis do verbo agora, da que mais combina com o estado para a que menos combina. */
export function acoesDoVerbo(e: EstadoVida, c: Conteudo, verbo: Verbo): AcaoPossivel[] {
  const feitas = feitasNoAno(e);
  const lista: { s: Storylet; ator: string | undefined; nota: number }[] = [];
  for (const s of c.acoes.get(verbo) ?? []) {
    if (s.idade && (e.idade < s.idade[0] || e.idade > s.idade[1])) continue;
    let melhor: { ator: string | undefined; nota: number } | null = null;
    for (const ator of preferidos(s, e, atoresPossiveis(s, e).filter((a) => elegivel(s, e, a)))) {
      if (feitas.has(instanciaDe(s, ator))) continue;
      const n = nota(s, e, ator);
      if (!melhor || n > melhor.nota + 1e-9) melhor = { ator, nota: n };
    }
    if (melhor) lista.push({ s, ...melhor });
  }
  // Ordem estável: nota, e entre iguais a ordem do conteúdo.
  return lista
    .map((x, i) => ({ ...x, i }))
    .sort((a, b) => b.nota - a.nota || a.i - b.i)
    .map((x) => ({ verbo, s: x.s, ator: x.ator }));
}

/** A ação que o verbo faria agora (ou null, se o verbo não está disponível). */
export function melhorAcao(e: EstadoVida, c: Conteudo, verbo: Verbo): AcaoPossivel | null {
  return acoesDoVerbo(e, c, verbo)[0] ?? null;
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
  const saida: AcaoPossivel[] = [];
  for (const verbo of VERBOS) {
    const a = melhorAcao(e, c, verbo);
    if (a) saida.push(a);
  }
  return saida;
}

function opcao(e: EstadoVida, a: AcaoPossivel, memoria?: MemoriaJogador): OpcaoDeAcao {
  return {
    s: a.s,
    ator: a.ator,
    // O rótulo não pode gastar o sorteio da vida: usa um gerador à parte (e o validador proíbe alternâncias nele).
    rotulo: renderizar(a.s.rotulo ?? a.verbo, { ...contexto(e, { ator: a.ator }), rng: criarRng(0) }),
    // Na primeira vida tudo é novo: o selo só aparece depois, para o que nunca foi feito.
    novo: (memoria?.vidas ?? 0) > 0 && !memoria?.acoes[a.s.id] && !e.vistos[instanciaDe(a.s, a.ator)],
  };
}

/** Para a interface: os verbos com a ação do botão, todas as opções de cada um e a marca de novidade. */
export function acoesDisponiveis(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): AcaoDisponivel[] {
  if (!e.vivo || e.pendente || jaAgiu(e)) return [];
  const saida: AcaoDisponivel[] = [];
  for (const verbo of VERBOS) {
    const todas = acoesDoVerbo(e, c, verbo);
    if (todas.length === 0) continue;
    const opcoes = todas.map((a) => opcao(e, a, memoria));
    saida.push({ verbo, ...opcoes[0]!, opcoes });
  }
  return saida;
}

/** Gasta uma ficha do ano no verbo: na ação escolhida (id do storylet e ator) ou, sem escolha, na do botão. */
export function agir(e: EstadoVida, c: Conteudo, verbo: Verbo, escolha?: { id: string; ator?: string | undefined }): Entrada {
  if (!e.vivo || e.pendente) throw new Error('Agora não dá para agir.');
  if (jaAgiu(e)) throw new Error('As fichas deste ano já foram usadas.');
  const todas = acoesDoVerbo(e, c, verbo);
  const a = escolha ? todas.find((x) => x.s.id === escolha.id && x.ator === escolha.ator) : todas[0];
  if (!a) throw new Error(`Não dá para ${verbo} agora.`);
  const repeticao = e.vistos[instanciaDe(a.s, a.ator)]?.at(-1) === e.idade - 1;
  return aplicarStorylet(e, c, a.s, a.ator, 'acao', { causas: causasDe(a.s.condicoes, e, a.ator), repeticao });
}
