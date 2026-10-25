<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <!-- 全站统一布局：页头、当前路由页面与页脚 -->
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <!-- 路由切换时先离开旧页面，再进入新页面 -->
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
/* 让页脚在内容较少时仍停留在视口底部 */
.app-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 1 auto;
}

/* 路由页面切换时轻微淡入淡出并垂直移动 */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 尊重系统的减少动态效果偏好 */
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
