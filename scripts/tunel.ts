/**
 * npm run tunel — túnel de vento. Robôs jogam 10.000 vidas (4 estratégias ×
 * 125 jogadores × 20 vidas seguidas, com a memória entre vidas que o jogo usa)
 * e o relatório vai para docs/metricas.md.
 *
 * Opções: --vidas=N (total aproximado), --sem-arquivo, --semente=N, --paralelo=N (trabalhadores; 1 roda tudo aqui).
 * Só o túnel inteiro escreve docs/metricas.md; um parcial (outro total ou outra semente) escreve dist-tunel.md.
 * Sai com código 1 se uma meta quebrar: storylet morto, storylet
 * não-repetível repetido na mesma vida ou estratégia fixa dominante.
 */
import { writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { Worker } from 'node:worker_threads';
import { join } from 'node:path';
import { carregarConteudo, RAIZ } from './disco.ts';
import { tipoDe } from '../src/motor/conteudo.ts';
import { anoDoPais, ESTATISTICAS, momentoTipico, type Estatistica } from '../src/motor/pais.ts';
import { ATIVOS, CLASSES, FASES, type Fase } from '../src/motor/constantes.ts';
import { mercadoDoAno, motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { BOLSOS, EMPRESA_TIPICA, ESTRATEGIAS, NOMES_DOS_BOLSOS, arriscarNaoCompensa, falsosDilemas, type Bolso, type Estrategia } from '../src/motor/robos.ts';
import { misturar } from '../src/motor/rng.ts';
import { listarCadeias } from '../src/motor/validacao.ts';
import { nascer } from '../src/motor/vida.ts';
import { dependenciasDoAno, ETAPAS_DO_ANO, type IdEtapa } from '../src/motor/manifesto.ts';
import { empresaDe, regraDaEmpresa } from '../src/motor/empresa.ts';
import { anoDoExterior } from '../src/motor/diplomacia.ts';
import { formatarDinheiro } from '../src/motor/texto.ts';
import { DEFESA, PESQUISA } from '../src/motor/regras.ts';
import { ANO, executar, QUARTEL_FRACO, type DoJogador, type Geracao, type HistoriaDasDividas, type Resultado, type Tarefa, type Vida } from './tunel-vida.ts';
import { assinaturasPorBloco, correlacao, desvio, media, mobilidade, ordenar, percentil, saturacao } from './medidas.ts';

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k ?? '', v ?? 'sim'] as const;
  }),
);
const TOTAL = Number(args.get('vidas') ?? 10000);
const SEMENTE = Number(args.get('semente') ?? 20261006);
const VIDAS_POR_JOGADOR = 20;
const JOGADORES = Math.max(1, Math.round(TOTAL / (ESTRATEGIAS.length * VIDAS_POR_JOGADOR)));
const JOGADORES_BASE = Math.max(1, Math.round(JOGADORES * 0.4));


// ---------------------------------------------------------------- estatística

const pct = (x: number, casas = 1): string => `${(x * 100).toFixed(casas).replace('.', ',')}%`;
const num = (x: number, casas = 1): string => x.toFixed(casas).replace('.', ',');

function histograma(valores: number[], faixas: { rotulo: string; ate: number }[]): string {
  const contagens = faixas.map(() => 0);
  for (const v of valores) {
    const i = faixas.findIndex((f) => v < f.ate);
    contagens[i < 0 ? faixas.length - 1 : i]!++;
  }
  const maior = Math.max(...contagens, 1);
  return faixas
    .map((f, i) => {
      const n = contagens[i]!;
      const barra = '█'.repeat(Math.round((n / maior) * 30));
      return `${f.rotulo.padEnd(14)} ${barra.padEnd(30)} ${pct(n / Math.max(1, valores.length))}`;
    })
    .join('\n');
}

// ---------------------------------------------------------------- simulação

// As vidas rodam em trabalhadores, um por núcleo (--paralelo=N; 1 roda aqui mesmo). Cada tarefa depende só da
// semente, e os resultados entram na ordem das tarefas: o relatório é o mesmo com qualquer número de trabalhadores.
const PARALELO = Math.max(1, Math.min(Number(args.get('paralelo') ?? availableParallelism()), 8));

async function executarTodas(tarefas: Tarefa[], trabalhadores = PARALELO): Promise<Resultado[]> {
  if (PARALELO <= 1) return tarefas.map((t) => executar(c, t));
  const resultados: Resultado[] = new Array(tarefas.length);
  let proxima = 0;
  const trabalhador = (): Promise<void> =>
    new Promise((pronto, falhou) => {
      const w = new Worker(new URL('./tunel-trabalhador.ts', import.meta.url));
      const mandar = (): void => {
        if (proxima >= tarefas.length) {
          void w.terminate().then(() => pronto());
          return;
        }
        const i = proxima++;
        w.postMessage({ i, t: tarefas[i] });
      };
      w.on('message', (m: { i: number; r: Resultado }) => {
        resultados[m.i] = m.r;
        mandar();
      });
      w.on('error', falhou);
      mandar();
    });
  await Promise.all(Array.from({ length: Math.min(trabalhadores, tarefas.length) }, trabalhador));
  return resultados;
}

const inicio = performance.now();
const c = carregarConteudo();

const idAleatoria = ESTRATEGIAS.indexOf('aleatoria');
// Quem cria o personagem escolhendo a classe ou a linhagem, e quem nasce com fortuna: não entram nas métricas das
// 10.000 vidas; contam para storylet morto e para a tabela por origem (as fortunas medem as jogadas).
const VIDAS_POR_ORIGEM = Math.max(2, Math.round(JOGADORES / 20));
const VIDAS_POR_LINHAGEM = Math.max(3, Math.round(JOGADORES / 12));
// Metade dos jogadores por classe e estratégia (~500 vidas): com 200, a opção mais rara de uma jogada rara
// (salvar o país, que pede crise e R$ 200 bilhões) saía 1 ou 2 vezes, e a reação dela às vezes morria por sorteio.
const VIDAS_POR_FORTUNA = Math.max(3, Math.round(JOGADORES / 2));
// Dinastias: quando a vida acaba e há filho ou filha viva, a história continua com essa pessoa (até 5 gerações).
const DINASTIAS = Math.max(4, Math.round(JOGADORES / 3));
const MAX_GERACOES = 5;
// Dinastias que nascem na família real e no Regime (bloco F): medem a coroa que passa a quem herda. Contam para storylet
// morto, não para as métricas das dinastias (a origem é escolhida).
const DINASTIAS_DE_LINHAGEM = Math.max(2, Math.round(JOGADORES / 12));
const LINHAGENS_DE_COROA = ['realeza', 'regime'];

type ComoEntra = { em: 'vidas' } | { em: 'semMemoria' } | { em: 'escolhida'; classe: number; fortuna: boolean } | { em: 'dinastia' } | { em: 'dinastiaDeLinhagem' };
const fila: { t: Tarefa; como: ComoEntra }[] = [];
ESTRATEGIAS.forEach((estrategia, s) => {
  for (let j = 0; j < JOGADORES; j++)
    fila.push({ t: { tipo: 'jogador', semente: SEMENTE, estrategia, idEstrategia: s, jogador: j, vidas: VIDAS_POR_JOGADOR, usarMemoria: true, guardar: true, livro: j % 10 === 0 }, como: { em: 'vidas' } });
});
// Efeito da memória: as mesmas vidas (mesmas sementes) da estratégia aleatória, sem memória entre vidas.
for (let j = 0; j < JOGADORES_BASE; j++)
  fila.push({ t: { tipo: 'jogador', semente: SEMENTE, estrategia: 'aleatoria', idEstrategia: idAleatoria, jogador: j, vidas: VIDAS_POR_JOGADOR, usarMemoria: false, guardar: false, livro: false }, como: { em: 'semMemoria' } });
CLASSES.forEach((_, classe) => {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_ORIGEM; k++) fila.push({ t: { tipo: 'origem', semente: misturar(SEMENTE, 404, classe, s, k), estrategia, origem: { classe } }, como: { em: 'escolhida', classe, fortuna: false } });
  });
});
c.mundo.linhagens.forEach((l) => {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_LINHAGEM; k++)
      fila.push({ t: { tipo: 'origem', semente: misturar(SEMENTE, 505, l.classe, s, k, l.id.length), estrategia, origem: { linhagem: l.id } }, como: { em: 'escolhida', classe: l.classe, fortuna: false } });
  });
});
for (const classe of [6, 7]) {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_FORTUNA; k++) fila.push({ t: { tipo: 'origem', semente: misturar(SEMENTE, 606, classe, s, k), estrategia, origem: { classe } }, como: { em: 'escolhida', classe, fortuna: true } });
  });
}
ESTRATEGIAS.forEach((estrategia, s) => {
  for (let d = 0; d < DINASTIAS; d++) fila.push({ t: { tipo: 'dinastia', semente: misturar(SEMENTE, 777, s, d), estrategia, geracoes: MAX_GERACOES }, como: { em: 'dinastia' } });
});
LINHAGENS_DE_COROA.forEach((linhagem, l) => {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let d = 0; d < DINASTIAS_DE_LINHAGEM; d++)
      fila.push({ t: { tipo: 'dinastia', semente: misturar(SEMENTE, 888, l, s, d), estrategia, geracoes: MAX_GERACOES, linhagem }, como: { em: 'dinastiaDeLinhagem' } });
  });
});

const resultados = await executarTodas(fila.map((x) => x.t));

// A CPU: com os trabalhadores rodando juntos, cada vida demora mais (a máquina divide cache e memória) e o número não
// compara com o de antes. Ela sai de uma amostra rodada depois, num trabalhador novo e sozinho (o heap daqui guarda as
// outras vidas e deixaria a coleta de lixo mais lenta), sem o medidor do livro: os primeiros jogadores de cada
// estratégia, depois de um aquecimento descartado com sementes de fora da amostra.
const JOGADORES_CPU = Math.min(JOGADORES, 3);
const aquecimento: Tarefa[] = ESTRATEGIAS.map((estrategia, s) => ({ tipo: 'jogador', semente: misturar(SEMENTE, 99), estrategia, idEstrategia: s, jogador: 0, vidas: VIDAS_POR_JOGADOR, usarMemoria: true, guardar: false, livro: false }));
const tarefasCpu: Tarefa[] = ESTRATEGIAS.flatMap((estrategia, s) =>
  Array.from({ length: JOGADORES_CPU }, (_, j): Tarefa => ({ tipo: 'jogador', semente: SEMENTE, estrategia, idEstrategia: s, jogador: j, vidas: VIDAS_POR_JOGADOR, usarMemoria: true, guardar: true, livro: false })),
);
const amostraCpu = (await executarTodas([...aquecimento, ...tarefasCpu], 1)).slice(aquecimento.length) as DoJogador[];
const vidasDaAmostraCpu = amostraCpu.flatMap((r) => r.vidas);

const vidas: Vida[] = [];
/** Instâncias de cada vida, por jogador (para a saturação), com e sem as narrativas de regra. */
const sequencias: string[][][] = [];
const sequenciasComRegras: string[][][] = [];
const sequenciasPorEstrategia = new Map<Estrategia, string[][][]>(ESTRATEGIAS.map((s) => [s, []]));
const sequenciasSemMemoria: string[][][] = [];
const textosPorK: number[][] = Array.from({ length: VIDAS_POR_JOGADOR }, () => []);
// O custo de cada etapa do ano (fatia 1.3): a CPU na amostra rodada sozinha, e o que cada uma deixa no livro em 1 jogador de cada 10.
const cpuDaEtapa = new Map<IdEtapa, number>(ETAPAS_DO_ANO.map((x) => [x.id, amostraCpu.reduce((t, r) => t + (r.cpu[x.id] ?? 0), 0)]));
const bytesDaEtapa = new Map<IdEtapa, number>(ETAPAS_DO_ANO.map((x) => [x.id, 0]));
/** O save de cada vida da amostra (bytes) e quanto dele é o livro. */
const saves: { total: number; livro: number }[] = [];
/** A dissuasão (bloco E): os anos de ameaça com o quartel fraco (abaixo de 50) e forte, e as guerras que começaram neles. */
const ameacaDoQuartel = { fraco: { anos: 0, guerras: 0 }, forte: { anos: 0, guerras: 0 } };
const escolhidas: { classe: number; vida: Vida }[] = [];
const fortunas: Vida[] = [];
const geracoes: Geracao[] = [];
/** As gerações das dinastias que nasceram na família real ou no Regime (bloco F). */
const geracoesDeLinhagem: Geracao[] = [];
/** Pares (patrimônio de quem morreu, patrimônio do herdeiro ao morrer). */
const paresGeracao: [number, number][] = [];
const tamanhos: number[] = [];
/** A conferência das dívidas também nas dinastias: o financiamento passa ao herdeiro com o imóvel. */
let dividasNasDinastias = 0;
let entradasNasDinastias = 0;
let exemploNasDinastias = '';
fila.forEach(({ t, como }, i) => {
  const r = resultados[i]!;
  if (r.tipo === 'jogador' && t.tipo === 'jogador') {
    if (como.em === 'semMemoria') {
      sequenciasSemMemoria.push(r.seq);
      return;
    }
    vidas.push(...r.vidas);
    r.textos.forEach((x, k) => x !== null && textosPorK[k]!.push(x));
    sequencias.push(r.seq);
    sequenciasComRegras.push(r.seqRegras);
    sequenciasPorEstrategia.get(t.estrategia)!.push(r.seq);
    saves.push(...r.saves);
    for (const [id, b] of Object.entries(r.bytes)) bytesDaEtapa.set(id as IdEtapa, bytesDaEtapa.get(id as IdEtapa)! + b);
    for (const q of ['fraco', 'forte'] as const) {
      ameacaDoQuartel[q].anos += r.ameaca[q].anos;
      ameacaDoQuartel[q].guerras += r.ameaca[q].guerras;
    }
  } else if (r.tipo === 'origem' && como.em === 'escolhida') {
    escolhidas.push({ classe: como.classe, vida: r.vida });
    if (como.fortuna) fortunas.push(r.vida);
  } else if (r.tipo === 'dinastia' && como.em === 'dinastiaDeLinhagem') {
    geracoesDeLinhagem.push(...r.geracoes);
  } else if (r.tipo === 'dinastia') {
    geracoes.push(...r.geracoes);
    paresGeracao.push(...r.pares);
    tamanhos.push(r.tamanho);
    dividasNasDinastias += r.dividasErradas;
    entradasNasDinastias += r.entradasConferidas;
    if (!exemploNasDinastias) exemploNasDinastias = r.exemploDeDivida;
  }
});
const segundos = (performance.now() - inicio) / 1000;

