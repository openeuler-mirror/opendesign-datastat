import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  base: '/',
  build: {
    outDir: '../../dist/openeuler',
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      customCollections: {
        app: FileSystemIconLoader('../shared/svg-icons'),
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/shared/styles/element-plus/index.scss" as *;`,
      },
    },
  },
  server: {
    proxy: {
      '/query': {
        target: 'https://omapi.osinfra.cn/',
        changeOrigin: true,
      },
      '/authing': {
        target: 'https://omapi.osinfra.cn/',
        changeOrigin: true,
      },
    },
  },
});
