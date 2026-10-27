/**
 * Pessoas como entidades: criar personagens no meio da vida e matá-los (com
 * luto e herança). Usado pelos efeitos de storylets e pelas regras anuais.
 */
import type { Conteudo } from './conteudo.ts';
import { EXES, FILHOS, IRMAOS, ehEx, ehFilho, ehIrmao, type PapelQueChega } from './constantes.ts';
import { quemE } from './campos.ts';
import { movimentar } from './economia.ts';
import { ganhar, perder, somar, somarRepartido } from './livro.ts';
import { quemEraQuemMudou } from './relacoes.ts';
import { aoMorrerQuemReina } from './sucessao.ts';
import { ANOS_REMORSO, ANOS_UNIAO, MAGOA_REMORSO } from './regras.ts';
import { aleatorio, inteiro, sortear, type Rng } from './rng.ts';
import type { Entidade, EstadoVida, Genero, Mudanca } from './tipos.ts';

export function novaEntidade(parcial: Partial<Entidade> & Pick<Entidade, 'id' | 'tipo' | 'nome'>): Entidade {
  return { n: {}, t: {}, q: {}, ...parcial };
}

/** Nome que ninguém da vida ainda usa. */
export function nomeLivre(e: EstadoVida, c: Conteudo, genero: Genero, rng: Rng = e.rng): string {
  const usados = new Set(Object.values(e.entidades).map((x) => x.nome));
  let nome = sortear(rng, c.mundo.nomes[genero]);
  for (let i = 0; i < 30 && usados.has(nome); i++) nome = sortear(rng, c.mundo.nomes[genero]);
  return nome;
}

/** Papéis que nascem com traço (o traço muda o vínculo, a saúde e as iniciativas). */
const COM_TRACO = new Set(['amor', 'filho', 'amigo', 'irmao']);

/** Sorteia um traço de personagem e aplica os ajustes de vínculo e saúde. */
function darTraco(e: EstadoVida, c: Conteudo, en: Entidade): void {
  const traco = sortear(e.rng, c.mundo.tracos);
  en.t['traco'] = traco.id;
  en.n['vinculo'] = Math.max(5, Math.min(95, (en.n['vinculo'] ?? 50) + traco.vinculo));
  en.n['saude'] = Math.max(20, Math.min(98, (en.n['saude'] ?? 75) + traco.saude));
}

// ---------------------------------------------------------------- a identidade de pessoas

/** Um número novo de pessoa (a identidade não muda com o papel). */
export function novaPessoa(e: EstadoVida): number {
  const n = e.proximaPessoa ?? 1;
  e.proximaPessoa = n + 1;
  return n;
}

/** A pessoa passa a ocupar o papel a partir da entrada `desde` (pessoa 0: o papel fica vago). */
function ocupar(e: EstadoVida, papel: string, pessoa: number, desde: number): void {
  (e.ocupacoes ??= []).push({ papel, pessoa, desde });
}

/**
 * Quando a ocupação muda: a partir da próxima entrada. O que a entrada de agora mudou ainda é de quem estava no papel
 * (a conversa que fez o ex voltar é lembrança do ex, mesmo que ele saia dela como o amor).
 */
const daqui = (e: EstadoVida): number => e.proximoId;

/**
 * Dá número e ocupação a quem ainda não tem: as pessoas e os bichos do nascimento (desde a entrada 0) e da vida nova
 * do herdeiro (desde a abertura). Quem chega depois ganha os dois ao ocupar o papel.
 */
export function registrarPessoas(e: EstadoVida, desde: number): void {
  for (const en of Object.values(e.entidades)) {
    if ((en.tipo !== 'pessoa' && en.tipo !== 'animal') || en.id === 'eu' || en.pessoa !== undefined) continue;
    en.pessoa = novaPessoa(e);
    ocupar(e, en.id, en.pessoa, desde);
  }
}

