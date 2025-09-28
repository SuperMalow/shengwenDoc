# 多 `Docker` 项目的统一网关管理

## 背景

假设仅有**一台服务器**、**一个域名**，如何实现一台服务器下多个项目的统一管理？且能够通过不同的二级域名来区分不同的项目。

思路：通过一个 **总的网关 Docker** 来实现管理，通过反向代理的方式来实现多项目的统一管理。

## 实现

假设拥有域名: `eeeeee.com`，并且有三个子项目: `blog`、`tool`、`game`。

### 1. 创建共享的 Docker 网络

首先，创建一个名为 `nginx-proxy-network` 的 Docker 网络，让所有容器都能在同一个网络内互相通信。

```bash
docker network create nginx-proxy-network
```

### 2. 调整子容器的网络配置

接着，确保每一个子容器都使用 `nginx-proxy-network` 网络，并将容器的 `80` 端口映射到主机的 `80` 端口。

假设运行子项目 **game** :

```bash
docker run -itd --name game --network nginx-proxy-network -v /path/to/:/path/to/ -p 80:80 nginx:latest
```

### 3. 配置并运行网关容器

最后，运行网关容器，并将容器的 `80` 端口映射到主机的 `80` 端口。

对应网关容器的 nginx 的配置文件为:

```nginx
# /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;

    # 解析其他容器名服务器域名
    resolver 127.0.0.1 valid=300s;

    # blog项目配置
    server {
        listen 80;
        server_name blog.eeeeee.com;

        location / {
            proxy_pass http://blog:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # tool项目配置
    server {
        listen 80;
        server_name tool.eeeeee.com;

        location / {
            proxy_pass http://tool:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # game项目配置
    server {
        listen 80;
        server_name game.eeeeee.com;

        location / {
            proxy_pass http://game:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

对应运行网关容器命令为:

```bash
docker run -itd --name nginx-proxy --network nginx-proxy-network -p 80:80 -v /path/to/blog/nginx.conf:/etc/nginx/nginx.conf nginx:latest
```
