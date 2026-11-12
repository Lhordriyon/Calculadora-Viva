/**
 * Uma vida do túnel e as tarefas que um trabalhador roda (scripts/tunel-trabalhador.ts): o jogador com as 20 vidas
 * seguidas, a vida de origem escolhida e a dinastia. Cada tarefa depende só da semente: o resultado é o mesmo rodando
 * aqui ou num trabalhador, e o túnel junta tudo na ordem das tarefas.
 */
import { MARCOS_DO_GRUPO } from '../src/motor/lugar.ts';
import { OFERTAS_CONTRA } from '../src/motor/empresa.ts';
import { diaDoSonho, E_AGORA, SONHO_QUE_FICOU } from '../src/motor/projetos.ts';
const CONTRA: ReadonlySet<string> = new Set(OFERTAS_CONTRA);
import { ESCOLHA_RECUSAR, ESCOLHA_SEGUIR, PROPOSTA } from '../src/motor/diretoria.ts';
import { classeDoPatrimonio, empresasDe, filhosDe, filhosVivos, indicadoresDoPais, nomeDaClasse, patrimonioTotal } from '../src/motor/campos.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import type { Conteudo } from '../src/motor/conteudo.ts';
import { REF_SOUBE } from '../src/motor/segredos.ts';
import { capitulosDe, type TipoDeCapitulo } from '../src/motor/capitulos.ts';
import { CHAVES_CONDICAO, type Condicoes } from '../src/motor/esquema.ts';
import { ESTATISTICAS, faseDe, governoAtual, type Estatistica } from '../src/motor/pais.ts';
import { ATIVOS, type Fase } from '../src/motor/constantes.ts';
import { motivoParaNaoOperar, operar, perfilDe } from '../src/motor/carteira.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
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
import { ameacaDeGuerra } from '../src/motor/guerra.ts';
import { inimigoDe } from '../src/motor/campos.ts';
import { conferirContas, conferirContratos, conferirDividas, conferirPromissorias, devedoresDasPromissorias, extrato, garantiasDosContratos } from '../src/motor/contas.ts';

export const ANO = 2026;

/** Os sonhos de uma vida, lidos do livro (bloco S1), e o segundo ato (bloco S2): o dia do sonho, o que vem depois e os anos dos 50 em diante. */
function sonhosDoLivro(e: EstadoVida, c: Conteudo): { teve: string[]; realizados: string[]; acabaram: number; dias: number; diasPossiveis: number; depois: number; anos50: number; anos50Sonho: number } {
  const ids = c.mundo.projetos.filter((p) => p.sonho).map((p) => p.id);
  const teve = ids.filter((id) => e.historico.some((h) => h.mudancas?.some((m) => m.c === `eu.projeto_${id}` && (m.q ?? 0) > 0)));
  const fins = e.historico.map((h) => /^projeto:([a-z_]+)#(conquista|vencido|semTempo)$/.exec(h.instancia ?? '')).filter((m): m is RegExpExecArray => m !== null && ids.includes(m[1]!));
  const realizados = fins.filter((m) => m[2] === 'conquista').map((m) => m[1]!);
  // Os anos de cada sonho de pé, do começo ao fim (ou à morte), pela qualidade no livro.
  const abertos = new Map<string, number>();
  const pe: [number, number][] = [];
  for (const h of e.historico) {
    for (const m of h.mudancas ?? []) {
      const r = /^eu\.projeto_([a-z_]+)$/.exec(m.c);
      if (!r || !ids.includes(r[1]!) || m.q === undefined) continue;
      if (m.q > 0) abertos.set(r[1]!, h.idade);
      else if (abertos.has(r[1]!)) {
        pe.push([abertos.get(r[1]!)!, h.idade]);
        abertos.delete(r[1]!);
      }
    }
  }
  for (const de of abertos.values()) pe.push([de, e.idade + 1]);
  let anos50 = 0;
  let anos50Sonho = 0;
  for (let idade = 50; idade <= e.idade; idade++) {
    anos50++;
    if (pe.some(([de, ate]) => de <= idade && idade < ate)) anos50Sonho++;
  }
  return {
    teve,
    realizados,
    acabaram: fins.length,
    dias: e.historico.filter((h) => h.ref?.startsWith('o_dia_do_sonho_') && h.escolha).length,
    diasPossiveis: realizados.filter((id) => c.porId.has(diaDoSonho(id))).length,
    depois: e.historico.filter((h) => (h.ref === E_AGORA || h.ref === SONHO_QUE_FICOU) && h.escolha).length,
    anos50,
    anos50Sonho,
  };
}

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
  /** Os invariantes do estado (invariantes.ts), conferidos depois de cada ano: problemas (devem ser zero) e um exemplo. */
  invariantes: number;
  exemploDeInvariante: string;
  /** O tempo gasto conferindo (fica fora da CPU da vida). */
  msDaConferencia: number;
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
    if (a && a.nome === emp.nome && a.valor >= 1e5) f.setores.push([emp.t['setor'] ?? '', ((emp.n['valor'] ?? 0) - a.valor) / a.valor, variacao]);
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
    if (a && a.nome === emp.nome && a.valor >= 1e5) (emp.q['na_bolsa'] ? g.listadas : g.fechadas).push([((emp.n['valor'] ?? 0) - a.valor) / a.valor, humor]);
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
  let invariantes = 0;
  let exemploDeInvariante = '';
  let msDaConferencia = 0;
  /** O estado inteiro, depois de cada ano e no fim (o que as contas, entrada por entrada, não veem). */
  const conferir = (): void => {
    const t = performance.now();
    const problemas = conferirEstado(e, c);
    invariantes += problemas.length;
    if (problemas.length > 0 && !exemploDeInvariante) exemploDeInvariante = `semente ${e.semente}, ${estrategia}, aos ${e.idade}: ${problemas[0]}`;
    msDaConferencia += performance.now() - t;
  };
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
      conferir();
    }
  }
  return { toques, anosPorFase, operacoes, pais, grupo, fora, invariantes, exemploDeInvariante, msDaConferencia };
}

