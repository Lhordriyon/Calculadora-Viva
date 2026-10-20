/**
 * A repetição que se vê: o desfecho que a vida já contou volta curto (o
 * `repete`), a eleição fala do placar e da história do bloco em vez de um
 * "51%" de sempre, e a compra, a vaga recusada e a eleição do cargo contam a
 * vez.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo, lerFontes } from '../scripts/disco.ts';
import { faixaDeIdade } from '../src/motor/carreira.ts';
import { operar } from '../src/motor/carteira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { contexto } from '../src/motor/contexto.ts';
import type { Resultado } from '../src/motor/esquema.ts';
import { lancar, novaEntrada } from '../src/motor/livro.ts';
import { anoDoPais, defGoverno, governoAtual, PLACAR_APERTADO } from '../src/motor/pais.ts';
import { defCargo, proximaEleicao } from '../src/motor/poder.ts';
import { misturar } from '../src/motor/rng.ts';
import { aplicarEscolha, textoDoDesfecho } from '../src/motor/storylets.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { validarConteudo } from '../src/motor/validacao.ts';
import { agir, nascer } from '../src/motor/vida.ts';
import { conteudoCom } from './apoio.ts';

const c = carregarConteudo();

function errosCom(storylets: unknown[]): string {
  const reais = lerFontes();
  const { problemas } = validarConteudo({ ...reais, storylets: [...reais.storylets, { arquivo: 'x.json', dados: storylets }] });
  return problemas
    .filter((p) => p.nivel === 'erro')
    .map((p) => `${p.onde}: ${p.mensagem}`)
    .join('\n');
}

/** Um adulto de 40 anos, com o país num ano comum e o governo dado. */
function adulto(semente: number, governo = 'centrao'): EstadoVida {
  const e = nascer(c, { semente, ano: 2026, origem: { classe: 3 } });
  e.idade = 40;
  e.ano = 2066;
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise']) delete pais.q[f];
  delete pais.q['regime'];
  pais.t['governo'] = governo;
  const def = defGoverno(c, governo);
  if (def) for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 8.5, divida: 75, pobreza: 25, violencia: 22, saude: 50, educacao: 50, aprovacao: 50, impulso: 0 });
  return e;
}

/** Uma posse antiga no livro, no ano dado. */
function posseEm(e: EstadoVida, governo: string, ano: number): void {
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `governo:${governo}`, ator: 'pais', texto: 'Posse.' });
  entrada.ano = ano;
  lancar(e, entrada, []);
}

describe('o desfecho que a vida já contou', () => {
  const r: Resultado = { texto: 'Deu certo: o cliente pagou, elogiou e indicou.', repete: 'Deu certo de novo.' };

  it('sai inteiro na primeira vez e curto quando o mesmo texto já está no livro', () => {
    const e = adulto(1);
    const ctx = contexto(e);
    expect(textoDoDesfecho(e, r, ctx)).toBe('Deu certo: o cliente pagou, elogiou e indicou.');
    const h = novaEntrada(e, { tipo: 'acao', causa: 'acao', ref: 'x', texto: 'Você trabalhou.' });
    h.resultado = 'Deu certo: o cliente pagou, elogiou e indicou.';
    lancar(e, h, []);
    expect(textoDoDesfecho(e, r, ctx)).toBe('Deu certo de novo.');
    // Sem repete, o texto inteiro continua (o conteúdo decide o que pode encolher).
    expect(textoDoDesfecho(e, { texto: r.texto }, ctx)).toBe(r.texto);
  });

  it('a ação com teste repetida no ano seguinte encolhe o texto e o desfecho', () => {
    const acao = {
      id: 'tentar_sempre',
      tipo: 'acao',
      verbo: 'trabalhar',
      rotulo: 'tentar de novo',
      idade: [18, 90],
      texto: 'Você tentou com tudo.',
      resumo: 'tentou com tudo',
      efeitos: { dinheiro: 100, felicidade: 0.1 },
      // Os dois desfechos contam o mesmo: o teste sorteia, mas o texto não depende dele.
      teste: { chance: 0.5 },
      sucesso: { texto: 'Deu no que deu: o plano andou inteiro.', repete: 'Deu no que deu, de novo.' },
      fracasso: { texto: 'Deu no que deu: o plano andou inteiro.', repete: 'Deu no que deu, de novo.' },
    };
    const c2 = conteudoCom([acao]);
    const e = nascer(c2, { semente: 5, ano: 2026 });
    e.idade = 30;
    e.ano = 2056;
    const primeira = agir(e, c2, 'trabalhar', { id: 'tentar_sempre' });
    expect(primeira.resultado).toBe('Deu no que deu: o plano andou inteiro.');
    e.idade++;
    e.ano++;
    const segunda = agir(e, c2, 'trabalhar', { id: 'tentar_sempre' });
    expect(segunda.texto).toBe('Tentou com tudo, mais um ano.');
    expect(segunda.resultado).toBe('Deu no que deu, de novo.');
  });

  it('o voto no mesmo bloco de antes sai curto, sem o tio do churrasco de novo', () => {
    const s = c.porId.get('eleicao_geral')!;
    const e = adulto(2);
    const base = { tipo: 'evento' as const, ref: s.id, instancia: s.id, texto: 'Eleição.', opcao: 'A frente popular: comida e posto' };
    const antes = aplicarEscolha(e, c, s, 0, base);
    expect(antes.resultado).toMatch(/tio do churrasco já sabe/);
    e.idade += 4;
    e.ano += 4;
    const depois = aplicarEscolha(e, c, s, 0, base);
    expect(depois.resultado).not.toBe(antes.resultado);
    expect(depois.resultado).toMatch(/frente popular/i);
    expect(depois.resultado).not.toMatch(/tio do churrasco já sabe/);
  });
});

