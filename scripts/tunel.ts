/**
 * npm run tunel — túnel de vento. Robôs jogam 10.000 vidas (4 estratégias ×
 * 125 jogadores × 20 vidas seguidas, com a memória entre vidas que o jogo usa)
 * e o relatório vai para docs/metricas.md.
 *
 * Opções: --vidas=N (total aproximado), --sem-arquivo, --semente=N.
 * Sai com código 1 se uma meta quebrar: storylet morto, storylet
 * não-repetível repetido na mesma vida ou estratégia fixa dominante.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { carregarConteudo, RAIZ } from './disco.ts';
import { classeDoPatrimonio, nomeDaClasse, patrimonioTotal } from '../src/motor/campos.ts';
import { tipoDe, type Conteudo } from '../src/motor/conteudo.ts';
import { CHAVES_CONDICAO, type Condicoes } from '../src/motor/esquema.ts';
import { anoDoPais, ESTATISTICAS, faseDe, governoAtual, type Estatistica } from '../src/motor/pais.ts';
import { ATIVOS, CLASSES, FASES, type Fase } from '../src/motor/constantes.ts';
import { mercadoDoAno, motivoParaNaoOperar, operar, perfilDe } from '../src/motor/carteira.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import type { EscolhaOrigem } from '../src/motor/origem.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { lembrarVida, novaMemoria } from '../src/motor/memoria.ts';
import { ESTRATEGIAS, arriscarNaoCompensa, decidir, decidirAcao, decidirDinheiro, estadoTipico, falsosDilemas, type Estrategia } from '../src/motor/robos.ts';
import { aleatorio, criarRng, misturar, type Rng } from '../src/motor/rng.ts';
import type { Entrada, EstadoVida, MemoriaJogador } from '../src/motor/tipos.ts';
import { listarCadeias } from '../src/motor/validacao.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { pontosDeVirada, porqueDe } from '../src/motor/virada.ts';
import { empresaDe } from '../src/motor/empresa.ts';
import { formatarDinheiro } from '../src/motor/texto.ts';
import { assinaturasPorBloco, desvio, media, mobilidade, ordenar, percentil, saturacao } from './medidas.ts';

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

// ---------------------------------------------------------------- uma vida

interface Jogada {
  e: EstadoVida;
  toques: number;
  ms: number;
  riquezaOrigem: number;
  /** Anos vividos em cada fase do ciclo. */
  anosPorFase: Record<Fase, number>;
  /** Operações na carteira (aplicar, resgatar, trocar o perfil). */
  operacoes: number;
  /** O país ano a ano (só o que os portões do incremento 8 contam). */
  pais: PaisDaVida;
}

/** O país visto por uma vida: as estatísticas por governo, o trabalho pelo desemprego e o governo de quem joga. */
interface PaisDaVida {
  /** Por governo (bloco, 'regime' ou 'voce'): anos e a soma de cada estatística, para a média. */
  porGoverno: Record<string, { anos: number; soma: Record<Estatistica, number> }>;
  /** Anos de trabalho com carteira (18 a 64, com renda, sem estabilidade), pelo desemprego do país no ano. */
  anosDeTrabalho: { ano: number; desemprego: number }[];
  /** Quem joga governou: a dívida ao assumir e ao sair, e os anos. */
  governo: { anos: number; dividaInicio: number; dividaFim: number; aprovacao: number } | null;
}

const ESTAVEIS = ['servidor', 'empreendedor', 'socio', 'herdeiro_negocio', 'aposentado'];

/** Anota o ano do país na vida (depois do +1 ano). */
function anotarPais(e: EstadoVida, p: PaisDaVida): void {
  const pais = e.entidades['pais']!;
  const gov = governoAtual(e);
  const g = (p.porGoverno[gov] ??= { anos: 0, soma: Object.fromEntries(ESTATISTICAS.map((k) => [k, 0])) as Record<Estatistica, number> });
  g.anos++;
  for (const k of ESTATISTICAS) g.soma[k] += pais.n[k] ?? 0;
  const eu = e.entidades['eu']!;
  if (e.idade >= 18 && e.idade <= 64 && (eu.n['renda'] ?? 0) > 0 && !ESTAVEIS.some((m) => eu.q[m])) p.anosDeTrabalho.push({ ano: e.ano, desemprego: pais.n['desemprego'] ?? 8.5 });
  if (gov === 'voce') {
    p.governo ??= { anos: 0, dividaInicio: pais.n['divida'] ?? 0, dividaFim: 0, aprovacao: 0 };
    p.governo.anos++;
    p.governo.dividaFim = pais.n['divida'] ?? 0;
    p.governo.aprovacao += pais.n['aprovacao'] ?? 0;
  }
}

