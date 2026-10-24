import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'

// 按需注册语言，避免把 highlight.js 全量语言包打进产物
import bash from 'highlight.js/lib/languages/bash'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

const languages = {
  bash,
  cpp,
  csharp,
  css,
  diff,
  ini,
  javascript,
  json,
  markdown,
  python,
  sql,
  typescript,
  xml,
  yaml,
}

for (const [name, definition] of Object.entries(languages)) {
  hljs.registerLanguage(name, definition)
}

const ALIASES = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  sh: 'bash',
  shell: 'bash',
  console: 'bash',
  html: 'xml',
  vue: 'xml',
  c: 'cpp',
  'c++': 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  py: 'python',
  yml: 'yaml',
  toml: 'ini',
  md: 'markdown',
}

function resolveLanguage(lang) {
  if (!lang) return ''
  const normalized = String(lang).trim().toLowerCase()
  return ALIASES[normalized] || normalized
}

function highlight(code, lang) {
  const language = resolveLanguage(lang)
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value
    } catch {
      /* 高亮失败时回落到纯文本，不能让整篇文章渲染失败 */
    }
  }
  return md.utils.escapeHtml(code)
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{}|\\:;"'<>,.?/·—–\s]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

const md = new MarkdownIt({
  // 博客内容由仓库作者本人维护，允许内联 HTML（例如 <kbd>、<details>）
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight: (code, lang) => highlight(code, lang),
})

/* 代码块：带语言标签与复制按钮的外壳（复制逻辑在 BlogDetailView 中委托处理） */
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const lang = token.info ? token.info.trim().split(/\s+/)[0] : ''
  const language = resolveLanguage(lang)
  const label = language || 'text'
  const highlighted = highlight(token.content, lang)

  return [
    '<div class="code-block">',
    `<div class="code-block__bar"><span class="code-block__lang">${md.utils.escapeHtml(label)}</span>`,
    '<button type="button" class="code-block__copy" data-code-copy>复制</button></div>',
    `<pre class="hljs"><code class="language-${md.utils.escapeHtml(label)}">${highlighted}</code></pre>`,
    '</div>',
  ].join('')
}

/* 标题：生成 id 并收集目录，供文章页右侧 TOC 使用 */
md.renderer.rules.heading_open = (tokens, idx, options, env) => {
  const token = tokens[idx]
  const inline = tokens[idx + 1]
  const text = inline && inline.type === 'inline' ? inline.content : ''
  const id = slugify(text) || `section-${idx}`
  token.attrSet('id', id)

  if (env && Array.isArray(env.headings) && /^h[23]$/.test(token.tag)) {
    env.headings.push({ id, text, level: Number(token.tag[1]) })
  }

  return `<${token.tag}${md.renderer.renderAttrs(token)}>`
}

md.renderer.rules.heading_close = (tokens, idx) => {
  // heading_close 自身没有 id，取前面 heading_open 上写入的锚点
  const openToken = tokens[idx - 2]
  const id = (openToken && openToken.attrGet && openToken.attrGet('id')) || ''
  return `<a class="header-anchor" href="#${id}" aria-hidden="true">#</a></${tokens[idx].tag}>`
}

/* 链接：站外链接自动新窗口打开 */
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet('href') || ''
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

/* 图片：懒加载 */
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('loading', 'lazy')
  tokens[idx].attrSet('decoding', 'async')
  return self.renderToken(tokens, idx, options)
}

/**
 * 渲染 Markdown 为 HTML
 * @param {string} content Markdown 正文
 * @returns {{ html: string, headings: {id: string, text: string, level: number}[] }}
 */
export function renderMarkdown(content) {
  const env = { headings: [] }
  const html = md.render(content || '', env)
  return { html, headings: env.headings }
}

export { slugify }
export default md
