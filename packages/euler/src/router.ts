import { createRouter, createWebHistory } from 'vue-router';
import { useCommonStore } from './stores/common';
import { querySigInfo, queryUserList } from 'shared/api';
import { isTest } from 'shared/utils/helper';
export const routes = [
  { path: '/', redirect: '/zh/overview' },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
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
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/zh/company',
    name: 'zh_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
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
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
        sig: name,
      };
      querySigInfo(params).then((data) => {
        if (data.data.length === 0) {
          next('/404');
        } else {
          next();
        }
      });
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
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
      };
      queryUserList(params).then((data) => {
        if (data.data.toString().toLowerCase().includes(name.toLowerCase())) {
          next();
        } else {
          next('/404');
        }
      });
    },
  },
  {
    path: '/zh/user',
    name: 'zh_all_user',
    component: () => {
      return import('@/views/person/index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
      };
      queryUserList(params).then((data) => {
        if (data.data.toString().toLowerCase().includes(name.toLowerCase())) {
          next();
        } else {
          next('/404');
        }
      });
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
    path: '/zh/mobile/company/:name',
    name: 'zh_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/zh/mobile/company',
    name: 'zh_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/zh/mobile/sig/:name',
    name: 'zh_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
        sig: name,
      };
      querySigInfo(params).then((data) => {
        if (data.data.length === 0) {
          next('/404');
        } else {
          next();
        }
      });
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
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
      };
      queryUserList(params).then((data) => {
        if (data.data.toString().toLowerCase().includes(name.toLowerCase())) {
          next();
        } else {
          next('/404');
        }
      });
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
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/en/company',
    name: 'en_all_company',
    component: () => {
      return import('@/views/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/en/sig/:name',
    name: 'en_sig',
    component: () => {
      return import('@/views/sig/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
        sig: name,
      };
      querySigInfo(params).then((data) => {
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
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
      };
      queryUserList(params).then((data) => {
        if (data.data.toString().toLowerCase().includes(name.toLowerCase())) {
          next();
        } else {
          next('/404');
        }
      });
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
    path: '/en/mobile/company/:name',
    name: 'en_mobile_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/en/mobile/company',
    name: 'en_mobile_all_company',
    component: () => {
      return import('@/views/mobile/company/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      if (isTest()) {
        next();
      }else {
        next('/404');
      }
    },
  },
  {
    path: '/en/mobile/sig/:name',
    name: 'en_mobile_sig',
    component: () => {
      return import('@/views/mobile/sig/Index.vue');
    },
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
        sig: name,
      };
      querySigInfo(params).then((data) => {
        if (data.data.length === 0) {
          next('/404');
        } else {
          next();
        }
      });
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
    beforeEnter: (to: any, from: any, next: any) => {
      const name = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1,
        window.location.href.length
      );
      const params = {
        community: 'openeuler',
      };
      queryUserList(params).then((data) => {
        if (data.data.toString().toLowerCase().includes(name.toLowerCase())) {
          next();
        } else {
          next('/404');
        }
      });
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
  if (!to.fullPath.includes('en')) {
    commonStore.lang = 'zh';
  } else {
    commonStore.lang = 'en';
  }
});
