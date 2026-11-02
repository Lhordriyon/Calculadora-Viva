/**
 * O dinheiro existe (bloco $, I-133). O dinheiro de quem joga, das pessoas e das empresas não vem do nada nem some: sai
 * de uma conta e entra em outra. As contas do país (constantes.ts › CONTAS) são entidades com saldo: as empresas e as
 * famílias (o mercado), os bancos, o governo (o tesouro), o Banco Central e lá fora. Toda mudança de dinheiro com uma
 * delas de contraparte ganha o lado de lá no mesmo lançamento (livro.ts › lancar), e a soma de todo o dinheiro do mundo
 * é zero: o que as pessoas, as empresas e o governo têm é o que os bancos e o Banco Central devem (contas.ts confere).
 *
 * O dinheiro nasce quando os bancos emprestam e quando o Banco Central emite para o governo (a política da moeda, de
 * quem governa); morre quando o empréstimo volta e quando o Banco Central enxuga. A inflação come o dinheiro de todo
 * mundo e vai para quem o emitiu (o imposto inflacionário). O dinheiro que circula acima ou abaixo do que a economia
 * precisa (uma fração do PIB) é o excesso (`pais.moeda`): no ano seguinte, acende a inflação e aquece o crescimento.
 */
import { CONTAS, type Conta } from './constantes.ts';
import { definirNumero, emDinheiro, somar } from './livro.ts';
import { nivelDe } from './pais.ts';
import { novaEntidade } from './pessoas.ts';
import { JURO_REAL_NEUTRO, JUROS_MEDIOS, META_DE_INFLACAO, MOEDA } from './regras.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

export const NOMES_DAS_CONTAS: Record<Conta, string> = {
  mercado: 'as empresas e as famílias',
  banco: 'os bancos',
  tesouro: 'o governo',
  bc: 'o Banco Central',
  exterior: 'lá fora',
};

/** O PIB de antes do país ter tamanho (um save antigo): o do Brasil, em reais de hoje. */
const PIB_PADRAO = 1.15e13;

/** A soma de todo o dinheiro do mundo (contas.ts › emDinheiro): zero, com as contas do país abertas. */
export function dinheiroDoMundo(e: EstadoVida): number {
  let soma = 0;
  for (const x of Object.values(e.entidades)) for (const [campo, v] of Object.entries(x.n)) soma += emDinheiro(x.tipo, campo, v) ?? 0;
  return soma;
}

/**
 * Abre as contas do país (no nascimento, ou no primeiro ano de um save que não as tinha). O dinheiro que já circula é o
 * que os bancos emprestaram e o Banco Central emitiu; o das pessoas e das empresas da vida sai do que circula. A soma de
 * tudo dá zero.
 */
export function abrirContas(e: EstadoVida, reg?: Mudanca[]): void {
  if (e.entidades['mercado']) return;
  const pib = e.entidades['pais']?.n['pib'] ?? PIB_PADRAO;
  const daVida = dinheiroDoMundo(e);
  const saldos: Record<Conta, number> = {
    mercado: MOEDA.circulante * pib - daVida,
    banco: -(MOEDA.circulante - MOEDA.base) * pib,
    tesouro: MOEDA.governo * pib,
    bc: -(MOEDA.base + MOEDA.governo) * pib,
    exterior: 0,
  };
  for (const id of CONTAS) {
    e.entidades[id] = novaEntidade({ id, tipo: 'conta', nome: NOMES_DAS_CONTAS[id] });
    if (reg) somar(e, reg, id, 'dinheiro', saldos[id], 'nascimento');
    else e.entidades[id]!.n['dinheiro'] = saldos[id];
  }
}

const saldo = (e: EstadoVida, id: Conta): number => e.entidades[id]?.n['dinheiro'] ?? 0;

/**
 * O ano do dinheiro (depois do país: a inflação, o juro, o crescimento e o PIB do ano já valem). Cada passo é dinheiro
 * de uma conta para outra, com a causa no livro:
 * 1. a inflação come o dinheiro das contas e vai para o Banco Central;
 * 2. o caixa do governo volta ao tamanho de sempre (o que sobrou dos impostos vira gasto; o que faltou, título vendido)
 *    e o real que foi para fora volta pelo câmbio;
 * 3. os bancos emprestam (e criam dinheiro) o que a economia pede; com o juro real acima do neutro, emprestam menos;
 * 4. o Banco Central emite para o governo gastar (a impressora) ou enxuga (a moeda contida), pela política da moeda;
 * 5. o que circula, contra o que a economia precisa, vira o excesso (`pais.moeda`) que o país do ano seguinte lê.
 */
