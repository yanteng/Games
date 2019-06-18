import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router.js';
import App from './app.vue';

Vue.use(VueRouter);

new Vue({
  router,
  render: createElement => createElement(App),
}).$mount(document.querySelector('#app'));
