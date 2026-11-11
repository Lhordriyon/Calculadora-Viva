/**
 * A governança (missão Capitalismo vivo, I-163): quem decide o dia a dia de cada empresa do grupo.
 *
 * - **A autonomia**: manual (quem joga decide tudo, como sempre foi), consultiva (o conselho sugere a jogada do ano na
 *   folha e não faz nada sozinho), delegada (o conselho toca o dia a dia: o preço, o salário, as verbas, crescer até um
 *   quarto, cortar, a geração nova do produto e a retirada) ou autônoma (também o crédito no banco e a exportação).
 * - **O mandato**: o jeito que quem joga deu ao conselho, conservador ou arrojado. O conselho decide pela mesma heurística
 *   do gestor e dos robôs (diretoria.ts › jogadasDoNegocio), no jeito do mandato, só dentro do que a autonomia deixa.
 * - Cada ano em que o conselho decide alguma coisa vira uma entrada no livro ("o conselho decidiu…"), com a decisão de
 *   quem joga que deu a autonomia de causa: o porquê aponta quem delegou.
 *
 * Os executivos com nome (o presidente do conselho, o diretor financeiro, o de operações, o de marketing, o de
 * tecnologia) não existem como pessoas: só o gestor da empresa de perto (diretoria.ts) tem rosto. Limite declarado.
 */
import type { Conteudo } from './conteudo.ts';
import { deFora } from './concorrentes.ts';
import { jogadasDoNegocio } from './diretoria.ts';
import { definirNumero, definirTexto, lancar, novaEntrada } from './livro.ts';
import { ehOperacaoDeNegocio, entradaQueMudou, motivoParaNaoOperarNegocio, operarNegocio, type OperacaoNegocio } from './negocio.ts';
import { criarRng, misturar } from './rng.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

export const AUTONOMIAS = ['manual', 'consultiva', 'delegada', 'autonoma'] as const;
export type Autonomia = (typeof AUTONOMIAS)[number];
export const MANDATOS = ['conservador', 'arrojado'] as const;
export type Mandato = (typeof MANDATOS)[number];

export const NOME_DA_AUTONOMIA: Record<Autonomia, string> = {
  manual: 'você decide tudo',
  consultiva: 'o conselho sugere',
  delegada: 'o conselho toca o dia a dia',
  autonoma: 'o conselho decide o negócio',
};
export const NOME_DO_MANDATO: Record<Mandato, string> = { conservador: 'conservador', arrojado: 'arrojado' };

/** O que o conselho pode decidir em cada autonomia (as jogadas do negócio; a retirada é a da folha). */
const PODE: Record<Autonomia, ReadonlySet<string>> = {
  manual: new Set(),
  consultiva: new Set(),
  delegada: new Set(['preco', 'salario', 'verbas', 'expandir', 'cortar', 'pagar', 'retirada', 'lancar']),
  autonoma: new Set(['preco', 'salario', 'verbas', 'expandir', 'cortar', 'pagar', 'retirada', 'lancar', 'emprestimo', 'exportar']),
};

export function autonomiaDe(emp: Entidade): Autonomia {
  const a = emp.t['autonomia'] as Autonomia | undefined;
  return a && (AUTONOMIAS as readonly string[]).includes(a) ? a : 'manual';
}

export function mandatoDe(emp: Entidade): Mandato {
  return emp.t['mandato'] === 'arrojado' ? 'arrojado' : 'conservador';
}

/** O jeito da heurística pelo mandato. */
function jeitoDoMandato(m: Mandato): 'cautelosa' | 'arriscada' {
  return m === 'arrojado' ? 'arriscada' : 'cautelosa';
}

/** O sorteio do conselho não gasta o da vida: no mesmo ano, a mesma empresa decide o mesmo (a folha e o ano batem). */
function sorteioDoConselho(e: EstadoVida, emp: Entidade): ReturnType<typeof criarRng> {
  return criarRng(misturar(e.semente, e.ano, 3307, emp.registro ?? 0));
}

/** Uma jogada do conselho: uma do negócio ou a retirada (a parte do lucro que sobe para os donos). */
export type JogadaDoConselho = OperacaoNegocio | { tipo: 'retirada'; fracao: number };

/** As jogadas que o conselho faria agora, dentro da autonomia `nivel` (a consultiva mostra as da delegada). */
export function jogadasDoConselho(e: EstadoVida, c: Conteudo, emp: Entidade, nivel: Autonomia = autonomiaDe(emp)): JogadaDoConselho[] {
  if (emp.q['holding'] || emp.vivo === false || emp.n['capacidade'] === undefined || deFora(emp)) return [];
  const pode = PODE[nivel === 'consultiva' ? 'delegada' : nivel];
  if (pode.size === 0) return [];
  const ops: JogadaDoConselho[] = [];
  const quer = (o: { tipo: string }): boolean => pode.has(o.tipo) && (o.tipo === 'retirada' || (ehOperacaoDeNegocio(o) && motivoParaNaoOperarNegocio(e, c, o) === null));
  for (const op of jogadasDoNegocio(jeitoDoMandato(mandatoDe(emp)), e, c, emp, sorteioDoConselho(e, emp), quer)) {
    if (op.tipo === 'retirada' && 'fracao' in op && Math.abs((emp.n['retirada'] ?? 0) - op.fracao) > 1e-9) ops.push({ tipo: 'retirada', fracao: op.fracao });
    else if (ehOperacaoDeNegocio(op)) ops.push(op);
  }
  return ops;
}

