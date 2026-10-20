/**
 * npm run telas: a régua da tela (bloco C0 do plano de correção).
 *
 * Abre a build no ar num Chromium de celular (Playwright), com a letra do sistema simulada, e confere os critérios de
 * tela dos itens 1 a 9 do plano: alturas, faixa da história, texto visível, cortados, "R$" com reticências, rótulos,
 * letra mínima, rolagem interna, botão do ano em uma linha, opções inteiras no evento (no save e em vidas jogadas),
 * toques duplos, folhas (fechar perto do topo, voltar, véu), cores e classes órfãs. Imprime uma tabela em Markdown
 * (pronta para docs/decisoes.md) e sai com 1 se algum critério falhar, ou com 2 se não conseguiu medir (servidor fora
 * do ar, Playwright ausente, save que não se acha).
 *
 * Uso:
 *   npm run telas -- [URL] [DIR_DOS_SAVES] [opções]
 *     URL            a build no ar (padrão http://localhost:4175/Calculadora-Viva/). Para medir a sua, suba-a numa
 *                    porta própria, em segundo plano:  npx vite build && npx vite preview --port 4176 --strictPort
 *                    e, para parar, num comando separado:  pkill -f "[v]ite preview"
 *     DIR_DOS_SAVES  onde procurar save-real.json, save-marco.json, save-evento.json, save75.json, save-filhos.json e
 *                    save-real-novos.json (na pasta ou em visual/, ux/ e auditoria/interface-cores/; .json.gz também
 *                    vale). Padrão: o scratchpad da auditoria. O save que faltar vem de test/telas/*.json.gz, as cópias
 *                    guardadas no repositório (as mesmas da auditoria, para comparar antes e depois): real, um príncipe
 *                    de 30 anos, deputado, R$ 233 milhões e seis verbos; marco, aos 17, logo depois do ENEM; evento, aos
 *                    25, com um evento esperando a escolha; s75, um deputado federal de 75 anos; filhos, uma vida com
 *                    vários filhos; novos, o real com novidade nos verbos (o ponto de novidade).
 *   Opções:
 *     --so=grupos    só estes grupos (vírgulas): matriz, varredura, avanco, vidas, toques, folhas, cores, estatico
 *     --sem=grupos   todos menos estes (ex.: --sem=toques,vidas, os mais lentos, para iterar)
 *     --fonte=DIR    o repositório cujo src/ui/ os critérios de código leem (padrão: o deste arquivo)
 *     --paralelo=N   páginas abertas ao mesmo tempo (padrão: os núcleos da máquina, no mínimo 2)
 *     --json=ARQ     grava todas as medidas e os critérios em JSON
 *     --md=ARQ       grava a tabela dos critérios em Markdown
 *     --detalhe      imprime também a matriz (uma linha por save, tela e letra, no tema escuro)
 *   Exemplos:
 *     npm run telas                                     a versão no ar em 4175 com os saves da auditoria
 *     npm run telas -- http://localhost:4176/Calculadora-Viva/ test/telas --json=telas.json
 *     npm run telas -- --so=estatico                    só o código (classes órfãs, letra-grande, ouro), sem navegador
 *
 * A letra do sistema: toda font-size em px do CSS é multiplicada por k antes de o jogo montar (a folha é reescrita na
 * rede), como o Android faz com a letra do celular: cresce o texto, não as caixas. A letra do dono mede 1,45.
 * A matriz (item 0): 360 × 780 com 1,0, 1,15, 1,3 e 1,45; 390 × 844 e 412 × 915 com 1,0; 320 × 640 com 1,0 e 1,15;
 * os saves real, marco, evento, s75 e filhos, nos dois temas. Mais 390 × 844 com 1,15 (item 2), as varreduras de 1,0 a
 * 1,5 (itens 1, 2, 3 e 5) e oito vidas jogadas do nascimento pela interface (item 3; f2-vida.cjs da auditoria).
 *
 * As medidas vêm dos scripts da auditoria: interface-cores/hierarquia.cjs e dimensionamento/medir-lente.cjs (alturas,
 * cortados, texto da última entrada, letras), funcionamento/f2, f4, f6, f12, f13, f15, f16 e f20 (vida jogada, folhas,
 * dinheiro, carreira, toques duplos e voltar), interface-cores/matizes.py e vizinhas.py e qualidade-cuidado/
 * contraste-raiz.cjs e atributo.cjs (cor viva, matiz da Felicidade, contraste). Os critérios de código (classes
 * órfãs, letra-grande, var(--destaque e var(--brilho) leem src/ui/ do repositório, não a URL: meça a build do mesmo
 * código, ou aponte --fonte. O Playwright fica fora do package.json (pilha mínima): vem de TELAS_PLAYWRIGHT, do
 * node_modules ou de /opt/node-tools/node_modules/playwright. A vida é determinística: o crypto.getRandomValues da
 * página (a semente do nascimento) é trocado por uma sequência fixa, e as vidas jogadas adiantam o performance.now
 * em vez de esperar a carência de 450 ms das opções (os toques duplos esperam de verdade).
 */
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');

const RAIZ = path.resolve(__dirname, '..');
const SCRATCHPAD = '/tmp/claude-0/-home-user-Calculadora-Viva/2acc050b-6718-5500-826e-a556f05d9742/scratchpad';

// ---------------------------------------------------------------------------------------------------------------
// Argumentos

const args = process.argv.slice(2);
const posicionais = args.filter((a) => !a.startsWith('--'));
function opcao(nome, padrao) {
  const a = args.find((x) => x === `--${nome}` || x.startsWith(`--${nome}=`));
  if (!a) return padrao;
  const i = a.indexOf('=');
  return i < 0 ? true : a.slice(i + 1);
}
const URL_BASE = String(posicionais[0] || opcao('url', 'http://localhost:4175/Calculadora-Viva/'));
const DIR_SAVES = path.resolve(String(posicionais[1] || opcao('saves', SCRATCHPAD)));
const PARALELO = Math.max(1, Number(opcao('paralelo', Math.max(2, os.cpus().length))) || 2);
const FONTE = path.resolve(String(opcao('fonte', RAIZ)));
const GRUPOS = ['matriz', 'varredura', 'avanco', 'vidas', 'toques', 'folhas', 'cores', 'estatico'];
/** Os grupos que abrem o navegador (só "estatico" roda sem servidor e sem Playwright). */
const NO_NAVEGADOR = GRUPOS.filter((g) => g !== 'estatico');
const so = opcao('so', '');
const sem = String(opcao('sem', '')).split(',').filter(Boolean);
const ativos = new Set((so ? String(so).split(',') : GRUPOS).filter((g) => !sem.includes(g)));
for (const g of ativos) if (!GRUPOS.includes(g)) sair(2, `grupo desconhecido: ${g} (os grupos: ${GRUPOS.join(', ')})`);

function sair(codigo, msg) {
  console.error(`telas: ${msg}`);
  process.exit(codigo);
}

function carregarPlaywright() {
  const tentativas = [process.env.TELAS_PLAYWRIGHT, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean);
  for (const t of tentativas) {
    try {
      return require(t);
    } catch {
      // tenta a próxima
    }
  }
  return sair(2, 'Playwright não encontrado (defina TELAS_PLAYWRIGHT com o caminho do pacote)');
}

// ---------------------------------------------------------------------------------------------------------------
// Saves

const ARQUIVOS = { real: 'save-real.json', marco: 'save-marco.json', evento: 'save-evento.json', s75: 'save75.json', filhos: 'save-filhos.json', novos: 'save-real-novos.json' };
const SUBPASTAS = ['', 'visual', 'ux', 'auditoria/interface-cores'];
const saves = {};
function lerSave(nome) {
  if (saves[nome]) return saves[nome];
  const arq = ARQUIVOS[nome];
  const candidatos = [...SUBPASTAS.map((s) => path.join(DIR_SAVES, s, arq)), path.join(RAIZ, 'test/telas', arq)];
  for (const c of candidatos) {
    for (const p of [c, `${c}.gz`]) {
      if (!fs.existsSync(p)) continue;
      const bruto = fs.readFileSync(p);
      saves[nome] = { origem: p, texto: p.endsWith('.gz') ? zlib.gunzipSync(bruto).toString('utf8') : bruto.toString('utf8') };
      return saves[nome];
    }
  }
  throw new Error(`save "${nome}" (${arq}) não encontrado em ${DIR_SAVES} nem em test/telas/`);
}

// ---------------------------------------------------------------------------------------------------------------
// Abrir o jogo

const cssOriginal = new Map();
const rotulo = (c) => `${c.save ?? 'novo'} ${c.w}×${c.h} k${c.k.toFixed(2)}${c.tema === 'light' ? ' claro' : ''}`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrir(browser, { save = null, w = 360, h = 780, k = 1, tema = 'dark', antes = null, semente = 20261019, relogio = false }) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: tema,
    locale: 'pt-BR',
    serviceWorkers: 'block',
    reducedMotion: 'reduce',
  });
  await ctx.route('**/*.css', async (route) => {
    const url = route.request().url();
    if (!cssOriginal.has(url)) {
      const r = await route.fetch();
      cssOriginal.set(url, await r.text());
    }
    const corpo = cssOriginal.get(url).replace(/font-size:\s*([\d.]+)px/g, (_, n) => `font-size:${(parseFloat(n) * k).toFixed(3)}px`);
    await route.fulfill({ status: 200, contentType: 'text/css; charset=utf-8', body: corpo });
  });
  // O nascimento sorteia a semente com crypto.getRandomValues: uma sequência fixa deixa a vida igual a cada rodada.
  await ctx.addInitScript((semente) => {
    let s = semente;
    crypto.getRandomValues = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        s = (Math.imul(s, 1103515245) + 12345) >>> 0;
        arr[i] = s;
      }
      return arr;
    };
  }, semente);
  // Os fluxos que só precisam chegar a um estado (jogar uma vida, responder o evento de um avanço) adiantam o relógio
  // da página em vez de esperar a carência de 450 ms das opções: adiantar(page) soma 1 s ao performance.now.
  if (relogio) {
    await ctx.addInitScript(() => {
      const real = performance.now.bind(performance);
      window.__telasAdiantado = 0;
      performance.now = () => real() + window.__telasAdiantado;
    });
  }
  if (save) {
    await ctx.addInitScript((texto) => {
      try {
        if (location.protocol.startsWith('http') && !sessionStorage.getItem('telas')) {
          localStorage.setItem('trajetoria', texto);
          sessionStorage.setItem('telas', '1');
        }
      } catch {
        // about:blank não tem armazenamento
      }
    }, lerSave(save).texto);
  }
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  if (antes) await page.goto(antes);
  await page.goto(URL_BASE, { waitUntil: 'load' });
  if (save) {
    try {
      await page.waitForSelector('.palco', { timeout: 15000 });
    } catch {
      throw new Error(`o save "${save}" não abriu a vida (sem .palco): versão do save ou build quebrada?`);
    }
  } else {
    await page.waitForSelector('button', { timeout: 15000 });
  }
  await quadros(page);
  return { ctx, page, erros };
}

