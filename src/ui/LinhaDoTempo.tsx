import { useMemo } from 'preact/hooks';
import { NOMES_VERBO } from '../motor/acoes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { Entrada, EstadoVida } from '../motor/tipos.ts';
import { conteudo } from '../conteudo.ts';
import { avisosDeInflacao, chipDoBalanco, chipsDe, type Chip } from './formato.ts';

/** O verbo de uma ação ("Estudar"), para a etiqueta da entrada. */
function verboDe(h: Entrada, c: Conteudo): string | undefined {
  if (h.tipo !== 'acao' || !h.ref) return undefined;
  const s = c.porId.get(h.ref);
  return s?.verbo ? NOMES_VERBO[s.verbo] : undefined;
}

interface PropsItem {
  h: Entrada;
  nova: boolean;
  inflacao: boolean;
  nomeDe: (papel: string) => string | undefined;
  /** O balanço do ano, na primeira entrada visível dele. */
  balanco: Chip | null;
}

function Item({ h, nova, inflacao, nomeDe, balanco }: PropsItem) {
  const chips = chipsDe(h, nomeDe, inflacao);
  if (balanco) chips.push(balanco);
  const verbo = h.tipo === 'mundo' ? 'Economia' : h.tipo === 'dinheiro' ? (h.ref?.startsWith('empresa:') ? 'Empresa' : 'Dinheiro') : verboDe(h, conteudo);
  return (
    <li class={`ano ${h.tipo}`}>
      <span class="idade" aria-label={`${h.idade} anos`}>
        {h.idade}
      </span>
      <div class={`entrada ${h.tipo}${nova ? ' nova' : ''}`}>
        {verbo && <span class="etiqueta">{verbo}</span>}
        <p>{h.texto}</p>
        {h.escolha && <p class="escolhida">→ {h.escolha.texto}</p>}
        {h.resultado && <p class="resultado">{h.resultado}</p>}
        {chips.length > 0 && (
          <ul class="chips">
            {chips.map((c) => (
              <li
                class={`chip${c.ruim ? ' ruim' : ''}${c.neutro ? ' neutro' : ''}`}
                style={c.cor && !c.ruim ? { '--cor': c.cor } : undefined}
                key={c.texto}
              >
                {c.texto}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function LinhaDoTempo({ vida, novasDesde }: { vida: EstadoVida; novasDesde: number }) {
  const historico = vida.historico;
  const inflacao = useMemo(() => avisosDeInflacao(historico), [historico]);
  const nomeDe = (papel: string) => vida.entidades[papel]?.nome;
  const participacao = vida.entidades['empresa']?.n['participacao'] ?? 1;
  // Cada ano tem uma entrada invisível com as regras (salário, rendimentos, inflação, empresa): o balanço dela vai na primeira entrada visível do ano.
  const balancos = useMemo(() => {
    const m = new Map<number, Chip>();
    let regra: Entrada | undefined;
    for (const h of historico) {
      if (h.tipo === 'regra') regra = h;
      else if (regra && h.idade === regra.idade) {
        const chip = chipDoBalanco(regra, participacao);
        if (chip) m.set(h.id, chip);
        regra = undefined;
      }
    }
    return m;
  }, [historico, participacao]);
  return (
    <ol class="linha-do-tempo" aria-label="Linha do tempo da vida">
      {historico.map((h, i) =>
        h.tipo === 'regra' ? null : (
          <Item h={h} nova={i >= novasDesde} inflacao={inflacao.has(h.id)} nomeDe={nomeDe} balanco={balancos.get(h.id) ?? null} key={h.id} />
        ),
      )}
    </ol>
  );
}
