/**
 * As empresas de quem joga: entidades como as outras (`empresa.valor`,
 * `empresa.tracao`, `empresa.setor`), abertas com um setor e um capital, pela
 * folha Dinheiro ou por um storylet (o negócio que deu certo, o da família).
 *
 * Quem joga pode ter até MAX_EMPRESAS de uma vez. A que ele toca de perto é
 * `empresa` (a que o conteúdo chama de "a empresa": os eventos, as jogadas de
 * quem manda e o "Trabalhar" do ano vão para ela); as outras ficam em
 * `empresa2`…`empresa5`. Trocar a que ele toca é decisão dele; se ela sai da
 * vida, a maior das outras toma o lugar; se uma das outras afunda, ela vem
 * para a mesa dele (a quebra é um evento).
 *
 * Todo ano o valor de cada uma anda pela tração (o ritmo em que ela vem
 * crescendo, que muda devagar), pela fase do país conforme o setor sente o
 * ciclo e por sorte; a que está na bolsa anda também com o humor do mercado.
 * Pequena, ela balança muito; grande, balança menos e cresce mais devagar.
 * Da empresa sai, por ano, a retirada que o jogador escolhe (uma fração do
 * valor), na proporção da parte dele. Abaixo de um piso, ela quebra.
 *
 * O grupo: comprar uma concorrente a torna subsidiária (com as subsidiárias
 * dela); fundir duas empresas de quem joga faz da absorvida uma subsidiária
 * da outra. As subsidiárias estão dentro do valor; vender algumas dá dinheiro
 * sem largar o resto. Abrir o capital vende um pedaço na estreia, dá preço
 * todo dia e tira um pouco da empresa da mesa de quem manda.
 *
 * A parte de quem joga entra no patrimônio e na classe, mas não paga conta
 * sozinha: só vira dinheiro pela retirada ou pela venda.
 *
 * Quem manda pesa na proporção do quanto cada empresa depende dele
 * (`dependencia`): o talento conta mais, a morte custa valor e quem compra
 * desconta. E a mesa dele tem tamanho: o talento se divide entre as empresas
 * na medida em que elas dependem dele. Delegar (conselho, carta branca, sair
 * de cena, a bolsa) é decisão do jogador, com o que ela custa e o que causa.
 */
import { exteriorNaEmpresa } from './diplomacia.ts';
import { influenciaNegocios } from './influencia.ts';
import { momentoDoPais, type Momento } from './pais.ts';
import { empresasDe, entidadeDe, idadeDe, investidoDe, LUGARES_DE_EMPRESA, lerCaminho, parteNaEmpresa } from './campos.ts';
import { decidir, porqueDaResposta } from './decisao.ts';
import type { Ativo } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import type { AberturaEmpresa, DefSetor } from './esquema.ts';
import { anotarCaixa, caixaDe, movimentar, resgatarDe } from './economia.ts';
import { anotar, definirNumero, definirTexto, ganhar, lancar, novaEntrada, perder, somar, somarQualidade } from './livro.ts';
import { levarParaAEmpresa, novaEntidade, partir } from './pessoas.ts';
import {
  AQUISICOES_TRUSTE,
  CAPITAL_MINIMO_EMPRESA,
  CUSTO_AQUISICAO,
  DEPENDENCIA_INICIAL,
  DESCONTO_DA_DEPENDENCIA,
  DESVIO_TRACAO,
  FRACAO_NA_ESTREIA,
  GARGALO_DO_DONO,
  GOVERNANCA_DA_BOLSA,
  MAX_EMPRESAS,
  BOLSA,
  MINIMO_BOLSA,
  PERDA_SEM_DONO,
  PENALIDADE_PORTE,
  PESO_DA_BOLSA,
  PISO_EMPRESA,
  PORTE_GRANDE,
  PREMIO_DA_BOLSA,
  REVERSAO_TRACAO,
  SORTE_DO_NEGOCIO,
  SINERGIA_DA_FUSAO,
  TALENTO_MINIMO,
  TALENTO_TRACAO,
  TRACAO_DA_EQUIPE,
  TRACAO_DA_FUSAO,
  fracaoDeUmaSubsidiaria,
  precoDeVenda,
  subsidiariasDoRival,
  subsidiariasPorVenda,
  volatilidadeDaEmpresa,
} from './regras.ts';
import { aleatorio, normal, sortear } from './rng.ts';
import { anoDoNegocio, empregosDe, empregosNaCidade, entradaQueMudou, garantirFundamentos, garraDaRival, lobbyDoAno, ocupacaoDe, ofertaDe, precoDoSetor, somarDemanda, type AnoDoNegocio } from './negocio.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Genero, Mudanca } from './tipos.ts';

/** Qualidades de quem vive do próprio negócio: somem quando sai da vida a empresa que sustentava quem joga (e a renda dela junto). */
const DONO = ['empreendedor', 'socio', 'herdeiro_negocio'] as const;
/** O storylet que conta a quebra (agendado pela regra do ano). */
const QUEBRA = 'empresa_quebrou';
/** A empresa que quem joga toca de perto: é dela que o conteúdo fala. */
export const PRINCIPAL = 'empresa';

/** Os lugares das empresas: `empresa`, `empresa2`… */
export const SLOTS: readonly string[] = LUGARES_DE_EMPRESA;

export function empresaDe(e: EstadoVida, id = PRINCIPAL): Entidade | undefined {
  const emp = e.entidades[id];
  return emp && emp.tipo === 'empresa' && emp.vivo !== false ? emp : undefined;
}

/** Quanto a empresa depende de quem manda nela (0 a 1; 0 sem empresa). */
export function dependenciaDe(e: EstadoVida, id = PRINCIPAL): number {
  return (empresaDe(e, id)?.n['dependencia'] ?? 0) / 100;
}

/** O que quem compra desconta pela dependência: comprar uma empresa que depende do dono é comprar o dono junto, e ele não vem. Na bolsa, o mercado já pôs o preço. */
export function descontoDaDependencia(e: EstadoVida, id = PRINCIPAL): number {
  if (empresaDe(e, id)?.q['na_bolsa']) return 0;
  return DESCONTO_DA_DEPENDENCIA * dependenciaDe(e, id);
}

/** A mesa de quem manda: quanto as empresas, somadas, dependem dele (1 = uma empresa que depende inteira dele). */
export function cargaDaMesa(e: EstadoVida): number {
  let carga = 0;
  for (const emp of empresasDe(e)) carga += (emp.n['dependencia'] ?? 0) / 100;
  return carga;
}

/** Setores em que dá para abrir uma empresa (os que têm nomes de empresa nos dados). */
export function setoresDeEmpresa(c: Conteudo): DefSetor[] {
  return c.mundo.setores.filter((s) => (s.empresas?.length ?? 0) > 0);
}

/** O primeiro lugar livre para uma empresa nova (a principal, se quem joga não tem nenhuma), ou null com o grupo cheio. */
export function lugarLivre(e: EstadoVida): string | null {
  return SLOTS.find((id) => !empresaDe(e, id)) ?? null;
}

/** "Silva Tech", "Mercadinho da Ana": um nome do setor com o sobrenome da família. */
export function nomeDaEmpresa(e: EstadoVida, setor: DefSetor | undefined, sobrenome?: string): string {
  const eu = e.entidades['eu']!;
  const ultimo = sobrenome ?? e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
  const modelo = sortear(e.rng, setor?.empresas ?? ['{sobrenome} & Cia.', 'Grupo {sobrenome}']);
  return modelo
    .replaceAll('{sobrenome}', ultimo)
    .replaceAll('{nome}', eu.nome)
    .replaceAll('{o|a}', eu.genero === 'f' ? 'a' : 'o');
}

/** Um nome que nenhuma outra empresa de quem joga usa (duas "Silva Tech" no mesmo grupo confundem a história). */
function nomeNovo(e: EstadoVida, setor: DefSetor | undefined): string {
  const usados = new Set(empresasDe(e).map((x) => x.nome));
  let nome = nomeDaEmpresa(e, setor);
  for (let i = 0; i < 3 && usados.has(nome); i++) nome = nomeDaEmpresa(e, setor);
  return usados.has(nome) ? `${nome} ${empresasDe(e).length + 1}` : nome;
}

