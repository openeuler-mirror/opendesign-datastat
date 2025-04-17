<script setup lang="ts">
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
  memberList: {
    type: Number,
    default() {
      return 0;
    },
  },
  usertype: {
    type: String,
    default() {
      return '';
    },
  },
  width: {
    type: String,
    default: '240px',
  },
});
const { componentName, memberList, usertype } = toRefs(props);
const usePersonal = usePersonalStore();
const useStaff = useStaffStore();
const progressColor = () => {
  if (componentName.value === 'member' && usertype.value === 'contributor') {
    return '#4AAEAD';
  }
  if (componentName.value === 'member' && usertype.value === 'maintainers') {
    return '#7D32EA';
  }
  if (componentName.value === 'member' && usertype.value === 'committers') {
    return '#FEB32A';
  }
  return '#7D32EA';
};

// 动态计算参数赋值
const progressFormat = (item: number) => {
  if (componentName.value === 'staff') {
    return Math.floor(useStaff.staffMaxNum ? (100 / useStaff.staffMaxNum) * item : 0);
  }
  if (componentName.value === 'member') {
    return Math.floor(memberList.value ? (100 / memberList.value) * item : 0);
  }
  return Math.floor(usePersonal.personalMaxNum ? (100 / usePersonal.personalMaxNum) * item : 0);
};
</script>

<template>
  <el-progress :style="{ width }" :show-text="false" :stroke-width="8" :color="progressColor()" :percentage="progressFormat(props.item)" />
</template>

<style lang="scss" scoped>
.el-progress {
  margin-left: 10px;
  :deep(.el-progress-bar__outer) {
    background: none;
  }
}
</style>
