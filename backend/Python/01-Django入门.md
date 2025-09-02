# 0. Django 介绍

[Django](https://www.djangoproject.com/) 是一个开箱即用的 Web 框架，包括了数据库处理、HTML 渲染、管理系统、邮件系统、登录鉴权等常用功能，Django 都已经集成好了，只要学会了 Django，那么整个开发过程是非常快速的。另外 Django 在安全方面也做得很完善，节省了开发者在安全方面的时间。

# 1. Django 环境配置

首先 Django 需要 Python 环境，而且最新的 Django5 仅支持 Python 3.10/3.11/3.12 ... 本文档将采用 Python 3.12 作为示例使用。

## 1.1 安装 Anaconda 管理 Python 环境

网上摘抄了一个安装 Anaconda 的教程 [Anaconda 安装教程](https://blog.csdn.net/tqlisno1/article/details/108908775)
当然文中的下载安装包可以去 [清华大学镜像站](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/) 进行下载。

接着第二步需要配置国内的镜像源，否则下载速度会非常慢，这里推荐使用清华大学的镜像源，具体配置方法如下(**前提是配置好环境变量**)：

```SHELL
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud//pytorch/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro/

conda config --set show_channel_urls yes #设置搜索时显示通道地址
```

## 1.2 Anaconda 的简单使用

Anaconda 主要的操作是：创建虚拟环境、使用虚拟环境、在虚拟环境内安装 Python 包、删除虚拟环境。

```shell
# 使用 Anaconda 创建虚拟环境
conda create -n myenv python=3.12 # myenv 是虚拟环境名称，python=3.12 是指定 Python 版本

# 使用 Anaconda 使用虚拟环境
conda activate myenv # 激活虚拟环境
conda deactivate # 退出虚拟环境

# 在虚拟环境内安装 Python 包
conda install -n myenv <package> # -n 指定虚拟环境名称，<package> 是要安装的包名

# 删除虚拟环境
conda remove -n myenv --all # -n 指定虚拟环境名称，--all 表示删除虚拟环境以及虚拟环境内的所有包

# 显示所有虚拟环境
conda env list

# 查看当前虚拟环境内的包
conda list

# 查看 conda 所有命令
conda --help
```

# 2. 基础知识补充

## 2.1 URL 基本知识

首先 URL 指的是 Uniform Resource Locator，即统一资源定位符，它是一种用于标识某一互联网资源名称的字符串。
现在以一个常见的 URL 地址来进行讲解：`http://www.shengwen.space:80/hello/world?name=shengwen&age=20#1`

- `http://`：表示协议，指的是通过整个协议来进行访问，通常有 `http`、`https`、`ftp` 等等
- `www.shengwen.space`: 主机名，域名
- `:80`: 端口号，表示通过这个端口号来进行访问，这里可以省略，因为浏览器默认访问的端口是 `80`
- `/hello/world`: 路径，表示访问的路径
- `?name=shengwen&age=20`: 查询字符串(query-string)
- `#1`: hash，表示锚点，用于定位页面中的某个位置，通常是前端负责的部分，后端不需要关心

TIPS: URL 中的所有字符都是 ASCII 字符集，如果出现非 ASCII 字符集，浏览器会自动进行编码后再进行访问。

# 3. 第一个 Django 项目

一般来说，创建 Django 项目，可以通过 Pycharm 来进行创建，其次就是通过命令行来进行创建。由于作者采用的是 VSCODE 进行开发，故这里采用命令行来进行创建项目。

## 3.1 Anaconda 创建虚拟环境

首先创建一个虚拟环境，这里命名为 `django-learn`，Python 版本为 `3.12`:

```SHELL
# 创建虚拟环境
conda create -n django-learn python=3.12
# 查看本地所有虚拟环境
conda env list
```

接着激活这个虚拟环境并安装 Django:

```SHELL
conda activate django-learn
conda install django
# 查看当前虚拟环境下安装的所有包
conda list
# 查看是否安装完成
django-admin --version
```

接下来就可以通过 Django 提供的命令来创建 Django 项目了：

```SHELL
# 当然需要进入到指定的目录下进行执行
django-admin startproject django_learn
```

最后进入项目目录，启动项目，即可在 `http://127.0.0.1:8000/` 访问我们创建的第一个 Django 项目了：

```SHELL
cd django_learn
python manage.py runserver
```

## 3.2 Django 项目结构

- `manage.py`: 用于管理 Django 项目的命令行工具，通常用于启动项目、创建应用、数据库迁移等。可以通过 `python manage.py --help` 来查看所有命令。
- `settings.py`: 项目中的配置文件，所有和项目相关的配置都是在这个文件进行编写的。
- `urls.py`: 主要是为项目配置 URL 路由的文件，所有的 URL 都是通过这个文件来进行配置的。
- `wsgi.py`: 用于部署项目的文件，通常用于部署到服务器上。

## 3.3 Django 中 Project 和 app 的关系

Django 中的 Project 和 app 是两个不同的概念，Project 是一个项目，而 app 是一个模块，一个 Project 可以包含多个 app，而一个 app 可以被多个 Project 所使用。这里读者只需要将 app 理解成模块即可，而且模块是可复用的。

那么同样的 app 的创建也是通过 `manage.py` 文件来创建的：`python manage.py startapp book` 这行命令会创建一个名称为 `book` 的 app。

# 4. URL 分发器

## 4.1 视图(Views)

在 Django 中，视图是用于处理用户请求的函数，视图函数需要接收一个 `HttpRequest` 对象作为参数，然后返回一个 `HttpResponse` 对象。可以把视图看作成一个路由的功能(但是其实 Django 的 Views 类似于其他框架的 Controller+Services)。

以下将创建一个简单的视图函数来进行示例：

首先编写完视图函数，

```python
# book/views.py
from django.shortcuts import HttpResponse

# 每一个视图函数的参数都必须是一个HttpRequest对象，即request
def hello(request):
    return HttpResponse("Hello World!")
```

写完上诉视图函数后，正常来说，其他框架的话，只需要在其函数加上指定的路由装饰器即可。但是在 Django 中，需要通过 `urls.py` 文件来进行路由的配置，所以需要将视图函数注册到 `urls.py` 文件中：

```python
# book/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.hello), # 这里就是将views.py内编写的hello函数进行注册
]
```

在本 app(模块) 内注册完成路由后，还需要在 project 中进行路由的注册：

```python
# django_learn/urls.py

from django.contrib import admin
from django.urls import path
from django.urls import include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("book", include("book.urls"))
]
```

那么这样就完成编写了一个简单的视图函数，并且将其注册到路由当中。这么一来一回虽然说很麻烦，但是从逻辑上来捋，却是很清晰明了。
通过访问 `http://127.0.0.1:8000/book` 即可访问到我们编写的视图函数。

## 4.2 在 URL 中携带参数

有时候，URL 中包含了一些参数来进行动态的访问，比如访问 `http://127.0.0.1:8000/book/1`，我的需求是希望访问到第一本图书的信息，那么就需要在 URL 中携带参数，那么在 Django 中，如何来获取请求的参数呢？

### 4.2.1 通过 query-string 来进行获取参数

query-string 前面已经介绍过了，就是通过访问的 URL 中添加以?开头的字符串，然后通过 & 符号进行拼接，最后通过 key=value 的形式进行传递。接下来简单编写一个通过 URL 来获取 query-string 参数的视图函数：

```python
def book_detail(request):
    book_id = request.GET.get('id')
    book_name = request.GET.get('name')
    return HttpResponse("book_id: %s, book_name: %s" % (book_id, book_name))
```

完成编写后，需要重新在 urls 中进行重新注册即可访问: `http://127.0.0.1:8000/book?id=2&name=shengwen&age=20` 即可得到: `book_id: 2, book_name: shengwen` 这样的返回字符串，由于我们的视图函数中并没有使用到 `age` 参数，虽然 URL 中携带了 `age` 参数，但是视图函数中并没有使用到，所以并不会返回。

### 4.2.1 通过 URL 中的 path 来获取参数

path 我们前面也介绍过了，也就是 `/book/1` 这种形式，而`/1` 就是我们将要获取的参数，那么该如何来获取呢？那么这里 Django 帮我们做了一定的简化处理，我们只需要在 urls 中根据特定的规则来编写即可：

```python
# book/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.book_detail),
    path("/<int:book_id>", views.book_detail_path) # 特定规则就是使用尖括号进行包裹
]
```

上面提到的特殊规则就是需要通过尖括号来进行包裹，然后通过 `int` 来指定参数的类型，那么这里就指定了参数的类型为 int，那么在视图函数中就可以通过 `book_id` 来获取到参数了。以下则为对应的视图函数：

```python
from django.shortcuts import HttpResponse

# 这里的book_id需要同urls文件内定义的参数保持一致
def book_detail_path(request, book_id):
    return HttpResponse("book_id: %s" % (book_id))
```

在通过尖括号包裹参数后前面指定对应的类型，有两个好处:

1. 如果定义的是 int 类型，那么如果请求的 path 不是一个 int 类型，那么会自动处理 404 错误。
2. 如果定义的是 int 类型，那么在视图函数中，传过来的参数就是 int 类型，而不是 str 类型。

## 4.3 urls.py 中的 path 函数

首先 `path` 函数定义为 `path(route, view, name=None, kwargs=None)` ,接下来将对每个参数进行介绍：

- route: 表示 URL 的路径。这个参数中可以指定 url 中需要传递的参数。传递的参数是通过`<>`进行包裹的，并且在传入参数的时候这个参数类型是可以指定的。其中可以对传递参数类型有

  - `str`: 非空的字符串类型，这也是默认的参数类型，但是不能包括斜杠，如果 path 中包含斜杠则会默认为其他路径。
  - `int`: 整数类型，传入到视图函数就是一个 int 类型。
  - `slug`: 由英文的横杠`-`或者下划线`_`连接英文字符或者数字而成的字符串。
  - `uuid`: 匹配 uuid 的字符串
  - `path`: 匹配非空的英文字符串，其中可以包括斜杠。

- view: 表示视图函数，也就是需要调用的函数。
- name: 表示 URL 的别名，这个参数可以不传。但是在项目比较大的情况下，用处很大。

以下将编写一个样例来演示 `path` 函数的用法：

```python
# /book/views.py
from django.shortcuts import HttpResponse

def book_detail_default(request, book_id):
    return HttpResponse("str Book id: %s" % book_id)

def book_detail_int(request, book_id):
    return HttpResponse("int Book id: %s" % book_id)

def book_detail_slug(request, book_id):
    return HttpResponse("slug Book id: %s" % book_id)

def book_detail_uuid(request, book_id):
    return HttpResponse("uuid Book id: %s" % book_id)

def book_detail_path(request, book_id):
    return HttpResponse("path Book id: %s" % book_id)

```

以下是对应路由的定义：

```python
# /book/urls.py
from django.urls import path
from . import views
urlpatterns = [
    path("/default/<book_id>", views.book_detail_default),
    path("/int/<int:book_id>", views.book_detail_int),
    path("/slug/<slug:book_id>", views.book_detail_slug),
    path("/uuid/<uuid:book_id>", views.book_detail_uuid),
    path("/path/<path:book_id>", views.book_detail_path),
]
```

## 4.4 在 urls.py 中引入另一个模块

在一个大型的项目当中，不可能只有一个 app 模块，也不可能所有的 views 都放在一个模块中的 urls.py 文件当中。那么 Django 给我们提供了一个方法，就是通过 `include` 函数来引入其他的模块。
示例代码：

```python
from django.contrib import admin
from django.urls import path, include

app_name = "book"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("book", include("book.urls")) # 将book模块下的urls文件进行引入
]
```

以上代码就是将 book 模块下的 urls 文件都引入到当前模块的 urls 文件中。而且这个 book 模块后续的 url 都将以 `book/` 开头。

另外，为了避免多个模块的 urls.py 中包含了同名的 url,可以单独为这个 urls.py 文件设置单独的命名空间即可 `app_name = "book"`

## 4.5 url 的反向解析

url 的方向解析，也叫做 url 反转。其含义就是将前面 path 函数内定义的 name 别名参数进行反向解析成对应的 URL。

示例代码如下，需要注意的是，如果想要反转其他模块的 url，那么需要将 `app_name` 参数进行指定:

```python
def book_detail(request):
    print(reverse("admin:index"))
    print(reverse("book:book_detail_default", kwargs={"book_id": "1"}))
    print(reverse("book:book_detail_int", kwargs={"book_id": 1}))
    print(reverse("book:book_detail_slug", kwargs={"book_id": "1"}))
    print(reverse("book:book_detail_uuid", kwargs={"book_id": "123e4567-e89b-12d3-a456-426655440000"}))
    print(reverse("book:book_detail_path", kwargs={"book_id": "/hello/world"}))
    return HttpResponse("hello world")
```

路由定义为上一小节的路由文件。

# 5. 模板

在之前的章节中，视图函数只是直接返回文本，而在实际生产环境中其实很少这样用，因为实际的页面大多是带有样式的 HTML 页面。目前市面上有非常多的模板系统，其中在 python 路线中最知名最好用的就是 DTL(Django Template Language 官方) 和 Jinja2(第三方)，相比于第三方于官方，肯定是优先选择官方的 DTL，这样无论是在兼容性上还是学习成本上都要比第三方要低很多。

## 5.1 DTL 与正常的 HTML 的区别

DTL 模板是一种带有特殊语法的 HTML 文件，而这个特殊的文件可以被 Django 进行编译，可以将 python 一些变量进行传递，从而实现数据的动态化。
当然，这一切都是在编译完成后才能够实现。也就是说 Django 是支持服务端渲染的功能的。

## 5.2 使用 Django 渲染 html 到前端

以下将演示如何将一个完整的 HTML 文件，编译渲染到前端当中。

```python
from django.shortcuts import render

def index(request):
    return render(request, "index.html")
```

以上就是将一个本地的 HTML 文件渲染到前端当中的功能(省略在 url 中进行注册代码)，正常如果访问特定的 URL 会提示我们这个 index.html 文件找不到。那么接下来将会讲解项目当中 `settings.py` 文件中的 `TEMPLATES` 配置项。

## 5.3 settings.py 中的 TEMPLATES 配置项

如果发现 5.2 节的代码无法正常访问到 index.html 文件，则需要在 `settings.py` 文件中配置 `TEMPLATES` 配置项，以下代码是配置完成的代码，笔者将会在这个基础上进行讲解：

```python
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"], # BASE_DIR 是一个变量默认为当前项目的根目录
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

在 `settings.py` 文件中 `TEMPLATES` 主要是配置 Django 模板相关的配置项。我们主要关注的是 `DIRS` 和 `APP_DIRS` 这两个配置项。

- `DIRS`：配置模板文件的路径，可以配置多个路径，多个路径之间使用 `,` 进行分隔。
- `APP_DIRS`：配置是否在每个 app 的目录下查找模板文件。
  - 如果配置了 `APP_DIRS` 为 Ture 那么可以在每一个 app 下面进行新建特定的文件夹来存放不同模块下的模板文件。(当然特定的文件夹需要在 DIRS 中进行配置，而且需要在 `INSTALLED_APPS` 配置项，将该 app 进行一个安装。它的查找顺序先从项目中的`templates`目录先查找，然后再从安装的 app 的目录下查找。)

经过上述 settings.py 文件的配置，我们在项目的根目录新建一个 `templates` 文件夹，专门存放相关的模板文件即可。

## 5.4 DTL 模板语法

接下来这章节，将会简单介绍 Django 的 DTL 模板语法。

### 5.4.1 变量

在 DTL 模板中，render 函数可以传入一个 context 参数，这个参数是一个字典类型，里面可以存放一些变量，这些变量可以在模板文件中直接使用。

以下是一个简单的示例代码：

```python
def variable(request):
    # 1. 普通变量
    name = "shengwen"
    # 2. 字典(对象)变量
    objects = {"name": "shengwen", "age": 18, "gender": "male"}
    # 3. 列表(数组)变量
    lists = [
        {"name": "shengwen", "age": 18, "gender": "male"},
        {"name": "zhangsan", "age": 20, "gender": "female"}
    ]
    # 4. 类变量
    class Person:
        def __init__(self, realname):
            self.realname = realname
    # 直接定义成一个变量，方便传递到函数当中
    context = {
        "name": name,
        "objects": objects,
        "lists": lists,
        "person": Person("shengwen")
    }
    return render(request, "variable.html", context=context)
```

下面是对应的 HTML 文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Variable</title>
  </head>
  <body>
    <h1>普通变量 {{ name }}</h1>
    <h1>字典(对象)变量 {{ objects.name }}</h1>
    <h1>
      列表(数组)变量 {{ lists.1.name }}, {{ lists.1.age }}, {{ lists.1.gender }}
    </h1>
    <h1>类变量 {{ person.realname }}</h1>
  </body>
</html>
```

需要注意的是，在访问列表的时候，不能够通过 `[]` 这种方式进行访问，改为 `.下标数` 的形式来进行访问。

### 5.4.2 常用模板标签

#### 5.4.2.1 if 标签

if 标签是用来进行条件判断的，语法如下：

```python
def if_DTL(request, age):
    return render(request, "if.html", context={"age": age})
```

以下是对应的 html 文件代码，需要注意的是 if 标签需要跟 endif 标签进行对应：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>if DTL</title>
  </head>
  <body>
    {% if age >= 18 %}
    <h1>你成年了</h1>
    {% else %}
    <h1>你还没成年</h1>
    {% endif %}
  </body>
</html>
```

#### 5.4.2.2 for 标签

for 标签是用来进行循环的，可以循环列表(数组)，字典(对象)，语法如下：

```python
def for_DTL(request):
    # 1. 循环列表
    books = [
        {"name": "三国演义","author": "罗贯中"},
        {"name": "西游记","author": "吴承恩"},
    ]
    # 2. 循环字典
    person = {
        "realname": "shengwen",
        "age": 18,
        "gender": "male"
    }
    context = {
        "books": books,
        "person": person
    }
    return render(request, "for.html", context=context)
```

以下是对应的 html 文件代码，同 if 标签一样，for 标签也需要跟 endfor 标签进行对应：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>for DTL</title>
  </head>
  <body>
    <h1>书籍列表(循环列表)</h1>
    <table>
      <thead>
        <th>序号</th>
        <th>作者</th>
        <th>书名</th>
      </thead>
      <tbody>
        {% for book in books %}
        <tr>
          <td>{{ forloop.counter }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.name }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
    <h1>人员列表(循环字典)</h1>
    {% for key, value in person.items %}
    <p>{{ key }}:{{ value }}</p>
    {% empty %}
    <p>没有人员列表信息</p>
    {% endfor %}
  </body>
</html>
```

#### 5.4.2.3 with 标签

with 标签是用来进行变量赋值的，当一个变量访问的时候比较复杂，可以用这个标签进行缓存到这个中间变量当中。

```python
def with_DTL(request):
    books = [
        {"name": "三国演义","author": "罗贯中"},
        {"name": "西游记","author": "吴承恩"},
    ]
    context = {
        "books": books
    }
    return render(request, "with.html", context=context)
```

以下是对应的 html 文件代码，注意**在定义中间变量的时候等号两边不能够拥有空格**，另外 with 标签中定义的变量只能在标签范围内进行使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>with DTL</title>
  </head>
  <body>
    {% with b=books.0 %}
    <p>{{ b.name }} / {{ b.author }}</p>
    {% endwith %}
  </body>
</html>
```

#### 5.4.2.4 url 标签

url 标签是用来进行 url 跳转的，语法如下：如果是 query-string 参数需要进行手动拼接，但是如果是 path 参数，可以直接进行传入使用：

```html
<a href="{% url 'template:variable' %}">变量页面</a>
<a href="{% url 'template:if' age=18 %}">IF页面</a>
<a href="{% url 'template:for' %}?page=1">for页面</a>
```

### 5.4.3 模板常用过滤器

在 DTL 模板中，有时候需要对一些数据进行简单的处理才能够进行使用。而在 DTL 模板中，则是通过过滤器来进行实现，而且过滤器是使用**管道符**进行连接的，语法如下：

```html
{{value|add:"100"}}
```

接下来将对常用的过滤器进行介绍：

#### 5.4.3.1 add 过滤器

会对原来的值进行添加，会先尝试将值转换为整形去添加，如果转换的过程失败则会当作字符串拼接功能。

```html
{{value|add:"100"}}
```

#### 5.4.3.2 cut 过滤器

可以将原来的值中的字符串进行删除，类似 replace 方法：

```html
<!-- "hello world hello django" 会变为 "helloworldhellodjango" -->
{{value|cut:" "}}
```

#### 5.4.3.3 date 过滤器

可以将原来的值安装指定的格式转换成字符串，前提是必须是日期：

```html
<!-- 这样会以 2020-01-01 的格式进行输出 -->
{{value|date:"Y-m-d"}}
```

#### 5.4.3.4 default 过滤器

如果原来的值是 False、None、""、{}，那么就会使用 default 进行替换：

```html
{{value|default:"没有值"}}
```

#### 5.4.3.5 first 过滤器

返回 列表\元组\字符串中的第一个元素：

```html
{{value|first}}
```

#### 5.4.3.6 last 过滤器

返回 列表\元组\字符串中的最后一个元素：

```html
{{value|last}}
```

#### 5.4.3.7 floatformat 过滤器

可以将原本的值通过四舍五入的方式进行浮点数的格式化，默认为一位小数：

```html
<!-- 默认一位小数 -->
{{value|floatformat}}
<!-- 可以指定为 2 位小数 -->
{{value1|floatformat:2}}
```

#### 5.4.3.8 join 过滤器

可以将 列表\元组\字符串，使用指定的字符来进行拼接：

```html
{{value|join:"-"}}
```

#### 5.4.3.9 length 过滤器

可以将 列表\元组\字符串 的长度进行获取：

```html
{{value|length}}
```

#### 5.4.3.10 lower 过滤器

可以将原来的值进行转换为小写：

```html
{{value|lower}}
```

#### 5.4.3.11 upper 过滤器

可以将原来的值进行转换为大写：

```html
{{value|upper}}
```

#### 5.4.3.12 random 过滤器

可以将原本的 列表\元组\字符串 进行随机获取一个值：

```html
{{value|random}}
```

#### 5.4.3.13 safe 过滤器

标记一个字符串是安全的，也会关掉这个字符串的自动转义。如果这个字符串是 html 标签，那么会应用到 html 标签上。

```html
{{value|safe}}
```

#### 5.4.3.14 slice 过滤器

可以对 列表\元组\字符串 进行切片操作：

```html
{{value|slice:"2:"}}
```

#### 5.4.3.15 stringtags 过滤器

可以将原本的值内的所有 html 标签进行删除：

```html
<!-- <script>alert('hello')</script> ===> alert('hello') -->
{{value|stringtags}}
```

#### 5.4.3.16 truncatechars 过滤器

如果传入的值超过了过滤器指定的长度，那么就会使用三个点来代替：

```html
{{value|truncatechars:5}}
```

#### 5.4.3.17 truncatechars_html 过滤器

类似于 truncatechars，但是会保留 html 标签：

```html
<!-- <script>深圳欢迎你！</script> ===> <script>深圳...</script -->
{{value|truncatechars_html:2}}
```

### 5.4.4 模板结构

有时候，我们希望编写好的模板可以在多个地方进行使用，那么对于重复的代码，我们就可以将其放在一个模板中，然后通过 include 来进行调用：

```html
<!-- 此时就会将 header.html 中的内容进行引入，并且能其header.html中可以使用当前html传入的变量 -->
{% include "header.html" %}
```

除此之外，我们还可以通过另一种方式来进行代码的复用，也就是`模板的继承`，然后通过 block 来进行占位。以下将定义一个父类的模板文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{% block title %}{% endblock %} - 标题</title>
  </head>
  <body>
    <section>{% block section %} {% endblock %}</section>
    <footer>{% block footer %} {% endblock %}</footer>
  </body>
</html>
```

接下来，子类将继承上面的父类模板，并且通过 block 来进行使用：

```txt
{% extends "base.html" %}

{% block title %}子类标题{% endblock %}

{% blocksection %}
{{ block.super }}
<p>子类内容</p>
{% endblock %}

{% block footer %}
<p>底部内容</p>>
{% endblock %}
```

以上就是子类模板中，对父类模板中 block 的使用。主要注意的点是：

- {% extends "base.html" %} 必须放在第一行
- 使用的 block 必须和父类中的 block 名称一致
- 如果想要继承父类中的内容，那么可以使用 block.super 来进行调用

### 5.4.5 加载静态文件

在一个网页当中，不仅只有 html 文件，还需要 css 和 js 文件。因此在 DTL 中加载静态文件也是非常重要的一环。而在 DTL 中可以使用 `static 标签`来进行加载静态文件，但是要使用 `static 标签`，首先就必须要进行 `{% load static %}` 进行加载镜头文件。

在此之前，首先确保一些配置项是否正确：

1. 确保`settings.py` 中的 `INSTALLED_APPS` 中是否添加 `"django.contrib.staticfiles"` 配置。
2. 确保 `settings.py` 中的 `STATIC_URL` 是否配置正确，例 `STATIC_URL = '/static/'`。

确保上述配置完成后：

3. 在项目根目录下创建一个 `static` 文件夹，用来存放静态文件。同时在 settings.py 中添加 `STATICFILES_DIRS` 配置项，那么以后 DTL 都会在这个列表的路径咋哄查找对应的静态文件。例如可以设置为 `STATICFILES_DIRS = [BASE_DIR / "static"]`
4. 配置完成第 3 点后，可以在 html 文件中直接使用 `{% static 'css/style.css' %}` 来进行加载静态文件。并且可以使用 `<link rel="stylesheet" href="{% static 'css/style.css' %}">` 来进行加载。

当然，如果不想每次编写 DTL 模板的时候都通过 `load static 标签`来加载静态文件，那么可以在 `settings.py` 中的 `TEMPLATES` 配置项中的 `OPTIONS` 中添加`'builtins':['django.templatetags.static']`即可。

**题外话**

如果没有在 settings.INSTALLED_APPS 中添加 django.contrib.staticfiles 。那么我们就需要手动的将请求静态文件的 url 与静态文件的路径进行映射了，这个操作通常用来加载媒体文件（用户上传的文件）。示例代码如下：

```python
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    ...
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
```

同时还需在 settings.py 中的对 MEDIA_URL 和 MEDIA_ROOT 的配置如下：

```python
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL= '/media/'
```

**TIPS 注意：静态文件和媒体文件，最好都是通过 Nginx 等专业的 web 服务器来部署，以上方式仅在开发阶段使用。**

# 6. 数据库操作

在网站开发中，数据库是必不可少的一部分。本文档将会采用 Mysql 数据库来进行学习。

## 6.1 搭建好 Mysql 数据库环境

笔者这里并不建议在本地电脑上进行下载安装 Mysql 数据库了，因为不太常用，基本上安装一次就再也不会使用了。因此笔者建议使用 Docker 来进行安装。
下载完成 Docker 后，直接拉取 Mysql 的镜像即可使用，因为后续的网站开发过程中，所有东西都上云了，而且也不太可能让读者手动的去进行配置安装数据库相关的服务，基本上是使用云服务商提供的数据库服务。同理，云服务商提供的数据库服务跟 Docker 中的 Mysql 镜像也是类似的。

TIPS：本地搭建 Docker 环境，参考网上其他教程，本文档不再赘述。

## 6.2 navicat 操作数据库软件

操作数据库的软件有很多种，包括 vscode 也有专门的插件进行连接数据库进行操作。这里笔者推荐使用 navicat 进行操作。当然如读者有更好的选择，也可以使用。

## 6.3 Mysql 驱动程序的安装

在 Django 中，需要使用到 Mysql 数据库，因此需要安装 Mysql 的驱动程序。在 Django 中，目前支持 Mysql 的驱动程序有：

- MySQL-python: 对 c 语言操作 Mysql 数据库的一个简单分装，但是仅支持 python2，不支持 python3
- mysqlclient: 是 MySQL-python 的升级版，支持 python2 和 python3
- pymysql: 纯 python 编写，可与 python 无缝衔接，但是在效率上略逊于 mysqlclient
- Mysql Connector/Python: 是 MySQL Connector 的 Python 实现，支持 python2 和 python3

笔者这里使用的是 pymysql，因此需要安装 pymysql。

```bash
conda install pymysql
# 这里重新创建一个app模块，针对数据库相关知识进行学习
python manage.py startapp database
```

## 6.4 操作数据库

### 6.4.1 Django 配置连接数据库

在操作数据库之前需要进行数据库的连接，只需要在 `settings.py` 中的 `DATABASES` 配置项中添加如下配置即可：

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "database_demo",  # 数据库名字
        "USER": "root",           # 数据库用户名
        "PASSWORD": "shengwen",   # 数据库密码
        "HOST": "127.0.0.1",      # 数据库地址
        "PORT": "3309",           # 数据库端口
    }
}
```

其中 `ENGINE` 中还可以为以下数据库:

- django.db.backends.sqlite3
- django.db.backends.postgresql
- django.db.backends.oracle

如果根据代码中配置完成后，进行运行项目出现报错，那么可以采取以下的方式来进行修复：
在项目的 `__init__.py` 文件中添加以下代码，来配置 pymysql 代替 mysqlclient：

```python
# 项目根目录/__init__.py
import pymysql
pymysql.install_as_MySQLdb()
```

接着重新启动项目即可。

### 6.4.2 连接并操作数据库

在 Django 中操作数据库有两种方式。第一种方式是使用原生的 SQL 语句操作，第二种就是使用 ORM 模型来操作数据库。接下来我们将使用 SQL 语句的方式来连接并操作数据库。

在 Django 中使用原生 SQL 语句操作其实就是使用了 python db api 的接口来进行操作，由于前面章节安装的是 pymysql，因此这里就是使用 pymysql 来进行操作。在通过 `settings.py` 文件配置完成数据库相关配置之后，我们就可以进行操作数据库了：

```python
from django.shortcuts import HttpResponse
from django.db import connection

