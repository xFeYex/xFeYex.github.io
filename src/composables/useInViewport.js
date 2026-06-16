import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * 监听元素是否进入视口。
 *
 * 用法：
 *   const targetRef = ref(null)
 *   const isInView = useInViewport(targetRef, { threshold: 0.15, once: true })
 *   <div ref="targetRef" :class="['reveal', isInView && 'in-view']">
 *
 * @param {import('vue').Ref<HTMLElement|null>} target - 目标元素的 ref
 * @param {Object} [options]
 * @param {number} [options.threshold=0.15] - 触发比例
 * @param {string} [options.rootMargin='0px 0px -10% 0px'] - 边距
 * @param {boolean} [options.once=true] - 是否只触发一次
 * @returns {import('vue').Ref<boolean>} isInView
 */
export function useInViewport(target, options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    once = true,
  } = options

  const isInView = ref(false)
  let observer = null

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // 不支持 IO：直接显示，避免元素永久隐藏
      isInView.value = true
      return
    }
    const el = target.value
    if (!el) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isInView.value = true
            if (once && observer) {
              observer.disconnect()
              observer = null
            }
          } else if (!once) {
            isInView.value = false
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return isInView
}
