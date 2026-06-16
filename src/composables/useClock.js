import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useClock() {
  const time = ref(formatNow())
  let timer = null

  function formatNow() {
    const d = new Date()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    const s = String(d.getSeconds()).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  onMounted(() => {
    timer = setInterval(() => {
      time.value = formatNow()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { time }
}
