/**
 * 极简 frontmatter 解析（不引外部依赖）
 * 支持 key: value、字符串、数字、布尔、[a, b, c] 数组
 * 解析失败回退到空对象，不抛错
 */

export function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw }
  }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }
  const head = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).replace(/^\s*\n/, '')
  return { data: parseYaml(head), content }
}

function parseYaml(text) {
  const data = {}
  const lines = text.split('\n')
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    const val = m[2].trim()
    data[key] = parseValue(val)
  }
  return data
}

function parseValue(raw) {
  if (raw === '') return ''
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw.slice(1, -1).split(',').map((s) => unquote(s.trim())).filter(Boolean)
  }
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw)
  if ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1)
  }
  return raw
}

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  return s
}
