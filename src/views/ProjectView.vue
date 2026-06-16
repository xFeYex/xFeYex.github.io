<template>
  <div class="project-view">
    <!-- 阅读进度条 -->
    <ReadProgress />

    <!-- 找不到 -->
    <div v-if="!project" class="proj-missing">
      <div class="missing-tag font-tech">// 404 // PROJECT NOT FOUND</div>
      <h1 class="missing-title">走丢了</h1>
      <p class="missing-desc">这个项目不在矩阵里，可能还在构想中。</p>
      <router-link to="/projects" class="missing-btn font-tech">
        <span>← BACK TO MATRIX</span>
      </router-link>
    </div>

    <template v-else>
      <!-- 返回链接 -->
      <div class="back-strip">
        <router-link to="/projects" class="back-link font-tech">
          <span class="arrow">←</span>
          <span>BACK TO MATRIX</span>
        </router-link>
      </div>

      <!-- 封面 -->
      <header class="proj-header">
        <div v-if="project.cover" class="proj-cover">
          <span class="cover-corner tl"></span>
          <span class="cover-corner tr"></span>
          <span class="cover-corner bl"></span>
          <span class="cover-corner br"></span>
          <img :src="project.cover" :alt="project.title" />
          <div class="cover-fade"></div>
        </div>

        <div class="proj-meta-top">
          <span v-if="project.featured" class="meta-flag">
            <Icon icon="mdi:star-four-points" /> FEATURED
          </span>
          <span class="meta-type font-tech">// INTERNAL PROJECT</span>
          <span v-if="project.status" class="meta-status font-tech">
            <span class="status-dot"></span>
            {{ project.status }}
          </span>
        </div>

        <h1 class="proj-title">{{ project.title }}</h1>
        <p v-if="project.excerpt" class="proj-excerpt">{{ project.excerpt }}</p>

        <div class="proj-info-strip">
          <div class="info-cell">
            <Icon icon="mdi:calendar-outline" class="info-icon" />
            <span class="info-text font-tech">{{ formatDate(project.date) }}</span>
          </div>
          <div class="info-cell">
            <Icon icon="mdi:counter" class="info-icon" />
            <span class="info-text font-tech">{{ words }} WORDS</span>
          </div>
          <div class="info-cell">
            <Icon icon="mdi:clock-outline" class="info-icon" />
            <span class="info-text font-tech">{{ minutes }} MIN READ</span>
          </div>
        </div>

        <div v-if="project.tags && project.tags.length" class="proj-tags-top">
          <span class="tags-label font-tech">// STACK:</span>
          <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </header>

      <!-- 正文 + 侧栏目录 -->
      <div class="proj-layout">
        <article class="proj-content" v-html="rendered"></article>
        <Toc :items="toc" />
      </div>

      <!-- 跳到外部 -->
      <div v-if="project.externalUrl" class="external-cta">
        <span class="cta-tag font-tech">// WANT TO SEE IT LIVE?</span>
        <a :href="project.externalUrl" target="_blank" rel="noopener noreferrer" class="cta-link font-tech">
          <span>VISIT {{ project.externalUrl.replace(/^https?:\/\//, '').split('/')[0] }}</span>
          <span class="cta-arrow">↗</span>
        </a>
      </div>

      <!-- 回到顶部 -->
      <BackToTop />
    </template>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import ReadProgress from '@/components/ReadProgress.vue'
import Toc from '@/components/Toc.vue'
import BackToTop from '@/components/BackToTop.vue'
import { useProjects } from '@/composables/useProjects'
import { useMarkdown } from '@/composables/useMarkdown'

const route = useRoute()
const { getBySlug } = useProjects()
const { render, wordCount, readMinutes } = useMarkdown()

const slug = computed(() => String(route.params.slug || ''))
const project = computed(() => getBySlug(slug.value))
const rendered = computed(() => project.value ? render(project.value.raw).html : '')
const toc = computed(() => project.value ? render(project.value.raw).toc : [])
const words = computed(() => project.value ? wordCount(project.value.raw) : 0)
const minutes = computed(() => project.value ? readMinutes(project.value.raw) : 0)

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

watch(slug, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.project-view { position: relative; padding-bottom: 40px; }

/* ============== 返回 ============== */
.back-strip { margin: 0 0 24px; }
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-secondary);
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  transition: all 0.3s var(--ease-soft);
}
.back-link:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
}
.back-link .arrow {
  font-family: var(--font-tech);
  transition: transform 0.3s;
}
.back-link:hover .arrow { transform: translateX(-3px); }

/* ============== Header ============== */
.proj-header { position: relative; margin-bottom: 40px; }

.proj-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  background: var(--bg-deep);
  border: 1px solid var(--border-faint);
  margin-bottom: 32px;
}
.proj-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.05) brightness(0.85);
}
.cover-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, var(--bg-deep) 100%);
  pointer-events: none;
}
.cover-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px solid var(--accent);
  z-index: 2;
}
.cover-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.cover-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.cover-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.cover-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.proj-meta-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.meta-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-family: var(--font-tech);
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-inverse);
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-soft);
}
.meta-type {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  padding: 3px 8px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
}
.meta-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
  padding: 3px 8px;
  border: 1px solid var(--border-faint);
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #7ed87e;
  border-radius: 50%;
  box-shadow: 0 0 6px #7ed87e;
  animation: pulse 2s ease-in-out infinite;
}

