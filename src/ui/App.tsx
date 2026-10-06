import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { conteudo } from '../conteudo.ts';
import { carregar, salvar, type Save } from '../jogo/salvar.ts';
import type { Verbo } from '../motor/constantes.ts';
import { lembrarVida } from '../motor/memoria.ts';
import type { EscolhaOrigem } from '../motor/origem.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { acoesDisponiveis, agir, avancarAno, escolher, nascer } from '../motor/vida.ts';
import { resumirVida } from '../motor/virada.ts';
import { Abertura } from './Abertura.tsx';
import { Cabecalho } from './Cabecalho.tsx';
import { CartaoVida } from './CartaoVida.tsx';
import { Familia } from './Familia.tsx';
import { LinhaDoTempo } from './LinhaDoTempo.tsx';
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

type Folha = 'cartao' | 'menu' | 'familia' | null;

export function App() {
  const [save, setSave] = useState<Save>(() => carregar(conteudo));
  const [folha, setFolha] = useState<Folha>(null);
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
  }, [tamanho, vida?.pendente?.instancia]);

  const resumo = useMemo(() => (vida && !vida.vivo ? resumirVida(vida, conteudo) : null), [vida]);
  const acoes = useMemo(() => (vida?.vivo && !vida.pendente ? acoesDisponiveis(vida, conteudo, save.memoria) : []), [vida, save.memoria]);

  function guardar(novo: Save) {
    salvar(novo);
    setSave(novo);
  }

  function novaVida(origem?: EscolhaOrigem) {
    const nova = nascer(conteudo, { semente: sementeNova(), ano: new Date().getFullYear(), ...(origem ? { origem } : {}) });
    vistas.current = 0;
    guardar({ versao: save.versao, vida: nova, memoria: save.memoria, vidas: save.vidas });
    setFolha(null);
    window.scrollTo({ top: 0 });
  }

  function concluir(nova: EstadoVida) {
    if (!nova.vivo && save.vida?.vivo) {
      guardar({ ...save, vida: nova, memoria: lembrarVida(save.memoria, nova), vidas: save.vidas + 1 });
      setFolha('cartao');
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

  /** Um toque: gasta a ficha do ano no verbo e o ano passa. */
  function agirNoAno(verbo: Verbo) {
    if (!vida?.vivo || vida.pendente) return;
    const nova = structuredClone(vida);
    agir(nova, conteudo, verbo);
    if (nova.vivo && !nova.pendente) avancarAno(nova, conteudo, save.memoria);
    concluir(nova);
  }

  function responder(indice: number) {
    if (!vida?.pendente) return;
    const nova = structuredClone(vida);
    escolher(nova, conteudo, indice);
    concluir(nova);
  }

  if (!vida) return <Abertura conteudo={conteudo} vidas={save.vidas} aviso={save.aviso} aoNascer={novaVida} />;

  return (
    <>
      <Cabecalho vida={vida} aoAbrirFamilia={() => setFolha('familia')} aoAbrirMenu={() => setFolha('menu')} />
      <main class="vida">
        <LinhaDoTempo vida={vida} novasDesde={novasDesde} />
      </main>
      <Palco
        vida={vida}
        acoes={acoes}
        aoAvancar={maisUmAno}
        aoAgir={agirNoAno}
        aoEscolher={responder}
        aoVerCartao={() => setFolha('cartao')}
        aoNovaVida={() => novaVida()}
      />
      {folha === 'cartao' && resumo && (
        <CartaoVida resumo={resumo} endereco={endereco} aoFechar={() => setFolha(null)} aoNovaVida={() => novaVida()} />
      )}
      {folha === 'familia' && <Familia vida={vida} conteudo={conteudo} aoFechar={() => setFolha(null)} />}
      {folha === 'menu' && <Menu viva={vida.vivo} aoFechar={() => setFolha(null)} aoNovaVida={() => novaVida()} />}
    </>
  );
}
