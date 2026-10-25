<script setup>
import { computed } from 'vue'
import site from '@/data/site'
import BaseIcon from '../common/BaseIcon.vue'

const year = new Date().getFullYear()
// Copyright 年份：如果 startYear 与当前年份相同，则只显示当前年份，否则显示起始年份–当前年份
const copyright = computed(() =>
  site.startYear === year ? `${year}` : `${site.startYear}–${year}`,
)
// 页脚导航链接
const links = [
  { label: '关于我', to: '/' },
  { label: '博客', to: '/blog' },
  { label: '电影', to: '/movies' },
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo">
          <span class="footer__mark" aria-hidden="true">杰</span>
          <span>{{ site.shortName }}</span>
        </RouterLink>
        <p class="footer__desc">{{ site.description }}</p>
        <div class="footer__socials">
          <a
            v-for="social in site.socials"
            :key="social.label"
            :href="social.href"
            class="footer__social"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
            :title="social.label"
          >
            <BaseIcon :name="social.icon" :size="16" />
          </a>
        </div>
      </div>

      <nav class="footer__nav" aria-label="页脚导航">
        <p class="footer__nav-title">导航</p>
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="footer__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="footer__meta">
        <p class="footer__nav-title">关于本站</p>
        <p class="footer__note">{{ site.footer.note }}</p>
      </div>
    </div>

    <div class="container footer__bottom">
      <p>© {{ copyright }} {{ site.name }}</p>
      <p class="footer__tech mono">
        <span>Vue 3</span>
        <span aria-hidden="true">·</span>
        <span>Vite</span>
        <span aria-hidden="true">·</span>
        <span>Markdown</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--bg-soft);
  padding-top: var(--space-7);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 0.7fr 1.1fr;
  gap: var(--space-6);
  padding-bottom: var(--space-6);
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 650;
  color: var(--text-strong);
  margin-bottom: var(--space-3);
}

.footer__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 12px;
  font-weight: 700;
}

.footer__desc {
  max-width: 34ch;
  color: var(--text-muted);
  font-size: 13.5px;
  line-height: 1.7;
}

.footer__socials {
  display: flex;
  gap: 6px;
  margin-top: var(--space-3);
}

.footer__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  transition:
    color var(--duration) var(--ease),
    border-color var(--duration) var(--ease);
}

.footer__social:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.footer__nav-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 4px;
}

.footer__link {
  font-size: 14px;
  color: var(--text-muted);
  transition: color var(--duration) var(--ease);
}

.footer__link:hover {
  color: var(--accent);
}

.footer__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer__note {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
}

.footer__inline-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding-top: var(--space-4);
  padding-bottom: var(--space-5);
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 12.5px;
}

.footer__tech {
  display: flex;
  gap: 6px;
}

@media (max-width: 860px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer__inner {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
}
</style>
