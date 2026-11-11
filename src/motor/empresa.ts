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
import { anoDaHolding, garantirRegistro, profundidade } from './societario.ts';
import { fecharUnidadesDe, garantirUnidades, mudarCapacidade, moverUnidade, operarUnidade, produtivasDe, unidadesDe } from './unidades.ts';
import { anoDasConcorrentes, mexerNaConcorrente, principalDe } from './concorrentes.ts';
import { analiseDoCade } from './demonstracoes.ts';
import { anoDosConselhos } from './governanca.ts';
import { diluirPeloAporte, liberarParticipadas, mudarDona, refDaPessoa } from './societario.ts';
import { exteriorNaEmpresa } from './diplomacia.ts';
import { influenciaNegocios } from './influencia.ts';
import { momentoDoPais, type Momento } from './pais.ts';
import { donaDe, empresaDoRegistro, empresasDe, entidadeDe, refDaEmpresa, idadeDe, investidoDe, LUGARES_DE_EMPRESA, lerCaminho, parteNaEmpresa } from './campos.ts';
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
import { anoDoNegocio, empregosNaCidade, funcionariosDe, entradaQueMudou, garantirFundamentos, garraDaRival, lobbyDoAno, ocupacaoDe, ofertaDe, precoDoSetor, somarDemanda, type AnoDoNegocio } from './negocio.ts';
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
  /** Quem controla ('eu', '#<registro>' da empresa-mãe, 'p<número>' da pessoa): sem ela, quem joga (missão Capitalismo vivo). */
  dona?: string | undefined;
  /** Uma holding: pessoa jurídica sem operação própria, que vive das participações. */
  holding?: boolean | undefined;
  /** O país de fora da filial (mundo-das-empresas.ts): ela vende lá, com as unidades nas cidades de lá. */
  pais?: string | undefined;
}

/** A empresa nasce no lugar `id` (o valor já veio de algum lugar): tudo vai para o livro, e a fundação vira a causa do que ela causar. */
export function fundar(e: EstadoVida, c: Conteudo, reg: Mudanca[], f: Fundacao, origem: number, id: string, nomeDado?: string): Entidade | null {
  if (empresaDe(e, id) || !(f.valor > 0)) return null;
  const setor = c.setores.get(f.setor);
  const nome = nomeDado ?? nomeNovo(e, setor);
  const emp = novaEntidade({ id, tipo: 'empresa', nome, genero: generoDoNome(e, nome), nascimento: e.ano, vivo: true });
  e.entidades[id] = emp;
  // A pessoa jurídica: o número permanente e quem a controla (societario.ts).
  garantirRegistro(e, emp);
  if (f.dona && f.dona !== 'eu') definirTexto(e, reg, id, 'dona', f.dona);
  if (f.pais) definirTexto(e, reg, id, 'pais', f.pais);
  if (f.holding) {
    // A holding não produz: o capital fica no caixa, e o valor dela é o caixa (as participações entram pela parte de cada subsidiária).
    definirTexto(e, reg, id, 'setor', 'financas');
    ganhar(e, reg, id, 'holding', origem);
    ganhar(e, reg, id, 'fundada', origem);
    somar(e, reg, id, 'participacao', f.participacao ?? 1);
    somar(e, reg, id, 'caixa', f.valor, 'capital', f.de ?? 'mercado');
    somar(e, reg, id, 'valor', f.valor);
    return emp;
  }
  definirTexto(e, reg, id, 'setor', setor?.id ?? 'comercio');
  somar(e, reg, id, 'valor', f.valor);
  somar(e, reg, id, 'tracao', f.tracao ?? setor?.tracao ?? 4);
  somar(e, reg, id, 'participacao', f.participacao ?? 1);
  // Nasce dependendo de quem abriu; com sócios, eles dividem o comando.
  somar(e, reg, id, 'dependencia', DEPENDENCIA_INICIAL * (f.participacao ?? 1));
  ganhar(e, reg, id, 'fundada', origem);
  // A primeira geração do produto chega com ela (I-160).
  ganhar(e, reg, id, 'lancamento', origem);
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
  if (emp.n['capacidade'] !== undefined) mudarCapacidade(e, c, reg, emp, (emp.n['capacidade'] ?? 0) * fracao, 'negocio');
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
  for (const [campo, v] of Object.entries(en.t)) reg.push({ c: `${para}.${campo}`, t: v, r: 'papel' });
  for (const q of Object.keys(en.q)) reg.push({ c: `${de}.${q}`, q: -1 }, { c: `${para}.${q}`, q: 1 });
  e.entidades[para] = { ...en, id: para };
  delete e.entidades[de];
}