/** Joga uma vida já começada até o fim, como a interface: dinheiro (sem gastar a ficha), a ficha do ano e as escolhas. */
function viver(c: Conteudo, e: EstadoVida, estrategia: Estrategia, robo: Rng, memoria: MemoriaJogador | undefined): Omit<Jogada, 'e' | 'ms' | 'riquezaOrigem'> {
  let toques = 0;
  let operacoes = 0;
  const anosPorFase: Record<Fase, number> = { normal: 0, expansao: 0, recessao: 0, crise: 0 };
  const pais: PaisDaVida = { porGoverno: {}, anosDeTrabalho: [], governo: null };
  while (e.vivo) {
    if (e.pendente) {
      escolher(e, c, decidir(estrategia, e, c, robo));
      toques++;
      continue;
    }
    // Mexer no dinheiro, comprar, tentar vaga, se candidatar: abrir a folha, escolher e confirmar (três toques por operação).
    for (const op of decidirDinheiro(estrategia, e, c, robo)) {
      if (motivoParaNaoOperar(e, c, op) !== null) continue;
      operar(e, c, op);
      operacoes++;
      toques += 3;
    }
    // Cada ação são dois toques (o verbo e a ação na lista); se sobra ficha, o +1 ano é mais um.
    for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) {
      agir(e, c, a.verbo, a.escolha);
      toques += 2;
    }
    if (e.vivo && !e.pendente) {
      if (!jaAgiu(e)) toques++;
      avancarAno(e, c, memoria);
      anosPorFase[faseDe(e)]++;
      anotarPais(e, pais);
    }
  }
  return { toques, anosPorFase, operacoes, pais };
}

function jogar(c: Conteudo, estrategia: Estrategia, semente: number, memoria: MemoriaJogador | undefined, origem?: EscolhaOrigem): Jogada {
  const t0 = performance.now();
  const e = nascer(c, { semente, ano: ANO, ...(origem ? { origem } : {}) });
  const riquezaOrigem = (e.entidades['mae']?.n['dinheiro'] ?? 0) + (e.entidades['pai']?.n['dinheiro'] ?? 0);
  const r = viver(c, e, estrategia, criarRng(misturar(semente, 77)), memoria);
  return { e, toques: r.toques + 1, ms: performance.now() - t0, riquezaOrigem, anosPorFase: r.anosPorFase, operacoes: r.operacoes, pais: r.pais };
}

// ---------------------------------------------------------------- medidas de uma vida

/** Storylets que o mundo apresentou (diretor e personagens). Ações do jogador e narrativas de regra não contam. */
function apresentados(e: EstadoVida): Entrada[] {
  return e.historico.filter((h) => (h.tipo === 'evento' || h.tipo === 'npc') && h.instancia && !h.ref?.startsWith('regra:'));
}

const CARREIRAS: [string, string][] = [
  ['vereador', 'política'],
  ['servidor', 'serviço público'],
  ['empreendedor', 'negócio próprio'],
  ['socio', 'negócio próprio'],
  ['herdeiro_negocio', 'negócio da família'],
  ['influencer', 'internet'],
  ['criador_conteudo', 'internet'],
  ['musico', 'música'],
  ['pesquisador', 'pesquisa'],
  ['profissional', 'carreira formal'],
  ['clt', 'carteira assinada'],
  ['entregador', 'aplicativo'],
];

/** Storylets em que a empresa fecha por quebra (e não por venda). */
const QUEBRAS = new Set(['empresa_quebrou', 'negocio_no_aperto', 'socio_sumiu', 'negocio_da_familia_quebra']);

/** Mudanças de estado de quem joga numa entrada (mesma régua da linha de base). */
function contarMudancas(h: Entrada): number {
  let n = 0;
  let patrimonio = 0;
  for (const m of h.mudancas ?? []) {
    if (!m.c.startsWith('eu.')) continue;
    if (m.q !== undefined) {
      n++;
      continue;
    }
    if (m.d === undefined) continue;
    if (m.c === 'eu.dinheiro' || ATIVOS.some((a) => m.c === `eu.${a}`)) patrimonio += m.d;
    else if (m.c === 'eu.divida') patrimonio -= m.d;
    else if (m.c === 'eu.renda') n += Math.abs(m.d) >= 600 ? 1 : 0;
    else if (Math.abs(m.d) >= 0.5) n++;
  }
  if (Math.abs(patrimonio) >= 500) n++;
  return n;
}

