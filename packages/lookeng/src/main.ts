import 'shared/styles/base.scss';
import '@/shared/styles/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import OIcon from 'shared/components/OIcon.vue';

// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';

// 国际化
import i18n from './i18n';
const app = createApp(App);
app.use(i18n);

app.use(router);
app.use(createPinia());
// app.use(ElementPlus);
app.component('OIcon', OIcon);

app.mount('#app');

router.afterEach(() => {
  window.scrollTo(0, 0);
});
