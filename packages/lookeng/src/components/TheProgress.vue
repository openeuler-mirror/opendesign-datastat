<script setup lang="ts">
import { ref } from 'vue';
import { usePersonalStore } from '@/stores/personal';
const props = defineProps({
  item: {
    type: Number,
    default() {
      return 0;
    },
  },
});

const usePersonal = usePersonalStore();
const progressColor = ref('#00685A');
const progressFormat = (item: number) => {
  return (100 / usePersonal.personalMaxNum) * item;
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