interface Vida {
  estrategia: Estrategia;
  idade: number;
  patrimonio: number;
  felicidade: number;
  eventos: string[];
  instancias: string[];
  comRegras: string[];
  acoes: string[];
  textos: string[];
  comCausa: number;
  pontos: number;
  pontosDoMundo: number;
  maiorDistancia: number;
  qualidadesVistas: Set<string>;
  qualidadesAtivas: Set<string>;
  causaMorte: string;
  duplicadosProibidos: string[];
  assinatura: string;
  destino: string;
  origem: number;
  desempate: number;
  mudancasJogador: number;
  mudancasTotal: number;
  toques: number;
  ms: number;
  classeOrigem: number;
  mortesNaFamilia: number;
  anosPorFase: Record<Fase, number>;
  noticias: number;
  demissoes: number;
  demissoesPelaFase: number;
  /** Setor do último trabalho e o jeito de trabalhar (servidor, dono, empregado). */
  carreiraSetor: string;
  perfil: string;
  operacoes: number;
  /** Ao morrer, havia filho ou filha para continuar a história. */
  herdeiro: boolean;
  /** Anos adultos (18+) sem nenhum evento ou iniciativa de personagem: só a linha curta. */
  anosVazios: number;
  /** A empresa na vida: abriu alguma (por qualquer caminho), alguma quebrou, vendeu alguma. */
  fundou: boolean;
  quebrou: boolean;
  vendeu: boolean;
  /** Jogadas feitas (brincar de deus) e quantas delas causaram algum acontecimento depois. */
  jogadas: string[];
  jogadasComReacao: number;
  /** Acontecimentos (eventos, iniciativas dos outros, a morte) e quantos mostram o porquê na linha do tempo. */
  acontecimentos: number;
  comPorque: number;
  /** A empresa viva na morte de quem joga: o quanto dependia dele (0 a 100) e quanto do valor perdeu com a morte. */
  empresaNaMorte: { dependencia: number; perda: number; valor: number } | null;
  /** Alguma escolha (evento ou jogada) mudou o quanto a empresa depende de quem manda. */
  decidiuQuemManda: boolean;
  /** Quanto durou cada crise do país que começou durante a vida (anos até a próxima mudança de fase). */
  crises: number[];
  /** O país vivo: estatísticas por governo, anos de trabalho (com e sem demissão) pelo desemprego, votos, posses e o governo de quem joga. */
  porGoverno: PaisDaVida['porGoverno'];
  trabalho: { alto: number; demitidoAlto: number; baixo: number; demitidoBaixo: number };
  votos: number;
  votosQueElegeram: number;
  viradas: number;
  trocasDeGoverno: number;
  governo: (NonNullable<PaisDaVida['governo']> & { reformas: number; caiu: boolean }) | null;
  /** A primeira infância: a sequência de histórias até os 6 anos (com a escolha), as decisões antes dos 5 e se algo dos 5 aos 12 teve causa nos anos até os 4. */
  comeco: string;
  decisoesAntesDos5: number;
  infanciaVoltou: boolean;
}

/** As jogadas da vida (ids dos storylets) e quantas foram causa de um evento ou iniciativa depois. */
function jogadasDaVida(e: EstadoVida): { jogadas: string[]; comReacao: number } {
  const feitas = e.historico.filter((h) => h.ref?.startsWith('jogada:'));
  const citadas = new Set<number>();
  for (const h of e.historico) if (h.tipo === 'evento' || h.tipo === 'npc') for (const id of h.causas ?? []) citadas.add(id);
  return { jogadas: feitas.map((h) => h.ref!.slice('jogada:'.length)), comReacao: feitas.filter((h) => citadas.has(h.id)).length };
}

/** Qualidades de quem joga que uma condição exige ter (marca, contador com mínimo, ou verdadeiro). */
function positivas(cond: Condicoes | undefined): string[] {
  if (!cond) return [];
  const saida = [...(cond.marcas ?? []), ...(cond.algumaMarca ?? []), ...(cond.marcaHa ?? []).map((x) => x.marca)];
  for (const [chave, v] of Object.entries(cond)) {
    if (CHAVES_CONDICAO.has(chave) || chave.includes('.')) continue;
    if (v === true || (typeof v === 'object' && !Array.isArray(v) && 'min' in v && (v.min ?? 0) > 0)) saida.push(chave);
  }
  return saida;
}

