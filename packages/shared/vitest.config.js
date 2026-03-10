/*
 * 版权所有 (c) 华为技术有限公司 2026
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});