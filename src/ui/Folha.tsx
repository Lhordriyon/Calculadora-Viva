import type { ComponentChildren, Ref } from 'preact';
import { useEffect } from 'preact/hooks';
import { Icone } from './Icones.tsx';

interface Props {
  /** O id do título (o diálogo é rotulado por ele). */
  id: string;
  titulo: ComponentChildren;
  /** Classes a mais na folha (as regras de cada uma: .familia, .dinheiro-folha…). */
  classe?: string;
  aoFechar: () => void;
  /** Para quem quer o foco no título ao abrir (o cartão da vida). */
  tituloRef?: Ref<HTMLHeadingElement>;
  children: ComponentChildren;
}

/**
 * A folha que sobe de baixo: o título e o Fechar ficam fora da parte que rola, à mão a qualquer altura da
 * leitura (a mesma regra das faixas da tela: nada fica grudado, cada parte rola por dentro).
 */
export function Folha({ id, titulo, classe = '', aoFechar, tituloRef, children }: Props) {
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);
  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby={id} onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class={`folha ${classe}`.trim()}>
        <div class="folha-topo">
          {tituloRef ? (
            <h2 id={id} tabIndex={-1} ref={tituloRef}>
              {titulo}
            </h2>
          ) : (
            <h2 id={id}>{titulo}</h2>
          )}
          <button class="icone fechar" type="button" aria-label="Fechar" onClick={aoFechar}>
            <Icone nome="fechar" />
          </button>
        </div>
        <div class="folha-corpo">{children}</div>
      </div>
    </div>
  );
}
