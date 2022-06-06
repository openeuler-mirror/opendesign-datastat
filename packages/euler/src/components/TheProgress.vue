<script setup lang="ts">
import { ref } from 'vue';
import { usePersonalStore } from '@/stores/personal';
import { useStaffStore } from '@/stores/staff';
import { toRefs } from 'vue';
const props = defineProps({
  item: {
    type: Number,
    default() {
      return 0;
    },
  },
  componentName: {
    type: String,
    default() {
      return 'personal';
    },
  },
});
const { componentName } = toRefs(props);
const usePersonal = usePersonalStore();
const useStaff = useStaffStore();
const progressColor = ref('#002FA7');
// 动态计算参数赋值
const progressFormat = (item: number) => {
  if (componentName.value === 'staff') {
    return (100 / useStaff.staffMaxNum) * item;
  } else {
    return (100 / usePersonal.personalMaxNum) * item;
  }
};
</script>

<template>
  <el-progress
    :show-text="false"
    :stroke-width="8"
    :color="progressColor"
    :percentage="progressFormat(props.item)"
  />
</template>

<style lang="scss" scoped>
.el-progress {
  width: 240px;
  margin-left: 10px;
  :deep(.el-progress-bar__outer) {
    background: none;
  }
}
</style>
