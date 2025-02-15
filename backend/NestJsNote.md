# NestJs 笔记

## 0. 简单介绍

NestJs 是一个用于构建高效可扩展的一个基于 Node js 服务端 应用程序开发框架，并且完全支持 typeScript ，同时是 spring mvc 风格。

NestJs 底层是使用了 express 和 fastify ，在他们的基础上做了一层抽象，并将其 API 暴露给开发者。这样可以轻松的使用每个平台的无数第三方库。

NestJs 官网：[NestJs](https://nestjs.com/)

## 1. 基本概念

### 1.1 AOP 面向切面编程

正常的一个HTTP请求，流程应该是: `请求` -> `Controller` -> `Service` -> `DB`，这个流程是最简单的一个HTTP请求过程。假设我想在这个过程中添加一个日志功能，那么最好的方式就是在请求后 Controller 之前添加一个日志功能模块，即流程变为: `请求` -> `日志模块` -> `Controller` -> `Service` -> `DB`，这样就实现了日志功能的添加。当然一个大型项目往往不止是一个日志模块的添加，还会拥有过滤、拦截等模块。那么如果还按照刚刚哪种方法来实现，那么整个流程会变得非常的复杂，耦合性很高。所以通常会将刚刚流程中的日志模块抽象成一个切面(即某个模块一并管理)，然后在整个流程中都使用这个切面，这样就实现了 AOP 面向切面编程。

那么在NestJs中，AOP 的应用主要为：中间件、守卫、拦截器、管道、过滤器等。

### 1.2 IOC 控制反转 和 DI 依赖注入

控制反转（Inversion of Control，IoC）是面向对象编程中的一种设计原则，其中一个重要的思想是将对象的创建和依赖关系的管理交给第三方容器来管理。

依赖注入（Dependency Injection，DI）是指在对象创建时，由容器动态地将所需的依赖对象注入到对象中。

就是类似于一个管理类，然后其主要功能是添加注入进来的对象和返回需要的对象，即 get 对象和 add 对象。由于对象管理和依赖关系管理的功能都交给了第三方容器，所以称为控制反转。例子：创建 A 对象、B 对象，然后 C 对象要使用 A 和 B 对象，如果下个版本对象 A 和 B 有变化，那么 C 对象也要跟着变代码。而如果采用依赖注入，引入一个 Container 类来管理对象 A 和对象 B，那么下次修改版本仅修改对象 A 和 B 即可，而不需要修改 C 对象。

## 2. NestJs 前置知识 - 装饰器

装饰器，又称为注解，是一种**特殊的函数**，在 NestJs 中，主要有这么几类装饰器：

- 类装饰器：主要在类的上面进行装饰，会把类进行传入。
- 方法装饰器：主要在方法上面进行装饰，会把方法进行传入。
- 参数装饰器：主要在方法参数上面进行装饰，会把方法参数进行传入。
- 属性装饰器：主要在类的属性上面进行装饰，会把类的属性进行传入。

## 3. NestJs CLI 创建项目

首先需要安装 NestJs 提供的脚手架工具，NestJs 脚手架是用来快速搭建一个 NestJs 项目的命令行工具。

1. 安装 nestjs-cli

```shell
npm install -g @nestjs/cli
```

2. 创建项目

```shell
nest new project-name
```

3. 启动项目

```shell
cd project-name
npm run start:dev
```

## 4. NestJs CLI 常用命令

1. 查看 NestJs 所有命令：

```shell
nest --help
```

2. 生成 controller:

```shell
nest g controller cats # 或者 nest g co cats
```

3. 生成 service:

```shell
nest g service cats # 或者 nest g s cats
```

4. 生成 module:

```shell
nest g module cats # 或者 nest g mo cats
```

5. 考虑到每次都得敲 2-4 这几个命令，nest-cli 提供了一个简写命令：

以下命令会生成一个 cats 模块，可以选择 restful api 风格，然后就会生成一套标准的 CURD 模块。

```shell
nest g resource cats # 或者 nest g res cats
```

## 5. RESTful API 风格

首先 RESTful 是一种风格，在 RESTful 中，一切被认为是资源，并给任何资源都有对应的 URI 标识。

**传统的 URL 风格**：`http://test.com/user/get_list` `http://test.com/user/add_user?id=1`

**RESTful URL 风格**：`http://test.com/users/1` 然后通过不同的请求方式 `GET` `POST` `PUT` `DELETE` 来实现对资源的操作。

### 5.1 RESTful API 版本控制

在 NestJs 中，拥有三种方式去实现 RESTful API 版本控制：

1. `URI Versioning` : 版本将在请求的 URI 中体现(默认)
2. `Header Versioning` : 版本将在请求的 Header 中体现
3. `Media Type Versioning` : 版本将在请求的 Media Type 中体现

接下来将在 NestJs 中实现 `URI Versioning` 版本控制。

1. 首先需要在 `main.ts` 文件中引入 `VersioningModule` 模块。

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

2. 然后在对应的 controller 中添加 `@Version('1')` 装饰器即可，可以添加在类上面，也可以添加在方法上面。

```typescript
@Controller({
  path: "cats",
  version: "1.0.2.1",
})
export class CatsController {
  @Get()
  findAll() {
    return "This action returns all cats";
  }
  @Get(":id")
  @Version("1.1.2.1")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id); // +id 类型转换从 string 到 number
  }
}
```

3. 最后在浏览器中访问 `http://localhost:3000/v1.0.2.1/cats` 或 ``http://localhost:3000/v1.1.2.1/cats/1` 即可看到返回的结果。

## 6. NestJs 装饰器

### 6.1 Contronller Request (获取前端传来的参数)

| 装饰器                    | 作用              |
| ------------------------- | ----------------- |
| `@Request()`              | 获取请求对象      |
| `@Response()`             | 获取响应对象      |
| `@Next()`                 | 获取下一个中间件  |
| `@Session()`              | 获取 session 对象 |
| `@Param(key?: string)`    | 获取请求参数      |
| `@Body(key?: string)`     | 获取请求体参数    |
| `@Query(key?: string)`    | 获取查询参数      |
| `@Headers(name: string)`  | 获取请求头参数    |
| `@HttpCode(code: number)` | 设置 HTTP 状态码  |

#### 1. @Request() 获取请求对象

```typescript
@Get()
findAll(@Request() req) {
  console.log(req);
  // 会打印出请求对象，包含请求头、请求参数、请求体等信息
}
```

#### 2. @Response() 获取响应对象

```typescript
@Get()
findAll(@Response() res) {
  console.log(res);
  // 会打印出响应对象，包含响应头、响应状态码等信息
}
```

#### 3. @Query(key?: string) 获取查询参数

```typescript
@Get()
findAll(@Query() query) {
  console.log(query);
  // 会打印出查询参数对象，例如：{ id: 1, name: '张三' }
}
```

#### 4. @Param(key?: string) 获取请求参数

```typescript
@Get(":id")
findOne(@Param() params) {
  console.log(params);
  // 会打印出请求参数对象，例如：{ id: 1 }
}
```

#### 5. @Body(key?: string) 获取请求体参数

```typescript
@Post()
create(@Body() body) {
  console.log(body);
  // 会打印出请求体参数对象，例如：{ name: '张三', age: 20 }
}
```

#### 6. @Headers(name: string) 获取请求头参数

```typescript
@Get()
findAll(@Headers("user-agent") userAgent) {
  console.log(userAgent);
  // 会打印出请求头参数，例如：Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36
}
```

#### 7. @HttpCode(code: number) 设置 HTTP 状态码

```typescript
@Get()
@HttpCode(404)
findAll() {
  // 设置 HTTP 状态码为 404，即找不到资源
}
```

#### 8. @Session() 获取 session 对象

```typescript
@Get()
findAll(@Session() session) {
  console.log(session);
  // 会打印出 session 对象，例如：{ userId: 1 }
}
```

#### 9. @Next() 获取下一个中间件

```typescript
@Get()
@UseInterceptors(LoggerInterceptor)
findAll(@Next() next) {
  console.log(next);
  // 会打印出下一个中间件，例如：{ handle: [Function: bound handle] }
}
```

### 6.2 @Post() @Put() @Patch() @Delete() @Get()

| 装饰器      | 作用             |
| ----------- | ---------------- |
| `@Post()`   | 处理 POST 请求   |
| `@Put()`    | 处理 PUT 请求    |
| `@Patch()`  | 处理 PATCH 请求  |
| `@Delete()` | 处理 DELETE 请求 |
| `@Get()`    | 处理 GET 请求    |

这里稍微提一下 Pathch 请求，Patch 请求是对 PUT 请求的补充，它可以只更新部分字段，而不用全部更新。

样例:

```typescript
// Controller('test')
// localhost:3000/test/cats
@Get('/cats')
findAll() {
  return "This action returns all cats";
}

@Post('/cats')
create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
  return "This action adds a new cat";
}

@Put('/cats/:id')
update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
  this.catsService.update(id, updateCatDto);
  return `This action updates a #${id} cat`;
}

