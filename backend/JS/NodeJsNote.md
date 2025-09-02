# Node.js 笔记

## 0. NodeJs 介绍

首先 NodeJs 不是编程语言, 它是一个运行时，因为编程语言是 JavaScript 而 NodeJs 是 JavaScript 的运行环境。NodeJs 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它可以让 JavaScript 代码在服务器端运行。而 Chrome V8 引擎是 C/C++ 编写的，因此编写的 JavaScript 代码需要通过 C/C++ 程序转化后运行。

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

Nodejs 模块化规范遵循两套，一套 CommonJS 规范另一套 esm 规范

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
  import("./test.js").then(); // 动态导入模块
}
```

**导出模块(export default)**

```js
const add = (a, b) => {
  return a + b;
};
export default {
  name: "zs",
};
```

### 6.3 Cjs 和 ESM 的区别

- CommonJS 是基于运行时的同步加载, ESM 是基于编译时的异步加载
- CommonJS 是可以修改值的, ESM 值并且不可修改（可读的）
- CommonJS 不可以 tree shaking, ESM 支持 tree shaking
- CommonJS 中顶层的 this 指向这个模块本身，而 ES6 中顶层 this 指向 undefined

## 7. NodeJs 全局变量

在浏览器中，全局变量是 window 对象，而在 NodeJs 中，全局变量是 global 对象。

现在可以通过 `globalThis` 这个变量来获取全局变量，它是 ES2020 引入的，可以兼容浏览器和 NodeJs。

```js
globalThis.name = "sw";
console.log(globalThis.name); // 输出 "sw"
console.log(global.name); // node 内输出 "sw"
console.log(window.name); // 浏览器内输出 "sw"
```

### NodeJS 与在浏览器的 JS 的区别

首先 JS 是由 ECMAScript Dom Bom 组成的。但是在 NodeJs 中是无法进行使用 DOM 和 BOM 的。所有与 DOM 或 BOM 相关的 API 都是无法进行使用的，会在直接报错。

### Node 环境内置 API

#### \_\_dirname

`__dirname` 是一个全局变量，它指向当前模块文件所在的目录。即执行该脚本所在的目录。

#### \_\_filename

`__filename` 是一个全局变量，它指向当前模块文件的完整路径。跟上面的区别在于，会多出当前的文件名。

#### process

`process` 是一个全局变量，它是一个对象，包含了当前 Node 进程的一些信息。

- `process.argv` 是一个数组，包含了执行脚本时传入的参数。`node index.js -x 1 -y 2` 则 `process.argv` 值为 `["node", "index.js", "-x", "1", "-y", "2"]`
- `process.cwd()` 是一个方法，返回当前进程的工作目录。
- `process.exit()` 是一个方法，可以退出当前进程。
- `process.on('exit', function(code) { })` 一个事件，当 Node 进程退出时，会触发该事件。不只是可以监听退出事件，还可以监听其他事件。

## 8. CSR、SSR、SEO

CSR（Client Side Rendering）：客户端渲染，即在`浏览器`端将 HTML、CSS、JavaScript 代码`通过 JS 动态生成`页面。

SSR（Server Side Rendering）：服务器端渲染，即在`X服务器`端将 HTML、CSS、JavaScript 代码`通过 NodeJs 动态生成`(生成完成页面后再将页面数据返回给前端)页面。

很明显的一个区别就是，CSR 应用通常会白屏时间比较久，而 SSR 应用则可以将页面的渲染时间缩短到很短。另外就是 SSR 对于 SEO 的优化效果更好。

SEO（Search Engine Optimization）：搜索引擎优化，即通过对网站的`结构、内容、关键字`等进行优化，让网站可以被搜索引擎收录，从而提高网站的排名。

因为 CSR 都是 js 动态生成的对于 HTML 的内容很少，爬虫很难爬到其中的内容，而 SSR 都是服务端渲染的，且返回的都是 HTML 页面，对于 SEO 的爬虫来说，容易识别更多的信息。

CSR 适合做一些 ToB 的管理后台系统等。

SSR 适合做一些大型的社交网站、电商网站、新闻网站等，因为这些网站需要让更多人知道，而 SSR 本身 对于 SEO 有一个很不错的优化。

## 9. NodeJs Path 模块

首先介绍 posix，posix 是 Portable Operating System Interface（可移植操作系统接口）的缩写，它是一套标准，定义了操作系统的接口。遵循这个规范的系统有：Linux、Unix、Mac OS X、Windows wsl 等。

但是 Windows 没有遵守这个标准，Windows 在路径上采用了不同于 posix 路径表示方法，即为反斜杠`\`.

### path.basename()

函数返回给定路径中的最后一部分

```js
const path = require("node:path");
let pathUrl = "a/b/c/foo/index.html";
console.log(path.posix.basename(pathUrl)); // posix写法 index.html
console.log(path.win32.basename(pathUrl)); // windows写法 index.html
```

### path.dirname()

跟 path.baseename()互补，这是返回该文件的所在目录。

```js
const path = require("node:path");
let pathUrl = "a/b/c/foo/index.html";
console.log(path.dirname(pathUrl)); // a/b/c/foo
```

### path.extname()

返回所传路径文件的扩展名

```js
const path = require("node:path");
let pathUrl = "a/b/c/foo/index.html";
console.log(path.extname(pathUrl)); // html
```

### path.join()

这个 API 主要用来拼接路径的，而且支持`../`和`./`这样的操作符。

```js
const path = require("node:path");

