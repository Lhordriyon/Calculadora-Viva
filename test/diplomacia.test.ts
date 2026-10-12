/**
 * Incremento 10: o mundo lá fora. Quatro países fictícios com a economia e a
 * relação de cada um com o Brasil; sanções e acordos que nascem da relação
 * (e apontam a decisão que a mexeu); o dólar, que anda com o mundo e com as
 * contas daqui e pesa na inflação, no investimento e nos setores; e o ato de
 * quem governa lá fora.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { mercadoDoAno, motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { PARCEIROS, POLITICAS } from '../src/motor/constantes.ts';
import type { Conteudo } from '../src/motor/conteudo.ts';
import { alvoDaRelacao, anoDoExterior, chanceDeSancao, defEstrangeiro, exteriorNaEmpresa, parceirosDe, SEM_EXTERIOR } from '../src/motor/diplomacia.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { anoDoPais, defGoverno, faseDe, governoAtual, momentoTipico } from '../src/motor/pais.ts';
import { ATO, CAMBIO_BASE, REPASSE_DO_CAMBIO, SANCAO } from '../src/motor/regras.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { regraDoTrabalho } from '../src/motor/trabalho.ts';
import { nascer } from '../src/motor/vida.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

/** O mesmo conteúdo com os países de fora mudados (a crise certa num deles, sem sorte nos outros). */
function comEstrangeiros(mudar: (id: string) => Partial<Conteudo['mundo']['estrangeiros'][number]>): Conteudo {
  return { ...c, mundo: { ...c.mundo, estrangeiros: c.mundo.estrangeiros.map((d) => ({ ...d, ...mudar(d.id) })) } };
}

/** Um adulto de 40 anos num país em fase normal, com o governo dado e as políticas dele. */
function adulto(semente: number, governo = 'centrao'): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = 40;
  e.ano = 2066;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise']) delete pais.q[f];
  delete pais.q['regime'];
  pais.t['governo'] = governo;
  const def = defGoverno(c, governo);
  if (def) for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 8.5, divida: 75, pobreza: 25, violencia: 22, saude: 50, educacao: 50, aprovacao: 50, impulso: 0, cambio: CAMBIO_BASE });
  for (const p of parceirosDe(e)) {
    p.n['relacao'] = 50;
    delete p.q['sancao'];
    delete p.q['acordo'];
    delete p.q['crise'];
  }
  return e;
}

/** Presidente eleito no ano passado, com o mandato inteiro pela frente (o governo já é de quem joga). */
function presidente(semente: number): EstadoVida {
  const e = adulto(semente);
  const eu = e.entidades['eu']!;
  Object.assign(eu.n, { mandato: 4, popularidade: 50 });
  eu.t['cargo'] = 'presidente';
  e.ano = 2068;
  anoDoPais(e, c, []);
  e.ano++;
  e.idade++;
  return e;
}

const clonar = (e: EstadoVida): EstadoVida => JSON.parse(JSON.stringify(e)) as EstadoVida;

describe('o mundo em que se nasce', () => {
  it('tem os quatro países de fora, com a economia, a relação e o que compram do Brasil, e o dólar perto de R$ 5', () => {
    const dolares = new Set<number>();
    for (let i = 0; i < 12; i++) {
      const e = nascer(c, { semente: misturar(10, i), ano: 2026 });
      expect(parceirosDe(e).map((p) => p.id)).toEqual([...PARCEIROS]);
      for (const p of parceirosDe(e)) {
        expect(p.tipo).toBe('jurisdicao');
        expect(p.nome).toBe(defEstrangeiro(c, p.id)!.nome);
        expect(p.t['produtos']).toBeTruthy();
        expect(p.n['relacao']).toBeGreaterThanOrEqual(5);
        expect(p.n['relacao']).toBeLessThanOrEqual(95);
        expect(Number.isFinite(p.n['crescimento'])).toBe(true);
      }
      const dolar = e.entidades['pais']!.n['cambio']!;
      expect(dolar).toBeGreaterThan(3);
      expect(dolar).toBeLessThan(8);
      dolares.add(dolar);
    }
    // Cada vida nasce num mundo um pouco diferente.
    expect(dolares.size).toBeGreaterThan(6);
  });
});

