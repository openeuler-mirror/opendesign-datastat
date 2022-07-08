<script setup lang="ts">
import OEchartGauge from 'shared/components/OEchartGauge.vue';
import MobileCurrentTrend from './MobileCurrentTrend.vue';
import { ref, onMounted, toRefs, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { querySigRepos, querySigName, getSigScore } from 'shared/api';
import { openCommunityInfo } from '@/api';
import { IObject } from 'shared/@types/interface';
const route = useRoute();
const sencondTitle = ref('');
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    default: '',
  },
});
const { sig } = toRefs(props);
const drownData = ref([] as any[]);
const getDrownData = () => {
  let community = 'openeuler';
  querySigName(community).then((data) => {
    const allSigs = data?.data || {};
    allSigs.openeuler.sort((a: any, b: any) => a.localeCompare(b));
    const findOne =
      allSigs.openeuler.find((item: any) => item === route.params.name) ||
      allSigs.openeuler[0];
    sencondTitle.value = findOne;
    const firstKeys = Object.keys(allSigs);
    drownData.value = allSigs[firstKeys[0]];
    reallData.value = drownData.value.sort((a, b) => a.localeCompare(b));
    getllData();
  });
};

// 获取活力指数
const sorceData = ref({} as IObject);
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: sig.value,
    timeRange: 'lastonemonth',
  };
  getSigScore(params).then((data) => {
    sorceData.value = data.data.pop();
  });
};
const getllData = () => {
  querySorceData();
};
watch(
  () => props.sig,
  () => {
    getllData();
  },
  { deep: true }
);
onMounted(() => {
  getDrownData();
});
const reallData = ref([] as IObject[]);
</script>
<template>
  <div class="rank">
    <span>{{ t('communityRankings') }}</span>
    <span> # </span>
    <span class="rank-num">{{ sorceData.rank }} </span>
    <span>/ {{ drownData.length }}</span>
  </div>

  <div class="img">
    <o-echart-gauge
      id="combinedActivity"
      :name="t('combinedActivity')"
      :value="sorceData.score"
      width="100%"
      height="300px"
    ></o-echart-gauge>

    <mobile-current-trend :sig="sig"></mobile-current-trend>
  </div>
</template>
<style lang="scss" scoped>
.contributors-panel {
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
    flex-direction: column;
    justify-content: center;
    //   align-items: center;
  }
}
.container {
  margin-top: 20px;
  min-height: 900px;
}
.main {
  display: flex;
  // justify-content: center;
  // align-items: center;
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
.wrap {
  padding: 0px;
}
</style>
