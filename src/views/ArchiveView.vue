<template>
  <div class="archive-view">
    <!-- Hero -->
    <section class="archive-hero">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="hero-grid">
        <div class="hero-main">
          <div class="hero-tag font-tech">// ARCHIVE // TIMELINE</div>
          <h1 class="hero-title">
            <span class="title-cn">时间档案</span>
            <span class="title-en">/ ARCHIVE</span>
          </h1>
          <p class="hero-desc">
            所有文章按年 / 月折叠。<br>
            共 <span class="text-accent">{{ stats.total }}</span> 篇，
            最早写于 <span class="text-accent">{{ stats.firstYear }}</span>。<br>
            到现在，<span class="text-accent">{{ stats.days }}</span> 天。
          </p>
        </div>

        <div class="hero-aside">
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.total }}</div>
            <div class="stat-label font-tech">POSTS</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.years }}</div>
            <div class="stat-label font-tech">YEARS</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.tags }}</div>
            <div class="stat-label font-tech">TAGS</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 树 -->
    <section v-if="tree.length" class="archive-tree">
      <div
        v-for="(year, yi) in tree"
        :key="year.year"
        class="year-block"
        :style="{ animationDelay: (yi * 0.1) + 's' }"
      >
        <button
          class="year-head"
          :class="{ open: openYears[year.year] }"
          @click="toggleYear(year.year)"
        >
          <span class="year-arrow font-tech">{{ openYears[year.year] ? '▾' : '▸' }}</span>
          <span class="year-num font-display">{{ year.year }}</span>
          <span class="year-count font-tech">{{ year.count }} POSTS</span>
          <span class="year-bar">
            <span
              v-for="m in 12"
              :key="m"
              class="bar-cell"
              :class="{ active: monthActive(year, m) }"
            ></span>
          </span>
        </button>

        <transition name="collapse">
          <div v-show="openYears[year.year]" class="year-content">
            <div
              v-for="(m, mi) in year.months"
              :key="m.month"
              class="month-block"
              :style="{ animationDelay: (mi * 0.05) + 's' }"
            >
              <div class="month-head">
                <span class="month-arrow font-tech">▸</span>
                <span class="month-name font-display">{{ m.month }}月</span>
                <span class="month-count font-tech">{{ m.posts.length }}</span>
              </div>
              <ul class="post-list">
                <li
                  v-for="p in m.posts"
                  :key="p.slug"
                  class="post-row"
                >
                  <span class="row-dot"></span>
                  <span class="row-day font-tech">{{ formatDay(p.date) }}</span>
                  <router-link :to="p.to" class="row-title">{{ p.title }}</router-link>
                  <span v-if="p.pinned" class="row-flag font-tech">PIN</span>
                  <span v-if="p.tags && p.tags.length" class="row-tags">
                    <span v-for="t in p.tags.slice(0, 2)" :key="t" class="row-tag">{{ t }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- 空 -->
    <section v-else class="empty">
      <div class="empty-icon"><Icon icon="mdi:archive-outline" /></div>
      <p class="empty-text">还没有文章。</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { usePosts } from '@/composables/usePosts'

const { posts, tags } = usePosts()

// 默认全部折叠；只展开最新一年
const openYears = reactive({})

const tree = computed(() => {
  const byYear = new Map()
  for (const p of posts.value) {
    const d = new Date(p.date)
    if (isNaN(d)) continue
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    if (!byYear.has(y)) byYear.set(y, new Map())
    const ym = byYear.get(y)
    if (!ym.has(m)) ym.set(m, [])
    ym.get(m).push(p)
  }
  const arr = []
  for (const [year, mMap] of byYear.entries()) {
    const months = []
    for (const [month, ps] of mMap.entries()) {
      months.push({
        month: String(month).padStart(2, '0'),
        posts: ps.sort((a, b) => new Date(b.date) - new Date(a.date)),
      })
    }
    arr.push({
      year,
      count: months.reduce((s, x) => s + x.posts.length, 0),
      months: months.sort((a, b) => Number(b.month) - Number(a.month)),
    })
  }
  return arr.sort((a, b) => b.year - a.year)
})

// 默认展开最新一年
const firstOpen = computed(() => tree.value[0]?.year)
function ensureOpen() {
  if (firstOpen.value && openYears[firstOpen.value] === undefined) {
    openYears[firstOpen.value] = true
  }
}
ensureOpen()

function toggleYear(y) {
  openYears[y] = !openYears[y]
}

function monthActive(yearBlock, m) {
  return yearBlock.months.some((x) => Number(x.month) === m)
}

function formatDay(s) {
  const d = new Date(s)
  if (isNaN(d)) return ''
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const stats = computed(() => {
  const firstYear = tree.value.length ? tree.value[tree.value.length - 1].year : new Date().getFullYear()
  return {
    total: posts.value.length,
    years: tree.value.length,
    tags: tags.value.length,
    firstYear,
    days: Math.max(0, Math.floor((Date.now() - new Date(`${firstYear}-01-01`).getTime()) / 86400000)),
  }
})
</script>

<style scoped>
.archive-view { position: relative; padding-bottom: 60px; }

/* ============== Hero ============== */
.archive-hero {
  position: relative;
  padding: 40px 36px 32px;
  margin-bottom: 36px;
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

.archive-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, var(--accent-faint) 0%, transparent 60%);
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 40px;
  align-items: center;
}

.hero-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 16px;
  padding: 4px 10px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
}

