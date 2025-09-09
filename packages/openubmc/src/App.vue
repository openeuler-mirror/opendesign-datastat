<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoginStore from './stores/login';

const { locale } = useI18n();

const elLocale = computed(() => (locale.value === 'en' ? en : zhCn));

const loginStore = useLoginStore();
onMounted(() => {
  loginStore.getUserInfo();
});
</script>

<template>
  <AppHeader />
  <ElConfigProvider :locale="elLocale">
    <router-view v-slot="{ Component, route }">
      <transition :name="(route.meta.transition as string)">
        <component :is="Component" />
      </transition>
    </router-view>
  </ElConfigProvider>
</template>

<style lang="scss">
@use '@/assets/style/grid.scss' as *;
.ly-footer {
  height: var(--layout-footer-height);
  background-color: #121417;
}
#app {
  --header-height: 72px;
  --layout-content-max-width: 1416px;
  --layout-content-padding: 40px;
  --layout-header-zIndex: 101;

  --layout-max-width: calc(var(--layout-content-max-width) + var(--layout-content-padding) * 2);

  --layout-footer-height: 361px;

  --layout-content-height: calc(100vh - var(--layout-footer-height));
  --layout-content-height-main: calc(100vh - var(--layout-footer-height) - var(--layout-header-height));

  .content-width {
    width: var(--grid-content-width);
  }

  @include respond-to('laptop') {
    --layout-footer-height: 359px;
  }
  @include respond-to('pad_h') {
    --layout-footer-height: 329px;
  }
  @include respond-to('pad_v') {
    --layout-header-height: 48px;
    --layout-footer-height: 339px;
  }
  @media screen and (max-width: 638px) {
    --layout-footer-height: 351px;
  }
  @media screen and (max-width: 558px) {
    --layout-footer-height: 375px;
  }
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
</style>
