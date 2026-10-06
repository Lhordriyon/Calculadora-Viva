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
import { candidatosDe, type Candidato } from './diretor.ts';
import type { Gatilho } from './esquema.ts';
import { ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { morrerPersonagem } from './pessoas.ts';
import {
  ATIVIDADE_PERSONAGEM,
  CHANCE_CURA,
  DEMISSAO_BASE,
  DISTANCIA_ADULTO,
  DOENCA_POR_ANO,
  DOENCA_QUEDA,
  IDADE_APOSENTADORIA,
  RECOLOCACAO,
  RETORNO_VINCULO,
  chanceDoenca,
  derivaSaude,
  riscoDeMorte,
} from './regras.ts';
import { aleatorio, normal, sortear, sortearIndice } from './rng.ts';
import { aplicarStorylet } from './storylets.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entrada, EstadoVida, MemoriaJogador, Mudanca } from './tipos.ts';

/** Ordem em que as regras rodam (os mais velhos primeiro: a herança da avó chega antes). */
export const PAPEIS_COM_REGRAS = ['avo', 'mae', 'pai', 'amor', 'filho', 'amigo', 'paixao', 'pet'] as const;

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
  if (papel === 'filho') return 68;
  if (papel === 'pet') return 85;
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
    const deriva = derivaSaude(idade, en.n['saude'] ?? 70);
    somar(e, regAno, papel, 'saude', (deriva < 0 ? deriva * fatorDoenca : deriva) + normal(e.rng, 0, 1.5) - (en.q['doente'] ? DOENCA_POR_ANO : 0), 'saude');
    if (papel !== 'pet' && papel !== 'paixao') {
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
      const guarda = (en.n['renda'] ?? 0) * (classe.poupanca + (traco?.poupanca ?? 0));
      const aperto = en.q['desempregado'] ? 6000 * (lugar?.n['custo_vida'] ?? 1) : 0;
      const rende = Math.max(0, en.n['dinheiro'] ?? 0) * 0.015;
      somar(e, regAno, papel, 'dinheiro', guarda - aperto + rende, 'dinheiro');
    }

    // ---- vínculo: volta para o jeito da família; esfria sem contato na vida adulta
    const v = en.n['vinculo'] ?? 50;
    let dv = (equilibrioVinculo(e, c, papel) - v) * RETORNO_VINCULO;
    if (e.idade >= 20 && (papel === 'mae' || papel === 'pai' || papel === 'avo' || papel === 'amigo')) {
      const junto = papel === 'avo' ? en.q['mora_junto'] : eu.q['mora_com_pais'];
      if (!junto) dv -= DISTANCIA_ADULTO * (papel === 'amigo' ? 1.6 : 1);
    }
    somar(e, regAno, papel, 'vinculo', dv, 'vinculo');
  }
}

/**
 * Cada personagem pode tomar uma iniciativa no ano. As sem escolha acontecem
 * já (entram no livro com causa "npc"); as com escolha voltam como candidatas
 * para o diretor, que dá o toque ao jogador.
 */
export function personagensAgem(e: EstadoVida, c: Conteudo, memoria: MemoriaJogador | undefined): Candidato[] {
  const comEscolha: Candidato[] = [];
  for (const papel of PAPEIS_COM_REGRAS) {
    const lista = c.npcPorPapel.get(papel);
    const en = e.entidades[papel];
    if (!lista || !en || !e.vivo) continue;
    const candidatos = candidatosDe(lista, e, memoria, 'npc', (s) => (s.tensao ?? 1) >= 2).filter((x) => x.ator === papel);
    if (candidatos.length === 0) continue;
    const traco = c.tracos.get(en.t['traco'] ?? '');
    for (const x of candidatos) {
      if (x.s.afinidade) x.saliencia *= traco?.[x.s.afinidade] ?? 1;
    }
    const urgentes = candidatos.filter((x) => x.urgente);
    if (urgentes.length === 0 && aleatorio(e.rng) >= ATIVIDADE_PERSONAGEM) continue;
    const pool = urgentes.length > 0 ? urgentes : candidatos;
    const i = sortearIndice(e.rng, pool.map((x) => x.saliencia));
    if (i < 0) continue;
    const escolhido = pool[i]!;
    if (escolhido.s.escolhas) comEscolha.push(escolhido);
    else aplicarStorylet(e, c, escolhido.s, papel, 'npc', { causas: causasDe(escolhido.s.condicoes, e, papel) });
  }
  return comEscolha;
}
