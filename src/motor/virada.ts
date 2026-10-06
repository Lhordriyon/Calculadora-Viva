/**
 * Pontos de virada: cada evento guarda quais entradas anteriores o tornaram
 * possível (marcas consultadas, agendamentos). Isso forma um grafo de causas.
 * A escolha com mais eventos descendentes é a que mais mudou a vida.
 */
import { patrimonio } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import type { Atributo } from './esquema.ts';
import { criarRng, misturar, sortear } from './rng.ts';
import { renderizar } from './texto.ts';
import type { Entrada, EstadoVida, Genero } from './tipos.ts';
import { contexto } from './vida.ts';

export interface PontoDeVirada {
  origemId: number;
  idade: number;
  /** O que você fez ("trocou o ENEM por um bico"). */
  escolha: string;
  consequenciaIdade: number;
  /** A consequência mais distante ("abriu uma hamburgueria com Bruno"). */
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

export function pontosDeVirada(e: EstadoVida, limite = 3): PontoDeVirada[] {
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const desc = descendentes(e.historico);
  const candidatos: { origem: Entrada; ultima: Entrada; total: number }[] = [];
  for (const en of e.historico) {
    if (en.tipo !== 'evento' || !en.escolha) continue;
    const ids = desc.get(en.id);
    if (!ids || ids.size === 0) continue;
    let ultima: Entrada | undefined;
    for (const id of ids) {
      const d = porId.get(id);
      if (d && (!ultima || d.idade > ultima.idade || (d.idade === ultima.idade && d.id > ultima.id))) ultima = d;
    }
    if (ultima) candidatos.push({ origem: en, ultima, total: ids.size });
  }
  candidatos.sort(
    (a, b) =>
      b.total - a.total ||
      b.ultima.idade - b.origem.idade - (a.ultima.idade - a.origem.idade) ||
      a.origem.idade - b.origem.idade,
  );

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
      consequencia: c.ultima.resumo ?? c.ultima.texto,
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

  // Epitáfio: a marca de um ponto de virada fala mais alto; depois qualquer marca; depois o genérico.
  const origens = new Set(pontos.map((p) => p.origemId));
  const comEpitafio = Object.entries(e.marcas).filter(([m]) => c.marcas[m]?.epitafio);
  const daVirada = comEpitafio.filter(([, reg]) => reg.origem !== null && origens.has(reg.origem));
  const fonte = daVirada.length > 0 ? daVirada : comEpitafio;
  const modelo =
    fonte.length > 0 ? c.marcas[sortear(ctx.rng, fonte)[0]]!.epitafio! : sortear(ctx.rng, c.mundo.epitafios);

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
