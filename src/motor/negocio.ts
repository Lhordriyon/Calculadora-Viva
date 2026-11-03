/**
 * O negócio (bloco H, I-132). A empresa de quem joga deixa de ser um valor que cresce pela sorte e vira negócio:
 *
 * - a **demanda** (o que o mercado quer comprar dela por ano, em reais, ao preço médio) anda com a tração (o momento
 *   do negócio, que o conteúdo empurra), o ciclo do setor, o mundo lá fora, a qualidade e a marca, e trava perto do
 *   tamanho do mercado do setor (uma parte do PIB);
 * - a **capacidade** (o que ela consegue entregar por ano) só cresce com investimento, que vira obra e fica pronta no
 *   ano seguinte; cortar capacidade vende ativo pela metade e demite;
 * - as **vendas** são o que a capacidade dá conta, no preço escolhido (popular vende mais e ganha menos por venda;
 *   premium o contrário, e sem qualidade espanta cliente);
 * - os **custos**: o variável (o que cada venda custa), o fixo (a estrutura, que pesa mesmo parada; o salário pago
 *   mexe nele), o marketing e o P&D; o **imposto** vai para o Tesouro; o **lucro** fica no **caixa**, e os dividendos
 *   saem dele para os donos;
 * - a **qualidade** anda com o P&D (e a tecnologia do país, e o salário); a **marca**, com o marketing, a fama de quem
 *   manda e a mídia própria;
 * - o **valor** é o caixa e a obra, mais o maior entre os ativos a preço de venda e o lucro vezes o múltiplo do setor.
 *
 * O caixa nunca fica negativo (a empresa não tem dívida com o banco): se o ano não fecha, ela vende capacidade para
 * pagar as contas e demite; a cidade sente os empregos que ela abre e fecha. Todo real tem contraparte: as vendas vêm
 * do mercado (ou do país de fora que compra), os custos vão para o mercado, o imposto para o Tesouro e os dividendos
 * para quem joga (a parte dele) e para os outros sócios.
 */
import { PARCEIROS, type Parceiro } from './constantes.ts';
import { influenciaNegocios, influenciaPolitica } from './influencia.ts';
import { RIVAL, CADEIA, DESEMPREGO_NATURAL } from './regras.ts';
import { governoAtual, nivelDe } from './pais.ts';
import { criarRng, misturar } from './rng.ts';
import { CICLO_DO_SETOR } from './regras.ts';
import { novaEntidade } from './pessoas.ts';
import { aleatorio, normal } from './rng.ts';
import { CONCORRENCIA, CREDITO_DA_EMPRESA } from './regras.ts';
import type { Conteudo } from './conteudo.ts';
import type { DefSetor } from './esquema.ts';
import { movimentar } from './economia.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import type { Momento } from './pais.ts';
import {
  ATRATIVIDADE_NO_CRESCIMENTO,
  CAPACIDADE_DA_FUNDACAO,
  DEMANDA_DA_FUNDACAO,
  DOLAR_NO_CAIXA,
  FATIA_DA_EXPORTACAO,
  FATIA_MAXIMA_DO_MERCADO,
  IMPOSTO_DA_EMPRESA,
  PEA_DA_CAPITAL,
  PEA_DA_CIDADE,
  PREMIO_DA_BOLSA,
  RELACAO_PARA_EXPORTAR,
  VALOR_DE_VENDA_DOS_ATIVOS,
} from './regras.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

// ---------------------------------------------------------------- a economia de cada setor (mundo.json › setores)

export interface Economia {
  /** O que sobra de cada venda ao preço médio, antes da estrutura (1 − custo variável). */
  margem: number;
  /** A estrutura por ano, como fração da capacidade (pesa mesmo parada). */
  fixo: number;
  /** Quanto custa, em reais, cada real de capacidade por ano (a fábrica, a loja, o servidor). */
  giro: number;
  /** Quantas vezes o lucro do ano o mercado paga pela empresa. */
  multiplo: number;
  /** Vendas por pessoa por ano (quantos empregos a empresa abre). */
  produtividade: number;
  /** A parte do PIB que o setor vende por ano (o tamanho do mercado). */
  peso: number;
}

const PADRAO: Economia = { margem: 0.35, fixo: 0.18, giro: 0.7, multiplo: 9, produtividade: 300_000, peso: 0.06 };

export function economiaDo(setor: DefSetor | undefined): Economia {
  return {
    margem: setor?.margem ?? PADRAO.margem,
    fixo: setor?.fixo ?? PADRAO.fixo,
    giro: setor?.giro ?? PADRAO.giro,
    multiplo: setor?.multiplo ?? PADRAO.multiplo,
    produtividade: setor?.produtividade ?? PADRAO.produtividade,
    peso: setor?.peso ?? PADRAO.peso,
  };
}

/** O preço: quanto cada venda rende, quanto o volume muda e quanto cada venda custa. */
export const PRECOS = {
  popular: { preco: 0.85, volume: 1.2, custo: 0.95 },
  medio: { preco: 1, volume: 1, custo: 1 },
  premium: { preco: 1.3, volume: 0.72, custo: 1.1 },
} as const;
export type Preco = keyof typeof PRECOS;
export const NIVEIS_DE_PRECO = Object.keys(PRECOS) as Preco[];

/** O salário: quanto pesa na estrutura e quanto mexe na qualidade (gente bem paga capricha). */
export const SALARIOS = {
  piso: { fixo: 0.92, qualidade: -6 },
  mercado: { fixo: 1, qualidade: 0 },
  acima: { fixo: 1.1, qualidade: 6 },
} as const;
export type Salario = keyof typeof SALARIOS;
export const NIVEIS_DE_SALARIO = Object.keys(SALARIOS) as Salario[];

/** As verbas de marketing e de P&D, como fração das vendas. */
export const VERBAS = [0, 0.03, 0.08] as const;

const preco = (emp: Entidade): Preco => (emp.t['preco'] as Preco | undefined) ?? 'medio';
const salario = (emp: Entidade): Salario => (emp.t['salario'] as Salario | undefined) ?? 'mercado';

/** O tamanho do mercado do setor no país (uma parte do PIB, em reais). */
export function mercadoDoSetor(e: EstadoVida, eco: Economia): number {
  return Math.max(1e9, e.entidades['pais']?.n['pib'] ?? 1e13) * eco.peso;
}

/** O quanto o produto atrai, perto de 1 na média do setor: a qualidade e a marca. */
export function atratividade(emp: Entidade): number {
  return (0.55 * (emp.n['qualidade'] ?? 50) + 0.45 * (emp.n['marca'] ?? 50)) / 50;
}