.proj-title {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  line-height: 1.3;
  margin: 0 0 16px;
}

.proj-excerpt {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 24px;
  padding-left: 16px;
  border-left: 2px solid var(--accent);
  max-width: 720px;
}

.proj-info-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 14px 0;
  border-top: 1px solid var(--border-faint);
  border-bottom: 1px solid var(--border-faint);
}
.info-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
}
.info-icon { font-size: 14px; color: var(--accent); }
.info-text {
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.proj-tags-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.tags-label {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-right: 4px;
}
.tag {
  padding: 3px 10px;
  font-size: 12px;
  color: var(--accent);
  background: var(--accent-faint);
  border: 1px solid var(--accent-faint);
  letter-spacing: 0.05em;
}

/* ============== Layout 正文 + 目录 ============== */
.proj-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 48px;
  align-items: flex-start;
}

.proj-content {
  position: relative;
  max-width: 800px;
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.9;
  color: var(--text-primary);
}

/* 复用 PostView 的 .post-content 排版样式（指向 proj-content） */
.proj-content :deep(h1),
.proj-content :deep(h2),
.proj-content :deep(h3),
.proj-content :deep(h4) {
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin: 2em 0 0.8em;
  scroll-margin-top: 100px;
  position: relative;
}
.proj-content :deep(h1) { font-size: 30px; }
.proj-content :deep(h2) {
  font-size: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-faint);
}
.proj-content :deep(h3) { font-size: 19px; color: var(--accent); }
.proj-content :deep(h4) { font-size: 16px; color: var(--text-secondary); }

.proj-content :deep(.heading-anchor) {
  margin-left: 8px;
  font-size: 0.6em;
  color: var(--text-dim);
  opacity: 0;
  transition: opacity 0.3s;
  text-decoration: none;
}
.proj-content :deep(h2):hover .heading-anchor,
.proj-content :deep(h3):hover .heading-anchor,
.proj-content :deep(h4):hover .heading-anchor {
  opacity: 1;
}

.proj-content :deep(p) { margin: 0 0 1.2em; color: var(--text-primary); }

.proj-content :deep(a) {
  color: var(--accent);
  border-bottom: 1px solid var(--accent-faint);
  transition: border-color 0.3s, color 0.3s;
}
.proj-content :deep(a:hover) {
  color: var(--text-primary);
  border-bottom-color: var(--accent);
}

.proj-content :deep(strong) { color: var(--accent); font-weight: 600; }
.proj-content :deep(em) { color: var(--text-secondary); font-style: italic; }

.proj-content :deep(blockquote) {
  position: relative;
  margin: 1.6em 0;
  padding: 16px 20px 16px 28px;
  background: var(--bg-overlay);
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
  font-style: italic;
}
.proj-content :deep(blockquote p:last-child) { margin-bottom: 0; }

