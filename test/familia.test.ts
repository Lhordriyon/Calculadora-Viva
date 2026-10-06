import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { ganhar } from '../src/motor/livro.ts';
import { criarPersonagem, morrerPersonagem } from '../src/motor/pessoas.ts';
import { atoresPossiveis, elegivel } from '../src/motor/storylets.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { passo, viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

function vidas(n: number, semente: number): EstadoVida[] {
  return Array.from({ length: n }, (_, i) => viverAteOFim(nascer(c, { semente: misturar(semente, i), ano: 2026 }), c, i));
}

describe('família viva', () => {
  const amostra = vidas(120, 71);

  it('os pais envelhecem, adoecem e morrem pelas regras, com causa no livro', () => {
    const mortes = amostra.flatMap((e) => e.historico.filter((h) => h.ref === 'regra:faleceu'));
    expect(mortes.length).toBeGreaterThan(200);
    for (const e of amostra) {
      for (const papel of ['mae', 'pai']) {
        const en = e.entidades[papel]!;
        if (en.vivo !== false) continue;
        const q = en.q['faleceu'];
        expect(q, papel).toBeDefined();
        expect(e.historico.find((h) => h.id === q!.causa)?.ator).toBe(papel);
      }
    }
    expect(amostra.some((e) => e.historico.some((h) => h.ref === 'regra:adoeceu'))).toBe(true);
    expect(amostra.some((e) => e.historico.some((h) => h.ref === 'regra:demitido'))).toBe(true);
  });

  it('a maioria das vidas tem um amor, e muitas têm filhos', () => {
    const comAmor = amostra.filter((e) => e.entidades['amor']).length;
    const comFilho = amostra.filter((e) => e.entidades['filho']).length;
    expect(comAmor / amostra.length).toBeGreaterThan(0.5);
    expect(comFilho / amostra.length).toBeGreaterThan(0.3);
    // personagens novos nascem com traço
    for (const e of amostra) for (const p of ['amor', 'filho']) if (e.entidades[p]) expect(e.entidades[p]!.t['traco'], p).toBeTruthy();
  });

  it('personagens agem por conta própria (iniciativas com causa "npc" ou trazidas por eles)', () => {
    const iniciativas = amostra.flatMap((e) => e.historico.filter((h) => h.tipo === 'npc' && !h.ref?.startsWith('regra:')));
    expect(iniciativas.length / amostra.length).toBeGreaterThan(3);
    const papeis = new Set(iniciativas.map((h) => h.ator));
    for (const p of ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho']) expect(papeis.has(p), p).toBe(true);
  });

  it('os storylets de vínculo baixo e de luto do bicho ficam elegíveis quando o estado pede', () => {
    const e = nascer(c, { semente: 9, ano: 2026 });
    e.idade = 60;
    const reg: Mudanca[] = [];
    criarPersonagem(e, c, 'amor', reg);
    criarPersonagem(e, c, 'filho', reg);
    criarPersonagem(e, c, 'pet', reg);
    e.entidades['filho']!.nascimento = e.ano - 30;
    e.entidades['pet']!.nascimento = e.ano - 14;
    for (const m of ['namoro', 'pai_mae', 'caramelo']) ganhar(e, reg, 'eu', m, null);
    e.entidades['amor']!.n['vinculo'] = 25;
    e.entidades['filho']!.n['vinculo'] = 40;
    morrerPersonagem(e, 'pet', reg, 1);
    const pode = (id: string, papel: string): boolean => {
      const s = c.porId.get(id)!;
      return atoresPossiveis(s, e).includes(papel) && elegivel(s, e, papel);
    };
    expect(pode('fim_do_amor', 'amor')).toBe(true);
    expect(pode('filho_distante', 'filho')).toBe(true);
    expect(pode('luto_do_bicho', 'pet')).toBe(true);
  });
});

describe('herança e viuvez', () => {
  it('a herança dos pais se divide entre os irmãos', () => {
    const e = nascer(c, { semente: 5, ano: 2026 });
    e.idade = 40;
    e.entidades['eu']!.n['irmaos'] = 3;
    e.entidades['pai']!.vivo = false;
    e.entidades['mae']!.n['dinheiro'] = 100000;
    const antes = e.entidades['eu']!.n['dinheiro'] ?? 0;
    const reg: Mudanca[] = [];
    const herdou = morrerPersonagem(e, 'mae', reg, 1);
    expect(herdou).toBeCloseTo(25000, 0);
    expect((e.entidades['eu']!.n['dinheiro'] ?? 0) - antes).toBeCloseTo(25000, 0);
    expect(e.entidades['eu']!.q['herdou']).toBeDefined();
    expect(reg.some((m) => m.c === 'eu.felicidade' && (m.d ?? 0) < 0)).toBe(true);
  });

  it('a morte do amor depois de um casamento deixa viúvo; namoro curto, não', () => {
    const casado = nascer(c, { semente: 6, ano: 2026 });
    const robo = criarRng(6);
    while (casado.idade < 30) passo(casado, c, robo);
    casado.pendente = null;
    if (!casado.entidades['amor']) {
      casado.entidades['amor'] = structuredClone({ ...casado.entidades['amigo']!, id: 'amor' });
    }
    casado.entidades['amor']!.vivo = true;
    ganhar(casado, [], 'eu', 'namoro', null);
    ganhar(casado, [], 'eu', 'casado', null);
    morrerPersonagem(casado, 'amor', [], 1);
    expect(casado.entidades['eu']!.q['viuvo']).toBeDefined();
    expect(casado.entidades['eu']!.q['casado']).toBeUndefined();
    expect(casado.entidades['eu']!.q['namoro']).toBeUndefined();

    const namoro = structuredClone(casado);
    delete namoro.entidades['eu']!.q['viuvo'];
    namoro.entidades['amor']!.vivo = true;
    ganhar(namoro, [], 'eu', 'namoro', null);
    morrerPersonagem(namoro, 'amor', [], 1);
    expect(namoro.entidades['eu']!.q['viuvo']).toBeUndefined();
  });
});
