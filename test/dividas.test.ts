/**
 * A dívida como contrato (fatia 1.2): toda dívida de quem joga é um contrato com o banco; o que se deve é o que o banco
 * tem a receber, entrada por entrada; juros, pagamento, atraso, nome sujo, caducar, acordo e leilão seguem as regras de
 * dividas.ts e bens.ts, com o porquê no livro.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { regraDosBens } from '../src/motor/bens.ts';
import { bensDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContratos, conferirDividas, garantiasDosContratos } from '../src/motor/contas.ts';
import { abrirContrato, CHEQUE_ESPECIAL, contratosDe, creditoNovo, financiamentoDe, jurosDoAno, mexerNoSaldo } from '../src/motor/contratos.ts';
import { contrairEmprestimo, propostaDeAcordo, regraDasDividas } from '../src/motor/dividas.ts';
import { economiaDoAno, movimentar } from '../src/motor/economia.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { ganhar, lancar, novaEntrada } from '../src/motor/livro.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { ACORDO_REAL, descontoDoAcordo, LANCE_DO_LEILAO, MORA_REAL, MULTA_ATRASO, PRAZO_ACORDO, parcelaPrice } from '../src/motor/regras.ts';
import type { Estrategia } from '../src/motor/robos.ts';
import { misturar } from '../src/motor/rng.ts';
import type { Entidade, EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { morrer, nascer } from '../src/motor/vida.ts';
import { viverAteOFim } from './apoio.ts';

const c = carregarConteudo();
const ESTRATEGIAS: Estrategia[] = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'];

function adulto(semente = 3, n: Record<string, number> = {}, idade = 30): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = idade;
  e.ano += idade;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro: 0, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0, renda: 0, custo: 30000, inteligencia: 60, saude: 80 }, n);
  return e;
}

/** Uma entrada visível no livro (a escolha que fez a dívida), para ser o porquê. */
function escolha(e: EstadoVida, resumo: string): number {
  return lancar(e, novaEntrada(e, { tipo: 'evento', causa: 'diretor', ref: 'teste', texto: resumo, resumo }), []).id;
}

const eu = (e: EstadoVida): Entidade => e.entidades['eu']!;
const refs = (e: EstadoVida, ref: string) => e.historico.filter((h) => h.ref === ref);

