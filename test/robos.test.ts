/** A régua do túnel: o empate dos robôs e os dilemas medidos em três bolsos, com a empresa quando o storylet pede uma. */
import { describe, expect, it } from 'vitest';
import { empresaDe } from '../src/motor/empresa.ts';
import { arriscarNaoCompensa, BOLSOS, decidir, EMPRESA_TIPICA, estadoDoDilema, estadoTipico, falsosDilemas, NOMES_DOS_BOLSOS, pedeEmpresa } from '../src/motor/robos.ts';
import { aleatorio, criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { conteudoCom, escolhaSimples } from './apoio.ts';

function aposta(texto: string, sucesso: Record<string, unknown>, fracasso: Record<string, unknown>) {
  return { texto, resumo: texto.toLowerCase(), teste: { chance: 0.5 }, sucesso: { texto: 'Deu certo.', efeitos: sucesso }, fracasso: { texto: 'Deu errado.', efeitos: fracasso } };
}

const c = conteudoCom([
  {
    id: 'tres_caminhos',
    idade: [30, 30],
    texto: 'Três caminhos que valem o mesmo.',
    resumo: 'escolheu um caminho',
    escolhas: [escolhaSimples('Pela esquerda'), escolhaSimples('Pelo meio'), escolhaSimples('Pela direita')],
  },
  {
    id: 'um_melhor',
    idade: [30, 30],
    texto: 'Um caminho melhor que o outro.',
    resumo: 'escolheu o melhor',
    escolhas: [escolhaSimples('Pouco', { felicidade: 1 }), escolhaSimples('Muito', { felicidade: 5 })],
  },
  {
    id: 'tudo_ou_nada',
    idade: [30, 30],
    texto: 'Tudo ou nada.',
    resumo: 'decidiu se apostava tudo',
    escolhas: [escolhaSimples('Pagar para ver de longe', { dinheiro: -300 }), aposta('Pôr tudo na mesa', { patrimonioFator: 1.5 }, { patrimonioFator: 0.4 })],
  },
  {
    id: 'socio_novo',
    idade: [30, 30],
    condicoes: { 'empresa.valor': { min: 1 } },
    texto: 'Um sócio bate à porta.',
    resumo: 'pensou num sócio',
    escolhas: [escolhaSimples('Seguir sozinho'), aposta('Apostar no sócio', { empresaFator: 2 }, { empresaFator: 0.5 })],
  },
  {
    id: 'depois_de_vender',
    idade: [30, 30],
    condicoes: { 'empresa.valor': false },
    texto: 'Sem empresa, com tempo.',
    resumo: 'viveu sem empresa',
    escolhas: [escolhaSimples('Descansar'), escolhaSimples('Viajar', { felicidade: 1 })],
  },
  {
    id: 'na_bolsa',
    idade: [30, 30],
    condicoes: { marcas: ['empresa.na_bolsa'] },
    texto: 'O balanço saiu.',
    resumo: 'leu o balanço',
    escolhas: [escolhaSimples('Comemorar'), escolhaSimples('Guardar', { felicidade: 1 })],
  },
  {
    id: 'grupo',
    idade: [30, 30],
    condicoes: { empresas: { min: 2 } },
    texto: 'Duas agendas.',
    resumo: 'dividiu a agenda',
    escolhas: [escolhaSimples('Esta agenda'), escolhaSimples('A outra agenda', { felicidade: 1 })],
  },
]);

function pendente(e: EstadoVida, storylet: string, disponiveis: boolean[]): void {
  e.pendente = { storylet, instancia: storylet, causa: 'diretor', texto: '', causas: [], opcoes: disponiveis.map((disponivel, i) => ({ texto: String(i), disponivel })) };
}

describe('o empate dos robôs', () => {
  it('no empate em tudo, a cautelosa e a arriscada sorteiam; a primeira continua na primeira', () => {
    for (const estrategia of ['cautelosa', 'arriscada'] as const) {
      const vistas = new Set<number>();
      for (let s = 1; s <= 60; s++) {
        const e = nascer(c, { semente: s, ano: 2026 });
        pendente(e, 'tres_caminhos', [true, true, true]);
        vistas.add(decidir(estrategia, e, c, criarRng(s)));
      }
      expect([...vistas].sort()).toEqual([0, 1, 2]);
    }
    for (let s = 1; s <= 20; s++) {
      const e = nascer(c, { semente: s, ano: 2026 });
      pendente(e, 'tres_caminhos', [true, true, true]);
      expect(decidir('primeira', e, c, criarRng(s))).toBe(0);
    }
  });

  it('o sorteio do empate não escolhe opção desabilitada', () => {
    for (let s = 1; s <= 40; s++) {
      const e = nascer(c, { semente: s, ano: 2026 });
      pendente(e, 'tres_caminhos', [true, false, true]);
      expect(decidir('cautelosa', e, c, criarRng(s))).not.toBe(1);
    }
  });

  it('sem empate, escolhe o melhor e o rng do robô não anda', () => {
    for (const estrategia of ['cautelosa', 'arriscada'] as const) {
      const e = nascer(c, { semente: 3, ano: 2026 });
      pendente(e, 'um_melhor', [true, true]);
      const robo = criarRng(99);
      expect(decidir(estrategia, e, c, robo)).toBe(1);
      expect(aleatorio(robo)).toBe(aleatorio(criarRng(99)));
    }
  });
});

describe('a régua dos dilemas', () => {
  const base = nascer(c, { semente: 1, ano: 2026 });

  it('os três bolsos mudam o dinheiro do adulto; a criança não tem bolso', () => {
    expect(NOMES_DOS_BOLSOS).toEqual(['pobre', 'tipico', 'rico']);
    expect(estadoTipico(base, 30, 'pobre').entidades['eu']!.n['dinheiro']).toBe(1_000);
    expect(estadoTipico(base, 30).entidades['eu']!.n['dinheiro']).toBe(BOLSOS.tipico.dinheiro);
    expect(estadoTipico(base, 30, 'rico').entidades['eu']!.n['dinheiro']).toBe(50_000_000);
    for (const bolso of NOMES_DOS_BOLSOS) expect(estadoTipico(base, 10, bolso).entidades['eu']!.n['dinheiro']).toBe(0);
  });

  it('o storylet que pede empresa se mede com a empresa típica; o que pede que ela falte, sem', () => {
    const porId = (id: string) => c.porId.get(id)!;
    expect(['socio_novo', 'na_bolsa', 'grupo'].map((id) => pedeEmpresa(porId(id)))).toEqual([true, true, true]);
    expect(['tres_caminhos', 'depois_de_vender'].map((id) => pedeEmpresa(porId(id)))).toEqual([false, false]);
    expect(empresaDe(estadoDoDilema(c, base, porId('socio_novo'), 30))?.n['valor']).toBe(EMPRESA_TIPICA);
    expect(empresaDe(estadoDoDilema(c, base, porId('depois_de_vender'), 30))).toBeUndefined();
  });

  it('o denominador são os storylets que a conta olha, e o bolso muda o que compensa', () => {
    const r = Object.fromEntries(NOMES_DOS_BOLSOS.map((b) => [b, arriscarNaoCompensa(c, base, b)]));
    // Só "tudo_ou_nada" e "socio_novo" têm 2 opções sem condição e alguma com risco (o sócio, só com a empresa).
    for (const b of NOMES_DOS_BOLSOS) expect(r[b]!.avaliados).toBe(2);
    // Apostar no sócio compensa com a empresa de verdade (sem ela, a régua dava zero e nem contava).
    for (const b of NOMES_DOS_BOLSOS) expect(r[b]!.achados).not.toContain('socio_novo');
    // Pôr tudo na mesa: com R$ 1 mil, perder pouco vale a chance; com R$ 10 mil ou R$ 50 milhões, não compensa.
    expect(r['pobre']!.achados).not.toContain('tudo_ou_nada');
    expect(r['tipico']!.achados).toContain('tudo_ou_nada');
    expect(r['rico']!.achados).toContain('tudo_ou_nada');
  });

  it('o falso dilema aparece nos três bolsos', () => {
    for (const b of NOMES_DOS_BOLSOS) expect(falsosDilemas(c, base, b)).toContainEqual({ evento: 'um_melhor', escolha: 1 });
  });
});

describe('o conteúdo de verdade', () => {
  it('nenhum falso dilema nos três bolsos (a opção melhor em tudo vira escolha sem escolha)', async () => {
    const { carregarConteudo } = await import('../scripts/disco.ts');
    const real = carregarConteudo();
    const base = nascer(real, { semente: 1, ano: 2026 });
    for (const bolso of NOMES_DOS_BOLSOS) expect(falsosDilemas(real, base, bolso), bolso).toEqual([]);
  });
});
