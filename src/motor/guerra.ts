/**
 * A defesa e a guerra (bloco E). As Forças Armadas são um estoque, a capacidade (`pais.defesa`, de 0 a 100), que anda
 * devagar para onde a política de defesa e a tecnologia levam (pais.ts › alvosDoPais) e ganha com os sistemas de
 * armamento que quem governa encomenda pela folha País (mundo.json › sistemas): a encomenda vai para a dívida na hora,
 * e a entrega, anos depois, soma à capacidade, com a encomenda de causa; o equipamento envelhece de volta para o alvo.
 *
 * A capacidade dissuade. Com um país de fora que já sanciona o Brasil e a relação no chão, a guerra pode começar, e a
 * chance dobra a cada 15 pontos de capacidade abaixo de 50. A guerra é uma qualidade do país de fora (`fora.guerra`,
 * com a notícia do começo de causa) e é um processo, não um ato: cada ano dela custa crescimento, inflação, gasto,
 * gente e aprovação (pais.ts › anoDoPais). A partir do segundo ano, ela acaba (mais depressa no ano seguinte a um
 * pedido de paz de quem governa; de cansaço, no oitavo), em vitória, derrota ou cessar-fogo, pela capacidade daqui
 * contra a força de lá. Cada notícia aponta o que a levou até ali: a decisão que esfriou a relação, a que desmobilizou
 * o quartel, a encomenda, o começo, o pedido de paz. Ninguém morre num storylet de guerra: ela mata pela estatística
 * do país e deixa a dívida, a inflação e quem voltou diferente.
 */
import { FILHOS } from './constantes.ts';
import { idadeDe, inimigoDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { contexto } from './contexto.ts';
import { causaDaRelacao, defEstrangeiro, parceirosDe } from './diplomacia.ts';
import type { DefSistema, Noticia } from './esquema.ts';
import { definirNumero, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { decisaoQueDeixou, governoAtual, jogadorGoverna } from './pais.ts';
import { DEFESA } from './regras.ts';
import { aleatorio, sortear } from './rng.ts';
import { capitalizar, renderizar } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

/** A encomenda de um sistema fica no livro com esta ref mais o id dele; o pedido de paz, com a outra. */
export const REF_DA_ENCOMENDA = 'defesa:sistema:';
export const REF_DA_PAZ = 'defesa:paz';
/** Quem tem de 18 a 30 anos é convocado quando a guerra começa. */
const IDADE_DA_CONVOCACAO = [18, 30] as const;

export type Desfecho = 'vitoria' | 'derrota' | 'cessarFogo';

export function defSistema(c: Conteudo, id: string): DefSistema | undefined {
  return c.mundo.sistemas.find((s) => s.id === id);
}

/** A encomenda mais demorada: até onde o livro precisa ser lido para achar o que ainda não chegou. */
const prazoMaximo = (c: Conteudo): number => Math.max(...c.mundo.sistemas.map((s) => s.anos));

/** As encomendas que ainda não chegaram, por sistema: a entrada da encomenda e o ano da entrega. */
export function encomendasPendentes(e: EstadoVida, c: Conteudo): Map<string, { entrada: number; entrega: number }> {
  const m = new Map<string, { entrada: number; entrega: number }>();
  const limite = e.ano - prazoMaximo(c);
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < limite) break;
    if (!h.ref?.startsWith(REF_DA_ENCOMENDA)) continue;
    const def = defSistema(c, h.ref.slice(REF_DA_ENCOMENDA.length));
    if (def && h.ano + def.anos > e.ano && !m.has(def.id)) m.set(def.id, { entrada: h.id, entrega: h.ano + def.anos });
  }
  return m;
}

/** A entrada com essa ref (ou com o prefixo dela) que o país viveu neste ano, se houve. */
function noAno(e: EstadoVida, ref: string, ano = e.ano): number | null {
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < ano) break;
    if (h.ano === ano && h.ref?.startsWith(ref)) return h.id;
  }
  return null;
}

/** Há quantos anos o país viveu a última entrada com essa ref (ou com o prefixo dela): Infinity se não foi nos últimos `limite`. */
function anosDesde(e: EstadoVida, ref: string, limite: number): number {
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < e.ano - limite) break;
    if (h.ref?.startsWith(ref)) return e.ano - h.ano;
  }
  return Infinity;
}