/** Os números da pessoa saem de um papel (`saida`) e entram noutro (`nascimento`, o vínculo como o chip mostra). */
function sairDoPapel(papel: string, en: Entidade, reg: Mudanca[]): void {
  for (const [campo, v] of Object.entries(en.n)) if (v) reg.push({ c: `${papel}.${campo}`, d: -v, r: 'saida' });
}
function entrarNoPapel(papel: string, en: Entidade, reg: Mudanca[]): void {
  for (const [campo, v] of Object.entries(en.n)) if (v) reg.push({ c: `${papel}.${campo}`, d: v, ...(campo === 'vinculo' ? {} : { r: 'nascimento' }) });
}
/** A mesma pessoa troca de papel: os números saem de um e entram no outro, marcados `papel` (não é chegada nem afeto). */
function trocarDePapel(de: string, para: string, en: Entidade, reg: Mudanca[]): void {
  for (const [campo, v] of Object.entries(en.n)) if (v) reg.push({ c: `${de}.${campo}`, d: -v, r: 'papel' }, { c: `${para}.${campo}`, d: v, r: 'papel' });
}

/**
 * A mesma pessoa muda de papel (o amor que vira ex, o ex que volta a ser o amor), com tudo no livro, e a ocupação
 * guarda que é a mesma pessoa: a memória e a opinião dela continuam.
 */
export function moverPessoa(e: EstadoVida, de: string, para: string, reg: Mudanca[]): void {
  const en = e.entidades[de];
  if (!en || de === para || e.entidades[para]) return;
  const desde = daqui(e);
  const pessoa = garantirPessoa(e, de, en);
  trocarDePapel(de, para, en, reg);
  delete e.entidades[de];
  en.id = para;
  e.entidades[para] = en;
  ocupar(e, de, 0, desde);
  ocupar(e, para, pessoa, desde);
}

/** Sem número (o save de antes da identidade), o papel inteiro de antes era desta pessoa: o passado muda de dono. */
function garantirPessoa(e: EstadoVida, papel: string, en: Entidade): number {
  if (en.pessoa === undefined) {
    en.pessoa = novaPessoa(e);
    ocupar(e, papel, en.pessoa, 0);
    quemEraQuemMudou();
  }
  return en.pessoa;
}

/**
 * A pessoa do trabalho entra para a vida: vira o amor (quem estava no lugar, vivo, vira ex) ou o melhor amigo (o lugar
 * precisa estar vago: o amigo de antes morreu; quem morreu sai do lugar, e a lembrança fica no livro).
 */
function virarDaFamilia(e: EstadoVida, de: string, para: 'amor' | 'amigo', reg: Mudanca[]): void {
  const antes = e.entidades[para];
  if (para === 'amor' && antes && arquivarEx(e, reg) === undefined) partir(e, 'amor', reg);
  if (para === 'amigo' && antes) {
    if (antes.vivo !== false) return;
    partir(e, 'amigo', reg);
  }
  moverPessoa(e, de, para, reg);
}

/** Alguém chega à vida num papel (o colega e o chefe do emprego novo), com número e ocupação, e tudo no livro. */
export function chegar(e: EstadoVida, papel: string, en: Entidade, reg: Mudanca[]): void {
  ocuparPapel(e, papel, en, reg);
}

/** Alguém sai da vida (o colega do emprego que acabou): os números saem do papel, e o lugar fica vago. */
export function partir(e: EstadoVida, papel: string, reg: Mudanca[]): void {
  const en = e.entidades[papel];
  if (!en) return;
  sairDoPapel(papel, en, reg);
  delete e.entidades[papel];
  ocupar(e, papel, 0, daqui(e));
}

/**
 * O ex volta a ser o amor, a mesma pessoa, com a memória dela. Quem estava no lugar do amor troca de lugar com ele
 * (vivo, vira ex, e as vontades da vida a dois ficam para trás); morto, sai da vida.
 */
