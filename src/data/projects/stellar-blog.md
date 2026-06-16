---
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

- **框架**：Vue 3（Composition API + `<script setup>`）
- **构建**：Vite 8
- **路由**：vue-router 4
- **样式**：原生 CSS（4 套主题切换 + 大量 CSS 变量）
- **Markdown**：marked + highlight.js
- **图标**：Iconify

## 设计决策

1. **不写紫色**。游戏 UI 用黄铜、琥珀、星蓝、深绿，比 SaaS 蓝紫高级 10 倍。
2. **背景必须有噪点**。SVG 内联，无 HTTP 请求。
3. **动效用非线性 easing**。`cubic-bezier(0.16, 1, 0.3, 1)` 是好哥们。

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
