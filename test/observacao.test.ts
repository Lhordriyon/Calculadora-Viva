/**
 * O observatório (etapa 03): o observador que só lê, os perfis, os extremos, a saturação, o relatório, o armazenamento
 * no aparelho e o arquivo exportado.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { carregarConteudo } from '../scripts/disco.ts';
import { aplicarComando, novaGravacao, refazer } from '../src/motor/caminho.ts';
import { extremosDaVida, LIMIARES } from '../src/motor/extremos.ts';
import { emMarkdown, relatorioDe } from '../src/motor/inteligencia.ts';
import { lembrarVida, novaMemoria } from '../src/motor/memoria.ts';
import {
  comecarObservacao,
  jogarObservando,
  observarComando,
  observarGravacao,
  observarPeloLivro,
  recebidoNa,
  type FotoDoAno,
  type Registro,
  type VidaObservada,
} from '../src/motor/observacao.ts';
import { perfisDaVida, perfisDosSinais, sinaisDe } from '../src/motor/perfis.ts';
import { criarRng, misturar } from '../src/motor/rng.ts';
import { saturacaoDaVida, saturacaoDoAno } from '../src/motor/saturacao.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { nascer } from '../src/motor/vida.ts';
import { escreverSave, lerSave } from '../src/jogo/salvar.ts';
import { escreverArquivoDeObservacao, lerArquivoDeObservacao } from '../src/jogo/formato-da-observacao.ts';
import {
  apagarObservacao,
  CHAVE_DA_OBSERVACAO,
  compactar,
  gravarObservacao,
  guardarVidaObservada,
  lerObservacao,
  observacaoVazia,
  observarVidaQueAcabou,
  VIDAS_INTEIRAS,
} from '../src/jogo/observacao.ts';

const c = carregarConteudo();

/** Uma vida de robô observada (e o estado final), sempre a mesma para a mesma semente. */
const vidas = new Map<string, { vida: VidaObservada; e: EstadoVida; inicio: EstadoVida; comandos: ReturnType<typeof jogarObservando>['comandos'] }>();
function robo(semente: number, estrategia: 'cautelosa' | 'arriscada' | 'aleatoria', classe?: number) {
  const chave = `${semente}:${estrategia}:${classe}`;
  const pronta = vidas.get(chave);
  if (pronta) return pronta;
  const e = nascer(c, { semente, ano: 2026, ...(classe !== undefined ? { origem: { classe } } : {}) });
  const inicio = structuredClone(e);
  const { vida, comandos } = jogarObservando(c, e, estrategia, criarRng(misturar(semente, 77)), novaMemoria(), { fonte: 'robo', partida: `t${semente}`, estrategia });
  const r = { vida, e, inicio, comandos };
  vidas.set(chave, r);
  return r;
}

/** Uma foto de mentira, para os casos que a vida de robô não garante. */
function foto(ano: number, x: Partial<FotoDoAno> = {}): FotoDoAno {
  return {
    ano, idade: ano - 2000, patrimonio: 1e5, caixa: 1e4, investido: 0, titulos: 0, bens: 0, empresas: 0, divida: 0, renda: 50_000, custo: 30_000,
    felicidade: 60, saude: 80, nEmpresas: 0, nSubsidiarias: 0, nHoldings: 0, funcionarios: 0, pesoNoPib: 0, maiorFatia: 0, maiorRival: 0,
    infPessoal: 20, infPolitica: 0, infNegocios: 0, cargo: '', coroa: false, regime: false, percentil: 0.5, patrimonioSobrePib: 1e-8,
    filhos: 0, lacosFortes: 2, planos: 1, sonhos: 0, possiveis: 3, conquistas: 0, mercadoCabe: 1, fichas: 3, fichasLivres: 0, mostrados: 2, repetidos: 0, recebido: 0, entradas: {},
    oportunidades: { elegiveis: 100, deEscala: 30, maiorImpacto: 0.5, jogadas: 0 },
    mundo: { pib: 2e13, populacao: 2e8, pibPerCapita: 1e5, crescimento: 1, inflacao: 4, desemprego: 8, fase: 'normal', governo: 'centrao' },
    ...x,
  };
}

