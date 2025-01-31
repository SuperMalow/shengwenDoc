
# SSH与SCP命令的使用

## SSH

### SSH登陆

1. 基本用法
```bash
ssh user@hostname
```
其中user是远程主机的用户名，hostname是远程主机的IP地址或域名。
那么在第一次进行登陆的时候，会出现一个警告信息，提示是否信任该主机的密钥。输入`yes`后，这样会将该服务器的信息记录在本地的`~/.ssh/known_hosts`文件中。然后接着会出现一个密码提示，输入远程主机的密码进行登陆即可。

默认的ssh登陆端口为22，如果需要指定端口，可以在命令后面加上`-p`参数：
```bash
ssh -p 2222 user@hostname # 写法1
ssh user@hostname -p 2222 # 写法2
```

2. 配置文件
创建文件`~/.ssh/config`，内容如下：
```bash
Host server1
    HostName 192.168.xxx.xxx
    User root
    Port 2222
```
然后就可以使用简写命令`ssh server1`来登陆远程主机了。

3. 密钥登陆

- 创建密钥对：
```bash
ssh-keygen
```
然后一路回车即可。
执行结束后，在`~/.ssh`目录下会生成两个文件：`id_rsa`和`id_rsa.pub`。`id_rsa`是私钥，`id_rsa.pub`是公钥。
那么之后想要免密登陆哪个服务器，就把公钥`id_rsa.pub`文件内的内容，复制到服务器中的`~/.ssh/authorized_keys`文件中即可。
当然也可以使用以下命令，一键添加密钥到服务器中的`authorized_keys`文件中：
```bash
ssh-copy-id user@hostname # 写法1
ssh-copy-id server # 配置好文件后可以这样写
```

4. 执行命令
我们可以在不登陆进到远端服务器中进行执行想要执行的命令。例:
```bash
ssh user@hostname "ls -l"
```
这条命令会在远程主机上执行`ls -l`命令，并将结果返回到本地。

或者也可以这么玩：
```bash
ssh user@hostname 'for((i=1;i<=10;i++))do echo $i;done' # 要使用单引号包裹命令，如果是使用双引号则会将$i当作字符串处理
```

### SCP传文件

1. 基本用法
```bash
scp local_file user@hostname:remote_file
```
将本地文件`local_file`传送到远程主机的`~/remote_file`目录下。

**一次性传送多个文件到远端服务器：**
```bash
scp local_file1 local_file2 user@hostname:
```

**复制文件夹到远端服务器：**
```bash
scp -r local_folder user@hostname:remote_folder
```
`-r`参数表示递归复制文件夹。将本地的`local_folder`文件夹递归复制到远端服务器中的`~/remote_folder`文件夹。


**将远端服务器上的文件下载到本地：**
```bash
scp user@hostname:remote_file local_file
```
将远程主机的`~/remote_file`文件下载到本地。

**指定服务器的端口：**
```bash
scp -P 2222 user@hostname:remote_file local_file
```

**另外需要注意的是：`scp`中的`-r -P`等参数尽量加在源文件和目标文件之前，也就是`scp`命令后面，这样可以避免命令行参数的歧义。**

将祖传配置上传到服务器中:
```bash
scp ~/.vimrc ~/.tmux.conf ~/.bashrc user@hostname:
```