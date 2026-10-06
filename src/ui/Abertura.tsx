import { useState } from 'preact/hooks';
import type { TipoFamilia } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { EscolhaOrigem } from '../motor/origem.ts';
import { Marca } from './Marca.tsx';

interface Props {
  conteudo: Conteudo;
  vidas: number;
  aviso: string | undefined;
  aoNascer: (origem?: EscolhaOrigem) => void;
}

/** Um toque para nascer; escolher a origem é opcional e fica recolhido. */
export function Abertura({ conteudo, vidas, aviso, aoNascer }: Props) {
  const [escolhendo, setEscolhendo] = useState(false);
  const [classe, setClasse] = useState<number | undefined>(undefined);
  const [familia, setFamilia] = useState<TipoFamilia | undefined>(undefined);
  const { classes, familias } = conteudo.mundo;

  return (
    <main class="abertura">
      <Marca />
      <h1>Trajetória</h1>
      <p>Uma vida inteira em poucos minutos. Você pode tentar quase tudo; o mundo vai reagir.</p>
      {aviso && (
        <p class="aviso-save" role="status">
          {aviso}
        </p>
      )}
      {escolhendo && (
        <section class="origem" aria-label="Escolher a origem">
          <fieldset>
            <legend>Onde nascer</legend>
            <div class="escolhas-origem">
              <button type="button" class="chip-origem" aria-pressed={classe === undefined} onClick={() => setClasse(undefined)}>
                Sortear
              </button>
              {classes.map((k, i) => (
                <button type="button" class="chip-origem" key={k.id} aria-pressed={classe === i} onClick={() => setClasse(i)}>
                  {k.nome.replace(/^família /, '')}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Que família</legend>
            <div class="escolhas-origem">
              <button type="button" class="chip-origem" aria-pressed={familia === undefined} onClick={() => setFamilia(undefined)}>
                Sortear
              </button>
              {familias.map((f) => (
                <button type="button" class="chip-origem" key={f.id} aria-pressed={familia === f.id} onClick={() => setFamilia(f.id)}>
                  {f.nome.replace(/^família /, '')}
                </button>
              ))}
            </div>
          </fieldset>
        </section>
      )}
      <button
        class="botao grande"
        type="button"
        onClick={() => aoNascer(escolhendo ? { ...(classe !== undefined ? { classe } : {}), ...(familia ? { familia } : {}) } : undefined)}
      >
        {escolhendo ? 'Nascer assim' : vidas > 0 ? 'Nascer de novo' : 'Nascer'}
      </button>
      {!escolhendo && (
        <button class="botao secundario" type="button" onClick={() => setEscolhendo(true)}>
          Escolher a origem
        </button>
      )}
    </main>
  );
}
