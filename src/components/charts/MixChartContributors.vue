<script setup>
import { toRefs, watch, ref, computed } from 'vue';
import { formatNumber } from '../../shared/utils';

const props = defineProps({
  title: {
    type: String,
    default() {
      return '';
    },
  },
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
  lineData: {
    type: Object,
    default() {
      return null;
    },
  },
  pieData: {
    type: Object,
    default() {
      return null;
    },
  },
});

const { title, total, amount, lineData, pieData } = toRefs(props);

// 图表数据 line
const lineOptions = ref(lineData.value);
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

const setLineOptions = computed(() => {
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
        data: lineOptions.value.line1,
        ...seriesOption,
        color: 'rgba(0,112,241)',
      },
      {
        data: lineOptions.value.line2,
        ...seriesOption,
        color: 'rgba(39, 148, 103)',
      },
    ],
  };
});

// 监听数据变动 line
watch(
  lineData,
  (newVal) => {
    if (lineOptions.value === newVal) {
      return;
    }
    lineOptions.value = newVal;
  },
  { deep: true }
);

// 图表数据 pie
const pieOptions = ref(pieData.value);
const pieTotal = 100;
const setPieOptions = computed(() => {
  return {
    series: [
      {
        name: '通过率' + pieOptions.value.pieVal + '%',
        type: 'pie',
        radius: ['90%', '96%'],
        showEmptyCircle: true,
        label: {
          show: true,
          position: 'center',
          fontSize: '15',
          color: '#fff',
        },
        emphasis: {
          scale: false,
        },
        data: [
          {
            value: pieOptions.value.pieVal, //需要显示的数据
            name: pieOptions.value.pieVal + '%',
            itemStyle: {
              color: 'rgb(45, 180, 124)',
            },
          },
          {
            value: pieTotal - pieOptions.value.pieVal,
            itemStyle: {
              color: 'rgb(40, 45, 53)',
            },
          },
        ],
      },
    ],
  };
});

// 监听数据变动 pie
watch(
  pieData,
  (newVal) => {
    if (pieOptions.value === newVal) {
      return;
    }
    pieOptions.value = newVal;
  },
  { deep: true }
);
</script>

<template>
  <div class="mix-chart">
    <div class="mix-total">
      <p class="title">{{ title }}</p>
      <div class="total">
        <strong class="num">{{ formatNumber(total) }}</strong
        >in total
      </div>
      <p class="text">
        <span class="amount">{{ amount }}</span
        >in last 24h
      </p>
    </div>

    <div class="chart-pie">
      <chart-module
        :options="setPieOptions"
        :width="'80px'"
        :height="'80px'"
      ></chart-module>
      <div class="chart-pie-info">
        <p class="title">{{ pieData.title }}</p>
        <p class="total">
          <span class="num">{{ pieData.total }}</span> in total
        </p>
        <p class="text">
          <span class="amount">{{ pieData.amount }}</span> last 24h
        </p>
      </div>
    </div>

    <div class="chart-box">
      <p class="title">Increment Trend</p>
      <chart-module :options="setLineOptions" :height="'180px'"></chart-module>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-chart {
  display: grid;
  grid-template-columns: auto auto auto;
  border-radius: 10px;
  padding: 20px;
  background-color: #161820;
  .chart-box {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
  }
  .title {
    font-size: 16px;
    color: rgb(198, 207, 220);
    margin-bottom: 10px;
    line-height: 24px;
  }
  .text {
    font-size: 12px;
    color: #999;
    margin-top: 10px;
    .amount {
      color: #ccc;
      font-size: 14px;
      margin-right: 3px;
    }
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
  .chart-pie {
    display: flex;
    &-info {
      padding-left: 12px;
      .num {
        color: rgb(198, 207, 220);
        font-size: 18px;
      }
    }
  }
}
</style>
