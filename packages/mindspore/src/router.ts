import { testIsPhone } from 'shared/utils/helper';
import { createRouter, createWebHistory } from 'vue-router';
import { useCommonStore } from './stores/common';
import i18n from './i18n';

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
    meta: { transition: 'slide-down' },
  },
  {
    path: '/zh/mobile',
    name: 'zh_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
  },
  {
    path: '/zh/about',
    name: 'zh_about',
    component: () => {
      return import('@/views/about/Index.vue');
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
  },
  {
    path: '/en/mobile',
    name: 'en_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
  },
  {
    path: '/en/about',
    name: 'en_about',
    component: () => {
      return import('@/views/about/Index.vue');
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置语言
router.beforeEach((to) => {
  const lang = to.fullPath.startsWith('/en') ? 'en' : 'zh';
  if (i18n.global.locale.value !== lang) {
    i18n.global.locale.value = lang;
  }
  localStorage.setItem('lang', lang);
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
