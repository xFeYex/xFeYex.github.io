// About 页扩展数据
// 与 profile.js 平行，单独放避免 profile 越来越胖
// 仪表盘岛屿：身份、经历、技能、兴趣

export const identity = {
  name: '徐炜',
  nameEn: 'XUWEI',
  handle: '@xuwei.dev',
  pronouns: 'he/him',
  location: '中国大陆',
  timezone: 'UTC+8 (CST)',
  languages: ['中文 (母语)', 'English (工作语言)'],
}

export const bio = {
  short: '在星轨之间写代码。',
  long: '前端工程师，Vue 忠实用户，3 年 CSS 摆烂经验。\n喜欢在深夜写代码，听点 lo-fi / 游戏 OST，\n偶尔画画分镜、写写小说。\n个人哲学：先做能用的，再做好看的，最后做有意义的。',
  philosophy: '代码的本质是给别人看的，包括未来的自己。',
}

export const journey = [
  {
    period: '2024.08 — 至今',
    role: '前端工程师',
    org: '某中型互联网公司',
    desc: '负责后台中台、组件库建设；推动 4 套主题切换落地。',
    current: true,
  },
  {
    period: '2023.06 — 2024.07',
    role: '全栈开发 (实习 + 校招)',
    org: '某电商 SaaS',
    desc: 'Vue 3 + Node.js + MySQL；主攻可视化大屏。',
  },
  {
    period: '2019.09 — 2023.06',
    role: '计算机科学 本科',
    org: '某 211 高校',
    desc: 'GPA 3.6/4.0，校 ACM 队，毕设做的是分子动力学可视化。',
  },
]

export const skills = [
  {
    group: '前端',
    icon: 'mdi:monitor-dashboard',
    items: [
      { name: 'Vue 3 / Nuxt', level: 95, note: '3 年深度使用' },
      { name: 'TypeScript', level: 85, note: '可维护大型项目' },
      { name: 'CSS / SCSS', level: 92, note: '会写动画、变量、容器查询' },
      { name: 'Vite / Webpack', level: 80, note: '能调 Rollup 插件' },
    ],
  },
  {
    group: '后端',
    icon: 'mdi:server',
    items: [
      { name: 'Node.js', level: 78, note: 'Express / Fastify' },
      { name: 'Python', level: 75, note: 'FastAPI / 科研脚本' },
      { name: 'MySQL / PostgreSQL', level: 70, note: '会写复杂 JOIN' },
    ],
  },
  {
    group: '工具',
    icon: 'mdi:toolbox-outline',
    items: [
      { name: 'Git', level: 88, note: 'rebase / bisect 熟练' },
      { name: 'Figma', level: 65, note: '够用即可' },
      { name: 'Vim', level: 50, note: '离不开的方向键' },
    ],
  },
]

export const interests = [
  { icon: 'mdi:gamepad-variant-outline', name: '单机游戏', desc: 'JRPG / 银河恶魔城' },
  { icon: 'mdi:book-open-page-variant', name: '读技术书', desc: '《代码大全》《设计模式》' },
  { icon: 'mdi:music-note', name: 'OST', desc: '游戏 / 电影原声' },
  { icon: 'mdi:movie-open-outline', name: '动画', desc: '新房昭之 / 汤浅政明' },
  { icon: 'mdi:camera-outline', name: '扫街拍照', desc: '胶片为主' },
  { icon: 'mdi:bicycle', name: '夜骑', desc: '凌晨 2 点的城市' },
]

export const stacks = [
  { name: 'Vue 3', color: '#42b883' },
  { name: 'Vite 8', color: '#646cff' },
  { name: 'CSS Variables', color: '#2965f1' },
  { name: 'Markdown', color: '#7c4dff' },
  { name: 'Iconify', color: '#1769aa' },
  { name: 'Vue Router 4', color: '#35495e' },
]
