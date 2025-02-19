<script setup lang="ts"></script>

<template>
  <div class="content-wrapper"><slot></slot></div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  max-width: var(--layout-content-max-width);
  padding-left: var(--layout-content-padding);
  padding-right: var(--layout-content-padding);
  margin: 0 auto;
}
</style>
