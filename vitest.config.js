/*
 * 版权所有 (c) 华为技术有限公司 2026
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.js'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'clover'],
      include: ['**/utils/**', '**/shared/utils.ts', '**/shared/utils.js'],
      exclude: ['**/harmony/**', 'node_modules/**', 'dist/**', 'public/**', '**.test.ts'],
    },
  },
});
