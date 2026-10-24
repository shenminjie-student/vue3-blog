<script setup>
import BaseIcon from './BaseIcon.vue'

/**
 * 空状态：列表/详情查无内容时统一展示
 */
defineProps({
  icon: { type: String, default: 'search' },
  title: { type: String, default: '这里什么都没有' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  actionTo: { type: [String, Object], default: null },
})
</script>

<template>
  <div class="empty">
    <span class="empty__icon">
      <BaseIcon :name="icon" :size="22" />
    </span>
    <h3 class="empty__title">{{ title }}</h3>
    <p v-if="description" class="empty__desc">{{ description }}</p>
    <RouterLink v-if="actionLabel && actionTo" :to="actionTo" class="btn btn--sm empty__action">
      {{ actionLabel }}
    </RouterLink>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-8) var(--space-5);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--bg-soft);
  text-align: center;
}

.empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-2);
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-faint);
}

.empty__title {
  font-size: 16px;
}

.empty__desc {
  max-width: 42ch;
  color: var(--text-muted);
  font-size: 14px;
}

.empty__action {
  margin-top: var(--space-3);
}
</style>
