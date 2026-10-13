<script setup>

import TitleDiv from './TitleDiv.vue';

</script>

<template>
 <div class="InformationCard">
    <img src="/profile.jpg" alt="">
    <a href="/post/about-me">        
        <TitleDiv content="沈敏杰"></TitleDiv>
    </a>
    
    <p>all is well</p>
    <p>组件开发中。。。</p>
 </div>
</template>

<style scoped>

    .InformationCard {
        width: 320px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;

        /* 毛玻璃效果 */
        background-color: #2c333b;
        backdrop-filter: blur(1px);
        color: white;
        box-shadow: 3px 3px 6px 1px black;
        /* 圆角 */
        border-radius: 5px;

        /* 悬空固定 */        
        position: sticky;
        top: 60px;
    }

    img {
        width: 96px;
        height: 96px;
        object-fit: cover;
        border-radius: 50%;
        margin-top: 30px;

        box-shadow: 0px 0px 3px 3px white;
    }


    @media (max-width: 1200px) {
        .InformationCard {
            display: none;
        }
    }
</style>