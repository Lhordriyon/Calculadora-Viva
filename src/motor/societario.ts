/**
 * O societário (missão Capitalismo vivo, I-156 e I-157): a empresa como pessoa jurídica.
 *
 * - Toda empresa tem um número permanente (`registro`), que viaja com ela quando muda de lugar no grupo; a propriedade
 *   se escreve por ele: a controladora (`dona`: 'eu', '#<registro>', 'p<número da pessoa>' ou 'mercado') com a parte
 *   dela (`participacao`) e, se houver, uma segunda sócia (`socia`, `participacao_socia`); o resto do capital é do
 *   mercado (os minoritários dispersos).
 * - Os dividendos sobem pela propriedade: cada sócia recebe a parte dela, no caixa dela (a holding), na conta (quem
 *   joga, a pessoa) ou no mercado, sempre com os dois lados no mesmo lançamento.
 * - A holding é uma pessoa jurídica sem operação própria: vive dos dividendos das participações, paga a estrutura dela
 *   e distribui para cima; o valor guardado dela é o caixa, e as participações entram no patrimônio de quem joga pela
 *   parte efetiva de cada subsidiária (campos.ts › parteNaEmpresa), sem dupla contagem.
 * - Nenhum ciclo: uma empresa não pode ter parte, direta ou indireta, em quem tem parte nela.
 *
 * Os campos e as leituras ficam em campos.ts (donaDe, parteEfetiva, valorDasParticipacoes); aqui, o que muda o estado.
 */
import { donaDe, empresaDoRegistro, parteEfetiva, refDaEmpresa, todasAsEmpresas } from './campos.ts';
import { movimentar } from './economia.ts';
import { definirNumero, definirTexto, somar } from './livro.ts';
import { HOLDING } from './regras.ts';
import { ehDeApoio } from './unidades.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/**
 * O número permanente da empresa: a que ainda não tem (a de antes da propriedade escrita) ganha agora. É identidade,
 * como o nome e o número da pessoa: não muda depois, então não é uma variação do livro.
 */
export function garantirRegistro(e: EstadoVida, emp: Entidade): number {
  if (emp.registro !== undefined && emp.registro >= 1) return emp.registro;
  if (e.proximoRegistro === undefined) {
    let maior = 0;
    for (const x of Object.values(e.entidades)) if (x.tipo === 'empresa') maior = Math.max(maior, x.registro ?? 0);
    e.proximoRegistro = maior + 1;
  }
  emp.registro = e.proximoRegistro++;
  return emp.registro;
}

/** A entidade de quem é dono pela referência: quem joga, a empresa (pelo registro) ou a pessoa (pelo número); undefined para o mercado. */
export function entidadeDaDona(e: EstadoVida, ref: string): Entidade | undefined {
  if (ref === 'eu') return e.entidades['eu'];
  if (ref[0] === '#') return empresaDoRegistro(e, ref);
  if (ref[0] === 'p') {
    const n = Number(ref.slice(1));
    return Object.values(e.entidades).find((x) => x.tipo === 'pessoa' && x.pessoa === n && x.id !== 'eu');
  }
  return undefined;
}

/** A referência da pessoa pelo número dela (o dono de uma concorrente), ou o mercado quando ela não tem número. */
export function refDaPessoa(en: Entidade | undefined): string {
  return en?.pessoa !== undefined ? `p${en.pessoa}` : 'mercado';
}

/** Quem controla de fato: a controladora com mais da metade (ou com o acordo de acionistas), ou ninguém (o capital disperso, que o conselho representa). */
export function controladoraDe(emp: Entidade): string | null {
  const dona = donaDe(emp);
  if (dona === 'mercado') return null;
  return (emp.n['participacao'] ?? 1) > 0.5 || emp.q['acordo_de_acionistas'] ? dona : null;
}

/** A cadeia de controle sobe até `quem`? (A subsidiária da subsidiária da holding de quem joga é do grupo dele.) */
export function controladaPor(e: EstadoVida, emp: Entidade, quem = 'eu'): boolean {
  const vistas = new Set<string>();
  let x: Entidade | undefined = emp;
  while (x && !vistas.has(x.id)) {
    vistas.add(x.id);
    const c = controladoraDe(x);
    if (c === null) return false;
    if (c === quem) return true;
    x = c[0] === '#' ? empresaDoRegistro(e, c) : undefined;
  }
  return false;
}

/** Quantos degraus acima a empresa tem até quem controla o grupo (0 para a que quem joga tem direto): as de baixo fecham o ano antes, para o dividendo subir no mesmo ano. */
export function profundidade(e: EstadoVida, emp: Entidade): number {
  let n = 0;
  const vistas = new Set<string>();
  let x: Entidade | undefined = emp;
  while (x && !vistas.has(x.id)) {
    vistas.add(x.id);
    const d = donaDe(x);
    if (d[0] !== '#') return n;
    x = empresaDoRegistro(e, d);
    n++;
  }
  return n;
}

