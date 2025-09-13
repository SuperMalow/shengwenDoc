# Django RestFramework 快速实现自定义用户模型 + JWT 认证

本文章主要介绍如何在 `Django` 中搭配 `djangorestframework-simplejwt` 快速实现自定义用户模型和 JWT 认证。

## 初始化项目

```shell
uv init django-user
cd django-user
rm main.py
mkdir src/
mkdir docs/
uv add django
uv add djangorestframework
uv add djangorestframework-simplejwt
uv add django-cors-headers
uv add django-shortuuidfield
```

## 创建 django 项目

```shell
cd src/
uv run django-admin startproject jwtAuth
cd jwtAuth/
uv run django-admin startapp accounts
```

## 配置 django 项目

打开 `src/jwtAuth/jwtAuth/settings.py` 并修改以下代码：

```python
# src/jwtAuth/jwtAuth/settings.py
# 1. 安装的应用
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', # 用于刷新令牌时将旧的令牌加入黑名单
    'accounts',
    'corsheaders',
]

# 2. 中间件
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # 在 CommonMiddleware 之上
    "django.middleware.common.CommonMiddleware",
    # ...
]

# 3. 配置 CORS
CORS_ALLOW_ALL_ORIGINS = True # 允许所有来源
CORS_ALLOW_CREDENTIALS = True # 允许 cookies

# 4. 将默认时区改为 Asia/Shanghai，语言代码改为 zh-hans
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'

# *5. restframework 认证配置
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# *6. 配置jwt
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),  # Access Token的有效期
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh Token的有效期
    ########### 对于大部分情况，设置以上两项就可以了，以下为默认配置项目，可根据需要进行调整 ############
    # 是否自动刷新Refresh Token
    'ROTATE_REFRESH_TOKENS': False,
    # 刷新Refresh Token时是否将旧Token加入黑名单，如果设置为False，则旧的刷新令牌仍然可以用于获取新的访问令牌。需要将'rest_framework_simplejwt.token_blacklist'加入到'INSTALLED_APPS'的配置中
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',  # 加密算法
    'SIGNING_KEY': SECRET_KEY,  # 签名密匙，这里使用Django的SECRET_KEY

    # 如为True，则在每次使用访问令牌进行身份验证时，更新用户最后登录时间
    "UPDATE_LAST_LOGIN": False,
    # 用于验证JWT签名的密钥返回的内容。可以是字符串形式的密钥，也可以是一个字典。
    "VERIFYING_KEY": "",
    "AUDIENCE": None,# JWT中的"Audience"声明,用于指定该JWT的预期接收者。
    "ISSUER": None, # JWT中的"Issuer"声明，用于指定该JWT的发行者。
    "JSON_ENCODER": None, # 用于序列化JWT负载的JSON编码器。默认为Django的JSON编码器。
    "JWK_URL": None, # 包含公钥的URL，用于验证JWT签名。
    "LEEWAY": 0, # 允许的时钟偏差量，以秒为单位。用于在验证JWT的过期时间和生效时间时考虑时钟偏差。

    # 用于指定JWT在HTTP请求头中使用的身份验证方案。默认为"Bearer"
    "AUTH_HEADER_TYPES": ("Bearer",),
    # 包含JWT的HTTP请求头的名称。默认为"HTTP_AUTHORIZATION"
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
     # 用户模型中用作用户ID的字段。默认为"id"。
    "USER_ID_FIELD": "uuid",
     # JWT负载中包含用户ID的声明。默认为"user_id"。
    "USER_ID_CLAIM": "user_id",

    # 用于指定用户身份验证规则的函数或方法。默认使用Django的默认身份验证方法进行身份验证。
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    #  用于指定可以使用的令牌类。默认为"rest_framework_simplejwt.tokens.AccessToken"。
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    # JWT负载中包含令牌类型的声明。默认为"token_type"。
    "TOKEN_TYPE_CLAIM": "token_type",
    # 用于指定可以使用的用户模型类。默认为"rest_framework_simplejwt.models.TokenUser"。
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    # JWT负载中包含JWT ID的声明。默认为"jti"。
    "JTI_CLAIM": "jti",
    # 在使用滑动令牌时，JWT负载中包含刷新令牌过期时间的声明。默认为"refresh_exp"。
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    # 滑动令牌的生命周期。默认为5分钟。
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    # 滑动令牌可以用于刷新的时间段。默认为1天。
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    # 用于生成访问令牌和刷新令牌的序列化器。
    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    # 用于刷新访问令牌的序列化器。默认
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    # 用于验证令牌的序列化器。
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    # 用于列出或撤销已失效JWT的序列化器。
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    # 用于生成滑动令牌的序列化器。
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    # 用于刷新滑动令牌的序列化器。
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}
```

## 创建自定义用户模型

在 `src/accounts/models.py` 中添加以下代码：

```python
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, UserManager

from shortuuidfield import ShortUUIDField

# CustomUserManager
class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

# CustomUser
class CustomUser(AbstractBaseUser, PermissionsMixin):
    uuid = ShortUUIDField(unique=True, primary_key=True, max_length=16)
    email = models.EmailField(unique=True)
    nikenmae = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户管理'

    def __str__(self):
        return self.email

# CustomUserProfile
class CustomUserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(null=True, blank=True, default='这个人很懒，什么都没有留下')
    gender = models.CharField(max_length=10, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        verbose_name = '用户资料'
        verbose_name_plural = '用户资料管理'

    def __str__(self):
        return self.user.email
```