/**
 * O gênero do nome da empresa, para o artigo: o da primeira palavra
 * ("o Instituto Silva", "o Banco Silva", "a Clínica Silva"); com o sobrenome
 * ou o nome de quem joga na frente, é "a" empresa ("a Silva Tech").
 */
export function generoDoNome(e: EstadoVida, nome: string): Genero {
  const primeira = nome.split(' ')[0] ?? '';
  const sobrenome = e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
  if (primeira === sobrenome || primeira.startsWith(e.entidades['eu']!.nome)) return 'f';
  return /o$/i.test(primeira) ? 'm' : 'f';
}

const ARTIGOS = { a: ['o', 'a'], A: ['O', 'A'], da: ['do', 'da'], na: ['no', 'na'] } as const;

/** A empresa com o artigo certo: "a Clínica Silva", "do Instituto Silva", "No Grupo Silva". */
export function aEmpresa(emp: { nome: string; genero?: Genero | undefined }, forma: keyof typeof ARTIGOS = 'a'): string {
  return `${ARTIGOS[forma][emp.genero === 'm' ? 0 : 1]} ${emp.nome}`;
}

/** Dinheiro de quem joga, fora de empresa: o que dá para pôr numa (conta e investimentos). */
export function liquidoDe(e: EstadoVida): number {
  const eu = e.entidades['eu']!;
  return Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu);
}

/**
 * Tira até `valor` de quem joga e paga a `para` (a empresa, o mercado): da conta e depois dos investimentos (o mais
 * fácil de vender primeiro). Devolve quanto saiu.
 */
export function tirarDeQuemJoga(e: EstadoVida, reg: Mudanca[], valor: number, para: string): number {
  const n = e.entidades['eu']!.n;
  const antes = caixaDe(n);
  const daConta = Math.min(Math.max(0, n['dinheiro'] ?? 0), Math.max(0, valor));
  n['dinheiro'] = (n['dinheiro'] ?? 0) - daConta;
  const dosInvestimentos = resgatarDe(n, valor - daConta);
  anotarCaixa(reg, 'eu', antes, n, undefined, [{ campo: 'dinheiro', d: -(daConta + dosInvestimentos), p: para }]);
  return daConta + dosInvestimentos;
}

interface Fundacao {
  setor: string;
  valor: number;
  participacao?: number | undefined;
  tracao?: number | undefined;
  /** De onde veio o capital (quem joga, outra pessoa, o mercado): a contraparte do caixa que nasce. */
  de?: string | undefined;
}

/** A empresa nasce no lugar `id` (o valor já veio de algum lugar): tudo vai para o livro, e a fundação vira a causa do que ela causar. */
function fundar(e: EstadoVida, c: Conteudo, reg: Mudanca[], f: Fundacao, origem: number, id: string): Entidade | null {
  if (empresaDe(e, id) || !(f.valor > 0)) return null;
  const setor = c.setores.get(f.setor);
  const nome = nomeNovo(e, setor);
  const emp = novaEntidade({ id, tipo: 'empresa', nome, genero: generoDoNome(e, nome), nascimento: e.ano, vivo: true });
  e.entidades[id] = emp;
  definirTexto(e, reg, id, 'setor', setor?.id ?? 'comercio');
  somar(e, reg, id, 'valor', f.valor);
  somar(e, reg, id, 'tracao', f.tracao ?? setor?.tracao ?? 4);
  somar(e, reg, id, 'participacao', f.participacao ?? 1);
  // Nasce dependendo de quem abriu; com sócios, eles dividem o comando.
  somar(e, reg, id, 'dependencia', DEPENDENCIA_INICIAL * (f.participacao ?? 1));
  ganhar(e, reg, id, 'fundada', origem);
  // O capital vira negócio: uma parte compra a estrutura (a loja, a máquina), o resto fica no caixa.
  garantirFundamentos(e, c, reg, emp, f.valor, f.de ?? 'mercado');
  return emp;
}

/** O efeito `abrirEmpresa` de um storylet: abre "a empresa" (a que quem joga toca). Devolve o valor com que ela nasceu (0 se já havia uma). */
export function abrirPorEfeito(e: EstadoVida, c: Conteudo, reg: Mudanca[], a: AberturaEmpresa, ator: string | undefined, origem: number): number {
  if (empresaDe(e)) return 0;
  const setor = a.setor ?? String(lerCaminho(e, a.copiarSetor ?? '', ator) ?? '');
  let valor = a.valor ?? 0;
  let origemDoCapital = 'mercado';
  if (a.capital !== undefined) {
    valor = tirarDeQuemJoga(e, reg, a.capital, PRINCIPAL);
    origemDoCapital = 'eu';
  }
  if (a.fracao !== undefined) {
    const de = entidadeDe(a.de ?? 'eu', ator);
    if (de === 'eu') {
      valor = tirarDeQuemJoga(e, reg, liquidoDe(e) * a.fracao, PRINCIPAL);
    } else {
      valor = Math.max(0, e.entidades[de]?.n['dinheiro'] ?? 0) * a.fracao;
      somar(e, reg, de, 'dinheiro', -valor, undefined, PRINCIPAL);
    }
    origemDoCapital = de;
  }
  const setorValido = c.setores.has(setor) ? setor : 'comercio';
  return fundar(e, c, reg, { setor: setorValido, valor, participacao: a.participacao, tracao: a.tracao, de: origemDoCapital }, origem, PRINCIPAL) ? valor : 0;
}

/** O contrato grande, o escândalo, a crise do setor: a demanda (os clientes) e o valor andam juntos. */
export function multiplicarEmpresa(e: EstadoVida, c: Conteudo, reg: Mudanca[], fator: number, id = PRINCIPAL): void {
  const emp = empresaDe(e, id);
  if (!emp) return;
  somar(e, reg, id, 'valor', (emp.n['valor'] ?? 0) * (fator - 1));
  if (emp.n['demanda'] !== undefined) somarDemanda(e, c, reg, emp, (emp.n['demanda'] ?? 0) * (fator - 1));
}

/** O negócio cresce `fracao` de uma vez (a concorrente comprada traz a estrutura e os clientes dela). */
function crescerNegocio(e: EstadoVida, c: Conteudo, reg: Mudanca[], id: string, fracao: number): void {
  const emp = empresaDe(e, id);
  if (!emp || !(fracao > 0)) return;
  if (emp.n['capacidade'] !== undefined) somar(e, reg, id, 'capacidade', (emp.n['capacidade'] ?? 0) * fracao, 'negocio');
  // A estrutura dela vem inteira; os clientes, até onde o mercado comporta.
  if (emp.n['demanda'] !== undefined) somarDemanda(e, c, reg, emp, (emp.n['demanda'] ?? 0) * fracao);
}

/** Investidores compram `parte` da empresa pelo valor de agora: o dinheiro deles entra nela, e a parte de quem joga encolhe. Devolve quanto entrou. */
export function rodadaDeInvestimento(e: EstadoVida, reg: Mudanca[], parte: number, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp) return 0;
  const valor = emp.n['valor'] ?? 0;
  const entrou = valor * (parte / (1 - parte));
  somar(e, reg, id, 'valor', entrou);
  // O dinheiro dos investidores entra no caixa: é dele que sai a obra que a rodada promete.
  somar(e, reg, id, 'caixa', entrou, 'rodada', 'mercado');
  somar(e, reg, id, 'participacao', -(emp.n['participacao'] ?? 1) * parte);
  return entrou;
}

// ---------------------------------------------------------------- mudar de lugar (no livro)

/** Leva a empresa do lugar `de` para o lugar `para` (vazio): o livro tira tudo de um e põe no outro. */
function mover(e: EstadoVida, reg: Mudanca[], de: string, para: string): void {
  const en = e.entidades[de]!;
  // Mudar de lugar no grupo não é dinheiro trocando de mão: as mudanças vão marcadas `papel` (o caixa vai junto).
  for (const [campo, v] of Object.entries(en.n)) {
    anotar(reg, `${de}.${campo}`, -v, 'papel');
    anotar(reg, `${para}.${campo}`, v, 'papel');
  }
  for (const [campo, v] of Object.entries(en.t)) reg.push({ c: `${para}.${campo}`, t: v });
  for (const q of Object.keys(en.q)) reg.push({ c: `${de}.${q}`, q: -1 }, { c: `${para}.${q}`, q: 1 });
  e.entidades[para] = { ...en, id: para };
  delete e.entidades[de];
}

