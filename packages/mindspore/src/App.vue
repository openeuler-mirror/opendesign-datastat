<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { OPlusConfigProvider } from '@opendesign-plus/components';
import { OElCookieNotice } from '@opendesign-plus/components/element-plus';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const { locale } = useI18n();

const cookieNoticeVisible = ref(false);
const cookieRef = ref();
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
  <router-view></router-view>
  <OPlusConfigProvider :locale="locale">
    <OElCookieNotice
      community="MindSpore"
      ref="cookieRef"
      v-model:visible="cookieNoticeVisible"
      :detail-url="`https://www.mindspore.cn/cookies/${locale === 'zh' ? '' : 'en'}`"
    />
  </OPlusConfigProvider>
</template>

<style lang="scss">
#app {
  --layout-content-max-width: 1544px;
  --layout-content-padding: 64px;
  --layout-header-height: 80px;

  @include respond-to('<=laptop') {
    --layout-content-max-width: 100%;
    --layout-content-padding: 40px;
  }

  @include respond-to('<=pad') {
    --layout-content-padding: 32px;
  }

  @include respond-to('phone') {
    --layout-content-padding: 24px;
  }
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