// ---------------------------------------------------------------- análise

const ocorrencias = new Map<string, number>(c.storylets.map((s) => [s.id, 0]));
const vidasCom = new Map<string, number>(c.storylets.map((s) => [s.id, 0]));
for (const v of vidas) {
  for (const id of [...v.eventos, ...v.acoes, ...v.jogadas]) ocorrencias.set(id, (ocorrencias.get(id) ?? 0) + 1);
  for (const id of new Set([...v.eventos, ...v.acoes, ...v.jogadas])) vidasCom.set(id, (vidasCom.get(id) ?? 0) + 1);
}
// Storylet morto é o que nenhuma vida vê: nem as sorteadas, nem as de origem escolhida, nem as dos herdeiros.
for (const x of [...escolhidas.map((v) => v.vida), ...geracoes, ...geracoesDeLinhagem]) for (const id of [...x.eventos, ...x.acoes, ...x.jogadas]) ocorrencias.set(id, (ocorrencias.get(id) ?? 0) + 1);
const mortos = c.storylets.filter((s) => (ocorrencias.get(s.id) ?? 0) === 0).map((s) => s.id);
const raros = c.storylets
  .filter((s) => {
    const n = vidasCom.get(s.id) ?? 0;
    return n > 0 && n / vidas.length < 0.005;
  })
  .map((s) => s.id);
const duplicados = vidas.flatMap((v) => v.duplicadosProibidos);

const repeticaoInterna = vidas.map((v) => (v.instancias.length ? 1 - new Set(v.instancias).size / v.instancias.length : 0));
const criadasNaSimulacao = new Set<string>();
const ativas = new Set<string>();
for (const v of vidas) {
  for (const m of v.qualidadesVistas) criadasNaSimulacao.add(m);
  for (const m of v.qualidadesAtivas) ativas.add(m);
}
const inertes = [...criadasNaSimulacao].filter((m) => !ativas.has(m)).sort();
const repetidosNaVida = new Map<string, number>();
for (const v of vidas) {
  const vistosNaVida = new Set<string>();
  for (const id of v.instancias) {
    if (vistosNaVida.has(id)) repetidosNaVida.set(id, (repetidosNaVida.get(id) ?? 0) + 1);
    vistosNaVida.add(id);
  }
}
const totalAparicoes = vidas.reduce((s, v) => s + v.instancias.length, 0);

// Os dilemas se medem em três bolsos (R$ 1 mil, R$ 10 mil e R$ 50 milhões na conta) e, os da empresa, com uma empresa típica.
const base = nascer(c, { semente: 1, ano: ANO });
const dilemas = NOMES_DOS_BOLSOS.map((bolso) => ({ bolso, falsos: falsosDilemas(c, base, bolso), risco: arriscarNaoCompensa(c, base, bolso) }));
const dilemasFalsos = [...new Set(dilemas.flatMap((d) => d.falsos.map((f) => f.evento)))];
const NOME_DO_BOLSO: Record<Bolso, string> = { pobre: 'pobre', tipico: 'típico', rico: 'rico' };

interface ResumoEstrategia {
  estrategia: Estrategia;
  idade: number;
  patrimonio: number;
  felicidade: number;
  eventos: number;
  acoes: number;
  comCausa: number;
  tresPontos: number;
  saturacaoV5: number;
}
const porEstrategia: ResumoEstrategia[] = ESTRATEGIAS.map((estrategia) => {
  const vs = vidas.filter((v) => v.estrategia === estrategia);
  return {
    estrategia,
    idade: media(vs.map((v) => v.idade)),
    patrimonio: percentil(ordenar(vs.map((v) => v.patrimonio)), 50),
    felicidade: media(vs.map((v) => v.felicidade)),
    eventos: media(vs.map((v) => v.instancias.length)),
    acoes: media(vs.map((v) => v.acoes.length)),
    comCausa: media(vs.map((v) => v.comCausa)),
    tresPontos: vs.filter((v) => v.pontos >= 3).length / Math.max(1, vs.length),
    saturacaoV5: saturacao(sequenciasPorEstrategia.get(estrategia) ?? [])[4] ?? 0,
  };
});
const CRITERIOS = [
  ['idade', 'idade média de morte'],
  ['patrimonio', 'patrimônio mediano'],
  ['felicidade', 'felicidade média'],
] as const;
const dominantes = porEstrategia
  .filter((r) => r.estrategia !== 'aleatoria')
  .filter((r) => porEstrategia.every((o) => o === r || CRITERIOS.every(([k]) => r[k] > o[k])))
  .map((r) => r.estrategia);

const sat = saturacao(sequencias);
const satRegras = saturacao(sequenciasComRegras);
const satSemMemoria = saturacao(sequenciasSemMemoria);
const satAleatoria = saturacao(sequenciasPorEstrategia.get('aleatoria') ?? []);
const satV = (s: number[], k: number): number => s[k - 1] ?? 0;
const repTextos = media(textosPorK.slice(1).flat());
const assinaturas = assinaturasPorBloco(vidas.map((v) => v.assinatura));
const destinos = assinaturasPorBloco(vidas.map((v) => v.destino));
const mob = mobilidade(
  vidas.map((v) => v.origem),
  vidas.map((v) => v.patrimonio),
  vidas.map((v) => v.desempate),
);
const patOrd = ordenar(vidas.map((v) => v.patrimonio));
const p10 = percentil(patOrd, 10);
const p90 = percentil(patOrd, 90);
const razao9010 = p10 > 0 ? p90 / p10 : Infinity;
const desvioFelicidade = desvio(vidas.map((v) => v.felicidade));
const negativas = vidas.filter((v) => v.patrimonio < 0).length / vidas.length;
const parteJogador = vidas.reduce((s, v) => s + v.mudancasJogador, 0) / Math.max(1, vidas.reduce((s, v) => s + v.mudancasTotal, 0));
const toques = media(vidas.map((v) => v.toques));
const msPorVida = media(vidasDaAmostraCpu.map((v) => v.ms));
const pontosMundo = vidas.reduce((s, v) => s + v.pontosDoMundo, 0) / Math.max(1, vidas.reduce((s, v) => s + v.pontos, 0));
const anosTotal = vidas.reduce((s, v) => s + FASES.reduce((t, f) => t + v.anosPorFase[f], 0), 0);
const parteFase = (f: Fase): number => vidas.reduce((s, v) => s + v.anosPorFase[f], 0) / Math.max(1, anosTotal);
const demissoesTotal = vidas.reduce((s, v) => s + v.demissoes, 0);
const carreiras = assinaturasPorBloco(vidas.map((v) => v.carreiraSetor));

// ---- dinheiro e dinastia
const comHerdeiro = vidas.filter((v) => v.herdeiro).length / vidas.length;
const chegamTerceira = tamanhos.filter((t) => t >= 3).length / Math.max(1, tamanhos.length);
const entreGeracoes =
  paresGeracao.length >= 10
    ? mobilidade(
        paresGeracao.map((p) => p[0]),
        paresGeracao.map((p) => p[1]),
        paresGeracao.map((_, i) => i),
      ).spearman
    : 0;
const PERFIS_TUNEL = ['conservador', 'moderado', 'arrojado'] as const;
/** O perfil na estratégia aleatória (sorteado aos 18): mesmo jeito de jogar, só o perfil muda. */
const porPerfil = PERFIS_TUNEL.map((perfil) => {
  const ord = ordenar(vidas.filter((v) => v.estrategia === 'aleatoria' && v.perfil === perfil).map((v) => v.patrimonio));
  return { perfil, n: ord.length, p10: percentil(ord, 10), p50: percentil(ord, 50), p90: percentil(ord, 90) };
});
/**
 * Laboratório de perfis: R$ 100 mil por 30 anos em cada perfil, rebalanceados todo ano, nos mesmos anos do país
 * (as mesmas sementes para os três: só o perfil muda). Mede a troca entre risco e retorno sem o ruído da vida.
 */
const LAB = Math.max(200, JOGADORES * 6);
const laboratorio = PERFIS_TUNEL.map((perfil) => {
  const pesos = c.mundo.perfis.find((p) => p.id === perfil)!.carteira;
  const finais: number[] = [];
  for (let i = 0; i < LAB; i++) {
    const e = nascer(c, { semente: misturar(SEMENTE, 606, i), ano: ANO });
    let total = 100000;
    for (let ano = 0; ano < 30; ano++) {
      e.idade++;
      e.ano++;
      const fase = anoDoPais(e, c, [], anoDoExterior(e, c, []));
      const r = mercadoDoAno(e, c, fase.id, [], fase.cambio);
      total = ATIVOS.reduce((soma, a) => soma + total * (pesos[a] ?? 0) * (1 + (r[a] ?? 0)), 0);
    }
    finais.push(total);
  }
  const ord = ordenar(finais);
  return { perfil, p10: percentil(ord, 10), p50: percentil(ord, 50), p90: percentil(ord, 90) };
});
const [labConservador, labModerado, labArrojado] = laboratorio as [(typeof laboratorio)[number], (typeof laboratorio)[number], (typeof laboratorio)[number]];
const porOrigem = CLASSES.map((nome, classe) => {
  const vs = escolhidas.filter((x) => x.classe === classe).map((x) => x.vida);
  return { nome, n: vs.length, idade: media(vs.map((v) => v.idade)), patrimonio: percentil(ordenar(vs.map((v) => v.patrimonio)), 50), felicidade: media(vs.map((v) => v.felicidade)) };
});
const operacoesPorVida = media(vidas.map((v) => v.operacoes));
/** Quem nasce sem fortuna (da extrema pobreza à classe média): até onde dá para chegar. */
const semFortuna = (() => {
  const ord = ordenar(vidas.filter((v) => v.classeOrigem <= 3).map((v) => v.patrimonio));
  const n = Math.max(1, ord.length);
  return {
    n: ord.length,
    p50: percentil(ord, 50),
    p90: percentil(ord, 90),
    p99: percentil(ord, 99),
    max: ord.at(-1) ?? 0,
    dez: ord.filter((x) => x >= 1e7).length / n,
    cem: ord.filter((x) => x >= 1e8).length / n,
    bilhao: ord.filter((x) => x >= 1e9).length / n,
  };
})();
const fundaram = vidas.filter((v) => v.fundou).length / vidas.length;
const quebraFundadores = vidas.filter((v) => v.fundou && v.quebrou).length / Math.max(1, vidas.filter((v) => v.fundou).length);
const vendaFundadores = vidas.filter((v) => v.fundou && v.vendeu).length / Math.max(1, vidas.filter((v) => v.fundou).length);
const anosVazios = media(vidas.map((v) => v.anosVazios));
const TETO_TOQUES = 480;
/** Brincar de deus, nas vidas de fortuna dos robôs que mexem no dinheiro (a "primeira" nunca abre a folha). */
const jogadores = fortunas.filter((v) => v.estrategia !== 'primeira');
const totalDeJogadas = jogadores.reduce((s, v) => s + v.jogadas.length, 0);
const fortunaJoga = jogadores.filter((v) => v.jogadas.length > 0).length / Math.max(1, jogadores.length);
const jogadasPorVida = totalDeJogadas / Math.max(1, jogadores.length);
const jogadasComReacao = jogadores.reduce((s, v) => s + v.jogadasComReacao, 0) / Math.max(1, totalDeJogadas);
const jogadasVistas = new Set([...fortunas, ...vidas, ...escolhidas.map((x) => x.vida)].flatMap((v) => v.jogadas));
const mortesEmJogada = fortunas.filter((v) => /Lua|Marte|foguete/.test(v.causaMorte)).length;
/** Incremento 6: quem manda na empresa (todas as vidas jogadas: sorteadas, de origem escolhida e de fortuna) e o porquê. */
const todasAsVidas = [...vidas, ...escolhidas.map((x) => x.vida)];
const donosNaMorte = todasAsVidas.filter((v) => v.empresaNaMorte !== null && v.empresaNaMorte.valor >= 1e6);
const decidiramQuemManda = donosNaMorte.filter((v) => v.decidiuQuemManda).length / Math.max(1, donosNaMorte.length);
const dependenciasNaMorte = ordenar(donosNaMorte.map((v) => v.empresaNaMorte!.dependencia));
/** As jogadas na empresa existem a partir de R$ 15 milhões: é onde os dois caminhos estão abertos. */
const donosGrandes = donosNaMorte.filter((v) => v.empresaNaMorte!.valor >= 1.5e7);
const delegaram = donosGrandes.filter((v) => v.empresaNaMorte!.dependencia <= 30).length / Math.max(1, donosGrandes.length);
const centralizaram = donosGrandes.filter((v) => v.empresaNaMorte!.dependencia >= 60).length / Math.max(1, donosGrandes.length);
const perdaNaMorte = media(donosNaMorte.map((v) => v.empresaNaMorte!.perda));
const porqueVisivel = vidas.reduce((s, v) => s + v.comPorque, 0) / Math.max(1, vidas.reduce((s, v) => s + v.acontecimentos, 0));
/** Incremento 7: crises que acabam, começos que variam e uma primeira infância que pesa depois. */
const duracoesDeCrise = ordenar(vidas.flatMap((v) => v.crises));
const comecosDistintos = (1000 * new Set(vidas.map((v) => v.comeco)).size) / Math.max(1, vidas.length);
const decidemCedo = vidas.filter((v) => v.decisoesAntesDos5 >= 2).length / Math.max(1, vidas.length);
const infanciaVolta = vidas.filter((v) => v.infanciaVoltou).length / Math.max(1, vidas.length);
const porquesPorVida = media(vidas.map((v) => v.comPorque));
/** Incremento 8: o país vivo (todas as vidas jogadas: os governos de quem joga são raros nas sorteadas). */
const noGoverno = new Map<string, { anos: number; soma: Record<Estatistica, number> }>();
for (const v of todasAsVidas) {
  for (const [g, x] of Object.entries(v.porGoverno)) {
    const t = noGoverno.get(g) ?? { anos: 0, soma: Object.fromEntries(ESTATISTICAS.map((k) => [k, 0])) as Record<Estatistica, number> };
    t.anos += x.anos;
    for (const k of ESTATISTICAS) t.soma[k] += x.soma[k];
    noGoverno.set(g, t);
  }
}
const mediaNoGoverno = (g: string, k: Estatistica): number => (noGoverno.get(g)?.soma[k] ?? 0) / Math.max(1, noGoverno.get(g)?.anos ?? 0);
const blocosEleitos = c.mundo.governos.filter((g) => g.eleito);
const anosDeBlocos = blocosEleitos.reduce((s, g) => s + (noGoverno.get(g.id)?.anos ?? 0), 0);
const parteDoBloco = (g: string): number => (noGoverno.get(g)?.anos ?? 0) / Math.max(1, anosDeBlocos);
const direcoes = [
  ['pobreza menor com a frente popular que com o bloco liberal', mediaNoGoverno('frente_popular', 'pobreza') < mediaNoGoverno('bloco_liberal', 'pobreza'), `${num(mediaNoGoverno('frente_popular', 'pobreza'), 1)}% × ${num(mediaNoGoverno('bloco_liberal', 'pobreza'), 1)}%`],
  ['violência menor com a aliança da ordem que com o bloco liberal', mediaNoGoverno('alianca_da_ordem', 'violencia') < mediaNoGoverno('bloco_liberal', 'violencia'), `${num(mediaNoGoverno('alianca_da_ordem', 'violencia'), 1)} × ${num(mediaNoGoverno('bloco_liberal', 'violencia'), 1)}`],
  ['crescimento maior com o bloco liberal que com a frente popular', mediaNoGoverno('bloco_liberal', 'crescimento') > mediaNoGoverno('frente_popular', 'crescimento'), `${num(mediaNoGoverno('bloco_liberal', 'crescimento'), 2)}% × ${num(mediaNoGoverno('frente_popular', 'crescimento'), 2)}%`],
  ['dívida menor com a aliança da ordem que com o centrão', mediaNoGoverno('alianca_da_ordem', 'divida') < mediaNoGoverno('centrao', 'divida'), `${num(mediaNoGoverno('alianca_da_ordem', 'divida'), 0)}% × ${num(mediaNoGoverno('centrao', 'divida'), 0)}% do PIB`],
] as const;
const anosVividos = vidas.reduce((s, v) => s + v.idade, 0);
const viradasPor70 = (70 * vidas.reduce((s, v) => s + v.viradas, 0)) / Math.max(1, anosVividos);
const trocasPorVida = media(vidas.map((v) => v.trocasDeGoverno));
const trabalhoNoPais = vidas.reduce(
  (t, v) => ({ alto: t.alto + v.trabalho.alto, demitidoAlto: t.demitidoAlto + v.trabalho.demitidoAlto, baixo: t.baixo + v.trabalho.baixo, demitidoBaixo: t.demitidoBaixo + v.trabalho.demitidoBaixo }),
  { alto: 0, demitidoAlto: 0, baixo: 0, demitidoBaixo: 0 },
);
const demissaoAlto = trabalhoNoPais.demitidoAlto / Math.max(1, trabalhoNoPais.alto);
const demissaoBaixo = trabalhoNoPais.demitidoBaixo / Math.max(1, trabalhoNoPais.baixo);
const votosPorVida = media(vidas.map((v) => v.votos));
const votosQueElegeram = vidas.reduce((s, v) => s + v.votosQueElegeram, 0) / Math.max(1, vidas.reduce((s, v) => s + v.votos, 0));
const governosDe = (estrategia: Estrategia): NonNullable<Vida['governo']>[] => todasAsVidas.filter((v) => v.estrategia === estrategia && v.governo).map((v) => v.governo!);
/** Quanto a dívida andou por ano de governo de quem joga, pela estratégia (pontos do PIB). */
const dividaPorAno = (estrategia: Estrategia): number => {
  const gs = governosDe(estrategia);
  return gs.reduce((s, g) => s + (g.dividaFim - g.dividaInicio), 0) / Math.max(1, gs.reduce((s, g) => s + g.anos, 0));
};
const governaram = todasAsVidas.filter((v) => v.governo);
const reformaram = governaram.filter((v) => v.estrategia !== 'primeira' && v.governo!.reformas > 0).length / Math.max(1, governaram.filter((v) => v.estrategia !== 'primeira').length);
const mortesViolentas = vidas.filter((v) => v.destino.endsWith('|violencia')).length / Math.max(1, vidas.length);

