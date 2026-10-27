import { describe, expect, it } from 'vitest';
import { EXES } from '../src/motor/constantes.ts';
import { carregarConteudo } from '../scripts/disco.ts';
import { ganhar } from '../src/motor/livro.ts';
import { criarPersonagem, morrerPersonagem } from '../src/motor/pessoas.ts';
import { atoresPossiveis, elegivel } from '../src/motor/storylets.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { regrasDosPersonagens } from '../src/motor/familia.ts';
import { momentoTipico } from '../src/motor/pais.ts';
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
    // O amor que foi embora continua existindo, como ex: também conta como um amor da vida.
    const comAmor = amostra.filter((e) => e.entidades['amor'] || EXES.some((x) => e.entidades[x])).length;
    const comFilho = amostra.filter((e) => e.entidades['filho']).length;
    expect(comAmor / amostra.length).toBeGreaterThan(0.5);
    // O robô aleatório recusa ou adia filhos em 2 de cada 3 vezes; mesmo assim, uma parte grande chega lá.
    expect(comFilho / amostra.length).toBeGreaterThan(0.2);
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

describe('quem vive de patrimônio', () => {
  it('a herdeira não é demitida: na crise, perde parte do que tem, com a fase como causa', () => {
    const e = nascer(c, { semente: 41, ano: 2026, origem: { classe: 5 } });
    const mae = e.entidades['mae']!;
    mae.t['ocupacao'] = 'herdeira';
    mae.t['setor'] = 'financas';
    mae.n['dinheiro'] = 5_000_000;
    delete mae.q['aposentado'];
    mae.nascimento = e.ano - 40;
    const crise = momentoTipico('crise');
    const antes = mae.n['dinheiro'];
    for (let i = 0; i < 20 && mae.vivo !== false; i++) {
      regrasDosPersonagens(e, c, [], crise);
      e.ano++;
    }
    expect(e.historico.some((h) => h.ref === 'regra:demitido' && h.ator === 'mae')).toBe(false);
    expect(e.historico.some((h) => h.ref === 'regra:perdeu_patrimonio' && h.ator === 'mae')).toBe(true);
    expect(mae.n['dinheiro'] ?? 0).toBeLessThan(antes);
  });

  it('ninguém nasce "herdeira desempregada", e a demissão de família rica não vem com cesta básica', () => {
    let deRenda = 0;
    for (let s = 1; s <= 80; s++) {
      const e = nascer(c, { semente: s, ano: 2026, origem: { classe: 6 } });
      for (const p of ['mae', 'pai']) {
        const en = e.entidades[p]!;
        if (c.mundo.classes[6]!.ocupacoes.some((o) => o.patrimonio && (o.m === en.t['ocupacao'] || o.f === en.t['ocupacao']))) {
          deRenda++;
          expect(en.q['desempregado'], `${s} ${p}`).toBeUndefined();
        }
      }
    }
    expect(deRenda).toBeGreaterThan(100);
    const rica = nascer(c, { semente: 5, ano: 2026, origem: { classe: 5 } });
    const pai = rica.entidades['pai']!;
    pai.t['ocupacao'] = 'diretor de multinacional';
    pai.t['setor'] = 'industria';
    pai.nascimento = rica.ano - 45;
    delete pai.q['desempregado'];
    delete pai.q['aposentado'];
    const crise = momentoTipico('crise');
    for (let i = 0; i < 40 && !rica.historico.some((h) => h.ref === 'regra:demitido' && h.ator === 'pai') && pai.vivo !== false; i++) {
      delete pai.q['desempregado'];
      regrasDosPersonagens(rica, c, [], crise);
    }
    const demissao = rica.historico.find((h) => h.ref === 'regra:demitido' && h.ator === 'pai');
    expect(demissao).toBeDefined();
    expect(demissao!.texto).not.toMatch(/cesta básica/);
  });
});