export function jogar(c: Conteudo, estrategia: Estrategia, semente: number, memoria: MemoriaJogador | undefined, origem?: EscolhaOrigem): Jogada {
  const t0 = performance.now();
  const e = nascer(c, { semente, ano: ANO, ...(origem ? { origem } : {}) });
  const riquezaOrigem = (e.entidades['mae']?.n['dinheiro'] ?? 0) + (e.entidades['pai']?.n['dinheiro'] ?? 0);
  const r = viver(c, e, estrategia, criarRng(misturar(semente, 77)), memoria);
  return { e, toques: r.toques + 1, ms: performance.now() - t0 - r.msDaConferencia, riquezaOrigem, anosPorFase: r.anosPorFase, operacoes: r.operacoes, pais: r.pais, grupo: r.grupo, fora: r.fora, invariantes: r.invariantes, exemploDeInvariante: r.exemploDeInvariante, msDaConferencia: r.msDaConferencia };
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
  /** Ao morrer, havia alguém para continuar a história (o filho, o sobrinho, o par ou o amigo do testamento). */
  herdeiro: boolean;
  /** Quem continuaria a história: o parentesco de quem herda ('' sem ninguém). */
  quemHerda: string;
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
  /** Os invariantes do estado, depois de cada ano da vida: problemas (devem ser zero) e um exemplo (missão AAA). */
  invariantes: number;
  exemploDeInvariante: string;
  extrato: { rotulo: string; contraparte: string; valor: number }[];
  /** A dívida como contrato (fatia 1.2): problemas da conferência (devem ser zero) e a história das dívidas da vida. */
  dividasErradas: number;
  exemploDeDivida: string;
  dividas: HistoriaDasDividas;
  /** O Tesouro (bloco B): os títulos de quem joga e os calotes que a vida viu. */
  tesouro: HistoriaDoTesouro;
  /** A coroa (bloco C): os anos com coroa em cada forma, a dotação, as quedas e a ilha. */
  coroa: HistoriaDaCoroa;
  /** O Estado pesquisa (bloco D): os anos de cada nível da ciência, a tecnologia, as descobertas e a fuga de cérebros. */
  pesquisa: HistoriaDaPesquisa;
  /** A defesa (bloco E): os anos de cada nível da defesa, a capacidade, as encomendas e as guerras. */
  defesa: HistoriaDaDefesa;
  /** O poder que passa (bloco F): a sucessão que chegou e a resposta, quem reinou, e as jogadas do poder. */
  poder: HistoriaDoPoder;
  /** A rede (missão Ω): as pessoas que passaram pela vida e o que contaram. */
  rede: HistoriaDaRede;
  pedidos: HistoriaDosPedidos;
  projetos: HistoriaDosProjetos;
  segredos: HistoriaDosSegredos;
  /** Os capítulos da vida (missão Ω5, capitulos.ts): quantos de cada tipo. */
  capitulos: Partial<Record<TipoDeCapitulo, number>>;
  /** A rival e o gestor (bloco H6): a concorrência com nome, o rival que já era da vida, o gestor, as propostas seguidas e recusadas, os avisos e as saídas. */
  comRosto: { rival: boolean; conhecido: boolean; gestor: boolean; seguidas: number; recusadas: number; avisos: number; saidas: number };
  /**
   * O capitalismo vivo (missão Capitalismo vivo): se a vida teve empresa com concorrente de verdade, quantas concorrentes
   * quebraram, as compras que preservaram a comprada, as decisões do Cade, as unidades construídas, os anos de decisão de
   * conselho, os lançamentos de produto, a campanha paga à mídia do grupo e o maior peso do grupo no PIB (em %).
   */
  vivo: { concorrente: boolean; quebras: number; compras: number; cade: Record<string, number>; unidades: number; conselhos: number; lancamentos: number; naMidia: number; pesoNoPib: number; filiais: number };
  /**
   * O mundo à vista (I-170 a I-172): a faixa do lugar no nascimento, no fim e a mais alta; as linhas do lugar depois
   * do nascimento (as douradas à parte) e os marcos do grupo e da lista dos mais ricos que a vida teve.
   */
  lugar: { nasceu: number; final: number; maximo: number; linhas: number; douradas: number; marcos: string[] };
  /** A bolsa (bloco H7): as emissões, as recompras, as ofertas hostis (tentadas e as que passaram) e as ofertas contra quem joga (e cada resposta). */
  bolsa: { emissoes: number; recompras: number; ofertas: number; passaram: number; contra: number; respostas: number[] };
  /** O sonho (bloco S1): os sonhos que a vida teve, os realizados e quantos acabaram (realizados ou não). */
  sonhos: ReturnType<typeof sonhosDoLivro>;
  /** O caminho (missão Ω6): as causas dos pontos de virada e os tipos de capítulo, como assinatura. */
  caminho: string;
  /** O caminho sem o arco do sonho (bloco S1): a régua de antes do sonho, para comparar com as versões sem ele. */
  caminhoSemSonho: string;
  /** Os elos causais distintos da vida ("storylet que causou>storylet que aconteceu"). */
  elos: string[];
  /** O ritmo: os anos pesados (o que aconteceu tirou 8 de felicidade ou mais) e quantos deles vieram logo depois de outro. */
  anosPesados: number;
  pesadosSeguidos: number;
}

/** A rede (missão Ω): quantas pessoas passaram pela vida, os ex, os irmãos, quem foi do trabalho e o que contaram. */
export interface HistoriaDaRede {
  /** Pessoas diferentes (por número) que ocuparam algum papel, sem contar quem joga. */
  pessoas: number;
  exes: number;
  irmaos: number;
  /** Irmãos que nasceram depois de quem joga. */
  irmaosNovos: number;
  doTrabalho: number;
  /** Entradas visíveis com uma pessoa da rede (irmão, ex, colega, chefe) como ator. */
  entradas: number;
  /** A mesma pessoa em outro papel: o ex que voltou, o colega que virou amigo, o romance do trabalho. */
  exVoltou: number;
  colegaVirouAmigo: number;
  romanceNoTrabalho: number;
}

/** Os papéis da rede: os irmãos, os ex, o colega e o chefe. */
const DA_REDE = /^(irmao\d?|ex\d?|colega|chefe)$/;

function redeDaVida(e: EstadoVida): HistoriaDaRede {
  const ocup = e.ocupacoes ?? [];
  const distintas = (f: (papel: string) => boolean): number => new Set(ocup.filter((o) => o.pessoa !== 0 && f(o.papel)).map((o) => o.pessoa)).size;
  const vistos = apresentados(e);
  return {
    pessoas: distintas(() => true),
    exes: distintas((p) => /^ex\d?$/.test(p)),
    irmaos: distintas((p) => /^irmao\d?$/.test(p)),
    irmaosNovos: e.historico.filter((h) => h.ref === 'irmao_nasce').length,
    doTrabalho: distintas((p) => p === 'colega' || p === 'chefe'),
    entradas: vistos.filter((h) => h.ator !== undefined && DA_REDE.test(h.ator)).length,
    exVoltou: e.historico.filter((h) => h.ref === 'voltar_com_o_ex' && h.mudancas?.some((m) => m.c === 'eu.voltou_com_o_ex' && m.q === 1)).length,
    colegaVirouAmigo: e.historico.filter((h) => h.ref === 'regra:virou_amigo').length,
    romanceNoTrabalho: e.historico.filter((h) => h.ref === 'romance_no_trabalho' && h.mudancas?.some((m) => m.c === 'eu.namoro' && m.q === 1)).length,
  };
}

