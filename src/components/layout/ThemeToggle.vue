<script setup>
import { useTheme } from '@/composables/useTheme'
import BaseIcon from '../common/BaseIcon.vue'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    :title="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    @click="toggleTheme"
  >
    <span class="theme-toggle__icon" :class="{ 'theme-toggle__icon--dark': isDark }">
      <BaseIcon :name="isDark ? 'moon' : 'sun'" :size="18" />
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  transition:
    color var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.theme-toggle:hover {
  color: var(--text);
  border-color: var(--border-strong);
  background: var(--surface-hover);
}

.theme-toggle__icon {
  display: inline-flex;
  transition: transform 0.35s var(--ease);
}

.theme-toggle__icon--dark {
  transform: rotate(-25deg);
}
</style>
