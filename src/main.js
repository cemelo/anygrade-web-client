import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';

import Auth from './api/auth';
import Phoenix from './components/phoenix';

import App from './App.vue';

Vue.use(Auth);
Vue.use(Phoenix);

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router);

// Auth
const auth = new Auth();

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
  auth,
  router,
  store,

  phoenix: new Phoenix(),
  ...App, // Object spread copying everything from App.vue
});

// expose the app, the router and the store.
// note we not mounting the app here, since bootstrapping will be
// different depending on whether we are in browser or on the server.
export { app, auth, router, store };
