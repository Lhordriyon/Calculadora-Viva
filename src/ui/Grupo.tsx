/**
 * O grupo em camadas (missão Capitalismo vivo, I-165): dentro da folha Dinheiro, o que antes era uma lista de empresas
 * ganha a estrutura (a holding, quem é dona de quem e com quanto, a demonstração consolidada e o peso no PIB) e, em cada
 * empresa, as unidades (onde ela trabalha), o mercado (as concorrentes de verdade e a parte de cada uma), o produto e a
 * mídia, e a governança (quem decide o dia a dia). Cada botão é uma operação do motor (carteira.ts), com o motivo à vista
 * quando não dá.
 */
import { CRIVO, honorarioDaDupla, NOMES_DA_DUPLA, QUALIDADE_DA_DUPLA, sobADupla } from '../motor/valor.ts';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { donaDe, empresaDoRegistro, empresasDe, parteEfetiva, refDaEmpresa } from '../motor/campos.ts';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import { concorrentesNoSetor, partesDoMercado } from '../motor/concorrentes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { analiseDoCade, consolidada, contasNacionais } from '../motor/demonstracoes.ts';
import { aEmpresa, custoDaAquisicao, FRACAO_DA_COMPRA, lugarLivre, setoresDeEmpresa } from '../motor/empresa.ts';
import { AUTONOMIAS, autonomiaDe, ceoDe, jogadasDoConselho, MANDATOS, mandatoDe, NOME_DA_AUTONOMIA, O_QUE_DECIDE, O_QUE_O_MANDATO_FAZ, type Autonomia, type Mandato } from '../motor/governanca.ts';
import { CAPITAL_MINIMO_HOLDING } from '../motor/grupo.ts';
import { atratividade, audienciaDe, alcanceDaCampanha, custoDoLancamento, idadeDoProduto, midiasDoGrupo, SETOR_DA_MIDIA, velhiceDoProduto } from '../motor/negocio.ts';
import { UNIDADES } from '../motor/regras.ts';
import { defDoPais, fatiasDoGrupo, grupoNoMundo, maioresEmpresasDoPais, maisRicosDoPais, paisDaEmpresa } from '../motor/mundo-das-empresas.ts';
import { PARCEIROS, type Parceiro } from '../motor/constantes.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { Entidade, EstadoVida } from '../motor/tipos.ts';
import { cidadeDaSede, contaDaUnidade, deApoioDe, ehDeApoio, formaQueProduz, nomeDaUnidade, porteDoApoioNovo, precoDaUnidade, unidadesDe } from '../motor/unidades.ts';
import { economiaDo, empregosDe } from '../motor/negocio.ts';
import { VALOR_DE_VENDA_DOS_ATIVOS } from '../motor/regras.ts';

interface Base {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
}

const pct = (v: number, casas = 1): string => `${(v * 100).toFixed(casas).replace('.', ',')}%`;

/** Um botão de operação: desabilitado com o motivo à vista. */
function Acao({ vida, conteudo, aoOperar, op, children, secundario = true, explica }: Base & { op: Operacao; children: ComponentChildren; secundario?: boolean; explica?: string }) {
  const motivo = motivoParaNaoOperar(vida, conteudo, op);
  return (
    <>
      <button class={secundario ? 'botao secundario' : 'botao'} type="button" disabled={motivo !== null} onClick={() => aoOperar(op)}>
        {children}
      </button>
      {explica && <p class="nota explica">{explica}</p>}
      {motivo && <p class="nota">Agora não: {motivo}.</p>}
    </>
  );
}

/**
 * A dupla do valor (valor.ts, I-179): contratar pela holding, ver o que ela fez no último ano e dispensar. Os nomes
 * são fictícios, como todo personagem do jogo.
 */
function DuplaDoValor({ vida, conteudo, aoOperar, h }: Base & { h: Entidade }) {
  const contratada = Boolean(h.q[QUALIDADE_DA_DUPLA]);
  const ultimo = contratada ? vida.historico.filter((x) => x.ref === 'valor:decidiu').at(-1) : undefined;
  return (
    <>
      <p class="nota">
        <b>A dupla do valor.</b>{' '}
        {contratada
          ? `${NOMES_DA_DUPLA} dirigem o grupo pelo investimento em valor, acima das diretorias: o caixa sobe para a holding, dívida não existe, e cada diretoria pede a eles antes de construir, abrir filial ou comprar.`
          : `${NOMES_DA_DUPLA} investem pelo valor há quarenta anos e aceitam dirigir a holding, acima de todas as diretorias.`}
      </p>
      {ultimo && <p class="nota explica">No último ano: {ultimo.texto.replace(/^A dupla do valor, [^,]+, que dirige [^,]+, /, '')}</p>}
      {contratada ? (
        <Acao vida={vida} conteudo={conteudo} aoOperar={aoOperar} op={{ tipo: 'dupla', holding: h.id, contratar: false }} explica="As diretorias voltam a decidir sozinhas, cada uma com a autonomia que tem, e o caixa volta a ficar em cada empresa.">
          Dispensar a dupla do valor
        </Acao>
      ) : (
        <Acao
          vida={vida}
          conteudo={conteudo}
          aoOperar={aoOperar}
          op={{ tipo: 'dupla', holding: h.id, contratar: true }}
          explica={`Por ${formatarDinheiro(honorarioDaDupla(vida, h))} por ano, eles trazem para a holding o caixa que passa de três meses de custos, põem o dinheiro onde ele rende 15% ou mais, quitam a dívida, vendem o negócio que queima dinheiro e só deixam comprar a concorrente com margem de segurança (até 85% do justo).`}
        >
          Contratar a dupla do valor
        </Acao>
      )}
    </>
  );
}

