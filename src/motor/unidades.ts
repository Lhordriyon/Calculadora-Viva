/**
 * As unidades operacionais (missão Capitalismo vivo, I-158): o estabelecimento de uma pessoa jurídica.
 *
 * Subsidiária e unidade são coisas diferentes, e o motor não as mistura:
 * - a **subsidiária** é uma empresa (societario.ts): tem número, caixa, sócios, dívida, dividendos e pode quebrar;
 * - a **unidade** é um lugar onde uma empresa trabalha (a fábrica, a loja, a clínica, o laboratório): não tem caixa,
 *   nem sócios, nem dívida; tem a empresa dona (pelo número dela), a forma, a cidade e o tamanho.
 *
 * As unidades que produzem têm capacidade (o que conseguem vender por ano), e a capacidade da empresa é a soma delas
 * (há invariante); a obra fica pronta no ano seguinte, na unidade em que foi feita. As unidades de apoio (mundo.json ›
 * apoios) não vendem: têm porte (a estrutura por ano) e mudam o negócio da empresa dona (o laboratório faz o P&D render
 * mais; o centro de distribuição barateia cada venda). A cidade de cada unidade pesa na estrutura (o salário e o aluguel
 * seguem o custo de vida, comparado com o da sede) e os empregos dela contam no desemprego da cidade em que ela fica.
 *
 * O resultado de cada unidade (contaDaUnidade) é um rateio declarado: as vendas e o custo variável da empresa pela parte
 * da capacidade, a estrutura pela capacidade e pela cidade. O caixa é da empresa, não da unidade.
 *
 * Toda mudança vai para o livro: a unidade nasce e morre por lançamentos (como o bem e o contrato), e mudar a
 * capacidade de uma empresa muda a de uma unidade dela no mesmo lançamento.
 */
import { donaDe, empresaDoRegistro, refDaEmpresa } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import type { DefSetor } from './esquema.ts';
import { definirTexto, ganhar, perder, somar } from './livro.ts';
import { custoDeVidaDa } from './origem.ts';
import { novaEntidade } from './pessoas.ts';
import { aEmpresa } from './empresa.ts';
import { custoDaObra, economiaDo, ofertaDe, precoDoSetor } from './negocio.ts';
import { UNIDADES, VALOR_DE_VENDA_DOS_ATIVOS } from './regras.ts';
import { controladaPor, proximoRegistro } from './societario.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

// ---------------------------------------------------------------- leituras

/** As unidades vivas da empresa (a primeira é a sede; depois, das maiores para as menores). */
export function unidadesDe(e: EstadoVida, emp: Entidade): Entidade[] {
  const ref = refDaEmpresa(emp);
  if (emp.registro === undefined) return [];
  const lista: Entidade[] = [];
  for (const x of Object.values(e.entidades)) if (x.tipo === 'unidade' && x.vivo !== false && x.t['empresa'] === ref) lista.push(x);
  return lista.sort((a, b) => Number(Boolean(b.q['sede'])) - Number(Boolean(a.q['sede'])) || (b.n['capacidade'] ?? 0) + (b.n['porte'] ?? 0) - ((a.n['capacidade'] ?? 0) + (a.n['porte'] ?? 0)) || a.id.localeCompare(b.id));
}

/** A unidade produz (tem capacidade) ou é de apoio (tem porte)? */
export function ehDeApoio(un: Entidade): boolean {
  return un.t['forma'] === 'laboratorio' || un.t['forma'] === 'centro';
}

export function produtivasDe(e: EstadoVida, emp: Entidade): Entidade[] {
  return unidadesDe(e, emp).filter((u) => !ehDeApoio(u));
}

export function deApoioDe(e: EstadoVida, emp: Entidade, forma?: 'laboratorio' | 'centro'): Entidade[] {
  return unidadesDe(e, emp).filter((u) => ehDeApoio(u) && (!forma || u.t['forma'] === forma));
}

/** A empresa dona da unidade (pelo número). */
export function empresaDaUnidade(e: EstadoVida, un: Entidade): Entidade | undefined {
  return un.t['empresa'] ? empresaDoRegistro(e, un.t['empresa']) : undefined;
}

/** O nome da forma (a fábrica, a loja, o laboratório) e o artigo, pelo catálogo do setor e dos apoios. */
export function formaDe(c: Conteudo, forma: string | undefined, setor?: DefSetor): { nome: string; f: boolean } {
  const apoio = c.mundo.apoios?.find((a) => a.id === forma);
  if (apoio) return { nome: apoio.nome, f: apoio.f };
  if (setor?.unidade && setor.unidade.id === forma) return setor.unidade;
  for (const s of c.setores.values()) {
    const u = s.unidade;
    if (u && u.id === forma) return u;
  }
  return { nome: 'unidade', f: true };
}

