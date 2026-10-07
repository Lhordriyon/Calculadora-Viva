/**
 * Bens de quem joga: moradia (morar ou alugar, à vista ou financiada),
 * imóveis de renda, lazer, veículos, luxo e mídia, comprados pela folha
 * Dinheiro. Cada bem é uma entidade (`bem<id>`) com valor; o catálogo
 * (mundo.json › bens) diz o preço, a manutenção, quanto valoriza, quanto rende
 * de aluguel, a felicidade e a influência que dá e a qualidade que quem tem
 * ganha (o conteúdo reage a ela: o iate, a fazenda, o imóvel alugado).
 * Todo ano o valor anda (imóvel com o mercado do ano), a manutenção e a
 * parcela saem da conta e o aluguel entra.
 */
import { bensDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { movimentar } from './economia.ts';
import { liquidoDe, tirarDeQuemJoga } from './empresa.ts';
import type { DefBem } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, perder, somar } from './livro.ts';
import { novaEntidade } from './pessoas.ts';
import {
  ALUGUEL_DA_MORADIA,
  CUSTO_VENDA_IMOVEL,
  ECONOMIA_DA_MORADIA,
  ENTRADA_FINANCIAMENTO,
  JUROS_FINANCIAMENTO,
  PARCELA_FINANCIAMENTO,
  PISO_VEICULO,
} from './regras.ts';
import { normal } from './rng.ts';

/** O que um imóvel alugado rende num ano normal (o retorno do mercado de imóveis além disso vira valorização). */
const RENDA_NORMAL_IMOVEL = 0.06;
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

export type OperacaoBem =
  /** Compra um item do catálogo (imóvel financiável: 20% de entrada e o resto em parcelas). */
  | { tipo: 'comprar'; item: string; financiar?: boolean }
  | { tipo: 'venderBem'; id: string }
  /** Muda para este imóvel (sai do anterior). */
  | { tipo: 'morar'; id: string }
  | { tipo: 'alugar'; id: string; alugar: boolean };

export function ehOperacaoDeBem(op: { tipo: string }): op is OperacaoBem {
  return op.tipo === 'comprar' || op.tipo === 'venderBem' || op.tipo === 'morar' || op.tipo === 'alugar';
}

export function defBem(c: Conteudo, item: string | undefined): DefBem | undefined {
  return c.mundo.bens.find((b) => b.id === item);
}

export function defDoBem(c: Conteudo, b: Entidade): DefBem | undefined {
  return defBem(c, b.t['item']);
}

export function moradiaDe(e: EstadoVida): Entidade | undefined {
  return bensDe(e).find((b) => b.q['moradia']);
}

const IMOVEIS = new Set(['moradia', 'imovel', 'lazer']);

export function ehImovel(def: DefBem): boolean {
  return IMOVEIS.has(def.categoria);
}

/** Quanto rende por ano, alugado (fração do valor). */
export function taxaDeAluguel(def: DefBem): number {
  return def.aluguel ?? (def.categoria === 'moradia' || def.categoria === 'lazer' ? ALUGUEL_DA_MORADIA : 0);
}

/** O que sai na hora da compra (à vista, tudo; financiado, a entrada). */
export function custoDaCompra(def: DefBem, financiar: boolean): number {
  return financiar ? def.preco * ENTRADA_FINANCIAMENTO : def.preco;
}

/** A parcela anual de um financiamento deste bem (fixa: fração do que foi financiado). */
export function parcelaDe(def: DefBem): number {
  return def.preco * (1 - ENTRADA_FINANCIAMENTO) * PARCELA_FINANCIAMENTO;
}

/** "um apartamento", "uma casa". */
export function comArtigo(def: DefBem): string {
  return `${def.feminino ? 'uma' : 'um'} ${def.nome}`;
}

/** "o apartamento", "a casa". */
export function comDefinido(def: DefBem): string {
  return `${def.feminino ? 'a' : 'o'} ${def.nome}`;
}

