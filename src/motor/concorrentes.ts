/**
 * As concorrentes de verdade (missão Capitalismo vivo, I-159): nos setores em que o grupo de quem joga produz, a
 * concorrência é feita de empresas, não de um número.
 *
 * - Cada setor em que o grupo opera tem a concorrente principal (e, quando o lucro do setor chama, uma segunda, a que
 *   chegou): uma pessoa jurídica fora do grupo, com número, dono (a pessoa da rival, quando o setor é o da empresa que
 *   quem joga cuida de perto, ou o mercado, quando o capital é aberto), caixa, unidades, clientela, capacidade, preço,
 *   salário, qualidade, marca e verbas.
 * - Ela roda o mesmo ano do negócio que as empresas de quem joga (negocio.ts › anoDoNegocio): vende o que a capacidade
 *   dá conta, paga custos, imposto e o banco, distribui dividendos ao dono e quebra pela mesma regra (dois anos no
 *   prejuízo com o caixa que não pagou as contas no segundo).
 * - Ela decide pela mesma heurística do gestor e dos robôs (diretoria.ts › jogadasDoNegocio), no jeito do dono: a
 *   cautelosa cresce devagar e corta na sobra; a arriscada cresce na frente da fila, investe e vai ao premium. E reage a
 *   quem joga: atrás em atratividade, sobe o marketing e o P&D (o preço disso sai do caixa dela); contra o preço popular
 *   de quem atrai mais, entra na guerra de preços.
 * - A força da concorrente que o resto do motor e o conteúdo leem (empresa.concorrente, 50 é parelha) passa a ser a
 *   atratividade da principal; o que mexia nesse número (o gestor que vai para a concorrência, a oferta que falha) mexe
 *   na qualidade e na marca dela.
 * - O que o país compra do setor e nenhuma empresa modelada vende é o resto do mercado (os importados e os pequenos): as
 *   partes somam 100% (partesDoMercado).
 *
 * Fora dos setores do grupo, o mercado continua agregado (o save e a CPU por vida têm teto; limite declarado em I-159).
 */
import { donaDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { jeitoDoGestor, jogadasDoNegocio } from './diretoria.ts';
import { encerrarEmpresa, fundar } from './empresa.ts';
import { definirNumero, definirTexto, ganhar, perder, somar } from './livro.ts';
import { anoDoNegocio, atratividade, economiaDo, garraDaRival, mercadoDoSetor, motivoParaNaoOperarNegocio, operarNegocio, somarDemanda, type AnoDoNegocio, type OperacaoNegocio, ehOperacaoDeNegocio } from './negocio.ts';
import type { Momento } from './pais.ts';
import { aleatorio, criarRng, misturar, normal, sortear, type Rng } from './rng.ts';
import { CONCORRENCIA, DESVIO_TRACAO, REVERSAO_TRACAO, SORTE_DO_NEGOCIO, volatilidadeDaEmpresa } from './regras.ts';
import { controladaPor, proximoRegistro, refDaPessoa } from './societario.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';
import { unidadesDe } from './unidades.ts';
import { exteriorNaEmpresa } from './diplomacia.ts';

/** Até quantas concorrentes de verdade cada setor do grupo tem (a principal e a que chegou). */
export const CONCORRENTES_POR_SETOR = 2;

/** A empresa está no grupo de quem joga (a cadeia de controle chega nele)? */
export function noGrupo(e: EstadoVida, emp: Entidade): boolean {
  return donaDe(emp) === 'eu' || controladaPor(e, emp, 'eu');
}

/**
 * A empresa é de fora (uma concorrente): não ocupa lugar no grupo de quem joga (o id `empresaR<número>`). A empresa do
 * grupo que quem joga deixou de controlar (diluída na bolsa) continua no lugar dela, e é ele quem a toca.
 */
export function deFora(x: Entidade): boolean {
  return x.tipo === 'empresa' && x.id.startsWith('empresaR');
}

/** As empresas de fora que vendem no setor (as concorrentes), vivas e com negócio, das mais atraentes para as menos. */
export function concorrentesNoSetor(e: EstadoVida, setor: string | undefined): Entidade[] {
  const lista: Entidade[] = [];
  for (const x of Object.values(e.entidades)) {
    if (!deFora(x) || x.vivo === false || x.q['holding'] || x.n['capacidade'] === undefined || (x.t['setor'] ?? '') !== (setor ?? '')) continue;
    lista.push(x);
  }
  return lista.sort((a, b) => atratividade(b) - atratividade(a) || (b.n['demanda'] ?? 0) - (a.n['demanda'] ?? 0) || (a.registro ?? 0) - (b.registro ?? 0));
}

/** A concorrente principal de uma empresa do grupo (a mais atraente de fora no setor dela: a ameaça maior), se houver. */
export function principalDe(e: EstadoVida, emp: Entidade): Entidade | undefined {
  return concorrentesNoSetor(e, emp.t['setor'])[0];
}

/** As empresas de quem joga que produzem (as que têm concorrentes): as que ocupam um lugar no grupo. */
function doGrupoQueProduzem(e: EstadoVida): Entidade[] {
  return Object.values(e.entidades).filter((x) => x.tipo === 'empresa' && !deFora(x) && x.vivo !== false && !x.q['holding'] && x.n['capacidade'] !== undefined);
}

/** O sorteio das concorrentes não gasta o da vida: cada uma tem o dela, por ano. */
function sorteioDe(e: EstadoVida, chave: number): Rng {
  return criarRng(misturar(e.semente, e.ano, 9421, chave));
}

/**
 * A força da concorrente principal (50 é parelha), como o conteúdo e o resto do motor leem: a atratividade dela.
 * Sem concorrente de verdade, o número que a empresa guarda.
 */
export function forcaReal(e: EstadoVida, emp: Entidade): number {
  const p = principalDe(e, emp);
  return p ? Math.round(Math.max(0, Math.min(100, 50 * atratividade(p)))) : (emp.n['concorrente'] ?? 50);
}

/**
 * Mexe na força da concorrente (o gestor que vai para ela, a oferta hostil que falha, a compra que fecha o mercado):
 * com uma de verdade, a qualidade e a marca dela andam o mesmo tanto; sem, o número guardado. Depois, o número segue a
 * de verdade.
 */
export function mexerNaConcorrente(e: EstadoVida, reg: Mudanca[], emp: Entidade, delta: number): void {
  const p = principalDe(e, emp);
  if (p) {
    for (const campo of ['qualidade', 'marca']) definirNumero(e, reg, p.id, campo, Math.max(0, Math.min(100, (p.n[campo] ?? 50) + delta)), 'concorrencia');
    definirNumero(e, reg, emp.id, 'concorrente', forcaReal(e, emp), 'negocio');
  } else if (emp.n['concorrente'] !== undefined) {
    definirNumero(e, reg, emp.id, 'concorrente', Math.round(Math.max(0, Math.min(100, (emp.n['concorrente'] ?? 50) + delta))), 'negocio');
  }
}

/** O nome da concorrente: um modelo do setor com um sobrenome que não é o da família (pelo sorteio dela). */
function nomeDaConcorrente(e: EstadoVida, c: Conteudo, setor: string, rng: Rng): string {
  const s = c.setores.get(setor);
  const familia = e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
  const sobrenomes = c.mundo.sobrenomes.filter((x) => x !== familia);
  const usados = new Set(Object.values(e.entidades).filter((x) => x.tipo === 'empresa').map((x) => x.nome));
  for (let i = 0; i < 6; i++) {
    const nome = sortear(rng, s?.empresas ?? ['{sobrenome} & Cia.'])
      .replaceAll('{sobrenome}', sortear(rng, sobrenomes))
      .replaceAll('{nome}', sortear(rng, c.mundo.nomes.m))
      .replaceAll('{o|a}', 'o');
    if (!usados.has(nome)) return nome;
  }
  return `${sortear(rng, sobrenomes)} & Cia.`;
}

/**
 * Abre a concorrente do setor: do tamanho da maior empresa do grupo nele (de dois terços a uma vez e meia), com a força
 * `forca` (a qualidade e a marca), o capital vindo do mercado, a sede numa cidade do catálogo e o dono `dona` (a pessoa
 * da rival ou o mercado). O livro anota tudo, como na fundação de quem joga.
 */
export function abrirConcorrente(e: EstadoVida, c: Conteudo, reg: Mudanca[], setor: string, forca: number, origem: number, dona = 'mercado'): Entidade | null {
  const s = c.setores.get(setor);
  if (!s) return null;
  const eco = economiaDo(s);
  const rng = sorteioDe(e, 7 + (proximoRegistro(e) % 997));
  const doGrupo = doGrupoQueProduzem(e).filter((x) => x.t['setor'] === setor);
  const referencia = Math.max(200_000, ...doGrupo.map((x) => x.n['demanda'] ?? 0));
  // O mercado tem tamanho: a concorrente não passa do que sobra dele.
  const outras = Object.values(e.entidades).filter((x) => x.tipo === 'empresa' && x.vivo !== false && x.t['setor'] === setor).reduce((t, x) => t + (x.n['demanda'] ?? 0), 0);
  const cabe = Math.max(0, mercadoDoSetor(e, eco) * 0.9 - outras);
  const demanda = Math.min(cabe, referencia * Math.exp(normal(rng, 0, 0.25)) * (forca / 50));
  if (!(demanda > 10_000)) return null;
  const capacidade = demanda * 1.05;
  // O capital que compra essa estrutura (a fundação põe 70% em estrutura e deixa 30% no caixa).
  const capital = (capacidade * eco.giro) / 0.7;
  const id = `empresaR${proximoRegistro(e)}`;
  const emp = fundar(e, c, reg, { setor, valor: capital, de: 'mercado', dona, participacao: 1 }, origem, id, nomeDaConcorrente(e, c, setor, rng));
  if (!emp) return null;
  // Ela já existia antes de quem joga reparar: a clientela é a dela, e ela não depende de ninguém da vida.
  somarDemanda(e, c, reg, emp, Math.max(0, demanda - (emp.n['demanda'] ?? 0)));
  definirNumero(e, reg, id, 'dependencia', 0);
  for (const campo of ['qualidade', 'marca']) definirNumero(e, reg, id, campo, Math.max(5, Math.min(95, forca + normal(rng, 0, 3))), 'negocio');
  // A sede numa cidade do catálogo (o mesmo sorteio dela).
  const sede = unidadesDe(e, emp)[0];
  if (sede) {
    const cidade = sortear(rng, c.mundo.cidades).nome;
    definirTexto(e, reg, sede.id, 'cidade', cidade);
    sede.nome = sede.nome.replace(/ de .*$/, ` de ${cidade}`);
  }
  return emp;
}

/** O jeito de quem decide pela concorrente: o do dono (pelo traço, como o gestor) ou, com o capital aberto, o cauteloso do conselho. */
function jeitoDaConcorrente(e: EstadoVida, emp: Entidade): 'cautelosa' | 'arriscada' {
  const dona = donaDe(emp);
  if (dona[0] === 'p') {
    const n = Number(dona.slice(1));
    const pessoa = Object.values(e.entidades).find((x) => x.tipo === 'pessoa' && x.pessoa === n && x.id !== 'eu');
    if (pessoa) return jeitoDoGestor(pessoa);
  }
  return 'cautelosa';
}

/**
 * O ano de uma concorrente: o negócio anda (o mesmo de quem joga, sem a fama nem a mídia dele), a tração volta para a
 * do setor, e ela decide (a heurística do jeito dela, mais a reação a quem joga). Devolve o ano do negócio.
 */
export function anoDaConcorrente(e: EstadoVida, c: Conteudo, emp: Entidade, fase: Momento, reg: Mudanca[]): AnoDoNegocio {
  const id = emp.id;
  const setor = c.setores.get(emp.t['setor'] ?? '');
  const rng = sorteioDe(e, emp.registro ?? 0);
  const sorte = normal(rng, 0, volatilidadeDaEmpresa(emp.n['valor'] ?? 0) * (setor?.risco ?? 1) * SORTE_DO_NEGOCIO);
  const fora = exteriorNaEmpresa(e, c, emp.t['setor'] ?? '', fase.cambio ?? 0);
  const ano = anoDoNegocio(e, c, emp, fase, reg, fora, sorte);
  const alvo = setor?.tracao ?? 4;
  somar(e, reg, id, 'tracao', (alvo - (emp.n['tracao'] ?? 0)) * REVERSAO_TRACAO + normal(rng, 0, DESVIO_TRACAO), 'empresa');
  decidirConcorrente(e, c, emp, reg, rng);
  return ano;
}

/**
 * A concorrente decide: a reação a quem joga primeiro (atrás em atratividade de uma empresa do grupo no setor, sobe o
 * marketing e o P&D, com a garra do dono; com folga e prejuízo, volta ao normal), depois as jogadas do jeito dela.
 */
function decidirConcorrente(e: EstadoVida, c: Conteudo, emp: Entidade, reg: Mudanca[], rng: Rng): void {
  const id = emp.id;
  const fazer = (op: OperacaoNegocio): boolean => {
    if (motivoParaNaoOperarNegocio(e, c, op) !== null) return false;
    operarNegocio(e, c, op, reg, emp.nome);
    return true;
  };
  const doGrupo = doGrupoQueProduzem(e).filter((x) => x.t['setor'] === emp.t['setor']);
  const melhor = doGrupo.reduce((m, x) => Math.max(m, atratividade(x)), 0);
  const atras = melhor - atratividade(emp);
  const garra = doGrupo.reduce((g, x) => Math.max(g, garraDaRival(e, c, x)), 1);
  const mkt = emp.n['marketing'] ?? 0;
  const pd = emp.n['pd'] ?? 0;
  if (atras > 0.15 && aleatorio(rng) < Math.min(0.9, 0.5 * garra) && (mkt < 0.08 || pd < 0.08)) fazer({ tipo: 'verbas', empresa: id, marketing: Math.min(0.08, mkt + 0.03), pd: Math.min(0.08, pd + 0.03) });
  else if (atras < -0.1 && (emp.n['lucro'] ?? 0) < 0 && (mkt > 0.03 || pd > 0.03)) fazer({ tipo: 'verbas', empresa: id, marketing: 0.03, pd: 0.03 });
  for (const op of jogadasDoNegocio(jeitoDaConcorrente(e, emp), e, c, emp, rng, (o) => (ehOperacaoDeNegocio(o) ? motivoParaNaoOperarNegocio(e, c, o) === null : o.tipo === 'retirada'))) {
    if (op.tipo === 'retirada') {
      if (Math.abs((emp.n['retirada'] ?? 0) - op.fracao) > 1e-9) definirNumero(e, reg, id, 'retirada', op.fracao);
    } else if (ehOperacaoDeNegocio(op)) {
      // A concorrente não faz lobby: o lobby é de quem joga (a política de impostos tem dono no livro).
      if (op.tipo === 'lobby') continue;
      fazer(op);
    }
  }
}

/**
 * A guerra de preços entre uma empresa do grupo e a principal: a principal entra no preço popular (as duas cobram menos
 * enquanto dura), e quem atrai menos perde clientela no ano (8% da concorrente, 5% de quem joga). Devolve a vantagem.
 */
export function guerraComAPrincipal(e: EstadoVida, reg: Mudanca[], emp: Entidade, principal: Entidade, causa: number | null, comecou: boolean): number {
  const vantagem = atratividade(emp) - atratividade(principal);
  if (comecou) {
    ganhar(e, reg, principal.id, 'guerra', causa);
    if ((principal.t['preco'] ?? 'medio') !== 'popular') definirTexto(e, reg, principal.id, 'preco', 'popular');
  }
  if (vantagem > 0) somar(e, reg, principal.id, 'demanda', -(principal.n['demanda'] ?? 0) * (CONCORRENCIA.perdaNaGuerra / 100), 'guerra');
  else somar(e, reg, emp.id, 'demanda', -(emp.n['demanda'] ?? 0) * 0.05, 'guerra');
  return vantagem;
}

/** A guerra acabou: a principal sai dela e volta ao preço médio. */
export function fimDaGuerra(e: EstadoVida, reg: Mudanca[], principal: Entidade): void {
  if (principal.q['guerra']) perder(e, reg, principal.id, 'guerra');
  if (principal.t['preco'] === 'popular') definirTexto(e, reg, principal.id, 'preco', 'medio');
}

/**
 * O ano das concorrentes (depois do das empresas do grupo, que já reagiram a elas): todo setor em que o grupo produz
 * ganha a principal, se ainda não tem; cada concorrente de verdade anda o ano dela; a que fechou o segundo ano no
 * prejuízo sem caixa quebra (a clientela dela fica livre, e as empresas do grupo no setor ficam com uma parte); por
 * fim, a força guardada de cada empresa do grupo segue a principal dela.
 */
export function anoDasConcorrentes(e: EstadoVida, c: Conteudo, fase: Momento, reg: Mudanca[]): { imposto: number } {
  const grupo = doGrupoQueProduzem(e);
  const setores = [...new Set(grupo.map((x) => x.t['setor'] ?? ''))].filter((s) => c.setores.has(s));
  for (const s of setores) {
    if (concorrentesNoSetor(e, s).length > 0) continue;
    // A concorrente principal entra na história com a força que a empresa do grupo já enxergava nela; a causa é a
    // fundação da empresa do grupo no setor (foi quando quem joga entrou na briga).
    const daqui = grupo.filter((x) => x.t['setor'] === s);
    const forca = Math.round(daqui.reduce((m, x) => Math.max(m, x.n['concorrente'] ?? 50), 0) || 50);
    abrirConcorrente(e, c, reg, s, forca, daqui[0]?.q['fundada']?.causa ?? 0, donaDaRival(e, s));
  }
  donosEmDia(e, reg);
  let imposto = 0;
  // Só andam as concorrentes dos setores em que o grupo produz: as outras ficam fora do radar (o save e a CPU têm teto).
  const todas = Object.values(e.entidades).filter((x) => deFora(x) && x.vivo !== false && !x.q['holding'] && x.n['capacidade'] !== undefined && setores.includes(x.t['setor'] ?? ''));
  for (const x of todas.sort((a, b) => (a.registro ?? 0) - (b.registro ?? 0))) {
    const noVermelho = (x.n['lucro'] ?? 0) < 0;
    const ano = anoDaConcorrente(e, c, x, fase, reg);
    imposto += ano.imposto;
    if (noVermelho && ano.cortou > 0) quebrarConcorrente(e, c, reg, x);
  }
  caberNoMercado(e, c, reg);
  for (const emp of grupo) {
    if (emp.vivo === false || !principalDe(e, emp)) continue;
    const forca = forcaReal(e, emp);
    if (forca !== (emp.n['concorrente'] ?? 50)) definirNumero(e, reg, emp.id, 'concorrente', forca, 'negocio');
  }
  return { imposto };
}

/**
 * O mercado tem tamanho (o que o país compra do setor): se, depois do ano de todas, a clientela das empresas do setor
 * passa dele, quem cede é a concorrente (a de fora), na proporção da clientela de cada uma; só no que ainda sobrar, as
 * do grupo. Sem isso, a concorrente que cresceu depois das do grupo deixava o setor com mais clientes que o país.
 */
function caberNoMercado(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const porSetor = new Map<string, Entidade[]>();
  for (const x of Object.values(e.entidades)) {
    if (x.tipo !== 'empresa' || x.vivo === false || !((x.n['demanda'] ?? 0) > 0)) continue;
    const s = x.t['setor'] ?? '';
    const l = porSetor.get(s);
    if (l) l.push(x);
    else porSetor.set(s, [x]);
  }
  for (const [s, lista] of porSetor) {
    const total = lista.reduce((t, x) => t + (x.n['demanda'] ?? 0), 0);
    let excesso = total - mercadoDoSetor(e, economiaDo(c.setores.get(s)));
    if (!(excesso > 0)) continue;
    for (const fora of [true, false]) {
      const quem = lista.filter((x) => deFora(x) === fora);
      const delas = quem.reduce((t, x) => t + (x.n['demanda'] ?? 0), 0);
      if (!(delas > 0) || !(excesso > 0)) continue;
      const corte = Math.min(1, (excesso * (1 + 1e-9)) / delas);
      for (const x of quem) somar(e, reg, x.id, 'demanda', -(x.n['demanda'] ?? 0) * corte, 'mercado');
      excesso -= delas * corte;
    }
  }
}

/**
 * A concorrente quebra: fecha (as unidades junto), e as empresas do grupo no setor ficam com uma parte da clientela
 * (15% da delas, até onde o mercado comporta); a quebra fica nelas, com a guerra de causa quando houve guerra.
 */
export function quebrarConcorrente(e: EstadoVida, c: Conteudo, reg: Mudanca[], x: Entidade): void {
  const setor = x.t['setor'];
  const guerra = x.q['guerra'];
  encerrarEmpresa(e, reg, x.id);
  for (const emp of doGrupoQueProduzem(e)) {
    if (emp.t['setor'] !== setor) continue;
    somarDemanda(e, c, reg, emp, (emp.n['demanda'] ?? 0) * CONCORRENCIA.clientela);
    ganhar(e, reg, emp.id, 'concorrente_quebrou', emp.q['guerra']?.causa ?? guerra?.causa ?? null);
    if (emp.q['guerra']) perder(e, reg, emp.id, 'guerra');
  }
}

/** A parte de cada empresa no que o país compra do setor, e o resto (os importados e os pequenos): somam 1. */
export interface ParteDoMercado {
  id: string | null;
  nome: string;
  demanda: number;
  parte: number;
  doGrupo: boolean;
}

export function partesDoMercado(e: EstadoVida, c: Conteudo, setor: string): ParteDoMercado[] {
  const total = mercadoDoSetor(e, economiaDo(c.setores.get(setor)));
  const lista: ParteDoMercado[] = [];
  let soma = 0;
  for (const x of Object.values(e.entidades)) {
    if (x.tipo !== 'empresa' || x.vivo === false || (x.t['setor'] ?? '') !== setor || !((x.n['demanda'] ?? 0) > 0)) continue;
    const d = x.n['demanda'] ?? 0;
    soma += d;
    lista.push({ id: x.id, nome: x.nome, demanda: d, parte: d / total, doGrupo: !deFora(x) });
  }
  lista.sort((a, b) => b.demanda - a.demanda);
  lista.push({ id: null, nome: 'o resto do mercado (importados e pequenos)', demanda: Math.max(0, total - soma), parte: Math.max(0, total - soma) / total, doGrupo: false });
  return lista;
}

/**
 * O dono de cada concorrente segue a história: a pessoa que saiu da vida (ou morreu) deixa o capital no mercado, e a
 * rival de pé que ainda não tem a concorrente dela fica com a principal do setor dela (a que não tem dono).
 */
function donosEmDia(e: EstadoVida, reg: Mudanca[]): void {
  const pessoas = new Map<number, Entidade>();
  for (const x of Object.values(e.entidades)) if (x.tipo === 'pessoa' && x.pessoa !== undefined && x.id !== 'eu' && x.vivo !== false) pessoas.set(x.pessoa, x);
  for (const x of Object.values(e.entidades)) {
    if (!deFora(x) || x.vivo === false) continue;
    const d = donaDe(x);
    if (d[0] === 'p' && !pessoas.has(Number(d.slice(1)))) definirTexto(e, reg, x.id, 'dona', 'mercado');
  }
  const r = e.entidades['rival'];
  if (!r || r.vivo === false || r.pessoa === undefined) return;
  const ref = refDaPessoa(r);
  const lista = concorrentesNoSetor(e, r.t['setor']);
  if (lista.some((x) => donaDe(x) === ref)) return;
  const sem = lista.find((x) => donaDe(x) === 'mercado' && x.t['socia'] === undefined);
  if (!sem) return;
  definirTexto(e, reg, sem.id, 'dona', ref);
  if (r.t['negocio'] !== sem.nome) definirTexto(e, reg, 'rival', 'negocio', sem.nome);
}

/** A referência do dono para uma concorrente nova: a pessoa da rival, se ela estiver de pé e no mesmo setor. */
export function donaDaRival(e: EstadoVida, setor: string | undefined): string {
  const r = e.entidades['rival'];
  return r && r.vivo !== false && (r.t['setor'] ?? '') === (setor ?? '') ? refDaPessoa(r) : 'mercado';
}

/** Para o teste e a folha: a concorrente é de verdade (tem número e não é do grupo)? */
export function ehConcorrente(x: Entidade): boolean {
  return deFora(x) && x.vivo !== false;
}
