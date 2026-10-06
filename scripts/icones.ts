/**
 * npm run icones — desenha os ícones PNG do PWA a partir da mesma geometria do
 * símbolo SVG, sem dependências (rasterização com antisserrilhado por distância).
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { RAIZ } from './disco.ts';

type Ponto = [number, number];
const FUNDO: [number, number, number] = [0xc2, 0x46, 0x2a];
const TRACO: [number, number, number] = [0xff, 0xf4, 0xe6];

function bezier(p0: Ponto, p1: Ponto, p2: Ponto, p3: Ponto, n: number): Ponto[] {
  const pts: Ponto[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([
      u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
      u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
    ]);
  }
  return pts;
}

// Mesma trajetória de src/ui/Marca.tsx, no espaço 512×512.
const CAMINHO = [...bezier([104, 404], [184, 404], [196, 268], [276, 244], 80), ...bezier([276, 244], [356, 220], [372, 168], [410, 108], 80)];
const CIRCULOS: [number, number, number][] = [
  [104, 404, 30],
  [276, 244, 24],
  [410, 108, 42],
];

function distSegmento(px: number, py: number, a: Ponto, b: Ponto): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}

/** Cobertura (0–1) de um retângulo arredondado de lado 512 e raio r, no espaço 512. */
function coberturaFundo(x: number, y: number, raio: number, escala: number): number {
  if (raio === 0) return 1;
  const cx = Math.max(raio - x, 0, x - (512 - raio));
  const cy = Math.max(raio - y, 0, y - (512 - raio));
  const d = Math.hypot(cx, cy) - raio;
  return Math.max(0, Math.min(1, 0.5 - d * escala));
}

function desenhar(tamanho: number, opcoes: { raio: number; zoom: number }): Buffer {
  const rgba = Buffer.alloc(tamanho * tamanho * 4);
  const escala = tamanho / 512;
  for (let py = 0; py < tamanho; py++) {
    for (let px = 0; px < tamanho; px++) {
      // ponto no espaço 512 (fundo) e no espaço do desenho (com zoom em torno do centro)
      const x = (px + 0.5) / escala;
      const y = (py + 0.5) / escala;
      const dx = 256 + (x - 256) / opcoes.zoom;
      const dy = 256 + (y - 256) / opcoes.zoom;
      const fundo = coberturaFundo(x, y, opcoes.raio, escala);
      let d = Infinity;
      for (let i = 1; i < CAMINHO.length; i++) d = Math.min(d, distSegmento(dx, dy, CAMINHO[i - 1]!, CAMINHO[i]!) - 17);
      for (const [cx, cy, r] of CIRCULOS) d = Math.min(d, Math.hypot(dx - cx, dy - cy) - r);
      const traco = Math.max(0, Math.min(1, 0.5 - d * escala * opcoes.zoom)) * fundo;
      const o = (py * tamanho + px) * 4;
      for (let c = 0; c < 3; c++) rgba[o + c] = Math.round(FUNDO[c]! * (1 - traco / Math.max(fundo, 1e-9)) + TRACO[c]! * (traco / Math.max(fundo, 1e-9)));
      rgba[o + 3] = Math.round(fundo * 255);
    }
  }
  return codificarPng(tamanho, tamanho, rgba);
}

const TABELA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = TABELA_CRC[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloco(tipo: string, dados: Buffer): Buffer {
  const tam = Buffer.alloc(4);
  tam.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tam, corpo, crc]);
}

function codificarPng(largura: number, altura: number, rgba: Buffer): Buffer {
  const cabecalho = Buffer.alloc(13);
  cabecalho.writeUInt32BE(largura, 0);
  cabecalho.writeUInt32BE(altura, 4);
  cabecalho[8] = 8; // bits por canal
  cabecalho[9] = 6; // RGBA
  const cru = Buffer.alloc((largura * 4 + 1) * altura);
  for (let y = 0; y < altura; y++) rgba.copy(cru, y * (largura * 4 + 1) + 1, y * largura * 4, (y + 1) * largura * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco('IHDR', cabecalho),
    bloco('IDAT', deflateSync(cru, { level: 9 })),
    bloco('IEND', Buffer.alloc(0)),
  ]);
}

const destino = join(RAIZ, 'public');
const icones = [
  { nome: 'icon-192.png', tamanho: 192, raio: 112, zoom: 1 },
  { nome: 'icon-512.png', tamanho: 512, raio: 112, zoom: 1 },
  { nome: 'icon-maskable-512.png', tamanho: 512, raio: 0, zoom: 0.72 },
  { nome: 'apple-touch-icon.png', tamanho: 180, raio: 0, zoom: 0.82 },
];
for (const i of icones) {
  writeFileSync(join(destino, i.nome), desenhar(i.tamanho, i));
  console.log(`✓ public/${i.nome}`);
}
