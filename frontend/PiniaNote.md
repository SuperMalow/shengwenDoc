
# Pinia 笔记

## 0. 简单介绍

首先 pinia 是作为 vue 设计的一个状态管理库，它采用 state、getters、actions，去除了 mutations 并支持同步和异步操作，无需手动添加 store 非常简单快捷。比原本的 vuex 更容易去使用。

1. pinia 的安装

```shell
npm install pinia --save
```

2. pinia 的引入

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
const store = createPinia();
const app = createApp(App);
app.use(store);
app.mount("#app");
```

## 1. 初始化 Store

定义:

```js
// store.js
import { defineStore } from "pinia";

export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {
    updateName(name) {
      this.name = name;
    },
    uppdateAge(age) {
      this.age = age;
    },
  },
});
```

使用:

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
console.log(useHallo.name);
</script>
```

## 2. state 的修改

1. 直接修改

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
useHallo.name = "world";
</script>
```

2. 通过 $patch 修改

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
// useHallo.$patch({ name: "world", age: 20 });
useHallo.$patch({ name: "world" }); // 也可以单修改一个项
</script>
```

3. 通过 $patch 函数形式修改

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
useHallo.$patch((state) => {
  state.name = "world";
  state.age = 20;
});
</script>
```

4. 通过 actions 修改

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
const updateName = () => {
  useHallo.name = "world";
};
const updateAge = () => {
  useHallo.age = 20;
};
</script>
```

## 3. state 的解构

```vue
<script setup>
import { useHalloStore } from "./store";
import { storeToRefs } from "pinia";
const useHallo = useHalloStore();
const { name, age } = useHallo; // 这样进行解构是不具有响应式的
// const { name, age } = storeToRefs(useHallo); // 这样进行解构才具有响应式的 这样就转成了ref了的，对其进行修改也会触发视图更新并且store的也会更新。
</script>
```

## 4. getters 与 actions

### actions

1. 同步修改

```js
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {
    updateName(name) {
      this.name = name; // 同步修改
    },
    uppdateAge(age) {
      this.age = age; // 同步修改
    },
  },
});
```

2. 异步修改
   定义：

```js
const modify = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      age = 20; // 异步修改
    }, 2000);
  });
};
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {
    updateName(name) {
      this.name = name; // 同步修改
    },
    async uppdateAge() {
      const result = await modify(); // 异步修改
      this.age = result.age; // 异步修改
    },
  },
});
```

使用：

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
useHallo.updateName("world"); // 同步修改
useHallo.uppdateAge(); // 异步修改
</script>
```

### getters

定义：

```js
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {
    adult: () => {
      if (this.age < 18) return "未成年";
      return "成年";
    }, // 计算属性
    fullName: () => `${this.name}-${this.age}`, // 计算属性
  },
  // 主要是一些 methods 同步异步都可以
  actions: {},
});
```

使用：

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
console.log(useHallo.adult); // 成年
console.log(useHallo.fullName); // hello-18
</script>
```

## 5. 其他 API

### $reset

重置 store 到初始状态

```js
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {},
});
```

使用：

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
useHallo.name = "world"; // 修改 state
console.log(useHallo.name); // world
useHallo.$reset(); // 重置 store 到初始状态
console.log(useHallo.name); // hello
</script>
```

### $subscribe

订阅 store 的变化，类似 vue 的 watch

```js
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {},
});
```

使用：

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
const callback = (args, state) => {
  console.log(args); // 监听到 state 变化
  console.log(state); // 监听到 state 变化
};
useHallo.$subscribe(callback); // 订阅 store 的变化
useHallo.name = "world"; // 修改 state 那么就会触发 callback 回调函数。每修改一个值就会触发一次。
</script>
```

### $onAction

监听 store 的 action，类似 vuex 的 mutation

```js
// store.js
import { defineStore } from "pinia";
export const useHalloStore = defineStore("useHallo", {
  state: () => ({
    name: "hello",
    age: 18,
  }),
  // 类似 computed
  getters: {},
  // 主要是一些 methods 同步异步都可以
  actions: {
    updateName(name) {
      this.name = name; // 同步修改
    },
    uppdateAge(age) {
      this.age = age; // 同步修改
    },
  },
});
```

使用：

```vue
<script setup>
import { useHalloStore } from "./store";
const useHallo = useHalloStore();
const callback = (args) => {
  console.log(args); // 监听到 action 变化
};
useHallo.$onAction(callback); // 监听 store 的 action
useHallo.updateName("world"); // 调用 action 那么就会触发 callback 回调函数。每修改一个值就会触发一次。
</script>
```

## 6. Pinia 插件

pinia 与 vuex 都有一个共同的通病，页面刷新会将状态进行丢失。

那么可以编写一个插件来实现其状态的持久化。

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";

const setStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStore = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
};

const piniaPlugin = (options) => {
  return (context) => {
    const { store } = context;
    const data = getStore(`${options.key ?? "pinia"}-${store.$id}`);

    store.$subscribe(() => {
      setStore(`${options.key ?? "pinia"}-${store.$id}`, toRaw(store.$state));
    });

    return {
      ...data,
    };
  };
};

const store = createPinia();
store.use(piniaPlugin({ key: "pinia" }));
const app = createApp(App);
app.use(store);
app.mount("#app");
```
