import { useEffect, useRef, useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { escreverSave, importarSave, type Save } from '../jogo/salvar.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { exportarSave } from './exportar.ts';
import { anos, LINK_APK, NO_APP } from './formato.ts';
import { ligarVibracao, podeVibrar, vibracaoLigada, vibrar } from './vibrar.ts';

interface Props {
  viva: boolean;
  save: Save;
  conteudo: Conteudo;
  aoFechar: () => void;
  aoNovaVida: () => void;
  /** Troca o save do aparelho pelo que veio de fora (a vida e a memória entre vidas). */
  aoImportar: (save: Save) => void;
}

/** O que o save trazido tem, para quem vai trocar saber o que está trocando. */
function descrever(s: Save): string {
  const eu = s.vida?.entidades['eu'];
  const vida = s.vida && eu ? `${eu.nome} ${s.vida.sobrenome}, ${anos(s.vida.idade)}${s.vida.vivo ? '' : ' (vida terminada)'}` : 'nenhuma vida em andamento';
  const terminadas = s.vidas === 0 ? 'nenhuma vida terminada' : s.vidas === 1 ? '1 vida terminada' : `${s.vidas} vidas terminadas`;
  return `${vida}; ${terminadas} neste save.`;
}

export function Menu({ viva, save, conteudo, aoFechar, aoNovaVida, aoImportar }: Props) {
  const [mensagem, setMensagem] = useState('');
  const [colando, setColando] = useState(false);
  const [trazido, setTrazido] = useState<Save | null>(null);
  const [vibra, setVibra] = useState(vibracaoLigada);
  const arquivo = useRef<HTMLInputElement>(null);
  const colado = useRef<HTMLTextAreaElement>(null);
  const resposta = useRef<HTMLDivElement>(null);

  // O resumo do save trazido e as mensagens ficam no fim da folha: ela rola até eles.
  useEffect(() => {
    if (trazido || mensagem) resposta.current?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [trazido, mensagem]);


  async function exportar() {
    const frase = await exportarSave(escreverSave(save));
    if (frase) setMensagem(frase);
  }

  function ler(texto: string) {
    const s = importarSave(texto, conteudo);
    setTrazido(s);
    setMensagem(s ? '' : 'Isso não é um save do Trajetória. Nada mudou.');
  }

  async function lerArquivo(e: Event) {
    const f = (e.currentTarget as HTMLInputElement).files?.[0];
    (e.currentTarget as HTMLInputElement).value = '';
    if (f) ler(await f.text());
  }

  return (
    <Folha id="titulo-menu" titulo="Menu" aoFechar={aoFechar}>
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoNovaVida}>
            Começar outra vida
          </button>
          {viva && <p class="meta">Na próxima tela você escolhe como vai ser a nova vida. Esta só acaba quando a outra nascer.</p>}
          {!NO_APP && (
            <a class="botao secundario" href={LINK_APK}>
              Baixar o app para Android
            </a>
          )}
        </div>
        {podeVibrar() && (
          <>
            <h3 class="menu-save">O aparelho</h3>
            <div class="acoes">
              <button
                class="botao secundario"
                type="button"
                role="switch"
                aria-checked={vibra}
                onClick={() => {
                  ligarVibracao(!vibra);
                  setVibra(!vibra);
                  if (!vibra) vibrar('decisao');
                }}
              >
                Vibração nas escolhas: {vibra ? 'ligada' : 'desligada'}
              </button>
            </div>
          </>
        )}
        <h3 class="menu-save">O save</h3>
        <p class="meta">Fica neste aparelho. Exporte para guardar uma cópia ou levar para outro aparelho.</p>
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={() => void exportar()}>
            Exportar o save
          </button>
          <button class="botao secundario" type="button" onClick={() => arquivo.current?.click()}>
            Importar um save
          </button>
          <input ref={arquivo} type="file" accept=".txt,.json,text/plain,application/json" hidden onChange={(e) => void lerArquivo(e)} />
          {!colando ? (
            <button class="botao secundario" type="button" onClick={() => setColando(true)}>
              Colar um save
            </button>
          ) : (
            <>
              <label class="meta" for="save-colado">
                Cole aqui o texto do save:
              </label>
              <textarea id="save-colado" class="save-colado" ref={colado} rows={3} />
              <button class="botao secundario" type="button" onClick={() => ler(colado.current?.value ?? '')}>
                Ler o save colado
              </button>
            </>
          )}
        </div>
        <div ref={resposta}>
          {trazido && (
            <div class="save-trazido" role="status">
              <p>{descrever(trazido)}</p>
              {trazido.aviso && <p class="meta">{trazido.aviso}</p>}
              <p class="meta">Trocar apaga a vida e a memória deste aparelho e põe as do save no lugar.</p>
              <div class="acoes">
                <button class="botao" type="button" onClick={() => aoImportar(trazido)}>
                  Trocar pelo save importado
                </button>
                <button class="botao secundario" type="button" onClick={() => setTrazido(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
          {mensagem && (
            <p class="aviso" role="status">
              {mensagem}
            </p>
          )}
        </div>
    </Folha>
  );
}
