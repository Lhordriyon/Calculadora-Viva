/**
 * O Estado pesquisa (bloco D): a política de ciência entra no gasto do governo, o estoque de tecnologia anda com ela e
 * com a escola e vira crescimento, saúde e tração das empresas; as descobertas e a fuga de cérebros apontam a decisão
 * que levou a ciência até ali; a carreira de cientista anda com a verba; o save antigo ganha a tecnologia.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { operar } from '../src/motor/carteira.ts';
import { chanceDeEntrar, defCarreira } from '../src/motor/carreira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { causasDe } from '../src/motor/condicoes.ts';
import { alvoDaTracao } from '../src/motor/empresa.ts';
import { anoDoPais, defGoverno, potencialDe, primarioDe, rumoDoPais } from '../src/motor/pais.ts';
import { causaDaPesquisa, gastoEmPesquisa, regraDaPesquisa, verbaDe } from '../src/motor/pesquisa.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { novaEntidade } from '../src/motor/pessoas.ts';
import { PESQUISA, VERBA_DA_CARREIRA } from '../src/motor/regras.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Um adulto de 40 anos num país em fase normal, com o centrão no governo. */
function adulto(semente: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = 40;
  e.ano = 2066;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise', 'regime', 'calote']) delete pais.q[f];
  pais.t['governo'] = 'centrao';
  const def = defGoverno(c, 'centrao')!;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 9, divida: 75, impulso: 0, aprovacao: 50, educacao: 50, tecnologia: 50 });
  return e;
}

/** Quem joga governa o país e decide a ciência numa reforma (a entrada da reforma volta). */
function reformar(e: EstadoVida, nivel: number): number {
  governar(e);
  return operar(e, c, { tipo: 'politica', politica: 'pesquisa', nivel }).id;
}


/** Quem joga governa o país: o governo é dele, e o cargo de presidente também (com o mandato pela frente). */
function governar(e: EstadoVida): void {
  e.entidades['pais']!.t['governo'] = 'voce';
  e.entidades['eu']!.t['cargo'] = 'presidente';
  e.entidades['eu']!.n['mandato'] = 3;
}

describe('a política de ciência', () => {
  it('é paga pelo Tesouro: com a prioridade, o governo gasta 0,6 ponto do PIB a mais do que com a ciência cortada', () => {
    const e = adulto(1);
    e.entidades['pais']!.n['pol_pesquisa'] = 0;
    const cortada = primarioDe(e, c);
    const gastoCortada = gastoEmPesquisa(e, c);
    e.entidades['pais']!.n['pol_pesquisa'] = 2;
    expect(cortada - primarioDe(e, c)).toBeCloseTo(0.6, 5);
    const g = gastoEmPesquisa(e, c);
    expect(g.pontos).toBeCloseTo(PESQUISA.base + 0.4, 5);
    expect(gastoCortada.pontos).toBeCloseTo(PESQUISA.base - 0.2, 5);
    expect(g.reais).toBeCloseTo((e.entidades['pais']!.n['pib']! * g.pontos) / 100, 0);
  });

  it('cada bloco tem o seu nível, e o governo que assume traz o dele', () => {
    expect(defGoverno(c, 'frente_popular')!.politicas.pesquisa).toBe(2);
    expect(defGoverno(c, 'bloco_liberal')!.politicas.pesquisa).toBe(0);
    expect(defGoverno(c, 'regime')!.politicas.pesquisa).toBe(2);
  });
});

