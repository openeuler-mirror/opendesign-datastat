<template>
  <div class="company">
    <div class="edropdown">
      <!-- <drop-select v-model:value="sencondTitle" :data="drownData"></drop-select> -->
    </div>
    <swiper
      :pagination="true"
      :modules="modules"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <!-- <template #header>
            {{ 'SIG ' + t('historicalVitalityIndicators') }}
          </template> -->
          <template #content>
            <info :user="sencondTitle"></info>
           </template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ t('SIGContribution') }}
          </template>
          <template #content>
            <sig-contribution :user="sencondTitle"></sig-contribution>
          </template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ t('DynamicContribute') }}
          </template>
          <template #content
            ><contribution-dynamic></contribution-dynamic>
          </template>
        </o-mobile-template>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup lang="ts">
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
import ContributionDynamic from './ContributionDynamic.vue';
import SigContribution from './SigContribution.vue';
import Info from './Info.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const sencondTitle = ref('');
sencondTitle.value = route.params.name as string;
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
// const sencondTitle = ref('');
// const drownData = ref([] as IObject[]);
// const getDrownData = () => {
//   let community = 'openeuler';
//   querySigName(community).then((data) => {
//     const allSigs = data?.data?.openeuler || [];
//     allSigs.sort((a: any, b: any) => a.localeCompare(b));
//     const { name } = route.params;
//     sencondTitle.value =
//       allSigs.find((item: any) => item === name) || allSigs[0] || name;
//     drownData.value = allSigs.map((item: string) => ({
//       label: item,
//       value: item,
//     }));
//   });
// };
// onMounted(() => {
//   getDrownData();
//   !swiperRef.value.destroyed && swiperRef.value.slideTo(route.query.num || 0);
// });
</script>
<style scoped lang="scss">
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