/** "a fábrica de Campinas", "o laboratório de Recife". */
export function nomeDaUnidade(c: Conteudo, un: Entidade): string {
  const f = formaDe(c, un.t['forma']);
  return `${f.f ? 'a' : 'o'} ${f.nome} de ${un.t['cidade'] ?? '?'}`;
}

/** A forma que produz no setor da empresa (a do catálogo; sem ela, "unidade"). */
export function formaQueProduz(c: Conteudo, emp: Entidade): string {
  return c.setores.get(emp.t['setor'] ?? '')?.unidade?.id ?? 'unidade';
}

/** O custo de vida de uma cidade do catálogo pelo nome (1 quando ela não está no catálogo). */
export function custoDaCidade(c: Conteudo, nome: string | undefined): number {
  const cidade = c.mundo.cidades.find((x) => x.nome === nome);
  return cidade ? custoDeVidaDa(cidade) : 1;
}

/** A cidade da sede da empresa: a da unidade marcada sede (ou a da maior); sem unidades, a de quem joga. */
export function cidadeDaSede(e: EstadoVida, emp: Entidade): string {
  return unidadesDe(e, emp)[0]?.t['cidade'] ?? e.entidades['lugar']?.nome ?? '';
}

/**
 * Quanto a estrutura de uma unidade custa pela cidade dela, comparada com a da sede: uma parte (o salário, o aluguel)
 * segue o custo de vida. A unidade na sede vale 1; no interior, partindo de São Paulo, uns 14% menos.
 */
export function fatorDaCidade(c: Conteudo, cidade: string | undefined, sede: string): number {
  return 1 - UNIDADES.pesoDaCidade + (UNIDADES.pesoDaCidade * custoDaCidade(c, cidade)) / custoDaCidade(c, sede);
}

/** O que o ano do negócio lê das unidades, numa passada só (a etapa das empresas roda todo ano, para toda empresa). */
export interface Estrutura {
  /** A capacidade pesada pela cidade de cada unidade (a estrutura que ela paga). */
  capacidadePelaCidade: number;
  /** O porte das unidades de apoio pesado pela cidade. */
  porteDoApoio: number;
  fatorDoLaboratorio: number;
  fatorDoCentro: number;
  ativosDoApoio: number;
}

export function estruturaDe(e: EstadoVida, c: Conteudo, emp: Entidade): Estrutura {
  const lista = unidadesDe(e, emp);
  const sede = lista[0]?.t['cidade'] ?? e.entidades['lugar']?.nome ?? '';
  const cidades = new Map<string, number>();
  const fator = (cidade: string | undefined): number => {
    const k = cidade ?? '';
    let f = cidades.get(k);
    if (f === undefined) cidades.set(k, (f = fatorDaCidade(c, cidade, sede)));
    return f;
  };
  let pelaCidade = 0;
  let produz = 0;
  let porte = 0;
  let lab = 0;
  let centro = 0;
  let ativos = 0;
  for (const u of lista) {
    if (ehDeApoio(u)) {
      const p = u.n['porte'] ?? 0;
      porte += p * fator(u.t['cidade']);
      if (u.t['forma'] === 'laboratorio') lab += p;
      else centro += p;
      ativos += p * UNIDADES.obraDoApoio * VALOR_DE_VENDA_DOS_ATIVOS + (u.n['obra'] ?? 0) * UNIDADES.obraDoApoio;
    } else {
      produz++;
      pelaCidade += (u.n['capacidade'] ?? 0) * fator(u.t['cidade']);
    }
  }
  const regua = reguaDoApoio(emp);
  return {
    capacidadePelaCidade: produz > 0 ? pelaCidade : (emp.n['capacidade'] ?? 0),
    porteDoApoio: porte,
    fatorDoLaboratorio: 1 + UNIDADES.laboratorio.efeito * Math.min(1, lab / (UNIDADES.laboratorio.porte * regua)),
    fatorDoCentro: 1 - UNIDADES.centro.efeito * Math.min(1, centro / (UNIDADES.centro.porte * regua)),
    ativosDoApoio: ativos,
  };
}

