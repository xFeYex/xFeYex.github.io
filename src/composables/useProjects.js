import { ref, computed, readonly } from 'vue'
import { parseFrontmatter } from '@/utils/frontmatter'

/**
 * 项目加载 composable
 *  - 与 usePosts 平行
 *  - 支持 type: external | internal
 *  - 置顶（featured）优先 + 按日期倒序
 */

const RAW_GLOB = import.meta.glob('/src/data/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const allProjects = Object.entries(RAW_GLOB)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(String(raw))
    const slug = data.slug || path.split('/').pop().replace(/\.md$/, '')
    return {
      ...data,
      slug,
      raw: content,
      to: `/projects/${slug}`,
      // external 项目给一个跳转 url
      href: data.type === 'external' ? data.externalUrl : `/projects/${slug}`,
    }
  })
  .sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
    return new Date(b.date) - new Date(a.date)
  })

const projects = ref(allProjects)

const stats = computed(() => {
  const internal = allProjects.filter((p) => p.type === 'internal').length
  const external = allProjects.filter((p) => p.type === 'external').length
  return { total: allProjects.length, internal, external }
})

function getBySlug(slug) {
  return allProjects.find((p) => p.slug === slug) || null
}

export function useProjects() {
  return {
    projects: readonly(projects),
    stats,
    getBySlug,
  }
}
