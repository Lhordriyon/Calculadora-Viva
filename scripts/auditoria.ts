/**
 * npm run auditoria: a integridade da simulação, ano a ano, em dinastias (missão Ascensão AAA, I-148).
 *
 * O túnel mede a experiência em 10.000 vidas e confere as contas entrada por entrada. Esta auditoria é mais estreita e
 * mais funda: joga dinastias (as quatro estratégias, as origens comuns e as extremas, até G gerações com quem herda) e
 * confere depois de cada ano o estado inteiro (src/motor/invariantes.ts), as contas de cada entrada nova, e a coerência
 * do tempo e da família que só aparece entre gerações:
 *
 * - o velório vem no ano da morte ou no seguinte (a marca herdada não pode esperar a idade de quem morreu);
 * - quem age num storylet de personagem está vivo;
 * - o par de quem é adulto é adulto;
 * - os irmãos nascem com a mãe viva e em idade de ter filho;
 * - no fim de cada vida, o livro fecha: para toda entidade, o começo mais a soma das variações dá o estado final.
 *
 * Sai com 1 se achar qualquer problema (o `npm run verificar` a roda antes do túnel).
 *
 * Uso: npm run auditoria -- [--dinastias=160] [--geracoes=4] [--extremos] [--md=ARQUIVO]
 *   --extremos  imprime o mínimo e o máximo de cada campo do país, das contas, de quem joga e das empresas
 */
import { writeFileSync } from 'node:fs';
import { carregarConteudo } from './disco.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { motivoParaNaoOperar, operar } from '../src/motor/carteira.ts';
import { conferirContas } from '../src/motor/contas.ts';
import { continuarComoHerdeiro, herdeiroPossivel } from '../src/motor/herdeiro.ts';
import { conferirEstado } from '../src/motor/invariantes.ts';
import { dinheiroDoMundo } from '../src/motor/moeda.ts';
import type { EscolhaOrigem } from '../src/motor/origem.ts';
import { decidir, decidirAcao, decidirDinheiro, ESTRATEGIAS, type Estrategia } from '../src/motor/robos.ts';
import { criarRng } from '../src/motor/rng.ts';
import type { EstadoVida } from '../src/motor/tipos.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';

const args = process.argv.slice(2);
const opcao = (nome: string, padrao: number): number => Number(args.find((a) => a.startsWith(`--${nome}=`))?.split('=')[1] ?? padrao);
const DINASTIAS = opcao('dinastias', 160);
const GERACOES = opcao('geracoes', 4);
const EXTREMOS = args.includes('--extremos');
const MD = args.find((a) => a.startsWith('--md='))?.slice(5);

const c = carregarConteudo();
/** As origens: metade sorteada, e as pontas (a miséria, a fortuna, a coroa, o regime), onde os números são extremos. */
const ORIGENS: readonly (EscolhaOrigem | undefined)[] = [undefined, undefined, undefined, undefined, { classe: 0 }, { classe: 6 }, { classe: 7 }, { linhagem: 'realeza' }, { linhagem: 'regime' }];

const achados = new Map<string, { n: number; exemplos: string[] }>();
function achar(tipo: string, exemplo: string): void {
  const a = achados.get(tipo) ?? { n: 0, exemplos: [] };
  a.n++;
  if (a.exemplos.length < 3) a.exemplos.push(exemplo);
  achados.set(tipo, a);
}

const extremos = new Map<string, { min: number; max: number }>();
function medir(chave: string, v: number): void {
  const x = extremos.get(chave);
  if (!x) extremos.set(chave, { min: v, max: v });
  else {
    if (v < x.min) x.min = v;
    if (v > x.max) x.max = v;
  }
}

/** O tipo do problema sem os números da vida (para somar os iguais): "empresa3" vira "empresa", o valor some. */
const tipoDe = (problema: string): string => problema.replace(/\b(bem|ctr|tit|prm|empresa|filho|irmao|ex|amigo)\d+[a-z]?\b/g, '$1').replace(/[-−]?\d[\d.,e+]*/g, 'N');

let anosConferidos = 0;
let entradasConferidas = 0;
let restoMaximo = 0;
let lutos = 0;
let lutosNaHora = 0;

interface Foto {
  inicio: Map<string, Record<string, number>>;
  conferidas: number;
}

