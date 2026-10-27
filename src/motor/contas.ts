/**
 * Toda transferência tem dois lados (fatia 1.1 do universo de bolso). Cada mudança de dinheiro no livro diz a
 * contraparte (`Mudanca.p`): uma entidade da vida, uma conta de fora (o mercado, o tesouro, o banco, os parentes)
 * ou a reavaliação (preço que mudou sem dinheiro trocar de mão). Daqui saem:
 *
 * - a conferência das contas, entrada por entrada (o teste e o túnel): o que não tem contraparte é conversão
 *   dentro da mesma pessoa e soma zero; o que vai de uma pessoa para outra aparece nos dois lados;
 * - o extrato: de quem veio e para quem foi o dinheiro de quem joga, num ano ou na vida inteira.
 *
 * As contas de fora ainda não são estado: o saldo delas é o que o livro diz que entrou e saiu.
 */
import { quemE } from './campos.ts';
import { ATIVOS, CONTAS_DE_FORA } from './constantes.ts';
import type { Entrada, EstadoVida } from './tipos.ts';

/** Contraparte que o código esqueceu de dizer (economia.ts › SEM_CONTRAPARTE): a conferência acusa. */
const SEM_CONTRAPARTE = 'desconhecida';
const REAVALIACAO = 'reavaliacao';
const CAMPOS_DE_CAIXA = new Set<string>(['dinheiro', ...ATIVOS, 'divida']);
/** Quem chega a um papel entra com os números dele, quem sai leva os seus e quem troca de papel leva os dele (pessoas.ts › ocuparPapel, moverPessoa): não é dinheiro trocando de mão. */
const TROCA_DE_PAPEL = new Set(['saida', 'nascimento', 'papel']);
const DE_FORA = new Set<string>(CONTAS_DE_FORA);

function separar(c: string): [string, string] {
  const i = c.indexOf('.');
  return [c.slice(0, i), c.slice(i + 1)];
}

/** Valor que uma mudança de caixa soma ao patrimônio financeiro (a dívida conta ao contrário); nada se não é caixa. */
function noPatrimonio(campo: string, d: number): number | null {
  if (!CAMPOS_DE_CAIXA.has(campo)) return null;
  return campo === 'divida' ? -d : d;
}

/**
 * Confere as contas de uma entrada; devolve os problemas (vazio quando fecha):
 * - toda contraparte é conhecida (uma conta de fora, a reavaliação ou uma entidade da vida);
 * - para cada entidade, o que não tem contraparte soma zero (conversão: aplicar, resgatar, pagar dívida);
 * - dinheiro entre duas pessoas aparece nos dois lados, com sinais opostos.
 */
export function conferirContas(e: EstadoVida, h: Entrada): string[] {
  const problemas: string[] = [];
  const interno = new Map<string, number>();
  const pares = new Map<string, number>();
  const naEntrada = new Set<string>();
  let escala = 1;
  for (const m of h.mudancas ?? []) naEntrada.add(separar(m.c)[0]);
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || TROCA_DE_PAPEL.has(m.r ?? '')) continue;
    const [ent, campo] = separar(m.c);
    // Só pessoas têm caixa (a dívida do país é um percentual do PIB; a empresa e o bem têm valor).
    if (e.entidades[ent]?.tipo !== 'pessoa') continue;
    const v = noPatrimonio(campo, m.d);
    if (v === null) continue;
    escala = Math.max(escala, Math.abs(v));
    if (!m.p) {
      interno.set(ent, (interno.get(ent) ?? 0) + v);
      continue;
    }
    if (m.p === SEM_CONTRAPARTE) {
      problemas.push(`${m.c} (${m.r ?? '-'}): sem contraparte`);
      continue;
    }
    if (m.p === REAVALIACAO || DE_FORA.has(m.p)) continue;
    if (!e.entidades[m.p] && !naEntrada.has(m.p)) {
      problemas.push(`${m.c}: contraparte desconhecida "${m.p}"`);
      continue;
    }
    // Entre duas pessoas, o dinheiro sai de uma e entra na outra; empresa e bem guardam o seu lado em valor.
    if (e.entidades[m.p]?.tipo !== 'pessoa' || e.entidades[ent]?.tipo !== 'pessoa') continue;
    pares.set(`${ent}>${m.p}`, (pares.get(`${ent}>${m.p}`) ?? 0) + v);
  }
  // Os centavos de cada mudança são arredondados no livro (livro.ts › fecharMudancas).
  const tolerancia = 0.5 + escala * 1e-9;
  for (const [ent, v] of interno) if (Math.abs(v) > tolerancia) problemas.push(`${ent}: ${v.toFixed(2)} sem contraparte (a conversão não fecha)`);
  for (const [k, v] of pares) {
    const [a, b] = k.split('>') as [string, string];
    const volta = pares.get(`${b}>${a}`) ?? 0;
    if (Math.abs(v + volta) > tolerancia) problemas.push(`${a} → ${b} não fecha: ${v.toFixed(2)} contra ${volta.toFixed(2)}`);
  }
  return problemas;
}

