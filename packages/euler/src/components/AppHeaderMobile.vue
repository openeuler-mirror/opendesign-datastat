<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/common';
import { openCommunityInfo } from '@/api/index';
import { useRoute, useRouter } from 'vue-router';

import logoWhite from '@/assets/datastat.png';
import logoWhiteZh from '@/assets/datastat-zh-mo.png';
import logoBlack from '@/assets/datastat-black.png';
import logoBlackZh from '@/assets/datastat-zh-black.png';
import communityLogoSmall from '@/assets/openeuler-small.png';
import communityLogoSmallWhite from '@/assets/openeuler-small-white.png';

import AppMobileMenu from './AppMobileMenu.vue';

const useCommon = useCommonStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const navList = computed(() => {
  return [
    {
      id: 'overview',
      label: t('nav.overview'),
      zh: 'zh_overview',
      en: 'en_overview',
    },
    {
      id: 'detail',
      label: t('nav.contributors'),
      zh: 'zh_detail',
      en: 'en_detail',
    },
  ];
});
const isblack = computed(() => useCommon.isBlackHeader);
const navActive = ref('overview');
watch(
  () => {
    return useCommon.isBlackHeader;
  },
  (val) => {
    navActive.value = val ? 'overview' : 'detail';
  }
);

const language = computed(() => (useCommon.language === 'zh' ? false : true));

const webSiteTitle = () => {
  document.title =
    useCommon.language === 'zh' ? 'openEuler 贡献看板' : 'openEuler DATASTAT';
};
webSiteTitle();

// 判断是否是主页面
const isHome = ref(false);
watch(
  () => {
    return route.path;
  },
  (path) => {
    const p = path.split('/').slice(-1).toString();
    isHome.value = p === 'mobile' ? true : false;
  }
);
// 点击logo回首页
const goMobileHome = () => {
  if (!isHome.value) {
    const lang = useCommon.language === 'zh' ? '/zh/mobile' : '/en/mobile';
    router.push(lang);
  }
  useCommon.moNav = 0;
  useCommon.isBlackHeader = true;
};
</script>

<template>
  <app-mobile-menu></app-mobile-menu>
  <div class="header-logo">
    <template v-if="isblack">
      <img
        class="logo"
        alt="logo"
        :src="!language ? logoWhiteZh : logoWhite"
        @click="goMobileHome"
      />
      <span class="line"></span>
      <a target="_blank" :href="openCommunityInfo.link"
        ><img class="community-logo" :src="communityLogoSmallWhite"
      /></a>
    </template>
    <template v-else>
      <img
        class="logo"
        alt="logo"
        :src="!language ? logoBlackZh : logoBlack"
        @click="goMobileHome"
      />
      <span class="line" style="background: #000"></span>
      <a target="_blank" :href="openCommunityInfo.link"
        ><img class="community-logo" :src="communityLogoSmall"
      /></a>
    </template>
  </div>
</template>

<style lang="scss">
</style>