/** Os verbos sociais (missão Ω2): o que se pediu às pessoas, o que elas responderam, e os empréstimos entre pessoas. */
export interface HistoriaDosPedidos {
  /** Respostas de alguém a um pedido (o teste "decide"), e quantas foram sim. */
  respostas: number;
  sins: number;
  /** Respostas cujo porquê cita o passado: a lembrança com a idade ou a dívida em aberto. */
  comLembranca: number;
  /** Os empréstimos entre pessoas: abertos (quem joga pegando e emprestando), quitados, em calote e com a parcela atrasada. */
  pegou: number;
  emprestou: number;
  quitados: number;
  calotes: number;
  atrasos: number;
}

function pedidosDaVida(e: EstadoVida): HistoriaDosPedidos {
  let respostas = 0;
  let sins = 0;
  let comLembranca = 0;
  let pegou = 0;
  let emprestou = 0;
  const ref = (r: string): number => e.historico.filter((h) => h.ref === r).length;
  for (const h of e.historico) {
    if (h.resposta) {
      respostas++;
      if (h.resposta === 'sim') sins++;
      // O porquê que cita o passado: a lembrança com a idade ("…, aos 31") ou a dívida em aberto.
      if (/aos \d+|ainda deve R\$/.test(h.resultado ?? '')) comLembranca++;
    }
    for (const m of h.mudancas ?? []) {
      if (m.r !== 'emprestimo' || !m.c.startsWith('prm') || !m.c.endsWith('.saldo')) continue;
      if (h.mudancas!.some((x) => x.c === 'eu.dinheiro' && x.r === 'emprestimo' && (x.d ?? 0) > 0)) pegou++;
      else emprestou++;
    }
  }
  return {
    respostas,
    sins,
    comLembranca,
    pegou,
    emprestou,
    quitados: ref('regra:divida_quitada') + ref('regra:quitou_com_voce') + ref('promissoria:quitar_promissoria'),
    calotes: ref('regra:calote'),
    atrasos: ref('regra:parcela_atrasada') + ref('regra:devedor_atrasou'),
  };
}

/** Os projetos (missão Ω3): os começados e como acabaram, por projeto. */
export interface HistoriaDosProjetos {
  comecados: string[];
  conquistas: string[];
  vencidos: string[];
  desistencias: string[];
  semTempo: string[];
}

function projetosDaVida(e: EstadoVida): HistoriaDosProjetos {
  const r: HistoriaDosProjetos = { comecados: [], conquistas: [], vencidos: [], desistencias: [], semTempo: [] };
  const deQual = (h: Entrada): string => h.instancia?.slice('projeto:'.length).split('#')[0] ?? '';
  // O começo e a desistência são operações: o projeto sai da qualidade que a entrada ganhou ou perdeu.
  const daQualidade = (h: Entrada): string => (h.mudancas ?? []).find((m) => m.c.startsWith('eu.projeto_'))?.c.slice('eu.projeto_'.length) ?? '';
  for (const h of e.historico) {
    if (h.ref === 'projeto:comecar_projeto') r.comecados.push(daQualidade(h));
    else if (h.ref === 'projeto:desistir_projeto') r.desistencias.push(daQualidade(h));
    else if (h.ref === 'regra:projeto_conquista') r.conquistas.push(deQual(h));
    else if (h.ref === 'regra:projeto_vencido') r.vencidos.push(deQual(h));
    else if (h.ref === 'regra:projeto_semTempo') r.semTempo.push(deQual(h));
  }
  return r;
}

/**
 * Os segredos (missão Ω4): os que nasceram, por tema; quantas vezes alguém ficou sabendo pela boca de outra pessoa;
 * quantas vezes a notícia chegou a quem não devia (a revelação do tema); e como cada um acabou: contado (a revelação),
 * descoberto (a prova, a chantagem, a desconfiança), confessado (a ação de quem joga) ou calado (sem alvo, ou deixou de
 * importar). As chantagens são as iniciativas de quem sabe.
 */
export interface HistoriaDosSegredos {
  nascidos: string[];
  boatos: number;
  chegaram: string[];
  fins: { contado: string[]; descoberto: string[]; confessado: string[]; calado: string[] };
  chantagens: number;
}

