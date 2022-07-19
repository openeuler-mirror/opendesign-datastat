<script setup lang="ts">
import OEchart from './OEchart.vue';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from '../@types/interface';
import { testIsPhone } from '../utils/helper';
const { t } = useI18n();
type EChartsOption = echarts.EChartsOption;
interface groupItem {
  key: string;
  label: string;
  color: string;
}
interface sigItem {
  key: string;
  label: string;
  value: number;
  group: string;
}
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: 'qw',
  },
  name: {
    type: String,
    default: '贡献者数量',
  },
  value: {
    type: Array as () => sigItem[],
    default: () =>
      [
        {
          key: '1',
          label: 'sig-KIRAN-DESKTOP',
          value: 10,
          group: 'a',
        },
        {
          key: '2',
          label: 'sig-KIRAN-DESKTOP1',
          value: 10,
          group: 'a',
        },
        {
          key: '3',
          label: 'sig-KIRAN-DESKTOP2',
          value: 10,
          group: 'a',
        },
        {
          key: '1',
          label: 'sig-KIRAN-DESKTOP',
          value: 12,
          group: 'b',
        },
        {
          key: '2',
          label: 'sig-KIRAN-DESKTOP1',
          value: 12,
          group: 'b',
        },
        {
          key: '3',
          label: 'sig-KIRAN-DESKTOP2',
          value: 12,
          group: 'b',
        },
        {
          key: '1',
          label: 'sig-KIRAN-DESKTOP',
          value: 20,
          group: 'c',
        },
        {
          key: '2',
          label: 'sig-KIRAN-DESKTOP1',
          value: 20,
          group: 'c',
        },
        {
          key: '3',
          label: 'sig-KIRAN-DESKTOP2',
          value: 20,
          group: 'c',
        },
        {
          key: '1',
          label: 'sig-KIRAN-DESKTOP',
          value: 2,
          group: 'd',
        },
        {
          key: '2',
          label: 'sig-KIRAN-DESKTOP1',
          value: 8,
          group: 'd',
        },
        {
          key: '3',
          label: 'sig-KIRAN-DESKTOP2',
          value: 15,
          group: 'd',
        },
      ] as sigItem[],
  },
  group: {
    type: Array as () => groupItem[],
    default: () =>
      [
        {
          key: '桌面/图形系统',
          label: '桌面/图形系统',
          color: '#002FA7',
        },
        {
          key: '架构/处理器/内核/驱动',
          label: '架构/处理器/内核/驱动',
          color: '#FEB32A',
        },
        {
          key: '基础功能/特性/工具',
          label: '基础功能/特性/工具',
          color: '#4AAEAD',
        },
        {
          key: '行业解决方案/应用',
          label: '行业解决方案/应用',
          color: '#FC756C',
        },
      ] as groupItem[],
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '580px',
  },
  type: {
    type: String,
    default: 'all',
  },
});
const typeObj: IObject = {
  lastonemonth: t('from.lastonemonth'),
  lasthalfyear: t('from.lasthalfyear'),
  lastoneyear: t('from.lastoneyear'),
  all: t('from.all'),
};
const isMobile: boolean = testIsPhone();
const getData = () => {
  const _data = props.group.map((item) => {
    const children = props.value
      .filter((it) => it.group === item.key)
      .map((it) => ({
        name: it.label,
        value: it.value,
      }));
    return {
      name: item.label,
      itemStyle: {
        color: item.color,
      },
      children,
    };
  });
  return _data;
};
const getOption = (): EChartsOption => {
  return {
    name: props.name,
    tooltip: {
      confine: isMobile,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      formatter: function (info: any) {
        let { value, treePathInfo, color } = info;
        let treePath = [];
        for (let i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }
        const percent = ((value / treePathInfo[0].value) * 100).toFixed(1);
        return [
          `<div style="font-size:12px;color: #9097A3; margin-bottom: 8px">${
            typeObj[props.type]
          } 的 ${props.name}</div>`,
          `<div style="font-size:12px;color: #4E5865; display: flex; align-items: center;">
          <div style="display: inline-block;
                  width: 12px;
                  height: 12px;
                  margin-right: 8px;
                  background-color: ${color}">
          </div>
          ${treePath.join('>')}
          <span style="font-size:16px;color: #000000;margin-left:24px; font-weight: 500;display: ${
            isMobile ? 'none' : 'inline'
          }">${percent}% (${value})</span>
        </div>`,
          `<span style="font-size:16px;color: #000000; font-weight: 600;display: ${
            isMobile ? 'inline' : 'none'
          }">${percent}% <span style="font-size:12px;margin-left: 4px">${value}</span></span>`,
        ].join('');
      },
    },
    series: [
      {
        name: '111asd',
        type: 'treemap',
        roam: false,
        width: '100%',
        height: '100%',
        nodeClick: undefined,
        levels: [
          {},
          {},
          {
            itemStyle: {
              borderWidth: 1,
            },
          },
        ],
        label: {
          show: true,
          position: 'insideTopLeft',
          distance: 5,
        },
        breadcrumb: {
          show: false,
        },
        data: getData(),
      },
    ],
  };
};
let option = ref({});
option.value = getOption();
watch(
  () => props.value,
  () => {
    option.value = getOption();
  },
  { deep: true }
);
watch(
  () => props.type,
  () => {
    option.value = getOption();
  },
  { deep: true }
);
</script>
<template>
  <o-echart
    :id="id"
    :option="option"
    :width="width"
    :height="height"
  ></o-echart>
</template>
<style scoped lang="scss">
.tooltip-block {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
</style>
