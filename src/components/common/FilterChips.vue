<script setup>
/**
 * 可复用的筛选胶囊组：博客标签与电影类型共用此组件。
 *
 * items: [{ value: string, label: string, count?: number }]
 * v-model 绑定当前选中的 value（空字符串代表「全部」）
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
  allLabel: { type: String, default: '全部' },
  showAll: { type: Boolean, default: true },
  showCount: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

function select(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="chips" role="group" aria-label="筛选">
    <button
      v-if="props.showAll"
      type="button"
      class="chip"
      :class="{ 'chip--active': !props.modelValue }"
      :aria-pressed="!props.modelValue"
      @click="select('')"
    >
      {{ props.allLabel }}
    </button>

    <button
      v-for="item in props.items"
      :key="item.value"
      type="button"
      class="chip"
      :class="{ 'chip--active': props.modelValue === item.value }"
      :aria-pressed="props.modelValue === item.value"
      @click="select(item.value)"
    >
      {{ item.label }}
      <span v-if="props.showCount && item.count !== undefined" class="chip__count">
        {{ item.count }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1;
  transition:
    color var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.chip:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

.chip--active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 550;
}

.chip__count {
  font-size: 11px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.chip--active .chip__count {
  color: var(--accent);
  opacity: 0.75;
}
</style>