/** O caminho da vida (missão Ω6): a assinatura causal, os elos distintos e o ritmo dos anos pesados. */
function caminhoDaVida(e: EstadoVida, c: Conteudo, pontos: { origemId: number }[]): { caminho: string; caminhoSemSonho: string; elos: string[]; anosPesados: number; pesadosSeguidos: number } {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const refDe = (h: Entrada | undefined): string => (h?.ref ?? h?.tipo ?? '?').replace(/#.*$/, '');
  // A causa de um ponto de virada que foi escolha é a escolha (bloco S1): quem sonhou com a estrela e quem sonhou com o
  // império não fizeram o mesmo caminho, mesmo vindo do mesmo marco.
  const viradas = pontos.map((p) => { const h = porId.get(p.origemId); return h?.escolha ? `${refDe(h)}#${h.escolha.indice}` : refDe(h); }).sort();
  const tipos = [...new Set(capitulosDe(e, c).map((k) => k.tipo))].sort();
  const elos = new Set<string>();
  const perdaPorIdade = new Map<number, number>();
  for (const h of e.historico) {
    if (h.tipo === 'regra') continue;
    for (const id of h.causas ?? []) {
      const causa = porId.get(id);
      if (causa && causa.tipo !== 'regra') elos.add(`${refDe(causa)}>${refDe(h)}`);
    }
    for (const m of h.mudancas ?? []) if (m.c === 'eu.felicidade' && (m.d ?? 0) < 0) perdaPorIdade.set(h.idade, (perdaPorIdade.get(h.idade) ?? 0) - m.d!);
  }
  let anosPesados = 0;
  let pesadosSeguidos = 0;
  for (const [idade, perda] of perdaPorIdade) {
    if (perda < 8) continue;
    anosPesados++;
    if ((perdaPorIdade.get(idade - 1) ?? 0) >= 8) pesadosSeguidos++;
  }
  // O arco do sonho (bloco S1), como o cartão conta: qual sonho e se veio. O marco que o começou não toma a vaga de um
  // ponto de virada (virada.ts › comecouUmSonho).
  const sonhos = sonhosDoLivro(e, c);
  const arco = sonhos.teve.map((id) => `${id}:${sonhos.realizados.includes(id) ? 'veio' : 'nao'}`).sort();
  const base = `${viradas.join(',')}|${tipos.join(',')}`;
  return { caminho: `${base}|${arco.join(',')}`, caminhoSemSonho: base, elos: [...elos], anosPesados, pesadosSeguidos };
}

function segredosDaVida(e: EstadoVida, c: Conteudo): HistoriaDosSegredos {
  const revelacoes = new Map(c.mundo.segredos.map((s) => [s.revelacao, s.id]));
  const r: HistoriaDosSegredos = { nascidos: [], boatos: 0, chegaram: [], fins: { contado: [], descoberto: [], confessado: [], calado: [] }, chantagens: 0 };
  for (const h of e.historico) {
    if (h.ref === REF_SOUBE) r.boatos++;
    if (h.ref?.startsWith('chantagem_')) r.chantagens++;
    const tema = h.ref ? revelacoes.get(h.ref) : undefined;
    if (tema) r.chegaram.push(tema);
    for (const m of h.mudancas ?? []) {
      const i = m.c.indexOf('.escondido_');
      if (i < 0 || m.c.startsWith('eu.')) continue;
      const id = m.c.slice(i + '.escondido_'.length);
      if (m.q === 1) r.nascidos.push(id);
      else if (m.q === -1) {
        const fim = h.ref === 'regra:segredo_acabou' ? 'calado' : tema ? 'contado' : h.tipo === 'acao' ? 'confessado' : 'descoberto';
        r.fins[fim].push(id);
      }
    }
  }
  return r;
}

export interface HistoriaDoPoder {
  /**
   * Cada vez que a coroa, o Regime ou a ilha chegou a quem joga com 18 anos ou mais e a vida seguiu dois anos: na
   * herança (a vida começou na fila) ou em vida (o pai ou a mãe que reinava morreu), e se a resposta veio (o storylet
   * da sucessão ou a posse da ilha).
   */
  sucessoes: { quando: 'heranca' | 'vida'; respondeu: boolean }[];
  /** Quem herdou na fila (a vida do herdeiro) e reinou. */
  herdeiroReinou: boolean | null;
  /** Reinou (monarca, chefe do Regime ou soberano) em algum momento da vida. */
  reinou: boolean;
  /** As jogadas do poder: [tentativas, as que deram certo]. */
  golpe: [number, number];
  autogolpe: [number, number];
  emenda: [number, number];
  restauracao: [number, number];
}

export interface HistoriaDaCoroa {
  /** Anos com coroa (o Brasil ou a ilha), em cada forma, e a dotação que cada forma pagou. */
  anos: Record<'salario' | 'impostos' | 'taxa', number>;
  dotacao: Record<'salario' | 'impostos' | 'taxa', number>;
  /** Vezes em que a coroa caiu (o cargo de rei ou de soberano acabou em vida), pela forma da hora. */
  quedas: Record<'salario' | 'impostos' | 'taxa', number>;
  reinou: boolean;
  /** A ilha: se a vida fundou (ou herdou) uma, a população no fim e os anos com a taxa da coroa. */
  ilha: { populacao: number; anosComTaxa: number } | null;
  /** Dotação paga a quem não tinha coroa (deve ser zero). */
  dotacaoSemCoroa: number;
}

const DA_FILA = ['eu.principe', 'eu.herdeiro_regime', 'eu.herdeiro_ilha'];
const CARGOS_DE_COROA = new Set(['rei', 'ditador', 'soberano']);
const RESPOSTAS = new Set(['sucessao_coroa', 'sucessao_regime', 'sucessao:ilha']);

/**
 * O poder pelo livro: a sucessão (a vida do herdeiro que começou na fila, e o pai ou a mãe que reinava e morreu com
 * quem joga adulto na fila), se a resposta veio, e as jogadas do poder com o desfecho (o cargo que a entrada deu).
 */
function poderDaVida(e: EstadoVida): HistoriaDoPoder {
  const eu = e.entidades['eu']!;
  const t: HistoriaDoPoder = { sucessoes: [], herdeiroReinou: null, reinou: CARGOS_DE_COROA.has(eu.t['cargo'] ?? ''), golpe: [0, 0], autogolpe: [0, 0], emenda: [0, 0], restauracao: [0, 0] };
  const respostas = e.historico.filter((h) => RESPOSTAS.has(h.ref ?? ''));
  const respondeuDepois = (ano: number): boolean => respostas.some((h) => h.ano >= ano);
  // Na fila num ano: a qualidade ainda está lá, ou saiu (na resposta) daquele ano em diante.
  const saida = new Map<string, number>();
  for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.q === -1 && DA_FILA.includes(m.c)) saida.set(m.c, h.ano);
  const naFilaEm = (campo: string, ano: number): boolean => eu.q[campo.slice(3)] !== undefined || (saida.get(campo) ?? -1) >= ano;
  for (const h of e.historico) {
    const muda = h.mudancas ?? [];
    if (muda.some((m) => m.c === 'eu.cargo' && m.t !== undefined && CARGOS_DE_COROA.has(m.t))) t.reinou = true;
    const deu = (cargo: string): boolean => muda.some((m) => m.c === 'eu.cargo' && m.t === cargo);
    const i = h.escolha?.indice;
    if (h.ref === 'jogada:tomar_o_poder' && i !== undefined && i < 2) {
      t.golpe[0]++;
      if (deu('ditador')) t.golpe[1]++;
    } else if (h.ref === 'jogada:ficar_no_poder' && i === 0) {
      t.autogolpe[0]++;
      if (deu('ditador')) t.autogolpe[1]++;
    } else if (h.ref === 'jogada:ficar_no_poder' && i === 1) {
      t.emenda[0]++;
      if (muda.some((m) => m.c === 'eu.mandato' && (m.d ?? 0) > 0)) t.emenda[1]++;
    } else if (h.ref === 'jogada:restaurar_a_monarquia' && i === 0) {
      t.restauracao[0]++;
      if (deu('rei')) t.restauracao[1]++;
    }
    // Em vida: o pai ou a mãe que reinava morreu, com quem joga na fila (a qualidade ainda não tinha saído).
    for (const m of muda) {
      if (m.q !== 1 || (m.c !== 'mae.faleceu' && m.c !== 'pai.faleceu')) continue;
      const quem = e.entidades[m.c.slice(0, 3)];
      const fila = (quem?.q['monarca'] !== undefined && naFilaEm('eu.principe', h.ano)) || (quem?.q['ditador'] !== undefined && naFilaEm('eu.herdeiro_regime', h.ano));
      if (fila && h.idade >= 18 && e.idade - h.idade >= 2) t.sucessoes.push({ quando: 'vida', respondeu: respondeuDepois(h.ano) });
    }
  }
  // Na herança: a vida começou na fila (a primeira mudança da qualidade é a saída, ou ela nunca saiu).
  const abertura = e.historico[0];
  const noComeco = (campo: string): boolean => {
    for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.c === campo && m.q !== undefined) return m.q < 0;
    return eu.q[campo.slice(3)] !== undefined;
  };
  if (abertura?.ref === 'herdeiro' && DA_FILA.some(noComeco)) {
    t.herdeiroReinou = t.reinou;
    if (abertura.idade >= 18 && e.idade - abertura.idade >= 2) t.sucessoes.push({ quando: 'heranca', respondeu: respostas.length > 0 });
  }
  return t;
}

