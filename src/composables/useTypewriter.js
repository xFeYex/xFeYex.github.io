import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

/**
 * 打字机效果（支持循环）
 * 行为：敲满 → 停留 → 一格一格删除 → 重新敲
 * @param {Ref<HTMLElement>} targetRef - 目标元素 ref
 * @param {string|Ref<string>} text - 文本
 * @param {Object} options
 * @param {number} options.speed - 字符间隔（ms）
 * @param {number} options.delay - 启动延迟（ms）
 * @param {number} options.pause - 敲满后停留（ms）
 * @param {number} options.eraseSpeed - 删除速度（ms）
 * @param {number} options.erasePause - 删除前短暂停顿（ms）
 * @param {boolean} options.loop - 是否循环（默认 true）
 */
export function useTypewriter(targetRef, text, options = {}) {
  const {
    speed = 60,
    delay = 0,
    pause = 2400,
    eraseSpeed = 30,
    erasePause = 400,
    loop = true,
  } = options
  const displayed = ref('')
  const done = ref(false)
  let timers = new Set()

  // 将字符串包装为 ref
  const textRef = typeof text === 'string' ? ref(text) : text

  function clearAll() {
    timers.forEach(clearTimeout)
    timers.clear()
  }

  function start() {
    clearAll()
    if (!targetRef.value) return
    targetRef.value.textContent = ''
    const source = textRef.value
    let i = 0
    let erasing = false

    function tick() {
      // 元素已卸载（路由切换）
      if (!targetRef.value) {
        clearAll()
        return
      }

      if (!erasing) {
        // 敲入阶段
        if (i < source.length) {
          targetRef.value.textContent += source[i]
          displayed.value = targetRef.value.textContent
          i++
          timers.add(setTimeout(tick, speed))
        } else {
          // 敲满
          done.value = true
          if (!loop) return
          // 停留 → 开始删除
          timers.add(setTimeout(() => {
            if (!targetRef.value) return
            erasing = true
            tick()
          }, pause))
        }
      } else {
        // 删除阶段
        if (targetRef.value.textContent.length > 0) {
          targetRef.value.textContent = targetRef.value.textContent.slice(0, -1)
          displayed.value = targetRef.value.textContent
          timers.add(setTimeout(tick, eraseSpeed))
        } else {
          // 清空 → 重新敲
          done.value = false
          i = 0
          erasing = false
          timers.add(setTimeout(tick, erasePause))
        }
      }
    }

    timers.add(setTimeout(tick, delay))
  }

  onMounted(() => start())

  onBeforeUnmount(() => clearAll())

  watch(textRef, () => {
    done.value = false
    start()
  })

  return { displayed, done }
}
