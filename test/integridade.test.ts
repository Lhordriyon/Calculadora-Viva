/**
 * A integridade causal da simulação (missão Ascensão AAA): os invariantes do estado em vidas inteiras e os consertos
 * que a auditoria pediu (o tempo das marcas pelo calendário, a família de quem herda, o mercado que tem tamanho e a
 * viuvez de quem é).
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { anosDaMarca, ler } from '../src/motor/campos.ts';
import { atende } from '../src/motor/condicoes.ts';
import { multiplicarEmpresa } from '../src/motor/empresa.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { ANOS_ENTRE_GERACOES, conferirEstado } from '../src/motor/invariantes.ts';
import { ganhar } from '../src/motor/livro.ts';
import { economiaDo, espacoNoMercado, garantirFundamentos, mercadoDoSetor, procura, somarDemanda } from '../src/motor/negocio.ts';
import { criarPersonagem, moverPessoa, novaEntidade } from '../src/motor/pessoas.ts';
import { ESTRATEGIAS } from '../src/motor/robos.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { Condicoes } from '../src/motor/esquema.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { passo } from './apoio.ts';

const c = carregarConteudo();

/** Quem joga, aos `idade`, sem viver os anos (o estado do nascimento, com o relógio adiantado). */
function aos(idade: number, semente = 11): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = idade;
  e.ano += idade;
  return e;
}

describe('os invariantes do estado', () => {
  it('valem depois de cada ano, em vidas inteiras e na vida de quem herda (as quatro estratégias e as origens das pontas)', () => {
    const origens = [undefined, { classe: 0 }, { classe: 7 }, { linhagem: 'realeza' }] as const;
    const problemas: string[] = [];
    ESTRATEGIAS.forEach((estrategia, i) => {
      const origem = origens[i % origens.length];
      let e = nascer(c, { semente: 4400 + i, ano: 2026, ...(origem ? { origem } : {}) });
      for (let geracao = 1; geracao <= 2; geracao++) {
        const robo = criarRng(77 + i + geracao);
        problemas.push(...conferirEstado(e, c).map((p) => `${estrategia}, geração ${geracao}, no começo: ${p}`));
        while (e.vivo) {
          const antes = e.idade;
          passo(e, c, robo, estrategia);
          if (e.idade !== antes || !e.vivo) problemas.push(...conferirEstado(e, c).map((p) => `${estrategia}, geração ${geracao}, aos ${e.idade}: ${p}`));
        }
        if (!herdeiroPossivel(e, c)) break;
        e = continuarComoHerdeiro(e, c);
      }
    });
    expect(problemas.slice(0, 5)).toEqual([]);
  });

  it('acusam o que quebra: o número que não é número, o dinheiro que some e quem nasce depois do filho', () => {
    const e = aos(30);
    expect(conferirEstado(e, c)).toEqual([]);
    e.entidades['eu']!.n['saude'] = Number.NaN;
    expect(conferirEstado(e, c).join(' ')).toMatch(/eu\.saude não é um número finito/);
    e.entidades['eu']!.n['saude'] = 80;
    e.entidades['eu']!.n['dinheiro'] = (e.entidades['eu']!.n['dinheiro'] ?? 0) + 5000;
    expect(conferirEstado(e, c).join(' ')).toMatch(/o dinheiro do mundo soma/);
    e.entidades['eu']!.n['dinheiro']! -= 5000;
    e.entidades['mae']!.nascimento = e.anoNascimento - (ANOS_ENTRE_GERACOES - 1);
    expect(conferirEstado(e, c).join(' ')).toMatch(/mae nasceu em/);
  });
});

describe('o tempo das marcas é o do calendário', () => {
  it('dentro de uma vida, é a idade de agora menos a idade em que a marca veio', () => {
    const e = aos(40);
    ganhar(e, [], 'eu', 'formado', null);
    e.idade += 7;
    e.ano += 7;
    const q = e.entidades['eu']!.q['formado']!;
    expect(anosDaMarca(e, q)).toBe(7);
    expect(anosDaMarca(e, q)).toBe(e.idade - q.idade);
  });

  it('a marca herdada conta os anos desde que veio, não a idade de quem morreu: o velório de quem morreu há dez anos não volta', () => {
    // A avó morreu há dez anos, quando quem jogava (a mãe de quem herda) tinha 49: a marca guarda essa idade.
    const e = aos(20);
    const avo = e.entidades['avo']!;
    avo.vivo = false;
    avo.morte = e.ano - 10;
    avo.q['faleceu'] = { v: 1, ano: e.ano - 10, idade: 49, causa: 1 };
    const doAno = { marcaHa: [{ marca: 'avo.faleceu', max: 0 }] } as unknown as Condicoes;
    // Dos 20 aos 60 (passando pelos 49), o velório "deste ano" nunca vale.
    for (let k = 0; k <= 40; k++) {
      expect(atende(doAno, e), `aos ${e.idade}`).toBe(false);
      e.idade++;
      e.ano++;
    }
    expect(anosDaMarca(e, avo.q['faleceu']!)).toBe(51);
  });
});

