/**
 * O mundo à vista (I-170 a I-172): o lugar de quem joga no país, para todo jogador, e os marcos do grupo, contados
 * na linha do tempo com o porquê.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { patrimonioTotal } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar, type Operacao } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { regraDaEmpresa } from '../src/motor/empresa.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { momentoTipico } from '../src/motor/pais.ts';
import { lancar, novaEntrada, somar } from '../src/motor/livro.ts';
import { anoDoLugar, ESTRATOS, lugarNoPais, marcosDoGrupo, percentilDaRiqueza } from '../src/motor/lugar.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import { grupoNoMundo } from '../src/motor/mundo-das-empresas.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Uma pessoa de 40 anos sem família por perto, com o dinheiro dado (o que entra sai do mercado: o mundo soma zero). */
function adulto(semente: number, dinheiro: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2026 });
  e.idade = 40;
  e.ano += 40;
  e.agenda = [];
  for (const p of ['mae', 'pai']) {
    const x = e.entidades[p];
    if (!x) continue;
    x.vivo = false;
    x.morte = e.ano - 1;
  }
  const antes = dinheiroDoMundo(e);
  Object.assign(e.entidades['eu']!.n, { dinheiro, renda_fixa: 0, acoes: 0, fii: 0, dolar: 0, cripto: 0, divida: 0 });
  e.entidades['mercado']!.n['dinheiro']! -= dinheiroDoMundo(e) - antes;
  e.entidades['eu']!.n['estrato'] = lugarNoPais(e, c).estrato;
  e.entidades['eu']!.n['estrato_max'] = e.entidades['eu']!.n['estrato'];
  return e;
}

/** Uma decisão de quem joga no ano passado que trouxe (ou levou) dinheiro de fora. */
function decisao(e: EstadoVida, valor: number, resumo: string): number {
  e.ano--;
  e.idade--;
  const entrada = novaEntrada(e, { tipo: 'dinheiro', causa: 'escolha', ref: 'carteira:teste', texto: resumo, resumo });
  const reg: Mudanca[] = [];
  somar(e, reg, 'eu', 'dinheiro', valor, 'teste', 'mercado');
  lancar(e, entrada, reg);
  e.ano++;
  e.idade++;
  return entrada.id;
}