function registro(ano: number, area: Registro['area'], x: Partial<Registro> = {}): Registro {
  return { n: 0, ano, idade: ano - 2000, tipo: 'operacao', ref: area, area, areas: [area], antes: 1e5, efeito: { patrimonio: 0, felicidade: 0, influencia: 0, entradas: 1 }, refs: [], ...x };
}

function vidaDeMentira(registros: Registro[], anos: FotoDoAno[], x: Partial<VidaObservada> = {}): VidaObservada {
  return { versao: 1, fonte: 'robo', partida: 'm', geracao: 1, semente: 1, classeDeOrigem: 3, nascimento: 2000, inicio: anos[0]!.ano, completa: true, registros: registros.map((r, n) => ({ ...r, n })), anos, ...x };
}

describe('o observador só lê', () => {
  it('a mesma vida, observada ou não, sai igual byte a byte (o estado e o livro)', () => {
    const { e, inicio, comandos } = robo(3, 'cautelosa');
    const outra = structuredClone(inicio);
    for (const cmd of comandos) aplicarComando(outra, c, novaMemoria(), cmd);
    expect(JSON.stringify(outra)).toBe(JSON.stringify(e));
  });

  it('refazer a gravação observando dá a mesma vida que refazer sem observar', () => {
    const { inicio, comandos, e } = robo(3, 'cautelosa');
    const g = { ...novaGravacao(inicio, novaMemoria()), comandos };
    const { estado } = observarGravacao(c, g, { fonte: 'jogador', partida: 'x' });
    expect(JSON.stringify(estado)).toBe(JSON.stringify(refazer(c, g)));
    expect(JSON.stringify(estado)).toBe(JSON.stringify(e));
  });
});

describe('o registro das decisões', () => {
  it('cada escolha guarda as opções que estavam na mesa, as disponíveis e a escolhida; o total bate com o livro', () => {
    const { vida, e } = robo(4, 'arriscada');
    const escolhas = vida.registros.filter((r) => r.tipo === 'escolha');
    expect(escolhas.length).toBe(e.historico.filter((h) => h.escolha !== undefined).length);
    for (const r of escolhas) {
      expect(r.opcoes).toBeDefined();
      expect(r.opcoes!.total).toBeGreaterThanOrEqual(1);
      expect(r.opcoes!.disponiveis).toBeGreaterThanOrEqual(1);
      expect(r.opcoes!.escolhida).toBeLessThan(r.opcoes!.total);
      expect(c.porId.has(r.ref)).toBe(true);
    }
    expect(vida.registros.filter((r) => r.tipo === 'acao').length).toBe(e.historico.filter((h) => h.tipo === 'acao').length);
    // As operações são as da folha, e o que elas mexeram está nas áreas.
    expect(vida.registros.some((r) => r.tipo === 'operacao')).toBe(true);
    const comEfeito = vida.registros.filter((r) => r.tipo === 'operacao' && r.areas.length > 0);
    expect(comEfeito.length).toBeGreaterThan(0);
  });

  it('a consequência é o que mudou: o patrimônio depois menos o antes', () => {
    const { vida } = robo(4, 'arriscada');
    for (let i = 0; i + 1 < vida.registros.length; i++) {
      const r = vida.registros[i]!;
      const seguinte = vida.registros[i + 1]!;
      // O patrimônio antes do próximo comando é o antes deste mais o que ele mudou (os comandos se sucedem).
      expect(seguinte.antes).toBeCloseTo(r.antes + r.efeito.patrimonio, 0);
    }
  });

  it('passar o ano com fichas sobrando registra quantas sobraram', () => {
    const { vida } = robo(5, 'aleatoria');
    const anos = vida.registros.filter((r) => r.tipo === 'ano');
    expect(anos.length).toBeGreaterThan(0);
    for (const r of anos) expect(r.fichasLivres).toBeGreaterThanOrEqual(0);
  });
});

