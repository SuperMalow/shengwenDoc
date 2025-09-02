# Django Rest Framework 学习笔记

本文档主要是记录学习 Django Rest Framework 的笔记。

# 环境搭建

本项目主要是使用 conda 来进行管理 python 环境。

1. 创建 oa 虚拟环境

```shell
conda create -n oa python=3.12
```

2. 安装 python 依赖

```SHELL
conda list  # 查看当前虚拟环境下的包
conda install django # 安装 django
conda install pymysql # 安装 mysql 驱动
conda install djangorestframework # 安装 rest framework
```

安装完成 pymysql 依赖记得在项目根目录下的 `__init__.py` 文件中添加如下代码:

```python
# 项目根目录/__init__.py
import pymysql
pymysql.install_as_MySQLdb()
```

# DRF 学习部分

## DRF 介绍

DRF 是 `Django Rest Framework` 单词的简写，是在 Django 框架中实现 `Restful API` 的一个插件，使用他可以非常方便的实现接口数据的返回。Django 中也可以使用 `JsonResponse` 直接返回 json 格式的数据，但是 DRF 相比直接使用 Django 返回 json 数据有以下几个好处：

1. 可以自动生成 API 文档，在前后端分离开发的时候进行沟通比较有用。
2. 授权验证策略比较完整，包含 OAuth1 和 OAuth2 验证。
3. 支持 ORM 模型和非 ORM 数据的序列化。
4. 高度封装了视图，使得返回 json 数据更加的高效。

## DRF 依赖安装

```shell
# 以下方式二选一
pip install djangorestframework # pip 安装
conda install djangorestframework # conda 安装
```

## DRF 快速开始

### 0. 创建 Django 项目

```shell
django-admin startproject drf_learn # 创建工程项目
```

### 1. 注册 DRF 到 Django 中

在项目中的 `settings.py` 文件中的 `INSTALL_APP` 字段中将 DRF 进行注册：

```python
INSTALLED_APPS = [
    # ... 省略其他的APP
    "rest_framework" # 注册 DRF
]
```

### 2. 创建 app 和 模型

通过 `python manage.py startapp meituan` 命令创建 app 。

接着在创建好的 app 中的 `models.py` 文件中编写模型：

```python
from django.db import models
from django.contrib.auth.models import User

class Merchant(models.Model):
    """
    商家
    """
    name = models.CharField(max_length=200,verbose_name='商家名称',null=False)
    address = models.CharField(max_length=200,verbose_name='商家',null=False)
    logo = models.CharField(max_length=200,verbose_name='商家logo',null=False)
    notice = models.CharField(max_length=200, verbose_name='商家的公告',null=True,blank=True)
    up_send = models.DecimalField(verbose_name='起送价',default=0,max_digits=6,decimal_places=2)
    lon = models.FloatField(verbose_name='经度')
    lat = models.FloatField(verbose_name='纬度')

    creater = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)


class GoodsCategory(models.Model):
    """
    商家商品分类
    """
    name = models.CharField(max_length=20,verbose_name='分类名称')
    merchant = models.ForeignKey(Merchant,on_delete=models.CASCADE,verbose_name='所属商家',related_name='categories')

class Goods(models.Model):
    """
    商品
    """
    name = models.CharField(max_length=200,verbose_name='商品名称')
    picture = models.CharField(max_length=200,verbose_name='商品图片')
    intro = models.CharField(max_length=200)
    price = models.DecimalField(verbose_name='商品价格',max_digits=6,decimal_places=2) # 最多6位数，2位小数。9999.99
    category = models.ForeignKey(GoodsCategory,on_delete=models.CASCADE,related_name='goods_list')
```

创建好 ORM 模型后，需要将 APP 添加到 `INSTALLED_APPS` 中：

```python
INSTALLED_APPS = [
    # ... 省略其他的APP
    "meituan" # 注册 APP
]
```

接着将模型同步到数据库中，分别执行以下两条命令：`python manage.py makemigrations` 和 `python manage.py migrate`

### 3. 编写 Serializers

首先在模块目录下新建一个 `serializers.py` 文件，编写序列化器：

```python
from rest_framework import serializers
from .models import Merchant

class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = '__all__' # 包含所有字段
        # exclude = ['name'] # 排除字段
```

