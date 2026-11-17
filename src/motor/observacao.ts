/**
 * O observador (etapa 03, I-194): o que quem joga fez, o que estava na mesa e o que mudou, ano a ano, sem mudar nada.
 *
 * Cada comando (o mesmo `aplicarComando` da gravação: passar o ano, agir, mexer no dinheiro, escolher) é lido antes e
 * depois: as opções do evento (as disponíveis e as que não estavam, com o motivo), a escolhida, o que o comando mexeu
 * (patrimônio, felicidade, influência, as entradas do livro e as áreas da vida que elas tocaram) e, quando o ano vira,
 * a foto da vida e do mundo. O observador só lê: não escreve no estado, não sorteia, não muda a ordem de nada (há
 * teste: a mesma vida, observada ou não, sai igual byte a byte).
 *
 * A observação vive fora do estado e fora do save. Para quem joga, ela é refeita pela gravação quando a vida acaba
 * (`observarGravacao`); sem gravação (o save de antes dela), sai do livro, com menos detalhe (`observarPeloLivro`).
 * Nenhum nome entra nela: só ids de storylets, de verbos e de operações, números e o ano.
 */
import { fichasUsadas } from './acoes.ts';
import { aplicarComando, type Comando, type Gravacao } from './caminho.ts';
import {
  donaDe,
  empresasDe,
  filhosVivos,
  indicadoresDoPais,
  parteNasEmpresas,
  parteQueCabe,
  patrimonioTotal,
  todasAsEmpresas,
  valorDosBens,
  valorDosTitulos,
} from './campos.ts';
import { ATIVOS, type Fase } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import type { Storylet } from './esquema.ts';
import { conquistasDaVida, esferas } from './influencia.ts';
import { lugarNoPais } from './lugar.ts';
import { fatiasDoGrupo } from './mundo-das-empresas.ts';
import { faseDe } from './pais.ts';
import { projetosAtivos, projetosPossiveis } from './projetos.ts';
import { fichasDoAno } from './regras.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from './robos.ts';
import type { Rng } from './rng.ts';
import { atoresPossiveis, elegivel } from './storylets.ts';
import type { Entrada, EstadoVida, MemoriaJogador } from './tipos.ts';
import { motivoParaNaoOperar } from './carteira.ts';
import { jaAgiu } from './acoes.ts';

export const VERSAO_DA_OBSERVACAO = 1;

/** De onde veio a vida observada: de quem joga (no aparelho dele) ou de um robô (a bancada, o observatório). */
export type Fonte = 'jogador' | 'robo';

/** As áreas da vida em que uma decisão mexe (pelo comando e pelo que mudou no livro). */
export const AREAS = [
  'evento',
  'estudo',
  'carreira',
  'corpo',
  'familia',
  'lazer',
  'dinheiro',
  'investimentos',
  'dividas',
  'bens',
  'empresa',
  'grupo',
  'politica',
  'diplomacia',
  'defesa',
  'coroa',
  'relacoes',
  'dinastia',
  'planos',
  'jogada',
  'filantropia',
] as const;
export type Area = (typeof AREAS)[number];

/** Um comando observado. */
export interface Registro {
  /** A ordem dentro da vida (0, 1, 2…). */
  n: number;
  ano: number;
  idade: number;
  tipo: 'escolha' | 'acao' | 'operacao' | 'ano';
  /** O storylet escolhido, `verbo:storylet` da ação, o tipo da operação ou `ano`. */
  ref: string;
  /** A área pelo comando (o verbo, a operação, o evento). */
  area: Area;
  /** As áreas que o comando mexeu de fato (pelas mudanças do livro). */
  areas: Area[];
  /** No evento: quantas opções havia, quantas estavam disponíveis, a escolhida e os motivos das indisponíveis. */
  opcoes?: { total: number; disponiveis: number; escolhida: number; motivos: string[] };
  /** Ao passar o ano: as fichas que sobraram sem uso. */
  fichasLivres?: number;
  /** O patrimônio antes do comando e o que ele mudou (reais de hoje), a felicidade e a influência. */
  antes: number;
  efeito: { patrimonio: number; felicidade: number; influencia: number; entradas: number };
  /** As refs das entradas novas (até seis): o que o comando fez acontecer. */
  refs: string[];
}

/** O mundo no ano. */
export interface FotoDoMundo {
  pib: number;
  populacao: number;
  pibPerCapita: number;
  crescimento: number;
  inflacao: number;
  desemprego: number;
  fase: Fase;
  governo: string;
}