path.join("a", "b", "c", "../", "c"); // a\b\c
```

### path.resolve()

该 API 主要用于相对路径解析成`绝对路径`

```js
const path = require("node:path");

console.log(path.resolve(__dirname, "./index.html")); // C:\Users\plc\Desktop\my\testnode\index.html
```

### path.parse() 与 path.format()

parse 是解析文件路径，接受一个路径，然后返回一个包含路径各个组成部分的对象。

```js
const path = require("node:path");
let pathUrl = "/Desktop/a/b/c/d/index.html";
console.log(path.parse(pathUrl));
// {
//   root: '/',
//   dir: '/Desktop/a/b/c/d', // 所在目录
//   base: 'index.html', // 完整文件名
//   ext: '.html',
//   name: 'index' // 去除扩展名的文件名
// }
```

而 path.format()则是 parse 的反过来

```js
const path = require("node:path");

let pathObj = {
  root: "/",
  dir: "/Desktop/a/b/c/d",
  base: "index.html",
  ext: ".html",
  name: "index",
};

console.log(path.format(pathObj)); // /Desktop/a/b/c/d\index.html
```

## 10. Nodejs Os 模块

Nodejs 的 os 模块主要可以跟系统进行交互，获取系统级别的信息、一些简单的操作。

### os.type()、os.platform()、os.relase()、os.homedir()、os.arch()

- os.type() 获取系统的类型，Linux、Darwin、Windows_NT
- os.platform() 获取操作系统所属平台
- os.relase() 返回操作系统的版本号
- os.homedir() 返回用户的家目录
- os.arch() 返回操作系统的架构

### os.cpus()

返回 CPU 线程的详细信息

```js
const os = require("node:os");
console.log(os.cpus()); // 返回CPU的核心的详细信息
console.log(os.cpus().length); // 返回CPU的核心数量
```

### os.networkInterfaces()

返回操作系统的网络信息，其中返回的 internal: 表示本地回环接口是否是内部接口，如果是 ture 表示是内部接口，false 表示是外部接口。外部接口能够访问到外网，而内部接口不能。

```js
const os = require("node:os");

let network = os.networkInterfaces();

network = Object.values(network).flat();

// 枚举所有合法的IPv4网卡
for (const item of network) {
  if (item.family === "IPv4" && !item.internal) {
    console.log(item.address);
  }
}
```

## 11. Nodejs process 模块

process 是 Nodejs 操作当前进程和控制当前进程的 API。由于 process 是挂载在 globalThis 这个全局变量上的，所以可以直接使用。不需要引入模块。

### process.argv

返回一个数组，包含了执行脚本时传入的参数。

```js
// 运行命令: node index.js -x 1 -y 2
console.log(process.argv); // ["node", "index.js", "-x", "1", "-y", "2"]
```

### process.cwd()

返回当前进程的工作目录。

```js
console.log(process.cwd()); // C:\Users\sw\Desktop\my\testnode
```

### process.memoryUsage()

返回一个对象，包含了当前进程的内存使用情况。

```js
console.log(process.memoryUsage());
// {
//   rss: 1175616, // 进程占用的内存总量
//   heapTotal: 786432, // V8堆的总大小
//   heapUsed: 651208, // V8堆的使用量
//   external: 17152 // 外部内存使用量
//   arrayBuffers: 11264 // 共享ArrayBuffer的使用量
// }
```

### process.exit()

退出当前进程。

```js
process.exit(0); // 退出当前进程
```

### process.kill()

传入进程号 pid 来杀死指定进程。

```js
// 获取当前进程号id
console.log(process.pid); // 12345

