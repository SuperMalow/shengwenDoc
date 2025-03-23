
# Django 学习笔记

## 0. 基础知识入门

### URL概念

URL（Uniform Resource Locator）是互联网上用来标识信息资源的字符串，它由若干部分组成，包括：协议、域名、端口号、路径、参数、锚点、查询字符串。

`https://www.baidu.com/index.html?x=1#haha` => `协议://域名:端口号/路径?参数#锚点`

- 协议：用来指定访问资源的协议，如http、https、ftp等。
- 域名：用来指定访问资源的域名，如baidu.com。
- 端口号：用来指定访问资源的端口号，如80、8080等。
- 路径：用来指定访问资源的路径，如/index.html。
- 查询参数：用来指定访问资源的附加参数，通常以?开头，如x=1。
- 锚点：用来指定页面内的某个位置，如#haha。

## 1. 创建 Django 项目

### 1.0 首先需要先安装 django 环境，可以使用 pip 安装：

```shell
pip install django
```

### 1.1 更换 pip 安装源

在Linux和macOS系统中，pip的配置文件通常位于~/.pip/pip.conf；在Windows系统中，配置文件可能位于C:\Users\<用户名>\pip\pip.ini。如果文件不存在，可以手动创建。

```txt
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

### 1.2 创建项目

在进行上诉 pip 安装 django 后，就可以通过其自带安装完成的命令进行创建项目了。

通过以下命令来进行创建项目：

```shell
django-admin startproject 项目名称
```

## 2. 运行 Django 项目

在进行新建完成项目后，进入到项目目录内后，通过以下命令来进行运行项目：

```shell
python manage.py runserver
```

运行完成上诉的命令后，会默认监听在 3000 端口，可以通过浏览器访问 `http://localhost:3000` 来访问项目。

当然如果想要指定监听端口，可以通过以下命令来进行指定：

```shell
python manage.py runserver 端口号
```

## 3. Django 项目结构介绍

### 项目结构 

1. manage.py：项目的管理脚本，用来启动项目、创建应用、数据库迁移等。之前运行项目就是通过这个脚本来进行运行的。
2. settings.py：项目的配置文件，用来设置项目的全局配置，如数据库配置、静态文件配置等。
3. urls.py：项目的路由配置文件，用来设置项目的路由规则，如 URL 到视图的映射关系。
4. wsgi.py：项目的WSGI配置文件，用来配置项目的Web服务器接口，如Apache、Nginx等。

### project 和 app 的关系

app 是 django 项目的组成部分。在这里可以将 app 理解为一个模块即可。一个项目中通常拥有很多个模块。

通过以下命令可以创建 app(模块):

```shell
python manage.py startapp app(模块)名称
```

## 2. URL 分发步骤

当访问一个URL的时候，Django会按照以下步骤进行分发：

1. Django 加载项目的配置文件 settings.py，获取 URL 配置信息。
2. Django 根据 URL 配置信息，找到对应的视图函数。
3. Django 调用视图函数，并将请求对象 request 作为参数传递给视图函数。
4. 视图函数处理请求，并生成响应对象 response。
5. Django 将响应对象返回给客户端。

### 视图 View （controller + service）

视图一般写在 app(模块) 中的 views.py 文件中，并且视图函数的第一个参数永远是 request 对象，这个对象存储了用户请求的所有信息。当然视图函数的返回结果也必须是 HttpResponse 对象或其子类对象。

视图 Views 可以是类也可以是对象。示例代码如下：

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

### URL 映射

在写完视图View后，通常需要配置 URL 的映射，即用户需要访问哪个 URL 来进行获取对应的资源请求。

在项目的 urls.py 文件中，可以配置 URL 映射，通常是配置 urlpatterns 列表。示例代码如下：

