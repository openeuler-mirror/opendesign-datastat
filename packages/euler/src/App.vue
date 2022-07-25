<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { setStoreData, useStoreData } from 'shared/utils/login';
import { openCommunityInfo } from './api';

setStoreData(openCommunityInfo.name);
const { loginIframeSrc } = useStoreData();
</script>

<template>
  <div v-if="!loginIframeSrc">
    <header><app-header></app-header></header>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <iframe
    v-else
    :src="loginIframeSrc"
    class="login-iframe"
    frameborder="0"
  ></iframe>
</template>

<style lang="scss">
.login-iframe {
  width: 100%;
  height: 100vh;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.container {
  min-width: 1280px;
}
.wrap {
  max-width: 1416px;
  padding: 0 24px;
}
@media screen and (min-width: 1900px) {
  .wrap {
    margin: 0 auto;
  }
}
@media screen and (min-width: 1700px) and (max-width: 1900px) {
  .wrap {
    margin: 0 240px 0 auto;
  }
}
@media screen and (max-width: 1700px) {
  .wrap {
    margin: 0 auto;
  }
}
body {
  background: #000;
}
footer {
  background: #060612;
  margin-top: 60px;
}
</style>
