<template>
  <!-- 折叠按钮：左下角悬浮 -->
  <button
    v-if="!expanded"
    class="player-fab"
    :class="{ 'has-track': currentTrack, playing: isPlaying }"
    @click="expand"
    aria-label="打开音乐播放器"
  >
    <span class="fab-icon">
      <Icon :icon="isPlaying ? 'mdi:music-note-eighth' : 'mdi:music-off-outline'" />
    </span>
    <span v-if="currentTrack" class="fab-bars">
      <span></span><span></span><span></span><span></span>
    </span>
  </button>

  <!-- 展开后的浮窗 -->
  <transition name="player-pop">
    <div v-if="expanded" class="player-panel" @click.stop>
      <div class="panel-head">
        <div class="panel-tag font-tech">// {{ playlist.title }}</div>
        <button class="panel-close" @click="collapse" aria-label="关闭播放器">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <div class="panel-body">
        <!-- 封面 + 信息 -->
        <div class="now-playing">
          <div class="cover" :class="{ spinning: isPlaying }">
            <img v-if="currentTrack" :src="currentTrack.cover" :alt="currentTrack.title" />
            <span v-else class="cover-placeholder">
              <Icon icon="mdi:music-circle-outline" />
            </span>
          </div>
          <div class="meta">
            <div class="title">
              {{ currentTrack ? currentTrack.titleCn : '点击播放' }}
            </div>
            <div class="artist font-tech">
              {{ currentTrack ? currentTrack.artist : playlist.titleCn }}
            </div>
            <div class="time font-tech">
              {{ formatTime(progress) }} / {{ formatTime(duration) }}
            </div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-wrap" @click="seek">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>

        <!-- 控制 -->
        <div class="controls">
          <button class="ctrl-btn" :disabled="!playlist.tracks.length" @click="prev" aria-label="上一首">
            <Icon icon="mdi:skip-previous-outline" />
          </button>
          <button class="ctrl-btn play" @click="toggle" aria-label="播放/暂停">
            <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" />
          </button>
          <button class="ctrl-btn" :disabled="!playlist.tracks.length" @click="next" aria-label="下一首">
            <Icon icon="mdi:skip-next-outline" />
          </button>
        </div>

        <!-- 歌单 -->
        <div class="tracklist">
          <div class="tracklist-head font-tech">// TRACKLIST</div>
          <div class="tracklist-list">
            <button
              v-for="(t, i) in playlist.tracks"
              :key="t.id"
              class="track-row"
              :class="{ active: i === currentIndex }"
              @click="select(i)"
            >
              <span class="track-idx font-tech">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="track-info">
                <span class="track-title">{{ t.titleCn }}</span>
                <span class="track-sub font-tech">{{ t.title }} · {{ formatTime(t.duration) }}</span>
              </span>
              <span v-if="i === currentIndex && isPlaying" class="track-bars">
                <span></span><span></span><span></span>
              </span>
              <Icon v-else-if="i === currentIndex" icon="mdi:music-note-eighth" class="track-mark" />
            </button>
          </div>
        </div>

        <!-- 音量 -->
        <div class="volume">
          <Icon icon="mdi:volume-medium" class="vol-icon" />
          <input
            type="range"
            min="0"
            max="100"
            :value="volume"
            @input="onVolume"
            class="vol-range"
            aria-label="音量"
          />
          <span class="vol-val font-tech">{{ volume }}</span>
        </div>

        <!-- 提示 -->
        <div class="tip font-tech">
          * 真实音频需在 <code>src/data/playlist.json</code> 的 <code>url</code> 字段填入音频地址
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Icon } from '@iconify/vue'
import playlistRaw from '@/data/playlist.json'

const playlist = playlistRaw
const expanded = ref(false)
const isPlaying = ref(false)
const currentIndex = ref(0)
const progress = ref(0)
const duration = ref(0)
const volume = ref(60)

let audio = null
let tickTimer = null

const currentTrack = computed(() => playlist.tracks[currentIndex.value] || null)
const progressPct = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, (progress.value / duration.value) * 100)
})

function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec || 0))
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

function expand() {
  expanded.value = true
}
function collapse() {
  expanded.value = false
}