describe('a integridade e o tempo', () => {
  it('a ordem é contínua, os anos andam, a idade é o ano menos o nascimento, e cada ano tem uma foto', () => {
    const { vida, e } = robo(6, 'cautelosa');
    vida.registros.forEach((r, i) => expect(r.n).toBe(i));
    for (let i = 1; i < vida.registros.length; i++) expect(vida.registros[i]!.ano).toBeGreaterThanOrEqual(vida.registros[i - 1]!.ano);
    for (const r of vida.registros) expect(r.idade).toBe(r.ano - vida.nascimento);
    for (let i = 1; i < vida.anos.length; i++) expect(vida.anos[i]!.ano).toBe(vida.anos[i - 1]!.ano + 1);
    for (const f of vida.anos) {
      expect(f.idade).toBe(f.ano - vida.nascimento);
      for (const [k, v] of Object.entries(f)) if (typeof v === 'number') expect(Number.isFinite(v), k).toBe(true);
    }
    expect(vida.anos.at(-1)!.ano).toBe(e.ano);
    expect(vida.fim?.idade).toBe(e.idade);
    expect(vida.fonte).toBe('robo');
  });

  it('a observação não guarda nomes: nem de quem joga nem da família', () => {
    const { vida, e } = robo(6, 'cautelosa');
    const texto = JSON.stringify(vida);
    for (const en of Object.values(e.entidades)) if (en.tipo === 'pessoa' && en.nome.length > 3) expect(texto.includes(`"${en.nome}"`), en.nome).toBe(false);
    expect(texto.includes(e.sobrenome)).toBe(false);
  });
});

describe('os perfis', () => {
  it('quem abre empresas e governa é empreendedor e estrategista ao mesmo tempo', () => {
    const anos = Array.from({ length: 11 }, (_, i) => foto(2040 + i, { cargo: 'presidente', infPolitica: 80, empresas: 8e5, patrimonio: 1e6, nEmpresas: 3 }));
    const registros = Array.from({ length: 30 }, (_, i) => registro(2040 + (i % 10), i % 2 === 0 ? 'empresa' : 'politica'));
    const s = sinaisDe(vidaDeMentira(registros, anos), 2040, 2049);
    const p = perfisDosSinais(s);
    expect(p.find((x) => x.perfil === 'empreendedor')!.p).toBeGreaterThan(0.6);
    expect(p.find((x) => x.perfil === 'estrategista')!.p).toBeGreaterThan(0.6);
    for (const x of p) expect(x.p).toBeGreaterThanOrEqual(0);
  });

  it('o perfil muda com a vida: a primeira década no poder, a segunda nos investimentos', () => {
    const anos = Array.from({ length: 21 }, (_, i) => foto(2040 + i, i < 10 ? { cargo: 'governador', infPolitica: 70 } : { investido: 9e5, patrimonio: 1e6 }));
    const registros = Array.from({ length: 40 }, (_, i) => registro(2040 + Math.floor(i / 2), i < 20 ? 'politica' : 'investimentos'));
    const { janelas } = perfisDaVida(vidaDeMentira(registros, anos, { fim: { ano: 2060, idade: 60, categoria: '', patrimonio: 1e6, patrimonioSobrePib: 0, percentil: 0.9 } }));
    const topo = (j: number) => [...janelas[j]!.perfis].sort((a, b) => b.p - a.p)[0]!.perfil;
    expect(topo(0)).toBe('estrategista');
    expect(topo(1)).toBe('investidor');
  });

  it('numa vida de robô, todo perfil tem uma probabilidade e o porquê dos que puxam', () => {
    const { vida } = robo(7, 'arriscada', 6);
    const p = perfisDaVida(vida);
    expect(p.vida).toHaveLength(10);
    for (const x of p.vida.filter((y) => y.p >= 0.6)) expect(x.porque.length).toBeGreaterThan(0);
    expect(p.janelas.length).toBeGreaterThan(3);
  });
});