describe('a família de quem herda é da geração certa', () => {
  /** Quem joga morre aos 60 e deixa tudo, por testamento, para o par ou para o amigo. */
  function deixaPara(papel: 'amor' | 'amigo', semente: number): EstadoVida {
    const e = aos(60, semente);
    Object.assign(e.entidades['eu']!.n, { dinheiro: 200000, divida: 0, irmaos: 0 });
    if (papel === 'amor') {
      criarPersonagem(e, c, 'amor', []);
      ganhar(e, [], 'eu', 'namoro', null);
      ganhar(e, [], 'eu', 'casado', null);
    }
    e.entidades[papel]!.vivo = true;
    delete e.entidades[papel]!.morte;
    e.entidades['eu']!.t['testamento'] = papel;
    morrer(e, c);
    return e;
  }

  it('os pais sorteados para o par e para o amigo nascem uma geração antes deles', () => {
    for (const papel of ['amor', 'amigo'] as const) {
      for (let semente = 1; semente <= 12; semente++) {
        const antiga = deixaPara(papel, 500 + semente);
        expect(herdeiroPossivel(antiga, c)?.parentesco).toBe(papel);
        const h = continuarComoHerdeiro(antiga, c);
        const eu = h.entidades['eu']!;
        for (const slot of ['mae', 'pai'] as const) {
          const diferenca = eu.nascimento! - h.entidades[slot]!.nascimento!;
          expect(diferenca, `${papel}, semente ${semente}, ${slot}`).toBeGreaterThanOrEqual(20);
          expect(diferenca, `${papel}, semente ${semente}, ${slot}`).toBeLessThanOrEqual(38);
        }
        expect(conferirEstado(h, c)).toEqual([]);
      }
    }
  });

  it('quem se separou do outro pai deixa o ex no lugar dele, e não um pai inventado morto antes do irmão mais novo', () => {
    const e = aos(30, 777);
    criarPersonagem(e, c, 'amor', []);
    ganhar(e, [], 'eu', 'namoro', null);
    const par = e.entidades['amor']!;
    const nomeDoPar = par.nome;
    criarPersonagem(e, c, 'filho', []);
    e.idade += 10;
    e.ano += 10;
    criarPersonagem(e, c, 'filho', []);
    // A separação: o par vira ex e continua vivo.
    moverPessoa(e, 'amor', 'ex', []);
    delete e.entidades['eu']!.q['namoro'];
    e.idade += 25;
    e.ano += 25;
    Object.assign(e.entidades['eu']!.n, { dinheiro: 1000, divida: 0 });
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    const slot = e.entidades['eu']!.genero === 'f' ? 'pai' : 'mae';
    expect(h.entidades[slot]!.nome).toBe(nomeDoPar);
    expect(h.entidades[slot]!.vivo).not.toBe(false);
    expect(h.entidades['eu']!.q['pais_separados']).toBeDefined();
    expect(conferirEstado(h, c)).toEqual([]);
  });

  it('o par de quem é adulto é adulto, o de quem é adolescente é da turma, e o amigo de infância não nasce depois de quem joga', () => {
    for (let semente = 1; semente <= 40; semente++) {
      const adulto = aos(18 + (semente % 5), 900 + semente);
      criarPersonagem(adulto, c, 'amor', []);
      expect(adulto.ano - adulto.entidades['amor']!.nascimento!, `adulto de ${adulto.idade}`).toBeGreaterThanOrEqual(18);
      const jovem = aos(14 + (semente % 4), 1900 + semente);
      criarPersonagem(jovem, c, 'amor', []);
      const idadeDoPar = jovem.ano - jovem.entidades['amor']!.nascimento!;
      expect(idadeDoPar - jovem.idade, `jovem de ${jovem.idade}`).toBeGreaterThanOrEqual(-1);
      expect(idadeDoPar - jovem.idade, `jovem de ${jovem.idade}`).toBeLessThanOrEqual(2);
      const bebe = nascer(c, { semente: 2900 + semente, ano: 2026 });
      expect(bebe.entidades['amigo']!.nascimento!).toBeLessThanOrEqual(bebe.ano);
    }
  });
});

