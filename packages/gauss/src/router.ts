import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  { path: '/', redirect: '/zh/overview' },
  // zh
  {
    path: '/zh',
    redirect: '/zh/overview',
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
    path: '/zh/user/:name',
    name: 'zh_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/user',
    name: 'zh_all_user',
    component: () => {
      return import('@/views/person/index.vue');
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
    path: '/zh/mobile/user/:name',
    name: 'zh_mobile_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  },
  {
    path: '/zh/mobile/user',
    name: 'zh_mobile_all_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'zh');
    },
  }, {
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
    meta: { transition: 'slide-up' },
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
    path: '/en/user/:name',
    name: 'en_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/user',
    name: 'en_all_user',
    component: () => {
      return import('@/views/person/index.vue');
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
    path: '/en/mobile/about',
    name: 'en_mobile_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile/user/:name',
    name: 'en_mobile_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
    beforeEnter: () => {
      localStorage.setItem('lang', 'en');
    },
  },
  {
    path: '/en/mobile/user',
    name: 'en_mobile_all_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
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
