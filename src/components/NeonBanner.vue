<template>
  <section class="neon-banner">
    <div class="neon-grid"></div>
    <div class="banner-content">
      <h1>欢迎来到 struct@杰构体 的博客</h1>
      <p>未来风 · 个人创作 · 技术分享</p>
      <div class="glow-line"></div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.neon-banner {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: radial-gradient(circle at top, rgba(46, 255, 255, 0.12), transparent 42%),
    radial-gradient(circle at bottom right, rgba(123, 89, 255, 0.14), transparent 28%),
    #050505;
}

.neon-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.35;
  pointer-events: none;
  animation: gridMove 18s linear infinite;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #e9f9ff;
}

.banner-content h1 {
  font-size: clamp(2rem, 4vw, 4.2rem);
  letter-spacing: 0.24em;
  margin: 0;
  text-transform: uppercase;
  color: #a1f1ff;
  text-shadow: 0 0 20px rgba(162, 247, 255, 0.35), 0 0 36px rgba(120, 91, 255, 0.18);
}

.banner-content p {
  margin: 0.8rem auto 0;
  max-width: 760px;
  font-size: 1.05rem;
  color: #d7f7ff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.12);
}

.glow-line {
  margin: 24px auto 0;
  width: 160px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(98, 219, 255, 0.8), rgba(255, 255, 255, 1), rgba(134, 102, 255, 0.8));
  box-shadow: 0 0 24px rgba(98, 219, 255, 0.35), 0 0 48px rgba(134, 102, 255, 0.2);
  animation: pulse 2.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scaleX(0.92);
    opacity: 0.9;
  }
  50% {
    transform: scaleX(1.05);
    opacity: 1;
  }
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-40px, 40px); }
}
</style>