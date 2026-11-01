/**
 * Os segredos (missão Ω4): algumas escolhas criam um segredo, escondido de alguém e sabido por outros. O tema é
 * conteúdo (`mundo.json › segredos`): o caso, a dívida escondida, a festa que era "estudo", o esquema por fora. O alvo,
 * de quem se esconde, leva a qualidade `escondido_<tema>`; quem sabe leva `sabe_<tema>`, com a entrada em que ficou
 * sabendo de causa (o conteúdo grava as duas na escolha que cria o segredo, no desabafo e na chantagem).
 *
 * Todo ano, quem sabe pode contar a alguém do mesmo círculo (a família e o par; os amigos, o par e os irmãos; os ex e os
 * amigos; o colega e o chefe): conta mais quem tem a língua solta (o traço), quem está magoado e quem gosta pouco de você; quem
 * gosta muito guarda. Quem fica sabendo perde confiança em quem joga, numa entrada que conta como coisa que você fez (a
 * opinião da pessoa passa a saber). Quando a notícia chega ao alvo, vem a revelação: o storylet do tema, agendado para o
 * mesmo ano, com quem contou de {fonte} e a entrada em que essa pessoa soube de causa. Quem sabe e está muito magoado
 * conta direto ao alvo, mesmo fora do círculo.
 *
 * Há quem saiba sem ninguém contar (`sabem`: quem te emprestou dinheiro sabe que você deve). O segredo sem alvo (o par
 * que foi embora, a revelação que já veio) ou que deixou de importar (`acaba`: a dívida paga antes de alguém descobrir)
 * termina calado: ninguém mais "sabe" de nada.
 */
