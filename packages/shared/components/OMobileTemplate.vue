<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, nextTick } from 'vue';
import { useCommonStore } from '../../euler/src/stores/common';
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
// 回到顶部
const useCommon = useCommonStore();
const isScroll2 = ref(false);
const slideRef2 = ref<any>(null);
const backtop2 = () => {
  slideRef2.value.scrollTop = 0;
};
onMounted(() => {
  slideRef2.value?.addEventListener(
    'scroll',
    () => {
      nextTick(() => {
        isScroll2.value = slideRef2.value?.scrollTop > 200 ? true : false;
      });
    },
    true
  );
});
</script>

<template>
  <div
    class="mobile-template"
    :style="{ 'padding-top': paddingTop, 'padding-bottom': paddingBottom }"
  >
    <div ref="slideRef2" class="mobile-main">
      <h3 class="mobile-main-title">
        <span v-if="props.header"> {{ t(props.header) }} </span>
        <slot name="header"></slot>
      </h3>

      <div v-if="isScroll2" class="backtop" @click="backtop2">
        {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
      </div>

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