const quadros = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

// ---------------------------------------------------------------------------------------------------------------
// A medida de uma tela (roda dentro da página). Robusta a mudanças de marcação: procura pelo papel quando dá.

function medirTela(op) {
  const H = innerHeight;
  const W = innerWidth;
  const q = (s) => document.querySelector(s);
  const css = (el) => getComputedStyle(el);
  const nome = (el) => {
    const c = (typeof el.className === 'string' ? el.className : (el.className?.baseVal ?? '')).trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (c ? `.${c}` : '');
  };
  const textoDe = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const recorta = (el) => {
    const cs = css(el);
    return cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
  };
  const leitor = (el) => !!el.closest('.so-leitor, .sonda-letra');
  const naTela = (r) => r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
  const contem = (c, r, f = 1) => r.left >= c.left - f && r.right <= c.right + f && r.top >= c.top - f && r.bottom <= c.bottom + f;
  const cruza = (c, r) => r.left < c.right && r.right > c.left && r.top < c.bottom && r.bottom > c.top;
  const tela = { left: 0, top: 0, right: W, bottom: H };
  const recortes = (el) => {
    const out = [tela];
    for (let e = el; e && e !== document.documentElement && e !== document.body; e = e.parentElement) if (recorta(e)) out.push(e.getBoundingClientRect());
    return out;
  };
  /** Todos os retângulos inteiros na tela e dentro de cada ancestral que recorta (o próprio elemento inclusive). */
  const inteiros = (rects, el) => rects.length > 0 && recortes(el).every((c) => rects.every((r) => contem(c, r)));
  /** Algum pedaço à vista (cruza a tela e cada ancestral que recorta). */
  const algumAVista = (rects, el) => {
    const cs = recortes(el);
    return rects.some((r) => cs.every((c) => cruza(c, r)));
  };
  const opacidade = (el) => {
    let o = 1;
    for (let e = el; e; e = e.parentElement) o *= Number(css(e).opacity);
    return o;
  };
  const nosDeTexto = (raiz) => {
    const out = [];
    const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.data.trim() && n.parentElement && !leitor(n.parentElement)) out.push(n);
    return out;
  };
  const rectsDe = (no, ini = 0, fim = no.data.length) => {
    const r = document.createRange();
    r.setStart(no, ini);
    r.setEnd(no, fim);
    return [...r.getClientRects()].filter((x) => x.width > 0.5 && x.height > 0.5);
  };
  const desenhado = (el) => {
    const cs = css(el);
    return cs.visibility === 'visible' && cs.display !== 'none' && opacidade(el) > 0.1;
  };
  /** Todo texto desenhado dentro de el aparece inteiro (sem reticências, sem recorte). */
  const textoInteiro = (el) =>
    nosDeTexto(el).every((n) => {
      if (!desenhado(n.parentElement)) return true;
      const rs = rectsDe(n);
      return rs.length === 0 || inteiros(rs, n.parentElement);
    });
  /** A palavra aparece inteira em algum lugar de raiz (ignora maiúsculas). */
  const palavraAVista = (raiz, palavra) => {
    const alvo = palavra.toLocaleLowerCase('pt-BR');
    for (const n of nosDeTexto(raiz)) {
      const t = n.data.toLocaleLowerCase('pt-BR');
      for (let i = t.indexOf(alvo); i >= 0; i = t.indexOf(alvo, i + 1)) {
        if (!desenhado(n.parentElement)) continue;
        const rs = rectsDe(n, i, i + alvo.length);
        if (rs.length && inteiros(rs, n.parentElement)) return true;
      }
    }
    return false;
  };
  /** Linhas ocupadas por um conjunto de retângulos de texto (os que se sobrepõem na vertical são a mesma linha). */
  const contarLinhas = (rects) => {
    const linhas = [];
    for (const x of [...rects].sort((a, b) => a.top - b.top)) {
      const l = linhas.find((y) => Math.min(y.bottom, x.bottom) - Math.max(y.top, x.top) > 0.4 * Math.min(y.bottom - y.top, x.height));
      if (l) {
        l.top = Math.min(l.top, x.top);
        l.bottom = Math.max(l.bottom, x.bottom);
      } else linhas.push({ top: x.top, bottom: x.bottom });
    }
    return linhas.length;
  };
  const rectsDoTexto = (el) => nosDeTexto(el).filter((n) => desenhado(n.parentElement)).flatMap((n) => rectsDe(n));
  // Cores: o canvas converte qualquer cor CSS (rgb, color(srgb), color-mix já computado) em sRGB.
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => {
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = 'rgba(0, 0, 0, 0)';
    cv.fillStyle = c;
    cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const resolver = (valor) => {
    const s = document.createElement('span');
    s.style.color = valor;
    document.body.append(s);
    const c = css(s).color;
    s.remove();
    return rgba(c);
  };
  const sobre = (a, b) => {
    const al = a[3] + b[3] * (1 - a[3]);
    if (al === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map((i) => (a[i] * a[3] + b[i] * b[3] * (1 - a[3])) / al).concat(al);
  };
  const coresDoGradiente = (img) => (img.match(/(rgba?\([^)]*\)|color\([^)]*\))/g) || []).map(rgba);
  /** O fundo efetivo atrás de el: as cores de fundo dos ancestrais compostas (gradiente = média das paradas). */
  const fundoDe = (el) => {
    const camadas = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = css(e);
      let c = rgba(cs.backgroundColor);
      if (cs.backgroundImage.includes('gradient')) {
        const g = coresDoGradiente(cs.backgroundImage);
        if (g.length) {
          const m = [0, 1, 2, 3].map((i) => g.reduce((s, x) => s + x[i], 0) / g.length);
          c = sobre(m, c);
        }
      }
      if (c[3] > 0) camadas.push(c);
    }
    let fundo = [255, 255, 255, 1];
    for (let i = camadas.length - 1; i >= 0; i--) fundo = sobre(camadas[i], fundo);
    return fundo;
  };
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const contraste = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, r) => r - p);
    return (x + 0.05) / (y + 0.05);
  };
  const matiz = (c) => {
    const [r, g, b] = c.slice(0, 3).map((v) => v / 255);
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    if (mx === mn) return 0;
    const d = mx - mn;
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  };

  const cab = q('.cabecalho') || q('header');
  const vida = q('main.vida') || q('main');
  const palco = q('.palco');
  const evento = q('.cartao-evento');
  const vr = vida ? vida.getBoundingClientRect() : null;
  const alt = (el) => (el ? Math.round(el.getBoundingClientRect().height) : 0);
  const rola = (el) => !!el && el.scrollHeight > el.clientHeight + 1;
  const botoesDoPalco = palco ? [...palco.querySelectorAll('button')] : [];
  const botaoAno = botoesDoPalco.find((b) => b.classList.contains('viver')) || botoesDoPalco.find((b) => /viver mais 1 ano|\+1 ano|só viver/i.test(b.textContent || ''));
  const modo = evento ? 'evento' : q('.opcoes-acao') ? 'lista' : botaoAno ? 'principal' : 'outro';

  // Cortados: caixa que recorta (reticências ou overflow escondido) e cujo texto passa dela. O sobrenome pode cortar.
  const cortados = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!(el instanceof HTMLElement) || el.closest('.veu') || leitor(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || !naTela(r) || !algumAVista([r], el.parentElement)) continue;
    const cs = css(el);
    const ex = cs.overflowX === 'hidden' || cs.overflowX === 'clip';
    const ey = cs.overflowY === 'hidden' || cs.overflowY === 'clip';
    if (!ex && !ey) continue;
    const corteX = ex && el.scrollWidth > el.clientWidth + 1;
    const corteY = ey && el.scrollHeight > el.clientHeight + 2;
    if (!corteX && !corteY) continue;
    const t = textoDe(el);
    if (!t) continue;
    const sob = el.matches('.sobrenome') ? el : [...el.children].find((c) => c.matches('.sobrenome'));
    let sobrenome = false;
    if (sob && !corteY) {
      if (sob === el) sobrenome = true;
      else {
        const rg = document.createRange();
        rg.setStart(el, 0);
        rg.setEndBefore(sob);
        sobrenome = rg.getBoundingClientRect().right <= r.right + 1;
      }
    }
    cortados.push({ el: nome(el), texto: t.slice(0, 48), sobrenome, w: `${el.scrollWidth}>${el.clientWidth}`, noTitulo: !!el.closest('#titulo-ficha') });
  }

  // A letra: todo texto à vista (na tela e não rolado para fora da faixa).
  const vistos = new Set();
  const letras = [];
  for (const n of nosDeTexto(document.body)) {
    const el = n.parentElement;
    if (vistos.has(el) || el.closest('.veu')) continue;
    vistos.add(el);
    const cs = css(el);
    if (cs.visibility !== 'visible' || cs.display === 'none') continue;
    const rs = rectsDe(n);
    if (!rs.some(naTela) || !algumAVista(rs, el)) continue;
    letras.push([parseFloat(cs.fontSize), `${nome(el)} "${textoDe(el).slice(0, 24)}"`]);
  }
  letras.sort((a, b) => a[0] - b[0]);

  // Os rótulos do cabeçalho.
  const rotulos = Object.fromEntries((op.rotulos || []).map((p) => [p, cab ? palavraAVista(cab, p) : false]));

  // A última entrada da linha do tempo: quanto do texto aparece (a medida de interface-cores/hierarquia.cjs). O balanço
  // do ano e os aluguéis não são história, seja pílula ou linha.
  const eBalanco = (el) => /balan|alugue/i.test(typeof el.className === 'string' ? el.className : '') || /^\s*(no ano[,:]\s*[+−-]|aluguéis[,:]\s*\+)/i.test(el.textContent || '');
  const visH = (el) => {
    const b = el.getBoundingClientRect();
    return Math.max(0, Math.min(b.bottom, vr.bottom) - Math.max(b.top, vr.top));
  };
  const anos = vida ? vida.querySelectorAll('li.ano') : [];
  const ultima = anos[anos.length - 1];
  let textoUltima = 0;
  let chipsUltima = 0;
  if (ultima && vr) {
    for (const p of ultima.querySelectorAll('.entrada > p, .entrada > .etiqueta')) if (!eBalanco(p)) textoUltima += visH(p);
    for (const c of ultima.querySelectorAll('.chips')) chipsUltima += visH(c);
  }

  // O botão do ano.
  let botao = null;
  if (botaoAno) {
    const r = botaoAno.getBoundingClientRect();
    const cs = css(botaoAno);
    const ouro = resolver('var(--destaque)');
    const fundos = [rgba(cs.backgroundColor), ...coresDoGradiente(cs.backgroundImage)].filter((c) => c[3] > 0.5);
    const perto = (c) => Math.hypot(c[0] - ouro[0], c[1] - ouro[1], c[2] - ouro[2]) < 60;
    botao = {
      texto: textoDe(botaoAno),
      classes: botaoAno.className,
      secundario: botaoAno.classList.contains('secundario'),
      dourado: fundos.some(perto),
      linhas: contarLinhas(rectsDoTexto(botaoAno)),
      alt: Math.round(r.height),
      inteiro: textoInteiro(botaoAno),
    };
  }

  // As escolhas do ano: o título e os verbos.
  const titulo = palco ? palco.querySelector('#titulo-ficha') : null;
  const verbos = palco && modo === 'principal' ? [...palco.querySelectorAll('.verbos .verbo, .verbos button')].filter((v, i, a) => a.indexOf(v) === i) : [];
  const verbosInfo = verbos.map((v) => ({
    nome: nosDeTexto(v)
      .map((n) => n.data.trim())
      .join(' ')
      .slice(0, 20),
    cortado: !textoInteiro(v),
    inteiro: inteiros([v.getBoundingClientRect()], v.parentElement),
  }));
  const caixaDosVerbos = palco ? palco.querySelector('.verbos') : null;

  // O evento: as opções inteiras à vista.
  const opcoes = evento ? [...evento.querySelectorAll('.opcao')].map((o) => ({ texto: textoDe(o).slice(0, 24), inteira: inteiros([o.getBoundingClientRect()], o.parentElement) })) : [];

  const out = {
    modo,
    letraGrande: document.documentElement.classList.contains('letra-grande'),
    aviso: q('.veu') ? textoDe(q('.veu')).slice(0, 80) : null,
    lateral: document.documentElement.scrollWidth > W + 1,
    cab: alt(cab),
    vida: vida ? vida.clientHeight : 0,
    palco: alt(palco),
    historiaPct: vr ? +((100 * vr.height) / H).toFixed(1) : 0,
    textoUltima: Math.round(textoUltima),
    chipsUltima: Math.round(chipsUltima),
    cortados,
    letras12: letras.filter(([f]) => f < 12).length,
    menoresLetras: letras.slice(0, 3).map(([f, s]) => `${f.toFixed(1)}px ${s}`),
    rotulos,
    cabRola: rola(cab),
    palcoRola: rola(palco),
    verbosRolam: rola(caixaDosVerbos) || verbosInfo.some((v) => !v.inteiro),
    verbos: verbosInfo,
    titulo: titulo ? { texto: textoDe(titulo).slice(0, 48), inteiro: textoInteiro(titulo) } : null,
    botao,
    opcoes,
    cartaoRola: rola(evento),
    faixas: Object.fromEntries(
      [
        ['cab', cab],
        ['linha', vida],
        ['palco', palco],
      ]
        .filter(([, e]) => e)
        .map(([n, e]) => {
          const b = e.getBoundingClientRect();
          return [n, [b.top, b.height]];
        }),
    ),
  };

  if (op.cores) {
    const ouro = resolver('var(--destaque)');
    const fel = resolver('var(--felicidade)');
    const d = Math.abs(matiz(ouro) - matiz(fel));
    out.felicidadeOuro = Math.round(Math.min(d, 360 - d));
    out.pontos = [...document.querySelectorAll('.ponto-novo')]
      .filter((p) => p.getBoundingClientRect().width > 0)
      .map((p) => {
        const cor = rgba(css(p).backgroundColor);
        const fundo = fundoDe(p.parentElement);
        return +contraste(sobre(cor, fundo), fundo).toFixed(2);
      });
  }
  if (op.chips) {
    const res = [];
    for (const c of document.querySelectorAll('main .chip')) {
      if (!c.getBoundingClientRect().width) continue;
      const cs = css(c);
      const fundo = fundoDe(c);
      const cor = rgba(cs.color);
      cor[3] *= opacidade(c);
      const px = parseFloat(cs.fontSize);
      const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
      res.push({ k: +contraste(sobre(cor, fundo), fundo).toFixed(2), min: grande ? 3 : 4.5, texto: textoDe(c).slice(0, 24) });
    }
    res.sort((a, b) => a.k - a.min - (b.k - b.min));
    out.chips = { total: res.length, abaixo: res.filter((x) => x.k < x.min).length, pior: res[0] ?? null };
  }
  return out;
}

