import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { AVISO_COPIA, AVISO_SAVE_ANTIGO, CHAVE_COPIA, CHAVE_SAVE, carregar, confirmarAbertura, escreverSave, gravarJa, avisarSeNaoGravar, importarSave, largarAVida, salvar, salvarDepois, lerComCopia, lerSave, saveCru, saveVazio, temCopiaParaVoltar, voltarACopia, VERSAO_SAVE } from '../src/jogo/salvar.ts';
import { lembrarVida } from '../src/motor/memoria.ts';
import { novaGravacao } from '../src/motor/caminho.ts';
import { criarRng } from '../src/motor/rng.ts';
import { avancarAno, nascer } from '../src/motor/vida.ts';
import { passo, viverAteOFim } from './apoio.ts';

const c = carregarConteudo();

describe('save', () => {
  it('volta igual depois de escrever e ler, no meio e no fim da vida', () => {
    const vida = nascer(c, { semente: 8, ano: 2026 });
    const robo = criarRng(3);
    while (vida.idade < 35) passo(vida, c, robo);
    const meio = { ...saveVazio(), vida, vidas: 2 };
    expect(lerSave(escreverSave(meio), c)).toEqual(meio);
    viverAteOFim(vida, c, 3);
    const fim = { ...saveVazio(), vida, memoria: lembrarVida(saveVazio().memoria, vida), vidas: 3 };
    expect(lerSave(escreverSave(fim), c)).toEqual(fim);
  });

  it('a gravação da vida (o caminho não tomado) volta igual, com os comandos inteiros; a de outra vida fica de fora', () => {
    const inicio = nascer(c, { semente: 12, ano: 2026 });
    const vida = structuredClone(inicio);
    avancarAno(vida, c);
    const gravacao = novaGravacao(inicio, saveVazio().memoria);
    gravacao.comandos.push({ t: 'ano' }, { t: 'operar', op: { tipo: 'comecar_projeto', id: 'casa_propria' } }, { t: 'escolher', i: 1, entrada: 7 });
    const save = { ...saveVazio(), vida, gravacao };
    expect(lerSave(escreverSave(save), c)).toEqual(save);
    const outra = { ...save, gravacao: novaGravacao(nascer(c, { semente: 13, ano: 2026 }), saveVazio().memoria) };
    expect(lerSave(escreverSave(outra), c).gravacao).toBeUndefined();
  });

  it('cabe com folga no localStorage', () => {
    const vida = viverAteOFim(nascer(c, { semente: 9, ano: 2026 }), c, 9, 'cautelosa');
    // Os mercados de cada setor (H3) anotam a oferta e a obra de 11 setores por ano no livro: uns 80 KB numa vida longa.
    // O localStorage aguenta uns 5 MB; 700 KB ainda é folga.
    expect(escreverSave({ ...saveVazio(), vida }).length).toBeLessThan(700_000);
  });

  it('descarta save corrompido sem quebrar', () => {
    expect(lerSave('{isso não é json', c)).toEqual(saveVazio());
    expect(lerSave(JSON.stringify({ versao: VERSAO_SAVE, vida: { lixo: true }, memoria: 3 }), c).vida).toBeNull();
  });

  it('save da versão anterior: a vida recomeça com aviso e a memória fica (ganhando as ações)', () => {
    const memoria = { vidas: 4, recencia: { enem: 1 } };
    const velho = lerSave(JSON.stringify({ versao: VERSAO_SAVE - 1, vida: { pessoa: {} }, memoria, vidas: 4 }), c);
    expect(velho.vida).toBeNull();
    expect(velho.memoria).toEqual({ ...memoria, acoes: {} });
    expect(velho.vidas).toBe(4);
    expect(velho.aviso).toBe(AVISO_SAVE_ANTIGO);
    // o aviso não é gravado
    expect(escreverSave(velho)).not.toContain('aviso');
  });

  it('solta a pendência de um storylet que não existe mais', () => {
    const vida = nascer(c, { semente: 8, ano: 2026 });
    // O primeiro ano com uma escolha pendente (num ano, pode nascer um irmão, que não pede escolha).
    for (let i = 0; i < 10 && !vida.pendente; i++) avancarAno(vida, c);
    expect(vida.pendente).not.toBeNull();
    vida.pendente!.storylet = 'storylet_removido';
    const lido = lerSave(escreverSave({ ...saveVazio(), vida }), c);
    expect(lido.vida?.pendente).toBeNull();
  });
});

