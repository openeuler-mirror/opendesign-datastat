<template>
  <header>
    <AppHeader :active-nav="activeNav" :nav-items="navItems" @nav-click="handleNavClick">
      <template #logo>
        <img src="@/assets/openeuler-logo.png" alt="" style="height: 100%" />
      </template>
    </AppHeader>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';

// 导航
const navItems = [
  {
    id: 'overview',
    label: 'OverView',
  },
  {
    id: 'contributors',
    label: 'Contributors',
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
  },
];

const activeNav = ref(null);
const router = useRouter();
const route = useRoute();

const handleNavClick = (item) => {
  activeNav.value = item;
  router.push({ path: `${activeNav.value}` });
};

watch(
  () => {
    return route.path;
  },
  (path) => {
    activeNav.value = path.split('/').slice(-1)[0];
  }
);
</script>

<style lang="scss" scoped>
header {
  background: #060612;
}

main {
  min-height: calc(100vh - 79px);
}
</style>
