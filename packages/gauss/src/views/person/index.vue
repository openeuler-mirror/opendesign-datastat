<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import OGAnchor from 'shared/components/OGAnchor.vue';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { queryUserOwnertype } from 'shared/api';
import { queryUserContributeCounts, queryUserList } from 'shared/api/api-new';
import { openCommunityInfo } from '@/api';
import { IObject } from 'shared/@types/interface';
import { Search } from '@element-plus/icons-vue';
import { ElScrollbar } from 'element-plus';
import SigContribution from './SigContribution.vue';
import ContributionDynamic from './ContributionDynamic.vue';
import DataShow from './DataShow.vue';
import { debounce } from 'lodash-es';
import { computed } from 'vue';
import { request } from 'shared/plugins/axios';
const useCommon = useCommonStore();
const router = useRouter();
const route = useRoute();
const sencondTitle = ref('');
const { t } = useI18n();
const drownData = ref([] as any[]);
sencondTitle.value = route.params.name as string;
const sigTitle = ref('');
sigTitle.value = route.query.organization as string;
const group = ref('');
group.value = route.query.group as string;

const userMap = ref<Map<string, string[]>>();

const accountUrl = ref('');

const accountHome = computed(() => {
  const accountName = sencondTitle.value;
  let res: string;
  if (userMap.value?.get(accountName)?.includes('gitcode')) {
    res = `https://gitcode.com/${accountName}`;
  }
  res = `https://gitee.com/${accountName}`;
  if (accountUrl.value) {
    res = accountUrl.value;
  }
  return res;
});

const getDrownData = () => {
  const query = {
    // group: group.value,
    community: openCommunityInfo.name,
    // name: sigTitle.value,
  };
  queryUserList(query as any).then((res) => {
    const data = res?.data || {};
    userMap.value = Object.entries(data as Record<string, string[]>).reduce((map, [key, val]) => map.set(key, val), new Map());
    drownData.value = [...userMap.value.keys()].sort((a: any, b: any) => a.localeCompare(b));
    getllData();
  });
};

// 贡献详情数据（pr、comment、issue、sig贡献的具体数量）
const contributeDetailCounts = ref({
  pr: 0,
  issue: 0,
  comment: 0,
  sig: 0,
});

const updateCounts = (arg: { user: string; timeRange: string }) => {
  queryUserContributeCounts({
    ...arg,
    community: 'opengauss',
  }).then((res) => {
    const { sig, pr, comment, issue } = res?.data || {};
    contributeDetailCounts.value.pr = pr || 0;
    contributeDetailCounts.value.sig = sig || 0;
    contributeDetailCounts.value.issue = issue || 0;
    contributeDetailCounts.value.comment = comment || 0;
  });
};

const anchorData = ['SIGContribution', 'DynamicContribute'];
const clickDrownItem = (item: string) => {
  sencondTitle.value = item;
  getUserAccountUrl();
  getllData();
};

const getUserAccountUrl = () => {
  request.get('/stat/user/info', { params: { community: 'opengauss', user: sencondTitle.value } }).then((res) => {
    if (res.data?.code === 1) {
      accountUrl.value = res.data.data?.html_url ?? '';
    }
  });
};

const getllData = () => {
  clean();
  querySearch();
  querySigInfoData();
};
onMounted(() => {
  getUserAccountUrl();
  getDrownData();
  querySigInfoData();
});
// 跳转首页
const goToTetail = () => {
  router.push(`/${useCommon.language}/detail`);
};
// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);
const querySearch = debounce(() => {
  if (searchInput.value !== '') {
    const newList = drownData.value.filter((item: any) => item.toLowerCase().includes(searchInput.value));
    reallData.value = newList;
  } else {
    reallData.value = drownData.value;
  }
}, 300);
// 清除搜索
const clearSearchInput = () => {
  // getDrownData();
  searchInput.value = '';
  // getDrownData();
};
const clean = () => {
  searchInput.value = '';
};
// 获取侧边栏明细
const sigInfo = ref<any[]>([]);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    user: sencondTitle.value,
  };
  queryUserOwnertype(params).then((res) => {
    sigInfo.value = res?.data || [];
    if (!sigInfo.value.length) return;
    sigInfo.value.sort((a: any, b: any) => a['sig'].localeCompare(b['sig'], 'zh'));
    sigInfo.value.forEach((item: any, index: any) => {
      if (item.sig === 'TC') {
        sigInfo.value.unshift(sigInfo.value.splice(index, 1)[0]);
      }
    });
    sigInfo.value.map((item: any) => item.type.sort((a: any, b: any) => b.length - a.length));
    sigInfo.value.sort((a: any, b: any) => b['type'][0].localeCompare(a['type'][0], 'zh'));
  });
};

// querySigInfoData();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};
const showDropdown = (e: any) => {
  if (e) {
    let number = 0;
    reallData.value.forEach((item: any, index) => {
      if (item === sencondTitle.value) {
        number = index;
      }
    });
    inputSlider(number * 32);
  }
};

