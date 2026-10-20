import { useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { Politica } from '../motor/constantes.ts';
import { ACOES_DIPLOMATICAS, chanceDeSancao, defEstrangeiro, oPais, parceirosDe, type AcaoDiplomatica } from '../motor/diplomacia.ts';
import type { DefPolitica, EfeitoDePolitica } from '../motor/esquema.ts';
import { indicadoresDoPais } from '../motor/campos.ts';
import { defFase, defGoverno, ESTATISTICAS, faseDe, governoAtual, jogadorGoverna, nivelDe, nomeDoGoverno, proximaEleicaoGeral, rumoDoPais, type Estatistica } from '../motor/pais.ts';
import { ACORDO, ATO, META_DE_INFLACAO, SANCAO } from '../motor/regras.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  aoFechar: () => void;
}

/** "2,1" (uma casa, vírgula). */
const num = (v: number): string => v.toFixed(1).replace('.', ',').replace('-', '−');
const inteiro = (v: number): string => String(Math.round(v)).replace('-', '−');

/** Como cada estatística aparece, e se subir é bom (1), ruim (−1) ou depende (0: juros alto é bom para quem guarda). */
const ESTATISTICA: Record<Estatistica, { nome: string; valor: (v: number) => string; bom: 1 | -1 | 0 }> = {
  crescimento: { nome: 'Crescimento', valor: (v) => `${num(v)}% ao ano`, bom: 1 },
  desemprego: { nome: 'Desemprego', valor: (v) => `${num(v)}%`, bom: -1 },
  inflacao: { nome: 'Inflação', valor: (v) => `${num(v)}% ao ano`, bom: -1 },
  juros: { nome: 'Juros (Selic)', valor: (v) => `${num(v)}% ao ano`, bom: 0 },
  divida: { nome: 'Dívida do governo', valor: (v) => `${inteiro(v)}% do PIB`, bom: -1 },
  pobreza: { nome: 'Pobreza', valor: (v) => `${inteiro(v)}% da população`, bom: -1 },
  violencia: { nome: 'Violência', valor: (v) => `${inteiro(v)} homicídios por 100 mil`, bom: -1 },
  saude: { nome: 'Saúde pública', valor: (v) => `${inteiro(v)} de 100`, bom: 1 },
  educacao: { nome: 'Educação pública', valor: (v) => `${inteiro(v)} de 100`, bom: 1 },
  aprovacao: { nome: 'Aprovação do governo', valor: (v) => `${inteiro(v)}%`, bom: 1 },
};

/** O quanto cada estatística andou no último ano (as regras do ano ficam numa entrada escondida do livro). */
function variacoesDoAno(vida: EstadoVida): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = vida.historico.length - 1; i >= 0; i--) {
    const h = vida.historico[i]!;
    if (h.tipo !== 'regra' || h.ref !== 'ano') continue;
    for (const x of h.mudancas ?? []) if (x.r === 'pais' && x.d !== undefined && x.c.startsWith('pais.')) m.set(x.c.slice(5), (m.get(x.c.slice(5)) ?? 0) + x.d);
    break;
  }
  return m;
}

/** O que muda ao trocar o nível de uma política, em palavras. */
const EFEITO: Record<EfeitoDePolitica, (d: number) => string> = {
  receita: (d) => `arrecadação ${d > 0 ? '+' : '−'}${num(Math.abs(d))} ponto do PIB`,
  gasto: (d) => `gasto do governo ${d > 0 ? '+' : '−'}${num(Math.abs(d))} ponto do PIB`,
  potencial: (d) => `crescimento ${d > 0 ? '+' : '−'}${num(Math.abs(d))} ponto por ano`,
  aprovacao: (d) => `aprovação ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))}`,
  pobreza: (d) => `pobreza ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))} pontos, com o tempo`,
  violencia: (d) => `violência ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))}, com o tempo`,
  saude: (d) => `saúde pública ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))}, com o tempo`,
  educacao: (d) => `educação pública ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))}, em uma geração`,
  renda: (d) => `renda de quem não é pobre ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d) * 100)}%`,
  auxilio: (d) => `auxílio de quem é pobre ${d > 0 ? '+' : '−'}${formatarDinheiro(Math.abs(d) / 12)} por mês`,
  inflacao: (d) => `inflação ${d > 0 ? '+' : '−'}${num(Math.abs(d))} ponto`,
  relacao: (d) => `relação com os países de fora ${d > 0 ? '+' : '−'}${inteiro(Math.abs(d))}, com o tempo`,
};

