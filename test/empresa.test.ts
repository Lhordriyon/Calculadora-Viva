import { describe, expect, it } from 'vitest';
import { carregarConteudo, lerFontes } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { acoesPossiveis } from '../src/motor/acoes.ts';
import { defFase } from '../src/motor/ciclo.ts';
import { ler, parteNaEmpresa, patrimonioDe, patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import { empresaDe, regraDaEmpresa } from '../src/motor/empresa.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { ganhar, novaEntrada } from '../src/motor/livro.ts';
import { PISO_EMPRESA, precoDeVenda } from '../src/motor/regras.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { validarConteudo } from '../src/motor/validacao.ts';
import { avancarAno, morrer, nascer } from '../src/motor/vida.ts';
import { pontosDeVirada } from '../src/motor/virada.ts';
import { passo } from './apoio.ts';

const c = carregarConteudo();

/** Um adulto de 30 anos, no país normal, com dinheiro na conta e investido. */
function adulto(semente = 7, n: Record<string, number> = {}): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro: 60000, renda_fixa: 40000, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 }, n);
  return e;
}

/** Efeitos como no JSON (o tipo do Zod não aceita objeto literal com chaves de objeto e caminhos juntos). */
function efeitos(e: EstadoVida, ef: Record<string, unknown>, ator?: string): { reg: Mudanca[]; valores: Record<string, number> } {
  const reg: Mudanca[] = [];
  const valores: Record<string, number> = {};
  aplicarEfeitos(e, c, ef as Efeitos, { origem: 0, reg, valores, ator });
  return { reg, valores };
}

describe('abrir e tocar a empresa pela folha Dinheiro', () => {
  it('abre com o capital da conta e, se faltar, dos investimentos; vira entrada do jogador sem gastar a ficha', () => {
    const e = adulto();
    const fichas = acoesPossiveis(e, c).length;
    const entrada = operar(e, c, { tipo: 'abrir', setor: 'tecnologia', valor: 80000 });
    expect(entrada).toMatchObject({ tipo: 'dinheiro', causa: 'acao', ref: 'empresa:abrir' });
    const emp = empresaDe(e)!;
    expect(emp.n['valor']).toBeCloseTo(80000);
    expect(emp.n['participacao']).toBe(1);
    expect(emp.t['setor']).toBe('tecnologia');
    expect(emp.nome).toMatch(/\S/);
    // A conta zerou e o resto saiu da renda fixa.
    expect(e.entidades['eu']!.n['dinheiro']).toBeCloseTo(0);
    expect(e.entidades['eu']!.n['renda_fixa']).toBeCloseTo(20000);
    // A fundação é a causa do que a empresa causar.
    expect(emp.q['fundada']!.causa).toBe(entrada.id);
    expect(acoesPossiveis(e, c).length).toBe(fichas);
    // O patrimônio não mudou: o dinheiro só trocou de lugar.
    expect(patrimonioTotal(e)).toBeCloseTo(100000);
    expect(ler(e, 'eu', 'patrimonio')).toBeCloseTo(100000);
  });

  it('recusa o que não dá: menor de idade, pouco capital, dinheiro que não existe, segunda empresa, escolha pendente', () => {
    const jovem = adulto();
    jovem.idade = 17;
    expect(motivoParaNaoOperar(jovem, c, { tipo: 'abrir', setor: 'comercio', valor: 10000 })).toMatch(/18/);
    const e = adulto();
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 1000 })).toMatch(/mínimo/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 500000 })).toMatch(/dinheiro/);
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'publico', valor: 10000 })).toMatch(/ramo/);
    operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 10000 });
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 10000 })).toMatch(/já tem/);
    e.pendente = { storylet: 'x', instancia: 'x', causa: 'diretor', texto: '', causas: [], opcoes: [] };
    expect(motivoParaNaoOperar(e, c, { tipo: 'aportar', valor: 1000 })).toMatch(/cartão/);
  });

  it('aportar aumenta o valor e, com sócios, a parte de quem joga; a retirada paga a parte de quem joga todo ano', () => {
    const e = adulto();
    operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 50000 });
    const emp = empresaDe(e)!;
    emp.n['participacao'] = 0.5;
    operar(e, c, { tipo: 'aportar', valor: 50000 });
    expect(emp.n['valor']).toBeCloseTo(100000);
    expect(emp.n['participacao']).toBeCloseTo(0.75);
    operar(e, c, { tipo: 'retirada', fracao: 0.08 });
    const antes = e.entidades['eu']!.n['dinheiro']!;
    e.rng = criarRng(3);
    const reg: Mudanca[] = [];
    regraDaEmpresa(e, c, defFase(c, 'normal'), reg);
    const pago = (e.entidades['eu']!.n['dinheiro'] ?? 0) - antes;
    expect(pago).toBeGreaterThan(0);
    expect(pago).toBeCloseTo((emp.n['valor']! / 0.92) * 0.08 * 0.75, -1);
    expect(reg.find((m) => m.c === 'eu.dinheiro')?.r).toBe('empresa');
  });

  it('vender paga o valor com o prêmio ou o desconto da fase; a empresa sai da vida e fica só o nome', () => {
    const e = adulto();
    operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 100000 });
    const nome = empresaDe(e)!.nome;
    ganhar(e, [], 'pais', 'crise', null);
    const antes = e.entidades['eu']!.n['dinheiro'] ?? 0;
    const venda = operar(e, c, { tipo: 'vender' });
    const recebido = (e.entidades['eu']!.n['dinheiro'] ?? 0) - antes;
    expect(recebido).toBeCloseTo(100000 * precoDeVenda(defFase(c, 'crise').empresa));
    expect(recebido).toBeLessThan(100000);
    expect(empresaDe(e)).toBeUndefined();
    expect(e.entidades['empresa']!.nome).toBe(nome);
    expect(ler(e, 'empresa', 'valor')).toBe(0);
    expect(parteNaEmpresa(e)).toBe(0);
    expect(e.entidades['eu']!.q['vendeu_empresa']!.causa).toBe(venda.id);
    // Pode abrir outra.
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'saude', valor: 10000 })).toBeNull();
  });
});

