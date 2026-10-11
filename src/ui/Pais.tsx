import { useEffect, useState } from 'preact/hooks';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { Politica } from '../motor/constantes.ts';
import type { DefPolitica, EfeitoDePolitica } from '../motor/esquema.ts';
import { defFase, defGoverno, ESTATISTICAS, faseDe, governoAtual, jogadorGoverna, nivelDe, nomeDoGoverno, proximaEleicaoGeral, rumoDoPais, type Estatistica } from '../motor/pais.ts';
import { META_DE_INFLACAO } from '../motor/regras.ts';
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
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  const pais = vida.entidades['pais']!;
  const fase = faseDe(vida);
  const id = governoAtual(vida);
  const bloco = defGoverno(conteudo, id);
  const governa = id === 'voce';
  const eleicao = proximaEleicaoGeral(vida.ano);
  const voto = Object.entries(vida.entidades['eu']!.q).find(([k, q]) => k.startsWith('voto_') && q.v > 0);
  const votouEm = voto ? defGoverno(conteudo, voto[0].slice('voto_'.length)) : undefined;

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-pais" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha dinheiro-folha">
        <h2 id="titulo-pais">{pais.nome}</h2>
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
          <legend>Como está</legend>
          <Estatisticas vida={vida} conteudo={conteudo} />
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
      </div>
    </div>
  );
}
