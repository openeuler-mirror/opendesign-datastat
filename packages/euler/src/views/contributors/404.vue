<template>
  <div class="_404">
    <div class="imgs">
      <div class="png"></div>
      <div class="title">
        <h2>404 Not Found</h2>
      </div>
    </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  text-align: center;
  margin-top: 10px;
}
.png {
  background-image: url("@/assets/404.png");
  background-repeat: no-repeat;
  background-size: 300px 300px;
  width: 300px;
  height: 300px;
}
</style>
