import Vue from 'vue';
import App from './App.vue';
import router from './router';

ODI.log.setup({ id: 'odileeds' });
ODI.log.add('action=view');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
