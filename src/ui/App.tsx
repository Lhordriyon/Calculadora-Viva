import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { conteudo } from '../conteudo.ts';
import { avisarSeNaoGravar, carregar, confirmarAbertura, escreverSave, gravarJa, salvarDepois, type Save } from '../jogo/salvar.ts';
import { copiarVida } from '../motor/livro.ts';
import type { Verbo } from '../motor/constantes.ts';
import { operar, type Operacao } from '../motor/carteira.ts';
import { lembrarVida } from '../motor/memoria.ts';
import type { EscolhaOrigem } from '../motor/origem.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { jaAgiu } from '../motor/acoes.ts';
import { acoesDisponiveis, agir, avancarAno, escolher, nascer } from '../motor/vida.ts';
import { continuarComoHerdeiro } from '../motor/herdeiro.ts';
import { resumirVida } from '../motor/virada.ts';
import { caminhoNaoTomado, escolhasGravadas, novaGravacao, type Comando } from '../motor/caminho.ts';
import { Abertura } from './Abertura.tsx';
import { Cabecalho } from './Cabecalho.tsx';
import { Carreira } from './Carreira.tsx';
import { Dinheiro } from './Dinheiro.tsx';
import { CartaoVida, type VidaNaoVivida } from './CartaoVida.tsx';
import { Familia } from './Familia.tsx';
import { Folha } from './Folha.tsx';
import { Pais } from './Pais.tsx';
import { Projetos } from './Projetos.tsx';
import { LinhaDoTempo } from './LinhaDoTempo.tsx';
import { Menu } from './Menu.tsx';
import { Palco } from './Palco.tsx';
import { ehMarco, naLinhaDoTempo, NO_APP } from './formato.ts';
import { exportarSave } from './exportar.ts';
import { vibrar } from './vibrar.ts';
import { useVoltar } from './voltar.ts';

/** Rola a linha do tempo até a entrada `id` (o começo da história do ano), ou até o fim se ela couber. */
function rolar(linha: HTMLElement, id: number | null, suave: boolean): void {
  const fim = linha.scrollHeight - linha.clientHeight;
  let alvo = fim;
  const el = id === null ? null : linha.querySelector<HTMLElement>(`[data-id="${id}"]`);
  if (el) alvo = Math.min(fim, Math.max(0, el.getBoundingClientRect().top - linha.getBoundingClientRect().top + linha.scrollTop - 12));
  linha.scrollTo({ top: alvo, behavior: suave ? 'smooth' : 'auto' });
}

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

type Folha = 'cartao' | 'menu' | 'familia' | 'dinheiro' | 'carreira' | 'pais' | 'planos' | null;

