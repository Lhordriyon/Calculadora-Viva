/**
 * O poder que passa (bloco F): a coroa, o Regime e a ilha passam a quem continua a história (em vida ou na herança),
 * agora ou aos 18, sem interregno; quem tem cargo vive dele; o golpe, o autogolpe e a coroa restaurada; quem foi reinar
 * na ilha deixa de governar o Brasil; e o resgate do país vira título do Tesouro.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { patrimonioTotal, titulosDe } from '../src/motor/campos.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { POLITICAS } from '../src/motor/constantes.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { fundarIlha } from '../src/motor/coroa.ts';
import { alvoDaRelacao, defEstrangeiro } from '../src/motor/diplomacia.ts';
import { continuarComoHerdeiro } from '../src/motor/herdeiro.ts';
import { defGoverno, governoAtual, jogadorGoverna, motivoParaNaoGovernar } from '../src/motor/pais.ts';
import { criarPersonagem, morrerPersonagem } from '../src/motor/pessoas.ts';
import { regraDaCarreira } from '../src/motor/carreira.ts';
import { regraDoTrabalho } from '../src/motor/trabalho.ts';
import { criarRng } from '../src/motor/rng.ts';
import { MAIORIDADE, sucessaoPendente } from '../src/motor/sucessao.ts';
import type { EstadoVida, Mudanca } from '../src/motor/tipos.ts';
import { avancarAno, escolher, morrer, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

/** Quem nasce numa linhagem (a família real ou a do Regime), já com a idade pedida e a agenda limpa. */
function daLinhagem(semente: number, linhagem: 'realeza' | 'regime', idade: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2000, origem: { linhagem } });
  e.idade = idade;
  e.ano = 2000 + idade;
  e.agenda = [];
  return e;
}

/** O pai ou a mãe que reina (a linhagem dá a qualidade a um dos dois). */
function quemReina(e: EstadoVida, marca: 'monarca' | 'ditador'): 'mae' | 'pai' {
  return (['mae', 'pai'] as const).find((p) => e.entidades[p]?.q[marca])!;
}

/** Um adulto de 45 anos num país em fase normal, governado pelo centrão. */
function adulto(semente: number): EstadoVida {
  const e = nascer(c, { semente, ano: 2000, origem: { classe: 5 } });
  e.idade = 45;
  e.ano = 2045;
  e.agenda = [];
  const pais = e.entidades['pais']!;
  for (const f of ['expansao', 'recessao', 'crise', 'regime', 'calote', 'monarquia']) delete pais.q[f];
  pais.t['governo'] = 'centrao';
  const def = defGoverno(c, 'centrao')!;
  for (const p of POLITICAS) pais.n[`pol_${p}`] = def.politicas[p];
  Object.assign(pais.n, { crescimento: 2, desemprego: 8.5, inflacao: 4.5, juros: 9, divida: 75, impulso: 0, aprovacao: 50 });
  Object.assign(e.entidades['eu']!.n, { dinheiro: 1e9, popularidade: 50, renda: 0 });
  return e;
}

/** Quem joga no cargo, com o governo do país se o cargo governa. */
function noCargo(e: EstadoVida, cargo: 'presidente' | 'rei' | 'ditador' | 'soberano'): EstadoVida {
  const eu = e.entidades['eu']!;
  const pais = e.entidades['pais']!;
  eu.t['cargo'] = cargo;
  const q = { v: 1, ano: e.ano, idade: e.idade, causa: null };
  if (cargo === 'presidente') {
    eu.n['mandato'] = 3;
    eu.q['politico'] = { ...q };
  }
  if (cargo === 'rei') {
    eu.q['monarca'] = { ...q };
    pais.q['monarquia'] = { ...q };
  }
  if (cargo === 'ditador') {
    eu.q['ditador'] = { ...q };
    pais.q['regime'] = { ...q };
  }
  if (cargo === 'soberano') {
    fundarIlha(e, []);
    eu.q['micronacao'] = { ...q };
  } else pais.t['governo'] = 'voce';
  return e;
}

/** Quem joga morre deixando um filho com a idade pedida; devolve a vida do herdeiro. */
function herdar(e: EstadoVida, idadeDoFilho: number): EstadoVida {
  criarPersonagem(e, c, 'filho', []);
  e.entidades['filho']!.nascimento = e.ano - idadeDoFilho;
  morrer(e, c);
  const h = continuarComoHerdeiro(e, c);
  h.agenda = h.agenda.filter((a) => a.evento.startsWith('sucessao_'));
  return h;
}

