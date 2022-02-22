<template>
  <div class="card-chart">
    <div class="card-box">
      <p class="title">All Contributors</p>
      <div class="total">
        <strong class="num">{{ formatNumber(total) }}</strong
        >in total
      </div>
      <p class="text">
        <span class="amount">{{ amount }}</span
        >in last 24h
      </p>
      <div>
        <div ref="pieDom" class="chart-pie"></div>
      </div>
    </div>
    <div class="chart-box">
      <p>Increment Trend</p>
      <ChartView :options="setOptions()" :height="'180px'"></ChartView>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';
import { formatNumber } from '../shared/utils';
const props = defineProps({
  total: {
    type: String,
    default() {
      return '';
    },
  },
  amount: {
    type: String,
    default() {
      return '';
    },
  },
  seriesData: {
    type: Array,
    default() {
      return null;
    },
  },
  seriesData1: {
    type: Array,
    default() {
      return null;
    },
  },
});
const { total, seriesData, seriesData1, amount } = toRefs(props);

// 图表数据
const seriesOption = {
  type: 'line',
  smooth: true,
  symbolSize: 0,
  lineStyle: {
    width: 2,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowBlur: 10,
    shadowOffsetY: 8,
  },
};
function setOptions() {
  return {
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: seriesData.value,
        ...seriesOption,
        color: 'rgba(0,112,241)',
      },
      {
        data: seriesData1.value,
        ...seriesOption,
        color: 'rgba(39, 148, 103)',
      },
    ],
  };
}
// 监听数据变动
watch(
  [seriesData, seriesData1],
  (newVal) => {
    if (seriesData.value === newVal || seriesData1.value === newVal) {
      return;
    }
    seriesData.value = newVal;
    seriesData1.value = newVal;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.card-chart {
  display: grid;
  grid-template-columns: 250px auto;
  border-radius: 10px;
  padding: 20px;
  background-color: #161820;
  .card-box {
    width: 300px;
    .title {
      font-size: 14px;
      color: #aaa;
      margin-bottom: 10px;
      line-height: 24px;
    }
    .text {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
    .total {
      font-size: 12px;
      color: #999;
      .num {
        font-size: 30px;
        color: #fff;
        margin-right: 3px;
      }
    }
  }
  .chartBox {
    flex: 1;
    p {
      font-size: 12px;
      color: #999;
      line-height: 24px;
      .amount {
        color: #fff;
        margin-right: 3px;
      }
    }
    .chart {
      width: 100%;
      height: 180px;
    }
  }
}
</style>
