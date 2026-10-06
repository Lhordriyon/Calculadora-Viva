/**
 * Pessoas como entidades: criar personagens no meio da vida e matá-los (com
 * luto e herança). Usado pelos efeitos de storylets e pelas regras anuais.
 */
import type { Conteudo } from './conteudo.ts';
import type { PapelNovo } from './constantes.ts';
import { quemE } from './campos.ts';
import { movimentar } from './economia.ts';
import { ganhar, perder, somar } from './livro.ts';
import { ANOS_UNIAO } from './regras.ts';
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

/** Cria um personagem novo (amor, filho, paixão, bicho) com um começo de vínculo. */
export function criarPersonagem(e: EstadoVida, c: Conteudo, papel: PapelNovo, reg: Mudanca[]): void {
  const idadeEu = e.idade;
  let en: Entidade;
  if (papel === 'pet') {
    const pet = sortear(e.rng, c.mundo.pets);
    en = novaEntidade({ id: 'pet', tipo: 'animal', nome: pet.nome, genero: pet.genero, nascimento: e.ano, vivo: true });
    en.n['saude'] = 85;
  } else {
    const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
    const nascimento = papel === 'filho' ? e.ano : e.ano - Math.max(16, idadeEu + inteiro(e.rng, -4, 4));
    en = novaEntidade({ id: papel, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
    en.n['saude'] = papel === 'filho' ? 85 : 75;
    en.n['vinculo'] = papel === 'filho' ? 80 : papel === 'amor' ? 70 : 55;
    if (papel !== 'filho') en.n['dinheiro'] = 0;
    if (COM_TRACO.has(papel)) darTraco(e, c, en);
  }
  e.entidades[papel] = en;
  if (papel !== 'pet') reg.push({ c: `${papel}.vinculo`, d: en.n['vinculo']! });
}

/** Copia um personagem para outro papel (o primeiro amor vira o amor atual). */
export function promover(e: EstadoVida, c: Conteudo, de: string, para: string, reg: Mudanca[]): void {
  const origem = e.entidades[de];
  if (!origem) return;
  const novo = structuredClone({ ...origem, id: para });
  e.entidades[para] = novo;
  if (COM_TRACO.has(para) && !novo.t['traco']) darTraco(e, c, novo);
  reg.push({ c: `${para}.vinculo`, d: novo.n['vinculo'] ?? 0 });
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
  if (papel !== 'paixao') somar(e, reg, 'eu', 'felicidade', -(3 + vinculo * 0.14));
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
  somar(e, reg, papel, 'dinheiro', -dinheiro);
  if (para === 'eu') {
    // Dos pais e da avó, cada irmão leva a sua parte.
    const irmaos = papel === 'amor' || papel === 'filho' ? 0 : (e.entidades['eu']!.n['irmaos'] ?? 0);
    const parte = dinheiro / (1 + irmaos);
    movimentar(e, reg, { dinheiro: parte });
    ganhar(e, reg, 'eu', 'herdou', causa);
    return parte;
  }
  somar(e, reg, para, 'dinheiro', dinheiro);
  return 0;
}

export { quemE };
