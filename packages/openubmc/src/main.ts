import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import '@opensig/opendesign/es/index.css';
import i18n from './i18n';

import 'shared/styles/base.scss';
import 'shared/styles/index.scss';
import '@/assets/style/theme/default-light.token.css';
import '@/assets/style/theme/dark.token.css';
import { installer } from './shared/analytics';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(installer, {
  appKey: 'openUBMC',
  request: '/api-dsapi/query/track/openubmc',
});

app.mount('#app');
