<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { useCommonStore } from '@/stores/common';
import { queryCompanySigs } from 'shared/api';
import { useRoute } from 'vue-router';
import OMobileTemplate from 'shared/components/OMobileTemplate.vue';
import DropSelect from '../common/DropSelect.vue';
import Introduction from './Introduction.vue';
import Technology from './Technology.vue';
import Contribution from './Contribution.vue';
const { t } = useI18n();
const route = useRoute();
const useCommon = useCommonStore();
useCommon.isBlackHeader = false;
const modules = [Pagination];
const swiperRef: any = ref(null);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper: any) => {
  useCommon.companyNav = swiper.activeIndex;
};
// 监听导航跳转
watch(
  () => useCommon.companyNav,
  (index) => {
    swiperRef.value.slideTo(index);
  }
);

// 顶部选择
const sencondTitle = ref('');
const drownData = ref([] as IObject[]);
const getSencondTitle = () => {
  const query = {
    timeRange: 'lastoneyear',
    community: 'openeuler',
  };
  queryCompanySigs(query).then((data) => {
    const allcompany = data?.data || [];
    const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
    drownData.value = allcompany.map((item: IObject) => {
      return {
        value: item.company_cn,
        label: item[key],
      };
    });
    drownData.value.sort((a, b) => a.value.localeCompare(b.value));
    allcompany.sort((a: any, b: any) =>
      a.company_cn.localeCompare(b.company_cn)
    );
    const { name } = route.params;
    sencondTitle.value =
      drownData.value.find((item: IObject) => item.value === name)?.value ||
      drownData.value[0]?.value ||
      name;
  });
};
onMounted(() => {
  getSencondTitle();
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
        <o-mobile-template
          header="Currentcontributionranking"
          padding-top="0.75rem"
        >
          <template #content>
            <introduction :title="sencondTitle"></introduction
          ></template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ t('company') + ' ' + t('ecological') }}
          </template>
          <template #content>
            <technology :title="sencondTitle"></technology>
          </template>
        </o-mobile-template>
      </swiper-slide>
      <swiper-slide>
        <o-mobile-template padding-top="0.75rem">
          <template #header>
            {{ t('company') + ' ' + t('staffContributor') }}
          </template>
          <template #content
            ><contribution :title="sencondTitle"></contribution
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
