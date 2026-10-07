/**
 * Os campos de cada tipo de entidade e como ler um caminho ("mae.saude",
 * "lugar.desemprego", "fumante"). Sem ponto, o caminho é de quem joga (`eu`).
 * O que não é campo é qualidade (valor 0 quando não existe).
 */
import { ATIVOS, CLASSES, ENTIDADES } from './constantes.ts';
import type { Entidade, EstadoVida } from './tipos.ts';

/** Sistemas do jogo: uma ação precisa mexer em pelo menos dois; um campo precisa ser lido por dois. */
export type Sistema = 'corpo' | 'humor' | 'mente' | 'dinheiro' | 'relacoes' | 'carreira' | 'carater' | 'origem' | 'mundo' | 'poder' | 'historia';

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
  /** O que está investido, por classe (rende conforme a fase do país). */
  renda_fixa: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  acoes: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  fii: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  dolar: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  cripto: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Soma das classes investidas. */
  investido: { tipo: 'num', sistema: 'dinheiro', derivado: true, reais: true },
  /** Perfil de investidor (conservador, moderado, arrojado): para onde vai o dinheiro novo. */
  perfil: { tipo: 'texto', sistema: 'dinheiro' },
  /** Padrão de vida (simples, confortavel, luxo): quanto da sobra do ano vira gasto. */
  padrao: { tipo: 'texto', sistema: 'dinheiro' },
  divida: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Renda e custo anuais. */
  renda: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  custo: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  ocupacao: { tipo: 'texto', sistema: 'carreira' },
  /** Profissão escolhida na folha Carreira (id de mundo.json › carreiras) e o cargo nela (0 = o primeiro). */
  carreira: { tipo: 'texto', sistema: 'carreira' },
  nivel: { tipo: 'num', sistema: 'carreira', limites: [0, 5] },
  /** Quanto o mundo escuta você (0 a 100): dinheiro, cargo, fama, bens e mídia. Decide eleições e portas que se abrem. */
  influencia: { tipo: 'num', sistema: 'poder', limites: [0, 100] },
  /** Quanto gente que você não conhece sabe quem você é (0 a 100). */
  fama: { tipo: 'num', sistema: 'relacoes', limites: [0, 100] },
  /** Aprovação de quem governa (0 a 100); abaixo de 20 o cargo balança. */
  popularidade: { tipo: 'num', sistema: 'poder', limites: [0, 100] },
  /** Cargo de poder (id de mundo.json › cargos: vereador, prefeito, presidente, rei, ditador…) e anos de mandato que faltam. */
  cargo: { tipo: 'texto', sistema: 'poder' },
  mandato: { tipo: 'num', sistema: 'poder', limites: [0, 8] },
  /** Para quem vai tudo quando quem joga morrer ('' = a lei: filho, senão sobrinho; amor, amigo, causa, pet). */
  testamento: { tipo: 'texto', sistema: 'historia' },
  /** Setor da economia em que a pessoa trabalha (id de mundo.json › setores). */
  setor: { tipo: 'texto', sistema: 'carreira' },
  /** Área da faculdade (saude, tecnologia, educacao, negocios, engenharia, artes). */
  curso: { tipo: 'texto', sistema: 'mente' },
  traco: { tipo: 'texto', sistema: 'carater' },
  /** Origem de quem joga: classe (0 a 7), riqueza da família ao nascer e tipo de família. */
  classe_origem: { tipo: 'num', sistema: 'origem', limites: [0, 7] },
  riqueza_origem: { tipo: 'num', sistema: 'origem', reais: true },
  familia: { tipo: 'texto', sistema: 'origem' },
  /** Irmãos de quem joga: dividem a herança dos pais. */
  irmaos: { tipo: 'num', sistema: 'origem', limites: [0, 8] },
  idade: { tipo: 'num', sistema: 'corpo', derivado: true },
  vivo: { tipo: 'bool', sistema: 'corpo', derivado: true },
  patrimonio: { tipo: 'num', sistema: 'dinheiro', derivado: true, reais: true },
  /** Classe atual (0 a 7) pelo patrimônio. */
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
  /** Quanto cada classe de investimento rendeu no último ano, em % acima da inflação ("pais.ret_acoes": { "max": -20 } é a bolsa despencando). */
  ret_renda_fixa: { tipo: 'num', sistema: 'mundo' },
  ret_acoes: { tipo: 'num', sistema: 'mundo' },
  ret_fii: { tipo: 'num', sistema: 'mundo' },
  ret_dolar: { tipo: 'num', sistema: 'mundo' },
  ret_cripto: { tipo: 'num', sistema: 'mundo' },
  /** Empurrão de quem governa na economia (−3 a 3): decretos que aquecem ou esfriam o ciclo. Some com o tempo. */
  impulso: { tipo: 'num', sistema: 'mundo', limites: [-3, 3] },
};

