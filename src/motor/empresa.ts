/**
 * A empresa de quem joga: uma entidade como as outras (`empresa.valor`,
 * `empresa.tracao`, `empresa.setor`), aberta com um setor e um capital, pela
 * folha Dinheiro ou por um storylet (o negócio que deu certo, o da família).
 *
 * Todo ano o valor anda pela tração (o ritmo em que ela vem crescendo, que
 * muda devagar), pela fase do país conforme o setor sente o ciclo e por sorte.
 * Pequena, ela balança muito; grande, balança menos e cresce mais devagar.
 * Tocar a empresa (a ficha do ano) empurra a tração para cima, e o talento de
 * quem toca também. Da empresa sai, por ano, a retirada que o jogador escolhe
 * (uma fração do valor), na proporção da parte dele. Abaixo de um piso, ela
 * quebra: um storylet agendado, com a fundação como causa.
 *
 * A parte de quem joga entra no patrimônio e na classe, mas não paga conta
 * sozinha: só vira dinheiro pela retirada ou pela venda.
 */
import { faseDe, defFase } from './ciclo.ts';
import { entidadeDe, investidoDe, lerCaminho, parteNaEmpresa } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import type { AberturaEmpresa, DefFase, DefSetor } from './esquema.ts';
import { anotarCaixa, caixaDe, movimentar, resgatarDe } from './economia.ts';
import { definirNumero, definirTexto, ganhar, perder, somar } from './livro.ts';
import { novaEntidade } from './pessoas.ts';
import {
  CAPITAL_MINIMO_EMPRESA,
  DESVIO_TRACAO,
  PENALIDADE_PORTE,
  PIOR_ANO_EMPRESA,
  PISO_EMPRESA,
  PORTE_GRANDE,
  REVERSAO_TRACAO,
  TALENTO_TRACAO,
  precoDeVenda,
  volatilidadeDaEmpresa,
} from './regras.ts';
import { normal, sortear } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** Qualidades de quem vive do próprio negócio: somem quando sai da vida a empresa que sustentava quem joga (e a renda dela junto). */
const DONO = ['empreendedor', 'socio', 'herdeiro_negocio'] as const;
/** O storylet que conta a quebra (agendado pela regra do ano). */
const QUEBRA = 'empresa_quebrou';

export function empresaDe(e: EstadoVida): Entidade | undefined {
  const emp = e.entidades['empresa'];
  return emp && emp.vivo !== false ? emp : undefined;
}

/** Setores em que dá para abrir uma empresa (os que têm nomes de empresa nos dados). */
export function setoresDeEmpresa(c: Conteudo): DefSetor[] {
  return c.mundo.setores.filter((s) => (s.empresas?.length ?? 0) > 0);
}

/** "Silva Tech", "Mercadinho da Ana": um nome do setor com o sobrenome da família. */
function nomeDaEmpresa(e: EstadoVida, setor: DefSetor | undefined): string {
  const eu = e.entidades['eu']!;
  const ultimo = e.sobrenome.split(' ').at(-1) ?? e.sobrenome;
  const modelo = sortear(e.rng, setor?.empresas ?? ['{sobrenome} & Cia.', 'Grupo {sobrenome}']);
  return modelo
    .replaceAll('{sobrenome}', ultimo)
    .replaceAll('{nome}', eu.nome)
    .replaceAll('{o|a}', eu.genero === 'f' ? 'a' : 'o');
}

/** Dinheiro de quem joga, fora de empresa: o que dá para pôr numa (conta e investimentos). */
export function liquidoDe(e: EstadoVida): number {
  const eu = e.entidades['eu']!;
  return Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu);
}

/** Tira até `valor` de quem joga: da conta e depois dos investimentos (o mais fácil de vender primeiro). Devolve quanto saiu. */
function tirarDeQuemJoga(e: EstadoVida, reg: Mudanca[], valor: number): number {
  const n = e.entidades['eu']!.n;
  const antes = caixaDe(n);
  const daConta = Math.min(Math.max(0, n['dinheiro'] ?? 0), Math.max(0, valor));
  n['dinheiro'] = (n['dinheiro'] ?? 0) - daConta;
  const dosInvestimentos = resgatarDe(n, valor - daConta);
  anotarCaixa(reg, 'eu', antes, n);
  return daConta + dosInvestimentos;
}