/** O que o mercado quer comprar dela neste preço (em reais ao preço médio), aqui e lá fora. */
export function procura(e: EstadoVida, emp: Entidade): number {
  const p = PRECOS[preco(emp)];
  // Premium sem qualidade espanta cliente.
  const semQualidade = preco(emp) === 'premium' && (emp.n['qualidade'] ?? 50) < 60 ? (emp.n['qualidade'] ?? 50) / 60 : 1;
  const aqui = (emp.n['demanda'] ?? 0) * p.volume * (0.8 + 0.2 * atratividade(emp)) * semQualidade;
  return aqui + exportacaoDe(e, emp);
}

/** Quanto do que ela consegue entregar o mercado quer (acima de 1, sobra pedido; abaixo, sobra estrutura). */
export function ocupacaoDe(e: EstadoVida, emp: Entidade): number {
  const capacidade = emp.n['capacidade'] ?? 0;
  return capacidade > 0 ? procura(e, emp) / capacidade : 0;
}

/** A demanda de fora: a parte da demanda que o país escolhido compra, pela relação, pelo crescimento dele, pelo acordo; a sanção fecha a porta. */
export function exportacaoDe(e: EstadoVida, emp: Entidade): number {
  const para = emp.t['exporta'];
  if (!para) return 0;
  const pais = e.entidades[para];
  if (!pais || pais.q['sancao']) return 0;
  const relacao = Math.max(0, pais.n['relacao'] ?? 50) / 50;
  const crescimento = 1 + Math.max(-0.5, (pais.n['crescimento'] ?? 2) / 50);
  return (emp.n['demanda'] ?? 0) * FATIA_DA_EXPORTACAO * Math.sqrt(relacao) * crescimento * (pais.q['acordo'] ? 1.3 : 1);
}

/** Pessoas trabalhando lá: as vendas (ou a capacidade, no ano em que ainda não vendeu) pela produtividade do setor. */
export function empregosDe(c: Conteudo, emp: Entidade): number {
  const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
  const base = Math.max(emp.n['receita'] ?? 0, (emp.n['capacidade'] ?? 0) * 0.5);
  return Math.max(1, Math.round(base / eco.produtividade));
}

// ---------------------------------------------------------------- o começo do negócio

/**
 * O negócio que nasce com o capital: uma parte vira capacidade (a loja, a máquina), o resto fica no caixa; a demanda
 * começa abaixo da capacidade (a clientela ainda não sabe que ela existe). A empresa de antes do negócio (um save
 * antigo) ganha os fundamentos que explicam o valor que ela tinha.
 */
export function garantirFundamentos(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, capital?: number, de = 'mercado'): void {
  if (emp.n['capacidade'] !== undefined) return;
  const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
  const id = emp.id;
  let capacidade: number;
  let caixa: number;
  if (capital !== undefined) {
    capacidade = (capital * CAPACIDADE_DA_FUNDACAO) / eco.giro;
    caixa = capital * (1 - CAPACIDADE_DA_FUNDACAO);
  } else {
    // O lucro que o valor de antes pede, e as vendas que dão esse lucro.
    const valor = emp.n['valor'] ?? 0;
    const lucroPorVenda = Math.max(0.03, (eco.margem - eco.fixo - 0.04) * (1 - IMPOSTO_DA_EMPRESA));
    capacidade = valor / Math.max(1, eco.multiplo * lucroPorVenda);
    caixa = valor * 0.05;
  }
  somar(e, reg, id, 'capacidade', capacidade, 'negocio');
  somar(e, reg, id, 'demanda', capacidade * (capital !== undefined ? DEMANDA_DA_FUNDACAO : 0.95), 'negocio');
  if (capital !== undefined) {
    // O capital entra no caixa (de quem pôs) e a estrutura sai dele (para quem vendeu a loja, a máquina).
    if (capital > 0) somar(e, reg, id, 'caixa', capital, 'capital', de);
    if (capital - caixa > 0) somar(e, reg, id, 'caixa', -(capital - caixa), 'obra', 'mercado');
  } else if (caixa > 0) somar(e, reg, id, 'caixa', caixa, 'negocio', 'reavaliacao');
  somar(e, reg, id, 'qualidade', 50, 'negocio');
  somar(e, reg, id, 'marca', capital !== undefined ? 35 : 50, 'negocio');
  somar(e, reg, id, 'marketing', 0.03, 'negocio');
  somar(e, reg, id, 'pd', 0.03, 'negocio');
  definirTexto(e, reg, id, 'preco', 'medio');
  definirTexto(e, reg, id, 'salario', 'mercado');
}

// ---------------------------------------------------------------- o ano do negócio

export interface AnoDoNegocio {
  vendas: number;
  lucro: number;
  imposto: number;
  dividendos: number;
  /** Capacidade vendida para fechar as contas (0 = o ano fechou). */
  cortou: number;
  /** Empregos de antes e de agora. */
  empregosAntes: number;
  empregosDepois: number;
}

/**
 * O ano de uma empresa: a obra fica pronta, a demanda anda, vende o que dá, paga os custos e o imposto, distribui os
 * dividendos, fecha o caixa (vendendo capacidade, se precisar), a qualidade e a marca andam, e o valor vai para os
 * fundamentos. `fora` é o mundo lá fora no crescimento (o dólar, a tarifa, as sanções de quem compra do setor);
 * `sorte`, o ano de cada negócio.
 */
