# Django 中的异步编程

## 1. 异步开发的相关概念

### 并发

并发：多个任务在同一个 CPU 上，按细分的时间片轮流（交替）执行，从逻辑上来看是同时执行，但实际执行时间是错开的。

### 并行

并行：多个任务同时在多个 CPU 上执行，是真正的同时执行。

### 阻塞

阻塞：一个程序等待某个操作完成，而该操作需要一段时间才能完成，此时程序无法继续执行，即被阻塞。

### 同步

同步：多个任务之间有先后顺序执行，一个执行完下个才能执行。

### 异步

异步：多个任务之间没有先后顺序，可以同时执行，不需要等待某个任务结束，就可以执行下个任务。

## 2. 异步开发的几种实现方式

实现异步开发，可以使用多进程、多线程、协程来实现

### 多进程

多进程：启动多个进程，每个进程虽然只有一个线程，但多个进程可以一块执行多个任务。

### 多线程

多线程：启动一个进程，在一个进程内启动多个线程，这样，多个线程也可以一块执行多个任务。

### 协程

协程：启动一个进程，在一个进程内启动多个协程，这样，多个协程也可以一块执行多个任务。

## 3. 协程

### 协程的概念

协程：协程是一种**用户态**的轻量级线程，协程的调度完全由用户控制。协程通过协作式多任务来实现，这意味着协程会主动交出控制权，让其他协程运行。与线程和进程不同，协程的切换不需要操作系统内核的介入，从而降低了开销。

### 协程实现并发

协程实现并发编程的核心思想是利用函数的暂停和恢复。在协程中，函数可以在某个点暂停执行，并在适当的时候恢复执行，而不会影响其他协程的运行。这种机制使得多个协程可以在单个线程内交替执行，从而实现并发。
协程的实现通常依赖于以下两个关键概念：

1. 生成器（Generator）：生成器是一种特殊的函数，可以在执行过程中多次暂停和恢复。通过生成器，我们可以实现简单的协程功能。例如，在 Python 中，使用 yield 关键字可以创建生成器。
2. 异步编程（Asynchronous Programming）：异步编程是一种编程范式，允许程序在等待输入/输出操作完成时执行其他任务。在协程中，可以利用异步编程实现并发。例如，Python 中的 async 和 await 关键字提供了异步编程的支持。

### Python Web 开发中的部署方式

在 Python Web 开发中，部署方式主要有以下几种：

1. WSGI： WSGI（Web Server Gateway Interface）是一种用于连接 Web 服务器和 Web 应用程序的接口规范。WSGI 允许 Web 服务器和 Web 应用程序之间进行通信，从而实现 Web 应用程序的部署。它是同步的，通过多进程+多线程的方式来进行实现的。
2. ASGI： ASGI（Asynchronous Server Gateway Interface）是一种用于连接异步 Web 服务器和 Web 应用程序的接口规范。ASGI 允许 Web 服务器和 Web 应用程序之间进行通信，从而实现 Web 应用程序的部署。它是异步的，通过多进程+主线程搭配协程的方式来进行实现的。

## 4. Python 协程开发

### 4.1 第一个协程代码

接下来将通过一个简单的例子来演示和讲解协程代码。

#### 使用 uv 来管理项目

uv 是一个用于管理 Python 项目的工具，它可以帮助我们快速创建项目结构、安装依赖、运行项目等。

1. 使用 uv 创建项目

```shell
uv init coroutine_quickstart
```

2. 使用 uv 启动项目

```shell
uv run main.py
```

#### 编写第一个协程代码

接下来编写第一个协程代码：

```python
import asyncio

async def main():
    print('hello')
    await asyncio.sleep(1) # 协程必须要等待，即必须在前面加上await关键字
    print('world')


if __name__ == "__main__":
    # main() # 这只是创建一个协程，并不是直接运行main函数，并且这个协程并不会自己运行
    asyncio.run(main())
```

首先**协程**代码不会自己运行，即`main()`这样编写，含义是创建一个协程，而不是直接运行`main()`函数。
其次在函数面前加上 `async` 关键字，将一个普通的函数变为一个异步函数，即一个协程。类似 `js` 中的 `async function` 一样。
再者，在运行协程时，需要在其前面加上`await`关键字，表示等待，即协程必须等待，否则会报错。类似 `js` 中的 `await` 一样。

