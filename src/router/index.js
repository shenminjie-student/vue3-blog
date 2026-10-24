import { createRouter, createWebHashHistory } from 'vue-router'
import site from '@/data/site'

/**
 * 使用哈希模式：GitHub Pages 等纯静态托管刷新任意文章页都不会 404，
 * 无需额外的 404.html 重写规则。若部署到可控服务器，可换成 history 模式。
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '关于我' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: '博客' },
  },
  {
    path: '/blog/:slug',
    name: 'post',
    component: () => import('@/views/BlogDetailView.vue'),
    meta: { title: '文章' },
  },
  {
    path: '/movies',
    name: 'movies',
    component: () => import('@/views/MoviesView.vue'),
    meta: { title: '电影' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta?.title === 'string' ? to.meta.title : ''
  document.title = pageTitle ? `${pageTitle} | ${site.name}` : site.title
})

export default router
