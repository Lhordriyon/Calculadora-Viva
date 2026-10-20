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

  it('com ator filho, recusa "filho" no lugar do ator (o storylet vale para cada filho, e {filho} é o primeiro)', () => {
    const base = { tipo: 'npc', ator: ['filho'], idade: [30, 60], condicoes: { marcas: ['pai_mae'], 'ator.idade': { min: 5 } } };
    const noTexto = errosCom([{ ...base, id: 'desenho_do_primeiro', texto: '{filho} fez um desenho.', resumo: '{ator} fez um desenho', efeitos: { felicidade: 1, 'ator.vinculo': 2 } }]);
    expect(noTexto).toMatch(/desenho_do_primeiro: com ator filho.*\{filho\}/);
    const noEfeito = errosCom([{ ...base, id: 'colo_do_primeiro', texto: '{ator} pediu colo.', resumo: '{ator} pediu colo', efeitos: { felicidade: 1, 'filho.vinculo': 2 } }]);
    expect(noEfeito).toMatch(/colo_do_primeiro: com ator filho.*"filho\.vinculo"/);
    const certo = errosCom([{ ...base, id: 'colo_de_cada_um', texto: '{ator} pediu colo.', resumo: '{ator} pediu colo', efeitos: { felicidade: 1, 'ator.vinculo': 2 } }]);
    expect(certo).not.toMatch(/colo_de_cada_um/);
  });

  it('só o storylet que o nascimento de um irmão agenda fala dos dois filhos ({filho} e {ator})', () => {
    const ciume = { tipo: 'npc', ator: ['filho'], apenasAgendado: true, condicoes: { marcas: ['pai_mae'] }, resumo: '{ator} chegou', efeitos: { felicidade: 1 } };
    const nascimento = (id: string, condicoes: Record<string, unknown>, evento: string) => ({
      id,
      idade: [20, 45],
      condicoes,
      texto: 'Nasceu {filho}.',
      resumo: 'teve {filho}',
      efeitos: { felicidade: 1, personagens: ['filho'], marcas: ['pai_mae'], agendar: [{ evento, em: 2 }] },
    });
    // Agendado pelo segundo nascimento (quem agenda exige pai_mae): o ator é o irmão novo, e {filho} é o mais velho.
    const doIrmao = errosCom([nascimento('nasce_o_irmao', { marcas: ['pai_mae'] }, 'ciume_do_irmao_novo'), { ...ciume, id: 'ciume_do_irmao_novo', texto: '{filho} tem ciúme de {ator}.' }]);
    expect(doIrmao).not.toMatch(/com ator filho/);
    // Agendado pelo primeiro nascimento: o ator pode ser o próprio primeiro filho.
    const doPrimeiro = errosCom([nascimento('nasce_o_primeiro', {}, 'ciume_do_primeiro'), { ...ciume, id: 'ciume_do_primeiro', texto: '{filho} tem ciúme de {ator}.' }]);
    expect(doPrimeiro).toMatch(/ciume_do_primeiro: com ator filho/);
  });

  it('{cacula} é um filho: exige a qualidade que garante os filhos', () => {
    const cacula = (id: string, condicoes?: Record<string, unknown>) => ({ id, idade: [30, 40], ...(condicoes ? { condicoes } : {}), texto: '{cacula} dormiu no sofá.', resumo: 'viu {cacula} dormir no sofá', efeitos: { felicidade: 1 } });
    expect(errosCom([cacula('cacula_sem_filho')])).toMatch(/cacula_sem_filho.*usa \{cacula\}/);
    expect(errosCom([cacula('cacula_com_filho', { marcas: ['pai_mae'] })])).not.toMatch(/cacula_com_filho/);
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

  it('morto não fala: quem pode ter morrido só aparece em texto que sabe se está vivo', () => {
    const base = { idade: [30, 50], resumo: 'ouviu o pai', efeitos: { felicidade: 1 } };
    const SEM_SABER = /usa \{pai\} sem saber se a pessoa está viva/;
    // Sem "pai.vivo": o pai morto perguntaria da pós.
    expect(errosCom([{ ...base, id: 'pai_fantasma', texto: '{pai} perguntou se agora você é doutor.' }])).toMatch(SEM_SABER);
    // Na condição, ou num trecho (vivo: a fala; morto: a lembrança), passa.
    expect(errosCom([{ ...base, id: 'pai_vivo', condicoes: { 'pai.vivo': true }, texto: '{pai} perguntou se agora você é doutor.' }])).not.toMatch(SEM_SABER);
    const trecho = {
      ...base,
      id: 'pai_lembrado',
      texto: 'Você fez uma pós. {pergunta}',
      trechos: {
        pergunta: [
          { se: { 'pai.vivo': true }, texto: '{pai} perguntou se agora você é doutor.' },
          { se: { 'pai.vivo': false }, texto: 'Você lembrou de {pai}, que ia perguntar.' },
          { texto: 'Ninguém perguntou nada.' },
        ],
      },
    };
    expect(errosCom([trecho])).not.toMatch(/pai_lembrado/);
    // O trecho padrão não sabe: citar o pai nele também é fantasma.
    const padrao = { ...trecho, id: 'pai_no_padrao', trechos: { pergunta: [{ se: { 'pai.vivo': true }, texto: '{pai} perguntou.' }, { texto: '{pai} não perguntou.' }] } };
    expect(errosCom([padrao])).toMatch(/pai_no_padrao.*trechos\.pergunta\[1\].*usa \{pai\} sem saber/);
    // O botão aparece mesmo bloqueado: a condição da escolha não basta para o texto dele.
    const botao = errosCom([
      {
        id: 'botao_da_mae',
        idade: [20, 40],
        texto: 'Despejo.',
        resumo: 'foi despejado',
        escolhas: [
          { texto: 'Ir para a casa de {mae}', resumo: 'foi para a casa da mãe', condicoes: { 'mae.vivo': true }, resultado: { texto: '{mae} arrumou o quarto.', efeitos: { felicidade: 1 } } },
          escolha('Alugar um quarto', { felicidade: -1 }),
        ],
      },
    ]);
    expect(botao).toMatch(/botao_da_mae › escolha 1 › texto: usa \{mae\} sem saber/);
    expect(botao).not.toMatch(/botao_da_mae › escolha 1 › resultado/);
    // Linhas e causas de morte também.
    const reais = lerFontes();
    const linha = { idade: [20, 60], texto: 'Você e {amigo} falaram bobagem a tarde inteira.' };
    const { problemas } = validarConteudo({ ...reais, linhas: [...(reais.linhas as unknown[]), linha] });
    expect(problemas.some((p) => p.nivel === 'erro' && /usa \{amigo\} sem saber/.test(p.mensagem))).toBe(true);
  });
});

function escolha(texto: string, efeitos: Record<string, unknown>) {
  return { texto, resumo: texto.toLowerCase(), resultado: { texto: `${texto}.`, efeitos } };
}
