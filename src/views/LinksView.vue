<template>
  <div class="links-view">
    <!-- Hero -->
    <section class="links-hero">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="hero-grid">
        <div class="hero-main">
          <div class="hero-tag font-tech">// FRIENDS // STACK</div>
          <h1 class="hero-title">
            <span class="title-cn">友链堆栈</span>
            <span class="title-en">/ LINKS</span>
          </h1>
          <p class="hero-desc">
            挚友、灵感、技术、生活。<br>
            一共 <span class="text-accent">{{ links.length }}</span> 位，
            分布在 <span class="text-accent">{{ linkGroups.length }}</span> 个堆栈。
          </p>
        </div>

        <div class="hero-aside">
          <div v-for="g in linkGroups" :key="g.id" class="aside-row">
            <span class="row-icon"><Icon :icon="g.icon" /></span>
            <span class="row-name">{{ g.name }}</span>
            <span class="row-count font-tech">{{ countByGroup[g.id] || 0 }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 堆栈 -->
    <section
      v-for="(g, gi) in linkGroups"
      :key="g.id"
      class="link-stack"
      :style="{ animationDelay: (gi * 0.1) + 's' }"
    >
      <header class="stack-head">
        <span class="head-icon"><Icon :icon="g.icon" /></span>
        <div class="head-info">
          <h2 class="head-name">{{ g.name }}</h2>
          <span class="head-en font-tech">// {{ g.nameEn }}</span>
        </div>
        <p class="head-desc">{{ g.desc }}</p>
        <span class="head-count font-tech">{{ countByGroup[g.id] || 0 }} LINKS</span>
      </header>

      <div class="stack-grid">
        <a
          v-for="(l, i) in groupedLinks[g.id]"
          :key="l.url"
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link-card"
          :class="{ featured: l.featured, dead: l.url === '#' }"
          :style="{ animationDelay: (i * 0.05) + 's' }"
        >
          <span v-if="l.featured" class="card-flag font-tech">
            <Icon icon="mdi:star-four-points" /> FEATURED
          </span>

          <div class="card-avatar">
            <img :src="l.avatar" :alt="l.name" loading="lazy" />
          </div>

          <div class="card-body">
            <h3 class="card-name">
              <span>{{ l.name }}</span>
              <span class="card-arrow" v-if="!isDead(l)">↗</span>
              <span class="card-arrow card-arrow-dead" v-else>·</span>
            </h3>
            <p class="card-desc">{{ l.desc }}</p>
            <div v-if="l.tags && l.tags.length" class="card-tags">
              <span v-for="t in l.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>

          <div class="card-fade"></div>
          <span class="card-corner tl"></span>
          <span class="card-corner tr"></span>
          <span class="card-corner bl"></span>
          <span class="card-corner br"></span>
        </a>
      </div>
    </section>

    <!-- 申请友链 -->
    <section class="apply">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="apply-grid">
        <div class="apply-main">
          <div class="apply-tag font-tech">// JOIN // NETWORK</div>
          <h2 class="apply-title">{{ applyInfo.title }}</h2>
          <p class="apply-desc">{{ applyInfo.desc }}</p>
          <ul class="apply-rules">
            <li v-for="(r, i) in applyInfo.bullets" :key="i">
              <span class="rule-bullet">▸</span>
              <span>{{ r }}</span>
            </li>
          </ul>
          <a
            href="mailto:hi@xuwei.dev?subject=友链申请"
            class="apply-cta font-tech"
          >
            <span>{{ applyInfo.ctaLabel }}</span>
            <span class="cta-arrow">→</span>
          </a>
        </div>
        <div class="apply-deco">
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="deco-circle c3"></div>
          <Icon icon="mdi:graph-outline" class="deco-icon" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { linkGroups, links, applyInfo } from '@/data/links'

const groupedLinks = computed(() => {
  const out = {}
  for (const g of linkGroups) out[g.id] = []
  for (const l of links) {
    if (out[l.group]) {
      out[l.group].push(l)
    }
  }
  // featured 置顶
  for (const g of linkGroups) {
    out[g.id].sort((a, b) => (!!b.featured) - (!!a.featured))
  }
  return out
})

const countByGroup = computed(() => {
  const m = {}
  for (const l of links) m[l.group] = (m[l.group] || 0) + 1
  return m
})

function isDead(l) {
  return !l.url || l.url === '#'
}
</script>

<style scoped>
.links-view { position: relative; padding-bottom: 60px; }

/* ============== Hero ============== */
.links-hero {
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

.links-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at bottom right, var(--accent-faint) 0%, transparent 60%);
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
  gap: 0;
  padding: 0;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  border-left: 2px solid var(--accent);
}
.aside-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-faint);
  font-size: 13px;
}
.aside-row:last-child { border-bottom: none; }
.row-icon { font-size: 14px; color: var(--accent); }
.row-name { flex: 1; color: var(--text-primary); letter-spacing: 0.05em; }
.row-count {
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.2em;
}

/* ============== Stack ============== */
.link-stack {
  position: relative;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.6s var(--ease-out-expo) forwards;
}

