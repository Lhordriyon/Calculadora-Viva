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
import type { Conteudo } from './conteudo.ts';
import type { DefSetor } from './esquema.ts';
import { movimentar } from './economia.ts';
import { definirNumero, definirTexto, somar } from './livro.ts';
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
  const bruto = (n['tracao'] ?? 0) / 100 + fase.empresa * (setor?.ciclo ?? 1) + fora + sorte + (atratividade(emp) - 1) * ATRATIVIDADE_NO_CRESCIMENTO;
  const cresce = bruto > 0 ? bruto * Math.max(0, 1 - demanda / teto) : Math.max(-0.6, bruto);
  somar(e, reg, id, 'demanda', demanda * cresce, 'negocio');

  // Vende o que a capacidade dá conta, no preço escolhido; o resto da procura vira fila.
  const p = PRECOS[preco(emp)];
  const capacidade = n['capacidade'] ?? 0;
  const entregue = Math.min(capacidade, procura(e, emp));
  const fracaoFora = procura(e, emp) > 0 ? exportacaoDe(e, emp) / procura(e, emp) : 0;
  // O dólar do ano: quem exporta recebe mais reais pelo que vende, quem importa paga mais caro pelo que compra.
  const dolar = (fase.cambio ?? 0) * DOLAR_NO_CAIXA;
  const vendas = entregue * p.preco * (1 + Math.max(0, setor?.cambio ?? 0) * dolar);
  const variavel = entregue * (1 - eco.margem) * p.custo * (1 + Math.max(0, -(setor?.cambio ?? 0)) * dolar);
  const fixo = capacidade * eco.fixo * SALARIOS[salario(emp)].fixo;
  const verbas = vendas * ((n['marketing'] ?? 0) + (n['pd'] ?? 0));
  const ebit = vendas - variavel - fixo - verbas;
  const imposto = Math.max(0, ebit) * IMPOSTO_DA_EMPRESA;
  const lucro = ebit - imposto;

  // O caixa: entra o que vendeu (de fora, do país que comprou), saem os custos e o imposto.
  const exportou = vendas * fracaoFora;
  if (vendas - exportou > 0) somar(e, reg, id, 'caixa', vendas - exportou, 'vendas', 'mercado');
  if (exportou > 0) somar(e, reg, id, 'caixa', exportou, 'exportacao', emp.t['exporta']!);
  if (variavel + fixo + verbas > 0) somar(e, reg, id, 'caixa', -(variavel + fixo + verbas), 'custos', 'mercado');
  if (imposto > 0) somar(e, reg, id, 'caixa', -imposto, 'imposto', 'tesouro');

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
  const alvo = Math.max(0, n['caixa'] ?? 0) + (n['obra'] ?? 0) * eco.giro + Math.max(ativos, multiplo * Math.max(0, lucro));
  somar(e, reg, id, 'valor', (alvo - (n['valor'] ?? 0)) * 0.5, 'empresa');
  definirNumero(e, reg, id, 'lucro', lucro, 'empresa');
  definirNumero(e, reg, id, 'receita', vendas, 'negocio');
  definirNumero(e, reg, id, 'impostos', imposto, 'negocio');
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
  | { tipo: 'exportar'; empresa?: string; para: Parceiro | '' };

const TIPOS = new Set(['preco', 'expandir', 'cortar', 'verbas', 'salario', 'exportar']);
export function ehOperacaoDeNegocio(op: { tipo: string }): op is OperacaoNegocio {
  return TIPOS.has(op.tipo);
}

/** Quanto custa crescer `fracao` da capacidade (a obra paga do caixa). */
export function custoDaObra(c: Conteudo, emp: Entidade, fracao: number): number {
  return (emp.n['capacidade'] ?? 0) * fracao * economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro;
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
      return custoDaObra(c, emp, op.fracao) > (n['caixa'] ?? 0) ? `a obra custa ${Math.round(custoDaObra(c, emp, op.fracao)).toLocaleString('pt-BR')} reais e o caixa não tem` : null;
    case 'cortar':
      return (n['capacidade'] ?? 0) <= 0 ? 'não há o que cortar' : null;
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

const NOME_DO_PRECO: Record<Preco, string> = { popular: 'o preço popular', medio: 'o preço de mercado', premium: 'o preço premium' };
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
      const custo = custoDaObra(c, emp, op.fracao);
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
    const porReal = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro;
    const fracao = Math.min(d.expandir, Math.max(0, emp.n['caixa'] ?? 0) / Math.max(1, (emp.n['capacidade'] ?? 0) * porReal));
    if (fracao > 0.01) {
      somar(e, reg, id, 'caixa', -custoDaObra(c, emp, fracao), 'obra', 'mercado');
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
