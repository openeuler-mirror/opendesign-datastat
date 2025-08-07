<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formType } from 'shared/@types/interface';
import { IObject } from 'shared/@types/interface';
import { useCompanyStore } from '@/stores/company';
import { useCommonStore } from '@/stores/common';
import TheForm from '@/components/TheForm.vue';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import { testIsPhone } from 'shared/utils/helper';
import { queryVersions } from 'shared/api/api-new';
const { t } = useI18n();
const useCompany = useCompanyStore();
const useCommon = useCommonStore();
const language = computed(() => useCommon.language);

// 组织贡献from
const componentName = 'company';
// 动态获取统计周期
const statisticalNum = ref<any>([]);
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
      active: 'mother',
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
      list: [
        { label: 'Top10', value: '10' },
        { label: 'Top20', value: '20' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
const formOptionSwitch = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'pr' },
        { label: t('home.issues'), value: 'issue' },
        { label: t('home.comments'), value: 'comment' },
        // { label: t('from.LOC'), value: 'cloc' },
      ],
    },
    {
      label: t('from.timeRange'),
      id: 'version',
      list: statisticalNum.value,
    },
    {
      label: t('from.displayRange'),
      id: 'displayRange',
      list: [
        { label: 'Top10', value: '10' },
        { label: 'Top20', value: '20' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});

const isSearch = ref(false);
// 搜索过滤
const searchInput = ref('');
const querySearch = (queryString: string, cb: any) => {
  let queryList = useCompany.rawData;
  const results = queryString
    ? queryList.filter(createFilter(queryString))
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
    const items = language.value === 'zh' ? list.company_zh : list.company_en;
    return items.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
  };
};
// 搜索结果
const handleSelect = (item: any) => {
  useCompany.companyForm.displayRange = '1';
  useCompany.ranking = 1;

  useCompany.rawData.forEach((element: IObject, index: number) => {
    if (element.company_zh === item.company_zh) {
      useCompany.searchRanking = +index + 1;
    }
  });

  useCompany.companyData = [item];
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
  useCompany.ranking = 10;
  useCompany.searchRanking = 0;
  useCompany.companyForm.displayRange = '10';
  useCompany.getCompanyData();
  searchInput.value = '';
};

const emits = defineEmits(['searchState']);

// 如果是选择条件是显示范围则前端处理数据
// 否则请求接口
const getContributeInfo = (item: IObject) => {
  if (item.id === 'displayRange') {
    if (useCompany.companyForm.displayRange === 'all') {
      useCompany.ranking = useCompany.totalLength;
    } else {
      useCompany.ranking =
        useCompany.companyForm.displayRange === '10' ? 10 : 20;
    }
  }
  if (useCompany.searchRanking !== 0) {
    clearSearchInput();
  } else {
    useCompany.getCompanyData();
  }
};

// onMounted(() => {
//   getStatistical();
// });
const isMobile: boolean = testIsPhone();
const formOptionAll = ref<any>([]);
const getConfig = (val: any) => {
  const param = {
    community: 'openeuler',
  };
  if (val) {
    queryVersions(param).then((data) => {
      const res = data.data;
      res.forEach((item: any) => {
        statisticalNum.value.push({
          label: item,
          value: item,
        });
      });
      // eslint-disable-next-line prefer-destructuring
      useCompany.defaultNum = res[0];
      statisticalNum.value.push({
        label: computed(() => t('from.all')),
        value: 'all',
      });
      formOptionAll.value.value = formOptionSwitch;
      useCompany.companyForm.contributeType = 'pr';
      useCompany.companyForm.version = useCompany.defaultNum;
      useCompany.companyForm.timeRange = '';
      useCompany.companyForm.displayRange = '10';
      useCompany.getCompanyData();
    });
  } else {
    statisticalNum.value = [];
    formOptionAll.value.value = formOption;
    useCompany.companyForm.contributeType = 'pr';
    useCompany.companyForm.timeRange = 'lastonemonth';
    useCompany.companyForm.version = '';
    useCompany.companyForm.displayRange = '10';
    useCompany.getCompanyData();
  }
};

watch(
  () => useCompany.switchValue,
  () => getConfig(useCompany.switchValue),
  { immediate: true }
);
</script>

<template>
  <div class="contributions-statistical">
    <div class="switch">
      <span class="switchTitile">{{ t('from.version') }}</span
      ><el-switch v-model="useCompany.switchValue" />
    </div>

    <the-form
      :option="formOptionAll.value"
      :component-name="componentName"
      @get-contribute-info="getContributeInfo"
    >
      <template #searchInput>
        <div class="searchInput" :class="{ inputHeight: isMobile }">
          <el-autocomplete
            v-model="searchInput"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            :debounce="300"
            :value-key="language === 'zh' ? 'company_zh' : 'company_en'"
            size="large"
            :class="{ active: useCompany.searchRanking !== 0 }"
            :placeholder="t('from.pleasePartner')"
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
    </the-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.searchInput {
  padding-left: 86px;
  width: 100%;
  margin: -16px 0 16px;
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
.inputHeight {
  :deep(.el-input__inner) {
    height: 2rem;
  }
}
.switch {
  padding-bottom: 12px;
  border-bottom: 1px solid #dfe1e8;
  margin-bottom: 12px;
  .switchTitile {
    padding-right: 24px;
    line-height: 28px;
    font-size: 14px;
  }
}
</style>
