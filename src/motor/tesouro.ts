/**
 * O Tesouro (bloco B): quem joga empresta ao governo comprando um título (`tit<entrada>`, tipo `titulo`), com o valor,
 * a taxa travada na compra (acima da inflação, já sem o imposto de renda) e o vencimento. Todo ano o cupom cai na
 * conta, e no vencimento o valor volta; vender antes é pelo preço do dia (o valor descontado pela taxa de hoje para o
 * prazo que falta): o juro que caiu depois da compra dá lucro, o que subiu dá prejuízo. O devedor é o tesouro, a
 * contraparte de todo real que entra e sai daqui.
 *
 * O calote: com a dívida do país acima de 100% do PIB, numa recessão ou numa crise, o governo pode não pagar
 * (pais.ts › anoDoPais sorteia e sente na economia; aqui, quem perde). Quem tem título perde parte do valor, a renda
 * fixa também, a dívida do país encolhe e a notícia aponta quem a levou até ali.
 */
import { titulosDe, valorDosTitulos } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { idLivre } from './contratos.ts';
import { anotarCaixa, caixaDe, movimentar } from './economia.ts';
import { definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { faseDe, governoAtual, juroReal } from './pais.ts';
import { novaEntidade } from './pessoas.ts';
import { CALOTE, COMPRA_MINIMA_DE_TITULO, DIVIDA_DE_EQUILIBRIO, FATIA_MAXIMA_DA_DIVIDA, MAX_TITULOS, PRAZOS_DO_TITULO, TAXA_DO_TITULO } from './regras.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

export type Prazo = (typeof PRAZOS_DO_TITULO)[number];

export type OperacaoTesouro =
  /** Empresta ao governo: o valor sai da conta e volta no vencimento; o cupom cai todo ano. */
  | { tipo: 'comprarTitulo'; valor: number; prazo: Prazo }
  /** Vende antes do vencimento, pelo preço do dia. */
  | { tipo: 'venderTitulo'; id: string };

export function ehOperacaoDeTesouro(op: { tipo: string }): op is OperacaoTesouro {
  return op.tipo === 'comprarTitulo' || op.tipo === 'venderTitulo';
}

// ---------------------------------------------------------------- a taxa e o preço

/** O que o mercado cobra pela dívida do país (pontos): nada até 90% do PIB, e cresce com ela. */
function riscoDaDivida(e: EstadoVida): number {
  const d = e.entidades['pais']?.n['divida'] ?? DIVIDA_DE_EQUILIBRIO;
  return Math.min(TAXA_DO_TITULO.teto, TAXA_DO_TITULO.riscoPorPonto * Math.max(0, d - TAXA_DO_TITULO.acima));
}

/**
 * A taxa de um título de `anos` anos comprado hoje (% ao ano acima da inflação, uma casa): o juro real do ano, o prêmio
 * do prazo e o risco da dívida, menos o imposto de renda do cupom.
 */
export function taxaDoTitulo(e: EstadoVida, anos: number): number {
  const bruta = juroReal(e) + TAXA_DO_TITULO.premioPorAno * anos + riscoDaDivida(e);
  return Math.max(TAXA_DO_TITULO.piso, Math.round(bruta * (1 - TAXA_DO_TITULO.imposto) * 10) / 10);
}

/** Anos até o vencimento (0 no ano em que vence). */
export function anosParaVencer(e: EstadoVida, tit: Entidade): number {
  return Math.max(0, (tit.n['vencimento'] ?? e.ano) - e.ano);
}

/** O cupom de um ano: o valor vezes a taxa travada na compra. */
export function cupomDe(tit: Entidade): number {
  return ((tit.n['valor'] ?? 0) * (tit.n['taxa'] ?? 0)) / 100;
}

/**
 * Quanto o título vale hoje, se vendido: os cupons e o valor que faltam, descontados pela taxa de hoje para o prazo que
 * falta. Com a taxa de hoje igual à da compra, vale o valor; com o juro mais baixo, mais; mais alto, menos.
 */
export function precoDoTitulo(e: EstadoVida, tit: Entidade): number {
  const valor = tit.n['valor'] ?? 0;
  const faltam = anosParaVencer(e, tit);
  if (faltam <= 0 || valor <= 0) return valor;
  const cupom = (tit.n['taxa'] ?? 0) / 100;
  const hoje = taxaDoTitulo(e, faltam) / 100;
  const desconto = Math.pow(1 + hoje, -faltam);
  return valor * ((cupom * (1 - desconto)) / hoje + desconto);
}

/** A dívida do governo em reais de hoje (o PIB vezes a dívida em % do PIB), ou undefined antes do país ter tamanho. */
export function dividaEmReais(e: EstadoVida): number | undefined {
  const n = e.entidades['pais']?.n;
  if (n?.['pib'] === undefined) return undefined;
  return (n['pib'] * (n['divida'] ?? DIVIDA_DE_EQUILIBRIO)) / 100;
}

/** Quanto ainda dá para emprestar ao governo: nunca mais que uma fatia da dívida do país nas mãos de quem joga. */
export function espacoNoTesouro(e: EstadoVida): number {
  const divida = dividaEmReais(e);
  return divida === undefined ? Infinity : Math.max(0, divida * FATIA_MAXIMA_DA_DIVIDA - valorDosTitulos(e));
}

/** O nome do papel, pelo ano em que vence. */
function nomeDoTitulo(vencimento: number): string {
  return `Tesouro IPCA+ ${vencimento}`;
}

// ---------------------------------------------------------------- as operações da folha Dinheiro

export function motivoParaNaoOperarTesouro(e: EstadoVida, op: OperacaoTesouro): string | null {
  if (op.tipo === 'venderTitulo') {
    const tit = e.entidades[op.id];
    if (!tit || tit.tipo !== 'titulo') return 'esse título não é seu';
    // O título herdado na infância fica com a família até os 18: o cupom cai na conta, e vender é decisão de adulto.
    return e.idade < 18 ? 'só a partir dos 18 anos' : null;
  }
  if (e.idade < 18) return 'só a partir dos 18 anos';
  if (!(PRAZOS_DO_TITULO as readonly number[]).includes(op.prazo)) return 'escolha o prazo';
  if (!(op.valor >= COMPRA_MINIMA_DE_TITULO)) return `a compra mínima é de ${formatarDinheiro(COMPRA_MINIMA_DE_TITULO)}`;
  if (op.valor > Math.max(0, e.entidades['eu']!.n['dinheiro'] ?? 0) + 0.5) return 'não há tanto dinheiro na conta';
  if (titulosDe(e).length >= MAX_TITULOS) return `já são ${MAX_TITULOS} títulos: venda um ou espere vencer`;
  if (op.valor > espacoNoTesouro(e) + 0.5) return 'o Tesouro não vende tanto para uma pessoa só';
  return null;
}

/** Compra ou vende (já conferido) e devolve o texto e o resumo da entrada. */
export function operarTesouro(e: EstadoVida, op: OperacaoTesouro, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  if (op.tipo === 'venderTitulo') {
    const tit = e.entidades[op.id]!;
    const valor = tit.n['valor'] ?? 0;
    const preco = precoDoTitulo(e, tit);
    const faltam = anosParaVencer(e, tit);
    movimentar(e, reg, { dinheiro: preco, contraparte: 'tesouro' }, 'eu', 'venda_de_titulo');
    somar(e, reg, tit.id, 'valor', -valor, 'venda_de_titulo');
    delete e.entidades[tit.id];
    const diferenca = preco - valor;
    const como =
      Math.abs(diferenca) < Math.max(1, valor * 0.005)
        ? 'pelo valor do título'
        : diferenca > 0
          ? `${formatarDinheiro(diferenca)} acima do valor do título: o juro caiu desde a compra`
          : `${formatarDinheiro(-diferenca)} abaixo do valor do título: o juro subiu desde a compra`;
    return {
      texto: `Vendeu o ${tit.nome} ${faltam > 0 ? `${faltam === 1 ? 'um ano' : `${faltam} anos`} antes de vencer` : 'no ano do vencimento'}, por ${formatarDinheiro(preco)}, ${como}.`,
      resumo: `vendeu um título do Tesouro${diferenca > valor * 0.005 ? ' com lucro' : diferenca < -valor * 0.005 ? ' com prejuízo' : ''}`,
    };
  }
  const taxa = taxaDoTitulo(e, op.prazo);
  const vencimento = e.ano + op.prazo;
  const id = idLivre(e, `tit${origem}`);
  const eu = e.entidades['eu']!.n;
  const antes = caixaDe(eu);
  const valor = Math.min(op.valor, Math.max(0, eu['dinheiro'] ?? 0));
  eu['dinheiro'] = (eu['dinheiro'] ?? 0) - valor;
  anotarCaixa(reg, 'eu', antes, eu, 'compra_de_titulo', [{ campo: 'dinheiro', d: -valor, p: 'tesouro' }]);
  const tit = novaEntidade({ id, tipo: 'titulo', nome: nomeDoTitulo(vencimento), nascimento: e.ano, vivo: true });
  e.entidades[id] = tit;
  somar(e, reg, id, 'valor', valor, 'compra_de_titulo');
  somar(e, reg, id, 'taxa', taxa);
  somar(e, reg, id, 'vencimento', vencimento);
  definirTexto(e, reg, id, 'origem', String(origem));
  const pct = String(taxa).replace('.', ',');
  return {
    texto: `Emprestou ${formatarDinheiro(valor)} ao governo num ${tit.nome}: IPCA + ${pct}% ao ano, já sem o imposto. O cupom de ${formatarDinheiro(cupomDe(tit))} cai na conta todo ano, e o dinheiro volta em ${vencimento}.`,
    resumo: `emprestou ${formatarDinheiro(valor)} ao governo por ${op.prazo} anos`,
  };
}

/**
 * Vende uma fração de cada título pelo preço do dia (o efeito `venderTitulos` do conteúdo: o medo do calote, a conta que
 * apertou); a fração inteira tira o título da vida. Devolve quanto entrou na conta.
 */
export function venderParteDosTitulos(e: EstadoVida, reg: Mudanca[], fracao: number): number {
  const f = Math.min(1, Math.max(0, fracao));
  let entrou = 0;
  for (const tit of titulosDe(e)) {
    const preco = precoDoTitulo(e, tit) * f;
    somar(e, reg, tit.id, 'valor', -(tit.n['valor'] ?? 0) * f, 'venda_de_titulo');
    entrou += preco;
    if (f >= 0.999) {
      if (tit.n['valor']) somar(e, reg, tit.id, 'valor', -tit.n['valor'], 'venda_de_titulo');
      delete e.entidades[tit.id];
    }
  }
  if (entrou >= 0.5) movimentar(e, reg, { dinheiro: entrou, contraparte: 'tesouro' }, 'eu', 'venda_de_titulo');
  return entrou;
}

// ---------------------------------------------------------------- o ano do Tesouro

/** A entrada que pôs o título na vida (a compra ou a herança). */
function origemDoTitulo(tit: Entidade): number | null {
  const o = Number(tit.t['origem']);
  return tit.t['origem'] !== undefined && Number.isFinite(o) ? o : null;
}

/** O título venceu: o valor volta para a conta, numa entrada visível que aponta a compra (ou a herança). */
function vencer(e: EstadoVida, tit: Entidade): void {
  const valor = tit.n['valor'] ?? 0;
  const origem = origemDoTitulo(tit);
  const compra = origem === null ? undefined : e.historico.find((h) => h.id === origem);
  const deQuando = compra === undefined ? '' : compra.ref === 'tesouro:comprarTitulo' ? ` que você comprou aos ${compra.idade}` : ' que você herdou';
  const entrada = novaEntrada(e, {
    tipo: 'regra',
    causa: 'regra',
    ref: 'tesouro:vencimento',
    texto: `Venceu o ${tit.nome}${deQuando}: ${formatarDinheiro(valor)} voltaram para a conta. O governo pagou o que devia, e ninguém fez festa.`,
    resumo: `recebeu de volta ${formatarDinheiro(valor)} emprestados ao governo`,
    ...(origem !== null ? { causas: [origem] } : {}),
  });
  const reg: Mudanca[] = [];
  movimentar(e, reg, { dinheiro: valor, contraparte: 'tesouro' }, 'eu', 'resgate');
  somar(e, reg, tit.id, 'valor', -valor, 'resgate');
  delete e.entidades[tit.id];
  lancar(e, entrada, reg);
}

/** O ano dos títulos: o cupom de cada um cai na conta (o tesouro paga) e o que venceu volta, com a compra como causa. */
export function regraDoTesouro(e: EstadoVida, reg: Mudanca[]): void {
  const titulos = titulosDe(e);
  if (titulos.length === 0) return;
  let cupons = 0;
  for (const tit of titulos) cupons += cupomDe(tit);
  if (cupons >= 0.5) movimentar(e, reg, { dinheiro: cupons, contraparte: 'tesouro' }, 'eu', 'cupom');
  for (const tit of titulos) if ((tit.n['vencimento'] ?? Infinity) <= e.ano) vencer(e, tit);
}

// ---------------------------------------------------------------- o calote

/** A chance de o governo não pagar neste ano: a dívida acima de 100% do PIB, numa recessão ou numa crise (as do ano passado). */
export function chanceDeCalote(e: EstadoVida): number {
  const fase = faseDe(e);
  if (fase !== 'recessao' && fase !== 'crise') return 0;
  const d = e.entidades['pais']?.n['divida'] ?? DIVIDA_DE_EQUILIBRIO;
  return Math.min(CALOTE.teto, CALOTE.porPonto * Math.max(0, d - CALOTE.acima));
}

/** Pontos a mais na Selic depois de um calote: a confiança volta aos poucos (pais.calote guarda o ano). */
export function premioDoCalote(e: EstadoVida): number {
  const q = e.entidades['pais']?.q['calote'];
  if (!q) return 0;
  return CALOTE.premio * Math.max(0, 1 - (e.ano - q.ano) / CALOTE.anos);
}

/**
 * Quanto uma mudança de política pôs na dívida (pontos do PIB por ano): o gasto que ela abriu menos a arrecadação que
 * ela trouxe. Os níveis das políticas são simétricos (baixo, médio, alto), então o passo vale metade da distância
 * entre os extremos.
 */
function pesoNaDivida(c: Conteudo, politica: string, passos: number): number {
  const def = c.mundo.politicas.find((p) => p.id === politica);
  if (!def) return 0;
  const passo = (k: 'gasto' | 'receita'): number => ((def.efeitos[k]?.[2] ?? 0) - (def.efeitos[k]?.[0] ?? 0)) / 2;
  return passos * (passo('gasto') - passo('receita'));
}

/**
 * Quem levou a dívida até ali, nos últimos doze anos: a decisão mais recente que pôs a dívida para cima (a posse de um
 * governo que gasta mais do que arrecada, a reforma que cortou imposto ou abriu gasto) e o decreto que aqueceu a
 * economia nos últimos quatro.
 */
function causasDoCalote(e: EstadoVida, c: Conteudo): number[] {
  let politica: number | null = null;
  let decreto: number | null = null;
  for (let k = e.historico.length - 1; k >= 0 && (politica === null || decreto === null); k--) {
    const h = e.historico[k]!;
    if (h.ano < e.ano - 12) break;
    // O começo da vida (o país como estava) não é decisão de ninguém.
    if (h.causa === 'nascimento') continue;
    let peso = 0;
    for (const m of h.mudancas ?? []) {
      // As regras do ano não contam: só quem decidiu.
      if (m.r !== undefined || m.d === undefined || m.d === 0) continue;
      if (m.c.startsWith('pais.pol_')) peso += pesoNaDivida(c, m.c.slice('pais.pol_'.length), m.d);
      if (decreto === null && m.c === 'pais.impulso' && m.d > 0 && h.ano >= e.ano - 4) decreto = h.id;
    }
    if (politica === null && peso > 0) politica = h.id;
  }
  return [...new Set([politica, decreto].filter((x): x is number => x !== null))].sort((a, b) => a - b);
}

/**
 * O governo não paga: quem tem título perde uma parte do valor (o cupom encolhe junto), a renda fixa também, e a dívida
 * do país encolhe. É uma entrada visível do mundo, com quem levou a dívida até ali como causa; pais.calote guarda o ano
 * (o juro fica mais alto por alguns anos, e o conteúdo lembra).
 */
export function darCalote(e: EstadoVida, c: Conteudo): void {
  const pais = e.entidades['pais']!;
  const divida = pais.n['divida'] ?? DIVIDA_DE_EQUILIBRIO;
  const fase = faseDe(e);
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: 'tesouro:calote', ator: 'pais', texto: '' });
  const reg: Mudanca[] = [];
  let nosTitulos = 0;
  for (const tit of titulosDe(e)) nosTitulos -= somar(e, reg, tit.id, 'valor', -(tit.n['valor'] ?? 0) * CALOTE.titulos, 'calote');
  const eu = e.entidades['eu']!;
  const naRendaFixa = (eu.n['renda_fixa'] ?? 0) * CALOTE.rendaFixa;
  if (naRendaFixa >= 1) {
    const antes = caixaDe(eu.n);
    eu.n['renda_fixa'] = (eu.n['renda_fixa'] ?? 0) - naRendaFixa;
    anotarCaixa(reg, 'eu', antes, eu.n, 'calote', [{ campo: 'renda_fixa', d: -naRendaFixa, p: 'tesouro' }]);
  }
  somar(e, reg, 'pais', 'divida', -divida * CALOTE.perdao, 'calote');
  perder(e, reg, 'pais', 'calote');
  ganhar(e, reg, 'pais', 'calote', entrada.id);
  const voce = governoAtual(e) === 'voce';
  const perdeu = nosTitulos + (naRendaFixa >= 1 ? naRendaFixa : 0);
  const centavos = Math.round((1 - CALOTE.titulos) * 100);
  const perdas = [nosTitulos >= 1 ? `os seus títulos perderam ${formatarDinheiro(nosTitulos)}` : '', naRendaFixa >= 1 ? `a sua renda fixa, ${formatarDinheiro(naRendaFixa)}` : ''].filter(Boolean);
  entrada.texto =
    `Calote. Com a dívida em ${Math.round(divida)}% do PIB e o país ${fase === 'crise' ? 'em crise' : 'em recessão'}, ` +
    `${voce ? 'você foi à televisão anunciar' : 'o Tesouro anunciou'} que o governo não paga tudo o que deve: quem emprestou a ele recebe ${centavos} centavos por real.` +
    (perdas.length > 0 ? ` Você estava entre os credores: ${perdas.join(' e ')}.` : '');
  entrada.resumo = voce ? 'deu um calote na dívida do país' : perdeu >= 1 ? `perdeu ${formatarDinheiro(perdeu)} no calote do governo` : 'viu o governo dar calote na dívida';
  const causas = causasDoCalote(e, c);
  if (causas.length > 0) entrada.causas = causas;
  lancar(e, entrada, reg);
  // No ano seguinte, a vida de quem joga sente o calote (o storylet do dia seguinte, com ele de causa).
  if (e.idade >= 16) e.agenda.push({ evento: 'depois_do_calote', ano: e.ano + 1, origem: entrada.id });
}
