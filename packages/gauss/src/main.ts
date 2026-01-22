import 'shared/styles/base.scss';
import '@/shared/styles/style.scss';
import '@/shared/styles/theme.scss';
import '@/shared/styles/opendesign-style/variable.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import OIcon from 'shared/components/OIcon.vue';
import zhLang from 'element-plus/lib/locale/lang/zh-cn'; // 引入官方的中文国际化
import locale from './assets/locale/cn'; // 引入自己的
import ElementPlus from 'element-plus';
import opendesign from 'shared/components/Opendesign';
import { initOpenDesignAnalytics } from '@opendesign-plus/plugins/analytics';
import '@opendesign-plus/components/styles';

// 国际化
import i18n from './i18n';
import { reportAnalytics } from 'shared/api/api-analytics';
const app = createApp(App);
app.use(i18n);
app.use(ElementPlus, {
  locale: { ...zhLang, ...locale }, // 使用本地的 locale 去覆盖官方的 zhLang
});
app.use(router);
app.use(opendesign);
app.use(createPinia());
app.component('OIcon', OIcon);

app.use(initOpenDesignAnalytics, {
  appKey: 'openGauss',
  service: 'datastat',
  isCookieAgreed() {
    return i18n.global.locale === 'zh' ? true : document.cookie.includes('agreed-cookiepolicy-en=1');
  },
  request(data) {
    reportAnalytics('opengauss', data);
  },
});

app.mount('#app');

router.afterEach(() => {
  window.scrollTo(0, 0);
});
