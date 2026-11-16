/**
 * npm run dinastias: a bancada de longo prazo (Etapa 02, I-182).
 *
 * O túnel mede a experiência de uma vida; a auditoria confere o estado em até 4 gerações. Esta bancada joga a mesma
 * família por muitas gerações (12, 25, 50, 100) em cenários controlados e mede o que só aparece em séculos: o tamanho
 * do país, o salário diante dele, o patrimônio, o rendimento do dinheiro aplicado, a população, a precisão dos números.
 *
 * - Reproduzível: cada dinastia é um cenário (estratégia e origem) e uma semente; a mesma versão dá o mesmo resultado.
 * - Cada geração deixa uma linha de métricas; a rodada inteira vai para um JSON, que outra rodada compara
 *   (`--comparar=`), dizendo a primeira geração em que cada dinastia divergiu.
 * - Os invariantes de escala são absolutos (nada de folga proporcional ao tamanho do país): cada um diz o ano em que
 *   quebrou pela primeira vez, e `--reproduzir=` refaz aquela dinastia com a série ano a ano.
 * - A família que acabaria sem herdeiro continua por um sobrinho distante (intervenção da bancada, contada à parte):
 *   sem isso, quase nenhuma dinastia chegaria a 25 gerações, e o país de séculos não seria medido.
 *
 * Uso: npm run dinastias -- [--geracoes=12] [--sementes=2] [--cenarios=a,b] [--saida=ARQ.json] [--md=ARQ.md]
 *        [--comparar=ARQ.json] [--reproduzir=cenario:semente] [--geracao=N] [--sem-continuar] [--estrito]
 *   --estrito  sai com 1 se algum invariante de escala quebrar
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { carregarConteudo } from './disco.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { defCampo, empresasDe, indicadoresDoPais, parteEfetiva, parteNasEmpresas, patrimonioTotal, todasAsEmpresas } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { lugarNoPais } from '../src/motor/lugar.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import type { EscolhaOrigem } from '../src/motor/origem.ts';
import { PAIS_EM_2026 } from '../src/motor/regras.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from '../src/motor/robos.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const args = process.argv.slice(2);
const texto = (nome: string): string | undefined => args.find((a) => a.startsWith(`--${nome}=`))?.slice(nome.length + 3);
const numero = (nome: string, padrao: number): number => Number(texto(nome) ?? padrao);
const GERACOES = numero('geracoes', 12);
const SEMENTES = numero('sementes', 2);
const CONTINUAR = !args.includes('--sem-continuar');
const ESTRITO = args.includes('--estrito');

interface Cenario {
  id: string;
  estrategia: Estrategia;
  origem: EscolhaOrigem;
}
/** As condições iniciais controladas: as pontas da riqueza, o meio, a coroa e o regime, com quem arrisca e com quem guarda. */
const CENARIOS: readonly Cenario[] = [
  { id: 'rica-arriscada', estrategia: 'arriscada', origem: { classe: 5 } },
  { id: 'rica-cautelosa', estrategia: 'cautelosa', origem: { classe: 5 } },
  { id: 'bilionaria-arriscada', estrategia: 'arriscada', origem: { classe: 6 } },
  { id: 'trilionaria-cautelosa', estrategia: 'cautelosa', origem: { classe: 7 } },
  { id: 'media-arriscada', estrategia: 'arriscada', origem: { classe: 2 } },
  { id: 'pobre-cautelosa', estrategia: 'cautelosa', origem: { classe: 0 } },
  { id: 'realeza-cautelosa', estrategia: 'cautelosa', origem: { linhagem: 'realeza' } },
  { id: 'regime-arriscada', estrategia: 'arriscada', origem: { linhagem: 'regime' } },
  { id: 'sorteada-aleatoria', estrategia: 'aleatoria', origem: {} },
];
/** As sementes da bancada (fixas: a rodada de amanhã joga as mesmas dinastias). */
const SEMENTE_BASE = 101;

const c = carregarConteudo();
const PC_2026 = PAIS_EM_2026.pib / PAIS_EM_2026.populacao;
const INTEIRO_SEGURO = Number.MAX_SAFE_INTEGER;

// ---------------------------------------------------------------- os invariantes de escala (absolutos)

