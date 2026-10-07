/**
 * A dinastia. Quando a vida termina e há filho ou filha viva, a história pode
 * continuar com essa pessoa, no mesmo mundo: a mesma cidade, o país na mesma
 * fase, a família que restou. Sem filho, mas com irmãos, quem herda é um
 * sobrinho ou uma sobrinha, por testamento. O herdeiro recebe o que sobrou
 * depois das dívidas (que morrem com o espólio), do imposto sobre herança e
 * da metade de quem era casado com quem morreu; a empresa da família passa
 * inteira. Leva o traço que já tinha como personagem e o vínculo que
 * construíram. Cada geração guarda as anteriores, e o cartão da vida conta a
 * fortuna da família de geração em geração.
 */
import { ATIVOS, type Ativo } from './constantes.ts';
import { bensDe, classeDoPatrimonio, parteNaEmpresa, patrimonioTotal, valorDosBens } from './campos.ts';
import { defDoBem } from './bens.ts';
import { influenciaAlvo } from './poder.ts';
import type { Conteudo } from './conteudo.ts';
import { resgatarDe } from './economia.ts';
import { definirTexto, ganhar, lancar, novaEntrada } from './livro.ts';
import { criarPersonagem, nomeLivre, novaEntidade } from './pessoas.ts';
import { ANOS_UNIAO } from './regras.ts';
import { aleatorio, criarRng, inteiro, misturar, normal, sortear, sortearIndice } from './rng.ts';
import { capitalizar, formatarDinheiro } from './texto.ts';
import { VERSAO_ESTADO, type Antepassado, type Entidade, type EstadoVida, type Genero, type Mudanca } from './tipos.ts';

export type { Antepassado, Dinastia } from './tipos.ts';

/** Imposto sobre herança (o ITCMD dos estados fica entre 4% e 8%). */
export const IMPOSTO_HERANCA = 0.04;
/** O testamento solidário deixa um quarto do espólio para uma causa (antes do cônjuge e do imposto). */
export const PARTE_SOLIDARIA = 0.25;

/** Quem pode continuar a história. */
/** Quem continua a história: filho ou filha, sobrinho ou sobrinha, o par (cônjuge) ou o melhor amigo. */
export type Parentesco = 'filho' | 'sobrinho' | 'amor' | 'amigo';

/** Para quem vai o testamento ('' é o padrão: filho; sem filho, sobrinho). Causa e bicho encerram a história. */
export const DESTINOS = ['', 'filho', 'sobrinho', 'amor', 'amigo', 'causa', 'pet'] as const;
export type Destino = (typeof DESTINOS)[number];

export interface Herdeiro {
  parentesco: Parentesco;
  nome: string;
  genero: Genero;
  nascimento: number;
  /** O filho ou a filha, que já existe na vida; o sobrinho nasce na hora de continuar. */
  entidade?: Entidade;
}

/**
 * O filho ou a filha viva; sem filho, um sobrinho ou uma sobrinha, se quem
 * morreu tinha irmãos. Puro (o sobrinho sai de uma semente da própria vida,
 * sem gastar o sorteio dela): a interface pode perguntar quantas vezes quiser.
 */
export function herdeiroPossivel(e: EstadoVida, c: Conteudo): Herdeiro | null {
  if (e.vivo) return null;
  const eu = e.entidades['eu']!;
  const destino = (eu.t['testamento'] ?? '') as Destino;
  // Tudo para uma causa, ou para o bicho: a fortuna sai da família e a história termina aqui.
  if (destino === 'causa' || destino === 'pet') return null;
  const vivo = (id: string): Entidade | undefined => {
    const x = e.entidades[id];
    return x && x.vivo !== false && !x.q['ausente'] && x.nascimento !== undefined && e.ano - x.nascimento >= 0 ? x : undefined;
  };
  if (destino === 'amor' || destino === 'amigo') {
    const x = vivo(destino);
    if (x) return { parentesco: destino, nome: x.nome, genero: x.genero ?? 'm', nascimento: x.nascimento!, entidade: x };
  }
  const f = destino === 'sobrinho' ? undefined : vivo('filho');
  if (f) return { parentesco: 'filho', nome: f.nome, genero: f.genero ?? 'm', nascimento: f.nascimento!, entidade: f };
  if ((eu.n['irmaos'] ?? 0) < 1) return null;
  const rng = criarRng(misturar(e.semente, e.ano, 7019));
  const genero: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
  const usados = new Set(Object.values(e.entidades).map((x) => x.nome));
  let nome = sortear(rng, c.mundo.nomes[genero]);
  for (let i = 0; i < 30 && usados.has(nome); i++) nome = sortear(rng, c.mundo.nomes[genero]);
  const idade = Math.max(1, e.idade - inteiro(rng, 22, 38));
  return { parentesco: 'sobrinho', nome, genero, nascimento: e.ano - idade };
}

