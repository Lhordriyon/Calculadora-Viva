/**
 * A dupla do valor (I-179, pedido do dono em 12/11; refeita em I-180 depois do teste dele: "eles não fazem nada com o
 * caixa"): dois investidores contratados pela holding, que dirigem o grupo inteiro pelo investimento em valor, acima
 * das diretorias e das CEOs das subsidiárias, e põem todo o capital para trabalhar.
 *
 * Os nomes são fictícios, como todo personagem do jogo (a regra do dono: personagens fictícios e genéricos, pelo risco
 * legal). O que eles fazem, todo ano, antes das diretorias:
 *
 * - **o capital é da holding**: o caixa das empresas que passa de três meses de custos sobe para ela;
 * - **as CEOs pedem, a dupla decide**: cada diretoria que vê uma oportunidade (a fila de pedidos que pede uma unidade
 *   nova, a concorrente barata, a filial lá fora) pede o dinheiro à dupla, com o retorno esperado; ela aprova o que
 *   paga o custo do capital (10% ao ano; 12% lá fora; a compra só com margem de segurança, até 85% do justo) e manda o
 *   dinheiro, ou nega com o motivo (governanca.ts › crescimentoDaCartaBranca);
 * - **comprar na baixa**: com caixa livre, a dupla põe dinheiro num negócio de um setor em baixa (o preço do setor a
 *   85% do normal ou menos), para colher na volta do ciclo;
 * - **o resto trabalha no mercado**: o caixa livre da holding fica aplicado, em ações compradas na baixa (60% numa
 *   recessão ou crise, 25% no normal) e no Tesouro, e rende o que o mercado do ano rendeu;
 * - **dívida, nenhuma**: a diretoria não pega crédito no banco, e a dupla quita a dívida de quem tem caixa;
 * - **negócio ruim não melhora**: a subsidiária de três anos ou mais que perde mais de 5% do que vale num ano é vendida.
 *
 * O ano da dupla é uma entrada do livro, com a contratação de causa; cada pedido entra na linha do tempo da diretoria
 * que pediu. A empresa que quem joga cuida de perto entra no caixa do grupo, mas não é vendida: quem a dirige é você.
 */
import type { Conteudo } from './conteudo.ts';
import type { Ativo } from './constantes.ts';
import { lugarLivre, setoresDeEmpresa } from './empresa.ts';
import { ofertaDe, precoDoSetor } from './negocio.ts';
import { faseDe } from './pais.ts';
import { aleatorio, criarRng, misturar } from './rng.ts';
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
  /** O preço do setor (fração do normal) a partir do qual a dupla compra um negócio nele: a baixa do ciclo. */
  setorBarato: 0.85,
  /** A perda (sobre o valor) a partir da qual o negócio é vendido, e a idade a partir da qual ele é julgado. */
  perdaQueVende: -0.05,
  idadeParaJulgar: 3,
  /** A reserva de cada empresa: três meses dos custos do ano. */
  reserva: 0.25,
} as const;

/** A carteira da holding: a parte em ações na baixa (recessão ou crise) e no normal; o resto fica no Tesouro. */
export const CARTEIRA = { acoesNaBaixa: 0.6, acoesNoNormal: 0.25 } as const;

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

/** O que a holding guarda antes de pôr dinheiro em qualquer coisa: dois anos de honorário. */
function reservaDaHolding(e: EstadoVida, h: Entidade): number {
  return honorarioDaDupla(e, h) * 2;
}

const pct = (x: number): string => `${Math.round(x * 100)}%`;

/**
 * O pedido de uma diretoria à dupla (governanca.ts): o que quer fazer, quanto custa e o retorno esperado. A dupla
 * aprova o que paga o mínimo dela e manda da holding o que faltar no caixa da empresa (acima da reserva de três meses);
 * nega o que não paga, ou o que a holding não tem como bancar agora. A frase vai para a linha do tempo da diretoria.
 */