// ---------------------------------------------------------------- dívidas: o que se deve é o que o banco tem a receber

/** A garantia de cada contrato que já existiu na vida (o livro guarda; o contrato pago já não está no estado). */
export function garantiasDosContratos(e: EstadoVida): Map<string, string> {
  const out = new Map<string, string>();
  for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.t !== undefined && /^ctr\w*\.garantia$/.test(m.c)) out.set(m.c.slice(0, m.c.indexOf('.')), m.t);
  for (const en of Object.values(e.entidades)) if (en.tipo === 'contrato' && en.t['garantia']) out.set(en.id, en.t['garantia']);
  return out;
}

/**
 * Confere as dívidas de uma entrada (fatia 1.2): o que mudou no saldo dos contratos sem garantia é o que mudou na
 * dívida de quem joga, e o do financiamento é o que mudou no financiado do bem em garantia. Devolve os problemas.
 */
export function conferirContratos(h: Entrada, garantias: ReadonlyMap<string, string>): string[] {
  const contas = new Map<string, number>();
  const somar = (k: string, d: number): void => void contas.set(k, (contas.get(k) ?? 0) + d);
  let escala = 1;
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || TROCA_DE_PAPEL.has(m.r ?? '')) continue;
    const [ent, campo] = separar(m.c);
    if (ent.startsWith('ctr') && campo === 'saldo') somar(garantias.get(ent) ?? 'eu', m.d);
    else if (ent === 'eu' && campo === 'divida') somar('eu', -m.d);
    else if (ent.startsWith('bem') && campo === 'financiado') somar(ent, -m.d);
    else continue;
    escala = Math.max(escala, Math.abs(m.d));
  }
  const tolerancia = 0.5 + escala * 1e-9;
  const problemas: string[] = [];
  for (const [quem, v] of contas) {
    if (Math.abs(v) > tolerancia) problemas.push(`${quem === 'eu' ? 'a dívida de quem joga' : `o financiado de ${quem}`} e os contratos não batem: ${v.toFixed(2)}`);
  }
  return problemas;
}

/**
 * Confere as dívidas agora: a dívida de quem joga é a soma dos contratos sem garantia, o financiado de cada bem é o
 * saldo do financiamento dele, todo contrato tem credor e todo financiamento tem o bem em garantia.
 */
export function conferirDividas(e: EstadoVida): string[] {
  const problemas: string[] = [];
  let semGarantia = 0;
  const financiado = new Map<string, number>();
  for (const en of Object.values(e.entidades)) {
    if (en.tipo !== 'contrato') continue;
    if (!en.t['credor']) problemas.push(`${en.id}: sem credor`);
    const g = en.t['garantia'];
    if (g) {
      if (e.entidades[g]?.tipo !== 'bem') problemas.push(`${en.id}: a garantia ${g} não existe`);
      financiado.set(g, (financiado.get(g) ?? 0) + (en.n['saldo'] ?? 0));
    } else {
      semGarantia += en.n['saldo'] ?? 0;
    }
  }
  const divida = e.entidades['eu']?.n['divida'] ?? 0;
  if (Math.abs(divida - semGarantia) > 1 + divida * 1e-9) problemas.push(`a dívida de quem joga (${divida.toFixed(2)}) não é a soma dos contratos (${semGarantia.toFixed(2)})`);
  for (const b of Object.values(e.entidades)) {
    if (b.tipo !== 'bem') continue;
    const v = b.n['financiado'] ?? 0;
    if (Math.abs(v - (financiado.get(b.id) ?? 0)) > 1 + v * 1e-9) problemas.push(`${b.id}: financiado ${v.toFixed(2)} contra o contrato ${(financiado.get(b.id) ?? 0).toFixed(2)}`);
  }
  return problemas;
}

/** Uma linha do extrato: o rótulo do fluxo (salário, imposto, juros…), a contraparte e quanto (positivo entrou). */
export interface LinhaDoExtrato {
  rotulo: string;
  contraparte: string;
  valor: number;
}

export interface Extrato {
  linhas: LinhaDoExtrato[];
  /** O que entrou e o que saiu de dinheiro de verdade (sem a reavaliação). */
  entrou: number;
  saiu: number;
  /** O que o preço mudou: a inflação no dinheiro parado e a cotação dos investimentos. */
  reavaliacao: number;
}

/** O nome do fluxo para a folha Dinheiro. */
const NOMES: Record<string, string> = {
  salario: 'Salário',
  aposentadoria: 'Aposentadoria',
  imposto: 'Imposto',
  imposto_mais_baixo: 'Imposto mais baixo',
  auxilio: 'Auxílio',
  bico: 'Bico',
  consumo: 'Custo de vida',
  padrao: 'Padrão de vida',
  velhice: 'Gastos da velhice',
  juros: 'Juros da dívida',
  mora: 'Mora da dívida atrasada',
  multa: 'Multa por atraso',
  emprestimo: 'Dívida nova',
  desconto: 'Desconto do banco',
  caducou: 'Dívida que caducou',
  leilao: 'Leilão',
  rendimento: 'Juro da renda fixa',
  dotacao: 'Dotação da coroa',
  cupom: 'Cupom dos títulos',
  compra_de_titulo: 'Títulos comprados',
  venda_de_titulo: 'Títulos vendidos',
  resgate: 'Títulos que venceram',
  calote: 'Calote do governo',
  inflacao: 'Inflação no dinheiro parado',
  cotacao: 'Cotação dos investimentos',
  aluguel: 'Aluguéis',
  manutencao: 'Manutenção dos bens',
  parcela: 'Parcelas de financiamento',
  venda: 'Venda',
  corretagem: 'Corretagem',
  quitacao: 'Quitação do financiamento',
  empresa: 'Retirada da empresa',
};

