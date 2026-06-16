<template>
  <div class="projects-view">
    <!-- Hero / 头部 -->
    <section class="projects-hero">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="hero-grid">
        <div class="hero-main">
          <div class="hero-tag font-tech">// PROJECTS // MATRIX</div>
          <h1 class="hero-title">
            <span class="title-cn">项目矩阵</span>
            <span class="title-en">/ PROJECTS</span>
          </h1>
          <p class="hero-desc">
            写过的、折腾过的、还在维护的——都收在这里。<br>
            共有 <span class="text-accent">{{ stats.total }}</span> 个项目：
            <span class="text-accent">{{ stats.internal }}</span> 个内嵌 +
            <span class="text-accent">{{ stats.external }}</span> 个外链。
          </p>
        </div>

        <div class="hero-aside">
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.total }}</div>
            <div class="stat-label font-tech">TOTAL</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.internal }}</div>
            <div class="stat-label font-tech">INTERNAL</div>
          </div>
          <div class="aside-stat">
            <div class="stat-num font-display">{{ stats.external }}</div>
            <div class="stat-label font-tech">EXTERNAL</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 类型切换 -->
    <section class="filter-bar">
      <span class="filter-label font-tech">// TYPE:</span>
      <button
        v-for="t in typeOptions"
        :key="t.value"
        class="filter-chip"
        :class="{ active: activeType === t.value }"
        @click="activeType = t.value"
      >
        <span class="chip-name">{{ t.label }}</span>
        <span class="chip-count font-tech">{{ t.count }}</span>
      </button>
    </section>

    <!-- 卡片矩阵 -->
    <section class="matrix">
      <article
        v-for="(p, i) in filtered"
        :key="p.slug"
        class="proj-card"
        :class="[`type-${p.type}`, { featured: p.featured }]"
        :style="{ animationDelay: (i * 0.06) + 's' }"
      >
        <div v-if="p.featured" class="card-flag font-tech">
          <Icon icon="mdi:star-four-points" /> FEATURED
        </div>

        <div class="card-cover">
          <img v-if="p.cover" :src="p.cover" :alt="p.title" loading="lazy" />
          <div v-else class="cover-fallback">
            <Icon icon="mdi:cube-outline" />
          </div>
          <div class="cover-fade"></div>
          <span class="cover-corner tl"></span>
          <span class="cover-corner tr"></span>
          <span class="cover-corner bl"></span>
          <span class="cover-corner br"></span>
        </div>

        <div class="card-body">
          <div class="card-top">
            <span class="card-type font-tech" :class="`type-${p.type}`">
              <Icon :icon="typeIcon(p.type)" />
              {{ typeLabel(p.type) }}
            </span>
            <span v-if="p.status" class="card-status font-tech">{{ p.status }}</span>
          </div>

          <h3 class="card-title">{{ p.title }}</h3>
          <p v-if="p.excerpt" class="card-excerpt">{{ p.excerpt }}</p>

          <div v-if="p.tags && p.tags.length" class="card-tags">
            <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
          </div>

          <component
            :is="p.type === 'external' ? 'a' : 'router-link'"
            :href="p.type === 'external' ? p.href : undefined"
            :to="p.type === 'external' ? undefined : p.to"
            :target="p.type === 'external' ? '_blank' : undefined"
            :rel="p.type === 'external' ? 'noopener noreferrer' : undefined"
            class="card-cta font-tech"
          >
            <span>{{ p.type === 'external' ? 'VISIT' : 'READ' }}</span>
            <span class="cta-arrow">{{ p.type === 'external' ? '↗' : '→' }}</span>
          </component>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useProjects } from '@/composables/useProjects'

const { projects, stats } = useProjects()
const activeType = ref('ALL')

const typeOptions = computed(() => [
  { value: 'ALL', label: '全部', count: stats.value.total },
  { value: 'internal', label: '内嵌详情', count: stats.value.internal },
  { value: 'external', label: '外链跳转', count: stats.value.external },
])

const filtered = computed(() => {
  if (activeType.value === 'ALL') return projects.value
  return projects.value.filter((p) => p.type === activeType.value)
})

function typeLabel(t) {
  return t === 'external' ? 'EXTERNAL' : 'INTERNAL'
}
function typeIcon(t) {
  return t === 'external' ? 'mdi:open-in-new' : 'mdi:file-document-outline'
}
</script>

<style scoped>
.projects-view { position: relative; padding-bottom: 60px; }

/* ============== Hero ============== */
.projects-hero {
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

.projects-hero::before {
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
  text-transform: uppercase;
}

.hero-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
  max-width: 560px;
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

/* ============== 筛选 ============== */
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

/* ============== 矩阵 ============== */
.matrix {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.proj-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-faint);
  overflow: hidden;
  transition: all 0.4s var(--ease-out-expo);
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.6s var(--ease-out-expo) forwards;
}

@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}

.proj-card:hover {
  border-color: var(--border-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--accent-soft);
}

.proj-card.featured {
  border-color: var(--border-color);
}
.proj-card.featured::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--accent-faint) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.card-flag {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-inverse);
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-soft);
}

/* cover */
.card-cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-deep);
}
.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.4) contrast(1.05);
  transition: transform 0.6s var(--ease-out-expo), filter 0.4s;
}
.proj-card:hover .card-cover img {
  transform: scale(1.06);
  filter: grayscale(0) contrast(1.1);
}
.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: var(--text-dim);
  background: linear-gradient(135deg, var(--bg-deep), var(--bg-overlay));
}
.cover-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
}
.cover-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--accent);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s;
}
.cover-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.cover-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.cover-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.cover-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; }
.proj-card:hover .cover-corner { opacity: 0.9; }

/* body */
.card-body {
  position: relative;
  z-index: 1;
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.card-type {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  letter-spacing: 0.25em;
  padding: 3px 8px;
  border: 1px solid var(--border-faint);
  text-transform: uppercase;
}
.card-type.type-external {
  color: var(--text-secondary);
  background: var(--bg-overlay);
}
.card-type.type-internal {
  color: var(--accent);
  background: var(--accent-faint);
  border-color: var(--accent-faint);
}

.card-status {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  padding: 2px 8px;
  border: 1px solid var(--border-faint);
}

.card-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin: 0;
  line-height: 1.3;
  transition: color 0.3s;
}
.proj-card:hover .card-title { color: var(--accent); }

.card-excerpt {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.tag {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.05em;
  padding: 2px 8px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
}

.card-cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-faint);
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.3s;
}
.cta-arrow {
  font-family: var(--font-tech);
  font-size: 14px;
  transition: transform 0.3s var(--ease-soft);
}
.card-cta:hover .cta-arrow { transform: translateX(4px); }

/* ============== 响应式 ============== */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; }
  .title-cn { font-size: 36px; }
  .matrix { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .projects-hero { padding: 28px 20px 24px; }
  .title-cn { font-size: 30px; }
  .title-en { font-size: 12px; }
  .matrix { grid-template-columns: 1fr; }
  .filter-bar { padding: 12px 14px; }
}
</style>
