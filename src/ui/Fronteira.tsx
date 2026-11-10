import { Component, type ComponentChildren } from 'preact';
import { largarAVida, saveCru, temCopiaParaVoltar, voltarACopia } from '../jogo/salvar.ts';
import { exportarSave } from './exportar.ts';

interface Estado {
  /** O erro que derrubou o desenho (null enquanto o jogo está de pé). */
  erro: string | null;
  mensagem: string;
  /** A saída que apaga alguma coisa pede um segundo toque. */
  confirmar: 'copia' | 'vida' | null;
}

/**
 * A fronteira de erro (missão Ascensão AAA, I-150): se o desenho do jogo quebrar (um save que o esquema aceita e uma
 * tela não aguenta, um erro novo), quem joga não fica numa tela em branco. A vida continua no aparelho como estava, e
 * as saídas ficam à mão: abrir de novo, exportar o save (para guardar ou mandar a quem cuida do jogo), voltar à cópia
 * da última vez que o jogo abriu bem, ou largar só a vida em andamento (a memória entre vidas fica).
 */
export class Fronteira extends Component<{ children: ComponentChildren }, Estado> {
  override state: Estado = { erro: null, mensagem: '', confirmar: null };

  static override getDerivedStateFromError(erro: unknown): Partial<Estado> {
    return { erro: erro instanceof Error ? erro.message : String(erro) };
  }

  override render() {
    const { erro, mensagem, confirmar } = this.state;
    if (erro === null) return this.props.children;
    const texto = saveCru();
    const exportar = async (): Promise<void> => {
      if (!texto) return;
      const frase = await exportarSave(texto);
      if (frase) this.setState({ mensagem: frase });
    };
    const sair = (como: 'copia' | 'vida'): void => {
      if (confirmar !== como) {
        this.setState({ confirmar: como, mensagem: '' });
        return;
      }
      const deu = como === 'copia' ? voltarACopia() : largarAVida();
      if (deu) location.reload();
      else this.setState({ mensagem: 'Não deu para mexer no save deste aparelho.', confirmar: null });
    };
    return (
      <main class="abertura tropeco" aria-live="assertive">
        <div>
          <h1>O jogo tropeçou</h1>
          <p class="meta">Algo quebrou ao desenhar a tela. A sua vida continua guardada neste aparelho, do jeito que estava.</p>
        </div>
        <div class="acoes">
          <button class="botao" type="button" onClick={() => location.reload()}>
            Abrir de novo
          </button>
          {texto && (
            <button class="botao secundario" type="button" onClick={() => void exportar()}>
              Exportar o save
            </button>
          )}
          {temCopiaParaVoltar() && (
            <button class="botao secundario" type="button" onClick={() => sair('copia')}>
              {confirmar === 'copia' ? 'Confirmar: voltar à cópia e perder o que veio depois' : 'Voltar à cópia de segurança'}
            </button>
          )}
          <button class="botao secundario" type="button" onClick={() => sair('vida')}>
            {confirmar === 'vida' ? 'Confirmar: largar esta vida e começar outra' : 'Começar outra vida'}
          </button>
        </div>
        {mensagem && (
          <p class="aviso" role="status">
            {mensagem}
          </p>
        )}
        <p class="meta">Se abrir de novo não resolver, exporte o save antes de escolher uma das outras saídas: ele serve para recuperar a vida depois e para mostrar o erro a quem cuida do jogo.</p>
        <p class="meta tropeco-erro">O erro: {erro}</p>
      </main>
    );
  }
}
