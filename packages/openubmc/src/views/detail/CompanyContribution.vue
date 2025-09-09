<script setup lang="ts">
import CompanyDataBarChart from '@/views/detail/CompanyDataBarChart.vue';
import SectionCard from '@/components/SectionCard.vue';
import { useCompanyStore } from '@/stores/company';
import { ODivider, OIcon, OIconSearch, OInput, ORadio, ORadioGroup, OToggle } from '@opensig/opendesign';
import { computed, onMounted, ref } from 'vue';
import ToggleRadios from '@/components/ToggleRadios.vue';
import { useI18n } from 'vue-i18n';
import useCommonFilters from '@/composables/useCommonFilters';

const companyStore = useCompanyStore();
const { t } = useI18n();

const versionChecked = ref(true);
const contributionTypeOptions = computed(() => [
  { label: t('common.home.prs'), value: 'pr' },
  { label: t('common.home.issues'), value: 'issue' },
  { label: t('common.home.comments'), value: 'comment' },
]);

const displayRangeOptions = computed(() => [
  { label: t('common.from.all'), value: 0 },
  { label: 'Top10', value: 10 },
  { label: 'Top20', value: 20 },
]);

onMounted(() => {
  companyStore.getCompanyData();
});

const { disabledTimeRange } = useCommonFilters();
</script>

<template>
  <SectionCard>
    <template #header>{{ t('common.companyContributor') }}</template>
    <div class="unit-member-contribution">
      <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
        <ElFormItem :label="t('common.from.version')">
          <OToggle v-model:checked="versionChecked">{{ t('common.from.all') }}</OToggle>
        </ElFormItem>
        <ElFormItem :label="t('common.from.type')">
          <ToggleRadios v-model="companyStore.companyForm.contributeType" :options="contributionTypeOptions" @change="companyStore.getCompanyData" />
        </ElFormItem>
        <ElFormItem :label="t('common.from.timeRange')">
          <ElDatePicker
            v-model="companyStore.companyForm.timeRange"
            unlink-panels
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="companyStore.getCompanyData"
            :disabled-date="disabledTimeRange"
          />
        </ElFormItem>
      </ElForm>

      <ODivider direction="h" style="--o-divider-gap: 24px" />

      <div class="search-range-select">
        <OInput v-model="companyStore.searchVal" :placeholder="t('common.Pleaseenterunitnameforsearch')">
          <template #prefix
            ><OIcon style="font-size: 16px"><OIconSearch /></OIcon
          ></template>
        </OInput>
        <div class="range-select">
          <p class="title">{{ t('common.from.displayRange') }}</p>
          <ORadioGroup v-model="companyStore.displayCount" style="--radio-group-gap: 8px">
            <ORadio v-for="item in displayRangeOptions" :key="item.value" :value="item.value">
              <template #radio="{ checked }">
                <OToggle :checked="checked">{{ item.label }}</OToggle>
              </template>
            </ORadio>
          </ORadioGroup>
        </div>
      </div>

      <CompanyDataBarChart />
    </div>
  </SectionCard>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  padding-right: 40px;
  @include text1;
  line-height: var(--o-control_size-m) !important;
}

.search-range-select {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;

  .range-select {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      margin-right: 16px;
    }
  }
}
</style>