其实 `python` 中的协程和 `js` 中的 `async/await` 语法类似，都是通过 `async/await` 关键字来定义和运行协程。

#### 关于 Asyncio 中的事件循环

其实协程，其实就是类似创建了一个队列，然后在队列中添加任务，然后通过 while 死循环来将队列中的任务进行一一执行，当然执行的过程中，如果遇到阻塞，那么就会跳过这个任务，继续执行下一个任务。直到所有的任务都遇到阻塞，那么就会继续挂起，将会执行其他代码。当阻塞代码完成时，又会跳回来继续执行。

文字看起来比较难以理解，以下一个伪代码可以简单的说明一下：

```python
event_queue = [cor1, cor2, cor3, ....]
while Ture:
    cor = event_queue.pop(0)
    res = await cor()
    # 其他代码
```

### 计算时间的装饰器

接下来将简单讲解下 Python 中的装饰器的编写。这是由于在后续 Python 中时常会使用到计算一个协程的运行时间，为了方便，所以编写了一个装饰器，用于计算一个协程的运行时间。

```python
from functools import wraps
import time

def async_timed(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        print(f'runing func: {func.__name__}, params: {args}, {kwargs}')
        start = time.time()
        try:
            return await func(*args, **kwargs)
        finally:
            end = time.time()
            total = end - start
            print(f'func: {func.__name__}, total time: {total:.4f}')

    return wrapper
```

以上就是计算时间的装饰器，使用起来非常简单，只需要在需要计算运行时间的协程前面加上 `@async_timed` 即可。

其原理就是：当一个函数被装饰器装饰时，会返回一个函数，这个函数就是装饰器内部定义的 `wrapper` 函数，而 `wrapper` 函数会调用被装饰的函数，并在调用前后分别打印出函数名和参数，以及运行时间。

### 如何并发多个协程

我们已经知道如何编写一个协程了，即使用 `async` 和 `await` 关键字来定义一个协程。那么该如何并发(同时运行)多个协程呢？

接下来将讲解三种方式来进行并发多个协程：

1. 使用创建 **任务** 的方式并发协程

如果想要并发运行多个协程，那么可以将任务创建成 Task/Future 对象，然后再将 Task/Future 对象添加到事件循环中。

```python
import asyncio
import time
from utils import async_timed

async def greet(name, delay):
    await asyncio.sleep(delay) # 假设该协程陷入阻塞，那么根据asyncio的原理，该协程会释放GIL，从而让其他协程得以运行
    print(f"i'am {name}!")
    return name

@async_timed
async def method1():
    # 通过创建任务的方式来并发运行多个协程
    task1 = asyncio.create_task(greet('hello', 1))
    task2 = asyncio.create_task(greet('world', 2))
    res1 = await task1
    res2 = await task2
    print(res1, res2)

if __name__ == "__main__":
    asyncio.run(method1())
```

那么以上的代码就是通过创建任务的方式来并发运行多个协程。运行总耗时应该是 2 秒左右。

2. 使用 **任务组** 的方式并发协程

除了通过创建任务的方式后，再一个一个 `await` 并发协程外，还可以通过 `TaskGruop` 创建一个任务组，然后在任务组中创建多个任务，最终统一 await 任务组。

```python
import asyncio
from utils import async_timed

async def greet(name, delay):
    await asyncio.sleep(delay) # 假设该协程陷入阻塞，那么根据asyncio的原理，该协程会释放GIL，从而让其他协程得以运行
    print(f"i'am {name}!")
    return name

@async_timed
async def method2():
    # 通过任务组的方式来进行
    try:
        async with asyncio.TaskGroup() as group:
            task1 = group.create_task(greet('hello', 1))
            task2 = group.create_task(greet('world', 2))
    except Exception as e:
        print(e)

if __name__ == "__main__":
    asyncio.run(method2())
```

以上的代码就是通过任务组的方式来进行并发协程的。但是这样是拥有一定的缺陷的，即如果其中一个任务出现异常，那么整个任务组都会被取消，而不会继续运行。假设说 `task1` 出现异常，那么 `task2` 就不会被运行。

3. 通过 **gather** 的方式并发协程

接下来将演示使用 `gather` 的方式来并发协程。

