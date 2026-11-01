/**
 * O empréstimo entre pessoas (missão Ω2): a promissória, `prm<entrada>`. Quem emprestou e quem deve são pessoas, pelo
 * número de cada uma (`Entidade.pessoa`; quem joga é "eu"): a dívida segue a pessoa quando ela muda de papel (o amor
 * que vira ex continua devendo, ou cobrando). Tem saldo, parcela do ano, vencimento e anos de atraso, e fica fora do
 * banco: não entra em `eu.divida`, não tem juros e não suja o nome. O que ela cobra é outra moeda:
 *
 * - a parcela sai sozinha, todo ano, de quem deve para quem emprestou, se o dinheiro dá;
 * - quando não dá, atrasa: a primeira vez é notícia, e quem emprestou fica magoado e desconfia;
 * - ANOS_ATE_O_CALOTE anos sem pagar a quem emprestou é calote: a pessoa para de cobrar, e não esquece;
 * - pagar até o fim vira confiança;
 * - quem morre leva a dívida (a que devia e a que tinha a receber), e quem sai da vida também.
 *
 * Toda mudança de saldo anda com o dinheiro entre os dois, na mesma entrada (contas.ts › conferirPromissorias); o
 * perdão, o calote e a morte fecham sem dinheiro, com a mudança marcada.
 */
import { credorDe, devedorDe, numeroDaPessoa, promissoriasDe, quemE } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { idLivre } from './contratos.ts';
import { movimentar } from './economia.ts';
import { acontecer } from './familia.ts';
import { definirTexto, somar } from './livro.ts';
import {
  ANOS_ATE_O_CALOTE,
  CONFIANCA_DA_PARCELA,
  CONFIANCA_DA_QUITACAO,
  CONFIANCA_DO_CALOTE,
  MAGOA_DA_PARCELA,
  MAGOA_DO_CALOTE,
  MAGOA_POR_ANO_DE_ATRASO,
  VINCULO_DA_QUITACAO,
} from './regras.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

export { credorDe, devedorDe, entreVoceE, numeroDaPessoa, papelDaPessoa, promissoriasCom, promissoriasDe, QUEM_JOGA, saldoEntrePessoas, type Entre } from './campos.ts';

/** Como a mudança de saldo sem dinheiro é marcada no livro (a conferência das contas aceita só estas). */
export const FECHAR_SEM_DINHEIRO = ['perdao', 'calote', 'morte', 'saiu'] as const;
type FechoSemDinheiro = (typeof FECHAR_SEM_DINHEIRO)[number];

/** Arredonda para R$ 50, como as transferências. */
const emCinquentas = (v: number): number => Math.round(v / 50) * 50;

/**
 * Abre a promissória da entrada `origem`: quem emprestou, quem deve, o valor (o dinheiro já andou, na mesma entrada) e em
 * quantos anos. Sem as duas pessoas (o papel vago), não abre.
 */
export function abrirPromissoria(e: EstadoVida, reg: Mudanca[], credor: string, devedor: string, valor: number, anos: number, origem: number): Entidade | undefined {
  const k = numeroDaPessoa(e, credor);
  const d = numeroDaPessoa(e, devedor);
  if (!k || !d || k === d || valor < 1) return undefined;
  const id = idLivre(e, `prm${origem}`);
  const ct: Entidade = { id, tipo: 'promissoria', nome: 'Empréstimo', nascimento: e.ano, vivo: true, n: {}, t: {}, q: {} };
  e.entidades[id] = ct;
  definirTexto(e, reg, id, 'credor', k);
  definirTexto(e, reg, id, 'devedor', d);
  definirTexto(e, reg, id, 'origem', String(origem));
  somar(e, reg, id, 'saldo', valor, 'emprestimo');
  somar(e, reg, id, 'parcela', Math.max(50, emCinquentas(valor / anos)));
  somar(e, reg, id, 'vencimento', e.ano + anos);
  return ct;
}

