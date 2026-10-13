/**
 * As dívidas de quem joga ao longo do ano e nas decisões (fatia 1.2 do universo de bolso), sobre os contratos de
 * contratos.ts. As regras, uma linha cada:
 * - o banco aceita que se deva até o limite de crédito (duas rendas por ano, no mínimo R$ 30 mil) no cheque especial e
 *   nos empréstimos; no fim do ano, quem passou do limite resgata os investimentos para cobrir, e o que ainda passa
 *   atrasa (o cheque especial e as dívidas mais novas primeiro); dívida atrasada só sai do atraso paga, renegociada
 *   ou caduca;
 * - a parcela do acordo (e a do financiamento, em bens.ts) sai da conta, dos investimentos e do crédito que sobrar; o
 *   que não couber atrasa;
 * - dívida atrasada paga multa ao atrasar e mora no lugar do juro, e suja o nome: o banco não empresta mais nem
 *   financia; o dinheiro que sobra paga primeiro o que está atrasado;
 * - financiamento atrasado dois anos vai a leilão (bens.ts);
 * - dívida atrasada há cinco anos caduca: o banco desiste de cobrar;
 * - renegociar troca as dívidas por um acordo com desconto e parcela que cabe: é decisão de quem joga (a operação da
 *   folha Dinheiro ou a escolha de um storylet).
 * O que muda a história (o nome que suja ou limpa, a dívida que caduca) vira entrada própria no livro, com o porquê.
 */
import { investidoDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import {
  CHEQUE_ESPECIAL,
  abrirContrato,
  ajustarSaldo,
  contratosDe,
  creditoNovo,
  emAtraso,
  fecharContrato,
  fecharSePago,
  limiteDeCredito,
  mexerNoSaldo,
  modalidadeDe,
  ordemDePagar,
  origemDe,
  rotativos,
  saldoDe,
  semGarantia,
} from './contratos.ts';
import { movimentar } from './economia.ts';
import { ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { bolsoDoPais } from './pais.ts';
import {
  ACORDO_REAL,
  ANOS_PARA_CADUCAR,
  JUROS_FINANCIAMENTO,
  MORA_REAL,
  MULTA_ATRASO,
  PRAZO_ACORDO,
  descontoDoAcordo,
  parcelaPrice,
} from './regras.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, Entrada, EstadoVida, Mudanca } from './tipos.ts';

// ---------------------------------------------------------------- dívida que nasce e que encolhe

/** A dívida nova que uma escolha fez (a festa parcelada, o carro em sessenta vezes): um empréstimo do banco. */
export function contrairEmprestimo(e: EstadoVida, reg: Mudanca[], valor: number, origem: number | null): Entidade | null {
  if (!(valor > 0)) return null;
  const ct = abrirContrato(e, reg, { modalidade: 'emprestimo', origem });
  mexerNoSaldo(e, reg, ct, valor, 'emprestimo');
  return ct;
}

/** A dívida que diminui sem dinheiro de quem joga (o perdão, o abatimento do conteúdo): na ordem de pagar, o acordo por último. */
export function abaterDivida(e: EstadoVida, reg: Mudanca[], valor: number, r = 'desconto', p = 'banco'): number {
  let falta = valor;
  for (const ct of ordemDePagar(e, true)) {
    if (falta <= 0) break;
    const tira = Math.min(falta, ct.n['saldo'] ?? 0);
    if (tira <= 0) continue;
    mexerNoSaldo(e, reg, ct, -tira, r, p);
    falta -= tira;
    fecharSePago(e, reg, ct, r);
  }
  return valor - falta;
}

/** Multiplica a dívida sem garantia (a venda do carro que abateu 60%, os cortes que pagaram um quarto): o banco recebe a diferença como perdão. */
export function multiplicarDivida(e: EstadoVida, reg: Mudanca[], fator: number): void {
  for (const ct of semGarantia(e)) {
    mexerNoSaldo(e, reg, ct, (ct.n['saldo'] ?? 0) * (fator - 1), 'desconto');
    fecharSePago(e, reg, ct, 'desconto');
  }
}

// ---------------------------------------------------------------- acordo

export interface Acordo {
  /** O que entra no acordo e o que fica de cada um depois do desconto. */
  partes: { ct: Entidade; fica: number }[];
  antes: number;
  depois: number;
  parcela: number;
}

/**
 * O acordo que o banco aceita agora: as dívidas sem garantia viram uma só, com desconto (o dado, ou o que o banco dá
 * pelos anos de atraso de cada uma: nada no que está em dia), juro de acordo e parcelas por PRAZO_ACORDO anos.
 */
export function propostaDeAcordo(e: EstadoVida, desconto?: number): Acordo | null {
  const partes = semGarantia(e)
    .filter((ct) => (ct.n['saldo'] ?? 0) >= 1)
    .map((ct) => ({ ct, fica: (ct.n['saldo'] ?? 0) * (1 - (desconto ?? descontoDoAcordo(ct.n['atraso'] ?? 0))) }));
  if (partes.length === 0) return null;
  const antes = saldoDe(partes.map((x) => x.ct));
  const depois = partes.reduce((s, x) => s + x.fica, 0);
  return { partes, antes, depois, parcela: parcelaPrice(depois, ACORDO_REAL, PRAZO_ACORDO) };
}

/** O nome limpa quando nada mais está atrasado. Devolve true se limpou. */
export function limparNomeSePuder(e: EstadoVida, reg: Mudanca[], r = 'divida'): boolean {
  if (!e.entidades['eu']!.q['nome_sujo'] || contratosDe(e).some(emAtraso)) return false;
  return perder(e, reg, 'eu', 'nome_sujo', r);
}

/** Fecha o acordo: o desconto o banco perdoa, o resto vira um contrato só, com parcela, e o nome limpa se nada mais atrasar. */
export function fecharAcordo(e: EstadoVida, reg: Mudanca[], proposta: Acordo, origem: number | null): Entidade | null {
  const acordo = proposta.depois >= 1 ? abrirContrato(e, reg, { modalidade: 'acordo', origem, parcela: proposta.parcela }) : null;
  for (const { ct, fica } of proposta.partes) {
    const saldo = ct.n['saldo'] ?? 0;
    mexerNoSaldo(e, reg, ct, -(saldo - (acordo ? fica : 0)), 'desconto');
    if (acordo) {
      // O resto passa de um contrato para o outro: a dívida de quem joga não muda.
      const passa = ajustarSaldo(e, reg, ct, -(ct.n['saldo'] ?? 0), 'acordo');
      ajustarSaldo(e, reg, acordo, -passa, 'acordo');
    }
    fecharContrato(e, reg, ct, 'acordo');
  }
  limparNomeSePuder(e, reg, 'acordo');
  return acordo;
}

/** A renegociação do conteúdo (o feirão, a ligação para o banco): o acordo com o desconto dado, ou com o que o banco oferece. */
export function renegociar(e: EstadoVida, reg: Mudanca[], desconto: number | undefined, origem: number | null): Acordo | null {
  const proposta = propostaDeAcordo(e, desconto);
  if (proposta) fecharAcordo(e, reg, proposta, origem);
  return proposta;
}

// ---------------------------------------------------------------- parcela e atraso

/**
 * Paga `valor` de um contrato com o que houver: a conta, os investimentos (o mais fácil de vender primeiro) e o
 * crédito que o banco ainda dá (o cheque especial). Devolve quanto pagou; o resto atrasa.
 */
export function pagarComOQueHouver(e: EstadoVida, reg: Mudanca[], ct: Entidade, valor: number, r: string): number {
  const eu = e.entidades['eu']!;
  const pode = Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu) + (ct.id === CHEQUE_ESPECIAL ? 0 : creditoNovo(e));
  const paga = Math.min(valor, pode);
  if (paga < 0.5) return 0;
  mexerNoSaldo(e, reg, ct, -paga, r);
  movimentar(e, reg, { dinheiro: -paga, contraparte: 'banco' }, 'eu', r);
  return paga;
}

/** O contrato atrasa mais um ano; no primeiro, o banco cobra a multa. */
export function atrasar(e: EstadoVida, reg: Mudanca[], ct: Entidade): void {
  if (!emAtraso(ct)) mexerNoSaldo(e, reg, ct, (ct.n['saldo'] ?? 0) * MULTA_ATRASO, 'multa');
  somar(e, reg, ct.id, 'atraso', 1, 'atraso');
}

/** O contrato voltou a ficar em dia (pagou a parcela, ou a dívida voltou a caber no limite). */
export function porEmDia(e: EstadoVida, reg: Mudanca[], ct: Entidade): void {
  if (ct.n['atraso']) somar(e, reg, ct.id, 'atraso', -ct.n['atraso'], 'em_dia');
}

// ---------------------------------------------------------------- o fim do ano

/** O que se conta de um contrato: "o cheque especial", "a dívida de 2031", "a parcela do apartamento", "o acordo de 2040". */
function deQueSeTrata(e: EstadoVida, c: Conteudo, ct: Entidade): string {
  const m = modalidadeDe(ct);
  if (m === 'credito') return 'o cheque especial';
  if (m === 'acordo') return `o acordo de ${ct.nascimento ?? e.ano}`;
  if (m === 'financiamento') {
    const b = e.entidades[ct.t['garantia'] ?? ''];
    const def = c.mundo.bens.find((x) => x.id === b?.t['item']);
    return def ? `a parcela d${def.feminino ? 'a' : 'o'} ${def.nome}` : 'a parcela do financiamento';
  }
  return `a dívida de ${ct.nascimento ?? e.ano}`;
}

/**
 * O porquê de um atraso: a entrada que fez a dívida; no cheque especial, as que mais sacaram nele (até duas, das que
 * aparecem na linha do tempo).
 */
function causasDe(e: EstadoVida, ct: Entidade): number[] {
  const origem = origemDe(ct);
  if (origem !== null) return [origem];
  const saques: { id: number; valor: number }[] = [];
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.ano < (ct.nascimento ?? e.ano)) break;
    if (h.tipo === 'regra' || h.tipo === 'linha') continue;
    let v = 0;
    for (const m of h.mudancas ?? []) if (m.c === `${ct.id}.saldo` && m.r === 'saque' && m.d !== undefined) v += m.d;
    if (v > 0) saques.push({ id: h.id, valor: v });
  }
  return saques
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 2)
    .map((x) => x.id)
    .sort((a, b) => a - b);
}

