<template>
  <div class="card-chart">
    <div class="card-box">
      <p class="card-title">{{ title }}</p>
      <div class="card-total">
        <strong class="num">{{ formatNumber(total) }}</strong
        >in total
      </div>
    </div>
    <div class="chart-box">
      <p>
        <span class="num">{{ amount }}</span
        >in last 24h
      </p>
      <ChartView :options="setOptions()" :height="'70px'"></ChartView>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';
import { formatNumber } from '../shared/utils';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  amount: {
    type: String,
    default: '',
  },
  total: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: null,
  },
});

const { title, total, options, amount } = toRefs(props);
const seriesData = ref(options.value);

// 图表数据
function setOptions() {
  return {
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
        smooth: true,
        symbolSize: 0,
        lineStyle: {
          width: 2,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetY: 8,
        },
        color: 'rgba(0,112,241)',
        areaStyle: {
          opacity: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 117, 251,.5)',
              },
              {
                offset: 1,
                color: 'rgba(1, 0, 0,.1)',
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  };
}
// 监听数据变动
watch(
  options,
  (newVal) => {
    if (seriesData.value === newVal) {
      return;
    }
    seriesData.value = newVal;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.card-chart {
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  padding: 20px;
  background-color: #161820;
  .card-box {
    .card-title {
      font-size: 14px;
      color: #aaa;
      margin-bottom: 10px;
      line-height: 24px;
    }
    .card-total {
      font-size: 12px;
      color: #999;
      .num {
        font-size: 30px;
        color: #fff;
        margin-right: 3px;
      }
    }
  }
  .chart-box {
    p {
      font-size: 12px;
      color: #999;
      line-height: 24px;
      .num {
        color: #fff;
        margin-right: 3px;
      }
    }
  }
}
</style>