// ---------------------------------------------------------------- portões

/** Linha de base de 06/10/2026 (motor da fase 1) e os portões do incremento 1. */
const BASE = { saturacaoV5: 0.945, assinaturas: 563, desvioFelicidade: 5.73, toques: 110.8 };
/** Medido no fim do incremento 1 (docs/metricas.md de 06/10/2026): a base dos portões do incremento 2. */
const BASE2 = { pontosMundo: 0.029, pobreParaRico: 0.03, ricoParaPobre: 0.03, v20: 0.959, assinaturas: 893, ms: 14.5 };
const portoes2 = [
  ['O mundo nos pontos de virada ≥ 2× (o mundo reage)', pontosMundo >= 2 * BASE2.pontosMundo, `${pct(pontosMundo)} (base ${pct(BASE2.pontosMundo)}, alvo ${pct(2 * BASE2.pontosMundo)})`],
  ['Do quintil mais pobre ao mais rico ≥ 1,5×', mob.baixoParaAlto >= 1.5 * BASE2.pobreParaRico, `${pct(mob.baixoParaAlto)} (base ${pct(BASE2.pobreParaRico)}, alvo ${pct(1.5 * BASE2.pobreParaRico)})`],
  // No incremento 3 o alvo voltou para a linha de base: a herança passa inteira e o dinheiro investido dura, como o dono pediu (docs/decisoes.md).
  ['Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2)', mob.altoParaBaixo >= BASE2.ricoParaPobre, `${pct(mob.altoParaBaixo)} (base ${pct(BASE2.ricoParaPobre)})`],
  ['Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7)', mob.spearman >= 0.3 && mob.spearman <= 0.7, num(mob.spearman, 2)],
  ['Saturação V20 ≤ 95%', satV(sat, 20) <= 0.95, `${pct(satV(sat, 20))} (base ${pct(BASE2.v20)})`],
  ['Assinaturas sem regressão', assinaturas >= BASE2.assinaturas, `${num(assinaturas, 0)} (base ${BASE2.assinaturas})`],
  ['CPU por vida ≤ 30 ms', msPorVida <= 30, `${num(msPorVida, 2)} ms (base ${num(BASE2.ms, 1)} ms)`],
] as const;
/** Incremento 3 (pedidos do dono em 07/10/2026): dinastia, investir e empreender com escolha, origens extremas, sem teto de milhões e anos mais cheios. */
const portoes3 = [
  ['Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara)', comHerdeiro >= 0.4, pct(comHerdeiro)],
  ['Dinastias que chegam à 3ª geração ≥ 25%', chegamTerceira >= 0.25, `${pct(chegamTerceira)} (${tamanhos.length} dinastias, média de ${num(media(tamanhos), 1)} gerações)`],
  ['A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8)', entreGeracoes >= 0.3 && entreGeracoes <= 0.8, `${num(entreGeracoes, 2)} (${paresGeracao.length} heranças)`],
  [
    'O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil)',
    labArrojado.p50 > labModerado.p50 && labModerado.p50 > labConservador.p50 && labArrojado.p10 < labConservador.p10,
    `mediana ${formatarDinheiro(labConservador.p50)} / ${formatarDinheiro(labModerado.p50)} / ${formatarDinheiro(labArrojado.p50)}; p10 ${formatarDinheiro(labConservador.p10)} / ${formatarDinheiro(labModerado.p10)} / ${formatarDinheiro(labArrojado.p10)}`,
  ],
  ['Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões', semFortuna.cem >= 0.005, `${pct(semFortuna.cem, 2)} (p99 ${formatarDinheiro(semFortuna.p99)}, maior ${formatarDinheiro(semFortuna.max)})`],
  ['Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna', semFortuna.bilhao >= 0.0002 && semFortuna.bilhao <= 0.01, pct(semFortuna.bilhao, 2)],
  ['Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre', quebraFundadores >= 0.15 && quebraFundadores <= 0.55, `${pct(quebraFundadores)} de ${pct(fundaram)} das vidas que abriram empresa`],
  ['Anos adultos sem acontecimento ≤ 20% (era 30%)', anosVazios <= 0.2, pct(anosVazios)],
  ['Saturação V20 sem regressão (≤ 95%)', satV(sat, 20) <= 0.95, pct(satV(sat, 20))],
  ['Assinaturas sem regressão (≥ 918)', assinaturas >= 918, num(assinaturas, 0)],
  ['Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques)', toques <= TETO_TOQUES, num(toques, 1)],
  ['CPU por vida ≤ 30 ms', msPorVida <= 30, `${num(msPorVida, 2)} ms`],
] as const;
/** Incremento 5 (pedido do dono em 08/10/2026): brincar de deus com bilhões e trilhões. */
const portoes5 = [
  ['Toda jogada acontece em alguma vida', jogadasVistas.size === c.jogadas.length, `${jogadasVistas.size} de ${c.jogadas.length}`],
  ['Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada', fortunaJoga >= 0.6, `${pct(fortunaJoga)} (${num(jogadasPorVida, 1)} jogadas por vida, ${jogadores.length} vidas)`],
  ['O mundo responde: ≥ 50% das jogadas causam um acontecimento depois', jogadasComReacao >= 0.5, `${pct(jogadasComReacao)} de ${totalDeJogadas} jogadas`],
] as const;
/** Incremento 6 (as 250 ideias do dono, 11/10/2026): quem manda na empresa e o porquê de cada acontecimento. */
const portoes6 = [
  ['Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha', decidiramQuemManda >= 0.3, `${pct(decidiramQuemManda)} de ${donosNaMorte.length} vidas`],
  [
    'As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60)',
    delegaram >= 0.1 && centralizaram >= 0.1,
    `${pct(delegaram)} delegaram, ${pct(centralizaram)} centralizaram (${donosGrandes.length} vidas)`,
  ],
  ['O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior', porqueVisivel >= 0.2, `${pct(porqueVisivel)} (${num(porquesPorVida, 1)} por vida)`],
] as const;
/** Incremento 7 (pedidos do dono em 11/10/2026): a crise que não acabava, os começos iguais e a infância sem efeito. */
const portoes7 = [
  ['Toda crise acaba: 99% duram até 8 anos', percentil(duracoesDeCrise, 99) <= 8, `mediana ${num(percentil(duracoesDeCrise, 50), 0)}, p99 ${num(percentil(duracoesDeCrise, 99), 0)}, maior ${num(duracoesDeCrise.at(-1) ?? 0, 0)} anos (${duracoesDeCrise.length} crises)`],
  ['Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha)', comecosDistintos >= 800, num(comecosDistintos, 0)],
  ['Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos', decidemCedo >= 0.8, pct(decidemCedo)],
  ['A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4', infanciaVolta >= 0.3, pct(infanciaVolta)],
] as const;
/** Incremento 8 (pedido do dono em 11/10/2026): o país vivo, com política e estatísticas que respondem a quem governa. */
const portoes8 = [
  [
    'As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos',
    parteFase('normal') >= 0.55 && parteFase('normal') <= 0.72 && parteFase('expansao') >= 0.15 && parteFase('expansao') <= 0.3 && parteFase('recessao') >= 0.07 && parteFase('recessao') <= 0.18 && parteFase('crise') >= 0.01 && parteFase('crise') <= 0.06,
    `${pct(parteFase('normal'))} / ${pct(parteFase('expansao'))} / ${pct(parteFase('recessao'))} / ${pct(parteFase('crise'))}`,
  ],
  ['O país não pisca: até 18 viradas de fase a cada 70 anos', viradasPor70 <= 18, num(viradasPor70, 1)],
  [
    'Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida',
    blocosEleitos.every((g) => parteDoBloco(g.id) >= 0.12 && parteDoBloco(g.id) <= 0.4) && trocasPorVida >= 2,
    `${blocosEleitos.map((g) => `${g.nome} ${pct(parteDoBloco(g.id))}`).join(', ')}; ${num(trocasPorVida, 1)} trocas por vida`,
  ],
  ['A política muda o país: as 4 direções certas', direcoes.every(([, ok]) => ok), direcoes.map(([nome, ok, valor]) => `${ok ? '✓' : '✗'} ${nome} (${valor})`).join('; ')],
  [
    'O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos',
    demissaoAlto >= 2 * demissaoBaixo,
    `${pct(demissaoAlto, 2)} contra ${pct(demissaoBaixo, 2)} por ano (${trabalhoNoPais.alto} e ${trabalhoNoPais.baixo} anos de trabalho)`,
  ],
  ['O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha', votosPorVida >= 1.5 && votosQueElegeram >= 0.25, `${num(votosPorVida, 2)} votos por vida, ${pct(votosQueElegeram)} elegeram`],
  [
    'Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma',
    dividaPorAno('arriscada') > dividaPorAno('cautelosa') && reformaram >= 0.8 && governosDe('arriscada').length >= 10 && governosDe('cautelosa').length >= 10,
    `${num(dividaPorAno('arriscada'), 2)} × ${num(dividaPorAno('cautelosa'), 2)} pontos do PIB por ano (${governosDe('arriscada').length} e ${governosDe('cautelosa').length} governos); ${pct(reformaram)} reformaram`,
  ],
  ['A violência do país mata, e pouco: entre 0,5% e 6% das vidas', mortesViolentas >= 0.005 && mortesViolentas <= 0.06, pct(mortesViolentas, 1)],
] as const;
/** Incremento 9 (pedido do dono em 11/10/2026): o grupo de empresas, com subsidiárias, fusões e bolsa. Todas as vidas jogadas: sorteadas, de origem escolhida e de fortuna. */
const vidasDoGrupo = [...todasAsVidas, ...fortunas];
const fundadores = vidasDoGrupo.filter((v) => v.fundou || v.grupo.maxEmpresas > 0);
const emGrupo = fundadores.filter((v) => v.grupo.maxEmpresas >= 2).length / Math.max(1, fundadores.length);
const comFusao = fundadores.filter((v) => v.fusoes > 0).length / Math.max(1, fundadores.length);
const naBolsa = fundadores.filter((v) => v.bolsas > 0).length / Math.max(1, fundadores.length);
const subsidiariasDosGrupos = ordenar(fundadores.map((v) => v.grupo.maxSubsidiarias));
const maiorGrupo = subsidiariasDosGrupos.at(-1) ?? 0;
const perdasDaMesa = vidasDoGrupo.flatMap((v) => v.grupo.mesa);
const perdaDaMesa = media(perdasDaMesa);
const corr = (pares: [number, number][]): number => correlacao(pares.map((x) => x[0]), pares.map((x) => x[1]));
const listadas = vidasDoGrupo.flatMap((v) => v.grupo.listadas);
const fechadas = vidasDoGrupo.flatMap((v) => v.grupo.fechadas);
const corrListadas = corr(listadas);
const corrFechadas = corr(fechadas);
/** Laboratório do grupo: um grupo de R$ 10 bilhões que compra uma concorrente por ano (o caminho para as centenas de subsidiárias). */
const laboratorioDoGrupo = (() => {
  const e = nascer(c, { semente: misturar(SEMENTE, 909), ano: ANO });
  e.idade = 40;
  e.ano += 40;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  e.entidades['eu']!.n['dinheiro'] = 5e10;
  operar(e, c, { tipo: 'abrir', setor: 'tecnologia', valor: 1e10 });
  for (let ano = 1; ano <= 30; ano++) {
    if (motivoParaNaoOperar(e, c, { tipo: 'adquirir' }) === null) operar(e, c, { tipo: 'adquirir' });
    const subsidiarias = empresaDe(e)?.n['subsidiarias'] ?? 0;
    if (subsidiarias >= 100) return { anos: ano, subsidiarias };
    e.ano++;
    e.idade++;
    regraDaEmpresa(e, c, momentoTipico('normal'), []);
  }
  return { anos: Infinity, subsidiarias: empresaDe(e)?.n['subsidiarias'] ?? 0 };
})();
const portoes9 = [
  ['O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez', emGrupo >= 0.1, `${pct(emGrupo)} de ${fundadores.length} vidas com empresa`],
  ['Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa', comFusao >= 0.02 && naBolsa >= 0.02, `${pct(comFusao)} fundiram, ${pct(naBolsa)} abriram o capital`],
  [
    'Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos',
    laboratorioDoGrupo.anos <= 10,
    `${Number.isFinite(laboratorioDoGrupo.anos) ? `${laboratorioDoGrupo.anos} anos` : `nunca (${laboratorioDoGrupo.subsidiarias})`}; nas vidas jogadas, o maior grupo teve ${num(maiorGrupo, 0)} (p99 ${num(percentil(subsidiariasDosGrupos, 99), 0)})`,
  ],
  ['A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração', perdaDaMesa >= 0.5, `${num(perdaDaMesa, 2)} ponto em média (${perdasDaMesa.length} empresas-ano)`],
  [
    'Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas',
    corrListadas - corrFechadas >= 0.2,
    `${num(corrListadas, 2)} na bolsa (${listadas.length} empresas-ano) × ${num(corrFechadas, 2)} fechadas (${fechadas.length})`,
  ],
] as const;
/** Incremento 10 (o roteiro: diplomacia): os países de fora, o dólar, sanções, acordos e alinhamento. Todas as vidas jogadas: sorteadas e de origem escolhida. */
const viradasRuins = todasAsVidas.reduce((s, v) => s + v.viradasRuins, 0);
const parteDeFora = todasAsVidas.reduce((s, v) => s + v.viradasDeFora, 0) / Math.max(1, viradasRuins);
const dolares = ordenar(vidas.flatMap((v) => v.fora.cambios));
const dolarP10 = percentil(dolares, 10);
const dolarP50 = percentil(dolares, 50);
const dolarP90 = percentil(dolares, 90);
const repasse = vidas.flatMap((v) => v.fora.repasse);
const inflacaoNaAlta = media(repasse.filter(([d]) => d >= 0.1).map(([, i]) => i));
const inflacaoNaQueda = media(repasse.filter(([d]) => d <= -0.1).map(([, i]) => i));
/** Quanto o crescimento das empresas do setor anda por ponto de alta do dólar (a inclinação da reta). */
const inclinacao = (setor: string): { valor: number; n: number } => {
  const pares = todasAsVidas.flatMap((v) => v.fora.setores.filter((x) => x[0] === setor));
  const mx = media(pares.map((x) => x[2]));
  const my = media(pares.map((x) => x[1]));
  const sxy = pares.reduce((s, x) => s + (x[2] - mx) * (x[1] - my), 0);
  const sxx = pares.reduce((s, x) => s + (x[2] - mx) ** 2, 0);
  return { valor: sxx > 0 ? sxy / sxx : 0, n: pares.length };
};
const noAgro = inclinacao('agro');
const noComercio = inclinacao('comercio');
const comSancao = vidas.filter((v) => v.sancoes.length > 0).length / Math.max(1, vidas.length);
const comAcordo = vidas.filter((v) => v.acordos > 0).length / Math.max(1, vidas.length);
const sancoesVistas = todasAsVidas.flatMap((v) => v.sancoes);
/** Toda sanção acaba: as que a vida viu acabar em até 15 anos, entre as que acabaram e as que a vida viu passar de 15. */
const sancoesDecididas = sancoesVistas.filter((x) => x.anos !== null || x.vistos > 15);
const sancoesQueAcabam = sancoesDecididas.filter((x) => x.anos !== null && x.anos <= 15).length / Math.max(1, sancoesDecididas.length);
const duracoesDeSancao = ordenar(sancoesVistas.filter((x) => x.anos !== null).map((x) => x.anos!));
const sancoesComCausa = sancoesVistas.filter((x) => x.comCausa).length / Math.max(1, sancoesVistas.length);
const foraPorGoverno = new Map<string, { anos: number; sancoes: number; acordos: number; sancoesDaCeleste: number }>();
for (const v of todasAsVidas) {
  for (const [g, x] of Object.entries(v.fora.porGoverno)) {
    const t = foraPorGoverno.get(g) ?? { anos: 0, sancoes: 0, acordos: 0, sancoesDaCeleste: 0 };
    t.anos += x.anos;
    t.sancoes += x.sancoes;
    t.acordos += x.acordos;
    t.sancoesDaCeleste += x.sancoesDaCeleste;
    foraPorGoverno.set(g, t);
  }
}
const porAnoDe = (g: string, k: 'sancoes' | 'acordos' | 'sancoesDaCeleste'): number => (foraPorGoverno.get(g)?.[k] ?? 0) / Math.max(1, foraPorGoverno.get(g)?.anos ?? 0);
const alinhamento = [
  [
    'a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela)',
    porAnoDe('alianca_da_ordem', 'sancoesDaCeleste') > porAnoDe('frente_popular', 'sancoesDaCeleste'),
    `${pct(porAnoDe('alianca_da_ordem', 'sancoesDaCeleste'), 2)} × ${pct(porAnoDe('frente_popular', 'sancoesDaCeleste'), 2)} por ano`,
  ],
  [
    'mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem)',
    porAnoDe('bloco_liberal', 'acordos') > porAnoDe('alianca_da_ordem', 'acordos'),
    `${pct(porAnoDe('bloco_liberal', 'acordos'), 2)} × ${pct(porAnoDe('alianca_da_ordem', 'acordos'), 2)} por ano`,
  ],
] as const;
const governantes = governaram.filter((v) => v.estrategia !== 'primeira');
const fizeramAto = governantes.filter((v) => v.atos > 0).length / Math.max(1, governantes.length);
/**
 * Laboratório do ato lá fora: quem governa rompe com a Celeste (ou faz uma visita de Estado), com o país em ordem,
 * e o mundo anda cinco anos. Mede a chance de a Celeste sancionar o Brasil depois (as mesmas sementes para os dois atos).
 */
