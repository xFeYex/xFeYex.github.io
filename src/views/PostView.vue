<template>
  <div class="post-view">
    <!-- 阅读进度条 -->
    <ReadProgress />

    <!-- 上次读到这 -->
    <transition name="fade-up">
      <div v-if="showResume" ref="resumeEl" class="resume-banner">
        <div class="resume-inner">
          <Icon icon="mdi:bookmark-outline" class="resume-icon" />
          <span class="resume-text font-tech">// 上次读到这 · 恢复</span>
          <button class="resume-btn" @click="resume">继续</button>
          <button class="resume-dismiss" @click="dismissResume" aria-label="关闭">
            <Icon icon="mdi:close" />
          </button>
        </div>
      </div>
    </transition>

    <!-- 文章找不到 -->
    <div v-if="!post" class="post-missing">
      <div class="missing-tag font-tech">// 404 // ARTICLE NOT FOUND</div>
      <h1 class="missing-title">走丢了</h1>
      <p class="missing-desc">这篇文章不在星轨里，可能被黑洞吸走了。</p>
      <router-link to="/blog" class="missing-btn font-tech">
        <span>← BACK TO BLOG</span>
      </router-link>
    </div>

    <template v-else>
      <!-- 返回链接 -->
      <div class="back-strip">
        <router-link to="/blog" class="back-link font-tech">
          <span class="arrow">←</span>
          <span>BACK TO LIST</span>
        </router-link>
      </div>

      <!-- 封面 + 标题 -->
      <header class="post-header">
        <div v-if="post.cover" class="post-cover">
          <span class="cover-corner tl"></span>
          <span class="cover-corner tr"></span>
          <span class="cover-corner bl"></span>
          <span class="cover-corner br"></span>
          <img :src="post.cover" :alt="post.title" />
          <div class="cover-fade"></div>
        </div>

        <div class="post-meta-top">
          <span v-if="post.pinned" class="meta-flag">
            <Icon icon="mdi:pin" /> PINNED
          </span>
          <span v-if="post.tag" class="meta-tag font-tech">{{ post.tag }}</span>
          <span class="meta-date font-tech">{{ formatDate(post.date) }}</span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>
        <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>

        <div class="post-info-strip">
          <div class="info-cell">
            <Icon icon="mdi:calendar-outline" class="info-icon" />
            <span class="info-text font-tech">{{ formatDate(post.date) }}</span>
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
      </header>

      <!-- 正文 + 侧栏目录 -->
      <div class="post-layout">
        <article class="post-content" v-html="rendered"></article>
        <Toc :items="toc" />
      </div>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length" class="post-tags">
        <span class="tags-label font-tech">// TAGS:</span>
        <router-link
          v-for="t in post.tags"
          :key="t"
          :to="{ path: '/blog', query: { tag: t } }"
          class="tag-chip"
        >#{{ t }}</router-link>
      </div>

      <!-- 上一篇 / 下一篇 -->
      <nav class="post-nav">
        <router-link
          v-if="prev"
          :to="prev.to"
          class="post-nav-cell nav-prev"
        >
          <div class="nav-label font-tech">← PREVIOUS</div>
          <div class="nav-title">{{ prev.title }}</div>
        </router-link>
        <span v-else class="post-nav-cell nav-disabled">
          <div class="nav-label font-tech">← PREVIOUS</div>
          <div class="nav-title">已经是第一篇了</div>
        </span>

        <router-link
          v-if="next"
          :to="next.to"
          class="post-nav-cell nav-next"
        >
          <div class="nav-label font-tech">NEXT →</div>
          <div class="nav-title">{{ next.title }}</div>
        </router-link>
        <span v-else class="post-nav-cell nav-disabled">
          <div class="nav-label font-tech">NEXT →</div>
          <div class="nav-title">已经是最后一篇了</div>
        </span>
      </nav>

      <!-- 回到顶部 -->
      <BackToTop />
    </template>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ReadProgress from '@/components/ReadProgress.vue'
import Toc from '@/components/Toc.vue'
import BackToTop from '@/components/BackToTop.vue'
import { usePosts } from '@/composables/usePosts'
import { useMarkdown } from '@/composables/useMarkdown'
import { useReadingMemory } from '@/composables/useReadingMemory'

const route = useRoute()
const router = useRouter()
const { getBySlug, adjacent } = usePosts()
const { render, wordCount, readMinutes } = useMarkdown()