export function anoDaMoeda(e: EstadoVida, reg: Mudanca[]): void {
  abrirContas(e, reg);
  const pais = e.entidades['pais']!;
  const n = pais.n;
  const pib = n['pib'] ?? PIB_PADRAO;
  const inflacao = (n['inflacao'] ?? META_DE_INFLACAO) / 100;
  const juroReal = (n['juros'] ?? JUROS_MEDIOS) - (n['inflacao'] ?? META_DE_INFLACAO);
  // O que circulava contra o que a economia precisava (o PIB de antes do crescimento do ano): o excesso de verdade,
  // com tudo o que quem joga pôs ou tirou da economia desde o ano passado.
  const excesso = saldo(e, 'mercado') / ((MOEDA.circulante * pib) / (1 + (n['crescimento'] ?? 0) / 100)) - 1;
  const perda = inflacao / (1 + inflacao);
  for (const id of ['mercado', 'banco', 'tesouro', 'exterior'] as const) {
    const v = saldo(e, id) * perda;
    if (Math.abs(v) >= 1) somar(e, reg, id, 'dinheiro', -v, 'inflacao', 'bc');
  }
  const sobra = saldo(e, 'tesouro') - MOEDA.governo * pib;
  if (Math.abs(sobra) >= 1) somar(e, reg, 'mercado', 'dinheiro', sobra, sobra > 0 ? 'gasto_publico' : 'titulos', 'tesouro');
  const fora = saldo(e, 'exterior');
  if (Math.abs(fora) >= 1) somar(e, reg, 'mercado', 'dinheiro', fora, 'cambio', 'exterior');
  // Os bancos emprestam o que a economia pede: repõem o que a inflação comeu, acompanham o crescimento e desfazem parte
  // do excesso por ano; com o juro real acima do neutro, emprestam menos (ou cobram de volta).
  const circula = saldo(e, 'mercado');
  const alvo = MOEDA.circulante * pib * (1 + (1 - MOEDA.fechamento) * excesso);
  const credito = alvo - circula + (circula * MOEDA.credito * (JURO_REAL_NEUTRO - juroReal)) / 100;
  if (Math.abs(credito) >= 1) somar(e, reg, 'mercado', 'dinheiro', credito, credito > 0 ? 'credito' : 'amortizacao', 'banco');
  const emissao = MOEDA.emissao[nivelDe(e, 'moeda')]! * pib;
  if (emissao > 0) {
    somar(e, reg, 'tesouro', 'dinheiro', emissao, 'emissao', 'bc');
    somar(e, reg, 'mercado', 'dinheiro', emissao, 'gasto_publico', 'tesouro');
    // O governo pagou com dinheiro novo o que pagaria com título: a dívida cresce menos.
    somar(e, reg, 'pais', 'divida', -(emissao / pib) * 100, 'emissao');
  } else if (emissao < 0) somar(e, reg, 'mercado', 'dinheiro', emissao, 'enxugamento', 'bc');
  // Em centésimos, como o livro guarda: a soma das mudanças é o valor, sem sobra de arredondamento.
  definirNumero(e, reg, 'pais', 'moeda', Math.round((saldo(e, 'mercado') / (MOEDA.circulante * pib) - 1) * 10000) / 100, 'moeda');
}

/** O dinheiro do ano no livro (a folha País): o que o Banco Central emitiu (ou enxugou) e o que a inflação levou. */
export function dinheiroDoAno(e: EstadoVida): { emitido: number; inflacao: number } {
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.tipo !== 'regra' || h.ref !== 'ano') continue;
    let emitido = 0;
    let inflacao = 0;
    for (const m of h.mudancas ?? []) {
      if (m.d === undefined) continue;
      if (m.c === 'tesouro.dinheiro' && m.r === 'emissao') emitido += m.d;
      else if (m.c === 'mercado.dinheiro' && m.r === 'enxugamento') emitido += m.d;
      else if (m.r === 'inflacao' && m.d < 0 && (m.p === 'bc' || m.p === 'reavaliacao')) inflacao -= m.d;
    }
    return { emitido, inflacao };
  }
  return { emitido: 0, inflacao: 0 };
}
