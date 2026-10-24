<script setup>
import { scrollToId } from '@/utils/scroll'

/**
 * 文章目录（TOC）：根据 Markdown 标题自动生成，桌面端吸顶显示。
 * 使用按钮而非 <a href="#id">，避免与哈希路由冲突。
 */
const props = defineProps({
  headings: { type: Array, default: () => [] },
  activeId: { type: String, default: '' },
})

const emit = defineEmits(['navigate'])

function handleClick(id) {
  scrollToId(id)
  emit('navigate', id)
}
</script>

<template>
  <nav v-if="props.headings.length" class="toc" aria-label="文章目录">
    <p class="toc__title">目录</p>
    <ul class="toc__list">
      <li v-for="heading in props.headings" :key="heading.id">
        <button
          type="button"
          class="toc__link"
          :class="[
            `toc__link--h${heading.level}`,
            { 'toc__link--active': props.activeId === heading.id },
          ]"
          @click="handleClick(heading.id)"
        >
          {{ heading.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc {
  position: sticky;
  top: calc(var(--header-height) + 24px);
  max-height: calc(100svh - var(--header-height) - 48px);
  overflow-y: auto;
  padding-left: var(--space-4);
  border-left: 1px solid var(--border);
}

.toc__title {
  margin-bottom: var(--space-3);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.toc__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc__link {
  display: block;
  width: 100%;
  padding: 5px 8px;
  border-radius: var(--radius-sm);
  text-align: left;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  transition:
    color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.toc__link:hover {
  color: var(--text);
  background: var(--bg-soft);
}

.toc__link--h3 {
  padding-left: 20px;
  font-size: 12.5px;
}

.toc__link--active {
  color: var(--accent);
  background: var(--accent-soft);
  font-weight: 550;
}
</style>
