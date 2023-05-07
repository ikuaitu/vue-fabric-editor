/*
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-04-24 00:25:39
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-05-07 13:12:38
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueJsx from '@vitejs/plugin-vue-jsx';
const autoprefixer = require('autoprefixer');
const path = require('path');
import eslintPlugin from 'vite-plugin-eslint'; //导入包
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';

const config = ({ mode }) => {
  const isProd = mode === 'production';
  const envPrefix = 'APP_';
  const { APP_TITLE = '' } = loadEnv(mode, process.cwd(), envPrefix);
  return {
    base: isProd ? '/vue-fabric-editor/' : '/',
    plugins: [
      vue(),
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
