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
    
1. v-text: 显示文本
2. v-html: 显示html代码
3. v-if: 控制元素的显示与隐藏，原理为渲染或不渲染该元素
4. v-else: 配合v-if使用，表示当v-if条件不满足时，显示该元素
5. v-else-if: 配合v-if使用，表示当多个条件都不满足时，显示该元素
6. v-show: 控制元素的显示与隐藏，原理为设置元素的display属性
7. v-on: 绑定事件，为元素标签添加指定的事件，简写: @。另外可以在@事件.stop阻止事件冒泡
8. v-bind: 绑定元素的属性(attr)，简写: :
9. v-model: 双向绑定，将数据绑定到输入框
10. v-for: 循环遍历数组或对象
11. v-memo: 缓存数据，当数据不变时，不重新渲染元素
12. v-once: 只渲染一次




## Vue 虚拟 Dom 和 Diff 算法 

### 虚拟 Dom
虚拟 Dom 就是 JS 将真实的 Dom 转化为一个抽象的数据结构节点树。
至于为什么要有虚拟 dom 而不是使用真实的dom，这是因为真实的dom，其包含的东西有很多，但其实我们在意的只有那几个属性，而且还能节省掉很多的性能消耗。

### Diff 算法

Diff 算法的核心思想是通过比较两棵树的不同，找出最小的操作集合，使得两棵树的结构保持一致。

在vue中，有一个vue指令为v-for，通常来说需要搭配一个:key属性来进行使用，并且需要跟随一个唯一的值进行绑定。

当数据发生变化时，vue会重新渲染整个组件，这时会触发diff算法，找出最小的操作集合，使得组件的结构保持一致。如果v-for此时不搭配:key来使用，当操作v-for遍历的数组时，可能会导致上一次渲染与下一次渲染的结果不一致。

## Ref 全家桶

### ref

导入: `import { ref } from 'vue'`
使用: `const num = ref(1)`

ref可以接受一个值并返回一个响应式的对象。这个对象仅有一个属性`.value`，可以通过`.value`来获取或设置这个值。

在TS中，这么定义Ref接口: `interface Ref<T> {value: T}`


### isRef

作用: 判断一个值是否是ref对象


### shallowRef

作用: ......


### triggerRef

作用: 强制更新页面Dom

### customRef

作用: .......


## Reactive 全家桶

### reactive

作用: 用来绑定复杂的数据结构，对象、数组等

另外如果使用 ref 定义数组和对象，在 vue 源码中也是去调用 reactive 的。

使用 reactive 过程中，在修改其值的时候，无须使用 .value 进行操作，直接修改即可。

数组异步赋值的情况下，会导致 reactive 脱离响应式变量。通常使用push、unshift、splice、sort、reverse等方法进行修改数组。这样不会对该遍历进行脱离响应式。

### readonly

作用: 用来将响应式对象设置为只读模式，使其不可修改。

### shallowReactive

作用: ......


## to 系列全家桶

### toRef

### toRefs

### toRaw

## computed 计算属性

computed 计算属性，当前值发生变化的时候，会触发更改。

使用：

```typescript
const count = ref(0);
const total = ref(0);

let price = computed<number>(() => {
    if (count.value === 0) {
        return 0;
    }
    return total.value / count.value;
})
```

## watch 侦听器

作用： 监听某个变量，当变量发生变化的时候会触发设置的回调函数。

使用：

```typescript
const count = ref(0);
const price = ref(0);
watch(count, (newVal, oldVal) => {
    console.log(`count 值发生变化了，新值为 ${newVal}, 旧值为 ${oldVal}`);
});
watch(() => price.value, (newVal, oldVal) => {
    console.log(`price 值发生变化了，新值为 ${newVal}, 旧值为 ${oldVal}`);
})
```

## watchEffect 侦听器

个人感觉不太常用...等用到在仔细研究。

作用：首先立即执行传入的函数一次，然后响应式跟踪其依赖，并在其依赖变更时重新运行该函数。

使用: 。。。。

## Vue3 生命周期

组件的生命周期，主要的：

1. beforMounted：组件实例被创建，但未插入DOM，此时根节点还未存在

2. mounted：组件实例被插入DOM，元素完成渲染，可以进行DOM操作

3. beforeUpdate：组件数据更新，但尚未触发DOM更新

4. updated：组件数据更新，且已触发DOM更新

5. beforUnmounted：组件实例销毁，即将从DOM中移除

6. unmounted：组件实例已从DOM中移除，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。


## less、sass、scoped

Less（Leaner Style Sheets）是一个CSS预处理语言，它扩展了CSS语言，增加了变量、Mixin、函数等特性，使CSS更加强大和动态。

Sass（Syntactically Awesome StyleSheets）是一种CSS扩展语言，它使用了缩进和分号来区分代码块，并增加了一些编程特性，如条件语句、循环语句、函数等。
[Sass 官方文档](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)

sass 跟 less 一样都是 css 预处理器
[sass 官方文档](https://www.sass.hk/docs/)

### 在 vite 中使用 less

安装 less：`npm install less -D`

使用: 
```vue
<style lang="less" scoped>
</style>
```

### 在 vite 中使用 sass

安装 sass：`npm install sass -D`

使用: 
```vue
<style lang="sass" scoped>
</style>
```

scoped 作用：只对当前组件有效，不会影响全局样式。即 Vue 中对每个文件都hash出一个唯一值，然后添加到 style 标签的 class 属性中，这样可以保证样式的隔离。


## Vue 父子组件传参

### 父组件参数传给子组件

1. 父组件通过 v-bind 绑定一个数据
2. 子组件通过 defineProps 接受传过来的值，另外子组件是不需要重新引入 defineProps ，直接使用即可。

```vue
<!-- 父组件 -->
<template>
  <Menu :title="title" />
</template>

<script lang="ts" setup>
const title = ref('菜单');
</script>

<!-- 子组件 -->
<template>
  <div>
    <h1>{{ props.title }}</h1>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '菜单',
  },
});
</script>
```

### 父组件函数传给子组件

1. 父组件通过 v-bind 绑定一个函数
2. 子组件通过 defineProps 接收传过来的值，并调用函数

```vue
<!-- 父组件 -->
<template>
  <Menu :hello="hi" />
</template>

<script lang="ts" setup>
const hi = () => {
    console.log('子组件调用父组件的方法');
}
</script>

<!-- 子组件 -->
<script lang="ts" setup>
const props = defineProps({
  hello: {
    type: Function,
    required: true,
  }
});
props.hello();
</script>
```


### 子组件函数传给父组件

1. 子组件通过defineEmits，派发事件
2. 父组件通过@event绑定事件，并接收事件

```vue
<!-- 子组件 -->
<template>
  <div>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['Hclick']);

  function handleClick() {
    emit('Hclick');
  }
</script>

<!-- 父组件 -->
<template>
  <Menu @Hclick="handleClick" />
</template>

<script lang="ts" setup>
function handleClick() {
  console.log('点击了子组件的按钮');
}
</script>
```


### 子组件参数传给父组件

1. 子组件通过defineExpose，将内部数据暴露给父组件
2. 父组件通过 ref 获取子组件实例，然后访问实例属性来获取

```vue
<!-- 子组件 --> 
<script lang="ts" setup>
const count = ref(0);
const hello = () => {
    console.log("child say hello, count is " + count.value);
}
defineExpose({
    count,
    hello
})
</script>

<!-- 父组件 -->
<template>
  <div>
    <Child ref="child" />
  </div>
</template>
<script lang="ts" setup>

const hi = () => {
    if (child.value) {
        child.value.count++;
        child.value.hello();
    }
}
</script>
```