describe('o anúncio da eleição', () => {
  /** Posse em 2067 (ano de posse), com a aprovação dada para quem governa. */
  function posse(semente: number, governo: string, aprovacao: number, antes: [string, number][] = []): { e: EstadoVida; texto: string } {
    const e = adulto(semente, governo);
    for (const [g, ano] of antes) posseEm(e, g, ano);
    e.ano = 2067;
    e.entidades['pais']!.n['aprovacao'] = aprovacao;
    anoDoPais(e, c, []);
    const h = e.historico.filter((x) => x.ref?.startsWith('governo:')).at(-1)!;
    return { e, texto: h.texto };
  }

  it('sem maiúscula depois dos dois-pontos, e o placar em palavras quando foi apertado', () => {
    const percentuais = new Map<string, number>();
    const apertado = new RegExp(PLACAR_APERTADO.join('|'));
    let emPalavras = 0;
    for (let i = 0; i < 200; i++) {
      const { texto } = posse(misturar(41, i), 'centrao', 20 + (i % 60));
      expect(texto).toMatch(/^Eleições gerais: [a-zà-ú]/);
      expect(texto).not.toMatch(/: [AO] /);
      if (apertado.test(texto)) {
        expect(texto).not.toMatch(/%/);
        emPalavras++;
      }
      const pct = texto.match(/(\d+)% dos votos/)?.[1];
      if (pct) percentuais.set(pct, (percentuais.get(pct) ?? 0) + 1);
    }
    expect(emPalavras).toBeGreaterThan(0);
    // Nenhum número em mais de 15% das eleições (era 51% em 70% delas).
    for (const n of percentuais.values()) expect(n).toBeLessThanOrEqual(30);
  });

  it('a eleição apertada seguinte troca a palavra do placar', () => {
    const palavras = new Set<string>();
    for (let ano = 2067; ano < 2067 + 4 * PLACAR_APERTADO.length; ano += 4) {
      for (let i = 0; i < 40; i++) {
        const e = adulto(misturar(44, i), 'centrao');
        e.ano = ano;
        e.entidades['pais']!.n['aprovacao'] = 50;
        anoDoPais(e, c, []);
        const texto = e.historico.filter((x) => x.ref?.startsWith('governo:')).at(-1)!.texto;
        const achou = PLACAR_APERTADO.find((p) => texto.includes(p));
        if (achou) {
          palavras.add(achou);
          break;
        }
      }
    }
    expect([...palavras].sort()).toEqual([...PLACAR_APERTADO].sort());
  });

  it('quem continua conta as eleições seguidas; quem volta diz há quanto tempo estava fora', () => {
    let seguida = false;
    let volta = false;
    for (let i = 0; i < 300 && !(seguida && volta); i++) {
      const fica = posse(misturar(42, i), 'centrao', 95, [['centrao', 2059], ['centrao', 2063]]);
      if (governoAtual(fica.e) === 'centrao') {
        expect(fica.texto).toMatch(/o centrão ganha a terceira eleição seguida/);
        seguida = true;
      }
      const sai = posse(misturar(43, i), 'centrao', 5, [['frente_popular', 2055], ['centrao', 2059], ['centrao', 2063]]);
      if (governoAtual(sai.e) === 'frente_popular') {
        expect(sai.texto).toMatch(/a frente popular volta ao governo depois de 8 anos fora/);
        volta = true;
      }
    }
    expect(seguida && volta).toBe(true);
  });
});

