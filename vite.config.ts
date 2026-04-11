import { defineConfig } from 'vite';

export default defineConfig({
  // 1. 把根目录的 products.json、images 文件夹设为静态资源目录，打包时会完整复制到dist
  publicDir: './',
  // 2. 确保打包后的资源路径正确，适配线上部署
  base: './',
  build: {
    // 3. 静态资源输出目录，确保图片路径正确
    assetsDir: 'assets',
    // 4. 打包时不清除public目录的文件
    emptyOutDir: true,
  },
  server: {
    // 开发环境端口，和AI Studio保持一致
    port: 3000,
    open: true,
  },
});
