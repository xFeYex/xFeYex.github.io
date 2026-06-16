<template>
  <div class="about-view">
    <!-- 顶部 HUD 标签 -->
    <div class="about-strip">
      <span class="strip-tag font-tech">// ABOUT // DASHBOARD</span>
      <span class="strip-tag font-tech">UTC {{ identity.timezone }}</span>
      <span class="strip-tag font-tech">{{ now }}</span>
    </div>

    <!-- 岛 1: 身份卡（横跨大） -->
    <section class="island island-id">
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <div class="id-grid">
        <div class="id-avatar">
          <img :src="profile.avatar" :alt="profile.name" />
          <div class="avatar-status">
            <span class="status-dot"></span>
            <span class="font-tech">ONLINE</span>
          </div>
        </div>

        <div class="id-main">
          <div class="id-handle font-tech">{{ identity.handle }} · {{ identity.pronouns }}</div>
          <h1 class="id-name">
            <span class="name-cn">{{ identity.name }}</span>
            <span class="name-en font-display">/ {{ identity.nameEn }}</span>
          </h1>
          <div class="id-title font-tech">{{ profile.title }}</div>
          <p class="id-bio">{{ profile.bio }}</p>
          <div class="id-chips">
            <span class="chip"><Icon icon="mdi:map-marker-outline" /> {{ identity.location }}</span>
            <span class="chip"><Icon icon="mdi:earth" /> {{ identity.languages.join(' / ') }}</span>
            <span class="chip"><Icon icon="mdi:clock-outline" /> {{ identity.timezone }}</span>
          </div>
        </div>

        <div class="id-stats">
          <div v-for="s in profile.stats" :key="s.labelEn" class="id-stat">
            <div class="stat-num font-display">{{ s.value }}</div>
            <div class="stat-label font-tech">{{ s.labelEn }}</div>
            <div class="stat-suffix">{{ s.suffix }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 岛 2: 简介 (bio long) -->
    <section class="island island-bio">
      <div class="island-head">
        <span class="head-tag font-tech">// 01 // BIO</span>
        <span class="head-icon"><Icon icon="mdi:account-circle-outline" /></span>
      </div>
      <div class="bio-text" v-html="bioHtml"></div>
      <div class="bio-philosophy">
        <Icon icon="mdi:format-quote-close" class="quote-icon" />
        <p>{{ bio.philosophy }}</p>
      </div>
    </section>

    <!-- 岛 3: 经历 (timeline) -->
    <section class="island island-journey">
      <div class="island-head">
        <span class="head-tag font-tech">// 02 // JOURNEY</span>
        <span class="head-icon"><Icon icon="mdi:map-marker-path" /></span>
      </div>
      <ol class="journey-list">
        <li
          v-for="(j, i) in journey"
          :key="i"
          class="journey-item"
          :class="{ current: j.current }"
          :style="{ animationDelay: (i * 0.1) + 's' }"
        >
          <div class="ji-rail">
            <span class="ji-dot"></span>
            <span v-if="i < journey.length - 1" class="ji-line"></span>
          </div>
          <div class="ji-body">
            <div class="ji-period font-tech">{{ j.period }}</div>
            <div class="ji-role">
              <span class="ji-role-name">{{ j.role }}</span>
              <span v-if="j.current" class="ji-current font-tech">CURRENT</span>
            </div>
            <div class="ji-org font-tech">{{ j.org }}</div>
            <p class="ji-desc">{{ j.desc }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- 岛 4: 技能 (grouped bars) -->
    <section class="island island-skills">
      <div class="island-head">
        <span class="head-tag font-tech">// 03 // SKILLS</span>
        <span class="head-icon"><Icon icon="mdi:tools" /></span>
      </div>
      <div class="skill-groups">
        <div
          v-for="(g, gi) in skills"
          :key="g.group"
          class="skill-group"
          :style="{ animationDelay: (gi * 0.1) + 's' }"
        >
          <div class="group-head">
            <span class="group-icon"><Icon :icon="g.icon" /></span>
            <span class="group-name">{{ g.group }}</span>
          </div>
          <ul class="skill-list">
            <li
              v-for="(s, si) in g.items"
              :key="s.name"
              class="skill-item"
              :style="{ animationDelay: (si * 0.06) + 's' }"
            >
              <div class="skill-meta">
                <span class="skill-name">{{ s.name }}</span>
                <span class="skill-level font-tech">{{ s.level }}%</span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-fill"
                  :style="{ width: s.level + '%' }"
                ></div>
              </div>
              <div class="skill-note">{{ s.note }}</div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 岛 5: 兴趣 -->
    <section class="island island-interests">
      <div class="island-head">
        <span class="head-tag font-tech">// 04 // INTERESTS</span>
        <span class="head-icon"><Icon icon="mdi:heart-outline" /></span>
      </div>
      <div class="interest-grid">
        <div
          v-for="(it, i) in interests"
          :key="it.name"
          class="interest-tile"
          :style="{ animationDelay: (i * 0.05) + 's' }"
        >
          <span class="tile-icon"><Icon :icon="it.icon" /></span>
          <div class="tile-name">{{ it.name }}</div>
          <div class="tile-desc">{{ it.desc }}</div>
        </div>
      </div>
    </section>

    <!-- 岛 6: 技术栈 chips -->
    <section class="island island-stack">
      <div class="island-head">
        <span class="head-tag font-tech">// 05 // STACK</span>
        <span class="head-icon"><Icon icon="mdi:chip" /></span>
      </div>
      <div class="stack-list">
        <div
          v-for="(s, i) in stacks"
          :key="s.name"
          class="stack-chip"
          :style="{ '--chip-color': s.color, animationDelay: (i * 0.04) + 's' }"
        >
          <span class="stack-dot"></span>
          <span class="stack-name">{{ s.name }}</span>
        </div>
      </div>
    </section>

    <!-- 岛 7: 社交入口 -->
    <section class="island island-social">
      <div class="island-head">
        <span class="head-tag font-tech">// 06 // CHANNELS</span>
        <span class="head-icon"><Icon icon="mdi:radio-tower" /></span>
      </div>
      <div class="social-grid">
        <a
          v-for="s in profile.socials"
          :key="s.id"
          :href="s.url"
          :target="s.url.startsWith('http') ? '_blank' : undefined"
          :rel="s.url.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="social-link"
        >
          <span class="social-icon"><Icon :icon="s.icon" /></span>
          <span class="social-name">{{ s.name }}</span>
          <span class="social-arrow">↗</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { profile } from '@/data/profile'
import { identity, bio, journey, skills, interests, stacks } from '@/data/about'
import { useMarkdown } from '@/composables/useMarkdown'

const { render } = useMarkdown()
const bioHtml = computed(() => render(bio.long).html)

const now = ref('')
let timer = null
function tick() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  now.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.about-view {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: 16px;
  padding-bottom: 60px;
}

/* ============== 顶部条 ============== */
.about-strip {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
}
.strip-tag {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
}
.strip-tag + .strip-tag { color: var(--text-dim); }

/* ============== 岛 通用 ============== */
.island {
  position: relative;
  padding: 22px 24px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-faint);
  transition: border-color 0.3s;
  overflow: hidden;
}
.island:hover { border-color: var(--border-color); }

.hud-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--accent);
  opacity: 0.7;
}
.hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

