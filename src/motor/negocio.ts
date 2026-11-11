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
import { CONCORRENCIA, CREDITO_DA_EMPRESA, PRODUTO } from './regras.ts';
import type { Conteudo } from './conteudo.ts';
import type { DefSetor } from './esquema.ts';
import { movimentar } from './economia.ts';
import { diluirPeloAporte, pagarDividendos } from './societario.ts';
import { cicloDoPais, defDoPais, mercadoNoPais, paisDaEmpresa } from './mundo-das-empresas.ts';
import { abrirConcorrente, CONCORRENTES_POR_SETOR, concorrentesNoSetor, deFora, fimDaGuerra, guerraComAPrincipal, principalDe } from './concorrentes.ts';
import { equipeDoApoio, estruturaDe, mudarCapacidade, mudarObra, obraPronta, parteNaCidade, produtivasDe } from './unidades.ts';
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

/**
 * O que o país ainda compra do setor fora das outras empresas de quem joga: o teto da demanda desta (o mercado tem
 * tamanho, e duas empresas do mesmo grupo no mesmo setor dividem o mesmo mercado).
 */
export function espacoNoMercado(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const setor = emp.t['setor'] ?? '';
  const pais = paisDaEmpresa(emp);
  let outras = 0;
  for (const x of Object.values(e.entidades)) if (x.tipo === 'empresa' && x.vivo !== false && x.id !== emp.id && (x.t['setor'] ?? '') === setor && paisDaEmpresa(x) === pais) outras += x.n['demanda'] ?? 0;
  return Math.max(0, mercadoDaEmpresa(e, c, emp) - outras);
}

/** O que o país da empresa compra do setor dela (o Brasil, ou o país da filial lá fora: mundo-das-empresas.ts). */
export function mercadoDaEmpresa(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const setor = c.setores.get(emp.t['setor'] ?? '');
  const pais = paisDaEmpresa(emp);
  return pais ? mercadoNoPais(e, c, setor, pais, economiaDo(setor).peso) : mercadoDoSetor(e, economiaDo(setor));
}

/**
 * A demanda que muda de uma vez (a concorrente comprada, a fusão, o contrato do conteúdo, a clientela de quem quebrou):
 * o ganho só entra até onde o mercado comporta; a perda vale inteira. Devolve o que entrou. Sem isso, a compra somava
 * clientes que o país não tinha: a folha chegava a mostrar 141% do que o país compra do setor.
 */
export function somarDemanda(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, delta: number): number {
  const cabe = delta > 0 ? Math.min(delta, Math.max(0, espacoNoMercado(e, c, emp) - (emp.n['demanda'] ?? 0))) : delta;
  return somar(e, reg, emp.id, 'demanda', cabe, 'negocio');
}

/** O quanto o produto atrai, perto de 1 na média do setor: a qualidade e a marca. */
export function atratividade(emp: Entidade): number {
  return (0.55 * (emp.n['qualidade'] ?? 50) + 0.45 * (emp.n['marca'] ?? 50)) / 50;
}

/** O que o mercado quer comprar dela neste preço (em reais ao preço médio), aqui e lá fora. */
export function procura(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const p = PRECOS[preco(emp)];
  // Premium sem qualidade espanta cliente.
  const semQualidade = preco(emp) === 'premium' && (emp.n['qualidade'] ?? 50) < 60 ? (emp.n['qualidade'] ?? 50) / 60 : 1;
  // O que o país compra dela não passa do que ele compra do setor (o preço popular e o produto que atrai vendem mais, até aí).
  const aqui = Math.min((emp.n['demanda'] ?? 0) * p.volume * (0.8 + 0.2 * atratividade(emp)) * semQualidade, espacoNoMercado(e, c, emp));
  return aqui + exportacaoDe(e, emp);
}

/** Quanto do que ela consegue entregar o mercado quer (acima de 1, sobra pedido; abaixo, sobra estrutura). */
export function ocupacaoDe(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const capacidade = emp.n['capacidade'] ?? 0;
  return capacidade > 0 ? procura(e, c, emp) / capacidade : 0;
}

