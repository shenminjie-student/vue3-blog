import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 静态博客：拆分第三方依赖，避免单文件过大
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('highlight.js')) return 'highlight'
            if (id.includes('markdown-it') || id.includes('js-yaml')) return 'markdown'
            if (id.includes('vue-router') || id.includes('/@vue/') || id.includes('/vue/')) {
              return 'vue-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
