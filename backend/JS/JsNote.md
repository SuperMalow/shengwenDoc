# JS Note

### JS基础知识点

(MDN官网)[https://developer.mozilla.org/zh-CN/]

### JS基础了解

ES6，是js最新的规范(严格的js写法)，在html中以下面这种方式进行使用。那么加上个`type="module"`会有什么效果呢，严格限制每个`script`标签的变量的作用域。

```html
<srcipt type="module"></srcipt>
```

在js文件通过export关键字来暴露出变量或者函数出去到其他文件进行导入	s

```js
// index.js
let name = 'plc';
export {
	name,
}
```

```html
<!-- index.html -->
<script type="module">
import { name } from "./1/index.js";
        console.log(name);
</script>
```

### JS变量与运算符

**变量声明**

`let`与`const`
用来声明变量，作用范围为当前作用域。

`let`用来定义变量；
`const`用来定义常量；

**变量类型**
`number`：数值变量，例如1, 2.5
`string`：字符串，例如"acwing", 'yxc'，单引号与双引号均可。字符串中的每个字符为只读类型。
`boolean`：布尔值，例如true, false
`object`：对象，类似于C++中的指针，例如[1, 2, 3]，{name: "yxc", age: 18}，null
`undefined`：未定义的变量

```js
// typeof 可以显示变量的变量类型
let x = 1;
consolo.log(typeof x); // number
```

另外js中，每个字符串都是只读类型，类似Java而不是C++，不能够通过下标去改变某个位置上的字符。不过可以通过`substr(from, length)`来进行切分字符串。 

### 输入与输出

**输入**

从HTML与用户的交互中输入信息，例如通过input、textarea等标签获取用户的键盘输入，通过click、hover等事件获取用户的鼠标输入。

**输出**

调试用console.log，会将信息输出到浏览器控制台。
改变当前页面的HTML与CSS。

**格式化字符串**

字符串中填入数值：

```JS
let name = 'yxc', age = 18;
let s = `My name is ${name}, I'm ${age} years old.`;
```

定义多行字符串：

```js
let s = 
`<div>
    <h2>标题</h2>
    <p>段落</p>
/div>`
```

保留两位小数如何输出

```JS
let x = 1.234567;
let s = `${x.toFixed(2)}`;
```

对于数字的取整可以通过使用Math库内的函数，具体都有啥可以查看MDN官网。

### 判断语句

跟C++和Java一样，不过多赘述...

### 循环语句

跟C++和Java一样同样不过多赘述...

### 对象

类似C++中的map，是由key:value的键值对来构成。

- 而value可以是变量、数组、对象、函数等。
- 函数定义中的this是来引用该函数的“拥有者”

```js
let person = {
    name; 'plc',
    age: 18,
    add_money: function (x) {
        this.money +=x;	
    }
}

// 可以通过这样来访问对象的属性
person.name;
person['name'];

// 还可以这样删除对象的属性 
delete person.age;
```

### 数组

数组是一种特殊的对象。

类似C++中的数组，但是数组中的元素类型可以不同。

- 数组中的元素可以是变量、数组、对象、函数。

```JS
let a = [1, 2, 'a', "bcd", function () {
    console.log('hello world');
}, {name: 'plc', age: 18}];
```

**如何访问数组中的元素？**

通过下标来进行访问

```js
let a = [1, 2, 'a', "bcd", function () {
    console.log('hello world');
}, {name: 'plc', age: 18}];
// 访问
console.log(a[0], a[2]);
// 修改
a[0] = function() {
    console.log('hhhhh');
}
a[0](); // 使用
```

**数组常用属性和函数**

- 属性`length`，获取数组的长度

- `push()`向数组末尾添加元素

- `pop()`删除数组末尾的元素

- `splice(a, b)` 删除从`a`开始的`b`个元素

- `sort()` 将整个数组从小到大进行排序

  - 可以自定义排序的规则

  ```JS
  a.sort(function(a, b) => {
         // 返回：负数 a<b, 0 a=b, 正数 a>b
         return b - a; // 从大到小排序
         })
  ```

### 函数

跟C++中的函数类似

```js
// 写法1
function add(a, b) {
    return a + b;
}
// 写法2
let add = function (a, b) {
    return a + b;
}
// 推荐写法(已经回不去了)
let add = (a, b) => {
    return a + b;
}
```

### 类

跟C++中的Class类型，但是不存在私有成员。

- `this`指向类的实例

```js
// 定义
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.init();
    }
    init() {
        this.sum = this.x + this.y;
    }
    
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

// 使用
let p = new Point(3, 4);
console.log(p.x, p,y);
console.log(p.toString());
```

**继承**

```JS
class ColorPoint extends Point {
    constructorx, y, color) {
        super(x, y); // 一定要先执父类的构造函数
        this.color = color; 
    }
}
```

**静态方法**

在成员函数前添加`static`关键字即可。静态方法不会被类的实例继承，只能通过类来调用。，类似Java。

```JS
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    static print_class_name() {
        console.log("Point");
    }
}

