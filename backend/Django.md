
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

## 2. URL 路由

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
from django.urls import path
from. import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

## 3. 数据库

采用的数据库为MySQL，并且搭配navicat图形化工具进行数据库的管理。

### mysql 驱动程序安装

我们使用 django 操作数据库，其实是其底层通过 python 来进行操作的。所以我们需要安装 mysql 驱动程序。常见的 mysql 驱动程序有：

- MySQL-python : 对C语言操作MYSQL进行了封装，但是不支持python3
- mysqlclient : 是MYSQL-python的另一个分支，支持python3
- pymysql : 纯python实现的mysql驱动程序，支持python2和python3,效率差点
- MySQL Connector/Python : 是MySQL官方提供的python驱动程序，同样效率不高

然后我们将采用的是 mysqlclient 驱动程序。

```shell
# pip安装
pip install mysqlclient
# conda安装
conda install mysqlclient
```

### 连接数据库

在django中连接数据库非常的简单，只需要在 settings.py 文件中进行配置即可。

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

django操作数据库主要有两种方式：

1. 通过原生的sql语句进行操作数据库。其实就是通过python db api进行操作数据库。(不推荐使用)

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

2. 通过ORM框架进行操作数据库。(推荐使用)

ORM 模型框架: Object relation mapping，即对象-关系映射，它是一种程序设计技术，用于将关系数据库中的数据映射到面向对象编程语言中的对象上。可以很有效的减少sql语句的编写。

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

64位整型，同样有自动增长的功能。

#### BooleanField

在模型层面接受的是 True 或 False，但是映射在数据库中是 tinyint(1) 类型。

#### CharField

映射到数据库中的类型为 varchar，可以指定最大长度。

#### DateField

映射到数据库中的类型为 date。在使用这个字段时，可以传递以下几个参数：

- auto_now：每次保存对象时，自动将当前日期写入数据库。
- auto_now_add：第一次保存对象时，自动将当前日期写入数据库。

#### DateTimeField

类似于 DateField，但是映射到数据库中的类型为 datetime。跟DateField一样，可以指定参数 auto_now 和 auto_now_add。

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
2. blank：是否允许为空。这个和null还是存在一定区别的，null是数据库级别的，而blank则是表单级别的。
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

当Article模型中使用了ForeignKey字段时，Django会自动在数据库中在 Article 表中创建一个 author_id 字段，并在 User 表中创建一个反向引用的 author_id 字段。

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





