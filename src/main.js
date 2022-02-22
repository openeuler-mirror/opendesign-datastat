import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'virtual:svg-icons-register';

import 'normalize.css/normalize.css';
import './styles/base.scss';

import SvgIcon from '@/components/SvgIcon.vue';
import ChartView from '@/components/Chart.vue';

const app = createApp(App);

app.component('SvgIcon', SvgIcon);
app.component('ChartView', ChartView);

app.use(router).use(store).mount('#app');
