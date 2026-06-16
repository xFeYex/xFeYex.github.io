<template>
  <div class="layout">
    <!-- 装饰层 -->
    <div class="stars"></div>
    <div class="scanline"></div>
    <div class="vignette"></div>

    <!-- 顶部状态条 -->
    <StatusBar />

    <!-- 导航 -->
    <PageNav />

    <!-- 主内容 -->
    <main class="main">
      <slot />
    </main>

    <!-- 底部 -->
    <PageFooter />

    <!-- 音乐播放器（左下浮窗） -->
    <MusicPlayer />

    <!-- 移动端悬浮球导航 -->
    <MobileNav />
  </div>
</template>

<script setup>
import StatusBar from '@/components/StatusBar.vue'
import PageNav from '@/components/PageNav.vue'
import PageFooter from '@/components/PageFooter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import MobileNav from '@/components/MobileNav.vue'
</script>

<style scoped>
.layout {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.main {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

/* 装饰层 */
.stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(1px 1px at 20% 30%, var(--text-primary), transparent),
    radial-gradient(1px 1px at 60% 70%, var(--accent), transparent),
    radial-gradient(1px 1px at 80% 10%, var(--text-primary), transparent),
    radial-gradient(1px 1px at 30% 80%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 90% 50%, var(--text-primary), transparent),
    radial-gradient(2px 2px at 15% 60%, var(--accent), transparent),
    radial-gradient(1px 1px at 50% 40%, var(--text-primary), transparent);
  background-size: 100% 100%;
  animation: twinkle 8s ease-in-out infinite alternate;
}

.scanline {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(180deg, transparent 0%, transparent 50%, var(--accent-soft) 50%, transparent 51%);
  background-size: 100% 4px;
  opacity: 0.5;
}

.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.35) 100%);
}

@media (max-width: 768px) {
  .main { padding: 0 20px; }
}
</style>
