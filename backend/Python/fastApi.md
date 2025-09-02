# FastApi

FastAPI 是一个高性能的 Python Web 框架，旨在为开发人员提供快速、简洁且强大的 API 开发体验。

目前 Python 主流的 web 框架是：Django、Flask、FastAPI，其中 Django 开发效率是最高的，但是不得不承认 FastAPI 的性能是最高的，而且 FastAPI 是支持异步编程的。

## FastAPI 安装

```bash
pip install fastapi
```

## FastAPI quickstart

一个最简单的 FastAPI 程序：

```py
# main.py
from typing import Optional
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
async def read_root():
    return {"message": "Hello World"}
@app.get('/items/{item_id}')
async def read_item(item_id: int, query: Optional[str] = None):
    return {'item_id': item_id, 'query': query}
```

**运行项目：**

```shell
fastapi dev main.py

# 如果是在生产环境当中
fastapi run
```

**通过 Uvicorn 运行项目：**

uvicorn 是一个高性能的异步 web 服务器。我们也可以使用 uvicorn 来直接运行 FastAPI 项目。首先需要安装：

```shell
$ pip install 'uvicorn[standard]'
```

接着可以通过：

```shell
uvicorn main:app --reload
```

**修改项目的 host 和 port：**

不管是使用 uvicorn 还是 fastapi dev，都可以通过 `--host` 和 `--port` 来修改 host 和 port。

## Python 类型提示

首先 Python 是动态类型语言，但是 FastAPI 为了程序的安全考虑，它严格要求使用类型定义。类型提示主要是在函数定义当中，指定形参的数据类型，以及返回值的数据类型。

**语法：**

```py
# 变量语法
uername: str = 'zhangsan'
# 函数语法
def say_hello(name: str) -> str:
    return f'hello {name}'
```

以上就是 Python 的类型提示语法，其中 `:` 后面跟的是类型，`->` 后面跟的是返回值类型。变量与函数是较为常用的类型提示。

## Python 类型提示检查第三方库

这里推荐一个 Python 类型提示检查的第三方库：`mypy`

```shell
pip install mypy
```

使用起来也是非常简单：

```shell
# 检查 main.py 文件
mypy main.py
# 检查多个文件
mypy main.py test.py
# 检查当前项目下的文件
mypy project/
```

### 类似提示 - 数据类型

1. 基本数据类型

基本数据类型有：`int`、`str`、`float`、`bool`等。

2. 容器类型

容器类型有：`List`、`Tuple`、`Set`、`Dict`等。

```py
from typing import List, Tuple, Set, Dict
# List
name: List[str] = ['zhangsan', 'lisi']
# Tuple
name: Tuple[str, int] = ('zhangsan', 18)
# Set 类似去重的list
name: Set[str] = {'zhangsan', 'lisi'}
# Dict
name: Dict[str, int] = {'zhangsan': 18, 'lisi': 19}
```

3. Union 和 Optional

Union 类型可以在定义变量时指定多种数据类型：

```py
# 以下两种写法是等价的 即可以是 str 也可以是 int
name: Union[str, int] = 'zhangsan'
name: Union[str, int] = 18

# 上面的代码也可以用以下的写法
name: int | str  = 'zhangsan'
name: int | str  = 18

# Union 同样可以用于容器类型当中 以下两种写法是等价的
name: List[Union[str, int]] = ['zhangsan', 18]
name: List[str | int] = ['zhangsan', 18]
```

Optional 类型是可选类型，表示改变量的值可以为 `None` ：

```py
# Optional可以是 int 和 None
x: Optional[int] = 1
x: Optional[int] = None

# Optional 同样可以使用 Union 来实现
x: Union[int, None] = 1
x: Union[int, None] = None

# 同理
x: int | None = 1
x: int | None = None
```

4. Any 类型

`Any` 类型表示任意类型，可以赋值任意类型的值：

```py
a: Any = 1
a: Any = 'zhangsan'
a: Any = [1, 2, 3]
```

5. type 别名

首先 `type` 是 python 在 3.12 新增的一个关键字。可以针对常用的数据类型进行起别名操作。

```py
from typing import List

# type 定义别名
type StrList = List[str]
# 如果mypy报错 也可以使用以下方式
StrList = List[str]
name: StrList = ['zhangsan', 'lisi']
```

## Pydantic