setTimeout(() => {
  console.log("test");
}, 3000);

// 杀死进程
setTimeout(() => {
  process.kill(process.pid); // 杀死当前进程
}, 2000);
```

### process.env()

可以读取系统中的环境变量，当然也可以进行修改和查询环境变量。当然了，这里的修改不是真的直接修改系统中的环境变量，只是读取值后进行修改。而且只在当前线程生效，线程结束便释放。

```js
process.env.test = "123"; // 设置环境变量
console.log(process.env.test); // 123
```

#### 通过环境变量来区分开发环境和生产环境

这里推荐使用 `cross-env` 第三方库来设置环境变量。而且做了不同平台的兼容性处理。其原理就是：`set NODE_ENV=production  #windows` 和 `export NODE_ENV=production #posix`

```shell
npm install cross-env -D
```

**如何使用?**

在 package.json 的 scripts 中添加命令进行使用即可。

```json
scripts: {
  "dev": "cross-env NODE_ENV=development node index.js",
  "build": "cross-env NODE_ENV=production node build.js"
}
```

然后在代码中通过 `process.env.NODE_ENV` 来获取当前的环境变量，即可判断当前处于开发环境还是生产环境。

## 12. Nodojs child_process 模块

子进程是 Nodejs 核心 API，接下来将介绍比较常用的 7 个 API。另外，在 Nodejs 中，如果函数中拥有 Sync 后缀则表明该函数是同步的，否则是异步的。

### exec() 和 execSync()

该 API 主要为执行 shell 命令而设计的。会执行一个 shell 命令，并返回一个结果。

```js
const { exec, execSync } = require("child_process");
// 同步执行
exec("node -v", (err, stdout, stderr) => {
  // console.log(err); // 输出错误
  console.log("同步执行=>", stdout); // 标准输出 返回的是一个buffer
  // console.log(stderr); // 标准错误
});
// 异步执行
console.log("异步执行=>", execSync("node -v").toString());
```

### spawn() 和 spawnSync()

首先 spawn() 相比于 spawnSync()使用的较为多点，因为 spawn()返回的是一个流，可以进行实时监听，另外它返回的是一个完整的 buffer。

```js
const { spawn, spawnSync } = require("child_process");

const { stdout } = spawn("netstat");

console.log("同步执行 ==> ");
stdout.on("data", (data) => {
  console.log(`c: ${data}`); // netstat 边打印 边同步执行
});
stdout.on("end", () => {
  console.log("同步执行 end");
});

console.log("异步执行 ==> ");
console.log(spawnSync("netstat").stdout.toString()); // 会等待netstat命令执行完成才打印
```

### execFile()

该 API 主要为执行可执行文件而设计的。如果是类 unix 则执行对应的 shell 脚本，而 windows 则执行 bat 文件。

```js
const { execFile } = require("child_process");
const path = require("path");

console.log(path.resolve(__dirname, "./test.bat"));

execFile(
  path.resolve(__dirname, "./test.bat"),
  null,
  { shell: true },
  (err, stdout) => {
    console.log(stdout.toString());
  }
);
```

### fork()

该 API 只能接受 js 模块，不能接受 shell 脚本。由于 NodeJs 是 CPU 密集型的语言,所以对于一些计算比较复杂的操作可以由其子进程来进行计算,然后再将结果返回到父进程即可。

```js
// child.js
process.on("message", (msg) => {
  console.log("子进程 接受到信息啦 ->", msg);
  process.send("我收到啦!!!");
});
```

```js
const { fork } = require("child_process");

const childProcess = fork("./child.js");

childProcess.send("你好啊，这是父进程");

childProcess.on("message", (msg) => {
  console.log("父进程 接收到信息 =>", msg);
});
```

