/*
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-04-24 00:25:39
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-03-17 13:46:56
 */
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint'; //导入包
import { resolve } from 'path';

const config = () => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, './packages/core/index.ts'),
        name: 'Kuaitu',
        fileName: 'index',
      },
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