# Create your views here.
def connect_db(request):
    # 获取游标对象
    cursor = connection.cursor()
    # 执行SQL语句
    cursor.execute("select * from book")
    # 获取所有记录
    results = cursor.fetchall()
    # 打印结果
    res = ""
    for row in results:
        print(row)
        res += str(row) + "\n"
    return HttpResponse(res)
```

上面编写的代码，其 `execute` 方法和 `fetchall` 方法都是来自于 `pymysql` 第三方模块其定义好的。他的各种使用方法都需要查询其对应官方文档进行查看。

## 6.5 ORM 模型

随着项目的越来越大，采用原生的 SQL 的方式在代码中会出现大量的 SQL 语句，那么就会有以下的问题出现：

- SQL 语句重复率不高，难复用
- SQL 语句通常在业务逻辑中出现，如果数据库需要更改，业务同样需要更改，难维护
- 可能会有 SQL 注入的风险

ORM，全称是 Object Relational Mapping，即对象关系映射，通过 ORM，我们可以将面向对象语言中的对象与关系型数据库中的关系数据相互映射，使得我们可以通过面向对象的方式来操作数据库。通过把数据库中的`表`映射成一个`类`，通过类的方式去管理和操作数据库中的表。

### 6.5.1 创建 ORM 模型

首先 ORM 模型一般是放在模块中的 `models.py` 文件当中。每一个 app 都可以拥有自己的模型，并且如果这个模型想要映射到数据库当中，那么这个 app 必须要在 `settings.py` 文件中的 `INSTALLED_APPS` 中进行注册。

接下来将在 models.py 文件中创建一个模型，如下所示：

```python
from django.db import models

