<script setup>
import { ref, toRefs, watch, computed } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    default() {
      return null;
    },
  },
});

const { optData } = toRefs(props.options);
const optionsItem = ref(optData.value);

// chart bar 图表
const setOptions = computed(() => {
  const xAxisData = [
    '2021.06',
    '2021.06',
    '2021.06',
    '2021.06',
    '2021.06',
    '2021.06',
    '2021.06',
  ];

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}',
    },
    grid: {
      left: '1%',
      right: '0%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      axisLine: {
        onZero: false,
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: 2,
      min: 0,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
        },
      },
    },
    series: [
      {
        type: 'line',
        data: optionsItem.value,
        symbolSize: 8,
        smooth: true,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetY: 8,
        },
        markPoint: {
          data: [{ type: 'max', name: 'Max' }],
        },
      },
    ],
  };
});

// 监听数据变动
watch(
  optData,
  (newVal) => {
    if (optionsItem.value === newVal) {
      return;
    }
    optionsItem.value = newVal;
  },
  { deep: true }
);
</script>

<template>
  <chart-module :options="setOptions" :height="'220px'"></chart-module>
</template>

<style lang="scss" scoped></style>
