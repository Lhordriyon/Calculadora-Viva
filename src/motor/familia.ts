/**
 * Família viva: as regras anuais dos personagens. Eles envelhecem, adoecem,
 * saram, morrem, perdem e ganham emprego, se aposentam, juntam ou gastam
 * dinheiro, e o vínculo com quem joga volta devagar para o jeito da família
 * (e esfria sem contato na vida adulta). Depois disso, cada um pode tomar uma
 * iniciativa: um storylet de personagem, escolhido pela regra dele (traço,
 * situação, saliência).
 */
import { idadeDe } from './campos.ts';
import { atende, causasDe } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { FILHOS, ehFilho, papelBase, type Visao } from './constantes.ts';
import { contexto } from './contexto.ts';
import { saliencia, type Candidato } from './diretor.ts';
import type { Gatilho, Mundo } from './esquema.ts';
import type { Momento } from './pais.ts';
import { definirNumero, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { morrerPersonagem } from './pessoas.ts';
import {
  ATIVIDADE_PERSONAGEM,
  CHANCE_FALENCIA,
  CHANCE_CURA,
  DEMISSAO_BASE,
  ANOS_REMORSO,
  CONFIANCA_DA_FALTA,
  DESGASTE_CASAL,
  DISTANCIA_ADULTO,
  DISTANCIA_FILHO,
  DOENCA_POR_ANO,
  DOENCA_QUEDA,
  IDADE_APOSENTADORIA,
  MAGOA_DA_FALTA,
  MAGOA_DA_VONTADE,
  MAGOA_NO_VINCULO,
  MAGOA_REMORSO,
  PERDAO_BASE,
  RECOLOCACAO,
  VOLTA_CONFIANCA,
  RETORNO_VINCULO,
  PAQUERA_AMOR,
  VINCULO_DA_FALTA,
  VINCULO_DA_VONTADE,
  chanceDeAmor,
  chanceDoenca,
  derivaSaude,
  riscoDeMorte,
} from './regras.ts';
import { convivem, temRelacao, visaoDe } from './relacoes.ts';
import { aleatorio, normal, sortear, sortearIndice } from './rng.ts';
import { aplicarStorylet, atoresPossiveis, elegivel } from './storylets.ts';
import { causaDaFase } from './trabalho.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entidade, Entrada, EstadoVida, MemoriaJogador, Mudanca } from './tipos.ts';

/** Ordem em que as regras rodam (os mais velhos primeiro: a herança da avó chega antes); os filhos, na ordem de chegada. */
export const PAPEIS_COM_REGRAS = ['avo', 'mae', 'pai', 'amor', ...FILHOS, 'amigo', 'pet'] as const;

/** Uma mudança notável vira entrada visível na linha do tempo, com a regra como causa. */
function acontecer(
  e: EstadoVida,
  c: Conteudo,
  papel: string,
  gatilho: Gatilho,
  aplicar: (reg: Mudanca[], id: number) => void,
  textos: Record<string, string> = {},
  causas: number[] = [],
): Entrada {
  const ac = c.mundo.acontecimentos[gatilho];
  const entrada = novaEntrada(e, { tipo: 'npc', causa: 'regra', ref: `regra:${gatilho}`, ator: papel, instancia: `regra:${gatilho}#${papel}`, texto: '' });
  if (causas.length > 0) entrada.causas = causas;
  const reg: Mudanca[] = [];
  aplicar(reg, entrada.id);
  const ctx = contexto(e, { ator: papel, textos });
  entrada.texto = capitalizar(renderizar(ac ? sortear(e.rng, ac.textos) : gatilho, ctx)).trim();
  entrada.resumo = renderizar(ac?.resumo ?? gatilho, ctx);
  return lancar(e, entrada, reg);
}

function rendaDaClasse(e: EstadoVida, c: Conteudo): number {
  const classe = c.mundo.classes[e.entidades['eu']!.n['classe_origem'] ?? 2] ?? c.mundo.classes[2]!;
  const [a, b] = classe.renda;
  return Math.round(Math.exp(Math.log(Math.max(a, 1)) + aleatorio(e.rng) * (Math.log(b) - Math.log(Math.max(a, 1)))));
}

/** Para onde o vínculo de cada papel volta sem cuidado. */
function equilibrioVinculo(e: EstadoVida, c: Conteudo, papel: string): number {
  const en = e.entidades[papel]!;
  if (en.q['ausente']) return 12;
  const traco = c.tracos.get(en.t['traco'] ?? '');
  if (papel === 'amigo') return 50 + (traco?.vinculo ?? 0);
  if (papel === 'amor') return 62 + (traco?.vinculo ?? 0);
  if (ehFilho(papel)) return 68 + (traco?.vinculo ?? 0);
  if (papel === 'paixao') return 30;
  const tipo = c.mundo.familias.find((f) => f.id === e.entidades['eu']!.t['familia']);
  return (tipo?.vinculo ?? 60) + (traco?.vinculo ?? 0);
}

/**
 * A relação no ano: a mágoa passa no ritmo do perdão (do traço), a confiança volta devagar para a base, e o ano longe
 * de quem joga conta como ano sem contato (quem convive, não). Devolve os anos sem contato do começo do ano, que o
 * esfriamento do vínculo lê.
 */
function relacaoNoAno(e: EstadoVida, papel: string, en: Entidade, perdao: number, regAno: Mudanca[]): number {
  const longe = en.n['sem_contato'] ?? 0;
  if (!temRelacao(papel, en)) return longe;
  const magoa = en.n['magoa'] ?? 0;
  if (magoa > 0) somar(e, regAno, papel, 'magoa', -Math.max(Math.min(magoa, 1), magoa * perdao), 'relacao');
  const confianca = en.n['confianca'] ?? 0; // guardada como a diferença para a base
  if (Math.abs(confianca) >= 0.5) somar(e, regAno, papel, 'confianca', -confianca * VOLTA_CONFIANCA, 'relacao');
  if (convivem(e, papel, en)) {
    if (longe > 0) definirNumero(e, regAno, papel, 'sem_contato', 0, 'relacao');
  } else somar(e, regAno, papel, 'sem_contato', 1, 'relacao');
  return longe;
}

/**
 * O que a morte de alguém deixa dito na linha do tempo, pelo que foi a relação: a mágoa que ficou, os anos sem se
 * falar, ou a despedida de quem estava perto. Os textos são de mundo.json › despedidas.
 */
function fechoDaMorte(e: EstadoVida, c: Conteudo, papel: string, en: Entidade): string {
  if (!temRelacao(papel, en) || papel === 'paixao') return '';
  const qual = (en.n['magoa'] ?? 0) >= MAGOA_REMORSO ? 'magoa' : (en.n['sem_contato'] ?? 0) >= ANOS_REMORSO ? 'longe' : (en.n['vinculo'] ?? 0) >= 55 ? 'perto' : null;
  const ctx = contexto(e, { ator: papel });
  const partes = qual ? [renderizar(sortear(e.rng, c.mundo.despedidas[qual]), ctx)] : [];
  // A vontade que ficou guardada também fica dita.
  const vontade = c.mundo.vontades.find((v) => (en.q[v.id]?.v ?? 0) > 0);
  if (vontade) partes.push(capitalizar(renderizar(vontade.nunca, ctx)));
  return partes.join(' ');
}

/**
 * A falta: alguém próximo passou o ano doente, e quem joga não apareceu (nenhum storylet com a pessoa no ano, e
 * vocês não moram juntos). Vira entrada visível, com a doença como causa: a mágoa sobe (quem ama mais, espera mais),
 * a confiança cai, e a pessoa guarda a falta (`nao_apareceu`), que vira a lembrança ruim. Uma vez por doença.
 */
function faltaNoAno(e: EstadoVida, c: Conteudo, papel: string, en: Entidade, longe: number): void {
  const doente = en.q['doente'];
  if (!doente || doente.v <= 0 || doente.idade >= e.idade || longe === 0 || convivem(e, papel, en)) return;
  if ((en.n['vinculo'] ?? 0) < VINCULO_DA_FALTA || en.q['ausente'] || en.q['rompido']) return;
  const ja = en.q['nao_apareceu'];
  if (ja && ja.v > 0 && ja.idade >= doente.idade) return;
  acontecer(
    e,
    c,
    papel,
    'nao_apareceu',
    (reg, id) => {
      somar(e, reg, papel, 'magoa', MAGOA_DA_FALTA + (en.n['vinculo'] ?? 0) * 0.12);
      somar(e, reg, papel, 'confianca', -CONFIANCA_DA_FALTA);
      somar(e, reg, papel, 'vinculo', -4);
      ganhar(e, reg, papel, 'nao_apareceu', id);
    },
    {},
    doente.causa === null ? [] : [doente.causa],
  );
}

type Vontade = Mundo['vontades'][number];

/** A vontade sai do lugar: realizada pela vida, ou perdida porque a pessoa passou da idade dela. */
function vontadeSai(e: EstadoVida, papel: string, v: Vontade, como: 'realizada' | 'perdida', causas: number[]): void {
  const entrada = novaEntrada(e, { tipo: 'npc', causa: 'regra', ref: `regra:vontade_${como}`, ator: papel, instancia: `regra:${v.id}#${papel}`, texto: '' });
  if (causas.length > 0) entrada.causas = causas;
  const reg: Mudanca[] = [];
  perder(e, reg, papel, v.id);
  if (como === 'realizada') {
    somar(e, reg, papel, 'vinculo', VINCULO_DA_VONTADE);
    somar(e, reg, papel, 'magoa', -MAGOA_DA_VONTADE);
    somar(e, reg, 'eu', 'felicidade', 2);
  } else {
    somar(e, reg, papel, 'magoa', v.perdida!.magoa);
    somar(e, reg, papel, 'vinculo', -3);
  }
  const ctx = contexto(e, { ator: papel });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, como === 'realizada' ? v.realizada! : v.perdida!.textos), ctx)).trim();
  entrada.resumo = renderizar(como === 'realizada' ? `{ator.quem} viu realizada a vontade de ${v.quer}` : v.perdida!.resumo, ctx);
  lancar(e, entrada, reg);
}

