// 个人名片数据
// Phase 2: 静态数据；Phase 5: 可接入 admin 界面

export const profile = {
  // 头像
  avatar: 'https://picsum.photos/seed/xuwei/240/240',
  avatarFallback: '✦',

  // 名字
  name: '徐炜',
  nameEn: 'XUWEI',
  handle: '@xuwei.dev',
  title: '探索者 / DEVELOPER',
  titleCn: '代码 · 音乐 · 星辰',

  // 一句话介绍
  bio: '在星轨之间，写点代码、听点歌、偶尔碎碎念。',
  bioShort: '在星轨之间写代码。',

  // 统计
  stats: [
    { label: '文章', labelEn: 'POSTS', value: 22, suffix: '篇' },
    { label: '动态', labelEn: 'MOMENTS', value: 17, suffix: '条' },
    { label: '项目', labelEn: 'PROJECTS', value: 5, suffix: '个' },
  ],

  // 社交入口
  socials: [
    { id: 'github', name: 'GitHub', icon: 'mdi:github', url: 'https://github.com/' },
    { id: 'email', name: 'Email', icon: 'mdi:email-outline', url: 'mailto:hi@xuwei.dev' },
    { id: 'qq', name: 'QQ', icon: 'mdi:qqchat', url: '#' },
    { id: 'wechat', name: '微信', icon: 'mdi:wechat', url: '#' },
    { id: 'bilibili', name: 'B站', icon: 'simple-icons:bilibili', url: 'https://bilibili.com' },
    { id: 'twitter', name: 'X', icon: 'mdi:twitter', url: 'https://twitter.com' },
  ],

  // 按钮
  buttons: [
    { label: '了解更多', to: '/about', variant: 'ghost' },
    { label: '联系合作', to: '/links', variant: 'primary' },
  ],
}
