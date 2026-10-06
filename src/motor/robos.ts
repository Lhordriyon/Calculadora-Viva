/**
 * Robôs do túnel de vento. Cada um decide sempre do mesmo jeito, nas escolhas
 * e na ficha do ano; se um deles vence em tudo, o jogo tem uma resposta certa
 * e está quebrado.
 *
 * Valor de um desfecho: soma ponderada dos efeitos imediatos, mais o efeito
 * passivo das qualidades gravadas (10 anos de horizonte), mais dinheiro (R$ 2
 * mil de hoje ≈ 1 ponto), mais vínculos (3 pontos ≈ 1), menos 200 se mata.
 * Risco: incerteza (desvio-padrão do valor entre os desfechos) mais exposição
 * (saúde perdida, dívida contraída, chance de morrer). Gastar dinheiro ou
 * perder felicidade com certeza é custo, não risco.
 */
import { acoesPossiveis } from './acoes.ts';
import { entidadeDe, separar } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import type { Verbo } from './constantes.ts';
import type { Efeitos, Escolha, Storylet } from './esquema.ts';
import { sortear, type Rng } from './rng.ts';
import { chanceDeSucesso } from './storylets.ts';
import type { EstadoVida } from './tipos.ts';

export const ESTRATEGIAS = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'] as const;
export type Estrategia = (typeof ESTRATEGIAS)[number];

const HORIZONTE_MARCA = 10;
const HORIZONTE_RENDA = 5;
const REAIS_POR_PONTO = 2000;
const VINCULO_POR_PONTO = 3;

function valorAtributos(x: { saude?: number | undefined; felicidade?: number | undefined; inteligencia?: number | undefined; aparencia?: number | undefined }): number {
  return (x.saude ?? 0) * 1.2 + (x.felicidade ?? 0) + (x.inteligencia ?? 0) * 0.6 + (x.aparencia ?? 0) * 0.5;
}

function dinheiroDe(e: EstadoVida, ent: string): number {
  return e.entidades[ent]?.n['dinheiro'] ?? 0;
}

