<template>
  <aside class="toc" v-if="items.length">
    <div class="toc-header font-tech">
      <span class="dot"></span>
      <span>// OUTLINE</span>
    </div>
    <ul class="toc-list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="['toc-item', `depth-${item.depth}`, { active: activeId === item.id }]"
      >
        <a :href="`#${item.id}`" @click.prevent="jump(item.id)">
          <span class="toc-line"></span>
          <span class="toc-text">{{ item.text }}</span>
        </a>
      </li>
    </ul>
    <div class="toc-footer font-tech">
      <span>{{ items.length }}</span> SECTIONS
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  offsetTop: { type: Number, default: 80 },
})

const activeId = ref('')
let observer = null

function jump(id) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - props.offsetTop
  window.scrollTo({ top: y, behavior: 'smooth' })
  // 立即高亮（不等 observer 触发）
  activeId.value = id
}

onMounted(() => {
  if (!('IntersectionObserver' in window) || !props.items.length) return

  // 收集所有 heading 元素
  const targets = props.items
    .map((it) => document.getElementById(it.id))
    .filter(Boolean)
  if (!targets.length) return

  // 进入视口即高亮
  observer = new IntersectionObserver(
    (entries) => {
      // 选最近顶部且已可见的那个
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  )
  targets.forEach((t) => observer.observe(t))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.toc {
  position: sticky;
  top: 100px;
  padding: 20px 18px;
  background: var(--panel-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--border-faint);
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  font-family: var(--font-serif);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  padding-bottom: 12px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--border-faint);
  text-transform: uppercase;
}
.toc-header .dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-item a {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 6px 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-dim);
  text-decoration: none;
  transition: color 0.3s;
}

.toc-item .toc-line {
  flex-shrink: 0;
  width: 2px;
  height: 14px;
  background: var(--border-faint);
  transition: all 0.3s var(--ease-soft);
}

.toc-item.depth-3 {
  padding-left: 14px;
}
.toc-item.depth-3 .toc-text { font-size: 12px; }

.toc-item a:hover {
  color: var(--text-secondary);
}
.toc-item a:hover .toc-line {
  background: var(--border-color);
  height: 18px;
}

.toc-item.active a {
  color: var(--accent);
}
.toc-item.active .toc-line {
  background: var(--accent);
  height: 18px;
  box-shadow: 0 0 8px var(--accent-soft);
}

.toc-footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-faint);
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.toc-footer span {
  color: var(--accent);
  font-weight: 700;
}

@media (max-width: 1024px) {
  .toc {
    position: static;
    max-height: none;
    margin: 32px 0;
  }
}
</style>
