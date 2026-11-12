/**
 * A governança (missão Capitalismo vivo, I-163): quem decide o dia a dia de cada empresa do grupo.
 *
 * - **A autonomia**: manual (quem joga decide tudo, como sempre foi), consultiva (o conselho sugere a jogada do ano na
 *   folha e não faz nada sozinho), delegada (o conselho toca o dia a dia: o preço, o salário, as verbas, crescer até um
 *   quarto, cortar, a geração nova do produto e a retirada) ou autônoma (também o crédito no banco e a exportação).
 * - **O mandato**: o jeito que quem joga deu ao conselho, conservador ou arrojado. O conselho decide pela mesma heurística
 *   do gestor e dos robôs (diretoria.ts › jogadasDoNegocio), no jeito do mandato, só dentro do que a autonomia deixa.
 * - Cada ano em que o conselho decide alguma coisa vira uma entrada no livro ("o conselho decidiu…"), com a decisão de
 *   quem joga que deu a autonomia de causa: o porquê aponta quem delegou.
 *
 * Os executivos com nome (o presidente do conselho, o diretor financeiro, o de operações, o de marketing, o de
 * tecnologia) não existem como pessoas: só o gestor da empresa de perto (diretoria.ts) tem rosto. Limite declarado.
 */
import type { Conteudo } from './conteudo.ts';
import { deFora } from './concorrentes.ts';
import { jogadasDoNegocio } from './diretoria.ts';
import { definirNumero, definirTexto, lancar, novaEntrada } from './livro.ts';
import { ehOperacaoDeNegocio, entradaQueMudou, motivoParaNaoOperarNegocio, operarNegocio, type OperacaoNegocio } from './negocio.ts';
import { aleatorio, criarRng, misturar, sortear } from './rng.ts';
import { donaDe, empresaDoRegistro, refDaEmpresa } from './campos.ts';
import type { Parceiro } from './constantes.ts';
import { analiseDoCade } from './demonstracoes.ts';
import { aEmpresa, alvoDaAquisicao, custoDaAquisicao, motivoParaNaoOperarEmpresa, operarEmpresa, precoDaAquisicao, type OperacaoEmpresa } from './empresa.ts';
import { oPais } from './mundo-das-empresas.ts';
import { custoDaObra } from './negocio.ts';
import { fatorDaCidade, formaQueProduz, motivoParaNaoOperarUnidade, operarUnidade, unidadesDe, type OperacaoUnidade } from './unidades.ts';
import { motivoParaNaoOperarGrupo, operarGrupo, type OperacaoGrupo } from './grupo.ts';
import { formatarDinheiro } from './texto.ts';
import { anoDaDupla, CRIVO, retornoDe, sobADupla } from './valor.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

export const AUTONOMIAS = ['manual', 'consultiva', 'delegada', 'autonoma', 'carta_branca'] as const;
export type Autonomia = (typeof AUTONOMIAS)[number];
export const MANDATOS = ['conservador', 'arrojado'] as const;
export type Mandato = (typeof MANDATOS)[number];

export const NOME_DA_AUTONOMIA: Record<Autonomia, string> = {
  manual: 'você decide tudo',
  consultiva: 'o conselho sugere',
  delegada: 'o conselho toca o dia a dia',
  autonoma: 'o conselho decide o negócio',
  carta_branca: 'carta branca para a diretoria',
};

/** O que cada autonomia deixa a diretoria fazer, em palavras (a folha Quem decide). */
export const O_QUE_DECIDE: Record<Autonomia, string> = {
  manual: 'Você decide tudo; a diretoria só assina.',
  consultiva: 'A diretoria sugere a jogada do ano aqui, e não faz nada sem você.',
  delegada: 'A diretoria toca o dia a dia: o preço, o salário, o marketing, a pesquisa, crescer até um quarto, cortar, pagar a dívida, a geração nova do produto e quanto do lucro sobe.',
  autonoma: 'Tudo do dia a dia, e também o crédito no banco e a exportação.',
  carta_branca: 'Tudo, com o caixa da empresa: o negócio inteiro; constrói fábricas, lojas e escritórios quando há fila de pedidos; abre filial lá fora quando a empresa passa de R$ 100 milhões; compra a concorrente quando ela está barata; pede dinheiro à controladora quando o caixa não paga três meses de custos e manda para cima o que passa de um ano.',
};
export const O_QUE_O_MANDATO_FAZ: Record<Mandato, string> = {
  conservador: 'Conservador: protege o caixa, cresce devagar, corta cedo e paga a dívida.',
  arrojado: 'Arrojado: aposta no crescimento, pega crédito e gasta em marca e pesquisa.',
};

