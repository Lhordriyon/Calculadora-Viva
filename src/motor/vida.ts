/**
 * O ciclo da vida: nascer → (ficha do ano) → +1 ano → regras (economia,
 * empresa, corpo, trabalho) → personagens agem → o diretor escolhe →
 * escolha → efeitos. Funções puras sobre o estado
 * (mutam o objeto recebido; a interface clona antes).
 */
import { regraDoPadrao, regraDoTrabalho } from './trabalho.ts';
import { ATRIBUTOS, FILHOS, type Ativo } from './constantes.ts';
import { patrimonioTotal } from './campos.ts';
import { atende } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { escolherDoAno, type Candidato } from './diretor.ts';
import { mercadoDoAno } from './carteira.ts';
import { anoDoPais, bolsoDoPais, escolaPublica, fatorDaSaudePublica, paisInicial, riscoDeViolencia, type Momento } from './pais.ts';
import { economiaDoAno, padraoDe, type Ano as AnoEconomico } from './economia.ts';
import { anoDoExterior, exteriorInicial, type Exterior } from './diplomacia.ts';
import { regraDaEmpresa } from './empresa.ts';
import { confortoDosBens, regraDosBens } from './bens.ts';
import { regraDasDividas } from './dividas.ts';
import { regraDoTesouro } from './tesouro.ts';
import { regraDaCoroa } from './coroa.ts';
import { regraDaPesquisa } from './pesquisa.ts';
import { regraDaGuerra } from './guerra.ts';
import { regraDaCarreira } from './carreira.ts';
import { regraDoPoder } from './poder.ts';
import { personagensAgem, regraDoAmor, regrasDosPersonagens } from './familia.ts';
import { ganhar, lancar, perder, somar } from './livro.ts';
import { morrer } from './morte.ts';
import { ETAPAS_DO_ANO, type IdEtapa } from './manifesto.ts';
import { gerarOrigem, limparNome, type EscolhaOrigem } from './origem.ts';
import { novaEntidade } from './pessoas.ts';
import {
  FELICIDADE_BASE,
  FELICIDADE_DO_PADRAO,
  IDADE_MAXIMA,
  PATRIMONIO_CONFORTO,
  CONFORTO_FELICIDADE,
  PESO_CONFORTO_BENS,
  PESO_VINCULO_FELICIDADE,
  TETO_VINCULO_FELICIDADE,
  PRIVACAO_FELICIDADE,
  RETORNO_FELICIDADE,
  derivaAparencia,
  derivaInteligencia,
  derivaSaude,
  dividaPesada,
  riscoDeMorte,
} from './regras.ts';
import { aleatorio, criarRng, normal, sortear, sortearIndice } from './rng.ts';
import { aplicarStorylet, apresentarStorylet } from './storylets.ts';
import { renderizar } from './texto.ts';
import { VERSAO_ESTADO, type EstadoVida, type Genero, type MemoriaJogador, type Mudanca } from './tipos.ts';

export { escolher, chanceDeSucesso } from './storylets.ts';
export { agir, acoesDisponiveis } from './acoes.ts';
export { morrer } from './morte.ts';

/** Quantas linhas recentes não podem voltar. */
const MEMORIA_LINHAS = 15;
/** A perda do dinheiro parado para a inflação só aparece a partir deste valor. */
const LIMITE_CHIP_INFLACAO = 200;
/** Quem está perto pesa na felicidade de base (vínculo médio). */
const PERTO = ['mae', 'pai', 'avo', 'amigo', 'amor', ...FILHOS] as const;

export interface OpcoesNascimento {
  semente: number;
  /** Ano de nascimento (a interface usa o ano atual). */
  ano: number;
  /** Classe e tipo de família escolhidos (opcional: sem isso, sorteia). */
  origem?: EscolhaOrigem;
}

// ---------------------------------------------------------------- nascimento

/** Os textos de nascimento que a origem permite; os de uma linhagem (que pedem a qualidade dela) passam na frente. */
function textosDeNascimento(e: EstadoVida, c: Conteudo): Conteudo['mundo']['nascimento'] {
  const possiveis = c.mundo.nascimento.filter((n) => atende(n.se, e));
  const proprios = possiveis.filter((n) => (n.se?.marcas?.length ?? 0) > 0);
  return proprios.length > 0 ? proprios : possiveis;
}