@Patch('/cats/:id')
updatePartial(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
  this.catsService.updatePartial(id, updateCatDto);
  return `This action updates a #${id} cat partially`;
}

@Delete('/cats/:id')
remove(@Param('id') id: string) {
  this.catsService.remove(id);
  return `This action removes a #${id} cat`;
}
```

## 6.3 NestJs Session

Session 是服务器为每一个用户的浏览器创建的一个会话对象，可以用来存储用户的登录信息等，而这个 session 会存储到浏览器的 cookie 中用来区分不同的用户。

由于我们使用的 NestJs 默认框架为 express，所以 NestJs 也是支持 express 的插件的。故我们可以安装 express-session 插件来实现 NestJs 的 Session。

1. 安装 express-session 插件

```shell
npm install express-session --save
```

2. 安装 express-session 类型定义文件

```shell
npm install @types/express-session -D
```

3. 在 `main.ts` 文件中引入 `SessionModule` 模块

```typescript
import * as session for "express-session";

app.use(session());
```

那么通过以上的简单三步即可使用 NestJs 的 Session 功能。

### NestJs Session 配置

| Session 配置参数    | 作用                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `secret`            | 生成 session id 的字符串，用来对 session 数据进行加密                                          |
| `name`              | 设置 session 的 cookie 名称，默认为 `connect.sid`                                              |
| `cookie`            | 设置返回到前端 key 的属性 默认值为`{ path: '/', httpOnly: true, secure: false, maxAge: undefined }` |
| `rolling`           | 设置是否每次响应时更新 session 的 cookie，默认为 `false`                                       |
| `store`             | 设置 session 存储的位置，默认为内存存储                                                        |
| `saveUninitialized` | 设置是否保存未初始化的 session，默认为 `true`                                                  |
| `resave`            | 设置是否每次请求都重新保存 session，默认为 `false`                                             |


```typescript
import * as session from "express-session";