```python
import asyncio
from utils import async_timed

async def greet(name, delay):
    await asyncio.sleep(delay) # 假设该协程陷入阻塞，那么根据asyncio的原理，该协程会释放GIL，从而让其他协程得以运行
    print(f"i'am {name}!")
    return name
async def greet_expcetion(name, delay):
    if name == 'hello':
        raise Exception('hello is not allowed')
    await asyncio.sleep(delay)
    print(f"i'am {name}!")
    return name

@async_timed
async def method3():
    # 通过gather的方式来进行

    # gather与TaskGroup的区别在于，gather遇到其中某个任务抛出异常时仍然会继续运行其他任务，而TaskGroup则会抛出异常取消其他任务
    # 此外gather还支持不抛出异常，而是直接返回异常到结果当中
    try:
        results = await asyncio.gather(
            greet_expcetion("hello", 1),
            greet('world', 2),
            greet('goodbye!', 3),
            return_exceptions=True
        )
        print(results) # 会根据传入到gather的参数的顺序来返回结果
    except Exception as e:
        print(e) # 如果设置return_exceptions为True，那么遇到异常也不会被捕获

if __name__ == "__main__":
    asyncio.run(method3())
```

以上的代码就是通过 `gather` 的方式来并发协程的。
这里需要注意的点是：

- `gather` 与 `TaskGroup` 的区别在于，`gather` 遇到其中某个任务抛出异常时仍然会继续运行其他任务，而 `TaskGroup` 则会抛出异常取消其他任务
- `gather` 还支持不抛出异常，而是直接返回异常到结果当中，通过设置 `return_exceptions=True` 即可，如果设置了这个参数，那么遇到异常也不会被捕获。
- 通过 `gather` 返回的结果会按照传入到 `gather` 的参数的顺序来返回结果。

4. 通过 **as_completed** 的方式并发协程

通过上面 `gather` 方式并发协程，可以发现一个问题，就是想要获取协程的返回值的时候，需要等待所有的协程都运行完成才能够获取。那么当遇到需要及时获取协程的返回值的时候，就需要使用 `as_completed` 来并发协程了。

```python
import asyncio
from utils import async_timed

async def greet(name, delay):
    await asyncio.sleep(delay) # 假设该协程陷入阻塞，那么根据asyncio的原理，该协程会释放GIL，从而让其他协程得以运行
    print(f"i'am {name}!")
    return name

async def greet_expcetion(name, delay):
    await asyncio.sleep(delay)
    if name == 'hello':
        raise Exception('hello is not allowed')
    print(f"i'am {name}!")
    return name

@async_timed
async def method4():
    # 通过as_completed的方式来进行

    # as_completed会返回一个迭代器，该迭代器会返回已经完成的协程的结果，如果协程没有完成，那么该协程不会被返回
    # 此外如果遇到协程抛出异常，那么后续的协程不会被执行，并且会抛出异常。但是与tasksGroup不同的是，as_completed不会取消其他协程，只是将剩余协程进行挂起操作，仍然可以通过手动await来运行被异常打断后的协程
    try:
        funcs = [
            greet_expcetion('hello', 1),
            greet('world', 2),
            greet('goodbye!', 3)
        ]
        for task in asyncio.as_completed(funcs, timeout=4):
            res = await task
            print(f'function res: {res}')
    except Exception as e:
        print(e) # 异常会被捕获，但是后续协程不会执行，但会挂起，后续仍可以手动运行

    for task in asyncio.all_tasks():
        if task.get_name() != 'Task-1':
            result = await task
            print(f'function res: {result}')

if __name__ == "__main__":
    asyncio.run(method4())
```

以上代码就是通过 `as_completed` 的方式来并发协程的。
需要注意的是：

- `as_completed` 会返回一个迭代器，该迭代器会返回已经完成的协程的结果，如果协程没有完成，那么该协程不会被返回
- 如果遇到协程抛出异常，那么后续的协程不会被执行，并且会抛出异常。但是与 `tasksGroup` 不同的是，`as_completed` 不会取消其他协程，只是将剩余协程进行挂起操作，仍然可以通过手动 `await` 来运行被异常打断后的协程
- 另外 `as_completed` 还支持传入一个超时时间，如果协程在超时时间内没有完成，那么会抛出 `TimeoutError` 异常，并且后续协程不会被执行，但会挂起，后续仍可以手动运行。

### 等待