export function nascer(c: Conteudo, op: OpcoesNascimento): EstadoVida {
  const rng = criarRng(op.semente);
  const escolha = op.origem;
  const genero: Genero = escolha?.genero === 'f' || escolha?.genero === 'm' ? escolha.genero : aleatorio(rng) < 0.5 ? 'f' : 'm';
  const e: EstadoVida = {
    versao: VERSAO_ESTADO,
    semente: op.semente,
    rng,
    sobrenome: '',
    anoNascimento: op.ano,
    idade: 0,
    ano: op.ano,
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
  const nome = limparNome(escolha?.nome) || sortear(rng, c.mundo.nomes[genero]);
  e.entidades['eu'] = novaEntidade({ id: 'eu', tipo: 'pessoa', nome, genero, nascimento: op.ano, vivo: true });
  e.sobrenome = limparNome(escolha?.sobrenome) || `${sortear(rng, c.mundo.sobrenomes)} ${sortear(rng, c.mundo.sobrenomes)}`;
  gerarOrigem(e, c, op.origem);
  paisInicial(e, c);
  exteriorInicial(e, c);
  e.historico.push({
    id: 0,
    idade: 0,
    ano: op.ano,
    tipo: 'nascimento',
    causa: 'nascimento',
    texto: renderizar(sortear(rng, textosDeNascimento(e, c)).texto, contexto(e)),
  });
  return e;
}

// ---------------------------------------------------------------- +1 ano

/** Felicidade de base: o ponto para onde ela volta, pelo traço, pelo padrão de vida e pelo vínculo com quem está perto. */
export function felicidadeDeBase(e: EstadoVida, c: Conteudo): number {
  const eu = e.entidades['eu']!;
  const traco = c.tracosJogador.get(eu.t['traco'] ?? '');
  const vinculos = PERTO.map((p) => e.entidades[p]).filter((x) => x && x.vivo !== false && !x.q['ausente']).map((x) => x!.n['vinculo'] ?? 50);
  const media = vinculos.length > 0 ? vinculos.reduce((s, v) => s + v, 0) / vinculos.length : 30;
  // O padrão de vida só pesa para quem já se sustenta (antes dos 18, a família decide).
  const padrao = e.idade >= 18 ? FELICIDADE_DO_PADRAO[padraoDe(e)] : 0;
  // A casa onde mora, o carro, o iate: os bens de quem joga deixam a vida mais confortável (com teto).
  const bens = PESO_CONFORTO_BENS * confortoDosBens(e, c);
  return FELICIDADE_BASE + (traco?.base ?? 0) + padrao + bens + (Math.min(media, TETO_VINCULO_FELICIDADE) - 50) * PESO_VINCULO_FELICIDADE;
}

function envelhecer(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const a = eu.n;
  const r = e.rng;
  somar(e, reg, 'eu', 'saude', derivaSaude(e.idade, a['saude'] ?? 70) + normal(r, 0, 1.2), 'idade');
  somar(e, reg, 'eu', 'felicidade', (felicidadeDeBase(e, c) - (a['felicidade'] ?? 60)) * RETORNO_FELICIDADE + normal(r, 0, 2.5), 'humor');
  somar(e, reg, 'eu', 'inteligencia', derivaInteligencia(e.idade), 'idade');
  // A escola pública que o país mantém (dos 6 aos 17, para quem não está na particular).
  const escola = escolaPublica(e);
  if (escola !== 0) somar(e, reg, 'eu', 'inteligencia', escola, 'escola');
  somar(e, reg, 'eu', 'aparencia', derivaAparencia(e.idade) + normal(r, 0, 0.8), 'idade');
  for (const m of Object.keys(eu.q)) {
    const porAno = c.marcas[m]?.porAno;
    if (!porAno) continue;
    for (const at of ATRIBUTOS) if (porAno[at]) somar(e, reg, 'eu', at, porAno[at]!, 'qualidades');
  }
  if (e.idade >= 18) {
    if ((a['divida'] ?? 0) > dividaPesada(a['renda'] ?? 0)) {
      somar(e, reg, 'eu', 'felicidade', -1.5, 'economia');
      somar(e, reg, 'eu', 'saude', -0.3, 'economia');
    }
    if (patrimonioTotal(e) > PATRIMONIO_CONFORTO) somar(e, reg, 'eu', 'felicidade', CONFORTO_FELICIDADE, 'economia');
  }
}

/**
 * A chance de morrer no ano: a do corpo (que a saúde pública alivia ou agrava para quem depende dela; com saúde
 * zero, nada salva) e a da violência do país.
 */
export function chanceDeMorrer(e: EstadoVida): { corpo: number; violencia: number } {
  const corpo = riscoDeMorte(e.idade, e.entidades['eu']!.n['saude'] ?? 0);
  return { corpo: corpo >= 1 ? 1 : Math.min(1, corpo * fatorDaSaudePublica(e)), violencia: riscoDeViolencia(e) };
}

/** O que as etapas do ano passam umas às outras (vida.ts › ETAPAS; a ordem e o que cada uma lê e escreve estão em manifesto.ts › ETAPAS_DO_ANO). */
interface Ano {
  e: EstadoVida;
  c: Conteudo;
  memoria: MemoriaJogador | undefined;
  /** As regras miúdas do ano: vão para uma entrada invisível do livro (a etapa `regras`). */
  reg: Mudanca[];
  /** Onde o livro deste ano começa. */
  inicio: number;
  idRegras: number;
  exterior?: Exterior;
  fase?: Momento;
  mercado?: Record<Ativo, number>;
  economia?: AnoEconomico;
  /** Quanto a inflação comeu, quando passa de LIMITE_CHIP_INFLACAO (o chip na linha do tempo). */
  inflacao?: number | undefined;
  dePersonagens: Candidato[];
  /** O ano terminou: a vida acabou ou o storylet do ano já aconteceu. */
  fim: boolean;
}

/** As etapas do ano. A ordem é a de manifesto.ts › ETAPAS_DO_ANO, e o teste confere que nenhuma lê ou escreve o que não declarou. */
const ETAPAS: Record<IdEtapa, (x: Ano) => void> = {
  // O mundo lá fora e o país primeiro: quem governa, as estatísticas, o dólar e a fase valem para a economia, os empregos e os storylets do ano.
  exterior: (x) => {
    x.exterior = anoDoExterior(x.e, x.c, x.reg);
  },
  // A defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba (guerra.ts); o país do ano já a sente.
  guerra: (x) => regraDaGuerra(x.e, x.c),
  pais: (x) => {
    x.fase = anoDoPais(x.e, x.c, x.reg, x.exterior);
    x.idRegras = x.e.proximoId++;
  },
  // A pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros (pesquisa.ts).
  pesquisa: (x) => regraDaPesquisa(x.e, x.c),
  mercado: (x) => {
    x.mercado = mercadoDoAno(x.e, x.c, x.fase!.id, x.reg, x.fase!.cambio);
  },
  economia: (x) => {
    x.economia = economiaDoAno(x.e, x.reg, bolsoDoPais(x.e, x.c), x.mercado);
    x.inflacao = x.economia.comida >= LIMITE_CHIP_INFLACAO ? x.economia.comida : undefined;
  },
  empresa: (x) => regraDaEmpresa(x.e, x.c, x.fase!, x.reg, x.mercado),
  bens: (x) => regraDosBens(x.e, x.c, x.reg),
  // Os títulos do Tesouro: o cupom do ano cai na conta e o que venceu volta (tesouro.ts).
  tesouro: (x) => regraDoTesouro(x.e, x.reg),
  // As dívidas no fim do ano (dividas.ts): a parcela do acordo, o limite, o que caduca e o nome.
  dividas: (x) => regraDasDividas(x.e, x.c, x.reg),
  privacao: (x) => {
    if (x.economia!.privacao) {
      somar(x.e, x.reg, 'eu', 'felicidade', -PRIVACAO_FELICIDADE, 'economia');
      ganhar(x.e, x.reg, 'eu', 'privacao', x.idRegras, 'economia');
    } else {
      perder(x.e, x.reg, 'eu', 'privacao', 'economia');
    }
  },
  corpo: (x) => envelhecer(x.e, x.c, x.reg),
  personagens: (x) => regrasDosPersonagens(x.e, x.c, x.reg, x.fase!),
  trabalho: (x) => regraDoTrabalho(x.e, x.c, x.fase!, x.reg),
  carreira: (x) => regraDaCarreira(x.e, x.c, x.reg),
  poder: (x) => regraDoPoder(x.e, x.c, x.fase!, x.reg),
  // A coroa: a ilha anda e quem tem coroa recebe a dotação da forma escolhida (coroa.ts).
  coroa: (x) => regraDaCoroa(x.e, x.c, x.reg),
  padrao: (x) => regraDoPadrao(x.e, x.c, x.economia!.deficit),
  // As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do livro.
  regras: (x) => {
    x.e.somaFelicidade += x.e.entidades['eu']!.n['felicidade'] ?? 0;
    lancar(x.e, { id: x.idRegras, idade: x.e.idade, ano: x.e.ano, tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' }, x.reg);
  },
  morte: (x) => {
    const chance = chanceDeMorrer(x.e);
    const sorte = aleatorio(x.e.rng);
    if (x.e.idade >= IDADE_MAXIMA || sorte < chance.corpo) morrer(x.e, x.c);
    else if (sorte < chance.corpo + chance.violencia) morrer(x.e, x.c, { categoria: 'violencia', sortear: true });
    x.fim = !x.e.vivo;
  },
  amor: (x) => regraDoAmor(x.e, x.c),
  iniciativas: (x) => {
    x.dePersonagens = personagensAgem(x.e, x.c, x.memoria);
    x.fim = !x.e.vivo;
  },
  diretor: (x) => {
    const { e, c } = x;
    const escolhido = escolherDoAno(e, c, x.memoria, x.dePersonagens);
    if (escolhido?.s.escolhas) {
      apresentarStorylet(e, escolhido.s, escolhido.ator, escolhido.causa, escolhido.causas, x.inflacao);
      return;
    }
    if (escolhido) {
      aplicarStorylet(e, c, escolhido.s, escolhido.ator, escolhido.causa, { causas: escolhido.causas, inflacao: x.inflacao });
      return;
    }
    const visiveis = e.historico.slice(x.inicio).filter((h) => h.tipo !== 'regra');
    if (visiveis.length === 0) registrarLinha(e, c, x.inflacao);
    else if (x.inflacao !== undefined) visiveis[visiveis.length - 1]!.inflacao = x.inflacao;
  },
};

/**
 * Quem observa as etapas do ano (o teste das declarações, o túnel que mede o custo de cada uma). Não muda nada na vida:
 * só olha antes e depois.
 */
export interface ObservadorDoAno {
  antes?(etapa: IdEtapa, e: EstadoVida, reg: readonly Mudanca[]): void;
  depois?(etapa: IdEtapa, e: EstadoVida, reg: readonly Mudanca[]): void;
  /** Troca o que as etapas passam umas às outras por um embrulho que vê o que a etapa leu e deixou (`ano.fase`…). */
  embrulhar?(etapa: IdEtapa, ano: object): object;
}

let observador: ObservadorDoAno | null = null;

/** Liga (ou desliga, com null) o observador das etapas do ano. */
export function observarOAno(o: ObservadorDoAno | null): void {
  observador = o;
}

/** Um ano: as etapas de manifesto.ts › ETAPAS_DO_ANO, na ordem, até a vida acabar ou o storylet do ano acontecer. */
export function avancarAno(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): void {
  if (!e.vivo) throw new Error('Esta vida já terminou.');
  if (e.pendente) throw new Error('Há uma escolha esperando resposta.');
  e.idade++;
  e.ano++;
  const x: Ano = { e, c, memoria, reg: [], inicio: e.historico.length, idRegras: -1, dePersonagens: [], fim: false };
  for (const { id } of ETAPAS_DO_ANO) {
    observador?.antes?.(id, e, x.reg);
    ETAPAS[id](observador?.embrulhar ? (observador.embrulhar(id, x) as Ano) : x);
    observador?.depois?.(id, e, x.reg);
    if (x.fim) return;
  }
}

// ---------------------------------------------------------------- anos sem evento

function registrarLinha(e: EstadoVida, c: Conteudo, inflacao?: number): void {
  const candidatas = c.linhasPorIdade[Math.min(e.idade, IDADE_MAXIMA)] ?? [];
  const pesos = candidatas.map((i) => {
    const l = c.linhas[i]!;
    return !e.linhasRecentes.includes(i) && atende(l.condicoes, e) ? (l.peso ?? 1) : 0;
  });
  const sorteada = sortearIndice(e.rng, pesos);
  const i = sorteada >= 0 ? candidatas[sorteada]! : -1;
  let texto = 'Um ano sem novidade nenhuma. Às vezes é bom.';
  if (i >= 0) {
    texto = renderizar(c.linhas[i]!.texto, contexto(e));
    e.linhasRecentes.push(i);
    if (e.linhasRecentes.length > MEMORIA_LINHAS) e.linhasRecentes.shift();
  }
  e.historico.push({
    id: e.proximoId++,
    idade: e.idade,
    ano: e.ano,
    tipo: 'linha',
    causa: 'diretor',
    ref: i >= 0 ? `linha:${i}` : 'linha',
    texto,
    ...(inflacao !== undefined ? { inflacao } : {}),
  });
}