const ROTULOS = ['Saúde', 'Felicidade', 'Inteligência', 'Aparência', 'Dinheiro', 'Patrimônio', 'Renda'];

/** Quanto da tela é cor viva (a conta de interface-cores/matizes.py): saturação HSV ≥ 0,40 e valor ≥ 0,45. */
async function corViva(ctx, png, faixas) {
  const p = await ctx.newPage();
  try {
    return await p.evaluate(
      async ({ b64, faixas }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const escala = img.width / innerWidth || 2;
        let total = 0;
        let vivos = 0;
        const porFaixa = {};
        for (let y = 0; y < c.height; y += 2) {
          for (let x = 0; x < c.width; x += 2) {
            const i = (y * c.width + x) * 4;
            const mx = Math.max(d[i], d[i + 1], d[i + 2]);
            const mn = Math.min(d[i], d[i + 1], d[i + 2]);
            const vivo = mx / 255 >= 0.45 && mx > 0 && (mx - mn) / mx >= 0.4;
            total++;
            if (vivo) vivos++;
            for (const [n, [y0, h]] of Object.entries(faixas)) {
              const ycss = y / 2;
              if (ycss >= y0 && ycss < y0 + h) {
                porFaixa[n] ??= [0, 0];
                porFaixa[n][0]++;
                if (vivo) porFaixa[n][1]++;
              }
            }
          }
        }
        void escala;
        return { pct: +((100 * vivos) / total).toFixed(1), faixas: Object.fromEntries(Object.entries(porFaixa).map(([n, [t, v]]) => [n, +((100 * v) / t).toFixed(1)])) };
      },
      { b64: png.toString('base64'), faixas },
    );
  } finally {
    await p.close();
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Tarefas

/** Uma tela parada: abre o save e mede (opcionalmente a captura para a cor viva). */
async function tarefaTela(browser, c) {
  const { ctx, page, erros } = await abrir(browser, c);
  try {
    const m = await page.evaluate(medirTela, { rotulos: ROTULOS, cores: !!c.cores, chips: !!c.chips });
    if (c.foto) {
      const png = await page.screenshot({ type: 'png' });
      m.corViva = await corViva(ctx, png, m.faixas);
    }
    return { tipo: 'tela', ...c, rotulo: rotulo(c), erros, ...m };
  } finally {
    await ctx.close();
  }
}

const SEL_ANO = '.palco button.viver';
async function botaoDoAno(page) {
  const l = page.locator(SEL_ANO);
  if (await l.count()) return l.first();
  return page.getByRole('button', { name: /^Viver mais 1 ano|\+1 ano/ }).first();
}

function estadoDaPagina() {
  const ev = document.querySelector('.cartao-evento');
  const palco = document.querySelector('.palco');
  const ler = (el) => {
    const m = el && (el.textContent || '').match(/(\d+) anos?\b/);
    return m ? Number(m[1]) : null;
  };
  const botoes = palco ? [...palco.querySelectorAll('button')] : [];
  const ano = botoes.find((b) => b.classList.contains('viver')) || botoes.find((b) => /viver mais 1 ano|\+1 ano|só viver/i.test(b.textContent || ''));
  return {
    evento: ev ? (ev.textContent || '').slice(0, 300) : null,
    idade: ler(ev?.querySelector('.quando')) ?? ler(ev) ?? ler(document.querySelector('.cabecalho .sub')) ?? ler(document.querySelector('.cabecalho')),
    veu: !!document.querySelector('.veu'),
    lista: !!document.querySelector('.opcoes-acao'),
    ano: !!ano,
    fim: /Ver o cartão da vida/.test(palco?.textContent || ''),
    cab: (document.querySelector('.cabecalho')?.textContent || '').slice(0, 400),
    anos: document.querySelectorAll('main li.ano').length,
    entradas: document.querySelectorAll('main .entrada').length,
  };
}
const estado = (page) => page.evaluate(estadoDaPagina);

/** Passa o ano com um toque e espera a tela mudar (a carência de um evento que fechou pode engolir o primeiro toque). */
async function avancar(page) {
  const antes = await estado(page);
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    await adiantar(page);
    const b = await botaoDoAno(page);
    await b.click({ timeout: 3000 });
    try {
      await page.waitForFunction(
        (a) => {
          const ev = document.querySelector('.cartao-evento');
          return !!ev || document.querySelectorAll('main li.ano').length !== a.anos || (document.querySelector('.cabecalho')?.textContent || '').slice(0, 400) !== a.cab || !!document.querySelector('.veu') || /Ver o cartão da vida/.test(document.querySelector('.palco')?.textContent || '');
        },
        antes,
        { timeout: 900, polling: 40 },
      );
      return true;
    } catch {
      // tenta de novo
    }
  }
  return false;
}

async function centro(locator) {
  const b = await locator.boundingBox();
  return b ? [b.x + b.width / 2, b.y + b.height / 2] : null;
}

/** Pula a carência das opções nas páginas abertas com relogio: true (nas outras, não faz nada). */
const adiantar = (page) =>
  page.evaluate(() => {
    if (typeof window.__telasAdiantado === 'number') window.__telasAdiantado += 1000;
  });

/** Um resumo do que está na tela: muda quando a vida anda (entrada, evento, lista de ações, cabeçalho, palco, folha). */
function assinaturaDaPagina() {
  const t = (s, n) => (document.querySelector(s)?.textContent || '').slice(0, n);
  return [document.querySelectorAll('main .entrada').length, t('.cartao-evento', 300), t('.cabecalho', 400), t('.palco', 300), !!document.querySelector('.veu')].join('|');
}
async function mudou(page, antes, ms = 2500) {
  try {
    await page.waitForFunction(`(${assinaturaDaPagina})() !== ${JSON.stringify(antes)}`, null, { timeout: ms, polling: 25 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Toca (um toque, com a carência já passada) e espera a tela responder. A carência conta de quando o efeito do cartão
 * roda, depois da pintura: se o relógio andou antes disso, o toque cai dentro dela e é ignorado; aí toca de novo.
 */
async function tocarEEsperar(page, locator) {
  const antes = await page.evaluate(assinaturaDaPagina);
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    await quadros(page);
    await adiantar(page);
    await locator.click({ timeout: 3000 });
    if (await mudou(page, antes, 1200 * (tentativa + 1))) return true;
  }
  return false;
}

/** Responde o evento na tela com a opção disponível que escolher(n) indicar. */
async function responderEvento(page, escolher) {
  const ops = page.locator('.cartao-evento .opcao:not([disabled])');
  const n = await ops.count();
  return n > 0 && tocarEEsperar(page, ops.nth(escolher(n)));
}

/**
 * f2 (roda dentro da página, numa chamada só): joga a vida já nascida. Nos eventos, mede o espaço da história, o
 * cabeçalho e se cada opção aparece inteira, e responde uma opção ao acaso; fora deles, abre um verbo e faz uma ação
 * (60%) ou vive o ano. Toca com element.click() e adianta o performance.now da página para a carência não engolir o
 * toque: o fluxo só precisa chegar aos estados, e os toques de verdade ficam com as tarefas de toque duplo.
 */
async function jogarNaPagina({ semente, eventos: maxEventos, passos }) {
  let s = semente;
  const sorteio = () => (s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  const qual = (n) => Math.min(n - 1, Math.floor(sorteio() * n));
  const q = (sel) => document.querySelector(sel);
  const todos = (sel) => [...document.querySelectorAll(sel)];
  const t = (sel, n) => (q(sel)?.textContent || '').slice(0, n);
  const assinatura = () => [todos('main .entrada').length, t('.cartao-evento', 300), t('.cabecalho', 400), t('.palco', 300), !!q('.veu')].join('|');
  const quadro = () => new Promise((r) => requestAnimationFrame(() => r()));
  // O relógio da página anda 1 s a cada toque: as esperas daqui contam pelo Date.
  const mudou = async (antes, ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      await quadro();
      if (assinatura() !== antes) return true;
    }
    return false;
  };
  /** Toca no que alvo() achar e espera a tela mudar; a carência conta de quando o efeito do cartão roda, então insiste. */
  const tocar = async (alvo) => {
    const antes = assinatura();
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      await quadro();
      await quadro();
      await new Promise((r) => setTimeout(r, 0));
      window.__telasAdiantado += 1000;
      const el = alvo();
      if (!el) return false;
      el.click();
      if (await mudou(antes, 1500 * (tentativa + 1))) return true;
    }
    return false;
  };
  const idade = () => {
    const m = (t('.cartao-evento .quando', 80) || t('.cabecalho .sub', 200) || t('.cabecalho', 400)).match(/(\d+) anos?\b/);
    return m ? Number(m[1]) : null;
  };
  const H = innerHeight;
  const W = innerWidth;
  const recorta = (e) => {
    const cs = getComputedStyle(e);
    return cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
  };
  const inteira = (el) => {
    const r = el.getBoundingClientRect();
    const caixas = [{ left: 0, top: 0, right: W, bottom: H }];
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) if (recorta(e)) caixas.push(e.getBoundingClientRect());
    return caixas.every((c) => r.left >= c.left - 1 && r.right <= c.right + 1 && r.top >= c.top - 1 && r.bottom <= c.bottom + 1);
  };
  const medirEvento = () => {
    const cartao = q('.cartao-evento');
    const vida = q('main.vida') || q('main');
    const cab = q('.cabecalho') || q('header');
    const ops = todos('.cartao-evento .opcao');
    return {
      linha: vida ? Math.round(vida.getBoundingClientRect().height) : 0,
      cab: cab ? Math.round(cab.getBoundingClientRect().height) : 0,
      opcoes: ops.length,
      foraDaTela: ops.filter((o) => !inteira(o)).length,
      rola: cartao.scrollHeight > cartao.clientHeight + 1,
      quando: t('.cartao-evento .quando', 80).trim(),
    };
  };
  const botaoDoAno = () => {
    const bs = todos('.palco button');
    return bs.find((b) => b.classList.contains('viver')) || bs.find((b) => /viver mais 1 ano|\+1 ano|só viver/i.test(b.textContent || ''));
  };
  const r = { eventos: [], acoes: 0, anos: 0, travou: null, idade: null };
  for (let passo = 0; passo < passos && r.eventos.length < maxEventos; passo++) {
    r.idade = idade();
    if (/Ver o cartão da vida/.test(t('.palco', 2000))) break;
    if (q('.veu')) {
      r.travou = `uma folha abriu sozinha aos ${r.idade}`;
      break;
    }
    if (q('.cartao-evento')) {
      r.eventos.push(medirEvento());
      const i = qual(todos('.cartao-evento .opcao:not([disabled])').length || 1);
      if (!(await tocar(() => todos('.cartao-evento .opcao:not([disabled])')[i]))) r.travou = `evento sem resposta aos ${r.idade}`;
    } else if (q('.opcoes-acao')) {
      const i = qual(todos('.palco .opcoes-acao button:not([disabled])').length || 1);
      if (!(await tocar(() => todos('.palco .opcoes-acao button:not([disabled])')[i]))) r.travou = `lista de ações sem resposta aos ${r.idade}`;
      r.acoes++;
    } else if (botaoDoAno()) {
      const n = todos('.palco .verbos button').length;
      if (n && sorteio() < 0.6) {
        const i = qual(n);
        if (!(await tocar(() => todos('.palco .verbos button')[i]))) r.travou = `verbo sem resposta aos ${r.idade}`;
      } else {
        if (!(await tocar(botaoDoAno))) r.travou = `o ano não passou aos ${r.idade}`;
        r.anos++;
      }
    } else r.travou = `tela sem evento, sem lista e sem botão do ano aos ${r.idade}`;
    if (r.travou) break;
  }
  return r;
}

/** Uma vida jogada do nascimento (a vida de cada semente é sempre a mesma, em qualquer letra e tela). */
async function tarefaVida(browser, c) {
  const { ctx, page, erros } = await abrir(browser, { ...c, save: null, relogio: true });
  try {
    await page.getByRole('button', { name: /^Nascer/ }).first().click();
    await page.waitForSelector('.palco', { timeout: 10000 });
    const r = await page.evaluate(jogarNaPagina, { semente: c.semente, eventos: c.eventos, passos: 450 });
    return { tipo: 'vida', ...c, rotulo: `vida ${c.semente} ${c.w}×${c.h} k${c.k.toFixed(2)}`, erros, ...r };
  } finally {
    await ctx.close();
  }
}

/** f16: toque duplo (150 ms) numa opção de cada evento, desde o nascimento. Conta quantas vezes o 2º toque passa o ano. */
async function tarefaDuploEvento(browser, c) {
  const { ctx, page, erros } = await abrir(browser, { ...c, save: null });
  let s = 5;
  const sorteio = () => (s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  const r = { tipo: 'duploEvento', ...c, rotulo: `${c.w}×${c.h} k${c.k.toFixed(2)}`, eventos: 0, passouAno: 0, toqueUnicoFalhou: 0, travou: 0, erros };
  try {
    await page.getByRole('button', { name: /^Nascer/ }).first().click();
    await page.waitForSelector('.palco', { timeout: 10000 });
    for (let i = 0; i < 500 && r.eventos < c.eventos; i++) {
      const e = await estado(page);
      if (e.fim) break;
      if (e.veu) {
        await page.keyboard.press('Escape');
        await espera(150);
        if ((await estado(page)).veu) break;
        continue;
      }
      if (e.evento) {
        await espera(480);
        const ops = page.locator('.cartao-evento .opcao:not([disabled])');
        const n = await ops.count();
        if (!n) {
          r.travou++;
          break;
        }
        const pt = await centro(ops.nth(Math.floor(sorteio() * n)));
        if (!pt) break;
        await page.touchscreen.tap(pt[0], pt[1]);
        await espera(150);
        const meio = await estado(page);
        if (meio.evento === e.evento && meio.idade === e.idade) r.toqueUnicoFalhou++;
        await page.touchscreen.tap(pt[0], pt[1]);
        await espera(300);
        const depois = await estado(page);
        if (e.idade !== null && depois.idade !== null && depois.idade > e.idade) r.passouAno++;
        r.eventos++;
        continue;
      }
      if (e.lista) {
        await page.getByRole('button', { name: /^Voltar/ }).first().click();
        continue;
      }
      if (e.ano) {
        if (!(await avancar(page))) {
          r.travou++;
          break;
        }
        continue;
      }
      await espera(200);
    }
    return r;
  } finally {
    await ctx.close();
  }
}

/** f15: toque duplo (120 ms) no botão do ano e na opção do evento, a partir do save real. */
async function tarefaDuploViver(browser, c) {
  const { ctx, page, erros } = await abrir(browser, c);
  const r = { tipo: 'duploViver', ...c, rotulo: rotulo(c), duplos: 0, doisAnos: 0, eventos: 0, eventoPassouAno: 0, erros };
  try {
    for (let i = 0; i < 16; i++) {
      const e = await estado(page);
      if (e.fim || e.veu) break;
      if (e.evento) {
        await espera(500);
        const pt = await centro(page.locator('.cartao-evento .opcao:not([disabled])').last());
        if (!pt) break;
        await page.touchscreen.tap(pt[0], pt[1]);
        await espera(120);
        await page.touchscreen.tap(pt[0], pt[1]);
        await espera(400);
        r.eventos++;
        const d = await estado(page);
        if (e.idade !== null && d.idade !== null && d.idade > e.idade) r.eventoPassouAno++;
        continue;
      }
      const pt = await centro(await botaoDoAno(page));
      if (!pt) break;
      await page.touchscreen.tap(pt[0], pt[1]);
      await espera(120);
      await page.touchscreen.tap(pt[0], pt[1]);
      await espera(400);
      const d = await estado(page);
      r.duplos++;
      if (e.idade !== null && d.idade !== null && d.idade - e.idade >= 2) r.doisAnos++;
    }
    return r;
  } finally {
    await ctx.close();
  }
}

/** f13: toque duplo (120 ms) em cada verbo: o 2º toque escolhe uma ação sem a pessoa ver a lista? */
async function tarefaDuploVerbos(browser, c) {
  const res = [];
  for (let i = 0; i < 8; i++) {
    const { ctx, page } = await abrir(browser, c);
    try {
      const verbos = page.locator('.palco .verbos button');
      if (i >= (await verbos.count())) break;
      const nome = ((await verbos.nth(i).textContent()) || '').trim().slice(0, 20);
      const pt = await centro(verbos.nth(i));
      const antes = await estado(page);
      await page.touchscreen.tap(pt[0], pt[1]);
      await espera(120);
      await page.touchscreen.tap(pt[0], pt[1]);
      await espera(400);
      const depois = await estado(page);
      res.push({ verbo: nome, agiu: depois.entradas !== antes.entradas || depois.anos !== antes.anos || depois.idade !== antes.idade });
    } finally {
      await ctx.close();
    }
  }
  return { tipo: 'duploVerbos', ...c, rotulo: rotulo(c), verbos: res };
}

/** Item 4: depois de um +1 ano, o começo da história nova à vista. */
async function tarefaAvanco(browser, c) {
  const { ctx, page, erros } = await abrir(browser, { ...c, relogio: true });
  try {
    const antes = await estado(page);
    const ok = await avancar(page);
    // O ano que começa com um evento só escreve a história depois da resposta: responde (a primeira opção) e mede.
    let eventos = 0;
    while (eventos < 6 && (await page.$('.cartao-evento')) && (await responderEvento(page, () => 0))) eventos++;
    await quadros(page);
    await espera(250);
    const m = await page.evaluate(([nAntes, nEventos]) => {
      const vida = document.querySelector('main.vida') || document.querySelector('main');
      const vr = vida.getBoundingClientRect();
      let novas = [...vida.querySelectorAll('.entrada.nova')];
      if (!novas.length) novas = [...vida.querySelectorAll('li.ano')].slice(nAntes).map((li) => li.querySelector('.entrada') || li);
      // O balanço do ano e os aluguéis (pílula hoje, linha depois de C1): pela classe ou pelo começo do texto.
      const BAL = /^\s*(no ano[,:]\s*[+−-]|aluguéis[,:]\s*\+)/i;
      const eBalanco = (el) => /balan|alugue/i.test(typeof el.className === 'string' ? el.className : '') || BAL.test(el.textContent || '');
      const nos = (raiz) => {
        const out = [];
        const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.data.trim() && !n.parentElement.closest('.so-leitor')) out.push(n);
        return out;
      };
      const rects = (n) => {
        const r = document.createRange();
        r.selectNodeContents(n);
        return [...r.getClientRects()].filter((x) => x.width > 0.5 && x.height > 0.5);
      };
      const linhaDe = (el) => {
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight);
        return Number.isFinite(lh) ? lh : parseFloat(cs.fontSize) * 1.45;
      };
      const contarLinhas = (rs) => {
        const ls = [];
        for (const x of [...rs].sort((a, b) => a.top - b.top)) {
          const l = ls.find((y) => Math.min(y.bottom, x.bottom) - Math.max(y.top, x.top) > 0.4 * Math.min(y.bottom - y.top, x.height));
          if (l) {
            l.top = Math.min(l.top, x.top);
            l.bottom = Math.max(l.bottom, x.bottom);
          } else ls.push({ top: x.top, bottom: x.bottom });
        }
        return ls.length;
      };
      if (!novas.length) return { novas: 0 };
      // A primeira linha de texto da primeira entrada nova.
      const primeiroNo = nos(novas[0])[0];
      const r0 = primeiroNo ? rects(primeiroNo)[0] : novas[0].getBoundingClientRect();
      const primeiraNaFaixa = r0.top >= vr.top - 1 && r0.bottom <= vr.bottom + 1;
      // Linhas de texto narrativo à vista (os parágrafos das entradas novas, sem o balanço).
      let linhas = 0;
      for (const e of novas) {
        for (const p of e.querySelectorAll(':scope > p')) {
          if (eBalanco(p)) continue;
          const b = p.getBoundingClientRect();
          const vis = Math.max(0, Math.min(b.bottom, vr.bottom) - Math.max(b.top, vr.top));
          linhas += vis / linhaDe(p);
        }
      }
      // Os elementos do balanço: o mais de dentro que começa pelo balanço (ou tem a classe), e todo o texto deles.
      const doBalanco = novas.flatMap((e) => [...e.querySelectorAll('*')].filter((el) => eBalanco(el) && ![...el.children].some(eBalanco)));
      const balanco = [...new Set(doBalanco)].flatMap((el) => nos(el).flatMap(rects));
      return { novas: novas.length, respondidos: nEventos, primeiraNaFaixa, linhasNarrativas: +linhas.toFixed(1), linhasDoBalanco: balanco.length ? contarLinhas(balanco) : 0, temBalanco: balanco.length > 0, evento: !!document.querySelector('.cartao-evento') };
    }, [antes.anos, eventos]);
    return { tipo: 'avanco', ...c, rotulo: rotulo(c), avancou: ok, erros, ...m };
  } finally {
    await ctx.close();
  }
}

/** Item 5: o bebê (sem ações no ano) vê o botão do ano principal, em ouro. */
async function tarefaBebe(browser, c) {
  const { ctx, page, erros } = await abrir(browser, { ...c, save: null });
  try {
    await page.getByRole('button', { name: /^Nascer/ }).first().click();
    await page.waitForSelector('.palco', { timeout: 10000 });
    for (let i = 0; i < 6; i++) {
      const e = await estado(page);
      if (!e.evento) break;
      await espera(500);
      await page.locator('.cartao-evento .opcao:not([disabled])').first().click();
      await espera(250);
    }
    const m = await page.evaluate(medirTela, { rotulos: [] });
    return { tipo: 'bebe', ...c, rotulo: rotulo({ ...c, save: 'bebê' }), erros, modo: m.modo, verbos: m.verbos.length, botao: m.botao };
  } finally {
    await ctx.close();
  }
}

const ABRIR_FOLHA = {
  familia: ['button[aria-label="Família"]'],
  carreira: ['button[aria-label="Carreira e poder"]', 'button[aria-label*="Carreira"]'],
  dinheiro: ['button[aria-label="Dinheiro e investimentos"]', 'button[aria-label*="Dinheiro"]'],
  pais: ['button[aria-label*="ver o país"]', '.chip-pais', 'button[aria-label*="país"]', '.cabecalho button:text-matches("[0-9]{4}")', '.cabecalho a:text-matches("[0-9]{4}")'],
  menu: ['button[aria-label="Menu"]'],
};

async function abrirFolha(page, folha) {
  for (const sel of ABRIR_FOLHA[folha]) {
    const l = page.locator(sel);
    const n = await l.count();
    for (let i = 0; i < n; i++) {
      if (!(await l.nth(i).isVisible())) continue;
      await l.nth(i).click({ timeout: 3000 });
      await page.waitForSelector('.veu, [role=dialog]', { timeout: 3000 });
      await quadros(page);
      return true;
    }
  }
  return false;
}

function medirFolha() {
  const veu = document.querySelector('.veu') || document.querySelector('[role=dialog]');
  if (!veu) return null;
  const folha = veu.querySelector('.folha') || veu.firstElementChild || veu;
  const fr = folha.getBoundingClientRect();
  const texto = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const fechar = [...veu.querySelectorAll('button')]
    .filter((b) => /^(voltar|fechar|continuar esta vida)\b/i.test(texto(b)) || /^(fechar|voltar)/i.test(b.getAttribute('aria-label') || ''))
    .map((b) => {
      const r = b.getBoundingClientRect();
      return { texto: texto(b).slice(0, 24) || b.getAttribute('aria-label'), doTopo: Math.round(r.top - fr.top), naTela: r.height > 0 && r.top >= -1 && r.bottom <= innerHeight + 1 };
    });
  const rolaveis = [folha, ...folha.querySelectorAll('*')].filter((e) => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1);
  const rol = rolaveis.sort((a, b) => b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight))[0] || folha;
  const poder = [...veu.querySelectorAll('legend, h2, h3, h4, summary')].find((e) => /^\s*poder\b/i.test(e.textContent || ''));
  const atributos = [...veu.querySelectorAll('.atributo .rotulo')].slice(0, 3).map((el) => {
    const s = el.querySelector('span');
    const b = el.querySelector('b');
    return { display: getComputedStyle(el).display, gap: s && b ? Math.round(b.getBoundingClientRect().left - s.getBoundingClientRect().right) : null };
  });
  const testamento = veu.querySelector('fieldset.testamento') || [...veu.querySelectorAll('fieldset')].find((f) => /testamento/i.test(f.querySelector('legend')?.textContent || ''));
  const cv = getComputedStyle(veu);
  const desfoque = [cv.backdropFilter, cv.webkitBackdropFilter].find((f) => f && f !== 'none') || 'none';
  return {
    fechar,
    desfoque,
    telas: +(rol.scrollHeight / Math.max(1, rol.clientHeight)).toFixed(1),
    poderY: poder ? Math.round(poder.getBoundingClientRect().top - rol.getBoundingClientRect().top + rol.scrollTop) : null,
    cargoDePoder: ((veu.innerText || '').match(/você tem um cargo de poder/gi) || []).length,
    atributos,
    testamentoBorda: testamento ? parseFloat(getComputedStyle(testamento).borderTopWidth) : null,
    tituloMenu: document.querySelector('#titulo-menu')?.textContent.trim() ?? null,
  };
}

