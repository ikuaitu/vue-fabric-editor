/*
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-04-24 00:25:39
 * @LastEditors: June
 * @LastEditTime: 2024-01-06 22:15:15
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint'; //导入包
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import autoImports from 'unplugin-auto-import/vite';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
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
        dts: './typings/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // 一般更新imports启动一次即可
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
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      // sourcemap: !isProd,
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
        },
      },
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: resolve(__dirname, 'src') + '/' },
        { find: /^~/, replacement: '' },
        { find: /^vue-i18n/, replacement: 'vue-i18n/dist/vue-i18n.cjs.js' },
      ],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css'],
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            // 自动添加前缀
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              'last 2 versions', // 所有主流浏览器最近2个版本
            ],
          }),
        ],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import '${resolve(__dirname, 'src/styles/variable.less')}';`,
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
