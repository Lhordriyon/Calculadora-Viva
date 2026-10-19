/**
 * O país vivo. Todo ano andam as estatísticas do país (crescimento,
 * desemprego, inflação, juros, dívida, pobreza, violência, saúde e educação
 * públicas, aprovação do governo), puxadas pelas políticas de quem governa
 * (mundo.json › politicas), pelos decretos (pais.impulso), pelas contas e
 * pela sorte (a crise lá fora, a alta das commodities). A fase do ciclo é o
 * nome do crescimento, uma qualidade do país com a entrada que a anunciou
 * como causa; o que ela muda na vida (demissão, salário, empresa) sai das
 * estatísticas, e o resto do país chega pelo bolso (imposto, auxílio, juros),
 * pelo corpo (a saúde pública, a violência) e pela escola. Governos fictícios
 * se alternam em eleições de quatro em quatro anos (mundo.json › governos), e
 * o voto de quem joga pesa; no poder (presidente, monarca, chefe do Regime),
 * quem joga escolhe as políticas pela folha País. Cada mudança fica no livro
 * com a causa: o voto, a eleição, a reforma, o decreto, o choque de fora.
 */
import { POLITICAS, type Fase, type Politica } from './constantes.ts';
import { classeDoPatrimonio, indicadoresDoPais, patrimonioTotal } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefFase, DefGoverno, EfeitoDePolitica } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import type { Exterior } from './diplomacia.ts';
import {
  CHOQUE_DA_CRISE,
  CRESCIMENTO_POTENCIAL,
  DEMOGRAFIA,
  DESEMPREGO_NATURAL,
  DESVIO_DO_CRESCIMENTO,
  DIVIDA_DE_EQUILIBRIO,
  FOLGA_DAS_FASES,
  FUGA_DE_CAPITAIS,
  IMPULSO_ELEITORAL,
  INFLACAO_DA_CRISE,
  INFLUENCIA_POR_VOTO,
  JURO_REAL_NEUTRO,
  JUROS_DIVIDA,
  JUROS_MEDIOS,
  LIMITES_DA_RECONDUCAO,
  LIMITES_DAS_FASES,
  MEMORIA_DO_IMPULSO,
  META_DE_INFLACAO,
  PERFIL_DA_VIOLENCIA,
  PAIS_EM_2026,
  PERSISTENCIA_DO_CRESCIMENTO,
  PESO_DA_ESCOLA_PUBLICA,
  PESO_DA_SAUDE_PUBLICA,
  PESO_DO_VOTO,
  REACAO_FISCAL,
  REPASSE_DO_CAMBIO,
  VANTAGEM_DE_QUEM_GOVERNA,
  VIOLENCIA_DOS_RICOS,
  VIOLENCIA_POR_GENERO,
} from './regras.ts';
import { aleatorio, normal, sortear, sortearIndice } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

/** As estatísticas do país, na ordem da folha País. */
export const ESTATISTICAS = ['crescimento', 'desemprego', 'inflacao', 'juros', 'divida', 'pobreza', 'violencia', 'saude', 'educacao', 'aprovacao'] as const;
export type Estatistica = (typeof ESTATISTICAS)[number];

const limitar = (v: number, min: number, max: number): number => (v < min ? min : v > max ? max : v);
/** As estatísticas andam de décimo em décimo (o livro e a folha ficam legíveis). */
const arred = (v: number): number => Math.round(v * 10) / 10 || 0;

// ---------------------------------------------------------------- a fase do ciclo

/** A fase atual: a qualidade de fase que o país tem, ou normal. */
export function faseDe(e: EstadoVida): Fase {
  const q = e.entidades['pais']?.q ?? {};
  if (q['crise']) return 'crise';
  if (q['recessao']) return 'recessao';
  if (q['expansao']) return 'expansao';
  return 'normal';
}

export function defFase(c: Conteudo, fase: Fase): DefFase {
  return c.mundo.fases.find((f) => f.id === fase) ?? c.mundo.fases[0]!;
}

/** O nome do crescimento: expansão, normal, recessão ou crise. Sair da fase em que se está pede uma folga. */
export function faseDoCrescimento(g: number, atual: Fase = 'normal'): Fase {
  const expansao = LIMITES_DAS_FASES.expansao - (atual === 'expansao' ? FOLGA_DAS_FASES.expansao : 0);
  const folga = atual === 'recessao' ? FOLGA_DAS_FASES.recessao : atual === 'crise' ? FOLGA_DAS_FASES.crise : 0;
  if (g >= expansao) return 'expansao';
  if (g >= LIMITES_DAS_FASES.normal + folga) return 'normal';
  if (g >= LIMITES_DAS_FASES.recessao + (atual === 'crise' ? FOLGA_DAS_FASES.crise : 0)) return 'recessao';
  return 'crise';
}

/** Da pior para a melhor: sair da crise para a recessão é melhorar. */
const ORDEM_DAS_FASES: Record<Fase, number> = { crise: 0, recessao: 1, normal: 2, expansao: 3 };

/** O que o momento do país faz com a vida neste ano. */
export interface Momento {
  id: Fase;
  /** Multiplica a chance de demissão (e divide a de recolocação): 1 com o desemprego natural. */
  desemprego: number;
  /** Variação real dos salários no ano (0,02 = +2%). */
  salario: number;
  /** Somado ao crescimento das empresas no ano, vezes o quanto o setor sente o ciclo. */
  empresa: number;
  /** Rendimento a mais (ou a menos) do dinheiro guardado da família. */
  retorno: number;
  /** Quanto o dólar subiu (ou caiu) no ano, em fração: as empresas que exportam ou importam e o investimento em dólar sentem. */
  cambio?: number;
}

