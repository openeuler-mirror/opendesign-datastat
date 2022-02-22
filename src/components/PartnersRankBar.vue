<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { formatNumber } from '../shared/utils';
const chartDom = ref(null);

onMounted(() => {
  chartBar();
});

// chart bar 图表
function chartBar() {
  const chartInit = echarts.init(chartDom.value);
  const chartOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '1%',
      right: '0%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['华为', '麒麟软件', '中科院软件研究所', '通信软件', '中国联通软件研究所', '润和软件'],
      inverse: true,
      offset: 140,
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: function (value, index) {
          return index + 1 + '{flag|' + value + '}';
        },
        rich: {
          flag: {
            fontSize: 14,
            padding: 8,
            color: '#000',
          },
        },
        align: 'left',
        color: '#999',
        fontSize: 14,
      },
    },
    series: [
      {
        type: 'bar',
        data: [98180, 63414, 42159, 11000, 8341, 4807],
        label: {
          show: true,
          color: '#fff',
          position: 'insideRight',
          distance: 10,
          formatter: function (params) {
            let value = formatNumber(params.value);
            return value;
          },
        },
        itemStyle: {
          color: '#0062dc',
          shadowBlur: 10,
          shadowColor: 'RGBA(0, 98, 220, .6)',
          shadowOffsetY: 3,
        },
      },
    ],
  };

  chartOption && chartInit.setOption(chartOption);
}

// rank radio
const rankRadio = ref('PR');
const rankRadioChange = function (val) {
  console.log(val);
};
</script>
<template>
  <el-row>
    <el-col :span="12">
      <h3>Partnerships</h3>
    </el-col>
    <el-col :span="12">
      <div class="rankRadio">
        Rank by
        <el-radio-group v-model="rankRadio" @change="rankRadioChange">
          <el-radio-button label="PR"></el-radio-button>
          <el-radio-button label="Issue"></el-radio-button>
          <el-radio-button label="Review"></el-radio-button>
        </el-radio-group>
      </div>
    </el-col>
  </el-row>
  <div ref="chartDom" style="height: 500px; width: 100%"></div>
</template>
<style lang="scss" scoped>
.rankRadio {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: end;
  color: #999;
  .el-radio-group {
    margin-left: 12px;
  }
}
</style>
