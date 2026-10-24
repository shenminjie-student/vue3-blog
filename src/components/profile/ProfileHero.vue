<script setup>
import profile from '@/data/profile'
import BaseIcon from '../common/BaseIcon.vue'

/**
 * 首页 Hero：个人名片 + 头像 + 快捷入口
 * stats 由父级传入，便于复用（例如以后做英文版页面）
 */
defineProps({
  stats: { type: Array, default: () => [] },
})
</script>

<template>
  <section class="hero">
    <div class="hero__main">
      <p class="eyebrow hero__status">
        <span class="hero__dot" aria-hidden="true" />
        {{ profile.status }}
      </p>

      <h1 class="hero__title">
        你好，我是
        <span class="hero__name">{{ profile.name }}</span>
        <span class="hero__alias mono">struct@杰构体</span>
      </h1>

      <p class="hero__role">{{ profile.role }}</p>
      <p class="hero__tagline">{{ profile.tagline }}</p>

      <div class="hero__actions">
        <RouterLink to="/blog" class="btn btn--primary">
          <BaseIcon name="feather" :size="16" />
          读读博客
        </RouterLink>
        <RouterLink to="/movies" class="btn">
          <BaseIcon name="film" :size="16" />
          电影清单
        </RouterLink>
        <a :href="`mailto:${profile.info.find((item) => item.icon === 'mail')?.value || ''}`" class="btn btn--ghost">
          <BaseIcon name="mail" :size="16" />
          联系我
        </a>
      </div>

      <dl v-if="stats.length" class="hero__stats">
        <div v-for="stat in stats" :key="stat.label" class="hero__stat">
          <dt class="hero__stat-label">{{ stat.label }}</dt>
          <dd class="hero__stat-value">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>

    <div class="hero__aside">
      <div class="hero__avatar-frame">
        <img
          class="hero__avatar"
          :src="profile.avatar"
          :alt="`${profile.name}的头像`"
          width="240"
          height="240"
        />
      </div>
      <div class="hero__badges">
        <span class="hero__badge">C++</span>
        <span class="hero__badge">Qt</span>
        <span class="hero__badge">Vue 3</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  align-items: center;
  gap: var(--space-7);
  padding: var(--space-6) 0 var(--space-7);
}

.hero__status {
  color: var(--success);
}

.hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 18%, transparent);
}

.hero__title {
  margin-top: var(--space-3);
  font-size: clamp(30px, 4.4vw, 44px);
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: var(--text-strong);
}

.hero__name {
  color: var(--accent);
}

.hero__alias {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.42em;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--text-faint);
  vertical-align: middle;
}

.hero__role {
  margin-top: var(--space-4);
  font-size: 17px;
  font-weight: 550;
  color: var(--text);
}

.hero__tagline {
  margin-top: 6px;
  max-width: 46ch;
  color: var(--text-muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  margin: var(--space-6) 0 0;
}

.hero__stat-label {
  font-size: 12.5px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

.hero__stat-value {
  margin: 2px 0 0;
  font-size: 23px;
  font-weight: 650;
  color: var(--text-strong);
  font-variant-numeric: tabular-nums;
}

.hero__aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.hero__avatar-frame {
  position: relative;
  width: 220px;
  height: 220px;
  border-radius: 32px;
  padding: 6px;
  background: linear-gradient(145deg, var(--accent-soft), var(--bg-soft));
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.hero__avatar-frame::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 40px;
  border: 1px dashed var(--border-strong);
  opacity: 0.7;
  pointer-events: none;
}

.hero__avatar {
  width: 100%;
  height: 100%;
  border-radius: 26px;
  object-fit: cover;
  background: var(--bg-soft);
}

.hero__badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero__badge {
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 11.5px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--space-5);
    padding-top: var(--space-4);
  }

  .hero__aside {
    order: -1;
    align-items: flex-start;
  }

  .hero__avatar-frame {
    width: 132px;
    height: 132px;
    border-radius: 24px;
  }

  .hero__avatar {
    border-radius: 19px;
  }

  .hero__stats {
    gap: var(--space-5);
    margin-top: var(--space-5);
  }
}
</style>
