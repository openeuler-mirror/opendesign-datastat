<script setup lang="ts">
import OEchartLine from 'shared/components/OEchartLine.vue';
import TheForm from '@/components/TheForm.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';

const { t } = useI18n();
const firstformOption = computed(() => {
  return [
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'lastonemonth',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
const selectTime = ref('lastonemonth');
const getContributeInfo = (e: IObject) => {
  selectTime.value = e.active;
};
</script>
<template>
  <div>
    <the-form
      :option="firstformOption"
      @get-contribute-info="getContributeInfo($event)"
    ></the-form>
    <o-echart-line id="historicalVitalityIndicatorsEchart"></o-echart-line>
  </div>
</template>
<style lang="scss" scoped></style>