/** Joga a escolha em várias sementes até o teste dar o desfecho pedido (o sorteio é da vida). */
function comDesfecho(base: () => EstadoVida, op: { id: string; escolha: number }, deu: (e: EstadoVida) => boolean): EstadoVida {
  for (let k = 1; k < 200; k++) {
    const e = base();
    e.rng = criarRng(k);
    expect(motivoParaNaoOperar(e, c, { tipo: 'jogada', ...op })).toBeNull();
    operar(e, c, { tipo: 'jogada', ...op });
    if (deu(e)) return e;
  }
  throw new Error('o desfecho não saiu em 200 sementes');
}

describe('a sucessão em vida', () => {
  it('quem reinava morre: a resposta vem no mesmo ano, com o nome de quem morreu, e a coroa vira o cargo', () => {
    const e = daLinhagem(1, 'realeza', 30);
    const p = quemReina(e, 'monarca');
    morrerPersonagem(e, p, [], 0);
    expect(e.agenda).toContainEqual({ evento: 'sucessao_coroa', ano: e.ano, origem: 0 });
    expect(sucessaoPendente(e)).toBe(true);
    e.ano -= 1;
    e.idade -= 1;
    avancarAno(e, c);
    expect(e.pendente?.storylet).toBe('sucessao_coroa');
    expect(e.pendente!.texto.startsWith(`${e.entidades[p]!.nome} morreu`)).toBe(true);
    expect(e.pendente!.causas).toContain(0);
    escolher(e, c, 0);
    const eu = e.entidades['eu']!;
    expect(eu.t['cargo']).toBe('rei');
    expect(eu.q['monarca']).toBeDefined();
    expect(eu.q['principe']).toBeUndefined();
    avancarAno(e, c);
    expect(governoAtual(e)).toBe('voce');
    expect(motivoParaNaoGovernar(e, c)).toBeNull();
  });

  it('antes dos 18, a regência: a resposta fica para o ano dos 18 e diz que a regência acabou', () => {
    const e = daLinhagem(2, 'realeza', 10);
    morrerPersonagem(e, quemReina(e, 'monarca'), [], 0);
    const item = e.agenda.find((a) => a.evento === 'sucessao_coroa')!;
    expect(item.ano).toBe(e.anoNascimento + MAIORIDADE);
    expect(sucessaoPendente(e)).toBe(false);
    e.idade = MAIORIDADE - 1;
    e.ano = e.anoNascimento + MAIORIDADE - 1;
    e.agenda = [item];
    avancarAno(e, c);
    expect(e.pendente?.storylet).toBe('sucessao_coroa');
    expect(e.pendente!.texto.startsWith('Você fez 18 anos, a regência acabou')).toBe(true);
  });

  it('o Regime também: quem manda morre e os generais esperam a resposta de quem herda', () => {
    const e = daLinhagem(3, 'regime', 35);
    morrerPersonagem(e, quemReina(e, 'ditador'), [], 0);
    expect(e.agenda.some((a) => a.evento === 'sucessao_regime')).toBe(true);
  });

  it('quem não está na fila (já reina, ou não é da linhagem) não recebe sucessão nenhuma', () => {
    const e = daLinhagem(4, 'realeza', 30);
    e.entidades['eu']!.q['monarca'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    morrerPersonagem(e, quemReina(e, 'monarca'), [], 0);
    expect(e.agenda.some((a) => a.evento === 'sucessao_coroa')).toBe(false);
    const comum = adulto(5);
    morrerPersonagem(comum, 'mae', [], 0);
    expect(comum.agenda.some((a) => a.evento.startsWith('sucessao_'))).toBe(false);
  });
});

describe('a sucessão na herança', () => {
  it('o filho adulto de quem reinava entra na fila; o governo espera a resposta (sem interregno) e a coroa passa', () => {
    const h = herdar(noCargo(adulto(10), 'rei'), 30);
    const eu = h.entidades['eu']!;
    expect(eu.q['principe']?.causa).toBe(h.historico[0]!.id);
    expect(h.historico[0]!.texto).toContain('A coroa é sua, e o Palácio espera a resposta.');
    expect(eu.n['popularidade']).toBe(50);
    avancarAno(h, c);
    expect(governoAtual(h)).toBe('voce');
    expect(h.pendente?.storylet).toBe('sucessao_coroa');
    expect(h.pendente!.texto).toMatch(/^\S+ morreu, e o Palácio/);
    escolher(h, c, 0);
    avancarAno(h, c);
    expect(h.entidades['eu']!.t['cargo']).toBe('rei');
    expect(jogadorGoverna(h, c)).toBe(true);
    expect(governoAtual(h)).toBe('voce');
  });

  it('o filho menor espera os 18, e até lá a regência governa (um governo de transição)', () => {
    const h = herdar(noCargo(adulto(11), 'rei'), 9);
    expect(h.historico[0]!.texto).toContain('A coroa será sua aos 18; até lá, a regência governa.');
    expect(h.agenda.find((a) => a.evento === 'sucessao_coroa')?.ano).toBe(h.anoNascimento + MAIORIDADE);
    avancarAno(h, c);
    expect(governoAtual(h)).not.toBe('voce');
    expect(h.pendente?.storylet).not.toBe('sucessao_coroa');
  });

  it('quem abdica devolve o governo: no ano seguinte, um governo de transição', () => {
    const h = herdar(noCargo(adulto(12), 'rei'), 30);
    avancarAno(h, c);
    expect(h.pendente?.storylet).toBe('sucessao_coroa');
    escolher(h, c, 1);
    avancarAno(h, c);
    expect(h.entidades['eu']!.q['abdicou']).toBeDefined();
    expect(governoAtual(h)).not.toBe('voce');
  });

  it('o Regime: quem herda governa enquanto pensa (o Regime não toma o governo antes da resposta) e assume', () => {
    const h = herdar(noCargo(adulto(13), 'ditador'), 30);
    expect(h.entidades['eu']!.q['herdeiro_regime']).toBeDefined();
    avancarAno(h, c);
    expect(governoAtual(h)).toBe('voce');
    expect(h.pendente?.storylet).toBe('sucessao_regime');
    escolher(h, c, 0);
    avancarAno(h, c);
    expect(h.entidades['eu']!.t['cargo']).toBe('ditador');
    expect(governoAtual(h)).toBe('voce');
  });

  it('a ilha: quem herda adulto assume no primeiro ano; o menor, aos 18; a herança é a causa', () => {
    const h = herdar(noCargo(adulto(14), 'soberano'), 40);
    expect(h.entidades['eu']!.q['herdeiro_ilha']).toBeDefined();
    expect(h.entidades['eu']!.t['cargo'] ?? '').toBe('');
    avancarAno(h, c);
    const eu = h.entidades['eu']!;
    expect(eu.t['cargo']).toBe('soberano');
    expect(eu.q['herdeiro_ilha']).toBeUndefined();
    expect(eu.n['popularidade']).toBeGreaterThanOrEqual(50);
    const posse = h.historico.find((x) => x.ref === 'sucessao:ilha')!;
    expect(posse.texto).toContain('Você assumiu a coroa de');
    expect(posse.causas).toContain(h.historico[0]!.id);
    for (const x of h.historico) expect(conferirContas(h, x), x.ref).toEqual([]);

    const menor = herdar(noCargo(adulto(15), 'soberano'), 12);
    expect(menor.historico[0]!.texto).toContain('será sua aos 18; até lá, um conselho cuida dela.');
    avancarAno(menor, c);
    expect(menor.entidades['eu']!.t['cargo'] ?? '').toBe('');
    menor.pendente = null;
    menor.idade = MAIORIDADE - 1;
    menor.ano = menor.anoNascimento + MAIORIDADE - 1;
    avancarAno(menor, c);
    expect(menor.entidades['eu']!.t['cargo']).toBe('soberano');
  });
});

describe('quem tem cargo vive do cargo', () => {
  it('sob o Regime não há eleição geral; a municipal continua', () => {
    const e = adulto(20);
    e.entidades['pais']!.q['regime'] = { v: 1, ano: e.ano, idade: e.idade, causa: null };
    e.entidades['eu']!.n['influencia'] = 99;
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatarCargo', cargo: 'presidente' })).toBe('sob o Regime, não há eleição');
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatarCargo', cargo: 'vereador' })).not.toBe('sob o Regime, não há eleição');
  });

  it('quem tem cargo não é demitido, e a coroa leva a carreira junto (com a posse de causa)', () => {
    const e = noCargo(adulto(21), 'presidente');
    e.entidades['eu']!.n['renda'] = 500000;
    e.entidades['eu']!.t['setor'] = 'industria';
    for (let k = 0; k < 30; k++) regraDoTrabalho(e, c, { id: 'crise' } as never, []);
    expect(e.agenda.some((a) => a.evento === 'demissao')).toBe(false);

    const r = noCargo(adulto(22), 'rei');
    Object.assign(r.entidades['eu']!.t, { carreira: 'medico', ocupacao: 'médico' });
    r.entidades['eu']!.n['nivel'] = 2;
    const reg: Mudanca[] = [];
    regraDaCarreira(r, c, reg);
    expect(r.entidades['eu']!.t['carreira'] ?? '').toBe('');
    expect(r.historico.at(-1)!.ref).toBe('carreira:coroa');
  });
});

describe('quem foi reinar na ilha deixa o Brasil', () => {
  it('o presidente que funda um país perde o governo daqui na hora, e quem assume aponta a fundação', () => {
    const e = noCargo(adulto(30), 'presidente');
    e.entidades['eu']!.n['dinheiro'] = 1e12;
    expect(motivoParaNaoGovernar(e, c)).toBeNull();
    const entrada = operar(e, c, { tipo: 'jogada', id: 'fundar_um_pais', escolha: 0 });
    expect(e.entidades['eu']!.t['cargo']).toBe('soberano');
    expect(motivoParaNaoGovernar(e, c)).toBe('você não governa mais o país');
    avancarAno(e, c);
    expect(governoAtual(e)).not.toBe('voce');
    const posse = e.historico.find((h) => h.ref?.startsWith('governo:') && h.ano === e.ano)!;
    expect(posse.texto).toContain('Sem você no poder');
    expect(posse.causas).toContain(entrada.id);
  });
});

describe('tomar o poder', () => {
  it('o autogolpe que dá certo: o Regime, o governo para sempre, nenhuma eleição geral, e lá fora o mundo muda de lado', () => {
    const base = (): EstadoVida => {
      const e = noCargo(adulto(40), 'presidente');
      e.entidades['eu']!.n['popularidade'] = 100;
      return e;
    };
    const federacao = defEstrangeiro(c, 'federacao')!;
    const antes = alvoDaRelacao(base(), c, federacao);
    const e = comDesfecho(base, { id: 'ficar_no_poder', escolha: 0 }, (x) => x.entidades['eu']!.t['cargo'] === 'ditador');
    expect(e.entidades['pais']!.q['regime']).toBeDefined();
    expect(e.entidades['eu']!.q['golpista']).toBeDefined();
    expect(alvoDaRelacao(e, c, federacao)).toBeLessThan(antes);
    avancarAno(e, c);
    expect(governoAtual(e)).toBe('voce');
    expect(jogadorGoverna(e, c)).toBe(true);
    expect(motivoParaNaoOperar(e, c, { tipo: 'candidatarCargo', cargo: 'senador' })).not.toBeNull();
    // E quem herda o Regime que o golpe fundou entra na fila.
    const h = herdar(e, 30);
    expect(h.entidades['eu']!.q['herdeiro_regime']).toBeDefined();
  });

  it('o golpe que dá errado: preso, sem cargo, e a marca de quem tentou', () => {
    const base = (): EstadoVida => {
      const e = adulto(41);
      Object.assign(e.entidades['eu']!.n, { influencia: 60, dinheiro: 3e10 });
      return e;
    };
    const e = comDesfecho(base, { id: 'tomar_o_poder', escolha: 1 }, (x) => x.entidades['eu']!.q['condenado'] !== undefined);
    expect(e.entidades['eu']!.q['golpista']).toBeDefined();
    expect(e.entidades['eu']!.t['cargo'] ?? '').toBe('');
    expect(e.entidades['pais']!.q['regime']).toBeUndefined();
  });

  it('liderar os quartéis pede coronel ou general', () => {
    const e = adulto(42);
    e.entidades['eu']!.n['influencia'] = 80;
    expect(motivoParaNaoOperar(e, c, { tipo: 'jogada', id: 'tomar_o_poder', escolha: 0 })).toBe('os quartéis só seguem coronel ou general');
    Object.assign(e.entidades['eu']!.t, { carreira: 'militar' });
    e.entidades['eu']!.n['nivel'] = 4;
    expect(motivoParaNaoOperar(e, c, { tipo: 'jogada', id: 'tomar_o_poder', escolha: 0 })).toBeNull();
  });

  it('a monarquia restaurada pelo plebiscito: a coroa é de quem bancou, e quem tem coroa governa', () => {
    const base = (): EstadoVida => {
      const e = adulto(43);
      Object.assign(e.entidades['eu']!.n, { dinheiro: 2e10, fama: 60, popularidade: 100 });
      return e;
    };
    const e = comDesfecho(base, { id: 'restaurar_a_monarquia', escolha: 0 }, (x) => x.entidades['eu']!.t['cargo'] === 'rei');
    expect(e.entidades['pais']!.q['monarquia']).toBeDefined();
    avancarAno(e, c);
    expect(governoAtual(e)).toBe('voce');
  });
});

describe('o resgate do país vira título', () => {
  it('salvar o país empresta ao governo em títulos do Tesouro: o patrimônio não some e o título paga', () => {
    const e = adulto(50);
    Object.assign(e.entidades['pais']!.n, { crescimento: -1 });
    Object.assign(e.entidades['eu']!.n, { dinheiro: 5e10, renda_fixa: 3e11 });
    const antes = patrimonioTotal(e);
    operar(e, c, { tipo: 'jogada', id: 'salvar_o_pais', escolha: 0 });
    const titulos = titulosDe(e);
    expect(titulos).toHaveLength(1);
    expect(titulos[0]!.n['valor']).toBe(2e11);
    expect(patrimonioTotal(e)).toBeCloseTo(antes, -3);
    expect(c.porId.has('o_pais_te_paga')).toBe(false);
    expect(conferirContas(e, e.historico.at(-1)!)).toEqual([]);
  });
});