/**
 * A CEO ou o CEO de uma empresa do grupo (I-176): o nome sai do sorteio da vida e do número da empresa, sem campo no
 * save; é quem assina o que a diretoria decide. A empresa que quem joga cuida de perto não tem: lá, quem dirige é você
 * (e o gestor, que tem rosto).
 */
export function ceoDe(e: EstadoVida, c: Conteudo, emp: Entidade): { nome: string; genero: 'f' | 'm' } | undefined {
  if (emp.id === 'empresa' || emp.q['holding']) return undefined;
  const rng = criarRng(misturar(e.semente, emp.registro ?? 0, 4409));
  const genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
  const familia = e.sobrenome.split(' ').at(-1) ?? '';
  const sobrenomes = c.mundo.sobrenomes.filter((x) => x !== familia);
  return { nome: `${sortear(rng, c.mundo.nomes[genero])} ${sortear(rng, sobrenomes)}`, genero };
}

/** "a CEO Ana Prado" ou "o conselho": quem assina as decisões da empresa. */
function quemAssina(e: EstadoVida, c: Conteudo, emp: Entidade): string {
  const ceo = ceoDe(e, c, emp);
  const de = `${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome}`;
  return ceo ? `${ceo.genero === 'f' ? 'A CEO' : 'O CEO'} ${ceo.nome}, ${de},` : `O conselho ${de},`;
}

/** A reserva que a diretoria com carta branca guarda: de três meses a um ano dos custos do ano. */
const RESERVA_MINIMA = 0.25;
const RESERVA_MAXIMA = 1;

/** A cidade mais barata para uma unidade nova da empresa (as do país dela, para a filial lá fora). */
function cidadeMaisBarata(e: EstadoVida, c: Conteudo, emp: Entidade): string | undefined {
  const sede = unidadesDe(e, emp)[0]?.t['cidade'] ?? '';
  const pais = emp.t['pais'];
  const cidades = pais ? (c.mundo.estrangeiros.find((x) => x.id === pais)?.cidades ?? []) : c.mundo.cidades.map((x) => x.nome);
  let melhor: { nome: string; f: number } | undefined;
  for (const nome of cidades) {
    const f = fatorDaCidade(c, nome, sede || nome);
    if (!melhor || f < melhor.f) melhor = { nome, f };
  }
  return melhor?.nome;
}

/** O valor a partir do qual a diretoria com carta branca abre uma filial lá fora. */
const VALOR_DA_FILIAL = 100_000_000;
/** As chances do ano das decisões grandes da carta branca (a filial e a compra), para não virem todo ano. */
const CHANCE_DA_FILIAL = 0.12;
const CHANCE_DA_COMPRA = 0.4;

/**
 * O crescimento da carta branca (I-178), sempre com o caixa da empresa, nunca com o dinheiro de quem joga: a unidade
 * nova (a fábrica, a loja, o escritório) na cidade mais barata quando há fila de pedidos; a filial lá fora no país de
 * melhor relação quando a empresa passa de R$ 100 milhões; e a compra do controle da concorrente quando ela está
 * barata e o Cade não barra.
 */
