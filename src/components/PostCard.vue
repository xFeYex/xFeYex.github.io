<template>
  <article class="post-card" :class="`size-${size}`">
    <div class="cover-wrap">
      <span class="cover-frame tl"></span>
      <span class="cover-frame tr"></span>
      <span class="cover-frame bl"></span>
      <span class="cover-frame br"></span>
      <img v-if="post.cover" :src="post.cover" :alt="post.title" class="cover" loading="lazy" />
      <div v-else class="cover-placeholder">
        <Icon icon="mdi:image-outline" class="ph-icon" />
      </div>
      <span v-if="post.tag" class="cover-tag font-tech">{{ post.tag }}</span>
    </div>

    <div class="body">
      <div class="meta">
        <span class="meta-date font-tech">{{ post.date }}</span>
        <span v-if="post.readTime" class="meta-sep">·</span>
        <span v-if="post.readTime" class="meta-read font-tech">{{ post.readTime }} MIN</span>
      </div>

      <h3 class="title">{{ post.title }}</h3>
      <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>

      <div v-if="post.tags && post.tags.length" class="tags">
        <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
      </div>

      <router-link v-if="post.to" :to="post.to" class="read-more font-tech">
        <span>READ MORE</span>
        <span class="arrow">→</span>
      </router-link>
    </div>
  </article>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  post: {
    type: Object,
    required: true,
    // { title, excerpt, cover, date, readTime, tag, tags, to }
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg
  },
})
</script>

<style scoped>
.post-card {
  position: relative;
  background: var(--panel-bg);
  border: 1px solid var(--border-faint);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s var(--ease-out-expo);
}
.post-card:hover {
  border-color: var(--border-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--accent-soft);
}

/* 封面 */
.cover-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-deep);
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-expo), filter 0.4s;
  filter: grayscale(0.3) contrast(1.05);
}
.post-card:hover .cover {
  transform: scale(1.06);
  filter: grayscale(0) contrast(1.1);
}
.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-deep), var(--bg-overlay));
  color: var(--text-dim);
}
.ph-icon { font-size: 32px; }

.cover-frame {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--accent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}
.cover-frame.tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.cover-frame.tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
.cover-frame.bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
.cover-frame.br { bottom: 6px; right: 6px; border-left: none; border-top: none; }
.post-card:hover .cover-frame { opacity: 0.8; }

.cover-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--text-inverse);
  background: var(--accent);
  padding: 3px 8px;
  text-transform: uppercase;
}

/* body */
.body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.meta-sep { color: var(--text-dim); }

.title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;
  letter-spacing: 0.08em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}
.post-card:hover .title { color: var(--accent); }

.excerpt {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.tag {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.05em;
  padding: 2px 8px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--border-faint);
  text-transform: uppercase;
}
.arrow { transition: transform 0.3s var(--ease-soft); }
.read-more:hover .arrow { transform: translateX(4px); }

/* sizes */
.size-sm .body { padding: 16px 18px 18px; }
.size-sm .title { font-size: 16px; }
.size-sm .excerpt { -webkit-line-clamp: 2; line-clamp: 2; }

.size-lg .body { padding: 26px 28px 28px; }
.size-lg .title { font-size: 22px; }

@media (max-width: 768px) {
  .post-card { transform: none !important; }
}
</style>