/** A demanda de fora: a parte da demanda que o país escolhido compra, pela relação, pelo crescimento dele, pelo acordo; a sanção fecha a porta. */
export function exportacaoDe(e: EstadoVida, emp: Entidade): number {
  const para = emp.t['exporta'];
  // A filial lá fora vende no mercado de lá: não exporta.
  if (!para || paisDaEmpresa(emp)) return 0;
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

/** Os empregos de todas as unidades: as que produzem (pelas vendas) e as de apoio (pelo porte). */
export function funcionariosDe(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  return Math.round(empregosDe(c, emp) + equipeDoApoio(e, emp));
}

/** Os empregos que a empresa tem na cidade de quem joga (as unidades que ficam nela). */
export function empregosNaCidadeDe(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const cidade = e.entidades['lugar']?.nome ?? '';
  return empregosDe(c, emp) * parteNaCidade(e, emp, cidade) + equipeDoApoio(e, emp, cidade);
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
  // A estrutura nasce numa unidade (a sede: a fábrica, a loja), na cidade de quem joga (unidades.ts).
  mudarCapacidade(e, c, reg, emp, capacidade, 'negocio');
  somarDemanda(e, c, reg, emp, capacidade * (capital !== undefined ? DEMANDA_DA_FUNDACAO : 0.95));
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
  /** Empregos na cidade de quem joga, de antes e de agora (as unidades que ficam nela). */
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
  const empregosAntes = empregosNaCidadeDe(e, c, emp);
  /** A empresa é de quem joga (as de fora são as concorrentes, concorrentes.ts). */
  const doGrupo = !deFora(emp);

  // A obra do ano passado fica pronta, na unidade em que foi feita (unidades.ts).
  obraPronta(e, c, reg, emp);
  const estrutura = estruturaDe(e, c, emp);

  // A demanda anda: o momento (a tração), o ciclo do setor, o mundo lá fora, a sorte e o quanto o produto atrai; o
  // mercado tem tamanho (perto do teto, o ganho some; a perda vale inteira).
  // A demanda acima do mercado (um save de antes do teto para todo ganho) volta para dentro dele.
  const acima = (n['demanda'] ?? 0) - espacoNoMercado(e, c, emp);
  if (acima > 0) somar(e, reg, id, 'demanda', -acima, 'mercado');
  const demanda = n['demanda'] ?? 0;
  const teto = mercadoDaEmpresa(e, c, emp) * FATIA_MAXIMA_DO_MERCADO;
  // A filial lá fora (mundo-das-empresas.ts) anda com o ciclo de lá; a sanção de lá corta a clientela, o acordo ajuda.
  const pais = paisDaEmpresa(emp);
  const deLa = pais ? e.entidades[pais] : undefined;
  const ciclo = pais
    ? cicloDoPais(e, c, pais) * (setor?.ciclo ?? 1) + (deLa?.q['sancao'] ? -0.25 : 0) + (deLa?.q['acordo'] ? 0.02 : 0)
    : fase.empresa * (setor?.ciclo ?? 1) + fora;
  const bruto = (n['tracao'] ?? 0) / 100 + ciclo + sorte + (atratividade(emp) - forcaDaConcorrente(emp)) * ATRATIVIDADE_NO_CRESCIMENTO;
  const cresce = bruto > 0 ? bruto * Math.max(0, 1 - demanda / teto) : Math.max(-0.6, bruto);
  // Os números do ano vão arredondados (os reais, os centavos, os centésimos): o livro de cada empresa cabe no save.
  definirNumero(e, reg, id, 'demanda', Math.max(0, Math.round(demanda * (1 + cresce))), 'negocio');

  // Vende o que a capacidade dá conta, no preço escolhido; o resto da procura vira fila.
  const p = PRECOS[preco(emp)];
  const capacidade = n['capacidade'] ?? 0;
  const procurado = procura(e, c, emp);
  const entregue = Math.min(capacidade, procurado);
  const fracaoFora = procurado > 0 ? exportacaoDe(e, emp) / procurado : 0;
  // O dólar do ano: quem exporta recebe mais reais pelo que vende, quem importa paga mais caro pelo que compra.
  const dolar = (fase.cambio ?? 0) * DOLAR_NO_CAIXA;
  // A filial lá fora vende e gasta na moeda de lá: com o dólar alto, tudo dela vale mais em reais.
  const cambioDeLa = pais ? 1 + dolar : 1;
  // Na guerra de preços, todo mundo cobra menos.
  const vendas = centavos(cambioDeLa * entregue * p.preco * (pais ? 1 : 1 + Math.max(0, setor?.cambio ?? 0) * dolar) * (emp.q['guerra'] ? 1 - CONCORRENCIA.corteNaGuerra : 1) * precoDoSetor(ofertaDe(e, emp.t['setor'])));
  // O insumo vem do setor fornecedor (a alta dele encarece; o fornecedor próprio vende a preço de custo).
  // O centro de distribuição barateia cada venda (o frete, a perda).
  const variavel = centavos(cambioDeLa * entregue * (1 - eco.margem) * p.custo * (pais ? 1 : 1 + Math.max(0, -(setor?.cambio ?? 0)) * dolar) * fatorDoInsumo(e, c, emp) * estrutura.fatorDoCentro);
  // A folha anda com o mercado de trabalho (desemprego baixo, gente cara) e com a cidade de cada unidade (o salário e o
  // aluguel do lugar, comparados com os da sede); as unidades de apoio pagam o porte delas.
  const fixo = centavos(cambioDeLa * (estrutura.capacidadePelaCidade * eco.fixo + estrutura.porteDoApoio) * SALARIOS[salario(emp)].fixo * (pais ? 1 : fatorDaMaoDeObra(e)));
  const campanha = centavos(vendas * (n['marketing'] ?? 0));
  const pesquisa = centavos(vendas * (n['pd'] ?? 0));
  const verbas = campanha + pesquisa;
  // A mídia do grupo (I-162) vende audiência: a campanha que as irmãs compraram dela antes de ela fechar o ano é receita.
  const publicidade = doGrupo ? publicidadeRecebida(reg, id) : 0;
  const ebit = vendas + publicidade - variavel - fixo - verbas;
  // O juro do banco sai antes do imposto (o lucro é depois dele).
  const juros = centavos((n['divida'] ?? 0) * jurosDaEmpresa(e));
  // Lá fora, o imposto é o de lá (mundo.json › estrangeiros › imposto) e vai para o governo de lá.
  const imposto = centavos(Math.max(0, ebit - juros) * (pais ? (defDoPais(c, pais)?.imposto ?? impostoDaEmpresa(e)) : impostoDaEmpresa(e)));
  const lucro = ebit - juros - imposto;

  // O caixa: entra o que vendeu (de fora, do país que comprou), saem os custos e o imposto.
  const exportou = pais ? 0 : centavos(vendas * fracaoFora);
  // Quem compra e quem vende para a filial lá fora é o país de lá (a contraparte, como na exportação).
  const mercadoDela = pais ?? 'mercado';
  let impostoDaMidia = 0;
  if (exportou > 0) somar(e, reg, id, 'caixa', exportou, 'exportacao', emp.t['exporta']!);
  if (!doGrupo) {
    // A concorrente (concorrentes.ts) anota o resultado do mercado num lançamento só: o livro dela é o mais curto que fecha.
    const liquido = vendas - exportou - (variavel + fixo + verbas);
    if (liquido !== 0) somar(e, reg, id, 'caixa', liquido, 'resultado', 'mercado');
  } else {
    if (vendas - exportou > 0) somar(e, reg, id, 'caixa', vendas - exportou, 'vendas', mercadoDela);
    // O que ela compra de outras para produzir (o insumo, o frete, a campanha) é o consumo intermediário das contas
    // nacionais (demonstracoes.ts); a estrutura e a pesquisa são a folha e a casa dela. A campanha vai para a mídia: a
    // do grupo recebe de caixa para caixa (a consolidação elimina), o resto vai para o mercado.
    const naMidia = pais ? { pago: 0, imposto: 0 } : campanhaNaMidia(e, c, reg, emp, campanha);
    impostoDaMidia = naMidia.imposto;
    if (variavel + campanha - naMidia.pago > 0) somar(e, reg, id, 'caixa', -(variavel + campanha - naMidia.pago), 'insumos', mercadoDela);
    if (fixo + pesquisa > 0) somar(e, reg, id, 'caixa', -(fixo + pesquisa), 'custos', mercadoDela);
  }
  if (imposto > 0) somar(e, reg, id, 'caixa', -imposto, 'imposto', pais ?? 'tesouro');
  // O banco recebe o juro e a parcela (o dinheiro que volta para ele deixa de existir).
  if (juros >= 1) somar(e, reg, id, 'caixa', -juros, 'juros', 'banco');
  const parcela = centavos((n['divida'] ?? 0) * CREDITO_DA_EMPRESA.amortizacao);
  if (parcela >= 1) {
    somar(e, reg, id, 'caixa', -parcela, 'amortizacao', 'banco');
    somar(e, reg, id, 'divida', -parcela, 'amortizacao');
  }

  // Os dividendos saem do lucro, na proporção que os donos decidiram, e do que há no caixa; sobem pelos sócios
  // (quem joga, a holding, a pessoa dona, o mercado), cada um pela parte dele (societario.ts).
  // Sob a sanção de lá, o dividendo da filial fica retido no país (a remessa está bloqueada).
  const dividendos = lucro > 0 && !deLa?.q['sancao'] ? centavos(Math.min(Math.max(0, n['caixa'] ?? 0), lucro * (n['retirada'] ?? 0))) : 0;
  pagarDividendos(e, reg, emp, dividendos);

  // O ano que não fecha: vende capacidade (pela metade do que custou) até o caixa voltar a zero, e demite junto.
  let cortou = 0;
  const caixa = n['caixa'] ?? 0;
  if (caixa < 0) {
    const porReal = eco.giro * VALOR_DE_VENDA_DOS_ATIVOS;
    cortou = Math.min(n['capacidade'] ?? 0, -caixa / porReal);
    mudarCapacidade(e, c, reg, emp, -cortou, 'corte');
    somar(e, reg, id, 'caixa', cortou * porReal, 'venda_de_ativos', 'mercado');
    // O que nem a venda cobre, os donos perdem (o fornecedor que não recebeu).
    const falta = n['caixa'] ?? 0;
    if (falta < 0) somar(e, reg, id, 'caixa', -falta, 'calote_de_fornecedor', 'mercado');
  }

  // A qualidade anda para o que o P&D, a tecnologia do país e o salário sustentam; a marca, para o que o marketing,
  // a qualidade, a fama de quem manda e a mídia própria sustentam.
  const tecnologia = (e.entidades['pais']?.n['tecnologia'] ?? 50) - 50;
  // O laboratório faz o P&D render mais (unidades.ts); a geração do produto que passou da idade puxa para baixo (I-160).
  const alvoQualidade = 35 + (n['pd'] ?? 0) * 600 * estrutura.fatorDoLaboratorio + tecnologia * 0.2 + SALARIOS[salario(emp)].qualidade - velhiceDoProduto(e, emp);
  // Perto do alvo, a qualidade e a marca andam centésimos: só vão para o livro quando andam um décimo ou mais.
  const passoQualidade = (Math.max(0, Math.min(100, alvoQualidade)) - (n['qualidade'] ?? 50)) * 0.25;
  if (Math.abs(passoQualidade) >= 0.1 || n['qualidade'] === undefined) definirNumero(e, reg, id, 'qualidade', centavos((n['qualidade'] ?? 50) + passoQualidade), 'negocio');
  // A fama de quem manda e a mídia própria são de quem joga: puxam a marca das empresas do grupo, não a das concorrentes.
  const fama = doGrupo ? (e.entidades['eu']?.n['fama'] ?? 0) : 0;
  // A campanha só na mídia do grupo alcança a audiência dela, não o país inteiro (mídia pequena, marca que anda devagar).
  const alvoMarca = 30 + (n['marketing'] ?? 0) * 600 * alcanceDaCampanha(e, c, emp) + ((n['qualidade'] ?? 50) - 50) * 0.3 + fama / 5 + (doGrupo && temMidia(e) ? 10 : 0);
  const passoMarca = (Math.max(0, Math.min(100, alvoMarca)) - (n['marca'] ?? 50)) * 0.25;
  if (Math.abs(passoMarca) >= 0.1 || n['marca'] === undefined) definirNumero(e, reg, id, 'marca', centavos((n['marca'] ?? 50) + passoMarca), 'negocio');

  // O valor vai para os fundamentos: o caixa e a obra, mais o maior entre os ativos a preço de venda e o lucro vezes o múltiplo.
  const ativos = (n['capacidade'] ?? 0) * eco.giro * VALOR_DE_VENDA_DOS_ATIVOS + estrutura.ativosDoApoio;
  const multiplo = eco.multiplo * (emp.q['na_bolsa'] ? 1 + PREMIO_DA_BOLSA : 1);
  const alvo = Math.max(0, Math.max(0, n['caixa'] ?? 0) + (n['obra'] ?? 0) * eco.giro + Math.max(ativos, multiplo * Math.max(0, lucro)) - (n['divida'] ?? 0));
  definirNumero(e, reg, id, 'valor', Math.round((n['valor'] ?? 0) + (alvo - (n['valor'] ?? 0)) * 0.5), 'empresa');
  definirNumero(e, reg, id, 'lucro', Math.round(lucro), 'empresa');
  definirNumero(e, reg, id, 'receita', Math.round(vendas + publicidade), 'negocio');
  // O imposto do ano só importa para a folha de quem joga: a concorrente não guarda.
  if (doGrupo) definirNumero(e, reg, id, 'impostos', Math.round(imposto), 'negocio');
  // A disputa é das empresas do grupo com as de fora (as de fora decidem a delas em concorrentes.ts).
  if (doGrupo) concorrenciaDoAno(e, c, reg, emp, lucro, vendas, garraDaRival(e, c, emp));
  return { vendas, lucro, imposto: imposto + impostoDaMidia, dividendos, cortou, empregosAntes, empregosDepois: empregosNaCidadeDe(e, c, emp) };
}

/** Arredonda para centavos (os números do negócio no livro). */
function centavos(v: number): number {
  return Math.round(v * 100) / 100;
}

// ---------------------------------------------------------------- o produto (I-160)

/** Há quantos anos a geração do produto está nas lojas (desde o lançamento; sem lançamento, desde a fundação). */
export function idadeDoProduto(e: EstadoVida, emp: Entidade): number {
  return Math.max(0, e.ano - (emp.q['lancamento']?.ano ?? emp.nascimento ?? e.ano));
}

/** Quanto a qualidade que o produto sustenta cai pela idade da geração. */
export function velhiceDoProduto(e: EstadoVida, emp: Entidade): number {
  return Math.min(PRODUTO.maximo, PRODUTO.porAno * Math.max(0, idadeDoProduto(e, emp) - PRODUTO.envelhece));
}

/** O que custa lançar a geração nova: uma fração das vendas do ano, com um piso. */
export function custoDoLancamento(emp: Entidade): number {
  return Math.max(PRODUTO.minimo, (emp.n['receita'] ?? 0) * PRODUTO.custo);
}

/** A geração nova chega: o caixa paga o desenvolvimento e a campanha, e a qualidade e a marca sobem na hora. */
export function lancarProduto(e: EstadoVida, reg: Mudanca[], emp: Entidade, causa: number | null): void {
  const id = emp.id;
  const custo = custoDoLancamento(emp);
  somar(e, reg, id, 'caixa', -custo, 'lancamento', 'mercado');
  if (emp.q['lancamento']) perder(e, reg, id, 'lancamento');
  ganhar(e, reg, id, 'lancamento', causa);
  somar(e, reg, id, 'qualidade', Math.min(100 - (emp.n['qualidade'] ?? 50), PRODUTO.qualidade), 'negocio');
  somar(e, reg, id, 'marca', Math.min(100 - (emp.n['marca'] ?? 50), PRODUTO.marca), 'negocio');
}

// ---------------------------------------------------------------- a mídia (I-162)

/** O setor que vende audiência (a TV, o rádio, o jornal, o streaming, a agência): o de cultura e internet. */
export const SETOR_DA_MIDIA = 'cultura';

/** As empresas de mídia do grupo de quem joga (as que vendem audiência), vivas e com negócio. */
export function midiasDoGrupo(e: EstadoVida): Entidade[] {
  // A mídia do grupo no Brasil (a filial de mídia lá fora vende a audiência de lá, no mercado de lá).
  return Object.values(e.entidades).filter((x) => x.tipo === 'empresa' && x.vivo !== false && !deFora(x) && !paisDaEmpresa(x) && !x.q['holding'] && x.n['capacidade'] !== undefined && x.t['setor'] === SETOR_DA_MIDIA);
}

/** A audiência de uma empresa de mídia: a parte dela no que o país consome do setor (0 a 1). */
export function audienciaDe(e: EstadoVida, c: Conteudo, m: Entidade): number {
  return Math.max(0, Math.min(1, (m.n['demanda'] ?? 0) / mercadoDoSetor(e, economiaDo(c.setores.get(SETOR_DA_MIDIA)))));
}

/** O que a mídia já recebeu de campanha neste ano (as irmãs que fecharam o ano antes dela). */
function publicidadeRecebida(reg: readonly Mudanca[], id: string): number {
  let v = 0;
  for (const m of reg) if (m.c === `${id}.caixa` && m.r === 'publicidade' && (m.d ?? 0) > 0) v += m.d!;
  return v;
}

/** A mídia do grupo em que a empresa anuncia por decisão de quem joga (a folha), se ela ainda for do grupo. */
function midiaEscolhida(e: EstadoVida, emp: Entidade): Entidade | undefined {
  const id = emp.t['anuncia'];
  const m = id ? e.entidades[id] : undefined;
  return m && m.id !== emp.id && m.vivo !== false && !deFora(m) && m.t['setor'] === SETOR_DA_MIDIA && m.n['capacidade'] !== undefined ? m : undefined;
}

/**
 * Quanto a campanha alcança (1 é o país inteiro, comprando no mercado): só na mídia do grupo, a audiência dela, com um
 * piso (quem assiste é cliente) e o país inteiro a partir de uns 10% de audiência.
 */
export function alcanceDaCampanha(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const m = midiaEscolhida(e, emp);
  return m ? Math.min(1, 0.4 + 6 * audienciaDe(e, c, m)) : 1;
}

/**
 * A campanha do ano vai para a mídia. Quem escolheu anunciar na mídia do grupo põe nela a verba inteira; quem não
 * escolheu compra no mercado, e a mídia do grupo recebe a parte da audiência dela. O dinheiro sai do caixa de quem
 * contrata e entra no de quem presta, no mesmo lançamento; se a mídia já fechou o ano, a campanha entra na receita e no
 * lucro dela na hora, com o imposto. Devolve o que foi para a mídia do grupo e o imposto que ela pagou depois do ano.
 */
function campanhaNaMidia(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, campanha: number): { pago: number; imposto: number } {
  if (!(campanha >= 1)) return { pago: 0, imposto: 0 };
  const escolhida = midiaEscolhida(e, emp);
  // Pela audiência, só o que faz diferença (1% da campanha ou mais): a mídia pequena não vira dois lançamentos de troco por ano.
  const partes: [Entidade, number][] = escolhida ? [[escolhida, campanha]] : midiasDoGrupo(e).filter((m) => m.id !== emp.id).map((m): [Entidade, number] => [m, centavos(campanha * audienciaDe(e, c, m))]).filter(([, v]) => v >= campanha * 0.01);
  let pago = 0;
  let imposto = 0;
  for (const [m, v] of partes) {
    if (!(v >= 1)) continue;
    somar(e, reg, emp.id, 'caixa', -v, 'publicidade', m.id);
    somar(e, reg, m.id, 'caixa', v, 'publicidade', emp.id);
    pago += v;
    if (!reg.some((x) => x.c === `${m.id}.lucro`)) continue;
    // A mídia já fechou o ano: a campanha entra agora, com o imposto dela.
    const imp = v * impostoDaEmpresa(e);
    somar(e, reg, m.id, 'receita', v, 'negocio');
    somar(e, reg, m.id, 'impostos', imp, 'negocio');
    somar(e, reg, m.id, 'lucro', v - imp, 'empresa');
    if (imp >= 1) somar(e, reg, m.id, 'caixa', -imp, 'imposto', 'tesouro');
    imposto += imp;
  }
  return { pago, imposto };
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
  | { tipo: 'expandir'; empresa?: string; fracao: number; unidade?: string }
  | { tipo: 'cortar'; empresa?: string; fracao: number }
  | { tipo: 'verbas'; empresa?: string; marketing: number; pd: number }
  | { tipo: 'salario'; empresa?: string; nivel: Salario }
  | { tipo: 'exportar'; empresa?: string; para: Parceiro | '' }
  | { tipo: 'emprestimo'; empresa?: string; valor: number }
  | { tipo: 'pagar'; empresa?: string }
  | { tipo: 'lobby'; empresa?: string }
  /** Onde a empresa põe a campanha: na mídia do grupo (o id dela) ou no mercado (''). */
  | { tipo: 'anunciar'; empresa?: string; midia: string }
  /** Lança a geração nova do produto (I-160). */
  | { tipo: 'lancar'; empresa?: string };

const TIPOS = new Set(['preco', 'expandir', 'cortar', 'verbas', 'salario', 'exportar', 'emprestimo', 'pagar', 'lobby', 'anunciar', 'lancar']);
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
  if (emp.q['holding']) return 'a holding não tem operação própria: quem produz e vende são as subsidiárias';
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
      if (op.unidade && !produtivasDe(e, emp).some((u) => u.id === op.unidade)) return 'essa unidade não produz para esta empresa';
      return custoDaObra(c, emp, op.fracao, e) > (n['caixa'] ?? 0) ? `a obra custa ${Math.round(custoDaObra(c, emp, op.fracao, e)).toLocaleString('pt-BR')} reais e o caixa não tem` : null;
    case 'cortar':
      return (n['capacidade'] ?? 0) <= 0 ? 'não há o que cortar' : null;
    case 'emprestimo': {
      const limite = limiteDeCredito(c, emp, e);
      if (!(op.valor > 0)) return 'diga quanto';
      return op.valor > limite + 1 ? (limite < 1 ? 'o banco não empresta mais para ela' : `o banco empresta até ${Math.round(limite).toLocaleString('pt-BR')} reais`) : null;
    }
    case 'lancar':
      if (emp.n['capacidade'] === undefined) return 'a empresa ainda não opera';
      if (idadeDoProduto(e, emp) < PRODUTO.intervalo) return 'o produto de agora ainda é novo';
      return custoDoLancamento(emp) > (n['caixa'] ?? 0) ? `o lançamento custa ${Math.round(custoDoLancamento(emp)).toLocaleString('pt-BR')} reais e o caixa não tem` : null;
    case 'anunciar': {
      if (deFora(emp)) return 'essa empresa não é sua';
      if ((emp.t['anuncia'] ?? '') === op.midia) return 'já é assim';
      if (op.midia === '') return null;
      const m = e.entidades[op.midia];
      if (!m || m.id === emp.id || m.vivo === false || deFora(m) || m.t['setor'] !== SETOR_DA_MIDIA || m.n['capacidade'] === undefined) return 'escolha uma empresa de mídia do seu grupo';
      return null;
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
      // A obra cresce a unidade escolhida (ou a sede).
      mudarObra(e, c, reg, emp, nova, op.unidade ? e.entidades[op.unidade] : undefined);
      return { texto: `${nomeDaEmpresa} começou uma obra para crescer ${Math.round(op.fracao * 100)}%. Fica pronta no ano que vem.`, resumo: `mandou ${nomeDaEmpresa} crescer ${Math.round(op.fracao * 100)}%` };
    }
    case 'cortar': {
      const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
      const corte = (emp.n['capacidade'] ?? 0) * op.fracao;
      mudarCapacidade(e, c, reg, emp, -corte, 'corte');
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
    case 'lancar': {
      const idade = idadeDoProduto(e, emp);
      const custo = custoDoLancamento(emp);
      lancarProduto(e, reg, emp, null);
      return {
        texto: `${nomeDaEmpresa} lançou a geração nova do produto, por ${Math.round(custo).toLocaleString('pt-BR')} reais: a de antes estava ${idade === 1 ? 'há um ano' : `há ${idade} anos`} nas prateleiras.`,
        resumo: `lançou a geração nova do produto de ${nomeDaEmpresa}`,
      };
    }
    case 'anunciar': {
      definirTexto(e, reg, id, 'anuncia', op.midia);
      const m = op.midia ? e.entidades[op.midia] : undefined;
      return m
        ? { texto: `${nomeDaEmpresa} passou a pôr a campanha inteira ${m.genero === 'm' ? 'no' : 'na'} ${m.nome}: o dinheiro fica no grupo, e a marca chega a quem assiste.`, resumo: `pôs a campanha de ${nomeDaEmpresa} na mídia do grupo` }
        : { texto: `${nomeDaEmpresa} voltou a comprar a campanha no mercado: a marca chega ao país inteiro.`, resumo: `pôs a campanha de ${nomeDaEmpresa} no mercado` };
    }
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
    lancar?: true | undefined;
  },
  causa: number | null = null,
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
  // A geração nova do produto, se o caixa pagar (sem caixa, a história fica, e o produto continua o de antes).
  if (d.lancar && custoDoLancamento(emp) <= (emp.n['caixa'] ?? 0)) lancarProduto(e, reg, emp, causa);
  if (d.expandir !== undefined) {
    // O caixa paga o que der da obra.
    const porReal = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro * precoDoSetor(ofertaDe(e, emp.t['setor']));
    const fracao = Math.min(d.expandir, Math.max(0, emp.n['caixa'] ?? 0) / Math.max(1, (emp.n['capacidade'] ?? 0) * porReal));
    if (fracao > 0.01) {
      somar(e, reg, id, 'caixa', -custoDaObra(c, emp, fracao, e), 'obra', 'mercado');
      mudarObra(e, c, reg, emp, (emp.n['capacidade'] ?? 0) * fracao);
    }
  }
  if (d.cortar !== undefined) {
    const eco = economiaDo(c.setores.get(emp.t['setor'] ?? ''));
    const corte = (emp.n['capacidade'] ?? 0) * d.cortar;
    mudarCapacidade(e, c, reg, emp, -corte, 'corte');
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
  if (parte < 1 || (emp.n['participacao_socia'] ?? 0) > 0) diluirPeloAporte(e, reg, emp, valor, antes);
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
    if (f > 0) {
      mudarCapacidade(e, c, reg, emp, (n['capacidade'] ?? 0) * f, 'negocio');
      somarDemanda(e, c, reg, emp, (n['demanda'] ?? 0) * f);
    }
  } else if (delta < 0) {
    const paga = Math.min(-delta, Math.max(0, n['caixa'] ?? 0));
    if (paga > 0) somar(e, reg, id, 'caixa', -paga, 'despesa', 'mercado');
    const resto = -delta - paga;
    if (resto > 0) {
      const porReal = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro * VALOR_DE_VENDA_DOS_ATIVOS;
      mudarCapacidade(e, c, reg, emp, -Math.min(n['capacidade'] ?? 0, resto / porReal), 'corte');
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

function concorrenciaDoAno(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, lucro: number, vendas: number, garra = 1): void {
  const principal = principalDe(e, emp);
  if (principal) {
    disputaComAConcorrente(e, c, reg, emp, principal, lucro, vendas, garra);
    return;
  }
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
    somarDemanda(e, c, reg, emp, (emp.n['demanda'] ?? 0) * CONCORRENCIA.clientela);
    ganhar(e, reg, id, 'concorrente_quebrou', guerra?.causa ?? null);
    alvo = 45;
  }
  definirNumero(e, reg, id, 'concorrente', Math.round(Math.max(0, Math.min(100, alvo))), 'negocio');
}

/**
 * A disputa com a concorrente de verdade (concorrentes.ts): a reação dela (o marketing e o P&D) é decisão dela, no ano
 * dela; aqui, a guerra de preços contra quem cobra o popular e atrai mais (as duas cobram menos, e quem atrai menos
 * perde clientela), e a concorrente nova que o lucro alto chama (uma empresa a mais no setor, até duas). A força que o
 * conteúdo lê segue a principal no fim do ano das concorrentes.
 */
function disputaComAConcorrente(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, principal: Entidade, lucro: number, vendas: number, garra: number): void {
  const id = emp.id;
  const vantagem = atratividade(emp) - atratividade(principal);
  const sobra = ofertaDe(e, emp.t['setor']) / 100 - 1;
  const recente = (q: string, anos: number): boolean => (emp.q[q]?.ano ?? -99) >= e.ano - anos;
  const guerra = emp.q['guerra'];
  if (guerra) {
    guerraComAPrincipal(e, reg, emp, principal, null, false);
    if (preco(emp) !== 'popular' || e.ano - guerra.ano >= CONCORRENCIA.anosDeGuerra) {
      perder(e, reg, id, 'guerra');
      fimDaGuerra(e, reg, principal);
    }
  } else if (!emp.q['cartel'] && preco(emp) === 'popular' && vantagem > 0 && aleatorio(e.rng) < CONCORRENCIA.chanceDeGuerra * garra) {
    const causa = entradaQueMudou(e, `${id}.preco`);
    ganhar(e, reg, id, 'guerra', causa);
    guerraComAPrincipal(e, reg, emp, principal, causa, true);
    // A guerra de preços magoa o dono da concorrente: ele lembra disso na hora de vender (empresa.ts › adquirir).
    if (id === 'empresa' && e.entidades['rival']) somar(e, reg, 'rival', 'magoa', RIVAL.magoaDaGuerra, 'negocio');
  }
  if (vendas > 0 && lucro / vendas > CONCORRENCIA.margemQueAtrai && !recente('concorrente_novo', 5) && concorrentesNoSetor(e, emp.t['setor']).length < CONCORRENTES_POR_SETOR && aleatorio(e.rng) < CONCORRENCIA.chanceDeEntrar * (1 + 3 * Math.max(0, -sobra))) {
    const causa = entradaQueMudou(e, `${id}.preco`);
    const nova = abrirConcorrente(e, c, reg, emp.t['setor'] ?? '', 65, causa ?? 0);
    if (nova) ganhar(e, reg, id, 'concorrente_novo', causa);
  }
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
  return (emp.n['demanda'] ?? 0) / mercadoDaEmpresa(e, c, emp);
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
  // Só o grupo de quem joga vende a preço de custo para ele mesmo: a concorrente do fornecedor não é fornecedor próprio.
  if (deFora(emp)) return undefined;
  return Object.values(e.entidades).find((x) => x.tipo === 'empresa' && !deFora(x) && x.vivo !== false && x.id !== emp.id && x.t['setor'] === insumo && x.n['capacidade'] !== undefined);
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

