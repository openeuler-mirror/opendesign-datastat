<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import OAnchor from 'shared/components/OAnchor.vue';
import OEchartGauge from 'shared/components/OEchartGauge.vue';
import HistoricalTrend from './HistoricalTrend.vue';
import CurrentTrend from './CurrentTrend.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const sencondTitle = ref('');
sencondTitle.value = route.params.name as string;
const { t } = useI18n();
const anchorData = [
  'currentVitalityIndex',
  'historicalVitalityIndicators',
  'companyContributor',
  'userContributor',
];
</script>
<template>
  <div class="container">
    <o-anchor :data="anchorData" top="11rem"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one">{{ t('nav.contributors') }}</span>
        <span> > {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">123</div>
        <div class="main-right">
          <div class="contributors-panel">
            <h3 id="currentVitalityIndex" class="title">
              {{ sencondTitle + ' ' + t('currentVitalityIndex') }}
            </h3>
            <div class="rank">
              <span>{{ t('communityRankings') }}</span>
              <span> # </span>
              <span class="rank-num">3</span>
              <span>/97</span>
            </div>
            <div class="img">
              <o-echart-gauge
                id="combinedActivity"
                :name="t('combinedActivity')"
                :value="0.1"
              ></o-echart-gauge>
              <current-trend></current-trend>
            </div>
          </div>
          <div class="contributors-panel">
            <h3 id="historicalVitalityIndicators" class="title">
              {{ sencondTitle + ' ' + t('historicalVitalityIndicators') }}
            </h3>
            <historical-trend></historical-trend>
          </div>
          <div class="contributors-panel">
            <h3 id="companyContributor" class="title">
              {{ sencondTitle + ' ' + t('companyContributor') }}
            </h3>
          </div>
          <div class="contributors-panel">
            <h3 id="userContributor" class="title">
              {{ sencondTitle + ' ' + t('userContributor') }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <app-footer></app-footer>
  </footer>
</template>
<style lang="scss" scoped>
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
.container {
  margin-top: 80px;
  min-height: 900px;
  background-color: #f5f6f8;
}
.step {
  padding: 40px 0;
  font-size: 12px;
  &-one {
    color: #002fa7;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
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