function voltarComOEx(e: EstadoVida, de: string, reg: Mudanca[]): void {
  const volta = e.entidades[de];
  const antes = e.entidades['amor'];
  if (!volta) return;
  if (!antes) return moverPessoa(e, de, 'amor', reg);
  if (antes.vivo === false || antes.tipo !== 'pessoa') {
    sairDoPapel('amor', antes, reg);
    delete e.entidades['amor'];
    ocupar(e, 'amor', 0, daqui(e));
    return moverPessoa(e, de, 'amor', reg);
  }
  esquecerVontades(e, 'amor', reg);
  const desde = daqui(e);
  const quemVolta = garantirPessoa(e, de, volta);
  const quemSai = garantirPessoa(e, 'amor', antes);
  trocarDePapel(de, 'amor', volta, reg);
  trocarDePapel('amor', de, antes, reg);
  volta.id = 'amor';
  antes.id = de;
  e.entidades['amor'] = volta;
  e.entidades[de] = antes;
  ocupar(e, 'amor', quemVolta, desde);
  ocupar(e, de, quemSai, desde);
}

/** As vontades eram da vida a dois: saem enquanto a pessoa ainda é o amor (mundo.json › vontades). */
function esquecerVontades(e: EstadoVida, papel: string, reg: Mudanca[]): void {
  const en = e.entidades[papel];
  if (en) for (const q of Object.keys(en.q)) if (q.startsWith('quer_')) perder(e, reg, papel, q);
}

/** O primeiro lugar de ex livre; sem lugar, quem foi embora há mais tempo sai da vida (o lugar vai para o novo). */
function lugarDeEx(e: EstadoVida, reg: Mudanca[]): string {
  const livre = EXES.find((x) => !e.entidades[x]);
  if (livre) return livre;
  const desde = (id: string): number => Math.max(-1, ...(e.ocupacoes ?? []).filter((o) => o.papel === id && o.pessoa !== 0).map((o) => o.desde));
  const slot = [...EXES].sort((a, b) => desde(a) - desde(b))[0]!;
  sairDoPapel(slot, e.entidades[slot]!, reg);
  delete e.entidades[slot];
  ocupar(e, slot, 0, daqui(e));
  return slot;
}

/**
 * O amor que foi embora continua existindo: vira ex. As vontades eram da vida a dois e ficam para trás. Devolve o
 * lugar de ex, ou undefined quando não havia amor vivo para arquivar.
 */
export function arquivarEx(e: EstadoVida, reg: Mudanca[]): string | undefined {
  const en = e.entidades['amor'];
  if (!en || en.vivo === false || en.tipo !== 'pessoa') return undefined;
  esquecerVontades(e, 'amor', reg);
  const slot = lugarDeEx(e, reg);
  moverPessoa(e, 'amor', slot, reg);
  // A segunda chance era com esta pessoa: acabou junto.
  perder(e, reg, 'eu', 'voltou_com_o_ex');
  return slot;
}

/**
 * Troca quem ocupa o papel, com tudo no livro: quem sai deixa os números
 * (marcados `saida`) e quem chega entra com os seus (o vínculo como o chip
 * mostra; o resto marcado `nascimento`). Assim, para toda entidade, o começo
 * mais a soma das variações dá o estado de agora. O amor de antes, vivo, vira ex
 * (não some); a pessoa que chega ganha número e ocupação.
 */
function ocuparPapel(e: EstadoVida, papel: string, en: Entidade, reg: Mudanca[]): void {
  const antes = e.entidades[papel];
  const virouEx = papel === 'amor' && antes !== undefined && antes !== en && antes.pessoa !== en.pessoa && arquivarEx(e, reg) !== undefined;
  if (antes && !virouEx) sairDoPapel(papel, antes, reg);
  e.entidades[papel] = en;
  entrarNoPapel(papel, en, reg);
  if (en.pessoa === undefined) en.pessoa = novaPessoa(e);
  ocupar(e, papel, en.pessoa, daqui(e));
}

/**
 * Cria um personagem novo (amor, filho, paixão, bicho) com um começo de vínculo e devolve o id dele. Um filho novo
 * não toma o lugar de outro: vai para o próximo lugar livre (`filho2`…), e `eu.filhos` conta. Com os quatro lugares
 * ocupados, não nasce ninguém (devolve undefined).
 */
