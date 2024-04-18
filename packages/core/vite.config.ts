/*
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-04-24 00:25:39
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-04-18 10:14:25
 */
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint'; //导入包
import { resolve } from 'path';

const config = () => {
  return {
    base: './',
    build: {
      lib: {
        entry: resolve(__dirname, './index.ts'),
        name: 'Kuaitu',
        fileName: 'index',
      },
      outDir: resolve(__dirname, '../../dist'),
    },
    plugins: [
      // 增加下面的配置项,这样在运行时就能检查eslint规范
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
      }),
    ],
  };
};

export default defineConfig(config);
