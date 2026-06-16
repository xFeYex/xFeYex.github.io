<template>
  <transition name="back-to-top">
    <button
      v-show="visible"
      class="back-to-top"
      :class="{ 'is-pulsing': pulsing }"
      @click="scrollTop"
      aria-label="回到顶部"
      title="回到顶部"
    >
      <span class="btt-arrow">▲</span>
      <span class="btt-text font-tech">TOP</span>
      <span class="btt-corner tl"></span>
      <span class="btt-corner tr"></span>
      <span class="btt-corner bl"></span>
      <span class="btt-corner br"></span>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const pulsing = ref(false)
let raf = 0

function check() {
  raf = 0
  visible.value = window.scrollY > 600
}

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(check)
}

function scrollTop() {
  pulsing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => (pulsing.value = false), 600)
}

onMounted(() => {
  check()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 48px;
  height: 48px;
  background: var(--panel-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s var(--ease-soft);
  font-family: var(--font-tech);
}

.back-to-top:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
  transform: translateY(-3px);
  box-shadow: 0 0 20px var(--accent-soft);
}

.back-to-top.is-pulsing {
  animation: btt-pulse 0.6s var(--ease-out-expo);
}

.btt-arrow {
  font-size: 12px;
  line-height: 1;
}
.btt-text {
  font-size: 8px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.btt-corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid var(--accent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.btt-corner.tl { top: 2px; left: 2px; border-right: none; border-bottom: none; }
.btt-corner.tr { top: 2px; right: 2px; border-left: none; border-bottom: none; }
.btt-corner.bl { bottom: 2px; left: 2px; border-right: none; border-top: none; }
.btt-corner.br { bottom: 2px; right: 2px; border-left: none; border-top: none; }
.back-to-top:hover .btt-corner { opacity: 0.8; }

@keyframes btt-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.3s var(--ease-out-expo);
}
.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
