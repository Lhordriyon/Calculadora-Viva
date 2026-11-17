/**
 * A observação de quem joga, guardada no aparelho (etapa 03, I-199). Fica numa chave própria, separada do save: o save
 * não muda de formato, e uma observação estragada nunca impede o jogo (volta vazia). Nada é enviado: exportar é uma
 * escolha de quem joga, pelo menu.
 *
 * Guarda as últimas vidas inteiras (comando a comando) e, das mais antigas, só um resumo; os números vão arredondados.
 * A partida (a família que segue pelos herdeiros) é um código tirado da semente da primeira vida, sem dado pessoal.
 */
import type { Conteudo } from '../motor/conteudo.ts';
import type { Gravacao } from '../motor/caminho.ts';
import { extremosDaVida } from '../motor/extremos.ts';
import { comecarObservacao, observarComando, observarPeloLivro, terminarObservacao, type Registro, type VidaObservada } from '../motor/observacao.ts';
import { perfisDaVida, type Perfil } from '../motor/perfis.ts';
import { saturacaoDaVida } from '../motor/saturacao.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { CHAVE_DA_OBSERVACAO, escreverArquivoDeObservacao } from './formato-da-observacao.ts';

export { CHAVE_DA_OBSERVACAO };
const VERSAO = 1;
/** Quantas vidas inteiras ficam guardadas (cada uma tem uns 150 KB; o save sempre passa na frente, salvar.ts). */
export const VIDAS_INTEIRAS = 3;
export const RESUMOS = 60;

export interface ResumoDeVida {
  partida: string;
  geracao: number;
  inicio: number;
  fim: number;
  idade: number;
  patrimonioSobrePib: number;
  percentil: number;
  perfis: { perfil: Perfil; p: number }[];
  saturacao: number;
  esgotadoDesde: number | null;
  extremos: string[];
}

export interface Observacao {
  versao: number;
  ligada: boolean;
  partida: string | null;
  vidas: VidaObservada[];
  resumos: ResumoDeVida[];
}

export function observacaoVazia(): Observacao {
  return { versao: VERSAO, ligada: true, partida: null, vidas: [], resumos: [] };
}

