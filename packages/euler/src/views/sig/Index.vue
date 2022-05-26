<script setup lang="ts">
import OAnchor from 'shared/components/OAnchor.vue';
</script>
<template>
  <div class="container">
    <o-anchor top="11rem"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one">社区贡献</span>
        <span> > sig-DDE</span>
      </div>
      <div class="main">
        <div class="main-left">123</div>
        <div class="main-right">123w</div>
      </div>
    </div>
  </div>
  <footer>
    <app-footer></app-footer>
  </footer>
</template>
<style lang="scss" scoped>
.container {
  margin-top: 80px;
  min-height: 900px;
  background-color: #f5f6f8;
}
.step {
  padding: 40px 0;
  font-size: 12px;
  &-one {
    color: #002FA7;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
  &-right {
    background-color: #FFFFFF;
  }
}
</style>
