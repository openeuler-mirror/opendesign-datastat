import { createRouter, createWebHistory, NavigationGuardWithThis, RouteRecordRaw } from 'vue-router';
import { useCommonStore } from './stores/common';
import { querySigInfo } from 'shared/api';
import { queryUserList } from 'shared/api/api-new';
import { testIsPhone } from 'shared/utils/helper';
import { usePersonalStore } from './stores/personal';
import i18n from './i18n';
import { getSigInfo } from './api';

const beforeEnterUserDetail: NavigationGuardWithThis<undefined> = async (to, _, next) => {
  if (!to.params.name) {
    return next('/404');
  }
  const users = (usePersonalStore().allUsers ??= await queryUserList({ community: 'openeuler' })
    .then((res) => Object.keys(res.data).reduce((map, name, index) => map.set(name, index), new Map<string, number>()))
    .catch(() => new Map<string, number>()));
  if (users.has(to.params.name as string)) {
    next();
  } else {
    next('/404');
  }
};

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect() {
      if (location.hostname.endsWith('openeuler.org')) {
        return '/en/overview';
      }
      return '/zh/overview';
    },
  },
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
    path: '/zh/company/:name',
    name: 'zh_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
  },
  {
    path: '/zh/company',
    name: 'zh_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => {
      return import('@/views/contributors/404.vue');
    },
  },
  {
    path: '/zh/sig/:name',
    name: 'zh_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: async (to) => {
      try {
        const res = await getSigInfo(to.params.name as string);
        if (!res.data) {
          return '/404';
        }
        to.meta.sigInfo = res.data;
      } catch (error) {
        return '/404';
      }
    },
  },
  {
    path: '/zh/sig',
    name: 'zh_all_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    }
  },
  {
    path: '/zh/user/:name',
    name: 'zh_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
    beforeEnter: beforeEnterUserDetail,
  },
  {
    path: '/zh/mobile',
    name: 'zh_mobile',
    component: () => {
      return import('@/views/mobile/Index.vue');
    },
  },
  {
    path: '/zh/mobile/company/:name',
    name: 'zh_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
  },
  {
    path: '/zh/mobile/company',
    name: 'zh_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
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
    path: '/en/company/:name',
    name: 'en_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
  },
  {
    path: '/en/company',
    name: 'en_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
  },
  {
    path: '/en/sig/:name',
    name: 'en_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: (to, from, next) => {
      querySigInfo({ community: 'openeuler', sig: to.params.name }).then((data) => {
        if (data.data.length === 0) {
          next('/404');
        } else {
          next();
        }
      });
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
    beforeEnter: beforeEnterUserDetail,
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
    path: '/en/mobile/company/:name',
    name: 'en_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
  },
  {
    path: '/en/mobile/company',
    name: 'en_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置语言
router.beforeEach((to) => {
  const commonStore = useCommonStore();
  const lang = to.fullPath.startsWith('/en') ? 'en' : 'zh';
  commonStore.lang = lang;
  if (i18n.global.locale !== lang) {
    i18n.global.locale = lang;
  }
});

// 首次进入判断移动端
const cancel = router.beforeEach((to) => {
  cancel();
  const isPhone = testIsPhone();
  const useCommon = useCommonStore();
  useCommon.setDevice(!isPhone);
  if (to.path.endsWith('/overview') && !to.path.includes('/mobile') && isPhone) {
    const path = useCommon.language === 'zh' ? '/zh/mobile' : '/en/mobile';
    return { path };
  }
});
