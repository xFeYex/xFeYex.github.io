---
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

`backdrop-filter` 谁都会写，但要写好要注意 3 点：

```css
.panel {
  background: rgba(20, 20, 28, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

| 关键 | 作用 |
|------|------|
| `rgba(...0.72)` | 半透明 + 深色底，保证对比度 |
| `blur(20px) saturate(180%)` | 模糊 + 提饱和，玻璃质感 |
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

我所有过渡都禁用 `ease-in-out`。
改用：

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

前者用于**入场**（"嗖"一下到位），后者用于**交互**（按下回弹）。
禁用线性动画后，页面"高级感"立刻上来了。

## 第五步：响应式别偷懒

桌面端好看的，毛玻璃一上手机就糊成一片。
我的解法：

- 768px 以下：去掉 backdrop-filter，改用实色 + 边框
- 玻璃面板的内边距同步缩小 30%
- 角标从 16px 缩到 10px

```css
@media (max-width: 768px) {
  .panel {
    background: var(--bg-base);
    backdrop-filter: none;
    padding: 20px;
  }
}
```

## 几个有用的"作弊码"

### 噪点 SVG

```css
--noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
```

直接 inline，省一个 HTTP 请求。

### 网格背景

```css
--grid: linear-gradient(rgba(212, 175, 55, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212, 175, 55, 0.04) 1px, transparent 1px);
```

配合 `background-size: 60px 60px`，科技感拉满。

### 渐隐遮罩

Hero 背景图太大？我用 `mask-image` 做径向羽化：

```css
.hero {
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 40%, transparent 100%);
}
```

4 边自然融入 body 背景，**不需要切图，不需要画 PNG**。

## 写在最后

设计这事没有"标准答案"。
我花了 3 周才把首页改顺眼，期间推翻了 5 个版本。
但每一次推翻，都更接近"我想要的"。

> **设计不是一次画完的，是改完的。**
