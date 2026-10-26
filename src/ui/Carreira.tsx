import { useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { carreiraDe, chanceDeEntrar, faixaDeIdade, nomeDoCargo, noGenero, salarioDoCargo } from '../motor/carreira.ts';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { DefCargo, DefCarreira } from '../motor/esquema.ts';
import { cargoDe, chanceDeEleicao, ondeDoCargo, proximaEleicao } from '../motor/poder.ts';
import { FORMAS_DA_COROA, type FormaDaCoroa } from '../motor/constantes.ts';
import { dotacaoDe, formaDaCoroa, nomeDaForma, paisDaCoroa } from '../motor/coroa.ts';
import { COROA, ILHA, POPULARIDADE_CRITICA } from '../motor/regras.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  aoFechar: () => void;
}

const porMes = (anual: number): string => `${formatarDinheiro(anual / 12)}/mês`;
const pct = (p: number): string => `${Math.round(p * 100)}%`;

/** O motivo que agrupa as fechadas: a idade, a influência e o ano da eleição viram um motivo só (o número de cada uma está na lista inteira). */
function motivoDoGrupo(m: string): string {
  if (m.startsWith('só entre')) return 'só para outras idades';
  if (m.startsWith('precisa de influência')) return 'falta influência';
  if (m.startsWith('a próxima eleição')) return 'não é ano de eleição';
  return m;
}

