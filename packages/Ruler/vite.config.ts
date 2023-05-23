/*
 * @Author: June
 * @Description:
 * @Date: 2023-04-15 11:47:54
 * @LastEditors: June
 * @LastEditTime: 2023-05-23 23:08:57
 */
import type { UserConfigExport } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default (): UserConfigExport => {
  return {
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, './src/index.ts'),
        name: 'ruler',
        fileName: (format) => `ruler.${format}.js`,
      },
      rollupOptions: {
        external: ['fabric'],
        output: {
          globals: {
            fabric: 'fabric',
          },
        },
      },
    },
  };
};