/** O que poderia acontecer agora (I-197): os storylets elegíveis e o impacto deles diante do patrimônio. */
export interface Oportunidades {
  elegiveis: number;
  /** Elegíveis que mexem em 1% do patrimônio ou mais (pelo dinheiro ou por um fator sobre o que quem joga tem). */
  deEscala: number;
  /** O maior impacto relativo entre os elegíveis (fração do patrimônio). */
  maiorImpacto: number;
  /** Jogadas (as decisões de bilhões) elegíveis agora. */
  jogadas: number;
}

/** A foto do fim de um ano (a vida depois das regras do ano). */
export interface FotoDoAno {
  ano: number;
  idade: number;
  patrimonio: number;
  caixa: number;
  investido: number;
  titulos: number;
  bens: number;
  /** A parte de quem joga nas empresas. */
  empresas: number;
  divida: number;
  renda: number;
  custo: number;
  felicidade: number;
  saude: number;
  nEmpresas: number;
  nSubsidiarias: number;
  nHoldings: number;
  funcionarios: number;
  /** O valor adicionado do grupo em % do PIB (pais.peso_do_grupo). */
  pesoNoPib: number;
  /** A maior fatia do grupo num mercado do Brasil (0 a 1) e o tamanho da maior concorrente de fora do grupo diante da empresa do grupo no mesmo setor. */
  maiorFatia: number;
  maiorRival: number;
  infPessoal: number;
  infPolitica: number;
  infNegocios: number;
  cargo: string;
  coroa: boolean;
  regime: boolean;
  percentil: number;
  patrimonioSobrePib: number;
  filhos: number;
  lacosFortes: number;
  planos: number;
  sonhos: number;
  possiveis: number;
  conquistas: number;
  /** A parte do dinheiro aplicado que ainda rende (1 = o mercado comporta tudo). */
  mercadoCabe: number;
  /** As fichas do ano que acabou e as que sobraram. */
  fichas: number;
  fichasLivres: number;
  /** Os storylets que apareceram no ano e os que já tinham aparecido antes (nesta vida ou nas anteriores). */
  mostrados: number;
  repetidos: number;
  /** O que chegou a quem joga de outras pessoas desde a foto anterior (herança, fundo da família, presente): dinheiro que já era da família. */
  recebido: number;
  /** De onde veio o dinheiro que entrou na conta desde a foto anterior, por origem (`origemDoDinheiro`). */
  entradas: Partial<Record<OrigemDoDinheiro, number>>;
  oportunidades: Oportunidades;
  mundo: FotoDoMundo;
}

export interface FimDaVida {
  ano: number;
  idade: number;
  categoria: string;
  patrimonio: number;
  patrimonioSobrePib: number;
  percentil: number;
}

export interface VidaObservada {
  versao: number;
  fonte: Fonte;
  /** A partida (a família que começa numa vida e segue pelos herdeiros): um código sem dado pessoal. */
  partida: string;
  geracao: number;
  semente: number;
  /** O cenário e a estratégia, quando é robô. */
  cenario?: string;
  estrategia?: string;
  classeDeOrigem: number;
  nascimento: number;
  inicio: number;
  /** A observação viu cada comando (true) ou saiu só do livro, sem as opções e com uma foto só (false). */
  completa: boolean;
  /** A bancada continuou a família por um sobrinho (a dinastia acabaria aqui). */
  intervencao?: boolean;
  registros: Registro[];
  anos: FotoDoAno[];
  fim?: FimDaVida;
}

export interface Rotulo {
  fonte: Fonte;
  partida: string;
  cenario?: string;
  estrategia?: string;
  intervencao?: boolean;
}

// ---------------------------------------------------------------- as áreas que uma decisão mexe

const PAPEIS_DE_GENTE = /^(mae|pai|avo|amor|filho\d*|irmao\d*|amigo\d*|ex\d*|colega|chefe|rival|gestor|pet)\./;