const LAB_DIPLOMATICO = Math.max(200, JOGADORES * 2);
const laboratorioDiplomatico = (acao: 'romper' | 'aproximar'): number => {
  let sancoes = 0;
  for (let i = 0; i < LAB_DIPLOMATICO; i++) {
    const e = nascer(c, { semente: misturar(SEMENTE, 1010, i), ano: ANO });
    e.idade = 50;
    e.ano += 50;
    const eu = e.entidades['eu']!;
    eu.t['cargo'] = 'presidente';
    eu.n['mandato'] = 8;
    eu.n['popularidade'] = 50;
    anoDoPais(e, c, [], anoDoExterior(e, c, []));
    operar(e, c, { tipo: 'diplomacia', parceiro: 'celeste', acao });
    for (let ano = 0; ano < 5; ano++) {
      e.ano++;
      e.idade++;
      anoDoPais(e, c, [], anoDoExterior(e, c, []));
      if (e.entidades['celeste']!.q['sancao']) {
        sancoes++;
        break;
      }
    }
  }
  return sancoes / LAB_DIPLOMATICO;
};
const sancaoDepoisDeRomper = laboratorioDiplomatico('romper');
const sancaoDepoisDaVisita = laboratorioDiplomatico('aproximar');
const portoes10 = [
  ['A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa', parteDeFora >= 0.1, `${pct(parteDeFora)} de ${viradasRuins} viradas`],
  [
    'O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6',
    dolarP90 >= 1.3 * dolarP10 && dolarP50 >= 4 && dolarP50 <= 6,
    `p10 R$ ${num(dolarP10, 2)} · mediana R$ ${num(dolarP50, 2)} · p90 R$ ${num(dolarP90, 2)}`,
  ],
  [
    'O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais',
    inflacaoNaAlta - inflacaoNaQueda >= 1,
    `${num(inflacaoNaAlta, 1)}% × ${num(inflacaoNaQueda, 1)}%`,
  ],
  [
    'O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos',
    noAgro.valor > 0 && noComercio.valor < 0 && noAgro.n >= 100 && noComercio.n >= 100,
    `${num(noAgro.valor, 2)} no agro (${noAgro.n} empresas-ano) × ${num(noComercio.valor, 2)} no comércio (${noComercio.n}), por ponto de alta`,
  ],
  [
    'Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos',
    comSancao >= 0.05 && comSancao <= 0.4 && comAcordo >= 0.3 && sancoesQueAcabam >= 0.9,
    `sanção em ${pct(comSancao)}, acordo em ${pct(comAcordo)}; ${pct(sancoesQueAcabam)} das sanções acabam em até 15 anos (mediana ${num(percentil(duracoesDeSancao, 50), 0)}, p90 ${num(percentil(duracoesDeSancao, 90), 0)})`,
  ],
  [
    'Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha)',
    sancoesComCausa >= 0.8,
    `${pct(sancoesComCausa)} de ${sancoesVistas.length} sanções`,
  ],
  ['Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas', alinhamento.every(([, ok]) => ok), alinhamento.map(([nome, ok, valor]) => `${ok ? '✓' : '✗'} ${nome} (${valor})`).join('; ')],
  [
    'Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5%',
    fizeramAto >= 0.5 && sancaoDepoisDeRomper >= 0.3 && sancaoDepoisDaVisita <= 0.05,
    `${pct(fizeramAto)} de ${governantes.length} governos; sanção depois de romper ${pct(sancaoDepoisDeRomper)}, depois da visita ${pct(sancaoDepoisDaVisita)} (laboratório de ${LAB_DIPLOMATICO} governos)`,
  ],
] as const;
/** Bloco A: o país em números no fim de cada vida (as vidas do jogador, sem as dinastias). */
const faixa = (f: (n: Vida['numeros']) => number): [number, number, number] => {
  const xs = ordenar(vidas.map((v) => f(v.numeros)));
  return [percentil(xs, 10), percentil(xs, 50), percentil(xs, 90)];
};
const idhFim = faixa((n) => n.idh);
const giniFim = faixa((n) => n.gini);
const populacaoFim = faixa((n) => n.populacao / 1e6);
const perCapitaFim = faixa((n) => n.pibPerCapita);
const HISTORIAS_DOS_NUMEROS = ['pib_recorde', 'desigualdade_no_jornal', 'idh_muito_alto', 'idh_em_queda', 'pais_envelhece'];
const vidasComHistoria = HISTORIAS_DOS_NUMEROS.map((id) => [id, vidas.filter((v) => v.eventos.includes(id)).length / Math.max(1, vidas.length)] as const);
const portoes11 = [
  [
    'Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões',
    idhFim[1] >= 0.75 && idhFim[1] <= 0.95 && giniFim[1] >= 0.42 && giniFim[1] <= 0.6 && populacaoFim[1] >= 150 && populacaoFim[1] <= 230,
    `IDH ${num(idhFim[1], 3)}, Gini ${num(giniFim[1], 3)}, população ${num(populacaoFim[1], 0)} milhões`,
  ],
  [
    'O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini',
    idhFim[2] - idhFim[0] >= 0.03 && giniFim[2] - giniFim[0] >= 0.03,
    `IDH ${num(idhFim[0], 3)}–${num(idhFim[2], 3)}, Gini ${num(giniFim[0], 3)}–${num(giniFim[2], 3)}`,
  ],
  [
    'Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas',
    vidasComHistoria.every(([, x]) => x >= 0.02),
    vidasComHistoria.map(([id, x]) => `${id} ${pct(x)}`).join(' · '),
  ],
] as const;
/** Fatia 1.2 do universo de bolso: a dívida como contrato (atraso, nome sujo, acordo, caducar, leilão). */
const comDivida = (f: (d: HistoriaDasDividas) => boolean, vs: readonly Vida[] = vidas): number => vs.filter((v) => f(v.dividas)).length / Math.max(1, vs.length);
const sujas = vidas.filter((v) => v.dividas.sujo);
/** O nome sujo pela dívida sem garantia (a que se renegocia): com acordo no meio e sem. O do financiamento acaba no leilão ou no pagamento. */
const episodiosSemGarantia = vidas.flatMap((v) => v.dividas.episodios.filter((x) => !x.financiamento));
const anosSujoCom = episodiosSemGarantia.filter((x) => x.acordo).map((x) => x.anos);
const anosSujoSem = episodiosSemGarantia.filter((x) => !x.acordo).map((x) => x.anos);
const financiaram = vidas.filter((v) => v.dividas.financiou);
const leiloados = comDivida((d) => d.leilao, financiaram);
const portoes12 = [
  ['O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas', comDivida((d) => d.sujo) >= 0.02 && comDivida((d) => d.sujo) <= 0.25, pct(comDivida((d) => d.sujo))],
  [
    'Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou)',
    anosSujoCom.length > 0 && anosSujoSem.length > 0 && media(anosSujoCom) < media(anosSujoSem),
    `${num(media(anosSujoCom), 2)} anos com acordo (${anosSujoCom.length} vezes) × ${num(media(anosSujoSem), 2)} sem (${anosSujoSem.length} vezes; p90 ${num(percentil(ordenar(anosSujoSem), 90), 0)})`,
  ],
  [
    'Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão',
    leiloados >= 0.01 && leiloados <= 0.25,
    `${pct(leiloados)} de ${financiaram.length} vidas que financiaram`,
  ],
  ['Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo', sujas.length > 0 && comDivida((d) => d.caducou) > 0 && comDivida((d) => d.caducou, sujas) <= 0.5, `${pct(comDivida((d) => d.caducou))} das vidas; ${pct(comDivida((d) => d.caducou, sujas))} das sujas`],
] as const;

