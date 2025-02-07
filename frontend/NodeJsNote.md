# Node.js 笔记

## 0. NodeJs 介绍

首先 NodeJs 不是编程语言，因为编程语言是 JavaScript 而 NodeJs 是 JavaScript 的运行环境。NodeJs 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它可以让 JavaScript 代码在服务器端运行。而 Chrome V8 引擎是 C/C++ 编写的，因此编写的 JavaScript 代码需要通过 C/C++ 程序转化后运行。

NodeJs 是一个事件驱动的非阻塞 I/O 模型，可以高效处理大量并发请求。NodeJs 非常适合干一些 IO 密集型的应用，但是不适用于 CPU 密集型(计算型)的应用。

## 1. NodeJs 安装

NodeJs 可以从官方网站下载安装包安装，也可以使用包管理器安装。安装长期支持版(LTS)版本即可。

## 2. npm package json

npm 的全称是 node package manager，是一个 Node.js 包管理器。它可以帮助我们管理 Node.js 项目中的依赖包。

### 2.1 npm 命令

1. `npm init`: 初始化一个新的 npm 项目，并会生成一个 package.json 文件。
2. `npm install`: 安装依赖包，根据 package.json 文件中的依赖项安装依赖包。
3. `npm install <package-name>`: 安装指定的 package-name 包
4. `npm install <package-name> --save`: 安装指定的 package-name 包并将其添加到 dependencies 字段中。
5. `npm install <package-name> --save-dev`: 安装指定的 package-name 包并将其添加到 devDependencies 字段中。
6. `npm install -g <package-name>`: 安装全局 package-name 包, 即安装到全局环境中。
7. `npm update <package-name>`: 更新指定的 package-name 包。
8. `npm uninstall <package-name>`: 卸载指定的 package-name 包。
9. `npm list`: 列出当前项目的依赖包。
10. `npm run <script-name>`: 执行 package.json 文件中 scripts 字段中指定的脚本。
11. `npm search <keyword>`: 搜索 npm 库中包含 keyword 的包。
12. `npm info <package-name>`: 显示 package-name 包的详细信息。
13. `npm outdated`: 显示过期的依赖包，即显示需要更新的包
14. `npm audit`: 检查当前项目中依赖项是否存在安全性漏洞。
15. `npm publish`: 发布当前项目的包到 npm 库。
16. `npm login`: 登录 npm 账户
17. `npm logout`: 登出 npm 账户
18. `npm config list`: 显示 npm 配置信息。
19. `npm get registry`: 显示当前 npm 库的地址。
20. `npm set registry <registry-url>`: 设置 npm 库的地址。

### 2.2 package.json 文件

1. `name`：项目名称，必须是唯一的字符串，通常采用小写字母和连字符的组合。
2. `version`：项目版本号，通常采用语义化版本号规范。三段式版本号，大版本号.小版本号.修订号。大版本号一般是有重大变化才会升级，而小版本号是增加功能进行升级，修订号一般是修改 bug 进行升级
3. `description`：项目描述。
4. `main`：项目的主入口文件路径，通常是一个 JavaScript 文件。
5. `keywords`：项目的关键字列表，方便他人搜索和发现该项目。
6. `author`：项目作者的信息，包括姓名、邮箱、网址等。
7. `license`：项目的许可证类型，可以是自定义的许可证类型或者常见的开源许可证（如 MIT、Apache 等）。
8. `dependencies`：项目所依赖的包的列表，这些包会在项目运行时自动安装。
9. `devDependencies`：项目开发过程中所需要的包的列表，这些包不会随项目一起发布，而是只在开发时使用。
10. `peerDependencies`：项目的同级依赖，即项目所需要的模块被其他模块所依赖。
11. `scripts`：定义了一些脚本命令，比如启动项目、运行测试等。
12. `repository`：项目代码仓库的信息，包括类型、网址等。
13. `bugs`：项目的 bug 报告地址。
14. `homepage`：项目的官方网站地址或者文档地址。

## 3. npm run xxx 命令