function toggle() {
  if (!playlist.tracks.length) return
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function play() {
  // 真实音频 url 为空时不实际播放，保留状态机
  isPlaying.value = true
  duration.value = currentTrack.value?.duration || 0
  startTick()
}

function pause() {
  isPlaying.value = false
  stopTick()
}

function prev() {
  if (!playlist.tracks.length) return
  const len = playlist.tracks.length
  currentIndex.value = (currentIndex.value - 1 + len) % len
  progress.value = 0
  duration.value = currentTrack.value?.duration || 0
  if (isPlaying.value) play()
}

function next() {
  if (!playlist.tracks.length) return
  const len = playlist.tracks.length
  currentIndex.value = (currentIndex.value + 1) % len
  progress.value = 0
  duration.value = currentTrack.value?.duration || 0
  if (isPlaying.value) play()
}

function select(i) {
  currentIndex.value = i
  progress.value = 0
  duration.value = currentTrack.value?.duration || 0
  if (!isPlaying.value) play()
}

function seek(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  progress.value = Math.max(0, Math.min(duration.value, ratio * duration.value))
}

function onVolume(e) {
  volume.value = Number(e.target.value)
}

function startTick() {
  stopTick()
  tickTimer = setInterval(() => {
    if (!isPlaying.value) return
    progress.value += 1
    if (progress.value >= duration.value) {
      // 单曲结束 → 下一首或停止
      const len = playlist.tracks.length
      if (currentIndex.value + 1 >= len) {
        if (playlist.loop === 'all') {
          currentIndex.value = 0
          progress.value = 0
          duration.value = currentTrack.value?.duration || 0
        } else {
          pause()
          progress.value = 0
        }
      } else {
        currentIndex.value += 1
        progress.value = 0
        duration.value = currentTrack.value?.duration || 0
      }
    }
  }, 1000)
}

function stopTick() {
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = null
  }
}

function handleEsc(e) {
  if (e.key === 'Escape' && expanded.value) collapse()
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEsc)
  stopTick()
})

watch(expanded, (v) => {
  // 关闭浮窗不影响播放
})
</script>

<style scoped>
/* ============== 浮窗按钮 ============== */
.player-fab {
  position: fixed;
  bottom: 28px;
  left: 28px;
  z-index: 90;
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--panel-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s var(--ease-soft);
  box-shadow: var(--shadow-card);
}
.player-fab:hover {
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: var(--shadow-card), 0 0 20px var(--accent-soft);
  transform: translateY(-2px);
}
.player-fab.has-track {
  color: var(--accent);
  border-color: var(--accent);
}
.player-fab .fab-icon {
  font-size: 22px;
  z-index: 2;
}
.player-fab .fab-bars {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: inline-flex;
  gap: 2px;
  align-items: flex-end;
  height: 10px;
}
.player-fab .fab-bars span {
  width: 2px;
  background: var(--accent);
  box-shadow: 0 0 4px var(--accent);
  animation: bar-jump 1.2s ease-in-out infinite;
}
.player-fab .fab-bars span:nth-child(1) { height: 40%; animation-delay: 0s; }
.player-fab .fab-bars span:nth-child(2) { height: 80%; animation-delay: 0.2s; }
.player-fab .fab-bars span:nth-child(3) { height: 60%; animation-delay: 0.4s; }
.player-fab .fab-bars span:nth-child(4) { height: 30%; animation-delay: 0.6s; }
.player-fab:not(.playing) .fab-bars { display: none; }
@keyframes bar-jump {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* ============== 浮窗面板 ============== */
.player-panel {
  position: fixed;
  bottom: 28px;
  left: 28px;
  z-index: 95;
  width: 360px;
  max-width: calc(100vw - 56px);
  max-height: calc(100vh - 120px);
  background: var(--panel-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-deep), 0 0 32px var(--accent-soft);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* HUD 角标 */
.player-panel::before,
.player-panel::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--accent);
  pointer-events: none;
}
.player-panel::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.player-panel::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-faint);
  background: var(--bg-overlay);
}
.panel-tag {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--accent);
  text-transform: uppercase;
}
.panel-close {
  background: transparent;
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s var(--ease-soft);
}
.panel-close:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
}

