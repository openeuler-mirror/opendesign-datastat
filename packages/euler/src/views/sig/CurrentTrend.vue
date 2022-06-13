<script setup lang="ts">
import OPolar from 'shared/components/OPolar.vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { useCommonStore } from '@/stores/common';
import { getSigRadarScore } from 'shared/api';
import { openCommunityInfo } from '@/api';

const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: 'sig-DDE',
  },
});
const { t } = useI18n();
const useCommon = useCommonStore();
const sorceData = ref({});
const tableData = ref([] as IObject[]);
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: props.sig,
    timeRange: 'lastonemonth',
  };
  getSigRadarScore(params).then((data) => {
    sorceData.value = data.data.pop();
    initData();
  });
};
watch(
  () => props.sig,
  () => {
    querySorceData();
  }
);
querySorceData();
const fieldsKey = computed(() => {
  return [props.sig, t('communityAverage')];
});
const keyToI18n: IObject = {
  all: computed(() => t('vitalIndex')),
  products: computed(() => t('products')),
  product_quality: computed(() => t('productQuality')),
  process_quality: computed(() => t('processQuality')),
  org_robustness: computed(() => t('tissueRobustness')),
  influence: computed(() => t('influence')),
  PR_Merged: computed(() => t('PRMerged')),
  Issue_resolve: computed(() => t('IssueResolve')),
  PR_Efficiency: computed(() => t('PREfficiency')),
  D1: computed(() => t('D1Number')),
  Maintainer: computed(() => t('Maintainer')),
  Fork: 'Fork',
};
const selectedData = ref('all');
const tableTitle = computed(() => keyToI18n[selectedData.value].value);
const getTableData = (data: IObject) => {
  if (selectedData.value === 'all') {
    tableData.value = polarData.value.map((item) => ({
      title: item.title,
      sig: item[props.sig],
      community: item[t('communityAverage')],
    }));
  } else {
    const value = data[`${selectedData.value}_value`];
    tableData.value = Object.keys(value).map((item) => ({
      title: keyToI18n[item],
      sig: Number(value[item]?.toFixed(3)),
      community: 0.2,
    }));
  }
};
const getPolarData = (data: IObject) => {
  const keys = [
    'products',
    'product_quality',
    'org_robustness',
    'process_quality',
    'influence',
  ];
  polarData.value = keys.map((item) => {
    return {
      title: keyToI18n[item],
      [props.sig]: Number(data[item]?.score.toFixed(3)),
      [t('communityAverage')]: 0.1,
    };
  });
};
const polarData = ref([] as IObject[]);

watch(
  () => useCommon.language,
  () => {
    initData();
  }
);
const tooltipChange = (e: IObject) => {
  selectedData.value =
    Object.keys(keyToI18n).find((item) => keyToI18n[item]?.value === e.title) ||
    'all';
  getTableData(sorceData.value);
};
const tooltipHide = () => {
  selectedData.value = 'all';
  getTableData(sorceData.value);
};
const initData = () => {
  getPolarData(sorceData.value);
  getTableData(sorceData.value);
};
initData();
</script>
<template>
  <div class="curmain">
    <div class="polar">
      <o-polar
        id="curEchartPolar"
        :fields-key="fieldsKey"
        :data="polarData"
        @tooltip-change="tooltipChange($event)"
        @tooltip-show="tooltipChange($event)"
        @tooltip-hide="tooltipHide"
      ></o-polar>
    </div>
    <div class="table">
      <table cellspacing="0" cellpadding="10px">
        <thead>
          <th align="left" class="border padcell" style="width: 130px">
            {{ tableTitle }}
          </th>
          <th align="right" class="border padcell" style="width: 90px">
            {{ props.sig }}
          </th>
          <th align="right" class="border padcell" style="width: 142px">
            {{ t('communityAverage') }}
          </th>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.title">
            <td class="border padcell">{{ item.title }}</td>
            <td class="border padcell num" align="right">{{ item.sig }}</td>
            <td class="border padcell num" align="right">
              {{ item.community }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.curmain {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.table {
  font-size: 12px;
  color: #4e5865;
  th {
    font-weight: 500;
  }
}
.polar {
  display: inline-block;
  width: 350px;
}
.border {
  border-bottom: 1px solid #dee2e8;
}
.padcell {
  padding: 12px 16px;
}
.num {
  color: #0a0b0d;
}
</style>
