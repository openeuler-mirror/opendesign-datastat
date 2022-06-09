<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import OAnchor from 'shared/components/OAnchor.vue';
import OEchartGauge from 'shared/components/OEchartGauge.vue';
import HistoricalTrend from './HistoricalTrend.vue';
import CurrentTrend from './CurrentTrend.vue';
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import TableList from './TableList.vue';
import TheBar from '../../components/TheBar.vue';
import TheForm from '@/components/TheForm.vue';
import ContributList from './ContributList.vue';
import { querySigRepos, querySigName, getSigScore } from 'shared/api';
import { openCommunityInfo } from '@/api';
const useCommon = useCommonStore();
const router = useRouter();
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
const clickDrownItem = (item) => {
  sencondTitle.value = item;
  getllData();
};
const cubeData = ref([]);
const getCubeData = () => {
  const query = {
    timeRange: 'lastonemonth',
    community: 'openeuler',
    sig: sencondTitle.value,
  };
  querySigRepos(query).then((data) => {
    const value = data?.data || [];
    const firstKeys = Object.keys(value);
    cubeData.value = value[firstKeys as string];
  });
};
const drownData = ref([]);
const getDrownData = () => {
  let community = 'openeuler';
  querySigName(community).then((data) => {
    const value = data?.data || [];
    const firstKeys = Object.keys(value);
    drownData.value = value[firstKeys as string];
  });
};
const getllData = () => {
  getCubeData();
  getDrownData();
  querySorceData();
};
watch(() => sencondTitle.value);
onMounted(() => {
  getllData();
});
// 获取活力指数
const sorceData = ref([]);
const querySorceData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: sencondTitle.value,
    timeRange: 'lastonemonth',
  };
  getSigScore(params).then((data) => {
    sorceData.value = data.data.pop();
  });
};
// 跳转首页
const goToHome = () => {
  router.push(`/${useCommon.language}/overview`);
};
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
        <div class="main-left">
          <div class="main-left-top">
            <div class="main-left-title">
              {{ sencondTitle }}
            </div>
            <div class="edropdown">
              <el-dropdown>
                <div class="btnc"></div>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-scrollbar height="400px">
                      <el-dropdown-item
                        v-for="item in drownData"
                        :key="item.value"
                        @click="clickDrownItem(item)"
                      >
                        {{ item }}
                      </el-dropdown-item>
                    </el-scrollbar>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="main-left-sp">
            <span>调优领域相关技术探索；AI辅助性能分析</span>
            <div class="first">
              <div class="home"></div>
              <div class="toHome">
                <span @click="goToHome()"> {{ t('toHome') }}</span>
              </div>
            </div>
            <div class="first">
              <div class="email"></div>
              <div class="List">
                <span>{{ t('MailingList') }}：</span>
                <span class="item"> a-tune@openeuler.org </span>
              </div>
            </div>
            <div class="first">
              <div class="IRC"></div>
              <div class="List">
                <span>{{ t('channel') }}</span>
                <span class="item">#openeuler-dev</span>
              </div>
            </div>
            <div class="first">
              <div class="Maintainer"></div>
              <div class="List">
                <span>Maintainer：</span>
                <span class="item"> @xiezhipeng1 </span>
                <span class="item"> @hanxinke1 </span>
              </div>
            </div>
            <div class="first">
              <div class="Mentor"></div>
              <div class="List">
                <span>Mentor：</span>
                <span class="item"> @xiezhipeng1 </span>
                <span class="item"> @hanxinke1 </span>
              </div>
            </div>
            <div class="first">
              <div class="store"></div>
              <div class="List">
                <span>{{ t('warehouse') }}：</span>
                <div class="atlas">
                  <a
                    v-for="item in cubeData"
                    :key="item.value"
                    class="item"
                    :href="item"
                    target="_blank"
                  >
                    ./openeuler/
                    {{ item.split('/')[item.split('/').length - 1] }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div class="contributors-panel">
            <h3 id="currentVitalityIndex" class="title">
              {{ sencondTitle + ' ' + t('currentVitalityIndex') }}
            </h3>
            <div class="rank">
              <span>{{ t('communityRankings') }}</span>
              <span> # </span>
              <span class="rank-num">{{ sorceData.rank }}</span>
              <span>/{{ drownData.length }}</span>
            </div>
            <div class="img">
              <o-echart-gauge
                id="combinedActivity"
                :name="t('combinedActivity')"
                :value="sorceData.score"
              ></o-echart-gauge>
              <current-trend :sig="sencondTitle"></current-trend>
            </div>
          </div>
          <div class="contributors-panel">
            <h3 id="historicalVitalityIndicators" class="title">
              {{ sencondTitle + ' ' + t('historicalVitalityIndicators') }}
            </h3>
            <historical-trend :sig="sencondTitle"></historical-trend>
          </div>
          <div class="contributors-panel">
            <h3 id="companyContributor" class="title">
              {{ sencondTitle + ' ' + t('companyContributor') }}
            </h3>
            <table-list :sig="sencondTitle" @search-state="searchStsate" />
            <!-- <div v-if="search404" class="search404">
              <img class="cover" src="@/assets/404.png" alt="404" />
              <p class="text">{{ t('searchTips') }}</p>
            </div>
            <the-bar v-else></the-bar> -->
          </div>
          <div class="contributors-panel">
            <h3 id="userContributor" class="title">
              {{ sencondTitle + ' ' + t('userContributor') }}
            </h3>
            <contribut-list :sig="sencondTitle"></contribut-list>
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
  &-left {
    .edropdown {
      position: absolute;
      right: 10px;
      .btnc {
        background-image: url('@/assets/down.png');
        width: 24px;
        height: 24px;
      }
    }
    &-title {
      font-size: 24px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 32px;
      text-overflow: ellipsis;
      width: 300px;
      white-space: nowrap;
      overflow: hidden;
    }
    &-top {
      display: flex;
      position: relative;
    }
    &-sp {
      display: flex;
      flex-direction: column;
      margin-top: 24px;
      .first {
        margin-top: 18px;
        display: flex;
        position: relative;
        .toHome {
          padding-top: 3px;
          color: #002fa7;
          cursor: pointer;
        }
        .List {
          padding-top: 3px;
          display: flex;
          flex-direction: column;
          .item {
            margin-top: 8px;
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #002fa7;
            line-height: 22px;
          }
        }
        .home {
          background-image: url('@/assets/home-outlined.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .email {
          background-image: url('@/assets/email.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .IRC {
          background-image: url('@/assets/chat.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Maintainer {
          background-image: url('@/assets/use-square.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Mentor {
          background-image: url('@/assets/user.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .store {
          background-image: url('@/assets/cube.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }
    }
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

.stafftitle {
  padding-left: 24px;
  margin-bottom: 22px;
  margin-top: 22px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.topstafftitle {
  padding: 24px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.smalltitle {
  margin-bottom: 20px;
  margin-left: 20px;
  width: 280px;
  height: 24px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.color-box {
  display: flex;
  margin-left: 20px;
  padding-bottom: 20px;
  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #002fa7;
      margin-right: 8px;
    }
  }
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #feb32a;
      margin-right: 8px;
    }
  }
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #4aaead;
      margin-right: 8px;
    }
  }
  .green-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #fc756c;
      margin-right: 8px;
    }
  }
}
.atlas {
  width: 350px;
  display: flex;
  flex-direction: column;
}
</style>
