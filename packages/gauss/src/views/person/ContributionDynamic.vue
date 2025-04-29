<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { IObject } from "shared/@types/interface";
import IconUser from "~icons/app/search";
import OIcon from "shared/components/OIcon.vue";
import OFormRadio from "@/components/OFormRadio.vue";
import { queryUserContributeDetails, queryUserContributeCounts, queryUserSigContribute } from "shared/api/api-new";
import CommonPR from "@/assets/commonPR.png";
import comment from "@/assets/comment.png";
import noclick from "@/assets/noclick.png";
import text from "@/assets/text.png";
import { Search } from "@element-plus/icons-vue";
import ONoDataImage from "shared/components/ONoDataImage.vue";
import { ElScrollbar } from "element-plus";
const loading = ref(false);
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: "",
  },
});
// 评论图表筛选
const infoFirst = ref(1);
const infoSeconed = ref(1);
const commentSelectBox = ref([
  {
    color: comment,
    isSelected: true,
    label: "General",
    key: 0,
    type: "command",
    info: computed(() => infoFirst.value),
  },
  {
    color: text,
    isSelected: true,
    label: "Order",
    key: 1,
    type: "normal",
    info: computed(() => infoSeconed.value),
  },
]);
const selectedSig = ref("");
const pageSize = ref(10);
// 搜索过滤
const searchInput = ref("");
const commentType = ref("");
// 默认显示第1页
const currentPage = ref(1);
const totalCount = ref({
  pr: 0,
  issue: 0,
  comment: 0,
  sig: 0,
});

const defaultParams = computed(() => ({
  user: props.sig,
  page: currentPage.value,
  pageSize: pageSize.value,
  filter: searchInput.value,
  comment_type: commentType.value,
  sig: selectedSig.value === 'all' ? '' : selectedSig.value,
}));

const filterParams = ref({
  community: "opengauss",
  contributeType: "pr" as 'pr' | 'issue' | 'comment',
  timeRange: "all",
});

const displayTotalCount = computed(() => totalCount.value?.[filterParams.value.contributeType] || 0);

// 组织贡献from
const formOption = computed(() => {
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
const getContributeInfo = (e: IObject) => {
  filterParams.value[e.id as keyof typeof filterParams.value] = e.active;
  switchTime();
  switchType();
  getDetailsData();
  updateTotalCount();
};
// 格式化统计周期文字
const timeRangeText = ref("");
const switchTime = () => {
  switch (filterParams.value.timeRange) {
    case "lastonemonth":
      timeRangeText.value = t("from.lastonemonth");
      break;
    case "lasthalfyear":
      timeRangeText.value = t("from.lasthalfyear");
      break;
    case "lastoneyear":
      timeRangeText.value = t("from.lastoneyear");
      break;
    default:
      timeRangeText.value = t("from.all");
      break;
  }
};
switchTime();
const typeLable = ref("");
const switchType = () => {
  switch (filterParams.value.contributeType) {
    case "pr":
      typeLable.value = t("home.prs");
      break;
    case "issue":
      typeLable.value = t("home.issues");
      break;
    case "comment":
      typeLable.value = t("home.comments");
      break;
  }
};
switchType();

// 获取表格数据
const getDetailsData = () => {
  loading.value = true;
  queryUserContributeDetails({
    ...defaultParams.value,
    ...filterParams.value,
  }, filterParams.value.contributeType)
    .then((res) => {
      const data = res?.data || [];
      reallData.value = data.sort((a: any, b: any)=> {
        return a.time < b.time ? 1 : -1;
      });
      loading.value = false;
    })
    .catch(() => (loading.value = false));
};
getDetailsData();

const updateTotalCount = () => {
  queryUserContributeCounts({
    ...filterParams.value,
    sig: selectedSig.value === 'all' ? '' : selectedSig.value,
    user: props.sig
  }).then((res) => {
    if (res.data) {
      totalCount.value = res.data;
    }
  });
};
updateTotalCount();

// 搜索结果
const reallData = ref([] as IObject[]);

const querySearch = () => {
  if (searchInput.value !== "") {
    getDetailsData();
  } else {
    filterReallData();
  }
};
const clearSearchInput = () => {
  getDetailsData();
};
watch(
  () => props.sig,
  () => {
    getprlistData();
    getDetailsData();
    updateTotalCount();
  }
);
watch(
  () => pageSize.value,
  () => {
    getDetailsData();
  }
);
watch(
  () => selectedSig.value,
  () => {
    // selParam();
    getDetailsData();
    updateTotalCount();
  }
);
const options = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 50,
    label: "50",
  },
];
const userSigs = ref<string[]>([]);
const getprlistData = () => {
  const query = {
    user: props.sig,
    timeRange: "all",
    community: "opengauss",
    contributeType: "pr",
  };
  queryUserSigContribute(query).then((data) => {
    const value = data?.data || [];
    const seldata: any = [];
    value.map((item: any) => {
      seldata.push(item.sig_name);
    });
    userSigs.value = seldata.sort((a: string, b: string) =>
      a.localeCompare(b)
    );
    userSigsOptions.value = userSigs.value;
  });
};
getprlistData();

