import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { fichasUsadas, NOMES_VERBO, type AcaoDisponivel } from '../motor/acoes.ts';
import type { Parentesco } from '../motor/herdeiro.ts';
import { fichasDoAno } from '../motor/regras.ts';
import type { Verbo } from '../motor/constantes.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, parentesco } from './formato.ts';
import { COR_DO_VERBO, Icone, ICONE_DO_VERBO } from './Icones.tsx';
import { useVoltar } from './voltar.ts';

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
  // A carência: logo depois que um evento aparece ou fecha, ou que a lista de um verbo abre ou fecha, os toques
  // são ignorados (o segundo toque de um toque duplo não pode escolher nem passar o ano por você). Um ano novo
  // sem evento não tem carência, para quem avança rápido.
  const mudouEm = useRef(-Infinity);
  const cedo = () => performance.now() - mudouEm.current < CARENCIA_MS;
  const chave = p ? `${vida.idade}:${p.instancia}` : '';
  const primeira = useRef(true);
  // O verbo aberto (a lista das ações dele); fecha quando o ano ou a ficha mudam.
  const [aberto, setAberto] = useState<Verbo | null>(null);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    mudouEm.current = performance.now();
  }, [chave, aberto]);
  const momento = `${vida.idade}:${vida.historico.length}`;
  useEffect(() => setAberto(null), [momento]);
  // O voltar do celular fecha a lista do verbo.
  useVoltar(aberto !== null, () => setAberto(null));
  // As opções do evento nunca saem da tela: primeiro a história cede até três linhas, depois o texto do evento
  // rola (até duas); se ainda faltar, a história cede o resto (só neste evento).
  const cartao = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const c = cartao.current;
    const linha = c?.closest('#app')?.querySelector<HTMLElement>('main.vida');
    if (!c || !linha) return;
    const ceder = () => {
      const falta = c.scrollHeight - c.clientHeight;
      if (falta > 1) linha.style.setProperty('--min-vida', `${Math.max(0, linha.clientHeight - falta)}px`);
    };
    ceder();
    const olho = new ResizeObserver(ceder);
    olho.observe(c);
    return () => {
      olho.disconnect();
      linha.style.removeProperty('--min-vida');
    };
  }, [chave]);

  if (p) {
    return (
      <div class="palco com-evento">
        <section class="cartao-evento" key={chave} ref={cartao} aria-live="polite" aria-labelledby="texto-evento">
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
                  if (cedo()) return;
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
                  if (cedo()) return;
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
            <p class="quando titulo-escolhas" id="titulo-ficha">
              <b>Suas escolhas</b> ·{' '}
              {fichasUsadas(vida) > 0 ? 'mais ' : ''}
              {restantes === 1 ? 'uma' : restantes} este ano
            </p>
            {/* O verbo é um botão curto; tocar abre a lista das ações dele (o ponto marca o que é novo).
                O ícone só aparece quando cabe sem cortar o nome. */}
            <div class="verbos">
              {acoes.map((a) => (
                <button
                  class="verbo"
                  type="button"
                  key={a.verbo}
                  style={{ '--cor': COR_DO_VERBO[a.verbo] }}
                  onClick={() => {
                    if (cedo()) return;
                    setAberto(a.verbo);
                  }}
                >
                  <Icone nome={ICONE_DO_VERBO[a.verbo]} tamanho={20} classe="ico" />
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
        {/* Com escolhas sobrando, viver o ano é a opção secundária; sem nenhuma (o bebê), é a principal. */}
        <button
          class={`botao grande viver${acoes.length > 0 ? ' secundario' : ''}`}
          type="button"
          onClick={() => {
            if (cedo()) return;
            aoAvancar();
          }}
          aria-label={acoes.length > 0 ? `Viver mais 1 ano, sem as ${restantes === 1 ? 'uma escolha que sobra' : `${restantes} escolhas que sobram`}` : `Viver mais 1 ano: fazer ${vida.idade + 1}`}
        >
          <span class="rotulo-viver">
            Viver mais 1 ano
            {acoes.length > 0 && <small class="sobram"> · sobram {restantes}</small>}
          </span>
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
