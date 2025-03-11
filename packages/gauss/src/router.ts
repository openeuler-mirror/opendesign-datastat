import { createRouter, createWebHistory } from 'vue-router';
import { useCommonStore } from './stores/common';
import { testIsPhone } from 'shared/utils/helper';

export const routes = [
  { path: '/', redirect: '/zh/overview' },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/zh/overview',
    name: 'zh_overview',
    component: () => {
      return import('@/views/overview/Index.vue');
    },
    meta: { transition: 'slide-down' },
  },
  {
    path: '/zh/detail',
    name: 'zh_detail',
    component: () => {
      return import('@/views/contributors/Index.vue');
    },
    meta: { transition: 'slide-up' },
  },

  {
    path: '/zh/sig/:name',
    name: 'zh_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
  },
  {
    path: '/zh/sig',
    name: 'zh_all_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
  },
  {
    path: '/zh/user/:name',
    name: 'zh_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
  },
  {
    path: '/zh/user',
    name: 'zh_all_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
  },
  {
    path: '/zh/mobile',
    name: 'zh_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
  },

  {
    path: '/zh/mobile/sig/:name',
    name: 'zh_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
  },
  {
    path: '/zh/mobile/sig',
    name: 'zh_mobile_all_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
  },
  {
    path: '/zh/mobile/about',
    name: 'zh_mobile_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
  },
  {
    path: '/zh/about',
    name: 'zh_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
  },
  {
    path: '/zh/mobile/user/:name',
    name: 'zh_mobile_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
  },
  {
    path: '/zh/mobile/user',
    name: 'zh_mobile_all_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
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
    meta: { transition: 'slide-down' },
  },
  {
    path: '/en/detail',
    name: 'en_detail',
    component: () => {
      return import('@/views/contributors/Index.vue');
    },
    meta: { transition: 'slide-down' },
  },

  {
    path: '/en/sig/:name',
    name: 'en_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
  },
  {
    path: '/en/sig',
    name: 'en_all_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
  },
  {
    path: '/en/user/:name',
    name: 'en_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
  },
  {
    path: '/en/user',
    name: 'en_all_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
  },
  {
    path: '/en/mobile',
    name: 'en_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
  },

  {
    path: '/en/mobile/sig/:name',
    name: 'en_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
  },
  {
    path: '/en/mobile/sig',
    name: 'en_mobile_all_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
  },
  {
    path: '/en/about',
    name: 'en_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
  },
  {
    path: '/en/mobile/about',
    name: 'en_mobile_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
  },
  {
    path: '/en/mobile/user/:name',
    name: 'en_mobile_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
  },
  {
    path: '/en/mobile/user',
    name: 'en_mobile_all_user',
    component: () => {
      return import('@/views/mobile/person/Index.vue');
    },
  },
  {
    path: '/404',
    name: 'not_found',
    component: () => {
      return import('@/components/NotFound.vue');
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
  if (to.fullPath.startsWith('/en')) {
    commonStore.lang = 'en';
  } else {
    commonStore.lang = 'zh';
  }
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