import { atende } from './condicoes.ts';
import { idadeDe } from './campos.ts';
import { papelBase } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { DefSegredo } from './esquema.ts';
import { ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { CHANCE_DE_CONTAR, IDADE_DE_CONTAR, MAGOA_DA_VINGANCA, MAX_CHANCE_DE_CONTAR, PESO_DE_QUEM_NAO_E_O_ALVO } from './regras.ts';
import { temRelacao } from './relacoes.ts';
import { aleatorio, sortear, sortearIndice } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** A qualidade de quem não sabe (o alvo) e a de quem sabe. */
export const escondidoDe = (tema: string): string => `escondido_${tema}`;
export const sabeDe = (tema: string): string => `sabe_${tema}`;

/** A entrada de quando alguém fica sabendo pela boca de outra pessoa (relacoes.ts conta como coisa que você fez). */
export const REF_SOUBE = 'regra:soube_do_segredo';

/** Por onde a notícia corre: quem fala com quem (os papéis do conteúdo). */
const CIRCULOS: readonly (readonly string[])[] = [
  ['mae', 'pai', 'avo', 'irmao', 'amor', 'filho'],
  // O irmão conhece os seus amigos (a festa que era estudo chega a ele, e dele à mãe).
  ['amigo', 'amor', 'irmao'],
  ['ex', 'amigo'],
  ['colega', 'chefe'],
];
const PAPEIS_QUE_FALAM: ReadonlySet<string> = new Set(CIRCULOS.flat());

/** Os papéis com quem a pessoa conversa (os dos círculos dela). */
function circuloDe(id: string): ReadonlySet<string> {
  const papel = papelBase(id);
  return new Set(CIRCULOS.filter((c) => c.includes(papel)).flat());
}

/** Gente que conta e que ouve: viva, da vida de quem joga, de um dos círculos e já crescida. */
function fala(e: EstadoVida, id: string, en: Entidade | undefined): en is Entidade {
  return temRelacao(id, en) && en.vivo !== false && PAPEIS_QUE_FALAM.has(papelBase(id)) && idadeDe(e, en) >= IDADE_DE_CONTAR;
}

const tem = (en: Entidade | undefined, q: string): boolean => (en?.q[q]?.v ?? 0) > 0;

/** Os ids com a qualidade, em ordem (o sorteio não depende da ordem em que as pessoas chegaram ao estado). */
function comAQualidade(e: EstadoVida, q: string): string[] {
  return Object.keys(e.entidades)
    .filter((id) => id !== 'eu' && tem(e.entidades[id], q))
    .sort();
}

/** O alvo de verdade: vivo, da vida de quem joga, num dos papéis de quem o segredo é escondido. */
function valeComoAlvo(e: EstadoVida, def: DefSegredo, id: string): boolean {
  const en = e.entidades[id];
  return temRelacao(id, en) && en.vivo !== false && (def.alvos as readonly string[]).includes(papelBase(id));
}

export interface SegredoAtivo {
  def: DefSegredo;
  /** De quem é escondido. */
  alvo: string;
  /** Quem sabe (vivo). */
  sabem: string[];
}

/** Os segredos de pé: com alvo de verdade, e quem sabe de cada um. */
export function segredosAtivos(e: EstadoVida, c: Conteudo): SegredoAtivo[] {
  const saida: SegredoAtivo[] = [];
  for (const def of c.mundo.segredos) {
    const alvo = comAQualidade(e, escondidoDe(def.id)).find((id) => valeComoAlvo(e, def, id));
    if (!alvo) continue;
    const sabem = comAQualidade(e, sabeDe(def.id)).filter((id) => e.entidades[id]!.vivo !== false);
    saida.push({ def, alvo, sabem });
  }
  return saida;
}

/** O que a pessoa sabe e o que é escondido dela (a folha Família): "sabe do caso", "não sabe da dívida". */
export function segredosDaPessoa(e: EstadoVida, c: Conteudo, id: string): { sabe: DefSegredo[]; naoSabe: DefSegredo[] } {
  const sabe: DefSegredo[] = [];
  const naoSabe: DefSegredo[] = [];
  for (const s of segredosAtivos(e, c)) {
    if (s.alvo === id) naoSabe.push(s.def);
    else if (s.sabem.includes(id)) sabe.push(s.def);
  }
  return { sabe, naoSabe };
}

/** A chance de quem sabe contar a alguém neste ano: o quanto o segredo corre, a língua do traço, a mágoa e o quanto gosta de você. */
export function chanceDeContar(c: Conteudo, en: Entidade, def?: DefSegredo): number {
  const lingua = c.tracos.get(en.t['traco'] ?? '')?.lingua ?? 1;
  const magoa = en.n['magoa'] ?? 0;
  const vinculo = en.n['vinculo'] ?? 50;
  const guarda = vinculo >= 70 ? 0.5 : vinculo >= 50 ? 0.8 : vinculo < 30 ? 1.4 : 1;
  return Math.min(MAX_CHANCE_DE_CONTAR, CHANCE_DE_CONTAR * (def?.fofoca ?? 1) * lingua * (1 + magoa / 40) * guarda);
}

/** A quem a pessoa pode contar: quem é dos círculos dela e ainda não sabe; o alvo, se for de lá ou se ela estiver muito magoada. */
function ouvintesDe(e: EstadoVida, def: DefSegredo, quem: string, alvo: string): string[] {
  const circulo = circuloDe(quem);
  const sabe = sabeDe(def.id);
  const saida = Object.keys(e.entidades)
    .filter((id) => id !== quem && id !== 'eu' && circulo.has(papelBase(id)) && fala(e, id, e.entidades[id]) && !tem(e.entidades[id], sabe))
    .filter((id) => !e.entidades[id]!.q[escondidoDe(def.id)] || id === alvo)
    .sort();
  if (!saida.includes(alvo) && (e.entidades[quem]!.n['magoa'] ?? 0) >= MAGOA_DA_VINGANCA) saida.push(alvo);
  return saida;
}

/** Quem ficou sabendo pela boca de outra pessoa: a entrada (com a de quando a outra soube de causa), a marca e a confiança. */
function contar(e: EstadoVida, def: DefSegredo, fonte: string, ouvinte: string, origem: number | null | undefined): void {
  const entrada = novaEntrada(e, {
    tipo: 'npc',
    causa: 'regra',
    ref: REF_SOUBE,
    ator: ouvinte,
    instancia: `${REF_SOUBE}#${def.id}`,
    texto: '',
    ...(origem !== null && origem !== undefined ? { causas: [origem] } : {}),
  });
  const reg: Mudanca[] = [];
  ganhar(e, reg, ouvinte, sabeDe(def.id), entrada.id);
  if (def.gravidade > 0) somar(e, reg, ouvinte, 'confianca', -def.gravidade);
  const ctx = contexto(e, { ator: ouvinte, apelidos: { fonte } });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, def.soube.textos), ctx)).trim();
  entrada.resumo = renderizar(def.soube.resumo, ctx);
  lancar(e, entrada, reg);
}

