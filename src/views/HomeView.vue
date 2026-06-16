<template>
  <div class="home snap-page">
    <!-- Hero 占满首屏 -->
    <section class="hero">
      <div class="hero-banner">
        <div class="particles" ref="particlesRef"></div>
        <div class="hero-fade"></div>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-tag">
            <span class="dot"></span>
            <span class="font-tech">// EXPLORER PROFILE //</span>
          </div>
          <div class="hero-slogan">
            <span class="slogan-line font-tech">// {{ $t('hero.sloganEn') }}</span>
            <span class="slogan-cn">{{ $t('hero.slogan') }}</span>
            <span class="slogan-stars" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span>
            </span>
          </div>
          <h1 class="hero-title">
            <span class="hero-title-cn">{{ $t('hero.titleCn') }}</span>
            INTO THE<br>
            <span class="gradient-text">STELLARON</span>
          </h1>
          <div class="hero-subtitle font-tech">CODE · MUSIC · COSMOS</div>
          <div class="typing-text">
            <span ref="typedRef"></span>
            <span class="cursor"></span>
          </div>
        </div>

        <div class="hero-aside">
          <ProfileCard />
        </div>
      </div>

      <!-- 滚动指示器（hero 底部，snap 后会被推到下一屏底部） -->
      <div class="hero-scroll-hint font-tech" aria-hidden="true">
        <span>SCROLL</span>
        <span class="line"></span>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="section">
      <SectionHeader
        title="最新文章"
        subtitle="RECENT POSTS"
        description="技术、随想、设计、ACG。慢慢写，慢慢想。"
        :index="1"
        link="/blog"
      />
      <div class="posts-grid">
        <PostCard
          v-for="(p, i) in recentPosts"
          :key="p.slug"
          :post="mapPost(p)"
          :size="i === 0 ? 'lg' : 'md'"
        />
      </div>
    </section>

    <!-- 站点统计已移除 -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import ProfileCard from '@/components/ProfileCard.vue'
import PostCard from '@/components/PostCard.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { usePosts } from '@/composables/usePosts'

const typedRef = ref(null)
const particlesRef = ref(null)

const { posts } = usePosts()

// 取前 3 篇作为首页"最新文章"
const recentPosts = posts.value.slice(0, 3)

