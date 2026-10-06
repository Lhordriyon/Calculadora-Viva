/**
 * Robôs do túnel de vento. Cada um decide sempre do mesmo jeito; se um deles
 * vence em tudo, o jogo tem uma resposta certa e está quebrado.
 *
 * Valor de um desfecho: soma ponderada dos efeitos imediatos, mais o efeito
 * passivo das marcas gravadas (10 anos de horizonte), mais dinheiro (R$ 2 mil
 * de hoje ≈ 1 ponto), menos 200 se o desfecho mata.
 * Risco de uma escolha: incerteza (desvio-padrão do valor entre os desfechos)
 * mais exposição (saúde perdida, dívida contraída, chance de morrer). Gastar
 * dinheiro ou perder felicidade com certeza é custo, não risco.
 */
import type { Conteudo } from './conteudo.ts';
import type { Efeitos, Escolha } from './esquema.ts';
import { sortear, type Rng } from './rng.ts';
import type { EstadoVida } from './tipos.ts';
import { chanceDeSucesso } from './vida.ts';

export const ESTRATEGIAS = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'] as const;
export type Estrategia = (typeof ESTRATEGIAS)[number];

const HORIZONTE_MARCA = 10;
const HORIZONTE_RENDA = 5;
const REAIS_POR_PONTO = 2000;

function valorAtributos(x: { saude?: number | undefined; felicidade?: number | undefined; inteligencia?: number | undefined; aparencia?: number | undefined }): number {
  return (x.saude ?? 0) * 1.2 + (x.felicidade ?? 0) + (x.inteligencia ?? 0) * 0.6 + (x.aparencia ?? 0) * 0.5;
}

