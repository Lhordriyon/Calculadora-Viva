/**
 * Medidas do túnel que não dependem do motor: recebem números e listas já
 * extraídos das vidas. Definições em docs/metricas.md (seção "Como medimos").
 */

export const media = (xs: number[]): number => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
export const ordenar = (xs: number[]): number[] => [...xs].sort((a, b) => a - b);

export function percentil(ordenados: number[], p: number): number {
  if (ordenados.length === 0) return 0;
  const i = Math.min(ordenados.length - 1, Math.max(0, Math.round((p / 100) * (ordenados.length - 1))));
  return ordenados[i]!;
}

export function desvio(xs: number[]): number {
  const m = media(xs);
  return Math.sqrt(media(xs.map((x) => (x - m) ** 2)));
}

/**
 * Saturação: para cada jogador (vidas em ordem), a fração das instâncias
 * distintas da vida k que já tinham aparecido em alguma vida anterior.
 * Devolve a média por posição k (0 = primeira vida, sempre 0).
 */
export function saturacao(jogadores: string[][][]): number[] {
  const maxVidas = Math.max(0, ...jogadores.map((j) => j.length));
  const porK: number[][] = Array.from({ length: maxVidas }, () => []);
  for (const vidas of jogadores) {
    const vistos = new Set<string>();
    vidas.forEach((instancias, k) => {
      const unicas = new Set(instancias);
      if (k > 0 && unicas.size > 0) {
        let ja = 0;
        for (const i of unicas) if (vistos.has(i)) ja++;
        porK[k]!.push(ja / unicas.size);
      }
      for (const i of unicas) vistos.add(i);
    });
  }
  return porK.map((xs) => media(xs));
}

/** Assinaturas distintas a cada bloco de `tamanho` vidas (média dos blocos completos). */
export function assinaturasPorBloco(assinaturas: string[], tamanho = 1000): number {
  const blocos = Math.floor(assinaturas.length / tamanho);
  if (blocos === 0) return new Set(assinaturas).size * (tamanho / Math.max(1, assinaturas.length));
  // Blocos intercalados (vida i vai para o bloco i % blocos): cada bloco mistura estratégias e jogadores.
  const conjuntos = Array.from({ length: blocos }, () => new Set<string>());
  assinaturas.slice(0, blocos * tamanho).forEach((a, i) => conjuntos[i % blocos]!.add(a));
  return media(conjuntos.map((s) => s.size));
}

/** Postos de 0 a 1 (empates recebem o posto médio). */
function postos(xs: number[]): number[] {
  const idx = xs.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(xs.length);
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1]![0] === idx[i]![0]) j++;
    const posto = (i + j) / 2 / Math.max(1, xs.length - 1);
    for (let k = i; k <= j; k++) r[idx[k]![1]] = posto;
    i = j + 1;
  }
  return r;
}

function correlacao(a: number[], b: number[]): number {
  const ma = media(a);
  const mb = media(b);
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < a.length; i++) {
    num += (a[i]! - ma) * (b[i]! - mb);
    da += (a[i]! - ma) ** 2;
    db += (b[i]! - mb) ** 2;
  }
  return da > 0 && db > 0 ? num / Math.sqrt(da * db) : 0;
}

export interface Mobilidade {
  /** [origem][final], frações por linha (cada linha soma 1). */
  matriz: number[][];
  /** Fração que termina no mesmo quintil em que nasceu. */
  diagonal: number;
  /** Correlação de postos (Spearman) entre origem e final. */
  spearman: number;
  /** Do quintil mais pobre ao mais rico, e o contrário. */
  baixoParaAlto: number;
  altoParaBaixo: number;
}

/** Quintis por posto; empates na origem são desfeitos pela ordem estável (desempate fornecido). */
function quintis(xs: number[], desempate: number[]): number[] {
  const idx = xs.map((_, i) => i).sort((a, b) => xs[a]! - xs[b]! || desempate[a]! - desempate[b]!);
  const q = new Array<number>(xs.length);
  idx.forEach((i, pos) => (q[i] = Math.min(4, Math.floor((pos / xs.length) * 5))));
  return q;
}

export function mobilidade(origem: number[], final: number[], desempate: number[]): Mobilidade {
  const qo = quintis(origem, desempate);
  const qf = quintis(final, desempate);
  const contagem = Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]);
  for (let i = 0; i < origem.length; i++) contagem[qo[i]!]![qf[i]!]!++;
  const matriz = contagem.map((linha) => {
    const total = linha.reduce((s, x) => s + x, 0);
    return linha.map((x) => (total ? x / total : 0));
  });
  const diagonal = media(qo.map((q, i) => (q === qf[i] ? 1 : 0)));
  return {
    matriz,
    diagonal,
    spearman: correlacao(postos(origem), postos(final)),
    baixoParaAlto: matriz[0]![4]!,
    altoParaBaixo: matriz[4]![0]!,
  };
}
