/**
 * npm run tunel — túnel de vento. Robôs jogam 10.000 vidas (4 estratégias ×
 * 250 jogadores × 10 vidas seguidas, com a memória entre vidas que o jogo usa)
 * e o relatório vai para docs/metricas.md.
 *
 * Opções: --vidas=N (total aproximado), --sem-arquivo, --semente=N.
 * Sai com código 1 se uma meta da fase 1 quebrar: evento morto, evento
 * não-repetível repetido na mesma vida ou estratégia fixa dominante.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { carregarConteudo, RAIZ } from './disco.ts';
import type { Conteudo } from '../src/motor/conteudo.ts';
import type { Condicoes } from '../src/motor/esquema.ts';
import { lembrarVida, novaMemoria } from '../src/motor/memoria.ts';
import { ESTRATEGIAS, arriscarNaoCompensa, decidir, estadoTipico, falsosDilemas, type Estrategia } from '../src/motor/robos.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida, MemoriaJogador } from '../src/motor/tipos.ts';
import { listarCadeias } from '../src/motor/validacao.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { pontosDeVirada } from '../src/motor/virada.ts';
import { formatarDinheiro } from '../src/motor/texto.ts';
import { ATRIBUTOS } from '../src/motor/constantes.ts';
import { patrimonio as patrimonioDe } from '../src/motor/condicoes.ts';
import { aleatorio } from '../src/motor/rng.ts';
import { assinaturasPorBloco, desvio, mobilidade, saturacao } from './medidas.ts';

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
const ANO = 2026;

interface Vida {
  estrategia: Estrategia;
  idade: number;
  patrimonio: number;
  felicidade: number;
  eventos: string[];
  /** Textos renderizados (eventos e linhas), para medir repetição de texto entre vidas. */
  textos: string[];
  comCausa: number;
  pontos: number;
  maiorDistancia: number;
  marcasVistas: Set<string>;
  /** Marcas que de fato mudaram algo: liberaram evento, escolha, linha, causa de morte ou epitáfio. */
  marcasAtivas: Set<string>;
  causaMorte: string;
  duplicadosProibidos: string[];
  /** Storylets apresentados (instâncias), para a saturação entre vidas. */
  instancias: string[];
  assinatura: string;
  /** Assinatura sem a origem: mostra se as vidas divergem, não só os rótulos de nascimento. */
  destino: string;
  /** Riqueza de origem (posto) e um desempate sorteado, para a matriz de mobilidade. */
  origem: number;
  desempate: number;
  mudancasJogador: number;
  mudancasTotal: number;
  toques: number;
  ms: number;
}

type Jogada = EstadoVida & {
  marcasVistas: Set<string>;
  linhasUsadas: Set<number>;
  mudancasJogador: number;
  mudancasTotal: number;
  toques: number;
  ms: number;
};

interface Foto {
  atributos: number[];
  patrimonio: number;
  renda: number;
  marcas: Set<string>;
  personagens: number;
}

function fotografar(e: EstadoVida): Foto {
  return {
    atributos: ATRIBUTOS.map((a) => e.atributos[a]),
    patrimonio: patrimonioDe(e),
    renda: e.financas.renda,
    marcas: new Set(Object.keys(e.marcas)),
    personagens: Object.keys(e.personagens).length,
  };
}

/** Mudanças de estado entre duas fotos (definição em docs/metricas.md). */
function mudancas(a: Foto, b: Foto): number {
  let n = 0;
  a.atributos.forEach((x, i) => {
    if (Math.abs(b.atributos[i]! - x) >= 0.5) n++;
  });
  if (Math.abs(b.patrimonio - a.patrimonio) >= 500) n++;
  if (Math.abs(b.renda - a.renda) >= 600) n++;
  for (const m of b.marcas) if (!a.marcas.has(m)) n++;
  for (const m of a.marcas) if (!b.marcas.has(m)) n++;
  return n + Math.abs(b.personagens - a.personagens);
}

