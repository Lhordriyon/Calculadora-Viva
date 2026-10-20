/**
 * Pontos de virada saem do livro-razão: cada entrada guarda quais entradas
 * anteriores a tornaram possível (qualidades consultadas, agendamentos), o
 * que forma um grafo. A causa com mais consequências diferentes, pesadas pelo
 * impacto e pelo que conta a vida (o marco, o cargo, a empresa, o filho, o
 * casamento, a morte), é a que mais mudou a vida; a rotina conta uma vez.
 * Causas podem ser do jogador (escolha, ação) ou do mundo (o pai que perdeu o
 * emprego, a avó que morreu).
 */
import { defCampo, patrimonioTotal } from './campos.ts';
import { herdeiroPossivel, type Parentesco } from './herdeiro.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { aleatorio, criarRng, misturar, sortear } from './rng.ts';
import { renderizar } from './texto.ts';
import type { Antepassado, Entrada, EstadoVida, Genero } from './tipos.ts';

export interface PontoDeVirada {
  origemId: number;
  idade: number;
  /** A causa, já com sujeito: "você trocou o ENEM por um bico", "seu pai perdeu o emprego". */
  causa: string;
  /** A causa veio do jogador (escolha ou ação) ou do mundo. */
  doJogador: boolean;
  consequenciaIdade: number;
  /** A consequência que melhor conta a história ("abriu uma hamburgueria com Bruno"). */
  consequencia: string;
  /** Quantas entradas descendem desta causa. */
  total: number;
}

export function descendentes(historico: Entrada[]): Map<number, Set<number>> {
  const filhos = new Map<number, number[]>();
  for (const en of historico) {
    for (const c of en.causas ?? []) {
      const lista = filhos.get(c);
      if (lista) lista.push(en.id);
      else filhos.set(c, [en.id]);
    }
  }
  const resultado = new Map<number, Set<number>>();
  for (const en of historico) {
    const vistos = new Set<number>();
    const pilha = [...(filhos.get(en.id) ?? [])];
    while (pilha.length > 0) {
      const id = pilha.pop()!;
      if (vistos.has(id)) continue;
      vistos.add(id);
      for (const f of filhos.get(id) ?? []) pilha.push(f);
    }
    resultado.set(en.id, vistos);
  }
  return resultado;
}

const PATRIMONIO = new Set(['eu.dinheiro', 'eu.renda_fixa', 'eu.acoes', 'eu.fii', 'eu.dolar', 'eu.cripto', 'eu.divida']);
/** O valor de qualquer empresa do grupo (trocar duas de lugar não mexe no patrimônio: as variações se anulam). */
const VALOR_DE_EMPRESA = /^empresa\d*\.valor$/;

/**
 * O dinheiro pesa pelo logaritmo: no patrimônio, R$ 5 mil valem perto de 1 (como um ponto de saúde), R$ 1 milhão perto
 * de 16 e R$ 1 bilhão perto de 43. Em linha reta, a campanha de R$ 5 milhões valia mil pontos de saúde, e o cartão de
 * quem é rico contava só o dinheiro: o filho, o casamento e o marco não tinham como pesar.
 */
function pesoDoDinheiro(valor: number, porPonto: number, escala: number): number {
  return (escala / porPonto) * Math.log(1 + Math.abs(valor) / escala);
}

/** Quanto uma entrada mexeu na vida: atributos, patrimônio, renda e custo do ano, vínculos, morte. */
export function impacto(h: Entrada): number {
  let x = 0;
  let patrimonio = 0;
  let fluxo = 0;
  for (const m of h.mudancas ?? []) {
    if (m.d === undefined || m.q !== undefined) {
      if (m.q !== undefined) x += 0.5;
      continue;
    }
    if (PATRIMONIO.has(m.c) || VALOR_DE_EMPRESA.test(m.c)) patrimonio += m.c === 'eu.divida' ? -m.d : m.d;
    else if (m.c.startsWith('eu.')) {
      // A renda e o custo do ano (os outros campos em reais de quem joga) são dinheiro também, não pontos de atributo.
      if (defCampo('eu', m.c.slice(3))?.reais) fluxo += Math.abs(m.d);
      else x += Math.abs(m.d);
    } else if (m.c.endsWith('.vinculo')) x += Math.abs(m.d) / 3;
  }
  // R$ 6 mil a mais (ou a menos) por ano valem perto de 1.
  x += pesoDoDinheiro(patrimonio, 5000, 20_000) + pesoDoDinheiro(fluxo, 6000, 12_000);
  if (h.tipo === 'morte') x += 30;
  if (h.ref === 'regra:faleceu') x += 10;
  return x;
}