export function valorEfeitos(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo): number {
  if (!ef) return 0;
  let v = valorAtributos(ef);
  v += ((ef.dinheiro ?? 0) - (ef.divida ?? 0)) / REAIS_POR_PONTO;
  const f = e.financas;
  if (ef.dividaFator !== undefined) v += (f.divida * (1 - ef.dividaFator)) / REAIS_POR_PONTO;
  // Investir troca dinheiro parado (que encolhe) por dinheiro que rende: ~4% reais em 10 anos de horizonte.
  if (ef.investir && ef.investir > 0) v += (Math.min(ef.investir, f.dinheiro) * 0.48) / REAIS_POR_PONTO;
  if (ef.renda !== undefined) {
    const nova = typeof ef.renda === 'number' ? f.renda + ef.renda : ef.renda.definir;
    v += ((nova - f.renda) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  if (ef.custo !== undefined) {
    const novo = typeof ef.custo === 'number' ? f.custo + ef.custo : ef.custo.definir;
    v -= ((novo - f.custo) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  for (const m of ef.marcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && !(m in e.marcas)) v += valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  for (const m of ef.removerMarcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && m in e.marcas) v -= valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  if (ef.morte) v -= 200;
  return v;
}

export interface Avaliacao {
  esperado: number;
  risco: number;
}

/** Exposição de um conjunto de efeitos: saúde perdida (inclusive por marca), dívida, morte. */
function exposicao(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo): number {
  if (!ef) return 0;
  let x = Math.max(0, -(ef.saude ?? 0)) * 1.2 + Math.max(0, ef.divida ?? 0) / REAIS_POR_PONTO;
  for (const m of ef.marcas ?? []) {
    const s = c.marcas[m]?.porAno?.saude ?? 0;
    if (s < 0 && !(m in e.marcas)) x += -s * HORIZONTE_MARCA * 1.2;
  }
  if (ef.morte) x += 100;
  return x;
}

export function avaliarEscolha(esc: Escolha, e: EstadoVida, c: Conteudo): Avaliacao {
  const base = valorEfeitos(esc.efeitos, e, c);
  const baseX = exposicao(esc.efeitos, e, c);
  const desfechos: { p: number; v: number; x: number }[] = esc.teste
    ? [
        { p: chanceDeSucesso(esc.teste, e), r: esc.sucesso },
        { p: 1 - chanceDeSucesso(esc.teste, e), r: esc.fracasso },
      ].map(({ p, r }) => ({ p, v: base + valorEfeitos(r?.efeitos, e, c), x: baseX + exposicao(r?.efeitos, e, c) }))
    : [{ p: 1, v: base + valorEfeitos(esc.resultado?.efeitos, e, c), x: baseX + exposicao(esc.resultado?.efeitos, e, c) }];
  const esperado = desfechos.reduce((s, d) => s + d.p * d.v, 0);
  const variancia = desfechos.reduce((s, d) => s + d.p * (d.v - esperado) ** 2, 0);
  const expo = desfechos.reduce((s, d) => s + d.p * d.x, 0);
  return { esperado, risco: Math.sqrt(variancia) + expo };
}

/** Índice da escolha que a estratégia faz na pendência atual. */
export function decidir(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): number {
  const p = e.pendente;
  if (!p) throw new Error('Nada para decidir.');
  const disponiveis = p.opcoes.flatMap((o, i) => (o.disponivel ? [i] : []));
  const escolhas = c.porId.get(p.eventoId)?.escolhas;
  if (!escolhas || disponiveis.length === 0) return 0;
  if (estrategia === 'primeira') return disponiveis[0]!;
  if (estrategia === 'aleatoria') return sortear(rng, disponiveis);

  let melhor = disponiveis[0]!;
  let melhorAv = avaliarEscolha(escolhas[melhor]!, e, c);
  for (const i of disponiveis.slice(1)) {
    const av = avaliarEscolha(escolhas[i]!, e, c);
    const dif = estrategia === 'cautelosa' ? melhorAv.risco - av.risco : av.risco - melhorAv.risco;
    if (dif > 1e-9 || (Math.abs(dif) <= 1e-9 && av.esperado > melhorAv.esperado + 1e-9)) {
      melhor = i;
      melhorAv = av;
    }
  }
  return melhor;
}

/** Valor esperado de uma escolha, dimensão por dimensão (para achar falsos dilemas). */
interface Vetor {
  saude: number;
  felicidade: number;
  inteligencia: number;
  aparencia: number;
  dinheiro: number;
  morte: number;
  risco: number;
  marcas: string;
}

function vetorDe(esc: Escolha, e: EstadoVida, c: Conteudo): Vetor {
  const desfechos = esc.teste
    ? [
        { p: chanceDeSucesso(esc.teste, e), r: esc.sucesso },
        { p: 1 - chanceDeSucesso(esc.teste, e), r: esc.fracasso },
      ]
    : [{ p: 1, r: esc.resultado }];
  const v: Vetor = { saude: 0, felicidade: 0, inteligencia: 0, aparencia: 0, dinheiro: 0, morte: 0, risco: 0, marcas: '' };
  const marcas = new Set<string>();
  for (const { p, r } of desfechos) {
    for (const ef of [esc.efeitos, r?.efeitos]) {
      if (!ef) continue;
      v.saude += p * (ef.saude ?? 0);
      v.felicidade += p * (ef.felicidade ?? 0);
      v.inteligencia += p * (ef.inteligencia ?? 0);
      v.aparencia += p * (ef.aparencia ?? 0);
      v.dinheiro += p * valorEfeitos({ dinheiro: ef.dinheiro, divida: ef.divida, renda: ef.renda, custo: ef.custo }, e, c);
      if (ef.morte) v.morte += p;
      for (const m of [...(ef.marcas ?? []), ...(ef.removerMarcas ?? []).map((x) => `-${x}`), ...(ef.agendar ?? []).map((a) => `>${a.evento}`)]) marcas.add(m);
    }
  }
  v.risco = avaliarEscolha(esc, e, c).risco;
  v.marcas = [...marcas].sort().join(',');
  return v;
}

const DIMENSOES = ['saude', 'felicidade', 'inteligencia', 'aparencia', 'dinheiro'] as const;

function domina(a: Vetor, b: Vetor): boolean {
  if (a.marcas !== b.marcas) return false;
  let melhorEmAlgo = a.risco < b.risco - 1e-9 || a.morte < b.morte - 1e-9;
  if (a.risco > b.risco + 1e-9 || a.morte > b.morte + 1e-9) return false;
  for (const d of DIMENSOES) {
    if (a[d] < b[d] - 1e-9) return false;
    if (a[d] > b[d] + 1e-9) melhorEmAlgo = true;
  }
  return melhorEmAlgo;
}

/**
 * Falso dilema: uma escolha melhor ou igual às outras em tudo (efeitos esperados,
 * risco, mesmas marcas). Avaliado num estado típico de adulto, com atributos em 50.
 */
export function falsosDilemas(c: Conteudo, e: EstadoVida): { evento: string; escolha: number }[] {
  const achados: { evento: string; escolha: number }[] = [];
  for (const ev of c.eventos) {
    if (!ev.escolhas || ev.escolhas.length < 2) continue;
    const vetores = ev.escolhas.map((esc) => vetorDe(esc, e, c));
    const i = vetores.findIndex((a, k) => vetores.every((b, j) => j === k || domina(a, b)));
    if (i >= 0) achados.push({ evento: ev.id, escolha: i });
  }
  return achados;
}

/** Um estado típico para a idade de um evento (atributos médios daquela fase). */
export function estadoTipico(base: EstadoVida, idade: number): EstadoVida {
  const e = structuredClone(base);
  e.idade = idade;
  const crianca = idade < 18;
  e.atributos = {
    saude: crianca ? 85 : idade < 60 ? 65 : 45,
    felicidade: 60,
    inteligencia: crianca ? 30 + idade * 1.5 : 55,
    aparencia: 50,
  };
  e.financas = { ...e.financas, renda: crianca ? 0 : 30000, custo: crianca ? 0 : 18000, dinheiro: crianca ? 0 : 10000, investido: 0, divida: 0 };
  return e;
}

/**
 * Eventos em que arriscar nunca compensa: há opção com risco, mas a opção mais
 * segura também tem o maior valor esperado. (Armadilhas de propósito, como
 * apostar para recuperar o prejuízo, entram aqui e tudo bem; o número serve
 * para não deixar o jogo inteiro assim.)
 */
export function arriscarNaoCompensa(c: Conteudo, base: EstadoVida): string[] {
  const achados: string[] = [];
  for (const ev of c.eventos) {
    if (!ev.escolhas || ev.escolhas.length < 2) continue;
    const idade = ev.idade ? Math.round((ev.idade[0] + ev.idade[1]) / 2) : 30;
    const e = estadoTipico(base, idade);
    // Opções com condição são situacionais (dependem de marcas ou dinheiro): ficam de fora.
    const av = ev.escolhas.filter((esc) => !esc.condicoes).map((esc) => avaliarEscolha(esc, e, c));
    if (av.length < 2) continue;
    if (!av.some((a) => a.risco > 1e-9)) continue;
    const segura = av.reduce((m, a, i) => (a.risco < av[m]!.risco - 1e-9 || (Math.abs(a.risco - av[m]!.risco) <= 1e-9 && a.esperado > av[m]!.esperado) ? i : m), 0);
    if (av.every((a) => a.esperado <= av[segura]!.esperado + 1e-9)) achados.push(ev.id);
  }
  return achados;
}
