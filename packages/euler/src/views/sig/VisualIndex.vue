<template>
  <div class="contributors-panel">
    <h3 id="currentVitalityIndex" class="title">
      {{ props.sencondTitle + " " + t("currentVitalityIndex") }}
    </h3>
    <div class="rank">
      <span>{{ t("communityRankings") }}</span>
      <span> # </span>
      <span class="rank-num">{{ sorceData.rank }} </span>
      <span>/ {{ props.drownData?.length }}</span>
    </div>
    <div class="img">
      <o-echart-gauge
        id="combinedActivity"
        :name="t('combinedActivity')"
        :value="sorceData.score"
        width="280px"
      ></o-echart-gauge>
      <current-trend :sig="props.sencondTitle"></current-trend>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { getSigScore } from "shared/api";
import { IObject } from "shared/@types/interface";
import { useI18n } from "vue-i18n";
import { openCommunityInfo } from "@/api";
import OEchartGauge from "shared/components/OEchartGauge.vue";
import CurrentTrend from "./CurrentTrend.vue";
const { t } = useI18n();
// 获取活力指数
const props = defineProps({
  sencondTitle: { type: String },
  drownData: {
    type: Array,
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
querySorceData()
onMounted(() => querySorceData);
watch(
  () => props.sencondTitle,
  () => querySorceData()
);
</script>
<style scoped lang="scss">
.contributors-panel {
  padding: 24px;
  background: #fff;
  margin-bottom: 24px;
  .title {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .img {
    display: flex;
  }
}
.rank {
  font-size: 12px;
  color: #4e5865;
  line-height: 16px;
  &-num {
    font-size: 40px;
    color: #000000;
  }
}
</style>