/** O dinheiro anda de quem deve para quem emprestou, e o saldo cai junto, na mesma entrada. Devolve quanto andou. */
export function pagarPromissoria(e: EstadoVida, reg: Mudanca[], ct: Entidade, valor: number, r = 'parcela'): number {
  const de = devedorDe(e, ct);
  const para = credorDe(e, ct);
  if (!de || !para) return 0;
  const v = Math.min(valor, ct.n['saldo'] ?? 0);
  if (v < 0.5) return 0;
  if (de === 'eu') movimentar(e, reg, { dinheiro: -v, contraparte: para }, 'eu', r);
  else somar(e, reg, de, 'dinheiro', -v, r, para);
  if (para === 'eu') movimentar(e, reg, { dinheiro: v, contraparte: de }, 'eu', r);
  else somar(e, reg, para, 'dinheiro', v, r, de);
  somar(e, reg, ct.id, 'saldo', -v, r);
  return v;
}

/** Fecha: o que sobrou some sem dinheiro (o perdão, o calote, a morte, marcados; os centavos da quitação) e sai do estado. */
export function fecharPromissoria(e: EstadoVida, reg: Mudanca[], ct: Entidade, r: FechoSemDinheiro | 'quitada'): void {
  for (const campo of ['saldo', 'parcela', 'vencimento', 'atraso']) {
    const v = ct.n[campo];
    if (v) somar(e, reg, ct.id, campo, -v, r);
  }
  delete e.entidades[ct.id];
}

/** Mais prazo: o vencimento anda, o atraso zera e a parcela se refaz pelos anos que faltam. */
export function prorrogarPromissoria(e: EstadoVida, reg: Mudanca[], ct: Entidade, anos: number): void {
  const antes = ct.n['vencimento'] ?? e.ano;
  const vence = Math.max(e.ano, antes) + anos;
  somar(e, reg, ct.id, 'vencimento', vence - antes);
  if (ct.n['atraso']) somar(e, reg, ct.id, 'atraso', -ct.n['atraso']!);
  const parcela = Math.max(50, emCinquentas((ct.n['saldo'] ?? 0) / Math.max(1, vence - e.ano)));
  somar(e, reg, ct.id, 'parcela', parcela - (ct.n['parcela'] ?? 0));
}

// ---------------------------------------------------------------- a operação: pagar de uma vez

/** Pagar de uma vez o que se deve a alguém (a folha Dinheiro): não gasta a ficha do ano, como o resto da folha. */
export type OperacaoPromissoria = { tipo: 'quitar_promissoria'; id: string };

export function ehOperacaoDePromissoria(op: { tipo: string }): op is OperacaoPromissoria {
  return op.tipo === 'quitar_promissoria';
}

export function motivoParaNaoOperarPromissoria(e: EstadoVida, op: OperacaoPromissoria): string | null {
  const ct = e.entidades[op.id];
  if (!ct || ct.tipo !== 'promissoria') return 'esse empréstimo não existe';
  if (devedorDe(e, ct) !== 'eu') return 'quem deve é a outra pessoa';
  if (Math.max(0, e.entidades['eu']!.n['dinheiro'] ?? 0) + 0.5 < (ct.n['saldo'] ?? 0)) return 'não há tanto dinheiro na conta';
  return null;
}

/** Paga tudo, fecha e devolve a confiança de quem emprestou, como a última parcela. */
export function operarPromissoria(e: EstadoVida, op: OperacaoPromissoria, reg: Mudanca[]): { texto: string; resumo: string; causas: number[] } {
  const ct = e.entidades[op.id]!;
  const credor = credorDe(e, ct)!;
  const en = e.entidades[credor]!;
  const pago = pagarPromissoria(e, reg, ct, ct.n['saldo'] ?? 0, 'quitacao');
  fecharPromissoria(e, reg, ct, 'quitada');
  somar(e, reg, credor, 'confianca', CONFIANCA_DA_QUITACAO);
  somar(e, reg, credor, 'vinculo', VINCULO_DA_QUITACAO);
  const quem = quemE(credor, en);
  return { texto: `Você pagou de uma vez os ${formatarDinheiro(pago)} que devia a ${quem}.`, resumo: `quitou o que devia a ${quem}`, causas: causasDe(ct) };
}

