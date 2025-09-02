# 配置免费的 Https 证书

如题，由于作者是个穷比，所以没有钱购买阿里云的 SSL 证书，只能另寻他路。于是找到了 acme.sh 这个工具，可以很方便的实现 https 证书的颁发与自动续期。而且是免费的！

## 安装 acme.sh

首先 `acme.shsh` 的官网地址：[acmesh GitHub](https://github.com/acmesh-official/)

1. 安装 acme.sh 脚本

为了不容易出错，我希望读者你在 `~` 目录下进行安装：

```shell
cd ~
curl https://get.acme.sh | sh -s email=my@example.com
```

或者

```shell
cd ~
wget -O -  https://get.acme.sh | sh -s email=my@example.com
```

以上的 `email=my@example.com` 参数随便填写一个邮箱即可。

> 注意如果提示出错，大概率是需要安装 `cron` 命令，运行 `apt update && apt install -y cron` 后，重新执行上面安装的命令。
>
> 这个 cron 主要是后续运行自动续费证书脚本的依赖。

安装完成后，会自动在 `~/.acme.sh` 目录下生成 `acme.sh` 脚本。为了方便使用该脚本，可以为该命令起一个别名：

```shell
alias acme.sh=~/.acme.sh/acme.sh
```

这样，我们就可以在任意目录下使用 `acme.sh` 命令了。

2. 修改 CA 服务器默认配置

`acme.sh` 脚本默认 `CA` 服务器是 `ZeroSSL`，有时可能会导致获取证书的时候一直出现：`Pending，The CA is processing your order，please just wait.` 也就是网络不好。

只需要把 `CA` 服务器改成 `Let's Encrypt` 即可：

```shell
acme.sh --set-default-ca --server letsencrypt
```

3. 生成证书

`acme.sh` 实现了 `acme` 协议支持的所有验证协议。

一般有两种方式验证: `HTTP` 和 `DNS` 验证。本文只演示 `HTTP` 验证，并且是在 `Nginx` 模式下。

```shell
acme.sh --issue --nginx -d example.com -d www.example.com
```

只需要将 `example.com` 替换成你的域名即可。

4. 复制证书

证书生成好以后，我们需要把证书复制给对应的 `Nginx` 或其他服务器去使用。

```shell
mkdir -p /var/www/ssl

acme.sh --install-cert -d example.com \
--key-file       /var/www/ssl/example.com.key  \
--fullchain-file /var/www/ssl/example.com.pem \
--reloadcmd     "service apache2 force-reload"
```

以上的命令，就是我先在 `/var/www/` 目录下创建了一个 `ssl` 目录，然后把证书复制到该目录下。方便后续 `nginx` 的配置。

5. 配置 `nginx` 配置

由于每个人的 `nginx` 配置文件都不一样，所以这里只贴出关键部分：

> 不要忘记将 example.com 替换成你的域名

```nginx
server {
    listen 8443 ssl;
    server_name example.com www.example.com; # 更改成你的域名

    ssl_certificate     /var/www/ssl/example.com.pem; # 更改成你的域名
    ssl_certificate_key /var/www/ssl/example.com.key; # 更改成你的域名
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

6. 重启 `nginx`

```shell
nginx -s reload
```

以上就是使用 `acme.sh` 脚本生成 `https` 证书的全部过程，本文完。