function crescimentoDaCartaBranca(e: EstadoVida, c: Conteudo, emp: Entidade, reg: Mudanca[], jaExpandiu: boolean, origem: number, crivo = false): string[] {
  const resumos: string[] = [];
  const rng = criarRng(misturar(e.semente, e.ano, 3313, emp.registro ?? 0));
  const caixa = (): number => Math.max(0, emp.n['caixa'] ?? 0);
  // A unidade nova, quando a procura passa da capacidade e não há obra em andamento.
  const capacidade = emp.n['capacidade'] ?? 0;
  const fila = capacidade > 0 ? (emp.n['demanda'] ?? 0) / capacidade : 0;
  if (!jaExpandiu && fila >= 1.1 && (emp.n['obra'] ?? 0) <= 0) {
    const cidade = cidadeMaisBarata(e, c, emp);
    // O tamanho da obra pela fila: meia estrutura a mais com a fila grande, um quarto com a pequena, um décimo se o caixa só der isso.
    const fracao = [fila >= 1.5 ? 0.5 : 0.25, 0.25, 0.1].find((f) => custoDaObra(c, emp, f, e) <= caixa() * 0.5);
    const op: OperacaoUnidade | undefined = cidade && fracao ? { tipo: 'construirUnidade', empresa: emp.id, forma: formaQueProduz(c, emp), cidade, fracao } : undefined;
    if (op && motivoParaNaoOperarUnidade(e, c, op) === null && crivo && retornoDe(emp) < CRIVO.retornoDaObra) {
      resumos.push(`a dupla do valor vetou a obra: a empresa devolve ${Math.round(retornoDe(emp) * 100)}% do que vale, e ela pede ${Math.round(CRIVO.retornoDaObra * 100)}%`);
    } else if (op && motivoParaNaoOperarUnidade(e, c, op) === null) {
      operarUnidade(e, c, op, reg, origem);
      const nome = c.setores.get(emp.t['setor'] ?? '')?.unidade?.nome ?? 'unidade';
      resumos.push(`construiu ${c.setores.get(emp.t['setor'] ?? '')?.unidade?.f ? 'uma' : 'um'} ${nome} em ${cidade}`);
    }
  }
  // A filial lá fora: uma por empresa, no país de melhor relação, sem sanção.
  const temFilial = Object.values(e.entidades).some((x) => x.tipo === 'empresa' && x.vivo !== false && x.t['pais'] && donaDe(x) === refDaEmpresa(emp));
  if (!emp.t['pais'] && !temFilial && (emp.n['valor'] ?? 0) >= VALOR_DA_FILIAL && aleatorio(rng) < CHANCE_DA_FILIAL) {
    const paises = c.mundo.estrangeiros.map((x) => ({ id: x.id, en: e.entidades[x.id] })).filter((x) => x.en && !x.en.q['sancao'] && (x.en.n['relacao'] ?? 0) >= 30);
    paises.sort((a, b) => (b.en!.n['relacao'] ?? 0) - (a.en!.n['relacao'] ?? 0));
    const pais = paises[0]?.id as Parceiro | undefined;
    const op: OperacaoGrupo | undefined = pais ? { tipo: 'fundarSubsidiaria', controladora: emp.id, setor: emp.t['setor'] ?? '', valor: Math.round(caixa() * 0.2), pais } : undefined;
    if (op && motivoParaNaoOperarGrupo(e, c, op) === null && crivo && retornoDe(emp) < CRIVO.retornoDaFilial) {
      resumos.push(`a dupla do valor vetou a filial ${oPais(c, pais!, 'na')}: a empresa devolve ${Math.round(retornoDe(emp) * 100)}% do que vale, e ela pede ${Math.round(CRIVO.retornoDaFilial * 100)}%`);
    } else if (op && motivoParaNaoOperarGrupo(e, c, op) === null) {
      operarGrupo(e, c, op, reg, origem);
      resumos.push(`abriu uma filial ${oPais(c, pais!, 'na')}`);
    }
  }
  // A compra do controle da concorrente: barata (o preço do dia até o justo), com o caixa sobrando e o Cade de acordo.
  const alvo = alvoDaAquisicao(e, emp.id);
  if (alvo && !((alvo.n['participacao_socia'] ?? 0) > 0) && emp.id !== 'empresa' && aleatorio(rng) < CHANCE_DA_COMPRA && precoDaAquisicao(e, emp.id) <= 1.05) {
    // Compra inteira: a comprada vem para o grupo sem sócia (a parte que sobraria fica com quem vendeu, no mercado).
    const op: OperacaoEmpresa = { tipo: 'adquirir', empresa: emp.id, fracao: 1 };
    const custo = custoDaAquisicao(e, emp.id, 1);
    const preco = precoDaAquisicao(e, emp.id);
    if (crivo && preco > CRIVO.margemDeSeguranca) {
      resumos.push(`a dupla do valor vetou a compra da concorrente ${alvo.nome}: está a ${Math.round(preco * 100)}% do justo, sem margem de segurança`);
    } else if (custo <= caixa() * 0.75 && analiseDoCade(e, c, emp.t['setor'] ?? '', alvo.id).decisao !== 'barrada' && motivoParaNaoOperarEmpresa(e, c, op) === null) {
      const nome = alvo.nome;
      operarEmpresa(e, c, op, reg, origem);
      resumos.push(`comprou a concorrente ${nome} inteira`);
    }
  }
  return resumos;
}

