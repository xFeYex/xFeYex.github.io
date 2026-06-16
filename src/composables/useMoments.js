import { ref, readonly, computed } from 'vue'
import { parseFrontmatter } from '@/utils/frontmatter'

/**
 * 动态（短文）加载
 *  - 与 usePosts / useProjects 平行
 *  - 不需要 slug、不需要 tags、不需要 to
 *  - 渲染整段 md（不渲染 frontmatter 后的正文）
 */

const RAW_GLOB = import.meta.glob('/src/data/moments/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const allMoments = Object.entries(RAW_GLOB)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(String(raw))
    return {
      id: path.split('/').pop().replace(/\.md$/, ''),
      date: data.date,
      icon: data.icon || 'mdi:circle-small',
      mood: data.mood || '',
      content: content.trim(),
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const moments = ref(allMoments)

const stats = computed(() => ({
  total: allMoments.length,
  thisMonth: allMoments.filter((m) => {
    const d = new Date(m.date)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length,
  thisYear: allMoments.filter((m) => new Date(m.date).getFullYear() === new Date().getFullYear()).length,
}))

export function useMoments() {
  return {
    moments: readonly(moments),
    stats,
  }
}
