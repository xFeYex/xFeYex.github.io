<template>
  <div class="theme-switcher" :class="{ open }">
    <button class="trigger" @click="open = !open" :aria-label="`切换主题，当前: ${current.name}`">
      <span class="dot"></span>
      <span class="label font-tech">{{ current.name }}</span>
      <span class="caret">▾</span>
    </button>

    <transition name="fade">
      <div v-if="open" class="menu" @click.stop>
        <div class="menu-header font-tech">// SELECT THEME</div>
        <button
          v-for="t in themes"
          :key="t.id"
          class="menu-item"
          :class="{ active: t.id === theme }"
          @click="select(t.id)"
        >
          <span class="menu-dot"></span>
          <span class="menu-info">
            <span class="menu-name">{{ t.name }}</span>
            <span class="menu-desc font-tech">{{ t.desc }}</span>
          </span>
          <span v-if="t.id === theme" class="menu-check">●</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, themes, setTheme, current } = useTheme()
const open = ref(false)

function select(id) {
  setTheme(id)
  open.value = false
}

function handleClickOutside(e) {
  if (!e.target.closest('.theme-switcher')) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s var(--ease-soft);
}
.trigger:hover {
  color: var(--accent);
  border-color: var(--border-color);
  background: var(--accent-soft);
  box-shadow: 0 0 12px var(--accent-soft);
}
.dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}
.label { white-space: nowrap; }
.caret { font-size: 8px; opacity: 0.6; }

.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  padding: 4px;
  z-index: 1000;
  box-shadow: var(--shadow-card), 0 0 24px var(--accent-soft);
}

.menu-header {
  padding: 10px 14px 6px;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--accent);
  border-bottom: 1px solid var(--border-faint);
  margin-bottom: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-left: 2px solid transparent;
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s var(--ease-soft);
}
.menu-item:hover {
  background: var(--accent-faint);
  border-left-color: var(--border-color);
  color: var(--text-primary);
}
.menu-item.active {
  background: var(--accent-soft);
  border-left-color: var(--accent);
  color: var(--accent);
}

.menu-dot {
  width: 6px;
  height: 6px;
  background: var(--border-color);
  border-radius: 50%;
  flex-shrink: 0;
}
.menu-item.active .menu-dot {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.menu-name { font-weight: 500; }
.menu-desc {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.menu-check { color: var(--accent); font-size: 10px; }
</style>
