/**
 * O save sai do aparelho como arquivo de texto: compartilhado (no celular), copiado (no app) ou baixado. Usado pelo menu
 * e pelas telas de erro (o save é o que quem joga manda quando algo dá errado). Devolve a frase para mostrar, ou null
 * se quem joga cancelou o compartilhamento.
 */
import { baixar } from './cartaoImagem.ts';
import { NO_APP } from './formato.ts';

export async function exportarSave(texto: string): Promise<string | null> {
  const nome = `trajetoria-save-${new Date().toISOString().slice(0, 10)}.txt`;
  const volta = 'Para trazer de volta, use “Importar um save”.';
  try {
    const doc = new File([texto], nome, { type: 'text/plain' });
    if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [doc] })) {
      await navigator.share({ files: [doc], title: 'Trajetória: save' });
      return `Save enviado. ${volta}`;
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return null;
  }
  if (NO_APP) {
    try {
      await navigator.clipboard.writeText(texto);
      return `Save copiado. Cole numa nota ou mande para você mesmo. ${volta}`;
    } catch {
      // Sem área de transferência: baixa o arquivo.
    }
  }
  baixar(new Blob([texto], { type: 'text/plain' }), nome);
  return `Save baixado (${nome}). ${volta}`;
}
