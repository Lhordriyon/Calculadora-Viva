import { useEffect } from 'preact/hooks';

/** Quantas camadas (folhas, a lista de um verbo) estão abertas, cada uma com uma entrada no histórico. */
let profundidade = 0;

/**
 * O voltar do celular fecha a camada de cima: abrir uma folha ou a lista de um verbo põe uma entrada no
 * histórico, e o voltar (o botão do Android, o gesto, o do navegador) a tira. Fechar pela tela tira a entrada
 * também, para o voltar seguinte não cair no nada. Só a camada de cima fecha a cada voltar.
 */
export function useVoltar(aberto: boolean, fechar: () => void): void {
  useEffect(() => {
    if (!aberto) return;
    const minha = ++profundidade;
    history.pushState({ camada: minha }, '');
    let pelaTecla = false;
    const aoVoltar = (ev: PopStateEvent) => {
      const atual = (ev.state as { camada?: number } | null)?.camada ?? 0;
      if (atual < minha && !pelaTecla) {
        pelaTecla = true;
        fechar();
      }
    };
    addEventListener('popstate', aoVoltar);
    return () => {
      removeEventListener('popstate', aoVoltar);
      profundidade = minha - 1;
      if (!pelaTecla && (history.state as { camada?: number } | null)?.camada === minha) history.back();
    };
  }, [aberto]);
}
