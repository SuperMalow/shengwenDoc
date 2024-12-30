---
outline: depp
prev:
    text: 'Electron开发环境的集成'
    link: /Electron开发环境的集成.html
next:
    text: 'Linux文件常用命令'
    link: /Linux文件常用命令.html
---

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
npm init vite@latest
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

## Vue 项目结构

1. src：源码目录
2. public：静态资源目录
3. package.json：项目配置文件
4. main.ts: 入口文件
5. vite-env.d.ts：类型声明文件 typescript不认识.vue文件，故通过该文件的声明文件来告诉typescript该文件是vue文件
6. tsconfig.json：typescript配置文件
7. vite.config.ts：vite配置文件
8. index.html：入口文件

### SFC 语法规范

所有的vue文件都由三个类型的语法块进行组成：

1. template：模板，用于渲染页面结构
    - 每个文件最多一个模板块
2. script：脚本，用于编写业务逻辑
    - 每个文件可以多个，但是只能用一个`<script setup>`块
3. style：样式，用于定义页面的样式
    - 可以包含多个样式块

### 项目启动的过程

当执行`npm run dev`命令时，会在项目的目录内进行查找`package.json`文件，然后执行`vite`命令，接下来就会去`node_modules/vite`目录下进行查找其`package.json`文件，然后执行`bin/vite.js`文件。发现其是一个软链接，最后在
`node_modules/.bin`目录下查找`vite`命令，然后执行`vite`这个命令。

即，通常会在本项目中进行查找该命令，如果没有则往上`冒泡`去寻找命令，最后在环境变量中去寻找。

## Vue3 模版语法 与 Vue 指令

### 模版语法

通常vue3采用以下的书写风格：
```vue
<template>
<div>
    <h1>{{ title }}</h1>
    <p>{{ num + 1 }}</p>
</div>
</template>
<script setup lang="ts">
const num:number = 1;
const title:string = "hello world!";
</script>
```

### Vue指令

在Vue中，所有以v-开头的指令都是Vue内置的指令
    