/** Com a carta branca, a diretoria cuida do caixa: o aporte que pede e a sobra que manda para cima (o que der). */
function caixaDaCartaBranca(e: EstadoVida, c: Conteudo, emp: Entidade, reg: Mudanca[], origem: number): string[] {
  const resumos: string[] = [];
  const caixa = Math.max(0, emp.n['caixa'] ?? 0);
  const custo = Math.max(0, (emp.n['receita'] ?? 0) - (emp.n['lucro'] ?? 0));
  if (custo < 1) return resumos;
  const dona = donaDe(emp);
  const mae = dona[0] === '#' ? empresaDoRegistro(e, dona) : undefined;
  // Com sócia, o aporte diluiria quem não pôs dinheiro: isso é decisão dos sócios, não da diretoria.
  const temSocia = (emp.n['participacao_socia'] ?? 0) > 0;
  if (caixa < custo * RESERVA_MINIMA && mae && mae.vivo !== false && !temSocia) {
    const pedido = Math.round(Math.min(custo * RESERVA_MINIMA - caixa, Math.max(0, mae.n['caixa'] ?? 0) * 0.25));
    const op: OperacaoGrupo = { tipo: 'transferirCaixa', de: mae.id, para: emp.id, valor: pedido };
    if (pedido >= 1000 && motivoParaNaoOperarGrupo(e, c, op) === null) {
      operarGrupo(e, c, op, reg, origem);
      resumos.push(`pediu ${formatarDinheiro(pedido)} para ${aEmpresa(mae)}`);
    }
  } else if (caixa > custo * RESERVA_MAXIMA && (mae || dona === 'eu')) {
    const sobra = Math.round(caixa - custo * RESERVA_MAXIMA);
    const op: OperacaoGrupo = { tipo: 'transferirCaixa', de: emp.id, para: mae ? mae.id : 'eu', valor: sobra };
    if (sobra >= 1000 && motivoParaNaoOperarGrupo(e, c, op) === null) {
      operarGrupo(e, c, op, reg, origem);
      resumos.push(`mandou ${formatarDinheiro(sobra)} de sobra para ${mae ? aEmpresa(mae) : 'a sua conta'}`);
    }
  }
  return resumos;
}
export const NOME_DO_MANDATO: Record<Mandato, string> = { conservador: 'conservador', arrojado: 'arrojado' };

/** O que o conselho pode decidir em cada autonomia (as jogadas do negócio; a retirada é a da folha). */
const PODE: Record<Autonomia, ReadonlySet<string>> = {
  manual: new Set(),
  consultiva: new Set(),
  delegada: new Set(['preco', 'salario', 'verbas', 'expandir', 'cortar', 'pagar', 'retirada', 'lancar']),
  autonoma: new Set(['preco', 'salario', 'verbas', 'expandir', 'cortar', 'pagar', 'retirada', 'lancar', 'emprestimo', 'exportar']),
  // Com carta branca, crescer é construir a unidade nova na cidade mais barata (crescimentoDaCartaBranca), não ampliar a de sempre.
  carta_branca: new Set(['preco', 'salario', 'verbas', 'cortar', 'pagar', 'retirada', 'lancar', 'emprestimo', 'exportar']),
};

/**
 * A autonomia de uma empresa. Sem decisão de quem joga, toda empresa do grupo começa com carta branca (I-178): a CEO
 * dirige; a que quem joga cuida de perto (e a holding, que não opera) começa no manual.
 */
