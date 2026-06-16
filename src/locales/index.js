import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const STORAGE_KEY = 'xuwei-lang'
const DEFAULT_LANG = 'zh'

function detectLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* 忽略 */
  }
  const nav = (navigator.language || '').toLowerCase()
  if (nav.startsWith('zh')) return 'zh'
  if (nav.startsWith('en')) return 'en'
  return DEFAULT_LANG
}

export const LANGS = [
  { id: 'zh', label: '中', labelFull: '简体中文', short: 'CN' },
  { id: 'en', label: 'EN', labelFull: 'English', short: 'EN' },
]

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLang(),
  fallbackLocale: DEFAULT_LANG,
  messages: { zh, en },
})

export function setLocale(lang) {
  if (!['zh', 'en'].includes(lang)) return
  i18n.global.locale.value = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* 忽略 */
  }
  // 同步 <html lang>
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en-US')
  }
}

// 初始同步 html lang
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', i18n.global.locale.value === 'zh' ? 'zh-CN' : 'en-US')
}

export default i18n