/** A coroa pelo livro: segue o cargo e a forma entrada por entrada, e conta os anos, a dotação e as quedas de cada forma. */
function coroaDaVida(e: EstadoVida): HistoriaDaCoroa {
  const vazio = (): Record<'salario' | 'impostos' | 'taxa', number> => ({ salario: 0, impostos: 0, taxa: 0 });
  const t: HistoriaDaCoroa = { anos: vazio(), dotacao: vazio(), quedas: vazio(), reinou: false, ilha: null, dotacaoSemCoroa: 0 };
  let cargo = '';
  const forma = { pais: 'salario', ilha: 'salario' } as Record<'pais' | 'ilha', 'salario' | 'impostos' | 'taxa'>;
  let anosComTaxa = 0;
  const daCoroa = (): 'pais' | 'ilha' | null => (cargo === 'rei' ? 'pais' : cargo === 'soberano' ? 'ilha' : null);
  for (const h of e.historico) {
    const antes = daCoroa();
    for (const m of h.mudancas ?? []) {
      if (m.c === 'eu.cargo' && m.t !== undefined) cargo = m.t;
      if ((m.c === 'pais.coroa' || m.c === 'ilha.coroa') && m.t !== undefined) forma[m.c === 'pais.coroa' ? 'pais' : 'ilha'] = (m.t || 'salario') as 'salario';
      if (m.c === 'eu.dinheiro' && m.r === 'dotacao' && m.d !== undefined) {
        const onde = antes ?? daCoroa();
        if (onde) t.dotacao[forma[onde]] += m.d;
        else t.dotacaoSemCoroa += m.d;
      }
    }
    const agora = daCoroa();
    if (agora) t.reinou = true;
    if (antes && !agora) t.quedas[forma[antes]]++;
    if (h.tipo === 'regra' && h.ref === 'ano' && agora) {
      t.anos[forma[agora]]++;
      if (agora === 'ilha' && forma.ilha === 'taxa') anosComTaxa++;
    }
  }
  const ilha = e.entidades['ilha'];
  if (ilha) t.ilha = { populacao: ilha.n['populacao'] ?? 0, anosComTaxa };
  return t;
}

export interface HistoriaDaPesquisa {
  /** Anos de cada nível da ciência (cortada, regular, prioridade) e o quanto a tecnologia do país andou neles. */
  anos: [number, number, number];
  variacao: [number, number, number];
  /** A tecnologia do país ao nascer e ao morrer. */
  inicio: number;
  fim: number;
  /** As descobertas que a vida viu, por tipo, quantas apontam uma decisão (a posse ou a reforma) e as fugas de cérebros. */
  descobertas: Record<'cura' | 'satelite' | 'patente', number>;
  comCausa: number;
  fugas: number;
}

/**
 * A pesquisa pelo livro: o nível da ciência e a tecnologia de quem nasce saem do fim menos o que o livro mudou; depois,
 * ano a ano, o nível em vigor e o quanto a tecnologia andou na regra do país, mais as notícias da pesquisa.
 */
function pesquisaDaVida(e: EstadoVida): HistoriaDaPesquisa {
  const t: HistoriaDaPesquisa = { anos: [0, 0, 0], variacao: [0, 0, 0], inicio: 0, fim: 0, descobertas: { cura: 0, satelite: 0, patente: 0 }, comCausa: 0, fugas: 0 };
  const n = e.entidades['pais']?.n ?? {};
  let somaDoNivel = 0;
  let somaDaTecnologia = 0;
  for (const h of e.historico) {
    for (const m of h.mudancas ?? []) {
      if (m.c === 'pais.pol_pesquisa' && m.d !== undefined) somaDoNivel += m.d;
      if (m.c === 'pais.tecnologia' && m.d !== undefined) somaDaTecnologia += m.d;
    }
  }
  let nivel = (n['pol_pesquisa'] ?? 1) - somaDoNivel;
  t.fim = n['tecnologia'] ?? 50;
  t.inicio = t.fim - somaDaTecnologia;
  for (const h of e.historico) {
    let andou = 0;
    for (const m of h.mudancas ?? []) {
      if (m.c === 'pais.pol_pesquisa' && m.d !== undefined) nivel += m.d;
      if (m.c === 'pais.tecnologia' && m.r === 'pais' && m.d !== undefined) andou += m.d;
    }
    if (h.tipo === 'regra' && h.ref === 'ano') {
      const k = Math.max(0, Math.min(2, Math.round(nivel))) as 0 | 1 | 2;
      t.anos[k]++;
      t.variacao[k] += andou;
    }
    const tipo = h.ref?.startsWith('pesquisa:') ? h.ref.slice('pesquisa:'.length) : '';
    if (tipo === 'fugaDeCerebros') t.fugas++;
    else if (tipo === 'cura' || tipo === 'satelite' || tipo === 'patente') {
      t.descobertas[tipo]++;
      if ((h.causas?.length ?? 0) > 0) t.comCausa++;
    }
  }
  return t;
}

export interface HistoriaDaDefesa {
  /** Anos de cada nível da defesa (desmobilizada, regular, reforçada) e o quanto a capacidade andou neles, pela regra do país. */
  anos: [number, number, number];
  variacao: [number, number, number];
  /** A capacidade ao nascer e ao morrer. */
  inicio: number;
  fim: number;
  /** Encomendas de sistemas (a decisão de quem governa) e entregas. */
  encomendas: number;
  entregas: number;
  /** As guerras: quantas começaram, quantas apontam uma decisão, como acabaram, quanto duraram (as que acabaram em vida). */
  guerras: number;
  comCausa: number;
  fins: Record<'vitoria' | 'derrota' | 'cessarFogo', number>;
  duracoes: number[];
  /** A maior duração vista, contando a guerra que ainda corria na morte. */
  maiorDuracao: number;
  /** O crescimento do país nos anos de guerra e nos de paz (soma e anos). */
  crescimentoNaGuerra: { soma: number; anos: number };
  crescimentoNaPaz: { soma: number; anos: number };
  /** Os pedidos de paz, as convocações (de quem joga e do filho) e quem voltou com a marca. */
  pedidosDePaz: number;
  convocacoes: number;
  veterano: boolean;
}

