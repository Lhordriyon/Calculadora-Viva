/**
 * A carteira de quem joga: o dinheiro investido fica em cinco classes (renda
 * fixa, ações, fundos imobiliários, dólar, cripto) e cada uma rende conforme
 * a fase do país, com sorte e azar. O perfil de investidor decide para onde
 * vai o dinheiro novo; o jogador escolhe quanto aplicar ou resgatar, e onde,
 * e o padrão de vida (quanto da sobra do ano vira gasto). A folha Dinheiro
 * também abre e toca a empresa (empresa.ts).
 * O mercado do ano é o mesmo para todo o país e fica no país
 * (`pais.ret_acoes`): storylets reagem à bolsa que despencou ou ao dólar que
 * disparou. Toda operação vira uma entrada do livro (tipo "dinheiro", causa "acao"):
 * é decisão do jogador, mas não gasta a ficha do ano.
 */
import { ATIVOS, LIQUIDEZ, PADROES, PERFIL_PADRAO, PERFIS, type Ativo, type Fase, type Padrao, type Perfil } from './constantes.ts';
import { investidoDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { acertarCaixa, anotarCaixa, caixaDe, distribuir, padraoDe, resgatarDe } from './economia.ts';
import { ehOperacaoDeEmpresa, motivoParaNaoOperarEmpresa, operarEmpresa, type OperacaoEmpresa } from './empresa.ts';
import { anotar, definirTexto, lancar, novaEntrada, somar } from './livro.ts';
import { CORTE_DE_PADRAO_FELICIDADE } from './regras.ts';
import { normal } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entrada, EstadoVida, Mudanca } from './tipos.ts';

export type Pesos = Partial<Record<Ativo, number>>;

export function perfilDe(e: EstadoVida): Perfil {
  const p = e.entidades['eu']?.t['perfil'];
  return (PERFIS as readonly string[]).includes(p ?? '') ? (p as Perfil) : PERFIL_PADRAO;
}

/** Como o perfil divide o dinheiro novo entre as classes. */
export function pesosDoPerfil(e: EstadoVida, c: Conteudo): Pesos {
  const perfil = perfilDe(e);
  return c.mundo.perfis.find((p) => p.id === perfil)?.carteira ?? { renda_fixa: 1 };
}

/** O que cada classe rendeu no ano (acima da inflação), sorteado em torno da média da fase; fica anotado no país. */
export function mercadoDoAno(e: EstadoVida, c: Conteudo, fase: Fase, reg: Mudanca[]): Record<Ativo, number> {
  const pais = e.entidades['pais']!.n;
  const r = {} as Record<Ativo, number>;
  for (const a of c.mundo.ativos) {
    const v = Math.max(-0.9, a.retorno[fase] + normal(e.rng, 0, a.desvio));
    r[a.id] = v;
    const pct = Math.round(v * 1000) / 10;
    anotar(reg, `pais.ret_${a.id}`, pct - (pais[`ret_${a.id}`] ?? 0), 'economia');
    pais[`ret_${a.id}`] = pct;
  }
  return r;
}

/** Move uma fração de onde o dinheiro está (conta ou uma classe) para outro lugar. Devolve quanto moveu. */
export function realocar(e: EstadoVida, reg: Mudanca[], de: 'dinheiro' | Ativo, para: 'dinheiro' | Ativo, fracao: number, r?: string): number {
  const n = e.entidades['eu']!.n;
  const antes = caixaDe(n);
  const valor = Math.max(0, n[de] ?? 0) * Math.min(1, Math.max(0, fracao));
  n[de] = (n[de] ?? 0) - valor;
  n[para] = (n[para] ?? 0) + valor;
  acertarCaixa(n);
  anotarCaixa(reg, 'eu', antes, n, r);
  return valor;
}

// ---------------------------------------------------------------- operações do jogador

export type Operacao =
  | OperacaoEmpresa
  /** Da conta para os investimentos: numa classe, ou pelo perfil. */
  | { tipo: 'aplicar'; valor: number; ativo?: Ativo }
  /** Dos investimentos para a conta: de uma classe, ou na ordem de liquidez. */
  | { tipo: 'resgatar'; valor: number; ativo?: Ativo }
  /** Troca o perfil; rebalancear leva a carteira inteira para a divisão do perfil novo. */
  | { tipo: 'perfil'; perfil: Perfil; rebalancear: boolean }
  /** Troca o padrão de vida: quanto da sobra de cada ano vira gasto. */
  | { tipo: 'padrao'; padrao: Padrao };

/** Como cada padrão aparece no texto ("viver com um padrão simples"). */
export const NOMES_PADRAO: Record<Padrao, string> = { simples: 'simples', confortavel: 'confortável', luxo: 'de luxo' };

export function nomeDoAtivo(c: Conteudo, a: Ativo): string {
  return c.mundo.ativos.find((x) => x.id === a)?.nome ?? a;
}

/** "em ações", "na renda fixa": a preposição certa para cada classe. */
const EM: Record<Ativo, string> = { renda_fixa: 'na renda fixa', acoes: 'em ações', fii: 'em fundos imobiliários', dolar: 'em dólar', cripto: 'em cripto' };
const DE: Record<Ativo, string> = { renda_fixa: 'da renda fixa', acoes: 'das ações', fii: 'dos fundos imobiliários', dolar: 'do dólar', cripto: 'da cripto' };

