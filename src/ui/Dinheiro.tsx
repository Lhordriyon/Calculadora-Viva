import { useEffect, useState } from 'preact/hooks';
import { investidoDe, patrimonioDe } from '../motor/campos.ts';
import { motivoParaNaoOperar, perfilDe, type Operacao } from '../motor/carteira.ts';
import { ATIVOS, PERFIS, type Ativo, type Perfil } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { formatarDinheiro } from '../motor/texto.ts';
import type { EstadoVida } from '../motor/tipos.ts';

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

function porcento(v: number): string {
  const r = Math.round(v * 10) / 10;
  return `${r > 0 ? '+' : r < 0 ? '−' : ''}${String(Math.abs(r)).replace('.', ',')}%`;
}

/** Dinheiro e investimentos: o perfil, a carteira por classe e um jeito de aplicar ou resgatar em três toques. */
export function Dinheiro({ vida, conteudo, aoOperar, aoFechar }: Props) {
  const [sentido, setSentido] = useState<Sentido>('aplicar');
  const [fracao, setFracao] = useState(0.25);
  const [onde, setOnde] = useState<Ativo | 'perfil'>('perfil');
  const [trocandoPara, setTrocandoPara] = useState<Perfil | null>(null);

  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  const eu = vida.entidades['eu']!;
  const pais = vida.entidades['pais']!;
  const n = eu.n;
  const conta = Math.max(0, n['dinheiro'] ?? 0);
  const investido = investidoDe(eu);
  const divida = n['divida'] ?? 0;
  const perfil = perfilDe(vida);
  const defPerfil = (p: Perfil) => conteudo.mundo.perfis.find((x) => x.id === p);

  const base = sentido === 'aplicar' ? conta : onde === 'perfil' ? investido : (n[onde] ?? 0);
  const valor = Math.floor(base * fracao);
  const op: Operacao =
    sentido === 'aplicar'
      ? { tipo: 'aplicar', valor, ...(onde === 'perfil' ? {} : { ativo: onde }) }
      : { tipo: 'resgatar', valor, ...(onde === 'perfil' ? {} : { ativo: onde }) };
  const motivo = motivoParaNaoOperar(vida, op);
  const ondeTexto =
    onde === 'perfil' ? (sentido === 'aplicar' ? `pelo perfil ${perfil}` : 'do mais fácil de vender') : sentido === 'aplicar' ? `em ${CURTO[onde].toLowerCase()}` : `de ${CURTO[onde].toLowerCase()}`;

  function trocarPerfil(p: Perfil, rebalancear: boolean) {
    aoOperar({ tipo: 'perfil', perfil: p, rebalancear });
    setTrocandoPara(null);
  }

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-dinheiro" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha dinheiro-folha">
        <h2 id="titulo-dinheiro">Dinheiro</h2>
        <p class="meta">
          Patrimônio <b>{formatarDinheiro(patrimonioDe(eu))}</b> · na conta {formatarDinheiro(conta)}
          {divida >= 1 ? ` · dívida ${formatarDinheiro(divida)}` : ''}
        </p>

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
          <legend>Mexer no dinheiro</legend>
          <div class="escolhas-origem" role="group" aria-label="Aplicar ou resgatar">
            <button type="button" class="chip-origem" aria-pressed={sentido === 'aplicar'} onClick={() => setSentido('aplicar')}>
              Aplicar
            </button>
            <button type="button" class="chip-origem" aria-pressed={sentido === 'resgatar'} onClick={() => setSentido('resgatar')}>
              Resgatar
            </button>
          </div>
          <div class="escolhas-origem" role="group" aria-label="Quanto">
            {FRACOES.map((x) => (
              <button type="button" class="chip-origem" key={x.rotulo} aria-pressed={fracao === x.f} onClick={() => setFracao(x.f)}>
                {x.rotulo}
              </button>
            ))}
          </div>
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

        <div class="acoes">
          <button class="botao secundario" type="button" onClick={aoFechar}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
