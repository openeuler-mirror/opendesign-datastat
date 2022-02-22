<script setup>
import { ref, toRefs, watch } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    default() {
      return null;
    },
  },
});

const { options } = toRefs(props);
const optionsItem = ref(options.value);

// 动态处理数据
function seriesOpt(data) {
  const list = [];
  for (let i = 0; i < data.length; i++) {
    list.push({
      name: data[i].name,
      data: data[i].data,
      type: 'line',
      smooth: true,
      symbolSize: 2,
      endLabel: {
        show: true,
        color: 'inherit',
        formatter: function (params) {
          return params.seriesName;
        },
      },
    });
  }
  return list;
}

// 图表数据
function setOptions() {
  // x上下轴
  const xAxisDataTop = ['2021.06', '2021.06', '2021.06', '2021.06', '2021.06', '2021.06', '2021.06'];
  const xAxisDataBottom = ['2021.06', '2021.06', '2021.06', '2021.06', '2021.06', '2021.06', '2021.06'];

  return {
    tooltip: {
      trigger: 'item',
      position: 'right',
      formatter: function (params) {
        let showText = '';
        showText =
          "<span style='font-size:12px;color:#999;'>" +
          params.name +
          '</span>' +
          "<br><span style='width: 12px;height: 3px;display: inline-block;vertical-align:middle;margin-right:5px;background:" +
          params.color +
          "'></span>" +
          params.seriesName +
          "<span style='font-size:18px;margin-left:10px;color:#000;'>" +
          params.value +
          '</span><br>';
        return showText;
      },
    },
    grid: {
      left: '1%',
      right: '8%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        position: 'top',
        data: xAxisDataTop,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          show: false,
        },
        splitLine: {
          show: true,
        },
        offset: 20,
      },
      {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        axisLine: {
          onZero: false,
          show: false,
        },
        offset: 15,
        data: xAxisDataBottom,
      },
    ],
    yAxis: {
      type: 'value',
      inverse: true,
      show: true,
      min: 1,
    },
    series: seriesOpt(optionsItem.value),
  };
}
// 监听数据变动
watch(
  options,
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
  <ChartView :options="setOptions()" :height="'500px'"></ChartView>
</template>
<style lang="scss" scoped></style>