describe('o estoque de tecnologia', () => {
  const tecnologiaCom = (nivel: number, anos: number): number => {
    const e = adulto(10);
    e.entidades['pais']!.n['pol_pesquisa'] = nivel;
    for (let i = 0; i < anos; i++) {
      e.ano++;
      anoDoPais(e, c, []);
      // As eleições do caminho trocam o governo: a ciência fica onde o teste a pôs.
      e.entidades['pais']!.n['pol_pesquisa'] = nivel;
    }
    return e.entidades['pais']!.n['tecnologia']!;
  };

  it('anda devagar para onde a ciência leva: depois de 20 anos, a prioridade fica mais de 15 pontos acima da ciência cortada', () => {
    expect(tecnologiaCom(2, 20)).toBeGreaterThan(55);
    expect(tecnologiaCom(0, 20)).toBeLessThan(45);
    expect(tecnologiaCom(2, 20) - tecnologiaCom(0, 20)).toBeGreaterThan(15);
    // Devagar: em 3 anos, a prioridade não andou nem um quarto do caminho.
    expect(tecnologiaCom(2, 3)).toBeLessThan(50 + 15 / 4);
  });

  it('a escola forma quem pesquisa: o alvo sobe com a educação', () => {
    const e = adulto(11);
    const sem = rumoDoPais(e, c).tecnologia;
    e.entidades['pais']!.n['educacao'] = 70;
    expect(rumoDoPais(e, c).tecnologia - sem).toBeCloseTo(PESQUISA.educacao * 20, 5);
  });

  it('volta como crescimento potencial e saúde pública', () => {
    const e = adulto(12);
    const pot = potencialDe(e, c);
    const saude = rumoDoPais(e, c).saude;
    e.entidades['pais']!.n['tecnologia'] = 70;
    expect(potencialDe(e, c) - pot).toBeCloseTo(PESQUISA.potencial * 20, 5);
    expect(rumoDoPais(e, c).saude - saude).toBeCloseTo(PESQUISA.saude * 20, 5);
  });

  it('puxa a tração das empresas de tecnologia mais do que a das outras', () => {
    const e = adulto(13);
    const emp = novaEntidade({ id: 'empresa', tipo: 'empresa', nome: 'Teste Labs', vivo: true });
    emp.t['setor'] = 'tecnologia';
    emp.n['valor'] = 1_000_000;
    e.entidades['empresa'] = emp;
    const antes = alvoDaTracao(e, c, emp);
    e.entidades['pais']!.n['tecnologia'] = 70;
    expect(alvoDaTracao(e, c, emp) - antes).toBeCloseTo(0.04 * 20, 5);
    emp.t['setor'] = 'comercio';
    const comercio = alvoDaTracao(e, c, emp);
    e.entidades['pais']!.n['tecnologia'] = 50;
    expect(alvoDaTracao(e, c, emp)).toBeCloseTo(comercio, 5);
  });

  it('o save de antes da pesquisa ganha a tecnologia e a ciência do governo de agora no primeiro ano', () => {
    const e = adulto(14);
    e.entidades['pais']!.t['governo'] = 'frente_popular';
    delete e.entidades['pais']!.n['tecnologia'];
    delete e.entidades['pais']!.n['pol_pesquisa'];
    e.ano++;
    anoDoPais(e, c, []);
    expect(e.entidades['pais']!.n['tecnologia']).toBeGreaterThan(50);
    expect(e.entidades['pais']!.n['pol_pesquisa']).toBeDefined();
  });
});