.proj-content :deep(ul),
.proj-content :deep(ol) {
  margin: 0 0 1.2em;
  padding-left: 1.6em;
}
.proj-content :deep(li) { margin: 0.4em 0; color: var(--text-primary); }
.proj-content :deep(li::marker) { color: var(--accent); }

.proj-content :deep(code) {
  font-family: ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
  font-size: 0.88em;
  padding: 2px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--accent);
}
.proj-content :deep(pre) {
  position: relative;
  margin: 1.6em 0;
  padding: 18px 20px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border-faint);
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.7;
}
.proj-content :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: #e8e8f0;
  font-size: 13px;
}

.proj-content :deep(.hljs) { color: #e8e8f0; background: transparent; }
.proj-content :deep(.hljs-keyword),
.proj-content :deep(.hljs-selector-tag),
.proj-content :deep(.hljs-built_in) { color: #f0d675; }
.proj-content :deep(.hljs-string),
.proj-content :deep(.hljs-attr),
.proj-content :deep(.hljs-title) { color: #b8e986; }
.proj-content :deep(.hljs-number),
.proj-content :deep(.hljs-literal) { color: #f5a97f; }
.proj-content :deep(.hljs-comment),
.proj-content :deep(.hljs-quote) { color: #6a6a78; font-style: italic; }
.proj-content :deep(.hljs-variable),
.proj-content :deep(.hljs-name) { color: #6cb4ff; }
.proj-content :deep(.hljs-tag) { color: #f0d675; }
.proj-content :deep(.hljs-meta) { color: #a0a0b0; }

.proj-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  margin: 2em 0;
}
.proj-content :deep(img) {
  max-width: 100%;
  display: block;
  margin: 1.6em auto;
  border: 1px solid var(--border-faint);
}
.proj-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.6em 0;
  font-size: 14px;
}
.proj-content :deep(th),
.proj-content :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border-faint);
  text-align: left;
}
.proj-content :deep(th) {
  background: var(--bg-overlay);
  color: var(--accent);
  font-weight: 600;
}

/* ============== External CTA ============== */
.external-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 40px 0 0;
  padding: 18px 24px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--accent);
}
.cta-tag {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
}
.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--text-primary);
  text-decoration: none;
  padding: 6px 14px;
  background: var(--accent-faint);
  border: 1px solid var(--accent);
  transition: all 0.3s;
}
.cta-link:hover {
  background: var(--accent);
  color: var(--text-inverse);
  box-shadow: 0 0 16px var(--accent-soft);
}
.cta-arrow {
  font-family: var(--font-tech);
  font-size: 14px;
  transition: transform 0.3s;
}
.cta-link:hover .cta-arrow { transform: translate(3px, -3px); }

/* ============== 找不到 ============== */
.proj-missing {
  text-align: center;
  padding: 100px 20px;
  background: var(--panel-bg);
  border: 1px solid var(--border-faint);
}
.missing-tag {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  margin-bottom: 20px;
}
.missing-title {
  font-family: var(--font-display);
  font-size: 64px;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.missing-desc {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.missing-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--accent);
  background: var(--accent-faint);
  border: 1px solid var(--accent);
  transition: all 0.3s;
}
.missing-btn:hover {
  background: var(--accent);
  color: var(--text-inverse);
  box-shadow: 0 0 16px var(--accent-soft);
}

/* ============== 响应式 ============== */
@media (max-width: 1024px) {
  .proj-layout { grid-template-columns: 1fr; gap: 32px; }
  .proj-title { font-size: 32px; }
}

@media (max-width: 768px) {
  .proj-cover { aspect-ratio: 16 / 10; }
  .proj-title { font-size: 26px; letter-spacing: 0.05em; }
  .proj-excerpt { font-size: 14px; }
  .proj-info-strip { gap: 16px; }
  .missing-title { font-size: 42px; }
  .proj-content { font-size: 15px; }
  .proj-content :deep(h1) { font-size: 24px; }
  .proj-content :deep(h2) { font-size: 20px; }
  .proj-content :deep(h3) { font-size: 17px; }
  .proj-content :deep(pre) { font-size: 12px; padding: 14px 16px; }
}
</style>