const filterReallData = () => {
  if (filterParams.value.contributeType === "comment") {
    if (infoFirst.value === 1 && infoSeconed.value === 0) {
      commentType.value = "normal";
    } else if (infoFirst.value === 0 && infoSeconed.value === 1) {
      commentType.value = "command";
    } else if (infoFirst.value === 0 && infoSeconed.value === 0) {
      commentType.value = "noneType";
    } else if (infoFirst.value === 1 && infoSeconed.value === 1) {
      commentType.value = "all";
    }
    getDetailsData();
  }
};

// 显示第几页
const handleCurrentChange = (val: any) => {
  // 改变默认的页数
  if (!val?.isTrusted) {
    currentPage.value = val;
    getDetailsData();
  }
};

const changeTage = (item: any) => {
  item.isSelected = !item.isSelected;
  if (item.isSelected && item.key === 0) {
    infoFirst.value = 1;
  } else if (!item.isSelected && item.key === 0) {
    infoFirst.value = 0;
  } else if (item.isSelected && item.key === 1) {
    infoSeconed.value = 1;
  } else if (!item.isSelected && item.key === 1) {
    infoSeconed.value = 0;
  }
  if (infoFirst.value === 1 && infoSeconed.value === 0) {
    commentType.value = "normal";
  } else if (infoFirst.value === 0 && infoSeconed.value === 1) {
    commentType.value = "command";
  } else if (infoFirst.value === 0 && infoSeconed.value === 0) {
    commentType.value = "noneType";
  } else if (infoFirst.value === 1 && infoSeconed.value === 1) {
    commentType.value = "all";
  }

  getDetailsData();
};

// sig组搜索过滤
const sigsSearchInput = ref();
const userSigsOptions = ref<string[]>([]);
const sigsQuerySearch = () => {
  if (sigsSearchInput.value !== "") {
    const newList = userSigs.value?.filter((item: any) =>
      item.toLowerCase().includes(sigsSearchInput.value)
    );
    userSigsOptions.value = newList;
  } else {
    userSigsOptions.value = userSigs.value;
  }
};
// 清除搜索
const clearSigsSearchInput = () => {
  searchInput.value = "";
};
</script>

