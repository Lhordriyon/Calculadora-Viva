/**
 * Pontos de virada saem do livro-razão: cada entrada guarda quais entradas
 * anteriores a tornaram possível (qualidades consultadas, agendamentos), o
 * que forma um grafo. A causa com mais consequências, pesadas pelo impacto,
 * é a que mais mudou a vida. Causas podem ser do jogador (escolha, ação) ou
 * do mundo (o pai que perdeu o emprego, a avó que morreu).
 */
import { patrimonioDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { aleatorio, criarRng, misturar, sortear } from './rng.ts';
import { renderizar } from './texto.ts';
import type { Entrada, EstadoVida, Genero } from './tipos.ts';

export interface PontoDeVirada {
  origemId: number;
  idade: number;
  /** A causa, já com sujeito: "você trocou o ENEM por um bico", "seu pai perdeu o emprego". */
  causa: string;
  /** A causa veio do jogador (escolha ou ação) ou do mundo. */
  doJogador: boolean;
  consequenciaIdade: number;
  /** A consequência que melhor conta a história ("abriu uma hamburgueria com Bruno"). */
  consequencia: string;
  /** Quantas entradas descendem desta causa. */
  total: number;
}

export function descendentes(historico: Entrada[]): Map<number, Set<number>> {
  const filhos = new Map<number, number[]>();
  for (const en of historico) {
    for (const c of en.causas ?? []) {
      const lista = filhos.get(c);
      if (lista) lista.push(en.id);
      else filhos.set(c, [en.id]);
    }
  }
  const resultado = new Map<number, Set<number>>();
  for (const en of historico) {
    const vistos = new Set<number>();
    const pilha = [...(filhos.get(en.id) ?? [])];
    while (pilha.length > 0) {
      const id = pilha.pop()!;
      if (vistos.has(id)) continue;
      vistos.add(id);
      for (const f of filhos.get(id) ?? []) pilha.push(f);
    }
    resultado.set(en.id, vistos);
  }
  return resultado;
}

const PATRIMONIO = new Set(['eu.dinheiro', 'eu.investido', 'eu.divida']);

/** Quanto uma entrada mexeu na vida: atributos, patrimônio, renda, vínculos, morte. */
export function impacto(h: Entrada): number {
  let x = 0;
  let patrimonio = 0;
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || m.q !== undefined) {
      if (m.q !== undefined) x += 0.5;
      continue;
    }
    if (PATRIMONIO.has(m.c)) patrimonio += m.c === 'eu.divida' ? -m.d : m.d;
    else if (m.c === 'eu.renda') x += Math.abs(m.d) / 6000;
    else if (m.c.startsWith('eu.')) x += Math.abs(m.d);
    else if (m.c.endsWith('.vinculo')) x += Math.abs(m.d) / 3;
  }
  x += Math.abs(patrimonio) / 5000;
  if (h.tipo === 'morte') x += 30;
  if (h.ref === 'regra:faleceu') x += 10;
  return x;
}

/** A consequência que melhor conta a história: pesa o impacto e a distância no tempo. */
function melhorConsequencia(origem: Entrada, descendentes: Entrada[]): Entrada {
  let melhor = descendentes[0]!;
  let nota = -Infinity;
  for (const d of descendentes) {
    const n = (1 + impacto(d) / 3) * (1 + (d.idade - origem.idade) / 25);
    if (n > nota || (n === nota && d.idade > melhor.idade)) {
      melhor = d;
      nota = n;
    }
  }
  return melhor;
}

/** Texto da causa, com sujeito. Escolhas e ações são do jogador; o resto já vem com sujeito. */
function frase(h: Entrada): { texto: string; doJogador: boolean } | null {
  if (h.escolha) return { texto: `você ${h.escolha.resumo}`, doJogador: true };
  if (h.tipo === 'acao' && h.resumo) return { texto: `você ${h.resumo}`, doJogador: true };
  if (h.tipo === 'npc' && h.resumo) return { texto: h.resumo, doJogador: false };
  return null;
}

function consequenciaDe(h: Entrada): string {
  if (h.escolha) return h.escolha.resumo;
  if (h.tipo === 'acao' && h.resumo) return `você ${h.resumo}`;
  return h.resumo ?? h.texto;
}

