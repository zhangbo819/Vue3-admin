import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as echarts from 'echarts';

const AppBase = createApp(App);
AppBase.config.globalProperties.echarts = echarts;
AppBase.use(router).mount('#app');
