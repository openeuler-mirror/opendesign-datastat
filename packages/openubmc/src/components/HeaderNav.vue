<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const props = defineProps<{
  navs: { name: string; label: string; }[];
}>();

const emits = defineEmits(['navClick']);
const navClick = (item: (typeof props.navs)[number]) => {
  emits('navClick', item.name);
  router.push({ name: item.name });
};
</script>

<template>
  <div class="nav-list">
    <div v-for="item in navs" :key="item.name" :class="[route.name === item.name ? 'active' : '']" class="nav-item" @click="navClick(item)">
      {{ item.label }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.nav-list {
  display: flex;
  width: 100%;
  padding: 0 48px;
  height: 100%;
  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    margin: 0 24px;
    font-size: 16px;
    line-height: 24px;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #979797;
    cursor: pointer;

    &.active {
      color: var(--o-color-primary1) !important;
    }

    &:hover {
      color: var(--o-color-primary1);
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 2px;
      background-color: transparent;
      border-radius: 1px;
      transition: background-color 0.3s;
    }

    &.active::after {
      background-color: var(--o-color-primary1);
    }
  }
}
</style>
