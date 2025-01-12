---
outline: depp
prev:
  text: "Electron开发环境的集成"
  link: /Electron开发环境的集成.html
next:
  text: "Linux文件常用命令"
  link: /Linux文件常用命令.html
---

# Vue3 笔记

## 0. 简单介绍

主要为构建**用户界面**的框架。

- MVVM（Model-View-ViewModel）架构。
- View：ui
- ViewModel：业务逻辑 js 代码
- Model：数据层（存储数据及对数据的处理如增删改查）

### 0.1 Vue3 与 Vue2 的区别

Vue2： Option API 写法
Vue3： Composition API 写法

## 1. 环境搭建

### 1.1 安装 node.js

- 安装 node.js：自行百度（安装完成后会拥有 npm 命令）
- 也可以安装另一个 nvm 命令来进行管理 node 版本，`nvm -help` 查看帮助

### 1.2 Vite 构建项目

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

### 1.3 Vue-CLI 构建项目

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

## 2. Vue 项目结构

1. src：源码目录
2. public：静态资源目录
3. package.json：项目配置文件
4. main.ts: 入口文件
5. vite-env.d.ts：类型声明文件 typescript 不认识.vue 文件，故通过该文件的声明文件来告诉 typescript 该文件是 vue 文件
6. tsconfig.json：typescript 配置文件
7. vite.config.ts：vite 配置文件
8. index.html：入口文件

### 2.1 SFC 语法规范

所有的 vue 文件都由三个类型的语法块进行组成：

1. template：模板，用于渲染页面结构
   - 每个文件最多一个模板块
2. script：脚本，用于编写业务逻辑
   - 每个文件可以多个，但是只能用一个`<script setup>`块
3. style：样式，用于定义页面的样式
   - 可以包含多个样式块

### 2.2 项目启动的过程

当执行`npm run dev`命令时，会在项目的目录内进行查找`package.json`文件，然后执行`vite`命令，接下来就会去`node_modules/vite`目录下进行查找其`package.json`文件，然后执行`bin/vite.js`文件。发现其是一个软链接，最后在
`node_modules/.bin`目录下查找`vite`命令，然后执行`vite`这个命令。

即，通常会在本项目中进行查找该命令，如果没有则往上`冒泡`去寻找命令，最后在环境变量中去寻找。

## 3. Vue3 模版语法 与 Vue 指令

### 3.1 模版语法

通常 vue3 采用以下的书写风格：

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ num + 1 }}</p>
  </div>
</template>
<script setup lang="ts">
const num: number = 1;
const title: string = "hello world!";
</script>
```

### 3.2 Vue 指令

在 Vue 中，所有以 v-开头的指令都是 Vue 内置的指令

1. v-text: 显示文本
2. v-html: 显示 html 代码
3. v-if: 控制元素的显示与隐藏，原理为渲染或不渲染该元素
4. v-else: 配合 v-if 使用，表示当 v-if 条件不满足时，显示该元素
5. v-else-if: 配合 v-if 使用，表示当多个条件都不满足时，显示该元素
6. v-show: 控制元素的显示与隐藏，原理为设置元素的 display 属性
7. v-on: 绑定事件，为元素标签添加指定的事件，简写: @。另外可以在@事件.stop 阻止事件冒泡
8. v-bind: 绑定元素的属性(attr)，简写: :
9. v-model: 双向绑定，将数据绑定到输入框
10. v-for: 循环遍历数组或对象
11. v-memo: 缓存数据，当数据不变时，不重新渲染元素
12. v-once: 只渲染一次

## 4. Vue 虚拟 Dom 和 Diff 算法

### 4.1 虚拟 Dom

虚拟 Dom 就是 JS 将真实的 Dom 转化为一个抽象的数据结构节点树。
至于为什么要有虚拟 dom 而不是使用真实的 dom，这是因为真实的 dom，其包含的东西有很多，但其实我们在意的只有那几个属性，而且还能节省掉很多的性能消耗。

### 4.2 Diff 算法

Diff 算法的核心思想是通过比较两棵树的不同，找出最小的操作集合，使得两棵树的结构保持一致。

在 vue 中，有一个 vue 指令为 v-for，通常来说需要搭配一个:key 属性来进行使用，并且需要跟随一个唯一的值进行绑定。

当数据发生变化时，vue 会重新渲染整个组件，这时会触发 diff 算法，找出最小的操作集合，使得组件的结构保持一致。如果 v-for 此时不搭配:key 来使用，当操作 v-for 遍历的数组时，可能会导致上一次渲染与下一次渲染的结果不一致。

## 5. Ref 全家桶

### 5.1 ref

导入: `import { ref } from 'vue'`
使用: `const num = ref(1)`

ref 可以接受一个值并返回一个响应式的对象。这个对象仅有一个属性`.value`，可以通过`.value`来获取或设置这个值。

在 TS 中，这么定义 Ref 接口: `interface Ref<T> {value: T}`

**另外 ref 可以获取 dom 元素**

```vue
<template>
  <dvi ref="myDiv">hello world</div>