/** Troca duas empresas de lugar (a que quem joga toca e outra): o livro anota a diferença de cada campo e qualidade. */
function trocar(e: EstadoVida, reg: Mudanca[], a: string, b: string): void {
  const ea = e.entidades[a]!;
  const eb = e.entidades[b]!;
  for (const campo of new Set([...Object.keys(ea.n), ...Object.keys(eb.n)])) {
    const d = (eb.n[campo] ?? 0) - (ea.n[campo] ?? 0);
    anotar(reg, `${a}.${campo}`, d, 'papel');
    anotar(reg, `${b}.${campo}`, -d, 'papel');
  }
  for (const [campo, v] of Object.entries(eb.t)) if (ea.t[campo] !== v) reg.push({ c: `${a}.${campo}`, t: v });
  for (const [campo, v] of Object.entries(ea.t)) if (eb.t[campo] !== v) reg.push({ c: `${b}.${campo}`, t: v });
  for (const q of new Set([...Object.keys(ea.q), ...Object.keys(eb.q)])) {
    const va = ea.q[q]?.v;
    const vb = eb.q[q]?.v;
    if (va === undefined) reg.push({ c: `${a}.${q}`, q: 1 }, { c: `${b}.${q}`, q: -1 });
    else if (vb === undefined) reg.push({ c: `${a}.${q}`, q: -1 }, { c: `${b}.${q}`, q: 1 });
    else if (va !== vb) {
      anotar(reg, `${a}.${q}`, vb - va);
      anotar(reg, `${b}.${q}`, va - vb);
    }
  }
  e.entidades[a] = { ...eb, id: a };
  e.entidades[b] = { ...ea, id: b };
}

/**
 * Sem a empresa que quem joga toca, a maior das outras (ou a `preferida`)
 * toma o lugar dela. Roda no fim da entrada que fechou, vendeu ou fundiu a
 * principal, depois do texto (que ainda fala da que saiu), e no começo do ano.
 */
export function reorganizarGrupo(e: EstadoVida, reg: Mudanca[], preferida?: string): void {
  if (empresaDe(e)) return;
  const outras = empresasDe(e);
  if (outras.length === 0) return;
  const escolhida = (preferida ? empresaDe(e, preferida) : undefined) ?? outras.reduce((a, b) => (parteNaEmpresa(e, b.id) > parteNaEmpresa(e, a.id) ? b : a));
  mover(e, reg, escolhida.id, PRINCIPAL);
}

/**
 * A empresa sai da vida de quem joga: o livro zera o que ela tinha. Se ela
 * sustentava quem joga (qualidade `sustenta`: a renda era o salário de dono),
 * a renda e o jeito de trabalhar de dono vão junto, a menos que `sustento`
 * diga para qual empresa ele passa. Fica só o nome (o texto da venda ainda
 * fala dela), sem setor nem qualidades; se era a que quem joga tocava, a
 * maior das outras toma o lugar no fim da entrada (reorganizarGrupo).
 */
function encerrar(e: EstadoVida, reg: Mudanca[], id = PRINCIPAL, sustento?: { para: string; origem: number }): void {
  const emp = e.entidades[id];
  if (!emp) return;
  const sustentava = Boolean(emp.q['sustenta']);
  // O caixa que sobrou paga quem a empresa devia (a rescisão, o fornecedor) ou vai junto com quem a comprou.
  const caixa = emp.n['caixa'] ?? 0;
  if (caixa !== 0) reg.push({ c: `${id}.caixa`, d: -caixa, r: 'encerramento', p: 'mercado' });
  for (const [campo, v] of Object.entries(emp.n)) if (v !== 0 && campo !== 'caixa') reg.push({ c: `${id}.${campo}`, d: -v });
  for (const q of Object.keys(emp.q)) reg.push({ c: `${id}.${q}`, q: -1 });
  emp.n = {};
  emp.t = {};
  emp.q = {};
  emp.vivo = false;
  emp.morte = e.ano;
  if (sustentava && sustento) ganhar(e, reg, sustento.para, 'sustenta', sustento.origem);
  else if (sustentava) {
    for (const q of DONO) perder(e, reg, 'eu', q);
    definirNumero(e, reg, 'eu', 'renda', 0);
  }
}

/** Vende esta fração da parte de quem joga, pelo valor de agora vezes o prêmio, menos o desconto da dependência. Vendeu tudo, a empresa sai da vida. Devolve o preço. */
export function venderParte(e: EstadoVida, reg: Mudanca[], fracao: number, premio = 1, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp) return 0;
  const parte = emp.n['participacao'] ?? 1;
  const vendida = parte * Math.min(1, Math.max(0, fracao));
  const preco = Math.max(0, emp.n['valor'] ?? 0) * vendida * premio * (1 - descontoDaDependencia(e, id));
  if (preco > 0) movimentar(e, reg, { dinheiro: preco, contraparte: 'mercado' });
  if (parte - vendida < 0.005) encerrar(e, reg, id);
  else somar(e, reg, id, 'participacao', -vendida);
  return preco;
}

/** A empresa fecha as portas: volta para quem joga a fração `sobra` da parte dele. Devolve quanto voltou. */
export function fecharEmpresa(e: EstadoVida, reg: Mudanca[], sobra: number, id = PRINCIPAL): number {
  if (!empresaDe(e, id)) return 0;
  const volta = parteNaEmpresa(e, id) * sobra;
  if (volta > 0) {
    // A sobra sai do caixa da empresa e, no que faltar, de quem compra o que ela tinha (o mercado).
    const doCaixa = Math.min(volta, Math.max(0, empresaDe(e, id)!.n['caixa'] ?? 0));
    if (doCaixa > 0) {
      movimentar(e, reg, { dinheiro: doCaixa, contraparte: id });
      somar(e, reg, id, 'caixa', -doCaixa, 'encerramento', 'eu');
    }
    if (volta - doCaixa > 0) movimentar(e, reg, { dinheiro: volta - doCaixa, contraparte: 'mercado' });
  }
  encerrar(e, reg, id);
  return volta;
}

/** Vende subsidiárias (uma, até dez; depois, um décimo delas, ou `quantas`): sai a fatia delas do valor, e a parte de quem joga vira dinheiro. */
export function venderSubsidiarias(e: EstadoVida, reg: Mudanca[], premio: number, id = PRINCIPAL, quantas?: number): { preco: number; vendidas: number } {
  const emp = empresaDe(e, id);
  const subs = emp?.n['subsidiarias'] ?? 0;
  if (!emp || subs < 1) return { preco: 0, vendidas: 0 };
  const vendidas = Math.min(subs, quantas ?? subsidiariasPorVenda(subs));
  const fracao = vendidas * fracaoDeUmaSubsidiaria(subs);
  const fatia = Math.max(0, emp.n['valor'] ?? 0) * fracao;
  somar(e, reg, id, 'valor', -fatia);
  // A subsidiária vendida leva a estrutura e os clientes dela.
  for (const campo of ['capacidade', 'demanda']) if (emp.n[campo] !== undefined) somar(e, reg, id, campo, -(emp.n[campo] ?? 0) * Math.min(1, fracao), 'negocio');
  somar(e, reg, id, 'subsidiarias', -vendidas);
  const preco = fatia * (emp.n['participacao'] ?? 1) * premio;
  if (preco > 0) movimentar(e, reg, { dinheiro: preco, contraparte: 'mercado' });
  return { preco, vendidas };
}

/**
 * A empresa vai para a bolsa: passa a valer mais (tem preço todo dia), quem
 * joga vende um pedaço da parte dele na estreia, pelo preço da fase do país,
 * e ela depende menos dele (conselho, auditoria, balanço público). Devolve o
 * que a venda na estreia rendeu.
 */
export function abrirCapital(e: EstadoVida, reg: Mudanca[], origem: number, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp || emp.q['na_bolsa']) return 0;
  somar(e, reg, id, 'valor', (emp.n['valor'] ?? 0) * PREMIO_DA_BOLSA);
  ganhar(e, reg, id, 'na_bolsa', origem);
  somar(e, reg, id, 'dependencia', -GOVERNANCA_DA_BOLSA);
  return venderParte(e, reg, FRACAO_NA_ESTREIA, precoDeVenda(momentoDoPais(e).empresa), id);
}

// ---------------------------------------------------------------- o ano das empresas