function armazenamento(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Lê a observação; sem armazenamento, estragada ou de outra versão, volta vazia (o jogo segue). */
export function lerObservacao(): Observacao {
  try {
    const texto = armazenamento()?.getItem(CHAVE_DA_OBSERVACAO);
    if (!texto) return observacaoVazia();
    const o = JSON.parse(texto) as Partial<Observacao>;
    if (o.versao !== VERSAO || !Array.isArray(o.vidas) || !Array.isArray(o.resumos)) return observacaoVazia();
    return { versao: VERSAO, ligada: o.ligada !== false, partida: typeof o.partida === 'string' ? o.partida : null, vidas: o.vidas, resumos: o.resumos };
  } catch {
    return observacaoVazia();
  }
}

/** Grava; se o armazenamento estiver cheio, tira as vidas inteiras mais antigas e tenta de novo. Nunca lança. */
export function gravarObservacao(o: Observacao): boolean {
  const ls = armazenamento();
  if (!ls) return false;
  const copia: Observacao = { ...o, vidas: [...o.vidas], resumos: [...o.resumos] };
  for (let tentativa = 0; tentativa < 6; tentativa++) {
    try {
      ls.setItem(CHAVE_DA_OBSERVACAO, JSON.stringify(copia));
      return true;
    } catch {
      if (copia.vidas.length > 0) copia.vidas.shift();
      else if (copia.resumos.length > 0) copia.resumos.splice(0, Math.ceil(copia.resumos.length / 2));
      else return false;
    }
  }
  return false;
}

export function ligarObservacao(ligada: boolean): void {
  const o = lerObservacao();
  gravarObservacao({ ...o, ligada });
}

export function apagarObservacao(): void {
  try {
    armazenamento()?.removeItem(CHAVE_DA_OBSERVACAO);
  } catch {
    // Sem armazenamento, não havia o que apagar.
  }
}

/** A vida nova da primeira geração começa uma partida; a do herdeiro continua a da família. */
export function comecarPartida(vida: EstadoVida): void {
  const o = lerObservacao();
  if (!o.ligada) return;
  if ((vida.dinastia?.geracao ?? 1) > 1 && o.partida) return;
  gravarObservacao({ ...o, partida: `p${vida.semente.toString(36)}` });
}

/** Arredonda (e o −0 vira 0, que o JSON escreveria igual). */
const redondo = (x: number): number => (Math.abs(x) >= 100 ? Math.round(x) : Math.round(x * 1e4) / 1e4) || 0;

function compactarRegistro(r: Registro): Registro {
  return {
    ...r,
    antes: redondo(r.antes),
    efeito: { patrimonio: redondo(r.efeito.patrimonio), felicidade: redondo(r.efeito.felicidade), influencia: redondo(r.efeito.influencia), entradas: r.efeito.entradas },
    refs: r.refs.slice(0, 3),
    ...(r.opcoes ? { opcoes: { ...r.opcoes, motivos: r.opcoes.motivos.slice(0, 2) } } : {}),
  };
}

/** Os números arredondados (o que a análise usa não precisa de centavos) e as listas curtas. */
export function compactar(v: VidaObservada): VidaObservada {
  return {
    ...v,
    registros: v.registros.map(compactarRegistro),
    anos: v.anos.map((f) => Object.fromEntries(Object.entries(f).map(([k, x]) => [k, typeof x === 'number' ? redondo(x) : x])) as typeof f),
  };
}

export function resumir(v: VidaObservada): ResumoDeVida {
  const p = perfisDaVida(v);
  const s = saturacaoDaVida(v);
  return {
    partida: v.partida,
    geracao: v.geracao,
    inicio: v.inicio,
    fim: v.fim?.ano ?? v.anos.at(-1)?.ano ?? v.inicio,
    idade: v.fim?.idade ?? v.anos.at(-1)?.idade ?? 0,
    patrimonioSobrePib: v.fim?.patrimonioSobrePib ?? 0,
    percentil: v.fim?.percentil ?? 0,
    perfis: p.vida.filter((x) => x.p >= 0.5).map((x) => ({ perfil: x.perfil, p: redondo(x.p) })),
    saturacao: redondo(s.media),
    esgotadoDesde: s.esgotadoDesde,
    extremos: extremosDaVida(v).map((a) => `${a.tipo}:${a.nivel}`),
  };
}

/** Guarda a vida observada: inteira entre as últimas, e o resumo das que saem. */
export function guardarVidaObservada(v: VidaObservada): void {
  const o = lerObservacao();
  if (!o.ligada) return;
  const vidas = [...o.vidas, compactar(v)];
  const resumos = [...o.resumos];
  while (vidas.length > VIDAS_INTEIRAS) resumos.push(resumir(vidas.shift()!));
  gravarObservacao({ ...o, vidas, resumos: resumos.slice(-RESUMOS) });
}

/** Quantos comandos a observação refaz antes de devolver a vez à interface (uns 15 ms num computador, a 0,7 ms por comando). */
const COMANDOS_POR_VEZ = 20;
const cederAVez = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

/**
 * Observa a vida que acabou: refaz a gravação comando a comando, confere que a vida refeita é a mesma (senão, observa
 * pelo livro) e guarda. Roda depois do cartão aparecer, em pedaços que devolvem a vez à interface (a vida inteira
 * refeita com o observador leva uns 240 ms num computador): nunca no caminho do toque, e um erro aqui não chega ao jogo.
 */
export async function observarVidaQueAcabou(c: Conteudo, vida: EstadoVida, gravacao: Gravacao | undefined, ceder: () => Promise<void> = cederAVez): Promise<VidaObservada | null> {
  try {
    const o = lerObservacao();
    if (!o.ligada) return null;
    const rotulo = { fonte: 'jogador' as const, partida: o.partida ?? `p${vida.semente.toString(36)}` };
    let observada: VidaObservada | null = null;
    if (gravacao) {
      const estado = structuredClone(gravacao.inicio);
      const obs = comecarObservacao(estado, c, rotulo, gravacao.memoria);
      for (let i = 0; i < gravacao.comandos.length; i++) {
        observarComando(obs, estado, c, gravacao.memoria, gravacao.comandos[i]!);
        if (i % COMANDOS_POR_VEZ === COMANDOS_POR_VEZ - 1) await ceder();
      }
      const v = terminarObservacao(obs, estado);
      const mesma = estado.historico.length === vida.historico.length && estado.historico.at(-1)?.id === vida.historico.at(-1)?.id && estado.idade === vida.idade;
      if (mesma) observada = v;
    }
    observada ??= observarPeloLivro(vida, c, rotulo);
    guardarVidaObservada(observada);
    return observada;
  } catch {
    return null;
  }
}

/** O texto que o menu exporta: as vidas inteiras guardadas e a vida de agora (pelo livro), sem nomes. */
export function textoParaExportar(c: Conteudo, vidaAtual: EstadoVida | null): string {
  const o = lerObservacao();
  const vidas = [...o.vidas];
  if (vidaAtual?.vivo) {
    try {
      vidas.push(compactar(observarPeloLivro(vidaAtual, c, { fonte: 'jogador', partida: o.partida ?? `p${vidaAtual.semente.toString(36)}` })));
    } catch {
      // A vida de agora fica de fora; as guardadas vão.
    }
  }
  return escreverArquivoDeObservacao(vidas);
}
