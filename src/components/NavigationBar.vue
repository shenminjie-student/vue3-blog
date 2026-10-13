<script setup>

import { onMounted, onUnmounted } from 'vue';


onMounted(() => {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        // 
        if (window.scrollY > 0) {
            nav.setAttribute('style', 'background-color: rgba(26, 26, 29, 255); border-bottom: 1px solid rgb(70, 70, 70);');
        }else{
            nav.removeAttribute('style', 'background-color: rgba(26, 26, 29, 255); border-bottom: 1px solid rgb(70, 70, 70);');
        }
    });
})

onUnmounted(() => {

})

</script>

<template>
    <!-- 顶部导航栏 -->
    <div id="nav" class="NavigationBar">
        <div class="nav-left">
            <a href="/" title="首页">
                <div class="link i-ri-home-4-line"></div>
            </a>

            <a href="http://124.70.160.102/" title="友情链接" target="_blank">
                <div class="link i-ri-link"></div>
            </a>
        </div>
        
        
        <div class="nav-right">
            <a href="#">关于</a>
        </div>
    </div>
</template>

<style scoped>
* {
    color: white;
}

.NavigationBar {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    /* 固定在顶部 */
    position: fixed;
    top: 0px;
    left: 0px;
    /*  */
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;

    z-index: 9999;
}

a{
    text-decoration: none;
}

.nav-left {
    display: flex;
}

.link {
    font-size: 24px;
    color: gray;

    width: 24px;
    height: 24px;
    margin: 12px;
}

.link:hover {
    font-size: 24px;
    color: white;
}
</style>