/** A área de um caminho do livro ("empresa2.caixa" → empresa). */
export function areaDoCaminho(caminho: string): Area | null {
  if (/^(empresa\w*|unidade\w*|setor_\w+)\./.test(caminho)) return 'empresa';
  if (/^eu\.(acoes|renda_fixa|fii|dolar|cripto|perfil)$/.test(caminho) || /^tit\w*\./.test(caminho)) return 'investimentos';
  if (/^ctr\w*\./.test(caminho) || caminho === 'eu.divida' || caminho === 'eu.nome_sujo') return 'dividas';
  if (/^bem\w*\./.test(caminho)) return 'bens';
  if (/^(federacao|celeste|liga|pacto)\./.test(caminho)) return 'diplomacia';
  if (/^ilha\./.test(caminho) || /^eu\.(monarca|ditador|micronacao|coroa)$/.test(caminho) || caminho === 'pais.coroa') return 'coroa';
  // A popularidade é a imagem pública (mais de cem storylets do cotidiano mexem nela): não é poder.
  if (/^pais\.(pol_\w+|governo|impulso|regime)$/.test(caminho) || /^eu\.(cargo|mandato|voto_\w+|politico|ex_politico)$/.test(caminho)) return 'politica';
  if (/^pais\.(defesa|sistema_\w+)$/.test(caminho)) return 'defesa';
  if (PAPEIS_DE_GENTE.test(caminho) || /^prm\w*\./.test(caminho)) return 'relacoes';
  if (/^eu\.(carreira|nivel|ocupacao|fama|setor|renda)$/.test(caminho)) return 'carreira';
  if (/^eu\.(inteligencia|escolaridade|diploma\w*|faculdade\w*)$/.test(caminho)) return 'estudo';
  if (caminho === 'eu.saude') return 'corpo';
  if (/^eu\.(projeto_\w+|sonho\w*)$/.test(caminho)) return 'planos';
  if (/^eu\.(testamento\w*|lei_da_heranca)$/.test(caminho)) return 'dinastia';
  if (/^eu\.(dinheiro|custo|padrao)$/.test(caminho)) return 'dinheiro';
  return null;
}

const VERBO_AREA: Record<string, Area> = { estudar: 'estudo', trabalhar: 'carreira', saude: 'corpo', familia: 'familia', sair: 'lazer', poupar: 'dinheiro' };

/** Os storylets e as operações de doação (a fundação, a cura, a cozinha, o testamento para uma causa). */
const FILANTROPICO = /fundacao|cura_de_doenca|caridade|doa(r|cao)|hospital_da|cozinha_da|solidari/;

/** A área de uma operação da folha, pelo tipo dela. */
export function areaDaOperacao(tipo: string): Area {
  if (['aplicar', 'resgatar', 'perfil', 'comprarTitulo', 'venderTitulo', 'titulo'].includes(tipo)) return 'investimentos';
  if (tipo === 'padrao') return 'dinheiro';
  if (['quitar', 'renegociar', 'emprestimo', 'pagar'].includes(tipo)) return 'dividas';
  if (['comprar', 'venderBem', 'alugar', 'morar', 'bem'].includes(tipo)) return 'bens';
  if (tipo === 'candidatar') return 'carreira';
  if (['candidatarCargo', 'politica', 'lobby'].includes(tipo)) return 'politica';
  if (tipo === 'diplomacia') return 'diplomacia';
  if (['sistema', 'paz'].includes(tipo)) return 'defesa';
  if (tipo === 'coroa') return 'coroa';
  if (tipo === 'testamento') return 'dinastia';
  if (tipo === 'promissoria') return 'relacoes';
  if (tipo === 'projeto') return 'planos';
  if (tipo === 'jogada') return 'jogada';
  if (['criarHolding', 'paraAHolding', 'fundarSubsidiaria', 'aportarNaControlada', 'dividendosDaControlada', 'venderParticipacao', 'venderSubsidiaria', 'transferirCaixa', 'dupla', 'governanca'].includes(tipo)) return 'grupo';
  return 'empresa';
}

function areasDasEntradas(entradas: readonly Entrada[]): Area[] {
  const vistas = new Set<Area>();
  for (const h of entradas) {
    if (h.ref && FILANTROPICO.test(h.ref)) vistas.add('filantropia');
    for (const m of h.mudancas ?? []) {
      const a = areaDoCaminho(m.c);
      if (a) vistas.add(a);
    }
  }
  return [...vistas];
}

// ---------------------------------------------------------------- o que poderia acontecer

interface Escala {
  /** O maior dinheiro absoluto que uma opção mexe (reais de hoje). */
  dinheiro: number;
  /** O maior fator sobre o patrimônio, a parte nas empresas, a renda e a dívida (|fator − 1|). */
  patrimonio: number;
  empresa: number;
  renda: number;
  divida: number;
}

const ESCALAS = new WeakMap<Storylet, Escala>();