function mapPost(p) {
  const dt = new Date(p.date)
  const date = isNaN(dt) ? '' : `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
  return { ...p, date, to: p.to || `/blog/${p.slug}` }
}

const message = '欢迎来到我的星轨。在代码与星辰之间，我记录所思所学。技术、ACG、随想、还有日常的碎碎念，都在这里。'
useTypewriter(typedRef, message, { speed: 60, delay: 600 })

let cleanups = []

function isSmallScreen() {
  return window.innerWidth < 769
}

onMounted(() => {
  nextTick(() => {
    // 桌面端启用整屏 snap；移动端禁用（更自然的长滚动）
    if (!isSmallScreen()) {
      document.documentElement.classList.add('snap-active')
      cleanups.push(() => document.documentElement.classList.remove('snap-active'))
    }
  })

  if (!particlesRef.value) return
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div')
    p.className = 'particle'
    p.style.left = Math.random() * 100 + '%'
    p.style.animationDelay = Math.random() * 6 + 's'
    p.style.animationDuration = 4 + Math.random() * 4 + 's'
    p.style.opacity = 0.3 + Math.random() * 0.5
    particlesRef.value.appendChild(p)
  }
})

onBeforeUnmount(() => {
  cleanups.forEach((fn) => fn())
  cleanups = []
})
</script>

<style scoped>
.home {
  position: relative;
  /* PPT 幻灯片式：每屏整页切换 */
  scroll-snap-type: y mandatory;
}

/* ============== Hero ============== */
.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  padding: 60px 0 60px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  /* 整屏吸附 */
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.hero-banner {
  position: absolute;
  inset: -120px -120px 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 70% at 65% 30%, var(--hero-grad-1) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 20% 70%, var(--hero-grad-2) 0%, transparent 70%),
    var(--hero-base);
  overflow: hidden;
  /* 边缘羽化：4 边 + 4 角做径向羽化，融入 body 背景 */
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%);
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%);
}
.hero-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--noise);
  opacity: 0.1;
  mix-blend-mode: overlay;
}
.hero-banner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg,
    transparent 0px, transparent 80px,
    var(--accent-faint) 80px, var(--accent-faint) 81px);
  opacity: 0.5;
  /* 网格线也跟着羽化 */
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%);
  mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%);
}
.hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(180deg,
    transparent 0%,
    transparent 50%,
    rgba(26, 26, 48, 0.6) 85%,
    var(--bg-deep) 100%);
  pointer-events: none;
  z-index: 1;
}

.particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
:deep(.particle) {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: float-up 6s linear infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}

.hero-text { position: relative; }
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--accent-faint);
  border: 1px solid var(--border-color);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 32px;
}
.hero-tag .dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s infinite;
}

/* ============== Hero Slogan ============== */
.hero-slogan {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0 14px 18px;
  margin-bottom: 18px;
  border-left: 2px solid var(--accent);
  background: linear-gradient(90deg, var(--accent-faint) 0%, transparent 60%);
  max-width: 540px;
}
.hero-slogan::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  width: 12px;
  height: 12px;
  border-top: 1px solid var(--accent);
  border-left: 1px solid var(--accent);
}
.hero-slogan::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: -2px;
  width: 12px;
  height: 12px;
  border-bottom: 1px solid var(--accent);
  border-left: 1px solid var(--accent);
}
.slogan-line {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
}
.slogan-cn {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--text-primary);
  background: linear-gradient(180deg, var(--text-primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px var(--accent-soft);
  animation: slogan-shimmer 4s ease-in-out infinite;
}
.slogan-stars {
  position: absolute;
  top: 8px;
  right: 6px;
  display: inline-flex;
  gap: 6px;
  pointer-events: none;
}
.slogan-stars span {
  width: 3px;
  height: 3px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--accent);
  animation: twinkle 2.4s ease-in-out infinite;
}
.slogan-stars span:nth-child(1) { animation-delay: 0s; }
.slogan-stars span:nth-child(2) { animation-delay: 0.4s; }
.slogan-stars span:nth-child(3) { animation-delay: 0.8s; }
.slogan-stars span:nth-child(4) { animation-delay: 1.2s; }
.slogan-stars span:nth-child(5) { animation-delay: 1.6s; }
@keyframes slogan-shimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.hero-title {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.02em;
  margin-bottom: 20px;
  color: var(--text-primary);
}
.gradient-text {
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent) 50%, var(--text-dim) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 40px var(--accent-soft);
}
.hero-title-cn {
  display: block;
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.4em;
  color: var(--text-secondary);
  margin-bottom: 8px;
  -webkit-text-fill-color: var(--text-secondary);
}
.hero-subtitle {
  font-size: 13px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-bottom: 36px;
  text-transform: uppercase;
}
.typing-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  min-height: 80px;
  border-left: 2px solid var(--accent);
  padding-left: 20px;
}
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--accent);
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s steps(2) infinite;
}
.hero-aside { position: relative; }

.hero-scroll-hint {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
  pointer-events: none;
}
.hero-scroll-hint .line {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, var(--accent), transparent);
  position: relative;
  overflow: hidden;
}
.hero-scroll-hint .line::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 8px;
  background: var(--accent);
  animation: scroll-line 2s ease-in-out infinite;
}
@keyframes scroll-line {
  0% { transform: translateY(-8px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(24px); opacity: 0; }
}

/* ============== Section 通用（整屏 PPT 式） ============== */
.section {
  position: relative;
  min-height: calc(100vh - 64px);
  padding: 60px 0 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.posts-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 20px;
}
.posts-grid > :first-child { grid-row: span 1; }

@media (max-width: 1024px) {
  .hero { min-height: auto; padding: 40px 0 80px; }
  .hero-content { grid-template-columns: 1fr; gap: 40px; }
  .hero-title { font-size: 48px; }
  .posts-grid { grid-template-columns: 1fr 1fr; }
  .slogan-cn { font-size: 19px; }
  .section { min-height: auto; padding: 40px 0 60px; }
}

@media (max-width: 768px) {
  .hero { padding: 20px 0 40px; }
  .hero-title { font-size: 36px; }
  .hero-title-cn { font-size: 16px; }
  .hero-fade { height: 100px; }
  .posts-grid { grid-template-columns: 1fr; }
  .slogan-cn { font-size: 17px; letter-spacing: 0.2em; }
  .slogan-stars { display: none; }
  .section { min-height: auto; padding: 30px 0 50px; }
  .home { scroll-snap-type: none; }
}

/* 小屏手机（< 480px）：hero 内容进一步压缩 */
@media (max-width: 480px) {
  .hero { padding: 12px 0 30px; }
  .hero-title { font-size: 28px; }
  .hero-title-cn { font-size: 14px; letter-spacing: 0.3em; }
  .hero-slogan { padding: 8px 0 10px 14px; margin-bottom: 12px; }
  .hero-tag { font-size: 9px; padding: 4px 10px; margin-bottom: 20px; }
  .hero-subtitle { font-size: 11px; margin-bottom: 24px; }
  .typing-text { font-size: 14px; min-height: 60px; padding-left: 14px; }
  .hero-fade { height: 80px; }
  .hero-scroll-hint { font-size: 8px; bottom: 8px; }
}
</style>
