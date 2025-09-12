import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "聖文",
  description: "聖文的档案室",
  outDir: 'docs', // 打包输出的目录
  base: '/shengwenDoc/', // 部署到github pages的路径，也就是你的仓库名称
  ignoreDeadLinks: true, // 忽略死链接
  lang: 'zh',
  head: [
    ['link', { rel: 'icon', type: 'image/jpeg', sizes: '32x32', href: '/shengwenDoc/logo.jpg' }],
    ['link', { rel: 'apple-touch-icon', type: 'image/jpeg', sizes: '180x180', href: '/shengwenDoc/logo.jpg' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/linux/Linux文件常用命令.html' }
    ],
    logo: '/logo.jpg',
    sidebar: [
      {
        text: 'Linux',
        collapsed: true,
        items: [
          { text: "常用命令", link: '/linux/Linux文件常用命令.html' },
          { text: "SSH和SCP", link: '/linux/SSH和SCP命令.html' },
          { text: "Tmux和Vim", link: '/linux/Tmux和Vim.html' }
        ]
      }, {
        text: "Frontend",
        collapsed: true,
        items: [
          { text: "Typescript", link: '/frontend/TypescriptNote.html' },
          { text: "Vue3", link: '/frontend/Vue3Note.html' },
          { text: "Pinia", link: '/frontend/PiniaNote.html' },
          { text: "Electron", link: '/frontend/ElectronNote.html' },
          { text: "VueRouter4", link: '/frontend/VueRouter.html' },
        ]
      },
      {
        text: "Backend",
        collapsed: true,
        items: [
          {
            text: "Js",
            collapsed: true,
            items: [
              { text: "Js", link: '/backend/JS/JsNote.html' },
              { text: "NestJs", link: '/backend/JS/NestJsNote.html' },
              { text: "NodeJs", link: '/backend/JS/NodeJsNote.html' },
            ]
          },
          {
            text: "Python",
            collapsed: true,
            items: [
              { text: "Django 基本使用", link: '/backend/Python/01-Django入门.html' },
              { text: "DRF 基本使用", link: '/backend/Python/02-DRF入门.html' },
              { text: "Asyncio 基本使用", link: '/backend/Python/asyncio基础.html' },
              { text: "Async Django 基本使用", link: '/backend/Python/asyncDjango.html' },
              { text: "Async DRF 基本使用", link: '/backend/Python/asyncDRF.html' },
              { text: "FastAPI基本使用", link: '/backend/Python/fastApi.html' },
            ]
          },
          {
            text: "Practical Projects",
            collapsed: true,
            items: [
              { text: "Django RestFramework 自定义用户模型", link: '/backend/Django/DRF自定义用户模型.html' },
            ]
          },
        ]
      },
      {
        text: "Tools",
        collapsed: true,
        items: [
          { text: "Git", link: '/tools/GitNote.html' },
          { text: "Vitepress", link: '/tools/VitepressNote.html' },
          { text: "Docker 基本使用", link: '/tools/Docker的基本配置.html' },
          { text: "uv使用教程", link: '/tools/uv使用教程.html' },
          {
            text: "Nginx",
            collapsed: true,
            items: [
              { text: "Nginx 基本使用", link: '/tools/NginxNote.html' },
              { text: "配置ssl证书", link: '/tools/配置ssl证书.html' },
            ]
          },
          { text: "OhterAriticle", link: '/tools/OtherAriticle.html' },
        ]
      },
      {
        text: "Algorithm",
        collapsed: true,
        items: [
          {
            text: "opencv",
            link: '/algorithm/opencv/OpencvNote.html',
          },
          {
            text: "machineLearning",
            link: '/algorithm/machinelearning/MLNote.html',
          },
          {
            text: "classical",
            link: '/algorithm/classical/classical.html',
          },
          {
            text: "combat",
            link: '/algorithm/combat/combat.html',
            // items: [
            //   {text: "combat", link: '/algorithm/combat/combat.html'},
            // ]
          },
        ]
      },
      {
        text: "Project",
        collapsed: true,
        items: [
          { text: "个人直播间", link: '/project/个人直播间项目.html' },
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
