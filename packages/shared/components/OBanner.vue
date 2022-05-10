<script setup lang="ts"></script>

<template>
  <div class="o-banner">
    <div class="o-banner-wrap">
      <slot></slot>
    </div>
    <div class="o-banner-video">
      <div class="video-layer"></div>
      <slot name="video"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-banner {
  width: 100%;
  background: #000;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  .o-banner-wrap {
    max-width: 1416px;
    padding: 0 24px;
    margin: 0 auto;
    position: relative;
    z-index: 9;
    // text-align: center;
  }
  .o-banner-video,
  .video-layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .video-layer {
    z-index: 2;
  }
}
</style>