function momentoDe(id: Fase, crescimento: number, desemprego: number): Momento {
  const desvio = crescimento - CRESCIMENTO_POTENCIAL;
  return {
    id,
    desemprego: Math.pow(Math.max(2, desemprego) / DESEMPREGO_NATURAL, 1.8),
    salario: 0.005 + 0.008 * desvio,
    empresa: 0.025 * desvio,
    retorno: 0.02 * desvio,
  };
}

/** O momento de agora: a fase e o que o crescimento e o desemprego do país fazem com a vida. */
export function momentoDoPais(e: EstadoVida): Momento {
  const n = e.entidades['pais']?.n ?? {};
  return momentoDe(faseDe(e), n['crescimento'] ?? CRESCIMENTO_POTENCIAL, n['desemprego'] ?? DESEMPREGO_NATURAL);
}

/** Quanto do tempo o país passa em cada fase, no longo prazo (o túnel confere: docs/metricas.md). */
export const FREQUENCIA_DAS_FASES: Record<Fase, number> = { normal: 0.645, expansao: 0.228, recessao: 0.105, crise: 0.022 };

/** O país típico de cada fase: para o save de antes do país vivo e para os testes. */
export const TIPICO: Record<Fase, { crescimento: number; desemprego: number }> = {
  normal: { crescimento: 2, desemprego: 8.4 },
  expansao: { crescimento: 5, desemprego: 6.4 },
  recessao: { crescimento: -1.5, desemprego: 10.8 },
  crise: { crescimento: -4, desemprego: 13.5 },
};

export function momentoTipico(fase: Fase): Momento {
  return momentoDe(fase, TIPICO[fase].crescimento, TIPICO[fase].desemprego);
}

// ---------------------------------------------------------------- políticas e governos

/** O nível (0 baixo, 1 médio, 2 alto) de uma política em vigor. */
export function nivelDe(e: EstadoVida, p: Politica): number {
  const v = e.entidades['pais']?.n[`pol_${p}`];
  return v === undefined ? 1 : limitar(Math.round(v), 0, 2);
}

/** A soma do que as políticas em vigor fazem com uma conta (receita, pobreza, auxílio…). */
export function efeitoDasPoliticas(e: EstadoVida, c: Conteudo, chave: EfeitoDePolitica): number {
  let soma = 0;
  for (const def of c.mundo.politicas) soma += def.efeitos[chave]?.[nivelDe(e, def.id)] ?? 0;
  return soma;
}

export function defGoverno(c: Conteudo, id: string | undefined): DefGoverno | undefined {
  return c.mundo.governos.find((g) => g.id === id);
}

/** Quem governa: o id de um bloco, 'regime' ou 'voce'. */
export function governoAtual(e: EstadoVida): string {
  return e.entidades['pais']?.t['governo'] || 'centrao';
}

/** "a frente popular", "você". */
export function nomeDoGoverno(e: EstadoVida, c: Conteudo): string {
  const id = governoAtual(e);
  return id === 'voce' ? 'você' : (defGoverno(c, id)?.nome ?? id);
}

/** Quem joga ocupa um cargo que governa o país (presidente, monarca, chefe do Regime) e o mandato não acabou. */
export function jogadorGoverna(e: EstadoVida, c: Conteudo): boolean {
  const eu = e.entidades['eu'];
  const cargo = c.mundo.cargos.find((x) => x.id === eu?.t['cargo']);
  if (!cargo?.governa) return false;
  return cargo.esfera === 'vitalicio' || (eu?.n['mandato'] ?? 0) > 0;
}

/** Eleição geral nos anos que deixam resto 2 na divisão por 4 (2026, 2030…); a posse é no ano seguinte. */
export const anoDeEleicao = (ano: number): boolean => ano % 4 === 2;
const anoDePosse = (ano: number): boolean => ano % 4 === 3;
export function proximaEleicaoGeral(ano: number): number {
  return ano + ((2 - (ano % 4) + 4) % 4);
}

/** Crescimento para onde a economia volta: as políticas, a escola de uma geração, a dívida e a violência. */
export function potencialDe(e: EstadoVida, c: Conteudo): number {
  const n = e.entidades['pais']!.n;
  return (
    CRESCIMENTO_POTENCIAL +
    efeitoDasPoliticas(e, c, 'potencial') +
    0.015 * ((n['educacao'] ?? 50) - 50) -
    Math.min(1.5, 0.03 * Math.max(0, (n['divida'] ?? DIVIDA_DE_EQUILIBRIO) - 90)) -
    Math.min(1, 0.02 * Math.max(0, (n['violencia'] ?? 22) - 25))
  );
}

/** Quanto o governo arrecada a mais do que gasta (pontos do PIB), antes dos juros: positivo paga a dívida. */
export function primarioDe(e: EstadoVida, c: Conteudo, impulso = e.entidades['pais']?.n['impulso'] ?? 0): number {
  const n = e.entidades['pais']!.n;
  const gov = defGoverno(c, governoAtual(e));
  return (
    efeitoDasPoliticas(e, c, 'receita') -
    efeitoDasPoliticas(e, c, 'gasto') -
    (gov?.gasto ?? 0) -
    impulso +
    REACAO_FISCAL * ((n['divida'] ?? DIVIDA_DE_EQUILIBRIO) - DIVIDA_DE_EQUILIBRIO)
  );
}

