import { useEffect, useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { bensDe, empresasDe, funcionariosDe, investidoDe, parteNaEmpresa, parteNasEmpresas, patrimonioTotal, titulosDe } from '../motor/campos.ts';
import { motivoParaNaoOperar, NOMES_PADRAO, perfilDe, type Operacao } from '../motor/carteira.ts';
import { ATIVOS, PADROES, PERFIS, RETIRADAS, type Ativo, type Padrao, type Perfil } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { comPreposicao, extrato } from '../motor/contas.ts';
import { contratosDe, emAtraso, limiteDeCredito, modalidadeDe, origemDe } from '../motor/contratos.ts';
import { naMao, propostaDeAcordo, taxaRealDe } from '../motor/dividas.ts';
import { padraoDe } from '../motor/economia.ts';
import { aEmpresa, cargaDaMesa, custoDaAquisicao, liquidoDe, lugarLivre, PRINCIPAL, setoresDeEmpresa, vendaDaParte, vendaDeSubsidiarias, vendaNaEstreia } from '../motor/empresa.ts';
import { comArtigo, custoDaCompra, defDoBem, ehImovel, parcelaDe, taxaDeAluguel } from '../motor/bens.ts';
import { ehDaEmpresa, jogadasDe, type JogadaDisponivel } from '../motor/fortuna.ts';
import { anosParaVencer, chanceDeCalote, cupomDe, precoDoTitulo, taxaDoTitulo, type Prazo } from '../motor/tesouro.ts';
import {
  ANOS_PARA_CADUCAR,
  ANOS_PARA_LEILAO,
  FELICIDADE_DO_PADRAO,
  GASTO_DA_SOBRA,
  GASTO_DO_PATRIMONIO,
  MAX_EMPRESAS,
  PATRIMONIO_SEM_GASTO,
  PRAZO_ACORDO,
  PRAZOS_DO_TITULO,
} from '../motor/regras.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { Entidade, EstadoVida } from '../motor/tipos.ts';
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

/** Abrir uma empresa: o ramo e o capital (a primeira, ou mais uma no grupo). */
function AbrirEmpresa({ vida, conteudo, aoOperar, outra }: Omit<Props, 'aoFechar'> & { outra: boolean }) {
  const setores = setoresDeEmpresa(conteudo);
  const [ramo, setRamo] = useState(() => {
    const atual = vida.entidades['eu']!.t['setor'] ?? '';
    return setores.some((s) => s.id === atual) ? atual : (setores[0]?.id ?? '');
  });
  const [fracao, setFracao] = useState(0.25);
  const valor = Math.floor(liquidoDe(vida) * fracao);
  const op: Operacao = { tipo: 'abrir', setor: ramo, valor };
  const motivo = motivoParaNaoOperar(vida, conteudo, op);
  const def = setores.find((s) => s.id === ramo);
  const risco = (def?.risco ?? 1) >= 1.3 ? 'balança muito' : (def?.risco ?? 1) <= 0.8 ? 'balança pouco' : 'balança na média';
  const crise = (def?.ciclo ?? 1) >= 1.4 ? ' e sofre nas crises' : (def?.ciclo ?? 1) <= 0.5 ? ' e quase não sente as crises' : '';
  return (
    <>
      <p class="nota">
        {outra
          ? 'Mais uma empresa: ela nasce dependendo de você, e o seu talento passa a se dividir entre as que dependem.'
          : 'Ela cresce ou quebra com o ramo, com o país e com o quanto você a toca (o “Trabalhar” do ano). O dinheiro sai da conta e, se faltar, dos investimentos.'}
      </p>
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
    </>
  );
}

const subsidiariasTexto = (n: number): string => (n === 1 ? '1 subsidiária' : `${n.toLocaleString('pt-BR')} subsidiárias`);

/** Uma empresa do grupo: o resumo numa linha; aberta, os números e o que dá para fazer com ela. */
function CartaoDaEmpresa({
  vida,
  conteudo,
  aoOperar,
  emp,
  aberta,
  aoAlternar,
  aoCuidar,
}: Omit<Props, 'aoFechar'> & { emp: Entidade; aberta: boolean; aoAlternar: () => void; aoCuidar: () => void }) {
  const [fracao, setFracao] = useState(0.25);
  /** O que espera confirmação: vender, abrir capital ou fundir com outra (pelo lugar dela). */
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const id = emp.id;
  const principal = id === PRINCIPAL;
  const grupo = empresasDe(vida);
  const n = emp.n;
  const ramoNome = conteudo.setores.get(emp.t['setor'] ?? '')?.nome ?? '';
  const parte = n['participacao'] ?? 1;
  const subs = n['subsidiarias'] ?? 0;
  const naBolsa = Boolean(emp.q['na_bolsa']);
  const linha = `${capitalizar(ramoNome)} · ${formatarDinheiro(n['valor'] ?? 0)} · ${Math.round(parte * 100)}% seu${subs > 0 ? ` · ${subsidiariasTexto(subs)}` : ''}${naBolsa ? ' · na bolsa' : ''}`;
  const cabeca = (
    <button type="button" class="vaga" aria-expanded={aberta} onClick={aoAlternar}>
      <b>
        {emp.nome}
        {principal && grupo.length > 1 ? ' · você cuida desta' : ''}
      </b>
      <small>{linha}</small>
    </button>
  );
  if (!aberta) return cabeca;

  const idade = vida.ano - (emp.nascimento ?? vida.ano);
  const lucro = n['lucro'] ?? 0;
  const valor = Math.floor(liquidoDe(vida) * fracao);
  const aporte: Operacao = { tipo: 'aportar', valor, empresa: id };
  const motivoAporte = motivoParaNaoOperar(vida, conteudo, aporte);
  const venda = vendaDaParte(vida, id);
  const dependencia = n['dependencia'] ?? 0;
  const naEmpresa = principal ? jogadasDe(vida, conteudo).filter((j) => ehDaEmpresa(j.s)) : [];
  const pessoas = funcionariosDe(n['valor'] ?? 0);
  const motivoCompra = motivoParaNaoOperar(vida, conteudo, { tipo: 'adquirir', empresa: id });
  const subsidiarias = vendaDeSubsidiarias(vida, id);
  const motivoBolsa = naBolsa ? null : motivoParaNaoOperar(vida, conteudo, { tipo: 'abrirCapital', empresa: id });
  const outras = grupo.filter((x) => x.id !== id);
  const sobrenome = vida.sobrenome.split(' ').at(-1) ?? vida.sobrenome;
  const operar = (op: Operacao) => {
    setConfirmando(null);
    aoOperar(op);
  };
  const confirmar = (pergunta: string, sim: string, nao: string, op: Operacao) => (
    <div class="confirmar">
      <p>{pergunta}</p>
      <div class="escolhas-origem">
        <button type="button" class="botao" onClick={() => operar(op)}>
          {sim}
        </button>
        <button type="button" class="botao secundario" onClick={() => setConfirmando(null)}>
          {nao}
        </button>
      </div>
    </div>
  );
  return (
    <>
      {cabeca}
      <div class="empresa-cartao">
        <p class="nota">
          {capitalizar(ramoNome)} · {idade === 0 ? 'aberta este ano' : `${anos(idade)} de vida`} · {pessoas === 1 ? 'só você' : `${pessoas.toLocaleString('pt-BR')} pessoas`}
        </p>
        <dl>
          <dt>Vale</dt>
          <dd>{formatarDinheiro(n['valor'] ?? 0)}</dd>
          <dt>Sua parte</dt>
          <dd>
            {Math.round(parte * 100)}% · {formatarDinheiro(parteNaEmpresa(vida, id))}
          </dd>
          {idade > 0 && (
            <>
              <dt>No último ano</dt>
              <dd class={lucro < 0 ? 'ruim' : ''}>{sinalDinheiro(lucro)}</dd>
            </>
          )}
          <dt>Ritmo</dt>
          <dd class={(n['tracao'] ?? 0) < 0 ? 'ruim' : ''}>{porcento(n['tracao'] ?? 0)} ao ano</dd>
          <dt>Depende de você</dt>
          <dd>
            {Math.round(dependencia)}% · {nivelDeDependencia(dependencia)}
          </dd>
          {subs > 0 && (
            <>
              <dt>Subsidiárias</dt>
              <dd>{subs.toLocaleString('pt-BR')}</dd>
            </>
          )}
        </dl>
        <p class="nota">
          {principal
            ? 'É desta que você cuida de perto: o “Trabalhar” do ano e as decisões de quem manda vão para ela.'
            : 'Esta anda com a diretoria; o “Trabalhar” do ano vai para a que você cuida de perto.'}{' '}
          {naBolsa ? 'Na bolsa, o valor anda também com o humor do mercado, e quem compra não desconta o quanto ela depende de você.' : 'Quanto mais ela depende de você, mais o seu talento pesa no ritmo, mais ela trava ao crescer e mais perde se você faltar.'}
        </p>
      </div>
      {naEmpresa.length > 0 && (
        <>
          <p class="nota">
            <b>Quem manda.</b> O que muda o quanto ela depende de você. Não gasta a ficha do ano, e a empresa vai reagir.
          </p>
          <ListaDeJogadas lista={naEmpresa} aoOperar={aoOperar} rotulo="Quem manda na empresa" />
        </>
      )}
      <div class="escolhas-origem" role="group" aria-label="Retirada">
        {RETIRADAS.map((r, i) => (
          <button
            type="button"
            class="chip-origem"
            key={r}
            aria-pressed={Math.abs((n['retirada'] ?? 0) - r) < 1e-9}
            onClick={() => Math.abs((n['retirada'] ?? 0) - r) >= 1e-9 && aoOperar({ tipo: 'retirada', fracao: r, empresa: id })}
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
      <button class="botao secundario" type="button" disabled={motivoCompra !== null} onClick={() => aoOperar({ tipo: 'adquirir', empresa: id })}>
        Comprar uma concorrente ({formatarDinheiro(custoDaAquisicao(vida, id))})
      </button>
      <p class="nota">
        {motivoCompra
          ? `Comprar concorrentes: ${motivoCompra}.`
          : `Ela vira subsidiária, com as subsidiárias que já tinha. ${emp.q['truste'] ? 'Já é um truste: mais compras, mais mercado (e mais olhos do governo).' : `Três compras fazem um truste (${emp.q['aquisicoes']?.v ?? 0} até agora).`}`}
      </p>
      {subsidiarias.vendidas > 0 && (
        <button class="botao secundario" type="button" disabled={vida.pendente !== null} onClick={() => aoOperar({ tipo: 'venderSubsidiaria', empresa: id })}>
          Vender {subsidiarias.vendidas === 1 ? 'uma subsidiária' : `${subsidiarias.vendidas} subsidiárias`} ({formatarDinheiro(subsidiarias.preco)})
        </button>
      )}
      {!naBolsa &&
        (confirmando === 'bolsa' ? (
          confirmar(
            `Levar ${aEmpresa(emp)} para a bolsa? Ela passa a valer mais, você vende um pedaço da sua parte por uns ${formatarDinheiro(vendaNaEstreia(vida, id))} na estreia e ela passa a depender menos de você. O valor passa a andar também com o humor da bolsa.`,
            'Abrir capital',
            'Agora não',
            { tipo: 'abrirCapital', empresa: id },
          )
        ) : (
          <>
            <button class="botao secundario" type="button" disabled={motivoBolsa !== null || vida.pendente !== null} onClick={() => setConfirmando('bolsa')}>
              Abrir o capital
            </button>
            {motivoBolsa && <p class="nota">Bolsa: {motivoBolsa}.</p>}
          </>
        ))}
      {outras.length > 0 && (
        <>
          <p class="nota">
            <b>Fundir.</b> A outra vira subsidiária desta. No mesmo ramo, a fusão corta custos e fecha o mercado; em ramos diferentes, vira o Grupo {sobrenome}, e o mercado desconta conglomerado.
          </p>
          <div class="escolhas-origem" role="group" aria-label="Fundir com">
            {outras.map((x) => (
              <button type="button" class="chip-origem" key={x.id} aria-pressed={confirmando === `fundir:${x.id}`} disabled={vida.pendente !== null} onClick={() => setConfirmando(`fundir:${x.id}`)}>
                Trazer {aEmpresa(x)}
              </button>
            ))}
          </div>
          {outras.map((x) =>
            confirmando === `fundir:${x.id}`
              ? confirmar(`Trazer ${aEmpresa(x)} para dentro ${aEmpresa(emp, 'da')}? Ela deixa de ser uma empresa à parte e vira subsidiária.`, 'Fundir', 'Deixar separadas', {
                  tipo: 'fundir',
                  empresa: id,
                  com: x.id,
                })
              : null,
          )}
        </>
      )}
      {!principal && (
        <button
          class="botao secundario"
          type="button"
          disabled={motivoParaNaoOperar(vida, conteudo, { tipo: 'cuidar', empresa: id }) !== null}
          onClick={() => {
            aoCuidar();
            aoOperar({ tipo: 'cuidar', empresa: id });
          }}
        >
          Cuidar desta de perto
        </button>
      )}
      {confirmando === 'vender' ? (
        confirmar(`Vender a sua parte por ${formatarDinheiro(venda.preco)}${porQueOPreco(venda, venda.preco, parteNaEmpresa(vida, id))}?`, 'Vender', 'Ficar com ela', { tipo: 'vender', empresa: id })
      ) : (
        <button class="botao secundario" type="button" disabled={vida.pendente !== null} onClick={() => setConfirmando('vender')}>
          Vender a empresa
        </button>
      )}
    </>
  );
}

/** As empresas de quem joga: abrir a primeira, ou a árvore do grupo (cada empresa com as subsidiárias dela) e abrir mais uma. */
function Grupo({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const [aberta, setAberta] = useState<string | null>(PRINCIPAL);
  const [abrindo, setAbrindo] = useState(false);
  const empresas = empresasDe(vida);
  // Abriu (ou vendeu, ou fundiu): o formulário de abrir fecha.
  useEffect(() => setAbrindo(false), [empresas.length]);
  if (empresas.length === 0) {
    return (
      <fieldset class="grupo">
        <legend>Empresa</legend>
        <AbrirEmpresa vida={vida} conteudo={conteudo} aoOperar={aoOperar} outra={false} />
      </fieldset>
    );
  }
  const sobrenome = vida.sobrenome.split(' ').at(-1) ?? vida.sobrenome;
  const subs = empresas.reduce((s, x) => s + (x.n['subsidiarias'] ?? 0), 0);
  const carga = cargaDaMesa(vida);
  return (
    <fieldset class="grupo">
      <legend>{empresas.length > 1 ? `Grupo ${sobrenome}` : 'Empresa'}</legend>
      {empresas.length > 1 && (
        <p class="nota">
          {empresas.length} empresas · sua parte {formatarDinheiro(parteNasEmpresas(vida))}
          {subs > 0 ? ` · ${subsidiariasTexto(subs)}` : ''}.
          {carga > 1.05 ? ` A sua mesa está a ${Math.round(carga * 100)}%: com mais de uma empresa dependendo de você, o seu talento se divide entre elas. Delegar libera a mesa.` : ''}
        </p>
      )}
      <ul class="vagas" aria-label="Empresas">
        {empresas.map((emp) => (
          <li key={emp.id}>
            <CartaoDaEmpresa
              vida={vida}
              conteudo={conteudo}
              aoOperar={aoOperar}
              emp={emp}
              aberta={aberta === emp.id}
              aoAlternar={() => setAberta(aberta === emp.id ? null : emp.id)}
              aoCuidar={() => setAberta(PRINCIPAL)}
            />
          </li>
        ))}
      </ul>
      {!lugarLivre(vida) ? (
        <p class="nota">São {MAX_EMPRESAS} empresas, o máximo de uma vez: venda ou junte duas para abrir outra.</p>
      ) : abrindo ? (
        <AbrirEmpresa vida={vida} conteudo={conteudo} aoOperar={aoOperar} outra />
      ) : (
        <button class="botao secundario" type="button" onClick={() => setAbrindo(true)}>
          Abrir outra empresa
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
              <span>{conteudo.mundo.ativos.find((x) => x.id === a)?.nome ?? a}</span>
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

/** "4,7%": a taxa do título, com vírgula. */
function taxaTexto(t: number): string {
  return `${String(t).replace('.', ',')}%`;
}

/** "aos 35, emprestou R$ 100 mil ao governo por 20 anos", ou "veio de herança": de onde veio o título. */
function deOndeVeioOTitulo(vida: EstadoVida, tit: Entidade): string {
  const origem = Number(tit.t['origem']);
  const h = Number.isFinite(origem) ? vida.historico.find((x) => x.id === origem) : undefined;
  if (!h) return '';
  return h.ref === 'tesouro:comprarTitulo' ? `aos ${h.idade}, ${h.resumo ?? 'comprou'}` : 'veio de herança';
}

/**
 * O Tesouro: emprestar ao governo por 5, 10 ou 20 anos, com a taxa de cada prazo à vista; os títulos que você tem (o
 * cupom, o vencimento, o preço de hoje) e vender antes; o risco de calote quando a dívida passa do ponto.
 */
function Tesouro({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const [fracao, setFracao] = useState(0.25);
  const [prazo, setPrazo] = useState<Prazo>(10);
  const eu = vida.entidades['eu']!;
  const conta = Math.max(0, eu.n['dinheiro'] ?? 0);
  const valor = Math.floor(conta * fracao);
  const op: Operacao = { tipo: 'comprarTitulo', valor, prazo };
  const motivo = motivoParaNaoOperar(vida, conteudo, op);
  const titulos = titulosDe(vida);
  const divida = vida.entidades['pais']?.n['divida'] ?? 0;
  const calote = chanceDeCalote(vida);
  return (
    <fieldset class="grupo">
      <legend>Tesouro</legend>
      <p class="nota">
        Emprestar ao governo: o cupom cai na conta todo ano e o dinheiro volta no vencimento. A taxa (acima da inflação, já sem o imposto) fica travada na compra; vender antes é
        pelo preço do dia.
      </p>
      {vida.idade >= 18 ? (
        <>
          <Quanto fracao={fracao} aoMudar={setFracao} rotulo="Quanto emprestar" />
          <div class="escolhas-origem" role="group" aria-label="Por quanto tempo">
            {PRAZOS_DO_TITULO.map((p) => (
              <button type="button" class="chip-origem" key={p} aria-pressed={prazo === p} onClick={() => setPrazo(p)}>
                {p} anos · {taxaTexto(taxaDoTitulo(vida, p))}
              </button>
            ))}
          </div>
          <button class="botao grande" type="button" disabled={motivo !== null} onClick={() => aoOperar(op)}>
            Emprestar {formatarDinheiro(valor)} por {prazo} anos
          </button>
          {motivo && <p class="nota">Agora não: {motivo}.</p>}
        </>
      ) : (
        <p class="nota">Os títulos que vieram de herança ficam com a família até os 18: o cupom cai na sua conta, e vender é decisão de adulto.</p>
      )}
      {calote > 0 ? (
        <p class="nota">
          <span class="atrasada">Risco de calote: {Math.round(calote * 100)}% neste ano.</span> Com a dívida em {Math.round(divida)}% do PIB e a economia mal, o governo pode não pagar tudo: quem
          tem título perde parte do que emprestou.
        </p>
      ) : divida > 90 ? (
        <p class="nota">A dívida passou de 90% do PIB: a taxa já cobra o risco. Acima de 100%, numa recessão, o governo pode dar calote.</p>
      ) : null}
      {titulos.map((tit) => {
        const preco = precoDoTitulo(vida, tit);
        const faltam = anosParaVencer(vida, tit);
        const veio = deOndeVeioOTitulo(vida, tit);
        const vender: Operacao = { tipo: 'venderTitulo', id: tit.id };
        return (
          <div class="bem-meu" key={tit.id}>
            <p>
              <b>{tit.nome}</b> · {formatarDinheiro(tit.n['valor'] ?? 0)} · IPCA + {taxaTexto(tit.n['taxa'] ?? 0)} · cupom de {formatarDinheiro(cupomDe(tit))} por ano
            </p>
            <p class="nota">
              Vence {faltam === 0 ? 'neste ano' : faltam === 1 ? 'no ano que vem' : `daqui a ${faltam} anos`} · hoje vale {formatarDinheiro(preco)}
              {veio ? ` · ${veio}` : ''}
            </p>
            <div class="escolhas-origem">
              <button type="button" class="chip-origem" disabled={motivoParaNaoOperar(vida, conteudo, vender) !== null} onClick={() => aoOperar(vender)}>
                Vender por {formatarDinheiro(preco)}
              </button>
            </div>
          </div>
        );
      })}
    </fieldset>
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
/** Por quanto o bem foi comprado nesta vida (a última compra no livro-razão), ou undefined se veio de herança. */
function precoDeCompra(vida: EstadoVida, id: string): number | undefined {
  for (let i = vida.historico.length - 1; i >= 0; i--) {
    const h = vida.historico[i]!;
    if (h.ref !== 'bens:comprar') continue;
    const m = h.mudancas?.find((x) => x.c === `${id}.valor` && (x.d ?? 0) > 0);
    if (m) return m.d;
  }
  return undefined;
}

/** "comprou por R$ 420 mil, hoje +18%". */
function desdeACompra(vida: EstadoVida, id: string, valor: number): string {
  const compra = precoDeCompra(vida, id);
  if (!compra) return '';
  const pct = Math.round((valor / compra - 1) * 100);
  return ` · comprou por ${formatarDinheiro(compra)}${pct === 0 ? '' : `, ${pct > 0 ? '+' : ''}${pct}%`}`;
}

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
              {desdeACompra(vida, b.id, valor)}
              {deve >= 1 ? ` (faltam ${formatarDinheiro(deve)})` : ''}
              {mora ? ' · você mora aqui' : alugado ? ` · alugado, rende ${formatarDinheiro((valor * taxaDeAluguel(d)) / 12)}/mês` : ''}
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

/** O que só dá para fazer com muito dinheiro: aparece quando a fortuna permite, da jogada mais barata à mais cara. */
/** "Tudo passa por você", "bastante", "pouco", "anda sozinha". */
function nivelDeDependencia(d: number): string {
  return d >= 70 ? 'tudo passa por você' : d >= 40 ? 'bastante' : d >= 15 ? 'pouco' : 'anda sozinha';
}

/** Por que o preço da venda não é o valor: a fase do país e o desconto da dependência. */
function porQueOPreco(venda: { fase: number; desconto: number }, preco: number, vale: number): string {
  if (Math.abs(preco - vale) < 1) return '';
  const razoes = [
    venda.fase < 0.999 ? 'o país está mal' : venda.fase > 1.001 ? 'o país está aquecido' : '',
    venda.desconto >= 0.01 ? `quem compra desconta ${Math.round(venda.desconto * 100)}% porque ela depende de você` : '',
  ].filter(Boolean);
  return ` (ela vale ${formatarDinheiro(vale)}: ${razoes.join('; ')})`;
}

/** O custo de uma opção de jogada: da conta, da empresa ou nenhum. */
function custoDaOpcao(j: JogadaDisponivel, i: number): string {
  const custo = j.custos[i] ?? 0;
  const daEmpresa = j.daEmpresa[i] ?? 0;
  if (custo > 0) return formatarDinheiro(custo);
  if (daEmpresa > 0) return `${formatarDinheiro(daEmpresa)} da empresa`;
  return 'sem custo em dinheiro';
}

/** Jogadas abertas uma a uma: o texto e as opções com o custo e o motivo do bloqueio. */
function ListaDeJogadas({ lista, aoOperar, rotulo }: { lista: JogadaDisponivel[]; aoOperar: Props['aoOperar']; rotulo: string }) {
  const [aberta, setAberta] = useState<string | null>(null);
  return (
    <ul class="vagas" aria-label={rotulo}>
      {lista.map((j) => (
          <li key={j.s.id}>
          <button type="button" class="vaga" aria-expanded={aberta === j.s.id} onClick={() => setAberta(aberta === j.s.id ? null : j.s.id)}>
            <b>{j.s.rotulo}</b>
            <small>{j.preco > 0 ? `a partir de ${formatarDinheiro(j.preco)}` : j.daEmpresa.some((x) => x > 0) ? 'pago pela empresa' : 'sem custo em dinheiro'}</small>
          </button>
          {aberta === j.s.id && (
            <div class="confirmar">
              <p>{j.texto}</p>
              <div class="opcoes">
                {j.opcoes.map((o, i) => (
                  <button class="opcao" type="button" key={i} disabled={!o.disponivel} onClick={() => aoOperar({ tipo: 'jogada', id: j.s.id, escolha: i })}>
                    {o.texto}
                    <small>
                      {custoDaOpcao(j, i)}
                      {o.motivo ? ` · ${o.motivo}` : ''}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** De quem veio e para quem foi o dinheiro: o extrato do ano (ou da vida), lido do livro. */
function Extrato({ vida }: { vida: EstadoVida }) {
  const [quando, setQuando] = useState<'ano' | 'vida'>('ano');
  const x = extrato(vida, quando === 'ano' ? vida.ano : undefined);
  if (vida.idade < 14 && x.linhas.length === 0) return null;
  return (
    <fieldset class="grupo">
      <legend>Extrato</legend>
      <div class="escolhas-origem" role="group" aria-label="Período do extrato">
        <button type="button" class="chip-origem" aria-pressed={quando === 'ano'} onClick={() => setQuando('ano')}>
          Este ano
        </button>
        <button type="button" class="chip-origem" aria-pressed={quando === 'vida'} onClick={() => setQuando('vida')}>
          A vida toda
        </button>
      </div>
      <p class="nota">
        De quem veio e para quem foi cada real{quando === 'ano' ? ` em ${vida.ano}` : ''}: entrou {formatarDinheiro(x.entrou)} e saiu {formatarDinheiro(x.saiu)}
        {Math.abs(x.reavaliacao) >= 1 ? `; a inflação e a cotação mudaram ${sinalDinheiro(x.reavaliacao)}, sem dinheiro trocar de mão` : ''}.
      </p>
      {x.linhas.length > 0 ? (
        <ul class="carteira" aria-label="Extrato">
          {x.linhas.slice(0, 12).map((l) => (
            <li key={`${l.rotulo}|${l.contraparte}`}>
              <span>{l.rotulo}</span>
              <b>{sinalDinheiro(l.valor)}</b>
              <span class={`ret ${l.valor < 0 ? 'ruim' : ''}`}>
                {l.contraparte === 'reavaliacao' ? 'preço que mudou: ninguém pagou' : comPreposicao(vida, l.contraparte, l.valor >= 0 ? 'de' : 'para')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p class="nota">Nada entrou nem saiu {quando === 'ano' ? 'neste ano' : 'ainda'}.</p>
      )}
    </fieldset>
  );
}

/** "aos 27, casou numa festa parcelada": de onde veio a dívida (a entrada do livro que a fez). */
function deOndeVeio(vida: EstadoVida, ct: Entidade): string {
  const origem = origemDe(ct);
  const h = origem === null ? undefined : vida.historico.find((x) => x.id === origem);
  const resumo = h?.escolha?.resumo ?? h?.resumo;
  return h && resumo ? `aos ${h.idade}, ${resumo}` : '';
}

/** A situação de uma dívida: em dia, ou quanto falta para caducar (ou para o leilão). */
function situacao(ct: Entidade): string {
  const atraso = ct.n['atraso'] ?? 0;
  if (!emAtraso(ct)) return 'em dia';
  if (modalidadeDe(ct) === 'financiamento') return ANOS_PARA_LEILAO - atraso <= 1 ? 'parcela atrasada: mais um ano assim e vai a leilão' : `parcela atrasada há ${anos(atraso)}`;
  const falta = ANOS_PARA_CADUCAR - atraso;
  return `atrasada há ${anos(atraso)}; caduca em ${anos(falta)}`;
}

/** As dívidas: cada contrato com o banco (de onde veio, o saldo, o juro, a parcela e o atraso), pagar e renegociar. */
function Dividas({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const eu = vida.entidades['eu']!;
  const contratos = contratosDe(vida);
  const sujo = Boolean(eu.q['nome_sujo']);
  if (contratos.length === 0 && !sujo) return null;
  const mao = naMao(vida);
  const renegociar: Operacao = { tipo: 'renegociar' };
  const proposta = motivoParaNaoOperar(vida, conteudo, renegociar) === null ? propostaDeAcordo(vida) : null;
  return (
    <fieldset class="grupo">
      <legend>Dívidas</legend>
      <p class="nota">
        {sujo ? 'Nome sujo: o banco não empresta mais nem financia enquanto houver dívida atrasada. ' : ''}O cheque especial e os empréstimos cabem até{' '}
        {formatarDinheiro(limiteDeCredito(eu.n['renda'] ?? 0))}; o que passar disso no fim do ano atrasa. Dívida atrasada há {anos(ANOS_PARA_CADUCAR)} caduca.
      </p>
      {contratos.map((ct) => {
        const saldo = ct.n['saldo'] ?? 0;
        const parcela = ct.n['parcela'] ?? 0;
        const veio = deOndeVeio(vida, ct);
        const quitar: Operacao = { tipo: 'quitar', id: ct.id };
        const motivo = motivoParaNaoOperar(vida, conteudo, quitar);
        return (
          <div class="bem-meu" key={ct.id}>
            <p>
              <b>{ct.nome}</b> · {formatarDinheiro(saldo)} · juro de {porcento(taxaRealDe(vida, conteudo, ct) * 100).replace('+', '')} ao ano acima da inflação
              {parcela >= 1 ? ` · parcela de ${formatarDinheiro(parcela / 12)}/mês` : ''}
            </p>
            <p class="nota">
              <span class={emAtraso(ct) ? 'atrasada' : ''}>{capitalizar(situacao(ct))}</span>
              {veio ? ` · ${veio}` : ''}
            </p>
            <div class="escolhas-origem">
              <button type="button" class="chip-origem" disabled={motivo !== null} onClick={() => aoOperar(quitar)}>
                {mao < 1 ? 'Sem dinheiro para pagar' : mao >= saldo ? `Quitar (${formatarDinheiro(saldo)})` : `Pagar ${formatarDinheiro(mao)}`}
              </button>
            </div>
          </div>
        );
      })}
      {proposta && (
        <div class="confirmar">
          <p>
            O banco aceita <b>{formatarDinheiro(proposta.depois)}</b> pelos {formatarDinheiro(proposta.antes)} que você deve, em {PRAZO_ACORDO} parcelas de{' '}
            {formatarDinheiro(proposta.parcela)} por ano. O nome limpa se nada mais atrasar; se a parcela não couber, o acordo quebra.
          </p>
          <button type="button" class="botao" onClick={() => aoOperar(renegociar)}>
            Renegociar
          </button>
        </div>
      )}
    </fieldset>
  );
}

function BrincarDeDeus({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const lista = jogadasDe(vida, conteudo).filter((j) => !ehDaEmpresa(j.s));
  if (lista.length === 0) return null;
  return (
    <fieldset class="grupo">
      <legend>Brincar de deus</legend>
      <p class="nota">O que só dá para fazer com muito dinheiro. Não gasta a ficha do ano, e o mundo vai reagir.</p>
      <ListaDeJogadas lista={lista} aoOperar={aoOperar} rotulo="Jogadas" />
    </fieldset>
  );
}

export function Dinheiro({ vida, conteudo, aoOperar, aoFechar }: Props) {

  const eu = vida.entidades['eu']!;
  const conta = Math.max(0, eu.n['dinheiro'] ?? 0);
  const divida = eu.n['divida'] ?? 0;

  return (
    <Folha id="titulo-dinheiro" titulo="Dinheiro" classe="dinheiro-folha" aoFechar={aoFechar}>
        <p class="meta">
          Patrimônio <b>{formatarDinheiro(patrimonioTotal(vida))}</b> · na conta {formatarDinheiro(conta)}
          {divida >= 1 ? ` · dívida ${formatarDinheiro(divida)}` : ''}
          {eu.q['nome_sujo'] ? ' · nome sujo' : ''}
        </p>
        <Extrato vida={vida} />
        <Dividas vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        {vida.idade >= 18 && <BrincarDeDeus vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        {vida.idade >= 18 && <Grupo vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        {vida.idade >= 18 && <Bens vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        <Investimentos vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        {(vida.idade >= 18 || titulosDe(vida).length > 0) && <Tesouro vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        <PadraoDeVida vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
    </Folha>
  );
}