## 13， Nodejs 调用 ffmpeg 进行视频处理

[FFMPEG 下载地址 s](http://ffmpeg.p2hp.com/download.html)

下载完成后，需要配置一个环境变量即可。

### 将 MP4 文件转换为 GIF、AVI 等格式

```js
const { execSync } = require("child_process");

execSync("ffmpeg -i test.mp4 test.gif", { stdio: "inherit" }); // 将 MP4 转换为 GIF 格式 并且输出到控制台
```

### 提取视频中的音频

```js
const { execSync } = require("child_process");
execSync("ffmpeg -i test.mp4 -vn -acodec copy test.aac", { stdio: "inherit" }); // 提取视频中的音频  并且输出到控制台;
// execSync("ffmpeg -i test.mp4 test.mp3", { stdio: "inherit" })
```

### 裁剪视频

```js
const { execSync } = require("child_process");
execSync("ffmpeg -i test.mp4 -ss 00:00:00 -t 00:00:05 -c copy test1.mp4", {
  stdio: "inherit",
}); // 裁剪视频 从第0秒开始，截取5秒

// execSync("ffmpeg -i test.mp4 -ss 10 -to 20 test1.mp4", {
//   stdio: "inherit",
// }); // 裁剪视频 从第10秒开始，截取到20秒
```

### 添加水印

```js
const { execSync } = require("child_process");
execSync(
  "ffmpeg -i test.mp4 -i logo.png -filter_complex overlay=10:10 test1.mp4",
  { stdio: "inherit" }
); // 添加图片水印
// execSync(
//   "ffmpeg -i test.mp4 -vf drawtext=text='Hello World':x=10:y=10 test1.mp4",
//   { stdio: "inherit" }
// ); // 添加文字水印在视频的左上角(10,10)
```

### 去除水印

```js
const { execSync } = require("child_process");
execSync("ffmpeg -i test.mp4 -vf delogo=x=10:y=10:w=100:h=100 test1.mp4", {
  stdio: "inherit",
}); // 去除水印
```

## 14. Nodejs Events 事件

Nodejs 核心 API 都是采用异步事件驱动架构，Nodejs 事件模型采用了，`发布订阅`设计模式。

发布订阅设计模式：即实现 off on emit once 主要这四个方法。

- off 用于取消订阅
- on 用于订阅
- emit 用于发布
- once 用于订阅一次

```js
const eventEmitter = require("events");

const event = new eventEmitter();

// 订阅 test 事件(这个事件名称随便起)
event.on("test", (val) => {
  console.log("test event emitted: " + val);
});

// 发布 test 事件
event.emit("test", "Hello test");

// 订阅 ttt 事件，但是只会触发一次，无论后续发布多少次都只会触发一次
event.once("ttt", (val) => {
  console.log("ttt event emitted: " + val);
});

// 发布多次，但是只会触发一次
event.emit("ttt", "Hello ttt");
event.emit("ttt", "Hello ttt");

const fn = (val) => {
  console.log("ttt event emitted: " + val);
  // 取消订阅 ttt 事件
  event.off("hhh", fn);
};

// 订阅 hhh 事件
event.on("hhh", fn);

// 多次发布 hhh 事件
event.emit("hhh", "Hello hhh");
event.emit("hhh", "Hello hhh");
```

### Events 的选项设置

`event.setMaxListeners` 可以设置 on 订阅事件的最大数量，默认为 10 个。

```js
const EventEmitter = require("events");

const event = new EventEmitter();
console.log("max listeners: ", event.getMaxListeners());
event.setMaxListeners(20);
const fn = (data) => {
  console.log(data);
};

for (let i = 0; i < 20; i++) {
  event.on("test", fn);
}

event.emit("test", `i=1`);
```

## 15. Nodejs fs 模块

Nodejs 的 fs 模块主要用于操作文件系统，包括文件读写、更改权限、目录操作等。

首先 fs 模块同样支持同步和异步操作，同步操作使用 Sync 后缀，异步操作使用回调函数。

另外 fs 模块还新增了 promises 的支持，可以使用 promises 来进行异步操作。在 fs 包后面新增`/promises`即可使用 promises 版本。

### fs.mkdir()

创建目录，如果目录已经存在则会抛出异常。

```js
const fs = require("fs");
// recursive 递归创建目录 类似shell中的-r参数
fs.mkdir("test", { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("创建目录成功");
  }
});
```

### fs.rmdir()

删除目录，如果目录不存在则会抛出异常。

```js
const fs = require("fs");
fs.rmdir("test", (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("删除目录成功");
  }
});
```

### fs.createReadStream()

创建可读流，用于读取文件。

```js
const fs = require("fs");

const readStream = fs.createReadStream("test.txt", {
  encoding: "utf8",
});

readStream.on("data", (chunk) => {
  console.log(chunk);
});

readStream.on("end", () => {
  console.log("文件读取完毕");
});

readStream.on("error", (err) => {
  console.error(err);
});
```

### fs.createWriteStream()

创建可写流，用于写入文件。

```js
const fs = require("fs");

const writeStream = fs.createWriteStream("test.txt", {
  flags: "a", // 追加模式
  encoding: "utf8",
});

writeStream.write("hello world\n");
writeStream.write("你好，世界\n");

writeStream.end();

writeStream.on("finish", () => {
  console.log("文件写入完毕");
});

writeStream.on("error", (err) => {
  console.error(err);
});
```

## 16. 防盗链

在进行 nodejs 搭建的静态服务器时，其暴露出去的资源可能会被小人所盗用，导致服务器的流量变高导致维护成本变大。为了防止这种情况的发生，可以设置防盗链功能。

在 Nodejs 中，防盗链主要是验证`host`或`referer`两个参数。即判断请求的域名是否与服务器域名一致，或者判断请求的来源是否为服务器域名。

## 17. Zlib

在 Node 中，Zlib 主要是提供压缩和解压缩的功能。考虑到现代前端请求后端，然后后端可以返回一个压缩后的数据文件，而不是源文件，可以节省带宽。

Zlib 最主要支持的有 gzip、deflate 等压缩方式，当然常用的就这两种。

Gzip 的压缩代码如下：

```js
//创建可读流
const readStream = fs.createReadStream("./test.txt");
//创建一个可写流
const writeStream = fs.createWriteStream("./test1.txt.gz");
// 压缩
readStream.pipe(zlib.createGzip()).pipe(writeStream);
```

Gzip 的解压缩代码如下:

```js
//创建可读流
const readStream = fs.createReadStream("./test1.txt.gz");
//创建一个可写流
const writeStream = fs.createWriteStream("./test2.txt");
// 解压缩
readStream.pipe(zlib.createGunzip()).pipe(writeStream);
```

同理 deflate 也可以进行压缩和解压缩。

压缩代码如下:

```js
const readStream = fs.createReadStream("./test.txt");
const writeStream = fs.createWriteStream("./test1.txt.flate");
readStream.pipe(zlib.createDeflate()).pipe(writeStream);
```

解压代码如下:

```js
const readStream = fs.createReadStream("./test1.txt.flate");
const writeStream = fs.createWriteStream("./test2.txt");
readStream.pipe(zlib.createInflate()).pipe(writeStream);
```

### Deflate 与 Gzip 的区别

首先是 CPU 和内存消耗则是 Deflate 更低，压缩出来的数据量更小，也更快，适合用于 http 传输文件。而 Gzip 压缩的数据量大，属于无损压缩，通常用于文件的压缩。

## 18. Http 模块

Nodejs 中还内置有 Http 模块可以通过这个模块可以进行完成以下的需求：

1. 创建 web 服务器
2. 构建 Restful API
3. 可以构建代理服务器
4. 可以构建文件服务器

### 使用 Http 创建一个 web 服务器

```js
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  // 通过写入 true 则可以将获取到的 query 参数进行解析并设置为对象
  const { pathname, query } = url.parse(req.url, true);
  if (req.method === "POST") {
    if (pathname === "/login") {
      let body = "";
      req.on("data", (data) => {
        body += data;
      });
      req.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(body);
      });
    } else {
      res.statusCode = 404;
      res.end("404 Not Login");
    }
  } else if (req.method === "GET") {
    if (pathname === "/register") {
      console.log(query);
      res.end("Register");
    } else {
      res.statusCode = 404;
      res.end("404 Not Register");
    }
  }
});

server.listen(3000);
```

### 反向代理

方向代理就是代理服务器替目标服务器做一些预先的处理后，再把请求转发给目标服务器的一个过程。它充当服务器和客户端之间的中介，将客户端的请求转发到一个或多个后端服务器，并将后端服务器的响应返回给客户端。

反向代理的作用通常有：

1. 负载均衡，客户端进行请求到代理服务器，代理服务器根据负载均衡算法将请求转发到不同的服务器上，从而实现负载均衡。
2. 高可用，当某个服务器宕机时，代理服务器可以自动将请求转发到其他服务器上，从而实现高可用。
3. 安全性，反向代理可以作为防火墙，保护后端收到的恶意攻击。
4. 域名和路径的重写，方向代理可以通过特定的规则进行重写请求的路径，从而实现特定的功能。

#### Http 实现反向代理服务器

所需的依赖: `http-proxy-middleware`, 通过 `npm install http-proxy-middleware` 进行安装。

以下是反向代理服务器的示例代码:

这是开启 80 端口的服务端代码：

```js
// index80.js
const http = require("http");
const fs = require("fs");
const url = require("url");
const config = require("./proxy.config.js");
const { createProxyMiddleware } = require("http-proxy-middleware");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const poxyList = Object.keys(config.server.proxy);
    if (poxyList.includes(pathname)) {
      console.log("return proxy");
      const proxy = createProxyMiddleware(config.server.proxy[pathname]);
      proxy(req, res);
    } else {
      console.log("return html");
      const html = fs.readFileSync("index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    }
  })
  .listen(80, () => {
    console.log("Server is running on port 80");
  });
```

这是开启 3000 端口的服务端代码：

```js
// index3000.js
const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    console.log(pathname);
    if (pathname === "/api") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("success");
    }
  })
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });
```

这是反向代理配置文件(参考 vite 的编写)：

```js
// proxy.config.js
module.exports = {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api2": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
};
```

这是返回的 html 代码，并请求到 `/api` 接口：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple HTML Page</title>
  </head>
  <body>
    <h1>Welcome to My Web Page</h1>
    <p>This is a simple HTML page created for demonstration purposes.</p>
    <script>
      console.log("Hello, World!");
      fetch("/api")
        .then((res) => res.text())
        .then(console.log);
    </script>
  </body>
</html>
```

### 动静分离

在现代 Web 应用的后端当中，动静分离是一个常用的优化技术。即将动态生成的资源和静态资源分开部署，以提高应用的性能和可维护性。

通常后端会采用 nginx 将静态请求和动态请求反向代理到不同的服务器上。如果条件允许的情况下，会将静态资源进行一个 cdn 的部署，这样也可以提高静态资源的访问速度(阿里、腾讯通常有专门的付费服务)。

接下来将手动实现一个动静分离的服务器。由于返回的静态资源需要在其响应头部中添加 `Content-Type` 字段，但是每一个文件的文件名后缀都是不一样的。那么 js 社区提供了一个写好的包叫做 `mime`，避免了大家反复造轮子。

安装 `npm install mime`。

以下是动静分离的示例代码：

```js
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mine = require("mine");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const { method } = req;
    // 静态资源
    if (method === "GET" && pathname.startsWith("/static")) {
      const filePath = process.cwd() + pathname;
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        const type = mine(filePath);
        res.writeHead(200, {
          "Content-Type": type,
          "cache-control": "public, max-age=3600", // 缓存 1小时 静态资源
        });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("not found");
      }
    } else if (
      (method === "GET" || method === "POST") &&
      pathname.startsWith("/api")
    ) {
      // 处理 api 请求
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("api success");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("Hello world");
    }
  })
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });
```

### 邮件服务

邮件服务，是后端开发中一个常见的功能。例如后端服务崩溃了，在崩溃前给开发者发送一封邮件等。在 Node.js 中，可以使用第三方库 `nodemailer` 来实现邮件服务。此外还需要第三方库 `js-yaml` 来实现配置文件的读取(因为邮箱账号信息不可能明文写在代码里面)。

安装 `npm install nodemailer js-yaml`。

以下是邮件服务的示例代码：

```js
// mail.js
const http = require("http");
const fs = require("fs");
const url = require("url");
const mailer = require("nodemailer");
const yaml = require("js-yaml");

