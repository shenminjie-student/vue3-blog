<script setup>
  import { ref, onMounted, watch } from 'vue'
  import axios from 'axios'
  import PostCard from '../components/PostCard.vue'
  import TitleDiv from '../components/TitleDiv.vue'
  import TransitionView from './TransitionView.vue'

  const posts = ref([])
  const loading = ref(true)
  const transition = ref(true)

  // 请求 public/posts/list.json
  const fetchList = async () => {
    try {
      // 注意：这里的路径是相对于网站根目录的
      const res = await axios.get('/posts/list.json?t=' + Date.now()) // 加时间戳防止缓存
      posts.value = res.data
    } catch (e) {
      console.error('获取列表失败', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchList();

    setTimeout(() => {
      transition.value = false;
    }, 3000)
  })
  
</script>

<template>

  <!-- 过渡动画 -->
   <!-- <TransitionView v-if="transition"></TransitionView> -->

  <div class="head">
    <div class="card">
      <img class="head-portrait" src="/profile.jpg" alt="">
      <router-link to="/post/about-me">
        struct@杰构体
      </router-link>
      <hr class="top">
      <a href="/post/about-blog">
        <TitleDiv content="struct@杰构体的博客"></TitleDiv>
      </a>
      <p>All is well</p>
      <p>希望成为一名优秀的程序员</p>
      <hr class="bottom">
    </div>
    
  </div>

  <div class="home-container">
    <div v-if="loading">加载中...</div>
    
    <div v-else class="post-list">
      <post-card v-for="post in posts" :key="post.id" :post="post"></post-card>
    </div>
  </div>
</template>

<style scoped>

  * {
    color: aliceblue;
  }

  .head {
    position: relative;
    width: 100%;
    height: 100vh;
    /* 弹性盒子 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .card {
    width: 95%;
    max-width: 640px;
    /* 弹性盒子 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: rgb(39, 43, 43); */
  }

  hr {
    color: aliceblue;
    background-color: azure;
    width: 99%;
    max-width: 800px;
  }

  .head-portrait {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;

    box-shadow: 1px 1px 8px 1px rgb(255, 255, 255);
    margin: 20px;
  }

  .head-portrait::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: aqua;
    
  }

  .home-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  } 

</style>