/** Uma entrada própria no livro para o que muda a história (o nome que suja ou limpa, a dívida que caduca). */
function contar(e: EstadoVida, ref: string, texto: string, resumo: string, causas: number[], fazer: (reg: Mudanca[], id: number) => void): Entrada {
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref, texto, resumo, ...(causas.length ? { causas } : {}) });
  const reg: Mudanca[] = [];
  fazer(reg, entrada.id);
  return lancar(e, entrada, reg);
}

/** O crédito que gira, na fila do atraso: o que já atrasava, o cheque especial e os mais novos. */
function filaDoAtraso(e: EstadoVida): Entidade[] {
  const chegada = (ct: Entidade): number => (ct.id === CHEQUE_ESPECIAL ? Infinity : (origemDe(ct) ?? 0));
  return rotativos(e).sort((a, b) => (b.n['atraso'] ?? 0) - (a.n['atraso'] ?? 0) || chegada(b) - chegada(a));
}

/**
 * O fim do ano das dívidas, depois da economia e dos bens (que já cobraram a parcela do financiamento):
 * 1. a parcela do acordo: paga, fica em dia; não paga, atrasa;
 * 2. o limite: quem passou dele ou tem dívida atrasada resgata investimentos para cobrir; o atrasado continua
 *    atrasado (só sai pago, renegociado ou caduco) e o que ainda passa do limite atrasa;
 * 3. o que está atrasado há cinco anos caduca;
 * 4. o nome: suja quando alguma dívida atrasa e limpa quando nada mais está atrasado.
 */
