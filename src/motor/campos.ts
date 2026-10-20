/**
 * Os campos de cada tipo de entidade e como ler um caminho ("mae.saude",
 * "lugar.desemprego", "fumante"). Sem ponto, o caminho é de quem joga (`eu`).
 * O que não é campo é qualidade (valor 0 quando não existe).
 */
import { ATIVOS, CLASSES, ENTIDADES, FILHOS, PARCEIROS, POLITICAS } from './constantes.ts';
import { MAX_EMPRESAS, MAX_FUNCIONARIOS, VALOR_POR_FUNCIONARIO } from './regras.ts';
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
  /** Com centavos no texto (o dólar: R$ 6,80). */
  centavos?: boolean;
  /** Com casas decimais no texto (o IDH: 0,81). */
  casas?: number;
  /** Em milhões no texto (a população: 205 milhões). */
  milhoes?: boolean;
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
  /** Imagem pública (0 a 100): sobe com o que se faz pelos outros e cai com escândalo; pesa em toda eleição. No cargo, é a aprovação de quem governa: abaixo de POPULARIDADE_CRITICA, o cargo balança. */
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
  /** Filhos que quem joga teve ou adotou (até 4): o conteúdo lê, e a herança se divide entre os vivos. */
  filhos: { tipo: 'num', sistema: 'relacoes', limites: [0, 4] },
  idade: { tipo: 'num', sistema: 'corpo', derivado: true },
  vivo: { tipo: 'bool', sistema: 'corpo', derivado: true },
  patrimonio: { tipo: 'num', sistema: 'dinheiro', derivado: true, reais: true },
  /** Classe atual (0 a 7) pelo patrimônio. */
  classe: { tipo: 'num', sistema: 'dinheiro', derivado: true },
  nome: { tipo: 'texto', sistema: 'relacoes', derivado: true },
  genero: { tipo: 'texto', sistema: 'relacoes', derivado: true },
  /** "sua mãe", "seu pai", "sua amiga Ana": o personagem como sujeito de uma frase. */
  quem: { tipo: 'texto', sistema: 'relacoes', derivado: true },
  /** Quantas empresas quem joga tem (o grupo; 0 para os outros). */
  empresas: { tipo: 'num', sistema: 'dinheiro', derivado: true },
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
  /** O país vivo (pais.ts): crescimento do PIB (% ao ano), desemprego (%), Selic (%), dívida pública (% do PIB). */
  crescimento: { tipo: 'num', sistema: 'mundo', limites: [-15, 15] },
  desemprego: { tipo: 'num', sistema: 'mundo', limites: [0, 40] },
  juros: { tipo: 'num', sistema: 'mundo', limites: [0, 60] },
  divida: { tipo: 'num', sistema: 'mundo', limites: [0, 300] },
  /** Gente na pobreza (%), homicídios por 100 mil, saúde e educação públicas (índices de 0 a 100). */
  pobreza: { tipo: 'num', sistema: 'mundo', limites: [0, 100] },
  violencia: { tipo: 'num', sistema: 'mundo', limites: [0, 100] },
  saude: { tipo: 'num', sistema: 'mundo', limites: [0, 100] },
  educacao: { tipo: 'num', sistema: 'mundo', limites: [0, 100] },
  /** Aprovação do governo (%): decide a reeleição; quando quem governa é quem joga, é a popularidade dele. */
  aprovacao: { tipo: 'num', sistema: 'poder', limites: [0, 100] },
  /** Quem governa: o id de um bloco (mundo.json › governos), 'regime' ou 'voce'. */
  governo: { tipo: 'texto', sistema: 'poder' },
  /** As políticas em vigor (pol_impostos, pol_comercio…; 0 baixo, 1 médio, 2 alto): mundo.json › politicas. Saem da lista, para nenhuma virar qualidade por esquecimento. */
  ...Object.fromEntries(POLITICAS.map((p): [string, DefCampo] => [`pol_${p}`, { tipo: 'num', sistema: 'poder', limites: [0, 2] }])),
  /** Ano de eleição geral (2026, 2030…): o voto aparece. */
  eleicao: { tipo: 'bool', sistema: 'poder', derivado: true },
  /** O dólar em reais de hoje: anda com o mundo lá fora, a dívida e os juros daqui; pesa na inflação, no investimento em dólar e nas empresas que exportam ou importam. */
  cambio: { tipo: 'num', sistema: 'mundo', reais: true, centavos: true, limites: [1.5, 20] },
  /** O tamanho do país (pais.ts): o PIB em reais de hoje, que anda com o crescimento, e a população, que anda com a transição demográfica, a saúde e a pobreza. */
  pib: { tipo: 'num', sistema: 'mundo', reais: true },
  populacao: { tipo: 'num', sistema: 'mundo', milhoes: true },
  /** Derivados do resto (campos.ts › indicadoresDoPais): o PIB por habitante, a desigualdade (Gini, 0 a 1) e o desenvolvimento humano (IDH, 0 a 1, como o da ONU). */
  pib_per_capita: { tipo: 'num', sistema: 'mundo', derivado: true, reais: true },
  gini: { tipo: 'num', sistema: 'mundo', derivado: true, casas: 2 },
  idh: { tipo: 'num', sistema: 'mundo', derivado: true, casas: 2 },
};