以上代码，主要是为了将 ORM 模型中的字段进行序列化操作。由于 `rest_framework` 提供了序列化器，我们这里直接继承使用即可。有兴趣可以 `Ctrl+点击` 查看源码。

### 4. 编写视图

接着在这个模块目录下新建一个 `views.py` 文件，编写视图：

```python
from rest_framework import viewsets
from .models import Merchant
from .serializers import MerchantSerializer

class MerchantViewSet(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
```

以上代码，主要是为了将视图和序列化器进行绑定。同理，这个视图集是继承自 `ModelViewSet`。有兴趣可以 `Ctrl+点击` 查看源码。

### 5. 编写路由

接着在模块目录下新建一个 `urls.py` 文件，编写路由：

```python
from rest_framework.routers import DefaultRouter
from .views import MerchantViewSet

router = DefaultRouter()
router.register("merchant", MerchantViewSet, basename="merchant")

app_name = "quick_start"

urlpatterns = [] + router.urls
```

以上代码，主要是为了将视图集和路由进行绑定。同理，这个路由是继承自 `DefaultRouter`。有兴趣可以 `Ctrl+点击` 查看源码。当然了，最后还是需要在项目中的 `urls.py` 文件中添加路由：

## DRF 序列化

DRF 中的序列化主要是用来将模型序列化成 JSON 格式的对象。但是除了序列化，他还具有表单验证功能、数据存储、更新功能。

那么该如何进行对一个 ORM 模型进行序列化呢？接下来将演示如何编写一个序列化对象类。

1. 先创建一个 `serializers.py` 文件，以下是代码：

```python
from rest_framework import serializers
from meituan.models import Merchant

class MerchantSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200, required=True)
    address = serializers.CharField(max_length=200, required=True)
    logo = serializers.CharField(max_length=200, required=True)
    notice = serializers.CharField(max_length=200, required=False)
    up_send = serializers.DecimalField(max_digits=6, decimal_places=2, required=True)
    lon = serializers.FloatField(required=True)
    lat = serializers.FloatField(required=True)
    creater = serializers.IntegerField(required=False)

    def create(self, validated_data):
        # 重写create方法，创建数据
        return Merchant.objects.create(**validated_data) # **validated_data 为字典，将字典转为Merchant对象 (解构)

    def update(self, instance, validated_data):
        # 重写update方法，更新数据
        instance.name = validated_data.get('name', instance.name) # 如果在validated_data中没找到name，就用instance.name(默认值)
        instance.address = validated_data.get('address', instance.address)
        instance.logo = validated_data.get('logo', instance.logo)
        instance.notice = validated_data.get('notice', instance.notice)
        instance.up_send = validated_data.get('up_send', instance.up_send)
        instance.lon = validated_data.get('lon', instance.lon)
        instance.lat = validated_data.get('lat', instance.lat)
        instance.save()
        return instance
```

2. 接着新建一个 `views.py` 文件，以下是代码：

```python
from meituan.models import Merchant
from .serializer import MerchantSerializer
from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods

# 这里用 Django 原生写法
@require_http_methods(['GET', 'POST'])
def merchant(request):
    if (request.method == 'GET'):
        merchants = Merchant.objects.all()
        serializer = MerchantSerializer(merchants, many=True) # many=True 表示有多个对象
        return JsonResponse(serializer.data, safe=False)
    else:
        serializer = MerchantSerializer(data=request.POST)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)
```

3. 接着是新建一个 `urls.py` 文件，以下是代码：

```python
from django.urls import path
from . import views

app_name = 'serializer'

urlpatterns = [
    path("merchant/", views.merchant, name="merchant")
]
```

最后将路由添加到项目当中，接着通过 `Apifox` 第三方软件进行对接口进行请求，发现 get 和 post 接口都能够正常使用，并且跟快速入门中我们通过继承 `serializers.ModelSerializer` 的方式是一样的。而这上面的代码则是通过继承 `serializers.Serializer` 的方式来进行实现的。

### 关于 validate 验证器

验证用户上传的字段是否满足要求，可以通过以下三种方式来进行实现：

- 验证在 ORM 模型中的 Field 中进行 required=True
- 通过在序列期中重写 `validate(self, attrs)` 方法进行验证，attrs 包含了所有的字段。如果验证不通过，调用 `raise ValidationError('错误信息')` 抛出异常即可
- 重写 `validate_字段名(self, value)` 方法即可，同样验证不通过，调用 `raise ValidationError('错误信息')` 抛出异常即可