# Create your models here.
class Book(models.Model):
    name = models.CharField(max_length=20, null=True)
    author = models.CharField(max_length=20, null=True)
    pub_time = models.DateTimeField(auto_now_add=True, null=True)
    price = models.FloatField(default=0, null=True)
```

### 6.5.2 模型映射到数据库

将 ORM 模型映射到数据库当中，即需要以下几步：

- 在 `settings.py` 中进行配置数据库的相关配置
- 在 app 中的 `models.py` 文件中定义好模型，这个模型必须继承自 `models.Model` 类
- 将这个 app 注册到 `settings.py` 文件中的 `INSTALLED_APPS` 中
- 在命令行中执行 `python manage.py makemigrations` 命令，来生成迁移文件。(如果经常报错，那么直接将 migrations 内的文件都删去重新生成即可)
- 在命令行中执行 `python manage.py migrate` 命令，来将迁移文件映射到数据库中

### 6.5.3 数据库的 CURD 操作

#### 6.5.3.1 新增数据

新增数据到数据库中，非常简单，首先需要引入 models 中的 ORM 对象，然后通过这个对象调用 `save` 方法即可。

```python
def add_book(request):
    book = Book(name="水浒传", author="施耐庵", price=100)
    book.save()
    return HttpResponse("添加成功！")
