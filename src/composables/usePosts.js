import { ref, computed, readonly } from 'vue'
import { parseFrontmatter } from '@/utils/frontmatter'

/**
 * 文章加载 composable
 * Phase 3: 用 import.meta.glob 加载 /src/data/posts/*.md
 *  - 解析 frontmatter（极简实现，支持 key: value 与 [a, b, c]）
 *  - 去除 frontmatter 后的正文存为 raw
 *  - 置顶优先 + 按日期倒序
 */

const RAW_GLOB = import.meta.glob('/src/data/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const allPosts = Object.entries(RAW_GLOB)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(String(raw))
    const slug = data.slug || path.split('/').pop().replace(/\.md$/, '')
    return {
      ...data,
      slug,
      raw: content,
      to: `/blog/${slug}`,
    }
  })
  .sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
    return new Date(b.date) - new Date(a.date)
  })

const posts = ref(allPosts)
const tags = computed(() => {
  const set = new Set()
  for (const p of allPosts) {
    if (Array.isArray(p.tags)) p.tags.forEach((t) => set.add(t))
  }
  return Array.from(set)
})

const tagCounts = computed(() => {
  const map = {}
  for (const p of allPosts) {
    if (!Array.isArray(p.tags)) continue
    for (const t of p.tags) map[t] = (map[t] || 0) + 1
  }
  return map
})

function getBySlug(slug) {
  return allPosts.find((p) => p.slug === slug) || null
}

function byTag(tag) {
  if (!tag || tag === 'ALL') return allPosts
  return allPosts.filter((p) => Array.isArray(p.tags) && p.tags.includes(tag))
}

function adjacent(slug) {
  const idx = allPosts.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? allPosts[idx - 1] : null,
    next: idx < allPosts.length - 1 ? allPosts[idx + 1] : null,
  }
}

export function usePosts() {
  return {
    posts: readonly(posts),
    tags,
    tagCounts,
    getBySlug,
    byTag,
    adjacent,
  }
}
