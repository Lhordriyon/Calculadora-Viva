/**
 * O toque que se sente (missão Ascensão AAA, I-154): uma vibração curta quando quem joga decide, e um pouco mais nos
 * momentos da vida (o marco, o sonho realizado, a morte). Só onde o aparelho deixa (`navigator.vibrate`: o Android, no
 * navegador e no app), e com chave no menu. A preferência fica no aparelho, fora do save: é do aparelho, não da vida.
 */
const CHAVE = 'trajetoria:vibracao';

export type Vibracao = 'decisao' | 'marco' | 'morte';

/** Em milissegundos: vibra, pausa, vibra. Curtas de propósito: é um aceno, não um alarme. */
const PADROES: Record<Vibracao, number | number[]> = {
  decisao: 10,
  marco: [14, 70, 22],
  morte: [40, 110, 40, 110, 70],
};

/** O aparelho sabe vibrar pelo navegador? (No computador e no iPhone, não: a chave nem aparece no menu.) */
export function podeVibrar(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function vibracaoLigada(): boolean {
  try {
    return globalThis.localStorage?.getItem(CHAVE) !== '0';
  } catch {
    return true;
  }
}

export function ligarVibracao(ligada: boolean): void {
  try {
    if (ligada) globalThis.localStorage?.removeItem(CHAVE);
    else globalThis.localStorage?.setItem(CHAVE, '0');
  } catch {
    // Sem armazenamento, a preferência vale só até fechar.
  }
}

export function vibrar(tipo: Vibracao): void {
  if (!podeVibrar() || !vibracaoLigada()) return;
  try {
    navigator.vibrate(PADROES[tipo]);
  } catch {
    // O navegador pode recusar (sem gesto de quem joga, ou bloqueado): o jogo segue igual.
  }
}
