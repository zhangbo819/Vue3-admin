import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as echarts from 'echarts';
import vConsole from 'vconsole'

const vconsole = new vConsole()

console.log('main in')

const AppBase = createApp(App);
AppBase.config.globalProperties.echarts = echarts;
AppBase
  .use(router)
  .use(vconsole as any)
  .mount('#app');