/**
 * As vontades que a pessoa guarda (mundo.json › vontades): a vida realiza (`feita`), a idade leva (`ate`, e a falta
 * fica), e a vontade antiga com `pressa` vira mágoa a cada ano. Realizar pela ação de quem joga é do conteúdo.
 */
function vontadesNoAno(e: EstadoVida, c: Conteudo, papel: string, en: Entidade, regAno: Mudanca[]): void {
  for (const v of c.mundo.vontades) {
    const q = en.q[v.id];
    if (!q || q.v <= 0) continue;
    const desde = q.causa === null ? [] : [q.causa];
    if (v.feita && atende(v.feita, e, papel)) vontadeSai(e, papel, v, 'realizada', [...desde, ...causasDe(v.feita, e, papel)]);
    else if (v.ate !== undefined && v.perdida && idadeDe(e, en) > v.ate) vontadeSai(e, papel, v, 'perdida', desde);
    else if (v.pressa && e.idade - q.idade >= v.pressa.anos) somar(e, regAno, papel, 'magoa', v.pressa.magoa, 'relacao');
  }
}

/** O que a pessoa acha de quem joga muda o que ela faz: quem acha você sumido ou interesseiro procura menos. */
const VISAO_NA_AJUDA: Partial<Record<Visao, number>> = {
  sumido: 0.6,
  metido: 0.6,
  interesseiro: 0.5,
  sem_palavra: 0.7,
  perdido: 0.8,
  orgulho: 1.3,
  carinhoso: 1.25,
  presente: 1.2,
  generoso: 1.2,
  de_palavra: 1.15,
};
/** E quem acha você cabeça-quente ou sem palavra briga mais fácil; quem se sente cuidado, menos. */
const VISAO_NA_BRIGA: Partial<Record<Visao, number>> = {
  cabeca_quente: 1.4,
  sem_palavra: 1.3,
  interesseiro: 1.25,
  metido: 1.2,
  perdido: 1.2,
  carinhoso: 0.7,
  presente: 0.8,
  de_palavra: 0.8,
};

