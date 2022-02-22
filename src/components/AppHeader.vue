<template>
  <div class="header">
    <div class="header-logo">
      <slot name="logo"></slot>
    </div>
    <div class="header-tool">
      <HeaderNav :nav-items="navItems" :default-active="activeNav" @nav-click="handleNavClick"></HeaderNav>
    </div>
  </div>
</template>

<script setup>
import HeaderNav from './HeaderNav.vue';

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

const emits = defineEmits(['navClick']);

const handleNavClick = (id) => {
  emits('navClick', id);
};
</script>

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