// ---- o Tesouro (bloco B)
const comTitulo = (vs: Vida[]): Vida[] => vs.filter((v) => v.tesouro.compras > 0);
const parteQueCompra = ESTRATEGIAS.map((x) => comTitulo(vidas.filter((v) => v.estrategia === x)).length / Math.max(1, vidas.filter((v) => v.estrategia === x).length));
const comCalote = vidas.filter((v) => v.tesouro.calotes > 0);
const perderamSemTer = todasAsVidas.filter((v) => v.tesouro.perdeuSemTer).length;
const portoesB = [
  [
    'Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5%',
    Math.max(...parteQueCompra) >= 0.3 && Math.min(...parteQueCompra) < 0.05,
    ESTRATEGIAS.map((x, i) => `${x} ${pct(parteQueCompra[i]!)}`).join(', '),
  ],
  ['O calote é raro: entre 0,2% e 5% das vidas veem um', comCalote.length / Math.max(1, vidas.length) >= 0.002 && comCalote.length / Math.max(1, vidas.length) <= 0.05, `${pct(comCalote.length / Math.max(1, vidas.length))} (${comCalote.length} vidas)`],
  ['Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa', perderamSemTer === 0, `${perderamSemTer} vidas`],
] as const;

// ---- a coroa (bloco C)
const FORMAS = ['salario', 'impostos', 'taxa'] as const;
const NOME_DA_FORMA: Record<(typeof FORMAS)[number], string> = { salario: 'salário da Casa Real', impostos: 'parte dos impostos', taxa: 'taxa da coroa' };
const comCoroa = todasAsVidas.filter((v) => v.coroa.reinou);
const somaDa = (f: (v: Vida) => number): number => comCoroa.reduce((t, v) => t + f(v), 0);
const anosDaForma = (x: (typeof FORMAS)[number]): number => somaDa((v) => v.coroa.anos[x]);
const quedasPor100 = (x: (typeof FORMAS)[number]): number => (100 * somaDa((v) => v.coroa.quedas[x])) / Math.max(1, anosDaForma(x));
const ilhas = todasAsVidas.filter((v) => v.coroa.ilha !== null);
const ilhasComTaxa = ilhas.filter((v) => (v.coroa.ilha?.anosComTaxa ?? 0) >= 5);
const ilhasSemTaxa = ilhas.filter((v) => (v.coroa.ilha?.anosComTaxa ?? 0) === 0);
const mediana = (xs: number[]): number => percentil(ordenar(xs), 50);
const portoesC = [
  [
    'A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário',
    anosDaForma('taxa') >= 20 && anosDaForma('salario') >= 20 && quedasPor100('taxa') > quedasPor100('salario'),
    `${num(quedasPor100('taxa'), 1)} quedas por 100 anos com a taxa (${num(anosDaForma('taxa'), 0)} anos) × ${num(quedasPor100('salario'), 1)} com o salário (${num(anosDaForma('salario'), 0)} anos)`,
  ],
  [
    'A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia',
    ilhas.length > 0 && ilhas.every((v) => v.coroa.ilha!.populacao !== 2300) && (ilhasComTaxa.length === 0 || mediana(ilhasComTaxa.map((v) => v.coroa.ilha!.populacao)) < mediana(ilhasSemTaxa.map((v) => v.coroa.ilha!.populacao))),
    `${ilhas.length} ilhas; mediana de ${num(mediana(ilhasSemTaxa.map((v) => v.coroa.ilha!.populacao)), 0)} habitantes sem a taxa (${ilhasSemTaxa.length}) e ${ilhasComTaxa.length ? num(mediana(ilhasComTaxa.map((v) => v.coroa.ilha!.populacao)), 0) : '—'} com 5 anos ou mais de taxa (${ilhasComTaxa.length})`,
  ],
  ['Toda dotação tem coroa por trás: nenhum real dela para quem não reina', todasAsVidas.every((v) => Math.abs(v.coroa.dotacaoSemCoroa) < 1), `${todasAsVidas.filter((v) => Math.abs(v.coroa.dotacaoSemCoroa) >= 1).length} vidas`],
] as const;

// ---- o Estado pesquisa (bloco D)
const NIVEIS_DA_CIENCIA = ['cortada', 'regular', 'prioridade'] as const;
const gastoDaCiencia = c.mundo.politicas.find((p) => p.id === 'pesquisa')?.efeitos.gasto ?? [0, 0, 0];
const anosDaCiencia = [0, 1, 2].map((k) => vidas.reduce((t, v) => t + v.pesquisa.anos[k as 0 | 1 | 2], 0));
const andouPorAno = [0, 1, 2].map((k) => vidas.reduce((t, v) => t + v.pesquisa.variacao[k as 0 | 1 | 2], 0) / Math.max(1, anosDaCiencia[k]!));
const tecnologiaAoMorrer = ordenar(vidas.map((v) => v.pesquisa.fim));
const DESCOBERTAS_DO_TUNEL = ['cura', 'satelite', 'patente'] as const;
const descobertasDo = (x: (typeof DESCOBERTAS_DO_TUNEL)[number]): number => vidas.reduce((t, v) => t + v.pesquisa.descobertas[x], 0);
const todasAsDescobertas = DESCOBERTAS_DO_TUNEL.reduce((t, x) => t + descobertasDo(x), 0);
const comDescoberta = vidas.filter((v) => DESCOBERTAS_DO_TUNEL.some((x) => v.pesquisa.descobertas[x] > 0)).length / Math.max(1, vidas.length);
const descobertasComCausa = vidas.reduce((t, v) => t + v.pesquisa.comCausa, 0) / Math.max(1, todasAsDescobertas);
const comFuga = vidas.filter((v) => v.pesquisa.fugas > 0).length / Math.max(1, vidas.length);
const portoesD = [
  [
    'A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai',
    anosDaCiencia[0]! >= 100 && anosDaCiencia[2]! >= 100 && andouPorAno[2]! > 0.1 && andouPorAno[0]! < -0.1,
    NIVEIS_DA_CIENCIA.map((x, k) => `${x} ${andouPorAno[k]! >= 0 ? '+' : ''}${num(andouPorAno[k]!, 2)} por ano (${num(anosDaCiencia[k]!, 0)} anos)`).join(' · '),
  ],
  [
    'O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos',
    percentil(tecnologiaAoMorrer, 90) - percentil(tecnologiaAoMorrer, 10) >= 10,
    `p10 ${num(percentil(tecnologiaAoMorrer, 10), 1)} · mediana ${num(percentil(tecnologiaAoMorrer, 50), 1)} · p90 ${num(percentil(tecnologiaAoMorrer, 90), 1)}`,
  ],
  [
    'A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade',
    comDescoberta >= 0.1 && comDescoberta <= 0.7 && descobertasComCausa >= 0.6,
    `${pct(comDescoberta)} das vidas; ${pct(descobertasComCausa)} de ${num(todasAsDescobertas, 0)} descobertas com a decisão de causa`,
  ],
] as const;

// ---- a defesa (bloco E)
const NIVEIS_DA_DEFESA = ['desmobilizada', 'regular', 'reforçada'] as const;
const anosDaDefesa = [0, 1, 2].map((k) => vidas.reduce((t, v) => t + v.defesa.anos[k as 0 | 1 | 2], 0));
const capacidadePorAno = [0, 1, 2].map((k) => vidas.reduce((t, v) => t + v.defesa.variacao[k as 0 | 1 | 2], 0) / Math.max(1, anosDaDefesa[k]!));
const capacidadeAoMorrer = ordenar(vidas.map((v) => v.defesa.fim));
const somaDaDefesa = (f: (v: Vida) => number): number => vidas.reduce((t, v) => t + f(v), 0);
const guerras = somaDaDefesa((v) => v.defesa.guerras);
const comGuerra = vidas.filter((v) => v.defesa.guerras > 0).length / Math.max(1, vidas.length);
const guerrasComCausa = somaDaDefesa((v) => v.defesa.comCausa) / Math.max(1, guerras);
const finsDaGuerra = { vitoria: somaDaDefesa((v) => v.defesa.fins.vitoria), derrota: somaDaDefesa((v) => v.defesa.fins.derrota), cessarFogo: somaDaDefesa((v) => v.defesa.fins.cessarFogo) };
const duracoes = vidas.flatMap((v) => v.defesa.duracoes);
const maiorGuerra = Math.max(0, ...vidas.map((v) => v.defesa.maiorDuracao));
const naGuerra = vidas.reduce((t, v) => ({ soma: t.soma + v.defesa.crescimentoNaGuerra.soma, anos: t.anos + v.defesa.crescimentoNaGuerra.anos }), { soma: 0, anos: 0 });
const naPaz = vidas.reduce((t, v) => ({ soma: t.soma + v.defesa.crescimentoNaPaz.soma, anos: t.anos + v.defesa.crescimentoNaPaz.anos }), { soma: 0, anos: 0 });
const crescimentoNaGuerra = naGuerra.soma / Math.max(1, naGuerra.anos);
const crescimentoNaPaz = naPaz.soma / Math.max(1, naPaz.anos);
const chanceNoAnoDeAmeaca = (q: 'fraco' | 'forte'): number => ameacaDoQuartel[q].guerras / Math.max(1, ameacaDoQuartel[q].anos);
const portoesE = [
  [
    'A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai',
    anosDaDefesa[0]! >= 100 && anosDaDefesa[2]! >= 100 && capacidadePorAno[2]! > 0.1 && capacidadePorAno[0]! < -0.1,
    NIVEIS_DA_DEFESA.map((x, k) => `${x} ${capacidadePorAno[k]! >= 0 ? '+' : ''}${num(capacidadePorAno[k]!, 2)} por ano (${num(anosDaDefesa[k]!, 0)} anos)`).join(' · '),
  ],
  [
    'A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação',
    comGuerra >= 0.005 && comGuerra <= 0.08 && guerrasComCausa >= 0.7,
    `${pct(comGuerra)} das vidas; ${pct(guerrasComCausa)} de ${num(guerras, 0)} guerras com a decisão de causa`,
  ],
  [
    `A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de ${QUARTEL_FRACO} do que acima`,
    ameacaDoQuartel.fraco.anos >= 50 && ameacaDoQuartel.forte.anos >= 50 && chanceNoAnoDeAmeaca('fraco') > chanceNoAnoDeAmeaca('forte'),
    `quartel fraco: ${pct(chanceNoAnoDeAmeaca('fraco'))} de ${num(ameacaDoQuartel.fraco.anos, 0)} anos · forte: ${pct(chanceNoAnoDeAmeaca('forte'))} de ${num(ameacaDoQuartel.forte.anos, 0)} anos`,
  ],
  [
    'A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz',
    naGuerra.anos >= 30 && crescimentoNaPaz - crescimentoNaGuerra >= 1.5,
    `${num(crescimentoNaGuerra, 2)}% em ${num(naGuerra.anos, 0)} anos de guerra · ${num(crescimentoNaPaz, 2)}% nos de paz`,
  ],
  ['Toda guerra acaba: nenhuma passa do oitavo ano', maiorGuerra <= DEFESA.fim.maximo, `a mais longa: ${num(maiorGuerra, 0)} anos`],
] as const;

// ---- o poder que passa (bloco F)
/** As vidas que medem o poder: as sorteadas, as de origem escolhida (as linhagens, as fortunas) e as gerações das dinastias. */
const poderes = [...todasAsVidas.map((v) => v.poder), ...geracoes.map((g) => g.poder), ...geracoesDeLinhagem.map((g) => g.poder)];
const sucessoesDo = (quando: 'vida' | 'heranca'): { quando: string; respondeu: boolean }[] => poderes.flatMap((p) => p.sucessoes.filter((x) => x.quando === quando));
const respondidas = (l: { respondeu: boolean }[]): number => l.filter((x) => x.respondeu).length / Math.max(1, l.length);
const sucessoesEmVida = sucessoesDo('vida');
const sucessoesNaHeranca = sucessoesDo('heranca');
const herdeirosNaFila = poderes.filter((p) => p.herdeiroReinou !== null);
const herdeirosQueReinaram = herdeirosNaFila.filter((p) => p.herdeiroReinou).length / Math.max(1, herdeirosNaFila.length);
type JogadaDoPoder = 'golpe' | 'autogolpe' | 'emenda' | 'restauracao';
const JOGADAS_DO_PODER: [JogadaDoPoder, string][] = [
  ['golpe', 'Tomar o poder (liderar os quartéis ou financiar os generais)'],
  ['autogolpe', 'Fechar o Congresso (o autogolpe de quem é presidente)'],
  ['emenda', 'Mudar a Constituição para mais um mandato'],
  ['restauracao', 'Restaurar a monarquia no plebiscito'],
];
const doPoder = (k: JogadaDoPoder, ps = poderes): [number, number] => ps.reduce<[number, number]>((t, p) => [t[0] + p[k][0], t[1] + p[k][1]], [0, 0]);
const tentativasDeGolpe = doPoder('golpe')[0] + doPoder('autogolpe')[0];
const golpesQueDeram = (doPoder('golpe')[1] + doPoder('autogolpe')[1]) / Math.max(1, tentativasDeGolpe);
// ---- a rede (missão Ω1): as pessoas que passam pela vida
const redes = vidas.map((v) => v.rede);
const parteDas = (f: (r: (typeof redes)[number]) => boolean): number => redes.filter(f).length / Math.max(1, redes.length);
const somaDaRede = (f: (r: (typeof redes)[number]) => number): number => redes.reduce((t, r) => t + f(r), 0);
const comEx = parteDas((r) => r.exes > 0);
const comIrmao = parteDas((r) => r.irmaos > 0);
const pessoasPorVida = media(redes.map((r) => r.pessoas));
const entradasDaRede = media(redes.map((r) => r.entradas));
const outroPapel = { ex: somaDaRede((r) => r.exVoltou), amigo: somaDaRede((r) => r.colegaVirouAmigo), romance: somaDaRede((r) => r.romanceNoTrabalho) };
const portoesOmega1 = [
  ['A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão', comEx >= 0.25 && comIrmao >= 0.6, `ex em ${pct(comEx)} · irmão em ${pct(comIrmao)}`],
  [
    'As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe',
    entradasDaRede >= 3,
    `${num(entradasDaRede, 1)} entradas por vida, com ${num(pessoasPorVida, 1)} pessoas por vida`,
  ],
  [
    'A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada)',
    outroPapel.ex >= 10 && outroPapel.amigo >= 10 && outroPapel.romance >= 10,
    `ex que voltou ${num(outroPapel.ex, 0)} · colega que virou amigo ${num(outroPapel.amigo, 0)} · romance do trabalho ${num(outroPapel.romance, 0)}`,
  ],
] as const;
const portoesF = [
  [
    'A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada)',
    sucessoesEmVida.length >= 20 && sucessoesNaHeranca.length >= 20 && respondidas(sucessoesEmVida) === 1 && respondidas(sucessoesNaHeranca) === 1,
    `em vida ${pct(respondidas(sucessoesEmVida))} de ${num(sucessoesEmVida.length, 0)} · na herança ${pct(respondidas(sucessoesNaHeranca))} de ${num(sucessoesNaHeranca.length, 0)}`,
  ],
  [
    'O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas',
    tentativasDeGolpe >= 20 && golpesQueDeram >= 0.15 && golpesQueDeram <= 0.85,
    `${num(tentativasDeGolpe, 0)} tentativas, ${pct(golpesQueDeram)} deram certo`,
  ],
] as const;

