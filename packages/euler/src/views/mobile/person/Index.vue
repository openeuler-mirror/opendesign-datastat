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
            ><contribution-dynamic :sig="sencondTitle"></contribution-dynamic>
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
import { querySigName, queryUserList } from 'shared/api';
import { useRoute, useRouter } from 'vue-router';
import OMobileTemplate from 'shared/components/OMobileTemplate.vue';
import ContributionDynamic from './ContributionDynamic.vue';
import SigContribution from './SigContribution.vue';
import Info from './Info.vue';
import DropSelect from '../common/DropSelect.vue';
import { openCommunityInfo } from '@/api';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const sencondTitle = ref('');
// sencondTitle.value = route.params.name as string;
const sigTitle = ref('');
sigTitle.value = route.query.organization as string;
const group = ref('');
group.value = route.query.group as string;
const useCommon = useCommonStore();
useCommon.isBlackHeader = false;
const modules = [Pagination];
const swiperRef: any = ref(null);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper: any) => {
  useCommon.personNav = swiper.activeIndex;
  router.replace({
    query: {
      num: swiper.activeIndex,
    },
  });
};
// 监听导航跳转
watch(
  () => useCommon.personNav,
  (index) => {
    swiperRef.value.slideTo(index);
  }
);
const allSigs = ref();
const drownData = ref([] as any[]);
const getDrownData = () => {
  const query = {
    // group: group.value,
    community: openCommunityInfo.name,
    // name: sigTitle.value,
  };
  queryUserList(query as any).then((data) => {
    allSigs.value = data?.data || {};
    allSigs.value.sort((a: any, b: any) => a.localeCompare(b));
    const { name } = route.params;
    sencondTitle.value =
      allSigs.value.find((item: any) => item === name) ||
      allSigs.value[0] ||
      name;
    drownData.value = allSigs.value.map((item: string) => ({
      label: item,
      value: item,
    }));
  });
};
getDrownData();
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