/**
 * Cada limite é um número fixo, com o porquê; nenhum cresce com o tamanho do país.
 * - precisao: acima de 2^53 um número de ponto flutuante deixa de guardar os reais um a um.
 * - residuo: a soma de todo o dinheiro do mundo é zero; R$ 100 de folga cobrem o arredondamento de cada lançamento.
 * - pibPerCapita: 15 vezes o de 2026 é mais do que a fronteira de produtividade do mundo alcança no modelo; abaixo de
 *   um quinto, o país teria regredido um século.
 * - salario: quem vive de salário e ganha menos de um vigésimo da renda média do país não é um trabalhador daquele país.
 * - patrimonio: toda a riqueza de um país fica em torno de 6 PIBs; ninguém tem mais do que isso sozinho.
 * - rendimento: o que o dinheiro aplicado rende no ano não passa de 20% do PIB (o mercado inteiro é menor que um PIB).
 * - populacao: abaixo de 20 milhões, o país perdeu nove em cada dez pessoas.
 */
const LIMITES = { residuo: 100, pcMax: 15, pcMin: 0.2, salarioMin: 0.05, patrimonio: 6, rendimento: 0.2, populacaoMin: 2e7 } as const;
type Invariante = 'precisao' | 'residuo' | 'pibPerCapita' | 'salario' | 'patrimonio' | 'rendimento' | 'populacao' | 'consolidado' | 'estado' | 'contas';

interface Quebra {
  n: number;
  /** A primeira vez: geração, ano e o que foi visto. */
  primeira: string;
}

// ---------------------------------------------------------------- uma geração

interface Geracao {
  g: number;
  ano: number;
  idade: number;
  /** Quem herdou esta vida (a primeira nasceu); `forcada` quando a bancada pôs um sobrinho para a família não acabar. */
  parentesco: string;
  forcada: boolean;
  pib: number;
  /** O PIB em reais do ano (o de hoje vezes os preços acumulados desde o começo da dinastia). */
  pibNominal: number;
  populacao: number;
  pibPerCapita: number;
  crescimentoMedio: number;
  inflacaoMedia: number;
  inflacaoMaxima: number;
  desempregoMedio: number;
  dividaDoPais: number;
  gini: number;
  /** A renda de quem joga aos 40 (ou a última, se morreu antes), em reais de hoje, e ela diante do PIB per capita. */
  renda40: number;
  rendaSobrePc: number;
  assalariado: boolean;
  patrimonio: number;
  patrimonioSobrePib: number;
  patrimonioMaximoSobrePib: number;
  percentil: number;
  divida: number;
  empresas: number;
  parteNasEmpresas: number;
  caixaDasHoldings: number;
  /** O que o dinheiro aplicado rendeu na vida (a carteira de quem joga e a das holdings), e o maior ano diante do PIB. */
  rendimento: number;
  rendimentoDaHolding: number;
  rendimentoMaximoSobrePib: number;
  mercadoSobrePib: number;
  residuoMaximo: number;
  maiorNumero: number;
  entradas: number;
  saveKb: number;
  ms: number;
  quebras: Partial<Record<Invariante, number>>;
}

interface Dinastia {
  cenario: string;
  estrategia: Estrategia;
  origem: EscolhaOrigem;
  semente: number;
  geracoes: Geracao[];
  /** A geração em que a família acabaria sem a intervenção da bancada (0 = não acabaria). */
  fimNatural: number;
  fim: string;
  quebras: Partial<Record<Invariante, Quebra>>;
}

interface Rodada {
  quando: string;
  geracoes: number;
  dinastias: Dinastia[];
}

const assalariado = (e: EstadoVida): boolean => {
  const eu = e.entidades['eu']!;
  return !!eu.t['carreira'] && empresasDe(e).length === 0 && !eu.q['coroa'] && !eu.q['regime'] && !eu.t['cargo'];
};