有些时候，我们希望一定的时间内如果协程未完成的话就去做其他的处理。那么就可以使用 `wait` 或者 `wait_for` 来等待协程运行完成。

1. `wait_for(aw, timeout)` 函数

`wait_for` 函数可以等待协程运行完成，如果协程在指定的时间内没有运行完成，那么会抛出 `TimeoutError` 异常。

```python
from utils import async_timed
import asyncio

async def greet(name, delay):
    await asyncio.sleep(delay)
    print(f'Hello {name}')
    return name

# wait_for
@async_timed
async def method1():
    try:
        result = await asyncio.wait_for(greet('World', 2), timeout=2)
        print(f'function return result: {result}')
    except asyncio.TimeoutError:
        print('TimeoutError') # 抛出超时异常后，该函数就会被中断执行，且不能够手动继续执行

if __name__ == "__main__":
    asyncio.run(method1())
```

以上的代码就是 `wait_for` 的使用方法，注意的是 `timeout` 参数是必传的，且如果协程在 `timeout` 时间内没有运行完成，那么会抛出 `TimeoutError` 异常，并且后续无法手动继续执行。

2. `wait(aws, timeout=None, return_when=ALL_COMPLETED)` 函数

这个函数可以等待单个或多个协程运行完成，如果协程在指定的时间内没有运行完成，那么**不会**抛出 `TimeoutError` 异常，而是返回执行完成的和未执行完成的 `Task` 对象。默认是等待所有的协程运行完成后才返回结果。

```python
from utils import async_timed
import asyncio

async def greet(name, delay):
    await asyncio.sleep(delay)
    print(f'i am {name}')
    return name

# wait
@async_timed
async def method2():
    aws = [
        asyncio.create_task(greet('hello', 2)),
        asyncio.create_task(greet('World', 3)),
        asyncio.create_task(greet('hi', 1))
    ]

    try:
        done_tasks, pending_tasks = await asyncio.wait(aws, timeout=2, return_when=asyncio.ALL_COMPLETED)
        print(f'done_tasks : {done_tasks}')
        print(f'pending_tasks : {pending_tasks}')
    except Exception as e:
        print(f'Exception : {e.__class__.__name__}')

    result = await asyncio.gather(*pending_tasks)
    print(f'pending_tasks result : {result}')

if __name__ == "__main__":
    asyncio.run(method2())
```

以上代码就是 `wait` 的使用方法，需要注意的是：

- 如果没有指定 `time_out` 参数，那么 `wait` 函数会一直等待，直到所有的协程都运行完成，才会返回结果
- 其中 `return_when` 参数可以指定返回结果的方式，可选值有：
  - `FIRST_COMPLETED`：只要有一个协程运行完成，那么就返回结果
  - `FIRST_EXCEPTION`：只要有一个协程抛出异常，那么就返回结果
  - `ALL_COMPLETED`：所有的协程都运行完成，那么就返回结果
- 在返回结果时，如果超时了，那么会返回执行完成的 `Task` 对象和未执行完成的 `Task` 对象，而未执行的可以后续通过手动继续执行。

### 超时

`asyncio` 提供了专门的超时 `API`，用于限制某些任务的最大执行时间。超时 `API` 有两个，分别是：`asyncio.timeout` 以及 `asyncio.timeout_at`

1. `asyncio.timeout(delay)` 函数

需要注意的是：

- 该函数返回一个异步上下文管理器，可以通过 `async with` 进行使用
- 其中 delay 参数是必传的，参数可以是 None，即表示永远不会超时
- 如果超过设置 delay 的时间，那么接下来的任务都会被取消，并会抛出 `asyncio.TimeoutError` 异常

```python
from utils import async_timed
import asyncio

async def greet(name, delay):
    await asyncio.sleep(delay)
    print(f'i am {name}')
    return name

@async_timed
async def delay_method1():
    try:
        async with asyncio.timeout(2):
            task1 = asyncio.create_task(greet('hello', 1), name='hello') # name 是指定该协程的名称
            task2 = asyncio.create_task(greet('World', 2), name='world') # name 是指定该协程的名称

            res1 = await task1
            res2 = await task2
            print(f'res1 : {res1}')
            print(f'res2 : {res2}')
    except asyncio.TimeoutError:
        print("超时了！")
    print(asyncio.all_tasks()) # 返回当前所有任务

if __name__ == "__main__":
    asyncio.run(delay_method1())
```

