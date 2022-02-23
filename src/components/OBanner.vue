<script setup></script>

<template>
  <div class="o-banner">
    <div class="o-banner-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-banner {
  width: 100%;
  background: #060612;
  .o-banner-wrap {
    max-width: 1168px;
    padding: 0 24px;
    margin: 0 auto;
  }
}
</style>
