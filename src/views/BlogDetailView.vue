<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseTag from '@/components/common/BaseTag.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TocNav from '@/components/common/TocNav.vue'
import { usePosts } from '@/composables/usePosts'
import site from '@/data/site'
import { renderMarkdown } from '@/utils/markdown'
import { handleAnchorClick } from '@/utils/scroll'

const route = useRoute()
const { getPost, getNeighbors, getRelated } = usePosts()

const post = computed(() => getPost(route.params.slug))
const rendered = computed(() => (post.value ? renderMarkdown(post.value.content) : null))
const headings = computed(() => rendered.value?.headings ?? [])
const neighbors = computed(() =>
  post.value ? getNeighbors(post.value.slug) : { newer: null, older: null },
)
const related = computed(() => (post.value ? getRelated(post.value.slug, 2) : []))

const activeHeading = ref('')
let observer = null

function observeHeadings() {
  observer?.disconnect()
  activeHeading.value = ''

  if (typeof IntersectionObserver === 'undefined') return

  const elements = headings.value
    .map((heading) => document.getElementById(heading.id))
    .filter((element) => Boolean(element))

  if (!elements.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible.length) {
        activeHeading.value = visible[0].target.id
      }
    },
    { rootMargin: '-80px 0px -68% 0px', threshold: 0 },
  )

  elements.forEach((element) => observer.observe(element))
}

onMounted(observeHeadings)

watch(headings, async () => {
  await nextTick()
  observeHeadings()
})

onBeforeUnmount(() => observer?.disconnect())

watchEffect(() => {
  if (post.value) {
    document.title = `${post.value.title} | ${site.shortName}`
  }
})

/** 复制代码块 + 处理正文锚点 */
async function onArticleClick(event) {
  const target = event.target
  if (!(target instanceof Element)) return

  const copyButton = target.closest('[data-code-copy]')
  if (copyButton) {
    const code = copyButton.closest('.code-block')?.querySelector('pre code')?.textContent ?? ''
    const original = copyButton.textContent

    try {
      await navigator.clipboard.writeText(code)
      copyButton.textContent = '已复制'
    } catch {
      copyButton.textContent = '复制失败'
    }

    window.setTimeout(() => {
      copyButton.textContent = original
    }, 1600)
    return
  }

  handleAnchorClick(event)
}

function tagRoute(tag) {
  return { path: '/blog', query: { tag } }
}
</script>

<template>
  <div class="page">
    <div class="container">
      <template v-if="post">
        <div class="article-layout">
          <article class="article">
            <nav class="breadcrumb">
              <RouterLink to="/blog" class="breadcrumb__link">
                <BaseIcon name="arrow-left" :size="14" />
                返回博客
              </RouterLink>
            </nav>

            <header class="article__header">
              <div class="article__tags">
                <BaseTag
                  v-for="tag in post.tags"
                  :key="tag"
                  :label="tag"
                  :to="tagRoute(tag)"
                  size="sm"
                />
                <span v-if="post.draft" class="article__draft">草稿</span>
              </div>

              <h1 class="article__title">{{ post.title }}</h1>
              <p v-if="post.summary" class="article__summary">{{ post.summary }}</p>

              <div class="article__meta">
                <span>
                  <BaseIcon name="calendar" :size="14" />
                  <time :datetime="post.isoDate">{{ post.dateText }}</time>
                </span>
                <span>
                  <BaseIcon name="clock" :size="14" />
                  阅读约 {{ post.readingTime }} 分钟
                </span>
              </div>
            </header>

            <div class="prose" @click="onArticleClick" v-html="rendered.html" />

            <footer class="article__footer">
              <div class="article__tags article__tags--footer">
                <span class="article__footer-label">标签</span>
                <BaseTag
                  v-for="tag in post.tags"
                  :key="tag"
                  :label="tag"
                  :to="tagRoute(tag)"
                  size="sm"
                />
              </div>

              <div v-if="neighbors.older || neighbors.newer" class="neighbors">
                <RouterLink
                  v-if="neighbors.newer"
                  :to="`/blog/${neighbors.newer.slug}`"
                  class="neighbor neighbor--prev"
                >
                  <span class="neighbor__label">
                    <BaseIcon name="arrow-left" :size="13" />
                    较新一篇
                  </span>
                  <span class="neighbor__title">{{ neighbors.newer.title }}</span>
                </RouterLink>

                <RouterLink
                  v-if="neighbors.older"
                  :to="`/blog/${neighbors.older.slug}`"
                  class="neighbor neighbor--next"
                >
                  <span class="neighbor__label">
                    较早一篇
                    <BaseIcon name="arrow-right" :size="13" />
                  </span>
                  <span class="neighbor__title">{{ neighbors.older.title }}</span>
                </RouterLink>
              </div>

              <div v-if="related.length" class="related">
                <p class="related__title">相关文章</p>
                <ul class="related__list">
                  <li v-for="item in related" :key="item.slug">
                    <RouterLink :to="`/blog/${item.slug}`" class="related__link">
                      <span class="related__link-title">{{ item.title }}</span>
                      <span class="related__link-meta">
                        {{ item.dateText }} · {{ item.readingTime }} 分钟
                      </span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </footer>
          </article>

          <aside v-if="headings.length > 1" class="article__aside">
            <TocNav :headings="headings" :active-id="activeHeading" />
          </aside>
        </div>
      </template>

      <EmptyState
        v-else
        icon="feather"
        title="文章不存在"
        :description="`没有找到「${route.params.slug}」这篇文章，它可能已经被删除或改了文件名。`"
        action-label="返回博客列表"
        action-to="/blog"
      />
    </div>
  </div>
</template>

<style scoped>
.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: var(--space-7);
  align-items: start;
}

.article {
  min-width: 0;
  max-width: 720px;
}

.breadcrumb {
  margin-bottom: var(--space-4);
}

.breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  transition: color var(--duration) var(--ease);
}

.breadcrumb__link:hover {
  color: var(--accent);
}

.article__header {
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-5);
}

.article__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--space-3);
}

.article__draft {
  padding: 1px 8px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--warning) 40%, transparent);
  color: var(--warning);
  font-size: 11px;
}

.article__title {
  font-size: clamp(26px, 3.6vw, 36px);
  line-height: 1.28;
  letter-spacing: -0.025em;
}

.article__summary {
  margin-top: var(--space-3);
  color: var(--text-muted);
  font-size: 15.5px;
  line-height: 1.75;
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-4);
  font-size: 12.5px;
  color: var(--text-faint);
}

.article__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.article__footer {
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
}

.article__tags--footer {
  align-items: center;
  margin-bottom: var(--space-5);
}

.article__footer-label {
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 4px;
}

.neighbors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.neighbor {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition:
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease);
}

.neighbor:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.neighbor--next {
  text-align: right;
  align-items: flex-end;
}

.neighbor__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--text-faint);
}

.neighbor__title {
  font-size: 14px;
  font-weight: 550;
  color: var(--text-strong);
  line-height: 1.5;
}

.related {
  margin-top: var(--space-5);
}

.related__title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: var(--space-3);
}

.related__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.related__link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  transition: background-color var(--duration) var(--ease);
}

.related__link:hover {
  background: var(--accent-soft);
}

.related__link-title {
  font-size: 14px;
  color: var(--text);
}

.related__link-meta {
  flex: none;
  font-size: 12px;
  color: var(--text-faint);
}

@media (max-width: 1000px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article__aside {
    display: none;
  }

  .article {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .neighbors {
    grid-template-columns: 1fr;
  }

  .neighbor--next {
    text-align: left;
    align-items: flex-start;
  }

  .related__link {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