function medir(c: Conteudo, j: Jogada, estrategia: Estrategia): Vida {
  const e = j.e;
  const eu = e.entidades['eu']!;
  const visiveis = apresentados(e);
  const eventos = visiveis.map((h) => h.ref!);
  const instancias = visiveis.map((h) => h.instancia!);
  const comRegras = e.historico.filter((h) => (h.tipo === 'evento' || h.tipo === 'npc') && h.instancia).map((h) => h.instancia!);
  const acoes = e.historico.filter((h) => h.tipo === 'acao').map((h) => h.ref!);
  const contagem = new Map<string, number>();
  for (const i of instancias) contagem.set(i, (contagem.get(i) ?? 0) + 1);
  const duplicadosProibidos = [...contagem].filter(([i, n]) => n > 1 && !c.porId.get(i.split('#')[0]!)?.repetivel).map(([i]) => i);
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  let maiorDistancia = 0;
  for (const h of e.historico) {
    for (const causa of h.causas ?? []) {
      const origem = porId.get(causa);
      if (origem) maiorDistancia = Math.max(maiorDistancia, h.idade - origem.idade);
    }
  }
  // Qualidades de quem joga: ganhas na vida × as que de fato mudaram algo.
  const qualidadesVistas = new Set<string>();
  for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.q === 1 && m.c.startsWith('eu.')) qualidadesVistas.add(m.c.slice(3));
  const qualidadesAtivas = new Set<string>();
  const ativar = (ms: string[]): void => {
    for (const m of ms) if (qualidadesVistas.has(m)) qualidadesAtivas.add(m);
  };
  for (const id of new Set([...eventos, ...acoes])) {
    const s = c.porId.get(id);
    ativar(positivas(s?.condicoes));
    for (const esc of s?.escolhas ?? []) ativar([...positivas(esc.condicoes), ...(esc.condicoes?.semMarcas ?? [])]);
  }
  for (const h of e.historico) if (h.tipo === 'linha' && h.ref?.startsWith('linha:')) ativar(positivas(c.linhas[Number(h.ref.slice(6))]?.condicoes));
  if (e.morte?.fonte !== undefined) ativar(positivas(c.mortes[e.morte.fonte]?.condicoes));
  for (const m of Object.keys(eu.q)) if (c.marcas[m]?.porAno || c.marcas[m]?.epitafio) qualidadesAtivas.add(m);

  // Assinatura: origem, classe final, carreira, estado civil, marca principal, categoria da morte.
  const q = eu.q;
  const carreira = CARREIRAS.find(([m]) => m in q)?.[1] ?? 'bicos';
  const civil = 'casado' in q ? 'casado' : 'separado' in q ? 'separado' : 'namoro' in q ? 'namorando' : 'solteiro';
  const citacoes = new Map<number, number>();
  for (const h of e.historico) for (const id of h.causas ?? []) citacoes.set(id, (citacoes.get(id) ?? 0) + 1);
  const principal =
    Object.entries(q)
      .filter(([, r]) => r.causa !== null)
      .map(([m, r]) => [m, citacoes.get(r.causa!) ?? 0] as const)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? '-';
  const patrimonio = patrimonioTotal(e);
  const destino = [nomeDaClasse(classeDoPatrimonio(patrimonio)), carreira, civil, principal, e.morte?.categoria ?? '?'].join('|');
  const classeOrigem = eu.n['classe_origem'] ?? 0;

  let mudancasJogador = 0;
  let mudancasTotal = 0;
  for (const h of e.historico) {
    const n = contarMudancas(h);
    mudancasTotal += n;
    if (h.causa === 'escolha' || h.causa === 'acao') mudancasJogador += n;
  }
  const pontos = pontosDeVirada(e);
  const demissoes = e.historico.filter((h) => h.ref === 'demissao');
  const daFortuna = jogadasDaVida(e);
  return {
    jogadas: daFortuna.jogadas,
    jogadasComReacao: daFortuna.comReacao,
    estrategia,
    idade: e.idade,
    patrimonio,
    felicidade: e.somaFelicidade / Math.max(1, e.idade),
    eventos,
    instancias,
    comRegras,
    acoes,
    textos: e.historico.filter((h) => h.tipo === 'evento' || h.tipo === 'linha' || h.tipo === 'npc').map((h) => h.texto),
    comCausa: e.historico.filter((h) => h.tipo !== 'regra' && (h.causas?.length ?? 0) > 0).length,
    pontos: pontos.length,
    pontosDoMundo: pontos.filter((p) => !p.doJogador).length,
    maiorDistancia,
    qualidadesVistas,
    qualidadesAtivas,
    causaMorte: e.morte?.causa ?? '?',
    duplicadosProibidos,
    assinatura: `${classeOrigem}:${eu.t['familia'] ?? '?'}|${destino}`,
    destino,
    origem: j.riquezaOrigem,
    desempate: aleatorio(criarRng(misturar(e.semente, 991))),
    mudancasJogador,
    mudancasTotal,
    toques: j.toques,
    ms: j.ms,
    classeOrigem,
    mortesNaFamilia: e.historico.filter((h) => h.ref === 'regra:faleceu').length,
    anosPorFase: j.anosPorFase,
    noticias: e.historico.filter((h) => h.tipo === 'mundo').length,
    demissoes: demissoes.length,
    demissoesPelaFase: demissoes.filter((h) => (h.causas ?? []).some((id) => porId.get(id)?.tipo === 'mundo')).length,
    carreiraSetor: `${eu.t['setor'] || 'sem setor'}/${'servidor' in q ? 'servidor' : 'empreendedor' in q || 'socio' in q || 'herdeiro_negocio' in q ? 'dono' : 'empregado'}`,
    perfil: perfilDe(e),
    operacoes: j.operacoes,
    herdeiro: herdeiroPossivel(e, c) !== null,
    anosVazios: (() => {
      const comEvento = new Set(visiveis.map((h) => h.idade));
      let vazios = 0;
      for (let a = 18; a < e.idade; a++) if (!comEvento.has(a)) vazios++;
      return e.idade > 18 ? vazios / (e.idade - 18) : 0;
    })(),
    crises: (() => {
      const mudancas = e.historico.filter((h) => h.ref?.startsWith('ciclo:'));
      return mudancas.flatMap((h, i) => (h.ref === 'ciclo:crise' && mudancas[i + 1] ? [mudancas[i + 1]!.idade - h.idade] : []));
    })(),
    comeco: e.historico
      .filter((h) => h.idade <= 6 && (h.tipo === 'evento' || h.tipo === 'npc'))
      .map((h) => `${h.ref}:${h.escolha?.indice ?? ''}`)
      .join('>'),
    decisoesAntesDos5: e.historico.filter((h) => h.idade < 5 && (h.escolha !== undefined || h.tipo === 'acao')).length,
    porGoverno: j.pais.porGoverno,
    trabalho: (() => {
      const demitido = new Set(e.historico.filter((h) => h.ref === 'demissao').map((h) => h.ano));
      const t = { alto: 0, demitidoAlto: 0, baixo: 0, demitidoBaixo: 0 };
      for (const a of j.pais.anosDeTrabalho) {
        if (a.desemprego >= 10.5) {
          t.alto++;
          if (demitido.has(a.ano)) t.demitidoAlto++;
        } else if (a.desemprego <= 6.5) {
          t.baixo++;
          if (demitido.has(a.ano)) t.demitidoBaixo++;
        }
      }
      return t;
    })(),
    votos: e.historico.filter((h) => h.ref === 'primeiro_voto' || h.ref === 'eleicao_geral').length,
    votosQueElegeram: (() => {
      const votos = new Set(e.historico.filter((h) => h.ref === 'primeiro_voto' || h.ref === 'eleicao_geral').map((h) => h.id));
      return e.historico.filter((h) => h.ref?.startsWith('governo:') && (h.causas ?? []).some((id) => votos.has(id))).length;
    })(),
    viradas: e.historico.filter((h) => h.ref?.startsWith('ciclo:')).length,
    trocasDeGoverno: e.historico.filter((h, i, todas) => h.ref?.startsWith('governo:') && todas.slice(0, i).findLast((x) => x.ref?.startsWith('governo:'))?.ref !== h.ref).length,
    governo: j.pais.governo && {
      ...j.pais.governo,
      reformas: e.historico.filter((h) => h.ref === 'pais:politica').length,
      caiu: Boolean(q['derrubado'] || q['renunciou']),
    },
    infanciaVoltou: e.historico.some((h) => h.idade >= 5 && h.idade <= 12 && (h.causas ?? []).some((id) => (porId.get(id)?.idade ?? 99) <= 4 && porId.get(id)?.tipo !== 'nascimento')),
    acontecimentos: e.historico.filter((h) => h.tipo === 'evento' || h.tipo === 'npc' || h.tipo === 'morte').length,
    comPorque: e.historico.filter((h) => porqueDe(h, porId) !== null).length,
    empresaNaMorte: (() => {
      const emp = empresaDe(e);
      if (!emp) return null;
      const d = -(e.historico.find((h) => h.ref === 'empresa:sem_dono')?.mudancas?.find((m) => m.c === 'empresa.valor')?.d ?? 0);
      const valor = emp.n['valor'] ?? 0;
      return { dependencia: emp.n['dependencia'] ?? 0, perda: valor + d > 0 ? d / (valor + d) : 0, valor: valor + d };
    })(),
    decidiuQuemManda: e.historico.some(
      (h) => h.causa === 'escolha' && h.mudancas?.some((m) => m.c === 'empresa.dependencia') && !h.mudancas.some((m) => m.c === 'empresa.fundada'),
    ),
    fundou: e.historico.some((h) => h.mudancas?.some((m) => m.c === 'empresa.fundada' && m.q === 1)),
    quebrou: e.historico.some((h) => QUEBRAS.has(h.ref ?? '') && h.mudancas?.some((m) => m.c === 'empresa.fundada' && m.q === -1)),
    vendeu: 'vendeu_empresa' in q,
  };
}

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