describe('a vez de novo: compra, vaga e eleição', () => {
  it('a segunda sala comercial conta quantas são, sem repetir a descrição', () => {
    const e = adulto(3);
    e.entidades['eu']!.n['dinheiro'] = 2_000_000;
    const primeira = operar(e, c, { tipo: 'comprar', item: 'sala_comercial' });
    expect(primeira.texto).toMatch(/dentista/);
    const segunda = operar(e, c, { tipo: 'comprar', item: 'sala_comercial' });
    expect(segunda.texto).toMatch(/^Comprou mais uma sala comercial .*; agora são 2\.$/);
  });

  it('a vaga recusada de novo conta a tentativa', () => {
    const e = adulto(4);
    // A profissão mais difícil das que não pedem nada, sem talento nenhum: a chance fica no piso (2%).
    const def = c.mundo.carreiras
      .filter((d) => !d.requisitos && faixaDeIdade(d)[0] <= 40 && faixaDeIdade(d)[1] >= 44)
      .reduce((a, b) => (b.chance < a.chance ? b : a));
    let recusas = 0;
    for (let i = 0; i < 4; i++) {
      e.entidades['eu']!.n[def.talento] = 0;
      const { texto } = operar(e, c, { tipo: 'candidatar', carreira: def.id });
      e.ano++;
      e.idade++;
      if (!/não (passou|foi desta vez)/.test(texto)) break;
      recusas++;
      expect(texto).toMatch(recusas === 1 ? /^Tentou uma vaga de .* Ano que vem tem outra seleção\.$/ : recusas === 2 ? /^Tentou de novo uma vaga de / : new RegExp(`^Tentou pela ${recusas}ª vez uma vaga de `));
    }
    expect(recusas).toBeGreaterThanOrEqual(3);
  });

  it('a derrota e o mandato repetidos contam a vez', () => {
    const e = adulto(6);
    const eu = e.entidades['eu']!;
    const vereador = defCargo(c, 'vereador')!;
    const tentar = (forca: number): string => {
      const ano = proximaEleicao(e.ano, vereador);
      e.idade += ano - e.ano;
      e.ano = ano;
      // A influência mínima para disputar; a imagem e a aparência decidem a chance (3% ou 95%).
      Object.assign(eu.n, { dinheiro: 1_000_000, influencia: Math.max(vereador.influencia, forca), popularidade: forca, aparencia: forca });
      const { texto } = operar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' });
      e.ano++;
      e.idade++;
      return texto;
    };
    let derrotas = 0;
    for (let i = 0; i < 3; i++) {
      const texto = tentar(0);
      if (!/não bastaram/.test(texto)) continue;
      derrotas++;
      if (derrotas === 1) expect(texto).not.toMatch(/derrota/);
      else expect(texto).toMatch(new RegExp(`Foi a ${derrotas}ª derrota`));
    }
    expect(derrotas).toBeGreaterThanOrEqual(2);
    let mandatos = 0;
    for (let i = 0; i < 3; i++) {
      const texto = tentar(100);
      if (!/você foi (re)?eleit/.test(texto)) continue;
      mandatos++;
      if (mandatos === 1) expect(texto).not.toMatch(/mandato/);
      else expect(texto).toMatch(new RegExp(`reeleit[oa] .* para o ${mandatos}º mandato`));
    }
    expect(mandatos).toBeGreaterThanOrEqual(2);
  });
});

describe('validador', () => {
  const acao = (sucesso: Record<string, unknown>, fracasso: Record<string, unknown>) => ({
    id: 'acao_que_repete',
    tipo: 'acao',
    verbo: 'trabalhar',
    rotulo: 'tentar a sorte',
    idade: [20, 60],
    texto: 'Você tentou a sorte.',
    resumo: 'tentou a sorte',
    efeitos: { felicidade: 0.1, saude: -0.1 },
    teste: { chance: 0.5 },
    sucesso,
    fracasso,
  });

  it('recusa ação com teste sem "repete" nos desfechos', () => {
    const erros = errosCom([acao({ texto: 'Deu certo, e muito.' }, { texto: 'Não deu, e doeu bastante.', repete: 'Não deu de novo.' })]);
    expect(erros).toMatch(/acao_que_repete › sucesso: .*repete/);
    expect(erros).not.toMatch(/acao_que_repete › fracasso/);
  });

  it('recusa "repete" que não é mais curto que o texto, e confere as variáveis dele', () => {
    const erros = errosCom([acao({ texto: 'Deu certo.', repete: 'Deu certo de novo, e de novo, e de novo.' }, { texto: 'Não deu, e doeu bastante.', repete: 'De novo {variavel_que_nao_existe}.' })]);
    expect(erros).toMatch(/acao_que_repete › sucesso: .*mais curto/);
    expect(erros).toMatch(/variavel_que_nao_existe/);
  });

  it('mede o "repete" com os trechos abertos', () => {
    const comTrecho = (longo: string) => ({
      ...acao({ texto: 'Deu certo, e o cliente gostou.', repete: '{de_novo}' }, { texto: 'Não deu, e doeu bastante.', repete: 'Não deu de novo.' }),
      trechos: { de_novo: [{ se: { idade: { max: 30 } }, texto: 'De novo.' }, { texto: longo }] },
    });
    expect(errosCom([comTrecho('Deu certo de novo, e o cliente gostou outra vez, como sempre.')])).toMatch(/acao_que_repete › sucesso: .*mais curto/);
    expect(errosCom([comTrecho('Deu certo de novo.')])).not.toMatch(/acao_que_repete/);
  });
});