/** Quem sabe pela circunstância (a condição `sabem` do tema, com a pessoa de ator) passa a saber, numa entrada calada. */
function perceber(e: EstadoVida, def: DefSegredo, alvo: string): void {
  const sabe = sabeDe(def.id);
  const novos = Object.keys(e.entidades)
    .filter((id) => id !== 'eu' && id !== alvo && fala(e, id, e.entidades[id]) && !tem(e.entidades[id], sabe) && atende(def.sabem, e, id))
    .sort();
  if (novos.length === 0) return;
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'regra:segredo_percebido', texto: '' });
  const reg: Mudanca[] = [];
  for (const id of novos) ganhar(e, reg, id, sabe, entrada.id);
  lancar(e, entrada, reg);
}

/** O segredo acabou sem ninguém contar (o alvo saiu da vida, já sabe, ou deixou de importar): as marcas saem, caladas. */
function encerrar(e: EstadoVida, def: DefSegredo): void {
  const alvos = comAQualidade(e, escondidoDe(def.id));
  const sabem = comAQualidade(e, sabeDe(def.id));
  if (alvos.length === 0 && sabem.length === 0) return;
  const reg: Mudanca[] = [];
  for (const id of alvos) perder(e, reg, id, escondidoDe(def.id));
  for (const id of sabem) perder(e, reg, id, sabeDe(def.id));
  lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'regra:segredo_acabou', texto: '' }), reg);
}

/**
 * O ano dos segredos (uma etapa do ano, antes das iniciativas, que leem quem sabe): cada pessoa que sabe pode contar a
 * alguém; quem chega ao alvo agenda a revelação do tema e o boato para por este ano.
 */
export function anoDosSegredos(e: EstadoVida, c: Conteudo): void {
  if (!e.vivo) return;
  for (const def of c.mundo.segredos) {
    const alvo = comAQualidade(e, escondidoDe(def.id)).find((id) => valeComoAlvo(e, def, id));
    if (!alvo || (def.acaba && atende(def.acaba, e))) {
      encerrar(e, def);
      continue;
    }
    // Quem sabe sem ninguém contar (quem te emprestou sabe que você deve): passa a saber, calado.
    if (def.sabem) perceber(e, def, alvo);
    // A revelação já marcada (por quem contou, ou pela chantagem recusada) não precisa de mais ninguém contando.
    if (e.agenda.some((a) => a.evento === def.revelacao)) continue;
    for (const quem of comAQualidade(e, sabeDe(def.id))) {
      const en = e.entidades[quem];
      if (!fala(e, quem, en) || aleatorio(e.rng) >= chanceDeContar(c, en, def)) continue;
      const ouvintes = ouvintesDe(e, def, quem, alvo);
      if (ouvintes.length === 0) continue;
      // A fofoca corre de lado antes de chegar a quem não devia saber: o alvo pesa metade de cada outra pessoa.
      const pesos = ouvintes.map((x): number => (x === alvo ? 1 : PESO_DE_QUEM_NAO_E_O_ALVO));
      const ouvinte: string = ouvintes[sortearIndice(e.rng, pesos)]!;
      const origem = en.q[sabeDe(def.id)]?.causa;
      if (ouvinte === alvo) {
        e.agenda.push({ evento: def.revelacao, ano: e.ano, origem: origem ?? null, ator: alvo, fonte: quem });
        break;
      }
      contar(e, def, quem, ouvinte, origem);
    }
  }
}
