# DOCS

## netst cli

```shell
npm install -g @Nest/cli
```

- nest new : 创建新项目
- nest build : 构建生产环境项目
- nest start : 启动项目
- nest info : 查看当前项目的Nest包信息
- nest add : 添加官方插件或第三方模块
- nest generate : 生成模块、控制器、服务、DTO、装饰器等

## 创建项目
nest new 创建项目，根据提示输入项目名称，采用的包管理器即可。

启动项目: npm run start 或者 npm run start:dev 两者区别是热更新有无。


nestjs 是MVC架构，其内置了命令可以帮助快速生成controller、service、module等文件。

nest generate controller [name] 生成controller文件
nest generate service [name] 生成service文件
nest generate module [name] 生成module文件
当然上诉命令也有间歇版本：
nest g co [name] 生成controller文件
nest g s [name] 生成service文件
nest g mo [name] 生成module文件

最后，如果还是觉得麻烦，可以直接使用
nest g resource [name] 生成一个标准的CRUD模板模块，包括controller、service、DTO、module等。

## MVC架构

MVC架构是Model-View-Controller的缩写，是一种软件设计模式。它将一个复杂的软件系统分为三个基本部分：模型（Model）、视图（View）和控制器（Controller）。

- 模型（Model）：模型主要负责数据的获取、存储、验证及数据库操作等。
- Controlle：控制器主要负责处理用户的请求，调度Service服务，及进行API的路由管理。
- View：视图主要负责数据的呈现，负责将模型数据呈现给用户。在现代Web开发中，现在这一层主要拆分给前端去做处理，即现在的后端仅需对Controller管理好API路由及业务逻辑和Module管理好数据库的工作。


## 跨域问题

### 后端解决跨域问题

在nest.js中，我们可以通过在main.ts文件中启用CROS即可解决跨域问题。

```typescript
app.enableCors();
```

