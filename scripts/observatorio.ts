/**
 * npm run observatorio: o observatório de jogadores (etapa 03, I-198).
 *
 * Sem arquivo, observa robôs: eles não são jogadores, e o relatório diz isso na capa. A população é fixa (as mesmas
 * sementes a cada rodada), em trilhas que dividem a memória entre vidas:
 * - comuns: as quatro estratégias do túnel, doze jogadores cada, quatro vidas seguidas por jogador (a repetição entre
 *   vidas aparece), origem sorteada;
 * - extremos: as origens das pontas (bilionária, trilionária, realeza, regime), com a arriscada e a cautelosa;
 * - dinastias: os nove cenários da bancada (scripts/dinastias.ts), oito gerações cada (a família sem herdeiro segue por
 *   um sobrinho, marcado como intervenção).
 *
 * Com --arquivo=OBSERVACAO.json (o que o menu do jogo exporta), observa as vidas de quem jogou e escreve o relatório
 * delas. Nada sai do aparelho de ninguém: o arquivo é o que a pessoa escolheu mandar.
 *
 * Uso: npm run observatorio -- [--rapido] [--saida=docs/observatorio.md] [--json=dist-observatorio.json]
 *        [--arquivo=OBSERVACAO.json] [--vida=SEMENTE[:GERACAO]]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { carregarConteudo } from './disco.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { dec, emMarkdown, exemplo, numero, relatorioDe } from '../src/motor/inteligencia.ts';
import { lembrarVida, novaMemoria } from '../src/motor/memoria.ts';
import { jogarObservando, type VidaObservada } from '../src/motor/observacao.ts';
import type { EscolhaOrigem } from '../src/motor/origem.ts';
import { NOMES_DOS_PERFIS, perfisDaVida, perfisFortes } from '../src/motor/perfis.ts';
import { ESTRATEGIAS, type Estrategia } from '../src/motor/robos.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import { saturacaoDaVida } from '../src/motor/saturacao.ts';
import { extremosDaVida } from '../src/motor/extremos.ts';
import type { MemoriaJogador } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { formatarDinheiro } from '../src/motor/texto.ts';
import { lerArquivoDeObservacao } from '../src/jogo/formato-da-observacao.ts';

const args = process.argv.slice(2);
const texto = (nome: string): string | undefined => args.find((a) => a.startsWith(`--${nome}=`))?.slice(nome.length + 3);
const RAPIDO = args.includes('--rapido');
const c = carregarConteudo();

interface Trilha {
  cenario: string;
  estrategia: Estrategia;
  origem: EscolhaOrigem;
  /** A semente de cada vida (comuns) ou a da primeira geração (dinastias). */
  sementes: number[];
  dinastia: boolean;
  geracoes: number;
}

function plano(): Trilha[] {
  const trilhas: Trilha[] = [];
  const jogadores = RAPIDO ? 3 : 12;
  ESTRATEGIAS.forEach((estrategia, i) => {
    for (let j = 0; j < jogadores; j++) {
      const base = 10_000 + 1_000 * i + 10 * j;
      trilhas.push({ cenario: 'comum', estrategia, origem: {}, sementes: [base, base + 1, base + 2, base + 3], dinastia: false, geracoes: 1 });
    }
  });
  const extremos: [string, EscolhaOrigem][] = [
    ['bilionaria', { classe: 6 }],
    ['trilionaria', { classe: 7 }],
    ['realeza', { linhagem: 'realeza' }],
    ['regime', { linhagem: 'regime' }],
  ];
  const porCenario = RAPIDO ? 2 : 8;
  extremos.forEach(([cenario, origem], i) => {
    for (const estrategia of ['arriscada', 'cautelosa'] as const) {
      for (let k = 0; k < porCenario; k++) trilhas.push({ cenario, estrategia, origem, sementes: [20_000 + 1_000 * i + (estrategia === 'arriscada' ? 0 : 500) + k], dinastia: false, geracoes: 1 });
    }
  });
  const dinastias: [string, Estrategia, EscolhaOrigem][] = [
    ['dinastia-rica-arriscada', 'arriscada', { classe: 5 }],
    ['dinastia-rica-cautelosa', 'cautelosa', { classe: 5 }],
    ['dinastia-bilionaria-arriscada', 'arriscada', { classe: 6 }],
    ['dinastia-trilionaria-cautelosa', 'cautelosa', { classe: 7 }],
    ['dinastia-media-arriscada', 'arriscada', { classe: 2 }],
    ['dinastia-pobre-cautelosa', 'cautelosa', { classe: 0 }],
    ['dinastia-realeza-cautelosa', 'cautelosa', { linhagem: 'realeza' }],
    ['dinastia-regime-arriscada', 'arriscada', { linhagem: 'regime' }],
    ['dinastia-sorteada-aleatoria', 'aleatoria', {}],
  ];
  for (const [cenario, estrategia, origem] of dinastias.slice(0, RAPIDO ? 3 : dinastias.length)) {
    trilhas.push({ cenario, estrategia, origem, sementes: [101], dinastia: true, geracoes: RAPIDO ? 3 : 8 });
  }
  return trilhas;
}