2. `asyncio.timeout_at(when)` 函数 **(不常用，拥有其他的替代方案)**

与 `asyncio.timeout` 函数类似，只不过 `asyncio.timeout_at` 函数是设置一个绝对时间，而不是相对时间，可以是 None。

```python
from utils import async_timed
import asyncio

async def greet(name, delay):
    await asyncio.sleep(delay)
    print(f'i am {name}')
    return name

@async_timed
async def delay_method2():
    try:
        time = asyncio.get_running_loop()
        deadTime = time.time() + 2
        async with asyncio.timeout_at(deadTime):
            task1 = asyncio.create_task(greet('hello', 1), name='hello') # name 是指定该协程的名称
            task2 = asyncio.create_task(greet('World', 3), name='world') # name 是指定该协程的名称

            res1 = await task1
            res2 = await task2
            print(f'res1 : {res1}')
            print(f'res2 : {res2}')
    except asyncio.TimeoutError:
        print("超时了！")

if __name__ == "__main__":
    asyncio.run(delay_method2())
```

### 在线程中运行协程

由于很多第三方库是不存在其异步版本的，但是项目又需要异步操作其他的处理。那么当遇到一些第三方库的耗时操作的时候，就会将整个程序进行阻塞。那么遇到这种阻塞的情况下，那我们项目就不是异步的了。所以这里提供了一个方案，就是将耗时的第三方库放到一个新的线程中执行，而原本的主线程继续跑我们的协程。即 **多线程+协程** 的模式，让程序不要被阻塞，因为遇到阻塞，那么协程就会暂停，那么程序就不再是异步的了。

```python
import time
from utils import async_timed
import asyncio

def get_url(url):
    print('start get url: {url}')
    time.sleep(2)
    print('end get url: {url}')

async def greet(name, delay):
    await asyncio.sleep(delay)
    print(f'hello {name}')

@async_timed
async def main():
    try:
        result = await asyncio.gather(
            asyncio.to_thread(get_url, 'https://www.baidu.com'), # 将同步函数转为异步函数，原理是通过线程的方式去实现
            greet('world', 2),
        )
        print(result)
    except asyncio.TimeoutError:
        print('TimeoutError')

if __name__ == "__main__":
    asyncio.run(main())
```

以上代码就是假设一个耗时的第三方库函数(同步函数)，然后通过 `asyncio.to_thread` 将其转为异步函数，然后通过 `asyncio.gather` 将其放入到协程中执行。
其原理就是通过线程的方式去实现，所以不会阻塞主线程，不会导致协程无法继续执行的情况。

### Task 对象

Task 对象是用于封装和管理协程的运行的，可以将协程并发执行。Task 对象有以下方法：

- `done()`：用于获取该 Task 对象是否执行完成。(正常完成、异常、被取消都算 done)
- `result()`：用于获取该 Task 对象的执行完成后的返回值。
- `exception()`：如果 Task 对象执行过程中发生异常，则该方法会返回异常信息。如果任务没有发生异常，那么调用 `exception()` 方法将抛出`asyncio.exceptions.InvalidStateError: Exception is not set·` 异常。
- `add_done_callback(fn)`：用于注册一个回调函数，当 Task 对象执行完成时，会自动调用该回调函数。回调函数的参数为 Task 对象:

  ```python
  import asyncio
  from functools import partial
  async def enternity(delay, what):
      await asyncio.sleep(delay)
      return what

  def callback(delay, future):
      print('回调')
      print('delay:', delay)
      print('执行结果：', future.result())

  async def main():
      print('main开始')
      task = asyncio.create_task(enternity(1, 'hello'))
      # partial 偏函数，可以将函数的部分参数固定住，返回一个新的函数
      task.add_done_callback(partial(callback, 2))
      await task
      print('main结束')
  ```

- `cancel()`：用于取消该 Task 对象的执行。如果 Task 对象已经执行完成，那么调用该方法将没有任何效果。如果 Task 对象正在执行，那么该方法会立即取消该 Task 对象的执行。如果 Task 对象被取消，那么调用 `result()` 方法将抛出 `asyncio.exceptions.CancelledError` 异常。
- `get_name()`：用于获取该 Task 对象的名称。
- `set_name(name)`：用于设置该 Task 对象的名称。也可以直接在创建 Task 对象时指定 name 为任务的名称。