// ---------------------------------------------------------------- o testamento, escolhido em vida

export type OperacaoTestamento = { tipo: 'testamento'; para: Destino };

export function ehOperacaoDeTestamento(op: { tipo: string }): op is OperacaoTestamento {
  return op.tipo === 'testamento';
}

/** Quem pode estar no testamento agora (vivo, existindo), e por que não. */
export function motivoParaNaoOperarTestamento(e: EstadoVida, op: OperacaoTestamento): string | null {
  const eu = e.entidades['eu']!;
  if (e.idade < 18) return 'só a partir dos 18 anos';
  if ((eu.t['testamento'] ?? '') === op.para) return 'já está assim';
  const vivo = (id: string): boolean => {
    const x = e.entidades[id];
    return Boolean(x && x.vivo !== false && !x.q['ausente']);
  };
  if (op.para === 'filho' && !vivo('filho')) return 'você não tem filho';
  if (op.para === 'amor' && !vivo('amor')) return 'você não tem par';
  if (op.para === 'amigo' && !vivo('amigo')) return 'seu melhor amigo não está mais aqui';
  if (op.para === 'pet' && !vivo('pet')) return 'você não tem bicho';
  if (op.para === 'sobrinho' && (eu.n['irmaos'] ?? 0) < 1) return 'você não tem irmãos';
  return null;
}

export function operarTestamento(e: EstadoVida, op: OperacaoTestamento, reg: Mudanca[]): { texto: string; resumo: string } {
  definirTexto(e, reg, 'eu', 'testamento', op.para);
  const nome = (id: string): string => e.entidades[id]?.nome ?? '';
  switch (op.para) {
    case 'filho':
      return { texto: `Fez testamento: tudo para ${nome('filho')}.`, resumo: `deixou tudo para ${nome('filho')} em testamento` };
    case 'sobrinho':
      return { texto: 'Fez testamento: tudo para os sobrinhos, filhos dos seus irmãos.', resumo: 'deixou tudo para os sobrinhos em testamento' };
    case 'amor':
      return { texto: `Fez testamento: tudo para ${nome('amor')}, que fica com a história.`, resumo: `deixou tudo para ${nome('amor')} em testamento` };
    case 'amigo':
      return { texto: `Fez testamento: tudo para ${nome('amigo')}, o melhor amigo da vida. A família ainda não sabe.`, resumo: `deixou tudo para ${nome('amigo')} em testamento` };
    case 'causa':
      return { texto: 'Fez testamento: tudo para uma causa. Hospitais, escolas e um bolsista que nunca vai saber o seu nome.', resumo: 'deixou tudo para a caridade em testamento' };
    case 'pet':
      return { texto: `Fez testamento: tudo para ${nome('pet')}. O cartório riu, mas registrou.`, resumo: `deixou tudo para ${nome('pet')} em testamento` };
    default:
      return { texto: 'Desfez o testamento: fica valendo a lei (os filhos primeiro).', resumo: 'desfez o testamento' };
  }
}