const mailInfo = yaml.load(fs.readFileSync("./mailinfo.yaml", "utf8"));

// 邮件服务初始化
const transporter = mailer.createTransport({
  host: "smtp.163.com",
  port: 465,
  secure: true,
  auth: {
    user: mailInfo.user,
    pass: mailInfo.pass,
  },
});

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const { method } = req;
    if (method === "POST" && pathname === "/send") {
      console.log("Send request");
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const { name, title, message } = JSON.parse(body);
          transporter.sendMail({
            to: name,
            from: mailInfo.user,
            subject: title,
            text: message,
          });
          console.error("send success");
          res.end("send success");
        } catch (error) {
          console.error(error);
          res.writeHead(500);
          res.end("send failed");
        }
      });
    } else {
      console.log("Other request");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Mail Server</h1>");
    }
  })
  .listen(3000, () => {
    console.log("Mail Server is running on port 3000");
  });
```

yaml 文件只需要按照这么写即可:

```yaml
# mailinfo.yaml
pass: 这里是授权码
user: 这里是邮箱账号
```

## 19. Express

Express 是一个基于 Node.js 平台，快速、开放、极简的 web 开发框架。比 Node.js 自带的 http 模块更加方便、便捷。

安装依赖：`npm install express`

### 使用 express 创建一个服务器：

```js
import express from "express";
import fs from "fs";

