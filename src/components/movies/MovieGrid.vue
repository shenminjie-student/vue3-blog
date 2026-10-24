<script setup>
import MovieCard from './MovieCard.vue'

/**
 * 电影网格：统一列宽与间距，首页与电影页共用
 */
defineProps({
  movies: { type: Array, default: () => [] },
  minColumnWidth: { type: Number, default: 210 },
})
</script>

<template>
  <div
    class="movie-grid"
    :style="{ '--min-col': `${minColumnWidth}px` }"
    role="list"
    aria-label="电影列表"
  >
    <div v-for="movie in movies" :key="movie.id" class="movie-grid__cell" role="listitem">
      <MovieCard :movie="movie" />
    </div>
  </div>

  <slot v-if="!movies.length" name="empty" />
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--min-col), 1fr));
  gap: var(--space-5) var(--space-4);
}

.movie-grid__cell {
  min-width: 0;
}
</style>