const slug = computed(() => String(route.params.slug || ''))
const memoryKey = computed(() => slug.value ? `post:${slug.value}` : null)
const { lastY, showResume, resumeEl, resume, dismissResume } = useReadingMemory(memoryKey.value)
const post = computed(() => getBySlug(slug.value))
const rendered = computed(() => post.value ? render(post.value.raw).html : '')
const toc = computed(() => post.value ? render(post.value.raw).toc : [])
const words = computed(() => post.value ? wordCount(post.value.raw) : 0)
const minutes = computed(() => post.value ? readMinutes(post.value.raw) : 0)

const prev = computed(() => {
  const a = adjacent(slug.value)
  return a.prev ? { title: a.prev.title, to: a.prev.to } : null
})
const next = computed(() => {
  const a = adjacent(slug.value)
  return a.next ? { title: a.next.title, to: a.next.to } : null
})

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return d
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

// 切换文章时回到顶部
watch(slug, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  // 标签 query 跳到 BlogView 时用
  // 这里不需要任何事
})
</script>

<style scoped>
.post-view { position: relative; padding-bottom: 40px; }

/* ============== 阅读记忆提示 ============== */
.resume-banner {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  width: min(560px, calc(100% - 40px));
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--accent);
  box-shadow: 0 0 20px var(--accent-soft), var(--shadow-card);
}
.resume-banner::before,
.resume-banner::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--accent);
}
.resume-banner::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.resume-banner::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
.resume-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
}
.resume-icon {
  color: var(--accent);
  font-size: 16px;
  flex-shrink: 0;
}
.resume-text {
  flex: 1;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.resume-btn {
  padding: 5px 12px;
  font-family: var(--font-tech);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-inverse);
  background: var(--accent);
  border: 1px solid var(--accent);
  cursor: pointer;
  transition: all 0.2s var(--ease-soft);
}
.resume-btn:hover {
  background: transparent;
  color: var(--accent);
  box-shadow: 0 0 12px var(--accent-soft);
}
.resume-dismiss {
  background: transparent;
  border: 1px solid var(--border-faint);
  color: var(--text-dim);
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.resume-dismiss:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s var(--ease-out-expo);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

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
.post-header {
  position: relative;
  margin-bottom: 40px;
}

.post-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  background: var(--bg-deep);
  border: 1px solid var(--border-faint);
  margin-bottom: 32px;
}
.post-cover img {
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

.post-meta-top {
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
.meta-tag {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  padding: 3px 8px;
  background: var(--accent-faint);
  border: 1px solid var(--border-faint);
}
.meta-date {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--text-dim);
}

.post-title {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  line-height: 1.3;
  margin: 0 0 16px;
}

.post-excerpt {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0 0 24px;
  padding-left: 16px;
  border-left: 2px solid var(--accent);
  max-width: 720px;
}

.post-info-strip {
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

/* ============== Layout 正文 + 目录 ============== */
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 48px;
  align-items: flex-start;
}

.post-content {
  position: relative;
  max-width: 800px;
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.9;
  color: var(--text-primary);
}

/* Markdown 渲染样式 */
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4) {
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin: 2em 0 0.8em;
  scroll-margin-top: 100px;
  position: relative;
}
.post-content :deep(h1) { font-size: 30px; }
.post-content :deep(h2) {
  font-size: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-faint);
}
.post-content :deep(h3) { font-size: 19px; color: var(--accent); }
.post-content :deep(h4) { font-size: 16px; color: var(--text-secondary); }

.post-content :deep(.heading-anchor) {
  margin-left: 8px;
  font-size: 0.6em;
  color: var(--text-dim);
  opacity: 0;
  transition: opacity 0.3s;
  text-decoration: none;
}
.post-content :deep(h2):hover .heading-anchor,
.post-content :deep(h3):hover .heading-anchor,
.post-content :deep(h4):hover .heading-anchor {
  opacity: 1;
}

.post-content :deep(p) {
  margin: 0 0 1.2em;
  color: var(--text-primary);
}

.post-content :deep(a) {
  color: var(--accent);
  border-bottom: 1px solid var(--accent-faint);
  transition: border-color 0.3s, color 0.3s;
}
.post-content :deep(a:hover) {
  color: var(--text-primary);
  border-bottom-color: var(--accent);
}

