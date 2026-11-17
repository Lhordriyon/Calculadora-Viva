/**
 * O observatório dos extremos (etapa 03, I-196): quem está fora da experiência comum, por medidas relativas (o
 * percentil da riqueza no Brasil real, a fração do PIB, a fatia de um mercado, os anos no poder, as gerações), nunca
 * só por um valor em reais. Cada achado diz a medida, o valor, o limiar e o porquê do limiar, e o ano em que apareceu.
 */
import { AREAS, type FotoDoAno, type VidaObservada } from './observacao.ts';

export type Nivel = 'notavel' | 'extremo';

export interface Achado {
  tipo: TipoDeExtremo;
  nivel: Nivel;
  medida: string;
  valor: number;
  limiar: number;
  /** O ano (e a geração) em que o limiar foi passado pela primeira vez. */
  ano: number;
  geracao: number;
}

export const TIPOS_DE_EXTREMO = [
  'riqueza_relativa',
  'fortuna_nacional',
  'grupo_no_pib',
  'holding_com_subsidiarias',
  'concentracao_de_mercado',
  'poder_politico',
  'fortuna_entre_geracoes',
  'dinastia_longa',
  'exploracao_total',
  'crescimento_explosivo',
] as const;
export type TipoDeExtremo = (typeof TIPOS_DE_EXTREMO)[number];

/** Os limiares (notável, extremo) e o porquê de cada um. */
export const LIMIARES: Record<TipoDeExtremo, { notavel: number; extremo: number; medida: string; porque: string }> = {
  riqueza_relativa: { notavel: 0.99, extremo: 0.999, medida: 'percentil da riqueza no Brasil real', porque: 'o 1% e o 0,1% mais ricos da régua do lugar (lugar.ts), que anda com o PIB per capita' },
  fortuna_nacional: { notavel: 0.001, extremo: 0.01, medida: 'patrimônio sobre o PIB', porque: '0,1% do PIB é a fortuna das maiores famílias do país; 1% é a do mais rico do mundo diante do PIB dos Estados Unidos' },
  grupo_no_pib: { notavel: 0.5, extremo: 2, medida: 'valor adicionado do grupo em % do PIB', porque: 'meio ponto do PIB é uma das maiores empresas do país; dois pontos, a maior de todas' },
  holding_com_subsidiarias: { notavel: 3, extremo: 8, medida: 'subsidiárias com uma holding', porque: 'um grupo de verdade, com camadas; oito ou mais é um conglomerado que só se governa delegando' },
  concentracao_de_mercado: { notavel: 0.25, extremo: 0.5, medida: 'maior fatia de um mercado do Brasil', porque: 'um quarto de um mercado já passa pelo Cade; metade é domínio' },
  poder_politico: { notavel: 4, extremo: 12, medida: 'anos com cargo de governo nacional, coroa ou regime', porque: 'um mandato inteiro; doze anos é o poder que fica' },
  fortuna_entre_geracoes: { notavel: 3, extremo: 5, medida: 'geração que ainda começa entre os 1% mais ricos', porque: 'a riqueza que atravessa três gerações já é rara; cinco é uma casa' },
  dinastia_longa: { notavel: 4, extremo: 8, medida: 'gerações da família', porque: 'quatro gerações passam de um século; oito, de dois' },
  exploracao_total: { notavel: 0.7, extremo: 0.85, medida: 'áreas do jogo usadas na vida', porque: 'quem toca mais de 70% das áreas já viu quase tudo o que o jogo oferece' },
  crescimento_explosivo: { notavel: 100, extremo: 10000, medida: 'quantas vezes o patrimônio cresceu numa década', porque: 'cem vezes em dez anos, sem contar herança, é o que só uma empresa ou uma jogada dá; dez mil pede que se leia o livro (a jogada certa ou um defeito)' },
};

const CARGOS_NACIONAIS = new Set(['presidente', 'rei', 'soberano', 'ditador']);

function primeiro(fotos: readonly FotoDoAno[], valor: (f: FotoDoAno) => number, limiar: number): FotoDoAno | undefined {
  return fotos.find((f) => valor(f) >= limiar);
}

