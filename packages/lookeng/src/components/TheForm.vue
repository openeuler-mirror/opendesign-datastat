<script lang="ts" setup>
import { toRefs, computed } from 'vue';
import { useCompanyStore } from '@/stores/company';
import { usePersonalStore } from '@/stores/personal';
import { IObject } from 'shared/@types/interface';
const useCompany = useCompanyStore();
const usePersonal = usePersonalStore();
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
</script>

<template>
  <el-form
    ref="formRef"
    class="theForm"
    label-position="left"
    :model="form"
    label-width="110px"
  >
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
</style>