/** O que a bolsa rendeu além do esperado para a fase: o humor do mercado no ano (0 sem o mercado do ano). */
function humorDaBolsa(c: Conteudo, fase: Momento, mercado: Partial<Record<Ativo, number>> | undefined): number {
  const acoes = c.mundo.ativos.find((a) => a.id === 'acoes');
  const rendeu = mercado?.acoes;
  return acoes && rendeu !== undefined ? rendeu - acoes.retorno[fase.id] : 0;
}

/**
 * O ano de uma empresa (negocio.ts): o negócio anda (a demanda, as vendas, os custos, o imposto, o caixa, os
 * dividendos, a qualidade, a marca e o valor pelos fundamentos); na bolsa, o valor anda também com o humor do
 * mercado; e a tração (o momento do negócio, que a demanda segue) volta devagar para a do setor.
 */
function anoDaEmpresa(e: EstadoVida, c: Conteudo, emp: Entidade, fase: Momento, reg: Mudanca[], carga: number, humor: number): AnoDoNegocio {
  const id = emp.id;
  const n = emp.n;
  const setor = c.setores.get(emp.t['setor'] ?? '');
  garantirFundamentos(e, c, reg, emp);
  const valor = n['valor'] ?? 0;
  const tracao = n['tracao'] ?? 0;
  const sorte = normal(e.rng, 0, volatilidadeDaEmpresa(valor) * (setor?.risco ?? 1) * SORTE_DO_NEGOCIO);
  // O mundo lá fora: o dólar (quem exporta ganha, quem importa perde), a tarifa na fronteira e a sanção ou o acordo de quem compra do setor.
  const fora = exteriorNaEmpresa(e, c, emp.t['setor'] ?? '', fase.cambio ?? 0);
  const ano = anoDoNegocio(e, c, emp, fase, reg, fora, sorte);
  if (emp.q['na_bolsa'] && humor !== 0) somar(e, reg, id, 'valor', (n['valor'] ?? 0) * PESO_DA_BOLSA * humor, 'bolsa');
  definirNumero(e, reg, id, 'ocupacao', Math.min(10, ocupacaoDe(e, c, emp)), 'negocio');
  definirNumero(e, reg, id, 'funcionarios', Math.min(3_000_000, empregosDe(c, emp)), 'negocio');
  const alvo = alvoDaTracao(e, c, emp, carga);
  somar(e, reg, id, 'tracao', (alvo - tracao) * REVERSAO_TRACAO + normal(e.rng, 0, DESVIO_TRACAO), 'empresa');
  return ano;
}

/**
 * A sanção que um país de fora impôs fecha o mercado de quem exportava para lá: a notícia vem no ano da sanção (ou no
 * seguinte), com a sanção de causa (a decisão que levou até ela está no porquê dela).
 */
function exportacaoBarrada(e: EstadoVida, emp: Entidade): void {
  const para = emp.t['exporta'];
  const pais = para ? e.entidades[para] : undefined;
  const sancao = pais?.q['sancao'];
  if (!pais || !sancao || sancao.ano < e.ano - 1 || e.historico.some((h) => h.ref === 'regra:exportacao_barrada' && h.ano >= sancao.ano && h.instancia === `regra:exportacao_barrada#${emp.id}`)) return;
  const texto = `A sanção ${pais.genero === 'f' ? 'da' : 'do'} ${pais.nome} fechou o mercado ${aEmpresa(emp, 'da')}: os containers voltaram para o pátio, e a demanda de lá sumiu da planilha.`;
  lancar(
    e,
    novaEntrada(e, {
      tipo: 'mundo',
      causa: 'regra',
      ref: 'regra:exportacao_barrada',
      instancia: `regra:exportacao_barrada#${emp.id}`,
      texto,
      resumo: `a sanção fechou o mercado lá fora ${aEmpresa(emp, 'da')}`,
      ...(sancao.causa !== null ? { causas: [sancao.causa] } : {}),
    }),
    [],
  );
}

/**
 * Para onde a tração da empresa volta: a do setor, mais o talento de quem
 * manda (na proporção da dependência, dividido pela mesa dele), a equipe, as
 * portas que a influência abre e a tecnologia do país, menos o freio do tamanho.
 */
export function alvoDaTracao(e: EstadoVida, c: Conteudo, emp: Entidade, carga = cargaDaMesa(e)): number {
  const n = emp.n;
  const setor = c.setores.get(emp.t['setor'] ?? '');
  // Quanto mais a empresa depende de quem manda, mais o talento dele (ou a falta) pesa; a que anda sozinha tem o ritmo da equipe.
  // A mesa tem tamanho: com várias empresas dependendo dele, o talento se divide entre elas.
  const dependencia = (n['dependencia'] ?? 0) / 100;
  const inteligencia = (e.entidades['eu']!.n['inteligencia'] ?? 50) - 50;
  const talento = (inteligencia * TALENTO_TRACAO * (TALENTO_MINIMO + (1 - TALENTO_MINIMO) * dependencia)) / Math.max(1, carga);
  const equipe = TRACAO_DA_EQUIPE * (1 - dependencia);
  // Crescer trava com o tamanho, e trava mais quando tudo passa pela mesa de quem manda.
  const porte = PENALIDADE_PORTE * Math.max(0, Math.log10(Math.max(1, n['valor'] ?? 0) / PORTE_GRANDE)) * (1 + GARGALO_DO_DONO * (dependencia - 0.5));
  // Influência abre portas (contrato, crédito, fornecedor): até +2 pontos de tração.
  const portas = Math.min(2, (e.entidades['eu']!.n['influencia'] ?? 0) / 40);
  // O país que pesquisa puxa quem vive de inovar (a tecnologia, mais; a saúde, a indústria e o agro, menos): pesquisa.ts.
  const pesquisa = (setor?.pesquisa ?? 0) * ((e.entidades['pais']?.n['tecnologia'] ?? 50) - 50);
  return (setor?.tracao ?? 4) + talento + equipe + portas + pesquisa - porte;
}

/**
 * O ano das empresas de quem joga. Abaixo do piso, a quebra fica agendada,
 * com a fundação como causa; se a que afunda não é a que quem joga toca, ela
 * vem para a mesa dele (é dela que o evento fala).
 */
export function regraDaEmpresa(e: EstadoVida, c: Conteudo, fase: Momento, reg: Mudanca[], mercado?: Partial<Record<Ativo, number>>): void {
  reorganizarGrupo(e, reg);
  // O lobby contratado (ou a regra sob medida) pode baixar os impostos do país (negocio.ts).
  lobbyDoAno(e, c);
  ofertaContraVoce(e, c);
  const empresas = empresasDe(e);
  if (empresas.length === 0) return;
  const carga = cargaDaMesa(e);
  const humor = humorDaBolsa(c, fase, mercado);
  let antes = 0;
  let depois = 0;
  let impostos = 0;
  /** As que fecharam o segundo ano seguido no prejuízo sem caixa para pagar as contas (venderam estrutura): a falência. */
  const insolventes = new Set<string>();
  for (const emp of empresas) {
    const noVermelho = emp.n['capacidade'] !== undefined && (emp.n['lucro'] ?? 0) < 0;
    const ano = anoDaEmpresa(e, c, emp, fase, reg, carga, humor);
    if (noVermelho && ano.cortou > 0) insolventes.add(emp.id);
    antes += ano.empregosAntes;
    depois += ano.empregosDepois;
    impostos += ano.imposto;
    exportacaoBarrada(e, emp);
  }
  // Os empregos que as empresas abriram e fecharam mexem no desemprego da cidade (o trabalho de quem joga e o da família leem).
  empregosNaCidade(e, reg, antes, depois);
  // O imposto que elas pagaram entra no Tesouro e baixa a dívida pública (em pontos do PIB).
  const pib = e.entidades['pais']?.n['pib'] ?? 0;
  if (impostos > 0 && pib > 0) somar(e, reg, 'pais', 'divida', -(impostos / pib) * 100, 'impostos_das_empresas');
  if (!c.porId.has(QUEBRA) || e.agenda.some((a) => a.evento === QUEBRA)) return;
  // Afunda a empresa que não pagou as contas dois anos seguidos, a que ficou sem estrutura ou a que está abaixo do piso de valor.
  const afundando = empresasDe(e).find((x) => insolventes.has(x.id) || (x.n['valor'] ?? 0) < PISO_EMPRESA || (x.n['capacidade'] !== undefined && (x.n['capacidade'] ?? 0) < PISO_EMPRESA));
  if (!afundando) return;
  if (afundando.id !== PRINCIPAL) trocar(e, reg, PRINCIPAL, afundando.id);
  e.agenda.push({ evento: QUEBRA, ano: e.ano, origem: e.entidades[PRINCIPAL]!.q['fundada']?.causa ?? null });
}