/**
 * A relação muda o que a pessoa faz: com afeto e sem mágoa, ela ajuda mais; magoada, briga mais; e o que ela acha de
 * quem joga (a visão) pesa junto. Multiplica a chance das iniciativas de ajuda e de briga, junto com o traço.
 */
export function humorDaIniciativa(en: Entidade, afinidade: 'ajuda' | 'briga', visao: Visao | '' = ''): number {
  const magoa = en.n['magoa'] ?? 0;
  if (afinidade === 'briga') return (1 + magoa / 40) * ((visao && VISAO_NA_BRIGA[visao]) || 1);
  return Math.max(0.25, Math.min(1.6, ((en.n['vinculo'] ?? 50) / 60) * (1 - magoa / 120) * ((visao && VISAO_NA_AJUDA[visao]) || 1)));
}

/** Roda as regras do ano de cada personagem vivo. Variações miúdas vão para `regAno`. */
export function regrasDosPersonagens(
  e: EstadoVida,
  c: Conteudo,
  regAno: Mudanca[],
  fase: Pick<Momento, 'desemprego' | 'retorno'> = { desemprego: 1, retorno: 0 },
): void {
  const eu = e.entidades['eu']!;
  const lugar = e.entidades['lugar'];
  const classe = c.mundo.classes[eu.n['classe_origem'] ?? 2] ?? c.mundo.classes[2]!;
  for (const papel of PAPEIS_COM_REGRAS) {
    const en = e.entidades[papel];
    if (!en || en.vivo === false) continue;
    const idade = idadeDe(e, en);
    const traco = c.tracos.get(en.t['traco'] ?? '');
    const setor = c.setores.get(en.t['setor'] ?? '');
    const fatorDoenca = traco?.doenca ?? 1;

    // ---- saúde, doença, morte
    const deriva = derivaSaude(papel === 'pet' ? idade * 6 : idade, en.n['saude'] ?? 70);
    somar(e, regAno, papel, 'saude', (deriva < 0 ? deriva * fatorDoenca : deriva) + normal(e.rng, 0, 1.5) - (en.q['doente'] ? DOENCA_POR_ANO : 0), 'saude');
    if (papel !== 'pet') {
      if (!en.q['doente'] && aleatorio(e.rng) < chanceDoenca(idade) * fatorDoenca) {
        acontecer(e, c, papel, 'adoeceu', (reg, id) => {
          ganhar(e, reg, papel, 'doente', id);
          somar(e, reg, papel, 'saude', -DOENCA_QUEDA);
          somar(e, reg, 'eu', 'felicidade', -(en.n['vinculo'] ?? 50) * 0.04);
        });
      } else if (en.q['doente'] && aleatorio(e.rng) < CHANCE_CURA) {
        acontecer(e, c, papel, 'curou', (reg) => {
          perder(e, reg, papel, 'doente');
          somar(e, reg, papel, 'saude', 6);
        });
      }
    }
    const risco = papel === 'pet' ? riscoDeMorte(idade * 6, en.n['saude'] ?? 80) : riscoDeMorte(idade, en.n['saude'] ?? 70);
    if (aleatorio(e.rng) < risco) {
      // O jeito de morrer combina com a idade (a do bicho conta em anos de gente).
      const idadeGente = papel === 'pet' ? idade * 6 : idade;
      const jeitos = c.mundo.mortesPersonagem.filter((m) => !m.idade || (idadeGente >= m.idade[0] && idadeGente <= m.idade[1]));
      acontecer(e, c, papel, 'faleceu', (reg, id) => morrerPersonagem(e, papel, reg, id), { como: sortear(e.rng, jeitos).texto, fecho: fechoDaMorte(e, c, papel, en) });
      continue;
    }

    // ---- trabalho e aposentadoria (pais)
    if ((papel === 'mae' || papel === 'pai') && !en.q['aposentado']) {
      if (idade >= IDADE_APOSENTADORIA) {
        acontecer(e, c, papel, 'aposentou', (reg, id) => {
          ganhar(e, reg, papel, 'aposentado', id);
          perder(e, reg, papel, 'desempregado');
          somar(e, reg, papel, 'renda', Math.max(18000, (en.n['renda'] ?? 0) * 0.7) - (en.n['renda'] ?? 0));
        });
      } else if (en.q['dono_do_negocio'] && fase.desemprego > 1 && aleatorio(e.rng) < CHANCE_FALENCIA * (fase.desemprego - 1) * (setor?.ciclo ?? 1)) {
        // Na recessão e na crise, o negócio da família pode quebrar: vai junto boa parte do que foi guardado.
        const pelaFase = causaDaFase(e);
        acontecer(
          e,
          c,
          papel,
          'faliu',
          (reg, id) => {
            perder(e, reg, papel, 'dono_do_negocio');
            ganhar(e, reg, papel, 'desempregado', id);
            somar(e, reg, papel, 'dinheiro', -Math.max(0, en.n['dinheiro'] ?? 0) * 0.6, undefined, 'mercado');
            somar(e, reg, papel, 'renda', -(en.n['renda'] ?? 0) * 0.7);
            const outro = e.entidades[papel === 'mae' ? 'pai' : 'mae'];
            if (!outro?.q['dono_do_negocio']) perder(e, reg, 'eu', 'negocio_familiar');
          },
          {},
          pelaFase === null ? [] : [pelaFase],
        );
      } else if (!en.q['ausente'] && !en.q['dono_do_negocio'] && !setor?.estavel && idade >= 18) {
        // Desemprego do lugar (relativo a 8%) vezes o momento do país, conforme o setor sente o ciclo.
        const desemprego = ((lugar?.n['desemprego'] ?? 0.08) / 0.08) * (1 + (fase.desemprego - 1) * (setor?.ciclo ?? 1));
        if (!en.q['desempregado'] && aleatorio(e.rng) < DEMISSAO_BASE * desemprego * (traco?.emprego ?? 1)) {
          // Numa recessão ou crise, a fase do país entra como causa da demissão (ela aumentou a chance).
          const pelaFase = fase.desemprego > 1 && (setor?.ciclo ?? 1) > 0 ? causaDaFase(e) : null;
          acontecer(
            e,
            c,
            papel,
            'demitido',
            (reg, id) => {
              ganhar(e, reg, papel, 'desempregado', id);
              somar(e, reg, papel, 'renda', -(en.n['renda'] ?? 0) * 0.7);
            },
            {},
            pelaFase === null ? [] : [pelaFase],
          );
        } else if (en.q['desempregado'] && aleatorio(e.rng) < RECOLOCACAO / desemprego) {
          acontecer(e, c, papel, 'empregado', (reg) => {
            perder(e, reg, papel, 'desempregado');
            somar(e, reg, papel, 'renda', rendaDaClasse(e, c) - (en.n['renda'] ?? 0));
          });
        }
      }
    }

    // ---- dinheiro da família
    if (papel === 'mae' || papel === 'pai' || papel === 'avo') {
      const dinheiro = en.n['dinheiro'] ?? 0;
      const trabalhando = idade < IDADE_APOSENTADORIA && !en.q['aposentado'] && !en.q['desempregado'];
      const guarda = trabalhando ? (en.n['renda'] ?? 0) * (classe.poupanca + (traco?.poupanca ?? 0)) : 0;
      const aperto = en.q['desempregado'] ? 6000 * (lugar?.n['custo_vida'] ?? 1) : 0;
      // Rende um pouco acima da inflação (e sobe e desce com o ciclo); depois dos 65, a saúde e a família consomem parte do que foi guardado.
      const rende = Math.max(0, dinheiro) * ((idade >= IDADE_APOSENTADORIA ? -0.03 : 0.01) + fase.retorno);
      somar(e, regAno, papel, 'dinheiro', guarda - aperto + rende, 'dinheiro', 'mercado');
    }

    // ---- a relação: a mágoa passa no ritmo do perdão do traço, a confiança volta devagar, e o ano longe conta (bicho não tem)
    if (papel === 'pet') continue;
    // As vontades leem o ano que passou (a visita zera os anos sem contato) antes de o ano novo contar.
    vontadesNoAno(e, c, papel, en, regAno);
    const longe = relacaoNoAno(e, papel, en, traco?.perdao ?? PERDAO_BASE, regAno);
    faltaNoAno(e, c, papel, en, longe);

    // ---- vínculo: volta para o jeito da família, menos a mágoa; esfria no ano sem contato da vida adulta
    const v = en.n['vinculo'] ?? 50;
    let dv = (equilibrioVinculo(e, c, papel) - MAGOA_NO_VINCULO * (en.n['magoa'] ?? 0) - v) * RETORNO_VINCULO;
    if (e.idade >= 20 && (papel === 'mae' || papel === 'pai' || papel === 'avo' || papel === 'amigo')) {
      const junto = papel === 'avo' ? en.q['mora_junto'] : eu.q['mora_com_pais'];
      // Quem se falou no ano não esfria; dois anos ou mais longe esfria mais.
      if (!junto && longe > 0) dv -= DISTANCIA_ADULTO * (papel === 'amigo' ? 1.6 : 1) * Math.min(1.5, 0.5 + 0.5 * longe);
    }
    // A rotina gasta o namoro; filho adulto cria a própria vida.
    if (papel === 'amor') dv -= DESGASTE_CASAL;
    if (ehFilho(papel) && idade >= 18) dv -= DISTANCIA_ADULTO * DISTANCIA_FILHO;
    somar(e, regAno, papel, 'vinculo', dv, 'vinculo');
  }
}

