/**
 * O ciclo da vida: nascer → (ficha do ano) → +1 ano → regras → personagens
 * agem → o diretor escolhe → escolha → efeitos. Funções puras sobre o estado
 * (mutam o objeto recebido; a interface clona antes).
 */
import { cicloDoAno, sortearFaseInicial } from './ciclo.ts';
import { regraDoPadrao, regraDoTrabalho } from './trabalho.ts';
import { ATRIBUTOS } from './constantes.ts';
import { patrimonioDe } from './campos.ts';
import { atende } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { escolherDoAno } from './diretor.ts';
import { economiaDoAno } from './economia.ts';
import { personagensAgem, regraDoAmor, regrasDosPersonagens } from './familia.ts';
import { ganhar, lancar, perder, somar } from './livro.ts';
import { morrer } from './morte.ts';
import { gerarOrigem, type EscolhaOrigem } from './origem.ts';
import { novaEntidade } from './pessoas.ts';
import {
  FELICIDADE_BASE,
  IDADE_MAXIMA,
  PATRIMONIO_CONFORTO,
  CONFORTO_FELICIDADE,
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
const PERTO = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho'] as const;

export interface OpcoesNascimento {
  semente: number;
  /** Ano de nascimento (a interface usa o ano atual). */
  ano: number;
  /** Classe e tipo de família escolhidos (opcional: sem isso, sorteia). */
  origem?: EscolhaOrigem;
}

// ---------------------------------------------------------------- nascimento

export function nascer(c: Conteudo, op: OpcoesNascimento): EstadoVida {
  const rng = criarRng(op.semente);
  const genero: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
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
  e.entidades['eu'] = novaEntidade({ id: 'eu', tipo: 'pessoa', nome: sortear(rng, c.mundo.nomes[genero]), genero, nascimento: op.ano, vivo: true });
  e.sobrenome = `${sortear(rng, c.mundo.sobrenomes)} ${sortear(rng, c.mundo.sobrenomes)}`;
  gerarOrigem(e, c, op.origem);
  sortearFaseInicial(e, c);
  e.historico.push({
    id: 0,
    idade: 0,
    ano: op.ano,
    tipo: 'nascimento',
    causa: 'nascimento',
    texto: renderizar(sortear(rng, c.mundo.nascimento.filter((n) => atende(n.se, e))).texto, contexto(e)),
  });
  return e;
}

// ---------------------------------------------------------------- +1 ano

/** Felicidade de base: o ponto para onde ela volta, pelo traço e pelo vínculo com quem está perto. */
export function felicidadeDeBase(e: EstadoVida, c: Conteudo): number {
  const eu = e.entidades['eu']!;
  const traco = c.tracosJogador.get(eu.t['traco'] ?? '');
  const vinculos = PERTO.map((p) => e.entidades[p]).filter((x) => x && x.vivo !== false && !x.q['ausente']).map((x) => x!.n['vinculo'] ?? 50);
  const media = vinculos.length > 0 ? vinculos.reduce((s, v) => s + v, 0) / vinculos.length : 30;
  return FELICIDADE_BASE + (traco?.base ?? 0) + (Math.min(media, TETO_VINCULO_FELICIDADE) - 50) * PESO_VINCULO_FELICIDADE;
}

function envelhecer(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const a = eu.n;
  const r = e.rng;
  somar(e, reg, 'eu', 'saude', derivaSaude(e.idade, a['saude'] ?? 70) + normal(r, 0, 1.2), 'idade');
  somar(e, reg, 'eu', 'felicidade', (felicidadeDeBase(e, c) - (a['felicidade'] ?? 60)) * RETORNO_FELICIDADE + normal(r, 0, 2.5), 'humor');
  somar(e, reg, 'eu', 'inteligencia', derivaInteligencia(e.idade), 'idade');
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
    if (patrimonioDe(eu) > PATRIMONIO_CONFORTO) somar(e, reg, 'eu', 'felicidade', CONFORTO_FELICIDADE, 'economia');
  }
}

export function avancarAno(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): void {
  if (!e.vivo) throw new Error('Esta vida já terminou.');
  if (e.pendente) throw new Error('Há uma escolha esperando resposta.');
  e.idade++;
  e.ano++;
  const eu = e.entidades['eu']!;
  const inicio = e.historico.length;
  // O país primeiro: a fase do ciclo vale para a economia, os empregos e os storylets do ano.
  const fase = cicloDoAno(e, c);
  const regAno: Mudanca[] = [];
  const idRegras = e.proximoId++;

  const ano = economiaDoAno(e, e.rng, regAno, fase);
  const inflacao = ano.comida >= LIMITE_CHIP_INFLACAO ? ano.comida : undefined;
  if (ano.privacao) {
    somar(e, regAno, 'eu', 'felicidade', -PRIVACAO_FELICIDADE, 'economia');
    ganhar(e, regAno, 'eu', 'privacao', idRegras, 'economia');
  } else {
    perder(e, regAno, 'eu', 'privacao', 'economia');
  }
  envelhecer(e, c, regAno);
  regrasDosPersonagens(e, c, regAno, fase);
  regraDoTrabalho(e, c, fase, regAno);
  regraDoPadrao(e, c, ano.deficit);
  e.somaFelicidade += eu.n['felicidade'] ?? 0;
  // As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do livro.
  lancar(e, { id: idRegras, idade: e.idade, ano: e.ano, tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' }, regAno);

  if (e.idade >= IDADE_MAXIMA || aleatorio(e.rng) < riscoDeMorte(e.idade, eu.n['saude'] ?? 0)) {
    morrer(e, c);
    return;
  }
  regraDoAmor(e, c);
  const dePersonagens = personagensAgem(e, c, memoria);
  if (!e.vivo) return;
  const escolhido = escolherDoAno(e, c, memoria, dePersonagens);
  if (escolhido?.s.escolhas) {
    apresentarStorylet(e, escolhido.s, escolhido.ator, escolhido.causa, escolhido.causas, inflacao);
    return;
  }
  if (escolhido) {
    aplicarStorylet(e, c, escolhido.s, escolhido.ator, escolhido.causa, { causas: escolhido.causas, inflacao });
    return;
  }
  const visiveis = e.historico.slice(inicio).filter((h) => h.tipo !== 'regra');
  if (visiveis.length === 0) registrarLinha(e, c, inflacao);
  else if (inflacao !== undefined) visiveis[visiveis.length - 1]!.inflacao = inflacao;
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