## DRF 请求和响应

在 DRF 中，新增了 `Request` 和 `Response` 类，用于对请求和响应进行封装。它们比原生 Django 的 `HttpRequest` 和 `HttpResponse` 更加强大。

### Request 对象

比原本的 `HttpRequest` 对象多了以下属性：

- `request.data`：获取请求体数据
- `request.query_params`：获取查询字符串数据

### Response 对象

比原本的 `HttpResponse` 对象强大了很多，原本如果要返回 JSON 数据，那么需要手动将数据转为 JSON 格式，然后再返回。但是现在只需要调用 `Response(data)` 即可。

### 状态码

在 DRF 中，新增了状态码，方便更直观的查看返回的状态码：`from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST`

### @api_view() 装饰器

如果还在采用 `视图函数` 的方式来进行编写接口，那么可以使用 `@api_view()` 装饰器来进行替代原生的 `@require_http_methods` 装饰器。且，要想使用 DRF 中的 `Response` 对象，那么必须采用 `@api_view()` 装饰器。该装饰器传入的参数跟 `@require_http_methods` 装饰器是一样的。

### APIView (常用)

在 DRF 中，如果采用 `类视图` 的方式来进行编写接口，那么该类需要继承 `APIView` 类(`from rest_framework.views import APIView`)。该类中提供了很多方法，比如：`get`、`post`、`put`、`delete` 等等。

## DRF 类视图

在 DRF 开发中，推荐使用 `类试图` 来进行编写接口。而不是使用 `视图函数` 。因为这样最终的代码更加简洁，可读性更高。

### APIView 写法

在 DRF 中，如果采用 `类试图` 的方式来进行编写接口，那么该类需要继承 `APIView` 类(`from rest_framework.views import APIView`)。该类中提供了很多方法，比如：`get`、`post`、`put`、`delete` 等等。如果需要自定义操作，那么可以重写这些方法。

接下来演示一个简单的例子：

1. 首先还是先编写一个 `serializers.py` 文件，以下是代码：

```python
from rest_framework import serializers
from meituan.models import Merchant, Goods, GoodsCategory

class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = '__all__'

class GoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goods
        fields = '__all__'

class GoodsCategorySerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer()
    merchant_id = serializers.IntegerField(write_only=True)
    goods_list = GoodsSerializer(many=True, read_only=True)
    class Meta:
        model = GoodsCategory
        fields = '__all__'

    def validate__merchant_id(self, value):
        if not Merchant.objects.filter(id=value).exists():
            raise serializers.ValidationError('商家不存在')
        return value

    def create(self, validated_data):
        merchant_id = validated_data.get('merchant_id')
        merchant = Merchant.objects.get(pk=merchant_id)
        category = GoodsCategory.objects.create(merchant=merchant, **validated_data)
        return category
```

2. 接着新建一个 `views.py` 文件，这次我们采用 `类试图` 的方式来进行编写接口，以下是代码：

```python
from rest_framework.views import APIView
from meituan.models import Merchant, Goods, GoodsCategory
from django.http import Http404
from .serializer import MerchantSerializer, GoodsSerializer, GoodsCategorySerializer
from rest_framework.response import Response
from rest_framework import status

class MerchantView(APIView):
    def get_object(self, pk):
        try:
            return Merchant.objects.get(pk=pk)
        except Merchant.DoesNotExist:
            return Http404

    def get(self, request, pk=None):
        if pk:
            merchant = self.get_object(pk)
            serializer = MerchantSerializer(merchant)
            return Response(serializer.data)
        else:
            queryset = Merchant.objects.all()
            serializer = MerchantSerializer(queryset, many=True)
            return Response(serializer.data)

    def put(self, request, pk):
        merchant = self.get_object(pk)
        serializer = MerchantSerializer(merchant, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        merchant = self.get_object(pk)
        merchant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

3. 接着是新建一个 `urls.py` 文件，以下是代码，记得不要忘记将路由添加到工程项目当中：

```python
from django.urls import path
from .views import MerchantView

app_name = "class_view"

