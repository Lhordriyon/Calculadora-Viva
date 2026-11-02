/**
 * A influência de quem joga (bloco ★, I-138), em três esferas tiradas do estado, sem número novo: a pessoal (os laços
 * fortes e a fama), a política (o cargo, a popularidade, o lobby, a mídia própria e a linhagem) e a de negócios (o
 * tamanho do grupo e o truste). Cada esfera muda uma coisa de verdade (a vaga; a eleição e o lobby; o crédito e a
 * compra da concorrente) e tem três conquistas, que entram na linha do tempo em dourado e no cartão da vida
 * (poder.ts › conquistasDoAno).
 */
import type { EstadoVida } from './tipos.ts';

const MIDIA = new Set(['radio', 'jornal', 'emissora']);

/** A pessoal: 6 por pessoa com vínculo de 70 ou mais (viva e por perto) e 0,4 da fama. */
export function influenciaPessoal(e: EstadoVida): number {
  let fortes = 0;
  for (const x of Object.values(e.entidades)) if (x.tipo === 'pessoa' && x.id !== 'eu' && x.vivo !== false && !x.q['ausente'] && (x.n['vinculo'] ?? 0) >= 70) fortes++;
  return Math.min(100, 6 * fortes + 0.4 * (e.entidades['eu']?.n['fama'] ?? 0));
}

/** A política: o cargo (35), 0,35 da popularidade, o lobby (10), 8 por veículo de mídia própria e a linhagem. */
export function influenciaPolitica(e: EstadoVida): number {
  const eu = e.entidades['eu'];
  if (!eu) return 0;
  let midias = 0;
  for (const x of Object.values(e.entidades)) if (x.tipo === 'bem' && MIDIA.has(x.t['item'] ?? '')) midias++;
  const linhagem = eu.q['principe'] || eu.q['herdeiro_regime'] ? 20 : eu.q['filho_de_politico'] ? 8 : 0;
  return Math.min(100, (eu.t['cargo'] ? 35 : 0) + 0.35 * (eu.n['popularidade'] ?? 0) + (eu.q['lobista'] ? 10 : 0) + 8 * midias + linhagem);
}

/** A de negócios: 12 por zero do valor da maior empresa acima de R$ 100 mil, o truste (10) e 5 por empresa a mais. */
export function influenciaNegocios(e: EstadoVida): number {
  let maior = 0;
  let empresas = 0;
  let truste = false;
  for (const x of Object.values(e.entidades)) {
    if (x.tipo !== 'empresa' || x.vivo === false || !((x.n['valor'] ?? 0) > 0)) continue;
    empresas++;
    maior = Math.max(maior, x.n['valor'] ?? 0);
    truste ||= Boolean(x.q['truste']);
  }
  if (empresas === 0) return 0;
  return Math.min(100, Math.max(0, 12 * Math.log10(Math.max(1, maior / 1e5))) + (truste ? 10 : 0) + 5 * Math.min(4, empresas - 1));
}

export type Esfera = 'pessoal' | 'politica' | 'negocios';

export function esferas(e: EstadoVida): Record<Esfera, number> {
  return { pessoal: influenciaPessoal(e), politica: influenciaPolitica(e), negocios: influenciaNegocios(e) };
}

/** As conquistas: três degraus por esfera (40, 70 e 90). O id é a qualidade de quem joga; o epitáfio está em marcas.json. */
export const CONQUISTAS = [
  { id: 'conquista_querida', esfera: 'pessoal', nivel: 40, nome: 'Gente querida no bairro', frase: 'Na padaria, no grupo da família e no velório dos outros, todo mundo conhece e gosta.' },
  { id: 'conquista_referencia', esfera: 'pessoal', nivel: 70, nome: 'Referência na cidade', frase: 'Ninguém decide casamento, negócio ou briga sem antes ouvir o que você acha.' },
  { id: 'conquista_portas', esfera: 'pessoal', nivel: 90, nome: 'Um nome que abre portas', frase: 'Basta dizer que é da sua parte: a porta abre, o café vem e a fila some.' },
  { id: 'conquista_voz', esfera: 'politica', nivel: 40, nome: 'Uma voz que se escuta', frase: 'Quando você fala, vereador anota e jornalista liga de volta.' },
  { id: 'conquista_reis', esfera: 'politica', nivel: 70, nome: 'Quem faz reis', frase: 'Candidato que quer ganhar passa primeiro na sua sala.' },
  { id: 'conquista_trono', esfera: 'politica', nivel: 90, nome: 'O poder por trás do trono', frase: 'Ministro troca, governo cai, e o seu telefone continua tocando.' },
  { id: 'conquista_mercado', esfera: 'negocios', nivel: 40, nome: 'Respeito no mercado', frase: 'Banco dá crédito, fornecedor dá prazo e concorrente dá bom-dia.' },
  { id: 'conquista_magnata', esfera: 'negocios', nivel: 70, nome: 'Magnata do setor', frase: 'O setor inteiro espera o seu movimento para fazer o dele.' },
  { id: 'conquista_potencia', esfera: 'negocios', nivel: 90, nome: 'Uma potência da economia', frase: 'Quando a sua empresa espirra, o PIB pega gripe.' },
] as const satisfies readonly { id: string; esfera: Esfera; nivel: number; nome: string; frase: string }[];

/** A próxima conquista de uma esfera: o nome e quanto falta (a folha Carreira). */
export function proximaConquista(e: EstadoVida, esfera: Esfera): { nome: string; falta: number } | null {
  const eu = e.entidades['eu'];
  const valor = esferas(e)[esfera];
  const q = CONQUISTAS.find((x) => x.esfera === esfera && !eu?.q[x.id]);
  return q ? { nome: q.nome, falta: Math.max(0, Math.ceil(q.nivel - valor)) } : null;
}

/** As conquistas desta vida, pelo nome (o cartão da vida). */
export function conquistasDaVida(e: EstadoVida): string[] {
  const eu = e.entidades['eu'];
  return CONQUISTAS.filter((q) => eu?.q[q.id]).map((q) => q.nome);
}