/** A chance de a guerra começar num ano em que ela pode começar: a de sempre, dobrando a cada 15 pontos de capacidade abaixo de 50 (a metade acima), até o teto. */
export function chanceDeGuerra(capacidade: number): number {
  const g = DEFESA.guerra;
  return Math.min(g.teto, g.chance * 2 ** ((50 - capacidade) / g.dobra));
}

/**
 * Quem ameaça o Brasil neste ano: o país de fora que sanciona e com a relação abaixo do limite (o mais frio, se há
 * mais de um), com a chance da guerra. Null em guerra, logo depois de uma ou sem ninguém assim.
 */
export function ameacaDeGuerra(e: EstadoVida): { pais: Entidade; chance: number } | null {
  if (inimigoDe(e) || anosDesde(e, 'guerra:', DEFESA.guerra.intervalo) < DEFESA.guerra.intervalo) return null;
  let pior: Entidade | null = null;
  for (const en of parceirosDe(e)) {
    const rel = en.n['relacao'] ?? 50;
    if (en.q['sancao'] && rel < DEFESA.guerra.relacao && (!pior || rel < (pior.n['relacao'] ?? 50))) pior = en;
  }
  return pior ? { pais: pior, chance: chanceDeGuerra(e.entidades['pais']?.n['defesa'] ?? 50) } : null;
}

/** A notícia do começo da guerra em curso (a causa do que ela faz com o país), se está no livro desta vida. */
export function comecoDaGuerra(e: EstadoVida): number | null {
  const q = inimigoDe(e)?.q['guerra'];
  if (!q || q.causa === null) return null;
  for (let k = e.historico.length - 1; k >= 0 && e.historico[k]!.ano >= q.ano; k--) {
    const h = e.historico[k]!;
    if (h.id === q.causa) return h.ref?.startsWith('guerra:') ? h.id : null;
  }
  return null;
}

/**
 * Pela razão entre a capacidade daqui e a força de lá: a chance de vitória e a de derrota no ano em que a guerra
 * acaba (o resto é cessar-fogo). A folha País mostra antes.
 */
export function chancesDoFim(e: EstadoVida, c: Conteudo, inimigo: Entidade): Record<Desfecho, number> {
  const capacidade = e.entidades['pais']?.n['defesa'] ?? 50;
  const forca = defEstrangeiro(c, inimigo.id)?.forca ?? 50;
  const razao = capacidade + forca > 0 ? capacidade / (capacidade + forca) : 0.5;
  const decisiva = DEFESA.fim.decisiva;
  return { vitoria: decisiva * razao, derrota: decisiva * (1 - razao), cessarFogo: 1 - decisiva };
}

/** Uma notícia da guerra, numa entrada visível do livro, com o país de fora como ator. */
function noticia(e: EstadoVida, c: Conteudo, tipo: Noticia, parceiro: string, causas: number[]): ReturnType<typeof novaEntrada> {
  const n = c.mundo.noticias[tipo];
  const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `guerra:${tipo}:${parceiro}`, ator: parceiro, texto: '' });
  const ctx = contexto(e, { ator: parceiro });
  entrada.texto = capitalizar(renderizar(sortear(e.rng, n.textos), ctx));
  entrada.resumo = renderizar(n.resumo, ctx);
  if (causas.length > 0) entrada.causas = causas;
  return entrada;
}

/** A aprovação de quem governa anda na hora (a de quem joga, quando é quem joga, é a popularidade dele). */
function aprovar(e: EstadoVida, reg: Mudanca[], delta: number): void {
  if (delta === 0) return;
  if (governoAtual(e) === 'voce') somar(e, reg, 'pais', 'aprovacao', somar(e, reg, 'eu', 'popularidade', delta));
  else somar(e, reg, 'pais', 'aprovacao', delta);
}

