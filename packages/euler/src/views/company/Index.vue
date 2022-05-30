<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { useCompanyStore } from '@/stores/company';
import { IObject } from 'shared/@types/interface';
import OAnchor from 'shared/components/OAnchor.vue';
import OEchartCircularPile from 'shared/components/OEchartCircularPile.vue';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const useCompany = useCompanyStore();
const useCommon = useCommonStore();
const sencondTitle = ref('');
const { t } = useI18n();
const getSencondTitle = (value?: string) => {
  const name = value || route.params.name;
  const findOne =
    useCompany.companyData.find(
      (item: IObject) => item.company_cn === name || item.company_en === name
    ) || useCompany.companyData[0];
  const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
  return (findOne && findOne[key]) || name;
};
watch(
  () => useCompany.companyData,
  () => {
    sencondTitle.value = getSencondTitle();
  },
  { deep: true }
);
watch(
  () => useCommon.language,
  () => {
    sencondTitle.value = getSencondTitle(sencondTitle.value);
  }
);
onMounted(() => {
  useCompany.getCompanyData();
});
</script>
<template>
  <div class="container">
    <o-anchor top="11rem"></o-anchor>
    <OEchartCircularPile id="OEchartCircularPile"></OEchartCircularPile>
    <div class="wrap">
      <div class="step">
        <span class="step-one">{{ t('nav.contributors') }}</span>
        <span> > {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">company</div>
        <div class="main-right">123w</div>
      </div>
    </div>
  </div>
  <footer>
    <app-footer></app-footer>
  </footer>
</template>
<style lang="scss" scoped>
.container {
  margin-top: 80px;
  min-height: 900px;
  background-color: #f5f6f8;
}
.step {
  padding: 40px 0;
  font-size: 12px;
  &-one {
    color: #002fa7;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
  &-right {
    background-color: #ffffff;
  }
}
</style>
