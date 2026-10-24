<script setup>
import BaseIcon from '../common/BaseIcon.vue'

/**
 * 履历时间线：工作与教育共用，通过 type 区分图标与配色
 * items: [{ period, title, org, type, description, highlights }]
 */
defineProps({
  items: { type: Array, required: true },
})

const ICON_BY_TYPE = {
  work: 'briefcase',
  edu: 'graduation',
}
</script>

<template>
  <ol class="timeline">
    <li
      v-for="item in items"
      :key="`${item.period}-${item.title}`"
      class="timeline__item"
      :class="`timeline__item--${item.type}`"
    >
      <span class="timeline__marker" aria-hidden="true">
        <BaseIcon :name="ICON_BY_TYPE[item.type] || 'briefcase'" :size="14" />
      </span>

      <div class="timeline__card">
        <div class="timeline__head">
          <p class="timeline__period mono">{{ item.period }}</p>
          <span v-if="item.type" class="timeline__type">
            {{ item.type === 'work' ? '工作' : '教育' }}
          </span>
        </div>

        <h3 class="timeline__title">{{ item.title }}</h3>
        <p class="timeline__org">{{ item.org }}</p>
        <p v-if="item.description" class="timeline__desc">{{ item.description }}</p>

        <ul v-if="item.highlights?.length" class="timeline__tags">
          <li v-for="tag in item.highlights" :key="tag" class="timeline__tag">{{ tag }}</li>
        </ul>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 7px;
  width: 2px;
  background: linear-gradient(var(--border-strong), var(--border));
  border-radius: 2px;
}

.timeline__item {
  position: relative;
}

.timeline__marker {
  position: absolute;
  left: -30px;
  top: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
  z-index: 1;
}

.timeline__item--work .timeline__marker {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

.timeline__item--edu .timeline__marker {
  border-color: var(--border-strong);
  color: var(--text-muted);
}

.timeline__card {
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition:
    border-color var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease),
    transform var(--duration) var(--ease);
}

.timeline__card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.timeline__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.timeline__period {
  font-size: 12.5px;
  color: var(--accent);
  letter-spacing: 0.02em;
}

.timeline__type {
  padding: 0 7px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-faint);
}

.timeline__title {
  margin-top: 6px;
  font-size: 17px;
}

.timeline__org {
  margin-top: 2px;
  font-size: 13.5px;
  color: var(--text-muted);
}

.timeline__desc {
  margin-top: var(--space-2);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.75;
}

.timeline__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-3);
  list-style: none;
}

.timeline__tag {
  padding: 1px 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--text-muted);
}
</style>