/** Por que a operação não pode acontecer agora (ou null se pode). */
export function motivoParaNaoOperar(e: EstadoVida, c: Conteudo, op: Operacao): string | null {
  if (!e.vivo) return 'esta vida já terminou';
  if (e.pendente) return 'responda o cartão do ano primeiro';
  if (ehOperacaoDeEmpresa(op)) return motivoParaNaoOperarEmpresa(e, c, op);
  if (e.idade < 16) return 'só a partir dos 16 anos';
  const eu = e.entidades['eu']!;
  if (op.tipo === 'aplicar') {
    if (!(op.valor >= 1)) return 'escolha quanto aplicar';
    if (op.valor > Math.max(0, eu.n['dinheiro'] ?? 0) + 0.5) return 'não há tanto dinheiro na conta';
  }
  if (op.tipo === 'resgatar') {
    if (!(op.valor >= 1)) return 'escolha quanto resgatar';
    const tem = op.ativo ? (eu.n[op.ativo] ?? 0) : investidoDe(eu);
    if (op.valor > tem + 0.5) return 'não há tanto investido aí';
  }
  if (op.tipo === 'perfil' && op.perfil === perfilDe(e) && !op.rebalancear) return 'esse já é o seu perfil';
  if (op.tipo === 'padrao') {
    if (e.idade < 18) return 'só a partir dos 18 anos';
    if (op.padrao === padraoDe(e)) return 'esse já é o seu padrão';
  }
  return null;
}

/** Faz a operação e lança a entrada no livro (causa: ação do jogador). */
export function operar(e: EstadoVida, c: Conteudo, op: Operacao): Entrada {
  const motivo = motivoParaNaoOperar(e, c, op);
  if (motivo) throw new Error(`Operação impossível: ${motivo}.`);
  const eu = e.entidades['eu']!;
  const n = eu.n;
  const reg: Mudanca[] = [];
  if (ehOperacaoDeEmpresa(op)) {
    // A entrada nasce antes: a fundação (ou a venda) aponta para ela como causa.
    const entrada = novaEntrada(e, { tipo: 'dinheiro', causa: 'acao', ref: `empresa:${op.tipo}`, texto: '' });
    const { texto, resumo } = operarEmpresa(e, c, op, reg, entrada.id);
    entrada.texto = texto;
    entrada.resumo = resumo;
    return lancar(e, entrada, reg);
  }
  let texto: string;
  let resumo: string;
  if (op.tipo === 'aplicar') {
    const valor = Math.min(op.valor, Math.max(0, n['dinheiro'] ?? 0));
    const antes = caixaDe(n);
    n['dinheiro'] = (n['dinheiro'] ?? 0) - valor;
    distribuir(n, valor, op.ativo ? { [op.ativo]: 1 } : pesosDoPerfil(e, c));
    anotarCaixa(reg, 'eu', antes, n);
    const onde = op.ativo ? EM[op.ativo] : `seguindo o perfil ${perfilDe(e)}`;
    texto = `Aplicou ${formatarDinheiro(valor)} ${onde}.`;
    resumo = `aplicou ${formatarDinheiro(valor)} ${onde}`;
  } else if (op.tipo === 'resgatar') {
    const antes = caixaDe(n);
    const saiu = resgatarDe(n, op.valor, op.ativo ? [op.ativo] : LIQUIDEZ);
    n['dinheiro'] = (n['dinheiro'] ?? 0) + saiu;
    acertarCaixa(n);
    anotarCaixa(reg, 'eu', antes, n);
    const de = op.ativo ? DE[op.ativo] : 'dos investimentos';
    texto = `Resgatou ${formatarDinheiro(saiu)} ${de}.`;
    resumo = `resgatou ${formatarDinheiro(saiu)} ${de}`;
  } else if (op.tipo === 'padrao') {
    const antes = PADROES.indexOf(padraoDe(e));
    definirTexto(e, reg, 'eu', 'padrao', op.padrao);
    // Baixar o padrão dói na hora; subir, a felicidade de base já conta.
    if (PADROES.indexOf(op.padrao) < antes) somar(e, reg, 'eu', 'felicidade', -CORTE_DE_PADRAO_FELICIDADE);
    texto = `Passou a viver com um padrão ${NOMES_PADRAO[op.padrao]}.`;
    resumo = `passou a viver com um padrão ${NOMES_PADRAO[op.padrao]}`;
  } else {
    definirTexto(e, reg, 'eu', 'perfil', op.perfil);
    if (op.rebalancear) {
      const antes = caixaDe(n);
      const total = investidoDe(eu);
      for (const a of ATIVOS) n[a] = 0;
      distribuir(n, total, pesosDoPerfil(e, c));
      anotarCaixa(reg, 'eu', antes, n);
    }
    texto = `Passou a investir como ${op.perfil}${op.rebalancear ? ' e rebalanceou a carteira' : ''}.`;
    resumo = `passou a investir como ${op.perfil}`;
  }
  const entrada = novaEntrada(e, { tipo: 'dinheiro', causa: 'acao', ref: `carteira:${op.tipo}`, texto, resumo });
  return lancar(e, entrada, reg);
}
