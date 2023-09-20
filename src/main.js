/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import i18n from './i18n';
import * as echarts from 'echarts'

const app = createApp(App);

app.use(ElementPlus).use(store).use(i18n).use(router).mount('#app')
