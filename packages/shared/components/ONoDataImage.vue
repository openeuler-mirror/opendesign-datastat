<template>
  <div class="no-data" :style="{ height }">
    <img :src="img || defaultImge" alt="" :style="{ width }"/>
    <div class="title">
      {{ t(title) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import defaultImge from '../assets/image/nodata.png';
const { t } = useI18n();
const props = defineProps({
  title: {
    type: String,
    default: 'noData',
  },
  height: {
    type: String,
    default: '300px',
  },
  img: {
    type: String,
    default: '',
  },
  width:{
    type: String,
    default: '380px',
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
    // margin-top: 8px;
  }
}
</style>
