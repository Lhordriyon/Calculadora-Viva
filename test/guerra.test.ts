/**
 * A defesa e a guerra (bloco E): a política de defesa entra no gasto do governo e leva a capacidade das Forças Armadas
 * com a tecnologia; quem governa encomenda sistemas de armamento, que vão para a dívida na hora e chegam anos depois; a
 * capacidade dissuade; a guerra começa com quem sanciona e anda frio, apontando quem esfriou a relação e quem
 * desmobilizou, custa ao país todo ano e acaba em vitória, derrota ou cessar-fogo, mais depressa com o pedido de paz.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { inimigoDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { defCarreira, chanceDeEntrar } from '../src/motor/carreira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { anoDoExterior } from '../src/motor/diplomacia.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { ameacaDeGuerra, chanceDeGuerra, chancesDoFim, encomendasPendentes, regraDaGuerra } from '../src/motor/guerra.ts';
import { ESCRITAS_DO_MOTOR, ETAPAS_DO_ANO, VONTADES } from '../src/motor/manifesto.ts';
import { anoDoPais, defGoverno, primarioDe, rumoDoPais } from '../src/motor/pais.ts';
import { criarPersonagem, novaEntidade } from '../src/motor/pessoas.ts';
import { DEFESA, VERBA_DA_CARREIRA } from '../src/motor/regras.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { Entrada, EstadoVida } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { passo } from './apoio.ts';
import { foraDa, gravarEtapas } from './gravador.ts';

const c = carregarConteudo();

/** Quem joga com `idade` anos, num ano sem eleição nem posse, num país em paz, com o centrão no governo e a capacidade em 50. */
function adulto(semente: number, idade = 40): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = idade;
  e.ano = 2026 + idade;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise', 'regime', 'calote']) delete pais.q[f];
  pais.t['governo'] = 'centrao';
  const def = defGoverno(c, 'centrao')!;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 9, divida: 75, impulso: 0, aprovacao: 50, educacao: 50, tecnologia: 50, defesa: 50 });
  for (const id of ['federacao', 'celeste', 'liga', 'pacto']) {
    const en = e.entidades[id]!;
    for (const q of ['sancao', 'acordo', 'crise', 'guerra']) delete en.q[q];
    en.n['relacao'] = 50;
  }
  return e;
}

/** A Celeste sanciona o Brasil e anda hostil. */
function ameacar(e: EstadoVida, relacao = 10): void {
  const cel = e.entidades['celeste']!;
  cel.q['sancao'] ??= { v: 1, ano: e.ano, idade: e.idade, causa: null };
  cel.n['relacao'] = relacao;
}

/** Anos da defesa, só a etapa da guerra, até a guerra começar (ou 200 anos): devolve a notícia do começo. */
function ateComecar(e: EstadoVida, antesDoAno?: (e: EstadoVida) => void): Entrada | null {
  for (let i = 0; i < 200; i++) {
    e.ano++;
    antesDoAno?.(e);
    const antes = e.historico.length;
    regraDaGuerra(e, c);
    const comeco = e.historico.slice(antes).find((h) => h.ref?.startsWith('guerra:guerra:'));
    if (comeco) return comeco;
  }
  return null;
}

/** Anos da guerra em curso, só a etapa da guerra, até ela acabar: devolve a notícia do fim e quantos anos durou. */
function ateAcabar(e: EstadoVida, antesDoAno?: (e: EstadoVida) => void): { fim: Entrada; anos: number } {
  const comeco = inimigoDe(e)!.q['guerra']!.ano;
  for (let i = 0; i < 50; i++) {
    e.ano++;
    antesDoAno?.(e);
    const antes = e.historico.length;
    regraDaGuerra(e, c);
    const fim = e.historico.slice(antes).find((h) => /^guerra:(vitoria|derrota|cessarFogo):/.test(h.ref ?? ''));
    if (fim) return { fim, anos: e.ano - comeco };
  }
  throw new Error('a guerra não acabou');
}


