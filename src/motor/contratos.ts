/**
 * Os contratos de dívida de quem joga, no nível do caixa (fatia 1.2 do universo de bolso). Toda dívida é um contrato
 * com o banco (`tipo: 'contrato'`): o cheque especial (`ctr0`), o empréstimo que uma escolha fez, o financiamento de
 * um imóvel (com o imóvel em garantia) e o acordo de uma renegociação. `eu.divida` é a soma dos contratos sem
 * garantia, e `bem.financiado`, o saldo do financiamento daquele bem: espelhos que mudam junto com o contrato, na
 * mesma entrada do livro (contas.ts › conferirContratos confere).
 *
 * Aqui fica o que a economia do ano precisa: abrir e fechar contrato, os juros do ano, o limite de crédito e o
 * acompanhamento do caixa (o dinheiro negativo vira saque no cheque especial; o que sobra paga dívida, na ordem de
 * pagar). As regras do atraso, do nome sujo, da renegociação e do caducar estão em dividas.ts; o financiamento e o
 * leilão, em bens.ts.
 */
import { MODALIDADES, type Modalidade } from './constantes.ts';
import { definirTexto, somar } from './livro.ts';
import { ACORDO_REAL, LIMITE_CREDITO_MINIMO, LIMITE_CREDITO_RENDAS, MORA_REAL } from './regras.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** O cheque especial: um por vida, abre no primeiro saque e fecha quando é pago. */
export const CHEQUE_ESPECIAL = 'ctr0';

const NOMES: Record<Modalidade, string> = { credito: 'Cheque especial', emprestimo: 'Empréstimo', financiamento: 'Financiamento', acordo: 'Acordo' };

export function modalidadeDe(ct: Entidade): Modalidade {
  const m = ct.t['modalidade'] ?? '';
  return (MODALIDADES as readonly string[]).includes(m) ? (m as Modalidade) : 'emprestimo';
}

/** A entrada do livro que fez a dívida (null: o cheque especial, ou um save de antes dos contratos). */
export function origemDe(ct: Entidade): number | null {
  const o = Number(ct.t['origem']);
  return ct.t['origem'] !== undefined && Number.isFinite(o) ? o : null;
}

/** Ordem de chegada: pela entrada que fez a dívida; o cheque especial é o crédito de agora (o mais novo). */
function chegada(ct: Entidade): number {
  return ct.id === CHEQUE_ESPECIAL ? Infinity : (origemDe(ct) ?? 0);
}

