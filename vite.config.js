import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 注意这里改成了从 unplugin-vue-markdown/vite 引入
import Markdown from 'unplugin-vue-markdown/vite'
// MarkdownItAnchor 用于文章导航栏
import MarkdownItAnchor from 'markdown-it-anchor'
// UnoCSS 用于图标
import UnoCSS from 'unocss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    UnoCSS(),
  ],
  // 关键：告诉 Vite，.md 文件就是纯静态资源，不要乱编译
  assetsInclude: ['**/*.md'],
})