interface Fundacao {
  setor: string;
  valor: number;
  participacao?: number | undefined;
  tracao?: number | undefined;
}

/** A empresa nasce (o valor já veio de algum lugar): tudo vai para o livro, e a fundação vira a causa do que ela causar. */
function fundar(e: EstadoVida, c: Conteudo, reg: Mudanca[], f: Fundacao, origem: number): Entidade | null {
  if (empresaDe(e) || !(f.valor > 0)) return null;
  const setor = c.setores.get(f.setor);
  const emp = novaEntidade({ id: 'empresa', tipo: 'empresa', nome: nomeDaEmpresa(e, setor), nascimento: e.ano, vivo: true });
  e.entidades['empresa'] = emp;
  definirTexto(e, reg, 'empresa', 'setor', setor?.id ?? 'comercio');
  somar(e, reg, 'empresa', 'valor', f.valor);
  somar(e, reg, 'empresa', 'tracao', f.tracao ?? setor?.tracao ?? 4);
  somar(e, reg, 'empresa', 'participacao', f.participacao ?? 1);
  ganhar(e, reg, 'empresa', 'fundada', origem);
  return emp;
}

/** O efeito `abrirEmpresa` de um storylet. Devolve o valor com que a empresa nasceu (0 se já havia uma). */
export function abrirPorEfeito(e: EstadoVida, c: Conteudo, reg: Mudanca[], a: AberturaEmpresa, ator: string | undefined, origem: number): number {
  if (empresaDe(e)) return 0;
  const setor = a.setor ?? String(lerCaminho(e, a.copiarSetor ?? '', ator) ?? '');
  let valor = a.valor ?? 0;
  if (a.capital !== undefined) valor = tirarDeQuemJoga(e, reg, a.capital);
  if (a.fracao !== undefined) {
    const de = entidadeDe(a.de ?? 'eu', ator);
    if (de === 'eu') {
      valor = tirarDeQuemJoga(e, reg, liquidoDe(e) * a.fracao);
    } else {
      valor = Math.max(0, e.entidades[de]?.n['dinheiro'] ?? 0) * a.fracao;
      somar(e, reg, de, 'dinheiro', -valor);
    }
  }
  return fundar(e, c, reg, { setor: c.setores.has(setor) ? setor : 'comercio', valor, participacao: a.participacao, tracao: a.tracao }, origem) ? valor : 0;
}

/** O valor da empresa multiplicado (o contrato grande, o escândalo). */
export function multiplicarEmpresa(e: EstadoVida, reg: Mudanca[], fator: number): void {
  const emp = empresaDe(e);
  if (emp) somar(e, reg, 'empresa', 'valor', (emp.n['valor'] ?? 0) * (fator - 1));
}

/** Investidores compram `parte` da empresa pelo valor de agora: o dinheiro deles entra nela, e a parte de quem joga encolhe. Devolve quanto entrou. */
export function rodadaDeInvestimento(e: EstadoVida, reg: Mudanca[], parte: number): number {
  const emp = empresaDe(e);
  if (!emp) return 0;
  const valor = emp.n['valor'] ?? 0;
  const entrou = valor * (parte / (1 - parte));
  somar(e, reg, 'empresa', 'valor', entrou);
  somar(e, reg, 'empresa', 'participacao', -(emp.n['participacao'] ?? 1) * parte);
  return entrou;
}

/**
 * A empresa sai da vida de quem joga: o livro zera o que ela tinha. Se ela
 * sustentava quem joga (qualidade `sustenta`: a renda era o salário de dono),
 * a renda e o jeito de trabalhar de dono vão junto. Fica só o nome (o texto
 * da venda ainda fala dela), sem setor nem qualidades, até abrir outra.
 */
function encerrar(e: EstadoVida, reg: Mudanca[]): void {
  const emp = e.entidades['empresa'];
  if (!emp) return;
  const sustentava = Boolean(emp.q['sustenta']);
  for (const [campo, v] of Object.entries(emp.n)) if (v !== 0) reg.push({ c: `empresa.${campo}`, d: -v });
  for (const q of Object.keys(emp.q)) reg.push({ c: `empresa.${q}`, q: -1 });
  emp.n = {};
  emp.t = {};
  emp.q = {};
  emp.vivo = false;
  emp.morte = e.ano;
  if (!sustentava) return;
  for (const q of DONO) perder(e, reg, 'eu', q);
  definirNumero(e, reg, 'eu', 'renda', 0);
}