/**
 * Quem manda morreu: cada empresa perde valor na proporção do quanto dependia
 * dele (o que só ele sabia, os clientes que eram dele, a assinatura que
 * ninguém mais tinha). As entradas ficam no livro com a morte como causa.
 */
export function semQuemManda(e: EstadoVida, morte: number): void {
  for (const emp of empresasDe(e)) {
    const perda = PERDA_SEM_DONO * dependenciaDe(e, emp.id);
    if (perda < 0.005) continue;
    const reg: Mudanca[] = [];
    // A perda vale inteira (o teto do mercado só segura ganho): o valor e os clientes encolhem juntos.
    somar(e, reg, emp.id, 'valor', -(emp.n['valor'] ?? 0) * perda);
    if (emp.n['demanda'] !== undefined) somar(e, reg, emp.id, 'demanda', -(emp.n['demanda'] ?? 0) * perda, 'negocio');
    const pct = Math.round(perda * 100);
    const texto = `Sem você, ${aEmpresa(emp)} perdeu ${pct}% do valor: ${perda >= 0.2 ? 'tudo passava pela sua mesa' : 'quase tudo já andava sem você'}.`;
    lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'empresa:sem_dono', texto, resumo: `${aEmpresa(emp)} perdeu ${pct}% do valor sem você`, causas: [morte] }), reg);
  }
}

// ---------------------------------------------------------------- operações do jogador (folha Dinheiro)

/** Em todas, `empresa` é o lugar da empresa (sem ele, a que quem joga toca). */
export type OperacaoEmpresa =
  /** Abre uma empresa com este capital (da conta e, se faltar, dos investimentos). */
  | { tipo: 'abrir'; setor: string; valor: number }
  /** Põe mais dinheiro na empresa. */
  | { tipo: 'aportar'; valor: number; empresa?: string }
  /** Quanto do lucro do ano sai para os donos como dividendo (RETIRADAS). */
  | { tipo: 'retirada'; fracao: number; empresa?: string }
  /** Vende a parte de quem joga, pelo preço da fase do país. */
  | { tipo: 'vender'; empresa?: string }
  /** Compra uma concorrente, que vira subsidiária (uma compra por ano); três compras fazem um truste. */
  | { tipo: 'adquirir'; empresa?: string }
  /** Vende subsidiárias (uma, até dez; depois, um décimo delas). */
  | { tipo: 'venderSubsidiaria'; empresa?: string }
  /** A empresa absorve outra de quem joga, que vira subsidiária dela. */
  | { tipo: 'fundir'; empresa?: string; com: string }
  /** Leva a empresa para a bolsa. */
  | { tipo: 'abrirCapital'; empresa?: string }
  | { tipo: 'emitir'; empresa?: string }
  | { tipo: 'recomprar'; empresa?: string }
  | { tipo: 'opa'; empresa?: string }
  /** Passa a tocar esta de perto (a que tocava fica com a diretoria). */
  | { tipo: 'cuidar'; empresa: string };

const TIPOS_DE_EMPRESA = new Set(['abrir', 'aportar', 'retirada', 'vender', 'adquirir', 'venderSubsidiaria', 'fundir', 'abrirCapital', 'cuidar', 'emitir', 'recomprar', 'opa']);

export function ehOperacaoDeEmpresa(op: { tipo: string }): op is OperacaoEmpresa {
  return TIPOS_DE_EMPRESA.has(op.tipo);
}

/** O preço da parte de quem joga se vender agora, e por quê: o prêmio (ou o desconto) da fase do país e o desconto da dependência. */
export function vendaDaParte(e: EstadoVida, id = PRINCIPAL): { preco: number; fase: number; desconto: number } {
  const fase = precoDeVenda(momentoDoPais(e).empresa);
  const desconto = descontoDaDependencia(e, id);
  return { preco: parteNaEmpresa(e, id) * fase * (1 - desconto), fase, desconto };
}

/** O que a venda das próximas subsidiárias renderia agora, e quantas sairiam. */
export function vendaDeSubsidiarias(e: EstadoVida, id = PRINCIPAL): { preco: number; vendidas: number } {
  const emp = empresaDe(e, id);
  const subs = emp?.n['subsidiarias'] ?? 0;
  if (!emp || subs < 1) return { preco: 0, vendidas: 0 };
  const vendidas = subsidiariasPorVenda(subs);
  return { preco: parteNaEmpresa(e, id) * vendidas * fracaoDeUmaSubsidiaria(subs) * precoDeVenda(momentoDoPais(e).empresa), vendidas };
}

/** O que a venda de um pedaço da parte de quem joga na estreia da bolsa renderia agora. */
export function vendaNaEstreia(e: EstadoVida, id = PRINCIPAL): number {
  return parteNaEmpresa(e, id) * (1 + PREMIO_DA_BOLSA) * FRACAO_NA_ESTREIA * precoDeVenda(momentoDoPais(e).empresa);
}

/** Na recessão e na crise, ninguém compra ação nova. */
function janelaDaBolsa(e: EstadoVida): boolean {
  const id = momentoDoPais(e).id;
  return id === 'normal' || id === 'expansao';
}

export function motivoParaNaoOperarEmpresa(e: EstadoVida, c: Conteudo, op: OperacaoEmpresa): string | null {
  if (e.idade < 18) return 'só a partir dos 18 anos';
  if (op.tipo === 'abrir') {
    if (!lugarLivre(e)) return `já são ${MAX_EMPRESAS} empresas; venda ou junte duas antes`;
    if (!setoresDeEmpresa(c).some((s) => s.id === op.setor)) return 'escolha o ramo';
    if (!(op.valor >= CAPITAL_MINIMO_EMPRESA)) return `o mínimo para abrir é ${formatarDinheiro(CAPITAL_MINIMO_EMPRESA)}`;
    if (op.valor > liquidoDe(e) + 0.5) return 'não há tanto dinheiro';
    return null;
  }
  const id = op.empresa ?? PRINCIPAL;
  const emp = empresaDe(e, id);
  if (!emp) return id === PRINCIPAL ? 'você não tem empresa' : 'essa empresa não é mais sua';
  if (op.tipo === 'aportar') {
    if (!(op.valor >= 1)) return 'escolha quanto pôr';
    if (op.valor > liquidoDe(e) + 0.5) return 'não há tanto dinheiro';
  }
  if (op.tipo === 'retirada' && Math.abs((emp.n['retirada'] ?? 0) - op.fracao) < 1e-9) return 'já é assim';
  if (op.tipo === 'adquirir') {
    if ((emp.n['valor'] ?? 0) < MINIMO_AQUISICAO) return `a empresa precisa valer ${formatarDinheiro(MINIMO_AQUISICAO)}`;
    if (custoDaAquisicao(e, id) > liquidoDe(e) + 0.5) return `precisa de ${formatarDinheiro(custoDaAquisicao(e, id))}`;
    if (fezNoAno(e, 'empresa:adquirir')) return 'uma tentativa por ano';
  }
  // A bolsa de verdade (bloco H7): emitir, recomprar e a oferta hostil são jogadas de quem está na bolsa.
  if ((op.tipo === 'emitir' || op.tipo === 'recomprar' || op.tipo === 'opa') && !emp.q['na_bolsa']) return 'só com a empresa na bolsa';
  if (op.tipo === 'emitir' && fezNoAno(e, 'empresa:emitir')) return 'uma emissão por ano';
  if (op.tipo === 'recomprar') {
    if ((emp.n['participacao'] ?? 1) >= BOLSA.controle) return 'a maioria já é sua';
    if (custoDaRecompra(e, id) > liquidoDe(e) + 0.5) return `precisa de ${formatarDinheiro(custoDaRecompra(e, id))}`;
  }
  if (op.tipo === 'opa') {
    const dono = e.entidades['rival'];
    if (id !== PRINCIPAL || !dono || dono.vivo === false) return 'a concorrência não tem dono à vista';
    if ((emp.n['valor'] ?? 0) < MINIMO_AQUISICAO) return `a empresa precisa valer ${formatarDinheiro(MINIMO_AQUISICAO)}`;
    if (custoDaOpa(e, id) > liquidoDe(e) + 0.5) return `precisa de ${formatarDinheiro(custoDaOpa(e, id))}`;
    if (ofertaRecente(e)) return `uma oferta a cada ${BOLSA.anosEntreOfertas} anos`;
  }
  if (op.tipo === 'venderSubsidiaria' && (emp.n['subsidiarias'] ?? 0) < 1) return 'ela não tem subsidiárias';
  if (op.tipo === 'fundir') {
    if (op.com === id || !empresaDe(e, op.com)) return 'escolha outra empresa sua';
    if (e.agenda.some((a) => a.evento === QUEBRA)) return 'uma das empresas está no osso';
  }
  if (op.tipo === 'abrirCapital') {
    if (emp.q['na_bolsa']) return 'ela já está na bolsa';
    if ((emp.n['valor'] ?? 0) < MINIMO_BOLSA) return `a empresa precisa valer ${formatarDinheiro(MINIMO_BOLSA)}`;
    if (!janelaDaBolsa(e)) return 'na recessão, ninguém compra ação nova';
  }
  if (op.tipo === 'cuidar') {
    if (id === PRINCIPAL) return 'você já cuida desta';
    if (e.agenda.some((a) => a.evento === QUEBRA)) return 'a que você toca está no osso';
  }
  return null;
}