describe('o ano da empresa', () => {
  it('quem toca a empresa a faz crescer mais, em média, do que quem a deixa sozinha', () => {
    const crescer = (dedicacao: boolean): number => {
      let total = 0;
      for (let i = 0; i < 300; i++) {
        const e = adulto(misturar(5, i));
        operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 50000 });
        e.rng = criarRng(misturar(9, i));
        for (let ano = 0; ano < 15 && empresaDe(e); ano++) {
          if (dedicacao) efeitos(e, { 'empresa.tracao': 1.5 });
          regraDaEmpresa(e, c, defFase(c, 'normal'), []);
        }
        total += Math.log(Math.max(1000, parteNaEmpresa(e)));
      }
      return total / 300;
    };
    expect(crescer(true)).toBeGreaterThan(crescer(false) + 0.5);
  });

  it('abaixo do piso, a quebra fica agendada com a fundação como causa', () => {
    const e = adulto();
    const abertura = operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 10000 });
    empresaDe(e)!.n['valor'] = PISO_EMPRESA / 10;
    regraDaEmpresa(e, c, defFase(c, 'crise'), []);
    expect(e.agenda).toContainEqual({ evento: 'empresa_quebrou', ano: e.ano, origem: abertura.id });
  });

  it('a crise pesa mais no setor que sente o ciclo', () => {
    const media = (setor: string): number => {
      let soma = 0;
      for (let i = 0; i < 400; i++) {
        const e = adulto(misturar(11, i));
        operar(e, c, { tipo: 'abrir', setor, valor: 100000 });
        e.rng = criarRng(misturar(13, i));
        regraDaEmpresa(e, c, defFase(c, 'crise'), []);
        soma += empresaDe(e)?.n['lucro'] ?? -100000;
      }
      return soma / 400;
    };
    expect(media('construcao')).toBeLessThan(media('saude'));
  });
});

