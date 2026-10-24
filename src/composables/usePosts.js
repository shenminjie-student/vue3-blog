import { computed } from 'vue'
import { parseFrontMatter } from '@/utils/frontMatter'
import { excerpt, estimateReadingTime, formatDate, parseDate, toISODate } from '@/utils/text'

/**
 * 构建期将所有 Markdown 文章作为原始字符串打包进来。
 * eager + raw 的方式让文章元数据在模块加载时一次性解析完成，
 * 因此博客列表不需要任何运行时请求，天然适配纯静态托管。
 */
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const isDev = import.meta.env.DEV

/** 统一标签格式：支持 `tags: [技术, Qt]` 与 `tags: 技术, Qt` 两种写法 */
function normalizeTags(tags) {
  if (!tags) return []
  const list = Array.isArray(tags) ? tags : String(tags).split(/[,，、]+/)
  return [...new Set(list.map((tag) => String(tag).trim()).filter(Boolean))]
}

function createPost(path, raw) {
  const file = path.split('/').pop().replace(/\.md$/i, '')
  const { data, content } = parseFrontMatter(raw)
  const date = data.date || ''

  return {
    slug: String(data.slug || file),
    title: data.title || file,
    date,
    dateText: formatDate(date),
    isoDate: toISODate(date),
    timestamp: parseDate(date)?.getTime() ?? 0,
    tags: normalizeTags(data.tags),
    summary: data.summary || excerpt(content, 110),
    cover: data.cover || '',
    draft: Boolean(data.draft),
    pinned: Boolean(data.pinned),
    readingTime: estimateReadingTime(content),
    content,
  }
}

const byDateDesc = (a, b) => {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
  return b.timestamp - a.timestamp
}

/** 全站文章（按置顶 + 时间倒序），开发环境包含草稿 */
const allPosts = Object.entries(modules)
  .map(([path, raw]) => createPost(path, raw))
  .filter((post) => isDev || !post.draft)
  .sort(byDateDesc)

/** 标签索引：带文章数量，按热度排序 */
const tagIndex = computed(() => {
  const counter = new Map()
  for (const post of allPosts) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) || 0) + 1)
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
})

/**
 * 博客数据源：列表、标签索引、相邻文章与相关推荐都在这里统一计算，
 * 页面只消费数据，不重复实现筛选逻辑。
 */
export function usePosts() {
  const posts = computed(() => allPosts)

  const tags = computed(() => tagIndex.value)

  function getPost(slug) {
    return allPosts.find((post) => post.slug === slug) || null
  }

  /** 文章在列表中的前后邻居 */
  function getNeighbors(slug) {
    const index = allPosts.findIndex((post) => post.slug === slug)
    if (index === -1) return { newer: null, older: null }
    return {
      newer: index > 0 ? allPosts[index - 1] : null,
      older: index < allPosts.length - 1 ? allPosts[index + 1] : null,
    }
  }

  /** 基于共享标签的相关文章推荐 */
  function getRelated(slug, limit = 2) {
    const current = getPost(slug)
    if (!current) return []

    return allPosts
      .filter((post) => post.slug !== slug)
      .map((post) => ({
        post,
        score: post.tags.filter((tag) => current.tags.includes(tag)).length,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.post.timestamp - a.post.timestamp)
      .slice(0, limit)
      .map((item) => item.post)
  }

  return { posts, tags, getPost, getNeighbors, getRelated }
}
