<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import OAnchor from 'shared/components/OAnchor.vue';
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { queryUserOwnertype } from 'shared/api/api-new';
import { openCommunityInfo } from '@/api';
import { Search } from '@element-plus/icons-vue';
import { ElScrollbar } from 'element-plus';
import SigContribution from './SigContribution.vue';
import ContributionDynamic from './ContributionDynamic.vue';
import DataShow from './DataShow.vue';
import useVirtualList from 'shared/hooks/useVirtualList';
import { queryUserContributeCounts } from 'shared/api/api-new';
import { usePersonalStore } from '@/stores/personal';

const userStore = usePersonalStore();
const useCommon = useCommonStore();
const router = useRouter();
const route = useRoute();
const sencondTitle = ref('');
const { t } = useI18n();
sencondTitle.value = route.params.name as string;
const sigTitle = ref('');
sigTitle.value = route.query.organization as string;
const group = ref('');
group.value = route.query.group as string;

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
    community: 'openeuler',
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
  getllData();
};

const getllData = () => {
  clean();
  querySearch();
  querySigInfoData();
};
onMounted(() => {
  querySigInfoData();
});
// 跳转首页
const goToTetail = () => {
  router.push(`/${useCommon.language}/detail`);
};
// 搜索过滤
const searchInput = ref('');
const allUserList = ref<string[]>(Array.from(userStore.allUsers?.keys() ?? []));
const querySearch = () => {
  if (searchInput.value !== '') {
    allUserList.value = Array.from(userStore.allUsers?.keys() ?? []).filter((item: any) =>
      item.toLowerCase().includes(searchInput.value)
    );
  } else {
    allUserList.value = Array.from(userStore.allUsers?.keys() ?? []);
  }
};
// 清除搜索
const clearSearchInput = () => {
  searchInput.value = '';
};
const clean = () => {
  searchInput.value = '';
};
// 获取侧边栏明细
const sigInfo = ref<{ sig_name: string; role: string[] }[]>([]);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    user: sencondTitle.value,
  };
  queryUserOwnertype(params).then((data) => {
    sigInfo.value = data?.data || [];
    sigInfo.value.forEach((item, index) => {
      item.role.sort((a: any, b: any) => b.length - a.length);
      if (item.sig_name === 'TC') {
        sigInfo.value.unshift(sigInfo.value.splice(index, 1)[0]);
      }
    });
  });
};

// querySigInfoData();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const scrollWrapper = computed(() => scrollbarRef.value?.wrap$!)
const { visibleData, totalHeight, windowOffset, update } = useVirtualList(scrollWrapper, allUserList, 32);

const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
  update();
};

const showDropdown = (e: any) => {
  if (e) {
    const number = userStore.allUsers?.get(sencondTitle.value) ?? 0;
    inputSlider(number * 32);
  }
};

const goToSig = (data: string) => {
  const routeData: any = router.resolve(`/${useCommon.language}/sig/${data}`);
  window.open(routeData.href, '_blank');
};
</script>
<template>
  <div class="container">
    <o-anchor :data="anchorData" top="11rem"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one" @click="goToTetail()">{{
          t('nav.contributors')
        }}</span>
        <span> > {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">
          <div class="main-left-top">
            <div class="edropdown">
              <el-dropdown
                placement="bottom-start"
                @visible-change="showDropdown"
              >
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
                  <el-scrollbar ref="scrollbarRef" height="400px" :view-style="{ height: `${totalHeight}px` }">
                    <div :style="{ transform: `translateY(${windowOffset}px)` }">
                      <el-dropdown-item
                        v-for="item in visibleData"
                        :key="item"
                        @click="clickDrownItem(item as any)"
                      >
                        {{ item }}
                      </el-dropdown-item>
                    </div>
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
                <a
                  style="color: #002fa7"
                  target="_blank"
                  :href="`https://gitee.com/${sencondTitle}`"
                >
                  {{ t('toHome') }}</a
                >
              </div>
            </div>
            <div class="firstLast">
              <div class="Maintainer"></div>
              <div class="List">
                <span>{{ t('community') }}： </span>
                <span v-for="sig in sigInfo" :key="sig.sig_name" class="item">
                  <span
                    v-if="sig.sig_name === 'TC'"
                    class="usertypecolorboxTC"
                    :style="({ '--color': '45deg, #B461F6 0%, #7D32EA 100%' } as any)"
                    >TC</span
                  >
                  <span
                    v-if="sig.sig_name !== 'TC'"
                    style="cursor: pointer"
                    @click="goToSig(sig.sig_name)"
                    >{{ sig.sig_name }}</span
                  >

                  <span v-for="item in sig.role" :key="item"
                    ><span
                      v-if="item === 'committer'"
                      class="usertypecolorbox"
                      :style="({ '--color': '225deg, #FEB32A 0%, #F6D365 100%' } as any)"
                      >Committer</span
                    ><span
                      v-if="item === 'maintainer' && sig.sig_name !== 'TC'"
                      class="usertypecolorbox"
                      :style="({ '--color': '45deg, #005CD3 0%, #002FA7 100%' } as any)"
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
.contributors-panel-last{
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
    color: #002fa7;
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
        background-image: url('@/assets/linedown.png');
        width: 24px;
        height: 24px;
        position: absolute;
        right: -15px;
      }
    }
    &-title {
      font-size: 24px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
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
