<script setup>
/**
 * 搜索框：v-model 双向绑定，带清除按钮
 */
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索…' },
  id: { type: String, default: 'search-input' },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (next) => emit('update:modelValue', next),
})
</script>

<template>
  <div class="search">
    <BaseIcon name="search" :size="16" class="search__icon" />
    <input
      :id="props.id"
      v-model="value"
      type="search"
      class="search__input"
      :placeholder="props.placeholder"
      autocomplete="off"
      spellcheck="false"
    />
    <button
      v-if="props.modelValue"
      type="button"
      class="search__clear"
      aria-label="清空搜索"
      @click="value = ''"
    >
      <BaseIcon name="close" :size="14" />
    </button>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 320px;
  height: 38px;
  padding: 0 10px 0 34px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition: border-color var(--duration) var(--ease);
}

.search:focus-within {
  border-color: var(--accent);
}

.search__icon {
  position: absolute;
  left: 11px;
  color: var(--text-faint);
  pointer-events: none;
}

.search__input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.search__input::placeholder {
  color: var(--text-faint);
}

.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  color: var(--text-faint);
  transition: background-color var(--duration) var(--ease);
}

.search__clear:hover {
  background: var(--bg-soft);
  color: var(--text);
}
</style>
