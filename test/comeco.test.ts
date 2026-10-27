/**
 * Incremento 7: a vida começa sua. Criar o personagem (tudo opcional), o parto,
 * a primeira infância com consequências que voltam depois, e os aluguéis à vista.
 */
import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { operar } from '../src/motor/carteira.ts';
import { bensDe } from '../src/motor/campos.ts';
import { limparNome, talentosValidos, TALENTOS_DA_CRIACAO, type EscolhaOrigem } from '../src/motor/origem.ts';
import { misturar } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { porqueDe } from '../src/motor/virada.ts';
import { alugueisDoAno, balancoDoAno, visivel } from '../src/ui/formato.ts';

const c = carregarConteudo();

describe('criar o personagem', () => {
  const tudo: EscolhaOrigem = {
    nome: 'Joana',
    sobrenome: 'Prado',
    genero: 'f',
    cidade: 'Recife',
    classe: 2,
    familia: 'acolhedora',
    irmaos: 3,
    traco: 'carismatico',
    talentos: { saude: 1, inteligencia: 2, aparencia: 1, felicidade: 0 },
  };

  it('tudo o que se escolhe vale: nome, sobrenome, gênero, cidade, classe, família, irmãos e jeito', () => {
    const e = nascer(c, { semente: 7, ano: 2026, origem: tudo });
    const eu = e.entidades['eu']!;
    expect(eu.nome).toBe('Joana');
    expect(e.sobrenome).toBe('Prado');
    expect(eu.genero).toBe('f');
    expect(e.entidades['lugar']!.nome).toBe('Recife');
    expect(eu.n['classe_origem']).toBe(2);
    expect(eu.t['familia']).toBe('acolhedora');
    // Os irmãos: os que já nasceram contam em `irmaos`; os mais novos estão agendados para nascer.
    const vemDepois = e.agenda.filter((a) => a.evento === 'irmao_nasce').length;
    expect(eu.n['irmaos']! + vemDepois).toBe(3);
    expect(eu.t['traco']).toBe('carismatico');
  });

  it('a mesma semente com a mesma escolha dá a mesma vida', () => {
    const a = nascer(c, { semente: 11, ano: 2026, origem: tudo });
    const b = nascer(c, { semente: 11, ano: 2026, origem: tudo });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('talento escolhido pesa: "muito" em inteligência nasce acima de "pouco", e pontos demais são ignorados', () => {
    const media = (nivel: number): number => {
      let soma = 0;
      for (let i = 0; i < 200; i++) {
        const e = nascer(c, { semente: misturar(5, i), ano: 2026, origem: { traco: 'otimista', talentos: { inteligencia: nivel, saude: 2 - nivel, aparencia: 1, felicidade: 1 } } });
        soma += e.entidades['eu']!.n['inteligencia']!;
      }
      return soma / 200;
    };
    expect(media(2)).toBeGreaterThan(media(0) + 15);
    expect(talentosValidos({ saude: 2, inteligencia: 2, aparencia: 2 })).toBeUndefined();
    expect(talentosValidos({ saude: 3 })).toBeUndefined();
    expect(talentosValidos({ saude: 1, inteligencia: 1, aparencia: 1, felicidade: 1 })).toBeTruthy();
    expect(TALENTOS_DA_CRIACAO).toBe(4);
  });

  it('o nome digitado não vira modelo de texto: só letras, espaço, hífen e apóstrofo', () => {
    expect(limparNome('  Ana {mae} [x|y]  ')).toBe('Ana mae xy');
    expect(limparNome("D'Ávila-Souza")).toBe("D'Ávila-Souza");
    expect(limparNome('a'.repeat(40))).toHaveLength(24);
    // Nome vazio: sorteia.
    expect(nascer(c, { semente: 3, ano: 2026, origem: { nome: '   ' } }).entidades['eu']!.nome).toMatch(/\p{L}/u);
  });
});

describe('o parto', () => {
  it('cerca de 1 em cada 10 nasce prematuro, com menos saúde; a linhagem conta o próprio nascimento', () => {
    let prematuros = 0;
    let saudeP = 0;
    let saudeN = 0;
    for (let i = 0; i < 2000; i++) {
      const e = nascer(c, { semente: misturar(19, i), ano: 2026, origem: { classe: 2 } });
      const s = e.entidades['eu']!.n['saude']!;
      if (e.entidades['eu']!.q['prematuro']) {
        prematuros++;
        saudeP += s;
      } else saudeN += s;
    }
    expect(prematuros / 2000).toBeGreaterThan(0.06);
    expect(prematuros / 2000).toBeLessThan(0.16);
    expect(saudeP / prematuros).toBeLessThan(saudeN / (2000 - prematuros) - 4);
    for (let i = 0; i < 60; i++) {
      const e = nascer(c, { semente: misturar(23, i), ano: 2026, origem: { linhagem: 'realeza' } });
      expect(e.historico[0]!.texto).not.toMatch(/incubadora/);
    }
  });
});

describe('a primeira infância', () => {
  /** Vive até a idade dada respondendo sempre a mesma opção possível (a de índice preferido, se der). */
  function viverAte(e: EstadoVida, idade: number, preferir: (storylet: string) => number = () => 0): void {
    while (e.vivo && e.idade < idade) {
      if (e.pendente) {
        const p = e.pendente;
        const quero = preferir(p.storylet);
        escolher(e, c, p.opcoes[quero]?.disponivel ? quero : p.opcoes.findIndex((o) => o.disponivel));
      } else avancarAno(e, c);
    }
  }

  it('os anos até os 4 têm escolhas, e muitas: ninguém passa a primeira infância só tocando "+1 ano"', () => {
    let comEscolha = 0;
    for (let i = 0; i < 100; i++) {
      const e = nascer(c, { semente: misturar(29, i), ano: 2026 });
      viverAte(e, 5);
      if (e.historico.some((h) => h.idade <= 4 && h.escolha)) comEscolha++;
    }
    expect(comEscolha).toBeGreaterThanOrEqual(85);
  });

  it('o que acontece cedo volta depois, e a linha do tempo mostra o porquê', () => {
    let achou = false;
    for (let i = 0; i < 300 && !achou; i++) {
      const e = nascer(c, { semente: misturar(31, i), ano: 2026, origem: { classe: 2 } });
      // Histórias antes de dormir (a primeira opção de historias_ou_telas).
      viverAte(e, 8, (s) => (s === 'historias_ou_telas' ? 0 : 0));
      const leu = e.historico.find((h) => h.ref === 'leu_antes_dos_colegas');
      const historias = e.historico.find((h) => h.ref === 'historias_ou_telas' && h.escolha?.indice === 0);
      if (!leu || !historias) continue;
      const porque = porqueDe(leu, new Map(e.historico.map((h) => [h.id, h])));
      expect(porque?.idade).toBeLessThanOrEqual(4);
      achou = true;
    }
    expect(achou).toBe(true);
  });
});

describe('aluguéis à vista', () => {
  it('o aluguel entra anotado à parte no livro, e o balanço do ano conta os bens', () => {
    const e = nascer(c, { semente: 12, ano: 2026, origem: { classe: 4 } });
    while (e.idade < 30) {
      if (e.pendente) escolher(e, c, e.pendente.opcoes.findIndex((o) => o.disponivel));
      else avancarAno(e, c);
    }
    while (e.pendente) escolher(e, c, e.pendente.opcoes.findIndex((o) => o.disponivel));
    Object.assign(e.entidades['eu']!.n, { dinheiro: 2_000_000 });
    operar(e, c, { tipo: 'comprar', item: 'sala_comercial' });
    expect(bensDe(e).some((b) => b.q['alugado'])).toBe(true);
    const n = e.historico.length;
    avancarAno(e, c);
    const ano = e.historico.slice(n).find((h) => !visivel(h))!;
    // A sala rende 6,5% do valor por ano (com dívida, parte do aluguel vai direto para ela e conta igual).
    expect(alugueisDoAno(ano)).toBeCloseTo((bensDe(e)[0]!.n['valor'] ?? 0) * 0.065, -1);
    // O imóvel que mudou de valor entra no balanço do patrimônio do ano.
    const bem = bensDe(e)[0]!;
    const mudou = ano.mudancas?.find((m) => m.c === `${bem.id}.valor`)?.d ?? 0;
    expect(mudou).not.toBe(0);
    const semBens = (ano.mudancas ?? []).filter((m) => !m.c.startsWith('bem'));
    expect(balancoDoAno(ano, 1) - balancoDoAno({ ...ano, mudancas: semBens }, 1)).toBeCloseTo(mudou, 0);
  });
});