function jogar(c: Conteudo, estrategia: Estrategia, semente: number, memoria: MemoriaJogador | undefined): Jogada {
  const t0 = performance.now();
  const e = nascer(c, { semente, ano: ANO });
  const robo = criarRng(misturar(semente, 77));
  const marcasVistas = new Set(Object.keys(e.marcas));
  const linhasUsadas = new Set<number>();
  let mudancasJogador = 0;
  let mudancasTotal = 0;
  let toques = 1; // nascer
  while (e.vivo) {
    const antes = fotografar(e);
    if (e.pendente) {
      escolher(e, c, decidir(estrategia, e, c, robo));
      for (const m of Object.keys(e.marcas)) marcasVistas.add(m);
      const n = mudancas(antes, fotografar(e));
      mudancasJogador += n;
      mudancasTotal += n;
    } else {
      avancarAno(e, c, memoria);
      mudancasTotal += mudancas(antes, fotografar(e));
      const ultima = e.historico[e.historico.length - 1];
      if (ultima?.tipo === 'linha' && e.linhasRecentes.length > 0) linhasUsadas.add(e.linhasRecentes[e.linhasRecentes.length - 1]!);
    }
    toques++;
  }
  return Object.assign(e, { marcasVistas, linhasUsadas, mudancasJogador, mudancasTotal, toques, ms: performance.now() - t0 });
}

// ---------------------------------------------------------------- assinatura da vida

/** Classes por patrimônio em reais de hoje (as mesmas faixas servem para origem e destino). */
const CLASSES = [
  ['extrema pobreza', 5000],
  ['pobre', 40000],
  ['remediada', 200000],
  ['média', 1000000],
  ['rica', 5000000],
  ['muito rica', Infinity],
] as const;
const classeDe = (p: number): string => CLASSES.find(([, ate]) => p < ate)![0];

const CARREIRAS: [string, string][] = [
  ['vereador', 'política'],
  ['servidor', 'serviço público'],
  ['empreendedor', 'negócio próprio'],
  ['socio', 'negócio próprio'],
  ['influencer', 'internet'],
  ['criador_conteudo', 'internet'],
  ['musico', 'música'],
  ['pesquisador', 'pesquisa'],
  ['profissional', 'carreira formal'],
  ['clt', 'carteira assinada'],
  ['entregador', 'aplicativo'],
];
const ORIGENS = ['familia_apertada', 'familia_remediada', 'familia_confortavel'];

function assinaturaDe(c: Conteudo, e: EstadoVida): { assinatura: string; destino: string; origem: number } {
  const marcas = e.marcas;
  const origem = ORIGENS.findIndex((m) => m in marcas);
  const carreira = CARREIRAS.find(([m]) => m in marcas)?.[1] ?? 'bicos';
  const civil = 'casado' in marcas ? 'casado' : 'separado' in marcas ? 'separado' : 'namoro' in marcas ? 'namorando' : 'solteiro';
  // Marca principal: a que mais causou eventos depois (citações da entrada que a gravou).
  const citacoes = new Map<number, number>();
  for (const h of e.historico) for (const id of h.causas ?? []) citacoes.set(id, (citacoes.get(id) ?? 0) + 1);
  const principal =
    Object.entries(marcas)
      .filter(([, r]) => r.origem !== null)
      .map(([m, r]) => [m, citacoes.get(r.origem!) ?? 0] as const)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? '-';
  const morte = e.morte?.fonte !== undefined ? c.mortes[e.morte.fonte]!.categoria : 'evento';
  const destino = [classeDe(patrimonioDe(e)), carreira, civil, principal, morte].join('|');
  return { assinatura: `${ORIGENS[origem] ?? '?'}|${destino}`, destino, origem };
}

function positivas(cond: Condicoes | undefined): string[] {
  return [...(cond?.marcas ?? []), ...(cond?.algumaMarca ?? []), ...(cond?.marcaHa ?? []).map((x) => x.marca)];
}

