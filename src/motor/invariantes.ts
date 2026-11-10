/**
 * Os invariantes do estado (missão Ascensão AAA, I-148): o que tem de valer depois de qualquer passo do motor, seja qual
 * for a vida. A conferência das contas (contas.ts) olha entrada por entrada; esta olha o estado inteiro, de uma vez:
 *
 * - todo número é finito, todo campo numérico está declarado (campos.ts) e dentro do limite dele;
 * - o dinheiro do mundo soma zero (moeda.ts), e a dívida de quem joga e o financiado dos bens batem com os contratos;
 * - o tempo fecha: o ano é o nascimento mais a idade, ninguém nasce no futuro nem morre antes de nascer, quem morreu tem
 *   o ano da morte, pai e mãe são de uma geração antes e os filhos, de uma depois;
 * - a empresa não tem caixa negativo, a parte de quem joga fica entre zero e tudo, e a clientela cabe no mercado do setor.
 *
 * Não muda nada: devolve os problemas (vazio quando tudo vale). Quem usa: a auditoria (`npm run auditoria`, ano a ano,
 * em dinastias), o túnel (no fim de toda vida) e os testes. O jogo não a chama.
 */
import { defCampo } from './campos.ts';
import { ATIVOS } from './constantes.ts';
import { conferirDividas } from './contas.ts';
import type { Conteudo } from './conteudo.ts';
import { dinheiroDoMundo } from './moeda.ts';
import { espacoNoMercado } from './negocio.ts';
import type { EstadoVida } from './tipos.ts';

/** Anos entre as gerações de sangue: pai e mãe são pelo menos isto mais velhos, e os filhos, isto mais novos. */
export const ANOS_ENTRE_GERACOES = 12;

/** Quanto o dinheiro do mundo pode sobrar da soma zero (os centavos da aritmética de ponto flutuante, que crescem com o tamanho do país). */
export function folgaDoDinheiro(e: EstadoVida): number {
  return Math.max(100, (e.entidades['pais']?.n['pib'] ?? 1e13) * 1e-11);
}

export function conferirEstado(e: EstadoVida, c?: Conteudo): string[] {
  const problemas: string[] = [];
  const eu = e.entidades['eu'];
  if (!eu) return ['não há quem joga no estado'];

  // ---- os números
  for (const en of Object.values(e.entidades)) {
    for (const [campo, v] of Object.entries(en.n)) {
      if (!Number.isFinite(v)) {
        problemas.push(`${en.id}.${campo} não é um número finito (${v})`);
        continue;
      }
      const def = defCampo(en.id, campo);
      if (!def) {
        problemas.push(`${en.id}.${campo} não está declarado em campos.ts`);
        continue;
      }
      if (def.limites) {
        const lido = v + (def.base ?? 0);
        if (lido < def.limites[0] - 1e-6 || lido > def.limites[1] + 1e-6) problemas.push(`${en.id}.${campo} = ${lido} fora de [${def.limites.join(', ')}]`);
      }
    }
  }

  // ---- o dinheiro
  if (e.entidades['mercado']) {
    const resto = dinheiroDoMundo(e);
    if (Math.abs(resto) > folgaDoDinheiro(e)) problemas.push(`o dinheiro do mundo soma ${resto.toFixed(2)}, não zero`);
  }
  problemas.push(...conferirDividas(e));
  if ((eu.n['dinheiro'] ?? 0) < -0.5) problemas.push(`a conta de quem joga está negativa (${(eu.n['dinheiro'] ?? 0).toFixed(2)}) sem contrato`);
  for (const a of [...ATIVOS, 'divida']) if ((eu.n[a] ?? 0) < -0.5) problemas.push(`eu.${a} negativo (${(eu.n[a] ?? 0).toFixed(2)})`);

  // ---- o tempo
  if (e.ano - e.anoNascimento !== e.idade) problemas.push(`o ano (${e.ano}) não é o nascimento (${e.anoNascimento}) mais a idade (${e.idade})`);
  for (const en of Object.values(e.entidades)) {
    if (en.tipo !== 'pessoa' && en.tipo !== 'animal') continue;
    if (en.vivo === false && en.morte === undefined) problemas.push(`${en.id} morreu sem ano de morte`);
    if (en.vivo !== false && en.morte !== undefined) problemas.push(`${en.id} está vivo com ano de morte`);
    if (en.nascimento !== undefined && en.nascimento > e.ano) problemas.push(`${en.id} nasce no futuro (${en.nascimento}, e o ano é ${e.ano})`);
    if (en.morte !== undefined && en.nascimento !== undefined && en.morte < en.nascimento) problemas.push(`${en.id} morreu (${en.morte}) antes de nascer (${en.nascimento})`);
  }
  if (eu.nascimento !== undefined) {
    for (const papel of ['mae', 'pai'] as const) {
      const x = e.entidades[papel];
      if (x?.nascimento !== undefined && eu.nascimento - x.nascimento < ANOS_ENTRE_GERACOES) problemas.push(`${papel} nasceu em ${x.nascimento}, e quem joga em ${eu.nascimento}`);
    }
    for (const en of Object.values(e.entidades)) {
      if (/^filho\d*$/.test(en.id) && en.nascimento !== undefined && en.nascimento - eu.nascimento < ANOS_ENTRE_GERACOES) problemas.push(`${en.id} nasceu em ${en.nascimento}, e quem joga em ${eu.nascimento}`);
    }
  }

  // ---- as empresas
  for (const en of Object.values(e.entidades)) {
    if (en.tipo !== 'empresa') continue;
    if ((en.n['caixa'] ?? 0) < -0.5) problemas.push(`${en.id}: caixa negativo (${(en.n['caixa'] ?? 0).toFixed(2)})`);
    const parte = en.n['participacao'];
    if (parte !== undefined && (parte < 0 || parte > 1 + 1e-9)) problemas.push(`${en.id}: participação ${parte} fora de 0 a 1`);
    if (c && en.vivo !== false && en.n['capacidade'] !== undefined) {
      const espaco = espacoNoMercado(e, c, en);
      if ((en.n['demanda'] ?? 0) > espaco * (1 + 1e-9) + 1) problemas.push(`${en.id} (${en.t['setor'] ?? '?'}): a demanda (${(en.n['demanda'] ?? 0).toExponential(3)}) passa do que o país compra do setor (${espaco.toExponential(3)})`);
    }
  }
  return problemas;
}
