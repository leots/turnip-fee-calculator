import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import router from './router';

import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(HighchartsVue);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
