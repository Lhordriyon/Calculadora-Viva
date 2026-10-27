/**
 * Origem procedural: classe (8, da extrema pobreza à família trilionária) × tipo de família (4) × traços. Sorteada em
 * um toque; quem quiser cria o personagem: nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos,
 * temperamento e talentos. O que não for escolhido é sorteado. A origem decide quem são os pais (idade, ocupação,
 * renda, dinheiro, saúde, traço, vínculo), a avó e o amigo de infância.
 */
import type { Conteudo } from './conteudo.ts';
import { IRMAOS, TIPOS_FAMILIA, type TipoFamilia } from './constantes.ts';
import type { Classe, TipoFamilia as DefFamilia, Traco } from './esquema.ts';
import { noGenero } from './carreira.ts';
import { nomeLivre, novaEntidade } from './pessoas.ts';
import { CHANCE_LINHAGEM } from './regras.ts';
import { aleatorio, criarRng, inteiro, misturar, normal, sortear, sortearIndice, type Rng } from './rng.ts';
import type { Entidade, EstadoVida, Genero } from './tipos.ts';

export interface EscolhaOrigem {
  /** Índice da classe (0 = extrema pobreza ... 5 = muito rica, 6 = bilionária, 7 = trilionária). */
  classe?: number;
  familia?: TipoFamilia;
  /** Linhagem (mundo.json › linhagens): coroa, regime, gente famosa. No começo em um toque, às vezes vem sorteada. */
  linhagem?: string;
  /** Nome e sobrenome de quem joga (o sobrenome é o da família toda) e o gênero. */
  nome?: string;
  sobrenome?: string;
  genero?: Genero;
  /** Cidade (pelo nome, de mundo.json › cidades). */
  cidade?: string;
  /** Temperamento (id de mundo.json › tracosJogador). */
  traco?: string;
  /** Irmãos (0 a 6): dividem a herança e aparecem na infância. */
  irmaos?: number;
  /** Talentos: 0 (pouco), 1 (médio) ou 2 (muito) em cada atributo, somando no máximo TALENTOS_DA_CRIACAO. */
  talentos?: Talentos;
}

export type Talento = 'saude' | 'inteligencia' | 'aparencia' | 'felicidade';
export type Talentos = Partial<Record<Talento, number>>;
/** Pontos de talento na criação: quatro atributos médios, ou um muito à custa de outro pouco. */
export const TALENTOS_DA_CRIACAO = 4;
/** O atributo ao nascer em cada nível de talento (pouco, médio, muito), antes da classe e do temperamento. */
const NIVEIS: Record<Talento, readonly [number, number, number]> = {
  saude: [72, 80, 89],
  felicidade: [55, 65, 76],
  inteligencia: [20, 30, 44],
  aparencia: [36, 50, 66],
};

/** Talentos válidos (cada um de 0 a 2, a soma dentro dos pontos) ou nada: aí o atributo é sorteado. */
export function talentosValidos(t: Talentos | undefined): Talentos | undefined {
  if (!t) return undefined;
  const niveis = Object.values(t);
  if (niveis.some((n) => !Number.isInteger(n) || n < 0 || n > 2)) return undefined;
  return niveis.reduce((s, n) => s + n, 0) <= TALENTOS_DA_CRIACAO ? t : undefined;
}