```

#### 6.5.3.2 查询数据

查询数据，同样需要引入 models 中的 ORM 对象，然后通过这个对象调用 `objects` 属性的 `all` 方法即可。以下是查询所有数据的方法：

```python
def get_books(request):
    books = Book.objects.all()
    res = ""
    for book in books:
        print(book)
        res += str(book.name) + "\t" + str(book.author) + "\t" + str(book.price) + "<br>"
    return HttpResponse(res)
```

另外，还可以通过 `filter` 方法来查询特定的数据，例如以下代码就是查询 id 为 1 的数据：

```python
def get_books(request):
    books = Book.objects.filter(id=1) # 查询 id 为 1 的数据
    res = ""
    for book in books:
        print(book)
        res += str(book.name) + "\t" + str(book.author) + "\t" + str(book.price) + "\t" + str(book.pub_time) + "<br>"
    return HttpResponse(res)
```

此外，还可以通过 `get` 方法来获取单个对象。因为使用 `filter` 方法查询出来的结果是一个列表。但是有时候只需要返回满足条件的第一个对象，那么就可以使用 `get` 方法来进行获取：

```python
def get_books(request):
    book = Book.objects.get(name="水浒传") # 只能获取名称为 "水浒传" 的这一条数据
    print(book)
    return HttpResponse(str(book.name) + "\t" + str(book.author) + "\t" + str(book.price) + "\t" + str(book.pub_time))
