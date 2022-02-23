<script setup>
import OBanner from '@/components/OBanner.vue';
import LineContributorsRank from '@/components/charts/LineContributorsRank.vue';
import DevelopmentLanguage from '@/components/DevelopmentLanguage.vue';
import ORadioButton from '@/components/ORadioButton.vue';
import { ref } from 'vue';
import ChartCard from '../components/charts/ChartCard.vue';
import MixChartContributors from '../components/charts/MixChartContributors.vue';
import IconText from '../components/IconText.vue';
import { prOptions, issuseOptions, commitOptions } from '../service/options';
// 单选按钮传参
const radioItem = [
  {
    id: 'pr',
    label: 'PR',
  },
  {
    id: 'issuse',
    label: 'Issuse',
  },
  {
    id: 'commit',
    label: 'Commit',
  },
];
const radioActive = ref('PR');

// ranking 回调
const optionLine = ref(prOptions);
const radioEvent = (item) => {
  radioActive.value = item;
  switch (item) {
    case 'PR':
      optionLine.value = prOptions;
      break;
    case 'Issuse':
      optionLine.value = issuseOptions;
      break;
    case 'Commit':
      optionLine.value = commitOptions;
      break;
  }
};

// banner 右侧数据
const prData = ref({
  title: 'PR Requests',
  total: '59800',
  amount: '56',
  options: [1, 30, 40, 33, 43, 52, 55],
});
const IssuseData = ref({
  title: 'Issuse Requests',
  total: '63320',
  amount: '121',
  options: [20, 25, 32, 38, 43, 51, 58],
});
const commitsData = ref({
  title: 'Commits',
  total: '14500',
  amount: '432',
  options: [1, 30, 40, 33, 43, 52, 55],
});

// banner 左侧 数据
const starInfo = ref({ icon: 'temp', title: 'Star', amount: 8300 });
const watchInfo = ref({ icon: 'temp', title: 'Watch', amount: 18900 });
const forkInfo = ref({ icon: 'temp', title: 'Fork', amount: 29100 });

const allData = ref({
  title: 'All Contributors',
  total: '14500',
  amount: '121',
  lineData: {
    line1: [5, 30, 40, 33, 43, 52, 55],
    line2: [1, 20, 30, 23, 33, 42, 47],
  },
  pieData: {
    total: '6352',
    amount: '121',
    title: 'Active Contributors',
    pieVal: '68',
  },
});
</script>

<template>
  <o-banner>
    <div class="banner-content">
      <div class="banner-title">
        <p>Explore the data of</p>
        <h3 class="title">Contributors</h3>
      </div>
      <div class="contributors-container">
        <mix-chart-contributors
          :title="allData.title"
          :total="allData.total"
          :amount="allData.amount"
          :line-data="allData.lineData"
          :pie-data="allData.pieData"
        ></mix-chart-contributors>

        <chart-card
          :title="prData.title"
          :amount="prData.amount"
          :total="prData.total"
          :options="prData.options"
        />
        <chart-card
          :title="IssuseData.title"
          :amount="IssuseData.amount"
          :total="IssuseData.total"
          :options="IssuseData.options"
        />
        <chart-card
          :title="commitsData.title"
          :amount="commitsData.amount"
          :total="commitsData.total"
          :options="commitsData.options"
        />
        <icon-text
          :icon="starInfo.icon"
          :title="starInfo.title"
          :amount="starInfo.amount"
        ></icon-text>
        <icon-text
          :icon="watchInfo.icon"
          :title="watchInfo.title"
          :amount="watchInfo.amount"
        ></icon-text>
        <icon-text
          :icon="forkInfo.icon"
          :title="forkInfo.title"
          :amount="forkInfo.amount"
        ></icon-text>
      </div>
    </div>
  </o-banner>

  <div class="wrap">
    <div class="developers-box">
      <div class="developers-option">
        <h3 class="title">Contributors</h3>
        <o-radio-button
          :radio-item="radioItem"
          :radio-active="radioActive"
          @radio-click="radioEvent"
        ></o-radio-button>
      </div>
      <line-contributors-rank :options="optionLine" />
    </div>
    <div class="development-panel">
      <h3 class="title">开发语言占比排名</h3>
      <development-language class="development-panel-content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-content {
  padding: 30px 0;
  color: #ffffff;
  padding-bottom: 80px;
  margin-bottom: 60px;
  .banner-title {
    text-align: center;
    padding: 40px 0;
    font-size: 18px;
    color: #fff;
    .title {
      font-size: 30px;
      font-weight: bold;
      margin-top: 10px;
    }
  }
}
.developers-box {
  .developers-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.contributors-container {
  display: grid;
  grid-template-columns: auto auto auto 300px;
  gap: 10px;
  .mix-chart {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
  }
  .icon-text {
    grid-area: 3;
  }
}
.development-panel {
  margin-top: 60px;
  .title {
    font-size: 18px;
    margin-bottom: 40px;
  }
  &-content {
    height: 380px;
  }
}
</style>
