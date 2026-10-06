/**
 * Origem procedural: classe (6) × tipo de família (4) × traços. Sorteada em
 * um toque; quem quiser escolhe a classe e o tipo de família. A origem
 * decide quem são os pais (idade, ocupação, renda, dinheiro, saúde, traço,
 * vínculo), a avó e o amigo de infância, a cidade e o traço de quem joga.
 */
import type { Conteudo } from './conteudo.ts';
import { TIPOS_FAMILIA, type TipoFamilia } from './constantes.ts';
import type { Classe, TipoFamilia as DefFamilia, Traco } from './esquema.ts';
import { nomeLivre, novaEntidade } from './pessoas.ts';
import { aleatorio, inteiro, normal, sortear, sortearIndice, type Rng } from './rng.ts';
import type { Entidade, EstadoVida, Genero } from './tipos.ts';

export interface EscolhaOrigem {
  /** Índice da classe (0 = extrema pobreza ... 5 = muito rica). */
  classe?: number;
  familia?: TipoFamilia;
}

const REGIOES: Record<string, string> = {
  AC: 'norte', AP: 'norte', AM: 'norte', PA: 'norte', RO: 'norte', RR: 'norte', TO: 'norte',
  AL: 'nordeste', BA: 'nordeste', CE: 'nordeste', MA: 'nordeste', PB: 'nordeste', PE: 'nordeste', PI: 'nordeste', RN: 'nordeste', SE: 'nordeste',
  DF: 'centro_oeste', GO: 'centro_oeste', MT: 'centro_oeste', MS: 'centro_oeste',
  ES: 'sudeste', MG: 'sudeste', RJ: 'sudeste', SP: 'sudeste',
  PR: 'sul', RS: 'sul', SC: 'sul',
};
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
  const iClasse = op.classe ?? sortearIndice(rng, mundo.classes.map((k) => k.peso));
  const classe: Classe = mundo.classes[iClasse]!;
  const tipo: DefFamilia =
    mundo.familias.find((f) => f.id === op.familia) ?? mundo.familias[sortearIndice(rng, mundo.familias.map((f) => f.peso))]!;
  const eu = e.entidades['eu']!;

  // ---- lugar e país
  const cidade = sortear(rng, mundo.cidades);
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
  const chanceDesemprego = [0.45, 0.2, 0.1, 0.06, 0.03, 0][iClasse] ?? 0.1;

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
  const ocupar = (en: Entidade, ocupacao: { m: string; f: string; setor: string | { m: string; f: string } }): void => {
    en.t['ocupacao'] = en.genero === 'f' ? ocupacao.f : ocupacao.m;
    en.t['setor'] = setorDe(en, ocupacao.setor);
    if (aleatorio(rng) < chanceDesemprego) {
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
  ocupar(mae, sortear(rng, classe.ocupacoes));
  ocupar(pai, sortear(rng, classe.ocupacoes));
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
  const moraJunto = [0.45, 0.35, 0.2, 0.1, 0.05, 0.05][iClasse] ?? 0.1;
  if (aleatorio(rng) < moraJunto) {
    avo.q['mora_junto'] = { v: 1, ano: e.ano, idade: 0, causa: null };
    avo.n['vinculo'] = Math.min(96, (avo.n['vinculo'] ?? 60) + 12);
  }
  e.entidades['avo'] = avo;

  // ---- amigo de infância
  const generoAmigo: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
  const amigo = pessoa('amigo', generoAmigo, e.ano + inteiro(rng, -1, 1), sortearTraco(rng, c, tipo), 50, 84);
  e.entidades['amigo'] = amigo;

  // ---- quem joga
  const traco = mundo.tracosJogador[sortearIndice(rng, mundo.tracosJogador.map((t) => t.peso))]!;
  eu.t['traco'] = traco.id;
  eu.t['familia'] = tipo.id;
  eu.t['ocupacao'] = '';
  eu.n['classe_origem'] = iClasse;
  // Famílias mais pobres têm, em média, mais filhos.
  eu.n['irmaos'] = Math.max(0, Math.min(6, Math.round(normal(rng, [2.6, 2, 1.5, 1.1, 1, 1.2][iClasse] ?? 1.5, 1.1))));
  eu.n['riqueza_origem'] = riqueza;
  eu.n['saude'] = Math.round(limitar(normal(rng, 80, 7) + classe.saude + traco.saude, 40, 99));
  eu.n['felicidade'] = Math.round(limitar(normal(rng, 65, 8) + traco.felicidade, 25, 97));
  eu.n['inteligencia'] = Math.round(limitar(normal(rng, 30, 10) + traco.inteligencia, 5, 80));
  eu.n['aparencia'] = Math.round(limitar(normal(rng, 50, 14) + traco.aparencia, 8, 97));
}

export function tipoDeFamiliaValido(x: string): x is TipoFamilia {
  return (TIPOS_FAMILIA as readonly string[]).includes(x);
}