/** O que chegou neste ano: cada encomenda de `anos` atrás vira uma entrada que soma a capacidade dela, com a encomenda de causa. */
function entregar(e: EstadoVida, c: Conteudo): void {
  const chegam: { def: DefSistema; encomenda: number }[] = [];
  const limite = e.ano - prazoMaximo(c);
  for (let k = e.historico.length - 1; k >= 0; k--) {
    const h = e.historico[k]!;
    if (h.ano < limite) break;
    if (!h.ref?.startsWith(REF_DA_ENCOMENDA)) continue;
    const def = defSistema(c, h.ref.slice(REF_DA_ENCOMENDA.length));
    if (def && h.ano + def.anos === e.ano) chegam.unshift({ def, encomenda: h.id });
  }
  for (const { def, encomenda } of chegam) {
    const ctx = contexto(e, { ator: 'pais' });
    const entrada = novaEntrada(e, { tipo: 'mundo', causa: 'regra', ref: `defesa:entrega:${def.id}`, ator: 'pais', texto: capitalizar(renderizar(def.entrega.texto, ctx)), resumo: renderizar(def.entrega.resumo, ctx), causas: [encomenda] });
    const reg: Mudanca[] = [];
    somar(e, reg, 'pais', 'defesa', def.capacidade);
    lancar(e, entrada, reg);
  }
}

/**
 * A guerra começa: a notícia aponta a decisão que esfriou a relação e, com o quartel abaixo do limite, a que o
 * desmobilizou. O país se une no primeiro ano, e a convocação chega a quem tem de 18 a 30 anos e ao filho mais velho
 * nessa idade.
 */
function comecar(e: EstadoVida, c: Conteudo, en: Entidade): void {
  const def = defEstrangeiro(c, en.id)!;
  const causas = causaDaRelacao(e, c, def, 'baixo');
  if ((e.entidades['pais']?.n['defesa'] ?? 50) < DEFESA.guerra.desarmado) {
    const desmobilizou = decisaoQueDeixou(e, 'defesa', 0, 15);
    if (desmobilizou !== null && !causas.includes(desmobilizou)) causas.push(desmobilizou);
  }
  const entrada = noticia(e, c, 'guerra', en.id, causas);
  const reg: Mudanca[] = [];
  ganhar(e, reg, en.id, 'guerra', entrada.id);
  aprovar(e, reg, DEFESA.ano.uniao);
  lancar(e, entrada, reg);
  const eu = e.entidades['eu']!;
  const [de, ate] = IDADE_DA_CONVOCACAO;
  // Quem tem cargo (presidente, deputado, rei) não é convocado: manda, ou faz de conta.
  if (e.idade >= de && e.idade <= ate && !eu.t['cargo'] && c.porId.has('a_convocacao')) e.agenda.push({ evento: 'a_convocacao', ano: e.ano, origem: entrada.id, ator: en.id });
  let filho: Entidade | null = null;
  for (const id of FILHOS) {
    const f = e.entidades[id];
    if (!f || f.vivo === false) continue;
    const idade = idadeDe(e, f);
    if (idade >= de && idade <= ate && (!filho || idade > idadeDe(e, filho))) filho = f;
  }
  if (filho && c.porId.has('filho_convocado')) e.agenda.push({ evento: 'filho_convocado', ano: e.ano, origem: entrada.id, ator: filho.id });
}

/**
 * O ano da guerra em curso: a partir do segundo ano, ela pode acabar (mais depressa no ano seguinte a um pedido de
 * paz; de cansaço, no oitavo), e o desfecho sai da capacidade daqui contra a força de lá. A notícia do fim aponta o
 * começo e o pedido de paz.
 */
