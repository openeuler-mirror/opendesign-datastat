<template>
  <h3 id="currentVitalityIndex" class="title">
    {{ sencondTitle + ' ' + t('currentVitalityIndex') }}
  </h3>
  <div class="rank">
    <span>{{ t('communityRankings') }}</span>
    <span> # </span>
    <span class="rank-num">{{ sorceData.rank }} </span>
    <span>/ {{ props.drownData.length }}</span>
  </div>
  <div class="img">
    <o-echart-gauge
      id="combinedActivity"
      :name="t('combinedActivity')"
      :value="sorceData.score"
      width="280px"
    ></o-echart-gauge>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { getSigScore } from 'shared/api';
import { IObject } from 'shared/@types/interface';
import { useI18n } from 'vue-i18n';
import { openCommunityInfo } from '@/api';
import OEchartGauge from 'shared/components/OEchartGauge.vue';
const { t } = useI18n();
// 获取活力指数
const props = defineProps({
  sencondTitle: { default: String },
  drownData: {
    default: Array,
  },
});
const sorceData = ref({} as IObject);
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: props.sencondTitle,
    timeRange: 'lastonemonth',
  };

  getSigScore(params).then((data) => {
    sorceData.value = data.data.pop();
  });
};
querySorceData();
</script>
<style scoped lang="scss"></style>
