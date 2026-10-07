import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { bensDe, patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { regraDosBens } from '../src/motor/bens.ts';
import { carreiraDe, regraDaCarreira } from '../src/motor/carreira.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { continuarComoHerdeiro, herdeiroPossivel, IMPOSTO_HERANCA } from '../src/motor/herdeiro.ts';
import { ganhar } from '../src/motor/livro.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { proximaEleicao, regraDoPoder } from '../src/motor/poder.ts';
import { elegivel } from '../src/motor/storylets.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { defFase } from '../src/motor/ciclo.ts';
import { morrer, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

function adulto(semente = 3, n: Record<string, number> = {}, idade = 30): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = idade;
  e.ano += idade;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro: 0, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda: 60000, custo: 30000, inteligencia: 60, saude: 80 }, n);
  return e;
}

describe('bens e imóveis', () => {
  it('comprar à vista troca dinheiro por bem sem mudar o patrimônio; morar tira o aluguel do custo', () => {
    const e = adulto(1, { dinheiro: 1_000_000 });
    const antes = patrimonioTotal(e);
    const entrada = operar(e, c, { tipo: 'comprar', item: 'apartamento' });
    expect(entrada).toMatchObject({ tipo: 'dinheiro', causa: 'acao', ref: 'bens:comprar' });
    const [b] = bensDe(e);
    expect(b!.n['valor']).toBe(480000);
    expect(patrimonioTotal(e)).toBeCloseTo(antes, 0);
    // A primeira moradia já é a casa: o custo caiu e quem joga tem casa própria.
    expect(b!.q['moradia']).toBeTruthy();
    expect(e.entidades['eu']!.n['custo']).toBeLessThan(30000);
    expect(e.entidades['eu']!.q['casa_propria']).toBeTruthy();
  });

  it('financiar pede renda para a parcela; a parcela e os juros correm no ano', () => {
    const pobre = adulto(2, { dinheiro: 600_000, renda: 20000 });
    expect(motivoParaNaoOperar(pobre, c, { tipo: 'comprar', item: 'casa', financiar: true })).toMatch(/parcela/);
    const e = adulto(2, { dinheiro: 600_000, renda: 300000 });
    operar(e, c, { tipo: 'comprar', item: 'casa', financiar: true });
    const casa = bensDe(e)[0]!;
    expect(casa.n['financiado']).toBeCloseTo(600000, -2);
    const reg: Mudanca[] = [];
    regraDosBens(e, c, reg);
    expect(casa.n['financiado']).toBeLessThan(600000);
  });

  it('imóvel de renda paga aluguel todo ano e vender devolve o valor menos a corretagem', () => {
    const e = adulto(4, { dinheiro: 2_000_000 });
    operar(e, c, { tipo: 'comprar', item: 'sala_comercial' });
    const sala = bensDe(e)[0]!;
    expect(sala.q['alugado']).toBeTruthy();
    expect(e.entidades['eu']!.q['senhorio']).toBeTruthy();
    const conta = e.entidades['eu']!.n['dinheiro']!;
    regraDosBens(e, c, []);
    expect(e.entidades['eu']!.n['dinheiro']!).toBeGreaterThan(conta);
    const valor = sala.n['valor']!;
    const antes = e.entidades['eu']!.n['dinheiro']!;
    operar(e, c, { tipo: 'venderBem', id: sala.id });
    expect(bensDe(e)).toHaveLength(0);
    expect(e.entidades['eu']!.n['dinheiro']!).toBeCloseTo(antes + valor * 0.94, 0);
    expect(e.entidades['eu']!.q['senhorio']).toBeUndefined();
  });
});

describe('carreira', () => {
  it('requisito barra quem não tem; quem tem tenta uma vez por ano; contratado ganha cargo, setor e salário', () => {
    const e = adulto(5);
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatar', carreira: 'medico' })).toMatch(/exige/);
    // Insiste até passar (uma tentativa por ano).
    for (let i = 0; i < 20 && !carreiraDe(e, c); i++) {
      expect(motivoParaNaoOperar(e, c, { tipo: 'candidatar', carreira: 'vendedor' })).toBeNull();
      operar(e, c, { tipo: 'candidatar', carreira: 'vendedor' });
      if (!carreiraDe(e, c)) expect(motivoParaNaoOperar(e, c, { tipo: 'candidatar', carreira: 'vendedor' })).toMatch(/uma tentativa/);
      e.ano++;
      e.idade++;
    }
    expect(carreiraDe(e, c)?.id).toBe('vendedor');
    expect(e.entidades['eu']!.t['setor']).toBe('comercio');
    expect(e.entidades['eu']!.n['renda']).toBe(24000);
  });

  it('o cargo sobe com os anos, e uma demissão de storylet encerra a carreira', () => {
    const e = adulto(6);
    const eu = e.entidades['eu']!;
    Object.assign(eu.t, { carreira: 'programador', setor: 'tecnologia', ocupacao: 'programador' });
    eu.n['nivel'] = 0;
    eu.n['renda'] = 60000;
    eu.n['inteligencia'] = 90;
    for (let i = 0; i < 40 && (eu.n['nivel'] ?? 0) < 2; i++) regraDaCarreira(e, c, []);
    expect(eu.n['nivel']).toBeGreaterThanOrEqual(2);
    expect(eu.n['renda']).toBeGreaterThan(60000);
    expect(e.historico.some((h) => h.ref === 'carreira:promocao')).toBe(true);
    aplicarEfeitos(e, c, { renda: { definir: 0 } } as Efeitos, { origem: 0, reg: [], valores: {} });
    expect(carreiraDe(e, c)).toBeUndefined();
  });
});

