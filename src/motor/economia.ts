/**
 * Dinheiro em reais de hoje. A inflação aparece como o que ela faz com o
 * dinheiro parado (encolhe), o investimento rende juros compostos acima dela
 * e a dívida cresce com juros bem acima dela. O resto (resgatar para cobrir
 * buraco, amortizar com sobra) é automático, porque não é uma decisão.
 * Toda variação vai para o livro-razão, com a contraparte: o salário vem do
 * mercado (ou do tesouro), o imposto vai para o tesouro, o juro da dívida para
 * o banco; a inflação e a cotação são reavaliação (ninguém pagou nada). A
 * dívida é feita de contratos com o banco (contratos.ts): o saque no cheque
 * especial e o pagamento com o que sobra vão para eles também.
 */
import { ATIVOS, LIQUIDEZ, PADRAO_PADRAO, PADROES, type Ativo, type Padrao } from './constantes.ts';
import { acompanharCaixa, creditoNovo, jurosDoAno, limiteDeCredito, rotativos, saldoDe } from './contratos.ts';
import { anotar } from './livro.ts';
import {
  CAPACIDADE_DO_MERCADO,
  GASTO_DA_SOBRA,
  GASTO_DO_PATRIMONIO,
  IDADE_GASTO_VELHICE,
  JUROS_DIVIDA,
  LINHA_DA_POBREZA,
  META_DE_INFLACAO,
  PATRIMONIO_SEM_GASTO,
  PROPENSAO_GASTO_ENDIVIDADO,
  gastoDaVelhice,
  pisoCusto,
  pisoRenda,
} from './regras.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

type Numeros = Record<string, number>;

/** O padrão de vida de quem joga (o confortável, se nunca escolheu). */
export function padraoDe(e: EstadoVida): Padrao {
  const p = e.entidades['eu']?.t['padrao'];
  return (PADROES as readonly string[]).includes(p ?? '') ? (p as Padrao) : PADRAO_PADRAO;
}

/** Quanto da sobra do ano vira gasto: o padrão escolhido, com o cinto apertado de quem deve. */
export function gastoDaSobra(e: EstadoVida): number {
  const gasto = GASTO_DA_SOBRA[padraoDe(e)];
  return (e.entidades['eu']?.n['divida'] ?? 0) > 0 ? Math.min(gasto, PROPENSAO_GASTO_ENDIVIDADO) : gasto;
}

/** Tira até `valor` das classes investidas, na ordem dada (a de liquidez, por padrão). Devolve quanto saiu. */
export function resgatarDe(n: Numeros, valor: number, ordem: readonly Ativo[] = LIQUIDEZ): number {
  let falta = valor;
  for (const a of ordem) {
    if (falta <= 0) break;
    const tem = n[a] ?? 0;
    if (tem <= 0) continue;
    const sai = Math.min(tem, falta);
    n[a] = tem - sai;
    falta -= sai;
  }
  return valor - falta;
}

/** Põe `valor` nas classes, na proporção dos pesos (sem pesos: tudo na renda fixa). */
export function distribuir(n: Numeros, valor: number, pesos: Partial<Record<Ativo, number>> = { renda_fixa: 1 }): void {
  const total = ATIVOS.reduce((s, a) => s + (pesos[a] ?? 0), 0);
  if (total <= 0 || valor <= 0) return;
  for (const a of ATIVOS) {
    const p = pesos[a] ?? 0;
    if (p > 0) n[a] = (n[a] ?? 0) + (valor * p) / total;
  }
}

function somaInvestida(n: Numeros): number {
  let t = 0;
  for (const a of ATIVOS) t += n[a] ?? 0;
  return t;
}

/**
 * Cobre dinheiro negativo com investimento (o mais líquido primeiro) e, se não der, com dívida; sobra amortiza dívida
 * (até `pagavel`: o acordo e o financiamento têm parcela e não entram). Só os números: em quem joga, os contratos
 * acompanham depois (`acertarCaixaDeQuemJoga`).
 */
export function acertarCaixa(n: Numeros, pagavel = Infinity): void {
  if ((n['dinheiro'] ?? 0) < 0) n['dinheiro'] = (n['dinheiro'] ?? 0) + resgatarDe(n, -(n['dinheiro'] ?? 0));
  if ((n['dinheiro'] ?? 0) < 0) {
    n['divida'] = (n['divida'] ?? 0) - n['dinheiro']!;
    n['dinheiro'] = 0;
  }
  if ((n['dinheiro'] ?? 0) > 0 && (n['divida'] ?? 0) > 0 && pagavel > 0) {
    const pago = Math.min(n['dinheiro']!, n['divida']!, pagavel);
    n['dinheiro']! -= pago;
    n['divida']! -= pago;
  }
}

