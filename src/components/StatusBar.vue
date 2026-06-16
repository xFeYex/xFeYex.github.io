<template>
  <div class="status-bar">
    <div class="status-item">
      <span class="dot"></span>
      <span class="label">SYSTEM ONLINE</span>
    </div>
    <div class="status-item center">
      <span class="label">// EXPLORER PROFILE //</span>
    </div>
    <div class="status-item right">
      <span class="label">{{ time }}</span>
    </div>
  </div>
</template>

<script setup>
import { useClock } from '@/composables/useClock'

const { time } = useClock()
</script>

<style scoped>
.status-bar {
  position: relative;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px;
  background: var(--bg-overlay);
  border-bottom: 1px solid var(--border-faint);
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.status-bar::before,
.status-bar::after {
  content: "";
  position: absolute;
  bottom: -1px;
  height: 1px;
  width: 60px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
}
.status-bar::before { left: 20%; }
.status-bar::after { right: 20%; }

.status-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-item.center { opacity: 0.7; }
.status-item.right { color: var(--text-secondary); }

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .status-bar { padding: 6px 16px; font-size: 9px; }
  .status-item.center { display: none; }
}
</style>