```python
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

#### URL 中添加参数

如果只局限于 URL 中的话，那么从后端可以从前端获取的参数主要通过两种方式：
1. 通过 query string（查询字符串）：即URL中出现?号其后面的参数，如：http://www.example.com/index.php?name=value。那么就会读取?后面的参数。
2. 通过 path 路径来进行参数传递，有点类似 Restful 风格，即通过路径来传递参数，如：http://www.example.com/user/1。那么就会读取路径中的参数。

接下来演示以上两种方式在 django 中的获取和使用。

1. 首先在 app(模块) 中的 views.py 文件中定义视图函数，并编写以下函数

```python   
from django.shortcuts import render, HttpResponse
# query string 方法
def book_list_query(request):
    book_id = request.GET.get('id')
    return HttpResponse(f"Book ID query string: {book_id}")
# 查询路径 方法
def book_list_path(request, book_id):
    return HttpResponse(f"Book ID path: {book_id}")
```

2. 编写完成后，在urls.py文件中进行配置

```python
from django.contrib import admin
from django.urls import path
from book import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('book/', views.book_list_query, name='book_list_query'),
    path('book/<int:book_id>', views.book_list_path, name='book_list_path'),
]
```

3. 然后通过访问 `localhost:8000/book/?id=1` 和 `localhost:8000/book/1` 来查看结果。

#### path 函数

在 django 中，path函数定义为：

```python
path(route, view, name=None, kwargs=None)
```

- route：URL 路径，如 `/book/list/`。
  - 其中可以定义参数为指定类型，默认的类型为str，如 `<str:book_name>`，表示 book_name 参数为字符串类型，可以输入除了/之外的任意字符
  - 如 `<int:book_id>`，表示 book_id 参数为整数类型，可以输入数字
  - 如 `<uuid:book_uuid>`，表示 book_uuid 参数为 UUID 类型，可以输入32位的字符串
  - 如 `<slug:book_slug>`，表示 book_slug 参数为 slug 类型，可以输入以-或_分割的字符串
  - 如 `<path:file_path>`，表示 file_path 参数为路径类型, 可以输入/分割的字符串
- view：视图函数，如 `views.book_list_query` 或 `views.book_list_path`。
- name：URL别名，可用于反向解析。
- kwargs：额外参数，可用于传递给视图函数。

使用样例：
views.py 文件：
```python
from django.shortcuts import render, HttpResponse
# query string 方法 http://127.0.0.1:8000/book/123%20hah/
def book_list_str(request, book_name):
    return HttpResponse(f"Book List Str: {book_name}")
# int 参数 方法 http://127.0.0.1:8000/int/123/
def book_list_int(request, book_id):
    return HttpResponse(f"Book List Int: {book_id}")
# 路径参数方法 http://127.0.0.1:8000/path/hello/world/
def book_list_path(request, book_path):
    return HttpResponse(f"Book ID: {book_path}")
# slug 参数方法 http://127.0.0.1:8000/slug/796f2451-624e/
def book_list_slug(request, book_slug):
    return HttpResponse(f"Book Slug: {book_slug}")
# uuid 参数方法 http://127.0.0.1:8000/uuid/796f2451-624e-4496-b628-75eb6ed57263/
def book_list_uuid(request, book_uuid):
    return HttpResponse(f"Book UUID: {book_uuid}")
```
urls.py 文件：
```python
from django.contrib import admin
from django.urls import path
from book import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('book/<str:book_name>/', views.book_list_str, name='book_list_str'),
    path('int/<int:book_id>/', views.book_list_int, name='book_list_int'),
    path('slug/<slug:book_slug>/', views.book_list_slug, name='book_list_str'),
    path('uuid/<uuid:book_uuid>/', views.book_list_uuid, name='book_list_uuid'),
    path('path/<path:book_path>/', views.book_list_path, name='book_list_path'),
]
```

#### URL 中包含另一个 urls 模块

通常情况下，一个项目中会有多个模块，每个模块都有自己的 urls 模块，这些模块可以被其他模块的 urls 模块包含，这样可以将 URL 分发到不同的模块中。

一下将演示如何在一个模块中包含另一个模块的 urls 模块。这里以根目录的 urls.py 引入另一个 movice 模块的urls为例。

movice 模块下的 urls.py 文件，另外需要注意的是，为了避免多个模块的路由 name 出现重名的风险，建议每一个 urls.py 文件都设置一个 app_name 当作命名空间：

```python
# movice/urls.py
from django.urls import path
from movice import views