function medir(c: Conteudo, e: Jogada, estrategia: Estrategia): Vida {
  const eventos = e.historico.filter((h) => h.tipo === 'evento' && h.eventoId).map((h) => h.eventoId!);
  const contagem = new Map<string, number>();
  for (const id of eventos) contagem.set(id, (contagem.get(id) ?? 0) + 1);
  const duplicadosProibidos = [...contagem].filter(([id, n]) => n > 1 && !c.porId.get(id)?.repetivel).map(([id]) => id);
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  let maiorDistancia = 0;
  for (const h of e.historico) {
    for (const causa of h.causas ?? []) {
      const origem = porId.get(causa);
      if (origem) maiorDistancia = Math.max(maiorDistancia, h.idade - origem.idade);
    }
  }
  const marcasAtivas = new Set<string>();
  const ativar = (ms: string[]): void => {
    for (const m of ms) if (e.marcasVistas.has(m)) marcasAtivas.add(m);
  };
  for (const id of new Set(eventos)) {
    const ev = c.porId.get(id);
    ativar(positivas(ev?.condicoes));
    for (const esc of ev?.escolhas ?? []) ativar([...positivas(esc.condicoes), ...(esc.condicoes?.semMarcas ?? [])]);
  }
  for (const i of e.linhasUsadas) ativar(positivas(c.linhas[i]?.condicoes));
  if (e.morte?.fonte !== undefined) ativar(positivas(c.mortes[e.morte.fonte]?.condicoes));
  for (const m of Object.keys(e.marcas)) if (c.marcas[m]?.porAno || c.marcas[m]?.epitafio) marcasAtivas.add(m);
  const f = e.financas;
  const { assinatura, destino, origem } = assinaturaDe(c, e);
  return {
    instancias: eventos,
    assinatura,
    destino,
    origem,
    desempate: aleatorio(criarRng(misturar(e.semente, 991))),
    mudancasJogador: e.mudancasJogador,
    mudancasTotal: e.mudancasTotal,
    toques: e.toques,
    ms: e.ms,
    estrategia,
    idade: e.idade,
    patrimonio: f.dinheiro + f.investido - f.divida,
    felicidade: e.somaFelicidade / Math.max(1, e.idade),
    eventos,
    textos: e.historico.filter((h) => h.tipo === 'evento' || h.tipo === 'linha').map((h) => h.texto),
    comCausa: e.historico.filter((h) => (h.causas?.length ?? 0) > 0).length,
    pontos: pontosDeVirada(e).length,
    maiorDistancia,
    marcasVistas: e.marcasVistas,
    marcasAtivas,
    causaMorte: e.morte?.causa ?? '?',
    duplicadosProibidos,
  };
}

// ---------------------------------------------------------------- estatística

function percentil(ordenados: number[], p: number): number {
  if (ordenados.length === 0) return 0;
  const i = Math.min(ordenados.length - 1, Math.max(0, Math.round((p / 100) * (ordenados.length - 1))));
  return ordenados[i]!;
}
const media = (xs: number[]): number => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const ordenar = (xs: number[]): number[] => [...xs].sort((a, b) => a - b);
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

const inicio = performance.now();
const c = carregarConteudo();
const vidas: Vida[] = [];
interface Repeticao {
  /** [k] = frações da vida k (0-based) já vistas em qualquer vida anterior. */
  qualquer: number[][];
  /** [k] = frações da vida k já vistas na vida imediatamente anterior. */
  anterior: number[][];
  /** [k] = fração dos textos da vida k idênticos a algum texto de vida anterior. */
  textos: number[][];
}
const novaRepeticao = (): Repeticao => ({
  qualquer: Array.from({ length: VIDAS_POR_JOGADOR }, () => []),
  anterior: Array.from({ length: VIDAS_POR_JOGADOR }, () => []),
  textos: Array.from({ length: VIDAS_POR_JOGADOR }, () => []),
});
const repeticao = new Map<Estrategia, Repeticao>();
const repeticaoSemMemoria = novaRepeticao();
/** Instâncias de cada vida, por jogador (para a saturação). */
const sequencias: string[][][] = [];

