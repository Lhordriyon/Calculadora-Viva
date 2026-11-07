/**
 * Os projetos (missão Ω3): o que quem joga quer da vida (sair das dívidas, a casa própria, um filho, o negócio próprio,
 * reparar uma relação…). O projeto é conteúdo (`mundo.json › projetos`): etapas que são condições do estado (o
 * andamento sai da vida, não de uma barra), o que ajuda em cada uma, a meta e o prazo. Começar e desistir são operações
 * (não gastam a ficha); o ano confere a meta e o prazo, e o fim (a conquista, o prazo vencido, a pessoa que morreu
 * antes) vira acontecimento no livro, com o começo de causa: o cartão da vida conta "aos 30, você pôs na cabeça comprar
 * a casa própria; aos 41, conquistou".
 *
 * O projeto ativo é a qualidade `projeto_<id>` de quem joga (com o ano e a entrada que o começou); o que é com alguém
 * marca a pessoa com a mesma qualidade e lê as condições com ela de ator.
 */
import { atende } from './condicoes.ts';
import { VARIOS } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefProjeto } from './esquema.ts';
import { definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { filhosVivos } from './campos.ts';
import { FELICIDADE_DA_CONQUISTA, FELICIDADE_DA_DESISTENCIA, FELICIDADE_DO_PRAZO_VENCIDO, MAX_PROJETOS, MAX_SONHOS } from './regras.ts';
import { temRelacao } from './relacoes.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

/** A qualidade do projeto, em quem joga e (com alguém) na pessoa. */
export const qualidadeDoProjeto = (id: string): string => `projeto_${id}`;

/**
 * O segundo ato (bloco S2): o sonho realizado traz o dia do sonho no mesmo ano (a cena do topo, uma por sonho), e o
 * fim de qualquer sonho traz, no ano seguinte, a pergunta do que vem depois: o "e agora?" depois do realizado, "o sonho
 * que ficou" depois do que não veio. As três chegam pela agenda, com o fim de causa.
 */
export const diaDoSonho = (id: string): string => `o_dia_do_sonho_${id}`;
export const E_AGORA = 'e_agora';
export const SONHO_QUE_FICOU = 'o_sonho_que_ficou';
/** A pasta do sonho (bloco S3): a cena do primeiro ano de quem herdou um sonho. */
export const PASTA_DO_SONHO = 'a_pasta_do_sonho';

export interface ProjetoAtivo {
  def: DefProjeto;
  /** O ano em que começou (o prazo conta daqui). */
  desde: number;
  /** A entrada que o começou. */
  causa: number | null;
  /** Com alguém: o papel de quem a pessoa é hoje. */
  com?: string;
}

/** Os papéis concretos de um projeto com alguém ("irmao" vale para cada irmão). */
function papeisDe(def: DefProjeto): string[] {
  return (def.com ?? []).flatMap((p): readonly string[] => VARIOS[p] ?? [p]);
}

/** Quem é a pessoa do projeto: quem tem a qualidade dele (a mesma pessoa, se mudou de papel). */
function pessoaDo(e: EstadoVida, def: DefProjeto): string | undefined {
  const q = qualidadeDoProjeto(def.id);
  return papeisDe(def).find((papel) => (e.entidades[papel]?.q[q]?.v ?? 0) > 0);
}

export function projetosAtivos(e: EstadoVida, c: Conteudo): ProjetoAtivo[] {
  const eu = e.entidades['eu']!;
  const saida: ProjetoAtivo[] = [];
  for (const def of c.mundo.projetos) {
    const q = eu.q[qualidadeDoProjeto(def.id)];
    if (!q || q.v <= 0) continue;
    const com = def.com ? pessoaDo(e, def) : undefined;
    saida.push({ def, desde: q.ano, causa: q.causa, ...(com ? { com } : {}) });
  }
  return saida;
}

/** Cada etapa do projeto e se ela já está feita (o estado de agora diz). */
export function etapasDe(e: EstadoVida, p: Pick<ProjetoAtivo, 'def' | 'com'>): { texto: string; feita: boolean; ajuda: readonly string[] }[] {
  const ctx = contexto(e, { ator: p.com });
  return p.def.etapas.map((x) => ({ texto: capitalizar(renderizar(x.texto, ctx)), feita: atende(x.feita, e, p.com), ajuda: x.ajuda ?? [] }));
}

/** O nome e o objetivo do projeto, com a pessoa (quando é com alguém). */
export function nomeDoProjeto(e: EstadoVida, def: DefProjeto, com?: string): { nome: string; objetivo: string } {
  const ctx = contexto(e, { ator: com });
  return { nome: capitalizar(renderizar(def.nome, ctx)), objetivo: renderizar(def.objetivo, ctx) };
}

export interface ProjetoPossivel {
  def: DefProjeto;
  /** Com alguém: o papel da pessoa (um projeto possível por pessoa). */
  com?: string;
}

/**
 * Há vaga para mais um projeto deste tipo? Os planos práticos são no máximo MAX_PROJETOS de pé; os sonhos (bloco S1),
 * no máximo MAX_SONHOS, à parte: sonhar não tira a vaga da casa própria.
 */
export function temVaga(e: EstadoVida, c: Conteudo, def: Pick<DefProjeto, 'sonho'>): boolean {
  const ativos = projetosAtivos(e, c);
  return def.sonho ? ativos.filter((p) => p.def.sonho).length < MAX_SONHOS : ativos.filter((p) => !p.def.sonho).length < MAX_PROJETOS;
}

/** Os projetos que dá para começar agora: a idade, a condição, a meta ainda por fazer, e a vaga (planos e sonhos à parte). */
export function projetosPossiveis(e: EstadoVida, c: Conteudo): ProjetoPossivel[] {
  if (!e.vivo) return [];
  const eu = e.entidades['eu']!;
  const saida: ProjetoPossivel[] = [];
  const vaga = { plano: temVaga(e, c, {}), sonho: temVaga(e, c, { sonho: true }) };
  for (const def of c.mundo.projetos) {
    if (!(def.sonho ? vaga.sonho : vaga.plano)) continue;
    if ((eu.q[qualidadeDoProjeto(def.id)]?.v ?? 0) > 0) continue;
    if (e.idade < def.idade[0] || e.idade > def.idade[1]) continue;
    if (!def.com) {
      if (atende(def.quando, e) && !atende(def.meta, e)) saida.push({ def });
      continue;
    }
    for (const papel of papeisDe(def)) {
      const en = e.entidades[papel];
      if (!temRelacao(papel, en) || en.vivo === false) continue;
      if (atende(def.quando, e, papel) && !atende(def.meta, e, papel)) saida.push({ def, com: papel });
    }
  }
  return saida;
}

// ---------------------------------------------------------------- as operações: começar e desistir

export type OperacaoProjeto = { tipo: 'comecar_projeto'; id: string; com?: string } | { tipo: 'desistir_projeto'; id: string };

export function ehOperacaoDeProjeto(op: { tipo: string }): op is OperacaoProjeto {
  return op.tipo === 'comecar_projeto' || op.tipo === 'desistir_projeto';
}

export function motivoParaNaoOperarProjeto(e: EstadoVida, c: Conteudo, op: OperacaoProjeto): string | null {
  const def = c.mundo.projetos.find((p) => p.id === op.id);
  if (!def) return 'esse projeto não existe';
  const ativo = projetosAtivos(e, c).find((p) => p.def.id === op.id);
  if (op.tipo === 'desistir_projeto') return ativo ? null : 'esse projeto não está de pé';
  if (ativo) return 'esse projeto já está de pé';
  if (!temVaga(e, c, def)) return def.sonho ? `no máximo ${MAX_SONHOS} sonhos ao mesmo tempo` : `no máximo ${MAX_PROJETOS} planos ao mesmo tempo`;
  const possivel = projetosPossiveis(e, c).some((p) => p.def.id === op.id && p.com === op.com);
  return possivel ? null : def.com && !op.com ? 'escolha com quem' : 'esse projeto não faz sentido agora';
}

export function operarProjeto(e: EstadoVida, c: Conteudo, op: OperacaoProjeto, reg: Mudanca[], origem: number): { texto: string; resumo: string; causas?: number[] } {
  const def = c.mundo.projetos.find((p) => p.id === op.id)!;
  const q = qualidadeDoProjeto(def.id);
  if (op.tipo === 'comecar_projeto') {
    ganhar(e, reg, 'eu', q, origem);
    if (op.com) ganhar(e, reg, op.com, q, origem);
    const { objetivo } = nomeDoProjeto(e, def, op.com);
    return { texto: `Você pôs na cabeça ${objetivo}, e deu a si mesm${e.entidades['eu']!.genero === 'f' ? 'a' : 'o'} ${def.prazo} anos.`, resumo: `pôs na cabeça ${objetivo}` };
  }
  const ativo = projetosAtivos(e, c).find((p) => p.def.id === op.id)!;
  const ctx = contexto(e, { ator: ativo.com });
  perder(e, reg, 'eu', q);
  if (ativo.com) perder(e, reg, ativo.com, q);
  somar(e, reg, 'eu', 'felicidade', FELICIDADE_DA_DESISTENCIA);
  return {
    texto: capitalizar(renderizar(def.desistencia.texto, ctx)),
    resumo: renderizar(def.desistencia.resumo, ctx),
    ...(ativo.causa !== null ? { causas: [ativo.causa] } : {}),
  };
}

// ---------------------------------------------------------------- o ano dos projetos

type Fim = 'conquista' | 'vencido' | 'semTempo';

/** O fim do projeto vira acontecimento, com o começo de causa; a qualidade sai de quem joga e da pessoa. */
function terminar(e: EstadoVida, c: Conteudo, p: ProjetoAtivo, fim: Fim): void {
  const textos = fim === 'conquista' ? p.def.conquista : fim === 'semTempo' ? (p.def.semTempo ?? p.def.vencido) : p.def.vencido;
  const entrada = novaEntrada(e, {
    tipo: 'evento',
    causa: 'regra',
    ref: `regra:projeto_${fim}`,
    instancia: `projeto:${p.def.id}#${fim}`,
    texto: '',
    ...(p.com ? { ator: p.com } : {}),
    ...(p.causa !== null ? { causas: [p.causa] } : {}),
  });
  const ctx = contexto(e, { ator: p.com });
  entrada.texto = capitalizar(renderizar(textos.texto, ctx));
  entrada.resumo = renderizar(textos.resumo, ctx);
  // O sonho que passou adiante lembra de quem era (bloco S3).
  const deQuem = p.def.sonho ? deQuemEraOSonho(e, p.def.id) : undefined;
  if (deQuem) entrada.texto += fim === 'conquista' ? ` Era o sonho de ${deQuem}, e agora é história.` : ` O sonho de ${deQuem} volta para a pasta, para quem vier depois.`;
  const reg: Mudanca[] = [];
  const q = qualidadeDoProjeto(p.def.id);
  perder(e, reg, 'eu', q);
  if (p.com) perder(e, reg, p.com, q);
  somar(e, reg, 'eu', 'felicidade', fim === 'conquista' ? FELICIDADE_DA_CONQUISTA : FELICIDADE_DO_PRAZO_VENCIDO);
  lancar(e, entrada, reg);
  if (!p.def.sonho) return;
  if (fim === 'conquista' && c.porId.has(diaDoSonho(p.def.id))) e.agenda.push({ evento: diaDoSonho(p.def.id), ano: e.ano, origem: entrada.id });
  e.agenda.push({ evento: fim === 'conquista' ? E_AGORA : SONHO_QUE_FICOU, ano: e.ano + 1, origem: entrada.id });
}

/**
 * O sonho começa por uma escolha (o efeito `sonhar`, bloco S1): o projeto com `sonho` vira de quem joga, com a escolha
 * de causa, se não estiver de pé e houver vaga entre os sonhos (MAX_SONHOS).
 */
/**
 * O sonho que passa adiante (bloco S3): o último sonho que ficou pelo caminho vai para o filho mais velho vivo, que o
 * carrega (o campo `sonho`) e, se continuar a história, começa a vida com ele (herdeiro.ts).
 */
export function passarSonho(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const sonhos = new Set(c.mundo.projetos.filter((p) => p.sonho).map((p) => p.id));
  let id: string | undefined;
  for (let i = e.historico.length - 1; i >= 0 && !id; i--) {
    const m = /^projeto:([a-z_]+)#(vencido|semTempo)$/.exec(e.historico[i]!.instancia ?? '');
    if (m && sonhos.has(m[1]!)) id = m[1]!;
  }
  const filho = filhosVivos(e)[0];
  if (id && filho) definirTexto(e, reg, filho.id, 'sonho', id);
}

export function sonhar(e: EstadoVida, c: Conteudo, reg: Mudanca[], id: string, origem: number): void {
  const def = c.mundo.projetos.find((p) => p.id === id);
  const q = qualidadeDoProjeto(id);
  if (!def?.sonho || e.entidades['eu']?.q[q] || !temVaga(e, c, def)) return;
  ganhar(e, reg, 'eu', q, origem);
}

/**
 * O ano dos projetos (uma etapa do ano, depois da carreira e do poder): a meta alcançada é conquista, o prazo
 * passado é fracasso, e a pessoa que morreu antes leva o projeto junto. Quem saiu da vida (sem ninguém com a
 * qualidade) também encerra, calado.
 */
/**
 * De quem era o sonho (bloco S3): o primeiro nome de quem veio antes, se o sonho de pé começou na abertura da vida de
 * quem herdou (o sonho que passou adiante); senão, nada.
 */
export function deQuemEraOSonho(e: EstadoVida, id: string): string | undefined {
  const q = `eu.${qualidadeDoProjeto(id)}`;
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.mudancas?.some((m) => m.c === q && (m.q ?? 0) > 0)) return h.ref === 'herdeiro' ? e.dinastia?.antepassados.at(-1)?.nome.split(' ')[0] : undefined;
  }
  return undefined;
}