const goToSig = (data: IObject) => {
  const routeData: any = router.resolve(`/${useCommon.language}/sig/${data}`);
  window.open(routeData.href, '_blank');
};
</script>
<template>
  <div class="container">
    <o-g-anchor :data="anchorData" top="11rem"></o-g-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one" @click="goToTetail()">{{ t('nav.contributors') }}</span>
        <span> &gt; {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">
          <div class="main-left-top">
            <div class="edropdown">
              <el-dropdown placement="bottom-start" @visible-change="showDropdown">
                <div class="main-left-title">
                  {{ sencondTitle }}
                  <span class="btnc"></span>
                </div>

                <template #dropdown>
                  <div class="searchInput">
                    <el-input
                      v-model="searchInput"
                      clearable
                      :debounce="300"
                      class="w-50 m-2"
                      :placeholder="t('enterGitee')"
                      :prefix-icon="Search"
                      @input="querySearch"
                      @clear="clearSearchInput"
                    />
                  </div>
                  <el-scrollbar ref="scrollbarRef" height="400px">
                    <el-dropdown-item v-for="item in reallData" :key="item.value" @click="clickDrownItem(item as any)">
                      {{ item }}
                    </el-dropdown-item>
                  </el-scrollbar>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="main-left-sp">
            <div class="userInfo">
              <div class="title">{{ t('individual') }}</div>
            </div>
            <div class="first">
              <div class="home"></div>
              <div class="toHome">
                <a style="color: #7d32ea" target="_blank" :href="accountHome"> {{ t('toHome') }}</a>
              </div>
            </div>
            <div class="firstLast">
              <div class="Maintainer"></div>
              <div class="List">
                <span>{{ t('community') }}： </span>
                <span v-for="items in sigInfo" :key="items.value" class="item">
                  <span
                    v-if="items.sig === 'TC'"
                    class="usertypecolorboxTC"
                    :style="
                      {
                        '--color': '45deg, #B461F6 0%, #7D32EA 100%',
                      } as any
                    "
                    >TC</span
                  >
                  <span v-if="items.sig !== 'TC'" style="cursor: pointer" @click="goToSig(items.sig)">{{ items.sig }}</span>

                  <span v-for="item in items.type" :key="item.value"
                    ><span
                      v-if="item === 'committers'"
                      class="usertypecolorbox"
                      :style="
                        {
                          '--color': '225deg, #FEB32A 0%, #F6D365 100%',
                        } as any
                      "
                      >Committer</span
                    ><span
                      v-if="item === 'maintainers' && items.sig !== 'TC'"
                      class="usertypecolorbox"
                      :style="
                        {
                          '--color': '45deg, #B461F6 0%, #7D32EA 100%',
                        } as any
                      "
                      >Maintainer
                    </span></span
                  >
                </span>
              </div>
            </div>
            <data-show :user="sencondTitle" :data="contributeDetailCounts" @update-detail="updateCounts"></data-show>
          </div>
        </div>
        <div class="main-right">
          <div class="contributors-panel">
            <h3 id="SIGContribution" class="title">
              {{ sencondTitle + ' ' + t('SIGContribution') }}
            </h3>
            <sig-contribution :user="sencondTitle"></sig-contribution>
          </div>
          <div class="contributors-panel-last">
            <h3 id="DynamicContribute" class="title">
              {{ sencondTitle + ' ' + t('DynamicContribute') }}
            </h3>
            <contribution-dynamic :sig="sencondTitle"></contribution-dynamic>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <app-footer></app-footer>
    </footer>
  </div>
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
}
.contributors-panel-last {
  padding: 24px;
  background: #fff;
  // margin-bottom: 24px;
  .title {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-bottom: 24px;
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
    color: #7d32ea;
    cursor: pointer;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
  &-left {
    padding-right: 24px;
    .edropdown {
      .btnc {
        background-image: url('@/assets/down.png');
        width: 24px;
        height: 24px;
        position: absolute;
        right: -15px;
      }
    }
    &-title {
      font-size: 24px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #7d32ea;
      line-height: 32px;
      text-overflow: ellipsis;
      width: 350px;
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
        margin-bottom: 18px;
        display: flex;
        position: relative;
        .toHome {
          padding-top: 3px;
          color: #7d32ea;
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
            color: #7d32ea;
            line-height: 22px;
            display: flex;
          }
        }
        .home {
          background-image: url('@/assets/home-outlined.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Maintainer {
          background-image: url('@/assets/cose.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }
      .firstLast {
        display: flex;
        position: relative;
        .toHome {
          padding-top: 3px;
          color: #7d32ea;
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
            color: #7d32ea;
            line-height: 22px;
            display: flex;
          }
        }
        .home {
          background-image: url('@/assets/home-outlined.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Maintainer {
          background-image: url('@/assets/cose.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }
    }
  }
}
.searchInput {
  width: 350px;
  margin: 10px;
  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #002fa7 inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #002fa7 inset;
  }
}
.userInfo {
  .title {
    margin-bottom: 16px;
  }
  .slogan {
    margin-top: 16px;
  }
}
.usertypecolorbox {
  margin-left: 5px;
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
  height: 16px;
  width: 73px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.usertypecolorboxTC {
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
  width: 32px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
