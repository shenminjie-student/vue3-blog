<script setup>
    var d = new Date();
    const year = d.getFullYear().toString();
</script>

<template>
    <!-- 页脚 -->
    <div class="FooterBar">
        <p>
            <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2024033484号-2</a>
        </p>
        <p>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36010802001252" target="_blank">赣公网安备 36010802001252号</a>
        </p>
        <p>
             &copy; 2025-{{ year }} struct@杰构体
        </p>
    </div>

</template>

<style scoped>
    
    * {
        color: rgb(240, 244, 244);
        font-size: 0.875rem;
    }

    .FooterBar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 15vh;
        margin-top: 50px;

        background-color: rgb(26, 26, 29);
        border-top: 1px solid rgb(70, 70, 70);
    }

    p {
        margin: 0px;
        margin-top: 5px;
    }

</style>