describe('os extremos', () => {
  it('são relativos: o mesmo patrimônio é fortuna nacional num país pequeno e não num grande', () => {
    const pequeno = extremosDaVida(vidaDeMentira([], [foto(2050, { patrimonio: 1e11, patrimonioSobrePib: 0.02 })]));
    const grande = extremosDaVida(vidaDeMentira([], [foto(2050, { patrimonio: 1e11, patrimonioSobrePib: 0.0002 })]));
    expect(pequeno.find((a) => a.tipo === 'fortuna_nacional')?.nivel).toBe('extremo');
    expect(grande.find((a) => a.tipo === 'fortuna_nacional')).toBeUndefined();
  });

  it('acha o grupo no PIB, a holding com subsidiárias, a concentração, o poder e a dinastia longa, com o ano', () => {
    const anos = [foto(2050), foto(2051, { pesoNoPib: 3, nHoldings: 1, nSubsidiarias: 9, maiorFatia: 0.6, percentil: 0.9995 })];
    for (let i = 0; i < 13; i++) anos.push(foto(2052 + i, { cargo: 'presidente' }));
    const achados = extremosDaVida(vidaDeMentira([], anos, { geracao: 9 }));
    const tipo = (t: string) => achados.find((a) => a.tipo === t);
    expect(tipo('grupo_no_pib')?.nivel).toBe('extremo');
    expect(tipo('grupo_no_pib')?.ano).toBe(2051);
    expect(tipo('holding_com_subsidiarias')?.nivel).toBe('extremo');
    expect(tipo('concentracao_de_mercado')?.nivel).toBe('extremo');
    expect(tipo('riqueza_relativa')?.nivel).toBe('extremo');
    expect(tipo('poder_politico')?.nivel).toBe('extremo');
    expect(tipo('dinastia_longa')?.nivel).toBe('extremo');
    for (const a of achados) expect(a.limiar).toBe(a.nivel === 'extremo' ? LIMIARES[a.tipo].extremo : LIMIARES[a.tipo].notavel);
  });

  it('a herança e o fundo da família não contam como enriquecimento', () => {
    const anos = [foto(2040, { patrimonio: 1e5 }), ...Array.from({ length: 10 }, (_, i) => foto(2041 + i, { patrimonio: 1e10, recebido: i === 0 ? 1e10 : 0 }))];
    expect(extremosDaVida(vidaDeMentira([], anos)).find((a) => a.tipo === 'crescimento_explosivo')).toBeUndefined();
    const semHeranca = anos.map((f) => ({ ...f, recebido: 0, entradas: f.ano === 2041 ? { tesouro: 9e9, mercado: 1e9 } : {} }));
    const explosivo = extremosDaVida(vidaDeMentira([], semHeranca)).find((a) => a.tipo === 'crescimento_explosivo');
    expect(explosivo?.nivel).toBe('extremo');
    // E diz de onde veio o dinheiro: a pista para ler o livro.
    expect(explosivo?.fonte).toEqual({ origem: 'tesouro', valor: 9e9, parte: 0.9 });
    // Na vida de robô, o que as fotos dizem que chegou de outras pessoas é o que o livro diz.
    const { vida, e, inicio } = robo(21505, 'cautelosa', 7);
    const pelasFotos = vida.anos.slice(1).reduce((t, f) => t + f.recebido, 0);
    expect(pelasFotos).toBeGreaterThan(1e10);
    const peloLivro = e.historico.slice(inicio.historico.length).reduce((t, h) => t + recebidoNa(e, h), 0);
    expect(pelasFotos).toBeCloseTo(peloLivro, 0);
  });

  it('numa vida de robô, o topo da riqueza aparece quando, e só quando, a vida passou do 0,1% mais rico', () => {
    for (const v of [robo(11, 'arriscada', 7).vida, robo(12, 'cautelosa', 0).vida, robo(5, 'aleatoria').vida, robo(3, 'cautelosa').vida]) {
      const topo = Math.max(...v.anos.map((f) => f.percentil));
      const achado = extremosDaVida(v).find((a) => a.tipo === 'riqueza_relativa');
      expect(achado?.nivel === 'extremo').toBe(topo >= LIMIARES.riqueza_relativa.extremo);
      expect(achado === undefined).toBe(topo < LIMIARES.riqueza_relativa.notavel);
    }
    expect(extremosDaVida(robo(11, 'arriscada', 7).vida).some((a) => a.tipo === 'riqueza_relativa' && a.nivel === 'extremo')).toBe(true);
  });
});