export function anoDoNegocio(e: EstadoVida, c: Conteudo, emp: Entidade, fase: Momento, reg: Mudanca[], fora: number, sorte: number): AnoDoNegocio {
  const id = emp.id;
  const n = emp.n;
  const setor = c.setores.get(emp.t['setor'] ?? '');
  const eco = economiaDo(setor);
  const empregosAntes = empregosDe(c, emp);

  // A obra do ano passado fica pronta.
  const obra = n['obra'] ?? 0;
  if (obra > 0) {
    somar(e, reg, id, 'obra', -obra, 'negocio');
    somar(e, reg, id, 'capacidade', obra, 'negocio');
  }

  // A demanda anda: o momento (a tração), o ciclo do setor, o mundo lá fora, a sorte e o quanto o produto atrai; o
  // mercado tem tamanho (perto do teto, o ganho some; a perda vale inteira).
  const demanda = n['demanda'] ?? 0;
  const teto = mercadoDoSetor(e, eco) * FATIA_MAXIMA_DO_MERCADO;
  const bruto = (n['tracao'] ?? 0) / 100 + fase.empresa * (setor?.ciclo ?? 1) + fora + sorte + (atratividade(emp) - forcaDaConcorrente(emp)) * ATRATIVIDADE_NO_CRESCIMENTO;
  const cresce = bruto > 0 ? bruto * Math.max(0, 1 - demanda / teto) : Math.max(-0.6, bruto);
  somar(e, reg, id, 'demanda', demanda * cresce, 'negocio');

  // Vende o que a capacidade dá conta, no preço escolhido; o resto da procura vira fila.
  const p = PRECOS[preco(emp)];
  const capacidade = n['capacidade'] ?? 0;
  const entregue = Math.min(capacidade, procura(e, emp));
  const fracaoFora = procura(e, emp) > 0 ? exportacaoDe(e, emp) / procura(e, emp) : 0;
  // O dólar do ano: quem exporta recebe mais reais pelo que vende, quem importa paga mais caro pelo que compra.
  const dolar = (fase.cambio ?? 0) * DOLAR_NO_CAIXA;
  // Na guerra de preços, todo mundo cobra menos.
  const vendas = entregue * p.preco * (1 + Math.max(0, setor?.cambio ?? 0) * dolar) * (emp.q['guerra'] ? 1 - CONCORRENCIA.corteNaGuerra : 1) * precoDoSetor(ofertaDe(e, emp.t['setor']));
  // O insumo vem do setor fornecedor (a alta dele encarece; o fornecedor próprio vende a preço de custo).
  const variavel = entregue * (1 - eco.margem) * p.custo * (1 + Math.max(0, -(setor?.cambio ?? 0)) * dolar) * fatorDoInsumo(e, c, emp);
  // A folha anda com o mercado de trabalho: desemprego baixo, gente cara.
  const fixo = capacidade * eco.fixo * SALARIOS[salario(emp)].fixo * fatorDaMaoDeObra(e);
  const verbas = vendas * ((n['marketing'] ?? 0) + (n['pd'] ?? 0));
  const ebit = vendas - variavel - fixo - verbas;
  // O juro do banco sai antes do imposto (o lucro é depois dele).
  const juros = (n['divida'] ?? 0) * jurosDaEmpresa(e);
  const imposto = Math.max(0, ebit - juros) * impostoDaEmpresa(e);
  const lucro = ebit - juros - imposto;

  // O caixa: entra o que vendeu (de fora, do país que comprou), saem os custos e o imposto.
  const exportou = vendas * fracaoFora;
  if (vendas - exportou > 0) somar(e, reg, id, 'caixa', vendas - exportou, 'vendas', 'mercado');
  if (exportou > 0) somar(e, reg, id, 'caixa', exportou, 'exportacao', emp.t['exporta']!);
  if (variavel + fixo + verbas > 0) somar(e, reg, id, 'caixa', -(variavel + fixo + verbas), 'custos', 'mercado');
  if (imposto > 0) somar(e, reg, id, 'caixa', -imposto, 'imposto', 'tesouro');
  // O banco recebe o juro e a parcela (o dinheiro que volta para ele deixa de existir).
  if (juros >= 1) somar(e, reg, id, 'caixa', -juros, 'juros', 'banco');
  const parcela = (n['divida'] ?? 0) * CREDITO_DA_EMPRESA.amortizacao;
  if (parcela >= 1) {
    somar(e, reg, id, 'caixa', -parcela, 'amortizacao', 'banco');
    somar(e, reg, id, 'divida', -parcela, 'amortizacao');
  }

  // Os dividendos saem do lucro, na proporção que os donos decidiram, e do que há no caixa.
  const parte = n['participacao'] ?? 1;
  const dividendos = lucro > 0 ? Math.min(Math.max(0, n['caixa'] ?? 0), lucro * (n['retirada'] ?? 0)) : 0;
  if (dividendos >= 1) {
    somar(e, reg, id, 'caixa', -dividendos * parte, 'dividendos', 'eu');
    movimentar(e, reg, { dinheiro: dividendos * parte, contraparte: id }, 'eu', 'dividendos');
    if (parte < 1) somar(e, reg, id, 'caixa', -dividendos * (1 - parte), 'dividendos', 'mercado');
  }

  // O ano que não fecha: vende capacidade (pela metade do que custou) até o caixa voltar a zero, e demite junto.
  let cortou = 0;
  const caixa = n['caixa'] ?? 0;
  if (caixa < 0) {
    const porReal = eco.giro * VALOR_DE_VENDA_DOS_ATIVOS;
    cortou = Math.min(n['capacidade'] ?? 0, -caixa / porReal);
    somar(e, reg, id, 'capacidade', -cortou, 'corte');
    somar(e, reg, id, 'caixa', cortou * porReal, 'venda_de_ativos', 'mercado');
    // O que nem a venda cobre, os donos perdem (o fornecedor que não recebeu).
    const falta = n['caixa'] ?? 0;
    if (falta < 0) somar(e, reg, id, 'caixa', -falta, 'calote_de_fornecedor', 'mercado');
  }

  // A qualidade anda para o que o P&D, a tecnologia do país e o salário sustentam; a marca, para o que o marketing,
  // a qualidade, a fama de quem manda e a mídia própria sustentam.
  const tecnologia = (e.entidades['pais']?.n['tecnologia'] ?? 50) - 50;
  const alvoQualidade = 35 + (n['pd'] ?? 0) * 600 + tecnologia * 0.2 + SALARIOS[salario(emp)].qualidade;
  somar(e, reg, id, 'qualidade', (Math.max(0, Math.min(100, alvoQualidade)) - (n['qualidade'] ?? 50)) * 0.25, 'negocio');
  const fama = e.entidades['eu']?.n['fama'] ?? 0;
  const alvoMarca = 30 + (n['marketing'] ?? 0) * 600 + ((n['qualidade'] ?? 50) - 50) * 0.3 + fama / 5 + (temMidia(e) ? 10 : 0);
  somar(e, reg, id, 'marca', (Math.max(0, Math.min(100, alvoMarca)) - (n['marca'] ?? 50)) * 0.25, 'negocio');

  // O valor vai para os fundamentos: o caixa e a obra, mais o maior entre os ativos a preço de venda e o lucro vezes o múltiplo.
  const ativos = (n['capacidade'] ?? 0) * eco.giro * VALOR_DE_VENDA_DOS_ATIVOS;
  const multiplo = eco.multiplo * (emp.q['na_bolsa'] ? 1 + PREMIO_DA_BOLSA : 1);
  const alvo = Math.max(0, Math.max(0, n['caixa'] ?? 0) + (n['obra'] ?? 0) * eco.giro + Math.max(ativos, multiplo * Math.max(0, lucro)) - (n['divida'] ?? 0));
  somar(e, reg, id, 'valor', (alvo - (n['valor'] ?? 0)) * 0.5, 'empresa');
  definirNumero(e, reg, id, 'lucro', lucro, 'empresa');
  definirNumero(e, reg, id, 'receita', vendas, 'negocio');
  definirNumero(e, reg, id, 'impostos', imposto, 'negocio');
  concorrenciaDoAno(e, reg, emp, lucro, vendas, garraDaRival(e, c, emp));
  return { vendas, lucro, imposto, dividendos, cortou, empregosAntes, empregosDepois: empregosDe(c, emp) };
}

