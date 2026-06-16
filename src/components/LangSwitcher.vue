<template>
  <div class="lang-switcher" :class="{ open }">
    <button class="trigger" @click="open = !open" :aria-label="`Language: ${currentLabel}`">
      <Icon icon="mdi:translate" class="ic" />
      <span class="label font-tech">{{ currentLabel }}</span>
      <span class="caret">▾</span>
    </button>

    <transition name="fade">
      <div v-if="open" class="menu" @click.stop>
        <button
          v-for="l in LANGS"
          :key="l.id"
          class="menu-item"
          :class="{ active: l.id === current }"
          @click="select(l.id)"
        >
          <span class="menu-dot"></span>
          <span class="menu-name">{{ l.labelFull }}</span>
          <span class="menu-tag font-tech">{{ l.short }}</span>
          <span v-if="l.id === current" class="menu-check">●</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { LANGS, setLocale } from '@/locales'

const { locale } = useI18n()
const open = ref(false)
const current = computed(() => locale.value)
const currentLabel = computed(() => {
  const l = LANGS.find((x) => x.id === current.value)
  return l ? l.label : '中'
})

function select(id) {
  if (id === current.value) {
    open.value = false
    return
  }
  setLocale(id)
  open.value = false
}

function handleClickOutside(e) {
  if (!e.target.closest('.lang-switcher')) open.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.lang-switcher { position: relative; }

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
.ic { font-size: 14px; }
.label { white-space: nowrap; }
.caret { font-size: 8px; opacity: 0.6; }

.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  padding: 4px;
  z-index: 1000;
  box-shadow: var(--shadow-card), 0 0 24px var(--accent-soft);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
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
.menu-name { flex: 1; font-weight: 500; }
.menu-tag {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  padding: 1px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
}
.menu-item.active .menu-tag {
  color: var(--accent);
  border-color: var(--accent);
}
.menu-check { color: var(--accent); font-size: 10px; }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s var(--ease-soft);
}
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .trigger { padding: 6px 10px; }
  .ic { font-size: 13px; }
  .label { font-size: 9px; }
}
</style>
