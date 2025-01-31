
# Git的学习笔记

## Git

### Git的基本概念

- 工作区：仓库的目录。工作区是独立于各个分支的。
- 暂存区：数据暂时存放的区域，类似于工作区写入版本库前的缓存区。暂存区同样是独立于各个分支的。
- 版本库：存放所有已经提交到本次仓库的代码版本。
- 版本结构：树结构，树中的每一个节点都代表着一个代码版本。

### Git常用命令

- `git config --global user.name "your name"`：设置全局用户名，信息记录在`～/.gitconfig`文件中。当设置完成该命令后，下次进行`git init`操作时，会自动记录该用户名。
- `git config --global user.email "your email"`：设置全局邮箱，信息记录在`～/.gitconfig`文件中。当设置完成该命令后，下次进行`git init`操作时，会自动记录该邮箱。
- `git init`：在当前目录下初始化一个Git仓库，其信息记录在本目录下的`.git`目录中。
- `git add filename`：将文件添加到暂存区。
    - `git add .`：将所有文件添加到暂存区。
- `git rm --cached filename`：从暂存区中删除文件。也就是将该文件从暂存区中移除，下次提交的版本库的时候不会将文件提交进版本，但仍然保留在工作区并非从硬盘删除该文件操作。
- `git commit -m "commit message"`：将暂存区中的文件提交到版本库。`-m`参数后面是提交信息给自己看的，可以用双引号括起来。
- `git status`：查看当前仓库的状态，包括工作区、暂存区、版本库的状态信息。
- `git diff`：查看工作区和暂存区的差异。
- `git log`：查看版本库的提交历史。但是一些回滚版本的操作是看不到的，从底层来将的话，就是从头开始遍历到`HEAD`指针，但是`HEAD`指针有可能回退到以前的版本。
- `git reflog`：查看HEAD指针移动的历史，包括回滚版本库的操作。
- `git branch`：查看当前仓库的分支。
- `git reset --hard HEAD^` 或 `git reset --hard HEAD~1`：回退到上一个版本。
    - `git reset --hard HEAD~n`：回退到n个版本之前。
    - `git reset --hard HEAD^^^`：回退到三次之前的版本。多少个`^`表示回退的版本数。
    - `git reset --hard commit_id`：回退到指定版本。这个`commit_id`可以用`git log`命令查看。
- `git checkout - XXX` 或 `git restore XXX`：将还未添加到暂存区的文件修改全部撤销(修改了但是发现改错了，同时还未添加到暂存区，那么就可以通过这个命令进行回滚到一开始未修改的状态)(底层实现应该是将暂存区中的文件复制到工作区中)。
- `git remote add origin https://github.com/username/repository.git`：将本地仓库与远程仓库进行关联。
- `git push -u origin master`：将本地仓库的最新版本推送到远程仓库的master分支。`-u`参数表示将本地分支和远程分支关联起来(仅第一次推送时使用)，之后就可以直接使用`git push`命令来推送本地分支的最新版本到远程仓库。
    - `git push origin branch_name`：将本地分支branch_name的最新版本推送到远程仓库的origin分支。
    - `git push origin --delete branch_name`：删除远程仓库的branch_name分支。
- `git clone https://github.com/username/repository.git`：克隆远程仓库到本地。

### Git分支操作

- `git checkout -b branch_name`：创建并切换到一个名为`branch_name`的新分支。
- `git branch`：查看当前仓库的分支。
- `git checkout branch_name`：切换到名为`branch_name`的分支。
- `git branch -d branch_name`：删除本地分支`branch_name`。
- `git branch merge branch_name`：合并`branch_name`分支到当前分支。通常是切换分支到主分支上，然后再将`branche_name`分支合并到主分支。
- `git push --set-upstream origin branch_name`：将本地分支`branch_name`推送到远程仓库，并将本地分支和远程分支关联起来。
- `git push -d origin branch_name`：删除远程仓库的`branch_name`分支。
- `git pull`：从远程仓库拉取最新版本到本地。
    - `git pull origin branch_name`：从远程仓库的`branch_name`分支拉取最新版本到本地。
- `git branch --set-upstream-to=origin/branch_name1 branch_name2`：设置本地分支`branch_name1`和远程分支`origin/branch_name2`的关联。

