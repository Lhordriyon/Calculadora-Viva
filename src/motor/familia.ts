/**
 * Família viva: as regras anuais dos personagens. Eles envelhecem, adoecem,
 * saram, morrem, perdem e ganham emprego, se aposentam, juntam ou gastam
 * dinheiro, e o vínculo com quem joga volta devagar para o jeito da família
 * (e esfria sem contato na vida adulta). Depois disso, cada um pode tomar uma
 * iniciativa: um storylet de personagem, escolhido pela regra dele (traço,
 * situação, saliência).
 */
import { idadeDe } from './campos.ts';
import { causasDe } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { saliencia, type Candidato } from './diretor.ts';
import type { Gatilho } from './esquema.ts';
import { ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { morrerPersonagem } from './pessoas.ts';
import {
  ATIVIDADE_PERSONAGEM,
  CHANCE_CURA,
  DEMISSAO_BASE,
  DESGASTE_CASAL,
  DISTANCIA_ADULTO,
  DISTANCIA_FILHO,
  DOENCA_POR_ANO,
  DOENCA_QUEDA,
  IDADE_APOSENTADORIA,
  RECOLOCACAO,
  RETORNO_VINCULO,
  PAQUERA_AMOR,
  chanceDeAmor,
  chanceDoenca,
  derivaSaude,
  riscoDeMorte,
} from './regras.ts';
import { aleatorio, normal, sortear, sortearIndice } from './rng.ts';
import { aplicarStorylet, atoresPossiveis, elegivel } from './storylets.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entrada, EstadoVida, MemoriaJogador, Mudanca } from './tipos.ts';

/** Ordem em que as regras rodam (os mais velhos primeiro: a herança da avó chega antes). */
export const PAPEIS_COM_REGRAS = ['avo', 'mae', 'pai', 'amor', 'filho', 'amigo', 'pet'] as const;

/** Uma mudança notável vira entrada visível na linha do tempo, com a regra como causa. */
function acontecer(
  e: EstadoVida,
  c: Conteudo,
  papel: string,
  gatilho: Gatilho,
  aplicar: (reg: Mudanca[], id: number) => void,
  textos: Record<string, string> = {},
): Entrada {
  const ac = c.mundo.acontecimentos[gatilho];
  const entrada = novaEntrada(e, { tipo: 'npc', causa: 'regra', ref: `regra:${gatilho}`, ator: papel, instancia: `regra:${gatilho}#${papel}`, texto: '' });
  const reg: Mudanca[] = [];
  aplicar(reg, entrada.id);
  const ctx = contexto(e, { ator: papel, textos });
  entrada.texto = capitalizar(renderizar(ac ? sortear(e.rng, ac.textos) : gatilho, ctx));
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
  if (papel === 'filho') return 68 + (traco?.vinculo ?? 0);
  if (papel === 'paixao') return 30;
  const tipo = c.mundo.familias.find((f) => f.id === e.entidades['eu']!.t['familia']);
  return (tipo?.vinculo ?? 60) + (traco?.vinculo ?? 0);
}

/** Roda as regras do ano de cada personagem vivo. Variações miúdas vão para `regAno`. */
export function regrasDosPersonagens(e: EstadoVida, c: Conteudo, regAno: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const lugar = e.entidades['lugar'];
  const classe = c.mundo.classes[eu.n['classe_origem'] ?? 2] ?? c.mundo.classes[2]!;
  for (const papel of PAPEIS_COM_REGRAS) {
    const en = e.entidades[papel];
    if (!en || en.vivo === false) continue;
    const idade = idadeDe(e, en);
    const traco = c.tracos.get(en.t['traco'] ?? '');
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
      acontecer(e, c, papel, 'faleceu', (reg, id) => morrerPersonagem(e, papel, reg, id), { como: sortear(e.rng, c.mundo.mortesPersonagem) });
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
      } else if (!en.q['ausente'] && !en.q['dono_do_negocio'] && idade >= 18) {
        const desemprego = (lugar?.n['desemprego'] ?? 0.08) / 0.08;
        if (!en.q['desempregado'] && aleatorio(e.rng) < DEMISSAO_BASE * desemprego * (traco?.emprego ?? 1)) {
          acontecer(e, c, papel, 'demitido', (reg, id) => {
            ganhar(e, reg, papel, 'desempregado', id);
            somar(e, reg, papel, 'renda', -(en.n['renda'] ?? 0) * 0.7);
          });
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
      // Rende um pouco acima da inflação; depois dos 65, a saúde e a família consomem parte do que foi guardado.
      const rende = Math.max(0, dinheiro) * (idade >= IDADE_APOSENTADORIA ? -0.03 : 0.01);
      somar(e, regAno, papel, 'dinheiro', guarda - aperto + rende, 'dinheiro');
    }

    // ---- vínculo: volta para o jeito da família; esfria sem contato na vida adulta (bicho não tem)
    if (papel === 'pet') continue;
    const v = en.n['vinculo'] ?? 50;
    let dv = (equilibrioVinculo(e, c, papel) - v) * RETORNO_VINCULO;
    if (e.idade >= 20 && (papel === 'mae' || papel === 'pai' || papel === 'avo' || papel === 'amigo')) {
      const junto = papel === 'avo' ? en.q['mora_junto'] : eu.q['mora_com_pais'];
      if (!junto) dv -= DISTANCIA_ADULTO * (papel === 'amigo' ? 1.6 : 1);
    }
    // A rotina gasta o namoro; filho adulto cria a própria vida.
    if (papel === 'amor') dv -= DESGASTE_CASAL;
    if (papel === 'filho' && idade >= 18) dv -= DISTANCIA_ADULTO * DISTANCIA_FILHO;
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
    const lista = c.npcPorPapel.get(papel);
    const en = e.entidades[papel];
    if (!lista || !en || !e.vivo) continue;
    const vivo = en.vivo !== false;
    const elegiveis = lista.filter((s) => (vivo || atoresPossiveis(s, e).includes(papel)) && elegivel(s, e, papel));
    if (elegiveis.length === 0) continue;
    // A chance de agir vem do storylet mais tenso e do traço; a saliência só é calculada se alguém age.
    const traco = c.tracos.get(en.t['traco'] ?? '');
    let chance = 0;
    for (const s of elegiveis) {
      const tensao = s.tensao ?? 1;
      const afinidade = s.afinidade ? (traco?.[s.afinidade] ?? 1) : 1;
      chance = Math.max(chance, tensao >= 3 ? 1 : Math.min(1, ATIVIDADE_PERSONAGEM * tensao * afinidade));
    }
    if (aleatorio(e.rng) >= chance) continue;
    const pesos = elegiveis.map((s) => saliencia(s, e, papel, memoria) * (s.afinidade ? (traco?.[s.afinidade] ?? 1) : 1));
    const i = sortearIndice(e.rng, pesos);
    if (i < 0) continue;
    const s = elegiveis[i]!;
    const escolhido: Candidato = { s, ator: papel, causa: 'npc', causas: causasDe(s.condicoes, e, papel), saliencia: pesos[i]!, urgente: (s.tensao ?? 1) >= 2 };
    if (s.escolhas) comEscolha.push(escolhido);
    else aplicarStorylet(e, c, s, papel, 'npc', { causas: escolhido.causas });
  }
  return comEscolha;
}