function oAno(e: EstadoVida): Mudanca[] {
  const reg: Mudanca[] = [];
  anoDoLugar(e, c, reg);
  if (reg.length > 0) lancar(e, novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' }), reg);
  return reg;
}

const linhas = (e: EstadoVida, prefixo: string) => e.historico.filter((h) => h.ref?.startsWith(prefixo));

describe('a régua do país (I-170)', () => {
  it('é a do Brasil real: a mediana perto de R$ 35 mil, o 1% a partir de R$ 2 milhões, e cresce com a riqueza', () => {
    const e = nascer(c, { semente: 1, ano: 2026 });
    expect(percentilDaRiqueza(e, 35_000)).toBeCloseTo(0.5, 1);
    expect(percentilDaRiqueza(e, 2_000_000)).toBeGreaterThan(0.985);
    expect(percentilDaRiqueza(e, 2_000_000)).toBeLessThan(0.995);
    expect(percentilDaRiqueza(e, -5000)).toBeLessThan(0.1);
    let antes = -1;
    for (const v of [-50_000, 0, 1000, 20_000, 100_000, 500_000, 3e6, 3e7, 3e8, 3e9, 3e10]) {
      const p = percentilDaRiqueza(e, v);
      expect(p).toBeGreaterThan(antes);
      expect(p).toBeLessThan(1);
      antes = p;
    }
  });

  it('o país mais rico por pessoa sobe a régua: o mesmo dinheiro vale um lugar mais baixo', () => {
    const e = nascer(c, { semente: 2, ano: 2026 });
    const antes = percentilDaRiqueza(e, 500_000);
    e.entidades['pais']!.n['pib']! *= 2;
    expect(percentilDaRiqueza(e, 500_000)).toBeLessThan(antes);
  });
});

describe('o lugar na história (I-170)', () => {
  it('a primeira linha da vida diz onde a família está, e quem nasce rico nasce mais alto', () => {
    const faixas: number[] = [];
    for (let s = 0; s < 40; s++) {
      const e = nascer(c, { semente: 300 + s, ano: 2026 });
      const linha = linhas(e, 'lugar:nasceu:');
      expect(linha).toHaveLength(1);
      expect(linha[0]!.texto).toMatch(/nasceu/);
      faixas.push(e.entidades['eu']!.n['estrato']!);
      expect(e.entidades['eu']!.n['estrato_max']).toBe(e.entidades['eu']!.n['estrato']);
    }
    expect(Math.max(...faixas)).toBeGreaterThan(Math.min(...faixas));
  });

  it('subir para uma faixa nova vira linha com o porquê; entrar no 1% é marco', () => {
    const e = adulto(10, 100_000);
    expect(e.entidades['eu']!.n['estrato']).toBe(2);
    const causa = decisao(e, 3_000_000, 'vendeu o terreno do avô');
    oAno(e);
    const linha = linhas(e, 'lugar:marco:4')[0];
    expect(linha?.texto).toMatch(/1% mais rico/);
    expect(linha?.causas).toEqual([causa]);
    const porId = new Map(e.historico.map((h) => [h.id, h]));
    expect(porqueDe(linha!, porId)?.texto).toBe('você vendeu o terreno do avô');
    expect(e.entidades['eu']!.n['estrato']).toBe(4);
    expect(e.entidades['eu']!.n['estrato_max']).toBe(4);
    for (const h of e.historico) expect(conferirContas(e, h), h.ref).toEqual([]);
    expect(conferirEstado(e, c)).toEqual([]);
  });

  it('a queda com causa se conta, e a volta depois dela também; a queda sem causa muda calada, e a volta, calada', () => {
    const e = adulto(11, 3_000_000);
    expect(e.entidades['eu']!.n['estrato']).toBe(4);
    decisao(e, -2_800_000, 'perdeu tudo num esquema de pirâmide');
    oAno(e);
    expect(linhas(e, 'lugar:caiu:')).toHaveLength(1);
    expect(e.entidades['eu']!.n['estrato']).toBeLessThan(4);
    decisao(e, 3_000_000, 'ganhou a ação na Justiça');
    oAno(e);
    expect(linhas(e, 'lugar:voltou:4')).toHaveLength(1);

    // Sem decisão nenhuma: o dinheiro some (como a inflação que come devagar) e volta, e nada se conta.
    const f = adulto(12, 3_000_000);
    f.entidades['eu']!.n['dinheiro'] = 200_000;
    const reg = oAno(f);
    expect(reg.some((m) => m.c === 'eu.estrato')).toBe(true);
    expect(linhas(f, 'lugar:caiu:')).toHaveLength(0);
    f.entidades['eu']!.n['dinheiro'] = 3_000_000;
    oAno(f);
    expect(f.entidades['eu']!.n['estrato']).toBe(4);
    expect(linhas(f, 'lugar:voltou:')).toHaveLength(0);
  });

  it('quem mora na porta da faixa não sobe e desce todo ano (a folga para cair)', () => {
    const e = adulto(13, 2_100_000);
    expect(e.entidades['eu']!.n['estrato']).toBe(4);
    e.entidades['eu']!.n['dinheiro'] = 1_900_000;
    oAno(e);
    expect(e.entidades['eu']!.n['estrato']).toBe(4);
  });

  it('as faixas têm nome para cada lugar, e a lista dos 10 entra pela posição', () => {
    expect(ESTRATOS).toHaveLength(10);
    const e = adulto(14, 2e11);
    const lugar = lugarNoPais(e, c);
    expect(lugar.posicao).toBeGreaterThan(0);
    expect(lugar.estrato).toBeGreaterThanOrEqual(8);
    expect(patrimonioTotal(e)).toBe(2e11);
  });
});

describe('os marcos do grupo (I-171)', () => {
  it('mil funcionários viram linha uma vez, com a decisão que fez o grupo de causa', () => {
    const e = adulto(20, 4_000_000_000);
    const op: Operacao = { tipo: 'abrir', setor: 'industria', valor: 2_000_000_000 };
    expect(motivoParaNaoOperar(e, c, op)).toBeNull();
    e.ano--;
    e.idade--;
    operar(e, c, op);
    e.ano++;
    e.idade++;
    // Um ano de negócio: a fábrica fica pronta e contrata.
    const reg: Mudanca[] = [];
    const ano = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'ano', texto: '' });
    regraDaEmpresa(e, c, momentoTipico('normal'), reg);
    lancar(e, ano, reg);
    expect(grupoNoMundo(e, c).funcionarios).toBeGreaterThanOrEqual(1000);
    marcosDoGrupo(e, c);
    marcosDoGrupo(e, c);
    const linha = linhas(e, 'porte:').filter((h) => h.ref!.endsWith(':grupo_mil'));
    expect(linha).toHaveLength(1);
    expect(linha[0]!.texto).toMatch(/mil funcionários/);
    expect(linha[0]!.causas?.length).toBe(1);
    expect(e.entidades['eu']!.q['grupo_mil']?.causa).toBe(linha[0]!.id);
  });
});
