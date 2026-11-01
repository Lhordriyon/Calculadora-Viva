import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { decidir, porqueDaResposta } from '../src/motor/decisao.ts';
import { lancar, novaEntrada, somar } from '../src/motor/livro.ts';
import { acoesComPessoa, agir, dicaDaChance } from '../src/motor/acoes.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

/** Um adulto de 30 anos com a mãe viva, sem mágoa nem história com ela. */
function adulto(semente = 7): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  const mae = e.entidades['mae']!;
  mae.vivo = true;
  mae.t['traco'] = 'trabalhador';
  Object.assign(mae.n, { vinculo: 60, magoa: 0, confianca: 0, sem_contato: 0, dinheiro: 50_000 });
  delete mae.q['doente'];
  delete mae.q['desempregado'];
  return e;
}

/** Quem joga fez algo com a mãe (o livro guarda): o dinheiro que passou e o que mexeu na relação. */
function fez(e: EstadoVida, resumo: string, mudar: (reg: Mudanca[]) => void): number {
  const entrada = novaEntrada(e, { tipo: 'acao', causa: 'acao', ref: 'teste', ator: 'mae', texto: resumo, resumo });
  const reg: Mudanca[] = [];
  mudar(reg);
  lancar(e, entrada, reg);
  return entrada.id;
}

describe('a pessoa decide (Ω2)', () => {
  it('o mesmo pedido, à mesma pessoa, sai diferente com a mágoa alta e com a confiança alta', () => {
    const magoada = adulto();
    Object.assign(magoada.entidades['mae']!.n, { magoa: 60, confianca: -30 });
    const confia = adulto();
    Object.assign(confia.entidades['mae']!.n, { magoa: 0, confianca: 30 });
    const nao = decidir(magoada, c, 'mae', 'dinheiro', 5000);
    const sim = decidir(confia, c, 'mae', 'dinheiro', 5000);
    expect(nao.chance).toBeLessThan(0.15);
    expect(sim.chance).toBeGreaterThan(0.75);
    expect(porqueDaResposta(magoada, c, 'mae', 'dinheiro', nao, false).texto).toMatch(/magoad|confia/);
    expect(porqueDaResposta(confia, c, 'mae', 'dinheiro', sim, true).texto).toBe('porque confia em você');
  });

  it('o favor fica lembrado: o porquê do sim aponta a entrada em que você ajudou', () => {
    const e = adulto();
    const ajuda = fez(e, 'pagou o conserto do carro de sua mãe', (reg) => {
      somar(e, reg, 'eu', 'dinheiro', -3000, undefined, 'mae');
      somar(e, reg, 'mae', 'dinheiro', 3000, undefined, 'eu');
      somar(e, reg, 'mae', 'vinculo', 2);
    });
    const d = decidir(e, c, 'mae', 'dinheiro', 2000);
    expect(d.motivos.some((m) => m.tipo === 'deu' && m.entrada === ajuda)).toBe(true);
    const p = porqueDaResposta(e, c, 'mae', 'dinheiro', d, true);
    expect(p.entrada).toBe(ajuda);
    expect(p.texto).toMatch(/^porque lembra de quando você pagou o conserto do carro dela, aos 30$/);
    // E sem o conserto, a chance é menor.
    expect(decidir(adulto(), c, 'mae', 'dinheiro', 2000).chance).toBeLessThan(d.chance);
  });

  it('quem não tem não empresta, por mais que queira; o porquê diz isso', () => {
    const e = adulto();
    // A confiança guarda a diferença para 60: +35 é confiança 95.
    Object.assign(e.entidades['mae']!.n, { dinheiro: 800, confianca: 35, vinculo: 90 });
    const d = decidir(e, c, 'mae', 'dinheiro', 5000);
    expect(d.chance).toBe(0);
    expect(porqueDaResposta(e, c, 'mae', 'dinheiro', d, false).texto).toBe('porque não tem esse dinheiro');
  });

  it('o traço pesa: a generosa empresta mais que a mão de vaca, e perdoa mais que a rígida', () => {
    const com = (traco: string, pedido: 'dinheiro' | 'perdao'): number => {
      const e = adulto();
      e.entidades['mae']!.t['traco'] = traco;
      if (pedido === 'perdao') e.entidades['mae']!.n['magoa'] = 30;
      return decidir(e, c, 'mae', pedido, pedido === 'dinheiro' ? 2000 : undefined).chance;
    };
    expect(com('generoso', 'dinheiro')).toBeGreaterThan(com('mao_fechada', 'dinheiro') + 0.2);
    expect(com('generoso', 'perdao')).toBeGreaterThan(com('rigido', 'perdao') + 0.15);
  });

  it('a folha mostra como a pessoa está para o pedido, sem mostrar a conta', () => {
    expect([dicaDaChance(0), dicaDaChance(0.2), dicaDaChance(0.5), dicaDaChance(0.8)]).toEqual(['não tem como', 'difícil', 'pode ser que sim', 'deve dizer sim']);
    const e = adulto();
    e.entidades['mae']!.n['magoa'] = 30;
    const perdao = acoesComPessoa(e, c, 'mae').find((o) => o.s.id === 'pedir_desculpas');
    expect(perdao?.dica).toBeTruthy();
    // O que não depende da pessoa (o presente, a visita) não tem dica.
    expect(acoesComPessoa(e, c, 'mae').filter((o) => !o.s.teste?.decide).every((o) => o.dica === undefined)).toBe(true);
  });

  it('no storylet, o pedido de perdão sai com o porquê no texto e a lembrança que pesou como causa', () => {
    // A mesma vida, duas vezes: uma em que você faltou ao aniversário (a mágoa tem entrada), outra sem história.
    const e = adulto(11);
    const falta = fez(e, 'faltou ao aniversário de sua mãe', (reg) => {
      somar(e, reg, 'mae', 'magoa', 45);
      somar(e, reg, 'mae', 'vinculo', -10);
    });
    let achou = false;
    for (let semente = 0; semente < 40 && !achou; semente++) {
      const x = structuredClone(e);
      x.rng = criarRng(semente + 1);
      const h = agir(x, c, 'familia', { id: 'pedir_desculpas', ator: 'mae' });
      expect(h.resultado).toMatch(/porque|sem |depois de|como /);
      if (h.causas?.[0] === falta) {
        achou = true;
        expect(h.resultado).toMatch(/lembra de quando você faltou ao aniversário/);
      }
    }
    expect(achou).toBe(true);
  });
});
