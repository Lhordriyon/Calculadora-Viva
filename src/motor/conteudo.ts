/**
 * O conteúdo indexado para o motor. Quem lê e valida os arquivos é o chamador:
 * no Node, `leitura.ts` (com Zod); no navegador, o bundle confia no que o CI
 * já validou e só indexa.
 */
import type { CausaMorte, Evento, InfoMarca, Linha, Mundo } from './esquema.ts';
import { IDADE_MAXIMA } from './regras.ts';

export interface Problema {
  nivel: 'erro' | 'aviso';
  onde: string;
  mensagem: string;
}

/** O conteúdo já no formato do esquema (validado). */
export interface DadosConteudo {
  eventos: { arquivo: string; lista: Evento[] }[];
  linhas: Linha[];
  mortes: CausaMorte[];
  marcas: Record<string, InfoMarca>;
  mundo: Mundo;
}

export interface Conteudo {
  eventos: Evento[];
  /** Arquivo de origem de cada evento (para mensagens do validador). */
  arquivoDe: Map<string, string>;
  porId: Map<string, Evento>;
  /** Eventos sorteáveis em cada idade (índice = idade). */
  sorteaveisPorIdade: Evento[][];
  linhas: Linha[];
  /** Índices das linhas possíveis em cada idade. */
  linhasPorIdade: number[][];
  mortes: CausaMorte[];
  marcas: Record<string, InfoMarca>;
  mundo: Mundo;
}

/** Monta os índices. Ids repetidos viram problema (o primeiro fica). */
export function indexarConteudo(dados: DadosConteudo, problemas: Problema[] = []): Conteudo {
  const eventos: Evento[] = [];
  const arquivoDe = new Map<string, string>();
  const porId = new Map<string, Evento>();
  for (const { arquivo, lista } of dados.eventos) {
    for (const ev of lista) {
      const anterior = arquivoDe.get(ev.id);
      if (anterior !== undefined) {
        problemas.push({ nivel: 'erro', onde: `${arquivo} › ${ev.id}`, mensagem: `id repetido (já existe em ${anterior})` });
        continue;
      }
      arquivoDe.set(ev.id, arquivo);
      porId.set(ev.id, ev);
      eventos.push(ev);
    }
  }

  const sorteaveisPorIdade: Evento[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) sorteaveisPorIdade.push([]);
  for (const ev of eventos) {
    if (ev.apenasAgendado || !ev.idade) continue;
    const [min, max] = ev.idade;
    for (let idade = min; idade <= Math.min(max, IDADE_MAXIMA); idade++) sorteaveisPorIdade[idade]!.push(ev);
  }

  const linhasPorIdade: number[][] = [];
  for (let idade = 0; idade <= IDADE_MAXIMA; idade++) linhasPorIdade.push([]);
  dados.linhas.forEach((l, i) => {
    for (let idade = l.idade[0]; idade <= Math.min(l.idade[1], IDADE_MAXIMA); idade++) linhasPorIdade[idade]!.push(i);
  });

  return {
    eventos,
    arquivoDe,
    porId,
    sorteaveisPorIdade,
    linhas: dados.linhas,
    linhasPorIdade,
    mortes: dados.mortes,
    marcas: dados.marcas,
    mundo: dados.mundo,
  };
}
