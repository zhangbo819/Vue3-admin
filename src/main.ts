import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as echarts from 'echarts';
import vConsole from 'vconsole'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const vconsole = new vConsole()

console.log('main in')

const AppBase = createApp(App);
AppBase.config.globalProperties.echarts = echarts;
AppBase
  .use(router)
  .use(ElementPlus)
  .use(vconsole as any)
  .mount('#app');
