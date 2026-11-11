/**
 * As demonstrações e as contas nacionais (missão Capitalismo vivo, I-161, testes 10 e 11).
 *
 * - **Individual**: cada pessoa jurídica tem a dela, com os números do último ano fechado (as vendas, os custos, o
 *   imposto, o lucro, os dividendos pagos e recebidos, o caixa, a dívida e o valor).
 * - **Consolidada**: o grupo de quem joga visto como um só (as empresas que ele controla, inteiras), sem o que uma
 *   empresa do grupo vendeu ou pagou a outra: o dividendo que a subsidiária pagou à holding não é lucro do grupo, a
 *   campanha que a empresa comprou da mídia do grupo não é receita do grupo, e a unidade transferida entre duas delas não
 *   é venda. A parte dos sócios de fora (os minoritários) aparece separada.
 * - **Contas nacionais**: o valor adicionado de cada empresa é o que ela vendeu menos o que comprou de outras para
 *   produzir (o insumo, o frete, a campanha); a folha, o juro, o imposto e o lucro saem dele. O PIB do país é o valor
 *   adicionado de todas as empresas modeladas mais o do resto da economia, sem contar duas vezes o que uma vendeu à
 *   outra. O que o grupo pesa no PIB é o valor adicionado dele, não a receita.
 *
 * Tudo sai do estado e do livro (a entrada do ano): nada aqui muda o estado.
 */
import { parteEfetiva } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { deFora, partesDoMercado } from './concorrentes.ts';
import { economiaDo } from './negocio.ts';
import type { Entidade, Entrada, EstadoVida } from './tipos.ts';

/** O que o ano das empresas deixou no livro (a entrada das regras do último ano fechado). */
export function entradaDoAno(e: EstadoVida): Entrada | undefined {
  for (let i = e.historico.length - 1; i >= 0; i--) if (e.historico[i]!.ref === 'ano') return e.historico[i];
  return undefined;
}

/** As empresas do grupo de quem joga (as que ocupam um lugar no grupo), vivas. */
function doGrupo(e: EstadoVida): Entidade[] {
  return Object.values(e.entidades).filter((x) => x.tipo === 'empresa' && x.vivo !== false && !deFora(x));
}

export interface Demonstracao {
  id: string;
  nome: string;
  holding: boolean;
  /** As vendas do ano (na holding, os dividendos que recebeu). */
  receita: number;
  /** O que ela comprou de outras para produzir (o insumo, o frete, a campanha): o consumo intermediário. */
  insumos: number;
  /** O valor adicionado: a receita menos os insumos (a folha, o juro, o imposto e o lucro saem dele). */
  valorAdicionado: number;
  impostos: number;
  lucro: number;
  dividendosPagos: number;
  dividendosRecebidos: number;
  caixa: number;
  divida: number;
  valor: number;
  /** A parte de quem joga nela (direta e pelas outras empresas). */
  parte: number;
}

/** Soma, no livro do ano, o que mexeu no caixa da empresa com a razão `r` (o sinal diz se entrou ou saiu). */
function noCaixa(entrada: Entrada | undefined, id: string, r: string, sinal: 1 | -1, de?: (p: string | undefined) => boolean): number {
  let v = 0;
  for (const m of entrada?.mudancas ?? []) {
    if (m.c !== `${id}.caixa` || m.r !== r || m.d === undefined || Math.sign(m.d) !== sinal) continue;
    if (de && !de(m.p)) continue;
    v += Math.abs(m.d);
  }
  return v;
}

