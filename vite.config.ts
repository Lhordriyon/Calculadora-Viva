import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// No GitHub Pages o jogo mora em /<repositório>/; o workflow passa BASE_PATH.
// O app Android (ALVO=android) leva os arquivos dentro do APK: caminhos relativos e sem service worker.
const android = process.env['ALVO'] === 'android';
const base = android ? './' : (process.env['BASE_PATH'] ?? '/');

export default defineConfig({
  base,
  oxc: { jsx: { runtime: 'automatic', importSource: 'preact' } },
  build: { target: 'es2022', outDir: android ? 'dist-android' : 'dist' },
  plugins: [
    !android &&
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Trajetória',
        short_name: 'Trajetória',
        description: 'Uma vida inteira em poucos minutos. Cada escolha deixa marca, e algumas voltam décadas depois.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#c2462a',
        background_color: '#f6f1e9',
        categories: ['games', 'entertainment'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