describe('a cópia do save e a exportação', () => {
  const vida = nascer(c, { semente: 12, ano: 2026 });
  const robo = criarRng(5);
  while (vida.idade < 20) passo(vida, c, robo);
  const bom = escreverSave({ ...saveVazio(), vida, vidas: 3, memoria: { vidas: 3, recencia: { enem: 2 }, acoes: {} } });
  const estragado = bom.slice(0, bom.length / 2);

  it('com o principal bom, é ele (e ele vira a cópia nova)', () => {
    const r = lerComCopia(bom, null, c);
    expect(r.bom).toBe(true);
    expect(r.save).toEqual(lerSave(bom, c));
  });

  it('com o principal estragado (ou sumido), volta para a cópia, com aviso', () => {
    for (const principal of [estragado, '{}', null]) {
      const r = lerComCopia(principal, bom, c);
      expect(r.bom).toBe(false);
      expect(r.save.vida).toEqual(lerSave(bom, c).vida);
      expect(r.save.vidas).toBe(3);
      expect(r.save.aviso).toBe(AVISO_COPIA);
    }
  });

  it('a vida do principal que não coube no esquema volta da cópia, se a cópia é da mesma versão', () => {
    const quebrado = JSON.stringify({ versao: VERSAO_SAVE, vida: { lixo: true }, memoria: { vidas: 4, recencia: {} }, vidas: 4 });
    const r = lerComCopia(quebrado, bom, c);
    expect(r.save.vida).toEqual(lerSave(bom, c).vida);
    expect(r.save.aviso).toBe(AVISO_COPIA);
    // Save de uma versão antiga do jogo: a cópia é tão antiga quanto ele, e a vida recomeça como sempre.
    const velho = JSON.stringify({ versao: VERSAO_SAVE - 1, vida: { pessoa: {} }, memoria: { vidas: 4, recencia: {} }, vidas: 4 });
    const r2 = lerComCopia(velho, velho, c);
    expect(r2.save.vida).toBeNull();
    expect(r2.save.aviso).toBe(AVISO_SAVE_ANTIGO);
  });

  it('sem principal nem cópia legíveis, começa do zero', () => {
    expect(lerComCopia(estragado, 'lixo', c)).toEqual({ save: saveVazio(), bom: false });
    expect(lerComCopia(null, null, c)).toEqual({ save: saveVazio(), bom: false });
  });

  it('importar: o texto exportado volta igual; o que não é save devolve null e nada muda', () => {
    expect(importarSave(`  ${bom}\n`, c)).toEqual(lerSave(bom, c));
    expect(importarSave(estragado, c)).toBeNull();
    expect(importarSave('{"versao": "dois"}', c)).toBeNull();
  });

  it('no aparelho: o save que abre bem vira a cópia quando o jogo confirma que abriu; o estragado volta da cópia', () => {
    const guardado = new Map<string, string>();
    const antes = globalThis.localStorage;
    globalThis.localStorage = { getItem: (k: string) => guardado.get(k) ?? null, setItem: (k: string, v: string) => void guardado.set(k, v) } as Storage;
    try {
      guardado.set(CHAVE_SAVE, bom);
      expect(carregar(c).vida).toEqual(lerSave(bom, c).vida);
      // Lido, mas a tela ainda não desenhou: a cópia espera (um save que derruba o desenho não pode apagar a cópia boa).
      expect(guardado.get(CHAVE_COPIA)).toBeUndefined();
      confirmarAbertura();
      expect(guardado.get(CHAVE_COPIA)).toBe(bom);
      guardado.set(CHAVE_SAVE, estragado);
      const volta = carregar(c);
      expect(volta.vida).toEqual(lerSave(bom, c).vida);
      expect(volta.aviso).toBe(AVISO_COPIA);
      // A cópia não é trocada pelo estragado, nem depois de o jogo abrir com ela.
      confirmarAbertura();
      expect(guardado.get(CHAVE_COPIA)).toBe(bom);
    } finally {
      globalThis.localStorage = antes;
    }
  });
});