const app = express();

// get request
app.get("/", (req, res) => {
  console.log("Got a GET request");
  const html = fs.readFileSync("index.html", "utf-8").toString();
  res.header("Content-Type", "text/html");
  res.send(html);
});

// post request
app.post("/", (req, res) => {
  console.log("Got a POST request");
  res.send("Got a POST request");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

### 接受前端传过来的参数

get 方法获取前端传来的参数

```js
// get query
app.get("/query", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});
```

get 方法动态参数

```js
// get params
app.get("/params/:id", (req, res) => {
  console.log(req.params);
  res.send(req.params);
});
```

post 方法获取前端传来的参数

```js
// post body
app.post("/body", (req, res) => {
  console.log(req.body); // 这里可能会打印 undefined
  res.send(req.body);
});
```

上述代码可能会打印出 undefined，因为 express 默认不会解析 body，由于使用的 express 版本大于 4.16,所有这里使用了 express 内置的 json 中间件，来解析 body，这样就不会再打印出 undefined 了。

```js
express.use(express.json());
// post body
app.post("/body", (req, res) => {
  console.log(req.body); // 这里不会打印出 undefined
  res.send(req.body);
});
```

### Express 路由

Express 提供了模块化的编写，即路由的方式进行模块化拆分和管理。

以下是模块化路由的编写样例:

user 模块

```js
// user/user.js
import express from "express";
const router = express.Router();
router.get("/login", (req, res) => {
  res.send("Login");
});
router.post("/register", (req, res) => {
  res.send("Register");
});
export default router;
```

list 模块

```js
// list/list.js
import express from "express";
const router = express.Router();
router.get("/getall", (req, res) => {
  res.send("Get all");
});
export default router;
```

总入口

```js
// index.js
import express from "express";
import User from "./user/user.js";
import List from "./list/list.js";
const app = express();
app.use("/user", User);
app.use("/list", List);
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

### Express 中间件

这里采用 log4js 来打印日志。当作中间件使用。

安装依赖: `npm install log4js`

以下是中间件的编写:

```js
// middleware/logger.js
import log4js from "log4js";
// 配置 log4js
log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: "colored",
      },
    },
    file: {
      type: "file",
      filename: "logs/serve.log",
    },
  },
  categories: {
    default: {
      appenders: ["out", "file"],
      level: "debug",
    },
  },
});
const logger = log4js.getLogger("default");
// 中间件必须导出的函数
const loggerMiddleware = (req, res, next) => {
  logger.debug(`[${req.method}] [${req.url}]`);
  next();
};
export default loggerMiddleware;
```

编写完成后，在主入口中引入并使用中间件即可:

```js
import loggerMiddleware from "./middleware/logger.js";
app.use(loggerMiddleware);
```

## 20. 防盗链 (面试常问)

防盗链是指网页上的资源，被其他网站引用，但不是资源的所有者。这样会给网站带来额外的带宽消耗和资源的浪费，而且这是一种侵权的行为。为了防止这种操作，我们可以采取以下的措施来减少这种行为的发生。

1. 通过 HTTPS 的引用检查，判断请求源是否在白名单中。
2. 通过 Referrer 检查，网站可以检查 HTTPS 中的 Referrer 字段，查看该字段是否在白名单中。
3. 使用访问控制列表，既在白名单中的网站才可访问资源。

### 使用 Express 搭建静态服务器

在 Express 中搭建静态服务器非常便捷：

```js
import express from "express";

