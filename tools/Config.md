
# 一些有趣的

## web 如何在生产环境中去除 console

由于我本人是使用 vite 构建的 vue3 项目，所以我这里给出 vite 的配置方法。

首先 vite 是使用 esbuild 作为默认的打包工具，所以我们需要在 vite.config.js 中配置 esbuild 的选项去除 console 即可。

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 配置路径别名
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // 移除 console 和 debugger
  },
});
```