<script setup>
import { ref, toRefs, watch } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    default() {
      return null;
    },
  },
});

const { seriesData } = toRefs(props.options);
const optionsItem = ref(seriesData.value);
// chart bar 图表
function setOptions() {
  return {
    label: {
      position: 'insideTopLeft',
      formatter: function (params) {
        let arr = [
          '{value|' + params.data.value + '} {label|' + params.data.label + '} ',
          '{name|' + params.name + '}',
        ];
        //   console.log(params);
        return arr.join('\n');
      },
      rich: {
        value: {
          fontSize: 16,
          color: '#fff',
          padding: [2, 4],
          lineHeight: 25,
        },
        label: {
          fontSize: 9,
          color: '#fff',
          padding: [2, 4],
          lineHeight: 25,
        },
        name: {
          fontSize: 12,
          color: '#fff',
        },
      },
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        nodeClick: false,
        width: '100%',
        label: {
          position: [10, 10],
        },
        itemStyle: {
          color: 'rgba(12, 78, 4, 1)',
          gapWidth: 2,
        },
        breadcrumb: {
          show: false,
        },
        data: optionsItem.value,
      },
    ],
  };
}
// 监听数据变动
watch(
  seriesData,
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
  <h1>合作企业开发者数量占比</h1>
  <ChartView :options="setOptions()" :height="'500px'"></ChartView>
</template>
<style lang="scss" scoped></style>