/** Selic: o juro real neutro, mais a inflação, mais o que o Banco Central reage (inflação acima da meta, economia quente, dívida alta). */
function selic(inflacao: number, hiato: number, divida: number): number {
  return limitar(JURO_REAL_NEUTRO + inflacao + 0.5 * (inflacao - META_DE_INFLACAO) + 0.3 * hiato + Math.min(4, 0.03 * Math.max(0, divida - 90)), 2, 45);
}

// ---------------------------------------------------------------- o país em que se nasce

/**
 * O país em que se nasce: um governo sorteado (ou o regime, se a linhagem o
 * trouxe) e as estatísticas perto de onde as políticas dele levam, com a sorte
 * do momento. Sem entrada no livro: é o mundo em que se nasce.
 */
export function paisInicial(e: EstadoVida, c: Conteudo): void {
  const pais = e.entidades['pais']!;
  const n = pais.n;
  const r = e.rng;
  const eleitos = c.mundo.governos.filter((g) => g.eleito);
  const gov = (pais.q['regime'] && defGoverno(c, 'regime')) || eleitos[sortearIndice(r, eleitos.map(() => 1))]!;
  pais.t['governo'] = gov.id;
  for (const p of POLITICAS) n[`pol_${p}`] = gov.politicas[p];
  const efeito = (k: EfeitoDePolitica): number => efeitoDasPoliticas(e, c, k);
  const pot = CRESCIMENTO_POTENCIAL + efeito('potencial');
  const g = limitar(normal(r, pot, 1.6), -6, 8);
  const u = limitar(DESEMPREGO_NATURAL - 0.8 * (g - pot) + normal(r, 0, 0.8), 4, 18);
  const inflacao = limitar(META_DE_INFLACAO + 0.35 * (g - pot) + normal(r, 0, 1.2), 1, 15);
  const primario = efeito('receita') - efeito('gasto') - (gov.gasto ?? 0);
  const divida = limitar(DIVIDA_DE_EQUILIBRIO - primario / REACAO_FISCAL + normal(r, 0, 8), 20, 160);
  const pobreza = limitar(25 + efeito('pobreza') + 1.2 * (u - DESEMPREGO_NATURAL), 5, 60);
  Object.assign(n, {
    crescimento: arred(g),
    desemprego: arred(u),
    inflacao: arred(inflacao),
    juros: arred(selic(inflacao, g - pot, divida)),
    divida: arred(divida),
    pobreza: arred(pobreza),
    violencia: arred(limitar(22 + 0.3 * (pobreza - 25) + efeito('violencia'), 5, 60)),
    saude: arred(limitar(50 + efeito('saude') + normal(r, 0, 3), 10, 90)),
    // A escola muda devagar: o governo de agora só fez parte do caminho.
    educacao: arred(limitar(50 + 0.6 * efeito('educacao') + normal(r, 0, 3), 10, 90)),
    aprovacao: arred(limitar(normal(r, 50, 8), 15, 85)),
  });
  const fase = faseDoCrescimento(n['crescimento']!);
  if (fase !== 'normal') pais.q[fase] = { v: 1, ano: e.ano, idade: 0, causa: null };
  iniciarNumeros(e);
}

/** Quanto a população cresce no ano (% ao ano): a transição demográfica, a saúde pública e a pobreza. */
export function taxaDaPopulacao(ano: number, saude = 50, pobreza = 25): number {
  const base = Math.max(DEMOGRAFIA.piso, DEMOGRAFIA.taxa2026 - DEMOGRAFIA.porAno * (ano - 2026));
  return base + DEMOGRAFIA.porSaude * (saude - 50) + DEMOGRAFIA.porPobreza * (pobreza - 25);
}

/**
 * O PIB e a população de quem nasce (e do save de antes deles): os de 2026, levados ao ano de agora com o crescimento
 * potencial e a transição demográfica. Sem sorteio: o save antigo não muda de sorte.
 */
export function iniciarNumeros(e: EstadoVida): void {
  const n = e.entidades['pais']?.n;
  if (!n || n['pib'] !== undefined) return;
  let pib: number = PAIS_EM_2026.pib;
  let populacao: number = PAIS_EM_2026.populacao;
  const passo = e.ano >= 2026 ? 1 : -1;
  for (let ano = 2026; ano !== e.ano; ano += passo) {
    pib = passo > 0 ? pib * (1 + CRESCIMENTO_POTENCIAL / 100) : pib / (1 + CRESCIMENTO_POTENCIAL / 100);
    const taxa = taxaDaPopulacao(passo > 0 ? ano + 1 : ano) / 100;
    populacao = passo > 0 ? populacao * (1 + taxa) : populacao / (1 + taxa);
  }
  n['pib'] = Math.round(pib);
  n['populacao'] = Math.round(populacao);
}

/** Um país de antes do país vivo (save antigo): as estatísticas típicas da fase que ele tinha, com o centrão no governo. */
export function migrarPais(e: EstadoVida, c: Conteudo): void {
  const pais = e.entidades['pais'];
  if (!pais || pais.n['crescimento'] !== undefined) return;
  const gov = (pais.q['regime'] && defGoverno(c, 'regime')) || defGoverno(c, 'centrao') || c.mundo.governos[0]!;
  pais.t['governo'] = gov.id;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = gov.politicas[p];
  const tipico = TIPICO[faseDe(e)];
  const inflacao = pais.n['inflacao'] ?? META_DE_INFLACAO;
  Object.assign(pais.n, {
    crescimento: tipico.crescimento,
    desemprego: tipico.desemprego,
    inflacao,
    juros: arred(selic(inflacao, tipico.crescimento - CRESCIMENTO_POTENCIAL, 85)),
    divida: 85,
    pobreza: 25,
    violencia: 22,
    saude: 50,
    educacao: 50,
    aprovacao: 50,
  });
}