export function regraDasDividas(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  if (!eu.q['nome_sujo'] && contratosDe(e).length === 0) return;

  for (const ct of semGarantia(e)) {
    if (modalidadeDe(ct) !== 'acordo' || ct.nascimento === e.ano) continue;
    const devido = Math.min(ct.n['parcela'] ?? 0, ct.n['saldo'] ?? 0);
    const falta = devido - pagarComOQueHouver(e, reg, ct, devido, 'parcela');
    if (fecharSePago(e, reg, ct, 'parcela')) continue;
    if (falta > 0.5) atrasar(e, reg, ct);
    else porEmDia(e, reg, ct);
  }

  // O que passa do limite e o que já atrasava: quem tem investimento resgata para cobrir (a justiça bloquearia de todo jeito).
  const limite = limiteDeCredito(eu.n['renda'] ?? 0);
  const precisa = Math.max(saldoDe(rotativos(e)) - limite, saldoDe(rotativos(e).filter(emAtraso)));
  if (precisa > 0.5 && investidoDe(eu) > 0.5) movimentar(e, reg, { investir: -Math.min(precisa, investidoDe(eu)) }, 'eu', 'cobrir_limite');
  // Dívida atrasada só sai do atraso paga, renegociada ou caduca; o que ainda passa do limite atrasa, o cheque especial e os mais novos primeiro.
  let excesso = saldoDe(rotativos(e)) - limite - saldoDe(rotativos(e).filter(emAtraso));
  for (const ct of filaDoAtraso(e)) {
    if (emAtraso(ct)) atrasar(e, reg, ct);
    else if (excesso > 0.5) {
      excesso -= ct.n['saldo'] ?? 0;
      atrasar(e, reg, ct);
    }
  }

  for (const ct of semGarantia(e)) {
    if ((ct.n['atraso'] ?? 0) < ANOS_PARA_CADUCAR) continue;
    const saldo = ct.n['saldo'] ?? 0;
    const qual = deQueSeTrata(e, c, ct);
    contar(e, 'divida:caducou', `Cinco anos depois, ${qual} caducou: o banco desistiu de cobrar ${formatarDinheiro(saldo)}.`, `viu ${qual} caducar`, causasDe(e, ct), (r) => {
      mexerNoSaldo(e, r, ct, -saldo, 'caducou');
      fecharContrato(e, r, ct, 'caducou');
    });
  }

  const atrasados = contratosDe(e).filter(emAtraso);
  if (atrasados.length > 0 && !eu.q['nome_sujo']) {
    const novos = atrasados.filter((ct) => ct.n['atraso'] === 1);
    const ct = (novos.length > 0 ? novos : atrasados)[0]!;
    const m = modalidadeDe(ct);
    const qual = deQueSeTrata(e, c, ct);
    const porque =
      m === 'financiamento'
        ? `${qual[0]!.toUpperCase()}${qual.slice(1)} não coube na conta e atrasou`
        : m === 'acordo'
          ? `A parcela do acordo não coube na conta: acordo quebrado`
          : `${qual[0]!.toUpperCase()}${qual.slice(1)} passou do limite que o banco aceita`;
    const depois = m === 'financiamento' ? ' Mais um ano assim, e o imóvel vai a leilão.' : '';
    const texto = `${porque}, e o seu nome foi para o cadastro de devedores. Sem crédito novo nem financiamento até pagar, renegociar ou a dívida caducar.${depois}`;
    contar(e, 'divida:nome_sujo', texto, `teve o nome sujo por causa d${qual.slice(0, 1) === 'a' ? 'a' : 'o'}${qual.slice(1)}`, causasDe(e, ct), (r, id) => {
      ganhar(e, r, 'eu', 'nome_sujo', id, 'divida');
      // A carta do banco chega no ano seguinte (o storylet nome_sujo: negociar ou deixar na gaveta).
      e.agenda.push({ evento: 'nome_sujo', ano: e.ano + 1, origem: id });
    });
  } else if (atrasados.length === 0 && eu.q['nome_sujo']) {
    const desde = eu.q['nome_sujo'].causa;
    contar(e, 'divida:nome_limpo', 'Seu nome saiu do cadastro de devedores. O banco voltou a sorrir para você, com juros.', 'limpou o nome', desde !== null ? [desde] : [], (r) => {
      perder(e, r, 'eu', 'nome_sujo', 'divida');
    });
  }
}

// ---------------------------------------------------------------- operações da folha Dinheiro

export type OperacaoDivida =
  /** Troca as dívidas sem garantia por um acordo com o banco (desconto no que está atrasado). */
  | { tipo: 'renegociar' }
  /** Paga uma dívida com a conta e os investimentos (o que der). */
  | { tipo: 'quitar'; id: string };