export function pedirADupla(e: EstadoVida, c: Conteudo, emp: Entidade, pedido: { oQue: string; custo: number; retorno: number; minimo: number }, reg: Mudanca[], origem: number): { aprovado: boolean; texto: string } {
  const h = holdingDaDupla(e);
  if (!h) return { aprovado: true, texto: '' };
  const quanto = formatarDinheiro(pedido.custo);
  if (pedido.retorno < pedido.minimo) {
    return { aprovado: false, texto: `pediu à dupla do valor ${quanto} para ${pedido.oQue} e ouviu não: ${pct(pedido.retorno)} de retorno esperado não pagam os ${pct(pedido.minimo)} que ela pede` };
  }
  const disponivel = Math.max(0, (emp.n['caixa'] ?? 0) - custoDoAno(emp) * CRIVO.reserva);
  const falta = Math.ceil(Math.max(0, pedido.custo - disponivel));
  if (falta > 0) {
    const livre = Math.max(0, (h.n['caixa'] ?? 0) - reservaDaHolding(e, h));
    const op: OperacaoGrupo = { tipo: 'transferirCaixa', de: h.id, para: emp.id, valor: falta };
    if (falta > livre || motivoParaNaoOperarGrupo(e, c, op) !== null) {
      return { aprovado: false, texto: `pediu à dupla do valor ${quanto} para ${pedido.oQue}; ela gostou (${pct(pedido.retorno)} de retorno esperado), mas a holding não tem como bancar agora` };
    }
    operarGrupo(e, c, op, reg, origem);
  }
  return { aprovado: true, texto: `pediu à dupla do valor ${quanto} para ${pedido.oQue} e levou: ${pct(pedido.retorno)} de retorno esperado, acima dos ${pct(pedido.minimo)} que ela pede${falta > 0 ? `, com ${formatarDinheiro(falta)} da holding` : ''}` };
}

function lista(itens: string[]): string {
  return itens.length > 1 ? `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}` : (itens[0] ?? '');
}

/**
 * O ano da dupla (antes das diretorias, que se reportam a ela): o honorário, o caixa que sobe, a dívida quitada, o
 * negócio ruim vendido e o capital posto onde ele mais rende. Uma entrada do livro, com a contratação de causa.
 */
export function anoDaDupla(e: EstadoVida, c: Conteudo, mercado?: Partial<Record<Ativo, number>>): void {
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
  // Comprar na baixa: um negócio inteiro num setor em que o preço caiu (um a cada três anos, em média, com vaga no grupo).
  const sorteio = criarRng(misturar(e.semente, e.ano, 4421));
  const livreParaNegocio = Math.max(0, (h.n['caixa'] ?? 0) - reservaDaHolding(e, h));
  if (livreParaNegocio >= 10_000_000 && lugarLivre(e) && aleatorio(sorteio) < 0.35) {
    const setores = setoresDeEmpresa(c)
      .map((s) => ({ s, preco: precoDoSetor(ofertaDe(e, s.id)), tem: empresasDe(e).some((x) => x.t['setor'] === s.id && !x.t['pais']) }))
      .filter((x) => x.preco <= CRIVO.setorBarato)
      .sort((a, b) => Number(a.tem) - Number(b.tem) || a.preco - b.preco);
    const alvo = setores[0];
    if (alvo) {
      const valor = Math.round(livreParaNegocio * 0.3);
      const op: OperacaoGrupo = { tipo: 'fundarSubsidiaria', controladora: h.id, setor: alvo.s.id, valor };
      if (motivoParaNaoOperarGrupo(e, c, op) === null) {
        operarGrupo(e, c, op, reg, entrada.id);
        feitos.push(`pôs ${formatarDinheiro(valor)} num negócio de ${alvo.s.nome.toLowerCase()}, com o setor em baixa (o preço a ${pct(alvo.preco)} do normal): quem compra na baixa colhe na volta`);
      }
    }
  }
  // O resto trabalha no mercado: o caixa livre da holding em ações (mais na baixa) e no Tesouro, com o retorno do ano.
  const aplicado = Math.max(0, (h.n['caixa'] ?? 0) - reservaDaHolding(e, h));
  if (mercado && aplicado >= 100_000) {
    const fase = faseDe(e);
    const emAcoes = fase === 'recessao' || fase === 'crise' ? CARTEIRA.acoesNaBaixa : CARTEIRA.acoesNoNormal;
    const retorno = emAcoes * (mercado.acoes ?? 0) + (1 - emAcoes) * (mercado.renda_fixa ?? 0);
    const rendeu = Math.round(aplicado * retorno);
    if (Math.abs(rendeu) >= 1) {
      // A cotação que mudou é o mercado que pagou (ou cobrou) por ela; o valor da holding é o caixa.
      somar(e, reg, h.id, 'caixa', rendeu, 'carteira', 'reavaliacao');
      somar(e, reg, h.id, 'valor', Math.max(-(h.n['valor'] ?? 0), rendeu), 'empresa');
      feitos.push(`deixou ${formatarDinheiro(aplicado)} da holding aplicados (${pct(emAcoes)} em ações${emAcoes === CARTEIRA.acoesNaBaixa ? ' compradas na baixa' : ''}, o resto no Tesouro), que ${rendeu >= 0 ? `renderam ${formatarDinheiro(rendeu)}` : `perderam ${formatarDinheiro(-rendeu)}`} no ano`);
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
