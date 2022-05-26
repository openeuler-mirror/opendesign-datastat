<script setup lang="ts">
import { getColorOpcity } from '../utils/helper';
import OEchart from './OEchart.vue';
type EChartsOption = echarts.EChartsOption;
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: '',
  },
  name: {
    type: String,
    required: true,
    default: '--',
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  color: {
    type: String,
    default: '#002FA7',
  },
  width: {
    type: String,
    default: '300px',
  },
  height: {
    type: String,
    default: '300px',
  },
});
const option: EChartsOption = {
  series: [
    {
      name: 'Outer',
      type: 'pie',
      radius: ['50%', '62%'],
      emphasis: {
        disabled: true,
        label: {
          show: false,
        },
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      animation: false,
      data: [
        {
          value: 1,
          itemStyle: {
            color: '#F4F6FA',
            shadowBlur: 10,
            shadowOffsetY: 1,
            shadowColor: getColorOpcity(props.color, 0.1),
          },
        },
      ],
    },
    {
      name: 'Inner',
      type: 'pie',
      radius: ['0%', '50%'],
      zlevel: 0,
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      animation: false,
      data: [
        {
          value: 1,
          itemStyle: {
            color: '#FFF',
          },
        },
      ],
    },
    {
      type: 'gauge',
      zlevel: 1,
      startAngle: 230,
      endAngle: -50,
      min: 0.0,
      max: 1.0,
      splitNumber: 4,
      radius: '70%',
      itemStyle: {},

      progress: {
        show: true,
        width: 8,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: getColorOpcity(props.color, 0.2), // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: getColorOpcity(props.color, 0.5), // 50% 处的颜色
              },
              {
                offset: 1,
                color: getColorOpcity(props.color, 1), // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          shadowColor: getColorOpcity(props.color, 0.2),
          shadowBlur: 8,
          shadowOffsetX: 4,
          shadowOffsetY: 4,
        },
      },

      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: 8,
        width: 7,
        offsetCenter: [0, '-58%'],
        itemStyle: {
          color: '#2A2F37',
        },
      },
      axisLine: {
        lineStyle: {
          width: 8,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        length: 4,
        distance: -20,
        lineStyle: {
          width: 4,
          color: '#C3CEDF',
        },
      },
      axisLabel: {
        distance: -15,
        color: '#8D98AA',
        fontSize: 12,
      },
      title: {
        show: true,
        offsetCenter: [0, '-20%'],
        fontSize: 14,
        color: '#4E5865',
      },
      detail: {
        offsetCenter: [0, '20%'],
        formatter: function (value) {
          return `{value|${value.toFixed(2)}}`;
        },
        rich: {
          value: {
            fontSize: 32,
            fontWeight: 'bolder',
            color: '#000',
          },
        },
      },
      data: [
        {
          value: props.value,
          name: props.name,
        },
      ],
    },
  ],
};
</script>
<template>
  <o-echart
    :id="id"
    :option="option"
    :width="width"
    :height="height"
  ></o-echart>
</template>