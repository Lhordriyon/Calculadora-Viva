/**
 * A dinastia. Quando a vida termina e há filho ou filha viva, a história pode
 * continuar com essa pessoa, no mesmo mundo: a mesma cidade, o país na mesma
 * fase, a família que restou. O herdeiro recebe o que sobrou depois das
 * dívidas (que morrem com o espólio), do imposto sobre herança e da metade de
 * quem era casado com quem morreu; leva o traço que já tinha como personagem
 * e o vínculo que construíram. Cada geração guarda as anteriores, e o cartão
 * da vida conta a fortuna da família de geração em geração.
 */
import { ATIVOS, type Ativo } from './constantes.ts';
import { classeDoPatrimonio, patrimonioDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { resgatarDe } from './economia.ts';
import { ganhar, lancar, novaEntrada } from './livro.ts';
import { criarPersonagem, nomeLivre, novaEntidade } from './pessoas.ts';
import { ANOS_UNIAO } from './regras.ts';
import { aleatorio, criarRng, inteiro, misturar, normal, sortear, sortearIndice } from './rng.ts';
import { capitalizar, formatarDinheiro } from './texto.ts';
import { VERSAO_ESTADO, type Antepassado, type Entidade, type EstadoVida, type Genero, type Mudanca } from './tipos.ts';

export type { Antepassado, Dinastia } from './tipos.ts';

/** Imposto sobre herança (o ITCMD dos estados fica entre 4% e 8%). */
export const IMPOSTO_HERANCA = 0.04;

/** O filho ou a filha que pode continuar a história (vivo, com a vida de quem joga terminada). */
export function herdeiroPossivel(e: EstadoVida): Entidade | null {
  if (e.vivo) return null;
  const f = e.entidades['filho'];
  return f && f.vivo !== false && f.nascimento !== undefined && e.ano - f.nascimento >= 0 ? f : null;
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
  deixou: number;
  /** A metade de quem era casado (ou vivia junto há anos) com quem morreu. */
  doConjuge: number;
  imposto: number;
}

/** Paga as dívidas com o espólio, separa a metade do cônjuge e o imposto; o resto é do herdeiro. */
function partilhar(antiga: EstadoVida): Espolio {
  const velho = antiga.entidades['eu']!;
  const caixa: Record<string, number> = { dinheiro: Math.max(0, velho.n['dinheiro'] ?? 0) };
  for (const a of ATIVOS) caixa[a] = velho.n[a] ?? 0;
  let divida = velho.n['divida'] ?? 0;
  const daConta = Math.min(caixa['dinheiro']!, divida);
  caixa['dinheiro']! -= daConta;
  divida -= daConta;
  resgatarDe(caixa, divida);
  const bruto = caixa['dinheiro']! + ATIVOS.reduce((s, a) => s + (caixa[a] ?? 0), 0);
  const amor = antiga.entidades['amor'];
  const namoro = velho.q['namoro'];
  const casal = amor?.vivo !== false && amor !== undefined && (velho.q['casado'] !== undefined || (namoro !== undefined && antiga.idade - namoro.idade >= ANOS_UNIAO));
  const conjuge = casal ? 0.5 : 0;
  const parte = (1 - conjuge) * (1 - IMPOSTO_HERANCA);
  const heranca = { dinheiro: caixa['dinheiro']! * parte } as Record<'dinheiro' | Ativo, number>;
  for (const a of ATIVOS) heranca[a] = (caixa[a] ?? 0) * parte;
  return { heranca, deixou: bruto * parte, doConjuge: bruto * conjuge, imposto: bruto * (1 - conjuge) * IMPOSTO_HERANCA };
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
  if (q['empreendedor'] || q['socio'] || q['herdeiro_negocio']) return 'empreendedora';
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
  const filho = herdeiroPossivel(antiga);
  if (!filho) throw new Error('Não há herdeiro para continuar a história.');
  const velho = antiga.entidades['eu']!;
  const semente = misturar(antiga.semente, antiga.ano, antiga.proximoId);
  const idade = antiga.ano - filho.nascimento!;
  const e: EstadoVida = {
    versao: VERSAO_ESTADO,
    semente,
    rng: criarRng(semente),
    sobrenome: antiga.sobrenome,
    anoNascimento: filho.nascimento!,
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
  const espolio = partilhar(antiga);
  const eu = novaEntidade({ id: 'eu', tipo: 'pessoa', nome: filho.nome, genero: filho.genero ?? 'm', nascimento: filho.nascimento!, vivo: true });
  const tracoNpc = c.tracos.get(filho.t['traco'] ?? '');
  const traco = c.tracosJogador.get(tracoNpc?.herdeiro ?? '') ?? c.mundo.tracosJogador[sortearIndice(e.rng, c.mundo.tracosJogador.map((t) => t.peso))]!;
  const patrimonioVelho = patrimonioDe(velho);
  const classe = limitar(classeDoPatrimonio(Math.max(0, patrimonioVelho)), 0, c.mundo.classes.length - 1);
  const vinculo = filho.n['vinculo'] ?? 60;
  eu.t['traco'] = traco.id;
  eu.t['familia'] = familiaDoHerdeiro(antiga, vinculo);
  eu.t['ocupacao'] = '';
  eu.t['perfil'] = velho.t['perfil'] ?? '';
  if (!eu.t['perfil']) delete eu.t['perfil'];
  eu.n['classe_origem'] = classe;
  eu.n['riqueza_origem'] = Math.round(patrimonioVelho);
  eu.n['irmaos'] = 0;
  eu.n['saude'] = Math.round(limitar(filho.n['saude'] ?? 80, 25, 99));
  eu.n['felicidade'] = Math.round(limitar(normal(e.rng, 52, 8) + traco.felicidade, 15, 90));
  const inteligencia = idade < 18 ? 30 + idade * 1.5 + normal(e.rng, 0, 8) : normal(e.rng, 55, 10) + ((velho.n['inteligencia'] ?? 55) - 55) * 0.3;
  eu.n['inteligencia'] = Math.round(limitar(inteligencia + traco.inteligencia, 5, 95));
  eu.n['aparencia'] = Math.round(limitar(normal(e.rng, 50, 12) + traco.aparencia, 8, 97));
  eu.n['dinheiro'] = espolio.heranca.dinheiro + Math.max(0, filho.n['dinheiro'] ?? 0);
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
  if (idade >= 22) {
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
  const slotVelho = velho.genero === 'f' ? 'mae' : 'pai';
  const outroSlot = slotVelho === 'mae' ? 'pai' : 'mae';
  const falecido = structuredClone(velho);
  falecido.id = slotVelho;
  falecido.vivo = false;
  falecido.morte = antiga.ano;
  // Morreu agora: o luto é o primeiro capítulo da vida nova.
  falecido.q = { faleceu: { v: 1, ano: e.ano, idade, causa: abertura.id } };
  falecido.n = { vinculo, saude: 0, dinheiro: 0 };
  falecido.t = { ocupacao: velho.t['ocupacao'] ?? '', setor: velho.t['setor'] ?? '' };
  e.entidades[slotVelho] = falecido;
  const amor = antiga.entidades['amor'];
  if (amor) {
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
    outro.morte = filho.nascimento! + inteiro(e.rng, 0, Math.max(0, idade));
    outro.n = { vinculo: 20, saude: 0, dinheiro: 0 };
    outro.q = { faleceu: { v: 1, ano: outro.morte, idade: outro.morte - filho.nascimento!, causa: abertura.id } };
    e.entidades[outroSlot] = outro;
  }
  // Avó ou avô: quem criou quem morreu, se ainda estiver por aqui.
  const avo = [antiga.entidades['mae'], antiga.entidades['pai']].find((p) => p && p.vivo !== false && !p.q['ausente']) ?? antiga.entidades['mae'];
  if (avo) {
    const copia = structuredClone(avo);
    copia.id = 'avo';
    copia.q = Object.fromEntries(Object.entries(avo.q).filter(([k]) => k === 'faleceu' || k === 'doente'));
    copia.n['vinculo'] = Math.round(limitar((avo.n['vinculo'] ?? 60) * 0.8 + 10, 5, 95));
    e.entidades['avo'] = recausar(copia, abertura.id);
  }
  e.entidades['amigo'] = pessoaNova(e, c, 'amigo', filho.nascimento! + inteiro(e.rng, -1, 1));
  const pet = antiga.entidades['pet'];
  if (pet && pet.vivo !== false) e.entidades['pet'] = recausar(structuredClone(pet), abertura.id);
  for (const id of ['lugar', 'pais'] as const) e.entidades[id] = recausar(structuredClone(antiga.entidades[id]!), abertura.id);

  // ---- o que a história lembra
  const reg: Mudanca[] = [];
  if (espolio.deixou >= 1) ganhar(e, reg, 'eu', 'herdou', abertura.id);
  e.entidades['eu']!.q['dinastia'] = { v: geracao, ano: e.ano, idade, causa: abertura.id };
  if (idade >= 22) ganhar(e, reg, 'eu', 'independente', abertura.id);
  if (idade >= 23 && (classe >= 3 || (eu.n['inteligencia'] ?? 0) >= 60)) ganhar(e, reg, 'eu', 'formado', abertura.id);
  if (velho.q['empreendedor'] || velho.q['socio'] || velho.q['herdeiro_negocio']) ganhar(e, reg, 'eu', 'negocio_familiar', abertura.id);

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

  const quem = velho.genero === 'f' ? 'Sua mãe' : 'Seu pai';
  const conjuge = espolio.doConjuge >= 1 && amor ? `; metade de tudo ficou com ${amor.nome}` : '';
  const heranca =
    espolio.deixou >= 1
      ? `deixou ${formatarDinheiro(espolio.deixou)} para você, depois do imposto${conjuge}`
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
  abertura.texto = `Você é ${eu.nome} ${e.sobrenome}, ${idade === 1 ? '1 ano' : `${idade} anos`}${vida}. ${quem}, ${velho.nome}, morreu ${causa}. ${capitalizar(heranca)}. Geração ${geracao} da família ${ultimo}.`;
  abertura.resumo = espolio.deixou >= 1 ? `herdou ${formatarDinheiro(espolio.deixou)} da família` : 'começou sem herança';
  lancar(e, abertura, []);
  return e;
}
