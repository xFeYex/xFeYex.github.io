<template>
  <component :is="layout">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade-zoom'" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout || DefaultLayout)
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}
</style>