/** Joga uma trilha observando cada vida; para em `ate` (a semente e a geração pedidas), se houver. */
function jogarTrilha(t: Trilha, ate?: { semente: number; geracao: number }): VidaObservada[] {
  const saida: VidaObservada[] = [];
  let memoria: MemoriaJogador = novaMemoria();
  if (!t.dinastia) {
    for (const semente of t.sementes) {
      const e = nascer(c, { semente, ano: 2026, origem: t.origem });
      const partida = `${t.cenario}-${semente}`;
      const { vida } = jogarObservando(c, e, t.estrategia, criarRng(misturar(semente, 77)), memoria, { fonte: 'robo', partida, cenario: t.cenario, estrategia: t.estrategia });
      saida.push(vida);
      memoria = lembrarVida(memoria, e);
      if (ate && ate.semente === semente) break;
    }
    return saida;
  }
  const semente = t.sementes[0]!;
  let e = nascer(c, { semente, ano: 2026, origem: t.origem });
  let intervencao = false;
  for (let g = 1; g <= t.geracoes; g++) {
    const robo = criarRng(misturar(semente, 77, g));
    const { vida } = jogarObservando(c, e, t.estrategia, robo, memoria, {
      fonte: 'robo',
      partida: `${t.cenario}-${semente}`,
      cenario: t.cenario,
      estrategia: t.estrategia,
      ...(intervencao ? { intervencao: true } : {}),
    });
    saida.push(vida);
    memoria = lembrarVida(memoria, e);
    if ((ate && ate.semente === semente && ate.geracao === g) || g === t.geracoes) break;
    intervencao = false;
    if (!herdeiroPossivel(e, c)) {
      // A intervenção da bancada: um sobrinho distante leva a família adiante.
      const eu = e.entidades['eu']!;
      eu.n['irmaos'] = Math.max(1, eu.n['irmaos'] ?? 0);
      delete eu.t['testamento'];
      intervencao = true;
      if (!herdeiroPossivel(e, c)) break;
    }
    e = continuarComoHerdeiro(e, c);
  }
  return saida;
}

/** A parte do PIB com casas que bastem para não virar zero (0,0013% do PIB). */
const doPib = (x: number): string => (x >= 0.1 ? dec(100 * x, 1) : x >= 0.001 ? dec(100 * x, 2) : (100 * x).toPrecision(2).replace('.', ','));

/** Uma vida contada década a década: os perfis fortes, a saturação e os extremos. */
function vidaEmDetalhe(v: VidaObservada): string[] {
  const l: string[] = [];
  const p = perfisDaVida(v);
  const sat = saturacaoDaVida(v);
  const ext = extremosDaVida(v);
  l.push(`### ${exemplo(v)}`, '');
  l.push(`Viveu de ${v.inicio} a ${v.fim?.ano ?? v.anos.at(-1)?.ano} (${v.fim?.idade ?? v.anos.at(-1)?.idade} anos), com ${v.registros.filter((r) => r.tipo !== 'ano').length} decisões. Patrimônio final: ${formatarDinheiro(v.fim?.patrimonio ?? 0)} (${doPib(v.fim?.patrimonioSobrePib ?? 0)}% do PIB, percentil ${dec((v.fim?.percentil ?? 0) * 100, 2)}).`, '');
  l.push('| Década | Perfis fortes (≥ 0,6) | Saturação média | Patrimônio no fim da década |', '|---|---|---|---|');
  for (const j of p.janelas) {
    const anos = sat.anos.filter((a) => a.ano >= j.de && a.ano <= j.ate);
    const foto = [...v.anos].reverse().find((f) => f.ano <= j.ate + 1);
    l.push(`| ${j.de}–${j.ate} | ${perfisFortes(j.perfis, 0.6).map((x) => `${NOMES_DOS_PERFIS[x.perfil]} ${Math.round(x.p * 100)}%`).join(', ') || '—'} | ${anos.length > 0 ? dec(anos.reduce((s, a) => s + a.indice, 0) / anos.length, 2) : '-'} | ${formatarDinheiro(foto?.patrimonio ?? 0)} |`);
  }
  l.push('');
  if (ext.length > 0) l.push(`Extremos: ${ext.map((a) => `${a.medida} = ${numero(a.valor)} (${a.nivel === 'extremo' ? 'extremo' : 'notável'}, desde ${a.ano})`).join('; ')}.`, '');
  if (sat.esgotadoDesde !== null) l.push(`A experiência se esgotou em ${sat.esgotadoDesde} (saturação ≥ 0,7 por cinco anos).`, '');
  return l;
}