</template>

<script lang="ts" setup>
const myDiv = ref<HTMLDivElement | null>(null);
console.log(myDiv.value?.innerText); // hello world
</script>
```

### 5.2 isRef

作用: 判断一个值是否是 ref 对象。不常用

### 5.3 shallowRef （不常用）

作用: 可以做浅层次的响应式，会将数据进行改变，但是不会进行渲染，同时也不能跟 ref 一起混用，这样 ref 会导致渲染而导致 shallowref 同样被渲染出最新修改的值（这是因为 ref 会进行调用 triggerRef,而这个函数同样会将 shallowRef 进行刷新重新渲染）。也不常用。

### 5.4triggerRef （不常用）

作用: 强制更新页面 Dom。当使用 shallowRef 的时候，会进行浅层的响应式，但是搭配这个函数可以强制更新。也不常用。

### 5.5 customRef （不常用）

作用: 自定义响应式变量。通常为 vue 源码内使用的函数。也不常用。

## 6. Reactive 全家桶

### 6.1 reactive

作用: 用来绑定复杂的数据结构，对象、数组等（引用类型 Array Object Map Set）

另外如果使用 ref 定义数组和对象，**在 vue 源码中也是去创建 reactive 的**。

使用 reactive 过程中，在修改其值的时候，无须使用 .value 进行操作，直接修改即可。

数组异步赋值的情况下，会导致 reactive 脱离响应式变量(直接赋值会将原本的对象进行覆盖，导致不能变为响应式)。通常使用 push、unshift、splice、sort、reverse 等方法进行修改数组。这样不会对该遍历进行脱离响应式。

**reactive 可以直接定义一个对象，然后将对象的每一个属性进行对标签内进行双向绑定（这样就不用一个项定义一个 ref 变量去绑定了）**

```vue
<template>
  <div>
    <input type="text" v-model="obj.name" />
    <input type="text" v-model="obj.age" />
    <!-- 避免默认页面刷新 故需要阻止其默认的行为 -->
    <button @click.prevent="submit">submit</button>
  </div>
</template>

<script lang="ts" setup>
const fromData = reactive({
  name: "张三",
  age: 20,
});
const submit = () => {
  console.log(fromData);
};
</script>
```

### 6.2 readonly

作用: 用来将响应式对象设置为只读模式，使其不可修改。

### 6.3 shallowReactive （不常用）

作用: 同理 ref 中的 shallowRef。也不常用。

## 7. to 系列全家桶

### 7.1 toRef （不常用）

toRef 功能有点鸡肋....我都用 reactive 这个响应式了，我还需要使用 toRef 去将对象内的属性转响应式干嘛？
奥，懂了，这个函数主要是为了下面那个函数 toRefs 服务的。不常用。

### 7.2 toRefs

将 reactive 对象内的属性进行解构成多个 ref 响应式变量。可能不常用。

### 7.3 toRaw

将响应式对象解构成普通的对象。不常用。

## 8. computed 计算属性

computed 计算属性，当前值发生变化的时候，会触发更改。另外使用 computed 是只读变量，无法进行修改。(当然写法是函数式写法)

**在源码中，发现如果是函数式写法，则将变量设置为只读的。当然 computed 内其值不变的话，其返回的值是上一次缓存的，即值不变也不会重新进行计算，而是返回上一次计算的。**

使用：

```typescript
const count = ref(0);
const total = ref(0);

