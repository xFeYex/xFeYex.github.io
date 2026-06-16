<template>
  <div class="footer">
    <div class="footer-inner">
      <div class="footer-line font-tech">© {{ year }} XUWEI.DEV — ALL RIGHTS RESERVED</div>
      <div class="footer-cn">星轨之间 · 探索不息</div>
      <div class="footer-meta font-tech">v0.1.0 · MVP</div>
    </div>
  </div>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  position: relative;
  margin: 100px -32px 0;
  padding: 40px 0;
  border-top: 1px solid var(--border-faint);
  text-align: center;
}
.footer::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
}
.footer-inner {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}
.footer-line {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  margin-bottom: 8px;
}
.footer-cn {
  font-size: 12px;
  color: var(--text-dim);
  letter-spacing: 0.2em;
  margin-bottom: 8px;
}
.footer-meta {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-dim);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer { margin: 60px -20px 0; padding: 30px 0; }
  .footer-inner { padding: 0 20px; }
}
</style>
