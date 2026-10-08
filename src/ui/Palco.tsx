import { useEffect, useRef, useState } from 'preact/hooks';
import { fichasUsadas, NOMES_VERBO, type AcaoDisponivel } from '../motor/acoes.ts';
import type { Parentesco } from '../motor/herdeiro.ts';
import { fichasDoAno } from '../motor/regras.ts';
import type { Verbo } from '../motor/constantes.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, parentesco } from './formato.ts';

/** Tempo em que as opções ignoram toques logo depois de aparecer (evita escolher sem querer num toque duplo). */
const CARENCIA_MS = 450;

interface Props {
  vida: EstadoVida;
  acoes: AcaoDisponivel[];
  aoAvancar: () => void;
  /** Gasta uma ficha: no verbo, numa ação escolhida (id e ator) ou, sem escolha, na do botão. */
  aoAgir: (verbo: Verbo, escolha?: { id: string; ator?: string | undefined }) => void;
  aoEscolher: (indice: number) => void;
  aoVerCartao: () => void;
  aoNovaVida: () => void;
  /** Quem pode continuar a história depois da morte (filho ou filha viva; sem filho, sobrinho ou sobrinha). */
  herdeiro: { nome: string; idade: number; genero: 'f' | 'm'; parentesco: Parentesco } | null;
  aoContinuar: () => void;
}

export function Palco({ vida, acoes, aoAvancar, aoAgir, aoEscolher, aoVerCartao, aoNovaVida, herdeiro, aoContinuar }: Props) {
  const p = vida.pendente;
  const apareceuEm = useRef(0);
  const chave = p ? `${vida.idade}:${p.instancia}` : '';
  useEffect(() => {
    apareceuEm.current = performance.now();
  }, [chave]);
  // O verbo aberto (a lista das ações dele); fecha quando o ano ou a ficha mudam.
  const [aberto, setAberto] = useState<Verbo | null>(null);
  const momento = `${vida.idade}:${vida.historico.length}`;
  useEffect(() => setAberto(null), [momento]);

  if (p) {
    return (
      <div class="palco com-evento">
        <section class="cartao-evento" key={chave} aria-live="polite" aria-labelledby="texto-evento">
          <p class="quando">
            {anos(vida.idade)} · {vida.ano}
          </p>
          <p class="texto" id="texto-evento">
            {p.texto}
          </p>
          <div class="opcoes">
            {p.opcoes.map((o, i) => (
              <button
                class="opcao"
                type="button"
                key={`${chave}:${i}`}
                disabled={!o.disponivel}
                onClick={() => {
                  if (performance.now() - apareceuEm.current < CARENCIA_MS) return;
                  aoEscolher(i);
                }}
              >
                {o.texto}
                {o.motivo && <small>{o.motivo}</small>}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const lista = aberto ? acoes.find((a) => a.verbo === aberto) : undefined;
  const restantes = fichasDoAno(vida.idade) - fichasUsadas(vida);
  if (vida.vivo && lista) {
    return (
      <div class="palco">
        <section class="ficha" aria-labelledby="titulo-ficha">
          <p class="quando" id="titulo-ficha">
            {NOMES_VERBO[lista.verbo]}: o que, exatamente?
          </p>
          <div class="opcoes-acao">
            {lista.opcoes.map((o) => (
              <button
                class="verbo"
                type="button"
                key={`${o.s.id}#${o.ator ?? ''}`}
                onClick={() => {
                  setAberto(null);
                  aoAgir(lista.verbo, { id: o.s.id, ator: o.ator });
                }}
              >
                <b>
                  {o.rotulo}
                  {o.novo && <span class="novo">novo</span>}
                </b>
              </button>
            ))}
          </div>
        </section>
        <button class="botao secundario" type="button" onClick={() => setAberto(null)}>
          Voltar
        </button>
      </div>
    );
  }

  if (vida.vivo) {
    return (
      <div class="palco">
        {acoes.length > 0 && (
          <section class="ficha" aria-labelledby="titulo-ficha">
            <p class="quando" id="titulo-ficha">
              {fichasUsadas(vida) > 0
                ? `Ainda dá para ${restantes === 1 ? 'mais uma' : `mais ${restantes}`}:`
                : restantes === 1
                  ? `Aos ${vida.idade}, o que fazer este ano?`
                  : `Aos ${vida.idade}, ${restantes} coisas este ano:`}
            </p>
            {/* O verbo é um botão curto; tocar abre a lista das ações dele (o ponto marca o que é novo). */}
            <div class="verbos">
              {acoes.map((a) => (
                <button class="verbo" type="button" key={a.verbo} onClick={() => setAberto(a.verbo)}>
                  <b>{NOMES_VERBO[a.verbo]}</b>
                  {a.opcoes.some((o) => o.novo) && (
                    <span class="ponto-novo">
                      <span class="so-leitor">, tem novidade</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
        <button class={`botao grande${acoes.length > 0 ? ' secundario' : ''}`} type="button" onClick={aoAvancar}>
          +1 ano <small>{acoes.length > 0 ? 'só viver' : `fazer ${vida.idade + 1}`}</small>
        </button>
      </div>
    );
  }

  return (
    <div class="palco">
      <div class="acoes">
        {herdeiro && (
          <button class="botao" type="button" onClick={aoContinuar}>
            Continuar como {herdeiro.nome}, {parentesco(herdeiro)} <small>{anos(herdeiro.idade)}</small>
          </button>
        )}
        <button class={`botao${herdeiro ? ' secundario' : ''}`} type="button" onClick={aoVerCartao}>
          Ver o cartão da vida
        </button>
        <button class="botao secundario" type="button" onClick={aoNovaVida}>
          Nova vida
        </button>
      </div>
    </div>
  );
}
