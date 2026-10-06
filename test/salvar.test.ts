import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { AVISO_SAVE_ANTIGO, escreverSave, lerSave, saveVazio, VERSAO_SAVE } from '../src/jogo/salvar.ts';
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
