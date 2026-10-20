/**
 * O português que o validador confere, além da sintaxe dos modelos:
 * - concordância quebrada: "inteiro{|a}" vira "inteiroa" no feminino (a vogal tem de ficar dentro: inteir{o|a});
 * - preposição antes de trecho que começa com artigo: "fala de {pauta}" com o trecho "a economia" vira "de a economia";
 * - palavra só no masculino num texto sobre quem joga ("você ficou rico") ou sobre um personagem
 *   cujo gênero varia ("{amigo} ficou rico"), de uma lista curta das que já escaparam.
 * Heurística de propósito: pega o erro que já aconteceu sem acusar o texto que fala de outra pessoa
 * ("o seu cliente foi preso"). O que ela não pega, o túnel e as leituras de vida pegam.
 */
import { PAPEIS } from './constantes.ts';
import type { Conteudo, Problema } from './conteudo.ts';
import type { Storylet } from './esquema.ts';

/** Palavras que já apareceram no masculino para jogadoras (C2 #13). */
export const PALAVRAS_COM_GENERO = ['rico', 'sozinho', 'deposto', 'afastado', 'preso', 'convidado', 'promovido', 'herdeiro', 'assessor', 'cidadão'] as const;

/** Uma letra, um "o" ou "e" e a concordância de masculino vazio: "inteiro{|a}", "dele{|a}", "rico{ator:|a}". */
const RE_CONCORDANCIA_QUEBRADA = /\p{L}*[oe]\{(?:\w+:)?\|a\}/gu;
/** "de {x}", "em {x}", "por {x}". */
const RE_PREPOSICAO = /(?<!\p{L})(de|em|por)\s+\{(\w+)\}/giu;
const RE_ARTIGO = /^(o|a|os|as)\s/i;

const LIGACAO = [
  'foi', 'ficou', 'fica', 'ficar', 'fique', 'virou', 'vira', 'virar', 'é', 'era', 'ser', 'está', 'estava', 'estar', 'esteja',
  'continua', 'continuou', 'continuar', 'voltou', 'volta', 'voltar', 'chegou', 'chega', 'chegar', 'saiu', 'sai', 'sair',
  'ir', 'vai', 'seguiu', 'segue', 'como', 'passou\\s+o\\s+\\p{L}+', 'passar\\s+o\\s+\\p{L}+',
].join('|');
const ADVERBIOS = ['não', 'nunca', 'já', 'também', 'ainda', 'mais', 'só', 'quase', 'até', 'logo', 'bem', 'meio', 'muito', 'tão', 'completamente', 'de\\s+novo'].join('|');
const PALAVRA = `(${PALAVRAS_COM_GENERO.join('|')})(?![\\p{L}{|])`;
/** Ligação e a palavra: "foi (mais) preso", "ficou (um) rico", "como herdeiro". */
const PREDICADO = `(?:${LIGACAO})\\s+(?:(?:${ADVERBIOS}|um|uma)\\s+)*${PALAVRA}`;
/** "você (não) foi preso". */
const RE_VOCE = new RegExp(`(?<!\\p{L})você\\s+(?:(?:${ADVERBIOS})\\s+)*${PREDICADO}`, 'iu');
/** A oração sem sujeito, que no jogo é quem joga: "Está sozinho", "foi convidado a entrar". */
const RE_ELIPSE = new RegExp(`^\\s*(?:(?:${ADVERBIOS})\\s+)*${PREDICADO}`, 'iu');
/** O resumo e o botão falam de quem joga desde o verbo: "gastou como herdeiro", "torrou dinheiro como herdeiro". */
const RE_DO_JOGADOR = new RegExp(`^\\s*((?:\\p{L}+\\s+){1,2}?)${PREDICADO}`, 'iu');
/** Palavras que, antes da ligação, põem outro sujeito na oração ("viu um cliente ser preso", "quem ficou rico"). */
const OUTRO_SUJEITO = new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'seu', 'sua', 'seus', 'suas', 'esse', 'essa', 'este', 'esta', 'aquele', 'aquela', 'quem', 'que', 'ninguém', 'ele', 'ela', 'eles', 'elas', 'todo', 'toda', 'cada']);
/** "{amigo} ficou rico": o personagem (um papel ou o ator do storylet). */
const RE_PERSONAGEM = new RegExp(`\\{(ator|${PAPEIS.join('|')})\\}\\s+(?:(?:${ADVERBIOS})\\s+)*${PREDICADO}`, 'giu');
/** Papéis de gênero fixo e masculino (a mãe e a avó são mulheres: "{mae} ficou rico" também está errado). */
const MASCULINOS = new Set(['pai']);

