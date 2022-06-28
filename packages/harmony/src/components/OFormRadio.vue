<script lang="ts" setup>
import { toRefs, ref } from 'vue';
import { IObject } from 'shared/@types/interface';
const props = defineProps({
  option: {
    type: Array as () => IObject[],
    default: () => [] as IObject[],
  },
});
const { option } = toRefs(props);

const changeRadio = (item: IObject, list: IObject) => {
  item.active = list.value;
  emits('get-contribute-info', item);
};
const emits = defineEmits(['get-contribute-info']);

// 动态计算参数赋值
let form = ref(
  option.value.reduce((pre: any, next: any) => {
    pre[next.id] = next.active;
    return pre;
  }, {})
);
</script>

<template>
  <div v-for="(item, index) in option" :key="item.id">
    <div v-if="index" class="line"></div>
    <div class="group">
      <p class="label">{{ item.label }}</p>
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
    </div>
  </div>
  <div class="searchInput">
    <slot name="searchInput"></slot>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.line {
  border-bottom: 1px solid #dfe1e8;
  margin-bottom: 18px;
}
.group {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  .label {
    width: 122px;
  }
}
.searchInput {
  margin-left: 122px;
}
</style>
