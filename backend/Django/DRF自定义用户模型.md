# Django RestFramework 自定义用户模型

本文章主要介绍如何在 `Django` 中搭配 `RestFramework` 框架自定义用户模型。

## 初始化项目

```shell
uv init django-user
cd django-user
rm main.py
mkdir src/
mkdir docs/
mkdir tests/
uv add django
uv add djangorestframework
uv add django-cors-headers
uv add django-shortuuidfield
```

## 创建 Django 项目

```shell
cd src/
uv run django-admin startproject customUser
cd customUser/
uv run django-admin startapp accounts
```

## 配置 Django 项目

打开 `src/customUser/customUser/settings.py` 并修改以下代码：

```python
# src/customUser/customUser/settings.py
# 1. 安装的应用
INSTALLED_APPS = [
    # 自定义用户应用
    'rest_framework',
    'accounts',
    'corsheaders',
]

# 2. 中间件
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # 必须在 CommonMiddleware 之上
    'django.middleware.common.CommonMiddleware',
]

# 3. 设置 CORS
CORS_ALLOW_ALL_ORIGINS = True # 允许所有来源
CORS_ALLOW_CREDENTIALS = True # 允许 cookies

# 4. 将默认时区改为 Asia/Shanghai，语言代码改为 zh-hans
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
```

## 创建自定义用户模型

打开 `src/accounts/models.py` 并添加以下代码：

```python
# src/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from shortuuidfield import ShortUUIDField

class CustomUserManager(BaseUserManager):
    # 创建新用户时，必须提供邮箱和密码
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('必须设置邮箱')
        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    # 与 create_user 类似，但 is_staff 和 is_superuser 为 True
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    # 自定义用户模型
    nickname = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    uuid = ShortUUIDField(unique=True)

    # Django 默认字段
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    # 将用户名字段改为邮箱
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # 修改用户的字符串表示形式
    def __str__(self):
        return self.email
```

此外，你还需要在 `src/customUser/customUser/settings.py` 中修改 `AUTH_USER_MODEL`：

```python
AUTH_USER_MODEL = 'accounts.CustomUser'
```

额外的信息：`AbstractBaseUser` 类通常是完全自定义用户模型。如果你并不想完全自定义，只希望在 Django 默认用户模型上添加一些字段，那么你可以使用 `AbstractUser` 类，这样你所自定义的用户会保留很多默认的字段。

## 运行 Django 项目

首先运行 `uv run manage makemigrations` 生成迁移文件，然后运行 `uv run manage migrate` 迁移数据库。

接着运行 `uv run manage createsuperuser` 创建超级用户。

## 编辑管理员页面

在 `src/accounts/admin.py` 中添加以下代码：

```python
from django.contrib import admin
from .models import CustomUser

admin.site.register(CustomUser)
```

然后运行 `uv run manage runserver` 启动服务器，访问 `http://127.0.0.1:8000/admin/` 查看管理员页面。

## 编辑用户序列化器

在 `src/accounts/serializers.py` 中添加以下代码：

```python
# src/accounts/serializers.py
from rest_framework.serializers import Serializer, ModelSerializer, EmailField, CharField, ValidationError
from .models import CustomUser

class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'nickname', 'uuid', 'is_active', 'is_staff']
        # exclude = ['password', 'id']

class CustomUserLoginSerializer(Serializer):
    email = EmailField(required=True)
    password = CharField(required=True, max_length=20)

    # 重写 validate 方法
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = CustomUser.objects.filter(email=email).first() # get() 会抛出异常

            if not user:
                raise ValidationError('邮箱不正确')

            if user.check_password(password):
                attrs['user'] = user
                # return attrs
        else:
            raise ValidationError('邮箱或密码不正确')

        return attrs

class CustomUserRegisterSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']

    def validate_email(self, value):
        print('注册序列化器 validate_email 方法！')
        if CustomUser.objects.filter(email=value).exists():
            raise ValidationError('邮箱已存在')

        return value

    def create(self, validated_data):
        print('注册序列化器 create 方法！')
        email = validated_data.get('email')
        password = validated_data.get('password')

        user = CustomUser.objects.create_user(email, password)
        nickname = 'user_' + user.uuid[:6]
        user.nickname = nickname
        user.save()
        return user
```

## 编辑用户视图

在 `src/accounts/views.py` 中添加以下代码：

```python
# src/accounts/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import CustomUser

from .serializer import CustomUserSerializer, CustomUserLoginSerializer, CustomUserRegisterSerializer

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()

    serializer_class = CustomUserSerializer

class CustomLoginView(APIView):
    serializer_class = CustomUserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                'status': 'login success',
                'uuid': user.uuid,
                'nickname': user.nickname,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserRegisterViewSet(APIView):

    serializer_class = CustomUserRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'register success'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## 编辑用户路由

在 `src/accounts/urls.py` 中添加以下代码：

```python
# src/accounts/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CustomUserViewSet, CustomLoginView, CustomUserRegisterViewSet

app_name = 'accounts'

router = DefaultRouter()
router.register('users', CustomUserViewSet, basename='users')

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('register/', CustomUserRegisterViewSet.as_view(), name='register'),
] + router.urls
```

不要忘记将 `accounts` 的路由添加到 `src/customUser/customUser/urls.py` 中:

```python
# src/customUser/customUser/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
]
```

## 测试接口

1. 测试注册 api

使用 `post` 方法请求 `http://127.0.0.1:8000/accounts/register/`，数据如下:

```json
{
  "email": "<EMAIL>",
  "password": "<PASSWORD>"
}
```

2. 测试登录 api

使用 `post` 方法请求 `http://127.0.0.1:8000/accounts/login/`，数据如下:

```json
{
  "email": "<EMAIL>",
  "password": "<PASSWORD>"
}
```

3. 测试用户 api

使用 `get` `http://127.0.0.1:8000/accounts/users/` 获取所有用户.
