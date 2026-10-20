/**
 * O grupo de empresas (incremento 9): até cinco empresas de uma vez, a que
 * quem joga toca de perto, subsidiárias (compradas ou absorvidas), fusão,
 * bolsa, a mesa de quem manda, a quebra que vem para a mesa, a herança do
 * grupo e o livro que fecha com as empresas trocando de lugar.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio } from '../src/jogo/salvar.ts';
import { empresasDe, ler, parteNaEmpresa, parteNasEmpresas, patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { aplicarEfeitos } from '../src/motor/efeitos.ts';
import {
  aEmpresa,
  alvoDaTracao,
  cargaDaMesa,
  descontoDaDependencia,
  empresaDe,
  generoDoNome,
  lugarLivre,
  PRINCIPAL,
  regraDaEmpresa,
  vendaDaParte,
  vendaDeSubsidiarias,
  vendaNaEstreia,
} from '../src/motor/empresa.ts';
import type { Efeitos } from '../src/motor/esquema.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { momentoDoPais, momentoTipico } from '../src/motor/pais.ts';
import { influenciaAlvo } from '../src/motor/poder.ts';
import {
  FRACAO_NA_ESTREIA,
  GOVERNANCA_DA_BOLSA,
  MAX_EMPRESAS,
  PESO_DA_BOLSA,
  PREMIO_DA_BOLSA,
  SUBSIDIARIAS_DO_CONGLOMERADO,
  fracaoDeUmaSubsidiaria,
  precoDeVenda,
  subsidiariasDoRival,
  subsidiariasPorVenda,
} from '../src/motor/regras.ts';
import { contexto } from '../src/motor/contexto.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import { aplicarEscolha } from '../src/motor/storylets.ts';
import { renderizar } from '../src/motor/texto.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { avancarAno, morrer, nascer } from '../src/motor/vida.ts';
import { passo } from './apoio.ts';

const c = carregarConteudo();

/** Um adulto de 30 anos, no país normal, com dinheiro na conta e investido. */
function adulto(semente: number, n: Record<string, number> = {}): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 30;
  e.ano += 30;
  for (const f of ['expansao', 'recessao', 'crise']) delete e.entidades['pais']!.q[f];
  Object.assign(e.entidades['eu']!.n, { dinheiro: 60000, renda_fixa: 40000, divida: 0, renda: 50000, custo: 20000, inteligencia: 50 }, n);
  return e;
}

function abrir(e: EstadoVida, setor: string, valor: number): string {
  const lugar = lugarLivre(e)!;
  operar(e, c, { tipo: 'abrir', setor, valor });
  return lugar;
}

interface Foto {
  campos: Map<string, Record<string, number>>;
  /** As entradas até aqui já estão na foto. */
  desde: number;
}

/** O estado de cada campo num momento: o livro tem de levar dele ao fim. */
function foto(e: EstadoVida): Foto {
  return { campos: new Map(Object.values(e.entidades).map((en) => [en.id, { ...en.n }])), desde: e.historico.length };
}

function livroFecha(e: EstadoVida, inicio: Foto): void {
  const soma = new Map<string, number>();
  for (const h of e.historico.slice(inicio.desde)) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
  for (const en of Object.values(e.entidades)) {
    for (const [campo, fim] of Object.entries(en.n)) {
      const esperado = (inicio.campos.get(en.id)?.[campo] ?? 0) + (soma.get(`${en.id}.${campo}`) ?? 0);
      expect(Math.abs(esperado - fim), `${en.id}.${campo}`).toBeLessThan(Math.max(2, Math.abs(fim) * 1e-9));
    }
  }
}