describe('a saturação', () => {
  it('sobe quando o mundo não responde: nada de escala, dinheiro sem onde render, salário que não pesa, nenhum objetivo', () => {
    const pobre = saturacaoDoAno(foto(2050), []);
    const saturado = saturacaoDoAno(foto(2050, { patrimonio: 1e12, renda: 1e5, mercadoCabe: 0.2, planos: 0, sonhos: 0, possiveis: 0, oportunidades: { elegiveis: 100, deEscala: 0, maiorImpacto: 0.001, jogadas: 0 } }), []);
    expect(pobre.indice).toBeLessThan(0.2);
    expect(saturado.indice).toBeGreaterThan(0.7);
    expect(saturado.componentes.escala).toBe(1);
    expect(saturado.componentes.salario).toBeGreaterThan(0.99);
  });

  it('ausência de notificação não é ausência de conteúdo: um ano sem eventos não conta como repetição', () => {
    const s = saturacaoDoAno(foto(2050, { mostrados: 0, repetidos: 0 }), []);
    expect(s.componentes.repeticao).toBeUndefined();
  });

  it('esgotada é cinco anos seguidos em 0,7 ou mais', () => {
    const cheio = { patrimonio: 1e12, renda: 1e5, mercadoCabe: 0.2, planos: 0, sonhos: 0, possiveis: 0, oportunidades: { elegiveis: 100, deEscala: 0, maiorImpacto: 0, jogadas: 0 } };
    const anos = [...Array.from({ length: 4 }, (_, i) => foto(2040 + i)), ...Array.from({ length: 6 }, (_, i) => foto(2044 + i, cheio))];
    expect(saturacaoDaVida(vidaDeMentira([], anos)).esgotadoDesde).toBe(2044);
    expect(saturacaoDaVida(vidaDeMentira([], anos.slice(0, 8))).esgotadoDesde).toBeNull();
  });

  it('em vidas de robô, cada ano tem o índice e os componentes entre 0 e 1, e o índice é a média dos que valem no ano', () => {
    for (const v of [robo(11, 'arriscada', 7).vida, robo(12, 'cautelosa', 0).vida]) {
      const s = saturacaoDaVida(v);
      // O ano da morte (nada mais é possível) fica de fora: não é um ano em que o mundo deixou de responder.
      expect(s.anos).toHaveLength(v.anos.filter((f) => f.oportunidades.elegiveis > 0 || f.idade < 1).length);
      expect(s.anos.length).toBeGreaterThanOrEqual(v.anos.length - 1);
      for (const a of s.anos) {
        const xs = Object.values(a.componentes).filter((x): x is number => x !== undefined);
        for (const x of xs) expect(x).toBeGreaterThanOrEqual(0), expect(x).toBeLessThanOrEqual(1);
        expect(a.indice).toBeCloseTo(xs.reduce((t, x) => t + x, 0) / xs.length, 9);
      }
    }
  });
});

describe('partidas longas e desempenho', () => {
  it('uma dinastia de três gerações: a mesma partida, a geração que sobe, e o tempo em ordem entre as vidas', () => {
    let e = nascer(c, { semente: 31, ano: 2026, origem: { classe: 5 } });
    let memoria = novaMemoria();
    const observadas: VidaObservada[] = [];
    for (let g = 1; g <= 3; g++) {
      const { vida } = jogarObservando(c, e, 'cautelosa', criarRng(misturar(31, 77, g)), memoria, { fonte: 'robo', partida: 'dinastia-31' });
      observadas.push(vida);
      memoria = lembrarVida(memoria, e);
      if (g === 3) break;
      if (!herdeiroPossivel(e, c)) {
        e.entidades['eu']!.n['irmaos'] = 1;
        delete e.entidades['eu']!.t['testamento'];
      }
      e = continuarComoHerdeiro(e, c);
    }
    expect(observadas.map((v) => v.geracao)).toEqual([1, 2, 3]);
    expect(new Set(observadas.map((v) => v.partida)).size).toBe(1);
    for (let i = 1; i < observadas.length; i++) expect(observadas[i]!.inicio).toBe(observadas[i - 1]!.fim!.ano);
  });

  it('o relatório de 50 mil registros sai em poucos segundos', () => {
    const anos = Array.from({ length: 100 }, (_, i) => foto(2026 + i, { patrimonio: 1e5 * (1 + i), percentil: Math.min(0.999, 0.5 + i / 200) }));
    const registros = Array.from({ length: 1000 }, (_, i) => registro(2026 + Math.floor(i / 10), (['empresa', 'investimentos', 'relacoes', 'politica', 'dinheiro'] as const)[i % 5]!));
    const lote = Array.from({ length: 50 }, (_, k) => vidaDeMentira(registros, anos, { semente: k, partida: `m${k}` }));
    const t0 = performance.now();
    const r = relatorioDe(lote, c, { fonte: 'teste', descricao: 'teste' });
    const md = emMarkdown(r);
    const ms = performance.now() - t0;
    expect(r.registros).toBe(50_000);
    expect(md).toContain('## Comportamentos identificados');
    expect(ms).toBeLessThan(10_000);
  });
});