// ---- o ano em etapas (fatia 1.3)
const CPU_DA_FATIA_12 = 43.74;
const cpuEtapa = (id: IdEtapa): number => cpuDaEtapa.get(id)! / Math.max(1, vidasDaAmostraCpu.length);
const cpuDasEtapas = ETAPAS_DO_ANO.reduce((t, x) => t + cpuEtapa(x.id), 0);
const kbEtapa = (id: IdEtapa): number => bytesDaEtapa.get(id)! / Math.max(1, saves.length) / 1024;
const savesOrdenados = ordenar(saves.map((x) => x.total));
const maiorSave = savesOrdenados.at(-1) ?? 0;
const parteDoLivro = saves.reduce((t, x) => t + x.livro, 0) / Math.max(1, saves.reduce((t, x) => t + x.total, 0));
const portoes13 = [
  ['O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB', maiorSave <= 1024 * 1024, `${num(maiorSave / 1024, 0)} KB (mediana ${num(percentil(savesOrdenados, 50) / 1024, 0)} KB, ${saves.length} vidas)`],
  ['A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada', msPorVida <= CPU_DA_FATIA_12 * 1.1, `${num(msPorVida, 2)} ms (base ${num(CPU_DA_FATIA_12, 2)} ms, teto ${num(CPU_DA_FATIA_12 * 1.1, 2)} ms)`],
] as const;

const portoes = [
  ['Saturação V5 ≤ 80%', satV(sat, 5) <= 0.8, `${pct(satV(sat, 5))} (base ${pct(BASE.saturacaoV5)})`],
  ['Assinaturas ≥ 1,5× a linha de base', assinaturas >= 1.5 * BASE.assinaturas, `${num(assinaturas, 0)} (base ${BASE.assinaturas}, alvo ${num(1.5 * BASE.assinaturas, 0)})`],
  ['Desvio da felicidade ≥ 1,3× a linha de base', desvioFelicidade >= 1.3 * BASE.desvioFelicidade, `${num(desvioFelicidade, 2)} (base ${num(BASE.desvioFelicidade, 2)}, alvo ${num(1.3 * BASE.desvioFelicidade, 2)})`],
  ['Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano)', toques <= TETO_TOQUES, `${num(toques)} (base ${num(BASE.toques)}, teto ${TETO_TOQUES})`],
] as const;

// ---- os filhos (fatia 1.4a)
const filhosApagados = todasAsVidas.filter((v) => v.filhos !== v.filhosNoEstado).map((v) => `teve ${v.filhos}, ficaram ${v.filhosNoEstado}`);
const comFilhos = vidas.filter((v) => v.filhos > 0);
const parteCom = (n: number): number => vidas.filter((v) => v.filhos === n).length / Math.max(1, vidas.length);
const doisOuMais = vidas.filter((v) => v.filhos >= 2).length / Math.max(1, vidas.length);
const herdeirosComIrmaos = vidas.filter((v) => v.herdeiroComIrmaos).length / Math.max(1, vidas.filter((v) => v.herdeiro).length);
const portoes14 = [
  ['Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas', doisOuMais >= 0.05 && doisOuMais <= 0.4, pct(doisOuMais)],
  ['Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos', herdeirosComIrmaos >= 0.05 && herdeirosComIrmaos <= 0.5, pct(herdeirosComIrmaos)],
] as const;

const contasErradas = vidas.reduce((s, v) => s + v.contasErradas, 0);
const entradasConferidas = vidas.reduce((s, v) => s + v.entradasConferidas, 0);
const dividasErradas = todasAsVidas.reduce((s, v) => s + v.dividasErradas, 0) + dividasNasDinastias;
const entradasDasDividas = todasAsVidas.reduce((s, v) => s + v.entradasConferidas, 0) + entradasNasDinastias;
const metas = [
  ['Zero storylets mortos', mortos.length === 0, `${mortos.length} mortos`],
  [
    'Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1)',
    contasErradas === 0,
    contasErradas === 0
      ? `0 problemas em ${num(entradasConferidas, 0)} entradas`
      : `${contasErradas} problemas; ex.: ${vidas.find((v) => v.exemploDeConta)?.exemploDeConta ?? ''}`,
  ],
  [
    'Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2)',
    dividasErradas === 0,
    dividasErradas === 0
      ? `0 problemas em ${num(entradasDasDividas, 0)} entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias)`
      : `${dividasErradas} problemas; ex.: ${todasAsVidas.find((v) => v.exemploDeDivida)?.exemploDeDivida ?? exemploNasDinastias}`,
  ],
  [
    'Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a)',
    filhosApagados.length === 0,
    filhosApagados.length === 0 ? `0 em ${num(todasAsVidas.length, 0)} vidas` : `${filhosApagados.length} vidas; ex.: ${filhosApagados[0]}`,
  ],
  ['Nenhum storylet não-repetível repetido na mesma vida', duplicados.length === 0, `${duplicados.length} repetições`],
  ['Nenhuma estratégia fixa domina', dominantes.length === 0, dominantes.length ? `domina: ${dominantes.join(', ')}` : 'nenhuma domina'],
] as const;

// ---------------------------------------------------------------- relatório

const idades = ordenar(vidas.map((v) => v.idade));
const felicidades = ordenar(vidas.map((v) => v.felicidade));
const cadeias = listarCadeias(c).filter((x) => x.anosMin >= 3);
const escolhas = c.storylets.reduce((s, ev) => s + (ev.escolhas?.length ?? 0), 0);
const porTipo = (t: string): number => c.storylets.filter((s) => tipoDe(s) === t).length;

