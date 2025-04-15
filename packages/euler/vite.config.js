import nodePath from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  base: '/',
  build: {
    outDir: '../../dist/openeuler',
  },
  resolve: {
    alias: {
      '@/': `${nodePath.resolve(__dirname, './src')}/`,
      'shared/': `${nodePath.resolve(__dirname, '../', 'shared')}/`,
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  plugins: [
    vue(),
    vueJsxPlugin(),
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
        additionalData: `
        @use "@/shared/styles/element-plus/index.scss" as *;
        @use "shared/styles/mixin/screen.scss" as screen;
        `,
      },
    },
  },
  server: {
    proxy: {
      '/query': {
        target: 'https://dsapi.osinfra.cn/',
        changeOrigin: true,
      },
      '/oneid': {
        target: 'https://omapi.osinfra.cn/',
        changeOrigin: true,
      },
      '/ip-api/': {
        target: 'http://ip-api.com/json/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ip-api/, ''),
      },
    },
  },
});