// ---------------------------------------------------------------- a rodada

const arquivo = texto('arquivo');
const pedida = texto('vida');
const t0 = performance.now();
if (pedida) {
  const [s, g] = pedida.split(':').map(Number);
  const trilha = plano().find((t) => t.sementes.includes(s!));
  if (!trilha) throw new Error(`nenhuma trilha tem a semente ${s}`);
  const vidas = jogarTrilha(trilha, { semente: s!, geracao: g ?? 1 });
  console.log(vidaEmDetalhe(vidas.at(-1)!).join('\n'));
} else {
  let vidas: VidaObservada[];
  let fonte: string;
  let descricao: string;
  if (arquivo) {
    const lido = lerArquivoDeObservacao(readFileSync(arquivo, 'utf8'));
    if ('erro' in lido) throw new Error(lido.erro);
    vidas = lido.vidas;
    // A capa diz de quem são as vidas pela origem gravada em cada uma, não pelo caminho do arquivo.
    const deRobo = vidas.filter((v) => v.fonte === 'robo').length;
    const deJogador = vidas.length - deRobo;
    fonte = deRobo === 0 ? 'vidas exportadas por quem jogou' : deJogador === 0 ? 'robôs (de um arquivo; não são jogadores)' : 'um arquivo com vidas de quem jogou e de robôs';
    descricao = [
      `Um arquivo de observação (${vidas.length} vidas: ${deJogador} de quem jogou, ${deRobo} de robôs).`,
      deJogador > 0 ? 'As vidas de quem jogou são de uma pessoa, não do público: nada aqui fala de "os jogadores".' : '',
      deRobo > 0 ? 'As vidas de robôs medem o jogo diante das regras deles, não o comportamento de pessoas.' : '',
    ].filter(Boolean).join(' ');
  } else {
    vidas = plano().flatMap((t) => jogarTrilha(t));
    fonte = 'robôs (não são jogadores)';
    descricao = [
      `**Estas vidas são de robôs.** Os quatro robôs do túnel (primeira opção, cautelosa, arriscada e aleatória) decidem por regras fixas: o que eles fazem mede o jogo diante dessas regras, não o comportamento de pessoas. Nenhum dado de jogador real entrou aqui.`,
      '',
      `População fixa (as mesmas sementes a cada rodada${RAPIDO ? ', versão rápida' : ''}): comuns (as quatro estratégias, jogadores com quatro vidas seguidas e a memória entre elas), extremos (bilionária, trilionária, realeza e regime, com a arriscada e a cautelosa) e as dinastias da bancada (oito gerações). Para ver uma vida década a década: \`npm run observatorio -- --vida=SEMENTE[:GERACAO]\`.`,
    ].join('\n');
  }
  const r = relatorioDe(vidas, c, { fonte, descricao });
  const md = [emMarkdown(r), '## Vidas em detalhe', '', ...escolhidas(vidas).flatMap(vidaEmDetalhe)].join('\n');
  const saida = texto('saida') ?? (arquivo ? 'dist-observatorio.md' : 'docs/observatorio.md');
  writeFileSync(saida, md + '\n');
  const json = texto('json');
  if (json) writeFileSync(json, JSON.stringify({ versao: 1, fonte, vidas }));
  console.log(`${vidas.length} vidas, ${r.registros} registros em ${((performance.now() - t0) / 1000).toFixed(0)} s → ${saida}`);
  for (const it of [...r.gargalos, ...r.conteudoInsuficiente].slice(0, 6)) console.log(`- ${it.titulo}`);
}

/** As vidas que o relatório conta em detalhe: a mais rica, a mais longa dinastia, a mais saturada e uma comum. */
function escolhidas(vidas: readonly VidaObservada[]): VidaObservada[] {
  if (vidas.length === 0) return [];
  const porPatrimonio = [...vidas].sort((a, b) => (b.fim?.patrimonioSobrePib ?? 0) - (a.fim?.patrimonioSobrePib ?? 0));
  const porGeracao = [...vidas].sort((a, b) => b.geracao - a.geracao);
  const porSaturacao = [...vidas].sort((a, b) => saturacaoDaVida(b).media - saturacaoDaVida(a).media);
  const comum = vidas.find((v) => v.cenario === 'comum') ?? vidas[0]!;
  return [...new Set([porPatrimonio[0]!, porGeracao[0]!, porSaturacao[0]!, comum])];
}
