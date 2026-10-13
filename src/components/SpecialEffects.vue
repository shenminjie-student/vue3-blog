<template>
    <div class="SpecialEffects">
        <canvas ref="canvasRef" class="canvas"></canvas>
    </div>    
</template>

<script setup>
// 使用组合式API
import {ref, onMounted} from 'vue';
import { vueDeviceDetect } from 'vue-device-detect';

const canvasRef = ref();
let ctx = null;

const particles = [];         // 存放所有粒子对象的数组
const particleCount = 20;    // 屏幕上粒子的总数量
const connectionDistance = 150; // 粒子之间连线的最大距离
const mouseDistance = 200;    // 鼠标与粒子连线的最大距离

// 用于记录鼠标当前位置
const mouse = { x: null, y: null };


// 调整画布大小以填充整个浏览器窗口
let width, height;
function resize() {
    if (canvasRef.value) {
        width = window.innerWidth;
        height = window.innerHeight;
        canvasRef.value.width = width;
        canvasRef.value.height = height;
    }    
}


class Particle {
    // 构造函数
    constructor() {
        // 随机生成初始位置 (0 到 屏幕宽/高 之间)
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // 随机生成速度向量
        // Math.random() - 0.5 生成 -0.5 到 0.5 之间的数
        // 乘以 1.5 后，速度范围是 -0.75 到 0.75
        // 这样粒子可以向左/上(负数)或向右/下(正数)移动
        this.vx = (Math.random() - 0.5) * 1.5; 
        this.vy = (Math.random() - 0.5) * 1.5; 
        
        // 随机大小 (1 到 3 像素)
        this.size = Math.random() * 2 + 1;
        
        // 基础颜色 (青色 RGB)，后续会在绘制时动态添加透明度 Alpha
        this.color = 'rgba(100, 255, 218, '; 
    }

    // 更新粒子状态（物理引擎核心）
    update() {
        // 位置 = 当前位置 + 速度
        this.x += this.vx;
        this.y += this.vy;

        // --- 边界检测与反弹 ---
        // 如果粒子碰到左边缘 (<0) 或 右边缘 (>width)，X轴速度取反
        if (this.x < 0 || this.x > width) this.vx *= -1;
        
        // 如果粒子碰到上边缘 (<0) 或 下边缘 (>height)，Y轴速度取反
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    // 将粒子绘制到画布上
    draw() {
        ctx.fillStyle = this.color + '0.3)'; // 设置填充颜色，透明度固定为 0.8
        ctx.beginPath(); // 开始新路径
        // 绘制圆形: arc(x, y, 半径, 起始角, 结束角)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill(); // 填充颜色
    }
}

// 动画循环
function animate() {
    if (!ctx || !canvasRef.value) return;

    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
}

    
function connectParticles() {
    // 双重循环：让每个粒子都和其他所有粒子进行比较
    for (let a = 0; a < particles.length; a++) {
        // b 从 a 开始，避免重复连线 (A连B 和 B连A 是同一条线)
        for (let b = a; b < particles.length; b++) {
            
            // 计算两点之间的距离 (勾股定理)
            // dist = sqrt(dx^2 + dy^2)
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 如果距离小于设定的阈值，则画线
            if (distance < connectionDistance) {
                // 计算透明度：距离越近越不透明(1)，距离越远越透明(0)
                const opacity = 1 - (distance / connectionDistance);
                
                // 设置线条样式
                ctx.strokeStyle = 'rgba(100, 255, 218,' + opacity * 0.2 + ')';
                ctx.lineWidth = 1;
                
                // 画线
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y); // 起点
                ctx.lineTo(particles[b].x, particles[b].y); // 终点
                ctx.stroke(); // 描边
            }
        }

        // --- 粒子与鼠标的连线逻辑 ---
        // 只有当鼠标在窗口内 (不为 null) 时才计算
        if (mouse.x != null) {
            const dx = particles[a].x - mouse.x;
            const dy = particles[a].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                // 鼠标连线稍微亮一点 (* 0.5 而不是 * 0.2)
                const opacity = 1 - (distance / mouseDistance);
                ctx.strokeStyle = 'rgba(255, 255, 255,' + opacity * 0.5 + ')';
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}


onMounted(() => {
    if (canvasRef.value) {
        ctx = canvasRef.value.getContext('2d');
        resize();

        // 初始化粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // 绑定事件
        window.addEventListener('resize', resize);
        
        // 监听鼠标移动，更新坐标
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        // 鼠标移出窗口时，清空坐标，断开与鼠标的连线
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // 启动动画
        animate();
    }
});
</script>

<style scoped>

canvas {
    display: block;
    background-color: rgba(0, 0, 0, 0);
    /* 位置 */
    position: fixed;
    left: 0px;
    z-index: 9999;
    /* 事件穿透 */
    pointer-events: none;
}

</style>