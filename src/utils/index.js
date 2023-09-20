/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import errorHandlder from './errorHandler';
import formatters from './formatters';
import validations from './validations';
const app = createApp(App)
export default {
  install(app) {
    app.use(errorHandlder);
    app.use(formatters);
    app.use(validations);
  },
};
