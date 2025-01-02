<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import { openCommunityInfo } from '@/api/index';
import { useCommonStore } from '@/stores/common';
import {
  formatNumber,
  getYearByOffset,
  toThousands,
} from 'shared/utils/helper';

import logo from '@/assets/datastat-black.png';
import communityLogo from '@/assets/mindspore.png';
import bg_mo from '@/assets/bg_mo.png';

const useCommon = useCommonStore();
const { t, locale } = useI18n();
locale.value = localStorage.getItem('lang') || 'zh';

const swiperRef: any = ref(null);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper: any) => {
  useCommon.swiperIndex = swiper.activeIndex;
  useCommon.moNav = swiper.activeIndex;
};
// 监听导航跳转
watch(
  () => useCommon.moNav,
  () => {
    swiperRef.value.slideTo(useCommon.moNav);
  }
);

const modules = [Pagination];
const isblack = computed(() => (useCommon.swiperIndex < 2 ? true : false));
onMounted(() => {
  useCommon.getAllData();
});
</script>
<template>
  <swiper
    :class="{ black: isblack }"
    :pagination="true"
    :modules="modules"
    @swiper="onSwiper"
    @slide-change="onSlideChange"
  >
    <swiper-slide
      class="slide-page1"
      :style="'background-image:url(' + bg_mo + ')'"
    >
      <div class="overview-page">
        <p class="overview-page-item">
          {{ t('home.user')
          }}<span class="num">{{ toThousands(useCommon.allData.users) }}</span>
        </p>
        <p class="overview-page-item">
          {{ t('home.contributors')
          }}<span class="num">{{
            toThousands(useCommon.allData.contributors)
          }}</span>
        </p>
        <p class="overview-page-item">
          {{ t('home.partners')
          }}<span class="num">{{
            toThousands(useCommon.allData.partners)
          }}</span>
        </p>
      </div>

      <p class="time">{{ useCommon.time }}</p>
    </swiper-slide>
    <swiper-slide
      class="slide-page2"
      :style="'background-image:url(' + bg_mo + ')'"
    >
      <div class="overview-page2">
        <p class="overview-page2-item">
          {{ t('home.prs') }}
          <span class="num">{{ formatNumber(useCommon.allData.prs) }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.issues') }}
          <span class="num">{{ formatNumber(useCommon.allData.issues) }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.comments') }}
          <span class="num">{{
            formatNumber(useCommon.allData.comments)
          }}</span>
        </p>
      </div>

      <p class="time">{{ useCommon.time }}</p>
    </swiper-slide>

    <swiper-slide class="slide-page3">
      <div class="slide-panel foot-panel">
        <div class="foot-item-logo">
          <img :src="logo" alt="" />
          <span class="line">|</span>
          <img :src="communityLogo" alt="" />
        </div>
        <div class="foot-item-link">
          <router-link
            :to="useCommon.language === 'zh' ? '/zh/about' : '/en/about'"
            >{{ t('footer.about') }}</router-link
          >
          <a :href="t('footer.privacyLink')" target="_blank">{{
            t('footer.privacy')
          }}</a>
          <a :href="t('footer.legalLink')" target="_blank">{{
            t('footer.legal')
          }}</a>
        </div>
        <div class="foot-item-cy">
          <p class="mail">
            <a :href="`mailto:${openCommunityInfo.email}`" target="_blank">
              {{ openCommunityInfo.email }}
            </a>
          </p>
          <p class="cy">
            {{ t('footer.copyright', { year: getYearByOffset() }) }}
            <a
              :href="openCommunityInfo.copyrightNum"
              target="_blank"
              rel="noopener noreferrer"
              >{{ t('footer.copyrightNum') }}</a
            >
          </p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<style lang="scss" scoped>
body {
  background: #000 !important;
}
.swiper {
  height: 100vh;
  background: #f5f6f8;
  max-width: 1024px;
  &.black {
    :deep(.swiper-pagination) {
      .swiper-pagination-bullet {
        background: #f5f6f8;
      }
      .swiper-pagination-bullet-active {
        background: #406fe7;
      }
    }
  }

  .time {
    position: absolute;
    bottom: 64px;
    left: 16px;
    display: inline-block;
    height: 14px;
    font-size: 10px;
    color: #ffffff;
    line-height: 14px;
    opacity: 0.8;
  }
  .slide-page1,
  .slide-page2 {
    background: #000 no-repeat top center/cover;
    height: 100%;
    padding: 0 16px 114px;
    box-sizing: border-box;
  }
  .slide-page1 {
    .overview-page {
      display: grid;
      align-items: end;
      height: 100%;
      grid-template-rows: 60%;
      &-item {
        color: #d3dce9;
        font-size: 16px;
        .num {
          display: block;
          font-size: 40px;
          color: #fff;
        }
      }
    }
  }
  .slide-page2 {
    .overview-page2 {
      display: grid;
      align-items: end;
      height: 100%;
      grid-template-rows: 60%;
      &-item {
        color: #d3dce9;
        font-size: 16px;
        .num {
          display: block;
          font-size: 40px;
          color: #fff;
        }
      }
    }
  }
  .slide-page3 {
    padding: 68px 16px 62px;
    box-sizing: border-box;
    .slide-panel {
      background: #fff;
      height: 100%;
      overflow: hidden auto;
      padding: 16px;
      :deep(.contributions-statistical) {
        margin: 0;
        .title {
          font-size: 18px;
        }
        .searchInput {
          padding-left: 0;
        }
      }
      :deep(.el-form) {
        .el-form-item {
          display: block;
          padding: 0;
          margin-bottom: 16px;
          &__label {
            font-size: 12px;
            margin-bottom: 5px;
            line-height: 20px;
            display: block;
          }
          .el-radio {
            height: 24px;
            padding: 0 6px;
            margin: 0 5px 12px 0;
            &__label {
              font-size: 12px;
            }
          }
        }
      }
    }
    .foot-panel {
      display: grid;
      place-content: center;
      height: 100%;
      padding: 0;
      background: none;
      .foot-item-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 32px;
        }
        .line {
          margin: 0 16px;
        }
      }
      .foot-item-link {
        display: flex;
        justify-content: center;
        margin: 40px 0;
        a {
          color: #555;
          font-size: 12px;
          padding: 0 8px;
          border-right: 1px solid #555;
          &:last-child {
            border: 0 none;
          }
        }
      }
      .foot-item-cy {
        text-align: center;
        p {
          font-size: 12px;
          color: #555;
          a {
            color: inherit;
          }
        }
        .cy {
          color: #999;
          margin-top: 8px;
          a {
            color: inherit;
          }
        }
      }
      .atom-item {
        text-align: center;
        margin-bottom: 60px;
        img {
          height: 40px;
        }
        p {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
          width: 325px;
        }
      }
    }
    :deep(.el-table) {
      .cell {
        font-size: 12px;
      }
      .el-progress {
        width: 88px;
        display: inline-block;
        margin-left: 5px;
        &-bar__outer {
          background: none !important;
        }
      }
    }
  }
}
.company-content {
  &-item {
    padding: 16px 0;
    list-style: none;
    border-bottom: 1px solid #dfe1e8;
    .name {
      font-size: 14px;
      color: #000;
      line-height: 22px;
      .index {
        color: #9097a3;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
.progress {
  height: 24px;
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 10px;
  &-inner {
    background: #40adff;
    box-shadow: 4px 8px 12px 0px rgba(0, 92, 219, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 8px;
    transition: all 0.3s ease-in;
  }
  .val {
    color: #000;
    font-size: 12px;
    margin-left: 8px;
  }
}
:deep(.swiper-pagination) {
  left: 14px;
  bottom: 30px;
  text-align: left;
  .swiper-pagination-bullet {
    width: 20px;
    height: 2px;
    background: #000;
    opacity: 0.3;
    border-radius: 0;
    &-active {
      background: #406fe7;
      opacity: 1;
    }
  }
}
</style>
