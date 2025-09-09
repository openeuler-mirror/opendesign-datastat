import i18n from '@/i18n';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:lang(zh|en)',
      children: [
        {
          path: '',
          redirect() {
            return `/${i18n.global.locale.value ?? 'zh'}/overview`;
          },
        },
        {
          path: 'overview',
          name: 'overview',
          component: () => import('@/views/overview/Index.vue'),
          beforeEnter(to, from) {
            if (from.name === 'detail') {
              to.meta.transition = 'slide-up';
            }
          },
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/detail/Index.vue'),
          beforeEnter(to, from) {
            if (from.name === 'overview') {
              to.meta.transition = 'slide-down';
            }
          },
        },
        {
          path: 'sig/:id',
          name: 'sig-detail',
          component: () => import('@/views/sig/Index.vue'),
        },
        {
          path: 'user/:id',
          name: 'user-detail',
          component: () => import('@/views/user/Index.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/zh/overview' }
  ],
});

router.beforeEach((to) => {
  if (to.fullPath.startsWith('/en')) {
    return to.fullPath.replace(/^\/en/, '/zh');
  }
});

export default router;