/**
 * Acerta o caixa de quem joga e leva o que a dívida mudou para os contratos: saque no cheque especial ou pagamento do
 * crédito que gira (o cheque especial e os empréstimos).
 */
export function acertarCaixaDeQuemJoga(e: EstadoVida, reg: Mudanca[]): void {
  const n = e.entidades['eu']!.n;
  const dividaAntes = n['divida'] ?? 0;
  acertarCaixa(n, saldoDe(rotativos(e)));
  acompanharCaixa(e, reg, dividaAntes);
}

const CAMPOS_CAIXA = ['dinheiro', ...ATIVOS, 'divida'] as const;
export type CampoDeCaixa = (typeof CAMPOS_CAIXA)[number];

/** Contraparte de quem o código esqueceu de dizer: o teste das contas (contas.ts) acusa. */
export const SEM_CONTRAPARTE = 'desconhecida';

/** Um fluxo de dinheiro com contraparte: o campo do caixa que mudou, quanto, de quem veio ou para quem foi, e o rótulo. */
export interface Fluxo {
  campo: CampoDeCaixa;
  d: number;
  p: string;
  r?: string | undefined;
}

/** O caixa de uma entidade agora (para anotar a diferença depois). */
export function caixaDe(n: Numeros): Numeros {
  const c: Numeros = {};
  for (const k of CAMPOS_CAIXA) c[k] = n[k] ?? 0;
  return c;
}

/** Anota no livro a diferença do caixa de uma entidade entre dois momentos. */
/**
 * Anota a diferença do caixa de uma entidade. Cada fluxo vai para o livro com a contraparte; o que sobra em cada
 * campo é conversão dentro da mesma pessoa (aplicar, resgatar, pagar dívida com dinheiro), sem contraparte, e soma
 * zero quando os fluxos dizem tudo o que entrou e saiu.
 */
export function anotarCaixa(reg: Mudanca[], ent: string, antes: Numeros, n: Numeros, r?: string, fluxos: readonly Fluxo[] = []): void {
  const resto: Numeros = {};
  for (const k of CAMPOS_CAIXA) resto[k] = (n[k] ?? 0) - (antes[k] ?? 0);
  for (const f of fluxos) {
    if (!f.d || !Number.isFinite(f.d)) continue;
    anotar(reg, `${ent}.${f.campo}`, f.d, f.r ?? r, f.p);
    resto[f.campo] = (resto[f.campo] ?? 0) - f.d;
  }
  for (const k of CAMPOS_CAIXA) anotar(reg, `${ent}.${k}`, resto[k] ?? 0, r);
}

/** Quem paga a renda de quem joga: o tesouro paga a aposentadoria, o servidor e o cargo público; o resto vem do mercado. */
function pagadorDaRenda(e: EstadoVida): { p: string; r: string } {
  const eu = e.entidades['eu']!;
  if (eu.q['aposentado']) return { p: 'tesouro', r: 'aposentadoria' };
  if (eu.q['servidor'] || (eu.t['cargo'] ?? '') !== '') return { p: 'tesouro', r: 'salario' };
  return { p: 'mercado', r: 'salario' };
}

export interface Ano {
  /** Quanto a inflação comeu do dinheiro parado. */
  comida: number;
  /** O déficit do ano não coube no crédito: a pessoa cortou o que não podia. */
  privacao: boolean;
  /** Quanto o custo do ano passou da renda (saiu da reserva ou do crédito). */
  deficit: number;
}

/** O que o país faz no bolso neste ano (pais.ts › bolsoDoPais); o que faltar fica no de sempre. */
export interface PaisNoBolso {
  inflacao?: number | undefined;
  jurosDaDivida?: number | undefined;
  /** O que o imposto muda na renda de quem não é pobre (−0,04 = 4% a menos). */
  imposto?: number | undefined;
  /** O que o auxílio soma à renda de quem é pobre (reais por ano). */
  auxilio?: number | undefined;
}