export function autonomiaDe(emp: Entidade): Autonomia {
  const a = emp.t['autonomia'] as Autonomia | undefined;
  if (a && (AUTONOMIAS as readonly string[]).includes(a)) return a;
  return emp.id === 'empresa' || emp.q['holding'] ? 'manual' : 'carta_branca';
}

export function mandatoDe(emp: Entidade): Mandato {
  return emp.t['mandato'] === 'arrojado' ? 'arrojado' : 'conservador';
}

/** O jeito da heurística pelo mandato. */
function jeitoDoMandato(m: Mandato): 'cautelosa' | 'arriscada' {
  return m === 'arrojado' ? 'arriscada' : 'cautelosa';
}

/** O sorteio do conselho não gasta o da vida: no mesmo ano, a mesma empresa decide o mesmo (a folha e o ano batem). */
function sorteioDoConselho(e: EstadoVida, emp: Entidade): ReturnType<typeof criarRng> {
  return criarRng(misturar(e.semente, e.ano, 3307, emp.registro ?? 0));
}

/** Uma jogada do conselho: uma do negócio ou a retirada (a parte do lucro que sobe para os donos). */
export type JogadaDoConselho = OperacaoNegocio | { tipo: 'retirada'; fracao: number };

/** As jogadas que o conselho faria agora, dentro da autonomia `nivel` (a consultiva mostra as da delegada). */
export function jogadasDoConselho(e: EstadoVida, c: Conteudo, emp: Entidade, nivel: Autonomia = autonomiaDe(emp)): JogadaDoConselho[] {
  if (emp.q['holding'] || emp.vivo === false || emp.n['capacidade'] === undefined || deFora(emp)) return [];
  const pode = PODE[nivel === 'consultiva' ? 'delegada' : nivel];
  if (pode.size === 0) return [];
  const ops: JogadaDoConselho[] = [];
  const quer = (o: { tipo: string }): boolean => pode.has(o.tipo) && (o.tipo === 'retirada' || (ehOperacaoDeNegocio(o) && motivoParaNaoOperarNegocio(e, c, o) === null));
  for (const op of jogadasDoNegocio(jeitoDoMandato(mandatoDe(emp)), e, c, emp, sorteioDoConselho(e, emp), quer)) {
    if (op.tipo === 'retirada' && 'fracao' in op && Math.abs((emp.n['retirada'] ?? 0) - op.fracao) > 1e-9) ops.push({ tipo: 'retirada', fracao: op.fracao });
    else if (ehOperacaoDeNegocio(op)) ops.push(op);
  }
  return ops;
}

/**
 * O ano dos conselhos (depois do das empresas): cada empresa do grupo com autonomia delegada ou autônoma decide as
 * jogadas do jeito do mandato, e o ano de decisões vira uma entrada no livro, com a decisão de quem delegou de causa.
 */
