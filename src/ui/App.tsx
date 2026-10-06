import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { conteudo } from '../conteudo.ts';
import { carregar, salvar, type Save } from '../jogo/salvar.ts';
import { lembrarVida } from '../motor/memoria.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { avancarAno, escolher, nascer } from '../motor/vida.ts';
import { resumirVida } from '../motor/virada.ts';
import { Cabecalho } from './Cabecalho.tsx';
import { CartaoVida } from './CartaoVida.tsx';
import { LinhaDoTempo } from './LinhaDoTempo.tsx';
import { Marca } from './Marca.tsx';
import { Menu } from './Menu.tsx';
import { Palco } from './Palco.tsx';

function sementeNova(): number {
  try {
    return crypto.getRandomValues(new Uint32Array(1))[0]!;
  } catch {
    return Math.floor(Math.random() * 2 ** 32);
  }
}

const endereco = (() => {
  try {
    const url = new URL(import.meta.env.BASE_URL, location.href);
    return `${url.host}${url.pathname}`.replace(/\/$/, '');
  } catch {
    return 'Trajetória';
  }
})();

export function App() {
  const [save, setSave] = useState<Save>(() => carregar(conteudo));
  const [cartaoAberto, setCartaoAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const vistas = useRef(save.vida?.historico.length ?? 0);
  const novasDesde = vistas.current;
  const vida = save.vida;

  useEffect(() => {
    vistas.current = vida?.historico.length ?? 0;
  });

  // Rola até o fim quando a linha do tempo cresce: a ação está sempre embaixo, no polegar.
  const tamanho = vida?.historico.length ?? 0;
  useEffect(() => {
    if (tamanho === 0) return;
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' });
  }, [tamanho, vida?.pendente?.eventoId]);

  const resumo = useMemo(() => (vida && !vida.vivo ? resumirVida(vida, conteudo) : null), [vida]);

  function guardar(novo: Save) {
    salvar(novo);
    setSave(novo);
  }

  function novaVida() {
    const nova = nascer(conteudo, { semente: sementeNova(), ano: new Date().getFullYear() });
    vistas.current = 0;
    guardar({ ...save, vida: nova });
    setCartaoAberto(false);
    setMenuAberto(false);
    window.scrollTo({ top: 0 });
  }

  function concluir(nova: EstadoVida) {
    if (!nova.vivo && save.vida?.vivo) {
      guardar({ ...save, vida: nova, memoria: lembrarVida(save.memoria, nova), vidas: save.vidas + 1 });
      setCartaoAberto(true);
    } else {
      guardar({ ...save, vida: nova });
    }
  }

  function maisUmAno() {
    if (!vida?.vivo || vida.pendente) return;
    const nova = structuredClone(vida);
    avancarAno(nova, conteudo, save.memoria);
    concluir(nova);
  }

  function responder(indice: number) {
    if (!vida?.pendente) return;
    const nova = structuredClone(vida);
    escolher(nova, conteudo, indice);
    concluir(nova);
  }

  if (!vida) {
    return (
      <main class="abertura">
        <Marca />
        <h1>Trajetória</h1>
        <p>Uma vida inteira em poucos minutos. Cada escolha deixa marca, e algumas voltam décadas depois.</p>
        <button class="botao grande" type="button" onClick={novaVida}>
          {save.vidas > 0 ? 'Nascer de novo' : 'Nascer'}
        </button>
      </main>
    );
  }

  return (
    <>
      <Cabecalho vida={vida} aoAbrirMenu={() => setMenuAberto(true)} />
      <main class="vida">
        <LinhaDoTempo historico={vida.historico} novasDesde={novasDesde} />
      </main>
      <Palco
        vida={vida}
        aoAvancar={maisUmAno}
        aoEscolher={responder}
        aoVerCartao={() => setCartaoAberto(true)}
        aoNovaVida={novaVida}
      />
      {cartaoAberto && resumo && (
        <CartaoVida resumo={resumo} endereco={endereco} aoFechar={() => setCartaoAberto(false)} aoNovaVida={novaVida} />
      )}
      {menuAberto && <Menu viva={vida.vivo} aoFechar={() => setMenuAberto(false)} aoNovaVida={novaVida} />}
    </>
  );
}
