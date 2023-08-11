/*
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-04-24 00:25:39
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-08-11 10:13:09
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint'; //导入包
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import autoImports from 'unplugin-auto-import/vite';
// import { VitePWA } from 'vite-plugin-pwa';

type CacheStrategy =
  | 'CacheFirst'
  | 'CacheOnly'
  | 'NetworkFirst'
  | 'NetworkOnly'
  | 'StaleWhileRevalidate';
interface IgetCache {
  name: string;
  pattern: RegExp | string;
  cacheDay?: number;
  cacheType?: CacheStrategy;
}

const autoprefixer = require('autoprefixer');
const path = require('path');
const getCache = ({ name, pattern, cacheDay = 7, cacheType }: IgetCache) => ({
  urlPattern: pattern,
  handler: cacheType || 'CacheFirst',
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * cacheDay,
    },
    cacheableResponse: {
      statuses: [200],
    },
  },
});

const config = ({ mode }) => {
  const isProd = mode === 'production';
  const envPrefix = 'APP_';
  const { APP_TITLE = '' } = loadEnv(mode, process.cwd(), envPrefix);
  return {
    base: isProd ? '/vue-fabric-editor/' : '/',
    plugins: [
      vue(),
      // VitePWA({
      //   manifest: false,
      //   registerType: 'autoUpdate',
      //   workbox: {
      //     cacheId: APP_TITLE,
      //     runtimeCaching: [
      //       getCache({
      //         // js /css /ts静态资源缓存
      //         name: 'js-css-cache',
      //         pattern: /(.*?)\.(js|css|ts)/,
      //       }),
      //       getCache({
      //         // 图片缓存
      //         name: 'image-cache',
      //         pattern: /(.*?)\.(png|jpe?g|svg|gif|json|psd|ttf)/,
      //       }),
      //     ],
      //   },
      // }),
      autoImports({
        imports: ['vue'],
        eslintrc: {
          enabled: true,
        },
      }),
      vueSetupExtend(),
      // 增加下面的配置项,这样在运行时就能检查eslint规范
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
      }),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      createHtmlPlugin({
        minify: isProd,
        inject: {
          data: {
            title: APP_TITLE,
          },
        },
      }),
    ],
    build: {
      target: 'es2015',
      outDir: path.resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      // sourcemap: !isProd,
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
        },
      },
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: path.resolve(__dirname, 'src') + '/' },
        { find: /^~/, replacement: '' },
        { find: /^vue-i18n/, replacement: 'vue-i18n/dist/vue-i18n.cjs.js' },
      ],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css'],
    },
    css: {
      postcss: {
        plugins: [autoprefixer],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variable.less')}";`,
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/fontFile': {
          target: 'https://github.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fontFile/, ''),
        },
      },
    },
    preview: {
      port: 5000,
    },
  };
};

export default defineConfig(config);
