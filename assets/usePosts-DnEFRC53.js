import{A as e,j as t,l as n}from"./index-DXI_ny0r.js";import{t as r}from"./frontmatter-BfD-LpMS.js";var i=Object.entries(Object.assign({"/src/data/posts/acg-music-notes.md":`---
title: 那些被听烂的 ACG 曲子
slug: acg-music-notes
date: 2026-05-08
tag: ACG
tags: [ACG, 音乐, 随笔]
cover: https://picsum.photos/seed/acg-music/1200/600
excerpt: 写代码循环播放 30 遍的歌单。每一首都有一段"当时在干嘛"的记忆。
readTime: 6
pinned: false
---

# 那些被听烂的 ACG 曲子

我不算硬核 ACG 听众。
但总有那么几首曲子，**循环到能默写前奏**。

## 1. 星间旅行 - HOYO-MiX

听这首的时候我刚开始重构博客。
凌晨两点，键盘声 + 这首曲子，是我最舒服的状态。
循环了大概 30 遍，第二天我就能闭着眼睛写 composable。

## 2. Cyberangel

贝洛伯格那段，剧情我没哭，这首曲子把我听哭了。
不是因为剧情多惨，是因为它**接住**了你所有的情绪。

> "你不是一个人在战斗"——这首曲子用音符说的

## 3. 危楼高卧 - HOJO

星穹铁道 1.4 剧情 BGM。
我把它当 **debug 专用曲**：
调不出来的 bug，一放这首，5 分钟内必有思路。
玄学，但有效。

## 4. 纯白誓约 - Mili

《来自深渊》ED。
这首曲子我只在写**长文**的时候听。
因为它结构很简单，不会抢注意力，但又不会让你"空"。

## 5. 名前のない怪物 - egoist

《Psycho-Pass》OP。
这是我十年前入宅的曲子。
现在听依然能起鸡皮疙瘩，**好曲子就是能跨越时间**。

## 6. 恋愛サーキュレーション - 千石撫子

《化物语》OP。
写这篇的时候正在单曲循环。
不是因为我多喜欢这首歌，是因为——

> 它让我想起大学宿舍里 4 个人挤一台笔记本看番的晚上

## 写在最后

音乐是记忆的钥匙。
你不会记得自己 3 年前某个周二下午具体干了什么，
但你会记得当时耳机里在放什么。

所以我博客里塞了个播放器。
不为给别人听，只为**给我自己留把钥匙**。
`,"/src/data/posts/glass-music-player.md":`---
title: 把歌单搬进博客：毛玻璃播放器的诞生
slug: glass-music-player
date: 2026-05-22
tag: 技术
tags: [前端, Vue, CSS]
cover: https://picsum.photos/seed/glass-music-player/1200/600
excerpt: 一个不需要后端、不依赖第三方 SDK 的纯前端音乐浮窗。8 首歌、一条进度条、几个快捷键，足矣。
readTime: 10
pinned: false
---

# 把歌单搬进博客：毛玻璃播放器的诞生

博客要不要有音乐？这事我纠结了很久。
最终决定：**有，但别打扰我。**

## 需求其实很简单

- 一个浮窗，右下角
- 不点不知道，点开能切歌
- 歌单写在 \`playlist.json\` 里，改了不用动代码
- 移动端能隐藏
- 第一次进来别自动播（浏览器会拦，体验更差）

## 数据结构

\`\`\`json
[
  {
    "id": "stardust",
    "title": "星间旅行",
    "artist": "HOYO-MiX",
    "cover": "https://picsum.photos/seed/m1/200",
    "src": "https://example.com/audio/stardust.mp3"
  }
]
\`\`\`

简单到不能再简单。

## 浮窗组件

骨架就是个按钮 + 一个面板：

\`\`\`vue
<template>
  <div class="player" :class="{ expanded }">
    <button class="player-toggle" @click="toggle">
      <Icon :icon="playing ? 'mdi:pause' : 'mdi:play'" />
    </button>

    <div v-if="expanded" class="player-panel">
      <div class="cover">
        <img :src="current.cover" />
      </div>
      <div class="info">
        <div class="title">{{ current.title }}</div>
        <div class="artist">{{ current.artist }}</div>
      </div>
      <div class="controls">
        <button @click="prev"><Icon icon="mdi:skip-previous" /></button>
        <button @click="toggle"><Icon :icon="playing ? 'mdi:pause' : 'mdi:play'" /></button>
        <button @click="next"><Icon icon="mdi:skip-next" /></button>
      </div>
    </div>

    <audio ref="audio" :src="current.src" @ended="next" />
  </div>
</template>
\`\`\`

## 几个坑

### 1. 第一次播放必须用户触发

\`audio.play()\` 在没用户手势时会报 \`NotAllowedError\`。
解法：第一次只 \`load()\`，等用户点"播放"再 \`play()\`。

### 2. iOS Safari 的 autoplay 策略

iOS 永远不让你自动播。
我索性在检测到 iOS 时，**直接不显示播放器**——博客不差这一个功能。

### 3. 进度条要节流

\`timeupdate\` 触发太频繁，250ms 节流一次够用：

\`\`\`js
audio.addEventListener('timeupdate', throttle(update, 250))
\`\`\`

### 4. 切歌要预加载

\`\`\`js
const next = new Audio(playlist[(idx + 1) % playlist.length].src)
next.preload = 'metadata'
\`\`\`

切歌瞬间秒开，体感会好很多。

## 毛玻璃的"克制"

播放器浮窗最容易做花。
我做了一件事来克制自己：**所有颜色都用 CSS 变量**。

切换主题时，播放器自动跟着变色。
零额外代码。

## 收尾

音乐这种事，**少即是多**。
一首循环听一周，比塞 100 首你不会点开的好。

我的歌单里目前只有 8 首，循环播放，不焦虑。
`,"/src/data/posts/hologram-style.md":`---
title: 给博客加一层全息投影
slug: hologram-style
date: 2026-06-01
tag: 设计
tags: [CSS, 设计, 前端]
cover: https://picsum.photos/seed/hologram-style/1200/600
excerpt: 当 CSS 的 backdrop-filter 遇见 sci-fi 美学，会擦出怎样的火花？本文从零搭建一个"星轨之间"风格的视觉系统。
readTime: 15
pinned: false
---

# 给博客加一层全息投影

做这个博客之前，我翻遍了 Dribbble、Behance、Pinterest。
最后发现一件事：

> **好看的网站，都不像 SaaS 模板。**

它们都有点"过度设计"——
角标、扫描线、网格、HUD 装饰。
于是我决定，把游戏 UI 的那套"信息密度"搬到博客里。

## 第一步：定基调

我给自己定了三条规矩：

1. **绝不用紫色**（紫色看吐了）
2. **绝不用 Tailwind 默认色板**（看着像 AI 生成）
3. **背景必须有噪点**（纯色背景缺乏质感）

配色我直接抄了星穹铁道的金黑 + 一点点星蓝。
辅色用琥珀金，警示用锈黄，整体偏冷暖对比。

## 第二步：毛玻璃的"正确打开方式"

\`backdrop-filter\` 谁都会写，但要写好要注意 3 点：

\`\`\`css
.panel {
  background: rgba(20, 20, 28, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
\`\`\`

| 关键 | 作用 |
|------|------|
| \`rgba(...0.72)\` | 半透明 + 深色底，保证对比度 |
| \`blur(20px) saturate(180%)\` | 模糊 + 提饱和，玻璃质感 |
| 1px 边框 + 主题色 | 玻璃边缘的"折射感" |
| 阴影 + 微光 | 让面板"浮"起来 |

## 第三步：HUD 装饰不能堆

我第一版给每个面板都加了：

- 4 角小竖线
- 顶部 id 标牌
- 底部进度条
- 左侧状态点

结果整个页面像航天局发布会。
后来砍了一半，**只保留"最需要标识"的那个**。

> 装饰的本质是"对比"，不是"堆"。

## 第四步：动画用非线性

我所有过渡都禁用 \`ease-in-out\`。
改用：

\`\`\`css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
\`\`\`

前者用于**入场**（"嗖"一下到位），后者用于**交互**（按下回弹）。
禁用线性动画后，页面"高级感"立刻上来了。

## 第五步：响应式别偷懒

桌面端好看的，毛玻璃一上手机就糊成一片。
我的解法：

- 768px 以下：去掉 backdrop-filter，改用实色 + 边框
- 玻璃面板的内边距同步缩小 30%
- 角标从 16px 缩到 10px

\`\`\`css
@media (max-width: 768px) {
  .panel {
    background: var(--bg-base);
    backdrop-filter: none;
    padding: 20px;
  }
}
\`\`\`

## 几个有用的"作弊码"

### 噪点 SVG

\`\`\`css
--noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
\`\`\`

直接 inline，省一个 HTTP 请求。

### 网格背景

\`\`\`css
--grid: linear-gradient(rgba(212, 175, 55, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212, 175, 55, 0.04) 1px, transparent 1px);
\`\`\`

配合 \`background-size: 60px 60px\`，科技感拉满。

### 渐隐遮罩

Hero 背景图太大？我用 \`mask-image\` 做径向羽化：

\`\`\`css
.hero {
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 40%, transparent 100%);
}
\`\`\`

4 边自然融入 body 背景，**不需要切图，不需要画 PNG**。

## 写在最后

设计这事没有"标准答案"。
我花了 3 周才把首页改顺眼，期间推翻了 5 个版本。
但每一次推翻，都更接近"我想要的"。

> **设计不是一次画完的，是改完的。**
`,"/src/data/posts/letter-to-future-self.md":`---
title: 写给一年后的自己
slug: letter-to-future-self
date: 2026-04-15
tag: 随笔
tags: [随笔, 生活, 思考]
cover: https://picsum.photos/seed/letter-future/1200/600
excerpt: 你现在做的这些事，一年后回头看，可能很蠢，也可能很对。但不管怎样，记住这一刻。
readTime: 5
pinned: false
---

# 写给一年后的自己

嘿，一年后的我。

你现在还记得今天吗？
大概不记得了。人就是这样的。

## 一些我想让你记得的事

你最近在折腾**一个博客**。
不是工作需要，不是为了变现，
就是突然想有个地方，能说点"正经话之外"的东西。

你花了一周选主题，纠结要不要用紫色（最后没用）。
你花了三天写一个打字机效果（因为觉得酷）。
你被一个响应式 bug 折磨了一晚上（最后是 \`viewport\` 没加 meta）。

> 你看，你就是这样的——**愿意为"小而美"的东西死磕**。

## 一些我想问你的事

1. 你还在写吗？
2. 你现在的工作还在做吗？
3. 你有没有变成你讨厌的大人？
4. 你还听那些歌吗？
5. 你还……快乐吗？

## 一些我希望你做到的事

- **别熬夜**。我知道你会不听，但还是要说。
- **别为了 KPI 写代码**。写代码是为了表达。
- **别忘了为什么开这个博客**。如果忘了，就来翻翻这页。
- **别假装自己很懂**。不懂就老实说不懂。
- **对身边的人好点**。代码可以重写，人不行。

## 关于这个博客

我希望一年后回来看，
发现它还在。
可能更新得慢，可能半年一篇，
但**它没关**。

这就够了。

> 互联网上的内容，绝大多数活不过一年。
> 我希望这个博客能活过十年。

## 写在最后

一年后的你，大概会觉得现在的你很青涩。
没关系。

**青涩不是缺点，是你还活着的证据。**

—— 写于 2026 年春天的某个午后
`,"/src/data/posts/stellar-self.md":`---
title: 在星轨之间寻找自己
slug: stellar-self
date: 2026-06-12
tag: 随笔
tags: [随笔, 生活, 思考]
cover: https://picsum.photos/seed/stellar-self/1200/600
excerpt: 星辰不会回答，但你会发现自己。这是一篇关于个人成长与代码哲学的随笔，写在重构项目的某个深夜。
readTime: 8
pinned: true
---

# 在星轨之间寻找自己

凌晨三点，IDE 还亮着，窗外是看不见的星。
我合上电脑，盯着天花板上空调指示灯那一小块绿色发呆。

总有人在问：你写的代码，是为了什么？

## 不是为了 KPI

我承认，最开始敲代码，是因为工资还行。
后来发现，敲代码这件事本身，比工资更让人上头。

> 一行能跑、十行能看、百行能改、千行能写
> 这是我从老程序员那里偷来的四句话

我把它写在便签上，贴在屏幕边上。
每次想偷懒，就看一眼。

## 写代码与写文章

写文章和写代码其实是一回事。
你都得：

- 想清楚要说什么
- 删掉那些看起来很酷但没人看的废话
- 给下一个读它的人留条路

所以我开了一个博客。
不是为了给别人看，是为了**让自己说的话能留下来**。

## 三个不打算做的事

1. 不追热点
2. 不做日更
3. 不立 flag

只写**我此刻真觉得有意思**的事。
哪怕一个月才一篇，哪怕没人看。

## 写在最后

如果有一天，这个博客真的被某个陌生人点开，
我希望他看到的不是"又一个技术博客"，
而是——

> "啊，这个人还挺真实的。"

这就够了。
`,"/src/data/posts/vue3-composables.md":`---
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

从 Options 到 Composition，最让人兴奋的不是 \`setup\`，是 **composables**。
它把"逻辑"从"组件"里抽出来，终于可以像工具函数一样被复用、被测试、被丢弃。

## 一切从一个打字机开始

我博客首页需要一段打字机效果。
第一版我写在组件里，看着就 30 行，第二版我抽了出来：

\`\`\`js
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
\`\`\`

调用方只需要一个 ref 加一句话：

\`\`\`vue
<script setup>
import { ref } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

const el = ref(null)
useTypewriter(el, '你好，星轨之间。', { speed: 80 })
<\/script>

<template>
  <span ref="el"></span>
</template>
\`\`\`

干净得让人想哭。

## 几个被反复验证的规则

### 1. 命名必须以 \`use\` 开头

不是约束，是约定。\`useClock\`、\`useWeather\` 一眼就知道它是 composable。

### 2. 入参尽量支持 ref

\`\`\`js
export function usePosts(source) {
  const list = computed(() =>
    typeof source === 'function' ? source() : unref(source)
  )
  // ...
}
\`\`\`

让调用方传字符串、传 ref、传 getter 都行。

### 3. 副作用必须自己清理

Composable 是"挂载即生效"的东西，但调用方可能动态卸载。
所以**定时器、事件监听、IntersectionObserver**，全部要在 \`onBeforeUnmount\` 里清掉。

### 4. 返回值用 reactive 包好

\`\`\`js
return {
  time: readonly(time),       // 不希望外部改
  weather,                    // 让外部能 watch
  loading,                    // 状态要暴露
  refresh,                    // 给用户手动触发的入口
}
\`\`\`

## 一些"别这样写"

| 错误 | 为什么 |
|------|--------|
| 在 composable 里 \`import { useRouter }\` 然后硬塞业务 | 应该让调用方传 |
| 把组件模板 JSX 写进 composable | 它不是 hook，是工具 |
| 异步初始化用顶层 \`await\` | 会阻塞 setup，建议用 \`onMounted\` + 状态 |

## 写一个天气 composable 练手

我博客要显示当地天气，Open-Meteo 免 API Key，正好拿来练手：

\`\`\`js
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useWeather({ lat = 31.23, lon = 121.47, name = '上海' } = {}) {
  const data = ref({ temp: null, text: '加载中…' })

  async function fetch() {
    const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current_weather=true\`
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
\`\`\`

我已经在博客顶部用上了它。

## 结尾

Composable 不是什么黑魔法，它就是：

> **把"状态 + 副作用"打包成一个函数，组件用一行代码拿走。**

下次你想写 \`data() {}\` 之前，先问问自己：
这段逻辑，能不能抽成一个 \`useXxx\`？
`})).map(([e,t])=>{let{data:n,content:i}=r(String(t)),a=n.slug||e.split(`/`).pop().replace(/\.md$/,``);return{...n,slug:a,raw:i,to:`/blog/${a}`}}).sort((e,t)=>!!e.pinned==!!t.pinned?new Date(t.date)-new Date(e.date):e.pinned?-1:1),a=t(i),o=n(()=>{let e=new Set;for(let t of i)Array.isArray(t.tags)&&t.tags.forEach(t=>e.add(t));return Array.from(e)}),s=n(()=>{let e={};for(let t of i)if(Array.isArray(t.tags))for(let n of t.tags)e[n]=(e[n]||0)+1;return e});function c(e){return i.find(t=>t.slug===e)||null}function l(e){return!e||e===`ALL`?i:i.filter(t=>Array.isArray(t.tags)&&t.tags.includes(e))}function u(e){let t=i.findIndex(t=>t.slug===e);return t===-1?{prev:null,next:null}:{prev:t>0?i[t-1]:null,next:t<i.length-1?i[t+1]:null}}function d(){return{posts:e(a),tags:o,tagCounts:s,getBySlug:c,byTag:l,adjacent:u}}export{d as t};