/**
 * As relações de quem joga com cada pessoa da vida. O estado guarda, por pessoa, o vínculo (o afeto), a confiança,
 * a mágoa e os anos sem contato. O resto sai do estado e do livro-razão, sem estado novo:
 * - o gosto (o que a pessoa ama), tirado do nome e do nascimento: o presente certo e o programa junto;
 * - o humor do ano (fúria, mágoa, abatimento, saudade, alegria, paz, distância);
 * - as lembranças: a melhor e a pior coisa que quem joga fez com a pessoa, para o texto lembrar ("de quando você…").
 * As regras do ano (familia.ts) fazem a mágoa passar no ritmo do perdão do traço, a confiança voltar devagar e o
 * tempo longe esfriar o vínculo; um storylet com a pessoa é contato (storylets.ts). Este módulo só lê.
 */
import { ehFilho, GOSTOS, type Gosto, type Humor } from './constantes.ts';
import type { Entidade, Entrada, EstadoVida } from './tipos.ts';

/** Quem tem relação com quem joga: as pessoas da vida (o bicho tem vínculo, não mágoa nem confiança). */
export function temRelacao(id: string, en: Entidade | undefined): en is Entidade {
  return en !== undefined && en.tipo === 'pessoa' && id !== 'eu';
}

/** O gosto da pessoa, sempre o mesmo para ela (o nome, o nascimento e o gênero dão a semente; não gasta sorteio). */
export function gostoDe(en: Entidade): Gosto {
  let h = 2166136261;
  for (const ch of `${en.nome}|${en.nascimento ?? 0}|${en.genero ?? ''}`) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return GOSTOS[(h >>> 0) % GOSTOS.length]!;
}

const tem = (en: Entidade, q: string): boolean => (en.q[q]?.v ?? 0) > 0;

/** Quem convive com quem joga no dia a dia: o ano não conta como ano sem contato. */
export function convivem(e: EstadoVida, id: string, en: Entidade): boolean {
  const eu = e.entidades['eu']!;
  if (id === 'amor') return tem(eu, 'namoro') || tem(eu, 'casado');
  if (ehFilho(id)) return e.ano - (en.nascimento ?? e.ano) < 18;
  if (id === 'mae' || id === 'pai') return !tem(en, 'ausente') && (e.idade < 18 || tem(eu, 'mora_com_pais'));
  if (id === 'avo') return tem(en, 'mora_junto') || e.idade < 12;
  if (id === 'amigo') return e.idade < 18;
  return false;
}

/** Como a pessoa está com quem joga agora. */
export function humorDe(e: EstadoVida, id: string, en: Entidade): Humor | '' {
  if (!temRelacao(id, en) || en.vivo === false) return '';
  const magoa = en.n['magoa'] ?? 0;
  const vinculo = en.n['vinculo'] ?? 50;
  if (magoa >= 60) return 'furia';
  if (magoa >= 30) return 'magoa';
  if (tem(en, 'doente')) return 'abatimento';
  if ((en.n['sem_contato'] ?? 0) >= 3 && vinculo >= 40 && !convivem(e, id, en)) return 'saudade';
  if (vinculo >= 72) return 'alegria';
  if (vinculo < 30) return 'distancia';
  return 'paz';
}

export interface Lembranca {
  entrada: number;
  idade: number;
  /** O que quem joga fez, no passado, sem sujeito ("emprestou dinheiro para Pedro"). */
  texto: string;
  peso: number;
}

/** O peso de uma entrada na relação: o afeto que ela deu, a mágoa que deixou (pesa mais) e a confiança. */
export function pesoNaRelacao(h: Entrada, id: string): number {
  let p = 0;
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || !m.c.startsWith(`${id}.`)) continue;
    if (m.c === `${id}.vinculo`) p += m.d;
    else if (m.c === `${id}.magoa`) p -= 1.2 * m.d;
    else if (m.c === `${id}.confianca`) p += 0.5 * m.d;
  }
  return p;
}

/** Só o que quem joga escolheu ou fez vira lembrança: o resumo dessas entradas completa "você…". */
function feitoPorQuemJoga(h: Entrada): string | undefined {
  if (h.escolha?.resumo) return h.escolha.resumo;
  if (h.tipo === 'acao' && h.causa === 'acao' && h.resumo) return h.resumo;
  return undefined;
}