describe('efeitos de empresa nos storylets', () => {
  it('abrirEmpresa cria valor, tira capital de quem joga ou leva o negócio da família', () => {
    const a = adulto();
    efeitos(a, { abrirEmpresa: { setor: 'comercio', valor: 30000 } });
    expect(empresaDe(a)!.n['valor']).toBe(30000);
    expect(a.entidades['eu']!.n['dinheiro']).toBe(60000);
    // Já tem empresa: nada acontece.
    efeitos(a, { abrirEmpresa: { setor: 'saude', valor: 99999 } });
    expect(empresaDe(a)!.t['setor']).toBe('comercio');

    const b = adulto();
    const { valores } = efeitos(b, { abrirEmpresa: { setor: 'industria', fracao: 0.5 } });
    expect(valores['capital']).toBeCloseTo(50000);
    expect(patrimonioDe(b.entidades['eu']!)).toBeCloseTo(50000);

    const f = adulto();
    f.entidades['mae']!.n['dinheiro'] = 1_000_000;
    f.entidades['mae']!.t['setor'] = 'agro';
    efeitos(f, { abrirEmpresa: { copiarSetor: 'ator.setor', fracao: 0.4, de: 'ator' } }, 'mae');
    expect(empresaDe(f)!.t['setor']).toBe('agro');
    expect(empresaDe(f)!.n['valor']).toBeCloseTo(400000);
    expect(f.entidades['mae']!.n['dinheiro']).toBeCloseTo(600000);
  });

  it('rodada dilui sem mudar o que a parte vale na hora; vender um pedaço e fechar pagam o combinado', () => {
    const e = adulto();
    efeitos(e, { abrirEmpresa: { setor: 'tecnologia', valor: 800000 } });
    const { valores } = efeitos(e, { rodada: { parte: 0.2 } });
    expect(valores['rodada']).toBeCloseTo(200000);
    expect(empresaDe(e)!.n['participacao']).toBeCloseTo(0.8);
    expect(parteNaEmpresa(e)).toBeCloseTo(800000);
    const venda = efeitos(e, { venderEmpresa: { fracao: 0.25, premio: 1.2 } }).valores['venda']!;
    expect(venda).toBeCloseTo(1_000_000 * 0.8 * 0.25 * 1.2);
    expect(empresaDe(e)!.n['participacao']).toBeCloseTo(0.6);
    const sobra = efeitos(e, { fecharEmpresa: { sobra: 0.1 } }).valores['sobra']!;
    expect(sobra).toBeCloseTo(1_000_000 * 0.6 * 0.1);
    expect(empresaDe(e)).toBeUndefined();
  });

  it('fechar a empresa que sustentava quem joga leva a renda e o jeito de dono; uma que não sustentava, não', () => {
    const e = adulto();
    const reg: Mudanca[] = [];
    const entrada = novaEntrada(e, { tipo: 'evento', causa: 'escolha', texto: '' });
    const ef = { abrirEmpresa: { setor: 'comercio', valor: 30000 }, marcas: ['empreendedor', 'empresa.sustenta'], renda: { definir: 50000 } };
    aplicarEfeitos(e, c, ef as Efeitos, { origem: entrada.id, reg, valores: {} });
    efeitos(e, { fecharEmpresa: { sobra: 0 } });
    expect(e.entidades['eu']!.n['renda']).toBe(0);
    expect(e.entidades['eu']!.q['empreendedor']).toBeUndefined();

    const outra = adulto();
    efeitos(outra, { abrirEmpresa: { setor: 'comercio', valor: 30000 }, marcas: ['empreendedor'] });
    efeitos(outra, { venderEmpresa: { fracao: 1 } });
    expect(outra.entidades['eu']!.n['renda']).toBe(50000);
    expect(outra.entidades['eu']!.q['empreendedor']).toBeDefined();
  });
});

