/**
 * Os perfis que emergem (etapa 03, I-195). Ninguém escolhe um perfil: ele sai do que quem joga fez, numa janela de
 * tempo (dez anos, por padrão), e muda quando a vida muda. Cada perfil tem uma probabilidade própria (de 0 a 1, pela
 * curva logística de uma soma de sinais), e vários podem ser altos ao mesmo tempo: quem abre empresas e governa é
 * empreendedor e estrategista político na mesma década.
 *
 * Os pesos são um modelo escrito à mão a partir do que cada perfil faz no jogo, não aprendidos de dados (não há dados de
 * jogadores para aprender): cada probabilidade vem com os sinais que a puxaram, para quem lê poder discordar.
 */
import { AREAS, type Area, type FotoDoAno, type Registro, type VidaObservada } from './observacao.ts';

export const PERFIS = [
  'empreendedor',
  'investidor',
  'industrialista',
  'estrategista',
  'dinastia',
  'acumulador',
  'filantropo',
  'explorador',
  'generalista',
  'sobrevivencia',
] as const;
export type Perfil = (typeof PERFIS)[number];

export const NOMES_DOS_PERFIS: Record<Perfil, string> = {
  empreendedor: 'Empreendedor',
  investidor: 'Investidor',
  industrialista: 'Industrialista',
  estrategista: 'Estrategista político',
  dinastia: 'Construtor de dinastias',
  acumulador: 'Acumulador de patrimônio',
  filantropo: 'Filantropo',
  explorador: 'Explorador',
  generalista: 'Generalista',
  sobrevivencia: 'Orientado à sobrevivência',
};

/** Os sinais de uma janela, lidos dos registros e das fotos. */
export interface Sinais {
  anos: number;
  decisoes: number;
  /** A parte das decisões que tocou cada área (pelo comando ou pelo que mudou). */
  parte: Record<Area, number>;
  areasUsadas: number;
  /** A entropia normalizada das áreas (0 = uma área só; 1 = todas por igual). */
  entropia: number;
  maiorArea: number;
  crescimentoPorDecada: number;
  naEmpresa: number;
  aplicado: number;
  nEmpresas: number;
  nSubsidiarias: number;
  funcionarios: number;
  pesoNoPib: number;
  maiorFatia: number;
  anosNoPoder: number;
  infPolitica: number;
  geracao: number;
  filhos: number;
  testamento: boolean;
  percentil: number;
  /** Quanto do percentil é de quem joga (até os 21 é o da família; some até os 30, como na régua do lugar). */
  daPropria: number;
  anosNoAperto: number;
  abriuEmpresa: boolean;
}

export interface Probabilidade {
  perfil: Perfil;
  p: number;
  /** Os sinais que mais puxaram, já em palavras curtas. */
  porque: string[];
}

export interface JanelaDePerfis {
  de: number;
  ate: number;
  perfis: Probabilidade[];
}

const sigmoide = (z: number): number => 1 / (1 + Math.exp(-z));

/**
 * O que é comum, para o explorador e o generalista não valerem para todo mundo: calibrado na população de robôs do
 * observatório (17/11; 64 vidas e 378 janelas de dez anos). Na mediana, 10 áreas numa década e 13 na vida inteira; a
 * entropia, 0,66 numa década e 0,72 na vida. O perfil liga acima do percentil 80. Com dados de pessoas, recalibrar.
 */
export function areasEsperadas(anos: number): number {
  return 13 * (1 - Math.exp(-anos / 6)) + 1.5;
}
export function entropiaComum(anos: number): number {
  return anos >= 30 ? 0.75 : 0.71;
}

function tocou(r: Registro, area: Area): boolean {
  return r.area === area || r.areas.includes(area);
}

/** O que quem joga tem, sem descontar a dívida: a conta, o aplicado, os títulos, os bens e a parte nas empresas. */
function bruto(f: FotoDoAno): number {
  return Math.max(0, f.caixa) + Math.max(0, f.investido) + Math.max(0, f.titulos) + Math.max(0, f.bens) + Math.max(0, f.empresas);
}

