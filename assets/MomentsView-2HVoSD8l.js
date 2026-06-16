import{t as e}from"./useMarkdown-U6DSD9KU.js";import{A as t,F as n,M as r,P as i,S as a,c as o,g as s,h as c,j as l,l as u,n as d,p as f,t as p,u as m,x as h}from"./index-DXI_ny0r.js";import{t as g}from"./frontmatter-BfD-LpMS.js";var _=Object.entries(Object.assign({"/src/data/moments/2026-05-08-game.md":`---
date: 2026-05-08
icon: mdi:gamepad-variant-outline
mood: ♪
---

把《星穹铁道》主线打通了。

丹恒 · 饮月太强了。
`,"/src/data/moments/2026-05-15-book.md":`---
date: 2026-05-15
icon: mdi:book-open-page-variant
mood: ✦
---

《代码大全》读到第 8 章。

> 软件构建的核心，是管理复杂度。

记住了。
`,"/src/data/moments/2026-05-22-rain.md":`---
date: 2026-05-22
icon: mdi:weather-night
mood: ☾
---

下了一晚上的雨。

适合窝在被子里写博客。
`,"/src/data/moments/2026-05-30-usetheme.md":`---
date: 2026-05-30
icon: mdi:code-tags
mood: ✦
---

终于把 \`useTheme\` 写完了。

4 套主题、9 个 CSS 变量、可运行时切换。
用的是 CSS 变量 \`style.setProperty\`，
比 Vite 主题插件简单太多。
`,"/src/data/moments/2026-06-05-hero.md":`---
date: 2026-06-05
icon: mdi:image-edit-outline
mood: ☼
---

把 hero 改成了渐变收尾，背景不再突兀。

之前是直接 \`linear-gradient(180deg, #000, transparent)\`，
太硬了。
现在用径向 + 噪点叠加，过渡自然。
`,"/src/data/moments/2026-06-10-music.md":`---
date: 2026-06-10
icon: mdi:music-note
mood: ♪
---

听了 30 遍《星间旅行》，耳朵要怀孕了。

\`/music-player\` 组件已经写完，
等 Phase 5 接进博客浮窗。
`,"/src/data/moments/2026-06-13-theme.md":`---
date: 2026-06-13
icon: mdi:palette-outline
mood: ✦
---

新主题崩坏星穹铁道上线了，4 套主题可切换。

试了一下"终末地"主题的黄铜配琥珀，
比之前那套 SaaS 蓝紫高级 10 倍。
`,"/src/data/moments/2026-06-14-refactor.md":`---
date: 2026-06-14
icon: mdi:star-shooting-outline
mood: ✦
---

在重构项目，代码与星辰同在。

刚把 usePosts 和 useProjects 抽成同一套 frontmatter 解析，舒服。
`})).map(([e,t])=>{let{data:n,content:r}=g(String(t));return{id:e.split(`/`).pop().replace(/\.md$/,``),date:n.date,icon:n.icon||`mdi:circle-small`,mood:n.mood||``,content:r.trim()}}).sort((e,t)=>new Date(t.date)-new Date(e.date)),v=l(_),y=u(()=>({total:_.length,thisMonth:_.filter(e=>{let t=new Date(e.date),n=new Date;return t.getFullYear()===n.getFullYear()&&t.getMonth()===n.getMonth()}).length,thisYear:_.filter(e=>new Date(e.date).getFullYear()===new Date().getFullYear()).length}));function b(){return{moments:t(v),stats:y}}var x={class:`moments-view`},S={class:`moments-hero`},C={class:`hero-grid`},w={class:`hero-main`},T={class:`hero-desc`},E={class:`text-accent`},D={class:`text-accent`},O={class:`hero-aside`},k={class:`aside-stat`},A={class:`stat-num font-display`},j={class:`aside-stat`},M={class:`stat-num font-display`},N={class:`aside-stat`},P={class:`stat-num font-display`},F={key:0,class:`moments-stream`},I={class:`moment-rail`},L={class:`rail-date font-tech`},R={class:`moment-body`},z={class:`moment-head`},B={class:`mood`,"aria-hidden":`true`},V={class:`moment-icon`,"aria-hidden":`true`},H={class:`moment-time font-tech`},U=[`innerHTML`],W={key:1,class:`empty`},G={class:`empty-icon`},K=d({__name:`MomentsView`,setup(t){let{moments:l,stats:u}=b(),{render:d}=e();function g(e){return d(e).html}function _(e){let t=new Date(e);return isNaN(t)?e:`${t.getFullYear()}.${String(t.getMonth()+1).padStart(2,`0`)}.${String(t.getDate()).padStart(2,`0`)}`}function v(e){let t=new Date(e);if(isNaN(t))return``;let n=Date.now()-t.getTime(),r=864e5;return n<r?`今天`:n<r*2?`昨天`:n<r*7?`${Math.floor(n/r)} 天前`:n<r*30?`${Math.floor(n/(r*7))} 周前`:n<r*365?`${Math.floor(n/(r*30))} 月前`:`${Math.floor(n/(r*365))} 年前`}return(e,t)=>(h(),f(`div`,x,[m(`section`,S,[t[14]||=m(`div`,{class:`hud-corner tl`},null,-1),t[15]||=m(`div`,{class:`hud-corner tr`},null,-1),t[16]||=m(`div`,{class:`hud-corner bl`},null,-1),t[17]||=m(`div`,{class:`hud-corner br`},null,-1),m(`div`,C,[m(`div`,w,[t[9]||=m(`div`,{class:`hero-tag font-tech`},`// MOMENTS // FEED`,-1),t[10]||=m(`h1`,{class:`hero-title`},[m(`span`,{class:`title-cn`},`短频快记`),m(`span`,{class:`title-en`},`/ MOMENTS`)],-1),m(`p`,T,[t[0]||=c(` 想到什么写两句。`,-1),t[1]||=m(`br`,null,null,-1),t[2]||=c(` 读 / 玩 / 听 / 写，`,-1),t[3]||=m(`br`,null,null,-1),t[4]||=c(` 一切琐碎都在这。`,-1),t[5]||=m(`br`,null,null,-1),t[6]||=c(` 全部 `,-1),m(`span`,E,n(r(u).total),1),t[7]||=c(` 条， 本月新发 `,-1),m(`span`,D,n(r(u).thisMonth),1),t[8]||=c(` 条。 `,-1)])]),m(`div`,O,[m(`div`,k,[m(`div`,A,n(r(u).total),1),t[11]||=m(`div`,{class:`stat-label font-tech`},`TOTAL`,-1)]),m(`div`,j,[m(`div`,M,n(r(u).thisMonth),1),t[12]||=m(`div`,{class:`stat-label font-tech`},`THIS MONTH`,-1)]),m(`div`,N,[m(`div`,P,n(r(u).thisYear),1),t[13]||=m(`div`,{class:`stat-label font-tech`},`THIS YEAR`,-1)])])])]),r(l).length?(h(),f(`section`,F,[(h(!0),f(o,null,a(r(l),(e,a)=>(h(),f(`article`,{key:e.id,class:`moment-card`,style:i({animationDelay:a*.05+`s`})},[m(`div`,I,[m(`div`,L,n(_(e.date)),1),t[18]||=m(`div`,{class:`rail-dot`},null,-1),t[19]||=m(`div`,{class:`rail-line`},null,-1)]),m(`div`,R,[m(`div`,z,[m(`span`,B,n(e.mood),1),m(`span`,V,[s(r(p),{icon:e.icon},null,8,[`icon`])]),m(`span`,H,n(v(e.date)),1)]),m(`div`,{class:`moment-content`,innerHTML:g(e.content)},null,8,U),t[20]||=m(`div`,{class:`moment-foot`},[m(`span`,{class:`foot-tag font-tech`},`// MOMENT`)],-1)])],4))),128))])):(h(),f(`section`,W,[m(`div`,G,[s(r(p),{icon:`mdi:ghost-outline`})]),t[21]||=m(`p`,{class:`empty-text`},`没有动态，先去忙别的吧。`,-1)]))]))}},[[`__scopeId`,`data-v-2553ff23`]]);export{K as default};