/** Quem joga governa o país: o governo é dele, e o cargo de presidente também (com o mandato pela frente). */
function governar(e: EstadoVida): void {
  e.entidades['pais']!.t['governo'] = 'voce';
  e.entidades['eu']!.t['cargo'] = 'presidente';
  e.entidades['eu']!.n['mandato'] = 3;
}

describe('a capacidade das Forças Armadas', () => {
  it('é paga pelo Tesouro: a defesa reforçada gasta 0,8 ponto do PIB a mais do que a desmobilizada', () => {
    const e = adulto(1);
    e.entidades['pais']!.n['pol_defesa'] = 0;
    const desmobilizada = primarioDe(e, c);
    e.entidades['pais']!.n['pol_defesa'] = 2;
    expect(desmobilizada - primarioDe(e, c)).toBeCloseTo(0.8, 5);
  });

  it('cada bloco tem o seu nível: a aliança da ordem e o regime reforçam, a frente popular desmobiliza', () => {
    expect(defGoverno(c, 'alianca_da_ordem')!.politicas.defesa).toBe(2);
    expect(defGoverno(c, 'regime')!.politicas.defesa).toBe(2);
    expect(defGoverno(c, 'frente_popular')!.politicas.defesa).toBe(0);
    expect(defGoverno(c, 'bloco_liberal')!.politicas.defesa).toBe(1);
    expect(defGoverno(c, 'centrao')!.politicas.defesa).toBe(1);
  });

  const capacidadeCom = (nivel: number, anos: number): number => {
    const e = adulto(10);
    e.ano = 2069;
    e.entidades['pais']!.n['pol_defesa'] = nivel;
    for (let i = 0; i < anos; i++) {
      e.ano++;
      anoDoPais(e, c, []);
      // As eleições do caminho trocam o governo: a defesa fica onde o teste a pôs.
      e.entidades['pais']!.n['pol_defesa'] = nivel;
    }
    return e.entidades['pais']!.n['defesa']!;
  };

  it('anda devagar para onde a política leva: em 25 anos, a reforçada fica mais de 20 pontos acima da desmobilizada', () => {
    expect(capacidadeCom(2, 25)).toBeGreaterThan(58);
    expect(capacidadeCom(0, 25)).toBeLessThan(42);
    expect(capacidadeCom(2, 25) - capacidadeCom(0, 25)).toBeGreaterThan(20);
    // Devagar: em 3 anos, a reforçada não andou nem um terço do caminho.
    expect(capacidadeCom(2, 3)).toBeLessThan(50 + 15 / 3);
  });

  it('a tecnologia arma melhor: o alvo sobe 0,3 ponto por ponto de tecnologia acima de 50', () => {
    const e = adulto(11);
    const sem = rumoDoPais(e, c).defesa;
    e.entidades['pais']!.n['tecnologia'] = 70;
    expect(rumoDoPais(e, c).defesa - sem).toBeCloseTo(DEFESA.tecnologia * 20, 5);
  });

  it('o save de antes da defesa ganha a capacidade e a política do governo de agora no primeiro ano', () => {
    const e = adulto(12);
    e.ano = 2069;
    e.entidades['pais']!.t['governo'] = 'alianca_da_ordem';
    delete e.entidades['pais']!.n['defesa'];
    delete e.entidades['pais']!.n['pol_defesa'];
    e.ano++;
    anoDoPais(e, c, []);
    expect(e.entidades['pais']!.n['defesa']).toBeGreaterThan(50);
    expect(e.entidades['pais']!.n['pol_defesa']).toBe(2);
  });

  it('a vaga de militar anda com a verba da defesa', () => {
    const e = adulto(13, 20);
    const def = defCarreira(c, 'militar')!;
    e.entidades['pais']!.n['pol_defesa'] = 1;
    const regular = chanceDeEntrar(e, def);
    e.entidades['pais']!.n['pol_defesa'] = 0;
    expect(chanceDeEntrar(e, def)).toBeCloseTo(regular * VERBA_DA_CARREIRA[0], 5);
  });
});