/** Os sinais dos registros e das fotos entre dois anos (inclusive). */
export function sinaisDe(vida: VidaObservada, de: number, ate: number): Sinais {
  const registros = vida.registros.filter((r) => r.ano >= de && r.ano <= ate && r.tipo !== 'ano');
  const fotos = vida.anos.filter((f) => f.ano >= de && f.ano <= ate + 1);
  const primeira: FotoDoAno | undefined = fotos[0];
  const ultima: FotoDoAno | undefined = fotos.at(-1);
  const parte = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<Area, number>;
  const contagem = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<Area, number>;
  for (const r of registros) for (const a of AREAS) if (tocou(r, a)) contagem[a]++;
  const total = Math.max(1, registros.length);
  for (const a of AREAS) parte[a] = contagem[a] / total;
  // A entropia das áreas tocadas (sem o "evento", que é o canal e não a área).
  const reais = AREAS.filter((a) => a !== 'evento');
  const soma = reais.reduce((s, a) => s + contagem[a], 0);
  let h = 0;
  for (const a of reais) {
    const q = soma > 0 ? contagem[a] / soma : 0;
    if (q > 0) h -= q * Math.log(q);
  }
  const anos = Math.max(1, ate - de + 1);
  // O crescimento é o do que quem joga fez: a base é pelo menos um PIB por pessoa (o primeiro salário não conta como
  // fortuna), e o que chegou de outras pessoas na janela (a herança, o fundo da família) sai do fim.
  const recebido = fotos.slice(1).reduce((t, f) => t + (f.recebido ?? 0), 0);
  const patrIni = Math.max(1, primeira?.mundo.pibPerCapita ?? 1, primeira?.patrimonio ?? 1);
  const patrFim = Math.max(1, (ultima?.patrimonio ?? 1) - recebido);
  // As partes do patrimônio se medem sobre o que se tem (sem descontar a dívida): com o patrimônio perto de zero, a
  // parte aplicada não pode passar de 100%.
  const p = Math.max(1, ultima ? bruto(ultima) : 1);
  return {
    anos,
    decisoes: registros.length,
    parte,
    areasUsadas: reais.filter((a) => contagem[a] > 0).length,
    entropia: soma > 0 ? h / Math.log(reais.length) : 0,
    maiorArea: soma > 0 ? Math.max(...reais.map((a) => contagem[a] / soma)) : 0,
    crescimentoPorDecada: (Math.log10(patrFim / patrIni) * 10) / anos,
    naEmpresa: Math.max(0, ultima?.empresas ?? 0) / p,
    aplicado: Math.max(0, (ultima?.investido ?? 0) + (ultima?.titulos ?? 0)) / p,
    nEmpresas: ultima?.nEmpresas ?? 0,
    nSubsidiarias: ultima?.nSubsidiarias ?? 0,
    funcionarios: ultima?.funcionarios ?? 0,
    pesoNoPib: Math.max(0, ...fotos.map((f) => f.pesoNoPib)),
    maiorFatia: Math.max(0, ...fotos.map((f) => f.maiorFatia)),
    anosNoPoder: fotos.filter((f) => f.cargo !== '' || f.coroa).length,
    infPolitica: fotos.length > 0 ? fotos.reduce((s, f) => s + f.infPolitica, 0) / fotos.length : 0,
    geracao: vida.geracao,
    filhos: ultima?.filhos ?? 0,
    testamento: registros.some((r) => r.ref === 'testamento'),
    percentil: ultima?.percentil ?? 0,
    daPropria: Math.min(1, Math.max(0, ((ultima?.idade ?? 0) - 21) / 9)),
    anosNoAperto: fotos.filter((f) => f.percentil < 0.3 || (f.divida > 2 * Math.max(f.renda, 0.1 * f.mundo.pibPerCapita) && f.divida > 0.5 * bruto(f)) || f.felicidade < 30).length,
    abriuEmpresa: registros.some((r) => r.ref === 'abrir' || r.refs.includes('abrirEmpresa')),
  };
}

const pct = (x: number): string => `${Math.round(x * 100)}%`;
const dec = (x: number, casas: number): string => x.toFixed(casas).replace('.', ',');

