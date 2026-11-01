/**
 * Os capítulos da vida (missão Ω5, I-126): a peneira que lê o livro-razão e reconhece os arcos de uma vida. Cada
 * capítulo é um padrão sobre o livro com começo e fim (duas entradas) e uma frase: o plano que virou conquista (ou que
 * a vida não deixou terminar), o segredo que veio à tona, o amor que voltou, a dívida que virou calote, o favor
 * devolvido e as pazes depois do rompimento. O livro já guarda o porquê de tudo; o capítulo junta os dois momentos que
 * contam uma história e mostra na linha do tempo (no fim do arco) e no cartão da vida.
 *
 * Só lê: nada aqui muda o estado. A mesma pessoa é seguida pelo número dela (o amor que virou ex e voltou é um arco só).
 */
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { FEITOS_DA_REGRA, quemOcupava } from './relacoes.ts';
import { criarRng } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entrada, EstadoVida } from './tipos.ts';

export type TipoDeCapitulo = 'plano' | 'segredo' | 'volta' | 'calote' | 'favor' | 'pazes';

export interface Capitulo {
  tipo: TipoDeCapitulo;
  /** "A casa própria", "O caso", "A volta de Carla", "As pazes com seu pai". */
  titulo: string;
  /** As idades do começo e do fim. */
  de: number;
  ate: number;
  /** As entradas do começo e do fim. */
  comeco: number;
  fim: number;
  /** "Aos 30, você pôs na cabeça comprar a casa própria; aos 41, conquistou a casa própria." */
  texto: string;
}

/** O que a entrada conta, e se é algo que quem joga fez (sem sujeito: "pôs na cabeça…") ou que outra pessoa fez. */
function momento(h: Entrada): { texto: string; doJogador: boolean } | null {
  if (h.escolha?.resumo) return { texto: h.escolha.resumo, doJogador: true };
  if ((h.tipo === 'acao' || h.tipo === 'dinheiro') && h.resumo) return { texto: h.resumo, doJogador: true };
  if (h.ref !== undefined && FEITOS_DA_REGRA.has(h.ref) && h.resumo) return { texto: h.resumo.replace(/^você /, ''), doJogador: true };
  // O fim de um projeto é o que quem joga conseguiu ("conquistou a casa própria").
  if (h.ref?.startsWith('regra:projeto_') && h.resumo) return { texto: h.resumo, doJogador: true };
  if (h.resumo) return { texto: h.resumo, doJogador: false };
  return null;
}

/** "Aos 30, você pôs na cabeça…; aos 41, conquistou…": quem joga é o sujeito, a outra pessoa fala por si. */
function frase(a: Entrada, b: Entrada): string | null {
  const x = momento(a);
  const y = momento(b);
  if (!x || !y) return null;
  const primeira = x.doJogador ? `você ${x.texto}` : x.texto;
  return `Aos ${a.idade}, ${primeira}; aos ${b.idade}, ${y.texto}.`;
}

/** Quem a pessoa é agora, pelo número dela ("sua mãe", "seu ex Pedro"): o texto renderiza com ela de ator. */
function quemPelaChave(e: EstadoVida, chave: string): string | undefined {
  if (!chave.startsWith('#')) return e.entidades[chave] ? chave : undefined;
  const n = Number(chave.slice(1));
  return Object.keys(e.entidades).find((id) => e.entidades[id]!.pessoa === n);
}
/** O texto com a pessoa de ator; ler a vida não gasta o sorteio dela (o rng é outro). */
function chamar(e: EstadoVida, modelo: string, chave?: string): string | null {
  const ator = chave === undefined ? undefined : quemPelaChave(e, chave);
  if (chave !== undefined && !ator) return null;
  return capitalizar(renderizar(modelo, { ...contexto(e, { ator }), rng: criarRng(0) }));
}

/** O papel de um caminho ("mae.rompido" → "mae") e a pessoa que o ocupava naquela entrada. */
function chaveDe(e: EstadoVida, caminho: string, h: Entrada, ganhou: boolean): string {
  const papel = caminho.slice(0, caminho.indexOf('.'));
  // Quem ganha a marca é quem ocupa o papel depois da entrada (o amor que chega junto com o segredo); quem perde, quem
  // ocupava nela (o amor que vira ex na mesma entrada ainda era o amor).
  return quemOcupava(e, papel, ganhou ? h.id + 1 : h.id) ?? papel;
}

/** A entrada em que uma ocupação começou: a última lançada antes do número que ela guardou. */
function entradaAntes(lista: readonly Entrada[], desde: number): Entrada | undefined {
  let lo = 0;
  let hi = lista.length - 1;
  let achada: Entrada | undefined;
  while (lo <= hi) {
    const meio = (lo + hi) >> 1;
    if (lista[meio]!.id < desde) {
      achada = lista[meio];
      lo = meio + 1;
    } else hi = meio - 1;
  }
  return achada;
}

const CAPITULOS = new WeakMap<Entrada, Capitulo[]>();

