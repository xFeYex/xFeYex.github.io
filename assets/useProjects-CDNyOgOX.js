import{A as e,j as t,l as n}from"./index-DXI_ny0r.js";import{t as r}from"./frontmatter-BfD-LpMS.js";var i=Object.entries(Object.assign({"/src/data/projects/acg-shelf.md":`---
title: 个人 ACG 收藏夹
slug: acg-shelf
date: 2024-08-30
status: 维护中
type: external
externalUrl: https://bgm.tv
cover: https://picsum.photos/seed/proj-acg/800/450
excerpt: 用 Bangumi 记录追番、看番、补番的流水账。已记 287 部。
tags: [ACG, 收藏, 追番]
featured: false
---

# 个人 ACG 收藏夹

从大二开始用 Bangumi 记录，至今 287 部。

## 我的评分习惯

- **9-10**：看完想立刻二刷的
- **7-8**：好看的，不看会可惜
- **5-6**：能看，但不会安利
- **< 5**：烂，标记完不再打开

## 私心推荐

- 来自深渊
- 孤独摇滚
- 赛马娘 第二季
- 葬送的芙莉莲

> 不接受"被神作"PUA，**好看就是好看，不好看就不好看**。
`,"/src/data/projects/gromacs-rmsf.md":`---
title: Computational Chemistry Tool
slug: gromacs-rmsf
date: 2025-09-12
status: 已开源
type: external
externalUrl: https://github.com/xuwei-dev/gromacs-rmsf
cover: https://picsum.photos/seed/proj-gromacs/800/450
excerpt: 整合 GROMACS 分子动力学模拟的 RMSF 分析流程，附 WSL2 环境配置脚本。
tags: [科研, Python, Bash, GROMACS]
featured: true
---

# Computational Chemistry Tool

实验室折腾的副产物。
本作者使用 WSL2（Ubuntu 22）跑 GROMACS，这一套脚本是日常流水线。
`,"/src/data/projects/hologram-system.md":`---
title: 全息投影风格系统
slug: hologram-system
date: 2026-03-08
status: 实验
type: internal
cover: https://picsum.photos/seed/proj-hologram/800/450
excerpt: 一套"星轨之间"风格的 CSS 变量 + 装饰组件库。可独立打包给别的项目用。
tags: [CSS, 设计, 设计系统]
featured: false
---

# 全息投影风格系统

把"星轨之间"的视觉系统抽出来，做成可复用的设计 token。

## 包含

- 4 套主题的 CSS 变量文件
- 装饰组件：HUD 角标、扫描线、噪点、网格
- 通用 utility：毛玻璃面板、发光描边

## 设计原则

> 装饰的本质是"对比"，不是"堆"。

每一处装饰都要回答一个问题：
**它在凸显什么？**

如果答不上来，就删掉。
`,"/src/data/projects/music-player.md":`---
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
- **进度条节流**。\`timeupdate\` 触发太频繁，250ms 节流
- **切歌预加载**。\`preload="metadata"\` 让切换秒开

## 详细实现

见文章《把歌单搬进博客：毛玻璃播放器的诞生》。
`,"/src/data/projects/stellar-blog.md":`---
title: 星轨之间
slug: stellar-blog
date: 2026-06-15
status: 在写
type: internal
cover: https://picsum.photos/seed/proj-stellar/800/450
excerpt: 正在写的这个博客本身。Vue 3 + 4 套游戏化主题 + 毛玻璃 + Markdown 渲染。
tags: [Vue, Vite, CSS, 博客]
featured: true
---

# 星轨之间（本站）

## 是什么

一个"反主流"个人博客。
配色、布局、组件、动效，**全部自己造**。
不追 SaaS 模板，不抄 Tailwind 默认色板。

## 技术栈

- **框架**：Vue 3（Composition API + \`<script setup>\`）
- **构建**：Vite 8
- **路由**：vue-router 4
- **样式**：原生 CSS（4 套主题切换 + 大量 CSS 变量）
- **Markdown**：marked + highlight.js
- **图标**：Iconify

## 设计决策

1. **不写紫色**。游戏 UI 用黄铜、琥珀、星蓝、深绿，比 SaaS 蓝紫高级 10 倍。
2. **背景必须有噪点**。SVG 内联，无 HTTP 请求。
3. **动效用非线性 easing**。\`cubic-bezier(0.16, 1, 0.3, 1)\` 是好哥们。

## 当前进度

- [x] Phase 1：项目骨架 + 4 套主题
- [x] Phase 2：首页核心 UI
- [x] Phase 3：文章系统
- [ ] Phase 4：动态 / 归档 / 关于 / 友链
- [ ] Phase 5：增强（音乐 / 国际化 / 移动端）
- [ ] Phase 6：剩余主题适配
- [ ] Phase 7：动效 + 响应式 + 部署

## 写在最后

做这个博客不是为了"学 Vue"。
是为了**给自己留把钥匙**。
`,"/src/data/projects/xinghui-cloud.md":`---
title: XingHuiSama の Cloud
slug: xinghui-cloud
date: 2025-06-04
status: 在线
type: external
externalUrl: https://www.xinghuisama.top
cover: https://picsum.photos/seed/proj-cloud/800/450
excerpt: 基于 Next.js App Router 的全栈个人博客。Framer Motion 动效 + 毛玻璃 UI + 悬浮音乐播放器。
tags: [Next.js, React, TypeScript, Tailwind]
featured: true
---

# XingHuiSama の Cloud

朋友的全栈博客。
Next.js App Router + Framer Motion + 毛玻璃 UI。
我博客视觉风格的灵感来源之一。
`})).map(([e,t])=>{let{data:n,content:i}=r(String(t)),a=n.slug||e.split(`/`).pop().replace(/\.md$/,``);return{...n,slug:a,raw:i,to:`/projects/${a}`,href:n.type===`external`?n.externalUrl:`/projects/${a}`}}).sort((e,t)=>!!e.featured==!!t.featured?new Date(t.date)-new Date(e.date):e.featured?-1:1),a=t(i),o=n(()=>{let e=i.filter(e=>e.type===`internal`).length,t=i.filter(e=>e.type===`external`).length;return{total:i.length,internal:e,external:t}});function s(e){return i.find(t=>t.slug===e)||null}function c(){return{projects:e(a),stats:o,getBySlug:s}}export{c as t};