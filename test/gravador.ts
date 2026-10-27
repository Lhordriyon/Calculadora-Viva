/**
 * O gravador das etapas do ano (fatia 1.3): enquanto cada etapa roda, as entidades passam por um Proxy que anota o que
 * foi lido e escrito, em caminhos genéricos (manifesto.ts › EtapaDoAno); o livro diz o que mudou com causa, e a agenda
 * que mudou vira a escrita `agenda`, e o que uma etapa passa para outra (a fase, o mercado, a economia do ano) vira
 * `ano.fase`, `ano.mercado`… Só para testes: a vida jogada com ele é a mesma de sem ele.
 */
import { PAPEIS, PARCEIROS, papelBase } from '../src/motor/constantes.ts';
import type { IdEtapa } from '../src/motor/manifesto.ts';
import type { Entidade, EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { observarOAno } from '../src/motor/vida.ts';

export interface Gravado {
  le: Set<string>;
  escreve: Set<string>;
  /** O que as mudanças do livro dizem que a etapa escreveu (o registro do ano e as entradas que ela lançou). */
  livro: Set<string>;
}

const PESSOAS = new Set<string>(PAPEIS);
const FORA = new Set<string>(PARCEIROS);
/** Campos da entidade que contam como estado (o id e o tipo são a forma, não o conteúdo). */
const META = new Set(['nome', 'genero', 'nascimento', 'vivo', 'morte']);
/** O que toda etapa recebe para trabalhar (a vida, o conteúdo, o registro do ano): o resto do que passa entre as etapas é `ano.*`. */
const DO_ANO = new Set(['e', 'c', 'memoria', 'reg', 'inicio', 'idRegras', 'fim']);

/** "mae" → "pessoa", "ex2" → "pessoa", "empresa3" → "empresa", "bem12" → "bem", "ctr0" → "ctr", "tit57" → "tit", "celeste" → "fora". */
export function generico(id: string): string {
  if (PESSOAS.has(papelBase(id))) return 'pessoa';
  if (FORA.has(id)) return 'fora';
  if (/^empresa\d*$/.test(id)) return 'empresa';
  if (/^bem\d/.test(id)) return 'bem';
  if (id.startsWith('ctr')) return 'ctr';
  if (/^tit\d/.test(id)) return 'tit';
  return id;
}

function caminhoGenerico(c: string): string {
  const i = c.indexOf('.');
  return `${generico(c.slice(0, i))}.${c.slice(i + 1)}`;
}

function chaveDe(m: Mudanca): string {
  return `${m.c}|${m.r ?? ''}|${m.p ?? ''}|${m.q !== undefined ? 'q' : m.t !== undefined ? 't' : 'd'}`;
}

/** Joga `jogar` com o gravador ligado e devolve o que cada etapa leu e escreveu. */
export function gravarEtapas(jogar: () => void): Map<IdEtapa, Gravado> {
  const gravado = new Map<IdEtapa, Gravado>();
  let atual: Gravado | null = null;
  let original: Record<string, Entidade> | null = null;
  let antesDoReg = new Map<string, number>();
  let tamanhoDoReg = 0;
  let tamanhoDoLivro = 0;
  let agendaAntes = '';
  const ler = (s: string): void => void atual?.le.add(s);
  const escrever = (s: string): void => void atual?.escreve.add(s);

  const campos = (g: string, alvo: Record<string, unknown>): Record<string, unknown> =>
    new Proxy(alvo, {
      get(t, k) {
        if (typeof k === 'string') ler(`${g}.${k}`);
        return Reflect.get(t, k);
      },
      has(t, k) {
        if (typeof k === 'string') ler(`${g}.${k}`);
        return Reflect.has(t, k);
      },
      ownKeys(t) {
        ler(`${g}.*`);
        return Reflect.ownKeys(t);
      },
      set(t, k, v) {
        if (typeof k === 'string') escrever(`${g}.${k}`);
        return Reflect.set(t, k, v);
      },
      deleteProperty(t, k) {
        if (typeof k === 'string') escrever(`${g}.${k}`);
        return Reflect.deleteProperty(t, k);
      },
    });

  const entidade = (en: Entidade): Entidade => {
    const g = generico(en.id);
    const partes = { n: campos(g, en.n), t: campos(g, en.t), q: campos(g, en.q as Record<string, unknown>) };
    return new Proxy(en, {
      get(t, k) {
        if (k === 'n' || k === 't' || k === 'q') return partes[k];
        if (typeof k === 'string' && META.has(k)) ler(`${g}.${k}`);
        return Reflect.get(t, k);
      },
      set(t, k, v) {
        if (typeof k === 'string' && META.has(k)) escrever(`${g}.${k}`);
        return Reflect.set(t, k, v);
      },
    });
  };

  const entidades = (raw: Record<string, Entidade>): Record<string, Entidade> => {
    const cache = new Map<Entidade, Entidade>();
    return new Proxy(raw, {
      get(t, k) {
        const en = Reflect.get(t, k) as Entidade | undefined;
        if (typeof k !== 'string' || !en || typeof en !== 'object') return en;
        let p = cache.get(en);
        if (!p) {
          p = entidade(en);
          cache.set(en, p);
        }
        return p;
      },
    });
  };

  observarOAno({
    embrulhar(_etapa, ano) {
      // Ler o que a própria etapa acabou de deixar não é depender de ninguém.
      const deixou = new Set<string>();
      return new Proxy(ano, {
        get(t, k) {
          if (typeof k === 'string' && !DO_ANO.has(k) && !deixou.has(k)) ler(`ano.${k}`);
          return Reflect.get(t, k);
        },
        set(t, k, v) {
          if (typeof k === 'string' && !DO_ANO.has(k)) {
            deixou.add(k);
            escrever(`ano.${k}`);
          }
          return Reflect.set(t, k, v);
        },
      });
    },
    antes(etapa, e, reg) {
      atual = gravado.get(etapa) ?? { le: new Set(), escreve: new Set(), livro: new Set() };
      gravado.set(etapa, atual);
      antesDoReg = new Map(reg.map((m) => [chaveDe(m), m.d ?? 0]));
      tamanhoDoReg = reg.length;
      tamanhoDoLivro = e.historico.length;
      agendaAntes = JSON.stringify(e.agenda);
      original = e.entidades;
      e.entidades = entidades(original);
    },
    depois(_etapa, e, reg) {
      if (original) e.entidades = original;
      original = null;
      const g = atual!;
      if (JSON.stringify(e.agenda) !== agendaAntes) g.escreve.add('agenda');
      reg.forEach((m, i) => {
        const novo = i >= tamanhoDoReg && (m.q !== undefined || m.t !== undefined);
        if (novo || (m.d !== undefined && m.q === undefined && m.t === undefined && antesDoReg.get(chaveDe(m)) !== m.d)) g.livro.add(caminhoGenerico(m.c));
      });
      // A entrada das regras miúdas do ano já foi contada etapa por etapa, pelo registro.
      for (const h of e.historico.slice(tamanhoDoLivro)) if (h.ref !== 'ano') for (const m of h.mudancas ?? []) g.livro.add(caminhoGenerico(m.c));
      atual = null;
    },
  });
  try {
    jogar();
  } finally {
    observarOAno(null);
  }
  return gravado;
}

/** Um caminho cabe numa declaração: igual, ou um prefixo terminado em `*` (`eu.voto_*`, `pais.*`, `*` para o conteúdo). */
export function declarado(caminho: string, lista: readonly string[]): boolean {
  return lista.some((d) => d === caminho || (d.endsWith('*') && caminho.startsWith(d.slice(0, -1))));
}

/** Para ler mais fácil: o que não coube na declaração. */
export function foraDa(lista: readonly string[], gravados: Iterable<string>): string[] {
  return [...gravados].filter((x) => !declarado(x, lista)).sort();
}

export type { EstadoVida };
