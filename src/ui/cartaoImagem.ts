/**
 * O cartão da vida como imagem (canvas → PNG) para compartilhar.
 * Sempre em tema claro: a imagem sai do jogo e vai para qualquer lugar.
 */
import { formatarDinheiro } from '../motor/texto.ts';
import type { ResumoVida } from '../motor/virada.ts';
import { anos } from './formato.ts';

const LARGURA = 1080;
const MARGEM = 84;
const UTIL = LARGURA - MARGEM * 2;
const FONTE = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const COR = {
  fundo: '#f6f1e9',
  faixa: '#c2462a',
  creme: '#fff4e6',
  texto: '#221d17',
  suave: '#6b6155',
  cartao: '#fffdf9',
  borda: '#e2d8ca',
  destaque: '#a33a21',
};

function quebrar(ctx: CanvasRenderingContext2D, texto: string, largura: number): string[] {
  const linhas: string[] = [];
  let atual = '';
  for (const palavra of texto.split(/\s+/)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > largura && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

interface Pincel {
  ctx: CanvasRenderingContext2D;
  desenhar: boolean;
}

/** Escreve um parágrafo quebrado em linhas e devolve o novo y. */
function paragrafo(p: Pincel, texto: string, y: number, fonte: string, cor: string, altura: number, x = MARGEM, largura = UTIL, alinhar: CanvasTextAlign = 'left'): number {
  p.ctx.font = fonte;
  p.ctx.fillStyle = cor;
  p.ctx.textAlign = alinhar;
  const ax = alinhar === 'center' ? x + largura / 2 : x;
  for (const linha of quebrar(p.ctx, texto, largura)) {
    if (p.desenhar) p.ctx.fillText(linha, ax, y);
    y += altura;
  }
  p.ctx.textAlign = 'left';
  return y;
}

function retanguloArredondado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function marca(ctx: CanvasRenderingContext2D, x: number, y: number, tamanho: number): void {
  const s = tamanho / 512;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = COR.creme;
  ctx.fillStyle = COR.creme;
  ctx.lineWidth = 34;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(104, 404);
  ctx.bezierCurveTo(184, 404, 196, 268, 276, 244);
  ctx.bezierCurveTo(356, 220, 372, 168, 410, 108);
  ctx.stroke();
  for (const [cx, cy, r] of [
    [104, 404, 30],
    [276, 244, 24],
    [410, 108, 42],
  ] as const) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Desenha tudo (ou só mede, se desenhar = false) e devolve a altura usada. */
function compor(p: Pincel, r: ResumoVida, endereco: string): number {
  const { ctx } = p;
  // faixa do topo
  if (p.desenhar) {
    ctx.fillStyle = COR.faixa;
    ctx.fillRect(0, 0, LARGURA, 150);
    marca(ctx, MARGEM - 8, 34, 82);
    ctx.font = `800 40px ${FONTE}`;
    ctx.fillStyle = COR.creme;
    ctx.fillText('TRAJETÓRIA', MARGEM + 92, 90);
    ctx.font = `500 28px ${FONTE}`;
    ctx.textAlign = 'right';
    ctx.fillText('o cartão de uma vida', LARGURA - MARGEM, 90);
    ctx.textAlign = 'left';
  }
  let y = 240;
  y = paragrafo(p, r.nomeCompleto, y, `800 68px ${FONTE}`, COR.texto, 78);
  const meta = `${r.anoNascimento}–${r.anoFinal} · ${anos(r.idade)} · ${r.cidade}, ${r.uf}`;
  y = paragrafo(p, meta, y + 4, `500 34px ${FONTE}`, COR.suave, 46);
  if (r.causa) y = paragrafo(p, `Morreu ${r.causa}.`, y + 18, `italic 400 34px ${FONTE}`, COR.texto, 46);

  // números
  y += 30;
  const caixas = [
    ['Felicidade média', String(Math.round(r.felicidadeMedia))],
    ['Patrimônio', formatarDinheiro(r.patrimonio)],
    ['Saúde no fim', String(r.atributos.saude)],
  ];
  const largCaixa = (UTIL - 2 * 20) / 3;
  caixas.forEach(([rotulo, valor], i) => {
    const x = MARGEM + i * (largCaixa + 20);
    if (p.desenhar) {
      ctx.fillStyle = COR.cartao;
      retanguloArredondado(ctx, x, y, largCaixa, 128, 22);
      ctx.fill();
      ctx.strokeStyle = COR.borda;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = `500 24px ${FONTE}`;
      ctx.fillStyle = COR.suave;
      ctx.fillText(rotulo!, x + 22, y + 44);
      ctx.font = `800 40px ${FONTE}`;
      ctx.fillStyle = COR.texto;
      ctx.fillText(valor!, x + 22, y + 98);
    }
  });
  y += 128 + 64;

  // pontos de virada
  if (p.desenhar) {
    ctx.font = `800 26px ${FONTE}`;
    ctx.fillStyle = COR.destaque;
    ctx.fillText('PONTOS DE VIRADA', MARGEM, y);
  }
  y += 50;
  if (r.pontos.length === 0) {
    y = paragrafo(p, 'Uma vida curta demais para pontos de virada. Mas foi uma vida.', y, `500 34px ${FONTE}`, COR.texto, 46);
  }
  for (const ponto of r.pontos) {
    const topo = y - 44;
    ctx.font = `700 34px ${FONTE}`;
    const de = quebrar(ctx, `Aos ${ponto.idade}, você ${ponto.escolha}`, UTIL - 56);
    ctx.font = `400 32px ${FONTE}`;
    const para = quebrar(ctx, `→ aos ${ponto.consequenciaIdade}, ${ponto.consequencia}`, UTIL - 56);
    const altura = de.length * 44 + para.length * 42 + 44;
    if (p.desenhar) {
      ctx.fillStyle = COR.cartao;
      retanguloArredondado(ctx, MARGEM, topo, UTIL, altura, 22);
      ctx.fill();
      ctx.strokeStyle = COR.borda;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = COR.faixa;
      ctx.fillRect(MARGEM, topo + 18, 6, altura - 36);
    }
    let yy = y + 6;
    yy = paragrafo(p, de.join(' '), yy, `700 34px ${FONTE}`, COR.texto, 44, MARGEM + 32, UTIL - 56);
    yy = paragrafo(p, para.join(' '), yy + 2, `400 32px ${FONTE}`, COR.suave, 42, MARGEM + 32, UTIL - 56);
    y = topo + altura + 24 + 44;
  }

  // epitáfio e convite
  y += 6;
  y = paragrafo(p, `“${r.epitafio}”`, y, `italic 400 34px ${FONTE}`, COR.suave, 46, MARGEM, UTIL, 'center');
  y += 40;
  y = paragrafo(p, `Jogue a sua: ${endereco}`, y, `700 30px ${FONTE}`, COR.destaque, 40, MARGEM, UTIL, 'center');
  return y + 40;
}

export async function desenharCartao(r: ResumoVida, endereco: string): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = LARGURA;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível');
  const altura = Math.max(1350, Math.ceil(compor({ ctx, desenhar: false }, r, endereco)));
  canvas.height = altura;
  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, LARGURA, altura);
  ctx.textBaseline = 'alphabetic';
  compor({ ctx, desenhar: true }, r, endereco);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar a imagem'))), 'image/png');
  });
}

export function nomeDoArquivo(r: ResumoVida): string {
  const slug = r.nomeCompleto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `trajetoria-${slug}.png`;
}

export function podeCompartilharArquivo(): boolean {
  try {
    const teste = new File([new Uint8Array(1)], 'x.png', { type: 'image/png' });
    return typeof navigator.share === 'function' && navigator.canShare?.({ files: [teste] }) === true;
  } catch {
    return false;
  }
}

export async function compartilhar(blob: Blob, r: ResumoVida, endereco: string): Promise<'compartilhado' | 'cancelado' | 'baixado'> {
  const arquivo = new File([blob], nomeDoArquivo(r), { type: 'image/png' });
  if (podeCompartilharArquivo()) {
    try {
      await navigator.share({
        files: [arquivo],
        title: 'Trajetória',
        text: `${r.nome} viveu ${anos(r.idade)} no Trajetória. Jogue a sua: ${endereco}`,
      });
      return 'compartilhado';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelado';
    }
  }
  baixar(blob, arquivo.name);
  return 'baixado';
}

export function baixar(blob: Blob, nome: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
