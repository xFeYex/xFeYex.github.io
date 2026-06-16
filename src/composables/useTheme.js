import { ref, watch, readonly, computed } from 'vue'

const STORAGE_KEY = 'xuwei-theme'
const DEFAULT_THEME = 'glass'
// 旧默认值列表：升级时清除这些值，让新默认主题生效
const DEPRECATED_DEFAULTS = ['honkai-star-rail']

export const THEMES = [
  {
    id: 'honkai-star-rail',
    name: '星穹铁道',
    nameEn: 'Honkai: Star Rail',
    desc: '银河科技 / 黑银金',
  },
  {
    id: 'arknights',
    name: '明日方舟',
    nameEn: 'Arknights',
    desc: '全息投影 / 深蓝绿',
  },
  {
    id: 'endfield',
    name: '终末地',
    nameEn: 'Endfield',
    desc: '工业废土 / 琥珀金',
  },
  {
    id: 'glass',
    name: '默认',
    nameEn: 'Default',
    desc: '浅色 / 蓝灰',
  },
]

// 全局状态（单例）
const theme = ref(loadTheme())

function loadTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    // URL 参数强制覆盖（?theme=glass 或 ?theme=arknights 等）
    const urlTheme = new URLSearchParams(window.location.search).get('theme')
    if (urlTheme && THEMES.some((t) => t.id === urlTheme)) {
      return urlTheme
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    // 升级：清除旧默认主题的值，让新默认生效
    if (stored && DEPRECATED_DEFAULTS.includes(stored)) {
      localStorage.removeItem(STORAGE_KEY)
      // 主动 setItem 一次（防止其他代码逻辑复用 localStorage）
      localStorage.setItem(STORAGE_KEY, DEFAULT_THEME)
      return DEFAULT_THEME
    }
    return stored || DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

function applyTheme(id) {
  if (typeof document === 'undefined') return
  // 所有主题都显式设置 data-theme（包括默认），避免依赖 :root 兜底
  document.documentElement.setAttribute('data-theme', id)
}

// 初始应用
applyTheme(theme.value)

watch(theme, (id) => {
  applyTheme(id)
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* 忽略存储异常 */
  }
})

export function useTheme() {
  const setTheme = (id) => {
    if (THEMES.some((t) => t.id === id)) {
      theme.value = id
    }
  }

  const toggleTheme = () => {
    const idx = THEMES.findIndex((t) => t.id === theme.value)
    const next = THEMES[(idx + 1) % THEMES.length]
    setTheme(next.id)
  }

  return {
    theme: readonly(theme),
    themes: THEMES,
    setTheme,
    toggleTheme,
    current: computed(() => THEMES.find((t) => t.id === theme.value)),
  }
}