describe('as descobertas e a fuga de cérebros', () => {
  it('com a tecnologia alta, o país descobre alguma coisa, com a reforma que pôs a ciência como prioridade de causa', () => {
    const e = adulto(20);
    const reforma = reformar(e, 2);
    e.entidades['pais']!.n['tecnologia'] = 90;
    const descobertas: number[] = [];
    for (let i = 0; i < 40; i++) {
      e.ano++;
      e.idade++;
      const antes = e.historico.length;
      regraDaPesquisa(e, c);
      for (const h of e.historico.slice(antes)) if (h.ref?.startsWith('pesquisa:')) descobertas.push(e.ano);
      if (e.historico.length > antes) {
        const h = e.historico[e.historico.length - 1]!;
        expect(h.tipo).toBe('mundo');
        // A reforma fica como causa enquanto estiver nos últimos 30 anos.
        if (e.ano - 2066 <= PESQUISA.descoberta.causa) expect(h.causas).toEqual([reforma]);
        expect(h.texto.length).toBeGreaterThan(20);
      }
    }
    expect(descobertas.length).toBeGreaterThan(2);
    // No máximo uma a cada quatro anos.
    for (let i = 1; i < descobertas.length; i++) expect(descobertas[i]! - descobertas[i - 1]!).toBeGreaterThanOrEqual(PESQUISA.descoberta.intervalo);
  });

  it('cada descoberta mexe no país e chega à vida de quem joga no ano seguinte, com ela de causa', () => {
    const e = adulto(21);
    reformar(e, 2);
    e.entidades['pais']!.n['tecnologia'] = 95;
    for (let i = 0; i < 60 && !e.historico.some((h) => h.ref === 'pesquisa:cura'); i++) {
      e.ano++;
      e.idade = 40;
      e.agenda = [];
      const saude = e.entidades['pais']!.n['saude']!;
      regraDaPesquisa(e, c);
      const ultima = e.historico[e.historico.length - 1]!;
      if (ultima.ref === 'pesquisa:cura') {
        expect(e.entidades['pais']!.n['saude']! - saude).toBeCloseTo(PESQUISA.efeitos.cura, 5);
        expect(e.agenda).toEqual([{ evento: 'a_vacina_no_posto', ano: e.ano + 1, origem: ultima.id }]);
      }
    }
    expect(e.historico.some((h) => h.ref === 'pesquisa:cura')).toBe(true);
  });

  it('abaixo de 55, nada se descobre', () => {
    const e = adulto(22);
    e.entidades['pais']!.n['tecnologia'] = 54;
    for (let i = 0; i < 30; i++) {
      e.ano++;
      regraDaPesquisa(e, c);
    }
    expect(e.historico.some((h) => h.ref?.startsWith('pesquisa:'))).toBe(false);
  });

  it('com a ciência cortada e a tecnologia baixa, os cientistas vão embora, com o corte de causa', () => {
    const e = adulto(23);
    const corte = reformar(e, 0);
    e.entidades['pais']!.n['tecnologia'] = 35;
    let fuga = null as null | (typeof e.historico)[number];
    for (let i = 0; i < 40 && !fuga; i++) {
      e.ano++;
      const tec = e.entidades['pais']!.n['tecnologia']!;
      regraDaPesquisa(e, c);
      fuga = e.historico.find((h) => h.ref === 'pesquisa:fugaDeCerebros') ?? null;
      if (fuga) expect(e.entidades['pais']!.n['tecnologia']).toBeCloseTo(tec - PESQUISA.fuga.perda, 5);
    }
    expect(fuga?.causas).toEqual([corte]);
  });

  it('a causa é a decisão mais recente que pôs a ciência como prioridade: o estoque ainda carrega o que ela fez, mesmo desfeita', () => {
    const e = adulto(24);
    const subiu = reformar(e, 2);
    e.ano++;
    const voltou = reformar(e, 1);
    expect(causaDaPesquisa(e, 2)).toBe(subiu);
    // Subir de cortada para o regular não é pôr como prioridade.
    expect(causaDaPesquisa(e, 2)).not.toBe(voltou);
    e.ano++;
    const deNovo = reformar(e, 2);
    expect(causaDaPesquisa(e, 2)).toBe(deNovo);
    // O país em que se nasce não tem decisão.
    expect(causaDaPesquisa(adulto(25), 2)).toBeNull();
  });

  it('a posse de quem mantém a ciência como prioridade também é causa (a reeleição de quem pesquisa é decisão)', () => {
    const e = adulto(26);
    e.entidades['pais']!.n['pol_pesquisa'] = 2;
    // Nascido com a prioridade, sem decisão nesta vida; depois, a posse do governo que a manteve (sem mudar o nível).
    expect(causaDaPesquisa(e, 2)).toBeNull();
    e.ano++;
    const posse = lancar(e, novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: 'governo:frente_popular', ator: 'pais', texto: 'Posse.' }), []);
    expect(causaDaPesquisa(e, 2)).toBe(posse.id);
    // A posse não é causa de um nível que ela não deixou.
    expect(causaDaPesquisa(e, 0)).toBeNull();
  });
});

describe('a ciência na vida de quem joga', () => {
  it('a vaga e a promoção de cientista andam com a verba: metade cortada, 1,6 vez com a prioridade', () => {
    const e = adulto(30);
    const def = defCarreira(c, 'pesquisador')!;
    e.entidades['pais']!.n['pol_pesquisa'] = 1;
    const regular = chanceDeEntrar(e, def);
    e.entidades['pais']!.n['pol_pesquisa'] = 0;
    expect(chanceDeEntrar(e, def)).toBeCloseTo(regular * VERBA_DA_CARREIRA[0], 5);
    e.entidades['pais']!.n['pol_pesquisa'] = 2;
    expect(verbaDe(e, def.verba)).toBe(VERBA_DA_CARREIRA[2]);
    // Quem não depende da ciência não sente.
    expect(verbaDe(e, defCarreira(c, 'medico')!.verba)).toBe(1);
  });

  it('o storylet que lê a ciência aponta a reforma que a pôs ali', () => {
    const e = adulto(31);
    const reforma = reformar(e, 0);
    const s = c.porId.get('greve_da_federal')!;
    expect(causasDe(s.condicoes, e)).toContain(reforma);
  });
});
