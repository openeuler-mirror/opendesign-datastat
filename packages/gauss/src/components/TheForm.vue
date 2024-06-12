<script lang="ts" setup>
import { toRefs, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCompanyStore } from '@/stores/company';
import { usePersonalStore } from '@/stores/personal';
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import useScroll from 'shared/hooks/useScroll';

const useCompany = useCompanyStore();
const usePersonal = usePersonalStore();
const useCommon = useCommonStore();
const { t } = useI18n();
const props = defineProps({
  option: {
    type: Object,
    default() {
      return null;
    },
  },
  componentName: {
    type: String,
    default() {
      return 'company';
    },
  },
});
const { option, componentName } = toRefs(props);

const changeRadio = (item: IObject, list: IObject) => {
  item.active = list.value;
  emits('get-contribute-info', item);
};
const emits = defineEmits(['get-contribute-info']);

// 动态计算参数赋值
let form = computed(() => {
  return componentName.value === 'company'
    ? useCompany.companyForm
    : usePersonal.personalForm;
});

// 下拉框事件
const repoSelectChange = (val: string) => {
  form.value.repo = val;
  if (componentName.value === 'company') {
    useCompany.getCompanyData();
  } else {
    usePersonal.getPersonalData();
  }
};
const { isGaussScrollUp } = useScroll('up');
const repoSelectState = (flag: boolean) => {
  useCommon.selectScroll = flag;
  if (flag) {
    isGaussScrollUp.value = false;
  }
};
</script>

<template>
  <el-form
    ref="formRef"
    class="theForm"
    label-position="left"
    :model="form"
    label-width="110px"
  >
    <el-form-item :label="t('from.repo')">
      <el-select
        v-model="form.repo"
        filterable
        @focus="repoSelectState(false)"
        @blur="repoSelectState(true)"
        @change="repoSelectChange"
      >
        <el-option :label="t('from.all')" value=""></el-option>
        <el-option :label="t('from.repository')" value="coreRepo"></el-option>
        <el-option
          v-for="item in useCommon.reposData"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-for="item in option" :key="item.id" :label="item.label">
      <el-radio-group v-model="form[item.id]">
        <el-radio
          v-for="list in item.list"
          :key="list.id"
          border
          :label="list.value"
          @change="changeRadio(item, list)"
          >{{ list.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
  </el-form>
  <slot name="searchInput"></slot>
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';

.el-select {
  width: 300px;
  :deep(.el-input.is-focus .el-input__inner) {
    box-shadow: 0 0 0 1px #7d32ea inset !important;
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #7d32ea inset !important;
  }
}
.el-select-dropdown__item.selected {
  color: #7d32ea;
}

@media screen and (max-width: 900px) {
  .el-select {
    margin-bottom: 12px;
    width: 100%;
  }
}
</style>