/** f4 e item 9: abre cada folha, mede onde fica o fechar e o que o plano pede de cada uma, e fecha. */
async function tarefaFolhas(browser, c) {
  const { ctx, page, erros } = await abrir(browser, c);
  const folhas = {};
  try {
    for (const f of Object.keys(ABRIR_FOLHA)) {
      if (!(await abrirFolha(page, f))) {
        folhas[f] = { semBotao: true };
        continue;
      }
      folhas[f] = await page.evaluate(medirFolha);
      await page.keyboard.press('Escape');
      await espera(150);
      if (await page.$('.veu')) {
        const fechar = page.locator('.veu button').filter({ hasText: /^(Voltar|Fechar|Continuar esta vida)/ });
        if (await fechar.count()) await fechar.first().click();
        await espera(150);
      }
      if (await page.$('.veu')) {
        await page.reload();
        await page.waitForSelector('.palco');
      }
    }
    return { tipo: 'folhas', ...c, rotulo: rotulo(c), erros, folhas };
  } finally {
    await ctx.close();
  }
}

/** f20: o voltar do sistema com uma folha aberta fecha a folha ou sai do jogo? */
async function tarefaVoltar(browser, c) {
  const { ctx, page, erros } = await abrir(browser, { ...c, antes: 'about:blank' });
  try {
    if (!(await abrirFolha(page, 'dinheiro'))) return { tipo: 'voltar', ...c, rotulo: rotulo(c), erros, semBotao: true };
    await page.goBack({ timeout: 3000 }).catch(() => null);
    await espera(400);
    const url = page.url();
    const veu = url.startsWith('http') ? !!(await page.$('.veu').catch(() => null)) : false;
    return { tipo: 'voltar', ...c, rotulo: rotulo(c), erros, url, noJogo: url.startsWith(URL_BASE.replace(/\/$/, '')), folhaAberta: veu };
  } finally {
    await ctx.close();
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Estáticos: o código de src/ui/

function estaticos() {
  const ui = path.join(FONTE, 'src/ui');
  const estilo = fs.readFileSync(path.join(ui, 'estilo.css'), 'utf8');
  const linhasCom = (s) => estilo.split('\n').filter((l) => l.includes(s)).length;
  // As classes que têm regra: tudo o que aparece num seletor (o que vem antes de cada "{").
  const semComentarios = estilo.replace(/\/\*[\s\S]*?\*\//g, '');
  const comRegra = new Set();
  let buf = '';
  for (const ch of semComentarios) {
    if (ch === '{') {
      for (const m of buf.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) comRegra.add(m[1]);
      buf = '';
    } else if (ch === '}' || ch === ';') buf = '';
    else buf += ch;
  }
  // As classes usadas nos componentes: class="…", class={`…`} (o texto e as aspas de dentro), class={a ? 'x' : 'y'} e classe="…".
  const usadas = new Map();
  const anotar = (texto, arq) => {
    for (const t of texto.split(/\s+/)) if (/^-?[_a-zA-Z][\w-]*$/.test(t)) usadas.set(t, usadas.get(t) || arq);
  };
  // Numa expressão, só os textos que podem virar classe: n['popularidade'] (chave) e fase === 'crise' (comparação) não contam.
  const literais = (expr, arq) => {
    for (const m of expr.matchAll(/'([^'`]*)'|"([^"`]*)"/g)) {
      const antes = expr.slice(0, m.index).trimEnd();
      const depois = expr.slice(m.index + m[0].length).trimStart();
      if (/(\[|[=!]==?)$/.test(antes) || /^(\]|[=!]==?)/.test(depois)) continue;
      anotar(m[1] ?? m[2], arq);
    }
  };
  for (const arq of fs.readdirSync(ui).filter((f) => f.endsWith('.tsx'))) {
    const src = fs.readFileSync(path.join(ui, arq), 'utf8');
    for (const m of src.matchAll(/\b(?:class|className|classe)="([^"]*)"/g)) anotar(m[1], arq);
    for (const m of src.matchAll(/\b(?:class|className|classe)=\{`([^`]*)`\}/g)) {
      anotar(m[1].replace(/\$\{[^}]*\}/g, ' '), arq);
      for (const e of m[1].matchAll(/\$\{([^}]*)\}/g)) literais(e[1], arq);
    }
    for (const m of src.matchAll(/\b(?:class|className|classe)=\{(?!`)([^}]*)\}/g)) literais(m[1], arq);
  }
  const orfas = [...usadas].filter(([c]) => !comRegra.has(c)).map(([c, arq]) => `${c} (${arq})`);
  return { tipo: 'estatico', letraGrande: linhasCom('letra-grande'), destaque: linhasCom('var(--destaque'), brilho: linhasCom('var(--brilho'), orfas, classesUsadas: usadas.size };
}

