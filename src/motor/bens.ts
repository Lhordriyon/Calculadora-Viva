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
import { FASES } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { abrirContrato, contratosDe, fecharContrato, fecharSePago, financiamentoDe, mexerNoSaldo, modalidadeDe, origemDe } from './contratos.ts';
import { atrasar, pagarComOQueHouver, porEmDia } from './dividas.ts';
import { movimentar } from './economia.ts';
import { liquidoDe, tirarDeQuemJoga } from './empresa.ts';
import type { DefBem } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { FREQUENCIA_DAS_FASES } from './pais.ts';
import { novaEntidade } from './pessoas.ts';
import {
  ALUGUEL_DA_MORADIA,
  ANOS_PARA_LEILAO,
  CUSTO_VENDA_IMOVEL,
  ECONOMIA_DA_MORADIA,
  ENTRADA_FINANCIAMENTO,
  JUROS_FINANCIAMENTO,
  LANCE_DO_LEILAO,
  PARCELA_FINANCIAMENTO,
  PISO_VEICULO,
} from './regras.ts';
import { normal } from './rng.ts';

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
    if (financiar && eu.q['nome_sujo']) return 'com o nome sujo, o banco não financia';
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
    const entrada = tirarDeQuemJoga(e, reg, custoDaCompra(def, financiar), 'mercado');
    const id = `bem${origem}`;
    const b = novaEntidade({ id, tipo: 'bem', nome: def.nome, nascimento: e.ano, vivo: true });
    e.entidades[id] = b;
    definirTexto(e, reg, id, 'item', def.id);
    somar(e, reg, id, 'valor', def.preco);
    // O financiamento é um contrato com o banco, com o imóvel em garantia: o saldo dele é o financiado do bem.
    if (financiar) {
      const ct = abrirContrato(e, reg, { modalidade: 'financiamento', origem, garantia: id, parcela: parcelaDe(def), nome: `Financiamento d${def.feminino ? 'a' : 'o'} ${def.nome}` });
      mexerNoSaldo(e, reg, ct, def.preco - entrada, 'financiamento');
    }
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
    // Quem compra paga o valor; a corretagem vai para o mercado e o que faltava do financiamento, para o banco.
    movimentar(e, reg, {
      dinheiro: valor - taxa - financiado,
      fluxos: [
        { campo: 'dinheiro', d: valor, p: 'mercado', r: 'venda' },
        { campo: 'dinheiro', d: -taxa, p: 'mercado', r: 'corretagem' },
        { campo: 'dinheiro', d: -financiado, p: 'banco', r: 'quitacao' },
      ],
    });
    somar(e, reg, b.id, 'valor', -valor);
    const ct = financiamentoDe(e, b.id);
    if (ct) {
      mexerNoSaldo(e, reg, ct, -(ct.n['saldo'] ?? 0), 'quitacao');
      fecharContrato(e, reg, ct, 'quitacao');
    }
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

/**
 * O retorno médio dos fundos imobiliários, pesado pela frequência de cada fase: o imóvel anda com o mercado acima ou
 * abaixo disso (o ciclo não tira nem põe valor no longo prazo; o que fica é a valorização própria de cada bem).
 */
function mercadoMedioDeImoveis(c: Conteudo): number {
  const fii = c.mundo.ativos.find((a) => a.id === 'fii');
  return fii ? FASES.reduce((s, f) => s + fii.retorno[f] * FREQUENCIA_DAS_FASES[f], 0) : 0;
}

/** O ano dos bens: o valor anda (imóvel com o mercado), a manutenção e a parcela saem, o aluguel entra (anotado à parte). */
export function regraDosBens(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const bens = bensDe(e);
  if (bens.length === 0) return;
  const mercado = (e.entidades['pais']?.n['ret_fii'] ?? 0) / 100;
  const medio = mercadoMedioDeImoveis(c);
  let aluguel = 0;
  let manutencao = 0;
  for (const b of bens) {
    const def = defDoBem(c, b);
    if (!def) continue;
    const valor = b.n['valor'] ?? 0;
    const imovel = ehImovel(def);
    // O imóvel acompanha o mercado de imóveis do ano acima ou abaixo do que um aluguel normal rende (o aluguel já é a outra parte do retorno).
    const anda = def.valorizacao + (imovel ? (mercado - medio) * 0.8 : 0) + normal(e.rng, 0, def.desvio ?? (imovel ? 0.03 : 0.02));
    let novo = Math.max(0, valor * (1 + anda));
    if (def.categoria === 'veiculo') novo = Math.max(novo, def.preco * PISO_VEICULO);
    somar(e, reg, b.id, 'valor', novo - valor, 'bens');
    manutencao += novo * def.manutencao;
    if (b.q['alugado']) aluguel += novo * taxaDeAluguel(def);
  }
  if (aluguel >= 1) movimentar(e, reg, { dinheiro: aluguel, contraparte: 'mercado' }, 'eu', 'aluguel');
  if (manutencao >= 1) movimentar(e, reg, { dinheiro: -manutencao, contraparte: 'mercado' }, 'eu', 'manutencao');
  regraDosFinanciamentos(e, c, reg);
}

