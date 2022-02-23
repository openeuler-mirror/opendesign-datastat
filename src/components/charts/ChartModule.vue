<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
  toRefs,
  computed,
  nextTick,
} from 'vue';
import * as echarts from 'echarts';
const props = defineProps({
  options: {
    type: Object,
    default() {
      return null;
    },
  },
  width: {
    type: String,
    default() {
      return '100%';
    },
  },
  height: {
    type: String,
    default() {
      return '300';
    },
  },
});
const chartDom = ref(null);
const chart = ref(null);
const { options, width, height } = toRefs(props);
const optionsItem = ref(options.value);

// 初始化图表
const initChart = () => {
  chart.value = echarts.init(chartDom.value);
  chart.value.setOption(optionsItem.value);
};
// 动态样式设置
const style = computed(() => {
  return {
    height: height.value,
    width: width.value,
  };
});

// 销毁图表
const destroyChart = () => {
  if (!chart.value) {
    return;
  }
  chart.value.dispose();
  chart.value = null;
};

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

watch(
  options,
  (newVal) => {
    if (optionsItem.value === newVal) {
      return;
    }
    optionsItem.value = newVal;
    if (chart.value) {
      chart.value.setOption(optionsItem.value);
      chart.value.resize({
        animation: {
          duration: 300,
        },
      });
      destroyChart();
      initChart();
    }
  },
  { deep: true }
);

onUnmounted(() => {
  destroyChart();
});
</script>

<template>
  <div ref="chartDom" class="chartDom" :style="style"></div>
</template>

<style lang="scss" scoped>
.chartDom {
  width: 100%;
  height: 300px;
}
</style>
