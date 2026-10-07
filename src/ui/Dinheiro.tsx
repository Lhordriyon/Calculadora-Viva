import { useEffect, useState } from 'preact/hooks';
import { funcionariosDe, investidoDe, parteNaEmpresa, patrimonioTotal } from '../motor/campos.ts';
import { motivoParaNaoOperar, NOMES_PADRAO, perfilDe, type Operacao } from '../motor/carteira.ts';
import { ATIVOS, PADROES, PERFIS, RETIRADAS, type Ativo, type Padrao, type Perfil } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { padraoDe } from '../motor/economia.ts';
import { empresaDe, liquidoDe, precoDaParte, setoresDeEmpresa } from '../motor/empresa.ts';
import { FELICIDADE_DO_PADRAO, GASTO_DA_SOBRA, GASTO_DO_PATRIMONIO, PATRIMONIO_SEM_GASTO } from '../motor/regras.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';
import { anos } from './formato.ts';

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  aoFechar: () => void;
}

type Sentido = 'aplicar' | 'resgatar';
const FRACOES = [
  { rotulo: '10%', f: 0.1 },
  { rotulo: '25%', f: 0.25 },
  { rotulo: 'Metade', f: 0.5 },
  { rotulo: 'Tudo', f: 1 },
] as const;

/** Rótulos curtos para os chips (o nome completo aparece na carteira). */
const CURTO: Record<Ativo, string> = { renda_fixa: 'Renda fixa', acoes: 'Ações', fii: 'Imóveis', dolar: 'Dólar', cripto: 'Cripto' };
const RETIRADA_ROTULO = ['Reinvestir tudo', 'Tirar 3% ao ano', 'Tirar 8% ao ano'];

function porcento(v: number): string {
  const r = Math.round(v * 10) / 10;
  return `${r > 0 ? '+' : r < 0 ? '−' : ''}${String(Math.abs(r)).replace('.', ',')}%`;
}