// ---------------------------------------------------------------- quem governa

/** O voto de quem joga na eleição do ano passado (a qualidade voto_<bloco> e a entrada em que votou). */
export function votoDe(e: EstadoVida, c: Conteudo, ano = e.ano - 1): { governo: DefGoverno; entrada: number | null } | null {
  const q = e.entidades['eu']?.q ?? {};
  for (const g of c.mundo.governos) {
    const voto = q[`voto_${g.id}`];
    if (voto && voto.v > 0 && voto.ano === ano) return { governo: g, entrada: voto.causa };
  }
  return null;
}

/** O que o eleitor quer agora: quem promete resolver o que mais aperta (pelas políticas que o bloco adota). */
function desejo(e: EstadoVida, c: Conteudo, g: DefGoverno): number {
  const n = e.entidades['pais']!.n;
  let w = 1;
  if (g.politicas.social === 2) w += 0.15 * Math.max(0, (n['desemprego'] ?? 8.5) - 9) + 0.04 * Math.max(0, (n['pobreza'] ?? 25) - 25);
  const gasto = c.mundo.politicas.reduce((s, p) => s + (p.efeitos.gasto?.[g.politicas[p.id]] ?? 0), 0) + (g.gasto ?? 0);
  if (gasto <= -1) w += 0.2 * Math.max(0, (n['inflacao'] ?? 4.5) - 6) + 0.02 * Math.max(0, (n['divida'] ?? 75) - 90);
  if (g.politicas.seguranca === 2) w += 0.08 * Math.max(0, (n['violencia'] ?? 22) - 25);
  return w;
}

/** Quem assume: escreve o governo, as políticas dele e a aprovação de quem começa, numa entrada visível. */
function posse(e: EstadoVida, gov: DefGoverno, texto: string, resumo: string, causas: number[], aprovacao: number): void {
  const ctx = contexto(e, { ator: 'pais' });
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `governo:${gov.id}`, ator: 'pais', texto: capitalizar(renderizar(texto, ctx)), resumo });
  if (causas.length > 0) entrada.causas = [...new Set(causas)];
  const reg: Mudanca[] = [];
  definirTexto(e, reg, 'pais', 'governo', gov.id);
  for (const p of POLITICAS) definirNumero(e, reg, 'pais', `pol_${p}`, gov.politicas[p]);
  definirNumero(e, reg, 'pais', 'aprovacao', arred(aprovacao));
  lancar(e, entrada, reg);
}

/**
 * A eleição geral, contada na posse (o ano seguinte ao da votação). Quem
 * governa fica com a chance da aprovação; os outros dividem o resto pelo
 * desejo do eleitor. O voto de quem joga (e de quem vai atrás dele, pela
 * influência) puxa a parte do escolhido.
 */
function eleicao(e: EstadoVida, c: Conteudo, incumbente: DefGoverno | undefined, saiu: number | null): void {
  const n = e.entidades['pais']!.n;
  const eleitos = c.mundo.governos.filter((g) => g.eleito);
  const fica = incumbente ? limitar((n['aprovacao'] ?? 50) / 100 + VANTAGEM_DE_QUEM_GOVERNA, LIMITES_DA_RECONDUCAO[0], LIMITES_DA_RECONDUCAO[1]) : 0;
  const desejos = eleitos.map((g) => (g === incumbente ? 0 : desejo(e, c, g)));
  const soma = desejos.reduce((s, w) => s + w, 0);
  let partes = eleitos.map((g, k) => (g === incumbente ? fica : ((1 - fica) * desejos[k]!) / soma));
  const voto = votoDe(e, c);
  const k = voto ? eleitos.indexOf(voto.governo) : -1;
  if (k >= 0) {
    const peso = PESO_DO_VOTO + (e.entidades['eu']?.n['influencia'] ?? 0) / INFLUENCIA_POR_VOTO;
    partes = partes.map((p, j) => (j === k ? p + peso * (1 - p) : p * (1 - peso)));
  }
  const vencedor = eleitos[sortearIndice(e.rng, partes)]!;
  const parte = partes[eleitos.indexOf(vencedor)]!;
  const votos = Math.round(limitar(50 + 30 * (parte - 0.5) + normal(e.rng, 0, 3), 50.6, 72));
  const nome = capitalizar(vencedor.nome);
  const ficou = vencedor === incumbente;
  let texto = ficou
    ? `Eleições gerais: ${nome} continua no governo, com ${votos}% dos votos válidos.`
    : `Eleições gerais: ${nome} venceu com ${votos}% dos votos válidos${saiu !== null ? ' e assume no seu lugar' : ''}, prometendo ${vencedor.promessa}.`;
  if (voto) texto += voto.governo === vencedor ? ' Você votou neles e agora vai cobrar.' : ' Você votou em outro e já ensaia o "eu avisei".';
  const causas: number[] = [];
  if (voto?.governo === vencedor && voto.entrada !== null) causas.push(voto.entrada);
  // Quem governava e perdeu numa recessão ou numa crise: a fase pesou no voto.
  const fase = faseDe(e);
  const causaDaFase = e.entidades['pais']!.q[fase]?.causa;
  if (!ficou && incumbente && (fase === 'recessao' || fase === 'crise') && causaDaFase !== undefined && causaDaFase !== null) causas.push(causaDaFase);
  if (saiu !== null) causas.push(saiu);
  const resumo = ficou ? `${vencedor.nome} se manteve no governo` : `${vencedor.nome} ganhou a eleição`;
  posse(e, vencedor, texto, resumo, causas, ficou ? Math.min(95, (n['aprovacao'] ?? 50) + 3) : 55 + normal(e.rng, 0, 5));
}

