<template>
  <div class="blog-view">
    <!-- Hero / 头部 -->
    <section class="blog-hero">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="blog-hero-grid">
        <div class="blog-hero-main">
          <div class="blog-tag font-tech">// ARCHIVE // INDEX</div>
          <h1 class="blog-title">
            <span class="title-cn">文章</span>
            <span class="title-en">/ ARTICLES</span>
          </h1>
          <p class="blog-desc">
            慢慢写，慢慢想。技术、设计、ACG、随笔——都收在这里。<br>
            按 <span class="text-accent">置顶 + 时间</span> 排序，共 <span class="text-accent">{{ posts.length }}</span> 篇。
          </p>
        </div>

        <div class="blog-hero-aside">
          <div class="aside-stat">
            <div class="stat-num font-display">{{ posts.length }}</div>
            <div class="stat-label font-tech">TOTAL POSTS</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ tags.length }}</div>
            <div class="stat-label font-tech">TAGS</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ totalWords }}<span>k</span></div>
            <div class="stat-label font-tech">WORDS</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 标签筛选 -->
    <section class="filter-bar">
      <span class="filter-label font-tech">// FILTER:</span>
      <button
        v-for="t in tagOptions"
        :key="t.value"
        class="filter-chip"
        :class="{ active: activeTag === t.value }"
        @click="activeTag = t.value"
      >
        <span class="chip-name">{{ t.label }}</span>
        <span v-if="t.count !== null" class="chip-count font-tech">{{ t.count }}</span>
      </button>
    </section>

    <!-- 列表 -->
    <section class="post-grid">
      <div
        v-for="(p, i) in filtered"
        :key="p.slug"
        class="grid-item"
        :class="cellClass(i)"
      >
        <div v-if="p.pinned" class="pinned-flag font-tech" title="置顶">
          <Icon icon="mdi:pin" /> PINNED
        </div>
        <PostCard :post="mapPost(p)" :size="i === 0 ? 'lg' : 'md'" />
      </div>

      <div v-if="!filtered.length" class="empty">
        <Icon icon="mdi:archive-search-outline" class="empty-icon" />
        <div class="empty-text">该标签下还没有文章</div>
        <button class="empty-btn" @click="activeTag = 'ALL'">查看全部</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import PostCard from '@/components/PostCard.vue'
import { usePosts } from '@/composables/usePosts'

const { posts, tags, tagCounts } = usePosts()
const route = useRoute()
const activeTag = ref(String(route.query.tag || 'ALL'))

watch(
  () => route.query.tag,
  (t) => { activeTag.value = String(t || 'ALL') },
)

const tagOptions = computed(() => {
  return [
    { value: 'ALL', label: '全部', count: posts.value.length },
    ...tags.value.map((t) => ({ value: t, label: `#${t}`, count: tagCounts.value[t] || 0 })),
  ]
})

const filtered = computed(() => {
  if (activeTag.value === 'ALL') return posts.value
  return posts.value.filter(
    (p) => Array.isArray(p.tags) && p.tags.includes(activeTag.value),
  )
})

const totalWords = computed(() => {
  const w = posts.value.reduce((acc, p) => {
    const cjk = (p.raw || '').match(/[\u4e00-\u9fff]/g)?.length || 0
    return acc + cjk
  }, 0)
  return Math.max(1, Math.round(w / 1000))
})

function cellClass(i) {
  if (i === 0) return 'cell-lg'
  if (i % 5 === 1) return 'cell-tall'
  return 'cell-md'
}

function mapPost(p) {
  return {
    title: p.title,
    excerpt: p.excerpt,
    cover: p.cover,
    date: formatDate(p.date),
    readTime: p.readTime,
    tag: p.tag,
    tags: p.tags,
    to: p.to,
  }
}

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.blog-view { position: relative; padding-bottom: 60px; }

/* ============== Hero ============== */
.blog-hero {
  position: relative;
  padding: 40px 36px 32px;
  margin-bottom: 32px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.hud-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 1px solid var(--accent);
  opacity: 0.7;
}
.hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

.blog-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--accent-faint) 0%, transparent 60%);
  pointer-events: none;
}

.blog-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 40px;
  align-items: center;
}

.blog-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 16px;
  padding: 4px 10px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
}

.blog-title {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  margin: 0 0 16px;
  line-height: 1.1;
}
.title-cn {
  font-family: var(--font-serif);
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.15em;
}
.title-en {
  font-family: var(--font-tech);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dim);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.blog-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
  max-width: 560px;
}
.text-accent { color: var(--accent); }

.blog-hero-aside {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  border-left: 2px solid var(--accent);
}
.aside-stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}
.aside-stat + .aside-stat {
  border-top: 1px solid var(--border-faint);
  padding-top: 12px;
}
.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.05em;
  line-height: 1;
}
.stat-num span {
  font-size: 12px;
  color: var(--text-dim);
  margin-left: 2px;
}
.stat-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
}

/* ============== 标签筛选 ============== */
.filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 32px;
  padding: 14px 18px;
  background: var(--panel-bg);
  border: 1px solid var(--border-faint);
}
.filter-label {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-right: 4px;
}
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 12px;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s var(--ease-soft);
}
.filter-chip:hover {
  color: var(--accent);
  border-color: var(--border-color);
  background: var(--accent-faint);
}
.filter-chip.active {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: var(--accent);
  box-shadow: 0 0 12px var(--accent-soft);
}
.chip-count {
  font-size: 9px;
  color: var(--text-dim);
  padding: 1px 5px;
  background: var(--bg-deep);
  border: 1px solid var(--border-faint);
}
.filter-chip.active .chip-count {
  color: var(--accent);
  border-color: var(--accent);
}

/* ============== 网格 ============== */
.post-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-auto-rows: minmax(200px, auto);
  gap: 20px;
}
.grid-item {
  position: relative;
  animation: cell-in 0.6s var(--ease-out-expo) backwards;
}
.grid-item:nth-child(1) { animation-delay: 0.0s; }
.grid-item:nth-child(2) { animation-delay: 0.05s; }
.grid-item:nth-child(3) { animation-delay: 0.1s; }
.grid-item:nth-child(4) { animation-delay: 0.15s; }
.grid-item:nth-child(5) { animation-delay: 0.2s; }
.grid-item:nth-child(6) { animation-delay: 0.25s; }

.cell-lg { grid-column: span 1; }
.cell-tall { grid-row: span 1; }

@keyframes cell-in {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.pinned-flag {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-inverse);
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-soft);
}

/* ============== Empty ============== */
.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: var(--text-dim);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
.empty-text {
  font-size: 14px;
  margin-bottom: 16px;
}
.empty-btn {
  padding: 8px 18px;
  background: var(--accent-faint);
  border: 1px solid var(--border-color);
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 13px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}
.empty-btn:hover {
  background: var(--accent);
  color: var(--text-inverse);
}

/* ============== 响应式 ============== */
@media (max-width: 1024px) {
  .blog-hero-grid { grid-template-columns: 1fr; }
  .title-cn { font-size: 36px; }
  .post-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .blog-hero { padding: 28px 20px 24px; }
  .title-cn { font-size: 30px; }
  .title-en { font-size: 12px; }
  .post-grid { grid-template-columns: 1fr; }
  .filter-bar { padding: 12px 14px; }
}
</style>