/** "12.345.678" ou "12345678" → 12345678; vazio ou inválido, 0. */
function lerValor(texto: string): number {
  const n = Number(texto.replace(/\D/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Mover caixa (I-175): da empresa (a holding, em geral) para a sua conta, para uma controlada ou para a controladora,
 * no valor que você digitar ou pelos atalhos; o botão diz o que acontece com os sócios.
 */
function MoverCaixa({ vida, conteudo, aoOperar, de }: Base & { de: Entidade }) {
  const caixa = Math.max(0, Math.floor(de.n['caixa'] ?? 0));
  const mae = donaDe(de)[0] === '#' ? empresaDoRegistro(vida, donaDe(de)) : undefined;
  const filhas = empresasDe(vida).filter((x) => donaDe(x) === refDaEmpresa(de));
  const destinos: { id: string; nome: string }[] = [
    ...(donaDe(de) === 'eu' ? [{ id: 'eu', nome: 'a sua conta' }] : []),
    ...(mae ? [{ id: mae.id, nome: `${aEmpresa(mae)} (a controladora)` }] : []),
    ...filhas.map((x) => ({ id: x.id, nome: aEmpresa(x) })),
  ];
  const [para, setPara] = useState(destinos[0]?.id ?? '');
  const [texto, setTexto] = useState('');
  if (destinos.length === 0 || caixa < 1) return null;
  const destino = destinos.find((d) => d.id === para) ?? destinos[0]!;
  const valor = lerValor(texto);
  const sobe = destino.id === 'eu' || destino.id === mae?.id;
  const socios = (de.n['participacao'] ?? 1) < 1 || (de.n['participacao_socia'] ?? 0) > 0;
  const explica = sobe
    ? `O dinheiro sai do caixa ${aEmpresa(de, 'da')} e vai para ${destino.nome}, como dividendo extraordinário${socios ? '; os outros sócios recebem a parte deles' : ''}. ${aEmpresa(de, 'A')} fica com menos para obras e para a crise.`
    : `O dinheiro sai do caixa ${aEmpresa(de, 'da')} e entra no ${aEmpresa(vida.entidades[destino.id] ?? de, 'da')}: serve para obra, crise ou dívida. Se ela tiver outros sócios, a parte da controladora cresce.`;
  return (
    <>
      <p class="nota">
        <b>Mover caixa.</b> {aEmpresa(de, 'A')} tem {formatarDinheiro(caixa)} em caixa.
      </p>
      <label class="nota rotulo-campo">
        Para
        <select class="campo" value={destino.id} onChange={(ev) => setPara((ev.target as HTMLSelectElement).value)}>
          {destinos.map((d) => (
            <option key={d.id} value={d.id}>
              {capitalizar(d.nome)}
            </option>
          ))}
        </select>
      </label>
      <label class="nota rotulo-campo">
        Quanto, em reais
        <input class="campo" type="text" inputMode="numeric" placeholder="0" value={texto ? valor.toLocaleString('pt-BR') : ''} onInput={(ev) => setTexto((ev.target as HTMLInputElement).value)} />
      </label>
      <div class="escolhas-origem" role="group" aria-label="Quanto mover">
        {[
          ['Um décimo', 0.1],
          ['A metade', 0.5],
          ['Tudo', 1],
        ].map(([r, f]) => (
          <button type="button" class="chip-origem" key={String(r)} aria-pressed={valor === Math.floor(caixa * Number(f))} onClick={() => setTexto(String(Math.floor(caixa * Number(f))))}>
            {r}
          </button>
        ))}
      </div>
      <Acao vida={vida} conteudo={conteudo} aoOperar={(op) => (setTexto(''), aoOperar(op))} op={{ tipo: 'transferirCaixa', de: de.id, para: destino.id, valor }} explica={explica}>
        {valor >= 1 ? `Mover ${formatarDinheiro(valor)} para ${destino.nome}` : `Digite quanto mover para ${destino.nome}`}
      </Acao>
    </>
  );
}

/** Quem é dona da empresa, em palavras: você, outra empresa do grupo (com a parte), uma pessoa ou o mercado. */
function donaEmPalavras(vida: EstadoVida, emp: Entidade): string {
  const d = donaDe(emp);
  const parte = pct(emp.n['participacao'] ?? 1, 0);
  if (d === 'eu') return `${parte} seus`;
  if (d[0] === '#') {
    const mae = empresaDoRegistro(vida, d);
    return mae ? `${parte} ${aEmpresa(mae, 'da')}` : parte;
  }
  return d === 'mercado' ? 'capital no mercado' : parte;
}

// ---------------------------------------------------------------- a estrutura do grupo

/** A estrutura: a árvore de quem é dona de quem, a consolidada do último ano, o peso no PIB e as decisões de estrutura. */
export function EstruturaDoGrupo({ vida, conteudo, aoOperar }: Base) {
  const [aberta, setAberta] = useState(false);
  const empresas = empresasDe(vida);
  if (empresas.length === 0) return null;
  const holdings = empresas.filter((x) => x.q['holding']);
  const g = consolidada(vida);
  const pib = contasNacionais(vida, conteudo);
  const temSubsidiaria = empresas.some((x) => donaDe(x)[0] === '#');
  // As de cima primeiro, e cada uma seguida das que ela controla.
  const ordem: { emp: Entidade; nivel: number }[] = [];
  const visitar = (x: Entidade, nivel: number): void => {
    if (ordem.some((o) => o.emp.id === x.id)) return;
    ordem.push({ emp: x, nivel });
    for (const f of empresas) if (donaDe(f) === `#${x.registro ?? 0}`) visitar(f, nivel + 1);
  };
  for (const x of empresas) if (donaDe(x)[0] !== '#' || !empresas.some((m) => `#${m.registro}` === donaDe(x))) visitar(x, 0);
  return (
    <div class="empresa-cartao">
      <button type="button" class="vaga" aria-expanded={aberta} onClick={() => setAberta(!aberta)}>
        <b>A estrutura do grupo</b>
        <small>
          {holdings.length > 0 ? `${holdings.length === 1 ? 'uma holding' : `${holdings.length} holdings`} · ` : ''}
          {empresas.length === 1 ? 'uma empresa' : `${empresas.length} empresas`} · {pct(pib.pesoNoPib / 100, pib.pesoNoPib < 0.01 ? 4 : 2)} do PIB
        </small>
      </button>
      {aberta && (
        <>
          <ul class="arvore" aria-label="Quem é dona de quem">
            {ordem.map(({ emp, nivel }) => (
              <li key={emp.id} style={{ paddingLeft: `${nivel * 1.2}em` }}>
                <b>{emp.nome}</b>
                <small>
                  {emp.q['holding'] ? 'holding · ' : `${capitalizar(conteudo.setores.get(emp.t['setor'] ?? '')?.nome ?? '')}${paisDaEmpresa(emp) ? ` ${defDoPais(conteudo, paisDaEmpresa(emp))?.genero === 'f' ? 'na' : 'no'} ${nomeDoPais(conteudo, paisDaEmpresa(emp)!)}` : ''} · `}
                  {donaEmPalavras(vida, emp)} · sua parte {pct(parteEfetiva(vida, emp), 0)}
                </small>
              </li>
            ))}
          </ul>
          {vida.historico.some((h) => h.ref === 'ano') && (
            <dl>
              <dt>Receita do grupo</dt>
              <dd>
                {formatarDinheiro(g.receita)}
                {g.receitaInterna + g.dividendosInternos >= 1 && <small>sem {formatarDinheiro(g.receitaInterna + g.dividendosInternos)} que uma empresa do grupo pagou a outra</small>}
              </dd>
              <dt>Lucro do grupo</dt>
              <dd class={g.lucro < 0 ? 'ruim' : ''}>
                {formatarDinheiro(g.lucro)}
                {Math.abs(g.lucroDosMinoritarios) >= 1 && <small>seu: {formatarDinheiro(g.lucroDeQuemJoga)} · dos outros sócios: {formatarDinheiro(g.lucroDosMinoritarios)}</small>}
              </dd>
              <dt>Caixa e dívida</dt>
              <dd>
                {formatarDinheiro(g.caixa)} no caixa · {formatarDinheiro(g.divida)} no banco
              </dd>
              <dt>No PIB</dt>
              <dd>
                {pct(pib.pesoNoPib / 100, pib.pesoNoPib < 0.01 ? 4 : 2)} pelo valor adicionado
                <small>
                  o que o grupo vendeu menos o que comprou de outras empresas; a receita sozinha seria {pct(pib.receitaSobrePib / 100, pib.receitaSobrePib < 0.01 ? 4 : 2)}
                </small>
              </dd>
            </dl>
          )}
          <NoMundo vida={vida} conteudo={conteudo} />
          <EstruturaDecisoes vida={vida} conteudo={conteudo} aoOperar={aoOperar} temSubsidiaria={temSubsidiaria} />
          <AbrirFilial vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        </>
      )}
    </div>
  );
}

/** As decisões de estrutura: criar a holding, pôr uma empresa nela, fundar uma subsidiária e vender parte de uma. */
function EstruturaDecisoes({ vida, conteudo, aoOperar, temSubsidiaria }: Base & { temSubsidiaria: boolean }) {
  const empresas = empresasDe(vida);
  const holdings = empresas.filter((x) => x.q['holding']);
  const diretas = empresas.filter((x) => !x.q['holding'] && donaDe(x) === 'eu');
  const [setor, setSetor] = useState(setoresDeEmpresa(conteudo)[0]?.id ?? 'comercio');
  const base = { vida, conteudo, aoOperar };
  const capitalDaHolding = Math.max(CAPITAL_MINIMO_HOLDING, Math.round(((vida.entidades['eu']?.n['dinheiro'] ?? 0) * 0.3) / 1000) * 1000);
  return (
    <>
      {holdings.length === 0 ? (
        <>
          <p class="nota">
            <b>A holding.</b> Uma empresa que não produz: guarda as participações, recebe os dividendos das outras e paga uma estrutura pequena. As empresas dentro dela continuam pessoas jurídicas separadas.
          </p>
          <Acao {...base} op={{ tipo: 'criarHolding', valor: capitalDaHolding }} explica="Abre uma empresa que não vende nada e é dona das outras: o lucro delas sobe para ela, e você decide quanto sobe para a sua conta.">
            Criar a holding com {formatarDinheiro(capitalDaHolding)}
          </Acao>
        </>
      ) : (
        holdings.map((h) => (
          <div key={h.id}>
            <p class="nota">
              <b>{h.nome}.</b> Caixa de {formatarDinheiro(h.n['caixa'] ?? 0)} para fundar subsidiárias e pôr dinheiro nelas.
            </p>
            {diretas.slice(0, 3).map((x) => (
              <Acao key={x.id} {...base} op={{ tipo: 'paraAHolding', empresa: x.id, holding: h.id }} explica={`A sua parte ${aEmpresa(x, 'da')} passa a ser da holding: o lucro dela sobe para a holding, e não mais direto para você.`}>
                Pôr {aEmpresa(x)} dentro {aEmpresa(h, 'da')}
              </Acao>
            ))}
            {lugarLivre(vida) && (
              <>
                <label class="nota rotulo-campo">
                  Ramo da subsidiária nova
                  <select class="campo" value={setor} onChange={(ev) => setSetor((ev.target as HTMLSelectElement).value)}>
                    {setoresDeEmpresa(conteudo).map((s) => (
                      <option key={s.id} value={s.id}>
                        {capitalizar(s.nome)}
                      </option>
                    ))}
                  </select>
                </label>
                <Acao {...base} op={{ tipo: 'fundarSubsidiaria', controladora: h.id, setor, valor: Math.max(100_000, Math.round(((h.n['caixa'] ?? 0) * 0.4) / 1000) * 1000) }} explica="Abre uma empresa nova com o caixa da holding: ela tem caixa, contas e diretoria próprios, e a diretoria já toca o dia a dia.">
                  Fundar uma subsidiária com {formatarDinheiro(Math.max(100_000, Math.round(((h.n['caixa'] ?? 0) * 0.4) / 1000) * 1000))} do caixa dela
                </Acao>
              </>
            )}
            <MoverCaixa {...base} de={h} />
            <DuplaDoValor {...base} h={h} />
          </div>
        ))
      )}
      {temSubsidiaria &&
        empresas
          .filter((x) => donaDe(x)[0] === '#')
          .map((x) => (
            <div key={x.id}>
              <p class="nota">
                <b>{x.nome}.</b> {donaEmPalavras(vida, x)}.
              </p>
              <Acao {...base} op={{ tipo: 'dividendosDaControlada', empresa: x.id, fracao: (x.n['retirada'] ?? 0) > 0 ? 0 : 0.6 }} explica={(x.n['retirada'] ?? 0) > 0 ? 'Todo o lucro fica nela, para crescer; nada sobe para a controladora.' : 'Todo ano, 60% do lucro dela sobe para a controladora; o resto fica nela para crescer.'}>
                {(x.n['retirada'] ?? 0) > 0 ? 'Reinvestir o lucro dela' : 'Mandar 60% do lucro dela para cima'}
              </Acao>
              <MoverCaixa {...base} de={x} />
              <Acao {...base} op={{ tipo: 'venderParticipacao', empresa: x.id, fracao: 0.25 }} explica="Investidores compram um quarto da parte da controladora pelo preço do dia: o dinheiro entra no caixa da controladora, e o grupo passa a mandar menos nela.">
                Vender um quarto da parte da controladora
              </Acao>
            </div>
          ))}
    </>
  );
}

// ---------------------------------------------------------------- dentro de cada empresa

/** As camadas de uma empresa: onde ela trabalha, o mercado dela, o produto e a mídia, e quem decide. */
export function CamadasDaEmpresa({ vida, conteudo, aoOperar, emp }: Base & { emp: Entidade }) {
  const [camada, setCamada] = useState<'unidades' | 'mercado' | 'produto' | 'governanca' | null>(null);
  if (emp.q['holding'] || emp.n['capacidade'] === undefined) return null;
  const rotulos = { unidades: 'Unidades', mercado: 'Mercado', produto: 'Produto e mídia', governanca: 'Quem decide' } as const;
  return (
    <>
      <p class="nota camadas">
        <b>Por dentro.</b> Onde ela trabalha, o mercado dela, o produto e quem decide o dia a dia.
      </p>
      <div class="escolhas-origem" role="group" aria-label="Camadas da empresa">
        {(Object.keys(rotulos) as (keyof typeof rotulos)[]).map((k) => (
          <button type="button" class="chip-origem" key={k} aria-pressed={camada === k} onClick={() => setCamada(camada === k ? null : k)}>
            {rotulos[k]}
          </button>
        ))}
      </div>
      {camada === 'unidades' && <Unidades vida={vida} conteudo={conteudo} aoOperar={aoOperar} emp={emp} />}
      {camada === 'mercado' && <Mercado vida={vida} conteudo={conteudo} aoOperar={aoOperar} emp={emp} />}
      {camada === 'produto' && <ProdutoEMidia vida={vida} conteudo={conteudo} aoOperar={aoOperar} emp={emp} />}
      {camada === 'governanca' && <Governanca vida={vida} conteudo={conteudo} aoOperar={aoOperar} emp={emp} />}
    </>
  );
}

function Unidades({ vida, conteudo, aoOperar, emp }: Base & { emp: Entidade }) {
  const base = { vida, conteudo, aoOperar };
  const lista = unidadesDe(vida, emp);
  const setor = conteudo.setores.get(emp.t['setor'] ?? '');
  const eco = economiaDo(setor);
  const sede = cidadeDaSede(vida, emp);
  const [cidade, setCidade] = useState(vida.entidades['lugar']?.nome ?? sede);
  const [transferir, setTransferir] = useState<string | null>(null);
  const irmas = empresasDe(vida).filter((x) => x.id !== emp.id && !x.q['holding'] && x.n['capacidade'] !== undefined);
  const forma = formaQueProduz(conteudo, emp);
  const apoios = (conteudo.mundo.apoios ?? []).filter((a) => a.setores.includes(emp.t['setor'] ?? ''));
  return (
    <>
      <p class="nota">
        <b>Onde ela trabalha.</b> Cada unidade é um estabelecimento dela, não uma empresa: a capacidade dela é a soma das que produzem. A cidade pesa no salário e no aluguel, e os empregos contam na cidade em que a unidade fica.
      </p>
      <ul class="arvore" aria-label="Unidades">
        {lista.map((u) => {
          const conta = contaDaUnidade(vida, conteudo, u, eco.giro, eco.fixo, eco.margem, empregosDe(conteudo, emp));
          return (
            <li key={u.id}>
              <b>
                {capitalizar(nomeDaUnidade(conteudo, u))}
                {u.q['sede'] ? ' · sede' : ''}
              </b>
              <small>
                {ehDeApoio(u)
                  ? `porte ${formatarDinheiro(u.n['porte'] ?? 0)} por ano${(u.n['obra'] ?? 0) > 0 ? ' · em obra' : ''} · ${conta.funcionarios.toLocaleString('pt-BR')} pessoas`
                  : `${formatarDinheiro(u.n['capacidade'] ?? 0)} por ano${(u.n['obra'] ?? 0) > 0 ? ` · obra de mais ${formatarDinheiro(u.n['obra'] ?? 0)}` : ''} · ${conta.funcionarios.toLocaleString('pt-BR')} pessoas · resultado ${formatarDinheiro(conta.resultado)} (rateio)`}
              </small>
              <div class="escolhas-origem">
                {!ehDeApoio(u) && (
                  <button type="button" class="chip-origem" disabled={motivoParaNaoOperar(vida, conteudo, { tipo: 'venderUnidade', unidade: u.id }) !== null} onClick={() => aoOperar({ tipo: 'venderUnidade', unidade: u.id })}>
                    Vender ({formatarDinheiro(precoDaUnidade(vida, conteudo, u, UNIDADES.vendaFuncionando))})
                  </button>
                )}
                <button type="button" class="chip-origem" disabled={motivoParaNaoOperar(vida, conteudo, { tipo: 'fecharUnidade', unidade: u.id }) !== null} onClick={() => aoOperar({ tipo: 'fecharUnidade', unidade: u.id })}>
                  Fechar ({formatarDinheiro(ehDeApoio(u) ? precoDaUnidade(vida, conteudo, u, VALOR_DE_VENDA_DOS_ATIVOS) : ((u.n['capacidade'] ?? 0) + (u.n['obra'] ?? 0)) * eco.giro * VALOR_DE_VENDA_DOS_ATIVOS)})
                </button>
                {irmas.length > 0 && (
                  <button type="button" class="chip-origem" aria-pressed={transferir === u.id} onClick={() => setTransferir(transferir === u.id ? null : u.id)}>
                    Transferir
                  </button>
                )}
              </div>
              {transferir === u.id &&
                irmas.map((x) => (
                  <Acao key={x.id} {...base} op={{ tipo: 'transferirUnidade', unidade: u.id, para: x.id }}>
                    Para {aEmpresa(x)} ({formatarDinheiro(precoDaUnidade(vida, conteudo, u, VALOR_DE_VENDA_DOS_ATIVOS))} de caixa para caixa)
                  </Acao>
                ))}
            </li>
          );
        })}
      </ul>
      <label class="nota rotulo-campo">
        Cidade da unidade nova
        <select class="campo" value={cidade} onChange={(ev) => setCidade((ev.target as HTMLSelectElement).value)}>
          {conteudo.mundo.cidades.map((x) => (
            <option key={x.nome} value={x.nome}>
              {x.nome} ({x.uf})
            </option>
          ))}
        </select>
      </label>
      <Acao {...base} op={{ tipo: 'construirUnidade', empresa: emp.id, forma, cidade, fracao: 0.25 }}>
        Construir {forma === 'unidade' ? 'uma unidade' : `${conteudo.setores.get(emp.t['setor'] ?? '')?.unidade?.f ? 'uma' : 'um'} ${conteudo.setores.get(emp.t['setor'] ?? '')?.unidade?.nome ?? 'unidade'}`} em {cidade} (mais 25%)
      </Acao>
      {apoios.map((a) => {
        const novo = porteDoApoioNovo(emp, a.id);
        const tem = deApoioDe(vida, emp, a.id).length > 0;
        return (
          <div key={a.id}>
            <Acao {...base} op={{ tipo: 'construirUnidade', empresa: emp.id, forma: a.id, cidade }}>
              {tem ? 'Mais' : a.f ? 'Uma' : 'Um'} {a.nome} em {cidade} ({formatarDinheiro(novo.custo)}, {formatarDinheiro(novo.porte)} por ano)
            </Acao>
            <p class="nota">{a.descricao}</p>
          </div>
        );
      })}
    </>
  );
}

function Mercado({ vida, conteudo, aoOperar, emp }: Base & { emp: Entidade }) {
  const base = { vida, conteudo, aoOperar };
  const setor = emp.t['setor'] ?? '';
  const partes = partesDoMercado(vida, conteudo, setor);
  const rivais = concorrentesNoSetor(vida, setor);
  const [fracao, setFracao] = useState(FRACAO_DA_COMPRA);
  const alvo = rivais[0];
  const cade = alvo ? analiseDoCade(vida, conteudo, setor, alvo.id) : null;
  return (
    <>
      <p class="nota">
        <b>O mercado de {conteudo.setores.get(setor)?.nome ?? setor}.</b> A parte de cada empresa no que o país compra do setor; o resto são os importados e os pequenos. As partes somam 100%.
      </p>
      <ul class="arvore" aria-label="Partes do mercado">
        {partes
          .map((p) => (
            <li key={p.id ?? 'resto'}>
              <b>
                {p.id === null ? capitalizar(p.nome) : p.nome}
                {p.doGrupo ? ' · seu grupo' : ''}
              </b>
              <small>{pct(p.parte, p.parte < 0.01 ? 3 : 1)}</small>
            </li>
          ))}
      </ul>
      {rivais.map((r) => (
        <p class="nota" key={r.id}>
          <b>{r.nome}.</b> {donaDe(r) === 'mercado' ? 'Capital no mercado' : 'Tem dono'} · caixa {formatarDinheiro(r.n['caixa'] ?? 0)} · atrai {Math.round(atratividade(r) * 50)} (você, {Math.round(atratividade(emp) * 50)}) · cobra {r.t['preco'] === 'popular' ? 'o popular' : r.t['preco'] === 'premium' ? 'o premium' : 'o de mercado'}
          {r.q['guerra'] ? ' · em guerra de preços' : ''}.
        </p>
      ))}
      {alvo && (
        <>
          <div class="escolhas-origem" role="group" aria-label="Quanto comprar">
            {[0.51, 0.8, 1].map((f) => (
              <button type="button" class="chip-origem" key={f} aria-pressed={Math.abs(fracao - f) < 1e-9} onClick={() => setFracao(f)}>
                {Math.round(f * 100)}%
              </button>
            ))}
          </div>
          <Acao {...base} op={{ tipo: 'adquirir', empresa: emp.id, fracao }}>
            Comprar {Math.round(fracao * 100)}% {aEmpresa(alvo, 'da')} ({formatarDinheiro(custoDaAquisicao(vida, emp.id, fracao))})
          </Acao>
          <p class="nota">
            Ela continua sendo uma empresa, com o nome, as unidades e a clientela, controlada por {aEmpresa(emp)}.{' '}
            {cade?.decisao === 'barrada'
              ? `O Cade barraria: o índice de concentração iria de ${Math.round(cade.antes).toLocaleString('pt-BR')} para ${Math.round(cade.depois).toLocaleString('pt-BR')}.`
              : cade?.decisao === 'condicao'
                ? 'O Cade aprovaria com condição: a comprada teria de vender uma unidade.'
                : cade?.decisao === 'aprovada'
                  ? 'O Cade analisaria e aprovaria.'
                  : 'Pequena demais para o Cade olhar.'}
          </p>
        </>
      )}
    </>
  );
}

function ProdutoEMidia({ vida, conteudo, aoOperar, emp }: Base & { emp: Entidade }) {
  const base = { vida, conteudo, aoOperar };
  const idade = idadeDoProduto(vida, emp);
  const velhice = velhiceDoProduto(vida, emp);
  const midias = midiasDoGrupo(vida).filter((m) => m.id !== emp.id);
  const ehMidia = emp.t['setor'] === SETOR_DA_MIDIA;
  return (
    <>
      <p class="nota">
        <b>O produto.</b> A geração de agora está nas lojas há {idade === 1 ? 'um ano' : `${idade} anos`}
        {velhice > 0 ? `: envelheceu, e a qualidade que ela sustenta caiu ${Math.round(velhice)} pontos.` : '. Depois de oito anos, ela começa a envelhecer.'}
      </p>
      <Acao {...base} op={{ tipo: 'lancar', empresa: emp.id }}>
        Lançar a geração nova ({formatarDinheiro(custoDoLancamento(emp))})
      </Acao>
      {ehMidia && (
        <p class="nota">
          <b>A audiência.</b> {pct(audienciaDe(vida, conteudo, emp), audienciaDe(vida, conteudo, emp) < 0.01 ? 3 : 1)} do que o país assiste e lê: é a parte da campanha das empresas do grupo que ela recebe, e quem anuncia só nela alcança essa audiência.
        </p>
      )}
      {midias.length > 0 && (
        <>
          <p class="nota">
            <b>Onde anunciar.</b> No mercado, a marca chega ao país inteiro. Na mídia do grupo, o dinheiro fica em casa (a consolidada não conta) e a marca chega a {pct(alcanceDaCampanha(vida, conteudo, emp), 0)} do alcance agora.
          </p>
          <div class="escolhas-origem" role="group" aria-label="Onde anunciar">
            <button type="button" class="chip-origem" aria-pressed={!emp.t['anuncia']} onClick={() => emp.t['anuncia'] && aoOperar({ tipo: 'anunciar', empresa: emp.id, midia: '' })}>
              No mercado
            </button>
            {midias.map((m) => (
              <button type="button" class="chip-origem" key={m.id} aria-pressed={emp.t['anuncia'] === m.id} onClick={() => emp.t['anuncia'] !== m.id && aoOperar({ tipo: 'anunciar', empresa: emp.id, midia: m.id })}>
                {m.nome}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Governanca({ vida, conteudo, aoOperar, emp }: Base & { emp: Entidade }) {
  const atual = autonomiaDe(emp);
  const mandato = mandatoDe(emp);
  const ceo = ceoDe(vida, conteudo, emp);
  const sugestao = jogadasDoConselho(vida, conteudo, emp, 'consultiva');
  const mudar = (a: Autonomia, m: Mandato): void => {
    if (a !== atual || m !== mandato) aoOperar({ tipo: 'governanca', empresa: emp.id, autonomia: a, mandato: m });
  };
  return (
    <>
      <p class="nota">
        <b>Quem decide.</b> {ceo ? `${ceo.genero === 'f' ? 'A CEO' : 'O CEO'} ${ceo.nome} e o conselho` : 'O conselho'} decidem pela mesma régua do gestor, no jeito do mandato que você der, e só dentro do que a autonomia deixa. O que decidirem vai para a linha do tempo.
      </p>
      <div class="escolhas-origem" role="group" aria-label="Autonomia">
        {AUTONOMIAS.map((a) => (
          <button type="button" class="chip-origem" key={a} aria-pressed={atual === a} onClick={() => mudar(a, mandato)}>
            {capitalizar(NOME_DA_AUTONOMIA[a])}
          </button>
        ))}
      </div>
      <p class="nota explica">{O_QUE_DECIDE[atual]}</p>
      {sobADupla(vida, emp) && (
        <p class="nota explica">
          Acima da diretoria, a dupla do valor ({NOMES_DA_DUPLA}): ela pede a eles antes de construir (retorno de {Math.round(CRIVO.retornoDaObra * 100)}%), de abrir filial ({Math.round(CRIVO.retornoDaFilial * 100)}%) e de comprar a concorrente (até {Math.round(CRIVO.margemDeSeguranca * 100)}% do justo); crédito no banco, nenhum.
        </p>
      )}
      <div class="escolhas-origem" role="group" aria-label="Mandato">
        {MANDATOS.map((m) => (
          <button type="button" class="chip-origem" key={m} aria-pressed={mandato === m} onClick={() => mudar(atual, m)}>
            Mandato {m}
          </button>
        ))}
      </div>
      <p class="nota explica">{O_QUE_O_MANDATO_FAZ[mandato]}</p>
      {atual === 'consultiva' && (
        <p class="nota">{sugestao.length === 0 ? 'O conselho não sugere nada este ano.' : `O conselho sugere: ${sugestao.map((s) => (s.tipo === 'retirada' ? `distribuir ${Math.round(s.fracao * 100)}% do lucro` : s.tipo)).join(', ')}.`}</p>
      )}
    </>
  );
}

// ---------------------------------------------------------------- o grupo no mundo (I-166 a I-169)

const nomeDoPais = (c: Conteudo, p: Parceiro | 'brasil'): string => (p === 'brasil' ? 'Brasil' : (defDoPais(c, p)?.nome ?? p));
const pctFino = (v: number): string => pct(v, v < 0.0001 ? 5 : v < 0.01 ? 3 : 1);

/** O grupo no mundo: os funcionários por país, a fatia em cada setor (em cada país e no mundo) e o peso diante do planeta. */
function NoMundo({ vida, conteudo }: { vida: EstadoVida; conteudo: Conteudo }) {
  const g = grupoNoMundo(vida, conteudo);
  const fatias = fatiasDoGrupo(vida, conteudo);
  return (
    <>
      <p class="nota camadas">
        <b>No mundo.</b> {g.funcionarios.toLocaleString('pt-BR')} {g.funcionarios === 1 ? 'pessoa trabalha' : 'pessoas trabalham'} no grupo
        {g.funcionariosPorPais.length > 1 ? ` (${g.funcionariosPorPais.map((p) => `${p.funcionarios.toLocaleString('pt-BR')} ${p.pais === 'brasil' ? 'no Brasil' : `${defDoPais(conteudo, p.pais)?.genero === 'f' ? 'na' : 'no'} ${nomeDoPais(conteudo, p.pais)}`}`).join(', ')})` : ''}. A sua parte no grupo vale {pctFino(g.grupoNoBrasil)} do PIB do Brasil e {pctFino(g.grupoNoPlaneta)} do PIB do planeta; tudo o que você tem, {pctFino(g.patrimonioNoPlaneta)} do planeta.
      </p>
      <ul class="arvore" aria-label="A fatia do grupo em cada setor">
        {fatias.map((f) => (
          <li key={f.setor}>
            <b>{capitalizar(f.nome)}</b>
            <small>
              {f.porPais.map((p) => `${nomeDoPais(conteudo, p.pais)} ${pctFino(p.parte)}`).join(' · ')} · no mundo {pctFino(f.mundo)}
            </small>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Abrir uma filial lá fora: o país e quem paga (a empresa do grupo com caixa), com o motivo à vista quando não dá. */
function AbrirFilial({ vida, conteudo, aoOperar }: Base) {
  const empresas = empresasDe(vida).filter((x) => !paisDaEmpresa(x));
  const [pais, setPais] = useState<Parceiro>(PARCEIROS[0]);
  const [quem, setQuem] = useState(empresas[0]?.id ?? '');
  if (empresas.length === 0) return null;
  const mae = vida.entidades[quem] ?? empresas[0]!;
  const setor = mae.q['holding'] ? (setoresDeEmpresa(conteudo)[0]?.id ?? 'comercio') : (mae.t['setor'] ?? 'comercio');
  const valor = Math.max(100_000, Math.round(((mae.n['caixa'] ?? 0) * 0.4) / 1000) * 1000);
  const def = defDoPais(conteudo, pais);
  return (
    <>
      <p class="nota camadas">
        <b>Uma filial lá fora.</b> É uma empresa do grupo noutro país: vende no mercado de lá, paga o imposto de lá ({Math.round((def?.imposto ?? 0) * 100)}%), ganha com o dólar alto e sente a relação com o Brasil. {capitalizar(def?.descricao ?? '')}; a economia de lá é {def?.tamanho.toLocaleString('pt-BR')} vezes a do Brasil.
      </p>
      <div class="escolhas-origem" role="group" aria-label="O país da filial">
        {PARCEIROS.map((p) => (
          <button type="button" class="chip-origem" key={p} aria-pressed={pais === p} onClick={() => setPais(p)}>
            {nomeDoPais(conteudo, p)}
          </button>
        ))}
      </div>
      {empresas.length > 1 && (
        <label class="nota rotulo-campo">
          Quem abre
          <select class="campo" value={mae.id} onChange={(ev) => setQuem((ev.target as HTMLSelectElement).value)}>
            {empresas.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nome}
              </option>
            ))}
          </select>
        </label>
      )}
      <Acao vida={vida} conteudo={conteudo} aoOperar={aoOperar} op={{ tipo: 'fundarSubsidiaria', controladora: mae.id, setor, valor, pais }}>
        Abrir a filial {defDoPais(conteudo, pais)?.genero === 'f' ? 'na' : 'no'} {nomeDoPais(conteudo, pais)} com {formatarDinheiro(valor)} do caixa {aEmpresa(mae, 'da')}
      </Acao>
    </>
  );
}

/** Os 10 mais ricos do país e as 10 maiores empresas, com você e as suas no lugar em que estão. */
export function OsMaisRicos({ vida, conteudo }: { vida: EstadoVida; conteudo: Conteudo }) {
  const [aberta, setAberta] = useState(false);
  const ricos = maisRicosDoPais(vida, conteudo);
  const empresas = aberta ? maioresEmpresasDoPais(vida, conteudo) : [];
  const resumo = ricos.posicao > 0 ? (ricos.posicao === 1 ? 'você é a fortuna número 1 do país' : `você está em ${ricos.posicao}º lugar no país`) : `a 10ª fortuna do país tem ${formatarDinheiro(ricos.lista[9]!.valor)}`;
  return (
    <div class="empresa-cartao">
      <button type="button" class="vaga" aria-expanded={aberta} onClick={() => setAberta(!aberta)}>
        <b>Os mais ricos e as maiores</b>
        <small>{resumo}</small>
      </button>
      {aberta && (
        <>
          <p class="nota">
            <b>As 10 maiores fortunas do país.</b> {ricos.posicao > 0 ? 'Você está entre elas.' : `Você tem ${formatarDinheiro(ricos.lista.at(-1)!.valor)}: ${pctFino(ricos.lista.at(-1)!.valor / ricos.lista[9]!.valor)} da décima.`}
          </p>
          <ol class="arvore" aria-label="As 10 maiores fortunas do país">
            {ricos.lista.map((r, i) => (
              <li key={`${r.nome}-${i}`}>
                <b>
                  {r.seu && ricos.posicao === 0 ? '— ' : `${i + 1}. `}
                  {r.nome}
                  {r.seu ? ' · você' : ''}
                </b>
                <small>
                  {formatarDinheiro(r.valor)}
                  {r.seu ? '' : ` · ${r.de}`}
                </small>
              </li>
            ))}
          </ol>
          <p class="nota">
            <b>As 10 maiores empresas do país.</b> {empresas.some((x) => x.seu) ? 'As suas estão marcadas.' : 'Nenhuma das suas entrou ainda.'}
          </p>
          <ol class="arvore" aria-label="As 10 maiores empresas do país">
            {empresas.map((r, i) => (
              <li key={`${r.nome}-${i}`}>
                <b>
                  {i + 1}. {r.nome}
                  {r.seu ? ' · sua' : ''}
                </b>
                <small>
                  {formatarDinheiro(r.valor)} · {r.de}
                </small>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
