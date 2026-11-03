import { useEffect, useRef, useState } from 'preact/hooks';
import { formatarDinheiro } from '../motor/texto.ts';
import type { ResumoVida } from '../motor/virada.ts';
import { baixar, compartilhar, desenharCartao, nomeDoArquivo, podeCompartilharArquivo } from './cartaoImagem.ts';
import { anos, parentesco } from './formato.ts';
import { Folha } from './Folha.tsx';

/** A vida que não foi vivida (caminho.ts), já resumida para o cartão. */
export interface VidaNaoVivida {
  idade: number;
  escolhida: string;
  outra: string;
  estrategia: string;
  ate: number;
  vivo: boolean;
  causa: string | null;
  patrimonio: number;
  felicidadeMedia: number;
  capitulos: string[];
}

interface Props {
  resumo: ResumoVida;
  endereco: string;
  aoFechar: () => void;
  aoNovaVida: () => void;
  aoContinuar: () => void;
  /** As entradas das escolhas gravadas: só elas têm caminho não tomado. */
  gravadas?: ReadonlySet<number>;
  aoImaginar?: (entrada: number) => VidaNaoVivida | { erro: string };
}

/** "Se aos 17 você tivesse escolhido…": a outra vida em duas frases, e o aviso de que é um experimento. */
function NaoVivida({ v, genero }: { v: VidaNaoVivida | { erro: string }; genero: string }) {
  if ('erro' in v) return <p class="nota">Não deu para refazer: {v.erro}.</p>;
  const fim = v.vivo ? `ainda viv${genero === 'f' ? 'a' : 'o'} aos ${v.ate}` : `até os ${v.ate} anos`;
  return (
    <div class="nao-vivida">
      <p>
        Se aos {v.idade} você tivesse escolhido <b>“{v.outra}”</b> em vez de “{v.escolhida}”: {fim}, com {formatarDinheiro(v.patrimonio)} e felicidade média{' '}
        {Math.round(v.felicidadeMedia)}
        {v.causa ? `; morreria ${v.causa}` : ''}.
      </p>
      {v.capitulos.length > 0 && <p>Teria vivido: {v.capitulos.join(' · ')}.</p>}
      <p class="meta">
        Um robô {v.estrategia === 'arriscada' ? 'arriscado' : 'cauteloso'}, com o seu jeito, seguiu dali. É um experimento dentro do modelo, não uma previsão.
      </p>
    </div>
  );
}

export function CartaoVida({ resumo, endereco, aoFechar, aoNovaVida, aoContinuar, gravadas, aoImaginar }: Props) {
  const [naoVividas, setNaoVividas] = useState<Record<number, VidaNaoVivida | { erro: string }>>({});
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

  async function aoCompartilhar() {
    if (!imagem) return;
    const r = await compartilhar(imagem.blob, resumo, endereco);
    setAviso(r === 'baixado' ? 'Imagem baixada.' : r === 'compartilhado' ? 'Cartão enviado.' : '');
  }

  return (
    <Folha id="titulo-cartao" titulo={resumo.nomeCompleto} classe="cartao-vida" aoFechar={aoFechar} tituloRef={titulo}>
        <p class="meta">
          {resumo.anoNascimento}–{resumo.anoFinal} · {anos(resumo.idade)} · {resumo.cidade}, {resumo.uf}
        </p>
        {resumo.geracao > 1 ? (
          <p class="meta">
            Geração {resumo.geracao} da família {resumo.nomeCompleto.split(' ').at(-1)}.
          </p>
        ) : (
          resumo.origem && <p class="meta">Nasceu numa {resumo.origem}.</p>
        )}
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
              {naoVividas[p.origemId] ? (
                <NaoVivida v={naoVividas[p.origemId]!} genero={resumo.genero} />
              ) : (
                p.doJogador &&
                aoImaginar &&
                gravadas?.has(p.origemId) && (
                  <button class="botao secundario e-se" type="button" onClick={() => setNaoVividas({ ...naoVividas, [p.origemId]: aoImaginar(p.origemId) })}>
                    E se tivesse escolhido outra coisa?
                  </button>
                )
              )}
            </li>
          ))}
        </ol>
        {resumo.capitulos.length > 0 && (
          <ol class="capitulos" aria-label="Capítulos da vida">
            {resumo.capitulos.map((k) => (
              <li key={k.fim}>
                <div class="titulo-capitulo">
                  {k.titulo} <span>{k.de === k.ate ? `aos ${k.de}` : `dos ${k.de} aos ${k.ate}`}</span>
                </div>
                <div class="texto-capitulo">{k.texto}</div>
              </li>
            ))}
          </ol>
        )}
        <p class="epitafio">“{resumo.epitafio}”</p>
        {(resumo.sonhos?.length ?? 0) > 0 && <p class="nota">{resumo.sonhos!.length > 1 ? 'Os sonhos' : 'O sonho'}: {resumo.sonhos!.join(' · ')}</p>}
        {resumo.conquistas.length > 0 && <p class="nota">Conquistas: {resumo.conquistas.join(' · ')}</p>}
        {resumo.antepassados.length > 0 && (
          <ol class="dinastia" aria-label="A família, de geração em geração">
            {[...resumo.antepassados].reverse().map((a) => (
              <li key={`${a.nome}-${a.anoNascimento}`}>
                <b>{a.nome}</b> ({a.anoNascimento}–{a.anoMorte}) deixou {formatarDinheiro(a.deixou)}
              </li>
            ))}
          </ol>
        )}
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
          {resumo.herdeiro && (
            <button class="botao" type="button" onClick={aoContinuar}>
              Continuar como {resumo.herdeiro.nome}, {parentesco(resumo.herdeiro)} ({anos(resumo.herdeiro.idade)})
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
    </Folha>
  );
}