.island-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-faint);
}
.head-tag {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
}
.head-icon {
  margin-left: auto;
  font-size: 16px;
  color: var(--text-dim);
}

/* ============== 岛 1: 身份 ============== */
.island-id {
  grid-column: 1 / -1;
  position: relative;
  padding: 32px 32px;
}
.island-id::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--accent-faint) 0%, transparent 60%);
  pointer-events: none;
}

.id-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 32px;
  align-items: center;
}

.id-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}
.id-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid var(--accent);
  box-shadow: 0 0 24px var(--accent-soft);
}
.avatar-status {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  font-size: 9px;
  letter-spacing: 0.25em;
  color: #7ed87e;
  white-space: nowrap;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #7ed87e;
  border-radius: 50%;
  box-shadow: 0 0 6px #7ed87e;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.id-handle {
  font-size: 11px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.id-name {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0 0 4px;
  line-height: 1.1;
}
.name-cn {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.15em;
}
.name-en {
  font-size: 16px;
  color: var(--accent);
  letter-spacing: 0.3em;
}

.id-title {
  font-size: 12px;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-bottom: 14px;
  text-transform: uppercase;
}

.id-bio {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 14px;
  max-width: 640px;
}

.id-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  font-size: 11px;
  color: var(--text-secondary);
}

.id-stats {
  display: flex;
  gap: 18px;
  padding-left: 24px;
  border-left: 1px solid var(--border-faint);
}
.id-stat {
  text-align: center;
  min-width: 60px;
}
.stat-num {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}
.stat-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin: 4px 0 2px;
}
.stat-suffix {
  font-size: 10px;
  color: var(--text-secondary);
}

/* ============== 岛 2: Bio ============== */
.island-bio { grid-column: span 3; }

.bio-text {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-secondary);
}
.bio-text :deep(p) { margin: 0 0 0.6em; }

.bio-philosophy {
  position: relative;
  margin-top: 18px;
  padding: 14px 16px 14px 40px;
  background: var(--accent-faint);
  border-left: 2px solid var(--accent);
}
.quote-icon {
  position: absolute;
  top: 12px;
  left: 14px;
  font-size: 20px;
  color: var(--accent);
}
.bio-philosophy p {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.7;
  font-style: italic;
}

