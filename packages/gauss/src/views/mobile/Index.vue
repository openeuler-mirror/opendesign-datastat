<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import FormSearch from '../contributors/FormSearch.vue';
import { openCommunityInfo } from '@/api/index';
import { useCompanyStore } from '@/stores/company';
import { usePersonalStore } from '@/stores/personal';
import { useCommonStore } from '@/stores/common';
import TheForm from '@/components/TheForm.vue';
import { formatNumber, toThousands } from 'shared/utils/helper';

import logo from '@/assets/datastat-black.png';
import logoZh from '@/assets/datastat-zh-black.png';
import communityLogo from '@/assets/opengauss.png';
import bg_mo from '@/assets/bg_mo.png';

const useCompany = useCompanyStore();
const usePersonal = usePersonalStore();
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

// 个人信息
const progressFormat = (item: number) => {
  return (100 / useCompany.companyMaxNum) * item;
};
const formOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'PR' },
        { label: t('home.issues'), value: 'Issue' },
        { label: t('home.comments'), value: 'Comment' },
      ],
    },
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'mother',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
// theform组件调用
const componentName = 'personal';
const getContributeInfo = () => {
  usePersonal.getPersonalData();
};
const loading = ref(true);

const progressColor = ref('#7d32ea');
const personalFormat = (item: number) => {
  return (100 / usePersonal.personalMaxNum) * item;
};
onMounted(() => {
  usePersonal.getPersonalData();
  useCommon.getAllData();
  loading.value = false;
});

const search404 = ref(false);
const searchStsate = (item: boolean) => {
  search404.value = item;
};

// footerinfo
const modules = [Pagination];
const isblack = computed(() => (useCommon.swiperIndex < 2 ? true : false));

const contributeType = ref('');
const switchType = () => {
  switch (usePersonal.personalForm.contributeType) {
    case 'PR':
      contributeType.value = t('home.prs');
      break;
    case 'Issue':
      contributeType.value = t('home.issues');
      break;
    case 'Comment':
      contributeType.value = t('home.comments');
      break;
  }
};
switchType();
watch(
  () => usePersonal.personalForm.contributeType,
  () => {
    switchType();
  }
);
watch(
  () => locale.value,
  () => {
    usePersonal.getPersonalData();
    useCommon.getAllData();
    switchType();
  }
);

// 滚动事件
const isScroll = ref(false);
const slideRef = ref<any>(null);
const isScroll1 = ref(false);
const slideRef1 = ref<any>(null);
onMounted(() => {
  slideRef.value?.addEventListener(
    'scroll',
    () => {
      nextTick(() => {
        isScroll.value = slideRef.value?.scrollTop > 200 ? true : false;
      });
    },
    true
  );
  slideRef1.value?.addEventListener(
    'scroll',
    () => {
      nextTick(() => {
        isScroll1.value = slideRef1.value?.scrollTop > 200 ? true : false;
      });
    },
    true
  );
});

const backtop = () => {
  slideRef.value.scrollTop = 0;
};
const backtop1 = () => {
  slideRef1.value.scrollTop = 0;
};
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
        <p class="overview-page2-item">
          {{ t('home.sigs') }}
          <span class="num">{{ formatNumber(useCommon.allData.sigs) }}</span>
        </p>
      </div>

      <p class="time">{{ useCommon.time }}</p>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div ref="slideRef" class="slide-panel">
        <div v-if="isScroll" class="backtop" @click="backtop">
          {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
        </div>
        <div class="slide-panel-content">
          <h3 class="title">{{ t('companyContributor') }}</h3>
          <form-search @search-state="searchStsate" />
          <div v-if="search404" class="search404">
            <img class="cover" src="@/assets/404.png" alt="404" />
            <p class="text">{{ t('searchTips') }}</p>
          </div>
          <ul v-else class="company-content">
            <li
              v-for="(item, index) in useCompany.companyData"
              :key="'com' + index"
              class="company-content-item"
            >
              <p class="name">
                <span class="index">{{
                  useCompany.searchRanking !== 0
                    ? useCompany.searchRanking
                    : +index + 1
                }}</span>
                {{
                  useCommon.language === 'zh'
                    ? item.company_cn
                    : item.company_en === ''
                    ? item.company_cn
                    : item.company_en
                }}
              </p>
              <div class="progress">
                <div
                  class="progress-inner"
                  :style="{
                    width: progressFormat(item.contribute) + '%',
                  }"
                >
                  <span v-if="progressFormat(item.contribute) > 80">{{
                    toThousands(item.contribute)
                  }}</span>
                </div>
                <span v-if="progressFormat(item.contribute) < 80" class="val">{{
                  toThousands(item.contribute)
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div ref="slideRef1" class="slide-panel">
        <div v-if="isScroll1" class="backtop" @click="backtop1">
          {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
        </div>
        <div class="slide-panel-content">
          <h3 class="title">{{ t('userContributor') }}</h3>
          <the-form
            :option="formOption"
            :component-name="componentName"
            @get-contribute-info="getContributeInfo"
          ></the-form>
          <el-table
            v-loading="loading"
            :data="usePersonal.personalData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="48"
              align="center"
              :label="t('ranking')"
            />
            <el-table-column
              prop="gitee_id"
              align="left"
              label="Gitee ID"
              show-overflow-tooltip
              width="110"
            />
            <el-table-column :label="contributeType">
              <template #default="scope">
                <div class="box">
                  <span class="num">{{
                    toThousands(scope.row.contribute)
                  }}</span>
                  <el-progress
                    :show-text="false"
                    :stroke-width="8"
                    :color="progressColor"
                    :percentage="personalFormat(scope.row.contribute)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div class="slide-panel foot-panel">
        <div class="foot-item-logo">
          <img :src="useCommon.language === 'zh' ? logoZh : logo" alt="" />
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
          <p class="mail">{{ openCommunityInfo.email }}</p>
          <p class="copyright">{{ t('footer.copyright') }}</p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<style lang="scss" scoped>
$color: #7d32ea;
.swiper {
  height: 100vh;
  background: #f5f6f8;
  &.black {
    :deep(.swiper-pagination) {
      .swiper-pagination-bullet {
        background: #f5f6f8;
      }
      .swiper-pagination-bullet-active {
        background: $color;
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
    position: relative;
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
        font-size: 12px;
        .num {
          display: block;
          font-size: 32px;
          color: #fff;
        }
        &:first-child {
          grid-column: 1 / 4;
        }
        &:nth-child(2) {
          grid-column: 1 / 4;
        }
      }
    }
  }
  .slide-page3 {
    padding: 48px 16px 62px;
    box-sizing: border-box;
    .slide-panel {
      background: #fff;
      height: 100%;
      overflow: hidden auto;
      position: relative;
      scroll-behavior: smooth;
      &-content {
        padding: 16px;
        .title {
          font-size: 18px;
          margin-bottom: 24px;
        }
        :deep(.contributions-statistical) {
          margin: 0;

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
        line-height: 21px;
        p {
          font-size: 12px;
          color: #555;
        }
        .cy {
          color: #999;
          margin-top: 8px;
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
        padding: 0 5px;
        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .el-progress {
        flex: 1;
        display: inline-block;
        margin-left: 5px;
        &-bar__outer {
          background: none !important;
        }
      }
    }
  }
}

.search404 {
  text-align: center;
  margin-bottom: 40px;
  .cover {
    width: 80%;
    margin-bottom: 15px;
  }
  .text {
    font-size: 14px;
    color: #555;
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
    background: $color;
    box-shadow: 4px 8px 12px rgba(125, 50, 234, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
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
      background: $color;
      opacity: 1;
    }
  }
}
</style>
