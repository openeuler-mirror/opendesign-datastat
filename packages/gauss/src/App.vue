<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { OPlusConfigProvider } from '@opendesign-plus/components';
import { OElCookieNotice } from '@opendesign-plus/components/element-plus';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const HOME_URL = 'https://opengauss.org';
const { locale } = useI18n();

const cookieNoticeVisible = ref(false);
const cookieRef = ref();
const route = useRoute();
watch(
  () => route.path,
  async () => {
    await nextTick();
    cookieRef.value?.check();
  }
);
</script>

<template>
  <header><app-header></app-header></header>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <component :is="Component" />
    </transition>
  </router-view>
  <OPlusConfigProvider :locale="locale">
    <OElCookieNotice
      community="openGauss"
      ref="cookieRef"
      v-model:visible="cookieNoticeVisible"
      :detail-url="`${HOME_URL}/${locale}/cookies`"
    />
  </OPlusConfigProvider>
</template>

<style lang="scss">
#app {
  --layout-content-max-width: 1544px;
  --layout-content-padding: 64px;
  --layout-header-height: 80px;

  @include screen.respond-to('<=laptop') {
    --layout-content-max-width: 100%;
    --layout-content-padding: 40px;
  }

  @include screen.respond-to('<=pad') {
    --layout-content-padding: 32px;
  }

  @include screen.respond-to('phone') {
    --layout-content-padding: 24px;
  }
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.wrap {
  max-width: 1416px;
  margin: 0 auto;
  padding: 0 24px;
}
footer {
  background: #060612;
  margin-top: 60px;
}
body {
  background: #000;
  overflow-y: scroll;
}
</style>
