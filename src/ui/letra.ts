/**
 * Quanto a letra do sistema aumenta o texto (o app Android herda o tamanho da fonte do celular, que
 * cresce só o texto, não as caixas). Uma sonda de 100px com altura de linha 1 mede 100 vezes a escala.
 * Com a letra grande, o cabeçalho e o palco trocam para um arranjo mais estreito (`letra-grande` no html).
 */
export function medirLetra(): void {
  const sonda = document.createElement('span');
  sonda.className = 'sonda-letra';
  sonda.textContent = 'M';
  document.body.append(sonda);
  const escala = sonda.getBoundingClientRect().height / 100;
  sonda.remove();
  document.documentElement.classList.toggle('letra-grande', escala >= 1.2);
}