/** Já fez esta operação neste ano (as operações ficam no livro). */
function fezNoAno(e: EstadoVida, ref: string): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano === e.ano; i--) if (e.historico[i]!.ref === ref) return true;
  return false;
}

/** Empresa que vale menos que isto ainda não compra ninguém. */
export const MINIMO_AQUISICAO = 1_000_000;

/** O preço de uma concorrente: uma fração do valor da própria empresa. */
export function custoDaAquisicao(e: EstadoVida, id = PRINCIPAL): number {
  return (empresaDe(e, id)?.n['valor'] ?? 0) * CUSTO_AQUISICAO * precoDaAquisicao(e, id);
}

/**
 * O preço do dia de uma concorrente, como fração do justo: o preço do setor (na sobra, todo mundo vende barato) vezes a
 * força dela (a concorrente fraca, de 25, sai por 80%; a forte, de 75, por 120%).
 */
export function precoDaAquisicao(e: EstadoVida, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp) return 1;
  // Quem tem nome no mercado negocia melhor (até 20% a menos).
  return precoDoSetor(ofertaDe(e, emp.t['setor'])) * (0.6 + (0.8 * (emp.n['concorrente'] ?? 50)) / 100) * (1 - influenciaNegocios(e) / 500);
}

/** Põe dinheiro de quem joga na empresa: o valor sobe e, com sócios, a parte de quem joga também. */
/** O dinheiro de quem joga entra na empresa (no caixa, ou na concorrente que ela comprou): o valor e a parte dele crescem. */
function porNaEmpresa(e: EstadoVida, c: Conteudo, reg: Mudanca[], id: string, valor: number, ganho: number, noCaixa: boolean): void {
  const emp = empresaDe(e, id)!;
  const antes = emp.n['valor'] ?? 0;
  const parte = emp.n['participacao'] ?? 1;
  somar(e, reg, id, 'valor', ganho);
  if (noCaixa) somar(e, reg, id, 'caixa', valor, 'aporte', 'eu');
  else crescerNegocio(e, c, reg, id, antes > 0 ? ganho / antes : 0);
  if (parte < 1) somar(e, reg, id, 'participacao', (parte * antes + valor) / (antes + ganho) - parte);
}

const RETIRADA_TEXTO = (fracao: number): string =>
  fracao <= 0 ? 'reinvestir todo o lucro' : `tirar ${Math.round(fracao * 100)}% do lucro de dividendo`;

const ORDINAL = ['', 'primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta'];

const subsidiariasTexto = (n: number): string => (n === 1 ? 'uma subsidiária' : `${n.toLocaleString('pt-BR')} subsidiárias`);

/** Faz a operação (já conferida) e devolve o texto e o resumo da entrada. */
/** Recomprar a maioria (bloco H7): o que falta para 51% da empresa, pelo valor de agora com o prêmio de quem vende. */
export function custoDaRecompra(e: EstadoVida, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp) return 0;
  return Math.max(0, emp.n['valor'] ?? 0) * Math.max(0, BOLSA.controle - (emp.n['participacao'] ?? 1)) * (1 + BOLSA.premioRecompra);
}

/** Quem joga compra de volta, de quem tem as ações, o que falta para a maioria; o valor da empresa não muda, só o dono. Devolve o que pagou. */
export function recomprar(e: EstadoVida, reg: Mudanca[], id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  const falta = Math.max(0, BOLSA.controle - (emp?.n['participacao'] ?? 1));
  if (!emp || falta <= 0) return 0;
  const pago = tirarDeQuemJoga(e, reg, custoDaRecompra(e, id), 'mercado');
  somar(e, reg, id, 'participacao', falta);
  return pago;
}

/** A oferta hostil pela concorrente (bloco H7): o preço do dia dela, com o prêmio que convence os acionistas a vender. */
export function custoDaOpa(e: EstadoVida, id = PRINCIPAL): number {
  return custoDaAquisicao(e, id) * (1 + BOLSA.premioHostil);
}

/**
 * A chance da oferta hostil: os acionistas vendem pelo prêmio, a influência de negócios de quem joga ajuda, e o dono
 * briga pelo traço e pela mágoa (a garra dele); a concorrente cara (o setor em alta, ela forte) segura melhor.
 */
export function chanceDaOpa(e: EstadoVida, c: Conteudo, id = PRINCIPAL): number {
  const emp = empresaDe(e, id);
  if (!emp || !e.entidades['rival']) return 0;
  const chance = 0.45 + influenciaNegocios(e) / 300 - (garraDaRival(e, c, emp) - 1) * 0.25 - (precoDaAquisicao(e, id) > 1 ? 0.1 : 0);
  return Math.min(0.9, Math.max(0.1, chance));
}

/** Houve oferta hostil nos últimos anos? (uma a cada três) */
function ofertaRecente(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano > e.ano - BOLSA.anosEntreOfertas; i--) if (e.historico[i]!.ref === 'empresa:opa') return true;
  return false;
}

/** As histórias da oferta contra quem joga (só pela agenda): a da dona da concorrente e a de um fundo de fora. */
export const OFERTAS_CONTRA = ['a_opa_da_rival', 'a_opa_do_fundo'] as const;

/**
 * A oferta contra quem joga (bloco H7): com a empresa de perto na bolsa e menos da metade das ações nas mãos de quem
 * joga, alguém pode comprar o controle: a dona da concorrente (seis vezes em dez, quando há uma) ou um fundo de fora. A oferta vem no ano, pela
 * agenda (a história com as três respostas), e aponta a entrada que levou a parte de quem joga abaixo da metade.
 */
export function ofertaContraVoce(e: EstadoVida, c: Conteudo): void {
  const emp = empresaDe(e);
  if (!emp?.q['na_bolsa'] || (emp.n['participacao'] ?? 1) >= 0.5) return;
  if (e.agenda.some((a) => (OFERTAS_CONTRA as readonly string[]).includes(a.evento))) return;
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano > e.ano - BOLSA.anosEntreOfertas; i--) if ((OFERTAS_CONTRA as readonly string[]).includes(e.historico[i]!.ref ?? '')) return;
  const chance = BOLSA.chanceContraVoce + ((emp.n['concorrente'] ?? 50) >= 60 ? BOLSA.rivalForte : 0);
  if (aleatorio(e.rng) >= chance) return;
  const rival = e.entidades['rival'];
  const origem = entradaQueMudou(e, 'empresa.participacao');
  // Quem compra: a dona da concorrente, quando há uma (seis em dez), ou um fundo de fora.
  const daRival = rival !== undefined && rival.vivo !== false && c.porId.has('a_opa_da_rival') && aleatorio(e.rng) < BOLSA.daRival;
  e.agenda.push(daRival ? { evento: 'a_opa_da_rival', ano: e.ano, origem, ator: 'rival' } : { evento: 'a_opa_do_fundo', ano: e.ano, origem });
}

/** O tamanho do pedido de compra para o dono (o `ajuste` da decisão): a concorrente fraca vende mais fácil, a forte, menos. */
export function ajusteDaVenda(emp: Entidade): number {
  const forca = emp.n['concorrente'] ?? 50;
  return forca < 40 ? 1 : forca > 65 ? -1 : 0;
}