/** O cargo que governava saiu de cena há pouco (o mandato acabou, a queda, a renúncia): a entrada que conta isso. */
function causaDaSaida(e: EstadoVida): number | null {
  const q = e.entidades['eu']?.q ?? {};
  for (const m of ['derrubado', 'renunciou', 'ex_politico']) {
    const saida = q[m];
    if (saida && saida.causa !== null && saida.ano >= e.ano - 2) return saida.causa;
  }
  return null;
}

/**
 * Quem governa neste ano. Quem joga no cargo governa; sob o regime, o regime;
 * senão um bloco eleito: na posse, a eleição; fora dela, se quem governava
 * saiu de cena (quem joga perdeu o cargo, o regime caiu), um governo de
 * transição até a próxima eleição.
 */
function quemGoverna(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const pais = e.entidades['pais']!;
  const atual = governoAtual(e);
  if (jogadorGoverna(e, c)) {
    if (atual !== 'voce') {
      definirTexto(e, reg, 'pais', 'governo', 'voce', 'pais');
      definirNumero(e, reg, 'pais', 'aprovacao', arred(e.entidades['eu']!.n['popularidade'] ?? 50), 'pais');
    }
    return;
  }
  const regime = defGoverno(c, 'regime');
  if (pais.q['regime'] && regime) {
    if (atual !== 'regime') posse(e, regime, 'O regime tomou o governo. [Os jornais ficaram mais finos.|A televisão passou a só dar boas notícias.]', 'o regime tomou o governo', [], 50);
    return;
  }
  const def = defGoverno(c, atual);
  const eleito = def?.eleito === true ? def : undefined;
  const saiu = atual === 'voce' ? causaDaSaida(e) : null;
  if (anoDePosse(e.ano)) {
    eleicao(e, c, eleito, saiu);
    return;
  }
  if (eleito) return;
  // Sem eleição agora: um governo de transição, escolhido como numa eleição sem quem governava.
  const eleitos = c.mundo.governos.filter((g) => g.eleito);
  const vencedor = eleitos[sortearIndice(e.rng, eleitos.map((g) => desejo(e, c, g)))]!;
  const nome = capitalizar(vencedor.nome);
  // Quem governava era quem joga (saiu do cargo) ou quem veio antes na dinastia (morreu no poder); ou o regime caiu.
  const texto =
    atual !== 'voce'
      ? `O regime caiu. ${nome} assumiu um governo de transição e marcou eleições; na rua, gente que não se conhecia se abraçava.`
      : saiu !== null
        ? `Sem você no poder, ${vencedor.nome} assumiu o governo até a próxima eleição. A primeira medida foi trocar as fotos dos ministérios.`
        : `Com a morte de quem governava, ${vencedor.nome} assumiu o governo até a próxima eleição. O país passou três dias de luto e uma semana de especulação.`;
  posse(e, vencedor, texto, `${vencedor.nome} assumiu o governo`, saiu !== null ? [saiu] : [], 55);
}

// ---------------------------------------------------------------- o ano do país

/** Quanto do caminho até o alvo a pobreza, a violência, a saúde e a educação andam por ano (a escola leva uma geração). */
const RITMO_DO_PAIS = { pobreza: 0.3, violencia: 0.2, saude: 0.15, educacao: 0.08 } as const;

/** Para onde andam as estatísticas lentas, com as políticas de agora, o desemprego, a pobreza, a escola e a dívida dados. */
export function alvosDoPais(
  e: EstadoVida,
  c: Conteudo,
  desemprego: number,
  pobreza: number,
  educacao: number,
  divida: number,
): { pobreza: number; violencia: number; saude: number; educacao: number } {
  const efeito = (k: EfeitoDePolitica): number => efeitoDasPoliticas(e, c, k);
  return {
    pobreza: 25 + efeito('pobreza') + 1.2 * (desemprego - DESEMPREGO_NATURAL),
    // A violência anda com a desigualdade (o Gini resume a pobreza e a escola).
    violencia: 22 + 60 * (indicadoresDoPais({ id: 'pais', tipo: 'jurisdicao', nome: '', n: { pobreza, educacao }, t: {}, q: {} }).gini - 0.52) + efeito('violencia'),
    saude: 50 + efeito('saude') - 0.2 * Math.max(0, divida - 100),
    educacao: 50 + efeito('educacao'),
  };
}