/** Quem joga tem rádio, jornal ou emissora: a mídia própria fala bem das empresas dele. */
export function temMidia(e: EstadoVida): boolean {
  return Object.values(e.entidades).some((b) => b.tipo === 'bem' && b.t['item'] !== undefined && ['radio', 'jornal', 'emissora'].includes(b.t['item']!));
}

/**
 * Os empregos que as empresas de quem joga abrem e fecham mexem no desemprego da cidade (lugar.desemprego, que o
 * trabalho de quem joga e o da família leem): a população que trabalha numa capital é maior que numa cidade do interior.
 */
export function empregosNaCidade(e: EstadoVida, reg: Mudanca[], antes: number, depois: number): number {
  const lugar = e.entidades['lugar'];
  if (!lugar || antes === depois) return 0;
  const pea = lugar.q['capital'] ? PEA_DA_CAPITAL : PEA_DA_CIDADE;
  const atual = lugar.n['desemprego'] ?? 0.08;
  const novo = Math.max(0.02, Math.min(0.4, atual - (depois - antes) / pea));
  if (Math.abs(novo - atual) >= 1e-6) somar(e, reg, 'lugar', 'desemprego', novo - atual, 'empregos');
  return novo - atual;
}

// ---------------------------------------------------------------- as decisões (folha Dinheiro, sem ficha)

export type OperacaoNegocio =
  | { tipo: 'preco'; empresa?: string; nivel: Preco }
  | { tipo: 'expandir'; empresa?: string; fracao: number }
  | { tipo: 'cortar'; empresa?: string; fracao: number }
  | { tipo: 'verbas'; empresa?: string; marketing: number; pd: number }
  | { tipo: 'salario'; empresa?: string; nivel: Salario }
  | { tipo: 'exportar'; empresa?: string; para: Parceiro | '' }
  | { tipo: 'emprestimo'; empresa?: string; valor: number }
  | { tipo: 'pagar'; empresa?: string }
  | { tipo: 'lobby'; empresa?: string };

const TIPOS = new Set(['preco', 'expandir', 'cortar', 'verbas', 'salario', 'exportar', 'emprestimo', 'pagar', 'lobby']);
export function ehOperacaoDeNegocio(op: { tipo: string }): op is OperacaoNegocio {
  return TIPOS.has(op.tipo);
}

/** Quanto custa crescer `fracao` da capacidade (a obra paga do caixa). */
export function custoDaObra(c: Conteudo, emp: Entidade, fracao: number, e?: EstadoVida): number {
  // A obra custa o preço do setor: na sobra, máquina e estrutura saem baratas (comprar na baixa); na alta, caras.
  const preco = e ? precoDoSetor(ofertaDe(e, emp.t['setor'])) : 1;
  return (emp.n['capacidade'] ?? 0) * fracao * economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro * preco;
}

/** Abrir um mercado lá fora custa a estrutura de exportar (o despachante, a feira, a certificação). */
export function custoDeExportar(c: Conteudo, emp: Entidade): number {
  return custoDaObra(c, emp, 0.08);
}

export function motivoParaNaoOperarNegocio(e: EstadoVida, c: Conteudo, op: OperacaoNegocio): string | null {
  const id = op.empresa ?? 'empresa';
  const emp = e.entidades[id];
  if (!emp || emp.tipo !== 'empresa' || emp.vivo === false) return 'essa empresa não existe';
  const n = emp.n;
  switch (op.tipo) {
    case 'preco':
      return preco(emp) === op.nivel ? 'já é esse o preço' : null;
    case 'salario':
      return salario(emp) === op.nivel ? 'já é esse o salário' : null;
    case 'verbas':
      return Math.abs((n['marketing'] ?? 0) - op.marketing) < 1e-9 && Math.abs((n['pd'] ?? 0) - op.pd) < 1e-9 ? 'as verbas já são essas' : null;
    case 'expandir':
      if ((n['obra'] ?? 0) > 0) return 'já tem uma obra em andamento';
      return custoDaObra(c, emp, op.fracao, e) > (n['caixa'] ?? 0) ? `a obra custa ${Math.round(custoDaObra(c, emp, op.fracao, e)).toLocaleString('pt-BR')} reais e o caixa não tem` : null;
    case 'cortar':
      return (n['capacidade'] ?? 0) <= 0 ? 'não há o que cortar' : null;
    case 'emprestimo': {
      const limite = limiteDeCredito(c, emp, e);
      if (!(op.valor > 0)) return 'diga quanto';
      return op.valor > limite + 1 ? (limite < 1 ? 'o banco não empresta mais para ela' : `o banco empresta até ${Math.round(limite).toLocaleString('pt-BR')} reais`) : null;
    }
    case 'lobby':
      if (e.entidades['eu']?.q['lobista']) return 'o lobby já está trabalhando';
      if (governoAtual(e) === 'voce') return 'quem governa é você';
      if (nivelDe(e, 'impostos') === 0) return 'os impostos já estão baixos';
      return custoDoLobby(emp) > (n['caixa'] ?? 0) ? 'o caixa não paga o lobby' : null;
    case 'pagar':
      if ((n['divida'] ?? 0) < 1) return 'ela não deve nada';
      return (n['caixa'] ?? 0) < 1 ? 'o caixa não tem para pagar' : null;
    case 'exportar': {
      if (op.para === '') return emp.t['exporta'] ? null : 'ela não exporta';
      if (!(PARCEIROS as readonly string[]).includes(op.para)) return 'esse país não existe';
      if (emp.t['exporta'] === op.para) return 'já vende para lá';
      const pais = e.entidades[op.para];
      if (pais?.q['sancao']) return 'esse país sancionou o Brasil';
      if ((pais?.n['relacao'] ?? 0) < RELACAO_PARA_EXPORTAR) return 'a relação com esse país está fria demais para abrir mercado';
      return custoDeExportar(c, emp) > (n['caixa'] ?? 0) ? 'o caixa não paga a estrutura de exportar' : null;
    }
  }
}

