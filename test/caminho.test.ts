import { describe, expect, it } from 'vitest';
import { conteudo } from '../src/conteudo.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { aplicarComando, caminhoNaoTomado, escolhasGravadas, novaGravacao, refazer, type Comando, type Gravacao } from '../src/motor/caminho.ts';
import { motivoParaNaoOperar } from '../src/motor/carteira.ts';
import { novaMemoria } from '../src/motor/memoria.ts';
import { decidir, decidirAcao, decidirDinheiro, type Estrategia } from '../src/motor/robos.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';

const c = conteudo;

/** Uma vida jogada como a interface joga, gravando cada comando (o robô faz o papel de quem joga). */
function jogarGravando(semente: number, estrategia: Estrategia): { vida: EstadoVida; g: Gravacao } {
  const e = nascer(c, { semente, ano: 2026 });
  const memoria = novaMemoria();
  const g = novaGravacao(e, memoria);
  const robo = criarRng(semente);
  const fazer = (cmd: Comando): void => {
    aplicarComando(e, c, memoria, cmd);
    g.comandos.push(cmd);
  };
  for (let passos = 0; e.vivo && passos < 3000; passos++) {
    if (e.pendente) {
      fazer({ t: 'escolher', i: decidir(estrategia, e, c, robo), entrada: e.proximoId });
      continue;
    }
    for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) fazer({ t: 'operar', op });
    const idade = e.idade;
    for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente && e.idade === idade; a = jaAgiu(e) || e.idade !== idade ? null : decidirAcao(estrategia, e, c, robo)) {
      fazer({ t: 'agir', verbo: a.verbo, ...(a.escolha ? { escolha: a.escolha } : {}) });
    }
    if (e.vivo && !e.pendente && e.idade === idade) fazer({ t: 'ano' });
  }
  return { vida: e, g };
}

describe('o caminho não tomado (Ω5)', () => {
  it('a gravação refaz a vida igual: a mesma semente e os mesmos comandos dão o mesmo livro', () => {
    const { vida, g } = jogarGravando(31, 'cautelosa');
    expect(vida.vivo).toBe(false);
    expect(g.comandos.length).toBeGreaterThan(50);
    expect(JSON.stringify(refazer(c, g))).toBe(JSON.stringify(vida));
  });

  it('trocar uma escolha: tudo igual até ali, a outra opção naquele ponto e outra vida dali em diante', () => {
    const { vida, g } = jogarGravando(32, 'arriscada');
    const entradas = escolhasGravadas(g);
    expect(entradas.length).toBeGreaterThan(3);
    // Uma escolha do meio da vida, com outra opção possível.
    let feito = false;
    for (const entrada of entradas.slice(Math.floor(entradas.length / 3))) {
      const r = caminhoNaoTomado(c, g, entrada);
      if ('erro' in r) continue;
      const antes = (x: EstadoVida) => x.historico.filter((h) => h.id < entrada).map((h) => `${h.id}:${h.ref}:${h.texto}`);
      expect(antes(r.vida)).toEqual(antes(vida));
      const lá = r.vida.historico.find((h) => h.id === entrada)!;
      const cá = vida.historico.find((h) => h.id === entrada)!;
      expect(lá.ref).toBe(cá.ref);
      expect(lá.escolha?.indice).not.toBe(cá.escolha?.indice);
      expect(r.outra).not.toBe(r.escolhida);
      expect(r.vida.vivo).toBe(false);
      // A vida real não mudou.
      expect(JSON.stringify(refazer(c, g))).toBe(JSON.stringify(vida));
      feito = true;
      break;
    }
    expect(feito).toBe(true);
  });

  it('a gravação que não refaz a mesma vida não inventa caminho: diz que o jogo mudou', () => {
    const { g } = jogarGravando(33, 'cautelosa');
    const entradas = escolhasGravadas(g);
    const alvo = entradas.at(-1)!;
    // Um comando a menos antes do ponto: a vida refeita já não chega ao mesmo lugar do livro.
    const i = g.comandos.findIndex((x) => x.t === 'ano');
    const torta: Gravacao = { ...g, comandos: g.comandos.filter((_, j) => j !== i) };
    expect(caminhoNaoTomado(c, torta, alvo)).toEqual({ erro: 'o jogo mudou desde que esta vida começou, e ela não se refaz igual' });
    expect(caminhoNaoTomado(c, g, 999_999)).toEqual({ erro: 'essa escolha não ficou gravada' });
  });
});
