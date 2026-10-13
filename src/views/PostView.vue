<script setup>
    
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'

// 引入样式
import '../styles/markdown.css'
import InformationCard from '../components/InformationCard.vue'

const route = useRoute()
const loading = ref(true)
const error = ref(false)
const contentHtml = ref('')
const meta = ref({})
const toc = ref([]) // 目录数据
const articleRef = ref(null) // 获取正文 DOM 元素
const activeId = ref('')    // 存储当前高亮ID

// === 1. 配置 markdown-it 和 anchor 插件 ===
// 定义中文友好的 ID 生成器 (Slugify)
const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
}).use(MarkdownItAnchor, {
    permalink: false, // 不显示 ¶ 符号，只生成 ID
    slugify: slugify  // 必须配置这个，否则中文标题无法跳转
})

// === 2. 解析 Frontmatter (元数据) ===
function parseMarkdownWithMetadata(markdownContent) {

    if (typeof text !== 'string'){
        return { meta: {}, content: '' }
    } 
    const normalizedText = text.replace(/\r\n/g, '\n')
    const re = /^---\n([\s\S]+?)\n---/
    const match = normalizedText.match(re)
    
    const result = { meta: {}, content: normalizedText }
    if (!match) {
        return result
    }else{
        // 解析元数据
        const metaStr = match[1].trim()
        if (!metaStr) {
            return result
        }else{
            const lines = metaStr.split('\n');
            const metadata = {};

            lines.forEach(line => {
                const parts = line.split(':')

                // 匹配键值对（支持冒号后有空格的情况）
                const keyValueMatch = line.match(/^(\w+)\s*:\s*(.*)$/);
                if (!keyValueMatch) return; // 跳过无效格式行

                const [, key, valueStr] = keyValueMatch;
                const trimmedValue = valueStr.trim();

                // 3. 自动识别值类型并转换
                if (trimmedValue.startsWith('- ')) {
                    // 处理数组类型（如 tags: - 闲聊 - MySQL）
                    const arrayValues = metadataStr
                    .split('\n')
                    .filter(l => l.trim().startsWith('- '))
                    .map(l => l.replace(/^-+\s*/, '').trim());
                    metadata[key] = arrayValues;
                } else if (!isNaN(trimmedValue)) {
                    // 处理数字类型（如 top: 1）
                    metadata[key] = Number(trimmedValue);
                } else if (trimmedValue.toLowerCase() === 'true') {
                    // 处理布尔值 true
                    metadata[key] = true;
                } else if (trimmedValue.toLowerCase() === 'false') {
                    // 处理布尔值 false
                    metadata[key] = false;
                } else {
                    // 默认视为字符串类型
                    metadata[key] = trimmedValue;
                }
            });
            result.meta = metadata
        }
        // 解析正文
        result.content = normalizedText.replace(match[0], '').trim()

        return result
    }
}

const parseMarkdown = (text) => {

    if (typeof text !== 'string'){
        return { meta: {}, content: '' }
    } 
    const normalizedText = text.replace(/\r\n/g, '\n')
    const re = /^---\n([\s\S]+?)\n---/
    const match = normalizedText.match(re)
    
    const result = { meta: {}, content: normalizedText }
    if (match) {
        const metaStr = match[1]
        metaStr.split('\n').forEach(line => {
        const parts = line.split(':')
        if (parts.length >= 2) {
            result.meta[parts[0].trim()] = parts.slice(1).join(':').trim()
        }
        })
        result.content = normalizedText.replace(match[0], '').trim()
    }
    return result
}

// === 加载文章 ===
const loadPost = async () => {
    loading.value = true
    error.value = false
    toc.value = [] // 清空目录
    
    try {
        // 请求 public 下的文件
        const res = await axios.get(`/posts/${route.params.id}.md?t=${Date.now()}`, {
        responseType: 'text'
        })
        
        // 解析数据
        const { meta: metaData, content } = parseMarkdown(res.data)
        meta.value = metaData
        
        // 渲染 HTML (此时 markdown-it-anchor 会自动给 h1/h2 添加 id)
        contentHtml.value = md.render(content)
    } catch (e) {
        console.error(e)
        error.value = true
    } finally {
        loading.value = false
    }
}

// === 生成目录函数 (抓取 DOM) ===
const generateToc = () => {
    if (!articleRef.value) return

    // 查找文章内的所有 h2 和 h3
    const headers = articleRef.value.querySelectorAll('h2, h3')
    
    const tocData = []
    headers.forEach(header => {
        tocData.push({
            id: header.id, // 这个 ID 是 markdown-it-anchor 自动生成的
            text: header.innerText,
            tagName: header.tagName.toLowerCase() // 'h2' or 'h3'
        })
    })
    
    toc.value = tocData
}

// === 平滑滚动 ===
const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        })
    }
}

