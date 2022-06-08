<script setup lang="ts">
import OEchartLine from 'shared/components/OEchartLine.vue';
import OFormRadio from '@/components/OFormRadio.vue';
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
const echartData = ref([
  {
    name: computed(() => t('combinedActivity')),
    data: [
      {
        time: '2022/04/08',
        value: 0.1,
      },
      {
        time: '2022/04/09',
        value: 0.3,
      },
    ],
  },
  {
    name: computed(() => t('Commitcontribution')),
    data: [
      {
        time: '2022/04/08',
        value: 0.3,
      },
      {
        time: '2022/04/09',
        value: 0.2,
      },
    ],
  },
]);
const getContributeInfo = (e: IObject) => {
  selectTime.value = e.active;
};
</script>
<template>
  <div>
    <o-form-radio
      :option="firstformOption"
      @get-contribute-info="getContributeInfo($event)"
    >
    </o-form-radio>
    <o-echart-line
      id="historicalVitalityIndicatorsEchart"
      :data="echartData"
    ></o-echart-line>
  </div>
</template>
<style lang="scss" scoped></style>
