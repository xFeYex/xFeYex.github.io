import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'

// 主题（必须在最前面，让 CSS 变量生效）
import './styles/base.css'
import './styles/themes/honkai-star-rail.css'
import './styles/themes/arknights.css'
import './styles/themes/endfield.css'
import './styles/themes/glass.css'
import './styles/animations.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