@keyframes card-in { to { opacity: 1; transform: translateY(0); } }

.stack-head {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px 18px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: var(--bg-overlay);
  border-left: 2px solid var(--accent);
  border-bottom: 1px solid var(--border-faint);
}
.head-icon {
  font-size: 22px;
  color: var(--accent);
  grid-row: 1 / 3;
}
.head-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.head-name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  margin: 0;
}
.head-en {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.head-desc {
  grid-column: 2;
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}
.head-count {
  grid-row: 1 / 3;
  align-self: center;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  padding: 4px 10px;
  border: 1px solid var(--accent);
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* ============== Card ============== */
.link-card {
  position: relative;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 14px;
  padding: 16px 18px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-faint);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.4s var(--ease-out-expo);
  overflow: hidden;
  opacity: 0;
  animation: card-in 0.5s var(--ease-soft) forwards;
}

.link-card:hover {
  border-color: var(--border-color);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--accent-soft);
}

.link-card.featured {
  background: linear-gradient(135deg, var(--accent-faint) 0%, transparent 50%), var(--panel-bg);
  border-color: var(--border-color);
}

.card-flag {
  position: absolute;
  top: 10px;
  right: 10px;
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

.card-avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border: 1px solid var(--border-faint);
  overflow: hidden;
  position: relative;
}
.card-avatar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 60%, var(--accent-faint) 100%);
  pointer-events: none;
}
.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.3) contrast(1.05);
  transition: filter 0.4s, transform 0.4s;
}
.link-card:hover .card-avatar img {
  filter: grayscale(0) contrast(1.1);
  transform: scale(1.05);
}

.card-body { min-width: 0; }

.card-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin: 0 0 4px;
  line-height: 1.3;
}
.link-card:hover .card-name { color: var(--accent); }
.card-arrow {
  font-family: var(--font-tech);
  font-size: 12px;
  color: var(--accent);
  margin-left: auto;
  transition: transform 0.3s;
}
.card-arrow-dead { color: var(--text-dim); }
.link-card:hover .card-arrow { transform: translate(3px, -3px); }

.card-desc {
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tag {
  font-size: 10px;
  color: var(--text-dim);
  padding: 1px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  letter-spacing: 0.05em;
}

.card-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 70%, var(--accent-faint) 100%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.link-card:hover .card-fade { opacity: 1; }

.card-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--accent);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s;
}
.card-corner.tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.card-corner.tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
.card-corner.bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
.card-corner.br { bottom: 6px; right: 6px; border-left: none; border-top: none; }
.link-card:hover .card-corner { opacity: 0.9; }

/* ============== Apply ============== */
.apply {
  position: relative;
  padding: 36px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  margin-top: 12px;
  overflow: hidden;
}

.apply::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at bottom right, var(--accent-faint) 0%, transparent 50%);
  pointer-events: none;
}

.apply-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  align-items: center;
}

.apply-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 12px;
  padding: 3px 8px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
}

.apply-title {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  margin: 0 0 12px;
}

.apply-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 16px;
  max-width: 520px;
}

.apply-rules {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.apply-rules li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
.rule-bullet { color: var(--accent); }

.apply-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--text-inverse);
  background: var(--accent);
  text-decoration: none;
  border: 1px solid var(--accent);
  transition: all 0.3s var(--ease-soft);
  box-shadow: 0 0 16px var(--accent-soft);
}
.apply-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 24px var(--accent-soft);
  color: var(--text-inverse);
}
.cta-arrow {
  font-family: var(--font-tech);
  font-size: 14px;
  transition: transform 0.3s;
}
.apply-cta:hover .cta-arrow { transform: translateX(4px); }

/* ============== Deco ============== */
.apply-deco {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deco-circle {
  position: absolute;
  border: 1px solid var(--accent);
  border-radius: 50%;
  opacity: 0.4;
}
.deco-circle.c1 { width: 200px; height: 200px; animation: spin 16s linear infinite; }
.deco-circle.c2 { width: 140px; height: 140px; animation: spin 12s linear infinite reverse; }
.deco-circle.c3 { width: 80px; height: 80px; border-style: dashed; animation: spin 8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.deco-icon {
  position: relative;
  z-index: 2;
  font-size: 56px;
  color: var(--accent);
  filter: drop-shadow(0 0 12px var(--accent-soft));
}

/* ============== Responsive ============== */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; }
  .title-cn { font-size: 36px; }
  .apply-grid { grid-template-columns: 1fr; }
  .apply-deco { display: none; }
}

@media (max-width: 768px) {
  .links-hero,
  .apply { padding: 28px 20px; }
  .title-cn { font-size: 30px; }
  .title-en { font-size: 12px; }
  .stack-head {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }
  .head-icon { grid-row: 1 / 2; }
  .head-info { grid-column: 2; }
  .head-desc { grid-column: 1 / -1; }
  .head-count { grid-row: 1; grid-column: 2; justify-self: end; }
  .stack-grid { grid-template-columns: 1fr; }
  .link-card { padding: 14px; gap: 12px; }
  .card-avatar { width: 52px; height: 52px; }
  .apply-title { font-size: 22px; }
}
</style>
