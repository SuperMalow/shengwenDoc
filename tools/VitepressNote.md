

# vitepress 部署笔记

vitepress \ rspress
静态站点生成器 ssg 技术 static site generator

可以搭建自己的博客，专门记录笔记等文档内容。


# 怎么安装？

```sh
npm i vitepress -D
```

# 怎么使用？

```sh
npx vitepress init
```

- 然后接下来会询问你初始化的根目录
- 设置你的网址标题
- 设置你的网站描述
- 选择你喜欢的主题
- 是否使用typescript去配置主题文件
- 添加vitepress npm script到package.json

接下来会生成一个.vitepress目录，里面包含config.mts，这个格式文件主要是支持import和export default这种语法操作的js文件。

同时会在你的package.json中添加了三个命令：
```json
"docs:dev": "vitepress dev",
"docs:build": "vitepress build",
"docs:preview": "vitepress preview"
```

# index.md配置文件
这个文件主要是修改其中的文字即可，其结构最好不要修改，否则无法使用。新增或删除内容都需要按照它原本的结构格式进行添加或删除。

- docFooter
```yaml
docFooter: {
    prev: '上一页',
    next: '下一页',
},
```

- lastUpdated
```yaml
lastUpdated: {
    text: "最后一次更新",
    formatOptions: {
    dateStyle: 'full',
    timeStyle: 'short'
    }
},
```

- search
```yaml
search: {
    provider: 'local'
},
```

# 关于每一个markdown文件

对于每一个markdown文件，都当作为“书本”的一页纸，那么对于“书本”来说，除了扉页和结束页，其他的每一页都有它的上一页和下一页。
故，在vitepress中，对于每一个markdown文件，可以添加以下的frontmatter来实现上一页和下一页的操作功能：

```yaml
---
outline: depp
prev: 
    text: '上一页'
    link: /docs/first-page
next:
    text: '下一页'
    link: /docs/second-page
head:
    - - meta
      - name: description
        content: 这里是描述内容
    - - meta
      - name: keywords
        content: 这里是关键字
    - - meta
      - name: title
        content: 这里是标题
    - - meta
      - name: author
        content: 这里是作者
---
```

# SEO(搜索引擎优化)

想要百度这种搜索引擎进行收录我们的网站，那么可以进行SEO优化。
首先需要了解 TDK 也就是（title description keywords），就是在你的网站HTML中进行添加这几个meta标签信息。    
一般在爬虫中，都会进行爬去TDK，所以我们需要在markdown文件中添加上述的frontmatter，这样可以帮助搜索引擎更好的收录我们的网站。

注意：
H1 main 只出现一个
img alt title 必须有值
a标签的herf 写多点内容

# 关于markdown文件

在markdown文件中，可以进行书写vue3语法
```vue
<script setup>
    import {VPTeamMember} form 'vitepress/theme'
     
</script>
```
# 部署到github上

预先准备，在config.mts中设置outDir为docs，然后执行打包命令，就会在根目录下生成docs目录，接着git push到github上。
1. 打开仓库的settings
2. 找到pages
3. 选择source branch为master
4. 选择文件目录为docs然后保存即可

接着访问：https://supermalow.github.io/shengwenDoc/

打开后发现我们的文档网站发现是没有样式的，显示有点乱的问题。
问题是出现在我们的网站上套了一层shengwenDoc/后缀的，所以我们在打包的时候对应套上这层后缀即可，注意这一层后缀为你仓库的名称。
那么就是在config.mts中设置base为/shengwenDoc/即可。