/** Vende esta fração da parte de quem joga, pelo valor de agora vezes o prêmio. Vendeu tudo, a empresa sai da vida. Devolve o preço. */
export function venderParte(e: EstadoVida, reg: Mudanca[], fracao: number, premio = 1): number {
  const emp = empresaDe(e);
  if (!emp) return 0;
  const parte = emp.n['participacao'] ?? 1;
  const vendida = parte * Math.min(1, Math.max(0, fracao));
  const preco = Math.max(0, emp.n['valor'] ?? 0) * vendida * premio;
  if (preco > 0) movimentar(e, reg, { dinheiro: preco });
  if (parte - vendida < 0.005) encerrar(e, reg);
  else somar(e, reg, 'empresa', 'participacao', -vendida);
  return preco;
}

/** A empresa fecha as portas: volta para quem joga a fração `sobra` da parte dele. Devolve quanto voltou. */
export function fecharEmpresa(e: EstadoVida, reg: Mudanca[], sobra: number): number {
  if (!empresaDe(e)) return 0;
  const volta = parteNaEmpresa(e) * sobra;
  if (volta > 0) movimentar(e, reg, { dinheiro: volta });
  encerrar(e, reg);
  return volta;
}

/**
 * O ano da empresa: cresce (ou encolhe) pela tração, pela fase e por sorte;
 * paga a retirada; a tração volta devagar para a do setor; e, abaixo do
 * piso, a quebra fica agendada.
 */
export function regraDaEmpresa(e: EstadoVida, c: Conteudo, fase: DefFase, reg: Mudanca[]): void {
  const emp = empresaDe(e);
  if (!emp) return;
  const n = emp.n;
  const setor = c.setores.get(emp.t['setor'] ?? '');
  const valor = n['valor'] ?? 0;
  const tracao = n['tracao'] ?? 0;
  const sorte = normal(e.rng, 0, volatilidadeDaEmpresa(valor) * (setor?.risco ?? 1));
  const crescimento = Math.max(PIOR_ANO_EMPRESA, tracao / 100 + fase.empresa * (setor?.ciclo ?? 1) + sorte);
  somar(e, reg, 'empresa', 'valor', valor * crescimento, 'empresa');
  definirNumero(e, reg, 'empresa', 'lucro', valor * crescimento, 'empresa');
  const retirada = (n['retirada'] ?? 0) * (n['valor'] ?? 0);
  if (retirada > 0) {
    somar(e, reg, 'empresa', 'valor', -retirada, 'empresa');
    movimentar(e, reg, { dinheiro: retirada * (n['participacao'] ?? 1) }, 'eu', 'empresa');
  }
  const talento = ((e.entidades['eu']!.n['inteligencia'] ?? 50) - 50) * TALENTO_TRACAO;
  const porte = PENALIDADE_PORTE * Math.max(0, Math.log10(Math.max(1, n['valor'] ?? 0) / PORTE_GRANDE));
  const alvo = (setor?.tracao ?? 4) + talento - porte;
  somar(e, reg, 'empresa', 'tracao', (alvo - tracao) * REVERSAO_TRACAO + normal(e.rng, 0, DESVIO_TRACAO), 'empresa');
  if ((n['valor'] ?? 0) < PISO_EMPRESA && c.porId.has(QUEBRA) && !e.agenda.some((a) => a.evento === QUEBRA)) {
    e.agenda.push({ evento: QUEBRA, ano: e.ano, origem: emp.q['fundada']?.causa ?? null });
  }
}

// ---------------------------------------------------------------- operações do jogador (folha Dinheiro)

export type OperacaoEmpresa =
  /** Abre a empresa com este capital (da conta e, se faltar, dos investimentos). */
  | { tipo: 'abrir'; setor: string; valor: number }
  /** Põe mais dinheiro na empresa. */
  | { tipo: 'aportar'; valor: number }
  /** Quanto do valor sai por ano para os donos (RETIRADAS). */
  | { tipo: 'retirada'; fracao: number }
  /** Vende a parte de quem joga, pelo preço da fase do país. */
  | { tipo: 'vender' };

