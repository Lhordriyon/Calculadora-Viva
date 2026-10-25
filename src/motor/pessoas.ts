/**
 * Pessoas como entidades: criar personagens no meio da vida e matá-los (com
 * luto e herança). Usado pelos efeitos de storylets e pelas regras anuais.
 */
import type { Conteudo } from './conteudo.ts';
import { FILHOS, ehFilho, type PapelNovo } from './constantes.ts';
import { quemE } from './campos.ts';
import { movimentar } from './economia.ts';
import { ganhar, perder, somar, somarRepartido } from './livro.ts';
import { ANOS_REMORSO, ANOS_UNIAO, MAGOA_REMORSO } from './regras.ts';
import { aleatorio, inteiro, sortear } from './rng.ts';
import type { Entidade, EstadoVida, Genero, Mudanca } from './tipos.ts';

export function novaEntidade(parcial: Partial<Entidade> & Pick<Entidade, 'id' | 'tipo' | 'nome'>): Entidade {
  return { n: {}, t: {}, q: {}, ...parcial };
}

/** Nome que ninguém da vida ainda usa. */
export function nomeLivre(e: EstadoVida, c: Conteudo, genero: Genero): string {
  const usados = new Set(Object.values(e.entidades).map((x) => x.nome));
  let nome = sortear(e.rng, c.mundo.nomes[genero]);
  for (let i = 0; i < 30 && usados.has(nome); i++) nome = sortear(e.rng, c.mundo.nomes[genero]);
  return nome;
}

/** Papéis que nascem com traço (o traço muda o vínculo, a saúde e as iniciativas). */
const COM_TRACO = new Set(['amor', 'filho', 'amigo']);

/** Sorteia um traço de personagem e aplica os ajustes de vínculo e saúde. */
function darTraco(e: EstadoVida, c: Conteudo, en: Entidade): void {
  const traco = sortear(e.rng, c.mundo.tracos);
  en.t['traco'] = traco.id;
  en.n['vinculo'] = Math.max(5, Math.min(95, (en.n['vinculo'] ?? 50) + traco.vinculo));
  en.n['saude'] = Math.max(20, Math.min(98, (en.n['saude'] ?? 75) + traco.saude));
}

/**
 * Troca quem ocupa o papel, com tudo no livro: quem sai deixa os números
 * (marcados `saida`) e quem chega entra com os seus (o vínculo como o chip
 * mostra; o resto marcado `nascimento`). Assim, para toda entidade, o começo
 * mais a soma das variações dá o estado de agora.
 */
function ocuparPapel(e: EstadoVida, papel: string, en: Entidade, reg: Mudanca[]): void {
  const antes = e.entidades[papel];
  if (antes) for (const [campo, v] of Object.entries(antes.n)) if (v) reg.push({ c: `${papel}.${campo}`, d: -v, r: 'saida' });
  e.entidades[papel] = en;
  for (const [campo, v] of Object.entries(en.n)) if (v) reg.push({ c: `${papel}.${campo}`, d: v, ...(campo === 'vinculo' ? {} : { r: 'nascimento' }) });
}

/**
 * Cria um personagem novo (amor, filho, paixão, bicho) com um começo de vínculo e devolve o id dele. Um filho novo
 * não toma o lugar de outro: vai para o próximo lugar livre (`filho2`…), e `eu.filhos` conta. Com os quatro lugares
 * ocupados, não nasce ninguém (devolve undefined).
 */
export function criarPersonagem(e: EstadoVida, c: Conteudo, papel: PapelNovo, reg: Mudanca[]): string | undefined {
  const idadeEu = e.idade;
  const id = papel === 'filho' ? FILHOS.find((f) => !e.entidades[f]) : papel;
  if (!id) return undefined;
  let en: Entidade;
  if (papel === 'pet') {
    const pet = sortear(e.rng, c.mundo.pets);
    en = novaEntidade({ id, tipo: 'animal', nome: pet.nome, genero: pet.genero, nascimento: e.ano, vivo: true });
    en.n['saude'] = 85;
  } else {
    const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
    const nascimento = papel === 'filho' ? e.ano : e.ano - Math.max(16, idadeEu + inteiro(e.rng, -4, 4));
    en = novaEntidade({ id, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
    en.n['saude'] = papel === 'filho' ? 85 : 75;
    en.n['vinculo'] = papel === 'filho' ? 80 : papel === 'amor' ? 70 : 55;
    if (papel !== 'filho') en.n['dinheiro'] = 0;
    if (COM_TRACO.has(papel)) darTraco(e, c, en);
  }
  ocuparPapel(e, id, en, reg);
  if (papel === 'filho') somar(e, reg, 'eu', 'filhos', 1);
  return id;
}

/** Copia um personagem para outro papel (o primeiro amor vira o amor atual). */
export function promover(e: EstadoVida, c: Conteudo, de: string, para: string, reg: Mudanca[]): void {
  const origem = e.entidades[de];
  if (!origem) return;
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
  const vinculo = en.n['vinculo'] ?? 50;
  if (papel !== 'paixao') {
    somar(e, reg, 'eu', 'felicidade', -(3 + vinculo * 0.14));
    // A relação pesa no luto: morrer magoado, longe há anos ou com uma vontade guardada (mundo.json › vontades: as
    // qualidades `quer_…`) deixa remorso; quem estava perto se despediu.
    const magoa = en.n['magoa'] ?? 0;
    const longe = en.n['sem_contato'] ?? 0;
    const vontade = Object.entries(en.q).some(([q, v]) => q.startsWith('quer_') && v.v > 0);
    if (en.tipo === 'pessoa' && vinculo >= 25 && (magoa >= MAGOA_REMORSO || longe >= ANOS_REMORSO || vontade)) {
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
    if (perder(e, reg, 'eu', 'casado') || uniao) ganhar(e, reg, 'eu', 'viuvo', causa);
  }
  const dinheiro = en.n['dinheiro'] ?? 0;
  const para = herdeiro(e, papel);
  if (dinheiro <= 0 || !para) return 0;
  if (para === 'eu') {
    // Dos pais e da avó, cada irmão leva a sua parte (os irmãos não são personagens: a parte deles vai para os parentes).
    const irmaos = papel === 'amor' || ehFilho(papel) ? 0 : (e.entidades['eu']!.n['irmaos'] ?? 0);
    const parte = dinheiro / (1 + irmaos);
    somarRepartido(e, reg, papel, 'dinheiro', -dinheiro, [
      { d: -parte, p: 'eu' },
      { d: -(dinheiro - parte), p: 'parentes' },
    ]);
    movimentar(e, reg, { dinheiro: parte, contraparte: papel });
    ganhar(e, reg, 'eu', 'herdou', causa);
    return parte;
  }
  somar(e, reg, papel, 'dinheiro', -dinheiro, undefined, para);
  somar(e, reg, para, 'dinheiro', dinheiro, undefined, papel);
  return 0;
}

export { quemE };
