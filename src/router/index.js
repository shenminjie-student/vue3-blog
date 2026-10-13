// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Post from '../views/PostView.vue'

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue') // 你的首页
  },
  {
    // 动态路由：:id 会匹配 /post/hello 或 /post/vue-guide
    // 然后由PostView组件解析出id
    path: '/post/:id',
    name: 'Post',
    component: Post
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to, from) => {
  // 路由跳转后显示顶部
  window.scrollTo(0, 0)
})

export default router