describe('os sistemas de armamento', () => {
  it('só quem governa encomenda; a dívida sobe o custo na hora, e a entrega soma a capacidade, com a encomenda de causa', () => {
    const e = adulto(20);
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'antiaerea' })).toBe('só quem governa encomenda armamento');
    governar(e);
    const divida = e.entidades['pais']!.n['divida']!;
    const encomenda = operar(e, c, { tipo: 'sistema', sistema: 'antiaerea' });
    expect(encomenda.ref).toBe('defesa:sistema:antiaerea');
    expect(encomenda.tipo).toBe('dinheiro');
    expect(e.entidades['pais']!.n['divida']! - divida).toBeCloseTo(0.3, 5);
    expect(encomendasPendentes(e, c).get('antiaerea')).toEqual({ entrada: encomenda.id, entrega: e.ano + 2 });
    const ano0 = e.ano;
    for (let i = 1; i <= 3; i++) {
      e.ano = ano0 + i;
      const capacidade = e.entidades['pais']!.n['defesa']!;
      const antes = e.historico.length;
      regraDaGuerra(e, c);
      const entrega = e.historico.slice(antes).find((h) => h.ref === 'defesa:entrega:antiaerea');
      if (i === 2) {
        expect(entrega?.causas).toEqual([encomenda.id]);
        expect(entrega?.tipo).toBe('mundo');
        expect(e.entidades['pais']!.n['defesa']! - capacidade).toBeCloseTo(3, 5);
      } else {
        expect(entrega).toBeUndefined();
      }
    }
    expect(encomendasPendentes(e, c).size).toBe(0);
  });

  it('o que foi encomendado e ainda não chegou passa a quem herda: entra na capacidade do país herdado', () => {
    const e = adulto(22, 60);
    governar(e);
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
    operar(e, c, { tipo: 'sistema', sistema: 'submarino' });
    const capacidade = e.entidades['pais']!.n['defesa']!;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    expect(h.entidades['pais']!.n['defesa']).toBeCloseTo(capacidade + 7, 5);
    // O livro novo não tem a encomenda: nada chega duas vezes.
    expect(encomendasPendentes(h, c).size).toBe(0);
  });

  it('uma encomenda por ano, a mesma só depois da entrega, e o satélite militar pede tecnologia 55', () => {
    const e = adulto(21);
    governar(e);
    operar(e, c, { tipo: 'sistema', sistema: 'cacas' });
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'submarino' })).toBe('uma encomenda por ano');
    e.ano++;
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'cacas' })).toBe(`a encomenda anterior chega em ${e.ano + 2}`);
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'submarino' })).toBeNull();
    e.entidades['pais']!.n['tecnologia'] = 50;
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'satelite_militar' })).toBe('pede tecnologia 55 (o país tem 50)');
    e.entidades['pais']!.n['tecnologia'] = 60;
    expect(motivoParaNaoOperar(e, c, { tipo: 'sistema', sistema: 'satelite_militar' })).toBeNull();
  });
});

