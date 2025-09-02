# asyncDjango 开发

Django Rest Framework 作为一款专为 Django 打造的提供 API 服务的框架，已经是 Django 开发者必不可少的框架了，但是这款框架目前是不支持异步的。如果想要在异步 Django 中使用 DRF，那么需要借助一个插件 adrf，其 github 地址为：[adrf github](https://github.com/em1208/adrf)，支持异步权限验证、异步限速节流、异步视图、异步视图集、异步序列化等功能。

## adrf 安装和配置

通过以下命令进行安装：

```shell
pip instll adrf
```

然后在 `settings.py` 配置中添加以下内容：

```py
INSTALLED_APPS = [
    # ...
    "adrf",
]
```

## 异步 API 视图

1. `APIView`

首先这里需要继承的 `APIView` 不是 `rest_framework.views.APIView` 而是 `adrf.viewsets.APIView`。其余的写法跟以前的写法差不多：

```py
from adrf.viewsets import APIView
from django.http.response import JSONResponse

class IndexView(APIView):
    async def get(self, request):
        return JSONResponse({'message': '请求成功!'})

class MessageView(APIView):
    async def post(self, request):
        title = request.data.get('title')
        content = request.data.get('content')
        print(f'{title} --- {content}')
        return JSONResponse({'message': '已收到您的建议!'})
```

2. `authentication`

对于异步的用户验证 authentication，还是跟原来的一样编写方式。不同的是在将 `authenticate` 方法重写的时候，需要将该方法编程异步方法。

```py
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from django.contrib.auth import get_user_model
from rest_framework import exceptions

User = get_user_model()

class AsyncJwtAuthentication(BaseAuthentication):
    '''
    前端请求格式: Authorization: JWT xxxx
    '''
    keyword = "Jwt"

    async def authenticate(self, request):
        auth = get_authorization_header(request).split()
        token = auth[1]
        if token == 'xxxx':
            # 采取异步的方式获取用户
            user = await User.objects.afirst()
            setatttr(request, "user", user) # 将用户对象写入到request对象中，供后续方法调用
            return user, token
        else:
            raise exceptions.AuthenticationFailed('用户验证失败!')
```

上面的代码即为一个异步的用户认证方法。可以配置整体项目默认认证验证方法，在 `settings.py` 中：

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'asyncDemo.authentication.AsyncJwtAuthentication'
    ]
}
```

当然也可以在单个的视图中进行单独配置，如下：

```py
class IndexView(APIView):
    authentication_classes = [AsyncJwtAuthentication]
```

3. `permission`

如果需要对 API 进行权限控制，那么可以实现自动的权限类，在该类中实现异步的 has_permission 方法即可。如下：

```py
import random
class AsyncPermission:
    async def has_permission(self, request):
        if random.random() < 0.5:
            return False
        return True
```

其实如果具体的操作不涉及到 **I/O 操作**、**网络调用** 和 **数据库访问**，那么写成同步的方式也是可以的。

`permission` 同样可以通过在 `settings.py` 中设置全局默认配置：

```py
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ['front.permissions.AsyncPermission']
}
```

同样也可以在某个视图中进行单独的配置：

```py
class IndexView(APIView):
    permission_classes = [AsyncPermission]
```

4. `throttle`

adrf 同样也支持限速节流，通过继承自 rest_framework.BaseThrottle ，然后在子类中实现异步的 allow_request 方法，即可实现异步版的限速节流。示例代码如下：

```py
from rest_framework import BaseThrottle
import random
class AsyncThrottle(BaseThrottle):
    def allow_request(self, request):
        if random.random() < 0.5:
            return False
        return True

    def wait(self):
        return 3 # 每次请求之后至少等待的时间，单位秒
```

该限速类的配置方法和 permission 的配置方法一样，都是可以通过 `settings.py` 中进行全局设置，也可以进行单独某个视图的设置。这里不过多赘述。

## 异步视图集

在异步视图集中，实现的所有方法都必须是异步的。另外 drf 中封装度最高的 modelViewSet 是不能使用的。必须自动手动实现异步的视图集：

```py
from django.contrib.auth import get_user_model
from adrf.viewsets import ViewSet
from django.http.response import JSONResponse

User = get_user_model()

class AsyncUserViewSet(ViewSet):
    async def list(self, request):
        return JSONResponse({'list': '用户列表!'})

    async def retrieve(self, request, pk):
        user = await User.objects.filter(pk=pk).afirst() # 使用异步方法获取查到第一个结果
        return JSONResponse({'user': {'name': user.name}})
```

完成上诉代码后，需要在 `urls.py` 文件中进行路由映射：

```py
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# 注意：请求该路径末尾需要加上`/`
router.register('user', views.AsyncUserViewSet, basename='user')

urlpatterns = [] + router.urls
```

## 异步序列化

序列化类承担起两个角色，一个是**校验前端传的数据是否符合格式**，另外一个是**将 ORM 对象转换为字典**，方便通过 JSON 的格式返回给前端。

1. 验证表单数据

由于 adrf 没有对 `validate_[field]` 、`validate` 方法编写异步处理的逻辑，因此**自定义验证相关的方法只能是同步的，从而不能在校验的逻辑中出现 I/O 阻塞式代码。**

```py
from adrf.serializers import Serializer
from rest_framework import fields
import re

class AsyncLoginSerializer(Serializer):
    username = fields.CharField(max_length=200)
    password = fields.CharField(min_length=6, max_length=200)

    def validate(self, attrs):
        username = attrs.get('username')
        pattern = re.compile(r'^[a-zA-Z][a-zA-Z0-9_]{4,19}$')
        if pattern.match(username):
            return attrs
        else:
            raise fields.ValidationError("用户名不符合规则！")
```

在视图函数中调用 Serializer 代码：

```py
from .serializers import AsyncLoginSerializer

class LoginView(APIView):
    async def post(self, request):
        serializer = AsyncLoginSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            print('用户名：', validated_data.get('username'))
            print('密码：', validated_data.get('password'))
            return JsonResponse({'message': "登录成功！"})
        else:
            print(serializer.errors)
            return JsonResponse({"message": '登录失败！'}, status=status.HTTP_400_BAD_REQUEST)
```

另外，adrf 也提供了 asave 、aupdate 、acreate 方法，可以重写该方法，然后在表单数据校验成功后，通过类似 await asave() 的方式保存、更新或创建新数据。

2. 将 ORM 对象转换为字典

由于将 ORM 转换为字典过程中可能会涉及到 SQL 查询（阻塞式 I/O），所以 adrf 提供了异步的用于获取转换后数据的属性 `adata` 。

这里我们以序列化用户信息为例，来说明其用法。我们创建一个 UserSerializer 类，代码如下：

```py
from adrf.serializers import Serializer, ModelSerializer
from rest_framework import fields
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(Serializer):
    username = fields.CharField(max_length=200)
    email = fields.EmailField()
    is_active = fields.BooleanField()
    is_staff = fields.BooleanField()

# 或者以下版本
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'is_active', 'is_staff'
        ]
```

接着在视图当中可以将 `Query_set` 对象转换为字典：

```py
class UserListView(APIView):
    async def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        data = await serializer.adata # 使用异步的方法，避免获取的序列化数据是嵌套的，存在再次查询数据库操作
        return JsonResponse({"users": data})
```