let price = computed<number>(() => {
  if (count.value === 0) {
    return 0;
  }
  return total.value / count.value;
});
```

## 9. watch 侦听器

作用： 监听某个变量，当变量发生变化的时候会触发设置的回调函数。

使用：

```typescript
const count = ref(0);
const price = ref(0);
// 方法1
watch(count, (newVal, oldVal) => {
  console.log(`count 值发生变化了，新值为 ${newVal}, 旧值为 ${oldVal}`);
});
// 如果方法1不管用，则采用这样的方式去监听
// 通常这样的方法去监听对象内的某个属性值
watch(
  () => price.value,
  (newVal, oldVal) => {
    console.log(`price 值发生变化了，新值为 ${newVal}, 旧值为 ${oldVal}`);
  }
);
```

另外，如果想额外第一次也要走监听函数，可以在其后面跟上`{immediate: true}`会立即执行一次。

另外需要停止监听值的话可以采用以下的方式去进行停止监听：（调用一次 watch 或者接下来要讲解的 watchEffect 其返回的函数即可。）

```js
const stop = watch(count, (newVal, oldVal) => {
  console.log(`count 值发生变化了，新值为 ${newVal}, 旧值为 ${oldVal}`);
});
// 停止监听
stop();
```

## 10. watchEffect 侦听器

个人感觉不太常用...等用到在仔细研究。

在进行监听多个变量的时候，可以通过[]放在 watch 里面去进行监听。那么在 watchEffect 中，直接可以采用以下的方式进行：
另外，watchEffect 跟 watch 的区别就是，会先执行一次该函数，也就是 watch 自带的 immediate 选项。

```typescript
let message = ref("hello");
let count = ref(0);
const stopWatch = watchEffect((oninvalidate) => {
  // 其中message与count无论哪一个发生变化，都会触发该函数
  console.log("message", message.value);
  console.log("count", count.value);
  // 在执行这watchEffect的时候会先调用这个函数一次
  oninvalidate(() => {
    console.log("before");
  });
});
// 同watch一样，可以停止监听
// stopWatch();
```

## 11.Vue3 生命周期

组件的生命周期，主要的：

1. beforMounted：组件实例被创建，但未插入 DOM，此时根节点还未存在

2. mounted：组件实例被插入 DOM，元素完成渲染，可以进行 DOM 操作

3. beforeUpdate：组件数据更新，但尚未触发 DOM 更新

4. updated：组件数据更新，且已触发 DOM 更新

5. beforUnmounted：组件实例销毁，即将从 DOM 中移除

6. unmounted：组件实例已从 DOM 中移除，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

## 12.less、sass、scoped

### less 不太推荐

Less（Leaner Style Sheets）是一个 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更加强大和动态。

### Sass 不太推荐

Sass（Syntactically Awesome StyleSheets）是一种 CSS 扩展语言，它使用了缩进和分号来区分代码块，并增加了一些编程特性，如条件语句、循环语句、函数等。
[Sass 官方文档](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)

sass 跟 less 一样都是 css 预处理器
[sass 官方文档](https://www.sass.hk/docs/)

### Scoped 推荐

Scoped 是 Vue 推荐的 CSS 作用域解决方案，它通过在 style 标签上添加 scoped 属性，让 CSS 只作用于当前组件，不会影响全局样式。加上 scoped 属性后，CSS 选择器中的 class 名都会自动添加一个唯一的标识符，从而避免了样式冲突。

#### 在 vite 中使用 less

安装 less：`npm install less -D`

使用:

```vue
<style lang="less" scoped></style>
```

#### 在 vite 中使用 sass

安装 sass：`npm install sass -D`

使用:

```vue
<style lang="sass" scoped></style>
```

scoped 作用：只对当前组件有效，不会影响全局样式。即 Vue 中对每个文件都 hash 出一个唯一值，然后添加到 style 标签的 class 属性中，这样可以保证样式的隔离。

## 13. Vue 父子组件传参

### 父组件参数传给子组件

1. 父组件通过 v-bind 绑定一个数据
2. 子组件通过 defineProps 接受传过来的值，另外子组件是不需要重新引入 defineProps ，直接使用即可。

```vue
<!-- 父组件 -->
<template>
  <Menu :title="title" />