function talvezAcabar(e: EstadoVida, c: Conteudo, inimigo: Entidade): void {
  const q = inimigo.q['guerra']!;
  const anos = e.ano - q.ano;
  if (anos < 1) return;
  const f = DEFESA.fim;
  const pediu = noAno(e, REF_DA_PAZ, e.ano - 1);
  const cansou = anos >= f.maximo;
  if (!cansou && aleatorio(e.rng) >= f.chance + (pediu !== null ? f.paz : 0)) return;
  const chances = chancesDoFim(e, c, inimigo);
  const sorte = aleatorio(e.rng);
  const desfecho: Desfecho = cansou ? 'cessarFogo' : sorte < chances.vitoria ? 'vitoria' : sorte < chances.vitoria + chances.derrota ? 'derrota' : 'cessarFogo';
  const causas = [comecoDaGuerra(e), pediu].filter((x): x is number => x !== null);
  const entrada = noticia(e, c, desfecho, inimigo.id, causas);
  const reg: Mudanca[] = [];
  perder(e, reg, inimigo.id, 'guerra');
  definirNumero(e, reg, inimigo.id, 'relacao', f.relacao[desfecho]);
  // Quem recuou e quem perdeu viram a página; no cessar-fogo, ninguém assina nada, e a sanção continua.
  if (desfecho !== 'cessarFogo') perder(e, reg, inimigo.id, 'sancao');
  if (desfecho === 'derrota') somar(e, reg, 'pais', 'divida', f.reparacao);
  aprovar(e, reg, f.aprovacao[desfecho]);
  lancar(e, entrada, reg);
}

/**
 * O ano da defesa (depois do mundo lá fora, antes do país): o que foi encomendado e chega, a guerra em curso, que pode
 * acabar, ou a que pode começar.
 */
export function regraDaGuerra(e: EstadoVida, c: Conteudo): void {
  if (!e.entidades['pais']) return;
  entregar(e, c);
  const inimigo = inimigoDe(e);
  if (inimigo) {
    talvezAcabar(e, c, inimigo);
    return;
  }
  const ameaca = ameacaDeGuerra(e);
  if (ameaca && aleatorio(e.rng) < ameaca.chance) comecar(e, c, ameaca.pais);
}

// ---------------------------------------------------------------- governar a defesa: a folha País

export type OperacaoDefesa = { tipo: 'sistema'; sistema: string } | { tipo: 'paz' };

export function ehOperacaoDeDefesa(op: { tipo: string }): op is OperacaoDefesa {
  return op.tipo === 'sistema' || op.tipo === 'paz';
}

export function motivoParaNaoOperarDefesa(e: EstadoVida, c: Conteudo, op: OperacaoDefesa): string | null {
  if (governoAtual(e) !== 'voce') {
    if (jogadorGoverna(e, c)) return 'a posse é no ano que vem';
    return op.tipo === 'paz' ? 'só quem governa pede a paz' : 'só quem governa encomenda armamento';
  }
  if (op.tipo === 'paz') {
    if (!inimigoDe(e)) return 'o país não está em guerra';
    if (noAno(e, REF_DA_PAZ) !== null) return 'um pedido de paz por ano';
    return null;
  }
  const def = defSistema(c, op.sistema);
  if (!def) return 'escolha o sistema';
  const tec = e.entidades['pais']?.n['tecnologia'] ?? 50;
  if (def.tecnologia !== undefined && tec < def.tecnologia) return `pede tecnologia ${def.tecnologia} (o país tem ${Math.round(tec)})`;
  const pendente = encomendasPendentes(e, c).get(def.id);
  if (pendente) return `a encomenda anterior chega em ${pendente.entrega}`;
  if (noAno(e, REF_DA_ENCOMENDA) !== null) return 'uma encomenda por ano';
  return null;
}

/** A encomenda (a dívida sobe na hora) ou o pedido de paz (a relação com o outro lado esquenta um pouco), já conferidos. */
export function operarDefesa(e: EstadoVida, c: Conteudo, op: OperacaoDefesa, reg: Mudanca[]): { texto: string; resumo: string; causas?: number[] } {
  if (op.tipo === 'paz') {
    const inimigo = inimigoDe(e)!;
    somar(e, reg, inimigo.id, 'relacao', DEFESA.paz.relacao);
    const n = c.mundo.noticias.paz;
    const ctx = contexto(e, { ator: inimigo.id });
    const comeco = comecoDaGuerra(e);
    return { texto: capitalizar(renderizar(sortear(e.rng, n.textos), ctx)), resumo: renderizar(n.resumo, ctx), ...(comeco !== null ? { causas: [comeco] } : {}) };
  }
  const def = defSistema(c, op.sistema)!;
  somar(e, reg, 'pais', 'divida', def.custo);
  const ctx = contexto(e, { ator: 'pais' });
  return { texto: capitalizar(renderizar(def.encomenda.texto, ctx)), resumo: renderizar(def.encomenda.resumo, ctx) };
}