/** Mínimo para virar lembrança: o que mexeu pouco na relação a pessoa não guarda. */
const PESO_DA_LEMBRANCA = 3;
/** O que a família decidiu na primeira infância não é lembrança do que quem joga fez. */
const IDADE_DA_LEMBRANCA = 5;

/** A melhor e a pior coisa que quem joga fez com a pessoa (a mais recente desempata). */
export function lembrancasDe(e: EstadoVida, id: string): { boa?: Lembranca; ruim?: Lembranca } {
  let boa: Lembranca | undefined;
  let ruim: Lembranca | undefined;
  for (const h of e.historico) {
    const texto = feitoPorQuemJoga(h);
    if (!texto || h.idade < IDADE_DA_LEMBRANCA) continue;
    const peso = pesoNaRelacao(h, id);
    if (peso >= PESO_DA_LEMBRANCA && (!boa || peso >= boa.peso)) boa = { entrada: h.id, idade: h.idade, texto, peso };
    if (peso <= -PESO_DA_LEMBRANCA && (!ruim || peso <= ruim.peso)) ruim = { entrada: h.id, idade: h.idade, texto, peso };
  }
  return { ...(boa ? { boa } : {}), ...(ruim ? { ruim } : {}) };
}

const escapar = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Como o texto chama a pessoa: o nome e o papel ("seu pai", "sua amiga Ana"), o mais longo primeiro. */
function nomesDe(id: string, en: Entidade): string[] {
  const papel = QUEM_PELO_PAPEL[id.replace(/\d+$/, '')];
  const ela = en.genero === 'f';
  const nomes = [en.nome];
  if (papel) nomes.push(ela ? papel[1] : papel[0]);
  if (id === 'amigo') nomes.push(`${ela ? 'sua amiga' : 'seu amigo'} ${en.nome}`);
  return nomes.sort((a, b) => b.length - a.length);
}

const QUEM_PELO_PAPEL: Record<string, readonly [string, string]> = {
  mae: ['seu pai', 'sua mãe'],
  pai: ['seu pai', 'sua mãe'],
  avo: ['seu avô', 'sua avó'],
  filho: ['seu filho', 'sua filha'],
};

/**
 * O que quem joga fez, contado do ponto de vista da pessoa: o nome e o papel dela viram pronome ("emprestou dinheiro
 * para Pedro" → "emprestou dinheiro para ele"; "cuidou de sua mãe doente" → "cuidou dela doente").
 */
export function semONome(texto: string, id: string, en: Entidade): string {
  const ela = en.genero === 'f';
  const fora = '(?<![\\p{L}])';
  const fim = '(?![\\p{L}])';
  let t = texto;
  for (const nome of nomesDe(id, en)) {
    const n = escapar(nome);
    t = t
      .replace(new RegExp(`${fora}d[oae] ${n}${fim}`, 'gu'), ela ? 'dela' : 'dele')
      .replace(new RegExp(`${fora}com [oa] ${n}${fim}`, 'gu'), ela ? 'com ela' : 'com ele')
      .replace(new RegExp(`${fora}${n}${fim}`, 'gu'), ela ? 'ela' : 'ele');
  }
  return t;
}

/**
 * "de quando você …, aos N": para o texto dizer que a pessoa lembra ("{ator:Ele|Ela} lembrou {ator.lembranca}"). Sem
 * lembrança forte, o que toda relação tem: a infância para a família, o começo para o amor e o amigo.
 */
export function deQuando(e: EstadoVida, id: string, en: Entidade, qual: 'boa' | 'ruim'): string {
  if (!temRelacao(id, en)) return '';
  const l = lembrancasDe(e, id)[qual];
  if (l) return `de quando você ${semONome(l.texto, id, en)}, aos ${l.idade}`;
  const eu = e.entidades['eu']!;
  if (qual === 'ruim') return 'das vezes em que você não apareceu';
  if (id === 'amor' || id === 'paixao') return 'do começo de vocês dois';
  if (id === 'amigo') return 'das besteiras que vocês faziam juntos';
  if (ehFilho(id)) return `de quando você ${en.genero === 'f' ? 'a' : 'o'} levava pela mão`;
  return `de quando você era ${eu.genero === 'f' ? 'pequena' : 'pequeno'}`;
}
