import { useEffect, useState } from 'preact/hooks';
import { carreiraDe, chanceDeEntrar, faixaDeIdade, nomeDoCargo, noGenero, salarioDoCargo } from '../motor/carreira.ts';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { cargoDe, chanceDeEleicao, ondeDoCargo, proximaEleicao } from '../motor/poder.ts';
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

/** O trabalho de agora e as vagas: tentar uma por ano, com a chance de passar à vista. */
function Trabalho({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const eu = vida.entidades['eu']!;
  const g = eu.genero;
  const atual = carreiraDe(vida, conteudo);
  const nivel = eu.n['nivel'] ?? 0;
  const renda = eu.n['renda'] ?? 0;
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [saindo, setSaindo] = useState(false);
  const vagas = conteudo.mundo.carreiras
    .map((k) => ({ k, motivo: motivoParaNaoOperar(vida, conteudo, { tipo: 'candidatar', carreira: k.id }) }))
    .sort((a, b) => Number(a.motivo !== null) - Number(b.motivo !== null) || b.k.salario[1] - a.k.salario[1]);
  const sel = vagas.find((v) => v.k.id === escolhida);
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
      <p class="nota">Uma tentativa por ano. Profissões de palco pagam pouco no começo e uma fortuna no topo.</p>
      {sel && (
        <div class="confirmar">
          <p>
            <b>{noGenero(sel.k.nome, g)}</b>: {porMes(salarioDoCargo(sel.k, 0))} no começo, até {porMes(sel.k.salario[1])} como {noGenero(sel.k.cargos.at(-1)!, g)}.
            {sel.motivo ? ` Agora não: ${sel.motivo}.` : ` Chance de passar: ${pct(chanceDeEntrar(vida, conteudo, sel.k))}.`}
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
        {vagas.map(({ k, motivo }) => {
          const [min, max] = faixaDeIdade(k);
          return (
            <li key={k.id}>
              <button type="button" class={`vaga${motivo ? ' fechada' : ''}`} aria-pressed={escolhida === k.id} onClick={() => setEscolhida(k.id)}>
                <b>{noGenero(k.nome, g)}</b>
                <small>
                  {porMes(salarioDoCargo(k, 0))} → {porMes(k.salario[1])}
                  {motivo ? ` · ${motivo}` : ` · ${pct(chanceDeEntrar(vida, conteudo, k))} de chance`}
                  {k.fama ? ' · fama' : ''}
                  {min !== 18 || max !== 64 ? ` · ${min}–${max} anos` : ''}
                </small>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Influência, fama, o cargo de agora e as eleições do ano. */
function Poder({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const eu = vida.entidades['eu']!;
  const g = eu.genero;
  const cargo = cargoDe(vida, conteudo);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const cargos = conteudo.mundo.cargos.filter((k) => k.esfera !== 'vitalicio');
  const sel = cargos.find((k) => k.id === escolhido);
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
            <dd class={(eu.n['popularidade'] ?? 50) < 25 ? 'ruim' : ''}>{Math.round(eu.n['popularidade'] ?? 50)}%</dd>
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
        Influência vem do patrimônio, dos bens (jatinho, jornal, emissora), da fama, da empresa e do cargo. Ela decide eleições e abre portas. Eleição municipal nos anos múltiplos de 4; a
        geral, dois anos depois.
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
        {cargos.map((k) => {
          const motivo = motivoParaNaoOperar(vida, conteudo, { tipo: 'candidatarCargo', cargo: k.id });
          return (
            <li key={k.id}>
              <button type="button" class={`vaga${motivo ? ' fechada' : ''}`} aria-pressed={escolhido === k.id} onClick={() => setEscolhido(k.id)}>
                <b>
                  {noGenero(k.nome, g)} {ondeDoCargo(vida, k)}
                </b>
                <small>
                  eleição em {proximaEleicao(vida.ano, k)} · influência {k.influencia}+ · campanha {formatarDinheiro(k.campanha)}
                  {motivo ? '' : ` · ${pct(chanceDeEleicao(vida, k))}`}
                </small>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function Carreira({ vida, conteudo, aoOperar, aoFechar }: Props) {
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-carreira" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha dinheiro-folha">
        <h2 id="titulo-carreira">Carreira e poder</h2>
        {vida.idade < 16 ? (
          <p class="meta">Trabalho e eleição só a partir dos 16. Por enquanto, estude, brinque e junte histórias.</p>
        ) : (
          <>
            <Trabalho vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
            <Poder vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
          </>
        )}
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
