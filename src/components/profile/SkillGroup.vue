<script setup>
import BaseIcon from '../common/BaseIcon.vue'

/**
 * 技能分组：组内每项用 5 段进度条表示熟练度
 * group: { group, icon, items: [{ name, level, note }] }
 */
defineProps({
  group: { type: Object, required: true },
})

function levelText(level) {
  return ['了解', '入门', '可以上手', '熟练', '精通'][Math.min(4, Math.max(0, level - 1))]
}
</script>

<template>
  <section class="skill-group">
    <header class="skill-group__head">
      <span class="skill-group__icon">
        <BaseIcon :name="group.icon || 'code'" :size="16" />
      </span>
      <h3 class="skill-group__title">{{ group.group }}</h3>
    </header>

    <ul class="skill-group__list">
      <li v-for="item in group.items" :key="item.name" class="skill">
        <div class="skill__top">
          <span class="skill__name">{{ item.name }}</span>
          <span class="skill__level">{{ levelText(item.level) }}</span>
        </div>

        <div
          class="skill__bar"
          role="meter"
          :aria-valuenow="item.level"
          aria-valuemin="1"
          aria-valuemax="5"
          :aria-label="`${item.name} 熟练度`"
        >
          <span
            v-for="step in 5"
            :key="step"
            class="skill__segment"
            :class="{ 'skill__segment--on': step <= item.level }"
          />
        </div>

        <p v-if="item.note" class="skill__note">{{ item.note }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.skill-group {
  padding: var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition:
    border-color var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);
}

.skill-group:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.skill-group__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: var(--space-4);
  border-bottom: 1px dashed var(--border);
}

.skill-group__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent);
}

.skill-group__title {
  font-size: 15.5px;
}

.skill-group__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.skill__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.skill__name {
  font-size: 14px;
  font-weight: 550;
  color: var(--text-strong);
}

.skill__level {
  font-size: 11.5px;
  color: var(--text-faint);
}

.skill__bar {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.skill__segment {
  height: 4px;
  flex: 1;
  border-radius: 999px;
  background: var(--border);
  transition: background-color 0.3s var(--ease);
}

.skill__segment--on {
  background: var(--accent);
}

.skill__note {
  margin-top: 6px;
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
