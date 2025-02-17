
# Electron 集成进 Vite + Vue3 项目

## 1. 新建 vite 项目

通过 `npm create vite@latest` 创建一个 vite 项目。
而`npm init vite`是从本地的模板创建项目，但是可能版本不是最新的。

进入创建的项目目录后，执行 `npm install` 安装依赖。这些步骤都是跟创建前端项目是一样的。

## 2. 安装 Electron 及其开发插件

通过以下命令进行安装依赖

```bash
npm install electron -D
npm install vite-plugin-electron -D
```

## 3. 配置 vite.config.ts

点开 vite.config.ts 文件，在 plugins 数组中添加以下内容：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: "electron/background.js", // 需要新建electron目录，并在其中创建background.js文件
    })
  ]
})
```

添加完成后，还需要添加 electron 的入口文件。

## 4. 创建 electron 入口文件

在项目根目录下创建 electron 目录，并在其中创建 background.js 文件。

```javascript
import { app, BrowserWindow } from 'electron';

let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true, // 可以在渲染进程中使用 Node.js 的 API
            contextIsolation: false, // 关闭渲染进程的沙箱
            webSecurity: false, // 开启跨域
        }
    });
    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173/');
        win.webContents.openDevTools(); // 打开开发者工具
        console.log('loadURL');
    } else {
        win.loadFile('./dist/index.html');
        console.log('loadFile');
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform!== 'darwin') {
        app.quit();
    }
});
```

然后运行 `npm run dev` 启动项目时，不出意外的话就会提示报错，`Error lauching app ` 这样的错误，这是因为在项目的package.json文件中没有配置 main 字段，需要在 package.json 文件中添加以下内容：

```json
"main": "electron/background.js",
```

但是，我这里推荐是这么写：

```json
"main": "dist-electron/index.html",
```

这是由于一开始我们安装了 vite-plugin-electron 插件，在vite.config.ts配置后，每一次npm run dev都会自动将/eletron/background.js编译成/dist-electron/background.js，但是在package.json中我们通常都是配置其后面打包相关的配置，所以为了统一我们将其main字段配置为/dist-electron/index.html。

## 5. 使用 electron-builder 打包 electron 应用

安装 electron-builder 依赖：

```bash
npm install electron-builder -D
```

在 package.json 文件中添加打包相关的配置(我这里直接贴完全部出来吧，还顺便写了elerctron-builder的编译脚本)：

```json
{
  "name": "electron-project",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron:build": "electron-builder"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "electron": "^34.2.0",
    "electron-builder": "^25.1.8",
    "vite": "^6.1.0",
    "vite-plugin-electron": "^0.29.0"
  },
  "main": "dist-electron/background.js",
  "description": "An electron-vue project",
  "author": "shengwen",
  "build": {
    "appId": "com.shengwen.electron",
    "productName": "shengwen-electron",
    "asar": false,
    "copyright": "Copyright © 2025 shengwen-electron",
    "directories": {
      "output": "build/${version}"
    },
    "files": [
      "!node_modules",
      "!build",
      "!electron"
    ],
    "icon": "public/logo.png",
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": [
        "dmg"
      ]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    }
  }
}
```

然后执行 `npm run electron:build` 即可打包 electron 应用(前提是跟我上面的配置保持一致)。

