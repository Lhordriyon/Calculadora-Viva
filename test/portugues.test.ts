import { describe, expect, it } from 'vitest';
import { lerFontes } from '../scripts/disco.ts';
import { comGenero, conferirConcordancia, conferirGenero, conferirPreposicoes } from '../src/motor/portugues.ts';
import { validarConteudo } from '../src/motor/validacao.ts';

/** Os erros que um texto recebe de uma das regras (as mensagens). */
function erros(f: (erro: (onde: string, mensagem: string) => void) => void): string[] {
  const saida: string[] = [];
  f((_onde, mensagem) => saida.push(mensagem));
  return saida;
}

const genero = (texto: string, doJogador = false, atores?: string[]): string[] => erros((e) => conferirGenero(texto, 'x', e, doJogador, atores));

function errosCom(storylets: unknown[]): string {
  const reais = lerFontes();
  const { problemas } = validarConteudo({ ...reais, storylets: [...reais.storylets, { arquivo: 'x.json', dados: storylets }] });
  return problemas
    .filter((p) => p.nivel === 'erro')
    .map((p) => `${p.onde}: ${p.mensagem}`)
    .join('\n');
}

describe('português: concordância quebrada', () => {
  it('recusa a vogal fora da concordância ("inteiro{|a}" vira "inteiroa")', () => {
    expect(erros((e) => conferirConcordancia('Chegou inteiro{|a} em todas.', 'x', e))).toEqual([
      'concordância quebrada: "inteiro{|a}" vira "inteiroa" no feminino; use inteir{o|a} (ou {papel:...}, se a palavra for de um personagem)',
    ]);
    expect(erros((e) => conferirConcordancia('uma mensagem dele{|a}', 'x', e))[0]).toMatch(/delea/);
    expect(erros((e) => conferirConcordancia('quando ficar rico{ator:|a}', 'x', e))[0]).toMatch(/use ric\{ator:o\|a\}/);
  });

  it('aceita a concordância certa e o masculino que só ganha letra ("vereador{|a}")', () => {
    for (const ok of ['Chegou inteir{o|a}.', 'candidat{o|a} a vereador{|a}', 'professor{amor:|a}', 'É {o|a} menor da turma.']) {
      expect(erros((e) => conferirConcordancia(ok, 'x', e)), ok).toEqual([]);
    }
  });
});

describe('português: preposição antes de trecho com artigo', () => {
  const pauta = [{ se: { 'pais.inflacao': { min: 7 } }, texto: 'a inflação' }, { texto: 'a economia' }];

  it('recusa "de {pauta}" quando o trecho começa com artigo ("de a economia")', () => {
    const r = erros((e) => conferirPreposicoes('Na TV, só se fala de {pauta}.', { pauta }, 'x', e));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/"de \{pauta\}"/);
    expect(erros((e) => conferirPreposicoes('Votou por {pauta}.', { pauta: [{ texto: '[o emprego|a saúde]' }] }, 'x', e))).toHaveLength(1);
  });

  it('aceita trecho sem artigo, artigo indefinido e a frase sem preposição', () => {
    expect(erros((e) => conferirPreposicoes('Na TV, o assunto é {pauta}.', { pauta }, 'x', e))).toEqual([]);
    expect(erros((e) => conferirPreposicoes('Crise de {vespera}.', { vespera: [{ texto: 'uma prova importante' }] }, 'x', e))).toEqual([]);
  });
});

describe('português: palavra só no masculino sobre quem joga', () => {
  it('recusa "você ficou rico", a oração sem sujeito e o resumo', () => {
    expect(genero('A fada pagou duas moedas. Você ficou rico por um dia.')).toEqual(['"rico" só no masculino num texto sobre quem joga; use ric{o|a}']);
    expect(genero('Você não foi preso; também não foi esquecido.')).toHaveLength(1);
    expect(genero('Você nunca mais foi a pé à padaria. Está seguro; está sozinho.')).toHaveLength(1);
    expect(genero('foi convidado a entrar para a política', true)).toHaveLength(1);
    expect(genero('torrou dinheiro como herdeiro', true)).toEqual(['"herdeiro" só no masculino num texto sobre quem joga; use herdeir{o|a}']);
    expect(genero('Ficar sozinho com a vista', true)).toHaveLength(1);
    expect(genero('Você virou cidadão comum de um país que é seu.')[0]).toMatch(/cidad\{ão\|ã\}/);
    expect(genero('Uma [festa|operação] no gabinete onde você é assessor.')[0]).toMatch(/assessor\{\|a\}/);
  });

  it('recusa o personagem cujo gênero varia ("{amigo} ficou rico"), mas não o pai', () => {
    expect(genero('{amigo} ficou rico: acertou na cripto.')).toEqual(['"rico" só no masculino num texto sobre {amigo}; use ric{amigo:o|a}']);
    expect(genero('{ator} ficou rico.', false, ['mae', 'pai'])).toHaveLength(1);
    expect(genero('{pai} ficou rico.')).toEqual([]);
    expect(genero('{ator} ficou rico.', false, ['pai'])).toEqual([]);
  });

  it('aceita quando a palavra é de outra pessoa ou já tem a concordância', () => {
    for (const ok of [
      'O seu cliente da ilha foi preso numa operação da Polícia Federal.',
      'Um anúncio garante que dá para ficar rico apostando.',
      'Você descobriu que ninguém fica rico fazendo isso.',
      'O seu inquilino conserta as coisas sozinho.',
      'Você ficou ric{o|a} por um dia.',
      '{amigo} ficou ric{amigo:o|a}.',
    ]) {
      expect(genero(ok), ok).toEqual([]);
    }
    for (const ok of ['viu um cliente ser preso e o próprio nome na investigação', 'negou envolvimento com o cliente preso', 'Ir só para ver quem ficou rico', 'encarou o ditado do pai rico, filho nobre, neto pobre']) {
      expect(genero(ok, true), ok).toEqual([]);
    }
  });

  it('sugere o feminino de cada palavra da lista', () => {
    expect(['rico', 'assessor', 'cidadão'].map(comGenero)).toEqual(['ric{o|a}', 'assessor{|a}', 'cidad{ão|ã}']);
  });
});

describe('validador', () => {
  it('recusa um storylet com concordância quebrada, "de {trecho}" com artigo e "você ficou rico"', () => {
    const r = errosCom([
      {
        id: 'portugues_quebrado',
        idade: [30, 40],
        trechos: { pauta: [{ se: { 'pais.inflacao': { min: 7 } }, texto: 'a inflação' }, { texto: 'a economia' }] },
        texto: 'Na TV, só se fala de {pauta}. Você ficou rico por um dia.',
        resumo: 'foi convidado para a TV',
        escolhas: [{ texto: 'Assistir', resumo: 'assistiu', resultado: { texto: 'Voltou rouco{|a} e feliz.', efeitos: { felicidade: 1 } } }],
      },
    ]);
    expect(r).toMatch(/portugues_quebrado › texto: "de \{pauta\}"/);
    expect(r).toMatch(/portugues_quebrado › texto: "rico" só no masculino/);
    expect(r).toMatch(/portugues_quebrado › resumo: "convidado" só no masculino/);
    expect(r).toMatch(/concordância quebrada: "rouco\{\|a\}"/);
  });
});
