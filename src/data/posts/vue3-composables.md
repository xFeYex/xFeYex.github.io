---
title: Vue 3 组合式函数的最佳实践
slug: vue3-composables
date: 2026-06-08
tag: 技术
tags: [Vue, 前端, 工程]
cover: https://picsum.photos/seed/vue3-composables/1200/600
excerpt: 从 useTypewriter 到 useWeather，composables 让逻辑复用变得优雅。本文记录一些踩过的坑和设计模式。
readTime: 12
pinned: true
---

# Vue 3 组合式函数的最佳实践

从 Options 到 Composition，最让人兴奋的不是 `setup`，是 **composables**。
它把"逻辑"从"组件"里抽出来，终于可以像工具函数一样被复用、被测试、被丢弃。

## 一切从一个打字机开始

我博客首页需要一段打字机效果。
第一版我写在组件里，看着就 30 行，第二版我抽了出来：

```js
// composables/useTypewriter.js
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useTypewriter(targetRef, text, options = {}) {
  const { speed = 60, delay = 0, pause = 2400, loop = true } = options
  const displayed = ref('')
  let timer = null

  function start() {
    if (!targetRef.value) return
    targetRef.value.textContent = ''
    const source = String(text)
    let i = 0
    function tick() {
      if (i < source.length) {
        targetRef.value.textContent += source[i++]
        timer = setTimeout(tick, speed)
      } else if (loop) {
        timer = setTimeout(() => {
          targetRef.value.textContent = ''
          i = 0
          tick()
        }, pause)
      }
    }
    timer = setTimeout(tick, delay)
  }

  onMounted(start)
  onBeforeUnmount(() => timer && clearTimeout(timer))

  return { displayed }
}
```

调用方只需要一个 ref 加一句话：

```vue
<script setup>
import { ref } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

const el = ref(null)
useTypewriter(el, '你好，星轨之间。', { speed: 80 })
</script>

<template>
  <span ref="el"></span>
</template>
```

干净得让人想哭。

## 几个被反复验证的规则

### 1. 命名必须以 `use` 开头

不是约束，是约定。`useClock`、`useWeather` 一眼就知道它是 composable。

### 2. 入参尽量支持 ref

```js
export function usePosts(source) {
  const list = computed(() =>
    typeof source === 'function' ? source() : unref(source)
  )
  // ...
}
```

让调用方传字符串、传 ref、传 getter 都行。

### 3. 副作用必须自己清理

Composable 是"挂载即生效"的东西，但调用方可能动态卸载。
所以**定时器、事件监听、IntersectionObserver**，全部要在 `onBeforeUnmount` 里清掉。

### 4. 返回值用 reactive 包好

```js
return {
  time: readonly(time),       // 不希望外部改
  weather,                    // 让外部能 watch
  loading,                    // 状态要暴露
  refresh,                    // 给用户手动触发的入口
}
```

## 一些"别这样写"

| 错误 | 为什么 |
|------|--------|
| 在 composable 里 `import { useRouter }` 然后硬塞业务 | 应该让调用方传 |
| 把组件模板 JSX 写进 composable | 它不是 hook，是工具 |
| 异步初始化用顶层 `await` | 会阻塞 setup，建议用 `onMounted` + 状态 |

## 写一个天气 composable 练手

我博客要显示当地天气，Open-Meteo 免 API Key，正好拿来练手：

```js
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useWeather({ lat = 31.23, lon = 121.47, name = '上海' } = {}) {
  const data = ref({ temp: null, text: '加载中…' })

  async function fetch() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    const res = await fetch(url)
    const json = await res.json()
    data.value = {
      temp: Math.round(json.current_weather.temperature),
      text: describe(json.current_weather.weathercode),
    }
  }

  let timer = null
  onMounted(() => {
    fetch()
    timer = setInterval(fetch, 30 * 60 * 1000)
  })
  onBeforeUnmount(() => timer && clearInterval(timer))

  return { data, refresh: fetch }
}
```

我已经在博客顶部用上了它。

## 结尾

Composable 不是什么黑魔法，它就是：

> **把"状态 + 副作用"打包成一个函数，组件用一行代码拿走。**

下次你想写 `data() {}` 之前，先问问自己：
这段逻辑，能不能抽成一个 `useXxx`？
