<script setup lang="ts">
import TheProgress from "@/components/TheProgress.vue";
import OFormRadio from "@/components/OFormRadio.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { openCommunityInfo } from "@/api/index";
import { querySigUserContribute } from "shared/api/api-new";
import { IObject } from "shared/@types/interface";
import IconUser from "~icons/app/search";
import OIcon from "shared/components/OIcon.vue";
import { useCommonStore } from "@/stores/common";
import { useRouter } from "vue-router";
import ONoDataImage from "shared/components/ONoDataImage.vue";

const router = useRouter();
const useCommon = useCommonStore();
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: "",
  },
});
const contributionSelectBox = ref([
  {
    color: "#7D32EA",
    isSelected: true,
    label: "Maintainer",
    key: "maintainer",
  },
  { color: "#feb32a", isSelected: true, label: "Committer", key: "committer" },
  {
    color: "#4aaead",
    isSelected: true,
    label: "Contributor",
    key: "contributor",
  },
]);
const filterReallData = () => {
  if (reallData.value.length === 0) return;
  reallData.value = reallData.value.filter((item) => {
    return contributionSelectBox.value.some((it) => {
      return it.isSelected && item.usertype === it.key;
    });
  });
};
const reallData = ref([] as IObject[]);
const param = ref({
  contributeType: "pr",
  timeRange: "all",
  community: openCommunityInfo.name,
  sig: computed(() => props.sig),
} as IObject);
const memberData = ref([]);
const memberMax = ref(0);
const searchInput = ref("");
const getMemberData = () => {
  querySigUserContribute(param.value).then((data) => {
    const memberList = data?.data || [];
    if (memberList.length === 0) {
      memberMax.value = 0;
      memberData.value = [];
      reallData.value = [];
    } else {
      memberMax.value = memberList[0].contribute;
      memberData.value = memberList.map((item: any, index: any) => ({
        ...item,
        rank: index + 1,
      }));
      reallData.value = memberData.value;
    }
    filterReallData();
    currentPage.value = 1;
  }).catch(() => {
    memberMax.value = 0;
    memberData.value = [];
    reallData.value = [];
  });
};

const lastformOption = computed(() => {
  return [
    {
      label: t("from.type"),
      id: "contributeType",
      active: "pr",
      list: [
        { label: t("home.prs"), value: "pr" },
        { label: t("home.issues"), value: "issue" },
        { label: t("home.comments"), value: "comment" },
      ],
    },
    {
      label: t("from.timeRange"),
      id: "timeRange",
      active: "all",
      list: [
        { label: t("from.lastonemonth"), value: "lastonemonth" },
        { label: t("from.lasthalfyear"), value: "lasthalfyear" },
        { label: t("from.lastoneyear"), value: "lastoneyear" },
        { label: t("from.all"), value: "all" },
      ],
    },
  ];
});
// theform组件调用
const componentName = "member";
const loading = ref(true);
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
  getMemberData();
  switchType();
};
const typeLable = ref("");
const switchType = () => {
  switch (param.value.contributeType) {
    case "pr":
      typeLable.value = "home.prs";
      break;
    case "issue":
      typeLable.value = "home.issues";
      break;
    case "comment":
      typeLable.value = "home.comments";
      break;
  }
};
switchType();
watch(
  () => props.sig,
  () => {
    getMemberData();
  }
);
onMounted(() => {
  loading.value = false;
});
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: any) => {
  // 改变默认的页数
  if (!val?.isTrusted) {
    currentPage.value = val;
  }
};
// 搜索过滤

