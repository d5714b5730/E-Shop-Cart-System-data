// vite.config.ts
export default defineConfig(({mode}) => {
  // ... 其他設定
  return {
    plugins: [react(), tailwindcss()],
    base: './', // 核心：確保打包後的資源路徑是相對路徑，避免 GitHub Pages 找不到檔案
    // ...
  };
});