/** A capacidade da empresa pesada pela cidade de cada unidade (a estrutura que ela paga): sem unidades, a capacidade. */
export function capacidadePelaCidade(e: EstadoVida, c: Conteudo, emp: Entidade): number {
  const lista = produtivasDe(e, emp);
  if (lista.length === 0) return emp.n['capacidade'] ?? 0;
  const sede = cidadeDaSede(e, emp);
  let soma = 0;
  for (const u of lista) soma += (u.n['capacidade'] ?? 0) * fatorDaCidade(c, u.t['cidade'], sede);
  return soma;
}

/** O porte das unidades de apoio (a estrutura delas por ano), pesado pela cidade. */
export function porteDoApoio(e: EstadoVida, c: Conteudo, emp: Entidade, forma?: 'laboratorio' | 'centro'): number {
  const sede = cidadeDaSede(e, emp);
  let soma = 0;
  for (const u of deApoioDe(e, emp, forma)) soma += (u.n['porte'] ?? 0) * fatorDaCidade(c, u.t['cidade'], sede);
  return soma;
}

/** A régua das unidades de apoio: as vendas do ano passado (ou metade da capacidade, no começo). */
function reguaDoApoio(emp: Entidade): number {
  return Math.max(1, emp.n['receita'] ?? 0, (emp.n['capacidade'] ?? 0) * 0.5);
}

/** Quanto o laboratório multiplica o P&D: 1 sem laboratório; até 1 + efeito com o porte certo para as vendas. */
export function fatorDoLaboratorio(e: EstadoVida, emp: Entidade): number {
  let porte = 0;
  for (const u of deApoioDe(e, emp, 'laboratorio')) porte += u.n['porte'] ?? 0;
  return 1 + UNIDADES.laboratorio.efeito * Math.min(1, porte / (UNIDADES.laboratorio.porte * reguaDoApoio(emp)));
}

/** Quanto o centro de distribuição baixa o custo de cada venda: 1 sem centro; até 1 − efeito com o porte certo. */
export function fatorDoCentro(e: EstadoVida, emp: Entidade): number {
  let porte = 0;
  for (const u of deApoioDe(e, emp, 'centro')) porte += u.n['porte'] ?? 0;
  return 1 - UNIDADES.centro.efeito * Math.min(1, porte / (UNIDADES.centro.porte * reguaDoApoio(emp)));
}

/** Os ativos das unidades de apoio a preço de venda e a obra delas pelo que custou (entram no valor da empresa). */
export function ativosDoApoio(e: EstadoVida, emp: Entidade): number {
  let v = 0;
  for (const u of deApoioDe(e, emp)) v += (u.n['porte'] ?? 0) * UNIDADES.obraDoApoio * VALOR_DE_VENDA_DOS_ATIVOS + (u.n['obra'] ?? 0) * UNIDADES.obraDoApoio;
  return v;
}

/** A equipe das unidades de apoio (o porte pelo custo de uma pessoa por ano). */
export function equipeDoApoio(e: EstadoVida, emp: Entidade, cidade?: string): number {
  let v = 0;
  for (const u of deApoioDe(e, emp)) if (cidade === undefined || u.t['cidade'] === cidade) v += (u.n['porte'] ?? 0) / UNIDADES.porPessoa;
  return v;
}

/** A parte da capacidade de produção que fica na cidade (0 a 1); sem unidades, toda (a empresa de antes das unidades). */
export function parteNaCidade(e: EstadoVida, emp: Entidade, cidade: string): number {
  const lista = produtivasDe(e, emp);
  if (lista.length === 0) return 1;
  let total = 0;
  let aqui = 0;
  for (const u of lista) {
    total += u.n['capacidade'] ?? 0;
    if (u.t['cidade'] === cidade) aqui += u.n['capacidade'] ?? 0;
  }
  return total > 0 ? aqui / total : lista[0]!.t['cidade'] === cidade ? 1 : 0;
}

export interface ContaDaUnidade {
  /** Vendas e custo pelo rateio da capacidade (a unidade de apoio não vende). */
  receita: number;
  custo: number;
  resultado: number;
  funcionarios: number;
  /** O que ela vale a preço de venda (as máquinas, o prédio). */
  ativos: number;
}

/**
 * A conta de uma unidade, em rateio declarado: a parte dela nas vendas e no custo variável é a parte da capacidade; a
 * estrutura, a capacidade dela pela cidade; a unidade de apoio é centro de custo (o porte). Os números da empresa são os
 * do último ano fechado.
 */