describe('poder', () => {
  it('eleição só no ano dela; quem ganha assume com salário e mandato, que acaba sozinho', () => {
    const e = adulto(7, { dinheiro: 10_000_000, influencia: 60, aparencia: 70 });
    const vereador = c.mundo.cargos.find((k) => k.id === 'vereador')!;
    e.ano = proximaEleicao(e.ano, vereador) + 1;
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' })).toMatch(/próxima eleição/);
    e.ano = proximaEleicao(e.ano, vereador);
    operar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' });
    const eu = e.entidades['eu']!;
    expect(eu.n['dinheiro']).toBeCloseTo(10_000_000 - vereador.campanha, 0);
    if (eu.t['cargo'] !== 'vereador') return; // perdeu (raro com essa influência): o resto não se aplica
    expect(eu.n['renda']).toBe(vereador.salario);
    const fase = defFase(c, 'normal');
    for (let i = 0; i < 6 && eu.t['cargo']; i++) regraDoPoder(e, c, fase, []);
    expect(eu.t['cargo']).toBe('');
    expect(eu.q['ex_politico']).toBeTruthy();
  });

  it('a influência anda para o alvo: mais patrimônio, mais influência', () => {
    const pobre = adulto(8, { dinheiro: 10000 });
    const rico = adulto(8, { dinheiro: 500_000_000 });
    const fase = defFase(c, 'normal');
    for (let i = 0; i < 15; i++) {
      regraDoPoder(pobre, c, fase, []);
      regraDoPoder(rico, c, fase, []);
    }
    expect(rico.entidades['eu']!.n['influencia']!).toBeGreaterThan(pobre.entidades['eu']!.n['influencia']! + 15);
  });
});

describe('linhagens', () => {
  it('nascer na família real: princesa ou príncipe, pai ou mãe no trono, o país monarquia; a sucessão chega aos 18', () => {
    const e = nascer(c, { semente: 9, ano: 2026, origem: { linhagem: 'realeza' } });
    expect(e.entidades['eu']!.q['principe']).toBeTruthy();
    expect(e.entidades['pais']!.q['monarquia']).toBeTruthy();
    const papel = ['mae', 'pai'].find((p) => e.entidades[p]!.q['monarca'])!;
    expect(papel).toBeDefined();
    expect(e.historico[0]!.texto).toMatch(/Palácio/);
    const sucessao = c.porId.get('sucessao_coroa')!;
    e.idade = 30;
    e.ano += 30;
    expect(elegivel(sucessao, e, papel)).toBe(false);
    ganhar(e, [], papel, 'faleceu', null);
    e.entidades[papel]!.vivo = false;
    expect(elegivel(sucessao, e, papel)).toBe(true);
  });

  it('no começo em um toque, algumas vidas nascem numa linhagem; a escolha manual de classe não sorteia linhagem', () => {
    let comLinhagem = 0;
    for (let i = 0; i < 200; i++) {
      const e = nascer(c, { semente: 1000 + i, ano: 2026 });
      if (c.mundo.linhagens.some((l) => l.marcas.some((m) => e.entidades['eu']!.q[m]))) comLinhagem++;
    }
    expect(comLinhagem).toBeGreaterThan(15);
    expect(comLinhagem).toBeLessThan(80);
    const escolhida = nascer(c, { semente: 5, ano: 2026, origem: { classe: 2 } });
    expect(c.mundo.linhagens.some((l) => l.marcas.some((m) => escolhida.entidades['eu']!.q[m]))).toBe(false);
  });
});

describe('testamento', () => {
  function velorio(semente: number, para: string): EstadoVida {
    const e = adulto(semente, { renda_fixa: 1_000_000, irmaos: 2 }, 60);
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
    criarPersonagem(e, c, 'amor', []);
    e.entidades['amor']!.nascimento = e.ano - 58;
    ganhar(e, [], 'eu', 'namoro', null);
    ganhar(e, [], 'eu', 'casado', null);
    if (para) operar(e, c, { tipo: 'testamento', para: para as never });
    morrer(e, c);
    return e;
  }

  it('causa: a fortuna sai da família e não há quem continue', () => {
    expect(herdeiroPossivel(velorio(11, 'causa'), c)).toBeNull();
  });

  it('o par herda tudo, sem metade separada, e a história continua com ele, viúvo, com o filho do casal', () => {
    const e = velorio(12, 'amor');
    const par = e.entidades['amor']!;
    const h = herdeiroPossivel(e, c)!;
    expect(h.parentesco).toBe('amor');
    const nova = continuarComoHerdeiro(e, c);
    const eu = nova.entidades['eu']!;
    expect(eu.nome).toBe(par.nome);
    expect(eu.q['viuvo']).toBeTruthy();
    expect(eu.n['renda_fixa']! + (eu.n['dinheiro'] ?? 0)).toBeGreaterThan(1_000_000 * (1 - IMPOSTO_HERANCA) * 0.95);
    expect(nova.entidades['filho']?.nome).toBe(e.entidades['filho']!.nome);
    expect(nova.entidades['amor']?.vivo).toBe(false);
  });

  it('o melhor amigo herda com outro sobrenome; sem testamento, vale a lei (o filho)', () => {
    const e = velorio(13, 'amigo');
    const nova = continuarComoHerdeiro(e, c);
    expect(nova.entidades['eu']!.nome).toBe(e.entidades['amigo']!.nome);
    expect(nova.entidades['amigo']?.vivo).toBe(false);
    expect(nova.historico[0]!.texto).toMatch(/melhor amig/);
    expect(herdeiroPossivel(velorio(14, ''), c)?.parentesco).toBe('filho');
  });
});
