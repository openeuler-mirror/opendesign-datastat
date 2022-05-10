<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import OBanner from 'shared/components/OBanner.vue';
import { toThousands, formatNumber } from 'shared/utils/helper';
import { useCommonStore } from '@/stores/common';
import useScroll from 'shared/hooks/useScroll';

import homeBanner from '@/assets/bg.png';
import arrowDown from '~icons/app/chevrons-down';

const router = useRouter();
const useCommon = useCommonStore();
const { t, locale } = useI18n();

locale.value = localStorage.getItem('lang') || 'zh';

// 获取数据
onMounted(() => {
  useCommon.getAllData();
});

const { isScrollDown } = useScroll('down');
watch(
  () => isScrollDown.value,
  () => {
    if (isScrollDown.value) {
      const lang = useCommon.language === 'zh' ? '/zh/detail' : '/en/detail';
      router.push(lang);
    }
  }
);

const goContributors = () => {
  isScrollDown.value = true;
};
</script>

<template>
  <o-banner class="home-banner">
    <div class="banner-content">
      <div class="community-content">
        <div class="community-info">
          <p class="title">{{ t('home.user') }}</p>
          <p class="num">{{ toThousands(useCommon.allData.users) }}</p>
        </div>
        <div class="community-info">
          <p class="title">{{ t('home.contributors') }}</p>
          <p class="num">
            {{ toThousands(useCommon.allData.contributors) }}
          </p>
        </div>
        <div class="community-info">
          <p class="title">{{ t('home.partners') }}</p>
          <p class="num">{{ toThousands(useCommon.allData.partners) }}</p>
        </div>
        <div class="community-panel">
          <div class="community-info">
            <p class="title">{{ t('home.prs') }}</p>
            <p class="num">{{ formatNumber(useCommon.allData.prs) }}</p>
          </div>
          <div class="community-info">
            <p class="title">{{ t('home.issues') }}</p>
            <p class="num">{{ formatNumber(useCommon.allData.issues) }}</p>
          </div>
          <div class="community-info">
            <p class="title">{{ t('home.comments') }}</p>
            <p class="num">{{ formatNumber(useCommon.allData.comments) }}</p>
          </div>
        </div>
      </div>

      <p class="time">{{ useCommon.time }}</p>
      <div class="more" @click="goContributors">
        <p>{{ t('home.moreData') }}</p>
        <o-icon class="icon"><arrow-down></arrow-down></o-icon>
      </div>
    </div>
    <template #video>
      <video
        class="bg-video"
        src="https://datastat.obs.cn-north-4.myhuaweicloud.com/datastat-openlookeng-home.mp4"
        :poster="homeBanner"
        autoplay
        loop
        muted
        controlslist="nodownload nofullscreen"
        x5-playsinline="true"
        playsinline="true"
        webkit-playsinline="true"
      ></video>
    </template>
  </o-banner>
</template>

<style lang="scss" scoped>
.bg-video {
  height: 100vh;
}
.banner-content {
  padding: 100px 0;
  color: #ffffff;
  height: calc(100vh);
  position: relative;
  overflow: hidden;
  z-index: 2;
  .community-content {
    display: grid;
    height: 100%;
    align-items: center;

    .title {
      font-size: 24px;
      line-height: 24px;
      color: #fff;
    }
    .num {
      font-size: 64px;
      color: #fff;
      line-height: 84px;
      font-weight: 400;
    }
    .community-info {
      text-align: left;
    }
    .community-panel {
      display: flex;
      .community-info {
        margin-bottom: 0;
        margin-right: 64px;
      }
      .title {
        font-size: 16px;
        color: #d3dce9;
      }
      .num {
        font-size: 40px;
        line-height: 48px;
      }
    }
  }

  .time {
    display: inline-block;
    font-size: 12px;
    color: #ffffff;
    line-height: 16px;
    opacity: 0.8;
  }

  .more {
    position: absolute;
    bottom: 20px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    cursor: pointer;
    color: #fff;
    p {
      font-size: 16px;
      color: #fff;
      line-height: 24px;
      font-weight: 100;
    }
    .icon {
      animation: loadingtd 2s infinite;
      display: inline-block;
    }
  }
}
@keyframes loadingtd {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
