<script setup>
import BaseIcon from '../common/BaseIcon.vue'

/**
 * 基本信息网格：label + value，value 可带链接与图标
 * items: [{ label, value, icon?, href? }]
 */
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <dl class="info-grid">
    <div v-for="item in items" :key="item.label" class="info">
      <span v-if="item.icon" class="info__icon">
        <BaseIcon :name="item.icon" :size="15" />
      </span>
      <dt class="info__label">{{ item.label }}</dt>
      <dd class="info__value">
        <a v-if="item.href" :href="item.href" class="info__link">{{ item.value }}</a>
        <template v-else>{{ item.value }}</template>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  padding: 1px;
  border-radius: var(--radius-lg);
  background: var(--border);
  overflow: hidden;
}

.info {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 4px;
  padding: var(--space-3) var(--space-4);
  background: var(--surface);
}

.info__icon {
  grid-row: 1 / span 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-top: 2px;
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent);
}

.info__label {
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

.info__value {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--text);
  overflow-wrap: anywhere;
}

.info__link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--accent-soft);
}

@media (max-width: 560px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
