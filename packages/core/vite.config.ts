import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: './dist',
    lib: {
      entry: './index.ts',
      name: 'fabric-editor-core',
      fileName: (format) => `fabric-editor-core.${format}.js`,
    },
  },
});
