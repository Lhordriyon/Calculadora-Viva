import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { operar } from '../src/motor/carteira.ts';
import { chanceDeEntrar } from '../src/motor/carreira.ts';
import { empresaDe } from '../src/motor/empresa.ts';
import { influenciaNegocios, influenciaPessoal } from '../src/motor/influencia.ts';
import { limiteDeCredito } from '../src/motor/negocio.ts';
import { conquistasDoAno } from '../src/motor/poder.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

function adulto(semente = 51, dinheiro = 1_000_000): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.agenda = [];
  e.idade = 35;
  e.ano = e.anoNascimento + 35;
  Object.assign(e.entidades['eu']!.n, { dinheiro, divida: 0, fama: 0 });
  return e;
}

/** Ninguém com laço forte, e então `n` pessoas vivas com vínculo de 80. */
function lacos(e: EstadoVida, n: number): void {
  const gente = Object.values(e.entidades).filter((x) => x.tipo === 'pessoa' && x.id !== 'eu');
  for (const x of gente) x.n['vinculo'] = 0;
  for (const x of gente.filter((y) => y.vivo !== false && !y.q['ausente']).slice(0, n)) x.n['vinculo'] = 80;
}

describe('a influência (bloco ★)', () => {
  it('a esfera pessoal sai dos laços fortes e da fama, e abre a porta da vaga', () => {
    const e = adulto();
    lacos(e, 3);
    e.entidades['eu']!.n['fama'] = 50;
    expect(influenciaPessoal(e)).toBeCloseTo(53, 5);
    // A carreira mais difícil de entrar (as outras batem no teto de 95%).
    const def = [...c.mundo.carreiras].sort((a, b) => a.chance - b.chance)[0]!;
    const com = chanceDeEntrar(e, def);
    lacos(e, 0);
    e.entidades['eu']!.n['fama'] = 0;
    expect(com).toBeGreaterThan(chanceDeEntrar(e, def) * 1.15);
  });

  it('a esfera de negócios sai do tamanho do grupo e faz o banco emprestar mais', () => {
    const e = adulto(52, 2e9);
    operar(e, c, { tipo: 'abrir', setor: 'industria', valor: 1e9 });
    const emp = empresaDe(e)!;
    emp.n['lucro'] = 1e8;
    expect(influenciaNegocios(e)).toBeGreaterThan(40);
    expect(limiteDeCredito(c, emp, e)).toBeCloseTo(limiteDeCredito(c, emp) * (1 + influenciaNegocios(e) / 100), 0);
  });

  it('cada degrau vira conquista uma vez só, com a entrada na linha do tempo e a qualidade que o epitáfio lê', () => {
    const e = adulto(53);
    lacos(e, 3);
    e.entidades['eu']!.n['fama'] = 60;
    conquistasDoAno(e, c);
    conquistasDoAno(e, c);
    expect(e.historico.filter((h) => h.ref === 'conquista:conquista_querida')).toHaveLength(1);
    expect(e.entidades['eu']!.q['conquista_querida']).toBeTruthy();
    expect(e.entidades['eu']!.q['conquista_referencia']).toBeUndefined();
    expect(c.marcas['conquista_querida']?.epitafio).toBeTruthy();
  });
});
