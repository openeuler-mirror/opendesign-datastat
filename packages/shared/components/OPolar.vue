<script setup lang="ts">
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { IObject } from '../@types/interface';
import { onMounted, ref, watch } from 'vue';
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: 'container',
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  color: {
    type: Array,
    default: () => ['#0062DC', 'rgb(195 206 223)'],
  },
  width: {
    type: Number,
    default: 256,
  },
  height: {
    type: Number,
    default: 256,
  },
  titleKey: {
    type: String,
    default: 'title',
  },
  fieldsKey: {
    type: Array as () => string[],
    default: () => ['sig', 'average'],
  },
});
onMounted(() => {
  createChart();
});
watch(
  () => props.data,
  () => {
    createChart();
  },
  { deep: true }
);
const opRef = ref<any>(null);
let chart: any;
const createChart = () => {
  const { DataView } = DataSet;
  const dv = new DataView().source(props.data);
  dv.transform({
    type: 'fold',
    fields: props.fieldsKey, // 展开字段集
    key: 'user', // key字段
    value: 'score', // value字段
  });
  if (!chart) {
    chart = new Chart({
      container: props.id,
      autoFit: true,
      limitInPlot: false,
      width: props.width,
      height: props.height,
    });
    chart.data(dv.rows);
    chart.coordinate('polar', {
      radius: 0.7,
    });
    chart.scale('score', {
      min: 0,
      nice: true,
      tickCount: 5,
    });
    chart.legend(false);
    chart.tooltip({
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        line: {
          style: {
            lineDash: [4, 4],
            stroke: '#333',
          },
        },
      },
      domStyles: {
        'g2-tooltip-value': {
          'font-weight': 'bold',
          'font-size': '16px',
          color: '#000',
        },
        'g2-tooltip-name': {
          'font-size': '12px',
          color: '#4E5865',
        },
      },
    });
    chart.axis('title', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
            color: '#002FA7',
          },
        },
      },
    });
    chart.axis('score', {
      line: null,
      tickLine: null,
      label: null,
      grid: {
        alternateColor: [
          'rgba(255, 255, 255, 0.3)',
          'rgba(244, 246, 250, 0.3)',
        ],
        line: {
          type: 'circle',
        },
      },
    });

    chart.line().position(`${props.titleKey}*score`).color('user').size(2);
    chart
      .point()
      .position(`${props.titleKey}*score`)
      .color('user')
      .shape('circle')
      .size(4)
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1,
      });
    chart.area().position(`${props.titleKey}*score`).color('user');
    chart.theme({
      styleSheet: {
        paletteQualitative10: props.color,
      },
    });
    chart.on('tooltip:change', (ev: IObject) => {
      const { data } = ev;
      emits('tooltip-change', data);
    });
    chart.on('tooltip:hide', (ev: IObject) => {
      const { data } = ev;
      emits('tooltip-hide', data);
    });
    chart.on('tooltip:show', (ev: IObject) => {
      const { data } = ev;
      emits('tooltip-show', data);
    });
  } else {
    chart.changeData(dv.rows);
  }
  chart.render();
};
const emits = defineEmits(['tooltip-change', 'tooltip-hide', 'tooltip-show']);
</script>
<template>
  <div :id="id" ref="opRef"></div>
</template>
