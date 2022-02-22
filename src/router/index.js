import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/overview' },
    {
      path: '/overview',
      component: () => {
        return import('@/views/OverView.vue');
      },
    },
    {
      path: '/contributors',
      component: () => {
        return import('@/views/Contributors.vue');
      },
    },
    {
      path: '/partnerships',
      component: () => {
        return import('@/views/Partnerships.vue');
      },
    },
  ],
});

export default router;
