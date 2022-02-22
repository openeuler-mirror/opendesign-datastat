<template>
  <div class="banner">
    <div class="banner-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  background: #060612;
  .banner-wrap {
    max-width: 1168px;
    padding: 0 24px;
    margin: 0 auto;
  }
}
</style>