function sinalDinheiro(v: number): string {
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${formatarDinheiro(Math.abs(v))}`;
}

function Quanto({ fracao, aoMudar, rotulo }: { fracao: number; aoMudar: (f: number) => void; rotulo: string }) {
  return (
    <div class="escolhas-origem" role="group" aria-label={rotulo}>
      {FRACOES.map((x) => (
        <button type="button" class="chip-origem" key={x.rotulo} aria-pressed={fracao === x.f} onClick={() => aoMudar(x.f)}>
          {x.rotulo}
        </button>
      ))}
    </div>
  );
}

/** A empresa: abrir (ramo e capital) ou tocar a que existe (retirada, aporte, venda). */
function Empresa({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const setores = setoresDeEmpresa(conteudo);
  const [ramo, setRamo] = useState(() => {
    const atual = vida.entidades['eu']!.t['setor'] ?? '';
    return setores.some((s) => s.id === atual) ? atual : (setores[0]?.id ?? '');
  });
  const [fracao, setFracao] = useState(0.25);
  const [vendendo, setVendendo] = useState(false);
  const emp = empresaDe(vida);
  const liquido = liquidoDe(vida);
  const valor = Math.floor(liquido * fracao);

  if (!emp) {
    const op: Operacao = { tipo: 'abrir', setor: ramo, valor };
    const motivo = motivoParaNaoOperar(vida, conteudo, op);
    const def = setores.find((s) => s.id === ramo);
    const risco = (def?.risco ?? 1) >= 1.3 ? 'balança muito' : (def?.risco ?? 1) <= 0.8 ? 'balança pouco' : 'balança na média';
    const crise = (def?.ciclo ?? 1) >= 1.4 ? ' e sofre nas crises' : (def?.ciclo ?? 1) <= 0.5 ? ' e quase não sente as crises' : '';
    return (
      <fieldset class="grupo">
        <legend>Empresa</legend>
        <p class="nota">Ela cresce ou quebra com o ramo, com o país e com o quanto você a toca (o “Trabalhar” do ano). O dinheiro sai da conta e, se faltar, dos investimentos.</p>
        <div class="escolhas-origem" role="group" aria-label="Ramo">
          {setores.map((s) => (
            <button type="button" class="chip-origem" key={s.id} aria-pressed={ramo === s.id} onClick={() => setRamo(s.id)}>
              {capitalizar(s.nome)}
            </button>
          ))}
        </div>
        {def && (
          <p class="nota">
            {capitalizar(def.nome)}: uma pequena cresce uns {def.tracao ?? 4}% ao ano, {risco}
            {crise}.
          </p>
        )}
        <Quanto fracao={fracao} aoMudar={setFracao} rotulo="Capital" />
        <button class="botao grande" type="button" disabled={motivo !== null} onClick={() => aoOperar(op)}>
          Abrir com {formatarDinheiro(valor)}
        </button>
        {motivo && <p class="nota">Agora não: {motivo}.</p>}
      </fieldset>
    );
  }

  const n = emp.n;
  const ramoNome = conteudo.setores.get(emp.t['setor'] ?? '')?.nome ?? '';
  const parte = n['participacao'] ?? 1;
  const idade = vida.ano - (emp.nascimento ?? vida.ano);
  const lucro = n['lucro'] ?? 0;
  const aporte: Operacao = { tipo: 'aportar', valor };
  const motivoAporte = motivoParaNaoOperar(vida, conteudo, aporte);
  const preco = precoDaParte(vida, conteudo);
  const pessoas = funcionariosDe(n['valor'] ?? 0);
  return (
    <fieldset class="grupo">
      <legend>Empresa</legend>
      <div class="empresa-cartao">
        <h3>{emp.nome}</h3>
        <p class="nota">
          {capitalizar(ramoNome)} · {idade === 0 ? 'aberta este ano' : `${anos(idade)} de vida`} · {pessoas === 1 ? 'só você' : `${pessoas.toLocaleString('pt-BR')} pessoas`}
        </p>
        <dl>
          <dt>Vale</dt>
          <dd>{formatarDinheiro(n['valor'] ?? 0)}</dd>
          <dt>Sua parte</dt>
          <dd>
            {Math.round(parte * 100)}% · {formatarDinheiro(parteNaEmpresa(vida))}
          </dd>
          {idade > 0 && (
            <>
              <dt>No último ano</dt>
              <dd class={lucro < 0 ? 'ruim' : ''}>{sinalDinheiro(lucro)}</dd>
            </>
          )}
          <dt>Ritmo</dt>
          <dd class={(n['tracao'] ?? 0) < 0 ? 'ruim' : ''}>{porcento(n['tracao'] ?? 0)} ao ano</dd>
        </dl>
      </div>
      <div class="escolhas-origem" role="group" aria-label="Retirada">
        {RETIRADAS.map((r, i) => (
          <button
            type="button"
            class="chip-origem"
            key={r}
            aria-pressed={Math.abs((n['retirada'] ?? 0) - r) < 1e-9}
            onClick={() => Math.abs((n['retirada'] ?? 0) - r) >= 1e-9 && aoOperar({ tipo: 'retirada', fracao: r })}
          >
            {RETIRADA_ROTULO[i]}
          </button>
        ))}
      </div>
      <p class="nota">
        {(n['retirada'] ?? 0) > 0
          ? `Cai na sua conta uns ${formatarDinheiro((n['retirada'] ?? 0) * (n['valor'] ?? 0) * parte)} por ano; a empresa cresce menos.`
          : 'Todo o lucro fica na empresa e cresce junto com ela.'}
      </p>
      <Quanto fracao={fracao} aoMudar={setFracao} rotulo="Quanto pôr" />
      <button class="botao" type="button" disabled={motivoAporte !== null} onClick={() => aoOperar(aporte)}>
        Pôr {formatarDinheiro(valor)} na empresa
      </button>
      {motivoAporte && <p class="nota">Agora não: {motivoAporte}.</p>}
      {vendendo ? (
        <div class="confirmar">
          <p>
            Vender a sua parte por {formatarDinheiro(preco)}
            {preco < parteNaEmpresa(vida) - 1 ? ', abaixo do que ela vale (o país está mal)' : preco > parteNaEmpresa(vida) + 1 ? ', acima do que ela vale (o país está aquecido)' : ''}?
          </p>
          <div class="escolhas-origem">
            <button
              type="button"
              class="botao"
              onClick={() => {
                setVendendo(false);
                aoOperar({ tipo: 'vender' });
              }}
            >
              Vender
            </button>
            <button type="button" class="botao secundario" onClick={() => setVendendo(false)}>
              Ficar com ela
            </button>
          </div>
        </div>
      ) : (
        <button class="botao secundario" type="button" disabled={vida.pendente !== null} onClick={() => setVendendo(true)}>
          Vender a empresa
        </button>
      )}
    </fieldset>
  );
}

/** Investimentos: perfil, carteira por classe e aplicar ou resgatar em três toques. */
function Investimentos({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const [sentido, setSentido] = useState<Sentido>('aplicar');
  const [fracao, setFracao] = useState(0.25);
  const [onde, setOnde] = useState<Ativo | 'perfil'>('perfil');
  const [trocandoPara, setTrocandoPara] = useState<Perfil | null>(null);

  const eu = vida.entidades['eu']!;
  const pais = vida.entidades['pais']!;
  const n = eu.n;
  const conta = Math.max(0, n['dinheiro'] ?? 0);
  const investido = investidoDe(eu);
  const perfil = perfilDe(vida);
  const defPerfil = (p: Perfil) => conteudo.mundo.perfis.find((x) => x.id === p);

  const base = sentido === 'aplicar' ? conta : onde === 'perfil' ? investido : (n[onde] ?? 0);
  const valor = Math.floor(base * fracao);
  const op: Operacao =
    sentido === 'aplicar'
      ? { tipo: 'aplicar', valor, ...(onde === 'perfil' ? {} : { ativo: onde }) }
      : { tipo: 'resgatar', valor, ...(onde === 'perfil' ? {} : { ativo: onde }) };
  const motivo = motivoParaNaoOperar(vida, conteudo, op);
  const ondeTexto =
    onde === 'perfil' ? (sentido === 'aplicar' ? `pelo perfil ${perfil}` : 'do mais fácil de vender') : sentido === 'aplicar' ? `em ${CURTO[onde].toLowerCase()}` : `de ${CURTO[onde].toLowerCase()}`;

  function trocarPerfil(p: Perfil, rebalancear: boolean) {
    aoOperar({ tipo: 'perfil', perfil: p, rebalancear });
    setTrocandoPara(null);
  }

  return (
    <>
      <fieldset class="grupo">
        <legend>Investimentos</legend>
        <div class="escolhas-origem" role="group" aria-label="Aplicar ou resgatar">
          <button type="button" class="chip-origem" aria-pressed={sentido === 'aplicar'} onClick={() => setSentido('aplicar')}>
            Aplicar
          </button>
          <button type="button" class="chip-origem" aria-pressed={sentido === 'resgatar'} onClick={() => setSentido('resgatar')}>
            Resgatar
          </button>
        </div>
        <Quanto fracao={fracao} aoMudar={setFracao} rotulo="Quanto" />
        <div class="escolhas-origem" role="group" aria-label="Onde">
          <button type="button" class="chip-origem" aria-pressed={onde === 'perfil'} onClick={() => setOnde('perfil')}>
            {sentido === 'aplicar' ? 'Pelo perfil' : 'O mais fácil'}
          </button>
          {ATIVOS.map((a) => (
            <button type="button" class="chip-origem" key={a} aria-pressed={onde === a} onClick={() => setOnde(a)}>
              {CURTO[a]}
            </button>
          ))}
        </div>
        <button class="botao grande" type="button" disabled={motivo !== null} onClick={() => aoOperar(op)}>
          {sentido === 'aplicar' ? 'Aplicar' : 'Resgatar'} {formatarDinheiro(valor)} {ondeTexto}
        </button>
        {motivo && <p class="nota">Agora não: {motivo}.</p>}
      </fieldset>

      <ul class="carteira" aria-label="Carteira">
        {ATIVOS.map((a) => {
          const tem = n[a] ?? 0;
          const ret = pais.n[`ret_${a}`];
          return (
            <li key={a} class={tem >= 1 ? '' : 'vazio'}>
              <span class="nome">{conteudo.mundo.ativos.find((x) => x.id === a)?.nome ?? a}</span>
              <b>{formatarDinheiro(tem)}</b>
              {ret !== undefined && vida.idade > 0 && <span class={`ret ${ret < 0 ? 'ruim' : ''}`}>{porcento(ret)} no ano</span>}
            </li>
          );
        })}
      </ul>

      <fieldset class="grupo">
        <legend>Perfil de investidor</legend>
        <div class="escolhas-origem">
          {PERFIS.map((p) => (
            <button
              type="button"
              class="chip-origem"
              key={p}
              aria-pressed={perfil === p}
              onClick={() => (p === perfil ? undefined : investido >= 1 ? setTrocandoPara(p) : trocarPerfil(p, false))}
            >
              {defPerfil(p)?.nome ?? p}
            </button>
          ))}
        </div>
        <p class="nota">{defPerfil(trocandoPara ?? perfil)?.descricao}</p>
        {trocandoPara && (
          <div class="confirmar">
            <p>Levar o que já está investido para a divisão do perfil {trocandoPara}?</p>
            <div class="escolhas-origem">
              <button type="button" class="botao" onClick={() => trocarPerfil(trocandoPara, true)}>
                Rebalancear tudo
              </button>
              <button type="button" class="botao secundario" onClick={() => trocarPerfil(trocandoPara, false)}>
                Só o dinheiro novo
              </button>
            </div>
          </div>
        )}
      </fieldset>
    </>
  );
}

const DESCRICAO_PADRAO = (p: Padrao): string => {
  const guarda = Math.round((1 - GASTO_DA_SOBRA[p]) * 100);
  const humor = FELICIDADE_DO_PADRAO[p];
  const fortuna = GASTO_DO_PATRIMONIO[p] > 0 ? ` Quem tem mais de ${formatarDinheiro(PATRIMONIO_SEM_GASTO)} gasta também ${String(Math.round(GASTO_DO_PATRIMONIO[p] * 1000) / 10).replace('.', ',')}% do que passa disso por ano.` : '';
  return `Guarda ${guarda}% do que sobra no fim do ano${humor < 0 ? '; a felicidade sente' : humor > 0 ? ' e aproveita o resto: a felicidade agradece' : ''}.${fortuna}`;
};

/** Padrão de vida: quanto da sobra de cada ano vira gasto. */
function PadraoDeVida({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const atual = padraoDe(vida);
  return (
    <fieldset class="grupo">
      <legend>Padrão de vida</legend>
      <div class="escolhas-origem">
        {PADROES.map((p) => (
          <button
            type="button"
            class="chip-origem"
            key={p}
            aria-pressed={atual === p}
            disabled={p !== atual && motivoParaNaoOperar(vida, conteudo, { tipo: 'padrao', padrao: p }) !== null}
            onClick={() => p !== atual && aoOperar({ tipo: 'padrao', padrao: p })}
          >
            {capitalizar(NOMES_PADRAO[p].replace(/^de /, ''))}
          </button>
        ))}
      </div>
      <p class="nota">{vida.idade < 18 ? 'Quem decide é a família, até os 18.' : DESCRICAO_PADRAO(atual)}</p>
    </fieldset>
  );
}

/** Dinheiro: o patrimônio, a empresa, os investimentos e o padrão de vida. Nada aqui gasta a ficha do ano. */
export function Dinheiro({ vida, conteudo, aoOperar, aoFechar }: Props) {
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  const eu = vida.entidades['eu']!;
  const conta = Math.max(0, eu.n['dinheiro'] ?? 0);
  const divida = eu.n['divida'] ?? 0;

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-dinheiro" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha dinheiro-folha">
        <h2 id="titulo-dinheiro">Dinheiro</h2>
        <p class="meta">
          Patrimônio <b>{formatarDinheiro(patrimonioTotal(vida))}</b> · na conta {formatarDinheiro(conta)}
          {divida >= 1 ? ` · dívida ${formatarDinheiro(divida)}` : ''}
        </p>
        {vida.idade >= 18 && <Empresa vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        <Investimentos vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        <PadraoDeVida vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
