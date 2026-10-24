/**
 * 与哔哩哔哩相关的工具函数
 */

const BILIBILI_SEARCH = 'https://search.bilibili.com/all'

/**
 * 获取影片的 B 站观看地址：
 * 优先使用数据里配置的 bilibiliUrl（真实的播放页 BV 号），
 * 否则退化为按片名搜索的链接，保证任何时候点击都能落到 B 站。
 * @param {{ title: string, bilibiliUrl?: string, bilibiliKeyword?: string }} movie
 * @returns {string}
 */
export function getBilibiliUrl(movie) {
  if (movie?.bilibiliUrl) return movie.bilibiliUrl
  const keyword = movie?.bilibiliKeyword || movie?.title || ''
  return `${BILIBILI_SEARCH}?keyword=${encodeURIComponent(keyword)}`
}

/**
 * 片长格式化：132 → `2 小时 12 分`
 * @param {number} minutes
 * @returns {string}
 */
export function formatDuration(minutes) {
  const total = Number(minutes)
  if (!Number.isFinite(total) || total <= 0) return ''

  const hours = Math.floor(total / 60)
  const mins = total % 60

  if (hours <= 0) return `${mins} 分钟`
  if (mins === 0) return `${hours} 小时`
  return `${hours} 小时 ${mins} 分`
}

/**
 * 片单排序方式，供下拉框使用
 */
export const movieSortOptions = [
  { value: 'year-desc', label: '最新上映' },
  { value: 'score-desc', label: '评分最高' },
  { value: 'title-asc', label: '片名顺序' },
]

/**
 * 按给定方式排序（不修改原数组）
 * @template T
 * @param {T[]} list
 * @param {string} sort
 * @returns {T[]}
 */
export function sortMovies(list, sort) {
  const sorted = [...list]
  switch (sort) {
    case 'score-desc':
      return sorted.sort((a, b) => b.score - a.score || b.year - a.year)
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
    case 'year-desc':
    default:
      return sorted.sort((a, b) => b.year - a.year || b.score - a.score)
  }
}
