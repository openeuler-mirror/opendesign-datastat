<script setup lang="ts">
import { IObject } from 'shared/@types/interface';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import { useCompanyStore } from '@/stores/company';

const useCompany = useCompanyStore();
const { t } = useI18n();
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
const param = ref<IObject>({
  contributeType: 'pr',
  timeRange: 'lastonemonth',
  displayRange: '10',
});
const tipSuffix = computed(() => {
  const data = formOption.value['0'];
  const findone = data.list.find((item) => item.value === param.value[data.id]);
  return findone?.label;
});
const tipPrefix = computed(() => {
  const data = formOption.value['1'];
  const findone = data.list.find((item) => item.value === param.value[data.id]);
  return findone?.label;
});
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
};
// 搜索过滤
const searchInput = ref('');
const clearSearchInput = () => {
  searchInput.value = '';
};
const querySearch = () => {
  searchInput.value = '';
};
</script>
<template>
  <div>
    <div class="contributors-panel">
      <h3 id="SoftwareContribute" class="title">
        {{ t('groupActive') }}
      </h3>
      <o-form-radio
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
              :placeholder="t('from.pleasePartner')"
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
      </o-form-radio>
      <TheBarTemplate
        :data="useCompany"
        :tip-prefix="tipPrefix"
        :tip-suffix="tipSuffix"
      ></TheBarTemplate>
    </div>
  </div>
</template>
<style scoped lang="scss">
.contributors-panel {
  padding: 24px;
  background: #fff;
  margin-top: 60px;
  .title {
    font-size: 24px;
    color: #000;
    font-weight: normal;
    margin-bottom: 20px;
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
</style>
