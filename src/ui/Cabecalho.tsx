import { conteudo } from '../conteudo.ts';
import { defFase, faseDe } from '../motor/ciclo.ts';
import { investidoDe, parteNaEmpresa, valorDosBens } from '../motor/campos.ts';
import { carreiraDe, noGenero, nomeDoCargo } from '../motor/carreira.ts';
import { cargoDe } from '../motor/poder.ts';
import { ATRIBUTOS } from '../motor/constantes.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, CORES, NOMES } from './formato.ts';

interface Props {
  vida: EstadoVida;
  aoAbrirFamilia: () => void;
  aoAbrirCarreira: () => void;
  aoAbrirDinheiro: () => void;
  aoAbrirMenu: () => void;
}

export function Cabecalho({ vida, aoAbrirFamilia, aoAbrirCarreira, aoAbrirDinheiro, aoAbrirMenu }: Props) {
  const eu = vida.entidades['eu']!;
  const lugar = vida.entidades['lugar'];
  const n = eu.n;
  const dinheiro = n['dinheiro'] ?? 0;
  const investido = investidoDe(eu);
  const empresa = parteNaEmpresa(vida);
  const divida = n['divida'] ?? 0;
  const renda = n['renda'] ?? 0;
  const fase = faseDe(vida);
  const nomeFase = fase === 'normal' ? '' : defFase(conteudo, fase).nome;
  const carreira = carreiraDe(vida, conteudo);
  const cargo = cargoDe(vida, conteudo);
  const setor =
    renda < 1
      ? undefined
      : cargo
        ? noGenero(cargo.nome, eu.genero)
        : carreira
          ? nomeDoCargo(carreira, n['nivel'] ?? 0, eu.genero)
          : conteudo.setores.get(eu.t['setor'] ?? '')?.nome;
  const bens = valorDosBens(vida);
  const influencia = Math.round(n['influencia'] ?? 0);
  const fama = Math.round(n['fama'] ?? 0);
  const titulo = cargo?.esfera === 'vitalicio' ? noGenero(cargo.nome, eu.genero) : eu.q['principe'] ? (eu.genero === 'f' ? 'princesa' : 'príncipe') : eu.q['herdeiro_regime'] ? 'herdeiro do Regime' : '';
  return (
    <header class="cabecalho">
      <div class="topo">
        <h1>
          {eu.nome} <span class="sobrenome">{vida.sobrenome}</span>
        </h1>
        <div class="botoes-topo">
          <button class="icone" type="button" aria-label="Família" onClick={aoAbrirFamilia}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6" />
              <circle cx="17" cy="9.5" r="2.6" />
              <path d="M15.8 14.3c2.9-.4 5.2 1.7 5.2 5.2" />
            </svg>
          </button>
          <button class="icone" type="button" aria-label="Carreira e poder" onClick={aoAbrirCarreira}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="7.5" width="18" height="12" rx="2" />
              <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2" />
              <path d="M3 12.5h18" />
            </svg>
          </button>
          <button class="icone" type="button" aria-label="Dinheiro e investimentos" onClick={aoAbrirDinheiro}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7z" />
              <path d="M4 7l11-3v3" />
              <circle cx="16" cy="13.5" r="1.3" />
            </svg>
          </button>
          <button class="icone" type="button" aria-label="Menu" onClick={aoAbrirMenu}>
            ⋯
          </button>
        </div>
      </div>
      <p class="sub">
        {titulo && <b class="titulo-nobre">{titulo} · </b>}
        {anos(vida.idade)} · {lugar?.nome}, {lugar?.t['uf']} · {vida.ano}
        {nomeFase && <span class={`fase ${fase}`}> · {nomeFase}</span>}
      </p>
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
      <button class="dinheiro" type="button" onClick={aoAbrirDinheiro}>
        <span>
          Dinheiro <b>{formatarDinheiro(dinheiro)}</b>
        </span>
        {divida >= 1 && (
          <span class="divida">
            Dívida <b>{formatarDinheiro(divida)}</b>
          </span>
        )}
        {investido >= 1 && (
          <span>
            Investido <b>{formatarDinheiro(investido)}</b>
          </span>
        )}
        {bens >= 1 && (
          <span>
            Bens <b>{formatarDinheiro(bens)}</b>
          </span>
        )}
        {(influencia >= 5 || fama >= 5) && (
          <span>
            Influência <b>{influencia}</b>
            {fama >= 5 ? (
              <>
                {' '}
                · Fama <b>{fama}</b>
              </>
            ) : null}
          </span>
        )}
        {empresa >= 1 && (
          <span>
            Empresa <b>{formatarDinheiro(empresa)}</b>
          </span>
        )}
        {renda >= 1 && (
          <span>
            Renda <b>{formatarDinheiro(renda / 12)}</b>/mês{setor ? ` · ${setor}` : ''}
          </span>
        )}
      </button>
    </header>
  );
}
