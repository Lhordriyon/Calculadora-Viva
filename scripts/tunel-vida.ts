/**
 * Uma vida do túnel e as tarefas que um trabalhador roda (scripts/tunel-trabalhador.ts): o jogador com as 20 vidas
 * seguidas, a vida de origem escolhida e a dinastia. Cada tarefa depende só da semente: o resultado é o mesmo rodando
 * aqui ou num trabalhador, e o túnel junta tudo na ordem das tarefas.
 */
import { classeDoPatrimonio, empresasDe, filhosDe, filhosVivos, indicadoresDoPais, nomeDaClasse, patrimonioTotal } from '../src/motor/campos.ts';
import type { Conteudo } from '../src/motor/conteudo.ts';
import { CHAVES_CONDICAO, type Condicoes } from '../src/motor/esquema.ts';
import { ESTATISTICAS, faseDe, governoAtual, type Estatistica } from '../src/motor/pais.ts';
import { ATIVOS, type Fase } from '../src/motor/constantes.ts';
import { motivoParaNaoOperar, operar, perfilDe } from '../src/motor/carteira.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import type { EscolhaOrigem } from '../src/motor/origem.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { lembrarVida, novaMemoria } from '../src/motor/memoria.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from '../src/motor/robos.ts';
import { aleatorio, criarRng, misturar, type Rng } from '../src/motor/rng.ts';
import type { Entrada, EstadoVida, MemoriaJogador } from '../src/motor/tipos.ts';
import { agir, avancarAno, escolher, nascer, observarOAno } from '../src/motor/vida.ts';
import { pontosDeVirada, porqueDe } from '../src/motor/virada.ts';
import { alvoDaTracao, cargaDaMesa, empresaDe } from '../src/motor/empresa.ts';
import { parceirosDe } from '../src/motor/diplomacia.ts';
import { conferirContas, conferirContratos, conferirDividas, extrato, garantiasDosContratos } from '../src/motor/contas.ts';

export const ANO = 2026;

// ---------------------------------------------------------------- uma vida

export interface Jogada {
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
  /** O grupo de empresas ano a ano (o que os portões do incremento 9 contam). */
  grupo: GrupoDaVida;
  /** O mundo lá fora ano a ano (o que os portões do incremento 10 contam). */
  fora: ForaDaVida;
}

/** O mundo lá fora visto por uma vida. */
export interface ForaDaVida {
  /** O dólar no fim de cada ano (R$ de hoje). */
  cambios: number[];
  /** Por ano: [quanto o dólar andou (fração), a inflação do ano (%)]. */
  repasse: [number, number][];
  /** Por empresa e ano: [setor, crescimento do valor, quanto o dólar andou]. */
  setores: [string, number, number][];
  /** Por governo: anos e as sanções e os acordos que começaram (os da Celeste à parte: a rival dela é a Federação). */
  porGoverno: Record<string, { anos: number; sancoes: number; acordos: number; sancoesDaCeleste: number }>;
}

/** Sanção e acordo de cada país de fora (para ver o que começou no ano). */
function fotoDosParceiros(e: EstadoVida): Map<string, { sancao: boolean; acordo: boolean }> {
  return new Map(parceirosDe(e).map((p) => [p.id, { sancao: Boolean(p.q['sancao']), acordo: Boolean(p.q['acordo']) }]));
}

