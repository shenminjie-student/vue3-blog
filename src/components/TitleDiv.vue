<script setup>

defineProps({
    content: String
})

</script>

<template>
 <div class="TitleDiv">
    {{ content }}
 </div>
</template>

<style scoped>

.TitleDiv {
    font-family: "Comic Sans MS", cursive;
    font-weight: 400;
    font-size: 1.5rem;

    /* 使用before和after需要元素相对定位 */
    width: max-content;
    height: max-content;
    position: relative;
    margin: 10px;
    padding-left: 5px;
    padding-right: 5px;
}

.TitleDiv::before, .TitleDiv::after {
    content: '';
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    position: absolute;
    border-color: white;
    /* 动画 */
    transition: top 0.3s, left 0.3s, right 0.3s, bottom 0.3s, opacity 0.3s;
    transition-timing-function: cubic-bezier(.17, .67, .05, 1.29);
}

.TitleDiv::before {
    opacity: 0;
    top: 0px;
    left: 0px;

    /* 边框 */
    border-top: 2px solid;
    border-left: 2px solid;
    
}

.TitleDiv::after {
    opacity: 0;
    bottom: 0px;
    right: 0px;

    /* 边框 */
    border-bottom: 2px solid;
    border-right: 2px solid;
    
}

.TitleDiv:hover::before {
    opacity: 1;
    top: -5px;
    left: -10px;

    /* 边框 */
    border-top: 2px solid;
    border-left: 2px solid;
    
}

.TitleDiv:hover::after {
    opacity: 1;
    bottom: -5px;
    right: -10px;

    /* 边框 */
    border-bottom: 2px solid;
    border-right: 2px solid;
    
}

</style>