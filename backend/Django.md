
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





