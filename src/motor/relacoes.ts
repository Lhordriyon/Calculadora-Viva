/**
 * As relações de quem joga com cada pessoa da vida. O estado guarda, por pessoa, o vínculo (o afeto), a confiança,
 * a mágoa e os anos sem contato. O resto sai do estado e do livro-razão, sem estado novo:
 * - o gosto (o que a pessoa ama), tirado do nome e do nascimento: o presente certo e o programa junto;
 * - o humor do ano (fúria, mágoa, abatimento, saudade, alegria, paz, distância);
 * - as lembranças: a melhor e a pior coisa que quem joga fez com a pessoa, para o texto lembrar ("de quando você…");
 * - o que a pessoa acha de quem joga (a visão): o que ela viu você fazer com ela e com os seus filhos, os anos longe e
 *   as faltas, o que todo mundo sabe (a formatura, a fama, a fortuna, o cargo, a condenação) e o que só quem está perto
 *   sabe (o nome sujo, a aposta). Cada opinião aponta a entrada que mais pesou: o porquê.
 * As regras do ano (familia.ts) fazem a mágoa passar no ritmo do perdão do traço, a confiança voltar devagar, o
 * tempo longe esfriar o vínculo, anotam a falta e cuidam das vontades; um storylet com a pessoa é contato
 * (storylets.ts). Este módulo só lê.
 */
import { classeDoPatrimonio, patrimonioTotal, quemE } from './campos.ts';
import { ehFilho, ehIrmao, GOSTOS, papelBase, VISOES_RUINS, type Gosto, type Humor, type Visao } from './constantes.ts';
import type { Entidade, Entrada, EstadoVida, Ocupacao } from './tipos.ts';

// ---- quem era quem (a identidade de pessoas)

/** As ocupações de cada papel, montadas uma vez por lista (a lista só cresce; a cópia da vida monta de novo). */
const POR_PAPEL = new WeakMap<Ocupacao[], { n: number; mapa: Map<string, Ocupacao[]> }>();
function ocupacoesDe(e: EstadoVida, papel: string): Ocupacao[] | undefined {
  const lista = e.ocupacoes;
  if (!lista) return undefined;
  let idx = POR_PAPEL.get(lista);
  if (!idx || idx.n !== lista.length) {
    const mapa = new Map<string, Ocupacao[]>();
    for (const o of lista) {
      const l = mapa.get(o.papel);
      if (l) l.push(o);
      else mapa.set(o.papel, [o]);
    }
    idx = { n: lista.length, mapa };
    POR_PAPEL.set(lista, idx);
  }
  return idx.mapa.get(papel);
}

/**
 * Quem ocupava o papel naquela entrada: a chave da pessoa ("#3"); o próprio papel, quando ninguém registrou quem era
 * (o save de antes da identidade); null, com o papel vago.
 */
export function quemOcupava(e: EstadoVida, papel: string, entrada: number): string | null {
  const lista = ocupacoesDe(e, papel);
  if (!lista) return papel;
  let melhor: Ocupacao | undefined;
  for (const o of lista) if (o.desde <= entrada && (!melhor || o.desde >= melhor.desde)) melhor = o;
  if (!melhor) return papel;
  return melhor.pessoa === 0 ? null : `#${melhor.pessoa}`;
}

/** A chave da pessoa na memória: o número dela, quando ocupou o papel registrado; senão, o papel. */
export function chaveDaPessoa(e: EstadoVida, id: string, en: Entidade): string {
  return en.pessoa !== undefined && ocupacoesDe(e, id)?.some((o) => o.pessoa === en.pessoa) ? `#${en.pessoa}` : id;
}

