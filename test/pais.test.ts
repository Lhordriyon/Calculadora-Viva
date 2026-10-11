/**
 * Incremento 8: o país vivo. Estatísticas que andam, governos que se alternam
 * na eleição, o voto de quem joga, as políticas de quem governa e o que o
 * país faz na vida (o emprego, o bolso, o corpo, a escola).
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { operar } from '../src/motor/carteira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { economiaDoAno } from '../src/motor/economia.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import {
  anoDoPais,
  bolsoDoPais,
  defGoverno,
  ESTATISTICAS,
  escolaPublica,
  faseDe,
  faseDoCrescimento,
  fatorDaSaudePublica,
  governoAtual,
  nivelDe,
  riscoDeViolencia,
  TIPICO,
  votoDe,
} from '../src/motor/pais.ts';
import { misturar, criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { chanceDeMorrer, nascer } from '../src/motor/vida.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

/** Um adulto de 40 anos num país com o governo dado (as políticas dele em vigor). */
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
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 8.5, divida: 75, pobreza: 25, violencia: 22, saude: 50, educacao: 50, aprovacao: 50, impulso: 0 });
  return e;
}

/** Faz quem joga votar no bloco (como a escolha do storylet do voto), no ano dado. */
function votar(e: EstadoVida, bloco: string, ano = e.ano): number {
  const entrada = lancar(e, novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'eleicao_geral', texto: 'Votou.' }), []);
  e.entidades['eu']!.q[`voto_${bloco}`] = { v: 1, ano, idade: e.idade, causa: entrada.id };
  return entrada.id;
}

describe('o país em que se nasce', () => {
  it('tem as dez estatísticas, um governo com as políticas dele e a fase que o crescimento diz', () => {
    const governos = new Set<string>();
    for (let i = 0; i < 80; i++) {
      const e = nascer(c, { semente: misturar(8, i), ano: 2026 });
      const pais = e.entidades['pais']!;
      for (const k of ESTATISTICAS) expect(Number.isFinite(pais.n[k])).toBe(true);
      const def = defGoverno(c, pais.t['governo'])!;
      expect(def).toBeDefined();
      for (const p of POLITICAS) expect(nivelDe(e, p)).toBe(def.politicas[p]);
      expect(faseDe(e)).toBe(faseDoCrescimento(pais.n['crescimento']!));
      governos.add(def.id);
    }
    expect(governos.size).toBe(4);
  });

  it('quem nasce no regime nasce governado pelo regime', () => {
    const e = nascer(c, { semente: 4, ano: 2026, origem: { linhagem: c.mundo.linhagens.find((l) => l.pais?.includes('regime'))!.id } });
    expect(governoAtual(e)).toBe('regime');
  });
});

describe('a eleição', () => {
  const vencedores = (aprovacao: number): number => {
    let ficou = 0;
    for (let i = 0; i < 300; i++) {
      const e = adulto(misturar(10, i), 'frente_popular');
      e.ano = 2067; // posse
      e.entidades['pais']!.n['aprovacao'] = aprovacao;
      e.rng = criarRng(misturar(11, i));
      anoDoPais(e, c, []);
      if (governoAtual(e) === 'frente_popular') ficou++;
    }
    return ficou / 300;
  };

  it('na posse, quem governa fica pela aprovação: aprovado, quase sempre; reprovado, raramente', () => {
    expect(vencedores(90)).toBeGreaterThan(0.75);
    expect(vencedores(10)).toBeLessThan(0.25);
  });

  it('a posse é uma entrada do mundo que troca as políticas pelas do bloco que ganhou', () => {
    for (let i = 0; i < 50; i++) {
      const e = adulto(misturar(12, i), 'frente_popular');
      e.ano = 2067;
      e.entidades['pais']!.n['aprovacao'] = 10;
      anoDoPais(e, c, []);
      const posse = e.historico.find((h) => h.ref?.startsWith('governo:'))!;
      expect(posse.tipo).toBe('mundo');
      const id = governoAtual(e);
      expect(posse.ref).toBe(`governo:${id}`);
      for (const p of POLITICAS) expect(nivelDe(e, p)).toBe(defGoverno(c, id)!.politicas[p]);
    }
  });

  it('fora do ano da posse, ninguém troca de governo', () => {
    const e = adulto(13, 'bloco_liberal');
    e.ano = 2068;
    e.entidades['pais']!.n['aprovacao'] = 5;
    anoDoPais(e, c, []);
    expect(governoAtual(e)).toBe('bloco_liberal');
  });
});