```

最后，查询的数据还可以进行排序操作。可以通过 `order_by` 方法来进行排序，例如以下代码就是按照价格进行降序排序：

```python
def get_books(request):
    books = Book.objects.order_by("price") # 升序排序
    # books = Book.objects.order_by("-price") # 降序排序
    res = ""
    for book in books:
        res += str(book.name) + "\n"
    return HttpResponse(res)
```

#### 6.5.3.3 修改数据

修改数据，同样需要引入 models 中的 ORM 对象，然后通过这个对象调用 `objects` 属性的 `get` 方法来获取到要修改的对象，然后对这个对象进行修改后，再调用 `save` 方法写入数据库即可。

```python
def modify_book(request):
    book = Book.objects.get(name="水浒传")
    old_price = book.price
    book.price = 1000
    new_price = book.price
    book.save()
    return HttpResponse("修改成功！" + str(old_price) + " -> " + str(new_price))
```

#### 6.5.3.4 删除数据

删除数据，同样需要引入 models 中的 ORM 对象，然后通过这个对象调用 `objects` 属性的 `get` 方法来获取到要删除的对象，然后对这个对象进行调用 `delete` 方法即可。

```python
def delete_book(request, id):
    book = Book.objects.get(id=id)
    book.delete()
    return HttpResponse("删除成功！")
