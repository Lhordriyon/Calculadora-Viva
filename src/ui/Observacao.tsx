/**
 * O seu jeito de jogar (etapa 03, I-199): o que a observação deste aparelho diz de quem joga, no menu. Os perfis desta
 * vida até agora (pelo livro) e o que as vidas observadas guardaram; ligar e desligar, exportar (por vontade de quem
 * joga) e apagar. Nada sai do aparelho sozinho.
 */
import { useMemo, useState } from 'preact/hooks';
import type { Conteudo } from '../motor/conteudo.ts';
import { observarPeloLivro } from '../motor/observacao.ts';
import { NOMES_DOS_PERFIS, perfisDaVida, perfisFortes } from '../motor/perfis.ts';
import { saturacaoDaVida } from '../motor/saturacao.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { apagarObservacao, ligarObservacao, lerObservacao, textoParaExportar } from '../jogo/observacao.ts';
import { exportarTexto } from './exportar.ts';

interface Props {
  vida: EstadoVida | null;
  conteudo: Conteudo;
  aoMensagem: (texto: string) => void;
}

const pct = (x: number): string => `${Math.round(x * 100)}%`;

export function JeitoDeJogar({ vida, conteudo, aoMensagem }: Props) {
  const [obs, setObs] = useState(lerObservacao);
  const [apagando, setApagando] = useState(false);
  const agora = useMemo(() => {
    if (!obs.ligada || !vida || vida.historico.length === 0) return null;
    try {
      const v = observarPeloLivro(vida, conteudo, { fonte: 'jogador', partida: obs.partida ?? 'agora' });
      return perfisFortes(perfisDaVida(v).vida, 0.5).slice(0, 3);
    } catch {
      return null;
    }
  }, [vida, conteudo, obs.ligada, obs.partida]);
  const ultima = obs.vidas.at(-1);
  const saturacao = useMemo(() => (ultima ? saturacaoDaVida(ultima) : null), [ultima]);
  const observadas = obs.vidas.length + obs.resumos.length;

  async function exportar() {
    const frase = await exportarTexto(textoParaExportar(conteudo, vida), {
      prefixo: 'trajetoria-observacao',
      titulo: 'Trajetória: o jeito de jogar',
      oQue: 'Observação',
      volta: 'Ela não tem nomes nem textos da vida, só números e decisões.',
    });
    if (frase) aoMensagem(frase);
  }

  return (
    <>
      <h3 class="menu-save">O seu jeito de jogar</h3>
      <p class="meta">
        O jogo observa o que você decide para entender como você joga. Fica só neste aparelho, sem nomes; nada é enviado.
        Exportar é escolha sua.
      </p>
      {obs.ligada && agora && agora.length > 0 && (
        <p class="meta">
          Nesta vida, até agora: {agora.map((p) => `${NOMES_DOS_PERFIS[p.perfil]} (${pct(p.p)})`).join(', ')}. {agora[0]!.porque[0] ? `Porque ${agora[0]!.porque[0]}.` : ''}
        </p>
      )}
      {obs.ligada && saturacao && (
        <p class="meta">
          {saturacao.esgotadoDesde !== null
            ? `Na última vida observada, o mundo ficou pequeno para você a partir de ${saturacao.esgotadoDesde}.`
            : saturacao.maxima >= 0.5
              ? 'Na última vida observada, o mundo chegou a ficar pequeno para você, mas voltou a oferecer coisas do seu tamanho.'
              : 'Na última vida observada, o mundo ainda tinha desafios do seu tamanho.'}
        </p>
      )}
      {obs.ligada && observadas > 0 && <p class="meta">{observadas === 1 ? '1 vida observada' : `${observadas} vidas observadas`} neste aparelho.</p>}
      <div class="acoes">
        <button
          class="botao secundario"
          type="button"
          role="switch"
          aria-checked={obs.ligada}
          onClick={() => {
            ligarObservacao(!obs.ligada);
            setObs(lerObservacao());
          }}
        >
          Observar o meu jeito de jogar: {obs.ligada ? 'ligado' : 'desligado'}
        </button>
        <button class="botao secundario" type="button" onClick={() => void exportar()}>
          Exportar a observação
        </button>
        {!apagando ? (
          <button class="botao secundario" type="button" onClick={() => setApagando(true)}>
            Apagar a observação
          </button>
        ) : (
          <button
            class="botao secundario"
            type="button"
            onClick={() => {
              apagarObservacao();
              setObs(lerObservacao());
              setApagando(false);
              aoMensagem('A observação deste aparelho foi apagada. O save e as vidas não mudaram.');
            }}
          >
            Apagar mesmo (o save fica)
          </button>
        )}
      </div>
    </>
  );
}
