---
title: Music Player 浮窗
slug: music-player
date: 2025-12-20
status: 完成
type: internal
cover: https://picsum.photos/seed/proj-music/800/450
excerpt: 0 依赖的毛玻璃音乐浮窗组件。歌单写在 JSON 里，8 首歌循环播放。
tags: [Vue, CSS, 音乐]
featured: false
---

# Music Player 浮窗

博客右下角的浮窗播放器。

## 需求

- 0 第三方 SDK
- 歌单 JSON 配置
- 8 首歌循环
- 移动端隐藏

## 几个关键决策

- **不自动播**。iOS Safari 永远不让你自动播，索性直接不显示播放器
- **进度条节流**。`timeupdate` 触发太频繁，250ms 节流
- **切歌预加载**。`preload="metadata"` 让切换秒开

## 详细实现

见文章《把歌单搬进博客：毛玻璃播放器的诞生》。
