/*
 * 版权所有 (c) 华为技术有限公司 2026
 */
import { fileURLToPath } from 'node:url';
import { defineProject, mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.js';

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  })
);
