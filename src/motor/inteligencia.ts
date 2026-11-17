/**
 * O relatório de inteligência (etapa 03, I-198): o que um conjunto de vidas observadas diz sobre o jogo.
 *
 * Cada item separa o fato (o que foi medido nestas vidas) da hipótese (o que se supõe a partir dele), diz a métrica,
 * o tamanho da amostra, a confiança e exemplos reproduzíveis. A fonte vem na capa: vidas de robôs não são jogadores,
 * e uma vida de quem joga é uma pessoa, não o público.
 */
import { extremosDaVida, LIMIARES, quantil, TIPOS_DE_EXTREMO, type Achado } from './extremos.ts';
import { AREAS, type Area, type FotoDoAno, type VidaObservada } from './observacao.ts';
import { NOMES_DOS_PERFIS, PERFIS, perfisDaVida, type Perfil } from './perfis.ts';
import { ANOS_DE_ESGOTAMENTO, COMPONENTES, LIMIAR_DE_ESGOTAMENTO, saturacaoDaVida, type Componente, type SaturacaoDaVida } from './saturacao.ts';
import type { Conteudo } from './conteudo.ts';

export type Natureza = 'fato' | 'hipotese';
export type Confianca = 'alta' | 'media' | 'baixa';

export interface Item {
  titulo: string;
  natureza: Natureza;
  confianca: Confianca;
  /** A medida e o valor, em uma linha. */
  metrica: string;
  /** Quantas vidas (ou decisões) sustentam o item. */
  n: number;
  /** Exemplos reproduzíveis (a vida e o ano). */
  exemplos: string[];
}

export interface Relatorio {
  fonte: string;
  descricao: string;
  vidas: number;
  partidas: number;
  anosVividos: number;
  registros: number;
  completas: number;
  comportamentos: Item[];
  estrategias: Item[];
  maisUsados: Item[];
  negligenciados: Item[];
  gargalos: Item[];
  incoerencias: Item[];
  conteudoInsuficiente: Item[];
  anomalias: Item[];
  oportunidades: Item[];
  /** As tabelas que sustentam os itens. */
  perfis: { perfil: Perfil; vidas: number; media: number }[];
  areas: { area: Area; decisoes: number; vidas: number }[];
  saturacaoPorFaixa: { faixa: string; anos: number; indice: number; componentes: Partial<Record<Componente, number>> }[];
  extremos: { tipo: string; notaveis: number; extremos: number }[];
}

/** Como reproduzir uma vida observada (o cenário, a semente, a geração, o ano). */
export function exemplo(v: VidaObservada, ano?: number): string {
  const quem = v.fonte === 'robo' ? `${v.cenario ?? 'vida'}${v.estrategia ? `/${v.estrategia}` : ''}` : 'jogador';
  return `${quem}, semente ${v.semente}, geração ${v.geracao}${ano !== undefined ? `, ${ano}` : ''}`;
}

function confiancaPorN(n: number, forte = true): Confianca {
  if (n >= 100 && forte) return 'alta';
  if (n >= 30) return 'media';
  return 'baixa';
}