<template>
  <div class="contributions-statistical">
    <div class="sel">
      <div class="title">SIG {{ t("filtrate") }}</div>
      <el-select
        v-model="selectedSig"
        :placeholder="t('from.all')"
        size="large"
        popper-class="remove-scrollbar"
      >
        <el-input
          v-model="sigsSearchInput"
          clearable
          :debounce="300"
          class="w-50 m-2"
          :placeholder="t('enterSIG')"
          :prefix-icon="Search"
          @input="sigsQuerySearch"
          @clear="clearSigsSearchInput"
        />
        <el-scrollbar class="Escrollbar">
          <el-option :label="t('from.all')" value="all" />
          <el-option
            v-for="item in userSigsOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-scrollbar>
      </el-select>
    </div>
    <div class="line"></div>
    <o-form-radio :option="formOption" @get-contribute-info="getContributeInfo($event)">
      <template #searchInput>
        <div class="searchInput">
          <el-input
            v-model="searchInput"
            :trigger-on-focus="false"
            clearable
            :debounce="300"
            size="large"
            :placeholder="t('enterWord')"
            @change="querySearch"
            @clear="clearSearchInput"
          >
            <template #prefix>
              <o-icon class="search-icon"><icon-user></icon-user></o-icon> </template
          ></el-input>
        </div>
      </template>
    </o-form-radio>
  </div>
  <div class="detail">
    <!-- <div v-if="param.contributeType === 'pr'" class="prType">
      <div
        v-for="item in contributionSelectBox"
        :key="item.label"
        class="color-box"
        style="cursor: pointer"
        @click="changeTage(item)"
      >
        <img :src="item.color" alt="" />
        <span class="sp" :style="{ color: item.isSelected ? '#002fa7' : '' }"
          >{{ t(item.label) }} PR</span
        >
      </div>
    </div> -->
    <div v-if="filterParams.contributeType === 'pr' && reallData?.length" class="prType">
      <img :src="CommonPR" alt="" />
      <span class="sp">PR</span>
    </div>
    <div v-if="filterParams.contributeType === 'issue' && reallData?.length" class="prType">
      <img src="@/assets/issue.png" alt="" /> <span class="sp">Issue</span>
    </div>
    <div v-if="filterParams.contributeType === 'comment'" class="prType">
      <div
        v-for="item in commentSelectBox"
        :key="item.label"
        class="color-box"
        style="cursor: pointer"
        @click="changeTage(item)"
      >
        <img :src="item.isSelected ? item.color : noclick" alt="" />
        <span class="sp" :style="{ color: item.isSelected ? '' : '#CCCCCC' }">{{
          t(item.label)
        }}</span>
      </div>
    </div>

    <div v-if="reallData?.length" class="page">
      <span class="sp"
        >{{ t("total") }}<span class="num">{{ displayTotalCount }}</span
        >{{ t("result") }}</span
      >
      <span
        >{{ t("display")
        }}<span class="num">
          <el-select v-model="pageSize" class="m-2" placeholder="10" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select></span
        >{{ t("bar") }}</span
      >
    </div>
  </div>
  <div v-if="reallData?.length" v-loading="loading" class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in reallData"
        :key="'com' + index"
        class="bar-content-item"
      >
        <div class="index">
          {{ item.time.split("T").slice(0, 1).toString() }}
        </div>
        <div class="infos">
          <div class="infos-img">
            <img
              v-if="filterParams.contributeType === 'pr' && item.is_main_feature === 1"
              src="@/assets/mainPR.png"
              alt=""
            />
            <img
              v-if="filterParams.contributeType === 'pr' && item.is_main_feature === 0"
              src="@/assets/commonPR.png"
              alt=""
            />
            <img
              v-if="filterParams.contributeType === 'issue'"
              src="@/assets/issue.png"
              alt=""
            />
            <img
              v-if="filterParams.contributeType === 'comment' && item.is_invalid_comment === 1"
              src="@/assets/text.png"
              alt=""
            />
            <img
              v-if="filterParams.contributeType === 'comment' && item.is_invalid_comment === 0"
              src="@/assets/comment.png"
              alt=""
            />
          </div>
          <div class="infos-text">
            <span v-if="filterParams.contributeType === 'comment'">{{ t("comment") }} </span
            ><span v-else>{{ t("In") }}</span>
            <a class="index" :href="`https://gitee.com/${item.repo}`" target="_blank">{{
              item.repo
            }}</a
            ><span v-if="filterParams.contributeType === 'pr'"
              >{{ t("create") }} Pull Request</span
            ><span v-else-if="filterParams.contributeType === 'issue'"
              >{{ t("create") }} {{ t("task") }}</span
            ><span v-else> {{ t("de") }} Pull Request</span>
            <a :href="item.url" target="_blank" class="rigth-index"
              >!{{ item.no }} {{ item.info }}</a
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else><o-no-data-image></o-no-data-image></div>
  <div class="demo-pagination-block">
    <!-- <el-pagination
      v-show="totalCount / pageSize > 1"
      v-model:page-size="pageSize"
      :currentPage="currentPage"
      background
      layout="prev, pager, next,jumper"
      :total="totalCount"
      @current-change="handleCurrentChange"
    /> -->
    <el-pagination
      class="o-pagination"
      v-show="displayTotalCount / pageSize > 1"
      :currentPage="currentPage"
      v-model:page-size="pageSize"
      background
      layout="prev, pager, next,slot, jumper"
      :total="displayTotalCount"
      @current-change="handleCurrentChange"
      ><span>{{ currentPage }}/{{ Math.ceil(displayTotalCount / pageSize) }}</span
      ><span
        class="el-pagination__jump"
        style="cursor: pointer"
        @click="handleCurrentChange"
        >{{ t("Goto") }}</span
      ></el-pagination
    >
    <span v-if="displayTotalCount / pageSize > 1" class="pageSpan">{{
      t("page")
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/shared/styles/style.scss";
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
.bar-panel {
  position: relative;
  height: 100%;
  padding-bottom: 12px;
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    .infos {
      font-size: 14px;
      color: #000000;
      line-height: 22px;
      display: grid;
      grid-template-columns: 20px auto;
      &-img {
        display: inline-flex;
        align-items: center;
        margin-right: 3px;
        height: 22px;
      }
      &-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .index {
        margin-right: 3px;
        font-size: 14px;
        color: #7d32ea;
        margin-left: 3px;
      }
      .rigth-index {
        margin-left: 3px;
        color: #7d32ea;
      }
    }
  }
  .index {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }
}
.detail {
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 16px;
  .prType {
    display: flex;
    align-items: center;
    .color-box {
      display: flex;
      align-items: center;
      .sp {
        padding-left: 1px;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
  .sp {
    // width: 69px;
    height: 18px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    margin-left: 5px;
    margin-right: 24px;
  }
  .page {
    position: absolute;
    right: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    .num {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
      padding-left: 2px;
      padding-right: 2px;
    }
  }
}
.sel {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  .title {
    // width: 122px;
    margin-right: 24px;
  }
}
.line {
  border-bottom: 1px solid #dfe1e8;
  margin-bottom: 18px;
}
.demo-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pageSpan{
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #999999;
  border-radius: 0px;
  margin-left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.num {
  .el-select .el-input__inner {
    width: 48px;
    height: 24px;
    margin-right: 2px;
    margin-left: 2px;
  }
}
.sel {
  .el-select .el-input__inner {
    width: 368px;
    height: 32px;
  }
}
.el-select-dropdown__item {
  padding: 0 15px 0 15px;
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
