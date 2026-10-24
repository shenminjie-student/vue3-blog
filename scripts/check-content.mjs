/**
 * 文章内容校验（构建前执行）
 *
 * 检查项：
 * 1. 每篇文章必须有 title 与合法的 date；
 * 2. tags 必须是非空数组；
 * 3. slug（文件名）不能重复；
 * 4. summary 建议填写。
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.join(root, 'src', 'content', 'posts')

const errors = []
const warnings = []

function parseFrontMatter(raw) {
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw)
  if (!match) return {}
  try {
    return yaml.load(match[1]) || {}
  } catch (error) {
    errors.push(`YAML 解析失败：${error.message}`)
    return {}
  }
}

const files = (await readdir(postsDir)).filter((file) => file.endsWith('.md'))

if (!files.length) {
  warnings.push('src/content/posts 下还没有任何文章')
}

const seenSlugs = new Map()

for (const file of files) {
  const raw = await readFile(path.join(postsDir, file), 'utf8')
  const data = parseFrontMatter(raw)
  const slug = String(data.slug || file.replace(/\.md$/, ''))

  if (!data.title) errors.push(`${file}: 缺少 title`)
  if (!data.date) {
    errors.push(`${file}: 缺少 date`)
  } else {
    const date = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`${file}: date 需要写成 YYYY-MM-DD，当前为「${data.date}」`)
    }
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push(`${file}: tags 必须是非空数组，例如 tags: [技术, Qt]`)
  }

  if (!data.summary) {
    warnings.push(`${file}: 没有写 summary，列表页会自动截取正文开头`)
  }

  if (seenSlugs.has(slug)) {
    errors.push(`${file}: slug「${slug}」与 ${seenSlugs.get(slug)} 重复`)
  } else {
    seenSlugs.set(slug, file)
  }
}

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`)
}

if (errors.length) {
  console.error('\n文章校验未通过：')
  for (const error of errors) {
    console.error(`✗ ${error}`)
  }
  process.exit(1)
}

console.log(`✓ 文章校验通过：${files.length} 篇`)