describe('a guerra', () => {
  it('a dissuasão: a chance dobra a cada 15 pontos de capacidade abaixo de 50 e cai à metade acima, até o teto', () => {
    expect(chanceDeGuerra(50)).toBeCloseTo(0.05, 9);
    expect(chanceDeGuerra(35)).toBeCloseTo(0.1, 9);
    expect(chanceDeGuerra(65)).toBeCloseTo(0.025, 9);
    expect(chanceDeGuerra(0)).toBe(DEFESA.guerra.teto);
  });

  it('só ameaça quem sanciona e anda frio; em guerra, ou logo depois de uma, ninguém ameaça', () => {
    const e = adulto(30);
    expect(ameacaDeGuerra(e)).toBeNull();
    ameacar(e, 30);
    expect(ameacaDeGuerra(e)).toBeNull();
    ameacar(e, 20);
    expect(ameacaDeGuerra(e)?.pais.id).toBe('celeste');
    delete e.entidades['celeste']!.q['sancao'];
    expect(ameacaDeGuerra(e)).toBeNull();
  });

  it('começa com quem sanciona e anda frio, apontando o rompimento e a desmobilização, e o país se une no primeiro ano', () => {
    const e = adulto(31);
    governar(e);
    const desmobilizou = operar(e, c, { tipo: 'politica', politica: 'defesa', nivel: 0 });
    e.ano++;
    const rompeu = operar(e, c, { tipo: 'diplomacia', parceiro: 'celeste', acao: 'romper' });
    ameacar(e);
    e.entidades['pais']!.n['defesa'] = 20;
    const popularidade = e.entidades['eu']!.n['popularidade'] ?? 0;
    const comeco = ateComecar(e)!;
    expect(comeco).not.toBeNull();
    expect(comeco.tipo).toBe('mundo');
    expect(comeco.ator).toBe('celeste');
    expect(comeco.causas).toEqual([rompeu.id, desmobilizou.id]);
    expect(inimigoDe(e)?.id).toBe('celeste');
    expect(inimigoDe(e)!.q['guerra']!.causa).toBe(comeco.id);
    // Quem governa é quem joga: a união do primeiro ano é a popularidade dele.
    expect((e.entidades['eu']!.n['popularidade'] ?? 0) - popularidade).toBeCloseTo(DEFESA.ano.uniao, 5);
    expect(comeco.texto.length).toBeGreaterThan(40);
  });

  it('a convocação chega a quem tem de 18 a 30 anos, e a do filho a quem tem um filho nessa idade, com a guerra de causa', () => {
    const jovem = adulto(32, 25);
    ameacar(jovem);
    jovem.entidades['pais']!.n['defesa'] = 0;
    const comeco = ateComecar(jovem)!;
    expect(jovem.agenda).toContainEqual({ evento: 'a_convocacao', ano: jovem.ano, origem: comeco.id, ator: 'celeste' });

    const velho = adulto(33, 50);
    const filho = novaEntidade({ id: 'filho', tipo: 'pessoa', nome: 'Davi', genero: 'm', vivo: true });
    velho.entidades['filho'] = filho;
    ameacar(velho);
    velho.entidades['pais']!.n['defesa'] = 0;
    // O filho tem 20 anos no ano em que a guerra começa, seja ele qual for.
    const doFilho = ateComecar(velho, (x) => (filho.nascimento = x.ano - 20))!;
    expect(velho.agenda.some((a) => a.evento === 'a_convocacao')).toBe(false);
    expect(velho.agenda).toContainEqual({ evento: 'filho_convocado', ano: velho.ano, origem: doFilho.id, ator: 'filho' });
  });

  it('cada ano de guerra custa: crescimento, inflação, dívida, população e aprovação', () => {
    const base = adulto(34);
    base.ano = 2069;
    const sem = structuredClone(base);
    const com = structuredClone(base);
    com.entidades['celeste']!.q['guerra'] = { v: 1, ano: 2069, idade: 40, causa: null };
    anoDoPais(sem, c, []);
    anoDoPais(com, c, []);
    const s = sem.entidades['pais']!.n;
    const g = com.entidades['pais']!.n;
    expect(g['crescimento']! - s['crescimento']!).toBeCloseTo(DEFESA.ano.choque, 0);
    expect(g['inflacao']! - s['inflacao']!).toBeGreaterThan(0.9);
    // O gasto de guerra e a arrecadação que cai com a economia.
    expect(g['divida']! - s['divida']!).toBeGreaterThan(DEFESA.ano.gasto);
    expect(g['populacao']!).toBeLessThan(s['populacao']!);
    expect(g['aprovacao']!).toBeLessThan(s['aprovacao']!);
  });

  it('acaba a partir do segundo ano, no máximo no oitavo; o desfecho sai da capacidade daqui contra a força de lá', () => {
    const desfechos = { vitoria: 0, derrota: 0, cessarFogo: 0 };
    for (let k = 0; k < 120; k++) {
      const e = adulto(misturar(35, k));
      ameacar(e);
      e.entidades['pais']!.n['defesa'] = 0;
      const comeco = ateComecar(e)!;
      e.entidades['pais']!.n['defesa'] = 60;
      const divida = e.entidades['pais']!.n['divida']!;
      const { fim, anos } = ateAcabar(e);
      expect(anos).toBeGreaterThanOrEqual(1);
      expect(anos).toBeLessThanOrEqual(DEFESA.fim.maximo);
      expect(fim.causas).toEqual([comeco.id]);
      expect(inimigoDe(e)).toBeUndefined();
      const tipo = fim.ref!.split(':')[1] as keyof typeof desfechos;
      desfechos[tipo]++;
      const cel = e.entidades['celeste']!;
      expect(cel.n['relacao']).toBe(DEFESA.fim.relacao[tipo]);
      // No cessar-fogo, a sanção continua; quem recuou e quem perdeu viram a página. A derrota paga a reparação.
      expect(Boolean(cel.q['sancao'])).toBe(tipo === 'cessarFogo');
      expect(e.entidades['pais']!.n['divida']! - divida).toBeCloseTo(tipo === 'derrota' ? DEFESA.fim.reparacao : 0, 5);
    }
    expect(desfechos.vitoria).toBeGreaterThan(10);
    expect(desfechos.derrota).toBeGreaterThan(10);
    expect(desfechos.cessarFogo).toBeGreaterThan(10);
    // Com 60 de capacidade contra os 85 da Celeste, a derrota é mais provável que a vitória.
    expect(desfechos.derrota).toBeGreaterThan(desfechos.vitoria);
  });

  it('as chances do fim somam 1 e a vitória cresce com a capacidade', () => {
    const e = adulto(36);
    const cel = e.entidades['celeste']!;
    e.entidades['pais']!.n['defesa'] = 85;
    const iguais = chancesDoFim(e, c, cel);
    expect(iguais.vitoria + iguais.derrota + iguais.cessarFogo).toBeCloseTo(1, 9);
    expect(iguais.vitoria).toBeCloseTo(iguais.derrota, 9);
    e.entidades['pais']!.n['defesa'] = 30;
    expect(chancesDoFim(e, c, cel).vitoria).toBeLessThan(iguais.vitoria);
  });

  it('o pedido de paz: só em guerra e de quem governa, um por ano; esquenta a relação e apressa o fim', () => {
    const e = adulto(37);
    governar(e);
    expect(motivoParaNaoOperar(e, c, { tipo: 'paz' })).toBe('o país não está em guerra');
    ameacar(e);
    e.entidades['pais']!.n['defesa'] = 0;
    const comeco = ateComecar(e)!;
    const rel = e.entidades['celeste']!.n['relacao']!;
    const pedido = operar(e, c, { tipo: 'paz' });
    expect(pedido.ref).toBe('defesa:paz');
    expect(pedido.causas).toEqual([comeco.id]);
    expect(pedido.texto).toContain('Celeste');
    expect(e.entidades['celeste']!.n['relacao']! - rel).toBeCloseTo(DEFESA.paz.relacao, 5);
    expect(motivoParaNaoOperar(e, c, { tipo: 'paz' })).toBe('um pedido de paz por ano');
    // Visitar ou romper com quem está em guerra com o Brasil não cabe.
    expect(motivoParaNaoOperar(e, c, { tipo: 'diplomacia', parceiro: 'celeste', acao: 'aproximar' })).toBe('em guerra: só cabe pedir a paz');
    e.entidades['pais']!.t['governo'] = 'centrao';
    e.entidades['eu']!.t['cargo'] = '';
    expect(motivoParaNaoOperar(e, c, { tipo: 'paz' })).toBe('só quem governa pede a paz');

    // Em 300 guerras, a que pediu a paz no primeiro ano acaba no segundo bem mais vezes do que a que não pediu.
    const noSegundo = (pedir: boolean): number => {
      let acabou = 0;
      for (let k = 0; k < 300; k++) {
        const x = adulto(misturar(38, k));
        governar(x);
        ameacar(x);
        x.entidades['pais']!.n['defesa'] = 0;
        ateComecar(x);
        if (pedir) operar(x, c, { tipo: 'paz' });
        x.ano++;
        regraDaGuerra(x, c);
        if (!inimigoDe(x)) acabou++;
      }
      return acabou / 300;
    };
    expect(noSegundo(true) - noSegundo(false)).toBeGreaterThan(0.12);
  });

  it('na guerra, a sanção do inimigo não acaba, nem com a relação de volta', () => {
    const e = adulto(39);
    ameacar(e);
    e.entidades['pais']!.n['defesa'] = 0;
    ateComecar(e);
    for (let i = 0; i < 6; i++) {
      e.ano++;
      e.entidades['celeste']!.n['relacao'] = 60;
      anoDoExterior(e, c, []);
      expect(e.entidades['celeste']!.q['sancao']).toBeDefined();
    }
  });
});