</template>

<script lang="ts" setup>
const title = ref("菜单");
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
    default: "菜单",
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
  console.log("子组件调用父组件的方法");
};
</script>

<!-- 子组件 -->
<script lang="ts" setup>
const props = defineProps({
  hello: {
    type: Function,
    required: true,
  },
});
props.hello();
</script>
```

### 子组件函数传给父组件

1. 子组件通过 defineEmits，派发事件
2. 父组件通过@event 绑定事件，并接收事件

```vue
<!-- 子组件 -->
<template>
  <div>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["Hclick"]);

function handleClick() {
  emit("Hclick");
}
</script>

<!-- 父组件 -->
<template>
  <Menu @Hclick="handleClick" />
</template>

<script lang="ts" setup>
function handleClick() {
  console.log("点击了子组件的按钮");
}
</script>
```

### 子组件参数传给父组件

1. 子组件通过 defineExpose，将内部数据暴露给父组件
2. 父组件通过 ref 获取子组件实例，然后访问实例属性来获取

```vue
<!-- 子组件 -->
<script lang="ts" setup>
const count = ref(0);
const hello = () => {
  console.log("child say hello, count is " + count.value);
};
defineExpose({
  count,
  hello,
});
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
};
</script>
```

## 14. 全局组件、递归组件

### 全局组件

当项目中，某个组件其复用程度很高，那么就可以将这个组件进行全局的导入，作为全局组件来使用。其优势就是省去了其组件导入的麻烦。

直接在 main.ts/main.js 中导入即可：

```js
import Card from "./components/Card.vue";

createApp(App).component("Card", Card).mount("#app"); // 这里component方法内的名称可以任意修改,后续使用组件即为这个名称
```

### 递归组件

看名字就知道其主要的作用，但是在进行使用的时候记得要控制其递归退出的条件，避免内存泄漏。

```vue
<template>
  <div v-for="item in list">
    <input type="checkbox" /> <span>{{ item.name }}</span>
    <Tree :list="item.children" v-if="item.children?.length"></Tree>
  </div>
</template>
<script setup>
defineProps({
  list: {
    type: Array,
    required: true,
  },
});
</script>
```

## 15. 动态组件 component

在某些情况下(标签页的切换)，如果不希望通过 v-if 来进行控制组件的渲染，则可以通过动态组件来进行实现。

```vue
<template>
  <div>
    <div v-for="(item, index) in list">
      <button @click="changeComponent(item, index)">{{ item.name }}</button>
    </div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import { ref, markRaw, shallowRef } from "vue";
import A from "./A.vue";
import B from "./B.vue";
import C from "./C.vue";

// const currentComponent = ref(A);
const currentcomponent = shallowRef(A); // 优化后写法

const list = ref([
  {
    name: "A",
    // component: A,
    component: markRaw(A), // 优化
  },
  {
    name: "B",
    // component: B,
    component: markRaw(B), // 优化
  },
  {
    name: "C",
    // component: C,
    component: markRaw(C), // 优化
  },
]);

const changeComponent = (item, index) => {
  currentComponent.value = item.component;
};
</script>
```

## 16. slot 插槽 (不常用，个人喜欢直接传数据进去)

slot 插槽，是 Vue 组件的一种扩展机制，可以让我们在组件的模板中定义多个插槽，然后在父组件中通过 slot 标签来引用这些插槽。

子组件

```vue
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

父组件

```vue
<template>
  <div>
    <!-- hahah会填充经子组件的<slot>标签内 -->
    <Child> hahah </Child>
  </div>
</template>
<script setup>
import Child from "./Child.vue";
</script>
```

## 17. 异步组件