export function ehOperacaoDeEmpresa(op: { tipo: string }): op is OperacaoEmpresa {
  return op.tipo === 'abrir' || op.tipo === 'aportar' || op.tipo === 'retirada' || op.tipo === 'vender';
}

/** O preço da parte de quem joga se vender agora (o valor, com o desconto ou o prêmio da fase). */
export function precoDaParte(e: EstadoVida, c: Conteudo): number {
  return parteNaEmpresa(e) * precoDeVenda(defFase(c, faseDe(e)).empresa);
}

export function motivoParaNaoOperarEmpresa(e: EstadoVida, c: Conteudo, op: OperacaoEmpresa): string | null {
  if (e.idade < 18) return 'só a partir dos 18 anos';
  const emp = empresaDe(e);
  if (op.tipo === 'abrir') {
    if (emp) return 'você já tem uma empresa';
    if (!setoresDeEmpresa(c).some((s) => s.id === op.setor)) return 'escolha o ramo';
    if (!(op.valor >= CAPITAL_MINIMO_EMPRESA)) return `o mínimo para abrir é ${formatarDinheiro(CAPITAL_MINIMO_EMPRESA)}`;
    if (op.valor > liquidoDe(e) + 0.5) return 'não há tanto dinheiro';
    return null;
  }
  if (!emp) return 'você não tem empresa';
  if (op.tipo === 'aportar') {
    if (!(op.valor >= 1)) return 'escolha quanto pôr';
    if (op.valor > liquidoDe(e) + 0.5) return 'não há tanto dinheiro';
  }
  if (op.tipo === 'retirada' && Math.abs((emp.n['retirada'] ?? 0) - op.fracao) < 1e-9) return 'já é assim';
  return null;
}

const RETIRADA_TEXTO = (fracao: number): string =>
  fracao <= 0 ? 'reinvestir todo o lucro' : fracao < 0.05 ? 'tirar um pouco do valor por ano' : 'tirar bastante do valor por ano';

/** Faz a operação (já conferida) e devolve o texto e o resumo da entrada. */
export function operarEmpresa(e: EstadoVida, c: Conteudo, op: OperacaoEmpresa, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  if (op.tipo === 'abrir') {
    const valor = tirarDeQuemJoga(e, reg, op.valor);
    const emp = fundar(e, c, reg, { setor: op.setor, valor }, origem)!;
    const ramo = c.setores.get(op.setor)?.nome ?? op.setor;
    return { texto: `Abriu a ${emp.nome}, de ${ramo}, com ${formatarDinheiro(valor)}.`, resumo: `abriu a ${emp.nome} com ${formatarDinheiro(valor)}` };
  }
  const emp = empresaDe(e)!;
  if (op.tipo === 'aportar') {
    const valor = tirarDeQuemJoga(e, reg, op.valor);
    const antes = emp.n['valor'] ?? 0;
    const parte = emp.n['participacao'] ?? 1;
    somar(e, reg, 'empresa', 'valor', valor);
    // Dinheiro novo de quem joga aumenta a parte dele (os outros sócios não puseram nada).
    if (parte < 1) somar(e, reg, 'empresa', 'participacao', (parte * antes + valor) / (antes + valor) - parte);
    return { texto: `Pôs ${formatarDinheiro(valor)} na ${emp.nome}.`, resumo: `pôs ${formatarDinheiro(valor)} na própria empresa` };
  }
  if (op.tipo === 'retirada') {
    definirNumero(e, reg, 'empresa', 'retirada', op.fracao);
    return { texto: `Decidiu ${RETIRADA_TEXTO(op.fracao)} da ${emp.nome}.`, resumo: `decidiu ${RETIRADA_TEXTO(op.fracao)} da empresa` };
  }
  const nome = emp.nome;
  const preco = venderParte(e, reg, 1, precoDeVenda(defFase(c, faseDe(e)).empresa));
  ganhar(e, reg, 'eu', 'vendeu_empresa', origem);
  return { texto: `Vendeu a ${nome} por ${formatarDinheiro(preco)}.`, resumo: `vendeu a ${nome} por ${formatarDinheiro(preco)}` };
}
