/* 
* 版权所有(c)华为技术有限公司2025-2025
*/
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
    outDir: '../../dist/openubmc',
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
        shared: FileSystemIconLoader('../shared/svg-icons'),
        app: FileSystemIconLoader('./src/assets/svg-icons'),
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
        @use "@/assets/style/mixin/common.scss" as *;
        @use "@/assets/style/mixin/font.scss" as *;
        @use "shared/styles/mixin/screen.scss" as *;
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
      '/api-magic': {
        target: 'https://magicapi.osinfra.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-magic/, ''),
      },
      '/api-id': {
        target: 'https://omapi.test.osinfra.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-id/, ''),
      },
      '/ip-api/': {
        target: 'http://ip-api.com/json/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ip-api/, ''),
      },
    },
  },
});