export function ehOperacaoDeDivida(op: { tipo: string }): op is OperacaoDivida {
  return op.tipo === 'renegociar' || op.tipo === 'quitar';
}

/**
 * O juro real de um contrato neste ano: o do financiamento é fixo; em atraso, a mora; o do acordo, o dele; o do cheque
 * especial e do empréstimo anda com a Selic (o mesmo que a economia do ano cobra).
 */
export function taxaRealDe(e: EstadoVida, c: Conteudo, ct: Entidade): number {
  const m = modalidadeDe(ct);
  if (m === 'financiamento') return JUROS_FINANCIAMENTO;
  if (emAtraso(ct)) return MORA_REAL;
  if (m === 'acordo') return ACORDO_REAL;
  const bolso = bolsoDoPais(e, c);
  return (1 + bolso.jurosDaDivida) / (1 + bolso.inflacao) - 1;
}

/** O que dá para pagar agora: a conta e os investimentos. */
export function naMao(e: EstadoVida): number {
  const eu = e.entidades['eu']!;
  return Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu);
}

export function motivoParaNaoOperarDivida(e: EstadoVida, op: OperacaoDivida): string | null {
  if (op.tipo === 'renegociar') return semGarantia(e).some(emAtraso) ? null : 'o banco só renegocia o que está atrasado';
  const ct = e.entidades[op.id];
  if (!ct || ct.tipo !== 'contrato') return 'essa dívida não existe';
  if (naMao(e) < 1) return 'não há dinheiro na conta nem investido';
  return null;
}

export function operarDivida(e: EstadoVida, c: Conteudo, op: OperacaoDivida, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  const sujo = Boolean(e.entidades['eu']!.q['nome_sujo']);
  if (op.tipo === 'renegociar') {
    const proposta = propostaDeAcordo(e)!;
    fecharAcordo(e, reg, proposta, origem);
    const limpou = sujo && !e.entidades['eu']!.q['nome_sujo'] ? ' e o nome saiu do cadastro de devedores' : '';
    const como = proposta.depois >= 1 ? `${formatarDinheiro(proposta.depois)} em ${PRAZO_ACORDO} parcelas de ${formatarDinheiro(proposta.parcela)} por ano` : 'perdoar o resto';
    return {
      texto: `Renegociou ${formatarDinheiro(proposta.antes)} de dívidas: o banco aceitou ${como}${limpou}.`,
      resumo: 'renegociou as dívidas com o banco',
    };
  }
  const ct = e.entidades[op.id]!;
  const qual = deQueSeTrata(e, c, ct);
  const paga = Math.min(ct.n['saldo'] ?? 0, naMao(e));
  mexerNoSaldo(e, reg, ct, -paga, 'quitacao');
  movimentar(e, reg, { dinheiro: -paga, contraparte: 'banco' }, 'eu', 'quitacao');
  const quitou = fecharSePago(e, reg, ct, 'quitacao');
  const limpou = limparNomeSePuder(e, reg, 'quitacao') ? ' O nome saiu do cadastro de devedores.' : '';
  return quitou
    ? { texto: `Quitou ${qual}: ${formatarDinheiro(paga)} para o banco.${limpou}`, resumo: `quitou ${qual}` }
    : { texto: `Pagou ${formatarDinheiro(paga)} d${qual.startsWith('a ') ? 'a' : 'o'}${qual.slice(1)}; faltam ${formatarDinheiro(ct.n['saldo'] ?? 0)}.`, resumo: `pagou parte d${qual.startsWith('a ') ? 'a' : 'o'}${qual.slice(1)}` };
}

// ---------------------------------------------------------------- save antigo

/** Antes dos contratos, a dívida era um número: vira o cheque especial (o financiamento migra em bens.ts). */
export function migrarDividaSemContrato(e: EstadoVida): void {
  const eu = e.entidades['eu'];
  const divida = eu?.n['divida'] ?? 0;
  if (!eu || divida <= 0 || semGarantia(e).length > 0) return;
  e.entidades[CHEQUE_ESPECIAL] = {
    id: CHEQUE_ESPECIAL,
    tipo: 'contrato',
    nome: 'Cheque especial',
    nascimento: e.ano,
    vivo: true,
    n: { saldo: divida },
    t: { modalidade: 'credito', credor: 'banco' },
    q: {},
  };
}
