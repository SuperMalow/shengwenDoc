# Anaconda Note

## 1. 安装Anaconda

直接去清华大学镜像站去进行下载：[清华大学镜像站](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/)

选择你要下载的版本即可，我这里选择的是 `Anaconda3-2024.10-1-MacOSX-arm64.sh` ，点击下载。

下载完成后，在我的下载目录下会出现该文件。但由于我的是mac mini m4 版本，跟windows上有所不同。
MAC下操作：mac+空格，搜索终端打开。接着输入 `cd ~/Downloads`，然后执行`chmod + Anaconda3-2024.10-1-MacOSX-arm64.sh` 命令，接着 `./Anaconda3-2024.10-1-MacOSX-arm64.sh` 即可安装。过程按下回车和输入 yes 即可。

## 2. 基本使用

1. `conda --version` : 查看当前conda版本
2. `conda info` : 查看conda配置信息
3. `conda create -n myenv python=3.8` : 创建名为myenv的python环境，python版本为3.8
4. `conda activate myenv` : 激活myenv环境
5. `conda deactivate` : 退出当前环境
6. `conda install package_name` : 安装package_name包
7. `conda remove package_name` : 卸载package_name包
8. `conda info --envs` : 查看所有环境