/**
 * Um ano de economia de quem joga. A inflação é a do país; a renda paga o
 * imposto do governo (quem é pobre não paga e recebe o auxílio). Da
 * sobra do ano (renda menos custo), uma parte vira gasto, conforme o padrão
 * de vida (menos, para quem está devendo); quem tem patrimônio também gasta
 * uma parte dele, pelo mesmo padrão. Déficit vira dívida, com os juros do
 * momento, só até o limite de crédito; acima dele, a dívida congela e o resto
 * do déficit vira privação.
 */
export function economiaDoAno(e: EstadoVida, reg: Mudanca[], pais: PaisNoBolso = {}, retornos: Partial<Record<Ativo, number>> = {}): Ano {
  const n = e.entidades['eu']!.n;
  const antes = caixaDe(n);
  // A conta é a de sempre; os fluxos só dizem de quem veio e para quem foi cada parte (o livro).
  const fluxos: Fluxo[] = [];
  const inflacao = pais.inflacao ?? (e.entidades['pais']?.n['inflacao'] ?? META_DE_INFLACAO) / 100;

  const dinheiroAntes = n['dinheiro'] ?? 0;
  n['dinheiro'] = dinheiroAntes / (1 + inflacao);
  const comida = dinheiroAntes - n['dinheiro'];
  fluxos.push({ campo: 'dinheiro', d: -comida, p: 'reavaliacao', r: 'inflacao' });
  // Cada classe investida rende o que o mercado do ano deu a ela (acima da inflação).
  // Acima do que o mercado comporta, o excedente fica parado: rende (ou perde) só a parte que cabe.
  // O juro da renda fixa é pago pelo tesouro (os títulos); o resto é cotação, que ninguém paga.
  const aplicado = ATIVOS.reduce((s, a) => s + Math.max(0, n[a] ?? 0), 0);
  const cabe = aplicado > CAPACIDADE_DO_MERCADO ? CAPACIDADE_DO_MERCADO / aplicado : 1;
  for (const a of ATIVOS) {
    if (!n[a]) continue;
    const antesDaClasse = n[a];
    n[a] = n[a] * (1 + (retornos[a] ?? 0) * cabe);
    fluxos.push(a === 'renda_fixa' ? { campo: a, d: n[a] - antesDaClasse, p: 'tesouro', r: 'rendimento' } : { campo: a, d: n[a] - antesDaClasse, p: 'reavaliacao', r: 'cotacao' });
  }
  const renda = n['renda'] ?? 0;
  // Os juros de cada contrato (contratos.ts): o do momento no cheque especial e nos empréstimos em dia, o do acordo e a
  // mora no que atrasou. O banco recebe.
  const { juros, mora } = jurosDoAno(e, reg, (1 + (pais.jurosDaDivida ?? JUROS_DIVIDA)) / (1 + inflacao) - 1);
  n['divida'] = (n['divida'] ?? 0) + juros + mora;
  fluxos.push({ campo: 'divida', d: juros, p: 'banco', r: 'juros' }, { campo: 'divida', d: mora, p: 'banco', r: 'mora' });

  let privacao = false;
  let deficit = 0;
  if (e.idade >= 18) {
    const custoVida = e.entidades['lugar']?.n['custo_vida'] ?? 1;
    const pobre = renda < LINHA_DA_POBREZA;
    const liquida = pobre ? renda : renda * (1 + (pais.imposto ?? 0));
    const auxilio = pobre ? (pais.auxilio ?? 0) : 0;
    const recebido = Math.max(liquida, pisoRenda(e.idade));
    const consumo = Math.max(n['custo'] ?? 0, pisoCusto(e.idade) * custoVida);
    const sobra = recebido + auxilio - consumo;
    const pagador = pagadorDaRenda(e);
    fluxos.push({ campo: 'dinheiro', d: renda, p: pagador.p, r: pagador.r });
    // A renda já vem sem o imposto de sempre: a política do governo cobra a mais (imposto) ou devolve (imposto mais baixo).
    fluxos.push({ campo: 'dinheiro', d: liquida - renda, p: 'tesouro', r: liquida < renda ? 'imposto' : 'imposto_mais_baixo' });
    fluxos.push({ campo: 'dinheiro', d: recebido - liquida, p: 'mercado', r: 'bico' });
    fluxos.push({ campo: 'dinheiro', d: auxilio, p: 'tesouro', r: 'auxilio' });
    if (sobra >= 0) {
      const gasto = gastoDaSobra(e);
      n['dinheiro'] += sobra * (1 - gasto);
      fluxos.push({ campo: 'dinheiro', d: -consumo, p: 'mercado', r: 'consumo' });
      fluxos.push({ campo: 'dinheiro', d: -(sobra * gasto), p: 'mercado', r: 'padrao' });
    } else {
      deficit = -sobra;
      // O que cobre o buraco: a conta, os investimentos e o crédito que o banco ainda dá (nenhum, com o nome sujo).
      const folga = Math.max(0, n['dinheiro']) + somaInvestida(n) + creditoNovo(e);
      const coberto = Math.min(-sobra, folga);
      n['dinheiro'] -= coberto;
      privacao = coberto < -sobra;
      // Na privação, o que não coube no crédito não foi gasto: o consumo é só o que foi pago.
      fluxos.push({ campo: 'dinheiro', d: -(consumo - (deficit - coberto)), p: 'mercado', r: 'consumo' });
    }
  }
  const patrimonio = (n['dinheiro'] ?? 0) + somaInvestida(n) - (n['divida'] ?? 0);
  if (e.idade >= 18) {
    const gasto = Math.max(0, patrimonio - PATRIMONIO_SEM_GASTO) * GASTO_DO_PATRIMONIO[padraoDe(e)];
    n['dinheiro'] = (n['dinheiro'] ?? 0) - gasto;
    fluxos.push({ campo: 'dinheiro', d: -gasto, p: 'mercado', r: 'padrao' });
  }
  if (e.idade >= IDADE_GASTO_VELHICE) {
    const gasto = gastoDaVelhice(patrimonio);
    n['dinheiro'] = (n['dinheiro'] ?? 0) - gasto;
    fluxos.push({ campo: 'dinheiro', d: -gasto, p: 'mercado', r: 'velhice' });
  }
  acertarCaixaDeQuemJoga(e, reg);
  anotarCaixa(reg, 'eu', antes, n, 'economia', fluxos);
  return { comida, privacao, deficit };
}

