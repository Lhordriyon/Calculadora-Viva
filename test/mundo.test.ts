import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { cicloDoAno, defFase, faseDe } from '../src/motor/ciclo.ts';
import { patrimonioDe } from '../src/motor/campos.ts';
import { mercadoDoAno } from '../src/motor/carteira.ts';
import { economiaDoAno } from '../src/motor/economia.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { regrasDosPersonagens } from '../src/motor/familia.ts';
import { ganhar, novaEntrada } from '../src/motor/livro.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { regraDoPadrao, regraDoTrabalho } from '../src/motor/trabalho.ts';
import { nascer } from '../src/motor/vida.ts';
import { passo, viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

/** Um adulto de 30 anos com emprego no setor dado e o país na fase dada (com a entrada que a anunciou). */
function adulto(setor: string, fase: 'normal' | 'recessao' | 'crise', semente = 5): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  const eu = e.entidades['eu']!;
  Object.assign(eu.n, { renda: 40000, custo: 18000, dinheiro: 10000 });
  eu.t['setor'] = setor;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  if (fase !== 'normal') {
    const anuncio = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `ciclo:${fase}`, ator: 'pais', texto: 'O país mudou.' });
    ganhar(e, [], 'pais', fase, anuncio.id);
  }
  return e;
}

describe('o ciclo da economia', () => {
  it('muda de fase com uma entrada do mundo, e a fase do país guarda essa entrada como causa', () => {
    const e = adulto('comercio', 'normal');
    const vistas = new Set<string>();
    for (let ano = 0; ano < 400; ano++) {
      const antes = faseDe(e);
      cicloDoAno(e, c);
      const depois = faseDe(e);
      vistas.add(depois);
      if (depois === antes) continue;
      const anuncio = e.historico.at(-1)!;
      expect(anuncio.tipo).toBe('mundo');
      expect(anuncio.ref).toBe(`ciclo:${depois}`);
      if (depois !== 'normal') expect(e.entidades['pais']!.q[depois]!.causa).toBe(anuncio.id);
      // uma fase de cada vez
      expect(['expansao', 'recessao', 'crise'].filter((f) => e.entidades['pais']!.q[f]).length).toBeLessThanOrEqual(1);
    }
    expect([...vistas].sort()).toEqual(['crise', 'expansao', 'normal', 'recessao']);
  });

  it('segue as chances de transição dos dados', () => {
    const p = defFase(c, 'crise').transicoes.recessao ?? 0;
    let saiu = 0;
    const n = 3000;
    for (let i = 0; i < n; i++) {
      const e = adulto('comercio', 'crise', misturar(11, i));
      e.rng = criarRng(misturar(13, i));
      cicloDoAno(e, c);
      if (faseDe(e) === 'recessao') saiu++;
    }
    expect(Math.abs(saiu / n - p)).toBeLessThan(0.04);
  });
});

describe('o trabalho reage ao mundo', () => {
  function demissoes(setor: string, fase: 'normal' | 'crise', servidor = false): number {
    let n = 0;
    for (let i = 0; i < 2000; i++) {
      const e = adulto(setor, fase, misturar(3, i));
      if (servidor) ganhar(e, [], 'eu', 'servidor', null);
      e.rng = criarRng(misturar(17, i));
      regraDoTrabalho(e, c, defFase(c, fase), []);
      const item = e.agenda.find((a) => a.evento === 'demissao');
      if (!item) continue;
      n++;
      // Na crise, a demissão chega com a fase do país como causa.
      if (fase === 'crise') expect(item.origem).toBe(e.entidades['pais']!.q['crise']!.causa);
    }
    return n;
  }

  it('na crise, quem trabalha num setor sensível é bem mais demitido; servidor não é', () => {
    const normal = demissoes('construcao', 'normal');
    const crise = demissoes('construcao', 'crise');
    expect(normal).toBeGreaterThan(10);
    expect(crise).toBeGreaterThan(2 * normal);
    expect(demissoes('construcao', 'crise', true)).toBe(0);
  });

  it('o salário anda com o setor e com a fase', () => {
    const variacao = (fase: 'normal' | 'crise', setor: string): number => {
      const e = adulto(setor, fase);
      const reg: Mudanca[] = [];
      regraDoTrabalho(e, c, defFase(c, fase), reg);
      return (e.entidades['eu']!.n['renda'] ?? 0) - 40000;
    };
    expect(variacao('normal', 'industria')).toBeGreaterThan(variacao('crise', 'industria'));
    // a saúde quase não sente o ciclo; a construção sente muito
    expect(variacao('normal', 'saude') - variacao('crise', 'saude')).toBeLessThan(variacao('normal', 'construcao') - variacao('crise', 'construcao'));
  });

  it('o negócio da família pode quebrar na crise, levando parte do que foi guardado', () => {
    let quebrou: EstadoVida | null = null;
    for (let i = 0; i < 300 && !quebrou; i++) {
      const e = adulto('comercio', 'crise', misturar(23, i));
      const mae = e.entidades['mae']!;
      Object.assign(mae.n, { dinheiro: 500000, renda: 90000 });
      mae.t['setor'] = 'comercio';
      mae.nascimento = e.ano - 55;
      delete mae.q['desempregado'];
      delete mae.q['aposentado'];
      ganhar(e, [], 'mae', 'dono_do_negocio', null);
      ganhar(e, [], 'eu', 'negocio_familiar', null);
      e.rng = criarRng(misturar(29, i));
      const inicio = e.historico.length;
      regrasDosPersonagens(e, c, [], defFase(c, 'crise'));
      const entrada = e.historico.slice(inicio).find((h) => h.ref === 'regra:faliu');
      if (!entrada) continue;
      quebrou = e;
      expect(entrada.ator).toBe('mae');
      expect(entrada.causas).toEqual([e.entidades['pais']!.q['crise']!.causa]);
    }
    expect(quebrou).not.toBeNull();
    const mae = quebrou!.entidades['mae']!;
    expect(mae.q['dono_do_negocio']).toBeUndefined();
    expect(mae.q['desempregado']).toBeDefined();
    expect(mae.n['dinheiro']).toBeLessThan(500000 * 0.5);
    expect(quebrou!.entidades['eu']!.q['negocio_familiar']).toBeUndefined();
  });
});