function rodarJogador(estrategia: Estrategia, idEstrategia: number, jogador: number, usarMemoria: boolean, destino: Repeticao, guardar: boolean): void {
  let memoria = novaMemoria();
  const vistos = new Set<string>();
  const textosVistos = new Set<string>();
  let ultimaVida = new Set<string>();
  const sequencia: string[][] = [];
  if (guardar) sequencias.push(sequencia);
  for (let k = 0; k < VIDAS_POR_JOGADOR; k++) {
    const semente = misturar(SEMENTE, idEstrategia, jogador, k);
    const e = jogar(c, estrategia, semente, usarMemoria ? memoria : undefined);
    const vida = medir(c, e, estrategia);
    if (guardar) vidas.push(vida);
    sequencia.push(vida.instancias);
    const unicos = new Set(vida.eventos);
    if (k > 0 && unicos.size > 0) {
      let qualquer = 0;
      let anterior = 0;
      for (const id of unicos) {
        if (vistos.has(id)) qualquer++;
        if (ultimaVida.has(id)) anterior++;
      }
      destino.qualquer[k]!.push(qualquer / unicos.size);
      destino.anterior[k]!.push(anterior / unicos.size);
      if (vida.textos.length > 0) destino.textos[k]!.push(vida.textos.filter((t) => textosVistos.has(t)).length / vida.textos.length);
    }
    for (const id of unicos) vistos.add(id);
    for (const t of vida.textos) textosVistos.add(t);
    ultimaVida = unicos;
    memoria = lembrarVida(memoria, e);
  }
}

ESTRATEGIAS.forEach((estrategia, s) => {
  const destino = novaRepeticao();
  repeticao.set(estrategia, destino);
  for (let j = 0; j < JOGADORES; j++) rodarJogador(estrategia, s, j, true, destino, true);
});
// Linha de base: as mesmas vidas (mesmas sementes) da estratégia aleatória, sem memória entre vidas.
const idAleatoria = ESTRATEGIAS.indexOf('aleatoria');
for (let j = 0; j < JOGADORES_BASE; j++) rodarJogador('aleatoria', idAleatoria, j, false, repeticaoSemMemoria, false);
const segundos = (performance.now() - inicio) / 1000;

// ---------------------------------------------------------------- análise

const ocorrencias = new Map<string, number>();
const vidasCom = new Map<string, number>();
for (const ev of c.eventos) {
  ocorrencias.set(ev.id, 0);
  vidasCom.set(ev.id, 0);
}
for (const v of vidas) {
  for (const id of v.eventos) ocorrencias.set(id, (ocorrencias.get(id) ?? 0) + 1);
  for (const id of new Set(v.eventos)) vidasCom.set(id, (vidasCom.get(id) ?? 0) + 1);
}
const mortos = c.eventos.filter((ev) => (ocorrencias.get(ev.id) ?? 0) === 0).map((ev) => ev.id);
const raros = c.eventos
  .filter((ev) => {
    const n = vidasCom.get(ev.id) ?? 0;
    return n > 0 && n / vidas.length < 0.005;
  })
  .map((ev) => ev.id);
const duplicados = vidas.flatMap((v) => v.duplicadosProibidos);

// Repetição dentro da vida: fração de aparições que repetem um evento já visto na mesma vida.
const repeticaoInterna = vidas.map((v) => (v.eventos.length ? 1 - new Set(v.eventos).size / v.eventos.length : 0));

// Marcas: criadas na simulação × marcas que de fato mudaram algo em alguma vida.
const criadasNaSimulacao = new Set<string>();
const ativas = new Set<string>();
for (const v of vidas) {
  for (const m of v.marcasVistas) criadasNaSimulacao.add(m);
  for (const m of v.marcasAtivas) ativas.add(m);
}
const inertes = [...criadasNaSimulacao].filter((m) => !ativas.has(m)).sort();
const repetidosNaVida = new Map<string, number>();
for (const v of vidas) {
  const vistosNaVida = new Set<string>();
  for (const id of v.eventos) {
    if (vistosNaVida.has(id)) repetidosNaVida.set(id, (repetidosNaVida.get(id) ?? 0) + 1);
    vistosNaVida.add(id);
  }
}
const totalAparicoes = vidas.reduce((s, v) => s + v.eventos.length, 0);

// Dilemas: avaliados num estado típico da idade de cada evento.
const base = nascer(c, { semente: 1, ano: ANO });
const dilemasFalsos = falsosDilemas(c, estadoTipico(base, 30));
const semTensao = arriscarNaoCompensa(c, base);
const comRisco = c.eventos.filter((ev) => (ev.escolhas?.length ?? 0) > 1).length;

