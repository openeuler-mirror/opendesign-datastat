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

const { seriesData } = toRefs(props.options);
const optionsItem = ref(seriesData.value);

// chart treemap
const setOptions = computed(() => {
  return {
    label: {
      position: 'insideTopLeft',
      formatter: function (params) {
        let arr = [
          '{value|' +
            params.data.value +
            '} {label|' +
            params.data.label +
            '} ',
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
});

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
  <chart-module :options="setOptions" :height="'500px'"></chart-module>
</template>

<style lang="scss" scoped></style>
