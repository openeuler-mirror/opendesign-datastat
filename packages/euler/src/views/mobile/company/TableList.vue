<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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
import ONoDataImage from 'shared/components/ONoDataImage.vue';
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
      (data.data &&
        data.data
          .sort(sortExp('contribute', false))
          .filter((item: any) => item.contribute !== 0)) ||
      [];
    memberMax.value = ceil(memberList.value[0]?.contribute + 1, 0) || 0;
    rankNum.value = 1;
    if (param.value.displayRange === 'all') {
      return (
        (reallData.value = memberList.value),
        (memberData.value = memberList.value)
      );
    }
    memberData.value = memberList.value.slice(
      0,
      Number(param.value.displayRange)
    );
    sumContribute.value = memberData.value.reduce((total, currentValue) => {
      return total + currentValue.contribute;
    }, 0);
    reallData.value = memberData.value;
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
    {
      label: t('from.displayRange'),
      id: 'displayRange',
      active: '10',
      list: [
        { label: 'Top10', value: '10' },
        { label: 'Top20', value: '20' },
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

// 搜索过滤
const searchInput = ref('');
// 搜索结果
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = memberData.value.filter((item: any) =>
      item.sig_name.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
    // filterReallData();
  } else {
    getMemberData();
  }
};
const clearSearchInput = () => {
  getMemberData();
  searchInput.value = '';
};

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
  router.push(`/${useCommon.language}/mobile/sig/${data.sig_name}`);
};
</script>

<template>
  <div class="contributions-statistical">
    <mobile-o-form-radio
      :option="formOption"
      @get-contribute-info="getContributeInfo($event)"
    >
      <template #searchInput>
        <div class="searchInput">
          <el-input
            v-model="searchInput"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            :debounce="300"
            :value-key="language === 'zh' ? 'company_cn' : 'company_en'"
            size="large"
            :class="{ active: useCompany.searchRanking !== 0 }"
            :placeholder="t('enterSIG')"
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
  <div v-if="reallData.length" class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in reallData"
        :key="'com' + index"
        class="bar-content-item"
      >
        <p class="infos">
          <span class="index">{{ item.rank }}</span>
          <span
            class="name"
            :style="{
              cursor: 'pointer',
              color: '#002FA7',
            }"
            @click="goToCompany(item)"
            >{{ item.sig_name }}</span
          >
        </p>

        <el-tooltip
          placement="bottom-start"
          effect="light"
          popper-class="bar-tooltip"
          :show-arrow="false"
        >
          <div class="progress">
            <div
              class="progress-inner"
              :style="{
                width: progressFormat(item.contribute) + '%',
              }"
            >
              <span v-if="progressFormat(item.contribute) >= 80">{{
                formatNumber(item.contribute)
              }}</span>
            </div>
            <span v-if="progressFormat(item.contribute) < 80" class="val">{{
              formatNumber(item.contribute)
            }}</span>
          </div>
        </el-tooltip>
      </li>
    </ul>
  </div>
  <div v-else><o-no-data-image></o-no-data-image></div>
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
  .bar-columns {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 324px;
    display: flex;
    justify-content: space-between;
    right: 0;
    .num {
      color: #9097a3;
      font-size: 12px;
      position: relative;
      display: flex;
      align-items: end;
      min-width: 8px;
      &::after {
        position: absolute;
        top: 0;
        left: 48%;
        width: 1px;
        border-left: 1px dashed #ccc;
        bottom: 20px;
        content: '';
      }
      &:last-child {
        &::after {
          left: inherit;
          right: 0;
        }
      }
    }
  }
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    // display: flex;
    // justify-content: space-between;
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
      .name {
        width: 304px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
.progress {
  height: 24px;
  display: flex;
  width: 100%;
  align-items: center;
  &-inner {
    background: #002fa7;
    box-shadow: 4px 8px 12px 0px rgba(0, 92, 219, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 0px;
    transition: all 0.3s ease-in-out;
    span {
      padding-right: 8px;
    }
  }
  .val {
    color: #000;
    font-size: 12px;
    margin-left: 8px;
  }
}
.bar-tooltip {
  padding: 12px 16px;
  box-shadow: 4px 8px 16px 0px rgba(10, 11, 13, 0.05),
    0px 0px 32px 0px rgba(10, 11, 13, 0.1);

  .lable {
    color: #9097a3;
    font-weight: bold;
    .text {
      font-weight: 100;
    }
  }
  .info {
    color: #4e5865;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    min-width: 280px;
    .index {
      color: #9097a3;
    }
    .num {
      font-size: 16px;
      color: #000000;
      margin-right: 20px;
      .percentage {
        margin-left: 10px;
        font-size: 12px;
        color: #4e5865;
      }
    }
  }
}
</style>
