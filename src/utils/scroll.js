/**
 * 滚动相关的小工具
 */

/** 读取固定的页头高度，用于锚点偏移 */
function getHeaderOffset() {
  if (typeof window === 'undefined') return 64
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : 64
}

/**
 * 平滑滚动到指定 id 的元素（自动避开吸顶导航）
 * @param {string} id
 * @returns {boolean} 是否找到目标元素
 */
export function scrollToId(id) {
  if (!id || typeof document === 'undefined') return false
  const target = document.getElementById(id)
  if (!target) return false

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 16
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  window.scrollTo({ top, behavior })
  return true
}

/**
 * 拦截文章正文中的锚点点击。
 * 博客使用哈希路由，`href="#id"` 会被路由当成路径跳转，
 * 因此这里统一 preventDefault 后手动滚动。
 * @param {MouseEvent} event
 */
export function handleAnchorClick(event) {
  const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
  if (!anchor) return

  const href = anchor.getAttribute('href') || ''
  const id = decodeURIComponent(href.slice(1))
  if (!id) return

  event.preventDefault()
  scrollToId(id)
}
