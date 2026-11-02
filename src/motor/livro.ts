/**
 * Livro-razão: toda mutação do estado passa por aqui e fica registrada na
 * entrada que a causou (escolha, ação, diretor, personagem ou regra). Nada
 * muda sem deixar rastro: é daí que saem os pontos de virada, a crônica e a
 * métrica de quanto da vida o jogador causou.
 */
import { defCampo } from './campos.ts';
import { ATIVOS, CONTAS, PARCEIROS } from './constantes.ts';
import type { Entrada, EstadoVida, Mudanca, TipoEntidade } from './tipos.ts';

function limitar(v: number, limites: readonly [number, number] | undefined): number {
  if (!limites) return v;
  return v < limites[0] ? limites[0] : v > limites[1] ? limites[1] : v;
}

/** Os limites de um campo como ele fica guardado: o campo com base (a confiança) guarda a diferença para ela. */
function limitesGuardados(ent: string, campo: string): readonly [number, number] | undefined {
  const def = defCampo(ent, campo);
  if (!def?.limites || !def.base) return def?.limites;
  return [def.limites[0] - def.base, def.limites[1] - def.base];
}

/** Soma uma variação ao registro, juntando com a do mesmo caminho, regra e contraparte (o dinheiro diz de quem veio). */
export function anotar(reg: Mudanca[], c: string, d: number, r?: string, p?: string): void {
  if (d === 0) return;
  for (const m of reg) {
    if (m.c === c && m.r === r && m.p === p && m.d !== undefined && m.q === undefined && m.t === undefined) {
      m.d += d;
      return;
    }
  }
  const m: Mudanca = { c, d };
  if (r) m.r = r;
  if (p) m.p = p;
  reg.push(m);
}

/** Soma `delta` a um campo numérico (respeitando os limites do campo); devolve a variação real. */
export function somar(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, delta: number, r?: string, p?: string): number {
  const en = e.entidades[ent];
  if (!en || delta === 0 || !Number.isFinite(delta)) return 0;
  const antes = en.n[campo] ?? 0;
  const depois = limitar(antes + delta, limitesGuardados(ent, campo));
  en.n[campo] = depois;
  const d = depois - antes;
  anotar(reg, `${ent}.${campo}`, d, r, p);
  return d;
}

/**
 * Soma `total` de uma vez (a conta do estado é a de sempre) e anota as partes, cada uma com a sua contraparte: a
 * herança que vai uma parte para quem joga e o resto para os irmãos. A última parte é o que falta para o total
 * (inclusive o corte do limite do campo).
 */
export function somarRepartido(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, total: number, partes: { d: number; p: string; r?: string }[]): number {
  const en = e.entidades[ent];
  if (!en || total === 0 || !Number.isFinite(total)) return 0;
  const antes = en.n[campo] ?? 0;
  const depois = limitar(antes + total, limitesGuardados(ent, campo));
  en.n[campo] = depois;
  const d = depois - antes;
  let anotado = 0;
  partes.forEach((x, i) => {
    const v = i === partes.length - 1 ? d - anotado : x.d;
    anotar(reg, `${ent}.${campo}`, v, x.r, x.p);
    anotado += v;
  });
  return d;
}

/** Define um campo numérico pelo valor que se lê (o campo com base guarda a diferença para ela). */
export function definirNumero(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, valor: number, r?: string, p?: string): number {
  const atual = (e.entidades[ent]?.n[campo] ?? 0) + (defCampo(ent, campo)?.base ?? 0);
  return somar(e, reg, ent, campo, valor - atual, r, p);
}

export function definirTexto(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, valor: string, r?: string): void {
  const en = e.entidades[ent];
  if (!en || en.t[campo] === valor) return;
  en.t[campo] = valor;
  reg.push(r ? { c: `${ent}.${campo}`, t: valor, r } : { c: `${ent}.${campo}`, t: valor });
}

