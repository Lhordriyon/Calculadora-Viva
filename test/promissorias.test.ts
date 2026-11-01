import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { entreVoceE, lerCaminho, patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContas, conferirDividas, conferirPromissorias } from '../src/motor/contas.ts';
import { decidir, porqueDaResposta } from '../src/motor/decisao.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { anoDasPromissorias, promissoriasDe } from '../src/motor/promissorias.ts';
import { lembrancasDe } from '../src/motor/relacoes.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import type { Entrada, EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

/** Um adulto de 30 anos, com a mãe viva e com dinheiro guardado. */
function adulto(semente = 7, dinheiro = 0): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  const mae = e.entidades['mae']!;
  mae.vivo = true;
  Object.assign(mae.n, { vinculo: 60, magoa: 0, confianca: 0, sem_contato: 0, dinheiro: 100_000 });
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0 });
  return e;
}

/** Uma escolha de quem joga com a mãe, com os efeitos dados (como o conteúdo faria). */
function escolha(e: EstadoVida, resumo: string, efeitos: Record<string, unknown>): Entrada {
  // Os efeitos com objeto (emprestar, prorrogar) não cabem no índice dos caminhos do tipo: o conteúdo passa pelo esquema.
  const ef = efeitos as Efeitos;
  const entrada = novaEntrada(e, { tipo: 'evento', causa: 'escolha', ref: 'teste', ator: 'mae', texto: resumo, escolha: { indice: 0, texto: resumo, resumo } });
  const reg: Mudanca[] = [];
  aplicarEfeitos(e, c, ef, { origem: entrada.id, ator: 'mae', reg, valores: {} });
  return lancar(e, entrada, reg);
}

/** O ano das promissórias, como a etapa do ano faria (com a entrada invisível das regras). */
function umAno(e: EstadoVida): Entrada[] {
  e.ano += 1;
  e.idade += 1;
  const antes = e.historico.length;
  const reg: Mudanca[] = [];
  anoDasPromissorias(e, c, reg);
  lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'regra:ano', texto: '' }), reg);
  return e.historico.slice(antes);
}

function contasFecham(e: EstadoVida): void {
  for (const h of e.historico) {
    expect(conferirContas(e, h), `entrada #${h.id} ${h.ref ?? ''}`).toEqual([]);
    expect(conferirPromissorias(h), `entrada #${h.id} ${h.ref ?? ''}`).toEqual([]);
  }
  expect(conferirDividas(e)).toEqual([]);
}

