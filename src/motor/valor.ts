/**
 * A dupla do valor (I-179, pedido do dono em 12/11): dois investidores contratados pela holding, que dirigem o grupo
 * inteiro pela filosofia do investimento em valor, acima das diretorias e das CEOs das subsidiárias.
 *
 * Os nomes são fictícios, como todo personagem do jogo (a regra do dono: personagens fictícios e genéricos, pelo risco
 * legal); a filosofia é a de sempre do investimento em valor:
 *
 * - **o capital é da holding**: o caixa das empresas que passa de três meses de custos sobe para ela todo ano, e ela o
 *   põe onde ele mais rende (a empresa que devolve 15% ou mais do que vale e tem fila de pedidos);
 * - **dívida, nenhuma**: a diretoria não pega crédito no banco, e a dupla quita a dívida de quem tem caixa para isso;
 * - **margem de segurança**: a compra da concorrente só sai pelo preço do dia até 85% do justo;
 * - **só cresce o que rende**: a unidade nova pede um retorno de 10% sobre o valor, a filial lá fora, 12%;
 * - **negócio ruim não melhora**: a subsidiária de três anos ou mais que perde mais de 5% do que vale num ano é vendida
 *   inteira (a nova não é julgada: toda empresa começa no prejuízo).
 *
 * Todos se reportam à dupla antes: o que ela veta entra na linha do tempo da diretoria ("a dupla do valor vetou…"),
 * e o ano da dupla é uma entrada do livro, com a contratação de causa. A empresa que quem joga cuida de perto entra no
 * caixa do grupo, mas não é vendida: quem a dirige é você.
 */
import type { Conteudo } from './conteudo.ts';
import { donaDe, empresaDoRegistro, empresasDe, refDaEmpresa } from './campos.ts';
import { aEmpresa } from './empresa.ts';
import { motivoParaNaoOperarGrupo, operarGrupo, type OperacaoGrupo } from './grupo.ts';
import { lancar, novaEntrada, somar } from './livro.ts';
import { motivoParaNaoOperarNegocio, operarNegocio } from './negocio.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** A dupla (fictícia): quem preside o conselho e quem faz as contas. */
export const DUPLA = [
  { nome: 'Augusto Prudente', genero: 'm' as const },
  { nome: 'Benedito Lacerda', genero: 'm' as const },
];
export const NOMES_DA_DUPLA = `${DUPLA[0]!.nome} e ${DUPLA[1]!.nome}`;

/** A qualidade da holding que contratou a dupla (com a contratação de causa). */
export const QUALIDADE_DA_DUPLA = 'dupla_do_valor';

/** Os números do investimento em valor que a dupla segue. */
export const CRIVO = {
  /** O retorno (o lucro do ano sobre o valor) para construir a unidade nova e para abrir a filial lá fora. */
  retornoDaObra: 0.1,
  retornoDaFilial: 0.12,
  /** O preço do dia (fração do justo) até onde a compra da concorrente tem margem de segurança. */
  margemDeSeguranca: 0.85,
  /** O retorno de quem recebe o dinheiro da holding. */
  retornoDoAporte: 0.15,
  /** A perda (sobre o valor) a partir da qual o negócio é vendido, e a idade a partir da qual ele é julgado. */
  perdaQueVende: -0.05,
  idadeParaJulgar: 3,
  /** A reserva de cada empresa: três meses dos custos do ano. */
  reserva: 0.25,
} as const;

/** O honorário da dupla por ano: 0,2% do que vale o grupo dela, com o mínimo de R$ 2 milhões. */
export const HONORARIO = { fracao: 0.002, minimo: 2_000_000 } as const;

/** A holding que contratou a dupla, se houver. */
export function holdingDaDupla(e: EstadoVida): Entidade | undefined {
  return empresasDe(e).find((x) => x.q['holding'] && x.q[QUALIDADE_DA_DUPLA]);
}

/** A empresa está debaixo da holding da dupla (ela, ou a cadeia de controle sobe até ela). */
export function sobADupla(e: EstadoVida, emp: Entidade): boolean {
  const h = holdingDaDupla(e);
  if (!h) return false;
  const ref = refDaEmpresa(h);
  let x: Entidade | undefined = emp;
  for (let i = 0; i < 6 && x; i++) {
    if (x.id === h.id) return true;
    const dona = donaDe(x);
    if (dona === ref) return true;
    x = dona[0] === '#' ? empresaDoRegistro(e, dona) : undefined;
  }
  return false;
}

/** O retorno de uma empresa: o lucro do ano sobre o que ela vale. */
export function retornoDe(emp: Entidade): number {
  return (emp.n['lucro'] ?? 0) / Math.max(1, emp.n['valor'] ?? 0);
}

/** O custo do ano de uma empresa (o que ela vendeu menos o que sobrou). */
function custoDoAno(emp: Entidade): number {
  return Math.max(0, (emp.n['receita'] ?? 0) - (emp.n['lucro'] ?? 0));
}

/** As empresas debaixo da dupla, sem a holding dela. */
function doGrupoDaDupla(e: EstadoVida, h: Entidade): Entidade[] {
  return empresasDe(e).filter((x) => x.id !== h.id && sobADupla(e, x));
}

/** O honorário deste ano. */
export function honorarioDaDupla(e: EstadoVida, h: Entidade): number {
  const valor = doGrupoDaDupla(e, h).reduce((s, x) => s + Math.max(0, x.n['valor'] ?? 0), 0);
  return Math.round(Math.max(HONORARIO.minimo, valor * HONORARIO.fracao));
}

function lista(itens: string[]): string {
  return itens.length > 1 ? `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}` : (itens[0] ?? '');
}