const inicio = performance.now();
const c = carregarConteudo();
const vidas: Vida[] = [];
/** Instâncias de cada vida, por jogador (para a saturação), com e sem as narrativas de regra. */
const sequencias: string[][][] = [];
const sequenciasComRegras: string[][][] = [];
const sequenciasPorEstrategia = new Map<Estrategia, string[][][]>(ESTRATEGIAS.map((s) => [s, []]));
const sequenciasSemMemoria: string[][][] = [];
const textosPorK: number[][] = Array.from({ length: VIDAS_POR_JOGADOR }, () => []);

function rodarJogador(estrategia: Estrategia, idEstrategia: number, jogador: number, usarMemoria: boolean, guardar: boolean): void {
  let memoria = novaMemoria();
  const seq: string[][] = [];
  const seqRegras: string[][] = [];
  const textosVistos = new Set<string>();
  for (let k = 0; k < VIDAS_POR_JOGADOR; k++) {
    const semente = misturar(SEMENTE, idEstrategia, jogador, k);
    const j = jogar(c, estrategia, semente, usarMemoria ? memoria : undefined);
    const vida = medir(c, j, estrategia);
    seq.push(vida.instancias);
    seqRegras.push(vida.comRegras);
    if (guardar) {
      vidas.push(vida);
      if (k > 0 && vida.textos.length > 0) textosPorK[k]!.push(vida.textos.filter((t) => textosVistos.has(t)).length / vida.textos.length);
      for (const t of vida.textos) textosVistos.add(t);
    }
    memoria = lembrarVida(memoria, j.e);
  }
  if (guardar) {
    sequencias.push(seq);
    sequenciasComRegras.push(seqRegras);
    sequenciasPorEstrategia.get(estrategia)!.push(seq);
  } else {
    sequenciasSemMemoria.push(seq);
  }
}