describe('o voto de quem joga', () => {
  it('pesa no resultado (mais com influência) e, quando o escolhido ganha, é a causa da posse', () => {
    const ganhou = (votarNele: boolean, influencia: number): number => {
      let n = 0;
      for (let i = 0; i < 400; i++) {
        const e = adulto(misturar(14, i), 'centrao');
        e.ano = 2067;
        e.entidades['eu']!.n['influencia'] = influencia;
        let voto = -1;
        if (votarNele) voto = votar(e, 'alianca_da_ordem', 2066);
        e.rng = criarRng(misturar(15, i));
        anoDoPais(e, c, []);
        if (governoAtual(e) !== 'alianca_da_ordem') continue;
        n++;
        if (votarNele) expect(e.historico.find((h) => h.ref === 'governo:alianca_da_ordem')!.causas).toContain(voto);
      }
      return n / 400;
    };
    const sem = ganhou(false, 0);
    expect(ganhou(true, 0)).toBeGreaterThan(sem);
    expect(ganhou(true, 100)).toBeGreaterThan(ganhou(true, 0) + 0.1);
  });

  it('só vale o voto da eleição do ano passado', () => {
    const e = adulto(16);
    e.ano = 2067;
    votar(e, 'frente_popular', 2062);
    expect(votoDe(e, c)).toBeNull();
    votar(e, 'bloco_liberal', 2066);
    expect(votoDe(e, c)?.governo.id).toBe('bloco_liberal');
  });
});

describe('quem joga governa', () => {
  /** Presidente eleito no ano passado, com o mandato inteiro pela frente. */
  function presidente(semente: number): EstadoVida {
    const e = adulto(semente, 'centrao');
    const eu = e.entidades['eu']!;
    Object.assign(eu.n, { mandato: 4, popularidade: 60 });
    eu.t['cargo'] = 'presidente';
    e.ano = 2068;
    anoDoPais(e, c, []);
    return e;
  }

  it('o governo é de quem joga, e a aprovação do governo é a popularidade dele', () => {
    const e = presidente(17);
    expect(governoAtual(e)).toBe('voce');
    expect(e.entidades['pais']!.n['aprovacao']).toBe(e.entidades['eu']!.n['popularidade']);
  });

  it('reformar muda a política, mexe na popularidade na hora e só uma vez por ano', () => {
    const e = presidente(18);
    const pop = e.entidades['eu']!.n['popularidade']!;
    const entrada = operar(e, c, { tipo: 'politica', politica: 'impostos', nivel: 2 });
    expect(nivelDe(e, 'impostos')).toBe(2);
    expect(entrada).toMatchObject({ causa: 'acao', ref: 'pais:politica', resumo: 'subiu os impostos' });
    expect(e.entidades['eu']!.n['popularidade']).toBeCloseTo(pop - 5);
    expect(() => operar(e, c, { tipo: 'politica', politica: 'social', nivel: 2 })).toThrow(/uma reforma por ano/);
  });

  it('quem não governa não muda as políticas', () => {
    const e = adulto(19);
    expect(() => operar(e, c, { tipo: 'politica', politica: 'saude', nivel: 2 })).toThrow(/só quem governa/);
  });

  it('quando quem joga sai do poder, um bloco assume (com a saída como causa)', () => {
    const e = presidente(20);
    const eu = e.entidades['eu']!;
    eu.t['cargo'] = '';
    const saida = lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'poder:fim_do_mandato', texto: 'Acabou.', resumo: 'deixou o cargo' }), []);
    eu.q['ex_politico'] = { v: 1, ano: e.ano, idade: e.idade, causa: saida.id };
    e.ano = 2070;
    anoDoPais(e, c, []);
    expect(governoAtual(e)).not.toBe('voce');
    const posse = e.historico.at(-1)!.ref?.startsWith('governo:') ? e.historico.at(-1)! : e.historico.find((h) => h.ref?.startsWith('governo:'))!;
    expect(posse.causas).toContain(saida.id);
  });
});