urlpatterns = [
    path("merchant/", MerchantView.as_view(), name="merchant"), # get
    path("merchant/<int:pk>/", MerchantView.as_view(), name="merchant_detail") # get, put, delete
]
```

接下来可以通过 `APIFox` 等第三方软件进行验证接口即可。注意在请求 `merchant/id/` 接口的时候，需要将后续的 `/` 进行结尾。

### Mixins 写法

接下来介绍 `Mixins` ，它是 DRF 中常用的一个组件，它的出现，主要是为了解决代码复用的问题。在我们刚刚编写的 `APIView` 类试图代码可以看到在编写 `views` 具体的接口逻辑的时候，有很多重复性的代码：

1. 多次调用 `get_object()` 方法赋值到 `merchant` 变量
2. 多次调用 `MerchantSerializer` 方法赋值到 `serializer` 变量

以上这两个代码分别在不同的方法中进行实现。那么 DRF 提供的 `Mixins` 组件，它可以将这些重复性的代码进行封装，从而实现代码的复用。
接下来我们针对上面的 `views.py` 文件的代码进行改造：

```python
from rest_framework.views import APIView
from meituan.models import Merchant, Goods, GoodsCategory
from django.http import Http404
from .serializer import MerchantSerializer, GoodsSerializer, GoodsCategorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins, generics

class MerchantView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):
    # 只需要将之前重复的代码执行一次，赋值到类属性中即可
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    def get(self, request, pk=None):
        if pk:
            return self.retrieve(request, pk)
        else:
            return self.list(request)

    def post(self, request):
        return self.create(request) # 如果需要重写，则是重写perform_create方法(Mixins源代码中是调用的perform_create方法)

    def put(self, request, pk):
        return self.update(request, pk)

    def delete(self, request, pk):
        return self.destroy(request, pk)

```

可以参考 `APIView` 类试图未采用 `Mixins` 组件的代码，进行对比。

### Generic 写法

以上通过 `Mixins` 组件，实现了 CRUD 接口的复用，那么接下来我们介绍 `Generic` 组件，它将会继续在 `Mixins` 组件的基础上，实现更高级的代码复用。
常用的 `generic` 类视图有：

- `generic.ListCreateAPIView`：实现获取列表，实现 get 方法
- `generic.RetrieveUpdateDestroyAPIView`：实现获取详情，实现 get 方法
- `generic.CreateAPIView`：实现创建数据，实现 post 方法
- `generic.UpdateAPIView`：实现更新数据，实现 put 方法
- `generic.DestroyAPIView`：实现删除数据，实现 delete 方法
- `generic.ListCreateAPIView`：实现列表和创建数据方法
- `generic.RetrieveUpdateDestroyAPIView`：实现检索和更新数据
- `generic.RetrieveDestroyAPIView`：实现检索和删除数据
- `generic.RetrieveUpdateDestroyAPIView`：实现检索、更新和删除数据

用法如下：

```python
class MerchantView(
    generics.RetrieveAPIView, # 无效 ListAPIView 占用
    generics.ListAPIView,
    generics.CreateAPIView,
    generics.UpdateAPIView,
    generics.DestroyAPIView
):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

```

因为这里 `ListAPIView` 占用了 `RetrieveAPIView` 方法，所以如果想要实现获取列表的功能，那么需要再重新定义一个 url 和视图：

```python
class MerchantView(
    generics.RetrieveAPIView,
    generics.CreateAPIView,
    generics.UpdateAPIView,
    generics.DestroyAPIView
):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

# 单独获取列表(记得添加到url当中)
class MerchantsView(generics.ListAPIView):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
```

这样就可以解决同时实现获取列表和创建数据的功能。

#### GenericsAPIView 介绍

1. queryset：

queryset 是用来控制视图返回给前端的数据。如果没什么逻辑，可以直接写在视图的类属性中，如果逻辑比较复杂，也可以重写 get_queryset 方法用来返回一个 queryset 对象。如果重写了 get_queryset，那么以后获取 queryset 的时候就需要通过调用 get_queryset 方法。因为 queryset 这个属性只会调用一次，以后所有的请求都是使用他的缓存。

2. serializer_class:

serializer_class 用来验证和序列化数据的。也是可以通过直接设置这个属性，也可以通过重写 get_serializer_class 来实现。

3. lookup_field 和 lookup_url_kwarg:

- lookup_field 是在检索的时候，根据什么参数进行检索。默认是 pk，也就是主键。
- lookup_url_kwarg 在检索的 url 中的参数名称。默认跟 lookup_field 保持一致。

假设我们想要根据 name 进行查找数据，那么需要修改 lookup_field 和 lookup_url_kwarg：

```python
class MerchantView(
    generics.RetrieveAPIView,
    generics.CreateAPIView,
    generics.UpdateAPIView,
    generics.DestroyAPIView
):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'pk' # 这里由于我们url中的接口的参数是 pk，所以这里需要修改为 pk，不然默认会跟 lookup_field 保持一致，同时在url中的参数表里确保是str:pk而不是int:pk
```

那么就可以通过 `http://127.0.0.1:8000/classview/merchant/%E8%8C%B6%E9%A2%9C%E6%82%A6%E8%89%B2/` 来查询数据了。