describe('a empresa na vida inteira', () => {
  function vidaComEmpresa(semente: number): EstadoVida {
    const e = nascer(c, { semente, ano: 2026 });
    const robo = criarRng(semente);
    while (e.vivo && e.idade < 25) passo(e, c, robo, 'cautelosa');
    while (e.pendente) passo(e, c, robo, 'cautelosa');
    if (!e.vivo) return e;
    e.entidades['eu']!.n['dinheiro'] = (e.entidades['eu']!.n['dinheiro'] ?? 0) + 50000;
    if (!empresaDe(e)) operar(e, c, { tipo: 'abrir', setor: 'tecnologia', valor: 40000 });
    for (let i = 0; i < 25 && e.vivo; i++) passo(e, c, robo, 'arriscada');
    return e;
  }

  it('toda mudança da empresa está no livro: soma das variações = estado final', () => {
    for (let i = 0; i < 6; i++) {
      const e = vidaComEmpresa(misturar(41, i));
      const soma = new Map<string, number>();
      for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
      const emp = e.entidades['empresa'];
      for (const campo of ['valor', 'tracao', 'participacao', 'retirada', 'lucro']) {
        expect(Math.abs((soma.get(`empresa.${campo}`) ?? 0) - (emp?.n[campo] ?? 0)), `${campo} (vida ${i})`).toBeLessThan(2);
      }
    }
  });

  it('o que a empresa causa descende da fundação, e abrir a empresa vira ponto de virada', () => {
    let vidas = 0;
    let viradas = 0;
    let comFilhos = 0;
    for (let i = 0; i < 10; i++) {
      const e = vidaComEmpresa(misturar(41, i));
      const fundacao = e.historico.find((h) => h.ref === 'empresa:abrir');
      if (!fundacao) continue;
      vidas++;
      if (e.historico.some((h) => h.tipo !== 'regra' && h.causas?.includes(fundacao.id))) comFilhos++;
      if (pontosDeVirada(e).some((p) => p.origemId === fundacao.id)) viradas++;
    }
    expect(vidas).toBeGreaterThanOrEqual(6);
    expect(comFilhos / vidas).toBeGreaterThanOrEqual(0.5);
    // Empresa que não saiu do lugar não é virada; a que cresceu costuma ser.
    expect(viradas).toBeGreaterThanOrEqual(2);
  });

  it('mesma semente e mesmas decisões dão a mesma empresa, mesmo salvando no meio', () => {
    const a = vidaComEmpresa(77);
    const b = vidaComEmpresa(77);
    expect(b.entidades['empresa']).toEqual(a.entidades['empresa']);
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: a }), c);
    expect(lido.vida!.entidades['empresa']).toEqual(a.entidades['empresa']);
    if (a.vivo && !a.pendente) {
      avancarAno(a, c);
      avancarAno(lido.vida!, c);
      expect(lido.vida!.entidades['empresa']).toEqual(a.entidades['empresa']);
    }
  });

  it('a empresa passa para o herdeiro, inteira quando o dinheiro paga a partilha', () => {
    const e = adulto(19, { dinheiro: 2_000_000 });
    efeitos(e, { abrirEmpresa: { setor: 'saude', valor: 5_000_000 }, personagens: ['filho'] });
    e.entidades['filho']!.nascimento = e.ano - 25;
    const nome = empresaDe(e)!.nome;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    const emp = h.entidades['empresa']!;
    expect(emp.nome).toBe(nome);
    expect(emp.n['participacao']).toBeCloseTo(1);
    expect(emp.q['fundada']!.causa).toBe(h.historico[0]!.id);
    expect(h.historico[0]!.texto).toContain(nome);
    // Sem dinheiro para o imposto, a parte na empresa paga a diferença.
    const pobre = adulto(23, { dinheiro: 0, renda_fixa: 0 });
    efeitos(pobre, { abrirEmpresa: { setor: 'saude', valor: 1_000_000 }, personagens: ['filho'] });
    pobre.entidades['filho']!.nascimento = pobre.ano - 30;
    morrer(pobre, c);
    const h2 = continuarComoHerdeiro(pobre, c);
    expect(h2.entidades['empresa']!.n['participacao']).toBeLessThan(1);
    expect(h2.entidades['empresa']!.n['participacao']).toBeGreaterThan(0.4);
  });
});

describe('validador da empresa', () => {
  it('não deixa o texto usar {empresa} sem exigir a empresa', () => {
    const reais = lerFontes();
    const sem = {
      id: 'empresa_fantasma',
      idade: [30, 40],
      texto: 'A {empresa} faz aniversário.',
      resumo: 'viu a empresa',
      escolhas: [{ texto: 'Ok', resumo: 'tudo ok', resultado: { texto: 'ok', efeitos: { felicidade: 1 } } }],
    };
    const com = { ...sem, id: 'empresa_de_verdade', condicoes: { 'empresa.valor': true } };
    const erros = (dados: unknown[]): string =>
      validarConteudo({ ...reais, storylets: [...reais.storylets, { arquivo: 'x.json', dados }] })
        .problemas.filter((p) => p.nivel === 'erro')
        .map((p) => p.mensagem)
        .join('\n');
    expect(erros([sem])).toMatch(/\{empresa\}/);
    expect(erros([com])).toBe('');
  });
});
