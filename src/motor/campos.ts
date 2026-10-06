/**
 * Os campos de cada tipo de entidade e como ler um caminho ("mae.saude",
 * "lugar.desemprego", "fumante"). Sem ponto, o caminho é de quem joga (`eu`).
 * O que não é campo é qualidade (valor 0 quando não existe).
 */
import { CLASSES, ENTIDADES } from './constantes.ts';
import type { Entidade, EstadoVida } from './tipos.ts';

/** Sistemas do jogo: uma ação precisa mexer em pelo menos dois; um campo precisa ser lido por dois. */
export type Sistema = 'corpo' | 'humor' | 'mente' | 'dinheiro' | 'relacoes' | 'carreira' | 'carater' | 'origem' | 'mundo' | 'historia';

export interface DefCampo {
  tipo: 'num' | 'texto' | 'bool';
  sistema: Sistema;
  /** Calculado a partir do estado: só leitura. */
  derivado?: boolean;
  /** Em reais de hoje (o texto mostra como dinheiro). */
  reais?: boolean;
  limites?: readonly [number, number];
}

const PESSOA: Record<string, DefCampo> = {
  saude: { tipo: 'num', sistema: 'corpo', limites: [0, 100] },
  felicidade: { tipo: 'num', sistema: 'humor', limites: [0, 100] },
  inteligencia: { tipo: 'num', sistema: 'mente', limites: [0, 100] },
  aparencia: { tipo: 'num', sistema: 'corpo', limites: [0, 100] },
  /** Vínculo com quem joga. */
  vinculo: { tipo: 'num', sistema: 'relacoes', limites: [0, 100] },
  dinheiro: { tipo: 'num', sistema: 'dinheiro', reais: true },
  investido: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  divida: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Renda e custo anuais. */
  renda: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  custo: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  ocupacao: { tipo: 'texto', sistema: 'carreira' },
  traco: { tipo: 'texto', sistema: 'carater' },
  /** Origem de quem joga: classe (0 a 5), riqueza da família ao nascer e tipo de família. */
  classe_origem: { tipo: 'num', sistema: 'origem', limites: [0, 5] },
  riqueza_origem: { tipo: 'num', sistema: 'origem', reais: true },
  familia: { tipo: 'texto', sistema: 'origem' },
  idade: { tipo: 'num', sistema: 'corpo', derivado: true },
  vivo: { tipo: 'bool', sistema: 'corpo', derivado: true },
  patrimonio: { tipo: 'num', sistema: 'dinheiro', derivado: true, reais: true },
  /** Classe atual (0 a 5) pelo patrimônio. */
  classe: { tipo: 'num', sistema: 'dinheiro', derivado: true },
  nome: { tipo: 'texto', sistema: 'relacoes', derivado: true },
  genero: { tipo: 'texto', sistema: 'relacoes', derivado: true },
  /** "sua mãe", "seu pai", "sua amiga Ana": o personagem como sujeito de uma frase. */
  quem: { tipo: 'texto', sistema: 'relacoes', derivado: true },
};

const LUGAR: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'mundo', derivado: true },
  uf: { tipo: 'texto', sistema: 'mundo' },
  regiao: { tipo: 'texto', sistema: 'mundo' },
  /** Taxa de desemprego (0,08 = 8%). */
  desemprego: { tipo: 'num', sistema: 'mundo', limites: [0, 1] },
  /** Custo de vida relativo à média do país (1 = média). */
  custo_vida: { tipo: 'num', sistema: 'mundo', limites: [0.3, 3] },
};

const PAIS: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'mundo', derivado: true },
  /** Inflação do último ano, em %. */
  inflacao: { tipo: 'num', sistema: 'mundo' },
};

export function camposDe(ent: string): Record<string, DefCampo> {
  if (ent === 'lugar') return LUGAR;
  if (ent === 'pais') return PAIS;
  return PESSOA;
}

const ENTIDADES_VALIDAS = new Set<string>([...ENTIDADES, 'ator']);

export function entidadeValida(ent: string): boolean {
  return ENTIDADES_VALIDAS.has(ent);
}

export interface Caminho {
  ent: string;
  campo: string;
}

export function separar(caminho: string): Caminho {
  const i = caminho.indexOf('.');
  return i < 0 ? { ent: 'eu', campo: caminho } : { ent: caminho.slice(0, i), campo: caminho.slice(i + 1) };
}

/** Definição do campo, ou undefined quando o nome é de uma qualidade. */
export function defCampo(ent: string, campo: string): DefCampo | undefined {
  return camposDe(ent)[campo];
}

/** Resolve `ator` para o papel ligado ao storylet. */
export function entidadeDe(ent: string, ator: string | undefined): string {
  return ent === 'ator' ? (ator ?? 'ator') : ent;
}

export function idadeDe(e: EstadoVida, en: Entidade): number {
  if (en.nascimento === undefined) return 0;
  return (en.vivo === false && en.morte !== undefined ? en.morte : e.ano) - en.nascimento;
}

export function patrimonioDe(en: Entidade): number {
  return (en.n['dinheiro'] ?? 0) + (en.n['investido'] ?? 0) - (en.n['divida'] ?? 0);
}

/** Limites das classes por patrimônio (reais de hoje): abaixo de LIMITES[i] está a classe i. */
export const LIMITES_CLASSE = [5000, 40000, 200000, 1000000, 5000000, Infinity] as const;

export function classeDoPatrimonio(p: number): number {
  return LIMITES_CLASSE.findIndex((ate) => p < ate);
}

export function nomeDaClasse(i: number): string {
  return CLASSES[Math.max(0, Math.min(CLASSES.length - 1, i))]!;
}

const QUEM: Record<string, [string, string]> = {
  mae: ['sua mãe', 'sua mãe'],
  pai: ['seu pai', 'seu pai'],
  avo: ['seu avô', 'sua avó'],
  filho: ['seu filho', 'sua filha'],
};

export function quemE(id: string, en: Entidade): string {
  const fixo = QUEM[id];
  if (fixo) return en.genero === 'f' ? fixo[1] : fixo[0];
  if (id === 'amigo') return en.genero === 'f' ? `sua amiga ${en.nome}` : `seu amigo ${en.nome}`;
  if (id === 'pet') return en.nome;
  return en.nome;
}

/** Valor de um caminho já resolvido. Qualidade inexistente vale 0; entidade inexistente, undefined. */
export function ler(e: EstadoVida, ent: string, campo: string): number | string | boolean | undefined {
  const en = e.entidades[ent];
  if (!en) return undefined;
  const def = defCampo(ent, campo);
  if (!def) return en.q[campo]?.v ?? 0;
  if (def.derivado) {
    switch (campo) {
      case 'idade':
        return idadeDe(e, en);
      case 'vivo':
        return en.vivo !== false;
      case 'patrimonio':
        return patrimonioDe(en);
      case 'classe':
        return classeDoPatrimonio(patrimonioDe(en));
      case 'nome':
        return en.nome;
      case 'genero':
        return en.genero ?? 'm';
      case 'quem':
        return quemE(ent, en);
    }
    return undefined;
  }
  return def.tipo === 'texto' ? (en.t[campo] ?? '') : (en.n[campo] ?? 0);
}

export function lerCaminho(e: EstadoVida, caminho: string, ator?: string): number | string | boolean | undefined {
  const { ent, campo } = separar(caminho);
  return ler(e, entidadeDe(ent, ator), campo);
}
