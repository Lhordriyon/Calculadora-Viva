import { ATRIBUTOS } from '../motor/esquema.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, CORES, NOMES } from './formato.ts';

export function Cabecalho({ vida, aoAbrirMenu }: { vida: EstadoVida; aoAbrirMenu: () => void }) {
  const f = vida.financas;
  return (
    <header class="cabecalho">
      <div class="topo">
        <div>
          <h1>
            {vida.pessoa.nome} {vida.pessoa.sobrenome}
          </h1>
          <p class="sub">
            {anos(vida.idade)} · {vida.pessoa.cidade}, {vida.pessoa.uf} · {vida.ano}
          </p>
        </div>
        <button class="icone" type="button" aria-label="Menu" onClick={aoAbrirMenu}>
          ⋯
        </button>
      </div>
      <div class="atributos">
        {ATRIBUTOS.map((a) => {
          const valor = Math.round(vida.atributos[a]);
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
          Dinheiro <b>{formatarDinheiro(f.dinheiro)}</b>
        </span>
        {f.investido >= 1 && (
          <span>
            Investido <b>{formatarDinheiro(f.investido)}</b>
          </span>
        )}
        {f.divida >= 1 && (
          <span class="divida">
            Dívida <b>{formatarDinheiro(f.divida)}</b>
          </span>
        )}
        {f.renda >= 1 && (
          <span>
            Renda <b>{formatarDinheiro(f.renda / 12)}</b>/mês
          </span>
        )}
      </div>
    </header>
  );
}