异步组件，是 Vue 3 新增的一种组件，可以实现组件的懒加载。同时可以进行代码的分包处理。

在进行异步组件的引入时，需要使用 defineAsyncComponent 方法。另外在进行展示异步组件的时，需要使用 suspense 组件。


```Vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>loading...</div>
    </template>
  </Suspense>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
// 凡是采用以下的方式进行引入组件，在进行打包的时候，会进行分包处理，提高加载速度
const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'))
</script>
```

## 18. Teleport 组件

Teleport 组件，是 Vue 3 新增的一种组件，可以实现组件的移动。听其特性，感觉适合做类似对话框的 modal 来进行配合使用。同样也可以将组件代码进行一个解耦合处理，当部份代码过于冗长时，可以单独另起一个文件将将其代码进行封装，然后通过 Teleport 组件进行将这个组件到内容进行传送到其原本的地方位置当中。

```vue
<template>
  <Teleport to="body">
    <div>
      <p>弹出框内容</p>
    </div>
  </Teleport>
</template>
```

## 19. keep-alive 组件

有时候希望组件被重新渲染而导致的用户体验，或者避免多次重复渲染降低性能，而是希望组件缓存下来，维持当前的状态。这时候就可以使用 keep-alive 组件。

开启 keep-alive 组件后，其生命周期：

1. 第一次进入 ==> 触发 onMounted ==> 触发 onActivated
2. 退出组件后 ==> 触发 onDeactivated
3. 再次进入 ==> 触发 onActivated

注：该组件无法通过使用v-show来控制组件的显示与隐藏，因为该组件为一个抽象组件，并不真实存在于 DOM 树中。

## 20. transition 组件

该组件可以在以下的情况下，给任何元素和组件添加 进入/离开的过渡动画：

1. 使用v-if渲染条件块时
2. 使用v-show渲染条件块时
3. 动态组件切换时 component 组件

该组件的作用为，在切换不同组件之间拥有一些过渡的动画效果。

基本使用：
```Vue
<template>
  <button @click="show = !show">切换</button>
  <transition name="fade">
    <div v-if="show" class='box'>hello</div>
  </transition>
  </template>
<script setup>
import { ref } from "vue";
const show = ref(true);
</script>
<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}
.fade-enter-from {
  width: 0;
  height: 0;
}
.fade-enter-active {
  transition: all 1.5s;
}
.fade-enter-to {
  width: 100px;
  height: 100px;
  background-color: black;
}
.fade-leave-from {  
  width: 100px;
  height: 100px;
  background-color: black;
}
.fade-leave-active {
  transition: all 5s;
}
.fade-leave-to {  
  width: 0;
  height: 0;
}
</style>
```

### 搭配第三方动画库来进行使用

推荐的第三方动画库为：Animate.css

安装：`npm install animate.css -S`

使用：`import 'animate.css'` 即可

···Vue
<template>
  <button @click="show = !show">切换</button>
  <!-- 最新的animate.css版本4以上在使用其动画库时，需要加上前缀 animate__animated 类名 -->
  <transition enter-active-class="animate__animated animated fadeIn" leave-active-class="animate__animated animated fadeOut">
    <div v-if="show" class='box'>hello</div>
  </transition>
</template>
<script setup>
import { ref } from "vue";
import 'animate.css'
const show = ref(true);
</script>

### transition 生命周期 （等真正需要再去学习，知道有这个东西即可）

transition 组件还内置提供了其独特的生命周期，可以支持在不同周期中使用js来计算属性等操作。

等真正需要再去详细的学习即可，通过animated.css来进行动画效果实现，已经满足大部分场景了。



## Vue 插件

https://xiaoman.blog.csdn.net/article/details/123300264

## UI 框架

### Naive UI

(Naive UI)[https://www.naiveui.com/zh-CN/os-theme]

### Element Plus

(Element Plus)[https://element-plus.org/zh-CN/]

### Vant 移动端

(Vant)[https://vant-contrib.gitee.io/vant/]

### Ant Design Vue

(Ant Design Vue)[https://2x.antdv.com/docs/vue/introduce-cn/]