.hero-title {
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
}

.hero-desc {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-secondary);
  margin: 0;
  max-width: 480px;
}
.text-accent { color: var(--accent); }

.hero-aside {
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
.stat-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
}

/* ============== 树 ============== */
.archive-tree {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.year-block {
  position: relative;
  background: var(--panel-bg);
  border: 1px solid var(--border-faint);
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.6s var(--ease-out-expo) forwards;
}

@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}

.year-head {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: var(--text-primary);
  transition: background 0.3s;
  text-align: left;
}
.year-head:hover { background: var(--accent-faint); }

.year-arrow {
  font-size: 14px;
  color: var(--accent);
  width: 16px;
  text-align: center;
  transition: transform 0.3s var(--ease-soft);
}
.year-head.open .year-arrow { transform: rotate(0deg); }

.year-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.1em;
}

.year-count {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.year-bar {
  margin-left: auto;
  display: flex;
  gap: 3px;
}
.bar-cell {
  width: 6px;
  height: 14px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  transition: background 0.3s;
}
.bar-cell.active {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent-soft);
}

.year-content {
  border-top: 1px solid var(--border-faint);
  padding: 8px 24px 16px;
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.5s var(--ease-soft), opacity 0.3s;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to { max-height: 0; opacity: 0; }
.collapse-enter-to,
.collapse-leave-from { max-height: 3000px; opacity: 1; }

/* 月份块 */
.month-block {
  position: relative;
  padding: 14px 0 14px 28px;
  border-left: 1px solid var(--border-faint);
  margin-left: 4px;
  opacity: 0;
  animation: card-in 0.5s var(--ease-soft) forwards;
}
.month-block::before {
  content: "";
  position: absolute;
  left: -3px;
  top: 22px;
  width: 6px;
  height: 6px;
  background: var(--accent);
  border: 1px solid var(--bg-deep);
  transform: rotate(45deg);
  box-shadow: 0 0 8px var(--accent-soft);
}

.month-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}
.month-arrow {
  color: var(--text-dim);
  font-size: 10px;
}
.month-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.1em;
}
.month-count {
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  padding: 1px 6px;
  border: 1px solid var(--border-faint);
}

.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.post-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 16px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  transition: all 0.3s var(--ease-soft);
}
.post-row:hover {
  border-color: var(--accent);
  background: var(--accent-faint);
  transform: translateX(4px);
}

.row-dot {
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  flex-shrink: 0;
}

.row-day {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  flex-shrink: 0;
  min-width: 36px;
}

.row-title {
  font-family: var(--font-serif);
  font-size: 14px;
  color: var(--text-primary);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s;
}
.post-row:hover .row-title { color: var(--accent); }

.row-flag {
  font-size: 8px;
  letter-spacing: 0.25em;
  color: var(--text-inverse);
  background: var(--accent);
  padding: 1px 5px;
  flex-shrink: 0;
}

.row-tags {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.row-tag {
  font-size: 10px;
  color: var(--text-dim);
  padding: 1px 6px;
  border: 1px solid var(--border-faint);
  letter-spacing: 0.05em;
}

/* ============== Empty ============== */
.empty {
  text-align: center;
  padding: 80px 20px;
  background: var(--panel-bg);
  border: 1px solid var(--border-faint);
}
.empty-icon { font-size: 48px; color: var(--text-dim); margin-bottom: 12px; }
.empty-text { color: var(--text-secondary); }

/* ============== Responsive ============== */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; }
  .title-cn { font-size: 36px; }
}

@media (max-width: 768px) {
  .archive-hero { padding: 28px 20px 24px; }
  .title-cn { font-size: 30px; }
  .title-en { font-size: 12px; }
  .year-head { padding: 12px 16px; gap: 10px; flex-wrap: wrap; }
  .year-num { font-size: 22px; }
  .year-bar { margin-left: 0; }
  .year-content { padding: 4px 14px 12px; }
  .post-row { gap: 8px; padding: 6px 10px 6px 12px; }
  .row-title { font-size: 13px; }
  .row-tags { display: none; }
}
</style>