/** A demonstração individual de uma pessoa jurídica, com os números do último ano fechado. */
export function demonstracaoDe(e: EstadoVida, emp: Entidade, entrada = entradaDoAno(e), c?: Conteudo): Demonstracao {
  const id = emp.id;
  const receita = emp.n['receita'] ?? 0;
  // A concorrente anota o resultado do mercado num lançamento só (concorrentes.ts): o insumo dela sai da margem do setor
  // e da verba de marketing (uma estimativa declarada).
  const insumos = deFora(emp)
    ? receita * (1 - economiaDo(c?.setores.get(emp.t['setor'] ?? '')).margem + (emp.n['marketing'] ?? 0))
    : noCaixa(entrada, id, 'insumos', -1) + noCaixa(entrada, id, 'publicidade', -1);
  return {
    id,
    nome: emp.nome,
    holding: Boolean(emp.q['holding']),
    receita,
    insumos,
    // A holding não produz: o dividendo que recebe é a parte dela no valor que as filhas adicionaram, não valor novo.
    valorAdicionado: emp.q['holding'] ? 0 : Math.max(0, receita - insumos),
    impostos: emp.n['impostos'] ?? 0,
    lucro: emp.n['lucro'] ?? 0,
    dividendosPagos: noCaixa(entrada, id, 'dividendos', -1),
    dividendosRecebidos: noCaixa(entrada, id, 'dividendos', 1),
    caixa: emp.n['caixa'] ?? 0,
    divida: emp.n['divida'] ?? 0,
    valor: emp.n['valor'] ?? 0,
    parte: parteEfetiva(e, emp),
  };
}

export interface Consolidada {
  /** As empresas consolidadas (as do grupo), cada uma com a individual. */
  individuais: Demonstracao[];
  /** A soma das individuais, sem eliminar nada. */
  somaDaReceita: number;
  somaDoLucro: number;
  /** O que uma empresa do grupo vendeu ou pagou a outra no ano (a campanha da mídia do grupo, o dividendo que subiu). */
  receitaInterna: number;
  dividendosInternos: number;
  receita: number;
  lucro: number;
  /** A parte do lucro que é dos sócios de fora (os minoritários de cada empresa). */
  lucroDosMinoritarios: number;
  /** A parte do lucro que é de quem joga. */
  lucroDeQuemJoga: number;
  caixa: number;
  divida: number;
  valorAdicionado: number;
  /** O valor do grupo para quem joga: a parte efetiva de cada empresa vezes o valor dela sozinha (sem contar duas vezes). */
  valorParaQuemJoga: number;
}

/**
 * A demonstração consolidada do grupo: as empresas do grupo somadas, inteiras, com o que uma vendeu ou pagou a outra
 * eliminado (a receita da mídia vinda da campanha das irmãs e o custo dessa campanha; o dividendo que a filha pagou à
 * controladora e que a controladora contou como receita). O lucro se divide entre quem joga e os minoritários.
 */
export function consolidada(e: EstadoVida, entrada = entradaDoAno(e)): Consolidada {
  const grupo = doGrupo(e);
  const ids = new Set(grupo.map((x) => x.id));
  const interno = (p: string | undefined): boolean => p !== undefined && ids.has(p);
  const individuais = grupo.map((x) => demonstracaoDe(e, x, entrada));
  let receitaInterna = 0;
  let dividendosInternos = 0;
  for (const x of grupo) {
    receitaInterna += noCaixa(entrada, x.id, 'publicidade', 1, interno);
    dividendosInternos += noCaixa(entrada, x.id, 'dividendos', 1, interno);
  }
  const somaDaReceita = individuais.reduce((s, d) => s + d.receita, 0);
  const somaDoLucro = individuais.reduce((s, d) => s + d.lucro, 0);
  // A receita da holding é o dividendo que ela recebeu das filhas: dentro do grupo, ele some (o lucro já está nas filhas).
  const receita = somaDaReceita - receitaInterna - dividendosInternos;
  // A campanha interna é receita de uma e custo de outra (o lucro não muda); o dividendo interno é lucro contado duas vezes.
  const lucro = somaDoLucro - dividendosInternos;
  let lucroDeQuemJoga = 0;
  for (const d of individuais) if (!d.holding) lucroDeQuemJoga += d.lucro * d.parte;
  // A holding paga a estrutura dela: é custo do grupo, e todo dela é de quem joga na parte dele.
  for (const d of individuais) if (d.holding) lucroDeQuemJoga += (d.lucro - d.dividendosRecebidos) * d.parte;
  return {
    individuais,
    somaDaReceita,
    somaDoLucro,
    receitaInterna,
    dividendosInternos,
    receita,
    lucro,
    lucroDosMinoritarios: lucro - lucroDeQuemJoga,
    lucroDeQuemJoga,
    caixa: individuais.reduce((s, d) => s + d.caixa, 0),
    divida: individuais.reduce((s, d) => s + d.divida, 0),
    valorAdicionado: individuais.reduce((s, d) => s + d.valorAdicionado, 0),
    valorParaQuemJoga: individuais.reduce((s, d) => s + Math.max(0, d.valor) * d.parte, 0),
  };
}