describe('as políticas mudam o país', () => {
  /** Média de uma estatística em N anos com uma política fixa (as mesmas sementes para os dois lados). */
  const media = (politica: (typeof POLITICAS)[number], nivel: number, k: (typeof ESTATISTICAS)[number], anos = 30): number => {
    let soma = 0;
    for (let i = 0; i < 40; i++) {
      const e = adulto(misturar(21, i));
      e.rng = criarRng(misturar(22, i));
      for (let ano = 0; ano < anos; ano++) {
        e.ano++;
        // Fora da posse, para o governo não mudar as políticas no meio da conta.
        if (e.ano % 4 === 3) e.ano++;
        e.entidades['pais']!.n[`pol_${politica}`] = nivel;
        anoDoPais(e, c, []);
        soma += e.entidades['pais']!.n[k]!;
      }
    }
    return soma / (40 * anos);
  };

  it('programa social amplo derruba a pobreza; segurança linha dura, a violência; escola prioridade sobe a educação', () => {
    expect(media('social', 2, 'pobreza')).toBeLessThan(media('social', 0, 'pobreza') - 6);
    expect(media('seguranca', 2, 'violencia')).toBeLessThan(media('seguranca', 0, 'violencia') - 6);
    expect(media('educacao', 2, 'educacao')).toBeGreaterThan(media('educacao', 0, 'educacao') + 10);
  });

  it('imposto baixo sem cortar gasto faz crescer mais no começo, endivida e a dívida acaba freando o crescimento', () => {
    expect(media('impostos', 0, 'crescimento', 5)).toBeGreaterThan(media('impostos', 2, 'crescimento', 5));
    expect(media('impostos', 0, 'divida')).toBeGreaterThan(media('impostos', 2, 'divida') + 20);
    expect(media('impostos', 0, 'crescimento')).toBeLessThan(media('impostos', 0, 'crescimento', 5));
  });
});

describe('o país na vida de quem joga', () => {
  it('o imposto come a renda de quem não é pobre; o auxílio entra na conta de quem é', () => {
    const guardou = (governo: string, renda: number): number => {
      const e = adulto(23, governo);
      Object.assign(e.entidades['eu']!.n, { dinheiro: 0, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda, custo: 10000 });
      e.entidades['eu']!.t['padrao'] = 'simples';
      economiaDoAno(e, [], { ...bolsoDoPais(e, c), inflacao: 0 });
      return e.entidades['eu']!.n['dinheiro']!;
    };
    // O bloco liberal tem imposto baixo; a frente popular, alto.
    expect(guardou('bloco_liberal', 100000)).toBeGreaterThan(guardou('frente_popular', 100000));
    // Quem é pobre não paga imposto e recebe o auxílio da frente popular (programas amplos).
    expect(guardou('frente_popular', 20000)).toBeGreaterThan(guardou('bloco_liberal', 20000));
  });

  it('a saúde pública pesa na mortalidade de quem depende dela, não na do rico', () => {
    const e = adulto(24);
    e.entidades['pais']!.n['saude'] = 20;
    const ruim = fatorDaSaudePublica(e);
    e.entidades['pais']!.n['saude'] = 80;
    const boa = fatorDaSaudePublica(e);
    expect(ruim).toBeGreaterThan(1);
    expect(boa).toBeLessThan(1);
    e.entidades['eu']!.n['renda_fixa'] = 50_000_000;
    expect(fatorDaSaudePublica(e)).toBe(1);
  });

  it('com saúde zero, nem a melhor saúde pública salva; com saúde, ela pesa', () => {
    const e = adulto(29);
    e.entidades['pais']!.n['saude'] = 95;
    e.entidades['eu']!.n['saude'] = 0;
    expect(chanceDeMorrer(e).corpo).toBe(1);
    e.entidades['eu']!.n['saude'] = 40;
    const boa = chanceDeMorrer(e).corpo;
    e.entidades['pais']!.n['saude'] = 15;
    expect(chanceDeMorrer(e).corpo).toBeGreaterThan(boa);
  });

  it('a violência mata mais o jovem, o homem e quem não é rico; criança não', () => {
    const e = adulto(25);
    e.entidades['eu']!.genero = 'm';
    e.idade = 20;
    const jovem = riscoDeViolencia(e);
    e.idade = 55;
    expect(riscoDeViolencia(e)).toBeLessThan(jovem);
    e.idade = 8;
    expect(riscoDeViolencia(e)).toBe(0);
    e.idade = 20;
    e.entidades['eu']!.genero = 'f';
    expect(riscoDeViolencia(e)).toBeLessThan(jovem);
    e.entidades['eu']!.genero = 'm';
    e.entidades['pais']!.n['violencia'] = 44;
    expect(riscoDeViolencia(e)).toBeCloseTo(jovem * 2);
  });

  it('a escola pública soma (ou tira) inteligência de quem estuda nela, não de quem está na particular', () => {
    const e = adulto(26);
    e.idade = 10;
    e.entidades['eu']!.n['classe_origem'] = 2;
    e.entidades['pais']!.n['educacao'] = 70;
    expect(escolaPublica(e)).toBeGreaterThan(0);
    e.entidades['pais']!.n['educacao'] = 30;
    expect(escolaPublica(e)).toBeLessThan(0);
    e.entidades['eu']!.n['classe_origem'] = 5;
    expect(escolaPublica(e)).toBe(0);
  });
});

