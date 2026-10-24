<script setup>
import { computed } from 'vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import MovieGrid from '@/components/movies/MovieGrid.vue'
import ProfileHero from '@/components/profile/ProfileHero.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import SkillGroup from '@/components/profile/SkillGroup.vue'
import TimelineList from '@/components/profile/TimelineList.vue'
import { usePosts } from '@/composables/usePosts'
import { movies } from '@/data/movies'
import { profile } from '@/data/profile'
import { sortMovies } from '@/utils/bilibili'

const { posts } = usePosts()

const recentPosts = computed(() => posts.value.slice(0, 3))
const recentMovies = computed(() => sortMovies(movies, 'year-desc').slice(0, 4))

const stats = computed(() => [
  { label: '开发经验', value: `${profile.experienceYears} 年+` },
  { label: '技术文章', value: posts.value.length },
  { label: '收藏电影', value: movies.length },
])
</script>

<template>
  <div class="page home">
    <div class="container">
      <ProfileHero :stats="stats" />

      <section class="home-section">
        <SectionHeading index="01" title="关于我" description="一些基本信息和正在做的事" />
        <div class="about">
          <div class="about__text">
            <p v-for="paragraph in profile.bio" :key="paragraph" class="about__paragraph">
              {{ paragraph }}
            </p>

            <div class="about__interests">
              <span class="about__interests-label">兴趣</span>
              <span v-for="item in profile.interests" :key="item" class="about__interest">
                {{ item }}
              </span>
            </div>
          </div>

          <ProfileInfo :items="profile.info" />
        </div>
      </section>

      <section class="home-section">
        <SectionHeading
          index="02"
          title="履历"
          description="工作与学习经历，按时间倒序排列"
        />
        <TimelineList :items="profile.timeline" />
      </section>

      <section class="home-section">
        <SectionHeading index="03" title="技能" description="常用技术栈与熟练度自评" />
        <div class="skills">
          <SkillGroup v-for="group in profile.skills" :key="group.group" :group="group" />
        </div>
      </section>

      <section class="home-section">
        <SectionHeading index="04" title="最近写的" description="技术、闲谈与踩坑记录">
          <template #actions>
            <RouterLink to="/blog" class="btn btn--sm">
              全部文章
              <BaseIcon name="arrow-right" :size="14" />
            </RouterLink>
          </template>
        </SectionHeading>

        <div v-if="recentPosts.length" class="posts">
          <BlogCard v-for="post in recentPosts" :key="post.slug" :post="post" />
        </div>
        <EmptyState
          v-else
          icon="feather"
          title="还没有文章"
          description="在 src/content/posts 下新建一个 .md 文件就会出现在这里。"
        />
      </section>

      <section class="home-section">
        <SectionHeading index="05" title="最近重看的电影" description="点开即可在哔哩哔哩观看">
          <template #actions>
            <RouterLink to="/movies" class="btn btn--sm">
              完整片单
              <BaseIcon name="arrow-right" :size="14" />
            </RouterLink>
          </template>
        </SectionHeading>

        <MovieGrid :movies="recentMovies" :min-column-width="200" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-section {
  margin-top: var(--space-8);
}

.home-section:first-of-type {
  margin-top: var(--space-5);
}

.about {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: start;
}

.about__paragraph {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.85;
  max-width: 58ch;
}

.about__paragraph + .about__paragraph {
  margin-top: var(--space-4);
}

.about__interests {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border);
}

.about__interests-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-right: 2px;
}

.about__interest {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 12.5px;
  color: var(--text-muted);
}

.skills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.posts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.posts > :first-child {
  grid-column: 1 / -1;
}

@media (max-width: 900px) {
  .about {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .skills {
    grid-template-columns: 1fr;
  }

  .posts {
    grid-template-columns: 1fr;
  }
}
</style>
