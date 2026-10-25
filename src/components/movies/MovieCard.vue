<script setup>
import { computed } from 'vue'
import { formatDuration, getBilibiliUrl } from '@/utils/bilibili'
import BaseIcon from '../common/BaseIcon.vue'

/**
 * 电影卡片：B 站视频卡片风格 —— 16:9 封面 + 时长角标 + 悬停播放蒙层，
 * 点击封面或标题都会在新标签页打开哔哩哔哩。
 */
const props = defineProps({
  movie: { type: Object, required: true },
})

const url = computed(() => getBilibiliUrl(props.movie))
const duration = computed(() => formatDuration(props.movie.duration))
const isExternal = computed(() => /^https?:\/\//i.test(url.value))
</script>

<template>
  <article class="movie">
    <a
      :href="url"
      class="movie__cover"
      :target="isExternal ? '_blank' : undefined"
      :rel="isExternal ? 'noopener noreferrer' : undefined"
      :aria-label="`在哔哩哔哩观看《${movie.title}》`"
    >
      <img
        class="movie__img"
        :src="movie.cover"
        :alt="`${movie.title} 封面`"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      />

      <span class="movie__score">
        <BaseIcon name="star" :size="11" />
        {{ movie.score.toFixed(1) }}
      </span>

      <span v-if="duration" class="movie__duration">{{ duration }}</span>

      <span class="movie__overlay">
        <span class="movie__play">
          <BaseIcon name="play" :size="20" />
        </span>
        <span class="movie__overlay-text">在 B 站观看</span>
      </span>
    </a>

    <div class="movie__body">
      <h3 class="movie__title">
        <a
          :href="url"
          class="movie__title-link"
          :target="isExternal ? '_blank' : undefined"
          :rel="isExternal ? 'noopener noreferrer' : undefined"
        >
          {{ movie.title }}
        </a>
      </h3>

      <p class="movie__meta">
        <span class="movie__year mono">{{ movie.year }}</span>
        <span class="movie__dot" aria-hidden="true">·</span>
        <span>{{ movie.director }}</span>
      </p>

      <p class="movie__sub">{{ movie.originalTitle }} · {{ movie.region }}</p>

      <div class="movie__genres">
        <span v-for="genre in movie.genres" :key="genre" class="movie__genre">{{ genre }}</span>
      </div>

      <p v-if="movie.note" class="movie__note">{{ movie.note }}</p>
    </div>
  </article>
</template>

<style scoped>
.movie {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.movie__cover {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-soft);
  border: 1px solid var(--border);
}

.movie__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s var(--ease);
}

.movie__cover:hover .movie__img {
  transform: scale(1.06);
}

.movie__score {
  position: absolute;
  top: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px 2px 6px;
  border-radius: 6px;
  background: rgba(10, 12, 18, 0.68);
  backdrop-filter: blur(4px);
  color: #ffd166;
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.movie__duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(10, 12, 18, 0.72);
  color: #fff;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.movie__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--overlay);
  color: #fff;
  opacity: 0;
  transition: opacity var(--duration) var(--ease);
}

.movie__cover:hover .movie__overlay,
.movie__cover:focus-visible .movie__overlay {
  opacity: 1;
}

.movie__play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: rgba(251, 114, 153, 0.92);
  color: #fff;
  padding-left: 3px;
  box-shadow: 0 6px 18px rgba(251, 114, 153, 0.4);
}

.movie__overlay-text {
  font-size: 12.5px;
  letter-spacing: 0.04em;
}

.movie__body {
  padding: 10px 2px 0;
}

.movie__title {
  font-size: 15px;
  line-height: 1.45;
  font-weight: 600;
}

.movie__title-link {
  color: var(--text-strong);
  transition: color var(--duration) var(--ease);
}

.movie__title-link:hover {
  color: var(--accent);
}

.movie__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.movie__year {
  color: var(--text-faint);
}

.movie__sub {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.movie__genre {
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-muted);
}

.movie__note {
  margin-top: 8px;
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
