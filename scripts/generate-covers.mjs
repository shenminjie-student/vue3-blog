/**
 * 生成电影封面（抽象海报风格）
 *
 * 用法：npm run covers
 * 会根据 movies.js 里的片名生成 public/covers/<id>.svg，
 * 想换成真实海报时，直接把同名文件替换成 jpg/png 并修改数据里的 cover 路径即可。
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { movies } from '../src/data/movies.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(root, 'public', 'covers')

function hashString(value) {
  let hash = 0
  for (const char of String(value)) {
    hash = (hash * 31 + char.codePointAt(0)) >>> 0
  }
  return hash
}

function palette(id) {
  const hue = hashString(id) % 360
  return {
    from: `hsl(${hue} 58% 24%)`,
    to: `hsl(${(hue + 58) % 360} 72% 44%)`,
    accent: `hsl(${(hue + 186) % 360} 82% 64%)`,
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function poster(movie) {
  const colors = palette(movie.id)
  const title = escapeXml(movie.title)
  const original = escapeXml(movie.originalTitle)
  const meta = escapeXml(`${movie.year} · ${movie.director}`)

  const titleSize = movie.title.length > 6 ? 54 : 64
  const originalSize = movie.originalTitle.length > 24 ? 11 : 13
  const titleLength = movie.title.length

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" role="img" aria-label="${escapeXml(movie.title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors.from}" />
      <stop offset="1" stop-color="${colors.to}" />
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.12" r="0.85">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.34" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0.35" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0d12" stop-opacity="0" />
      <stop offset="1" stop-color="#0b0d12" stop-opacity="0.68" />
    </linearGradient>
  </defs>

  <rect width="640" height="360" fill="url(#bg)" />
  <rect width="640" height="360" fill="url(#glow)" />

  <g fill="none" stroke="${colors.accent}" stroke-opacity="0.45">
    <circle cx="512" cy="74" r="124" stroke-width="1.4" />
    <circle cx="512" cy="74" r="84" stroke-width="1" stroke-opacity="0.3" />
  </g>
  <circle cx="512" cy="74" r="48" fill="${colors.accent}" fill-opacity="0.16" />

  <g font-family="ui-monospace, SFMono-Regular, Consolas, monospace" font-size="11" letter-spacing="4" fill="#ffffff" fill-opacity="0.55">
    <text x="48" y="52">WATCHLIST</text>
  </g>

  <line x1="48" y1="66" x2="132" y2="66" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1" />

  <rect y="208" width="640" height="152" fill="url(#fade)" />

  <text x="48" y="286" font-family="'PingFang SC','Microsoft YaHei','Noto Sans SC',system-ui,sans-serif" font-size="${titleSize}" font-weight="700" fill="#ffffff" letter-spacing="-1">${title}</text>

  <text x="50" y="${titleLength > 7 ? 314 : 318}" font-family="ui-monospace, SFMono-Regular, Consolas, monospace" font-size="${originalSize}" letter-spacing="2.4" fill="#ffffff" fill-opacity="0.66">${original.toUpperCase()}</text>

  <text x="48" y="344" font-family="system-ui, 'PingFang SC', sans-serif" font-size="12" fill="#ffffff" fill-opacity="0.5">${meta}</text>
</svg>
`
}

await mkdir(outputDir, { recursive: true })

let count = 0
for (const movie of movies) {
  const file = path.join(outputDir, `${movie.id}.svg`)
  await writeFile(file, poster(movie), 'utf8')
  count += 1
}

console.log(`已生成 ${count} 张封面 → public/covers/`)