describe('o porquê do país', () => {
  it('o decreto que aqueceu a economia é a causa da virada para cima, e a linha do tempo mostra', () => {
    let achou = false;
    for (let i = 0; i < 60 && !achou; i++) {
      const e = adulto(misturar(27, i));
      e.ano = 2068;
      e.entidades['pais']!.q['crise'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
      Object.assign(e.entidades['pais']!.n, TIPICO.crise);
      const decreto = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'decreto_da_economia', texto: 'Decretou.', escolha: { indice: 0, texto: 'Cortar impostos', resumo: 'cortou impostos para aquecer a economia' } });
      lancar(e, decreto, [{ c: 'pais.impulso', d: 3 }]);
      e.entidades['pais']!.n['impulso'] = 3;
      e.idade++;
      e.ano++;
      e.rng = criarRng(misturar(28, i));
      anoDoPais(e, c, []);
      const virada = e.historico.find((h) => h.ref?.startsWith('ciclo:'));
      if (!virada || faseDe(e) === 'crise') continue;
      expect(virada.causas).toContain(decreto.id);
      expect(porqueDe(virada, new Map(e.historico.map((h) => [h.id, h])))?.texto).toBe('você cortou impostos para aquecer a economia');
      achou = true;
    }
    expect(achou).toBe(true);
  });
});

describe('save de antes do país vivo', () => {
  it('um país só com a fase ganha estatísticas e governo, e a vida segue até o fim', () => {
    const vida = nascer(c, { semente: 41, ano: 2026 });
    const pais = vida.entidades['pais']!;
    for (const k of [...ESTATISTICAS.filter((x) => x !== 'inflacao'), ...POLITICAS.map((p) => `pol_${p}`)]) delete pais.n[k];
    delete pais.t['governo'];
    for (const f of ['expansao', 'normal', 'crise']) delete pais.q[f];
    pais.q['recessao'] = { v: 1, ano: 2026, idade: 0, causa: null };
    const lido = lerSave(escreverSave({ ...saveVazio(), vida }), c);
    const novo = lido.vida!.entidades['pais']!;
    expect(novo.n['crescimento']).toBe(TIPICO.recessao.crescimento);
    expect(defGoverno(c, novo.t['governo'])).toBeDefined();
    viverAteOFim(lido.vida!, c, 5);
    expect(lido.vida!.vivo).toBe(false);
  });
});
