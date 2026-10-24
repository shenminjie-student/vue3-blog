<script setup>
/**
 * 区块标题：左侧序号/标题/描述，右侧可选操作
 */
defineProps({
  index: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="section-heading">
    <div class="section-heading__text">
      <h2 class="section-heading__title">
        <span v-if="index" class="section-heading__index mono">{{ index }}</span>
        {{ title }}
      </h2>
      <p v-if="description" class="section-heading__desc">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="section-heading__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
}

.section-heading__title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  font-size: 22px;
  letter-spacing: -0.01em;
}

.section-heading__index {
  font-size: 13px;
  color: var(--accent);
  letter-spacing: 0.1em;
}

.section-heading__desc {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 14px;
  max-width: 62ch;
}

.section-heading__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
