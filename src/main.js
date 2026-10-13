import { createApp } from 'vue'
import './base-style.css'
import App from './App.vue'

import router from './router'
// 引入CSS
import 'virtual:uno.css'

createApp(App).use(router).mount('#app')