describe('a relação, as sanções e os acordos', () => {
  it('o governo puxa a relação: sobe com quem ele se aproxima e cai com o rival desse país', () => {
    const e = adulto(1, 'alianca_da_ordem');
    const amiga = defGoverno(c, 'alianca_da_ordem')!.aproxima![0]!;
    const rival = defEstrangeiro(c, amiga)!.rival!;
    expect(alvoDaRelacao(e, c, defEstrangeiro(c, amiga)!)).toBeGreaterThan(alvoDaRelacao(e, c, defEstrangeiro(c, rival)!) + 20);
    for (let ano = 0; ano < 25; ano++) {
      e.ano++;
      anoDoExterior(e, c, []);
    }
    expect(e.entidades[amiga]!.n['relacao']!).toBeGreaterThan(e.entidades[rival]!.n['relacao']! + 15);
    expect(e.entidades[rival]!.n['relacao']).toBeLessThan(45);
  });

  it('a chance de sanção é zero acima do limite e cresce com o quadrado da distância', () => {
    expect(chanceDeSancao(SANCAO.abaixo)).toBe(0);
    expect(chanceDeSancao(80)).toBe(0);
    expect(chanceDeSancao(0)).toBeCloseTo(SANCAO.chance);
    expect(chanceDeSancao(SANCAO.abaixo / 2)).toBeCloseTo(SANCAO.chance / 4);
  });

  it('relação no chão vira sanção: uma notícia do mundo com o país como ator, que aponta a decisão que esfriou a relação; e acaba quando a relação volta', () => {
    const e = adulto(2);
    // A decisão: quem governava rompeu com a Celeste (o ato da folha País), e a relação ficou no chão.
    const ato = lancar(e, novaEntrada(e, { tipo: 'dinheiro', causa: 'acao', ref: 'pais:diplomacia', texto: 'Rompeu.', resumo: 'rompeu relações com a República Celeste' }), [{ c: 'celeste.relacao', d: -50 }]);
    let sancao: number | undefined;
    for (let ano = 0; ano < 15 && sancao === undefined; ano++) {
      e.entidades['celeste']!.n['relacao'] = 0;
      e.ano++;
      e.idade++;
      anoDoExterior(e, c, []);
      sancao = e.entidades['celeste']!.q['sancao']?.causa ?? undefined;
    }
    expect(sancao).toBeDefined();
    const noticia = e.historico.find((h) => h.id === sancao)!;
    expect(noticia).toMatchObject({ tipo: 'mundo', ref: 'exterior:sancao:celeste', ator: 'celeste' });
    expect(noticia.causas).toContain(ato.id);
    expect(porqueDe(noticia, new Map(e.historico.map((h) => [h.id, h])))?.texto).toBe('você rompeu relações com a República Celeste');
    // A relação volta para o alvo (o centrão não puxa para nenhum lado) e a sanção acaba.
    for (let ano = 0; ano < 30 && e.entidades['celeste']!.q['sancao']; ano++) {
      e.ano++;
      e.idade++;
      anoDoExterior(e, c, []);
    }
    expect(e.entidades['celeste']!.q['sancao']).toBeUndefined();
    expect(e.historico.some((h) => h.ref === 'exterior:fimDaSancao:celeste')).toBe(true);
  });

  it('acordo só com a fronteira aberta ou moderada: o governo de turno assina quando a relação é boa; com a fronteira fechada, nunca', () => {
    const aberto = adulto(3, 'bloco_liberal');
    const fechado = adulto(3, 'alianca_da_ordem');
    for (const e of [aberto, fechado]) for (const p of parceirosDe(e)) p.n['relacao'] = 90;
    for (let ano = 0; ano < 30; ano++) {
      for (const e of [aberto, fechado]) {
        e.ano++;
        anoDoExterior(e, c, []);
        for (const p of parceirosDe(e)) p.n['relacao'] = Math.max(p.n['relacao']!, 80);
      }
    }
    expect(parceirosDe(aberto).filter((p) => p.q['acordo']).length).toBeGreaterThan(0);
    expect(parceirosDe(fechado).filter((p) => p.q['acordo']).length).toBe(0);
  });
});

