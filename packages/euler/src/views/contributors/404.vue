<template>
  <div class="_404">
    <img src="@/assets/404.png" />
  </div>
  <AppFooter />
</template>
<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
</script>
<style scoped lang="scss">
._404 {
  width: 100%;
  height: 80vh;
  margin: 5rem auto 0 auto;
  background: white;
  position: relative;
}

._404 img {
  width: 20rem;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
