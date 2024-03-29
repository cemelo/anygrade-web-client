import Vue from 'vue';
import Router from 'vue-router';

import Home from '../views/home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Home },
  ],
});
