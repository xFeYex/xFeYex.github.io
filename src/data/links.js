// 友链数据
//  - 分类（group）控制堆叠卡顺序
//  - 卡片布局：每个 group 是一个堆叠 stack，每张卡片用 group 内的 name 排序
//  - featured: true 在 group 顶部置顶

export const linkGroups = [
  {
    id: 'friend',
    name: '挚友',
    nameEn: 'BEST FRIENDS',
    icon: 'mdi:heart-outline',
    accent: 'var(--accent)',
    desc: '现实里能聊得来的朋友。',
  },
  {
    id: 'inspiration',
    name: '灵感来源',
    nameEn: 'INSPIRATION',
    icon: 'mdi:lightbulb-outline',
    accent: 'var(--accent)',
    desc: '在设计 / 工程上影响过我的博客。',
  },
  {
    id: 'tech',
    name: '技术社区',
    nameEn: 'TECH BLOGS',
    icon: 'mdi:code-tags',
    accent: 'var(--accent)',
    desc: '常去的前端 / 工程博客。',
  },
  {
    id: 'life',
    name: '生活角落',
    nameEn: 'LIFE',
    icon: 'mdi:coffee-outline',
    accent: 'var(--accent)',
    desc: '记录生活、写得真实的人。',
  },
]

export const links = [
  // ----- 挚友 -----
  {
    group: 'friend',
    name: 'XingHuiSama の 宝藏之地',
    url: 'https://www.xinghuisama.top',
    avatar: 'https://picsum.photos/seed/link-xinghui/200/200',
    desc: '全栈开发，毛玻璃风深度爱好者。本站视觉风格的灵感来源之一。',
    featured: true,
    tags: ['Next.js', 'Framer Motion'],
  },
  {
    group: 'friend',
    name: '小埋の日常',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-umao/200/200',
    desc: '大学室友，写 Rust 比我写 Vue 还溜。',
    tags: ['Rust', '后端'],
  },

  // ----- 灵感来源 -----
  {
    group: 'inspiration',
    name: 'Hines Romes',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-hines/200/200',
    desc: '深色系 / 排版狂魔，每一张图都像杂志内页。',
    tags: ['设计', '排版'],
  },
  {
    group: 'inspiration',
    name: '夜航船',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-night/200/200',
    desc: '个人博客的 1.0 范本，沉静到极致。',
    tags: ['博客', '极简'],
  },

  // ----- 技术社区 -----
  {
    group: 'tech',
    name: 'Vue 官方文档',
    url: 'https://cn.vuejs.org',
    avatar: 'https://picsum.photos/seed/link-vue/200/200',
    desc: '3.x 写得很友好，Cookbook 解决了我 80% 的问题。',
    tags: ['Vue', '官方'],
  },
  {
    group: 'tech',
    name: 'V8 引擎博客',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-v8/200/200',
    desc: '理解编译优化的第一手资料。',
    tags: ['JS', '性能'],
  },
  {
    group: 'tech',
    name: 'web.dev',
    url: 'https://web.dev',
    avatar: 'https://picsum.photos/seed/link-webdev/200/200',
    desc: 'Google 出的 Web 现代化教程。',
    tags: ['Web', '教程'],
  },

  // ----- 生活角落 -----
  {
    group: 'life',
    name: '半夜不睡觉',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-late/200/200',
    desc: '凌晨 2 点的城市，由一个失眠的摄影师记录。',
    tags: ['摄影', '随笔'],
  },
  {
    group: 'life',
    name: '一碗凉面',
    url: '#',
    avatar: 'https://picsum.photos/seed/link-cold/200/200',
    desc: '记录厨房里的失败与偶尔的成功。',
    tags: ['美食', '日记'],
  },
]

export const applyInfo = {
  title: '也想出现在这里？',
  desc: '欢迎互换友链。先保证站点内容健康、有持续更新，至少 5 篇原创。',
  bullets: [
    '博客类、内容站优先',
    '不收工具页 / 网赚 / 赌博 / 棋牌',
    '联系时请附上站点名 / 简介 / 头像',
  ],
  ctaLabel: '提 交 友 链',
}