/**
 * O ano dos conselhos (depois do das empresas): cada empresa do grupo com autonomia delegada ou autônoma decide as
 * jogadas do jeito do mandato, e o ano de decisões vira uma entrada no livro, com a decisão de quem delegou de causa.
 */
export function anoDosConselhos(e: EstadoVida, c: Conteudo, empresas: readonly Entidade[]): void {
  for (const emp of empresas) {
    const nivel = autonomiaDe(emp);
    if (nivel !== 'delegada' && nivel !== 'autonoma') continue;
    const ops = jogadasDoConselho(e, c, emp, nivel);
    if (ops.length === 0) continue;
    const reg: Mudanca[] = [];
    const resumos: string[] = [];
    for (const op of ops) {
      if (op.tipo === 'retirada') {
        definirNumero(e, reg, emp.id, 'retirada', op.fracao);
        resumos.push(`passou a distribuir ${Math.round(op.fracao * 100)}% do lucro`);
        continue;
      }
      if (motivoParaNaoOperarNegocio(e, c, op) !== null) continue;
      resumos.push(operarNegocio(e, c, op, reg, emp.nome).resumo.replace(` de ${emp.nome}`, '').replace(` em ${emp.nome}`, '').replace(` ${emp.nome}`, ''));
    }
    if (reg.length === 0) continue;
    const causa = entradaQueMudou(e, `${emp.id}.autonomia`);
    const lista = resumos.length > 1 ? `${resumos.slice(0, -1).join(', ')} e ${resumos.at(-1)}` : (resumos[0] ?? 'mexeu no negócio');
    lancar(
      e,
      novaEntrada(e, {
        tipo: 'dinheiro',
        causa: 'regra',
        ref: 'conselho:decidiu',
        instancia: `conselho:decidiu#${emp.id}`,
        texto: `O conselho ${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome}, com o mandato ${NOME_DO_MANDATO[mandatoDe(emp)]} que você deu, ${lista}.`,
        resumo: `viu o conselho ${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome} decidir sozinho`,
        ...(causa !== null ? { causas: [causa] } : {}),
      }),
      reg,
    );
  }
}

// ---------------------------------------------------------------- a decisão de quem joga (folha do grupo, sem ficha)

export type OperacaoGovernanca = { tipo: 'governanca'; empresa: string; autonomia: Autonomia; mandato: Mandato };

export function ehOperacaoDeGovernanca(op: { tipo: string }): op is OperacaoGovernanca {
  return op.tipo === 'governanca';
}

export function motivoParaNaoOperarGovernanca(e: EstadoVida, op: OperacaoGovernanca): string | null {
  const emp = e.entidades[op.empresa];
  if (!emp || emp.tipo !== 'empresa' || emp.vivo === false || deFora(emp)) return 'a empresa não é do seu grupo';
  if (emp.q['holding']) return 'a holding não tem negócio para o conselho tocar';
  if (!(AUTONOMIAS as readonly string[]).includes(op.autonomia) || !(MANDATOS as readonly string[]).includes(op.mandato)) return 'escolha a autonomia e o mandato';
  if (autonomiaDe(emp) === op.autonomia && mandatoDe(emp) === op.mandato) return 'já é assim';
  return null;
}

export function operarGovernanca(e: EstadoVida, op: OperacaoGovernanca, reg: Mudanca[]): { texto: string; resumo: string } {
  const emp = e.entidades[op.empresa]!;
  if (autonomiaDe(emp) !== op.autonomia) definirTexto(e, reg, emp.id, 'autonomia', op.autonomia);
  if (mandatoDe(emp) !== op.mandato) definirTexto(e, reg, emp.id, 'mandato', op.mandato);
  const de = `${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome}`;
  if (op.autonomia === 'manual') return { texto: `Você voltou a decidir tudo ${de}: o conselho só assina.`, resumo: `voltou a decidir tudo ${de}` };
  return {
    texto: `O conselho ${de} recebeu um mandato ${NOME_DO_MANDATO[op.mandato]}: ${NOME_DA_AUTONOMIA[op.autonomia]}.`,
    resumo: `deu ao conselho ${de} um mandato ${NOME_DO_MANDATO[op.mandato]}`,
  };
}