export const NOME_DO_PRECO: Record<Preco, string> = { popular: 'o preço popular', medio: 'o preço de mercado', premium: 'o preço premium' };
const NOME_DO_SALARIO: Record<Salario, string> = { piso: 'o piso da categoria', mercado: 'o salário de mercado', acima: 'acima do mercado' };

/** A decisão vira estado (com a entrada de causa) e a frase da linha do tempo. */
export function operarNegocio(e: EstadoVida, c: Conteudo, op: OperacaoNegocio, reg: Mudanca[], nomeDaEmpresa: string): { texto: string; resumo: string } {
  const id = op.empresa ?? 'empresa';
  const emp = e.entidades[id]!;
  switch (op.tipo) {
    case 'preco':
      definirTexto(e, reg, id, 'preco', op.nivel);
      return { texto: `${nomeDaEmpresa} passou a cobrar ${NOME_DO_PRECO[op.nivel]}.`, resumo: `pôs ${NOME_DO_PRECO[op.nivel]} em ${nomeDaEmpresa}` };
    case 'salario':
      definirTexto(e, reg, id, 'salario', op.nivel);
      return { texto: `${nomeDaEmpresa} passou a pagar ${NOME_DO_SALARIO[op.nivel]}.`, resumo: `passou a pagar ${NOME_DO_SALARIO[op.nivel]} em ${nomeDaEmpresa}` };
    case 'verbas':
      somar(e, reg, id, 'marketing', op.marketing - (emp.n['marketing'] ?? 0), 'negocio');
      somar(e, reg, id, 'pd', op.pd - (emp.n['pd'] ?? 0), 'negocio');
      return {
        texto: `${nomeDaEmpresa} passou a pôr ${Math.round(op.marketing * 100)}% das vendas em marketing e ${Math.round(op.pd * 100)}% em pesquisa e desenvolvimento.`,
        resumo: `mudou as verbas de marketing e de pesquisa de ${nomeDaEmpresa}`,
      };
    case 'expandir': {
      const custo = custoDaObra(c, emp, op.fracao, e);
      const nova = (emp.n['capacidade'] ?? 0) * op.fracao;
      somar(e, reg, id, 'caixa', -custo, 'obra', 'mercado');
      somar(e, reg, id, 'obra', nova, 'negocio');
      return { texto: `${nomeDaEmpresa} começou uma obra para crescer ${Math.round(op.fracao * 100)}%. Fica pronta no ano que vem.`, resumo: `mandou ${nomeDaEmpresa} crescer ${Math.round(op.fracao * 100)}%` };
    }
    case 'cortar': {
      const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
      const corte = (emp.n['capacidade'] ?? 0) * op.fracao;
      somar(e, reg, id, 'capacidade', -corte, 'corte');
      somar(e, reg, id, 'caixa', corte * eco.giro * VALOR_DE_VENDA_DOS_ATIVOS, 'venda_de_ativos', 'mercado');
      return { texto: `${nomeDaEmpresa} fechou ${Math.round(op.fracao * 100)}% da estrutura e vendeu o que dava. A demissão saiu na sexta.`, resumo: `cortou ${Math.round(op.fracao * 100)}% de ${nomeDaEmpresa}` };
    }
    case 'emprestimo':
      somar(e, reg, id, 'caixa', op.valor, 'credito', 'banco');
      somar(e, reg, id, 'divida', op.valor, 'credito');
      return {
        texto: `${nomeDaEmpresa} pegou ${Math.round(op.valor).toLocaleString('pt-BR')} reais no banco, a ${(jurosDaEmpresa(e) * 100).toFixed(1).replace('.', ',')}% ao ano acima da inflação. O dinheiro não existia: o banco o criou ao emprestar.`,
        resumo: `pegou um empréstimo para ${nomeDaEmpresa}`,
      };
    case 'lobby': {
      const custo = custoDoLobby(emp);
      somar(e, reg, id, 'caixa', -custo, 'lobby', 'mercado');
      ganhar(e, reg, 'eu', 'lobista', null);
      return {
        texto: `${nomeDaEmpresa} contratou consultores em Brasília para explicar aos parlamentares, com paciência e almoço, o peso dos impostos: ${Math.round(custo).toLocaleString('pt-BR')} reais.`,
        resumo: `contratou lobby para ${nomeDaEmpresa}`,
      };
    }
    case 'pagar': {
      const v = Math.min(emp.n['caixa'] ?? 0, emp.n['divida'] ?? 0);
      somar(e, reg, id, 'caixa', -v, 'amortizacao', 'banco');
      somar(e, reg, id, 'divida', -v, 'amortizacao');
      return { texto: `${nomeDaEmpresa} pagou ${Math.round(v).toLocaleString('pt-BR')} reais da dívida com o banco.`, resumo: `pagou a dívida de ${nomeDaEmpresa}` };
    }
    case 'exportar': {
      if (op.para === '') {
        definirTexto(e, reg, id, 'exporta', '');
        return { texto: `${nomeDaEmpresa} parou de exportar.`, resumo: `parou de exportar com ${nomeDaEmpresa}` };
      }
      somar(e, reg, id, 'caixa', -custoDeExportar(c, emp), 'exportar', 'mercado');
      definirTexto(e, reg, id, 'exporta', op.para);
      const pais = e.entidades[op.para]?.nome ?? op.para;
      return { texto: `${nomeDaEmpresa} abriu mercado: ${pais} começa a comprar no ano que vem.`, resumo: `pôs ${nomeDaEmpresa} para vender para ${pais}` };
    }
  }
}