export { limiteDeCredito };

export interface Movimento {
  dinheiro?: number | undefined;
  /** Positivo aplica da conta (pelos pesos); negativo resgata (o mais líquido primeiro). */
  investir?: number | undefined;
  /** Para onde vai o que se aplica (o perfil de investidor); sem pesos, renda fixa. */
  pesos?: Partial<Record<Ativo, number>> | undefined;
  /** De quem veio ou para quem foi o `dinheiro` (uma entidade ou uma conta de fora). Sem ela, o teste das contas acusa. */
  contraparte?: string | undefined;
  /** O `dinheiro` repartido por contraparte (a manutenção para o mercado, a parcela para o banco): somam `dinheiro`. */
  fluxos?: readonly Fluxo[] | undefined;
}

/**
 * Aplica movimentos de dinheiro (reais de hoje) numa entidade e anota no livro, com a contraparte. Dívida nova ou
 * perdoada é contrato (dividas.ts › contrairEmprestimo, abaterDivida); aqui ela só muda pelo caixa acertado.
 */
export function movimentar(e: EstadoVida, reg: Mudanca[], mov: Movimento, ent = 'eu', r?: string): void {
  const n = e.entidades[ent]?.n;
  if (!n) return;
  const antes = caixaDe(n);
  const fluxos: Fluxo[] = mov.fluxos ? [...mov.fluxos] : [];
  if (mov.dinheiro) {
    n['dinheiro'] = (n['dinheiro'] ?? 0) + mov.dinheiro;
    if (!mov.fluxos) fluxos.push({ campo: 'dinheiro', d: mov.dinheiro, p: mov.contraparte ?? SEM_CONTRAPARTE });
  }
  if (mov.investir) {
    if (mov.investir > 0) {
      const valor = Math.min(mov.investir, Math.max(n['dinheiro'] ?? 0, 0));
      n['dinheiro'] = (n['dinheiro'] ?? 0) - valor;
      distribuir(n, valor, mov.pesos);
    } else {
      n['dinheiro'] = (n['dinheiro'] ?? 0) + resgatarDe(n, -mov.investir);
    }
  }
  // Só quem joga tem banco (crédito, dívida); personagens ficam com o saldo como está.
  if (ent === 'eu') acertarCaixaDeQuemJoga(e, reg);
  anotarCaixa(reg, ent, antes, n, r, fluxos);
}