/** Ganhar ou perder uma eleição, o fim do mandato e o que muda a empresa (abrir, vender, juntar, abrir o capital). */
const REFS_QUE_CONTAM = new Set(['poder:candidatarCargo', 'poder:fim_do_mandato', 'empresa:abrir', 'empresa:vender', 'empresa:fundir', 'empresa:abrirCapital']);
/** Qualidades que, quando chegam, mudam a vida: o casamento, o cargo, a coroa, o regime. */
const QUALIDADES_QUE_CONTAM = new Set(['eu.casado', 'eu.politico', 'eu.monarca', 'eu.ditador']);
const EMPRESA_FUNDADA = /^empresa\d*\.fundada$/;
const DA_EMPRESA = /^empresa\d*\./;

/**
 * O que conta a vida, e não a rotina: o marco (o ENEM, o primeiro emprego), o cargo (a eleição ganha ou perdida, a
 * posse, a coroa), a empresa, o filho que nasce, o casamento, a morte de alguém próximo e a de quem joga. Sem o
 * conteúdo, o marco não se reconhece; o resto se lê na própria entrada.
 */
export function contaAVida(h: Entrada, c?: Conteudo): boolean {
  if (h.tipo === 'morte') return true;
  if (h.ref === undefined) return false;
  if (h.ref === 'regra:faleceu' || REFS_QUE_CONTAM.has(h.ref)) return true;
  if (c && (h.tipo === 'evento' || h.tipo === 'acao') && c.porId.get(h.ref)?.marco === true) return true;
  // O que acontece com a empresa (o produto que viraliza, o concorrente, a crise) é a história dela; tocá-la todo ano, não.
  const historiaDaEmpresa = h.tipo === 'evento' || h.tipo === 'npc';
  for (const m of h.mudancas ?? []) {
    if (m.q === 1 && (QUALIDADES_QUE_CONTAM.has(m.c) || EMPRESA_FUNDADA.test(m.c))) return true;
    if (m.c === 'eu.filhos' && (m.d ?? 0) > 0) return true;
    if (m.c === 'eu.cargo' && m.t) return true;
    if (historiaDaEmpresa && DA_EMPRESA.test(m.c) && (m.d ?? 0) !== 0) return true;
  }
  return false;
}

/** Quanto a mais pesa, no cartão, uma consequência que conta a vida (como um impacto de 20, no peso da causa). */
const PESO_DO_QUE_CONTA = 4;
/** Uma causa que já é, ela mesma, um desses momentos (o marco, a eleição, o casamento) pesa esta vez mais. */
const CAUSA_QUE_CONTA = 1.5;

/**
 * O mesmo acontecimento que se repete (a pelada de toda semana, o aporte de todo ano, a reeleição para o mesmo cargo)
 * é uma chave só: storylet e papel (ou a operação), mais a escolha ou o resumo sem números.
 */
function chaveDe(h: Entrada): string {
  return `${h.instancia ?? h.ref ?? `#${h.id}`}|${(h.escolha?.resumo ?? h.resumo ?? '').replace(/\d[\d.,]*/g, '#')}`;
}

/** O que o cartão lê de cada entrada, calculado uma vez por vida (uma entrada descende de muitas causas). */
interface Leitura {
  impacto: number;
  conta: boolean;
  chave: string;
}