describe('efeitos de riqueza', () => {
  function aplicar(e: EstadoVida, ef: Efeitos): Mudanca[] {
    const reg: Mudanca[] = [];
    aplicarEfeitos(e, c, ef, { origem: 0, reg, valores: {} });
    return reg;
  }

  it('o padrão de vida sobe com o patrimônio e corta pela metade', () => {
    const e = adulto('financas', 'normal');
    const eu = e.entidades['eu']!;
    Object.assign(eu.n, { dinheiro: 200000, renda_fixa: 800000, divida: 0, custo: 20000 });
    const reg = aplicar(e, { custoDoPatrimonio: 0.06 });
    expect(eu.n['custo']).toBeCloseTo(20000 + 0.06 * patrimonioDe(eu));
    expect(reg).toContainEqual({ c: 'eu.custo', d: 60000 });
    aplicar(e, { custoFator: 0.5 });
    expect(eu.n['custo']).toBeCloseTo(40000);
  });

  it('rendaFator multiplica a renda e copiar leva um campo de uma pessoa para outra', () => {
    const e = adulto('saude', 'normal');
    aplicar(e, { rendaFator: 1.25 });
    expect(e.entidades['eu']!.n['renda']).toBeCloseTo(50000);
    e.entidades['pai']!.t['setor'] = 'agro';
    aplicar(e, { 'eu.setor': { copiar: 'pai.setor' } });
    expect(e.entidades['eu']!.t['setor']).toBe('agro');
  });

  it('quem herda e sobe de padrão pode ver o dinheiro acabar; quem não sobe, não', () => {
    // Herdeiro sem renda, na renda fixa: com o padrão de 6% ao ano do que herdou, mais de 80% some em 30 anos (e em média vira dívida perto disso).
    const herdeiro = (padrao: boolean): number => {
      const e = adulto('comercio', 'normal');
      const eu = e.entidades['eu']!;
      Object.assign(eu.n, { renda: 0, dinheiro: 0, renda_fixa: 2000000, divida: 0, custo: 10000 });
      if (padrao) aplicar(e, { custoDoPatrimonio: 0.06 });
      e.rng = criarRng(1);
      let menor = Infinity;
      for (let ano = 0; ano < 30; ano++) {
        e.idade++;
        economiaDoAno(e, e.rng, [], undefined, mercadoDoAno(e, c, 'normal', []));
        menor = Math.min(menor, patrimonioDe(eu));
      }
      return menor;
    };
    expect(herdeiro(true)).toBeLessThan(400000);
    expect(herdeiro(false)).toBeGreaterThan(1500000);
  });
});

describe('a conta do padrão de vida', () => {
  it('chega quando o déficit come a reserva, com a escolha que subiu o padrão como causa', () => {
    const e = adulto('comercio', 'normal');
    const eu = e.entidades['eu']!;
    ganhar(e, [], 'eu', 'padrao_alto', 7);
    Object.assign(eu.n, { dinheiro: 0, renda_fixa: 400000, divida: 0 });
    regraDoPadrao(e, c, 50000);
    expect(e.agenda).toEqual([]);
    eu.n['renda_fixa'] = 200000;
    regraDoPadrao(e, c, 50000);
    expect(e.agenda).toEqual([{ evento: 'padrao_aperta', ano: e.ano, origem: 7 }]);
    // sem o padrão alto, déficit é só um ano ruim
    const outro = adulto('comercio', 'normal');
    regraDoPadrao(outro, c, 50000);
    expect(outro.agenda).toEqual([]);
  });
});

describe('save de antes do ciclo', () => {
  it('uma vida sem fase do país e sem setor continua jogando até o fim', () => {
    const vida = nascer(c, { semente: 31, ano: 2026 });
    const robo = criarRng(4);
    while (vida.idade < 30) passo(vida, c, robo);
    for (const p of ['eu', 'mae', 'pai']) delete vida.entidades[p]!.t['setor'];
    for (const f of ['expansao', 'recessao', 'crise']) delete vida.entidades['pais']!.q[f];
    vida.historico = vida.historico.filter((h) => h.tipo !== 'mundo');
    const lido = lerSave(escreverSave({ ...saveVazio(), vida }), c);
    expect(lido.vida).not.toBeNull();
    viverAteOFim(lido.vida!, c, 4);
    expect(lido.vida!.vivo).toBe(false);
  });
});
