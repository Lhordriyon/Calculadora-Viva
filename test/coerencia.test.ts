/** O texto combina com o que já aconteceu: o amigo de infância não é um estranho e o cargo não repete a profissão. */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { profissaoComCargo } from '../src/motor/carreira.ts';
import { aplicarEscolha, apresentarStorylet } from '../src/motor/storylets.ts';
import { nascer } from '../src/motor/vida.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';

describe('o primeiro dia de escola lembra do que já aconteceu', () => {
  const c = carregarConteudo();
  const s = c.porId.get('primeiro_dia_escola')!;

  function aos5(mexer: (e: EstadoVida) => void): EstadoVida {
    const e = nascer(c, { semente: 7, ano: 2026 });
    e.idade = 5;
    e.pendente = null;
    mexer(e);
    apresentarStorylet(e, s, undefined, 'diretor', []);
    return e;
  }

  it('quem dividiu o balde reencontra o amigo; quem nunca o viu ganha um vizinho, não um estranho', () => {
    const doBalde = aos5((e) => {
      e.entidades['eu']!.q['amigo_de_infancia'] = { v: 1, ano: e.ano - 2, idade: 3, causa: null };
    });
    const amigo = doBalde.entidades['amigo']!.nome;
    expect(doBalde.pendente!.texto).toContain(`${amigo}, ${doBalde.entidades['amigo']!.genero === 'f' ? 'a mesma' : 'o mesmo'} do balde da pracinha`);
    // Aceitar o biscoito: a amizade já existia, então ela continua (não "virou").
    const entrada = aplicarEscolha(doBalde, c, s, 0, { tipo: 'evento', ref: s.id, instancia: s.id, texto: doBalde.pendente!.texto, opcao: 'Aceitar o biscoito' });
    expect(entrada.resultado).toMatch(/parceria do balde/);
    expect(entrada.resultado).toMatch(/continua/);

    const novo = aos5((e) => {
      delete e.entidades['eu']!.q['amigo_de_infancia'];
      delete e.entidades['eu']!.q['pre_escola'];
    });
    expect(novo.pendente!.texto).not.toMatch(/chamad[oa]/);
    expect(novo.pendente!.texto).toMatch(/Na carteira do lado, .+, que mora (na sua rua|no seu condomínio), oferece/);
    const primeira = aplicarEscolha(novo, c, s, 0, { tipo: 'evento', ref: s.id, instancia: s.id, texto: novo.pendente!.texto, opcao: 'Aceitar o biscoito' });
    expect(primeira.resultado).toMatch(/virou/);
  });
});

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
