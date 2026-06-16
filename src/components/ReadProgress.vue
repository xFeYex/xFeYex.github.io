<template>
  <div class="read-progress" aria-hidden="true">
    <div class="read-progress-bar" :style="{ width: progress + '%' }"></div>
    <div class="read-progress-glow" :style="{ left: progress + '%' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // 监听的滚动容器（默认 window）
  target: { type: [String, Object], default: 'window' },
  // 进度计算的"参考元素"——一般为文章正文
  // 进度 = (滚动距离) / (总可滚动距离)
})

const progress = ref(0)
let raf = 0

function getMetrics() {
  // 通过查询根元素下的 .post-content 计算
  const el = document.querySelector('.post-content')
  if (!el) return { ratio: 0 }
  const rect = el.getBoundingClientRect()
  const winH = window.innerHeight
  const total = rect.height - winH
  if (total <= 0) return { ratio: 0 }
  // 已滚动多少（参考元素顶部距离视口顶部的距离）
  const scrolled = -rect.top
  const ratio = Math.max(0, Math.min(1, scrolled / total))
  return { ratio }
}

function update() {
  raf = 0
  const { ratio } = getMetrics()
  progress.value = Math.round(ratio * 1000) / 10
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.read-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--border-faint);
  z-index: 200;
  pointer-events: none;
}

.read-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-soft), var(--accent));
  transition: width 0.1s linear;
  box-shadow: 0 0 12px var(--accent-soft);
}

.read-progress-glow {
  position: absolute;
  top: -3px;
  width: 12px;
  height: 8px;
  transform: translateX(-50%);
  background: var(--accent);
  border-radius: 50%;
  filter: blur(4px);
  opacity: 0.7;
  transition: left 0.1s linear;
}
</style>