export function motivoParaNaoOperarBem(e: EstadoVida, c: Conteudo, op: OperacaoBem): string | null {
  const eu = e.entidades['eu']!;
  if (op.tipo === 'comprar') {
    const def = defBem(c, op.item);
    if (!def) return 'escolha o que comprar';
    if (e.idade < (def.idade ?? 18)) return `só a partir dos ${def.idade ?? 18} anos`;
    const financiar = Boolean(op.financiar);
    if (financiar && !def.financiavel) return 'esse não dá para financiar';
    if (financiar && parcelaDe(def) > (eu.n['renda'] ?? 0) * 0.4) return `a parcela (${formatarDinheiro(parcelaDe(def) / 12)} por mês) passa de 40% da sua renda`;
    const custo = custoDaCompra(def, financiar);
    if (custo > liquidoDe(e) + 0.5) return `precisa de ${formatarDinheiro(custo)}`;
    return null;
  }
  const b = e.entidades[op.id];
  const def = b && b.tipo === 'bem' ? defDoBem(c, b) : undefined;
  if (!b || !def) return 'esse bem não é seu';
  if (op.tipo === 'morar') {
    if (def.categoria !== 'moradia') return 'não dá para morar aí';
    if (b.q['moradia']) return 'você já mora aí';
  }
  if (op.tipo === 'alugar') {
    if (taxaDeAluguel(def) <= 0) return 'isso não se aluga';
    if (op.alugar && b.q['moradia']) return 'você mora aí';
    if (op.alugar === Boolean(b.q['alugado'])) return 'já é assim';
  }
  return null;
}

/** Morar no próprio imóvel tira o aluguel do custo de vida (volta quando sai). */
function morarEm(e: EstadoVida, reg: Mudanca[], b: Entidade, origem: number): void {
  const eu = e.entidades['eu']!;
  const economia = Math.min((eu.n['custo'] ?? 0) * ECONOMIA_DA_MORADIA, (b.n['valor'] ?? 0) * ALUGUEL_DA_MORADIA);
  somar(e, reg, 'eu', 'custo', -economia);
  definirNumero(e, reg, b.id, 'economia', economia);
  perder(e, reg, b.id, 'alugado');
  ganhar(e, reg, b.id, 'moradia', origem);
  ganhar(e, reg, 'eu', 'casa_propria', origem);
}

function sairDe(e: EstadoVida, reg: Mudanca[], b: Entidade): void {
  somar(e, reg, 'eu', 'custo', b.n['economia'] ?? 0);
  definirNumero(e, reg, b.id, 'economia', 0);
  perder(e, reg, b.id, 'moradia');
  perder(e, reg, 'eu', 'casa_propria');
}

/** Quem tem algum imóvel alugado é senhorio (o conteúdo lê: o inquilino que some, o que paga em dia). */
function acertarSenhorio(e: EstadoVida, reg: Mudanca[], origem: number): void {
  if (bensDe(e).some((x) => x.q['alugado'])) ganhar(e, reg, 'eu', 'senhorio', origem);
  else perder(e, reg, 'eu', 'senhorio');
}

/** Faz a operação (já conferida) e devolve o texto e o resumo da entrada. */
export function operarBem(e: EstadoVida, c: Conteudo, op: OperacaoBem, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  if (op.tipo === 'comprar') {
    const def = defBem(c, op.item)!;
    const financiar = Boolean(op.financiar && def.financiavel);
    const entrada = tirarDeQuemJoga(e, reg, custoDaCompra(def, financiar));
    const id = `bem${origem}`;
    const b = novaEntidade({ id, tipo: 'bem', nome: def.nome, nascimento: e.ano, vivo: true });
    e.entidades[id] = b;
    definirTexto(e, reg, id, 'item', def.id);
    somar(e, reg, id, 'valor', def.preco);
    if (financiar) somar(e, reg, id, 'financiado', def.preco - entrada);
    ganhar(e, reg, 'eu', def.marca, origem);
    if (def.categoria === 'imovel') ganhar(e, reg, id, 'alugado', origem);
    if (def.categoria === 'moradia' && !moradiaDe(e)) morarEm(e, reg, b, origem);
    acertarSenhorio(e, reg, origem);
    const como = financiar ? `, com ${formatarDinheiro(entrada)} de entrada e o resto financiado` : '';
    return {
      texto: `Comprou ${comArtigo(def)} por ${formatarDinheiro(def.preco)}${como}. ${def.descricao}`,
      resumo: `comprou ${comArtigo(def)}${financiar ? ' financiado' : ''}`,
    };
  }
  const b = e.entidades[op.id]!;
  const def = defDoBem(c, b)!;
  if (op.tipo === 'venderBem') {
    const valor = b.n['valor'] ?? 0;
    const taxa = ehImovel(def) ? valor * CUSTO_VENDA_IMOVEL : 0;
    const financiado = b.n['financiado'] ?? 0;
    if (b.q['moradia']) sairDe(e, reg, b);
    movimentar(e, reg, { dinheiro: valor - taxa - financiado });
    somar(e, reg, b.id, 'valor', -valor);
    if (financiado) somar(e, reg, b.id, 'financiado', -financiado);
    perder(e, reg, b.id, 'alugado');
    delete e.entidades[b.id];
    if (!bensDe(e).some((x) => defDoBem(c, x)?.marca === def.marca)) perder(e, reg, 'eu', def.marca);
    acertarSenhorio(e, reg, origem);
    const quitou = financiado >= 1 ? `, quitou ${formatarDinheiro(financiado)} do financiamento` : '';
    return {
      texto: `Vendeu ${comDefinido(def)} por ${formatarDinheiro(valor - taxa)}${quitou}.`,
      resumo: `vendeu ${comArtigo(def)}`,
    };
  }
  if (op.tipo === 'morar') {
    const atual = moradiaDe(e);
    if (atual) sairDe(e, reg, atual);
    morarEm(e, reg, b, origem);
    acertarSenhorio(e, reg, origem);
    return { texto: `Mudou-se para ${comDefinido(def)}. Caixa de mudança por todo lado.`, resumo: `mudou-se para ${comArtigo(def)} própri${def.feminino ? 'a' : 'o'}` };
  }
  if (op.alugar) ganhar(e, reg, b.id, 'alugado', origem);
  else perder(e, reg, b.id, 'alugado');
  acertarSenhorio(e, reg, origem);
  const renda = (b.n['valor'] ?? 0) * taxaDeAluguel(def);
  return op.alugar
    ? { texto: `Pôs ${comArtigo(def)} para alugar: uns ${formatarDinheiro(renda / 12)} por mês, se o inquilino pagar.`, resumo: `pôs ${comArtigo(def)} para alugar` }
    : { texto: `Tirou ${comArtigo(def)} do aluguel.`, resumo: `tirou ${comArtigo(def)} do aluguel` };
}