// ---------------------------------------------------------------------------------------------------------------
// O plano das medidas

const passos = (de, ate, passo) => {
  const out = [];
  for (let i = 0; de + i * passo <= ate + 1e-9; i++) out.push(+(de + i * passo).toFixed(2));
  return out;
};
const VISTAS = [
  [360, 780, 1.0],
  [360, 780, 1.15],
  [360, 780, 1.3],
  [360, 780, 1.45],
  [390, 844, 1.0],
  [390, 844, 1.15],
  [412, 915, 1.0],
  [320, 640, 1.0],
  [320, 640, 1.15],
];
const PRINCIPAIS = ['real', 'marco', 's75', 'filhos'];

function planejar() {
  const tarefas = [];
  /**
   * peso: as tarefas longas saem primeiro. espera: a tarefa passa quase todo o tempo parada (os toques duplos esperam a
   * carência de verdade) e roda numa fila própria, ao lado das que calculam, sem ocupar um núcleo.
   */
  const tarefa = (peso, nome, f, espera = false) => tarefas.push({ peso, nome, f, espera });
  const telas = new Map();
  const tela = (c) => {
    const chave = `${c.save}|${c.w}|${c.h}|${c.k}|${c.tema}`;
    const ja = telas.get(chave);
    if (ja) Object.assign(ja, { ...c, grupos: [...new Set([...ja.grupos, ...c.grupos])], foto: ja.foto || c.foto, cores: ja.cores || c.cores, chips: ja.chips || c.chips });
    else telas.set(chave, { ...c });
  };
  if (ativos.has('vidas')) {
    // Item 3: três vidas em 360 × 780 com 1,15 e com 1,45 (a mediana da linha do tempo nos eventos) e uma com 1,5 em
    // 360 × 780 e em 412 × 915 (as opções de todo evento inteiras na tela). Os 45 primeiros eventos de cada vida (até
    // uns 60 anos) dão a mesma mediana da vida inteira (72 e 43 px em cfe3101) em dois terços do tempo.
    const vidas = [...[1.15, 1.45].flatMap((k) => [7, 11, 13].map((semente) => [360, 780, k, semente])), [360, 780, 1.5, 7], [412, 915, 1.5, 11]];
    for (const [w, h, k, semente] of vidas) tarefa(8, `vida ${semente} ${w}×${h} k${k}`, (b) => tarefaVida(b, { w, h, k, tema: 'dark', semente, eventos: 45 }));
  }
  if (ativos.has('toques')) {
    for (const [w, h, k] of [
      [360, 780, 1.15],
      [390, 844, 1.0],
    ]) {
      tarefa(9, `toque duplo nos eventos ${w}×${h} k${k}`, (b) => tarefaDuploEvento(b, { w, h, k, tema: 'dark', eventos: 40 }), true);
      tarefa(3, `toque duplo nos verbos ${w}×${h} k${k}`, (b) => tarefaDuploVerbos(b, { save: 'real', w, h, k, tema: 'dark' }), true);
    }
    tarefa(3, 'toque duplo no ano', (b) => tarefaDuploViver(b, { save: 'real', w: 360, h: 780, k: 1.15, tema: 'dark' }), true);
  }
  if (ativos.has('matriz')) {
    for (const save of [...PRINCIPAIS, 'evento']) for (const tema of ['dark', 'light']) for (const [w, h, k] of VISTAS) tela({ save, w, h, k, tema, grupos: ['matriz'] });
  }
  if (ativos.has('varredura')) {
    for (const save of ['real', 'evento'])
      for (const [w, h] of [
        [360, 780],
        [412, 915],
      ])
        for (const k of passos(1, 1.5, 0.02)) tela({ save, w, h, k, tema: 'dark', grupos: ['varredura'] });
    for (const save of ['marco', 's75', 'filhos']) for (const k of passos(1, 1.5, 0.05)) tela({ save, w: 360, h: 780, k, tema: 'dark', grupos: ['varredura'] });
    for (const k of passos(1, 1.5, 0.05)) tela({ save: 'real', w: 320, h: 640, k, tema: 'dark', grupos: ['varredura'] });
  }
  if (ativos.has('cores')) {
    for (const tema of ['dark', 'light']) {
      for (const k of [1.15, 1.45]) tela({ save: 'real', w: 360, h: 780, k, tema, grupos: ['cores'], foto: true });
      tela({ save: 'novos', w: 360, h: 780, k: 1.15, tema, grupos: ['cores'], cores: true });
    }
    for (const save of PRINCIPAIS) tela({ save, w: 360, h: 780, k: 1.15, tema: 'light', grupos: ['cores'], chips: true });
    for (const k of [1.0, 1.15, 1.3, 1.45]) tela({ save: 'novos', w: 360, h: 780, k, tema: 'dark', grupos: ['cores'] });
  }
  if (ativos.has('avanco')) {
    for (const save of PRINCIPAIS) for (const k of [1.15, 1.45]) tarefa(1, `avanço ${save} k${k}`, (b) => tarefaAvanco(b, { save, w: 360, h: 780, k, tema: 'dark' }));
    tarefa(1, 'bebê', (b) => tarefaBebe(b, { w: 360, h: 780, k: 1.15, tema: 'dark' }));
  }
  if (ativos.has('folhas')) {
    for (const save of ['real', 's75']) for (const k of [1.15, 1.45]) tarefa(2, `folhas ${save} k${k}`, (b) => tarefaFolhas(b, { save, w: 360, h: 780, k, tema: 'dark' }));
    tarefa(1, 'voltar do sistema', (b) => tarefaVoltar(b, { save: 'real', w: 360, h: 780, k: 1, tema: 'dark' }));
  }
  for (const c of telas.values()) tarefa(1, rotulo(c), (b) => tarefaTela(b, c));
  return tarefas;
}

