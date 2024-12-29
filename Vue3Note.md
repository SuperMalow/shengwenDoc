# Vue3 笔记

## 简单介绍

主要为构建**用户界面**的框架。

- MVVM（Model-View-ViewModel）架构。
- View：ui
- ViewModel：业务逻辑 js 代码
- Model：数据层（存储数据及对数据的处理如增删改查）

## Vue3 与 Vue2 的区别

Vue2： Option API 写法
Vue3： Composition API 写法

## 环境搭建

### 安装 node.js

- 安装 node.js：自行百度（安装完成后会拥有 npm 命令）
- 也可以安装另一个 nvm 命令来进行管理 node 版本，`nvm -help` 查看帮助

### Vite 构建项目

1. 安装 vite

```shell
npm install -g vite
```

- 配置好项目后，vscode 进入项目目录

2. 安装项目的依赖

```shell
npm install
```

3. 启动项目

```shell
npm run dev
```

### Vue-CLI 构建项目

1. 安装 vue-cli

```shell
npm init vue@latest
```

2. 安装项目的依赖

```shell
npm install
```

3. 启动项目

```shell
npm run serve
```
