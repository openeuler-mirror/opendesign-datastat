import { createRouter, createWebHistory } from 'vue-router';
import { useCommonStore } from './stores/common';

export const routes = [
  { path: '/', redirect: '/zh/overview' },

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
    path: '/zh/detail',
    name: 'zh_detail',
    component: () => {
      return import('@/views/contributors/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
    meta: { transition: 'slide-up' },
  },
  {
    path: '/zh/company/:name',
    name: 'zh_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/company',
    name: 'zh_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/sig/:name',
    name: 'zh_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/sig',
    name: 'zh_all_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
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
    path: '/zh/mobile/company/:name',
    name: 'zh_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/mobile/company',
    name: 'zh_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/mobile/sig/:name',
    name: 'zh_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/mobile/sig',
    name: 'zh_mobile_all_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/mobile/about',
    name: 'zh_mobile_about',
    component: () => {
      return import('@/views/about/Index.vue');
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
    meta: { transition: 'slide-down' },
  },
  {
    path: '/en/detail',
    name: 'en_detail',
    component: () => {
      return import('@/views/contributors/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
    meta: { transition: 'slide-down' },
  },
  {
    path: '/en/company/:name',
    name: 'en_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/company',
    name: 'en_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/sig/:name',
    name: 'en_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/sig',
    name: 'en_all_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
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
    path: '/en/mobile/company/:name',
    name: 'en_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile/company',
    name: 'en_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile/sig/:name',
    name: 'en_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile/sig',
    name: 'en_mobile_all_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
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
  {
    path: '/en/mobile/about',
    name: 'en_mobile_about',
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

// 设置语言
router.beforeEach((to) => {
  const commonStore = useCommonStore();
  if (!to.fullPath.includes('en')) {
    commonStore.lang = 'zh';
  } else {
    commonStore.lang = 'en';
  }
});