/** O tamanho dos efeitos de um storylet, lido uma vez do conteúdo (fora do estado). */
function escalaDe(s: Storylet): Escala {
  const pronta = ESCALAS.get(s);
  if (pronta) return pronta;
  const x: Escala = { dinheiro: 0, patrimonio: 0, empresa: 0, renda: 0, divida: 0 };
  const ver = (no: unknown): void => {
    if (!no || typeof no !== 'object') return;
    if (Array.isArray(no)) {
      for (const v of no) ver(v);
      return;
    }
    const o = no as Record<string, unknown>;
    const ef = o['efeitos'];
    if (ef && typeof ef === 'object') {
      const f = ef as Record<string, unknown>;
      const num = (k: string): number => (typeof f[k] === 'number' ? (f[k] as number) : 0);
      const dentro = (k: string, campo: string): number => {
        const v = f[k];
        return v && typeof v === 'object' && typeof (v as Record<string, unknown>)[campo] === 'number' ? ((v as Record<string, unknown>)[campo] as number) : 0;
      };
      x.dinheiro = Math.max(x.dinheiro, Math.abs(num('dinheiro')) + dentro('abrirEmpresa', 'capital') + dentro('comprarTitulo', 'valor') + Math.abs(num('divida')));
      if (num('patrimonioFator')) x.patrimonio = Math.max(x.patrimonio, Math.abs(num('patrimonioFator') - 1));
      if (num('empresaFator')) x.empresa = Math.max(x.empresa, Math.abs(num('empresaFator') - 1));
      if (num('rendaFator')) x.renda = Math.max(x.renda, Math.abs(num('rendaFator') - 1));
      if (num('dividaFator')) x.divida = Math.max(x.divida, Math.abs(num('dividaFator') - 1));
    }
    for (const [k, v] of Object.entries(o)) if (k !== 'efeitos' && typeof v === 'object') ver(v);
  };
  ver(s);
  ESCALAS.set(s, x);
  return x;
}

/** O impacto de um storylet diante do que quem joga tem agora (fração do patrimônio). */
export function impactoRelativo(s: Storylet, e: EstadoVida, patrimonio = patrimonioTotal(e)): number {
  const x = escalaDe(s);
  const base = Math.max(1, Math.abs(patrimonio));
  const eu = e.entidades['eu']?.n ?? {};
  return Math.max(
    x.dinheiro / base,
    x.patrimonio,
    (x.empresa * Math.max(0, parteNasEmpresas(e))) / base,
    (x.renda * 10 * Math.max(0, eu['renda'] ?? 0)) / base,
    (x.divida * Math.max(0, eu['divida'] ?? 0)) / base,
  );
}

/** O que o mundo oferece agora a quem joga, pelo que é elegível (não pelo que apareceu). */
export function oportunidadesDe(e: EstadoVida, c: Conteudo, patrimonio = patrimonioTotal(e)): Oportunidades {
  const o: Oportunidades = { elegiveis: 0, deEscala: 0, maiorImpacto: 0, jogadas: 0 };
  if (!e.vivo) return o;
  for (const s of c.storylets) {
    if (s.apenasAgendado) continue;
    const atores = atoresPossiveis(s, e);
    if (!atores.some((a) => elegivel(s, e, a))) continue;
    o.elegiveis++;
    if (s.tipo === 'jogada') o.jogadas++;
    const impacto = impactoRelativo(s, e, patrimonio);
    if (impacto >= 0.01) o.deEscala++;
    if (impacto > o.maiorImpacto) o.maiorImpacto = impacto;
  }
  return o;
}

// ---------------------------------------------------------------- a foto

function fotoDoMundo(e: EstadoVida): FotoDoMundo {
  const pais = e.entidades['pais'];
  const n = pais?.n ?? {};
  return {
    pib: n['pib'] ?? 0,
    populacao: n['populacao'] ?? 0,
    pibPerCapita: pais ? indicadoresDoPais(pais).pibPerCapita : 0,
    crescimento: n['crescimento'] ?? 0,
    inflacao: n['inflacao'] ?? 0,
    desemprego: n['desemprego'] ?? 0,
    fase: faseDe(e),
    governo: pais?.t['governo'] ?? '',
  };
}

