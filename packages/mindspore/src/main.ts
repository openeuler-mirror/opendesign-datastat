import 'shared/styles/base.scss';
import '@/shared/styles/style.scss';
import '@/shared/styles/theme.scss';
import '@/shared/styles/opendesign-styles/variable.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import OIcon from 'shared/components/OIcon.vue';
import opendesign from 'shared/components/Opendesign';
// 国际化
import i18n from './i18n';
import { initOpenDesignAnalytics } from '@opendesign-plus/plugins/analytics';
import '@opendesign-plus/components/styles';
import { reportAnalytics } from 'shared/api/api-analytics';
const app = createApp(App);
app.use(i18n);

app.use(router);
app.use(createPinia());
app.use(opendesign);
app.component('OIcon', OIcon);

app.use(initOpenDesignAnalytics, {
  appKey: 'MindSpore',
  service: 'datastat',
  isCookieAgreed() {
    return i18n.global.locale === 'zh' ? true : document.cookie.includes('agreed-cookiepolicy-en=1');
  },
  request(data) {
    reportAnalytics('mindspore', data);
  },
});

app.mount('#app');

router.afterEach(() => {
  window.scrollTo(0, 0);
});
