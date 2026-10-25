<script setup>
import { computed } from 'vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import FilterChips from '@/components/common/FilterChips.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { usePosts } from '@/composables/usePosts'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { posts, tags } = usePosts()

const keyword = ref('')

/** 标签放在 URL 上，便于分享与刷新后保持筛选状态 */
const activeTag = computed({
  get: () => (typeof route.query.tag === 'string' ? route.query.tag : ''),
  set: (tag) => {
    const query = { ...route.query }
    if (tag) {
      query.tag = tag
    } else {
      delete query.tag
    }
    router.replace({ query })
  },
})

const tagChips = computed(() =>
  tags.value.map((tag) => ({ value: tag.name, label: tag.name, count: tag.count })),
)

const filteredPosts = computed(() => {
  const term = keyword.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchTag = !activeTag.value || post.tags.includes(activeTag.value)
    if (!matchTag) return false
    if (!term) return true

    return [post.title, post.summary, post.tags.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })
})

const hasFilter = computed(() => Boolean(activeTag.value || keyword.value.trim()))

function resetFilters() {
  activeTag.value = ''
  keyword.value = ''
}
</script>

<template>
  <div class="page">
    <div class="container">
      <PageHeader
        eyebrow="Writing"
        title="博客"
        description="技术笔记、踩坑记录、日常闲谈。点击任意文章即可跳转到完整内容。"
      >
        <template #meta>
          <p class="blog-count">
            共 <strong>{{ posts.length }}</strong> 篇 · 当前显示
            <strong>{{ filteredPosts.length }}</strong> 篇
          </p>
        </template>
      </PageHeader>

      <div class="toolbar">
        <FilterChips v-model="activeTag" :items="tagChips" all-label="全部" />
        <SearchInput
          v-model="keyword"
          id="blog-search"
          placeholder="搜索标题、摘要或标签…"
        />
      </div>

      <div v-if="filteredPosts.length" class="post-list">
        <BlogCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
      </div>

      <EmptyState
        v-else
        icon="feather"
        title="没有找到匹配的文章"
        :description="
          hasFilter ? '换个关键词或标签试试，也可以清空筛选条件。' : '还没有发布文章。'
        "
        :action-label="hasFilter ? '清空筛选' : '返回首页'"
        :action-to="hasFilter ? null : '/'"
      />

      <div v-if="!filteredPosts.length && hasFilter" class="empty-actions">
        <button type="button" class="btn btn--sm" @click="resetFilters">清空筛选条件</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-count {
  margin-top: var(--space-3);
  font-size: 13px;
  color: var(--text-faint);
}

.blog-count strong {
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.empty-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-4);
}

@media (max-width: 720px) {
  .toolbar {
    align-items: stretch;
  }

  .toolbar :deep(.search) {
    max-width: none;
  }
}
</style>