##### GenericAPIView 重写方法

1. get_queryset(self)

如果需要修改返回的 ORM 模型的 queryset，那么可以重写 get_queryset 方法。

2. get_object(self)

如果想要修改返回一条数据进行修改，那么可以重写 get_object 方法。

3. perform_create(self, serializer)

如果想要在创建数据的时候，对数据进行一些处理，那么可以重写 perform_create 方法。

4. perform_update(self, serializer)

如果想要在更新数据的时候，对数据进行一些处理，那么可以重写 perform_update 方法。

5. perform_destroy(self, serializer)

如果想要在删除数据的时候，对数据进行一些处理，那么可以重写 perform_destroy 方法。

## DRF 视图集

在上一章节，我们讲解了类试图的写法，一共从最原本的类试图写法，接着到 `Mixins` 组件优化写法，最后到 `Generic` 组件优化写法。那么接下来我们讲解 `DRF` 视图集。它接着是在 `Generic` 组件的基础上，实现更高级的代码复用(代码一步步优化)。而在视图集中，不再拥有 `get` 和 `post` 方法，取而代之的是 `list` 和 `create` 方法。同时，视图集还在路由上做了优化。

首先是 `views.py` 文件的写法：

```python
from rest_framework import viewsets

# 由于 viewsets.ViewSet 跟上一章节的写法都类似，这里只写 viewsets.ModelViewSet 写法
class MerchantView(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
```

从上面代码来看，其实跟 `GenericAPIView` 的写法类似。接下来是路由 `urls.py` 的写法(当然该`urls`文件同样需要添加到工程的路由当中)：

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("merchant", MerchantView, basename="merchant")

urlpatterns = [] + router.urls
```

另外的，视图集中考虑到了扩展的写法，所以这里需要先了解下 `ViewSet` 的扩展写法。主要是通过 `ViewSet` 的 `action` 属性来实现。以下是示例代码：

```python
from rest_framework import viewsets
from rest_framework.decorators import action

class MerchantView(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    @action(methods=['get'], detail=False, url_path='test')
    def function_1(self, request):
        # 比如写一个查询长沙的商家的小功能
        queryset = self.get_queryset()
        result = queryset.filter(name__contains='长沙')
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='test2')
    def function_2(self, request):
        print(request.data)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='test3')
    def function_3(self, request, pk=None):
        '''
        请求参数: http://127.0.0.1:8000/classview/merchant/123/test3/?a=1
            - pk: 从URL路径中获取的主键参数 123
            - 其他参数从request.query_params中获取 a=1
        '''
        print('query_params:' + request.query_params)
        print('pk:' + pk)
        return Response(status=status.HTTP_200_OK)