/** Paridade de poder de compra: um real compra mais aqui do que o câmbio diz (o IDH usa a renda em dólares PPC). */
const PPC = 1.6;

/**
 * Os indicadores do país, derivados das estatísticas: o PIB per capita (PIB ÷ população); o Gini, que sobe com a
 * pobreza e cai com a escola (0,52 com as estatísticas de hoje); e o IDH, a média geométrica da saúde (a expectativa
 * de vida), da educação e da renda (PIB per capita em dólares PPC, na escala da ONU): 0,77 com as de hoje.
 */
export function indicadoresDoPais(pais: Entidade): { pibPerCapita: number; gini: number; idh: number } {
  const n = pais.n;
  const pibPerCapita = (n['pib'] ?? 0) / Math.max(1, n['populacao'] ?? 1);
  const gini = Math.max(0.25, Math.min(0.75, 0.52 + 0.005 * ((n['pobreza'] ?? 25) - 25) - 0.0015 * ((n['educacao'] ?? 50) - 50)));
  const expectativa = 62 + 0.3 * (n['saude'] ?? 50);
  const saude = Math.max(0.01, Math.min(1, (expectativa - 20) / 65));
  const educacao = Math.max(0.01, Math.min(1, 0.4 + 0.0056 * (n['educacao'] ?? 50)));
  const dolares = Math.max(100, (pibPerCapita / Math.max(1, n['cambio'] ?? 5)) * PPC);
  const renda = Math.max(0.01, Math.min(1, (Math.log(dolares) - Math.log(100)) / (Math.log(75000) - Math.log(100))));
  return { pibPerCapita, gini, idh: Math.cbrt(saude * educacao * renda) };
}

/** Um país de fora (mundo.json › estrangeiros): a economia dele e a relação com o Brasil. */
const ESTRANGEIRO: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'mundo', derivado: true },
  /** O que ele compra do Brasil ("soja, minério e carne"), para o texto. */
  produtos: { tipo: 'texto', sistema: 'mundo' },
  /** Quanto a economia dele cresceu no último ano (%): puxa o que o Brasil vende para lá. */
  crescimento: { tipo: 'num', sistema: 'mundo', limites: [-15, 15] },
  /** A relação com o Brasil (0 hostil, 100 aliado): abaixo de 35, o risco de sanção cresce; acima de 70, o acordo fica à vista. */
  relacao: { tipo: 'num', sistema: 'poder', limites: [0, 100] },
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

/**
 * Uma dívida de quem joga (dividas.ts): `ctr0` é o cheque especial; `ctr<entrada>`, o empréstimo, o financiamento ou o
 * acordo que aquela entrada do livro fez. O credor é o banco.
 */
const CONTRATO: Record<string, DefCampo> = {
  nome: { tipo: 'texto', sistema: 'dinheiro', derivado: true },
  /** credito, emprestimo, financiamento ou acordo (constantes.ts › MODALIDADES). */
  modalidade: { tipo: 'texto', sistema: 'dinheiro' },
  /** Quem tem a receber: o banco (uma conta de fora, por enquanto). */
  credor: { tipo: 'texto', sistema: 'dinheiro' },
  /** O bem que garante o financiamento (vai a leilão se o contrato atrasar). */
  garantia: { tipo: 'texto', sistema: 'dinheiro' },
  /** A entrada do livro que fez a dívida: o porquê do atraso, do leilão e do nome sujo. */
  origem: { tipo: 'texto', sistema: 'historia' },
  /** O que falta pagar. */
  saldo: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** A parcela do ano (financiamento e acordo; o crédito do dia a dia não tem). */
  parcela: { tipo: 'num', sistema: 'dinheiro', reais: true, limites: [0, Infinity] },
  /** Anos seguidos em atraso (0 = em dia). */
  atraso: { tipo: 'num', sistema: 'dinheiro', limites: [0, 99] },
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
  /**
   * Quanto ela depende de quem manda nela (0 = anda sozinha; 100 = tudo passa pela sua mesa): o talento de quem manda pesa
   * na tração nessa proporção, a morte de quem manda custa valor e quem compra desconta.
   */
  dependencia: { tipo: 'num', sistema: 'poder', limites: [0, 100] },
  /** Empresas que ela comprou ou absorveu e que seguem com o nome delas, dentro do valor dela: vender uma dá dinheiro sem largar o resto. */
  subsidiarias: { tipo: 'num', sistema: 'poder', limites: [0, Infinity] },
};