type Reporter = (onde: string, mensagem: string) => void;

/** O feminino sugerido: rico → ric{o|a}, assessor → assessor{|a}, cidadão → cidad{ão|ã}. */
export function comGenero(palavra: string): string {
  if (palavra.endsWith('ão')) return `${palavra.slice(0, -2)}{ão|ã}`;
  if (palavra.endsWith('o')) return `${palavra.slice(0, -1)}{o|a}`;
  return `${palavra}{|a}`;
}

/** Uma versão do texto para cada opção das alternâncias (a k-ésima de todas), para conferir cada opção ao menos uma vez. */
function variantes(texto: string): string[] {
  const alternancias = [...texto.matchAll(/\[([^[\]]*)\]/g)].map((m) => (m[1] ?? '').split('|').length);
  const n = Math.max(1, ...alternancias);
  const saida: string[] = [];
  for (let k = 0; k < n; k++) {
    saida.push(
      texto.replace(/\[([^[\]]*)\]/g, (_m, corpo: string) => {
        const opcoes = corpo.split('|');
        return opcoes[Math.min(k, opcoes.length - 1)]!;
      }),
    );
  }
  return saida;
}

/** As orações de um texto (o ponto, o ponto e vírgula e os dois-pontos separam). */
function oracoes(texto: string): string[] {
  return texto.split(/[.!?;:]+/);
}