/** Nome digitado por quem joga: só letras, espaço, hífen e apóstrofo (o texto do jogo não pode virar modelo), até 24 caracteres. */
export function limparNome(s: string | undefined): string {
  return (s ?? '')
    .replace(/[^\p{L}' -]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24)
    .trim();
}

/** As cidades por região, para a escolha. */
export function cidadesPorRegiao(c: Conteudo): { regiao: string; cidades: { nome: string; uf: string }[] }[] {
  return REGIOES_DO_BRASIL.map((regiao) => ({ regiao, cidades: c.mundo.cidades.filter((x) => REGIOES[x.uf] === regiao).map((x) => ({ nome: x.nome, uf: x.uf })) })).filter(
    (g) => g.cidades.length > 0,
  );
}

const REGIOES: Record<string, string> = {
  AC: 'norte', AP: 'norte', AM: 'norte', PA: 'norte', RO: 'norte', RR: 'norte', TO: 'norte',
  AL: 'nordeste', BA: 'nordeste', CE: 'nordeste', MA: 'nordeste', PB: 'nordeste', PE: 'nordeste', PI: 'nordeste', RN: 'nordeste', SE: 'nordeste',
  DF: 'centro_oeste', GO: 'centro_oeste', MT: 'centro_oeste', MS: 'centro_oeste',
  ES: 'sudeste', MG: 'sudeste', RJ: 'sudeste', SP: 'sudeste',
  PR: 'sul', RS: 'sul', SC: 'sul',
};
/** As regiões que um lugar pode ter (`lugar.regiao`). */
export const REGIOES_DO_BRASIL: readonly string[] = [...new Set(Object.values(REGIOES))];
/** Desemprego de referência por região (taxa anual). */
const DESEMPREGO: Record<string, number> = { norte: 0.09, nordeste: 0.11, centro_oeste: 0.065, sudeste: 0.075, sul: 0.055 };

function limitar(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Valor sorteado numa faixa, uniforme no logaritmo quando a faixa é toda positiva (renda e riqueza são assim). */
function naFaixa(rng: Rng, [a, b]: readonly [number, number]): number {
  if (a > 0) return Math.exp(Math.log(a) + aleatorio(rng) * (Math.log(b) - Math.log(a)));
  return a + aleatorio(rng) * (b - a);
}

function sortearTraco(rng: Rng, c: Conteudo, tipo: DefFamilia, evitar?: string): Traco {
  const tracos = c.mundo.tracos.filter((t) => t.id !== evitar);
  return tracos[sortearIndice(rng, tracos.map((t) => 1 + (tipo.tracos[t.id] ?? 0)))]!;
}

function idadeDaMae(rng: Rng, classe: number): number {
  return Math.round(limitar(normal(rng, 21 + classe * 2, 4.5), 15, 44));
}

/** Gera mãe, pai, avó e amigo, a cidade e o país. Muta `e.entidades`. */
export function gerarOrigem(e: EstadoVida, c: Conteudo, op: EscolhaOrigem = {}): void {
  const rng = e.rng;
  const { mundo } = c;
  const sorteada =
    op.linhagem === undefined && op.classe === undefined && op.familia === undefined && aleatorio(rng) < CHANCE_LINHAGEM
      ? mundo.linhagens[sortearIndice(rng, mundo.linhagens.map((l) => l.peso))]
      : undefined;
  const linhagem = op.linhagem !== undefined ? mundo.linhagens.find((l) => l.id === op.linhagem) : sorteada;
  const iClasse = linhagem?.classe ?? op.classe ?? sortearIndice(rng, mundo.classes.map((k) => k.peso));
  const classe: Classe = mundo.classes[iClasse]!;
  const tipo: DefFamilia =
    mundo.familias.find((f) => f.id === op.familia) ?? mundo.familias[sortearIndice(rng, mundo.familias.map((f) => f.peso))]!;
  const eu = e.entidades['eu']!;

  // ---- lugar e país
  const cidade = mundo.cidades.find((x) => x.nome === op.cidade) ?? sortear(rng, mundo.cidades);
  const regiao = REGIOES[cidade.uf] ?? 'sudeste';
  const capital = cidade.marcas.includes('capital');
  const lugar = novaEntidade({ id: 'lugar', tipo: 'lugar', nome: cidade.nome });
  lugar.t['uf'] = cidade.uf;
  lugar.t['regiao'] = regiao;
  lugar.n['desemprego'] = (DESEMPREGO[regiao] ?? 0.08) + (capital ? 0.01 : 0) + normal(rng, 0, 0.008);
  lugar.n['custo_vida'] = cidade.marcas.includes('cidade_sp') ? 1.4 : capital ? (regiao === 'sudeste' ? 1.25 : 1.1) : 0.9;
  for (const m of cidade.marcas) lugar.q[m] = { v: 1, ano: e.ano, idade: 0, causa: null };
  const pais = novaEntidade({ id: 'pais', tipo: 'jurisdicao', nome: 'Brasil' });
  pais.n['inflacao'] = 4.5;
  e.entidades['lugar'] = lugar;
  e.entidades['pais'] = pais;

  // ---- dinheiro da casa
  const riqueza = Math.round(naFaixa(rng, classe.patrimonio));
  const rendaAdulto = (): number => Math.round(naFaixa(rng, classe.renda));
  const chanceDesemprego = [0.45, 0.2, 0.1, 0.06, 0.03, 0, 0, 0][iClasse] ?? 0.1;

  const pessoa = (id: string, genero: Genero, nascimento: number, traco: Traco, vinculo: number, saude: number): Entidade => {
    const en = novaEntidade({ id, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
    en.t['traco'] = traco.id;
    en.n['vinculo'] = Math.round(limitar(vinculo + traco.vinculo + normal(rng, 0, 7), 4, 96));
    en.n['saude'] = Math.round(limitar(saude + traco.saude + normal(rng, 0, 6), 20, 98));
    en.n['dinheiro'] = 0;
    en.n['renda'] = 0;
    return en;
  };
  const setorDe = (en: Entidade, setor: string | { m: string; f: string }): string => (typeof setor === 'string' ? setor : en.genero === 'f' ? setor.f : setor.m);
  const ocupar = (en: Entidade, ocupacao: { m: string; f: string; setor: string | { m: string; f: string }; patrimonio?: boolean | undefined }): void => {
    en.t['ocupacao'] = en.genero === 'f' ? ocupacao.f : ocupacao.m;
    en.t['setor'] = setorDe(en, ocupacao.setor);
    // Quem vive de patrimônio não nasce desempregado (o sorteio acontece do mesmo jeito: as outras vidas não mudam).
    if (aleatorio(rng) < chanceDesemprego && !ocupacao.patrimonio) {
      en.q['desempregado'] = { v: 1, ano: e.ano, idade: 0, causa: null };
      en.n['renda'] = Math.round(rendaAdulto() * 0.3);
    } else {
      en.n['renda'] = rendaAdulto();
    }
  };

  // ---- mãe e pai
  const idadeMae = idadeDaMae(rng, iClasse);
  const mae = pessoa('mae', 'f', e.ano - idadeMae, sortearTraco(rng, c, tipo), tipo.vinculo, 76 + classe.saude);
  e.entidades['mae'] = mae;
  const idadePai = Math.max(16, idadeMae + inteiro(rng, -2, 8));
  const pai = pessoa('pai', 'm', e.ano - idadePai, sortearTraco(rng, c, tipo, mae.t['traco']), tipo.vinculo, 74 + classe.saude);
  e.entidades['pai'] = pai;
  const daMae = sortear(rng, classe.ocupacoes);
  ocupar(mae, daMae);
  // O pai faz outra coisa (duas pessoas donas de "metade dos portos do continente" é demais).
  ocupar(pai, sortear(rng, classe.ocupacoes.filter((o) => o !== daMae)));
  if (tipo.id === 'empreendedora') {
    const dono = aleatorio(rng) < 0.5 ? mae : pai;
    dono.t['ocupacao'] = dono.genero === 'f' ? classe.negocio.f : classe.negocio.m;
    dono.t['setor'] = setorDe(dono, classe.negocio.setor);
    delete dono.q['desempregado'];
    dono.n['renda'] = rendaAdulto();
    dono.q['dono_do_negocio'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    eu.q['negocio_familiar'] = { v: 1, ano: e.ano, idade: 0, causa: null };
  }
  const chanceAusente = tipo.id === 'conflituosa' ? 0.35 : 0.07;
  if (aleatorio(rng) < chanceAusente || pai.t['traco'] === 'ausente') {
    pai.q['ausente'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    pai.n['vinculo'] = Math.round(limitar(normal(rng, 14, 5), 2, 30));
    mae.n['dinheiro'] = Math.round(riqueza * 0.85);
    pai.n['dinheiro'] = Math.round(Math.max(0, riqueza) * 0.15);
  } else {
    mae.n['dinheiro'] = Math.round(riqueza / 2);
    pai.n['dinheiro'] = riqueza - mae.n['dinheiro'];
  }

  // ---- avó (mãe da mãe)
  const avo = pessoa('avo', 'f', mae.nascimento! - inteiro(rng, 17, 30), sortearTraco(rng, c, tipo), tipo.vinculo + 4, 62 + classe.saude / 2);
  avo.n['renda'] = Math.round(classe.renda[0] * 0.8);
  avo.n['dinheiro'] = Math.round(Math.max(0, riqueza) * (0.05 + aleatorio(rng) * 0.25));
  const moraJunto = [0.45, 0.35, 0.2, 0.1, 0.05, 0.05, 0.03, 0.03][iClasse] ?? 0.1;
  if (aleatorio(rng) < moraJunto) {
    avo.q['mora_junto'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    avo.n['vinculo'] = Math.min(96, (avo.n['vinculo'] ?? 60) + 12);
  }
  e.entidades['avo'] = avo;

  // ---- amigo de infância
  const generoAmigo: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
  const amigo = pessoa('amigo', generoAmigo, e.ano + inteiro(rng, -1, 1), sortearTraco(rng, c, tipo), 50, 84);
  // O amigo de infância (os amigos da vida adulta chegam depois, em outro lugar: amigo2, amigo3).
  amigo.q['de_infancia'] = { v: 1, ano: e.ano, idade: 0, causa: null };
  e.entidades['amigo'] = amigo;

  // ---- a linhagem: o pai ou a mãe que carrega o nome (a coroa, o regime, a fama) e o que isso deixa em quem nasce
  if (linhagem) {
    const quem = aleatorio(rng) < 0.5 ? mae : pai;
    delete quem.q['ausente'];
    delete quem.q['desempregado'];
    quem.n['vinculo'] = Math.max(quem.n['vinculo'] ?? 0, 35);
    quem.t['ocupacao'] = noGenero(linhagem.papel.ocupacao, quem.genero);
    quem.t['setor'] = linhagem.papel.setor;
    quem.n['renda'] = Math.max(quem.n['renda'] ?? 0, rendaAdulto());
    quem.q[linhagem.papel.marca] = { v: 1, ano: e.ano, idade: 0, causa: null };
    for (const m of linhagem.marcas) eu.q[m] = { v: 1, ano: e.ano, idade: 0, causa: null };
    for (const m of linhagem.pais ?? []) pais.q[m] = { v: 1, ano: e.ano, idade: 0, causa: null };
    eu.n['influencia'] = linhagem.influencia ?? 0;
    eu.n['fama'] = linhagem.fama ?? 0;
  }

  // ---- quem joga
  const traco = mundo.tracosJogador.find((t) => t.id === op.traco) ?? mundo.tracosJogador[sortearIndice(rng, mundo.tracosJogador.map((t) => t.peso))]!;
  eu.t['traco'] = traco.id;
  eu.t['familia'] = tipo.id;
  eu.t['ocupacao'] = '';
  eu.n['classe_origem'] = iClasse;
  // Famílias mais pobres têm, em média, mais filhos. Os irmãos são pessoas: os mais velhos já estão aqui, e os mais
  // novos nascem nos primeiros anos; `eu.irmaos` conta quem já nasceu.
  const escolheuIrmaos = op.irmaos !== undefined && Number.isInteger(op.irmaos);
  const irmaos = escolheuIrmaos
    ? limitar(op.irmaos!, 0, IRMAOS.length)
    : Math.max(0, Math.min(6, Math.round(normal(rng, [2.6, 2, 1.5, 1.1, 1, 1.2, 1.4, 1.3][iClasse] ?? 1.5, 1.1))));
  eu.n['irmaos'] = gerarIrmaos(e, c, Math.min(irmaos, IRMAOS.length), idadeMae, tipo, classe, escolheuIrmaos);
  eu.n['riqueza_origem'] = riqueza;
  // Talento escolhido: o nível dá a média, e sobra um pouco de sorte; sem escolha, o atributo é sorteado como sempre.
  const talentos = talentosValidos(op.talentos);
  const base = (t: Talento, media: number, desvio: number): number => {
    const nivel = talentos?.[t];
    return nivel !== undefined ? normal(rng, NIVEIS[t][nivel]!, desvio / 3) : normal(rng, media, desvio);
  };
  eu.n['saude'] = Math.round(limitar(base('saude', 80, 7) + classe.saude + traco.saude, 40, 99));
  eu.n['felicidade'] = Math.round(limitar(base('felicidade', 65, 8) + traco.felicidade, 25, 97));
  eu.n['inteligencia'] = Math.round(limitar(base('inteligencia', 30, 10) + traco.inteligencia, 5, 80));
  eu.n['aparencia'] = Math.round(limitar(base('aparencia', 50, 14) + traco.aparencia, 8, 97));
  // A imagem pública nasce no meio: quem a lê conta 50 quando ela falta, e a primeira mudança partia do zero.
  eu.n['popularidade'] = 50;

  // O parto: prematuro em 1 de cada 10 nascimentos, mais nas famílias pobres e nas mães muito novas ou mais velhas.
  // Nasce com menos saúde, e o conteúdo lê a marca (o peito que chia, o pediatra que acompanha).
  const chancePrematuro = ([0.13, 0.11, 0.1, 0.09, 0.08, 0.07, 0.07, 0.07][iClasse] ?? 0.1) + (idadeMae < 18 || idadeMae > 37 ? 0.04 : 0);
  if (aleatorio(rng) < chancePrematuro) {
    eu.q['prematuro'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    eu.n['saude'] = Math.max(30, (eu.n['saude'] ?? 80) - 8);
  }
}

/** Chance de nascer com um irmão gêmeo (o gêmeo conta entre os irmãos). */
const CHANCE_GEMEO = 0.03;

/**
 * Os irmãos de quem joga. A posição de quem joga entre os filhos é sorteada: os mais velhos já estão aqui (nasceram
 * com a mãe entre os 15 anos e a idade de agora, um a cada um a quatro anos; os adultos já trabalham), e os mais novos
 * nascem nos primeiros anos, pelo storylet "irmao_nasce" (agendado: se a mãe morrer antes, não nasce). O sorteio é
 * próprio, da semente da vida: o resto da origem não muda por causa deles. Devolve quantos já nasceram.
 */
function gerarIrmaos(e: EstadoVida, c: Conteudo, quantos: number, idadeMae: number, tipo: DefFamilia, classe: Classe, escolhido: boolean): number {
  const rng = criarRng(misturar(e.semente, 5309));
  const gemeo = quantos > 0 && aleatorio(rng) < CHANCE_GEMEO;
  const resto = quantos - (gemeo ? 1 : 0);
  // As idades dos mais velhos quando quem joga nasce (a mãe tinha pelo menos 15 em cada parto).
  const idades: number[] = [];
  let anos = 0;
  const maisUmVelho = (): boolean => {
    const a = anos + inteiro(rng, 1, 4);
    if (idadeMae - a < 15) return false;
    anos = a;
    idades.push(a);
    return true;
  };
  const velhos = inteiro(rng, 0, resto);
  for (let i = 0; i < velhos && maisUmVelho(); i++);
  // Os mais novos: um a cada um a quatro anos, enquanto a mãe tiver até 43 (46, quando quem joga escolheu quantos).
  const limite = escolhido ? 46 : 43;
  const novos: number[] = [];
  let depois = 0;
  for (let j = idades.length; j < resto; j++) {
    const d = depois + inteiro(rng, 1, 4);
    if (idadeMae + d > limite) break;
    depois = d;
    novos.push(d);
  }
  // Quem escolheu quantos irmãos tem todos: o que não coube depois vem antes, se a mãe tinha idade para isso.
  if (escolhido) while (idades.length + novos.length < resto && maisUmVelho());
  if (gemeo) idades.push(0);
  // Do mais velho ao mais novo.
  idades.sort((a, b) => b - a);
  idades.forEach((idade, i) => {
    const genero: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
    const traco = sortearTraco(rng, c, tipo);
    const en = novaEntidade({ id: IRMAOS[i]!, tipo: 'pessoa', nome: nomeLivre(e, c, genero, rng), genero, nascimento: e.ano - idade, vivo: true });
    en.t['traco'] = traco.id;
    // Irmão é família, com a briga de quem divide o quarto; o gêmeo, mais perto.
    en.n['vinculo'] = Math.round(limitar(tipo.vinculo - 4 + traco.vinculo + (idade === 0 ? 10 : 0) + normal(rng, 0, 8), 4, 96));
    en.n['saude'] = Math.round(limitar(80 + classe.saude + traco.saude + normal(rng, 0, 6), 20, 98));
    en.n['dinheiro'] = 0;
    en.n['renda'] = 0;
    if (idade === 0) en.q['gemeo'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    if (idade >= 18) {
      // O irmão adulto já trabalha, no começo da carreira.
      const o = sortear(rng, classe.ocupacoes);
      en.t['ocupacao'] = genero === 'f' ? o.f : o.m;
      en.t['setor'] = typeof o.setor === 'string' ? o.setor : genero === 'f' ? o.setor.f : o.setor.m;
      en.n['renda'] = Math.round(naFaixa(rng, classe.renda) * 0.6);
    }
    e.entidades[en.id] = en;
  });
  for (const d of novos) e.agenda.push({ evento: 'irmao_nasce', ano: e.ano + d, origem: null });
  return idades.length;
}

export function tipoDeFamiliaValido(x: string): x is TipoFamilia {
  return (TIPOS_FAMILIA as readonly string[]).includes(x);
}
