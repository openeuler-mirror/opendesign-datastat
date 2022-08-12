<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formType } from 'shared/@types/interface';
import { IObject } from 'shared/@types/interface';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import MobileOFormRadio from '../sig/MobileOFormRadio.vue';
import OMobilePagination from 'shared/components/OMobilePagination.vue';
import { toThousands } from 'shared/utils/helper';
import {
  queryUserSigContribute,
  queryUserContributeDetails,
} from 'shared/api/index';
import ONoDataImage from 'shared/components/ONoDataImage.vue';
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: '',
  },
});
const selvalue = ref('');
const value = ref(50);
const cursorValue = ref();
const param = ref({
  user: computed(() => props.sig),
  community: 'openeuler',
  contributeType: 'pr',
  // pageSize: computed(() => value.value),
  timeRange: 'lastonemonth',
} as IObject);
const selParam = () => {
  if (selvalue.value !== 'all' && selvalue.value !== '') {
    param.value = {
      user: props.sig,
      sig: computed(() => selvalue.value),
      community: 'openeuler',
      contributeType: typeData.value,
      // pageSize: computed(() => value.value),
      timeRange: timeData.value,
      // lastCursor: cursorValue.value,
    };
  } else {
    param.value = {
      user: props.sig,
      community: 'openeuler',
      contributeType: typeData.value,
      // pageSize: computed(() => value.value),
      timeRange: timeData.value,
      // lastCursor: cursorValue.value,
    };
  }
};
// 组织贡献from
const formOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'pr' },
        { label: t('home.issues'), value: 'issue' },
        { label: t('home.comments'), value: 'comment' },
      ],
    },
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'lastonemonth',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
  switchTime();
  switchType();
  getDetailsData();
};
// 格式化统计周期文字
const timeRangeText = ref('');
const timeData = ref('');
const switchTime = () => {
  switch (param.value.timeRange) {
    case 'lastonemonth':
      timeRangeText.value = t('from.lastonemonth');
      timeData.value = 'lastonemonth';
      break;
    case 'lasthalfyear':
      timeRangeText.value = t('from.lasthalfyear');
      timeData.value = 'lasthalfyear';
      break;
    case 'lastoneyear':
      timeRangeText.value = t('from.lastoneyear');
      timeData.value = 'lastoneyear';
      break;
    default:
      timeRangeText.value = t('from.all');
      timeData.value = 'all';
      break;
  }
};
switchTime();
const typeLable = ref('');
const typeData = ref('');
const switchType = () => {
  switch (param.value.contributeType) {
    case 'pr':
      typeLable.value = t('home.prs');
      typeData.value = 'pr';
      break;
    case 'issue':
      typeLable.value = t('home.issues');
      typeData.value = 'issue';
      break;
    case 'comment':
      typeLable.value = t('home.comments');
      typeData.value = 'comment';
      break;
  }
};
switchType();
// 搜索过滤
const searchInput = ref('');
const filterReallData = () => {
  reallData.value = reallData.value.filter((item) => {
    return contributionSelectBox.value.some((it) => {
      return it.isSelected && item.is_main_feature === it.key;
    });
  });
};
// 搜索结果
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = detailsData.value.filter(
      (item: any) =>
        item.info.toLowerCase().includes(searchInput.value) ||
        item.repo.toLowerCase().includes(searchInput.value) ||
        item.time
          .split('T')
          .slice(0, 1)
          .toString()
          .toLowerCase()
          .includes(searchInput.value)
    );
    reallData.value = newList;
    filterReallData();
  } else {
    getDetailsData();
  }
};
const clearSearchInput = () => {
  getDetailsData();
  searchInput.value = '';
};
watch(
  () => props.sig,
  () => {
    getprlistData();
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
  () => selvalue.value,
  () => {
    selParam();
    getDetailsData();
  }
);
// const options = [
//   {
//     value: '10',
//     label: '10',
//   },
//   {
//     value: '20',
//     label: '20',
//   },
//   {
//     value: '50',
//     label: '50',
//   },
// ];
// const istrue = ref(true);
// const changeTage = () => {
//   istrue.value = !istrue.value;
// };
const selData = ref();
const getprlistData = () => {
  const query = {
    user: props.sig,
    timeRange: 'all',
    community: 'openeuler',
    contributeType: 'pr',
  };
  queryUserSigContribute(query).then((data) => {
    const value = data?.data || [];
    const seldata: any = [];
    value.map((item: any) => {
      seldata.push({
        name: item.sig_name,
      });
    });
    selData.value = seldata.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name)
    );
  });
};
getprlistData();
const detailsData = ref();
const totalCount = ref(0);
const loading = ref(false);
const getDetailsData = () => {
  loading.value = true;
  queryUserContributeDetails(param.value)
    .then((data) => {
      const value = data?.data || [];
      totalCount.value = data?.totalCount || 0;
      detailsData.value = value;
      reallData.value = value;
      cursorValue.value = data?.cursor || '';
      if (param.value.contributeType === 'pr') {
        filterReallData();
      }
      loading.value = false;
    })
    .catch(() => (loading.value = false));
};
getDetailsData();

// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};
// 图表筛选
const contributionSelectBox = ref([
  {
    color: '/src/assets/MainPR.png',
    isSelected: true,
    label: '主要特性PR',
    key: 1,
  },
  {
    color: '/src/assets/CommonPR.png',
    isSelected: true,
    label: '一般特性PR',
    key: 0,
  },
]);

const changeTage = (item: any) => {
  item.isSelected = !item.isSelected;
  querySearch();
};
</script>

<template>
  <div class="contributions-statistical">
    <div class="sel">
      <div class="title">SIG筛选</div>
      <el-select
        v-model="selvalue"
        class="m-2"
        placeholder="Select"
        size="large"
        filterable
      >
        <el-option label="全部" value="all" />
        <el-option
          v-for="item in selData"
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
              <o-icon class="search-icon"
                ><icon-user></icon-user
              ></o-icon> </template
          ></el-input>
        </div>
      </template>
    </mobile-o-form-radio>
  </div>
  <div class="detail">
    <div v-if="param.contributeType === 'pr'" class="prType">
      <div
        v-for="item in contributionSelectBox"
        :key="item.label"
        class="color-box"
        style="cursor: pointer"
        @click="changeTage(item)"
      >
        <img :src="item.color" alt="" />
        <span class="sp" :style="{ color: item.isSelected ? '#002fa7' : '' }">{{
          item.label
        }}</span>
      </div>
    </div>
   <div v-else-if="param.contributeType === 'issue'" class="prType">
      <img src="@/assets/!.png" alt="" /> <span class="sp">Issue</span>
    </div>
    <div v-else class="prType">
      <img src="@/assets/text.png" alt="" /><span class="sp">Comment</span>
    </div>
  </div>
  <div v-if="reallData.length"  v-loading="loading" class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in reallData.slice(
          (currentPage - 1) * 10,
          currentPage * 10
        )"
        :key="'com' + index"
        class="bar-content-item"
      >
        <div class="index">
          {{ item.time.split('T').slice(0, 1).toString() }}
        </div>
        <div class="infos">
          <div class="infos-img">
            <img
              v-if="param.contributeType === 'pr' && item.is_main_feature === 1"
              src="@/assets/MainPR.png"
              alt=""
            />
            <img
              v-if="param.contributeType === 'pr' && item.is_main_feature === 0"
              src="@/assets/CommonPR.png"
              alt=""
            />
            <img
              v-if="param.contributeType === 'issue'"
              src="@/assets/!.png"
              alt=""
            />
            <img
              v-if="param.contributeType === 'comment'"
              src="@/assets/text.png"
              alt=""
            />
          </div>
          <div class="infos-text">
            <span v-if="param.contributeType === 'comment'">评论了</span
            ><span v-else>在</span>
            <a
              class="index"
              :href="`https://gitee.com/${item.repo}`"
              target="_blank"
              >{{ item.repo }}</a
            ><span v-if="param.contributeType === 'pr'">创建了Pull Request</span
            ><span v-else-if="param.contributeType === 'issue'"
              >创建了 任务</span
            ><span v-else> 的 Pull Request</span>
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
      v-show="reallData.length > 10"
      :current-page="currentPage"
      :page-size="10"
      :total="reallData.length"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
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
  height: 100%;
  margin-bottom: 100px;
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
        margin-right: 8px;
        font-size: 12px;
        color: #002fa7;
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
    font-size: 3px;
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