describe('o que chega aqui', () => {
  it('a crise lá fora vira notícia, tira crescimento daqui e faz o dólar saltar', () => {
    const comCrise = comEstrangeiros((id) => (id === 'federacao' ? { crise: 1, boom: 0 } : { crise: 0, boom: 0 }));
    const semCrise = comEstrangeiros(() => ({ crise: 0, boom: 0 }));
    let saltos = 0;
    for (let i = 0; i < 20; i++) {
      const a = adulto(misturar(4, i));
      const b = clonar(a);
      const fa = anoDoExterior(a, comCrise, []);
      const fb = anoDoExterior(b, semCrise, []);
      expect(fa.deFora).toBe('crise');
      expect(a.historico.find((h) => h.id === fa.origem)).toMatchObject({ tipo: 'mundo', ref: 'exterior:crise:federacao', ator: 'federacao' });
      expect(a.entidades['federacao']!.q['crise']?.causa).toBe(fa.origem);
      expect(fa.choque).toBeLessThan(fb.choque - 2);
      saltos += fa.cambio - fb.cambio;
    }
    expect(saltos / 20).toBeGreaterThan(0.1);
  });

  it('a crise de fora que vira a fase daqui é a primeira causa da virada', () => {
    const e = adulto(5);
    const noticia = lancar(e, novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: 'exterior:crise:federacao', ator: 'federacao', texto: 'Crise lá.', resumo: 'a Federação do Norte entrou em crise' }), []);
    anoDoPais(e, c, [], { choque: -9, deFora: 'crise', origem: noticia.id, cambio: 0 });
    expect(['recessao', 'crise']).toContain(faseDe(e));
    const virada = e.historico.findLast((h) => h.ref?.startsWith('ciclo:'))!;
    // A notícia vem antes de quem empurrou daqui (no mesmo ano, a linha do tempo mostra as duas, uma depois da outra).
    expect(virada.causas?.[0]).toBe(noticia.id);
  });

  it('o dólar que sobe passa para a inflação do ano', () => {
    const a = adulto(6);
    const b = clonar(a);
    anoDoPais(a, c, [], { ...SEM_EXTERIOR, cambio: 0.2 });
    anoDoPais(b, c, [], SEM_EXTERIOR);
    expect(a.entidades['pais']!.n['inflacao']! - b.entidades['pais']!.n['inflacao']!).toBeCloseTo(REPASSE_DO_CAMBIO * 100 * 0.2, 0);
  });

  it('o investimento em dólar rende o quanto o dólar subiu', () => {
    const a = adulto(7);
    const b = clonar(a);
    const ra = mercadoDoAno(a, c, 'normal', [], 0.15);
    const rb = mercadoDoAno(b, c, 'normal', [], 0);
    expect(ra.dolar - rb.dolar).toBeCloseTo(0.15, 6);
    expect(ra.acoes).toBe(rb.acoes);
  });

  it('o dólar alto ajuda quem exporta e aperta quem importa; a tarifa protege a indústria; a sanção de quem compra o setor dói', () => {
    const e = adulto(8, 'centrao');
    expect(exteriorNaEmpresa(e, c, 'agro', 0.1)).toBeGreaterThan(0);
    expect(exteriorNaEmpresa(e, c, 'comercio', 0.1)).toBeLessThan(0);
    expect(exteriorNaEmpresa(e, c, 'agro', -0.1)).toBeLessThan(0);
    const antes = exteriorNaEmpresa(e, c, 'industria', 0);
    e.entidades['pais']!.n['pol_comercio'] = 2;
    expect(exteriorNaEmpresa(e, c, 'industria', 0)).toBeGreaterThan(antes);
    const compradora = c.mundo.estrangeiros.find((d) => d.compra.includes('agro'))!;
    const semSancao = exteriorNaEmpresa(e, c, 'agro', 0);
    e.entidades[compradora.id]!.q['sancao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    expect(exteriorNaEmpresa(e, c, 'agro', 0)).toBeLessThan(semSancao);
  });

  it('o salário em dólar anda com o dólar, não com a crise daqui, e acaba com o emprego', () => {
    const e = adulto(9);
    const eu = e.entidades['eu']!;
    Object.assign(eu.n, { renda: 100000 });
    eu.t['setor'] = 'tecnologia';
    eu.t['ocupacao'] = 'programadora';
    eu.q['salario_em_dolar'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    const crise = { ...momentoTipico('crise'), cambio: 0.2 };
    const a = clonar(e);
    const b = clonar(e);
    delete b.entidades['eu']!.q['salario_em_dolar'];
    regraDoTrabalho(a, c, crise, []);
    regraDoTrabalho(b, c, crise, []);
    expect(a.entidades['eu']!.n['renda']).toBeGreaterThan(110000);
    expect(b.entidades['eu']!.n['renda']).toBeLessThan(a.entidades['eu']!.n['renda']!);
    operar(a, c, { tipo: 'demitir' });
    expect(a.entidades['eu']!.q['salario_em_dolar']).toBeUndefined();
  });
});

