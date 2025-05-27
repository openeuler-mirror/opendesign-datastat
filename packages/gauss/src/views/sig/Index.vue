<script setup lang="ts">
import { useCommonStore } from "@/stores/common";
import OGAnchor from "shared/components/OGAnchor.vue";
import HistoricalTrend from "./HistoricalTrend.vue";
import CurrentTrend from "./CurrentTrend.vue";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import ContributList from "./ContributList.vue";
import { querySigName, querySigInfo } from "shared/api";
import { openCommunityInfo } from "@/api";
import { IObject } from "shared/@types/interface";
import { Search } from "@element-plus/icons-vue";
import { ElScrollbar } from "element-plus";
import AppFooter from "@/components/AppFooter.vue";
import { hasPermission } from "shared/utils/login";
import VisualIndex from "./VisualIndex.vue";
const useCommon = useCommonStore();
const router = useRouter();
const route = useRoute();
const sencondTitle = ref("");
const { t } = useI18n();
const drownData = ref([] as any[]);
// sencondTitle.value = route.params.name as string;
const getDrownData = () => {
  let community = "opengauss";

  querySigName(community).then((data) => {
    const allSigs = data?.data || {};
    allSigs.opengauss.sort((a: any, b: any) => a.localeCompare(b));
    const findOne =
      allSigs.opengauss.find((item: any) => item === route.params.name) ||
      allSigs.opengauss[0];
    sencondTitle.value = findOne;
    const firstKeys = Object.keys(allSigs);
    drownData.value = allSigs[firstKeys[0]];
    reallData.value = drownData.value.sort((a, b) => a.localeCompare(b));
    getllData();
  });
};

const anchorData = computed(() => {
  return hasPermission("sigRead")
    ? [
        "currentVitalityIndex",
        "historicalVitalityIndicators",
        "companyContributor",
        "userContributor",
      ]
    : ["userContributor"];
});
const clickDrownItem = (item: string) => {
  sencondTitle.value = item;
  getllData();
};
const getllData = () => {
  clean();
  querySearch();
  querySigInfoData();
  // querySorceData();
  // getCubeData();
};
onMounted(() => {
  getDrownData();
});
// 跳转首页
const goToTetail = () => {
  router.push(`/${useCommon.language}/detail`);
};
// 搜索过滤
const searchInput = ref("");
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== "") {
    const newList = drownData.value.filter((item: any) =>
      item.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
  } else {
    reallData.value = drownData.value;
  }
};
// 清除搜索
const clearSearchInput = () => {
  getDrownData();
  searchInput.value = "";
};
const clean = () => {
  searchInput.value = "";
};
// 获取侧边栏明细
const sigInfo = ref({
  mailing_list: "",
} as IObject);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: sencondTitle.value,
  };

  querySigInfo(params).then((data) => {
    sigInfo.value = data?.data[0] || {};
  });
};
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
</script>
<template>
  <div class="container">
    <o-g-anchor :data="anchorData" top="11rem"></o-g-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one" @click="goToTetail()">{{ t("nav.contributors") }}</span>
        <span> > {{ sencondTitle }}</span>
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
                      placeholder="请输入SIG名称搜索"
                      :prefix-icon="Search"
                      @input="querySearch"
                      @clear="clearSearchInput"
                    />
                  </div>
                  <el-scrollbar ref="scrollbarRef" height="400px">
                    <el-dropdown-item
                      v-for="item in reallData"
                      :key="item.value"
                      @click="clickDrownItem(item as any)"
                    >
                      {{ item }}
                    </el-dropdown-item>
                  </el-scrollbar>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="main-left-sp">
            <div class="slogan">
              {{ sigInfo.description === "." ? "" : sigInfo.description }}
            </div>
            <div class="first">
              <div class="home"></div>
              <div class="toHome">
                <a
                  style="color: #7d32ea"
                  target="_blank"
                  :href="`https://gitee.com/opengauss/tc/tree/master/sigs/${sencondTitle}`"
                >
                  {{ t("toHome") }}</a
                >
              </div>
            </div>
            <div class="first">
              <div class="email"></div>
              <div class="List">
                <span>{{ t("MailingList") }}：</span>
                <a
                  v-if="sigInfo.mailing_list"
                  :href="`https://mailweb.opengauss.org/postorius/lists/${
                    sigInfo.mailing_list.split('@')[0]
                  }.${sigInfo.mailing_list.split('@')[1]}`"
                  class="item"
                  target="_blank"
                >
                  {{ sigInfo.mailing_list === "NA" ? "" : sigInfo.mailing_list }}
                </a>
              </div>
            </div>
            <div class="first">
              <div class="Maintainer"></div>
              <div class="List">
                <span>Maintainers： </span>
                <a
                  v-for="item in sigInfo.maintainers"
                  :key="item.value"
                  class="item"
                  target="_blank"
                  :href="`https://gitee.com/${item}`"
                >
                  @{{ item }}
                </a>
              </div>
            </div>
            <div class="first">
              <div class="store"></div>
              <div class="List">
                <span>{{ t("warehouse") }}：</span>
                <div class="atlas">
                  <a
                    v-for="item in sigInfo.repos"
                    :key="item"
                    class="item"
                    :href="`https://gitee.com/opengauss/${item}`"
                    target="_blank"
                  >
                    ./{{ item }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div v-if="hasPermission('sigRead')" class="contributors-panel">
            <VisualIndex :sencondTitle="sencondTitle" :drownData="drownData" />
            <current-trend :sig="sencondTitle"></current-trend>
          </div>
          <div v-if="hasPermission('sigRead')" class="contributors-panel">
            <h3 id="historicalVitalityIndicators" class="title">
              {{ sencondTitle + " " + t("historicalVitalityIndicators") }}
            </h3>
            <historical-trend :sig="sencondTitle"></historical-trend>
          </div>
          <div class="contributors-panel-last">
            <h3 id="userContributor" class="title">
              {{ sencondTitle + " " + t("userContributor") }}
            </h3>
            <contribut-list :sig="sencondTitle"></contribut-list>
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
  .img {
    display: flex;
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
        background-image: url("@/assets/down.png");
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
        margin-top: 18px;
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
          }
        }
        .home {
          background-image: url("@/assets/home-outlined.png");
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .email {
          background-image: url("@/assets/email.png");
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .IRC {
          background-image: url("@/assets/chat.png");
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Maintainer {
          background-image: url("@/assets/use-square.png");
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Mentor {
          background-image: url("@/assets/user.png");
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .store {
          background-image: url("@/assets/cube.png");
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
      background: #7d32ea;
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
  // width: 350px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
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
      box-shadow: 0 0 0 1px #7d32ea inset;
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
    box-shadow: 0 0 0 1px #7d32ea inset;
  }
}
.noitem {
  margin-top: 8px;
  font-size: 14px;
  font-family: HarmonyOS_Sans_SC_Medium;
  line-height: 22px;
}
</style>