/** O trabalho de agora e as vagas: tentar uma por ano, com a chance de passar à vista. */
function Trabalho({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const eu = vida.entidades['eu']!;
  const g = eu.genero;
  const atual = carreiraDe(vida, conteudo);
  const nivel = eu.n['nivel'] ?? 0;
  const renda = eu.n['renda'] ?? 0;
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [saindo, setSaindo] = useState(false);
  const [verTodas, setVerTodas] = useState(false);
  const vagas = conteudo.mundo.carreiras
    .map((k) => ({ k, motivo: motivoParaNaoOperar(vida, conteudo, { tipo: 'candidatar', carreira: k.id }) }))
    .sort((a, b) => Number(a.motivo !== null) - Number(b.motivo !== null) || b.k.salario[1] - a.k.salario[1]);
  const sel = vagas.find((v) => v.k.id === escolhida);
  // As fechadas pelo mesmo motivo viram uma linha só (o motivo à vista); "ver todas" abre a lista inteira.
  const fechadas = new Map<string, typeof vagas>();
  for (const v of vagas) if (v.motivo) fechadas.set(motivoDoGrupo(v.motivo), [...(fechadas.get(motivoDoGrupo(v.motivo)) ?? []), v]);
  const demitir: Operacao = { tipo: 'demitir' };
  const motivoDemissao = motivoParaNaoOperar(vida, conteudo, demitir);

  return (
    <fieldset class="grupo">
      <legend>Trabalho</legend>
      {atual ? (
        <div class="empresa-cartao">
          <h3>{noGenero(atual.nome, g)}</h3>
          <p class="nota">
            {nomeDoCargo(atual, nivel, g)} · {porMes(renda)}
          </p>
          <ol class="degraus" aria-label="Cargos">
            {atual.cargos.map((c, i) => (
              <li key={c} class={i === nivel ? 'atual' : i < nivel ? 'feito' : ''}>
                {noGenero(c, g)}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p class="nota">{renda >= 1 ? `Você ganha ${porMes(renda)}${eu.t['ocupacao'] ? ` como ${eu.t['ocupacao']}` : ''}.` : 'Sem emprego agora.'}</p>
      )}
      {motivoDemissao === null &&
        (saindo ? (
          <div class="confirmar">
            <p>Pedir demissão? A renda vai a zero até você achar outra coisa.</p>
            <div class="escolhas-origem">
              <button type="button" class="botao" onClick={() => aoOperar(demitir)}>
                Pedir demissão
              </button>
              <button type="button" class="botao secundario" onClick={() => setSaindo(false)}>
                Ficar
              </button>
            </div>
          </div>
        ) : (
          <button class="botao secundario" type="button" onClick={() => setSaindo(true)}>
            Pedir demissão
          </button>
        ))}
      {vagas.some((v) => v.motivo === null) && <p class="nota">Uma tentativa por ano. Profissões de palco pagam pouco no começo e uma fortuna no topo.</p>}
      {sel && (
        <div class="confirmar">
          <p>
            <b>{noGenero(sel.k.nome, g)}</b>: {porMes(salarioDoCargo(sel.k, 0))} no começo, até {porMes(sel.k.salario[1])} como {noGenero(sel.k.cargos.at(-1)!, g)}.
            {sel.motivo ? ` Agora não: ${sel.motivo}.` : ` Chance de passar: ${pct(chanceDeEntrar(vida, sel.k))}.`}
          </p>
          <div class="escolhas-origem">
            <button type="button" class="botao" disabled={sel.motivo !== null} onClick={() => aoOperar({ tipo: 'candidatar', carreira: sel.k.id })}>
              Tentar a vaga
            </button>
            <button type="button" class="botao secundario" onClick={() => setEscolhida(null)}>
              Voltar
            </button>
          </div>
        </div>
      )}
      <ul class="vagas" aria-label="Profissões">
        {vagas
          .filter((v) => v.motivo === null)
          .map((v) => (
            <Vaga key={v.k.id} {...v} vida={vida} escolhida={escolhida === v.k.id} aoEscolher={setEscolhida} />
          ))}
        {[...fechadas].map(([motivo, grupo]) =>
          verTodas || grupo.length < 3 ? (
            grupo.map((v) => <Vaga key={v.k.id} {...v} vida={vida} escolhida={escolhida === v.k.id} aoEscolher={setEscolhida} />)
          ) : (
            <li key={motivo}>
              <button type="button" class="vaga fechada" onClick={() => setVerTodas(true)}>
                <b>
                  {grupo.length} profissões fechadas: {motivo}
                </b>
                <small>ver todas</small>
              </button>
            </li>
          ),
        )}
      </ul>
    </fieldset>
  );
}

/** Uma profissão da lista: o salário do começo ao topo e a chance (ou o motivo de não poder agora). */
function Vaga({ k, motivo, vida, escolhida, aoEscolher }: { k: DefCarreira; motivo: string | null; vida: EstadoVida; escolhida: boolean; aoEscolher: (id: string) => void }) {
  const g = vida.entidades['eu']!.genero;
  const [min, max] = faixaDeIdade(k);
  // A faixa de idade não se repete quando o motivo já é a idade.
  const faixa = (min !== 18 || max !== 64) && !motivo?.startsWith('só entre') ? ` · ${min}–${max} anos` : '';
  return (
    <li>
      <button type="button" class={`vaga${motivo ? ' fechada' : ''}`} aria-pressed={escolhida} onClick={() => aoEscolher(k.id)}>
        <b>{noGenero(k.nome, g)}</b>
        <small>
          {porMes(salarioDoCargo(k, 0))} → {porMes(k.salario[1])}
          {motivo ? ` · ${motivo}` : ` · ${pct(chanceDeEntrar(vida, k))} de chance`}
          {k.fama ? ' · fama' : ''}
          {faixa}
        </small>
      </button>
    </li>
  );
}

/** Influência, fama, o cargo de agora e as eleições do ano. */
function Poder({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const eu = vida.entidades['eu']!;
  const g = eu.genero;
  const cargo = cargoDe(vida, conteudo);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [verTodos, setVerTodos] = useState(false);
  const cargos = conteudo.mundo.cargos
    .filter((k) => k.esfera !== 'vitalicio')
    .map((k) => ({ k, motivo: motivoParaNaoOperar(vida, conteudo, { tipo: 'candidatarCargo', cargo: k.id }) }));
  const fechados = new Map<string, typeof cargos>();
  for (const c of cargos) if (c.motivo) fechados.set(motivoDoGrupo(c.motivo), [...(fechados.get(motivoDoGrupo(c.motivo)) ?? []), c]);
  const sel = cargos.find((c) => c.k.id === escolhido)?.k;
  const opSel: Operacao | null = sel ? { tipo: 'candidatarCargo', cargo: sel.id } : null;
  const motivoSel = opSel ? motivoParaNaoOperar(vida, conteudo, opSel) : null;
  const mandato = eu.n['mandato'] ?? 0;

  return (
    <fieldset class="grupo">
      <legend>Poder</legend>
      <dl class="empresa-cartao poder">
        <dt>Influência</dt>
        <dd>{Math.round(eu.n['influencia'] ?? 0)}</dd>
        <dt>Fama</dt>
        <dd>{Math.round(eu.n['fama'] ?? 0)}</dd>
        {cargo && (
          <>
            <dt>Cargo</dt>
            <dd>
              {noGenero(cargo.nome, g)} {ondeDoCargo(vida, cargo)}
            </dd>
            <dt>Aprovação</dt>
            <dd class={(eu.n['popularidade'] ?? 50) < POPULARIDADE_CRITICA + 5 ? 'ruim' : ''}>{Math.round(eu.n['popularidade'] ?? 50)}%</dd>
            {cargo.esfera !== 'vitalicio' && (
              <>
                <dt>Mandato</dt>
                <dd>{mandato > 0 ? `mais ${mandato + 1} anos` : 'último ano'}</dd>
              </>
            )}
          </>
        )}
      </dl>
      <p class="nota">
        A influência vem do patrimônio, dos bens, da fama, da empresa e do cargo, e decide eleições. Municipais nos anos múltiplos de 4; gerais, dois anos depois.
      </p>
      {sel && (
        <div class="confirmar">
          <p>
            <b>
              {noGenero(sel.nome, g)} {ondeDoCargo(vida, sel)}
            </b>
            : campanha de {formatarDinheiro(sel.campanha)}, salário de {porMes(sel.salario)}, mandato de {sel.mandato} anos.
            {motivoSel ? ` Agora não: ${motivoSel}.` : ` Chance de ganhar: ${pct(chanceDeEleicao(vida, sel))}.`}
          </p>
          <div class="escolhas-origem">
            <button type="button" class="botao" disabled={motivoSel !== null} onClick={() => opSel && aoOperar(opSel)}>
              Candidatar-se
            </button>
            <button type="button" class="botao secundario" onClick={() => setEscolhido(null)}>
              Voltar
            </button>
          </div>
        </div>
      )}
      <ul class="vagas" aria-label="Cargos eletivos">
        {cargos
          .filter((c) => c.motivo === null)
          .map((c) => (
            <Cargo key={c.k.id} {...c} vida={vida} escolhido={escolhido === c.k.id} aoEscolher={setEscolhido} />
          ))}
        {[...fechados].map(([motivo, grupo]) =>
          verTodos || grupo.length < 3 ? (
            grupo.map((c) => <Cargo key={c.k.id} {...c} vida={vida} escolhido={escolhido === c.k.id} aoEscolher={setEscolhido} />)
          ) : (
            <li key={motivo}>
              <button type="button" class="vaga fechada" onClick={() => setVerTodos(true)}>
                <b>
                  {grupo.length} cargos fechados: {motivo}
                </b>
                <small>ver todos</small>
              </button>
            </li>
          ),
        )}
      </ul>
    </fieldset>
  );
}

/** "2.300": a população da ilha, com ponto de milhar. */
const milhar = (v: number): string => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** O que cada forma faz, numa linha. */
const EXPLICA_A_FORMA: Record<FormaDaCoroa, string> = {
  salario: 'Um valor fixo, combinado com quem paga.',
  impostos: 'Uma fatia do que se arrecada: cresce com a economia e encolhe na crise.',
  taxa: 'Um imposto a mais, só para a coroa: muito dinheiro e muita gente brava.',
};

/**
 * A coroa: como ela recebe, com a dotação de cada forma e o que ela custa na aprovação, à vista antes de escolher (uma
 * mudança por ano); e a ilha que quem joga fundou, com a população, o PIB e o imposto.
 */
function Coroa({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const onde = paisDaCoroa(vida);
  const ilha = vida.entidades['ilha'];
  if (!onde && !ilha) return null;
  const forma = onde ? formaDaCoroa(vida, onde) : null;
  const motivoDe = (f: FormaDaCoroa): string | null => motivoParaNaoOperar(vida, conteudo, { tipo: 'coroa', forma: f });
  const bloqueio = onde ? FORMAS_DA_COROA.filter((f) => f !== forma).map(motivoDe).find((m) => m !== null) : null;
  const populacao = ilha?.n['populacao'] ?? 0;
  const pib = ilha?.n['pib'] ?? 0;
  return (
    <fieldset class="grupo">
      <legend>{onde === 'pais' ? 'A coroa' : (ilha?.nome ?? 'A coroa')}</legend>
      {ilha && (
        <dl class="empresa-cartao">
          <dt>População</dt>
          <dd>{milhar(populacao)} habitantes</dd>
          <dt>PIB</dt>
          <dd>{formatarDinheiro(pib)} por ano</dd>
          <dt>Por pessoa</dt>
          <dd>{formatarDinheiro(pib / Math.max(1, populacao))}</dd>
          <dt>Imposto</dt>
          <dd>{Math.round(ILHA.imposto * 100)}% do PIB</dd>
        </dl>
      )}
      {onde && forma ? (
        <>
          <p class="nota">
            Como a coroa recebe. A dotação é a sua renda, paga {onde === 'pais' ? 'pelo Tesouro' : 'pela ilha'}, e a forma muda uma vez por ano. Abaixo de {POPULARIDADE_CRITICA}% de aprovação, o
            cargo balança.
          </p>
          {FORMAS_DA_COROA.map((f) => (
            <div class="bem-meu" key={f}>
              <p>
                <b>{nomeDaForma(f, onde)}</b> · {formatarDinheiro(dotacaoDe(vida, conteudo, onde, f))} por ano
              </p>
              <p class="nota">
                {COROA.custo[f] > 0 ? <span class="atrasada">A aprovação anda {COROA.custo[f]} pontos para baixo.</span> : 'O povo nem nota.'} {EXPLICA_A_FORMA[f]}
              </p>
              <div class="escolhas-origem">
                <button
                  type="button"
                  class="chip-origem"
                  aria-pressed={forma === f}
                  aria-label={forma === f ? `${nomeDaForma(f, onde)}: em vigor` : `Escolher: ${nomeDaForma(f, onde)}`}
                  disabled={f !== forma && motivoDe(f) !== null}
                  onClick={() => f !== forma && aoOperar({ tipo: 'coroa', forma: f })}
                >
                  {forma === f ? 'Em vigor' : 'Escolher'}
                </button>
              </div>
            </div>
          ))}
          {bloqueio && <p class="nota">Agora não: {bloqueio}.</p>}
        </>
      ) : (
        <p class="nota">A ilha tem governo próprio, eleito por quem mora lá: você é do país que fundou, sem coroa nele.</p>
      )}
    </fieldset>
  );
}

/** Um cargo eletivo da lista: a eleição, a influência e a campanha, e a chance (ou o motivo de não poder agora). */
function Cargo({ k, motivo, vida, escolhido, aoEscolher }: { k: DefCargo; motivo: string | null; vida: EstadoVida; escolhido: boolean; aoEscolher: (id: string) => void }) {
  return (
    <li>
      <button type="button" class={`vaga${motivo ? ' fechada' : ''}`} aria-pressed={escolhido} onClick={() => aoEscolher(k.id)}>
        <b>
          {noGenero(k.nome, vida.entidades['eu']!.genero)} {ondeDoCargo(vida, k)}
        </b>
        <small>
          eleição em {proximaEleicao(vida.ano, k)} · influência {k.influencia}+ · campanha {formatarDinheiro(k.campanha)}
          {motivo ? ` · ${motivo}` : ` · ${pct(chanceDeEleicao(vida, k))}`}
        </small>
      </button>
    </li>
  );
}

export function Carreira({ vida, conteudo, aoOperar, aoFechar }: Props) {
  // Quem tem cargo de poder vê o Poder primeiro: as vagas estão fechadas para ele.
  const comCargo = cargoDe(vida, conteudo) !== undefined;
  const trabalho = <Trabalho vida={vida} conteudo={conteudo} aoOperar={aoOperar} />;
  const poder = <Poder vida={vida} conteudo={conteudo} aoOperar={aoOperar} />;
  const coroa = <Coroa vida={vida} conteudo={conteudo} aoOperar={aoOperar} />;
  return (
    <Folha id="titulo-carreira" titulo="Carreira e poder" classe="dinheiro-folha" aoFechar={aoFechar}>
        {vida.idade < 16 ? (
          <p class="meta">Trabalho e eleição só a partir dos 16. Por enquanto, estude, brinque e junte histórias.</p>
        ) : (
          <>
            {comCargo ? poder : trabalho}
            {comCargo && coroa}
            {comCargo ? trabalho : poder}
            {!comCargo && coroa}
          </>
        )}
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
    </Folha>
  );
}