/** Para onde o país caminha agora (a folha País mostra a seta): o crescimento potencial, o desemprego natural, as contas e as estatísticas lentas. */
export function rumoDoPais(e: EstadoVida, c: Conteudo): { potencial: number; natural: number; primario: number } & ReturnType<typeof alvosDoPais> {
  const n = e.entidades['pais']!.n;
  const alvos = alvosDoPais(e, c, n['desemprego'] ?? DESEMPREGO_NATURAL, n['pobreza'] ?? 25, n['educacao'] ?? 50, n['divida'] ?? DIVIDA_DE_EQUILIBRIO);
  return {
    potencial: potencialDe(e, c),
    natural: DESEMPREGO_NATURAL - 0.03 * ((n['educacao'] ?? 50) - 50),
    primario: primarioDe(e, c),
    ...alvos,
  };
}

/**
 * Quem empurrou o país para onde ele foi: o decreto (pais.impulso) que aqueceu
 * ou esfriou nos últimos três anos e quem decidiu as políticas que puxam o
 * crescimento (a posse do governo ou a reforma de quem joga), nos últimos oito.
 */
function causasDaVirada(e: EstadoVida, melhorou: boolean, pot: number): number[] {
  const causas: number[] = [];
  const politicasPuxam = melhorou ? pot >= CRESCIMENTO_POTENCIAL + 0.25 : pot <= CRESCIMENTO_POTENCIAL - 0.25;
  let decreto = false;
  let politica = !politicasPuxam;
  for (let k = e.historico.length - 1; k >= 0 && !(decreto && politica); k--) {
    const h = e.historico[k]!;
    if (h.ano < e.ano - 8) break;
    for (const m of h.mudancas ?? []) {
      // As regras do ano (o empurrão que se desfaz) não contam: só quem decidiu.
      if (m.r !== undefined) continue;
      if (!decreto && m.c === 'pais.impulso' && h.ano >= e.ano - 3 && m.d !== undefined && m.d !== 0 && m.d > 0 === melhorou) {
        causas.push(h.id);
        decreto = true;
        break;
      }
      if (!politica && (m.c.startsWith('pais.pol_') || m.c === 'pais.governo')) {
        causas.push(h.id);
        politica = true;
        break;
      }
    }
  }
  return causas;
}

/** A fase mudou: a entrada visível que conta (o choque de fora, quando foi ele), com quem empurrou como causa. */
function virarFase(e: EstadoVida, c: Conteudo, antes: Fase, nova: Fase, deFora: 'crise' | 'boom' | null, pot: number, origem: number | null): void {
  const def = defFase(c, nova);
  const melhorou = ORDEM_DAS_FASES[nova] > ORDEM_DAS_FASES[antes];
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `ciclo:${nova}`, ator: 'pais', texto: '' });
  const reg: Mudanca[] = [];
  if (antes !== 'normal') perder(e, reg, 'pais', antes);
  if (nova !== 'normal') ganhar(e, reg, 'pais', nova, entrada.id);
  const doChoque = def.choque && ((deFora === 'crise' && !melhorou) || (deFora === 'boom' && melhorou));
  const ctx = contexto(e, { ator: 'pais' });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, doChoque ? def.choque! : def.textos), ctx));
  entrada.resumo = renderizar(def.resumo, ctx);
  // O choque de fora que virou a fase (a notícia da crise ou do boom lá fora) vem antes de quem empurrou daqui.
  const causas = [...(doChoque && origem !== null ? [origem] : []), ...causasDaVirada(e, melhorou, pot)];
  if (causas.length > 0) entrada.causas = causas;
  lancar(e, entrada, reg);
}

/**
 * Um ano do país, antes de tudo (vale para a economia, os empregos e os
 * storylets do ano): quem governa, as estatísticas, o empurrão que se desfaz
 * e a fase. As estatísticas vão para as regras do ano (`reg`); a eleição, a
 * transição e a virada de fase, para entradas visíveis. Devolve o momento.
 */