// === 新增：滚动监听函数 ===
const handleScroll = () => {
    if (toc.value.length === 0) return

    // 这里的 100 是一个偏移量，代表距离顶部 100px 时就认为进入了该章节
    const offset = 100 
    const scrollY = window.scrollY

    // 我们只需要找目录里记录的那些标题的 DOM
    // 倒序遍历：找到第一个“位置在 offset 上方”的标题，它就是当前激活的标题
    let currentId = ' '
    
    for (let i = toc.value.length - 1; i >= 0; i--) {
        const item = toc.value[i]
        const element = document.getElementById(item.id)
        
        if (element) {
            // 获取元素相对于文档顶部的距离
            const top = element.offsetTop
            
            // 如果当前的滚动距离 + 偏移量 > 元素的顶部距离
            // 说明我们已经滚过了这个标题
            if (scrollY + offset >= top) {
                currentId = item.id
                break // 找到了最下面的那个符合条件的，停止循环
            }
        }
    }

    // 赋值
    activeId.value = currentId
}

watch(() => route.params.id, async() => {
    // 1. 重置目录
    toc.value = []
    
    await loadPost()
        
    // 2. 等待 Vue 渲染完成 (nextTick)
    await nextTick()
        
    // 3. 生成目录
    if (articleRef.value) {
        generateToc()
    }
}, { immediate: true })// immediate: true 保证组件一挂载就执行一次

onMounted(() => {
    window.addEventListener('scroll', handleScroll) // 绑定滚动
    console.log(meta);
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll) // 记得销毁，防止内存泄漏
})

</script>

<template>
    <div class="container">
        <!-- 左侧：信息卡 -->
        <InformationCard class="information"></InformationCard>

        <!-- 中间：文章内容区 -->
        <div class="post-main">
            <div v-if="loading">加载中...</div>
            <div v-else-if="error">文章加载失败</div>
            
            <div v-else>
                <!-- 标题头 -->
                <header class="post-header" v-if="meta.title">
                    <h1>{{ meta.title }}</h1>
                    <div class="meta">
                        <div class="post-date">
                            <span class="publish-date" v-if="meta.date">
                                <div class="i-ri-calendar-line" title="发布日期"></div>
                                <time datetime="">{{ meta.date }}</time>
                            </span>
                            <span class="update-date" v-if="meta.update">
                                <div class="i-ri-calendar-2-line" title="更新日期"></div>
                                <time datetime="">{{ meta.update }}</time>
                            </span>
                        </div>
                    </div>
                    <hr />
                </header>

                <!-- 正文内容 (v-html) -->
                <!-- ref="articleRef" 用于后续提取目录 -->
                <article ref="articleRef" class="markdown-body" v-html="contentHtml"></article>
            </div>
        </div>

        <!-- 右侧：悬浮目录 -->
        <aside class="toc-sidebar">
            <div class="toc-card">
                <h3>目录</h3>
                <ul>
                    <li v-if="toc.length <= 1">
                        本文
                    </li>
                    <li v-for="item in toc" :key="item.id" :class="['toc-item', `level-${item.tagName}`]">
                        <!-- 点击平滑滚动 -->
                        <a :href="`#${item.id}`" :class="{ active: activeId === item.id }" @click.prevent="scrollToHeading(item.id)">
                            {{ item.text }}
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    </div>
</template>

<style scoped>
    /* 布局样式 */
    .container {
        width: 95%;
        max-width: 1400px;
        margin: 0 auto;
        padding-top: 60px;
        align-items: flex-start;

        /* 布局 */
        display: flex;
        /* grid-template-columns: 2fr 1fr; */
        gap: 20px;
    }

    .post-main {
        flex: 1;
        min-width: 0;
        background-color: #2c333b;
        color: white;
        padding: 20px;
        border-radius: 8px;
        padding-bottom: 50%;
    }

    .post-main, h2, h3 {
        scroll-margin-top: 50px;
    }

    .post-header {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .post-header > h1 {
        text-align: center;
        justify-content: center;
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

    .post-header > hr {
        width: 100%;
    }

    /* 目录侧边栏 */
    .toc-sidebar {
        width: 320px;
        flex-shrink: 0;
        top: 20px;
        max-height: 80vh;
        overflow-y: auto;
        padding-bottom: 150px;

        background-color: #2c333b;
        color: white;

        /* 悬空固定 */        
        position: sticky;
        top: 60px;

    }

    .toc-card {
        padding-left: 15px;
        padding-right: 15px;
    }

    .toc-card h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: white;
        text-align: center;
    }

    .toc-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .toc-item {
        margin-bottom: 8px;
        font-size: 1.0rem;
        line-height: 1.4;
    }

    .toc-item a {
        text-decoration: none;
        color: #666;
        display: block;
        transition: all 0.2s;
        
        /* 增加左边框用于显示高亮条 */
        border-left: 2px solid transparent; 
        padding-left: 8px; /* 给文字留点空隙 */
    }

    /* 鼠标悬停 */
    .toc-item a:hover {
        color: #42b883;
    }

    /* === 激活状态的样式 === */
    .toc-item a.active {
        color: #42b883; /* 文字变绿 */
        font-weight: bold; /* 加粗 */
        border-left-color: #42b883; /* 左侧亮起一条绿线 */
        background-color: rgba(66, 184, 131, 0.1); /* 可选：加个淡淡的背景 */
    }

    /* 缩进 */
    .level-h3 {
        padding-left: 15px;
        padding-right: 15px;
        font-size: 0.85rem;
        color: #888;
    }

    /* 移动端隐藏目录 */
    @media (max-width: 1500px) {
        .toc-sidebar {
            display: none;
        }
    }
</style>