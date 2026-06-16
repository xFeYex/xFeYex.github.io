---
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
- 歌单写在 `playlist.json` 里，改了不用动代码
- 移动端能隐藏
- 第一次进来别自动播（浏览器会拦，体验更差）

## 数据结构

```json
[
  {
    "id": "stardust",
    "title": "星间旅行",
    "artist": "HOYO-MiX",
    "cover": "https://picsum.photos/seed/m1/200",
    "src": "https://example.com/audio/stardust.mp3"
  }
]
```

简单到不能再简单。

## 浮窗组件

骨架就是个按钮 + 一个面板：

```vue
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
```

## 几个坑

### 1. 第一次播放必须用户触发

`audio.play()` 在没用户手势时会报 `NotAllowedError`。
解法：第一次只 `load()`，等用户点"播放"再 `play()`。

### 2. iOS Safari 的 autoplay 策略

iOS 永远不让你自动播。
我索性在检测到 iOS 时，**直接不显示播放器**——博客不差这一个功能。

### 3. 进度条要节流

`timeupdate` 触发太频繁，250ms 节流一次够用：

```js
audio.addEventListener('timeupdate', throttle(update, 250))
```

### 4. 切歌要预加载

```js
const next = new Audio(playlist[(idx + 1) % playlist.length].src)
next.preload = 'metadata'
```

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
