import { useEffect, useRef, useState } from 'preact/hooks';
import { formatarDinheiro } from '../motor/texto.ts';
import type { ResumoVida } from '../motor/virada.ts';
import { baixar, compartilhar, desenharCartao, nomeDoArquivo, podeCompartilharArquivo } from './cartaoImagem.ts';
import { anos } from './formato.ts';

interface Props {
  resumo: ResumoVida;
  endereco: string;
  aoFechar: () => void;
  aoNovaVida: () => void;
}

export function CartaoVida({ resumo, endereco, aoFechar, aoNovaVida }: Props) {
  const [imagem, setImagem] = useState<{ blob: Blob; url: string } | null>(null);
  const [aviso, setAviso] = useState('');
  const titulo = useRef<HTMLHeadingElement>(null);
  const compartilha = podeCompartilharArquivo();

  useEffect(() => {
    titulo.current?.focus();
    let url = '';
    let vivo = true;
    desenharCartao(resumo, endereco)
      .then((blob) => {
        if (!vivo) return;
        url = URL.createObjectURL(blob);
        setImagem({ blob, url });
      })
      .catch(() => setAviso('Não deu para gerar a imagem neste navegador.'));
    return () => {
      vivo = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [resumo, endereco]);

  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  async function aoCompartilhar() {
    if (!imagem) return;
    const r = await compartilhar(imagem.blob, resumo, endereco);
    setAviso(r === 'baixado' ? 'Imagem baixada.' : r === 'compartilhado' ? 'Cartão enviado.' : '');
  }

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-cartao" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha cartao-vida">
        <h2 id="titulo-cartao" tabIndex={-1} ref={titulo}>
          {resumo.nomeCompleto}
        </h2>
        <p class="meta">
          {resumo.anoNascimento}–{resumo.anoFinal} · {anos(resumo.idade)} · {resumo.cidade}, {resumo.uf}
        </p>
        {resumo.origem && <p class="meta">Nasceu numa {resumo.origem}.</p>}
        {resumo.causa && <p class="causa">Morreu {resumo.causa}.</p>}
        <div class="numeros">
          <div>
            Felicidade média<b>{Math.round(resumo.felicidadeMedia)}</b>
          </div>
          <div>
            Patrimônio<b>{formatarDinheiro(resumo.patrimonio)}</b>
          </div>
          <div>
            Escolhas<b>{resumo.eventos}</b>
          </div>
        </div>
        <ol class="viradas" aria-label="Pontos de virada">
          {resumo.pontos.length === 0 && <li>Uma vida curta demais para pontos de virada. Mas foi uma vida.</li>}
          {resumo.pontos.map((p) => (
            <li key={p.origemId}>
              <div class="de">
                Aos {p.idade}, {p.causa}
              </div>
              <div class="para">
                → aos {p.consequenciaIdade}, {p.consequencia}
              </div>
            </li>
          ))}
        </ol>
        <p class="epitafio">“{resumo.epitafio}”</p>
        {imagem && <img class="previa" src={imagem.url} alt="O cartão da vida em imagem, pronto para compartilhar" />}
        <div class="acoes">
          <button class="botao" type="button" disabled={!imagem} onClick={aoCompartilhar}>
            {compartilha ? 'Compartilhar o cartão' : 'Baixar o cartão'}
          </button>
          {compartilha && imagem && (
            <button class="botao secundario" type="button" onClick={() => baixar(imagem.blob, nomeDoArquivo(resumo))}>
              Baixar imagem
            </button>
          )}
          <button class="botao secundario" type="button" onClick={aoNovaVida}>
            Nova vida
          </button>
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar à linha do tempo
          </button>
        </div>
        <p class="aviso" role="status">
          {aviso}
        </p>
      </div>
    </div>
  );
}
