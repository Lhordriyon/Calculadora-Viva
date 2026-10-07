import { useEffect, useState } from 'preact/hooks';
import { bensDe, funcionariosDe, investidoDe, parteNaEmpresa, patrimonioTotal } from '../motor/campos.ts';
import { motivoParaNaoOperar, NOMES_PADRAO, perfilDe, type Operacao } from '../motor/carteira.ts';
import { ATIVOS, PADROES, PERFIS, RETIRADAS, type Ativo, type Padrao, type Perfil } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { padraoDe } from '../motor/economia.ts';
import { custoDaAquisicao, empresaDe, liquidoDe, precoDaParte, setoresDeEmpresa } from '../motor/empresa.ts';
import { comArtigo, custoDaCompra, defDoBem, ehImovel, parcelaDe, taxaDeAluguel } from '../motor/bens.ts';
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
  const motivoCompra = motivoParaNaoOperar(vida, conteudo, { tipo: 'adquirir' });
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
      <button class="botao secundario" type="button" disabled={motivoCompra !== null} onClick={() => aoOperar({ tipo: 'adquirir' })}>
        Comprar uma concorrente ({formatarDinheiro(custoDaAquisicao(vida))})
      </button>
      <p class="nota">
        {motivoCompra
          ? `Comprar concorrentes: ${motivoCompra}.`
          : `${emp.q['truste'] ? 'Já é um truste: mais compras, mais mercado (e mais olhos do governo).' : `Três compras fazem um truste (${emp.q['aquisicoes']?.v ?? 0} até agora).`}`}
      </p>
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
const CATEGORIAS = [
  { id: 'moradia', nome: 'Morar' },
  { id: 'imovel', nome: 'Renda' },
  { id: 'lazer', nome: 'Lazer' },
  { id: 'veiculo', nome: 'Veículos' },
  { id: 'luxo', nome: 'Luxo' },
  { id: 'midia', nome: 'Mídia' },
] as const;

/** Imóveis e bens: o que você tem (morar, alugar, vender) e a loja (à vista ou financiado). */
function Bens({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const [categoria, setCategoria] = useState<(typeof CATEGORIAS)[number]['id']>('moradia');
  const [item, setItem] = useState<string | null>(null);
  const [vendendo, setVendendo] = useState<string | null>(null);
  const meus = bensDe(vida);
  const loja = conteudo.mundo.bens.filter((b) => b.categoria === categoria);
  const def = conteudo.mundo.bens.find((b) => b.id === item);
  const aVista: Operacao | null = def ? { tipo: 'comprar', item: def.id } : null;
  const financiado: Operacao | null = def?.financiavel ? { tipo: 'comprar', item: def.id, financiar: true } : null;
  const motivoVista = aVista ? motivoParaNaoOperar(vida, conteudo, aVista) : null;
  const motivoFin = financiado ? motivoParaNaoOperar(vida, conteudo, financiado) : null;

  return (
    <fieldset class="grupo">
      <legend>Imóveis e bens</legend>
      {meus.length === 0 && <p class="nota">Nada no seu nome ainda. Casa própria corta o aluguel; imóvel alugado paga todo mês; iate, jatinho e jornal dão influência.</p>}
      {meus.map((b) => {
        const d = defDoBem(conteudo, b);
        if (!d) return null;
        const valor = b.n['valor'] ?? 0;
        const deve = b.n['financiado'] ?? 0;
        const mora = Boolean(b.q['moradia']);
        const alugado = Boolean(b.q['alugado']);
        return (
          <div class="bem-meu" key={b.id}>
            <p>
              <b>{d.nome}</b> · {formatarDinheiro(valor)}
              {deve >= 1 ? ` (faltam ${formatarDinheiro(deve)})` : ''}
              {mora ? ' · você mora aqui' : alugado ? ` · alugado, ${formatarDinheiro((valor * taxaDeAluguel(d)) / 12)}/mês` : ''}
            </p>
            {vendendo === b.id ? (
              <div class="escolhas-origem">
                <button type="button" class="botao" onClick={() => aoOperar({ tipo: 'venderBem', id: b.id })}>
                  Vender por {formatarDinheiro(valor * (ehImovel(d) ? 0.94 : 1))}
                </button>
                <button type="button" class="botao secundario" onClick={() => setVendendo(null)}>
                  Ficar
                </button>
              </div>
            ) : (
              <div class="escolhas-origem">
                {d.categoria === 'moradia' && !mora && (
                  <button type="button" class="chip-origem" onClick={() => aoOperar({ tipo: 'morar', id: b.id })}>
                    Morar aqui
                  </button>
                )}
                {taxaDeAluguel(d) > 0 && !mora && (
                  <button type="button" class="chip-origem" aria-pressed={alugado} onClick={() => aoOperar({ tipo: 'alugar', id: b.id, alugar: !alugado })}>
                    {alugado ? 'Parar de alugar' : 'Alugar'}
                  </button>
                )}
                <button type="button" class="chip-origem" onClick={() => setVendendo(b.id)}>
                  Vender
                </button>
              </div>
            )}
          </div>
        );
      })}
      <div class="escolhas-origem" role="group" aria-label="Loja">
        {CATEGORIAS.map((k) => (
          <button
            type="button"
            class="chip-origem"
            key={k.id}
            aria-pressed={categoria === k.id}
            onClick={() => {
              setCategoria(k.id);
              setItem(null);
            }}
          >
            {k.nome}
          </button>
        ))}
      </div>
      {def && (
        <div class="confirmar">
          <p>
            <b>{capitalizar(comArtigo(def))}</b> por {formatarDinheiro(def.preco)}. {def.descricao}
            {def.manutencao > 0 ? ` Manutenção: ${formatarDinheiro((def.preco * def.manutencao) / 12)}/mês.` : ''}
          </p>
          <div class="escolhas-origem">
            <button type="button" class="botao" disabled={motivoVista !== null} onClick={() => aVista && aoOperar(aVista)}>
              Comprar à vista
            </button>
            {financiado && (
              <button type="button" class="botao secundario" disabled={motivoFin !== null} onClick={() => aoOperar(financiado)}>
                Financiar ({formatarDinheiro(custoDaCompra(def, true))} de entrada, {formatarDinheiro(parcelaDe(def) / 12)}/mês)
              </button>
            )}
          </div>
          {(motivoVista || motivoFin) && <p class="nota">Agora não: {[motivoVista, financiado ? motivoFin : null].filter(Boolean).join('; ')}.</p>}
        </div>
      )}
      <ul class="vagas" aria-label="Loja">
        {loja.map((b) => (
          <li key={b.id}>
            <button type="button" class="vaga" aria-pressed={item === b.id} onClick={() => setItem(b.id)}>
              <b>{capitalizar(b.nome)}</b>
              <small>
                {formatarDinheiro(b.preco)}
                {b.conforto > 0 ? ` · +${b.conforto} conforto` : ''}
                {b.status > 0 ? ` · +${b.status} influência` : ''}
                {b.aluguel ? ` · rende ${Math.round(b.aluguel * 100)}% ao ano` : ''}
              </small>
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

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
        {vida.idade >= 18 && <Bens vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
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
