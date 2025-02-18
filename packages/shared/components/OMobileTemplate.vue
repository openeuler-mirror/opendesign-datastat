<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  header: {
    type: String,
    default: '',
  },
  paddingTop: {
    type: String,
    default: '48px',
  },
  paddingBottom: {
    type: String,
    default: '62px',
  },
});

</script>

<template>
  <div
    class="mobile-template"
    :style="{ 'padding-top': paddingTop, 'padding-bottom': paddingBottom }"
  >
    <div class="mobile-main">
      <h3 class="mobile-main-title">
        <span v-if="props.header"> {{ t(props.header) }} </span>
        <slot name="header"></slot>
      </h3>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mobile-template {
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  box-sizing: border-box;
}
.mobile-main {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  background-color: #fff;
  height: 100%;
  overflow: hidden auto;
  scroll-behavior: smooth;
  &-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: 600;
  }
}

</style>