/** O ano dos bens: o valor anda (imóvel com o mercado), a manutenção e a parcela saem, o aluguel entra. */
export function regraDosBens(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const bens = bensDe(e);
  if (bens.length === 0) return;
  const mercado = (e.entidades['pais']?.n['ret_fii'] ?? 0) / 100;
  let caixa = 0;
  for (const b of bens) {
    const def = defDoBem(c, b);
    if (!def) continue;
    const valor = b.n['valor'] ?? 0;
    const imovel = ehImovel(def);
    // O imóvel acompanha o mercado de imóveis do ano acima ou abaixo do que um aluguel normal rende (o aluguel já é a outra parte do retorno).
    const anda = def.valorizacao + (imovel ? (mercado - RENDA_NORMAL_IMOVEL) * 0.8 : 0) + normal(e.rng, 0, def.desvio ?? (imovel ? 0.03 : 0.02));
    let novo = Math.max(0, valor * (1 + anda));
    if (def.categoria === 'veiculo') novo = Math.max(novo, def.preco * PISO_VEICULO);
    somar(e, reg, b.id, 'valor', novo - valor, 'bens');
    caixa -= novo * def.manutencao;
    if (b.q['alugado']) caixa += novo * taxaDeAluguel(def);
    const financiado = b.n['financiado'] ?? 0;
    if (financiado > 0) {
      const juros = financiado * JUROS_FINANCIAMENTO;
      const parcela = Math.min(financiado + juros, parcelaDe(def));
      somar(e, reg, b.id, 'financiado', juros - parcela, 'bens');
      caixa -= parcela;
    }
  }
  if (Math.abs(caixa) >= 1) movimentar(e, reg, { dinheiro: caixa }, 'eu', 'bens');
}

/** Felicidade que os bens dão por ano: a casa onde mora, o melhor veículo, o lazer e o luxo (com teto). */
export function confortoDosBens(e: EstadoVida, c: Conteudo): number {
  let moradia = 0;
  let veiculo = 0;
  let resto = 0;
  for (const b of bensDe(e)) {
    const def = defDoBem(c, b);
    if (!def) continue;
    if (def.categoria === 'moradia') moradia = b.q['moradia'] ? def.conforto : moradia;
    else if (def.categoria === 'veiculo') veiculo = Math.max(veiculo, def.conforto);
    else resto += def.conforto;
  }
  return Math.min(18, moradia + veiculo + 0.6 * resto);
}

/** Influência que os bens dão (casa de luxo, iate, jatinho, jornal), com teto. */
export function statusDosBens(e: EstadoVida, c: Conteudo): number {
  let s = 0;
  for (const b of bensDe(e)) s += defDoBem(c, b)?.status ?? 0;
  return Math.min(30, s);
}