// ---------------------------------------------------------------------------------------------------------------
// Os critérios (itens 1 a 9 do plano)

const fmt = (v) => (typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',')) : String(v));

function avaliar(res) {
  const telas = res.filter((r) => r.tipo === 'tela' && !r.falha);
  const de = (tipo) => res.filter((r) => r.tipo === tipo && !r.falha);
  const principal = (m) => m.modo === 'principal' && PRINCIPAIS.includes(m.save);
  const naoSobrenome = (m) => m.cortados.filter((c) => !c.sobrenome);
  const out = [];
  /**
   * Um critério: as medidas que entram, o valor de cada uma e o limite. O pior caso decide.
   * lista vazia = "sem medida", que reprova (o critério não pode passar sem ser medido).
   */
  const criterio = (item, nome, medidas, valor, cmp, limite, extra = {}) => {
    const vals = medidas.map((m) => ({ m, v: valor(m) })).filter((x) => x.v !== null && x.v !== undefined && !Number.isNaN(x.v));
    if (!vals.length) {
      out.push({ item, nome, valor: 'sem medida', limite: `${cmp} ${fmt(limite)}`, ok: false, onde: '' });
      return;
    }
    const pior = vals.reduce((a, b) => (cmp === '≤' ? (b.v > a.v ? b : a) : b.v < a.v ? b : a));
    const ok = cmp === '≤' ? pior.v <= limite : pior.v >= limite;
    out.push({ item, nome, valor: extra.mostrar ? extra.mostrar(pior) : fmt(pior.v), limite: `${cmp} ${fmt(limite)}`, ok, onde: ok ? `${vals.length} medidas` : `${pior.m.rotulo}${extra.porque ? `: ${extra.porque(pior.m)}` : ''}` });
  };
  const media = (item, nome, medidas, valor, limite) => {
    if (!medidas.length) return out.push({ item, nome, valor: 'sem medida', limite: `≥ ${limite}`, ok: false, onde: '' });
    const v = medidas.reduce((s, m) => s + valor(m), 0) / medidas.length;
    out.push({ item, nome, valor: fmt(Math.round(v)), limite: `≥ ${limite}`, ok: v >= limite, onde: medidas.map((m) => `${m.save} ${valor(m)}`).join(', ') });
  };
  const k = (m, ...ks) => ks.some((x) => Math.abs(m.k - x) < 1e-6);

  // 0. Sanidade: as medidas valem.
  const ruins = res.filter((r) => r.falha || (r.erros || []).length || r.aviso || r.travou);
  out.push({
    item: 0,
    nome: 'todas as medidas rodaram (sem erro de JavaScript, sem aviso de save, nenhuma vida travada)',
    valor: ruins.length,
    limite: '= 0',
    ok: ruins.length === 0,
    onde: ruins
      .map((r) => `${r.rotulo}: ${r.falha || (r.erros || [])[0] || r.aviso || r.travou}`)
      .slice(0, 3)
      .join(' | '),
  });

  const est = res.find((r) => r.tipo === 'estatico');
  if (ativos.has('estatico') && est) {
    out.push({ item: 1, nome: 'letra-grande em estilo.css (linhas)', valor: est.letraGrande, limite: '= 0', ok: est.letraGrande === 0, onde: 'src/ui/estilo.css' });
  }
  if (ativos.has('varredura')) {
    const series = new Map();
    for (const m of telas.filter((m) => m.grupos.includes('varredura') && ['real', 'evento'].includes(m.save) && m.w !== 320)) {
      const ch = `${m.save} ${m.w}×${m.h}`;
      if (!series.has(ch)) series.set(ch, []);
      series.get(ch).push(m);
    }
    const saltos = [...series].map(([ch, ms]) => {
      ms.sort((a, b) => a.k - b.k);
      let pior = { v: -Infinity, onde: ch };
      for (let i = 1; i < ms.length; i++) {
        const d = ms[i].vida - ms[i - 1].vida;
        if (d > pior.v) pior = { v: d, onde: `${ch} de k${ms[i - 1].k.toFixed(2)} (${ms[i - 1].vida}) para k${ms[i].k.toFixed(2)} (${ms[i].vida})` };
      }
      return pior;
    });
    const pior = saltos.reduce((a, b) => (b.v > a.v ? b : a), { v: -Infinity, onde: '' });
    out.push({ item: 1, nome: 'linha do tempo não sobe mais de 4 px entre passos de 0,02 (1,0–1,5; 360 e 412; real e evento)', valor: series.size ? `${fmt(Math.round(pior.v))} px` : 'sem medida', limite: '≤ 4 px', ok: series.size > 0 && pior.v <= 4, onde: pior.onde });
  }

  if (ativos.has('matriz') || ativos.has('varredura')) {
    const princ = telas.filter(principal);
    criterio(2, 'cabeçalho com letra 1,0 (larguras ≥ 360)', princ.filter((m) => m.w >= 360 && k(m, 1)), (m) => m.cab, '≤', 205);
    criterio(2, 'cabeçalho com letra 1,15', princ.filter((m) => m.w >= 360 && k(m, 1.15)), (m) => m.cab, '≤', 230);
    criterio(2, 'cabeçalho com letra 1,45', princ.filter((m) => m.w >= 360 && k(m, 1.45)), (m) => m.cab, '≤', 280);
    criterio(2, 'faixa da história (% da altura) em 360×780 e 390×844 com 1,0 e 1,15', princ.filter((m) => [360, 390].includes(m.w) && m.h !== 640 && k(m, 1, 1.15)), (m) => m.historiaPct, '≥', 33);
    criterio(2, 'faixa da história (% da altura) com 1,45', princ.filter((m) => m.w === 360 && m.h === 780 && k(m, 1.45)), (m) => m.historiaPct, '≥', 25);
    media(2, 'texto narrativo visível da última entrada, média dos 4 saves (360×780, 1,15)', princ.filter((m) => m.w === 360 && m.h === 780 && k(m, 1.15) && m.tema === 'dark'), (m) => m.textoUltima, 120);
    criterio(
      2,
      'cortados além do sobrenome (360 px de 1,0 a 1,5; 320×640 com 1,0 e 1,15)',
      princ.filter((m) => (m.w === 360 && m.h === 780) || (m.w === 320 && k(m, 1, 1.15))),
      (m) => naoSobrenome(m).length,
      '≤',
      0,
      { porque: (m) => naoSobrenome(m).map((c) => `${c.el} "${c.texto}"`).slice(0, 4).join(', ') },
    );
    criterio(2, '"R$" com reticências ou recortado (todas as telas)', telas, (m) => m.cortados.filter((c) => c.texto.includes('R$')).length, '≤', 0, {
      porque: (m) => m.cortados.filter((c) => c.texto.includes('R$')).map((c) => `"${c.texto}"`).slice(0, 3).join(', '),
    });
    criterio(2, `rótulos à vista no cabeçalho (${ROTULOS.join(', ')}), faltando`, princ, (m) => ROTULOS.filter((r) => !m.rotulos[r]).length, '≤', 0, {
      porque: (m) => ROTULOS.filter((r) => !m.rotulos[r]).join(', '),
    });
    criterio(2, 'textos abaixo de 12 px com letra 1,0', telas.filter((m) => k(m, 1)), (m) => m.letras12, '≤', 0, { porque: (m) => m.menoresLetras.join(', ') });
    criterio(2, 'em 320×640 com 1,0, cabeçalho ou verbos rolam por dentro', princ.filter((m) => m.w === 320 && k(m, 1)), (m) => Number(m.cabRola) + Number(m.verbosRolam), '≤', 0, {
      porque: (m) => `${m.cabRola ? 'o cabeçalho rola' : ''}${m.cabRola && m.verbosRolam ? ' e ' : ''}${m.verbosRolam ? 'os verbos rolam' : ''}`,
    });

    const ev = telas.filter((m) => m.save === 'evento' && m.modo === 'evento');
    criterio(3, 'cabeçalho durante o evento com 1,0 e 1,15 (larguras ≥ 360)', ev.filter((m) => m.w >= 360 && k(m, 1, 1.15)), (m) => m.cab, '≤', 110);
    criterio(3, 'cabeçalho durante o evento com 1,45', ev.filter((m) => m.w >= 360 && k(m, 1.45)), (m) => m.cab, '≤', 125);
    criterio(3, 'opções do evento fora da tela (1,0–1,5; 360×780 e 412×915)', ev.filter((m) => (m.w === 360 && m.h === 780) || m.w === 412), (m) => (m.opcoes.length ? m.opcoes.filter((o) => !o.inteira).length : null), '≤', 0, {
      porque: (m) => `${m.opcoes.filter((o) => !o.inteira).length} de ${m.opcoes.length}`,
    });

    const reais = telas.filter((m) => m.save === 'real' && m.modo === 'principal');
    criterio(5, 'com escolhas sobrando, o botão do ano é secundário e diz "sobram" (real; 360×780 com 1,15 e 390×844 com 1,0)', reais.filter((m) => (m.w === 360 && m.h === 780 && k(m, 1.15)) || (m.w === 390 && k(m, 1))), (m) => (m.botao ? Number(m.botao.secundario && /sobram/i.test(m.botao.texto)) : null), '≥', 1, {
      mostrar: (p) => (p.v ? 'sim' : 'não'),
      porque: (m) => `"${m.botao.texto}" (${m.botao.classes})`,
    });
    criterio(5, 'linhas do rótulo do botão do ano (1,0–1,5; 360 e 320 px)', telas.filter((m) => m.modo === 'principal' && m.botao && [320, 360].includes(m.w)), (m) => m.botao.linhas, '≤', 1, { porque: (m) => `"${m.botao.texto}" em ${m.botao.linhas} linhas, ${m.botao.alt} px` });
    criterio(5, 'altura do botão do ano até 1,15 (px)', telas.filter((m) => m.modo === 'principal' && m.botao && m.k <= 1.15 + 1e-6), (m) => m.botao.alt, '≤', 60);
    criterio(5, 'título das escolhas cortado', telas.filter((m) => m.modo === 'principal' && m.titulo), (m) => Number(!m.titulo.inteiro || m.cortados.some((c) => c.noTitulo)), '≤', 0, { porque: (m) => `"${m.titulo.texto}"` });
  }

  if (ativos.has('avanco')) {
    const av = de('avanco');
    // Sem entrada nova depois do avanço (o ano não passou, o evento não fechou), a medida reprova.
    criterio(4, 'depois de +1 ano, a primeira linha da entrada nova está na faixa (4 saves, 1,15 e 1,45)', av, (m) => (m.novas ? Number(m.primeiraNaFaixa) : 0), '≥', 1, {
      mostrar: (p) => (p.v ? 'sim' : 'não'),
      porque: (m) => (m.novas ? `${m.novas} entradas novas, ${m.respondidos} eventos respondidos` : 'nenhuma entrada nova'),
    });
    criterio(4, 'linhas de texto narrativo à vista depois de +1 ano', av, (m) => (m.novas ? m.linhasNarrativas : 0), '≥', 2);
    criterio(4, 'linhas do balanço do ano', av, (m) => (m.novas ? m.linhasDoBalanco : null), '≤', 1);
    const bebe = de('bebe');
    criterio(5, 'sem ações (o bebê), o botão do ano é o principal, em ouro', bebe, (m) => (m.botao && m.verbos === 0 ? Number(m.botao.dourado && !m.botao.secundario) : null), '≥', 1, {
      mostrar: (p) => (p.v ? 'sim' : 'não'),
      porque: (m) => m.botao?.classes ?? '',
    });
  }

  if (ativos.has('vidas')) {
    // Item 3 (f2-vida.cjs): os eventos de vidas inteiras jogadas pela interface, não só o do save.
    const vs = de('vida');
    const nos = (filtro) => vs.filter(filtro).flatMap((v) => v.eventos.map((e) => ({ ...e, rotulo: `${v.rotulo}, ${e.quando}` })));
    const em360 = (kk) => (v) => v.w === 360 && v.h === 780 && k(v, kk);
    for (const [kk, lim] of [
      [1.15, 110],
      [1.45, 70],
    ]) {
      const vidas = vs.filter(em360(kk));
      const linhas = nos(em360(kk))
        .map((e) => e.linha)
        .sort((a, b) => a - b);
      const med = linhas.length ? linhas[Math.floor(linhas.length / 2)] : null;
      const ok = med !== null && vidas.length === 3 && med >= lim;
      out.push({ item: 3, nome: `mediana da linha do tempo nos eventos de 3 vidas, 360×780 com ${kk.toFixed(2).replace('.', ',')} (px)`, valor: med ?? 'sem medida', limite: `≥ ${lim}`, ok, onde: `${linhas.length} eventos em ${vidas.length} vidas; p25 ${linhas[Math.floor(linhas.length / 4)] ?? '-'}, mínimo ${linhas[0] ?? '-'}` });
    }
    criterio(3, 'cabeçalho nos eventos das vidas, 360×780 com 1,15', nos(em360(1.15)), (e) => e.cab, '≤', 110);
    criterio(3, 'cabeçalho nos eventos das vidas, 360×780 com 1,45', nos(em360(1.45)), (e) => e.cab, '≤', 125);
    criterio(3, 'opções fora da tela nos eventos das vidas (360×780 com 1,15, 1,45 e 1,5; 412×915 com 1,5)', nos(() => true), (e) => e.foraDaTela, '≤', 0, {
      porque: (e) => `${e.foraDaTela} de ${e.opcoes} opções${e.rola ? ', o cartão rola' : ''}`,
    });
  }

  if (ativos.has('cores')) {
    const fotos = telas.filter((m) => m.corViva);
    criterio(6, 'cor viva na tela principal (% da tela; real, 360×780, 1,15 e 1,45, dois temas)', fotos, (m) => m.corViva.pct, '≤', 5, { mostrar: (p) => `${fmt(p.v)}%` });
    const cores = telas.filter((m) => m.felicidadeOuro !== undefined);
    criterio(6, 'Felicidade longe do ouro (graus de matiz, dois temas)', cores, (m) => m.felicidadeOuro, '≥', 18);
    criterio(6, 'contraste do ponto de novidade (dois temas)', cores, (m) => (m.pontos.length ? Math.min(...m.pontos) : null), '≥', 3, { mostrar: (p) => `${p.v.toFixed(2).replace('.', ',')}:1` });
    const chips = telas.filter((m) => m.chips);
    criterio(6, 'chips com texto abaixo de 4,5:1 no tema claro', chips, (m) => m.chips.abaixo, '≤', 0, { porque: (m) => (m.chips.pior ? `${m.chips.pior.k}:1 "${m.chips.pior.texto}"` : '') });
    criterio(6, 'nomes de verbo cortados (save com novidades, 1,0–1,45)', telas.filter((m) => m.save === 'novos' && m.modo === 'principal' && m.tema === 'dark'), (m) => m.verbos.filter((v) => v.cortado).length, '≤', 0, {
      porque: (m) => m.verbos.filter((v) => v.cortado).map((v) => v.nome).join(', '),
    });
    if (est) {
      out.push({ item: 6, nome: 'var(--destaque em estilo.css (linhas)', valor: est.destaque, limite: '≤ 25', ok: est.destaque <= 25, onde: 'src/ui/estilo.css' });
      out.push({ item: 6, nome: 'var(--brilho em estilo.css (linhas)', valor: est.brilho, limite: '= 0', ok: est.brilho === 0, onde: 'src/ui/estilo.css' });
    }
  }

  if (ativos.has('toques')) {
    const dev = de('duploEvento');
    criterio(7, 'toque duplo numa opção do evento passa o ano (40 eventos por tela)', dev, (m) => m.passouAno, '≤', 0, { mostrar: (p) => `${p.v} de ${p.m.eventos}` });
    criterio(7, 'eventos vistos no toque duplo (por tela)', dev, (m) => m.eventos, '≥', 40);
    criterio(7, 'um toque só, depois de 450 ms, não escolheu a opção', dev, (m) => m.toqueUnicoFalhou, '≤', 0, { mostrar: (p) => `${p.v} de ${p.m.eventos}` });
    criterio(7, 'toque duplo depois de responder um evento passa o ano (f15, save real)', de('duploViver'), (m) => (m.eventos ? m.eventoPassouAno : null), '≤', 0, { mostrar: (p) => `${p.v} de ${p.m.eventos}` });
    criterio(7, 'toque duplo num verbo age às cegas (6 verbos)', de('duploVerbos'), (m) => (m.verbos.length ? m.verbos.filter((v) => v.agiu).length : null), '≤', 0, {
      mostrar: (p) => `${p.v} de ${p.m.verbos.length}`,
      porque: (m) => m.verbos.filter((v) => v.agiu).map((v) => v.verbo).join(', '),
    });
  }

  if (ativos.has('folhas')) {
    const fo = de('folhas');
    const linhas = fo.flatMap((m) => Object.entries(m.folhas).map(([f, x]) => ({ ...x, f, rotulo: `${m.rotulo} ${f}`, m })));
    criterio(8, 'botão de fechar a ≤ 100 px do topo da folha, à vista sem rolar (todas as folhas; real e s75; 1,15 e 1,45)', linhas, (x) => (x.semBotao ? null : Math.min(...(x.fechar || []).filter((b) => b.naTela).map((b) => b.doTopo), Infinity)), '≤', 100, {
      mostrar: (p) => (p.v === Infinity ? 'nenhum à vista' : `${p.v} px`),
      porque: (x) => (x.fechar || []).map((b) => `"${b.texto}" a ${b.doTopo} px${b.naTela ? '' : ' (fora da tela)'}`).join(', ') || 'sem botão de fechar',
    });
    const sem = linhas.filter((x) => x.semBotao).map((x) => x.rotulo);
    if (sem.length) out.push({ item: 8, nome: 'folhas que não abriram', valor: sem.length, limite: '= 0', ok: false, onde: sem.join(', ') });
    criterio(8, 'véu com desfoque atrás da folha (backdrop-filter, o custo que veu-rastro.cjs mede no compositor)', linhas.filter((x) => !x.semBotao), (x) => Number(x.desfoque !== 'none'), '≤', 0, {
      mostrar: (p) => (p.v ? 'com desfoque' : 'sem'),
      porque: (x) => x.desfoque,
    });
    criterio(8, 'o voltar do sistema fecha a folha e fica no jogo', de('voltar'), (m) => (m.semBotao ? null : Number(m.noJogo && !m.folhaAberta)), '≥', 1, { mostrar: (p) => (p.v ? 'sim' : 'não'), porque: (m) => `URL ${m.url}, folha ${m.folhaAberta ? 'aberta' : 'fechada'}` });
    const fam = linhas.filter((x) => x.f === 'familia' && !x.semBotao);
    criterio(9, 'Família: rótulo do atributo em flex, px entre rótulo e número', fam, (x) => (x.atributos.length ? Math.min(...x.atributos.map((a) => (a.display === 'flex' && a.gap !== null ? a.gap : -1))) : null), '≥', 8, {
      porque: (x) => x.atributos.map((a) => `${a.display} ${a.gap}`).join(', '),
    });
    criterio(9, 'Família: borda de cima do testamento (px)', fam, (x) => x.testamentoBorda, '≤', 0);
    const car = linhas.filter((x) => x.f === 'carreira' && !x.semBotao && k(x.m, 1.15));
    criterio(9, 'Carreira: a seção Poder começa em y (px, real e s75, 1,15)', car, (x) => x.poderY, '≤', 732);
    criterio(9, 'Carreira: telas de rolagem da folha (real e s75, 1,15)', car, (x) => x.telas, '≤', 2);
    const vezes = linhas.filter((x) => x.f === 'carreira' && x.m.save === 'real' && !x.semBotao);
    const piorVezes = vezes.reduce((a, x) => (!a || Math.abs(x.cargoDePoder - 1) > Math.abs(a.cargoDePoder - 1) ? x : a), null);
    out.push({
      item: 9,
      nome: 'Carreira: "você tem um cargo de poder" na folha (real, 1,15 e 1,45)',
      valor: piorVezes ? `${piorVezes.cargoDePoder} vezes` : 'sem medida',
      limite: '= 1',
      ok: !!piorVezes && piorVezes.cargoDePoder === 1,
      onde: piorVezes ? piorVezes.rotulo : '',
    });
    criterio(9, 'Menu: o título é "Menu"', linhas.filter((x) => x.f === 'menu' && !x.semBotao), (x) => Number(x.tituloMenu === 'Menu'), '≥', 1, { mostrar: (p) => `"${p.m.tituloMenu}"` });
  }
  if (est && ativos.has('estatico')) {
    out.push({ item: 9, nome: 'classes órfãs (usadas em src/ui/*.tsx, sem regra em estilo.css)', valor: est.orfas.length, limite: '= 0', ok: est.orfas.length === 0, onde: est.orfas.slice(0, 8).join(', ') });
  }
  return out.sort((a, b) => a.item - b.item);
}

