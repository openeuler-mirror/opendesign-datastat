<template>
  <div class="no-data" :style="{ height }">
    <img :src="img || defaultImge" alt="" :style="{ width }"/>
    <div class="title">
      {{ title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import defaultImge from '../assets/image/nodata.png';
const props = defineProps({
  title: {
    type: String,
    default: '暂无数据',
  },
  height: {
    type: String,
    default: '576px',
  },
  img: {
    type: String,
    default: '',
  },
  width:{
    type: String,
    default: '480px',
  }
});
const { title, height, img, width } = toRefs(props);
</script>
<style scoped lang="scss">
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #555555;
  justify-content: center;
  .title {
    margin-top: 16px;
  }
}
</style>
