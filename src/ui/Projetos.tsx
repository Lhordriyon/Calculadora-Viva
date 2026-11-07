import { useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { NOMES_VERBO } from '../motor/acoes.ts';
import type { Operacao } from '../motor/carteira.ts';
import { VERBOS, type Verbo } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { contexto } from '../motor/contexto.ts';
import { deQuemEraOSonho, etapasDe, nomeDoProjeto, projetosAtivos, projetosPossiveis } from '../motor/projetos.ts';
import { MAX_PROJETOS, MAX_SONHOS } from '../motor/regras.ts';
import { renderizar } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { criarRng } from '../motor/rng.ts';
import { anos } from './formato.ts';

const FOLHAS: Record<string, string> = { 'folha:dinheiro': 'a folha Dinheiro', 'folha:familia': 'a folha Família', 'folha:carreira': 'a folha Carreira', 'folha:pais': 'a folha País' };

/** O que ajuda numa etapa, em palavras: o verbo ("Poupar"), a ação ("faculdade à noite") ou a folha. */
function oQueAjuda(vida: EstadoVida, c: Conteudo, ajuda: readonly string[]): string {
  const nomes = ajuda.flatMap((a): string[] => {
    if ((VERBOS as readonly string[]).includes(a)) return [`“${NOMES_VERBO[a as Verbo]}”`];
    if (FOLHAS[a]) return [FOLHAS[a]!];
    const s = c.porId.get(a);
    const ator = s?.ator?.find((p) => vida.entidades[p]);
    if (!s?.rotulo || (s.ator && !ator)) return [];
    // O rótulo não gasta o sorteio da vida (como na lista do verbo).
    return [`“${renderizar(s.rotulo, { ...contexto(vida, { ator }), rng: criarRng(0) })}”`];
  });
  return nomes.join(', ');
}

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  aoFechar: () => void;
}

/**
 * Os planos de quem joga (projetos.ts): os que estão de pé, com cada etapa feita ou por fazer e o que ajuda nela, e os
 * que dá para começar agora. Começar e desistir não gastam as escolhas do ano; o caminho até lá, sim.
 */
export function Projetos({ vida, conteudo, aoOperar, aoFechar }: Props) {
  const ativos = projetosAtivos(vida, conteudo);
  const possiveis = projetosPossiveis(vida, conteudo);
  // Desistir pede um segundo toque: o plano de anos não some por um toque sem querer.
  const [desistindo, setDesistindo] = useState<string | null>(null);
  const ctx = { ...contexto(vida), rng: criarRng(0) };
  return (
    <Folha id="titulo-projetos" titulo="Planos" classe="projetos" aoFechar={aoFechar}>
      <p class="meta">
        O que você quer da vida, até {MAX_PROJETOS} planos e {MAX_SONHOS} sonhos (✦) ao mesmo tempo. Começar não gasta as escolhas do ano; o caminho até lá, sim.
      </p>
      {ativos.length > 0 && (
        <fieldset class="grupo">
          <legend>De pé</legend>
          {ativos.map((p) => {
            const { nome } = nomeDoProjeto(vida, p.def, p.com);
            const etapas = etapasDe(vida, p);
            const falta = p.def.prazo - (vida.ano - p.desde);
            return (
              <div class="projeto" key={p.def.id}>
                <p>
                  <b>{p.def.sonho ? '✦ ' : ''}{nome}</b> · {etapas.filter((x) => x.feita).length} de {etapas.length} etapas · {falta > 1 ? `faltam ${anos(falta)}` : 'último ano'}
                </p>
                {p.def.sonho && (
                  <p class="meta">
                    {deQuemEraOSonho(vida, p.def.id) ? `O sonho de ${deQuemEraOSonho(vida, p.def.id)}, que agora é seu.` : 'O sonho da sua vida.'} {renderizar(p.def.descricao, ctx)}
                  </p>
                )}
                <ul class="etapas">
                  {etapas.map((x, i) => (
                    <li key={i} class={x.feita ? 'feita' : ''}>
                      {x.feita ? '✓ ' : '○ '}
                      {x.texto}
                      {!x.feita && x.ajuda.length > 0 && oQueAjuda(vida, conteudo, x.ajuda) && <small> · ajuda: {oQueAjuda(vida, conteudo, x.ajuda)}</small>}
                    </li>
                  ))}
                </ul>
                <div class="escolhas-origem">
                  {desistindo === p.def.id ? (
                    <>
                      <button type="button" class="chip-origem" onClick={() => aoOperar({ tipo: 'desistir_projeto', id: p.def.id })}>
                        Desistir mesmo
                      </button>
                      <button type="button" class="chip-origem" onClick={() => setDesistindo(null)}>
                        Continuar
                      </button>
                    </>
                  ) : (
                    <button type="button" class="chip-origem" onClick={() => setDesistindo(p.def.id)}>
                      Desistir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </fieldset>
      )}
      {possiveis.length > 0 && (
        <fieldset class="grupo">
          <legend>Começar um plano</legend>
          {possiveis.map((p) => {
            const { nome } = nomeDoProjeto(vida, p.def, p.com);
            const op: Operacao = { tipo: 'comecar_projeto', id: p.def.id, ...(p.com ? { com: p.com } : {}) };
            return (
              <button class="opcao" type="button" key={`${p.def.id}#${p.com ?? ''}`} onClick={() => aoOperar(op)}>
                {p.def.sonho ? '✦ ' : ''}{nome}
                <small>
                  {renderizar(p.def.descricao, ctx)} {anos(p.def.prazo)} para chegar lá.
                </small>
              </button>
            );
          })}
        </fieldset>
      )}
      {ativos.length === 0 && possiveis.length === 0 && <p class="nota">Nenhum plano faz sentido agora. A vida muda, e eles aparecem.</p>}
      <div class="acoes">
        <button class="botao secundario" type="button" onClick={aoFechar}>
          Voltar
        </button>
      </div>
    </Folha>
  );
}