export function operarEmpresa(e: EstadoVida, c: Conteudo, op: OperacaoEmpresa, reg: Mudanca[], origem: number): { texto: string; resumo: string; causas?: number[] } {
  if (op.tipo === 'abrir') {
    const lugar = lugarLivre(e)!;
    const valor = tirarDeQuemJoga(e, reg, op.valor, lugar);
    const emp = fundar(e, c, reg, { setor: op.setor, valor, de: 'eu' }, origem, lugar)!;
    const ramo = c.setores.get(op.setor)?.nome ?? op.setor;
    const quantas = empresasDe(e).length;
    const qual = quantas > 1 ? `, a sua ${ORDINAL[quantas] ?? 'nova'} empresa` : '';
    return { texto: `Abriu ${aEmpresa(emp)}${qual}, de ${ramo}, com ${formatarDinheiro(valor)}.`, resumo: `abriu ${aEmpresa(emp)} com ${formatarDinheiro(valor)}` };
  }
  const id = op.empresa ?? PRINCIPAL;
  const emp = empresaDe(e, id)!;
  if (op.tipo === 'aportar') {
    // Dinheiro novo de quem joga aumenta a parte dele (os outros sócios não puseram nada).
    const valor = tirarDeQuemJoga(e, reg, op.valor, id);
    porNaEmpresa(e, c, reg, id, valor, valor, true);
    return { texto: `Pôs ${formatarDinheiro(valor)} ${aEmpresa(emp, 'na')}.`, resumo: `pôs ${formatarDinheiro(valor)} na própria empresa` };
  }
  if (op.tipo === 'adquirir' || op.tipo === 'opa') {
    // A oferta hostil (bloco H7) compra pela bolsa, sem pedir ao dono, com o prêmio aos acionistas.
    const hostil = op.tipo === 'opa';
    // Quem vende é o dono (bloco H6): ele decide pelo que lembra de quem joga (a guerra de preços magoa) e pela força da
    // concorrente (a fraca vende mais fácil). O não fica no livro, com o porquê, e a tentativa do ano acabou.
    const dono = id === PRINCIPAL && e.entidades['rival']?.vivo !== false ? e.entidades['rival'] : undefined;
    if (dono && hostil && aleatorio(e.rng) >= chanceDaOpa(e, c, id)) {
      // A oferta que falha custa os bancos e os advogados, e os acionistas ficam com o dono: a concorrência sai mais unida.
      const perdido = tirarDeQuemJoga(e, reg, custoDaOpa(e, id) * BOLSA.custoDaOferta, 'mercado');
      if (emp.n['concorrente'] !== undefined) definirNumero(e, reg, id, 'concorrente', Math.min(100, (emp.n['concorrente'] ?? 50) + BOLSA.forcaQueFica), 'negocio');
      somar(e, reg, 'rival', 'magoa', BOLSA.magoaDaOferta);
      return {
        texto: `A oferta hostil por ${dono.t['negocio'] ?? 'a concorrente'} não passou: os acionistas ficaram com ${dono.nome}. Os bancos e os advogados custaram ${formatarDinheiro(perdido)}, e a concorrência saiu mais unida.`,
        resumo: `perdeu a oferta hostil pela concorrente de ${dono.nome}`,
      };
    }
    if (dono && !hostil) {
      const d = decidir(e, c, 'rival', 'aceitar', undefined, ajusteDaVenda(emp));
      if (aleatorio(e.rng) >= d.chance) {
        const pq = porqueDaResposta(e, c, 'rival', 'aceitar', d, false);
        return {
          texto: `${dono.nome} não quis vender a ${dono.t['negocio'] ?? 'concorrente'}, ${pq.texto}.`,
          resumo: `ouviu um não de ${dono.nome} pela concorrente`,
          ...(pq.entrada !== undefined ? { causas: [pq.entrada] } : {}),
        };
      }
    }
    // A concorrente vale mais dentro da empresa (clientes, marca, menos briga de preço) e o mercado fica mais fechado.
    // O negócio que entra vale o preço justo; o que se paga é o do dia (barato na baixa, caro na alta).
    const justo = (emp.n['valor'] ?? 0) * CUSTO_AQUISICAO;
    const custo = tirarDeQuemJoga(e, reg, hostil ? custoDaOpa(e, id) : custoDaAquisicao(e, id), 'mercado');
    // Pagar o preço justo não cria valor sozinho: o ganho vem do mercado mais fechado (tração), que o tempo desfaz.
    porNaEmpresa(e, c, reg, id, custo, justo * 0.95, false);
    somar(e, reg, id, 'tracao', 2);
    // O mercado fica mais fechado: a concorrente principal perde força.
    if (emp.n['concorrente'] !== undefined) definirNumero(e, reg, id, 'concorrente', Math.max(0, (emp.n['concorrente'] ?? 50) - 15), 'negocio');
    // Ela vira subsidiária, com as subsidiárias que já tinha.
    const delas = subsidiariasDoRival(custo);
    somar(e, reg, id, 'subsidiarias', 1 + delas);
    const rival = dono?.t['negocio'] ?? nomeDaEmpresa(e, c.setores.get(emp.t['setor'] ?? ''), sortear(e.rng, c.mundo.sobrenomes));
    // O dono fica para tocar o negócio (o gestor), se a cadeira está vaga e ele está em idade de trabalhar; senão, sai de cena.
    let fica = '';
    if (dono) {
      if (!hostil && !e.entidades['gestor'] && idadeDe(e, dono) < 67) {
        levarParaAEmpresa(e, 'rival', 'gestor', reg);
        fica = ` ${dono.nome} ficou para tocar o negócio com você.`;
      } else {
        partir(e, 'rival', reg);
        if (hostil) fica = ` ${dono.nome} saiu do conselho sem apertar a sua mão.`;
      }
    }
    somarQualidade(e, reg, id, 'aquisicoes', 1, origem);
    const truste = (emp.q['aquisicoes']?.v ?? 0) >= AQUISICOES_TRUSTE && ganhar(e, reg, id, 'truste', origem);
    if (truste) somar(e, reg, id, 'tracao', 5);
    const junto = delas > 0 ? `, com ${delas === 1 ? 'a subsidiária' : `as ${delas.toLocaleString('pt-BR')} subsidiárias`} dela` : '';
    const fim = truste ? ' Com essa, metade do mercado tem o seu sobrenome: é um truste, e o governo vai reparar.' : '';
    return {
      texto: hostil
        ? `A oferta hostil deu certo: ${aEmpresa(emp)} comprou ${rival} na bolsa${junto}, por ${formatarDinheiro(custo)}, com o prêmio aos acionistas.${fica}${fim}`
        : `${aEmpresa(emp, 'A')} comprou a concorrente ${rival}${junto}, por ${formatarDinheiro(custo)}.${fica}${fim}`,
      resumo: truste ? `montou um truste com ${aEmpresa(emp)}` : hostil ? `tomou a concorrente ${rival} numa oferta hostil` : `comprou a concorrente ${rival}`,
    };
  }
  if (op.tipo === 'emitir') {
    const entrou = rodadaDeInvestimento(e, reg, BOLSA.emissao, id);
    return {
      texto: `${aEmpresa(emp, 'A')} emitiu ações novas e levantou ${formatarDinheiro(entrou)} na bolsa, direto para o caixa. A sua parte caiu para ${Math.round((emp.n['participacao'] ?? 1) * 100)}%.`,
      resumo: `emitiu ações ${aEmpresa(emp, 'da')} na bolsa`,
    };
  }
  if (op.tipo === 'recomprar') {
    const pago = recomprar(e, reg, id);
    return {
      texto: `Você recomprou ações ${aEmpresa(emp, 'da')} na bolsa, por ${formatarDinheiro(pago)}, e voltou a ter mais da metade: o controle é seu.`,
      resumo: `recomprou o controle ${aEmpresa(emp, 'da')}`,
    };
  }
  if (op.tipo === 'venderSubsidiaria') {
    const { preco, vendidas } = venderSubsidiarias(e, reg, precoDeVenda(momentoDoPais(e).empresa), id);
    const qual = vendidas === 1 ? `a subsidiária ${nomeDaEmpresa(e, c.setores.get(emp.t['setor'] ?? ''), sortear(e.rng, c.mundo.sobrenomes))}` : `${vendidas} subsidiárias`;
    return { texto: `${aEmpresa(emp, 'A')} vendeu ${qual} por ${formatarDinheiro(preco)}.`, resumo: `vendeu ${vendidas === 1 ? 'uma subsidiária' : `${vendidas} subsidiárias`} ${aEmpresa(emp, 'da')}` };
  }
  if (op.tipo === 'fundir') return fundir(e, c, reg, id, op.com, origem);
  if (op.tipo === 'abrirCapital') {
    const venda = abrirCapital(e, reg, origem, id);
    return {
      texto: `${aEmpresa(emp, 'A')} estreou na bolsa. Você vendeu um pedaço da sua parte por ${formatarDinheiro(venda)}, e a empresa ganhou conselho, auditoria e gente que nunca a viu por dentro dando palpite.`,
      resumo: `levou ${aEmpresa(emp)} para a bolsa`,
    };
  }
  if (op.tipo === 'cuidar') {
    const antes = empresaDe(e)!;
    const deixou = aEmpresa(antes);
    trocar(e, reg, PRINCIPAL, id);
    return { texto: `Passou a cuidar de perto ${aEmpresa(emp, 'da')}; ${deixou} ficou com a diretoria.`, resumo: `passou a cuidar de perto ${aEmpresa(emp, 'da')}` };
  }
  if (op.tipo === 'retirada') {
    definirNumero(e, reg, id, 'retirada', op.fracao);
    return { texto: `Decidiu ${RETIRADA_TEXTO(op.fracao)} ${aEmpresa(emp, 'da')}.`, resumo: `decidiu ${RETIRADA_TEXTO(op.fracao)} da empresa` };
  }
  const vendida = aEmpresa(emp);
  const preco = venderParte(e, reg, 1, precoDeVenda(momentoDoPais(e).empresa), id);
  ganhar(e, reg, 'eu', 'vendeu_empresa', origem);
  reorganizarGrupo(e, reg);
  const agora = id === PRINCIPAL && empresaDe(e) ? ` Agora você cuida de perto ${aEmpresa(empresaDe(e)!, 'da')}.` : '';
  return { texto: `Vendeu ${vendida} por ${formatarDinheiro(preco)}.${agora}`, resumo: `vendeu ${vendida} por ${formatarDinheiro(preco)}` };
}

