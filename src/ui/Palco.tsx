import { useEffect, useRef } from 'preact/hooks';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos } from './formato.ts';

/** Tempo em que as opções ignoram toques logo depois de aparecer (evita escolher sem querer num toque duplo). */
const CARENCIA_MS = 450;

interface Props {
  vida: EstadoVida;
  aoAvancar: () => void;
  aoEscolher: (indice: number) => void;
  aoVerCartao: () => void;
  aoNovaVida: () => void;
}

export function Palco({ vida, aoAvancar, aoEscolher, aoVerCartao, aoNovaVida }: Props) {
  const p = vida.pendente;
  const apareceuEm = useRef(0);
  const chave = p ? `${vida.idade}:${p.eventoId}` : '';
  useEffect(() => {
    apareceuEm.current = performance.now();
  }, [chave]);

  if (p) {
    return (
      <div class="palco">
        <section class="cartao-evento" aria-live="polite" aria-labelledby="texto-evento">
          <p class="quando">
            {anos(vida.idade)} · {vida.ano}
          </p>
          <p class="texto" id="texto-evento">
            {p.texto}
          </p>
          <div class="opcoes">
            {p.opcoes.map((o, i) => (
              <button
                class="opcao"
                type="button"
                key={`${chave}:${i}`}
                disabled={!o.disponivel}
                onClick={() => {
                  if (performance.now() - apareceuEm.current < CARENCIA_MS) return;
                  aoEscolher(i);
                }}
              >
                {o.texto}
                {o.motivo && <small>{o.motivo}</small>}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (vida.vivo) {
    return (
      <div class="palco">
        <button class="botao grande" type="button" onClick={aoAvancar}>
          +1 ano <small>fazer {vida.idade + 1}</small>
        </button>
      </div>
    );
  }

  return (
    <div class="palco">
      <div class="acoes">
        <button class="botao" type="button" onClick={aoVerCartao}>
          Ver o cartão da vida
        </button>
        <button class="botao secundario" type="button" onClick={aoNovaVida}>
          Nova vida
        </button>
      </div>
    </div>
  );
}
