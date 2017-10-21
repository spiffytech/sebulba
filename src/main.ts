import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';

require('material-components-web/dist/material-components-web.min.css');
const mdc = require('material-components-web');
mdc.autoInit();

import Home from './scenes/home';
import Feed from './scenes/feed';
import Playlist from './scenes/playlist/playlist';
import store from './store';

Vue.use(VueRouter);

// window.sqlitePlugin.openDatabase({name: 'podcast.db', location: 'default'});

// Handle either the browser or PhoneGap's file:// URLs
const base =
  document.location.pathname === '/android_asset/www/index.html' ?
  '/android_asset/www/' :
  '/';

let router = new VueRouter({
  base,
  routes: [
    { path: '/index.html', component: Home },  // PhoneGap app
    { path: '/', component: Home },  // Browser
    { path: '/feed/:id', component: Feed, name: 'feed', props: true },
    { path: '/playlist', component: Playlist, name: 'playlist', props: true },
    { path: '/now-playing', component: Home, name: 'nowPlaying', props: true },
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