/** A entrada que fez a dívida (o porquê do atraso, da quitação e do calote). */
function causasDe(ct: Entidade): number[] {
  const o = Number(ct.t['origem']);
  return ct.t['origem'] !== undefined && Number.isFinite(o) ? [o] : [];
}

/**
 * O ano das promissórias (a etapa do ano depois das dívidas com o banco): a parcela sai de quem deve, o atraso vira
 * mágoa de quem emprestou (a primeira vez, notícia), três anos sem pagar a quem emprestou é calote, a última parcela
 * vira confiança, e quem morre ou sai da vida leva a dívida.
 */
export function anoDasPromissorias(e: EstadoVida, c: Conteudo, regAno: Mudanca[]): void {
  for (const ct of promissoriasDe(e)) {
    const credor = credorDe(e, ct);
    const devedor = devedorDe(e, ct);
    const outro = credor === 'eu' ? devedor : credor;
    // A pessoa saiu da vida (o colega do emprego que acabou, o ex mais antigo): a dívida sai com ela, calada.
    if (!credor || !devedor || !outro) {
      fecharPromissoria(e, regAno, ct, 'saiu');
      continue;
    }
    const causas = causasDe(ct);
    const saldo = formatarDinheiro(ct.n['saldo'] ?? 0);
    if (e.entidades[outro]!.vivo === false) {
      acontecer(e, c, outro, credor === 'eu' ? 'morreu_devendo' : 'divida_foi_junto', (reg) => fecharPromissoria(e, reg, ct, 'morte'), { saldo }, causas);
      continue;
    }
    // O primeiro ano é o do empréstimo: a parcela começa no seguinte.
    if (e.ano <= (ct.nascimento ?? e.ano)) continue;
    const devido = Math.min(ct.n['saldo'] ?? 0, ct.n['parcela'] ?? 0);
    const caixa = Math.max(0, e.entidades[devedor]!.n['dinheiro'] ?? 0);
    if (caixa + 0.5 >= devido) {
      pagarPromissoria(e, regAno, ct, devido);
      if (ct.n['atraso']) somar(e, regAno, ct.id, 'atraso', -ct.n['atraso']!);
      if ((ct.n['saldo'] ?? 0) >= 0.5) continue;
      if (devedor === 'eu') {
        acontecer(e, c, outro, 'divida_quitada', (reg) => {
          somar(e, reg, outro, 'confianca', CONFIANCA_DA_QUITACAO);
          somar(e, reg, outro, 'vinculo', VINCULO_DA_QUITACAO);
          fecharPromissoria(e, reg, ct, 'quitada');
        }, {}, causas);
      } else acontecer(e, c, outro, 'quitou_com_voce', (reg) => fecharPromissoria(e, reg, ct, 'quitada'), {}, causas);
      continue;
    }
    // Não deu: atrasa.
    somar(e, regAno, ct.id, 'atraso', 1);
    const atraso = ct.n['atraso'] ?? 0;
    const parcela = formatarDinheiro(devido);
    if (devedor !== 'eu') {
      if (atraso === 1) acontecer(e, c, outro, 'devedor_atrasou', () => undefined, { parcela }, causas);
      continue;
    }
    if (atraso >= ANOS_ATE_O_CALOTE) {
      acontecer(e, c, outro, 'calote', (reg) => {
        somar(e, reg, outro, 'magoa', MAGOA_DO_CALOTE);
        somar(e, reg, outro, 'confianca', -CONFIANCA_DO_CALOTE);
        fecharPromissoria(e, reg, ct, 'calote');
      }, { saldo }, causas);
    } else if (atraso === 1) {
      acontecer(e, c, outro, 'parcela_atrasada', (reg) => {
        somar(e, reg, outro, 'magoa', MAGOA_DA_PARCELA);
        somar(e, reg, outro, 'confianca', -CONFIANCA_DA_PARCELA);
      }, { parcela }, causas);
    } else somar(e, regAno, outro, 'magoa', MAGOA_POR_ANO_DE_ATRASO);
  }
}