function conferirAno(e: EstadoVida, foto: Foto, onde: string): void {
  anosConferidos++;
  for (const p of conferirEstado(e, c)) achar(tipoDe(p), `${onde}: ${p}`);
  if (e.entidades['mercado']) restoMaximo = Math.max(restoMaximo, Math.abs(dinheiroDoMundo(e)));
  const eu = e.entidades['eu']!;
  for (let i = foto.conferidas; i < e.historico.length; i++) {
    const h = e.historico[i]!;
    entradasConferidas++;
    for (const p of conferirContas(e, h)) achar(`contas da entrada: ${tipoDe(p)}`, `${onde} (${h.tipo} ${h.ref ?? ''}): ${p}`);
    for (const m of h.mudancas ?? []) if (m.d !== undefined && !Number.isFinite(m.d)) achar('variação não finita no livro', `${onde}: ${m.c}`);
    if (h.idade > e.idade) achar('entrada do futuro', `${onde}: a entrada ${h.id} diz ${h.idade} anos`);
    if (i > 0 && e.historico[i - 1]!.ano > h.ano) achar('anos fora de ordem no livro', `${onde}: ${e.historico[i - 1]!.ano} antes de ${h.ano}`);
    // Quem age num storylet de personagem está vivo; o velório vem no ano da morte ou no seguinte.
    const ator = h.ator ? e.entidades[h.ator] : undefined;
    if (h.ref === 'luto' && ator?.morte !== undefined) {
      lutos++;
      if (h.ano - ator.morte <= 1) lutosNaHora++;
      else achar('velório com dois anos ou mais de atraso', `${onde}: ${h.ator} morreu em ${ator.morte}, o velório veio em ${h.ano}`);
    } else if (h.tipo === 'npc' && h.ref && !h.ref.startsWith('regra:') && ator && ator.vivo === false && ator.morte !== undefined && ator.morte < h.ano) {
      achar(`morto agindo: ${h.ref}`, `${onde}: ${h.ator} morreu em ${ator.morte}, e a entrada é de ${h.ano}: ${h.texto.slice(0, 80)}`);
    }
  }
  foto.conferidas = e.historico.length;
  if (!e.vivo) return;
  // O par de quem é adulto é adulto (e ninguém namora criança).
  const amor = e.entidades['amor'];
  if (amor && amor.vivo !== false && amor.nascimento !== undefined && (eu.q['namoro'] || eu.q['casado'])) {
    const idadeDoPar = e.ano - amor.nascimento;
    if (idadeDoPar < 12 || (e.idade >= 20 && idadeDoPar < 18)) achar('par menor de idade com quem é adulto', `${onde}: o par tem ${idadeDoPar} e quem joga, ${e.idade}`);
  }
  // Os irmãos nascem com a mãe viva e em idade de ter filho.
  const mae = e.entidades['mae'];
  for (const en of Object.values(e.entidades)) {
    if (!/^irmao\d*$/.test(en.id) || en.nascimento === undefined || mae?.nascimento === undefined) continue;
    const naEpoca = en.nascimento - mae.nascimento;
    if (naEpoca < 13 || naEpoca > 50) achar('irmão nascido com a mãe fora dos 13 aos 50', `${onde}: ${en.id}, com a mãe aos ${naEpoca}`);
    if (mae.morte !== undefined && en.nascimento > mae.morte) achar('irmão nascido depois da morte da mãe', `${onde}: ${en.id} em ${en.nascimento}, e a mãe morreu em ${mae.morte}`);
  }
  if (EXTREMOS) {
    for (const en of Object.values(e.entidades)) {
      const grupo = en.tipo === 'jurisdicao' || en.tipo === 'conta' || en.tipo === 'lugar' ? en.id : en.id === 'eu' ? 'eu' : en.tipo === 'empresa' ? 'empresa' : null;
      if (grupo) for (const [campo, v] of Object.entries(en.n)) medir(`${grupo}.${campo}`, v);
    }
  }
}

/** O livro fecha: para toda entidade, o que ela tinha no começo mais a soma das variações é o que ela tem no fim. */
function conferirOLivro(e: EstadoVida, foto: Foto, onde: string): void {
  const soma = new Map<string, number>();
  for (const h of e.historico) for (const m of h.mudancas ?? []) if (m.d !== undefined) soma.set(m.c, (soma.get(m.c) ?? 0) + m.d);
  for (const en of Object.values(e.entidades)) {
    for (const [campo, fim] of Object.entries(en.n)) {
      const esperado = (foto.inicio.get(en.id)?.[campo] ?? 0) + (soma.get(`${en.id}.${campo}`) ?? 0);
      if (Math.abs(esperado - fim) > Math.max(2, Math.abs(fim) * 1e-9)) achar(`o livro não fecha: ${tipoDe(`${en.id}.${campo}`)}`, `${onde}: ${en.id}.${campo} deveria ser ${esperado.toFixed(2)} e é ${fim.toFixed(2)}`);
    }
  }
}