function viverGeracao(d: Dinastia, e: EstadoVida, g: number, precos: { p: number }, anual: boolean): Geracao {
  const t0 = performance.now();
  const robo = criarRng(misturar(d.semente, 77, g));
  const quebras: Partial<Record<Invariante, number>> = {};
  const quebrar = (inv: Invariante, visto: string): void => {
    quebras[inv] = (quebras[inv] ?? 0) + 1;
    const q = (d.quebras[inv] ??= { n: 0, primeira: `geração ${g}, ${e.ano} (aos ${e.idade}): ${visto}` });
    q.n++;
  };
  let anos = 0;
  let crescimento = 0;
  let inflacao = 0;
  let inflacaoMaxima = -Infinity;
  let desemprego = 0;
  let renda40 = 0;
  let trabalha40 = false;
  let patrimonioMaximoSobrePib = 0;
  let rendimento = 0;
  let rendimentoDaHolding = 0;
  let rendimentoMaximoSobrePib = 0;
  let residuoMaximo = 0;
  let maiorNumero = 0;
  let conferidas = e.historico.length;
  if (anual) console.log('ano\tidade\tPIB\tpopulação\tper capita\tcresc\tinfl\trenda\tpatrimônio\tholdings\trendeu\tmercado/PIB');
  while (e.vivo) {
    if (e.pendente) {
      escolher(e, c, decidir(d.estrategia, e, c, robo));
      continue;
    }
    for (const op of decidirDinheiro(d.estrategia, e, c, robo)) {
      if (motivoParaNaoOperar(e, c, op) === null) operar(e, c, op);
    }
    for (let a = decidirAcao(d.estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(d.estrategia, e, c, robo)) agir(e, c, a.verbo, a.escolha);
    if (!e.vivo || e.pendente) continue;
    avancarAno(e, c, undefined);
    anos++;
    const pais = e.entidades['pais']!.n;
    const pib = pais['pib'] ?? 1;
    const pc = pib / Math.max(1, pais['populacao'] ?? 1);
    crescimento += pais['crescimento'] ?? 0;
    inflacao += pais['inflacao'] ?? 0;
    inflacaoMaxima = Math.max(inflacaoMaxima, pais['inflacao'] ?? 0);
    desemprego += pais['desemprego'] ?? 0;
    precos.p *= 1 + (pais['inflacao'] ?? 0) / 100;
    const eu = e.entidades['eu']!.n;
    if (e.idade <= 40 || renda40 === 0) {
      renda40 = eu['renda'] ?? 0;
      trabalha40 = assalariado(e);
    }
    // O livro do ano: as contas de cada entrada e o que o dinheiro aplicado rendeu.
    let rendeu = 0;
    let rendeuNaHolding = 0;
    for (let i = conferidas; i < e.historico.length; i++) {
      const h = e.historico[i]!;
      for (const p of conferirContas(e, h)) quebrar('contas', p);
      for (const m of h.mudancas ?? []) {
        if (m.d === undefined) continue;
        if (m.r === 'carteira') rendeuNaHolding += m.d;
        else if (m.r === 'cotacao' || m.r === 'rendimento') rendeu += m.d;
      }
    }
    conferidas = e.historico.length;
    rendimento += rendeu + rendeuNaHolding;
    rendimentoDaHolding += rendeuNaHolding;
    const rendeuSobrePib = (rendeu + rendeuNaHolding) / pib;
    rendimentoMaximoSobrePib = Math.max(rendimentoMaximoSobrePib, rendeuSobrePib);
    // Os invariantes do estado (os do motor) e os de escala (os da bancada).
    for (const p of conferirEstado(e, c)) quebrar('estado', p);
    const residuo = Math.abs(dinheiroDoMundo(e));
    residuoMaximo = Math.max(residuoMaximo, residuo);
    if (residuo > LIMITES.residuo) quebrar('residuo', `o dinheiro do mundo soma R$ ${residuo.toFixed(2)}`);
    for (const en of Object.values(e.entidades)) {
      for (const [campo, v] of Object.entries(en.n)) {
        if (!defCampo(en.id, campo)?.reais) continue;
        const abs = Math.abs(v);
        if (abs > maiorNumero) maiorNumero = abs;
        if (abs > INTEIRO_SEGURO) quebrar('precisao', `${en.id}.${campo} = ${v.toExponential(3)}`);
      }
    }
    if (pc > LIMITES.pcMax * PC_2026 || pc < LIMITES.pcMin * PC_2026) quebrar('pibPerCapita', `R$ ${Math.round(pc).toLocaleString('pt-BR')} por pessoa (${(pc / PC_2026).toFixed(1)}× o de 2026)`);
    if ((pais['populacao'] ?? 0) < LIMITES.populacaoMin) quebrar('populacao', `${Math.round((pais['populacao'] ?? 0) / 1e6)} milhões de pessoas`);
    if (e.vivo && e.idade >= 25 && e.idade <= 60 && assalariado(e) && (eu['renda'] ?? 0) > 0 && (eu['renda'] ?? 0) < LIMITES.salarioMin * pc) {
      quebrar('salario', `salário de R$ ${Math.round(eu['renda']!).toLocaleString('pt-BR')} com o PIB per capita em R$ ${Math.round(pc).toLocaleString('pt-BR')}`);
    }
    const patrimonio = patrimonioTotal(e);
    patrimonioMaximoSobrePib = Math.max(patrimonioMaximoSobrePib, patrimonio / pib);
    if (patrimonio > LIMITES.patrimonio * pib) quebrar('patrimonio', `patrimônio de ${(patrimonio / pib).toFixed(1)} PIBs`);
    if (rendeuSobrePib > LIMITES.rendimento) quebrar('rendimento', `o dinheiro aplicado rendeu ${(100 * rendeuSobrePib).toFixed(1)}% do PIB no ano`);
    // O grupo sem contar duas vezes: a parte de quem joga é a soma, empresa por empresa, da parte efetiva vezes o valor;
    // e a holding vale o caixa dela (o que ela tem nas filhas já está nas filhas).
    let soma = 0;
    for (const emp of todasAsEmpresas(e)) soma += parteEfetiva(e, emp) * Math.max(0, emp.n['valor'] ?? 0);
    const noPatrimonio = parteNasEmpresas(e);
    if (Math.abs(soma - noPatrimonio) > 1) quebrar('consolidado', `as empresas somam R$ ${Math.round(soma)} e o patrimônio conta R$ ${Math.round(noPatrimonio)}`);
    for (const emp of empresasDe(e)) {
      if (emp.q['holding'] && Math.abs((emp.n['valor'] ?? 0) - Math.max(0, emp.n['caixa'] ?? 0)) > 1) quebrar('consolidado', `${emp.id}: a holding vale R$ ${emp.n['valor']} com R$ ${emp.n['caixa']} em caixa`);
    }
    if (anual) {
      const f = (x: number): string => x.toExponential(3);
      const caixa = empresasDe(e).filter((x) => x.q['holding']).reduce((s, x) => s + (x.n['caixa'] ?? 0), 0);
      console.log([e.ano, e.idade, f(pib), f(pais['populacao'] ?? 0), Math.round(pc), pais['crescimento'], pais['inflacao'], Math.round(eu['renda'] ?? 0), f(patrimonio), f(caixa), f(rendeu + rendeuNaHolding), ((e.entidades['mercado']?.n['dinheiro'] ?? 0) / pib).toFixed(3)].join('\t'));
    }
  }
  const pais = e.entidades['pais']!;
  const pib = pais.n['pib'] ?? 1;
  const ind = indicadoresDoPais(pais);
  const patrimonio = patrimonioTotal(e);
  const m = Math.max(1, anos);
  return {
    g,
    ano: e.ano,
    idade: e.idade,
    parentesco: '',
    forcada: false,
    pib,
    pibNominal: pib * precos.p,
    populacao: pais.n['populacao'] ?? 0,
    pibPerCapita: ind.pibPerCapita,
    crescimentoMedio: crescimento / m,
    inflacaoMedia: inflacao / m,
    inflacaoMaxima,
    desempregoMedio: desemprego / m,
    dividaDoPais: pais.n['divida'] ?? 0,
    gini: ind.gini,
    renda40,
    rendaSobrePc: renda40 / Math.max(1, ind.pibPerCapita),
    assalariado: trabalha40,
    patrimonio,
    patrimonioSobrePib: patrimonio / pib,
    patrimonioMaximoSobrePib,
    percentil: lugarNoPais(e, c).percentil,
    divida: e.entidades['eu']!.n['divida'] ?? 0,
    empresas: empresasDe(e).length,
    parteNasEmpresas: parteNasEmpresas(e),
    caixaDasHoldings: empresasDe(e).filter((x) => x.q['holding']).reduce((s, x) => s + (x.n['caixa'] ?? 0), 0),
    rendimento,
    rendimentoDaHolding,
    rendimentoMaximoSobrePib,
    mercadoSobrePib: (e.entidades['mercado']?.n['dinheiro'] ?? 0) / pib,
    residuoMaximo,
    maiorNumero,
    entradas: e.historico.length,
    saveKb: Math.round(JSON.stringify(e).length / 1024),
    ms: Math.round(performance.now() - t0),
    quebras,
  };
}

function jogarDinastia(cen: Cenario, semente: number, geracoes: number, anualNa?: number): Dinastia {
  const d: Dinastia = { cenario: cen.id, estrategia: cen.estrategia, origem: cen.origem, semente, geracoes: [], fimNatural: 0, fim: '', quebras: {} };
  let e = nascer(c, { semente, ano: 2026, origem: cen.origem });
  const precos = { p: 1 };
  let parentesco = 'nasceu';
  let forcada = false;
  for (let g = 1; g <= geracoes; g++) {
    let ger: Geracao;
    try {
      ger = viverGeracao(d, e, g, precos, anualNa === g);
    } catch (x) {
      d.fim = `erro do motor na geração ${g}, em ${e.ano}: ${(x as Error).message.slice(0, 200)}`;
      break;
    }
    ger.parentesco = parentesco;
    ger.forcada = forcada;
    d.geracoes.push(ger);
    if (g === geracoes) {
      d.fim = `chegou à geração ${g}`;
      break;
    }
    forcada = false;
    let h = herdeiroPossivel(e, c);
    if (!h) {
      if (d.fimNatural === 0) d.fimNatural = g;
      if (!CONTINUAR) {
        d.fim = `sem herdeiro na geração ${g}`;
        break;
      }
      // A intervenção da bancada: um sobrinho distante leva a história adiante (o testamento para a causa fica sem efeito).
      const eu = e.entidades['eu']!;
      eu.n['irmaos'] = Math.max(1, eu.n['irmaos'] ?? 0);
      delete eu.t['testamento'];
      h = herdeiroPossivel(e, c);
      forcada = true;
      if (!h) {
        d.fim = `sem herdeiro na geração ${g}, nem com a intervenção`;
        break;
      }
    }
    parentesco = h.parentesco;
    try {
      e = continuarComoHerdeiro(e, c);
    } catch (x) {
      d.fim = `erro do motor ao herdar na geração ${g}: ${(x as Error).message.slice(0, 200)}`;
      break;
    }
  }
  return d;
}

// ---------------------------------------------------------------- a saída

const f = (x: number, casas = 2): string => (Math.abs(x) >= 1e5 || (x !== 0 && Math.abs(x) < 0.01) ? x.toExponential(casas) : x.toFixed(casas));
const mediana = (xs: number[]): number => {
  if (xs.length === 0) return NaN;
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor((o.length - 1) / 2)]!;
};

