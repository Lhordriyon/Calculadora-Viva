/** O texto combina com o que já aconteceu: o cargo não repete a profissão. */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { profissaoComCargo } from '../src/motor/carreira.ts';

describe('a carreira não repete o nome no cargo', () => {
  it('mostra o cargo só quando ele diz algo novo; quando um começa pelo outro, fica o mais longo', () => {
    expect(profissaoComCargo('médica', 'residente')).toBe('médica (residente)');
    expect(profissaoComCargo('cantor', 'cantor de barzinho')).toBe('cantor de barzinho');
    expect(profissaoComCargo('atendente de telemarketing', 'atendente')).toBe('atendente de telemarketing');
    expect(profissaoComCargo('técnica de enfermagem', 'técnica de enfermagem')).toBe('técnica de enfermagem');
    expect(profissaoComCargo('modelo', 'modelo de catálogo')).toBe('modelo de catálogo');
    // Só a primeira palavra em comum: o cargo já diz a profissão.
    expect(profissaoComCargo('professora universitária', 'professora adjunta')).toBe('professora adjunta');
    expect(profissaoComCargo('jogador de futebol', 'jogador da segunda divisão')).toBe('jogador da segunda divisão');
    // Palavra inteira: "cantor" não é o começo de "cantora de barzinho".
    expect(profissaoComCargo('cantor', 'cantora de barzinho')).toBe('cantor (cantora de barzinho)');
  });

  it('nenhuma profissão do mundo sai como "X (X…)"', () => {
    const c = carregarConteudo();
    for (const k of c.mundo.carreiras) {
      for (const g of ['m', 'f'] as const) {
        const [nome, cargo] = [k.nome, k.cargos[0]!].map((t) => {
          const [m, f] = t.split('|');
          return g === 'f' ? (f ?? m!) : m!;
        }) as [string, string];
        const texto = profissaoComCargo(nome, cargo);
        const m = /^(.+?) \((.+)\)$/.exec(texto);
        if (m) expect(m[1]!.split(' ')[0] === m[2]!.split(' ')[0], `${k.id}: ${texto}`).toBe(false);
      }
    }
  });
});