/** A maior concorrente de fora do grupo diante da empresa do grupo do mesmo setor (0 sem empresa ou sem concorrente). */
function maiorRivalDe(e: EstadoVida): number {
  const grupo = empresasDe(e).filter((x) => !x.q['holding'] && !x.t['pais']);
  if (grupo.length === 0) return 0;
  const doGrupo = new Set(grupo.map((x) => x.id));
  let maior = 0;
  for (const outra of todasAsEmpresas(e)) {
    if (doGrupo.has(outra.id) || outra.vivo === false || outra.t['pais']) continue;
    const minha = grupo.filter((x) => x.t['setor'] === outra.t['setor']).reduce((s, x) => s + (x.n['demanda'] ?? 0), 0);
    if (minha > 0) maior = Math.max(maior, (outra.n['demanda'] ?? 0) / minha);
  }
  return maior;
}

/** A maior fatia do grupo num mercado do Brasil (0 a 1), pelo que a folha mostra (mundo-das-empresas.ts › fatiasDoGrupo). */
function maiorFatiaDe(e: EstadoVida, c: Conteudo): number {
  if (empresasDe(e).length === 0) return 0;
  let maior = 0;
  for (const f of fatiasDoGrupo(e, c)) for (const p of f.porPais) if (p.pais === 'brasil') maior = Math.max(maior, p.parte);
  return maior;
}

/** A foto da vida agora (só leitura). */
export function fotografar(e: EstadoVida, c: Conteudo, ano: { fichas: number; fichasLivres: number; mostrados: number; repetidos: number; recebido: number; entradas?: Partial<Record<OrigemDoDinheiro, number>> }): FotoDoAno {
  const eu = e.entidades['eu']!;
  const n = eu.n;
  const patrimonio = patrimonioTotal(e);
  const grupo = empresasDe(e);
  const esf = esferas(e, c);
  const pib = e.entidades['pais']?.n['pib'] ?? 0;
  const ativos = projetosAtivos(e, c);
  let lacos = 0;
  for (const en of Object.values(e.entidades)) if (en.tipo === 'pessoa' && en.id !== 'eu' && en.vivo !== false && (en.n['vinculo'] ?? 0) >= 70) lacos++;
  return {
    ano: e.ano,
    idade: e.idade,
    patrimonio,
    caixa: n['dinheiro'] ?? 0,
    investido: ATIVOS.reduce((s, a) => s + Math.max(0, n[a] ?? 0), 0),
    titulos: valorDosTitulos(e),
    bens: valorDosBens(e),
    empresas: parteNasEmpresas(e),
    divida: n['divida'] ?? 0,
    renda: n['renda'] ?? 0,
    custo: n['custo'] ?? 0,
    felicidade: n['felicidade'] ?? 0,
    saude: n['saude'] ?? 0,
    nEmpresas: grupo.length,
    nSubsidiarias: grupo.filter((x) => donaDe(x) !== 'eu').length,
    nHoldings: grupo.filter((x) => x.q['holding']).length,
    funcionarios: grupo.reduce((s, x) => s + (x.n['funcionarios'] ?? 0), 0),
    pesoNoPib: e.entidades['pais']?.n['peso_do_grupo'] ?? 0,
    maiorFatia: maiorFatiaDe(e, c),
    maiorRival: maiorRivalDe(e),
    infPessoal: esf.pessoal,
    infPolitica: esf.politica,
    infNegocios: esf.negocios,
    cargo: eu.t['cargo'] ?? '',
    coroa: Boolean(eu.q['monarca'] || eu.q['micronacao'] || eu.t['cargo'] === 'rei' || eu.t['cargo'] === 'soberano'),
    regime: Boolean(eu.q['ditador'] || e.entidades['pais']?.q['regime']),
    percentil: lugarNoPais(e, c).percentil,
    patrimonioSobrePib: pib > 0 ? patrimonio / pib : 0,
    filhos: filhosVivos(e).length,
    lacosFortes: lacos,
    planos: ativos.filter((p) => !p.def.sonho).length,
    sonhos: ativos.filter((p) => p.def.sonho).length,
    possiveis: e.vivo ? projetosPossiveis(e, c).length : 0,
    conquistas: conquistasDaVida(e).length,
    mercadoCabe: parteQueCabe(e),
    fichas: ano.fichas,
    fichasLivres: ano.fichasLivres,
    mostrados: ano.mostrados,
    repetidos: ano.repetidos,
    recebido: ano.recebido,
    entradas: ano.entradas ?? {},
    oportunidades: oportunidadesDe(e, c, patrimonio),
    mundo: fotoDoMundo(e),
  };
}

// ---------------------------------------------------------------- observar comando a comando