export function contaDaUnidade(e: EstadoVida, c: Conteudo, un: Entidade, giro: number, fixo: number, margem: number, empregados: number): ContaDaUnidade {
  const emp = empresaDaUnidade(e, un);
  if (!emp) return { receita: 0, custo: 0, resultado: 0, funcionarios: 0, ativos: 0 };
  const sede = cidadeDaSede(e, emp);
  const fator = fatorDaCidade(c, un.t['cidade'], sede);
  if (ehDeApoio(un)) {
    const custo = (un.n['porte'] ?? 0) * fator;
    return { receita: 0, custo, resultado: -custo, funcionarios: Math.round((un.n['porte'] ?? 0) / UNIDADES.porPessoa), ativos: (un.n['porte'] ?? 0) * UNIDADES.obraDoApoio * VALOR_DE_VENDA_DOS_ATIVOS };
  }
  const total = Math.max(1e-9, emp.n['capacidade'] ?? 0);
  const parte = (un.n['capacidade'] ?? 0) / total;
  const receita = (emp.n['receita'] ?? 0) * parte;
  const custo = receita * (1 - margem) + (un.n['capacidade'] ?? 0) * fixo * fator;
  return { receita, custo, resultado: receita - custo, funcionarios: Math.round(empregados * parte), ativos: (un.n['capacidade'] ?? 0) * giro * VALOR_DE_VENDA_DOS_ATIVOS };
}

// ---------------------------------------------------------------- o que muda o estado

/** O número da unidade nova (o mesmo contador do registro das empresas: um número nunca se repete na vida). */
function idDaUnidade(e: EstadoVida): string {
  proximoRegistro(e);
  let id = `unidade${e.proximoRegistro!++}`;
  while (e.entidades[id]) id = `unidade${e.proximoRegistro!++}`;
  return id;
}

/** Abre uma unidade na empresa (a capacidade e a obra entram depois, por mudarCapacidade e mudarObra). */
export function abrirUnidade(e: EstadoVida, reg: Mudanca[], emp: Entidade, forma: string, cidade: string, origem: number, sede = false): Entidade {
  const id = idDaUnidade(e);
  const un = novaEntidade({ id, tipo: 'unidade', nome: '', nascimento: e.ano, vivo: true });
  e.entidades[id] = un;
  definirTexto(e, reg, id, 'empresa', refDaEmpresa(emp));
  definirTexto(e, reg, id, 'forma', forma);
  definirTexto(e, reg, id, 'cidade', cidade);
  if (sede) ganhar(e, reg, id, 'sede', origem);
  return un;
}

/** Fecha a unidade: o livro zera o que ela tinha e ela sai do estado (a capacidade da empresa já foi mexida por quem chamou). */
export function apagarUnidade(e: EstadoVida, reg: Mudanca[], un: Entidade): void {
  for (const [campo, v] of Object.entries(un.n)) if (v !== 0) somar(e, reg, un.id, campo, -v, 'fechamento');
  for (const q of Object.keys(un.q)) perder(e, reg, un.id, q);
  delete e.entidades[un.id];
}

/**
 * A empresa de antes das unidades (um save antigo, ou a que acabou de ganhar os fundamentos) ganha a sede: uma unidade
 * da forma do setor, na cidade de quem joga, com a capacidade e a obra que a empresa já tinha. Não inventa nada: a
 * estrutura existia, faltava dizer onde.
 */
export function garantirUnidades(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, origem = 0, cidade?: string): void {
  if (emp.q['holding'] || emp.vivo === false || emp.n['capacidade'] === undefined || emp.registro === undefined) return;
  if (produtivasDe(e, emp).length > 0) return;
  const un = abrirUnidade(e, reg, emp, formaQueProduz(c, emp), cidade ?? e.entidades['lugar']?.nome ?? 'São Paulo', origem, unidadesDe(e, emp).length === 0);
  un.nome = rotulo(c, un);
  if ((emp.n['capacidade'] ?? 0) !== 0) somar(e, reg, un.id, 'capacidade', emp.n['capacidade']!, 'negocio');
  if ((emp.n['obra'] ?? 0) !== 0) somar(e, reg, un.id, 'obra', emp.n['obra']!, 'negocio');
}

/**
 * Espalha `delta` de um campo da empresa (a capacidade ou a obra) pelas unidades que produzem: o ganho vai para a
 * unidade dada (ou a sede, ou a maior); a perda sai de todas na proporção do que cada uma tem (a última leva o resto,
 * para a soma fechar).
 */
