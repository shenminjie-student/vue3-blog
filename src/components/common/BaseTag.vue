<script setup>
/**
 * 通用标签/胶囊组件：
 * - to       站内路由（如按标签筛选：/blog?tag=技术）
 * - href     站外链接
 * - 都不传时渲染为静态标签
 */
const props = defineProps({
  label: { type: String, required: true },
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  tone: { type: String, default: 'default' }, // default | accent
  size: { type: String, default: 'md' }, // sm | md
  count: { type: [Number, String], default: null },
})
</script>

<template>
  <RouterLink
    v-if="props.to"
    :to="props.to"
    class="tag"
    :class="[`tag--${props.tone}`, `tag--${props.size}`]"
  >
    {{ props.label }}
    <span v-if="props.count !== null" class="tag__count">{{ props.count }}</span>
  </RouterLink>

  <a
    v-else-if="props.href"
    :href="props.href"
    class="tag"
    :class="[`tag--${props.tone}`, `tag--${props.size}`]"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ props.label }}
    <span v-if="props.count !== null" class="tag__count">{{ props.count }}</span>
  </a>

  <span v-else class="tag" :class="[`tag--${props.tone}`, `tag--${props.size}`]">
    {{ props.label }}
    <span v-if="props.count !== null" class="tag__count">{{ props.count }}</span>
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.5;
  white-space: nowrap;
  transition:
    color var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.tag--sm {
  padding: 1px 8px;
  font-size: 11.5px;
}

.tag--accent {
  border-color: color-mix(in srgb, var(--accent) 34%, transparent);
  background: var(--accent-soft);
  color: var(--accent);
}

a.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

.tag__count {
  color: var(--text-faint);
  font-size: 0.9em;
  font-variant-numeric: tabular-nums;
}
</style>