/** A observação em andamento: a vida observada e o que o ano aberto acumulou. */
export interface Observando {
  vida: VidaObservada;
  memoria?: MemoriaJogador | undefined;
  /** O ano aberto: os storylets que apareceram, os repetidos e o que chegou de outras pessoas. */
  mostrados: number;
  repetidos: number;
  recebido: number;
  entradas: Partial<Record<OrigemDoDinheiro, number>>;
}

/** De onde vem o dinheiro que entra na conta: as contas de fora, as pessoas, as empresas e os bens. */
export const ORIGENS_DO_DINHEIRO = ['mercado', 'tesouro', 'banco', 'pessoas', 'empresas', 'bens', 'outros'] as const;
export type OrigemDoDinheiro = (typeof ORIGENS_DO_DINHEIRO)[number];

export function origemDoDinheiro(e: EstadoVida, p: string): OrigemDoDinheiro {
  if (p === 'mercado' || p === 'tesouro' || p === 'banco') return p;
  if (p === 'parentes') return 'pessoas';
  const tipo = e.entidades[p]?.tipo;
  return tipo === 'pessoa' ? 'pessoas' : tipo === 'empresa' ? 'empresas' : tipo === 'bem' ? 'bens' : 'outros';
}

/** Soma, por origem, o dinheiro que entrou na conta de quem joga numa entrada (a reavaliação não é dinheiro entrando). */
function somarEntradas(soma: Partial<Record<OrigemDoDinheiro, number>>, e: EstadoVida, h: Entrada): void {
  for (const m of h.mudancas ?? []) {
    if (m.c !== 'eu.dinheiro' || m.p === undefined || m.p === 'reavaliacao' || (m.d ?? 0) <= 0) continue;
    const k = origemDoDinheiro(e, m.p);
    soma[k] = (soma[k] ?? 0) + m.d!;
  }
}

/**
 * O dinheiro que chegou a quem joga de outra pessoa numa entrada: a herança, o fundo da família, o presente. É dinheiro
 * que já existia na família: entra no patrimônio, mas não é o patrimônio crescendo pelo que quem joga fez com ele.
 */
export function recebidoNa(e: EstadoVida, h: Entrada): number {
  let soma = 0;
  for (const m of h.mudancas ?? []) {
    if (m.c !== 'eu.dinheiro' || m.p === undefined || (m.d ?? 0) <= 0) continue;
    if (e.entidades[m.p]?.tipo === 'pessoa') soma += m.d!;
  }
  return soma;
}

function primeiraVez(o: Observando, e: EstadoVida, h: Entrada): boolean {
  const inst = h.instancia;
  if (!inst) return true;
  const vezes = e.vistos[inst];
  if (vezes && vezes.filter((idade) => idade < h.idade).length > 0) return false;
  return !((o.memoria?.recencia[inst] ?? 0) > 0);
}

export function comecarObservacao(e: EstadoVida, c: Conteudo, rotulo: Rotulo, memoria?: MemoriaJogador): Observando {
  const eu = e.entidades['eu']!;
  const vida: VidaObservada = {
    versao: VERSAO_DA_OBSERVACAO,
    fonte: rotulo.fonte,
    partida: rotulo.partida,
    geracao: e.dinastia?.geracao ?? 1,
    semente: e.semente,
    ...(rotulo.cenario !== undefined ? { cenario: rotulo.cenario } : {}),
    ...(rotulo.estrategia !== undefined ? { estrategia: rotulo.estrategia } : {}),
    ...(rotulo.intervencao ? { intervencao: true } : {}),
    classeDeOrigem: eu.n['classe_origem'] ?? 0,
    nascimento: e.anoNascimento,
    inicio: e.ano,
    completa: true,
    registros: [],
    anos: [],
  };
  const o: Observando = { vida, memoria, mostrados: 0, repetidos: 0, recebido: 0, entradas: {} };
  vida.anos.push(fotografar(e, c, { fichas: 0, fichasLivres: 0, mostrados: 0, repetidos: 0, recebido: 0 }));
  return o;
}

function influenciaDe(e: EstadoVida): number {
  return e.entidades['eu']?.n['influencia'] ?? 0;
}