/**
 * Alguém aparece na vida de quem está sem namoro: a regra agenda o storylet
 * "namoro" para o ano. Sair e conhecer gente (paquera), a aparência e o traço
 * mudam a chance; a última paquera vira a causa do encontro.
 */
export function regraDoAmor(e: EstadoVida, c: Conteudo): void {
  const eu = e.entidades['eu']!;
  if (eu.q['namoro'] || !c.porId.has('namoro') || e.agenda.some((a) => a.evento === 'namoro')) return;
  const paquera = eu.q['paquera'];
  const traco = c.tracosJogador.get(eu.t['traco'] ?? '');
  const aparencia = 0.6 + (eu.n['aparencia'] ?? 50) / 125;
  const chance = chanceDeAmor(e.idade) * (1 + PAQUERA_AMOR * Math.min(3, paquera?.v ?? 0)) * aparencia * (traco?.amor ?? 1);
  if (aleatorio(e.rng) < chance) e.agenda.push({ evento: 'namoro', ano: e.ano, origem: paquera?.causa ?? null });
}

/**
 * Cada personagem pode tomar uma iniciativa no ano: a regra dele sorteia um
 * storylet entre os possíveis (pela saliência) e decide se age, com chance
 * que cresce com a tensão do storylet e com a afinidade do traço (o generoso
 * ajuda mais, o brigão briga mais). Tensão 3 ou mais: age com certeza. As
 * iniciativas sem escolha acontecem já (causa "npc"); as com escolha voltam
 * como candidatas para o diretor, que dá o toque ao jogador.
 */
