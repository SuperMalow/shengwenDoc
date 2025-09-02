# Django 学习笔记

## 0. 基础知识入门

### URL 概念

URL（Uniform Resource Locator）是互联网上用来标识信息资源的字符串，它由若干部分组成，包括：协议、域名、端口号、路径、参数、锚点、查询字符串。

`https://www.baidu.com/index.html?x=1#haha` => `协议://域名:端口号/路径?参数#锚点`

- 协议：用来指定访问资源的协议，如 http、https、ftp 等。
- 域名：用来指定访问资源的域名，如 baidu.com。
- 端口号：用来指定访问资源的端口号，如 80、8080 等。
- 路径：用来指定访问资源的路径，如/index.html。
- 查询参数：用来指定访问资源的附加参数，通常以?开头，如 x=1。
- 锚点：用来指定页面内的某个位置，如#haha。

## 1. 创建 Django 项目

### 1.0 首先需要先安装 django 环境，可以使用 pip 安装：

```shell
pip install django
```

### 1.1 更换 pip 安装源

在 Linux 和 macOS 系统中，pip 的配置文件通常位于~/.pip/pip.conf；在 Windows 系统中，配置文件可能位于 C:\Users\<用户名>\pip\pip.ini。如果文件不存在，可以手动创建。

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
4. wsgi.py：项目的 WSGI 配置文件，用来配置项目的 Web 服务器接口，如 Apache、Nginx 等。

### project 和 app 的关系

app 是 django 项目的组成部分。在这里可以将 app 理解为一个模块即可。一个项目中通常拥有很多个模块。

通过以下命令可以创建 app(模块):

```shell
python manage.py startapp app(模块)名称
```

## 2. URL 分发步骤

当访问一个 URL 的时候，Django 会按照以下步骤进行分发：

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

在写完视图 View 后，通常需要配置 URL 的映射，即用户需要访问哪个 URL 来进行获取对应的资源请求。

在项目的 urls.py 文件中，可以配置 URL 映射，通常是配置 urlpatterns 列表。示例代码如下：

```python
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

## 3. 数据库

采用的数据库为 MySQL，并且搭配 navicat 图形化工具进行数据库的管理。

### mysql 驱动程序安装

我们使用 django 操作数据库，其实是其底层通过 python 来进行操作的。所以我们需要安装 mysql 驱动程序。常见的 mysql 驱动程序有：

- MySQL-python : 对 C 语言操作 MYSQL 进行了封装，但是不支持 python3
- mysqlclient : 是 MYSQL-python 的另一个分支，支持 python3
- pymysql : 纯 python 实现的 mysql 驱动程序，支持 python2 和 python3,效率差点
- MySQL Connector/Python : 是 MySQL 官方提供的 python 驱动程序，同样效率不高

然后我们将采用的是 mysqlclient 驱动程序。

```shell
# pip安装
pip install mysqlclient
# conda安装
conda install mysqlclient
```

### 连接数据库

在 django 中连接数据库非常的简单，只需要在 settings.py 文件中进行配置即可。

示例代码:

```python
DATABASES = {
    'default': {
        # 数据库引擎 django.db.backends.mysql django.db.backends.postgresql django.db.backends.sqlite3 django.db.backends.oracle
        'ENGINE': 'django.db.backends.mysql',
        # 数据库名称
        'NAME': 'test',
        # 数据库用户名
        'USER': 'root',
        # 数据库密码
        'PASSWORD': '123456',
        # 数据库主机地址
        'HOST': 'localhost',
        # 数据库端口
        'PORT': '3306',
    }
}
```

### 操作数据库

django 操作数据库主要有两种方式：

1. 通过原生的 sql 语句进行操作数据库。其实就是通过 python db api 进行操作数据库。(不推荐使用)

```python
from django.db import connection

# 获取cusor对象
cursor = connection.cursor()
# 执行sql语句
cursor.execute("SELECT * FROM user_info")
# 获取查询结果
rows = cursor.fetchall()
for row in rows:
    print(row)
