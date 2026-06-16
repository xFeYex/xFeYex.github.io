<template>
  <div class="mobile-nav" :class="{ open, dragging }">
    <!-- 悬浮球 -->
    <button
      class="fab"
      :class="{ open }"
      :style="fabStyle"
      @touchstart="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @click="onClick"
      :aria-label="open ? $t('mobile.close') : $t('mobile.open')"
    >
      <span class="fab-ring"></span>
      <span class="fab-icon">
        <Icon :icon="open ? 'mdi:close' : 'mdi:grid'" />
      </span>
      <span v-if="!open" class="fab-pulse"></span>
    </button>

    <!-- 展开后的扇形菜单 -->
    <transition-group name="mn-pop" tag="div" class="mn-menu" v-if="open">
      <router-link
        v-for="(item, i) in menuItems"
        :key="item.to"
        :to="item.to"
        class="mn-item"
        :style="itemStyle(i)"
        @click="open = false"
        :aria-label="item.label"
      >
        <span class="mn-bubble">
          <Icon :icon="item.icon" />
        </span>
        <span class="mn-label font-tech">{{ item.label }}</span>
      </router-link>
    </transition-group>

    <!-- 遮罩 -->
    <transition name="mn-mask">
      <div v-if="open" class="mn-mask" @click="open = false"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const open = ref(false)
const dragging = ref(false)

// 浮球位置（百分比，便于响应式）
const pos = reactive({ x: 92, y: 78 })
let dragStart = null
let moved = false

// 浮球样式
const fabStyle = computed(() => ({
  left: pos.x + 'vw',
  top: pos.y + 'vh',
}))

// 菜单项
const menuItems = computed(() => ([
  { to: '/', icon: 'mdi:home-outline', label: t('nav.home') },
  { to: '/blog', icon: 'mdi:book-open-outline', label: t('nav.blog') },
  { to: '/moments', icon: 'mdi:message-text-outline', label: t('nav.moments') },
  { to: '/projects', icon: 'mdi:rocket-launch-outline', label: t('nav.projects') },
  { to: '/archive', icon: 'mdi:archive-outline', label: t('nav.archive') },
  { to: '/about', icon: 'mdi:account-circle-outline', label: t('nav.about') },
  { to: '/links', icon: 'mdi:link-variant', label: t('nav.links') },
]))

// 扇形展开 - 弧度方向（从下到上，逆时针）
const RADIUS = 110 // px

function itemStyle(i) {
  const total = menuItems.value.length
  // 从右下角扇形展开：起始角度 180°，每项 -25°，向左上辐射
  const angle = 180 - (i * (180 / (total - 1)))
  const rad = (angle * Math.PI) / 180
  // 浮球中心位置（px）
  const fabX = window.innerWidth * pos.x / 100
  const fabY = window.innerHeight * pos.y / 100
  const x = fabX + Math.cos(rad) * RADIUS - 22
  const y = fabY + Math.sin(rad) * RADIUS - 22
  return {
    left: x + 'px',
    top: y + 'px',
    transitionDelay: open.value ? (i * 30) + 'ms' : '0ms',
  }
}

function onClick() {
  if (moved) {
    moved = false
    return
  }
  open.value = !open.value
}

// 拖拽 - 触摸
function onTouchStart(e) {
  if (e.touches.length !== 1) return
  const t = e.touches[0]
  dragStart = { x: t.clientX, y: t.clientY, sx: pos.x, sy: pos.y }
  moved = false
}
function onTouchMove(e) {
  if (!dragStart) return
  const t = e.touches[0]
  const dx = t.clientX - dragStart.x
  const dy = t.clientY - dragStart.y
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
    dragging.value = true
    moved = true
  }
  if (!dragging.value) return
  pos.x = clamp(dragStart.sx + (dx / window.innerWidth) * 100, 0, 92)
  pos.y = clamp(dragStart.sy + (dy / window.innerHeight) * 100, 0, 88)
}
function onTouchEnd() {
  dragging.value = false
  setTimeout(() => { dragStart = null }, 50)
}

// 拖拽 - 鼠标
let mouseDrag = null
function onMouseDown(e) {
  mouseDrag = { x: e.clientX, y: e.clientY, sx: pos.x, sy: pos.y }
  moved = false
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
function onMouseMove(e) {
  if (!mouseDrag) return
  const dx = e.clientX - mouseDrag.x
  const dy = e.clientY - mouseDrag.y
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
    dragging.value = true
    moved = true
  }
  if (!dragging.value) return
  pos.x = clamp(mouseDrag.sx + (dx / window.innerWidth) * 100, 0, 92)
  pos.y = clamp(mouseDrag.sy + (dy / window.innerHeight) * 100, 0, 88)
}
function onMouseUp() {
  dragging.value = false
  mouseDrag = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  setTimeout(() => { moved = false }, 50)
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

onMounted(() => {})
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  /* 仅 < 768px 显示 */
}
@media (min-width: 769px) {
  .mobile-nav { display: none; }
}

/* 浮球 */
.fab {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 22px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 210;
  transition: transform 0.3s var(--ease-soft), background 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
  box-shadow: var(--shadow-card);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
.fab:hover, .fab.open {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
  box-shadow: var(--shadow-card), 0 0 20px var(--accent-soft);
}
.fab.open {
  transform: rotate(90deg) scale(1.05);
}
.fab.dragging {
  transition: none;
  cursor: grabbing;
  transform: scale(1.08);
}
.fab-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.fab-ring {
  position: absolute;
  inset: -4px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  opacity: 0.3;
  animation: ring-pulse 3s ease-in-out infinite;
}
.fab.open .fab-ring { display: none; }
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.15); opacity: 0.5; }
}
.fab-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--accent);
  animation: fab-pulse 2.4s ease-out infinite;
  pointer-events: none;
}
@keyframes fab-pulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* 菜单项 */
.mn-menu {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 205;
}
.mn-item {
  position: fixed;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  z-index: 206;
  cursor: pointer;
}
.mn-bubble {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  font-size: 18px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s var(--ease-soft);
}
.mn-item:hover .mn-bubble,
.mn-item.router-link-active .mn-bubble {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
  box-shadow: 0 0 16px var(--accent-soft);
  transform: scale(1.1);
}
.mn-item.router-link-active .mn-bubble {
  background: var(--accent-soft);
}
.mn-label {
  font-size: 9px;
  color: var(--text-dim);
  padding: 2px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  white-space: nowrap;
}

/* 遮罩 */
.mn-mask {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%),
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.7) 100%);
  pointer-events: auto;
  z-index: 200;
}

/* 菜单入场 */
.mn-pop-enter-active,
.mn-pop-leave-active {
  transition: opacity 0.3s var(--ease-soft), transform 0.4s var(--ease-out-expo);
}
.mn-pop-enter-from {
  opacity: 0;
  transform: scale(0.3);
}
.mn-pop-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.mn-mask-enter-active,
.mn-mask-leave-active {
  transition: opacity 0.3s;
}
.mn-mask-enter-from,
.mn-mask-leave-to { opacity: 0; }
</style>
