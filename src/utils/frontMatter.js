import yaml from 'js-yaml'

/**
 * Markdown Front Matter 解析
 *
 * 支持的格式：
 * ---
 * title: 标题
 * date: 2025-01-01
 * tags: [技术, Qt]
 * summary: 摘要
 * ---
 * 正文……
 */

/**
 * @param {string} raw Markdown 原始内容
 * @returns {{ data: Record<string, any>, content: string }}
 */
export function parseFrontMatter(raw) {
  const text = String(raw ?? '').replace(/^\uFEFF/, '')
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text)

  if (!match) {
    return { data: {}, content: text }
  }

  let data = {}
  try {
    const parsed = yaml.load(match[1])
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      data = parsed
    }
  } catch (error) {
    console.warn('[front-matter] 解析失败，已按无元数据处理：', error.message)
  }

  return {
    data,
    content: text.slice(match[0].length),
  }
}