describe('uma vida com guerra', () => {
  /** Uma vida que nasce com a Celeste sancionando e o quartel vazio, jogada até o fim (o começo é o retrato depois disso). */
  function vidaComGuerra(): { e: EstadoVida; inicio: Map<string, Record<string, number>> } {
    for (let k = 0; k < 40; k++) {
      const e = nascer(c, { semente: misturar(4040, k), ano: 2026 });
      ameacar(e, 5);
      e.entidades['pais']!.n['defesa'] = 0;
      const inicio = new Map(Object.values(e.entidades).map((en) => [en.id, { ...en.n }]));
      const robo = criarRng(k);
      while (e.vivo) passo(e, c, robo, 'aleatoria');
      if (e.historico.some((h) => h.ref?.startsWith('guerra:guerra:'))) return { e, inicio };
    }
    throw new Error('nenhuma vida teve guerra');
  }

  let gravado: ReturnType<typeof gravarEtapas> | null = null;
  let vida: { e: EstadoVida; inicio: Map<string, Record<string, number>> } | null = null;
  const jogada = (): { e: EstadoVida; inicio: Map<string, Record<string, number>> } => {
    if (!vida) gravado = gravarEtapas(() => (vida = vidaComGuerra()));
    return vida!;
  };

  it('o livro fecha: para toda entidade, o começo mais a soma das variações dá o estado final', () => {
    const { e, inicio } = jogada();
    const soma = new Map<string, number>();
    for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
    for (const en of Object.values(e.entidades)) {
      for (const [campo, fim] of Object.entries(en.n)) {
        const esperado = (inicio.get(en.id)?.[campo] ?? 0) + (soma.get(`${en.id}.${campo}`) ?? 0);
        expect(Math.abs(esperado - fim), `${en.id}.${campo}`).toBeLessThan(Math.max(2, Math.abs(fim) * 1e-9));
      }
    }
  }, 60_000);

  it('as regras da guerra só escrevem o que o manifesto declara, e a etapa só lê e escreve o que declarou', () => {
    const { e } = jogada();
    const declaradas = new Set([...ESCRITAS_DO_MOTOR, ...VONTADES(c.mundo.vontades)]);
    const fora = new Set<string>();
    for (const h of e.historico) {
      if (h.causa !== 'regra') continue;
      for (const m of h.mudancas ?? []) {
        const [ent, campo] = m.c.split('.') as [string, string];
        const chave = `${ent.replace(/^(bem|empresa|filho)\d+$/, '$1').replace(/^(ctr|tit)\d+[a-z]?$/, '$1')}.${campo}`;
        if (!declaradas.has(chave)) fora.add(chave);
      }
    }
    expect([...fora]).toEqual([]);
    for (const id of ['guerra', 'pais'] as const) {
      const etapa = ETAPAS_DO_ANO.find((x) => x.id === id)!;
      const g = gravado!.get(id)!;
      expect(foraDa(etapa.le, g.le), `${id} lê`).toEqual([]);
      expect(foraDa(etapa.escreve, new Set([...g.escreve, ...g.livro])), `${id} escreve`).toEqual([]);
    }
  }, 60_000);
});
