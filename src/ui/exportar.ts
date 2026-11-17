/**
 * O save sai do aparelho como arquivo de texto: compartilhado (no celular), copiado (no app) ou baixado. Usado pelo menu
 * e pelas telas de erro (o save é o que quem joga manda quando algo dá errado). Devolve a frase para mostrar, ou null
 * se quem joga cancelou o compartilhamento.
 */
import { baixar } from './cartaoImagem.ts';
import { NO_APP } from './formato.ts';

export async function exportarSave(texto: string): Promise<string | null> {
  return exportarTexto(texto, { prefixo: 'trajetoria-save', titulo: 'Trajetória: save', oQue: 'Save', volta: 'Para trazer de volta, use “Importar um save”.' });
}

/** O mesmo caminho para outro arquivo de texto (a observação do jeito de jogar). */
export async function exportarTexto(texto: string, a: { prefixo: string; titulo: string; oQue: string; volta: string }): Promise<string | null> {
  const nome = `${a.prefixo}-${new Date().toISOString().slice(0, 10)}.txt`;
  const volta = a.volta;
  try {
    const doc = new File([texto], nome, { type: 'text/plain' });
    if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [doc] })) {
      await navigator.share({ files: [doc], title: a.titulo });
      return `${a.oQue} enviado. ${volta}`.trim();
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return null;
  }
  if (NO_APP) {
    try {
      await navigator.clipboard.writeText(texto);
      return `${a.oQue} copiado. Cole numa nota ou mande para você mesmo. ${volta}`.trim();
    } catch {
      // Sem área de transferência: baixa o arquivo.
    }
  }
  baixar(new Blob([texto], { type: 'text/plain' }), nome);
  return `${a.oQue} baixado (${nome}). ${volta}`.trim();
}