# 关闭cursor对象
cursor.close()
```

2. 通过 ORM 框架进行操作数据库。(推荐使用)

ORM 模型框架: Object relation mapping，即对象-关系映射，它是一种程序设计技术，用于将关系数据库中的数据映射到面向对象编程语言中的对象上。可以很有效的减少 sql 语句的编写。

#### ORM 模型的创建

ORM 模型通常放在 app(模块) 下的 models.py 文件中，我们需要先定义好模型类，然后通过 makemigrations 和 migrate 命令来创建数据库表。当然了，前提是这个 app(模块) 需要在项目的 INSTALLED_APPS 中进行注册安装。

示例代码:
models.py

```python
# models.py
from django.db import models

class Book(moduls.Model):
    # null = False 表示该字段不能为空
    name = models.CharField(max_length=100, null=False)
    author = models.CharField(max_length=100, null=False)
    # max_digits 最大位数，decimal_places 小数点位数
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    publish = models.CharField(max_length=100, null=False)
    pub_date = models.DateField(null=False)
```

以上就是一个简单的 Book 模型，包含了书名、作者、价格、出版社、出版日期等字段。但其实我们少写了一个 id 字段，如果我们没有写 id 字段，那么 django 会自动给我们添加一个自增 id 字段，且该字段为主键。

#### 将 ORM 模型映射到数据库中

我们需要通过 makemigrations 和 migrate 命令来将 ORM 模型映射到数据库中。

首先通过 make migrations 命令来生成迁移脚本文件：

```shell
python manage.py makemigrations
```

然后通过 migrate 命令来将迁移脚本文件映射到数据库中：

```shell
python manage.py migrate
```

执行完成上面两个命令后，数据库中就有了 Book 表。

### 模型中常用的字段

在 django 中定义了一些常用的 Field 字段来与数据库表中的字段类型来进行映射。

#### AutoField

映射到数据库中的类型为 int，并且有自动增长的功能。

#### BigAutoField

64 位整型，同样有自动增长的功能。

#### BooleanField

在模型层面接受的是 True 或 False，但是映射在数据库中是 tinyint(1) 类型。

#### CharField

映射到数据库中的类型为 varchar，可以指定最大长度。

#### DateField

映射到数据库中的类型为 date。在使用这个字段时，可以传递以下几个参数：

- auto_now：每次保存对象时，自动将当前日期写入数据库。
- auto_now_add：第一次保存对象时，自动将当前日期写入数据库。

#### DateTimeField

类似于 DateField，但是映射到数据库中的类型为 datetime。跟 DateField 一样，可以指定参数 auto_now 和 auto_now_add。

#### TimeField

映射到数据库中的类型为 time。

#### EmailField

映射到数据库中的类型为 varchar，并且验证邮箱格式。

#### FileField

映射到数据库中的类型为 varchar，可以指定最大长度。

#### ImageField

类似于 FileField，但是验证上传的图片格式。

#### FloatField

映射到数据库中的类型为 float。

#### IntegerField

映射到数据库中的类型为 int。

#### BigIntegerField

映射到数据库中的类型为 bigint。

#### TextField

映射到数据库中的类型为 longtext。

#### UUIDField

映射到数据库中的类型为 char(32)，并且自动生成 uuid。一般用来当作主键

#### URLField

映射到数据库中的类型为 varchar，并且验证 url 格式。

### 模型中常用的参数

1. null：是否允许为空。即一开始数据库中该字段的值是否可以为空。
2. blank：是否允许为空。这个和 null 还是存在一定区别的，null 是数据库级别的，而 blank 则是表单级别的。
3. db_column：指定数据库中的列名。如果没有设置这个参数，将使用模型中的字段名作为列名。
4. default：设置默认值。
5. primary_key：是否为主键。
6. unique：是否唯一。

### Meta 类

对于一些模型级别的配置，可以在其内部进行建立一个 Meta 类，用于定义一些模型级别的属性，比如：db_table、ordering 等。

#### db_table

将这个模型映射到数据库中的表名，如果没有指定这个参数则将模型的名称来用作表名

#### ordering

设置在数据库查询时默认的排序方式。

### 外键和表关系

#### 外键的定义

在 mysql 中，表有两种引擎，一种是 InnoDB，另一种是 MyISAM。如果使用的是 InnoDB 引擎，是支持外键约束的。

外键的类定义为 `class ForeignKey(to, on_delete, **options)` 。第一个参数为引用的哪个模型，第二个参数则是使用外键引用的模型数据被删除后这个字段该如何处理。

```python
class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()

