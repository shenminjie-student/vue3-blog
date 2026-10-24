/**
 * 文本工具：日期格式化、阅读时长估算
 */

const WORDS_PER_MINUTE = 220
const CJK_PER_MINUTE = 350

/**
 * 安全解析 YYYY-MM-DD / YYYY/MM/DD / ISO 字符串为本地时间 Date
 * 避免 `new Date('2025-01-01')` 被当作 UTC 造成时区偏移。
 * @param {string|Date|number} input
 * @returns {Date|null}
 */
export function parseDate(input) {
  if (!input) return null
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input

  const text = String(input).trim()
  const match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(text)
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * 输出为 `2025 年 3 月 9 日`
 * @param {string|Date} input
 * @returns {string}
 */
export function formatDate(input) {
  const date = parseDate(input)
  if (!date) return ''
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}

/**
 * 输出为机器可读的 `2025-03-09`，用于 <time datetime>
 * @param {string|Date} input
 * @returns {string}
 */
export function toISODate(input) {
  const date = parseDate(input)
  if (!date) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * 估算阅读时长（分钟）。中文按字数、英文按词数分别计算。
 * @param {string} markdown
 * @returns {number}
 */
export function estimateReadingTime(markdown) {
  const text = String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')

  const cjkCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const wordCount = text
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = cjkCount / CJK_PER_MINUTE + wordCount / WORDS_PER_MINUTE
  return Math.max(1, Math.round(minutes))
}

/**
 * 生成纯文本摘要：去掉 Markdown 语法标记，超长截断
 * @param {string} markdown
 * @param {number} limit
 * @returns {string}
 */
export function excerpt(markdown, limit = 120) {
  const text = String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= limit) return text
  return `${text.slice(0, limit).trimEnd()}…`
}

/**
 * 按年份倒序分组
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string|Date} getDate
 * @returns {Map<string, T[]>}
 */
export function groupByYear(items, getDate) {
  const groups = new Map()
  for (const item of items) {
    const date = parseDate(getDate(item))
    const year = date ? String(date.getFullYear()) : '其他'
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(item)
  }
  return groups
}