describe('o relatório', () => {
  it('separa fato de hipótese, diz a confiança e dá exemplos reproduzíveis', () => {
    const lote = [robo(3, 'cautelosa').vida, robo(4, 'arriscada').vida, robo(7, 'arriscada', 6).vida, robo(11, 'arriscada', 7).vida, robo(12, 'cautelosa', 0).vida];
    const r = relatorioDe(lote, c, { fonte: 'robôs do teste', descricao: 'cinco vidas' });
    const todos = [...r.comportamentos, ...r.estrategias, ...r.gargalos, ...r.incoerencias, ...r.conteudoInsuficiente, ...r.anomalias, ...r.oportunidades];
    expect(todos.length).toBeGreaterThan(5);
    for (const it of todos) {
      expect(['fato', 'hipotese']).toContain(it.natureza);
      expect(['alta', 'media', 'baixa']).toContain(it.confianca);
      expect(it.metrica.length).toBeGreaterThan(0);
    }
    expect(todos.some((it) => it.exemplos.some((x) => /semente \d+/.test(x)))).toBe(true);
    const md = emMarkdown(r);
    expect(md).toContain('robôs do teste');
    expect(md).toContain('fato observado');
  });
});

describe('o aparelho e os saves de antes', () => {
  let guardado: Map<string, string>;
  let antes: Storage | undefined;
  beforeEach(() => {
    guardado = new Map();
    antes = globalThis.localStorage;
    globalThis.localStorage = { getItem: (k: string) => guardado.get(k) ?? null, setItem: (k: string, v: string) => void guardado.set(k, v), removeItem: (k: string) => void guardado.delete(k) } as Storage;
  });
  afterEach(() => {
    globalThis.localStorage = antes as Storage;
  });

  it('a observação estragada, de outra versão ou ausente volta vazia, e o jogo segue', () => {
    expect(lerObservacao()).toEqual(observacaoVazia());
    guardado.set(CHAVE_DA_OBSERVACAO, '{isso não é json');
    expect(lerObservacao()).toEqual(observacaoVazia());
    guardado.set(CHAVE_DA_OBSERVACAO, JSON.stringify({ versao: 99, vidas: [] }));
    expect(lerObservacao()).toEqual(observacaoVazia());
  });

  it('guarda as últimas vidas inteiras e o resumo das mais antigas; desligada, não guarda', () => {
    const v = compactar(robo(3, 'cautelosa').vida);
    for (let i = 0; i < VIDAS_INTEIRAS + 2; i++) guardarVidaObservada({ ...v, semente: i });
    const o = lerObservacao();
    expect(o.vidas).toHaveLength(VIDAS_INTEIRAS);
    expect(o.resumos).toHaveLength(2);
    expect(o.resumos[0]!.perfis.length).toBeGreaterThanOrEqual(0);
    gravarObservacao({ ...o, ligada: false });
    guardarVidaObservada(v);
    expect(lerObservacao().vidas).toHaveLength(VIDAS_INTEIRAS);
    // Apagar leva as vidas e deixa a escolha de quem joga como estava (desligada continua desligada).
    apagarObservacao();
    expect(lerObservacao()).toEqual({ ...observacaoVazia(), ligada: false });
  });

  it('com o armazenamento cheio, larga as vidas mais antigas em vez de quebrar', () => {
    const v = compactar(robo(3, 'cautelosa').vida);
    const limite = JSON.stringify(v).length * 2.5;
    globalThis.localStorage = {
      getItem: (k: string) => guardado.get(k) ?? null,
      setItem: (k: string, x: string) => {
        if (x.length > limite) throw new Error('QuotaExceededError');
        guardado.set(k, x);
      },
      removeItem: (k: string) => void guardado.delete(k),
    } as Storage;
    for (let i = 0; i < 4; i++) expect(() => guardarVidaObservada({ ...v, semente: i })).not.toThrow();
    expect(lerObservacao().vidas.length).toBeLessThanOrEqual(2);
  });

  it('a vida que acabou é observada pela gravação, em pedaços; sem gravação (o save de antes dela), pelo livro', async () => {
    const { e, inicio, comandos } = robo(3, 'cautelosa');
    const g = { ...novaGravacao(inicio, novaMemoria()), comandos };
    let vezes = 0;
    const observada = await observarVidaQueAcabou(c, e, g, async () => void vezes++);
    expect(observada?.completa).toBe(true);
    // Devolveu a vez à interface ao longo do caminho, e o resultado é o mesmo de observar de uma vez.
    expect(vezes).toBeGreaterThan(3);
    expect(JSON.stringify(observada!.registros)).toBe(JSON.stringify(observarGravacao(c, g, { fonte: 'jogador', partida: observada!.partida }).vida.registros));
    const peloLivro = await observarVidaQueAcabou(c, e, undefined);
    expect(peloLivro?.completa).toBe(false);
    expect(peloLivro!.registros.filter((r) => r.tipo === 'escolha').length).toBe(e.historico.filter((h) => h.escolha !== undefined).length);
    // A gravação de outra vida não serve: a observação cai para o livro.
    const outra = robo(4, 'arriscada');
    expect((await observarVidaQueAcabou(c, e, { ...novaGravacao(outra.inicio, novaMemoria()), comandos: outra.comandos }))?.completa).toBe(false);
    expect(lerObservacao().vidas).toHaveLength(3);
  });

  it('o save não muda de formato: a observação fica em outra chave, e o save de antes continua abrindo igual', () => {
    const { e } = robo(3, 'cautelosa');
    const save = lerSave(null, c);
    const texto = escreverSave({ ...save, vida: e });
    expect(texto.includes('observacao')).toBe(false);
    expect(lerSave(texto, c).vida?.historico.length).toBe(e.historico.length);
    // Observar uma vida lida de um save não muda o que o save guarda.
    const lida = lerSave(texto, c).vida!;
    const antesDeObservar = escreverSave({ ...save, vida: lida });
    observarPeloLivro(lida, c, { fonte: 'jogador', partida: 'p' });
    expect(escreverSave({ ...save, vida: lida })).toBe(antesDeObservar);
  });
});

