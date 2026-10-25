---
title: 用 Vite 和 Markdown 搭一个不需要后端的小站
date: 2025-05-02
tags: [技术, 前端, Vite]
summary: 不接 CMS、不租数据库，把 Markdown 文件直接打包进前端产物。顺便聊聊为什么最后选了 import.meta.glob。
---

## 需求只有一句话

「想写文章的时候，新建一个 `.md` 文件就行。」

这句话拆开来看，其实包含了三个约束：

1. 写作不依赖后台；
2. 发布过程要能进 Git；
3. 构建产物必须是纯静态文件。

满足这三点的方案很多，最后我选择了 **Vite + Vue 3 + `import.meta.glob`**。

## 文章是怎么被找到的

Vite 支持在构建期把文件内容直接读成字符串：

```js
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

console.log(Object.keys(modules)) // ['../content/posts/hello.md', ...]
```

`eager: true` 表示不生成异步 chunk，而是直接打进主包。对几十篇博客来说完全够用，而且省掉了「点击文章 → 等待加载」的体验断点。

## Front Matter 用 YAML

每篇文章开头写一段元信息，交给 `js-yaml` 解析：

```yaml
---
title: 用 Vite 和 Markdown 搭一个不需要后端的小站
date: 2025-05-02
tags: [技术, 前端, Vite]
summary: 一段摘要，会显示在列表页。
---
```

解析代码只有十几行：

```js
import yaml from 'js-yaml'

function parseFrontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, content: raw }
  return { data: yaml.load(match[1]) || {}, content: raw.slice(match[0].length) }
}
```

## 渲染 Markdown

`markdown-it` 的插件生态很成熟，标题锚点、代码高亮、外链处理都能通过覆写 renderer 实现：

```js
md.renderer.rules.heading_open = (tokens, idx) => {
  const text = tokens[idx + 1].content
  tokens[idx].attrSet('id', slugify(text))
  return `<${tokens[idx].tag}${md.renderer.renderAttrs(tokens[idx])}>`
}
```

代码高亮用 `highlight.js` 的按需注册，只引入实际用到的语言，产物会小很多：

```js
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('cpp', cpp)
```

## 目录结构

```text
src/
├── content/posts/     # 文章
├── components/        # 可复用组件
├── composables/       # 跨页面逻辑
├── data/              # 个人资料、电影清单
└── views/             # 页面
```

一个原则：**数据、逻辑、视图分开**。改个人信息不应该动组件，改组件不应该碰数据。

## 几个容易忽略的细节

- **时区**：`new Date('2025-05-02')` 是 UTC 时间，在东八区之外的机器上会显示成前一天。手动拆年月日最稳。
- **锚点与哈希路由**：如果路由用哈希模式，文章里的 `href="#id"` 会把路由冲掉，必须自己拦截点击。
- **草稿**：用 `draft: true` 标记，开发环境显示、生产环境过滤，写完到发布之间留出余地。

## 值不值得

如果你的文章数量在三位数以内、更新频率按周算，这个方案比自己搭一套 CMS 轻松太多。反之，如果要做多作者协作、评论、全文检索，那就该考虑正经的后端或者现成的静态博客生成器了。