/** O nome de uma contraparte para a folha: a conta de fora, ou o nome da entidade. */
export function nomeDaContraparte(e: EstadoVida, p: string): string {
  if (p === 'mercado') return 'o mercado';
  if (p === 'tesouro') return 'o governo';
  if (p === 'banco') return 'o banco';
  if (p === 'parentes') return 'os parentes';
  if (p === REAVALIACAO) return 'os preços';
  return e.entidades[p]?.nome ?? p;
}

const CONTRACOES: Record<string, string> = { o: 'do', a: 'da', os: 'dos', as: 'das', seu: 'do seu', sua: 'da sua', seus: 'dos seus', suas: 'das suas' };

/** A contraparte com a preposição, para a folha: "do mercado", "para o governo", "da sua mãe", "para a Clínica Silva". */
export function comPreposicao(e: EstadoVida, p: string, prep: 'de' | 'para'): string {
  const en = e.entidades[p];
  const nome = en?.tipo === 'empresa' ? `${en.genero === 'm' ? 'o' : 'a'} ${en.nome}` : en?.tipo === 'pessoa' ? quemE(p, en) : nomeDaContraparte(e, p);
  if (prep === 'para') return `para ${nome}`;
  const artigo = /^(os|as|o|a|seus|suas|seu|sua) /.exec(nome);
  return artigo ? `${CONTRACOES[artigo[1]!]} ${nome.slice(artigo[0].length)}` : `de ${nome}`;
}

/** O nome de uma linha do extrato: o do fluxo, ou o tipo da entrada que mexeu no dinheiro. */
function nomeDaLinha(h: Entrada, r: string | undefined): string {
  if (r && NOMES[r]) return NOMES[r]!;
  if (h.tipo === 'evento' || h.tipo === 'npc') return 'Acontecimentos';
  if (h.tipo === 'acao') return 'Ações do ano';
  if (h.tipo === 'dinheiro') {
    const grupo = (h.ref ?? '').split(':')[0] ?? '';
    if (grupo === 'bens') return 'Compras e vendas';
    if (grupo === 'empresa') return 'Empresas';
    if (grupo === 'poder') return 'Campanhas';
    if (grupo === 'jogada') return 'Jogadas';
    return 'Operações';
  }
  return 'Outros';
}

/**
 * O extrato de quem joga: o dinheiro que entrou e saiu, por fluxo e contraparte, num ano (`ano`) ou na vida inteira.
 * Conversões (aplicar, resgatar, pagar dívida com dinheiro) não aparecem: não mudam o patrimônio.
 */
export function extrato(e: EstadoVida, ano?: number): Extrato {
  const somas = new Map<string, LinhaDoExtrato>();
  let entrou = 0;
  let saiu = 0;
  let reavaliacao = 0;
  for (const h of e.historico) {
    if (ano !== undefined && h.ano !== ano) continue;
    for (const m of h.mudancas ?? []) {
      if (m.d === undefined || !m.p || !m.c.startsWith('eu.') || TROCA_DE_PAPEL.has(m.r ?? '')) continue;
      const v = noPatrimonio(m.c.slice(3), m.d);
      if (!v) continue;
      if (m.p === REAVALIACAO) reavaliacao += v;
      else if (v > 0) entrou += v;
      else saiu -= v;
      const rotulo = nomeDaLinha(h, m.r);
      const chave = `${rotulo}|${m.p}`;
      const linha = somas.get(chave) ?? { rotulo, contraparte: m.p, valor: 0 };
      linha.valor += v;
      somas.set(chave, linha);
    }
  }
  const linhas = [...somas.values()].filter((l) => Math.abs(l.valor) >= 1).sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor));
  return { linhas, entrou, saiu, reavaliacao };
}

/** Quanto cada contraparte recebeu (negativo: pagou) de quem joga na vida inteira, sem a reavaliação. */
export function saldosComOMundo(e: EstadoVida): Record<string, number> {
  const out: Record<string, number> = {};
  for (const h of e.historico) {
    for (const m of h.mudancas ?? []) {
      if (m.d === undefined || !m.p || m.p === REAVALIACAO || !m.c.startsWith('eu.') || TROCA_DE_PAPEL.has(m.r ?? '')) continue;
      const v = noPatrimonio(m.c.slice(3), m.d);
      if (v) out[m.p] = (out[m.p] ?? 0) - v;
    }
  }
  return out;
}
