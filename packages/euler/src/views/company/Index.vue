<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { useCompanyStore } from '@/stores/company';
import { IObject } from 'shared/@types/interface';
import OAnchor from 'shared/components/OAnchor.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const useCompany = useCompanyStore();
const useCommon = useCommonStore();
const sencondTitle = ref('');
const getSencondTitle = () => {
  const { name } = route.params;
  const findOne =
    useCompany.companyData.find((item: IObject) => item.company_cn === name) ||
    useCompany.companyData[0];
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
onMounted(() => {
  useCompany.getCompanyData();
  useCompany.companyData
});
</script>
<template>
  <div class="container">
    <o-anchor top="11rem"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one">社区贡献</span>
        <span> > {{ useCompany.companyData[0]?.company_cn }}</span>
      </div>
      <div class="main">
        <div class="main-left">
          <div v-for="(item, index) in useCompany.companyData" :key="index">
            {{ item.company_cn }}
          </div>
        </div>
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