```

**TIPS:** 在编写好的 `@action` 函数内的注释可通过浏览器中访问该接口的接口文档中进行展示。

## DRF 认证和权限

### DRF 认证

认证可以简单的理解为 `登录` 和 `访问` 需要登录的接口的认证。只要认证通过了，那么在 `request` 对象（是 drf 的 request 对象）上便有两个属性，一个是 `request.user`，一个是 `request.auth`，前者就是 `django` 中的 `User` 对象，后者根据不同的认证机制有不同的对象。DRF 内置了几个认证的模块。

1. `rest_framework.authentication.BasicAuthentication`: 基本的授权，每次都要在 `Header` 中把用户名和密码都传给服务器，因此不太安全

2. `rest_framework.authentication.SessionAuthentication`: 基于 django 中的 `session` 机制实现。如何前端部分是网页，那么用这种方式是可以的，但是如果前端还涉及到 IOS 或者安卓，那么这种方式就不太方便了。

3. `rest_framework.authentication.TokenAuthentication`: 基于 `token` 机制实现。只要登录成功就会返回一个 `token`，以后请求一些需要登录的接口，只需要在 `Header` 中传 `token` 就可以了。并且这个 `token` 是存储到数据库当中的。但是这种方法有个缺点，就是这个 `token` 没有过期时间，一旦完成登录后，这个 `token` 是永久有效的，这也是不够安全的。

### Json Web Token (jwt) 验证

`Json Web Token` 简称 `JWT`。在 `前后端分离` 的项目中，或者是 `app` 项目中，推荐使用 `JWT`。`JWT` 是在登录成功后，把用户的相关信息（比如用户 id）以及过期时间进行加密，然后生成一个 `token` 返回给客户端，客户端拿到后可以存储起来，以后每次请求的时候都携带这个 `token`，服务器在接收到需要登录的 API 请求后，对这个 `token` 进行解密，然后获取过期时间和用户信息（比如用户 id），如果过期了或者用户信息不对，那么都是认证失败(那么就会触发重新登录操作)。

### 实现 JWT 认证

要想实现这个 `JWT` 验证逻辑，那么就需要两个功能函数: 1. 生成 `token`，2. 验证 `token`。

1. 生成 `token`：

生成 `token` 这部分，可以借助 `pyjwt` 这个第三方库来进行实现。
安装 `pyjwt`：

```shell
pip install pyjwt # pip 安装
conda install pyjwt # conda 安装
```

简单使用：

```python
import jwt
import time
from django.conf import settings

