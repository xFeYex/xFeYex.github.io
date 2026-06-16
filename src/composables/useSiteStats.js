import { ref, onMounted } from 'vue'

/**
 * 站点统计
 * Phase 2: 从 mock 数据 + 局部规则推断
 * Phase 4: 从 markdown 文件自动扫描
 */
export function useSiteStats() {
  const stats = ref({
    posts: 22,
    moments: 17,
    projects: 5,
    runningDays: 0,
    totalWords: 0,
  })

  const milestones = ref([
    { year: '2024', label: '开始写', icon: 'mdi:seed-outline' },
    { year: '2025', label: '主域上线', icon: 'mdi:rocket-launch-outline' },
    { year: '2026', label: '重构中', icon: 'mdi:tools' },
  ])

  function calcRunningDays(startDate = '2024-03-15') {
    const start = new Date(startDate).getTime()
    const now = Date.now()
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
  }

  onMounted(() => {
    stats.value.runningDays = calcRunningDays()
    // 估算字数
    stats.value.totalWords = stats.value.posts * 1200 + stats.value.moments * 80
  })

  return { stats, milestones }
}