/** Os papéis que a pessoa ocupou e quando ([de, ate)): o amor de antes que hoje é ex tem os dois. */
function intervalosDe(e: EstadoVida, pessoa: number): { papel: string; de: number; ate: number }[] {
  const saida: { papel: string; de: number; ate: number }[] = [];
  for (const o of e.ocupacoes ?? []) {
    if (o.pessoa !== pessoa) continue;
    let ate = Infinity;
    for (const x of ocupacoesDe(e, o.papel) ?? []) if (x.desde > o.desde && x.desde < ate) ate = x.desde;
    saida.push({ papel: o.papel, de: o.desde, ate });
  }
  return saida;
}

/**
 * A mudança de quem joga de lugar nos papéis de um save antigo (`pessoas.ts › moverPessoa` sem número) refaz quem era
 * quem no passado: as somas guardadas antes disso não valem mais.
 */
let refeitas = 0;
export function quemEraQuemMudou(): void {
  refeitas++;
}

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
  // Os irmãos dividem a casa enquanto quem joga mora com os pais e o irmão ainda não saiu de casa.
  if (ehIrmao(id)) return (e.idade < 18 || tem(eu, 'mora_com_pais')) && e.ano - (en.nascimento ?? e.ano) < 24 && !tem(en, 'mora_longe') && !tem(en, 'casado');
  return false;
}

