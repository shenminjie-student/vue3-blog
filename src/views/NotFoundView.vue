<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

const links = [
  { label: '首页', to: '/', icon: 'user' },
  { label: '博客', to: '/blog', icon: 'feather' },
  { label: '电影', to: '/movies', icon: 'film' },
]
</script>

<template>
  <div class="page not-found">
    <div class="container not-found__inner">
      <p class="not-found__code mono">404</p>
      <h1 class="not-found__title">页面走丢了</h1>
      <p class="not-found__desc">
        这个地址没有对应的内容。可能是链接写错了，也可能是我把文章搬家了。
      </p>

      <div class="not-found__links">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="btn btn--sm">
          <BaseIcon :name="link.icon" :size="14" />
          {{ link.label }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);
}

.not-found__code {
  font-size: clamp(64px, 14vw, 120px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
  opacity: 0.18;
}

.not-found__title {
  margin-top: var(--space-3);
  font-size: 26px;
}

.not-found__desc {
  margin-top: var(--space-3);
  max-width: 44ch;
  color: var(--text-muted);
  font-size: 14.5px;
}

.not-found__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
}
</style>