export function anoDoPais(e: EstadoVida, c: Conteudo, reg: Mudanca[], fora: Exterior = { choque: 0, deFora: null, origem: null, cambio: 0 }): Momento {
  const pais = e.entidades['pais']!;
  const n = pais.n;
  if (n['crescimento'] === undefined) migrarPais(e, c);
  quemGoverna(e, c, reg);
  const r = e.rng;
  const efeito = (k: EfeitoDePolitica): number => efeitoDasPoliticas(e, c, k);
  const gov = defGoverno(c, governoAtual(e));
  const eleitoral = anoDeEleicao(e.ano) && gov?.eleito === true;
  const impulso = (n['impulso'] ?? 0) + (eleitoral ? IMPULSO_ELEITORAL : 0);
  const g0 = n['crescimento']!;
  const u0 = n['desemprego'] ?? DESEMPREGO_NATURAL;
  const pi0 = n['inflacao'] ?? META_DE_INFLACAO;
  const i0 = n['juros'] ?? JUROS_MEDIOS;
  const d0 = n['divida'] ?? DIVIDA_DE_EQUILIBRIO;
  const edu0 = n['educacao'] ?? 50;
  const pot = potencialDe(e, c);

  // A sorte do ano, o que o mundo lá fora fez com o Brasil (diplomacia.ts) e a fuga de capitais quando a dívida daqui passa do ponto.
  let choque = normal(r, 0, DESVIO_DO_CRESCIMENTO) + fora.choque;
  let choqueNaInflacao = fora.deFora === 'crise' ? INFLACAO_DA_CRISE : 0;
  let deFora = fora.deFora;
  const fuga = Math.min(FUGA_DE_CAPITAIS.teto, FUGA_DE_CAPITAIS.porPonto * Math.max(0, d0 - FUGA_DE_CAPITAIS.acima));
  if (fuga > 0 && aleatorio(r) < fuga) {
    choque += CHOQUE_DA_CRISE;
    choqueNaInflacao = INFLACAO_DA_CRISE;
    deFora = 'crise';
  }

  // Crescimento: volta para o potencial, com a sorte, o empurrão e o freio do juro real alto.
  const g = limitar(pot + PERSISTENCIA_DO_CRESCIMENTO * (g0 - pot) + choque + 0.6 * impulso - 0.12 * (i0 - pi0 - JURO_REAL_NEUTRO - 0.5), -9, 12);
  const hiato = g - pot;
  // Desemprego: volta para o natural (menor com escola boa) e cai quando a economia cresce acima do potencial.
  const natural = DESEMPREGO_NATURAL - 0.03 * (edu0 - 50);
  const u = limitar(natural + 0.6 * (u0 - natural) - 0.45 * hiato, 3, 25);
  // Inflação: metade da do ano passado, metade da meta, mais a economia quente, o empurrão e a dívida que ninguém acredita.
  // E o dólar que subiu (o importado fica caro) e a tarifa na fronteira.
  const pi = limitar(
    0.5 * pi0 +
      0.5 * META_DE_INFLACAO +
      0.35 * hiato +
      0.4 * impulso +
      Math.min(3, 0.02 * Math.max(0, d0 - 100)) +
      normal(r, 0, 1.3) +
      choqueNaInflacao +
      REPASSE_DO_CAMBIO * 100 * fora.cambio +
      0.5 * efeito('inflacao'),
    0.5,
    30,
  );
  const i = selic(pi, hiato, d0);
  // Dívida: o que o governo gasta acima do que arrecada; a recessão derruba a arrecadação.
  const d = limitar(d0 - primarioDe(e, c, impulso) - 0.3 * hiato + 0.5 * impulso, 10, 250);
  // O país das pessoas: anda devagar para onde as políticas, o emprego e as contas levam.
  const pob0 = n['pobreza'] ?? 25;
  const pob = pob0 + RITMO_DO_PAIS.pobreza * (alvosDoPais(e, c, u, pob0, edu0, d).pobreza - pob0);
  const alvo1 = alvosDoPais(e, c, u, pob, edu0, d);
  const vio = (n['violencia'] ?? 22) + RITMO_DO_PAIS.violencia * (alvo1.violencia - (n['violencia'] ?? 22));
  const sau = (n['saude'] ?? 50) + RITMO_DO_PAIS.saude * (alvo1.saude - (n['saude'] ?? 50));
  const edu = edu0 + RITMO_DO_PAIS.educacao * (alvo1.educacao - edu0);
  // Aprovação: o emprego, a renda, os preços, a violência e o posto de saúde, mais o que as políticas agradam.
  const alvo =
    50 +
    2.5 * (g - CRESCIMENTO_POTENCIAL) -
    1.2 * (u - DESEMPREGO_NATURAL) -
    Math.max(0, pi - META_DE_INFLACAO) -
    0.2 * (vio - 22) +
    0.1 * (sau - 50) +
    efeito('aprovacao') +
    (gov?.aprovacao ?? 0);
  // Quando quem governa é quem joga, a aprovação do governo é a popularidade dele.
  const voce = governoAtual(e) === 'voce';
  const atual = voce ? (e.entidades['eu']!.n['popularidade'] ?? 50) : (n['aprovacao'] ?? 50);
  const aprovacao = arred(limitar(atual + 0.35 * (alvo - atual) + normal(r, 0, 3), 5, 95));

  const valores: Record<Estatistica, number> = {
    crescimento: g,
    desemprego: u,
    inflacao: pi,
    juros: i,
    divida: d,
    pobreza: limitar(pob, 2, 70),
    violencia: limitar(vio, 2, 80),
    saude: limitar(sau, 5, 95),
    educacao: limitar(edu, 5, 95),
    aprovacao,
  };
  for (const k of ESTATISTICAS) definirNumero(e, reg, 'pais', k, arred(valores[k]), 'pais');
  // O tamanho do país: o PIB anda com o crescimento real do ano; a população, com a demografia, a saúde e a pobreza.
  if (n['pib'] === undefined) iniciarNumeros(e);
  // Com os números já arredondados: o PIB cresce o mesmo que a folha País mostra.
  definirNumero(e, reg, 'pais', 'pib', Math.round(n['pib']! * (1 + n['crescimento']! / 100)), 'pais');
  definirNumero(e, reg, 'pais', 'populacao', Math.round(n['populacao']! * (1 + taxaDaPopulacao(e.ano, n['saude'], n['pobreza']) / 100)), 'pais');
  if (voce) definirNumero(e, reg, 'eu', 'popularidade', aprovacao, 'pais');
  // O empurrão de quem governa se desfaz aos poucos.
  const sobra = n['impulso'] ?? 0;
  if (Math.abs(sobra) >= 0.05) somar(e, reg, 'pais', 'impulso', -sobra * (1 - MEMORIA_DO_IMPULSO), 'pais');

  const antes = faseDe(e);
  const nova = faseDoCrescimento(n['crescimento']!, antes);
  // A virada só aponta para a notícia de fora se o choque veio de lá (a fuga de capitais é daqui).
  if (nova !== antes) virarFase(e, c, antes, nova, deFora, pot, deFora === fora.deFora ? fora.origem : null);
  return { ...momentoDoPais(e), cambio: fora.cambio };
}

// ---------------------------------------------------------------- o país na vida de quem joga

