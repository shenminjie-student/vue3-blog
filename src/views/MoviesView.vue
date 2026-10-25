<script setup>
import { computed, ref } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import FilterChips from '@/components/common/FilterChips.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import MovieGrid from '@/components/movies/MovieGrid.vue'
import { movieGenres, movies } from '@/data/movies'
import { movieSortOptions, sortMovies } from '@/utils/bilibili'

const keyword = ref('')
const activeGenre = ref('')
const sort = ref('year-desc')

const genreChips = computed(() =>
  movieGenres.map((genre) => ({
    value: genre,
    label: genre,
    count: movies.filter((movie) => movie.genres.includes(genre)).length,
  })),
)

const filteredMovies = computed(() => {
  const term = keyword.value.trim().toLowerCase()

  const list = movies.filter((movie) => {
    if (activeGenre.value && !movie.genres.includes(activeGenre.value)) return false
    if (!term) return true

    const haystack = [
      movie.title,
      movie.originalTitle,
      movie.director,
      movie.region,
      movie.genres.join(' '),
      movie.note || '',
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })

  return sortMovies(list, sort.value)
})

const hasFilter = computed(() => Boolean(activeGenre.value || keyword.value.trim()))

function resetFilters() {
  activeGenre.value = ''
  keyword.value = ''
}
</script>

<template>
  <div class="page">
    <div class="container">
      <PageHeader
        eyebrow="Watchlist"
        title="电影"
        description="反复重看的一些片子。点击任意海报即可跳转到哔哩哔哩观看。"
      >
        <template #meta>
          <p class="movie-count">
            共收录 <strong>{{ movies.length }}</strong> 部 · 当前显示
            <strong>{{ filteredMovies.length }}</strong> 部
          </p>
        </template>
      </PageHeader>

      <div class="toolbar">
        <div class="toolbar__filters">
          <FilterChips v-model="activeGenre" :items="genreChips" all-label="全部类型" />

          <div class="sort">
            <label class="sort__label" for="movie-sort">排序</label>
            <select id="movie-sort" v-model="sort" class="sort__select">
              <option v-for="option in movieSortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <SearchInput
          v-model="keyword"
          id="movie-search"
          placeholder="搜索片名、导演或类型…"
        />
      </div>

      <MovieGrid :movies="filteredMovies">
        <template #empty>
          <EmptyState
            icon="film"
            title="没有匹配的影片"
            description="换个关键词或类型试试，也可以清空筛选条件。"
          />
          <div class="empty-actions">
            <button type="button" class="btn btn--sm" @click="resetFilters">
              清空筛选条件
            </button>
          </div>
        </template>
      </MovieGrid>

      <p v-if="hasFilter && filteredMovies.length" class="hint">
        正在按筛选条件显示，共 {{ filteredMovies.length }} 部。
        <button type="button" class="hint__reset" @click="resetFilters">清空筛选</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.movie-count {
  margin-top: var(--space-3);
  font-size: 13px;
  color: var(--text-faint);
}

.movie-count strong {
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

.toolbar__filters {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sort__label {
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.06em;
}

.sort__select {
  height: 32px;
  padding: 0 26px 0 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--surface);
  color: var(--text);
  font-size: 13px;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-faint) 50%),
    linear-gradient(135deg, var(--text-faint) 50%, transparent 50%);
  background-position:
    calc(100% - 14px) 14px,
    calc(100% - 9px) 14px;
  background-size:
    5px 5px,
    5px 5px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.sort__select:focus-visible {
  border-color: var(--accent);
  outline: none;
}

.empty-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-4);
}

.hint {
  margin-top: var(--space-5);
  text-align: center;
  font-size: 12.5px;
  color: var(--text-faint);
}

.hint__reset {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-size: inherit;
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