.panel-body {
  padding: 18px 18px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ============== 当前播放 ============== */
.now-playing {
  display: flex;
  gap: 14px;
  align-items: center;
}
.cover {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: var(--bg-deep);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover.spinning::after {
  content: "";
  position: absolute;
  inset: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  background: var(--bg-deep);
  border-radius: 50%;
  border: 1px solid var(--accent);
}
.cover-placeholder {
  font-size: 28px;
  color: var(--text-dim);
}

.meta { flex: 1; min-width: 0; }
.title {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.time {
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.15em;
}

/* ============== 进度条 ============== */
.progress-wrap {
  cursor: pointer;
  padding: 6px 0;
}
.progress-bar {
  position: relative;
  height: 3px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  overflow: hidden;
}
.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent) 100%);
  box-shadow: 0 0 8px var(--accent-soft);
  transition: width 0.3s linear;
}

/* ============== 控制 ============== */
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.ctrl-btn {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s var(--ease-soft);
}
.ctrl-btn:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
}
.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ctrl-btn.play {
  width: 48px;
  height: 48px;
  font-size: 22px;
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-faint);
  box-shadow: 0 0 12px var(--accent-soft);
}
.ctrl-btn.play:hover:not(:disabled) {
  background: var(--accent);
  color: var(--text-inverse);
  transform: scale(1.05);
}

/* ============== 歌单 ============== */
.tracklist {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--border-faint);
}
.tracklist-head {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.tracklist-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 200px;
  overflow-y: auto;
}
.track-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px 8px;
  background: transparent;
  border: 1px solid transparent;
  border-left: 2px solid transparent;
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s var(--ease-soft);
}
.track-row:hover {
  background: var(--accent-faint);
  color: var(--text-primary);
}
.track-row.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-left-color: var(--accent);
}
.track-idx {
  font-size: 9px;
  color: var(--text-dim);
  width: 22px;
  flex-shrink: 0;
  letter-spacing: 0.2em;
}
.track-row.active .track-idx { color: var(--accent); }
.track-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.track-title {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-sub {
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-top: 2px;
}
.track-row.active .track-sub { color: var(--accent); }
.track-mark {
  color: var(--accent);
  font-size: 14px;
  flex-shrink: 0;
}
.track-bars {
  display: inline-flex;
  gap: 2px;
  align-items: flex-end;
  height: 12px;
  flex-shrink: 0;
}
.track-bars span {
  width: 2px;
  background: var(--accent);
  box-shadow: 0 0 4px var(--accent);
  animation: bar-jump 0.8s ease-in-out infinite;
}
.track-bars span:nth-child(1) { height: 50%; animation-delay: 0s; }
.track-bars span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.track-bars span:nth-child(3) { height: 70%; animation-delay: 0.4s; }

/* ============== 音量 ============== */
.volume {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 6px;
  border-top: 1px solid var(--border-faint);
}
.vol-icon {
  color: var(--text-dim);
  font-size: 16px;
  flex-shrink: 0;
}
.vol-range {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-faint);
  outline: none;
  cursor: pointer;
}
.vol-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 1px solid var(--accent);
  cursor: pointer;
  box-shadow: 0 0 6px var(--accent-soft);
}
.vol-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 1px solid var(--accent);
  cursor: pointer;
}
.vol-val {
  font-size: 9px;
  color: var(--text-dim);
  width: 28px;
  text-align: right;
  flex-shrink: 0;
  letter-spacing: 0.15em;
}

/* ============== 提示 ============== */
.tip {
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  line-height: 1.6;
  padding: 6px 8px;
  background: var(--bg-overlay);
  border-left: 2px solid var(--border-faint);
}
.tip code {
  font-family: ui-monospace, "Cascadia Code", Menlo, Consolas, monospace;
  color: var(--accent);
  font-size: 9px;
}

/* ============== 入场动画 ============== */
.player-pop-enter-active {
  transition: all 0.4s var(--ease-out-expo);
}
.player-pop-leave-active {
  transition: all 0.3s var(--ease-soft);
}
.player-pop-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.player-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ============== 响应式 ============== */
@media (max-width: 768px) {
  .player-fab { bottom: 20px; left: 20px; width: 48px; height: 48px; }
  .player-fab .fab-icon { font-size: 18px; }
  .player-panel { bottom: 20px; left: 20px; right: 20px; width: auto; max-width: none; }
  .tracklist-list { max-height: 140px; }
}
</style>
