/**
 * O Estado pesquisa (bloco D). A política "Ciência e tecnologia" (mundo.json › politicas) põe parte do PIB em pesquisa:
 * o gasto entra no primário, e a dívida anda com ele. O estoque de tecnologia do país (`pais.tecnologia`) anda devagar
 * para onde a ciência e a escola levam (pais.ts › alvosDoPais) e volta, uma década depois, como crescimento potencial,
 * saúde pública e tração das empresas (mundo.json › setores › pesquisa). Este módulo conta o que o estoque vira: as
 * descobertas (a cura, o satélite, a patente) e a fuga de cérebros, entradas do mundo na linha do tempo com a decisão
 * que levou a ciência até ali de causa; quanto o governo põe em pesquisa, em reais; e a verba das carreiras que a
 * ciência paga.
 */
import type { Politica } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import type { Noticia } from './esquema.ts';
import { lancar, novaEntrada, somar } from './livro.ts';
import { governoAtual, nivelDe } from './pais.ts';
import { PESQUISA, VERBA_DA_CARREIRA } from './regras.ts';
import { aleatorio, sortear } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entrada, EstadoVida, Mudanca } from './tipos.ts';

export const DESCOBERTAS = ['cura', 'satelite', 'patente'] as const;
export type Descoberta = (typeof DESCOBERTAS)[number];

/** A história que cada descoberta traz para a vida de quem joga, e as idades em que ela cabe. */
const NA_VIDA: Record<Descoberta, { evento: string; idade: readonly [number, number] }> = {
  cura: { evento: 'a_vacina_no_posto', idade: [12, 110] },
  satelite: { evento: 'satelite_na_tv', idade: [6, 17] },
  patente: { evento: 'socio_da_patente', idade: [25, 75] },
};

/** Quanto o governo põe em pesquisa: os pontos do PIB (a base mais o que a política soma ou tira) e o mesmo em reais de hoje. */
export function gastoEmPesquisa(e: EstadoVida, c: Conteudo): { pontos: number; reais: number } {
  const def = c.mundo.politicas.find((p) => p.id === 'pesquisa');
  const pontos = Math.max(0, PESQUISA.base + (def?.efeitos.gasto?.[nivelDe(e, 'pesquisa')] ?? 0));
  return { pontos, reais: ((e.entidades['pais']?.n['pib'] ?? 0) * pontos) / 100 };
}

/** A verba de uma carreira que uma política paga (a ciência paga quem é cientista): a vaga e a promoção andam com o nível dela. */
export function verbaDe(e: EstadoVida, politica: Politica | undefined): number {
  return politica ? (VERBA_DA_CARREIRA[nivelDe(e, politica)] ?? 1) : 1;
}

/**
 * A decisão que fez o estoque de agora: a posse ou a reforma mais recente que pôs a ciência como prioridade (`nivel`
 * 2, a causa da descoberta) ou a cortou (`nivel` 0, a da fuga), nos últimos `PESQUISA.descoberta.causa` anos; mesmo
 * desfeita depois, a tecnologia ainda carrega o que ela fez. O livro guarda a variação, e o nível de cada momento sai
 * de andar para trás a partir do de agora. As regras não contam, só quem decidiu; o país em que se nasce não tem
 * decisão (null).
 */
export function causaDaPesquisa(e: EstadoVida, nivel: 0 | 2): number | null {
  let depois = e.entidades['pais']?.n['pol_pesquisa'] ?? 1;
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < e.ano - PESQUISA.descoberta.causa) break;
    const ms = h.mudancas ?? [];
    for (let j = ms.length - 1; j >= 0; j--) {
      const m = ms[j]!;
      if (m.c !== 'pais.pol_pesquisa' || m.d === undefined) continue;
      if (m.r === undefined && Math.round(depois) === nivel && (nivel === 2 ? m.d > 0 : m.d < 0)) return h.id;
      depois -= m.d;
    }
  }
  return null;
}

/** Há quantos anos o país viveu a última entrada com essa ref (ou com o prefixo dela): Infinity se não foi nos últimos `limite`. */
function anosDesde(e: EstadoVida, ref: string, limite: number): number {
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < e.ano - limite) break;
    if (h.ref?.startsWith(ref)) return e.ano - h.ano;
  }
  return Infinity;
}

/** A notícia da pesquisa, numa entrada visível do livro, com o país como ator e a decisão de causa. */
function noticia(e: EstadoVida, c: Conteudo, tipo: Noticia, causa: number | null): Entrada {
  const n = c.mundo.noticias[tipo];
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `pesquisa:${tipo}`, ator: 'pais', texto: '' });
  const ctx = contexto(e, { ator: 'pais' });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, n.textos), ctx));
  entrada.resumo = renderizar(n.resumo, ctx);
  if (causa !== null) entrada.causas = [causa];
  return entrada;
}

/** O que a descoberta muda no país: a cura, a saúde pública; o satélite, a aprovação de quem governa (a popularidade, se é quem joga); a patente, a tecnologia. */
function efeitoDaDescoberta(e: EstadoVida, tipo: Descoberta, reg: Mudanca[]): void {
  const v = PESQUISA.efeitos[tipo];
  if (tipo === 'cura') somar(e, reg, 'pais', 'saude', v);
  else if (tipo === 'patente') somar(e, reg, 'pais', 'tecnologia', v);
  else if (governoAtual(e) === 'voce') somar(e, reg, 'pais', 'aprovacao', somar(e, reg, 'eu', 'popularidade', v));
  else somar(e, reg, 'pais', 'aprovacao', v);
}

/**
 * O ano da pesquisa (depois do país). Acima de 55 de tecnologia, o país pode descobrir alguma coisa (a cura, o
 * satélite, a patente; uma a cada quatro anos, e o mesmo tipo a cada quinze), e a descoberta chega à vida de quem joga
 * no ano seguinte. Com a ciência cortada e a tecnologia baixa, os cientistas podem ir embora (uma vez a cada dez anos).
 */
export function regraDaPesquisa(e: EstadoVida, c: Conteudo): void {
  const n = e.entidades['pais']?.n;
  if (!n) return;
  const tec = n['tecnologia'] ?? 50;
  const d = PESQUISA.descoberta;
  if (tec > d.acima && anosDesde(e, 'pesquisa:', d.intervalo) >= d.intervalo && aleatorio(e.rng) < d.porPonto * (tec - d.acima)) {
    const possiveis = DESCOBERTAS.filter((t) => anosDesde(e, `pesquisa:${t}`, d.repete) >= d.repete);
    if (possiveis.length > 0) {
      const tipo = sortear(e.rng, possiveis);
      const reg: Mudanca[] = [];
      const entrada = noticia(e, c, tipo, causaDaPesquisa(e, 2));
      efeitoDaDescoberta(e, tipo, reg);
      lancar(e, entrada, reg);
      const vida = NA_VIDA[tipo];
      if (e.idade >= vida.idade[0] && e.idade <= vida.idade[1] && c.porId.has(vida.evento)) e.agenda.push({ evento: vida.evento, ano: e.ano + 1, origem: entrada.id });
    }
    return;
  }
  const f = PESQUISA.fuga;
  if (nivelDe(e, 'pesquisa') === 0 && tec < f.abaixo && anosDesde(e, 'pesquisa:fugaDeCerebros', f.intervalo) >= f.intervalo && aleatorio(e.rng) < f.chance) {
    const reg: Mudanca[] = [];
    const entrada = noticia(e, c, 'fugaDeCerebros', causaDaPesquisa(e, 0));
    somar(e, reg, 'pais', 'tecnologia', -f.perda);
    lancar(e, entrada, reg);
  }
}
