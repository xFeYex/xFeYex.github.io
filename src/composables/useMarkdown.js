import { marked } from 'marked'
import hljs from 'highlight.js/lib/common'

/**
 * Markdown 渲染 composable
 *  - 使用 marked + highlight.js
 *  - 自动给 h2 / h3 加 id + 生成 TOC
 *  - 字数统计（CJK 按字、英文按词）
 *  - 处理外链 new tab
 */

let configured = false
function ensureConfigured() {
  if (configured) return
  configured = true

  // 自定义 renderer
  const renderer = new marked.Renderer()

  // 给标题加 id（TOC 需要）
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens)
    const id = slugify(text)
    return `<h${depth} id="${id}">${text}<a class="heading-anchor" href="#${id}" aria-label="Anchor">#</a></h${depth}>\n`
  }

  // 代码块高亮
  renderer.code = function ({ text, lang }) {
    const language = (lang || '').trim().split(/\s+/)[0]
    let highlighted = escapeHtml(text)
    if (language && hljs.getLanguage(language)) {
      try {
        highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value
      } catch { /* fallthrough */ }
    } else {
      // 自动尝试
      try {
        highlighted = hljs.highlightAuto(text).value
      } catch { /* fallthrough */ }
    }
    return `<pre><code class="hljs language-${language || 'plaintext'}">${highlighted}</code></pre>\n`
  }

  // 外链 new tab + 安全
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens)
    const safeHref = href || '#'
    const isExternal = /^https?:\/\//i.test(safeHref)
    const attrs = []
    if (title) attrs.push(`title="${escapeAttr(title)}"`)
    if (isExternal) {
      attrs.push('target="_blank"', 'rel="noopener noreferrer"')
    }
    return `<a href="${escapeAttr(safeHref)}"${attrs ? ' ' + attrs.join(' ') : ''}>${text}</a>`
  }

  // 图片懒加载
  renderer.image = function ({ href, title, text }) {
    const alt = escapeAttr(text || '')
    const t = title ? ` title="${escapeAttr(title)}"` : ''
    return `<img src="${escapeAttr(href || '')}" alt="${alt}"${t} loading="lazy" />`
  }

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
  })
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(s) {
  return escapeHtml(s)
}

/* ---------------- slug ---------------- */
let slugCounter = 0
function slugify(text) {
  // 去掉 markdown 标记符 & 空白
  const cleaned = String(text)
    .replace(/[*_`~]/g, '')
    .trim()
  // 中文保留，英文转小写、连字符
  const base = cleaned
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `h-${++slugCounter}`
  return base
}

/* ---------------- TOC ---------------- */
function extractToc(raw) {
  const lines = String(raw).split('\n')
  const toc = []
  const slugSeen = new Map()
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/)
    if (!m) continue
    const depth = m[1].length
    const text = m[2].replace(/[*_`~]/g, '').trim()
    if (!text) continue
    let id = slugify(text)
    // 防重名
    if (slugSeen.has(id)) {
      const n = (slugSeen.get(id) || 1) + 1
      slugSeen.set(id, n)
      id = `${id}-${n}`
    } else {
      slugSeen.set(id, 1)
    }
    toc.push({ id, text, depth })
  }
  return toc
}

/* ---------------- 字数统计 ---------------- */
function wordCount(raw) {
  const text = String(raw)
    .replace(/```[\s\S]*?```/g, ' ')        // 代码块
    .replace(/`[^`]*`/g, ' ')                // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')   // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/[#>*_~\-]/g, ' ')              // 标记符
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length
  const en = (text.match(/[A-Za-z]+/g) || []).length
  return cjk + en
}

/* ---------------- 阅读时长 ---------------- */
function readMinutes(raw, wpm = 350) {
  // 中文阅读速度约 300~400 字/分
  const words = wordCount(raw)
  return Math.max(1, Math.round(words / wpm))
}

/* ---------------- 主函数 ---------------- */
export function useMarkdown() {
  ensureConfigured()

  function render(raw) {
    const toc = extractToc(raw)
    const html = marked.parse(String(raw || ''))
    return { html, toc }
  }

  return {
    render,
    wordCount,
    readMinutes,
  }
}
