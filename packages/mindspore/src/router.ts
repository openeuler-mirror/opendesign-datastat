import { testIsPhone } from 'shared/utils/helper';
import { createRouter, createWebHistory } from 'vue-router';
import { useCommonStore } from './stores/common';

export const routes = [
  { path: '/', redirect: '/zh/overview' },
  // zh
  {
    path: '/zh',
    redirect: '/zh/overview',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'not_found',
    component: () => {
      return import('@/components/NotFound.vue');
    },
  },
  {
    path: '/zh/overview',
    name: 'zh_overview',
    component: () => {
      return import('@/views/overview/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
    meta: { transition: 'slide-down' },
  },
  {
    path: '/zh/mobile',
    name: 'zh_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/about',
    name: 'zh_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  // en
  {
    path: '/en',
    redirect: '/en/overview',
  },
  {
    path: '/en/overview',
    name: 'en_overview',
    component: () => {
      return import('@/views/overview/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile',
    name: 'en_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/about',
    name: 'en_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 首次进入判断移动端
const cancel = router.beforeEach((to) => {
  cancel();
  const isPhone = testIsPhone();
  const useCommon = useCommonStore();
  useCommon.setDevice(!isPhone);
  if (
    to.path.endsWith('/overview') &&
    !to.path.includes('/mobile') &&
    isPhone
  ) {
    const path = useCommon.language === 'zh' ? '/zh/mobile' : '/en/mobile';
    return { path };
  }
});
