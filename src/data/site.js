/**
 * 站点级配置：品牌、导航、社交链接与页脚文案。
 * 想改博客的名字 / 导航 / 备案信息，只需要改这里。
 */
export const site = {
  name: 'struct@杰构体',
  shortName: '杰构体',
  title: 'struct@杰构体 · 个人博客',
  description:
    'Qt / C++ 开发工程师的个人博客：技术随笔、生活闲谈，以及一些反复重看的电影。',
  url: 'https://shenminjie.online',
  locale: 'zh-CN',
  author: '沈敏杰',
  email: 'hello@example.com',
  startYear: 2022,
  nav: [
    { label: '关于我', to: '/', icon: 'user' },
    { label: '博客', to: '/blog', icon: 'feather' },
    { label: '电影', to: '/movies', icon: 'film' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: '邮箱', href: 'mailto:hello@example.com', icon: 'mail' },
    { label: '站点', href: 'https://shenminjie.online', icon: 'globe' },
  ],
  footer: {
    note: '用 Vue 3 + Vite 手工搭建，文章以 Markdown 编写。',
  },
}

export default site