/** A decisão de negócio que um storylet tomou (o efeito `negocio`), na empresa que quem joga cuida de perto. */
export function decidirNoNegocio(
  e: EstadoVida,
  c: Conteudo,
  reg: Mudanca[],
  d: {
    preco?: Preco | undefined;
    salario?: Salario | undefined;
    marketing?: number | undefined;
    pd?: number | undefined;
    expandir?: number | undefined;
    cortar?: number | undefined;
    demanda?: number | undefined;
    aporte?: number | undefined;
  },
): void {
  const emp = e.entidades['empresa'];
  if (!emp || emp.tipo !== 'empresa' || emp.vivo === false || emp.n['capacidade'] === undefined) return;
  const id = emp.id;
  if (d.aporte !== undefined && d.aporte > 0) aportarNoNegocio(e, reg, emp, d.aporte);
  if (d.preco) definirTexto(e, reg, id, 'preco', d.preco);
  if (d.salario) definirTexto(e, reg, id, 'salario', d.salario);
  if (d.marketing !== undefined) somar(e, reg, id, 'marketing', d.marketing - (emp.n['marketing'] ?? 0), 'negocio');
  if (d.pd !== undefined) somar(e, reg, id, 'pd', d.pd - (emp.n['pd'] ?? 0), 'negocio');
  if (d.demanda !== undefined) somar(e, reg, id, 'demanda', (emp.n['demanda'] ?? 0) * d.demanda, 'negocio');
  if (d.expandir !== undefined) {
    // O caixa paga o que der da obra.
    const porReal = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro * precoDoSetor(ofertaDe(e, emp.t['setor']));
    const fracao = Math.min(d.expandir, Math.max(0, emp.n['caixa'] ?? 0) / Math.max(1, (emp.n['capacidade'] ?? 0) * porReal));
    if (fracao > 0.01) {
      somar(e, reg, id, 'caixa', -custoDaObra(c, emp, fracao, e), 'obra', 'mercado');
      somar(e, reg, id, 'obra', (emp.n['capacidade'] ?? 0) * fracao, 'negocio');
    }
  }
  if (d.cortar !== undefined) {
    const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
    const corte = (emp.n['capacidade'] ?? 0) * d.cortar;
    somar(e, reg, id, 'capacidade', -corte, 'corte');
    somar(e, reg, id, 'caixa', corte * eco.giro * VALOR_DE_VENDA_DOS_ATIVOS, 'venda_de_ativos', 'mercado');
  }
}

/** O dinheiro do bolso de quem joga entra no caixa (o aporte do conteúdo): o valor cresce e, com sócios, a parte dele também. */
function aportarNoNegocio(e: EstadoVida, reg: Mudanca[], emp: Entidade, valor: number): void {
  const id = emp.id;
  const antes = emp.n['valor'] ?? 0;
  const parte = emp.n['participacao'] ?? 1;
  movimentar(e, reg, { dinheiro: -valor, contraparte: id }, 'eu', 'aporte');
  somar(e, reg, id, 'caixa', valor, 'aporte', 'eu');
  somar(e, reg, id, 'valor', valor, 'empresa');
  if (parte < 1) somar(e, reg, id, 'participacao', (parte * antes + valor) / (antes + valor) - parte);
}

/**
 * O conteúdo que mexe no valor da empresa mexe no negócio: o ganho (o contrato, a filial, a concorrente comprada) vira
 * clientela e estrutura, que os fundamentos sustentam; a perda (o acordo, a multa) sai do caixa e, faltando, da
 * estrutura. Sem isso, o valor voltava sozinho para os fundamentos: o ganho sumia, e a conta paga pela empresa também.
 */
export function valorNaEmpresa(e: EstadoVida, c: Conteudo, reg: Mudanca[], id: string, delta: number): void {
  const emp = e.entidades[id]!;
  const n = emp.n;
  const valor = n['valor'] ?? 0;
  if (delta > 0) {
    const f = valor > 0 ? delta / valor : 0;
    for (const campo of ['capacidade', 'demanda']) if (f > 0) somar(e, reg, id, campo, (n[campo] ?? 0) * f, 'negocio');
  } else if (delta < 0) {
    const paga = Math.min(-delta, Math.max(0, n['caixa'] ?? 0));
    if (paga > 0) somar(e, reg, id, 'caixa', -paga, 'despesa', 'mercado');
    const resto = -delta - paga;
    if (resto > 0) {
      const porReal = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro * VALOR_DE_VENDA_DOS_ATIVOS;
      somar(e, reg, id, 'capacidade', -Math.min(n['capacidade'] ?? 0, resto / porReal), 'corte');
    }
  }
  somar(e, reg, id, 'valor', Math.max(-valor, delta), 'empresa');
}

// ---------------------------------------------------------------- a concorrência e o banco

/** A força da concorrente principal, na régua da atratividade (1 é a média do setor). */
export function forcaDaConcorrente(emp: Entidade): number {
  return (emp.n['concorrente'] ?? 50) / 50;
}

/** O juro real que a empresa paga ao banco: a Selic menos a inflação, mais o spread. */
export function jurosDaEmpresa(e: EstadoVida): number {
  const n = e.entidades['pais']?.n ?? {};
  return Math.max(0.01, ((n['juros'] ?? 9.2) - (n['inflacao'] ?? 4.5) + CREDITO_DA_EMPRESA.spread) / 100);
}

/** Até quanto o banco empresta: duas vezes o lucro do ano mais 30% da estrutura, menos o que ela já deve. */
export function limiteDeCredito(c: Conteudo, emp: Entidade, e?: EstadoVida): number {
  const estrutura = (emp.n['capacidade'] ?? 0) * economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro;
  // A influência de negócios (o tamanho do grupo, o truste) faz o banco emprestar mais.
  const nome = e ? 1 + influenciaNegocios(e) / 100 : 1;
  return Math.max(0, nome * (CREDITO_DA_EMPRESA.vezesOLucro * Math.max(0, emp.n['lucro'] ?? 0) + CREDITO_DA_EMPRESA.daEstrutura * estrutura) - (emp.n['divida'] ?? 0));
}

/** A disputa em palavras (a folha Dinheiro). */
export function textoDaConcorrencia(emp: Entidade): string {
  const v = atratividade(emp) - forcaDaConcorrente(emp);
  const base = v > 0.25 ? 'você atrai mais que a concorrente' : v < -0.25 ? 'a concorrente atrai mais que você' : 'parelha com a concorrente';
  return emp.q['guerra'] ? `${base} · guerra de preços` : base;
}

/** A entrada que mudou o campo por último (a decisão de causa), nos últimos lançamentos do livro. */
export function entradaQueMudou(e: EstadoVida, campo: string): number | null {
  for (let i = e.historico.length - 1, k = 0; i >= 0 && k < 400; i--, k++) if (e.historico[i]!.mudancas?.some((m) => m.c === campo)) return e.historico[i]!.id;
  return null;
}

/**
 * A concorrente reage: volta para a média do setor, corre atrás de quem atrai bem mais que ela, entra na guerra de
 * preços contra quem cobra o popular e toma clientela, chega nova quando o lucro é alto, e quebra quando perde a briga
 * (a clientela dela vem junto). Cada notícia aponta a decisão de preço que a provocou.
 */
/**
 * O jeito do dono da concorrente (bloco H6): a briga do traço dele (1 é a média dos traços), e metade a mais quando é
 * pessoal (a mágoa de 30 ou mais com quem joga). Só a empresa que quem joga cuida de perto tem a concorrente com dono.
 */
