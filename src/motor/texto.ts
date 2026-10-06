/**
 * Modelos de texto:
 *   {nome}            variável
 *   {o|a}             concordância com o gênero de quem joga (masculino|feminino)
 *   {amigo:o|a}       concordância com o gênero de um personagem
 *   [um|outro|mais]   alternância sorteada (combinatória barata contra repetição)
 */
import { sortear, type Rng } from './rng.ts';
import type { Genero } from './tipos.ts';

export interface ContextoTexto {
  rng: Rng;
  genero: Genero;
  /** Valor de uma variável ({nome}, {dinheiro}...), calculado só quando o texto pede. */
  variavel: (nome: string) => string | undefined;
  generoDe: (papel: string) => Genero | undefined;
}

const RE_ALTERNANCIA = /\[([^[\]]*)\]/g;
const RE_VARIAVEL = /\{([^{}]*)\}/g;

/** Divide as opções de uma alternância nos "|" que não estão dentro de {chaves}. */
function opcoesDe(corpo: string): string[] {
  const opcoes: string[] = [];
  let atual = '';
  let chaves = 0;
  for (const ch of corpo) {
    if (ch === '{') chaves++;
    else if (ch === '}') chaves--;
    if (ch === '|' && chaves === 0) {
      opcoes.push(atual);
      atual = '';
    } else {
      atual += ch;
    }
  }
  opcoes.push(atual);
  return opcoes;
}

export function renderizar(modelo: string, ctx: ContextoTexto): string {
  if (!modelo.includes('[') && !modelo.includes('{')) return modelo;
  const comAlternancias = modelo.replace(RE_ALTERNANCIA, (_m, corpo: string) => sortear(ctx.rng, opcoesDe(corpo)));
  return comAlternancias.replace(RE_VARIAVEL, (_m, corpo: string) => resolver(corpo, ctx));
}

function resolver(corpo: string, ctx: ContextoTexto): string {
  const doisPontos = corpo.indexOf(':');
  if (doisPontos >= 0) {
    const papel = corpo.slice(0, doisPontos);
    const [masc = '', fem = ''] = corpo.slice(doisPontos + 1).split('|');
    return ctx.generoDe(papel) === 'f' ? fem : masc;
  }
  if (corpo.includes('|')) {
    const [masc = '', fem = ''] = corpo.split('|');
    return ctx.genero === 'f' ? fem : masc;
  }
  return ctx.variavel(corpo) ?? 'alguém';
}

export interface AnaliseModelo {
  /** Variáveis simples usadas ({nome}, {preco}...). */
  variaveis: string[];
  /** Personagens usados em concordância ({amigo:o|a}). */
  concordancias: string[];
  erros: string[];
}

/** Lê um modelo sem renderizar: usado pelo validador. */
export function analisarModelo(modelo: string): AnaliseModelo {
  const erros: string[] = [];
  // Permitido: {variável} dentro de [alternância]. Proibido: [ dentro de [ ou de {, { dentro de {.
  const pilha: string[] = [];
  for (const ch of modelo) {
    if (ch === '[') {
      if (pilha.length > 0) erros.push('"[" aninhado');
      pilha.push('[');
    } else if (ch === '{') {
      if (pilha.includes('{')) erros.push('"{" aninhado');
      pilha.push('{');
    } else if (ch === ']' || ch === '}') {
      const esperado = ch === ']' ? '[' : '{';
      if (pilha.pop() !== esperado) erros.push(`"${ch}" sem abertura correspondente`);
    }
  }
  if (pilha.length > 0) erros.push('colchete ou chave sem fechamento');

  for (const m of modelo.matchAll(RE_ALTERNANCIA)) {
    const corpo = m[1] ?? '';
    if (opcoesDe(corpo).length < 2) erros.push(`alternância sem opções: [${corpo}]`);
  }

  const variaveis: string[] = [];
  const concordancias: string[] = [];
  for (const m of modelo.matchAll(RE_VARIAVEL)) {
    const corpo = m[1] ?? '';
    const doisPontos = corpo.indexOf(':');
    if (doisPontos >= 0) {
      concordancias.push(corpo.slice(0, doisPontos));
      if (corpo.slice(doisPontos + 1).split('|').length !== 2) erros.push(`concordância precisa de duas formas: {${corpo}}`);
    } else if (corpo.includes('|')) {
      if (corpo.split('|').length !== 2) erros.push(`concordância precisa de duas formas: {${corpo}}`);
    } else {
      variaveis.push(corpo);
    }
  }
  return { variaveis, concordancias, erros };
}

function umaCasa(x: number): string {
  const r = Math.round(x * 10) / 10;
  return Number.isInteger(r) ? String(r) : String(r).replace('.', ',');
}

/** "R$ 850", "R$ 4,5 mil", "R$ 45 mil", "R$ 1,2 milhão". */
export function formatarDinheiro(valor: number): string {
  const sinal = valor < 0 ? '-' : '';
  const v = Math.abs(valor);
  if (Math.round(v) < 1000) return `${sinal}R$ ${Math.round(v)}`;
  const mil = v / 1000;
  if (Math.round(mil) < 1000) return `${sinal}R$ ${mil < 10 ? umaCasa(mil) : Math.round(mil)} mil`;
  const mi = v / 1e6;
  if (Math.round(mi) < 1000) {
    const txt = mi < 10 ? umaCasa(mi) : String(Math.round(mi));
    return `${sinal}R$ ${txt} ${txt === '1' || mi < 2 ? 'milhão' : 'milhões'}`;
  }
  const bi = v / 1e9;
  const txt = bi < 10 ? umaCasa(bi) : String(Math.round(bi));
  return `${sinal}R$ ${txt} ${bi < 2 ? 'bilhão' : 'bilhões'}`;
}

/** Primeira letra maiúscula (para resumos que abrem frase). */
export function capitalizar(s: string): string {
  return s.length === 0 ? s : s[0]!.toLocaleUpperCase('pt-BR') + s.slice(1);
}