export function anoDosConselhos(e: EstadoVida, c: Conteudo, empresas: readonly Entidade[]): void {
  // A dupla do valor decide primeiro (valor.ts): as diretorias do grupo dela se reportam a ela.
  anoDaDupla(e, c);
  for (const emp of empresas) {
    // A dupla pode ter vendido a empresa neste ano: ela saiu do grupo (deFora) e segue com a diretoria de lá.
    if (emp.vivo === false || !e.entidades[emp.id] || deFora(emp)) continue;
    const nivel = autonomiaDe(emp);
    if (nivel !== 'delegada' && nivel !== 'autonoma' && nivel !== 'carta_branca') continue;
    const crivo = sobADupla(e, emp);
    // Com a dupla, dívida nenhuma: a diretoria não pega crédito no banco.
    const ops = jogadasDoConselho(e, c, emp, nivel).filter((o) => !(crivo && o.tipo === 'emprestimo'));
    if (ops.length === 0 && nivel !== 'carta_branca') continue;
    const reg: Mudanca[] = [];
    const resumos: string[] = [];
    // A entrada do ano da diretoria nasce antes das decisões: o que ela constrói, abre ou compra aponta para ela.
    const entrada = novaEntrada(e, { tipo: 'dinheiro', causa: 'regra', ref: 'conselho:decidiu', instancia: `conselho:decidiu#${emp.id}`, texto: '' });
    for (const op of ops) {
      if (op.tipo === 'retirada') {
        definirNumero(e, reg, emp.id, 'retirada', op.fracao);
        resumos.push(`passou a distribuir ${Math.round(op.fracao * 100)}% do lucro`);
        continue;
      }
      if (motivoParaNaoOperarNegocio(e, c, op) !== null) continue;
      resumos.push(operarNegocio(e, c, op, reg, emp.nome).resumo.replace(` de ${emp.nome}`, '').replace(` em ${emp.nome}`, '').replace(` ${emp.nome}`, ''));
    }
    if (nivel === 'carta_branca') {
      resumos.push(...crescimentoDaCartaBranca(e, c, emp, reg, ops.some((o) => o.tipo === 'expandir'), entrada.id, crivo));
      // Com a dupla, o caixa é dela: a sobra sobe e o aporte desce pelas mãos dela (valor.ts › anoDaDupla).
      if (!crivo) resumos.push(...caixaDaCartaBranca(e, c, emp, reg, entrada.id));
    }
    if (reg.length === 0 && !resumos.some((r) => r.startsWith('a dupla do valor vetou'))) continue;
    const causa = entradaQueMudou(e, `${emp.id}.autonomia`);
    const lista = resumos.length > 1 ? `${resumos.slice(0, -1).join(', ')} e ${resumos.at(-1)}` : (resumos[0] ?? 'mexeu no negócio');
    entrada.texto = `${quemAssina(e, c, emp)} com o mandato ${NOME_DO_MANDATO[mandatoDe(emp)]}${causa !== null ? ' que você deu' : ''}, ${lista}.`;
    entrada.resumo = `viu a diretoria ${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome} decidir sozinha`;
    if (causa !== null) entrada.causas = [causa];
    lancar(e, entrada, reg);
  }
}

// ---------------------------------------------------------------- a decisão de quem joga (folha do grupo, sem ficha)

export type OperacaoGovernanca = { tipo: 'governanca'; empresa: string; autonomia: Autonomia; mandato: Mandato };

export function ehOperacaoDeGovernanca(op: { tipo: string }): op is OperacaoGovernanca {
  return op.tipo === 'governanca';
}

export function motivoParaNaoOperarGovernanca(e: EstadoVida, op: OperacaoGovernanca): string | null {
  const emp = e.entidades[op.empresa];
  if (!emp || emp.tipo !== 'empresa' || emp.vivo === false || deFora(emp)) return 'a empresa não é do seu grupo';
  if (emp.q['holding']) return 'a holding não tem negócio para o conselho tocar';
  if (!(AUTONOMIAS as readonly string[]).includes(op.autonomia) || !(MANDATOS as readonly string[]).includes(op.mandato)) return 'escolha a autonomia e o mandato';
  if (autonomiaDe(emp) === op.autonomia && mandatoDe(emp) === op.mandato) return 'já é assim';
  return null;
}

export function operarGovernanca(e: EstadoVida, op: OperacaoGovernanca, reg: Mudanca[]): { texto: string; resumo: string } {
  const emp = e.entidades[op.empresa]!;
  if (autonomiaDe(emp) !== op.autonomia) definirTexto(e, reg, emp.id, 'autonomia', op.autonomia);
  if (mandatoDe(emp) !== op.mandato) definirTexto(e, reg, emp.id, 'mandato', op.mandato);
  const de = `${emp.genero === 'm' ? 'do' : 'da'} ${emp.nome}`;
  if (op.autonomia === 'manual') return { texto: `Você voltou a decidir tudo ${de}: o conselho só assina.`, resumo: `voltou a decidir tudo ${de}` };
  return {
    texto: `O conselho ${de} recebeu um mandato ${NOME_DO_MANDATO[op.mandato]}: ${NOME_DA_AUTONOMIA[op.autonomia]}.`,
    resumo: `deu ao conselho ${de} um mandato ${NOME_DO_MANDATO[op.mandato]}`,
  };
}
