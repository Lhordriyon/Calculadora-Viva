import { describe, expect, it } from 'vitest';
import { lerFontes } from '../scripts/disco.ts';
import { VERBOS } from '../src/motor/constantes.ts';
import { tipoDe } from '../src/motor/conteudo.ts';
import { listarCadeias, validarConteudo } from '../src/motor/validacao.ts';

function errosCom(storylets: unknown[]): string {
  const reais = lerFontes();
  const { problemas } = validarConteudo({ ...reais, storylets: [...reais.storylets, { arquivo: 'x.json', dados: storylets }] });
  return problemas
    .filter((p) => p.nivel === 'erro')
    .map((p) => `${p.onde}: ${p.mensagem}`)
    .join('\n');
}

describe('conteúdo real', () => {
  const { conteudo, problemas } = validarConteudo(lerFontes());

  it('não tem erros de validação', () => {
    expect(problemas.filter((p) => p.nivel === 'erro')).toEqual([]);
    expect(conteudo).not.toBeNull();
  });

  it('tem eventos e iniciativas de personagens de 0 a 80+ anos, e ações para todos os verbos', () => {
    const apresentados = conteudo!.storylets.filter((s) => tipoDe(s) !== 'acao');
    expect(apresentados.length).toBeGreaterThanOrEqual(150);
    const idades = apresentados.flatMap((s) => s.idade ?? []);
    expect(Math.min(...idades)).toBeLessThanOrEqual(1);
    expect(Math.max(...idades)).toBeGreaterThanOrEqual(80);
    for (const verbo of VERBOS) expect(conteudo!.acoes.get(verbo)?.length ?? 0, verbo).toBeGreaterThanOrEqual(6);
    expect(conteudo!.storylets.filter((s) => tipoDe(s) === 'npc').length).toBeGreaterThanOrEqual(40);
  });

  it('tem pelo menos 8 cadeias de consequência de 3+ anos', () => {
    const pares = new Set(listarCadeias(conteudo!).filter((x) => x.anosMin >= 3).map((x) => `${x.de}→${x.para}`));
    expect(pares.size).toBeGreaterThanOrEqual(8);
  });
});

describe('validador', () => {
  it('acusa qualidade consultada que ninguém cria, variável desconhecida e agendamento quebrado', () => {
    const erros = errosCom([
      {
        id: 'quebrado',
        idade: [10, 20],
        condicoes: { marcas: ['marca_fantasma'] },
        texto: 'Oi {variavel_que_nao_existe}',
        resumo: 'quebrou',
        escolhas: [{ texto: 'Ok', resumo: 'tudo ok', resultado: { texto: 'ok', efeitos: { agendar: [{ evento: 'nao_existe', em: 2 }] } } }],
      },
    ]);
    expect(erros).toMatch(/marca_fantasma/);
    expect(erros).toMatch(/variavel_que_nao_existe/);
    expect(erros).toMatch(/nao_existe/);
  });

  it('acusa id repetido e caminho inválido', () => {
    expect(errosCom([{ id: 'enem', idade: [1, 2], texto: 'repetido', resumo: 'repetido', efeitos: { felicidade: 1 } }])).toMatch(/repetido/);
    const caminho = errosCom([
      { id: 'caminho_ruim', idade: [1, 2], condicoes: { 'chefe.saude': { min: 3 } }, texto: 'Um chefe.', resumo: 'teve um chefe', efeitos: { felicidade: 1 } },
    ]);
    expect(caminho).toMatch(/chefe/);
  });

  it('exige que um personagem novo seja garantido por qualidade', () => {
    const erros = errosCom([
      {
        id: 'usa_sem_exigir',
        idade: [30, 40],
        texto: '{amor} quer conversar.',
        resumo: 'conversou',
        escolhas: [{ texto: 'Ok', resumo: 'tudo ok', resultado: { texto: 'tudo ok', efeitos: {} } }],
      },
    ]);
    expect(erros).toMatch(/usa \{amor\}/);
  });

  it('bloqueia estado que ninguém lê ou que não muda nenhuma decisão', () => {
    const naoLida = errosCom([
      {
        id: 'grava_inutil',
        idade: [20, 30],
        texto: 'Nada.',
        resumo: 'nada',
        escolhas: [escolha('Tudo certo', { marcas: ['qualidade_inutil'] })],
      },
    ]);
    expect(naoLida).toMatch(/qualidade_inutil.*lido por ninguém/);
    // Lida só por um texto (sistema único, nenhuma decisão).
    const soTexto = errosCom([
      {
        id: 'grava_enfeite',
        idade: [20, 30],
        texto: 'Nada.',
        resumo: 'nada',
        escolhas: [escolha('Tudo certo', { marcas: ['enfeite'] })],
      },
      {
        id: 'le_enfeite',
        idade: [20, 30],
        texto: 'Algo {coisa}.',
        resumo: 'algo',
        trechos: { coisa: [{ se: { marcas: ['enfeite'] }, texto: 'bonito' }, { texto: 'feio' }] },
        efeitos: { felicidade: 1 },
      },
    ]);
    expect(soTexto).toMatch(/enfeite/);
  });

  it('não aceita partido com nome próprio (política é fictícia e genérica)', () => {
    const erros = errosCom([{ id: 'eleicao_real', idade: [20, 60], texto: 'O Partido Azul ganhou a eleição.', resumo: 'viu uma eleição', efeitos: { felicidade: 1 } }]);
    expect(erros).toMatch(/partido com nome próprio/);
    expect(errosCom([{ id: 'eleicao_generica', idade: [20, 60], texto: 'O partido do seu tio ganhou a eleição.', resumo: 'viu uma eleição', efeitos: { felicidade: 1 } }])).not.toMatch(/partido/);
  });

  it('exige que uma ação mexa em pelo menos dois sistemas', () => {
    const erros = errosCom([{ id: 'acao_rasa', tipo: 'acao', verbo: 'sair', rotulo: 'dar uma volta', idade: [18, 60], texto: 'Deu uma volta.', resumo: 'deu uma volta', efeitos: { felicidade: 1 } }]);
    expect(erros).toMatch(/acao_rasa.*2 sistemas/);
  });

  it('exige uma escolha sem condições (a vida nunca trava)', () => {
    const erros = errosCom([
      {
        id: 'trava',
        idade: [20, 30],
        texto: 'Escolha.',
        resumo: 'escolheu',
        escolhas: [{ ...escolha('Só com dinheiro', { felicidade: 1 }), condicoes: { dinheiro: { min: 1000000 } } }],
      },
    ]);
    expect(erros).toMatch(/escolha sem condições/);
  });
});

function escolha(texto: string, efeitos: Record<string, unknown>) {
  return { texto, resumo: texto.toLowerCase(), resultado: { texto: `${texto}.`, efeitos } };
}
