import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    // Os testes de vida inteira simulam centenas de vidas: o limite padrão de 5 s é curto em máquina lenta.
    testTimeout: 60000,
  },
});
