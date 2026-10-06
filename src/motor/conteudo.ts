/**
 * O conteúdo indexado para o motor. Quem lê e valida os arquivos é o chamador:
 * no Node, `leitura.ts` (com Zod); no navegador, o bundle confia no que o CI
 * já validou e só indexa.
 */
import { VERBOS, type Verbo } from './constantes.ts';
import type { CausaMorte, InfoMarca, Linha, Mundo, Storylet, Traco, TracoJogador } from './esquema.ts';
import { IDADE_MAXIMA } from './regras.ts';

export interface Problema {
  nivel: 'erro' | 'aviso';
  onde: string;
  mensagem: string;
}

/** O conteúdo já no formato do esquema (validado). */
export interface DadosConteudo {
  storylets: { arquivo: string; lista: Storylet[] }[];
  linhas: Linha[];
  mortes: CausaMorte[];
  marcas: Record<string, InfoMarca>;
  mundo: Mundo;
}

export interface Conteudo {
  storylets: Storylet[];
  /** Arquivo de origem de cada storylet (para mensagens do validador). */
  arquivoDe: Map<string, string>;
  porId: Map<string, Storylet>;
  /** Eventos que o diretor pode sortear em cada idade (índice = idade). */
  eventosPorIdade: Storylet[][];
  /** Ações de cada verbo da ficha. */
  acoes: Map<Verbo, Storylet[]>;
  /** Storylets que cada papel pode protagonizar por conta própria. */
  npcPorPapel: Map<string, Storylet[]>;
  linhas: Linha[];
  /** Índices das linhas possíveis em cada idade. */
  linhasPorIdade: number[][];
  mortes: CausaMorte[];
  marcas: Record<string, InfoMarca>;
  mundo: Mundo;
  tracos: Map<string, Traco>;
  tracosJogador: Map<string, TracoJogador>;
}

export function tipoDe(s: Storylet): 'evento' | 'acao' | 'npc' {
  return s.tipo ?? 'evento';
}

/** Monta os índices. Ids repetidos viram problema (o primeiro fica). */
export function indexarConteudo(dados: DadosConteudo, problemas: Problema[] = []): Conteudo {
  const storylets: Storylet[] = [];
  const arquivoDe = new Map<string, string>();
  const porId = new Map<string, Storylet>();
  for (const { arquivo, lista } of dados.storylets) {
    for (const s of lista) {
      const anterior = arquivoDe.get(s.id);
      if (anterior !== undefined) {
        problemas.push({ nivel: 'erro', onde: `${arquivo} › ${s.id}`, mensagem: `id repetido (já existe em ${anterior})` });
        continue;
      }
      arquivoDe.set(s.id, arquivo);
      porId.set(s.id, s);
      storylets.push(s);
    }
  }

  const eventosPorIdade: Storylet[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) eventosPorIdade.push([]);
  const acoes = new Map<Verbo, Storylet[]>(VERBOS.map((v) => [v, []]));
  const npcPorPapel = new Map<string, Storylet[]>();
  for (const s of storylets) {
    const tipo = tipoDe(s);
    if (tipo === 'acao') {
      acoes.get(s.verbo!)!.push(s);
      continue;
    }
    if (tipo === 'npc') {
      if (s.apenasAgendado) continue;
      for (const papel of s.ator ?? []) {
        const l = npcPorPapel.get(papel) ?? [];
        l.push(s);
        npcPorPapel.set(papel, l);
      }
      continue;
    }
    if (s.apenasAgendado || !s.idade) continue;
    const [min, max] = s.idade;
    for (let idade = min; idade <= Math.min(max, IDADE_MAXIMA); idade++) eventosPorIdade[idade]!.push(s);
  }

  const linhasPorIdade: number[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) linhasPorIdade.push([]);
  dados.linhas.forEach((l, i) => {
    for (let idade = l.idade[0]; idade <= Math.min(l.idade[1], IDADE_MAXIMA); idade++) linhasPorIdade[idade]!.push(i);
  });

  return {
    storylets,
    arquivoDe,
    porId,
    eventosPorIdade,
    acoes,
    npcPorPapel,
    linhas: dados.linhas,
    linhasPorIdade,
    mortes: dados.mortes,
    marcas: dados.marcas,
    mundo: dados.mundo,
    tracos: new Map(dados.mundo.tracos.map((t) => [t.id, t])),
    tracosJogador: new Map(dados.mundo.tracosJogador.map((t) => [t.id, t])),
  };
}