export function garraDaRival(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const r = emp.id === 'empresa' ? e.entidades['rival'] : undefined;
  if (!r || r.vivo === false) return 1;
  const briga = c.mundo.tracos.find((t) => t.id === r.t['traco'])?.briga ?? RIVAL.garraMedia;
  return (briga / RIVAL.garraMedia) * ((r.n['magoa'] ?? 0) >= RIVAL.pessoal ? 1.5 : 1);
}

function concorrenciaDoAno(e: EstadoVida, reg: Mudanca[], emp: Entidade, lucro: number, vendas: number, garra = 1): void {
  const id = emp.id;
  const forca = emp.n['concorrente'] ?? 50;
  const vantagem = atratividade(emp) - forca / 50;
  // Na sobra de oferta do setor, a concorrente fraca sai; na falta, chega concorrente nova mais fácil.
  const sobra = ofertaDe(e, emp.t['setor']) / 100 - 1;
  let alvo = forca + (50 - forca) * CONCORRENCIA.reversao + (vantagem > 0.15 && !emp.q['cartel'] ? CONCORRENCIA.reacao * garra : 0) + normal(e.rng, 0, CONCORRENCIA.desvio) - CICLO_DO_SETOR.naConcorrente * Math.max(0, sobra);
  const recente = (q: string, anos: number): boolean => (emp.q[q]?.ano ?? -99) >= e.ano - anos;
  const guerra = emp.q['guerra'];
  if (guerra) {
    // Quem atrai mais ganha a briga; quem atrai menos perde clientela.
    if (vantagem > 0) alvo -= CONCORRENCIA.perdaNaGuerra;
    else somar(e, reg, id, 'demanda', -(emp.n['demanda'] ?? 0) * 0.05, 'negocio');
    if (preco(emp) !== 'popular' || e.ano - guerra.ano >= CONCORRENCIA.anosDeGuerra) perder(e, reg, id, 'guerra');
  } else if (!emp.q['cartel'] && preco(emp) === 'popular' && vantagem > 0 && aleatorio(e.rng) < CONCORRENCIA.chanceDeGuerra * garra) {
    ganhar(e, reg, id, 'guerra', entradaQueMudou(e, `${id}.preco`));
    // A guerra de preços magoa o dono da concorrente: ele lembra disso na hora de vender (empresa.ts › adquirir).
    if (id === 'empresa' && e.entidades['rival']) somar(e, reg, 'rival', 'magoa', RIVAL.magoaDaGuerra, 'negocio');
  }
  if (vendas > 0 && lucro / vendas > CONCORRENCIA.margemQueAtrai && !recente('concorrente_novo', 5) && aleatorio(e.rng) < CONCORRENCIA.chanceDeEntrar * (1 + 3 * Math.max(0, -sobra))) {
    alvo = Math.max(alvo, 65);
    ganhar(e, reg, id, 'concorrente_novo', entradaQueMudou(e, `${id}.preco`));
  }
  if (alvo < CONCORRENCIA.quebra && !recente('concorrente_quebrou', 3)) {
    somar(e, reg, id, 'demanda', (emp.n['demanda'] ?? 0) * CONCORRENCIA.clientela, 'negocio');
    ganhar(e, reg, id, 'concorrente_quebrou', guerra?.causa ?? null);
    alvo = 45;
  }
  definirNumero(e, reg, id, 'concorrente', Math.round(Math.max(0, Math.min(100, alvo))), 'negocio');
}

// ---------------------------------------------------------------- os mercados de cada setor (bloco H3)

/** O preço do setor: a oferta acima do que o país compra derruba, a que falta sobe (elasticidade de 1,5). */
export function precoDoSetor(oferta: number): number {
  return Math.max(CICLO_DO_SETOR.piso, Math.min(CICLO_DO_SETOR.teto, Math.pow(Math.max(0.3, oferta / 100), -1 / CICLO_DO_SETOR.elasticidade)));
}

/** A oferta relativa do setor, em % (100 é o equilíbrio; o setor estável, e o save de antes dos mercados, ficam em 100). */
export function ofertaDe(e: EstadoVida, setor: string | undefined): number {
  return e.entidades[`setor_${setor ?? ''}`]?.n['oferta'] ?? 100;
}

/** Quanto a sobra de oferta multiplica a chance de demissão de quem trabalha no setor. */
export function apertoDoSetor(e: EstadoVida, setor: string | undefined): number {
  return 1 + CICLO_DO_SETOR.naDemissao * Math.max(0, ofertaDe(e, setor) / 100 - 1);
}

/** O setor em palavras (as folhas Dinheiro e País). */
export function textoDoSetor(e: EstadoVida, setor: string | undefined): string {
  const p = Math.round((precoDoSetor(ofertaDe(e, setor)) - 1) * 100);
  return p <= -4 ? `sobra oferta: o preço está ${-p}% abaixo do normal` : p >= 4 ? `falta oferta: o preço está ${p}% acima do normal` : 'oferta e procura em equilíbrio';
}

/** Os mercados abrem com o país: cada setor (menos o estável) começa perto do equilíbrio, sem gastar o sorteio da vida. */
export function abrirSetores(e: EstadoVida, c: Conteudo, reg?: Mudanca[]): void {
  const rng = criarRng(misturar(e.semente, 7331));
  for (const s of c.mundo.setores) {
    const id = `setor_${s.id}`;
    if (s.estavel || e.entidades[id]) continue;
    e.entidades[id] = novaEntidade({ id, tipo: 'setor', nome: s.nome });
    const oferta = Math.round((100 + normal(rng, 0, 6)) * 100) / 100;
    if (reg) somar(e, reg, id, 'oferta', oferta, 'nascimento');
    else e.entidades[id]!.n['oferta'] = oferta;
  }
}

/**
 * O ano dos mercados (a teia de aranha): a obra decidida no ano passado fica pronta, a procura do setor anda com o
 * ciclo do país (mais nos setores que sentem mais o ciclo) e com a sorte do setor, e quem investe decide a obra do ano
 * que vem pelo preço de agora. Preço alto chama obra; a obra pronta faz sobrar; a sobra derruba o preço; o preço baixo
 * fecha portas até faltar de novo. Ciclos de uns oito anos, que a sorte mantém vivos.
 */