const app = express();

// 直接将static目录作为静态资源目录 但是此时访问资源不需要加上/static
app.use(express.static("static"));

// 这种访问资源需要加上/static
// app.use("/static", express.static("static"));

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

### 使用 Referrer 判断资源是否合法

这里演示判断 Referrer 是否为白名单中的网站，进而判断资源是否被盗用。

```js
import express from "express";
// 白名单
const whiteList = ["localhost"];
// 判断静态资源是否被盗用
const preventHotlink = (req, res, next) => {
  const referrer = req.get("referrer");
  if (referrer) {
    const { hostname } = new URL(referrer);
    if (!whiteList.includes(hostname)) {
      res.status(403).send("资源非法");
      return;
    }
  }
  next();
};
const app = express();
app.use(preventHotlink); // 使用中间件

// 直接将static目录作为静态资源目录 但是此时访问资源不需要加上/static
app.use(express.static("static"));
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

## 21. 响应头、请求头 (最重要的一集!)

响应头：通常是后端发送给前端的数据，比如响应状态码、响应头、响应体等。
请求头：通常是前端发送给后端的数据，比如请求方法、请求头、请求体等。

### 跨域 CORS 问题

跨域资源共享（Cross-Origin Resource Sharing，CORS）是一种机制，用于在浏览器中实现跨域请求访问资源的权限控制。当一个网页(只有浏览器会出现这种限制)通过 XML 或者 Fetch 发起跨域的请求的时候，浏览器会根据同源策略进行限制。同源策略则是同域名、同协议、同端口，否则请求就会被浏览器拒绝。

**如何解决跨域 CORS 问题？**

以下将介绍前端、后端如何解决跨域 CORS 问题。

### 前端解决跨域问题

如果前端项目是使用 Vite 进行构建的，那么仅需要在`vite.config.js`中配置 `server` 的 `proxy` 代理即可。当然了这里配置完成后，请求只需要写`/api`即可。另外可同理配置多个跨域请求。

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 可配置多个跨域请求
      "/api2": {
        target: "http://localhost:3000/api2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### 后端解决跨域问题

后端解决跨域问题也同样非常的简单，只需将响应头中的`Access-Control-Allow-Origin`设置为`*`即可。当然设置为`*`存在一定的安全隐患，所以一般会设置成前端请求的域名。

只需添加一个中间件进行对响应头的处理即可:

```js
import express from "express";
const app = express();
app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*"); // 这样是不够安全的
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  next();
});
// get
app.get("/api", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

当然如果你只是 get post 这种常用的请求，那么按照上述的代码是没问题的。但是当你的项目支持 Restful API 的时候，那么仍然会出现跨域的问题。所以还需要添加以下的响应头字段：

```js
// Access-Control-Allow-Methods 默认只支持 get post head
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, DELETE, OPTIONS, PATCH"
);
```

#### 浏览器的预检请求

当请求一些需要安全性的请求时，浏览器会先做一个预检请求来确保跨域是否是安全的。当以下条件满足后就会触发预检请求：

1. 自定义请求方法，例如`PUT`、`DELETE`、`OPTIONS`等。
2. 自定义请求头部字段，例如`Content-Type` 为 `Application/json`、`Authorization`等。
3. 带凭证的请求，例如`Cookie`、`HTTP`认证等。

触发预检请求，如果后端没有设置 `Content-Type` 为 `Application/json`，那么浏览器同样会报 CORS 的错误。此时需要设置以下响应字段:

```js
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
// res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
```

#### 自定义响应头

在后端设置响应头时，如果响应头中包含`Access-Control-Expose-Headers`，那么浏览器就可以访问到这个响应头。

```js
res.set("haha", 1);
res.setHeader("Access-Control-Allow-Expose-Headers", "haha");
```

前端如何读取呢？

```js
fetch("/api").then((res) => {
  console.log(res.headers.get("haha")); // 1
});
```
