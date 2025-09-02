# asyncDjango 开发

## ASGI 服务器

1. ASGI 服务器介绍

   > 在以前，我们开发同步代码，可以使用 wsgi 协议的服务器来运行 django 项目，比如 uwsgi 。而现在开发异步代码，则必须使用 asgi 协议的服务器来运行，Django 官方推荐的有三个 asgi 服务器，分别是：`Daphne` 、`Uvicorn` 、`Hypercorn` 。其中 Daphne 是 Django 团队开发的，可以非常方便的集成到 Django 的开发环境中，而 `Uvicorn` 是基于 `uvloop`(异步开发框架，性能很好。2 倍以上的 nodejs，性能接近 go 语言) ，其性能能媲美 Go 语言，基于以上两点考虑，我们在开发阶段使用 `Daphne` ，在生产环境中使用 `Uvicorn` 。

2. 集成 Daphne

首先通过以下命令安装 `Daphne`：

```bash
pip install daphne
```

然后在 Django 项目的 `setting.py` 中添加 ASGI 配置：

```py
INSTALLED_APPS = [
    'daphne',
    # 其他应用...
]

ASGI_APPLICATION = 'myproject.asgi.application'
```

接着就可以通过 `python manage.py runasgi` 的方式运行项目了。如果控制台出现 `Starting ASGI/Daphne version 4.2.1 development server at http://127.0.0.1:8000/` 字样，代表项目已经通过异步的方式运行起来。

## Django 中的异步视图

1. 函数视图

如果是函数视图，则只需要在定义函数的时候，前面添加 `async` 关键字修饰，如下所示：

```py
from django.shortcuts import render
from django.views import View

# 函数视图
async def index(request):
    return render(request, 'index.html')

# 类视图
class AboutView(View):
    async def get(self, request):
        return render(request, 'about.html')
```

## Django 中的异步 ORM

数据库操作是一个典型的可以用异步优化的模块。在异步 ORM 中，存在两类操作：

1. 返回 QuerySet 的方法。在 Django 中，QuerySet 对象是懒惰的，他只是构建一个查询对象，并不会立即执行 SQL 语句。比如 Book.objects.all()返回的是 QuerySet 对象，只有对 QuerySet 对象执行以下操作时，才会真正执行 SQL 语句。
   - 迭代（循环）。
   - 切片。当步长不是 1 时，就会执行 SQL 语句,比如：`Book.objects.all()[::2]`
   - 使用 repr 函数。
   - 使用 len 函数获取元素个数。
   - 使用 list 函数强制转换为列表。
   - 使用 bool 函数、if 判断。

所以在异步模式中，不能直接使用以上操作，否则将运行阻塞的同步代码，阻塞事件循环。这种情况的处理方式，是通过异步迭代的方式来查找数据库。示例代码如下：

```py
queryset = Book.objects.all()
books = []
async for book in queryset:
    books.append(book)
```