/** A consequência que melhor conta a história: pesa o impacto, o que conta a vida e a distância no tempo. */
function melhorConsequencia(origem: Entrada, descendentes: Entrada[], ler: (h: Entrada) => Leitura): Entrada {
  let melhor = descendentes[0]!;
  let nota = -Infinity;
  for (const d of descendentes) {
    const l = ler(d);
    const n = (1 + l.impacto / 3 + (l.conta ? PESO_DO_QUE_CONTA : 0)) * (1 + (d.idade - origem.idade) / 25);
    if (n > nota || (n === nota && d.idade > melhor.idade)) {
      melhor = d;
      nota = n;
    }
  }
  return melhor;
}

/** Texto da causa, com sujeito. Escolhas e ações são do jogador; o resto já vem com sujeito. */
function frase(h: Entrada): { texto: string; doJogador: boolean } | null {
  if (h.escolha) return { texto: `você ${h.escolha.resumo}`, doJogador: true };
  if ((h.tipo === 'acao' || h.tipo === 'dinheiro') && h.resumo) return { texto: `você ${h.resumo}`, doJogador: true };
  if ((h.tipo === 'npc' || h.tipo === 'mundo') && h.resumo) return { texto: h.resumo, doJogador: false };
  return null;
}

/**
 * O que acontece com quem joga e com o país mostra o porquê, inclusive o que uma regra conta (o nome que suja, a dívida
 * que caduca, o leilão, a empresa que perde valor sem o dono); o que ele mesmo fez (ações, folhas), não.
 */
const COM_PORQUE = new Set<Entrada['tipo']>(['evento', 'npc', 'morte', 'mundo', 'regra']);

/**
 * Por que esta entrada aconteceu: a causa direta mais recente, de um ano
 * anterior, que se conta numa frase (a do jogador antes da do mundo). A linha
 * do tempo mostra "Porque aos 34, você bancou a campanha…": a consequência
 * aponta para a decisão no momento em que acontece, não só no cartão final.
 * Só no que acontece com quem joga (eventos, iniciativas dos outros, a morte, as regras que contam algo) e com o país (a fase, a eleição).
 */
export function porqueDe(h: Entrada, porId: ReadonlyMap<number, Entrada>): { idade: number; texto: string } | null {
  if (!COM_PORQUE.has(h.tipo)) return null;
  let melhor: { idade: number; texto: string; doJogador: boolean } | null = null;
  for (const id of h.causas ?? []) {
    const causa = porId.get(id);
    if (!causa || causa.idade >= h.idade) continue;
    const f = frase(causa);
    if (!f) continue;
    const melhorQue = !melhor || (f.doJogador && !melhor.doJogador) || (f.doJogador === melhor.doJogador && causa.idade > melhor.idade);
    if (melhorQue) melhor = { idade: causa.idade, texto: f.texto, doJogador: f.doJogador };
  }
  return melhor && { idade: melhor.idade, texto: melhor.texto };
}

function consequenciaDe(h: Entrada): string {
  if (h.escolha) return h.escolha.resumo;
  if ((h.tipo === 'acao' || h.tipo === 'dinheiro') && h.resumo) return `você ${h.resumo}`;
  return h.resumo ?? h.texto;
}

/**
 * O peso de uma causa: cada consequência diferente soma uma vez (a ação que se repete todo ano conta uma vez só, pela
 * vez que mais mexeu), e o que conta a vida (contaAVida) soma mais. A causa que mais alimentou um hábito do que mudou
 * coisas diferentes pesa menos: o peso vai vezes a raiz quarta da variedade (consequências diferentes / todas). A pelada
 * de 30 anos com duas histórias fica com 0,55 do peso; o ENEM com quatro anos de faculdade e três histórias, com 0,87.
 */
function pesoDasConsequencias(lista: Entrada[], ler: (h: Entrada) => Leitura): number {
  const porChave = new Map<string, number>();
  for (const d of lista) {
    const l = ler(d);
    const p = 1 + l.impacto / 5 + (l.conta ? PESO_DO_QUE_CONTA : 0);
    if (p > (porChave.get(l.chave) ?? 0)) porChave.set(l.chave, p);
  }
  let soma = 0;
  for (const p of porChave.values()) soma += p;
  return soma * Math.pow(porChave.size / lista.length, 0.25);
}

/** Três vezes a mesma coisa (a pelada, o aporte, a hora extra) já é hábito: a rotina não é a consequência que conta a história. */
const VEZES_DO_HABITO = 3;

