/**
 * Pessoas como entidades: criar personagens no meio da vida e matá-los (com
 * luto e herança). Usado pelos efeitos de storylets e pelas regras anuais.
 */
import type { Conteudo } from './conteudo.ts';
import type { PapelNovo } from './constantes.ts';
import { quemE } from './campos.ts';
import { movimentar } from './economia.ts';
import { ganhar, somar } from './livro.ts';
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

/** Cria um personagem novo (amor, filho, paixão, bicho) com um começo de vínculo. */
export function criarPersonagem(e: EstadoVida, c: Conteudo, papel: PapelNovo, reg: Mudanca[]): void {
  const idadeEu = e.idade;
  let en: Entidade;
  if (papel === 'pet') {
    const pet = sortear(e.rng, c.mundo.pets);
    en = novaEntidade({ id: 'pet', tipo: 'animal', nome: pet.nome, genero: pet.genero, nascimento: e.ano, vivo: true });
    en.n['saude'] = 85;
    en.n['vinculo'] = 80;
  } else {
    const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
    const nascimento = papel === 'filho' ? e.ano : e.ano - Math.max(16, idadeEu + inteiro(e.rng, -4, 4));
    en = novaEntidade({ id: papel, tipo: 'pessoa', nome: nomeLivre(e, c, genero), genero, nascimento, vivo: true });
    en.n['saude'] = papel === 'filho' ? 85 : 75;
    en.n['vinculo'] = papel === 'filho' ? 80 : papel === 'amor' ? 70 : 55;
    if (papel !== 'filho') en.n['dinheiro'] = 0;
  }
  e.entidades[papel] = en;
  reg.push({ c: `${papel}.vinculo`, d: en.n['vinculo']! });
}

/** Copia um personagem para outro papel (o primeiro amor vira o amor atual). */
export function promover(e: EstadoVida, de: string, para: string, reg: Mudanca[]): void {
  const origem = e.entidades[de];
  if (!origem) return;
  e.entidades[para] = structuredClone({ ...origem, id: para });
  reg.push({ c: `${para}.vinculo`, d: origem.n['vinculo'] ?? 0 });
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
  const dinheiro = en.n['dinheiro'] ?? 0;
  const para = herdeiro(e, papel);
  if (dinheiro <= 0 || !para) return 0;
  somar(e, reg, papel, 'dinheiro', -dinheiro);
  if (para === 'eu') {
    movimentar(e, reg, { dinheiro });
    ganhar(e, reg, 'eu', 'herdou', causa);
    return dinheiro;
  }
  somar(e, reg, para, 'dinheiro', dinheiro);
  return 0;
}

export { quemE };