/**
 * Pôr `nova` como dona de `emp` formaria um ciclo? (A holding não pode ser subsidiária da própria subsidiária, nem por
 * uma participação indireta.) A empresa não pode ser dona dela mesma.
 */
export function formaCiclo(e: EstadoVida, emp: Entidade, nova: string): boolean {
  if (nova[0] !== '#') return false;
  const acima = empresaDoRegistro(e, nova);
  if (!acima) return false;
  if (acima.id === emp.id) return true;
  return parteEfetiva(e, acima, refDaEmpresa(emp)) > 0;
}

/** Muda quem controla a empresa, e a parte dela: o livro guarda a troca (é a propriedade que mudou de mão, não dinheiro). */
export function mudarDona(e: EstadoVida, reg: Mudanca[], emp: Entidade, dona: string, participacao: number): void {
  if (formaCiclo(e, emp, dona)) throw new Error(`a propriedade de ${emp.id} por ${dona} formaria um ciclo`);
  definirTexto(e, reg, emp.id, 'dona', dona);
  definirNumero(e, reg, emp.id, 'participacao', Math.max(0, Math.min(1 - (emp.n['participacao_socia'] ?? 0), participacao)));
}

/**
 * Paga o dividendo `total` pelos sócios, cada um pela parte dele: quem joga recebe na conta, a empresa dona no caixa, a
 * pessoa dona na conta dela e o mercado (os minoritários dispersos) fica com o resto. O caixa de quem paga e o de quem
 * recebe mudam no mesmo lançamento.
 */
export function pagarDividendos(e: EstadoVida, reg: Mudanca[], emp: Entidade, total: number): void {
  if (!(total >= 1)) return;
  const id = emp.id;
  const pares: [string, number][] = [[donaDe(emp), emp.n['participacao'] ?? 1]];
  if (emp.t['socia']) pares.push([emp.t['socia'], emp.n['participacao_socia'] ?? 0]);
  let pago = 0;
  for (const [dona, parte] of pares) {
    const v = total * Math.max(0, parte);
    if (v < 1 || dona === 'mercado') continue;
    const quem = entidadeDaDona(e, dona);
    if (!quem || quem.vivo === false) continue;
    if (dona === 'eu') {
      somar(e, reg, id, 'caixa', -v, 'dividendos', 'eu');
      movimentar(e, reg, { dinheiro: v, contraparte: id }, 'eu', 'dividendos');
    } else if (quem.tipo === 'empresa') {
      somar(e, reg, id, 'caixa', -v, 'dividendos', quem.id);
      somar(e, reg, quem.id, 'caixa', v, 'dividendos', id);
    } else {
      somar(e, reg, id, 'caixa', -v, 'dividendos', quem.id);
      somar(e, reg, quem.id, 'dinheiro', v, 'dividendos', id);
    }
    pago += v;
  }
  if (total - pago >= 1) somar(e, reg, id, 'caixa', -(total - pago), 'dividendos', 'mercado');
}

/** O que a empresa recebeu de dividendo das participações neste lançamento (o caixa que entrou marcado `dividendos`). */
function dividendosRecebidos(reg: readonly Mudanca[], id: string): number {
  let v = 0;
  for (const m of reg) if (m.c === `${id}.caixa` && m.r === 'dividendos' && (m.d ?? 0) > 0) v += m.d!;
  return v;
}

/**
 * O ano da holding (as subsidiárias fecharam o delas antes, e os dividendos já entraram no caixa): paga a estrutura
 * dela (o escritório, a auditoria, o conselho), distribui a parte do lucro que os sócios decidiram e o valor guardado
 * dela vira o caixa (as participações entram pela parte de cada subsidiária).
 */
export function anoDaHolding(e: EstadoVida, reg: Mudanca[], emp: Entidade): void {
  const id = emp.id;
  const recebido = dividendosRecebidos(reg, id);
  const custo = Math.min(Math.max(0, emp.n['caixa'] ?? 0), HOLDING.estrutura);
  if (custo >= 1) somar(e, reg, id, 'caixa', -custo, 'custos', 'mercado');
  const lucro = recebido - custo;
  definirNumero(e, reg, id, 'receita', recebido, 'negocio');
  definirNumero(e, reg, id, 'lucro', lucro, 'empresa');
  definirNumero(e, reg, id, 'impostos', 0, 'negocio');
  if (lucro > 0) pagarDividendos(e, reg, emp, Math.min(Math.max(0, emp.n['caixa'] ?? 0), lucro * (emp.n['retirada'] ?? 0)));
  definirNumero(e, reg, id, 'valor', Math.max(0, emp.n['caixa'] ?? 0), 'empresa');
}

