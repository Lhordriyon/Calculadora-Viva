/**
 * Pontos de virada: cada evento guarda quais entradas anteriores o tornaram
 * possível (marcas consultadas, agendamentos). Isso forma um grafo de causas.
 * A escolha com mais eventos descendentes é a que mais mudou a vida.
 */
import { patrimonio } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import type { Atributo } from './esquema.ts';
import { aleatorio, criarRng, misturar, sortear } from './rng.ts';
import { renderizar } from './texto.ts';
import type { Entrada, EstadoVida, Genero } from './tipos.ts';
import { contexto } from './vida.ts';

export interface PontoDeVirada {
  origemId: number;
  idade: number;
  /** O que você fez ("trocou o ENEM por um bico"). */
  escolha: string;
  consequenciaIdade: number;
  /** A consequência mais distante, contada pelo que aconteceu ali ("abriu uma hamburgueria com Bruno"). */
  consequencia: string;
  /** Quantos eventos descendem desta escolha. */
  total: number;
}

export function descendentes(historico: Entrada[]): Map<number, Set<number>> {
  const filhos = new Map<number, number[]>();
  for (const en of historico) {
    for (const c of en.causas ?? []) {
      const lista = filhos.get(c);
      if (lista) lista.push(en.id);
      else filhos.set(c, [en.id]);
    }
  }
  const resultado = new Map<number, Set<number>>();
  for (const en of historico) {
    const vistos = new Set<number>();
    const pilha = [...(filhos.get(en.id) ?? [])];
    while (pilha.length > 0) {
      const id = pilha.pop()!;
      if (vistos.has(id)) continue;
      vistos.add(id);
      for (const f of filhos.get(id) ?? []) pilha.push(f);
    }
    resultado.set(en.id, vistos);
  }
  return resultado;
}

/** Quanto uma entrada mexeu na vida: atributos, dinheiro, morte. */
function impacto(h: Entrada): number {
  const d = h.deltas ?? {};
  // Dinheiro conta pela variação do patrimônio: investir só troca de bolso.
  const patrimonio = (d.dinheiro ?? 0) + (d.investido ?? 0) - (d.divida ?? 0);
  let x =
    Math.abs(d.saude ?? 0) +
    Math.abs(d.felicidade ?? 0) +
    Math.abs(d.inteligencia ?? 0) +
    Math.abs(d.aparencia ?? 0) +
    Math.abs(patrimonio) / 5000 +
    Math.abs(d.renda ?? 0) / 500;
  if (h.tipo === 'morte') x += 30;
  return x;
}

/** A consequência que melhor conta a história: pesa o impacto e a distância no tempo. */
function melhorConsequencia(origem: Entrada, descendentes: Entrada[]): Entrada {
  let melhor = descendentes[0]!;
  let nota = -Infinity;
  for (const d of descendentes) {
    const n = (1 + impacto(d) / 3) * (1 + (d.idade - origem.idade) / 25);
    if (n > nota || (n === nota && d.idade > melhor.idade)) {
      melhor = d;
      nota = n;
    }
  }
  return melhor;
}

export function pontosDeVirada(e: EstadoVida, limite = 3): PontoDeVirada[] {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const desc = descendentes(e.historico);
  const candidatos: { origem: Entrada; ultima: Entrada; total: number; peso: number; alcance: number }[] = [];
  for (const en of e.historico) {
    if (en.tipo !== 'evento' || !en.escolha) continue;
    const ids = desc.get(en.id);
    if (!ids || ids.size === 0) continue;
    const lista = [...ids].map((id) => porId.get(id)).filter((d): d is Entrada => d !== undefined);
    if (lista.length === 0) continue;
    const alcance = Math.max(...lista.map((d) => d.idade)) - en.idade;
    const peso = lista.reduce((s, d) => s + 1 + impacto(d) / 5, 0);
    candidatos.push({ origem: en, ultima: melhorConsequencia(en, lista), total: lista.length, peso, alcance });
  }
  // Mais peso (consequências, pesadas pelo impacto) primeiro; empate, a que alcançou mais longe.
  candidatos.sort((a, b) => b.peso - a.peso || b.alcance - a.alcance || a.origem.idade - b.origem.idade);

  const escolhidos: PontoDeVirada[] = [];
  const consequenciasUsadas = new Set<number>();
  for (const c of candidatos) {
    if (consequenciasUsadas.has(c.ultima.id)) continue;
    consequenciasUsadas.add(c.ultima.id);
    escolhidos.push({
      origemId: c.origem.id,
      idade: c.origem.idade,
      escolha: c.origem.escolha!.resumo,
      consequenciaIdade: c.ultima.idade,
      consequencia: c.ultima.escolha?.resumo ?? c.ultima.resumo ?? c.ultima.texto,
      total: c.total,
    });
    if (escolhidos.length >= limite) break;
  }
  return escolhidos.sort((a, b) => a.idade - b.idade);
}

export interface ResumoVida {
  nome: string;
  nomeCompleto: string;
  genero: Genero;
  cidade: string;
  uf: string;
  anoNascimento: number;
  anoFinal: number;
  idade: number;
  vivo: boolean;
  causa: string | null;
  atributos: Record<Atributo, number>;
  /** Patrimônio em reais de hoje. */
  patrimonio: number;
  felicidadeMedia: number;
  eventos: number;
  pontos: PontoDeVirada[];
  epitafio: string;
}

export function resumirVida(e: EstadoVida, c: Conteudo): ResumoVida {
  const pontos = pontosDeVirada(e);
  const ctx = { ...contexto(e), rng: criarRng(misturar(e.semente, 0x5eed)) };

  // Epitáfio: metade das vezes vem de uma marca de ponto de virada (se houver); senão, de qualquer
  // marca com epitáfio ou de um genérico, todos com a mesma chance (marcas comuns não monopolizam).
  const origens = new Set(pontos.map((p) => p.origemId));
  const comEpitafio = Object.entries(e.marcas).filter(([m]) => c.marcas[m]?.epitafio);
  const daVirada = comEpitafio.filter(([, reg]) => reg.origem !== null && origens.has(reg.origem));
  const modelos = [...comEpitafio.map(([m]) => c.marcas[m]!.epitafio!), ...c.mundo.epitafios];
  const modelo =
    daVirada.length > 0 && aleatorio(ctx.rng) < 0.5
      ? c.marcas[sortear(ctx.rng, daVirada)[0]]!.epitafio!
      : sortear(ctx.rng, modelos);

  const anos = Math.max(1, e.idade);
  return {
    nome: e.pessoa.nome,
    nomeCompleto: `${e.pessoa.nome} ${e.pessoa.sobrenome}`,
    genero: e.pessoa.genero,
    cidade: e.pessoa.cidade,
    uf: e.pessoa.uf,
    anoNascimento: e.anoNascimento,
    anoFinal: e.ano,
    idade: e.idade,
    vivo: e.vivo,
    causa: e.morte?.causa ?? null,
    atributos: {
      saude: Math.round(e.atributos.saude),
      felicidade: Math.round(e.atributos.felicidade),
      inteligencia: Math.round(e.atributos.inteligencia),
      aparencia: Math.round(e.atributos.aparencia),
    },
    patrimonio: patrimonio(e),
    felicidadeMedia: e.idade > 0 ? e.somaFelicidade / anos : e.atributos.felicidade,
    eventos: e.historico.filter((h) => h.tipo === 'evento').length,
    pontos,
    epitafio: renderizar(modelo, ctx),
  };
}
