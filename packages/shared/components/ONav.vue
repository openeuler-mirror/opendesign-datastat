<script lang="ts" setup>
import { watch, ref, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NavItem } from '../@types/interface';
const router = useRouter();
const route = useRoute();
const props = defineProps({
  navItems: {
    type: Object,
    default() {
      return [];
    },
  },
  lang: {
    type: String,
    default() {
      return 'zh';
    },
  },
});
const { navItems, lang } = toRefs(props);
const activeItem = ref('');
const emits = defineEmits(['navClick']);
const navClick = (item: NavItem) => {
  const nHref = lang.value === 'zh' ? item.zh : item.en;
  emits('navClick', item.id);
  router.push({ name: nHref });
};
watch(
  () => {
    return route.path;
  },
  (path) => {
    const p = path.split('/').slice(-1).toString();
    activeItem.value = p;
  }
);
</script>

<template>
  <div class="nav-list">
    <div
      v-for="item in navItems"
      :key="item.id"
      :class="[activeItem === item.id ? 'active' : '']"
      class="nav-item"
      @click="navClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<style lang="scss">
$color: #ffffff;
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
      color: $color !important;
    }

    &:hover {
      color: $color;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 2px;
      background: transparent;
      border-radius: 1px;
      transition: background 0.3s;
    }

    &.active::after {
      background: #ffffff;
    }
  }
}
</style>
