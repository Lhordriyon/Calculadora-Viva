import { useEffect } from 'preact/hooks';
import { LINK_APK, NO_APP } from './formato.ts';

interface Props {
  viva: boolean;
  aoFechar: () => void;
  aoNovaVida: () => void;
}

export function Menu({ viva, aoFechar, aoNovaVida }: Props) {
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-menu" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha">
        <h2 id="titulo-menu">{viva ? 'Começar outra vida?' : 'Menu'}</h2>
        {viva && <p class="meta">Esta vida termina aqui, sem cartão. Não dá para voltar.</p>}
        <div class="acoes">
          <button class="botao" type="button" onClick={aoFechar} autoFocus>
            {viva ? 'Continuar esta vida' : 'Voltar'}
          </button>
          <button class="botao secundario" type="button" onClick={aoNovaVida}>
            Começar outra vida
          </button>
          {!NO_APP && (
            <a class="botao secundario" href={LINK_APK}>
              Baixar o app para Android
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
