import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 阅读记忆 - 记住文章滚动位置
 * - 离开时保存当前位置
 * - 回到同一文章时恢复（带"上次读到这"提示）
 *
 * 用法：
 *   const { resume, lastY, dismissResume } = useReadingMemory('post:vue3-composables')
 *   resume()              // 进入时调用：滚到上次位置
 *   // 组件卸载时自动保存当前位置
 */
export function useReadingMemory(key) {
  const storageKey = key ? `xuwei-read:${key}` : null
  const lastY = ref(0)
  const showResume = ref(false)
  const resumeEl = ref(null)
  let scrollHandler = null
  let saveTimer = null
  let mounted = false

  function load() {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const v = Number(raw)
        if (Number.isFinite(v) && v > 0) {
          lastY.value = v
          showResume.value = true
        }
      }
    } catch {
      /* 忽略 */
    }
  }

  function save() {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, String(window.scrollY || 0))
    } catch {
      /* 忽略 */
    }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(save, 300)
  }

  function resume() {
    if (!lastY.value) return
    // 等图片/字体加载完再滚
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({ top: lastY.value, behavior: 'auto' })
      }, 100)
    })
  }

  function dismissResume() {
    showResume.value = false
  }

  function clear() {
    if (!storageKey) return
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* 忽略 */
    }
    lastY.value = 0
    showResume.value = false
  }

  onMounted(() => {
    if (!storageKey) return
    mounted = true
    load()
    scrollHandler = scheduleSave
    window.addEventListener('scroll', scrollHandler, { passive: true })
  })

  onBeforeUnmount(() => {
    if (!storageKey) return
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    if (saveTimer) clearTimeout(saveTimer)
    if (mounted) save()
  })

  return {
    lastY,
    showResume,
    resumeEl,
    resume,
    dismissResume,
    clear,
  }
}