export function valorEfeitos(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo, ator?: string): number {
  if (!ef) return 0;
  const eu = e.entidades['eu']!;
  let v = valorAtributos(ef);
  v += ((ef.dinheiro ?? 0) - (ef.divida ?? 0)) / REAIS_POR_PONTO;
  if (ef.dividaFator !== undefined) v += ((eu.n['divida'] ?? 0) * (1 - ef.dividaFator)) / REAIS_POR_PONTO;
  if (ef.patrimonioFator !== undefined) v += ((ef.patrimonioFator - 1) * (Math.max(0, eu.n['dinheiro'] ?? 0) + (eu.n['investido'] ?? 0))) / REAIS_POR_PONTO;
  // Investir troca dinheiro parado (que encolhe) por dinheiro que rende: ~4% reais em 10 anos de horizonte.
  if (ef.investir && ef.investir > 0) v += (Math.min(ef.investir, eu.n['dinheiro'] ?? 0) * 0.48) / REAIS_POR_PONTO;
  const renda = eu.n['renda'] ?? 0;
  if (ef.renda !== undefined) {
    const nova = typeof ef.renda === 'number' ? renda + ef.renda : ef.renda.definir;
    v += ((nova - renda) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  const custo = eu.n['custo'] ?? 0;
  if (ef.custo !== undefined) {
    const novo = typeof ef.custo === 'number' ? custo + ef.custo : ef.custo.definir;
    v -= ((novo - custo) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  for (const [chave, valor] of Object.entries(ef)) {
    if (!chave.includes('.') || typeof valor !== 'number') continue;
    const { ent, campo } = separar(chave);
    const id = entidadeDe(ent, ator);
    if (campo === 'vinculo') v += valor / VINCULO_POR_PONTO;
    else if (id === 'eu' && campo === 'dinheiro') v += valor / REAIS_POR_PONTO;
    else if (campo === 'saude' && id !== 'eu') v += valor * 0.15;
  }
  if (ef.transferir) {
    const t = ef.transferir;
    const de = entidadeDe(t.de, ator);
    const para = entidadeDe(t.para, ator);
    let valor = t.valor ?? Math.max(0, dinheiroDe(e, de)) * (t.fracao ?? 0);
    if (t.max !== undefined) valor = Math.min(valor, t.max);
    if (para === 'eu') v += valor / REAIS_POR_PONTO;
    if (de === 'eu') v -= valor / REAIS_POR_PONTO;
  }
  for (const m of ef.marcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && !(m in eu.q)) v += valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  for (const m of ef.removerMarcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && m in eu.q) v -= valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  if (ef.morte) v -= 200;
  return v;
}

export interface Avaliacao {
  esperado: number;
  risco: number;
}

/** Exposição de um conjunto de efeitos: saúde perdida (inclusive por qualidade), dívida, morte. */
function exposicao(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo): number {
  if (!ef) return 0;
  let x = Math.max(0, -(ef.saude ?? 0)) * 1.2 + Math.max(0, ef.divida ?? 0) / REAIS_POR_PONTO;
  if (ef.patrimonioFator !== undefined && ef.patrimonioFator < 1) {
    const eu = e.entidades['eu']!;
    x += ((1 - ef.patrimonioFator) * (Math.max(0, eu.n['dinheiro'] ?? 0) + (eu.n['investido'] ?? 0))) / REAIS_POR_PONTO;
  }
  for (const m of ef.marcas ?? []) {
    const s = c.marcas[m]?.porAno?.saude ?? 0;
    if (s < 0 && !(m in e.entidades['eu']!.q)) x += -s * HORIZONTE_MARCA * 1.2;
  }
  if (ef.morte) x += 100;
  return x;
}

type Corpo = Pick<Escolha, 'efeitos' | 'teste' | 'sucesso' | 'fracasso' | 'resultado'>;

export function avaliarEscolha(esc: Corpo, e: EstadoVida, c: Conteudo, ator?: string): Avaliacao {
  const base = valorEfeitos(esc.efeitos, e, c, ator);
  const baseX = exposicao(esc.efeitos, e, c);
  const desfechos: { p: number; v: number; x: number }[] = esc.teste
    ? [
        { p: chanceDeSucesso(esc.teste, e, ator), r: esc.sucesso },
        { p: 1 - chanceDeSucesso(esc.teste, e, ator), r: esc.fracasso },
      ].map(({ p, r }) => ({ p, v: base + valorEfeitos(r?.efeitos, e, c, ator), x: baseX + exposicao(r?.efeitos, e, c) }))
    : [{ p: 1, v: base + valorEfeitos(esc.resultado?.efeitos, e, c, ator), x: baseX + exposicao(esc.resultado?.efeitos, e, c) }];
  const esperado = desfechos.reduce((s, d) => s + d.p * d.v, 0);
  const variancia = desfechos.reduce((s, d) => s + d.p * (d.v - esperado) ** 2, 0);
  const expo = desfechos.reduce((s, d) => s + d.p * d.x, 0);
  return { esperado, risco: Math.sqrt(variancia) + expo };
}

function melhorPor(estrategia: 'cautelosa' | 'arriscada', avaliacoes: Avaliacao[]): number {
  let melhor = 0;
  for (let i = 1; i < avaliacoes.length; i++) {
    const a = avaliacoes[i]!;
    const m = avaliacoes[melhor]!;
    const dif = estrategia === 'cautelosa' ? m.risco - a.risco : a.risco - m.risco;
    if (dif > 1e-9 || (Math.abs(dif) <= 1e-9 && a.esperado > m.esperado + 1e-9)) melhor = i;
  }
  return melhor;
}

/** Índice da escolha que a estratégia faz na pendência atual. */
export function decidir(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): number {
  const p = e.pendente;
  if (!p) throw new Error('Nada para decidir.');
  const disponiveis = p.opcoes.flatMap((o, i) => (o.disponivel ? [i] : []));
  const escolhas = c.porId.get(p.storylet)?.escolhas;
  if (!escolhas || disponiveis.length === 0) return 0;
  if (estrategia === 'primeira') return disponiveis[0]!;
  if (estrategia === 'aleatoria') return sortear(rng, disponiveis);
  const av = disponiveis.map((i) => avaliarEscolha(escolhas[i]!, e, c, p.ator));
  return disponiveis[melhorPor(estrategia, av)]!;
}

function corpoDaAcao(s: Storylet): Corpo {
  return s.teste
    ? { efeitos: s.efeitos, teste: s.teste, sucesso: s.sucesso, fracasso: s.fracasso }
    : { efeitos: s.efeitos, resultado: { texto: '' } };
}

/** O verbo que a estratégia gasta na ficha do ano (null: deixa o ano passar). */
export function decidirAcao(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Verbo | null {
  const acoes = acoesPossiveis(e, c);
  if (acoes.length === 0) return null;
  if (estrategia === 'primeira') return acoes[0]!.verbo;
  if (estrategia === 'aleatoria') return sortear<Verbo | null>(rng, [...acoes.map((a) => a.verbo), null]);
  const av = [{ esperado: 0, risco: 0 }, ...acoes.map((a) => avaliarEscolha(corpoDaAcao(a.s), e, c, a.ator))];
  const i = melhorPor(estrategia, av);
  return i === 0 ? null : acoes[i - 1]!.verbo;
}

// ---------------------------------------------------------------- análise de dilemas

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
      const so: Record<string, unknown> = {};
      for (const k of ['dinheiro', 'divida', 'renda', 'custo'] as const) if (ef[k] !== undefined) so[k] = ef[k];
      v.dinheiro += p * valorEfeitos(so as Efeitos, e, c);
      if (ef.morte) v.morte += p;
      const outros = Object.keys(ef).filter((k) => k.includes('.')).map((k) => `${k}=${String(ef[k])}`);
      for (const m of [...(ef.marcas ?? []), ...(ef.removerMarcas ?? []).map((x) => `-${x}`), ...(ef.agendar ?? []).map((a) => `>${a.evento}`), ...outros]) marcas.add(m);
      if (ef.transferir) marcas.add(`$${ef.transferir.de}>${ef.transferir.para}`);
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
 * risco, mesmas qualidades). Avaliado num estado típico de adulto.
 */
export function falsosDilemas(c: Conteudo, e: EstadoVida): { evento: string; escolha: number }[] {
  const achados: { evento: string; escolha: number }[] = [];
  for (const s of c.storylets) {
    if (!s.escolhas || s.escolhas.length < 2) continue;
    const vetores = s.escolhas.map((esc) => vetorDe(esc, e, c));
    const i = vetores.findIndex((a, k) => vetores.every((b, j) => j === k || domina(a, b)));
    if (i >= 0) achados.push({ evento: s.id, escolha: i });
  }
  return achados;
}

/** Um estado típico para a idade de um storylet (atributos médios daquela fase). */
export function estadoTipico(base: EstadoVida, idade: number): EstadoVida {
  const e = structuredClone(base);
  e.idade = idade;
  e.ano = e.anoNascimento + idade;
  const crianca = idade < 18;
  const n = e.entidades['eu']!.n;
  Object.assign(n, {
    saude: crianca ? 85 : idade < 60 ? 65 : 45,
    felicidade: 60,
    inteligencia: crianca ? 30 + idade * 1.5 : 55,
    aparencia: 50,
    renda: crianca ? 0 : 30000,
    custo: crianca ? 0 : 18000,
    dinheiro: crianca ? 0 : 10000,
    investido: 0,
    divida: 0,
  });
  return e;
}

/**
 * Storylets em que arriscar nunca compensa: há opção com risco, mas a mais
 * segura também tem o maior valor esperado. (Armadilhas de propósito entram
 * aqui e tudo bem; o número serve para não deixar o jogo inteiro assim.)
 */
export function arriscarNaoCompensa(c: Conteudo, base: EstadoVida): string[] {
  const achados: string[] = [];
  for (const s of c.storylets) {
    if (!s.escolhas || s.escolhas.length < 2) continue;
    const idade = s.idade ? Math.round((s.idade[0] + s.idade[1]) / 2) : 30;
    const e = estadoTipico(base, idade);
    // Opções com condição são situacionais (dependem de qualidades ou dinheiro): ficam de fora.
    const av = s.escolhas.filter((esc) => !esc.condicoes).map((esc) => avaliarEscolha(esc, e, c));
    if (av.length < 2) continue;
    if (!av.some((a) => a.risco > 1e-9)) continue;
    const segura = av.reduce((m, a, i) => (a.risco < av[m]!.risco - 1e-9 || (Math.abs(a.risco - av[m]!.risco) <= 1e-9 && a.esperado > av[m]!.esperado) ? i : m), 0);
    if (av.every((a) => a.esperado <= av[segura]!.esperado + 1e-9)) achados.push(s.id);
  }
  return achados;
}