/** Anota o ano do mundo lá fora na vida (depois do +1 ano): o dólar, a inflação, as empresas por setor e o que começou sob cada governo. */
function anotarFora(
  e: EstadoVida,
  cambioAntes: number,
  empresasAntes: Map<string, { nome: string; valor: number }>,
  parceirosAntes: Map<string, { sancao: boolean; acordo: boolean }>,
  f: ForaDaVida,
): void {
  const pais = e.entidades['pais']!;
  const cambio = pais.n['cambio'] ?? cambioAntes;
  const variacao = cambioAntes > 0 ? cambio / cambioAntes - 1 : 0;
  f.cambios.push(cambio);
  f.repasse.push([variacao, pais.n['inflacao'] ?? 0]);
  for (const emp of empresasDe(e)) {
    const a = empresasAntes.get(emp.id);
    if (a && a.nome === emp.nome && a.valor >= 1e5) f.setores.push([emp.t['setor'] ?? '', (emp.n['lucro'] ?? 0) / a.valor, variacao]);
  }
  const g = (f.porGoverno[governoAtual(e)] ??= { anos: 0, sancoes: 0, acordos: 0, sancoesDaCeleste: 0 });
  g.anos++;
  for (const p of parceirosDe(e)) {
    const x = parceirosAntes.get(p.id);
    if (p.q['sancao'] && !x?.sancao) {
      g.sancoes++;
      if (p.id === 'celeste') g.sancoesDaCeleste++;
    }
    if (p.q['acordo'] && !x?.acordo) g.acordos++;
  }
}

/** O grupo de empresas visto por uma vida. */
export interface GrupoDaVida {
  /** O máximo de empresas de uma vez e de subsidiárias somadas. */
  maxEmpresas: number;
  maxSubsidiarias: number;
  anosEmGrupo: number;
  /** Por empresa e ano: [crescimento, humor da bolsa] (o que a bolsa rendeu além do esperado para a fase), na bolsa e fora dela. */
  listadas: [number, number][];
  fechadas: [number, number][];
  /** Pontos de tração que a mesa tirou de cada empresa, nos anos em que várias dependiam de quem manda (carga > 1,2) e ele tinha talento (inteligência ≥ 65). */
  mesa: number[];
}

/** As empresas antes do +1 ano: lugar, nome e valor (para o crescimento do ano). */
function fotoDoGrupo(e: EstadoVida): Map<string, { nome: string; valor: number }> {
  return new Map(empresasDe(e).map((x) => [x.id, { nome: x.nome, valor: x.n['valor'] ?? 0 }]));
}

/** Anota o ano do grupo na vida (depois do +1 ano). */
function anotarGrupo(e: EstadoVida, c: Conteudo, antes: Map<string, { nome: string; valor: number }>, g: GrupoDaVida): void {
  const grupo = empresasDe(e);
  if (grupo.length === 0) return;
  g.maxEmpresas = Math.max(g.maxEmpresas, grupo.length);
  g.maxSubsidiarias = Math.max(g.maxSubsidiarias, grupo.reduce((s, x) => s + (x.n['subsidiarias'] ?? 0), 0));
  if (grupo.length >= 2) g.anosEmGrupo++;
  const acoes = c.mundo.ativos.find((a) => a.id === 'acoes')!;
  const humor = (e.entidades['pais']!.n['ret_acoes'] ?? 0) / 100 - acoes.retorno[faseDe(e)];
  const carga = cargaDaMesa(e);
  const talento = (e.entidades['eu']!.n['inteligencia'] ?? 50) >= 65;
  for (const emp of grupo) {
    const a = antes.get(emp.id);
    if (a && a.nome === emp.nome && a.valor >= 1e5) (emp.q['na_bolsa'] ? g.listadas : g.fechadas).push([(emp.n['lucro'] ?? 0) / a.valor, humor]);
    if (carga > 1.2 && talento) g.mesa.push(alvoDaTracao(e, c, emp, 1) - alvoDaTracao(e, c, emp, carga));
  }
}