/** Um bem de quem joga (bem1, bem2…): imóvel, veículo, luxo, mídia. */
const BEM: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'dinheiro', derivado: true },
  /** Id em mundo.json › bens. */
  item: { tipo: 'texto', sistema: 'dinheiro' },
  valor: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** O que falta pagar do financiamento. */
  financiado: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Quanto morar aqui tirou do custo de vida (volta quando sai). */
  economia: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
};

const EMPRESA: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'carreira', derivado: true },
  /** Anos desde a fundação. */
  idade: { tipo: 'num', sistema: 'carreira', derivado: true },
  /** Setor da economia (id de mundo.json › setores): o quanto ela cresce, balança e sente o ciclo. */
  setor: { tipo: 'texto', sistema: 'carreira' },
  /** Quanto a empresa vale inteira (a parte de quem joga é valor × participacao). */
  valor: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Quanto o valor andou no último ano (negativo é prejuízo). */
  lucro: { tipo: 'num', sistema: 'dinheiro', reais: true },
  /** O ritmo em que ela vem crescendo, em % ao ano: muda devagar, e tocar a empresa empurra para cima. */
  tracao: { tipo: 'num', sistema: 'carreira', limites: [-30, 80] },
  /** A parte de quem joga (1 = toda; sócios e investidores ficam com o resto). */
  participacao: { tipo: 'num', sistema: 'dinheiro', limites: [0, 1] },
  /** Quanto do valor sai por ano para os donos (0 = reinveste tudo). */
  retirada: { tipo: 'num', sistema: 'dinheiro', limites: [0, 0.2] },
  /** Gente trabalhando lá (pelo tamanho), para o texto. */
  funcionarios: { tipo: 'num', sistema: 'carreira', derivado: true },
};

export function camposDe(ent: string): Record<string, DefCampo> {
  if (ent === 'lugar') return LUGAR;
  if (ent === 'pais') return PAIS;
  if (ent === 'empresa') return EMPRESA;
  if (ent.startsWith('bem')) return BEM;
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

/** Tudo o que está investido, somando as classes. */
export function investidoDe(en: Entidade): number {
  let total = 0;
  for (const a of ATIVOS) total += en.n[a] ?? 0;
  return total;
}

/** O que a pessoa tem fora de empresa: conta, investimentos, menos a dívida. */
export function patrimonioDe(en: Entidade): number {
  return (en.n['dinheiro'] ?? 0) + investidoDe(en) - (en.n['divida'] ?? 0);
}

/** A parte de quem joga na empresa, em reais (0 sem empresa). Conta no patrimônio, mas só vira dinheiro pela retirada ou pela venda. */
export function parteNaEmpresa(e: EstadoVida): number {
  const emp = e.entidades['empresa'];
  if (!emp || emp.vivo === false) return 0;
  return Math.max(0, emp.n['valor'] ?? 0) * (emp.n['participacao'] ?? 1);
}

/** Os bens de quem joga (imóveis, veículos, luxo), na ordem da compra. */
export function bensDe(e: EstadoVida): Entidade[] {
  return Object.values(e.entidades).filter((x) => x.tipo === 'bem' && x.vivo !== false);
}

/** O que os bens valem, menos o que falta pagar deles. */
export function valorDosBens(e: EstadoVida): number {
  let total = 0;
  for (const b of bensDe(e)) total += (b.n['valor'] ?? 0) - (b.n['financiado'] ?? 0);
  return total;
}

/** Patrimônio de quem joga: o de fora, a parte na empresa e os bens. */
export function patrimonioTotal(e: EstadoVida): number {
  return patrimonioDe(e.entidades['eu']!) + parteNaEmpresa(e) + valorDosBens(e);
}

/** Gente trabalhando numa empresa deste valor (uma pessoa a cada R$ 150 mil, pelo menos uma). */
export function funcionariosDe(valor: number): number {
  return Math.max(1, Math.round(valor / 150000));
}

/** Limites das classes por patrimônio (reais de hoje): abaixo de LIMITES[i] está a classe i. */
export const LIMITES_CLASSE = [5000, 40000, 200000, 1000000, 5000000, 1e9, 1e12, Infinity] as const;

export function classeDoPatrimonio(p: number): number {
  return LIMITES_CLASSE.findIndex((ate) => p < ate);
}

export function nomeDaClasse(i: number): string {
  return CLASSES[Math.max(0, Math.min(CLASSES.length - 1, i))]!;
}

/** Pelo gênero da pessoa: numa dinastia, a família de quem herda pode ter duas mães ou dois pais. */
const QUEM: Record<string, [string, string]> = {
  mae: ['seu pai', 'sua mãe'],
  pai: ['seu pai', 'sua mãe'],
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
        return ent === 'eu' ? patrimonioTotal(e) : patrimonioDe(en);
      case 'investido':
        return investidoDe(en);
      case 'classe':
        return classeDoPatrimonio(ent === 'eu' ? patrimonioTotal(e) : patrimonioDe(en));
      case 'funcionarios':
        return funcionariosDe(en.n['valor'] ?? 0);
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