/**
 * O ano dos financiamentos: o juro entra no saldo e a parcela sai da conta, dos investimentos e do crédito que
 * sobrar. A que não couber atrasa; dois anos seguidos de atraso, e o banco leva o imóvel a leilão.
 */
function regraDosFinanciamentos(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  for (const ct of contratosDe(e)) {
    if (modalidadeDe(ct) !== 'financiamento') continue;
    const b = e.entidades[ct.t['garantia'] ?? ''];
    if (!b) continue;
    mexerNoSaldo(e, reg, ct, (ct.n['saldo'] ?? 0) * JUROS_FINANCIAMENTO, 'juros');
    const devido = Math.min(ct.n['saldo'] ?? 0, ct.n['parcela'] ?? 0);
    const falta = devido - pagarComOQueHouver(e, reg, ct, devido, 'parcela');
    if (fecharSePago(e, reg, ct, 'parcela')) continue;
    if (falta > 0.5) atrasar(e, reg, ct);
    else porEmDia(e, reg, ct);
    if ((ct.n['atraso'] ?? 0) >= ANOS_PARA_LEILAO) leiloar(e, c, b, ct);
  }
}

/**
 * O banco toma o imóvel do financiamento atrasado e leiloa: o lance (uma fração do valor) paga o que faltava, a sobra
 * volta para quem joga e o que o lance não cobre o banco perde. É entrada própria no livro, com o porquê: a compra.
 */
function leiloar(e: EstadoVida, c: Conteudo, b: Entidade, ct: Entidade): void {
  const def = defDoBem(c, b);
  const valor = b.n['valor'] ?? 0;
  const saldo = ct.n['saldo'] ?? 0;
  const lance = valor * LANCE_DO_LEILAO;
  const sobra = Math.max(0, lance - saldo);
  const nome = def ? comDefinido(def) : 'o imóvel';
  const sobrou = sobra >= 1 ? ` Sobraram ${formatarDinheiro(sobra)} para você.` : saldo > lance + 1 ? ' O lance nem cobriu a dívida; o resto o banco engoliu.' : '';
  const origem = origemDe(ct);
  const entrada = novaEntrada(e, {
    tipo: 'regra',
    causa: 'regra',
    ref: 'divida:leilao',
    texto: `O banco tomou ${nome}: dois anos de parcelas atrasadas viraram leilão, e o lance foi de ${formatarDinheiro(lance)}.${sobrou}`,
    resumo: `perdeu ${nome} num leilão do banco`,
    ...(origem !== null ? { causas: [origem] } : {}),
  });
  const r: Mudanca[] = [];
  mexerNoSaldo(e, r, ct, -saldo, 'leilao');
  fecharContrato(e, r, ct, 'leilao');
  if (sobra >= 1) movimentar(e, r, { dinheiro: sobra, contraparte: 'banco' }, 'eu', 'leilao');
  if (b.q['moradia']) sairDe(e, r, b);
  somar(e, r, b.id, 'valor', -valor, 'leilao');
  perder(e, r, b.id, 'alugado');
  delete e.entidades[b.id];
  if (def && !bensDe(e).some((x) => defDoBem(c, x)?.marca === def.marca)) perder(e, r, 'eu', def.marca);
  acertarSenhorio(e, r, entrada.id);
  lancar(e, entrada, r);
}

/** Antes dos contratos, o financiamento era um número no bem: vira o contrato dele, em dia. */
export function migrarFinanciamentos(e: EstadoVida, c: Conteudo): void {
  for (const b of bensDe(e)) {
    const financiado = b.n['financiado'] ?? 0;
    if (financiado <= 0 || financiamentoDe(e, b.id)) continue;
    const def = defDoBem(c, b);
    const origem = Number(b.id.slice(3)) || 0;
    const id = e.entidades[`ctr${origem}`] ? `ctr${origem}b` : `ctr${origem}`;
    e.entidades[id] = {
      id,
      tipo: 'contrato',
      nome: def ? `Financiamento d${def.feminino ? 'a' : 'o'} ${def.nome}` : 'Financiamento',
      nascimento: b.nascimento ?? e.ano,
      vivo: true,
      n: { saldo: financiado, parcela: def ? parcelaDe(def) : financiado * PARCELA_FINANCIAMENTO },
      t: { modalidade: 'financiamento', credor: 'banco', origem: String(origem), garantia: b.id },
      q: {},
    };
  }
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
