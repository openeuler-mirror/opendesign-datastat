<script setup lang="ts">
import OEchartLine from 'shared/components/OEchartLine.vue';
import OFormRadio from '@/components/OFormRadio.vue';
import { computed, ref, watch ,onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSigRadarScore, getSigScore } from 'shared/api';
import { IObject } from 'shared/@types/interface';
import { openCommunityInfo } from '@/api';

const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: 'sig-DDE',
  },
});
watch(
  () => props.sig,
  () => {
    querySorceData();
  }
);
const keyToI18n: IObject = {
  products: computed(() => t('products')),
  product_quality: computed(() => t('productQuality')),
  process_quality: computed(() => t('processQuality')),
  org_robustness: computed(() => t('tissueRobustness')),
  influence: computed(() => t('influence')),
};
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: props.sig,
    timeRange: selectTime.value,
  };
  getSigScore(params).then((res) => {
    const data =
      res.data?.map((item: IObject) => ({
        created_at: item.created_at,
        score: item.score,
      })) || [];

    echartData.value = [
      {
        name: computed(() => t('combinedActivity')),
        data: data.sort((a: { created_at: string }, b: { created_at: any }) =>
          a.created_at.localeCompare(b.created_at)
        ),
      },
    ];
    getSigRadarScore(params).then((res) => {
      const { data } = res;
      const addData =
        data?.reduce((pre: IObject[], next: IObject) => {
          if (!pre.length) {
            pre = Object.keys(keyToI18n).map((item) => {
              const _data = {
                created_at: next.created_at,
                score: next[item].score,
              };
              return {
                name: keyToI18n[item],
                data: [_data],
              };
            });

          } else {
            Object.keys(keyToI18n).forEach((item, index) => {
              const _data = {
                created_at: next.created_at,
                score: next[item].score,
              };
              pre[index].data.push(_data);
            });
          }
          return pre;
        }, []) || [];
      echartData.value.push(...addData);
    });
  });
};
const firstformOption = computed(() => {
  return [
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'lastoneyear',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
      ],
    },
  ];
});
const selectTime = ref('lastoneyear');
const echartData = ref([] as IObject[]);
const getContributeInfo = (e: IObject) => {
  selectTime.value = e.active;
  querySorceData();
};
onMounted(() => { querySorceData();})
</script>
<template>
  <div>
    <o-form-radio
      :option="firstformOption"
      @get-contribute-info="getContributeInfo($event)"
    >
    </o-form-radio>
    <o-echart-line
      id="historicalVitalityIndicatorsEchart"
      :data="echartData"
    ></o-echart-line>
  </div>
</template>
<style lang="scss" scoped></style>