/** Os capítulos da vida, na ordem em que acabaram (guardados pela última entrada do livro). */
export function capitulosDe(e: EstadoVida, c: Conteudo): Capitulo[] {
  const ultima = e.historico[e.historico.length - 1];
  const pronto = ultima ? CAPITULOS.get(ultima) : undefined;
  if (pronto) return pronto;
  const saida: Capitulo[] = [];
  const porId = new Map(e.historico.map((h) => [h.id, h]));
  const juntar = (tipo: TipoDeCapitulo, titulo: string | null, a: Entrada | undefined, b: Entrada): void => {
    if (!a || !titulo || a.idade > b.idade) return;
    const texto = frase(a, b);
    if (texto) saida.push({ tipo, titulo, de: a.idade, ate: b.idade, comeco: a.id, fim: b.id, texto });
  };

  // Abertos por pessoa: o segredo (por tema), o rompimento, o favor recebido.
  const segredos = new Map<string, Entrada>();
  const rompidos = new Map<string, Entrada>();
  const ajudas = new Map<string, Entrada>();
  for (const h of e.historico) {
    // O plano: o começo é a causa do fim.
    if (h.ref === 'regra:projeto_conquista' || h.ref === 'regra:projeto_semTempo') {
      const def = c.mundo.projetos.find((p) => h.instancia === `projeto:${p.id}#${h.ref!.slice('regra:projeto_'.length)}`);
      const comeco = h.causas?.[0] !== undefined ? porId.get(h.causas[0]) : undefined;
      if (def) juntar('plano', def.com ? (h.ator ? chamar(e, def.nome, quemOcupava(e, h.ator, h.id) ?? h.ator) : null) : chamar(e, def.nome), comeco, h);
    }
    // A dívida que virou calote: o começo é o empréstimo (a causa da regra).
    if (h.ref === 'regra:calote' && h.ator) {
      const comeco = h.causas?.[0] !== undefined ? porId.get(h.causas[0]) : undefined;
      juntar('calote', chamar(e, 'A dívida com {ator.quem}', quemOcupava(e, h.ator, h.id) ?? h.ator), comeco, h);
    }
    // O favor devolvido: quem te deu dinheiro quando você pediu, e você ajudando a mesma pessoa depois.
    if (h.resposta === 'sim' && h.ator && h.mudancas?.some((m) => m.c === 'eu.dinheiro' && (m.d ?? 0) > 0 && m.p === h.ator)) {
      const chave = quemOcupava(e, h.ator, h.id) ?? h.ator;
      if (!ajudas.has(chave)) ajudas.set(chave, h);
    }
    if (h.ref === 'oferecer_ajuda' && h.resposta === 'sim' && h.ator) {
      const chave = quemOcupava(e, h.ator, h.id) ?? h.ator;
      const antes = ajudas.get(chave);
      if (antes) {
        juntar('favor', chamar(e, 'O favor de volta a {ator.quem}', chave), antes, h);
        ajudas.delete(chave);
      }
    }
    for (const m of h.mudancas ?? []) {
      if (m.q === undefined) continue;
      const i = m.c.indexOf('.escondido_');
      if (i > 0 && !m.c.startsWith('eu.')) {
        const tema = m.c.slice(i + '.escondido_'.length);
        const chave = `${chaveDe(e, m.c, h, m.q === 1)}:${tema}`;
        if (m.q === 1) segredos.set(chave, h);
        else {
          const antes = segredos.get(chave);
          segredos.delete(chave);
          const def = c.mundo.segredos.find((s) => s.id === tema);
          // O segredo que acabou calado não é capítulo: ninguém soube.
          if (antes && def && h.ref !== 'regra:segredo_acabou') juntar('segredo', capitalizar(def.nome), antes, h);
        }
      } else if (m.c.endsWith('.rompido') && !m.c.startsWith('eu.')) {
        const chave = chaveDe(e, m.c, h, m.q === 1);
        if (m.q === 1) rompidos.set(chave, h);
        else {
          const antes = rompidos.get(chave);
          rompidos.delete(chave);
          if (antes) juntar('pazes', chamar(e, 'As pazes com {ator.quem}', chave), antes, h);
        }
      }
    }
  }

  // O amor que voltou: a mesma pessoa foi o amor, virou ex e voltou a ser o amor.
  const porPessoa = new Map<number, { papel: string; desde: number }[]>();
  for (const o of e.ocupacoes ?? []) porPessoa.set(o.pessoa, [...(porPessoa.get(o.pessoa) ?? []), { papel: o.papel, desde: o.desde }]);
  for (const [pessoa, lista] of porPessoa) {
    for (let i = 2; i < lista.length; i++) {
      if (lista[i]!.papel !== 'amor' || !lista[i - 1]!.papel.startsWith('ex') || lista[i - 2]!.papel !== 'amor') continue;
      // O fim do namoro costuma ser regra calada do ano: conta a última coisa visível com a pessoa antes dele.
      const chave = `#${pessoa}`;
      const fimDoNamoro = lista[i - 1]!.desde;
      let terminou: Entrada | undefined;
      for (const h of e.historico) {
        if (h.id >= fimDoNamoro) break;
        if (h.ator === 'amor' && momento(h) && quemOcupava(e, 'amor', h.id) === chave) terminou = h;
      }
      const voltou = entradaAntes(e.historico, lista[i]!.desde);
      if (terminou && voltou && terminou.id !== voltou.id) juntar('volta', chamar(e, 'A volta de {ator}', chave), terminou, voltou);
    }
  }

  saida.sort((a, b) => a.ate - b.ate || a.fim - b.fim);
  if (ultima) CAPITULOS.set(ultima, saida);
  return saida;
}

/**
 * Os capítulos que o cartão da vida conta: os mais longos, um de cada tipo antes de repetir, na ordem da vida. Um arco
 * de dez anos conta mais a vida do que um de um ano.
 */
export function capitulosDoCartao(lista: readonly Capitulo[], limite = 3): Capitulo[] {
  const porTamanho = [...lista].sort((a, b) => b.ate - b.de - (a.ate - a.de) || b.ate - a.ate);
  const escolhidos: Capitulo[] = [];
  for (const x of porTamanho) if (escolhidos.length < limite && !escolhidos.some((y) => y.tipo === x.tipo)) escolhidos.push(x);
  for (const x of porTamanho) if (escolhidos.length < limite && !escolhidos.includes(x)) escolhidos.push(x);
  return escolhidos.sort((a, b) => a.de - b.de);
}
