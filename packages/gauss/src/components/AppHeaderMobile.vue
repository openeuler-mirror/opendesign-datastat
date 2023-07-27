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
import communityLogoSmall from '@/assets/opengauss-small.png';
import communityLogoSmallWhite from '@/assets/opengauss-small-white.png';
import Bitmap from '@/assets/Bitmap.png';

import AppMobileMenu from './AppMobileMenu.vue';
import {
  useStoreData,
  showGuard,
  logout,
  getUserAuth,
} from 'shared/utils/login';
import LoadingArc from './LoadingArc.vue';

const { token } = getUserAuth();
const useCommon = useCommonStore();
const route = useRoute();
const router = useRouter();
const { guardAuthClient, isLoggingIn } = useStoreData();
let dialogVisible = ref(false);
const { t } = useI18n();
const isblack = computed(() => useCommon.isBlackHeader);

const language = computed(() => (useCommon.language === 'zh' ? false : true));

const webSiteTitle = () => {
  document.title =
    useCommon.language === 'zh' ? 'openGauss 贡献看板' : 'openGauss DATASTAT';
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
      <a :href="openCommunityInfo.link"
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
      <a :href="openCommunityInfo.link"
        ><img class="community-logo" :src="communityLogoSmall"
      /></a>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.opt-user {
  position: absolute;
  right: 1rem;
  top: 12px;
  font-size: 12px;
  .img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    cursor: pointer;
  }
  .phone-login {
    line-height: 1.5rem;
    padding: 0 0.5rem;
    text-align: center;
    color: #000;
    border: 1px solid #000;
    cursor: pointer;
    font-size: 12px;
  }
  .black {
    color: #fff;
    border: 1px solid #fff;
  }
}
</style>