// ---------------------------------------------------------------------------------------------------------------
// Saída

const cel = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
function tabela(criterios) {
  const linhas = ['| item | critério | medida (pior caso) | limite | resultado | onde |', '|---|---|---|---|---|---|'];
  for (const c of criterios) linhas.push(`| ${c.item} | ${cel(c.nome)} | ${cel(c.valor)} | ${cel(c.limite)} | ${c.ok ? 'ok' : '**FALHOU**'} | ${cel(c.onde)} |`);
  return linhas.join('\n');
}

function detalhe(res) {
  const linhas = ['| save | tela | k | modo | cabeçalho | história | texto da última | cortados | letras < 12 | botão (linhas, px) |', '|---|---|---|---|---|---|---|---|---|---|'];
  const ms = res.filter((r) => r.tipo === 'tela' && !r.falha && r.tema === 'dark' && r.grupos.includes('matriz'));
  ms.sort((a, b) => a.save.localeCompare(b.save) || a.w - b.w || a.h - b.h || a.k - b.k);
  for (const m of ms) {
    linhas.push(`| ${m.save} | ${m.w}×${m.h} | ${m.k.toFixed(2)} | ${m.modo} | ${m.cab} | ${m.historiaPct}% | ${m.textoUltima} px | ${m.cortados.length} | ${m.letras12} | ${m.botao ? `${m.botao.linhas}, ${m.botao.alt}` : '-'} |`);
  }
  return linhas.join('\n');
}