ESTRATEGIAS.forEach((estrategia, s) => {
  for (let j = 0; j < JOGADORES; j++) rodarJogador(estrategia, s, j, true, true);
});
// Efeito da memória: as mesmas vidas (mesmas sementes) da estratégia aleatória, sem memória entre vidas.
const idAleatoria = ESTRATEGIAS.indexOf('aleatoria');
for (let j = 0; j < JOGADORES_BASE; j++) rodarJogador('aleatoria', idAleatoria, j, false, false);

// Quem cria o personagem escolhendo a classe: cada classe (da extrema pobreza à trilionária) com cada estratégia.
// Não entram nas métricas das 10.000 vidas; contam para storylet morto e para a tabela por origem.
const VIDAS_POR_ORIGEM = Math.max(2, Math.round(JOGADORES / 20));
const escolhidas: { classe: number; vida: Vida }[] = [];
CLASSES.forEach((_, classe) => {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_ORIGEM; k++) {
      const j = jogar(c, estrategia, misturar(SEMENTE, 404, classe, s, k), undefined, { classe });
      escolhidas.push({ classe, vida: medir(c, j, estrategia) });
    }
  });
});

// Quem escolhe uma linhagem (coroa, regime, gente famosa...): cada linhagem com cada estratégia.
// Também só contam para storylet morto (e para a tabela de origens, com a classe da linhagem).
const VIDAS_POR_LINHAGEM = Math.max(3, Math.round(JOGADORES / 12));
c.mundo.linhagens.forEach((l) => {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_LINHAGEM; k++) {
      const j = jogar(c, estrategia, misturar(SEMENTE, 505, l.classe, s, k, l.id.length), undefined, { linhagem: l.id });
      escolhidas.push({ classe: l.classe, vida: medir(c, j, estrategia) });
    }
  });
});

