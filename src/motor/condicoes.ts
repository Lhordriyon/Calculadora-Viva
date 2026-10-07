/**
 * Condições leem caminhos do estado: "saude" (de quem joga), "mae.saude",
 * "ator.vinculo", "lugar.desemprego". Qualidades são caminhos também
 * ("fumante", "mae.doente"). Compiladas uma vez por objeto.
 */
import { entidadeDe, ler, patrimonioDe, separar } from './campos.ts';
import type { Condicoes, ValorCondicao } from './esquema.ts';
import { formatarDinheiro } from './texto.ts';
import type { EstadoVida, Qualidade } from './tipos.ts';

type Faixa = { min?: number | undefined; max?: number | undefined };
type Teste = (e: EstadoVida, ator: string | undefined) => boolean;

/** Chaves que não são caminhos de campo. */
const ESPECIAIS = new Set(['marcas', 'algumaMarca', 'semMarcas', 'marcaHa', 'genero', 'inflacao']);

function dentro(valor: number, faixa: Faixa | undefined): boolean {
  if (!faixa) return true;
  if (faixa.min !== undefined && valor < faixa.min) return false;
  if (faixa.max !== undefined && valor > faixa.max) return false;
  return true;
}

export function qualidadeDe(e: EstadoVida, caminho: string, ator?: string): Qualidade | undefined {
  const { ent, campo } = separar(caminho);
  return e.entidades[entidadeDe(ent, ator)]?.q[campo];
}

export function tem(e: EstadoVida, caminho: string, ator?: string): boolean {
  return (qualidadeDe(e, caminho, ator)?.v ?? 0) > 0;
}

/** Compara o valor de um caminho com o que a condição pede. Entidade inexistente só atende "false". */
function compara(v: number | string | boolean | undefined, pedido: ValorCondicao): boolean {
  if (typeof pedido === 'boolean') {
    const verdade = typeof v === 'number' ? v > 0 : typeof v === 'string' ? v !== '' : v === true;
    return verdade === pedido;
  }
  if (v === undefined) return false;
  if (typeof pedido === 'string') return v === pedido;
  if (Array.isArray(pedido)) return typeof v === 'string' && pedido.includes(v);
  return typeof v === 'number' && dentro(v, pedido);
}

function caminhoDaChave(chave: string): string {
  return chave === 'inflacao' ? 'pais.inflacao' : chave;
}

function testarCaminho(caminho: string, pedido: ValorCondicao): Teste {
  const { ent, campo } = separar(caminho);
  return (e, ator) => compara(ler(e, entidadeDe(ent, ator), campo), pedido);
}

/** Lista só com as checagens que a condição usa (qualidades primeiro, que são as que mais eliminam). */
function compilar(cond: Condicoes): Teste {
  const testes: Teste[] = [];
  for (const m of cond.marcas ?? []) testes.push((e, a) => tem(e, m, a));
  for (const m of cond.semMarcas ?? []) testes.push((e, a) => !tem(e, m, a));
  if (cond.algumaMarca) {
    const ms = cond.algumaMarca;
    testes.push((e, a) => ms.some((m) => tem(e, m, a)));
  }
  for (const req of cond.marcaHa ?? []) {
    testes.push((e, a) => {
      const q = qualidadeDe(e, req.marca, a);
      return q !== undefined && q.v > 0 && dentro(e.idade - q.idade, req);
    });
  }
  if (cond.genero) {
    const g = cond.genero;
    testes.push((e) => e.entidades['eu']?.genero === g);
  }
  if (cond.inflacao) testes.push(testarCaminho('pais.inflacao', cond.inflacao));
  for (const [chave, pedido] of Object.entries(cond)) {
    if (ESPECIAIS.has(chave) || pedido === undefined) continue;
    testes.push(testarCaminho(chave, pedido as ValorCondicao));
  }
  return (e, ator) => {
    for (const t of testes) if (!t(e, ator)) return false;
    return true;
  };
}

const compiladas = new WeakMap<Condicoes, Teste>();

export function atende(cond: Condicoes | undefined, e: EstadoVida, ator?: string): boolean {
  if (!cond) return true;
  let teste = compiladas.get(cond);
  if (!teste) {
    teste = compilar(cond);
    compiladas.set(cond, teste);
  }
  return teste(e, ator);
}

