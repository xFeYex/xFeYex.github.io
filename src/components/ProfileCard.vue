<template>
  <div class="profile-card" :class="{ 'is-loading': !imgLoaded }">
    <span class="hud-corner tl"></span>
    <span class="hud-corner tr"></span>
    <span class="hud-corner bl"></span>
    <span class="hud-corner br"></span>

    <div class="card-id font-tech">// PROFILE // ID: 0001</div>

    <!-- 头部：头像 + 名字 -->
    <div class="profile-head">
      <div class="avatar-wrap">
        <span class="avatar-frame"></span>
        <span class="avatar-frame inner"></span>
        <img v-if="data.avatar" :src="data.avatar" :alt="data.name" class="avatar-img"
          @load="imgLoaded = true" @error="imgLoaded = false" />
        <span v-else class="avatar-fallback">{{ data.avatarFallback }}</span>
        <span class="avatar-status"></span>
      </div>

      <div class="head-info">
        <div class="name-line">
          <h2 class="name">{{ data.name }}</h2>
          <span class="handle font-tech">{{ data.handle }}</span>
        </div>
        <div class="title-line">
          <span class="title-cn">{{ data.titleCn }}</span>
          <span class="divider">·</span>
          <span class="title-en font-tech">{{ data.title }}</span>
        </div>
        <p class="bio">{{ data.bio }}</p>
      </div>
    </div>

    <!-- 统计条 -->
    <div class="stats-strip">
      <div v-for="(s, i) in data.stats" :key="i" class="stat-cell">
        <div class="stat-value">
          <span class="num font-display">{{ s.value }}</span>
          <span class="suffix">{{ s.suffix }}</span>
        </div>
        <div class="stat-label font-tech">
          <span class="label-cn">{{ s.label }}</span>
          <span class="label-en">/ {{ s.labelEn }}</span>
        </div>
      </div>
    </div>

    <!-- 社交入口 -->
    <div class="social-strip">
      <a
        v-for="s in data.socials"
        :key="s.id"
        :href="s.url"
        class="social-link"
        :title="s.name"
        :aria-label="s.name"
      >
        <Icon :icon="s.icon" class="social-icon" />
      </a>
    </div>

    <!-- 按钮 -->
    <div class="actions">
      <router-link
        v-for="(b, i) in data.buttons"
        :key="i"
        :to="b.to"
        class="btn"
        :class="`btn-${b.variant}`"
      >
        <span>{{ b.label }}</span>
        <span class="btn-arrow">→</span>
      </router-link>
    </div>

    <!-- 装饰性进度条 -->
    <div class="card-progress">
      <span class="progress-bar"></span>
      <span class="progress-text font-tech">// 探索者档案 / 100%</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { profile as data } from '@/data/profile.js'

const imgLoaded = ref(false)
</script>

<style scoped>
.profile-card {
  position: relative;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  padding: 28px 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.hud-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px solid var(--accent);
  opacity: 0.7;
  pointer-events: none;
}
.hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

.card-id {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--accent);
  padding: 2px 10px;
  background: var(--bg-deep);
  border: 1px solid var(--border-faint);
}

/* 头部 */
.profile-head {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.avatar-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
}
.avatar-frame {
  position: absolute;
  inset: -6px;
  border: 1px solid var(--border-color);
  pointer-events: none;
}
.avatar-frame.inner {
  inset: -2px;
  border-color: var(--accent-soft);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  filter: grayscale(0.2) contrast(1.05);
  transition: filter 0.4s, transform 0.6s var(--ease-out-expo);
  background: var(--bg-deep);
}
.profile-card:hover .avatar-img { filter: grayscale(0) contrast(1.1); transform: scale(1.05); }

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 36px;
  color: var(--accent);
  background: var(--bg-deep);
}
.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 2px solid var(--bg-deep);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

.head-info { flex: 1; min-width: 0; padding-top: 2px; }

.name-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.name {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  line-height: 1.1;
}
.handle {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.15em;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 12px;
  flex-wrap: wrap;
}
.title-cn {
  color: var(--text-secondary);
  letter-spacing: 0.2em;
}
.title-line .divider { color: var(--text-dim); }
.title-en {
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 0.25em;
}

.bio {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

/* 统计条 */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 14px 0;
  border-top: 1px solid var(--border-faint);
  border-bottom: 1px solid var(--border-faint);
  position: relative;
}
.stats-strip::before,
.stats-strip::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 1px;
  height: 6px;
  background: var(--border-color);
  transform: translateX(-50%);
}
.stats-strip::before { top: -3px; }
.stats-strip::after { bottom: -3px; }

.stat-cell { text-align: center; }
.stat-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-bottom: 4px;
}
.stat-value .num {
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.05em;
  line-height: 1;
}
.stat-value .suffix {
  font-size: 10px;
  color: var(--text-dim);
  font-family: var(--font-tech);
}
.stat-label {
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.stat-label .label-en { color: var(--text-dim); margin-left: 4px; opacity: 0.6; }

/* 社交 */
.social-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
.social-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  transition: all 0.3s var(--ease-soft);
  overflow: hidden;
}
.social-link::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, var(--accent-soft), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s;
}
.social-link:hover::before { transform: translateX(100%); }
.social-link:hover {
  color: var(--accent);
  border-color: var(--border-color);
  background: var(--accent-faint);
  transform: translateY(-1px);
  box-shadow: 0 0 12px var(--accent-soft);
}
.social-icon { font-size: 18px; }

/* 按钮 */
.actions { display: flex; gap: 10px; }
.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.15em;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s var(--ease-soft);
  position: relative;
  overflow: hidden;
}
.btn-arrow {
  font-family: var(--font-tech);
  font-size: 14px;
  transition: transform 0.3s var(--ease-soft);
}
.btn:hover .btn-arrow { transform: translateX(3px); }

.btn-primary {
  background: var(--accent-soft);
  color: var(--accent);
}
.btn-primary:hover {
  background: var(--accent);
  color: var(--text-inverse);
  box-shadow: 0 0 24px var(--accent-soft);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-faint);
}
.btn-ghost:hover {
  border-color: var(--border-color);
  color: var(--accent);
  background: var(--accent-faint);
}

/* 装饰进度条 */
.card-progress {
  position: relative;
  height: 1px;
  background: var(--border-faint);
  margin-top: 4px;
}
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}
.progress-text {
  position: absolute;
  bottom: 4px;
  right: 0;
  font-size: 8px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 1024px) {
  .profile-card { padding: 24px; gap: 18px; }
  .name { font-size: 22px; }
}

@media (max-width: 768px) {
  .profile-head { flex-direction: column; align-items: center; text-align: center; gap: 14px; }
  .head-info { display: flex; flex-direction: column; align-items: center; }
  .name-line { justify-content: center; }
  .title-line { justify-content: center; }
  .social-strip { grid-template-columns: repeat(6, 1fr); }
}
</style>
