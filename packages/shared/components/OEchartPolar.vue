<script setup lang="ts">
import { ref, watch } from 'vue';
import OEchart from './OEchart.vue';
import { Color } from 'echarts';
import { getColorOpcity } from '../utils/helper';
type EChartsOption = echarts.EChartsOption;
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: 'container',
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  fieldsKey: {
    type: Array as () => string[],
    required: true,
    default: () => ['sig', 'average'],
  },
  color: {
    type: Array as () => Color[],
    default: () => ['#002FA7', '#bbbbbb'],
  },
  width: {
    type: String,
    default: '350px',
  },
  height: {
    type: String,
    default: '256px',
  },
  titleKey: {
    type: String,
    default: 'title',
  },
});
const getOption = (): EChartsOption => {
  return {
    color: props.color,
    tooltip: {
      show: true,
      trigger: 'item',
    },
    radar: [
      {
        indicator: props.data.map((item: any) => ({
          text: item.title,
        })),
        center: ['50%', '55%'],
        radius: 80,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '{value}',
          color: '#8D98AA',
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(255, 255, 255, 1)', 'rgba(250, 250, 250, 1)'],
            shadowColor: 'rgba(250, 250, 250, 0.6)',
            shadowBlur: 8,
          },
        },
      },
    ],
    series: [
      {
        type: 'radar',
        areaStyle: {},
        lineStyle: {
          width: 0.5,
        },
        emphasis: {
          lineStyle: {
            width: 1.5,
          },
          focus: 'self',
        },
        data: getSeriesData(),
      },
    ],
  };
};
const getSeriesData = () => {
  return props.fieldsKey.map((key: string, index: number) => {
    return {
      value: props.data.map((item: any) => item[key]),
      name: key,
      symbolSize: 4,
      areaStyle: {
        color: getColorOpcity(props.color[index] as string, 0.2),
      },
    };
  });
};
const option = ref({} as EChartsOption);
option.value = getOption();
watch(
  () => props.data,
  () => (option.value = getOption()),
  { deep: true }
);
</script>
<template>
  <o-echart
    :id="id"
    :option="(option as EChartsOption)"
    :width="width"
    :height="height"
  ></o-echart>
</template>