```

### 6.5.4 ORM 模型常用 Field 和 参数

#### 6.5.4.1 常用 字段

在 Django 当中，定义了一些 `Field` 来与数据库表中的字段类型进行映射。以下将介绍常用的字段类型：

- `AutoField`：自动增长的 IntegerField，不常用，通常如果 ORM 会默认生成一个 id 默认自增的主键
- `BigAutoField`：64 位自增整数，默认生成的 id 自增主键就是这个声明的，具体可以查看 settins.py 文件
- `BooleanField`：布尔类型，在数据库层面就是 tinyint 类型
- `CharField`：字符串类型，需要指定最大长度，例如 `CharField(max_length=20)`
- `DateField`：日期类型，需要指定日期格式，例如 `DateField(format="%Y-%m-%d")`
- `DateTimeField`：日期时间类型，需要指定日期格式，例如 `DateTimeField(format="%Y-%m-%d %H:%M:%S")`
- `TimeField`：时间类型，需要指定日期格式，例如 `TimeField(format="%H:%M:%S")`
- `EmailField`：字符串类型，会自动验证是否是邮箱格式
- `FileField`：文件类型，后续涉及再进行详细介绍
- `ImageField`：图片类型，后续涉及再进行详细介绍
- `FloatField`：浮点类型
- `IntegerField`：整数类型
- `BigIntegerField`：64 位整数类型
- `PositiveIntegerField`：正整数类型
- `SmallIntegerField`：小整数类型
- `PositiveSmallIntegerField`：正小整数类型
- `TextField`：文本类型，可以存储大量文本
- `UUIDField`：通用唯一识别码类型，可以存储 32 位或者 128 位 UUID 字符串
- `URLField`：字符串类型，会自动验证是否是 URL 格式，并且默认长度是 200

#### 6.5.4.2 Field 的常用参数

- `null`：如果设置为 True，那么在进行映射的说话指定为空。在使用字符串相关的 Field 的时候，官方推荐不要使用这个参数，因为 Django 在处理相关 Field 的时候会将一个空的字符串""进行默认传入。
- `db_column`：指定数据库中的字段名
- `default`：指定默认值
- `primary_key`：如果设置为 True，那么这个 Field 就是主键
- `unique`：如果设置为 True，那么这个 Field 就是唯一值

### 6.5.5 ORM 模型中 Meta 配置

对于一些 ORM 模型级别的配置，我们可以在 ORM 模型中定义一个类，叫做 Meta。然后再这个类中进行添加一些类属性来控制定义的 ORM 模型。比如想要将定义的 ORM 模型的表名设置为想要的表名，那么就可以在 Meta 类中添加 `db_table` 属性来指定表名。以下将介绍一些常用的 Meta 类属性：

- `db_table`：指定 ORM 模型对应的表名
- `ordering`：指定 ORM 模型中数据的排序方式，例如 `ordering = ["-id"]` 表示按照 id 降序排序。也可以进行多个条件进行排序，例如 `ordering = ["pub_time", "name"]` 表示先按照 pub_time 升序排序，如果时间相同，则按照 name 升序排序。

### 6.5.6 外键和表关系

#### 6.5.6.1 外键

在讲解外键之前，我们先需要了解什么叫做 `主键`，顾名思义，一张表内，如何区别每一条数据？是不是需要一个类似序号的字段来进行区分不同的数据？那么这个类似序号的字段，我们就可以称之为主键。当然了，这个类似序号的玩意，一定要是唯一的不能重复的，因为如果重复了，那么就不知道是哪条数据了。而主键就是这么一个玩意。

说完主键，我们现在可以来说 `外键` 了。顾名思义啊，外键，其实就是另一张表的主键，可以仔细品我这一句话。其实也就是 cpp 中两个数组如何进行实现关联，很简单嘛，直接使用下标索引就行了。那么在数据库中，也是类似的，一张表如何将另一张表进行关联起来，那么就可以再开一个字段，这个字段用来填另一张表的主键即可建立起两张表的联系。

那么在 Django 中，如何定义外键呢？很简单，只需要在定义字段的时候，指定 `ForeignKey` 即可。例如以下代码就是定义了一个外键：

```python
class User(models.Model):
    name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    # 定义作者为外键,并且是级联删除
    # 如果这个"USER"跟Article不在同一个app中，那么需要使用"app名.表名"
    author = models.ForeignKey("User", on_delete=models.CASCADE)
```

主要是通过 `models.ForeignKey("User", on_delete=models.CASCADE)` 来进行定义外键的，这里的第一个参数就是外键关联的表名，第二个参数就是外键的删除方式。这里是设置的级联删除`models.CASCADE`，表示如果外键关联的表中的数据(user 被删除)被删除了，那么本表中的数据(本条文章数据也会被删除)也会被删除。

当然了，除了 `models.CASCADE` 之外，还有 `models.SET_NULL`，表示如果外键关联的表中的数据(user 被删除)被删除了，那么本表中的数据(本条文章数据)会设置为 null。

**TIPS1: 如果这个"USER"跟 Article 不在同一个 app 中，那么需要使用"app 名.表名"**

**TIPS2: 如果定义的外键是自身这个模型，那么就填 `self` 或自身的类名，这在论坛的评论中经常使用**

#### 6.5.6.2 外键删除操作

如果一个模型中使用了外键，那么在对方那个模型被删除后，该模型应该执行什么样的操作？那么可以在一开始定义外键的时候，通过 `on_delete` 参数来进行指定的删除方式：

- `models.CASCADE`：级联删除，如果对方数据被删除了，那么本数据也会被删除
- `models.PROTECT`：保护模式，如果对方数据被删除了，那么由于是保护模式，那么本数据和对方数据触发保护两条数据都不能够被删除
- `models.SET_NULL`：设置为 null，如果对方数据被删除了，那么本数据会设置为 null，前提在定义的时候设置了 null=True
- `models.SET_DEFAULT`：设置为默认值，如果对方数据被删除了，那么本数据会设置为默认值，前提在定义的时候设置了默认值
- `models.SET()`：设置为指定的值，如果对方数据被删除了，那么本数据会设置为指定的值
- `models.DO_NOTHING`：什么也不做，如果对方数据被删除了，那么本数据不会执行任何 SQL 语句操作

#### 6.5.6.3 表关系

表之间的关系都是通过外键来进行关联的。那么表之间的关系，无非就是三种关系，也就是：一对一、一对多、多对多。

1. 一对多

应用场景：作者与文章的关系，文章只能由一个作者编写，但是一个作者可以编写多篇文章。那么这里作者就是`一`，文章就是`多`。
实现方式就是：关系`多`定义外键引入关系`一`的主键。

```python
class User(models.Model):
    name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    # 定义作者为外键,并且是级联删除
    # related_name="articles" 表示反向查询的时候，使用 articles 来进行查询
    # 如果没有设置 related_name，那么反向查询的时候，使用 类名_set 来进行反向查询
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="articles")
```

以上代码就是实现一对多的数据关系。其中如果作者想要获取其所有写的文章，那么可以通过 `user.articles.all()` 来获取。当然这是建立在设置了 `related_name` 的情况下。如果没有设置 `related_name`，那么可以通过 `user.article_set.all()` 也就是 `类名_set` 来反向获取数据。

2. 一对一

应用场景：比如一个用户表和一个用户信息表。在实际的网站当中，用户表可能仅存用户登录的相关信息，而用户的一些较为隐私相关的信息存放到另一张表当中。如果都存在一张表可能会影响查询的效率。那么这种用户表和用户信息表的关系就是一对一的关系。
实现方式：Django 提供了 `OneToOneField` 来实现一对一的关系。

```python
class User(models.Model):
    name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

class UserExtension(models.Model):
    birthday = models.DateField(null=True)
    address = models.CharField(max_length=200)
    # 定义一对一关系 这里使用了Django提供的一对一关系 而不是直接使用外键来进行定义
    user = models.OneToOneField("User", on_delete=models.CASCADE)
```

以上代码采用了 Django 提供的一对一关系，而不是直接使用外键来进行定义。这是由于 Django 自带的一对一关系，会在数据库层面做一些其他的处理。读者只需要知道，如果想要实现一对一的关系，那么就可以使用 Django 提供的一对一关系即可。

3. 多对多

应用场景：比如一个文章表和一个标签表，一篇文章可以有多个标签，一个标签也可以对应多篇文章。那么这种就是属于多对多的关系。
实现方式：Django 提供了 `ManyToManyField` 来实现多对多的关系。

```python
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.ManyToManyField("Tag", related_name="articles")