function espalhar(e: EstadoVida, reg: Mudanca[], emp: Entidade, campo: 'capacidade' | 'obra', delta: number, motivo: string, alvo?: Entidade): void {
  const lista = produtivasDe(e, emp);
  if (lista.length === 0 || delta === 0) return;
  if (delta > 0) {
    somar(e, reg, (alvo ?? lista[0]!).id, campo, delta, motivo);
    return;
  }
  if (alvo && (alvo.n[campo] ?? 0) >= -delta) {
    somar(e, reg, alvo.id, campo, delta, motivo);
    return;
  }
  const total = lista.reduce((s, u) => s + Math.max(0, u.n[campo] ?? 0), 0);
  if (total <= 0) return;
  let resto = delta;
  lista.forEach((u, i) => {
    const v = i === lista.length - 1 ? resto : (delta * Math.max(0, u.n[campo] ?? 0)) / total;
    const d = Math.max(-(u.n[campo] ?? 0), v);
    if (d !== 0) somar(e, reg, u.id, campo, d, motivo);
    resto -= d;
  });
}

/** Muda a capacidade da empresa e a das unidades dela no mesmo lançamento (a única porta para mexer na capacidade). */
export function mudarCapacidade(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, delta: number, motivo = 'negocio', alvo?: Entidade): void {
  if (!(Math.abs(delta) > 0)) return;
  garantirUnidades(e, c, reg, emp);
  const d = Math.max(-(emp.n['capacidade'] ?? 0), delta);
  somar(e, reg, emp.id, 'capacidade', d, motivo);
  // A empresa que acabou de ganhar a estrutura (a fundação, o save de antes do negócio) ganha a sede com ela inteira.
  if (produtivasDe(e, emp).length === 0) garantirUnidades(e, c, reg, emp);
  else espalhar(e, reg, emp, 'capacidade', d, motivo, alvo);
}

/** Muda a obra da empresa e a da unidade em que ela é feita. */
export function mudarObra(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, delta: number, alvo?: Entidade): void {
  if (!(Math.abs(delta) > 0)) return;
  garantirUnidades(e, c, reg, emp);
  const d = Math.max(-(emp.n['obra'] ?? 0), delta);
  somar(e, reg, emp.id, 'obra', d, 'negocio');
  if (produtivasDe(e, emp).length === 0) garantirUnidades(e, c, reg, emp);
  else espalhar(e, reg, emp, 'obra', d, 'negocio', alvo);
}

/** A obra do ano passado fica pronta, em cada unidade (a que produz ganha capacidade; a de apoio, porte). */
export function obraPronta(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade): void {
  garantirUnidades(e, c, reg, emp);
  const lista = unidadesDe(e, emp);
  if (lista.length === 0) {
    // A empresa sem unidade (sem número ainda): a obra fica pronta nela, como antes das unidades.
    const obra = emp.n['obra'] ?? 0;
    if (obra > 0) {
      somar(e, reg, emp.id, 'obra', -obra, 'negocio');
      somar(e, reg, emp.id, 'capacidade', obra, 'negocio');
    }
    return;
  }
  let pronta = 0;
  for (const u of lista) {
    const o = u.n['obra'] ?? 0;
    if (!(o > 0)) continue;
    somar(e, reg, u.id, 'obra', -o, 'negocio');
    somar(e, reg, u.id, ehDeApoio(u) ? 'porte' : 'capacidade', o, 'negocio');
    if (!ehDeApoio(u)) pronta += o;
  }
  if (pronta > 0) {
    somar(e, reg, emp.id, 'obra', -pronta, 'negocio');
    somar(e, reg, emp.id, 'capacidade', pronta, 'negocio');
  }
}

/** Leva a unidade de uma empresa para outra (a transferência dentro do grupo, a fusão): o número da dona muda no livro. */
export function moverUnidade(e: EstadoVida, reg: Mudanca[], un: Entidade, para: Entidade): void {
  definirTexto(e, reg, un.id, 'empresa', refDaEmpresa(para));
  if (un.q['sede']) perder(e, reg, un.id, 'sede');
}

/** A empresa saiu da vida (a quebra, o encerramento): as unidades dela fecham junto. */
export function fecharUnidadesDe(e: EstadoVida, reg: Mudanca[], emp: Entidade): void {
  for (const u of unidadesDe(e, emp)) apagarUnidade(e, reg, u);
}

/** A sede fechou ou saiu: a maior das que sobraram vira a sede. */
export function acertarSede(e: EstadoVida, reg: Mudanca[], emp: Entidade, origem: number): void {
  const lista = unidadesDe(e, emp);
  if (lista.length === 0 || lista.some((u) => u.q['sede'])) return;
  const maior = lista.find((u) => !ehDeApoio(u)) ?? lista[0]!;
  ganhar(e, reg, maior.id, 'sede', origem);
}

