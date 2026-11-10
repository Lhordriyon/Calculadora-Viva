/**
 * A tela do Android emulado desenhou o jogo? Lê o `adb exec-out screencap` cru (largura, altura e formato em 12 ou 16
 * bytes, depois RGBA) e confere que a tela não é uma cor só e que o ouro do botão principal está nela.
 * Uso: node scripts/android-tela.cjs tela.raw
 */
'use strict';
const fs = require('node:fs');

const dados = fs.readFileSync(process.argv[2]);
const largura = dados.readUInt32LE(0);
const altura = dados.readUInt32LE(4);
const pixels = largura * altura;
// O cabeçalho tem 12 bytes (largura, altura, formato) ou 16 (com o espaço de cor), conforme a versão do Android.
const inicio = dados.length - pixels * 4;
if (!(largura > 0 && altura > 0) || (inicio !== 12 && inicio !== 16)) {
  console.log(`✗ a captura da tela não é a esperada (${largura} × ${altura}, ${dados.length} bytes)`);
  process.exit(1);
}
const cores = new Map();
let ouro = 0;
let amostras = 0;
for (let y = 0; y < altura; y += 3) {
  for (let x = 0; x < largura; x += 3) {
    const o = inicio + (y * largura + x) * 4;
    const r = dados[o];
    const g = dados[o + 1];
    const b = dados[o + 2];
    amostras++;
    const chave = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    cores.set(chave, (cores.get(chave) ?? 0) + 1);
    // O ouro do jogo (#d9a321 no tema claro, #e8b84a no escuro).
    if (r > 190 && g > 140 && g < 205 && b < 110 && r - b > 100) ouro++;
  }
}
const [corDoFundo, vezes] = [...cores].sort((a, b) => b[1] - a[1])[0];
const hex = (v) => (((v & 31) << 3) | 4).toString(16).padStart(2, '0');
const fundo = `#${hex(corDoFundo >> 10)}${hex(corDoFundo >> 5)}${hex(corDoFundo)}`;
const parteDoFundo = vezes / amostras;
const parteDeOuro = ouro / amostras;
console.log(`tela de ${largura} × ${altura}: ${cores.size} cores, a mais comum ${fundo} em ${(parteDoFundo * 100).toFixed(1)}% da tela, ouro em ${(parteDeOuro * 100).toFixed(2)}%`);
if (cores.size < 20 || parteDoFundo > 0.995) {
  console.log('✗ a tela é quase uma cor só: o jogo não desenhou');
  process.exit(1);
}
if (parteDeOuro < 0.005) {
  console.log('✗ o ouro do botão principal não está na tela');
  process.exit(1);
}
console.log('✓ o jogo desenhou a tela de abertura (o fundo, o texto e o botão dourado)');
