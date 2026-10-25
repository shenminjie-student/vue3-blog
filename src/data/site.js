/**
 * 站点级配置：品牌、导航、社交链接与页脚文案。
 * 想改博客的名字 / 导航 / 备案信息，只需要改这里。
 */
export const site = {
  name: 'struct@杰构体',
  shortName: 'struct@杰构体',
  title: 'struct@杰构体 · 个人博客',
  description:
    'struct@杰构体的个人博客：技术随笔、踩坑记录和日常闲谈，以及一些反复观看看的电影。',
  url: 'https://shenminjie.online',
  locale: 'zh-CN',
  author: ' struct@杰构体',
  email: 'nchu.shen@qq.com',
  startYear: 2025,
  nav: [
    { label: '关于我', to: '/', icon: 'user' },
    { label: '博客', to: '/blog', icon: 'feather' },
    { label: '电影', to: '/movies', icon: 'film' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: '邮箱', href: 'nchu.shen@qq.com', icon: 'mail' },
    { label: '站点', href: 'https://shenminjie.online', icon: 'globe' },
  ],
  footer: {
    note: '借助AI工具，使用 Vue 3 + Vite 搭建，文章以 Markdown 编写。',
  },
}

export default site