function porChegada(a: Entidade, b: Entidade): number {
  return chegada(a) - chegada(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** Os contratos de quem joga, do mais antigo para o mais novo. */
export function contratosDe(e: EstadoVida): Entidade[] {
  const saida: Entidade[] = [];
  for (const id in e.entidades) {
    if (!id.startsWith('ctr')) continue;
    const x = e.entidades[id]!;
    if (x.tipo === 'contrato') saida.push(x);
  }
  return saida.sort(porChegada);
}

/** Os que entram em `eu.divida`: tudo menos o financiamento (que fica no bem). */
export function semGarantia(e: EstadoVida): Entidade[] {
  return contratosDe(e).filter((ct) => modalidadeDe(ct) !== 'financiamento');
}

/** O crédito que gira: o cheque especial e os empréstimos (o acordo tem parcela própria e não conta no limite). */
export function rotativos(e: EstadoVida): Entidade[] {
  return contratosDe(e).filter((ct) => {
    const m = modalidadeDe(ct);
    return m === 'credito' || m === 'emprestimo';
  });
}

export function financiamentoDe(e: EstadoVida, bem: string): Entidade | undefined {
  return contratosDe(e).find((ct) => ct.t['garantia'] === bem);
}

export function saldoDe(contratos: readonly Entidade[]): number {
  let total = 0;
  for (const ct of contratos) total += ct.n['saldo'] ?? 0;
  return total;
}

export function emAtraso(ct: Entidade): boolean {
  return (ct.n['atraso'] ?? 0) > 0;
}

/** Até onde o banco aceita que se deva no crédito que gira (reais de hoje): duas rendas por ano, com um mínimo. */
export function limiteDeCredito(renda: number): number {
  return Math.max(LIMITE_CREDITO_MINIMO, renda * LIMITE_CREDITO_RENDAS);
}

/** Quanto o banco ainda empresta agora: nada com o nome sujo; senão, o que falta para o limite. */
export function creditoNovo(e: EstadoVida): number {
  const eu = e.entidades['eu']!;
  if (eu.q['nome_sujo']) return 0;
  return Math.max(0, limiteDeCredito(eu.n['renda'] ?? 0) - saldoDe(rotativos(e)));
}

/** Um id que ninguém usa agora: a base, ou com uma letra no fim (ctr57, ctr57b…). */
export function idLivre(e: EstadoVida, base: string): string {
  if (!e.entidades[base]) return base;
  for (const letra of 'bcdefghijklmnopqrstuvwxyz') if (!e.entidades[`${base}${letra}`]) return `${base}${letra}`;
  return `${base}_${e.proximoId}`;
}

export interface NovoContrato {
  modalidade: Modalidade;
  /** A entrada que fez a dívida (null no cheque especial). */
  origem: number | null;
  /** O bem que garante o financiamento. */
  garantia?: string | undefined;
  /** A parcela do ano (financiamento e acordo). */
  parcela?: number | undefined;
  nome?: string | undefined;
}

/** Abre um contrato zerado; o saldo entra por `mexerNoSaldo` (dívida nova) ou `ajustarSaldo` (o espelho já mudou). */
export function abrirContrato(e: EstadoVida, reg: Mudanca[], novo: NovoContrato): Entidade {
  const id = novo.modalidade === 'credito' ? CHEQUE_ESPECIAL : idLivre(e, `ctr${novo.origem ?? 0}`);
  const ct: Entidade = { id, tipo: 'contrato', nome: novo.nome ?? NOMES[novo.modalidade], nascimento: e.ano, vivo: true, n: {}, t: {}, q: {} };
  e.entidades[id] = ct;
  definirTexto(e, reg, id, 'modalidade', novo.modalidade);
  definirTexto(e, reg, id, 'credor', 'banco');
  if (novo.origem !== null) definirTexto(e, reg, id, 'origem', String(novo.origem));
  if (novo.garantia) definirTexto(e, reg, id, 'garantia', novo.garantia);
  if (novo.parcela) somar(e, reg, id, 'parcela', novo.parcela);
  return ct;
}

/**
 * Muda o saldo do contrato e o espelho de quem deve, na mesma entrada: o financiado do bem em garantia, ou a dívida de
 * quem joga (com a contraparte: o banco empresta, cobra e perdoa). Devolve a mudança de verdade.
 */
export function mexerNoSaldo(e: EstadoVida, reg: Mudanca[], ct: Entidade, d: number, r: string, p = 'banco'): number {
  const real = somar(e, reg, ct.id, 'saldo', d, r);
  const garantia = ct.t['garantia'];
  if (garantia) somar(e, reg, garantia, 'financiado', real, r);
  else somar(e, reg, 'eu', 'divida', real, r, p);
  return real;
}

/** Só o contrato: o espelho já mudou por outro caminho (o caixa acertado, os juros do ano). */
export function ajustarSaldo(e: EstadoVida, reg: Mudanca[], ct: Entidade, d: number, r: string): number {
  return somar(e, reg, ct.id, 'saldo', d, r);
}

/** Fecha o contrato pago (ou perdoado): zera o que sobrou dele no livro e tira da vida. */
export function fecharContrato(e: EstadoVida, reg: Mudanca[], ct: Entidade, r: string): void {
  // Sobra de arredondamento (centavos): o espelho já foi pago junto.
  if (ct.n['saldo']) ajustarSaldo(e, reg, ct, -ct.n['saldo'], r);
  if (ct.n['parcela']) somar(e, reg, ct.id, 'parcela', -ct.n['parcela'], r);
  if (ct.n['atraso']) somar(e, reg, ct.id, 'atraso', -ct.n['atraso'], r);
  delete e.entidades[ct.id];
}

/** Fecha se o saldo acabou. */
export function fecharSePago(e: EstadoVida, reg: Mudanca[], ct: Entidade, r: string): boolean {
  if ((ct.n['saldo'] ?? 0) >= 0.005) return false;
  fecharContrato(e, reg, ct, r);
  return true;
}

/**
 * A ordem de pagar com o dinheiro que sobra: o que está atrasado (o mais antigo no atraso primeiro), depois o cheque
 * especial e os empréstimos, do mais antigo para o mais novo. O acordo e o financiamento têm parcela e ficam de fora
 * (`comAcordos` põe o acordo no fim: o perdão e o abatimento do conteúdo chegam nele).
 */
export function ordemDePagar(e: EstadoVida, comAcordos = false): Entidade[] {
  const contratos = comAcordos ? semGarantia(e) : rotativos(e);
  const atrasados = contratos.filter(emAtraso).sort((a, b) => (b.n['atraso'] ?? 0) - (a.n['atraso'] ?? 0) || porChegada(a, b));
  const emDia = contratos.filter((ct) => !emAtraso(ct));
  const peso = (ct: Entidade): number => (ct.id === CHEQUE_ESPECIAL ? 0 : modalidadeDe(ct) === 'emprestimo' ? 1 : 2);
  emDia.sort((a, b) => peso(a) - peso(b) || porChegada(a, b));
  return [...atrasados, ...emDia];
}

/**
 * Depois que o caixa de quem joga se acertou (economia.ts › acertarCaixa, que só paga o crédito que gira), os
 * contratos acompanham a dívida: o que ela cresceu é saque no cheque especial (que abre no primeiro saque); o que
 * diminuiu é pagamento, na ordem de pagar. A dívida de quem joga já mudou: aqui só os contratos.
 */
export function acompanharCaixa(e: EstadoVida, reg: Mudanca[], dividaAntes: number): void {
  const d = (e.entidades['eu']!.n['divida'] ?? 0) - dividaAntes;
  if (d > 0) {
    const ct = e.entidades[CHEQUE_ESPECIAL] ?? abrirContrato(e, reg, { modalidade: 'credito', origem: null });
    ajustarSaldo(e, reg, ct, d, 'saque');
    return;
  }
  let falta = -d;
  for (const ct of ordemDePagar(e)) {
    if (falta <= 0) break;
    const paga = ajustarSaldo(e, reg, ct, -Math.min(falta, ct.n['saldo'] ?? 0), 'pagamento');
    falta += paga;
    fecharSePago(e, reg, ct, 'pagamento');
  }
}

/**
 * Os juros do ano de cada contrato sem garantia, somados ao saldo dele; o espelho fica com quem chama (economia.ts
 * junta no fluxo do ano, com o banco como contraparte). Em dia, o cheque especial e o empréstimo pagam o juro real do
 * momento; o acordo, o dele; em atraso, a mora. Devolve o juro e a mora do ano.
 */
export function jurosDoAno(e: EstadoVida, reg: Mudanca[], jurosReal: number): { juros: number; mora: number } {
  let juros = 0;
  let mora = 0;
  for (const ct of semGarantia(e)) {
    const saldo = ct.n['saldo'] ?? 0;
    if (saldo <= 0) continue;
    const atrasado = emAtraso(ct);
    const taxa = atrasado ? MORA_REAL : modalidadeDe(ct) === 'acordo' ? ACORDO_REAL : jurosReal;
    const j = ajustarSaldo(e, reg, ct, saldo * taxa, atrasado ? 'mora' : 'juros');
    if (atrasado) mora += j;
    else juros += j;
  }
  return { juros, mora };
}