describe('a dívida como contrato', () => {
  it('em toda entrada de toda vida (sorteadas, de fortuna, de linhagem e herdeiros), o que se deve é o que o banco tem a receber', () => {
    const vidas: EstadoVida[] = [];
    const origens = [undefined, undefined, { classe: 0 }, { classe: 2 }, { classe: 6 }, { linhagem: 'realeza' }] as const;
    origens.forEach((origem, o) => {
      for (let k = 0; k < 4; k++) {
        const e = nascer(c, { semente: misturar(3310, o, k), ano: 2026, ...(origem ? { origem } : {}) });
        vidas.push(viverAteOFim(e, c, k + 7, ESTRATEGIAS[k]!));
      }
    });
    for (const [i, e] of vidas.entries()) if (i % 3 === 0 && herdeiroPossivel(e, c)) vidas.push(viverAteOFim(continuarComoHerdeiro(e, c), c, 90 + i, 'arriscada'));
    let financiamentos = 0;
    let entradas = 0;
    for (const e of vidas) {
      expect(conferirDividas(e), `fim da vida de ${eu(e).nome}`).toEqual([]);
      const garantias = garantiasDosContratos(e);
      financiamentos += [...garantias.values()].length;
      for (const h of e.historico) {
        entradas++;
        expect(conferirContratos(h, garantias), `entrada #${h.id} (${h.tipo} ${h.ref ?? ''}, aos ${h.idade})`).toEqual([]);
      }
    }
    expect(entradas).toBeGreaterThan(10000);
    // A amostra passa pelo financiamento (a arriscada financia a casa).
    expect(financiamentos).toBeGreaterThan(0);
  });

  it('a dívida de uma escolha é um empréstimo do banco que nasce da entrada; em dia paga o juro do momento, em atraso a mora', () => {
    const e = adulto(1);
    const origem = escolha(e, 'casou numa festa parcelada');
    const reg: Mudanca[] = [];
    aplicarEfeitos(e, c, { divida: 20000 }, { origem, reg, valores: {} });
    const [ct] = contratosDe(e);
    expect(ct).toMatchObject({ tipo: 'contrato', t: { modalidade: 'emprestimo', credor: 'banco', origem: String(origem) }, n: { saldo: 20000 } });
    expect(eu(e).n['divida']).toBe(20000);
    expect(reg.find((m) => m.c === 'eu.divida')).toMatchObject({ d: 20000, p: 'banco' });
    expect(jurosDoAno(e, [], 0.1).juros).toBeCloseTo(2000, 6);
    ct!.n['atraso'] = 1;
    expect(jurosDoAno(e, [], 0.1).mora).toBeCloseTo(22000 * MORA_REAL, 6);
  });

  it('o dinheiro que sobra paga o atrasado primeiro, depois o cheque especial e os empréstimos do mais antigo; o acordo só pela parcela', () => {
    const e = adulto(2);
    const reg: Mudanca[] = [];
    movimentar(e, reg, { dinheiro: -5000, contraparte: 'mercado' });
    expect(e.entidades[CHEQUE_ESPECIAL]?.n['saldo']).toBe(5000);
    const antigo = contrairEmprestimo(e, reg, 3000, 10)!;
    const atrasado = contrairEmprestimo(e, reg, 4000, 20)!;
    atrasado.n['atraso'] = 1;
    const acordo = abrirContrato(e, reg, { modalidade: 'acordo', origem: 30, parcela: 600 });
    mexerNoSaldo(e, reg, acordo, 2000, 'acordo');
    movimentar(e, reg, { dinheiro: 8000, contraparte: 'mercado' });
    expect(e.entidades[atrasado.id]).toBeUndefined();
    expect(e.entidades[CHEQUE_ESPECIAL]!.n['saldo']).toBeCloseTo(1000, 6);
    expect(antigo.n['saldo']).toBe(3000);
    expect(acordo.n['saldo']).toBe(2000);
    expect(eu(e).n['divida']).toBeCloseTo(6000, 6);
    expect(conferirDividas(e)).toEqual([]);
  });

  it('passou do limite no fim do ano: quem tem investimento resgata; quem não tem atrasa, paga multa, suja o nome com o porquê e recebe a carta', () => {
    const comReserva = adulto(3, { renda_fixa: 20000 });
    contrairEmprestimo(comReserva, [], 45000, escolha(comReserva, 'financiou um carro zero'));
    regraDasDividas(comReserva, c, []);
    expect(comReserva.entidades['eu']!.q['nome_sujo']).toBeUndefined();
    expect(eu(comReserva).n['divida']).toBeCloseTo(30000, 6);
    expect(eu(comReserva).n['renda_fixa']).toBeCloseTo(5000, 6);

    const e = adulto(3);
    const origem = escolha(e, 'financiou um carro zero');
    const ct = contrairEmprestimo(e, [], 45000, origem)!;
    regraDasDividas(e, c, []);
    expect(ct.n['atraso']).toBe(1);
    expect(ct.n['saldo']).toBeCloseTo(45000 * (1 + MULTA_ATRASO), 6);
    const [sujo] = refs(e, 'divida:nome_sujo');
    expect(sujo?.causas).toEqual([origem]);
    expect(sujo?.texto).toMatch(/cadastro de devedores/);
    expect(eu(e).q['nome_sujo']?.causa).toBe(sujo!.id);
    expect(e.agenda).toContainEqual({ evento: 'nome_sujo', ano: e.ano + 1, origem: sujo!.id });
    expect(creditoNovo(e)).toBe(0);
    expect(motivoParaNaoOperar(e, c, { tipo: 'comprar', item: 'kitnet', financiar: true })).toMatch(/nome sujo/);
    expect(conferirDividas(e)).toEqual([]);
  });

  it('a linha do tempo mostra o porquê do nome sujo: a escolha de um ano antes que fez a dívida', () => {
    const e = adulto(11);
    const festa = lancar(
      e,
      novaEntrada(e, { tipo: 'evento', causa: 'diretor', ref: 'teste', texto: 'A festa.', escolha: { indice: 0, texto: 'Parcelar', resumo: 'casou numa festa parcelada' } }),
      [],
    );
    contrairEmprestimo(e, [], 45000, festa.id);
    e.idade++;
    e.ano++;
    regraDasDividas(e, c, []);
    const sujo = refs(e, 'divida:nome_sujo')[0]!;
    expect(porqueDe(sujo, new Map(e.historico.map((h) => [h.id, h])))).toEqual({ idade: e.idade - 1, texto: 'você casou numa festa parcelada' });
  });

  it('com o nome sujo, o buraco do ano vira privação, não dívida nova', () => {
    const e = adulto(4, { renda: 10000, custo: 40000 });
    ganhar(e, [], 'eu', 'nome_sujo', null);
    const ano = economiaDoAno(e, [], { inflacao: 0.045 });
    expect(ano.privacao).toBe(true);
    expect(eu(e).n['divida']).toBe(0);
  });

  it('dívida atrasada só sai do atraso paga, renegociada ou caduca; paga, o nome limpa', () => {
    const e = adulto(5);
    const ct = contrairEmprestimo(e, [], 45000, escolha(e, 'parcelou a festa'))!;
    regraDasDividas(e, c, []);
    // A renda subiu e a dívida voltaria a caber no limite: continua atrasada.
    eu(e).n['renda'] = 100000;
    regraDasDividas(e, c, []);
    expect(ct.n['atraso']).toBe(2);
    expect(eu(e).q['nome_sujo']).toBeTruthy();
    movimentar(e, [], { dinheiro: 60000, contraparte: 'mercado' });
    expect(e.entidades[ct.id]).toBeUndefined();
    regraDasDividas(e, c, []);
    expect(eu(e).q['nome_sujo']).toBeUndefined();
    expect(refs(e, 'divida:nome_limpo')).toHaveLength(1);
  });

  it('dívida atrasada há cinco anos caduca: o banco perde, a dívida some e o nome limpa', () => {
    const e = adulto(6);
    const origem = escolha(e, 'parcelou a festa');
    const ct = contrairEmprestimo(e, [], 45000, origem)!;
    for (let i = 0; i < 5; i++) regraDasDividas(e, c, []);
    expect(e.entidades[ct.id]).toBeUndefined();
    expect(eu(e).n['divida']).toBeCloseTo(0, 6);
    const [caducou] = refs(e, 'divida:caducou');
    expect(caducou?.causas).toEqual([origem]);
    expect(caducou?.mudancas?.find((m) => m.c === 'eu.divida')).toMatchObject({ r: 'caducou', p: 'banco' });
    expect(eu(e).q['nome_sujo']).toBeUndefined();
  });

  it('renegociar: o desconto cresce com o atraso, o acordo tem parcela Price e quebra se a parcela não couber', () => {
    const e = adulto(7);
    contrairEmprestimo(e, [], 45000, escolha(e, 'parcelou a festa'));
    regraDasDividas(e, c, []);
    regraDasDividas(e, c, []);
    const proposta = propostaDeAcordo(e)!;
    expect(proposta.depois).toBeCloseTo(proposta.antes * (1 - descontoDoAcordo(2)), 6);
    expect(proposta.parcela).toBeCloseTo(parcelaPrice(proposta.depois, ACORDO_REAL, PRAZO_ACORDO), 6);
    expect(motivoParaNaoOperar(e, c, { tipo: 'renegociar' })).toBeNull();
    const entrada = operar(e, c, { tipo: 'renegociar' });
    expect(entrada).toMatchObject({ tipo: 'dinheiro', causa: 'acao', ref: 'divida:renegociar' });
    const [acordo] = contratosDe(e);
    expect(acordo).toMatchObject({ t: { modalidade: 'acordo', origem: String(entrada.id) } });
    expect(acordo!.n['saldo']).toBeCloseTo(proposta.depois, 6);
    expect(eu(e).n['divida']).toBeCloseTo(proposta.depois, 6);
    expect(eu(e).q['nome_sujo']).toBeUndefined();
    expect(motivoParaNaoOperar(e, c, { tipo: 'renegociar' })).toMatch(/atrasado/);
    // No ano seguinte, a parcela: com a conta, paga; sem conta nem limite (o cheque especial cheio), o acordo quebra.
    e.ano++;
    eu(e).n['dinheiro'] = proposta.parcela + 100;
    regraDasDividas(e, c, []);
    expect(acordo!.n['atraso'] ?? 0).toBe(0);
    expect(acordo!.n['saldo']).toBeCloseTo(proposta.depois - proposta.parcela, 6);
    e.ano++;
    movimentar(e, [], { dinheiro: -30000, contraparte: 'mercado' });
    regraDasDividas(e, c, []);
    expect(acordo!.n['atraso']).toBe(1);
    expect(refs(e, 'divida:nome_sujo').at(-1)?.texto).toMatch(/acordo quebrado/);
    expect(conferirDividas(e)).toEqual([]);
  });

  it('financiamento: contrato com o imóvel em garantia; a parcela sai todo ano; dois anos sem pagar, o banco leiloa, com o porquê na compra', () => {
    const e = adulto(8, { dinheiro: 600_000, renda: 300_000 });
    const compra = operar(e, c, { tipo: 'comprar', item: 'casa', financiar: true });
    const casa = bensDe(e)[0]!;
    const ct = financiamentoDe(e, casa.id)!;
    expect(ct).toMatchObject({ t: { modalidade: 'financiamento', garantia: casa.id, origem: String(compra.id), credor: 'banco' } });
    expect(ct.n['saldo']).toBeCloseTo(600_000, -2);
    expect(casa.n['financiado']).toBe(ct.n['saldo']);
    eu(e).n['dinheiro'] = 200_000;
    const antes = ct.n['saldo']!;
    regraDosBens(e, c, []);
    expect(ct.n['saldo']).toBeLessThan(antes);
    expect(ct.n['atraso'] ?? 0).toBe(0);
    // Perdeu o emprego, gastou a reserva e o cheque especial está no limite: a parcela não cabe.
    Object.assign(eu(e).n, { renda: 0, dinheiro: 0 });
    movimentar(e, [], { dinheiro: -30000, contraparte: 'mercado' });
    regraDosBens(e, c, []);
    regraDasDividas(e, c, []);
    expect(ct.n['atraso']).toBe(1);
    expect(refs(e, 'divida:nome_sujo')[0]?.causas).toEqual([compra.id]);
    const valor = casa.n['valor']!;
    regraDosBens(e, c, []);
    const [leilao] = refs(e, 'divida:leilao');
    expect(leilao?.causas).toEqual([compra.id]);
    expect(e.entidades[casa.id]).toBeUndefined();
    expect(e.entidades[ct.id]).toBeUndefined();
    expect(eu(e).q['casa_propria']).toBeUndefined();
    expect(leilao?.texto).toMatch(/leilão/);
    expect(valor * LANCE_DO_LEILAO).toBeGreaterThan(0);
    expect(conferirDividas(e)).toEqual([]);
  });

  it('o herdeiro leva o imóvel com o financiamento; a dívida sem garantia fica com o espólio', () => {
    const e = adulto(9, { dinheiro: 900_000, renda: 400_000 }, 60);
    operar(e, c, { tipo: 'comprar', item: 'casa', financiar: true });
    contrairEmprestimo(e, [], 20_000, escolha(e, 'parcelou a reforma'));
    criarPersonagem(e, c, 'filho', []);
    e.entidades['filho']!.nascimento = e.ano - 30;
    morrer(e, c);
    const nova = continuarComoHerdeiro(e, c);
    const casa = bensDe(nova)[0];
    expect(casa).toBeDefined();
    const ct = financiamentoDe(nova, casa!.id);
    expect(ct?.n['saldo']).toBeCloseTo(casa!.n['financiado']!, 6);
    expect(nova.entidades['eu']!.n['divida']).toBe(0);
    expect(contratosDe(nova).filter((x) => x.t['modalidade'] !== 'financiamento')).toHaveLength(0);
    expect(conferirDividas(nova)).toEqual([]);
    // No livro novo, o imóvel e o financiamento têm ids da abertura: a entrada de mesmo número da vida nova não compra
    // outro bem por cima deste nem reusa o contrato depois de quitado.
    const abertura = nova.historico[0]!.id;
    expect(casa!.id.startsWith(`bem${abertura}`)).toBe(true);
    expect(ct!.id.startsWith(`ctr${abertura}`)).toBe(true);
    expect(ct!.t['origem']).toBe(String(abertura));
  });

  it('save: os contratos vão e voltam iguais; o save de antes dos contratos migra a dívida e o financiamento', () => {
    const e = adulto(10, { dinheiro: 600_000, renda: 300_000 });
    operar(e, c, { tipo: 'comprar', item: 'casa', financiar: true });
    contrairEmprestimo(e, [], 20_000, escolha(e, 'parcelou a reforma'));
    const save = { ...saveVazio(), vida: e };
    expect(lerSave(escreverSave(save), c)).toEqual(save);
    const antigo = structuredClone(e);
    for (const ct of contratosDe(antigo)) delete antigo.entidades[ct.id];
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: antigo }), c).vida!;
    expect(conferirDividas(lido)).toEqual([]);
    expect(lido.entidades[CHEQUE_ESPECIAL]?.n['saldo']).toBeCloseTo(20_000, 6);
    expect(financiamentoDe(lido, bensDe(lido)[0]!.id)?.n['parcela']).toBeGreaterThan(0);
  });
});