describe('várias empresas', () => {
  it('abre até cinco, cada uma no seu lugar e com nome próprio; a sexta espera', () => {
    const e = adulto(1, { dinheiro: 1_000_000 });
    for (let i = 0; i < MAX_EMPRESAS; i++) abrir(e, i % 2 ? 'tecnologia' : 'comercio', 10000 + 1000 * i);
    expect(empresasDe(e).map((x) => x.id)).toEqual(['empresa', 'empresa2', 'empresa3', 'empresa4', 'empresa5']);
    expect(new Set(empresasDe(e).map((x) => x.nome)).size).toBe(MAX_EMPRESAS);
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrir', setor: 'comercio', valor: 10000 })).toMatch(/5 empresas/);
    expect(ler(e, 'eu', 'empresas')).toBe(MAX_EMPRESAS);
    expect(parteNasEmpresas(e)).toBeCloseTo(60000);
    // O dinheiro só trocou de lugar.
    expect(patrimonioTotal(e)).toBeCloseTo(1_040_000);
    expect(e.historico.at(-1)!.texto).toMatch(/quinta empresa/);
  });

  it('cuidar de outra troca as duas de lugar: o conteúdo e o “Trabalhar” passam a falar dela', () => {
    const e = adulto(2, { dinheiro: 1_000_000 });
    const inicio = foto(e);
    abrir(e, 'comercio', 100000);
    abrir(e, 'tecnologia', 200000);
    const [a, b] = empresasDe(e).map((x) => x.nome);
    expect(motivoParaNaoOperar(e, c, { tipo: 'cuidar', empresa: PRINCIPAL })).toMatch(/já cuida/);
    operar(e, c, { tipo: 'cuidar', empresa: 'empresa2' });
    expect(empresaDe(e)!.nome).toBe(b);
    expect(empresaDe(e, 'empresa2')!.nome).toBe(a);
    expect(empresaDe(e)!.t['setor']).toBe('tecnologia');
    expect(ler(e, 'empresa', 'valor')).toBeCloseTo(200000);
    livroFecha(e, inicio);
  });

  it('o evento que vende a que toca ainda fala dela; depois, a outra toma o lugar', () => {
    const e = adulto(18, { dinheiro: 1_000_000 });
    abrir(e, 'comercio', 300000);
    abrir(e, 'tecnologia', 100000);
    const [vendida, outra] = empresasDe(e).map((x) => x.nome);
    const s = c.porId.get('concorrente_gigante')!;
    const i = s.escolhas!.findIndex((x) => x.resultado?.efeitos?.venderEmpresa);
    const entrada = aplicarEscolha(e, c, s, i, { tipo: 'evento', ref: s.id, instancia: s.id, texto: '', opcao: s.escolhas![i]!.texto });
    expect(entrada.resultado).toContain(vendida);
    expect(empresaDe(e)!.nome).toBe(outra);
    expect(empresasDe(e)).toHaveLength(1);
  });

  it('vender a que toca põe a maior das outras no lugar dela; o lugar vago recebe a próxima', () => {
    const e = adulto(3, { dinheiro: 1_000_000 });
    abrir(e, 'comercio', 100000);
    abrir(e, 'tecnologia', 300000);
    abrir(e, 'saude', 200000);
    const [, b, cc] = empresasDe(e).map((x) => x.nome);
    operar(e, c, { tipo: 'vender', empresa: PRINCIPAL });
    expect(empresaDe(e)!.nome).toBe(b);
    expect(e.entidades['empresa2']).toBeUndefined();
    expect(empresaDe(e, 'empresa3')!.nome).toBe(cc);
    expect(e.historico.at(-1)!.texto).toContain(`Agora você cuida de perto da ${b}`);
    expect(abrir(e, 'comercio', 10000)).toBe('empresa2');
  });
});

describe('subsidiárias', () => {
  it('a concorrente comprada vira subsidiária, com as subsidiárias dela', () => {
    const e = adulto(4, { dinheiro: 2e9 });
    abrir(e, 'tecnologia', 1e9);
    operar(e, c, { tipo: 'adquirir' });
    const emp = empresaDe(e)!;
    expect(subsidiariasDoRival(3e8)).toBe(8);
    expect(emp.n['subsidiarias']).toBe(1 + 8);
    expect(e.historico.at(-1)!.texto).toMatch(/as 8 subsidiárias dela/);
  });

  it('vender subsidiárias dá dinheiro sem largar a empresa: sai a fatia delas, pelo preço da fase', () => {
    const e = adulto(5, { dinheiro: 2e9 });
    abrir(e, 'tecnologia', 1e9);
    operar(e, c, { tipo: 'adquirir' });
    const emp = empresaDe(e)!;
    const eu = e.entidades['eu']!;
    const valor = emp.n['valor']!;
    const conta = eu.n['dinheiro']!;
    const previsto = vendaDeSubsidiarias(e);
    expect(previsto.vendidas).toBe(1);
    expect(previsto.preco).toBeCloseTo(valor * fracaoDeUmaSubsidiaria(9) * precoDeVenda(momentoDoPais(e).empresa));
    operar(e, c, { tipo: 'venderSubsidiaria' });
    expect(emp.n['subsidiarias']).toBe(8);
    expect(emp.n['valor']).toBeCloseTo(valor * (1 - fracaoDeUmaSubsidiaria(9)));
    expect(eu.n['dinheiro']! - conta).toBeCloseTo(previsto.preco);
    // Com muitas, sai um décimo de cada vez; sem nenhuma, não há o que vender.
    expect(subsidiariasPorVenda(250)).toBe(25);
    emp.n['subsidiarias'] = 0;
    expect(motivoParaNaoOperar(e, c, { tipo: 'venderSubsidiaria' })).toMatch(/não tem subsidiárias/);
  });

  it('o conglomerado abre portas: com muitas subsidiárias, a influência que o grupo persegue sobe', () => {
    const e = adulto(6, { dinheiro: 2e9 });
    abrir(e, 'tecnologia', 1e9);
    const antes = influenciaAlvo(e, c);
    empresaDe(e)!.n['subsidiarias'] = SUBSIDIARIAS_DO_CONGLOMERADO;
    expect(influenciaAlvo(e, c) - antes).toBeCloseTo(3);
  });
});