/** Recusa "inteiro{|a}" (vira "inteiroa"). Vale para qualquer texto. */
export function conferirConcordancia(texto: string, onde: string, erro: Reporter): void {
  for (const m of texto.matchAll(RE_CONCORDANCIA_QUEBRADA)) {
    const quebrado = m[0];
    const corpo = quebrado.slice(0, quebrado.indexOf('{'));
    const papel = /\{(\w+):/.exec(quebrado)?.[1];
    const certo = `${corpo.slice(0, -1)}{${papel ? `${papel}:` : ''}${corpo.slice(-1)}|a}`;
    const personagem = papel ? '' : ' (ou {papel:...}, se a palavra for de um personagem)';
    erro(onde, `concordância quebrada: "${quebrado}" vira "${corpo}a" no feminino; use ${certo}${personagem}`);
  }
}

/** Recusa "de {x}" quando o trecho x pode começar com artigo ("de a economia"). */
export function conferirPreposicoes(texto: string, trechos: Storylet['trechos'], onde: string, erro: Reporter): void {
  if (!trechos) return;
  for (const m of texto.matchAll(RE_PREPOSICAO)) {
    const opcoes = trechos[m[2]!];
    if (!opcoes) continue;
    const comArtigo = opcoes.flatMap((t) => variantes(t.texto)).find((t) => RE_ARTIGO.test(t));
    if (comArtigo) {
      erro(onde, `"${m[0]}" com o trecho "${comArtigo.slice(0, 30)}" vira "${m[1]} ${comArtigo.split(' ')[0]}": tire a preposição do texto ou reescreva a frase`);
    }
  }
}

/**
 * Recusa palavra da lista só no masculino quando o texto fala de quem joga ou de um personagem cujo gênero varia.
 * `doJogador`: o resumo, o botão e o epitáfio, que falam de quem joga desde o verbo.
 */
export function conferirGenero(texto: string, onde: string, erro: Reporter, doJogador: boolean, atores?: readonly string[]): void {
  const acusadas = new Set<string>();
  const acusar = (palavra: string, de: string): void => {
    const chave = `${palavra}:${de}`;
    if (acusadas.has(chave)) return;
    acusadas.add(chave);
    erro(onde, `"${palavra}" só no masculino num texto sobre ${de}; use ${de === 'quem joga' ? comGenero(palavra) : comGenero(palavra).replace('{', `{${de.slice(1, -1)}:`)}`);
  };
  for (const v of variantes(texto)) {
    for (const oracao of oracoes(v)) {
      const voce = RE_VOCE.exec(oracao) ?? RE_ELIPSE.exec(oracao);
      if (voce) acusar(voce[1]!.toLowerCase(), 'quem joga');
      if (doJogador) {
        const m = RE_DO_JOGADOR.exec(oracao);
        const antes = (m?.[1] ?? '').trim().toLowerCase().split(/\s+/);
        if (m && !antes.some((p) => OUTRO_SUJEITO.has(p))) acusar(m[2]!.toLowerCase(), 'quem joga');
      }
      for (const p of oracao.matchAll(RE_PERSONAGEM)) {
        const papel = p[1]!;
        const papeis = papel === 'ator' ? (atores ?? []) : [papel];
        if (papeis.length > 0 && papeis.every((x) => MASCULINOS.has(x))) continue;
        acusar(p[2]!.toLowerCase(), `{${papel}}`);
      }
    }
  }
}

/** Todos os textos de um valor qualquer (para a concordância, que vale em todo lugar). */
function cadaTexto(v: unknown, onde: string, f: (texto: string, onde: string) => void): void {
  if (typeof v === 'string') f(v, onde);
  else if (Array.isArray(v)) v.forEach((x, i) => cadaTexto(x, `${onde}[${i}]`, f));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) cadaTexto(x, `${onde}.${k}`, f);
}

/** Os textos de um storylet, cada um dizendo se fala de quem joga desde o verbo (resumo, botão, rótulo). */
function textosComPapel(s: Storylet): { texto: string; campo: string; doJogador: boolean }[] {
  const t: { texto: string; campo: string; doJogador: boolean }[] = [
    { texto: s.texto, campo: 'texto', doJogador: false },
    { texto: s.resumo, campo: 'resumo', doJogador: true },
  ];
  if (s.rotulo) t.push({ texto: s.rotulo, campo: 'rotulo', doJogador: true });
  for (const [nome, opcoes] of Object.entries(s.trechos ?? {})) opcoes.forEach((x, i) => t.push({ texto: x.texto, campo: `trechos.${nome}[${i}]`, doJogador: false }));
  for (const [nome, r] of [['sucesso', s.sucesso], ['fracasso', s.fracasso]] as const) {
    if (!r) continue;
    t.push({ texto: r.texto, campo: nome, doJogador: false });
    if (r.resumo) t.push({ texto: r.resumo, campo: `${nome} › resumo`, doJogador: true });
  }
  (s.escolhas ?? []).forEach((esc, i) => {
    const o = `escolha ${i + 1}`;
    t.push({ texto: esc.texto, campo: `${o} › texto`, doJogador: true }, { texto: esc.resumo, campo: `${o} › resumo`, doJogador: true });
    if (esc.bloqueio) t.push({ texto: esc.bloqueio, campo: `${o} › bloqueio`, doJogador: false });
    for (const [nome, r] of [['sucesso', esc.sucesso], ['fracasso', esc.fracasso], ['resultado', esc.resultado]] as const) {
      if (!r) continue;
      t.push({ texto: r.texto, campo: `${o} › ${nome}`, doJogador: false });
      if (r.resumo) t.push({ texto: r.resumo, campo: `${o} › ${nome} › resumo`, doJogador: true });
    }
  });
  return t;
}

export function verificarPortugues(c: Conteudo, problemas: Problema[]): void {
  const erro: Reporter = (onde, mensagem) => problemas.push({ nivel: 'erro', onde, mensagem });
  for (const s of c.storylets) {
    const onde = `${c.arquivoDe.get(s.id) ?? '?'} › ${s.id}`;
    for (const { texto, campo, doJogador } of textosComPapel(s)) {
      const o = `${onde} › ${campo}`;
      conferirPreposicoes(texto, s.trechos, o, erro);
      conferirGenero(texto, o, erro, doJogador, s.ator);
    }
  }
  c.linhas.forEach((l, i) => conferirGenero(l.texto, `linhas.json[${i}]`, erro, false));
  c.mortes.forEach((m, i) => conferirGenero(m.causa, `mortes.json[${i}]`, erro, false));
  for (const [id, m] of Object.entries(c.marcas)) if (m.epitafio) conferirGenero(m.epitafio, `marcas.json › ${id}`, erro, true);
  // A concordância quebrada vale em todo texto, inclusive no mundo.
  const concordancia = (texto: string, onde: string): void => conferirConcordancia(texto, onde, erro);
  for (const s of c.storylets) cadaTexto(s, `${c.arquivoDe.get(s.id) ?? '?'} › ${s.id}`, concordancia);
  cadaTexto(c.linhas, 'linhas.json', concordancia);
  cadaTexto(c.mortes, 'mortes.json', concordancia);
  cadaTexto(c.marcas, 'marcas.json', concordancia);
  cadaTexto(c.mundo, 'mundo.json', concordancia);
}
