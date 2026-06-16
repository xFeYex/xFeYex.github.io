<template>
  <div class="view-placeholder">
    <div class="hud-corner tl"></div>
    <div class="hud-corner tr"></div>
    <div class="hud-corner bl"></div>
    <div class="hud-corner br"></div>

    <div class="placeholder-tag font-tech">// {{ name }} //</div>
    <h1 class="placeholder-title">{{ title }}</h1>
    <div class="placeholder-desc">{{ desc }}</div>
    <div class="placeholder-status font-tech">PHASE 1 SCAFFOLD · COMING SOON</div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const name = computed(() => route.name?.toUpperCase() || 'UNKNOWN')
const meta = {
  home: { title: '星轨之间', desc: '首页内容即将在 Phase 2 实现' },
  blog: { title: 'BLOG', desc: '文章列表和详情即将在 Phase 3 实现' },
  moments: { title: 'MOMENTS', desc: '动态页即将在 Phase 4 实现' },
  archive: { title: 'ARCHIVE', desc: '归档页即将在 Phase 4 实现' },
  about: { title: 'ABOUT', desc: '关于页即将在 Phase 4 实现' },
  links: { title: 'LINKS', desc: '友链页即将在 Phase 4 实现' },
  'not-found': { title: '404', desc: '你走错了轨道' },
}[route.name] || { title: route.name, desc: '' }
const title = computed(() => meta.title)
const desc = computed(() => meta.desc)
</script>

<style scoped>
.view-placeholder {
  position: relative;
  margin: 60px 0;
  padding: 80px 40px;
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  text-align: center;
}

.placeholder-tag {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 20px;
  text-transform: uppercase;
}
.placeholder-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}
.placeholder-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}
.placeholder-status {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  padding: 6px 14px;
  border: 1px solid var(--border-faint);
  display: inline-block;
}

.hud-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 1px solid var(--accent);
  opacity: 0.6;
}
.hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }
</style>