const querySearch = () => {
  if (searchInput.value !== "") {
    const newList = memberData.value.filter((item: any) =>
      item.user_login.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
    filterReallData();
  } else {
    getMemberData();
  }
};
const clearSearchInput = () => {
  getMemberData();
  searchInput.value = "";
};

// 按颜色过滤
const getcontributeValue = (item: any) => {
  item.isSelected = !item.isSelected;
  querySearch();
};
// 跳转个人详情
const goToUser = (data: IObject) => {
  const routeData: any = router.resolve({
    path: `/${useCommon.language}/user/${data}`,
    // query: {
    //   group: 'sig',
    //   organization: props.sig,
    // },
  });
  window.open(routeData.href, "_blank");
};
</script>
<template>
  <div>
    <div class="theSecondForm">
      <o-form-radio
        :option="lastformOption"
        @get-contribute-info="getContributeInfo($event)"
      >
        <template #searchInput>
          <div class="searchInput">
            <el-input
              v-model="searchInput"
              :trigger-on-focus="false"
              clearable
              :debounce="300"
              size="large"
              :placeholder="t('enterGitee')"
              @change="querySearch"
              @clear="clearSearchInput"
            >
              <template #prefix>
                <o-icon class="search-icon"><icon-user></icon-user></o-icon> </template
            ></el-input>
          </div> </template
      ></o-form-radio>
    </div>
    <div class="edcolor-box">
      <div
        v-for="value in contributionSelectBox"
        :key="value.label"
        class="yellow-box"
        style="cursor: pointer"
        @click="getcontributeValue(value)"
      >
        <div
          class="box"
          :style="{
            'background-color': value.isSelected ? value.color : '#cccccc',
          }"
        ></div>
        <span
          :style="{
            color: value.isSelected ? '' : '#cccccc',
          }"
          >{{ value.label }}</span
        >
      </div>
    </div>
    <div v-if="reallData?.length" class="ranking-list">
      <div class="ranking-list-item">
        <p class="caption"></p>
        <el-table
          v-loading="loading"
          :data="reallData.slice((currentPage - 1) * 10, currentPage * 10)"
          style="width: 100%"
        >
          <el-table-column prop="rank" align="center" :label="t('Number')" width="120" />
          <el-table-column
            prop="user_login"
            align="left"
            label="用户 ID"
            show-overflow-tooltip
            width="200"
            ><template #default="scope">
              <div class="usertype-box">
                <span
                  v-show="scope.row.usertype !== 'committer'"
                  class="usertypecolorbox"
                  :style="({
                    '--color':
                      scope.row.usertype === 'maintainer'
                        ? '#7D32EA'
                        : '#4AAEAD',
                  } as any)"
                ></span>
                <span
                  v-show="scope.row.usertype === 'committer'"
                  class="usertypecolorbox"
                  :style="({
                    '--color': '#FEB32A',
                  } as any)"
                ></span>
                <span
                  class="num"
                  :style="{
                    cursor: 'pointer',
                  }"
                  @click="goToUser(scope.row.user_login)"
                  >{{ scope.row.user_login }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" class-name="type-label" :label="t(typeLable)">
            <template #default="scope">
              <div class="box">
                <span class="num">{{ scope.row.contribute }}</span>

                <the-progress
                  :item="scope.row.contribute"
                  :component-name="componentName"
                  :member-list="memberMax"
                  :usertype="scope.row.usertype"
                ></the-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else><o-no-data-image></o-no-data-image></div>
    <div class="demo-pagination-block">
      <el-pagination
        class="o-pagination"
        v-show="reallData.length > 10"
        :current-page="currentPage"
        :page-size="10"
        background
        layout="prev, pager, next,slot, jumper"
        :total="reallData.length"
        @current-change="handleCurrentChange"
        ><span>{{ currentPage }}/{{ Math.ceil(reallData.length / 10) }}</span
        ><span
          class="el-pagination__jump"
          style="cursor: pointer"
          @click="handleCurrentChange"
          >{{ t("Goto") }}</span
        >
      </el-pagination>
      <span v-if="reallData.length > 10" class="el-pagination el-pagination__jump">{{
        t("page")
      }}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/shared/styles/style.scss";
// .theSecondForm {
//   // padding-right: 24px;
// }
.ranking-list {
  display: grid;
  grid-template-columns: 100%;
  // padding-right: 24px;
  :deep(.el-scrollbar__bar.is-horizontal) {
    height: 0px;
  }
  .caption {
    font-size: 16px;
    color: #000;
    line-height: 24px;
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    .num {
      width: 50px;
      text-align: right;
    }
  }
  .usertype-box {
    display: flex;
    align-items: center;
    .num {
      width: 100px;
      text-align: left;
      color: #7d32ea;
    }
  }
}
.edcolor-box {
  display: flex;
  padding-bottom: 10px;

  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #7d32ea;
      border-radius: 50%;
      margin-right: 8px;
    }
    .nobox {
      width: 12px;
      height: 12px;
      background: #000;
      border-radius: 50%;
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
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      border-radius: 50%;
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
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
}
.demo-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.usertypecolorbox {
  width: 12px;
  height: 12px;
  // background: linear-gradient(var(--color));
  background: var(--color);
  border-radius: 50%;
  margin-right: 8px;
}
.leader {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  &-box {
    width: 54px;
    height: 22px;

    background: #7d32ea;
    border-radius: 2px;
    color: #ffffff;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-family: Helvetica-Light, Helvetica;
    font-weight: 300;
  }
}
.searchInput {
  width: 100%;
  margin: 10px 0 20px;
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
  :deep(.el-input__inner) {
    height: 56px;
  }
}
.el-pagination__jump {
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #999999;
  border-radius: 0px;
  margin-left: 0px;
  .el-input__wrapper {
    flex-grow: 0.273;
  }
}
</style>
<style lang="scss">
.o-pagination {
  --o-pagination-font-color: #000000;
  --o-pagination-font-color_active: #7d32ea;
  --o-pagination-bg-color: #e5e5e5;
  --o-pagination-bg-color_hover: var(--o-color-brand5);
  --o-pagination-bg-color_selected: var(--o-color-brand5);
  --o-pagination-number-border-color_active: var(--o-color-brand1);

  &.el-pagination {
    justify-content: center;
    @media screen and (max-width: 768px) {
      display: none;
    }
    padding: 2px 0px;
    .el-pagination__sizes {
      margin: 0 0 0 0;
    }
    .el-input {
      --el-input-bg-color: var(--o-pagination-bg-color);
      --el-input-text-color: var(--o-pagination-font-color);
    }
    .el-input__wrapper {
      border-radius: 0px;
      box-shadow: none;
      height: 36px;
    }
    .el-pagination__editor {
      justify-content: center !important;
      margin: 0 8px !important;
      min-width: 56px !important;
    }
    .el-select {
      --el-select-border-color-hover: none;
      --el-select-input-focus-border-color: none;
      & .el-input .el-select__caret {
        color: var(--o-pagination-font-color);
      }
    }
    .el-select-dropdown__wrap {
      background-color: #000 !important;
    }
    .el-pager li {
      color: var(--o-pagination-font-color);
      background: var(--o-pagination-bg-color);
      border-radius: 0px;
      line-height: 36px;
      height: 36px;
      width: 36px;
      &:hover {
        color: #ffffff !important;
        background-color: var(--o-pagination-font-color_active);
      }
    }
    .el-pager li.is-active.number {
      background: var(--o-pagination-font-color_active);
      color: #ffffff !important;
      font-weight: 400;
      font-size: 14px;
    }
    .btn-next,
    .btn-prev {
      width: 36px;
      height: 36px;
      color: var(--o-pagination-font-color);
      border-radius: 0px;
      background: var(--o-pagination-bg-color);
    }
    .btn-prev:disabled {
      background: #e5e5e5;
    }
    .btn-next {
      margin-right: 16px !important;
    }
    .btn-next:disabled {
      background: #e5e5e5;
    }

    .el-pagination__jump {
      height: 36px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #999999;
      border-radius: 0px;
      margin-left: 6px;
      .el-input__wrapper {
        flex-grow: 0.273;
      }
    }
  }
}
</style>