/** Leva a empresa para outro id (para fora do grupo, quando a parte inteira foi vendida): o livro anota a troca de lugar, e o número dela vai junto. */
export function moverEmpresa(e: EstadoVida, reg: Mudanca[], de: string, para: string): void {
  // O lugar de uma empresa que já saiu da vida (encerrada, sem nada) pode receber outra, como na fundação.
  if (e.entidades[para] && e.entidades[para]!.vivo !== false) throw new Error(`o lugar ${para} já está ocupado`);
  mover(e, reg, de, para);
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
  for (const [campo, v] of Object.entries(eb.t)) if (ea.t[campo] !== v) reg.push({ c: `${a}.${campo}`, t: v, r: 'papel' });
  for (const [campo, v] of Object.entries(ea.t)) if (eb.t[campo] !== v) reg.push({ c: `${b}.${campo}`, t: v, r: 'papel' });
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
  // A holding não opera: o lugar da que quem joga toca vai para a maior das que produzem (a holding só se não houver outra).
  const operam = outras.filter((x) => !x.q['holding']);
  const candidatas = operam.length > 0 ? operam : outras;
  const escolhida = (preferida ? empresaDe(e, preferida) : undefined) ?? candidatas.reduce((a, b) => (parteNaEmpresa(e, b.id) > parteNaEmpresa(e, a.id) ? b : a));
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
/** A empresa de fora (a concorrente que quebrou) sai da vida: o livro zera o que ela tinha, e as unidades fecham junto. */
export function encerrarEmpresa(e: EstadoVida, reg: Mudanca[], id: string): void {
  encerrar(e, reg, id);
}

function encerrar(e: EstadoVida, reg: Mudanca[], id = PRINCIPAL, sustento?: { para: string; origem: number }): void {
  const emp = e.entidades[id];
  if (!emp) return;
  const sustentava = Boolean(emp.q['sustenta']);
  // Os estabelecimentos fecham junto (os que a fusão levou já são da que ficou), e as participações dela não ficam sem
  // dono: vão para a que absorveu, na fusão, ou sobem para quem era dona dela (societario.ts).
  fecharUnidadesDe(e, reg, emp);
  liberarParticipadas(e, reg, emp, sustento ? e.entidades[sustento.para] : undefined);
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
  const emp = empresaDe(e, id);
  if (!emp) return 0;
  // A subsidiária fecha sozinha (responsabilidade limitada, missão Capitalismo vivo): o que sobra do caixa vai para a
  // controladora, na parte dela; ninguém acima paga a conta, e as outras empresas do grupo seguem como estavam.
  const acima = donaDe(emp)[0] === '#' ? empresaDoRegistro(e, donaDe(emp)) : undefined;
  if (acima && acima.vivo !== false) {
    const volta = Math.min(Math.max(0, emp.n['caixa'] ?? 0), Math.max(0, emp.n['valor'] ?? 0) * (emp.n['participacao'] ?? 1) * sobra);
    if (volta > 0) {
      somar(e, reg, id, 'caixa', -volta, 'encerramento', acima.id);
      somar(e, reg, acima.id, 'caixa', volta, 'encerramento', id);
      somar(e, reg, acima.id, 'valor', volta, 'empresa');
    }
    encerrar(e, reg, id);
    return 0;
  }
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

/**
 * A empresa sua (de quem joga direto) com as subsidiárias pequenas do contador: a que você cuida de perto, se tiver
 * alguma; senão, a que tiver mais (a concorrente comprada vem com as dela).
 */
export function empresaComSubsidiarias(e: EstadoVida): string | undefined {
  const minhas = empresasDe(e).filter((x) => donaDe(x) === 'eu' && (x.n['subsidiarias'] ?? 0) >= 1);
  if (minhas.some((x) => x.id === PRINCIPAL)) return PRINCIPAL;
  return minhas.sort((a, b) => (b.n['subsidiarias'] ?? 0) - (a.n['subsidiarias'] ?? 0))[0]?.id;
}

/** Vende subsidiárias (uma, até dez; depois, um décimo delas, ou `quantas`): sai a fatia delas do valor, e a parte de quem joga vira dinheiro. */
export function venderSubsidiarias(e: EstadoVida, c: Conteudo, reg: Mudanca[], premio: number, id = PRINCIPAL, quantas?: number): { preco: number; vendidas: number } {
  const emp = empresaDe(e, id);
  const subs = emp?.n['subsidiarias'] ?? 0;
  if (!emp || subs < 1) return { preco: 0, vendidas: 0 };
  const vendidas = Math.min(subs, quantas ?? subsidiariasPorVenda(subs));
  const fracao = vendidas * fracaoDeUmaSubsidiaria(subs);
  const fatia = Math.max(0, emp.n['valor'] ?? 0) * fracao;
  somar(e, reg, id, 'valor', -fatia);
  // A subsidiária vendida leva a estrutura e os clientes dela.
  if (emp.n['capacidade'] !== undefined) mudarCapacidade(e, c, reg, emp, -(emp.n['capacidade'] ?? 0) * Math.min(1, fracao), 'negocio');
  if (emp.n['demanda'] !== undefined) somar(e, reg, id, 'demanda', -(emp.n['demanda'] ?? 0) * Math.min(1, fracao), 'negocio');
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
  if (emp.q['holding']) {
    anoDaHolding(e, reg, emp);
    return { vendas: 0, lucro: n['lucro'] ?? 0, imposto: 0, dividendos: 0, cortou: 0, empregosAntes: 0, empregosDepois: 0 };
  }
  garantirFundamentos(e, c, reg, emp);
  const valor = n['valor'] ?? 0;
  const tracao = n['tracao'] ?? 0;
  const sorte = normal(e.rng, 0, volatilidadeDaEmpresa(valor) * (setor?.risco ?? 1) * SORTE_DO_NEGOCIO);
  // O mundo lá fora: o dólar (quem exporta ganha, quem importa perde), a tarifa na fronteira e a sanção ou o acordo de quem compra do setor.
  const fora = exteriorNaEmpresa(e, c, emp.t['setor'] ?? '', fase.cambio ?? 0);
  const ano = anoDoNegocio(e, c, emp, fase, reg, fora, sorte);
  if (emp.q['na_bolsa'] && humor !== 0) somar(e, reg, id, 'valor', (n['valor'] ?? 0) * PESO_DA_BOLSA * humor, 'bolsa');
  // A ocupação e a equipe vão para o livro quando mudam de verdade (2 pontos da ocupação, 1% das pessoas): em regime, elas
  // oscilam um fio todo ano, e cada empresa do grupo escreveria duas linhas de troco por ano.
  const ocupacao = Math.round(Math.min(10, ocupacaoDe(e, c, emp)) * 100) / 100;
  if (n['ocupacao'] === undefined || Math.abs(ocupacao - (n['ocupacao'] ?? 0)) >= 0.02) definirNumero(e, reg, id, 'ocupacao', ocupacao, 'negocio');
  const funcionarios = Math.min(3_000_000, funcionariosDe(e, c, emp));
  if (n['funcionarios'] === undefined || Math.abs(funcionarios - (n['funcionarios'] ?? 0)) >= Math.max(1, 0.01 * (n['funcionarios'] ?? 0))) definirNumero(e, reg, id, 'funcionarios', funcionarios, 'negocio');
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
  // Toda empresa tem o número permanente dela (as de antes da propriedade escrita ganham agora); as de baixo fecham o ano
  // antes, para o dividendo subir até a holding no mesmo ano.
  for (const emp of empresasDe(e)) garantirRegistro(e, emp);
  const empresas = empresasDe(e).sort((a, b) => profundidade(e, b) - profundidade(e, a));
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
    // O imposto da filial lá fora vai para o governo de lá: não baixa a dívida daqui.
    if (!emp.t['pais']) impostos += ano.imposto;
    exportacaoBarrada(e, emp);
  }
  // As contas nacionais (I-161): o que o grupo adicionou ao PIB, e o crescimento que isso puxa (antes das concorrentes,
  // que fecham o ano fazendo a clientela do setor caber no mercado do PIB novo).
  pesoNoPib(e, reg);
  // As concorrentes de verdade andam o ano delas (concorrentes.ts), depois das do grupo, que já reagiram a elas; o
  // imposto delas também vai para o Tesouro.
  impostos += anoDasConcorrentes(e, c, fase, reg).imposto;
  // Os empregos que as empresas abriram e fecharam mexem no desemprego da cidade (o trabalho de quem joga e o da família leem).
  empregosNaCidade(e, reg, antes, depois);
  // Os conselhos com autonomia decidem o ano que vem, dentro do mandato que quem joga deu (governanca.ts).
  anoDosConselhos(e, c, empresasDe(e));
  // O imposto que elas pagaram entra no Tesouro e baixa a dívida pública (em pontos do PIB).
  const pib = e.entidades['pais']?.n['pib'] ?? 0;
  if (impostos > 0 && pib > 0) somar(e, reg, 'pais', 'divida', -(impostos / pib) * 100, 'impostos_das_empresas');
  if (!c.porId.has(QUEBRA) || e.agenda.some((a) => a.evento === QUEBRA)) return;
  // Afunda a empresa que não pagou as contas dois anos seguidos, a que ficou sem estrutura ou a que está abaixo do piso de valor.
  // A holding não afunda pelo valor: ele é o caixa que ela distribuiu (o que ela tem são as participações).
  const afundando = empresasDe(e).find((x) => !x.q['holding'] && (insolventes.has(x.id) || (x.n['valor'] ?? 0) < PISO_EMPRESA || (x.n['capacidade'] !== undefined && (x.n['capacidade'] ?? 0) < PISO_EMPRESA)));
  if (!afundando) return;
  if (afundando.id !== PRINCIPAL) trocar(e, reg, PRINCIPAL, afundando.id);
  e.agenda.push({ evento: QUEBRA, ano: e.ano, origem: e.entidades[PRINCIPAL]!.q['fundada']?.causa ?? null });
}

/**
 * O que o grupo pesa no PIB (I-161): o valor adicionado das empresas dele no ano (as vendas e a publicidade menos o que
 * compraram de outras para produzir), em % do PIB, sem a holding (o dividendo que ela recebe já é valor das filhas). O
 * valor adicionado a mais (ou a menos) que no ano anterior puxa o crescimento pela metade (a outra metade sai do resto da
 * economia, que perdeu o cliente ou o trabalhador): só o grupo do tamanho de um país mexe no PIB.
 */
function pesoNoPib(e: EstadoVida, reg: Mudanca[]): void {
  const pais = e.entidades['pais'];
  const pib = pais?.n['pib'] ?? 0;
  if (!pais || !(pib > 0)) return;
  let va = 0;
  for (const emp of empresasDe(e)) {
    // O valor que a filial lá fora adiciona é do PIB de lá.
    if (emp.q['holding'] || emp.n['capacidade'] === undefined || emp.t['pais']) continue;
    let insumos = 0;
    for (const m of reg) if (m.c === `${emp.id}.caixa` && (m.r === 'insumos' || m.r === 'publicidade') && (m.d ?? 0) < 0) insumos -= m.d!;
    va += Math.max(0, (emp.n['receita'] ?? 0) - insumos);
  }
  const peso = Math.round(Math.min(100, (100 * va) / pib) * 10_000) / 10_000;
  const antes = pais.n['peso_do_grupo'] ?? 0;
  if (peso !== antes) definirNumero(e, reg, 'pais', 'peso_do_grupo', peso, 'empresa');
  const impulso = (peso - antes) * 0.5;
  if (Math.abs(impulso) >= 0.01) {
    definirNumero(e, reg, 'pais', 'crescimento', Math.round(((pais.n['crescimento'] ?? 0) + impulso) * 100) / 100, 'empresa');
    definirNumero(e, reg, 'pais', 'pib', Math.round(pib * (1 + impulso / 100)), 'empresa');
  }
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
  | { tipo: 'adquirir'; empresa?: string; fracao?: number }
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
  // A holding não tem negócio próprio: compra, funde, emite e vai à bolsa pelas subsidiárias (grupo.ts).
  if (emp.q['holding'] && ['adquirir', 'opa', 'fundir', 'venderSubsidiaria', 'emitir', 'recomprar', 'abrirCapital'].includes(op.tipo)) return 'a holding não tem negócio próprio: isso se faz por uma subsidiária';
  // Quem joga mexe direto só na parte que é dele; a da subsidiária é da controladora dela (grupo.ts).
  if (donaDe(emp) !== 'eu' && ['aportar', 'vender', 'retirada', 'emitir', 'recomprar', 'abrirCapital', 'fundir', 'venderSubsidiaria'].includes(op.tipo)) return 'essa empresa é de outra empresa do grupo: decida pela controladora dela';
  if (op.tipo === 'aportar') {
    if (!(op.valor >= 1)) return 'escolha quanto pôr';
    if (op.valor > liquidoDe(e) + 0.5) return 'não há tanto dinheiro';
  }
  if (op.tipo === 'retirada' && Math.abs((emp.n['retirada'] ?? 0) - op.fracao) < 1e-9) return 'já é assim';
  if (op.tipo === 'adquirir') {
    if ((emp.n['valor'] ?? 0) < MINIMO_AQUISICAO) return `a empresa precisa valer ${formatarDinheiro(MINIMO_AQUISICAO)}`;
    const fracao = op.fracao ?? FRACAO_DA_COMPRA;
    if (!(fracao > 0.5 && fracao <= 1)) return 'a compra é do controle: mais da metade';
    // A compradora paga do caixa dela; o que faltar, quem joga põe.
    const custo = custoDaAquisicao(e, id, fracao);
    const temAlvo = alvoDaAquisicao(e, id) !== undefined;
    if (custo > liquidoDe(e) + (temAlvo ? Math.max(0, emp.n['caixa'] ?? 0) : 0) + 0.5) return `precisa de ${formatarDinheiro(custo)}`;
    if (temAlvo && !lugarLivre(e)) return `o grupo já tem ${MAX_EMPRESAS} empresas: a comprada continua sendo uma empresa`;
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
    const alvo = alvoDaAquisicao(e, id);
    // Com a concorrente de verdade, a oferta vai à bolsa dela, tenha ou não dono à vista.
    if (!alvo && (id !== PRINCIPAL || !dono || dono.vivo === false)) return 'a concorrência não tem dono à vista';
    if ((emp.n['valor'] ?? 0) < MINIMO_AQUISICAO) return `a empresa precisa valer ${formatarDinheiro(MINIMO_AQUISICAO)}`;
    if (custoDaOpa(e, id) > liquidoDe(e) + (alvo ? Math.max(0, emp.n['caixa'] ?? 0) : 0) + 0.5) return `precisa de ${formatarDinheiro(custoDaOpa(e, id))}`;
    if (alvo && !lugarLivre(e)) return `o grupo já tem ${MAX_EMPRESAS} empresas: a comprada continua sendo uma empresa`;
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
    if (emp.q['holding']) return 'a holding não tem chão de fábrica para tocar: cuide de uma das empresas dela';
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

/** Quanto da concorrente a compra leva, sem dizer: o controle com folga (o antigo dono fica com o resto). */
export const FRACAO_DA_COMPRA = 0.8;
/** O prêmio de controle: quem compra a maioria paga um pouco mais que o preço do dia. */
export const PREMIO_DE_CONTROLE = 0.1;

/** A concorrente que a empresa compraria: a principal de verdade do setor dela (concorrentes.ts), se houver. */
export function alvoDaAquisicao(e: EstadoVida, id = PRINCIPAL): Entidade | undefined {
  const emp = empresaDe(e, id);
  return emp && emp.n['capacidade'] !== undefined ? principalDe(e, emp) : undefined;
}

/**
 * O preço de uma concorrente. A de verdade: o valor dela, na fração comprada, pelo preço do dia (o preço do setor, com o
 * prêmio de controle e o desconto de quem tem nome no mercado). Sem ela: uma fração do valor da própria empresa.
 */
export function custoDaAquisicao(e: EstadoVida, id = PRINCIPAL, fracao = FRACAO_DA_COMPRA): number {
  const alvo = alvoDaAquisicao(e, id);
  if (alvo) return Math.max(0, alvo.n['valor'] ?? 0) * fracao * precoDaAquisicao(e, id);
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
  const nome = 1 - influenciaNegocios(e) / 500;
  // A concorrente de verdade tem valor próprio: o preço do dia é o do setor, com o prêmio de controle.
  if (alvoDaAquisicao(e, id)) return precoDoSetor(ofertaDe(e, emp.t['setor'])) * (1 + PREMIO_DE_CONTROLE) * nome;
  return precoDoSetor(ofertaDe(e, emp.t['setor'])) * (0.6 + (0.8 * (emp.n['concorrente'] ?? 50)) / 100) * nome;
}

/**
 * A compra da concorrente de verdade (missão Capitalismo vivo, teste 4): ela não é fundida nem some. A compradora paga
 * do caixa dela (o que faltar, quem joga põe, como aporte), o dinheiro vai para quem vendeu (o dono, ou os acionistas
 * no mercado), e a comprada vem para o grupo com o mesmo número, o caixa, as unidades, a clientela, a marca e a dívida
 * dela, controlada pela compradora na fração comprada; o resto fica com o antigo dono (a sócia) ou no mercado. O mercado
 * fica mais fechado: a próxima concorrente principal chega mais fraca.
 */
function comprarAConcorrente(e: EstadoVida, c: Conteudo, reg: Mudanca[], emp: Entidade, alvo: Entidade, dono: Entidade | undefined, preco: number, fracao: number, hostil: boolean, origem: number): { texto: string; resumo: string } {
  const id = emp.id;
  const lugar = lugarLivre(e)!;
  // A compra que concentra o mercado passa pelo Cade (demonstracoes.ts › analiseDoCade): a barrada custa os advogados e
  // não acontece; a aprovada com condição sai com a venda de uma unidade da comprada.
  const cade = analiseDoCade(e, c, emp.t['setor'] ?? '', alvo.id);
  const nomeDela = aEmpresa({ nome: alvo.nome, genero: alvo.genero });
  if (cade.decisao === 'barrada') {
    const advogados = tirarDeQuemJoga(e, reg, preco * 0.01, 'mercado');
    return {
      texto: `O Cade barrou a compra ${aEmpresa({ nome: alvo.nome, genero: alvo.genero }, 'da')}: com ela, o mercado ficaria com o índice de concentração em ${Math.round(cade.depois).toLocaleString('pt-BR')} (era ${Math.round(cade.antes).toLocaleString('pt-BR')}), um quase monopólio. Os advogados custaram ${formatarDinheiro(advogados)}.`,
      resumo: `teve a compra de ${nomeDela} barrada pelo Cade`,
    };
  }
  const falta = Math.max(0, preco - Math.max(0, emp.n['caixa'] ?? 0));
  if (falta > 0) porNaEmpresa(e, c, reg, id, tirarDeQuemJoga(e, reg, falta, id), falta, true);
  // O caixa da compradora paga quem vendeu: o dono, na conta dele, ou o mercado; o valor dela desce o mesmo tanto (a
  // comprada entra pela parte dela, sem contar duas vezes).
  // Quem vendeu (o dono, ou os acionistas) recebe pela economia: a fortuna de quem é de fora da família não é modelada.
  const pago = Math.min(preco, Math.max(0, emp.n['caixa'] ?? 0));
  somar(e, reg, id, 'caixa', -pago, 'aquisicao', 'mercado');
  somar(e, reg, id, 'valor', -Math.min(pago, Math.max(0, emp.n['valor'] ?? 0)), 'empresa');
  const nome = alvo.nome;
  const daRival = dono !== undefined && donaDe(alvo) === refDaPessoa(dono);
  moverEmpresa(e, reg, alvo.id, lugar);
  const comprada = e.entidades[lugar]!;
  // O antigo dono fica com o resto, como sócio minoritário (na hostil, o resto está no mercado).
  if (fracao < 1 && daRival && !hostil) {
    definirTexto(e, reg, lugar, 'socia', refDaPessoa(dono));
    definirNumero(e, reg, lugar, 'participacao_socia', 1 - fracao);
  }
  mudarDona(e, reg, comprada, refDaEmpresa(emp), fracao);
  if (comprada.q['guerra']) perder(e, reg, lugar, 'guerra');
  if (emp.q['guerra']) perder(e, reg, id, 'guerra');
  somar(e, reg, id, 'tracao', 2);
  // O mercado fica mais fechado: a próxima concorrente principal chega com menos força.
  if (emp.n['concorrente'] !== undefined) definirNumero(e, reg, id, 'concorrente', Math.max(0, (emp.n['concorrente'] ?? 50) - 15), 'negocio');
  let fica = '';
  if (dono && daRival) {
    if (!hostil && !e.entidades['gestor'] && idadeDe(e, dono) < 67) {
      levarParaAEmpresa(e, 'rival', 'gestor', reg);
      fica = ` ${dono.nome} ficou para tocar o negócio com você${fracao < 1 ? `, com ${Math.round((1 - fracao) * 100)}% da empresa` : ''}.`;
    } else {
      partir(e, 'rival', reg);
      if (hostil) fica = ` ${dono.nome} saiu do conselho sem apertar a sua mão.`;
    }
  }
  somarQualidade(e, reg, id, 'aquisicoes', 1, origem);
  const truste = (emp.q['aquisicoes']?.v ?? 0) >= AQUISICOES_TRUSTE && ganhar(e, reg, id, 'truste', origem);
  if (truste) somar(e, reg, id, 'tracao', 5);
  // A condição do Cade: a comprada vende a menor unidade que produz (se tiver mais de uma), funcionando, ao mercado.
  let condicao = '';
  if (cade.decisao === 'condicao') {
    const menor = produtivasDe(e, comprada).at(-1);
    if (menor && produtivasDe(e, comprada).length > 1) {
      operarUnidade(e, c, { tipo: 'venderUnidade', unidade: menor.id }, reg, origem);
      condicao = ' O Cade aprovou com uma condição: a comprada vendeu uma unidade, para o mercado não fechar de vez.';
    } else condicao = ' O Cade aprovou depois de olhar de perto: o mercado ficou mais concentrado.';
  } else if (cade.decisao === 'aprovada') condicao = ' O Cade analisou e aprovou.';
  const fim = (truste ? ' Com essa, metade do mercado tem o seu sobrenome: é um truste, e o governo vai reparar.' : '') + condicao;
  const parte = `${Math.round(fracao * 100)}%`;
  return {
    texto: hostil
      ? `A oferta hostil deu certo: ${aEmpresa(emp)} comprou ${parte} ${aEmpresa({ nome, genero: comprada.genero }, 'da')} na bolsa, por ${formatarDinheiro(preco)}, com o prêmio aos acionistas. Ela continua de pé, com o nome, as unidades e a clientela, agora no seu grupo.${fica}${fim}`
      : `${aEmpresa(emp, 'A')} comprou ${parte} ${aEmpresa({ nome, genero: comprada.genero }, 'da')}, por ${formatarDinheiro(preco)}. Ela continua de pé, com o nome, as unidades e a clientela, agora no seu grupo.${fica}${fim}`,
    resumo: truste ? `montou um truste com ${aEmpresa(emp)}` : hostil ? `tomou ${aEmpresa({ nome, genero: comprada.genero })} numa oferta hostil` : `comprou ${parte} ${aEmpresa({ nome, genero: comprada.genero }, 'da')}`,
  };
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
  // A parte de quem pôs cresce; a de quem não pôs (a sócia, o mercado) encolhe na mesma proporção (societario.ts).
  if (parte < 1 || (emp.n['participacao_socia'] ?? 0) > 0) diluirPeloAporte(e, reg, emp, valor, antes, ganho);
}

const RETIRADA_TEXTO = (fracao: number): string =>
  fracao <= 0 ? 'reinvestir todo o lucro' : `tirar ${Math.round(fracao * 100)}% do lucro de dividendo`;

const ORDINAL = ['', 'primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima', 'décima primeira', 'décima segunda'];

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
  somar(e, reg, id, 'participacao', Math.min(falta, 1 - (emp.n['participacao_socia'] ?? 0) - (emp.n['participacao'] ?? 1)));
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
  const alvo = alvoDaAquisicao(e, id);
  if (!emp || (!e.entidades['rival'] && !alvo)) return 0;
  // A garra é do dono da concorrente; com o capital disperso no mercado, ninguém briga pela empresa.
  const garra = !alvo || donaDe(alvo) !== refDaPessoa(e.entidades['rival']) ? (alvo ? 1 : garraDaRival(e, c, emp)) : garraDaRival(e, c, emp);
  const chance = 0.45 + influenciaNegocios(e) / 300 - (garra - 1) * 0.25 - (precoDaAquisicao(e, id) > 1 ? 0.1 : 0);
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
    const alvo = alvoDaAquisicao(e, id);
    const rival = e.entidades['rival'];
    // Quem decide é o dono da concorrente: a pessoa da rival (quando a de verdade é dela) ou, sem ela, ninguém (o mercado vende pelo preço).
    const dono = alvo ? (rival && rival.vivo !== false && donaDe(alvo) === refDaPessoa(rival) ? rival : undefined) : id === PRINCIPAL && rival?.vivo !== false ? rival : undefined;
    if ((dono || alvo) && hostil && aleatorio(e.rng) >= chanceDaOpa(e, c, id)) {
      // A oferta que falha custa os bancos e os advogados, e os acionistas ficam com o dono: a concorrência sai mais unida.
      const perdido = tirarDeQuemJoga(e, reg, custoDaOpa(e, id) * BOLSA.custoDaOferta, 'mercado');
      mexerNaConcorrente(e, reg, emp, BOLSA.forcaQueFica);
      if (dono) somar(e, reg, 'rival', 'magoa', BOLSA.magoaDaOferta);
      const nomeDela = alvo?.nome ?? dono?.t['negocio'] ?? 'a concorrente';
      return {
        texto: dono
          ? `A oferta hostil por ${nomeDela} não passou: os acionistas ficaram com ${dono.nome}. Os bancos e os advogados custaram ${formatarDinheiro(perdido)}, e a concorrência saiu mais unida.`
          : `A oferta hostil por ${nomeDela} não passou: os acionistas não venderam. Os bancos e os advogados custaram ${formatarDinheiro(perdido)}, e a concorrência saiu mais unida.`,
        resumo: dono ? `perdeu a oferta hostil pela concorrente de ${dono.nome}` : `perdeu a oferta hostil por ${nomeDela}`,
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
    // A concorrente de verdade continua sendo uma pessoa jurídica: passa a ser controlada pela compradora (concorrentes.ts).
    if (alvo) return comprarAConcorrente(e, c, reg, emp, alvo, dono, hostil ? custoDaOpa(e, id) : custoDaAquisicao(e, id, op.tipo === 'adquirir' ? (op.fracao ?? FRACAO_DA_COMPRA) : FRACAO_DA_COMPRA), op.tipo === 'adquirir' ? (op.fracao ?? FRACAO_DA_COMPRA) : FRACAO_DA_COMPRA, hostil, origem);
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
    const daConcorrente = dono?.t['negocio'] ?? nomeDaEmpresa(e, c.setores.get(emp.t['setor'] ?? ''), sortear(e.rng, c.mundo.sobrenomes));
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
        ? `A oferta hostil deu certo: ${aEmpresa(emp)} comprou ${daConcorrente} na bolsa${junto}, por ${formatarDinheiro(custo)}, com o prêmio aos acionistas.${fica}${fim}`
        : `${aEmpresa(emp, 'A')} comprou a concorrente ${daConcorrente}${junto}, por ${formatarDinheiro(custo)}.${fica}${fim}`,
      resumo: truste ? `montou um truste com ${aEmpresa(emp)}` : hostil ? `tomou a concorrente ${daConcorrente} numa oferta hostil` : `comprou a concorrente ${daConcorrente}`,
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
    const { preco, vendidas } = venderSubsidiarias(e, c, reg, precoDeVenda(momentoDoPais(e).empresa), id);
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
  // Os estabelecimentos da absorvida (a fábrica, a loja) passam a ser da que fica: a capacidade e a obra vêm com eles.
  garantirUnidades(e, c, reg, a, origem);
  garantirUnidades(e, c, reg, b, origem);
  for (const u of unidadesDe(e, b)) moverUnidade(e, reg, u, a);
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
