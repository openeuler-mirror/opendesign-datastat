<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useCommonStore } from '@/stores/common';
import { openCommunityInfo } from '@/api/index';
import { useRoute, useRouter } from 'vue-router';

import logoWhite from '@/assets/datastat.png';
import logoWhiteZh from '@/assets/datastat-zh-mo.png';
import logoBlack from '@/assets/datastat-black.png';
import logoBlackZh from '@/assets/datastat-zh-black.png';
import communityLogoSmall from '@/assets/mindspore-small.png';
import communityLogoSmallWhite from '@/assets/mindspore-small-white.png';

const useCommon = useCommonStore();
const route = useRoute();
const router = useRouter();
const isblack = computed(() => (useCommon.swiperIndex < 2 ? true : false));

const isAbout = ref(false);
watch(
  () => {
    return route.path;
  },
  (path) => {
    const p = path.split('/').slice(-1).toString();
    isAbout.value = p === 'about' ? true : false;
  }
);

// 点击logo回首页
const goMobileHome = () => {
  if (isAbout.value) {
    const lang = useCommon.language === 'zh' ? '/zh/mobile' : '/en/mobile';
    router.push(lang);
    window.location.reload();
  }
  useCommon.moNav = 0;
  useCommon.swiperIndex = 0;
};
</script>

<template>
  <div class="header-logo">
    <template v-if="isblack">
      <img
        class="logo"
        alt="logo"
        :src="useCommon.language === 'zh' ? logoWhiteZh : logoWhite"
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
        :src="useCommon.language === 'zh' ? logoBlackZh : logoBlack"
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
.el-overlay {
  top: 48px !important;
  height: calc(100% - 48px) !important;
  width: 100%;
  &.black {
    background-color: rgba(255, 255, 255, 0.5) !important;
    .el-drawer {
      background: #191e27;
      &__body {
        .drawer-nav {
          .link {
            color: #fff;
          }
          .active {
            color: #fff;
            background: #000;
            &::after {
              display: block;
            }
          }
        }
      }
    }
  }
  .el-drawer {
    background: #f5f6f8;
    &__body {
      padding: 0;
      overflow: hidden;
      .drawer-panel {
        position: relative;
        height: 100%;
        .action {
          position: absolute;
          bottom: 20px;
          left: 16px;
        }
      }
      .drawer-nav {
        .link {
          display: block;
          line-height: 48px;
          padding: 0 16px;
          color: #000;
          font-size: 12px;
          position: relative;
          &::after {
            width: 36px;
            height: 2px;
            background: #406fe7;
            position: absolute;
            bottom: 0;
            left: 16px;
            content: '';
            display: none;
          }
        }
        .active {
          color: #000;
          background: #fff;
          &::after {
            display: block;
          }
        }
      }
    }
  }
}
</style>
