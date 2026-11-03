import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { custoDaOpa, empresaDe, ofertaContraVoce, OFERTAS_CONTRA } from '../src/motor/empresa.ts';
import { novaMemoria } from '../src/motor/memoria.ts';
import { BOLSA } from '../src/motor/regras.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const c = conteudo;

function responder(e: EstadoVida): void {
  while (e.pendente) escolher(e, c, Math.max(0, e.pendente.opcoes.findIndex((o) => o.disponivel)));
}

/** Um adulto com uma empresa grande na bolsa (e a concorrente com dono, que chega no primeiro ano). */
function naBolsa(semente = 71): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 40;
  e.ano = e.anoNascimento + 40;
  Object.assign(e.entidades['eu']!.n, { dinheiro: 2e9, divida: 0 });
  operar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 3e8 });
  responder(e);
  avancarAno(e, c, novaMemoria());
  responder(e);
  operar(e, c, { tipo: 'abrirCapital' });
  return e;
}

const ultima = (e: EstadoVida) => e.historico.at(-1)!;

describe('a bolsa de verdade (bloco H7)', () => {
  it('emitir ações põe dinheiro novo no caixa e encolhe a parte de quem joga; as contas fecham', () => {
    const e = naBolsa();
    const emp = empresaDe(e)!;
    expect(emp.q['na_bolsa']).toBeTruthy();
    const parte = emp.n['participacao']!;
    const caixa = emp.n['caixa'] ?? 0;
    operar(e, c, { tipo: 'emitir' });
    expect(emp.n['participacao']).toBeCloseTo(parte * (1 - BOLSA.emissao), 6);
    expect(emp.n['caixa']!).toBeGreaterThan(caixa);
    expect(conferirContas(e, ultima(e))).toEqual([]);
    expect(motivoParaNaoOperar(e, c, { tipo: 'emitir' })).toBe('uma emissão por ano');
  });

  it('recomprar a maioria custa a quem joga e volta a 51%; com a maioria, não há o que recomprar', () => {
    const e = naBolsa(72);
    const emp = empresaDe(e)!;
    expect(motivoParaNaoOperar(e, c, { tipo: 'recomprar' })).toBe('a maioria já é sua');
    emp.n['participacao'] = 0.4;
    const dinheiro = e.entidades['eu']!.n['dinheiro']!;
    operar(e, c, { tipo: 'recomprar' });
    expect(emp.n['participacao']).toBeCloseTo(BOLSA.controle, 6);
    expect(e.entidades['eu']!.n['dinheiro']!).toBeLessThan(dinheiro);
    expect(conferirContas(e, ultima(e))).toEqual([]);
  });

  it('a oferta hostil compra a concorrente sem pedir ao dono, com prêmio; quando falha, custa e fortalece a rival', () => {
    const base = naBolsa(73);
    expect(base.entidades['rival']).toBeDefined();
    expect(motivoParaNaoOperar(base, c, { tipo: 'opa' })).toBeNull();
    const tentar = (rng: number): EstadoVida => {
      const e = structuredClone(base);
      e.rng = criarRng(rng);
      operar(e, c, { tipo: 'opa' });
      return e;
    };
    let ok: EstadoVida | undefined;
    let falhou: EstadoVida | undefined;
    for (let i = 0; i < 40 && (!ok || !falhou); i++) {
      const e = tentar(300 + i);
      if (ultima(e).texto.startsWith('A oferta hostil deu certo')) ok ??= e;
      else falhou ??= e;
    }
    expect(ok?.entidades['rival']).toBeUndefined();
    expect(empresaDe(ok!)!.q['aquisicoes']).toBeTruthy();
    expect(conferirContas(ok!, ultima(ok!))).toEqual([]);
    expect(falhou?.entidades['rival']!.n['magoa']).toBeGreaterThanOrEqual(BOLSA.magoaDaOferta);
    expect(empresaDe(falhou!)!.n['concorrente']!).toBeGreaterThan(empresaDe(base)!.n['concorrente']!);
    const pagou = base.entidades['eu']!.n['dinheiro']! - falhou!.entidades['eu']!.n['dinheiro']!;
    expect(pagou).toBeCloseTo(custoDaOpa(base) * BOLSA.custoDaOferta, 0);
    expect(motivoParaNaoOperar(falhou!, c, { tipo: 'opa' })).toBe(`uma oferta a cada ${BOLSA.anosEntreOfertas} anos`);
  });

  it('sem a maioria na bolsa, a oferta contra quem joga chega pela agenda, com a entrada que a deixou sem maioria', () => {
    const base = naBolsa(74);
    operar(base, c, { tipo: 'emitir' });
    const diluiu = ultima(base).id;
    empresaDe(base)!.n['participacao'] = 0.45;
    // Quem compra é sorteado: a dona da concorrente (seis em dez) ou um fundo de fora; nos dois, a causa é a diluição.
    const vistos = new Set<string>();
    for (let i = 0; i < 200 && vistos.size < 2; i++) {
      const e = structuredClone(base);
      e.rng = criarRng(500 + i);
      ofertaContraVoce(e, c);
      const oferta = e.agenda.find((a) => (OFERTAS_CONTRA as readonly string[]).includes(a.evento));
      if (!oferta) continue;
      vistos.add(oferta.evento);
      expect(oferta.origem).toBe(diluiu);
      if (oferta.evento === 'a_opa_da_rival') expect(oferta.ator).toBe('rival');
    }
    expect([...vistos].sort()).toEqual(['a_opa_da_rival', 'a_opa_do_fundo']);
  });
});