export function personagensAgem(e: EstadoVida, c: Conteudo, memoria: MemoriaJogador | undefined): Candidato[] {
  const comEscolha: Candidato[] = [];
  for (const papel of PAPEIS_COM_REGRAS) {
    const lista = c.npcPorPapel.get(papelBase(papel));
    const en = e.entidades[papel];
    if (!lista || !en || !e.vivo) continue;
    const vivo = en.vivo !== false;
    const elegiveis = lista.filter((s) => (vivo || atoresPossiveis(s, e).includes(papel)) && elegivel(s, e, papel));
    if (elegiveis.length === 0) continue;
    // A chance de agir vem do storylet mais tenso e do traço; a saliência só é calculada se alguém age.
    const traco = c.tracos.get(en.t['traco'] ?? '');
    const visao = vivo ? visaoDe(e, papel, en) : '';
    let chance = 0;
    for (const s of elegiveis) {
      const tensao = s.tensao ?? 1;
      const afinidade = s.afinidade ? (traco?.[s.afinidade] ?? 1) * humorDaIniciativa(en, s.afinidade, visao) : 1;
      chance = Math.max(chance, tensao >= 3 ? 1 : Math.min(1, ATIVIDADE_PERSONAGEM * tensao * afinidade));
    }
    if (aleatorio(e.rng) >= chance) continue;
    const pesos = elegiveis.map((s) => saliencia(s, e, papel, memoria) * (s.afinidade ? (traco?.[s.afinidade] ?? 1) * humorDaIniciativa(en, s.afinidade, visao) : 1));
    const i = sortearIndice(e.rng, pesos);
    if (i < 0) continue;
    const s = elegiveis[i]!;
    const escolhido: Candidato = { s, ator: papel, causa: 'npc', causas: causasDe(s.condicoes, e, papel), saliencia: pesos[i]!, urgente: (s.tensao ?? 1) >= 2 };
    if (s.escolhas) comEscolha.push(escolhido);
    else aplicarStorylet(e, c, s, papel, 'npc', { causas: escolhido.causas });
  }
  return comEscolha;
}