const linhas: string[] = [];
const l = (s = ''): void => void linhas.push(s);
l('# Métricas do túnel de vento');
l();
l('Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.');
l();
l(
  `**${vidas.length.toLocaleString('pt-BR')} vidas** (${ESTRATEGIAS.length} estratégias × ${JOGADORES} jogadores × ${VIDAS_POR_JOGADOR} vidas seguidas, com memória entre vidas) · semente ${SEMENTE} · ` +
    `conteúdo: ${porTipo('evento')} eventos, ${porTipo('npc')} de personagens, ${porTipo('acao')} ações, ${escolhas} escolhas, ${c.linhas.length} linhas, ${new Set(cadeias.map((x) => `${x.de}→${x.para}`)).size} cadeias de 3+ anos.`,
);
l();
l('## Metas permanentes');
l();
l('| Meta | Situação | Detalhe |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of metas) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## O dinheiro de uma vida, por contraparte (fatia 1.1)');
l();
l('De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.');
l();
l('| Fluxo | Contraparte | Vidas com ele | Mediana por vida |');
l('|---|---|---|---|');
{
  const CONTAS: Record<string, string> = {
    mercado: 'o mercado',
    tesouro: 'o governo',
    banco: 'o banco',
    parentes: 'os parentes',
    reavaliacao: 'os preços',
    mae: 'a mãe',
    pai: 'o pai',
    avo: 'a avó ou o avô',
    amor: 'o par',
    filho: 'o filho',
    amigo: 'o amigo',
    paixao: 'a paixão',
  };
  const porFluxo = new Map<string, number[]>();
  for (const v of vidas) {
    for (const x of v.extrato) {
      const k = `${x.rotulo}|${CONTAS[x.contraparte] ?? (/^empresa\d*$/.test(x.contraparte) ? 'a empresa' : /^bem/.test(x.contraparte) ? 'um bem' : x.contraparte)}`;
      const lista = porFluxo.get(k) ?? [];
      lista.push(x.valor);
      porFluxo.set(k, lista);
    }
  }
  const ordem = [...porFluxo.entries()].sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1)).slice(0, 16);
  for (const [k, xs] of ordem) {
    const [rotulo, quem] = k.split('|');
    l(`| ${rotulo} | ${quem} | ${pct(xs.length / vidas.length)} | ${formatarDinheiro(percentil(ordenar(xs), 50))} |`);
  }
}
l();
l('## As dívidas como contrato (fatia 1.2)');
l();
l('Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:');
l();
l('| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |');
l('|---|---|---|---|---|---|---|---|');
for (const estrategia of ESTRATEGIAS) {
  const vs = vidas.filter((v) => v.estrategia === estrategia);
  const anosSujo = ordenar(vs.filter((v) => v.dividas.sujo).map((v) => v.dividas.anosSujo));
  l(
    `| ${estrategia} | ${pct(comDivida((d) => d.financiou, vs))} | ${pct(comDivida((d) => d.sujo, vs))} | ${anosSujo.length ? num(percentil(anosSujo, 50), 1) : '—'} | ${pct(comDivida((d) => d.acordo, vs))} | ${pct(comDivida((d) => d.caducou, vs))} | ${pct(comDivida((d) => d.leilao, vs))} | ${pct(comDivida((d) => d.limpou, vs))} |`,
  );
}
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes12) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## O Tesouro (bloco B)');
l();
l(
  'Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. ' +
    'Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:',
);
l();
l('| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |');
l('|---|---|---|---|---|---|---|---|---|');
for (const estrategia of ESTRATEGIAS) {
  const vs = vidas.filter((v) => v.estrategia === estrategia);
  const compraram = comTitulo(vs);
  const tiveram = vs.filter((v) => v.tesouro.compras + v.tesouro.deHistorias > 0);
  const soma = (f: (v: Vida) => number, lista: Vida[]): number => lista.reduce((t, v) => t + f(v), 0);
  const perderam = ordenar(vs.filter((v) => v.tesouro.perdaNoCalote >= 1).map((v) => v.tesouro.perdaNoCalote));
  l(
    `| ${estrategia} | ${pct(compraram.length / Math.max(1, vs.length))} | ${compraram.length ? num(soma((v) => v.tesouro.compras, compraram) / compraram.length, 1) : '—'} | ` +
      `${pct(vs.filter((v) => v.tesouro.deHistorias > 0).length / Math.max(1, vs.length))} | ` +
      `${tiveram.length ? formatarDinheiro(percentil(ordenar(tiveram.map((v) => v.tesouro.cupons)), 50)) : '—'} | ${num(soma((v) => v.tesouro.vencimentos, vs), 0)} | ` +
      `${num(soma((v) => v.tesouro.vendas, vs), 0)} (${num(soma((v) => v.tesouro.vendasComLucro, vs), 0)}) | ${pct(vs.filter((v) => v.tesouro.calotes > 0).length / Math.max(1, vs.length))} | ` +
      `${perderam.length ? `${formatarDinheiro(percentil(perderam, 50))} (${perderam.length} vidas)` : '—'} |`,
  );
}
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesB) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## A coroa (bloco C)');
l();
l(
  `Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. ` +
    `A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. ${comCoroa.length} vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):`,
);
l();
l('| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |');
l('|---|---|---|---|');
for (const x of FORMAS) l(`| ${NOME_DA_FORMA[x]} | ${num(anosDaForma(x), 0)} | ${formatarDinheiro(somaDa((v) => v.coroa.dotacao[x]) / Math.max(1, anosDaForma(x)))} | ${num(quedasPor100(x), 1)} |`);
l();
l(`A ilha: ${ilhas.length} vidas fundaram ou herdaram uma. População no fim: p10 ${num(percentil(ordenar(ilhas.map((v) => v.coroa.ilha!.populacao)), 10), 0)}, mediana ${num(mediana(ilhas.map((v) => v.coroa.ilha!.populacao)), 0)}, p90 ${num(percentil(ordenar(ilhas.map((v) => v.coroa.ilha!.populacao)), 90), 0)}.`);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesC) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## O Estado pesquisa (bloco D)');
l();
l(
  `Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de ${num(PESQUISA.base + gastoDaCiencia[0], 1)}% a ${num(PESQUISA.base + gastoDaCiencia[2], 1)}% do PIB, pagos pelo Tesouro). ` +
    'A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:',
);
l();
l('| Ciência | Anos | A tecnologia por ano |');
l('|---|---|---|');
NIVEIS_DA_CIENCIA.forEach((x, k) => l(`| ${x} | ${num(anosDaCiencia[k]!, 0)} | ${andouPorAno[k]! >= 0 ? '+' : ''}${num(andouPorAno[k]!, 2)} |`));
l();
l(
  `A tecnologia ao morrer: p10 ${num(percentil(tecnologiaAoMorrer, 10), 1)}, mediana ${num(percentil(tecnologiaAoMorrer, 50), 1)}, p90 ${num(percentil(tecnologiaAoMorrer, 90), 1)}. ` +
    `Descobertas por 100 vidas: a cura ${num((100 * descobertasDo('cura')) / Math.max(1, vidas.length), 1)}, o satélite ${num((100 * descobertasDo('satelite')) / Math.max(1, vidas.length), 1)}, a patente ${num((100 * descobertasDo('patente')) / Math.max(1, vidas.length), 1)}; ` +
    `${pct(comDescoberta)} das vidas veem uma. A fuga de cérebros: ${pct(comFuga)} das vidas.`,
);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesD) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## A defesa (bloco E)');
l();
l(
  'Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. ' +
    `A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada ${DEFESA.guerra.dobra} pontos abaixo de 50. Nas vidas sorteadas:`,
);
l();
l('| Defesa | Anos | A capacidade por ano |');
l('|---|---|---|');
NIVEIS_DA_DEFESA.forEach((x, k) => l(`| ${x} | ${num(anosDaDefesa[k]!, 0)} | ${capacidadePorAno[k]! >= 0 ? '+' : ''}${num(capacidadePorAno[k]!, 2)} |`));
l();
l(
  `A capacidade ao morrer: p10 ${num(percentil(capacidadeAoMorrer, 10), 1)}, mediana ${num(percentil(capacidadeAoMorrer, 50), 1)}, p90 ${num(percentil(capacidadeAoMorrer, 90), 1)}. ` +
    `Encomendas por 100 vidas: ${num((100 * somaDaDefesa((v) => v.defesa.encomendas)) / Math.max(1, vidas.length), 1)} (${num(somaDaDefesa((v) => v.defesa.entregas), 0)} entregas). ` +
    `Guerras por 100 vidas: ${num((100 * guerras) / Math.max(1, vidas.length), 1)}, em ${pct(comGuerra)} das vidas; acabaram em vitória ${num(finsDaGuerra.vitoria, 0)}, derrota ${num(finsDaGuerra.derrota, 0)} e cessar-fogo ${num(finsDaGuerra.cessarFogo, 0)}, ` +
    `com ${duracoes.length ? num(duracoes.reduce((t, x) => t + x, 0) / duracoes.length, 1) : '—'} anos em média. Pedidos de paz: ${num(somaDaDefesa((v) => v.defesa.pedidosDePaz), 0)}; convocações: ${num(somaDaDefesa((v) => v.defesa.convocacoes), 0)}; ` +
    `${pct(vidas.filter((v) => v.defesa.veterano).length / Math.max(1, vidas.length))} das vidas voltaram da guerra com a marca.`,
);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesE) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## O poder que passa (bloco F)');
l();
l(
  'A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, ' +
    'e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. ' +
    `Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com ${num(LINHAGENS_DE_COROA.length * ESTRATEGIAS.length * DINASTIAS_DE_LINHAGEM, 0)} dinastias que nascem na família real ou no Regime):`,
);
l();
l(
  `Sucessões que chegaram a quem tinha 18 anos ou mais: ${num(sucessoesEmVida.length, 0)} em vida (${pct(respondidas(sucessoesEmVida))} com resposta) e ${num(sucessoesNaHeranca.length, 0)} na herança (${pct(respondidas(sucessoesNaHeranca))}). ` +
    `De ${num(herdeirosNaFila.length, 0)} herdeiros que começaram na fila, ${pct(herdeirosQueReinaram)} reinaram.`,
);
l();
l('| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |');
l('|---|---|---|---|');
for (const [k, nome] of JOGADAS_DO_PODER) {
  const [n, ok] = doPoder(k);
  const porEstrategia = ESTRATEGIAS.map((x) => `${x} ${num(doPoder(k, vidas.filter((v) => v.estrategia === x).map((v) => v.poder))[0], 0)}`).join(' · ');
  l(`| ${nome} | ${num(n, 0)} | ${n > 0 ? pct(ok / n) : '—'} | ${porEstrategia} |`);
}
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesF) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## A rede (missão Ω1)');
l();
l(
  `As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (\`docs/auditoria-omega.md\`). ` +
    `Nas vidas sorteadas, cada vida tem em média ${num(pessoasPorVida, 1)} pessoas diferentes, ${num(media(redes.map((r) => r.exes)), 2)} ex, ${num(media(redes.map((r) => r.irmaos)), 2)} irmãos (${num(media(redes.map((r) => r.irmaosNovos)), 2)} nascidos depois de quem joga) e ${num(media(redes.map((r) => r.doTrabalho)), 2)} pessoas do trabalho.`,
);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoesOmega1) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## O ano em etapas (fatia 1.3)');
l();
l(
  `O ano é uma lista de ${ETAPAS_DO_ANO.length} etapas, cada uma com o que lê e escreve declarado (\`manifesto.ts › ETAPAS_DO_ANO\`); \`test/ano.test.ts\` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. ` +
    `Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de ${vidasDaAmostraCpu.length} vidas rodada sozinha, depois das outras (que rodam em ${PARALELO} trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.`,
);
l();
l('| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |');
l('|---|---|---|---|---|---|');
{
  const deps = new Map(dependenciasDoAno().map((d) => [d.etapa, d]));
  const conteudo = new Set(ETAPAS_DO_ANO.filter((x) => (x.le as readonly string[]).includes('*')).map((x) => x.id));
  for (const x of ETAPAS_DO_ANO) {
    const d = deps.get(x.id)!;
    const doAno = conteudo.has(x.id) ? 'tudo o que veio antes' : d.doAno.map((y) => y.de).join(', ') || '—';
    const passado = d.doAnoPassado.filter((y) => y.de !== x.id).map((y) => y.de).join(', ') || '—';
    l(`| ${x.id} (${x.nome}) | ${num(cpuEtapa(x.id), 2)} ms | ${pct(cpuEtapa(x.id) / Math.max(1e-9, msPorVida))} | ${num(kbEtapa(x.id), 1)} KB | ${doAno} | ${passado} |`);
  }
  l(`| fora das etapas (nascer, escolher, agir, operar e os robôs) | ${num(msPorVida - cpuDasEtapas, 2)} ms | ${pct((msPorVida - cpuDasEtapas) / Math.max(1e-9, msPorVida))} | — | — | — |`);
}
l();
l(
  `O save de uma vida (amostra de ${saves.length}): mediana ${num(percentil(savesOrdenados, 50) / 1024, 0)} KB, p90 ${num(percentil(savesOrdenados, 90) / 1024, 0)} KB, máximo ${num(maiorSave / 1024, 0)} KB; o livro é ${pct(parteDoLivro)} dele. ` +
    'A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.',
);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes13) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Os filhos (fatia 1.4a)');
l();
l('Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.');
l();
l('| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |');
l('|---|---|---|---|---|---|');
l(`| Vidas | ${[0, 1, 2, 3, 4].map((n) => pct(parteCom(n))).join(' | ')} |`);
l();
l(`Entre as vidas com filhos (${pct(comFilhos.length / Math.max(1, vidas.length))}), a média é de ${num(media(comFilhos.map((v) => v.filhos)), 2)} filhos.`);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes14) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 1');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 2');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes2) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 3');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes3) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 5 (brincar de deus)');
l();
l(`${fortunas.length} vidas que nascem bilionárias ou trilionárias (${VIDAS_POR_FORTUNA} por classe e estratégia), além das sorteadas e das dinastias.`);
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes5) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
{
  const contagem = new Map<string, number>();
  for (const v of jogadores) for (const id of v.jogadas) contagem.set(id, (contagem.get(id) ?? 0) + 1);
  const nomes = [...contagem].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${c.porId.get(id)?.rotulo ?? id} (${n})`);
  l(`- **Jogadas mais feitas pelos robôs:** ${nomes.join(', ') || 'nenhuma'}.`);
  l(`- **Mortes numa jogada (a caminho da Lua ou de Marte):** ${mortesEmJogada} de ${fortunas.length} vidas.`);
}
l();
l('## Portões do incremento 6 (quem manda na empresa e o porquê)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes6) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
{
  const contagem = new Map<string, number>();
  for (const v of todasAsVidas) for (const id of v.jogadas) if (Object.keys(c.porId.get(id)?.condicoes ?? {}).some((k) => k.startsWith('empresa.'))) contagem.set(id, (contagem.get(id) ?? 0) + 1);
  const nomes = [...contagem].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${c.porId.get(id)?.rotulo ?? id} (${n})`);
  l(`- **Jogadas na empresa mais feitas pelos robôs:** ${nomes.join(', ') || 'nenhuma'}.`);
  l(`- **Na morte de quem manda:** a empresa perde em média ${pct(perdaNaMorte)} do valor; dependência p10 / mediana / p90: ${num(percentil(dependenciasNaMorte, 10), 0)} / ${num(percentil(dependenciasNaMorte, 50), 0)} / ${num(percentil(dependenciasNaMorte, 90), 0)}.`);
}
l();
l('## Portões do incremento 7 (as crises acabam, a vida começa sua)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes7) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 8 (o país vivo)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes8) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |');
l('|---|---|---|---|---|---|---|---|---|---|---|');
for (const [g, x] of [...noGoverno].sort((a, b) => b[1].anos - a[1].anos)) {
  const m = (k: Estatistica): number => x.soma[k] / Math.max(1, x.anos);
  const nome = g === 'voce' ? 'quem joga' : (c.mundo.governos.find((d) => d.id === g)?.nome ?? g);
  l(`| ${nome} | ${x.anos.toLocaleString('pt-BR')} | ${num(m('crescimento'), 1)}% | ${num(m('desemprego'), 1)}% | ${num(m('inflacao'), 1)}% | ${num(m('divida'), 0)}% | ${num(m('pobreza'), 1)}% | ${num(m('violencia'), 1)} | ${num(m('saude'), 0)} | ${num(m('educacao'), 0)} | ${num(m('aprovacao'), 0)}% |`);
}
l();
l('## Portões do incremento 9 (o grupo de empresas)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes9) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Portões do incremento 10 (o mundo lá fora)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes10) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |');
l('|---|---|---|---|');
for (const [g, x] of [...foraPorGoverno].sort((a, b) => b[1].anos - a[1].anos)) {
  const nome = g === 'voce' ? 'quem joga' : (c.mundo.governos.find((d) => d.id === g)?.nome ?? g);
  l(`| ${nome} | ${x.anos.toLocaleString('pt-BR')} | ${pct(x.sancoes / Math.max(1, x.anos), 2)} | ${pct(x.acordos / Math.max(1, x.anos), 2)} |`);
}
l();
l('## Portões do bloco A (o país em números)');
l();
l('| Portão | Situação | Valor |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of portoes11) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('| No fim da vida | p10 | mediana | p90 |');
l('|---|---|---|---|');
l(`| IDH | ${num(idhFim[0], 3)} | ${num(idhFim[1], 3)} | ${num(idhFim[2], 3)} |`);
l(`| Desigualdade (Gini) | ${num(giniFim[0], 3)} | ${num(giniFim[1], 3)} | ${num(giniFim[2], 3)} |`);
l(`| População (milhões) | ${num(populacaoFim[0], 0)} | ${num(populacaoFim[1], 0)} | ${num(populacaoFim[2], 0)} |`);
l(`| PIB per capita | ${formatarDinheiro(perCapitaFim[0])} | ${formatarDinheiro(perCapitaFim[1])} | ${formatarDinheiro(perCapitaFim[2])} |`);
l();
l('## Life simulator');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | ${pct(satV(sat, 5))} / ${pct(satV(sat, 20))} |`);
l(`| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | ${pct(satV(satRegras, 5))} |`);
l(`| Efeito da memória (aleatória, V5 sem → com memória) | ${pct(satV(satSemMemoria, 5))} → ${pct(satV(satAleatoria, 5))} |`);
l(`| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | ${num(assinaturas, 0)} (${num(destinos, 0)}) |`);
l(`| Mobilidade: mesmo quintil da origem ao fim | ${pct(mob.diagonal)} |`);
l(`| Mobilidade: correlação de postos origem × fim (Spearman) | ${num(mob.spearman, 2)} |`);
l(`| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | ${pct(mob.baixoParaAlto)} / ${pct(mob.altoParaBaixo)} |`);
l(`| Patrimônio p90/p10 | ${Number.isFinite(razao9010) ? num(razao9010, 1) + '×' : 'p10 ≤ 0'} (p10 ${formatarDinheiro(p10)}, p90 ${formatarDinheiro(p90)}) |`);
l(`| Desvio-padrão da felicidade média da vida | ${num(desvioFelicidade, 2)} |`);
l(`| Vidas com patrimônio negativo ao morrer | ${pct(negativas)} |`);
l(`| Mudanças de estado causadas pelo jogador | ${pct(parteJogador)} |`);
l(`| Toques por vida | ${num(toques, 1)} |`);
l(`| Tempo de CPU por vida | ${num(msPorVida, 2)} ms |`);
l(`| Ações (fichas usadas) por vida | ${num(media(vidas.map((v) => v.acoes.length)), 1)} |`);
l(`| Mortes na família por vida | ${num(media(vidas.map((v) => v.mortesNaFamilia)), 1)} |`);
l(`| Pontos de virada que vêm do mundo (não do jogador) | ${pct(pontosMundo)} |`);
l();
l('### Dinheiro e dinastia');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | ${num(operacoesPorVida, 1)} |`);
l(`| Vidas que terminam com filho ou filha para continuar | ${pct(comHerdeiro)} |`);
l(`| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | ${num(media(tamanhos), 1)} / ${pct(chegamTerceira)} / ${pct(tamanhos.filter((t) => t >= 5).length / Math.max(1, tamanhos.length))} |`);
l(`| Idade de quem herda ao começar (mediana) / herança mediana | ${num(percentil(ordenar(geracoes.filter((g) => g.geracao > 1).map((g) => g.inicio)), 50), 0)} anos / ${formatarDinheiro(percentil(ordenar(geracoes.filter((g) => g.geracao > 1).map((g) => g.herdou)), 50))} |`);
l(`| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | ${num(entreGeracoes, 2)} |`);
l();
l('### Empresa e riqueza');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Vidas que abriram empresa (pela folha ou por um storylet) | ${pct(fundaram)} |`);
l(`| Entre quem abriu: quebrou / vendeu | ${pct(quebraFundadores)} / ${pct(vendaFundadores)} |`);
l(`| Quem nasce sem fortuna (classes 0 a 3, ${semFortuna.n} vidas): mediana / p90 / p99 / maior | ${formatarDinheiro(semFortuna.p50)} / ${formatarDinheiro(semFortuna.p90)} / ${formatarDinheiro(semFortuna.p99)} / ${formatarDinheiro(semFortuna.max)} |`);
l(`| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | ${pct(semFortuna.dez, 2)} / ${pct(semFortuna.cem, 2)} / ${pct(semFortuna.bilhao, 2)} |`);
l();
l('### Anos com vida');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | ${pct(anosVazios)} |`);
l(`| Storylets apresentados por vida / ações (fichas usadas) por vida | ${num(media(vidas.map((v) => v.instancias.length)), 1)} / ${num(media(vidas.map((v) => v.acoes.length)), 1)} |`);
l();
l(`Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos ${LAB} sorteios do país para os três perfis:`);
l();
l('| Perfil | p10 | Mediana | p90 |');
l('|---|---|---|---|');
for (const p of laboratorio) l(`| ${p.perfil} | ${formatarDinheiro(p.p10)} | ${formatarDinheiro(p.p50)} | ${formatarDinheiro(p.p90)} |`);
l();
l('Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):');
l();
l('| Perfil | Vidas | p10 | Mediana | p90 |');
l('|---|---|---|---|---|');
for (const p of porPerfil) l(`| ${p.perfil} | ${p.n} | ${formatarDinheiro(p.p10)} | ${formatarDinheiro(p.p50)} | ${formatarDinheiro(p.p90)} |`);
l();
l(`Origem escolhida (${VIDAS_POR_ORIGEM} vidas por estratégia e classe, fora das métricas acima):`);
l();
l('| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |');
l('|---|---|---|---|---|');
for (const o of porOrigem) l(`| ${o.nome.replace(/_/g, ' ')} | ${o.n} | ${num(o.idade, 1)} | ${formatarDinheiro(o.patrimonio)} | ${num(o.felicidade, 1)} |`);
l();
l('### O mundo reage');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | ${FASES.map((f) => pct(parteFase(f), 0)).join(' / ')} |`);
l(`| Notícias do país por vida | ${num(media(vidas.map((v) => v.noticias)), 1)} |`);
l(`| Demissões por vida / vindas de uma recessão ou crise | ${num(demissoesTotal / vidas.length, 2)} / ${pct(vidas.reduce((s, v) => s + v.demissoesPelaFase, 0) / Math.max(1, demissoesTotal))} |`);
l(`| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | ${num(carreiras, 0)} |`);
const setoresFinais = new Map<string, number>();
for (const v of vidas) {
  const setor = v.carreiraSetor.split('/')[0]!;
  setoresFinais.set(setor, (setoresFinais.get(setor) ?? 0) + 1);
}
l(`| Setor do último trabalho | ${[...setoresFinais].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${c.setores.get(k)?.nome ?? k} ${pct(n / vidas.length, 0)}`).join(' · ')} |`);
l();
l('| Vida | ' + [2, 3, 4, 5, 10, 15, 20].map((k) => `${k}ª`).join(' | ') + ' |');
l('|---|---|---|---|---|---|---|---|');
l('| Já visto antes | ' + [2, 3, 4, 5, 10, 15, 20].map((k) => pct(satV(sat, k), 0)).join(' | ') + ' |');
l();
l('Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):');
l();
l('| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |');
l('|---|---|---|---|---|---|');
mob.matriz.forEach((linha, i) => l(`| Q${i + 1} | ${linha.map((x) => pct(x, 0)).join(' | ')} |`));
l();
l('Por classe de origem:');
l();
l('| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |');
l('|---|---|---|---|---|');
for (let k = 0; k < c.mundo.classes.length; k++) {
  const vs = vidas.filter((v) => v.classeOrigem === k);
  if (vs.length === 0) continue;
  l(`| ${c.mundo.classes[k]!.nome} | ${pct(vs.length / vidas.length, 0)} | ${num(media(vs.map((v) => v.idade)))} | ${formatarDinheiro(percentil(ordenar(vs.map((v) => v.patrimonio)), 50))} | ${num(media(vs.map((v) => v.felicidade)))} |`);
}
l();
l('## Repetição');
l();
l(`- **Dentro de uma vida:** ${pct(media(repeticaoInterna))} das aparições repetem uma instância já vista na mesma vida; pior vida: ${pct(Math.max(...repeticaoInterna))}.`);
l(`- **Texto repetido entre vidas:** ${pct(repTextos)} dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.`);
const maisRepetidos = [...repetidosNaVida].sort((a, b) => b[1] - a[1]).slice(0, 6);
l(`- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): ${maisRepetidos.map(([id, n]) => `\`${id}\` ${num((n / Math.max(1, totalAparicoes)) * 100)}`).join(' · ')}`);
l();
l('## Dilemas');
l();
l(
  `Medidos em três bolsos de adulto: ${NOMES_DOS_BOLSOS.map((b) => `${NOME_DO_BOLSO[b]} (${formatarDinheiro(BOLSOS[b].dinheiro)} na conta e ${formatarDinheiro(BOLSOS[b].renda)} de renda por ano)`).join(', ')}. ` +
    `Os storylets que pedem empresa se medem com uma de ${formatarDinheiro(EMPRESA_TIPICA)}, inteira de quem joga.`,
);
l();
const listaDeIds = (ids: string[]): string => (ids.length ? ids.map((id) => `\`${id}\``).join(', ') : 'nenhum');
l(
  `- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): ${dilemasFalsos.length ? dilemas.map((d) => `${NOME_DO_BOLSO[d.bolso]}: ${listaDeIds(d.falsos.map((f) => f.evento))}`).join(' · ') : 'nenhum, nos três bolsos'}`,
);
const riscoTipico = dilemas.find((d) => d.bolso === 'tipico')!.risco;
l(
  `- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): ` +
    `${dilemas.map((d) => `${NOME_DO_BOLSO[d.bolso]} ${d.risco.achados.length} de ${d.risco.avaliados} (${pct(d.risco.achados.length / Math.max(1, d.risco.avaliados), 0)})`).join(' · ')}. Algumas são armadilhas de propósito.`,
);
l(`  - No típico: ${listaDeIds(riscoTipico.achados)}.`);
for (const d of dilemas) {
  if (d.bolso === 'tipico') continue;
  const mais = d.risco.achados.filter((id) => !riscoTipico.achados.includes(id));
  const menos = riscoTipico.achados.filter((id) => !d.risco.achados.includes(id));
  l(`  - No ${NOME_DO_BOLSO[d.bolso]}, a mais que no típico: ${listaDeIds(mais)}; a menos: ${listaDeIds(menos)}.`);
}
l();
l('## Storylets');
l();
l(`- **Mortos (nunca aparecem):** ${mortos.length ? mortos.map((m) => `\`${m}\``).join(', ') : 'nenhum'}`);
l(`- **Raros (em menos de 0,5% das vidas):** ${raros.length ? raros.map((m) => `\`${m}\``).join(', ') : 'nenhum'}`);
l(`- **Apresentados por vida:** ${num(media(vidas.map((v) => v.instancias.length)))} · **com causa anterior (cadeia):** ${num(media(vidas.map((v) => v.comCausa)))} · **maior distância causa→consequência:** ${num(media(vidas.map((v) => v.maiorDistancia)))} anos em média`);
l(`- **Vidas com 3 pontos de virada no cartão:** ${pct(vidas.filter((v) => v.pontos >= 3).length / vidas.length)}`);
l();
const freq = [...vidasCom].map(([id, n]) => [id, n / vidas.length] as const).sort((a, b) => b[1] - a[1]);
l('<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>');
l();
l('| Storylet | Tipo | Vidas |');
l('|---|---|---|');
for (const [id, f] of freq) l(`| \`${id}\` | ${tipoDe(c.porId.get(id)!)} | ${pct(f)} |`);
l();
l('</details>');
l();
l('## Qualidades');
l();
l(`- **Ganhas na simulação (de quem joga):** ${criadasNaSimulacao.size} · **mudaram algo em pelo menos uma vida:** ${ativas.size}`);
l(`- **Qualidades que nunca dispararam nada:** ${inertes.length ? inertes.map((m) => `\`${m}\``).join(', ') : 'nenhuma'}`);
l();
l('## Distribuições');
l();
l(`**Idade de morte** — média ${num(media(idades))} · p10 ${percentil(idades, 10)} · p25 ${percentil(idades, 25)} · mediana ${percentil(idades, 50)} · p75 ${percentil(idades, 75)} · p90 ${percentil(idades, 90)}`);
l();
l('```');
l(
  histograma(
    idades,
    [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200].slice(1).map((ate, i, arr) => ({
      rotulo: i === 0 ? 'até 19' : i === arr.length - 1 ? '100+' : `${[0, 20, 30, 40, 50, 60, 70, 80, 90, 100][i]}–${ate - 1}`,
      ate,
    })),
  ),
);
l('```');
l();
l(`**Patrimônio ao morrer** (reais de hoje) — p10 ${formatarDinheiro(p10)} · p25 ${formatarDinheiro(percentil(patOrd, 25))} · mediana ${formatarDinheiro(percentil(patOrd, 50))} · p75 ${formatarDinheiro(percentil(patOrd, 75))} · p90 ${formatarDinheiro(p90)}`);
l();
l('```');
l(
  histograma(patOrd, [
    { rotulo: 'negativo', ate: 0 },
    { rotulo: 'até 10 mil', ate: 10000 },
    { rotulo: '10–50 mil', ate: 50000 },
    { rotulo: '50–200 mil', ate: 200000 },
    { rotulo: '200 mil–1 mi', ate: 1000000 },
    { rotulo: '1–5 mi', ate: 5000000 },
    { rotulo: '5 mi+', ate: Infinity },
  ]),
);
l('```');
l();
l(`**Felicidade média ao longo da vida** — p10 ${num(percentil(felicidades, 10), 0)} · mediana ${num(percentil(felicidades, 50), 0)} · p90 ${num(percentil(felicidades, 90), 0)}`);
l();
l('```');
l(
  histograma(
    felicidades,
    [30, 40, 50, 60, 70, 80, 101].map((ate, i, arr) => ({
      rotulo: i === 0 ? 'até 29' : i === arr.length - 1 ? '80+' : `${arr[i - 1]}–${ate - 1}`,
      ate,
    })),
  ),
);
l('```');
l();
l('## Estratégias');
l();
l('Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.');
l();
l('| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |');
l('|---|---|---|---|---|---|---|---|---|');
for (const r of porEstrategia) {
  const marca = (k: (typeof CRITERIOS)[number][0]): string => (porEstrategia.every((o) => o === r || r[k] > o[k]) ? ' 🏆' : '');
  l(
    `| ${r.estrategia} | ${num(r.idade)}${marca('idade')} | ${formatarDinheiro(r.patrimonio)}${marca('patrimonio')} | ${num(r.felicidade)}${marca('felicidade')} | ${num(r.eventos)} | ${num(r.acoes)} | ${num(r.comCausa)} | ${pct(r.tresPontos, 0)} | ${pct(r.saturacaoV5, 0)} |`,
  );
}
l();
l(dominantes.length ? `**Dominante: ${dominantes.join(', ')}. O jogo está quebrado.**` : 'Nenhuma estratégia fixa vence nos três critérios.');
l();
l('### Causas de morte mais comuns');
l();
const causas = new Map<string, number>();
for (const v of vidas) causas.set(v.causaMorte, (causas.get(v.causaMorte) ?? 0) + 1);
for (const [causa, n] of [...causas].sort((a, b) => b[1] - a[1]).slice(0, 8)) l(`- ${pct(n / vidas.length)} — ${causa}`);
l();
l('## Como medimos');
l();
l('- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.');
l('- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.');
l('- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).');
l('- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.');
l(`- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de ${vidasDaAmostraCpu.length} vidas rodada sozinha depois das outras. As outras rodam em ${PARALELO} trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.`);
l('- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).');
l();