/** O que descende da causa, sem a rotina: o que se repetiu VEZES_DO_HABITO vezes ou mais e não conta a vida sai. */
function semARotina(lista: Entrada[], ler: (h: Entrada) => Leitura): Entrada[] {
  const vezes = new Map<string, number>();
  for (const d of lista) {
    const l = ler(d);
    if (!l.conta) vezes.set(l.chave, (vezes.get(l.chave) ?? 0) + 1);
  }
  return lista.filter((d) => {
    const l = ler(d);
    return l.conta || vezes.get(l.chave)! < VEZES_DO_HABITO;
  });
}

/**
 * Os pontos de virada da vida. Com o conteúdo, os marcos pesam como marcos (resumirVida e o túnel passam). A
 * consequência mostrada é a que conta a história, não a rotina: a pelada de toda semana só aparece se a causa não
 * deixou mais nada.
 */
export function pontosDeVirada(e: EstadoVida, c?: Conteudo, limite = 3): PontoDeVirada[] {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const desc = descendentes(e.historico);
  const leituras = new Map<number, Leitura>();
  const ler = (h: Entrada): Leitura => {
    let l = leituras.get(h.id);
    if (!l) leituras.set(h.id, (l = { impacto: impacto(h), conta: contaAVida(h, c), chave: chaveDe(h) }));
    return l;
  };
  const candidatos: { origem: Entrada; frase: { texto: string; doJogador: boolean }; ultima: Entrada; total: number; peso: number; alcance: number }[] = [];
  for (const en of e.historico) {
    const f = frase(en);
    if (!f) continue;
    const ids = desc.get(en.id);
    if (!ids || ids.size === 0) continue;
    const lista = [...ids].map((id) => porId.get(id)).filter((d): d is Entrada => d !== undefined && d.tipo !== 'regra');
    if (lista.length === 0) continue;
    const alcance = Math.max(...lista.map((d) => d.idade)) - en.idade;
    // Causas do jogador pesam um pouco mais: o cartão conta a vida que ele causou; e a causa que já é um momento da vida, mais ainda.
    const peso = pesoDasConsequencias(lista, ler) * (f.doJogador ? 1.25 : 1) * (ler(en).conta ? CAUSA_QUE_CONTA : 1);
    const historia = semARotina(lista, ler);
    candidatos.push({ origem: en, frase: f, ultima: melhorConsequencia(en, historia.length > 0 ? historia : lista, ler), total: lista.length, peso, alcance });
  }
  // Mais peso primeiro; empate, a que alcançou mais longe.
  candidatos.sort((a, b) => b.peso - a.peso || b.alcance - a.alcance || a.origem.idade - b.origem.idade);

  const escolhidos: PontoDeVirada[] = [];
  const origens: Entrada[] = [];
  const usadas = new Set<number>();
  const causasUsadas = new Set<string>();
  // Um ponto por história: a mesma escolha feita de novo (o voto de cada eleição), o mesmo passo da mesma cadeia (a
  // reeleição, que descende da eleição) ou o elo seguinte de um ponto já contado (a faculdade que deu a formatura, a
  // formatura que deu o emprego) não toma o lugar de outra parte da vida.
  const repete = (o: Entrada): boolean =>
    origens.some((x) => ler(x).chave === ler(o).chave || (x.ref !== undefined && x.ref === o.ref && (desc.get(x.id)?.has(o.id) || desc.get(o.id)?.has(x.id))));
  for (const cand of candidatos) {
    if (usadas.has(cand.ultima.id) || usadas.has(cand.origem.id) || causasUsadas.has(cand.frase.texto) || repete(cand.origem)) continue;
    usadas.add(cand.ultima.id);
    usadas.add(cand.origem.id);
    causasUsadas.add(cand.frase.texto);
    origens.push(cand.origem);
    escolhidos.push({
      origemId: cand.origem.id,
      idade: cand.origem.idade,
      causa: cand.frase.texto,
      doJogador: cand.frase.doJogador,
      consequenciaIdade: cand.ultima.idade,
      consequencia: consequenciaDe(cand.ultima),
      total: cand.total,
    });
    if (escolhidos.length >= limite) break;
  }
  return escolhidos.sort((a, b) => a.idade - b.idade);
}