describe('o mercado tem tamanho para todo ganho', () => {
  /** Quem joga com uma empresa de comércio fundada com `capital`. */
  function comEmpresa(capital: number, setor = 'comercio', id = 'empresa'): { e: EstadoVida; reg: Mudanca[] } {
    const e = aos(40);
    const reg: Mudanca[] = [];
    const emp = novaEntidade({ id, tipo: 'empresa', nome: 'Loja Teste', genero: 'f', nascimento: e.ano, vivo: true });
    emp.t['setor'] = setor;
    emp.n['valor'] = capital;
    emp.n['participacao'] = 1;
    e.entidades[id] = emp;
    garantirFundamentos(e, c, reg, emp, capital);
    return { e, reg };
  }
  const mercadoDe = (e: EstadoVida, setor = 'comercio'): number => mercadoDoSetor(e, economiaDo(c.setores.get(setor)));

  it('o ganho de clientela só entra até o mercado do setor; a perda vale inteira', () => {
    const { e, reg } = comEmpresa(1_000_000);
    const emp = e.entidades['empresa']!;
    const mercado = mercadoDe(e);
    // O contrato do conteúdo multiplica a empresa por mil, e por mil de novo: a clientela para no mercado.
    for (let i = 0; i < 6; i++) multiplicarEmpresa(e, c, reg, 1000);
    expect(emp.n['demanda']!).toBeLessThanOrEqual(mercado * (1 + 1e-9));
    expect(emp.n['demanda']!).toBeGreaterThan(mercado * 0.99);
    expect(somarDemanda(e, c, reg, emp, mercado)).toBe(0);
    const antes = emp.n['demanda']!;
    expect(somarDemanda(e, c, reg, emp, -antes / 2)).toBeCloseTo(-antes / 2, 0);
    expect(conferirEstado(e, c).filter((p) => p.includes('demanda'))).toEqual([]);
  });

  it('duas empresas de quem joga no mesmo setor dividem o mesmo mercado', () => {
    const { e, reg } = comEmpresa(1_000_000);
    const outra = novaEntidade({ id: 'empresa2', tipo: 'empresa', nome: 'Outra Loja', genero: 'f', nascimento: e.ano, vivo: true });
    outra.t['setor'] = 'comercio';
    outra.n['valor'] = 1_000_000;
    outra.n['participacao'] = 1;
    e.entidades['empresa2'] = outra;
    garantirFundamentos(e, c, reg, outra, 1_000_000);
    const mercado = mercadoDe(e);
    somarDemanda(e, c, reg, e.entidades['empresa']!, mercado * 0.7);
    somarDemanda(e, c, reg, outra, mercado);
    const soma = e.entidades['empresa']!.n['demanda']! + outra.n['demanda']!;
    expect(soma).toBeLessThanOrEqual(mercado * (1 + 1e-9));
    expect(espacoNoMercado(e, c, outra)).toBeCloseTo(mercado - e.entidades['empresa']!.n['demanda']!, 0);
  });

  it('o que o país compra de uma empresa não passa do que ele compra do setor, nem com o preço popular e o produto que atrai', () => {
    const { e, reg } = comEmpresa(1_000_000);
    const emp = e.entidades['empresa']!;
    somarDemanda(e, c, reg, emp, mercadoDe(e));
    emp.t['preco'] = 'popular';
    emp.n['qualidade'] = 100;
    emp.n['marca'] = 100;
    expect(procura(e, c, emp)).toBeLessThanOrEqual(mercadoDe(e) * (1 + 1e-9));
  });
});

describe('a viuvez é de quem é', () => {
  it('a mãe só está sozinha se o pai morreu há dois anos ou mais, é ausente, ou os dois se separaram; a de quem joga não conta', () => {
    const e = aos(40);
    delete e.entidades['pai']!.q['ausente'];
    delete e.entidades['eu']!.q['pais_separados'];
    e.entidades['pai']!.vivo = true;
    delete e.entidades['pai']!.morte;
    // Quem joga fica viúvo: a mãe, casada, continua casada.
    ganhar(e, [], 'eu', 'viuvo', null);
    expect(ler(e, 'mae', 'sozinho')).toBe(false);
    expect(atende({ 'ator.sozinho': true } as Condicoes, e, 'mae')).toBe(false);
    // O pai morre: no ano da morte ainda não; dois anos depois, sim.
    e.entidades['pai']!.vivo = false;
    e.entidades['pai']!.morte = e.ano;
    expect(ler(e, 'mae', 'sozinho')).toBe(false);
    e.ano += 2;
    e.idade += 2;
    expect(ler(e, 'mae', 'sozinho')).toBe(true);
    expect(ler(e, 'pai', 'sozinho')).toBe(false);
    expect(ler(e, 'avo', 'sozinho')).toBe(true);
  });

  it('os dois storylets leem a pessoa, e não a marca de quem joga', () => {
    for (const id of ['pai_namorando_de_novo', 'mae_quer_morar_junto']) {
      const s = c.porId.get(id)!;
      expect(JSON.stringify(s.condicoes), id).not.toContain('viuvo');
      expect(s.condicoes?.['ator.sozinho'], id).toBe(true);
    }
  });
});