export function anoDosSetores(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  abrirSetores(e, c, reg);
  const g = (e.entidades['pais']?.n['crescimento'] ?? 2) / 100;
  for (const s of c.mundo.setores) {
    const en = e.entidades[`setor_${s.id}`];
    if (!en) continue;
    const x = (en.n['oferta'] ?? 100) / 100;
    const procura = g * ((s.ciclo ?? 1) - 1) + normal(e.rng, 0, CICLO_DO_SETOR.choque);
    const novo = Math.max(0.6, Math.min(1.6, (x * (1 + (en.n['obra'] ?? 0) / 100)) / (1 + procura)));
    // A onda de obras tem inércia: 80% do que já estava em andamento continua, e o preço novo soma ou tira.
    const obra = Math.max(-15, Math.min(15, CICLO_DO_SETOR.inercia * (en.n['obra'] ?? 0) + 100 * CICLO_DO_SETOR.resposta * (precoDoSetor(novo * 100) - 1)));
    definirNumero(e, reg, en.id, 'oferta', Math.round(novo * 10000) / 100, 'setor');
    definirNumero(e, reg, en.id, 'obra', Math.round(obra * 100) / 100, 'setor');
  }
}

/** A fatia do mercado do setor que a empresa tem (a demanda dela sobre o que o país compra do setor). */
export function fatiaDoMercado(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  return (emp.n['demanda'] ?? 0) / mercadoDoSetor(e, economiaDo(c.setores.get(emp.t['setor'] ?? '')));
}

/** O que vem por aí: a obra em andamento no setor fica pronta no ano que vem e diz para onde o preço vai. */
export function previsaoDoSetor(e: EstadoVida, setor: string | undefined): string {
  const en = e.entidades[`setor_${setor ?? ''}`];
  if (!en) return '';
  const agora = precoDoSetor(en.n['oferta'] ?? 100);
  const depois = precoDoSetor((en.n['oferta'] ?? 100) * (1 + (en.n['obra'] ?? 0) / 100));
  const d = Math.round((depois - agora) * 100);
  return d <= -2 ? `o setor está construindo: o preço deve cair uns ${-d}% no ano que vem` : d >= 2 ? `o setor está fechando portas: o preço deve subir uns ${d}% no ano que vem` : 'sem obra grande no setor: o preço deve ficar onde está';
}

// ---------------------------------------------------------------- o capitalismo integrado (bloco H5)

/** A empresa da vida no setor fornecedor (a integração vertical), se houver. */
export function fornecedorProprio(e: EstadoVida, emp: Entidade, insumo: string): Entidade | undefined {
  return Object.values(e.entidades).find((x) => x.tipo === 'empresa' && x.vivo !== false && x.id !== emp.id && x.t['setor'] === insumo && x.n['capacidade'] !== undefined);
}

/**
 * O custo do insumo: a parte do custo variável que vem do setor fornecedor anda com o preço dele (a alta do fornecedor
 * aperta a margem); quem tem empresa no setor fornecedor compra a preço de custo, sem o ciclo dele.
 */
export function fatorDoInsumo(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const s = c.setores.get(emp.t['setor'] ?? '');
  const insumo = s?.insumo;
  const parte = s?.parteDoInsumo ?? 0;
  if (!insumo || parte <= 0) return 1;
  if (fornecedorProprio(e, emp, insumo)) return 1 - parte * CADEIA.descontoDoProprio;
  return 1 - parte + parte * precoDoSetor(ofertaDe(e, insumo));
}

/** A mão de obra: com o desemprego abaixo do natural, a folha encarece (3% por ponto); acima, barateia. */
export function fatorDaMaoDeObra(e: EstadoVida): number {
  const d = e.entidades['pais']?.n['desemprego'] ?? DESEMPREGO_NATURAL;
  return Math.max(0.8, Math.min(1.25, 1 + CADEIA.salarioPorPonto * (DESEMPREGO_NATURAL - d)));
}

/** O imposto da empresa, pela política de impostos de quem governa. */
export function impostoDaEmpresa(e: EstadoVida): number {
  return IMPOSTO_DA_EMPRESA * CADEIA.impostoPorNivel[nivelDe(e, 'impostos')]!;
}

/** O lobby custa 2% do valor da empresa, no mínimo R$ 1 milhão. */
export function custoDoLobby(emp: Entidade): number {
  return Math.max(CADEIA.lobbyMinimo, CADEIA.lobby * (emp.n['valor'] ?? 0));
}

/** Os custos de fora em uma linha (a folha Dinheiro): o insumo, a mão de obra e o imposto. */
export function textoDosCustos(e: EstadoVida, c: Conteudo, emp: Entidade): string {
  const s = c.setores.get(emp.t['setor'] ?? '');
  const ins = s?.insumo ? c.setores.get(s.insumo) : undefined;
  const pct = (x: number): string => `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(Math.round(x * 100))}%`;
  const insumo = !ins ? 'sem insumo de fora' : fornecedorProprio(e, emp, ins.id) ? `insumo de ${ins.nome} da sua própria empresa` : `insumo de ${ins.nome} a ${pct(precoDoSetor(ofertaDe(e, ins.id)) - 1)}`;
  return `${insumo} · mão de obra ${pct(fatorDaMaoDeObra(e) - 1)} · imposto de ${Math.round(impostoDaEmpresa(e) * 100)}% do lucro`;
}

/**
 * O lobby trabalha: por até três anos depois de contratado (ou da regra sob medida do conteúdo), um governo que não é o
 * de quem joga pode baixar a política de impostos, uma vez, numa notícia que aponta o lobby de causa.
 */
export function lobbyDoAno(e: EstadoVida, c: Conteudo): void {
  const q = e.entidades['eu']?.q['lobista'];
  if (!q || e.ano - q.ano > 3 || governoAtual(e) === 'voce' || nivelDe(e, 'impostos') === 0) return;
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano >= q.ano; i--) if (e.historico[i]!.ref === 'pais:lobby') return;
  // A influência política faz o lobby andar.
  const chance = Math.min(0.5, CADEIA.chanceDoLobby + influenciaPolitica(e, c) / 200);
  if (aleatorio(e.rng) >= chance) return;
  const causa = entradaQueMudou(e, 'eu.lobista');
  const entrada = novaEntrada(e, {
    tipo: 'mundo',
    causa: 'regra',
    ref: 'pais:lobby',
    texto: 'O Congresso aprovou, sem alarde, um corte de impostos que parecia escrito sob medida. Os consultores mandaram flores.',
    resumo: 'viu o lobby baixar os impostos do país',
    causas: causa !== null ? [causa] : [],
  });
  const reg: Mudanca[] = [];
  somar(e, reg, 'pais', 'pol_impostos', -1, 'lobby');
  lancar(e, entrada, reg);
}