/**
 * A defesa pelo livro: o nível da defesa, a capacidade de quem nasce e o crescimento saem do fim menos o que o livro
 * mudou; depois, ano a ano, o nível em vigor, o quanto a capacidade andou na regra do país, se o Brasil estava em
 * guerra (a qualidade guerra dos países de fora) e o crescimento do ano, mais as encomendas, as entregas e as notícias.
 */
function defesaDaVida(e: EstadoVida): HistoriaDaDefesa {
  const t: HistoriaDaDefesa = {
    anos: [0, 0, 0],
    variacao: [0, 0, 0],
    inicio: 0,
    fim: 0,
    encomendas: 0,
    entregas: 0,
    guerras: 0,
    comCausa: 0,
    fins: { vitoria: 0, derrota: 0, cessarFogo: 0 },
    duracoes: [],
    maiorDuracao: 0,
    crescimentoNaGuerra: { soma: 0, anos: 0 },
    crescimentoNaPaz: { soma: 0, anos: 0 },
    pedidosDePaz: 0,
    convocacoes: 0,
    veterano: 'veterano' in (e.entidades['eu']?.q ?? {}) || e.historico.some((h) => h.mudancas?.some((m) => m.c === 'eu.veterano' && m.q === 1)),
  };
  const n = e.entidades['pais']?.n ?? {};
  const soma = { nivel: 0, defesa: 0, crescimento: 0 };
  let emGuerraNoFim = 0;
  for (const en of parceirosDe(e)) if (en.q['guerra']) emGuerraNoFim++;
  let mudouGuerra = 0;
  for (const h of e.historico) {
    for (const m of h.mudancas ?? []) {
      if (m.c === 'pais.pol_defesa' && m.d !== undefined) soma.nivel += m.d;
      if (m.c === 'pais.defesa' && m.d !== undefined) soma.defesa += m.d;
      if (m.c === 'pais.crescimento' && m.d !== undefined) soma.crescimento += m.d;
      if (m.q !== undefined && /\.guerra$/.test(m.c) && m.c !== 'pais.guerra') mudouGuerra += m.q;
    }
  }
  let nivel = (n['pol_defesa'] ?? 1) - soma.nivel;
  t.fim = n['defesa'] ?? 50;
  t.inicio = t.fim - soma.defesa;
  let crescimento = (n['crescimento'] ?? 0) - soma.crescimento;
  // Quem herdou uma guerra (a vida do herdeiro) nasce com ela: o começo é o fim menos o que o livro mudou.
  let emGuerra = emGuerraNoFim - mudouGuerra;
  let desde = emGuerra > 0 ? (e.historico[0]?.ano ?? e.ano) : 0;
  for (const h of e.historico) {
    let andou = 0;
    for (const m of h.mudancas ?? []) {
      if (m.c === 'pais.pol_defesa' && m.d !== undefined) nivel += m.d;
      if (m.c === 'pais.defesa' && m.r === 'pais' && m.d !== undefined) andou += m.d;
      if (m.c === 'pais.crescimento' && m.d !== undefined) crescimento += m.d;
      if (m.q !== undefined && /\.guerra$/.test(m.c) && m.c !== 'pais.guerra') {
        if (m.q > 0 && emGuerra === 0) desde = h.ano;
        emGuerra += m.q;
        if (m.q < 0 && emGuerra === 0) t.duracoes.push(h.ano - desde);
      }
    }
    if (h.tipo === 'regra' && h.ref === 'ano') {
      const k = Math.max(0, Math.min(2, Math.round(nivel))) as 0 | 1 | 2;
      t.anos[k]++;
      t.variacao[k] += andou;
      const onde = emGuerra > 0 ? t.crescimentoNaGuerra : t.crescimentoNaPaz;
      onde.soma += crescimento;
      onde.anos++;
    }
    const ref = h.ref ?? '';
    if (ref.startsWith('defesa:sistema:')) t.encomendas++;
    else if (ref.startsWith('defesa:entrega:')) t.entregas++;
    else if (ref === 'defesa:paz') t.pedidosDePaz++;
    else if (ref === 'a_convocacao' || ref === 'filho_convocado') t.convocacoes++;
    else if (ref.startsWith('guerra:guerra:')) {
      t.guerras++;
      if ((h.causas?.length ?? 0) > 0) t.comCausa++;
    } else if (ref.startsWith('guerra:')) {
      const tipo = ref.split(':')[1] as keyof HistoriaDaDefesa['fins'];
      if (tipo in t.fins) t.fins[tipo]++;
    }
  }
  t.maiorDuracao = Math.max(0, ...t.duracoes, emGuerra > 0 ? e.ano - desde : 0);
  return t;
}