app.use(
  session({ secret: "sw", name: "sw-session", rolling: true, cookie: { maxAge: undefined } })
);
```

### Session 验证码样例

原理：验证码的生成写成一个接口，然后前端通过请求该接口获取验证吗，后端生成验证码后将验证码存储到session中发给前端，前端将session存储到cokkie中，然后当用户提交完成后将输入的验证码和session一块传给后端，后端从session中取出一开始在后端生成的验证码与输入的验证码进行比对判断是否正确。

(目前主流的验证码方案：Token化方案JWT)

```typescript

```

---

3小时 nest js 入门视频: [nesjt js](https://youtu.be/8_X0nSrzrCw?si=NT3rnciSyEmFGeKx)


## 模块化概念

### 共享模块

假设存在这样的需求，Order模块需要依赖User模块中的UserService。这时可以将UserService添加到UserModule的exports中，使之成为共享服务。这样，Order模块只需导入UserModule即可访问UserService。

user模块:
```typescript
//user.module.ts
@Module({
  exports: [UserService], // 添加这行user成为共享模块
})
```

order模块:
```typescript
//order.module.ts
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  constructor(private readonly userService: UserService) { }

  findAll() {
    let username = this.userService.findOne(1);
    return `oder of ${username}`;
  }
}
```

### 全局模块

当一个模块全局中都能够用到的时候可以将其设置为全局模块。这样其他模块就不需要进行import导入，但是还是需要在构造函数中进行注入使用。直接在Module中添加@Global()装饰器即可。

```typescript
//user.module.ts
@Global()
@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
})
```