/** Como a pessoa está com quem joga agora. */
export function humorDe(e: EstadoVida, id: string, en: Entidade): Humor | '' {
  if (!temRelacao(id, en) || en.vivo === false) return '';
  const magoa = en.n['magoa'] ?? 0;
  const vinculo = en.n['vinculo'] ?? 50;
  if (magoa >= 45) return 'furia';
  if (magoa >= 25) return 'magoa';
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

/** A entrada em que a pessoa chegou (nasceu, começou o namoro): o vínculo inicial não é algo que quem joga fez com ela. */
const CHEGADA = new Set(['nascimento', 'saida']);
function chegouNela(h: Entrada, id: string): boolean {
  return (h.mudancas ?? []).some((m) => m.r !== undefined && CHEGADA.has(m.r) && m.c.startsWith(`${id}.`));
}

/** O peso de uma entrada na relação: o afeto que ela deu, a mágoa que deixou (pesa mais) e a confiança. */
export function pesoNaRelacao(h: Entrada, id: string): number {
  if (chegouNela(h, id)) return 0;
  let p = 0;
  for (const m of h.mudancas ?? []) {
    // A pessoa que só trocou de papel (o amor que virou ex) leva os números dela: não é algo que quem joga fez.
    if (m.d === undefined || m.r === 'papel' || !m.c.startsWith(`${id}.`)) continue;
    if (m.c === `${id}.vinculo`) p += m.d;
    else if (m.c === `${id}.magoa`) p -= 1.2 * m.d;
    else if (m.c === `${id}.confianca`) p += 0.5 * m.d;
  }
  return p;
}

/** As faltas de quem joga que a regra anota (familia.ts): a pessoa lembra delas como coisa que você fez. */
export const OMISSOES: ReadonlySet<string> = new Set(['regra:nao_apareceu', 'regra:vontade_perdida']);

/**
 * Só o que quem joga escolheu, fez ou deixou de fazer vira lembrança: o resumo dessas entradas completa "você…" (o da
 * falta já vem com o sujeito, que sai).
 */
function feitoPorQuemJoga(h: Entrada): string | undefined {
  if (h.escolha?.resumo) return h.escolha.resumo;
  if (h.tipo === 'acao' && h.causa === 'acao' && h.resumo) return h.resumo;
  if (h.ref !== undefined && OMISSOES.has(h.ref) && h.resumo) return h.resumo.replace(/^você /, '');
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
  // Só o que foi desta pessoa: o amor de hoje não lembra do amor de antes, e o ex lembra de quando era o amor.
  const en = e.entidades[id];
  const intervalos = en && chaveDaPessoa(e, id, en) !== id ? intervalosDe(e, en.pessoa!) : null;
  for (const h of e.historico) {
    const texto = feitoPorQuemJoga(h);
    if (!texto || h.idade < IDADE_DA_LEMBRANCA) continue;
    let peso = 0;
    if (intervalos) {
      for (const x of intervalos) if (h.id >= x.de && h.id < x.ate) peso += pesoNaRelacao(h, x.papel);
    } else peso = pesoNaRelacao(h, id);
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
  // "sua amiga Ana", "seu irmão Pedro", "sua ex Carla"
  const comNome = quemE(id, en);
  if (!nomes.includes(comNome)) nomes.push(comNome);
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
  let t = texto;
  for (const nome of nomesDe(id, en)) {
    const [de, com, so] = expressoesDe(nome);
    t = t.replace(de, ela ? 'dela' : 'dele').replace(com, ela ? 'com ela' : 'com ele').replace(so, ela ? 'ela' : 'ele');
  }
  return t;
}

/** As expressões de cada nome, montadas uma vez ("de Pedro", "com o Pedro", "Pedro", sem pegar pedaço de palavra). */
const EXPRESSOES = new Map<string, readonly [RegExp, RegExp, RegExp]>();
function expressoesDe(nome: string): readonly [RegExp, RegExp, RegExp] {
  let r = EXPRESSOES.get(nome);
  if (!r) {
    const n = escapar(nome);
    const fora = '(?<![\\p{L}])';
    const fim = '(?![\\p{L}])';
    r = [new RegExp(`${fora}d[oae] ${n}${fim}`, 'gu'), new RegExp(`${fora}com [oa] ${n}${fim}`, 'gu'), new RegExp(`${fora}${n}${fim}`, 'gu')];
    EXPRESSOES.set(nome, r);
  }
  return r;
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

// ---- o que a pessoa acha de quem joga

/** O que é antigo pesa menos na opinião, mas não some: metade do peso a cada tantos anos. */
const MEIA_VIDA = 12;

type Eixo = 'afeto' | 'ferida' | 'palavraBem' | 'palavraMal' | 'deu' | 'pediu' | 'faltou' | 'filhosBem' | 'filhosMal';
const EIXOS: readonly Eixo[] = ['afeto', 'ferida', 'palavraBem', 'palavraMal', 'deu', 'pediu', 'faltou', 'filhosBem', 'filhosMal'];

/**
 * O que a pessoa viu quem joga fazer com ela, somado do livro. Cada parcela entra multiplicada por 2^(idade/MEIA_VIDA)
 * (a idade de quem joga na entrada): na leitura, 2^(-agora/MEIA_VIDA) dá o peso de hoje, e a soma anda com o livro.
 */
interface Visto {
  soma: Record<Eixo, number>;
  /** A entrada que mais pesou em cada eixo: o porquê da opinião. */
  porque: Partial<Record<Eixo, { entrada: number; peso: number }>>;
}

/** Gastar com a pessoa a partir disto (em reais de hoje) é generosidade que ela nota. */
const GASTO_QUE_CONTA = 500;
/** Como quem joga trata os filhos: o amor e os avós veem. */
const OS_FILHOS = '#filhos';
const CAMPOS_DA_RELACAO = new Set(['vinculo', 'magoa', 'confianca', 'dinheiro']);

function vistoDe(mapa: Map<string, Visto>, id: string): Visto {
  let v = mapa.get(id);
  if (!v) {
    v = { soma: Object.fromEntries(EIXOS.map((x) => [x, 0])) as Record<Eixo, number>, porque: {} };
    mapa.set(id, v);
  }
  return v;
}

function anotar(v: Visto, eixo: Eixo, entrada: number, peso: number): void {
  v.soma[eixo] += peso;
  const p = v.porque[eixo];
  if (!p || peso >= p.peso) v.porque[eixo] = { entrada, peso };
}

function somarEntrada(e: EstadoVida, mapa: Map<string, Visto>, h: Entrada): void {
  if (h.idade < IDADE_DA_LEMBRANCA || feitoPorQuemJoga(h) === undefined) return;
  const w = 2 ** (h.idade / MEIA_VIDA);
  let meuDinheiro = 0;
  const porPessoa = new Map<string, Record<string, number>>();
  const chegaram = new Set<string>();
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || m.r === 'papel') continue;
    const ponto = m.c.indexOf('.');
    const ent = m.c.slice(0, ponto);
    const campo = m.c.slice(ponto + 1);
    if (m.r !== undefined && CHEGADA.has(m.r)) chegaram.add(ent);
    if (ent === 'eu') {
      if (campo === 'dinheiro') meuDinheiro += m.d;
      continue;
    }
    if (!CAMPOS_DA_RELACAO.has(campo)) continue;
    const x = porPessoa.get(ent) ?? { vinculo: 0, magoa: 0, confianca: 0, dinheiro: 0 };
    x[campo]! += m.d;
    porPessoa.set(ent, x);
  }
  // A falta só conta como falta (o sumiço): a mágoa dela não faz de ninguém cabeça-quente, e a vontade que passou da
  // idade fica na lembrança, não na opinião.
  if (h.ref !== undefined && OMISSOES.has(h.ref)) {
    if (h.ref === 'regra:nao_apareceu' && h.ator) {
      const quem = quemOcupava(e, h.ator, h.id);
      if (quem) anotar(vistoDe(mapa, quem), 'faltou', h.id, w);
    }
    return;
  }
  for (const [id, x] of porPessoa) {
    if (chegaram.has(id)) continue;
    // A soma é da pessoa que ocupava o papel naquela entrada, não do papel.
    const quem = quemOcupava(e, id, h.id);
    if (!quem) continue;
    const v = vistoDe(mapa, quem);
    const vinculo = x['vinculo']!;
    const magoa = x['magoa']!;
    const confianca = x['confianca']!;
    const dinheiro = x['dinheiro']!;
    if (vinculo > 0) anotar(v, 'afeto', h.id, w * vinculo);
    if (magoa > 0) anotar(v, 'ferida', h.id, w * Math.min(2, magoa / 8));
    if (confianca > 0) anotar(v, 'palavraBem', h.id, w * confianca);
    if (confianca < 0) anotar(v, 'palavraMal', h.id, -w * confianca);
    // Deu: passou dinheiro para a pessoa, ou gastou de verdade com ela (o presente, a viagem).
    if (meuDinheiro < 0 && (dinheiro > 0 || (id === h.ator && vinculo > 0 && meuDinheiro <= -GASTO_QUE_CONTA))) anotar(v, 'deu', h.id, w);
    if (dinheiro < 0 && meuDinheiro > 0) anotar(v, 'pediu', h.id, w);
    if (ehFilho(id)) {
      const f = vistoDe(mapa, OS_FILHOS);
      if (vinculo > 0) anotar(f, 'filhosBem', h.id, w * vinculo);
      if (vinculo < 0 || magoa > 0) anotar(f, 'filhosMal', h.id, w * (Math.max(0, -vinculo) + Math.max(0, magoa) / 2));
    }
  }
}

/**
 * As somas do livro inteiro, guardadas pela última entrada somada. O livro só cresce e a entrada lançada não muda
 * (livro.ts › copiarVida): a soma de uma entrada vale para toda cópia da vida que a tem, e a próxima parte dela.
 */
const SOMAS = new WeakMap<Entrada, { mapa: Map<string, Visto>; refeitas: number }>();

function copiar(m: Map<string, Visto>): Map<string, Visto> {
  return new Map([...m].map(([k, v]) => [k, { soma: { ...v.soma }, porque: { ...v.porque } }]));
}

function vistos(e: EstadoVida): Map<string, Visto> {
  const h = e.historico;
  const ultima = h[h.length - 1];
  if (!ultima) return new Map();
  const valida = (x: { refeitas: number } | undefined): boolean => x !== undefined && x.refeitas === refeitas;
  const pronta = SOMAS.get(ultima);
  if (valida(pronta)) return pronta!.mapa;
  let i = h.length - 2;
  while (i >= 0 && !valida(SOMAS.get(h[i]!))) i--;
  const mapa = i >= 0 ? copiar(SOMAS.get(h[i]!)!.mapa) : new Map<string, Visto>();
  for (let j = i + 1; j < h.length; j++) somarEntrada(e, mapa, h[j]!);
  SOMAS.set(ultima, { mapa, refeitas });
  return mapa;
}

export interface Opiniao {
  visao: Visao;
  peso: number;
  /** A entrada que mais pesou (o porquê); sem ela, o porquê é o tempo longe. */
  entrada?: number;
}

const RUINS: ReadonlySet<string> = new Set(VISOES_RUINS);
/** O que machuca pesa mais na opinião do que o que agrada. */
const PESO_DO_QUE_DOI = 1.15;

/**
 * O que a pessoa acha de quem joga: as duas opiniões mais fortes, com o porquê. Vem do que ela viu (o livro), do que
 * todo mundo sabe e do que só quem está perto sabe. Sem história bastante, a pessoa ainda não tem opinião.
 */
export function visoesDe(e: EstadoVida, id: string, en: Entidade): Opiniao[] {
  // Quem morreu não forma opinião sobre o que veio depois (a lembrança fica).
  if (!temRelacao(id, en) || en.vivo === false) return [];
  const eu = e.entidades['eu']!;
  const papel = papelBase(id);
  const familia = papel === 'mae' || papel === 'pai' || papel === 'avo';
  const agora = 2 ** (-e.idade / MEIA_VIDA);
  const somas = vistos(e);
  const v = somas.get(chaveDaPessoa(e, id, en));
  const s = (eixo: Eixo): number => (v?.soma[eixo] ?? 0) * agora;
  const por = (eixo: Eixo): number | undefined => v?.porque[eixo]?.entrada;
  const opinioes: Opiniao[] = [];
  const dar = (visao: Visao, peso: number, entrada?: number | null): void => {
    opinioes.push({ visao, peso: RUINS.has(visao) ? peso * PESO_DO_QUE_DOI : peso, ...(entrada !== undefined && entrada !== null ? { entrada } : {}) });
  };
  const causa = (...marcas: string[]): number | null | undefined => marcas.map((m) => eu.q[m]).find((q) => (q?.v ?? 0) > 0)?.causa;

  // O que todo mundo sabe, e o que só quem está perto sabe.
  const perto = convivem(e, id, en) || (en.n['vinculo'] ?? 0) >= 55 || papel === 'amor';
  const classe = classeDoPatrimonio(patrimonioTotal(e));
  const subiu = classe >= 5 && classe > (eu.n['classe_origem'] ?? 2);
  const famoso = (eu.n['fama'] ?? 0) >= 50;
  const escandalo = tem(eu, 'condenado') || tem(eu, 'corrupto');
  const encrenca = escandalo ? 3 : perto && (tem(eu, 'nome_sujo') || tem(eu, 'apostador')) ? 2.5 : 0;

  const longe = en.n['sem_contato'] ?? 0;
  const faltou = s('faltou');
  const sumico = (longe >= 3 ? longe - 1 : 0) + 2.5 * faltou;
  // O ex não espera você por perto: a distância é o normal de quem se separou.
  if (sumico >= 2 && papel !== 'ex') dar((familia || papel === 'amigo') && (subiu || famoso) ? 'metido' : 'sumido', sumico, por('faltou'));
  const pediu = s('pediu');
  const deu = s('deu');
  // Pediu e não deu nada, nem afeto: "só aparece por dinheiro".
  if (pediu >= 0.9 && deu < 0.3 && s('afeto') < 10) dar('interesseiro', 1.5 + pediu, por('pediu'));
  const ferida = s('ferida');
  if (ferida >= 2.5) dar('cabeca_quente', ferida, por('ferida'));
  const palavra = s('palavraBem') - s('palavraMal');
  if (palavra <= -7) dar('sem_palavra', 1 - palavra / 5, por('palavraMal'));
  else if (palavra >= 10) dar('de_palavra', palavra / 5, por('palavraBem'));
  if ((eu.n['filhos'] ?? 0) > 0 && (familia || papel === 'amor')) {
    const f = somas.get(OS_FILHOS);
    const bem = (f?.soma.filhosBem ?? 0) * agora;
    const mal = (f?.soma.filhosMal ?? 0) * agora;
    if (mal - bem >= 4) dar('longe_dos_filhos', 2.5 + (mal - bem) / 6, f?.porque.filhosMal?.entrada);
    else if (bem >= 8 && mal < bem / 2) dar('cuida_dos_filhos', 1.5 + bem / 10, f?.porque.filhosBem?.entrada);
  }
  const afeto = s('afeto');
  if (papel === 'amor' || papel === 'filho') {
    if (tem(eu, 'workaholic')) dar('casado_com_o_trabalho', 3, causa('workaholic'));
    else if ((eu.n['nivel'] ?? 0) >= 3 && afeto < 5) dar('casado_com_o_trabalho', 2);
  }
  if (encrenca > 0) dar('perdido', encrenca, causa('condenado', 'corrupto', 'nome_sujo', 'apostador'));
  if (familia && ferida < 2 && faltou < 1 && encrenca === 0) {
    const feitos = (tem(eu, 'formado') ? 1.5 : 0) + ((eu.n['nivel'] ?? 0) >= 3 ? 1 : 0) + ((eu.n['fama'] ?? 0) >= 40 ? 1 : 0) + (subiu ? 1 : 0) + (eu.t['cargo'] ? 1 : 0);
    if (feitos >= 1.5) dar('orgulho', feitos + afeto / 20, causa('formado'));
  }
  if (deu >= 0.9) dar('generoso', 1.5 + deu, por('deu'));
  if (afeto >= 15 && longe < 3) dar('carinhoso', afeto / 7, por('afeto'));
  else if (afeto >= 6 && faltou < 0.5 && longe <= 1) dar('presente', 1.5 + afeto / 15, por('afeto'));
  return opinioes.sort((a, b) => b.peso - a.peso).slice(0, 2);
}

/** A opinião mais forte (o caminho `ator.visao` das condições e do texto); '' enquanto a pessoa não tem opinião. */
export function visaoDe(e: EstadoVida, id: string, en: Entidade): Visao | '' {
  return visoesDe(e, id, en)[0]?.visao ?? '';
}

/** O porquê da opinião, do ponto de vista da pessoa ("você pagou o conserto do carro dela, aos 31"). */
export function porqueDe(e: EstadoVida, id: string, en: Entidade, o: Opiniao): string {
  const h = o.entrada === undefined ? undefined : e.historico.find((x) => x.id === o.entrada);
  // Como na linha do tempo: o que quem joga fez, e o que uma regra contou dele (o nome que sujou), vêm sem sujeito.
  const feito = h && (feitoPorQuemJoga(h) ?? (h.tipo === 'acao' || h.tipo === 'dinheiro' || h.tipo === 'regra' ? h.resumo : undefined));
  if (h && feito) return `você ${semONome(feito, id, en)}, aos ${h.idade}`;
  // O que todo mundo soube (a formatura, a condenação) vem com o sujeito.
  if (h?.resumo) return `${semONome(h.resumo, id, en)}, aos ${h.idade}`;
  const longe = en.n['sem_contato'] ?? 0;
  if ((o.visao === 'sumido' || o.visao === 'metido') && longe >= 2) return `faz ${longe} anos que vocês não se falam`;
  return '';
}