describe('o empréstimo entre pessoas (Ω2)', () => {
  it('pegar emprestado com a mãe: o dinheiro anda, a promissória nasce com ela de credora, e o patrimônio não sobe', () => {
    const e = adulto();
    const antes = patrimonioTotal(e);
    const h = escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 20_000, anos: 4 } });
    const [ct] = promissoriasDe(e);
    expect(ct).toBeDefined();
    expect(ct!.t['credor']).toBe(String(e.entidades['mae']!.pessoa));
    expect(ct!.t['devedor']).toBe('eu');
    expect(ct!.t['origem']).toBe(String(h.id));
    expect(ct!.n).toMatchObject({ saldo: 20_000, parcela: 5_000, vencimento: e.ano + 4 });
    expect(e.entidades['eu']!.n['dinheiro']).toBe(20_000);
    expect(e.entidades['mae']!.n['dinheiro']).toBe(80_000);
    // A dívida com a mãe não é com o banco: não entra em eu.divida, e o patrimônio fica onde estava.
    expect(e.entidades['eu']!.n['divida']).toBe(0);
    expect(patrimonioTotal(e)).toBeCloseTo(antes, 0);
    expect(lerCaminho(e, 'mae.voce_deve')).toBe(20_000);
    contasFecham(e);
  });

  it('a parcela sai todo ano; a última vira confiança, e a quitação aponta o empréstimo', () => {
    const e = adulto(7, 30_000);
    const h = escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 10_000, anos: 2 } });
    const confianca = Number(lerCaminho(e, 'mae.confianca'));
    expect(umAno(e).filter((x) => x.tipo !== 'regra')).toHaveLength(0);
    expect(entreVoceE(e, 'mae').voceDeve).toBe(5_000);
    const fim = umAno(e).find((x) => x.ref === 'regra:divida_quitada');
    expect(fim).toBeDefined();
    expect(fim!.causas).toContain(h.id);
    expect(promissoriasDe(e)).toHaveLength(0);
    expect(Number(lerCaminho(e, 'mae.confianca'))).toBeGreaterThan(confianca);
    expect(e.entidades['mae']!.n['dinheiro']).toBe(100_000);
    contasFecham(e);
  });

  it('sem dinheiro, a parcela atrasa e magoa; três anos é calote, que vira a pior lembrança', () => {
    const e = adulto();
    escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 12_000, anos: 3 } });
    e.entidades['eu']!.n['dinheiro'] = 0;
    const atraso = umAno(e).find((x) => x.ref === 'regra:parcela_atrasada');
    expect(atraso).toBeDefined();
    expect(e.entidades['mae']!.n['magoa']).toBeGreaterThan(0);
    umAno(e);
    const calote = umAno(e).find((x) => x.ref === 'regra:calote');
    expect(calote).toBeDefined();
    expect(promissoriasDe(e)).toHaveLength(0);
    expect(lembrancasDe(e, 'mae').ruim?.entrada).toBe(calote!.id);
    // A mãe não empresta de novo, e o porquê é a lembrança do calote.
    const d = decidir(e, c, 'mae', 'dinheiro', 5_000);
    expect(d.chance).toBeLessThan(0.3);
    const p = porqueDaResposta(e, c, 'mae', 'dinheiro', d, false);
    expect(p.texto).toMatch(/calote|confia|magoad/);
    contasFecham(e);
  });

  it('quem você ainda não pagou não empresta de novo, e diz por quê', () => {
    const e = adulto();
    const h = escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 20_000, anos: 4 } });
    const d = decidir(e, c, 'mae', 'dinheiro', 5_000);
    const m = d.motivos.find((x) => x.tipo === 'deve');
    expect(m?.entrada).toBe(h.id);
    expect(porqueDaResposta(e, c, 'mae', 'dinheiro', { chance: d.chance, motivos: [m!] }, false).texto).toBe('porque você ainda deve R$ 20 mil a ela');
  });

  it('quem te deve paga quando pode; quem morre devendo leva a dívida, com notícia', () => {
    const e = adulto(9, 50_000);
    escolha(e, 'emprestou dinheiro a sua mãe', { emprestar: { de: 'eu', para: 'ator', valor: 9_000, anos: 3 } });
    expect(lerCaminho(e, 'mae.te_deve')).toBe(9_000);
    e.entidades['mae']!.n['dinheiro'] = 0;
    expect(umAno(e).find((x) => x.ref === 'regra:devedor_atrasou')).toBeDefined();
    e.entidades['mae']!.vivo = false;
    const fim = umAno(e).find((x) => x.ref === 'regra:morreu_devendo');
    expect(fim?.texto).toMatch(/morreu devendo R\$ 9 mil/);
    expect(promissoriasDe(e)).toHaveLength(0);
    contasFecham(e);
  });

  it('acertar, perdoar e prorrogar mexem na promissória com as contas fechando', () => {
    const e = adulto(11, 40_000);
    escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 8_000, anos: 2 } });
    escolha(e, 'pediu mais prazo a sua mãe', { prorrogar: { com: 'ator', anos: 2 } });
    expect(promissoriasDe(e)[0]!.n['vencimento']).toBe(e.ano + 4);
    escolha(e, 'pagou tudo a sua mãe', { acertar: 'ator' });
    expect(promissoriasDe(e)).toHaveLength(0);
    expect(e.entidades['mae']!.n['dinheiro']).toBe(100_000);
    escolha(e, 'emprestou dinheiro a sua mãe', { emprestar: { de: 'eu', para: 'ator', valor: 3_000, anos: 1 } });
    escolha(e, 'perdoou a dívida de sua mãe', { perdoar: 'ator' });
    expect(promissoriasDe(e)).toHaveLength(0);
    contasFecham(e);
  });

  it('a folha Dinheiro quita de uma vez: a confiança volta, e a pessoa lembra disso como coisa que você fez', () => {
    const e = adulto(13, 0);
    escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 6_000, anos: 3 } });
    const [ct] = promissoriasDe(e);
    e.entidades['eu']!.n['dinheiro'] = 1_000;
    expect(motivoParaNaoOperar(e, c, { tipo: 'quitar_promissoria', id: ct!.id })).toBe('não há tanto dinheiro na conta');
    e.entidades['eu']!.n['dinheiro'] = 10_000;
    const confianca = Number(lerCaminho(e, 'mae.confianca'));
    const h = operar(e, c, { tipo: 'quitar_promissoria', id: ct!.id });
    expect(h).toMatchObject({ tipo: 'dinheiro', ref: 'promissoria:quitar_promissoria' });
    expect(promissoriasDe(e)).toHaveLength(0);
    expect(Number(lerCaminho(e, 'mae.confianca'))).toBeGreaterThan(confianca);
    expect(lembrancasDe(e, 'mae').boa?.entrada).toBe(h.id);
    contasFecham(e);
  });

  it('a promissória sobrevive ao save', () => {
    const e = adulto();
    escolha(e, 'pegou dinheiro emprestado com sua mãe', { emprestar: { de: 'ator', para: 'eu', valor: 20_000, anos: 4 } });
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    expect(promissoriasDe(lido).map((x) => x.n['saldo'])).toEqual([20_000]);
    expect(lerCaminho(lido, 'mae.voce_deve')).toBe(20_000);
  });
});
