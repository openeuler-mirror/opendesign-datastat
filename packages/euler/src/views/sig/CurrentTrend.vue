<script setup lang="ts">
import OEchartPolar from 'shared/components/OEchartPolar.vue';
import { computed, ref, watch,onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { useCommonStore } from '@/stores/common';
import { getSigRadarScore } from 'shared/api';
import { openCommunityInfo } from '@/api';
import { useRouter } from 'vue-router';
const router = useRouter();
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
const polarData = ref([] as IObject[]);
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: props.sig,
    timeRange: 'lastonemonth',
  };
  getSigRadarScore(params).then((data) => {
    sorceData.value = data?.data?.pop();
    initData();
  });
};
watch(
  () => props.sig,
  () => {
    querySorceData();
  }
);
const fieldsKey = computed(() => {
  return [props.sig, t('communityAverage')];
});

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
    const value = data[selectedData.value]?.metrics || {};
    const keys = Object.keys(value).filter((item) => !item.includes('_mean'));
    tableData.value = keys.map((item) => ({
      title: keyToI18n[item],
      sig: Number(value[item]?.toFixed(3)) || 0,
      community: Number(value[`${item}_mean`]?.toFixed(3)) || 0,
    }));
  }
};
const getPolarData = (data: IObject) => {
  const keys = [
    'org_robustness',
    'products',
    'product_quality',
    'process_quality',
    'influence',
  ];
  polarData.value = keys.map((item) => {
    return {
      title: keyToI18n[item],
      [props.sig]: Number(data[item]?.score.toFixed(3)) || 0,
      [t('communityAverage')]: Number(data[item]?.mean.toFixed(3)) || 0,
    };
  });
};

watch(
  () => useCommon.language,
  () => {
    initData();
  }
);
const initData = () => {
  getPolarData(sorceData.value);
  getTableData(sorceData.value);
};
initData();
const goData = () => {
  const routeData: any = router.resolve(`/${useCommon.language}/about`);
  window.open(routeData.href, '_blank');
};
onMounted(() => {
  querySorceData();
})
</script>
<template>
  <div class="curmain">
    <div class="polar">
      <o-echart-polar
        id="curEchartPolar"
        :fields-key="fieldsKey"
        :data="polarData"
        width="350px"
      ></o-echart-polar>
    </div>
    <div class="table">
      <table cellspacing="0" cellpadding="10px" style="width: 100%">
        <thead class="bgcolor">
          <th align="left" class="border padcell imgtitle">
            {{ tableTitle }}
            <span style="margin-left: 8px; cursor: pointer" @click="goData()"
              ><img src="@/assets/help.png" alt=""
            /></span>
          </th>
          <th align="right" class="border padcell">
            {{ t('CurrentSIG') }}
          </th>
          <th align="right" class="border padcell">
            {{ t('communityAverage') }}
          </th>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.title">
            <td class="border padcell">{{ item.title }}</td>
            <td class="border padcell num" align="right">
              {{ (Math.round(item.sig * 100) / 100).toFixed(2) }}
            </td>
            <td class="border padcell num" align="right">
              {{ (Math.round(item.community * 100) / 100).toFixed(2) }}
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
}
.table {
  font-size: 12px;
  color: #4e5865;
  width: 306px;
  th {
    font-weight: 500;
  }
}
.border {
  border-bottom: 1px solid #dee2e8;
}
.padcell {
  padding: 12px 16px;
}
.overflow {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.num {
  color: #0a0b0d;
}
.bgcolor {
  background: #e5e8f0;
}
.imgtitle {
  display: flex;
  align-items: center;
  justify-items: center;
}
</style>