class Tags(models.Model):
    name = models.CharField(max_length=20)
```

其实在真正的数据库层面来看，这种多对多的关系，实际上会通过一张中间表来实现这两张表的关联关系。这个中间表会存放两张表的主键进行一一映射。

### 6.5.7 查询操作

查找是数据库操作中最为常见的操作，那么在 Django 当中，查询操作一般是使用 `filter`、`exclude`、`get` 这三个方法来进行查询的。其中 `filter` 和 `exclude` 都是用来查询列表的，而 `get` 是用来查询单个数据的。另外，在 ORM 模型层面，在使用这三个方法进行查询的时候，其查询参数是使用: `field` + `__` + `查询条件` 的方式进行查询的。字段则是使用模型中的字段名，两个下划线则是为了区分字段名称，查询条件则是使用数据库中的查询条件。那么接下来将对常用的查询条件进行一一介绍

#### 6.5.7.1 查询条件

1. exact:

使用精确的 `=` 进行查找，如果提供的是一个 None 类型，那么在底层 SQL 语句中就会被理解为 NULL：

```python
def query_exact(request):
    article = Article.objects.filter(id__exact=1) # exact 与 = 等价
    print(article.query) # 可以查看具体底层的SQL语句 但是不能够使用 get 方法
    print(article)
    return HttpResponse("查询成功！")
```

2.iexact:

使用类似 `like` 进行查找(不区分大小写)：

```python
def query_iexact(request):
    article = Article.objects.get(title__iexact="水浒传") # 仅不区分大小写
    print(article)
    res = article.title + "\n" + article.content
    return HttpResponse(res)
```

3. contains:

大小写敏感，判断某个字段是否博爱喊了某个数据：

```python
def query_contains(request):
    article = Article.objects.filter(content__contains="是")
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

以上代码在翻译成 SQL 语句:

```sql
SELECT `database_article`.`id`, `database_article`.`title`, `database_article`.`content`, `database_article`.`author_id` FROM `database_article` WHERE `database_article`.`content` LIKE BINARY %是%
```

查询的结果左右两边是有百分号`%`的，意味着是模糊查询。

4. icontains:

大小写不敏感，判断某个字段是否包含某个数据：

```python
def query_icontains(request):
    article = Article.objects.filter(title__icontains="CH")
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

以上代码在翻译成 SQL 语句:

```sql
SELECT `database_article`.`id`, `database_article`.`title`, `database_article`.`content`, `database_article`.`author_id` FROM `database_article` WHERE `database_article`.`title` LIKE %CH%
```

5. in:

判断某个字段是否在某个范围内：

```python
def query_in(request):
    article = Article.objects.filter(id__in=[1, 2, 3]) # id 在 [1, 2, 3] 范围内
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

当然也可以传如一个列表：

```python
    user_query = User.objects.filter(name__contains="sheng") # 查询作者名字中包含“sheng”的用户
    for b in user_query:
        print(b.name) # 一共两个 shengwen 和 wensheng
    article = Article.objects.filter(author__in=user_query) # 查找这两个作者的所有文章
    print(article.query)
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

6. gt:

某个字段的值要大于给定的值：

```python
def query_gt(request):
    article = Article.objects.filter(id__gt=3) # id 大于 3
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

7. gte:

某个字段的值要大于等于给定的值：

```python
def query_gte(request):
    article = Article.objects.filter(id__gte=3) # id 大于等于 3
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

8. lt:

类似 gt，某个字段的值要小于给定的值：

9. lte:

类似 gte，某个字段的值要小于等于给定的值：

10. startswith:

判断某个字段的值是否以某个值开始的，且大小写敏感：

```python
def query_startswith(request):
    article = Article.objects.filter(title__startswith="Deep")
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

11. istartswith:

类似 startswith，但是大小写不敏感：

12. endswith:

判断某个字段的值是否以某个值结束的，且大小写敏感：

```python
def query_endswith(request):
    article = Article.objects.filter(title__endswith="Seek")
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

13. iendswith:

类似 endswith，但是大小写不敏感：

14. range:

判断某个字段的值是否在给定的区间内：

```python
def query_range(request):
    article = Article.objects.filter(id__range=[1, 3]) # id 在 [1, 3] 范围内
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

当然，也可以使用 range 来查询时间。

15. date:

针对某些 date 或 datetime 类型的字段。可以指定 date 的范围。

```python
def query_date(request):
    article = Article.objects.filter(create_time__date=date(2019,1,1)) # create_time 在 2019-01-01
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

16. year:

根据年份来查询：

```python
def query_year(request):
    article = Article.objects.filter(create_time__year=2019) # create_time 在 2019
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

17. month:

同理 year ，根据月份来查询：

18. day:

同理 year ，根据天来查询：

19. week_day:

同理 year ，根据周几来查询：

20. time:

根据时间来查找：

```python
def query_time(request):
    article = Article.objects.filter(create_time__time=time(12, 0, 0)) # create_time 在 12:00:00
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

21. isnull:

根据是否为空来查询：

```python
def query_isnull(request):
    article = Article.objects.filter(create_time__isnull=True) # create_time 为空
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

22. regex 和 iregex:

大小写敏感和不敏感的**正则表达式查询**：

```python
def query_regex(request):
    article = Article.objects.filter(title__regex=r'^Deep') # title 以 Deep 开头
    for a in article:
        print(a.title)
    return HttpResponse("查询成功！")
```

23. 根据关联的表来查询：

假设现在有两个 ORM 模型, Article 和 Tags, 他们之间是多对多的关系, 也就是一个文章可以有多个标签, 一个标签也可以对应多个文章.

```python
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.ManyToManyField("Tags", related_name="articles")

class Tags(models.Model):
    name = models.CharField(max_length=20)
```

现在想要查询文章标题中包含 "Deep" 的所有标签的名称：

```python
def query_tags(request):
    tags = Tags.objects.filter(articles__title__contains="Deep")
    for t in tags:
        print(t.name)
    return HttpResponse("查询成功！")
```

#### 6.5.7.2 聚合函数

如果你用原生 SQL ，则可以使用聚合函数来提取数据。比如提取某个商品销售的数量，那么可以使用 `Count` ，如果想要知道商品销售的平均价格，那么可以使用 `Avg` 。在 Django 中聚合函数的使用是通过 `aggregate` 方法来实现的。

1. avg 求平均值：

主要通过 `aggregate(avg=Avg('字段名'))` 来实现。会将结果放到一个字典(对象)中并返回。

```python
from django.db.models import Avg
def query_aggregate(request):
    count = Book.objects.all().count()
    avg = Book.objects.aggregate(Avg("price"))
    print(avg)
    return HttpResponse("查询成功！" + str(count) + " " + str(avg))
```

上面的代码会打印出：`{'price__avg': 75.0}` 这个对象，如果想要将这个对象内的属性名进行修改，那么可以将 `aggregate` 方法的参数进行修改，例如修改成 `avg = Book.objects.aggregate(avg=Avg("price"))` 那么打印结果就会变成这样：`{'avg': 75.0}`

2. count 求和：

主要通过 `aggregate(count=Count('字段名'))` 来实现。会将结果放到一个字典(对象)中并返回。

```python
from django.db.models import Count
def query_aggregate(request):
    res = Book.objects.aggregate(total=Count("id"))
    print(res)
    return HttpResponse("查询成功！" + str(res))
```

`aggregate` 内的参数同理参考上面的 `avg` 中的参数。

3. Max/Min 获取对象内最大/最小值