describe('fusão', () => {
  it('no mesmo ramo: os valores se somam com a sinergia, a parte e a dependência viram a média, e a absorvida vira subsidiária', () => {
    const e = adulto(7, { dinheiro: 3e7 });
    abrir(e, 'tecnologia', 1e7);
    abrir(e, 'tecnologia', 5e6);
    const b = empresaDe(e, 'empresa2')!;
    b.n['participacao'] = 0.5;
    b.n['dependencia'] = 20;
    const nomeA = empresaDe(e)!.nome;
    operar(e, c, { tipo: 'fundir', empresa: PRINCIPAL, com: 'empresa2' });
    const emp = empresaDe(e)!;
    expect(empresasDe(e)).toHaveLength(1);
    expect(emp.nome).toBe(nomeA);
    expect(emp.n['subsidiarias']).toBe(1);
    expect(emp.n['participacao']).toBeCloseTo((1 * 1e7 + 0.5 * 5e6) / 1.5e7);
    expect(emp.n['dependencia']).toBeCloseTo((80 * 1e7 + 20 * 5e6) / 1.5e7);
    expect(Math.abs(emp.n['valor']! / 1.5e7 - 1)).toBeLessThan(0.4);
    expect(emp.q['fundiu']).toBeTruthy();
    expect(emp.q['aquisicoes']?.v).toBe(1);
    expect(e.historico.at(-1)!.texto).toMatch(/absorveu/);
  });

  it('em ramos diferentes, vira o grupo da família; se a absorvida era a que quem joga toca, a que fica toma o lugar, com o sustento', () => {
    const e = adulto(8, { dinheiro: 1e7 });
    abrir(e, 'comercio', 1e6);
    abrir(e, 'saude', 4e6);
    const reg: Mudanca[] = [];
    aplicarEfeitos(e, c, { marcas: ['empresa.sustenta'] } as Efeitos, { origem: 0, reg, valores: {} });
    const inicio = foto(e);
    operar(e, c, { tipo: 'fundir', empresa: 'empresa2', com: PRINCIPAL });
    const grupo = empresasDe(e);
    expect(grupo.map((x) => x.id)).toEqual([PRINCIPAL]);
    expect(grupo[0]!.t['setor']).toBe('saude');
    expect(grupo[0]!.nome).toBe(`Grupo ${e.sobrenome.split(' ').at(-1)}`);
    expect(grupo[0]!.q['sustenta']).toBeTruthy();
    expect(e.entidades['eu']!.n['renda']).toBe(50000);
    expect(e.historico.at(-1)!.texto).toMatch(/viraram o Grupo/);
    livroFecha(e, inicio);
  });
});