describe('o arquivo exportado', () => {
  it('vai e volta igual, diz a origem e a versão, e o que não é o formato volta como erro', () => {
    const v = compactar(robo(3, 'cautelosa').vida);
    const texto = escreverArquivoDeObservacao([v], new Date('2026-11-17'));
    const lido = lerArquivoDeObservacao(texto);
    expect('vidas' in lido && lido.vidas[0]).toEqual(v);
    expect(JSON.parse(texto).formato).toBe('trajetoria-observacao');
    expect(lerArquivoDeObservacao('não')).toHaveProperty('erro');
    expect(lerArquivoDeObservacao(JSON.stringify({ formato: 'outro', versao: 1, vidas: [] }))).toHaveProperty('erro');
    expect(lerArquivoDeObservacao(JSON.stringify({ formato: 'trajetoria-observacao', versao: 9, vidas: [] }))).toHaveProperty('erro');
  });
});

describe('observar comando a comando à mão', () => {
  it('comecar, observar e terminar fazem o mesmo que jogarObservando', () => {
    const { inicio, comandos, vida } = robo(5, 'aleatoria');
    const e = structuredClone(inicio);
    const o = comecarObservacao(e, c, { fonte: 'robo', partida: 't5', estrategia: 'aleatoria' }, novaMemoria());
    for (const cmd of comandos) observarComando(o, e, c, novaMemoria(), cmd);
    expect(JSON.stringify(o.vida.registros)).toBe(JSON.stringify(vida.registros));
    expect(o.vida.anos.length).toBe(vida.anos.length);
  });
});
