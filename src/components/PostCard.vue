<script setup>

const props = defineProps({
    post: {
        id: String,
        title: String,
        date: String,
        update: String,
        category: String,
        tags: []
    }
})

</script>

<template>
    <router-link :to="'/post/' + post.id">
        <div class="PostCard">
            <!-- 文章标题 -->
             <div class="post-title">
                <h2>{{ post.title }}</h2>
             </div>            
            <!-- 文字日期 -->
            <div class="post-date">                
                <span class="publish-date">
                    <div class="i-ri-calendar-line" title="发布日期"></div>
                    <time datetime="">{{ post.date }}</time>
                </span>
                <span class="update-date" v-if="post.update">
                    <div class="i-ri-calendar-2-line" title="更新日期"></div>
                    <time datetime="">{{ post.update }}</time>
                </span>
            </div>
            <!--  -->
            <nav>
                <div class="post-category">
                    <div class="frame-box">
                        <div class="i-ri-folder-2-line" ></div>
                        <span v-if="post.category">{{ post.category }}</span>
                        <span v-else></span>                     
                    </div>
                </div>
                <div class="post-tags">
                    <div v-for="tag in post.tags" class="frame-box">
                        <span>{{ tag }}</span>
                    </div>
                </div>
            </nav>
        </div>
    </router-link>
</template>

<style scoped>

    a {
        color: white;
        text-decoration: none;
    }

    .PostCard {
        width: 90vw;
        max-width: 800px;
        background-color: rgb(22, 22, 29);
        color: white;
        /* 1. 设置过渡效果：针对 transform 属性，耗时 0.3秒，缓动函数 ease */
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 10px;

        /* 弹性容器 */
        /* display: flex; */
        flex-direction: column;
        text-align: center;
    }

    .PostCard:hover {
        transform: scale(1.05);
    } 

    .post-title h2 {
        padding-top: 30px;
    }

    nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 70px;
        box-sizing: border-box;
        padding-left: 30px;
        padding-right: 30px;
        
        border-top: 0.5px solid rgba(255, 255, 255, 0.05);
        margin-top: 30px;
    }

    .post-date {
        display: flex;
        justify-content: center;
        gap: 20px;
        

        pad: 10px;
        /* 文字 */
        font-size: 16px;
    }

    .post-date span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .post-tags {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    nav .frame-box {
        background-color: rgba(188, 182, 182, 0);
        height: 30px;
        display: flex;
        align-items: center;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 0px 10px;
        font-size: 15px;
        box-sizing: border-box;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    nav .frame-box:hover {
        border: 1px solid rgb(4, 102, 214);
        background-color: rgb(4, 102, 214);
    }
    
</style>