import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env['BASE_PATH'] ?? '/',
  oxc: { jsx: { runtime: 'automatic', importSource: 'preact' } },
});
