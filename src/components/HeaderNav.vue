<template>
  <nav class="header-nav">
    <ul class="nav-list">
      <li
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="[activeItem === item.id ? 'active' : '']"
        @click="handleClick(item.id)"
      >
        {{ item.label }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';

const props = defineProps({
  navItems: {
    type: Array,
    default() {
      return [];
    },
  },
  defaultActive: {
    type: String,
    default: '',
  },
});

const { defaultActive } = toRefs(props);
const activeItem = ref(defaultActive.value);

watch(defaultActive, (val) => {
  if (activeItem.value === val) {
    return;
  }
  activeItem.value = val;
});

const emits = defineEmits(['navClick']);

const handleClick = (id) => {
  activeItem.value = id;
  emits('navClick', id);
};
</script>

<style lang="scss" scoped>
$color: #ffffff;
.header-nav {
  height: 100%;
  .nav-list {
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
        height: 0;
        background: #ffffff;
        border-radius: 1px;
      }

      &.active::after {
        height: 2px;
      }
    }
  }
}
</style>
