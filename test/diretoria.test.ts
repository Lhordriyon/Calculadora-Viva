import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { decidir } from '../src/motor/decisao.ts';
import { propostaDoGestor, seguirProposta, textoDaProposta } from '../src/motor/diretoria.ts';
import { ajusteDaVenda, empresaDe } from '../src/motor/empresa.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { garraDaRival } from '../src/motor/negocio.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { novaMemoria } from '../src/motor/memoria.ts';

const c = conteudo;

/** Um adulto de 35 anos com uma empresa de verdade (o negócio com capacidade), e o ano seguinte vivido. */
function comEmpresa(semente = 61, valor = 2e6): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 35;
  e.ano = e.anoNascimento + 35;
  Object.assign(e.entidades['eu']!.n, { dinheiro: valor * 3, divida: 0 });
  operar(e, c, { tipo: 'abrir', setor: 'comercio', valor });
  passarAno(e);
  return e;
}

function responder(e: EstadoVida): void {
  while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
}

function passarAno(e: EstadoVida): void {
  responder(e);
  avancarAno(e, c, novaMemoria());
  responder(e);
}

describe('o capitalismo com rosto (bloco H6)', () => {
  it('a concorrente ganha nome e dono, que chega na linha do tempo e sai quando a empresa acaba', () => {
    const e = comEmpresa();
    const rival = e.entidades['rival']!;
    expect(rival).toBeDefined();
    expect(rival.t['negocio']).toBeTruthy();
    expect(rival.t['setor']).toBe('comercio');
    expect(e.historico.some((h) => h.ref === 'regra:rival_chegou' && h.texto.includes(rival.t['negocio']!))).toBe(true);
    operar(e, c, { tipo: 'vender', empresa: 'empresa' });
    passarAno(e);
    expect(e.entidades['rival']).toBeUndefined();
  });

  it('o jeito do dono muda a briga: o traço e a mágoa dão a garra da concorrente', () => {
    const e = comEmpresa(62);
    const emp = empresaDe(e)!;
    const rival = e.entidades['rival']!;
    rival.n['magoa'] = 0;
    rival.t['traco'] = 'brigao';
    const brigao = garraDaRival(e, c, emp);
    rival.t['traco'] = 'carinhoso';
    const carinhoso = garraDaRival(e, c, emp);
    expect(brigao).toBeGreaterThan(carinhoso * 3);
    rival.n['magoa'] = 40;
    expect(garraDaRival(e, c, emp)).toBeCloseTo(carinhoso * 1.5, 5);
  });

  it('comprar a concorrente é pedir ao dono: magoado, ele não vende (com o porquê); de bem, vende e fica para tocar o negócio', () => {
    // Abaixo de R$ 10 milhões: ainda sem gestor, a cadeira está vaga para o dono que vende.
    const e = comEmpresa(63, 5e6);
    expect(e.entidades['gestor']).toBeUndefined();
    const rival = e.entidades['rival']!;
    expect(motivoParaNaoOperar(e, c, { tipo: 'adquirir' })).toBeNull();
    Object.assign(rival.n, { magoa: 100, vinculo: 0 });
    expect(decidir(e, c, 'rival', 'aceitar', undefined, ajusteDaVenda(empresaDe(e)!)).chance).toBeLessThan(0.1);
    // De bem com quem joga, a chance passa da metade.
    const deBem = structuredClone(e);
    Object.assign(deBem.entidades['rival']!.n, { magoa: 0, vinculo: 90 });
    expect(decidir(deBem, c, 'rival', 'aceitar', undefined, ajusteDaVenda(empresaDe(deBem)!)).chance).toBeGreaterThan(0.5);
    // O não: nada comprado, e a tentativa do ano acabou.
    let recusa = structuredClone(e);
    for (let i = 0; i < 20 && !operar(recusa, c, { tipo: 'adquirir' }).texto.includes('não quis vender'); i++) {
      recusa = structuredClone(e);
      recusa.rng = criarRng(100 + i);
    }
    expect(recusa.historico.at(-1)!.texto).toContain('não quis vender');
    expect(empresaDe(recusa)!.q['aquisicoes']).toBeUndefined();
    expect(motivoParaNaoOperar(recusa, c, { tipo: 'adquirir' })).toBe('uma tentativa por ano');
    // O sim: o dono vira o gestor, a mesma pessoa.
    let compra = structuredClone(deBem);
    for (let i = 0; i < 20 && compra.entidades['rival']; i++) {
      compra = structuredClone(deBem);
      compra.rng = criarRng(200 + i);
      operar(compra, c, { tipo: 'adquirir' });
    }
    expect(compra.entidades['gestor']?.pessoa).toBe(rival.pessoa);
    expect(compra.entidades['rival']).toBeUndefined();
  });

  it('o gestor chega com a empresa grande e propõe com os números do dia; seguir faz a jogada, recusar não', () => {
    let e = comEmpresa(64, 40e6);
    for (let i = 0; i < 6 && !e.entidades['gestor']?.t['proposta']; i++) passarAno(e);
    const gestor = e.entidades['gestor'];
    expect(gestor).toBeDefined();
    const op = propostaDoGestor(e, c);
    if (!op) return;
    expect(gestor!.t['proposta']).toBe(textoDaProposta(e, op));
    const responder = (segue: boolean): EstadoVida => {
      const x = structuredClone(e);
      const reg: Mudanca[] = [];
      const entrada = novaEntrada(x, { tipo: 'evento', causa: 'escolha', ref: 'a_proposta_do_gestor', texto: 'teste' });
      seguirProposta(x, c, reg, segue, entrada.id);
      lancar(x, entrada, reg);
      return x;
    };
    const seguiu = responder(true);
    const recusou = responder(false);
    expect(seguiu.entidades['gestor']!.t['proposta']).toBe('');
    expect(recusou.entidades['gestor']!.t['proposta']).toBe('');
    expect(seguiu.historico.at(-1)!.mudancas!.some((m) => m.c.startsWith('empresa.'))).toBe(true);
    expect(recusou.historico.at(-1)!.mudancas!.some((m) => m.c.startsWith('empresa.'))).toBe(false);
    e = seguiu;
  });
});