/** O país visto por uma vida: as estatísticas por governo, o trabalho pelo desemprego e o governo de quem joga. */
export interface PaisDaVida {
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
export function viver(c: Conteudo, e: EstadoVida, estrategia: Estrategia, robo: Rng, memoria: MemoriaJogador | undefined): Omit<Jogada, 'e' | 'ms' | 'riquezaOrigem'> {
  let toques = 0;
  let operacoes = 0;
  const anosPorFase: Record<Fase, number> = { normal: 0, expansao: 0, recessao: 0, crise: 0 };
  const pais: PaisDaVida = { porGoverno: {}, anosDeTrabalho: [], governo: null };
  const grupo: GrupoDaVida = { maxEmpresas: 0, maxSubsidiarias: 0, anosEmGrupo: 0, listadas: [], fechadas: [], mesa: [] };
  const fora: ForaDaVida = { cambios: [], repasse: [], setores: [], porGoverno: {} };
  let cambioAntes = e.entidades['pais']?.n['cambio'] ?? 0;
  let parceirosAntes = fotoDosParceiros(e);
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
      const antes = fotoDoGrupo(e);
      avancarAno(e, c, memoria);
      anosPorFase[faseDe(e)]++;
      anotarPais(e, pais);
      if (e.vivo) anotarGrupo(e, c, antes, grupo);
      anotarFora(e, cambioAntes, antes, parceirosAntes, fora);
      cambioAntes = e.entidades['pais']?.n['cambio'] ?? cambioAntes;
      parceirosAntes = fotoDosParceiros(e);
    }
  }
  return { toques, anosPorFase, operacoes, pais, grupo, fora };
}

export function jogar(c: Conteudo, estrategia: Estrategia, semente: number, memoria: MemoriaJogador | undefined, origem?: EscolhaOrigem): Jogada {
  const t0 = performance.now();
  const e = nascer(c, { semente, ano: ANO, ...(origem ? { origem } : {}) });
  const riquezaOrigem = (e.entidades['mae']?.n['dinheiro'] ?? 0) + (e.entidades['pai']?.n['dinheiro'] ?? 0);
  const r = viver(c, e, estrategia, criarRng(misturar(semente, 77)), memoria);
  return { e, toques: r.toques + 1, ms: performance.now() - t0, riquezaOrigem, anosPorFase: r.anosPorFase, operacoes: r.operacoes, pais: r.pais, grupo: r.grupo, fora: r.fora };
}

// ---------------------------------------------------------------- medidas de uma vida