export interface HistoriaDoTesouro {
  /** Títulos comprados pela folha Dinheiro (a decisão de quem joga) e pelas histórias (o efeito comprarTitulo). */
  compras: number;
  deHistorias: number;
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
  const t: HistoriaDoTesouro = { compras: 0, deHistorias: 0, vendas: 0, vendasComLucro: 0, vencimentos: 0, cupons: 0, calotes: 0, perdaNoCalote: 0, perdeuSemTer: false };
  for (const h of e.historico) {
    if (h.ref === 'tesouro:comprarTitulo') t.compras++;
    else if (h.mudancas?.some((m) => /^tit\w*\.vencimento$/.test(m.c) && (m.d ?? 0) > 0)) t.deHistorias++;
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
    quemHerda: herdeiroPossivel(e, c)?.parentesco ?? '',
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
    coroa: coroaDaVida(e),
    pesquisa: pesquisaDaVida(e),
    defesa: defesaDaVida(e),
    poder: poderDaVida(e),
    rede: redeDaVida(e),
    pedidos: pedidosDaVida(e),
    projetos: projetosDaVida(e),
    segredos: segredosDaVida(e, c),
    capitulos: capitulosDe(e, c).reduce<Partial<Record<TipoDeCapitulo, number>>>((m, k) => ({ ...m, [k.tipo]: (m[k.tipo] ?? 0) + 1 }), {}),
    comRosto: {
      rival: e.historico.some((h) => h.ref === 'regra:rival_chegou' || h.ref === 'regra:rival_conhecido'),
      conhecido: e.historico.some((h) => h.ref === 'regra:rival_conhecido'),
      gestor: e.historico.some((h) => h.mudancas?.some((m) => m.c.startsWith('gestor.'))),
      seguidas: e.historico.filter((h) => h.ref === PROPOSTA && h.escolha?.indice === ESCOLHA_SEGUIR).length,
      recusadas: e.historico.filter((h) => h.ref === PROPOSTA && h.escolha?.indice === ESCOLHA_RECUSAR).length,
      avisos: e.historico.filter((h) => h.ref === 'regra:gestor_avisou').length,
      saidas: e.historico.filter((h) => h.ref === 'regra:gestor_saiu').length,
    },
    vivo: capitalismoVivo(e),
    lugar: lugarDaVida(e),
    sonhos: sonhosDoLivro(e, c),
    bolsa: {
      emissoes: e.historico.filter((h) => h.ref === 'empresa:emitir').length,
      recompras: e.historico.filter((h) => h.ref === 'empresa:recomprar').length,
      ofertas: e.historico.filter((h) => h.ref === 'empresa:opa').length,
      passaram: e.historico.filter((h) => h.ref === 'empresa:opa' && h.texto.startsWith('A oferta hostil deu certo')).length,
      contra: e.historico.filter((h) => CONTRA.has(h.ref ?? '')).length,
      respostas: [0, 1, 2].map((i) => e.historico.filter((h) => CONTRA.has(h.ref ?? '') && h.escolha?.indice === i).length),
    },
    ...caminhoDaVida(e, c, pontos),
    ...contasDaVida(e),
    invariantes: j.invariantes,
    exemploDeInvariante: j.exemploDeInvariante,
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
  const devedores = devedoresDasPromissorias(e);
  for (const h of e.historico) {
    const problemas = conferirContas(e, h);
    if (problemas.length > 0 && !exemploDeConta) exemploDeConta = `semente ${e.semente}, aos ${h.idade}, ${h.tipo} ${h.ref ?? ''}: ${problemas[0]}`;
    contasErradas += problemas.length;
    const dasDividas = [...conferirContratos(h, garantias), ...conferirPromissorias(h, devedores)];
    if (dasDividas.length > 0 && !exemploDeDivida) exemploDeDivida = `semente ${e.semente}, aos ${h.idade}, ${h.tipo} ${h.ref ?? ''}: ${dasDividas[0]}`;
    dividasErradas += dasDividas.length;
  }
  const noFim = conferirDividas(e);
  if (noFim.length > 0 && !exemploDeDivida) exemploDeDivida = `semente ${e.semente}, no fim: ${noFim[0]}`;
  dividasErradas += noFim.length;
  // O dinheiro do mundo soma zero no fim da vida (moeda.ts): nada saiu do nada, nada sumiu.
  const resto = e.entidades['mercado'] ? dinheiroDoMundo(e) : 0;
  if (Math.abs(resto) > Math.max(1e4, (e.entidades['pais']?.n['pib'] ?? 1e13) * 1e-7)) {
    contasErradas++;
    if (!exemploDeConta) exemploDeConta = `semente ${e.semente}, no fim: o dinheiro do mundo soma ${resto.toFixed(0)}, não zero`;
  }
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
  /** A sucessão e as jogadas do poder na geração (bloco F). */
  poder: HistoriaDoPoder;
  /** O sonho que passa adiante (bloco S3): o que esta geração herdou (e se veio) e se ela passou um sonho adiante. */
  sonho: { herdado: string; veio: boolean; passou: boolean };
}

export type Tarefa =
  /** Um jogador: vidas seguidas com a mesma memória (ou sem ela, para medir o efeito da memória). */
  | { tipo: 'jogador'; semente: number; estrategia: Estrategia; idEstrategia: number; jogador: number; vidas: number; usarMemoria: boolean; guardar: boolean; livro: boolean }
  /** Uma vida de origem escolhida (classe, linhagem, fortuna). */
  | { tipo: 'origem'; semente: number; estrategia: Estrategia; origem: EscolhaOrigem }
  /** Uma dinastia: a vida e as dos herdeiros, até `geracoes` (a primeira nasce numa linhagem, se pedida). */
  | { tipo: 'dinastia'; semente: number; estrategia: Estrategia; geracoes: number; linhagem?: string };

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
  /**
   * A dissuasão (bloco E): nos anos de ameaça (um país que sanciona e anda frio), quantos tinham o quartel fraco
   * (capacidade abaixo de 60, perto da mediana desses anos) ou forte, e em quantos a guerra começou.
   */
  ameaca: Record<'fraco' | 'forte', { anos: number; guerras: number }>;
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
  invariantes: number;
  exemploDeInvariante: string;
}
export type Resultado = DoJogador | DaOrigem | DaDinastia;

/**
 * O custo de cada etapa do ano (fatia 1.3): a CPU, e o que cada uma deixa no livro quando `bytes` mede. E a dissuasão
 * (bloco E): antes da etapa da guerra, se há ameaça e como está o quartel; depois, se a guerra começou (fora do relógio).
 */
/** Abaixo disto, o quartel é fraco na conta da dissuasão: quem esfria a relação costuma armar-se, e a capacidade dos anos de ameaça fica perto de 60. */
export const QUARTEL_FRACO = 60;

function medirEtapas(medirBytes: boolean): { cpu: Record<string, number>; bytes: Record<string, number>; ameaca: DoJogador['ameaca'] } {
  const cpu: Record<string, number> = {};
  const bytes: Record<string, number> = {};
  const ameaca: DoJogador['ameaca'] = { fraco: { anos: 0, guerras: 0 }, forte: { anos: 0, guerras: 0 } };
  let relogio = 0;
  let regAntes = 0;
  let livroAntes = 0;
  let quartel: 'fraco' | 'forte' | null = null;
  observarOAno({
    antes(etapa, e, reg) {
      if (etapa === 'guerra') {
        quartel = ameacaDeGuerra(e) ? ((e.entidades['pais']?.n['defesa'] ?? 50) < QUARTEL_FRACO ? 'fraco' : 'forte') : null;
        if (quartel) ameaca[quartel].anos++;
      }
      if (medirBytes) {
        regAntes = reg.length;
        livroAntes = e.historico.length;
      }
      relogio = performance.now();
    },
    depois(etapa, e, reg) {
      cpu[etapa] = (cpu[etapa] ?? 0) + performance.now() - relogio;
      if (etapa === 'guerra' && quartel && inimigoDe(e)?.q['guerra']?.ano === e.ano) ameaca[quartel].guerras++;
      if (!medirBytes) return;
      // As regras miúdas vão para a entrada invisível do ano, que já foi contada etapa por etapa pelo registro.
      let b = reg.length > regAntes ? JSON.stringify(reg.slice(regAntes)).length : 0;
      for (const h of e.historico.slice(livroAntes)) if (h.ref !== 'ano') b += JSON.stringify(h).length;
      bytes[etapa] = (bytes[etapa] ?? 0) + b;
    },
  });
  return { cpu, bytes, ameaca };
}