function efeitosDaMudanca(def: DefPolitica, de: number, para: number): string {
  const partes: string[] = [];
  for (const [k, niveis] of Object.entries(def.efeitos) as [EfeitoDePolitica, [number, number, number]][]) {
    const d = (niveis[para] ?? 0) - (niveis[de] ?? 0);
    if (Math.abs(d) > 1e-9) partes.push(EFEITO[k](d));
  }
  return partes.join('; ');
}

/** As estatísticas: o valor, a seta do último ano e para onde caminham com as políticas de agora. */
function Estatisticas({ vida, conteudo }: Pick<Props, 'vida' | 'conteudo'>) {
  const n = vida.entidades['pais']!.n;
  const variou = variacoesDoAno(vida);
  const rumo = rumoDoPais(vida, conteudo);
  const juroReal = (n['juros'] ?? 0) - (n['inflacao'] ?? 0);
  const rumoDe: Partial<Record<Estatistica, string>> = {
    crescimento: `volta para ${num(rumo.potencial)}%`,
    desemprego: `natural: ${num(rumo.natural)}%`,
    inflacao: `meta: ${num(META_DE_INFLACAO)}%`,
    juros: `juro real: ${num(juroReal)}%`,
    divida: rumo.primario >= 0 ? `arrecada ${num(rumo.primario)} ponto do PIB a mais do que gasta` : `gasta ${num(-rumo.primario)} ponto do PIB a mais do que arrecada`,
    pobreza: `vai para ${inteiro(rumo.pobreza)}%`,
    violencia: `vai para ${inteiro(rumo.violencia)}`,
    saude: `vai para ${inteiro(rumo.saude)}`,
    educacao: `vai para ${inteiro(rumo.educacao)}`,
  };
  return (
    <dl class="estatisticas">
      {ESTATISTICAS.map((k) => {
        const def = ESTATISTICA[k];
        const d = variou.get(k) ?? 0;
        const seta = Math.abs(d) < 0.05 ? '' : d > 0 ? '▲' : '▼';
        const tom = def.bom === 0 || !seta ? '' : (d > 0) === (def.bom > 0) ? 'bom' : 'ruim';
        return (
          <div class="estatistica" key={k}>
            <dt>{def.nome}</dt>
            <dd>
              <b>{def.valor(n[k] ?? 0)}</b>
              {seta && (
                <span class={`seta ${tom}`} aria-label={`${d > 0 ? 'subiu' : 'caiu'} ${num(Math.abs(d))} no ano`}>
                  {' '}
                  {seta} {num(Math.abs(d))}
                </span>
              )}
              {rumoDe[k] && <small>{rumoDe[k]}</small>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** A faixa do IDH, como a ONU chama. */
function faixaDoIdh(idh: number): string {
  if (idh >= 0.8) return 'muito alto';
  if (idh >= 0.7) return 'alto';
  if (idh >= 0.55) return 'médio';
  return 'baixo';
}

/** O tamanho do país: PIB e população (com a seta do ano em %), a renda por pessoa, a desigualdade e o IDH. */
function Numeros({ vida }: Pick<Props, 'vida'>) {
  const pais = vida.entidades['pais']!;
  const n = pais.n;
  const variou = variacoesDoAno(vida);
  const { pibPerCapita, gini, idh } = indicadoresDoPais(pais);
  const pct = (campo: string): { seta: string; tom: string; texto: string } | null => {
    const d = variou.get(campo) ?? 0;
    const antes = (n[campo] ?? 0) - d;
    if (antes <= 0 || Math.abs(d / antes) < 0.0005) return null;
    const p = (100 * d) / antes;
    return { seta: p > 0 ? '▲' : '▼', tom: campo === 'pib' ? (p > 0 ? 'bom' : 'ruim') : '', texto: `${num(Math.abs(p))}%` };
  };
  const linhas: { nome: string; valor: string; seta?: ReturnType<typeof pct>; nota: string }[] = [
    { nome: 'PIB', valor: `${formatarDinheiro(n['pib'] ?? 0)} por ano`, seta: pct('pib'), nota: 'tudo o que o país produz; anda com o crescimento' },
    { nome: 'População', valor: `${num((n['populacao'] ?? 0) / 1e6)} milhões`, seta: pct('populacao'), nota: 'nasce mais quando a saúde melhora; a pobreza também enche a casa' },
    { nome: 'PIB per capita', valor: `${formatarDinheiro(pibPerCapita)} por pessoa`, nota: 'o PIB dividido por todo mundo, que é a média e não o seu salário' },
    { nome: 'Desigualdade (Gini)', valor: gini.toFixed(2).replace('.', ','), nota: '0 é todo mundo igual; 1, um só tem tudo. Sobe com a pobreza, cai com a educação' },
    { nome: 'IDH', valor: `${idh.toFixed(2).replace('.', ',')} (${faixaDoIdh(idh)})`, nota: 'saúde, educação e renda numa nota de 0 a 1' },
  ];
  return (
    <dl class="estatisticas">
      {linhas.map((l) => (
        <div class="estatistica" key={l.nome}>
          <dt>{l.nome}</dt>
          <dd>
            <b>{l.valor}</b>
            {l.seta && (
              <span class={`seta ${l.seta.tom}`} aria-label={`${l.seta.seta === '▲' ? 'subiu' : 'caiu'} ${l.seta.texto} no ano`}>
                {' '}
                {l.seta.seta} {l.seta.texto}
              </span>
            )}
            <small>{l.nota}</small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Quanto o dólar andou no último ano (a regra do ano o escreve com o mundo lá fora). */
function variacaoDoCambio(vida: EstadoVida): number {
  for (let i = vida.historico.length - 1; i >= 0; i--) {
    const h = vida.historico[i]!;
    if (h.tipo !== 'regra' || h.ref !== 'ano') continue;
    return (h.mudancas ?? []).reduce((soma, x) => soma + (x.c === 'pais.cambio' ? (x.d ?? 0) : 0), 0);
  }
  return 0;
}

/** A relação com um país de fora, em palavras, no gênero dele ("a Celeste é amiga", "o Pacto é frio"). */
function nivelDaRelacao(r: number, genero: 'm' | 'f'): string {
  const [m, f] = r >= 75 ? ['aliado', 'aliada'] : r >= 55 ? ['amigo', 'amiga'] : r >= 35 ? ['neutro', 'neutra'] : r >= 20 ? ['frio', 'fria'] : ['hostil', 'hostil'];
  return genero === 'm' ? m : f;
}

const ROTULO_DO_ATO: Record<AcaoDiplomatica, string> = { aproximar: 'Visita de Estado', acordo: 'Assinar acordo comercial', romper: 'Romper relações' };

/** O mundo lá fora: o dólar e cada país (a economia, a relação com o Brasil, sanção, acordo, crise); quem governa faz um ato por ano. */
function LaFora({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [rompendo, setRompendo] = useState(false);
  const governa = governoAtual(vida) === 'voce';
  const cambio = vida.entidades['pais']!.n['cambio'] ?? 5;
  const d = variacaoDoCambio(vida);
  const pct = cambio - d > 0 ? (100 * d) / (cambio - d) : 0;
  const paises = parceirosDe(vida);
  return (
    <>
      <dl class="estatisticas">
        <div class="estatistica">
          <dt>Dólar</dt>
          <dd>
            <b>R$ {cambio.toFixed(2).replace('.', ',')}</b>
            {Math.abs(pct) >= 0.5 && (
              <span class={`seta ${pct > 0 ? 'ruim' : 'bom'}`} aria-label={`${pct > 0 ? 'subiu' : 'caiu'} ${inteiro(Math.abs(pct))}% no ano`}>
                {' '}
                {pct > 0 ? '▲' : '▼'} {inteiro(Math.abs(pct))}%
              </span>
            )}
            <small>sobe com a dívida, a economia fraca, a crise lá fora e as sanções; cai com juro alto e o mundo comprando do Brasil</small>
          </dd>
        </div>
      </dl>
      <ul class="vagas" aria-label="Países de fora">
        {paises.map((en) => {
          const def = defEstrangeiro(conteudo, en.id);
          if (!def) return null;
          const rel = en.n['relacao'] ?? 50;
          const estado = [en.q['sancao'] ? 'sanção contra o Brasil' : '', en.q['acordo'] ? 'acordo comercial' : '', en.q['crise'] ? 'em crise' : ''].filter(Boolean);
          const rival = def.rival ? vida.entidades[def.rival] : undefined;
          const ato = (acao: AcaoDiplomatica): { op: Operacao; motivo: string | null } => {
            const op: Operacao = { tipo: 'diplomacia', parceiro: def.id, acao };
            return { op, motivo: motivoParaNaoOperar(vida, conteudo, op) };
          };
          return (
            <li key={en.id}>
              <button
                type="button"
                class="vaga"
                aria-expanded={aberto === en.id}
                onClick={() => {
                  setAberto(aberto === en.id ? null : en.id);
                  setRompendo(false);
                }}
              >
                <b>{en.nome}</b>
                <small>
                  {capitalizar(nivelDaRelacao(rel, en.genero === 'm' ? 'm' : 'f'))} ({inteiro(rel)}) · cresce {num(en.n['crescimento'] ?? 0)}% ao ano{estado.length ? ` · ${estado.join(' · ')}` : ''}
                </small>
              </button>
              {aberto === en.id && (
                <div class="empresa-cartao">
                  <p class="nota">
                    {capitalizar(def.descricao)}. Compra do Brasil {def.produtos}: {inteiro(def.peso * 100)}% do que o Brasil vende lá fora.
                    {rival ? ` Rival ${oPais(rival, 'da')}.` : ''}{' '}
                    {en.q['sancao']
                      ? `A sanção acaba quando a relação passa de ${SANCAO.acaba}.`
                      : chanceDeSancao(rel) > 0
                        ? `Com a relação abaixo de ${SANCAO.abaixo}, a chance de uma sanção deles é de ${chanceDeSancao(rel) < 0.01 ? 'menos de 1' : inteiro(100 * chanceDeSancao(rel))}% ao ano.`
                        : `Abaixo de ${SANCAO.abaixo}, a relação pode virar sanção; acima de ${ACORDO.acima}, acordo.`}
                  </p>
                  {governa &&
                    (rompendo ? (
                      <div class="confirmar">
                        <p>
                          Romper com {oPais(en)}? A sua popularidade sobe {ATO.popularidade} pontos agora; a relação cai para {inteiro(Math.max(0, rel + ATO.romper))}
                          {en.q['acordo'] ? ', o acordo acaba' : ''} e a chance de uma sanção deles passa a {inteiro(100 * chanceDeSancao(Math.max(0, rel + ATO.romper)))}% ao ano.
                        </p>
                        <div class="escolhas-origem">
                          <button
                            type="button"
                            class="botao"
                            disabled={ato('romper').motivo !== null}
                            onClick={() => {
                              setRompendo(false);
                              aoOperar(ato('romper').op);
                            }}
                          >
                            Romper
                          </button>
                          <button type="button" class="botao secundario" onClick={() => setRompendo(false)}>
                            Voltar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="acoes">
                        {ACOES_DIPLOMATICAS.map((acao) => {
                          const { op, motivo } = ato(acao);
                          return (
                            <button
                              type="button"
                              class="botao secundario"
                              key={acao}
                              disabled={motivo !== null}
                              onClick={() => (acao === 'romper' ? setRompendo(true) : aoOperar(op))}
                            >
                              {ROTULO_DO_ATO[acao]}
                              {motivo ? <small> · {motivo}</small> : null}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p class="nota">
        {governa
          ? 'Um ato lá fora por ano: a visita de Estado esquenta a relação (e esfria a do rival), o acordo soma crescimento e o rompimento rende popularidade agora e a conta depois.'
          : 'A crise de lá vira crise aqui, a sanção tira crescimento e o acordo soma. Quem governa escolhe de quem se aproximar.'}
      </p>
    </>
  );
}

/** As políticas em vigor; quem governa muda uma por ano. */
function Politicas({ vida, conteudo, aoOperar }: Omit<Props, 'aoFechar'>) {
  const governa = governoAtual(vida) === 'voce';
  const [sel, setSel] = useState<{ politica: Politica; nivel: number } | null>(null);
  return (
    <div class="politicas">
      {conteudo.mundo.politicas.map((def) => {
        const nivel = nivelDe(vida, def.id);
        const aberta = sel?.politica === def.id && sel.nivel !== nivel ? sel : null;
        const op: Operacao | null = aberta ? { tipo: 'politica', politica: def.id, nivel: aberta.nivel } : null;
        const motivo = op ? motivoParaNaoOperar(vida, conteudo, op) : null;
        return (
          <div class="politica" key={def.id}>
            <div class="politica-topo">
              <b>{def.nome}</b>
              <span>{def.niveis[nivel]}</span>
            </div>
            {governa && (
              <div class="escolhas-origem" role="group" aria-label={def.nome}>
                {def.niveis.map((nome, k) => (
                  <button type="button" class="chip-origem" key={nome} aria-pressed={k === (aberta?.nivel ?? nivel)} onClick={() => setSel({ politica: def.id, nivel: k })}>
                    {nome}
                  </button>
                ))}
              </div>
            )}
            <p class="nota">{def.descricao}</p>
            {aberta && op && (
              <div class="confirmar">
                <p>
                  De {def.niveis[nivel]} para {def.niveis[aberta.nivel]}: {efeitosDaMudanca(def, nivel, aberta.nivel)}.{motivo ? ` Agora não: ${motivo}.` : ' Uma reforma por ano.'}
                </p>
                <div class="escolhas-origem">
                  <button
                    type="button"
                    class="botao"
                    disabled={motivo !== null}
                    onClick={() => {
                      aoOperar(op);
                      setSel(null);
                    }}
                  >
                    Aprovar a reforma
                  </button>
                  <button type="button" class="botao secundario" onClick={() => setSel(null)}>
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A folha País: quem governa, como está o país, para onde ele vai e (para quem governa) as políticas. */
export function Pais({ vida, conteudo, aoOperar, aoFechar }: Props) {

  const pais = vida.entidades['pais']!;
  const fase = faseDe(vida);
  const id = governoAtual(vida);
  const bloco = defGoverno(conteudo, id);
  const governa = id === 'voce';
  const eleicao = proximaEleicaoGeral(vida.ano);
  const voto = Object.entries(vida.entidades['eu']!.q).find(([k, q]) => k.startsWith('voto_') && q.v > 0);
  const votouEm = voto ? defGoverno(conteudo, voto[0].slice('voto_'.length)) : undefined;

  return (
    <Folha id="titulo-pais" titulo={pais.nome} classe="dinheiro-folha" aoFechar={aoFechar}>
        <p class="meta">
          {fase === 'normal' ? 'Economia normal' : capitalizar(defFase(conteudo, fase).nome)} · governo: <b>{nomeDoGoverno(vida, conteudo)}</b>
          {bloco?.eleito !== false && !governa ? (eleicao === vida.ano ? ' · eleição para presidente neste ano' : ` · próxima eleição para presidente em ${eleicao}`) : ''}
        </p>
        {governa ? (
          <p class="nota">Você governa o país. A aprovação do governo é a sua popularidade: abaixo de 30%, o cargo balança.</p>
        ) : bloco ? (
          <p class="nota">
            {capitalizar(bloco.nome)} {bloco.eleito ? 'governa prometendo' : 'manda prometendo'} {bloco.promessa}.
            {jogadorGoverna(vida, conteudo) ? ' Você toma posse no ano que vem.' : bloco.eleito ? ' Para mudar as políticas, só ganhando a eleição para presidente (folha Carreira e poder).' : ''}
          </p>
        ) : null}
        {votouEm && voto && (
          <p class="nota">
            Seu último voto: {votouEm.nome}, em {voto[1].ano}.
          </p>
        )}
        <fieldset class="grupo">
          <legend>Em números</legend>
          <Numeros vida={vida} />
        </fieldset>
        <fieldset class="grupo">
          <legend>Como está</legend>
          <Estatisticas vida={vida} conteudo={conteudo} />
        </fieldset>
        <fieldset class="grupo">
          <legend>Lá fora</legend>
          <LaFora vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        </fieldset>
        <fieldset class="grupo">
          <legend>Políticas</legend>
          <Politicas vida={vida} conteudo={conteudo} aoOperar={aoOperar} />
        </fieldset>
        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
    </Folha>
  );
}