/** Os números do relatório no jeito brasileiro: vírgula nos decimais; os grandes em mil e milhões. */
export const dec = (x: number, casas: number): string => x.toFixed(casas).replace('.', ',');
export function numero(x: number): string {
  const a = Math.abs(x);
  if (a >= 1e9) return `${dec(x / 1e9, 1)} bilhões`;
  if (a >= 1e6) return `${dec(x / 1e6, 1)} milhões`;
  if (a >= 1e4) return `${dec(x / 1e3, 1)} mil`;
  return x.toPrecision(3).replace('.', ',');
}
const pct = (x: number, casas = 0): string => `${dec(100 * x, casas)}%`;
const media = (xs: readonly number[]): number => (xs.length > 0 ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

/** A fonte principal da riqueza no fim da vida (a maior parte do patrimônio). */
function fonteDaRiqueza(f: FotoDoAno): string {
  const partes = { empresas: f.empresas, 'aplicações financeiras': f.investido + f.titulos, 'imóveis e bens': f.bens, 'dinheiro parado na conta': f.caixa };
  const total = Object.values(partes).reduce((s, x) => s + Math.max(0, x), 0);
  if (total < 1e5) return 'nada';
  return Object.entries(partes).sort((a, b) => b[1] - a[1])[0]![0];
}

const FAIXAS: { nome: string; de: number; ate: number }[] = [
  { nome: 'metade de baixo', de: 0, ate: 0.5 },
  { nome: 'percentil 50 a 90', de: 0.5, ate: 0.9 },
  { nome: 'percentil 90 a 99', de: 0.9, ate: 0.99 },
  { nome: '1% mais rico (99 a 99,9)', de: 0.99, ate: 0.999 },
  { nome: '0,1% mais rico', de: 0.999, ate: 1.01 },
];

/** O relatório inteiro de um conjunto de vidas. */
export function relatorioDe(vidas: readonly VidaObservada[], c: Conteudo, capa: { fonte: string; descricao: string }): Relatorio {
  const perfisDe = new Map(vidas.map((v) => [v, perfisDaVida(v)]));
  const saturacoes = new Map<VidaObservada, SaturacaoDaVida>(vidas.map((v) => [v, saturacaoDaVida(v)]));
  const extremosDe = new Map<VidaObservada, Achado[]>(vidas.map((v) => [v, extremosDaVida(v)]));
  const registros = vidas.reduce((s, v) => s + v.registros.length, 0);
  const r: Relatorio = {
    fonte: capa.fonte,
    descricao: capa.descricao,
    vidas: vidas.length,
    partidas: new Set(vidas.map((v) => v.partida)).size,
    anosVividos: vidas.reduce((s, v) => s + Math.max(0, v.anos.length - 1), 0),
    registros,
    completas: vidas.filter((v) => v.completa).length,
    comportamentos: [],
    estrategias: [],
    maisUsados: [],
    negligenciados: [],
    gargalos: [],
    incoerencias: [],
    conteudoInsuficiente: [],
    anomalias: [],
    oportunidades: [],
    perfis: [],
    areas: [],
    saturacaoPorFaixa: [],
    extremos: [],
  };
  if (vidas.length === 0) return r;

  // ---------------------------------------------------------------- os comportamentos (os perfis)
  for (const perfil of PERFIS) {
    const ps = vidas.map((v) => perfisDe.get(v)!.vida.find((x) => x.perfil === perfil)!.p);
    r.perfis.push({ perfil, vidas: ps.filter((p) => p >= 0.6).length, media: media(ps) });
  }
  const ordenados = [...r.perfis].sort((a, b) => b.vidas - a.vidas);
  for (const x of ordenados.filter((x) => x.vidas > 0).slice(0, 5)) {
    const exemplos = vidas.filter((v) => (perfisDe.get(v)!.vida.find((p) => p.perfil === x.perfil)?.p ?? 0) >= 0.8).slice(0, 2);
    const porque = exemplos[0] ? perfisDe.get(exemplos[0])!.vida.find((p) => p.perfil === x.perfil)!.porque.join('; ') : '';
    r.comportamentos.push({
      titulo: `${NOMES_DOS_PERFIS[x.perfil]}: ${pct(x.vidas / vidas.length)} das vidas`,
      natureza: 'fato',
      confianca: confiancaPorN(vidas.length),
      metrica: `probabilidade ≥ 0,6 na vida inteira em ${x.vidas} de ${vidas.length} vidas (média ${dec(x.media, 2)})${porque ? `; num exemplo: ${porque}` : ''}`,
      n: x.vidas,
      exemplos: exemplos.map((v) => exemplo(v)),
    });
  }
  // Vários perfis ao mesmo tempo e o perfil que muda.
  const fortesPorVida = vidas.map((v) => perfisDe.get(v)!.vida.filter((p) => p.p >= 0.6).length);
  const mudam = vidas.filter((v) => {
    const tops = perfisDe.get(v)!.janelas.map((j) => [...j.perfis].sort((a, b) => b.p - a.p)[0]?.perfil);
    return new Set(tops).size > 1;
  });
  r.comportamentos.push({
    titulo: 'Os perfis convivem e mudam com a vida',
    natureza: 'fato',
    confianca: confiancaPorN(vidas.length),
    metrica: `em média ${dec(media(fortesPorVida), 1)} perfis fortes (≥ 0,6) por vida; o perfil mais forte troca pelo menos uma vez, entre as janelas de dez anos, em ${pct(mudam.length / vidas.length)} das vidas`,
    n: vidas.length,
    exemplos: mudam.slice(0, 2).map((v) => exemplo(v)),
  });

  // ---------------------------------------------------------------- as estratégias dominantes
  const comFim = vidas.filter((v) => v.anos.length > 1);
  const grupos = new Map<string, VidaObservada[]>();
  for (const v of comFim) {
    const k = fonteDaRiqueza(v.anos.at(-1)!);
    grupos.set(k, [...(grupos.get(k) ?? []), v]);
  }
  const resultado = (vs: readonly VidaObservada[]): { crescimento: number; p90: number; felicidade: number } => {
    // A base é pelo menos um PIB por pessoa, e o que chegou de outras pessoas (herança, fundo da família) sai do fim.
    const cres = vs.map((v) => {
      const ini = v.anos[0]!;
      const recebido = v.anos.slice(1).reduce((t, f) => t + (f.recebido ?? 0), 0);
      return Math.log10(Math.max(1, v.anos.at(-1)!.patrimonio - recebido) / Math.max(1, ini.mundo.pibPerCapita, ini.patrimonio)) / Math.max(1, (v.anos.length - 1) / 10);
    });
    const fel = vs.map((v) => media(v.anos.map((f) => f.felicidade)));
    return { crescimento: quantil(cres, 0.5), p90: quantil(cres, 0.9), felicidade: media(fel) };
  };
  const tabela = [...grupos.entries()].filter(([k, vs]) => k !== 'nada' && vs.length >= 5).map(([k, vs]) => ({ k, vs, ...resultado(vs) }));
  for (const linha of tabela.sort((a, b) => b.crescimento - a.crescimento)) {
    const outros = tabela.filter((x) => x !== linha);
    const domina = outros.length > 0 && outros.every((o) => linha.crescimento > o.crescimento && linha.p90 > o.p90 && linha.felicidade >= o.felicidade);
    r.estrategias.push({
      titulo: `Riqueza principalmente em ${linha.k}${domina ? ': candidata a estratégia dominante' : ''}`,
      natureza: domina ? 'hipotese' : 'fato',
      confianca: confiancaPorN(linha.vs.length, linha.vs.length >= 100),
      metrica: `${linha.vs.length} vidas; o patrimônio cresce ${dec(linha.crescimento, 2)} ordens de grandeza por década na mediana (p90 ${dec(linha.p90, 2)}); felicidade média ${dec(linha.felicidade, 0)}`,
      n: linha.vs.length,
      exemplos: linha.vs.slice(0, 2).map((v) => exemplo(v)),
    });
  }
  // A estratégia do robô (quando é robô): quem vence em tudo ao mesmo tempo.
  const porEstrategia = new Map<string, VidaObservada[]>();
  for (const v of comFim) if (v.estrategia) porEstrategia.set(v.estrategia, [...(porEstrategia.get(v.estrategia) ?? []), v]);
  if (porEstrategia.size > 1) {
    const linhas = [...porEstrategia.entries()].map(([k, vs]) => ({ k, vs, ...resultado(vs), idade: media(vs.map((v) => v.fim?.idade ?? v.anos.at(-1)!.idade)) }));
    for (const l of linhas) {
      const domina = linhas.every((o) => o === l || (l.crescimento > o.crescimento && l.felicidade > o.felicidade && l.idade > o.idade));
      if (!domina) continue;
      r.estrategias.push({
        titulo: `A estratégia "${l.k}" vence as outras em patrimônio, felicidade e idade ao mesmo tempo`,
        natureza: 'fato',
        confianca: confiancaPorN(l.vs.length),
        metrica: `${l.vs.length} vidas; crescimento ${dec(l.crescimento, 2)}, felicidade ${dec(l.felicidade, 0)}, idade ${dec(l.idade, 0)}`,
        n: l.vs.length,
        exemplos: l.vs.slice(0, 2).map((v) => exemplo(v)),
      });
    }
  }
  // A escolha quase única: num evento com mais de uma opção disponível, a mesma é escolhida quase sempre.
  const escolhas = new Map<string, { n: number; porIndice: Map<number, number>; vidas: VidaObservada[] }>();
  for (const v of vidas) {
    for (const reg of v.registros) {
      if (reg.tipo !== 'escolha' || !reg.opcoes || reg.opcoes.disponiveis < 2) continue;
      const x = escolhas.get(reg.ref) ?? { n: 0, porIndice: new Map<number, number>(), vidas: [] as VidaObservada[] };
      x.n++;
      x.porIndice.set(reg.opcoes.escolhida, (x.porIndice.get(reg.opcoes.escolhida) ?? 0) + 1);
      if (x.vidas.length < 2 && !x.vidas.includes(v)) x.vidas.push(v);
      escolhas.set(reg.ref, x);
    }
  }
  const quaseUnicas = [...escolhas.entries()]
    .filter(([, x]) => x.n >= 20 && Math.max(...x.porIndice.values()) / x.n >= 0.95)
    .sort((a, b) => b[1].n - a[1].n);
  if (quaseUnicas.length > 0) {
    r.estrategias.push({
      titulo: `${quaseUnicas.length} eventos têm uma opção escolhida em 95% ou mais das vezes`,
      natureza: 'fato',
      confianca: confiancaPorN(quaseUnicas.length, false),
      metrica: `os mais frequentes: ${quaseUnicas.slice(0, 6).map(([id, x]) => `${id} (${x.n}×)`).join(', ')}. Com robôs, isso mede a regra de decisão deles, não o conteúdo: é preciso olhar a escolha de pessoas`,
      n: quaseUnicas.length,
      exemplos: quaseUnicas.slice(0, 2).flatMap(([, x]) => x.vidas.slice(0, 1).map((v) => exemplo(v))),
    });
  }

  // ---------------------------------------------------------------- os sistemas usados e esquecidos
  const decisoesPorArea = new Map<Area, number>();
  const vidasPorArea = new Map<Area, number>();
  for (const v of vidas) {
    const usadas = new Set<Area>();
    for (const reg of v.registros) {
      if (reg.tipo === 'ano') continue;
      const areas = new Set<Area>([reg.area, ...reg.areas]);
      areas.delete('evento');
      for (const a of areas) {
        decisoesPorArea.set(a, (decisoesPorArea.get(a) ?? 0) + 1);
        usadas.add(a);
      }
    }
    for (const a of usadas) vidasPorArea.set(a, (vidasPorArea.get(a) ?? 0) + 1);
  }
  r.areas = AREAS.filter((a) => a !== 'evento').map((a) => ({ area: a, decisoes: decisoesPorArea.get(a) ?? 0, vidas: vidasPorArea.get(a) ?? 0 }));
  const totalDecisoes = r.areas.reduce((s, a) => s + a.decisoes, 0);
  for (const a of [...r.areas].sort((x, y) => y.decisoes - x.decisoes).slice(0, 5)) {
    r.maisUsados.push({
      titulo: `${a.area}: ${pct(a.decisoes / Math.max(1, totalDecisoes))} das decisões`,
      natureza: 'fato',
      confianca: confiancaPorN(a.vidas),
      metrica: `${a.decisoes} decisões tocaram a área, em ${a.vidas} de ${vidas.length} vidas`,
      n: a.decisoes,
      exemplos: [],
    });
  }
  for (const a of r.areas.filter((x) => x.vidas / vidas.length < 0.1)) {
    r.negligenciados.push({
      titulo: `${a.area}: usada em ${pct(a.vidas / vidas.length)} das vidas`,
      natureza: 'fato',
      confianca: confiancaPorN(vidas.length),
      metrica: `${a.decisoes} decisões em ${a.vidas} vidas`,
      n: vidas.length,
      exemplos: [],
    });
  }
  // As áreas que se abandonam: usadas na primeira metade da vida e nunca mais na segunda.
  for (const area of AREAS.filter((a) => a !== 'evento')) {
    let usaram = 0;
    let largaram = 0;
    for (const v of vidas) {
      const meio = v.inicio + Math.max(1, (v.anos.at(-1)?.ano ?? v.inicio) - v.inicio) / 2;
      const regs = v.registros.filter((x) => x.tipo !== 'ano' && (x.area === area || x.areas.includes(area)));
      if (!regs.some((x) => x.ano < meio)) continue;
      usaram++;
      if (!regs.some((x) => x.ano >= meio)) largaram++;
    }
    if (usaram >= 20 && largaram / usaram >= 0.5) {
      r.negligenciados.push({
        titulo: `${area}: abandonada na segunda metade da vida em ${pct(largaram / usaram)} das vidas que a usaram`,
        natureza: 'fato',
        confianca: confiancaPorN(usaram),
        metrica: `${largaram} de ${usaram} vidas`,
        n: usaram,
        exemplos: [],
      });
    }
  }
  // Os storylets do conteúdo que nenhuma vida observada encontrou (como evento, ação ou jogada).
  const vistos = new Set<string>();
  for (const v of vidas) for (const reg of v.registros) {
    vistos.add(reg.ref.includes(':') ? reg.ref.split(':')[1]! : reg.ref);
    for (const ref of reg.refs) vistos.add(ref);
  }
  const nunca = c.storylets.filter((s) => !vistos.has(s.id));
  if (nunca.length > 0) {
    r.negligenciados.push({
      titulo: `${nunca.length} de ${c.storylets.length} storylets não apareceram em nenhuma das ${vidas.length} vidas`,
      natureza: 'fato',
      confianca: confiancaPorN(vidas.length, false),
      metrica: `exemplos: ${nunca.slice(0, 8).map((s) => s.id).join(', ')}. O túnel (10.000 vidas) é a medida de cobertura; aqui a amostra é menor`,
      n: nunca.length,
      exemplos: [],
    });
  }

  // ---------------------------------------------------------------- os gargalos de progressão
  for (const [nome, limiar] of [['aos 10% mais ricos', 0.9], ['ao 1% mais rico', 0.99], ['ao 0,1% mais rico', 0.999]] as const) {
    const debaixo = vidas.filter((v) => (v.anos[0]?.percentil ?? 1) < limiar && v.anos.length > 20);
    const chegaram = debaixo.filter((v) => v.anos.some((f) => f.percentil >= limiar));
    if (debaixo.length < 10) continue;
    const idades = chegaram.map((v) => v.anos.find((f) => f.percentil >= limiar)!.idade);
    r.gargalos.push({
      titulo: `Chegar ${nome} partindo de baixo: ${pct(chegaram.length / debaixo.length)}`,
      natureza: 'fato',
      confianca: confiancaPorN(debaixo.length),
      metrica: `${chegaram.length} de ${debaixo.length} vidas que começaram abaixo${idades.length > 0 ? `; idade mediana ao chegar: ${quantil(idades, 0.5)}` : ''}`,
      n: debaixo.length,
      exemplos: chegaram.slice(0, 2).map((v) => exemplo(v)),
    });
  }
  const parados = vidas.filter((v) => {
    const aos30 = v.anos.find((f) => f.idade === 30);
    const aos60 = v.anos.find((f) => f.idade === 60);
    return aos30 && aos60 && Math.abs(aos60.percentil - aos30.percentil) < 0.02;
  });
  const com30e60 = vidas.filter((v) => v.anos.some((f) => f.idade === 30) && v.anos.some((f) => f.idade === 60));
  if (com30e60.length >= 10) {
    r.gargalos.push({
      titulo: `O lugar no país quase não muda dos 30 aos 60 em ${pct(parados.length / com30e60.length)} das vidas`,
      natureza: 'fato',
      confianca: confiancaPorN(com30e60.length),
      metrica: `percentil da riqueza aos 60 a menos de 2 pontos do de aos 30 em ${parados.length} de ${com30e60.length} vidas (inclui quem já estava no topo)`,
      n: com30e60.length,
      exemplos: parados.slice(0, 2).map((v) => exemplo(v)),
    });
  }
  const esgotadas = vidas.filter((v) => saturacoes.get(v)!.esgotadoDesde !== null);
  r.gargalos.push({
    titulo: `A experiência se esgota (saturação ≥ 0,7 por cinco anos) em ${pct(esgotadas.length / vidas.length)} das vidas`,
    natureza: 'fato',
    confianca: confiancaPorN(vidas.length),
    metrica: esgotadas.length > 0 ? `idade mediana do esgotamento: ${quantil(esgotadas.map((v) => saturacoes.get(v)!.esgotadoDesde! - v.nascimento), 0.5)}` : 'nenhuma vida esgotou',
    n: vidas.length,
    exemplos: esgotadas.slice(0, 3).map((v) => exemplo(v, saturacoes.get(v)!.esgotadoDesde!)),
  });

  // ---------------------------------------------------------------- as incoerências observáveis
  let comEscolha = 0;
  let semEscolhaReal = 0;
  const semEscolhaPorRef = new Map<string, number>();
  for (const v of vidas) for (const reg of v.registros) {
    if (reg.tipo !== 'escolha' || !reg.opcoes || reg.opcoes.total < 2) continue;
    comEscolha++;
    if (reg.opcoes.disponiveis === 1) {
      semEscolhaReal++;
      semEscolhaPorRef.set(reg.ref, (semEscolhaPorRef.get(reg.ref) ?? 0) + 1);
    }
  }
  if (comEscolha > 0) {
    const top = [...semEscolhaPorRef.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    r.incoerencias.push({
      titulo: `Eventos com uma opção só disponível: ${pct(semEscolhaReal / comEscolha, 1)} das escolhas`,
      natureza: 'fato',
      confianca: confiancaPorN(comEscolha),
      metrica: `${semEscolhaReal} de ${comEscolha} eventos com duas opções ou mais tinham só uma liberada${top.length > 0 ? `; os mais frequentes: ${top.map(([id, n]) => `${id} (${n})`).join(', ')}` : ''}. Pela regra do jogo, a opção bloqueada aparece com o motivo: isso é decisão de conteúdo, mas não é escolha`,
      n: comEscolha,
      exemplos: [],
    });
  }
  // O dinheiro miúdo para quem é grande: escolhas de quem está no 0,1% mais rico (pela foto do ano) que mexem em menos
  // de 0,001% do patrimônio.
  const miudos = new Map<string, number>();
  let escolhasDoTopo = 0;
  for (const v of vidas) {
    const percentilDoAno = new Map(v.anos.map((f) => [f.ano, f.percentil]));
    for (const reg of v.registros) {
    if (reg.tipo !== 'escolha' || reg.antes <= 0 || (percentilDoAno.get(reg.ano) ?? 0) < 0.999) continue;
    const s = c.porId.get(reg.ref);
    if (!s) continue;
    escolhasDoTopo++;
    if (Math.abs(reg.efeito.patrimonio) > 0 && Math.abs(reg.efeito.patrimonio) / reg.antes < 1e-5) miudos.set(reg.ref, (miudos.get(reg.ref) ?? 0) + 1);
    }
  }
  if (escolhasDoTopo >= 20) {
    const total = [...miudos.values()].reduce((s, x) => s + x, 0);
    r.incoerencias.push({
      titulo: `Quem está no 0,1% mais rico decide como gente comum: ${pct(total / escolhasDoTopo)} das escolhas mexem em menos de 0,001% do patrimônio`,
      natureza: 'hipotese',
      confianca: confiancaPorN(escolhasDoTopo),
      metrica: `${total} de ${escolhasDoTopo} escolhas; as mais frequentes: ${[...miudos.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, n]) => `${id} (${n})`).join(', ')}. Pode ser vida normal (o jantar com a família), ou pode ser o conteúdo sem escala`,
      n: escolhasDoTopo,
      exemplos: [],
    });
  }
  // O patrimônio que salta sem decisão grande no ano. O que chegou de outras pessoas (a herança, o fundo da família) não
  // conta como salto: é dinheiro que já existia; e a base é pelo menos dez PIBs por pessoa (o salário não salta).
  const saltos: string[] = [];
  let anosOlhados = 0;
  for (const v of vidas) {
    for (let i = 1; i < v.anos.length; i++) {
      const a = v.anos[i - 1]!;
      const b = v.anos[i]!;
      if (a.patrimonio < 10 * a.mundo.pibPerCapita) continue;
      anosOlhados++;
      if (b.patrimonio - (b.recebido ?? 0) < a.patrimonio * 3) continue;
      const decidiu = v.registros.some((x) => x.ano === a.ano && x.tipo !== 'ano' && Math.abs(x.efeito.patrimonio) > 0.5 * a.patrimonio);
      if (!decidiu) saltos.push(exemplo(v, b.ano));
    }
  }
  if (anosOlhados > 0) {
    r.incoerencias.push({
      titulo: `O patrimônio triplica num ano sem uma decisão de quem joga do mesmo tamanho: ${saltos.length} vezes`,
      natureza: 'hipotese',
      confianca: saltos.length >= 30 ? 'media' : 'baixa',
      metrica: `${saltos.length} de ${anosOlhados} anos olhados (com patrimônio de dez PIBs por pessoa ou mais; a herança e o dinheiro da família ficam de fora); a causa pode ser legítima (a empresa que cresce, a bolsa) e precisa ser lida no livro`,
      n: anosOlhados,
      exemplos: saltos.slice(0, 3),
    });
  }

  // ---------------------------------------------------------------- o conteúdo que falta (a saturação por faixa de riqueza)
  for (const fx of FAIXAS) {
    const anos = vidas.flatMap((v) => saturacoes.get(v)!.anos.filter((a) => {
      const f = v.anos.find((x) => x.ano === a.ano);
      return f !== undefined && f.idade >= 25 && f.percentil >= fx.de && f.percentil < fx.ate;
    }));
    if (anos.length === 0) continue;
    const componentes: Partial<Record<Componente, number>> = {};
    for (const k of COMPONENTES) {
      const xs = anos.map((a) => a.componentes[k]).filter((x): x is number => x !== undefined);
      if (xs.length > 0) componentes[k] = media(xs);
    }
    r.saturacaoPorFaixa.push({ faixa: fx.nome, anos: anos.length, indice: media(anos.map((a) => a.indice)), componentes });
  }
  const topo = r.saturacaoPorFaixa.at(-1);
  const base = r.saturacaoPorFaixa[0];
  if (topo && base) {
    const piores = (Object.entries(topo.componentes) as [Componente, number][]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    r.conteudoInsuficiente.push({
      titulo: `A saturação sobe com a riqueza: ${dec(base.indice, 2)} na metade de baixo, ${dec(topo.indice, 2)} no ${topo.faixa}`.replace('no 0,1%', 'no 0,1%'),
      natureza: 'fato',
      confianca: confiancaPorN(topo.anos),
      metrica: `no topo, os componentes que mais pesam: ${piores.map(([k, x]) => `${k} ${dec(x, 2)}`).join(', ')} (${topo.anos} anos de vida adulta)`,
      n: topo.anos,
      exemplos: [],
    });
  }

  // Os sistemas que deixam de servir: o componente que fica saturado (0,7 ou mais) cinco anos seguidos na vida adulta,
  // nas vidas que chegaram ao 1% mais rico e nas outras. É a medida por sistema, ao lado do índice que junta todos.
  const chegaramAoTopo = (v: VidaObservada): boolean => v.anos.some((f) => f.idade >= 25 && f.percentil >= 0.99);
  const deixaDeServir: { k: Componente; parte: number; n: number }[] = [];
  for (const k of COMPONENTES) {
    const desde = (v: VidaObservada): number | null => {
      let seguidos = 0;
      for (const a of saturacoes.get(v)!.anos) {
        const x = a.idade >= 25 ? a.componentes[k] : undefined;
        if (x === undefined) continue;
        seguidos = x >= LIMIAR_DE_ESGOTAMENTO ? seguidos + 1 : 0;
        if (seguidos >= ANOS_DE_ESGOTAMENTO) return a.ano - ANOS_DE_ESGOTAMENTO + 1;
      }
      return null;
    };
    const topoV = vidas.filter(chegaramAoTopo);
    const outras = vidas.filter((v) => !chegaramAoTopo(v));
    const noTopo = topoV.map((v) => [v, desde(v)] as const).filter(([, a]) => a !== null);
    const nasOutras = outras.filter((v) => desde(v) !== null).length;
    if (topoV.length < 5 || noTopo.length === 0) continue;
    deixaDeServir.push({ k, parte: noTopo.length / topoV.length, n: topoV.length });
    r.conteudoInsuficiente.push({
      titulo: `"${k}" deixa de servir: fica saturado cinco anos seguidos em ${pct(noTopo.length / topoV.length)} das vidas que chegaram ao 1% mais rico (${pct(nasOutras / Math.max(1, outras.length))} das outras)`,
      natureza: 'fato',
      confianca: confiancaPorN(topoV.length),
      metrica: `${noTopo.length} de ${topoV.length} vidas do topo e ${nasOutras} de ${outras.length} das outras; ${textoDoComponente(k)}`,
      n: topoV.length,
      exemplos: noTopo.slice(0, 3).map(([v, a]) => exemplo(v, a!)),
    });
  }

  // ---------------------------------------------------------------- as anomalias econômicas e os extremos
  for (const tipo of TIPOS_DE_EXTREMO) {
    const achados = vidas.flatMap((v) => extremosDe.get(v)!.filter((a) => a.tipo === tipo).map((a) => ({ v, a })));
    r.extremos.push({ tipo, notaveis: achados.filter((x) => x.a.nivel === 'notavel').length, extremos: achados.filter((x) => x.a.nivel === 'extremo').length });
    const ext = achados.filter((x) => x.a.nivel === 'extremo');
    if (ext.length === 0) continue;
    const l = LIMIARES[tipo];
    const anomalia = tipo === 'crescimento_explosivo' || tipo === 'fortuna_nacional' || tipo === 'grupo_no_pib' || tipo === 'concentracao_de_mercado';
    (anomalia ? r.anomalias : r.comportamentos).push({
      titulo: `${l.medida}: ${ext.length} vidas passam do limiar extremo (${l.extremo})`,
      natureza: 'fato',
      confianca: confiancaPorN(ext.length, false),
      metrica: `o maior: ${numero(Math.max(...ext.map((x) => x.a.valor)))}; por que este limiar: ${l.porque}`,
      n: ext.length,
      exemplos: ext.sort((a, b) => b.a.valor - a.a.valor).slice(0, 3).map((x) => exemplo(x.v, x.a.ano)),
    });
  }
  const parados2 = vidas.flatMap((v) => v.anos.filter((f) => f.mercadoCabe < 0.5).map((f) => ({ v, f })));
  if (parados2.length > 0) {
    r.anomalias.push({
      titulo: `Dinheiro sem onde render: ${parados2.length} anos com mais da metade do aplicado fora do que o mercado comporta`,
      natureza: 'fato',
      confianca: confiancaPorN(parados2.length, false),
      metrica: `em ${new Set(parados2.map((x) => x.v)).size} vidas; o excedente perde a inflação (etapa 02)`,
      n: parados2.length,
      exemplos: parados2.slice(0, 3).map((x) => exemplo(x.v, x.f.ano)),
    });
  }

  // ---------------------------------------------------------------- as oportunidades (hipóteses tiradas do que veio antes)
  if (topo && topo.indice > (base?.indice ?? 0) + 0.15) {
    r.oportunidades.push({
      titulo: 'Conteúdo para o topo: histórias e decisões com custo e risco proporcionais ao patrimônio',
      natureza: 'hipotese',
      confianca: confiancaPorN(topo.anos),
      metrica: `a saturação do topo (${dec(topo.indice, 2)}) passa a da metade de baixo (${dec(base?.indice ?? 0, 2)}) em ${dec((topo.indice - (base?.indice ?? 0)), 2)}; é a A-04 da etapa 01`,
      n: topo.anos,
      exemplos: [],
    });
  }
  for (const n of r.negligenciados.filter((x) => x.titulo.includes('usada em'))) {
    r.oportunidades.push({
      titulo: `Tornar visível ou útil a área ${n.titulo.split(':')[0]}`,
      natureza: 'hipotese',
      confianca: 'baixa',
      metrica: `${n.titulo}. Com robôs, pode ser só que a regra deles nunca a escolhe`,
      n: n.n,
      exemplos: [],
    });
  }
  for (const d of deixaDeServir.filter((x) => x.parte >= 0.3)) {
    r.oportunidades.push({
      titulo: SUGESTAO_DO_COMPONENTE[d.k],
      natureza: 'hipotese',
      confianca: confiancaPorN(d.n),
      metrica: `"${d.k}" fica saturado cinco anos seguidos em ${pct(d.parte)} das vidas que chegaram ao 1% mais rico (seção Conteúdos insuficientes)`,
      n: d.n,
      exemplos: [],
    });
  }
  for (const n of r.negligenciados.filter((x) => x.titulo.includes('abandonada') && x.n >= 10)) {
    const parte = Number(/em (\d+)% das vidas/.exec(n.titulo)?.[1] ?? 0) / 100;
    if (parte < 0.5) continue;
    r.oportunidades.push({
      titulo: `Dar continuidade à área ${n.titulo.split(':')[0]}: o que quem começa por ela encontra depois`,
      natureza: 'hipotese',
      confianca: 'baixa',
      metrica: `${n.titulo}. Com robôs, pode ser a regra deles; com pessoas, seria o sinal de que a área não tem segundo ato`,
      n: n.n,
      exemplos: [],
    });
  }
  if (semEscolhaReal / Math.max(1, comEscolha) > 0.05) {
    r.oportunidades.push({
      titulo: 'Rever os eventos que chegam com uma opção só liberada',
      natureza: 'hipotese',
      confianca: 'media',
      metrica: `${pct(semEscolhaReal / comEscolha, 1)} das escolhas não eram escolha; a lista está nas incoerências`,
      n: comEscolha,
      exemplos: [],
    });
  }
  return r;
}

/** A hipótese de melhoria de cada sistema que deixa de servir no topo (o que testar, não o que fazer). */
const SUGESTAO_DO_COMPONENTE: Record<Componente, string> = {
  escala: 'Conteúdo do topo: histórias e jogadas com custo e risco proporcionais ao patrimônio (a A-04 da etapa 01)',
  investimento: 'Onde pôr o dinheiro que o mercado já não comporta (o mundo lá fora, a infraestrutura, o próprio país)',
  concorrencia: 'Concorrência que cresce com o grupo (a estrangeira, a que se junta, o regulador) para o topo continuar disputado',
  objetivos: 'Planos e sonhos para quem já chegou lá e para a velhice',
  repeticao: 'Mais variações das histórias que se repetem no topo',
  consequencia: 'Decisões do topo com efeito proporcional: as escolhas grandes de quem está no 1% mexem pouco no que ele tem',
  salario: 'Dar à carreira de quem é rico outro peso além do salário (o poder, a influência, a fama, o legado)',
};

function textoDoComponente(k: Componente): string {
  switch (k) {
    case 'escala':
      return 'poucos dos storylets elegíveis mexem em 1% do patrimônio ou mais';
    case 'investimento':
      return 'parte do dinheiro aplicado já não cabe no mercado (fica parado e perde a inflação)';
    case 'concorrencia':
      return 'as concorrentes ficaram pequenas diante do grupo';
    case 'objetivos':
      return 'há poucos planos e sonhos de pé ou por começar';
    case 'repeticao':
      return 'os storylets que aparecem já tinham aparecido antes';
    case 'consequencia':
      return 'as decisões grandes mexem em menos de 0,1% do patrimônio';
    case 'salario':
      return 'o salário de uma carreira inteira é pouco diante do patrimônio';
  }
}

// ---------------------------------------------------------------- o texto

function secao(titulo: string, itens: readonly Item[]): string[] {
  const linhas = [`## ${titulo}`, ''];
  if (itens.length === 0) {
    linhas.push('Nada a registrar nesta amostra.', '');
    return linhas;
  }
  for (const it of itens) {
    linhas.push(`- **${it.titulo}** · ${it.natureza === 'fato' ? 'fato observado' : 'hipótese'} · confiança ${it.confianca} (n = ${it.n})`);
    linhas.push(`  - ${it.metrica}`);
    if (it.exemplos.length > 0) linhas.push(`  - Para reproduzir: ${it.exemplos.join('; ')}`);
  }
  linhas.push('');
  return linhas;
}

export function emMarkdown(r: Relatorio): string {
  const l: string[] = [];
  l.push(`# Observatório: ${r.fonte}`, '');
  l.push(r.descricao, '');
  l.push(`${r.vidas} vidas em ${r.partidas} partidas, ${r.anosVividos} anos vividos, ${r.registros} decisões e passagens de ano registradas; ${r.completas === r.vidas ? 'todas observadas comando a comando' : `${r.completas} observadas comando a comando, ${r.vidas - r.completas} só pelo livro (sem as opções que estavam na mesa)`}.`, '');
  l.push('Cada item diz se é **fato observado** nestas vidas ou **hipótese** tirada dele, a confiança (pelo tamanho da amostra) e como reproduzir os exemplos.', '');
  l.push(...secao('Comportamentos identificados', r.comportamentos));
  l.push('| Perfil | Vidas com probabilidade ≥ 0,6 | Probabilidade média |', '|---|---|---|');
  for (const p of r.perfis) l.push(`| ${NOMES_DOS_PERFIS[p.perfil]} | ${p.vidas} (${pct(p.vidas / Math.max(1, r.vidas))}) | ${dec(p.media, 2)} |`);
  l.push('');
  l.push(...secao('Estratégias dominantes', r.estrategias));
  l.push(...secao('Sistemas mais utilizados', r.maisUsados));
  l.push('| Área | Decisões | Vidas que usaram |', '|---|---|---|');
  for (const a of [...r.areas].sort((x, y) => y.decisoes - x.decisoes)) l.push(`| ${a.area} | ${a.decisoes} | ${a.vidas} (${pct(a.vidas / Math.max(1, r.vidas))}) |`);
  l.push('');
  l.push(...secao('Sistemas negligenciados', r.negligenciados));
  l.push(...secao('Gargalos de progressão', r.gargalos));
  l.push(...secao('Situações incoerentes', r.incoerencias));
  l.push(...secao('Conteúdos insuficientes', r.conteudoInsuficiente));
  l.push('| Faixa da riqueza (vida adulta) | Anos | Saturação | ' + COMPONENTES.join(' | ') + ' |', `|---|---|---|${COMPONENTES.map(() => '---').join('|')}|`);
  for (const f of r.saturacaoPorFaixa) l.push(`| ${f.faixa} | ${f.anos} | ${dec(f.indice, 2)} | ${COMPONENTES.map((k) => (f.componentes[k] === undefined ? '-' : dec(f.componentes[k]!, 2))).join(' | ')} |`);
  l.push('');
  l.push(...secao('Anomalias econômicas', r.anomalias));
  l.push('| Extremo | Notáveis | Extremos | Medida |', '|---|---|---|---|');
  for (const x of r.extremos) l.push(`| ${x.tipo} | ${x.notaveis} | ${x.extremos} | ${LIMIARES[x.tipo as keyof typeof LIMIARES].medida} |`);
  l.push('');
  l.push(...secao('Oportunidades de melhoria', r.oportunidades));
  return l.join('\n');
}
