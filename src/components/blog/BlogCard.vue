<script setup>
import BaseIcon from '../common/BaseIcon.vue'
import BaseTag from '../common/BaseTag.vue'

/**
 * 博客列表卡片。
 * 使用「拉伸标题链接」模式：整张卡片可点击，同时标签保持独立可点，
 * 避免 <a> 嵌套 <a> 的非法结构。
 */
defineProps({
  post: { type: Object, required: true },
})

function tagRoute(tag) {
  return { path: '/blog', query: { tag } }
}
</script>

<template>
  <article class="post-card">
    <div class="post-card__meta">
      <time :datetime="post.isoDate" class="post-card__date">
        <BaseIcon name="calendar" :size="13" />
        {{ post.dateText }}
      </time>
      <span class="post-card__dot" aria-hidden="true">·</span>
      <span class="post-card__reading">
        <BaseIcon name="clock" :size="13" />
        {{ post.readingTime }} 分钟
      </span>
      <span v-if="post.draft" class="post-card__draft">草稿</span>
      <span v-if="post.pinned" class="post-card__pinned">
        <BaseIcon name="star" :size="12" />
        置顶
      </span>
    </div>

    <h3 class="post-card__title">
      <RouterLink :to="`/blog/${post.slug}`" class="post-card__link">
        {{ post.title }}
      </RouterLink>
    </h3>

    <p v-if="post.summary" class="post-card__summary">{{ post.summary }}</p>

    <footer class="post-card__footer">
      <div class="post-card__tags">
        <BaseTag
          v-for="tag in post.tags"
          :key="tag"
          :label="tag"
          :to="tagRoute(tag)"
          size="sm"
        />
      </div>
      <span class="post-card__more">
        阅读全文
        <BaseIcon name="arrow-right" :size="14" />
      </span>
    </footer>
  </article>
</template>

<style scoped>
.post-card {
  position: relative;
  padding: var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition:
    border-color var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease),
    transform var(--duration) var(--ease);
}

.post-card:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-faint);
}

.post-card__date,
.post-card__reading {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.post-card__dot {
  opacity: 0.6;
}

.post-card__draft,
.post-card__pinned {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid var(--border);
}

.post-card__draft {
  color: var(--warning);
  border-color: color-mix(in srgb, var(--warning) 40%, transparent);
}

.post-card__pinned {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  background: var(--accent-soft);
}

.post-card__title {
  margin-top: 10px;
  font-size: 19px;
  line-height: 1.4;
  letter-spacing: -0.012em;
}

.post-card__link {
  color: var(--text-strong);
  transition: color var(--duration) var(--ease);
}

/* 让整张卡片成为点击热区 */
.post-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.post-card:hover .post-card__link {
  color: var(--accent);
}

.post-card__summary {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.75;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-4);
}

.post-card__tags {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-card__more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: var(--text-faint);
  transition: color var(--duration) var(--ease);
}

.post-card:hover .post-card__more {
  color: var(--accent);
}

@media (max-width: 560px) {
  .post-card {
    padding: var(--space-4);
  }

  .post-card__title {
    font-size: 17.5px;
  }
}
</style>