# 生成 token
def get_token(user):
    timestamp = int(time.time()) + 60*60*24*7
    payload = {
        'user_id': user.pk,
        'exp': timestamp
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256').decode('utf-8')

# 解码 token
def decode_token(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
```

如何集成进 Django 项目当中并添加请求验证？首先介绍，如何对视图类添加权限认证：

```python
from rest_framework.authentication import BasicAuthentication,
from rest_framework.permissions import IsAuthenticated

class MerchantView(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    authentication_classes = [JWTAuthentication, BasicAuthentication] # 添加认证类根据顺序进行验证
    permission_classes = [IsAuthenticated]
```

以上代码是一个视图集类，在视图集类中添加了两个认证类，一个是 `JWTAuthentication`，一个是 `BasicAuthentication`。`JWTAuthentication` 是我们自定义的认证类，`BasicAuthentication` 是 `DRF` 内置的认证类。添加后，那么请求该类的所有方法都需要添加认证信息进行请求，认证成功后才能够进行对应接口的响应。

接下来是自定义的认证类 `JWTAuthentication` 的实现：

```python
from rest_framework.authentication import BasicAuthentication, BaseAuthentication, get_authorization_header
from rest_framework import exceptions

# 该验证类参考TokenAuthentication 的实现
class JWTAuthentication(BaseAuthentication):
    """
    认证信息格式：
    Authorization: JWT 401f7ac837da42b97f613d789819ff93537bee6a
    """

    keyword = 'jwt'

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            msg = 'Authorization 不可用! 验证头和token间应该包含一个空格!'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Authorization 不可用! 验证头和token间应该包含一个空格'
            raise exceptions.AuthenticationFailed(msg)

        try:
            jwt_token = auth[1].decode()
            # 开始解码
            jwt_info = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
            userid = jwt_info.get('userid')
            try:
                user = User.objects.get(pk=userid)
                return (user, jwt_token)
            except:
                msg = '验证失败！用户不存在！'
                raise exceptions.AuthenticationFailed(msg)
        except jwt.ExpiredSignatureError:
            msg = 'Token已过期！请重新登录！'
            raise exceptions.AuthenticationFailed(msg)
```

以上代码就是一个简单的 `JWT` 认证类的编写，主要还是参考 `TokenAuthentication` 的实现。主要是实现 `authenticate` 函数。如果后续视图类需要使用到这个JWT认证的功能，只需要设置 `authentication_classes = [JWTAuthentication]` 即可实现。

### DRF 权限

不同的 `API` 拥有不同的权限，例如文章发布者可以拥有文章删除的权限，但是读者没有文章的删除权限。接下来介绍 DRF 内置的一些权限：

- `persmissions.AllowAny`: 任何用户都可以访问
- `permissions.IsAuthenticated`: 只有登录用户才可以访问
- `permissions.IsAdminUser`: 只有管理员才可以访问
- `permissions.IsAuthenticatedOrReadOnly`: 登录用户可以访问，或者非登录用户可以访问，但是只能读取数据，不能修改数据

以上四个权限类，是 DRF 提供的权限管理。接下来介绍如何自定义权限管理。自定义权限管理只要遵循两个条件即可：

1. 继承自 `permissions.BasePermission` 类
2. 实现 `has_permission(self, request, view)` 方法或 `has_object_permission(self, request, view, obj)` 方法。其中第一个方法是针对整个视图，第二个方法是针对单个对象。例如请求整个列表，那么就会走第一个函数的权限控制。当请求单个对象，那么就会走第二个函数的权限控制。

示例代码：

```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # 比方说，请求头带Referer字段就能够进行访问(简单验证是否为爬虫)
        if request.META.get('HTTP_REFERER'):
            return True
        return False

    def has_object_permission(self, request, view, obj):
        # 假设只有携带User-Agent字段的请求才能进行访问
        if (request.META.get('HTTP_USER_AGENT')):
            return True
        return False

```

以上就是自定义权限类的实现，后续只需要将该类进行导入，然后在对应的视图类中添加该权限类即可。`permission_classes = [IsOwnerOrReadOnly]`

### DRF 全局权限

权限的使用也是两种方式。第一种是在 `settings.REST_FRAMEWORK.DEFAULT_PERMISSION_CLASSES` 设置。第二种是在具体的视图函数中通过 `permission_classes` 来设置。

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        # 'meituan.IsOwnerOrReadOnly', # 也可以设置为自定义权限类来进行验证
    ]
}
```

以上代码就是设置全局权限，那么在整个项目当中，所有的视图函数都需要进行权限的验证。

## DRF 限速节流

使用 drf 可以给我们的网站 API 限速节流。比如一些爬虫，爬你网站的数据，那么我们可以通过设置访问的频率和次数来限制他的行为。

在 def 中，可以通过两种方式去配置来进行实现限速节流操作：

1. 直接在 `setting.py` 中进行添加 `REST_FRAMEWORK` 字段进行配置。

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '2/day',
        'user': '5/day'
    }
}
```

通过上面代码的示例，网站会针对匿名用户(未登录状态)，设置访问频率为 2 次/天。针对登录用户，设置访问频率为 5 次/天。

其中 `AnonRateThrottle` 类是针对匿名用户进行限速节流。`UserRateThrottle` 是针对登录用户进行限速节流。

当然也可以自定义限速节流类，只需要继承 `rest_framework.throttling.BaseThrottle` 类，接着定义 `scope` 属性，接着在 `setting.py` 中进行设置速率即可。

2. 针对每一个视图类进行设置 `throttle_classes` 或者 视图函数进行设置 `throttle_rates`。

```python
# views.py
class MerchantView(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    throttle_scope = 'merchant'

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'merchant': '3/day'
    }
}
```

以上代码，通过 `throttle_scope` 来设置某个视图类进行限速节流。接着在 `settings.py` 中进行设置限速节流频率即可。

## DRF 分页

在 def 当中，支持数据库的分页配置，无需安装额外的插件即可实现。

### 全局分页

在 `settings.py` 中进行配置即可，非常简单。

```python
# settings.py

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

通过上述代码的配置后，即可实现全局分页，每次请求都只会返回 10 条数据。并且返回还会返回其他的字段信息。例如一共有多少条数据，上一页的接口 URL 是什么，下一页的接口 URL 是什么。

### 视图单独分页

如果有些视图需要自己的分页逻辑，那么可以通过自定义分页类来进行单独处理。自定义分页类也很简单，只需要继承 `rest_framework.pagination.PageNumberPagination` 类，然后定义 `page_size` 属性即可。多余的属性定义有：`max_page_size`、`page_size_query_param`、`page_query_param`。

```python
# views.py
from rest_framework.pagination import PageNumberPagination

class MerchantsPagination(PageNumberPagination):
    # 每页显示多少条
    page_size = 5
    # 每页最多不能超过多少条数据
    max_page_size = 10
    # 用户可以指定?size=xxx的参数来指定每页显示的条数，但是不能超过上面定义的max_page_size
    page_size_query_param = 'size'
    # 用户可以指定?p=xxx的参数来指定第几页，默认是page
    page_query_param = 'p'

class MerchantView(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    pagination_class = MerchantPagination

```