function achar(saida: Achado[], tipo: TipoDeExtremo, valor: number, ano: number, geracao: number): void {
  const l = LIMIARES[tipo];
  if (valor < l.notavel) return;
  saida.push({ tipo, nivel: valor >= l.extremo ? 'extremo' : 'notavel', medida: l.medida, valor, limiar: valor >= l.extremo ? l.extremo : l.notavel, ano, geracao });
}

/** Os extremos de uma vida, pelas fotos e pelos registros. */
export function extremosDaVida(vida: VidaObservada): Achado[] {
  const saida: Achado[] = [];
  const fotos = vida.anos;
  const g = vida.geracao;
  const maior = (valor: (f: FotoDoAno) => number): { v: number; ano: number } => {
    let v = -Infinity;
    let ano = vida.inicio;
    for (const f of fotos) {
      const x = valor(f);
      if (x > v) {
        v = x;
        ano = f.ano;
      }
    }
    return { v: v === -Infinity ? 0 : v, ano };
  };
  const anoDe = (valor: (f: FotoDoAno) => number, l: number, fallback: number): number => primeiro(fotos, valor, l)?.ano ?? fallback;
  for (const [tipo, valor] of [
    ['riqueza_relativa', (f: FotoDoAno) => f.percentil],
    ['fortuna_nacional', (f: FotoDoAno) => f.patrimonioSobrePib],
    ['grupo_no_pib', (f: FotoDoAno) => f.pesoNoPib],
    ['holding_com_subsidiarias', (f: FotoDoAno) => (f.nHoldings > 0 ? f.nSubsidiarias : 0)],
    ['concentracao_de_mercado', (f: FotoDoAno) => f.maiorFatia],
  ] as const) {
    const m = maior(valor);
    achar(saida, tipo, m.v, anoDe(valor, LIMIARES[tipo].notavel, m.ano), g);
  }
  const noPoder = fotos.filter((f) => CARGOS_NACIONAIS.has(f.cargo) || f.coroa || f.regime);
  if (noPoder.length > 0) achar(saida, 'poder_politico', noPoder.length, noPoder[0]!.ano, g);
  // Começar a vida entre os 1% mais ricos depois da terceira geração: a fortuna atravessou a família.
  if (fotos[0] && fotos[0].percentil >= 0.99) achar(saida, 'fortuna_entre_geracoes', g, fotos[0].ano, g);
  achar(saida, 'dinastia_longa', g, vida.inicio, g);
  const areas = new Set<string>();
  for (const r of vida.registros) {
    if (r.tipo === 'ano') continue;
    if (r.area !== 'evento') areas.add(r.area);
    for (const a of r.areas) areas.add(a);
  }
  achar(saida, 'exploracao_total', areas.size / (AREAS.length - 1), vida.fim?.ano ?? vida.inicio, g);
  // O maior salto do patrimônio em dez anos: a base é pelo menos dois PIBs por pessoa (o primeiro emprego não conta),
  // mais o que chegou de outras pessoas no meio (a herança, o fundo da família): é dinheiro que já existia.
  let salto = 0;
  let anoDoSalto = vida.inicio;
  for (let i = 0; i < fotos.length; i++) {
    const j = fotos.findIndex((f) => f.ano >= fotos[i]!.ano + 10);
    if (j < 0) break;
    const recebido = fotos.slice(i + 1, j + 1).reduce((t, f) => t + (f.recebido ?? 0), 0);
    const x = Math.max(0, fotos[j]!.patrimonio) / (Math.max(2 * fotos[i]!.mundo.pibPerCapita, fotos[i]!.patrimonio, 1) + recebido);
    if (x > salto) {
      salto = x;
      anoDoSalto = fotos[j]!.ano;
    }
  }
  achar(saida, 'crescimento_explosivo', salto, anoDoSalto, g);
  return saida;
}

/** O percentil de um valor numa lista (0 a 1), para dizer "acima do p99 da população observada". */
export function percentilNa(lista: readonly number[], valor: number): number {
  if (lista.length === 0) return 0;
  let abaixo = 0;
  for (const x of lista) if (x < valor) abaixo++;
  return abaixo / lista.length;
}

/** O valor de um quantil (0 a 1) de uma lista. */
export function quantil(lista: readonly number[], q: number): number {
  if (lista.length === 0) return 0;
  const o = [...lista].sort((a, b) => a - b);
  return o[Math.min(o.length - 1, Math.max(0, Math.floor(q * (o.length - 1))))]!;
}