/** Ganha uma qualidade (se ainda não tem). Devolve true se ela é nova. */
export function ganhar(e: EstadoVida, reg: Mudanca[], ent: string, nome: string, causa: number | null, r?: string): boolean {
  const en = e.entidades[ent];
  if (!en || (en.q[nome]?.v ?? 0) > 0) return false;
  en.q[nome] = { v: 1, ano: e.ano, idade: e.idade, causa };
  reg.push(r ? { c: `${ent}.${nome}`, q: 1, r } : { c: `${ent}.${nome}`, q: 1 });
  return true;
}

/** Soma ao valor de uma qualidade numérica (cria se não existe). */
export function somarQualidade(e: EstadoVida, reg: Mudanca[], ent: string, nome: string, delta: number, causa: number | null, r?: string): void {
  const en = e.entidades[ent];
  if (!en || delta === 0) return;
  const q = en.q[nome];
  if (q && q.v > 0) {
    q.v += delta;
    if (q.v <= 0) {
      delete en.q[nome];
      reg.push(r ? { c: `${ent}.${nome}`, q: -1, r } : { c: `${ent}.${nome}`, q: -1 });
    } else {
      anotar(reg, `${ent}.${nome}`, delta, r);
    }
  } else if (delta > 0) {
    en.q[nome] = { v: delta, ano: e.ano, idade: e.idade, causa };
    reg.push(r ? { c: `${ent}.${nome}`, q: 1, r } : { c: `${ent}.${nome}`, q: 1 });
  }
}

export function perder(e: EstadoVida, reg: Mudanca[], ent: string, nome: string, r?: string): boolean {
  const en = e.entidades[ent];
  if (!en || !(nome in en.q)) return false;
  delete en.q[nome];
  reg.push(r ? { c: `${ent}.${nome}`, q: -1, r } : { c: `${ent}.${nome}`, q: -1 });
  return true;
}

/** Cria uma entrada no livro com id novo (quem chama decide se a empurra para o histórico). */
export function novaEntrada(e: EstadoVida, parcial: Omit<Entrada, 'id' | 'idade' | 'ano'>): Entrada {
  return { id: e.proximoId++, idade: e.idade, ano: e.ano, ...parcial };
}

/** Arredonda as variações (o save fica menor) e descarta as que viraram zero. */
export function fecharMudancas(reg: Mudanca[]): Mudanca[] {
  const out: Mudanca[] = [];
  for (const m of reg) {
    if (m.d !== undefined && m.q === undefined) {
      const d = Math.round(m.d * 100) / 100;
      if (d === 0) continue;
      out.push({ ...m, d });
    } else {
      out.push(m);
    }
  }
  return out;
}

const DO_PATRIMONIO = new Set<string>(['dinheiro', ...ATIVOS]);
const E_CONTA = new Set<string>(CONTAS);

const SEM_DINHEIRO = /^(bem|ctr|tit|prm)|^(lugar|pais|ilha|ator)$/;

/**
 * O tipo de uma entidade pelo id, mesmo que ela já tenha saído da vida (a empresa vendida, o colega do emprego que
 * acabou), como campos.ts › camposDe: o que não é empresa, conta, bem, contrato, título, promissória ou lugar é gente.
 */
export function tipoDe(e: EstadoVida, ent: string): TipoEntidade | undefined {
  const x = e.entidades[ent];
  if (x) return x.tipo;
  if (ent.startsWith('empresa')) return 'empresa';
  if (E_CONTA.has(ent)) return 'conta';
  return SEM_DINHEIRO.test(ent) || (PARCEIROS as readonly string[]).includes(ent) ? undefined : 'pessoa';
}

/**
 * Quanto uma mudança mexe no dinheiro do mundo (moeda.ts): a conta, o que se aplicou e, com o sinal trocado, a dívida
 * das pessoas; o caixa das empresas; o saldo das contas do país. Null quando o campo não é dinheiro (o valor de um bem,
 * de uma empresa ou de um título é patrimônio, não dinheiro).
 */
