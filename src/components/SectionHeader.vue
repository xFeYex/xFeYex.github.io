<template>
  <header class="section-header" :class="{ 'is-flipped': flipped }">
    <div class="header-bar" :style="{ '--bar-color': color }"></div>

    <div class="header-row">
      <div class="header-left">
        <span class="index font-tech">// 0{{ index }}</span>
        <h2 class="title">
          <span class="title-cn">{{ title }}</span>
          <span v-if="subtitle" class="title-sub font-tech">/ {{ subtitle }}</span>
        </h2>
      </div>

      <div v-if="$slots.actions || link" class="header-right">
        <slot name="actions">
          <router-link v-if="link" :to="link" class="more-link font-tech">
            <span>VIEW ALL</span>
            <span class="more-arrow">→</span>
          </router-link>
        </slot>
      </div>
    </div>

    <div class="header-progress" aria-hidden="true">
      <span class="progress-fill" :style="{ background: color || 'var(--accent)' }"></span>
    </div>

    <p v-if="description" class="header-desc">{{ description }}</p>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  index: { type: [Number, String], default: 1 },
  link: { type: [String, Object], default: '' },
  color: { type: String, default: '' },
  flipped: { type: Boolean, default: false },
})
</script>

<style scoped>
.section-header {
  position: relative;
  margin: 80px 0 32px;
  --bar-color: var(--accent);
}

.header-bar {
  position: absolute;
  top: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: var(--bar-color);
  box-shadow: 0 0 12px var(--bar-color);
}

.header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 12px;
}

.header-left { flex: 1; min-width: 0; }

.index {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-bottom: 6px;
}

.title {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.15em;
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.title-cn { white-space: nowrap; }
.title-sub {
  font-size: 11px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.header-right { flex-shrink: 0; }
.more-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--text-secondary);
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  transition: all 0.3s var(--ease-soft);
}
.more-arrow {
  font-family: var(--font-tech);
  transition: transform 0.3s var(--ease-soft);
}
.more-link:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.more-link:hover .more-arrow { transform: translateX(4px); }

.header-progress {
  position: relative;
  height: 1px;
  background: var(--border-faint);
  margin-top: 8px;
  overflow: hidden;
}
.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  width: 30%;
  animation: progress-grow 1.2s var(--ease-out-expo) forwards;
}
@keyframes progress-grow {
  0% { width: 0; }
  100% { width: 30%; }
}

.header-desc {
  margin: 10px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 640px;
}

.is-flipped {
  text-align: right;
}
.is-flipped .header-row { flex-direction: row-reverse; }
.is-flipped .header-bar { left: auto; right: 0; }
.is-flipped .progress-fill { left: auto; right: 0; }

@media (max-width: 768px) {
  .section-header { margin: 60px 0 24px; }
  .title { font-size: 24px; letter-spacing: 0.1em; }
  .header-row { flex-wrap: wrap; gap: 12px; }
}
</style>
