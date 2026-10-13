// uno.config.js
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    // 基础预设 (让你能用 class="m-2 flex text-red" 这种原子类)
    presetUno(),
    
    // 图标预设
    presetIcons({
      scale: 1, // 图标默认放大一点点，好看
      cdn: 'https://esm.sh/', // 只有开发环境偶尔需要，通常本地包就够了
    }),
  ],
})