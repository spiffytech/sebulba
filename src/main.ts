import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';

import Home from './scenes/home';
import mkStore from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

// window.sqlitePlugin.openDatabase({name: 'podcast.db', location: 'default'});

// Handle either the browser or PhoneGap's file:// URLs
const base =
  document.location.pathname === '/android_asset/www/index.html' ?
  '/android_asset/www/' :
  '/';
let router = new VueRouter({
  mode: 'history',
  base,
  routes: [
    { path: '/index.html', component: Home },  // PhoneGap app
    { path: '/', component: Home },  // Browser
  ]
});

const store = mkStore();
sync(store, router);

(window as any).store = store;

new Vue({
  el: '#app-main',
  router: router,
  store,
  components: {home: Home}
});