/**
 * A empresa `alvo` absorve a `absorvida`, que vira subsidiária dela: os
 * valores se somam, com o ganho da fusão no mesmo ramo (ou o desconto de
 * conglomerado em ramos diferentes) e sorte; a parte de quem joga, a
 * dependência e a tração viram a média pelo valor. Em ramos diferentes, a
 * empresa vira o grupo da família.
 */
function fundir(e: EstadoVida, c: Conteudo, reg: Mudanca[], alvo: string, absorvida: string, origem: number): { texto: string; resumo: string } {
  const a = empresaDe(e, alvo)!;
  const b = empresaDe(e, absorvida)!;
  const comoA = { nome: a.nome, genero: a.genero };
  const comoB = { nome: b.nome, genero: b.genero };
  const va = Math.max(0, a.n['valor'] ?? 0);
  const vb = Math.max(0, b.n['valor'] ?? 0);
  const soma = va + vb;
  const media = (campo: string, padrao: number): number => (soma > 0 ? ((a.n[campo] ?? padrao) * va + (b.n[campo] ?? padrao) * vb) / soma : (a.n[campo] ?? padrao));
  const mesmoRamo = a.t['setor'] === b.t['setor'];
  const sinergia = (mesmoRamo ? SINERGIA_DA_FUSAO.mesmoRamo : SINERGIA_DA_FUSAO.outroRamo) + normal(e.rng, 0, SINERGIA_DA_FUSAO.desvio);
  definirNumero(e, reg, alvo, 'participacao', media('participacao', 1));
  definirNumero(e, reg, alvo, 'dependencia', media('dependencia', 0));
  definirNumero(e, reg, alvo, 'tracao', media('tracao', 0) + (mesmoRamo ? TRACAO_DA_FUSAO : 0));
  definirNumero(e, reg, alvo, 'valor', soma * (1 + sinergia));
  // O negócio da absorvida vem junto: o caixa (dinheiro trocando de mão dentro do grupo), a estrutura, a obra e os
  // clientes (a sinergia mexe na demanda); a qualidade e a marca viram a média pelo valor.
  const caixaDela = b.n['caixa'] ?? 0;
  if (caixaDela !== 0) {
    somar(e, reg, absorvida, 'caixa', -caixaDela, 'fusao', alvo);
    somar(e, reg, alvo, 'caixa', caixaDela, 'fusao', absorvida);
  }
  for (const campo of ['capacidade', 'obra']) if ((b.n[campo] ?? 0) > 0) somar(e, reg, alvo, campo, b.n[campo]!, 'negocio');
  // Os clientes da absorvida passam a ser da que fica (a dela zera antes, para o mercado contar uma vez só).
  const clientesDela = b.n['demanda'] ?? 0;
  if (clientesDela > 0) {
    somar(e, reg, absorvida, 'demanda', -clientesDela, 'fusao');
    somarDemanda(e, c, reg, a, clientesDela * (1 + sinergia));
  }
  for (const campo of ['qualidade', 'marca']) if (a.n[campo] !== undefined || b.n[campo] !== undefined) definirNumero(e, reg, alvo, campo, media(campo, 50), 'negocio');
  somar(e, reg, alvo, 'subsidiarias', 1 + (b.n['subsidiarias'] ?? 0));
  // Uma bolsa basta: se a absorvida estava listada, a empresa que fica passa a estar.
  if (b.q['na_bolsa']) ganhar(e, reg, alvo, 'na_bolsa', origem);
  // No mesmo ramo, a fusão é uma compra a mais para o truste.
  let truste = false;
  if (mesmoRamo) {
    somarQualidade(e, reg, alvo, 'aquisicoes', 1 + (b.q['aquisicoes']?.v ?? 0), origem);
    truste = (a.q['aquisicoes']?.v ?? 0) >= AQUISICOES_TRUSTE && ganhar(e, reg, alvo, 'truste', origem);
  }
  perder(e, reg, alvo, 'fundiu');
  ganhar(e, reg, alvo, 'fundiu', origem);
  encerrar(e, reg, absorvida, { para: alvo, origem });
  const fica = a;
  if (!mesmoRamo && !fica.nome.startsWith('Grupo ')) {
    const sobrenome = e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
    const grupo = `Grupo ${sobrenome}`;
    fica.nome = empresasDe(e).some((x) => x.nome === grupo) ? `${grupo} Participações` : grupo;
    fica.genero = 'm';
  }
  // Se a absorvida era a que quem joga cuida, a que fica toma o lugar dela.
  reorganizarGrupo(e, reg, alvo);
  const subs = fica.n['subsidiarias'] ?? 0;
  const ramos = mesmoRamo ? '' : ` (${c.setores.get(a.t['setor'] ?? '')?.nome ?? ''} e ${c.setores.get(b.t['setor'] ?? '')?.nome ?? ''})`;
  const comeco = mesmoRamo ? `${aEmpresa(comoA, 'A')} absorveu ${aEmpresa(comoB)}` : `${aEmpresa(comoA, 'A')} e ${aEmpresa(comoB)} viraram ${aEmpresa(fica)}${ramos}`;
  const pct = Math.round(Math.abs(sinergia) * 100);
  const efeito = pct < 3 ? '' : sinergia > 0 ? ` O corte de custos rendeu mais ${pct}% do valor somado.` : ` A fusão custou ${pct}% do valor somado: o mercado desconta ${mesmoRamo ? 'a bagunça da integração' : 'conglomerado'}.`;
  const fim = truste ? ' No mesmo ramo, a fusão fechou o mercado: é um truste, e o governo vai reparar.' : '';
  return {
    texto: `${comeco}: ${subsidiariasTexto(subs)}, valendo ${formatarDinheiro(fica.n['valor'] ?? 0)}.${efeito}${fim}`,
    resumo: mesmoRamo ? `fundiu ${aEmpresa(comoB)} ${aEmpresa(comoA, 'na')}` : `juntou ${aEmpresa(comoA)} e ${aEmpresa(comoB)} ${aEmpresa(fica, 'na')}`,
  };
}
