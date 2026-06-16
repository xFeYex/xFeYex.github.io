<template>
  <div class="page-nav">
    <router-link to="/" class="nav-logo">
      <div class="logo-icon">
        <span>✦</span>
      </div>
      <div class="logo-text">
        <div class="logo-en font-display">XUWEI.DEV</div>
        <div class="logo-cn">星轨之间</div>
      </div>
    </router-link>

    <div class="nav-links">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link font-tech"
        :class="{ active: isActive(link.to) }"
      >
        {{ $t(`nav.${link.key}`) }}
      </router-link>
    </div>

    <div class="nav-actions">
      <LangSwitcher />
      <ThemeSwitcher />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import LangSwitcher from '@/components/LangSwitcher.vue'

const route = useRoute()

const links = [
  { to: '/', key: 'home' },
  { to: '/blog', key: 'blog' },
  { to: '/moments', key: 'moments' },
  { to: '/projects', key: 'projects' },
  { to: '/archive', key: 'archive' },
  { to: '/about', key: 'about' },
  { to: '/links', key: 'links' },
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.page-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: var(--bg-overlay);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-faint);
  margin: 0 0 60px;
}
.page-nav::before {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color) 30%, var(--border-color) 70%, transparent);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-primary);
}
.logo-icon {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background: var(--accent-faint);
}
.logo-icon::before {
  content: "";
  position: absolute;
  inset: 3px;
  border: 1px solid var(--border-faint);
}
.logo-icon span {
  color: var(--accent);
  font-size: 16px;
  font-weight: 600;
}
.logo-text { line-height: 1.2; }
.logo-en {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-primary);
}
.logo-cn {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-top: 2px;
}

.nav-links {
  display: flex;
  gap: 4px;
}
.nav-link {
  position: relative;
  padding: 10px 18px;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border: 1px solid transparent;
  transition: all 0.3s var(--ease-soft);
  cursor: pointer;
}
.nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 0;
  background: var(--accent);
  transform: translateY(-50%);
  transition: height 0.3s var(--ease-soft);
}
.nav-link:hover,
.nav-link.active {
  color: var(--accent);
  background: var(--accent-faint);
  border-color: var(--border-faint);
}
.nav-link:hover::before,
.nav-link.active::before { height: 60%; }
.nav-link.active {
  background: var(--accent-soft);
  border-color: var(--border-color);
  box-shadow: 0 0 12px var(--accent-soft), inset 0 0 12px var(--accent-faint);
}

.nav-actions { display: flex; gap: 8px; align-items: center; }

@media (max-width: 1024px) {
  .page-nav { padding: 16px 24px; margin: 0 0 40px; }
  .nav-link { padding: 8px 12px; font-size: 10px; }
}

@media (max-width: 768px) {
  .page-nav { padding: 14px 20px; margin: 0 0 32px; flex-wrap: wrap; gap: 12px; }
  .logo-text { display: none; }
  .nav-links { order: 3; width: 100%; overflow-x: auto; padding-bottom: 4px; }
  .nav-link { padding: 6px 12px; font-size: 10px; }
}
</style>