function limitar(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Um valor numa faixa, uniforme no logaritmo (renda é assim). */
function naFaixa(e: EstadoVida, [a, b]: readonly [number, number]): number {
  return Math.exp(Math.log(a) + aleatorio(e.rng) * (Math.log(b) - Math.log(a)));
}

interface Espolio {
  /** O que vai para o herdeiro: conta e cada classe. */
  heranca: Record<'dinheiro' | Ativo, number>;
  /** A parte da empresa que fica com o herdeiro (fração da empresa inteira; 0 sem empresa). */
  participacao: number;
  deixou: number;
  /** A metade de quem era casado (ou vivia junto há anos) com quem morreu. */
  doConjuge: number;
  imposto: number;
  /** O quarto do testamento solidário. */
  doacao: number;
  /** O que a conta e a empresa não cobriram da partilha: sai dos bens (os mais baratos são vendidos). */
  dosBens: number;
}

/**
 * Paga as dívidas com o espólio, separa a metade do cônjuge e o imposto; o
 * resto é do herdeiro. A empresa fica inteira na família: a metade do
 * cônjuge e o imposto saem primeiro do dinheiro, e só o que faltar sai da
 * parte na empresa.
 */
function partilhar(antiga: EstadoVida, herdeiroEhOPar = false): Espolio {
  const velho = antiga.entidades['eu']!;
  const caixa: Record<string, number> = { dinheiro: Math.max(0, velho.n['dinheiro'] ?? 0) };
  for (const a of ATIVOS) caixa[a] = velho.n[a] ?? 0;
  let divida = velho.n['divida'] ?? 0;
  const daConta = Math.min(caixa['dinheiro']!, divida);
  caixa['dinheiro']! -= daConta;
  divida -= daConta;
  resgatarDe(caixa, divida);
  const bruto = caixa['dinheiro']! + ATIVOS.reduce((s, a) => s + (caixa[a] ?? 0), 0);
  const naEmpresa = parteNaEmpresa(antiga);
  const emBens = valorDosBens(antiga);
  const total = bruto + naEmpresa + emBens;
  const amor = antiga.entidades['amor'];
  const namoro = velho.q['namoro'];
  const casal = amor?.vivo !== false && amor !== undefined && (velho.q['casado'] !== undefined || (namoro !== undefined && antiga.idade - namoro.idade >= ANOS_UNIAO));
  const conjuge = casal && !herdeiroEhOPar ? 0.5 : 0;
  const doacao = velho.q['testamento_solidario'] ? total * PARTE_SOLIDARIA : 0;
  const doConjuge = (total - doacao) * conjuge;
  const imposto = (total - doacao - doConjuge) * IMPOSTO_HERANCA;
  const sai = doacao + doConjuge + imposto;
  const doDinheiro = Math.min(bruto, sai);
  const daEmpresa = Math.min(naEmpresa, sai - doDinheiro);
  const dosBens = Math.max(0, sai - doDinheiro - daEmpresa);
  const fica = bruto > 0 ? (bruto - doDinheiro) / bruto : 0;
  const heranca = { dinheiro: caixa['dinheiro']! * fica } as Record<'dinheiro' | Ativo, number>;
  for (const a of ATIVOS) heranca[a] = (caixa[a] ?? 0) * fica;
  const participacao = naEmpresa > 0 ? (antiga.entidades['empresa']!.n['participacao'] ?? 1) * (1 - daEmpresa / naEmpresa) : 0;
  return { heranca, participacao, deixou: total - sai, doConjuge, imposto, doacao, dosBens };
}

/** Uma pessoa nova da geração do herdeiro (o amigo da vida nova). */
function pessoaNova(e: EstadoVida, c: Conteudo, id: string, nascimento: number): Entidade {
  const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
  const en = novaEntidade({ id, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
  const traco = sortear(e.rng, c.mundo.tracos);
  en.t['traco'] = traco.id;
  en.n['vinculo'] = Math.round(limitar(50 + traco.vinculo + normal(e.rng, 0, 7), 5, 95));
  en.n['saude'] = Math.round(limitar(82 + traco.saude + normal(e.rng, 0, 6), 20, 98));
  en.n['dinheiro'] = 0;
  return en;
}

/** Copiada de outra vida, a entidade passa a ter como causa a abertura da vida nova (o livro antigo ficou para trás). */
function recausar(en: Entidade, id: number): Entidade {
  for (const q of Object.values(en.q)) if (q.causa !== null) q.causa = id;
  return en;
}

/** O tipo de família em que o herdeiro cresceu, lido da vida de quem morreu. */
function familiaDoHerdeiro(antiga: EstadoVida, vinculo: number): string {
  const q = antiga.entidades['eu']!.q;
  if (q['empreendedor'] || q['socio'] || q['herdeiro_negocio'] || parteNaEmpresa(antiga) > 0) return 'empreendedora';
  if (q['grupo_da_igreja'] || q['dizimo']) return 'religiosa';
  if (q['separado'] || vinculo < 40) return 'conflituosa';
  return 'acolhedora';
}

/**
 * A vida nova: o herdeiro no ano em que quem jogava morreu. Determinística
 * (a semente sai da vida anterior). A primeira entrada do livro conta a
 * herança e é a causa do estado inicial, como o nascimento numa vida nova.
 */
export function continuarComoHerdeiro(antiga: EstadoVida, c: Conteudo): EstadoVida {
  const filho = herdeiroPossivel(antiga, c);
  if (!filho) throw new Error('Não há herdeiro para continuar a história.');
  const sobrinho = filho.parentesco === 'sobrinho';
  /** Filho, sobrinho: de sangue. O par e o amigo herdam por testamento e trazem a própria família. */
  const deSangue = filho.parentesco === 'filho' || sobrinho;
  const novosPais = filho.parentesco !== 'filho';
  const comoPersonagem = filho.entidade;
  const velho = antiga.entidades['eu']!;
  const semente = misturar(antiga.semente, antiga.ano, antiga.proximoId);
  const idade = antiga.ano - filho.nascimento;
  const e: EstadoVida = {
    versao: VERSAO_ESTADO,
    semente,
    rng: criarRng(semente),
    // O amigo herda a fortuna, não o sobrenome.
    sobrenome: filho.parentesco === 'amigo' ? sortear(criarRng(misturar(antiga.semente, antiga.ano, 911)), c.mundo.sobrenomes) : antiga.sobrenome,
    anoNascimento: filho.nascimento,
    idade,
    ano: antiga.ano,
    entidades: {},
    agenda: [],
    vistos: {},
    linhasRecentes: [],
    historico: [],
    pendente: null,
    vivo: true,
    morte: null,
    somaFelicidade: 0,
    proximoId: 1,
  };
  const geracao = (antiga.dinastia?.geracao ?? 1) + 1;
  const abertura = novaEntrada(e, { tipo: 'nascimento', causa: 'nascimento', ref: 'herdeiro', texto: '' });

  // ---- quem joga agora
  const espolio = partilhar(antiga, filho.parentesco === 'amor');
  const eu = novaEntidade({ id: 'eu', tipo: 'pessoa', nome: filho.nome, genero: filho.genero, nascimento: filho.nascimento, vivo: true });
  const tracoNpc = c.tracos.get(comoPersonagem?.t['traco'] ?? '');
  const traco = c.tracosJogador.get(tracoNpc?.herdeiro ?? '') ?? c.mundo.tracosJogador[sortearIndice(e.rng, c.mundo.tracosJogador.map((t) => t.peso))]!;
  const patrimonioVelho = patrimonioTotal(antiga);
  const classe = limitar(classeDoPatrimonio(Math.max(0, patrimonioVelho)), 0, c.mundo.classes.length - 1);
  // Com o tio ou a tia, o vínculo é o de quem se via nas festas de família.
  const vinculo = comoPersonagem?.n['vinculo'] ?? 45;
  eu.t['traco'] = traco.id;
  eu.t['familia'] = familiaDoHerdeiro(antiga, vinculo);
  eu.t['ocupacao'] = '';
  eu.t['perfil'] = velho.t['perfil'] ?? '';
  if (!eu.t['perfil']) delete eu.t['perfil'];
  eu.n['classe_origem'] = classe;
  eu.n['riqueza_origem'] = Math.round(patrimonioVelho);
  eu.n['irmaos'] = 0;
  eu.n['saude'] = Math.round(limitar(comoPersonagem?.n['saude'] ?? normal(e.rng, 82, 6) - Math.max(0, idade - 40) * 0.5, 25, 99));
  eu.n['felicidade'] = Math.round(limitar(normal(e.rng, 52, 8) + traco.felicidade, 15, 90));
  const inteligencia = idade < 18 ? 30 + idade * 1.5 + normal(e.rng, 0, 8) : normal(e.rng, 55, 10) + ((velho.n['inteligencia'] ?? 55) - 55) * 0.3;
  eu.n['inteligencia'] = Math.round(limitar(inteligencia + traco.inteligencia, 5, 95));
  eu.n['aparencia'] = Math.round(limitar(normal(e.rng, 50, 12) + traco.aparencia, 8, 97));
  eu.n['dinheiro'] = espolio.heranca.dinheiro + Math.max(0, comoPersonagem?.n['dinheiro'] ?? 0);
  for (const a of ATIVOS) if (espolio.heranca[a] > 0) eu.n[a] = espolio.heranca[a];
  eu.n['divida'] = 0;
  eu.n['renda'] = 0;
  eu.n['custo'] = 0;
  if (idade >= 22) {
    // Um adulto já tem a vida dele: trabalho do tamanho da família em que cresceu, casa própria ou aluguel.
    const def = c.mundo.classes[classe]!;
    const ocupacao = sortear(e.rng, def.ocupacoes);
    eu.t['ocupacao'] = eu.genero === 'f' ? ocupacao.f : ocupacao.m;
    eu.t['setor'] = typeof ocupacao.setor === 'string' ? ocupacao.setor : eu.genero === 'f' ? ocupacao.setor.f : ocupacao.setor.m;
    eu.n['renda'] = Math.round(naFaixa(e, def.renda) * 0.7);
    eu.n['custo'] = Math.round(18000 * (antiga.entidades['lugar']?.n['custo_vida'] ?? 1));
  }
  e.entidades['eu'] = eu;

  // ---- a família do próprio herdeiro: aos 30 ou 40 anos, muita gente já tem par e filhos (a próxima geração)
  const doHerdeiro: Mudanca[] = [];
  if (filho.parentesco === 'amor') {
    eu.q['viuvo'] = { v: 1, ano: e.ano, idade, causa: abertura.id };
    const doCasal = antiga.entidades['filho'];
    if (doCasal && doCasal.vivo !== false) {
      e.entidades['filho'] = recausar(structuredClone(doCasal), abertura.id);
      eu.q['pai_mae'] = { v: 1, ano: doCasal.nascimento ?? e.ano, idade: Math.max(0, idade - (e.ano - (doCasal.nascimento ?? e.ano))), causa: abertura.id };
    }
  } else if (idade >= 22) {
    if (aleatorio(e.rng) < Math.min(0.75, 0.2 + (idade - 22) * 0.04)) {
      criarPersonagem(e, c, 'amor', doHerdeiro);
      const anos = inteiro(e.rng, 1, Math.max(1, Math.min(25, idade - 20)));
      eu.q['namoro'] = { v: 1, ano: e.ano - anos, idade: idade - anos, causa: abertura.id };
      if (anos >= 3 && aleatorio(e.rng) < 0.6) eu.q['casado'] = { v: 1, ano: e.ano - anos + 2, idade: idade - anos + 2, causa: abertura.id };
    }
    if (idade >= 24 && aleatorio(e.rng) < (eu.q['namoro'] ? 0.7 : 0.25)) {
      criarPersonagem(e, c, 'filho', doHerdeiro);
      const idadeFilho = Math.max(0, idade - inteiro(e.rng, 24, Math.min(40, idade)));
      const neto = e.entidades['filho']!;
      neto.nascimento = e.ano - idadeFilho;
      neto.n['vinculo'] = Math.round(limitar(70 + normal(e.rng, 0, 10), 10, 95));
      eu.q['pai_mae'] = { v: 1, ano: neto.nascimento, idade: idade - idadeFilho, causa: abertura.id };
      if (idadeFilho < 22) eu.n['custo'] = (eu.n['custo'] ?? 0) + 12000;
      if (idadeFilho < 14) e.agenda.push({ evento: 'filho_adolescente', ano: e.ano + 14 - idadeFilho, origem: abertura.id });
      if (idadeFilho < 21) e.agenda.push({ evento: 'filho_formatura', ano: e.ano + inteiro(e.rng, 21, 24) - idadeFilho, origem: abertura.id });
    }
  }

  // ---- a família que restou
  const amor = antiga.entidades['amor'];
  if (novosPais) {
    // Quem herda não é filho de quem morreu: os pais são outros (do sobrinho, irmãos de quem morreu; do par e do amigo, a família deles).
    for (const slot of ['mae', 'pai'] as const) {
      const genero: Genero = slot === 'mae' ? 'f' : 'm';
      const nascimento = velho.nascimento! + inteiro(e.rng, -8, 8);
      const vivo = e.ano - nascimento < 92 && aleatorio(e.rng) < Math.max(0.1, 1 - (e.ano - nascimento - 55) / 40);
      const pai = novaEntidade({ id: slot, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo });
      const traco = sortear(e.rng, c.mundo.tracos);
      pai.t['traco'] = traco.id;
      pai.n = { vinculo: Math.round(limitar(60 + traco.vinculo + normal(e.rng, 0, 10), 5, 95)), saude: vivo ? Math.round(limitar(normal(e.rng, 65, 10), 20, 95)) : 0, dinheiro: 0 };
      if (!vivo) {
        pai.morte = Math.min(e.ano, nascimento + inteiro(e.rng, 50, 90));
        pai.q = { faleceu: { v: 1, ano: pai.morte, idade: Math.max(0, pai.morte - filho.nascimento), causa: abertura.id } };
      }
      e.entidades[slot] = pai;
    }
  }
  const slotVelho = velho.genero === 'f' ? 'mae' : 'pai';
  const outroSlot = slotVelho === 'mae' ? 'pai' : 'mae';
  if (!novosPais) {
    const falecido = structuredClone(velho);
    falecido.id = slotVelho;
    falecido.vivo = false;
    falecido.morte = antiga.ano;
    // Morreu agora: o luto é o primeiro capítulo da vida nova.
    falecido.q = { faleceu: { v: 1, ano: e.ano, idade, causa: abertura.id } };
    falecido.n = { vinculo, saude: 0, dinheiro: 0 };
    falecido.t = { ocupacao: velho.t['ocupacao'] ?? '', setor: velho.t['setor'] ?? '' };
    e.entidades[slotVelho] = falecido;
  }
  if (novosPais) {
    // Quem morreu fica no texto e, para o par e o amigo, no lugar que ocupava na vida de quem herda.
    if (filho.parentesco === 'amor' || filho.parentesco === 'amigo') {
      const morto = structuredClone(velho);
      morto.id = filho.parentesco;
      morto.vivo = false;
      morto.morte = antiga.ano;
      morto.q = { faleceu: { v: 1, ano: e.ano, idade, causa: abertura.id } };
      morto.n = { vinculo, saude: 0, dinheiro: 0 };
      morto.t = { ocupacao: velho.t['ocupacao'] ?? '', setor: velho.t['setor'] ?? '' };
      e.entidades[filho.parentesco] = morto;
    }
  } else if (amor) {
    // Quem dividia a vida com quem morreu é o outro pai ou a outra mãe (com a metade do patrimônio, se eram casados).
    const outro = structuredClone(amor);
    outro.id = outroSlot;
    outro.q = Object.fromEntries(Object.entries(amor.q).filter(([k]) => k === 'faleceu' || k === 'doente' || k === 'aposentado' || k === 'desempregado'));
    outro.n['vinculo'] = Math.round(limitar(vinculo + normal(e.rng, 0, 8), 5, 95));
    outro.n['dinheiro'] = Math.max(0, amor.n['dinheiro'] ?? 0) + espolio.doConjuge;
    e.entidades[outroSlot] = recausar(outro, abertura.id);
  } else {
    // Sem ninguém ao lado, o outro pai ou mãe ficou para trás há muito tempo.
    const genero: Genero = outroSlot === 'mae' ? 'f' : 'm';
    const outro = novaEntidade({ id: outroSlot, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento: velho.nascimento! + inteiro(e.rng, -4, 4), vivo: false });
    outro.morte = filho.nascimento + inteiro(e.rng, 0, Math.max(0, idade));
    outro.n = { vinculo: 20, saude: 0, dinheiro: 0 };
    outro.q = { faleceu: { v: 1, ano: outro.morte, idade: outro.morte - filho.nascimento, causa: abertura.id } };
    e.entidades[outroSlot] = outro;
  }
  // Avó ou avô: quem criou quem morreu, se ainda estiver por aqui.
  const avo = deSangue ? ([antiga.entidades['mae'], antiga.entidades['pai']].find((p) => p && p.vivo !== false && !p.q['ausente']) ?? antiga.entidades['mae']) : undefined;
  if (avo) {
    const copia = structuredClone(avo);
    copia.id = 'avo';
    copia.q = Object.fromEntries(Object.entries(avo.q).filter(([k]) => k === 'faleceu' || k === 'doente'));
    copia.n['vinculo'] = Math.round(limitar((avo.n['vinculo'] ?? 60) * 0.8 + 10, 5, 95));
    e.entidades['avo'] = recausar(copia, abertura.id);
  }
  if (filho.parentesco !== 'amigo') e.entidades['amigo'] = pessoaNova(e, c, 'amigo', filho.nascimento + inteiro(e.rng, -1, 1));
  const pet = antiga.entidades['pet'];
  if (pet && pet.vivo !== false) e.entidades['pet'] = recausar(structuredClone(pet), abertura.id);
  for (const id of ['lugar', 'pais'] as const) e.entidades[id] = recausar(structuredClone(antiga.entidades[id]!), abertura.id);
  // A empresa da família passa inteira para o herdeiro (menos o que pagou a partilha), com a idade, a tração e o jeito de tocar.
  const empresa = antiga.entidades['empresa'];
  if (empresa && empresa.vivo !== false && espolio.participacao > 0.001) {
    const copia = recausar(structuredClone(empresa), abertura.id);
    copia.n['participacao'] = espolio.participacao;
    e.entidades['empresa'] = copia;
  }

  // Os bens passam ao herdeiro (sem a mudança: quem herda mora onde já morava). Se a conta e a empresa
  // não pagaram a partilha, os mais baratos são vendidos e a sobra vira dinheiro.
  let falta = espolio.dosBens;
  const herdados = bensDe(antiga).sort((a, b) => (a.n['valor'] ?? 0) - (a.n['financiado'] ?? 0) - ((b.n['valor'] ?? 0) - (b.n['financiado'] ?? 0)));
  for (const b of herdados) {
    const liquido = Math.max(0, (b.n['valor'] ?? 0) - (b.n['financiado'] ?? 0));
    if (falta > 0.5) {
      const usa = Math.min(falta, liquido);
      falta -= usa;
      eu.n['dinheiro'] = (eu.n['dinheiro'] ?? 0) + liquido - usa;
      continue;
    }
    const copia = recausar(structuredClone(b), abertura.id);
    delete copia.q['moradia'];
    copia.n['economia'] = 0;
    e.entidades[b.id] = copia;
    const def = defDoBem(c, b);
    if (def) eu.q[def.marca] = { v: 1, ano: e.ano, idade, causa: abertura.id };
    if (copia.q['alugado']) eu.q['senhorio'] = { v: 1, ano: e.ano, idade, causa: abertura.id };
  }
  // A coroa e o regime passam ao filho: quem morreu reinava, e a sucessão é o primeiro capítulo (storylet da linhagem).
  const coroa = velho.q['monarca'] ? 'monarca' : velho.q['ditador'] ? 'ditador' : null;
  if (coroa && !sobrinho) {
    eu.q[coroa === 'monarca' ? 'principe' : 'herdeiro_regime'] = { v: 1, ano: e.ano, idade, causa: abertura.id };
    const morto = e.entidades[slotVelho];
    if (morto) morto.q[coroa] = { v: 1, ano: e.ano, idade, causa: abertura.id };
  }

  // ---- o que a história lembra
  const reg: Mudanca[] = [];
  if (espolio.deixou >= 1) ganhar(e, reg, 'eu', 'herdou', abertura.id);
  e.entidades['eu']!.q['dinastia'] = { v: geracao, ano: e.ano, idade, causa: abertura.id };
  if (idade >= 22) ganhar(e, reg, 'eu', 'independente', abertura.id);
  if (idade >= 23 && (classe >= 3 || (eu.n['inteligencia'] ?? 0) >= 60)) ganhar(e, reg, 'eu', 'formado', abertura.id);
  if (velho.q['empreendedor'] || velho.q['socio'] || velho.q['herdeiro_negocio'] || e.entidades['empresa']) ganhar(e, reg, 'eu', 'negocio_familiar', abertura.id);

  const antepassado: Antepassado = {
    nome: `${velho.nome} ${antiga.sobrenome}`,
    genero: velho.genero ?? 'm',
    anoNascimento: antiga.anoNascimento,
    anoMorte: antiga.ano,
    idade: antiga.idade,
    causa: antiga.morte?.causa ?? '',
    patrimonio: Math.round(patrimonioVelho),
    deixou: Math.round(espolio.deixou),
  };
  e.dinastia = { geracao, antepassados: [...(antiga.dinastia?.antepassados ?? []), antepassado] };

  const ela = velho.genero === 'f';
  const casados = Boolean(velho.q['casado']);
  const quem = {
    filho: ela ? 'Sua mãe' : 'Seu pai',
    sobrinho: ela ? 'Sua tia' : 'Seu tio',
    amor: casados ? (ela ? 'Sua esposa' : 'Seu marido') : ela ? 'Sua companheira' : 'Seu companheiro',
    amigo: ela ? 'Sua melhor amiga' : 'Seu melhor amigo',
  }[filho.parentesco];
  const doacao = espolio.doacao >= 1 ? `; ${formatarDinheiro(espolio.doacao)} foram para a causa do testamento` : '';
  const metade = doacao ? 'metade do resto' : 'metade de tudo';
  const conjuge = `${doacao}${espolio.doConjuge >= 1 && amor ? `; ${metade} ficou com ${amor.nome}` : ''}`;
  // Sem filhos, quem herda é quem estava no testamento.
  const testamento = filho.parentesco === 'filho' ? '' : 'em testamento ';
  const herdada = e.entidades['empresa'];
  const fatia = herdada?.n['participacao'] ?? 0;
  const naEmpresa = !herdada
    ? ''
    : fatia >= 0.995
      ? ` (${formatarDinheiro(parteNaEmpresa(e))} disso na ${herdada.nome}, que agora é sua)`
      : ` (${formatarDinheiro(parteNaEmpresa(e))} disso em ${Math.round(fatia * 100)}% da ${herdada.nome})`;
  const heranca =
    espolio.deixou >= 1
      ? `deixou ${testamento}${formatarDinheiro(espolio.deixou)} para você${naEmpresa}, depois do imposto${conjuge}`
      : patrimonioVelho < 0
        ? `deixou dívidas, que morreram com ${velho.genero === 'f' ? 'ela' : 'ele'} no inventário, e nenhum centavo`
        : 'não deixou dinheiro, só lembranças';
  const ultimo = antiga.sobrenome.split(' ').at(-1) ?? antiga.sobrenome;
  const par = e.entidades['amor'];
  const neto = e.entidades['filho'];
  const f = eu.genero === 'f';
  const familia = [
    par ? `${eu.q['casado'] ? (f ? 'casada' : 'casado') : 'junto'} com ${par.nome}` : '',
    neto ? `${f ? 'mãe' : 'pai'} de ${neto.nome}, ${e.ano - neto.nascimento!}` : '',
  ].filter(Boolean);
  const vida = familia.length ? `, ${familia.join(' e ')}` : '';
  // A causa da morte foi escrita na vida anterior; quem era "Enzo" lá é "você" aqui.
  const causa = (antiga.morte?.causa ?? '').replace(new RegExp(`\\b${filho.nome}\\b`, 'g'), 'você');
  const fecho =
    filho.parentesco === 'amigo'
      ? `A fortuna dos ${ultimo} agora tem outro sobrenome: o seu.`
      : filho.parentesco === 'amor'
        ? `A história da família ${ultimo} continua com você.`
        : `Geração ${geracao} da família ${ultimo}.`;
  abertura.texto = `Você é ${eu.nome} ${e.sobrenome}, ${idade === 1 ? '1 ano' : `${idade} anos`}${vida}. ${quem}, ${velho.nome}, morreu ${causa}. ${capitalizar(heranca)}. ${fecho}`;
  abertura.resumo = espolio.deixou >= 1 ? `herdou ${formatarDinheiro(espolio.deixou)} da família` : 'começou sem herança';
  lancar(e, abertura, []);
  // A influência começa onde a vida nova está (patrimônio, bens, linhagem), não do zero.
  eu.n['influencia'] = Math.round(influenciaAlvo(e, c));
  return e;
}