/* ============== 岛 3: Journey ============== */
.island-journey { grid-column: span 3; }

.journey-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.journey-item {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 14px;
  padding-bottom: 18px;
  opacity: 0;
  transform: translateY(10px);
  animation: card-in 0.5s var(--ease-soft) forwards;
}
.journey-item:last-child { padding-bottom: 0; }
@keyframes card-in { to { opacity: 1; transform: translateY(0); } }

.ji-rail {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 4px;
}
.ji-dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border: 2px solid var(--bg-deep);
  box-shadow: 0 0 0 1px var(--accent), 0 0 10px var(--accent-soft);
  flex-shrink: 0;
}
.ji-line {
  position: absolute;
  top: 14px;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background: var(--border-faint);
}
.ji-line { background: linear-gradient(180deg, var(--border-color), transparent); }

.ji-period {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  margin-bottom: 4px;
  text-transform: uppercase;
}
.ji-role {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 2px;
}
.ji-role-name {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}
.ji-current {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--text-inverse);
  background: var(--accent);
  padding: 1px 5px;
}
.ji-org {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.ji-desc {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

/* ============== 岛 4: Skills ============== */
.island-skills { grid-column: 1 / -1; }

.skill-groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.skill-group {
  opacity: 0;
  transform: translateY(10px);
  animation: card-in 0.5s var(--ease-soft) forwards;
}
.group-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-faint);
}
.group-icon {
  font-size: 14px;
  color: var(--accent);
}
.group-name {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.1em;
}

.skill-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skill-item {
  opacity: 0;
  animation: card-in 0.4s var(--ease-soft) forwards;
}
.skill-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.skill-name {
  font-size: 13px;
  color: var(--text-primary);
}
.skill-level {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--accent);
}
.skill-bar {
  height: 4px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  overflow: hidden;
  position: relative;
}
.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-soft));
  position: relative;
  transition: width 0.8s var(--ease-out-expo);
}
.skill-fill::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  filter: blur(2px);
}
.skill-note {
  font-size: 10px;
  color: var(--text-dim);
  margin-top: 3px;
  letter-spacing: 0.05em;
}

/* ============== 岛 5: Interests ============== */
.island-interests { grid-column: span 2; }

.interest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.interest-tile {
  position: relative;
  padding: 14px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  text-align: center;
  transition: all 0.3s var(--ease-soft);
  opacity: 0;
  animation: card-in 0.4s var(--ease-soft) forwards;
}
.interest-tile:hover {
  border-color: var(--accent);
  background: var(--accent-faint);
  transform: translateY(-2px);
}
.tile-icon {
  display: inline-block;
  font-size: 22px;
  color: var(--accent);
  margin-bottom: 6px;
}
.tile-name {
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}
.tile-desc {
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.05em;
}

/* ============== 岛 6: Stack ============== */
.island-stack { grid-column: span 2; }

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stack-chip {
  --chip-color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  font-size: 12px;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  opacity: 0;
  animation: card-in 0.4s var(--ease-soft) forwards;
  transition: all 0.3s;
}
.stack-chip:hover {
  border-color: var(--chip-color);
  background: color-mix(in srgb, var(--chip-color) 12%, transparent);
  color: var(--chip-color);
}
.stack-dot {
  width: 6px;
  height: 6px;
  background: var(--chip-color);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--chip-color);
}

/* ============== 岛 7: Social ============== */
.island-social { grid-column: span 2; }

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 0.05em;
  transition: all 0.3s var(--ease-soft);
}
.social-link:hover {
  border-color: var(--accent);
  background: var(--accent-faint);
  transform: translateX(2px);
}
.social-icon {
  font-size: 16px;
  color: var(--accent);
}
.social-name { flex: 1; }
.social-arrow {
  font-family: var(--font-tech);
  font-size: 12px;
  color: var(--text-dim);
  transition: transform 0.3s, color 0.3s;
}
.social-link:hover .social-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

/* ============== Responsive ============== */
@media (max-width: 1024px) {
  .about-view { grid-template-columns: repeat(2, 1fr); }
  .island-bio,
  .island-journey,
  .island-interests,
  .island-stack,
  .island-social { grid-column: 1 / -1; }
  .id-grid { grid-template-columns: auto 1fr; }
  .id-stats {
    grid-column: 1 / -1;
    padding-left: 0;
    padding-top: 20px;
    border-left: none;
    border-top: 1px solid var(--border-faint);
    justify-content: space-around;
  }
  .skill-groups { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .island { padding: 18px 16px; }
  .island-id { padding: 24px 18px; }
  .id-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .id-avatar { margin: 0 auto; }
  .id-stats { gap: 12px; }
  .name-cn { font-size: 32px; }
  .social-grid { grid-template-columns: 1fr; }
  .interest-grid { grid-template-columns: 1fr; }
}
</style>