let p = new Point(1, 2);
Point.print_class_name();
```

**静态变量**

在ES6中，只能通过`class.propname`定义和访问。

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        Point.cnt++;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

Point.cnt = 0;

for(let i = 0; i < 5; i ++) {
    new Point(i, i + 1);
}
// 输出5
console.log(Point.cnt)
```

### 事件

js的代码一般通过事件来进行触发

可以通过`addEventListener`函数为元素绑定事件的出发函数。

常见的触发函数有

**鼠标**

- `click` 鼠标左键点击
- `dblclick` 鼠标左键双击
- `contextmenu `鼠标右键点击
- `mousedown` 鼠标按下，包括左键、滚轮、右键
  - `event.button` 0表示左键 1表示中建 2表示右键
- `mouseup` 鼠标弹起 包括左键 滚轮 右键
  - `event.button` 0表示左键 1表示中键 2表示右键

**键盘**

- `keydown` 某个键是否被按住，事件会连续触发
  - `event.code` 返回按的是哪个键
  - `event.altKey` `event.ctrlKey` `event.shiftKey` 分别表示是否同时按下了`alt` `ctrl` `shift`键
- `keyup` 某个按键是否被释放
  - `event` 常用属性同上
- `keypress` 紧跟在`keydown`事件后触发，只有按下字符键时重复啊。适用于判断用户输入的字符
  - `event` 常用属性同上

`keydown`、`keyup`、`keypress`的关系类似于鼠标的`mousedown`、`mouseup`、`click`

**表单**

- `focus` 聚焦某个元素，当聚焦这个元素的时候会触发事件
- `blur` 取消聚焦某个元素，当取消聚焦这个元素的时候会触发事件
- `change` 某个元素的内容发生了改变，当聚焦输入框的时候，内容发现改变，但是得需要取消聚焦的时候，`change`才会触发事件

**窗口**

需要作用到`window`元素上

```JS
windows.addEventListener('resize', (e) => {
    // 当浏览器窗口发生改变的时候会触发打印函数
   console.log(e.type);
})
```



- `resize` 当窗口大小发生变化
- `scroll` 滚动指定的元素
- `load` 当元素被加载完成 当某个元素加载完成后触发相应的事件

### 常用库

**jQuery**

**使用**：`npm install jquery`

**选择器**：`$(selector)` 类似与CSS选择器。

```js
$('div')
$('.my-div')
$('#mydiv')
```

**事件**

`$(selector).on(event, func)`**绑定**事件，例如：

```js
$('div').on('click', ()= > {
    console.log('div');
})
```

`$(selector).off(event, func)`**删除**事件，例如：

```JS
$('div').on('click', () => {
    cconsole.log('click div');
    // 删除这个事件
    $('div').off('click');
})
```

当存在多个相同类型的事件触发函数时，可以通过`click.name`来区分，例如：

```js
$('div').on('click.first', () => {
	console.log('click div');
    $('div').off('click.second');
})
$('div').on('click.second', () => {
    console.log('click div');
})
```

在事件触发的函数中的return false等价于同时执行：

- `e.stopPropagation()` 阻止事件向上传递（类似div中有一个a标签，且两个标签都有各自的把事件触发函数，当点击a标签的时候，同时div标签也应该触发，而这个阻止事件向上传递就是a标签触发的时候会阻止div的事件的触发）
- `e.preventDefault()` 阻止事件的默认行为（例如绑定了一个a标签，当点击a标签的时候会跳转页面，但是阻止事件的默认行为会将这个跳转页面功能给阻止掉不能够跳转）

**元素的隐藏、展现**

- `$A.hide()` 隐藏，可以添加参数，表示消失的时间
- `$A.show() `展现，可以添加参数，表示消失的时间
- `$A.fadeOut()` 慢慢消失，淡出，参数表示消失的时间
- `$A.fadeIn() `慢慢出现，淡入，参数表示消失的时间

**元素的添加、删除**

- `$('<div class="mydiv"><span>Hello World</span></div>')`: 构造出一个`Jquery`对象
- `$A.append($b)` 将`$b`添加在`$A`的末尾
- `$A.prepend($b)` 将`$b`添加在`$A`的开头
- `$A.remove()` 删除元素`$A`
- `$A.empty()` 清空元素`$A`的所有儿子

**对类的操作**

- `$A.addClass(class_name)` 添加某个类
- `$A.removeClass(class_name)` 删除某个类
- `$A.hasClass(class_name)` 判断某个类是否存在

**对CSS的操作**

- `$('div').css('background-color')` 获取到某个`CSS`的属性
- `$('div').css('background-color') `设置某个`CSS`的属性
- 同时设置多个`CSS`的属性：

```JS
$('div').css({
    width: "200px"
    height: "200px",
    'background-color': "orange"
})
```

**对标签属性操作**

- `$('div').attr('id')` 获取标签的属性
- `$('div').attr('id', '18')` 设置标签的属性

**对HTML内容、文本的操作**