终端中 `npm run xxx` 命令可以执行 `package.json` 文件中 `scripts` 字段中指定的脚本。那么这一行命令的执行过程是这样的：

- 先从当前项目下的 `node_modules` 目录下的 `.bin` 目录，查找是否有 `xxx` 脚本命令，如果有则执行；
- 如果没有找到则去全局环境的 `node_modules` 目录下的 `.bin` 目录，查找是否有 `xxx` 脚本命令，如果有则执行；
- 如果还是没有则去环境变量中进行查找
- 如果以上都没有查找到，则报错处理

如果成功找到则会根据当前电脑的去执行对应电脑平台的可执行脚本。

### 3.1 npm 的生命周期

```json
"predev": "node predev.js",
"dev": "node index.js",
"postdev": "node postdev.js"
```

1. `predev`：在 `npm run dev` 之前执行的脚本
2. `dev`：开发环境启动脚本
3. `postdev`：在 `npm run dev` 之后执行的脚本

## 4. npx

npx 是一个命令行工具，它是 npm 5.2.0 版本中新增的功能。它允许用户在不安装全局包的情况下，运行已安装在本地项目中的包或者远程仓库中的包。
npx 的作用是在命令行中运行 node 包中的可执行文件，而不需要全局安装这些包。这可以使开发人员更轻松地管理包的依赖关系，并且可以避免全局污染的问题。它还可以帮助开发人员在项目中使用不同版本的包，而不会出现版本冲突的问题。

### 4.1 npm 和 npx 区别

- npx 侧重于执行命令的，执行某个模块命令。虽然会自动安装模块，但是重在执行某个命令
- npm 侧重于安装或者卸载某个模块的。重在安装，并不具备执行某个模块的功能。

npx 的运行规则和 npm 是一样的 本地目录 `node_modules` 下查找 `.bin` 目录 看有没有 如果没有就去全局的 `node_moduels` 查找，如果还没有就去下载这个包然后运行命令，然后删除这个包。

## 5. npm 包的发布

首先需要创建账号: `npm adduser`

然后登录你创建的账号: `npm login`

登陆完成后，配置好你的 `package.json` 文件，然后给项目起一个 `name` ，得保证这个 `name` 是唯一的，与别人不能一样。接着就可以进行 `npm publish` 命令发布你的包了。如果发布出去的网页出现 403 错误，则说明包名被占用了。

## 6. NodeJs 模块化

Nodejs 模块化规范遵循两套一 套 CommonJS 规范另一套 esm 规范

### 6.1 CommonJS 规范

**引入模块(require)：**

1. 支持引入内置模块 http os fs 等 node 内置模块
2. 支持引入第三方模块 express react 等第三方模块
3. 支持引入自定义模块，需要通过 ../../ 这种方式引入
4. 支持引入 addon C++扩展模块 .node 文件

```js
const fs = require("fs");
const express = require("express");
const myModule = require("./myModule");
const nodeModule = require("./nodeModule.node");
```

**导出模块(exports)和导出对象(module.exports)：**

```js
// myModule.js
module.exports = {
  add: function (a, b) {
    return a + b;
  },
  name: "张三",
};
```

### 6.2 ESM 规范

**引入模块(import)：** 必须写在头部，并且在 package.json 中配置 `"type": "module"`

```js
import fs from "fs";
import data from "./data.json" assert { type: "json" }; // 引入json文件需要特殊断言处理
import * as all from "./all.js"; // 加载模块的整体对象
const flag = true;
if (flag) {
    import('./test.js').then(); // 动态导入模块
}
```

**导出模块(export default)**

```js
const add = (a, b) => {
    return a + b;
}
export default {
    name: 'zs',
}
```

### 6.3 Cjs 和 ESM 的区别

- CommonJS 是基于运行时的同步加载, ESM 是基于编译时的异步加载
- CommonJS 是可以修改值的, ESM 值并且不可修改（可读的）
- CommonJS 不可以 tree shaking, ESM 支持tree shaking
- CommonJS 中顶层的 this 指向这个模块本身，而 ES6 中顶层 this 指向 undefined