describe('quem governa lá fora', () => {
  it('só quem governa fala pelo país, e um ato lá fora por ano', () => {
    const cidadao = adulto(11);
    expect(motivoParaNaoOperar(cidadao, c, { tipo: 'diplomacia', parceiro: 'liga', acao: 'aproximar' })).toMatch(/só quem governa/);
    const e = presidente(12);
    expect(governoAtual(e)).toBe('voce');
    operar(e, c, { tipo: 'diplomacia', parceiro: 'liga', acao: 'aproximar' });
    expect(motivoParaNaoOperar(e, c, { tipo: 'diplomacia', parceiro: 'pacto', acao: 'aproximar' })).toMatch(/um ato lá fora por ano/);
  });

  it('a visita de Estado sobe a relação e esfria a do rival; é uma ação de quem joga, com resumo', () => {
    const e = presidente(13);
    const rival = defEstrangeiro(c, 'celeste')!.rival!;
    const antes = { celeste: e.entidades['celeste']!.n['relacao']!, rival: e.entidades[rival]!.n['relacao']! };
    const entrada = operar(e, c, { tipo: 'diplomacia', parceiro: 'celeste', acao: 'aproximar' });
    expect(entrada).toMatchObject({ causa: 'acao', ref: 'pais:diplomacia' });
    expect(entrada.resumo).toBeTruthy();
    expect(e.entidades['celeste']!.n['relacao']).toBe(antes.celeste + ATO.aproximar);
    expect(e.entidades[rival]!.n['relacao']).toBe(antes.rival + ATO.rival);
  });

  it('o acordo pede relação boa, fronteira aberta e nenhuma sanção; assinado, aponta para o ato', () => {
    const e = presidente(14);
    const op = { tipo: 'diplomacia', parceiro: 'pacto', acao: 'acordo' } as const;
    e.entidades['pacto']!.n['relacao'] = 40;
    expect(motivoParaNaoOperar(e, c, op)).toMatch(/a relação precisa chegar/);
    e.entidades['pacto']!.n['relacao'] = 75;
    e.entidades['pais']!.n['pol_comercio'] = 2;
    expect(motivoParaNaoOperar(e, c, op)).toMatch(/fronteira fechada/);
    e.entidades['pais']!.n['pol_comercio'] = 1;
    e.entidades['pacto']!.q['sancao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    expect(motivoParaNaoOperar(e, c, op)).toMatch(/sanção em vigor/);
    delete e.entidades['pacto']!.q['sancao'];
    const entrada = operar(e, c, op);
    expect(e.entidades['pacto']!.q['acordo']?.causa).toBe(entrada.id);
    expect(motivoParaNaoOperar(e, c, op)).toMatch(/um ato lá fora por ano|já está em vigor/);
  });

  it('romper derruba a relação, desfaz o acordo, dá popularidade e, muitas vezes, traz a sanção, que aponta para o rompimento', () => {
    let sancoes = 0;
    for (let i = 0; i < 20; i++) {
      const e = presidente(misturar(15, i));
      e.entidades['liga']!.q['acordo'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
      const rel = e.entidades['liga']!.n['relacao']!;
      const pop = e.entidades['eu']!.n['popularidade']!;
      const ato = operar(e, c, { tipo: 'diplomacia', parceiro: 'liga', acao: 'romper' });
      expect(e.entidades['liga']!.n['relacao']).toBe(Math.max(0, rel + ATO.romper));
      expect(e.entidades['liga']!.q['acordo']).toBeUndefined();
      expect(e.entidades['eu']!.n['popularidade']).toBe(pop + ATO.popularidade);
      for (let ano = 0; ano < 5 && !e.entidades['liga']!.q['sancao']; ano++) {
        e.ano++;
        e.idade++;
        anoDoPais(e, c, [], anoDoExterior(e, c, []));
      }
      const sancao = e.entidades['liga']!.q['sancao'];
      if (sancao) {
        sancoes++;
        expect(e.historico.find((h) => h.id === sancao.causa)!.causas).toContain(ato.id);
      }
    }
    expect(sancoes).toBeGreaterThanOrEqual(4);
  });
});

describe('save de antes do mundo lá fora', () => {
  it('ganha os quatro países e o dólar de sempre, sem sorteio, e a vida segue até o fim', () => {
    const vida = nascer(c, { semente: 51, ano: 2026 });
    for (const p of PARCEIROS) delete vida.entidades[p];
    delete vida.entidades['pais']!.n['cambio'];
    const lido = lerSave(escreverSave({ ...saveVazio(), vida }), c);
    const novo = lido.vida!;
    expect(parceirosDe(novo).map((p) => p.id)).toEqual([...PARCEIROS]);
    for (const p of parceirosDe(novo)) expect(p.n['relacao']).toBe(defEstrangeiro(c, p.id)!.relacao);
    expect(novo.entidades['pais']!.n['cambio']).toBe(CAMBIO_BASE);
    viverAteOFim(novo, c, 6);
    expect(novo.vivo).toBe(false);
  });
});
