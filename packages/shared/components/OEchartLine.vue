<script setup lang="ts">
import { IObject } from '../@types/interface';
import { ref, watch } from 'vue';
import OEchart from './OEchart.vue';
type EChartsOption = echarts.EChartsOption;
type SeriesOption = echarts.SeriesOption;
type Color = echarts.Color;
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: '',
  },
  name: {
    type: String,
    default: '--',
  },
  data: {
    type: Array,
    required: true,
    default: () => [
      {
        name: '综合活跃度',
        data: [
          {
            created_at: '2022/04/08',
            score: 0.1,
          },
          {
            created_at: '2022/04/09',
            score: 0.3,
          },
        ],
      },
    ],
  },
  color: {
    type: Array as () => Color[],
    default: () => [
      '#002FA7',
      '#FEB32A',
      '#4AAEAD',
      '#FC756C',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ],
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '300px',
  },
});
const getLegendData = () => {
  return props.data.map((item: any) => item.name);
};
const getLegendSelectData = (): IObject => {
  return props.data.reduce((pre: IObject, next: any, index: number) => {
    pre[next.name] = !index ? true : false;
    return pre;
  }, {});
};
const getxAxisData = () => {
  return props.data
    .reduce((pre: any[], next: any) => {
      if (next.data.length > pre?.length) {
        pre = next.data;
      }
      return pre;
    }, [])
    .map((item) => dealTime(item.created_at));
};
const dealTime = (time: string) => {
  const _time = new Date(time);
  return `${_time.getFullYear()}/${_time.getMonth() + 1}/${_time.getDate()}`;
};
const getSeriesData = (): SeriesOption[] => {
  return props.data.map(
    (item: any): SeriesOption => ({
      name: item.name,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: item.data.map((it: IObject) => it.score),
    })
  );
};
const getOption = (): EChartsOption => {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function (info: any) {
        const arr = info.map((item: IObject) => {
          const { color, data, seriesName } = item;
          return `
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div style="display: flex;align-items: center">
              <div style="display: inline-block;
                    width: 20px;
                    height: 4px;
                    margin-right: 8px;
                    background-color: ${color}">
              </div>
              <span style="font-size:12px;color: #000000">${seriesName}</span>
            </div>
            <span style="font-size:16px;color: #000000;margin-left:24px; font-weight: 500;text-align: right">
              ${data.toFixed(2)}
            </span>
          </div>
          `;
        });
        return [
          `<div style="font-size:12px;color: #9097A3">${info[0]?.axisValue}</div>`,
          ...arr,
        ].join('');
      },
    },
    legend: {
      icon: 'path://M0,0 L20, 0L20, 4L0, 4L0, 0z',
      left: 0,
      itemGap: 30,
      data: getLegendData(),
      selected: getLegendSelectData(),
    },
    color: props.color,
    grid: {
      left: '1%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getxAxisData(),
    },
    yAxis: {
      type: 'value',
      max: 1,
      min: 0,
      splitNumber: 2,
    },
    series: getSeriesData(),
  };
};
const option = ref({} as EChartsOption);
option.value = getOption();
watch(
  () => props.name,
  () => (option.value = getOption())
);
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