/** Aplica o comando como a interface aplica, lendo o antes e o depois. Não muda nada que `aplicarComando` não mudaria. */
export function observarComando(o: Observando, e: EstadoVida, c: Conteudo, memoria: MemoriaJogador, cmd: Comando): void {
  const anoAntes = e.ano;
  const idadeAntes = e.idade;
  const tamanho = e.historico.length;
  const patrimonio = patrimonioTotal(e);
  const felicidade = e.entidades['eu']?.n['felicidade'] ?? 0;
  const influencia = influenciaDe(e);
  const usadas = fichasUsadas(e);
  const pendente = e.pendente;
  const opcoes =
    cmd.t === 'escolher' && pendente
      ? {
          total: pendente.opcoes.length,
          disponiveis: pendente.opcoes.filter((x) => x.disponivel).length,
          escolhida: cmd.i,
          motivos: pendente.opcoes.filter((x) => !x.disponivel && x.motivo).map((x) => x.motivo!).slice(0, 4),
        }
      : undefined;
  const refDoEvento = pendente?.storylet;

  aplicarComando(e, c, memoria, cmd);

  const novas = e.historico.slice(tamanho);
  // O que o comando fez é o que ficou no ano dele; quando a última ficha passa o ano, as entradas do ano novo (o país, a
  // eleição, as empresas, a família) são do mundo, não da decisão.
  const doComando = novas.filter((h) => h.ano === anoAntes);
  for (const h of novas) {
    if ((h.tipo === 'evento' || h.tipo === 'npc') && h.instancia) {
      o.mostrados++;
      if (!primeiraVez(o, e, h)) o.repetidos++;
    }
    o.recebido += recebidoNa(e, h);
    somarEntradas(o.entradas, e, h);
  }
  const tipo = cmd.t === 'escolher' ? 'escolha' : cmd.t === 'agir' ? 'acao' : cmd.t === 'operar' ? 'operacao' : 'ano';
  const ref = cmd.t === 'escolher' ? (refDoEvento ?? '?') : cmd.t === 'agir' ? `${cmd.verbo}:${cmd.escolha?.id ?? ''}` : cmd.t === 'operar' ? cmd.op.tipo : 'ano';
  const area: Area = cmd.t === 'escolher' ? 'evento' : cmd.t === 'agir' ? (VERBO_AREA[cmd.verbo] ?? 'evento') : cmd.t === 'operar' ? areaDaOperacao(cmd.op.tipo) : 'evento';
  const registro: Registro = {
    n: o.vida.registros.length,
    ano: anoAntes,
    idade: idadeAntes,
    tipo,
    ref,
    area: cmd.t === 'operar' && cmd.op.tipo === 'testamento' && /causa|solid/.test(JSON.stringify(cmd.op)) ? 'filantropia' : area,
    areas: areasDasEntradas(doComando),
    antes: patrimonio,
    efeito: {
      patrimonio: patrimonioTotal(e) - patrimonio,
      felicidade: (e.entidades['eu']?.n['felicidade'] ?? 0) - felicidade,
      influencia: influenciaDe(e) - influencia,
      entradas: novas.length,
    },
    refs: doComando.map((h) => h.ref ?? h.tipo).slice(0, 6),
  };
  if (opcoes) registro.opcoes = opcoes;
  if (cmd.t === 'ano') registro.fichasLivres = Math.max(0, fichasDoAno(idadeAntes) - usadas);
  // Uma ficha que passou o ano (a última) também conta o ano.
  if (e.ano !== anoAntes || !e.vivo) {
    const fichas = fichasDoAno(idadeAntes);
    const livres = cmd.t === 'ano' ? Math.max(0, fichas - usadas) : 0;
    o.vida.anos.push(fotografar(e, c, { fichas, fichasLivres: livres, mostrados: o.mostrados, repetidos: o.repetidos, recebido: o.recebido, entradas: o.entradas }));
    o.mostrados = 0;
    o.repetidos = 0;
    o.recebido = 0;
    o.entradas = {};
  }
  o.vida.registros.push(registro);
  if (!e.vivo) terminar(o, e);
}

function terminar(o: Observando, e: EstadoVida): void {
  if (o.vida.fim) return;
  const ultima = o.vida.anos.at(-1);
  o.vida.fim = {
    ano: e.ano,
    idade: e.idade,
    categoria: e.morte?.categoria ?? '',
    patrimonio: ultima?.patrimonio ?? patrimonioTotal(e),
    patrimonioSobrePib: ultima?.patrimonioSobrePib ?? 0,
    percentil: ultima?.percentil ?? 0,
  };
}

export function terminarObservacao(o: Observando, e: EstadoVida): VidaObservada {
  if (!e.vivo) terminar(o, e);
  return o.vida;
}

// ---------------------------------------------------------------- as três maneiras de observar