// ---------------------------------------------------------------- as decisões (folha do grupo, sem ficha)

export type OperacaoUnidade =
  | { tipo: 'construirUnidade'; empresa: string; forma: string; cidade: string; fracao?: number }
  | { tipo: 'fecharUnidade'; unidade: string }
  | { tipo: 'venderUnidade'; unidade: string }
  | { tipo: 'transferirUnidade'; unidade: string; para: string };

const TIPOS = new Set(['construirUnidade', 'fecharUnidade', 'venderUnidade', 'transferirUnidade']);
export function ehOperacaoDeUnidade(op: { tipo: string }): op is OperacaoUnidade {
  return TIPOS.has(op.tipo);
}

/** A empresa viva do grupo de quem joga com esse id (as decisões sobre unidades só valem dentro do grupo). */
function doGrupoVivo(e: EstadoVida, id: string | undefined): Entidade | undefined {
  const x = id ? e.entidades[id] : undefined;
  return x && x.tipo === 'empresa' && x.vivo !== false && controlaOGrupo(e, x) ? x : undefined;
}

/** A cadeia de controle chega em quem joga (a mesma régua da folha do grupo). */
function controlaOGrupo(e: EstadoVida, emp: Entidade): boolean {
  return donaDe(emp) === 'eu' || controladaPor(e, emp, 'eu');
}

function unidadeViva(e: EstadoVida, id: string): Entidade | undefined {
  const x = e.entidades[id];
  return x && x.tipo === 'unidade' && x.vivo !== false ? x : undefined;
}

/** O apoio (o laboratório, o centro de distribuição) do catálogo, se o setor da empresa pode ter. */
function apoioPara(c: Conteudo, forma: string, emp: Entidade): NonNullable<Conteudo['mundo']['apoios']>[number] | undefined {
  const a = c.mundo.apoios?.find((x) => x.id === forma);
  return a && a.setores.includes(emp.t['setor'] ?? '') ? a : undefined;
}

/** O porte que uma unidade de apoio nova teria (o certo para as vendas de hoje) e o que custa construí-la. */
export function porteDoApoioNovo(emp: Entidade, forma: 'laboratorio' | 'centro'): { porte: number; custo: number } {
  const porte = UNIDADES[forma].porte * reguaDoApoio(emp);
  return { porte, custo: porte * UNIDADES.obraDoApoio };
}

/** O preço da unidade que produz: o que custaria construir (pelo preço do setor) vezes a fração (vender funcionando, transferir pelo contábil). */
export function precoDaUnidade(e: EstadoVida, c: Conteudo, un: Entidade, fracao: number): number {
  const emp = empresaDaUnidade(e, un);
  if (!emp) return 0;
  if (ehDeApoio(un)) return ((un.n['porte'] ?? 0) + (un.n['obra'] ?? 0)) * UNIDADES.obraDoApoio * fracao;
  const giro = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro;
  return ((un.n['capacidade'] ?? 0) + (un.n['obra'] ?? 0)) * giro * precoDoSetor(ofertaDe(e, emp.t['setor'])) * fracao;
}

