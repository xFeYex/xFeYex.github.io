import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 / HOME', transition: 'fade-zoom' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: '文章 / BLOG', transition: 'fade-zoom' },
  },
  {
    path: '/blog/:slug',
    name: 'post',
    component: () => import('@/views/PostView.vue'),
    meta: { title: '阅读 / READING', transition: 'fade-zoom' },
  },
  {
    path: '/moments',
    name: 'moments',
    component: () => import('@/views/MomentsView.vue'),
    meta: { title: '动态 / MOMENTS', transition: 'fade-zoom' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: '项目 / PROJECTS', transition: 'fade-zoom' },
  },
  {
    path: '/projects/:slug',
    name: 'project',
    component: () => import('@/views/ProjectView.vue'),
    meta: { title: '项目详情 / PROJECT', transition: 'fade-zoom' },
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('@/views/ArchiveView.vue'),
    meta: { title: '归档 / ARCHIVE', transition: 'fade-zoom' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于 / ABOUT', transition: 'fade-zoom' },
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/LinksView.vue'),
    meta: { title: '友链 / LINKS', transition: 'fade-zoom' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} · XUWEI.DEV`
  }
})

export default router
