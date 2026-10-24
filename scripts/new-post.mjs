/**
 * 新建一篇 Markdown 文章
 *
 * 用法：
 *   npm run new:post -- "文章标题"
 *   npm run new:post -- "QML 布局笔记" --tags 技术,Qt
 */
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.join(root, 'src', 'content', 'posts')

function parseArgs(argv) {
  const positional = []
  let tags = []

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--tags' || arg === '-t') {
      tags = String(argv[i + 1] || '')
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
      i += 1
    } else if (arg.startsWith('--tags=')) {
      tags = arg
        .slice('--tags='.length)
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    } else {
      positional.push(arg)
    }
  }

  return { title: positional.join(' ').trim(), tags }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function today() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** 生成文件名：保留中文，空格与特殊字符替换为连字符 */
function slugify(title) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[\s~`!@#$%^&*()+=[\]{}|\\:;"'<>,.?/]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  )
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

const { title, tags } = parseArgs(process.argv.slice(2))

if (!title) {
  console.error('缺少文章标题。用法：npm run new:post -- "文章标题" [--tags 技术,Qt]')
  process.exit(1)
}

await mkdir(postsDir, { recursive: true })

let slug = slugify(title)
let target = path.join(postsDir, `${slug}.md`)
let index = 2

while (await exists(target)) {
  target = path.join(postsDir, `${slug}-${index}.md`)
  index += 1
}

const tagLine = tags.length ? `[${tags.join(', ')}]` : '[闲谈]'

const template = `---
title: ${title}
date: ${today()}
tags: ${tagLine}
summary: 一句话摘要，会显示在文章列表里。
draft: true
---

## 小标题

正文从这里开始。

\`\`\`cpp
int main() {
    return 0;
}
\`\`\`

> 写完之后记得把 draft 改成 false。
`

await writeFile(target, template, 'utf8')

console.log(`已创建文章：src/content/posts/${path.basename(target)}`)
console.log('提示：文件默认标记为 draft，发布前请改为 draft: false')