官网：[Pydantic](https://docs.pydantic.dev/latest/)

在其他 web 框架中，比如 Django 或 Flask，都有相应的表单类用来校验前端上传的数据是否合法。在 FastAPI 中则是通过 Pydantic 来实现的。

1. Pydantic 安装

通过以下命令进行安装，如果已经安装了 FastAPI 则不需要安装，其已经内置了：

```shell
pip install pydantic
```

2. Pydantic 基本使用

`Pydantic` 是通过定义模型，以及在模型中指定字段来对值进行校验的。

```py
from datetime import date
from pydantic import BaseModel
from typing import List

class User(BaseModel):
    id: int
    username: str = 'zhangsan'
    create_time: date | None
    hobits: List[str]

test_data = {
    'id': 1,
    'username': 'lisi',
    'create_time': '2022-01-01',
    'hobits': ['coding', 'reading']
}

user = User(**test_data)
print(user)
```

如果传入的 `User` 模型的字段的值不满足要求，那么代码就会出现报错，可以通过以下方式来进行捕获：

```py
from pydantic import ValidationError
try:
    test_data = {
        'id': '1a',
        'username': 'lisi',
        'create_time': '2022-01-01',
        'hobits': ['coding', 'reading']
    }
    user = User(**test_data)
except ValidationError as e:
    print(e.errors())
```

## 请求数据

前端可以通过，`路由参数`、`body 参数`、`Cookie`、`header` 参数等方式向服务器发送数据，以下讲解 FastAPI 如何接收这些数据。

### 路由参数

1. 路径参数

路径参数是在路由上定义好的，使用`{}`来定义，比如：

```py
@app.get('/user/{id}')
async def get_user(id: int):
    return {'id': id}
```

如果想要对路径参数进行校验，可以使用 `fastapi.Path` 来实现：

```py
@app.get('/user/{id}')
async def get_user(id: int = Path(..., ge=1, le=100)): # id必须大于等于1 小于等于100
    return {'id': id}
```

2. 查询参数

查询参数无须在定义路由的时候指定，而是通过 `?key=value` 的形式进行拼接。由于查询参数前端有可能没有传递，因此查询参数通常会定义默认值，而如果没有指定默认值，那么就意味着这个查询参数是必传的。

```py
@app.get('/user')
async def get_user(name: str = 'zhangsan'): # localhost:8000/user?name=lisi
    return {'name': name}
```

另外，如果 name 是未设置默认参数，那么在访问的时候就必须传递 `name` 参数，否则会报错。

同样的，也可以对查询参数进行校验，通过 `fastapi.Query` 来实现：

```py
@app.get('/user')
async def get_user(name: str = Query(min_length=1, max_length=10))
    return {'name': name}
```

### Body 参数

1. 基本使用

如果需要获取通过 `Body` 的形式传递的参数，那么需要使用 `pypandtic` 先定义一个包含要传递过来的参数的模型：

```py
from pydantic import BaseModel

class item(BaseModel):
    name: str
    age: int
    description: str | None = None

@app.put("/items/{item_id}")
async def read_item(item_id: int, item: item):
    return {'item_id': item_id, 'item': item}
```

2. 验证逻辑

可以使用 `pydantic` 来定义模型，还可以使用 `pydantic` 的 `Field` 来简单的验证模型逻辑。此外还可以通过 `field_validator` 装饰器来实现自定义的验证逻辑。

```py
from pydantic import BaseModel, Field, field_validator

class item(BaseModel):
    name: str
    age: int
    description: str | None = None
    price: float = Field(gt=0, le=10) # 通过Field来简单的验证数据

    @field_validator('name')
    @classmethod # 验证器方法必须为类方法
    def validator_name(cls, value: str) -> str: # 方法名为随意
        if len(value) < 3:
            raise ValueError('name must be at least 3 characters')
        return value
```

### Cookie 上的参数

想要获取 Cookie 上的参数，只需要在视图函数上使用 `fastapi.Cookie` 来进行声明即可：

```py
from fastapi import Cookie

@app.get('/cookie/get')
async def get_cookie(username: str = Cookie(None)):
    return {'username': username}
```

以上代码是获取前端传入的 `cookie` 中的 `username` 参数，如果前端没有传入 `username` 参数，那么 `username` 的值就是 `None`。

```py
@app.get('/cookie/set')
async def set_cookie():
    response = JSONResponse(content={'username': 'admin'})
    response.set_cookie(key='username', value='admin', max_age=3600)
    return response
```

以上代码是设置 `cookie` 并返回到前端当中

### Header 上的参数

如果想要获取 `header` 上的参数，只需要在视图函数上使用 `fastapi.Header` 来进行声明即可：

```py
from fastapi import Header

@app.get('/header/get')
async def get_header(
    Host: str = Header(default=None),
    User_Agent: str = Header(default=None),
    Accept: str = Header(default=None)
):
    return {'Host': Host, 'User_Agent': User_Agent, 'Accept': Accept}
```

由于请求头中的字段通常用-来拼接单词，而获取数据则将 `-` 转换为 `_`，并将字母全部变为小写。比如 `User-Agent` 在获取参数时是通过 `user_agent` 来获取的。

## 依赖注入

在 `fastapi` 中，依赖注入可以让我们的视图函数在执行之前，先执行一段逻辑代码，这端逻辑代码可以返回新的值给视图函数。
通常在以下场景，可以使用到依赖注入：

- 复用相同的代码逻辑
- 共享数据库连接
- 实现安全、验证、权限

总之就是将一些重复性代码，单独写成依赖，然后在视图函数当中注入这个依赖：

```py
from fastapi import Depends
from typing import Dict

async def common(q:str | None = None, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items")
async def get_items(query: Dict = Depends(common)):
    return query

@app.get('/books')
async def get_books(query: Dict = Depends(common)):
    return query
```

在上述代码中，可以看到 `/items` 和 `/books` 都是获取列表的，都需要获取 `q`、`skip` 以及 `limit` 参数，如果在每个视图函数上都写一遍，那么将有很多重复性的代码，这里我们就可以把获取数据的代码单独抽取成一个函数，然后再在每个视图函数上使用 `Depends` 进行依赖注入。

### 类依赖项

除了使用上诉的函数依赖注入，还可以使用类依赖注入，使用类依赖注入，可以很方便的实现依赖注入的复用。

```py
class CommonQueryParam:
    def __init__(self, q:str | None = None, skip: int = 0, limit: int = 10):
        self.q = q
        self.skip = skip
        self.limit = limit

    def get_query(self):
        return {"q": self.q}

@app.get('/users')
async def get_users(common: CommonQueryParam = Depends(), skip: int = 12):
    common_data = {
        "q": common.q,
        "skip": common.skip,
        "limit": common.limit,
        "other_skip": skip # skip 会重复从Common中获取出来
    }
    print(common.get_query())
    return common_data
```

### 子依赖项

一个依赖项可以依赖于另一个依赖项，可以嵌套依赖：

```py
from fastapi import Depends
from typing import Dict

def query_1(q1: str | None = None):
    return {"q1": q1}

def query_2(q2: str = Depends(query_1), last_query: str | None = None):
    return {"q2": q2, "last_query": last_query}

@app.get("/users")
async def read_users(common: Dict = Depends(query_2)):
    return common
```

### 视图装饰器依赖项

有时，我们并不需要在路径操作函数中使用依赖项的返回值。或者说，有些依赖项不返回值。但仍要执行或解析该依赖项。对于这种情况，不必在声明路径操作函数的参数时使用 `Depends`，而是可以在路径操作装饰器中添加一个由 `dependencies` 组成的 `list`。示例代码如下：

```py
from fastapi import Depends, FastAPI, Header, HTTPException
app = FastAPI()
async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")

async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key

@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

### 全局依赖

有时，我们需要为整个项目都添加依赖，那么可以在创建 `FastAPI` 的时候就指定，示例代码如下：

```py
from fastapi import Depends, FastAPI, Header, HTTPException


async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: str = Header()):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])


