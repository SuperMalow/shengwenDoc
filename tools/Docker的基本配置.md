# `Dcoker` 的基本使用

本文主要讲解如何通过 Docker 制作属于自己的镜像，方便在云服务器上反复去配置服务器的各种配置等重复性操作。

## `Docker` 的安装

主要参考[Docker 官网](https://docs.docker.com/engine/install/ubuntu/)，以下将摘抄官网的安装方式进行安装。

1. 首先设置 Docker 的 apt 仓库。

```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

2. 安装 Docker 的包

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 验证 Docker 是否安装成功

```shell
# 验证docker是否安装成功 方法1
sudo docker run hello-world
# 验证docker是否安装成功 方法2
docker --version
```
## `Docker` 常用命令

### `Docker` 运行和停止 

在 `ubuntu` 下，安装完成 `Docker` 后，会自动运行，也可以通过命令来控制 `Docker` 运行/关闭。

```shell
# 运行docker
service docker start

# 停止
service docker stop

# 重启
service docker restart

# 查看当前状态
service docker status

# 查看版本
docker version
```

### `Docker` 镜像管理

1. 查看所有镜像
```shell
docker images
```

2. 查看镜像历史，就是查看该镜像的制作历史
```shell
docker history [image]
```

3. 查看镜像的信息，能查看镜像的制作者、docker版本号、创建时间等
```shell
docker inspect [image]
```

4. 重命名镜像，但其实是拷贝一个新的重新命名
```shell
docker tag [old image]:[old version] [new image]:[new version]
```

5. 删除镜像
```shell
docker rmi [image]:[version]
# 或者
docker rmi [image id]
```

6. 导出/导入镜像
```shell
# 导出镜像
docker save -o xx.tar [image]:[version]
# 导入镜像
docker load -i xx.tar
```

### `Docker` 容器管理

1. 查看当前运行的容器/查看所有容器

```shell
# 查看正在运行的容器
docker ps
# 查看所有正在运行的容器
docker ps -a
```

2. 运行容器

```SHELL
docker run -it --name [container name] [image]:[version] /bin/bash
```

> - `--name` 指定容器的名称
> - `-i` 让容器打开标准输入
> - `-t` 让docker分配一个伪终端，并绑定到容器的标准输入上
> - `/bin/bash` 执行一个命令

通过上面的命令去执行的话，会自动进入到该容器的内部当中。如果想要退出，那么可以执行 `exit` 或 `ctrl + d`，但是这样的方式会将容器停止运行。如果并不想容器停止运行，并且要退出容器内的终端，可执行 `ctrl + p` 并 `ctrl + q` 来挂起容器。如果是挂起的容器，可以通过 `docker attach [container name]` 重新进入到该容器。

3. 将容器进行后台运行

```shell
docker run -itd --name [container name] [image]:[version] /bin/bash
```

> - `-d`  将该终端进行守护住

此时，执行上面的命令会直接将该容器以后台运行的方式启动容器，即不像上面第二点那样会先进入到容器内。可以通过以下的命令进入到容器的内部：

```shell
docker exec -it [container id/name] /bin/bash
```

此时，如果想要退出那么就可以执行 `exit` 或 `ctrl + d`  的方式进行退出该终端，而容器仍然会继续在后台运行中。

4. 停止和重新运行容器

```shell
# 停止容器
docker stop [container id/name]
# 运行容器
docker start [container id/name]
```

5. 删除容器

```shell
# 删除指定容器
docker rm [container id/name]
# 强制删除正在运行的容器
docker rm -f [container id/name]
# 删除所有容器
docker rm -f $(docker ps -a -q)
# 删除正在运行的容器
docker rm -f $(docker ps -q)
```

6. 基于某个容器创建镜像，会将该容器内的数据进行保存，后续镜像创建容器数据仍然存在

```shell
docker commit -m 'save important operator container' -a 'shengwen' [container id] [save image]:[version]
```

> - `-m` 为该容器添加注释，可以通过docker inspect 查看
> - `-a` 为该容器的作者

### `Docker` 数据管理

Docker中的数据管理主要实现以下的功能：

- Docker容器中产生的数据能持久化的存储到宿主机中。
- Docker容器和宿主机之间的数据共享。

1. 数据卷的实现

```shell
# 示例
docker run -itd --name [container name] -v [宿主机的绝对路径目录]:[容器目录] [image]:[version]
# 实战
docker run -itd --name data_test -v C:\Users\shengwen\Desktop\tmp:/root/test ubuntu:22.04
```

此时 `C:\Users\shengwen\Desktop\tmp` 目录会与 `/root/test` 进行数据同步。

### `Docker` 网络管理

Docker 中总共拥有三种网络模式，通过以下命令来查看：

```shell
docker network list
# 以下是输出内容
# NETWORK ID     NAME      DRIVER    SCOPE
# f2a90cd8e171   bridge    bridge    local
# aa7e3d0a9dba   host      host      local
# 9a8760452c98   none      null      local
```

1. `bridge` 网桥模式，也是docker容器的默认模式。宿主机会充当网桥，每一个容器都拥有一个独立的`IP`。容器之间、容器与宿主之间的通信需要通过宿主机的 `docker0` 网桥来实现通信。而这个 `docker0` 网桥是 docker 默认给我们创建的，其作用用 *DHCP/路由* 的功能

   > 另外可以通过 `docker inspcet [ccontainer]` 来查看容器的网络信息

2. `host` 主机模式，容器没有独立的`IP`，用的都是宿主机的`IP`，容器相当于宿主机的一个进程。

3. `none` 空模式，代表容器没有网络，容器与容器、容器与宿主无法通过网络来进行通信。

由于每一个容器其默认都是`bridge`网桥模式，都拥有一个独立的`IP`，所以外部服务是无法之间访问到docker容器内运行的服务的。所以需要**端口映射**，将宿主机的某个端口(假设为80)与容器中的某个端口(假设为80)进行映射，这样外部服务访问到宿主机的某个端口(假设为80)，通过端口转发到容器内的某个端口(假设为80)就能够访问到容器内运行的服务了。

```shell
# 将本地的5678端口映射到nginx服务器的80端口
docker run -d -p 5678:80 --name mynginx nginx
```

### `Dockerfile`

#### 什么是 `Dockerfile`

`Dockerfile `是一个文本文件，它包含了一系列用于创建 Docker 镜像的指令。每一条指令都会在镜像中创建一个新的层，这样在构建镜像时可以利用Docker的层缓存来加速构建过程。通过 `Dockerfile`，我们可以定义一个自动化的过程来定制我们的镜像，包括安装需要的软件包，配置系统设置，复制应用代码等等。

#### 基础指令

- `FROM` 是 `Dockerfile` 里第一条且只能是除了首行注释之外的第一条指令，该作用是用于指定基础镜像。

```dockerfile
FROM ubuntu:22.04
# FROM ubuntu 会默认为 FROM ubuntu:latest
```

- `LABEL` 指定镜像的一些信息，比如作者的信息、版本信息、描述信息等。注意的是填入字符串最好以双引号

```dockerfile
LABEL author="shengwen" version="1.0"
LABEL desc="shengwen ubuntu image
```

- `WORKDIR` 切换工作目录(相当于cd命令)，可以使用多次。

```dockerfile
WORKDIR /root/test
```

- `RUN` 在**构建镜像**时执行的命令，该指令可以有多条：

```dockerfile
# shell 写法
RUN touch "hello.txt"
# exec 写法
RUN ['touch', 'hello.txt']

# 示例
RUN apt-get update
```

- `EXPOSE` 设置 Docker 容器运行时其 **可以** 暴露出去的端口号，如果未使用 `-p` 参数进行映射的话是无法正常将该端口公开的。可以理解为设置容器所使用到的端口。

```dockerfile
# 指定该容器需要使用的端口
EXPOSE 80

# 示例使用
docker run -itd -p 80:80 nginx
```

- `VOLUME` 指定挂载点，类似前面共享文件夹

```dockerfile
# 示例
VOLUME [“容器内的挂载点”]
# 实战
VOLUME ['/data'] # 在/data路径下

# 通过 docker inspect 容器 查看 Mount 信息 /data与宿主机的哪个目录进行了关联
```

- `CMD`：指定容器运行完后立即被执行的指令，或者给`ENTRYPOINT`指定默认参数。整个`Dockerfile`中只能有一个`CMD`指令，如果存在多个，则以最后一个为准。推荐使用`exec`的方式。`CMD`与`RUN`的区别为，`RUN`命令是在构建镜像时就会执行，而`CMD`和`ENTRYPOINT`命令只有在将镜像运行成容器时才执行。格式为:

```dockerfile
# shell模式
CMD command arg1, arg2,...
# exec模式
CMD ["command", "arg1", "arg2"]
# 或者是只有参数的情况 这样一般搭配ENTRYPOINT使用当作默认参数
CMD ["arg1", "arg2"]

# 示例1
CMD ["echo", "hello"]
# 示例2
CMD ["hello"]
ENTRYPOINT ["echo"] # 当容器运行的时候会打印 hello 字符串
```

- `ENTRYPOINT`：在运行这个容器时会自动执行的命令，可以使用`CMD`指令指定默认参数。格式为：

```dockerfile
# shell模式
ENTRYPOINT command param1, param2,...
# exec模式
ENTRYPOINT ["executable", "param1", "param2",...]

# 示例
ENTRYPOINT ["echo", "hello"]
```

- `ADD`：将src指定的文件复制到容器中的指定位置，`src`只能是和`Dockerfile`相同路径下的。格式为：

```dockerfile
# shell模式
ADD <src> <dest>
# exec模式
ADD ["<src>", "<dest>"]

# 示例1
ADD project /test # 将Dockerfile同级目录projcet下所有文件拷贝到容器的/test目录下
# 示例2 将整个目录拷贝到容器中
ADD project.tar /test # 事先需要将project目录进行打包 ADD 会自动进行解压操作
```

- `COPY`：将宿主机中的某个文件拷贝到容器中的指定位置。格式为：

```dockerfile
# shell模式
COPY <src> <dest>
# exec模式
COPY ["<src>", "<dest>"]

# 示例1
COPY project /test/ # 将project下所有文件拷贝到/test目录下
# 示例2
COPY project.tar /test/ # 将 project.tar 这个文件拷贝到/test目录下，不解压
```

> COPY的**目标路径**末尾建议加斜杠，如果不加斜杠，那么被拷贝进来的文件将会覆盖目标路径的**文件**。

- `ENV`：设置环境变量，可以在任何需要这个环境变量的指令之前定义。使用`ENV`创建的环境变量，在**镜像构建完成后依然能够使用**。格式为：

```dockerfile
ENV <key> <value>
# 或
ENV <key>=<value>

# 示例
ENV USERNAME=shengwen
```

- `ARG`：也是设置环境变量。使用`ARG`创建的环境变量只能在镜像构建过程中生效。格式为：

```dockerfile
ARG <key> <value>
```

ARG指令有一个好处，就是可以在Dockerfile中指定环境变量的名称，而不指定其具体的值，可以延迟到在使用build命令构建镜像的时候再指定其值，这对一些敏感数据（比如密码）特别有用。

```dockerfile
# Dockerfile
ARG PASSWORD
RUN ["sh", "-c","echo $PASSWORD"]

# 构建命令
docker build -t TEST --build-arg PASSWORD=123 . # 会将123赋值到PASSWORD中
```

### 通过 `Dockerfile` 构建镜像

将 `Dockerfile` 文件尽量放在空目录下，然后执行以下命令：

```shell
# 示例
docker build -t [new image]:[version] [Dockefile所在路径]
# 实战
docker build -t myubuntu:1.0 .
# 查看构建出来的镜像
docker images
```

### `Dockers-Compose` (可忽略)

**暂时没学到该部分......**

其作用大概是：假设一个项目使用到 `mysql`、`redis`、`django`，那么可以使用这个 `Dockers-Compose` 一次性同时管理三个容器，而不是像`Dockerfile` 那样创建三个容器进行分别管理。



## 创建自己的 Docker 镜像

接下来将演示如何创建一个属于自己的 Docker 镜像，以保证以后每次配置和部署新的服务器的时候，能做到快速的部署并使用。

### 创建 `Dockerfile` 文件

首先在服务器内创建一个名称为 `Dockerfile` 的文件，用于描述如何构建镜像，内容如下：

```dockerfile
# 使用官方 Ubuntu 22.04 基础镜像
FROM ubuntu:22.04

# 设置环境变量避免交互式提示
ENV DEBIAN_FRONTEND=noninteractive

# 更新系统并安装核心软件包
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
        nginx \
        tmux \
        openssh-server \
        curl \
        net-tools \
        vim \
        git \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 配置 SSH 服务
RUN mkdir /var/run/sshd
RUN echo 'root:shengwen' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# 复制祖传配置文件到容器
COPY .bashrc /root/.bashrc
COPY .vimrc /root/.vimrc
COPY .tmux.conf /root/.tmux.conf
COPY default /etc/nginx/conf.d/default

# 暴露常用端口
EXPOSE 80 443 22

# 设置启动命令
CMD ["/bin/bash", "-c", "service ssh start && nginx -g 'daemon off;'"]
```

### (可忽略) 创建 default 文件

**该部分可忽略，可直接使用`nginx`默认的`config`文件。**

该文件主要是为了配置 `nginx` 的（不需要的可不用配置），并且构建完镜像后会自动将该文件放在 `/etc/nginx/conf.d/default` 中，以下是配置文件信息：

```conf
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
    multi_accept on;
    use epoll;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL优化
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    # main 网站
    server {
        listen 80;
        server_name XXX.XXX; # 主域名即可，www.XXX.XXX 在解析的时候跳转到主域名即可
    }
	
	# 8443 -> 443
	server {
		listen 8443 ssl;
		server_name XXX.XXX XXX.XXX;
		
		ssl_certificate     /var/www/ssl/XXX.XXX.pem;
		ssl_certificate_key /var/www/ssl/XXX.XXX.key;
		ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
		ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
		ssl_prefer_server_ciphers off;
		ssl_session_timeout 1d;
		ssl_session_cache shared:MozSSL:10m;
		
		location / {
			root /var/www/main;
			index index.html index.htm;
		}	
	}

    # 默认服务器块（防IP直连）
    server {
        listen 80;

        # 阻止IP直接访问
        location / {
            return 403;
        }

        # 阻止服务器信息泄露
        location /nginx_status {
            stub_status;
            allow 127.0.0.1;
            deny all;
        }
    }
}
```

### 构建镜像

运行完成以下命令，耐心等待构建完成即可。

```shell
docker build -t shengwenserver .
```

构建完成后，可以通过 `docker images` 查看构建完成的镜像。

### 测试本地镜像

执行以下命令将镜像以容器的形式运行起来。

```shell
sudo docker run -d --name test-server -p 8080:80 -p 20000:22 shengwenserver
```

验证是否运行成功：

```shell
ssh -p 20000 root@localhost
# 密码在Dockerfile中
```

### 将镜像推送到 Docker Hub

1. 首先需要登录到 Docker Hub：

```shell
docker login
```

输入完上述的命令后，会提示一个链接和一个授权码，点击链接后输入授权码即可完成登录。（前提需要登录）

2. 将制作好的镜像贴上标签

前提需要在 Docker Hub 中创建一个仓库，仓库名就是镜像名。

```shell
# supermalow/shengwenserver 这个就是Docker中创建好的仓库名 supermalow 是用户名 shengwenserver是仓库的名称
docker tag shengwenserver:latest supermalow/shengwenserver
```

3. 将镜像推送到 Docker Hub

```shell
docker push supermalow/shengwenserver
```

那么接下来，以后就可以使用 `docker pull supermalow/shengwenserver` 来拉取镜像了。

### 将镜像 Save 导出

通过以下的命令进行将镜像导出：

```shell
docker save -o ./shengwenserver.tar shengwenserver:latest
```

### 将进行 Load 导入

通过以下的命令进行将镜像导入：

```shell
docker load -i ./shengwenserver.tar
```

## 在新的服务器上导入属于自己的 Docker 镜像，配置服务器一步到位

### 通过 Docker Hub 拉取镜像

在新的服务器上先安装好 Docker，然后执行以下命令：

```shell
docker pull supermalo/shengwenserver
```

但是会遇到网络的问题，即墙的存在，所以在实际情况下，更推荐以下这种方法。

### 通过 Load 命令导入镜像

首先将镜像通过 `scp` 上传到新服务器中，然后通过以下命令来导入镜像：

```shell
docker load -i ./shengwenserver.tar
```

查看是否导入成功：

```shell
docker images
```

### 创建并启动容器

完成导入后，可以直接进行创建并启动容器：

```shell
sudo docker run -d --name main-website -p 80:80 -p 20000:22 shengwenserver:latest
```

## (实战) Docker 添加新的端口映射

如题，假设此时我们的 Docker 容器突然需要某个新的端口映射，那么该如何操作？
解决思路：将当前运行的容器保存为镜像，然后将这个保存的镜像创建一个新的容器去运行，在运行的命令添加新的端口映射即可。

1. 查看当前 Docker 容器的 ID

```shell
docker ps
```

假设查到的 ID 是 `1234567890`。

2. 将当前容器保存为镜像

```shell
docker commit 1234567890 newimages
```

3. 查看镜像

```shell
docker images
```

此时就能看到刚刚保存的镜像了。

4. 停止已运行的容器

```shell
docker stop 1234567890
```

5. 使用新的镜像创建新的容器

``` shell
sudo docker run -d --name main-website -p 80:80 -p 20000:22 -p 8443:443 newimages:latest
```