function viver(e: EstadoVida, estrategia: Estrategia, semente: number, onde: string): void {
  const robo = criarRng(semente * 31 + 77);
  const foto: Foto = { inicio: new Map(Object.values(e.entidades).map((en) => [en.id, { ...en.n }])), conferidas: 0 };
  conferirAno(e, foto, `${onde}, no começo`);
  while (e.vivo) {
    if (e.pendente) {
      escolher(e, c, decidir(estrategia, e, c, robo));
      continue;
    }
    for (const op of decidirDinheiro(estrategia, e, c, robo)) if (motivoParaNaoOperar(e, c, op) === null) operar(e, c, op);
    for (let a = decidirAcao(estrategia, e, c, robo); a && e.vivo && !e.pendente; a = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) agir(e, c, a.verbo, a.escolha);
    if (e.vivo && !e.pendente) {
      avancarAno(e, c);
      conferirAno(e, foto, `${onde}, aos ${e.idade}`);
    }
  }
  conferirAno(e, foto, `${onde}, no fim`);
  conferirOLivro(e, foto, onde);
}

const t0 = performance.now();
let vidas = 0;
let anos = 0;
const quemHerda: Record<string, number> = {};
for (let i = 0; i < DINASTIAS; i++) {
  const estrategia = ESTRATEGIAS[i % ESTRATEGIAS.length]!;
  const origem = ORIGENS[Math.floor(i / ESTRATEGIAS.length) % ORIGENS.length];
  const semente = 900_000 + i * 7919;
  let e = nascer(c, { semente, ano: 2026, ...(origem ? { origem } : {}) });
  for (let g = 1; g <= GERACOES; g++) {
    const onde = `semente ${semente}, ${estrategia}${origem ? `, ${JSON.stringify(origem)}` : ''}, geração ${g}`;
    const idadeNoComeco = e.idade;
    try {
      viver(e, estrategia, semente + g, onde);
    } catch (erro) {
      achar('a vida lançou um erro', `${onde}, aos ${e.idade}: ${(erro as Error).stack?.split('\n').slice(0, 3).join(' | ')}`);
      break;
    }
    vidas++;
    anos += e.idade - idadeNoComeco;
    const herdeiro = g < GERACOES ? herdeiroPossivel(e, c) : null;
    if (!herdeiro) break;
    quemHerda[herdeiro.parentesco] = (quemHerda[herdeiro.parentesco] ?? 0) + 1;
    try {
      e = continuarComoHerdeiro(e, c);
    } catch (erro) {
      achar('a passagem para quem herda lançou um erro', `${onde}: ${(erro as Error).message}`);
      break;
    }
  }
}

const seg = (performance.now() - t0) / 1000;
const total = [...achados.values()].reduce((s, a) => s + a.n, 0);
const num = (n: number): string => n.toLocaleString('pt-BR');
const linhas: string[] = [];
linhas.push(`# Auditoria da simulação`);
linhas.push('');
linhas.push(`${num(DINASTIAS)} dinastias de até ${GERACOES} gerações: ${num(vidas)} vidas, ${num(anos)} anos jogados, ${num(anosConferidos)} conferências do estado e ${num(entradasConferidas)} entradas do livro, em ${seg.toFixed(0)} s.`);
linhas.push('');
linhas.push(`| Medida | Valor |`);
linhas.push(`|---|---|`);
linhas.push(`| Problemas achados | ${num(total)} |`);
linhas.push(`| Maior resto do dinheiro do mundo (deveria ser zero) | R$ ${restoMaximo.toFixed(2).replace('.', ',')} |`);
linhas.push(`| Velórios no ano da morte ou no seguinte | ${num(lutosNaHora)} de ${num(lutos)} |`);
linhas.push(
  `| Quem continuou a história | ${
    Object.entries(quemHerda)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ${num(n)}`)
      .join(', ') || 'ninguém'
  } |`,
);
if (total > 0) {
  linhas.push('');
  linhas.push(`## Problemas`);
  for (const [tipo, a] of [...achados].sort((x, y) => y[1].n - x[1].n)) {
    linhas.push('');
    linhas.push(`### ${tipo}: ${num(a.n)}`);
    for (const x of a.exemplos) linhas.push(`- ${x}`);
  }
}
if (EXTREMOS) {
  linhas.push('');
  linhas.push(`## Extremos (mínimo e máximo de cada campo)`);
  linhas.push('');
  linhas.push('```');
  for (const [k, x] of [...extremos].sort((a, b) => a[0].localeCompare(b[0]))) linhas.push(`${k.padEnd(28)} ${x.min.toPrecision(6).padStart(14)} ${x.max.toPrecision(6).padStart(14)}`);
  linhas.push('```');
}
const texto = linhas.join('\n');
console.log(texto);
if (MD) writeFileSync(MD, texto + '\n');
console.log(total === 0 ? '\n✓ nenhum problema' : `\n✗ ${num(total)} problemas`);
process.exit(total === 0 ? 0 : 1);