另外完整的返回 QuerySet 对象的方法：[django queryset documents](https://docs.djangoproject.com/en/5.0/ref/models/querysets/#methods-that-return-new-querysets)

2. 不返回 QuerySet 对象的方法，比如 `get` 、`first` 、`save` 、`delete` 等。这类方法 `Django` 大多都提供了异步版本，比如 `aget`、 `afirst` 、`asave` 、`adelete` 。示例代码如下:

```py
# 查询
async for author in Author.objects.filter(name__startswith="A"):
        # afirst
    book = await author.books.afirst()

# 保存
async def make_book(*args, **kwargs):
    book = Book(...)
    # asave
    await book.asave()

async def make_book_with_tags(tags, *args, **kwargs):
        # acreate
    book = await Book.objects.acreate(...)
    # aset
    await book.tags.aset(tags)
```

另外完整的不返回 QuerySet 对象的方法：[django not queryset documents](https://docs.djangoproject.com/en/5.0/ref/models/querysets/#methods-that-do-not-return-querysets)

**注意：事务目前还不支持异步模式，如果想要实现事务的异步模式，需要借助 sync_to_async 来实现。**

3. 示例，从前端获取书籍的信息，然后验证后存入数据库当中：

首先是验证表单部分：

```py
# 验证表单
from .models import Book
from django import forms

class AddBookFrom(forms.Form):
    name = forms.CharField(min_length=1, max_length=100)
    author = forms.CharField(min_length=1, max_length=100)
    price = forms.FloatField()

    # 假设同名书名不允许
    def clean_name(self):
        name = self.cleaned_data.get('name')
        if Book.objects.filter(name=name).exists():
            raise forms.ValidationError('书名已存在，不可重复!')
        return name
```

接着是具体的 views 部分：

```py
# book/views.py
from django.shortcuts import render, redirect, reverse
from .froms import AddBookFrom
from asgiref.sync import sync_to_async
from django.http.response import HttpResponse
from .models import Book

# 异步获取非QuerySet的数据
async def book_detail(request, pk):
    try:
        # 在进行查询数据库的时候可以思考一下，所调用的方法是否会返回QuerySet
        # 如果返回的是QuerySet那么就采用 async for 的方式进行异步获取数据
        # 否则直接采用其对应提供的异步方法即可
        book = await Book.objects.aget(pk=pk)
        return render(request, 'detail.html', context={'book': book})
    except Exception as e:
        print('error:', e)
        return HttpResponse('查询的图书不存在!')

async def add_book(request):
    if request.method == 'GET':
        return render(request, 'add_book.html')
    else:
        form = AddBookFrom(request.POST)
        # if form.is_valid():
        # 由于 form.is_valid 其内部实现是同步方法，因此如果这里同样这么写的话，那么同步方法会阻塞事件循环。
        # 所以，这里推荐使用 sync_to_async 对其包装，将同步方法转为异步执行
        ais_valid = sync_to_async(form.is_valid)

        if await ais_valid():
            name = form.cleaned_data.get('name')
            author = form.cleaned_data.get('author')
            price = form.cleaned_data.get('price')
            # 异步的方式将数据添加到数据库当中
            # 1. 先创建对象 再进行异步保存
            # new_book = Book(name=name, author=author, price=price)
            # await new_book.asave()
            # 2. 直接以异步函数创建并保存
            new_book = await Book.objects.acreate(name=name, author=author, price=price)
            print("add book name={name} author={author} price={price} success")

            return redirect(reverse('book:detail', kwargs={'pk': new_book.id}))
        else:
            print('error is {}'.format(form.errors))
            return HttpResponse("添加失败")
```

## Django 中异步的适配函数

当在异步的环境中调用耗时的同步函数时，需要将同步函数转换为异步函数，这样才不会对事件循环进行阻塞。同理，如果在同步环境中调用异步函数，也需要将异步函数转换为同步函数。为此，Django 团队开发了一个叫做 asgiref 的包，里面提供了两个函数：sync_to_async 、async_to_sync 来**实现同步代码和异步代码的相互转换。**

1. `sync_to_async(sync func, thread_sensitive=True)` 转换同步为异步

将同步函数作为异步函数执行。其实底层原理，本质上是将同步函数放到线程中执行的，这样就不会阻塞事件循环了。示例代码如下：

```PY
class BaiduView(View):
    def get_page(self):
        resp = requests.get('https://www.baidu.com')
        return resp.text

    async def get(self, request):
        aget_page = sync_to_async(self.get_page)
        # thread_sentsitive 参数如果为False那么会使用一个新的进程去单独执行这个函数。
        aget_qq = sync_to_async(self.get_qq_page, thread_sensitive=False)
        text = await aget_page()
        return HttpResponse(text)
```

其中 `thread_sensitive` 参数用于控制同步函数的运行策略：

- `thread_sensitive=True`：（默认值）代表该请求的所有同步函数都在同一个线程（不是主线程）中执行。如果多个同步函数需要访问相同的临界值，那么就使用这种方式，因为这种方式会让当次请求的所有同步函数都在同一个线程中之行，不会对临界值造成问题。
- `thread_sensitive=False`：代表该同步函数在一个独立的线程中执行。同步函数间不会访问临界值，以及同步函数可能比较耗时，那么就可以用这种方式，因为这种方式会将同步函数放到新的线程中执行，可以提高并发性。

2. `async_to_sync(async func, force_new_loop=False)` 转换异步为同步

将异步函数作为同步函数执行。如果当前线程有事件循环，则会直接将异步函数加入到事件循环中执行，如果没有事件循环，则会先创建一个事件循环，再该异步函数加入到事件循环中执行。同步函数会等待这个事件循环执行完后才继续往下执行。

## Django 中异步中间件

在异步开发中，中间件必须是异步的，如果中间件是同步的，那么 django 会先通过线程的方式切换到同步模式来执行中间件代码，再切换到异步模式来执行视图函数代码。这样会抵消采用异步编程带来的性能提升。

1. 如何编写异步函数中间件？

如果用的是函数中间件，那么可以采用 `sync_only_middleware` 、`async_only_middleware` 、`sync_and_async_middleware` 三个装饰器来构建中间件的运行模式。比如我们使用 `sync_and_async_middleware` 装饰器来实现一个既支持同步又支持异步的中间件，示例代码如下：

```py
from asgiref.sync import iscoroutinefunction
from django.utils.decorators import sync_and_async_middleware

@sync_and_async_middleware
def simple_middleware(get_response):
    # One-time configuration and initialization goes here.
    if iscoroutinefunction(get_response):

        async def middleware(request):
            # 执行视图函数之前执行的
            response = await get_response(request)
            # 执行完视图函数之后执行的
            return response
    else:

        def middleware(request):
            # Do something here!
            response = get_response(request)
            return response

    return middleware
```

以上的这个中间件，就是在真正执行的时候无论是使用异步的方式去执行还是同步的方式去执行。该中间件都不会出现问题。

2. 如何编写异步类中间件？

如果采用的是类中间件，那么可以通过`async_capable` 、`sync_capable` 两个类属性来控制该类中间件支持的模式，默认是只支持同步的。用类中间件实现一个仅支持异步的中间件示例代码如下：

```py
from asgiref.sync import iscoroutinefunction, markcoroutinefunction

class AsyncMiddleware:
    async_capable = True
    sync_capable = False

    def __init__(self, get_response):
        self.get_response = get_response
        if iscoroutinefunction(self.get_response):
            markcoroutinefunction(self)

    async def __call__(self, request):
            # 进入视图函数之前的代码
        response = await self.get_response(request)
        # 执行完视图函数之后的代码
        return response
```

## 异步装饰器

下列装饰器既支持同步，也支持异步（django5.0 后添加的）：

- `cache_control()`
- `never_cache()`
- `no_append_slash()`
- `csrf_exempt()`
- `csrf_protect()`
- `ensure_csrf_cookie()`
- `requires_csrf_token()`
- `sensitive_variables()`
- `sensitive_post_parameters()`
- `gzip_page()`
- `condition()`
- `conditional_page()`
- `etag()`
- `last_modified()`
- `require_http_methods()`
- `require_GET()`
- `require_POST()`
- `require_safe()`
- `vary_on_cookie()`
- `vary_on_headers()`
- `xframe_options_deny()`
- `xframe_options_sameorigin()`
- `xframe_options_exempt()`
