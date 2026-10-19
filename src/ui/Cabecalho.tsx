import { conteudo } from '../conteudo.ts';
import { defFase, faseDe } from '../motor/pais.ts';
import { patrimonioTotal } from '../motor/campos.ts';
import { carreiraDe, noGenero, nomeDoCargo } from '../motor/carreira.ts';
import { cargoDe } from '../motor/poder.ts';
import { ATRIBUTOS } from '../motor/constantes.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos, CORES, dinheiroCurto, iniciais, NOMES } from './formato.ts';
import { Icone, ICONE_DO_ATRIBUTO } from './Icones.tsx';
import { Marca } from './Marca.tsx';

interface Props {
  vida: EstadoVida;
  aoAbrirFamilia: () => void;
  aoAbrirCarreira: () => void;
  aoAbrirDinheiro: () => void;
  /** A linha do lugar e do ano abre a folha do país. */
  aoAbrirPais: () => void;
  aoAbrirMenu: () => void;
  /** Durante um evento que não cabe na tela: só nome e idade, para o cartão inteiro aparecer. */
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
  const titulo = cargo?.esfera === 'vitalicio' ? noGenero(cargo.nome, eu.genero) : eu.q['principe'] ? (eu.genero === 'f' ? 'princesa' : 'príncipe') : eu.q['herdeiro_regime'] ? 'herdeiro do Regime' : '';
  // A coroa no retrato: quem nasceu ou chegou ao topo (a coroa, o Regime, a ilha) e quem tem bilhão.
  const coroa = Boolean(titulo) || patrimonio >= 1e9;
  const icoFase = fase === 'expansao' ? 'sobe' : fase === 'normal' ? 'estavel' : 'desce';
  const pais = vida.entidades['pais']?.nome ?? 'país';
  return (
    <header class={`cabecalho${compacto ? ' compacto' : ''}`}>
      <div class="barra-marca">
        <div class="marca-topo" aria-hidden="true">
          <Marca classe="marca-mini" />
          <span class="nome-jogo">
            Trajetória
            <small>sua vida, suas escolhas</small>
          </span>
        </div>
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
      <div class="identidade">
        <div class="retrato" aria-hidden="true">
          <span>{iniciais(eu.nome, vida.sobrenome)}</span>
          {coroa && (
            <span class="selo">
              <Icone nome="coroa" tamanho={13} />
            </span>
          )}
        </div>
        <div class="quem">
          <h1>
            {eu.nome} <span class="sobrenome">{vida.sobrenome}</span>
          </h1>
          <p class="sub">
            {titulo && <b class="titulo-nobre">{titulo} · </b>}
            {anos(vida.idade)} · {lugar?.nome}, {lugar?.t['uf']}
          </p>
          <button class={`chip-pais ${fase}`} type="button" aria-label={`${nomeFase ? capitalizar(nomeFase) : 'Economia normal'}, ${vida.ano}: ver o país`} onClick={aoAbrirPais}>
            <span class="pilula">
              <Icone nome={icoFase} tamanho={16} />
              <span class="nome-fase">{nomeFase ? capitalizar(nomeFase) : 'Economia normal'}</span>
              <span class="pais">
                · {pais} {vida.ano} <span aria-hidden="true">🇧🇷 ›</span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div class="indicadores">
        {ATRIBUTOS.map((a) => {
          const valor = Math.round(n[a] ?? 0);
          return (
            <div class="indicador" key={a} style={{ '--cor': CORES[a] }}>
              <Icone nome={ICONE_DO_ATRIBUTO[a]} tamanho={20} classe="ico" />
              <span class="rotulo">{NOMES[a]}</span>
              <b>{valor}</b>
              <div class="barra" role="meter" aria-label={NOMES[a]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={valor}>
                <span style={{ width: `${valor}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <button
        class="financas"
        type="button"
        onClick={aoAbrirDinheiro}
        aria-label={`Dinheiro ${formatarDinheiro(dinheiro)}${divida >= 1 ? `, dívida ${formatarDinheiro(divida)}` : ''}; patrimônio ${formatarDinheiro(patrimonio)}; renda ${formatarDinheiro(renda / 12)} por mês${setor ? `, ${setor}` : ''}. Abrir dinheiro e investimentos`}
      >
        <span class="kpi">
          <small>
            <Icone nome="carteira" tamanho={16} classe="ico" />
            <span class="rotulo">Dinheiro</span>
          </small>
          <b>{dinheiroCurto(dinheiro)}</b>
          {divida >= 1 && <em class="divida">dívida {dinheiroCurto(divida)}</em>}
        </span>
        <span class="kpi">
          <small>
            <Icone nome="patrimonio" tamanho={16} classe="ico" />
            <span class="rotulo">Patrimônio</span>
          </small>
          <b>{dinheiroCurto(patrimonio)}</b>
        </span>
        <span class="kpi">
          <small>
            <Icone nome="renda" tamanho={16} classe="ico" />
            <span class="rotulo">{setor && setor !== titulo ? capitalizar(setor) : 'Renda'}</span>
          </small>
          <b>
            {renda >= 1 ? (
              <>
                {dinheiroCurto(renda / 12)}
                <small>/mês</small>
              </>
            ) : (
              'sem renda'
            )}
          </b>
        </span>
      </button>
    </header>
  );
}
