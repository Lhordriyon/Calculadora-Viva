import { conteudo } from '../conteudo.ts';
import { defFase, faseDe } from '../motor/pais.ts';
import { patrimonioTotal } from '../motor/campos.ts';
import { carreiraDe, noGenero, nomeDoCargo } from '../motor/carreira.ts';
import { cargoDe } from '../motor/poder.ts';
import { ATRIBUTOS } from '../motor/constantes.ts';
import { capitalizar } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, CORES, dinheiroCurto, NOMES } from './formato.ts';
import { Icone, ICONE_DO_ATRIBUTO } from './Icones.tsx';

interface Props {
  vida: EstadoVida;
  aoAbrirFamilia: () => void;
  aoAbrirCarreira: () => void;
  aoAbrirDinheiro: () => void;
  /** A linha do lugar e do ano abre a folha do país. */
  aoAbrirPais: () => void;
  aoAbrirMenu: () => void;
  /** Durante um evento: só o nome, os botões e o dinheiro, para o cartão do evento ter a tela. */
  compacto?: boolean;
}

export function Cabecalho({ vida, aoAbrirFamilia, aoAbrirCarreira, aoAbrirDinheiro, aoAbrirPais, aoAbrirMenu, compacto = false }: Props) {
  const eu = vida.entidades['eu']!;
  const lugar = vida.entidades['lugar'];
  const n = eu.n;
  const dinheiro = n['dinheiro'] ?? 0;
  // O resto do dinheiro (investido, empresas, bens) entra no patrimônio; o detalhe fica na folha Dinheiro.
  const patrimonio = patrimonioTotal(vida);
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
  const titulo =
    cargo?.esfera === 'vitalicio'
      ? noGenero(cargo.nome, eu.genero)
      : eu.q['principe']
        ? eu.genero === 'f'
          ? 'princesa'
          : 'príncipe'
        : eu.q['herdeiro_regime']
          ? eu.genero === 'f'
            ? 'herdeira do Regime'
            : 'herdeiro do Regime'
          : '';
  const icoFase = fase === 'expansao' ? 'sobe' : fase === 'normal' ? 'estavel' : 'desce';
  const nomeDaFase = nomeFase ? capitalizar(nomeFase) : 'Economia normal';
  const pais = vida.entidades['pais']?.nome ?? 'país';
  return (
    <header class={`cabecalho${compacto ? ' compacto' : ''}`}>
      <div class="topo">
        <h1>
          {eu.nome} <span class="sobrenome">{vida.sobrenome}</span>
        </h1>
        <div class="botoes-topo">
          <button class="icone" type="button" aria-label="Família" onClick={aoAbrirFamilia}>
            <Icone nome="familia" />
          </button>
          <button class="icone" type="button" aria-label="Carreira e poder" onClick={aoAbrirCarreira}>
            <Icone nome="trabalhar" />
          </button>
          <button class="icone" type="button" aria-label="Dinheiro e investimentos" onClick={aoAbrirDinheiro}>
            <Icone nome="carteira" />
          </button>
          <button class="icone" type="button" aria-label="Menu" onClick={aoAbrirMenu}>
            <Icone nome="menu" />
          </button>
        </div>
      </div>
      <p class="sub">
        {titulo && <b class="titulo-nobre">{titulo} · </b>}
        {anos(vida.idade)} · {lugar?.nome}, {lugar?.t['uf']}
      </p>
      {/* O selo da economia abre a folha do país: texto que quebra linha, nunca cortado; o "›" diz que é tocável. */}
      <button class={`selo-pais ${fase}`} type="button" aria-label={`${nomeDaFase}, ${pais}, ${vida.ano}: ver o país`} onClick={aoAbrirPais}>
        <Icone nome={icoFase} tamanho={16} classe="ico" />
        <span class="nome-fase">{nomeDaFase}</span>
        <span class="ano-pais">{` · ${vida.ano}`}</span>
        <span class="seta-pais" aria-hidden="true">
          ›
        </span>
      </button>
      {/* O estado é terciário: rótulo suave, número e uma barra fina na cor do atributo, sem caixa. */}
      <div class="indicadores">
        {ATRIBUTOS.map((a) => {
          const valor = Math.round(n[a] ?? 0);
          return (
            <div class="indicador" key={a} style={{ '--cor': CORES[a] }}>
              <span class="nome-indicador">
                <Icone nome={ICONE_DO_ATRIBUTO[a]} tamanho={16} classe="ico" />
                <span class="rotulo">{NOMES[a]}</span>
              </span>
              <b>{valor}</b>
              <div class="barra" role="meter" aria-label={NOMES[a]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={valor} style={{ '--v': valor / 100 }}>
                <span />
              </div>
            </div>
          );
        })}
      </div>
      {/* O dinheiro numa linha de texto que quebra: nenhum valor é cortado. Abre a folha Dinheiro. */}
      <button class="saldo" type="button" onClick={aoAbrirDinheiro}>
        <span class="item dinheiro">
          Dinheiro <b>{dinheiroCurto(dinheiro)}</b>
          {divida >= 1 && (
            <span class="divida">
              {' '}
              · dívida <b>{dinheiroCurto(divida)}</b>
            </span>
          )}
        </span>
        {Math.abs(patrimonio - dinheiro) >= 1 && (
          <span class="item">
            Patrimônio <b>{dinheiroCurto(patrimonio)}</b>
          </span>
        )}
        {vida.vivo && (renda >= 1 || setor) && (
          <span class="item">
            Renda <b>{renda >= 1 ? `${dinheiroCurto(renda / 12)}/mês` : 'nenhuma'}</b>
            {setor && setor !== titulo && <span class="cargo"> · {setor}</span>}
          </span>
        )}
      </button>
    </header>
  );
}
