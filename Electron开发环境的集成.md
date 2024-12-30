---
outline: depp
prev: 
    text: 'vitepress笔记'
    link: /vitepress.html
next: 
    text: 'vitepress笔记'
    link: /vitepress.html

---

# Electron 集成进 Vite + Vue3 项目

总结：时灵时不灵......

## 创建 Electron 应用

### 新建 vite 项目

通过 `npm create vite@latest` 创建一个 vite 项目。
而`npm init vite`是从本地的模板创建项目，但是可能版本不是最新的。

进入创建的项目目录后，执行 `npm install` 安装依赖。

### 安装 Electron

通过以下命令进行安装依赖

```bash
npm install electron -D
npm install vite-plugin-electron -D
```

- 如果安装失败

```bash
# 查看详细安装日志
npm install electron -D  --timing=true --loglevel=verbose

# 切换成cnpm安装
## 安装cnpm
npm install -g cnpm --registry=http://registry.npmmirror.com
## cnpm安装
cnpm install electron -D
```

### 配置 vite.config.js

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Electron from "vite-plugin-electron";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Electron({
      entry: "electron/index.js",
    }),
  ],
});
```

### 配置 package.json

主要是添加以下这三行，当然记得将`"type":"module"`给删去

```json
  "author": "shengwen",
  "description": "A Vue3 + Vite + Electron project",
  "main": "dist-electron/index.js",
```

### 编写 Electron 代码

<!-- 首先根据在`vite.config.js`中配置的`entry`路径，创建`electron/index.js`文件，然后编写 Electron 应用代码。 -->

接下来编写 Electron 应用代码，主要是创建窗口，加载页面。新建文件夹`electron`，然后在`electron`文件夹下创建`background.js`文件，编写 Electron 应用的代码。
注意：编写的 preload.js 文件，需要在`dist-electron/`文件夹下与`dist-electron/background.js`同级目录下，否则会找不到文件。

```js
import path from "path";
const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      // preload: path.join(__dirname, "../electron-preload/index.js"), // 需要引用js文件
    },
  });
  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
  } else {
    win.loadURL(process.env["VITE_DEV_SERVER_URL"]);
  }
};

app.whenReady().then(() => {
  createWindow(); // 创建窗口

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

### 渲染进程和主进程之间的通信(renderer -> main / main -> renderer)

1. 安装渲染插件

```bash
# 安装渲染插件
npm install vite-plugin-electron-renderer -D
```

2. 配置`vite.config.js`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Electron from "vite-plugin-electron";
import electronRender from "vite-plugin-electron-renderer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Electron({
      entry: "electron/index.js",
    }),
    electronRender(),
  ],
  build: {
    emptyOutDir: false,
  },
});
```

渲染进程(renderer)通过 `ipcRenderer.on()` 和 `ipcRenderer.send()` 来进行接收/发送信息给主进程(main)，非常类似订阅发布模式。
同样的，主进程(main)通过`win.webcontents.send()` 和 `ipcMain.on()` 来进行发送/接收信息给渲染进程(renderer)。

### 运行项目

添加完成上面的代码后，每次执行`npm run dev`都会将`/electron/background.js`编译成`/dist-electron/background.js`，并启动 Electron 应用。此时 Electron 应用启动的入口文件是`/dist-electron/background.js`。

## 打包 Electron 应用

### 安装 Electron 打包工具依赖

通过以下几行命令进行安装依赖

```bash
# 利用electron-builder来进行打包
npm install electron-builder -D

# 调试工具
npm install electron-devtools-installer -D

# 辅助工具，快速删除某些文件或文件夹
npm install rimraf -D
```

### 配置打包脚本

修改`package.json`

1. 修改 build 命令，修改成`electron-builder`
   - 如果发现其他博客在这个命令中发现`vue-tsc`，那是他的项目使用了 `typescript`，这个得看自己的项目是否使用，如果无则不需要这个命令
2. 添加 build 相关配置

```json
{
  "name": "vite-vue-electron",
  "private": true,
  "version": "0.0.1",
  "author": "shengwen",
  "description": "A Vue3 + Vite + Electron project",
  "main": "dist-electron/index.js",
  "scripts": {
    "dev": "vite",
    "build": "electron-builder",
    "preview": "vite preview"
  },
  "build": {
    "appId": "com.electron.desktop",
    "productName": "vite-vue-electron",
    "asar": true,
    "copyright": "Copyright © 2024 vite-vue-electron",
    "directories": {
      "output": "release/${version}"
    },
    "files": ["!electron", "!node_modules"], // 这里是将这些目录排除掉打包成asar文件的
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": ["dmg"]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    },
    "publish": [
      {
        "provider": "generic",
        "url": "http://127.0.0.1:8080"
      }
    ],
    "releaseInfo": {
      "releaseNotes": "版本更新的具体内容"
    }
  }
}
```