export function emDinheiro(tipo: TipoEntidade | undefined, campo: string, d: number): number | null {
  if (tipo === 'pessoa') return DO_PATRIMONIO.has(campo) ? d : campo === 'divida' ? -d : null;
  if (tipo === 'empresa') return campo === 'caixa' ? d : null;
  if (tipo === 'conta') return campo === 'dinheiro' ? d : null;
  return null;
}

/** A conta do país do lado de lá de uma mudança de dinheiro, quando a contraparte é de fora da vida. */
function contaDoOutroLado(e: EstadoVida, m: Mudanca, tipo: TipoEntidade): string | undefined {
  const p = m.p;
  // Quem chega à vida traz o dinheiro de fora dela (as famílias do país); quem sai leva de volta.
  if (!p) return tipo === 'pessoa' && (m.r === 'nascimento' || m.r === 'saida') ? 'mercado' : undefined;
  if (E_CONTA.has(p)) return p;
  // A inflação vai para quem emitiu; a cotação que mudou é o mercado que pagou (ou cobrou) por ela.
  if (p === 'reavaliacao') return m.r === 'inflacao' ? 'bc' : 'mercado';
  if (p === 'parentes') return 'mercado';
  if (e.entidades[p]?.tipo === 'jurisdicao') return p === 'pais' ? 'tesouro' : 'exterior';
  return undefined;
}

/**
 * O lado de lá (moeda.ts): o dinheiro que veio de uma conta do país (o salário, do mercado; o imposto, para o governo; o
 * juro, para os bancos) sai dela no mesmo lançamento, numa mudança por conta. Entre duas entidades da vida, quem mexe
 * anota os dois lados (contas.ts confere).
 */
function espelhar(e: EstadoVida, reg: Mudanca[]): void {
  if (!e.entidades['mercado']) return;
  let lado: Map<string, number> | undefined;
  for (const m of reg) {
    if (m.d === undefined || m.q !== undefined || m.r === 'espelho') continue;
    const ponto = m.c.indexOf('.');
    const ent = m.c.slice(0, ponto);
    const tipo = tipoDe(e, ent);
    if (!tipo || (tipo === 'conta' && m.r === 'nascimento')) continue;
    const v = emDinheiro(tipo, m.c.slice(ponto + 1), m.d);
    if (v === null) continue;
    const conta = contaDoOutroLado(e, m, tipo);
    if (!conta || conta === ent) continue;
    (lado ??= new Map()).set(conta, (lado.get(conta) ?? 0) - v);
  }
  if (!lado) return;
  for (const [conta, d] of lado) {
    const x = e.entidades[conta]!;
    x.n['dinheiro'] = (x.n['dinheiro'] ?? 0) + d;
    reg.push({ c: `${conta}.dinheiro`, d, r: 'espelho' });
  }
}

/** Registra uma entrada no histórico, já com as mudanças fechadas. */
export function lancar(e: EstadoVida, entrada: Entrada, reg: Mudanca[]): Entrada {
  espelhar(e, reg);
  const mudancas = fecharMudancas(reg);
  if (mudancas.length > 0) entrada.mudancas = mudancas;
  e.historico.push(entrada);
  return entrada;
}

/**
 * Uma cópia da vida para o motor mexer sem tocar na anterior (a interface guarda a anterior até a nova aparecer). O
 * livro só cresce: uma entrada lançada não muda mais (test/livro.test.ts congela o livro entre os toques e confere).
 * Então a cópia divide as entradas antigas com a anterior e copia só o resto (entidades, vistos, agenda), que o motor
 * altera no lugar. No fim de uma vida longa, o livro é quase todo o estado: a cópia inteira custava um quarto do toque.
 */
export function copiarVida(e: EstadoVida): EstadoVida {
  // O livro vazio no lugar dele mantém a ordem das chaves (o save sai igual ao da cópia inteira).
  const copia: EstadoVida = structuredClone({ ...e, historico: [] });
  copia.historico = e.historico.slice();
  return copia;
}
