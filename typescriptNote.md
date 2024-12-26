---
outline: depp
prev: 
    text: 'SSH和SCP命令'
    link: /SSH和SCP命令.html
next:
    text: 'vitepress笔记'
    link: /vitepress.html
---



# Typescript 学习笔记

## 环境搭建

1. node.js 安装
[node.js官网下载安装包](https://nodejs.org/zh-cn)
直接百度进行安装即可，安装完成后会拥有npm命令

2. typescript 安装
通过npm命令进行安装typedscript，命令如下：
```shell
npm install -g typescript
```


## 基础数据类型

typescript支持的数据类型有
基础类型：Boolean、Number、String、null、undefined 以及 ES6 的  Symbol 和 ES10 的 BigInt。

1. 字符串类型
```typescript
let str: string = "hello world";
//也可以使用es6的字符串模板
let new_str: string = `iam a ${str}`
```

2. 数字类型
支持十六进制、十进制、八进制和二进制；
```typescript
let notANumber: number = NaN;//Nan
let num: number = 123;//普通数字
let infinityNumber: number = Infinity;//无穷大
let decimal: number = 6;//十进制
let hex: number = 0xf00d;//十六进制
let binary: number = 0b1010;//二进制
let octal: number = 0o744;//八进制
```

3. 布尔类型
**注意，使用构造函数 Boolean 创造的对象不是布尔值：**
```typescript
let isTrue: boolean = true;
let isFalse: boolean = false;
```

4. 空值类型
JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数
```typescript
function voidFn(): void {
    console.log('test void')
}
```
void 类型的用法，主要是用在我们不希望调用者关心函数返回值的情况下，比如通常的异步回调函数
void也可以定义undefined 和 null类型
```typescript
let u: void = undefined
let n: void = null;
```

5. Null和undefined类型
```typescript
let u: undefined = undefined;//定义undefined
let n: null = null;//定义null
```
void 和 undefined 和 null 最大的区别
与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 string 类型的变量：
```typescript
//这样写会报错 void类型不可以分给其他类型
let test: void = undefined
let num2: string = "1"
num2 = test

//这样是没问题的
let test: null = null
let num2: string = "1"
num2 = test
//或者这样的
let test: undefined = undefined
let num2: string = "1"
num2 = test
```

**TIPS 注意：**
如果你配置了tsconfig.json 开启了严格模式
**null 不能 赋予 void 类型**
```json
{
    "compilerOptions":{
        "strict": true
    }
}
```
## 实时调试typescript的环境操作

1. 可以先下载满神的管理npm镜像源的工具
```shell
npm i xmzs -g
```
安装完成后，会提供一个mmp命令，通过mmp -h 查看如何使用即可。

2. 然后安装typescript的实时调试环境
```shell
npm i ts-node -g
```

3. 在项目中进行创建typescript文件进行调试
```shell
npm i @types/node -D
```

4. 然后就可以通过ts-node进行typescript的实时调试了
```shell
ts-node index.ts
```

## 任意类型

any 任意类型 unknown 未知类型
1. 首先any 和 unknown 都是顶级类型，可以赋值给任意类型。
2. 其次是Object类型
3. 接着是大写的 Number String Boolean 类型
4. 然后是小写的 number string boolean 类型
5. 最后是 111 'X' false 这种字面量类型
6. 最底为never类型

当任意变量定义为any类型，那么就跟普通的js语法一样

此外any和unknown类型也是不一样的，any类型可以赋值给所有类型，但是unknown类型只能是被人赋值给他，他不能赋值给别人。
并且unknown类型不能够读其任何属性，方法也不能够进行调用。相反则any类型可以进行。
当然由于这种特征，推荐使用unknown类型而不是any类型。

## Object与object与{}的区别

1. 首先Object是所有原始类型以及对象类型，最终都会指向这个Object。即在typescript中Object表示包含了所有的类型，那它可以等于任何一个值。

2. 其次object是表示非原始数据类型的一个类型，即字符串 数字 布尔值 都是不支持的。它只支持引用数据类型，对象 数组 函数都是支持的。

3. 最后是{}，它表示一个空对象，可以把它理解为new Object的语法糖。等价于第一个大写的Object类型。另外他是不支持修改的，这个类型尽量少用。

## 接口和对象类型

### interface 接口
1. 定义方法，类似cpp的结构体定义
```typescript
interface Person {
    name: string;
    age: number;
}
// 这里使用它要完全遵循接口定义的格式 定义几个类型几个属性，对应声明也一样
let a: Person = {
    name: 'penglinchang',
    age: 25
}
```
2. interface的特性
- 重名定义interfce，会自动将其属性进行一个合并操作
```typescript
interface Person {
    name: string;
}
interface Person {
    age: number;
}
let a: Person = {
    name: 'penglinchang',
    age: 25
}
```

- 任意key的类型
当前端从后端获取到json数据的时候，但是我们并不知道json数据有哪些key，我只知道或只需要其中几个key，那么剩下的key我们可以用任意key的类型来定义接口
```typescript
interface Person {
    name: string;
    [propName: string]: any;
}
let a: Person = {
    name: 'SHENGWEN',
    age: 25,
    sex: '男'
}
```

- ?可选属性与readonly属性
在定义的interface中，对于某些属性可以使用?来定义可选属性，即可以不传这个属性，但是如果传了这个属性，那么它的类型必须和定义的类型一致。
```typescript
interface Person {
    name: string;
    age?: number;
}
let a: Person = {
    name: 'shengwen'
    // age: 12 // 可传可不传的属性
}
```
在定义的interface中，对于某些属性可以使用readonly来定义只读属性，即只能在创建对象的时候进行赋值，不能够再次赋值。
```typescript
interface Person {
    name: string;
    age?: number;
    readonly id: number;
    readonly getMoney:()=>number
}
let a: Person = {
    name: 'shengwen',
    age: 12,
    getMoney:()=>{
        return 10000
    }
}

let money:number = a.getMoney() // 10000
a.getMoney = ()=>{
    return 20000
} // 报错，不能够再次赋值
```

- 接口可以继承，即一个接口可以继承另一个接口的所有属性和方法
```typescript
interface Animal {
    name: string;
    eat(): void;
}
interface Dog extends Animal {
    bark(): void;
}
let dog: Dog = {
    name: 'wangcai',
    eat() {
        console.log('wangcai is eating')
    },
    // 同样需要定义bark方法
    bark() {
        console.log('wangcai is barking')
    }
}
```

- interface可以定义函数类型

```typescript
interface flySpeed {
    (name:string):number;
}
const speed:flySpeed = (name:string):number=>{
    return 100
}
```

## 数组类型

1. 这种定义方式来进行定义 string[] 字符串数组
```typescript
let arr: string[] = ['hello', 'world'];
```

2. 通过泛型来定义数组类型
```typescript
let arr: Array<string> = ['hello', 'world'];
```

3. 通过interface来定义数组类型
```typescript 
interface X {
    name: string;
    age?: number;
}
let arr: X[] = [{name: 'shengwen'}, {name: 'alice'}];
```

4. 定义二维数组
- 通过普通类型定义方法
```typescript
let arr: string[][] = [
    ['hello', 'world'],
    ['foo', 'bar']
];
```
- 通过泛型定义方法
```typescript
let arr: Array<Array<string>> = [
    ['hello', 'world'],
    ['foo', 'bar']
];
```
- 通过interface定义方法
```typescript
interface X {
    name: string;
    age?: number;
}
let arr: X[][] = [
    [{name: 'shengwen'}, {name: 'alice'}],
    [{name: 'penglinchang'}, {name: 'bob'}]
];
```

## 函数类型

- 函数类型定义和返回值 
```typescript
function add(x:number, y:number):number {
    return x + y;
}
```
- 箭头函数定义类型和返回值
```typescript
let add: (x:number, y:number):number => x + y;
```
- 函数类型参数的默认值
```typescript
let add: (x:number = 10, y:number = 20) => x + y;
```
- 函数类型参数的可选参数
但是函数类型参数的默认值和函数类型的可选参数不能够进行同时使用
```typescript
let add: (x:number, y?:number) => x + y;
```

- 函数的this类型
```typescript
interface Person {
    cell: number[];
    addCell:(this:Person, num:number)=>void;
}

let person:Person ={
    cell: [1,2,3],
    addCell(this:Person, num:number) => {
        this.cell.push(num);
    }
}

person.addCell(4);
console.log(person.cell); // [1,2,3,4]
```
另外注意，在使用this:Person的情况下，函数不能够定义为箭头函数。

- 函数重载
typescript支持函数重载，即一个函数可以有多个定义，但是函数的签名必须完全一致。
```typescript
function add(x:number, y:number):number;
function add(x:string, y:string):string;
function add(x:any, y:any):any {
    if(typeof x === 'number' && typeof y === 'number'){
        return x + y;
    }else if(typeof x ==='string' && typeof y ==='string'){
        return x + y;
    }else{
        return undefined;
    }
}
```