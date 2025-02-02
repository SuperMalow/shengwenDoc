# Vue3 Router4

## 0. 简单介绍

由于，Vue 开发多为单应用，不会有那么多的 html 页面让我们进行跳转。所以 Vue 提供了 Router 路由来做页面的跳转。Vue 允许通过不同的 URL 访问不同的内容，故可以通过 Vue 来进行开发单页面的多视图应用。通过 Router 来切换应用的不同视图。

**（提问）** 为什么不能通过开发不同的单应用，然后在进行部署的时候通过 nginx 来进行对应用的 URL 进行不同的映射？

## 1. 环境搭建和基本使用

### 1.1 构建项目

首先需要构建你的 Vue 项目，这里通过 vite 来进行构建

```shell
npm init vite@latest
```

### 1.2 安装 Router4

安装 Router4 是需要对应的 Vue3 版本的，而 Vue2 版本则对应的是 Router3

```shell
npm install vue-router@4
```

### 1.3 使用 Router4

1. 首先在 src 同级目录下新建 router 目录，再创建 index.ts 代码如下：

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/login.vue'),
        name: 'login'
    },
    {
        path: '/reg',
        component: () => import('../components/register.vue'),
        name:'register'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

2. 其次在 main.ts 中进行将刚刚编写的 router 进行导入到 app 当中

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

3. 最后在 Vue 中任意地方通过部署 `<router-view></router-view>` 标签即可，同时可以通过 `<router-link></router-link>` 标签来进行跳转至在 router/index 下编写的路由。

```vue
<template>
    <h1>router-link method 1</h1>
    <router-link :to="{ name: 'register' }" class="margin-x">Register</router-link>
    <router-link :to="{ name: 'login' }" class="margin-x">Login</router-link>
    <hr>
    <h1>router-link method 2</h1>
    <router-link to="/reg" class="margin-x">Register</router-link>
    <router-link to="/" class="margin-x">Login</router-link>
    <hr>
    <router-view></router-view>
</template>
<script setup lang="ts">
</script>
<style scoped>
.margin-x {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 26px;
}
</style>
```

## 2. 路由 history 模式

router 的 history 模式提供了三种模式：
- history 模式: createWebHistory()，默认模式，使用 HTML5 history API 来完成前端路由。
- hash 模式: createWebHashHistory()，使用 URL 的 hash 来模拟实现前端路由。
- abstract 模式: createMemoryHistory()，使用内存中的栈来模拟实现前端路由。 （不常用）

**hash模式**

主要通过 location.hash 来实现前端路由，其跟默认模式区别在于多了一个 # 号，如：http://localhost:3000/#/login。hash 是 URL 中 hash(#) 及后面的那部分，常用做锚点在页面内进行导航。

**history模式**

主要通过监听 pushState 和 replaceState 两个方法来实现前端路由，这两个方法改变 URL 不会引起页面的刷新(浏览器的前进和后退功能)。

## 3. 页面的跳转 - 路由的命名、编程式导航

**页面的跳转**

1. `<router-link>` 标签：通过 `<router-link>` 标签来进行页面的跳转，通过 `to` 属性来指定跳转的路由。
2. 编程式的路由导航：通过 `useRouter()` 函数来获取路由实例，然后调用实例的 `push()` 方法来进行页面的跳转。
3. 直接通过 `a` 标签进行跳转页面也是可行的，但是跟上述两点的区别在于，使用 `a` 标签会进行页面的刷新操作，即会重新加载网页等各种资源。

**路由的命名**

在router/index.ts中，我们定义了两个路由，分别是登录页面和注册页面。我们可以通过给其添加 name 属性来进行定义这个路由的别名。

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/login.vue'),
        name: 'login'
    },
    {
        path: '/reg',
        component: () => import('../components/register.vue'),
        name:'register'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

然后可以使用 `<router-link :to="{ name: 'login' }">Login</router-link>` 来进行路由的跳转。

**编程式导航**

除了上述使用 `<router-link>` 标签进行路由的跳转外，我们还可以通过编程式的路由导航来进行路由的跳转。

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/login') // 字符串形式

router.push({ name: 'register' }) // 对象形式

router.push({ path: '/home', query: { id: 123 } }) // 带参数的路由跳转
```

## 4. 路由的历史记录

在上述内容中，通过 `<router-link>` 标签进行页面的跳转，我们可以通过浏览器支持的前进和后退进行页面的切换操作。
但是如果这样的操作，可能在单应用中有点"割裂"让人以为不是单页面应用。所以 **Router** 中提供了 `replace` 属性来限制浏览器中的前进和后退操作。
其原理就是 `replace` 进行页面的跳转会同样也会创建渲染新的 **Vue** 组件，但是在 `history` 中其不会重复保存记录，而是替换原有的vue组件。

```vue
<template>
    <router-link replace to="/reg" class="margin-x">Register</router-link>
    <router-link replace to="/" class="margin-x">Login</router-link>
    <router-view></router-view>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

router.replace('/login') // 编程式用法 同 template 的<router-link>
</script>
<style scoped>
.margin-x {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 26px;
}
</style>
```

**横跨历史记录的路由跳转**

router 还提供了 `go` 方法来进行页面的跳转，可以指定前进或者后退的步数。

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()

const next = (index: number) => {
    router.go(index);
    // router.forward();
}

const prev = (index: number) => {
    router.go(-index);
    // router.back();
}
```

## 5. 路由的传参

**query参数**

首先推荐使用对象形式来进行跳转页面的写法，这样方便传递参数。主页面代码：

```vue
<template>
    <h1>router query</h1>
    <button class="margin-x" @click="register()">Register</button>
    <button class="margin-x" @click="login()">Login</button>
    <hr>
    <router-view></router-view>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const register = () => {
    router.push({
        path: '/reg',
        query: {
            name: 'zs',
            age: 25,
        }
    })
}
const login = () => {
    router.push({
        path: '/',
        query: {
            name: 'ls',
            age: 26,
        }
    })
}
</script>
<style scoped>
.margin-x {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 26px;
}
</style>
```

跳转页面的子页面A：

```vue
<template>

    <h1 style="background-color: green;">Login</h1>
    <h2>name: {{ route.query.name }}</h2>
    <h2>age: {{ route.query.age }}</h2>
    <h3><button @click="goBack()">Go back</button></h3>

</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goBack = () => {
    router.go(-1)
}
</script>
<style scoped></style>
```

跳转页面的子页面B：

```vue
<template>

    <h1 style="background-color: brown;">Register</h1>
    <h2>name: {{ route.query.name }}</h2>
    <h2>age: {{ route.query.age }}</h2>
    <h3><button @click="goBack()">Go back</button></h3>

</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goBack = () => {
    router.back();
}

</script>
<style scoped></style>
```

**params参数**

params参数是指在路由路径中带有参数的情况**在router/index.ts中定义的路由中的path带有参数**，如：`/user/:id`，在跳转页面时，可以通过 `params` 属性来传递参数。

router/index.ts:

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/reg/:name/:age',
        component: () => import('../components/register.vue'),
        name:'register'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

跳转页面逻辑代码:

```vue
<template>
    <h1>router params</h1>
    <button class="margin-x" @click="register()">Register</button>
    <hr>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const register = () => {
    router.push({
        name: 'register', // 必须使用name 不能使用path
        params: {
            name: 'zs',
            age: 25,
        }
    })
}
</script>
<style scoped>
.margin-x {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 26px;
}
</style>
```

跳转后页面的子页面逻辑代码:

```vue
<template>
    <h1 style="background-color: brown;">Register</h1>
    <h2>name: {{ route.params.name }}</h2>
    <h2>age: {{ route.params.age }}</h2>
    <h3><button @click="goBack()">Go back</button></h3>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const goBack = () => {
    router.back();
}
</script>
<style scoped></style>
```

## 6. 路由的嵌套

当一个大页面下面还需要有其子页面的时候，那么可以通过嵌套路由的方式，将其子页面作为该单页面的子路由，在语义上更加清晰。

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/list',
        name: 'list',
        component: () => import('../components/list/list.vue'),
        children: [
            {
                path: 'listA',
                component: () => import('../components/list/listA.vue'),
                name:'listA'
            },
            {
                path: 'listB',
                component: () => import('../components/list/listB.vue'),
                name:'listB'
            },
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

使用路由嵌套的页面逻辑代码:

```vue
<template>
<h1>List Page</h1>
<RouterLink :to="{name: 'listA'}" class="gap-x">Go to List A</RouterLink>
<RouterLink :to="{name: 'listB'}" class="gap-x">Go to List B</RouterLink>
<router-view></router-view>
</template>
<script setup lang="ts">
</script>
<style scoped>
.gap-x {
    margin: 0 20px;
}
</style>
```

## 7. 路由的别名和重定向

**路由重定向**

当我们访问 `/` 路径时，我们希望它自动跳转到 `/login` 路径。

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        // redirect: '/login',
        // redirect: { name: 'login' },
        redirect: to => {
            return {
                path: '/login',
                query: {
                    name: "admin",
                    age: 200
                }
            }
        },  
    },
    {
        path: '/login',
        component: () => import('../components/login.vue'),
        name: 'login'
    },
    {
        path: '/reg',
        component: () => import('../components/register.vue'),
        name:'register'
    },
    // 重定向到404页面
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../components/notFound.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

**路由别名**

每一个路由，我们可以给其起一个 path 为其作为该路由的 URL，此外还可以通过别名 alias 来定义路由的其他 URL 名称。

```typescript
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login',
        name: 'home'
    },
    {
        path: '/login',
        component: () => import('../components/login.vue'),
        name: 'login',
        alias: ['/login1', '/login2'], // 除了/login 还可以访问/login1 和/login2
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;
```

## 8. 导航守卫

**全局前置守卫**

1. 全局前置守卫：在 router/index.ts 中定义全局前置守卫，在每个路由切换前执行。

主要是函数 router.beforeEach()，接收三个参数：

- to: RouteLocationNormalized: 即将要进入的目标路由对象
- from: RouteLocationNormalized: 当前导航即将离开的路由对象
- next: NavigationGuardNext: 一定要调用该方法来 resolve 这个钩子，否则路由不会发生变化。

以下是全局前置守卫的示例代码:

```typescript
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../components/index.vue'),
    },
    {
        path: '/login',
        component: () => import('../components/login.vue'),
        name: 'login',
        alias: ['/login1', '/login2'],
    },
    {
        path: '/reg/:name/:age',
        component: () => import('../components/register.vue'),
        name:'register'
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('../components/notFound.vue')
    },
    // 重定向到404页面
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

// 白名单 如果不在白名单中，则需要登录才能访问
const whiteList = ['/reg', '/', '/404']

router.beforeEach((to, from, next) => {
    if (whiteList.includes(to.path) || to.fullPath.length >= 10) {
        next()
    } else {
        next('/404'); // 如果判断tow.path不在白名单中，并且fullPath长度大于10，则跳转到404页面
    }
})
export default router;
```

**全局后置守卫**

1. 全局后置守卫：在 router/index.ts 中定义全局后置守卫，在每个路由切换后执行。

主要是函数 router.afterEach()，接收三个参数：

- to: RouteLocationNormalized: 即将要进入的目标路由对象
- from: RouteLocationNormalized: 当前导航即将离开的路由对象

**全局前置和后置守卫 进度条案例**

laodingBar.vue:

```vue
<template>
    <div ref="bar" class="bar"></div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const bar = ref<HTMLElement>();

const barSpeed = ref(0);

let animationTimer = ref<number>(0);

const startLoading = () => {
    let dom = bar.value as HTMLElement;
    barSpeed.value = 1;
    animationTimer.value = window.requestAnimationFrame(function fn() {
        if (barSpeed.value < 90) {
            barSpeed.value += 1;
            dom.style.width = `${barSpeed.value}%`;
            dom.style.display = 'block';
            animationTimer.value = window.requestAnimationFrame(fn);
        } else {
            barSpeed.value = 1;
            window.cancelAnimationFrame(animationTimer.value);
        }
    });
}
let delayCloseBar = 0;
let closeTimer = 0;
const endLoading = (delay: number) => {
    let dom = bar.value as HTMLElement;
    setTimeout(() => {
        closeTimer = window.requestAnimationFrame(function fn() {
            if (barSpeed.value < 100) {
                barSpeed.value = 100;
                dom.style.width = `${barSpeed.value}%`;
            } else {
                if (delayCloseBar > 30) {
                    dom.style.display = 'none';
                    barSpeed.value = 1;
                    window.cancelAnimationFrame(closeTimer);
                }
                delayCloseBar += 1;
                closeTimer = window.requestAnimationFrame(fn);
            }
        })
    }, delay)
}

defineExpose({
    startLoading,
    endLoading(delay: number) {
        endLoading(delay);
    },
})
</script>
<style scoped>
.bar {
    display: none;
    width: 100%;
    top: 0;
    height: 0.2vh;
    background-color: lightblue;
}
</style>
```

app.vue: 

```vue
<template>
    <loading-bar ref="loading" />
    <h1>Fuck World!</h1>
    <button class="margin-x" @click="index()">Index</button>
    <button class="margin-x" @click="login()">Login</button>
    <router-view></router-view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import loadingBar from './components/tool/loadingBar.vue'
const loading = ref();
const router = useRouter()
const index = () => {
    router.push({
        path: '/',
        }
    )
}
const login = () => {
    loading.value.startLoading();
    router.push({
        path: '/login',
        query: {
            name: 'ls',
            age: 26,
        }
    })
}
router.afterEach(() => {
    loading.value.endLoading(2000);
})
</script>
<style scoped>
.margin-x {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 26px;
}
</style>
```

## 9. 路由元信息

通过路由记录的 meta 属性可以定义路由的元信息。使用路由元信息可以在路由中附加自定义的数据，例如：
  - 权限校验标识。
  - 路由组件的过渡名称。
  - 路由组件持久化缓存 (keep-alive) 的相关配置。
  - 标题名称

以下为一个设置 meta 属性来定义每个页面的标题，然后在after样例:

```typescript
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
declare module 'vue-router' {
    interface RouteMeta {
        title: string; // ts语法 根据添加的meta属性来定义
        age?: number;
    }
}
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../components/index.vue'),
        meta: {
            title: '首页',
            age: 18
        }
    },
    {
        path: '/login',
        component: () => import('../components/login.vue'),
        name: 'login',
        alias: ['/login1', '/login2'],
    },
    {
        path: '/reg/:name/:age',
        component: () => import('../components/register.vue'),
        name:'register'
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('../components/notFound.vue')
    },
    // 重定向到404页面
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})
// 白名单 如果不在白名单中，则需要登录才能访问
const whiteList = ['/reg', '/', '/404']
router.beforeEach((to, from, next) => {
    if (whiteList.includes(to.path) || to.fullPath.length >= 10) {
        next()
    } else {
        next('/404');
    }
})
router.afterEach((to, from) => {
    document.title = to.meta.title || '不知道哪一页';
})

export default router;
```

## 10. 动态路由

动态路由主要是通过 `router.addRoute()` 方法来实现的，该方法可以动态添加路由。函数内参数跟在 `router/index.ts` 中的 `routes` 数组中的路由配置一样。

除此之外还拥有 `router.getRoutes()` 方法，可以获取当前路由的所有路由记录。