/** As gerações em que a rodada para para olhar: 1, 2, 4, 8, 12, 25, 50, 100 (as que existirem). */
const marcos = (ate: number): number[] => [1, 2, 4, 8, 12, 25, 50, 100].filter((g) => g <= ate);

const COLUNAS: readonly { nome: string; de: (g: Geracao) => number; casas?: number }[] = [
  { nome: 'ano', de: (g) => g.ano, casas: 0 },
  { nome: 'PIB (reais de hoje)', de: (g) => g.pib },
  { nome: 'PIB nominal', de: (g) => g.pibNominal },
  { nome: 'população', de: (g) => g.populacao },
  { nome: 'PIB per capita', de: (g) => g.pibPerCapita },
  { nome: 'crescimento médio (%)', de: (g) => g.crescimentoMedio },
  { nome: 'inflação média (%)', de: (g) => g.inflacaoMedia },
  { nome: 'dívida do país (% PIB)', de: (g) => g.dividaDoPais, casas: 0 },
  { nome: 'renda aos 40', de: (g) => g.renda40 },
  { nome: 'renda aos 40 / PIB per capita', de: (g) => g.rendaSobrePc },
  { nome: 'patrimônio', de: (g) => g.patrimonio },
  { nome: 'patrimônio / PIB', de: (g) => g.patrimonioSobrePib, casas: 4 },
  { nome: 'percentil da riqueza', de: (g) => g.percentil, casas: 1 },
  { nome: 'dívida de quem joga', de: (g) => g.divida },
  { nome: 'caixa das holdings', de: (g) => g.caixaDasHoldings },
  { nome: 'rendimento da holding na vida', de: (g) => g.rendimentoDaHolding },
  { nome: 'maior rendimento do ano / PIB', de: (g) => g.rendimentoMaximoSobrePib, casas: 4 },
  { nome: 'dinheiro do mercado / PIB', de: (g) => g.mercadoSobrePib, casas: 3 },
  { nome: 'maior número em reais', de: (g) => g.maiorNumero },
  { nome: 'resíduo do dinheiro (R$)', de: (g) => g.residuoMaximo, casas: 4 },
  { nome: 'save (KB)', de: (g) => g.saveKb, casas: 0 },
];

