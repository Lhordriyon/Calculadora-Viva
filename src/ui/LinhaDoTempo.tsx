import { useMemo } from 'preact/hooks';
import { NOMES_VERBO } from '../motor/acoes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { Entrada, EstadoVida } from '../motor/tipos.ts';
import { conteudo } from '../conteudo.ts';
import { avisosDeInflacao, chipsDe } from './formato.ts';

/** O verbo de uma ação ("Estudar"), para a etiqueta da entrada. */
function verboDe(h: Entrada, c: Conteudo): string | undefined {
  if (h.tipo !== 'acao' || !h.ref) return undefined;
  const s = c.porId.get(h.ref);
  return s?.verbo ? NOMES_VERBO[s.verbo] : undefined;
}

function Item({ h, nova, inflacao, nomeDe }: { h: Entrada; nova: boolean; inflacao: boolean; nomeDe: (papel: string) => string | undefined }) {
  const chips = chipsDe(h, nomeDe, inflacao);
  const verbo = verboDe(h, conteudo);
  return (
    <li class={`ano ${h.tipo}`}>
      <span class="idade" aria-label={`${h.idade} anos`}>
        {h.idade}
      </span>
      <div class={`entrada ${h.tipo}${nova ? ' nova' : ''}`}>
        {verbo && <span class="etiqueta">{verbo}</span>}
        <p>{h.texto}</p>
        {h.escolha && <p class="escolhida">→ {h.escolha.texto}</p>}
        {h.resultado && <p class="resultado">{h.resultado}</p>}
        {chips.length > 0 && (
          <ul class="chips">
            {chips.map((c) => (
              <li
                class={`chip${c.ruim ? ' ruim' : ''}${c.neutro ? ' neutro' : ''}`}
                style={c.cor && !c.ruim ? { '--cor': c.cor } : undefined}
                key={c.texto}
              >
                {c.texto}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function LinhaDoTempo({ vida, novasDesde }: { vida: EstadoVida; novasDesde: number }) {
  const historico = vida.historico;
  const inflacao = useMemo(() => avisosDeInflacao(historico), [historico]);
  const nomeDe = (papel: string) => vida.entidades[papel]?.nome;
  return (
    <ol class="linha-do-tempo" aria-label="Linha do tempo da vida">
      {historico.map((h, i) =>
        h.tipo === 'regra' ? null : <Item h={h} nova={i >= novasDesde} inflacao={inflacao.has(h.id)} nomeDe={nomeDe} key={h.id} />,
      )}
    </ol>
  );
}
