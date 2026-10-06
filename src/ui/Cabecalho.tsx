import { ATRIBUTOS } from '../motor/constantes.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, CORES, NOMES } from './formato.ts';

interface Props {
  vida: EstadoVida;
  aoAbrirFamilia: () => void;
  aoAbrirMenu: () => void;
}

export function Cabecalho({ vida, aoAbrirFamilia, aoAbrirMenu }: Props) {
  const eu = vida.entidades['eu']!;
  const lugar = vida.entidades['lugar'];
  const n = eu.n;
  const dinheiro = n['dinheiro'] ?? 0;
  const investido = n['investido'] ?? 0;
  const divida = n['divida'] ?? 0;
  const renda = n['renda'] ?? 0;
  return (
    <header class="cabecalho">
      <div class="topo">
        <div>
          <h1>
            {eu.nome} {vida.sobrenome}
          </h1>
          <p class="sub">
            {anos(vida.idade)} · {lugar?.nome}, {lugar?.t['uf']} · {vida.ano}
          </p>
        </div>
        <div class="botoes-topo">
          <button class="icone" type="button" aria-label="Família" onClick={aoAbrirFamilia}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6" />
              <circle cx="17" cy="9.5" r="2.6" />
              <path d="M15.8 14.3c2.9-.4 5.2 1.7 5.2 5.2" />
            </svg>
          </button>
          <button class="icone" type="button" aria-label="Menu" onClick={aoAbrirMenu}>
            ⋯
          </button>
        </div>
      </div>
      <div class="atributos">
        {ATRIBUTOS.map((a) => {
          const valor = Math.round(n[a] ?? 0);
          return (
            <div class="atributo" key={a}>
              <div class="rotulo">
                <span>{NOMES[a]}</span>
                <b>{valor}</b>
              </div>
              <div
                class="barra"
                role="meter"
                aria-label={NOMES[a]}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={valor}
                style={{ '--cor': CORES[a] }}
              >
                <span style={{ width: `${valor}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div class="dinheiro">
        <span>
          Dinheiro <b>{formatarDinheiro(dinheiro)}</b>
        </span>
        {investido >= 1 && (
          <span>
            Investido <b>{formatarDinheiro(investido)}</b>
          </span>
        )}
        {divida >= 1 && (
          <span class="divida">
            Dívida <b>{formatarDinheiro(divida)}</b>
          </span>
        )}
        {renda >= 1 && (
          <span>
            Renda <b>{formatarDinheiro(renda / 12)}</b>/mês
          </span>
        )}
      </div>
    </header>
  );
}
