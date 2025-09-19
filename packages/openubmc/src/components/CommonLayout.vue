<script setup lang="ts">
import AppFooter from './AppFooter.vue';

</script>

<template>
  <div class="common-layout">
    <div class="wrap">
      <slot></slot>
    </div>
    <AppFooter class="ly-footer" />
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  padding-top: 32px;
  min-width: 1024px;
  padding-bottom: 72px;
  min-height: var(--layout-content-height);
}

.common-layout {
  padding-top: var(--header-height);
  background-color: rgb(243, 243, 245);
  min-width: fit-content;
  min-height: 100vh;
}
</style>