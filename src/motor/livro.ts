/**
 * Livro-razão: toda mutação do estado passa por aqui e fica registrada na
 * entrada que a causou (escolha, ação, diretor, personagem ou regra). Nada
 * muda sem deixar rastro: é daí que saem os pontos de virada, a crônica e a
 * métrica de quanto da vida o jogador causou.
 */
import { defCampo } from './campos.ts';
import type { Entrada, EstadoVida, Mudanca } from './tipos.ts';

function limitar(v: number, limites: readonly [number, number] | undefined): number {
  if (!limites) return v;
  return v < limites[0] ? limites[0] : v > limites[1] ? limites[1] : v;
}

/** Soma uma variação ao registro, juntando com a do mesmo caminho e regra. */
export function anotar(reg: Mudanca[], c: string, d: number, r?: string): void {
  if (d === 0) return;
  for (const m of reg) {
    if (m.c === c && m.r === r && m.d !== undefined && m.q === undefined && m.t === undefined) {
      m.d += d;
      return;
    }
  }
  reg.push(r ? { c, d, r } : { c, d });
}

/** Soma `delta` a um campo numérico (respeitando os limites do campo); devolve a variação real. */
export function somar(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, delta: number, r?: string): number {
  const en = e.entidades[ent];
  if (!en || delta === 0 || !Number.isFinite(delta)) return 0;
  const antes = en.n[campo] ?? 0;
  const depois = limitar(antes + delta, defCampo(ent, campo)?.limites);
  en.n[campo] = depois;
  const d = depois - antes;
  anotar(reg, `${ent}.${campo}`, d, r);
  return d;
}

export function definirNumero(e: EstadoVida, reg: Mudanca[], ent: string, campo: string, valor: number, r?: string): number {
  const atual = e.entidades[ent]?.n[campo] ?? 0;
  return somar(e, reg, ent, campo, valor - atual, r);
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

/** Registra uma entrada no histórico, já com as mudanças fechadas. */
export function lancar(e: EstadoVida, entrada: Entrada, reg: Mudanca[]): Entrada {
  const mudancas = fecharMudancas(reg);
  if (mudancas.length > 0) entrada.mudancas = mudancas;
  e.historico.push(entrada);
  return entrada;
}