export function motivoParaNaoOperarUnidade(e: EstadoVida, c: Conteudo, op: OperacaoUnidade): string | null {
  if (op.tipo === 'construirUnidade') {
    const emp = doGrupoVivo(e, op.empresa);
    if (!emp) return 'a empresa não é do seu grupo';
    if (emp.q['holding']) return 'a holding não tem operação própria: quem produz são as subsidiárias';
    if (emp.n['capacidade'] === undefined) return 'a empresa ainda não opera';
    if (unidadesDe(e, emp).length >= UNIDADES.maximo) return `a empresa já tem ${UNIDADES.maximo} unidades`;
    if (!c.mundo.cidades.some((x) => x.nome === op.cidade)) return 'cidade desconhecida';
    const apoio = apoioPara(c, op.forma, emp);
    if (apoio) {
      const { custo } = porteDoApoioNovo(emp, apoio.id);
      return custo > (emp.n['caixa'] ?? 0) ? `${apoio.f ? 'a' : 'o'} ${apoio.nome} custa ${formatarDinheiro(custo)} e o caixa não tem` : null;
    }
    if (op.forma !== formaQueProduz(c, emp)) return 'essa unidade não serve ao setor da empresa';
    if ((emp.n['obra'] ?? 0) > 0) return 'já tem uma obra em andamento';
    const fracao = op.fracao ?? 0.25;
    if (!(UNIDADES.fracoes as readonly number[]).includes(fracao)) return 'tamanho de obra desconhecido';
    const custo = custoDaObra(c, emp, fracao, e);
    return custo > (emp.n['caixa'] ?? 0) ? `a obra custa ${formatarDinheiro(custo)} e o caixa não tem` : null;
  }
  const un = unidadeViva(e, op.unidade);
  if (!un) return 'essa unidade não existe mais';
  const emp = empresaDaUnidade(e, un);
  if (!emp || !doGrupoVivo(e, emp.id)) return 'a unidade não é de uma empresa do seu grupo';
  const ultima = !ehDeApoio(un) && produtivasDe(e, emp).length <= 1;
  if (op.tipo === 'fecharUnidade') return ultima ? 'é a única que produz: para fechar, feche ou venda a empresa' : null;
  if (op.tipo === 'venderUnidade') {
    if (ehDeApoio(un)) return 'ninguém compra só o apoio: feche e venda o que dá';
    return ultima ? 'é a única que produz: para vendê-la, venda a empresa' : null;
  }
  const para = doGrupoVivo(e, op.para);
  if (!para || para.id === emp.id) return 'escolha outra empresa do seu grupo';
  if (para.q['holding']) return 'a holding não tem operação própria';
  if (para.n['capacidade'] === undefined) return 'a empresa de destino ainda não opera';
  if (ultima) return 'é a única que produz: a empresa ficaria sem operação';
  if (ehDeApoio(un) ? !apoioPara(c, un.t['forma'] ?? '', para) : para.t['setor'] !== emp.t['setor']) return 'a outra empresa é de outro setor';
  if (unidadesDe(e, para).length >= UNIDADES.maximo) return `a outra empresa já tem ${UNIDADES.maximo} unidades`;
  const preco = precoDaUnidade(e, c, un, VALOR_DE_VENDA_DOS_ATIVOS);
  return preco > (para.n['caixa'] ?? 0) ? `a outra empresa precisa de ${formatarDinheiro(preco)} no caixa para pagar a unidade` : null;
}