describe('a gravação depois do toque', () => {
  it('grava só o último save, uma vez, quando sobra tempo ou quando o app sai', async () => {
    const guardado = new Map<string, string>();
    let gravacoes = 0;
    const antes = globalThis.localStorage;
    globalThis.localStorage = { getItem: (k: string) => guardado.get(k) ?? null, setItem: (k: string, v: string) => void (gravacoes++, guardado.set(k, v)) } as Storage;
    try {
      const a = { ...saveVazio(), vidas: 1 };
      const b = { ...saveVazio(), vidas: 2 };
      salvarDepois(a);
      salvarDepois(b);
      expect(gravacoes).toBe(0);
      gravarJa();
      expect(gravacoes).toBe(1);
      expect(guardado.get(CHAVE_SAVE)).toBe(escreverSave(b));
      // Sem nada esperando, o temporizador não grava de novo.
      await new Promise((ok) => setTimeout(ok, 80));
      expect(gravacoes).toBe(1);
      salvarDepois(a);
      await new Promise((ok) => setTimeout(ok, 80));
      expect(guardado.get(CHAVE_SAVE)).toBe(escreverSave(a));
    } finally {
      globalThis.localStorage = antes;
    }
  });
});

describe('o save que o aparelho recusa (missão Ascensão AAA, I-150)', () => {
  /** Um armazenamento de mentira com um teto de caracteres, como o do navegador. */
  function comArmazenamento<T>(teto: number, corpo: (guardado: Map<string, string>) => T): T {
    const guardado = new Map<string, string>();
    const antes = globalThis.localStorage;
    globalThis.localStorage = {
      getItem: (k: string) => guardado.get(k) ?? null,
      removeItem: (k: string) => void guardado.delete(k),
      setItem: (k: string, v: string) => {
        const outros = [...guardado].filter(([x]) => x !== k).reduce((n, [, x]) => n + x.length, 0);
        if (outros + v.length > teto) throw new Error('QuotaExceededError');
        guardado.set(k, v);
      },
    } as Storage;
    try {
      return corpo(guardado);
    } finally {
      globalThis.localStorage = antes;
      avisarSeNaoGravar(null);
    }
  }
  const umSave = lerSave(JSON.stringify({ versao: VERSAO_SAVE, vida: null, memoria: { vidas: 2, recencia: {}, acoes: {} }, vidas: 2 }), c);

  it('sem espaço, a cópia de segurança sai para a vida caber, e ninguém é avisado', () => {
    const texto = escreverSave(umSave);
    comArmazenamento(texto.length + 40, (guardado) => {
      guardado.set(CHAVE_COPIA, 'x'.repeat(60));
      let avisos = 0;
      avisarSeNaoGravar(() => avisos++);
      expect(salvar(umSave)).toBe(true);
      expect(guardado.get(CHAVE_SAVE)).toBe(texto);
      expect(guardado.has(CHAVE_COPIA)).toBe(false);
      expect(avisos).toBe(0);
    });
  });

  it('se nem assim couber, o jogo continua e avisa (antes falhava calado)', () => {
    comArmazenamento(10, (guardado) => {
      let avisos = 0;
      avisarSeNaoGravar(() => avisos++);
      expect(salvar(umSave)).toBe(false);
      expect(guardado.has(CHAVE_SAVE)).toBe(false);
      expect(avisos).toBe(1);
    });
  });

  it('as saídas da tela de recuperação: o save cru, voltar à cópia e largar só a vida (a memória fica)', () => {
    comArmazenamento(1e9, (guardado) => {
      const comVida = JSON.stringify({ versao: VERSAO_SAVE, vida: { qualquer: 'coisa' }, memoria: { vidas: 5, recencia: { a: 1 }, acoes: {} }, vidas: 5 });
      guardado.set(CHAVE_SAVE, comVida);
      expect(saveCru()).toBe(comVida);
      expect(temCopiaParaVoltar()).toBe(false);
      guardado.set(CHAVE_COPIA, escreverSave(umSave));
      expect(temCopiaParaVoltar()).toBe(true);
      expect(largarAVida()).toBe(true);
      const semVida = JSON.parse(guardado.get(CHAVE_SAVE)!);
      expect(semVida.vida).toBeNull();
      expect(semVida.vidas).toBe(5);
      expect(semVida.memoria.recencia).toEqual({ a: 1 });
      expect(voltarACopia()).toBe(true);
      expect(guardado.get(CHAVE_SAVE)).toBe(escreverSave(umSave));
      expect(temCopiaParaVoltar()).toBe(false);
    });
  });
});
