import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { NOMES_VERBO } from '../motor/acoes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import type { Entrada, EstadoVida } from '../motor/tipos.ts';
import { porqueDe } from '../motor/virada.ts';
import { conteudo } from '../conteudo.ts';
import { avisosDeInflacao, chipDoBalanco, chipDosAlugueis, chipsDe, visivel, type Chip } from './formato.ts';
import { Icone } from './Icones.tsx';

/** O verbo de uma ação ("Estudar"), para a etiqueta da entrada. */
function verboDe(h: Entrada, c: Conteudo): string | undefined {
  if (h.tipo !== 'acao' || !h.ref) return undefined;
  const s = c.porId.get(h.ref);
  return s?.verbo ? NOMES_VERBO[s.verbo] : undefined;
}

/** Operações da folha (e regras que contam algo) pelo grupo do ref: "empresa:abrir" → Empresa. */
const GRUPOS: Record<string, string> = { empresa: 'Empresa', bens: 'Compra', carreira: 'Carreira', poder: 'Política', carteira: 'Dinheiro', testamento: 'Testamento', jogada: 'Fortuna' };
function etiquetaDoGrupo(ref: string | undefined): string | undefined {
  const grupo = ref?.split(':')[0] ?? '';
  return GRUPOS[grupo];
}

interface PropsItem {
  h: Entrada;
  nova: boolean;
  inflacao: boolean;
  nomeDe: (papel: string) => string | undefined;
  /** O balanço do ano (e os aluguéis), numa linha discreta na primeira entrada visível dele. */
  balanco: Chip[];
  /** A causa de um ano anterior, no que aconteceu com quem joga (eventos, iniciativas dos outros, a morte). */
  porque: { idade: number; texto: string } | null;
}

function ItemDoLivro({ h, nova, inflacao, nomeDe, balanco, porque }: PropsItem) {
  const chips = chipsDe(h, nomeDe, inflacao);
  const verbo = h.tipo === 'mundo' ? 'Economia' : h.tipo === 'dinheiro' || h.tipo === 'regra' ? etiquetaDoGrupo(h.ref) : verboDe(h, conteudo);
  // Os marcos da vida (o ENEM, o primeiro emprego, a aposentadoria…) ganham o destaque dourado.
  const marco = (h.tipo === 'evento' || h.tipo === 'acao') && h.ref !== undefined && conteudo.porId.get(h.ref)?.marco === true;
  return (
    <li class={`ano ${h.tipo}${marco ? ' marco' : ''}`} data-id={h.id}>
      <span class="idade" aria-label={`${h.idade} anos`}>
        {h.idade}
      </span>
      <div class={`entrada ${h.tipo}${marco ? ' marco' : ''}${nova ? ' nova' : ''}`}>
        {marco ? (
          <span class="etiqueta etiqueta-marco">
            <Icone nome="coroa" tamanho={15} /> Marco da trajetória{verbo ? ` · ${verbo}` : ''}
          </span>
        ) : (
          verbo && <span class="etiqueta">{verbo}</span>
        )}
        <p>{h.texto}</p>
        {h.escolha && <p class="escolhida">→ {h.escolha.texto}</p>}
        {h.resultado && <p class="resultado">{h.resultado}</p>}
        {porque && (
          <p class="porque">
            Porque aos {porque.idade}, {porque.texto}.
          </p>
        )}
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
        {/* O balanço do ano é contexto, não acontecimento: uma linha pequena, sem cor de destaque. */}
        {balanco.length > 0 && (
          <p class="balanco">
            {balanco.map((c, i) => (
              <span class={c.ruim ? 'ruim' : undefined} key={c.texto}>
                {i > 0 ? ' · ' : ''}
                {c.texto}
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

const mesmosChips = (a: Chip[], b: Chip[]): boolean => a.length === b.length && a.every((x, i) => x.texto === b[i]!.texto && x.ruim === b[i]!.ruim);

/**
 * Uma entrada lançada não muda mais (o livro só cresce, e a cópia da vida a cada toque divide as antigas): só
 * redesenha a que ficou nova, ganhou o aviso da inflação, o balanço do ano ou o porquê.
 */
const Item = memo(
  ItemDoLivro,
  (a, b) =>
    a.h === b.h &&
    a.nova === b.nova &&
    a.inflacao === b.inflacao &&
    mesmosChips(a.balanco, b.balanco) &&
    a.porque?.idade === b.porque?.idade &&
    a.porque?.texto === b.porque?.texto,
);

/** O porquê de cada entrada, calculado uma vez: ele só olha as causas, que são entradas mais antigas. */
const porques = new WeakMap<Entrada, { idade: number; texto: string } | null>();
function porqueGuardado(h: Entrada, porId: ReadonlyMap<number, Entrada>): { idade: number; texto: string } | null {
  let p = porques.get(h);
  if (p === undefined) {
    p = porqueDe(h, porId);
    porques.set(h, p);
  }
  return p;
}

/** O balanço de cada ano, calculado uma vez para cada parte nas empresas (o chip mostra a parte de quem joga). */
const balancosGuardados = new WeakMap<Entrada, { partes: string; chips: Chip[] }>();
function balancoGuardado(regra: Entrada, partes: string, participacao: Record<string, number>): Chip[] {
  const x = balancosGuardados.get(regra);
  if (x && x.partes === partes) return x.chips;
  const chips = [chipDoBalanco(regra, participacao), chipDosAlugueis(regra)].filter((c): c is Chip => c !== null);
  balancosGuardados.set(regra, { partes, chips });
  return chips;
}

export function LinhaDoTempo({ vida, novasDesde }: { vida: EstadoVida; novasDesde: number }) {
  const historico = vida.historico;
  const inflacao = useMemo(() => avisosDeInflacao(historico), [historico]);
  const nomeDe = (papel: string) => vida.entidades[papel]?.nome;
  // A parte de quem joga em cada empresa (a chave muda só quando alguma parte muda).
  const partes = Object.values(vida.entidades)
    .filter((x) => x.tipo === 'empresa')
    .map((x) => `${x.id}:${x.n['participacao'] ?? 1}`)
    .join(',');
  const participacao = useMemo(() => Object.fromEntries(partes.split(',').filter(Boolean).map((p) => [p.split(':')[0]!, Number(p.split(':')[1])])), [partes]);
  const porId = useMemo(() => new Map(historico.map((h) => [h.id, h])), [historico]);
  // Cada ano tem uma entrada invisível com as regras (salário, rendimentos, inflação, empresa): o balanço dela vai na primeira entrada visível do ano.
  const balancos = useMemo(() => {
    const m = new Map<number, Chip[]>();
    let regra: Entrada | undefined;
    for (const h of historico) {
      if (!visivel(h)) regra = h;
      else if (regra && h.idade === regra.idade) {
        const chips = balancoGuardado(regra, partes, participacao);
        if (chips.length > 0) m.set(h.id, chips);
        regra = undefined;
      }
    }
    return m;
  }, [historico, partes, participacao]);
  return (
    <ol class="linha-do-tempo" aria-label="Linha do tempo da vida">
      {historico.map((h, i) =>
        !visivel(h) ? null : (
          <Item
            h={h}
            nova={i >= novasDesde}
            inflacao={inflacao.has(h.id)}
            nomeDe={nomeDe}
            balanco={balancos.get(h.id) ?? []}
            porque={porqueGuardado(h, porId)}
            key={h.id}
          />
        ),
      )}
    </ol>
  );
}