class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey("User", on_delete=models.CASCADE)
```

以上代码中，`Article` 模型的 `author` 字段是一个外键，它引用了 `User` 模型的 `id` 字段。当 `User` 模型的数据被删除时，`Article` 模型中的 `author` 字段也会被级联删除。

当 Article 模型中使用了 ForeignKey 字段时，Django 会自动在数据库中在 Article 表中创建一个 author_id 字段，并在 User 表中创建一个反向引用的 author_id 字段。

另外在定义 ForeignKey 字段时，还可以外键引用本身自己的这个模型。例

```python
class Comment(models.Model):
    context = models.TextField()
    origin_comment = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    # 或者
    # origin_comment = models.ForeignKey("Comment", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
```

#### 外键的操作

如果一个模型使用了外键。那么在对方那个模型被删掉后，该进行什么样的操作。可以通过 on_delete 来指定。可以指定的类型如下：

1. CASCADE：级联删除，如果外键对应的那条数据被删除了，那么这条数据也会同时被删除。
2. PROTECT：阻止删除，如果外键对应的那条数据被删除了，那么这条数据不会被删除，而是抛出 ProtectedError 异常
3. SET_NULL：设置为空，如果外键对应的那条数据被删除了，那么这条数据对应的外键字段的值会被设置为 null。
4. SET_DEFAULT：设置默认值，如果外键对应的那条数据被删除了，那么这条数据对应的外键字段的值会被设置为默认值。
5. DO_NOTHING：什么都不做，如果外键对应的那条数据被删除了，那么这条数据不会被删除。
6. SET()：自定义设置值，如果外键对应的那条数据被删除了，那么这条数据对应的外键字段的值会被设置为 SET() 中的值。

#### 表关系

表之间的关系都是通过外键来进行约束的，通常有：一对一、一对多、多对多。

1. 一对一关系：

2. 一对多关系：

3. 多对多关系：

#### related_name 和 related_query_name

related_name 和 related_query_name 这两个参数是用来定义反向引用的名称的。

### CRUD 操作

如果只局限于 URL 中的话，那么从后端可以从前端获取的参数主要通过两种方式：

1. 通过 query string（查询字符串）：即 URL 中出现?号其后面的参数，如：http://www.example.com/index.php?name=value。那么就会读取?后面的参数。
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

2. 编写完成后，在 urls.py 文件中进行配置

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

在 django 中，path 函数定义为：

```python
path(route, view, name=None, kwargs=None)
```

- route：URL 路径，如 `/book/list/`。
  - 其中可以定义参数为指定类型，默认的类型为 str，如 `<str:book_name>`，表示 book_name 参数为字符串类型，可以输入除了/之外的任意字符
  - 如 `<int:book_id>`，表示 book_id 参数为整数类型，可以输入数字
  - 如 `<uuid:book_uuid>`，表示 book_uuid 参数为 UUID 类型，可以输入 32 位的字符串
  - 如 `<slug:book_slug>`，表示 book*slug 参数为 slug 类型，可以输入以-或*分割的字符串
  - 如 `<path:file_path>`，表示 file_path 参数为路径类型, 可以输入/分割的字符串
- view：视图函数，如 `views.book_list_query` 或 `views.book_list_path`。
- name：URL 别名，可用于反向解析。
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

一下将演示如何在一个模块中包含另一个模块的 urls 模块。这里以根目录的 urls.py 引入另一个 movice 模块的 urls 为例。

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

根目录下的 urls.py 文件：

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

1. 使用 render_to_string() 方法，直接将模版渲染成字符串。然后再将这个字符串通过 HttpResponse()方法返回给客户端。

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
