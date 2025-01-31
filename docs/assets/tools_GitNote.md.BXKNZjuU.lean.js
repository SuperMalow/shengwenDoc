import{_ as i,c as o,a2 as c,o as t}from"./chunks/framework.CAQ3h1-a.js";const s=JSON.parse('{"title":"Git的学习笔记","description":"","frontmatter":{},"headers":[],"relativePath":"tools/GitNote.md","filePath":"tools/GitNote.md","lastUpdated":1738308455000}'),d={name:"tools/GitNote.md"};function a(l,e,r,n,g,h){return t(),o("div",null,e[0]||(e[0]=[c('<h1 id="git的学习笔记" tabindex="-1">Git的学习笔记 <a class="header-anchor" href="#git的学习笔记" aria-label="Permalink to &quot;Git的学习笔记&quot;">​</a></h1><h2 id="git" tabindex="-1">Git <a class="header-anchor" href="#git" aria-label="Permalink to &quot;Git&quot;">​</a></h2><h3 id="git的基本概念" tabindex="-1">Git的基本概念 <a class="header-anchor" href="#git的基本概念" aria-label="Permalink to &quot;Git的基本概念&quot;">​</a></h3><ul><li>工作区：仓库的目录。工作区是独立于各个分支的。</li><li>暂存区：数据暂时存放的区域，类似于工作区写入版本库前的缓存区。暂存区同样是独立于各个分支的。</li><li>版本库：存放所有已经提交到本次仓库的代码版本。</li><li>版本结构：树结构，树中的每一个节点都代表着一个代码版本。</li></ul><h3 id="git常用命令" tabindex="-1">Git常用命令 <a class="header-anchor" href="#git常用命令" aria-label="Permalink to &quot;Git常用命令&quot;">​</a></h3><ul><li><code>git config --global user.name &quot;your name&quot;</code>：设置全局用户名，信息记录在<code>～/.gitconfig</code>文件中。当设置完成该命令后，下次进行<code>git init</code>操作时，会自动记录该用户名。</li><li><code>git config --global user.email &quot;your email&quot;</code>：设置全局邮箱，信息记录在<code>～/.gitconfig</code>文件中。当设置完成该命令后，下次进行<code>git init</code>操作时，会自动记录该邮箱。</li><li><code>git init</code>：在当前目录下初始化一个Git仓库，其信息记录在本目录下的<code>.git</code>目录中。</li><li><code>git add filename</code>：将文件添加到暂存区。 <ul><li><code>git add .</code>：将所有文件添加到暂存区。</li></ul></li><li><code>git rm --cached filename</code>：从暂存区中删除文件。也就是将该文件从暂存区中移除，下次提交的版本库的时候不会将文件提交进版本，但仍然保留在工作区并非从硬盘删除该文件操作。</li><li><code>git commit -m &quot;commit message&quot;</code>：将暂存区中的文件提交到版本库。<code>-m</code>参数后面是提交信息给自己看的，可以用双引号括起来。</li><li><code>git status</code>：查看当前仓库的状态，包括工作区、暂存区、版本库的状态信息。</li><li><code>git diff</code>：查看工作区和暂存区的差异。</li><li><code>git log</code>：查看版本库的提交历史。但是一些回滚版本的操作是看不到的，从底层来将的话，就是从头开始遍历到<code>HEAD</code>指针，但是<code>HEAD</code>指针有可能回退到以前的版本。</li><li><code>git reflog</code>：查看HEAD指针移动的历史，包括回滚版本库的操作。</li><li><code>git branch</code>：查看当前仓库的分支。</li><li><code>git reset --hard HEAD^</code> 或 <code>git reset --hard HEAD~1</code>：回退到上一个版本。 <ul><li><code>git reset --hard HEAD~n</code>：回退到n个版本之前。</li><li><code>git reset --hard HEAD^^^</code>：回退到三次之前的版本。多少个<code>^</code>表示回退的版本数。</li><li><code>git reset --hard commit_id</code>：回退到指定版本。这个<code>commit_id</code>可以用<code>git log</code>命令查看。</li></ul></li><li><code>git checkout - XXX</code> 或 <code>git restore XXX</code>：将还未添加到暂存区的文件修改全部撤销(修改了但是发现改错了，同时还未添加到暂存区，那么就可以通过这个命令进行回滚到一开始未修改的状态)(底层实现应该是将暂存区中的文件复制到工作区中)。</li><li><code>git remote add origin https://github.com/username/repository.git</code>：将本地仓库与远程仓库进行关联。</li><li><code>git push -u origin master</code>：将本地仓库的最新版本推送到远程仓库的master分支。<code>-u</code>参数表示将本地分支和远程分支关联起来(仅第一次推送时使用)，之后就可以直接使用<code>git push</code>命令来推送本地分支的最新版本到远程仓库。 <ul><li><code>git push origin branch_name</code>：将本地分支branch_name的最新版本推送到远程仓库的origin分支。</li><li><code>git push origin --delete branch_name</code>：删除远程仓库的branch_name分支。</li></ul></li><li><code>git clone https://github.com/username/repository.git</code>：克隆远程仓库到本地。</li></ul><h3 id="git分支操作" tabindex="-1">Git分支操作 <a class="header-anchor" href="#git分支操作" aria-label="Permalink to &quot;Git分支操作&quot;">​</a></h3><ul><li><code>git checkout -b branch_name</code>：创建并切换到一个名为<code>branch_name</code>的新分支。</li><li><code>git branch</code>：查看当前仓库的分支。</li><li><code>git checkout branch_name</code>：切换到名为<code>branch_name</code>的分支。</li><li><code>git branch -d branch_name</code>：删除本地分支<code>branch_name</code>。</li><li><code>git branch merge branch_name</code>：合并<code>branch_name</code>分支到当前分支。通常是切换分支到主分支上，然后再将<code>branche_name</code>分支合并到主分支。</li><li><code>git push --set-upstream origin branch_name</code>：将本地分支<code>branch_name</code>推送到远程仓库，并将本地分支和远程分支关联起来。</li><li><code>git push -d origin branch_name</code>：删除远程仓库的<code>branch_name</code>分支。</li><li><code>git pull</code>：从远程仓库拉取最新版本到本地。 <ul><li><code>git pull origin branch_name</code>：从远程仓库的<code>branch_name</code>分支拉取最新版本到本地。</li></ul></li><li><code>git branch --set-upstream-to=origin/branch_name1 branch_name2</code>：设置本地分支<code>branch_name1</code>和远程分支<code>origin/branch_name2</code>的关联。</li></ul>',8)]))}const u=i(d,[["render",a]]);export{s as __pageData,u as default};