export interface ContasNacionais {
  pib: number;
  /** O valor adicionado das empresas modeladas (as do grupo e as concorrentes) e o do resto da economia. */
  dasModeladas: number;
  doGrupo: number;
  doResto: number;
  /** O que o grupo pesa: o valor adicionado, a receita e o valor de mercado, cada um como % do PIB (medidas diferentes). */
  pesoNoPib: number;
  receitaSobrePib: number;
  valorSobrePib: number;
}

/** As contas nacionais do último ano fechado: o PIB pelo valor adicionado, sem contar duas vezes o que uma empresa vendeu à outra. */
export function contasNacionais(e: EstadoVida, c?: Conteudo): ContasNacionais {
  const entrada = entradaDoAno(e);
  const pib = Math.max(1, e.entidades['pais']?.n['pib'] ?? 1);
  let dasModeladas = 0;
  let doGrupo = 0;
  let receita = 0;
  let valor = 0;
  for (const x of Object.values(e.entidades)) {
    if (x.tipo !== 'empresa' || x.vivo === false || x.n['capacidade'] === undefined) continue;
    const d = demonstracaoDe(e, x, entrada, c);
    dasModeladas += d.valorAdicionado;
    if (!deFora(x)) {
      doGrupo += d.valorAdicionado * (d.parte > 0 ? 1 : 0);
      receita += d.receita;
      valor += Math.max(0, d.valor) * d.parte;
    }
  }
  return {
    pib,
    dasModeladas,
    doGrupo,
    doResto: Math.max(0, pib - dasModeladas),
    pesoNoPib: (100 * doGrupo) / pib,
    receitaSobrePib: (100 * receita) / pib,
    valorSobrePib: (100 * valor) / pib,
  };
}

/**
 * A concentração do mercado do setor (o índice HHI, de 0 a 10.000): a soma dos quadrados das partes de cada empresa, em
 * pontos percentuais. O resto do mercado (os importados e os pequenos) entra como muitos pequenos: não soma.
 */
export function hhiDoSetor(e: EstadoVida, c: Conteudo, setor: string, mudar?: { de: string; para: string }): number {
  const partes = partesDoMercado(e, c, setor).filter((p) => p.id !== null);
  const porDono = new Map<string, number>();
  for (const p of partes) {
    const chave = p.doGrupo ? 'grupo' : mudar && p.id === mudar.de ? mudar.para : p.id!;
    porDono.set(chave, (porDono.get(chave) ?? 0) + p.parte * 100);
  }
  let hhi = 0;
  for (const v of porDono.values()) hhi += v * v;
  return hhi;
}

/** O que o Cade decide sobre a compra (I-164): livre (nem precisa notificar), aprovada, aprovada com condição ou barrada. */
export type DecisaoDoCade = 'livre' | 'aprovada' | 'condicao' | 'barrada';

export interface AnaliseDoCade {
  antes: number;
  depois: number;
  decisao: DecisaoDoCade;
}

/**
 * A análise do Cade para o grupo comprar a empresa `alvo` do setor: o HHI de antes e o de depois (a comprada passa a
 * somar com o grupo). Abaixo de 1.500 depois, ou com o aumento abaixo de 100, a compra é livre; a partir de 2.500 depois
 * com aumento de 200, aprovada com a condição de vender uma unidade da comprada; a partir de 5.000 (quase um
 * monopólio), barrada. Dominar o mercado não é infração: a régua é a concentração que a compra cria.
 */
export function analiseDoCade(e: EstadoVida, c: Conteudo, setor: string, alvo: string): AnaliseDoCade {
  const antes = hhiDoSetor(e, c, setor);
  const depois = hhiDoSetor(e, c, setor, { de: alvo, para: 'grupo' });
  const aumento = depois - antes;
  const decisao: DecisaoDoCade = depois < 1500 || aumento < 100 ? 'livre' : depois >= 5000 && aumento >= 200 ? 'barrada' : depois >= 2500 && aumento >= 200 ? 'condicao' : 'aprovada';
  return { antes, depois, decisao };
}
