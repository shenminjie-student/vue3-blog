// src/composables/usePosts.js
import { ref } from 'vue'

// 导出文章元数据和分类数量
export function usePosts() {
  const posts = ref([])
  const categories = ref({}) // 用于存储分类及对应的文章数量

  // 1. eager: true 表示立即加载所有模块，而不是懒加载
  // 这样我们才能拿到里面的 frontmatter 信息
  const modules = import.meta.glob('../posts/*.md', { eager: true })

  // 2. 遍历模块，格式化数据
  const tempPosts = []
  
  for (const path in modules) {
    const mod = modules[path]

    // 获取文件名作为 ID，例如: ../posts/hello.md -> hello
    const id = path.split('/').pop().replace('.md', '')
    
    // mod 是插件自动解析出来的元数据
    const frontmatter = mod || {}

    tempPosts.push({
      id,
      title: frontmatter.title || '无标题',
      date: formatDate(frontmatter.date) || '1970-01-01',
      category: frontmatter.category || '未分类',
      path: `/post/${id}`
    })
  }

  // 3. 按日期降序排序 (新的在前)
  tempPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
  posts.value = tempPosts

  // 4. 提取分类列表
  const categoryMap = {}
  tempPosts.forEach(post => {
    if (!categoryMap[post.category]) {
      categoryMap[post.category] = 0
    }
    categoryMap[post.category]++
  })
  categories.value = categoryMap

  return {
    posts,
    categories
  }
}

function formatDate(date) {
    if (!date) return ''
    // 将 Date 对象或字符串转为 YYYY-MM-DD 格式
    return new Date(date).toISOString().split('T')[0]
}