### 前端解决跨域问题
我们可以通过vite的server.proxy来解决跨域问题。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: { // 前端请求url直接使用'/api'来代替'http://localhost:3000'
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## AOP架构理念

AOP是为了解决传统面向对象编程中的问题，比如代码重复和业务逻辑混乱的问题。
举个例子: 当我想在一个controller中打印日志，那么我应该在对应的controller中添加打印日志的代码。但是等待后续继续开发的时候，我还想将另一个controller也打印日志。那么此时我还需要继续重复编写打印日志的代码待这个controler中。而且以后要是想去除打印日志的代码，还需要多次去删除。这样无论在管理还是开发上都十分不方便。
那么此时AOP面向切面编程的思想就提出来了，即在进入controller层前，先经过一层其他的逻辑层，然后再进入controller层。这样我就可以在进入到某个controller层前，可以进行指定的一些操作等。
那么新增的这一层逻辑，我们可以类似的继续添加多几层，那么这个过程其实就是面向切面的编程思想。

传统的MVC架构，一个HTTP的请求通常为:

Http --> Controller --> Service --> Database

在MVC架构基础上添加AOP设计思想：

Http --> AOP --> Controller --> AOP --> Service --> AOP --> Database

TIPS: 这里的AOP可以是任何一个不同的逻辑处理。例如日志打印、权限校验、缓存、事务等。

那么在Nestjs中，AOP切面主要有:
1. Middleware: 中间件
2. Guards: 守卫
3. Interceptors: 拦截器
4. Pipe: 管道
5. Filter: 过滤器

在Nest框架中，客户端发出的请求会经历一个分层处理过程：首先由控制器(Controller)接收请求，然后传递给服务层(Service)，接着服务层可能会调用仓库层(Repository)进行数据操作，最终将处理结果返回给客户端。这一流程正是Nest分层架构的典型体现。

## IoC理念

IoC是Inversion of Control的缩写，即控制反转。当我想要访问一个Service的时候，我通常需要先new这个Service，然后调用其方法。但是每一次请求都需要new一个Service，这无疑是十分浪费资源的。而且就算写成一个单例模式，当我想要将这个controller的Service更换为其他的Service时，我还需要修改controller的代码。这样耦合性很高。那么IoC的思想就是，我们不需要new这个Service，而是默认通过类似函数参数来传过来了，我们直接使用即可。这样当我们更换Service时，只需要传另一个Service的实例过去即可。这样耦合性就降低了。

那么在nestjs中，它把我们new一个Service的操作都拿去了，即我们不需要自己手动去管理Service，我们只需要在构造函数中注入Service即可，nestjs已经帮我们做好了这个Service的实例化工作。我们需要用的时候直接类似函数参数来声明即可使用了。


## NestJs 常用装饰器

- @Controller: 控制器装饰器，用于标识一个类是一个控制器。还可以设置路由路径前缀来管理该路由。
- @Injectable: 注入器装饰器，用于标识一个类是一个可注入的类。可以被其他对象进行依赖注入。
- @Module: 模块装饰器，用于标识一个类是一个模块。可以管理控制器、提供服务等。用来划分功能模块并限制依赖注入的范围。
- @UseInterceptors: 拦截器装饰器，用于标识一个类是一个拦截器。可以对请求进行拦截并对请求进行处理。
- @Get, @Post, @Put, @Delete: HTTP请求装饰器，用于标识一个方法是一个HTTP请求处理方法。可以设置请求路径、请求方法、请求参数等。
- @Param, @Query, @Body: 请求参数装饰器，用于标识一个方法的参数是一个请求参数。可以设置参数类型、参数名称、参数默认值等。

## NestJs 模块

在NestJs项目当中，我们通常使用 nest g resourcce [name] 命令来生成一个标准的CRUD模板模块，包括controller、service、DTO、module等。

通过命令会生成以下的文件:

- controller.ts: 控制器文件，用于处理HTTP请求。
- service.ts: 服务文件，用于处理业务逻辑。
- dto文件夹: 数据传输对象文件夹，用于定义请求参数和响应参数。
- entity文件夹: 实体文件夹，用于定义数据库模型。
- module.ts: 模块文件，用于管理控制器、服务、DTO、实体等。

那么以上的文件则代表着一个完整的模块，而管理这个模块的则是module.ts文件。

### 共享模块

module.ts文件中，为本模块提供了一个装饰器 @Module()，用于标识一个类是一个模块。其内部controller对应该模块内的路由管理，而provider则是该模块对应的service服务的依赖注入(Nestjs帮我们做好了实例的管理)。此外还可以拥有imports属性，用于导入其他模块，以实现模块的组合。即当cats模块需要使用dogs模块的服务时，可以将dogs模块导入到cats模块中。这样我们就可以使用dogs模块中module文件中exports出去的对象了。那么这个exports出去的对象模块就叫做**共享模块。**

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 这里导出了CatsService和CatsController，那么其他模块进行import后可以使用这两个对象
})
export class CatsModule { }
```

### 全局模块

全局模块主要是通过 @Global() 装饰器来标识一个模块为全局模块。

```ts
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 这里还需要导出，但是其他模块不用再进行import了, 直接使用即可
})
export class CatsModule { }
```

### 动态模块

刚开始学习的时候，可以先不做了解，等待后续集成的第三方服务再进行详细的了解。因为后续动态模块的使用非常频繁。


## NestJs 中间件

NestJs的中间件是在路由处理程序**之前**调用的函数，中间件函数可以访问请求和响应对象。它可以执行以下操作：
- 执行任何代码
- 对请求和响应对象进行更改
- 结束请求-响应周期
- 调用堆栈中的下一个中间件函数
- 如果当前中间件函数没有结束请求-响应周期，就必须调用 next() 方法将控制权传递给下一个中间件函数。否则请求将被挂起。

NestJs中间件可以通过 nest generate middleware [name] 命令来生成一个中间件文件。

那么如何使用这个中间件呢? 我们可以在模块内的module文件中，对导出的Module进行重写并实现configure()方法。
```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { LoggerMiddleware } from 'src/logger/logger.middleware'

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

### 中间件调用Service

在中间件中，不仅可以用于处理Http请求和响应，还可以能够实现依赖注入，调用Service层的业务逻辑。

```ts
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // 注入catsService 这里的Service 不需要在module中进行exports
  @Inject(CatsService)
  private readonly catsService: CatsService;
  use(req: any, res: any, next: () => void) {
    console.log("中间件 before");
    console.log("中间件执行过程 ... ", this.catsService.findAll());
    next();
    console.log("中间件 after");
  }
}
```






