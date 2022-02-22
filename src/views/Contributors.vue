<template>
  <AppBanner>
    <div class="banner-content">
      <div class="banner-title">
        <p>Explore the data of</p>
        <h3>Contributors</h3>
      </div>
      <div class="contributors-panel">
        <div class="panel-left">
          <ContributorsCharts
            class="panel-left-chart"
            :total="allData.total"
            :amount="allData.amount"
            :series-data="allData.seriesData"
            :series-data1="allData.seriesData1"
          ></ContributorsCharts>
          <div class="panel-box">
            <IconText :icon="starInfo.icon" :title="starInfo.title" :amount="starInfo.amount"></IconText>
            <IconText :icon="watchInfo.icon" :title="watchInfo.title" :amount="watchInfo.amount"></IconText>
            <IconText :icon="forkInfo.icon" :title="forkInfo.title" :amount="forkInfo.amount"></IconText>
          </div>
        </div>
        <div class="panel-right">
          <TextChart
            class="panel-right-card"
            :title="prData.title"
            :amount="prData.amount"
            :total="prData.total"
            :options="prData.options"
          />
          <TextChart
            class="panel-right-card"
            :title="IssuseData.title"
            :amount="IssuseData.amount"
            :total="IssuseData.total"
            :options="IssuseData.options"
          />
          <TextChart
            class="panel-right-card"
            :title="commitsData.title"
            :amount="commitsData.amount"
            :total="commitsData.total"
            :options="commitsData.options"
          />
        </div>
      </div>
    </div>
  </AppBanner>

  <div class="wrap">
    <div class="developers-box">
      <div class="developers-option">
        <h3>Contributors</h3>
        <RadioGroup :grouplist="grouplist" :actives="radioActive" @click="radioEvent"></RadioGroup>
      </div>
      <ContributorsRankLine :options="optionLine" />
    </div>
    <div class="development-panel">
      <h3>开发语言占比排名</h3>
      <DevelopmentLanguage class="development-panel-content" />
    </div>
  </div>
</template>

<script setup>
import AppBanner from '@/components/AppBanner.vue';
import ContributorsRankLine from '@/components/ContributorsRankLine.vue';
import DevelopmentLanguage from '@/components/DevelopmentLanguage.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import { ref } from 'vue';
import TextChart from '../components/TextChart.vue';
import ContributorsCharts from '../components/ContributorsCharts.vue';
import IconText from '../components/IconText.vue';
import { prOpt, issuseOpt, commitOpt } from '../service/options';
// 单选按钮传参
const grouplist = [
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
const optionLine = ref(prOpt);
const radioEvent = (item) => {
  radioActive.value = item;
  switch (item) {
    case 'PR':
      optionLine.value = prOpt;
      break;
    case 'Issuse':
      optionLine.value = issuseOpt;
      break;
    case 'Commit':
      optionLine.value = commitOpt;
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
  total: '14500',
  amount: '121',
  seriesData: [5, 30, 40, 33, 43, 52, 55],
  seriesData1: [1, 20, 30, 23, 33, 42, 47],
});
</script>
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
    h3 {
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
.contributors-panel {
  display: flex;
  justify-content: space-between;
  .panel-left {
    flex: 1;
    margin-right: 10px;
    &-chart {
      margin-bottom: 10px;
      height: 250px;
    }
    .panel-box {
      display: grid;
      grid-template-columns: auto auto auto;
      row-gap: 10px;
      column-gap: 10px;
    }
  }
  .panel-right {
    width: 320px;
    display: grid;
    grid-template-columns: auto;
    row-gap: 10px;
    column-gap: 10px;
    &-card {
      height: 120px;
    }
  }
}
.development-panel {
  margin-top: 60px;
  h3 {
    font-size: 18px;
    margin-bottom: 40px;
  }
  &-content {
    height: 380px;
  }
}
</style>