// Brincar de deus: quem nasce bilionário ou trilionário e mexe no mundo com o dinheiro.
// Também só contam para storylet morto (e para a tabela de origens), e medem as jogadas.
// Metade dos jogadores por classe e estratégia (~500 vidas): com 200, a opção mais rara de uma jogada rara
// (salvar o país, que pede crise e R$ 200 bilhões) saía 1 ou 2 vezes, e a reação dela às vezes morria por sorteio.
const VIDAS_POR_FORTUNA = Math.max(3, Math.round(JOGADORES / 2));
const fortunas: Vida[] = [];
for (const classe of [6, 7]) {
  ESTRATEGIAS.forEach((estrategia, s) => {
    for (let k = 0; k < VIDAS_POR_FORTUNA; k++) {
      const vida = medir(c, jogar(c, estrategia, misturar(SEMENTE, 606, classe, s, k), undefined, { classe }), estrategia);
      fortunas.push(vida);
      escolhidas.push({ classe, vida });
    }
  });
}

// Dinastias: quando a vida acaba e há filho ou filha viva, a história continua com essa pessoa (até 5 gerações).
interface Geracao {
  estrategia: Estrategia;
  geracao: number;
  inicio: number;
  idade: number;
  patrimonio: number;
  herdou: number;
  herdeiro: boolean;
  instancias: string[];
  eventos: string[];
  acoes: string[];
  jogadas: string[];
}
const DINASTIAS = Math.max(4, Math.round(JOGADORES / 3));
const MAX_GERACOES = 5;
const geracoes: Geracao[] = [];
/** Pares (patrimônio de quem morreu, patrimônio do herdeiro ao morrer). */
const paresGeracao: [number, number][] = [];
const tamanhos: number[] = [];
ESTRATEGIAS.forEach((estrategia, s) => {
  for (let d = 0; d < DINASTIAS; d++) {
    const semente = misturar(SEMENTE, 777, s, d);
    let e = nascer(c, { semente, ano: ANO });
    const robo = criarRng(misturar(semente, 78));
    let anterior: number | null = null;
    let g = 1;
    for (; g <= MAX_GERACOES; g++) {
      const inicioVida = e.idade;
      const herdou = g > 1 ? (e.dinastia?.antepassados.at(-1)?.deixou ?? 0) : 0;
      viver(c, e, estrategia, robo, undefined);
      const patrimonio = patrimonioTotal(e);
      if (anterior !== null) paresGeracao.push([anterior, patrimonio]);
      const visiveis = apresentados(e);
      geracoes.push({
        estrategia,
        geracao: g,
        inicio: inicioVida,
        idade: e.idade,
        patrimonio,
        herdou,
        herdeiro: herdeiroPossivel(e, c) !== null,
        instancias: visiveis.map((h) => h.instancia!),
        eventos: visiveis.map((h) => h.ref!),
        acoes: e.historico.filter((h) => h.tipo === 'acao').map((h) => h.ref!),
        jogadas: jogadasDaVida(e).jogadas,
      });
      if (!herdeiroPossivel(e, c) || g === MAX_GERACOES) break;
      anterior = patrimonio;
      e = continuarComoHerdeiro(e, c);
    }
    tamanhos.push(Math.min(g, MAX_GERACOES));
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
for (const x of [...escolhidas.map((v) => v.vida), ...geracoes]) for (const id of [...x.eventos, ...x.acoes, ...x.jogadas]) ocorrencias.set(id, (ocorrencias.get(id) ?? 0) + 1);
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

const base = nascer(c, { semente: 1, ano: ANO });
const dilemasFalsos = falsosDilemas(c, estadoTipico(base, 30));
const semTensao = arriscarNaoCompensa(c, base);
const comRisco = c.storylets.filter((s) => (s.escolhas?.length ?? 0) > 1).length;

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
const msPorVida = media(vidas.map((v) => v.ms));
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
      const fase = anoDoPais(e, c, []);
      const r = mercadoDoAno(e, c, fase.id, []);
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
const portoes = [
  ['Saturação V5 ≤ 80%', satV(sat, 5) <= 0.8, `${pct(satV(sat, 5))} (base ${pct(BASE.saturacaoV5)})`],
  ['Assinaturas ≥ 1,5× a linha de base', assinaturas >= 1.5 * BASE.assinaturas, `${num(assinaturas, 0)} (base ${BASE.assinaturas}, alvo ${num(1.5 * BASE.assinaturas, 0)})`],
  ['Desvio da felicidade ≥ 1,3× a linha de base', desvioFelicidade >= 1.3 * BASE.desvioFelicidade, `${num(desvioFelicidade, 2)} (base ${num(BASE.desvioFelicidade, 2)}, alvo ${num(1.3 * BASE.desvioFelicidade, 2)})`],
  ['Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano)', toques <= TETO_TOQUES, `${num(toques)} (base ${num(BASE.toques)}, teto ${TETO_TOQUES})`],
] as const;

const metas = [
  ['Zero storylets mortos', mortos.length === 0, `${mortos.length} mortos`],
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
l(`- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): ${dilemasFalsos.length ? dilemasFalsos.map((d) => `\`${d.evento}\``).join(', ') : 'nenhum'}`);
l(
  `- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): ${semTensao.length} de ${comRisco} storylets — ${semTensao.map((id) => `\`${id}\``).join(', ')}. Algumas são armadilhas de propósito.`,
);
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
l('- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).');
l();

const relatorio = linhas.join('\n');
if (!args.has('sem-arquivo')) writeFileSync(join(RAIZ, 'docs', 'metricas.md'), relatorio);

console.log(`Túnel: ${vidas.length.toLocaleString('pt-BR')} vidas em ${segundos.toFixed(1)} s`);
for (const [nome, ok, detalhe] of metas) console.log(`${ok ? '✓' : '✗'} ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes) console.log(`${ok ? '✓' : '·'} portão: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes2) console.log(`${ok ? '✓' : '·'} portão 2: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes3) console.log(`${ok ? '✓' : '·'} portão 3: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes5) console.log(`${ok ? '✓' : '·'} portão 5: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes6) console.log(`${ok ? '✓' : '·'} portão 6: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes7) console.log(`${ok ? '✓' : '·'} portão 7: ${nome} (${detalhe})`);
for (const [nome, ok, detalhe] of portoes8) console.log(`${ok ? '✓' : '·'} portão 8: ${nome} (${detalhe})`);
console.log(`Perfis (aleatória): ${porPerfil.map((p) => `${p.perfil} n=${p.n} p10 ${formatarDinheiro(p.p10)} p50 ${formatarDinheiro(p.p50)} p90 ${formatarDinheiro(p.p90)}`).join(' · ')}`);
console.log(`Origens escolhidas: ${porOrigem.map((o) => `${o.nome} ${formatarDinheiro(o.patrimonio)}`).join(' · ')}`);
console.log(
  `Saturação V5 ${pct(satV(sat, 5))} · V20 ${pct(satV(sat, 20))} · com regras ${pct(satV(satRegras, 5))} · assinaturas/1000 ${num(assinaturas, 0)} (destino ${num(destinos, 0)}) · ` +
    `mobilidade diag ${pct(mob.diagonal)} ρ ${num(mob.spearman, 2)} · p90/p10 ${Number.isFinite(razao9010) ? num(razao9010, 1) : 'p10≤0'} · desvio felicidade ${num(desvioFelicidade, 2)} · ` +
    `negativas ${pct(negativas)} · jogador ${pct(parteJogador)} · toques ${num(toques, 1)} · ${num(msPorVida, 2)} ms/vida`,
);
console.log(`Falsos dilemas: ${dilemasFalsos.length} · arriscar nunca compensa: ${semTensao.length}`);
console.log(`Idade média ${num(media(idades))} · patrimônio mediano ${formatarDinheiro(percentil(patOrd, 50))} · felicidade média ${num(media(felicidades))}`);
for (const r of porEstrategia) {
  console.log(`  ${r.estrategia.padEnd(10)} idade ${num(r.idade)} · patrimônio ${formatarDinheiro(r.patrimonio)} · felicidade ${num(r.felicidade)} · storylets ${num(r.eventos)} · ações ${num(r.acoes)} · V5 ${pct(r.saturacaoV5, 0)}`);
}
if (mortos.length) console.log(`Mortos: ${mortos.join(', ')}`);
if (raros.length) console.log(`Raros: ${raros.join(', ')}`);
if (inertes.length) console.log(`Qualidades inertes: ${inertes.join(', ')}`);
process.exit(metas.every(([, ok]) => ok) ? 0 : 1);