app_name = 'movice' # 为了防止以下路由的name重名，给每个app设置一个唯一的app_name，类似cpp的命名空间

urlpatterns = [
    path('list/', views.movice_list, name='movice_list'), # 这里就不贴出来具体的views函数了
    path('detail/<int:id>/', views.movice_detail, name='movice_detail'), # 这里就不贴出来具体的views函数了
]
```

根目录下的urls.py文件：

```python
# urls.py
from django.contrib import admin
from django.urls import path, include
from book import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('movice/', include('movice.urls')),
]
```

#### URL 反向解析

主要是通过 django 提供的 `reverse` 函数来实现。可以通过往这个函数内传入 URL 的别名来获取其对应的 URL 路径。通常可以用作路由的重定向操作。

以下演示如何通过别名来获取 URL 路径：

```python
# urls.py
from django.contrib import admin
from django.urls import path, include, reverse
from book import views
from django.shortcuts import HttpResponse

# url reverse
def index(request):
    print(reverse('book_list_str', args=['python'])) # 访问本模块下的路由，并传递参数
    print(reverse('movice:movice_detail', args=[1])) # 访问其他模块下的路由，并传递参数
    return HttpResponse('Hello, world. You\'re at the hello index.')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('book/<str:book_name>/', views.book_list_str, name='book_list_str'),
    path('int/<int:book_id>/', views.book_list_int, name='book_list_int'),
    path('slug/<slug:book_slug>/', views.book_list_slug, name='book_list_slug'),
    path('uuid/<uuid:book_uuid>/', views.book_list_uuid, name='book_list_uuid'),
    path('path/<path:book_path>/', views.book_list_path, name='book_list_path'),
    path('movice/', include('movice.urls')),
]
```

## 3. Django 模板 Template

首先介绍一下 DTL，Django Template Language，它是 Django 内置的模板语言，可以用来生成 HTML 页面。他跟 HTML 的区别在于，这个 HTML 文件可以被 Django 进行编译，然后可以将一些参数传递进去，进行数据的动态化。最后还是生成 HTML 文件再进行回传到浏览器。

### 如何渲染模版

在 Django 中，渲染模版有两种方式：

1. 使用 render_to_string() 方法，直接将模版渲染成字符串。然后再将这个字符串通过HttpResponse()方法返回给客户端。

```python
from django.shortcuts import render, HttpResponse
from django.template.loader import render_to_string

def index(request):
    template = 'index.html'
    html = render_to_string(template)
    return HttpResponse(html) # 写法1
```

2. 使用 render() 方法，将模版渲染成 HttpResponse 对象，然后再返回给客户端。

```python
from django.shortcuts import render, HttpResponse
from django.template.loader import render_to_string

def index(request):
    return render(request, 'index.html') # 写法2
```

当然了，如果完全按照上面来编写，访问指定的 URL 后还是会出现错误，找不到 URL 的情况。这是因为我们没有指定 index.html 模版文件的路径。
我们可以在项目的根目录下新建一个 templates 目录，然后在这个目录下新建 index.html 文件。然后在根目录下的 settings.py 文件中进行配置：

```python
TEMPLATES = [
    {
        'DIRS': [BASE_DIR / 'templates'], # 指定模版文件目录
    },
]
```

这样就可以正确的渲染模版文件了。

但是如果我们有多个模版文件，为了方便管理，我们是更希望将其对应的 html 文件放在同属其功能的模块目录下。
所以通常 templates 目录会在多个 app 模块下进行新建。但是除了上述的 settings.py 配置中还需要加上一个 APP_DIRS 字段：

```python
TEMPLATES = [
    {
        'DIRS': [BASE_DIR / 'templates'], # 指定模版文件目录
        'APP_DIRS': True, # 允许django自动查找app下的templates目录
    },
]
```

这样，即便是 movice 子模块下的 templates 目录，也会被自动识别到。
