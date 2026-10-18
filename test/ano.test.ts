import { beforeAll, describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, saveVazio } from '../src/jogo/salvar.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { cobre, dependenciasDoAno, ETAPAS_DO_ANO } from '../src/motor/manifesto.ts';
import { misturar } from '../src/motor/rng.ts';
import type { Estrategia } from '../src/motor/robos.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';
import { foraDa, gravarEtapas } from './gravador.ts';

const c = carregarConteudo();
const ESTRATEGIAS: Estrategia[] = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'];
/** Vidas variadas: sorteadas, de fortuna, de linhagem e de pobreza, com as quatro estratégias e um herdeiro. */
const ORIGENS = [undefined, undefined, { classe: 0 }, { classe: 5 }, { classe: 7 }, { linhagem: 'realeza' }, { linhagem: 'regime' }] as const;

function jogar(): EstadoVida[] {
  const vidas: EstadoVida[] = [];
  ORIGENS.forEach((origem, o) => {
    for (let k = 0; k < 3; k++) {
      let e = viverAteOFim(nascer(c, { semente: misturar(1303, o, k), ano: 2026, ...(origem ? { origem } : {}) }), c, k + 1, ESTRATEGIAS[(o + k) % 4]);
      vidas.push(e);
      if (herdeiroPossivel(e, c)) {
        e = viverAteOFim(continuarComoHerdeiro(e, c), c, k + 40, ESTRATEGIAS[(o + k + 1) % 4]);
        vidas.push(e);
      }
    }
  });
  return vidas;
}

let vidas: EstadoVida[] = [];
let gravado: ReturnType<typeof gravarEtapas>;
beforeAll(() => {
  gravado = gravarEtapas(() => {
    vidas = jogar();
  });
}, 120_000);

describe('o ano em etapas declaradas', () => {
  it('toda etapa roda, na ordem do manifesto', () => {
    expect([...gravado.keys()]).toEqual(ETAPAS_DO_ANO.map((x) => x.id));
  });

  it('nenhuma etapa lê o que não declarou', () => {
    const fora = ETAPAS_DO_ANO.map((x) => [x.id, foraDa(x.le, gravado.get(x.id)!.le)] as const).filter(([, l]) => l.length > 0);
    expect(fora).toEqual([]);
  });

  it('nenhuma etapa escreve o que não declarou (no estado nem no livro)', () => {
    const fora = ETAPAS_DO_ANO.map((x) => {
      const g = gravado.get(x.id)!;
      return [x.id, foraDa(x.escreve, new Set([...g.escreve, ...g.livro]))] as const;
    }).filter(([, l]) => l.length > 0);
    expect(fora).toEqual([]);
  });

  it('o gravador só olha: a vida jogada com ele é a mesma de sem ele', () => {
    const sem = jogar();
    expect(sem.map((e) => escreverSave({ ...saveVazio(), vida: e }))).toEqual(vidas.map((e) => escreverSave({ ...saveVazio(), vida: e })));
  }, 60_000);

  it('a ordem vira dado: o que cada etapa lê deste ano e o que lê do ano passado', () => {
    const deps = new Map(dependenciasDoAno().map((d) => [d.etapa, d]));
    const de = (etapa: string, lista: 'doAno' | 'doAnoPassado') => deps.get(etapa as never)![lista].map((x) => x.de);
    // A economia de quem joga lê a inflação e os juros deste ano (o país vem antes) e o salário do ano passado (o trabalho vem depois).
    expect(de('economia', 'doAno')).toEqual(expect.arrayContaining(['pais', 'mercado']));
    expect(de('economia', 'doAnoPassado')).toEqual(expect.arrayContaining(['trabalho']));
    // O poder lê a fama que a carreira escreveu neste ano.
    expect(de('poder', 'doAno')).toContain('carreira');
    // O diretor vem por último: tudo o que ele lê já é deste ano, menos o que ele mesmo escreve.
    expect(de('diretor', 'doAnoPassado')).toEqual(['diretor']);
    expect(cobre('eu.voto_*', 'eu.voto_centrao') && cobre('*', 'pais.juros') && !cobre('eu.renda', 'eu.renda_fixa')).toBe(true);
  });
});