/** As empresas de que esta é dona ou sócia (as participações dela), vivas. */
export function participadasDe(e: EstadoVida, emp: Entidade): Entidade[] {
  const ref = refDaEmpresa(emp);
  return todasAsEmpresas(e).filter((x) => donaDe(x) === ref || x.t['socia'] === ref);
}

/**
 * Os problemas da propriedade (invariantes.ts os junta aos outros): o registro único, a parte entre 0 e 1 e a soma das
 * sócias até 1, a dona que existe e está viva, nenhum ciclo, e a holding sem operação própria.
 */
export function conferirPropriedade(e: EstadoVida): string[] {
  const problemas: string[] = [];
  const registros = new Map<number, string>();
  const unidadesDaEmpresa = new Map<string, Entidade[]>();
  for (const u of Object.values(e.entidades)) {
    if (u.tipo !== 'unidade') continue;
    const ref = u.t['empresa'] ?? '';
    const dona = ref ? empresaDoRegistro(e, ref) : undefined;
    if (!dona || dona.vivo === false) problemas.push(`${u.id} é de uma empresa que não existe mais (${ref})`);
    for (const campo of ['capacidade', 'obra', 'porte']) if ((u.n[campo] ?? 0) < -0.5) problemas.push(`${u.id}.${campo} negativo`);
    if (ehDeApoio(u) && (u.n['capacidade'] ?? 0) !== 0) problemas.push(`${u.id} é de apoio e tem capacidade`);
    const lista = unidadesDaEmpresa.get(ref);
    if (lista) lista.push(u);
    else unidadesDaEmpresa.set(ref, [u]);
  }
  for (const emp of todasAsEmpresas(e)) {
    const r = emp.registro;
    if (r !== undefined) {
      if (registros.has(r)) problemas.push(`${emp.id} e ${registros.get(r)} têm o mesmo registro (${r})`);
      registros.set(r, emp.id);
    }
    const p = emp.n['participacao'] ?? 1;
    const ps = emp.n['participacao_socia'] ?? 0;
    if (p < -1e-9 || p > 1 + 1e-9 || ps < -1e-9 || p + ps > 1 + 1e-9) problemas.push(`${emp.id}: as partes (${p} e ${ps}) passam de 100% do capital`);
    for (const ref of [emp.t['dona'], emp.t['socia']]) {
      if (!ref || ref[0] !== '#') continue;
      const acima = empresaDoRegistro(e, ref);
      if (!acima || acima.vivo === false) problemas.push(`${emp.id}: a dona ${ref} não existe mais`);
    }
    if (emp.registro !== undefined && parteEfetiva(e, emp, refDaEmpresa(emp)) > 0) problemas.push(`${emp.id} tem parte nela mesma (um ciclo de propriedade)`);
    if (emp.q['holding'] && (emp.n['capacidade'] ?? 0) > 0) problemas.push(`${emp.id} é holding e tem capacidade própria`);
    // O valor guardado da holding é o caixa dela (as participações entram pela parte de cada subsidiária): sem isso, o
    // capital que ela pôs nas filhas contava duas vezes no patrimônio.
    // A unidade operacional não é subsidiária (unidades.ts): a capacidade da empresa é a soma das unidades que produzem,
    // a obra também, e a holding não tem unidade.
    const minhas = unidadesDaEmpresa.get(refDaEmpresa(emp)) ?? [];
    if (emp.vivo !== false && emp.registro !== undefined) {
      if (emp.q['holding'] && minhas.length > 0) problemas.push(`${emp.id} é holding e tem unidades operacionais`);
      if (!emp.q['holding'] && (emp.n['capacidade'] ?? 0) > 0 && !minhas.some((u) => !ehDeApoio(u))) problemas.push(`${emp.id} tem capacidade e nenhuma unidade que produz`);
      for (const campo of ['capacidade', 'obra'] as const) {
        if (minhas.length === 0) continue;
        const soma = minhas.reduce((s, u) => s + (ehDeApoio(u) ? 0 : (u.n[campo] ?? 0)), 0);
        const dela = emp.n[campo] ?? 0;
        if (Math.abs(soma - dela) > 1 + Math.abs(dela) * 1e-9) problemas.push(`${emp.id}: a ${campo} (${dela.toFixed(0)}) não é a soma das unidades (${soma.toFixed(0)})`);
      }
    }
    if (emp.q['holding'] && Math.abs((emp.n['valor'] ?? 0) - Math.max(0, emp.n['caixa'] ?? 0)) > 1 + Math.abs(emp.n['caixa'] ?? 0) * 1e-9) problemas.push(`${emp.id} é holding e o valor (${(emp.n['valor'] ?? 0).toFixed(0)}) não é o caixa (${(emp.n['caixa'] ?? 0).toFixed(0)})`);
  }
  return problemas;
}