/** Refaz a vida gravada observando cada comando. A vida refeita é devolvida para quem quiser conferir que saiu igual. */
export function observarGravacao(c: Conteudo, g: Gravacao, rotulo: Rotulo): { vida: VidaObservada; estado: EstadoVida } {
  const e = structuredClone(g.inicio);
  const o = comecarObservacao(e, c, rotulo, g.memoria);
  for (const cmd of g.comandos) observarComando(o, e, c, g.memoria, cmd);
  return { vida: terminarObservacao(o, e), estado: e };
}

/**
 * Sem gravação (o save de antes dela, ou a vida refeita que não sai igual): a observação sai do livro. As decisões
 * vêm das entradas de escolha, ação e dinheiro (sem as opções que estavam na mesa), e a foto é uma só, a de agora.
 */
export function observarPeloLivro(e: EstadoVida, c: Conteudo, rotulo: Rotulo): VidaObservada {
  const eu = e.entidades['eu']!;
  const registros: Registro[] = [];
  for (const h of e.historico) {
    const escolha = h.escolha !== undefined;
    if (!escolha && h.tipo !== 'acao' && h.tipo !== 'dinheiro') continue;
    const tipo = escolha ? 'escolha' : h.tipo === 'acao' ? 'acao' : 'operacao';
    registros.push({
      n: registros.length,
      ano: h.ano,
      idade: h.idade,
      tipo,
      ref: h.ref ?? h.tipo,
      area: tipo === 'escolha' ? 'evento' : tipo === 'acao' ? 'evento' : 'dinheiro',
      areas: areasDasEntradas([h]),
      antes: 0,
      efeito: { patrimonio: 0, felicidade: 0, influencia: 0, entradas: 1 },
      refs: [h.ref ?? h.tipo],
      ...(escolha ? { opcoes: { total: 0, disponiveis: 0, escolhida: h.escolha!.indice, motivos: [] } } : {}),
    });
  }
  const vida: VidaObservada = {
    versao: VERSAO_DA_OBSERVACAO,
    fonte: rotulo.fonte,
    partida: rotulo.partida,
    geracao: e.dinastia?.geracao ?? 1,
    semente: e.semente,
    classeDeOrigem: eu.n['classe_origem'] ?? 0,
    nascimento: e.anoNascimento,
    inicio: e.historico[0]?.ano ?? e.ano,
    completa: false,
    registros,
    anos: [fotografar(e, c, { fichas: 0, fichasLivres: 0, mostrados: 0, repetidos: 0, recebido: e.historico.reduce((t, h) => t + recebidoNa(e, h), 0) })],
  };
  if (!e.vivo) {
    const ultima = vida.anos[0]!;
    vida.fim = { ano: e.ano, idade: e.idade, categoria: e.morte?.categoria ?? '', patrimonio: ultima.patrimonio, patrimonioSobrePib: ultima.patrimonioSobrePib, percentil: ultima.percentil };
  }
  return vida;
}

/**
 * Um robô joga uma vida inteira, como o túnel joga (escolhe, mexe no dinheiro, gasta as fichas e passa o ano), mas por
 * comandos, observado. Os comandos ficam numa gravação, que refaz a vida igual.
 */
export function jogarObservando(
  c: Conteudo,
  e: EstadoVida,
  estrategia: Estrategia,
  robo: Rng,
  memoria: MemoriaJogador,
  rotulo: Rotulo,
): { vida: VidaObservada; comandos: Comando[] } {
  const o = comecarObservacao(e, c, rotulo, memoria);
  const comandos: Comando[] = [];
  const fazer = (cmd: Comando): void => {
    comandos.push(cmd);
    observarComando(o, e, c, memoria, cmd);
  };
  for (let passos = 0; e.vivo && passos < 20_000; passos++) {
    if (e.pendente) {
      fazer({ t: 'escolher', i: decidir(estrategia, e, c, robo), entrada: e.proximoId });
      continue;
    }
    for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) fazer({ t: 'operar', op });
    let agiu = false;
    for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) || agiu ? null : decidirAcao(estrategia, e, c, robo)) {
      const anoAntes = e.ano;
      fazer({ t: 'agir', verbo: a.verbo, ...(a.escolha ? { escolha: a.escolha } : {}) });
      // A última ficha já passou o ano (aplicarComando faz como a interface).
      if (e.ano !== anoAntes) agiu = true;
    }
    if (e.vivo && !e.pendente && !agiu) fazer({ t: 'ano' });
  }
  return { vida: terminarObservacao(o, e), comandos };
}
