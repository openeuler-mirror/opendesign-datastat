<script setup lang="ts">
import notFoundImg_dark from '@/assets/404.png';

defineProps({
  noDataTip: {
    type: String,
    default: '404 Not Found',
  },
});
</script>

<template>
  <div class="nofound">
    <img class="nofound-img" :src="notFoundImg_dark" alt="404" />
    <p class="nofound-text">{{ noDataTip }}</p>
  </div>
</template>

<style lang="scss" scoped>
.nofound {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  min-height: calc(100vh - 329px);
  .nofound-text {
    margin-top: 16px;
    font-size: 18px;
  }
  .nofound-img {
    height: 300px;
  }
  @media screen and (max-width: 768px) {
    .nofound-img {
      max-height: 232px;
    }
    .nofound-text {
      margin-top: 12px;
      font-size: 12px;
    }
  }
}
</style>