/**
 * O caminho do sonho à vista (bloco S3, "tem de ser perceptível"): quando o número de etapas feitas passa do que já foi
 * contado neste sonho, a linha do tempo ganha uma linha ✦ com a etapa e quantas faltam, com o começo do sonho de causa.
 */
/** "Gente que sabe…" vira "gente que sabe…"; "R$ 1 milhão" fica como está. */
const minusculaInicial = (t: string): string => (/^[A-ZÀ-Ú][a-zà-ú]/.test(t) ? t[0]!.toLocaleLowerCase('pt-BR') + t.slice(1) : t);

function anunciarEtapas(e: EstadoVida, p: ProjetoAtivo): void {
  const etapas = etapasDe(e, p);
  const feitas = etapas.filter((x) => x.feita).length;
  const prefixo = `projeto:${p.def.id}#etapas`;
  let contadas = 0;
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (p.causa !== null && h.id <= p.causa) break;
    if (h.instancia?.startsWith(prefixo)) contadas = Math.max(contadas, Number(h.instancia.slice(prefixo.length)) || 0);
  }
  if (feitas <= contadas || feitas >= etapas.length + 1) return;
  const ultima = [...etapas].reverse().find((x) => x.feita)!;
  const { nome } = nomeDoProjeto(e, p.def, p.com);
  const falta = etapas.length - feitas;
  const entrada = novaEntrada(e, {
    tipo: 'regra',
    causa: 'regra',
    ref: 'regra:projeto_etapa',
    instancia: `${prefixo}${feitas}`,
    texto: `✦ ${nome}: ${minusculaInicial(ultima.texto.replace(/ \([^)]*\)$/, ''))}. ${feitas} de ${etapas.length} etapas do sonho${falta === 0 ? '; agora falta só ele' : ''}.`,
    ...(p.causa !== null ? { causas: [p.causa] } : {}),
  });
  entrada.resumo = `chegou a ${feitas} de ${etapas.length} etapas do sonho de ${p.def.objetivo}`;
  lancar(e, entrada, []);
}

export function anoDosProjetos(e: EstadoVida, c: Conteudo): void {
  if (!e.vivo) return;
  for (const p of projetosAtivos(e, c)) {
    if (p.def.com && !p.com) {
      const reg: Mudanca[] = [];
      perder(e, reg, 'eu', qualidadeDoProjeto(p.def.id));
      lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'regra:projeto_saiu', texto: '' }), reg);
      continue;
    }
    if (p.def.sonho && !atende(p.def.meta, e, p.com)) anunciarEtapas(e, p);
    if (p.com && e.entidades[p.com]!.vivo === false) terminar(e, c, p, 'semTempo');
    else if (atende(p.def.meta, e, p.com)) terminar(e, c, p, 'conquista');
    else if (e.ano - p.desde >= p.def.prazo) terminar(e, c, p, 'vencido');
  }
}