export function camposDe(ent: string): Record<string, DefCampo> {
  if (ent === 'lugar') return LUGAR;
  if (ent === 'pais') return PAIS;
  if (ent.startsWith('empresa')) return EMPRESA;
  if ((PARCEIROS as readonly string[]).includes(ent)) return ESTRANGEIRO;
  if (ent.startsWith('bem')) return BEM;
  if (ent.startsWith('ctr')) return CONTRATO;
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

/** Os filhos que existem (vivos ou não), na ordem de chegada. */
export function filhosDe(e: EstadoVida): Entidade[] {
  return FILHOS.map((id) => e.entidades[id]).filter((x): x is Entidade => x !== undefined);
}

/** Os filhos vivos, do mais velho para o mais novo (quem herda primeiro). */
export function filhosVivos(e: EstadoVida): Entidade[] {
  return filhosDe(e)
    .filter((x) => x.vivo !== false && !x.q['ausente'] && x.nascimento !== undefined && e.ano - x.nascimento >= 0)
    .sort((a, b) => a.nascimento! - b.nascimento!);
}

/** O filho mais novo (vivo, se houver): quem o texto chama de {cacula}. Sem filho nenhum, o papel "filho". */
export function caculaDe(e: EstadoVida): string {
  return filhosVivos(e).at(-1)?.id ?? filhosDe(e).at(-1)?.id ?? 'filho';
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

/**
 * As empresas de quem joga: primeiro a que ele cuida de perto (`empresa`, a
 * que o conteúdo chama de "a empresa"), depois as outras (`empresa2`…).
 */
export function empresasDe(e: EstadoVida): Entidade[] {
  // Pelos lugares, e não por todas as entidades: é chamado a cada leitura do patrimônio.
  const saida: Entidade[] = [];
  for (const id of LUGARES_DE_EMPRESA) {
    const x = e.entidades[id];
    if (x && x.tipo === 'empresa' && x.vivo !== false) saida.push(x);
  }
  return saida;
}

/** Os lugares das empresas de quem joga: `empresa` (a que ele cuida de perto) e `empresa2`…`empresa5`. */
export const LUGARES_DE_EMPRESA: readonly string[] = Array.from({ length: MAX_EMPRESAS }, (_, i) => (i === 0 ? 'empresa' : `empresa${i + 1}`));

/** `empresa` é 1, `empresa2` é 2… */
export function ordemDaEmpresa(id: string): number {
  return Number(id.slice('empresa'.length) || 1);
}

/** A parte de quem joga numa empresa (sem dizer qual, a que ele cuida de perto), em reais (0 sem ela). Conta no patrimônio, mas só vira dinheiro pela retirada ou pela venda. */
export function parteNaEmpresa(e: EstadoVida, id = 'empresa'): number {
  const emp = e.entidades[id];
  if (!emp || emp.vivo === false) return 0;
  return Math.max(0, emp.n['valor'] ?? 0) * (emp.n['participacao'] ?? 1);
}

/** A parte de quem joga em todas as empresas dele. */
export function parteNasEmpresas(e: EstadoVida): number {
  let total = 0;
  for (const emp of empresasDe(e)) total += parteNaEmpresa(e, emp.id);
  return total;
}

/** Os bens de quem joga (imóveis, veículos, luxo), na ordem da compra. */
export function bensDe(e: EstadoVida): Entidade[] {
  const saida: Entidade[] = [];
  for (const id in e.entidades) {
    if (!id.startsWith('bem')) continue;
    const x = e.entidades[id]!;
    if (x.tipo === 'bem' && x.vivo !== false) saida.push(x);
  }
  return saida;
}

/** O que os bens valem, menos o que falta pagar deles. */
export function valorDosBens(e: EstadoVida): number {
  let total = 0;
  for (const b of bensDe(e)) total += (b.n['valor'] ?? 0) - (b.n['financiado'] ?? 0);
  return total;
}

/** Patrimônio de quem joga: o de fora, a parte nas empresas e os bens. */
export function patrimonioTotal(e: EstadoVida): number {
  return patrimonioDe(e.entidades['eu']!) + parteNasEmpresas(e) + valorDosBens(e);
}

/** Gente empregada pelo tamanho da empresa: uma pessoa a cada R$ 150 mil enquanto ela é pequena, saturando nas maiores do mundo. */
export function funcionariosDe(valor: number): number {
  return Math.max(1, Math.round(MAX_FUNCIONARIOS * (1 - Math.exp(-Math.max(0, valor) / (VALOR_POR_FUNCIONARIO * MAX_FUNCIONARIOS)))));
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
      case 'eleicao':
        return e.ano % 4 === 2;
      case 'empresas':
        return ent === 'eu' ? empresasDe(e).length : 0;
      case 'pib_per_capita':
        return indicadoresDoPais(en).pibPerCapita;
      case 'gini':
        return indicadoresDoPais(en).gini;
      case 'idh':
        return indicadoresDoPais(en).idh;
    }
    return undefined;
  }
  return def.tipo === 'texto' ? (en.t[campo] ?? '') : (en.n[campo] ?? 0);
}

export function lerCaminho(e: EstadoVida, caminho: string, ator?: string): number | string | boolean | undefined {
  const { ent, campo } = separar(caminho);
  return ler(e, entidadeDe(ent, ator), campo);
}
