import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { conteudo } from '../conteudo.ts';
import { carregar, salvar, type Save } from '../jogo/salvar.ts';
import type { Verbo } from '../motor/constantes.ts';
import { operar, type Operacao } from '../motor/carteira.ts';
import { lembrarVida } from '../motor/memoria.ts';
import type { EscolhaOrigem } from '../motor/origem.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { jaAgiu } from '../motor/acoes.ts';
import { acoesDisponiveis, agir, avancarAno, escolher, nascer } from '../motor/vida.ts';
import { continuarComoHerdeiro } from '../motor/herdeiro.ts';
import { resumirVida } from '../motor/virada.ts';
import { Abertura } from './Abertura.tsx';
import { Cabecalho } from './Cabecalho.tsx';
import { Carreira } from './Carreira.tsx';
import { Dinheiro } from './Dinheiro.tsx';
import { CartaoVida } from './CartaoVida.tsx';
import { Familia } from './Familia.tsx';
import { LinhaDoTempo } from './LinhaDoTempo.tsx';
import { Menu } from './Menu.tsx';
import { Palco } from './Palco.tsx';
import { NO_APP } from './formato.ts';

function sementeNova(): number {
  try {
    return crypto.getRandomValues(new Uint32Array(1))[0]!;
  } catch {
    return Math.floor(Math.random() * 2 ** 32);
  }
}

const endereco = (() => {
  // No app Android o endereço é local: o cartão mostra onde jogar no navegador.
  if (NO_APP) return 'lhordriyon.github.io/Calculadora-Viva';
  try {
    const url = new URL(import.meta.env.BASE_URL, location.href);
    return `${url.host}${url.pathname}`.replace(/\/$/, '');
  } catch {
    return 'Trajetória';
  }
})();

type Folha = 'cartao' | 'menu' | 'familia' | 'dinheiro' | 'carreira' | null;

export function App() {
  const [save, setSave] = useState<Save>(() => carregar(conteudo));
  const [folha, setFolha] = useState<Folha>(null);
  /** "Nova vida" (no menu, no palco, no cartão) abre a escolha da origem em vez de sortear. */
  const [escolhendoVida, setEscolhendoVida] = useState(false);
  const vistas = useRef(save.vida?.historico.length ?? 0);
  const novasDesde = vistas.current;
  const vida = save.vida;

  useEffect(() => {
    vistas.current = vida?.historico.length ?? 0;
  });

  // A linha do tempo rola por dentro, entre o cabeçalho e o palco. Ela desce até o fim quando
  // cresce e quando o palco muda de altura (evento, lista de ações): o ano novo fica à vista.
  const [linha, setLinha] = useState<HTMLElement | null>(null);
  const tamanho = vida?.historico.length ?? 0;
  useEffect(() => {
    if (!linha || tamanho === 0) return;
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    linha.scrollTo({ top: linha.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' });
  }, [linha, tamanho, vida?.pendente?.instancia]);
  useEffect(() => {
    if (!linha || typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(() => {
      linha.scrollTop = linha.scrollHeight;
    });
    observador.observe(linha);
    return () => observador.disconnect();
  }, [linha]);

  const resumo = useMemo(() => (vida && !vida.vivo ? resumirVida(vida, conteudo) : null), [vida]);
  const acoes = useMemo(() => (vida?.vivo && !vida.pendente ? acoesDisponiveis(vida, conteudo, save.memoria) : []), [vida, save.memoria]);

  function guardar(novo: Save) {
    salvar(novo);
    setSave(novo);
  }

  function novaVida(origem?: EscolhaOrigem) {
    setEscolhendoVida(false);
    const nova = nascer(conteudo, { semente: sementeNova(), ano: new Date().getFullYear(), ...(origem ? { origem } : {}) });
    vistas.current = 0;
    guardar({ versao: save.versao, vida: nova, memoria: save.memoria, vidas: save.vidas });
    setFolha(null);
  }

  function pedirNovaVida() {
    setFolha(null);
    setEscolhendoVida(true);
  }

  /** A história segue com quem herda, no mesmo mundo, com o que sobrou da herança. */
  function continuar() {
    if (!vida || vida.vivo) return;
    let nova: EstadoVida;
    try {
      nova = continuarComoHerdeiro(vida, conteudo);
    } catch {
      return;
    }
    vistas.current = 0;
    guardar({ ...save, vida: nova });
    setFolha(null);
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

  /** Gasta uma ficha do ano na ação escolhida; quando as fichas acabam, o ano passa. */
  function agirNoAno(verbo: Verbo, escolha?: { id: string; ator?: string | undefined }) {
    if (!vida?.vivo || vida.pendente) return;
    const nova = structuredClone(vida);
    agir(nova, conteudo, verbo, escolha);
    if (nova.vivo && !nova.pendente && jaAgiu(nova)) avancarAno(nova, conteudo, save.memoria);
    concluir(nova);
  }

  /** Mexer no dinheiro, comprar, tentar vaga e se candidatar não gastam a ficha do ano nem passam o tempo. */
  function operarDinheiro(op: Operacao) {
    if (!vida?.vivo) return;
    const nova = structuredClone(vida);
    try {
      operar(nova, conteudo, op);
    } catch {
      return;
    }
    guardar({ ...save, vida: nova });
  }

  function responder(indice: number) {
    if (!vida?.pendente) return;
    const nova = structuredClone(vida);
    escolher(nova, conteudo, indice);
    concluir(nova);
  }

  if (!vida || escolhendoVida) {
    return (
      <Abertura
        conteudo={conteudo}
        vidas={save.vidas}
        aviso={save.aviso}
        aoNascer={novaVida}
        escolherDeInicio={escolhendoVida}
        {...(vida && escolhendoVida ? { aoVoltar: () => setEscolhendoVida(false) } : {})}
      />
    );
  }

  return (
    <>
      <Cabecalho
        vida={vida}
        aoAbrirFamilia={() => setFolha('familia')}
        aoAbrirCarreira={() => setFolha('carreira')}
        aoAbrirDinheiro={() => setFolha('dinheiro')}
        aoAbrirMenu={() => setFolha('menu')}
      />
      <main class="vida" ref={setLinha}>
        <LinhaDoTempo vida={vida} novasDesde={novasDesde} />
      </main>
      <Palco
        vida={vida}
        acoes={acoes}
        aoAvancar={maisUmAno}
        aoAgir={agirNoAno}
        aoEscolher={responder}
        aoVerCartao={() => setFolha('cartao')}
        aoNovaVida={pedirNovaVida}
        herdeiro={resumo?.herdeiro ?? null}
        aoContinuar={continuar}
      />
      {folha === 'cartao' && resumo && (
        <CartaoVida resumo={resumo} endereco={endereco} aoFechar={() => setFolha(null)} aoNovaVida={pedirNovaVida} aoContinuar={continuar} />
      )}
      {folha === 'familia' && <Familia vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'dinheiro' && <Dinheiro vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'carreira' && <Carreira vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'menu' && <Menu viva={vida.vivo} aoFechar={() => setFolha(null)} aoNovaVida={pedirNovaVida} />}
    </>
  );
}