const relatorio = linhas.join('\n');
// Só o túnel inteiro (10.000 vidas, a semente de sempre) escreve docs/metricas.md; um parcial vai para o lado, sem apagar o oficial.
const oficial = TOTAL === 10000 && !args.has('semente');
if (!args.has('sem-arquivo')) writeFileSync(oficial ? join(RAIZ, 'docs', 'metricas.md') : join(RAIZ, 'dist-tunel.md'), relatorio);

console.log(`Túnel: ${vidas.length.toLocaleString('pt-BR')} vidas em ${segundos.toFixed(1)} s (${PARALELO} ${PARALELO === 1 ? 'núcleo' : 'núcleos'})${oficial ? '' : '; parcial: o relatório foi para dist-tunel.md'}`);
for (const [nome, ok, detalhe] of metas) console.log(`${ok ? '✓' : '✗'} ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes) console.log(`${ok ? '✓' : '·'} portão: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes2) console.log(`${ok ? '✓' : '·'} portão 2: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes3) console.log(`${ok ? '✓' : '·'} portão 3: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes5) console.log(`${ok ? '✓' : '·'} portão 5: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes6) console.log(`${ok ? '✓' : '·'} portão 6: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes7) console.log(`${ok ? '✓' : '·'} portão 7: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes8) console.log(`${ok ? '✓' : '·'} portão 8: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes9) console.log(`${ok ? '✓' : '·'} portão 9: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes10) console.log(`${ok ? '✓' : '·'} portão 10: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes11) console.log(`${ok ? '✓' : '·'} portão A: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesB) console.log(`${ok ? '✓' : '·'} portão B: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesC) console.log(`${ok ? '✓' : '·'} portão C: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesD) console.log(`${ok ? '✓' : '·'} portão D: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesE) console.log(`${ok ? '✓' : '·'} portão E: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesF) console.log(`${ok ? '✓' : '·'} portão F: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoesOmega1) console.log(`${ok ? '✓' : '·'} portão Ω1: ${nome} (${detalhe})`);
console.log(`Perfis (aleatória): ${porPerfil.map((p) => `${p.perfil} n=${p.n} p10 ${formatarDinheiro(p.p10)} p50 ${formatarDinheiro(p.p50)} p90 ${formatarDinheiro(p.p90)}`).join(' · ')}`);
console.log(`Origens escolhidas: ${porOrigem.map((o) => `${o.nome} ${formatarDinheiro(o.patrimonio)}`).join(' · ')}`);
console.log(
  `Saturação V5 ${pct(satV(sat, 5))} · V20 ${pct(satV(sat, 20))} · com regras ${pct(satV(satRegras, 5))} · assinaturas/1000 ${num(assinaturas, 0)} (destino ${num(destinos, 0)}) · ` +
    `mobilidade diag ${pct(mob.diagonal)} ρ ${num(mob.spearman, 2)} · p90/p10 ${Number.isFinite(razao9010) ? num(razao9010, 1) : 'p10≤0'} · desvio felicidade ${num(desvioFelicidade, 2)} · ` +
    `negativas ${pct(negativas)} · jogador ${pct(parteJogador)} · toques ${num(toques, 1)} · ${num(msPorVida, 2)} ms/vida`,
);
console.log(
  `Falsos dilemas: ${dilemasFalsos.length} (${dilemas.map((d) => `${NOME_DO_BOLSO[d.bolso]} ${d.falsos.length}`).join(' · ')}) · ` +
    `arriscar nunca compensa: ${dilemas.map((d) => `${NOME_DO_BOLSO[d.bolso]} ${d.risco.achados.length} de ${d.risco.avaliados}`).join(' · ')}`,
);
console.log(`Idade média ${num(media(idades))} · patrimônio mediano ${formatarDinheiro(percentil(patOrd, 50))} · felicidade média ${num(media(felicidades))}`);
for (const r of porEstrategia) {
  console.log(`  ${r.estrategia.padEnd(10)} idade ${num(r.idade)} · patrimônio ${formatarDinheiro(r.patrimonio)} · felicidade ${num(r.felicidade)} · storylets ${num(r.eventos)} · ações ${num(r.acoes)} · V5 ${pct(r.saturacaoV5, 0)}`);
}
if (mortos.length) console.log(`Mortos: ${mortos.join(', ')}`);
if (raros.length) console.log(`Raros: ${raros.join(', ')}`);
if (inertes.length) console.log(`Qualidades inertes: ${inertes.join(', ')}`);
process.exit(metas.every(([, ok]) => ok) ? 0 : 1);
