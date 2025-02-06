
# Nginx Note

nginx 是一个高性能的HTTP和反向代理服务器，它可以作为HTTP服务器、反向代理服务器、邮件代理服务器或通用的TCP/UDP代理服务器，同时也提供了IMAP/POP3/SMTP服务。

## 0. 基础介绍

### 正向代理

当你的电脑无法直接访问一个服务器时，那么你可以通过一个代理服务器进行帮助你访问，那么这个代理服务器就是在帮助你做正向代理这一概念。
即，你的电脑 A 访问某一个网站是被禁止的，但是电脑 B 访问这一网站是被允许的，那么你可以通过访问 B 来帮助你去访问被禁止的网站。而这个过程就是正向代理，且电脑 B 可以使用 nginx 来进行实现。

### 反向代理

当电脑 A 访问网站 B 时，通常会直接访问网站 B 所搭建的服务器。但是一个大型网站通常有很多个子服务器，所以通常会在外面套一层服务器，即电脑 A 访问网站 B 的临时服务器，然后通过一定的分配策略来进行跳转到其他服务器。那么这个过程就是反向代理，而 nginx 也是可以实现这一功能的。

### 负载均衡

一个大型网站，通常有很多个服务器来进行运行，即一个大型品牌商店，它通常有多个小的分店来满足消费者的需求。当用户进行消费时，如果只有一家店，那么光排队就排了很久，且一家店的用户容量是有上限的，所以为了满足消费者的需求，通常会选择继续多开分店来进行人流的分流。那么换作在网站服务器上也是类似的原理。那么如何分流？目前主要分为两个：轮询、权重分流。

**轮询**
即用户访问服务器的时候，按照配置顺序的子服务器进行分流。

**权重**
即用户访问服务器的时候，安装配置的权重进行对服务器分流。权重越高，分流的概率越大。

### 动静分离

网站的静态资源和动态资源分离，可以把静态资源放在Nginx服务器上，动态资源放在Tomcat服务器(可以是其他语言的后端)上，这样可以提高网站的访问速度。

## 1. nginx 安装

linux下安装Nginx：

```shell
sudo apt-get update
sudo apt-get install nginx
```

根据提示进行进一步的安装，安装完成后通常在 `/usr/local/nginx/sbin` 目录下有nginx的可执行文件。

## 2. nginx 常用命令

### nginx 基本配置

首先进行配置linux下所有命令都能进行使用 nginx 命令。以下提供两种方法，采用其中一种即可。

1. 添加软连接（**二选一**）

```shell
sudo ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
```

2. 添加到环境变量（**二选一**）

```shell
sudo vi /etc/profile
```

在文件末尾添加：

```shell
export PATH=$PATH:/usr/local/nginx/sbin
```

使环境变量生效：

```shell
source /etc/profile
```

### nginx 基本命令

1. **查看nginx版本信息**

```shell
nginx -v
nginx -V
```

2. **启动nginx**

```shell
nginx
```

3. **停止nginx**

暴力停止:

```shell
nginx -s stop
```

优雅停止:

```shell
nginx -s quit
```

区别: 优雅停止会将正在请求的连接处理完，再退出。

4. **重启nginx**
```shell
nginx -s reload
```

5. **重新加载nginx配置**

在进行修改了 /usr/local/nginx/conf/nginx.conf 配置文件后，需要重新加载nginx的配置文件，使之生效。

```shell
nginx -s reload
```

6. **显示nginx的配置文件路径**

该命令主要作用是查看nginx配置文件的语法错误，并打印出配置文件的路径。

```shell
nginx -t
```

7. **显示nginx的运行状态**

```shell
ps -ef | grep nginx
```

## 3. nginx 配置文件

nginx 的配置文章位于 `/usr/local/nginx/conf/nginx.conf` 文件中。而 `/usr/local/nginx/conf/nginx.conf.default` 文件是默认的配置文件，可以作为参考。所以，随便修改 `nginx.conf` 文件，大不了使用 `nginx.conf.default` 文件进行还原。

其配置文件内容，网上搜索即可，都是概念相关。

## 4. nginx 反向代理

在 nginx 中，通常使用 proxy_pass 指令来实现反向代理到其他服务器上。

1. 使用 proxy_pass 反向代理到其他服务器

```txt
server {
    listen 5500;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        proxy_pass http:bilibili.com; # 访问 / 目录会跳转到 bilibili.com 服务器
    }
}
```

2. 使用 proxy_pass 实现跨域

```txt
server {
    listen 5500;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }

    location /api {
        proxy_pass http://localhost:8080; # 访问 /api 目录会跳转到 8080 端口的服务器(后端服务器地址) 解决跨域问题
    }
}
```

## 5. Nginx 与 Vue history 模式冲突

由于 Vue 开发的是单页面应用，所以在使用 history 模式时，如果 nginx 配置了 index.html 作为默认的首页，那么在访问其他页面时，会出现 404 错误。

解决方法：

```txt
server {
    listen 5500;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html; # 这里将 index.html 作为默认的首页
        try_files $uri $uri/ /index.html; # 这里配置 try_files 规则，将所有请求都重定向到 index.html
    }
}
```

以上解决方法关键是在于这一句指令：`try_files $uri $uri/ /index.html;` , 它告诉 nginx 尝试去找 `$uri` 文件，如果找不到，则尝试去找 `$uri/` 文件，如果还是找不到，则重定向到 `/index.html` 文件。也就是说如果访问 `/about` 页面时，nginx 会尝试去找 `/about` 文件，如果找不到，则尝试去找 `/about/` 文件，如果还是找不到，则重定向到 `/index.html` 文件。而 Vue 的 history 模式会在前端使用 `pushState` 方法时，将 URL 加入到浏览器的历史记录中，所以在访问其他页面时，不会出现 404 错误。

## 6. Nginx 负载均衡

负载均衡主要是 upstream 块，它与 server 块是同级的。

```txt   
# 轮询方式
upstream backendA {
    server 192.168.1.100:8080; # 后端服务器A地址
    server 192.168.1.101:8080; # 后端服务器B地址
    server 192.168.1.102:8080; # 后端服务器C地址
} 

# 权重方式
upstream backendB {
    server 192.168.1.100:8080 weight=3; # 后端服务器A地址，权重为3
    server 192.168.1.101:8080 weight=2; # 后端服务器B地址，权重为2
    server 192.168.1.102:8080 weight=1; # 后端服务器C地址，权重为1
}

# 超时补救策略
upstream backendC {
    server 192.168.1.100:8080 max_fails=2 fail_timeout=60s; # 后端服务器A地址，最大失败次数为2，失败超时时间为30秒
    server 192.168.1.101:8080 max_fails=3 fail_timeout=40s; # 后端服务器B地址，最大失败次数为3，失败超时时间为40秒
    server 192.168.1.102:8080 max_fails=3 fail_timeout=20s; # 后端服务器C地址，最大失败次数为3，失败超时时间为20秒
    server backup1.example.com:8080 backup; # 备用服务器地址 上面三台服务器都出现其对应的错误就会转向备用服务器
}

server {
    listen 5500;
    server_name localhost;  
    location /A {
        proxy_pass http://backend; # 访问 /A 目录会跳转到 backendA 服务器组
    }

    location /B {
        proxy_pass http://backendB; # 访问 /B 目录会跳转到 backendB 服务器组
    }
}
```
