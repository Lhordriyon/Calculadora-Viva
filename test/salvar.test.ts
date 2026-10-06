import { describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { escreverSave, lerSave, saveVazio, VERSAO_SAVE } from '../src/jogo/salvar.ts';
import { lembrarVida } from '../src/motor/memoria.ts';
import { avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const c = carregarConteudo();

describe('save', () => {
  it('volta igual depois de escrever e ler', () => {
    const vida = nascer(c, { semente: 8, ano: 2026 });
    avancarAno(vida, c);
    if (vida.pendente) escolher(vida, c, 0);
    for (let i = 0; i < 20; i++) {
      if (vida.pendente) escolher(vida, c, 0);
      else avancarAno(vida, c);
    }
    const save = { ...saveVazio(), vida, memoria: lembrarVida(saveVazio().memoria, vida), vidas: 2 };
    const lido = lerSave(escreverSave(save), c);
    expect(lido).toEqual(save);
  });

  it('descarta save corrompido ou de outra versão sem quebrar', () => {
    expect(lerSave('{isso não é json', c)).toEqual(saveVazio());
    expect(lerSave(JSON.stringify({ versao: VERSAO_SAVE, vida: { lixo: true }, memoria: 3 }), c).vida).toBeNull();
    const memoria = { vidas: 4, recencia: { enem: 1 } };
    const velho = lerSave(JSON.stringify({ versao: VERSAO_SAVE - 1, vida: {}, memoria, vidas: 4 }), c);
    expect(velho.vida).toBeNull();
    expect(velho.memoria).toEqual(memoria);
  });

  it('solta a pendência de um evento que não existe mais', () => {
    const vida = nascer(c, { semente: 8, ano: 2026 });
    avancarAno(vida, c);
    expect(vida.pendente).not.toBeNull();
    vida.pendente!.eventoId = 'evento_removido';
    const lido = lerSave(escreverSave({ ...saveVazio(), vida }), c);
    expect(lido.vida?.pendente).toBeNull();
  });
});
