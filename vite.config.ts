import { defineConfig } from 'vite';

export default defineConfig({
  // 核心：修复线上路径报错
  base: './',
  // 核心：让打包时带上 products.json + images
  publicDir: './',

  build: {
    assetsDir: 'assets',
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    open: true,
  },
});