/** As probabilidades dos dez perfis a partir dos sinais, com o porquê de cada uma. */
export function perfisDosSinais(s: Sinais): Probabilidade[] {
  const P = s.parte;
  const regra = (perfil: Perfil, termos: [number, string][], vies: number): Probabilidade => {
    const z = termos.reduce((t, [v]) => t + v, vies);
    const porque = termos.filter(([v]) => v > 0.2).sort((a, b) => b[0] - a[0]).slice(0, 3).map(([, frase]) => frase);
    return { perfil, p: sigmoide(z), porque };
  };
  const empresa = P.empresa + P.grupo;
  const politica = P.politica + P.diplomacia + P.defesa + P.coroa;
  return [
    regra('empreendedor', [
      [6 * empresa, `${pct(empresa)} das decisões na empresa e no grupo`],
      [3 * s.naEmpresa, `${pct(s.naEmpresa)} do patrimônio em empresas`],
      [0.4 * Math.min(5, s.nEmpresas), `${s.nEmpresas} empresa(s)`],
      [s.abriuEmpresa ? 1 : 0, 'abriu uma empresa na janela'],
    ], -2.5),
    regra('investidor', [
      [8 * P.investimentos, `${pct(P.investimentos)} das decisões em investimentos`],
      [3 * s.aplicado, `${pct(s.aplicado)} do patrimônio aplicado`],
    ], -2.5),
    regra('industrialista', [
      [Math.log10(1 + s.funcionarios) / 1.5, `${Math.round(s.funcionarios)} funcionários no grupo`],
      [0.6 * Math.min(5, s.pesoNoPib), `o grupo é ${dec(s.pesoNoPib, 2)}% do PIB`],
      [4 * s.maiorFatia, `${pct(s.maiorFatia)} de um mercado`],
      [0.5 * Math.min(4, s.nSubsidiarias), `${s.nSubsidiarias} subsidiária(s)`],
    ], -3.5),
    regra('estrategista', [
      [8 * politica, `${pct(politica)} das decisões no poder, na diplomacia e na coroa`],
      [3 * (s.anosNoPoder / s.anos), `${s.anosNoPoder} de ${s.anos} anos com cargo ou coroa`],
      [s.infPolitica / 40, `influência política média de ${Math.round(s.infPolitica)}`],
    ], -2.5),
    regra('dinastia', [
      [0.9 * Math.max(0, s.geracao - 1), `${s.geracao}ª geração da família`],
      [8 * P.dinastia, `${pct(P.dinastia)} das decisões no testamento e na herança`],
      [0.35 * Math.min(4, s.filhos), `${s.filhos} filho(s) vivo(s)`],
      [s.testamento ? 1.2 : 0, 'decidiu o testamento'],
    ], -2.5),
    regra('acumulador', [
      [1.6 * Math.max(0, s.crescimentoPorDecada), `o patrimônio cresceu ${dec(s.crescimentoPorDecada, 2)} ordem(ns) de grandeza por década`],
      [s.daPropria * (s.percentil >= 0.999 ? 2 : s.percentil >= 0.99 ? 1.3 : s.percentil >= 0.9 ? 0.6 : 0), `está no percentil ${dec((s.percentil * 100), 1)} da riqueza do país`],
      [2 * Math.max(0, s.aplicado + s.naEmpresa - 0.5), 'o patrimônio trabalha (aplicado ou em empresas)'],
    ], -2.5),
    regra('filantropo', [
      [12 * P.filantropia, `${pct(P.filantropia)} das decisões em doação, fundação ou causa`],
    ], -2.5),
    regra('explorador', [
      [1.3 * (s.areasUsadas - areasEsperadas(s.anos)), `usou ${s.areasUsadas} das ${AREAS.length - 1} áreas (o comum, em ${s.anos} anos, é ${dec(areasEsperadas(s.anos), 0)})`],
      [s.decisoes / s.anos >= 4.6 ? 0.6 : 0, `${dec((s.decisoes / s.anos), 1)} decisões por ano`],
    ], -2),
    regra('generalista', [
      [30 * (s.entropia - entropiaComum(s.anos)), `áreas equilibradas (entropia ${dec(s.entropia, 2)}; o comum é ${dec(entropiaComum(s.anos), 2)})`],
      [s.maiorArea < 0.3 ? 0.8 : 0, `nenhuma área passa de ${pct(s.maiorArea)}`],
    ], -0.8),
    regra('sobrevivencia', [
      [4 * (s.anosNoAperto / s.anos), `${s.anosNoAperto} de ${s.anos} anos no aperto (pobreza, dívida ou tristeza)`],
      [6 * P.dividas, `${pct(P.dividas)} das decisões em dívidas`],
      [s.percentil < 0.25 ? 1 : 0, `percentil ${dec((s.percentil * 100), 0)} da riqueza`],
    ], -2.5),
  ];
}

/** Os perfis em janelas de tantos anos ao longo da vida: o perfil muda com a vida. */
export function perfisAoLongoDaVida(vida: VidaObservada, janela = 10): JanelaDePerfis[] {
  const fim = vida.fim?.ano ?? vida.anos.at(-1)?.ano ?? vida.inicio;
  const saida: JanelaDePerfis[] = [];
  for (let de = vida.inicio; de <= fim; de += janela) {
    const ate = Math.min(fim, de + janela - 1);
    saida.push({ de, ate, perfis: perfisDosSinais(sinaisDe(vida, de, ate)) });
  }
  return saida;
}

/** Os perfis da vida inteira e os da última janela (o de agora). */
export function perfisDaVida(vida: VidaObservada, janela = 10): { vida: Probabilidade[]; agora: Probabilidade[]; janelas: JanelaDePerfis[] } {
  const fim = vida.fim?.ano ?? vida.anos.at(-1)?.ano ?? vida.inicio;
  const janelas = perfisAoLongoDaVida(vida, janela);
  return { vida: perfisDosSinais(sinaisDe(vida, vida.inicio, fim)), agora: janelas.at(-1)?.perfis ?? [], janelas };
}

/** Os perfis acima de um limiar, do mais provável para o menos. */
export function perfisFortes(lista: readonly Probabilidade[], limiar = 0.5): Probabilidade[] {
  return lista.filter((x) => x.p >= limiar).sort((a, b) => b.p - a.p);
}
