/**
 * O contexto do texto: resolve {variáveis} lendo o estado. Aceita caminhos
 * ({mae.ocupacao}, {ator.quem}, {lugar.nome}), nomes de personagens ({mae},
 * {ator}), valores do storylet ({preco}) e trechos escolhidos pelo estado.
 */
import { defCampo, entidadeDe, ler, patrimonioDe, separar } from './campos.ts';
import { atende } from './condicoes.ts';
import type { Storylet } from './esquema.ts';
import { formatarDinheiro, renderizar, type ContextoTexto } from './texto.ts';
import type { EstadoVida, Genero } from './tipos.ts';

export interface OpcoesContexto {
  ator?: string | undefined;
  /** Valores em reais (do storylet ou calculados na hora, como {transferido}). */
  valores?: Record<string, number> | undefined;
  /** Textos prontos ({como}, {doenca}). */
  textos?: Record<string, string> | undefined;
  /** Trechos do storylet, escolhidos pelo estado na hora de renderizar. */
  trechos?: Storylet['trechos'];
}

function formatar(ent: string, campo: string, v: number | string | boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? 'sim' : 'não';
  if (defCampo(ent, campo)?.reais) return formatarDinheiro(v);
  return String(Math.round(v));
}

export function contexto(e: EstadoVida, op: OpcoesContexto = {}): ContextoTexto {
  const eu = e.entidades['eu']!;
  const ctx: ContextoTexto = {
    rng: e.rng,
    genero: eu.genero ?? 'm',
    generoDe: (papel) => e.entidades[entidadeDe(papel, op.ator)]?.genero as Genero | undefined,
    variavel: (nome) => {
      switch (nome) {
        case 'nome':
          return eu.nome;
        case 'sobrenome':
          return e.sobrenome;
        case 'nomeCompleto':
          return `${eu.nome} ${e.sobrenome}`;
        case 'cidade':
          return e.entidades['lugar']?.nome;
        case 'uf':
          return e.entidades['lugar']?.t['uf'];
        case 'idade':
          return String(e.idade);
        case 'ano':
          return String(e.ano);
        case 'dinheiro':
          return formatarDinheiro(eu.n['dinheiro'] ?? 0);
        case 'patrimonio':
          return formatarDinheiro(patrimonioDe(eu));
        case 'salario':
          return formatarDinheiro((eu.n['renda'] ?? 0) / 12);
        case 'divida':
          return formatarDinheiro(eu.n['divida'] ?? 0);
      }
      const valor = op.valores?.[nome];
      if (valor !== undefined) return formatarDinheiro(valor);
      const texto = op.textos?.[nome];
      if (texto !== undefined) return texto;
      const opcoes = op.trechos?.[nome];
      if (opcoes) {
        const escolhido = opcoes.find((t) => atende(t.se, e, op.ator)) ?? opcoes[opcoes.length - 1]!;
        return renderizar(escolhido.texto, ctx);
      }
      if (nome.includes('.')) {
        const { ent, campo } = separar(nome);
        const id = entidadeDe(ent, op.ator);
        return formatar(id, campo, ler(e, id, campo));
      }
      return e.entidades[entidadeDe(nome, op.ator)]?.nome;
    },
  };
  return ctx;
}