/** Versão direta, sem cache (referência para os testes). */
export function atendeDireto(cond: Condicoes | undefined, e: EstadoVida, ator?: string): boolean {
  if (!cond) return true;
  if (cond.marcas && !cond.marcas.every((m) => tem(e, m, ator))) return false;
  if (cond.semMarcas && cond.semMarcas.some((m) => tem(e, m, ator))) return false;
  if (cond.algumaMarca && !cond.algumaMarca.some((m) => tem(e, m, ator))) return false;
  for (const req of cond.marcaHa ?? []) {
    const q = qualidadeDe(e, req.marca, ator);
    if (!q || q.v <= 0 || !dentro(e.idade - q.idade, req)) return false;
  }
  if (cond.genero && e.entidades['eu']?.genero !== cond.genero) return false;
  for (const [chave, pedido] of Object.entries(cond)) {
    if (pedido === undefined || (ESPECIAIS.has(chave) && chave !== 'inflacao')) continue;
    const { ent, campo } = separar(caminhoDaChave(chave));
    if (!compara(ler(e, entidadeDe(ent, ator), campo), pedido as ValorCondicao)) return false;
  }
  return true;
}

/** Quantas cláusulas a condição tem: mede a especificidade de um storylet. */
export function clausulas(cond: Condicoes | undefined): number {
  if (!cond) return 0;
  let n = 0;
  for (const [chave, v] of Object.entries(cond)) {
    if (v === undefined) continue;
    n += Array.isArray(v) && (chave === 'marcas' || chave === 'semMarcas' || chave === 'marcaHa') ? v.length : 1;
  }
  return n;
}

/** Qualidades que a condição exige (presentes): de quem joga ou de personagens. */
function qualidadesExigidas(cond: Condicoes, e: EstadoVida, ator: string | undefined): string[] {
  const nomes = [
    ...(cond.marcas ?? []),
    ...(cond.algumaMarca ?? []).filter((m) => tem(e, m, ator)),
    ...(cond.marcaHa ?? []).map((r) => r.marca),
  ];
  for (const [chave, pedido] of Object.entries(cond)) {
    if (ESPECIAIS.has(chave) || pedido === undefined) continue;
    const exige = pedido === true || (typeof pedido === 'object' && !Array.isArray(pedido) && (pedido.min ?? 0) > 0);
    if (exige && qualidadeDe(e, chave, ator)) nomes.push(chave);
  }
  return nomes;
}

/** Entradas que gravaram as qualidades que esta condição consultou. */
export function causasDe(cond: Condicoes | undefined, e: EstadoVida, ator?: string): number[] {
  if (!cond) return [];
  const causas: number[] = [];
  for (const m of new Set(qualidadesExigidas(cond, e, ator))) {
    const causa = qualidadeDe(e, m, ator)?.causa;
    if (causa !== undefined && causa !== null) causas.push(causa);
  }
  return causas;
}

/** Idade (de quem joga) em que a mais recente das qualidades consultadas foi gravada. */
export function idadeDaCausaMaisRecente(cond: Condicoes | undefined, e: EstadoVida, ator?: string): number | undefined {
  if (!cond) return undefined;
  let maior: number | undefined;
  for (const m of qualidadesExigidas(cond, e, ator)) {
    const q = qualidadeDe(e, m, ator);
    if (q && q.causa !== null && (maior === undefined || q.idade > maior)) maior = q.idade;
  }
  return maior;
}

/** Explica por que uma escolha está bloqueada (dinheiro; o resto fica implícito). */
export function motivoBloqueio(cond: Condicoes | undefined, e: EstadoVida): string | undefined {
  if (!cond) return undefined;
  const eu = e.entidades['eu']!;
  if (cond.dinheiro?.min !== undefined && (eu.n['dinheiro'] ?? 0) < cond.dinheiro.min) {
    return `precisa de ${formatarDinheiro(cond.dinheiro.min)}`;
  }
  if (cond.patrimonio?.min !== undefined) {
    const p = patrimonioDe(eu);
    if (p < cond.patrimonio.min) return `precisa de ${formatarDinheiro(cond.patrimonio.min)} guardados`;
  }
  if (cond.divida?.max !== undefined && (eu.n['divida'] ?? 0) > cond.divida.max) return 'dívida alta demais';
  return 'fora de alcance agora';
}
