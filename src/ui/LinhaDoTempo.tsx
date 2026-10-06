import type { Entrada } from '../motor/tipos.ts';
import { useMemo } from 'preact/hooks';
import { avisosDeInflacao, chipsDe } from './formato.ts';

function Item({ h, nova, inflacao }: { h: Entrada; nova: boolean; inflacao: boolean }) {
  const chips = chipsDe(h, inflacao);
  return (
    <li class={`ano ${h.tipo}`}>
      <span class="idade" aria-label={`${h.idade} anos`}>
        {h.idade}
      </span>
      <div class={`entrada ${h.tipo}${nova ? ' nova' : ''}`}>
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

export function LinhaDoTempo({ historico, novasDesde }: { historico: Entrada[]; novasDesde: number }) {
  const inflacao = useMemo(() => avisosDeInflacao(historico), [historico]);
  return (
    <ol class="linha-do-tempo" aria-label="Linha do tempo da vida">
      {historico.map((h, i) => (
        <Item h={h} nova={i >= novasDesde} inflacao={inflacao.has(h.id)} key={h.id} />
      ))}
    </ol>
  );
}