export function criarPersonagem(e: EstadoVida, c: Conteudo, papel: PapelQueChega, reg: Mudanca[]): string | undefined {
  const idadeEu = e.idade;
  const id = papel === 'filho' ? FILHOS.find((f) => !e.entidades[f]) : papel === 'irmao' ? IRMAOS.find((x) => !e.entidades[x]) : papel;
  if (!id) return undefined;
  // Quem nasce agora (o filho, o irmão mais novo) tem a idade de um bebê.
  const bebe = papel === 'filho' || papel === 'irmao';
  let en: Entidade;
  if (papel === 'pet') {
    const pet = sortear(e.rng, c.mundo.pets);
    en = novaEntidade({ id, tipo: 'animal', nome: pet.nome, genero: pet.genero, nascimento: e.ano, vivo: true });
    en.n['saude'] = 85;
  } else {
    const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
    const nascimento = bebe ? e.ano : e.ano - Math.max(16, idadeEu + inteiro(e.rng, -4, 4));
    en = novaEntidade({ id, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
    en.n['saude'] = bebe ? 85 : 75;
    en.n['vinculo'] = papel === 'filho' ? 80 : papel === 'amor' ? 70 : papel === 'irmao' ? 60 : 55;
    if (papel !== 'filho') en.n['dinheiro'] = 0;
    if (COM_TRACO.has(papel)) darTraco(e, c, en);
  }
  ocuparPapel(e, id, en, reg);
  if (papel === 'filho') somar(e, reg, 'eu', 'filhos', 1);
  if (papel === 'irmao') somar(e, reg, 'eu', 'irmaos', 1);
  return id;
}

/**
 * Copia um personagem para outro papel (a paixão vira o amor). O ex que volta não é cópia: é a mesma pessoa que sai
 * do lugar de ex e volta a ser o amor, com a memória dela; quem estava no lugar do amor vai para o lugar de ex.
 */
export function promover(e: EstadoVida, c: Conteudo, de: string, para: string, reg: Mudanca[]): void {
  const origem = e.entidades[de];
  if (!origem) return;
  if (ehEx(de) && para === 'amor') {
    voltarComOEx(e, de, reg);
    return;
  }
  // O colega (ou o chefe) que vira o amor ou o melhor amigo é a mesma pessoa, com a memória dela.
  if ((de === 'colega' || de === 'chefe') && (para === 'amor' || para === 'amigo')) {
    virarDaFamilia(e, de, para, reg);
    return;
  }
  const novo = structuredClone({ ...origem, id: para });
  if (COM_TRACO.has(para) && !novo.t['traco']) darTraco(e, c, novo);
  ocuparPapel(e, para, novo, reg);
}

/** Para onde vai o dinheiro de quem morre: cônjuge, depois descendentes; o resto vai para quem joga. */
function herdeiro(e: EstadoVida, papel: string): string {
  const vivo = (id: string): boolean => e.entidades[id]?.vivo === true;
  if (papel === 'mae' && vivo('pai') && !e.entidades['pai']!.q['ausente']) return 'pai';
  if (papel === 'pai' && vivo('mae') && !e.entidades['pai']!.q['ausente']) return 'mae';
  if (papel === 'avo') return vivo('mae') ? 'mae' : vivo('pai') ? 'pai' : 'eu';
  if (papel === 'amigo' || papel === 'paixao' || papel === 'pet') return '';
  // O irmão, o ex, o colega e o chefe têm a família deles: o dinheiro fica com ela.
  if (ehIrmao(papel) || ehEx(papel) || papel === 'colega' || papel === 'chefe') return '';
  return 'eu';
}

/**
 * Um personagem morre: qualidade `faleceu` (causa = a entrada que conta a
 * morte), luto proporcional ao vínculo e herança. Devolve o valor herdado
 * por quem joga (0 se nada).
 */
export function morrerPersonagem(e: EstadoVida, papel: string, reg: Mudanca[], causa: number): number {
  const en = e.entidades[papel];
  if (!en || en.vivo === false) return 0;
  en.vivo = false;
  en.morte = e.ano;
  ganhar(e, reg, papel, 'faleceu', causa);
  // Quem reinava era o pai ou a mãe de quem está na fila: a sucessão vem agora, ou aos 18 (sucessao.ts).
  if (papel === 'mae' || papel === 'pai') aoMorrerQuemReina(e, en, causa);
  const vinculo = en.n['vinculo'] ?? 50;
  // Quem é do trabalho dói menos, e não deixa remorso nem despedida de família.
  if (papel === 'colega' || papel === 'chefe') somar(e, reg, 'eu', 'felicidade', -(1 + vinculo * 0.06));
  else if (papel !== 'paixao') {
    somar(e, reg, 'eu', 'felicidade', -(3 + vinculo * 0.14));
    // A relação pesa no luto: morrer magoado, longe há anos ou com uma vontade guardada (mundo.json › vontades: as
    // qualidades `quer_…`) deixa remorso; quem estava perto se despediu.
    const magoa = en.n['magoa'] ?? 0;
    const longe = en.n['sem_contato'] ?? 0;
    const vontade = Object.entries(en.q).some(([q, v]) => q.startsWith('quer_') && v.v > 0);
    // A distância do ex é o normal de quem se separou: só a mágoa que ficou deixa remorso.
    const longeDemais = !ehEx(papel) && longe >= ANOS_REMORSO;
    if (en.tipo === 'pessoa' && vinculo >= 25 && (magoa >= MAGOA_REMORSO || longeDemais || vontade)) {
      somar(e, reg, 'eu', 'felicidade', -(3 + magoa * 0.06 + Math.min(longe, 10) * 0.4 + (vontade ? 2 : 0)));
      perder(e, reg, 'eu', 'despediu');
      perder(e, reg, 'eu', 'remorso');
      ganhar(e, reg, 'eu', 'remorso', causa);
    } else if (en.tipo === 'pessoa' && vinculo >= 55 && magoa < 15 && longe === 0) {
      perder(e, reg, 'eu', 'despediu');
      ganhar(e, reg, 'eu', 'despediu', causa);
    }
  }
  if (papel === 'amor') {
    // O namoro acaba com a morte; casamento ou união longa vira viuvez.
    const namoro = e.entidades['eu']!.q['namoro'];
    const uniao = namoro !== undefined && e.idade - namoro.idade >= ANOS_UNIAO;
    perder(e, reg, 'eu', 'namoro');
    perder(e, reg, 'eu', 'voltou_com_o_ex');
    if (perder(e, reg, 'eu', 'casado') || uniao) ganhar(e, reg, 'eu', 'viuvo', causa);
  }
  const dinheiro = en.n['dinheiro'] ?? 0;
  const para = herdeiro(e, papel);
  if (dinheiro <= 0 || !para) return 0;
  if (para === 'eu') {
    // Dos pais e da avó, cada irmão leva a sua parte: o vivo, na conta dele; a do irmão que já morreu e deixou filhos,
    // e a de quem é só um número (o save de antes dos irmãos), vai para os parentes.
    const herdam = papel === 'amor' || ehFilho(papel) ? [] : IRMAOS.filter((x) => e.entidades[x] && e.entidades[x]!.vivo !== false);
    const representados = papel === 'amor' || ehFilho(papel) ? 0 : IRMAOS.filter((x) => e.entidades[x]?.vivo === false && (e.entidades[x]!.n['filhos'] ?? 0) > 0).length;
    const soNumero = papel === 'amor' || ehFilho(papel) ? 0 : Math.max(0, (e.entidades['eu']!.n['irmaos'] ?? 0) - IRMAOS.filter((x) => e.entidades[x]).length);
    const parte = dinheiro / (1 + herdam.length + representados + soNumero);
    const dosParentes = parte * (representados + soNumero);
    somarRepartido(e, reg, papel, 'dinheiro', -dinheiro, [
      { d: -parte, p: 'eu' },
      ...herdam.map((x) => ({ d: -parte, p: x })),
      ...(dosParentes > 0 ? [{ d: -dosParentes, p: 'parentes' }] : []),
    ]);
    movimentar(e, reg, { dinheiro: parte, contraparte: papel });
    for (const x of herdam) somar(e, reg, x, 'dinheiro', parte, undefined, papel);
    ganhar(e, reg, 'eu', 'herdou', causa);
    return parte;
  }
  somar(e, reg, papel, 'dinheiro', -dinheiro, undefined, para);
  somar(e, reg, para, 'dinheiro', dinheiro, undefined, papel);
  return 0;
}

export { quemE };