// ---------------------------------------------------------------------------------------------------------------

async function main() {
  const inicio = Date.now();
  const navegador = NO_NAVEGADOR.some((g) => ativos.has(g));
  const usados = navegador ? ['real', 'marco', 'evento', 's75', 'filhos', 'novos'] : [];
  if (navegador) {
    try {
      const r = await fetch(URL_BASE);
      if (!r.ok) sair(2, `${URL_BASE} respondeu ${r.status}`);
    } catch (e) {
      sair(2, `${URL_BASE} fora do ar (${e.cause?.code || e.message}). Suba a build: npx vite build && npx vite preview --port 4176 --strictPort`);
    }
    try {
      for (const s of usados) lerSave(s);
    } catch (e) {
      sair(2, e.message);
    }
  }
  const tarefas = navegador ? planejar().sort((a, b) => b.peso - a.peso) : [];
  const total = tarefas.length;
  const resultados = [];
  if (ativos.has('estatico') || ativos.has('cores')) resultados.push(estaticos());
  if (tarefas.length) {
    const { chromium } = carregarPlaywright();
    const browser = await chromium.launch();
    // Duas filas: as que esperam (todas ao mesmo tempo) e as que calculam (PARALELO de cada vez). Com --paralelo=1, uma só.
    const filas = PARALELO === 1 ? [[tarefas, 1]] : [[tarefas.filter((t) => t.espera), Infinity], [tarefas.filter((t) => !t.espera), PARALELO]];
    let feitas = 0;
    const rodar = async (fila) => {
      while (fila.length) {
        const t = fila.shift();
        const t0 = Date.now();
        try {
          resultados.push({ ...(await t.f(browser)), ms: Date.now() - t0 });
        } catch (e) {
          resultados.push({ tipo: 'falha', falha: String(e.message || e).split('\n')[0].slice(0, 160), rotulo: t.nome, ms: Date.now() - t0 });
        }
        feitas++;
        if (process.stdout.isTTY) process.stdout.write(`\r${feitas}/${total} medidas`);
      }
    };
    await Promise.all(filas.flatMap(([fila, n]) => Array.from({ length: Math.min(n, fila.length) }, () => rodar(fila))));
    await browser.close();
    if (process.stdout.isTTY) process.stdout.write('\r');
  }

  const criterios = avaliar(resultados);
  const segundos = ((Date.now() - inicio) / 1000).toFixed(0);
  const reprovados = criterios.filter((c) => !c.ok);
  const caminho = (p) => (p.startsWith(RAIZ) ? path.relative(RAIZ, p) || '.' : p);
  console.log(`## npm run telas: ${navegador ? URL_BASE : 'só o código'}`);
  console.log('');
  console.log(`${total} medidas em ${segundos} s (paralelo ${PARALELO}; grupos ${[...ativos].join(', ')}); código de ${caminho(FONTE)}${usados.length ? `; saves: ${usados.map((s) => `${s} ← ${caminho(saves[s].origem)}`).join('; ')}` : ''}`);
  console.log('');
  console.log(tabela(criterios));
  if (opcao('detalhe', false)) {
    console.log('');
    console.log(detalhe(resultados));
  }
  console.log('');
  console.log(reprovados.length ? `${reprovados.length} de ${criterios.length} critérios falharam.` : `Os ${criterios.length} critérios passaram.`);
  const json = opcao('json', '');
  if (json) fs.writeFileSync(String(json), JSON.stringify({ url: URL_BASE, segundos: Number(segundos), criterios, resultados }, null, 1));
  const md = opcao('md', '');
  if (md) fs.writeFileSync(String(md), `${tabela(criterios)}\n`);
  process.exit(reprovados.length ? 1 : 0);
}

main().catch((e) => sair(2, e.stack || String(e)));
