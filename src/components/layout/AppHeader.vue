<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import site from '@/data/site'
import BaseIcon from '../common/BaseIcon.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const menuOpen = ref(false)

// 路由变化时收起移动端菜单
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function isActive(item) {
  return item.to === '/' ? route.path === '/' : route.path.startsWith(item.to)
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="brand" aria-label="返回首页">
        <span class="brand__mark" aria-hidden="true">杰</span>
        <span class="brand__text">
          <span class="mono brand__handle">struct@</span><span>杰构体</span>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(item) }"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <BaseIcon :name="item.icon" :size="15" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="header__actions">
        <a
          v-for="social in site.socials.slice(0, 1)"
          :key="social.label"
          :href="social.href"
          class="header__social"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.label"
          :title="social.label"
        >
          <BaseIcon :name="social.icon" :size="18" />
        </a>

        <ThemeToggle />

        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
        >
          <BaseIcon :name="menuOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="移动端导航">
        <div class="container mobile-nav__inner">
          <RouterLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="mobile-nav__link"
            :class="{ 'mobile-nav__link--active': isActive(item) }"
          >
            <BaseIcon :name="item.icon" :size="16" />
            <span>{{ item.label }}</span>
            <BaseIcon name="chevron-right" :size="16" class="mobile-nav__chevron" />
          </RouterLink>

          <div class="mobile-nav__socials">
            <a
              v-for="social in site.socials"
              :key="social.label"
              :href="social.href"
              class="mobile-nav__social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BaseIcon :name="social.icon" :size="15" />
              {{ social.label }}
            </a>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--header-bg);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  height: var(--header-height);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: var(--shadow-sm);
}

.brand__text {
  font-size: 15px;
  font-weight: 650;
  color: var(--text-strong);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.brand__handle {
  color: var(--accent);
  font-weight: 500;
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-muted);
  transition:
    color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.nav__link:hover {
  color: var(--text);
  background: var(--bg-soft);
}

.nav__link--active {
  color: var(--accent);
  background: var(--accent-soft);
  font-weight: 550;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition:
    color var(--duration) var(--ease),
    background-color var(--duration) var(--ease);
}

.header__social:hover {
  color: var(--text);
  background: var(--bg-soft);
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.mobile-nav {
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.mobile-nav__inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  padding-bottom: 16px;
}

.mobile-nav__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 15px;
}

.mobile-nav__link--active {
  background: var(--accent-soft);
  color: var(--accent);
}

.mobile-nav__chevron {
  margin-left: auto;
  color: var(--text-faint);
}

.mobile-nav__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 12px 0;
  margin-top: 8px;
  border-top: 1px dashed var(--border);
}

.mobile-nav__social {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--text-muted);
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    opacity 0.18s var(--ease),
    transform 0.18s var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 860px) {
  .nav {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }

  .header__social {
    display: none;
  }
}

@media (min-width: 861px) {
  .mobile-nav {
    display: none;
  }
}
</style>
