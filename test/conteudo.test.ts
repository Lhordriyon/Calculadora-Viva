import { describe, expect, it } from 'vitest';
import { lerFontes } from '../scripts/disco.ts';
import { listarCadeias, validarConteudo } from '../src/motor/validacao.ts';

describe('conteúdo real', () => {
  const { conteudo, problemas } = validarConteudo(lerFontes());

  it('não tem erros de validação', () => {
    expect(problemas.filter((p) => p.nivel === 'erro')).toEqual([]);
    expect(conteudo).not.toBeNull();
  });

  it('tem de 60 a 80 eventos cobrindo de 0 a 80+ anos', () => {
    const n = conteudo!.eventos.length;
    expect(n).toBeGreaterThanOrEqual(60);
    expect(n).toBeLessThanOrEqual(80);
    const idades = conteudo!.eventos.flatMap((ev) => ev.idade ?? []);
    expect(Math.min(...idades)).toBeLessThanOrEqual(1);
    expect(Math.max(...idades)).toBeGreaterThanOrEqual(80);
  });

  it('tem pelo menos 8 cadeias de consequência de 3+ anos', () => {
    const pares = new Set(listarCadeias(conteudo!).filter((x) => x.anosMin >= 3).map((x) => `${x.de}→${x.para}`));
    expect(pares.size).toBeGreaterThanOrEqual(8);
  });
});

describe('validador', () => {
  it('acusa marca consultada que ninguém cria, variável desconhecida e agendamento quebrado', () => {
    const reais = lerFontes();
    const eventos = [
      {
        id: 'quebrado',
        idade: [10, 20],
        condicoes: { marcas: ['marca_fantasma'] },
        texto: 'Oi {variavel_que_nao_existe}',
        resumo: 'quebrou',
        escolhas: [
          {
            texto: 'Ok',
            resumo: 'tudo ok',
            resultado: { texto: 'ok', efeitos: { agendar: [{ evento: 'nao_existe', em: 2 }] } },
          },
        ],
      },
      { id: 'quebrado', idade: [1, 2], texto: 'repetido', resumo: 'repetido', efeitos: {} },
    ];
    const { problemas } = validarConteudo({ ...reais, eventos: [{ arquivo: 'x.json', dados: eventos }] });
    const textos = problemas.filter((p) => p.nivel === 'erro').map((p) => p.mensagem).join('\n');
    expect(textos).toMatch(/id repetido/);
    const sem = validarConteudo({ ...reais, eventos: [{ arquivo: 'x.json', dados: [eventos[0]] }] });
    const erros = sem.problemas.filter((p) => p.nivel === 'erro').map((p) => p.mensagem).join('\n');
    expect(erros).toMatch(/marca_fantasma/);
    expect(erros).toMatch(/variavel_que_nao_existe/);
    expect(erros).toMatch(/nao_existe/);
  });

  it('exige que um personagem novo seja garantido por marca', () => {
    const reais = lerFontes();
    const eventos = [
      {
        id: 'cria',
        idade: [20, 30],
        texto: 'Alguém aparece.',
        resumo: 'conheceu alguém',
        escolhas: [{ texto: 'Ok', resumo: 'tudo ok', resultado: { texto: 'Oi, {amor}.', efeitos: { personagens: ['amor'], marcas: ['par'] } } }],
      },
      {
        id: 'usa_sem_exigir',
        idade: [30, 40],
        texto: '{amor} quer conversar.',
        resumo: 'conversou',
        escolhas: [{ texto: 'Ok', resumo: 'tudo ok', resultado: { texto: 'tudo ok', efeitos: {} } }],
      },
    ];
    const { problemas } = validarConteudo({ ...reais, eventos: [{ arquivo: 'x.json', dados: eventos }] });
    expect(problemas.some((p) => p.nivel === 'erro' && /usa \{amor\}/.test(p.mensagem))).toBe(true);
  });
});
