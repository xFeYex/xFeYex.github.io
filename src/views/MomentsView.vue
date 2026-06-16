<template>
  <div class="moments-view">
    <!-- Hero -->
    <section class="moments-hero">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="hero-grid">
        <div class="hero-main">
          <div class="hero-tag font-tech">// MOMENTS // FEED</div>
          <h1 class="hero-title">
            <span class="title-cn">短频快记</span>
            <span class="title-en">/ MOMENTS</span>
          </h1>
          <p class="hero-desc">
            想到什么写两句。<br>
            读 / 玩 / 听 / 写，<br>
            一切琐碎都在这。<br>
            全部 <span class="text-accent">{{ stats.total }}</span> 条，
            本月新发 <span class="text-accent">{{ stats.thisMonth }}</span> 条。
          </p>
        </div>

        <div class="hero-aside">
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.total }}</div>
            <div class="stat-label font-tech">TOTAL</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.thisMonth }}</div>
            <div class="stat-label font-tech">THIS MONTH</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.thisYear }}</div>
            <div class="stat-label font-tech">THIS YEAR</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片流 -->
    <section v-if="moments.length" class="moments-stream">
      <article
        v-for="(m, i) in moments"
        :key="m.id"
        class="moment-card"
        :style="{ animationDelay: (i * 0.05) + 's' }"
      >
        <!-- 左侧时间轴 -->
        <div class="moment-rail">
          <div class="rail-date font-tech">{{ formatDate(m.date) }}</div>
          <div class="rail-dot"></div>
          <div class="rail-line"></div>
        </div>

        <!-- 右侧卡片 -->
        <div class="moment-body">
          <div class="moment-head">
            <span class="mood" aria-hidden="true">{{ m.mood }}</span>
            <span class="moment-icon" aria-hidden="true">
              <Icon :icon="m.icon" />
            </span>
            <span class="moment-time font-tech">{{ relativeTime(m.date) }}</span>
          </div>

          <div class="moment-content" v-html="renderMd(m.content)"></div>

          <div class="moment-foot">
            <span class="foot-tag font-tech">// MOMENT</span>
          </div>
        </div>
      </article>
    </section>

    <!-- 空 -->
    <section v-else class="empty">
      <div class="empty-icon"><Icon icon="mdi:ghost-outline" /></div>
      <p class="empty-text">没有动态，先去忙别的吧。</p>
    </section>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useMoments } from '@/composables/useMoments'
import { useMarkdown } from '@/composables/useMarkdown'

const { moments, stats } = useMoments()
const { render } = useMarkdown()

function renderMd(raw) {
  return render(raw).html
}

function formatDate(s) {
  const d = new Date(s)
  if (isNaN(d)) return s
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function relativeTime(s) {
  const d = new Date(s)
  if (isNaN(d)) return ''
  const diff = Date.now() - d.getTime()
  const day = 86400000
  if (diff < day) return '今天'
  if (diff < day * 2) return '昨天'
  if (diff < day * 7) return `${Math.floor(diff / day)} 天前`
  if (diff < day * 30) return `${Math.floor(diff / (day * 7))} 周前`
  if (diff < day * 365) return `${Math.floor(diff / (day * 30))} 月前`
  return `${Math.floor(diff / (day * 365))} 年前`
}
</script>

<style scoped>
.moments-view { position: relative; padding-bottom: 60px; }

/* ============== Hero ============== */
.moments-hero {
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

.moments-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--accent-faint) 0%, transparent 60%);
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

/* ============== Stream ============== */
.moments-stream {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.moment-card {
  position: relative;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.6s var(--ease-out-expo) forwards;
}

@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}

/* 左侧 rail */
.moment-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
}
.rail-date {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.rail-dot {
  position: relative;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 2px solid var(--bg-deep);
  box-shadow: 0 0 0 1px var(--accent), 0 0 12px var(--accent-soft);
  z-index: 2;
}
.rail-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(180deg, var(--border-color) 0%, transparent 100%);
  margin-top: 8px;
}
.moment-card:last-child .rail-line { display: none; }

/* 右侧 body */
.moment-body {
  position: relative;
  padding: 18px 22px 18px 24px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-faint);
  border-left: 2px solid var(--accent);
  transition: all 0.4s var(--ease-soft);
}
.moment-body::before {
  content: "";
  position: absolute;
  top: 22px;
  left: -7px;
  width: 12px;
  height: 12px;
  background: var(--bg-deep);
  border-left: 1px solid var(--accent);
  border-bottom: 1px solid var(--accent);
  transform: rotate(45deg);
}
.moment-body:hover {
  border-color: var(--border-color);
  box-shadow: 0 0 24px var(--accent-soft);
}

.moment-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.mood {
  font-size: 18px;
  color: var(--accent);
  line-height: 1;
}
.moment-icon {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  color: var(--text-dim);
}
.moment-time {
  margin-left: auto;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.moment-content {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.85;
  color: var(--text-primary);
}
.moment-content :deep(p) { margin: 0 0 0.8em; }
.moment-content :deep(p:last-child) { margin-bottom: 0; }
.moment-content :deep(strong) { color: var(--accent); font-weight: 600; }
.moment-content :deep(em) { color: var(--text-secondary); font-style: italic; }
.moment-content :deep(blockquote) {
  margin: 0.6em 0;
  padding: 6px 0 6px 12px;
  border-left: 2px solid var(--accent);
  color: var(--text-secondary);
  font-style: italic;
}
.moment-content :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 0.88em;
  padding: 1px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--accent);
}

.moment-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--border-faint);
}
.foot-tag {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
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
  .moments-hero { padding: 28px 20px 24px; }
  .title-cn { font-size: 30px; }
  .title-en { font-size: 12px; }
  .moment-card { grid-template-columns: 60px 1fr; gap: 12px; }
  .rail-date { font-size: 8px; letter-spacing: 0.1em; }
  .moment-body { padding: 14px 16px; }
  .moment-content { font-size: 14px; }
}
</style>