主要通过 `aggregate(max=Max('字段名'))` 来实现。会将结果放到一个字典(对象)中并返回。

```python
from django.db.models import Max, Min
def query_aggregate(request):
    res = Book.objects.aggregate(max_price=Max("price"), min_price=Min("price"))
    print(res)
    return HttpResponse("查询成功！" + str(res))
```

4. Sum 求和

主要通过 `aggregate(sum=Sum('字段名'))` 来实现。会将结果放到一个字典(对象)中并返回。

```python
from django.db.models import Sum

def query_aggregate(request):
    res = Book.objects.annotate(sum=Sum("price"))
    print(res)
    return HttpResponse("查询成功！" + str(res))
```

5. aggregate 和 annotate 的区别

- aggregate：聚合函数，对一组对象进行计算，返回一个值
- annotate：在原对象上增加一个计算字段，返回一个对象集合

如果只是使用 aggregate 那么只会返回一个字典(对象)，如果使用 annotate 那么会返回一个字典列表(对象列表，且这个对象列表内的对象属性可以自定义键值对)。

#### 6.5.7.3 F 和 Q 表达式

1. F 表达式

首先 `F表达式` 是用来优化 ORM 操作数据库的。有一个例子，如果想要将数据库内的数据的某个字段都加上一个值，那么通常的流程是提取所有的数据，然后将数据进行加上，再写回数据库。但是使用 F 表达式的话，只需要写一次 SQL 语句即可。

```python
from django.db.models import F

def query_F(request):
    Book.objects.update(price=F("price")+1)
    return HttpResponse("更新成功！")
```

以上的代码就是将 `Book` 表内的 `price` 字段都进行了加一操作。

```python
from django.db.models import F

def query_F(request):
    Book.objects.filter(price__lt=100).update(price=F("price")+20)
    return HttpResponse("价格小于100的都进行涨价操作，涨价成功！")
```

以上代码可以更加常用化，在更新前数据前可以进行一些条件的限制。接着通过 update 方法进行更新数据库数据。

接下来继续看一个例子，查询账号是否与其电子邮箱是否相等：

```python
from django.db.models import F

def query_f(request):
    res = User.objects.filter(username=F("email"))
    print(res)
    return HttpResponse("查询成功！")
```

2. Q 表达式

Q 表达式是用来进行条件查询的，比如想要查询的条件比较复杂，那么可以使用 Q 表达式进行查询。

```python
from django.db.models import Q

def query_Q(request):
    res = Book.objects.filter(Q(price__lte=100) & Q(id__gt=2))
    for r in res:
        print(r.name, r.author)
    return HttpResponse("查询成功！" + str(res))
```

以上代码就是使用 Q 表达式 来进行查询价格小于等于 100 且 id 大于 2 的书籍。当然返回的是一个对象列表。

## 6.6 cookie 和 session

1. cookie：在网站中，http 请求是无状态的。也就是说即使第一次和服务器连接后并且登录成功后，那么当其发起第二次请求时，服务器是不知道当前请求是属于哪个用户的。而 cookie 的出现就是为了解决这个问题，第一次登录后服务器返回一些数据（cookie）给浏览器，然后浏览器保存在本地，当该用户发送第二次请求的时候，会自动的把上次请求存储的 cookie 数据自动的携带一并请求给服务器，服务器通过浏览器携带的 cookie 数据就能判断当前用户是哪个了。但是 cookie 存储的数据量有限，不同的浏览器有不同的存储大小，但一般不超过 4KB。因此使用 cookie 只能存储一些小量的数据。

2. session：session 和 cookie 的作用是类似的。但是 session 是一种思路、一种概念、一个服务器存储授权信息的解决方案。不同的 web 框架，不同的语言都会有不同的实现。那么 session 的出现是为了解决 cookie 不够安全的问题。因为可以将 session 存入 cookie 当中，当用户第二次请求的时候会将 cookie 也发回给服务器，那么就可以通过 session 来进行判断当前用户是哪个用户。而 session 存储在服务器，所以可以存储大量的数据，而且不像 cookie 一样保存在本地，所以更安全，而且 session 的存储数据量没有限制。

### 6.6.1 在 Django 中使用 cookie 和 session

#### 6.6.1.1 在 Django 中使用 cookie

1. 设置 cookie

设置 cookie 是设置值传给浏览器的，所以需要通过 response 对象进行设置。设置 cookie 可以通过 `set_cookie` 方法进行设置，参数如下：

- key：cookie 的键
- value：cookie 的值
- max_age：cookie 的有效期，单位为秒
- expires：cookie 的过期时间，是一个 datetime 类型，如果设置了 max_age 和 expires，那么将会使用 expires 的值作为过期时间
- path：cookie 的有效路径，默认是对域名下的所有路径都有效
- domain：cookie 的有效域名，默认是对域名下的所有路径都有效
- secure：是否只在 HTTPS 连接上传输 cookie，默认为 False
- httponly：默认 False，如果为 Ture 那么客户端不能够使用 JavaScript 来进行操作

```python
def add_cookie(request):
    # 通常有用户登录操作逻辑，登陆成功后才进行以下操作
    reponse = HttpResponse("添加cookie成功！")
    reponse.set_cookie("name", "shengwen")
    return reponse
```

请求完成后，可以在浏览器的开发者设置中进入应用查看 cookie。

2. 获取 cookie

获取 cookie 那么就是从浏览器中进行获取，即通过 request 对象进行获取。获取 cookie 的方法如下：

```python
def get_cookie(request):
    cookie = request.COOKIES.get("name")
    print(cookie)
    # for key, value in request.COOKIES.items():
    # print(key, value)
    return HttpResponse("获取cookie成功！" + cookie)
```

3. 删除 cookie

删除 cookie 那么就是将 cookie 的有效期设置为 0，那么在下次请求的时候就不会携带 cookie 了。删除 cookie 的方法如下：

```python
def delete_cookie(request):
    reponse = HttpResponse("删除cookie成功！")
    reponse.delete_cookie("name")
    return reponse
```

#### 6.6.1.2 在 Django 中使用 session

在 Django 中，session 默认情况下是存储在服务器的数据库当中。在数据库表中，会根据 sessionid 来提取指定的 session 数据，然后再把 sessionid 返回给浏览器，存入 cookie 当中。等到下一次请求的时候，服务器会从 cookie 中获取 sessionid，然后再根据 sessionid 来提取 session 数据。但是这些流程，django 内部都给我们做好了。我们只需要通过 request.session 即可获取 session 数据。

session 常用的方法如下：

- get: 用来获取 session 数据
- pop: 用来获取 session 数据，并且删除 session 内的值，并不是删除 session 操作
- keys: 用来获取所有的 session 数据的 key
- items: 用来获取所有的 session 数据的 key 和 value
- clear: 用来清除所有的 session 数据
- flush: 用来清除所有的 session 数据，并且删除 cookie 中的 sessionid
- set_expire: 用来设置 session 的有效期，如果设置 0 那么当浏览器关闭后，session 就会失效。默认是 settings.py 中定义的 2 周
- clear_expire: 用来清除过期的 session 数据

以下是简单的使用示例：

```python
def add_session(request):
    request.session["name"] = "shengwen"
    return HttpResponse("添加session成功！")

def get_session(request):
    name = request.session.get("name")
    print(name)
    return HttpResponse("获取session成功！" + name)

def del_session(request):
    request.session.flush() # 通常是注销操作
    return HttpResponse("删除session成功！")
```