.post-content :deep(strong) {
  color: var(--accent);
  font-weight: 600;
}
.post-content :deep(em) {
  color: var(--text-secondary);
  font-style: italic;
}

.post-content :deep(blockquote) {
  position: relative;
  margin: 1.6em 0;
  padding: 16px 20px 16px 28px;
  background: var(--bg-overlay);
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
  font-style: italic;
}
.post-content :deep(blockquote p:last-child) { margin-bottom: 0; }

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 0 0 1.2em;
  padding-left: 1.6em;
}
.post-content :deep(li) {
  margin: 0.4em 0;
  color: var(--text-primary);
}
.post-content :deep(li::marker) {
  color: var(--accent);
}

.post-content :deep(code) {
  font-family: ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
  font-size: 0.88em;
  padding: 2px 6px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--accent);
}

.post-content :deep(pre) {
  position: relative;
  margin: 1.6em 0;
  padding: 18px 20px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border-faint);
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.7;
}
.post-content :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: #e8e8f0;
  font-size: 13px;
}

/* highlight.js 主题——轻量化处理，使用变量色 */
.post-content :deep(.hljs) { color: #e8e8f0; background: transparent; }
.post-content :deep(.hljs-keyword),
.post-content :deep(.hljs-selector-tag),
.post-content :deep(.hljs-built_in) { color: #f0d675; }
.post-content :deep(.hljs-string),
.post-content :deep(.hljs-attr),
.post-content :deep(.hljs-title) { color: #b8e986; }
.post-content :deep(.hljs-number),
.post-content :deep(.hljs-literal) { color: #f5a97f; }
.post-content :deep(.hljs-comment),
.post-content :deep(.hljs-quote) { color: #6a6a78; font-style: italic; }
.post-content :deep(.hljs-variable),
.post-content :deep(.hljs-name) { color: #6cb4ff; }
.post-content :deep(.hljs-tag) { color: #f0d675; }
.post-content :deep(.hljs-meta) { color: #a0a0b0; }

.post-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  margin: 2em 0;
}

.post-content :deep(img) {
  max-width: 100%;
  display: block;
  margin: 1.6em auto;
  border: 1px solid var(--border-faint);
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.6em 0;
  font-size: 14px;
}
.post-content :deep(th),
.post-content :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border-faint);
  text-align: left;
}
.post-content :deep(th) {
  background: var(--bg-overlay);
  color: var(--accent);
  font-weight: 600;
}

/* ============== Tags ============== */
.post-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 40px 0 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-faint);
}
.tags-label {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-right: 4px;
}
.tag-chip {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  transition: all 0.3s;
}
.tag-chip:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
}

/* ============== 上下篇 ============== */
.post-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 40px 0 0;
}
.post-nav-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 20px;
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-faint);
  text-decoration: none;
  transition: all 0.3s var(--ease-soft);
  min-height: 88px;
}
.post-nav-cell.nav-prev { border-left: 2px solid var(--accent); }
.post-nav-cell.nav-next { text-align: right; border-right: 2px solid var(--accent); }
.post-nav-cell.nav-disabled { opacity: 0.5; cursor: default; }

.post-nav-cell:not(.nav-disabled):hover {
  border-color: var(--border-color);
  background: var(--accent-faint);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--accent-soft);
}

.nav-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.nav-title {
  font-size: 14px;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-nav-cell:not(.nav-disabled):hover .nav-title { color: var(--accent); }

/* ============== 找不到 ============== */
.post-missing {
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
  .post-layout { grid-template-columns: 1fr; gap: 32px; }
  .post-title { font-size: 32px; }
}

@media (max-width: 768px) {
  .post-cover { aspect-ratio: 16 / 10; }
  .post-title { font-size: 26px; letter-spacing: 0.05em; }
  .post-excerpt { font-size: 14px; }
  .post-info-strip { gap: 16px; }
  .post-nav { grid-template-columns: 1fr; }
  .post-nav-cell.nav-next { text-align: left; border-right: none; border-left: 2px solid var(--accent); }
  .missing-title { font-size: 42px; }
  .post-content { font-size: 15px; }
  .post-content :deep(h1) { font-size: 24px; }
  .post-content :deep(h2) { font-size: 20px; }
  .post-content :deep(h3) { font-size: 17px; }
  .post-content :deep(pre) { font-size: 12px; padding: 14px 16px; }
}
</style>