export interface ResumoVida {
  nome: string;
  nomeCompleto: string;
  genero: Genero;
  cidade: string;
  uf: string;
  anoNascimento: number;
  anoFinal: number;
  idade: number;
  vivo: boolean;
  causa: string | null;
  saude: number;
  /** Patrimônio em reais de hoje. */
  patrimonio: number;
  felicidadeMedia: number;
  eventos: number;
  /** "família pobre e acolhedora". */
  origem: string;
  pontos: PontoDeVirada[];
  epitafio: string;
  /** Geração da família (1 = quem nasceu do zero) e quem veio antes. */
  geracao: number;
  antepassados: Antepassado[];
  /** Quem pode continuar a história (filho ou filha viva; sem filho, sobrinho ou sobrinha), com a idade de agora. */
  herdeiro: { nome: string; idade: number; genero: Genero; parentesco: Parentesco } | null;
}

/** "família pobre e acolhedora", "classe média, família religiosa". */
export function descreverOrigem(classe: string | undefined, familia: string | undefined): string {
  if (!classe || !familia) return classe ?? familia ?? '';
  const tipo = familia.replace(/^família /, '');
  return classe.startsWith('família ') ? `${classe} e ${tipo}` : `${classe}, família ${tipo}`;
}

export function resumirVida(e: EstadoVida, c: Conteudo): ResumoVida {
  const pontos = pontosDeVirada(e, c);
  const ctx = { ...contexto(e), rng: criarRng(misturar(e.semente, 0x5eed)) };
  const eu = e.entidades['eu']!;

  // Epitáfio: metade das vezes vem de uma qualidade de ponto de virada (se houver); senão, de qualquer
  // qualidade com epitáfio ou de um genérico, todos com a mesma chance.
  const origens = new Set(pontos.map((p) => p.origemId));
  const comEpitafio = Object.entries(eu.q).filter(([m]) => c.marcas[m]?.epitafio);
  const daVirada = comEpitafio.filter(([, q]) => q.causa !== null && origens.has(q.causa));
  const modelos = [...comEpitafio.map(([m]) => c.marcas[m]!.epitafio!), ...c.mundo.epitafios];
  const modelo =
    daVirada.length > 0 && aleatorio(ctx.rng) < 0.5 ? c.marcas[sortear(ctx.rng, daVirada)[0]]!.epitafio! : sortear(ctx.rng, modelos);

  const classe = c.mundo.classes[eu.n['classe_origem'] ?? 2];
  const familia = c.mundo.familias.find((f) => f.id === eu.t['familia']);
  const anos = Math.max(1, e.idade);
  return {
    nome: eu.nome,
    nomeCompleto: `${eu.nome} ${e.sobrenome}`,
    genero: eu.genero ?? 'm',
    cidade: e.entidades['lugar']?.nome ?? '',
    uf: e.entidades['lugar']?.t['uf'] ?? '',
    anoNascimento: e.anoNascimento,
    anoFinal: e.ano,
    idade: e.idade,
    vivo: e.vivo,
    causa: e.morte?.causa ?? null,
    saude: Math.round(eu.n['saude'] ?? 0),
    patrimonio: patrimonioTotal(e),
    felicidadeMedia: e.idade > 0 ? e.somaFelicidade / anos : (eu.n['felicidade'] ?? 0),
    eventos: e.historico.filter((h) => h.tipo === 'evento' || h.tipo === 'npc' || h.tipo === 'acao').length,
    origem: descreverOrigem(classe?.nome, familia?.nome),
    pontos,
    epitafio: renderizar(modelo, ctx),
    geracao: e.dinastia?.geracao ?? 1,
    antepassados: e.dinastia?.antepassados ?? [],
    herdeiro: (() => {
      const h = herdeiroPossivel(e, c);
      return h ? { nome: h.nome, idade: e.ano - h.nascimento, genero: h.genero, parentesco: h.parentesco } : null;
    })(),
  };
}