- `$A.html()` 获取、修改`HTML``内容，参数即为要修改的内容
- `$A.text()` 获取、修改文本信息，参数即为要修改的内容
- `$A.val()` 获取、修改文本的值，参数即为要修改的内容（一般用在`input`等输入的标签）

**查找**

- `$(selector).find(fliter)` 在所有的后代元素中查找

**Ajax与后端通信**

**GET方法**

```js
$.ajax({
    url: url,
    type: 'get',
    data: {
	},
    dataType: 'json',
    success: (resp) => {
	},
    error: (resp) => {
	}}
});
```

**POST方法**

```js
$.ajax({
    url: url,
    type: 'post',
    data: {
	},
    dataType: 'json',
    success: (resp) => {
	},
    error: (resp) => {
	}}
})
```

### setTimeout与setInterval

- `setTimeout(func, delay)` `delay`毫秒后，执行函数`func()`

- `clearTimeout()` 关闭定时器，例如

```JS
let timeout_id = setTimeout(() => {
    console.log('hello world!')
}, 2000) // 2秒后会输出hello world!

clearTimeout(timeout_id); // 清除定时器
```



- `setInterval(func, delay)` 每隔`delay`毫秒，执行一次函数`func()`。第一次在第`delay`毫秒后执行。
- `clearInterval()`关闭周期执行的函数，例如：

```js
let interval_id = setInterval(() => {
    console.log("hello world!");
}, 2000) // 每隔2秒 输出一次 hell world!

clearInterval(interval_id); // 清楚周期执行的函数
```

### requestAnimationFrame 做动画的重中之重

`requestAnimationFrame(func)`该函数会在下次浏览器刷新页面之前执行一次，通常会用**递归写法**使其每秒执行60次`func`函数。调用时会传入一个参数，表示函数执行的时间戳，单位为毫秒.

与`setTimeout`和`setInterval`的区别：

- `requestAnimationFrame`渲染动画的效果更好，性能更加。
  该函数可以保证每两次调用之间的时间间隔相同，但`setTimeout`与`setInterval`不能保证这点。`setTmeout`两次调用之间的间隔包含回调函数的执行时间；`setInterval`只能保证按固定时间间隔将回调函数**压入栈中**，但具体的执行时间间隔仍然受回调函数的执行时间影响。
- 当页面在后台时，因为页面不再渲染，因此`requestAnimationFrame`不再执行。但`setTimeout`与`setInterval`函数会继续执行。

### Map与Set

**`Map` 对象保存键值对。**

**遍历：**

- 键值可以为任意值，包括函数、对象或任意基本类型。
- 用`for...of`或者`forEach`可以按插入顺序遍历。

```js
let map = new Map();
map.set(’age', 18);
map.set('name', 'shengwen')
// 遍历1
for (let [key, value] of map) {
    console.log(key, value);
}
// 遍历2
map.forEach((value, key) => {
    console.log(key, value);
})
```

**常用API**

- `set(key, value)` 插入键值对,如果`key`原本已存在会覆盖原来的`value`
- `get(key)` 查找关键字 如果不存在会返回`undefined`
- `size` 返回键值对的数量
- `has(key)` 返回是否包含关键字`key`
- `delete(key)` 删除关键字`key`
- `clear()` 删除所有元素

**`Set` 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。主要是用来去重的**

**遍历：**

- 用`for...of`或者`forEach`可以按插入顺序遍历。

**常用API**

- `add() `添加元素
- `has()` 返回是否包含某个元素
- `size()` 返回元素数量
- `delete()` 删除某个元素
- `clear()` 删除所有元素

### localStorage

可以在用户的浏览器上存储键值对。

**常用API：**

- `setItem(key, value)` 插入键值对
- `getItem(key)` 查找
- `removeItem(key)` 删除
- `clear()` 清空

### JSON

JSON对象用于序列化对象、数组、数值、字符串、布尔值和null。

**常用API：**

- `JSON.parse()` 将字符串解析成对象
- `JSON.stringify()` 将对象转换为字符串

### 日期

返回值为整数的API，数值为1970-1-1 00:00:00 UTC（世界标准时间）到某个时刻所经过的毫秒数

- `Date.now()` 返回现在时刻

**Date对象相关API**

- `getDay()`：返回星期，0表示星期日，1-6表示星期一至星期六
- `getDate()`：返回日，数值为1-31
- `getMonth()`：返回月，数值为0-11
- `getFullYear()`：返回年份
- `getHours()`：返回小时
- `getMinutes()`：返回分钟
- `getSeconds()`：返回秒
- `getMilliseconds()`：返回毫秒

### WebSocket

与服务器建立全双工连接。

**常用API：**

- `new WebSocket('ws://localhost:8080');`：建立`ws`连接。
- `send()`：向服务器端发送一个字符串。一般用`JSON`将传入的对象序列化为字符串。
- `onopen`：类似于onclick，当连接建立时触发。
- `onmessage`：当从服务器端接收到消息时触发。
- `close()`：关闭连接。
- `onclose`：当连接关闭后触发。

### window

常用API：

- `window.open("http://www.shengwen.space")`在新标签栏中打开页面。
- `location.reload()`刷新页面。
- `location.href = "http://www.shengwen.space"`：在当前标签栏中打开页面。

### canvas

[CanvasMDN教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)
