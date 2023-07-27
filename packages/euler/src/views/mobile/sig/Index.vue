<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { useCommonStore } from '@/stores/common';
import { querySigName } from 'shared/api';
import { useRoute, useRouter } from 'vue-router';
import OMobileTemplate from 'shared/components/OMobileTemplate.vue';
import DropSelect from '../common/DropSelect.vue';
import Introduction from './Introduction.vue';
import VitalIndex from './VitalIndex.vue';
import MobileHistoricalTrend from './MobileHistoricalTrend.vue';
import MobileTableList from './MobileTableList.vue';
import MobileContributList from './MobileContributList.vue';
import { hasPermission } from 'shared/utils/login';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const useCommon = useCommonStore();
useCommon.isBlackHeader = false;
const modules = [Pagination];
const swiperRef: any = ref(null);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper: any) => {
  useCommon.sigNav = swiper.activeIndex;
  router.replace({
    query: {
      num: swiper.activeIndex,
    },
  });
};
// 监听导航跳转
watch(
  () => useCommon.sigNav,
  (index) => {
    swiperRef.value.slideTo(index);
  }
);

// 顶部选择
const sencondTitle = ref('');
const drownData = ref([] as IObject[]);
const getDrownData = () => {
  let community = 'openeuler';
  querySigName(community).then((data) => {
    const allSigs = data?.data?.openeuler || [];
    allSigs.sort((a: any, b: any) => a.localeCompare(b));
    const { name } = route.params;
    sencondTitle.value =
      allSigs.find((item: any) => item === name) || allSigs[0] || name;
    drownData.value = allSigs.map((item: string) => ({
      label: item,
      value: item,
    }));
  });
};
onMounted(() => {
  getDrownData();
  !swiperRef.value.destroyed && swiperRef.value.slideTo(route.query.num || 0);
});
</script>

<template>
  <div class="company">
    <div class="edropdown">
      <drop-select v-model:value="sencondTitle" :data="drownData"></drop-select>
    </div>
    <swiper
      :pagination="true"
      :modules="modules"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide>
        <o-mobile-template header="introduction" padding-top="0.75rem">
          <template #content>
            <introduction :sig="sencondTitle"></introduction
          ></template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide v-if="hasPermission('SIGread')">
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ 'SIG ' + t('currentVitalityIndex') }}
          </template>
          <template #content>
            <vital-index :sig="sencondTitle"></vital-index>
          </template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide v-if="hasPermission('SIGread')">
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ 'SIG ' + t('historicalVitalityIndicators') }}
          </template>
          <template #content>
            <mobile-historical-trend
              :sig="sencondTitle"
            ></mobile-historical-trend
          ></template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide v-if="hasPermission('SIGread')">
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ 'SIG ' + t('companyContributor') }}
          </template>
          <template #content>
            <mobile-table-list :sig="sencondTitle"></mobile-table-list
          ></template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ 'SIG ' + t('userContributor') }}
          </template>
          <template #content
            ><mobile-contribut-list :sig="sencondTitle"></mobile-contribut-list
          ></template>
        </o-mobile-template>
      </swiper-slide>
    </swiper>
  </div>
</template>
<style lang="scss" scoped>
.swiper {
  height: calc(100vh - 5rem);
}
.company {
  height: 100vh;
  background: #f5f6f8;
}
.edropdown {
  padding-top: 3.5rem;
}

// 轮播图按钮样式修改
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