export function pontosDeVirada(e: EstadoVida, limite = 3): PontoDeVirada[] {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const desc = descendentes(e.historico);
  const candidatos: { origem: Entrada; frase: { texto: string; doJogador: boolean }; ultima: Entrada; total: number; peso: number; alcance: number }[] = [];
  for (const en of e.historico) {
    const f = frase(en);
    if (!f) continue;
    const ids = desc.get(en.id);
    if (!ids || ids.size === 0) continue;
    const lista = [...ids].map((id) => porId.get(id)).filter((d): d is Entrada => d !== undefined && d.tipo !== 'regra');
    if (lista.length === 0) continue;
    const alcance = Math.max(...lista.map((d) => d.idade)) - en.idade;
    // Causas do jogador pesam um pouco mais: o cartão conta a vida que ele causou.
    const peso = lista.reduce((s, d) => s + 1 + impacto(d) / 5, 0) * (f.doJogador ? 1.25 : 1);
    candidatos.push({ origem: en, frase: f, ultima: melhorConsequencia(en, lista), total: lista.length, peso, alcance });
  }
  // Mais peso primeiro; empate, a que alcançou mais longe.
  candidatos.sort((a, b) => b.peso - a.peso || b.alcance - a.alcance || a.origem.idade - b.origem.idade);

  const escolhidos: PontoDeVirada[] = [];
  const consequenciasUsadas = new Set<number>();
  for (const c of candidatos) {
    if (consequenciasUsadas.has(c.ultima.id)) continue;
    consequenciasUsadas.add(c.ultima.id);
    escolhidos.push({
      origemId: c.origem.id,
      idade: c.origem.idade,
      causa: c.frase.texto,
      doJogador: c.frase.doJogador,
      consequenciaIdade: c.ultima.idade,
      consequencia: consequenciaDe(c.ultima),
      total: c.total,
    });
    if (escolhidos.length >= limite) break;
  }
  return escolhidos.sort((a, b) => a.idade - b.idade);
}

export interface ResumoVida {
  nome: string;
  nomeCompleto: string;
  genero: Genero;
  cidade: string;
  uf: string;
  anoNascimento: number;
  anoFinal: number;
  idade: number;
  vivo: boolean;
  causa: string | null;
  saude: number;
  /** Patrimônio em reais de hoje. */
  patrimonio: number;
  felicidadeMedia: number;
  eventos: number;
  /** "família pobre e acolhedora". */
  origem: string;
  pontos: PontoDeVirada[];
  epitafio: string;
}

/** "família pobre e acolhedora", "classe média, família religiosa". */
export function descreverOrigem(classe: string | undefined, familia: string | undefined): string {
  if (!classe || !familia) return classe ?? familia ?? '';
  const tipo = familia.replace(/^família /, '');
  return classe.startsWith('família ') ? `${classe} e ${tipo}` : `${classe}, família ${tipo}`;
}

export function resumirVida(e: EstadoVida, c: Conteudo): ResumoVida {
  const pontos = pontosDeVirada(e);
  const ctx = { ...contexto(e), rng: criarRng(misturar(e.semente, 0x5eed)) };
  const eu = e.entidades['eu']!;

  // Epitáfio: metade das vezes vem de uma qualidade de ponto de virada (se houver); senão, de qualquer
  // qualidade com epitáfio ou de um genérico, todos com a mesma chance.
  const origens = new Set(pontos.map((p) => p.origemId));
  const comEpitafio = Object.entries(eu.q).filter(([m]) => c.marcas[m]?.epitafio);
  const daVirada = comEpitafio.filter(([, q]) => q.causa !== null && origens.has(q.causa));
  const modelos = [...comEpitafio.map(([m]) => c.marcas[m]!.epitafio!), ...c.mundo.epitafios];
  const modelo =
    daVirada.length > 0 && aleatorio(ctx.rng) < 0.5 ? c.marcas[sortear(ctx.rng, daVirada)[0]]!.epitafio! : sortear(ctx.rng, modelos);

  const classe = c.mundo.classes[eu.n['classe_origem'] ?? 2];
  const familia = c.mundo.familias.find((f) => f.id === eu.t['familia']);
  const anos = Math.max(1, e.idade);
  return {
    nome: eu.nome,
    nomeCompleto: `${eu.nome} ${e.sobrenome}`,
    genero: eu.genero ?? 'm',
    cidade: e.entidades['lugar']?.nome ?? '',
    uf: e.entidades['lugar']?.t['uf'] ?? '',
    anoNascimento: e.anoNascimento,
    anoFinal: e.ano,
    idade: e.idade,
    vivo: e.vivo,
    causa: e.morte?.causa ?? null,
    saude: Math.round(eu.n['saude'] ?? 0),
    patrimonio: patrimonioDe(eu),
    felicidadeMedia: e.idade > 0 ? e.somaFelicidade / anos : (eu.n['felicidade'] ?? 0),
    eventos: e.historico.filter((h) => h.tipo === 'evento' || h.tipo === 'npc' || h.tipo === 'acao').length,
    origem: descreverOrigem(classe?.nome, familia?.nome),
    pontos,
    epitafio: renderizar(modelo, ctx),
  };
}
