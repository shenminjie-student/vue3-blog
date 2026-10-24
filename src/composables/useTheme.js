import { computed, ref } from 'vue'

const STORAGE_KEY = 'blog-theme'
const THEMES = ['light', 'dark']

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light'
  const applied = document.documentElement.dataset.theme
  return THEMES.includes(applied) ? applied : 'light'
}

const theme = ref(getInitialTheme())

function applyTheme(next) {
  if (!THEMES.includes(next)) return
  theme.value = next

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = next
  }

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* 隐私模式下忽略写入失败 */
  }
}

/**
 * 全站共享的主题状态（单例）
 */
export function useTheme() {
  return {
    theme,
    isDark: computed(() => theme.value === 'dark'),
    setTheme: applyTheme,
    toggleTheme: () => applyTheme(theme.value === 'dark' ? 'light' : 'dark'),
  }
}