function relatorio(r: Rodada, base?: Rodada): string {
  const linhas: string[] = [];
  const p = (s = ''): void => void linhas.push(s);
  p(`# Bancada de dinastias: ${r.dinastias.length} dinastias, até ${r.geracoes} gerações`);
  p();
  p(`Cenários e sementes fixos; a mesma versão do motor dá esta mesma página. ${CONTINUAR ? 'A família sem herdeiro continua por um sobrinho (contado em "fim natural").' : 'A família sem herdeiro acaba.'}`);
  p();
  p('## As dinastias');
  p();
  p('| Cenário | Semente | Gerações | Último ano | Fim natural | Como terminou |');
  p('|---|---|---|---|---|---|');
  for (const d of r.dinastias) p(`| ${d.cenario} | ${d.semente} | ${d.geracoes.length} | ${d.geracoes.at(-1)?.ano ?? '-'} | ${d.fimNatural || 'não acabaria'} | ${d.fim} |`);
  p();
  const naturais = r.dinastias.map((d) => d.fimNatural || Infinity);
  p(`Sobrevivência sem intervenção: ${marcos(r.geracoes).map((g) => `geração ${g}: ${naturais.filter((x) => x >= g).length}/${naturais.length}`).join('; ')}.`);
  p();
  p('## Por geração (mediana das dinastias que chegaram lá; entre colchetes, o mínimo e o máximo)');
  p();
  const gs = marcos(Math.max(...r.dinastias.map((d) => d.geracoes.length)));
  p(`| Métrica | ${gs.map((g) => `g${g}`).join(' | ')} |`);
  p(`|---|${gs.map(() => '---').join('|')}|`);
  for (const col of COLUNAS) {
    const celulas = gs.map((g) => {
      const xs = r.dinastias.map((d) => d.geracoes[g - 1]).filter((x): x is Geracao => !!x).map(col.de);
      if (xs.length === 0) return '-';
      return `${f(mediana(xs), col.casas)} [${f(Math.min(...xs), col.casas)}; ${f(Math.max(...xs), col.casas)}]`;
    });
    p(`| ${col.nome} | ${celulas.join(' | ')} |`);
  }
  p();
  p('## Invariantes de escala (limites absolutos)');
  p();
  const invs: Invariante[] = ['precisao', 'residuo', 'pibPerCapita', 'salario', 'patrimonio', 'rendimento', 'populacao', 'consolidado', 'estado', 'contas'];
  p('| Invariante | Dinastias que quebraram | Vezes | A primeira |');
  p('|---|---|---|---|');
  for (const inv of invs) {
    const com = r.dinastias.filter((d) => d.quebras[inv]);
    const vezes = com.reduce((s, d) => s + d.quebras[inv]!.n, 0);
    const cedo = com.map((d) => ({ d, g: Number(/geração (\d+)/.exec(d.quebras[inv]!.primeira)?.[1] ?? 0), ano: Number(/, (\d{4}) /.exec(d.quebras[inv]!.primeira)?.[1] ?? 0) })).sort((a, b) => a.ano - b.ano)[0];
    p(`| ${inv} | ${com.length}/${r.dinastias.length} | ${vezes} | ${cedo ? `${cedo.d.cenario}:${cedo.d.semente}, ${cedo.d.quebras[inv]!.primeira}` : '-'} |`);
  }
  p();
  if (base) {
    p(`## Comparação com a rodada de ${base.quando}`);
    p();
    p('| Dinastia | Primeira geração diferente | O que mudou nela |');
    p('|---|---|---|');
    for (const d of r.dinastias) {
      const b = base.dinastias.find((x) => x.cenario === d.cenario && x.semente === d.semente);
      if (!b) {
        p(`| ${d.cenario}:${d.semente} | - | não estava na outra rodada |`);
        continue;
      }
      let dif = '';
      let onde = 0;
      for (let i = 0; i < Math.max(d.geracoes.length, b.geracoes.length) && !onde; i++) {
        const x = d.geracoes[i];
        const y = b.geracoes[i];
        if (!x || !y) {
          onde = i + 1;
          dif = x ? 'a outra rodada acabou antes' : 'esta rodada acabou antes';
          break;
        }
        const mudou = COLUNAS.filter((col) => col.nome !== 'save (KB)' && col.de(x) !== col.de(y));
        if (mudou.length > 0) {
          onde = i + 1;
          dif = mudou.slice(0, 4).map((col) => `${col.nome}: ${f(col.de(y), col.casas)} → ${f(col.de(x), col.casas)}`).join('; ');
        }
      }
      p(`| ${d.cenario}:${d.semente} | ${onde || 'nenhuma'} | ${dif || 'igual em todas as métricas'} |`);
    }
    p();
    p('### Antes e depois, por geração (mediana das dinastias presentes nas duas rodadas)');
    p();
    p(`| Métrica | ${gs.map((g) => `g${g} antes | g${g} depois`).join(' | ')} |`);
    p(`|---|${gs.map(() => '---|---').join('|')}|`);
    for (const col of COLUNAS) {
      const celulas = gs.map((g) => {
        const pares = r.dinastias.map((d) => ({ x: d.geracoes[g - 1], y: base.dinastias.find((b) => b.cenario === d.cenario && b.semente === d.semente)?.geracoes[g - 1] })).filter((par) => par.x && par.y);
        if (pares.length === 0) return '- | -';
        return `${f(mediana(pares.map((par) => col.de(par.y!))), col.casas)} | ${f(mediana(pares.map((par) => col.de(par.x!))), col.casas)}`;
      });
      p(`| ${col.nome} | ${celulas.join(' | ')} |`);
    }
    p();
  }
  return linhas.join('\n');
}

