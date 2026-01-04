<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { IObject } from "shared/@types/interface";
import IconUser from "~icons/app/search";
import OIcon from "shared/components/OIcon.vue";
import MobileOFormRadio from "../sig/MobileOFormRadio.vue";
import OMobilePagination from "shared/components/OMobilePagination.vue";
import ONoDataImage from "shared/components/ONoDataImage.vue";
import CommonPR from "@/assets/CommonPR.png";
import comment from "@/assets/comment.png";
import noclick from "@/assets/noclick.png";
import text from "@/assets/text.png";
import { Search } from "@element-plus/icons-vue";
import { queryUserContributeCountsByFilter, queryUserContributeDetails, queryUserSigContribute } from "shared/api/api-new";
import { pick } from "lodash-es";
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: "",
  },
});
const selectedSig = ref("");
const value = ref(50);
const commentType = ref("");
// 默认显示第1页
const currentPage = ref(1);
// 搜索过滤
const searchInput = ref("");

const defaultParams = computed(() => ({
  user: props.sig,
  page: currentPage.value,
  pageSize: 10,
  filter: searchInput.value,
  comment_type: commentType.value,
  sig: selectedSig.value === 'all' ? '' : selectedSig.value,
}));

const filterParams = ref({
  community: "openeuler",
  contributeType: "pr" as 'pr' | 'issue' | 'comment',
  timeRange: "lastonemonth",
});

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
      active: "lastonemonth",
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
  nextTick(() => getUserSigs());
  filterParams.value[e.id as string] = e.active;
  getDetailsData();
  updateTotalCount();
};

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

// 搜索结果
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== "") {
    getDetailsData();
    updateTotalCount();
  } else {
    filterReallData();
  }
};
const clearSearchInput = () => {
  getDetailsData();
  searchInput.value = "";
};
watch(
  () => props.sig,
  () => {
    getUserSigs();
    getDetailsData();
  }
);
watch(
  () => value.value,
  () => {
    getDetailsData();
  }
);
watch(
  () => selectedSig.value,
  () => {
    getDetailsData();
  }
);
const userSigs = ref();
const getUserSigs = () => {
  const query = {
    user: props.sig,
    timeRange: "all",
    community: "openeuler",
    contributeType: "pr",
  };
  queryUserSigContribute(query).then((data) => {
    const value = data?.data || [];
    const seldata: any = [];
    value?.map((item: any) => {
      seldata.push({
        name: item.sig_name,
      });
    });
    userSigs.value = seldata.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name)
    );
    userSigsOptions.value = userSigs.value;
  });
};
getUserSigs();
const totalCount = ref({
  pr: 0,
  issue: 0,
  comment: 0,
  sig: 0,
});
const displayTotalCount = computed(() => totalCount.value?.[filterParams.value.contributeType] || 0);
const loading = ref(false);
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
  const queryParams = {
    ...filterParams.value,
    ...pick(defaultParams.value, ['user', 'comment_type', 'sig', 'filter']),
  };
  queryUserContributeCountsByFilter(queryParams, filterParams.value.contributeType).then((res) => {
    if (res.data) {
      totalCount.value = res.data;
    }
  });
};
updateTotalCount();

// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
  getDetailsData();
};
// 图表筛选
const changeTag = (item: any) => {
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
const sigsSearchInput = ref('');
const userSigsOptions = ref([] as IObject[]);
const sigsQuerySearch = () => {
  if (sigsSearchInput.value.trim()) {
    const lwc = sigsSearchInput.value.toLowerCase();
    userSigsOptions.value = userSigs.value.filter((item: any) =>
      item.name.toLowerCase().includes(lwc)
    );
  } else {
    userSigsOptions.value = userSigs.value;
  }
};
// 清除搜索
const firstclearSearchInput = () => {
  searchInput.value = "";
};

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
</script>

<template>
  <div class="contributions-statistical">
    <div class="sel">
      <div class="title">SIG{{ t("filtrate") }}</div>
      <el-select v-model="selectedSig" :placeholder="t('from.all')" size="large">
        <el-input
          v-model="sigsSearchInput"
          clearable
          :debounce="300"
          class="w-50 m-2"
          :placeholder="t('enterSIG')"
          :prefix-icon="Search"
          @input="sigsQuerySearch"
          @clear="firstclearSearchInput"
        />
        <el-option :label="t('from.all')" value="all" />
        <el-option
          v-for="item in userSigsOptions"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </div>
    <div class="line"></div>
    <mobile-o-form-radio
      :option="formOption"
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
            :placeholder="t('enterWord')"
            @change="querySearch"
            @clear="clearSearchInput"
          >
            <template #prefix>
              <o-icon class="search-icon"><icon-user></icon-user></o-icon> </template
          ></el-input>
        </div>
      </template>
    </mobile-o-form-radio>
  </div>
  <div class="detail">
    <div v-if="filterParams.contributeType === 'pr' && reallData?.length" class="prType">
      <img :src="CommonPR" alt="" />
      <span class="sp">PR</span>
    </div>
    <div v-if="filterParams.contributeType === 'issue'&& reallData?.length" class="prType">
      <img src="@/assets/!.png" alt="" /> <span class="sp">Issue</span>
    </div>
    <div v-if="filterParams.contributeType === 'comment'" class="prType">
      <div
        v-for="item in commentSelectBox"
        :key="item.label"
        class="color-box"
        style="cursor: pointer"
        @click="changeTag(item)"
      >
        <img :src="item.isSelected ? item.color : noclick" alt="" />
        <span class="sp" :style="{ color: item.isSelected && reallData?.length? '' : '#CCCCCC' }">{{
          t(item.label)
        }}</span>
      </div>
    </div>
  </div>
  <div v-if="reallData?.length" v-loading="loading" class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in reallData.sort( (a:any, b:any)=> {
            return a.time < b.time ? 1 : -1;
          })"
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
              src="@/assets/MainPR.png"
              alt=""
            />
            <img
              v-if="filterParams.contributeType === 'pr' && item.is_main_feature === 0"
              src="@/assets/CommonPR.png"
              alt=""
            />
            <img v-if="filterParams.contributeType === 'issue'" src="@/assets/!.png" alt="" />
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
            <a class="index" :href="`https://atomgit.com/${item.repo}`" target="_blank">{{
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
    <o-mobile-pagination
      v-show="displayTotalCount > 10"
      :current-page="currentPage"
      :page-size="10"
      :total="displayTotalCount"
      @current-change="handleCurrentChange"
    />
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
  :deep(.el-input__inner) {
    height: 56px;
  }
}
.bar-panel {
  position: relative;
  // height: 100%;
  // margin-bottom: 400px;
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    .infos {
      font-size: 12px;
      color: #000000;
      line-height: 16px;
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
        font-size: 12px;
        color: #002fa7;
        margin-left: 3px;
      }
      .rigth-index {
        margin-left: 8px;
        color: #002fa7;
      }
    }
  }
  .index {
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }
}
.detail {
  display: flex;
  align-items: center;
  position: relative;
  .prType {
    display: flex;
    align-items: center;
    .color-box {
      margin-right: 24px;
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
    margin-left: 2px;
    margin-right: 4px;
  }
}

.sel {
  margin-bottom: 14px;
  // display: flex;
  // align-items: center;
  .title {
    margin-bottom: 14px;
    width: 122px;
    font-size: 12px;
  }
}
.line {
  border-bottom: 1px solid #dfe1e8;
  margin-bottom: 18px;
}
.demo-pagination-block {
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
  }
}
.sel {
  .el-select .el-input__inner {
    // width: 368px;
    height: 32px;
  }
}
.el-select-dropdown__item {
  padding: 0 15px 0 15px;
}
</style>