@app.get("/items/")
async def read_items():
    return [{"item": "Portal Gun"}, {"item": "Plumbus"}]


@app.get("/users/")
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]
```

### 模块依赖

在 `FastAPI` 中，可以使用 `APIRouter` 来为路由分模块（与 Flask 中的蓝图类似），那如何为子模块添加依赖项呢，看以下示例代码：

```py
from fastapi import APIRouter, Depends, HTTPException

from ..dependencies import get_token_header

router = APIRouter(
    prefix="/items",
    tags=["items"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)

fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}

@router.get("/")
async def read_items():
    return fake_items_db

@router.get("/{item_id}")
async def read_item(item_id: str):
    if item_id not in fake_items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"name": fake_items_db[item_id]["name"], "item_id": item_id}

@router.put(
    "/{item_id}",
    tags=["custom"],
    responses={403: {"description": "Operation forbidden"}},
)
async def update_item(item_id: str):
    if item_id != "plumbus":
        raise HTTPException(
            status_code=403, detail="You can only update the item: plumbus"
        )
    return {"item_id": item_id, "name": "The great Plumbus"}
```

## APIRouter

在 `FastAPI` 项目中，我们不可能把所有视图的代码都放到 `main.py` 文件中，这时候就需要将视图进行分类，然后同类的放到一个单独的子路由下。在 `FastAPI` 中可以使用 `APIRouter` 类来实现。

以下是一个简单的示例：
其中 `routers` 目录下存在 `books` 和 `items` 两个目录，其目录下两个文件分别为以下：

`router/books` 目录下的 `books.py` 文件：

```py
# router/books/books.py
from fastapi import APIRouter
router = APIRouter(prefix="/books", tags=["books"])
@router.get('/list')
async def list_books():
    books = [
        {
            "id": 1,
            "title": "The Great Gatsby",
            "author": "i don't know",
            "year": 1925
        },
        {
            "id": 2,
            "title": "The Great Gatsby",
            "author": "i don't know",
            "year": 1925
        },
    ]
    return {"books": books}
```

`router/items` 目录下的 `items.py` 文件：

```py
# router/items/items.py
from fastapi import APIRouter
router = APIRouter(prefix="/items", tags=["items"])
@router.get('/items')
async def list_items():
    items = [
        {
            "id": 1,
            "name": "item 1",
            "price": 100,
        },
        {
            "id": 2,
            "name": "item 2",
            "price": 200,
        },
    ]
    return {"items": items}
```

主项目文件 `main.py`：

```py
# main.py
from fastapi import FastAPI
from routers.books import books
from routers.items import items

app = FastAPI()

app.include_router(items.router)
app.include_router(books.router)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
```

## 未完待续...
