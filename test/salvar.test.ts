import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { AVISO_COPIA, AVISO_SAVE_ANTIGO, CHAVE_COPIA, CHAVE_SAVE, carregar, escreverSave, importarSave, lerComCopia, lerSave, saveVazio, VERSAO_SAVE } from '../src/jogo/salvar.ts';
import { lembrarVida } from '../src/motor/memoria.ts';
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

  it('cabe com folga no localStorage', () => {
    const vida = viverAteOFim(nascer(c, { semente: 9, ano: 2026 }), c, 9, 'cautelosa');
    expect(escreverSave({ ...saveVazio(), vida }).length).toBeLessThan(600_000);
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
    avancarAno(vida, c);
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

  it('no aparelho: o save que abre bem vira a cópia; o estragado volta da cópia', () => {
    const guardado = new Map<string, string>();
    const antes = globalThis.localStorage;
    globalThis.localStorage = { getItem: (k: string) => guardado.get(k) ?? null, setItem: (k: string, v: string) => void guardado.set(k, v) } as Storage;
    try {
      guardado.set(CHAVE_SAVE, bom);
      expect(carregar(c).vida).toEqual(lerSave(bom, c).vida);
      expect(guardado.get(CHAVE_COPIA)).toBe(bom);
      guardado.set(CHAVE_SAVE, estragado);
      const volta = carregar(c);
      expect(volta.vida).toEqual(lerSave(bom, c).vida);
      expect(volta.aviso).toBe(AVISO_COPIA);
      // A cópia não é trocada pelo estragado.
      expect(guardado.get(CHAVE_COPIA)).toBe(bom);
    } finally {
      globalThis.localStorage = antes;
    }
  });
});
