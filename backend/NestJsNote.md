
# NestJs 笔记

## 0. 简单介绍

NestJs 是一个用于构建高效可扩展的一个基于 Node js 服务端 应用程序开发框架，并且完全支持 typeScript ，同时是 spring mvc 风格。

NestJs 底层是使用了 express 和 fastify ，在他们的基础上做了一层抽象，并将其 API 暴露给开发者。这样可以轻松的使用每个平台的无数第三方库。

NestJs官网：[NestJs](https://nestjs.com/)

## 1. IOC 控制反转 和 DI 依赖注入

控制反转（Inversion of Control，IoC）是面向对象编程中的一种设计原则，其中一个重要的思想是将对象的创建和依赖关系的管理交给第三方容器来管理。

依赖注入（Dependency Injection，DI）是指在对象创建时，由容器动态地将所需的依赖对象注入到对象中。

就是类似于一个管理类，然后其主要功能是添加注入进来的对象和返回需要的对象，即 get 对象和 add 对象。由于对象管理和依赖关系管理的功能都交给了第三方容器，所以称为控制反转。例子：创建A对象、B对象，然后C对象要使用A和B对象，如果下个版本对象A和B有变化，那么C对象也要跟着变代码。而如果采用依赖注入，引入一个Container类来管理对象A和对象B，那么下次修改版本仅修改对象A和B即可，而不需要修改C对象。

## 2. NestJs 前置知识 - 装饰器

装饰器，又称为注解，是一种**特殊的函数**，在NestJs中，主要有这么几类装饰器：

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

5. 考虑到每次都得敲2-4这几个命令，nest-cli 提供了一个简写命令：

以下命令会生成一个cats模块，可以选择restful api风格，然后就会生成一套标准的CURD模块。

```shell
nest g resource cats # 或者 nest g res cats
```
## 5. RESTful API 风格

首先 RESTful 是一种风格，在 RESTful 中，一切被认为是资源，并给任何资源都有对应的 URI 标识。

**传统的URL风格**：`http://test.com/user/get_list` `http://test.com/user/add_user?id=1`

**RESTful URL 风格**：`http://test.com/users/1` 然后通过不同的请求方式 `GET` `POST` `PUT` `DELETE` 来实现对资源的操作。

### 5.1 RESTful API 版本控制

在 NestJs 中，拥有三种方式去实现 RESTful API 版本控制：

1. `URI Versioning` : 版本将在请求的 URI 中体现(默认)
2. `Header Versioning` : 版本将在请求的 Header 中体现
3. `Media Type Versioning` : 版本将在请求的 Media Type 中体现

接下来将在 NestJs 中实现 `URI Versioning` 版本控制。

1. 首先需要在 `main.ts` 文件中引入 `VersioningModule` 模块。

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

2. 然后在对应的 controller 中添加 `@Version('1')` 装饰器即可，可以添加在类上面，也可以添加在方法上面。

```typescript
@Controller({
    path: 'cats',
    version: '1.0.2.1'
})
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
  @Get(':id')
  @Version('1.1.2.1')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id); // +id 类型转换从 string 到 number
  }
}
```

3. 最后在浏览器中访问 `http://localhost:3000/v1.0.2.1/cats` 或 ``http://localhost:3000/v1.1.2.1/cats/1` 即可看到返回的结果。
