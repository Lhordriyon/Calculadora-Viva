import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { filhosVivos } from '../src/motor/campos.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { ganhar } from '../src/motor/livro.ts';
import { criarPersonagem } from '../src/motor/pessoas.ts';
import { aplicarStorylet, atoresPossiveis } from '../src/motor/storylets.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { avancarAno, morrer, nascer } from '../src/motor/vida.ts';
import { conteudoCom } from './apoio.ts';

const c = carregarConteudo();

/** Quem joga, aos `idade`, com filhos das idades dadas (o primeiro é o mais velho). */
function comFilhos(semente: number, idade: number, idades: number[]): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = idade;
  e.ano += idade;
  ganhar(e, [], 'eu', 'pai_mae', null);
  for (const i of idades) {
    const id = criarPersonagem(e, c, 'filho', [])!;
    e.entidades[id]!.nascimento = e.ano - i;
  }
  return e;
}

describe('vários filhos', () => {
  it('um filho novo não apaga o outro: cada um tem o seu lugar, e eu.filhos conta', () => {
    const e = comFilhos(3, 35, [8, 3, 1]);
    expect(['filho', 'filho2', 'filho3'].map((id) => e.entidades[id]?.vivo)).toEqual([true, true, true]);
    expect(new Set(['filho', 'filho2', 'filho3'].map((id) => e.entidades[id]!.nome)).size).toBe(3);
    expect(e.entidades['eu']!.n['filhos']).toBe(3);
    expect(filhosVivos(e).map((x) => x.id)).toEqual(['filho', 'filho2', 'filho3']);
    // Com os quatro lugares ocupados, não nasce mais ninguém.
    criarPersonagem(e, c, 'filho', []);
    expect(criarPersonagem(e, c, 'filho', [])).toBeUndefined();
    expect(e.entidades['eu']!.n['filhos']).toBe(4);
  });

  it('o storylet que cria um filho fala do recém-nascido, e o que ele agenda é sobre esse filho', () => {
    const conteudo = conteudoCom([
      {
        id: 'nasce_mais_um',
        apenasAgendado: true,
        texto: 'Nasceu {filho}, irmão de quem já estava aqui.',
        resumo: 'teve {filho}',
        efeitos: { personagens: ['filho'], agendar: [{ evento: 'filho_adolescente', em: 14 }] },
      },
    ]);
    const e = comFilhos(4, 32, [6]);
    const primeiro = e.entidades['filho']!.nome;
    const entrada = aplicarStorylet(e, conteudo, conteudo.porId.get('nasce_mais_um')!, undefined, 'diretor');
    const novo = e.entidades['filho2']!;
    expect(entrada.texto).toContain(novo.nome);
    expect(entrada.texto).not.toContain(primeiro);
    expect(entrada.resumo).toBe(`teve ${novo.nome}`);
    expect(e.agenda.find((a) => a.evento === 'filho_adolescente')?.ator).toBe('filho2');
  });

  it('o conteúdo escrito para "filho" vale para cada filho', () => {
    const e = comFilhos(5, 40, [12, 9]);
    const s = c.storylets.find((x) => x.ator?.length === 1 && x.ator[0] === 'filho')!;
    expect(atoresPossiveis(s, e)).toEqual(['filho', 'filho2']);
  });

  it('todos os filhos vivem o ano (a saúde do segundo anda), e o livro fecha para ele', () => {
    const e = comFilhos(6, 30, [4, 1]);
    const inicio = { ...e.entidades['filho2']!.n };
    for (let i = 0; i < 12 && e.vivo; i++) {
      if (e.pendente) e.pendente = null;
      avancarAno(e, c);
    }
    const agora = e.entidades['filho2']!;
    expect(agora.n['saude']).not.toBe(inicio['saude']);
    const soma: Record<string, number> = {};
    for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.c.startsWith('filho2.') && m.d !== undefined) soma[m.c.slice(7)] = (soma[m.c.slice(7)] ?? 0) + m.d;
    // A mesma tolerância do teste do livro (test/fundamentos.test.ts): centavos de arredondamento.
    for (const [campo, v] of Object.entries(agora.n)) expect(Math.abs((inicio[campo] ?? 0) + (soma[campo] ?? 0) - v), campo).toBeLessThan(2);
  });
});

describe('a herança entre irmãos', () => {
  function velorio(testamento = ''): EstadoVida {
    const e = comFilhos(7, 70, [40, 36]);
    Object.assign(e.entidades['eu']!.n, { dinheiro: 1_000_000, renda_fixa: 0, divida: 0 });
    if (testamento) e.entidades['eu']!.t['testamento'] = testamento;
    morrer(e, c);
    return e;
  }

  it('sem testamento, o mais velho continua e divide com o irmão; os irmãos vão para a vida nova', () => {
    const e = velorio();
    const mais = e.entidades['filho']!;
    expect(herdeiroPossivel(e, c)?.nome).toBe(mais.nome);
    const nova = continuarComoHerdeiro(e, c);
    const sozinho = continuarComoHerdeiro(velorio('filho'), c);
    expect(nova.entidades['eu']!.n['irmaos']).toBe(1);
    expect(nova.entidades['eu']!.n['dinheiro']).toBeCloseTo(sozinho.entidades['eu']!.n['dinheiro']! / 2, 0);
    expect(nova.historico[0]!.texto).toContain(e.entidades['filho2']!.nome);
  });

  it('o testamento escolhe o filho: tudo para ele, e a história continua com ele', () => {
    const e = velorio('filho2');
    expect(herdeiroPossivel(e, c)?.nome).toBe(e.entidades['filho2']!.nome);
    const nova = continuarComoHerdeiro(e, c);
    expect(nova.entidades['eu']!.nome).toBe(e.entidades['filho2']!.nome);
    expect(nova.entidades['eu']!.n['irmaos']).toBe(1);
  });

  it('se o primeiro filho morreu, o segundo herda (não um sobrinho)', () => {
    const e = comFilhos(8, 70, [40, 36]);
    e.entidades['filho']!.vivo = false;
    morrer(e, c);
    expect(herdeiroPossivel(e, c)).toMatchObject({ parentesco: 'filho', nome: e.entidades['filho2']!.nome });
  });
});

describe('o save de antes dos vários filhos', () => {
  it('ganha a conta dos filhos, e a adolescência agendada passa a falar do filho', () => {
    const e = comFilhos(9, 30, [2]);
    delete e.entidades['eu']!.n['filhos'];
    e.agenda.push({ evento: 'filho_adolescente', ano: e.ano + 12, origem: null, ator: 'amor' });
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    expect(lido.entidades['eu']!.n['filhos']).toBe(1);
    expect(lido.agenda.find((a) => a.evento === 'filho_adolescente')?.ator).toBe('filho');
  });
});