/**
 * O ano da dupla (antes das diretorias, que se reportam a ela): o honorário, o caixa que sobe, a dívida quitada, o
 * negócio ruim vendido e o capital posto onde ele mais rende. Uma entrada do livro, com a contratação de causa.
 */
export function anoDaDupla(e: EstadoVida, c: Conteudo): void {
  const h = holdingDaDupla(e);
  if (!h || h.vivo === false) return;
  const entrada = novaEntrada(e, { tipo: 'dinheiro', causa: 'regra', ref: 'valor:decidiu', texto: '' });
  const reg: Mudanca[] = [];
  const feitos: string[] = [];
  // O honorário sai do caixa da holding (o valor dela é o caixa).
  const honorario = Math.min(honorarioDaDupla(e, h), Math.max(0, h.n['caixa'] ?? 0));
  if (honorario >= 1) {
    somar(e, reg, h.id, 'caixa', -honorario, 'honorario', 'mercado');
    somar(e, reg, h.id, 'valor', -Math.min(honorario, Math.max(0, h.n['valor'] ?? 0)), 'empresa');
  }
  const grupo = doGrupoDaDupla(e, h);
  // A dívida: quem tem caixa para quitar, quita.
  let quitadas = 0;
  for (const x of grupo) {
    const op = { tipo: 'pagar' as const, empresa: x.id };
    if ((x.n['divida'] ?? 0) >= 1 && (x.n['caixa'] ?? 0) >= (x.n['divida'] ?? 0) && motivoParaNaoOperarNegocio(e, c, op) === null) {
      operarNegocio(e, c, op, reg, x.nome);
      quitadas++;
    }
  }
  if (quitadas > 0) feitos.push(quitadas === 1 ? 'quitou a dívida de uma empresa' : `quitou a dívida de ${quitadas} empresas`);
  // O negócio que queima dinheiro: vendido inteiro (um por ano; a empresa de perto é de quem joga).
  // O negócio novo não é julgado: toda empresa começa no prejuízo, e a dupla espera três anos.
  const ruim = grupo.find((x) => x.id !== 'empresa' && !x.q['holding'] && e.ano - (x.nascimento ?? e.ano) >= CRIVO.idadeParaJulgar && (x.n['receita'] ?? 0) > 0 && retornoDe(x) <= CRIVO.perdaQueVende && donaDe(x)[0] === '#');
  if (ruim) {
    const op: OperacaoGrupo = { tipo: 'venderParticipacao', empresa: ruim.id, fracao: 1 };
    if (motivoParaNaoOperarGrupo(e, c, op) === null) {
      const nome = ruim.nome;
      operarGrupo(e, c, op, reg, entrada.id);
      feitos.push(`vendeu ${nome}, que perdia ${Math.round(-retornoDe(ruim) * 100)}% do que valia por ano`);
    }
  }
  // O caixa que sobe: o que passa de três meses de custos, de cada empresa para a controladora dela.
  let subiu = 0;
  for (const x of doGrupoDaDupla(e, h)) {
    const mae = donaDe(x)[0] === '#' ? empresaDoRegistro(e, donaDe(x)) : undefined;
    if (!mae || (x.n['participacao_socia'] ?? 0) > 0) continue;
    const sobra = Math.floor(Math.max(0, x.n['caixa'] ?? 0) - custoDoAno(x) * CRIVO.reserva);
    const op: OperacaoGrupo = { tipo: 'transferirCaixa', de: x.id, para: mae.id, valor: sobra };
    if (sobra >= 10_000 && motivoParaNaoOperarGrupo(e, c, op) === null) {
      operarGrupo(e, c, op, reg, entrada.id);
      subiu += sobra;
    }
  }
  if (subiu >= 1) feitos.push(`trouxe ${formatarDinheiro(subiu)} de sobra das empresas para a holding`);
  // O capital onde ele mais rende: a empresa da holding com o maior retorno, acima de 15%, e fila de pedidos.
  const reservaDaHolding = honorarioDaDupla(e, h) * 2;
  const livre = Math.max(0, (h.n['caixa'] ?? 0) - reservaDaHolding);
  const melhor = doGrupoDaDupla(e, h)
    .filter((x) => donaDe(x) === refDaEmpresa(h) && !x.q['holding'] && retornoDe(x) >= CRIVO.retornoDoAporte && (x.n['demanda'] ?? 0) >= (x.n['capacidade'] ?? Infinity) * 1.05 && !((x.n['participacao_socia'] ?? 0) > 0))
    .sort((a, b) => retornoDe(b) - retornoDe(a))[0];
  if (melhor && livre >= 100_000) {
    const valor = Math.floor(livre * 0.5);
    const op: OperacaoGrupo = { tipo: 'transferirCaixa', de: h.id, para: melhor.id, valor };
    if (motivoParaNaoOperarGrupo(e, c, op) === null) {
      operarGrupo(e, c, op, reg, entrada.id);
      feitos.push(`pôs ${formatarDinheiro(valor)} ${aEmpresa(melhor, 'na')}, que devolve ${Math.round(retornoDe(melhor) * 100)}% do que vale por ano`);
    }
  }
  if (reg.length === 0) return;
  const pagou = honorario >= 1 ? ` O honorário foi de ${formatarDinheiro(honorario)}.` : '';
  entrada.texto = `A dupla do valor, ${NOMES_DA_DUPLA}, que dirige ${aEmpresa(h)}, ${feitos.length > 0 ? lista(feitos) : 'não mexeu em nada: paciência também é decisão'}.${pagou}`;
  entrada.resumo = `viu a dupla do valor dirigir o grupo`;
  const causa = h.q[QUALIDADE_DA_DUPLA]?.causa;
  if (causa !== undefined && causa !== null) entrada.causas = [causa];
  lancar(e, entrada, reg);
}