// ---------------------------------------------------------------- a rodada

const reproduzir = texto('reproduzir');
if (reproduzir) {
  const [id, semente] = reproduzir.split(':');
  const cen = CENARIOS.find((x) => x.id === id);
  if (!cen || !semente) throw new Error(`--reproduzir=cenario:semente (cenários: ${CENARIOS.map((x) => x.id).join(', ')})`);
  const alvo = numero('geracao', GERACOES);
  const d = jogarDinastia(cen, Number(semente), alvo, alvo);
  console.log(`\n${d.cenario}:${d.semente}: ${d.fim}`);
  for (const [inv, q] of Object.entries(d.quebras)) console.log(`  ${inv}: ${q.n}× (a primeira: ${q.primeira})`);
} else {
  const escolhidos = texto('cenarios')?.split(',');
  const cenarios = escolhidos ? CENARIOS.filter((x) => escolhidos.includes(x.id)) : CENARIOS;
  const rodada: Rodada = { quando: new Date().toISOString().slice(0, 16), geracoes: GERACOES, dinastias: [] };
  for (const cen of cenarios) {
    for (let i = 0; i < SEMENTES; i++) {
      const d = jogarDinastia(cen, SEMENTE_BASE + 101 * i, GERACOES);
      rodada.dinastias.push(d);
      const u = d.geracoes.at(-1);
      console.log(`${d.cenario}:${d.semente}: ${d.fim}${u ? ` (${u.ano}; PIB ${f(u.pib)}, per capita ${f(u.pibPerCapita)}, patrimônio ${f(u.patrimonio)})` : ''}${Object.keys(d.quebras).length ? ` | quebrou: ${Object.keys(d.quebras).join(', ')}` : ''}`);
    }
  }
  const comparar = texto('comparar');
  const base = comparar ? (JSON.parse(readFileSync(comparar, 'utf8')) as Rodada) : undefined;
  const md = relatorio(rodada, base);
  const saida = texto('saida') ?? 'dist-dinastias.json';
  writeFileSync(saida, JSON.stringify(rodada));
  writeFileSync(texto('md') ?? 'dist-dinastias.md', md + '\n');
  console.log(`\n${md.split('\n').slice(md.split('\n').findIndex((l) => l.startsWith('## Invariantes'))).join('\n')}`);
  const quebrou = rodada.dinastias.some((d) => Object.keys(d.quebras).length > 0);
  if (ESTRITO && quebrou) process.exit(1);
}
