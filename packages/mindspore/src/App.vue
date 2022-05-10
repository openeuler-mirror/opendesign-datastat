<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <header><app-header></app-header></header>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.wrap {
  max-width: 1416px;
  margin: 0 auto;
  padding: 0 24px;
}
footer {
  background: #000;
}
</style>