不要忘记在 `src/jwtAuth/settings.py` 中修改 `AUTH_USER_MODEL`：

```python
# src/jwtAuth/jwtAuth/settings.py
AUTH_USER_MODEL = 'accounts.CustomUser'
```

## 创建自定义用户序列化器

在 `src/accounts/serializers.py` 中添加以下代码：

```python
from .models import CustomUser, CustomUserProfile
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):

    profile = serializers.SerializerMethodField()

    def get_profile(self, obj):
        if hasattr(obj, 'profile') and obj.profile:
            return CustomUserProfileSerializer(obj.profile).data
        return None

    class Meta:
        model = CustomUser
        fields = ['uuid', 'nikenmae', 'email', 'is_active', 'profile']
        # fields = '__all__'

class CustomUserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUserProfile
        fields = ['bio', 'gender', 'birth_date', 'address', 'phone']
        # fields = '__all__'

class CustomUserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, max_length=20)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = CustomUser.objects.filter(email=email).first()
            if not user:
                raise serializers.ValidationError('User does not exist')

            if user.check_password(password):
                attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password are required')

        return attrs

class CustomUserRegisterSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, max_length=20)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = CustomUser.objects.filter(email=email).first()
            if user:
                raise serializers.ValidationError('User already exists')
        else:
            raise serializers.ValidationError('Email and password are required')

        return attrs

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')

        print('将要创建的用户 ---> email: {%s}, password: {%s}', email, password)

        user = CustomUser.objects.create_user(email, password)

        # 自动设置nickname
        nickname = user.uuid[:12]
        print("将要设置的nickname ---> ", nickname)
        user.nikenmae = '用户_' + nickname
        user.save()
        print("user 保存成功")
        return user
```

## 创建自定义用户视图

在 `src/accounts/views.py` 中添加以下代码：

```python
from .models import CustomUser, CustomUserProfile
from .serializer import CustomUserSerializer, CustomUserProfileSerializer, CustomUserLoginSerializer, CustomUserRegisterSerializer

from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]

class CustomUserProfileViewSet(ModelViewSet):
    queryset = CustomUserProfile.objects.all()
    serializer_class = CustomUserProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

class CustomUserLoginView(APIView):
    serializer_class = CustomUserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = 'test-token'
            return Response({'token': token, 'user': CustomUserSerializer(user).data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserRegisterView(APIView):
    serializer_class = CustomUserRegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            print('创建成功 --> ', str(user))
            # 创建profile
            profile = CustomUserProfile.objects.create(user=user)
            profile.save()
            print('创建成功 --> ', str(profile))
            user.profile = profile
            user.save()
            print("保存成功")
            return Response({'status': 'ok', 'user': str(user)}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## 创建自定义用户路由

在 `src/accounts/urls.py` 中添加以下代码：

```python
# src/accounts/urls.py
from django.urls import path
from .views import CustomUserViewSet, CustomUserProfileViewSet, CustomUserLoginView, CustomUserRegisterView

from rest_framework import routers

app_name = 'accounts'

routers = routers.DefaultRouter()
routers.register('users', CustomUserViewSet)
routers.register('profiles', CustomUserProfileViewSet)

urlpatterns = [
    path('login/', CustomUserLoginView.as_view(), name='login'),
    path('register/', CustomUserRegisterView.as_view(), name='register'),
] + routers.urls
```

不要忘记在 `src/jwtAuth/urls.py` 中添加 `src/accounts/urls.py` 的路由，同时添加 `simple-jwt` 的路由：

```python
# src/jwtAuth/urls.py
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/', include('accounts.urls')),
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # 下面这个是用来验证token的 返回200正确，401错误
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), # 测试完可以删除
]
```

## \* 创建自定义管理页面

在 `src/accounts/admin.py` 中添加以下代码：

```python
from django.contrib import admin
from .models import CustomUser, CustomUserProfile

class CustomUserProfileInline(admin.StackedInline):
    model = CustomUserProfile

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'nikenmae', 'uuid', 'is_active')
    fields = ('email', 'nikenmae', 'is_active', 'is_staff')
    inlines = [CustomUserProfileInline]

class CustomProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'gender', 'birth_date', 'address', 'phone')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(CustomUserProfile, CustomProfileAdmin)
```

## \* 解决 token 过期后导致存储信息过大的问题

由于使用到了 `rest_framework_simplejwt.token_blacklist`。`Simple-JWT` 会将生成的 access token 和 refresh token 加入到未完成令牌列表当中。同时还会检查任何 access token 和 refresh token 是否出现在令牌黑名单中。

可以通过以下代码来实现一个简单的令牌黑名单，添加 `refresh` 的 `body` 属性数据即可：

```python
# src/jwtAuth/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
]
```

同时，`rest_framework_simplejwt.token_blacklist` 还提供了一个额外的命令：`uv run manage.py flushexpiredtokens`，用于删除已过期的`refresh`令牌。官方文档的建议是启动一个 `corntab` 每天定时执行一次这个命令。例：`crontab -e`，然后添加 `0 4 * * * cd /project/src/jwtauth && uv run manage.py flushexpiredtokens >> /var/log/token_cleanup.log 2>&1`，作用是每天凌晨的 4 点执行一次命令。
