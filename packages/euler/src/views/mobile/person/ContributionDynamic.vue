<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formType } from 'shared/@types/interface';
import { IObject } from 'shared/@types/interface';
import { useCompanyStore } from '@/stores/company';
import { useCommonStore } from '@/stores/common';
import { openCommunityInfo } from '@/api/index';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import MobileOFormRadio from '../sig/MobileOFormRadio.vue';
import { queryCompanySigContribute } from 'shared/api/index';
import { sortExp, formatNumber } from 'shared/utils/helper';
import { ceil } from 'lodash-es';
import { useRouter } from 'vue-router';
const router = useRouter();
const { t } = useI18n();
const useCompany = useCompanyStore();
const useCommon = useCommonStore();
const language = computed(() => useCommon.language);
const props = defineProps({
  company: {
    type: String,
    required: true,
    default: '',
  },
});
const param = ref({
  contributeType: 'pr',
  timeRange: 'lastonemonth',
  community: openCommunityInfo.name,
  company: computed(() => props.company),
  displayRange: '10',
} as IObject);
const memberData = ref([] as IObject[]);
const memberMax = ref(0);
const memberList = ref([] as IObject[]);
const rankNum = ref(1);
const sumContribute = ref(0);

const getMemberData = () => {
  queryCompanySigContribute(param.value).then((data) => {
    memberList.value =
      (data.data && data.data.sort(sortExp('contribute', false))) || [];
    memberMax.value = ceil(memberList.value[0].contribute, -2) || 0;
    // memberList.value.forEach((item) => {
    //   if (
    //     item.company_cn !== '个人贡献者' ||
    //     item.company_en !== 'independent'
    //   ) {
    //     item.index = rankNum.value++;
    //   } else {
    //     item.index = '*';
    //   }
    // });
    rankNum.value = 1;
    if (param.value.displayRange === 'all') {
      return (memberData.value = memberList.value);
    }
    memberData.value = memberList.value.slice(
      0,
      Number(param.value.displayRange)
    );
    sumContribute.value = memberData.value.reduce((total, currentValue) => {
      return total + currentValue.contribute;
    }, 0);
  });
};
// 个人信息
const progressFormat = (item: number) => {
  return (memberMax.value !== 0 ? 100 / memberMax.value : 0) * item;
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
  getMemberData();
  switchTime();
  switchType();
};
// 格式化统计周期文字
const timeRangeText = ref('');
const switchTime = () => {
  switch (param.value.timeRange) {
    case 'lastonemonth':
      timeRangeText.value = t('from.lastonemonth');
      break;
    case 'lasthalfyear':
      timeRangeText.value = t('from.lasthalfyear');
      break;
    case 'lastoneyear':
      timeRangeText.value = t('from.lastoneyear');
      break;
    default:
      timeRangeText.value = t('from.all');
      break;
  }
};
switchTime();
const typeLable = ref('');
const switchType = () => {
  switch (param.value.contributeType) {
    case 'pr':
      typeLable.value = t('home.prs');
      break;
    case 'issue':
      typeLable.value = t('home.issues');
      break;
    case 'comment':
      typeLable.value = t('home.comments');
      break;
  }
};
switchType();

const isSearch = ref(false);
// 搜索过滤
const searchInput = ref('');
const querySearch = (queryString: string, cb: any) => {
  let queryList = memberList.value;
  const results = queryString
    ? queryList.filter(createFilter(queryString) as any)
    : queryList;

  if (results.length > 0) {
    isSearch.value = false;
  } else {
    isSearch.value = true;
  }
  cb(results);
};
const createFilter = (queryString: string) => {
  return (list: formType) => {
    const items = language.value === 'zh' ? list.company_cn : list.company_en;
    return items.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
  };
};
// 搜索结果
const handleSelect = (item: IObject) => {
  param.value.displayRange = '1';
  memberList.value.forEach((element: IObject) => {
    if (element.company_cn === item.company_cn) {
      memberData.value = [item];
    }
  });
};

// 回车判断结果
const myKeydown = () => {
  if (isSearch.value) {
    emits('searchState', isSearch.value);
  }
};

// 清除搜索
const clearSearchInput = () => {
  isSearch.value = false;
  emits('searchState', isSearch.value);
  param.value.displayRange = '10';
  getMemberData();
  searchInput.value = '';
};

const emits = defineEmits(['searchState']);

// 如果是选择条件是显示范围则前端处理数据
// 否则请求接口
watch(
  () => props.company,
  () => {
    getMemberData();
  }
);

// 跳转社区详情
const goToCompany = (data: IObject) => {
  const routeData: any = router.resolve(
    `/${useCommon.language}/company/${data.company_cn}`
  );
  window.open(routeData.href, '_blank');
};
const options = [
  {
    value: '10',
    label: '10',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '50',
    label: '50',
  },
];

const value = ref('');
const istrue = ref(true);
const changeTage = () => {
  istrue.value = !istrue.value;
};
</script>

<template>
  <div class="contributions-statistical">
    <div class="sel">
      <div class="title">SIG筛选</div>
      <el-select v-model="value" class="m-2" placeholder="Select" size="large">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
          <el-autocomplete
            v-model="searchInput"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            :debounce="300"
            :value-key="language === 'zh' ? 'company_cn' : 'company_en'"
            size="large"
            :class="{ active: useCompany.searchRanking !== 0 }"
            :placeholder="t('enterWord')"
            @select="handleSelect"
            @keydown.enter="myKeydown"
            @clear="clearSearchInput"
          >
            <template #prefix>
              <o-icon class="search-icon"
                ><icon-user></icon-user
              ></o-icon> </template
          ></el-autocomplete>
        </div>
      </template>
    </mobile-o-form-radio>
  </div>
  <div class="detail">
    <span
      :style="{
        cursor: 'pointer',
      }"
      @click="changeTage()"
      ><img v-if="istrue" src="@/assets/MainPR.png" alt="" />
      <img v-else src="@/assets/CommonPR.png" alt=""
    /></span>
    <span
      class="sp"
      :style="{
        cursor: 'pointer',
      }"
      @click="changeTage()"
      >主要PR</span
    >
    <span
      :style="{
        cursor: 'pointer',
      }"
      @click="changeTage()"
    >
      <img v-if="istrue" src="@/assets/CommonPR.png" alt="" /><img
        v-else
        src="@/assets/MainPR.png"
        alt="" /></span
    ><span
      class="sp"
      :style="{
        cursor: 'pointer',
      }"
      @click="changeTage()"
      >一般PR</span
    >

    <div class="page">
      <span class="sp">共<span class="num">100</span>条</span>
      <span
        >每页<span class="num">
          <el-select v-model="value" class="m-2" placeholder="10" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select></span
        >条</span
      >
    </div>
  </div>
  <div class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in memberData"
        :key="'com' + index"
        class="bar-content-item"
      >
        <div class="index">{{ item.index }}</div>
        <p class="infos">
          在<span class="index">{{ item.index }}</span
          >创建了Pull Request
          <span class="index">{{ item.index }}</span>
        </p>
      </li>
    </ul>
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
  padding-bottom: 12px;
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    .infos {
      font-size: 16px;
      color: #000000;
      line-height: 22px;

      display: flex;
      .index {
        width: 16px;
        margin-right: 8px;
        font-size: 16px;
        color: #9097a3;
        text-align: center;
      }
    }
  }
}
.detail {
  display: flex;
  align-items: center;
  position: relative;
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
  .page {
    position: absolute;
    right: 0;
    font-size: 3px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    .num {
      font-size: 3px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
      padding-left: 5px;
      padding-right: 5px;
    }
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