export function App() {
  const [save, setSave] = useState<Save>(() => carregar(conteudo));
  const [folha, setFolha] = useState<Folha>(null);
  /** "Nova vida" (no menu, no palco, no cartão) abre a escolha da origem em vez de sortear. */
  const [escolhendoVida, setEscolhendoVida] = useState(false);
  /** O que deu errado e quem joga precisa saber: o motor que tropeçou num toque, ou o save que o aparelho não gravou. */
  const [tropeco, setTropeco] = useState<{ tipo: 'motor' | 'save'; erro?: string; mensagem?: string } | null>(null);
  /** O cartão abriu sozinho porque a vida acabou agora (a despedida: a frase da morte chega antes do resto). */
  const [despedida, setDespedida] = useState(false);
  const vistas = useRef(save.vida?.historico.length ?? 0);
  const novasDesde = vistas.current;
  const vida = save.vida;

  useEffect(() => {
    vistas.current = vida?.historico.length ?? 0;
  });

  // A linha do tempo rola por dentro, entre o cabeçalho e o palco. Quando cresce, ela mostra o começo da
  // primeira entrada nova (a história do ano), e não o fim (o balanço); se o que é novo cabe, desce até o fim.
  // Quando o palco muda de altura (evento, lista de ações), ela volta para o mesmo ponto.
  const [linha, setLinha] = useState<HTMLElement | null>(null);
  const tamanho = vida?.historico.length ?? 0;
  const ancora = useRef<number | null>(null);
  const contados = useRef(tamanho);
  useEffect(() => {
    if (!linha || !vida) return;
    const desde = Math.min(contados.current, tamanho);
    contados.current = tamanho;
    ancora.current = vida.historico.slice(desde).find(naLinhaDoTempo)?.id ?? null;
    rolar(linha, ancora.current, !matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [linha, tamanho, vida?.pendente?.instancia]);
  useEffect(() => {
    if (!linha || typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(() => rolar(linha, ancora.current, false));
    observador.observe(linha);
    return () => observador.disconnect();
  }, [linha]);

  // O voltar do celular fecha a folha aberta (e só ela).
  useVoltar(folha !== null, () => setFolha(null));

  const resumo = useMemo(() => (vida && !vida.vivo ? resumirVida(vida, conteudo) : null), [vida]);
  // As escolhas que ficaram gravadas (o caminho não tomado só troca o que a gravação desta vida tem).
  const gravacao = save.gravacao;
  const gravadas = useMemo(() => new Set(gravacao && vida && !vida.vivo ? escolhasGravadas(gravacao) : []), [gravacao, vida]);
  /** A vida que não foi vivida, trocando a escolha da entrada (refeita do começo, num experimento do modelo). */
  function imaginar(entrada: number): VidaNaoVivida | { erro: string } {
    if (!gravacao) return { erro: 'esta vida começou antes de o jogo guardar os passos' };
    const r = caminhoNaoTomado(conteudo, gravacao, entrada);
    if ('erro' in r) return r;
    const outro = resumirVida(r.vida, conteudo);
    return {
      idade: r.idade,
      escolhida: r.escolhida,
      outra: r.outra,
      estrategia: r.estrategia,
      ate: outro.idade,
      vivo: outro.vivo,
      causa: outro.causa,
      patrimonio: outro.patrimonio,
      felicidadeMedia: outro.felicidadeMedia,
      capitulos: outro.capitulos.slice(0, 2).map((k) => k.titulo),
    };
  }
  const acoes = useMemo(() => (vida?.vivo && !vida.pendente ? acoesDisponiveis(vida, conteudo, save.memoria) : []), [vida, save.memoria]);

  // O save grava depois que a tela responde (o toque não espera ~250 KB de JSON); sair do app ou trocar de aba grava já.
  useEffect(() => {
    const aoEsconder = () => document.visibilityState === 'hidden' && gravarJa();
    document.addEventListener('visibilitychange', aoEsconder);
    window.addEventListener('pagehide', gravarJa);
    return () => {
      document.removeEventListener('visibilitychange', aoEsconder);
      window.removeEventListener('pagehide', gravarJa);
    };
  }, []);

  // A tela desenhou com o save que foi lido: só agora ele vira a cópia de segurança (salvar.ts › confirmarAbertura).
  useEffect(() => confirmarAbertura(), []);

  // O save que não grava (armazenamento cheio ou bloqueado) avisa uma vez por sessão: o jogo continua, mas a vida pode
  // se perder ao fechar, e exportar é a saída.
  const avisouDoSave = useRef(false);
  useEffect(() => {
    avisarSeNaoGravar(() => {
      if (avisouDoSave.current) return;
      avisouDoSave.current = true;
      setTropeco({ tipo: 'save' });
    });
    return () => avisarSeNaoGravar(null);
  }, []);

  function guardar(novo: Save) {
    salvarDepois(novo);
    setSave(novo);
  }

  /**
   * O motor mexe numa cópia da vida: se ele lançar um erro no meio, a vida da tela continua inteira. Antes, o toque
   * não fazia nada e o erro se repetia calado a cada toque; agora quem joga fica sabendo e tem como sair.
   */
  function tentar(passo: () => void): void {
    try {
      passo();
    } catch (erro) {
      setTropeco({ tipo: 'motor', erro: erro instanceof Error ? erro.message : String(erro) });
    }
  }

  function novaVida(origem?: EscolhaOrigem) {
    setEscolhendoVida(false);
    const nova = nascer(conteudo, { semente: sementeNova(), ano: new Date().getFullYear(), ...(origem ? { origem } : {}) });
    vistas.current = 0;
    guardar({ versao: save.versao, vida: nova, memoria: save.memoria, vidas: save.vidas, gravacao: novaGravacao(nova, save.memoria) });
    setFolha(null);
  }

  /** O save que veio de fora (o menu confirma antes): a vida e a memória dele passam a ser as deste aparelho. */
  function importar(novo: Save) {
    vistas.current = novo.vida?.historico.length ?? 0;
    setEscolhendoVida(false);
    setFolha(null);
    guardar(novo);
  }

  function entendiAviso() {
    setSave({ versao: save.versao, vida: save.vida, memoria: save.memoria, vidas: save.vidas });
  }

  function pedirNovaVida() {
    setFolha(null);
    setEscolhendoVida(true);
  }

  /** A história segue com quem herda, no mesmo mundo, com o que sobrou da herança. */
  function continuar() {
    if (!vida || vida.vivo) return;
    tentar(() => {
      const nova = continuarComoHerdeiro(vida, conteudo);
      vistas.current = 0;
      guardar({ ...save, vida: nova, gravacao: novaGravacao(nova, save.memoria) });
      setFolha(null);
    });
  }

  /** Guarda a vida e o comando que a levou até ali (a gravação do caminho não tomado; caminho.ts). */
  function concluir(nova: EstadoVida, comando: Comando) {
    const gravacao = save.gravacao ? { ...save.gravacao, comandos: [...save.gravacao.comandos, comando] } : undefined;
    const comGravacao = gravacao ? { gravacao } : {};
    if (!nova.vivo && save.vida?.vivo) {
      guardar({ ...save, vida: nova, memoria: lembrarVida(save.memoria, nova), vidas: save.vidas + 1, ...comGravacao });
      setDespedida(true);
      setFolha('cartao');
      vibrar('morte');
    } else {
      guardar({ ...save, vida: nova, ...comGravacao });
      // O momento se sente: o marco e o sonho realizado que o toque trouxe; senão, o aceno curto de quem decidiu.
      const novas = nova.historico.slice(save.vida?.historico.length ?? 0);
      if (novas.some((h) => ehMarco(h, conteudo))) vibrar('marco');
      else if (comando.t === 'escolher' || comando.t === 'agir') vibrar('decisao');
    }
  }

  function maisUmAno() {
    if (!vida?.vivo || vida.pendente) return;
    tentar(() => {
      const nova = copiarVida(vida);
      avancarAno(nova, conteudo, save.memoria);
      concluir(nova, { t: 'ano' });
    });
  }

  /** Gasta uma ficha do ano na ação escolhida; quando as fichas acabam, o ano passa. */
  function agirNoAno(verbo: Verbo, escolha?: { id: string; ator?: string | undefined }) {
    if (!vida?.vivo || vida.pendente) return;
    tentar(() => {
      const nova = copiarVida(vida);
      agir(nova, conteudo, verbo, escolha);
      if (nova.vivo && !nova.pendente && jaAgiu(nova)) avancarAno(nova, conteudo, save.memoria);
      concluir(nova, { t: 'agir', verbo, ...(escolha ? { escolha } : {}) });
    });
  }

  /** Mexer no dinheiro, comprar, tentar vaga e se candidatar não gastam a ficha do ano nem passam o tempo. */
  function operarDinheiro(op: Operacao) {
    if (!vida?.vivo) return;
    const nova = copiarVida(vida);
    try {
      operar(nova, conteudo, op);
    } catch {
      return;
    }
    // A jogada conta uma história: a folha fecha para ela aparecer na linha do tempo (e uma ida à Lua pode acabar a vida).
    if (op.tipo === 'jogada') setFolha(null);
    concluir(nova, { t: 'operar', op });
  }

  function responder(indice: number) {
    if (!vida?.pendente) return;
    tentar(() => {
      const nova = copiarVida(vida);
      // A entrada que a escolha vai fazer: o ponto em que o caminho não tomado troca a opção.
      const entrada = nova.proximoId;
      escolher(nova, conteudo, indice);
      concluir(nova, { t: 'escolher', i: indice, entrada });
    });
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
        aoAbrirPais={() => setFolha('pais')}
        aoAbrirMenu={() => setFolha('menu')}
        compacto={Boolean(vida.pendente)}
      />
      <main class={`vida${vida.pendente ? ' com-evento' : ''}`} ref={setLinha}>
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
        aoAbrirPlanos={() => setFolha('planos')}
        herdeiro={resumo?.herdeiro ?? null}
        aoContinuar={continuar}
      />
      {folha === 'cartao' && resumo && (
        <CartaoVida
          resumo={resumo}
          endereco={endereco}
          aoFechar={() => {
            setFolha(null);
            setDespedida(false);
          }}
          aoNovaVida={pedirNovaVida}
          aoContinuar={continuar}
          gravadas={gravadas}
          aoImaginar={imaginar}
          despedida={despedida}
        />
      )}
      {folha === 'familia' && (
        <Familia
          vida={vida}
          conteudo={conteudo}
          aoOperar={operarDinheiro}
          aoAgir={(verbo, escolha) => {
            setFolha(null);
            agirNoAno(verbo, escolha);
          }}
          aoFechar={() => setFolha(null)}
        />
      )}
      {folha === 'dinheiro' && <Dinheiro vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'carreira' && <Carreira vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'pais' && <Pais vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'planos' && <Projetos vida={vida} conteudo={conteudo} aoOperar={operarDinheiro} aoFechar={() => setFolha(null)} />}
      {folha === 'menu' && <Menu viva={vida.vivo} save={save} conteudo={conteudo} aoFechar={() => setFolha(null)} aoNovaVida={pedirNovaVida} aoImportar={importar} />}
      {tropeco && (
        <Folha id="titulo-tropeco" titulo={tropeco.tipo === 'motor' ? 'O jogo tropeçou' : 'O save não gravou'} aoFechar={() => setTropeco(null)}>
          {tropeco.tipo === 'motor' ? (
            <p class="meta">Algo deu errado ao viver este momento. A sua vida ficou como estava, nada se perdeu. Tente de novo; se o erro voltar, exporte o save (ele mostra o problema a quem cuida do jogo) e comece outra vida pelo menu.</p>
          ) : (
            <p class="meta">O aparelho não deixou guardar a vida (armazenamento cheio ou bloqueado). O jogo continua, mas o que você viver agora pode se perder ao fechar. Exporte o save para não depender do aparelho.</p>
          )}
          <div class="acoes">
            <button class="botao" type="button" autoFocus onClick={() => setTropeco(null)}>
              {tropeco.tipo === 'motor' ? 'Tentar de novo' : 'Continuar jogando'}
            </button>
            <button
              class="botao secundario"
              type="button"
              onClick={() =>
                void exportarSave(escreverSave(save)).then((frase) => {
                  if (frase) setTropeco({ ...tropeco, mensagem: frase });
                })
              }
            >
              Exportar o save
            </button>
          </div>
          {tropeco.mensagem && (
            <p class="aviso" role="status">
              {tropeco.mensagem}
            </p>
          )}
          {tropeco.erro && <p class="meta tropeco-erro">O erro: {tropeco.erro}</p>}
        </Folha>
      )}
      {save.aviso && folha === null && !tropeco && (
        <Folha id="titulo-aviso" titulo="Aviso" aoFechar={entendiAviso}>
          <p class="meta">{save.aviso}</p>
          <div class="acoes">
            <button class="botao" type="button" autoFocus onClick={entendiAviso}>
              Entendi
            </button>
          </div>
        </Folha>
      )}
    </>
  );
}