function rodarJogador(c: Conteudo, t: Extract<Tarefa, { tipo: 'jogador' }>): DoJogador {
  // A CPU de cada etapa nas vidas guardadas; o livro, quando a tarefa pede.
  const medirBytes = t.guardar && t.livro;
  const etapas = t.guardar ? medirEtapas(medirBytes) : { cpu: {}, bytes: {}, ameaca: { fraco: { anos: 0, guerras: 0 }, forte: { anos: 0, guerras: 0 } } };
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

/** O sonho que a geração herdou na abertura (bloco S3), se ele veio, e se ela passou um sonho adiante. */
function sonhoDaGeracao(e: EstadoVida, c: Conteudo): Geracao['sonho'] {
  const ids = new Set(c.mundo.projetos.filter((p) => p.sonho).map((p) => p.id));
  const abertura = e.historico[0];
  const herdado = abertura?.ref === 'herdeiro' ? ([...ids].find((id) => abertura.mudancas?.some((m) => m.c === `eu.projeto_${id}` && (m.q ?? 0) > 0)) ?? '') : '';
  const veio = herdado !== '' && e.historico.some((h) => h.instancia === `projeto:${herdado}#conquista`);
  const passou = e.historico.some((h) => h.mudancas?.some((m) => /^filho\d?\.sonho$/.test(m.c) && (m.t ?? '') !== ''));
  return { herdado, veio, passou };
}

function rodarDinastia(c: Conteudo, t: Extract<Tarefa, { tipo: 'dinastia' }>): DaDinastia {
  const r: DaDinastia = { tipo: 'dinastia', geracoes: [], pares: [], tamanho: 0, dividasErradas: 0, entradasConferidas: 0, exemploDeDivida: '', invariantes: 0, exemploDeInvariante: '' };
  let e = nascer(c, { semente: t.semente, ano: ANO, ...(t.linhagem ? { origem: { linhagem: t.linhagem } } : {}) });
  const robo = criarRng(misturar(t.semente, 78));
  let anterior: number | null = null;
  let g = 1;
  for (; g <= t.geracoes; g++) {
    const inicioVida = e.idade;
    const herdou = g > 1 ? (e.dinastia?.antepassados.at(-1)?.deixou ?? 0) : 0;
    const vivida = viver(c, e, t.estrategia, robo, undefined);
    r.invariantes += vivida.invariantes;
    if (!r.exemploDeInvariante) r.exemploDeInvariante = vivida.exemploDeInvariante && `geração ${g}, ${vivida.exemploDeInvariante}`;
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
      poder: poderDaVida(e),
      sonho: sonhoDaGeracao(e, c),
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

/** O que a vida fez do capitalismo vivo, lido do livro e do estado (missão Capitalismo vivo). */
function lugarDaVida(e: EstadoVida): Vida['lugar'] {
  const eu = e.entidades['eu']!;
  let nasceu = 0;
  let linhas = 0;
  let douradas = 0;
  for (const h of e.historico) {
    const ref = h.ref ?? '';
    if (ref.startsWith('lugar:nasceu:')) nasceu = Number(ref.split(':')[2]);
    else if (ref.startsWith('lugar:') || ref.startsWith('porte:')) {
      linhas++;
      if (ref.startsWith('lugar:marco:') || ref.startsWith('porte:marco:')) douradas++;
    }
  }
  const marcos = Object.keys(eu.q).filter((q) => MARCOS_DO_GRUPO.some((m) => m.id === q) || q === 'entre_os_mais_ricos' || q === 'o_mais_rico_do_pais');
  return { nasceu, final: eu.n['estrato'] ?? 0, maximo: eu.n['estrato_max'] ?? 0, linhas, douradas, marcos };
}

function capitalismoVivo(e: EstadoVida): Vida['vivo'] {
  const cade: Record<string, number> = {};
  let compras = 0;
  let naMidia = 0;
  let peso = 0;
  let pesoMax = 0;
  for (const h of e.historico) {
    if (h.ref === 'empresa:adquirir' || h.ref === 'empresa:opa') {
      if (h.texto.includes('Ela continua de pé')) compras++;
      const decisao = h.texto.includes('Cade barrou') ? 'barrada' : h.texto.includes('O Cade aprovou com uma condição') ? 'condicao' : h.texto.includes('O Cade aprovou depois') ? 'concentrada' : h.texto.includes('O Cade analisou') ? 'aprovada' : h.texto.includes('Ela continua de pé') ? 'livre' : null;
      if (decisao) cade[decisao] = (cade[decisao] ?? 0) + 1;
    }
    for (const m of h.mudancas ?? []) {
      if (m.r === 'publicidade' && (m.d ?? 0) > 0) naMidia += m.d!;
      if (m.c === 'pais.peso_do_grupo' && m.d !== undefined) {
        peso += m.d;
        pesoMax = Math.max(pesoMax, peso);
      }
    }
  }
  return {
    concorrente: e.historico.some((h) => h.mudancas?.some((m) => m.c.startsWith('empresaR') && m.c.endsWith('.fundada'))),
    // A concorrente que quebrou fica no estado, fechada (concorrentes.ts › quebrarConcorrente).
    quebras: Object.values(e.entidades).filter((x) => x.tipo === 'empresa' && x.id.startsWith('empresaR') && x.vivo === false).length,
    compras,
    cade,
    unidades: e.historico.filter((h) => h.ref === 'unidade:construirUnidade').length,
    conselhos: e.historico.filter((h) => h.ref === 'conselho:decidiu').length,
    lancamentos: e.historico.reduce((s, h) => s + (h.mudancas?.filter((m) => m.r === 'lancamento' && m.c.endsWith('.caixa') && !m.c.startsWith('empresaR')).length ?? 0), 0),
    naMidia,
    pesoNoPib: pesoMax,
    // As filiais lá fora (I-166): a empresa que ganhou um país.
    filiais: e.historico.reduce((s, h) => s + (h.mudancas?.filter((m) => m.c.endsWith('.pais') && m.t !== undefined && m.t !== '').length ?? 0), 0),
  };
}
