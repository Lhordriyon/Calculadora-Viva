/** O fim da vida de quem joga: causa sorteada (com condições) ou dada por um efeito. */
import { atende, causasDe } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { semQuemManda } from './empresa.ts';
import { lancar, novaEntrada } from './livro.ts';
import { sortearIndice } from './rng.ts';
import { renderizar } from './texto.ts';
import type { EstadoVida } from './tipos.ts';

interface Sorteio {
  causa: string;
  categoria: string;
  causas: number[];
  fonte?: number;
}

/**
 * Sorteia a causa em mortes.json. A morte do corpo escolhe entre todas, menos as que são só da violência do país;
 * a da violência do país (vida.ts), só entre as violentas (o traço, as marcas e o bairro escolhem qual).
 */
function sortearCausa(e: EstadoVida, c: Conteudo, categoria?: string): Sorteio {
  const pesos = c.mortes.map((m) =>
    (categoria ? m.categoria === categoria : !m.daViolencia) && (!m.idade || (m.idade[0] <= e.idade && e.idade <= m.idade[1])) && atende(m.condicoes, e) ? (m.peso ?? 1) : 0,
  );
  const i = sortearIndice(e.rng, pesos);
  if (i < 0 && categoria === 'violencia') return { causa: 'num assalto, numa noite qualquer', categoria, causas: [] };
  if (i < 0) return { causa: 'de causas que nem o médico soube explicar', categoria: 'doenca', causas: [] };
  const m = c.mortes[i]!;
  return { causa: m.causa, categoria: m.categoria, causas: causasDe(m.condicoes, e), fonte: i };
}

export interface DeOndeVeio {
  /** Causa escrita por um efeito ("morte": "..."); sem ela, sorteia de mortes.json. */
  causa?: string;
  categoria?: string;
  causas?: number[];
  /** Sorteia de mortes.json só entre as causas da categoria (a morte pela violência do país). */
  sortear?: boolean;
}

export function morrer(e: EstadoVida, c: Conteudo, de: DeOndeVeio = {}): void {
  const sorteada = de.causa === undefined ? sortearCausa(e, c, de.sortear ? de.categoria : undefined) : null;
  const texto = renderizar(de.causa ?? sorteada!.causa, contexto(e));
  const causas = [...new Set([...(de.causas ?? []), ...(sorteada?.causas ?? [])])];
  e.vivo = false;
  e.pendente = null;
  e.entidades['eu']!.vivo = false;
  e.entidades['eu']!.morte = e.ano;
  e.morte = { idade: e.idade, ano: e.ano, causa: texto, categoria: de.categoria ?? sorteada?.categoria ?? 'acidente' };
  if (sorteada?.fonte !== undefined) e.morte.fonte = sorteada.fonte;
  const anos = e.idade === 1 ? 'ano' : 'anos';
  const entrada = lancar(
    e,
    novaEntrada(e, {
      tipo: 'morte',
      causa: 'regra',
      ref: 'morte',
      texto: `Morreu aos ${e.idade} ${anos}, ${texto}.`,
      resumo: `morreu ${texto}`,
      causas,
    }),
    [],
  );
  // A empresa sente a falta de quem mandava nela, na medida do quanto dependia dele.
  semQuemManda(e, entrada.id);
}

/** Morte vinda de um efeito (causa explícita) ou de saúde zerada; a entrada que a provocou vira causa. */
export function morrerSePreciso(e: EstadoVida, c: Conteudo, causa: string | undefined, origem: number): void {
  if (!e.vivo) return;
  if (causa) morrer(e, c, { causa, categoria: 'acidente', causas: [origem] });
  else if ((e.entidades['eu']!.n['saude'] ?? 0) <= 0) morrer(e, c, { causas: [origem] });
}
