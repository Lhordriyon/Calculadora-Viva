/** O texto combina com o que já aconteceu: o amigo de infância não é um estranho, o filho único não tem irmão e o cargo não repete a profissão. */
import { describe, expect, it } from 'vitest';
import { carregarConteudo, lerFontes } from '../scripts/disco.ts';
import { profissaoComCargo } from '../src/motor/carreira.ts';
import { aplicarEscolha, apresentarStorylet } from '../src/motor/storylets.ts';
import { nascer } from '../src/motor/vida.ts';
import { validarConteudo } from '../src/motor/validacao.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';

function errosCom(storylets: unknown[], linhas: unknown[] = []): string {
  const reais = lerFontes();
  const { problemas } = validarConteudo({
    ...reais,
    storylets: [...reais.storylets, { arquivo: 'x.json', dados: storylets }],
    linhas: [...(reais.linhas as unknown[]), ...linhas],
  });
  return problemas
    .filter((p) => p.nivel === 'erro')
    .map((p) => `${p.onde}: ${p.mensagem}`)
    .join('\n');
}

const evento = (id: string, extra: Record<string, unknown>) => ({
  id,
  idade: [6, 10],
  texto: 'Um dia qualquer.',
  resumo: 'viveu um dia qualquer',
  escolhas: [{ texto: 'Seguir', resumo: 'seguiu', resultado: { texto: 'Seguiu.', efeitos: { felicidade: 1 } } }],
  ...extra,
});

describe('validador: o amigo de infância não é um estranho', () => {
  it('recusa "chamado {amigo}" e "conheceu {amigo}"', () => {
    const chamado = errosCom([evento('amigo_estranho', { texto: '{amigo:Um menino|Uma menina} chamad{amigo:o|a} {amigo} pediu a sua borracha.' })]);
    expect(chamado).toMatch(/amigo_estranho › texto: apresenta o amigo de infância como desconhecido/);
    const conheceu = errosCom([evento('amigo_conhecido_de_novo', { resumo: 'conheceu {amigo} na escola' })]);
    expect(conheceu).toMatch(/amigo_conhecido_de_novo › resumo: apresenta o amigo de infância como desconhecido/);
    const comoAtor = errosCom([evento('ator_estranho', { ator: ['amigo'], tipo: 'npc', texto: 'Uma criança chamada {ator} bateu na porta.' })]);
    expect(comoAtor).toMatch(/ator_estranho › texto: apresenta o amigo/);
  });

  it('aceita o amigo já conhecido e quem conhece o amigo (não é quem joga)', () => {
    const certo = errosCom([
      evento('amigo_de_sempre', { condicoes: { 'amigo.vivo': true }, texto: 'Na carteira do lado, {amigo}, que mora na sua rua, pediu a sua borracha.', resumo: 'emprestou a borracha para {amigo}' }),
      evento('amor_conhece_amigo', { idade: [25, 40], condicoes: { marcas: ['namoro'], 'amigo.vivo': true }, texto: '{amor} conheceu {amigo} num churrasco.' }),
    ]);
    expect(certo).not.toMatch(/(amigo_de_sempre|amor_conhece_amigo).*desconhecido/);
  });
});

describe('validador: o irmão de quem é filho único', () => {
  it('recusa irmão sem "irmaos" na condição, no texto, no trecho padrão, no desfecho e no botão', () => {
    const SEM_IRMAO = /fala do irmão de quem joga sem saber se ele existe/;
    expect(errosCom([evento('irmao_no_texto', { texto: 'Seu irmão menor chora no quarto.' })])).toMatch(/irmao_no_texto › texto: fala do irmão/);
    const padrao = evento('irmao_no_padrao', {
      texto: 'Na hora do almoço, {quem}.',
      trechos: { quem: [{ se: { irmaos: { min: 1 } }, texto: 'seu irmão rouba a coxinha' }, { texto: 'a sua irmã rouba a coxinha' }] },
    });
    expect(errosCom([padrao])).toMatch(/irmao_no_padrao › trechos\.quem\[1\]: fala do irmão/);
    expect(errosCom([padrao])).not.toMatch(/irmao_no_padrao › trechos\.quem\[0\]: fala do irmão/);
    const desfecho = evento('irmao_no_desfecho', { escolhas: [{ texto: 'Ajudar', resumo: 'ajudou', resultado: { texto: 'Você cuidou dos irmãos menores.', efeitos: { felicidade: 1 } } }] });
    expect(errosCom([desfecho])).toMatch(/irmao_no_desfecho › escolha 1 › resultado: fala do irmão/);
    // A condição da escolha vale para o desfecho, mas o botão aparece mesmo bloqueado.
    const botao = evento('irmao_no_botao', {
      escolhas: [
        { texto: 'Chamar o irmão', resumo: 'chamou o irmão', condicoes: { irmaos: { min: 1 } }, resultado: { texto: 'Seu irmão veio correndo.', efeitos: { felicidade: 1 } } },
        { texto: 'Seguir', resumo: 'seguiu', resultado: { texto: 'Seguiu.', efeitos: { felicidade: 1 } } },
      ],
    });
    const errosBotao = errosCom([botao]);
    expect(errosBotao).toMatch(/irmao_no_botao › escolha 1 › texto: fala do irmão/);
    expect(errosBotao).not.toMatch(/irmao_no_botao › escolha 1 › resultado: fala do irmão/);
    expect(errosCom([], [{ idade: [8, 12], texto: 'Você e seu irmão dividiram o último pastel.' }])).toMatch(SEM_IRMAO);
  });

  it('aceita o irmão garantido, o meio-irmão, o irmão dos outros, a comparação e os irmãos dos filhos', () => {
    const certo = errosCom([
      evento('irmao_garantido', { condicoes: { irmaos: { min: 1 } }, texto: 'Seu irmão menor chora no quarto.' }),
      evento('irmao_dos_outros', { texto: 'Você cuidou do irmão do vizinho e virou meio-irmão de ninguém. Brigam como irmãos de verdade.' }),
      {
        id: 'irmaos_dos_filhos',
        tipo: 'npc',
        ator: ['filho'],
        idade: [30, 50],
        condicoes: { filhos: { min: 2 }, marcas: ['pai_mae'] },
        texto: '{ator} brigou com os irmãos pelo controle da TV.',
        resumo: '{ator} brigou com os irmãos',
        efeitos: { felicidade: -1, 'ator.vinculo': -1 },
      },
    ]);
    expect(certo).not.toMatch(/(irmao_garantido|irmao_dos_outros|irmaos_dos_filhos).*fala do irmão/);
  });
});

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