/** Faz a operação (já conferida) e devolve o texto e o resumo da entrada. */
export function operarUnidade(e: EstadoVida, c: Conteudo, op: OperacaoUnidade, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  if (op.tipo === 'construirUnidade') {
    const emp = e.entidades[op.empresa]!;
    // A empresa de antes das unidades ganha a sede antes da unidade nova (a estrutura que ela tem fica onde estava).
    garantirUnidades(e, c, reg, emp, origem);
    const apoio = apoioPara(c, op.forma, emp);
    const un = abrirUnidade(e, reg, emp, op.forma, op.cidade, origem);
    un.nome = rotulo(c, un);
    const nome = nomeDaUnidade(c, un);
    if (apoio) {
      const { porte, custo } = porteDoApoioNovo(emp, apoio.id);
      somar(e, reg, emp.id, 'caixa', -custo, 'obra', 'mercado');
      somar(e, reg, un.id, 'obra', porte, 'negocio');
      return { texto: `${aEmpresa(emp, 'A')} começou a construir ${nome}, por ${formatarDinheiro(custo)}. Fica pront${apoio.f ? 'a' : 'o'} no ano que vem. ${apoio.descricao}`, resumo: `mandou construir ${nome}` };
    }
    const fracao = op.fracao ?? 0.25;
    const custo = custoDaObra(c, emp, fracao, e);
    somar(e, reg, emp.id, 'caixa', -custo, 'obra', 'mercado');
    mudarObra(e, c, reg, emp, (emp.n['capacidade'] ?? 0) * fracao, un);
    return { texto: `${aEmpresa(emp, 'A')} começou a obra d${nome.slice(0, 1) === 'a' ? 'a' : 'o'}${nome.slice(1)}, por ${formatarDinheiro(custo)}: mais ${Math.round(fracao * 100)}% de capacidade no ano que vem.`, resumo: `abriu ${nome}` };
  }
  const un = e.entidades[op.unidade]!;
  const emp = empresaDaUnidade(e, un)!;
  const nome = nomeDaUnidade(c, un);
  const giro = economiaDo(c.setores.get(emp.t['setor'] ?? '')).giro;
  if (op.tipo === 'fecharUnidade') {
    const venda = ehDeApoio(un) ? precoDaUnidade(e, c, un, VALOR_DE_VENDA_DOS_ATIVOS) : ((un.n['capacidade'] ?? 0) + (un.n['obra'] ?? 0)) * giro * VALOR_DE_VENDA_DOS_ATIVOS;
    tirarDaEmpresa(e, c, reg, emp, un, 'corte');
    if (venda >= 1) somar(e, reg, emp.id, 'caixa', venda, 'venda_de_ativos', 'mercado');
    apagarUnidade(e, reg, un);
    acertarSede(e, reg, emp, origem);
    return { texto: `${aEmpresa(emp, 'A')} fechou ${nome} e vendeu o que dava por ${formatarDinheiro(venda)}. Quem trabalhava lá recebeu a rescisão.`, resumo: `fechou ${nome}` };
  }
  if (op.tipo === 'venderUnidade') {
    const preco = precoDaUnidade(e, c, un, UNIDADES.vendaFuncionando);
    // A clientela que ela atendia vai com ela.
    const parte = (un.n['capacidade'] ?? 0) / Math.max(1e-9, emp.n['capacidade'] ?? 0);
    const clientes = (emp.n['demanda'] ?? 0) * parte;
    tirarDaEmpresa(e, c, reg, emp, un, 'venda');
    if (clientes > 0) somar(e, reg, emp.id, 'demanda', -clientes, 'venda');
    if (preco >= 1) somar(e, reg, emp.id, 'caixa', preco, 'venda_de_unidade', 'mercado');
    apagarUnidade(e, reg, un);
    acertarSede(e, reg, emp, origem);
    return { texto: `${aEmpresa(emp, 'A')} vendeu ${nome}, funcionando, por ${formatarDinheiro(preco)}. A clientela de lá foi junto com o novo dono.`, resumo: `vendeu ${nome}` };
  }
  // A transferência dentro do grupo: a de destino paga o valor contábil, caixa para caixa, e leva a capacidade, a obra
  // e a clientela que a unidade atendia (as duas pessoas jurídicas continuam separadas; a consolidação elimina o pagamento).
  const para = e.entidades[op.para]!;
  garantirUnidades(e, c, reg, para, origem);
  const preco = precoDaUnidade(e, c, un, VALOR_DE_VENDA_DOS_ATIVOS);
  if (preco >= 1) {
    somar(e, reg, para.id, 'caixa', -preco, 'transferencia', emp.id);
    somar(e, reg, emp.id, 'caixa', preco, 'transferencia', para.id);
  }
  if (!ehDeApoio(un)) {
    const parte = (un.n['capacidade'] ?? 0) / Math.max(1e-9, emp.n['capacidade'] ?? 0);
    const clientes = (emp.n['demanda'] ?? 0) * parte;
    for (const campo of ['capacidade', 'obra'] as const) {
      const v = un.n[campo] ?? 0;
      if (v === 0) continue;
      somar(e, reg, emp.id, campo, -v, 'transferencia');
      somar(e, reg, para.id, campo, v, 'transferencia');
    }
    if (clientes > 0) {
      somar(e, reg, emp.id, 'demanda', -clientes, 'transferencia');
      somar(e, reg, para.id, 'demanda', clientes, 'transferencia');
    }
  }
  moverUnidade(e, reg, un, para);
  acertarSede(e, reg, emp, origem);
  return { texto: `${nome.slice(0, 1).toUpperCase()}${nome.slice(1)} passou ${aEmpresa(emp, 'da')} para ${aEmpresa(para)}, por ${formatarDinheiro(preco)} de caixa para caixa.`, resumo: `transferiu ${nome} para ${aEmpresa(para)}` };
}

/** Tira da empresa a capacidade e a obra da unidade que fecha ou sai (a de apoio não mexe na capacidade). */
function tirarDaEmpresa(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, un: Entidade, motivo: string): void {
  if (ehDeApoio(un)) return;
  mudarCapacidade(e, c, reg, emp, -(un.n['capacidade'] ?? 0), motivo, un);
  if ((un.n['obra'] ?? 0) > 0) mudarObra(e, c, reg, emp, -(un.n['obra'] ?? 0), un);
}

/** "Fábrica de Campinas": o nome curto da unidade (a entidade guarda; o texto usa nomeDaUnidade, com o artigo). */
export function rotulo(c: Conteudo, un: Entidade): string {
  const f = formaDe(c, un.t['forma']);
  return `${f.nome.slice(0, 1).toUpperCase()}${f.nome.slice(1)} de ${un.t['cidade'] ?? '?'}`;
}