/** Storylets que o mundo apresentou (diretor e personagens). Ações do jogador e narrativas de regra não contam. */
export function apresentados(e: EstadoVida): Entrada[] {
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

export interface Vida {
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
  /** Filhos que a vida teve (eu.filhos) e os que estão no estado: iguais quando nenhum filho apagou outro (fatia 1.4a). */
  filhos: number;
  filhosNoEstado: number;
  /** Quem herdaria tem irmãos vivos (a herança se divide entre eles). */
  herdeiroComIrmaos: boolean;
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
  /** O grupo de empresas: o que a vida viu ano a ano, as fusões e as estreias na bolsa. */
  grupo: GrupoDaVida;
  fusoes: number;
  bolsas: number;
  /** O mundo lá fora: o que a vida viu ano a ano, as viradas do ciclo para pior (e quantas a crise de fora causou), as sanções (anos até acabar, ou null se a vida acabou antes, com os anos vistos) e os atos de quem governa. */
  fora: ForaDaVida;
  viradasRuins: number;
  viradasDeFora: number;
  sancoes: { anos: number | null; vistos: number; comCausa: boolean }[];
  acordos: number;
  atos: number;
  /** O país em números no fim da vida: IDH, desigualdade, população e PIB per capita (reais de hoje). */
  numeros: { idh: number; gini: number; populacao: number; pibPerCapita: number };
  /** A primeira infância: a sequência de histórias até os 6 anos (com a escolha), as decisões antes dos 5 e se algo dos 5 aos 12 teve causa nos anos até os 4. */
  comeco: string;
  decisoesAntesDos5: number;
  infanciaVoltou: boolean;
  /** Toda transferência tem dois lados: problemas de contas (devem ser zero), entradas conferidas e o extrato da vida por fluxo e contraparte. */
  contasErradas: number;
  entradasConferidas: number;
  exemploDeConta: string;
  extrato: { rotulo: string; contraparte: string; valor: number }[];
  /** A dívida como contrato (fatia 1.2): problemas da conferência (devem ser zero) e a história das dívidas da vida. */
  dividasErradas: number;
  exemploDeDivida: string;
  dividas: HistoriaDasDividas;
  /** O Tesouro (bloco B): os títulos de quem joga e os calotes que a vida viu. */
  tesouro: HistoriaDoTesouro;
}

export interface HistoriaDoTesouro {
  compras: number;
  vendas: number;
  vendasComLucro: number;
  vencimentos: number;
  /** O que o cupom pôs na conta na vida inteira (reais de hoje). */
  cupons: number;
  /** Os calotes que a vida viu, quanto quem joga perdeu neles e se perdeu algo fora dos títulos e da renda fixa (nunca). */
  calotes: number;
  perdaNoCalote: number;
  perdeuSemTer: boolean;
}

/** O Tesouro pelo livro: compras, vendas (com lucro), vencimentos, cupons e o que cada calote levou de quem joga. */
function tesouroDaVida(e: EstadoVida): HistoriaDoTesouro {
  const t: HistoriaDoTesouro = { compras: 0, vendas: 0, vendasComLucro: 0, vencimentos: 0, cupons: 0, calotes: 0, perdaNoCalote: 0, perdeuSemTer: false };
  for (const h of e.historico) {
    if (h.ref === 'tesouro:comprarTitulo') t.compras++;
    if (h.ref === 'tesouro:venderTitulo') {
      t.vendas++;
      if (h.resumo?.endsWith('com lucro')) t.vendasComLucro++;
    }
    if (h.ref === 'tesouro:vencimento') t.vencimentos++;
    if (h.ref === 'tesouro:calote') t.calotes++;
    for (const m of h.mudancas ?? []) {
      if (m.c === 'eu.dinheiro' && m.r === 'cupom') t.cupons += m.d ?? 0;
      if (h.ref !== 'tesouro:calote' || m.d === undefined) continue;
      if (/^tit\w*\.valor$/.test(m.c) || m.c === 'eu.renda_fixa') t.perdaNoCalote -= m.d;
      else if (m.c.startsWith('eu.')) t.perdeuSemTer = true;
    }
  }
  return t;
}

export interface HistoriaDasDividas {
  financiou: boolean;
  /** O nome sujou alguma vez, e por quantos anos ao todo. */
  sujo: boolean;
  anosSujo: number;
  acordo: boolean;
  caducou: boolean;
  leilao: boolean;
  limpou: boolean;
  /** Cada vez que o nome sujou: quantos anos durou, se houve acordo no meio e se veio do financiamento (a causa é a compra). */
  episodios: { anos: number; acordo: boolean; financiamento: boolean }[];
}

/** A história das dívidas pelo livro: financiamento, nome sujo (cada episódio e os anos com ele), acordo, caducar, leilão. */
function dividasDaVida(e: EstadoVida): HistoriaDasDividas {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const episodios: HistoriaDasDividas['episodios'] = [];
  let atual: { desde: number; acordo: boolean; financiamento: boolean } | null = null;
  let financiou = false;
  let acordo = false;
  for (const h of e.historico) {
    for (const m of h.mudancas ?? []) {
      if (m.c === 'eu.nome_sujo' && m.q === 1) atual = { desde: h.idade, acordo: false, financiamento: porId.get(h.causas?.[0] ?? -1)?.ref === 'bens:comprar' };
      if (m.c === 'eu.nome_sujo' && m.q === -1 && atual) {
        episodios.push({ anos: h.idade - atual.desde, acordo: atual.acordo, financiamento: atual.financiamento });
        atual = null;
      }
      if (m.t !== undefined && /^ctr\w*\.modalidade$/.test(m.c)) {
        if (m.t === 'financiamento') financiou = true;
        if (m.t === 'acordo') {
          acordo = true;
          if (atual) atual.acordo = true;
        }
      }
    }
  }
  if (atual) episodios.push({ anos: e.idade - atual.desde, acordo: atual.acordo, financiamento: atual.financiamento });
  const tem = (ref: string): boolean => e.historico.some((h) => h.ref === ref);
  return {
    financiou,
    sujo: tem('divida:nome_sujo'),
    anosSujo: episodios.reduce((s, x) => s + x.anos, 0),
    acordo,
    caducou: tem('divida:caducou'),
    leilao: tem('divida:leilao'),
    limpou: tem('divida:nome_limpo'),
    episodios,
  };
}

/** As jogadas da vida (ids dos storylets) e quantas foram causa de um evento ou iniciativa depois. */
export function jogadasDaVida(e: EstadoVida): { jogadas: string[]; comReacao: number } {
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

const ORDEM_DA_FASE: Record<string, number> = { crise: 0, recessao: 1, normal: 2, expansao: 3 };

/** As viradas do ciclo para pior (para recessão ou crise) e quantas apontam a crise de um país de fora como causa. */
function viradasDoCiclo(e: EstadoVida, porId: Map<number, Entrada>): { viradasRuins: number; viradasDeFora: number } {
  let antes = 'normal';
  let viradasRuins = 0;
  let viradasDeFora = 0;
  for (const h of e.historico) {
    if (!h.ref?.startsWith('ciclo:')) continue;
    const nova = h.ref.slice('ciclo:'.length);
    if ((ORDEM_DA_FASE[nova] ?? 2) < (ORDEM_DA_FASE[antes] ?? 2) && (nova === 'recessao' || nova === 'crise')) {
      viradasRuins++;
      if ((h.causas ?? []).some((id) => porId.get(id)?.ref?.startsWith('exterior:crise:'))) viradasDeFora++;
    }
    antes = nova;
  }
  return { viradasRuins, viradasDeFora };
}

/** As sanções que a vida viu: quantos anos duraram (null se a vida acabou antes), quantos anos ela viu e se apontam a decisão que esfriou a relação. */
function sancoesDaVida(e: EstadoVida): Vida['sancoes'] {
  const saida: Vida['sancoes'] = [];
  for (const h of e.historico) {
    if (!h.ref?.startsWith('exterior:sancao:')) continue;
    const quem = h.ref.slice('exterior:sancao:'.length);
    const fim = e.historico.find((x) => x.id > h.id && x.ref === `exterior:fimDaSancao:${quem}`);
    saida.push({ anos: fim ? fim.ano - h.ano : null, vistos: (fim?.ano ?? e.ano) - h.ano, comCausa: (h.causas?.length ?? 0) > 0 });
  }
  return saida;
}

export function medir(c: Conteudo, j: Jogada, estrategia: Estrategia): Vida {
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
  const pontos = pontosDeVirada(e, c);
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
    filhos: e.entidades['eu']!.n['filhos'] ?? 0,
    filhosNoEstado: filhosDe(e).length,
    herdeiroComIrmaos: herdeiroPossivel(e, c)?.parentesco === 'filho' && filhosVivos(e).length > 1,
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
    fora: j.fora,
    ...viradasDoCiclo(e, porId),
    sancoes: sancoesDaVida(e),
    acordos: e.historico.filter((h) => h.ref?.startsWith('exterior:acordo:') || (h.ref === 'pais:diplomacia' && h.mudancas?.some((m) => m.c.endsWith('.acordo') && m.q === 1))).length,
    atos: e.historico.filter((h) => h.ref === 'pais:diplomacia').length,
    numeros: (() => {
      const p = e.entidades['pais']!;
      const i = indicadoresDoPais(p);
      return { idh: i.idh, gini: i.gini, populacao: p.n['populacao'] ?? 0, pibPerCapita: i.pibPerCapita };
    })(),
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
    fundou: e.historico.some((h) => h.ref !== 'empresa:cuidar' && h.mudancas?.some((m) => /^empresa\d*\.fundada$/.test(m.c) && m.q === 1)),
    grupo: j.grupo,
    fusoes: e.historico.filter((h) => h.ref === 'empresa:fundir').length,
    bolsas: e.historico.filter((h) => h.ref === 'empresa:abrirCapital' || (h.ref === 'abrir_capital' && h.escolha?.indice === 0)).length,
    quebrou: e.historico.some((h) => QUEBRAS.has(h.ref ?? '') && h.mudancas?.some((m) => m.c === 'empresa.fundada' && m.q === -1)),
    vendeu: 'vendeu_empresa' in q,
    tesouro: tesouroDaVida(e),
    ...contasDaVida(e),
  };
}

/**
 * As contas da vida: quantos problemas a conferência acha (entrada por entrada: o dinheiro com contraparte, e a dívida
 * de quem joga e o financiado dos bens batendo com os contratos; no fim, o estado das dívidas) e o extrato da vida.
 */
export function contasDaVida(e: EstadoVida): Pick<Vida, 'contasErradas' | 'entradasConferidas' | 'exemploDeConta' | 'extrato' | 'dividasErradas' | 'exemploDeDivida' | 'dividas'> {
  let contasErradas = 0;
  let exemploDeConta = '';
  let dividasErradas = 0;
  let exemploDeDivida = '';
  const garantias = garantiasDosContratos(e);
  for (const h of e.historico) {
    const problemas = conferirContas(e, h);
    if (problemas.length > 0 && !exemploDeConta) exemploDeConta = `semente ${e.semente}, aos ${h.idade}, ${h.tipo} ${h.ref ?? ''}: ${problemas[0]}`;
    contasErradas += problemas.length;
    const dasDividas = conferirContratos(h, garantias);
    if (dasDividas.length > 0 && !exemploDeDivida) exemploDeDivida = `semente ${e.semente}, aos ${h.idade}, ${h.tipo} ${h.ref ?? ''}: ${dasDividas[0]}`;
    dividasErradas += dasDividas.length;
  }
  const noFim = conferirDividas(e);
  if (noFim.length > 0 && !exemploDeDivida) exemploDeDivida = `semente ${e.semente}, no fim: ${noFim[0]}`;
  dividasErradas += noFim.length;
  return { contasErradas, entradasConferidas: e.historico.length, exemploDeConta, extrato: extrato(e).linhas, dividasErradas, exemploDeDivida, dividas: dividasDaVida(e) };
}

// ---------------------------------------------------------------- as tarefas

export interface Geracao {
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

export type Tarefa =
  /** Um jogador: vidas seguidas com a mesma memória (ou sem ela, para medir o efeito da memória). */
  | { tipo: 'jogador'; semente: number; estrategia: Estrategia; idEstrategia: number; jogador: number; vidas: number; usarMemoria: boolean; guardar: boolean; livro: boolean }
  /** Uma vida de origem escolhida (classe, linhagem, fortuna). */
  | { tipo: 'origem'; semente: number; estrategia: Estrategia; origem: EscolhaOrigem }
  /** Uma dinastia: a vida e as dos herdeiros, até `geracoes`. */
  | { tipo: 'dinastia'; semente: number; estrategia: Estrategia; geracoes: number };

export interface DoJogador {
  tipo: 'jogador';
  /** As vidas medidas (só quando a tarefa guarda). */
  vidas: Vida[];
  seq: string[][];
  seqRegras: string[][];
  /** Por vida: a parte dos textos já vistos nas vidas anteriores deste jogador (null quando não conta). */
  textos: (number | null)[];
  saves: { total: number; livro: number }[];
  /** O livro foi medido etapa por etapa (o medidor pesa no tempo dessas vidas: a CPU por vida sai das outras). */
  medido: boolean;
  /** CPU (ms) e bytes no livro de cada etapa do ano, nas vidas guardadas. */
  cpu: Record<string, number>;
  bytes: Record<string, number>;
}
export interface DaOrigem {
  tipo: 'origem';
  vida: Vida;
}
export interface DaDinastia {
  tipo: 'dinastia';
  geracoes: Geracao[];
  pares: [number, number][];
  tamanho: number;
  dividasErradas: number;
  entradasConferidas: number;
  exemploDeDivida: string;
}
export type Resultado = DoJogador | DaOrigem | DaDinastia;

/** O custo de cada etapa do ano (fatia 1.3): a CPU, e o que cada uma deixa no livro quando `bytes` mede. */
function medirEtapas(medirBytes: boolean): { cpu: Record<string, number>; bytes: Record<string, number> } {
  const cpu: Record<string, number> = {};
  const bytes: Record<string, number> = {};
  let relogio = 0;
  let regAntes = 0;
  let livroAntes = 0;
  observarOAno({
    antes(_etapa, e, reg) {
      if (medirBytes) {
        regAntes = reg.length;
        livroAntes = e.historico.length;
      }
      relogio = performance.now();
    },
    depois(etapa, e, reg) {
      cpu[etapa] = (cpu[etapa] ?? 0) + performance.now() - relogio;
      if (!medirBytes) return;
      // As regras miúdas vão para a entrada invisível do ano, que já foi contada etapa por etapa pelo registro.
      let b = reg.length > regAntes ? JSON.stringify(reg.slice(regAntes)).length : 0;
      for (const h of e.historico.slice(livroAntes)) if (h.ref !== 'ano') b += JSON.stringify(h).length;
      bytes[etapa] = (bytes[etapa] ?? 0) + b;
    },
  });
  return { cpu, bytes };
}

function rodarJogador(c: Conteudo, t: Extract<Tarefa, { tipo: 'jogador' }>): DoJogador {
  // A CPU de cada etapa nas vidas guardadas; o livro, quando a tarefa pede.
  const medirBytes = t.guardar && t.livro;
  const etapas = t.guardar ? medirEtapas(medirBytes) : { cpu: {}, bytes: {} };
  const r: DoJogador = { tipo: 'jogador', vidas: [], seq: [], seqRegras: [], textos: [], saves: [], medido: medirBytes, ...etapas };
  let memoria = novaMemoria();
  const textosVistos = new Set<string>();
  try {
    for (let k = 0; k < t.vidas; k++) {
      const j = jogar(c, t.estrategia, misturar(t.semente, t.idEstrategia, t.jogador, k), t.usarMemoria ? memoria : undefined);
      if (medirBytes) r.saves.push({ total: JSON.stringify(j.e).length, livro: JSON.stringify(j.e.historico).length });
      const vida = medir(c, j, t.estrategia);
      r.seq.push(vida.instancias);
      r.seqRegras.push(vida.comRegras);
      r.textos.push(null);
      if (t.guardar) {
        r.vidas.push(vida);
        if (k > 0 && vida.textos.length > 0) r.textos[k] = vida.textos.filter((x) => textosVistos.has(x)).length / vida.textos.length;
        for (const x of vida.textos) textosVistos.add(x);
      }
      memoria = lembrarVida(memoria, j.e);
    }
  } finally {
    observarOAno(null);
  }
  return r;
}

function rodarDinastia(c: Conteudo, t: Extract<Tarefa, { tipo: 'dinastia' }>): DaDinastia {
  const r: DaDinastia = { tipo: 'dinastia', geracoes: [], pares: [], tamanho: 0, dividasErradas: 0, entradasConferidas: 0, exemploDeDivida: '' };
  let e = nascer(c, { semente: t.semente, ano: ANO });
  const robo = criarRng(misturar(t.semente, 78));
  let anterior: number | null = null;
  let g = 1;
  for (; g <= t.geracoes; g++) {
    const inicioVida = e.idade;
    const herdou = g > 1 ? (e.dinastia?.antepassados.at(-1)?.deixou ?? 0) : 0;
    viver(c, e, t.estrategia, robo, undefined);
    const conferida = contasDaVida(e);
    r.dividasErradas += conferida.dividasErradas;
    r.entradasConferidas += conferida.entradasConferidas;
    if (!r.exemploDeDivida) r.exemploDeDivida = conferida.exemploDeDivida;
    const patrimonio = patrimonioTotal(e);
    if (anterior !== null) r.pares.push([anterior, patrimonio]);
    const visiveis = apresentados(e);
    r.geracoes.push({
      estrategia: t.estrategia,
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
    if (!herdeiroPossivel(e, c) || g === t.geracoes) break;
    anterior = patrimonio;
    e = continuarComoHerdeiro(e, c);
  }
  r.tamanho = Math.min(g, t.geracoes);
  return r;
}

export function executar(c: Conteudo, t: Tarefa): Resultado {
  if (t.tipo === 'jogador') return rodarJogador(c, t);
  if (t.tipo === 'dinastia') return rodarDinastia(c, t);
  return { tipo: 'origem', vida: medir(c, jogar(c, t.estrategia, t.semente, undefined, t.origem), t.estrategia) };
}