/** Juro real do ano (Selic menos inflação), em pontos percentuais. */
export function juroReal(e: EstadoVida): number {
  const n = e.entidades['pais']?.n ?? {};
  return (n['juros'] ?? JUROS_MEDIOS) - (n['inflacao'] ?? META_DE_INFLACAO);
}

/** O que o país faz no bolso de quem joga neste ano. */
export interface Bolso {
  /** Inflação do ano (0,045 = 4,5%). */
  inflacao: number;
  /** Juros nominais da dívida (cartão, cheque especial): andam com a Selic. */
  jurosDaDivida: number;
  /** O que o imposto muda na renda de quem não é pobre (−0,04 = 4% a menos). */
  imposto: number;
  /** O auxílio que quem é pobre recebe (reais por ano). */
  auxilio: number;
}

export function bolsoDoPais(e: EstadoVida, c: Conteudo): Bolso {
  const n = e.entidades['pais']?.n ?? {};
  return {
    inflacao: (n['inflacao'] ?? META_DE_INFLACAO) / 100,
    jurosDaDivida: limitar(JUROS_DIVIDA + ((n['juros'] ?? JUROS_MEDIOS) - JUROS_MEDIOS) / 100, 0.12, 0.6),
    imposto: efeitoDasPoliticas(e, c, 'renda'),
    auxilio: efeitoDasPoliticas(e, c, 'auxilio'),
  };
}

/** Quem é rico (classe 5 ou mais pelo patrimônio) tem plano de saúde, carro blindado e condomínio. */
function rico(e: EstadoVida): boolean {
  return classeDoPatrimonio(patrimonioTotal(e)) >= 5;
}

/** A saúde pública multiplica a mortalidade de quem depende dela. */
export function fatorDaSaudePublica(e: EstadoVida): number {
  if (rico(e)) return 1;
  return Math.max(0.6, 1 + (50 - (e.entidades['pais']?.n['saude'] ?? 50)) / PESO_DA_SAUDE_PUBLICA);
}

/** Chance de morrer de violência neste ano: homicídios por 100 mil, pela idade, pelo gênero e pelo bolso. */
export function riscoDeViolencia(e: EstadoVida): number {
  const faixa = PERFIL_DA_VIOLENCIA.find(([de, ate]) => e.idade >= de && e.idade <= ate);
  if (!faixa) return 0;
  const violencia = e.entidades['pais']?.n['violencia'] ?? 22;
  const genero = e.entidades['eu']?.genero ?? 'm';
  return (violencia / 100_000) * faixa[2] * VIOLENCIA_POR_GENERO[genero] * (rico(e) ? VIOLENCIA_DOS_RICOS : 1);
}

/** O que a escola pública soma à inteligência de quem estuda nela (dos 6 aos 17, de família até a classe 3). */
export function escolaPublica(e: EstadoVida): number {
  if (e.idade < 6 || e.idade > 17 || (e.entidades['eu']?.n['classe_origem'] ?? 2) > 3) return 0;
  return ((e.entidades['pais']?.n['educacao'] ?? 50) - 50) / PESO_DA_ESCOLA_PUBLICA;
}

// ---------------------------------------------------------------- governar: a folha País

export type OperacaoPais = { tipo: 'politica'; politica: Politica; nivel: number };

export function ehOperacaoDePais(op: { tipo: string }): op is OperacaoPais {
  return op.tipo === 'politica';
}

/** Já fez uma reforma neste ano (as reformas ficam no livro). */
function reformouEsteAno(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano === e.ano; i--) if (e.historico[i]!.ref === 'pais:politica') return true;
  return false;
}

export function motivoParaNaoOperarPais(e: EstadoVida, c: Conteudo, op: OperacaoPais): string | null {
  if (governoAtual(e) !== 'voce') return jogadorGoverna(e, c) ? 'a posse é no ano que vem' : 'só quem governa o país muda as políticas';
  if (!(POLITICAS as readonly string[]).includes(op.politica)) return 'escolha a política';
  if (!Number.isInteger(op.nivel) || op.nivel < 0 || op.nivel > 2) return 'escolha o nível';
  if (nivelDe(e, op.politica) === op.nivel) return 'essa já é a política em vigor';
  if (reformouEsteAno(e)) return 'uma reforma por ano: o Congresso tem limite';
  return null;
}

/** Muda uma política: a aprovação sente na hora (o que se tira dói, o que se dá agrada) e as estatísticas, nos anos seguintes. */
export function operarPais(e: EstadoVida, c: Conteudo, op: OperacaoPais, reg: Mudanca[]): { texto: string; resumo: string } {
  const def = c.mundo.politicas.find((p) => p.id === op.politica)!;
  const antes = nivelDe(e, op.politica);
  definirNumero(e, reg, 'pais', `pol_${op.politica}`, op.nivel);
  const delta = (def.efeitos.aprovacao?.[op.nivel] ?? 0) - (def.efeitos.aprovacao?.[antes] ?? 0);
  if (delta !== 0) {
    const pop = somar(e, reg, 'eu', 'popularidade', delta);
    somar(e, reg, 'pais', 'aprovacao', pop);
  }
  const subiu = op.nivel > antes;
  return {
    texto: `Reforma aprovada. ${def.nome}: de ${def.niveis[antes]} para ${def.niveis[op.nivel]}. ${subiu ? def.subir.texto : def.baixar.texto}`,
    resumo: subiu ? def.subir.resumo : def.baixar.resumo,
  };
}
