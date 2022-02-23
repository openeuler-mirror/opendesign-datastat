<script setup>
import HeaderNav from './ONav.vue';

defineProps({
  navItems: {
    type: Array,
    default() {
      return [];
    },
  },
  activeNav: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['nav-click']);

const handleNavClick = (id) => {
  emits('nav-click', id);
};
</script>

<template>
  <div class="header">
    <div class="header-logo">
      <slot name="logo"></slot>
    </div>
    <div class="header-tool">
      <header-nav
        :nav-items="navItems"
        :default-active="activeNav"
        @nav-click="handleNavClick"
      ></header-nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  max-width: 1168px;
  height: 80px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-logo {
    height: 48px;
    overflow: hidden;
  }

  .header-tool {
    height: 100%;
  }
}
</style>
