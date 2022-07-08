<script setup lang="ts">
import OEchart from './OEchart.vue';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
type EChartsOption = echarts.EChartsOption;
const { t } = useI18n();
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
    type: Object,
    required: true,
    default: () => ({
      D0: 50,
      D1: 30,
      D2: 10,
    }),
  },
  width: {
    type: String,
    default: '248px',
  },
  height: {
    type: String,
    default: '248px',
  },
});
const colorMap = {
  D2: '#002FA7',
  D1: '#5272C4',
  D0: '#A3B4E0',
};
const getD1Sqrt = () => {
  return (Math.sqrt(props?.data?.D1) / Math.sqrt(props?.data?.D0)) * 100 || 0;
};
const getD2Sqrt = () => {
  return (Math.sqrt(props?.data?.D2) / Math.sqrt(props?.data?.D0)) * 100 || 0;
};

const getOption = (): EChartsOption => {
  return {
    series: [
      {
        name: 'D0 贡献者',
        type: 'pie',
        center: ['50%', '50%'],
        radius: '100%',
        zlevel: 1,
        label: {
          show: false,
        },
        data: [
          {
            value: props.data.D0,
            name: 'D0 贡献者',
            itemStyle: {
              color: '#A3B4E0',
            },
          },
        ],
        emphasis: {
          disabled: true,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,

            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        name: 'D1 贡献者',
        type: 'pie',
        center: ['50%', `${50 - (100 - getD1Sqrt()) / 2}%`],
        zlevel: 2,
        label: {
          show: false,
        },
        radius: `${getD1Sqrt()}%`,
        animation: false,
        data: [
          {
            value: props.data.D1,
            name: 'D1 贡献者',
            itemStyle: {
              color: '#5272C4',
            },
          },
        ],
        emphasis: {
          disabled: true,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        name: 'D2 贡献者',
        type: 'pie',
        center: ['50%', `${50 - (100 - getD2Sqrt()) / 2}%`],
        zlevel: 3,
        label: {
          show: false,
        },
        radius: `${getD2Sqrt()}%`,
        animation: false,
        data: [
          {
            value: props.data.D2,
            name: 'D2 贡献者',
            itemStyle: {
              color: '#002FA7',
            },
          },
        ],
        emphasis: {
          disabled: true,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
};
let option = ref({});
option.value = getOption();
watch(
  () => props.data,
  () => {
    option.value = getOption();
  },
  { deep: true }
);
</script>
<template>
  <div class="pile">
    <o-echart
      :id="id"
      :option="option"
      :width="width"
      :height="height"
    ></o-echart>
    <div class="legend" :style="{ height }">
      <div v-for="(value, key) in colorMap" :key="key" class="desc">
        <div class="title">
          <div class="point" :style="{ 'background-color': value }"></div>
          {{ key + ' ' + t('contributors') }}
        </div>
        <div class="value">
          {{ data[key] }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pile {
  display: flex;
  align-items: center;
}
.legend {
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.desc {
  .title {
    font-size: 12px;
    color: #4e5865;
    display: flex;
    align-items: center;
    .point {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
  .value {
    font-size: 16px;
    color: #000;
    font-weight: 600;
  }
}
</style>