interface ResumoEstrategia {
  estrategia: Estrategia;
  idade: number;
  patrimonio: number;
  felicidade: number;
  eventos: number;
  comCausa: number;
  tresPontos: number;
  repeticao: number;
}
const porEstrategia: ResumoEstrategia[] = ESTRATEGIAS.map((estrategia) => {
  const vs = vidas.filter((v) => v.estrategia === estrategia);
  const rep = (repeticao.get(estrategia)?.qualquer ?? []).slice(1).flat();
  return {
    estrategia,
    idade: media(vs.map((v) => v.idade)),
    patrimonio: percentil(ordenar(vs.map((v) => v.patrimonio)), 50),
    felicidade: media(vs.map((v) => v.felicidade)),
    eventos: media(vs.map((v) => v.eventos.length)),
    comCausa: media(vs.map((v) => v.comCausa)),
    tresPontos: vs.filter((v) => v.pontos >= 3).length / Math.max(1, vs.length),
    repeticao: media(rep),
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

const repPorVida = Array.from({ length: VIDAS_POR_JOGADOR }, (_, k) =>
  media(ESTRATEGIAS.flatMap((s) => repeticao.get(s)?.qualquer[k] ?? [])),
);
const repMedia = media(repPorVida.slice(1));
const repAnterior = media(ESTRATEGIAS.flatMap((s) => (repeticao.get(s)?.anterior ?? []).slice(1).flat()));
const repTextos = media(ESTRATEGIAS.flatMap((s) => (repeticao.get(s)?.textos ?? []).slice(1).flat()));
const repAleatoria = repeticao.get('aleatoria')!;
const comMemoria = { qualquer: media(repAleatoria.qualquer.slice(1).flat()), anterior: media(repAleatoria.anterior.slice(1).flat()) };
const semMemoria = {
  qualquer: media(repeticaoSemMemoria.qualquer.slice(1).flat()),
  anterior: media(repeticaoSemMemoria.anterior.slice(1).flat()),
};

// ---------------------------------------------------------------- métricas do life simulator

const sat = saturacao(sequencias);
const satV = (k: number): number => sat[k - 1] ?? 0;
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
const msPorVida = media(vidas.map((v) => v.ms));

// ---------------------------------------------------------------- relatório

const idades = ordenar(vidas.map((v) => v.idade));
const patrimonios = ordenar(vidas.map((v) => v.patrimonio));
const felicidades = ordenar(vidas.map((v) => v.felicidade));
const cadeias = listarCadeias(c).filter((x) => x.anosMin >= 3);
const escolhas = c.eventos.reduce((s, ev) => s + (ev.escolhas?.length ?? 0), 0);

const metas = [
  ['Zero eventos mortos', mortos.length === 0, `${mortos.length} mortos`],
  ['Nenhum evento não-repetível repetido na mesma vida', duplicados.length === 0, `${duplicados.length} repetições`],
  ['Nenhuma estratégia fixa domina', dominantes.length === 0, dominantes.length ? `domina: ${dominantes.join(', ')}` : 'nenhuma domina'],
] as const;

const linhas: string[] = [];
const l = (s = ''): void => void linhas.push(s);
l('# Métricas do túnel de vento');
l();
l('Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.');
l();
l(
  `**${vidas.length.toLocaleString('pt-BR')} vidas** (${ESTRATEGIAS.length} estratégias × ${JOGADORES} jogadores × ${VIDAS_POR_JOGADOR} vidas seguidas, com memória entre vidas) · semente ${SEMENTE} · ` +
    `conteúdo: ${c.eventos.length} eventos, ${escolhas} escolhas, ${c.linhas.length} linhas, ${new Set(cadeias.map((x) => `${x.de}→${x.para}`)).size} cadeias de 3+ anos.`,
);
l();
l('## Metas da fase 1');
l();
l('| Meta | Situação | Detalhe |');
l('|---|---|---|');
for (const [nome, ok, detalhe] of metas) l(`| ${nome} | ${ok ? '✅' : '❌'} | ${detalhe} |`);
l();
l('## Repetição');
l();
l(`- **Dentro de uma vida:** ${pct(media(repeticaoInterna))} das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: ${pct(Math.max(...repeticaoInterna))}.`);
l(`- **Entre vidas (2ª à 10ª):** em média ${pct(repMedia)} dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; ${pct(repAnterior)} já tinham aparecido na vida imediatamente anterior.`);
l(`- **Texto repetido entre vidas:** ${pct(repTextos)} dos textos de uma vida (eventos e linhas, já renderizados) são idênticos a algum texto de uma vida anterior. As alternâncias \`[a|b]\` existem para baixar este número.`);
l(
  `- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, ${JOGADORES_BASE * VIDAS_POR_JOGADOR} vidas): ` +
    `vista na vida anterior ${pct(semMemoria.anterior)} sem memória → ${pct(comMemoria.anterior)} com memória; ` +
    `vista em qualquer vida anterior ${pct(semMemoria.qualquer)} → ${pct(comMemoria.qualquer)}.`,
);
l();
const colunas = [2, 3, 4, 5, 10, 15, 20].filter((k) => k <= VIDAS_POR_JOGADOR);
l('| Vida | ' + colunas.map((k) => `${k}ª`).join(' | ') + ' |');
l('|---|' + colunas.map(() => '---').join('|') + '|');
l('| Já visto antes | ' + colunas.map((k) => pct(repPorVida[k - 1] ?? 0, 0)).join(' | ') + ' |');
l();
const maisRepetidos = [...repetidosNaVida].sort((a, b) => b[1] - a[1]).slice(0, 6);
l(`Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): ${maisRepetidos.map(([id, n]) => `\`${id}\` ${num((n / totalAparicoes) * 100)}`).join(' · ')}`);
l();
l('## Life simulator (critérios de aceitação)');
l();
l('| Métrica | Valor |');
l('|---|---|');
l(`| Saturação V5 (instâncias da 5ª vida já vistas antes) | ${pct(satV(5))} |`);
l(`| Saturação V20 | ${pct(satV(20))} |`);
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
l();
l('Matriz de mobilidade (linhas: quintil de riqueza da origem; colunas: quintil do patrimônio ao morrer):');
l();
l('| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |');
l('|---|---|---|---|---|---|');
mob.matriz.forEach((linha, i) => l(`| Q${i + 1} | ${linha.map((x) => pct(x, 0)).join(' | ')} |`));
l();
l('## Dilemas');
l();
l(`- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): ${dilemasFalsos.length ? dilemasFalsos.map((d) => `\`${d.evento}\``).join(', ') : 'nenhum'}`);
l(
  `- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): ${semTensao.length} de ${comRisco} eventos — ${semTensao.map((id) => `\`${id}\``).join(', ')}. Algumas são armadilhas de propósito.`,
);
l();
l('## Eventos');
l();
l(`- **Mortos (nunca aparecem):** ${mortos.length ? mortos.map((m) => `\`${m}\``).join(', ') : 'nenhum'}`);
l(`- **Raros (em menos de 0,5% das vidas):** ${raros.length ? raros.map((m) => `\`${m}\``).join(', ') : 'nenhum'}`);
l(`- **Eventos por vida:** ${num(media(vidas.map((v) => v.eventos.length)))} · **com causa anterior (cadeia):** ${num(media(vidas.map((v) => v.comCausa)))} · **maior distância causa→consequência:** ${num(media(vidas.map((v) => v.maiorDistancia)))} anos em média`);
l(`- **Vidas com 3 pontos de virada no cartão:** ${pct(vidas.filter((v) => v.pontos >= 3).length / vidas.length)}`);
l();
const freq = [...vidasCom].map(([id, n]) => [id, n / vidas.length] as const).sort((a, b) => b[1] - a[1]);
l('<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>');
l();
l('| Evento | Vidas |');
l('|---|---|');
for (const [id, f] of freq) l(`| \`${id}\` | ${pct(f)} |`);
l();
l('</details>');
l();
l('## Marcas');
l();
l(`- **Criadas na simulação:** ${criadasNaSimulacao.size} · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): ${ativas.size}`);
l(`- **Marcas que nunca dispararam nada:** ${inertes.length ? inertes.map((m) => `\`${m}\``).join(', ') : 'nenhuma'}`);
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
l(`**Patrimônio ao morrer** (reais de hoje) — p10 ${formatarDinheiro(percentil(patrimonios, 10))} · p25 ${formatarDinheiro(percentil(patrimonios, 25))} · mediana ${formatarDinheiro(percentil(patrimonios, 50))} · p75 ${formatarDinheiro(percentil(patrimonios, 75))} · p90 ${formatarDinheiro(percentil(patrimonios, 90))}`);
l();
l('```');
l(
  histograma(patrimonios, [
    { rotulo: 'negativo', ate: 0 },
    { rotulo: 'até 10 mil', ate: 10000 },
    { rotulo: '10–50 mil', ate: 50000 },
    { rotulo: '50–200 mil', ate: 200000 },
    { rotulo: '200 mil–1 mi', ate: 1000000 },
    { rotulo: '1 mi+', ate: Infinity },
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
l('| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |');
l('|---|---|---|---|---|---|---|---|');
for (const r of porEstrategia) {
  const marca = (k: (typeof CRITERIOS)[number][0]): string =>
    porEstrategia.every((o) => o === r || r[k] > o[k]) ? ' 🏆' : '';
  l(
    `| ${r.estrategia} | ${num(r.idade)}${marca('idade')} | ${formatarDinheiro(r.patrimonio)}${marca('patrimonio')} | ${num(r.felicidade)}${marca('felicidade')} | ${num(r.eventos)} | ${num(r.comCausa)} | ${pct(r.tresPontos, 0)} | ${pct(r.repeticao, 0)} |`,
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
l('- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e de personagens; ações do jogador e linhas curtas não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + quem ele envolve + variante escolhida pelo estado; alternâncias de texto não contam.');
l('- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.');
l('- **Mobilidade:** quintis da riqueza de origem × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).');
l('- **Mudança de estado:** atributo que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, marca ganha ou perdida, personagem novo. É do jogador quando acontece numa escolha ou ação dele.');
l('- **Toques:** nascer + um por ano vivido + um por escolha.');
l();

const relatorio = linhas.join('\n');
if (!args.has('sem-arquivo')) writeFileSync(join(RAIZ, 'docs', 'metricas.md'), relatorio);

console.log(`Túnel: ${vidas.length.toLocaleString('pt-BR')} vidas em ${segundos.toFixed(1)} s`);
for (const [nome, ok, detalhe] of metas) console.log(`${ok ? '✓' : '✗'} ${nome} (${detalhe})`);
console.log(
  `Repetição entre vidas: ${pct(repMedia)} (vida anterior: ${pct(repAnterior)}; texto idêntico: ${pct(repTextos)}) · aleatória vida anterior sem/com memória: ${pct(semMemoria.anterior)} → ${pct(comMemoria.anterior)} · dentro da vida: ${pct(media(repeticaoInterna))}`,
);
console.log(
  `Saturação V5 ${pct(satV(5))} · V20 ${pct(satV(20))} · assinaturas/1000 ${num(assinaturas, 0)} (destino ${num(destinos, 0)}) · mobilidade diag ${pct(mob.diagonal)} ρ ${num(mob.spearman, 2)} · ` +
    `p90/p10 ${Number.isFinite(razao9010) ? num(razao9010, 1) : 'p10≤0'} · desvio felicidade ${num(desvioFelicidade, 2)} · negativas ${pct(negativas)} · ` +
    `jogador ${pct(parteJogador)} · toques ${num(toques, 1)} · ${num(msPorVida, 2)} ms/vida`,
);
console.log(`Falsos dilemas: ${dilemasFalsos.length} · arriscar nunca compensa: ${semTensao.length} (${semTensao.join(', ')})`);
console.log(`Mais repetidos na mesma vida (por 100 aparições): ${maisRepetidos.map(([id, n]) => `${id} ${num((n / totalAparicoes) * 100)}`).join(' · ')}`);
console.log(`Idade média ${num(media(idades))} · patrimônio mediano ${formatarDinheiro(percentil(patrimonios, 50))} · felicidade média ${num(media(felicidades))}`);
for (const r of porEstrategia) {
  console.log(`  ${r.estrategia.padEnd(10)} idade ${num(r.idade)} · patrimônio ${formatarDinheiro(r.patrimonio)} · felicidade ${num(r.felicidade)} · eventos ${num(r.eventos)} · com causa ${num(r.comCausa)}`);
}
if (raros.length) console.log(`Raros: ${raros.join(', ')}`);
if (inertes.length) console.log(`Marcas inertes: ${inertes.join(', ')}`);
process.exit(metas.every(([, ok]) => ok) ? 0 : 1);