describe('bolsa', () => {
  it('abrir o capital: vale mais, vende um pedaço da parte na estreia, depende menos de quem manda e quem compra não desconta', () => {
    const e = adulto(9, { dinheiro: 3e8 });
    abrir(e, 'tecnologia', 2e8);
    const conta = e.entidades['eu']!.n['dinheiro']!;
    const previsto = vendaNaEstreia(e);
    expect(descontoDaDependencia(e)).toBeGreaterThan(0);
    operar(e, c, { tipo: 'abrirCapital' });
    const emp = empresaDe(e)!;
    expect(emp.q['na_bolsa']).toBeTruthy();
    expect(emp.n['valor']).toBeCloseTo(2e8 * (1 + PREMIO_DA_BOLSA));
    expect(emp.n['participacao']).toBeCloseTo(1 - FRACAO_NA_ESTREIA);
    expect(emp.n['dependencia']).toBeCloseTo(80 - GOVERNANCA_DA_BOLSA);
    expect(e.entidades['eu']!.n['dinheiro']! - conta).toBeCloseTo(previsto);
    expect(vendaDaParte(e).desconto).toBe(0);
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrirCapital' })).toMatch(/já está/);
  });

  it('pequena ou na recessão, não dá', () => {
    const e = adulto(10, { dinheiro: 3e8 });
    abrir(e, 'tecnologia', 5e7);
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrirCapital' })).toMatch(/precisa valer/);
    empresaDe(e)!.n['valor'] = 2e8;
    e.entidades['pais']!.q['recessao'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    expect(motivoParaNaoOperar(e, c, { tipo: 'abrirCapital' })).toMatch(/recessão/);
  });

  it('na bolsa, o valor anda também com o humor do mercado no ano', () => {
    const e = adulto(11, { dinheiro: 3e8 });
    abrir(e, 'tecnologia', 2e8);
    operar(e, c, { tipo: 'abrirCapital' });
    const esperado = c.mundo.ativos.find((a) => a.id === 'acoes')!.retorno.normal;
    const ano = (humor: number): number => {
      const copia = structuredClone(e);
      regraDaEmpresa(copia, c, momentoTipico('normal'), [], { acoes: esperado + humor });
      return copia.entidades['empresa']!.n['valor']!;
    };
    const valor = empresaDe(e)!.n['valor']!;
    // Mesma sorte nos dois mundos: a diferença é só o humor da bolsa.
    expect((ano(0.2) - ano(-0.2)) / valor).toBeCloseTo(PESO_DA_BOLSA * 0.4, 2);
  });
});

describe('a mesa de quem manda', () => {
  it('com várias empresas dependendo de quem manda, o talento dele se divide entre elas; delegar libera a mesa', () => {
    const e = adulto(12, { dinheiro: 1e6, inteligencia: 90 });
    abrir(e, 'tecnologia', 200000);
    const emp = empresaDe(e)!;
    const sozinha = alvoDaTracao(e, c, emp);
    abrir(e, 'comercio', 200000);
    expect(cargaDaMesa(e)).toBeCloseTo(1.6);
    expect(alvoDaTracao(e, c, emp)).toBeLessThan(sozinha - 1);
    empresaDe(e, 'empresa2')!.n['dependencia'] = 10;
    expect(alvoDaTracao(e, c, emp)).toBeCloseTo(sozinha);
    // Quem tem talento mediano não perde nada dividindo a mesa.
    e.entidades['eu']!.n['inteligencia'] = 50;
    empresaDe(e, 'empresa2')!.n['dependencia'] = 80;
    expect(alvoDaTracao(e, c, emp)).toBeCloseTo(alvoDaTracao(e, c, emp, 0.8));
  });

  it('a outra que afunda vem para a mesa de quem joga: a quebra é dela, com a fundação dela como causa', () => {
    const e = adulto(13, { dinheiro: 1e6 });
    abrir(e, 'comercio', 100000);
    abrir(e, 'tecnologia', 100000);
    const afundando = empresaDe(e, 'empresa2')!;
    const nome = afundando.nome;
    const fundacao = afundando.q['fundada']!.causa;
    afundando.n['valor'] = 100;
    regraDaEmpresa(e, c, momentoTipico('normal'), []);
    expect(empresaDe(e)!.nome).toBe(nome);
    const quebra = e.agenda.find((a) => a.evento === 'empresa_quebrou');
    expect(quebra?.origem).toBe(fundacao);
    expect(motivoParaNaoOperar(e, c, { tipo: 'cuidar', empresa: 'empresa2' })).toMatch(/osso/);
  });
});

describe('o nome da empresa', () => {
  it('o artigo segue o nome: o Instituto, a Clínica, a empresa com o sobrenome na frente, o Grupo; e o conteúdo concorda', () => {
    const e = adulto(17, { dinheiro: 1e6 });
    const sobrenome = e.sobrenome.split(' ').at(-1)!;
    expect(generoDoNome(e, `Instituto ${sobrenome}`)).toBe('m');
    expect(generoDoNome(e, `Banco ${sobrenome}`)).toBe('m');
    expect(generoDoNome(e, `Clínica ${sobrenome}`)).toBe('f');
    expect(generoDoNome(e, `${sobrenome} Tech`)).toBe('f');
    expect(aEmpresa({ nome: 'Grupo X', genero: 'm' }, 'da')).toBe('do Grupo X');
    expect(aEmpresa({ nome: 'Clínica X', genero: 'f' }, 'A')).toBe('A Clínica X');
    abrir(e, 'saude', 100000);
    const emp = empresaDe(e)!;
    emp.nome = `Instituto ${sobrenome}`;
    emp.genero = 'm';
    expect(renderizar('{empresa:O|A} {empresa} cresceu, e d{empresa:o|a} {empresa} ninguém duvida.', contexto(e))).toBe(
      `O Instituto ${sobrenome} cresceu, e do Instituto ${sobrenome} ninguém duvida.`,
    );
  });
});

describe('save de antes do grupo', () => {
  it('a empresa ganha o gênero do nome; sem ele, é "a" empresa', () => {
    const e = adulto(19, { dinheiro: 1e6 });
    abrir(e, 'saude', 100000);
    const emp = empresaDe(e)!;
    emp.nome = `Instituto ${e.sobrenome.split(' ').at(-1)}`;
    delete emp.genero;
    expect(renderizar('{empresa:O|A} {empresa}', contexto(e))).toBe(`A ${emp.nome}`);
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    expect(lido.entidades['empresa']!.genero).toBe('m');
  });
});

describe('o grupo na vida', () => {
  it('o grupo passa inteiro para o herdeiro, a primeira como a que ele toca', () => {
    const e = adulto(14, { dinheiro: 5e6 });
    abrir(e, 'comercio', 1e6);
    abrir(e, 'saude', 2e6);
    const nomes = empresasDe(e).map((x) => x.nome);
    aplicarEfeitos(e, c, { personagens: ['filho'] } as Efeitos, { origem: 0, reg: [], valores: {} });
    e.entidades['filho']!.nascimento = e.ano - 25;
    morrer(e, c);
    const h = continuarComoHerdeiro(e, c);
    expect(empresasDe(h).map((x) => x.nome)).toEqual(nomes);
    expect(empresasDe(h).map((x) => x.id)).toEqual(['empresa', 'empresa2']);
    expect(h.historico[0]!.texto).toMatch(/2 empresas/);
    expect(parteNaEmpresa(h, 'empresa2')).toBeGreaterThan(0);
  });

  it('o livro fecha e a vida é a mesma salvando no meio, com o grupo mudando de forma', () => {
    const robo = criarRng(91);
    const e = adulto(15, { dinheiro: 5e8 });
    const inicio = foto(e);
    const ops: Operacao[] = [
      { tipo: 'abrir', setor: 'tecnologia', valor: 2e8 },
      { tipo: 'abrir', setor: 'comercio', valor: 5e7 },
      { tipo: 'abrir', setor: 'tecnologia', valor: 3e7 },
      { tipo: 'adquirir' },
      { tipo: 'cuidar', empresa: 'empresa2' },
      { tipo: 'fundir', empresa: 'empresa2', com: 'empresa3' },
      { tipo: 'abrirCapital', empresa: 'empresa2' },
      { tipo: 'venderSubsidiaria', empresa: 'empresa2' },
    ];
    for (const op of ops) {
      expect(motivoParaNaoOperar(e, c, op), op.tipo).toBeNull();
      operar(e, c, op);
    }
    for (let i = 0; i < 25 && e.vivo; i++) passo(e, c, robo, 'arriscada');
    livroFecha(e, inicio);
    if (!e.vivo || e.pendente) return;
    const lido = lerSave(escreverSave({ ...saveVazio(), vida: e }), c).vida!;
    expect(lido.entidades).toEqual(e.entidades);
    avancarAno(e, c);
    avancarAno(lido, c);
    expect(lido.entidades).toEqual(e.entidades);
  });

  it('nas vidas do túnel, os robôs montam grupos: abrem outras, fundem e vão para a bolsa', () => {
    let grupos = 0;
    let fusoes = 0;
    let bolsas = 0;
    // Fundir ou abrir o capital acontece em umas 8% dessas vidas: a amostra segue até achar, para não depender de
    // uma semente de sorte (as alternâncias do texto também gastam o rng e mudam as vidas).
    for (let i = 0; i < 96 && (grupos < 2 || fusoes + bolsas < 1); i++) {
      const e = nascer(c, { semente: misturar(909, i), ano: 2026, origem: { classe: 5 } });
      const robo = criarRng(i);
      let maior = 0;
      while (e.vivo) {
        passo(e, c, robo, i % 2 ? 'arriscada' : 'aleatoria');
        maior = Math.max(maior, empresasDe(e).length);
      }
      if (maior >= 2) grupos++;
      if (e.historico.some((h) => h.ref === 'empresa:fundir')) fusoes++;
      if (e.historico.some((h) => h.ref === 'empresa:abrirCapital')) bolsas++;
    }
    // Uma amostra pequena só confere que os robôs usam o grupo; a medida de verdade é o portão do túnel (docs/metricas.md).
    expect(grupos).toBeGreaterThanOrEqual(2);
    expect(fusoes + bolsas).toBeGreaterThanOrEqual(1);
  });
});
