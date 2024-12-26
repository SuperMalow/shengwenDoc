import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "聖文",
  description: "聖文的档案室",
  outDir: 'docs', // 打包输出的目录
  base: '/shengwenDoc/', // 部署到github pages的路径，也就是你的仓库名称
  lang: 'zh',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/Linux文件常用命令.html' }
    ],
    logo: './public/logo.jpg',
    sidebar: [
      {
        text: '文档',
        items: [
          { text: 'Linux常用命令', link: '/Linux文件常用命令' },
          { text: 'Tmux和Vim的使用技巧', link: '/Tmux和Vim' },
          { text: 'Git常用命令', link: '/Git' },
          { text: 'SSH和SCP的使用', link: '/SSH和SCP命令' },
          { text: 'TypeScript学习笔记', link: '/typescriptNote' },
          { text: 'Vitepress部署笔记', link: '/vitepress' },
          { text: 'Electron的环境集成', link: '/Electron开发环境的集成' },
        ]
      }
    ],

    footer: {
      copyright: "Copyright © 2024-present SuperMalow and Shengwen"
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: "最后一次更新",
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'youtube', link: 'https://space.bilibili.com/83766565' },
      { icon: 'github', link: 'https://github.com/SuperMalow' }
    ]
  }
})
