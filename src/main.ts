import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';

require('material-components-web/dist/material-components-web.min.css');
import * as mdc from 'material-components-web';
mdc.autoInit();

import Home from './scenes/home';
import store from './store';

Vue.use(VueRouter);

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

sync(store, router);

(window as any).store = store;

new Vue({
  el: '#app-main',
  router: router,
  store,
  components: {home: Home}
});
